import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import api from "../../lib/api";

const RegistrasiPage = () => {
    // =====================================================
    // STATE
    // =====================================================

    const [registrasi, setRegistrasi] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [filterStatus, setFilterStatus] =
        useState("Semua");

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

        toolbarLeft: {
            display: "flex",
            alignItems: "center",
            gap: "9px",
            flex: 1,
            flexWrap: "wrap"
        },

        searchBox: {
            width: "300px",
            maxWidth: "100%",
            height: "40px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "0 12px",
            boxSizing: "border-box",
            border:
                "1px solid #38301f",
            borderRadius: "8px",
            background: "#181714"
        },

        searchIcon: {
            color: "#d4af37",
            fontSize: "15px"
        },

        searchInput: {
            width: "100%",
            height: "100%",
            border: "none",
            outline: "none",
            background: "transparent",
            color: "#ffffff",
            fontSize: "11px"
        },

        filter: {
            height: "40px",
            minWidth: "145px",
            padding: "0 10px",
            border:
                "1px solid #38301f",
            borderRadius: "8px",
            outline: "none",
            background: "#181714",
            color: "#cccccc",
            fontSize: "11px"
        },

        total: {
            display: "flex",
            alignItems: "center",
            gap: "7px",
            color: "#777777",
            fontSize: "10px",
            whiteSpace: "nowrap"
        },

        totalNumber: {
            minWidth: "27px",
            height: "25px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 7px",
            borderRadius: "20px",
            background:
                "rgba(212,175,55,0.09)",
            border:
                "1px solid rgba(212,175,55,0.21)",
            color: "#d4af37",
            fontSize: "10px",
            fontWeight: 700
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
            fontSize: "11px",
            lineHeight: 1.5
        },

        tableWrapper: {
            width: "100%",
            overflowX: "auto"
        },

        table: {
            width: "100%",
            minWidth: "950px",
            borderCollapse: "collapse"
        },

        th: {
            padding: "14px 15px",
            background: "#151411",
            borderBottom:
                "1px solid #312a1c",
            color: "#c8a84e",
            fontSize: "10px",
            fontWeight: 700,
            textAlign: "left",
            whiteSpace: "nowrap"
        },

        td: {
            padding: "14px 15px",
            borderBottom:
                "1px solid rgba(255,255,255,0.045)",
            color: "#d4d4d4",
            fontSize: "11px",
            verticalAlign: "middle"
        },

        number: {
            color: "#777777",
            fontWeight: 600
        },

        registrationId: {
            display: "inline-flex",
            alignItems: "center",
            padding: "5px 8px",
            borderRadius: "6px",
            background:
                "rgba(212,175,55,0.08)",
            border:
                "1px solid rgba(212,175,55,0.18)",
            color: "#d4af37",
            fontSize: "9px",
            fontWeight: 700,
            whiteSpace: "nowrap"
        },

        customerInfo: {
            display: "flex",
            alignItems: "center",
            gap: "10px"
        },

        customerAvatar: {
            width: "37px",
            height: "37px",
            minWidth: "37px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            background:
                "rgba(212,175,55,0.09)",
            border:
                "1px solid rgba(212,175,55,0.20)",
            color: "#d4af37",
            fontSize: "12px",
            fontWeight: 700
        },

        customerName: {
            display: "block",
            color: "#ffffff",
            fontSize: "11px",
            fontWeight: 600
        },

        customerRole: {
            display: "block",
            marginTop: "3px",
            color: "#686868",
            fontSize: "9px"
        },

        adminName: {
            display: "flex",
            alignItems: "center",
            gap: "7px",
            color: "#bdbdbd",
            whiteSpace: "nowrap"
        },

        adminDot: {
            width: "6px",
            height: "6px",
            minWidth: "6px",
            borderRadius: "50%",
            background: "#d4af37"
        },

        dateInfo: {
            display: "flex",
            flexDirection: "column",
            gap: "3px"
        },

        dateMain: {
            color: "#cfcfcf",
            fontSize: "10px",
            whiteSpace: "nowrap"
        },

        dateTime: {
            color: "#666666",
            fontSize: "9px",
            whiteSpace: "nowrap"
        },

        status: {
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 9px",
            borderRadius: "20px",
            fontSize: "9px",
            fontWeight: 600,
            whiteSpace: "nowrap"
        },

        statusDot: {
            width: "6px",
            height: "6px",
            minWidth: "6px",
            borderRadius: "50%",
            background: "currentColor"
        },

        loading: {
            minHeight: "280px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#777777",
            fontSize: "12px"
        },

        empty: {
            minHeight: "260px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "25px"
        },

        emptyIcon: {
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
            maxWidth: "370px",
            margin: "6px 0 0",
            color: "#666666",
            fontSize: "10px",
            lineHeight: 1.5
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
            fontSize: "10px",
            fontWeight: 600,
            cursor: "pointer"
        }
    };

    // =====================================================
    // LOAD DATA
    // =====================================================

    const loadRegistrasi = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await api.get(
                    "/registrasi"
                );

            console.log(
                "DATA REGISTRASI:",
                response
            );

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
                Array.isArray(result.registrasi)
            ) {
                result =
                    result.registrasi;
            }

            if (
                result?.data &&
                Array.isArray(
                    result.data.registrasi
                )
            ) {
                result =
                    result.data.registrasi;
            }

            if (!Array.isArray(result)) {
                throw new Error(
                    response?.message ||
                    "Format data registrasi tidak sesuai."
                );
            }

            setRegistrasi(result);

        } catch (err) {
            console.error(
                "ERROR REGISTRASI:",
                err
            );

            setRegistrasi([]);

            setError(
                err?.message ||
                "Gagal mengambil data registrasi."
            );

        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // LOAD AWAL
    // =====================================================

    useEffect(() => {
        loadRegistrasi();
    }, []);

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
            new Date(tanggal);

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
                month: "short",
                year: "numeric"
            }
        );
    };

    // =====================================================
    // FORMAT WAKTU
    // =====================================================

    const formatWaktu = (
        tanggal
    ) => {
        if (!tanggal) {
            return "-";
        }

        const date =
            new Date(tanggal);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "-";
        }

        return date.toLocaleTimeString(
            "id-ID",
            {
                hour: "2-digit",
                minute: "2-digit"
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

        if (
            value ===
                "disetujui" ||
            value ===
                "approved"
        ) {
            return {
                background:
                    "rgba(76,175,80,0.10)",
                border:
                    "1px solid rgba(76,175,80,0.22)",
                color:
                    "#79d27d"
            };
        }

        if (
            value ===
                "ditolak" ||
            value ===
                "rejected"
        ) {
            return {
                background:
                    "rgba(220,70,70,0.10)",
                border:
                    "1px solid rgba(220,70,70,0.22)",
                color:
                    "#ff7d7d"
            };
        }

        return {
            background:
                "rgba(212,175,55,0.10)",
            border:
                "1px solid rgba(212,175,55,0.22)",
            color:
                "#d4af37"
        };
    };

    // =====================================================
    // FILTER
    // =====================================================

    const filteredRegistrasi =
        useMemo(() => {

            const keyword =
                search
                    .trim()
                    .toLowerCase();

            return registrasi.filter(
                (item) => {

                    const status =
                        String(
                            item.status ||
                            ""
                        );

                    const statusMatch =
                        filterStatus ===
                            "Semua" ||
                        status ===
                            filterStatus;

                    if (!statusMatch) {
                        return false;
                    }

                    if (!keyword) {
                        return true;
                    }

                    return (
                        String(
                            item.id_registrasi ||
                            ""
                        )
                            .toLowerCase()
                            .includes(keyword) ||

                        String(
                            item.nama ||
                            ""
                        )
                            .toLowerCase()
                            .includes(keyword) ||

                        String(
                            item.admin ||
                            ""
                        )
                            .toLowerCase()
                            .includes(keyword)
                    );
                }
            );

        }, [
            registrasi,
            search,
            filterStatus
        ]);

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div style={styles.page}>

            {/* =========================================
                HEADER
            ========================================= */}

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
                    Registrasi
                </h2>

                <p
                    style={
                        styles.subtitle
                    }
                >
                    Kelola data registrasi
                    pelanggan.
                </p>

            </div>

            {/* =========================================
                CARD
            ========================================= */}

            <div
                style={
                    styles.card
                }
            >

                {/* =====================================
                    TOOLBAR
                ===================================== */}

                <div
                    style={
                        styles.toolbar
                    }
                >

                    <div
                        style={
                            styles.toolbarLeft
                        }
                    >

                        <div
                            style={
                                styles.searchBox
                            }
                        >

                            <span
                                style={
                                    styles.searchIcon
                                }
                            >
                                ⌕
                            </span>

                            <input
                                type="text"
                                value={
                                    search
                                }
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Cari ID, pelanggan, atau admin..."
                                style={
                                    styles.searchInput
                                }
                            />

                        </div>

                        <select
                            value={
                                filterStatus
                            }
                            onChange={(event) =>
                                setFilterStatus(
                                    event.target.value
                                )
                            }
                            style={
                                styles.filter
                            }
                        >

                            <option value="Semua">
                                Semua Status
                            </option>

                            <option value="Menunggu">
                                Menunggu
                            </option>

                            <option value="Disetujui">
                                Disetujui
                            </option>

                            <option value="Ditolak">
                                Ditolak
                            </option>

                        </select>

                    </div>

                    <div
                        style={
                            styles.total
                        }
                    >

                        <span>
                            Total
                        </span>

                        <strong
                            style={
                                styles.totalNumber
                            }
                        >
                            {
                                filteredRegistrasi.length
                            }
                        </strong>

                    </div>

                </div>

                {/* =====================================
                    ERROR
                ===================================== */}

                {error && (
                    <div
                        style={
                            styles.error
                        }
                    >
                        {error}
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
                        Memuat data registrasi...
                    </div>

                ) : filteredRegistrasi.length === 0 ? (

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
                            ◇
                        </div>

                        <h3
                            style={
                                styles.emptyTitle
                            }
                        >
                            {search ||
                            filterStatus !==
                                "Semua"
                                ? "Data registrasi tidak ditemukan"
                                : "Belum ada data registrasi"}
                        </h3>

                        <p
                            style={
                                styles.emptyText
                            }
                        >
                            {search ||
                            filterStatus !==
                                "Semua"
                                ? "Tidak ada data yang sesuai dengan pencarian atau filter."
                                : "Belum terdapat pelanggan yang melakukan registrasi."}
                        </p>

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
                                        ID Registrasi
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
                                        Admin
                                    </th>

                                    <th
                                        style={
                                            styles.th
                                        }
                                    >
                                        Tanggal Registrasi
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

                                {filteredRegistrasi.map(
                                    (
                                        item,
                                        index
                                    ) => {

                                        const nama =
                                            item.nama ||
                                            "Pelanggan";

                                        const status =
                                            item.status ||
                                            "Menunggu";

                                        return (
                                            <tr
                                                key={
                                                    item.id_registrasi ||
                                                    index
                                                }
                                            >

                                                {/* NO */}

                                                <td
                                                    style={
                                                        styles.td
                                                    }
                                                >
                                                    <span
                                                        style={
                                                            styles.number
                                                        }
                                                    >
                                                        {String(
                                                            index +
                                                            1
                                                        ).padStart(
                                                            2,
                                                            "0"
                                                        )}
                                                    </span>
                                                </td>

                                                {/* ID */}

                                                <td
                                                    style={
                                                        styles.td
                                                    }
                                                >

                                                    <span
                                                        style={
                                                            styles.registrationId
                                                        }
                                                    >
                                                        REG-
                                                        {String(
                                                            item.id_registrasi ||
                                                            0
                                                        ).padStart(
                                                            4,
                                                            "0"
                                                        )}
                                                    </span>

                                                </td>

                                                {/* PELANGGAN */}

                                                <td
                                                    style={
                                                        styles.td
                                                    }
                                                >

                                                    <div
                                                        style={
                                                            styles.customerInfo
                                                        }
                                                    >

                                                        <div
                                                            style={
                                                                styles.customerAvatar
                                                            }
                                                        >
                                                            {nama
                                                                .charAt(
                                                                    0
                                                                )
                                                                .toUpperCase()}
                                                        </div>

                                                        <div>

                                                            <span
                                                                style={
                                                                    styles.customerName
                                                                }
                                                            >
                                                                {nama}
                                                            </span>

                                                            <span
                                                                style={
                                                                    styles.customerRole
                                                                }
                                                            >
                                                                Pelanggan
                                                            </span>

                                                        </div>

                                                    </div>

                                                </td>

                                                {/* ADMIN */}

                                                <td
                                                    style={
                                                        styles.td
                                                    }
                                                >

                                                    <div
                                                        style={
                                                            styles.adminName
                                                        }
                                                    >

                                                        <span
                                                            style={
                                                                styles.adminDot
                                                            }
                                                        />

                                                        {
                                                            item.admin ||
                                                            "-"
                                                        }

                                                    </div>

                                                </td>

                                                {/* TANGGAL */}

                                                <td
                                                    style={
                                                        styles.td
                                                    }
                                                >

                                                    <div
                                                        style={
                                                            styles.dateInfo
                                                        }
                                                    >

                                                        <strong
                                                            style={
                                                                styles.dateMain
                                                            }
                                                        >
                                                            {formatTanggal(
                                                                item.tanggal_registrasi
                                                            )}
                                                        </strong>

                                                        <span
                                                            style={
                                                                styles.dateTime
                                                            }
                                                        >
                                                            {formatWaktu(
                                                                item.tanggal_registrasi
                                                            )}
                                                        </span>

                                                    </div>

                                                </td>

                                                {/* STATUS */}

                                                <td
                                                    style={
                                                        styles.td
                                                    }
                                                >

                                                    <span
                                                        style={{
                                                            ...styles.status,
                                                            ...getStatusStyle(
                                                                status
                                                            )
                                                        }}
                                                    >

                                                        <span
                                                            style={
                                                                styles.statusDot
                                                            }
                                                        />

                                                        {status}

                                                    </span>

                                                </td>

                                            </tr>
                                        );
                                    }
                                )}

                            </tbody>

                        </table>

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
                            loadRegistrasi
                        }
                    >
                        ↻ Perbarui Data
                    </button>

                </div>

            </div>

        </div>
    );
};

export default RegistrasiPage;