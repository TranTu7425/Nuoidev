'use client'

const SOUNDS = {
  // Sử dụng các link nội bộ hoặc CDN tin cậy
  SUCCESS: '/sounds/cash.MP3', // Cash register sound
  CLICK: '#',   // Click
  ALERT: '#',   // Alert/Siren
  EXPLOSION: '/sounds/flashbang.MP3', // Flashbang effect
  GLASS_BREAK: '/sounds/glass.MP3', // Glass break sound
}

// Preload audio objects for better responsiveness
const audioMap: { [key: string]: HTMLAudioElement } = {}

if (typeof window !== 'undefined') {
  Object.entries(SOUNDS).forEach(([key, url]) => {
    const audio = new Audio(url)
    audio.preload = 'auto'
    audioMap[key] = audio
  })
}

export function playSound(soundName: keyof typeof SOUNDS) {
  if (typeof window === 'undefined') return

  const audio = audioMap[soundName]
  if (audio) {
    audio.currentTime = 0 // Reset to start if already playing
    audio.volume = 0.5
    audio.play().catch(err => console.log('Sound play blocked:', err))
  }
}

