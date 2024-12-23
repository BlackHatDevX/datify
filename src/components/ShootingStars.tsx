import { useMemo } from 'react'

// Predefined random values to prevent hydration mismatch
const STAR_COUNT = 20

export function ShootingStars() {
  const stars = useMemo(() => {
    return Array.from({ length: STAR_COUNT }).map((_, i) => ({
      delay: ((i * 0.5) % 5) + "s",
      duration: (1.5 + (i % 2)) + "s",
      top: ((i * 7) % 90) + "%",
      left: ((i * 11) % 90) + "%",
    }))
  }, [])

  return (
    <div className="shooting-stars-container">
      {stars.map((star, i) => (
        <div
          key={i}
          className="shooting-star"
          style={{
            '--delay': star.delay,
            '--duration': star.duration,
            '--top': star.top,
            '--left': star.left,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
} 