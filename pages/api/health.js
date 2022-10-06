import { cors, corsMiddleware } from "@/lib/corsMiddleware";

export default async function handler(req, res) {
  await corsMiddleware(req, res, cors);

  res.status(200).json({
    status: "ok",
    timestamp: Date.now(),
  });
}



