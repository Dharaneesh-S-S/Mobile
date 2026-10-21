// Extracts dominant and accent colors from an image data URL or Blob URL using an offscreen canvas
export function extractColorsFromImage(imgSrc: string): Promise<{ primary: string; secondary: string; glow: string }> {
  return new Promise((resolve) => {
    if (!imgSrc) {
      resolve({ primary: '#8b5cf6', secondary: '#d946ef', glow: 'rgba(217, 70, 239, 0.4)' })
      return
    }

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve({ primary: '#8b5cf6', secondary: '#d946ef', glow: 'rgba(217, 70, 239, 0.4)' })
          return
        }

        const size = 32
        canvas.width = size
        canvas.height = size
        ctx.drawImage(img, 0, 0, size, size)

        const imgData = ctx.getImageData(0, 0, size, size).data
        let r = 0, g = 0, b = 0
        let count = 0

        // Sample pixels with reasonable saturation
        for (let i = 0; i < imgData.length; i += 16) {
          const red = imgData[i]
          const green = imgData[i + 1]
          const blue = imgData[i + 2]
          // Ignore ultra-dark or ultra-bright pixels
          const max = Math.max(red, green, blue)
          const min = Math.min(red, green, blue)
          if (max > 40 && min < 240) {
            r += red
            g += green
            b += blue
            count++
          }
        }

        if (count === 0) count = 1
        const avgR = Math.round(r / count)
        const avgG = Math.round(g / count)
        const avgB = Math.round(b / count)

        // Boost saturation for vividness
        const primary = `rgb(${avgR}, ${avgG}, ${avgB})`
        const secondary = `rgb(${Math.min(255, Math.round(avgR * 1.25))}, ${Math.min(255, Math.round(avgG * 0.85))}, ${Math.min(255, Math.round(avgB * 1.3))})`
        const glow = `rgba(${avgR}, ${avgG}, ${avgB}, 0.5)`

        resolve({ primary, secondary, glow })
      } catch {
        resolve({ primary: '#8b5cf6', secondary: '#d946ef', glow: 'rgba(217, 70, 239, 0.4)' })
      }
    }
    img.onerror = () => {
      resolve({ primary: '#8b5cf6', secondary: '#d946ef', glow: 'rgba(217, 70, 239, 0.4)' })
    }
    img.src = imgSrc
  })
}
