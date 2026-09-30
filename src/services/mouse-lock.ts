let locked = false;
let lockedBy: string | null = null;

export function acquireMouseLock(owner: string): boolean {
  if (locked) return false;
  locked = true;
  lockedBy = owner;
  return true;
}

/**
 * Waits for the shared mouse lock, giving up after `timeoutMs`.
 *
 * The lock is global across accounts and is held by whoever is mid-drag.
 * Blocking forever here wedges the captcha solver (and the request that
 * triggered it) with no timeout anywhere up the stack, so bail out instead.
 * Returns true when the lock was acquired.
 */
export async function acquireMouseLockWithTimeout(owner: string, timeoutMs: number): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  while (!acquireMouseLock(owner)) {
    if (Date.now() >= deadline) {
      console.warn(
        `[MouseLock] ${owner} timed out after ${timeoutMs}ms waiting for the lock (held by ${getMouseLockOwner() ?? 'unknown'}).`,
      );
      return false;
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  return true;
}

export function releaseMouseLock(owner?: string): void {
  if (owner && lockedBy !== owner) return;
  locked = false;
  lockedBy = null;
}

export function isMouseLocked(): boolean {
  return locked;
}

export function getMouseLockOwner(): string | null {
  return lockedBy;
}
