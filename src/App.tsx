import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const context = useRef<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext('2d')
    }
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: any = e.target.files?.[0]

    const reader = new FileReader()
    
    reader.onload = (e) => {
      const image = new Image()

      image.onload = () => {
        if (canvasRef.current && context.current) {
          const [width, height] = clampDimension(canvasRef.current.width, canvasRef.current.height)

          canvasRef.current.width = width,
          canvasRef.current.height = height,

          context.current.drawImage(image, 0, 0, width, height)
          const grayScales = convertToGrayscale(context.current, width, height)

          drawAscii(grayScales, width)
        }
      }

      image.src = e.target?.result as string
    }

    reader.readAsDataURL(file)
  }

  // Grayscale function
  const toGrayscale = (r: number, g: number, b: number) => {
    return 0.21 * r + 0.71 * g + 0.07 * b
  }

  const convertToGrayscale = (context: CanvasRenderingContext2D | null, width: number, height: number) => {
    const imageData = context.getImageData(0, 0, width, height)

    const grayscales = []

    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i]
      const g = imageData.data[i + 1]
      const b = imageData.data[i + 2]

      const grayscale = toGrayscale(r, g, b)
      imageData.data[i] = imageData.data[i+1] = imageData.data[i+2] = grayscale

      grayscales.push(grayscale)
    }

    context.putImageData(imageData, 0, 0)

    return grayscales
  }

  // ASCII Symbols
  const density = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,\"^`'. "
  const densityLength = density.length
  
  const getCharForGrayscale = (grayScale: number) => {
    return density[Math.ceil(((densityLength  - 1) * grayScale) / 255)]
  }

  const asciiImage = useRef<HTMLPreElement>(null)
  

  const drawAscii = (grayscales: number[], width: number) => {
    const ascii = grayscales.reduce((asciiImage, grayscale, index) => {
      let nextChars = getCharForGrayscale(grayscale)

      if ((index + 1) % width === 0) {
        nextChars = '\n'
      }

      return asciiImage + nextChars;
    }, '')


    asciiImage.current.textContent = ascii

  }

  const MAX_WIDTH = 100
  const MAX_HEIGHT = 70

  const clampDimension = (width: number, height: numbeer) => {
    if (height > MAX_HEIGHT) {
      const reducedWidth = Math.floor((width * MAX_HEIGHT) / height)
      return [reducedWidth, MAX_HEIGHT]
    }

    if (width > MAX_WIDTH) {
      const reducedHeight = Math.floor((height * MAX_WIDTH) / width);
      return [MAX_WIDTH, reducedHeight]
    }

    return [width, height]
  }

  return (
    <>
      <div className="input-container">
        <input type="file" name='image' ref={fileInput} onChange={handleImageChange} />
        <button onClick={() => fileInput.current?.click()}>Submit</button>
      </div>
      <canvas ref={canvasRef} id='preview' style={{ display: 'none' }} />
      <pre ref={asciiImage} id='ascii-image' style={{ color: 'white' }} />
    </>
  )
}

export default App
