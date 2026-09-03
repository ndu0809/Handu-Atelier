import React, {
    useEffect,
    useState
} from "react";

import api from "../../lib/api";
import Icon from "../../components/admin/Icon";

const KategoriPage = () => {
    // =====================================================
    // STATE
    // =====================================================

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [nama, setNama] = useState("");
    const [editId, setEditId] = useState(null);

    const [saving, setSaving] = useState(false);

    const [confirmDelete, setConfirmDelete] =
        useState(null);

    const [deleteLoading, setDeleteLoading] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [messageType, setMessageType] =
        useState("success");

    // =====================================================
    // STYLE
    // =====================================================

    const styles = {
        page: {
            width: "100%",
            color: "#ffffff"
        },

        heading: {
            marginBottom: "24px"
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

        layout: {
            display: "grid",
            gridTemplateColumns:
                "minmax(280px, 360px) minmax(0, 1fr)",
            gap: "18px",
            alignItems: "start"
        },

        card: {
            background: "#11100e",
            border: "1px solid #342d1e",
            borderRadius: "14px",
            overflow: "hidden"
        },

        cardHeader: {
            padding: "18px 20px",
            borderBottom:
                "1px solid rgba(255,255,255,0.06)"
        },

        cardTitle: {
            margin: 0,
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: 600
        },

        cardSubtitle: {
            margin:
                "5px 0 0",
            color: "#707070",
            fontSize: "10px"
        },

        formBody: {
            padding: "20px"
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

        actions: {
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
            marginTop: "18px"
        },

        primaryButton: {
            minWidth: "105px",
            height: "40px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "7px",
            padding: "0 13px",
            border:
                "1px solid #d4af37",
            borderRadius: "8px",
            background: "#d4af37",
            color: "#11100e",
            fontSize: "11px",
            fontWeight: 700,
            cursor: "pointer"
        },

        secondaryButton: {
            minWidth: "90px",
            height: "40px",
            padding: "0 13px",
            border:
                "1px solid #40371f",
            borderRadius: "8px",
            background: "transparent",
            color: "#bdbdbd",
            fontSize: "11px",
            fontWeight: 600,
            cursor: "pointer"
        },

        disabled: {
            opacity: 0.55,
            cursor: "not-allowed"
        },

        message: {
            margin:
                "14px 20px 0",
            padding:
                "11px 13px",
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

        listHeader: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
            padding:
                "18px 20px",
            borderBottom:
                "1px solid rgba(255,255,255,0.06)"
        },

        count: {
            minWidth: "28px",
            height: "26px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 8px",
            borderRadius: "20px",
            background:
                "rgba(212,175,55,0.10)",
            border:
                "1px solid rgba(212,175,55,0.22)",
            color: "#d4af37",
            fontSize: "10px",
            fontWeight: 700
        },

        list: {
            display: "flex",
            flexDirection: "column"
        },

        item: {
            display: "grid",
            gridTemplateColumns:
                "34px minmax(0, 1fr) auto",
            alignItems: "center",
            gap: "11px",
            minHeight: "64px",
            padding:
                "12px 20px",
            borderBottom:
                "1px solid rgba(255,255,255,0.045)"
        },

        number: {
            width: "28px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "7px",
            background:
                "rgba(212,175,55,0.07)",
            color: "#d4af37",
            fontSize: "10px",
            fontWeight: 700
        },

        categoryName: {
            color: "#eeeeee",
            fontSize: "12px",
            fontWeight: 600,
            wordBreak: "break-word"
        },

        itemActions: {
            display: "flex",
            alignItems: "center",
            gap: "6px"
        },

        editButton: {
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border:
                "1px solid rgba(212,175,55,0.22)",
            borderRadius: "7px",
            background:
                "rgba(212,175,55,0.08)",
            color: "#d4af37",
            cursor: "pointer"
        },

        deleteButton: {
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border:
                "1px solid rgba(220,70,70,0.22)",
            borderRadius: "7px",
            background:
                "rgba(220,70,70,0.08)",
            color: "#ff7d7d",
            cursor: "pointer"
        },

        loading: {
            minHeight: "230px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#777777",
            fontSize: "12px"
        },

        empty: {
            minHeight: "230px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "25px"
        },

        emptyIcon: {
            width: "52px",
            height: "52px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "11px",
            borderRadius: "50%",
            background:
                "rgba(212,175,55,0.08)",
            border:
                "1px solid rgba(212,175,55,0.18)",
            color: "#d4af37",
            fontSize: "20px"
        },

        emptyTitle: {
            margin: 0,
            color: "#ffffff",
            fontSize: "13px"
        },

        emptyText: {
            margin:
                "6px 0 0",
            color: "#666666",
            fontSize: "10px"
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
                "rgba(0,0,0,0.70)"
        },

        confirmModal: {
            width:
                "min(420px, 100%)",
            background: "#151411",
            border:
                "1px solid #40351e",
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
    // NORMALISASI RESPONSE
    // =====================================================

    const getArrayData = (response) => {
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
            Array.isArray(result.kategori)
        ) {
            result = result.kategori;
        }

        return Array.isArray(result)
            ? result
            : [];
    };

    // =====================================================
    // LOAD DATA
    // =====================================================

    const loadData = async () => {
        try {
            setLoading(true);

            const result =
                await api.get(
                    "/kategori"
                );

            setData(
                getArrayData(result)
            );

        } catch (error) {
            console.error(
                "GAGAL MENGAMBIL KATEGORI:",
                error
            );

            setData([]);

            showMessage(
                error?.message ||
                "Gagal mengambil data kategori.",
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
        loadData();
    }, []);

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        const value =
            nama.trim();

        if (!value) {
            showMessage(
                "Nama kategori wajib diisi.",
                "error"
            );
            return;
        }

        try {
            setSaving(true);

            if (editId) {

                await api.put(
                    `/kategori/${editId}`,
                    {
                        nama_kategori:
                            value
                    }
                );

                showMessage(
                    "Kategori berhasil diperbarui."
                );

            } else {

                await api.post(
                    "/kategori",
                    {
                        nama_kategori:
                            value
                    }
                );

                showMessage(
                    "Kategori berhasil ditambahkan."
                );
            }

            setNama("");
            setEditId(null);

            await loadData();

        } catch (error) {
            console.error(
                "GAGAL MENYIMPAN KATEGORI:",
                error
            );

            showMessage(
                error?.message ||
                "Gagal menyimpan kategori.",
                "error"
            );

        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = (item) => {
        setEditId(
            item.id_kategori ||
            item.id
        );

        setNama(
            item.nama_kategori ||
            ""
        );

        setMessage("");
    };

    // =====================================================
    // CANCEL EDIT
    // =====================================================

    const cancelEdit = () => {
        if (saving) {
            return;
        }

        setEditId(null);
        setNama("");
    };

    // =====================================================
    // REQUEST DELETE
    // =====================================================

    const handleDelete = (item) => {
        setConfirmDelete(item);
    };

    // =====================================================
    // EXECUTE DELETE
    // =====================================================

    const executeDelete = async () => {
        if (!confirmDelete) {
            return;
        }

        const id =
            confirmDelete.id_kategori ||
            confirmDelete.id;

        if (!id) {
            setConfirmDelete(null);

            showMessage(
                "ID kategori tidak ditemukan.",
                "error"
            );

            return;
        }

        try {
            setDeleteLoading(true);

            await api.delete(
                `/kategori/${id}`
            );

            setConfirmDelete(null);

            if (
                editId === id
            ) {
                setEditId(null);
                setNama("");
            }

            showMessage(
                "Kategori berhasil dihapus."
            );

            await loadData();

        } catch (error) {
            console.error(
                "GAGAL MENGHAPUS KATEGORI:",
                error
            );

            showMessage(
                error?.message ||
                "Gagal menghapus kategori.",
                "error"
            );

        } finally {
            setDeleteLoading(false);
        }
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div style={styles.page}>

            {/* =========================================
                HEADER
            ========================================= */}

            <div style={styles.heading}>

                <span style={styles.kicker}>
                    KOLEKSI
                </span>

                <h2 style={styles.title}>
                    Kategori Kostum
                </h2>

                <p style={styles.subtitle}>
                    Kelola kategori kostum
                    Handu Atelier.
                </p>

            </div>

            {/* =========================================
                LAYOUT
            ========================================= */}

            <div style={styles.layout}>

                {/* =====================================
                    FORM
                ===================================== */}

                <div style={styles.card}>

                    <div
                        style={
                            styles.cardHeader
                        }
                    >

                        <h3
                            style={
                                styles.cardTitle
                            }
                        >
                            {editId
                                ? "Edit Kategori"
                                : "Tambah Kategori"}
                        </h3>

                        <p
                            style={
                                styles.cardSubtitle
                            }
                        >
                            {editId
                                ? "Ubah nama kategori yang dipilih."
                                : "Tambahkan kategori kostum baru."}
                        </p>

                    </div>

                    <div
                        style={
                            styles.formBody
                        }
                    >

                        <form
                            onSubmit={
                                handleSubmit
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
                                    Nama Kategori
                                </label>

                                <input
                                    type="text"
                                    value={
                                        nama
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setNama(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Contoh: Pengantin"
                                    style={
                                        styles.input
                                    }
                                    disabled={
                                        saving
                                    }
                                    required
                                />

                            </div>

                            <div
                                style={
                                    styles.actions
                                }
                            >

                                {editId && (
                                    <button
                                        type="button"
                                        style={{
                                            ...styles.secondaryButton,
                                            ...(saving
                                                ? styles.disabled
                                                : {})
                                        }}
                                        onClick={
                                            cancelEdit
                                        }
                                        disabled={
                                            saving
                                        }
                                    >
                                        Batal
                                    </button>
                                )}

                                <button
                                    type="submit"
                                    style={{
                                        ...styles.primaryButton,
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
                                            editId
                                                ? "edit"
                                                : "plus"
                                        }
                                        size={16}
                                    />

                                    {saving
                                        ? "Menyimpan..."
                                        : editId
                                            ? "Simpan"
                                            : "Tambah"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

                {/* =====================================
                    LIST
                ===================================== */}

                <div style={styles.card}>

                    <div
                        style={
                            styles.listHeader
                        }
                    >

                        <div>
                            <h3
                                style={
                                    styles.cardTitle
                                }
                            >
                                Daftar Kategori
                            </h3>

                            <p
                                style={
                                    styles.cardSubtitle
                                }
                            >
                                Semua kategori kostum yang
                                tersimpan.
                            </p>
                        </div>

                        <span
                            style={
                                styles.count
                            }
                        >
                            {data.length}
                        </span>

                    </div>

                    {/* MESSAGE */}

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

                    {/* CONTENT */}

                    {loading ? (

                        <div
                            style={
                                styles.loading
                            }
                        >
                            Memuat data kategori...
                        </div>

                    ) : data.length === 0 ? (

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
                                ◆
                            </div>

                            <h3
                                style={
                                    styles.emptyTitle
                                }
                            >
                                Belum ada kategori
                            </h3>

                            <p
                                style={
                                    styles.emptyText
                                }
                            >
                                Tambahkan kategori melalui
                                form di sebelah kiri.
                            </p>

                        </div>

                    ) : (

                        <div
                            style={
                                styles.list
                            }
                        >

                            {data.map(
                                (
                                    item,
                                    index
                                ) => {

                                    const id =
                                        item.id_kategori ||
                                        item.id;

                                    return (
                                        <div
                                            key={
                                                id ||
                                                index
                                            }
                                            style={
                                                styles.item
                                            }
                                        >

                                            <div
                                                style={
                                                    styles.number
                                                }
                                            >
                                                {String(
                                                    index + 1
                                                ).padStart(
                                                    2,
                                                    "0"
                                                )}
                                            </div>

                                            <div
                                                style={
                                                    styles.categoryName
                                                }
                                            >
                                                {
                                                    item.nama_kategori ||
                                                    "-"
                                                }
                                            </div>

                                            <div
                                                style={
                                                    styles.itemActions
                                                }
                                            >

                                                <button
                                                    type="button"
                                                    title="Edit"
                                                    style={
                                                        styles.editButton
                                                    }
                                                    onClick={() =>
                                                        handleEdit(
                                                            item
                                                        )
                                                    }
                                                >
                                                    <Icon
                                                        name="edit"
                                                        size={15}
                                                    />
                                                </button>

                                                <button
                                                    type="button"
                                                    title="Hapus"
                                                    style={
                                                        styles.deleteButton
                                                    }
                                                    onClick={() =>
                                                        handleDelete(
                                                            item
                                                        )
                                                    }
                                                >
                                                    <Icon
                                                        name="trash"
                                                        size={15}
                                                    />
                                                </button>

                                            </div>

                                        </div>
                                    );
                                }
                            )}

                        </div>
                    )}

                </div>

            </div>

            {/* =========================================
                DELETE CONFIRMATION
            ========================================= */}

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
                                Hapus Kategori?
                            </h3>

                            <p
                                style={
                                    styles.confirmText
                                }
                            >
                                Apakah kamu yakin ingin
                                menghapus kategori{" "}
                                <span
                                    style={
                                        styles.confirmName
                                    }
                                >
                                    "
                                    {
                                        confirmDelete.nama_kategori ||
                                        "kategori ini"
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
                                    ...styles.secondaryButton,
                                    ...(deleteLoading
                                        ? styles.disabled
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
                                    width: "auto",
                                    padding:
                                        "0 14px",
                                    ...(deleteLoading
                                        ? styles.disabled
                                        : {})
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

export default KategoriPage;