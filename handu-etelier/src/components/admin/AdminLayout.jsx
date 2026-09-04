import { useEffect, useState } from "react";
import {
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    FaHome,
    FaUsers,
    FaUserTie,
    FaTshirt,
    FaThLarge,
    FaTags,
    FaClipboardList,
    FaBell,
    FaCog,
    FaChartLine,
    FaUndoAlt,
    FaSignOutAlt,
    FaBars,
    FaCalendarAlt,
    FaChevronRight,
} from "react-icons/fa";


// ======================================================
// ADMIN LAYOUT
// ======================================================

function AdminLayout({
    children,
    activePage = "",
    onNavigate,
}) {

    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] =
        useState(false);


    // ======================================================
    // LOAD USER
    // ======================================================

    useEffect(() => {

        const storedUser =
            localStorage.getItem("user");

        if (!storedUser) {

            navigate("/login", {
                replace: true,
            });

            return;
        }

        try {

            const parsedUser =
                JSON.parse(storedUser);

            setUser(parsedUser);

        } catch (error) {

            console.error(
                "Gagal membaca data user:",
                error
            );

            localStorage.removeItem("user");
            localStorage.removeItem("isLoggedIn");

            navigate("/login", {
                replace: true,
            });

        }

    }, [navigate]);


    // ======================================================
    // LOGOUT
    // ======================================================

    const handleLogout = () => {

        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");

        navigate("/login", {
            replace: true,
        });

    };


    // ======================================================
    // HANDLE MENU
    // ======================================================

    const handleMenuClick = (page) => {

        if (onNavigate) {
            onNavigate(page);
        }

        setMobileMenuOpen(false);

    };


    // ======================================================
    // MENU UTAMA
    // ======================================================

    const menuUtama = [

        {
            id: "dashboard",
            label: "Dashboard",
            icon: FaHome,
            path: "/admin/dashboard",
        },

        {
            id: "petugas",
            label: "Petugas",
            icon: FaUserTie,
            path: "/admin/petugas",
        },

        {
            id: "pelanggan",
            label: "Pelanggan",
            icon: FaUsers,
            path: "/admin/pelanggan",
        },

        {
            id: "kostum",
            label: "Kostum",
            icon: FaTshirt,
            path: "/admin/kostum",
        },

        {
            id: "koleksi",
            label: "Koleksi",
            icon: FaThLarge,
            path: "/admin/koleksi",
        },

        {
            id: "kategori",
            label: "Kategori",
            icon: FaTags,
            path: "/admin/kategori",
        },

        {
            id: "registrasi",
            label: "Registrasi",
            icon: FaClipboardList,
            path: "/admin/registrasi",
        },

        {
            id: "peminjaman",
            label: "Peminjaman",
            icon: FaCalendarAlt,
            path: "/admin/peminjaman",
        },

        {
            id: "notifications",
            label: "Notifikasi",
            icon: FaBell,
            path: "/admin/notifikasi",
        },

    ];


    // ======================================================
    // MENU LAPORAN
    // ======================================================

    const menuLaporan = [

        {
            id: "laporan-peminjaman",
            label: "Laporan Peminjaman",
            icon: FaChartLine,
            path: "/admin/peminjaman",
        },

        {
            id: "laporan-pengembalian",
            label: "Laporan Pengembalian",
            icon: FaUndoAlt,
            path: "/admin/peminjaman",
        },

    ];


    // ======================================================
    // ACTIVE MENU
    // ======================================================

    const isActive = (item) => {

        if (activePage) {

            return (
                activePage === item.id
            );

        }

        return (
            location.pathname === item.path
        );

    };


    // ======================================================
    // RENDER MENU ITEM
    // ======================================================

    const renderMenuItem = (item) => {

        const Icon = item.icon;

        const active = isActive(item);

        return (

            <Link
                key={item.id}
                to={item.path}
                onClick={() =>
                    handleMenuClick(item.id)
                }
                className={`
                    group
                    w-full
                    flex
                    items-center
                    justify-between
                    px-4
                    py-3.5
                    rounded-xl
                    transition-all
                    duration-200

                    ${
                        active
                            ? `
                                bg-gradient-to-r
                                from-[#D4AF37]/20
                                to-[#D4AF37]/5
                                border
                                border-[#D4AF37]/20
                                text-[#D4AF37]
                              `
                            : `
                                border
                                border-transparent
                                text-gray-400
                                hover:bg-white/[0.04]
                                hover:text-white
                              `
                    }
                `}
            >

                <div
                    className="
                        flex
                        items-center
                        gap-4
                    "
                >

                    <Icon
                        className={`
                            flex-shrink-0
                            text-[16px]

                            ${
                                active
                                    ? "text-[#D4AF37]"
                                    : "text-gray-500 group-hover:text-gray-300"
                            }
                        `}
                    />

                    <span
                        className="
                            text-sm
                            whitespace-nowrap
                        "
                    >
                        {item.label}
                    </span>

                </div>


                {item.id !== "dashboard" && (

                    <FaChevronRight
                        className={`
                            text-[9px]
                            transition

                            ${
                                active
                                    ? "opacity-80 text-[#D4AF37]"
                                    : "opacity-30"
                            }
                        `}
                    />

                )}

            </Link>

        );

    };


    // ======================================================
    // LOADING
    // ======================================================

    if (!user) {

        return (

            <div
                className="
                    min-h-screen
                    bg-[#090909]
                    text-white
                    flex
                    items-center
                    justify-center
                "
            >

                <p
                    className="
                        text-[#D4AF37]
                        text-sm
                        uppercase
                        tracking-[4px]
                    "
                >
                    Memuat...
                </p>

            </div>

        );

    }


    // ======================================================
    // MAIN RENDER
    // ======================================================

    return (

        <div
            className="
                min-h-screen
                bg-[#090909]
                text-white
            "
        >

            {/* ==================================================
                STYLE
            ================================================== */}

            <style>
                {`

                /* ==========================================
                   SIDEBAR SCROLL
                ========================================== */

                .admin-sidebar-scroll {
                    overflow-y: auto;
                    overflow-x: hidden;

                    scrollbar-width: none;
                    -ms-overflow-style: none;

                    min-height: 0;
                }

                .admin-sidebar-scroll::-webkit-scrollbar {
                    display: none;
                    width: 0;
                    height: 0;
                }


                /* ==========================================
                   MOBILE SIDEBAR
                ========================================== */

                .admin-mobile-sidebar {
                    transition:
                        transform 0.25s ease;
                }


                /* ==========================================
                   MOBILE BACKDROP
                ========================================== */

                .admin-mobile-backdrop {
                    transition:
                        opacity 0.25s ease;
                }

                `}
            </style>


            {/* ==================================================
                MOBILE BACKDROP
            ================================================== */}

            {mobileMenuOpen && (

                <div
                    className="
                        fixed
                        inset-0
                        bg-black/70
                        backdrop-blur-sm
                        z-40
                        lg:hidden
                    "
                    onClick={() =>
                        setMobileMenuOpen(false)
                    }
                />

            )}


            {/* ==================================================
                SIDEBAR
            ================================================== */}

            <aside
                className={`
                    admin-mobile-sidebar

                    fixed
                    left-0
                    top-0
                    bottom-0

                    w-[215px]

                    bg-[#0E0E0E]

                    border-r
                    border-[#D4AF37]/15

                    flex
                    flex-col

                    z-50

                    ${
                        mobileMenuOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }

                    lg:translate-x-0
                `}
            >

                {/* ==================================================
                    LOGO
                ================================================== */}

                <div
                    className="
                        flex-shrink-0

                        px-6
                        py-7

                        border-b
                        border-[#D4AF37]/10
                    "
                >

                    <div
                        className="
                            flex
                            flex-col
                            items-center
                            text-center
                        "
                    >

                        <div
                            className="
                                text-[#D4AF37]
                                text-2xl
                                mb-2
                            "
                        >
                            <FaHome />
                        </div>


                        <h1
                            className="
                                text-xl
                                font-bold
                                text-[#D4AF37]
                            "
                        >
                            Handu Atelier
                        </h1>


                        <p
                            className="
                                text-[8px]
                                tracking-[2.5px]
                                text-gray-500
                                mt-1
                                whitespace-nowrap
                            "
                        >
                            ELEGANCE FOR EVERY MOMENT
                        </p>

                    </div>

                </div>


                {/* ==================================================
                    SIDEBAR MENU
                ================================================== */}

                <div
                    className="
                        admin-sidebar-scroll

                        flex-1

                        px-3
                        py-6
                    "
                >

                    {/* ==================================================
                        MENU UTAMA
                    ================================================== */}

                    <p
                        className="
                            text-[9px]
                            uppercase
                            tracking-[3px]
                            text-gray-600
                            px-4
                            mb-4
                        "
                    >
                        Menu Utama
                    </p>


                    <nav
                        className="
                            space-y-1
                        "
                    >

                        {menuUtama.map(
                            renderMenuItem
                        )}

                    </nav>


                    {/* ==================================================
                        LAPORAN
                    ================================================== */}

                    <div
                        className="
                            mt-8
                            pt-6
                            border-t
                            border-white/5
                        "
                    >

                        <p
                            className="
                                text-[9px]
                                uppercase
                                tracking-[3px]
                                text-gray-600
                                px-4
                                mb-4
                            "
                        >
                            Laporan
                        </p>


                        <nav
                            className="
                                space-y-1
                            "
                        >

                            {menuLaporan.map(
                                renderMenuItem
                            )}

                        </nav>

                    </div>


                    {/* ==================================================
                        PENGATURAN
                    ================================================== */}

                    <div
                        className="
                            mt-8
                            pt-6
                            border-t
                            border-white/5
                        "
                    >

                        <p
                            className="
                                text-[9px]
                                uppercase
                                tracking-[3px]
                                text-gray-600
                                px-4
                                mb-4
                            "
                        >
                            Pengaturan
                        </p>


                        <Link
                            to="/admin/pengaturan"
                            onClick={() =>
                                handleMenuClick(
                                    "pengaturan"
                                )
                            }
                            className={`
                                group
                                w-full
                                flex
                                items-center
                                gap-4
                                px-4
                                py-3.5
                                rounded-xl
                                transition

                                ${
                                    location.pathname ===
                                    "/admin/pengaturan"
                                        ? `
                                            bg-gradient-to-r
                                            from-[#D4AF37]/20
                                            to-[#D4AF37]/5
                                            border
                                            border-[#D4AF37]/20
                                            text-[#D4AF37]
                                          `
                                        : `
                                            text-gray-400
                                            hover:bg-white/[0.04]
                                            hover:text-white
                                          `
                                }
                            `}
                        >

                            <FaCog />

                            <span
                                className="
                                    text-sm
                                "
                            >
                                Pengaturan
                            </span>

                        </Link>


                        {/* ==================================================
                            LOGOUT
                        ================================================== */}

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="
                                group
                                w-full
                                flex
                                items-center
                                gap-4
                                px-4
                                py-3.5
                                mt-1
                                rounded-xl
                                text-red-400
                                hover:bg-red-500/5
                                transition
                            "
                        >

                            <FaSignOutAlt />

                            <span
                                className="
                                    text-sm
                                "
                            >
                                Keluar
                            </span>

                        </button>

                    </div>

                </div>


                {/* ==================================================
                    PROFILE SIDEBAR
                ================================================== */}

                <div
                    className="
                        flex-shrink-0

                        p-3

                        border-t
                        border-[#D4AF37]/10
                    "
                >

                    <div
                        className="
                            rounded-xl
                            bg-[#151515]
                            border
                            border-[#D4AF37]/10
                            p-3
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >

                            <div
                                className="
                                    w-9
                                    h-9
                                    rounded-full
                                    bg-[#D4AF37]
                                    text-black
                                    flex
                                    items-center
                                    justify-center
                                    font-bold
                                    flex-shrink-0
                                "
                            >
                                {
                                    user.nama
                                        ?.charAt(0)
                                        ?.toUpperCase() ||
                                    "A"
                                }
                            </div>


                            <div
                                className="
                                    min-w-0
                                "
                            >

                                <p
                                    className="
                                        text-xs
                                        font-semibold
                                        truncate
                                    "
                                >
                                    {
                                        user.nama ||
                                        "Admin"
                                    }
                                </p>


                                <p
                                    className="
                                        text-[10px]
                                        text-gray-500
                                        truncate
                                    "
                                >
                                    Admin
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </aside>


            {/* ==================================================
                MAIN CONTENT AREA
            ================================================== */}

            <main
                className="
                    lg:ml-[215px]

                    min-h-screen

                    admin-main-scroll
                "
            >

                {/* ==================================================
                    TOPBAR
                ================================================== */}

                <header
                    className="
                        sticky
                        top-0
                        z-30

                        h-[78px]

                        bg-[#090909]/95
                        backdrop-blur-md

                        border-b
                        border-white/[0.06]

                        flex
                        items-center
                        justify-between

                        px-5
                        md:px-8
                    "
                >

                    {/* ==================================================
                        LEFT TOPBAR
                    ================================================== */}

                    <div
                        className="
                            flex
                            items-center
                            gap-4
                        "
                    >

                        {/* MOBILE MENU */}

                        <button
                            type="button"
                            onClick={() =>
                                setMobileMenuOpen(
                                    true
                                )
                            }
                            className="
                                lg:hidden

                                w-10
                                h-10

                                rounded-xl

                                border
                                border-[#D4AF37]/20

                                bg-[#111111]

                                text-[#D4AF37]

                                flex
                                items-center
                                justify-center
                            "
                        >

                            <FaBars />

                        </button>


                        {/* TITLE */}

                        <div>

                            <h2
                                className="
                                    text-lg
                                    md:text-xl
                                    font-bold
                                    text-white
                                "
                            >
                                Dashboard
                            </h2>


                            <p
                                className="
                                    text-[9px]
                                    md:text-[10px]
                                    text-gray-500
                                    mt-1
                                "
                            >
                                Selamat datang kembali, Admin Handu Atelier
                            </p>

                        </div>

                    </div>


                    {/* ==================================================
                        RIGHT TOPBAR
                    ================================================== */}

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            md:gap-3
                        "
                    >

                        {/* ==================================================
                            DATE
                        ================================================== */}

                        <div
                            className="
                                hidden
                                md:flex
                                items-center
                                gap-3
                                pr-4
                                mr-1
                                border-r
                                border-white/[0.08]
                            "
                        >

                            <FaCalendarAlt
                                className="
                                    text-[#D4AF37]
                                    text-sm
                                "
                            />


                            <div>

                                <p
                                    className="
                                        text-[10px]
                                        text-gray-300
                                        font-medium
                                    "
                                >
                                    {new Date()
                                        .toLocaleDateString(
                                            "id-ID",
                                            {
                                                weekday:
                                                    "long",
                                                day:
                                                    "2-digit",
                                                month:
                                                    "long",
                                                year:
                                                    "numeric",
                                            }
                                        )}
                                </p>


                                <p
                                    className="
                                        text-[9px]
                                        text-gray-600
                                        mt-0.5
                                    "
                                >
                                    {new Date()
                                        .toLocaleTimeString(
                                            "id-ID",
                                            {
                                                hour:
                                                    "2-digit",
                                                minute:
                                                    "2-digit",
                                            }
                                        )}
                                </p>

                            </div>

                        </div>


                        {/* ==================================================
                            NOTIFICATION
                        ================================================== */}

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/admin/notifikasi"
                                )
                            }
                            title="Notifikasi"
                            className="
                                w-10
                                h-10

                                rounded-xl

                                border
                                border-[#D4AF37]/15

                                bg-[#111111]

                                text-gray-400

                                hover:text-[#D4AF37]
                                hover:border-[#D4AF37]/40

                                flex
                                items-center
                                justify-center

                                transition
                            "
                        >

                            <FaBell
                                className="
                                    text-sm
                                "
                            />

                        </button>


                        {/* ==================================================
                            HOME
                        ================================================== */}

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/")
                            }
                            title="Beranda"
                            className="
                                w-10
                                h-10

                                rounded-xl

                                border
                                border-[#D4AF37]/15

                                bg-[#111111]

                                text-gray-400

                                hover:text-[#D4AF37]
                                hover:border-[#D4AF37]/40

                                flex
                                items-center
                                justify-center

                                transition
                            "
                        >

                            <FaHome
                                className="
                                    text-sm
                                "
                            />

                        </button>


                        {/* ==================================================
                            LOGOUT
                        ================================================== */}

                        <button
                            type="button"
                            onClick={handleLogout}
                            title="Keluar"
                            className="
                                w-10
                                h-10

                                rounded-xl

                                border
                                border-red-500/20

                                bg-red-500/[0.03]

                                text-red-400

                                hover:bg-red-500/10
                                hover:border-red-500/40

                                flex
                                items-center
                                justify-center

                                transition
                            "
                        >

                            <FaSignOutAlt
                                className="
                                    text-sm
                                "
                            />

                        </button>


                        {/* ==================================================
                            PROFILE
                        ================================================== */}

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                ml-1
                            "
                        >

                            <div
                                className="
                                    w-10
                                    h-10

                                    rounded-full

                                    border
                                    border-[#D4AF37]/40

                                    bg-[#D4AF37]/10

                                    text-[#D4AF37]

                                    flex
                                    items-center
                                    justify-center

                                    font-semibold
                                "
                            >
                                {
                                    user.nama
                                        ?.charAt(0)
                                        ?.toUpperCase() ||
                                    "A"
                                }
                            </div>


                            <div
                                className="
                                    hidden
                                    xl:block
                                "
                            >

                                <p
                                    className="
                                        text-xs
                                        font-semibold
                                        text-white
                                    "
                                >
                                    {
                                        user.nama ||
                                        "Admin"
                                    }
                                </p>


                                <p
                                    className="
                                        text-[9px]
                                        text-gray-500
                                        mt-0.5
                                    "
                                >
                                    Admin
                                </p>

                            </div>

                        </div>

                    </div>

                </header>


                {/* ==================================================
                    CONTENT

                    PERBAIKAN UTAMA ADA DI SINI

                    Sebelumnya:
                    {children}

                    Sekarang:
                    padding kiri/kanan + atas/bawah
                ================================================== */}

                <div
                    className="
                        w-full
                        min-h-[calc(100vh-78px)]

                        px-6
                        md:px-8
                        lg:px-10

                        py-7
                        md:py-8
                    "
                >

                    {children}

                </div>

            </main>

        </div>

    );

}

export default AdminLayout;