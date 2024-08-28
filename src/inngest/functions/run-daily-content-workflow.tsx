import { inngest } from "@/inngest/client";

export const runDailyContentWorkflow = inngest.createFunction(
  { id: "run-daily-content-workflow" },
  // This workflow will run every weekday at 8:00am in the London timezone
  { cron: "TZ=Europe/London 0 8 * * 1-5" },
  async ({ step, event }) => {

    let { data } = event;
    let { contentId } = data;
    
    const keywordResearch = await step.run("keywordResearch", () => {
      // Find the next keyword to target from the content planning database

      // Return the target keyword
      return { 
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
      };
    });

    const titleGeneration = await step.run("title-generation", () => {
      let keyword = keywordResearch.keyword;
      let existingSerpResults = keywordResearch.existingSerpResults;
      return {
        contentId: contentId,
        titleOptions: [
          { title: "The Top 10 Health Benefits of Bananas", score: 0.8 },
          { title: "Bananas: The Ultimate Superfood", score: 0.7 },
          { title: "Bananas: A Comprehensive Guide", score: 0.6 }
        ],
        bestTitle: "The Top 10 Health Benefits of Bananas",
        rationale: `The title "The Top 10 Health Benefits of Bananas" has the highest score of 0.8 and is the best option for our content.`
      }
    });

    const scheduleTitleCheck = await step.run("schedule-title-check", () => {
      return {
        contentId: contentId,
        title: titleGeneration.bestTitle,
      }
    });

    const titleCheckComplete = await step.waitForEvent(
      "wait-for-title-check",
      { event: "task/title.checked", timeout: "3d", match: "data.contentId" }
    );


    const externalResearch = await step.run("external-research", () => {
      return {
        contentId: contentId,
        sources: [
          { name: "WebMD", relevance: 0.8, summary: "Bananas are a good source of potassium and fiber." },
          { name: "Mayo Clinic", relevance: 0.7, summary: "Bananas are a healthy snack that can help regulate blood sugar levels." },
          { name: "Healthline", relevance: 0.6, summary: "Bananas are rich in vitamins and minerals that support overall health." }
        ],
      }
    });

    const internalResearch = await step.run("internal-research", () => {
      return {
        contentId: contentId,
        sources: [
          { source: "Finn Elliott", relevance: 0.8, summary: "Bananas are a popular fruit with high search volume and moderate competition." },
        ],
      }
    });

    const draftContent = await step.run("draft-content", () => {
      const ext = externalResearch.sources
      const int = internalResearch.sources
      return {
        contentId: contentId,
        htmlContent: [
          {
            createdAt: new Date(),
            content: `<h1>The Top 10 Health Benefits of Bananas</h1>`,
            notes: "This is the initial draft of the content.",
          }
        ]
      }
    });

    const optimizeContent = await step.run("optimize-content", () => {
      const content = draftContent.htmlContent;
      return {
        contentId: contentId,
        htmlContent: [
          ...draftContent.htmlContent,
          {
            createdAt: new Date(),
            content: `<p>Bananas are a popular fruit with high search volume and moderate competition. They are a good source of potassium and fiber, and can help regulate blood sugar levels. In this article, we will explore the top 10 health benefits of bananas.</p>`,
            notes: "This is the optimized version of the content.",
          }
        ]
      }
    });

    const editForBrandVoice = await step.run("edit-for-brand-voice", () => {
      const content = optimizeContent.htmlContent[-1];
      return {
        contentId: contentId,
        htmlContent: [
          ...optimizeContent.htmlContent,
          {
            createdAt: new Date(),
            content: `<p>Bananas are a popular fruit with high search volume and moderate competition. They are a good source of potassium and fiber, and can help regulate blood sugar levels. In this article, we will explore the top 10 health benefits of bananas.</p>
            <p>At Acme Health, we believe that bananas are a superfood that can help you live a healthier life. Our mission is to provide you with the information you need to make informed decisions about your health and wellness.</p>`,
            notes: "This is the next version of the content, edited for brand voice.",
          }
        ]
      }
    });

    const addMedia = await step.run("add-media", () => {
      return {
        contentId: contentId,
        media: [
          { type: "image", url: "https://example.com/banana.jpg", caption: "A bunch of ripe bananas" },
          { type: "video", url: "https://example.com/banana.mp4", caption: "How to peel a banana" }
        ],
        htmlContent: [
          ...editForBrandVoice.htmlContent,
          {
            createdAt: new Date(),
            content: `<img src="https://example.com/banana.jpg" alt="A bunch of ripe bananas" />
            <video src="https://example.com/banana.mp4" controls>
              Your browser does not support the video tag.
            </video>`,
            notes: "This version of the content includes media elements.",
          }
        ]
      }
    });

    const scheduleContentCheck = await step.run("schedule-content-check", () => {
      return {
        contentId: contentId,
        htmlContent: addMedia.htmlContent,
      }
    });

    const contentCheckComplete = await step.waitForEvent(
      "wait-for-content-check",
      { event: "task/content.checked", timeout: "3d", match: "data.contentId" }
    );

    const publishContent = await step.run("publish-content", () => {
      return {
        contentId: contentId,
        htmlContent: addMedia.htmlContent,
      }
    });

  }
);