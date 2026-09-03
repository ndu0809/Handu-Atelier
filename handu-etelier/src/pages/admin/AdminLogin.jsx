import React, {
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import api from "../../lib/api";

const AdminLogin = ({
    onLogin
}) => {

    const navigate =
        useNavigate();

    const [form, setForm] =
        useState({
            email: "",
            password: ""
        });

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    // =====================================================
    // STYLE
    // =====================================================

    const styles = {

        page: {
            minHeight: "100vh",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            boxSizing: "border-box",
            background:
                "radial-gradient(circle at top, #1c1810 0%, #0b0b0a 42%, #070707 100%)",
            color: "#ffffff"
        },

        card: {
            width:
                "min(430px, 100%)",
            padding: "34px",
            boxSizing: "border-box",
            background: "#11100e",
            border:
                "1px solid #3d321e",
            borderRadius: "16px",
            boxShadow:
                "0 24px 70px rgba(0,0,0,0.45)"
        },

        header: {
            textAlign: "center",
            marginBottom: "28px"
        },

        logo: {
            width: "58px",
            height: "58px",
            margin:
                "0 auto 15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            background:
                "rgba(212,175,55,0.10)",
            border:
                "1px solid rgba(212,175,55,0.25)",
            color: "#d4af37",
            fontSize: "22px",
            fontWeight: 700
        },

        brand: {
            margin: 0,
            color: "#d4af37",
            fontSize: "26px",
            fontWeight: 700,
            letterSpacing: "0.02em"
        },

        subtitle: {
            margin:
                "7px 0 0",
            color: "#777777",
            fontSize: "12px"
        },

        form: {
            display: "flex",
            flexDirection: "column",
            gap: "17px"
        },

        group: {
            display: "flex",
            flexDirection: "column",
            gap: "7px"
        },

        label: {
            color: "#d2d2d2",
            fontSize: "11px",
            fontWeight: 600
        },

        inputWrapper: {
            position: "relative",
            width: "100%"
        },

        input: {
            width: "100%",
            height: "44px",
            padding:
                "0 12px",
            boxSizing: "border-box",
            border:
                "1px solid #38301f",
            borderRadius: "8px",
            outline: "none",
            background: "#181714",
            color: "#ffffff",
            fontSize: "12px"
        },

        passwordInput: {
            paddingRight: "72px"
        },

        showPasswordButton: {
            position: "absolute",
            top: "50%",
            right: "8px",
            transform:
                "translateY(-50%)",
            height: "30px",
            padding:
                "0 9px",
            border:
                "1px solid #3a321f",
            borderRadius: "6px",
            background:
                "#211e17",
            color: "#d4af37",
            fontSize: "10px",
            fontWeight: 600,
            cursor: "pointer"
        },

        error: {
            padding:
                "11px 13px",
            border:
                "1px solid rgba(220,70,70,0.25)",
            borderRadius: "8px",
            background:
                "rgba(220,70,70,0.10)",
            color: "#ff8585",
            fontSize: "11px",
            lineHeight: 1.5
        },

        button: {
            width: "100%",
            height: "44px",
            marginTop: "5px",
            border:
                "1px solid #d4af37",
            borderRadius: "8px",
            background: "#d4af37",
            color: "#11100e",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer"
        },

        buttonDisabled: {
            opacity: 0.55,
            cursor: "not-allowed"
        },

        footer: {
            marginTop: "24px",
            textAlign: "center",
            color: "#585858",
            fontSize: "9px",
            lineHeight: 1.6
        }
    };

    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (
        event
    ) => {

        const {
            name,
            value
        } = event.target;

        setForm(
            (prev) => ({
                ...prev,
                [name]: value
            })
        );

        setError("");
    };

    // =====================================================
    // LOGIN
    // =====================================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();

        const email =
            form.email
                .trim()
                .toLowerCase();

        const password =
            form.password;

        if (!email) {
            setError(
                "Email admin wajib diisi."
            );
            return;
        }

        if (!password) {
            setError(
                "Password wajib diisi."
            );
            return;
        }

        try {

            setLoading(true);
            setError("");

            const response =
                await api.post(
                    "/admin/login",
                    {
                        email,
                        password
                    }
                );

            console.log(
                "LOGIN RESPONSE:",
                response
            );

            const result =
                response?.data ??
                response;

            console.log(
                "LOGIN RESULT:",
                result
            );

            if (
                !result ||
                result.success !== true ||
                !result.data
            ) {

                throw new Error(
                    result?.message ||
                    "Email atau password salah."
                );

            }

            const admin =
                result.data;

            localStorage.setItem(
                "admin",
                JSON.stringify(admin)
            );

            localStorage.setItem(
                "isAdminLoggedIn",
                "true"
            );

            if (
                typeof onLogin ===
                "function"
            ) {
                onLogin(admin);
            }

            // =============================================
            // LANGSUNG KE DASHBOARD ADMIN
            // =============================================

            navigate(
                "/admin/dashboard",
                {
                    replace: true
                }
            );

        } catch (err) {

            console.error(
                "LOGIN ADMIN ERROR:",
                err
            );

            setError(
                err?.message ||
                "Tidak dapat terhubung ke server."
            );

        } finally {

            setLoading(false);

        }
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div
            style={
                styles.page
            }
        >

            <div
                style={
                    styles.card
                }
            >

                <div
                    style={
                        styles.header
                    }
                >

                    <div
                        style={
                            styles.logo
                        }
                    >
                        HA
                    </div>

                    <h1
                        style={
                            styles.brand
                        }
                    >
                        Handu Atelier
                    </h1>

                    <p
                        style={
                            styles.subtitle
                        }
                    >
                        Login Administrator
                    </p>

                </div>

                <form
                    onSubmit={
                        handleSubmit
                    }
                    style={
                        styles.form
                    }
                >

                    <div
                        style={
                            styles.group
                        }
                    >

                        <label
                            htmlFor="admin-email"
                            style={
                                styles.label
                            }
                        >
                            Email
                        </label>

                        <input
                            id="admin-email"
                            type="email"
                            name="email"
                            value={
                                form.email
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="admin@email.com"
                            autoComplete="email"
                            disabled={
                                loading
                            }
                            style={
                                styles.input
                            }
                        />

                    </div>

                    <div
                        style={
                            styles.group
                        }
                    >

                        <label
                            htmlFor="admin-password"
                            style={
                                styles.label
                            }
                        >
                            Password
                        </label>

                        <div
                            style={
                                styles.inputWrapper
                            }
                        >

                            <input
                                id="admin-password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                name="password"
                                value={
                                    form.password
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Masukkan password"
                                autoComplete="current-password"
                                disabled={
                                    loading
                                }
                                style={{
                                    ...styles.input,
                                    ...styles.passwordInput
                                }}
                            />

                            <button
                                type="button"
                                style={{
                                    ...styles.showPasswordButton,
                                    ...(loading
                                        ? styles.buttonDisabled
                                        : {})
                                }}
                                onClick={() =>
                                    setShowPassword(
                                        (prev) =>
                                            !prev
                                    )
                                }
                                disabled={
                                    loading
                                }
                            >
                                {
                                    showPassword
                                        ? "Sembunyikan"
                                        : "Lihat"
                                }
                            </button>

                        </div>

                    </div>

                    {error && (
                        <div
                            style={
                                styles.error
                            }
                        >
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={
                            loading
                        }
                        style={{
                            ...styles.button,
                            ...(loading
                                ? styles.buttonDisabled
                                : {})
                        }}
                    >
                        {loading
                            ? "Memproses..."
                            : "Login"}
                    </button>

                </form>

                <div
                    style={
                        styles.footer
                    }
                >
                    Halaman khusus
                    Administrator Handu Atelier
                </div>

            </div>

        </div>
    );
};

export default AdminLogin;