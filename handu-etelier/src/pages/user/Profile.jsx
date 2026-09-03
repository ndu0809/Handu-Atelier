import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Profile() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ======================================================
    // CEK SESSION DAN ROLE
    // ======================================================

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                setError("");

                // ==================================================
                // PRIORITAS ADMIN
                // ==================================================

                const adminLoggedIn =
                    localStorage.getItem(
                        "isAdminLoggedIn"
                    ) === "true";

                const storedAdmin =
                    localStorage.getItem("admin");

                if (
                    adminLoggedIn &&
                    storedAdmin
                ) {
                    try {
                        const admin =
                            JSON.parse(
                                storedAdmin
                            );

                        if (
                            admin?.id_user &&
                            Number(
                                admin.id_role
                            ) === 1
                        ) {
                            // Admin tidak boleh masuk
                            // ke halaman profile user.
                            navigate(
                                "/admin/dashboard",
                                {
                                    replace: true
                                }
                            );

                            return;
                        }
                    } catch (adminError) {
                        console.error(
                            "Data admin tidak valid:",
                            adminError
                        );

                        localStorage.removeItem(
                            "admin"
                        );

                        localStorage.removeItem(
                            "isAdminLoggedIn"
                        );
                    }
                }

                // ==================================================
                // AMBIL USER SESSION
                // ==================================================

                const storedUser =
                    localStorage.getItem(
                        "user"
                    );

                if (!storedUser) {
                    navigate(
                        "/login",
                        {
                            replace: true
                        }
                    );

                    return;
                }

                let parsedUser;

                try {
                    parsedUser =
                        JSON.parse(
                            storedUser
                        );
                } catch (parseError) {
                    console.error(
                        "Data user tidak valid:",
                        parseError
                    );

                    localStorage.removeItem(
                        "user"
                    );

                    localStorage.removeItem(
                        "isLoggedIn"
                    );

                    navigate(
                        "/login",
                        {
                            replace: true
                        }
                    );

                    return;
                }

                if (
                    !parsedUser?.id_user
                ) {
                    localStorage.removeItem(
                        "user"
                    );

                    localStorage.removeItem(
                        "isLoggedIn"
                    );

                    navigate(
                        "/login",
                        {
                            replace: true
                        }
                    );

                    return;
                }

                // ==================================================
                // CEK ROLE DARI USER SESSION
                // ==================================================

                const role =
                    Number(
                        parsedUser.id_role
                    );

                // --------------------------------------------------
                // ROLE 1 = ADMIN
                // --------------------------------------------------

                if (role === 1) {
                    navigate(
                        "/admin/dashboard",
                        {
                            replace: true
                        }
                    );

                    return;
                }

                // --------------------------------------------------
                // ROLE 2 = PETUGAS
                // --------------------------------------------------

                if (role === 2) {
                    navigate(
                        "/petugas/profile",
                        {
                            replace: true
                        }
                    );

                    return;
                }

                // --------------------------------------------------
                // ROLE 3 = PELANGGAN
                // --------------------------------------------------

                if (role !== 3) {
                    navigate(
                        "/dashboard",
                        {
                            replace: true
                        }
                    );

                    return;
                }

                // ==================================================
                // AMBIL DATA TERBARU DARI BACKEND
                // ==================================================

                const response =
                    await fetch(
                        `/users/${parsedUser.id_user}`
                    );

                const result =
                    await response.json();

                console.log(
                    "Profile response:",
                    result
                );

                if (!response.ok) {
                    throw new Error(
                        result?.message ||
                        "Gagal mengambil data profil."
                    );
                }

                const profileData =
                    result?.data ||
                    result?.user ||
                    result;

                if (
                    !profileData ||
                    !profileData.id_user
                ) {
                    throw new Error(
                        "Data profil tidak ditemukan."
                    );
                }

                // Pastikan data yang disimpan
                // memang tetap role pelanggan.
                if (
                    Number(
                        profileData.id_role
                    ) !== 3
                ) {
                    if (
                        Number(
                            profileData.id_role
                        ) === 1
                    ) {
                        navigate(
                            "/admin/dashboard",
                            {
                                replace: true
                            }
                        );

                        return;
                    }

                    if (
                        Number(
                            profileData.id_role
                        ) === 2
                    ) {
                        navigate(
                            "/petugas/profile",
                            {
                                replace: true
                            }
                        );

                        return;
                    }

                    throw new Error(
                        "Role akun tidak dikenali."
                    );
                }

                // Simpan data terbaru
                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        profileData
                    )
                );

                setUser(
                    profileData
                );

            } catch (err) {
                console.error(
                    "Profile error:",
                    err
                );

                setError(
                    err?.message ||
                    "Gagal memuat profil."
                );

            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [navigate]);

    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {
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
                    "
                >
                    Memuat profil...
                </p>
            </div>
        );
    }

    // ======================================================
    // ERROR
    // ======================================================

    if (error) {
        return (
            <div
                className="
                    min-h-screen
                    bg-[#090909]
                    text-white
                    flex
                    items-center
                    justify-center
                    px-6
                "
            >
                <div
                    className="
                        max-w-lg
                        w-full
                        rounded-3xl
                        border
                        border-red-500/20
                        bg-[#141414]
                        p-8
                        text-center
                    "
                >

                    <h1
                        className="
                            text-2xl
                            font-bold
                            text-red-400
                        "
                    >
                        Profil Tidak Dapat Dimuat
                    </h1>

                    <p
                        className="
                            text-gray-400
                            mt-4
                        "
                    >
                        {error}
                    </p>

                    <div
                        className="
                            flex
                            justify-center
                            gap-3
                            mt-8
                        "
                    >

                        <Link
                            to="/dashboard"
                            className="
                                px-5
                                py-3
                                rounded-xl
                                bg-[#D4AF37]
                                text-black
                                font-semibold
                                hover:scale-[1.02]
                                transition
                            "
                        >
                            Dashboard
                        </Link>

                        <Link
                            to="/"
                            className="
                                px-5
                                py-3
                                rounded-xl
                                border
                                border-[#D4AF37]/30
                                text-[#D4AF37]
                                hover:bg-[#D4AF37]/10
                                transition
                            "
                        >
                            Beranda
                        </Link>

                    </div>

                </div>
            </div>
        );
    }

    // ======================================================
    // PROFILE USER
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
                HEADER
            ================================================== */}

            <header
                className="
                    border-b
                    border-[#D4AF37]/20
                    bg-[#0d0d0d]
                "
            >

                <div
                    className="
                        max-w-6xl
                        mx-auto
                        px-6
                        py-6
                        flex
                        items-center
                        justify-between
                        gap-4
                    "
                >

                    <div>

                        <p
                            className="
                                uppercase
                                tracking-[4px]
                                text-[#D4AF37]
                                text-xs
                            "
                        >
                            Account
                        </p>

                        <h1
                            className="
                                text-3xl
                                md:text-4xl
                                font-bold
                                mt-2
                            "
                        >
                            Profil Saya
                        </h1>

                        <p
                            className="
                                text-gray-400
                                mt-2
                            "
                        >
                            Kelola informasi akun Anda
                        </p>

                    </div>

                    <div
                        className="
                            flex
                            flex-wrap
                            justify-end
                            gap-3
                        "
                    >

                        <Link
                            to="/dashboard"
                            className="
                                px-5
                                py-3
                                rounded-xl
                                bg-[#D4AF37]
                                text-black
                                font-semibold
                                hover:scale-[1.02]
                                transition
                            "
                        >
                            Dashboard
                        </Link>

                        <Link
                            to="/"
                            className="
                                px-5
                                py-3
                                rounded-xl
                                border
                                border-[#D4AF37]/30
                                text-[#D4AF37]
                                hover:bg-[#D4AF37]/10
                                transition
                            "
                        >
                            Beranda
                        </Link>

                    </div>

                </div>

            </header>

            {/* ==================================================
                MAIN
            ================================================== */}

            <main
                className="
                    max-w-6xl
                    mx-auto
                    px-6
                    py-12
                "
            >

                {/* ==================================================
                    PROFILE CARD
                ================================================== */}

                <section
                    className="
                        rounded-3xl
                        border
                        border-[#D4AF37]/20
                        bg-[#141414]
                        overflow-hidden
                    "
                >

                    <div
                        className="
                            px-8
                            py-8
                            border-b
                            border-white/5
                        "
                    >

                        <p
                            className="
                                uppercase
                                tracking-[4px]
                                text-[#D4AF37]
                                text-sm
                            "
                        >
                            Account Profile
                        </p>

                        <h2
                            className="
                                text-3xl
                                md:text-4xl
                                font-bold
                                mt-3
                            "
                        >
                            Informasi Akun
                        </h2>

                    </div>

                    <div
                        className="p-8"
                    >

                        <div
                            className="
                                grid
                                md:grid-cols-2
                                gap-6
                            "
                        >

                            {/* NAMA */}

                            <div
                                className="
                                    rounded-2xl
                                    bg-[#1b1b1b]
                                    border
                                    border-white/5
                                    p-5
                                "
                            >

                                <p
                                    className="
                                        text-gray-500
                                        text-sm
                                    "
                                >
                                    Nama Lengkap
                                </p>

                                <p
                                    className="
                                        text-lg
                                        font-semibold
                                        mt-2
                                    "
                                >
                                    {
                                        user?.nama ||
                                        "-"
                                    }
                                </p>

                            </div>

                            {/* EMAIL */}

                            <div
                                className="
                                    rounded-2xl
                                    bg-[#1b1b1b]
                                    border
                                    border-white/5
                                    p-5
                                "
                            >

                                <p
                                    className="
                                        text-gray-500
                                        text-sm
                                    "
                                >
                                    Email
                                </p>

                                <p
                                    className="
                                        text-lg
                                        font-semibold
                                        mt-2
                                        break-all
                                    "
                                >
                                    {
                                        user?.email ||
                                        "-"
                                    }
                                </p>

                            </div>

                            {/* NO HP */}

                            <div
                                className="
                                    rounded-2xl
                                    bg-[#1b1b1b]
                                    border
                                    border-white/5
                                    p-5
                                "
                            >

                                <p
                                    className="
                                        text-gray-500
                                        text-sm
                                    "
                                >
                                    Nomor HP
                                </p>

                                <p
                                    className="
                                        text-lg
                                        font-semibold
                                        mt-2
                                    "
                                >
                                    {
                                        user?.no_hp ||
                                        "-"
                                    }
                                </p>

                            </div>

                            {/* ROLE */}

                            <div
                                className="
                                    rounded-2xl
                                    bg-[#1b1b1b]
                                    border
                                    border-white/5
                                    p-5
                                "
                            >

                                <p
                                    className="
                                        text-gray-500
                                        text-sm
                                    "
                                >
                                    Role
                                </p>

                                <p
                                    className="
                                        text-lg
                                        font-semibold
                                        mt-2
                                    "
                                >
                                    {
                                        user?.nama_role ||
                                        user?.role ||
                                        "Pelanggan"
                                    }
                                </p>

                            </div>

                        </div>

                        {/* ALAMAT */}

                        <div
                            className="
                                mt-6
                                rounded-2xl
                                bg-[#1b1b1b]
                                border
                                border-white/5
                                p-5
                            "
                        >

                            <p
                                className="
                                    text-gray-500
                                    text-sm
                                "
                            >
                                Alamat
                            </p>

                            <p
                                className="
                                    text-lg
                                    font-semibold
                                    mt-2
                                    leading-7
                                "
                            >
                                {
                                    user?.alamat ||
                                    "-"
                                }
                            </p>

                        </div>

                    </div>

                </section>

                {/* ==================================================
                    QUICK ACTION
                ================================================== */}

                <section
                    className="
                        grid
                        md:grid-cols-3
                        gap-6
                        mt-8
                    "
                >

                    <Link
                        to="/dashboard"
                        className="
                            rounded-3xl
                            border
                            border-[#D4AF37]/20
                            bg-[#141414]
                            p-6
                            hover:border-[#D4AF37]/60
                            hover:-translate-y-1
                            transition-all
                        "
                    >

                        <p
                            className="
                                text-[#D4AF37]
                                text-sm
                                font-semibold
                            "
                        >
                            Dashboard
                        </p>

                        <h3
                            className="
                                text-xl
                                font-bold
                                mt-2
                            "
                        >
                            Kembali ke Dashboard
                        </h3>

                        <p
                            className="
                                text-gray-400
                                text-sm
                                mt-3
                            "
                        >
                            Lihat ringkasan akun dan
                            aktivitas Anda.
                        </p>

                    </Link>

                    <Link
                        to="/my-borrowings"
                        className="
                            rounded-3xl
                            border
                            border-[#D4AF37]/20
                            bg-[#141414]
                            p-6
                            hover:border-[#D4AF37]/60
                            hover:-translate-y-1
                            transition-all
                        "
                    >

                        <p
                            className="
                                text-[#D4AF37]
                                text-sm
                                font-semibold
                            "
                        >
                            Peminjaman
                        </p>

                        <h3
                            className="
                                text-xl
                                font-bold
                                mt-2
                            "
                        >
                            Peminjaman Saya
                        </h3>

                        <p
                            className="
                                text-gray-400
                                text-sm
                                mt-3
                            "
                        >
                            Lihat riwayat dan status
                            peminjaman kostum.
                        </p>

                    </Link>

                    <Link
                        to="/settings"
                        className="
                            rounded-3xl
                            border
                            border-[#D4AF37]/20
                            bg-[#141414]
                            p-6
                            hover:border-[#D4AF37]/60
                            hover:-translate-y-1
                            transition-all
                        "
                    >

                        <p
                            className="
                                text-[#D4AF37]
                                text-sm
                                font-semibold
                            "
                        >
                            Pengaturan
                        </p>

                        <h3
                            className="
                                text-xl
                                font-bold
                                mt-2
                            "
                        >
                            Pengaturan Akun
                        </h3>

                        <p
                            className="
                                text-gray-400
                                text-sm
                                mt-3
                            "
                        >
                            Kelola data dan keamanan
                            akun Anda.
                        </p>

                    </Link>

                </section>

            </main>

        </div>
    );
}

export default Profile;