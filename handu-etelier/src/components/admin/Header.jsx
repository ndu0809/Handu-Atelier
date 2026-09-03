import React, {
    useEffect,
    useState
} from "react";

import {
    useLocation,
    useNavigate
} from "react-router-dom";

import Icon from "./Icon";


// =====================================================
// HEADER ADMIN
// =====================================================

const Header = ({
    onMenuClick,
    onNavigate
}) => {

    const navigate =
        useNavigate();

    const location =
        useLocation();


    // =====================================================
    // CLOCK
    // =====================================================

    const [
        currentTime,
        setCurrentTime
    ] = useState(
        new Date()
    );


    // =====================================================
    // LOGOUT MODAL
    // =====================================================

    const [
        showLogoutModal,
        setShowLogoutModal
    ] = useState(false);


    // =====================================================
    // ADMIN
    // =====================================================

    const [
        admin,
        setAdmin
    ] = useState(null);


    // =====================================================
    // NOTIFICATION
    // =====================================================

    const [
        unreadCount,
        setUnreadCount
    ] = useState(0);


    // =====================================================
    // CLOCK
    // =====================================================

    useEffect(() => {

        const timer =
            setInterval(
                () => {

                    setCurrentTime(
                        new Date()
                    );

                },
                1000
            );

        return () => {

            clearInterval(
                timer
            );

        };

    }, []);


    // =====================================================
    // AMBIL DATA ADMIN
    // =====================================================

    useEffect(() => {

        try {

            const savedAdmin =
                localStorage.getItem(
                    "admin"
                );


            if (
                savedAdmin
            ) {

                const parsed =
                    JSON.parse(
                        savedAdmin
                    );

                setAdmin(
                    parsed
                );

                return;

            }


            // -------------------------------------------------
            // FALLBACK KE USER
            // -------------------------------------------------

            const savedUser =
                localStorage.getItem(
                    "user"
                );


            if (
                savedUser
            ) {

                const parsedUser =
                    JSON.parse(
                        savedUser
                    );


                if (
                    Number(
                        parsedUser?.id_role
                    ) === 1
                ) {

                    setAdmin(
                        parsedUser
                    );

                    return;

                }

            }


            setAdmin(
                null
            );

        } catch (
            error
        ) {

            console.error(
                "Gagal membaca data admin:",
                error
            );

            setAdmin(
                null
            );

        }

    }, [
        location.pathname
    ]);


    // =====================================================
    // JUMLAH NOTIFIKASI BELUM DIBACA
    // =====================================================

    const loadUnreadCount =
        async () => {

            try {

                let adminData =
                    admin;


                // -------------------------------------------------
                // FALLBACK JIKA STATE BELUM TERISI
                // -------------------------------------------------

                if (
                    !adminData
                ) {

                    const savedAdmin =
                        localStorage.getItem(
                            "admin"
                        );


                    if (
                        savedAdmin
                    ) {

                        adminData =
                            JSON.parse(
                                savedAdmin
                            );

                    }

                }


                // -------------------------------------------------
                // FALLBACK USER
                // -------------------------------------------------

                if (
                    !adminData?.id_user
                ) {

                    const savedUser =
                        localStorage.getItem(
                            "user"
                        );


                    if (
                        savedUser
                    ) {

                        const parsedUser =
                            JSON.parse(
                                savedUser
                            );


                        if (
                            Number(
                                parsedUser?.id_role
                            ) === 1
                        ) {

                            adminData =
                                parsedUser;

                        }

                    }

                }


                // -------------------------------------------------
                // ADMIN TIDAK DITEMUKAN
                // -------------------------------------------------

                if (
                    !adminData?.id_user
                ) {

                    setUnreadCount(
                        0
                    );

                    return;

                }


                // -------------------------------------------------
                // REQUEST
                // -------------------------------------------------

                const response =
                    await fetch(
                        `/api/notifications/unread/${adminData.id_user}`,
                        {
                            method:
                                "GET",

                            headers: {
                                Accept:
                                    "application/json"
                            },

                            cache:
                                "no-store"
                        }
                    );


                if (
                    !response.ok
                ) {

                    throw new Error(
                        "Gagal mengambil jumlah notifikasi."
                    );

                }


                const result =
                    await response.json();


                const total =
                    Number(
                        result?.total
                    ) || 0;


                setUnreadCount(
                    total
                );

            } catch (
                error
            ) {

                console.error(
                    "Gagal mengambil jumlah notifikasi:",
                    error
                );

                // Jangan membuat Header rusak
                // apabila endpoint notification sedang error.
                setUnreadCount(
                    0
                );

            }

        };


    // =====================================================
    // LOAD NOTIFICATION
    // =====================================================

    useEffect(() => {

        // Jalankan langsung
        loadUnreadCount();


        // -------------------------------------------------
        // AUTO REFRESH SETIAP 10 DETIK
        // -------------------------------------------------

        const interval =
            setInterval(
                () => {

                    loadUnreadCount();

                },
                10000
            );


        return () => {

            clearInterval(
                interval
            );

        };

    }, [
        admin?.id_user
    ]);


    // =====================================================
    // REFRESH SAAT TAB AKTIF
    // =====================================================

    useEffect(() => {

        const handleFocus =
            () => {

                loadUnreadCount();

            };


        const handleVisibility =
            () => {

                if (
                    document.visibilityState ===
                    "visible"
                ) {

                    loadUnreadCount();

                }

            };


        window.addEventListener(
            "focus",
            handleFocus
        );


        document.addEventListener(
            "visibilitychange",
            handleVisibility
        );


        return () => {

            window.removeEventListener(
                "focus",
                handleFocus
            );


            document.removeEventListener(
                "visibilitychange",
                handleVisibility
            );

        };

    }, [
        admin?.id_user
    ]);


    // =====================================================
    // FORMAT TANGGAL
    // =====================================================

    const formatDate =
        (
            date
        ) => {

            return new Intl.DateTimeFormat(
                "id-ID",
                {
                    weekday:
                        "long",

                    day:
                        "2-digit",

                    month:
                        "long",

                    year:
                        "numeric"
                }
            ).format(
                date
            );

        };


    // =====================================================
    // FORMAT JAM
    // =====================================================

    const formatTime =
        (
            date
        ) => {

            return new Intl.DateTimeFormat(
                "id-ID",
                {
                    hour:
                        "2-digit",

                    minute:
                        "2-digit",

                    second:
                        "2-digit",

                    hour12:
                        false
                }
            ).format(
                date
            );

        };


    // =====================================================
    // DATA ADMIN
    // =====================================================

    const adminName =
        admin?.nama ||
        "Admin";


    const adminRole =
        admin?.nama_role ||
        "Administrator";


    const adminInitial =
        String(
            adminName
        )
            .trim()
            .charAt(0)
            .toUpperCase() ||
        "A";


    // =====================================================
    // NOTIFICATION CLICK
    // =====================================================

    const handleNotificationClick =
        () => {

            if (
                typeof onNavigate ===
                "function"
            ) {

                onNavigate(
                    "notifications"
                );

                return;

            }


            navigate(
                "/admin/notifikasi"
            );

        };


    // =====================================================
    // HOME CLICK
    // =====================================================

    const handleHomeClick =
        () => {

            navigate(
                "/"
            );

        };


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogoutClick =
        () => {

            setShowLogoutModal(
                true
            );

        };


    // =====================================================
    // CANCEL LOGOUT
    // =====================================================

    const cancelLogout =
        () => {

            setShowLogoutModal(
                false
            );

        };


    // =====================================================
    // EXECUTE LOGOUT
    // =====================================================

    const executeLogout =
        () => {

            // -------------------------------------------------
            // HAPUS SESSION ADMIN
            // -------------------------------------------------

            localStorage.removeItem(
                "admin"
            );

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "adminToken"
            );

            localStorage.removeItem(
                "isAdminLoggedIn"
            );

            localStorage.removeItem(
                "adminLoggedIn"
            );


            // -------------------------------------------------
            // RESET STATE
            // -------------------------------------------------

            setAdmin(
                null
            );

            setUnreadCount(
                0
            );

            setShowLogoutModal(
                false
            );


            // -------------------------------------------------
            // ARAHKAN KE HALAMAN UTAMA WEBSITE
            // -------------------------------------------------

            navigate(
                "/",
                {
                    replace:
                        true
                }
            );

        };


    // =====================================================
    // STYLE
    // =====================================================

    const styles = {

        // ===================================================
        // HEADER
        // ===================================================

        header: {

            position:
                "sticky",

            top:
                0,

            zIndex:
                100,

            minHeight:
                "76px",

            display:
                "flex",

            alignItems:
                "center",

            gap:
                "16px",

            padding:
                "0 24px",

            boxSizing:
                "border-box",

            background:
                "rgba(15, 14, 12, 0.96)",

            borderBottom:
                "1px solid rgba(212,175,55,0.12)",

            backdropFilter:
                "blur(10px)"

        },


        // ===================================================
        // MOBILE MENU
        // ===================================================

        mobileMenu: {

            width:
                "38px",

            height:
                "38px",

            display:
                "none",

            alignItems:
                "center",

            justifyContent:
                "center",

            border:
                "1px solid #3b321f",

            borderRadius:
                "8px",

            background:
                "#171613",

            color:
                "#d4af37",

            cursor:
                "pointer"

        },


        // ===================================================
        // TITLE
        // ===================================================

        title: {

            flex:
                1,

            minWidth:
                0

        },


        titleText: {

            margin:
                0,

            color:
                "#ffffff",

            fontSize:
                "17px",

            fontWeight:
                700

        },


        titleSub: {

            margin:
                "4px 0 0",

            color:
                "#6f6f6f",

            fontSize:
                "10px"

        },


        // ===================================================
        // RIGHT
        // ===================================================

        right: {

            display:
                "flex",

            alignItems:
                "center",

            gap:
                "14px"

        },


        // ===================================================
        // DATE
        // ===================================================

        dateBox: {

            display:
                "flex",

            alignItems:
                "center",

            gap:
                "8px",

            paddingRight:
                "14px",

            borderRight:
                "1px solid rgba(255,255,255,0.08)"

        },


        dateIcon: {

            color:
                "#d4af37"

        },


        dateContent: {

            display:
                "flex",

            flexDirection:
                "column",

            gap:
                "2px"

        },


        dateText: {

            color:
                "#d0d0d0",

            fontSize:
                "10px",

            fontWeight:
                600,

            whiteSpace:
                "nowrap"

        },


        timeText: {

            color:
                "#696969",

            fontSize:
                "9px",

            whiteSpace:
                "nowrap"

        },


        // ===================================================
        // NOTIFICATION
        // ===================================================

        notificationButton: {

            position:
                "relative",

            width:
                "38px",

            height:
                "38px",

            display:
                "flex",

            alignItems:
                "center",

            justifyContent:
                "center",

            border:
                "1px solid #3b321f",

            borderRadius:
                "8px",

            background:
                "#171613",

            color:
                "#d4af37",

            cursor:
                "pointer"

        },


        // ===================================================
        // BADGE
        // ===================================================

        badge: {

            position:
                "absolute",

            top:
                "-4px",

            right:
                "-4px",

            minWidth:
                "17px",

            height:
                "17px",

            display:
                "flex",

            alignItems:
                "center",

            justifyContent:
                "center",

            padding:
                "0 4px",

            boxSizing:
                "border-box",

            borderRadius:
                "20px",

            background:
                "#c94f4f",

            border:
                "2px solid #0f0e0c",

            color:
                "#ffffff",

            fontSize:
                "8px",

            fontWeight:
                700

        },


        // ===================================================
        // HOME
        // ===================================================

        homeButton: {

            width:
                "38px",

            height:
                "38px",

            display:
                "flex",

            alignItems:
                "center",

            justifyContent:
                "center",

            border:
                "1px solid #3b321f",

            borderRadius:
                "8px",

            background:
                "#171613",

            color:
                "#d4af37",

            cursor:
                "pointer",

            fontSize:
                "18px",

            fontWeight:
                700

        },


        // ===================================================
        // LOGOUT
        // ===================================================

        logoutButton: {

            width:
                "38px",

            height:
                "38px",

            display:
                "flex",

            alignItems:
                "center",

            justifyContent:
                "center",

            border:
                "1px solid rgba(220,70,70,0.22)",

            borderRadius:
                "8px",

            background:
                "rgba(220,70,70,0.06)",

            color:
                "#ff8585",

            cursor:
                "pointer",

            fontSize:
                "17px"

        },


        // ===================================================
        // PROFILE
        // ===================================================

        profile: {

            display:
                "flex",

            alignItems:
                "center",

            gap:
                "9px",

            paddingLeft:
                "2px"

        },


        avatar: {

            width:
                "36px",

            height:
                "36px",

            minWidth:
                "36px",

            display:
                "flex",

            alignItems:
                "center",

            justifyContent:
                "center",

            borderRadius:
                "50%",

            background:
                "rgba(212,175,55,0.10)",

            border:
                "1px solid rgba(212,175,55,0.25)",

            color:
                "#d4af37",

            fontSize:
                "12px",

            fontWeight:
                700

        },


        profileInfo: {

            display:
                "flex",

            flexDirection:
                "column",

            gap:
                "2px"

        },


        profileName: {

            color:
                "#e5e5e5",

            fontSize:
                "10px",

            fontWeight:
                600,

            whiteSpace:
                "nowrap"

        },


        profileRole: {

            color:
                "#666666",

            fontSize:
                "8px",

            whiteSpace:
                "nowrap"

        },


        // ===================================================
        // LOGOUT MODAL
        // ===================================================

        modalOverlay: {

            position:
                "fixed",

            inset:
                0,

            zIndex:
                10000,

            display:
                "flex",

            alignItems:
                "center",

            justifyContent:
                "center",

            padding:
                "20px",

            background:
                "rgba(0,0,0,0.72)"

        },


        modal: {

            width:
                "min(410px, 100%)",

            background:
                "#151411",

            border:
                "1px solid #40351f",

            borderRadius:
                "14px",

            boxShadow:
                "0 20px 60px rgba(0,0,0,0.45)"

        },


        modalBody: {

            padding:
                "22px"

        },


        modalTitle: {

            margin:
                0,

            color:
                "#ffffff",

            fontSize:
                "18px",

            fontWeight:
                700

        },


        modalText: {

            margin:
                "8px 0 0",

            color:
                "#858585",

            fontSize:
                "12px",

            lineHeight:
                1.6

        },


        modalName: {

            color:
                "#d4af37",

            fontWeight:
                700

        },


        modalActions: {

            display:
                "flex",

            justifyContent:
                "flex-end",

            gap:
                "8px",

            marginTop:
                "20px"

        },


        cancelButton: {

            height:
                "39px",

            padding:
                "0 14px",

            border:
                "1px solid #40371f",

            borderRadius:
                "8px",

            background:
                "transparent",

            color:
                "#bcbcbc",

            cursor:
                "pointer",

            fontSize:
                "11px",

            fontWeight:
                600

        },


        confirmButton: {

            height:
                "39px",

            padding:
                "0 14px",

            border:
                "1px solid rgba(220,70,70,0.35)",

            borderRadius:
                "8px",

            background:
                "rgba(220,70,70,0.12)",

            color:
                "#ff7d7d",

            cursor:
                "pointer",

            fontSize:
                "11px",

            fontWeight:
                700

        }

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <>

            <header
                style={
                    styles.header
                }
            >

                {/* =================================================
                    MOBILE MENU
                ================================================= */}

                <button
                    type="button"
                    aria-label="Buka menu"
                    style={{
                        ...styles.mobileMenu,

                        /*
                         * Tetap tampil pada semua ukuran
                         * agar tombol menu yang sekarang sudah
                         * berfungsi tidak hilang.
                         */
                        display:
                            "flex"
                    }}
                    onClick={
                        onMenuClick
                    }
                >

                    <Icon
                        name="menu"
                        size={21}
                    />

                </button>


                {/* =================================================
                    TITLE
                ================================================= */}

                <div
                    style={
                        styles.title
                    }
                >

                    <h1
                        style={
                            styles.titleText
                        }
                    >
                        Dashboard
                    </h1>

                    <p
                        style={
                            styles.titleSub
                        }
                    >
                        Selamat datang kembali,
                        Admin Handu Atelier
                    </p>

                </div>


                {/* =================================================
                    RIGHT
                ================================================= */}

                <div
                    style={
                        styles.right
                    }
                >

                    {/* =============================================
                        TANGGAL
                    ============================================= */}

                    <div
                        style={
                            styles.dateBox
                        }
                    >

                        <span
                            style={
                                styles.dateIcon
                            }
                        >

                            <Icon
                                name="calendar"
                                size={20}
                            />

                        </span>


                        <div
                            style={
                                styles.dateContent
                            }
                        >

                            <strong
                                style={
                                    styles.dateText
                                }
                            >
                                {
                                    formatDate(
                                        currentTime
                                    )
                                }
                            </strong>


                            <span
                                style={
                                    styles.timeText
                                }
                            >
                                {
                                    formatTime(
                                        currentTime
                                    )
                                }
                            </span>

                        </div>

                    </div>


                    {/* =============================================
                        NOTIFIKASI
                    ============================================= */}

                    <button
                        type="button"
                        title="Buka Notifikasi"
                        aria-label="Buka Notifikasi"
                        style={
                            styles.notificationButton
                        }
                        onClick={
                            handleNotificationClick
                        }
                    >

                        <Icon
                            name="bell"
                            size={19}
                        />


                        {/* =========================================
                            HANYA TAMPIL JIKA ADA NOTIFIKASI
                        ========================================= */}

                        {unreadCount > 0 && (

                            <span
                                style={
                                    styles.badge
                                }
                            >

                                {
                                    unreadCount > 99
                                        ? "99+"
                                        : unreadCount
                                }

                            </span>

                        )}

                    </button>


                    {/* =============================================
                        BERANDA
                    ============================================= */}

                    <button
                        type="button"
                        title="Buka Halaman Utama"
                        aria-label="Buka Halaman Utama"
                        style={
                            styles.homeButton
                        }
                        onClick={
                            handleHomeClick
                        }
                    >
                        ⌂
                    </button>


                    {/* =============================================
                        LOGOUT
                    ============================================= */}

                    <button
                        type="button"
                        title="Logout"
                        aria-label="Logout"
                        style={
                            styles.logoutButton
                        }
                        onClick={
                            handleLogoutClick
                        }
                    >
                        ⇥
                    </button>


                    {/* =============================================
                        PROFILE
                    ============================================= */}

                    <div
                        style={
                            styles.profile
                        }
                    >

                        <div
                            style={
                                styles.avatar
                            }
                        >
                            {
                                adminInitial
                            }
                        </div>


                        <div
                            style={
                                styles.profileInfo
                            }
                        >

                            <strong
                                style={
                                    styles.profileName
                                }
                            >
                                {
                                    adminName
                                }
                            </strong>

                            <span
                                style={
                                    styles.profileRole
                                }
                            >
                                {
                                    adminRole
                                }
                            </span>

                        </div>

                    </div>

                </div>

            </header>


            {/* =====================================================
                LOGOUT MODAL
            ===================================================== */}

            {showLogoutModal && (

                <div
                    style={
                        styles.modalOverlay
                    }
                    onClick={
                        cancelLogout
                    }
                >

                    <div
                        style={
                            styles.modal
                        }
                        onClick={
                            (event) =>
                                event.stopPropagation()
                        }
                    >

                        <div
                            style={
                                styles.modalBody
                            }
                        >

                            <h3
                                style={
                                    styles.modalTitle
                                }
                            >
                                Keluar dari Admin?
                            </h3>


                            <p
                                style={
                                    styles.modalText
                                }
                            >
                                Apakah kamu yakin ingin
                                keluar dari akun{" "}

                                <span
                                    style={
                                        styles.modalName
                                    }
                                >
                                    {
                                        adminName
                                    }
                                </span>

                                ?
                            </p>


                            <div
                                style={
                                    styles.modalActions
                                }
                            >

                                <button
                                    type="button"
                                    style={
                                        styles.cancelButton
                                    }
                                    onClick={
                                        cancelLogout
                                    }
                                >
                                    Batal
                                </button>


                                <button
                                    type="button"
                                    style={
                                        styles.confirmButton
                                    }
                                    onClick={
                                        executeLogout
                                    }
                                >
                                    Ya, Logout
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </>

    );

};


export default Header;