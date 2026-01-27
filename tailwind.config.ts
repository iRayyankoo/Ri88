
import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
        },
    },
    // IMPORTANT: Disable preflight to avoid breaking existing V1/V2 CSS
    corePlugins: {
        preflight: false,
    },
    plugins: [],
};
export default config;
