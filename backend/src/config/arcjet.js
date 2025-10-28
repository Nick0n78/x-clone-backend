import arcjet, { tokenBucket, shield, detectBot} from "@arcjet/node";
import { ENV } from "./env.js";

export const aj = arcjet({
    key: ENV.ARCJET_KEY,
    characteristics: ["ip.src"],
    rules: [
        // shield protects your app from common attacks e.g. SQL injection, XSS
        shield({ mode: "LIVE" }),

        // bot detection - block all bots except search engine
        detectBot({
            mode: "LIVE",
            allow: [
                "CATEGORY:SEARCH_ENGINE",
            ]
        }),

        // rate limiting - limit requests to 100 requests per minute per IP
        tokenBucket({
            mode: "LIVE",
            refillRate: 10, // tokens added per interval
            interval: 10, // interval in seconds
            capacity: 15, // maximum tokens in bucket
        })
    ]
})