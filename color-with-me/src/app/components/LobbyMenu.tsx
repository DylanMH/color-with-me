"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import * as Colyseus from "colyseus.js";
import GetImages from "../components/GetImages";
import { useLobbyContext } from "../context/LobbyContext";

export default function LobbyMenu() {
  const { selectedImage, setSelectedImage, room } = useLobbyContext();
  const router = useRouter();

  // send the user back to the main menu and disconnect them from the lobby
  const goToMainMenu = async () => {
    if (room) {
      room.leave();
      router.push("/");
    } else {
      console.log("failed to create room");
    }
  };

  // send the selected image to the server and route the user to the drawing canvas with the selected image
  const handleStartLobby = async () => {
    if (selectedImage === null) {
      return;
    }
    try {
      if (room) {
        room.send("selectedImage", selectedImage); // send the selected image to the server
        console.log("Sent selected image to server");
        router.push("/lobby");
      }
    } catch (err) {
      console.error("Failed to create room:", err);
    }
  };

  const handleImageSelection = (image: string) => setSelectedImage(image); // set the selected image when a user clicks on a displayed image

  const createLobbyButtonClass =
    setSelectedImage === null
      ? "bg-red-500 text-white font-bold flex p-4 rounded-3xl items-center m-2"
      : "bg-red-500 hover:bg-red-700 text-white font-bold flex p-4 rounded-3xl items-center m-2";

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="text-5xl font-bold mb-6 text-center">
        <span className="text-red-500">L</span>
        <span className="text-yellow-500">o</span>
        <span className="text-green-500">b</span>
        <span className="text-blue-500">b</span>
        <span className="text-purple-500">y</span>
        <span className="text-pink-500"> </span>
        <span className="text-red-500">M</span>
        <span className="text-yellow-500">e</span>
        <span className="text-green-500">n</span>
        <span className="text-blue-500">u</span>
      </div>
      <div className="bg-slate-200 rounded w-auto h-5/6 p-4 flex flex-col items-center">
        <button
          className="bg-blue-500 hover-bg-blue-700 text-white font-bold flex py-3 p-3 rounded-3xl items-center m-2"
          onClick={goToMainMenu}
        >
          Go Back
        </button>
        <h1 className="text-center text-3xl text-blue-500 font-bold p-3">
          Available Images
        </h1>
        <div className="h-full overflow-auto">
          <GetImages onSelectedImage={handleImageSelection} />
        </div>
        <button
          className={createLobbyButtonClass}
          onClick={handleStartLobby}
          disabled={setSelectedImage === null}
        >
          Start Drawing!
        </button>
      </div>
    </div>
  );
}
