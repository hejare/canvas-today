import { cors, corsMiddleware } from "@/lib/corsMiddleware";
import NextCors from "nextjs-cors";

export default async function handler(req, res) {
  await NextCors(req, res, {
    // Options
    methods: ["GET"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  console.log("But wtf 2?");
  res.status(200).json({
    status: "ok",
    timestamp: Date.now(),
  });
}
