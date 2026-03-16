import { useCallback } from 'react';

export function useSound(url: string) {
  const play = useCallback(() => {
    const audio = new Audio(url);
    audio.volume = 0.5; // Громкость 50%
    audio.play().catch(e => console.log("Звук заблокирован браузером", e));
  }, [url]);

  return { play };
}
