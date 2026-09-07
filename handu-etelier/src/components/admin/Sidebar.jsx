import React from "react";
import Icon from "./Icon";

const Sidebar = ({
    activePage,
    onNavigate
}) => {

    // ========================================
    // MENU UTAMA
    // ========================================

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
        {
            id: "koleksi",
            label: "Koleksi",
            icon: "category"
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


    // ========================================
    // NAVIGASI
    // ========================================

    const handleNavigate = (page) => {
        onNavigate(page);
    };


    return (
        <aside className="sidebar">

            {/* ==================================
                BRAND
            ================================== */}

            <div className="brand">

                <div className="brand-crown">
                    ♛
                </div>

                <div className="brand-name">
                    Handu Atelier
                </div>

                <div className="brand-tagline">
                    ELEGANCE FOR EVERY MOMENT
                </div>

            </div>


            {/* ==================================
                MENU UTAMA
            ================================== */}

            <div className="sidebar-section-title">
                MENU UTAMA
            </div>

            <nav className="sidebar-menu">

                {menuUtama.map((item) => (

                    <button
                        key={item.id}
                        type="button"
                        className={`sidebar-item ${
                            activePage === item.id
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            handleNavigate(item.id)
                        }
                    >

                        <Icon
                            name={item.icon}
                            size={19}
                        />

                        <span>
                            {item.label}
                        </span>


                        {/* Arrow */}

                        {[
                            "petugas",
                            "pelanggan",
                            "kostum",
                            "koleksi",
                            "kategori"
                        ].includes(item.id) && (

                            <span className="sidebar-arrow">
                                ›
                            </span>

                        )}

                    </button>

                ))}

            </nav>


            {/* ==================================
                PENGATURAN
            ================================== */}

            <div className="sidebar-section-title report-title">
                PENGATURAN
            </div>


            <nav className="sidebar-menu">

                {/* PROFIL */}

                <button
                    type="button"
                    className={`sidebar-item ${
                        activePage === "profil"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        handleNavigate("profil")
                    }
                >

                    <Icon
                        name="user"
                        size={19}
                    />

                    <span>
                        Profil
                    </span>

                </button>


                {/* PENGATURAN */}

                <button
                    type="button"
                    className={`sidebar-item ${
                        activePage === "pengaturan"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        handleNavigate("pengaturan")
                    }
                >

                    <Icon
                        name="settings"
                        size={19}
                    />

                    <span>
                        Pengaturan
                    </span>

                </button>

            </nav>


            {/* ==================================
                BOTTOM CARD
            ================================== */}

            <div className="sidebar-bottom-card">

                <div className="sidebar-bottom-logo">
                    ♛
                </div>

                <strong>
                    Handu Atelier
                </strong>

                <small>
                    Elegance for Every Moment
                </small>

            </div>

        </aside>
    );
};

export default Sidebar;