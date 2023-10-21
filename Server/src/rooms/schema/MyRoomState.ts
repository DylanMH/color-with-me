import { Schema, MapSchema, type } from "@colyseus/schema";

export class Player extends Schema {

  @type("string") name: string = "";
  @type("number") mouseX: number = 0;
  @type("number") mouseY: number = 0;

}

export class Canvas extends Schema {
  
  @type("number") width: number = 0;
  @type("number") height: number = 0;
  @type({map: "string"}) drawings = new MapSchema<string>();

}

export class MyRoomState extends Schema {

  @type({map: Player}) players = new MapSchema<Player>();
  @type(Canvas) canvas: Canvas;
  @type("string") selectedImage: string = "";

}