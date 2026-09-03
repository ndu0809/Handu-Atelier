import React, {
    useEffect,
    useState
} from "react";

import "./NotificationPanel.css";

import api from "../../lib/api";


const NotificationPanel = ({
    onClose
}) => {

    // ==================================================
    // STATE
    // ==================================================

    const [
        notifications,
        setNotifications
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(true);


    // ==================================================
    // LOAD NOTIFICATIONS
    // ==================================================

    const loadNotifications =
        async () => {

            try {

                setLoading(true);

                const response =
                    await api.get(
                        "/notifications"
                    );

                let data =
                    response;


                // ======================================
                // NORMALISASI RESPONSE
                // ======================================

                if (
                    response &&
                    typeof response ===
                        "object" &&
                    Array.isArray(
                        response.notifications
                    )
                ) {

                    data =
                        response.notifications;

                } else if (
                    response &&
                    typeof response ===
                        "object" &&
                    Array.isArray(
                        response.data
                    )
                ) {

                    data =
                        response.data;

                } else if (
                    response?.data &&
                    Array.isArray(
                        response.data.notifications
                    )
                ) {

                    data =
                        response.data.notifications;

                }


                if (
                    !Array.isArray(data)
                ) {

                    throw new Error(
                        "Format data notifikasi tidak sesuai."
                    );

                }


                // ======================================
                // URUTKAN TERBARU
                // ======================================

                const sorted =
                    [...data].sort(
                        (
                            a,
                            b
                        ) => {

                            return (
                                new Date(
                                    b.created_at
                                ) -
                                new Date(
                                    a.created_at
                                )
                            );

                        }
                    );


                setNotifications(
                    sorted
                );

            } catch (error) {

                console.error(
                    "Error notifikasi:",
                    error
                );

                setNotifications([]);

            } finally {

                setLoading(false);

            }

        };


    // ==================================================
    // LOAD AWAL
    // ==================================================

    useEffect(() => {

        loadNotifications();

    }, []);


    // ==================================================
    // FORMAT WAKTU
    // ==================================================

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
                month: "short",
                year: "numeric"
            }
        );

    };


    // ==================================================
    // JENIS NOTIFIKASI
    // ==================================================

    const getNotificationType =
        (pesan) => {

            const text =
                String(
                    pesan || ""
                ).toLowerCase();


            if (
                text.includes(
                    "selesai"
                ) ||
                text.includes(
                    "berhasil"
                ) ||
                text.includes(
                    "disetujui"
                ) ||
                text.includes(
                    "diterima"
                )
            ) {

                return "success";

            }


            if (
                text.includes(
                    "ditolak"
                ) ||
                text.includes(
                    "dibatalkan"
                ) ||
                text.includes(
                    "gagal"
                )
            ) {

                return "danger";

            }


            if (
                text.includes(
                    "peminjaman"
                ) ||
                text.includes(
                    "baru"
                )
            ) {

                return "gold";

            }


            return "info";

        };


    // ==================================================
    // ICON
    // ==================================================

    const getIcon =
        (type) => {

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


    // ==================================================
    // MARK AS READ
    // ==================================================

    const markAsRead =
        async (
            id
        ) => {

            if (!id) {
                return;
            }

            try {

                await api.put(
                    `/notifications/read/${id}`
                );


                setNotifications(
                    (prev) =>
                        prev.map(
                            (
                                item
                            ) =>
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
                    "Gagal menandai notifikasi:",
                    error
                );

            }

        };


    // ==================================================
    // MARK ALL AS READ
    // ==================================================

    const markAllAsRead =
        async () => {

            const unread =
                notifications.filter(
                    (
                        item
                    ) =>
                        item.status ===
                        "Belum Dibaca"
                );


            if (
                unread.length ===
                0
            ) {

                return;

            }


            try {

                await Promise.all(
                    unread.map(
                        (
                            item
                        ) =>
                            api.put(
                                `/notifications/read/${item.id_notifikasi}`
                            )
                    )
                );


                setNotifications(
                    (
                        prev
                    ) =>
                        prev.map(
                            (
                                item
                            ) => ({
                                ...item,
                                status:
                                    "Sudah Dibaca"
                            })
                        )
                );

            } catch (error) {

                console.error(
                    "Gagal menandai semua notifikasi:",
                    error
                );

            }

        };


    // ==================================================
    // UNREAD COUNT
    // ==================================================

    const unreadCount =
        notifications.filter(
            (
                item
            ) =>
                item.status ===
                "Belum Dibaca"
        ).length;


    // ==================================================
    // RENDER
    // ==================================================

    return (

        <div
            className="notification-overlay"
            onClick={
                onClose
            }
        >

            <div
                className="notification-panel"
                onClick={
                    (
                        event
                    ) =>
                        event.stopPropagation()
                }
            >

                {/* ====================================
                    HEADER
                ==================================== */}

                <div
                    className="notification-header"
                >

                    <div
                        className="notification-heading"
                    >

                        <div
                            className="notification-heading-icon"
                        >
                            ♢
                        </div>

                        <div>

                            <h3>
                                Notifikasi
                            </h3>

                            <p>
                                Aktivitas terbaru Handu Atelier
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        className="notification-close"
                        onClick={
                            onClose
                        }
                    >
                        ×
                    </button>

                </div>


                {/* ====================================
                    SUMMARY
                ==================================== */}

                <div
                    className="notification-summary"
                >

                    <div>

                        <span
                            className="notification-summary-title"
                        >
                            Semua Notifikasi
                        </span>

                        <span
                            className="notification-summary-total"
                        >
                            {
                                notifications.length
                            }
                        </span>

                    </div>


                    {unreadCount > 0 && (

                        <button
                            type="button"
                            className="mark-all-button"
                            onClick={
                                markAllAsRead
                            }
                        >
                            Tandai semua dibaca
                        </button>

                    )}

                </div>


                {/* ====================================
                    LIST
                ==================================== */}

                <div
                    className="notification-list"
                >

                    {loading ? (

                        <div
                            className="notification-loading"
                        >

                            <div
                                className="notification-spinner"
                            />

                            <span>
                                Memuat notifikasi...
                            </span>

                        </div>

                    ) : notifications.length === 0 ? (

                        <div
                            className="notification-empty"
                        >

                            <div
                                className="notification-empty-icon"
                            >
                                ♢
                            </div>

                            <h4>
                                Tidak ada notifikasi
                            </h4>

                            <p>
                                Belum ada aktivitas terbaru.
                            </p>

                        </div>

                    ) : (

                        notifications.map(
                            (
                                notification
                            ) => {

                                const type =
                                    getNotificationType(
                                        notification.pesan
                                    );

                                const isUnread =
                                    notification.status ===
                                    "Belum Dibaca";


                                return (

                                    <div
                                        key={
                                            notification.id_notifikasi
                                        }
                                        className={`notification-item ${
                                            isUnread
                                                ? "unread"
                                                : ""
                                        }`}
                                        onClick={() => {

                                            if (
                                                isUnread
                                            ) {

                                                markAsRead(
                                                    notification.id_notifikasi
                                                );

                                            }

                                        }}
                                    >

                                        <div
                                            className={`notification-icon ${type}`}
                                        >

                                            {
                                                getIcon(
                                                    type
                                                )
                                            }

                                        </div>


                                        <div
                                            className="notification-content"
                                        >

                                            <div
                                                className="notification-message"
                                            >

                                                {
                                                    notification.pesan
                                                }

                                            </div>


                                            <div
                                                className="notification-meta"
                                            >

                                                <span>
                                                    {
                                                        formatTime(
                                                            notification.created_at
                                                        )
                                                    }
                                                </span>


                                                {isUnread && (

                                                    <span
                                                        className="unread-label"
                                                    >
                                                        Baru
                                                    </span>

                                                )}

                                            </div>

                                        </div>


                                        {isUnread && (

                                            <span
                                                className="notification-dot"
                                            />

                                        )}

                                    </div>

                                );

                            }
                        )

                    )}

                </div>


                {/* ====================================
                    FOOTER
                ==================================== */}

                <div
                    className="notification-footer"
                >

                    <button
                        type="button"
                        className="notification-refresh"
                        onClick={
                            loadNotifications
                        }
                    >

                        <span>
                            ↻
                        </span>

                        Perbarui Notifikasi

                    </button>

                </div>

            </div>

        </div>

    );

};

export default NotificationPanel;