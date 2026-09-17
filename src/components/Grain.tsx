import { useEffect, useRef } from 'react'

/**
 * Film grain as a small pre-rendered noise tile on its own compositor layer.
 * (An SVG feTurbulence background re-rasterizes with the content beneath it; a bitmap tile doesn't.)
 */
export function Grain() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const size = 140
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx || !ref.current) return
    const image = ctx.createImageData(size, size)
    for (let i = 0; i < image.data.length; i += 4) {
      const v = Math.random() * 255
      image.data[i] = image.data[i + 1] = image.data[i + 2] = v
      image.data[i + 3] = 255
    }
    ctx.putImageData(image, 0, 0)
    ref.current.style.backgroundImage = `url(${canvas.toDataURL('image/png')})`
  }, [])

  return <div ref={ref} aria-hidden className="grain" />
}
