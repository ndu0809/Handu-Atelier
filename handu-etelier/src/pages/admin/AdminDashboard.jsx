import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import api from "../../lib/api";
import Icon from "../../components/admin/Icon";

const AdminDashboard = () => {
    const navigate = useNavigate();

    // =====================================================
    // STATE
    // =====================================================

    const [loading, setLoading] = useState(true);

    const [kostum, setKostum] = useState([]);
    const [users, setUsers] = useState([]);
    const [peminjaman, setPeminjaman] = useState([]);

    const [periode, setPeriode] = useState("bulanIni");

    const [modal, setModal] = useState({
        open: false,
        type: "",
        data: null
    });

    const [loadError, setLoadError] = useState("");

    // =====================================================
    // MODAL
    // =====================================================

    const openModal = (
        type,
        data = null
    ) => {
        setModal({
            open: true,
            type,
            data
        });
    };

    const closeModal = () => {
        setModal({
            open: false,
            type: "",
            data: null
        });
    };

    // =====================================================
    // STYLE
    // =====================================================

    const styles = {
        page: {
            width: "100%",
            minWidth: 0,
            color: "#ffffff"
        },

        pageHeader: {
            marginBottom: "22px"
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
            color: "#777777",
            fontSize: "13px"
        },

        errorBox: {
            marginBottom: "18px",
            padding: "11px 13px",
            border:
                "1px solid rgba(220,70,70,0.22)",
            borderRadius: "8px",
            background:
                "rgba(220,70,70,0.09)",
            color: "#ff8585",
            fontSize: "10px",
            lineHeight: 1.5
        },

        statsGrid: {
            display: "grid",
            gridTemplateColumns:
                "repeat(5, minmax(0, 1fr))",
            gap: "14px",
            marginBottom: "18px"
        },

        statCard: {
            background: "#11100e",
            border: "1px solid #342d1e",
            borderRadius: "13px",
            overflow: "hidden"
        },

        statTop: {
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            padding: "18px"
        },

        statIcon: {
            width: "40px",
            height: "40px",
            minWidth: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "9px",
            background:
                "rgba(212,175,55,0.09)",
            border:
                "1px solid rgba(212,175,55,0.20)",
            color: "#d4af37"
        },

        statTitle: {
            margin: 0,
            color: "#8c8c8c",
            fontSize: "10px"
        },

        statValue: {
            margin: "5px 0 3px",
            color: "#ffffff",
            fontSize: "22px",
            lineHeight: 1.2,
            fontWeight: 700
        },

        statSubtitle: {
            color: "#606060",
            fontSize: "9px"
        },

        statDetail: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 16px",
            borderTop:
                "1px solid rgba(255,255,255,0.05)",
            color: "#d4af37",
            fontSize: "10px",
            cursor: "pointer"
        },

        dashboardGrid: {
            display: "grid",
            gridTemplateColumns:
                "minmax(0, 1.4fr) minmax(320px, 0.9fr)",
            gap: "18px",
            marginBottom: "18px"
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
            gap: "12px",
            padding: "17px 20px",
            borderBottom:
                "1px solid rgba(255,255,255,0.06)"
        },

        cardHeaderTitle: {
            display: "flex",
            alignItems: "center",
            gap: "8px",
            margin: 0,
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: 600
        },

        goldIcon: {
            color: "#d4af37"
        },

        select: {
            height: "34px",
            padding: "0 10px",
            border:
                "1px solid #3a321f",
            borderRadius: "7px",
            outline: "none",
            background: "#181714",
            color: "#cfcfcf",
            fontSize: "10px"
        },

        chartArea: {
            display: "grid",
            gridTemplateColumns:
                "38px minmax(0, 1fr)",
            gridTemplateRows:
                "1fr 25px",
            gap: "4px 8px",
            padding: "18px 20px 12px"
        },

        chartY: {
            gridColumn: "1",
            gridRow: "1",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-end",
            padding: "2px 0 3px",
            color: "#5d5d5d",
            fontSize: "8px"
        },

        chartSvgWrap: {
            gridColumn: "2",
            gridRow: "1",
            minWidth: 0,
            height: "250px",
            borderBottom:
                "1px solid rgba(255,255,255,0.05)",
            background:
                "repeating-linear-gradient(to bottom, transparent 0, transparent 49px, rgba(255,255,255,0.045) 50px)"
        },

        chartSvg: {
            width: "100%",
            height: "100%",
            display: "block"
        },

        chartX: {
            gridColumn: "2",
            gridRow: "2",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            color: "#5d5d5d",
            fontSize: "8px"
        },

        textButton: {
            border: "none",
            background: "transparent",
            color: "#d4af37",
            fontSize: "10px",
            cursor: "pointer",
            padding: "3px 0"
        },

        latestList: {
            display: "flex",
            flexDirection: "column"
        },

        latestItem: {
            display: "grid",
            gridTemplateColumns:
                "34px minmax(0, 1fr) auto",
            gap: "10px",
            alignItems: "center",
            padding: "13px 18px",
            borderBottom:
                "1px solid rgba(255,255,255,0.045)"
        },

        latestAvatar: {
            width: "34px",
            height: "34px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            background:
                "rgba(212,175,55,0.09)",
            border:
                "1px solid rgba(212,175,55,0.18)",
            color: "#d4af37",
            fontSize: "10px",
            fontWeight: 700
        },

        latestInfo: {
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: "4px"
        },

        latestName: {
            color: "#eeeeee",
            fontSize: "10px",
            fontWeight: 600,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
        },

        latestCostume: {
            color: "#656565",
            fontSize: "9px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
        },

        latestDate: {
            gridColumn: "2 / 4",
            marginTop: "-3px",
            color: "#585858",
            fontSize: "8px"
        },

        statusPill: {
            display: "inline-flex",
            alignItems: "center",
            padding: "4px 7px",
            borderRadius: "20px",
            fontSize: "8px",
            fontWeight: 600,
            whiteSpace: "nowrap"
        },

        summary: {
            marginBottom: "18px"
        },

        summaryBody: {
            display: "grid",
            gridTemplateColumns:
                "repeat(4, minmax(0, 1fr))"
        },

        summaryItem: {
            padding: "20px",
            borderRight:
                "1px solid rgba(255,255,255,0.05)"
        },

        summaryItemLast: {
            borderRight: "none"
        },

        summaryLabel: {
            color: "#666666",
            fontSize: "9px"
        },

        summaryValue: {
            margin: "7px 0 0",
            color: "#ffffff",
            fontSize: "21px",
            fontWeight: 700
        },

        popularTableWrap: {
            width: "100%",
            overflowX: "auto"
        },

        table: {
            width: "100%",
            minWidth: "820px",
            borderCollapse: "collapse"
        },

        th: {
            padding: "12px 15px",
            background: "#151411",
            borderBottom:
                "1px solid #312a1c",
            color: "#c8a84e",
            textAlign: "left",
            fontSize: "9px",
            fontWeight: 700,
            whiteSpace: "nowrap"
        },

        td: {
            padding: "12px 15px",
            borderBottom:
                "1px solid rgba(255,255,255,0.045)",
            color: "#d0d0d0",
            fontSize: "10px",
            verticalAlign: "middle"
        },

        costumeCell: {
            display: "flex",
            alignItems: "center",
            gap: "9px"
        },

        costumeImage: {
            width: "38px",
            height: "48px",
            minWidth: "38px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "6px",
            background:
                "rgba(212,175,55,0.07)",
            border:
                "1px solid rgba(212,175,55,0.15)",
            color: "#d4af37"
        },

        costumeName: {
            color: "#eeeeee",
            fontSize: "10px",
            fontWeight: 600
        },

        detailButton: {
            height: "29px",
            padding: "0 9px",
            border:
                "1px solid rgba(212,175,55,0.25)",
            borderRadius: "6px",
            background:
                "rgba(212,175,55,0.07)",
            color: "#d4af37",
            cursor: "pointer",
            fontSize: "9px",
            fontWeight: 600
        },

        emptyData: {
            minHeight: "160px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#636363",
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
                "rgba(0,0,0,0.76)"
        },

        modal: {
            width: "min(1000px, 100%)",
            maxHeight:
                "calc(100vh - 40px)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            background: "#151411",
            border:
                "1px solid #40351f",
            borderRadius: "15px",
            boxShadow:
                "0 24px 80px rgba(0,0,0,0.55)"
        },

        modalHeader: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            padding: "17px 20px",
            borderBottom:
                "1px solid #312a1c"
        },

        modalTitle: {
            margin: 0,
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: 700
        },

        modalClose: {
            width: "34px",
            height: "34px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border:
                "1px solid #40351f",
            borderRadius: "8px",
            background: "transparent",
            color: "#aaaaaa",
            fontSize: "20px",
            cursor: "pointer"
        },

        modalBody: {
            minHeight: 0,
            overflowY: "auto",
            padding: "18px 20px"
        },

        modalTableWrap: {
            width: "100%",
            overflowX: "auto"
        },

        modalTable: {
            width: "100%",
            minWidth: "800px",
            borderCollapse: "collapse"
        },

        modalTh: {
            padding: "11px 12px",
            background: "#12110f",
            borderBottom:
                "1px solid #312a1c",
            color: "#c8a84e",
            fontSize: "9px",
            textAlign: "left",
            whiteSpace: "nowrap"
        },

        modalTd: {
            padding: "11px 12px",
            borderBottom:
                "1px solid rgba(255,255,255,0.045)",
            color: "#cfcfcf",
            fontSize: "10px"
        },

        modalEmpty: {
            padding: "35px 15px",
            textAlign: "center",
            color: "#656565",
            fontSize: "10px"
        },

        detailGrid: {
            display: "grid",
            gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",
            gap: "10px"
        },

        detailRow: {
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            padding: "12px",
            border:
                "1px solid rgba(255,255,255,0.06)",
            borderRadius: "8px",
            background:
                "rgba(255,255,255,0.015)"
        },

        detailLabel: {
            color: "#696969",
            fontSize: "9px"
        },

        detailValue: {
            color: "#dddddd",
            fontSize: "11px",
            lineHeight: 1.5,
            wordBreak: "break-word"
        },

        incomeTotal: {
            marginBottom: "7px",
            color: "#d4af37",
            fontSize: "28px",
            fontWeight: 700
        },

        incomeDescription: {
            margin: "0 0 18px",
            color: "#777777",
            fontSize: "10px",
            lineHeight: 1.5
        },

        ratingBox: {
            textAlign: "center",
            padding: "30px 20px"
        },

        ratingNumber: {
            color: "#ffffff",
            fontSize: "52px",
            fontWeight: 700,
            lineHeight: 1
        },

        ratingStars: {
            margin: "14px 0",
            color: "#d4af37",
            fontSize: "20px",
            letterSpacing: "5px"
        },

        ratingText: {
            margin: 0,
            color: "#bbbbbb",
            fontSize: "12px"
        },

        ratingNote: {
            display: "block",
            marginTop: "8px",
            color: "#666666",
            fontSize: "9px"
        }
    };

    // =====================================================
    // NORMALIZE RESPONSE
    // =====================================================

    const normalizeArray = (
        response,
        preferredKeys = []
    ) => {

        let result = response;

        if (
            result &&
            typeof result === "object" &&
            result.data !== undefined
        ) {
            result = result.data;
        }

        if (
            result &&
            typeof result === "object" &&
            result.data !== undefined
        ) {
            result = result.data;
        }

        if (
            Array.isArray(result)
        ) {
            return result;
        }

        for (
            const key of preferredKeys
        ) {
            if (
                result &&
                Array.isArray(
                    result[key]
                )
            ) {
                return result[key];
            }
        }

        return [];
    };

    // =====================================================
    // LOAD DASHBOARD
    // =====================================================

    const loadDashboard = async () => {

        try {

            setLoading(true);
            setLoadError("");

            const results =
                await Promise.allSettled([
                    api.get("/kostum"),
                    api.get("/users"),
                    api.get("/peminjaman")
                ]);

            // ---------------------------------------------
            // KOSTUM
            // ---------------------------------------------

            if (
                results[0].status ===
                "fulfilled"
            ) {
                setKostum(
                    normalizeArray(
                        results[0].value,
                        ["kostum"]
                    )
                );
            } else {
                console.error(
                    "GAGAL LOAD KOSTUM:",
                    results[0].reason
                );

                setKostum([]);
            }

            // ---------------------------------------------
            // USERS
            // ---------------------------------------------

            if (
                results[1].status ===
                "fulfilled"
            ) {
                setUsers(
                    normalizeArray(
                        results[1].value,
                        ["users"]
                    )
                );
            } else {
                console.error(
                    "GAGAL LOAD USERS:",
                    results[1].reason
                );

                setUsers([]);
            }

            // ---------------------------------------------
            // PEMINJAMAN
            // ---------------------------------------------

            if (
                results[2].status ===
                "fulfilled"
            ) {
                setPeminjaman(
                    normalizeArray(
                        results[2].value,
                        ["peminjaman"]
                    )
                );
            } else {
                console.error(
                    "GAGAL LOAD PEMINJAMAN:",
                    results[2].reason
                );

                setPeminjaman([]);
            }

            // ---------------------------------------------
            // ERROR MESSAGE
            // ---------------------------------------------

            const failedRequests =
                results.filter(
                    (item) =>
                        item.status ===
                        "rejected"
                ).length;

            if (
                failedRequests > 0
            ) {
                setLoadError(
                    `${failedRequests} sumber data Dashboard tidak dapat dimuat.`
                );
            }

        } catch (error) {

            console.error(
                "GAGAL MENGAMBIL DATA DASHBOARD:",
                error
            );

            setLoadError(
                error?.message ||
                "Data Dashboard tidak dapat dimuat."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    // =====================================================
    // DATA STATISTIK
    // =====================================================

    const totalKostum =
        kostum.length;

    const pelanggan =
        useMemo(() => {

            return users.filter(
                (user) =>
                    Number(
                        user.id_role
                    ) === 3
            );

        }, [users]);

    const totalPelanggan =
        pelanggan.length;

    // ---------------------------------------------
    // TOTAL PEMINJAMAN
    // ---------------------------------------------

    const validPeminjaman =
        useMemo(() => {

            return peminjaman.filter(
                (item) => {

                    const date =
                        new Date(
                            item.tanggal_peminjaman
                        );

                    return (
                        !Number.isNaN(
                            date.getTime()
                        ) &&
                        date.getFullYear() >=
                            2020 &&
                        date.getFullYear() <=
                            2100
                    );

                }
            );

        }, [peminjaman]);

    const totalPeminjaman =
        validPeminjaman.length;

    // =====================================================
    // PEMINJAMAN MENUNGGU
    // =====================================================

    const peminjamanMenungguData =
        useMemo(() => {

            return peminjaman.filter(
                (item) =>
                    String(
                        item.status || ""
                    )
                        .toLowerCase()
                        .trim() ===
                    "menunggu"
            );

        }, [peminjaman]);

    const peminjamanMenunggu =
        peminjamanMenungguData.length;

    // =====================================================
    // PEMINJAMAN AKTIF
    // =====================================================

    const peminjamanAktifData =
        useMemo(() => {

            return peminjaman.filter(
                (item) =>
                    String(
                        item.status || ""
                    )
                        .toLowerCase()
                        .trim() ===
                    "dipinjam"
            );

        }, [peminjaman]);

    const peminjamanAktif =
        peminjamanAktifData.length;

    // =====================================================
    // PENDAPATAN BULAN INI
    // =====================================================

    const pendapatanData =
        useMemo(() => {

            const now =
                new Date();

            return peminjaman.filter(
                (item) => {

                    const tanggal =
                        new Date(
                            item.tanggal_peminjaman
                        );

                    if (
                        Number.isNaN(
                            tanggal.getTime()
                        )
                    ) {
                        return false;
                    }

                    const status =
                        String(
                            item.status || ""
                        )
                            .toLowerCase()
                            .trim();

                    return (
                        tanggal.getMonth() ===
                            now.getMonth() &&
                        tanggal.getFullYear() ===
                            now.getFullYear() &&
                        (
                            status ===
                                "disetujui" ||
                            status ===
                                "dipinjam"
                        )
                    );
                }
            );

        }, [peminjaman]);

    const pendapatanBulanIni =
        pendapatanData.reduce(
            (
                total,
                item
            ) => {

                return (
                    total +
                    Number(
                        item.total_harga ||
                        0
                    )
                );

            },
            0
        );

    // =====================================================
    // FORMAT
    // =====================================================

    const formatRupiah = (
        angka
    ) => {

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
    // PEMINJAMAN TERBARU
    // =====================================================

    const latest =
        useMemo(() => {

            return [
                ...validPeminjaman
            ]
                .sort(
                    (a, b) =>
                        new Date(
                            b.tanggal_peminjaman
                        ) -
                        new Date(
                            a.tanggal_peminjaman
                        )
                )
                .slice(
                    0,
                    4
                );

        }, [
            validPeminjaman
        ]);

    // =====================================================
    // CHART
    // =====================================================

    const chartData =
        useMemo(() => {

            const result =
                Array(30).fill(0);

            const now =
                new Date();

            let year =
                now.getFullYear();

            let month =
                now.getMonth();

            if (
                periode ===
                "bulanLalu"
            ) {

                const previous =
                    new Date(
                        year,
                        month - 1,
                        1
                    );

                year =
                    previous.getFullYear();

                month =
                    previous.getMonth();
            }

            validPeminjaman.forEach(
                (item) => {

                    const date =
                        new Date(
                            item.tanggal_peminjaman
                        );

                    if (
                        date.getFullYear() !==
                            year ||
                        date.getMonth() !==
                            month
                    ) {
                        return;
                    }

                    const day =
                        date.getDate();

                    if (
                        day >= 1 &&
                        day <= 30
                    ) {
                        result[
                            day - 1
                        ]++;
                    }

                }
            );

            return result;

        }, [
            validPeminjaman,
            periode
        ]);

    const maxChart =
        Math.max(
            ...chartData,
            5
        );

    const points =
        chartData.map(
            (
                value,
                index
            ) => {

                return {
                    x:
                        (index / 29) *
                        700,

                    y:
                        230 -
                        (
                            value /
                            maxChart
                        ) *
                        210
                };

            }
        );

    const linePath =
        points
            .map(
                (
                    point,
                    index
                ) =>
                    `${
                        index === 0
                            ? "M"
                            : "L"
                    } ${point.x} ${point.y}`
            )
            .join(" ");

    const areaPath =
        `${linePath} L700 250 L0 250 Z`;

    // =====================================================
    // KOLEKSI KOSTUM
    // =====================================================

    const popular =
        useMemo(() => {

            return [
                ...kostum
            ]
                .sort(
                    (a, b) =>
                        Number(
                            b.stok ||
                            0
                        ) -
                        Number(
                            a.stok ||
                            0
                        )
                )
                .slice(
                    0,
                    5
                );

        }, [kostum]);

    // =====================================================
    // STATISTICS
    // =====================================================

    const statistics = [
        {
            title: "Total Kostum",
            value:
                loading
                    ? "..."
                    : totalKostum,
            subtitle:
                "Koleksi Kostum",
            icon: "costume",
            type: "kostum"
        },

        {
            title: "Pelanggan",
            value:
                loading
                    ? "..."
                    : totalPelanggan,
            subtitle:
                "Pelanggan Terdaftar",
            icon: "users",
            type: "pelanggan"
        },

        {
            title: "Total Peminjaman",
            value:
                loading
                    ? "..."
                    : totalPeminjaman,
            subtitle:
                "Seluruh Data Peminjaman",
            icon: "calendar",
            type: "peminjaman"
        },

        {
            title:
                "Pendapatan Bulan Ini",
            value:
                loading
                    ? "..."
                    : formatRupiah(
                        pendapatanBulanIni
                    ),
            subtitle:
                "Pendapatan Disetujui",
            icon: "wallet",
            type: "pendapatan"
        },

        {
            title:
                "Rating Pelanggan",
            value: "4.9",
            subtitle:
                "Rating Pelanggan",
            icon: "star",
            type: "rating"
        }
    ];

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
            "dipinjam"
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
                "disetujui" ||
            value ===
                "selesai"
        ) {
            return {
                background:
                    "rgba(80,170,120,0.10)",
                border:
                    "1px solid rgba(80,170,120,0.22)",
                color:
                    "#7ed5a3"
            };
        }

        if (
            value ===
                "ditolak" ||
            value ===
                "dibatalkan"
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
    // MODAL CONTENT
    // =====================================================

    const renderModalContent = () => {

        // =================================================
        // KOSTUM
        // =================================================

        if (
            modal.type ===
            "kostum"
        ) {

            const item =
                modal.data;

            if (
                item &&
                !Array.isArray(
                    item
                )
            ) {

                return (
                    <div
                        style={
                            styles.detailGrid
                        }
                    >

                        {[
                            [
                                "Nama Kostum",
                                item.nama_kostum
                            ],
                            [
                                "Kategori",
                                item.nama_kategori
                            ],
                            [
                                "Ukuran",
                                item.ukuran
                            ],
                            [
                                "Warna",
                                item.warna
                            ],
                            [
                                "Stok",
                                item.stok ??
                                0
                            ],
                            [
                                "Harga Sewa",
                                formatRupiah(
                                    item.harga_sewa
                                )
                            ],
                            [
                                "Status",
                                item.status
                            ],
                            [
                                "Deskripsi",
                                item.deskripsi ||
                                "Tidak ada deskripsi"
                            ]
                        ].map(
                            (
                                [
                                    label,
                                    value
                                ]
                            ) => (
                                <div
                                    key={
                                        label
                                    }
                                    style={
                                        styles.detailRow
                                    }
                                >

                                    <span
                                        style={
                                            styles.detailLabel
                                        }
                                    >
                                        {label}
                                    </span>

                                    <span
                                        style={
                                            styles.detailValue
                                        }
                                    >
                                        {value ||
                                            "-"}
                                    </span>

                                </div>
                            )
                        )}

                    </div>
                );
            }

            return (
                <div
                    style={
                        styles.modalTableWrap
                    }
                >

                    <table
                        style={
                            styles.modalTable
                        }
                    >

                        <thead>

                            <tr>
                                <th style={styles.modalTh}>
                                    No
                                </th>

                                <th style={styles.modalTh}>
                                    Kostum
                                </th>

                                <th style={styles.modalTh}>
                                    Kategori
                                </th>

                                <th style={styles.modalTh}>
                                    Ukuran
                                </th>

                                <th style={styles.modalTh}>
                                    Warna
                                </th>

                                <th style={styles.modalTh}>
                                    Stok
                                </th>

                                <th style={styles.modalTh}>
                                    Harga
                                </th>

                                <th style={styles.modalTh}>
                                    Status
                                </th>
                            </tr>

                        </thead>

                        <tbody>

                            {kostum.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        style={
                                            styles.modalEmpty
                                        }
                                    >
                                        Belum ada data kostum.
                                    </td>

                                </tr>

                            ) : (

                                kostum.map(
                                    (
                                        item,
                                        index
                                    ) => (

                                        <tr
                                            key={
                                                item.id_kostum ||
                                                index
                                            }
                                        >

                                            <td style={styles.modalTd}>
                                                {index + 1}
                                            </td>

                                            <td style={styles.modalTd}>
                                                {
                                                    item.nama_kostum ||
                                                    "-"
                                                }
                                            </td>

                                            <td style={styles.modalTd}>
                                                {
                                                    item.nama_kategori ||
                                                    "-"
                                                }
                                            </td>

                                            <td style={styles.modalTd}>
                                                {
                                                    item.ukuran ||
                                                    "-"
                                                }
                                            </td>

                                            <td style={styles.modalTd}>
                                                {
                                                    item.warna ||
                                                    "-"
                                                }
                                            </td>

                                            <td style={styles.modalTd}>
                                                {
                                                    item.stok ??
                                                    0
                                                }
                                            </td>

                                            <td style={styles.modalTd}>
                                                {formatRupiah(
                                                    item.harga_sewa
                                                )}
                                            </td>

                                            <td style={styles.modalTd}>
                                                {
                                                    item.status ||
                                                    "-"
                                                }
                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>
            );
        }

        // =================================================
        // PELANGGAN
        // =================================================

        if (
            modal.type ===
            "pelanggan"
        ) {

            return (
                <div
                    style={
                        styles.modalTableWrap
                    }
                >

                    <table
                        style={
                            styles.modalTable
                        }
                    >

                        <thead>

                            <tr>
                                <th style={styles.modalTh}>
                                    No
                                </th>

                                <th style={styles.modalTh}>
                                    Nama
                                </th>

                                <th style={styles.modalTh}>
                                    Email
                                </th>

                                <th style={styles.modalTh}>
                                    No. HP
                                </th>

                                <th style={styles.modalTh}>
                                    Alamat
                                </th>
                            </tr>

                        </thead>

                        <tbody>

                            {pelanggan.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                        style={
                                            styles.modalEmpty
                                        }
                                    >
                                        Belum ada pelanggan.
                                    </td>

                                </tr>

                            ) : (

                                pelanggan.map(
                                    (
                                        item,
                                        index
                                    ) => (

                                        <tr
                                            key={
                                                item.id_user ||
                                                index
                                            }
                                        >

                                            <td style={styles.modalTd}>
                                                {index + 1}
                                            </td>

                                            <td style={styles.modalTd}>
                                                {
                                                    item.nama ||
                                                    "-"
                                                }
                                            </td>

                                            <td style={styles.modalTd}>
                                                {
                                                    item.email ||
                                                    "-"
                                                }
                                            </td>

                                            <td style={styles.modalTd}>
                                                {
                                                    item.no_hp ||
                                                    item.no_whatsapp ||
                                                    "-"
                                                }
                                            </td>

                                            <td style={styles.modalTd}>
                                                {
                                                    item.alamat ||
                                                    "-"
                                                }
                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>
            );
        }

        // =================================================
        // TOTAL PEMINJAMAN
        // =================================================

        if (
            modal.type ===
            "peminjaman"
        ) {

            return (
                <div
                    style={
                        styles.modalTableWrap
                    }
                >

                    <table
                        style={
                            styles.modalTable
                        }
                    >

                        <thead>

                            <tr>

                                <th style={styles.modalTh}>
                                    No
                                </th>

                                <th style={styles.modalTh}>
                                    Pelanggan
                                </th>

                                <th style={styles.modalTh}>
                                    Kostum
                                </th>

                                <th style={styles.modalTh}>
                                    Tanggal Pinjam
                                </th>

                                <th style={styles.modalTh}>
                                    Tanggal Kembali
                                </th>

                                <th style={styles.modalTh}>
                                    Total
                                </th>

                                <th style={styles.modalTh}>
                                    Status
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {validPeminjaman.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        style={
                                            styles.modalEmpty
                                        }
                                    >
                                        Belum ada peminjaman.
                                    </td>

                                </tr>

                            ) : (

                                validPeminjaman.map(
                                    (
                                        item,
                                        index
                                    ) => (

                                        <tr
                                            key={
                                                item.id_peminjaman ||
                                                index
                                            }
                                        >

                                            <td style={styles.modalTd}>
                                                {index + 1}
                                            </td>

                                            <td style={styles.modalTd}>
                                                {
                                                    item.nama_user ||
                                                    "Pelanggan"
                                                }
                                            </td>

                                            <td style={styles.modalTd}>
                                                {
                                                    item.nama_kostum ||
                                                    "-"
                                                }
                                            </td>

                                            <td style={styles.modalTd}>
                                                {formatTanggal(
                                                    item.tanggal_peminjaman
                                                )}
                                            </td>

                                            <td style={styles.modalTd}>
                                                {formatTanggal(
                                                    item.tanggal_kembali
                                                )}
                                            </td>

                                            <td style={styles.modalTd}>
                                                {formatRupiah(
                                                    item.total_harga
                                                )}
                                            </td>

                                            <td style={styles.modalTd}>

                                                <span
                                                    style={{
                                                        ...styles.statusPill,
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
                                )

                            )}

                        </tbody>

                    </table>

                </div>
            );
        }

        // =================================================
        // PENDAPATAN
        // =================================================

        if (
            modal.type ===
            "pendapatan"
        ) {

            return (
                <div>

                    <div
                        style={
                            styles.incomeTotal
                        }
                    >
                        {formatRupiah(
                            pendapatanBulanIni
                        )}
                    </div>

                    <p
                        style={
                            styles.incomeDescription
                        }
                    >
                        Total pendapatan bulan ini
                        dari peminjaman dengan status
                        Disetujui atau Dipinjam.
                    </p>

                    <div
                        style={
                            styles.modalTableWrap
                        }
                    >

                        <table
                            style={
                                styles.modalTable
                            }
                        >

                            <thead>

                                <tr>

                                    <th style={styles.modalTh}>
                                        No
                                    </th>

                                    <th style={styles.modalTh}>
                                        Pelanggan
                                    </th>

                                    <th style={styles.modalTh}>
                                        Tanggal
                                    </th>

                                    <th style={styles.modalTh}>
                                        Status
                                    </th>

                                    <th style={styles.modalTh}>
                                        Total
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {pendapatanData.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            style={
                                                styles.modalEmpty
                                            }
                                        >
                                            Belum ada pendapatan
                                            bulan ini.
                                        </td>

                                    </tr>

                                ) : (

                                    pendapatanData.map(
                                        (
                                            item,
                                            index
                                        ) => (

                                            <tr
                                                key={
                                                    item.id_peminjaman ||
                                                    index
                                                }
                                            >

                                                <td style={styles.modalTd}>
                                                    {index + 1}
                                                </td>

                                                <td style={styles.modalTd}>
                                                    {
                                                        item.nama_user ||
                                                        "Pelanggan"
                                                    }
                                                </td>

                                                <td style={styles.modalTd}>
                                                    {formatTanggal(
                                                        item.tanggal_peminjaman
                                                    )}
                                                </td>

                                                <td style={styles.modalTd}>
                                                    {
                                                        item.status ||
                                                        "-"
                                                    }
                                                </td>

                                                <td style={styles.modalTd}>
                                                    <strong>
                                                        {formatRupiah(
                                                            item.total_harga
                                                        )}
                                                    </strong>
                                                </td>

                                            </tr>

                                        )
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>
            );
        }

        // =================================================
        // RATING
        // =================================================

        if (
            modal.type ===
            "rating"
        ) {

            return (
                <div
                    style={
                        styles.ratingBox
                    }
                >

                    <div
                        style={
                            styles.ratingNumber
                        }
                    >
                        4.9
                    </div>

                    <div
                        style={
                            styles.ratingStars
                        }
                    >
                        ★ ★ ★ ★ ★
                    </div>

                    <p
                        style={
                            styles.ratingText
                        }
                    >
                        Rating pelanggan saat ini
                    </p>

                    <small
                        style={
                            styles.ratingNote
                        }
                    >
                        Sistem rating belum terhubung
                        dengan tabel penilaian.
                    </small>

                </div>
            );
        }

        return null;
    };

    // =====================================================
    // MODAL TITLE
    // =====================================================

    const getModalTitle = () => {

        switch (
            modal.type
        ) {

            case "kostum":
                return modal.data
                    ? "Detail Kostum"
                    : "Data Kostum";

            case "pelanggan":
                return "Data Pelanggan";

            case "peminjaman":
                return "Data Semua Peminjaman";

            case "pendapatan":
                return "Detail Pendapatan";

            case "rating":
                return "Rating Pelanggan";

            default:
                return "Detail";

        }
    };

    // =====================================================
    // CARD CLICK
    // =====================================================

    const handleStatisticClick = (
        type
    ) => {

        switch (type) {

            case "kostum":
                openModal("kostum");
                break;

            case "pelanggan":
                openModal("pelanggan");
                break;

            case "peminjaman":
                openModal("peminjaman");
                break;

            case "pendapatan":
                openModal("pendapatan");
                break;

            case "rating":
                openModal("rating");
                break;

            default:
                break;

        }
    };

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
                    styles.pageHeader
                }
            >

                <span
                    style={
                        styles.kicker
                    }
                >
                    OVERVIEW
                </span>

                <h1
                    style={
                        styles.title
                    }
                >
                    Dashboard
                </h1>

                <p
                    style={
                        styles.subtitle
                    }
                >
                    Ringkasan aktivitas dan performa
                    Handu Atelier.
                </p>

            </div>

            {/* =========================================
                ERROR / WARNING
            ========================================= */}

            {loadError && (
                <div
                    style={
                        styles.errorBox
                    }
                >
                    {loadError}
                </div>
            )}

            {/* =========================================
                STATISTICS
            ========================================= */}

            <div
                style={
                    styles.statsGrid
                }
            >

                {statistics.map(
                    (item) => (

                        <div
                            key={
                                item.title
                            }
                            style={
                                styles.statCard
                            }
                        >

                            <div
                                style={
                                    styles.statTop
                                }
                            >

                                <div
                                    style={
                                        styles.statIcon
                                    }
                                >

                                    <Icon
                                        name={
                                            item.icon
                                        }
                                        size={25}
                                    />

                                </div>

                                <div>

                                    <p
                                        style={
                                            styles.statTitle
                                        }
                                    >
                                        {item.title}
                                    </p>

                                    <h3
                                        style={
                                            styles.statValue
                                        }
                                    >
                                        {item.value}
                                    </h3>

                                    <span
                                        style={
                                            styles.statSubtitle
                                        }
                                    >
                                        {
                                            item.subtitle
                                        }
                                    </span>

                                </div>

                            </div>

                            <div
                                style={
                                    styles.statDetail
                                }
                                onClick={() =>
                                    handleStatisticClick(
                                        item.type
                                    )
                                }
                            >

                                <span>
                                    Lihat Detail
                                </span>

                                <Icon
                                    name="arrow"
                                    size={14}
                                />

                            </div>

                        </div>

                    )
                )}

            </div>

            {/* =========================================
                CHART + LATEST
            ========================================= */}

            <div
                style={
                    styles.dashboardGrid
                }
            >

                {/* CHART */}

                <section
                    style={
                        styles.card
                    }
                >

                    <div
                        style={
                            styles.cardHeader
                        }
                    >

                        <h3
                            style={
                                styles.cardHeaderTitle
                            }
                        >

                            <span
                                style={
                                    styles.goldIcon
                                }
                            >
                                <Icon
                                    name="chart"
                                    size={18}
                                />
                            </span>

                            Grafik Peminjaman

                        </h3>

                        <select
                            value={
                                periode
                            }
                            onChange={(event) =>
                                setPeriode(
                                    event.target.value
                                )
                            }
                            style={
                                styles.select
                            }
                        >

                            <option value="bulanIni">
                                Bulan Ini
                            </option>

                            <option value="bulanLalu">
                                Bulan Lalu
                            </option>

                        </select>

                    </div>

                    <div
                        style={
                            styles.chartArea
                        }
                    >

                        <div
                            style={
                                styles.chartY
                            }
                        >

                            <span>
                                {maxChart}
                            </span>

                            <span>
                                {Math.round(
                                    maxChart * 0.8
                                )}
                            </span>

                            <span>
                                {Math.round(
                                    maxChart * 0.6
                                )}
                            </span>

                            <span>
                                {Math.round(
                                    maxChart * 0.4
                                )}
                            </span>

                            <span>
                                {Math.round(
                                    maxChart * 0.2
                                )}
                            </span>

                            <span>
                                0
                            </span>

                        </div>

                        <div
                            style={
                                styles.chartSvgWrap
                            }
                        >

                            <svg
                                viewBox="0 0 700 250"
                                preserveAspectRatio="none"
                                style={
                                    styles.chartSvg
                                }
                            >

                                <defs>

                                    <linearGradient
                                        id="adminGoldFill"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >

                                        <stop
                                            offset="0%"
                                            stopColor="#dcae3b"
                                            stopOpacity="0.35"
                                        />

                                        <stop
                                            offset="100%"
                                            stopColor="#dcae3b"
                                            stopOpacity="0"
                                        />

                                    </linearGradient>

                                </defs>

                                <path
                                    d={
                                        areaPath
                                    }
                                    fill="url(#adminGoldFill)"
                                />

                                <path
                                    d={
                                        linePath
                                    }
                                    fill="none"
                                    stroke="#dcae3b"
                                    strokeWidth="3"
                                />

                                {points.map(
                                    (
                                        point,
                                        index
                                    ) => (

                                        <circle
                                            key={
                                                index
                                            }
                                            cx={
                                                point.x
                                            }
                                            cy={
                                                point.y
                                            }
                                            r="3.8"
                                            fill="#dcae3b"
                                            stroke="#181510"
                                            strokeWidth="2"
                                        />

                                    )
                                )}

                            </svg>

                        </div>

                        <div
                            style={
                                styles.chartX
                            }
                        >
                            <span>1</span>
                            <span>5</span>
                            <span>10</span>
                            <span>15</span>
                            <span>20</span>
                            <span>25</span>
                            <span>30</span>
                        </div>

                    </div>

                </section>

                {/* =====================================
                    LATEST
                ===================================== */}

                <section
                    style={
                        styles.card
                    }
                >

                    <div
                        style={
                            styles.cardHeader
                        }
                    >

                        <h3
                            style={
                                styles.cardHeaderTitle
                            }
                        >

                            <span
                                style={
                                    styles.goldIcon
                                }
                            >
                                <Icon
                                    name="calendar"
                                    size={18}
                                />
                            </span>

                            Peminjaman Terbaru

                        </h3>

                        <button
                            type="button"
                            style={
                                styles.textButton
                            }
                            onClick={() =>
                                navigate(
                                    "/admin/peminjaman"
                                )
                            }
                        >
                            Lihat Semua
                        </button>

                    </div>

                    <div
                        style={
                            styles.latestList
                        }
                    >

                        {latest.length === 0 ? (

                            <div
                                style={
                                    styles.emptyData
                                }
                            >
                                Belum ada peminjaman.
                            </div>

                        ) : (

                            latest.map(
                                (
                                    item,
                                    index
                                ) => {

                                    const name =
                                        item.nama_user ||
                                        "Pelanggan";

                                    return (
                                        <div
                                            key={
                                                item.id_peminjaman ||
                                                index
                                            }
                                            style={
                                                styles.latestItem
                                            }
                                        >

                                            <div
                                                style={
                                                    styles.latestAvatar
                                                }
                                            >
                                                {name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <div
                                                style={
                                                    styles.latestInfo
                                                }
                                            >

                                                <strong
                                                    style={
                                                        styles.latestName
                                                    }
                                                >
                                                    {name}
                                                </strong>

                                                <span
                                                    style={
                                                        styles.latestCostume
                                                    }
                                                >
                                                    {
                                                        item.nama_kostum ||
                                                        "Belum ada kostum"
                                                    }
                                                </span>

                                            </div>

                                            <span
                                                style={{
                                                    ...styles.statusPill,
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

                                            <span
                                                style={
                                                    styles.latestDate
                                                }
                                            >
                                                {formatTanggal(
                                                    item.tanggal_peminjaman
                                                )}
                                            </span>

                                        </div>
                                    );
                                }
                            )

                        )}

                    </div>

                </section>

            </div>

            {/* =========================================
                SUMMARY
            ========================================= */}

            <section
                style={{
                    ...styles.card,
                    ...styles.summary
                }}
            >

                <div
                    style={
                        styles.cardHeader
                    }
                >

                    <h3
                        style={
                            styles.cardHeaderTitle
                        }
                    >

                        <span
                            style={
                                styles.goldIcon
                            }
                        >
                            <Icon
                                name="calendar"
                                size={18}
                            />
                        </span>

                        Ringkasan Peminjaman

                    </h3>

                </div>

                <div
                    style={
                        styles.summaryBody
                    }
                >

                    <div
                        style={
                            styles.summaryItem
                        }
                    >

                        <span
                            style={
                                styles.summaryLabel
                            }
                        >
                            Total Peminjaman
                        </span>

                        <h3
                            style={
                                styles.summaryValue
                            }
                        >
                            {
                                totalPeminjaman
                            }
                        </h3>

                    </div>

                    <div
                        style={
                            styles.summaryItem
                        }
                    >

                        <span
                            style={
                                styles.summaryLabel
                            }
                        >
                            Menunggu
                        </span>

                        <h3
                            style={
                                styles.summaryValue
                            }
                        >
                            {
                                peminjamanMenunggu
                            }
                        </h3>

                    </div>

                    <div
                        style={
                            styles.summaryItem
                        }
                    >

                        <span
                            style={
                                styles.summaryLabel
                            }
                        >
                            Aktif / Dipinjam
                        </span>

                        <h3
                            style={
                                styles.summaryValue
                            }
                        >
                            {
                                peminjamanAktif
                            }
                        </h3>

                    </div>

                    <div
                        style={{
                            ...styles.summaryItem,
                            ...styles.summaryItemLast
                        }}
                    >

                        <span
                            style={
                                styles.summaryLabel
                            }
                        >
                            Pendapatan Bulan Ini
                        </span>

                        <h3
                            style={
                                styles.summaryValue
                            }
                        >
                            {formatRupiah(
                                pendapatanBulanIni
                            )}
                        </h3>

                    </div>

                </div>

            </section>

            {/* =========================================
                KOLEKSI KOSTUM
            ========================================= */}

            <section
                style={
                    styles.card
                }
            >

                <div
                    style={
                        styles.cardHeader
                    }
                >

                    <h3
                        style={
                            styles.cardHeaderTitle
                        }
                    >

                        <span
                            style={
                                styles.goldIcon
                            }
                        >
                            <Icon
                                name="costume"
                                size={18}
                            />
                        </span>

                        Koleksi Kostum

                    </h3>

                    <button
                        type="button"
                        style={
                            styles.textButton
                        }
                        onClick={() =>
                            navigate(
                                "/admin/kostum"
                            )
                        }
                    >
                        Lihat Semua
                    </button>

                </div>

                <div
                    style={
                        styles.popularTableWrap
                    }
                >

                    <table
                        style={
                            styles.table
                        }
                    >

                        <thead>

                            <tr>

                                <th style={styles.th}>
                                    No
                                </th>

                                <th style={styles.th}>
                                    Kostum
                                </th>

                                <th style={styles.th}>
                                    Kategori
                                </th>

                                <th style={styles.th}>
                                    Stok
                                </th>

                                <th style={styles.th}>
                                    Harga Sewa
                                </th>

                                <th style={styles.th}>
                                    Status
                                </th>

                                <th style={styles.th}>
                                    Aksi
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {popular.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        style={{
                                            ...styles.td,
                                            textAlign:
                                                "center",
                                            padding:
                                                "35px"
                                        }}
                                    >
                                        Belum ada data kostum.
                                    </td>

                                </tr>

                            ) : (

                                popular.map(
                                    (
                                        item,
                                        index
                                    ) => (

                                        <tr
                                            key={
                                                item.id_kostum ||
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
                                                        styles.costumeCell
                                                    }
                                                >

                                                    <div
                                                        style={
                                                            styles.costumeImage
                                                        }
                                                    >
                                                        <Icon
                                                            name="costume"
                                                            size={21}
                                                        />
                                                    </div>

                                                    <strong
                                                        style={
                                                            styles.costumeName
                                                        }
                                                    >
                                                        {
                                                            item.nama_kostum ||
                                                            "-"
                                                        }
                                                    </strong>

                                                </div>

                                            </td>

                                            <td
                                                style={
                                                    styles.td
                                                }
                                            >
                                                {
                                                    item.nama_kategori ||
                                                    "-"
                                                }
                                            </td>

                                            <td
                                                style={
                                                    styles.td
                                                }
                                            >
                                                {
                                                    item.stok ??
                                                    0
                                                }
                                            </td>

                                            <td
                                                style={
                                                    styles.td
                                                }
                                            >
                                                {formatRupiah(
                                                    item.harga_sewa
                                                )}
                                            </td>

                                            <td
                                                style={
                                                    styles.td
                                                }
                                            >

                                                <span
                                                    style={{
                                                        ...styles.statusPill,
                                                        ...getStatusStyle(
                                                            item.status
                                                        )
                                                    }}
                                                >
                                                    {
                                                        item.status ||
                                                        "-"
                                                    }
                                                </span>

                                            </td>

                                            <td
                                                style={
                                                    styles.td
                                                }
                                            >

                                                <button
                                                    type="button"
                                                    style={
                                                        styles.detailButton
                                                    }
                                                    onClick={() =>
                                                        openModal(
                                                            "kostum",
                                                            item
                                                        )
                                                    }
                                                >
                                                    Detail
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </section>

            {/* =========================================
                MODAL
            ========================================= */}

            {modal.open && (

                <div
                    style={
                        styles.modalOverlay
                    }
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeModal();
                        }

                    }}
                >

                    <div
                        style={
                            styles.modal
                        }
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div
                            style={
                                styles.modalHeader
                            }
                        >

                            <h2
                                style={
                                    styles.modalTitle
                                }
                            >
                                {
                                    getModalTitle()
                                }
                            </h2>

                            <button
                                type="button"
                                style={
                                    styles.modalClose
                                }
                                onClick={
                                    closeModal
                                }
                            >
                                ×
                            </button>

                        </div>

                        <div
                            style={
                                styles.modalBody
                            }
                        >
                            {
                                renderModalContent()
                            }
                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default AdminDashboard;