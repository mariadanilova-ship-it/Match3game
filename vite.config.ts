import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const base = isGithubActions && repositoryName ? `/${repositoryName}/` : "/";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base,
});
