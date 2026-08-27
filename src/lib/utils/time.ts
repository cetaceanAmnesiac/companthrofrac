export const timer = () => {
  const t0 = performance.now();
  return () => performance.now() - t0;
};

export const delay = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

export type Stamp = [t: number, eff: Effrontery, msg: string];
const stamps: Stamp[] = [];

export type Effrontery = keyof Console & ('debug' | 'info' | 'warn' | 'error');
const DEFAULT_EFFRONTERY: Effrontery = 'info';
export const EFFRONTERIES: readonly Effrontery[] = [
  'debug',
  'info',
  'warn',
  'error',
];
export const compareEffronteries = (a: Effrontery, b: Effrontery) =>
  EFFRONTERIES.indexOf(a) - EFFRONTERIES.indexOf(b);

const LOG_TO_CONSOLE = true;
const LOG_TO_UI = true;

type Printer = (t: Stamp) => void;
let _printer: Printer | null = null;

export const connectPrinter = (p: Printer) => (
  (_printer = p),
  (): void => void (_printer = null)
);

export const stamp = (msg: string, eff: Effrontery = DEFAULT_EFFRONTERY) => {
  const stamp: Stamp = [Date.now(), eff, msg];
  stamps.push(stamp);
  if (LOG_TO_CONSOLE) logStamp(stamp);
  if (LOG_TO_UI) _printer?.(stamp);
};

const logStamp = (s: Stamp) => console[s[1]](createStampLabel(s));

const createStampLabel = ([t, _eff, msg]: Stamp) =>
  `⏱ ${formatClock(t)} ${msg}`;

export const formatClock = (ms: number) => {
  const d = new Date(ms);
  const hh = pad(d.getHours() % 12 || 12);
  const mm = pad(d.getMinutes());
  const ss = pad(d.getSeconds());
  return `${hh}:${mm}:${ss}${d.getHours() < 12 ? 'a' : 'p'}`;
};

const pad = (n: number) => String(n).padStart(2, '0');

export const getStamps = () => [...stamps];
