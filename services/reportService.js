import redis from "../config/redis.js";

export const fetchReports = async () => {
    const cacheKey = "community_reports";

    // 1. Check Redis
    const cachedReports = await redis.get(cacheKey);

    if (cachedReports) {
        console.log("Reports returned from Redis");

        return JSON.parse(cachedReports);
    }

    // 2. Cache miss → call external API
    console.log("Cache miss - fetching from external API");

    const response = await fetch("http://localhost:4000/reports");

    if (!response.ok) {
        throw new Error("Failed to fetch reports");
    }

    const reports = await response.json();

    // 3. Store in Redis
    await redis.set(
        cacheKey,
        JSON.stringify(reports),
        "EX",
        60
    );

    console.log("Reports stored in Redis");

    // 4. Return reports
    return reports;
};