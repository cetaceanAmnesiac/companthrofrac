export type Asynchronema<T> = Asχnma<T>;
export type Asχnma<T> =
  IdleAsχnma<T> | PendingAsχnma<T> | ResolvedAsχnma<T> | RejectedAsχnma<T>;

export type AsχnmaStatus = 'idle' | 'pending' | 'resolved' | 'rejected';

type AsχnmaIs<S extends AsχnmaStatus> = Extract<AsχnmaStatus, S>;
export type IdleAsχnma<_T> = { status: AsχnmaIs<'idle'> };
export type PendingAsχnma<_T> = { status: AsχnmaIs<'pending'> };
export type ResolvedAsχnma<T> = {
  status: AsχnmaIs<'resolved'>;
  resolution: T;
  elapsedMs: number | null;
};
export type RejectedAsχnma<_T> = {
  status: AsχnmaIs<'rejected'>;
  rejection: Error;
  elapsedMs: number | null;
};

export const createIdleAsχnma = <T>(): IdleAsχnma<T> => ({ status: 'idle' });
export const createPendingAsχnma = <T>(): PendingAsχnma<T> => ({
  status: 'pending',
});
export const createResolvedAsχnma = <T>(
  resolution: T,
  elapsedMs: number | null = null,
): ResolvedAsχnma<T> => ({ status: 'resolved', resolution, elapsedMs });
export const createRejectedAsχnma = <T>(
  rejection: Error,
  elapsedMs: number | null = null,
): RejectedAsχnma<T> => ({ status: 'rejected', rejection, elapsedMs });
