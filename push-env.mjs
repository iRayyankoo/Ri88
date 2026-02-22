import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const envFilePath = path.join(process.cwd(), ".env.local");
const envFile = fs.readFileSync(envFilePath, "utf8");

const requiredVars = [
    "AUTH_SECRET",
    "AUTH_URL",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "DATABASE_URL"
];

for (const line of envFile.split("\n")) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) continue;

    const [key, ...valueParts] = trimmedLine.split("=");
    if (!key) continue;

    const value = valueParts.join("=");
    const cleanValue = value.replace(/^["']|["']$/g, ""); // Remove quotes if any

    if (requiredVars.includes(key)) {
        console.log(`Adding ${key} to Vercel...`);
        try {
            // Using vercel env add is interactive by default if value is not piped
            // But we can pipe it: echo "value" | vercel env add KEY production
            execSync(`echo "${cleanValue}" | vercel env add ${key} production`, { stdio: "inherit" });
        } catch (e) {
            console.error(`Failed to add ${key}`);
        }
    }
}
console.log("Done adding environment variables!");
