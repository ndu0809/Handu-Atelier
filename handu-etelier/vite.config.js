import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// ========================================
// CLOUDFLARE TUNNEL BACKEND
// ========================================

const TUNNEL_URL =
  "https://catalog-haven-realm-clearance.trycloudflare.com";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    proxy: {
      // ========================================
      // KOSTUM
      // /kostum
      // ↓
      // /api/kostum
      // ========================================

      "/kostum": {
        target: TUNNEL_URL,
        changeOrigin: true,
        secure: false,
        logLevel: "debug",

        rewrite: (path) => path.replace(/^\/kostum/, "/api/kostum"),

        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log(`[PROXY REQUEST] ${req.method} ${req.url}`);
          });

          proxy.on("proxyRes", (proxyRes, req) => {
            console.log(`[PROXY RESPONSE] ${proxyRes.statusCode} ${req.url}`);
          });

          proxy.on("error", (err, req) => {
            console.error(`[PROXY ERROR] ${req.method} ${req.url}`, err);
          });
        },
      },

      // ========================================
      // KOLEKSI
      //
      // /koleksi
      // ↓
      // /api/koleksi
      // ========================================

      "/koleksi": {
        target: TUNNEL_URL,
        changeOrigin: true,
        secure: false,
        logLevel: "debug",

        rewrite: (path) => path.replace(/^\/koleksi/, "/api/koleksi"),

        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log(`[PROXY KOLEKSI REQUEST] ${req.method} ${req.url}`);
          });

          proxy.on("proxyRes", (proxyRes, req) => {
            console.log(
              `[PROXY KOLEKSI RESPONSE] ${proxyRes.statusCode} ${req.url}`,
            );
          });

          proxy.on("error", (err, req) => {
            console.error(
              `[PROXY KOLEKSI ERROR] ${req.method} ${req.url}`,
              err,
            );
          });
        },
      },

      // ========================================
      // UPLOAD FOTO
      // /uploads
      // ↓
      // /uploads
      //
      // TIDAK DI-REWRITE
      // ========================================

      "/uploads": {
        target: TUNNEL_URL,
        changeOrigin: true,
        secure: false,
        logLevel: "debug",

        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log(`[PROXY UPLOAD REQUEST] ${req.method} ${req.url}`);
          });

          proxy.on("proxyRes", (proxyRes, req) => {
            console.log(
              `[PROXY UPLOAD RESPONSE] ${proxyRes.statusCode} ${req.url}`,
            );
          });

          proxy.on("error", (err, req) => {
            console.error(`[PROXY UPLOAD ERROR] ${req.method} ${req.url}`, err);
          });
        },
      },

      // ========================================
      // API UMUM
      // /api
      // ↓
      // /api
      //
      // TERMASUK:
      // /api/admin
      // /api/users
      // /api/kostum
      // /api/kategori
      // DLL
      // ========================================

      "/api": {
        target: TUNNEL_URL,
        changeOrigin: true,
        secure: false,
        logLevel: "debug",

        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log(`[PROXY API REQUEST] ${req.method} ${req.url}`);
          });

          proxy.on("proxyRes", (proxyRes, req) => {
            console.log(
              `[PROXY API RESPONSE] ${proxyRes.statusCode} ${req.url}`,
            );
          });

          proxy.on("error", (err, req) => {
            console.error(`[PROXY API ERROR] ${req.method} ${req.url}`, err);
          });
        },
      },

      // ========================================
      // USERS - LEGACY
      //
      // /users
      // ↓
      // /api/users
      // ========================================

      "/users": {
        target: TUNNEL_URL,
        changeOrigin: true,
        secure: false,
        logLevel: "debug",

        rewrite: (path) => path.replace(/^\/users/, "/api/users"),

        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log(`[PROXY REQUEST] ${req.method} ${req.url}`);
          });

          proxy.on("proxyRes", (proxyRes, req) => {
            console.log(`[PROXY RESPONSE] ${proxyRes.statusCode} ${req.url}`);
          });

          proxy.on("error", (err, req) => {
            console.error(`[PROXY ERROR] ${req.method} ${req.url}`, err);
          });
        },
      },

      // ========================================
      // KATEGORI
      //
      // /kategori
      // ↓
      // /api/kategori
      // ========================================

      "/kategori": {
        target: TUNNEL_URL,
        changeOrigin: true,
        secure: false,
        logLevel: "debug",

        rewrite: (path) => path.replace(/^\/kategori/, "/api/kategori"),

        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log(`[PROXY REQUEST] ${req.method} ${req.url}`);
          });

          proxy.on("proxyRes", (proxyRes, req) => {
            console.log(`[PROXY RESPONSE] ${proxyRes.statusCode} ${req.url}`);
          });

          proxy.on("error", (err, req) => {
            console.error(`[PROXY ERROR] ${req.method} ${req.url}`, err);
          });
        },
      },

      // ========================================
      // PEMBAYARAN
      //
      // /pembayaran
      // ↓
      // /api/pembayaran
      // ========================================

      "/pembayaran": {
        target: TUNNEL_URL,
        changeOrigin: true,
        secure: false,
        logLevel: "debug",

        rewrite: (path) => path.replace(/^\/pembayaran/, "/api/pembayaran"),

        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log(`[PROXY REQUEST] ${req.method} ${req.url}`);
          });

          proxy.on("proxyRes", (proxyRes, req) => {
            console.log(`[PROXY RESPONSE] ${proxyRes.statusCode} ${req.url}`);
          });

          proxy.on("error", (err, req) => {
            console.error(`[PROXY ERROR] ${req.method} ${req.url}`, err);
          });
        },
      },

      // ========================================
      // REGISTRASI
      //
      // /registrasi
      // ↓
      // /api/registrasi
      // ========================================

      "/registrasi": {
        target: TUNNEL_URL,
        changeOrigin: true,
        secure: false,
        logLevel: "debug",

        rewrite: (path) => path.replace(/^\/registrasi/, "/api/registrasi"),

        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log(`[PROXY REQUEST] ${req.method} ${req.url}`);
          });

          proxy.on("proxyRes", (proxyRes, req) => {
            console.log(`[PROXY RESPONSE] ${proxyRes.statusCode} ${req.url}`);
          });

          proxy.on("error", (err, req) => {
            console.error(`[PROXY ERROR] ${req.method} ${req.url}`, err);
          });
        },
      },

      // ========================================
      // PEMINJAMAN
      //
      // /peminjaman
      // ↓
      // /api/peminjaman
      // ========================================

      "/peminjaman": {
        target: TUNNEL_URL,
        changeOrigin: true,
        secure: false,
        logLevel: "debug",

        rewrite: (path) => path.replace(/^\/peminjaman/, "/api/peminjaman"),

        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log(`[PROXY REQUEST] ${req.method} ${req.url}`);
          });

          proxy.on("proxyRes", (proxyRes, req) => {
            console.log(`[PROXY RESPONSE] ${proxyRes.statusCode} ${req.url}`);
          });

          proxy.on("error", (err, req) => {
            console.error(`[PROXY ERROR] ${req.method} ${req.url}`, err);
          });
        },
      },

      // ========================================
      // DETAIL PEMINJAMAN
      //
      // /detail-peminjaman
      // ↓
      // /api/detail-peminjaman
      // ========================================

      "/detail-peminjaman": {
        target: TUNNEL_URL,
        changeOrigin: true,
        secure: false,
        logLevel: "debug",

        rewrite: (path) =>
          path.replace(/^\/detail-peminjaman/, "/api/detail-peminjaman"),

        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log(`[PROXY REQUEST] ${req.method} ${req.url}`);
          });

          proxy.on("proxyRes", (proxyRes, req) => {
            console.log(`[PROXY RESPONSE] ${proxyRes.statusCode} ${req.url}`);
          });

          proxy.on("error", (err, req) => {
            console.error(`[PROXY ERROR] ${req.method} ${req.url}`, err);
          });
        },
      },

      // ========================================
      // PENGEMBALIAN
      //
      // /pengembalian
      // ↓
      // /api/pengembalian
      // ========================================

      "/pengembalian": {
        target: TUNNEL_URL,
        changeOrigin: true,
        secure: false,
        logLevel: "debug",

        rewrite: (path) => path.replace(/^\/pengembalian/, "/api/pengembalian"),

        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log(`[PROXY REQUEST] ${req.method} ${req.url}`);
          });

          proxy.on("proxyRes", (proxyRes, req) => {
            console.log(`[PROXY RESPONSE] ${proxyRes.statusCode} ${req.url}`);
          });

          proxy.on("error", (err, req) => {
            console.error(`[PROXY ERROR] ${req.method} ${req.url}`, err);
          });
        },
      },

      // ========================================
      // PETUGAS
      //
      // /api/petugas
      // ↓
      // /api/petugas
      // ========================================

      "/api/petugas": {
        target: TUNNEL_URL,
        changeOrigin: true,
        secure: false,
        logLevel: "debug",

        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log(`[PROXY REQUEST] ${req.method} ${req.url}`);
          });

          proxy.on("proxyRes", (proxyRes, req) => {
            console.log(`[PROXY RESPONSE] ${proxyRes.statusCode} ${req.url}`);
          });

          proxy.on("error", (err, req) => {
            console.error(`[PROXY ERROR] ${req.method} ${req.url}`, err);
          });
        },
      },

      // ========================================
      // JANGAN TAMBAHKAN:
      //
      // "/admin": { ... }
      //
      // Karena /admin adalah ROUTE REACT,
      // bukan proxy API.
      // ========================================
    },
  },
});
