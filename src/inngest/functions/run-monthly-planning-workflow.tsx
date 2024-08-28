import { inngest } from "@/inngest/client";

export const runMonthlyPlanningWorkflow = inngest.createFunction(
  { id: "run-monthly-planning-workflow" },
  // This workflow will run on the first day of every month at 1:00am in the London timezone
  { cron: "TZ=Europe/London 0 1 1 * *" },
  async ({ step, event }) => {

    let { data } = event;
    
    const keywordResearch = await step.run("keyword-research", () => {
      // Get keyword research data from AlsoAsked API

      // For each

        // Check if content already exists on the website for that keyword

        // Check if the keyword meets our threshold for search volume and competition

        // Generate a rationale for why we should target this keyword

      // Return the keyword research data
      return [
        { 
            keyword: "banana", 
            searchVolume: 1000, 
            competition: 0.5,
            rationale: `Bananas are a popular fruit with high search volume and moderate competition.
            This keyword is a good candidate for our SEO strategy because it has a high search volume and moderate competition.`,
            existingSerpResults: [
                { title: "10 Delicious Banana Recipes", rank: 1 },
                { title: "The Ultimate Guide to Bananas", rank: 2 },
                { title: "Bananas: A Complete Nutritional Guide", rank: 3 }
            ]
        },
        {
            keyword: "apple",
            searchVolume: 2000,
            competition: 0.6,
            rationale: `Apples are a popular fruit with high search volume and moderate competition.
            This keyword is a good candidate for our SEO strategy because it has a high search volume and moderate competition.`,
            existingSerpResults: [
                { title: "10 Delicious Apple Recipes", rank: 1 },
                { title: "The Ultimate Guide to Apples", rank: 2 },
                { title: "Apples: A Complete Nutritional Guide", rank: 3 }
            ]
        }
      ];
    });

    const contentPlanning = await step.run("content-planning", () => {
        // Create entries in the content planning database for each keyword

        // Return the content planning data
        return keywordResearch.map((keyword) => {
            return {
                keyword: keyword.keyword,
                searchVolume: keyword.searchVolume,
                competition: keyword.competition,
                rationale: keyword.rationale,
                existingSerpResults: keyword.existingSerpResults
            };
        });
    });
});