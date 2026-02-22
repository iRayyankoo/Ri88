import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                brand: {
                    primary: '#8B5CF6',
                    secondary: '#22D3EE',
                    bg: '#0D0D0F'
                }
            },
            fontFamily: {
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
                jakarta: ['Plus Jakarta Sans', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
};
export default config;
