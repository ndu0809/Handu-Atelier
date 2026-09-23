import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// ========================================
// CLOUDFLARE TUNNEL BACKEND
// ========================================

const TUNNEL_URL =
    "https://testing-running-doug-marvel.trycloudflare.com";

export default defineConfig({

    plugins: [
        react(),
        tailwindcss()
    ],

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

                rewrite: (path) =>
                    path.replace(
                        /^\/kostum/,
                        "/api/kostum"
                    ),

                configure: (proxy) => {

                    proxy.on(
                        "proxyReq",
                        (proxyReq, req) => {

                            console.log(
                                `[PROXY KOSTUM REQUEST] ${req.method} ${req.url}`
                            );

                        }
                    );

                    proxy.on(
                        "proxyRes",
                        (proxyRes, req) => {

                            console.log(
                                `[PROXY KOSTUM RESPONSE] ${proxyRes.statusCode} ${req.url}`
                            );

                        }
                    );

                    proxy.on(
                        "error",
                        (err, req) => {

                            console.error(
                                `[PROXY KOSTUM ERROR] ${req.method} ${req.url}`,
                                err
                            );

                        }
                    );

                }

            },

            // ========================================
            // KOLEKSI
            // /koleksi
            // ↓
            // /api/koleksi
            // ========================================

            "/koleksi": {

                target: TUNNEL_URL,

                changeOrigin: true,

                secure: false,

                logLevel: "debug",

                rewrite: (path) =>
                    path.replace(
                        /^\/koleksi/,
                        "/api/koleksi"
                    ),

                configure: (proxy) => {

                    proxy.on(
                        "proxyReq",
                        (proxyReq, req) => {

                            console.log(
                                `[PROXY KOLEKSI REQUEST] ${req.method} ${req.url}`
                            );

                        }
                    );

                    proxy.on(
                        "proxyRes",
                        (proxyRes, req) => {

                            console.log(
                                `[PROXY KOLEKSI RESPONSE] ${proxyRes.statusCode} ${req.url}`
                            );

                        }
                    );

                    proxy.on(
                        "error",
                        (err, req) => {

                            console.error(
                                `[PROXY KOLEKSI ERROR] ${req.method} ${req.url}`,
                                err
                            );

                        }
                    );

                }

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

                    proxy.on(
                        "proxyReq",
                        (proxyReq, req) => {

                            console.log(
                                `[PROXY UPLOAD REQUEST] ${req.method} ${req.url}`
                            );

                        }
                    );

                    proxy.on(
                        "proxyRes",
                        (proxyRes, req) => {

                            console.log(
                                `[PROXY UPLOAD RESPONSE] ${proxyRes.statusCode} ${req.url}`
                            );

                        }
                    );

                    proxy.on(
                        "error",
                        (err, req) => {

                            console.error(
                                `[PROXY UPLOAD ERROR] ${req.method} ${req.url}`,
                                err
                            );

                        }
                    );

                }

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
            // /api/kategori
            // DLL
            // ========================================

            "/api": {

                target: TUNNEL_URL,

                changeOrigin: true,

                secure: false,

                logLevel: "debug",

                configure: (proxy) => {

                    proxy.on(
                        "proxyReq",
                        (proxyReq, req) => {

                            console.log(
                                `[PROXY API REQUEST] ${req.method} ${req.url}`
                            );

                        }
                    );

                    proxy.on(
                        "proxyRes",
                        (proxyRes, req) => {

                            console.log(
                                `[PROXY API RESPONSE] ${proxyRes.statusCode} ${req.url}`
                            );

                        }
                    );

                    proxy.on(
                        "error",
                        (err, req) => {

                            console.error(
                                `[PROXY API ERROR] ${req.method} ${req.url}`,
                                err
                            );

                        }
                    );

                }

            },

            // ========================================
            // USERS - LEGACY
            // /users
            // ↓
            // /api/users
            // ========================================

            "/users": {

                target: TUNNEL_URL,

                changeOrigin: true,

                secure: false,

                logLevel: "debug",

                rewrite: (path) =>
                    path.replace(
                        /^\/users/,
                        "/api/users"
                    ),

                configure: (proxy) => {

                    proxy.on(
                        "proxyReq",
                        (proxyReq, req) => {

                            console.log(
                                `[PROXY USERS REQUEST] ${req.method} ${req.url}`
                            );

                        }
                    );

                    proxy.on(
                        "proxyRes",
                        (proxyRes, req) => {

                            console.log(
                                `[PROXY USERS RESPONSE] ${proxyRes.statusCode} ${req.url}`
                            );

                        }
                    );

                    proxy.on(
                        "error",
                        (err, req) => {

                            console.error(
                                `[PROXY USERS ERROR] ${req.method} ${req.url}`,
                                err
                            );

                        }
                    );

                }

            },

            // ========================================
            // KATEGORI
            // /kategori
            // ↓
            // /api/kategori
            // ========================================

            "/kategori": {

                target: TUNNEL_URL,

                changeOrigin: true,

                secure: false,

                logLevel: "debug",

                rewrite: (path) =>
                    path.replace(
                        /^\/kategori/,
                        "/api/kategori"
                    ),

                configure: (proxy) => {

                    proxy.on(
                        "proxyReq",
                        (proxyReq, req) => {

                            console.log(
                                `[PROXY KATEGORI REQUEST] ${req.method} ${req.url}`
                            );

                        }
                    );

                    proxy.on(
                        "proxyRes",
                        (proxyRes, req) => {

                            console.log(
                                `[PROXY KATEGORI RESPONSE] ${proxyRes.statusCode} ${req.url}`
                            );

                        }
                    );

                    proxy.on(
                        "error",
                        (err, req) => {

                            console.error(
                                `[PROXY KATEGORI ERROR] ${req.method} ${req.url}`,
                                err
                            );

                        }
                    );

                }

            },

            // ========================================
            // PEMBAYARAN
            // /pembayaran
            // ↓
            // /api/pembayaran
            // ========================================

            "/pembayaran": {

                target: TUNNEL_URL,

                changeOrigin: true,

                secure: false,

                logLevel: "debug",

                rewrite: (path) =>
                    path.replace(
                        /^\/pembayaran/,
                        "/api/pembayaran"
                    ),

                configure: (proxy) => {

                    proxy.on(
                        "proxyReq",
                        (proxyReq, req) => {

                            console.log(
                                `[PROXY PEMBAYARAN REQUEST] ${req.method} ${req.url}`
                            );

                        }
                    );

                    proxy.on(
                        "proxyRes",
                        (proxyRes, req) => {

                            console.log(
                                `[PROXY PEMBAYARAN RESPONSE] ${proxyRes.statusCode} ${req.url}`
                            );

                        }
                    );

                    proxy.on(
                        "error",
                        (err, req) => {

                            console.error(
                                `[PROXY PEMBAYARAN ERROR] ${req.method} ${req.url}`,
                                err
                            );

                        }
                    );

                }

            },

            // ========================================
            // DOKUMEN JAMINAN
            // /dokumen-jaminan
            // ↓
            // /api/dokumen-jaminan
            // ========================================

            "/dokumen-jaminan": {

                target: TUNNEL_URL,

                changeOrigin: true,

                secure: false,

                logLevel: "debug",

                rewrite: (path) =>
                    path.replace(
                        /^\/dokumen-jaminan/,
                        "/api/dokumen-jaminan"
                    ),

                configure: (proxy) => {

                    proxy.on(
                        "proxyReq",
                        (proxyReq, req) => {

                            console.log(
                                `[PROXY DOKUMEN JAMINAN REQUEST] ${req.method} ${req.url}`
                            );

                        }
                    );

                    proxy.on(
                        "proxyRes",
                        (proxyRes, req) => {

                            console.log(
                                `[PROXY DOKUMEN JAMINAN RESPONSE] ${proxyRes.statusCode} ${req.url}`
                            );

                        }
                    );

                    proxy.on(
                        "error",
                        (err, req) => {

                            console.error(
                                `[PROXY DOKUMEN JAMINAN ERROR] ${req.method} ${req.url}`,
                                err
                            );

                        }
                    );

                }

            },

            // ========================================
            // REGISTRASI
            // /registrasi
            // ↓
            // /api/registrasi
            // ========================================

            "/registrasi": {

                target: TUNNEL_URL,

                changeOrigin: true,

                secure: false,

                logLevel: "debug",

                rewrite: (path) =>
                    path.replace(
                        /^\/registrasi/,
                        "/api/registrasi"
                    ),

                configure: (proxy) => {

                    proxy.on(
                        "proxyReq",
                        (proxyReq, req) => {

                            console.log(
                                `[PROXY REGISTRASI REQUEST] ${req.method} ${req.url}`
                            );

                        }
                    );

                    proxy.on(
                        "proxyRes",
                        (proxyRes, req) => {

                            console.log(
                                `[PROXY REGISTRASI RESPONSE] ${proxyRes.statusCode} ${req.url}`
                            );

                        }
                    );

                    proxy.on(
                        "error",
                        (err, req) => {

                            console.error(
                                `[PROXY REGISTRASI ERROR] ${req.method} ${req.url}`,
                                err
                            );

                        }
                    );

                }

            },

            // ========================================
            // PEMINJAMAN
            // /peminjaman
            // ↓
            // /api/peminjaman
            // ========================================

            "/peminjaman": {

                target: TUNNEL_URL,

                changeOrigin: true,

                secure: false,

                logLevel: "debug",

                rewrite: (path) =>
                    path.replace(
                        /^\/peminjaman/,
                        "/api/peminjaman"
                    ),

                configure: (proxy) => {

                    proxy.on(
                        "proxyReq",
                        (proxyReq, req) => {

                            console.log(
                                `[PROXY PEMINJAMAN REQUEST] ${req.method} ${req.url}`
                            );

                        }
                    );

                    proxy.on(
                        "proxyRes",
                        (proxyRes, req) => {

                            console.log(
                                `[PROXY PEMINJAMAN RESPONSE] ${proxyRes.statusCode} ${req.url}`
                            );

                        }
                    );

                    proxy.on(
                        "error",
                        (err, req) => {

                            console.error(
                                `[PROXY PEMINJAMAN ERROR] ${req.method} ${req.url}`,
                                err
                            );

                        }
                    );

                }

            },

            // ========================================
            // DETAIL PEMINJAMAN
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
                    path.replace(
                        /^\/detail-peminjaman/,
                        "/api/detail-peminjaman"
                    ),

                configure: (proxy) => {

                    proxy.on(
                        "proxyReq",
                        (proxyReq, req) => {

                            console.log(
                                `[PROXY DETAIL PEMINJAMAN REQUEST] ${req.method} ${req.url}`
                            );

                        }
                    );

                    proxy.on(
                        "proxyRes",
                        (proxyRes, req) => {

                            console.log(
                                `[PROXY DETAIL PEMINJAMAN RESPONSE] ${proxyRes.statusCode} ${req.url}`
                            );

                        }
                    );

                    proxy.on(
                        "error",
                        (err, req) => {

                            console.error(
                                `[PROXY DETAIL PEMINJAMAN ERROR] ${req.method} ${req.url}`,
                                err
                            );

                        }
                    );

                }

            },

            // ========================================
            // PENGEMBALIAN
            // /pengembalian
            // ↓
            // /api/pengembalian
            // ========================================

            "/pengembalian": {

                target: TUNNEL_URL,

                changeOrigin: true,

                secure: false,

                logLevel: "debug",

                rewrite: (path) =>
                    path.replace(
                        /^\/pengembalian/,
                        "/api/pengembalian"
                    ),

                configure: (proxy) => {

                    proxy.on(
                        "proxyReq",
                        (proxyReq, req) => {

                            console.log(
                                `[PROXY PENGEMBALIAN REQUEST] ${req.method} ${req.url}`
                            );

                        }
                    );

                    proxy.on(
                        "proxyRes",
                        (proxyRes, req) => {

                            console.log(
                                `[PROXY PENGEMBALIAN RESPONSE] ${proxyRes.statusCode} ${req.url}`
                            );

                        }
                    );

                    proxy.on(
                        "error",
                        (err, req) => {

                            console.error(
                                `[PROXY PENGEMBALIAN ERROR] ${req.method} ${req.url}`,
                                err
                            );

                        }
                    );

                }

            },

            // ========================================
            // PETUGAS
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

                    proxy.on(
                        "proxyReq",
                        (proxyReq, req) => {

                            console.log(
                                `[PROXY PETUGAS REQUEST] ${req.method} ${req.url}`
                            );

                        }
                    );

                    proxy.on(
                        "proxyRes",
                        (proxyRes, req) => {

                            console.log(
                                `[PROXY PETUGAS RESPONSE] ${proxyRes.statusCode} ${req.url}`
                            );

                        }
                    );

                    proxy.on(
                        "error",
                        (err, req) => {

                            console.error(
                                `[PROXY PETUGAS ERROR] ${req.method} ${req.url}`,
                                err
                            );

                        }
                    );

                }

            }

            // ========================================
            // JANGAN TAMBAHKAN:
            //
            // "/admin": { ... }
            //
            // Karena /admin adalah ROUTE REACT,
            // bukan proxy API.
            // ========================================

        }

    }

});