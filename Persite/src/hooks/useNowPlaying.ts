import { useEffect, useState } from 'react';

export type NowPlaying = {
  playing: boolean;
  track: string | null;
  artist: string | null;
  album: string | null;
  albumArt: string | null;
  url: string | null;
};

export type NowPlayingState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ok'; data: NowPlaying };

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export function useNowPlaying(pollMs = 30000) {
  const [state, setState] = useState<NowPlayingState>({ status: 'loading' });

  useEffect(() => {
    let alive = true;
    let timer: number | undefined;

    const load = async () => {
      try {
        const r = await fetch(`${API}/api/now-playing`, {
          signal: AbortSignal.timeout(15000),
        });
        if (!r.ok) throw new Error(String(r.status));
        const data: NowPlaying = await r.json();
        if (alive) setState({ status: 'ok', data });
      } catch {
        if (alive) {
          setState((prev) => (prev.status === 'ok' ? prev : { status: 'error' }));
        }
      }
    };

    const stop = () => {
      if (timer !== undefined) {
        window.clearInterval(timer);
        timer = undefined;
      }
    };

    const start = () => {
      stop();
      load();
      timer = window.setInterval(load, pollMs);
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible') start();
      else stop();
    };

    if (document.visibilityState === 'visible') start();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      alive = false;
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [pollMs]);

  return state;
}