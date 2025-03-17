import { useState } from 'react'
import './index.css'
import { Canvas } from './canvas/canvas'
import { CanvasOverlay } from './canvas/canvasOverlay';
import { ColorSelector } from './components/ColorSelector';

function App() {

  //Variable and setter for the last click position on the canvas. Defaults to -1 if no click has yet occurred
  const [clickX, setClickX] = useState(-1);
  const [clickY, setClickY] = useState(-1);

  //Divide by 5 and round down to get specific pixel clicked
  function handleClickX(pos: number) {
    setClickX(Math.floor(pos / 5));
  }

  function handleClickY(pos: number) {
    setClickY(Math.floor(pos / 5));
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
  //The CanvasOverlay component draws the grid and the halo around the last clicked pixel
  return (
    <>
    <div id="canvasWrapper" >
      <div className="canvas pixelCanvasMagnifier" >
        <Canvas height={100} width={100} imageData={imageData} />
      </div>

      <CanvasOverlay height={500} width={500} updateClickX={handleClickX} updateClickY={handleClickY} lastClickX={clickX} lastClickY={clickY} />
    </div>

    <ColorSelector />
    </>
  )
}

export default App
