"use client";
import React, { useState, useContext } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import * as Colyseus from "colyseus.js";

import { useLobbyContext } from "../context/LobbyContext";

const MainMenu = () => {
  const [input, setInput] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  let { setRoom, selectedImage, setSelectedImage, room } = useLobbyContext();
  const client = new Colyseus.Client("ws://localhost:2567");

  // create a new lobby with the room "lobbies" when user clicks "Create Lobby"
  const handleCreateLobby = async () => {
    try {
      const room = await client.joinOrCreate("lobbies");
      console.log("Lobby created with room id: " + room.id);
      setRoom(room);
      router.push("/create-lobby");
    } catch (err) {
      console.error("Failed to create room:", err);
    }
  };

  const handleJoinLobby = () => {
    if (input.trim() === "") {
      return;
    }

    // Attempt to join the lobby by its id
    client
      .joinById(input)
      .then((room) => {
        if (room) {
          console.log("Lobby joined with room id: " + room.id);
          setRoom(room);

          // Listen for the "getImage" message from the server
          room.onMessage("getImage", (image) => {
            setSelectedImage(image);

            // After receiving the image, navigate to the lobby
            router.push("/lobby");
          });
        }
      })
      .catch((err) => {
        console.error("Failed to join lobby:", err);
      });
  };

  // handle the join lobby input change
  const handleInputChange = (e: any) => {
    setInput(e.target.value);
  };

  return (
    <div>
      <nav className="bg-gray-800 p-4 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Color with Me</h1>
          <div className="space-x-4">
            {!session ? (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => signIn("google")}
              >
                Login
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                  onClick={handleCreateLobby}
                >
                  Create Lobby
                </button>
                <div>
                  <input
                    className="text-black"
                    type="text"
                    placeholder="lobby id"
                    value={input}
                    onChange={handleInputChange}
                  />
                  <button
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded"
                    onClick={handleJoinLobby}
                  >
                    Join Lobby
                  </button>
                </div>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  onClick={() => signOut()}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default MainMenu;
