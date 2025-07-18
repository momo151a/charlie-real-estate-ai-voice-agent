"use client";

import { useEffect, useRef } from "react";
import { useState } from "react";
import { TabType } from "../types";

export default function Home() {
  const [tab, setTab] = useState<TabType>("prompt");
  const [prompt, setPrompt] = useState(
    `You’re a friendly real estate agent named Charlie. Greet the user warmly, and ask about their budget, preferred location, and when they want to move in. Speak naturally, like you’re having a real conversation. If the user gives a short answer like ‘yeah’ or ‘okay’, don’t get sidetracked — just keep the conversation flowing. Don’t speak too fast or too slow.`
  );
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const convaiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tab === "talk" && convaiRef.current) {
      convaiRef.current.innerHTML = "";

      const widget = document.createElement("elevenlabs-convai");
      widget.setAttribute("agent-id", "agent_01k0dwm80te3atmqhpwbe0zkny");
      convaiRef.current.appendChild(widget);

      if (!document.getElementById("elevenlabs-convai-script")) {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
        script.async = true;
        script.type = "text/javascript";
        script.id = "elevenlabs-convai-script";
        document.body.appendChild(script);
      }
    }
  }, [tab]);

  const handleApplyPrompt = async () => {
    setStatus(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/update-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (res.ok) {
        setStatus("Prompt updated successfully!");
        setTimeout(() => setStatus(null), 3000);
      } else {
        const data = await res.json();
        setStatus("Error: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      setStatus("Error: Network error or server unavailable");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>
        Charlie Real Estate AI Voice Agent
      </h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "30px",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => setTab("prompt")}
          style={{
            padding: "10px 20px",
            backgroundColor: tab === "prompt" ? "#007bff" : "#f8f9fa",
            color: tab === "prompt" ? "white" : "#333",
            border: "1px solid #dee2e6",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Prompt Editor
        </button>
        <button
          onClick={() => setTab("talk")}
          style={{
            padding: "10px 20px",
            backgroundColor: tab === "talk" ? "#007bff" : "#f8f9fa",
            color: tab === "talk" ? "white" : "#333",
            border: "1px solid #dee2e6",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Talk to the Agent
        </button>
      </div>

      {tab === "prompt" && (
        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #dee2e6",
          }}
        >
          <h2 style={{ marginBottom: "15px", color: "#333" }}>Prompt Editor</h2>
          <div
            style={{
              background: "#e9ecef",
              border: "1px solid #ced4da",
              borderRadius: "6px",
              padding: "16px",
              marginBottom: "18px",
              color: "#495057",
              fontSize: "15px",
              lineHeight: 1.6,
            }}
          >
            <strong>
              The system prompt sets the personality and behavior of Charlie,
              your AI real estate agent.
            </strong>
            <br />
            Write the prompt as if you’re giving Charlie instructions for a real
            conversation.
            <br />
            <span style={{ color: "#007bff" }}>
              Use natural, spoken English — not formal or written English.
            </span>
            <ul style={{ margin: "10px 0 0 18px", padding: 0 }}>
              <li>Set the agent’s tone (friendly, helpful, etc.)</li>
              <li>
                Suggest what to ask (budget, location, move-in date, etc.)
              </li>
              <li>Encourage follow-up questions and natural conversation</li>
              <li>Remind Charlie to speak clearly and at a natural pace</li>
            </ul>
            <div
              style={{ marginTop: "10px", fontStyle: "italic", color: "#555" }}
            >
              <strong>Example:</strong>
              <br />
              “You’re a friendly real estate agent named Charlie. Greet the user
              warmly, and ask about their budget, preferred location, and when
              they want to move in. Speak naturally, like you’re having a real
              conversation. If the user gives a short answer like ‘yeah’ or
              ‘okay’, don’t get sidetracked — just keep the conversation
              flowing. Don’t speak too fast or too slow.”
            </div>
          </div>
          <textarea
            rows={8}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "14px",
              border: "1px solid #dee2e6",
              borderRadius: "4px",
              resize: "vertical",
              fontFamily: "monospace",
            }}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your agent prompt here..."
          />
          <div style={{ marginTop: "15px" }}>
            <button
              onClick={handleApplyPrompt}
              disabled={isLoading}
              style={{
                padding: "10px 20px",
                backgroundColor: isLoading ? "#6c757d" : "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: isLoading ? "not-allowed" : "pointer",
                fontSize: "16px",
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? "Updating..." : "Apply Prompt"}
            </button>
            {status && (
              <div
                style={{
                  marginTop: "10px",
                  padding: "10px",
                  backgroundColor: status.includes("Error")
                    ? "#f8d7da"
                    : "#d4edda",
                  color: status.includes("Error") ? "#721c24" : "#155724",
                  border: `1px solid ${
                    status.includes("Error") ? "#f5c6cb" : "#c3e6cb"
                  }`,
                  borderRadius: "4px",
                }}
              >
                {status}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "talk" && (
        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #dee2e6",
          }}
        >
          <h2 style={{ marginBottom: "15px", color: "#333" }}>
            Talk to the Agent
          </h2>
          <div
            ref={convaiRef}
            style={{
              display: "flex",
              justifyContent: "center",
              minHeight: "400px",
              backgroundColor: "white",
              borderRadius: "8px",
              border: "1px solid #dee2e6",
              padding: "20px",
            }}
          />
        </div>
      )}
    </div>
  );
}
