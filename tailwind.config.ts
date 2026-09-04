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
        vit: {
          blue: "#0A2540",
          yellow: "#FFC72C",
          accent: "#2563EB",
          light: "#F4F7FB"
        }
      },
    },
  },
  plugins: [],
};
export default config;
