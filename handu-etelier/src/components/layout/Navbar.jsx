import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    PiCrownSimpleFill
} from "react-icons/pi";

import {
    HiOutlineMenuAlt3,
    HiOutlineX
} from "react-icons/hi";

function Navbar() {

    const [
        open,
        setOpen
    ] = useState(false);

    const [
        user,
        setUser
    ] = useState(null);

    const location =
        useLocation();

    const navigate =
        useNavigate();

    // ======================================================
    // CEK SESSION USER
    // ======================================================

    useEffect(() => {

        const storedUser =
            localStorage.getItem(
                "user"
            );

        if (!storedUser) {

            setUser(null);

            return;
        }

        try {

            const parsedUser =
                JSON.parse(
                    storedUser
                );

            if (
                parsedUser?.id_user
            ) {

                setUser(
                    parsedUser
                );

            } else {

                setUser(null);
            }

        } catch (error) {

            console.error(
                "Data user tidak valid:",
                error
            );

            localStorage.removeItem(
                "user"
            );

            localStorage.removeItem(
                "isLoggedIn"
            );

            setUser(null);
        }

    }, [
        location
    ]);

    // ======================================================
    // ROLE
    // ======================================================

    /*
        1 = ADMIN
        2 = PETUGAS
        selain itu = USER / MEMBER
    */

    const userRole =
        Number(
            user?.id_role
        );

    // ======================================================
    // DASHBOARD
    // ======================================================

    const dashboardPath =
        userRole === 1
            ? "/admin/dashboard"
            : userRole === 2
                ? "/petugas/dashboard"
                : "/dashboard";

    // ======================================================
    // PROFILE
    // ======================================================

    const profilePath =
        userRole === 2
            ? "/petugas/profile"
            : "/profile";

    // ======================================================
    // LOGOUT
    // ======================================================

    const handleLogout =
        () => {

            localStorage.removeItem(
                "user"
            );

            localStorage.removeItem(
                "isLoggedIn"
            );

            setUser(null);

            setOpen(false);

            navigate(
                "/login",
                {
                    replace: true
                }
            );
        };

    // ======================================================
    // MENU UTAMA
    // ======================================================

    const menu = [

        {
            label: "Beranda",
            href: "/"
        },

        {
            label: "Tentang",
            href: "/#about"
        },

        {
            label: "Mengapa Kami",
            href: "/#features"
        },

        {
            label: "Cara Sewa",
            href: "/#how-to-rent"
        },

        {
            label: "Koleksi",
            href: "/#collections"
        },

        {
            label: "Kontak",
            href: "/#footer"
        }

    ];

    return (

        <header
            className="
                fixed
                top-0
                left-0
                w-full
                z-50
                py-4
                md:py-6
            "
        >

            <div
                className="
                    max-w-7xl
                    mx-auto
                    px-4
                    sm:px-6
                "
            >

                {/* ==================================================
                    NAVBAR
                ================================================== */}

                <nav
                    className="
                        flex
                        items-center
                        justify-between
                        rounded-3xl
                        px-5
                        py-4
                        bg-black/45
                        backdrop-blur-2xl
                        border
                        border-[#D4AF37]/20
                        shadow-[0_20px_60px_rgba(0,0,0,.45)]
                    "
                >

                    {/* ==================================================
                        LOGO
                    ================================================== */}

                    <Link
                        to="/"
                        onClick={() =>
                            setOpen(false)
                        }
                        className="
                            flex
                            items-center
                            gap-3
                            group
                        "
                    >

                        <PiCrownSimpleFill
                            className="
                                w-8
                                h-8
                                md:w-10
                                md:h-10
                                text-[#D4AF37]
                                group-hover:rotate-12
                                duration-300
                            "
                        />

                        <div>

                            <h1
                                className="
                                    text-xl
                                    md:text-4xl
                                    font-bold
                                    text-[#D4AF37]
                                "
                            >
                                Handu Atelier
                            </h1>

                            <p
                                className="
                                    hidden
                                    md:block
                                    text-sm
                                    tracking-[6px]
                                    text-gray-400
                                "
                            >
                                ELEGANCE FOR EVERY MOMENT
                            </p>

                        </div>

                    </Link>

                    {/* ==================================================
                        DESKTOP MENU
                    ================================================== */}

                    <ul
                        className="
                            hidden
                            xl:flex
                            items-center
                            gap-8
                        "
                    >

                        {menu.map(
                            (
                                item
                            ) => (

                                <li
                                    key={
                                        item.label
                                    }
                                >

                                    <a
                                        href={
                                            item.href
                                        }
                                        className="
                                            relative
                                            text-gray-300
                                            hover:text-[#D4AF37]
                                            transition-all
                                            duration-300
                                            after:absolute
                                            after:left-0
                                            after:-bottom-2
                                            after:h-0.5
                                            after:w-0
                                            after:bg-[#D4AF37]
                                            hover:after:w-full
                                            after:duration-300
                                        "
                                    >
                                        {
                                            item.label
                                        }
                                    </a>

                                </li>

                            )
                        )}

                    </ul>

                    {/* ==================================================
                        ACCOUNT DESKTOP
                    ================================================== */}

                    <div
                        className="
                            hidden
                            xl:flex
                            items-center
                            gap-3
                        "
                    >

                        {!user ? (

                            <Link
                                to="/login"
                                className="
                                    px-7
                                    py-3
                                    rounded-full
                                    bg-[#D4AF37]
                                    text-black
                                    font-semibold
                                    hover:scale-105
                                    hover:shadow-[0_10px_25px_rgba(212,175,55,.35)]
                                    transition-all
                                    duration-300
                                "
                            >
                                Masuk / Daftar
                            </Link>

                        ) : (

                            <>

                                {/* DASHBOARD */}

                                <Link
                                    to={
                                        dashboardPath
                                    }
                                    className="
                                        px-5
                                        py-3
                                        rounded-full
                                        border
                                        border-[#D4AF37]/30
                                        text-gray-200
                                        hover:text-[#D4AF37]
                                        hover:border-[#D4AF37]
                                        transition
                                    "
                                >
                                    Dashboard
                                </Link>

                                {/* PROFILE */}

                                <Link
                                    to={
                                        profilePath
                                    }
                                    className="
                                        px-5
                                        py-3
                                        rounded-full
                                        bg-[#D4AF37]
                                        text-black
                                        font-semibold
                                        hover:scale-105
                                        transition
                                    "
                                >
                                    Profil
                                </Link>

                                {/* LOGOUT */}

                                <button
                                    type="button"
                                    onClick={
                                        handleLogout
                                    }
                                    className="
                                        px-5
                                        py-3
                                        rounded-full
                                        border
                                        border-red-500/30
                                        text-red-400
                                        hover:bg-red-500/10
                                        transition
                                    "
                                >
                                    Keluar
                                </button>

                            </>

                        )}

                    </div>

                    {/* ==================================================
                        MOBILE BUTTON
                    ================================================== */}

                    <button
                        type="button"
                        onClick={() =>
                            setOpen(
                                !open
                            )
                        }
                        className="
                            xl:hidden
                            text-[#D4AF37]
                        "
                        aria-label={
                            open
                                ? "Tutup menu"
                                : "Buka menu"
                        }
                    >

                        {open ? (

                            <HiOutlineX
                                size={32}
                            />

                        ) : (

                            <HiOutlineMenuAlt3
                                size={32}
                            />

                        )}

                    </button>

                </nav>

                {/* ==================================================
                    MOBILE MENU
                ================================================== */}

                {open && (

                    <div
                        className="
                            xl:hidden
                            mt-4
                            rounded-3xl
                            bg-[#111]
                            backdrop-blur-xl
                            border
                            border-[#D4AF37]/20
                            shadow-[0_15px_40px_rgba(0,0,0,.35)]
                            p-6
                        "
                    >

                        <ul
                            className="
                                space-y-6
                            "
                        >

                            {menu.map(
                                (
                                    item
                                ) => (

                                    <li
                                        key={
                                            item.label
                                        }
                                    >

                                        <a
                                            href={
                                                item.href
                                            }
                                            onClick={() =>
                                                setOpen(
                                                    false
                                                )
                                            }
                                            className="
                                                block
                                                text-gray-300
                                                hover:text-[#D4AF37]
                                                duration-300
                                            "
                                        >
                                            {
                                                item.label
                                            }
                                        </a>

                                    </li>

                                )
                            )}

                        </ul>

                        {/* ==================================================
                            MOBILE ACCOUNT
                        ================================================== */}

                        <div
                            className="
                                mt-8
                                pt-6
                                border-t
                                border-white/10
                            "
                        >

                            {!user ? (

                                <Link
                                    to="/login"
                                    onClick={() =>
                                        setOpen(
                                            false
                                        )
                                    }
                                    className="
                                        block
                                        w-full
                                        py-3
                                        rounded-xl
                                        bg-[#D4AF37]
                                        text-black
                                        font-semibold
                                        text-center
                                        hover:scale-[1.02]
                                        transition-all
                                    "
                                >
                                    Masuk / Daftar
                                </Link>

                            ) : (

                                <div
                                    className="
                                        space-y-3
                                    "
                                >

                                    {/* USER */}

                                    <div
                                        className="
                                            mb-4
                                        "
                                    >

                                        <p
                                            className="
                                                text-xs
                                                text-gray-500
                                            "
                                        >
                                            Masuk sebagai
                                        </p>

                                        <p
                                            className="
                                                text-[#D4AF37]
                                                font-semibold
                                                mt-1
                                            "
                                        >
                                            {
                                                user.nama ||
                                                "User"
                                            }
                                        </p>

                                    </div>

                                    {/* DASHBOARD */}

                                    <Link
                                        to={
                                            dashboardPath
                                        }
                                        onClick={() =>
                                            setOpen(
                                                false
                                            )
                                        }
                                        className="
                                            block
                                            w-full
                                            py-3
                                            rounded-xl
                                            border
                                            border-[#D4AF37]/20
                                            text-center
                                            text-gray-200
                                            hover:text-[#D4AF37]
                                            transition
                                        "
                                    >
                                        Dashboard
                                    </Link>

                                    {/* PROFILE */}

                                    <Link
                                        to={
                                            profilePath
                                        }
                                        onClick={() =>
                                            setOpen(
                                                false
                                            )
                                        }
                                        className="
                                            block
                                            w-full
                                            py-3
                                            rounded-xl
                                            border
                                            border-[#D4AF37]/20
                                            text-center
                                            text-gray-200
                                            hover:text-[#D4AF37]
                                            transition
                                        "
                                    >
                                        Profil
                                    </Link>

                                    {/* SETTINGS */}

                                    {userRole !== 2 && (

                                        <Link
                                            to="/settings"
                                            onClick={() =>
                                                setOpen(
                                                    false
                                                )
                                            }
                                            className="
                                                block
                                                w-full
                                                py-3
                                                rounded-xl
                                                border
                                                border-[#D4AF37]/20
                                                text-center
                                                text-gray-200
                                                hover:text-[#D4AF37]
                                                transition
                                            "
                                        >
                                            Pengaturan
                                        </Link>

                                    )}

                                    {/* LOGOUT */}

                                    <button
                                        type="button"
                                        onClick={
                                            handleLogout
                                        }
                                        className="
                                            block
                                            w-full
                                            py-3
                                            rounded-xl
                                            border
                                            border-red-500/30
                                            text-red-400
                                            text-center
                                            hover:bg-red-500/10
                                            transition
                                        "
                                    >
                                        Keluar
                                    </button>

                                </div>

                            )}

                        </div>

                    </div>

                )}

            </div>

        </header>
    );
}

export default Navbar;