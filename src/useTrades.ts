import { useState, useEffect } from 'react';
import { Trade } from './types';
import { db, auth } from './firebase';
import { collection, query, where, orderBy, onSnapshot, doc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

export function useTrades() {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    let unsubscribeSnapshot: () => void = () => {};

    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      if (user) {
        const q = query(
          collection(db, 'trades'),
          where('userId', '==', user.uid)
        );

        unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const tradesData: Trade[] = [];
          snapshot.forEach((doc) => {
            tradesData.push({ id: doc.id, ...doc.data() } as Trade);
          });
          
          // Sort by dateTime or createdAt descending since we removed orderBy to avoid index requirement
          tradesData.sort((a, b) => {
            const dateA = a.dateTime ? new Date(a.dateTime).getTime() : 0;
            const dateB = b.dateTime ? new Date(b.dateTime).getTime() : 0;
            return dateB - dateA;
          });
          
          setTrades(tradesData);
        }, (error) => {
          console.error("Firestore onSnapshot Error:", error);
        });
      } else {
        setTrades([]);
        unsubscribeSnapshot();
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeSnapshot();
    };
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

  const updateTrade = async (id: string, tradeUpdates: Partial<Omit<Trade, 'id' | 'userId' | 'createdAt'>>) => {
    if (!auth.currentUser) throw new Error("User must be logged in to update a trade");
    const tradeRef = doc(db, 'trades', id);
    
    try {
      await updateDoc(tradeRef, tradeUpdates);
    } catch (e) {
      console.error("Error updating trade: ", e);
      throw e;
    }
  };

  const deleteTrade = async (id: string) => {
    if (!auth.currentUser) return;
    const tradeRef = doc(db, 'trades', id);
    await deleteDoc(tradeRef);
  };

  return { trades, addTrade, deleteTrade, updateTrade };
}
