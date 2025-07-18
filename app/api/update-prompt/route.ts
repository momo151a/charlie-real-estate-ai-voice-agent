import { NextRequest, NextResponse } from "next/server";
import { UpdatePromptRequest, ElevenLabsAgentConfig } from "../../../types";

export async function POST(req: NextRequest) {
  const { prompt }: UpdatePromptRequest = await req.json();
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const agentId = process.env.ELEVENLABS_AGENT_ID || "agent_01k0dwm80te3atmqhpwbe0zkny";

  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }
  if (!prompt) {
    return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/convai/agents/${agentId}`,
      {
        method: "PATCH",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversation_config: {
            agent: {
              prompt: {
                prompt: prompt
              }
            }
          }
        } as ElevenLabsAgentConfig),
      }
    );
    const responseBody = await res.text();

    if (!res.ok) {
      return NextResponse.json({ error: responseBody }, { status: res.status });
    }

    return NextResponse.json({ success: true, response: responseBody });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
