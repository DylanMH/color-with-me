"use client";
import React, { createContext, useContext, useState } from "react";
import * as Colyseus from "colyseus.js";

interface LobbyContextType {
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  room: Colyseus.Room | null; // add room imforation
  setRoom: (room: Colyseus.Room | null) => void; // function to set the room
}

const LobbyContext = createContext<LobbyContextType | undefined>(undefined);

export function useLobbyContext() {
  const context = useContext(LobbyContext);
  if (context === undefined) {
    throw new Error("useLobbyContext must be used within a LobbyProvider");
  }
  return context;
}

interface LobbyProviderProps {
  children: React.ReactNode;
}

export function LobbyProvider({ children }: LobbyProviderProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [room, setRoom] = useState<Colyseus.Room | null>(null);

  return (
    <LobbyContext.Provider
      value={{ selectedImage, setSelectedImage, room, setRoom }}
    >
      {children}
    </LobbyContext.Provider>
  );
}
