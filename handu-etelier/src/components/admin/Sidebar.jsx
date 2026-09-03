import React from "react";

import Icon from "./Icon";

const Sidebar = ({
    activePage,
    onNavigate
}) => {

    // =====================================================
    // MENU UTAMA
    // =====================================================

    const menuUtama = [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: "dashboard"
        },
        {
            id: "petugas",
            label: "Petugas",
            icon: "user"
        },
        {
            id: "pelanggan",
            label: "Pelanggan",
            icon: "users"
        },
        {
            id: "kostum",
            label: "Kostum",
            icon: "costume"
        },

        // =================================================
        // KOLEKSI
        // =================================================

        {
            id: "koleksi",
            label: "Koleksi",
            icon: "collection"
        },

        {
            id: "kategori",
            label: "Kategori",
            icon: "category"
        },
        {
            id: "registrasi",
            label: "Registrasi",
            icon: "clipboard"
        },
        {
            id: "peminjaman",
            label: "Peminjaman",
            icon: "calendar"
        },
        {
            id: "notifications",
            label: "Notifikasi",
            icon: "bell"
        }
    ];

    // =====================================================
    // LAPORAN
    // =====================================================

    const menuLaporan = [
        {
            id: "laporan-peminjaman",
            target: "peminjaman",
            label: "Laporan Peminjaman",
            icon: "chart"
        },
        {
            id: "laporan-pengembalian",
            target: "peminjaman",
            label: "Laporan Pengembalian",
            icon: "calendar"
        }
    ];

    // =====================================================
    // PENGATURAN
    // =====================================================

    const menuPengaturan = [
        {
            id: "pengaturan",
            target: "pengaturan",
            label: "Pengaturan",
            icon: "settings"
        }
    ];

    // =====================================================
    // NAVIGASI
    // =====================================================

    const handleNavigate = (
        page,
        event
    ) => {

        event?.preventDefault();
        event?.stopPropagation();

        console.log(
            "SIDEBAR: navigasi ke:",
            page
        );

        if (
            typeof onNavigate ===
            "function"
        ) {
            onNavigate(page);
        }
    };

    // =====================================================
    // STYLE
    // =====================================================

    const styles = {

        // =================================================
        // SIDEBAR
        // =================================================

        sidebar: {
            width:
                "250px",

            minWidth:
                "250px",

            height:
                "100vh",

            position:
                "relative",

            top:
                0,

            left:
                0,

            display:
                "flex",

            flexDirection:
                "column",

            boxSizing:
                "border-box",

            padding:
                "22px 14px",

            overflowY:
                "auto",

            overflowX:
                "hidden",

            background:
                "#0f0e0c",

            borderRight:
                "1px solid rgba(212,175,55,0.12)",

            pointerEvents:
                "auto",

            zIndex:
                12000
        },

        // =================================================
        // BRAND
        // =================================================

        brand: {
            padding:
                "6px 12px 25px",

            textAlign:
                "center",

            borderBottom:
                "1px solid rgba(255,255,255,0.06)"
        },

        crown: {
            marginBottom:
                "8px",

            color:
                "#d4af37",

            fontSize:
                "29px",

            lineHeight:
                1
        },

        brandName: {
            color:
                "#ffffff",

            fontSize:
                "19px",

            fontWeight:
                700,

            letterSpacing:
                "0.02em"
        },

        tagline: {
            marginTop:
                "6px",

            color:
                "#686868",

            fontSize:
                "8px",

            letterSpacing:
                "0.16em"
        },

        // =================================================
        // SECTION TITLE
        // =================================================

        sectionTitle: {
            padding:
                "22px 11px 9px",

            color:
                "#626262",

            fontSize:
                "9px",

            fontWeight:
                700,

            letterSpacing:
                "0.16em"
        },

        // =================================================
        // MENU
        // =================================================

        menu: {
            display:
                "flex",

            flexDirection:
                "column",

            gap:
                "3px",

            width:
                "100%",

            pointerEvents:
                "auto"
        },

        // =================================================
        // MENU ITEM
        // =================================================

        item: {
            width:
                "100%",

            minHeight:
                "42px",

            display:
                "flex",

            alignItems:
                "center",

            gap:
                "11px",

            padding:
                "0 11px",

            boxSizing:
                "border-box",

            border:
                "1px solid transparent",

            borderRadius:
                "8px",

            background:
                "transparent",

            color:
                "#8d8d8d",

            cursor:
                "pointer",

            textAlign:
                "left",

            fontSize:
                "11px",

            fontWeight:
                500,

            transition:
                "all 0.18s ease",

            pointerEvents:
                "auto",

            position:
                "relative",

            zIndex:
                12001
        },

        // =================================================
        // ACTIVE ITEM
        // =================================================

        activeItem: {
            background:
                "rgba(212,175,55,0.09)",

            border:
                "1px solid rgba(212,175,55,0.18)",

            color:
                "#d4af37"
        },

        // =================================================
        // TEXT
        // =================================================

        itemText: {
            flex:
                1,

            minWidth:
                0,

            pointerEvents:
                "none"
        },

        // =================================================
        // ARROW
        // =================================================

        arrow: {
            color:
                "#555555",

            fontSize:
                "17px",

            lineHeight:
                1,

            pointerEvents:
                "none"
        },

        // =================================================
        // ICON
        // =================================================

        iconWrapper: {
            display:
                "flex",

            alignItems:
                "center",

            justifyContent:
                "center",

            flexShrink:
                0,

            pointerEvents:
                "none"
        },

        // =================================================
        // BOTTOM
        // =================================================

        bottom: {
            marginTop:
                "auto",

            padding:
                "18px 10px 5px",

            pointerEvents:
                "none"
        },

        bottomCard: {
            padding:
                "16px 10px",

            textAlign:
                "center",

            background:
                "rgba(212,175,55,0.035)",

            border:
                "1px solid rgba(212,175,55,0.12)",

            borderRadius:
                "10px"
        },

        bottomLogo: {
            marginBottom:
                "7px",

            color:
                "#d4af37",

            fontSize:
                "22px"
        },

        bottomTitle: {
            display:
                "block",

            color:
                "#bdbdbd",

            fontSize:
                "10px",

            fontWeight:
                600
        },

        bottomText: {
            display:
                "block",

            marginTop:
                "3px",

            color:
                "#555555",

            fontSize:
                "8px"
        }
    };

    // =====================================================
    // RENDER MENU
    // =====================================================

    const renderMenu = (
        items,
        addArrow = false
    ) => {

        return items.map(
            (item) => {

                const target =
                    item.target ||
                    item.id;

                const isActive =
                    activePage === item.id ||
                    activePage === target;

                return (
                    <button
                        key={
                            item.id
                        }

                        type="button"

                        style={{
                            ...styles.item,

                            ...(isActive
                                ? styles.activeItem
                                : {})
                        }}

                        onClick={(
                            event
                        ) =>
                            handleNavigate(
                                target,
                                event
                            )
                        }

                        onMouseDown={(
                            event
                        ) =>
                            event.stopPropagation()
                        }
                    >

                        {/* =================================
                            ICON
                        ================================= */}

                        <span
                            style={
                                styles.iconWrapper
                            }
                        >

                            <Icon
                                name={
                                    item.icon
                                }
                                size={
                                    19
                                }
                            />

                        </span>

                        {/* =================================
                            LABEL
                        ================================= */}

                        <span
                            style={
                                styles.itemText
                            }
                        >
                            {
                                item.label
                            }
                        </span>

                        {/* =================================
                            ARROW
                        ================================= */}

                        {addArrow && (
                            <span
                                style={
                                    styles.arrow
                                }
                            >
                                ›
                            </span>
                        )}

                    </button>
                );
            }
        );
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <aside
            style={
                styles.sidebar
            }
        >

            {/* =================================================
                BRAND
            ================================================= */}

            <div
                style={
                    styles.brand
                }
            >

                <div
                    style={
                        styles.crown
                    }
                >
                    ♛
                </div>

                <div
                    style={
                        styles.brandName
                    }
                >
                    Handu Atelier
                </div>

                <div
                    style={
                        styles.tagline
                    }
                >
                    ELEGANCE FOR EVERY MOMENT
                </div>

            </div>

            {/* =================================================
                MENU UTAMA
            ================================================= */}

            <div
                style={
                    styles.sectionTitle
                }
            >
                MENU UTAMA
            </div>

            <nav
                style={
                    styles.menu
                }
            >
                {renderMenu(
                    menuUtama,
                    false
                )}
            </nav>

            {/* =================================================
                LAPORAN
            ================================================= */}

            <div
                style={
                    styles.sectionTitle
                }
            >
                LAPORAN
            </div>

            <nav
                style={
                    styles.menu
                }
            >
                {renderMenu(
                    menuLaporan,
                    false
                )}
            </nav>

            {/* =================================================
                PENGATURAN
            ================================================= */}

            <div
                style={
                    styles.sectionTitle
                }
            >
                PENGATURAN
            </div>

            <nav
                style={
                    styles.menu
                }
            >
                {renderMenu(
                    menuPengaturan,
                    false
                )}
            </nav>

            {/* =================================================
                BOTTOM CARD
            ================================================= */}

            <div
                style={
                    styles.bottom
                }
            >

                <div
                    style={
                        styles.bottomCard
                    }
                >

                    <div
                        style={
                            styles.bottomLogo
                        }
                    >
                        ♛
                    </div>

                    <strong
                        style={
                            styles.bottomTitle
                        }
                    >
                        Handu Atelier
                    </strong>

                    <small
                        style={
                            styles.bottomText
                        }
                    >
                        Elegance for Every Moment
                    </small>

                </div>

            </div>

        </aside>
    );
};

export default Sidebar;