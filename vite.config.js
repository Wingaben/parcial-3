import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    host: "0.0.0.0", // needed for the Docker Container port mapping to work
    strictPort: true,
    https: {
      key: fs.readFileSync("./reactcert/private.key"),
      cert: fs.readFileSync("./reactcert/certificate.crt"),
      ca: fs.readFileSync("./reactcert/ca_bundle.crt"),
    },
    port: 5173, // you can replace this port with any port
  },
});
