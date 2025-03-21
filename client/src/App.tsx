import { useState, useEffect } from "react";
import { useQuery, useMutation, useSubscription, gql } from "@apollo/client";
import "./index.css";
import { Canvas } from "./Canvas/canvas";
import { CanvasOverlay } from "./Canvas/canvasOverlay";
import { ColorSelector } from "./components/ColorSelector";
import { ConfirmButton } from "./components/ConfirmButton";
import { ToggleGrid } from "./components/ToggleGrid";
import Header from "./components/Header";
import { ZoomButtons } from "./components/ZoomButtons";
import { getUser } from "./utils/auth";

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

const CREATE_PIXEL = gql`
  mutation CreatePixel($x: Int!, $y: Int!, $color: String!) {
    createPixel(x: $x, y: $y, color: $color) {
      userId
      x
      y
      color
      placedAt
    }
  }
`;

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
  // Variable and setter for the last click position on the canvas. Defaults to -1 if no click has yet occurred
  const [clickX, setClickX] = useState(-1);
  const [clickY, setClickY] = useState(-1);
  // Last clicked color, stored as a number from 1 to 16
  const [clickedColor, setClickedColor] = useState(1);
  // Boolean for whether to display the grid or not
  const [gridToggle, setGridToggle] = useState(false);
  // Current zoom level, cannot go below 1
  const [scaleLevel, setScaleLevel] = useState(1);
  // State values for dragging the canvas
  const [mouseDown, setMouseDown] = useState(false);
  const [mouseDownX, setMouseDownX] = useState(0);
  const [mouseDownY, setMouseDownY] = useState(0);
  const [offsetX, setOffestX] = useState(0);
  const [offsetY, setOffestY] = useState(0);
  // Current state of imageData, which is the 100 by 100 grid of pixels
  const [imageData, setImageData] = useState(
    new Uint8ClampedArray(40000).fill(255)
  ); // Initialize with transparent pixels
  // State for cooldown
  const [cooldown, setCooldown] = useState(false);
  const [remainingCooldownTime, setRemainingCooldownTime] = useState(0);

  // Query to get all pixels
  const { loading, error, data } = useQuery(GET_ALL_PIXELS, {
    pollInterval: 10000,
  });

  // Mutation to create a pixel
  const [createPixel] = useMutation(CREATE_PIXEL);

  // Subscription to pixel updates
  useSubscription(PIXEL_UPDATED, {
    onData: ({ data }) => {
      if (data?.data?.pixelUpdated) {
        console.log(
          "Received pixel update via subscription:",
          data.data.pixelUpdated
        );
        updateCanvasWithPixel(data.data.pixelUpdated);
      }
    },
    onError: (error) => {
      console.error("Subscription error:", error);
    },
  });

  // Update canvas with initial pixels when data is loaded
  useEffect(() => {
    if (data?.getAllPixels) {
      const newImageData = new Uint8ClampedArray(40000).fill(255);

      // Set default canvas to white
      data.getAllPixels.forEach((_pixel: Pixel, i: number) => {
        newImageData[i] = 255; // R
        newImageData[i + 1] = 255; // G
        newImageData[i + 2] = 255; // B
        newImageData[i + 3] = 255; // A
      });

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

    let r: number = 255,
      g: number = 255,
      b: number = 255;

    switch (pixel.color) {
      case "1":
        r = 179;
        g = 41;
        b = 41;
        break;
      case "2":
        r = 67;
        g = 56;
        b = 214;
        break;
      case "3":
        r = 223;
        g = 119;
        b = 22;
        break;
      case "4":
        r = 56;
        g = 129;
        b = 224;
        break;
      case "5":
        r = 232;
        g = 204;
        b = 23;
        break;
      case "6":
        r = 117;
        g = 225;
        b = 225;
        break;
      case "7":
        r = 37;
        g = 131;
        b = 40;
        break;
      case "8":
        r = 101;
        g = 199;
        b = 56;
        break;
      case "9":
        r = 213;
        g = 77;
        b = 177;
        break;
      case "10":
        r = 211;
        g = 150;
        b = 175;
        break;
      case "11":
        r = 120;
        g = 86;
        b = 59;
        break;
      case "12":
        r = 179;
        g = 136;
        b = 101;
        break;
      case "13":
        r = 89;
        g = 89;
        b = 89;
        break;
      case "14":
        r = 147;
        g = 147;
        b = 154;
        break;
      case "15":
        r = 0;
        g = 0;
        b = 0;
        break;
      case "16":
        r = 255;
        g = 255;
        b = 255;
        break;
    }

    imgData[index] = r; // R
    imgData[index + 1] = g; // G
    imgData[index + 2] = b; // B
    imgData[index + 3] = 255; // A (fully opaque)
  };

  // Function to update canvas with a newly placed pixel
  const updateCanvasWithPixel = (pixel: Pixel) => {
    console.log("Updating canvas with pixel:", pixel);
    // Create a proper copy of the current imageData
    const newImageData = new Uint8ClampedArray(40000);
    // Copy all existing data
    for (let i = 0; i < imageData.length; i++) {
      newImageData[i] = imageData[i];
    }
    // Apply the new pixel
    applyPixelToImageData(newImageData, pixel);
    // Update state with new image data
    setImageData(newImageData);
  };

  // Divide by 5 and round down to get specific pixel clicked
  function handleClickX(pos: number) {
    setClickX(Math.floor(pos / 5 / scaleLevel));
  }

  function handleClickY(pos: number) {
    setClickY(Math.floor(pos / 5 / scaleLevel));
  }

  function handleClickedColor(color: number) {
    setClickedColor(color);
  }

  function handleMouseDown(event: React.MouseEvent) {
    setMouseDown(true);
    setMouseDownX(event.clientX);
    setMouseDownY(event.clientY);
  }

  function handleTouchDown(event: React.TouchEvent) {
    setMouseDown(true);
    setMouseDownX(event.touches[0].pageX);
    setMouseDownY(event.touches[0].pageY);
  }

  function handleMouseUp() {
    setMouseDown(false);
  }

  function handleMouseMove(event: React.MouseEvent) {
    if (mouseDown) {
      setOffestX(offsetX - (mouseDownX - event.clientX));
      setOffestY(offsetY - (mouseDownY - event.clientY));

      setMouseDownX(event.clientX);
      setMouseDownY(event.clientY);
    }
  }

  function handleTouchMove(event: React.TouchEvent) {
    if (mouseDown) {
      setOffestX(offsetX - (mouseDownX - event.touches[0].pageX));
      setOffestY(offsetY - (mouseDownY - event.touches[0].pageY));
      setMouseDownX(event.touches[0].pageX);
      setMouseDownY(event.touches[0].pageY);
    }
  }

  function handleConfirm() {
    const user = getUser();
    console.log("This is the user:", user);

    // Check if cooldown is active
    if (cooldown) {
      console.log("Cooldown is active. Please wait.");
      return;
    }

    // Make sure that X and Y are not their default values
    if (clickX >= 0 && clickY >= 0 && user) {
      console.log(
        `Placing pixel: X: ${clickX}, Y: ${clickY}, Color: ${clickedColor}`
      );

      // Optimistically update the UI immediately
      const optimisticPixel: Pixel = {
        userId: user.userId,
        x: clickX,
        y: clickY,
        color: clickedColor.toString(),
        placedAt: new Date().toISOString(),
      };

      // Update the canvas immediately, don't wait for subscription
      updateCanvasWithPixel(optimisticPixel);

      createPixel({
        variables: { x: clickX, y: clickY, color: clickedColor.toString() },
      })
        .then((response) => {
          console.log("Pixel created successfully:", response);
          // Reset click position after successful pixel placement
          setClickX(-1);
          setClickY(-1);

          // Start 10-second cooldown
          console.log("Cooldown started: 10 seconds");
          setCooldown(true);
          setRemainingCooldownTime(10);

          let remainingTime = 10;
          const intervalId = setInterval(() => {
            remainingTime -= 1;
            setRemainingCooldownTime(remainingTime);
            console.log(`Cooldown: ${remainingTime} seconds remaining`);
            if (remainingTime <= 0) {
              clearInterval(intervalId);
              console.log("Cooldown ended");
              setCooldown(false);
            }
          }, 1000);
        })
        .catch((err) => {
          console.error("Error placing pixel:", err);
          // Display error to user if authentication fails
          if (err.message.includes("logged in")) {
            alert("You must be logged in to place a pixel.");
          }
        });
    } else if (!user) {
      alert("You must be logged in to place a pixel.");
    }
  }

  function handleToggleGrid() {
    setGridToggle(!gridToggle);
  }

  function handleZoomIncrease() {
    setScaleLevel(scaleLevel + 1);
  }

  function handleZoomDecrease() {
    if (scaleLevel >= 2) {
      setScaleLevel(scaleLevel - 1);
    }
  }

  if (loading) return <p>Loading canvas...</p>;
  if (error) return <p>Error loading canvas: {error.message}</p>;

  // Wrap both canvases in a div, so we can use css to center them both on the same area
  // The pixelCanvasMagnifier div has styling to make the canvas within it 5 times larger without smoothing or filtering the image
  // The CanvasOverlay component draws the grid and the halo around the last clicked pixel
  return (
    <>
      <Header remainingCooldownTime={remainingCooldownTime} />

      <div style={{ marginTop: "80px" }}>
        {" "}
        {/* Add margin to account for fixed header */}
        <div
          id="draggableWrapper"
          style={{ transform: `translate(${offsetX}px, ${offsetY}px)` }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchDown}
          onTouchEnd={handleMouseUp}
          onTouchMove={handleTouchMove}
        >
          <div
            id="canvasWrapper"
            style={{
              transform: ` scale(${scaleLevel})`,
              imageRendering: `pixelated`,
            }}
          >
            <div className="canvas pixelCanvasMagnifier">
              <Canvas height={100} width={100} imageData={imageData} />
            </div>
            <CanvasOverlay
              height={500}
              width={500}
              updateClickX={handleClickX}
              updateClickY={handleClickY}
              lastClickX={clickX}
              lastClickY={clickY}
              gridToggle={gridToggle}
            />
          </div>
        </div>
        <ColorSelector
          clickedColorHandler={handleClickedColor}
          clickedColor={clickedColor}
        />
        <ConfirmButton confirmHandler={handleConfirm} />
        <ZoomButtons
          increaseZoomHandler={handleZoomIncrease}
          decreaseZoomHandler={handleZoomDecrease}
        />
        <ToggleGrid toggleGridHandler={handleToggleGrid} />
      </div>
    </>
  );
}

export default App;
