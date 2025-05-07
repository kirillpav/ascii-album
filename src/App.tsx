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
        if (canvasRef.current) {
          canvasRef.current.width = image.width
          canvasRef.current.height = image.height
          context.current?.drawImage(image, 0, 0)
        }
      }

      image.src = e.target?.result as string
    }

    reader.readAsDataURL(file)
  }


  return (
    <>
      <div className="input-container">
        <input type="file" name='image' ref={fileInput} onChange={handleImageChange} />
        <button onClick={() => fileInput.current?.click()}>Submit</button>
      </div>
      <canvas ref={canvasRef} id='preview' />
    </>
  )
}

export default App
