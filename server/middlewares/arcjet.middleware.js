import aj from '../config/arcject.js';

const arcjectMiddleware = async (req, res, next) => {
    try {

        const decision = await aj.protect(req);

        if(decision.isDenied()) {
            if(decision.reason.isRateLimit()) return res.status(429).json({ error: 'Rate Limit exceeded' });
            if(decision.reason.isBot()) return res.status(403).json({ error: 'Bot detected' });

            return res.status(403).json({ error: 'Access denied' });
        }

        next();
    }
    catch(error) {
        console.log(`Arcjet Middleware error: ${error}`);
        next(error);
    }
}

export default arcjectMiddleware;