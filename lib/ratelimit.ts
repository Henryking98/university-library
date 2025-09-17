import redis from "@/database/radis";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(5, "1m"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export default ratelimit