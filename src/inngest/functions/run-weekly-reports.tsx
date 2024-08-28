import { inngest } from "../client";

export const runWeeklyReports = inngest.createFunction(
  { id: "run-weekly-reports" },
  // This function will run every Sunday at 8:00am in the London timezone
  { cron: "TZ=Europe/London 0 8 * * 0" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { event, body: "Hello, World!" };
  },
);