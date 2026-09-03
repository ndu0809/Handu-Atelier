import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import api from "../../lib/api";

const PeminjamanPage = () => {

    const [peminjaman, setPeminjaman] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

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
            margin:
                "7px 0 0",
            color: "#7e7e7e",
            fontSize: "13px"
        },

        card: {
            background: "#11100e",
            border:
                "1px solid #342d1e",
            borderRadius: "14px",
            overflow: "hidden"
        },

        toolbar: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "14px",
            padding:
                "17px 20px",
            borderBottom:
                "1px solid rgba(255,255,255,0.06)",
            flexWrap: "wrap"
        },

        search: {
            width: "320px",
            maxWidth: "100%",
            height: "40px",
            padding:
                "0 12px",
            boxSizing: "border-box",
            border:
                "1px solid #38301f",
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
            margin:
                "14px 20px 0",
            padding:
                "11px 13px",
            border:
                "1px solid rgba(220,70,70,0.22)",
            borderRadius: "8px",
            background:
                "rgba(220,70,70,0.09)",
            color: "#ff8585",
            fontSize: "10px",
            lineHeight: 1.5
        },

        tableWrapper: {
            width: "100%",
            overflowX: "auto"
        },

        table: {
            width: "100%",
            minWidth: "1000px",
            borderCollapse: "collapse"
        },

        th: {
            padding:
                "13px 14px",
            background: "#151411",
            borderBottom:
                "1px solid #312a1c",
            color: "#c8a84e",
            fontSize: "9px",
            textAlign: "left",
            whiteSpace: "nowrap"
        },

        td: {
            padding:
                "13px 14px",
            borderBottom:
                "1px solid rgba(255,255,255,0.045)",
            color: "#d0d0d0",
            fontSize: "10px",
            verticalAlign: "middle"
        },

        userCell: {
            display: "flex",
            flexDirection: "column",
            gap: "3px"
        },

        userName: {
            color: "#eeeeee",
            fontSize: "10px",
            fontWeight: 600
        },

        phone: {
            color: "#676767",
            fontSize: "8px"
        },

        status: {
            display: "inline-flex",
            padding:
                "5px 8px",
            borderRadius: "20px",
            fontSize: "8px",
            fontWeight: 600,
            whiteSpace: "nowrap"
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

        footer: {
            display: "flex",
            justifyContent: "flex-end",
            padding:
                "13px 20px",
            borderTop:
                "1px solid rgba(212,175,55,0.08)"
        },

        refresh: {
            height: "38px",
            padding:
                "0 13px",
            border:
                "1px solid rgba(212,175,55,0.28)",
            borderRadius: "8px",
            background: "transparent",
            color: "#d4af37",
            fontSize: "10px",
            fontWeight: 600,
            cursor: "pointer"
        }
    };

    // =====================================================
    // NORMALISASI RESPONSE
    // =====================================================

    const normalizeData = (
        response
    ) => {

        let result =
            response;

        if (
            result?.data !==
            undefined
        ) {
            result =
                result.data;
        }

        if (
            result?.data !==
            undefined
        ) {
            result =
                result.data;
        }

        if (
            Array.isArray(
                result
            )
        ) {
            return result;
        }

        if (
            Array.isArray(
                result?.peminjaman
            )
        ) {
            return result.peminjaman;
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

    // =====================================================
    // LOAD DATA
    // =====================================================

    const loadPeminjaman =
        async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await api.get(
                        "/peminjaman"
                    );

                console.log(
                    "DATA PEMINJAMAN:",
                    response
                );

                const data =
                    normalizeData(
                        response
                    );

                setPeminjaman(
                    data
                );

            } catch (err) {

                console.error(
                    "ERROR LOAD PEMINJAMAN:",
                    err
                );

                setPeminjaman([]);

                setError(
                    err?.message ||
                    "Gagal mengambil data peminjaman"
                );

            } finally {

                setLoading(false);

            }
        };

    // =====================================================
    // LOAD AWAL
    // =====================================================

    useEffect(() => {
        loadPeminjaman();
    }, []);

    // =====================================================
    // FORMAT RUPIAH
    // =====================================================

    const formatRupiah = (
        angka
    ) => {

        if (
            angka === null ||
            angka === undefined
        ) {
            return "Rp 0";
        }

        return new Intl.NumberFormat(
            "id-ID",
            {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0
            }
        ).format(
            Number(angka) || 0
        );
    };

    // =====================================================
    // FORMAT TANGGAL
    // =====================================================

    const formatTanggal = (
        tanggal
    ) => {

        if (!tanggal) {
            return "-";
        }

        const date =
            new Date(
                tanggal
            );

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "-";
        }

        return date.toLocaleDateString(
            "id-ID",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );
    };

    // =====================================================
    // STATUS STYLE
    // =====================================================

    const getStatusStyle = (
        status
    ) => {

        const value =
            String(
                status || ""
            )
                .toLowerCase()
                .trim();

        switch (
            value
        ) {

            case "menunggu":
                return {
                    background:
                        "rgba(212,175,55,0.10)",
                    border:
                        "1px solid rgba(212,175,55,0.22)",
                    color:
                        "#d4af37"
                };

            case "disetujui":
            case "selesai":
                return {
                    background:
                        "rgba(76,175,80,0.10)",
                    border:
                        "1px solid rgba(76,175,80,0.22)",
                    color:
                        "#79d27d"
                };

            case "diproses":
            case "dipinjam":
                return {
                    background:
                        "rgba(80,130,190,0.10)",
                    border:
                        "1px solid rgba(80,130,190,0.22)",
                    color:
                        "#8bb1df"
                };

            case "ditolak":
            case "dibatalkan":
                return {
                    background:
                        "rgba(220,70,70,0.10)",
                    border:
                        "1px solid rgba(220,70,70,0.22)",
                    color:
                        "#ff7d7d"
                };

            default:
                return {
                    background:
                        "rgba(130,130,130,0.08)",
                    border:
                        "1px solid rgba(130,130,130,0.16)",
                    color:
                        "#858585"
                };
        }
    };

    // =====================================================
    // SEARCH
    // =====================================================

    const filtered =
        useMemo(() => {

            const keyword =
                search
                    .trim()
                    .toLowerCase();

            if (!keyword) {
                return peminjaman;
            }

            return peminjaman.filter(
                (item) =>

                    String(
                        item.nama_user ||
                        ""
                    )
                        .toLowerCase()
                        .includes(
                            keyword
                        ) ||

                    String(
                        item.nama_kostum ||
                        ""
                    )
                        .toLowerCase()
                        .includes(
                            keyword
                        ) ||

                    String(
                        item.status ||
                        ""
                    )
                        .toLowerCase()
                        .includes(
                            keyword
                        )
            );

        }, [
            peminjaman,
            search
        ]);

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div
            style={
                styles.page
            }
        >

            <div
                style={
                    styles.heading
                }
            >

                <span
                    style={
                        styles.kicker
                    }
                >
                    TRANSAKSI
                </span>

                <h2
                    style={
                        styles.title
                    }
                >
                    Peminjaman
                </h2>

                <p
                    style={
                        styles.subtitle
                    }
                >
                    Kelola data peminjaman
                    kostum.
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
                        placeholder="Cari pelanggan, kostum, atau status..."
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
                        {
                            filtered.length
                        }{" "}
                        transaksi
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
                        Memuat data peminjaman...
                    </div>

                ) : filtered.length === 0 ? (

                    <div
                        style={
                            styles.empty
                        }
                    >
                        {search
                            ? "Peminjaman tidak ditemukan."
                            : "Belum ada data peminjaman."}
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
                                        Pelanggan
                                    </th>

                                    <th
                                        style={
                                            styles.th
                                        }
                                    >
                                        Kostum
                                    </th>

                                    <th
                                        style={
                                            styles.th
                                        }
                                    >
                                        Pinjam
                                    </th>

                                    <th
                                        style={
                                            styles.th
                                        }
                                    >
                                        Kembali
                                    </th>

                                    <th
                                        style={
                                            styles.th
                                        }
                                    >
                                        Total
                                    </th>

                                    <th
                                        style={
                                            styles.th
                                        }
                                    >
                                        Status
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filtered.map(
                                    (
                                        item,
                                        index
                                    ) => (

                                        <tr
                                            key={
                                                item.id_peminjaman ??
                                                index
                                            }
                                        >

                                            <td
                                                style={
                                                    styles.td
                                                }
                                            >
                                                {index + 1}
                                            </td>

                                            <td
                                                style={
                                                    styles.td
                                                }
                                            >

                                                <div
                                                    style={
                                                        styles.userCell
                                                    }
                                                >

                                                    <strong
                                                        style={
                                                            styles.userName
                                                        }
                                                    >
                                                        {
                                                            item.nama_user ||
                                                            "-"
                                                        }
                                                    </strong>

                                                    <small
                                                        style={
                                                            styles.phone
                                                        }
                                                    >
                                                        {
                                                            item.no_hp_user ||
                                                            "-"
                                                        }
                                                    </small>

                                                </div>

                                            </td>

                                            <td
                                                style={
                                                    styles.td
                                                }
                                            >
                                                {
                                                    item.nama_kostum ||
                                                    "-"
                                                }
                                            </td>

                                            <td
                                                style={
                                                    styles.td
                                                }
                                            >
                                                {formatTanggal(
                                                    item.tanggal_peminjaman
                                                )}
                                            </td>

                                            <td
                                                style={
                                                    styles.td
                                                }
                                            >
                                                {formatTanggal(
                                                    item.tanggal_kembali
                                                )}
                                            </td>

                                            <td
                                                style={
                                                    styles.td
                                                }
                                            >
                                                {formatRupiah(
                                                    item.total_harga
                                                )}
                                            </td>

                                            <td
                                                style={
                                                    styles.td
                                                }
                                            >

                                                <span
                                                    style={{
                                                        ...styles.status,
                                                        ...getStatusStyle(
                                                            item.status
                                                        )
                                                    }}
                                                >
                                                    {
                                                        item.status ||
                                                        "Menunggu"
                                                    }
                                                </span>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

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
                            loadPeminjaman
                        }
                    >
                        ↻ Perbarui Data
                    </button>

                </div>

            </div>

        </div>
    );
};

export default PeminjamanPage;