export interface UpdatePromptRequest {
  prompt: string;
}

export interface UpdatePromptResponse {
  success?: boolean;
  error?: string;
  response?: string;
}

export interface ElevenLabsAgentConfig {
  conversation_config: {
    agent: {
      prompt: {
        prompt: string;
      };
    };
  };
}

export type TabType = "prompt" | "talk";