import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const imageDirectory = path.join("public", "images");

  try {
    const filenames = await fs.readdirSync(imageDirectory);
    return new Response(JSON.stringify(filenames))
  } catch (error) {
    return new Response(JSON.stringify(error))
  }
}
export { handler as GET};