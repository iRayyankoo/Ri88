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
                    bg: "var(--brand-bg)",
                },
                surface: {
                    base: "var(--surface-base)",
                    raised: "var(--surface-raised)",
                    glass: "var(--surface-glass)",
                },
                border: {
                    subtle: "var(--border-subtle)",
                    strong: "var(--border-strong)",
                },
                text: {
                    primary: "var(--text-primary)",
                    muted: "var(--text-muted)",
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
