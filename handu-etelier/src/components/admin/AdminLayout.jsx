import React, {
    useState,
    useEffect
} from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";

const AdminLayout = ({
    children,
    activePage,
    onNavigate
}) => {

    const [
        sidebarOpen,
        setSidebarOpen
    ] = useState(false);

    // =====================================================
    // NAVIGASI
    // =====================================================

    const handleNavigate = (page) => {

        console.log(
            "ADMIN NAVIGATE:",
            page
        );

        if (
            typeof onNavigate ===
            "function"
        ) {
            onNavigate(page);
        }

        setSidebarOpen(false);
    };

    // =====================================================
    // RESPONSIVE
    // =====================================================

    useEffect(() => {

        const handleResize = () => {

            // Desktop
            if (
                window.innerWidth > 900
            ) {
                setSidebarOpen(false);
            }

        };

        window.addEventListener(
            "resize",
            handleResize
        );

        return () => {

            window.removeEventListener(
                "resize",
                handleResize
            );

        };

    }, []);

    // =====================================================
    // ESC UNTUK MENUTUP SIDEBAR
    // =====================================================

    useEffect(() => {

        const handleKeyDown = (
            event
        ) => {

            if (
                event.key === "Escape"
            ) {

                setSidebarOpen(
                    false
                );

            }

        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );

        };

    }, []);

    // =====================================================
    // STYLE
    // =====================================================

    const styles = {

        // =================================================
        // WRAPPER
        // =================================================

        wrapper: {
            position: "relative",

            width: "100%",

            minHeight:
                "100vh",

            display: "flex",

            background:
                "#090908",

            color:
                "#ffffff",

            overflowX:
                "hidden"
        },

        // =================================================
        // SIDEBAR
        // =================================================

        sidebarContainer: {
            position:
                "fixed",

            top: 0,

            left: 0,

            width:
                "250px",

            height:
                "100vh",

            zIndex:
                12000,

            pointerEvents:
                "auto"
        },

        // =================================================
        // OVERLAY
        // =================================================

        overlay: {
            position:
                "fixed",

            inset: 0,

            background:
                "rgba(0,0,0,0.65)",

            zIndex:
                10000,

            display:
                sidebarOpen
                    ? "block"
                    : "none",

            pointerEvents:
                sidebarOpen
                    ? "auto"
                    : "none"
        },

        // =================================================
        // MAIN
        // =================================================

        main: {
            position:
                "relative",

            width:
                "calc(100% - 250px)",

            minHeight:
                "100vh",

            marginLeft:
                "250px",

            background:
                "#0b0b0a",

            boxSizing:
                "border-box",

            zIndex:
                1,

            pointerEvents:
                "auto"
        },

        // =================================================
        // CONTENT
        // =================================================

        content: {
            position:
                "relative",

            width:
                "100%",

            minHeight:
                "calc(100vh - 76px)",

            padding:
                "24px",

            boxSizing:
                "border-box",

            zIndex:
                1,

            pointerEvents:
                "auto"
        }
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <>
            {/* =================================================
                RESPONSIVE CSS
            ================================================= */}

            <style>
                {`

                    @media (max-width: 900px) {

                        .admin-layout-sidebar {
                            transform:
                                translateX(-100%);

                            transition:
                                transform 0.25s ease;

                            visibility:
                                hidden;
                        }

                        .admin-layout-sidebar.open {
                            transform:
                                translateX(0);

                            visibility:
                                visible;
                        }

                        .admin-layout-main {
                            width:
                                100% !important;

                            margin-left:
                                0 !important;
                        }

                        .admin-layout-content {
                            padding:
                                18px !important;
                        }

                    }

                    @media (max-width: 600px) {

                        .admin-layout-content {
                            padding:
                                14px !important;
                        }

                    }

                `}
            </style>

            {/* =================================================
                WRAPPER
            ================================================= */}

            <div
                style={
                    styles.wrapper
                }
            >

                {/* =================================================
                    MOBILE OVERLAY
                ================================================= */}

                <div
                    aria-hidden={
                        !sidebarOpen
                    }

                    style={
                        styles.overlay
                    }

                    onClick={() => {

                        setSidebarOpen(
                            false
                        );

                    }}
                />

                {/* =================================================
                    SIDEBAR
                ================================================= */}

                <div
                    className={`
                        admin-layout-sidebar
                        ${
                            sidebarOpen
                                ? "open"
                                : ""
                        }
                    `}

                    style={
                        styles.sidebarContainer
                    }
                >

                    <Sidebar
                        activePage={
                            activePage
                        }

                        onNavigate={
                            handleNavigate
                        }
                    />

                </div>

                {/* =================================================
                    MAIN
                ================================================= */}

                <main
                    className="
                        admin-layout-main
                    "

                    style={
                        styles.main
                    }
                >

                    {/* =============================================
                        HEADER
                    ============================================= */}

                    <div
                        style={{
                            position:
                                "relative",

                            zIndex:
                                11000
                        }}
                    >

                        <Header
                            onMenuClick={() => {

                                console.log(
                                    "MENU ADMIN DIKLIK"
                                );

                                setSidebarOpen(
                                    (previous) =>
                                        !previous
                                );

                            }}

                            onNavigate={
                                handleNavigate
                            }
                        />

                    </div>

                    {/* =============================================
                        CONTENT
                    ============================================= */}

                    <section
                        className="
                            admin-layout-content
                        "

                        style={
                            styles.content
                        }
                    >

                        {children}

                    </section>

                </main>

            </div>
        </>
    );
};

export default AdminLayout;