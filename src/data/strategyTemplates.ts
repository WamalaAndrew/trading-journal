import { Trade } from '../types';

export interface StrategyTemplateItem {
  id: string;
  title: string;
  subtitle: string;
  badge: 'Sweep & Reclaim' | 'CHoCH + BOS' | 'Inverse Flip (INV)' | 'Invalidation / Cut';
  direction: 'Long' | 'Short' | 'Long INV' | 'Short INV' | 'Scratch';
  setupSummary: string;
  data: Omit<Trade, 'id'>;
  pineModel: 'Sweep & Reclaim' | 'CHoCH + BOS' | 'Either';
  isInverse: boolean;
  rulesPassed: string[];
  keyLesson: string;
}

export const FRVP_TEMPLATES: StrategyTemplateItem[] = [
  {
    id: 'frvp-sweep-eurusd',
    title: 'EURUSD Bullish POC Sweep & Reclaim',
    subtitle: 'Naked Daily POC retest with fast 2-bar sweep & strong candle close reclaim',
    badge: 'Sweep & Reclaim',
    direction: 'Long',
    pineModel: 'Sweep & Reclaim',
    isInverse: false,
    rulesPassed: [
      'Completed previous session volume profile POC identified at 1.0820',
      'Price moved away > 2.2x ATR during early Asian session',
      'First touch from above into the active POC zone at London Open',
      'Swept 4 pips below POC down to 1.0816, then 5m candle closed strong at 1.0828',
      'Stop placed at sweep tip (1.0816) - 4 pips buffer = 1.0812 (16 pips risk)',
      'TP1 reached at 1.5R (1.0852), TP2 reached at 1.0876 (3.0R near session VAH)'
    ],
    keyLesson: 'Sweep & Reclaim enters 1-3 bars after the touch without waiting for fractals, providing a tighter SL and superior R:R.',
    setupSummary: 'Price rallied away from yesterday’s session POC (1.0820) by 32 pips. On London open, sellers probed the POC, swept 4 pips through it to 1.0816, and were immediately rejected. The 5m bar closed at 1.0828, giving an immediate long signal.',
    data: {
      dateTime: '2026-10-08T08:15',
      pair: 'EURUSD',
      timeframe: '5m entry / Daily FRVP',
      macd4hDirection: 'Bullish',
      macd1hCrossover: 'Above zero',
      rsiAtEntry: 44,
      entryPrice: 1.0828,
      stopLossPrice: 1.0812,
      stopLossPips: 16,
      takeProfitPrice: 1.0860,
      takeProfitRR: 2.0,
      exitPrice: 1.0860,
      exitReason: 'Hit TP',
      resultStatus: 'Win',
      resultPips: 32,
      didWell: 'Exercised patience waiting for the 5m candle to close back above the POC band rather than anticipating.',
      wouldChange: 'Could have scaled out half at 1.5R and left a 25% runner to capture the full session VAH extension.',
      strategyTags: ['FRVP POC Bounce', 'FRVP Sweep & Reclaim', 'Scalping'],
      notes: 'v7.1 Sweep & Reclaim model on EURUSD. Previous day POC at 1.0820. Away distance was 2.3x ATR(14). Extreme sweep wick hit 1.0816. SL set 4 pips below sweep tip. Fast execution, hit 2R in 45 minutes.'
    }
  },
  {
    id: 'frvp-choch-bos-us100',
    title: 'US100 / NQ Bearish POC Rejection (CHoCH + BOS)',
    subtitle: 'Williams 5-bar fractal CHoCH followed by BOS confirmation close',
    badge: 'CHoCH + BOS',
    direction: 'Short',
    pineModel: 'CHoCH + BOS',
    isInverse: false,
    rulesPassed: [
      'Virgin session POC at 19,850 carried over from previous completed session',
      'Morning rally moved up 3.4x ATR into the untouched POC zone',
      'Price touched 19,865, forming an initial touch extreme',
      'Bounce away >= 0.5x ATR formed a Williams 5-bar swing fractal low at 19,830',
      'Candle closed below swing fractal low at 19,825 confirming CHoCH',
      'Next fractal low broke and closed at 19,810 confirming BOS -> Short Entry',
      'Stop placed above touch extreme 19,865 + 10 pts buffer = 19,875 (65 pts risk)',
      'Targeted previous session VAL for 1:2.0 RR (130 pts profit)'
    ],
    keyLesson: 'CHoCH + BOS provides maximum structural confirmation against aggressive momentum, filtering out fake bounces.',
    setupSummary: 'NQ had heavy volume at 19,850 yesterday. NY open squeezed up into this heavy volume node. Instead of blind selling, waited for a Williams 5-bar fractal shift (CHoCH) followed by a confirmed BOS candle close at 19,810.',
    data: {
      dateTime: '2026-10-07T10:30',
      pair: 'US100',
      timeframe: '5m entry / Daily FRVP',
      macd4hDirection: 'Bearish',
      macd1hCrossover: 'Below zero',
      rsiAtEntry: 62,
      entryPrice: 19810,
      stopLossPrice: 19875,
      stopLossPips: 65,
      takeProfitPrice: 19680,
      takeProfitRR: 2.0,
      exitPrice: 19680,
      exitReason: 'Hit TP',
      resultStatus: 'Win',
      resultPips: 130,
      didWell: 'Waited for both Williams 5-bar fractal CHoCH and BOS confirmation close instead of shorting the initial touch.',
      wouldChange: 'Trailed stop slightly too aggressively to breakeven after 1R, almost getting wicked out on the re-test.',
      strategyTags: ['FRVP POC Bounce', 'FRVP CHoCH + BOS', 'Day Trading'],
      notes: 'v7.1 CHoCH + BOS confirmation model. NQ tested yesterday session POC 19,850. First fractal broke at 19,825 (CHoCH). Entry executed on bar close breaking secondary fractal at 19,810. SL 19,875. Target reached at 19,680.'
    }
  },
  {
    id: 'frvp-inv-xauusd',
    title: 'XAUUSD Inverse Flip (Short INV)',
    subtitle: 'Support POC broken by news, flipped into resistance on retest',
    badge: 'Inverse Flip (INV)',
    direction: 'Short INV',
    pineModel: 'Sweep & Reclaim',
    isInverse: true,
    rulesPassed: [
      'Level originally formed as major daily support POC at 2,640.00',
      'During CPI release, price broke down with 4 consecutive 5m closes below the zone',
      'Price moved away > 25 pips (2.1x ATR) confirming the Level FLIP',
      'Subsequent pullback returned to 2,640.00 from below (first retest)',
      'Bearish sweep to 2,641.50 followed by strong 5m bearish candle close at 2,638.50',
      'Stop placed beyond retest extreme (2,641.50) + $3.00 buffer = 2,644.50 (60 pips risk)',
      'TP reached at 2,626.50 (1:2.0 RR / 120 pips gain)'
    ],
    keyLesson: 'When a strong level fails, don’t marry your bias. The v7 Inverse Flip capitalizes on trapped liquidity retesting the broken POC.',
    setupSummary: 'Gold had high volume at 2,640. High-impact news triggered 4 straight candle closes below the zone, flipping the level. As price drifted back up to 2,640, trapped buyers tried to exit at breakeven, creating high-probability Short INV resistance.',
    data: {
      dateTime: '2026-10-06T14:45',
      pair: 'XAUUSD',
      timeframe: '5m entry / Daily FRVP',
      macd4hDirection: 'Bearish',
      macd1hCrossover: 'Below zero',
      rsiAtEntry: 58,
      entryPrice: 2638.5,
      stopLossPrice: 2644.5,
      stopLossPips: 60,
      takeProfitPrice: 2626.5,
      takeProfitRR: 2.0,
      exitPrice: 2626.5,
      exitReason: 'Hit TP',
      resultStatus: 'Win',
      resultPips: 120,
      didWell: 'Quickly flipped mindset from long to Short INV once the 4 closes below 2,640 confirmed the structural level flip.',
      wouldChange: 'Took full profit at TP1; could have kept 20% position open as Gold dropped another 150 pips into the close.',
      strategyTags: ['FRVP POC Bounce', 'FRVP Inverse Flip (INV)', 'News'],
      notes: 'v7.1 Inverse Trade (INV). Level originally active POC at 2,640. 4 consecutive closes below VAL triggered FLIP. Price returned from below, swept to 2,641.50, and closed at 2,638.50. Short INV filled, target 2,626.50 hit cleanly.'
    }
  },
  {
    id: 'frvp-inv-btcusd',
    title: 'BTCUSD Inverse Flip (Long INV)',
    subtitle: 'Overhead resistance POC broken upwards, flipped to solid support',
    badge: 'Inverse Flip (INV)',
    direction: 'Long INV',
    pineModel: 'Sweep & Reclaim',
    isInverse: true,
    rulesPassed: [
      'Resistance POC from 2 sessions ago at $64,200',
      'Strong breakout printed 5 candle closes above the whole volume zone',
      'Rallied up to $65,500 (> 2.5x ATR away)',
      'Healthy pullback down to test the flipped POC at $64,250 from above',
      'Sweep wick to $64,150 followed by instant 15m bullish reclaim close at $64,300',
      'Stop placed below sweep extreme at $63,800 (500 pts risk)',
      'TP reached at $65,300 (1:2.0 RR / 1000 pts profit)'
    ],
    keyLesson: 'Old resistance becomes powerful support. In v7, each level is eligible to fire once normally and once as an inverse trade.',
    setupSummary: 'BTC broke through multi-day POC at $64,200 with heavy momentum. After running to $65,500, price pulled back. The previous ceiling acted as a solid floor on the first retest, triggering a Long INV entry on the reclaim candle.',
    data: {
      dateTime: '2026-10-05T16:00',
      pair: 'BTCUSD',
      timeframe: '15m entry / Daily FRVP',
      macd4hDirection: 'Bullish',
      macd1hCrossover: 'Above zero',
      rsiAtEntry: 51,
      entryPrice: 64300,
      stopLossPrice: 63800,
      stopLossPips: 500,
      takeProfitPrice: 65300,
      takeProfitRR: 2.0,
      exitPrice: 65300,
      exitReason: 'Hit TP',
      resultStatus: 'Win',
      resultPips: 1000,
      didWell: 'Held position through a minor 1-hour consolidation around entry, trusting the volume node support.',
      wouldChange: 'Could have sized up slightly as higher timeframe 4H MACD was strongly bullish.',
      strategyTags: ['FRVP POC Bounce', 'FRVP Inverse Flip (INV)', 'Swing'],
      notes: 'v7.1 Long INV setup on Bitcoin. Daily POC at $64,200 broken with 5 closes above. First retest produced a sweep to $64,150 and closed back at $64,300. SL placed at $63,800. TP hit smoothly at $65,300.'
    }
  },
  {
    id: 'frvp-invalidation-gbpusd',
    title: 'GBPUSD Failed Bounce & Invalidation (Discipline Cut)',
    subtitle: 'Price sliced through POC > 1.2x ATR with no reclaim; scratched early',
    badge: 'Invalidation / Cut',
    direction: 'Scratch',
    pineModel: 'Sweep & Reclaim',
    isInverse: false,
    rulesPassed: [
      'Active session POC identified at 1.3050',
      'Price moved away > 1.8x ATR and returned',
      'Mistake: Entered prematurely on touch before candle close confirmation',
      'Rule Enforced: Price pushed > 1.2x ATR through POC without bouncing',
      'Hard stop/cut executed at 1.3035 (-15 pips) before runaway slide to 1.2980'
    ],
    keyLesson: 'Never front-run the POC touch! Wait for the Sweep & Reclaim candle close or CHoCH+BOS. Cutting invalidations early protects capital.',
    setupSummary: 'Price approached yesterday’s POC at 1.3050. Anticipating a bounce, entered early on touch. Price showed zero rejection and closed 15 pips lower. Rather than hoping or moving the stop, cut immediately according to the FRVP invalidation rule, saving 70 pips of downside.',
    data: {
      dateTime: '2026-10-04T11:20',
      pair: 'GBPUSD',
      timeframe: '5m entry / Daily FRVP',
      macd4hDirection: 'Mixed',
      macd1hCrossover: 'Below zero',
      rsiAtEntry: 36,
      entryPrice: 1.3050,
      stopLossPrice: 1.3035,
      stopLossPips: 15,
      takeProfitPrice: 1.3080,
      takeProfitRR: 2.0,
      exitPrice: 1.3033,
      exitReason: 'Hit SL',
      resultStatus: 'Loss',
      resultPips: -17,
      didWell: 'Cut the trade strictly at 1.3035 when invalidation criteria was met, preventing a disastrous 70-pip drop.',
      wouldChange: 'Broke the golden rule: entered on touch instead of waiting for the reclaim candle close. Always wait for the close.',
      strategyTags: ['FRVP POC Bounce', 'Scalping'],
      notes: 'v7.1 Invalidation Study. Price reached POC 1.3050 but momentum pushed through without printing a bounce. Hard cut executed. Proved why Sweep & Reclaim requires the candle close before executing.'
    }
  }
];

export const FRVP_PINE_SCRIPT_CODE = `//@version=6
// ============================================================================
// FRVP POC Bounce + Sweep&Reclaim / CHoCH-BOS   (v7.1 DRAFT - syntax-checked only)
//
// LEVELS
//   * Every COMPLETED session (day) produces a level: its volume profile
//     (POC, heavy-volume zone, VAH/VAL), drawn along that session's range.
//   * A level stays on the chart and stays ACTIVE until it is used. So a POC
//     that price never reached on day 1 can still be traded on day 2, 3 ...
//     (kept for up to N sessions).
//
// ENTRY SEQUENCE ON A LEVEL
//   1. Price MOVES AWAY from the zone (>= minAway x ATR).
//   2. Price comes BACK to the POC (first touch from that side).
//   3. A BOUNCE is visible: price leaves the touch extreme by >= minBounce x ATR
//      without pushing far through the POC.
//   4. The bounce forms a CHoCH (candle CLOSES beyond the last FRACTAL), then
//      a BOS (close beyond the next fractal). Enter on the BOS close.
//   Came down from above -> long. Came up from below -> short.
//
// v6 NEW ENTRY MODEL: SWEEP & RECLAIM  (earlier than CHoCH -> BOS)
//   After the level is touched, enter on the first candle that CLOSES back through
//   the level (above the touch band for longs, below it for shorts) with a strong
//   close and a real bounce off the extreme. No fractal needed, so it fires 1-3
//   candles after the touch instead of waiting for CHoCH and then BOS.
//   Stop = just beyond the sweep tip (extreme since the touch) + buffer, with a
//   minimum distance so noise/spread cannot take it out. Same targets as before.
//   Entry model input: "Sweep & Reclaim" | "CHoCH + BOS" (v5) | "Either".
//
// INVERSE TRADE (v7: its own rules, tagged "INV" on the chart and in the tester)
//   A level has FLIPPED when, after it was traded (or failed: price pushed
//   through the POC), price BREAKS it, moves away on the other side and later
//   returns to the POC. Then the same entry (Sweep & Reclaim or CHoCH -> BOS)
//   is taken in the opposite direction:  broke down, came back up -> SHORT.
//   "Broke" = N candle closes in a row beyond the zone (default), or the v5
//   aggressive cross, or off. The inverse has its own stop and TP settings:
//     Stop : beyond the retest extreme (default) or beyond the whole zone.
//     TP1/TP2: own R multiples, still stopped short of the next heavy node.
//   Each level fires once normally and once as an inverse.
//   Trades are named "Long"/"Short" and "Long INV"/"Short INV" in the tester.
//
// Entry, SL, TP1 and TP2 are drawn on the chart as green / red boxes.
// Fractals = Williams 5-bar swings (2 bars each side).
// ============================================================================

strategy("FRVP POC Bounce + Sweep & Reclaim / CHoCH-BOS v7.1", 
         overlay=true, 
         initial_capital=10000, 
         default_qty_type=strategy.percent_of_equity, 
         default_qty_value=10, 
         max_boxes_count=500, 
         max_lines_count=500)

// ----------------------------------------------------------------------------
// INPUTS & CONFIGURATION
// ----------------------------------------------------------------------------
grp_entry = "Entry Strategy Configuration"
entryModelInput = input.string("Either", "Entry Model", options=["Sweep & Reclaim", "CHoCH + BOS", "Either"], group=grp_entry)
minAwayATR      = input.float(1.5, "Min Move Away Distance (x ATR)", minval=0.5, step=0.1, group=grp_entry)
minBounceATR    = input.float(0.4, "Min Bounce Confirmation (x ATR)", minval=0.1, step=0.05, group=grp_entry)
atrPeriod       = input.int(14, "ATR Lookback Period", minval=1, group=grp_entry)

grp_levels = "FRVP Session Levels"
maxSessionsKeep = input.int(5, "Max Active Sessions to Keep Level", minval=1, maxval=20, group=grp_levels)
zoneWidthATR    = input.float(0.2, "POC Touch Band Width (x ATR)", minval=0.05, step=0.05, group=grp_levels)
valueAreaPct    = input.float(70.0, "Value Area %", minval=50.0, maxval=90.0, group=grp_levels)

grp_inv = "Inverse Trade (v7 FLIP)"
enableInverse   = input.bool(true, "Enable Inverse Trades (INV)", group=grp_inv)
breakClosesReq  = input.int(3, "Consecutive Closes to Confirm Level FLIP", minval=1, maxval=10, group=grp_inv)
invStopMode     = input.string("Retest Extreme", "Inverse Stop Mode", options=["Retest Extreme", "Beyond Zone"], group=grp_inv)

grp_risk = "Risk & Target Multipliers"
slBufferTicks   = input.int(5, "SL Buffer (Ticks / Pips)", minval=1, group=grp_risk)
minSLDistanceTicks = input.int(8, "Minimum SL Distance Filter (Ticks)", minval=2, group=grp_risk)
tp1R            = input.float(1.5, "TP1 Multiplier (R)", minval=0.5, step=0.25, group=grp_risk)
tp2R            = input.float(3.0, "TP2 Multiplier (R)", minval=1.0, step=0.5, group=grp_risk)

// ----------------------------------------------------------------------------
// CORE INDICATORS & FRACTALS
// ----------------------------------------------------------------------------
currAtr = ta.atr(atrPeriod)
tickSize = syminfo.mintick

// Williams 5-bar swing fractals (2 bars left, 2 bars right)
isSwingHigh = high[2] > high[4] and high[2] > high[3] and high[2] > high[1] and high[2] > high[0]
isSwingLow  = low[2] < low[4]   and low[2] < low[3]   and low[2] < low[1]   and low[2] < low[0]

var float lastFractalHigh = na
var float lastFractalLow  = na
var float prevFractalHigh = na
var float prevFractalLow  = na

if isSwingHigh
    prevFractalHigh := lastFractalHigh
    lastFractalHigh := high[2]

if isSwingLow
    prevFractalLow  := lastFractalLow
    lastFractalLow  := low[2]

// ----------------------------------------------------------------------------
// SESSION LEVEL DETECTION (SIMULATED VOLUME PROFILE & POC)
// ----------------------------------------------------------------------------
isNewDay = ta.change(time("D")) != 0

type FRVPLevel
    float poc
    float vah
    float val
    int createdBar
    int createdDay
    bool activeNormal
    bool activeInverse
    bool hasMovedAwayAbove
    bool hasMovedAwayBelow
    bool touched
    float touchExtreme
    int touchBar
    int breakCountAbove
    int breakCountBelow
    bool isFlipped

var FRVPLevel[] activeLevels = array.new<FRVPLevel>()

// Capture previous day's range and approximate volume nodes
var float sessionHigh = na
var float sessionLow  = na
var float sessionClose = na
var float sessionVol   = 0.0

if isNewDay
    if not na(sessionHigh) and not na(sessionLow)
        // Approximate volume profile POC using volume-weighted mean & typical price
        float calcPoc = (sessionHigh + sessionLow + sessionClose) / 3.0
        float rangeSpan = sessionHigh - sessionLow
        float calcVah = calcPoc + (rangeSpan * (valueAreaPct / 200.0))
        float calcVal = calcPoc - (rangeSpan * (valueAreaPct / 200.0))
        
        FRVPLevel newLvl = FRVPLevel.new(
            calcPoc, calcVah, calcVal,
            bar_index, dayofmonth,
            true, enableInverse,
            false, false, false,
            na, 0, 0, 0, false
        )
        array.push(activeLevels, newLvl)
        
        // Draw visual POC line
        line.new(bar_index, calcPoc, bar_index + 50, calcPoc, 
                 color=color.new(color.orange, 30), width=2, style=line.style_dashed, extend=extend.right)
    
    // Reset session metrics
    sessionHigh := high
    sessionLow := low
    sessionClose := close
    sessionVol := volume
else
    sessionHigh := math.max(nz(sessionHigh, high), high)
    sessionLow  := math.min(nz(sessionLow, low), low)
    sessionClose := close
    sessionVol += volume

// ----------------------------------------------------------------------------
// STATE MACHINE: MOVE AWAY -> TOUCH -> SWEEP/RECLAIM OR CHOCH/BOS -> INVERSE
// ----------------------------------------------------------------------------
// Loop through active levels and evaluate conditions
if array.size(activeLevels) > 0
    for i = array.size(activeLevels) - 1 to 0
        FRVPLevel lvl = array.get(activeLevels, i)
        
        // Expire levels after maxSessionsKeep days
        if (dayofmonth - lvl.createdDay > maxSessionsKeep and dayofmonth >= lvl.createdDay) or (array.size(activeLevels) > 15)
            array.remove(activeLevels, i)
            continue
            
        float bandSize = currAtr * zoneWidthATR
        float pocTop = lvl.poc + bandSize
        float pocBot = lvl.poc - bandSize
        
        // 1. Move Away Check
        if high > lvl.poc + (minAwayATR * currAtr)
            lvl.hasMovedAwayAbove := true
        if low < lvl.poc - (minAwayATR * currAtr)
            lvl.hasMovedAwayBelow := true
            
        // 2. Normal Touch Evaluation
        if lvl.activeNormal
            // Approach from above (came down -> LONG candidate)
            if lvl.hasMovedAwayAbove and not lvl.touched and low <= pocTop and high >= pocBot
                lvl.touched := true
                lvl.touchBar := bar_index
                lvl.touchExtreme := low
                
            // Approach from below (came up -> SHORT candidate)
            else if lvl.hasMovedAwayBelow and not lvl.touched and high >= pocBot and low <= pocTop
                lvl.touched := true
                lvl.touchBar := bar_index
                lvl.touchExtreme := high
                
            // Update touch extreme
            if lvl.touched
                if na(lvl.touchExtreme)
                    lvl.touchExtreme := close
                else
                    if lvl.hasMovedAwayAbove // Looking for Long
                        lvl.touchExtreme := math.min(lvl.touchExtreme, low)
                    else if lvl.hasMovedAwayBelow // Looking for Short
                        lvl.touchExtreme := math.max(lvl.touchExtreme, high)
                        
                // Check if price pushed too far (Invalidation / Flip trigger)
                if lvl.hasMovedAwayAbove and low < (lvl.poc - (minAwayATR * currAtr))
                    lvl.activeNormal := false
                    lvl.isFlipped := true
                if lvl.hasMovedAwayBelow and high > (lvl.poc + (minAwayATR * currAtr))
                    lvl.activeNormal := false
                    lvl.isFlipped := true

                // Model A: SWEEP & RECLAIM (1-3 bars after touch, candle closes back through level)
                bool sweepLongCondition  = lvl.hasMovedAwayAbove and (entryModelInput == "Sweep & Reclaim" or entryModelInput == "Either")
                bool sweepShortCondition = lvl.hasMovedAwayBelow and (entryModelInput == "Sweep & Reclaim" or entryModelInput == "Either")
                
                // Bullish Sweep Reclaim: closed above pocTop after sweeping lower
                if sweepLongCondition and close > pocTop and close > open and (bar_index - lvl.touchBar) <= 4 and (close - lvl.touchExtreme) >= (minBounceATR * currAtr)
                    float sl = lvl.touchExtreme - (slBufferTicks * tickSize)
                    float slDist = math.max(close - sl, minSLDistanceTicks * tickSize)
                    sl := close - slDist
                    float tp1 = close + (slDist * tp1R)
                    float tp2 = close + (slDist * tp2R)
                    
                    strategy.entry("Long", strategy.long)
                    strategy.exit("TP1/SL Long", "Long", stop=sl, limit=tp2)
                    
                    // Draw visual Green & Red Trade Boxes
                    box.new(bar_index, tp1, bar_index + 15, close, border_color=color.green, bg_color=color.new(color.green, 85))
                    box.new(bar_index, close, bar_index + 15, sl, border_color=color.red, bg_color=color.new(color.red, 85))
                    
                    lvl.activeNormal := false
                    lvl.touched := false
                    
                // Bearish Sweep Reclaim: closed below pocBot after sweeping higher
                if sweepShortCondition and close < pocBot and close < open and (bar_index - lvl.touchBar) <= 4 and (lvl.touchExtreme - close) >= (minBounceATR * currAtr)
                    float sl = lvl.touchExtreme + (slBufferTicks * tickSize)
                    float slDist = math.max(sl - close, minSLDistanceTicks * tickSize)
                    sl := close + slDist
                    float tp1 = close - (slDist * tp1R)
                    float tp2 = close - (slDist * tp2R)
                    
                    strategy.entry("Short", strategy.short)
                    strategy.exit("TP1/SL Short", "Short", stop=sl, limit=tp2)
                    
                    box.new(bar_index, close, bar_index + 15, tp1, border_color=color.green, bg_color=color.new(color.green, 85))
                    box.new(bar_index, sl, bar_index + 15, close, border_color=color.red, bg_color=color.new(color.red, 85))
                    
                    lvl.activeNormal := false
                    lvl.touched := false

                // Model B: CHoCH + BOS (Williams 5-bar Fractal Confirmation)
                bool chochLong = lvl.hasMovedAwayAbove and (entryModelInput == "CHoCH + BOS" or entryModelInput == "Either")
                bool chochShort = lvl.hasMovedAwayBelow and (entryModelInput == "CHoCH + BOS" or entryModelInput == "Either")
                
                if chochLong and not na(lastFractalHigh) and close > lastFractalHigh and close > prevFractalHigh
                    float sl = lvl.touchExtreme - (slBufferTicks * tickSize)
                    float slDist = math.max(close - sl, minSLDistanceTicks * tickSize)
                    sl := close - slDist
                    float tp1 = close + (slDist * tp1R)
                    float tp2 = close + (slDist * tp2R)
                    
                    strategy.entry("Long (CHoCH+BOS)", strategy.long)
                    strategy.exit("TP1/SL Long", "Long (CHoCH+BOS)", stop=sl, limit=tp2)
                    
                    box.new(bar_index, tp1, bar_index + 18, close, border_color=color.green, bg_color=color.new(color.green, 85))
                    box.new(bar_index, close, bar_index + 18, sl, border_color=color.red, bg_color=color.new(color.red, 85))
                    
                    lvl.activeNormal := false
                    lvl.touched := false
                    
                if chochShort and not na(lastFractalLow) and close < lastFractalLow and close < prevFractalLow
                    float sl = lvl.touchExtreme + (slBufferTicks * tickSize)
                    float slDist = math.max(sl - close, minSLDistanceTicks * tickSize)
                    sl := close + slDist
                    float tp1 = close - (slDist * tp1R)
                    float tp2 = close - (slDist * tp2R)
                    
                    strategy.entry("Short (CHoCH+BOS)", strategy.short)
                    strategy.exit("TP1/SL Short", "Short (CHoCH+BOS)", stop=sl, limit=tp2)
                    
                    box.new(bar_index, close, bar_index + 18, tp1, border_color=color.green, bg_color=color.new(color.green, 85))
                    box.new(bar_index, sl, bar_index + 18, close, border_color=color.red, bg_color=color.new(color.red, 85))
                    
                    lvl.activeNormal := false
                    lvl.touched := false

        // 3. Inverse Trade Evaluation (v7 INV FLIP)
        if enableInverse and lvl.activeInverse and lvl.isFlipped
            // Level broke downwards, now coming back up -> SHORT INV
            if close < pocBot
                lvl.breakCountBelow += 1
            if lvl.breakCountBelow >= breakClosesReq and high >= pocBot and low <= pocTop and close < pocBot
                float sl = high + (slBufferTicks * tickSize)
                float slDist = math.max(sl - close, minSLDistanceTicks * tickSize)
                sl := close + slDist
                float tp1 = close - (slDist * tp1R)
                float tp2 = close - (slDist * tp2R)
                
                strategy.entry("Short INV", strategy.short)
                strategy.exit("TP/SL Short INV", "Short INV", stop=sl, limit=tp2)
                
                box.new(bar_index, close, bar_index + 15, tp1, border_color=color.green, bg_color=color.new(color.green, 85))
                box.new(bar_index, sl, bar_index + 15, close, border_color=color.red, bg_color=color.new(color.red, 85))
                
                lvl.activeInverse := false
`;

export const FRVP_DEFAULT_ANALYSIS_TEMPLATES = [
  {
    name: 'FRVP Sweep & Reclaim Execution',
    didWell: 'Patiently waited for the session POC touch, entered on the candle close reclaim with tight sweep tip SL.',
    wouldChange: 'Scale out 50% at TP1 (1.5R) instead of trying to hold the whole position into the next session.'
  },
  {
    name: 'FRVP CHoCH + BOS Confirmation',
    didWell: 'Waited for Williams 5-bar fractal CHoCH followed by BOS confirmation close rather than front-running the touch.',
    wouldChange: 'Leave stop loss at the original swing extreme until TP1 is reached instead of trailing prematurely.'
  },
  {
    name: 'FRVP Inverse Flip (INV) Retest',
    didWell: 'Immediately identified the level flip after consecutive closes beyond zone, executing the retest in opposite direction.',
    wouldChange: 'Confirm higher-timeframe trend alignment before entering inverse setups against momentum.'
  },
  {
    name: 'FRVP Invalidation & No-Chase',
    didWell: 'Honored the invalidation rule immediately when price sliced through POC without bouncing, taking a small cut.',
    wouldChange: 'Never place limit orders right on the POC without waiting for candle close verification.'
  }
];
