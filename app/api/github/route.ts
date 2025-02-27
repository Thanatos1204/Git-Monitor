// app/api/github/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Server as SocketServer } from "socket.io";
import { createServer } from "http";

let io: any;

interface GlobalWithSocketIoServer {
  socketIoServer?: SocketServer;
}

declare const global: any;

if (typeof global.socketIoServer === 'undefined') {
  const httpServer = createServer();
  io = new SocketServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  httpServer.listen(3001);
  global.socketIoServer = io;
} else {
  io = global.socketIoServer;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = req.headers.get("x-github-event");

    if (event === "push") {
      const { repository, commits, ref } = body;
      const branch = ref.replace("refs/heads/", "");

      io.emit("push", {
        repository: {
          id: repository.id,
          name: repository.name,
          full_name: repository.full_name,
          owner: repository.owner.login,
        },
        branch,
        commits: commits.map((commit: any) => ({
          id: commit.id,
          message: commit.message,
          timestamp: commit.timestamp,
          url: commit.url,
          author: commit.author,
          added: commit.added,
          removed: commit.removed,
          modified: commit.modified,
        })),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}