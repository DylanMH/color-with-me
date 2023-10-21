import { Room, Client } from "@colyseus/core";
import { MyRoomState, Player, Canvas } from "./schema/MyRoomState";

export class Lobbies extends Room<MyRoomState> {
  maxClients = 4;

  onCreate(options: any) {
    this.setState(new MyRoomState());

    this.onMessage("selectedImage", (client, image) => {
      this.state.selectedImage = image;
      console.log("Set the room image to: " + image)
    });

    this.onMessage("getRoomImage", (client, image) => {
      client.send("roomImage", this.state.selectedImage);
    })

  }

  onJoin(client: Client) {
    console.log(`${client.sessionId} joined the room.`);
    client.send("getImage", this.state.selectedImage);
    console.log("sending image: " + this.state.selectedImage);
  }

  onLeave(client: Client) {
    // Remove the client's drawing data when they leave
    console.log(`${client.sessionId} left the room.`);
  }
}
