import { useState, useEffect } from 'react'
import { useQuery, useSubscription, gql } from '@apollo/client'
import './index.css'
import { Canvas } from './canvas/canvas'
import { CanvasOverlay } from './canvas/canvasOverlay';
import { ColorSelector } from './components/ColorSelector';
import { ConfirmButton } from './components/ConfirmButton';
import { ToggleGrid } from './components/ToggleGrid';
import Header from './components/Header';
import { ZoomButtons } from './components/ZoomButtons';
// GraphQL queries and mutations
const GET_ALL_PIXELS = gql`
  query GetAllPixels {
    getAllPixels {
      userId
      x
      y
      color
      placedAt
    }
  }
`;

/* const CREATE_PIXEL = gql`
  mutation CreatePixel($x: Int!, $y: Int!, $color: String!) {
    createPixel(x: $x, y: $y, color: $color) {
      userId
      x
      y
      color
      placedAt
    }
  }
`; */

// GraphQL subscription
const PIXEL_UPDATED = gql`
  subscription PixelUpdated {
    pixelUpdated {
      userId
      x
      y
      color
      placedAt
    }
  }
`;

interface Pixel {
  userId: string;
  x: number;
  y: number;
  color: string;
  placedAt: string;
}

function App() {
  //Variable and setter for the last click position on the canvas. Defaults to -1 if no click has yet occurred
  const [clickX, setClickX] = useState(-1);
  const [clickY, setClickY] = useState(-1);
  const [clickedColor, setClickedColor] = useState(1);
  const [gridToggle, setGridToggle] = useState(false);
const [scaleLevel, setScaleLevel] = useState(1);
//will be used for dragging functionality
/*const [mouseDownX, setMouseDownX] = useState(0);
const [mouseDownY, setMouseDownY] = useState(0);*/
  const [imageData, setImageData] = useState(new Uint8ClampedArray(40000).fill(255)); // Initialize with transparent pixels

  // Query to get all pixels
  const { loading, error, data } = useQuery(GET_ALL_PIXELS);
  
  // Mutation to create a pixel
  //const [createPixel] = useMutation(CREATE_PIXEL);
  
  // Subscription to pixel updates
  useSubscription(PIXEL_UPDATED, {
    onData: ({ data }) => {
      if (data?.data?.pixelUpdated) {
        updateCanvasWithPixel(data.data.pixelUpdated);
      }
    }
  });

  // Update canvas with initial pixels when data is loaded
  useEffect(() => {
    if (data?.getAllPixels) {
      const newImageData = new Uint8ClampedArray(40000).fill(255);
      
      // Set default canvas to white
      data.getAllPixels.forEach((_pixel: Pixel, i: number) => {
        newImageData[i] = 255;     // R
        newImageData[i + 1] = 255; // G
        newImageData[i + 2] = 255; // B
        newImageData[i + 3] = 255; // A
      })
      
      // Apply pixels from database
      data.getAllPixels.forEach((pixel: Pixel) => {
        applyPixelToImageData(newImageData, pixel);
      });
      
      setImageData(newImageData);
    }
  }, [data]);

  // Helper function to apply a pixel to the imageData
  const applyPixelToImageData = (imgData: Uint8ClampedArray, pixel: Pixel) => {
    const index = (pixel.y * 100 + pixel.x) * 4;
    const colorHex = pixel.color.startsWith('#') ? pixel.color : `#${pixel.color}`;
    
    const r = parseInt(colorHex.substring(1, 3), 16);
    const g = parseInt(colorHex.substring(3, 5), 16);
    const b = parseInt(colorHex.substring(5, 7), 16);
    
    imgData[index] = r;     // R
    imgData[index + 1] = g; // G
    imgData[index + 2] = b; // B
    imgData[index + 3] = 255; // A (fully opaque)
  };

  // Function to update canvas with a newly placed pixel
  const updateCanvasWithPixel = (pixel: Pixel) => {
    const newImageData = new Uint8ClampedArray(imageData);
    applyPixelToImageData(newImageData, pixel);
    setImageData(newImageData);
  };

  // Divide by 5 and round down to get specific pixel clicked
  function handleClickX(pos: number) {
    setClickX(Math.floor((pos / 5) / scaleLevel));
  }

  function handleClickY(pos: number) {
    setClickY(Math.floor((pos / 5) / scaleLevel));
    
  }

  function handleClickedColor(color: number) {
    setClickedColor(color);
  }

  function handleConfirm() {
    //Make sure that X and Y are not their default values
    if (clickX >= 0 && clickY >= 0) {
      //This is where the network request will go!
      console.log(`X: ${clickX}, Y: ${clickY}, Color: ${clickedColor}`)
    }
  }

  function handleToggleGrid(){
    setGridToggle(!gridToggle);
  }

  function handleZoomIncrease(){
    setScaleLevel(scaleLevel + 1)
  }

  function handleZoomDecrease(){
    if(scaleLevel >= 2){
      setScaleLevel(scaleLevel - 1);
    }
  }

  // Handle placing a pixel via GraphQL mutation
  // Removed until needed to make GraphQL mutation
  // Logic to be pulled and used within confirmation button
  /*const handlePlacePixel = (x: number, y: number) => {
    createPixel({
      variables: { x, y, color: clickedColor }
    }).catch(err => console.error("Error placing pixel:", err));
  };*/

  if (loading) return <p>Loading canvas...</p>;
  if (error) return <p>Error loading canvas: {error.message}</p>;

  // Wrap both canvases in a div, so we can use css to center them both on the same area
  // The pixelCanvasMagnifier div has styling to make the canvas within it 5 times larger without smoothing or filtering the image
  // The CanvasOverlay component draws the grid and the halo around the last clicked pixel
  return (
    <>
      <Header />

      <div id="canvasWrapper" style={{transform: `${scaleLevel}`, imageRendering: `-webkit-optimize-contrast`}} >
        <div className="canvas pixelCanvasMagnifier" >
          <Canvas height={100} width={100} imageData={imageData} />
        </div>

        <CanvasOverlay height={500} width={500} updateClickX={handleClickX} updateClickY={handleClickY} lastClickX={clickX} lastClickY={clickY} gridToggle={gridToggle} />
      </div>

      <ColorSelector clickedColorHandler={handleClickedColor} clickedColor={clickedColor} />
      <ConfirmButton confirmHandler={handleConfirm} />
      <ZoomButtons increaseZoomHandler={handleZoomIncrease} decreaseZoomHandler={handleZoomDecrease} />
      <ToggleGrid toggleGridHandler={handleToggleGrid} />
    </>
  )
}

export default App
