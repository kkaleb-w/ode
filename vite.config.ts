import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const here = path.dirname(fileURLToPath(import.meta.url));

/**
 * Hosts allowed to reach the dev and preview servers.
 *
 * Vite refuses any request whose Host header it does not recognise. That is the
 * right default — it is what stops a random DNS name pointed at this box from
 * being served. These entries exist so the site can still be looked at over
 * localhost, over the machine's own addresses, and through a throwaway
 * cloudflared tunnel (which is how you show someone the build without opening a
 * port to the internet):
 *
 *   ~/.local/bin/cloudflared tunnel --url http://127.0.0.1:4174
 *
 * Add your own domain here once one points at this box. Never add "0.0.0.0" or
 * a bare "*" — and never leave a dev server reachable from the internet: it
 * serves /@fs/ (any readable file) and full source maps.
 */
const allowedHosts = [
  "localhost",
  "127.0.0.1",
  ".trycloudflare.com",
  ...(process.env.ODE_ALLOWED_HOSTS ?? "")
    .split(",")
    .map((h) => h.trim())
    .filter(Boolean),
];

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(here, "./src"),
    },
  },
  server: { allowedHosts },
  preview: { allowedHosts },
});
