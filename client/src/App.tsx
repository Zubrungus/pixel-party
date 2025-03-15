//import { useState } from 'react'
import './App.css'
import { Canvas } from './Canvas/canvas'



function App() {
  const imageData: [number] = [0]

  for (let i = 0; i < 40000; i += 4) {
    const colorValue = Math.round((i / 40000) * 255)
    imageData[i] = colorValue;
    imageData[i + 1] = colorValue;
    imageData[i + 2] = colorValue;
    imageData[i + 3] = 255;
  }

  return (
    <>
      <Canvas height={100} width={100} imageData={imageData} />
    </>
  )
}

export default App
