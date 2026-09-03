import { useState } from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    // ======================================================
    // HANDLE INPUT
    // ======================================================

    const handleChange = (e) => {
        const {
            name,
            value
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        setError("");
    };

    // ======================================================
    // HANDLE LOGIN
    // ======================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        const email =
            formData.email
                .trim()
                .toLowerCase();

        const password =
            formData.password;

        // ==================================================
        // VALIDASI
        // ==================================================

        if (!email || !password) {
            setError(
                "Email dan password wajib diisi."
            );

            return;
        }

        try {
            setLoading(true);

            // ==================================================
            // LOGIN KE BACKEND
            // ==================================================

            const response = await fetch(
                "/users/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            // ==================================================
            // BACA RESPONSE
            // ==================================================

            const rawResponse =
                await response.text();

            console.log(
                "STATUS:",
                response.status
            );

            console.log(
                "RESPONSE:",
                rawResponse
            );

            let result;

            try {
                result =
                    rawResponse
                        ? JSON.parse(
                            rawResponse
                        )
                        : {};
            } catch (jsonError) {
                console.error(
                    "Response bukan JSON:",
                    rawResponse
                );

                throw new Error(
                    "Server mengembalikan response yang tidak valid."
                );
            }

            console.log(
                "Login response:",
                result
            );

            // ==================================================
            // LOGIN GAGAL
            // ==================================================

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Email atau password salah."
                );
            }

            // ==================================================
            // AMBIL DATA USER
            // ==================================================

            const user =
                result.data ||
                result.user ||
                null;

            if (!user?.id_user) {
                throw new Error(
                    "Data user dari server tidak valid."
                );
            }

            // ==================================================
            // BERSIHKAN SESSION LAMA
            // ==================================================

            localStorage.removeItem(
                "admin"
            );

            localStorage.removeItem(
                "isAdminLoggedIn"
            );

            localStorage.removeItem(
                "adminLoggedIn"
            );

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "adminToken"
            );

            // ==================================================
            // SIMPAN SESSION UTAMA
            // ==================================================

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            localStorage.setItem(
                "isLoggedIn",
                "true"
            );

            // ==================================================
            // ROLE
            // ==================================================

            const roleId =
                Number(user.id_role);

            console.log(
                "LOGIN BERHASIL"
            );

            console.log(
                "USER:",
                user
            );

            console.log(
                "ROLE ID:",
                roleId
            );

            // ==================================================
            // ADMIN
            // ROLE = 1
            // ==================================================

            if (roleId === 1) {
                console.log(
                    "LOGIN SEBAGAI ADMIN"
                );

                // Header Admin menggunakan
                // localStorage "admin"
                localStorage.setItem(
                    "admin",
                    JSON.stringify(user)
                );

                localStorage.setItem(
                    "isAdminLoggedIn",
                    "true"
                );

                navigate(
                    "/admin/dashboard",
                    {
                        replace: true
                    }
                );

                return;
            }

            // ==================================================
            // PETUGAS
            // ROLE = 2
            // ==================================================

            if (roleId === 2) {
                console.log(
                    "LOGIN SEBAGAI PETUGAS"
                );

                navigate(
                    "/petugas/dashboard",
                    {
                        replace: true
                    }
                );

                return;
            }

            // ==================================================
            // USER BIASA
            // ROLE = 3
            // ==================================================

            console.log(
                "LOGIN SEBAGAI USER"
            );

            navigate(
                "/dashboard",
                {
                    replace: true
                }
            );

        } catch (err) {
            console.error(
                "Login error:",
                err
            );

            setError(
                err?.message ||
                "Terjadi kesalahan saat login."
            );
        } finally {
            setLoading(false);
        }
    };

    // ======================================================
    // RENDER
    // ======================================================

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
                    w-full
                    max-w-md
                "
            >
                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="text-center mb-8">

                    <p
                        className="
                            uppercase
                            tracking-[5px]
                            text-[#D4AF37]
                            text-sm
                        "
                    >
                        Handu Atelier
                    </p>

                    <h1
                        className="
                            text-4xl
                            font-bold
                            mt-4
                        "
                    >
                        Masuk
                    </h1>

                    <p
                        className="
                            text-gray-400
                            mt-3
                        "
                    >
                        Masuk ke akun Handu Atelier Anda.
                    </p>

                </div>

                {/* ==================================================
                    CARD
                ================================================== */}

                <div
                    className="
                        rounded-3xl
                        border
                        border-[#D4AF37]/20
                        bg-[#141414]
                        p-8
                    "
                >

                    {/* ERROR */}

                    {error && (
                        <div
                            className="
                                mb-6
                                rounded-xl
                                border
                                border-red-500/30
                                bg-red-500/10
                                px-4
                                py-3
                                text-red-400
                                text-sm
                            "
                        >
                            {error}
                        </div>
                    )}

                    {/* FORM */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        {/* EMAIL */}

                        <div>

                            <label
                                htmlFor="email"
                                className="
                                    block
                                    mb-2
                                    text-gray-300
                                "
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={
                                    formData.email
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Masukkan email"
                                autoComplete="email"
                                disabled={loading}
                                className="
                                    w-full
                                    px-4
                                    py-4
                                    rounded-xl
                                    bg-[#1D1D1D]
                                    border
                                    border-[#D4AF37]/20
                                    focus:border-[#D4AF37]
                                    outline-none
                                    transition
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                "
                            />

                        </div>

                        {/* PASSWORD */}

                        <div>

                            <div className="flex justify-between mb-2">

                                <label
                                    htmlFor="password"
                                    className="
                                        text-gray-300
                                    "
                                >
                                    Password
                                </label>

                            </div>

                            <div className="relative">

                                <input
                                    id="password"
                                    name="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={
                                        formData.password
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Masukkan password"
                                    autoComplete="current-password"
                                    disabled={loading}
                                    className="
                                        w-full
                                        px-4
                                        pr-16
                                        py-4
                                        rounded-xl
                                        bg-[#1D1D1D]
                                        border
                                        border-[#D4AF37]/20
                                        focus:border-[#D4AF37]
                                        outline-none
                                        transition
                                        disabled:opacity-50
                                        disabled:cursor-not-allowed
                                    "
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            (prev) =>
                                                !prev
                                        )
                                    }
                                    disabled={loading}
                                    className="
                                        absolute
                                        right-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-gray-500
                                        hover:text-[#D4AF37]
                                        transition
                                        disabled:opacity-50
                                        disabled:cursor-not-allowed
                                    "
                                >
                                    {
                                        showPassword
                                            ? "Sembunyikan"
                                            : "Lihat"
                                    }
                                </button>

                            </div>

                        </div>

                        {/* SUBMIT */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                w-full
                                py-4
                                rounded-xl
                                bg-[#D4AF37]
                                text-black
                                font-semibold
                                hover:scale-[1.01]
                                transition
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                            "
                        >
                            {
                                loading
                                    ? "Memproses..."
                                    : "Masuk"
                            }
                        </button>

                    </form>

                    {/* REGISTER */}

                    <div
                        className="
                            text-center
                            mt-8
                        "
                    >

                        <p
                            className="
                                text-gray-500
                            "
                        >
                            Belum punya akun?
                        </p>

                        <Link
                            to="/register"
                            className="
                                inline-block
                                mt-2
                                text-[#D4AF37]
                                font-semibold
                                hover:underline
                            "
                        >
                            Daftar sekarang
                        </Link>

                    </div>

                </div>

                {/* ==================================================
                    BACK TO HOME
                ================================================== */}

                <div
                    className="
                        text-center
                        mt-6
                    "
                >
                    <Link
                        to="/"
                        className="
                            text-gray-500
                            hover:text-[#D4AF37]
                            transition
                        "
                    >
                        ← Kembali ke Beranda
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default Login;