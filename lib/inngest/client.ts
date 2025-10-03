import { Inngest} from "inngest";

export const inngest = new Inngest({
    id: 'justtrade',
    ai: process.env.GEMINI_API_KEY ? { 
        gemini: { 
            apiKey: process.env.GEMINI_API_KEY
        }
    } : undefined
})
