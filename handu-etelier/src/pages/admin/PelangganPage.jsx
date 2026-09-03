import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import api from "../../lib/api";
import PelangganList
    from "../../components/admin/PelangganList";

const PelangganPage = () => {

    const [data, setData] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const styles = {
        page: {
            width: "100%",
            color: "#ffffff"
        },

        header: {
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

        search: {
            width: "320px",
            maxWidth: "100%",
            height: "40px",
            padding: "0 12px",
            boxSizing: "border-box",
            border: "1px solid #38301f",
            borderRadius: "8px",
            background: "#181714",
            color: "#ffffff",
            outline: "none",
            fontSize: "10px"
        },

        count: {
            color: "#777777",
            fontSize: "10px"
        },

        error: {
            margin: "14px 20px 0",
            padding: "11px 13px",
            border:
                "1px solid rgba(220,70,70,0.22)",
            borderRadius: "8px",
            background:
                "rgba(220,70,70,0.09)",
            color: "#ff8585",
            fontSize: "10px"
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
            alignItems: "center",
            justifyContent: "center",
            color: "#666666",
            fontSize: "10px"
        },

        refresh: {
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

        footer: {
            display: "flex",
            justifyContent: "flex-end",
            padding: "13px 20px",
            borderTop:
                "1px solid rgba(212,175,55,0.08)"
        }
    };

    const normalizeData = (
        response
    ) => {

        let result =
            response;

        if (
            result?.data !== undefined
        ) {
            result =
                result.data;
        }

        if (
            result?.data !== undefined
        ) {
            result =
                result.data;
        }

        if (
            Array.isArray(result)
        ) {
            return result;
        }

        if (
            Array.isArray(
                result?.users
            )
        ) {
            return result.users;
        }

        if (
            Array.isArray(
                result?.data
            )
        ) {
            return result.data;
        }

        return [];
    };

    const loadData =
        async () => {

            try {
                setLoading(true);
                setError("");

                const response =
                    await api.get(
                        "/users/role/3"
                    );

                setData(
                    normalizeData(
                        response
                    )
                );

            } catch (err) {

                console.error(
                    "Gagal mengambil pelanggan:",
                    err
                );

                setData([]);

                setError(
                    err?.message ||
                    "Gagal mengambil data pelanggan."
                );

            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        loadData();
    }, []);

    const filtered =
        useMemo(() => {

            const keyword =
                search
                    .trim()
                    .toLowerCase();

            if (!keyword) {
                return data;
            }

            return data.filter(
                (item) =>
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
                        item.no_hp ||
                        ""
                    )
                        .toLowerCase()
                        .includes(
                            keyword
                        )
            );

        }, [
            data,
            search
        ]);

    return (
        <div style={styles.page}>

            <div
                style={
                    styles.header
                }
            >

                <span
                    style={
                        styles.kicker
                    }
                >
                    DATA
                </span>

                <h1
                    style={
                        styles.title
                    }
                >
                    Pelanggan
                </h1>

                <p
                    style={
                        styles.subtitle
                    }
                >
                    Data seluruh pelanggan
                    Handu Atelier.
                </p>

            </div>

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

                    <input
                        type="text"
                        placeholder="Cari pelanggan..."
                        value={
                            search
                        }
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        style={
                            styles.search
                        }
                    />

                    <span
                        style={
                            styles.count
                        }
                    >
                        {filtered.length} Pelanggan
                    </span>

                </div>

                {error && (
                    <div
                        style={
                            styles.error
                        }
                    >
                        {error}
                    </div>
                )}

                {loading ? (

                    <div
                        style={
                            styles.loading
                        }
                    >
                        Memuat data pelanggan...
                    </div>

                ) : filtered.length === 0 ? (

                    <div
                        style={
                            styles.empty
                        }
                    >
                        {search
                            ? "Pelanggan tidak ditemukan."
                            : "Belum ada data pelanggan."}
                    </div>

                ) : (

                    <PelangganList
                        data={filtered}
                    />

                )}

                <div
                    style={
                        styles.footer
                    }
                >

                    <button
                        type="button"
                        style={{
                            ...styles.refresh,
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
                            loadData
                        }
                    >
                        ↻ Perbarui Data
                    </button>

                </div>

            </div>

        </div>
    );
};

export default PelangganPage;