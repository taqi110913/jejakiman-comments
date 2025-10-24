import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { post } = req.query;

  if (!post || typeof post !== "string") {
    return res.status(400).json({ error: "Missing post parameter" });
  }

  try {
    if (req.method === "GET") {
      const comments = await prisma.comment.findMany({
        where: { postUrl: post },
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(comments);
    }

    if (req.method === "POST") {
      const { author, text } = req.body;
      if (!author || !text) {
        return res.status(400).json({ error: "Missing author or text" });
      }

      const newComment = await prisma.comment.create({
        data: { postUrl: post, author, text },
      });

      return res.status(201).json(newComment);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
