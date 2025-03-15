import { useState } from 'react'
import './App.css'
import { Canvas } from './Canvas/canvas'
import { CanvasOverlay } from './Canvas/canvasOverlay';




function App() {
  //These lines will have errors until mouse functionality is implemented, but code still runs
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  function handleMouseX(pos: number) {
    setMouseX(pos);
  }

  function handleMouseY(pos: number) {
    setMouseY(pos);
  }


  const imageData = new Uint8ClampedArray(40000);

  //This is just placeholder pixel data until we have more functionality
  //imageData will be the RGBA values of each pixel. The data is set here and then passed to the canvas as a prop
  for (let i = 0; i < 40000; i += 4) {
    const colorValue = Math.round((i / 40000) * 255)
    imageData[i] = 0;
    imageData[i + 1] = colorValue;
    imageData[i + 2] = colorValue;
    imageData[i + 3] = 255;
  }

  //Wrap both canvases in a div, so we can use css to center them both on the same area
  //The pixelCanvasMagnifier div has styling to make the canvas within it 5 times larger without smoothing or filtering the image
  //The CanvasOverlay component draws the grid
  return (
    <div id="canvasWrapper" >

      <div className="canvas pixelCanvasMagnifier" >
        <Canvas height={100} width={100} imageData={imageData} updateMouseX={handleMouseX} updateMouseY={handleMouseY} />
      </div>

      <CanvasOverlay height={500} width={500} />

    </div>
  )
}

export default App
