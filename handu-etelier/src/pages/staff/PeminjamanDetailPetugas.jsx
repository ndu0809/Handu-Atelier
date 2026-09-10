import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    FaArrowLeft,
    FaCalendarAlt,
    FaClipboardList,
    FaEnvelope,
    FaPhone,
    FaTshirt,
    FaUser,
    FaCheck,
    FaTimes,
    FaCog,
    FaUndo,
    FaImage,
    FaMoneyBillWave,
    FaReceipt,
    FaExternalLinkAlt,
    FaCreditCard,
} from "react-icons/fa";

function PeminjamanDetailPetugas() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [data, setData] = useState(null);
    const [payment, setPayment] = useState(null);

    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ==================================================
    // MODAL KONFIRMASI
    // ==================================================

    const [confirmModal, setConfirmModal] = useState({
        open: false,
        newStatus: "",
        title: "",
        message: "",
    });

    // ==================================================
    // CEK LOGIN PETUGAS
    // ==================================================

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            navigate("/login", {
                replace: true,
            });

            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser);

            if (!parsedUser?.id_user) {
                throw new Error(
                    "Data user tidak valid."
                );
            }

            // ROLE 2 = PETUGAS
            if (Number(parsedUser.id_role) !== 2) {
                navigate("/dashboard", {
                    replace: true,
                });

                return;
            }

            setUser(parsedUser);
        } catch (err) {
            console.error(
                "Session error:",
                err
            );

            localStorage.removeItem("user");
            localStorage.removeItem("isLoggedIn");

            navigate("/login", {
                replace: true,
            });
        }
    }, [navigate]);

    // ==================================================
    // LOAD DETAIL PEMINJAMAN
    // ==================================================

    const loadDetail = async () => {
        try {
            setLoading(true);
            setError("");

            // ==================================================
            // 1. AMBIL DETAIL PEMINJAMAN
            // ==================================================

            const response = await fetch(
                `/peminjaman/detail/${id}?_=${Date.now()}`,
                {
                    cache: "no-store",
                }
            );

            const rawResponse =
                await response.text();

            let result = {};

            try {
                result = rawResponse
                    ? JSON.parse(rawResponse)
                    : {};
            } catch {
                throw new Error(
                    "Server mengembalikan response yang bukan JSON."
                );
            }

            if (!response.ok) {
                throw new Error(
                    result.message ||
                        "Gagal mengambil detail peminjaman."
                );
            }

            const detailData =
                result.data || null;

            if (!detailData) {
                throw new Error(
                    "Data peminjaman tidak ditemukan."
                );
            }

            setData(detailData);

            // ==================================================
            // 2. AMBIL DATA PEMBAYARAN
            // ==================================================

            try {
                const paymentResponse =
                    await fetch(
                        `/pembayaran?_=${Date.now()}`,
                        {
                            cache: "no-store",
                        }
                    );

                const paymentRaw =
                    await paymentResponse.text();

                let paymentResult = {};

                try {
                    paymentResult =
                        paymentRaw
                            ? JSON.parse(
                                  paymentRaw
                              )
                            : {};
                } catch {
                    paymentResult = {};
                }

                if (paymentResponse.ok) {
                    const paymentRows =
                        Array.isArray(
                            paymentResult
                        )
                            ? paymentResult
                            : Array.isArray(
                                  paymentResult.data
                              )
                            ? paymentResult.data
                            : Array.isArray(
                                  paymentResult.pembayaran
                              )
                            ? paymentResult.pembayaran
                            : [];

                    // Cari pembayaran berdasarkan ID PEMINJAMAN
                    const matchedPayments =
                        paymentRows.filter(
                            (item) =>
                                Number(
                                    item.id_peminjaman
                                ) ===
                                Number(id)
                        );

                    if (
                        matchedPayments.length >
                        0
                    ) {
                        /*
                         * Jika terdapat lebih dari satu
                         * data pembayaran, jumlahkan seluruh
                         * pembayaran yang terkait peminjaman.
                         *
                         * Data terakhir dipakai untuk:
                         * - metode
                         * - status
                         * - tanggal
                         * - bukti
                         */

                        const latestPayment =
                            matchedPayments[
                                matchedPayments.length -
                                    1
                            ];

                        const totalDibayar =
                            matchedPayments.reduce(
                                (
                                    total,
                                    item
                                ) =>
                                    total +
                                    (Number(
                                        item.total
                                    ) || 0),
                                0
                            );

                        setPayment({
                            ...latestPayment,
                            total: totalDibayar,
                        });
                    } else {
                        setPayment(null);
                    }
                } else {
                    setPayment(null);
                }
            } catch (paymentError) {
                console.error(
                    "Load pembayaran:",
                    paymentError
                );

                setPayment(null);
            }
        } catch (err) {
            console.error(
                "Detail peminjaman error:",
                err
            );

            setError(
                err.message ||
                    "Gagal mengambil detail peminjaman."
            );

            setData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user || !id) {
            return;
        }

        loadDetail();
    }, [user, id]);

    // ==================================================
    // FORMAT RUPIAH
    // ==================================================

    const formatRupiah = (value) => {
        return new Intl.NumberFormat(
            "id-ID",
            {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
            }
        ).format(
            Number(value) || 0
        );
    };

    // ==================================================
    // FORMAT TANGGAL
    // ==================================================

    const formatTanggal = (value) => {
        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return value;
        }

        return date.toLocaleDateString(
            "id-ID",
            {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }
        );
    };

    // ==================================================
    // URL FOTO KOSTUM
    // ==================================================

    const getImageUrl = (foto) => {
        if (!foto) {
            return "";
        }

        const value =
            String(foto).trim();

        if (!value) {
            return "";
        }

        if (
            value.startsWith(
                "http://"
            ) ||
            value.startsWith(
                "https://"
            )
        ) {
            return value;
        }

        if (
            value.startsWith(
                "/uploads/"
            )
        ) {
            return value;
        }

        if (
            value.startsWith(
                "uploads/"
            )
        ) {
            return `/${value}`;
        }

        return `/uploads/kostum/${value}`;
    };

    // ==================================================
    // URL BUKTI PEMBAYARAN
    // ==================================================

    const getPaymentProofUrl = (
        bukti
    ) => {
        if (!bukti) {
            return "";
        }

        const value =
            String(bukti).trim();

        if (!value) {
            return "";
        }

        if (
            value.startsWith(
                "http://"
            ) ||
            value.startsWith(
                "https://"
            )
        ) {
            return value;
        }

        if (
            value.startsWith(
                "/uploads/"
            )
        ) {
            return value;
        }

        if (
            value.startsWith(
                "uploads/"
            )
        ) {
            return `/${value}`;
        }

        return `/uploads/pembayaran/${value}`;
    };

    // ==================================================
    // STATUS PEMBAYARAN
    // ==================================================

    const getPaymentInfo = () => {
        const totalPeminjaman =
            Number(
                data?.total_harga
            ) || 0;

        const totalDibayar =
            Number(
                payment?.total
            ) || 0;

        const sisaPembayaran =
            Math.max(
                0,
                totalPeminjaman -
                    totalDibayar
            );

        // Tidak ada data pembayaran
        if (!payment) {
            return {
                label: "Belum Dibayar",
                description:
                    "Belum ada pembayaran yang tercatat.",
                totalDibayar: 0,
                sisaPembayaran:
                    totalPeminjaman,
                percentage: 0,
                className:
                    "bg-red-500/10 text-red-400 border-red-500/20",
            };
        }

        // Jika pembayaran sudah sama / lebih dari total
        if (
            totalDibayar >=
                totalPeminjaman &&
            totalPeminjaman > 0
        ) {
            return {
                label: "Lunas",
                description:
                    "Pembayaran telah lunas 100%.",
                totalDibayar,
                sisaPembayaran: 0,
                percentage: 100,
                className:
                    "bg-green-500/10 text-green-400 border-green-500/20",
            };
        }

        // Jika pembayaran lebih dari 0 tetapi belum lunas
        if (totalDibayar > 0) {
            const percentage =
                totalPeminjaman > 0
                    ? Math.round(
                          (totalDibayar /
                              totalPeminjaman) *
                              100
                      )
                    : 0;

            return {
                label:
                    `DP / Sebagian Dibayar (${percentage}%)`,
                description:
                    "Pembayaran baru sebagian dan masih terdapat sisa pembayaran.",
                totalDibayar,
                sisaPembayaran,
                percentage,
                className:
                    "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
            };
        }

        return {
            label: "Belum Dibayar",
            description:
                "Belum ada pembayaran yang tercatat.",
            totalDibayar: 0,
            sisaPembayaran:
                totalPeminjaman,
            percentage: 0,
            className:
                "bg-red-500/10 text-red-400 border-red-500/20",
        };
    };

    const paymentInfo =
        getPaymentInfo();

    // ==================================================
    // STATUS CLASS
    // ==================================================

    const getStatusClass = (
        status
    ) => {
        switch (
            String(
                status || ""
            ).toLowerCase()
        ) {
            case "menunggu":
                return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";

            case "disetujui":
                return "bg-blue-500/10 text-blue-400 border-blue-500/20";

            case "diproses":
                return "bg-purple-500/10 text-purple-400 border-purple-500/20";

            case "selesai":
                return "bg-green-500/10 text-green-400 border-green-500/20";

            case "ditolak":
                return "bg-red-500/10 text-red-400 border-red-500/20";

            case "dibatalkan":
                return "bg-gray-500/10 text-gray-400 border-gray-500/20";

            default:
                return "bg-white/5 text-gray-300 border-white/10";
        }
    };

    // ==================================================
    // ICON STATUS
    // ==================================================

    const getStatusIcon = (
        status
    ) => {
        switch (
            String(
                status || ""
            ).toLowerCase()
        ) {
            case "menunggu":
                return (
                    <FaClipboardList />
                );

            case "disetujui":
                return <FaCheck />;

            case "diproses":
                return <FaCog />;

            case "selesai":
                return <FaCheck />;

            case "ditolak":
                return <FaTimes />;

            case "dibatalkan":
                return <FaUndo />;

            default:
                return (
                    <FaClipboardList />
                );
        }
    };

    // ==================================================
    // STATUS TRANSITION
    // ==================================================

    const allowedTransitions = {
        menunggu: [
            "Disetujui",
            "Ditolak",
        ],

        disetujui: [
            "Diproses",
            "Dibatalkan",
        ],

        diproses: [
            "Selesai",
        ],

        selesai: [],
        ditolak: [],
        dibatalkan: [],
    };

    // ==================================================
    // BUKA MODAL KONFIRMASI
    // ==================================================

    const openConfirmModal = (
        newStatus
    ) => {
        if (!data?.id_peminjaman) {
            return;
        }

        if (updatingStatus) {
            return;
        }

        const currentStatus =
            String(
                data.status || ""
            ).toLowerCase();

        const allowed =
            allowedTransitions[
                currentStatus
            ] || [];

        if (
            !allowed.includes(
                newStatus
            )
        ) {
            setError(
                `Status "${newStatus}" tidak dapat dipilih dari status "${data.status}".`
            );

            return;
        }

        let title = "";
        let message = "";

        switch (newStatus) {
            case "Disetujui":
                title =
                    "Setujui Peminjaman";

                message =
                    `Apakah Anda yakin ingin menyetujui peminjaman #${data.id_peminjaman}?`;

                break;

            case "Ditolak":
                title =
                    "Tolak Peminjaman";

                message =
                    `Apakah Anda yakin ingin menolak peminjaman #${data.id_peminjaman}?`;

                break;

            case "Diproses":
                title =
                    "Proses Peminjaman";

                message =
                    `Apakah Anda yakin ingin memproses peminjaman #${data.id_peminjaman}?`;

                break;

            case "Dibatalkan":
                title =
                    "Batalkan Peminjaman";

                message =
                    `Apakah Anda yakin ingin membatalkan peminjaman #${data.id_peminjaman}?`;

                break;

            case "Selesai":
                title =
                    "Selesaikan Peminjaman";

                message =
                    `Apakah Anda yakin ingin menyelesaikan peminjaman #${data.id_peminjaman}?`;

                break;

            default:
                return;
        }

        setError("");

        setConfirmModal({
            open: true,
            newStatus,
            title,
            message,
        });
    };

    // ==================================================
    // TUTUP MODAL
    // ==================================================

    const closeConfirmModal = () => {
        if (updatingStatus) {
            return;
        }

        setConfirmModal({
            open: false,
            newStatus: "",
            title: "",
            message: "",
        });
    };

    // ==================================================
    // KONFIRMASI STATUS
    // ==================================================

    const confirmStatusChange =
        async () => {
            if (
                !confirmModal.open ||
                !confirmModal.newStatus ||
                updatingStatus
            ) {
                return;
            }

            const newStatus =
                confirmModal.newStatus;

            setConfirmModal({
                open: false,
                newStatus: "",
                title: "",
                message: "",
            });

            await updateStatus(
                newStatus
            );
        };

    // ==================================================
    // UPDATE STATUS
    // ==================================================

    const updateStatus = async (
        newStatus
    ) => {
        if (!data?.id_peminjaman) {
            return;
        }

        if (updatingStatus) {
            return;
        }

        const currentStatus =
            String(
                data.status || ""
            ).toLowerCase();

        const allowed =
            allowedTransitions[
                currentStatus
            ] || [];

        if (
            !allowed.includes(
                newStatus
            )
        ) {
            setError(
                `Status "${newStatus}" tidak dapat dipilih dari status "${data.status}".`
            );

            return;
        }

        try {
            setUpdatingStatus(true);
            setError("");
            setSuccess("");

            const response =
                await fetch(
                    `/peminjaman/${data.id_peminjaman}/status`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            status:
                                newStatus,
                        }),
                    }
                );

            const rawResponse =
                await response.text();

            let result = {};

            try {
                result =
                    rawResponse
                        ? JSON.parse(
                              rawResponse
                          )
                        : {};
            } catch {
                throw new Error(
                    "Server mengembalikan response yang bukan JSON."
                );
            }

            if (!response.ok) {
                throw new Error(
                    result.message ||
                        "Gagal mengubah status peminjaman."
                );
            }

            setSuccess(
                `Status peminjaman berhasil diubah menjadi "${newStatus}".`
            );

            await loadDetail();

            setTimeout(() => {
                setSuccess("");
            }, 3000);
        } catch (err) {
            console.error(
                "Update status error:",
                err
            );

            setError(
                err.message ||
                    "Gagal mengubah status peminjaman."
            );
        } finally {
            setUpdatingStatus(false);
        }
    };

    // ==================================================
    // TOMBOL AKSI STATUS
    // ==================================================

    const renderStatusActions =
        () => {
            if (!data?.status) {
                return null;
            }

            const status =
                String(
                    data.status
                ).toLowerCase();

            // ==============================================
            // MENUNGGU
            // ==============================================

            if (
                status ===
                "menunggu"
            ) {
                return (
                    <div className="grid sm:grid-cols-2 gap-3">

                        <button
                            type="button"
                            onClick={() =>
                                openConfirmModal(
                                    "Disetujui"
                                )
                            }
                            disabled={
                                updatingStatus
                            }
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                px-5
                                py-3
                                rounded-xl
                                bg-green-500
                                text-black
                                font-semibold
                                hover:bg-green-400
                                transition
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                            "
                        >
                            <FaCheck />

                            {updatingStatus
                                ? "Memproses..."
                                : "Setujui Peminjaman"}
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                openConfirmModal(
                                    "Ditolak"
                                )
                            }
                            disabled={
                                updatingStatus
                            }
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                px-5
                                py-3
                                rounded-xl
                                border
                                border-red-500/30
                                text-red-400
                                hover:bg-red-500/10
                                transition
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                            "
                        >
                            <FaTimes />

                            {updatingStatus
                                ? "Memproses..."
                                : "Tolak Peminjaman"}
                        </button>

                    </div>
                );
            }

            // ==============================================
            // DISETUJUI
            // ==============================================

            if (
                status ===
                "disetujui"
            ) {
                return (
                    <div className="grid sm:grid-cols-2 gap-3">

                        <button
                            type="button"
                            onClick={() =>
                                openConfirmModal(
                                    "Diproses"
                                )
                            }
                            disabled={
                                updatingStatus
                            }
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                px-5
                                py-3
                                rounded-xl
                                bg-[#D4AF37]
                                text-black
                                font-semibold
                                hover:brightness-110
                                transition
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                            "
                        >
                            <FaCog />

                            {updatingStatus
                                ? "Memproses..."
                                : "Proses Peminjaman"}
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                openConfirmModal(
                                    "Dibatalkan"
                                )
                            }
                            disabled={
                                updatingStatus
                            }
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                px-5
                                py-3
                                rounded-xl
                                border
                                border-gray-500/30
                                text-gray-400
                                hover:bg-white/5
                                transition
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                            "
                        >
                            <FaUndo />

                            {updatingStatus
                                ? "Memproses..."
                                : "Batalkan"}
                        </button>

                    </div>
                );
            }

            // ==============================================
            // DIPROSES
            // ==============================================

            if (
                status ===
                "diproses"
            ) {
                return (
                    <div
                        className="
                            rounded-xl
                            border
                            border-[#D4AF37]/20
                            bg-[#D4AF37]/5
                            px-5
                            py-4
                            text-sm
                            text-gray-400
                        "
                    >
                        Peminjaman sedang
                        diproses.

                        <br />

                        <span className="text-[#D4AF37]">
                            Selesaikan transaksi
                            melalui menu
                            Pengembalian
                            setelah kostum
                            diterima kembali.
                        </span>

                        <br />

                        <Link
                            to="/petugas/pengembalian"
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                mt-4
                                px-4
                                py-2
                                rounded-lg
                                bg-[#D4AF37]
                                text-black
                                font-semibold
                                text-xs
                            "
                        >
                            <FaUndo />
                            Buka Pengembalian
                        </Link>
                    </div>
                );
            }

            // ==============================================
            // SELESAI
            // ==============================================

            if (
                status ===
                "selesai"
            ) {
                return (
                    <div
                        className="
                            rounded-xl
                            border
                            border-green-500/20
                            bg-green-500/5
                            px-5
                            py-4
                            text-sm
                            text-green-400
                        "
                    >
                        Transaksi telah
                        selesai.
                    </div>
                );
            }

            // ==============================================
            // DITOLAK / DIBATALKAN
            // ==============================================

            return (
                <div
                    className="
                        rounded-xl
                        border
                        border-white/5
                        bg-white/[0.02]
                        px-5
                        py-4
                        text-sm
                        text-gray-500
                    "
                >
                    Tidak ada tindakan
                    status yang tersedia
                    untuk status{" "}
                    <span className="text-white">
                        {data.status}
                    </span>
                    .
                </div>
            );
        };

    // ==================================================
    // LOADING
    // ==================================================

    if (!user || loading) {
        return (
            <div
                className="
                    min-h-screen
                    bg-[#090909]
                    text-white
                    flex
                    items-center
                    justify-center
                "
            >
                <p className="text-[#D4AF37]">
                    Memuat detail
                    peminjaman...
                </p>
            </div>
        );
    }

    // ==================================================
    // ERROR
    // ==================================================

    if (error && !data) {
        return (
            <div
                className="
                    min-h-screen
                    bg-[#090909]
                    text-white
                    flex
                    items-center
                    justify-center
                    px-6
                "
            >
                <div
                    className="
                        max-w-xl
                        w-full
                        rounded-3xl
                        bg-[#141414]
                        border
                        border-red-500/20
                        p-10
                        text-center
                    "
                >
                    <FaClipboardList
                        className="
                            mx-auto
                            text-5xl
                            text-red-400
                            mb-5
                        "
                    />

                    <h1
                        className="
                            text-3xl
                            font-bold
                            text-red-400
                        "
                    >
                        Data Tidak
                        Ditemukan
                    </h1>

                    <p className="text-gray-500 mt-3">
                        {error}
                    </p>

                    <Link
                        to="/petugas/peminjaman"
                        className="
                            inline-block
                            mt-8
                            px-6
                            py-3
                            rounded-xl
                            bg-[#D4AF37]
                            text-black
                            font-semibold
                        "
                    >
                        Kembali ke
                        Peminjaman
                    </Link>
                </div>
            </div>
        );
    }

    // ==================================================
    // FOTO KOSTUM
    // ==================================================

    const imageUrl =
        getImageUrl(
            data?.foto
        );

    // ==================================================
    // BUKTI PEMBAYARAN
    // ==================================================

    const paymentProofUrl =
        getPaymentProofUrl(
            payment?.bukti_bayar
        );

    // ==================================================
    // RENDER
    // ==================================================

    return (
        <div
            className="
                min-h-screen
                bg-[#090909]
                text-white
            "
        >

            {/* ==================================================
                HEADER
            ================================================== */}

            <header
                className="
                    border-b
                    border-[#D4AF37]/20
                    bg-[#111111]
                "
            >
                <div
                    className="
                        max-w-7xl
                        mx-auto
                        px-6
                        py-6
                        flex
                        flex-col
                        md:flex-row
                        md:items-center
                        md:justify-between
                        gap-5
                    "
                >

                    <div>

                        <p
                            className="
                                uppercase
                                tracking-[4px]
                                text-[#D4AF37]
                                text-xs
                            "
                        >
                            Petugas Area
                        </p>

                        <h1
                            className="
                                text-3xl
                                font-bold
                                mt-2
                            "
                        >
                            Detail Peminjaman
                        </h1>

                        <p
                            className="
                                text-gray-500
                                mt-2
                            "
                        >
                            Informasi lengkap
                            transaksi
                            peminjaman.
                        </p>

                    </div>

                    <Link
                        to="/petugas/peminjaman"
                        className="
                            px-5
                            py-3
                            rounded-xl
                            border
                            border-[#D4AF37]/20
                            text-[#D4AF37]
                            hover:bg-[#D4AF37]/10
                            transition
                        "
                    >
                        Kembali
                    </Link>

                </div>
            </header>

            {/* ==================================================
                MAIN
            ================================================== */}

            <main
                className="
                    max-w-7xl
                    mx-auto
                    px-6
                    py-10
                "
            >

                {/* SUCCESS */}

                {success && (
                    <div
                        className="
                            mb-6
                            rounded-2xl
                            border
                            border-green-500/20
                            bg-green-500/10
                            text-green-400
                            px-5
                            py-4
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >
                            <FaCheck />

                            <span>
                                {success}
                            </span>
                        </div>
                    </div>
                )}

                {/* ERROR */}

                {error && data && (
                    <div
                        className="
                            mb-6
                            rounded-2xl
                            border
                            border-red-500/20
                            bg-red-500/10
                            text-red-400
                            px-5
                            py-4
                        "
                    >
                        {error}
                    </div>
                )}

                {/* ==================================================
                    STATUS HEADER
                ================================================== */}

                <section
                    className="
                        mb-7
                        rounded-3xl
                        bg-[#141414]
                        border
                        border-[#D4AF37]/15
                        p-7
                    "
                >
                    <div
                        className="
                            flex
                            flex-col
                            lg:flex-row
                            lg:items-center
                            lg:justify-between
                            gap-6
                        "
                    >

                        <div>

                            <p className="text-gray-500 text-sm">
                                ID Peminjaman
                            </p>

                            <h2
                                className="
                                    text-3xl
                                    font-bold
                                    mt-1
                                "
                            >
                                #
                                {
                                    data.id_peminjaman
                                }
                            </h2>

                        </div>

                        <div
                            className={`
                                inline-flex
                                items-center
                                gap-2
                                px-5
                                py-3
                                rounded-full
                                border
                                font-semibold
                                w-fit
                                ${getStatusClass(
                                    data.status
                                )}
                            `}
                        >
                            {getStatusIcon(
                                data.status
                            )}

                            {data.status ||
                                "-"}
                        </div>

                    </div>
                </section>

                {/* ==================================================
                    DETAIL USER + KOSTUM + PEMINJAMAN
                ================================================== */}

                <div
                    className="
                        grid
                        xl:grid-cols-3
                        gap-6
                    "
                >

                    {/* ==================================================
                        USER
                    ================================================== */}

                    <section
                        className="
                            rounded-3xl
                            bg-[#141414]
                            border
                            border-[#D4AF37]/15
                            p-7
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >

                            <div
                                className="
                                    w-11
                                    h-11
                                    rounded-xl
                                    bg-[#D4AF37]/10
                                    text-[#D4AF37]
                                    flex
                                    items-center
                                    justify-center
                                "
                            >
                                <FaUser />
                            </div>

                            <div>

                                <p className="text-gray-500 text-sm">
                                    Informasi
                                </p>

                                <h2 className="text-xl font-bold">
                                    Data User
                                </h2>

                            </div>

                        </div>

                        <div
                            className="
                                mt-8
                                space-y-6
                            "
                        >

                            <div>

                                <p className="text-gray-500 text-sm">
                                    Nama
                                </p>

                                <p className="font-semibold mt-1">
                                    {data.nama_user ||
                                        "-"}
                                </p>

                            </div>

                            <div
                                className="
                                    flex
                                    items-start
                                    gap-3
                                "
                            >

                                <FaEnvelope className="text-gray-500 mt-1" />

                                <div>

                                    <p className="text-gray-500 text-sm">
                                        Email
                                    </p>

                                    <p className="mt-1 break-all">
                                        {data.email_user ||
                                            "-"}
                                    </p>

                                </div>

                            </div>

                            <div
                                className="
                                    flex
                                    items-start
                                    gap-3
                                "
                            >

                                <FaPhone className="text-gray-500 mt-1" />

                                <div>

                                    <p className="text-gray-500 text-sm">
                                        No. HP
                                    </p>

                                    <p className="mt-1">
                                        {data.no_hp_user ||
                                            "-"}
                                    </p>

                                </div>

                            </div>

                            <div>

                                <p className="text-gray-500 text-sm">
                                    Alamat
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-gray-300
                                        leading-6
                                    "
                                >
                                    {data.alamat_user ||
                                        "-"}
                                </p>

                            </div>

                        </div>

                    </section>

                    {/* ==================================================
                        KOSTUM
                    ================================================== */}

                    <section
                        className="
                            rounded-3xl
                            bg-[#141414]
                            border
                            border-[#D4AF37]/15
                            p-7
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >

                            <div
                                className="
                                    w-11
                                    h-11
                                    rounded-xl
                                    bg-[#D4AF37]/10
                                    text-[#D4AF37]
                                    flex
                                    items-center
                                    justify-center
                                "
                            >
                                <FaTshirt />
                            </div>

                            <div>

                                <p className="text-gray-500 text-sm">
                                    Item
                                </p>

                                <h2 className="text-xl font-bold">
                                    Kostum
                                </h2>

                            </div>

                        </div>

                        {/* FOTO KOSTUM */}

                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={
                                    data.nama_kostum ||
                                    "Kostum"
                                }
                                className="
                                    w-full
                                    h-64
                                    rounded-2xl
                                    object-cover
                                    object-top
                                    mt-6
                                    bg-[#1D1D1D]
                                "
                                onError={(e) => {
                                    e.currentTarget.style.display =
                                        "none";

                                    const fallback =
                                        e.currentTarget
                                            .parentElement
                                            ?.querySelector(
                                                ".kostum-image-fallback"
                                            );

                                    if (
                                        fallback
                                    ) {
                                        fallback.style.display =
                                            "flex";
                                    }
                                }}
                            />
                        ) : null}

                        <div
                            className={`
                                kostum-image-fallback
                                ${
                                    imageUrl
                                        ? "hidden"
                                        : "flex"
                                }
                                w-full
                                h-64
                                rounded-2xl
                                bg-[#1D1D1D]
                                mt-6
                                items-center
                                justify-center
                            `}
                        >

                            <div className="text-center">

                                <FaImage
                                    className="
                                        mx-auto
                                        text-4xl
                                        text-gray-600
                                    "
                                />

                                <p className="text-gray-600 text-sm mt-3">
                                    Foto kostum
                                    belum tersedia
                                </p>

                            </div>

                        </div>

                        <div
                            className="
                                mt-6
                                space-y-5
                            "
                        >

                            <div>

                                <p className="text-gray-500 text-sm">
                                    Nama Kostum
                                </p>

                                <p
                                    className="
                                        text-xl
                                        font-bold
                                        mt-1
                                    "
                                >
                                    {data.nama_kostum ||
                                        "-"}
                                </p>

                            </div>

                            <div>

                                <p className="text-gray-500 text-sm">
                                    Kode Koleksi
                                </p>

                                <p
                                    className="
                                        text-[#D4AF37]
                                        font-semibold
                                        mt-1
                                    "
                                >
                                    {data.kode_koleksi ||
                                        "-"}
                                </p>

                            </div>

                            <div>

                                <p className="text-gray-500 text-sm">
                                    Warna
                                </p>

                                <p className="mt-1">
                                    {data.warna ||
                                        "-"}
                                </p>

                            </div>

                            <div>

                                <p className="text-gray-500 text-sm">
                                    Ukuran
                                </p>

                                <p className="mt-1">
                                    {data.ukuran ||
                                        "-"}
                                </p>

                            </div>

                            <div>

                                <p className="text-gray-500 text-sm">
                                    Jumlah
                                </p>

                                <p className="mt-1">
                                    {data.jumlah ??
                                        0}
                                </p>

                            </div>

                        </div>

                    </section>

                    {/* ==================================================
                        PEMINJAMAN
                    ================================================== */}

                    <section
                        className="
                            rounded-3xl
                            bg-[#141414]
                            border
                            border-[#D4AF37]/15
                            p-7
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >

                            <div
                                className="
                                    w-11
                                    h-11
                                    rounded-xl
                                    bg-[#D4AF37]/10
                                    text-[#D4AF37]
                                    flex
                                    items-center
                                    justify-center
                                "
                            >
                                <FaClipboardList />
                            </div>

                            <div>

                                <p className="text-gray-500 text-sm">
                                    Transaksi
                                </p>

                                <h2 className="text-xl font-bold">
                                    Peminjaman
                                </h2>

                            </div>

                        </div>

                        <div
                            className="
                                mt-8
                                space-y-6
                            "
                        >

                            <div>

                                <p className="text-gray-500 text-sm">
                                    ID Peminjaman
                                </p>

                                <p
                                    className="
                                        text-[#D4AF37]
                                        font-bold
                                        mt-1
                                    "
                                >
                                    #
                                    {
                                        data.id_peminjaman
                                    }
                                </p>

                            </div>

                            <div>

                                <p className="text-gray-500 text-sm">
                                    Status
                                </p>

                                <span
                                    className={`
                                        inline-flex
                                        items-center
                                        gap-2
                                        mt-2
                                        px-3
                                        py-1.5
                                        rounded-full
                                        border
                                        text-sm
                                        font-semibold
                                        ${getStatusClass(
                                            data.status
                                        )}
                                    `}
                                >
                                    {getStatusIcon(
                                        data.status
                                    )}

                                    {data.status ||
                                        "-"}
                                </span>

                            </div>

                            <div
                                className="
                                    flex
                                    items-start
                                    gap-3
                                "
                            >

                                <FaCalendarAlt className="text-gray-500 mt-1" />

                                <div>

                                    <p className="text-gray-500 text-sm">
                                        Tanggal
                                        Peminjaman
                                    </p>

                                    <p className="mt-1">
                                        {formatTanggal(
                                            data.tanggal_peminjaman
                                        )}
                                    </p>

                                </div>

                            </div>

                            <div
                                className="
                                    flex
                                    items-start
                                    gap-3
                                "
                            >

                                <FaCalendarAlt className="text-gray-500 mt-1" />

                                <div>

                                    <p className="text-gray-500 text-sm">
                                        Tanggal
                                        Kembali
                                    </p>

                                    <p className="mt-1">
                                        {formatTanggal(
                                            data.tanggal_kembali
                                        )}
                                    </p>

                                </div>

                            </div>

                            <div>

                                <p className="text-gray-500 text-sm">
                                    Harga
                                </p>

                                <p
                                    className="
                                        text-[#D4AF37]
                                        font-semibold
                                        mt-1
                                    "
                                >
                                    {formatRupiah(
                                        data.harga
                                    )}
                                </p>

                            </div>

                            <div>

                                <p className="text-gray-500 text-sm">
                                    Subtotal
                                </p>

                                <p
                                    className="
                                        text-[#D4AF37]
                                        font-semibold
                                        mt-1
                                    "
                                >
                                    {formatRupiah(
                                        data.subtotal
                                    )}
                                </p>

                            </div>

                        </div>

                        <div
                            className="
                                mt-8
                                pt-6
                                border-t
                                border-white/5
                            "
                        >

                            <p className="text-gray-500 text-sm">
                                Total Peminjaman
                            </p>

                            <p
                                className="
                                    text-3xl
                                    font-bold
                                    text-[#D4AF37]
                                    mt-2
                                "
                            >
                                {formatRupiah(
                                    data.total_harga
                                )}
                            </p>

                        </div>

                    </section>

                </div>

                {/* ==================================================
                    PEMBAYARAN
                ================================================== */}

                <section
                    className="
                        mt-7
                        rounded-3xl
                        bg-[#141414]
                        border
                        border-[#D4AF37]/15
                        p-7
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <div
                            className="
                                w-11
                                h-11
                                rounded-xl
                                bg-[#D4AF37]/10
                                text-[#D4AF37]
                                flex
                                items-center
                                justify-center
                            "
                        >
                            <FaMoneyBillWave />
                        </div>

                        <div>

                            <p className="text-gray-500 text-sm">
                                Transaksi
                            </p>

                            <h2 className="text-xl font-bold">
                                Informasi Pembayaran
                            </h2>

                        </div>

                    </div>

                    {/* ==================================================
                        STATUS PEMBAYARAN
                    ================================================== */}

                    <div
                        className="
                            mt-7
                            rounded-2xl
                            border
                            p-5
                            ${paymentInfo.className}
                        "
                    >
                        <div
                            className="
                                flex
                                flex-col
                                md:flex-row
                                md:items-center
                                md:justify-between
                                gap-4
                            "
                        >

                            <div>

                                <p className="text-gray-500 text-sm">
                                    Status Pembayaran
                                </p>

                                <div
                                    className={`
                                        inline-flex
                                        items-center
                                        gap-2
                                        mt-2
                                        px-4
                                        py-2
                                        rounded-full
                                        border
                                        text-sm
                                        font-semibold
                                        ${paymentInfo.className}
                                    `}
                                >
                                    {paymentInfo.percentage ===
                                    100 ? (
                                        <FaCheck />
                                    ) : paymentInfo.percentage >
                                      0 ? (
                                        <FaMoneyBillWave />
                                    ) : (
                                        <FaTimes />
                                    )}

                                    {paymentInfo.label}
                                </div>

                                <p className="text-gray-500 text-sm mt-3">
                                    {paymentInfo.description}
                                </p>

                            </div>

                            <div className="text-left md:text-right">

                                <p className="text-gray-500 text-sm">
                                    Persentase
                                </p>

                                <p className="text-3xl font-bold text-[#D4AF37] mt-1">
                                    {
                                        paymentInfo.percentage
                                    }
                                    %
                                </p>

                            </div>

                        </div>

                        {/* PROGRESS */}

                        <div className="mt-5">

                            <div className="h-2 rounded-full bg-white/5 overflow-hidden">

                                <div
                                    className="
                                        h-full
                                        bg-[#D4AF37]
                                        rounded-full
                                        transition-all
                                    "
                                    style={{
                                        width: `${Math.min(
                                            paymentInfo.percentage,
                                            100
                                        )}%`,
                                    }}
                                />

                            </div>

                        </div>

                    </div>

                    {/* ==================================================
                        RINGKASAN NOMINAL
                    ================================================== */}

                    <div
                        className="
                            mt-6
                            grid
                            md:grid-cols-3
                            gap-4
                        "
                    >

                        <div
                            className="
                                rounded-2xl
                                bg-[#1D1D1D]
                                border
                                border-white/5
                                p-5
                            "
                        >

                            <p className="text-gray-500 text-sm">
                                Total Peminjaman
                            </p>

                            <p className="text-xl font-bold text-white mt-2">
                                {formatRupiah(
                                    data.total_harga
                                )}
                            </p>

                        </div>

                        <div
                            className="
                                rounded-2xl
                                bg-[#1D1D1D]
                                border
                                border-green-500/10
                                p-5
                            "
                        >

                            <p className="text-gray-500 text-sm">
                                Sudah Dibayar
                            </p>

                            <p className="text-xl font-bold text-green-400 mt-2">
                                {formatRupiah(
                                    paymentInfo.totalDibayar
                                )}
                            </p>

                        </div>

                        <div
                            className="
                                rounded-2xl
                                bg-[#1D1D1D]
                                border
                                border-yellow-500/10
                                p-5
                            "
                        >

                            <p className="text-gray-500 text-sm">
                                Sisa Pembayaran
                            </p>

                            <p className="text-xl font-bold text-yellow-400 mt-2">
                                {formatRupiah(
                                    paymentInfo.sisaPembayaran
                                )}
                            </p>

                        </div>

                    </div>

                    {/* ==================================================
                        DETAIL PEMBAYARAN
                    ================================================== */}

                    <div
                        className="
                            mt-6
                            grid
                            md:grid-cols-2
                            gap-6
                        "
                    >

                        <div
                            className="
                                rounded-2xl
                                bg-[#1D1D1D]
                                border
                                border-white/5
                                p-5
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    mb-5
                                "
                            >

                                <FaCreditCard className="text-[#D4AF37]" />

                                <h3 className="font-semibold">
                                    Detail Transaksi
                                </h3>

                            </div>

                            <div className="space-y-5">

                                <div>

                                    <p className="text-gray-500 text-sm">
                                        Metode Pembayaran
                                    </p>

                                    <p className="text-white font-semibold mt-1">
                                        {payment?.metode ||
                                            "-"}
                                    </p>

                                </div>

                                <div>

                                    <p className="text-gray-500 text-sm">
                                        Nominal Pembayaran
                                    </p>

                                    <p className="text-[#D4AF37] font-semibold mt-1">
                                        {formatRupiah(
                                            paymentInfo.totalDibayar
                                        )}
                                    </p>

                                </div>

                                <div>

                                    <p className="text-gray-500 text-sm">
                                        Tanggal Pembayaran
                                    </p>

                                    <p className="text-white mt-1">
                                        {payment?.tanggal_bayar
                                            ? formatTanggal(
                                                  payment.tanggal_bayar
                                              )
                                            : "-"}
                                    </p>

                                </div>

                                <div>

                                    <p className="text-gray-500 text-sm">
                                        Status Data Pembayaran
                                    </p>

                                    <p className="text-white mt-1">
                                        {payment?.status ||
                                            "-"}
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* ==================================================
                            BUKTI PEMBAYARAN
                        ================================================== */}

                        <div
                            className="
                                rounded-2xl
                                bg-[#1D1D1D]
                                border
                                border-white/5
                                p-5
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    mb-5
                                "
                            >

                                <FaReceipt className="text-[#D4AF37]" />

                                <h3 className="font-semibold">
                                    Bukti Pembayaran
                                </h3>

                            </div>

                            {paymentProofUrl ? (
                                <div>

                                    <div
                                        className="
                                            rounded-2xl
                                            overflow-hidden
                                            border
                                            border-white/10
                                            bg-[#141414]
                                        "
                                    >

                                        <img
                                            src={
                                                paymentProofUrl
                                            }
                                            alt="Bukti pembayaran"
                                            className="
                                                w-full
                                                max-h-[420px]
                                                object-contain
                                                bg-[#0d0d0d]
                                            "
                                            onError={(
                                                e
                                            ) => {
                                                e.currentTarget.style.display =
                                                    "none";

                                                const parent =
                                                    e.currentTarget
                                                        .parentElement;

                                                const fallback =
                                                    parent?.querySelector(
                                                        ".payment-proof-error"
                                                    );

                                                if (
                                                    fallback
                                                ) {
                                                    fallback.style.display =
                                                        "flex";
                                                }
                                            }}
                                        />

                                        <div
                                            className="
                                                payment-proof-error
                                                hidden
                                                min-h-[220px]
                                                items-center
                                                justify-center
                                                text-center
                                                p-6
                                            "
                                        >

                                            <div>

                                                <FaImage
                                                    className="
                                                        mx-auto
                                                        text-4xl
                                                        text-gray-600
                                                    "
                                                />

                                                <p className="text-gray-500 text-sm mt-3">
                                                    Bukti pembayaran
                                                    tidak dapat
                                                    ditampilkan.
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                    <a
                                        href={
                                            paymentProofUrl
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="
                                            inline-flex
                                            items-center
                                            justify-center
                                            gap-2
                                            w-full
                                            mt-4
                                            px-5
                                            py-3
                                            rounded-xl
                                            bg-[#D4AF37]
                                            text-black
                                            font-semibold
                                            hover:brightness-110
                                            transition
                                        "
                                    >
                                        <FaExternalLinkAlt />

                                        Lihat Bukti
                                        Pembayaran
                                    </a>

                                </div>
                            ) : (
                                <div
                                    className="
                                        min-h-[220px]
                                        rounded-2xl
                                        border
                                        border-white/5
                                        bg-[#141414]
                                        flex
                                        items-center
                                        justify-center
                                        text-center
                                        p-6
                                    "
                                >

                                    <div>

                                        <FaImage
                                            className="
                                                mx-auto
                                                text-4xl
                                                text-gray-600
                                            "
                                        />

                                        <p className="text-gray-500 text-sm mt-3">
                                            Belum ada bukti
                                            pembayaran yang
                                            tercatat.
                                        </p>

                                        {payment?.metode ===
                                            "Cash" && (
                                            <p className="text-gray-600 text-xs mt-2">
                                                Pembayaran Cash
                                                tidak memerlukan
                                                unggahan bukti.
                                            </p>
                                        )}

                                    </div>

                                </div>
                            )}

                        </div>

                    </div>

                </section>

                {/* ==================================================
                    AKSI STATUS
                ================================================== */}

                <section
                    className="
                        mt-7
                        rounded-3xl
                        bg-[#141414]
                        border
                        border-[#D4AF37]/15
                        p-7
                    "
                >

                    <div className="mb-6">

                        <p
                            className="
                                text-[#D4AF37]
                                text-xs
                                uppercase
                                tracking-[4px]
                            "
                        >
                            Status Management
                        </p>

                        <h2
                            className="
                                text-2xl
                                font-bold
                                mt-2
                            "
                        >
                            Tindakan Peminjaman
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Perbarui status transaksi
                            sesuai proses peminjaman.
                        </p>

                    </div>

                    {renderStatusActions()}

                </section>

                {/* ==================================================
                    BACK
                ================================================== */}

                <div className="mt-7">

                    <Link
                        to="/petugas/peminjaman"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            text-gray-500
                            hover:text-[#D4AF37]
                            transition
                        "
                    >
                        <FaArrowLeft />

                        Kembali ke Daftar
                        Peminjaman
                    </Link>

                </div>

            </main>

            {/* ==================================================
                MODAL KONFIRMASI
            ================================================== */}

            {confirmModal.open && (
                <div
                    className="
                        fixed
                        inset-0
                        z-[9999]
                        flex
                        items-center
                        justify-center
                        p-5
                        bg-black/70
                        backdrop-blur-sm
                    "
                    onClick={
                        closeConfirmModal
                    }
                >

                    <div
                        className="
                            w-full
                            max-w-md
                            rounded-3xl
                            bg-[#141414]
                            border
                            border-[#D4AF37]/20
                            shadow-2xl
                            shadow-black/50
                            p-7
                        "
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* ICON */}

                        <div
                            className={`
                                w-14
                                h-14
                                rounded-2xl
                                flex
                                items-center
                                justify-center
                                mb-5
                                text-xl
                                ${
                                    confirmModal.newStatus ===
                                        "Ditolak" ||
                                    confirmModal.newStatus ===
                                        "Dibatalkan"
                                        ? `
                                            bg-red-500/10
                                            border
                                            border-red-500/20
                                            text-red-400
                                        `
                                        : `
                                            bg-[#D4AF37]/10
                                            border
                                            border-[#D4AF37]/20
                                            text-[#D4AF37]
                                        `
                                }
                            `}
                        >
                            {confirmModal.newStatus ===
                                "Ditolak" ||
                            confirmModal.newStatus ===
                                "Dibatalkan" ? (
                                <FaTimes />
                            ) : (
                                <FaCog />
                            )}
                        </div>

                        {/* TITLE */}

                        <h2
                            className="
                                text-2xl
                                font-bold
                                text-white
                            "
                        >
                            {
                                confirmModal.title
                            }
                        </h2>

                        {/* MESSAGE */}

                        <p
                            className="
                                text-gray-400
                                mt-3
                                leading-6
                            "
                        >
                            {
                                confirmModal.message
                            }
                        </p>

                        {/* DETAIL */}

                        <div
                            className="
                                mt-5
                                rounded-2xl
                                bg-[#1D1D1D]
                                border
                                border-white/5
                                p-4
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    uppercase
                                    tracking-[2px]
                                    text-gray-500
                                "
                            >
                                Detail Peminjaman
                            </p>

                            <div className="mt-3">

                                <p
                                    className="
                                        text-white
                                        font-semibold
                                    "
                                >
                                    Peminjaman #
                                    {
                                        data?.id_peminjaman
                                    }
                                </p>

                                <p
                                    className="
                                        text-gray-500
                                        text-sm
                                        mt-1
                                    "
                                >
                                    {
                                        data?.nama_user ||
                                        "Pelanggan"
                                    }
                                </p>

                                <p
                                    className="
                                        text-[#D4AF37]
                                        text-sm
                                        mt-1
                                    "
                                >
                                    {
                                        data?.nama_kostum ||
                                        "Kostum"
                                    }
                                </p>

                            </div>

                        </div>

                        {/* BUTTON */}

                        <div
                            className="
                                flex
                                gap-3
                                mt-7
                            "
                        >

                            {/* BATAL */}

                            <button
                                type="button"
                                onClick={
                                    closeConfirmModal
                                }
                                disabled={
                                    updatingStatus
                                }
                                className="
                                    flex-1
                                    px-5
                                    py-3
                                    rounded-xl
                                    border
                                    border-white/10
                                    text-gray-400
                                    font-semibold
                                    hover:bg-white/5
                                    hover:text-white
                                    transition
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                "
                            >
                                Batal
                            </button>

                            {/* KONFIRMASI */}

                            <button
                                type="button"
                                onClick={
                                    confirmStatusChange
                                }
                                disabled={
                                    updatingStatus
                                }
                                className={`
                                    flex-1
                                    px-5
                                    py-3
                                    rounded-xl
                                    font-semibold
                                    transition
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed

                                    ${
                                        confirmModal.newStatus ===
                                            "Ditolak" ||
                                        confirmModal.newStatus ===
                                            "Dibatalkan"
                                            ? `
                                                bg-red-500
                                                text-white
                                                hover:bg-red-400
                                            `
                                            : `
                                                bg-[#D4AF37]
                                                text-black
                                                hover:bg-[#e2bd43]
                                            `
                                    }
                                `}
                            >
                                {updatingStatus
                                    ? "Memproses..."
                                    : confirmModal.newStatus ===
                                      "Dibatalkan"
                                    ? "Ya, Batalkan"
                                    : confirmModal.newStatus ===
                                      "Ditolak"
                                    ? "Ya, Tolak"
                                    : confirmModal.newStatus ===
                                      "Diproses"
                                    ? "Ya, Proses"
                                    : confirmModal.newStatus ===
                                      "Disetujui"
                                    ? "Ya, Setujui"
                                    : "Konfirmasi"}
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default PeminjamanDetailPetugas;