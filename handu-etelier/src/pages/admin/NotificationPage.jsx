import React, {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import api from "../../lib/api";

const NotificationPage = () => {
    const navigate = useNavigate();

    // =====================================================
    // STATE
    // =====================================================

    const [notifications, setNotifications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [actionLoading, setActionLoading] =
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
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "15px",
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
            fontSize: "30px",
            lineHeight: 1.2
        },

        subtitle: {
            margin: "7px 0 0",
            color: "#7e7e7e",
            fontSize: "13px"
        },

        backButton: {
            height: "39px",
            padding: "0 13px",
            border:
                "1px solid rgba(212,175,55,0.25)",
            borderRadius: "8px",
            background:
                "rgba(212,175,55,0.06)",
            color: "#d4af37",
            cursor: "pointer",
            fontSize: "10px",
            fontWeight: 600
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
            gap: "14px",
            padding: "18px 20px",
            borderBottom:
                "1px solid rgba(255,255,255,0.06)",
            flexWrap: "wrap"
        },

        cardTitle: {
            margin: 0,
            color: "#ffffff",
            fontSize: "15px",
            fontWeight: 600
        },

        cardCount: {
            display: "block",
            marginTop: "4px",
            color: "#696969",
            fontSize: "9px"
        },

        markButton: {
            height: "37px",
            padding: "0 12px",
            border:
                "1px solid rgba(212,175,55,0.25)",
            borderRadius: "7px",
            background:
                "rgba(212,175,55,0.07)",
            color: "#d4af37",
            cursor: "pointer",
            fontSize: "10px",
            fontWeight: 600
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

        list: {
            display: "flex",
            flexDirection: "column"
        },

        item: {
            display: "grid",
            gridTemplateColumns:
                "46px minmax(0, 1fr) auto",
            gap: "13px",
            alignItems: "center",
            padding: "16px 20px",
            borderBottom:
                "1px solid rgba(255,255,255,0.045)",
            cursor: "pointer"
        },

        unreadItem: {
            background:
                "rgba(212,175,55,0.035)"
        },

        icon: {
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            fontSize: "15px",
            fontWeight: 700
        },

        successIcon: {
            background:
                "rgba(76,175,80,0.10)",
            border:
                "1px solid rgba(76,175,80,0.22)",
            color: "#79d27d"
        },

        dangerIcon: {
            background:
                "rgba(220,70,70,0.10)",
            border:
                "1px solid rgba(220,70,70,0.22)",
            color: "#ff7d7d"
        },

        goldIcon: {
            background:
                "rgba(212,175,55,0.10)",
            border:
                "1px solid rgba(212,175,55,0.22)",
            color: "#d4af37"
        },

        infoIcon: {
            background:
                "rgba(80,130,190,0.10)",
            border:
                "1px solid rgba(80,130,190,0.22)",
            color: "#8bb1df"
        },

        content: {
            minWidth: 0
        },

        messageText: {
            margin: 0,
            color: "#d9d9d9",
            fontSize: "11px",
            lineHeight: 1.6,
            wordBreak: "break-word"
        },

        time: {
            display: "block",
            marginTop: "5px",
            color: "#666666",
            fontSize: "9px"
        },

        newBadge: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding:
                "5px 8px",
            borderRadius: "20px",
            background:
                "rgba(212,175,55,0.10)",
            border:
                "1px solid rgba(212,175,55,0.22)",
            color: "#d4af37",
            fontSize: "8px",
            fontWeight: 700
        },

        readBadge: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding:
                "5px 8px",
            borderRadius: "20px",
            background:
                "rgba(130,130,130,0.08)",
            border:
                "1px solid rgba(130,130,130,0.16)",
            color: "#777777",
            fontSize: "8px",
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
            minHeight: "270px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "25px"
        },

        emptySymbol: {
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
            margin: "6px 0 0",
            color: "#666666",
            fontSize: "10px"
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
            cursor: "pointer",
            fontSize: "10px",
            fontWeight: 600
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
    // LOAD NOTIFICATIONS
    // =====================================================

    const loadNotifications = async () => {
        try {
            setLoading(true);
            setMessage("");

            const response =
                await api.get(
                    "/notifications"
                );

            let data = response;

            if (
                data &&
                typeof data === "object" &&
                Array.isArray(data.data)
            ) {
                data = data.data;
            }

            if (
                data &&
                typeof data === "object" &&
                Array.isArray(
                    data.notifications
                )
            ) {
                data =
                    data.notifications;
            }

            if (
                data?.data &&
                Array.isArray(
                    data.data.notifications
                )
            ) {
                data =
                    data.data.notifications;
            }

            if (!Array.isArray(data)) {
                throw new Error(
                    response?.message ||
                    "Format data notifikasi tidak sesuai."
                );
            }

            setNotifications(data);

        } catch (error) {
            console.error(
                "ERROR NOTIFIKASI:",
                error
            );

            setNotifications([]);

            showMessage(
                error?.message ||
                "Gagal mengambil notifikasi.",
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
        loadNotifications();
    }, []);

    // =====================================================
    // FORMAT WAKTU
    // =====================================================

    const formatTime = (
        date
    ) => {
        if (!date) {
            return "";
        }

        const notificationDate =
            new Date(date);

        if (
            Number.isNaN(
                notificationDate.getTime()
            )
        ) {
            return "";
        }

        const now =
            new Date();

        const difference =
            Math.floor(
                (
                    now -
                    notificationDate
                ) / 1000
            );

        if (
            difference < 0
        ) {
            return "Baru saja";
        }

        if (
            difference < 60
        ) {
            return "Baru saja";
        }

        if (
            difference < 3600
        ) {
            return `${Math.floor(
                difference / 60
            )} menit lalu`;
        }

        if (
            difference < 86400
        ) {
            return `${Math.floor(
                difference / 3600
            )} jam lalu`;
        }

        if (
            difference < 604800
        ) {
            return `${Math.floor(
                difference / 86400
            )} hari lalu`;
        }

        return notificationDate.toLocaleDateString(
            "id-ID",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );
    };

    // =====================================================
    // TYPE
    // =====================================================

    const getType = (
        pesan
    ) => {
        const text =
            String(
                pesan || ""
            ).toLowerCase();

        if (
            text.includes("selesai") ||
            text.includes("berhasil") ||
            text.includes("diterima")
        ) {
            return "success";
        }

        if (
            text.includes("dibatalkan") ||
            text.includes("gagal")
        ) {
            return "danger";
        }

        if (
            text.includes("baru") ||
            text.includes("peminjaman")
        ) {
            return "gold";
        }

        return "info";
    };

    // =====================================================
    // ICON
    // =====================================================

    const getIcon = (
        type
    ) => {
        switch (
            type
        ) {
            case "success":
                return "✓";

            case "danger":
                return "×";

            case "gold":
                return "◆";

            default:
                return "i";
        }
    };

    // =====================================================
    // ICON STYLE
    // =====================================================

    const getIconStyle = (
        type
    ) => {
        switch (
            type
        ) {
            case "success":
                return {
                    ...styles.icon,
                    ...styles.successIcon
                };

            case "danger":
                return {
                    ...styles.icon,
                    ...styles.dangerIcon
                };

            case "gold":
                return {
                    ...styles.icon,
                    ...styles.goldIcon
                };

            default:
                return {
                    ...styles.icon,
                    ...styles.infoIcon
                };
        }
    };

    // =====================================================
    // MARK AS READ
    // =====================================================

    const markAsRead = async (
        id
    ) => {
        if (!id) {
            return;
        }

        try {
            setActionLoading(true);

            await api.put(
                `/notifications/read/${id}`
            );

            setNotifications(
                (prev) =>
                    prev.map(
                        (item) =>
                            item.id_notifikasi ===
                            id
                                ? {
                                    ...item,
                                    status:
                                        "Sudah Dibaca"
                                }
                                : item
                    )
            );

        } catch (error) {
            console.error(
                "GAGAL MENANDAI NOTIFIKASI:",
                error
            );

            showMessage(
                error?.message ||
                "Gagal menandai notifikasi.",
                "error"
            );

        } finally {
            setActionLoading(false);
        }
    };

    // =====================================================
    // MARK ALL AS READ
    // =====================================================

    const markAllAsRead =
        async () => {
            const unread =
                notifications.filter(
                    (item) =>
                        item.status ===
                        "Belum Dibaca"
                );

            if (
                unread.length === 0
            ) {
                return;
            }

            try {
                setActionLoading(
                    true
                );

                for (
                    const item
                    of unread
                ) {
                    await api.put(
                        `/notifications/read/${item.id_notifikasi}`
                    );
                }

                setNotifications(
                    (prev) =>
                        prev.map(
                            (item) => ({
                                ...item,
                                status:
                                    "Sudah Dibaca"
                            })
                        )
                );

                showMessage(
                    "Semua notifikasi telah ditandai sebagai dibaca."
                );

            } catch (error) {
                console.error(
                    "GAGAL MENANDAI SEMUA NOTIFIKASI:",
                    error
                );

                showMessage(
                    error?.message ||
                    "Gagal menandai semua notifikasi.",
                    "error"
                );

            } finally {
                setActionLoading(
                    false
                );
            }
        };

    // =====================================================
    // UNREAD
    // =====================================================

    const unreadCount =
        notifications.filter(
            (item) =>
                item.status ===
                "Belum Dibaca"
        ).length;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div
            style={
                styles.page
            }
        >

            {/* =========================================
                HEADER
            ========================================= */}

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

                    <h2
                        style={
                            styles.title
                        }
                    >
                        Notifikasi
                    </h2>

                    <p
                        style={
                            styles.subtitle
                        }
                    >
                        Semua pemberitahuan aktivitas
                        Handu Atelier.
                    </p>

                </div>

                <button
                    type="button"
                    style={
                        styles.backButton
                    }
                    onClick={() =>
                        navigate(
                            "/admin/dashboard"
                        )
                    }
                >
                    ← Dashboard
                </button>

            </div>

            {/* =========================================
                CARD
            ========================================= */}

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

                        <h3
                            style={
                                styles.cardTitle
                            }
                        >
                            Semua Notifikasi
                        </h3>

                        <span
                            style={
                                styles.cardCount
                            }
                        >
                            {notifications.length}{" "}
                            notifikasi
                            {unreadCount > 0 &&
                                ` • ${unreadCount} belum dibaca`}
                        </span>

                    </div>

                    {unreadCount > 0 && (
                        <button
                            type="button"
                            style={{
                                ...styles.markButton,
                                ...(actionLoading
                                    ? {
                                        opacity: 0.55,
                                        cursor:
                                            "not-allowed"
                                    }
                                    : {})
                            }}
                            disabled={
                                actionLoading
                            }
                            onClick={
                                markAllAsRead
                            }
                        >
                            Tandai semua dibaca
                        </button>
                    )}

                </div>

                {/* =====================================
                    MESSAGE
                ===================================== */}

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

                {/* =====================================
                    LOADING
                ===================================== */}

                {loading ? (

                    <div
                        style={
                            styles.loading
                        }
                    >
                        Memuat notifikasi...
                    </div>

                ) : notifications.length === 0 ? (

                    <div
                        style={
                            styles.empty
                        }
                    >

                        <div
                            style={
                                styles.emptySymbol
                            }
                        >
                            ♢
                        </div>

                        <h3
                            style={
                                styles.emptyTitle
                            }
                        >
                            Tidak ada notifikasi
                        </h3>

                        <p
                            style={
                                styles.emptyText
                            }
                        >
                            Belum ada pemberitahuan baru.
                        </p>

                    </div>

                ) : (

                    <div
                        style={
                            styles.list
                        }
                    >

                        {notifications.map(
                            (
                                notification
                            ) => {

                                const type =
                                    getType(
                                        notification.pesan
                                    );

                                const unread =
                                    notification.status ===
                                    "Belum Dibaca";

                                return (
                                    <div
                                        key={
                                            notification.id_notifikasi
                                        }
                                        style={{
                                            ...styles.item,
                                            ...(unread
                                                ? styles.unreadItem
                                                : {})
                                        }}
                                        onClick={() => {
                                            if (
                                                unread &&
                                                !actionLoading
                                            ) {
                                                markAsRead(
                                                    notification.id_notifikasi
                                                );
                                            }
                                        }}
                                    >

                                        <div
                                            style={
                                                getIconStyle(
                                                    type
                                                )
                                            }
                                        >
                                            {getIcon(
                                                type
                                            )}
                                        </div>

                                        <div
                                            style={
                                                styles.content
                                            }
                                        >

                                            <p
                                                style={
                                                    styles.messageText
                                                }
                                            >
                                                {
                                                    notification.pesan
                                                }
                                            </p>

                                            <span
                                                style={
                                                    styles.time
                                                }
                                            >
                                                {formatTime(
                                                    notification.created_at
                                                )}
                                            </span>

                                        </div>

                                        {unread ? (

                                            <span
                                                style={
                                                    styles.newBadge
                                                }
                                            >
                                                BARU
                                            </span>

                                        ) : (

                                            <span
                                                style={
                                                    styles.readBadge
                                                }
                                            >
                                                DIBACA
                                            </span>

                                        )}

                                    </div>
                                );
                            }
                        )}

                    </div>
                )}

                {/* =====================================
                    FOOTER
                ===================================== */}

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
                            loadNotifications
                        }
                    >
                        ↻ Perbarui Notifikasi
                    </button>

                </div>

            </div>

        </div>
    );
};

export default NotificationPage;