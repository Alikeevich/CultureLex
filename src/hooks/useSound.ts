import { useCallback } from 'react'

export function useSound(url: string) {
  const play = useCallback(() => {
    // Создаем новый объект при каждом клике для мгновенного отклика
    // и чтобы звуки могли накладываться (не прерывая предыдущий)
    const audio = new Audio(url)
    audio.volume = 0.5 // Громкость 50%
    
    // catch нужен, чтобы приложение не крашилось, если браузер 
    // заблокирует звук до первого взаимодействия со страницей
    audio.play().catch((error) => {
      console.warn('Звук заблокирован браузером или файл не найден:', error)
    })
  }, [url])

  return { play }
}
