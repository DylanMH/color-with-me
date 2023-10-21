"use client";
import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line, Text, Image as KonvaImage } from "react-konva";
import * as Colyseus from "colyseus.js";

import { useLobbyContext } from "../context/LobbyContext";

const DrawingCanvas = () => {
  const [tool, setTool] = useState<string>("pen");
  const [lines, setLines] = useState<{ tool: string; points: number[] }[]>([]);
  const isDrawing = useRef(false);

  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null); // Use HTMLImageElement | null
  const { selectedImage, room } = useLobbyContext();
  const canvasSize = { width: 800, height: 800 };

  useEffect(() => {
    const loadFromContext = () => {
      if (selectedImage) {
        const img = new Image();
        img.src = `/images/${selectedImage}`;
        img.onload = () => {
          setImageObj(img);
        };
      } else {
        setImageObj(null);
      }
    };

    if (room) {
      // Attempt to load the image from the Colyseus server
      room.send("getRoomImage");
      room.onMessage("roomImage", (message) => {
        if (message.imageData) {
          // If there's an image on the server, set imageObj to that
          const img = new Image();
          img.src = message.imageData;
          img.onload = () => {
            setImageObj(img);
          };
        } else {
          console.log("No image data available on the server");
          // If no image is available on the server, fall back to loading from the context
          loadFromContext();
        }
      });
    } else {
      console.log("No room available.");
      // If there's no room, load the image from the context
      loadFromContext();
    }
  }, [selectedImage, room]);

  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    lines.splice(lines.length - 1, 1, lastLine);
    setLines([...lines]);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <div>
      <div>
        <h1>{room?.id}</h1>
      </div>
      <Stage
        width={canvasSize.width}
        height={canvasSize.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          <Text text="Just start drawing" x={5} y={30} />
          {imageObj && (
            <KonvaImage
              image={imageObj}
              x={0}
              y={0}
              width={canvasSize.width}
              height={canvasSize.height}
            />
          )}
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="orange"
              strokeWidth={10}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                line.tool === "eraser" ? "destination-out" : "source-over"
              }
            />
          ))}
        </Layer>
      </Stage>
      <select
        value={tool}
        onChange={(e) => {
          setTool(e.target.value);
        }}
      >
        <option value="pen">Pen</option>
        <option value="eraser">Eraser</option>
      </select>
    </div>
  );
};

export default DrawingCanvas;
