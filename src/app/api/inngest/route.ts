import { serve } from "inngest/next";
import { helloWorld } from "@/inngest/functions/run-weekly-reports";
import { inngest } from "@/inngest/client";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld
  ]
});