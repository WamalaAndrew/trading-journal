import { useState, useEffect } from 'react';
import { Trade } from './types';
import { db, auth } from './firebase';
import { collection, query, where, orderBy, onSnapshot, doc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

export function useTrades() {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    if (!auth.currentUser) return;
    
    const q = query(
      collection(db, 'trades'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tradesData: Trade[] = [];
      snapshot.forEach((doc) => {
        tradesData.push({ id: doc.id, ...doc.data() } as Trade);
      });
      setTrades(tradesData);
    }, (error) => {
      console.error("Firestore onSnapshot Error:", error);
    });

    return () => unsubscribe();
  }, []);

  const addTrade = async (trade: Omit<Trade, 'id' | 'userId' | 'createdAt'>) => {
    if (!auth.currentUser) throw new Error("User must be logged in to add a trade");
    const newTradeId = crypto.randomUUID();
    const tradeRef = doc(db, 'trades', newTradeId);
    
    try {
      await setDoc(tradeRef, {
        ...trade,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.error("Error creating trade: ", e);
      throw e;
    }
  };

  const deleteTrade = async (id: string) => {
    if (!auth.currentUser) return;
    const tradeRef = doc(db, 'trades', id);
    await deleteDoc(tradeRef);
  };

  const updateTrade = async (id: string, updates: Partial<Trade>) => {
    if (!auth.currentUser) return;
    const tradeRef = doc(db, 'trades', id);
    await updateDoc(tradeRef, updates);
  };

  return { trades, addTrade, deleteTrade, updateTrade };
}
