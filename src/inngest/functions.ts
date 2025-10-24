import { generateText } from "ai";
import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";

const google = createGoogleGenerativeAI();
const openai = createOpenAI();

export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    const { steps: geminiSteps } = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        model: google("gemini-2.5-flash"),
        system: "You are a helpful assistant",
        prompt: "Who is Narendra modi?",
      },
    );

    const { steps: openaiSteps } = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        model: openai("gpt-3.5-turbo"),
        system: "You are a helpful assistant",
        prompt: "Who is Bhagat Singh?",
      },
    );
    return openaiSteps;
  },
);
