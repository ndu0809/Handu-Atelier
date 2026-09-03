import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import api from "../../lib/api";

const PengaturanPage = () => {

    // =====================================================
    // STATE
    // =====================================================

    const [admins, setAdmins] = useState([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleteLoading, setDeleteLoading] =
        useState(false);

    const [showModal, setShowModal] =
        useState(false);

    const [editMode, setEditMode] =
        useState(false);

    const [confirmDelete, setConfirmDelete] =
        useState(null);

    const [message, setMessage] =
        useState("");

    const [messageType, setMessageType] =
        useState("success");

    const [form, setForm] = useState({
        id_user: null,
        nama: "",
        email: "",
        password: "",
        no_hp: "",
        alamat: ""
    });

    // =====================================================
    // STYLE
    // =====================================================

    const styles = {
        page: {
            width: "100%",
            minWidth: 0,
            color: "#ffffff"
        },

        heading: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "18px",
            marginBottom: "24px",
            flexWrap: "wrap"
        },

        kicker: {
            display: "block",
            marginBottom: "6px",
            color: "#d4af37",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.18em"
        },

        title: {
            margin: 0,
            color: "#ffffff",
            fontSize: "30px",
            lineHeight: 1.2
        },

        subtitle: {
            margin: "7px 0 0",
            color: "#7e7e7e",
            fontSize: "13px"
        },

        addButton: {
            minHeight: "42px",
            padding: "0 15px",
            border: "1px solid #d4af37",
            borderRadius: "8px",
            background: "#d4af37",
            color: "#11100e",
            fontSize: "11px",
            fontWeight: 700,
            cursor: "pointer"
        },

        card: {
            background: "#11100e",
            border: "1px solid #342d1e",
            borderRadius: "14px",
            overflow: "hidden"
        },

        cardHeader: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            padding: "18px 20px",
            borderBottom:
                "1px solid rgba(255,255,255,0.06)",
            flexWrap: "wrap"
        },

        cardTitle: {
            margin: 0,
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: 600
        },

        cardCount: {
            display: "block",
            marginTop: "5px",
            color: "#6f6f6f",
            fontSize: "10px"
        },

        searchBox: {
            display: "flex",
            alignItems: "center",
            gap: "8px",
            width: "290px",
            maxWidth: "100%",
            height: "40px",
            padding: "0 12px",
            boxSizing: "border-box",
            border: "1px solid #38301f",
            borderRadius: "8px",
            background: "#181714"
        },

        searchIcon: {
            color: "#d4af37",
            fontSize: "15px"
        },

        searchInput: {
            width: "100%",
            height: "100%",
            border: "none",
            outline: "none",
            background: "transparent",
            color: "#ffffff",
            fontSize: "11px"
        },

        message: {
            margin: "14px 20px 0",
            padding: "11px 13px",
            borderRadius: "8px",
            fontSize: "11px",
            lineHeight: 1.5
        },

        successMessage: {
            background:
                "rgba(76,175,80,0.09)",
            border:
                "1px solid rgba(76,175,80,0.22)",
            color: "#8bd38d"
        },

        errorMessage: {
            background:
                "rgba(220,70,70,0.09)",
            border:
                "1px solid rgba(220,70,70,0.22)",
            color: "#ff8585"
        },

        tableWrapper: {
            width: "100%",
            overflowX: "auto"
        },

        table: {
            width: "100%",
            minWidth: "900px",
            borderCollapse: "collapse"
        },

        th: {
            padding: "14px 15px",
            background: "#151411",
            borderBottom:
                "1px solid #312a1c",
            color: "#c8a84e",
            fontSize: "10px",
            fontWeight: 700,
            textAlign: "left",
            whiteSpace: "nowrap"
        },

        td: {
            padding: "14px 15px",
            borderBottom:
                "1px solid rgba(255,255,255,0.045)",
            color: "#d5d5d5",
            fontSize: "11px",
            verticalAlign: "middle"
        },

        number: {
            color: "#777777",
            fontWeight: 600
        },

        adminCell: {
            display: "flex",
            alignItems: "center",
            gap: "10px"
        },

        avatar: {
            width: "38px",
            height: "38px",
            minWidth: "38px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            background:
                "rgba(212,175,55,0.10)",
            border:
                "1px solid rgba(212,175,55,0.22)",
            color: "#d4af37",
            fontSize: "13px",
            fontWeight: 700
        },

        nameBlock: {
            minWidth: 0
        },

        adminName: {
            display: "block",
            color: "#ffffff",
            fontSize: "11px",
            fontWeight: 600
        },

        adminId: {
            display: "block",
            marginTop: "3px",
            color: "#676767",
            fontSize: "9px"
        },

        email: {
            color: "#bcbcbc",
            wordBreak: "break-word"
        },

        phone: {
            color: "#bcbcbc",
            whiteSpace: "nowrap"
        },

        actionGroup: {
            display: "flex",
            alignItems: "center",
            gap: "6px"
        },

        editButton: {
            height: "32px",
            padding: "0 10px",
            border:
                "1px solid rgba(212,175,55,0.22)",
            borderRadius: "7px",
            background:
                "rgba(212,175,55,0.08)",
            color: "#d4af37",
            cursor: "pointer",
            fontSize: "10px",
            fontWeight: 600
        },

        deleteButton: {
            height: "32px",
            padding: "0 10px",
            border:
                "1px solid rgba(220,70,70,0.22)",
            borderRadius: "7px",
            background:
                "rgba(220,70,70,0.08)",
            color: "#ff7d7d",
            cursor: "pointer",
            fontSize: "10px",
            fontWeight: 600
        },

        loading: {
            minHeight: "280px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#777777",
            fontSize: "11px"
        },

        empty: {
            minHeight: "260px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "25px"
        },

        emptyIcon: {
            width: "54px",
            height: "54px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "12px",
            borderRadius: "50%",
            background:
                "rgba(212,175,55,0.08)",
            border:
                "1px solid rgba(212,175,55,0.20)",
            color: "#d4af37",
            fontSize: "21px"
        },

        emptyTitle: {
            margin: 0,
            color: "#ffffff",
            fontSize: "14px"
        },

        emptyText: {
            maxWidth: "380px",
            margin: "6px 0 0",
            color: "#666666",
            fontSize: "10px",
            lineHeight: 1.5
        },

        footer: {
            display: "flex",
            justifyContent: "flex-end",
            padding: "13px 20px",
            borderTop:
                "1px solid rgba(212,175,55,0.08)"
        },

        refreshButton: {
            height: "38px",
            padding: "0 13px",
            border:
                "1px solid rgba(212,175,55,0.28)",
            borderRadius: "8px",
            background: "transparent",
            color: "#d4af37",
            fontSize: "10px",
            fontWeight: 600,
            cursor: "pointer"
        },

        modalOverlay: {
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            background:
                "rgba(0,0,0,0.72)",
            overflowY: "auto"
        },

        modal: {
            width: "min(560px, 100%)",
            maxHeight:
                "calc(100vh - 40px)",
            overflowY: "auto",
            background: "#151411",
            border:
                "1px solid #40351f",
            borderRadius: "15px",
            boxShadow:
                "0 24px 70px rgba(0,0,0,0.55)"
        },

        modalHeader: {
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

        modalTitle: {
            margin: 0,
            color: "#ffffff",
            fontSize: "19px",
            fontWeight: 700
        },

        modalSubtitle: {
            margin:
                "6px 0 0",
            color: "#777777",
            fontSize: "10px"
        },

        closeButton: {
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

        modalBody: {
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
            padding: "0 12px",
            border:
                "1px solid #37301f",
            borderRadius: "8px",
            outline: "none",
            background: "#1b1916",
            color: "#ffffff",
            fontSize: "12px"
        },

        hint: {
            margin: 0,
            color: "#666666",
            fontSize: "9px",
            lineHeight: 1.5
        },

        modalActions: {
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
            paddingTop: "18px",
            borderTop:
                "1px solid rgba(255,255,255,0.05)"
        },

        cancelButton: {
            minWidth: "90px",
            height: "40px",
            padding: "0 14px",
            border:
                "1px solid #40371f",
            borderRadius: "8px",
            background: "transparent",
            color: "#bdbdbd",
            fontSize: "11px",
            fontWeight: 600,
            cursor: "pointer"
        },

        saveButton: {
            minWidth: "135px",
            height: "40px",
            padding: "0 14px",
            border:
                "1px solid #d4af37",
            borderRadius: "8px",
            background: "#d4af37",
            color: "#11100e",
            fontSize: "11px",
            fontWeight: 700,
            cursor: "pointer"
        },

        confirmModal: {
            width:
                "min(420px, 100%)",
            background: "#151411",
            border:
                "1px solid #40351f",
            borderRadius: "14px",
            boxShadow:
                "0 20px 60px rgba(0,0,0,0.45)"
        },

        confirmBody: {
            padding:
                "20px 22px 12px"
        },

        confirmTitle: {
            margin: 0,
            color: "#ffffff",
            fontSize: "18px",
            fontWeight: 700
        },

        confirmText: {
            margin:
                "8px 0 0",
            color: "#8c8c8c",
            fontSize: "12px",
            lineHeight: 1.6
        },

        confirmName: {
            color: "#d4af37",
            fontWeight: 700
        },

        confirmActions: {
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
            padding:
                "12px 22px 20px"
        }
    };

    // =====================================================
    // MESSAGE
    // =====================================================

    const showMessage = (
        text,
        type = "success"
    ) => {
        setMessage(text);
        setMessageType(type);

        window.setTimeout(() => {
            setMessage("");
        }, 3500);
    };

    // =====================================================
    // LOAD ADMINS
    // =====================================================

    const loadAdmins = async () => {
        try {
            setLoading(true);

            const response =
                await api.get("/users/admins");

            console.log(
                "RESPONSE ADMIN:",
                response
            );

            let result = response;

            if (
                result &&
                typeof result === "object" &&
                Array.isArray(result.data)
            ) {
                result = result.data;
            }

            if (
                result &&
                typeof result === "object" &&
                Array.isArray(result.admins)
            ) {
                result = result.admins;
            }

            if (
                result?.data &&
                Array.isArray(
                    result.data.admins
                )
            ) {
                result =
                    result.data.admins;
            }

            if (!Array.isArray(result)) {
                throw new Error(
                    response?.message ||
                    "Format data administrator tidak sesuai."
                );
            }

            setAdmins(result);

        } catch (error) {
            console.error(
                "GAGAL MENGAMBIL ADMIN:",
                error
            );

            setAdmins([]);

            showMessage(
                error?.message ||
                "Gagal mengambil data administrator.",
                "error"
            );

        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // LOAD AWAL
    // =====================================================

    useEffect(() => {
        loadAdmins();
    }, []);

    // =====================================================
    // INPUT
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

        setMessage("");
    };

    // =====================================================
    // RESET
    // =====================================================

    const resetForm = () => {
        setForm({
            id_user: null,
            nama: "",
            email: "",
            password: "",
            no_hp: "",
            alamat: ""
        });
    };

    // =====================================================
    // ADD
    // =====================================================

    const openAddModal = () => {
        setEditMode(false);
        resetForm();
        setMessage("");
        setShowModal(true);
    };

    // =====================================================
    // EDIT
    // =====================================================

    const openEditModal = (
        admin
    ) => {
        setEditMode(true);

        setForm({
            id_user:
                admin.id_user,
            nama:
                admin.nama || "",
            email:
                admin.email || "",
            password: "",
            no_hp:
                admin.no_hp || "",
            alamat:
                admin.alamat || ""
        });

        setMessage("");
        setShowModal(true);
    };

    // =====================================================
    // CLOSE
    // =====================================================

    const closeModal = () => {
        if (saving) {
            return;
        }

        setShowModal(false);
        setEditMode(false);
        resetForm();
        setMessage("");
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

        const password =
            form.password.trim();

        const no_hp =
            form.no_hp.trim();

        const alamat =
            form.alamat.trim();

        if (!nama) {
            setMessage(
                "Nama admin wajib diisi."
            );

            setMessageType(
                "error"
            );

            return;
        }

        if (!email) {
            setMessage(
                "Email admin wajib diisi."
            );

            setMessageType(
                "error"
            );

            return;
        }

        if (
            !editMode &&
            !password
        ) {
            setMessage(
                "Password admin wajib diisi."
            );

            setMessageType(
                "error"
            );

            return;
        }

        if (
            password &&
            password.length < 6
        ) {
            setMessage(
                "Password minimal 6 karakter."
            );

            setMessageType(
                "error"
            );

            return;
        }

        try {
            setSaving(true);

            if (editMode) {

                const requestData = {
                    nama,
                    email,
                    no_hp,
                    alamat,
                    id_role: 1
                };

                if (password) {
                    requestData.password =
                        password;
                }

                const response =
                    await api.put(
                        `/users/${form.id_user}`,
                        requestData
                    );

                if (
                    response?.success ===
                    false
                ) {
                    throw new Error(
                        response.message ||
                        "Gagal mengubah admin."
                    );
                }

                showMessage(
                    "Data admin berhasil diubah."
                );

            } else {

                const response =
                    await api.post(
                        "/users",
                        {
                            nama,
                            email,
                            password,
                            no_hp,
                            alamat,
                            id_role: 1
                        }
                    );

                if (
                    response?.success ===
                    false
                ) {
                    throw new Error(
                        response.message ||
                        "Gagal menambahkan admin."
                    );
                }

                showMessage(
                    "Admin berhasil ditambahkan."
                );
            }

            setShowModal(false);
            setEditMode(false);
            resetForm();

            await loadAdmins();

        } catch (error) {
            console.error(
                "SIMPAN ADMIN ERROR:",
                error
            );

            setMessage(
                error?.message ||
                "Gagal menyimpan data admin."
            );

            setMessageType(
                "error"
            );

        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // DELETE
    // =====================================================

    const requestDelete = (
        admin
    ) => {
        setConfirmDelete(
            admin
        );
    };

    const executeDelete = async () => {
        if (!confirmDelete) {
            return;
        }

        try {
            setDeleteLoading(
                true
            );

            const response =
                await api.delete(
                    `/users/${confirmDelete.id_user}`
                );

            if (
                response?.success ===
                false
            ) {
                throw new Error(
                    response.message ||
                    "Admin tidak dapat dihapus."
                );
            }

            setConfirmDelete(
                null
            );

            showMessage(
                "Admin berhasil dihapus."
            );

            await loadAdmins();

        } catch (error) {

            console.error(
                "DELETE ADMIN ERROR:",
                error
            );

            setConfirmDelete(
                null
            );

            showMessage(
                error?.message ||
                "Admin tidak dapat dihapus.",
                "error"
            );

        } finally {
            setDeleteLoading(
                false
            );
        }
    };

    // =====================================================
    // FILTER
    // =====================================================

    const filteredAdmins =
        useMemo(() => {

            const keyword =
                search
                    .trim()
                    .toLowerCase();

            if (!keyword) {
                return admins;
            }

            return admins.filter(
                (admin) => {

                    const nama =
                        String(
                            admin.nama ||
                            ""
                        ).toLowerCase();

                    const email =
                        String(
                            admin.email ||
                            ""
                        ).toLowerCase();

                    const no_hp =
                        String(
                            admin.no_hp ||
                            ""
                        ).toLowerCase();

                    return (
                        nama.includes(
                            keyword
                        ) ||
                        email.includes(
                            keyword
                        ) ||
                        no_hp.includes(
                            keyword
                        )
                    );
                }
            );

        }, [
            admins,
            search
        ]);

    // =====================================================
    // INITIAL
    // =====================================================

    const getInitial = (
        nama
    ) => {
        const value =
            String(
                nama || ""
            ).trim();

        return (
            value.charAt(0)
                .toUpperCase() ||
            "A"
        );
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

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                style={
                    styles.heading
                }
            >

                <div>

                    <span
                        style={
                            styles.kicker
                        }
                    >
                        SISTEM
                    </span>

                    <h1
                        style={
                            styles.title
                        }
                    >
                        Pengaturan
                    </h1>

                    <p
                        style={
                            styles.subtitle
                        }
                    >
                        Kelola akun administrator
                        Handu Atelier.
                    </p>

                </div>

                <button
                    type="button"
                    style={
                        styles.addButton
                    }
                    onClick={
                        openAddModal
                    }
                >
                    + Tambah Admin
                </button>

            </div>

            {/* =================================================
                CARD
            ================================================= */}

            <div
                style={
                    styles.card
                }
            >

                <div
                    style={
                        styles.cardHeader
                    }
                >

                    <div>

                        <h2
                            style={
                                styles.cardTitle
                            }
                        >
                            Daftar Admin
                        </h2>

                        <span
                            style={
                                styles.cardCount
                            }
                        >
                            {
                                filteredAdmins.length
                            }{" "}
                            administrator
                        </span>

                    </div>

                    <div
                        style={
                            styles.searchBox
                        }
                    >

                        <span
                            style={
                                styles.searchIcon
                            }
                        >
                            ⌕
                        </span>

                        <input
                            type="text"
                            value={
                                search
                            }
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Cari admin..."
                            style={
                                styles.searchInput
                            }
                        />

                    </div>

                </div>

                {/* =================================================
                    MESSAGE
                ================================================= */}

                {message && (
                    <div
                        style={{
                            ...styles.message,
                            ...(messageType ===
                            "error"
                                ? styles.errorMessage
                                : styles.successMessage)
                        }}
                    >
                        {message}
                    </div>
                )}

                {/* =================================================
                    CONTENT
                ================================================= */}

                {loading ? (

                    <div
                        style={
                            styles.loading
                        }
                    >
                        Memuat data admin...
                    </div>

                ) : filteredAdmins.length === 0 ? (

                    <div
                        style={
                            styles.empty
                        }
                    >

                        <div
                            style={
                                styles.emptyIcon
                            }
                        >
                            ♙
                        </div>

                        <h3
                            style={
                                styles.emptyTitle
                            }
                        >
                            Data admin tidak ditemukan
                        </h3>

                        <p
                            style={
                                styles.emptyText
                            }
                        >
                            {search
                                ? "Tidak ada admin yang sesuai dengan pencarian."
                                : "Belum ada administrator yang terdaftar."}
                        </p>

                    </div>

                ) : (

                    <div
                        style={
                            styles.tableWrapper
                        }
                    >

                        <table
                            style={
                                styles.table
                            }
                        >

                            <thead>

                                <tr>

                                    <th
                                        style={
                                            styles.th
                                        }
                                    >
                                        No
                                    </th>

                                    <th
                                        style={
                                            styles.th
                                        }
                                    >
                                        Nama Admin
                                    </th>

                                    <th
                                        style={
                                            styles.th
                                        }
                                    >
                                        Email
                                    </th>

                                    <th
                                        style={
                                            styles.th
                                        }
                                    >
                                        No. WhatsApp
                                    </th>

                                    <th
                                        style={
                                            styles.th
                                        }
                                    >
                                        Aksi
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredAdmins.map(
                                    (
                                        admin,
                                        index
                                    ) => {

                                        const nama =
                                            admin.nama ||
                                            "Admin";

                                        return (
                                            <tr
                                                key={
                                                    admin.id_user ||
                                                    index
                                                }
                                            >

                                                <td
                                                    style={
                                                        styles.td
                                                    }
                                                >
                                                    <span
                                                        style={
                                                            styles.number
                                                        }
                                                    >
                                                        {String(
                                                            index +
                                                            1
                                                        ).padStart(
                                                            2,
                                                            "0"
                                                        )}
                                                    </span>
                                                </td>

                                                <td
                                                    style={
                                                        styles.td
                                                    }
                                                >

                                                    <div
                                                        style={
                                                            styles.adminCell
                                                        }
                                                    >

                                                        <div
                                                            style={
                                                                styles.avatar
                                                            }
                                                        >
                                                            {getInitial(
                                                                nama
                                                            )}
                                                        </div>

                                                        <div
                                                            style={
                                                                styles.nameBlock
                                                            }
                                                        >

                                                            <span
                                                                style={
                                                                    styles.adminName
                                                                }
                                                            >
                                                                {nama}
                                                            </span>

                                                            <span
                                                                style={
                                                                    styles.adminId
                                                                }
                                                            >
                                                                ID User #
                                                                {
                                                                    admin.id_user ||
                                                                    "-"
                                                                }
                                                            </span>

                                                        </div>

                                                    </div>

                                                </td>

                                                <td
                                                    style={
                                                        styles.td
                                                    }
                                                >
                                                    <span
                                                        style={
                                                            styles.email
                                                        }
                                                    >
                                                        {
                                                            admin.email ||
                                                            "-"
                                                        }
                                                    </span>
                                                </td>

                                                <td
                                                    style={
                                                        styles.td
                                                    }
                                                >
                                                    <span
                                                        style={
                                                            styles.phone
                                                        }
                                                    >
                                                        {
                                                            admin.no_hp ||
                                                            "-"
                                                        }
                                                    </span>
                                                </td>

                                                <td
                                                    style={
                                                        styles.td
                                                    }
                                                >

                                                    <div
                                                        style={
                                                            styles.actionGroup
                                                        }
                                                    >

                                                        <button
                                                            type="button"
                                                            style={
                                                                styles.editButton
                                                            }
                                                            onClick={() =>
                                                                openEditModal(
                                                                    admin
                                                                )
                                                            }
                                                        >
                                                            ✎ Edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            style={
                                                                styles.deleteButton
                                                            }
                                                            onClick={() =>
                                                                requestDelete(
                                                                    admin
                                                                )
                                                            }
                                                        >
                                                            🗑 Hapus
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>
                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

                {/* =================================================
                    FOOTER
                ================================================= */}

                <div
                    style={
                        styles.footer
                    }
                >

                    <button
                        type="button"
                        style={{
                            ...styles.refreshButton,
                            ...(loading
                                ? {
                                    opacity: 0.55,
                                    cursor:
                                        "not-allowed"
                                }
                                : {})
                        }}
                        disabled={
                            loading
                        }
                        onClick={
                            loadAdmins
                        }
                    >
                        ↻ Perbarui Data
                    </button>

                </div>

            </div>

            {/* =================================================
                ADD / EDIT MODAL
            ================================================= */}

            {showModal && (
                <div
                    style={
                        styles.modalOverlay
                    }
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeModal();
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

                        <div
                            style={
                                styles.modalHeader
                            }
                        >

                            <div>

                                <h2
                                    style={
                                        styles.modalTitle
                                    }
                                >
                                    {editMode
                                        ? "Edit Admin"
                                        : "Tambah Admin"}
                                </h2>

                                <p
                                    style={
                                        styles.modalSubtitle
                                    }
                                >
                                    {editMode
                                        ? "Perbarui akun administrator."
                                        : "Tambahkan akun administrator baru."}
                                </p>

                            </div>

                            <button
                                type="button"
                                style={{
                                    ...styles.closeButton,
                                    ...(saving
                                        ? {
                                            opacity: 0.55,
                                            cursor:
                                                "not-allowed"
                                        }
                                        : {})
                                }}
                                onClick={
                                    closeModal
                                }
                                disabled={
                                    saving
                                }
                            >
                                ×
                            </button>

                        </div>

                        <div
                            style={
                                styles.modalBody
                            }
                        >

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
                                        style={
                                            styles.label
                                        }
                                    >
                                        Nama Admin
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
                                        placeholder="Masukkan nama admin"
                                        disabled={
                                            saving
                                        }
                                        style={
                                            styles.input
                                        }
                                        required
                                    />

                                </div>

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
                                        placeholder="admin@email.com"
                                        disabled={
                                            saving
                                        }
                                        style={
                                            styles.input
                                        }
                                        required
                                    />

                                </div>

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
                                        {editMode &&
                                            " (kosongkan jika tidak diubah)"}
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
                                            editMode
                                                ? "Password baru"
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
                                            !editMode
                                        }
                                    />

                                    <p
                                        style={
                                            styles.hint
                                        }
                                    >
                                        {editMode
                                            ? "Isi password hanya jika ingin mengganti password."
                                            : "Password minimal 6 karakter."}
                                    </p>

                                </div>

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
                                        Nomor WhatsApp
                                    </label>

                                    <input
                                        type="text"
                                        name="no_hp"
                                        value={
                                            form.no_hp
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="081234567890"
                                        inputMode="tel"
                                        disabled={
                                            saving
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
                                        style={
                                            styles.label
                                        }
                                    >
                                        Alamat
                                    </label>

                                    <input
                                        type="text"
                                        name="alamat"
                                        value={
                                            form.alamat
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Masukkan alamat"
                                        disabled={
                                            saving
                                        }
                                        style={
                                            styles.input
                                        }
                                    />

                                </div>

                                <div
                                    style={
                                        styles.modalActions
                                    }
                                >

                                    <button
                                        type="button"
                                        style={{
                                            ...styles.cancelButton,
                                            ...(saving
                                                ? {
                                                    opacity: 0.55,
                                                    cursor:
                                                        "not-allowed"
                                                }
                                                : {})
                                        }}
                                        onClick={
                                            closeModal
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
                                            ...styles.saveButton,
                                            ...(saving
                                                ? {
                                                    opacity: 0.55,
                                                    cursor:
                                                        "not-allowed"
                                                }
                                                : {})
                                        }}
                                        disabled={
                                            saving
                                        }
                                    >
                                        {saving
                                            ? "Menyimpan..."
                                            : editMode
                                                ? "Simpan Perubahan"
                                                : "Tambah Admin"}
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>
            )}

            {/* =================================================
                DELETE MODAL
            ================================================= */}

            {confirmDelete && (
                <div
                    style={
                        styles.modalOverlay
                    }
                    onClick={() => {
                        if (
                            !deleteLoading
                        ) {
                            setConfirmDelete(
                                null
                            );
                        }
                    }}
                >

                    <div
                        style={
                            styles.confirmModal
                        }
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div
                            style={
                                styles.confirmBody
                            }
                        >

                            <h3
                                style={
                                    styles.confirmTitle
                                }
                            >
                                Hapus Admin?
                            </h3>

                            <p
                                style={
                                    styles.confirmText
                                }
                            >
                                Apakah kamu yakin ingin
                                menghapus akun admin{" "}
                                <span
                                    style={
                                        styles.confirmName
                                    }
                                >
                                    "
                                    {
                                        confirmDelete.nama ||
                                        "admin ini"
                                    }
                                    "
                                </span>
                                ?
                                <br />
                                Tindakan ini tidak dapat
                                dibatalkan.
                            </p>

                        </div>

                        <div
                            style={
                                styles.confirmActions
                            }
                        >

                            <button
                                type="button"
                                style={{
                                    ...styles.cancelButton,
                                    ...(deleteLoading
                                        ? {
                                            opacity: 0.55,
                                            cursor:
                                                "not-allowed"
                                        }
                                        : {})
                                }}
                                disabled={
                                    deleteLoading
                                }
                                onClick={() =>
                                    setConfirmDelete(
                                        null
                                    )
                                }
                            >
                                Batal
                            </button>

                            <button
                                type="button"
                                style={{
                                    ...styles.deleteButton,
                                    height: "39px"
                                }}
                                disabled={
                                    deleteLoading
                                }
                                onClick={
                                    executeDelete
                                }
                            >
                                {deleteLoading
                                    ? "Menghapus..."
                                    : "Ya, Hapus"}
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};

export default PengaturanPage;