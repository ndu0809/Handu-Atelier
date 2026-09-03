import React, {
    useEffect,
    useState
} from "react";

import Icon from "./Icon";

const AddPetugasModal = ({
    isOpen,
    onClose,
    onSubmit,
    initialData = null
}) => {

    const defaultForm = {
        nama: "",
        no_whatsapp: "",
        email: "",
        alamat: "",
        password: ""
    };

    const [form, setForm] =
        useState(
            defaultForm
        );

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    // =====================================================
    // STYLE
    // =====================================================

    const styles = {

        overlay: {
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            background:
                "rgba(0,0,0,0.74)",
            overflowY: "auto"
        },

        modal: {
            width:
                "min(560px, 100%)",
            maxHeight:
                "calc(100vh - 40px)",
            overflowY: "auto",
            background: "#151411",
            border:
                "1px solid #40351f",
            borderRadius: "15px",
            boxShadow:
                "0 24px 80px rgba(0,0,0,0.55)"
        },

        header: {
            position: "sticky",
            top: 0,
            zIndex: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "15px",
            padding: "20px 22px",
            background: "#151411",
            borderBottom:
                "1px solid #30291d"
        },

        title: {
            margin: 0,
            color: "#ffffff",
            fontSize: "19px",
            fontWeight: 700
        },

        subtitle: {
            margin:
                "6px 0 0",
            color: "#777777",
            fontSize: "10px"
        },

        close: {
            width: "34px",
            height: "34px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border:
                "1px solid #40351f",
            borderRadius: "8px",
            background: "transparent",
            color: "#aaaaaa",
            fontSize: "20px",
            cursor: "pointer"
        },

        body: {
            padding: "22px"
        },

        form: {
            display: "flex",
            flexDirection: "column",
            gap: "15px"
        },

        group: {
            display: "flex",
            flexDirection: "column",
            gap: "7px"
        },

        label: {
            color: "#cccccc",
            fontSize: "11px",
            fontWeight: 600
        },

        input: {
            width: "100%",
            height: "42px",
            boxSizing: "border-box",
            padding:
                "0 12px",
            border:
                "1px solid #37301f",
            borderRadius: "8px",
            outline: "none",
            background: "#1b1916",
            color: "#ffffff",
            fontSize: "11px"
        },

        textarea: {
            width: "100%",
            minHeight: "95px",
            boxSizing: "border-box",
            padding:
                "11px 12px",
            border:
                "1px solid #37301f",
            borderRadius: "8px",
            outline: "none",
            background: "#1b1916",
            color: "#ffffff",
            fontSize: "11px",
            lineHeight: 1.5,
            resize: "vertical"
        },

        hint: {
            margin: 0,
            color: "#656565",
            fontSize: "9px",
            lineHeight: 1.5
        },

        error: {
            padding:
                "10px 12px",
            border:
                "1px solid rgba(220,70,70,0.25)",
            borderRadius: "8px",
            background:
                "rgba(220,70,70,0.10)",
            color: "#ff8585",
            fontSize: "10px",
            lineHeight: 1.5
        },

        actions: {
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
            paddingTop: "17px",
            borderTop:
                "1px solid rgba(255,255,255,0.05)"
        },

        cancel: {
            height: "40px",
            padding:
                "0 14px",
            border:
                "1px solid #40371f",
            borderRadius: "8px",
            background: "transparent",
            color: "#bdbdbd",
            cursor: "pointer",
            fontSize: "10px",
            fontWeight: 600
        },

        submit: {
            height: "40px",
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            padding:
                "0 14px",
            border:
                "1px solid #d4af37",
            borderRadius: "8px",
            background: "#d4af37",
            color: "#11100e",
            cursor: "pointer",
            fontSize: "10px",
            fontWeight: 700
        },

        disabled: {
            opacity: 0.55,
            cursor: "not-allowed"
        }
    };

    // =====================================================
    // LOAD INITIAL DATA
    // =====================================================

    useEffect(() => {

        if (!isOpen) {
            return;
        }

        setError("");
        setSaving(false);

        if (initialData) {

            setForm({
                nama:
                    initialData.nama ||
                    "",

                no_whatsapp:
                    initialData.no_whatsapp ||
                    "",

                email:
                    initialData.email ||
                    "",

                alamat:
                    initialData.alamat ||
                    "",

                password:
                    ""
            });

        } else {

            setForm({
                ...defaultForm
            });

        }

    }, [
        initialData,
        isOpen
    ]);

    // =====================================================
    // CHANGE
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
    // SUBMIT
    // =====================================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();

        const nama =
            form.nama.trim();

        const email =
            form.email.trim();

        const noWhatsApp =
            form.no_whatsapp.trim();

        const alamat =
            form.alamat.trim();

        const password =
            form.password;

        if (!nama) {
            setError(
                "Nama petugas wajib diisi."
            );
            return;
        }

        if (!email) {
            setError(
                "Email petugas wajib diisi."
            );
            return;
        }

        if (
            !initialData &&
            !password
        ) {
            setError(
                "Password petugas wajib diisi."
            );
            return;
        }

        if (
            password &&
            password.length < 6
        ) {
            setError(
                "Password minimal 6 karakter."
            );
            return;
        }

        try {

            setSaving(true);

            await onSubmit({
                nama,
                no_whatsapp:
                    noWhatsApp,
                email,
                alamat,
                password
            });

        } catch (submitError) {

            console.error(
                "SUBMIT PETUGAS:",
                submitError
            );

            setError(
                submitError?.message ||
                "Gagal menyimpan data petugas."
            );

        } finally {

            setSaving(false);

        }
    };

    // =====================================================
    // CLOSE
    // =====================================================

    const handleClose = () => {

        if (saving) {
            return;
        }

        onClose();
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div
            style={
                styles.overlay
            }
            onMouseDown={(event) => {

                if (
                    event.target ===
                    event.currentTarget
                ) {
                    handleClose();
                }

            }}
        >

            <div
                style={
                    styles.modal
                }
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
            >

                {/* HEADER */}

                <div
                    style={
                        styles.header
                    }
                >

                    <div>

                        <h2
                            style={
                                styles.title
                            }
                        >
                            {initialData
                                ? "Edit Petugas"
                                : "Tambah Petugas"}
                        </h2>

                        <p
                            style={
                                styles.subtitle
                            }
                        >
                            {initialData
                                ? "Perbarui informasi petugas."
                                : "Lengkapi data petugas baru."}
                        </p>

                    </div>

                    <button
                        type="button"
                        style={{
                            ...styles.close,
                            ...(saving
                                ? styles.disabled
                                : {})
                        }}
                        onClick={
                            handleClose
                        }
                        disabled={
                            saving
                        }
                    >
                        ×
                    </button>

                </div>

                {/* BODY */}

                <div
                    style={
                        styles.body
                    }
                >

                    {error && (
                        <div
                            style={
                                styles.error
                            }
                        >
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={
                            handleSubmit
                        }
                        style={
                            styles.form
                        }
                    >

                        {/* NAMA */}

                        <div
                            style={
                                styles.group
                            }
                        >

                            <label
                                style={
                                    styles.label
                                }
                            >
                                Nama Petugas
                            </label>

                            <input
                                type="text"
                                name="nama"
                                value={
                                    form.nama
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Masukkan nama petugas"
                                disabled={
                                    saving
                                }
                                style={
                                    styles.input
                                }
                                required
                            />

                        </div>

                        {/* WHATSAPP */}

                        <div
                            style={
                                styles.group
                            }
                        >

                            <label
                                style={
                                    styles.label
                                }
                            >
                                No. WhatsApp
                            </label>

                            <input
                                type="text"
                                name="no_whatsapp"
                                value={
                                    form.no_whatsapp
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="08xxxxxxxxxx"
                                inputMode="tel"
                                disabled={
                                    saving
                                }
                                style={
                                    styles.input
                                }
                            />

                        </div>

                        {/* EMAIL */}

                        <div
                            style={
                                styles.group
                            }
                        >

                            <label
                                style={
                                    styles.label
                                }
                            >
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={
                                    form.email
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="petugas@email.com"
                                disabled={
                                    saving
                                }
                                style={
                                    styles.input
                                }
                                required
                            />

                        </div>

                        {/* ALAMAT */}

                        <div
                            style={
                                styles.group
                            }
                        >

                            <label
                                style={
                                    styles.label
                                }
                            >
                                Alamat
                            </label>

                            <textarea
                                name="alamat"
                                value={
                                    form.alamat
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Masukkan alamat petugas"
                                rows={3}
                                disabled={
                                    saving
                                }
                                style={
                                    styles.textarea
                                }
                            />

                        </div>

                        {/* PASSWORD */}

                        <div
                            style={
                                styles.group
                            }
                        >

                            <label
                                style={
                                    styles.label
                                }
                            >
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                value={
                                    form.password
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder={
                                    initialData
                                        ? "Kosongkan jika tidak diubah"
                                        : "Masukkan password"
                                }
                                autoComplete="new-password"
                                disabled={
                                    saving
                                }
                                style={
                                    styles.input
                                }
                                required={
                                    !initialData
                                }
                            />

                            <p
                                style={
                                    styles.hint
                                }
                            >
                                {initialData
                                    ? "Isi hanya jika password ingin diganti."
                                    : "Password minimal 6 karakter."}
                            </p>

                        </div>

                        {/* ACTION */}

                        <div
                            style={
                                styles.actions
                            }
                        >

                            <button
                                type="button"
                                style={{
                                    ...styles.cancel,
                                    ...(saving
                                        ? styles.disabled
                                        : {})
                                }}
                                onClick={
                                    handleClose
                                }
                                disabled={
                                    saving
                                }
                            >
                                Batal
                            </button>

                            <button
                                type="submit"
                                style={{
                                    ...styles.submit,
                                    ...(saving
                                        ? styles.disabled
                                        : {})
                                }}
                                disabled={
                                    saving
                                }
                            >

                                <Icon
                                    name={
                                        initialData
                                            ? "edit"
                                            : "plus"
                                    }
                                    size={16}
                                />

                                {saving
                                    ? "Menyimpan..."
                                    : initialData
                                        ? "Simpan Perubahan"
                                        : "Tambah Petugas"}

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
};

export default AddPetugasModal;