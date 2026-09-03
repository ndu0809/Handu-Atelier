import { useEffect, useState } from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    FaUserCircle,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaSave,
    FaArrowLeft,
    FaLock,
} from "react-icons/fa";

function StaffProfile() {
    const navigate = useNavigate();

    // ==========================================
    // USER SESSION
    // ==========================================

    const [user, setUser] = useState(null);

    // ==========================================
    // PROFILE FORM
    // ==========================================

    const [form, setForm] = useState({
        nama: "",
        email: "",
        no_hp: "",
        alamat: "",
    });

    // ==========================================
    // PASSWORD FORM
    // ==========================================

    const [passwordForm, setPasswordForm] = useState({
        password_lama: "",
        password_baru: "",
        konfirmasi_password: "",
    });

    // ==========================================
    // UI STATE
    // ==========================================

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] =
        useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ==========================================
    // LOAD SESSION
    // ==========================================

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

            if (!parsedUser?.id_user) {
                throw new Error(
                    "Data user tidak valid."
                );
            }

            // ROLE 2 = PETUGAS
            if (
                Number(parsedUser.id_role) !== 2
            ) {
                navigate("/dashboard", {
                    replace: true,
                });

                return;
            }

            setUser(parsedUser);

            setForm({
                nama:
                    parsedUser.nama || "",
                email:
                    parsedUser.email || "",
                no_hp:
                    parsedUser.no_hp || "",
                alamat:
                    parsedUser.alamat || "",
            });
        } catch (err) {
            console.error(
                "Session error:",
                err
            );

            localStorage.removeItem("user");
            localStorage.removeItem(
                "isLoggedIn"
            );

            navigate("/login", {
                replace: true,
            });
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    // ==========================================
    // HANDLE PROFILE INPUT
    // ==========================================

    const handleChange = (e) => {
        const {
            name,
            value,
        } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };

    // ==========================================
    // HANDLE PASSWORD INPUT
    // ==========================================

    const handlePasswordChange = (e) => {
        const {
            name,
            value,
        } = e.target;

        setPasswordForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };

    // ==========================================
    // SAVE PROFILE
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user?.id_user) {
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const response = await fetch(
                `/users/${user.id_user}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        nama:
                            form.nama.trim(),

                        email:
                            form.email.trim(),

                        no_hp:
                            form.no_hp.trim(),

                        alamat:
                            form.alamat.trim(),
                    }),
                }
            );

            const raw =
                await response.text();

            let result = {};

            try {
                result = raw
                    ? JSON.parse(raw)
                    : {};
            } catch {
                throw new Error(
                    "Server mengembalikan response yang bukan JSON."
                );
            }

            if (!response.ok) {
                throw new Error(
                    result.message ||
                        "Gagal memperbarui profil."
                );
            }

            // =====================================
            // UPDATE LOCAL STORAGE
            // =====================================

            const updatedUser = {
                ...user,

                nama:
                    form.nama.trim(),

                email:
                    form.email.trim(),

                no_hp:
                    form.no_hp.trim(),

                alamat:
                    form.alamat.trim(),
            };

            localStorage.setItem(
                "user",
                JSON.stringify(
                    updatedUser
                )
            );

            setUser(updatedUser);

            setSuccess(
                "Profil berhasil diperbarui."
            );
        } catch (err) {
            console.error(
                "Update profile:",
                err
            );

            setError(
                err.message ||
                    "Gagal memperbarui profil."
            );
        } finally {
            setSaving(false);
        }
    };

    // ==========================================
    // CHANGE PASSWORD
    // ==========================================

    const handleChangePassword =
        async (e) => {
            e.preventDefault();

            if (!user?.id_user) {
                return;
            }

            // ======================================
            // VALIDASI
            // ======================================

            if (
                !passwordForm.password_lama ||
                !passwordForm.password_baru ||
                !passwordForm
                    .konfirmasi_password
            ) {
                setError(
                    "Semua field password wajib diisi."
                );

                return;
            }

            if (
                passwordForm.password_baru
                    .length < 6
            ) {
                setError(
                    "Password baru minimal 6 karakter."
                );

                return;
            }

            if (
                passwordForm.password_baru !==
                passwordForm
                    .konfirmasi_password
            ) {
                setError(
                    "Konfirmasi password tidak sama."
                );

                return;
            }

            try {
                setChangingPassword(
                    true
                );

                setError("");
                setSuccess("");

                const response =
                    await fetch(
                        "/users/change-password",
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json",
                            },

                            body: JSON.stringify({
                                id_user:
                                    user.id_user,

                                password_lama:
                                    passwordForm.password_lama,

                                password_baru:
                                    passwordForm.password_baru,
                            }),
                        }
                    );

                const raw =
                    await response.text();

                let result = {};

                try {
                    result = raw
                        ? JSON.parse(raw)
                        : {};
                } catch {
                    throw new Error(
                        "Server mengembalikan response yang bukan JSON."
                    );
                }

                if (!response.ok) {
                    throw new Error(
                        result.message ||
                            "Gagal mengubah password."
                    );
                }

                // ======================================
                // RESET FORM
                // ======================================

                setPasswordForm({
                    password_lama: "",
                    password_baru: "",
                    konfirmasi_password:
                        "",
                });

                setSuccess(
                    "Password berhasil diubah."
                );
            } catch (err) {
                console.error(
                    "Change password:",
                    err
                );

                setError(
                    err.message ||
                        "Gagal mengubah password."
                );
            } finally {
                setChangingPassword(
                    false
                );
            }
        };

    // ==========================================
    // LOADING
    // ==========================================

    if (
        loading ||
        !user
    ) {
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
                <p className="text-[#D4AF37]">
                    Memuat profil...
                </p>
            </div>
        );
    }

    // ==========================================
    // RENDER
    // ==========================================

    return (
        <div
            className="
                min-h-screen
                bg-[#090909]
                text-white
            "
        >
            {/* ==========================================
                HEADER
            ========================================== */}

            <header
                className="
                    bg-[#111111]
                    border-b
                    border-[#D4AF37]/20
                "
            >
                <div
                    className="
                        max-w-5xl
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
                                text-[#D4AF37]
                                uppercase
                                tracking-[4px]
                                text-xs
                            "
                        >
                            Petugas Area
                        </p>

                        <h1
                            className="
                                text-3xl
                                font-bold
                                mt-2
                            "
                        >
                            Profil Petugas
                        </h1>
                    </div>

                    <Link
                        to="/petugas/dashboard"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            px-5
                            py-3
                            rounded-xl
                            border
                            border-[#D4AF37]/20
                            text-[#D4AF37]
                            hover:bg-[#D4AF37]/10
                            transition
                        "
                    >
                        <FaArrowLeft />
                        Dashboard
                    </Link>
                </div>
            </header>

            <main
                className="
                    max-w-5xl
                    mx-auto
                    px-6
                    py-10
                "
            >
                {/* ==========================================
                    ERROR
                ========================================== */}

                {error && (
                    <div
                        className="
                            mb-6
                            rounded-2xl
                            border
                            border-red-500/20
                            bg-red-500/10
                            text-red-400
                            px-5
                            py-4
                        "
                    >
                        {error}
                    </div>
                )}

                {/* ==========================================
                    SUCCESS
                ========================================== */}

                {success && (
                    <div
                        className="
                            mb-6
                            rounded-2xl
                            border
                            border-green-500/20
                            bg-green-500/10
                            text-green-400
                            px-5
                            py-4
                        "
                    >
                        {success}
                    </div>
                )}

                {/* ==========================================
                    PROFILE + FORM
                ========================================== */}

                <div
                    className="
                        grid
                        lg:grid-cols-[280px_1fr]
                        gap-6
                    "
                >
                    {/* ======================================
                        PROFILE CARD
                    ====================================== */}

                    <section
                        className="
                            rounded-3xl
                            bg-[#141414]
                            border
                            border-[#D4AF37]/15
                            p-7
                            h-fit
                        "
                    >
                        <div
                            className="
                                w-24
                                h-24
                                mx-auto
                                rounded-full
                                bg-[#D4AF37]/10
                                border
                                border-[#D4AF37]/20
                                text-[#D4AF37]
                                flex
                                items-center
                                justify-center
                                text-4xl
                            "
                        >
                            <FaUserCircle />
                        </div>

                        <div className="text-center mt-5">
                            <h2
                                className="
                                    text-xl
                                    font-bold
                                "
                            >
                                {user.nama ||
                                    "Petugas"}
                            </h2>

                            <p
                                className="
                                    text-[#D4AF37]
                                    text-sm
                                    mt-1
                                "
                            >
                                Petugas
                            </p>

                            <p
                                className="
                                    text-gray-600
                                    text-xs
                                    mt-3
                                    break-all
                                "
                            >
                                ID User:{" "}
                                {user.id_user}
                            </p>
                        </div>
                    </section>

                    {/* ======================================
                        PROFILE FORM
                    ====================================== */}

                    <section
                        className="
                            rounded-3xl
                            bg-[#141414]
                            border
                            border-[#D4AF37]/15
                            p-7
                        "
                    >
                        <div className="mb-7">
                            <p
                                className="
                                    text-[#D4AF37]
                                    uppercase
                                    tracking-[4px]
                                    text-xs
                                "
                            >
                                Account
                            </p>

                            <h2
                                className="
                                    text-2xl
                                    font-bold
                                    mt-2
                                "
                            >
                                Informasi Profil
                            </h2>

                            <p
                                className="
                                    text-gray-500
                                    text-sm
                                    mt-2
                                "
                            >
                                Perbarui informasi
                                profil petugas.
                            </p>
                        </div>

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="
                                space-y-5
                            "
                        >
                            {/* NAMA */}

                            <div>
                                <label
                                    className="
                                        block
                                        text-sm
                                        text-gray-400
                                        mb-2
                                    "
                                >
                                    Nama
                                </label>

                                <div className="relative">
                                    <FaUserCircle
                                        className="
                                            absolute
                                            left-4
                                            top-1/2
                                            -translate-y-1/2
                                            text-gray-600
                                        "
                                    />

                                    <input
                                        type="text"
                                        name="nama"
                                        value={
                                            form.nama
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                        className="
                                            w-full
                                            pl-11
                                            pr-4
                                            py-3.5
                                            rounded-xl
                                            bg-[#1D1D1D]
                                            border
                                            border-white/10
                                            text-white
                                            outline-none
                                            focus:border-[#D4AF37]
                                        "
                                    />
                                </div>
                            </div>

                            {/* EMAIL */}

                            <div>
                                <label
                                    className="
                                        block
                                        text-sm
                                        text-gray-400
                                        mb-2
                                    "
                                >
                                    Email
                                </label>

                                <div className="relative">
                                    <FaEnvelope
                                        className="
                                            absolute
                                            left-4
                                            top-1/2
                                            -translate-y-1/2
                                            text-gray-600
                                        "
                                    />

                                    <input
                                        type="email"
                                        name="email"
                                        value={
                                            form.email
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                        className="
                                            w-full
                                            pl-11
                                            pr-4
                                            py-3.5
                                            rounded-xl
                                            bg-[#1D1D1D]
                                            border
                                            border-white/10
                                            text-white
                                            outline-none
                                            focus:border-[#D4AF37]
                                        "
                                    />
                                </div>
                            </div>

                            {/* NO HP */}

                            <div>
                                <label
                                    className="
                                        block
                                        text-sm
                                        text-gray-400
                                        mb-2
                                    "
                                >
                                    No. HP
                                </label>

                                <div className="relative">
                                    <FaPhone
                                        className="
                                            absolute
                                            left-4
                                            top-1/2
                                            -translate-y-1/2
                                            text-gray-600
                                        "
                                    />

                                    <input
                                        type="text"
                                        name="no_hp"
                                        value={
                                            form.no_hp
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="
                                            w-full
                                            pl-11
                                            pr-4
                                            py-3.5
                                            rounded-xl
                                            bg-[#1D1D1D]
                                            border
                                            border-white/10
                                            text-white
                                            outline-none
                                            focus:border-[#D4AF37]
                                        "
                                    />
                                </div>
                            </div>

                            {/* ALAMAT */}

                            <div>
                                <label
                                    className="
                                        block
                                        text-sm
                                        text-gray-400
                                        mb-2
                                    "
                                >
                                    Alamat
                                </label>

                                <div className="relative">
                                    <FaMapMarkerAlt
                                        className="
                                            absolute
                                            left-4
                                            top-4
                                            text-gray-600
                                        "
                                    />

                                    <textarea
                                        name="alamat"
                                        value={
                                            form.alamat
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        rows="4"
                                        className="
                                            w-full
                                            pl-11
                                            pr-4
                                            py-3.5
                                            rounded-xl
                                            bg-[#1D1D1D]
                                            border
                                            border-white/10
                                            text-white
                                            outline-none
                                            focus:border-[#D4AF37]
                                            resize-none
                                        "
                                    />
                                </div>
                            </div>

                            {/* BUTTON */}

                            <div
                                className="
                                    pt-3
                                    flex
                                    flex-wrap
                                    gap-3
                                "
                            >
                                <button
                                    type="submit"
                                    disabled={
                                        saving
                                    }
                                    className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        gap-2
                                        px-6
                                        py-3
                                        rounded-xl
                                        bg-[#D4AF37]
                                        text-black
                                        font-semibold
                                        hover:brightness-110
                                        transition
                                        disabled:opacity-50
                                        disabled:cursor-not-allowed
                                    "
                                >
                                    <FaSave />

                                    {saving
                                        ? "Menyimpan..."
                                        : "Simpan Profil"}
                                </button>

                                <Link
                                    to="/petugas/dashboard"
                                    className="
                                        px-6
                                        py-3
                                        rounded-xl
                                        border
                                        border-white/10
                                        text-gray-400
                                        hover:text-white
                                        transition
                                    "
                                >
                                    Batal
                                </Link>
                            </div>
                        </form>
                    </section>
                </div>

                {/* ==========================================
                    CHANGE PASSWORD
                ========================================== */}

                <section
                    className="
                        mt-6
                        rounded-3xl
                        bg-[#141414]
                        border
                        border-[#D4AF37]/15
                        p-7
                    "
                >
                    <div className="mb-7">
                        <p
                            className="
                                text-[#D4AF37]
                                uppercase
                                tracking-[4px]
                                text-xs
                            "
                        >
                            Security
                        </p>

                        <h2
                            className="
                                text-2xl
                                font-bold
                                mt-2
                            "
                        >
                            Ubah Password
                        </h2>

                        <p
                            className="
                                text-gray-500
                                text-sm
                                mt-2
                            "
                        >
                            Password baru minimal
                            terdiri dari 6 karakter.
                        </p>
                    </div>

                    <form
                        onSubmit={
                            handleChangePassword
                        }
                        className="
                            grid
                            md:grid-cols-3
                            gap-5
                        "
                    >
                        {/* PASSWORD LAMA */}

                        <div>
                            <label
                                className="
                                    block
                                    text-sm
                                    text-gray-400
                                    mb-2
                                "
                            >
                                Password Lama
                            </label>

                            <div className="relative">
                                <FaLock
                                    className="
                                        absolute
                                        left-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-gray-600
                                    "
                                />

                                <input
                                    type="password"
                                    name="password_lama"
                                    value={
                                        passwordForm.password_lama
                                    }
                                    onChange={
                                        handlePasswordChange
                                    }
                                    required
                                    className="
                                        w-full
                                        pl-11
                                        pr-4
                                        py-3.5
                                        rounded-xl
                                        bg-[#1D1D1D]
                                        border
                                        border-white/10
                                        text-white
                                        outline-none
                                        focus:border-[#D4AF37]
                                    "
                                />
                            </div>
                        </div>

                        {/* PASSWORD BARU */}

                        <div>
                            <label
                                className="
                                    block
                                    text-sm
                                    text-gray-400
                                    mb-2
                                "
                            >
                                Password Baru
                            </label>

                            <div className="relative">
                                <FaLock
                                    className="
                                        absolute
                                        left-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-gray-600
                                    "
                                />

                                <input
                                    type="password"
                                    name="password_baru"
                                    value={
                                        passwordForm.password_baru
                                    }
                                    onChange={
                                        handlePasswordChange
                                    }
                                    required
                                    minLength={6}
                                    className="
                                        w-full
                                        pl-11
                                        pr-4
                                        py-3.5
                                        rounded-xl
                                        bg-[#1D1D1D]
                                        border
                                        border-white/10
                                        text-white
                                        outline-none
                                        focus:border-[#D4AF37]
                                    "
                                />
                            </div>
                        </div>

                        {/* KONFIRMASI */}

                        <div>
                            <label
                                className="
                                    block
                                    text-sm
                                    text-gray-400
                                    mb-2
                                "
                            >
                                Konfirmasi Password
                            </label>

                            <div className="relative">
                                <FaLock
                                    className="
                                        absolute
                                        left-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-gray-600
                                    "
                                />

                                <input
                                    type="password"
                                    name="konfirmasi_password"
                                    value={
                                        passwordForm
                                            .konfirmasi_password
                                    }
                                    onChange={
                                        handlePasswordChange
                                    }
                                    required
                                    minLength={6}
                                    className="
                                        w-full
                                        pl-11
                                        pr-4
                                        py-3.5
                                        rounded-xl
                                        bg-[#1D1D1D]
                                        border
                                        border-white/10
                                        text-white
                                        outline-none
                                        focus:border-[#D4AF37]
                                    "
                                />
                            </div>
                        </div>

                        {/* BUTTON */}

                        <div
                            className="
                                md:col-span-3
                                pt-2
                            "
                        >
                            <button
                                type="submit"
                                disabled={
                                    changingPassword
                                }
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    px-6
                                    py-3
                                    rounded-xl
                                    bg-[#D4AF37]
                                    text-black
                                    font-semibold
                                    hover:brightness-110
                                    transition
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                "
                            >
                                <FaLock />

                                {changingPassword
                                    ? "Mengubah..."
                                    : "Ubah Password"}
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
}

export default StaffProfile;