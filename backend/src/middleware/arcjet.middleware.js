import { aj } from "../config/arcjet.js";

// Arcjet middleware for rate limiting, bit protections and security

export const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {
            requested: 1,
        })

        if(decision.isDenied()) {
            if(decision.reason.isRateLimit()) {
                return res.status(429).json({ 
                    error: "Too many Requests",
                    message: "Rate limit exceeded. Please try again later."
                })
            }else if (decision.reason.isBot()) {
                return res.status(403).json({
                    error: "Bot access denied",
                    message: "Automated requests are not allowed."
                })
            }else{
                return res.status(403).json({
                    error: " Forbidden",
                    message: "Your request has been blocked for security reasons."
                })
            }
        }

        //check for spoofed bots
        if(decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
            return res.status(403).json({
                error: "Spoofed Bot activity detected",
                message: "Malicious bot activity detected"
            })
        }

        next()
    } catch (error) {
        console.log("Arcjet middleware error:", error)

        next()
    }
}