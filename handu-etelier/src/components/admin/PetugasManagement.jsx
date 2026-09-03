import React, {
    useEffect,
    useState
} from "react";

import api from "../../lib/api";
import Icon from "./Icon";
import AddPetugasModal from "./AddPetugasModal";
import PetugasList from "./PetugasList";

const PetugasManagement = () => {

    const [data, setData] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [modalOpen, setModalOpen] =
        useState(false);

    const [editData, setEditData] =
        useState(null);

    const [message, setMessage] =
        useState("");

    const [messageType, setMessageType] =
        useState("success");

    const [deleteTarget, setDeleteTarget] =
        useState(null);

    const [deleteLoading, setDeleteLoading] =
        useState(false);

    // =====================================================
    // STYLE
    // =====================================================

    const styles = {

        page: {
            width: "100%",
            color: "#ffffff"
        },

        heading: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "18px",
            flexWrap: "wrap",
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
            fontSize: "30px"
        },

        subtitle: {
            margin: "7px 0 0",
            color: "#7e7e7e",
            fontSize: "13px"
        },

        addButton: {
            height: "42px",
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            padding: "0 14px",
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

        toolbar: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "14px",
            padding: "17px 20px",
            borderBottom:
                "1px solid rgba(255,255,255,0.06)",
            flexWrap: "wrap"
        },

        searchBox: {
            width: "320px",
            maxWidth: "100%",
            height: "40px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "0 12px",
            boxSizing: "border-box",
            border: "1px solid #38301f",
            borderRadius: "8px",
            background: "#181714"
        },

        searchInput: {
            width: "100%",
            height: "100%",
            border: "none",
            outline: "none",
            background: "transparent",
            color: "#ffffff",
            fontSize: "10px"
        },

        resultCount: {
            color: "#777777",
            fontSize: "10px"
        },

        message: {
            margin: "14px 20px 0",
            padding: "10px 12px",
            borderRadius: "8px",
            fontSize: "10px",
            lineHeight: 1.5
        },

        success: {
            background:
                "rgba(76,175,80,0.09)",
            border:
                "1px solid rgba(76,175,80,0.22)",
            color: "#8bd38d"
        },

        error: {
            background:
                "rgba(220,70,70,0.09)",
            border:
                "1px solid rgba(220,70,70,0.22)",
            color: "#ff8585"
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
            minHeight: "250px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center"
        },

        emptyIcon: {
            width: "52px",
            height: "52px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "10px",
            borderRadius: "50%",
            background:
                "rgba(212,175,55,0.08)",
            border:
                "1px solid rgba(212,175,55,0.18)",
            color: "#d4af37",
            fontSize: "19px"
        },

        emptyTitle: {
            margin: 0,
            color: "#ffffff",
            fontSize: "13px"
        },

        emptyText: {
            margin: "5px 0 0",
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
                "rgba(0,0,0,0.72)"
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
            padding: "20px 22px 10px"
        },

        confirmTitle: {
            margin: 0,
            color: "#ffffff",
            fontSize: "18px"
        },

        confirmText: {
            margin: "8px 0 0",
            color: "#858585",
            fontSize: "11px",
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
        },

        cancelButton: {
            height: "39px",
            padding: "0 13px",
            border:
                "1px solid #40371f",
            borderRadius: "8px",
            background: "transparent",
            color: "#bdbdbd",
            cursor: "pointer",
            fontSize: "10px"
        },

        deleteButton: {
            height: "39px",
            padding: "0 13px",
            border:
                "1px solid rgba(220,70,70,0.30)",
            borderRadius: "8px",
            background:
                "rgba(220,70,70,0.12)",
            color: "#ff7d7d",
            cursor: "pointer",
            fontSize: "10px",
            fontWeight: 700
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
    // LOAD
    // =====================================================

    const loadData = async () => {

        try {

            setLoading(true);

            const result =
                await api.get(
                    "/petugas"
                );

            let petugas =
                result;

            if (
                petugas?.data !==
                undefined
            ) {
                petugas =
                    petugas.data;
            }

            if (
                petugas?.data !==
                undefined
            ) {
                petugas =
                    petugas.data;
            }

            if (
                Array.isArray(
                    petugas
                )
            ) {
                setData(
                    petugas
                );
            } else if (
                Array.isArray(
                    petugas?.petugas
                )
            ) {
                setData(
                    petugas.petugas
                );
            } else {
                setData([]);
            }

        } catch (error) {

            console.error(
                "LOAD PETUGAS:",
                error
            );

            setData([]);

            showMessage(
                error?.message ||
                "Gagal mengambil data petugas.",
                "error"
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (
        form
    ) => {

        try {

            if (editData) {

                await api.put(
                    `/petugas/${editData.id_user}`,
                    form
                );

                showMessage(
                    "Data petugas berhasil diperbarui."
                );

            } else {

                await api.post(
                    "/petugas",
                    form
                );

                showMessage(
                    "Petugas berhasil ditambahkan."
                );
            }

            setModalOpen(false);
            setEditData(null);

            await loadData();

        } catch (error) {

            console.error(
                "SAVE PETUGAS:",
                error
            );

            showMessage(
                error?.message ||
                "Gagal menyimpan data petugas.",
                "error"
            );

        }
    };

    // =====================================================
    // DELETE REQUEST
    // =====================================================

    const handleDelete = (
        item
    ) => {

        setDeleteTarget(
            item
        );
    };

    // =====================================================
    // DELETE EXECUTE
    // =====================================================

    const executeDelete = async () => {

        if (!deleteTarget) {
            return;
        }

        try {

            setDeleteLoading(
                true
            );

            await api.delete(
                `/petugas/${deleteTarget.id_user}`
            );

            setDeleteTarget(
                null
            );

            showMessage(
                "Petugas berhasil dihapus."
            );

            await loadData();

        } catch (error) {

            console.error(
                "DELETE PETUGAS:",
                error
            );

            showMessage(
                error?.message ||
                "Gagal menghapus data petugas.",
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

    const keyword =
        search
            .trim()
            .toLowerCase();

    const filteredData =
        data.filter(
            (item) => {

                return (
                    String(
                        item.nama ||
                        ""
                    )
                        .toLowerCase()
                        .includes(
                            keyword
                        ) ||

                    String(
                        item.email ||
                        ""
                    )
                        .toLowerCase()
                        .includes(
                            keyword
                        ) ||

                    String(
                        item.no_whatsapp ||
                        ""
                    )
                        .toLowerCase()
                        .includes(
                            keyword
                        )
                );

            }
        );

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div
            style={
                styles.page
            }
        >

            {/* HEADER */}

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
                        MANAJEMEN
                    </span>

                    <h2
                        style={
                            styles.title
                        }
                    >
                        Petugas
                    </h2>

                    <p
                        style={
                            styles.subtitle
                        }
                    >
                        Kelola data petugas
                        Handu Atelier.
                    </p>

                </div>

                <button
                    type="button"
                    style={
                        styles.addButton
                    }
                    onClick={() => {

                        setEditData(null);
                        setMessage("");
                        setModalOpen(true);

                    }}
                >

                    <Icon
                        name="plus"
                        size={18}
                    />

                    Tambah Petugas

                </button>

            </div>

            {/* CARD */}

            <div
                style={
                    styles.card
                }
            >

                <div
                    style={
                        styles.toolbar
                    }
                >

                    <div
                        style={
                            styles.searchBox
                        }
                    >

                        <Icon
                            name="search"
                            size={17}
                        />

                        <input
                            type="text"
                            placeholder="Cari petugas..."
                            value={
                                search
                            }
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            style={
                                styles.searchInput
                            }
                        />

                    </div>

                    <span
                        style={
                            styles.resultCount
                        }
                    >
                        {
                            filteredData.length
                        } Petugas
                    </span>

                </div>

                {message && (
                    <div
                        style={{
                            ...styles.message,
                            ...(messageType ===
                            "error"
                                ? styles.error
                                : styles.success)
                        }}
                    >
                        {message}
                    </div>
                )}

                {loading ? (

                    <div
                        style={
                            styles.loading
                        }
                    >
                        Memuat data petugas...
                    </div>

                ) : filteredData.length === 0 ? (

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
                            {search
                                ? "Petugas tidak ditemukan"
                                : "Belum ada data petugas"}
                        </h3>

                        <p
                            style={
                                styles.emptyText
                            }
                        >
                            {search
                                ? "Coba gunakan kata kunci pencarian lain."
                                : "Tambahkan petugas melalui tombol Tambah Petugas."}
                        </p>

                    </div>

                ) : (

                    <PetugasList
                        data={
                            filteredData
                        }
                        onEdit={(item) => {

                            setEditData(
                                item
                            );

                            setMessage(
                                ""
                            );

                            setModalOpen(
                                true
                            );

                        }}
                        onDelete={
                            handleDelete
                        }
                    />

                )}

            </div>

            {/* DELETE MODAL */}

            {deleteTarget && (
                <div
                    style={
                        styles.modalOverlay
                    }
                    onClick={() => {

                        if (
                            !deleteLoading
                        ) {
                            setDeleteTarget(
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
                                Hapus Petugas?
                            </h3>

                            <p
                                style={
                                    styles.confirmText
                                }
                            >
                                Apakah kamu yakin ingin
                                menghapus petugas{" "}
                                <span
                                    style={
                                        styles.confirmName
                                    }
                                >
                                    "
                                    {
                                        deleteTarget.nama ||
                                        "petugas ini"
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
                                style={
                                    styles.cancelButton
                                }
                                onClick={() =>
                                    setDeleteTarget(
                                        null
                                    )
                                }
                                disabled={
                                    deleteLoading
                                }
                            >
                                Batal
                            </button>

                            <button
                                type="button"
                                style={{
                                    ...styles.deleteButton,
                                    ...(deleteLoading
                                        ? {
                                            opacity:
                                                0.55,
                                            cursor:
                                                "not-allowed"
                                        }
                                        : {})
                                }}
                                onClick={
                                    executeDelete
                                }
                                disabled={
                                    deleteLoading
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

            {/* ADD / EDIT MODAL */}

            <AddPetugasModal
                isOpen={
                    modalOpen
                }
                onClose={() => {

                    setModalOpen(
                        false
                    );

                    setEditData(
                        null
                    );

                }}
                onSubmit={
                    handleSubmit
                }
                initialData={
                    editData
                }
            />

        </div>
    );
};

export default PetugasManagement;