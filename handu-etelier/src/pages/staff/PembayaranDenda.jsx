import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    FaArrowLeft,
    FaCheck,
    FaClock,
    FaEye,
    FaMoneyBillWave,
    FaSearch,
    FaSyncAlt,
    FaTimes,
    FaExclamationTriangle,
} from "react-icons/fa";

function PembayaranDenda() {
    const navigate = useNavigate();

    // ==================================================
    // SESSION
    // ==================================================

    const [user, setUser] = useState(null);

    // ==================================================
    // DATA
    // ==================================================

    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    // ==================================================
    // UI
    // ==================================================

    const [updatingId, setUpdatingId] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [search, setSearch] = useState("");

    // ==================================================
    // MODAL BUKTI
    // ==================================================

    const [selectedProof, setSelectedProof] = useState(null);

    // ==================================================
    // HELPER RESPONSE
    // ==================================================

    const parseResponse = async (response) => {
        const raw = await response.text();

        if (!raw) {
            return {};
        }

        try {
            return JSON.parse(raw);
        } catch {
            throw new Error(
                "Server mengembalikan response yang bukan JSON."
            );
        }
    };

    // ==================================================
    // FORMAT RUPIAH
    // ==================================================

    const formatRupiah = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(Number(value) || 0);
    };

    // ==================================================
    // FORMAT TANGGAL
    // ==================================================

    const formatTanggal = (value) => {
        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return String(value);
        }

        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const formatTanggalWaktu = (value) => {
        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return String(value);
        }

        return date.toLocaleString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // ==================================================
    // FORMAT METODE
    // ==================================================

    const formatMetode = (method) => {
        const value = String(method || "").trim();

        if (!value) {
            return "-";
        }

        if (value.toLowerCase() === "transfer") {
            return "Transfer Bank";
        }

        return value;
    };

    // ==================================================
    // URL BUKTI PEMBAYARAN DENDA
    // ==================================================

    const getProofUrl = (bukti) => {
        if (!bukti) {
            return "";
        }

        const value = String(bukti).trim();

        if (!value) {
            return "";
        }

        // Base64 / Data URL
        if (
            value.startsWith("data:image/") ||
            value.startsWith("data:application/pdf")
        ) {
            return value;
        }

        // URL penuh
        if (
            value.startsWith("http://") ||
            value.startsWith("https://")
        ) {
            return value;
        }

        // Sudah /uploads/...
        if (value.startsWith("/uploads/")) {
            return value;
        }

        // uploads/...
        if (value.startsWith("uploads/")) {
            return `/${value}`;
        }

        // Nama file saja
        return `/uploads/pembayaran-denda/${value}`;
    };

    // ==================================================
    // CEK PDF
    // ==================================================

    const isPdfProof = (bukti) => {
        if (!bukti) {
            return false;
        }

        const value = String(bukti).toLowerCase();

        return (
            value.includes(".pdf") ||
            value.startsWith("data:application/pdf")
        );
    };

    // ==================================================
    // NORMALIZE STATUS
    // ==================================================

    const getStatus = (item) => {
        return String(item?.status || "Belum Bayar").trim();
    };

    // ==================================================
    // CEK SESSION PETUGAS
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

            if (
                !parsedUser?.id_user ||
                Number(parsedUser.id_role) !== 2
            ) {
                navigate("/dashboard", {
                    replace: true,
                });

                return;
            }

            setUser(parsedUser);
        } catch (err) {
            console.error("Session error:", err);

            localStorage.removeItem("user");
            localStorage.removeItem("isLoggedIn");

            navigate("/login", {
                replace: true,
            });
        }
    }, [navigate]);

    // ==================================================
    // LOAD PEMBAYARAN DENDA
    // ==================================================

    const loadPayments = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "/pembayaran-denda"
            );

            const result = await parseResponse(response);

            if (!response.ok) {
                throw new Error(
                    result.message ||
                        "Gagal mengambil data pembayaran denda."
                );
            }

            const rows = Array.isArray(result)
                ? result
                : result.data;

            if (!Array.isArray(rows)) {
                throw new Error(
                    "Format data pembayaran denda tidak sesuai."
                );
            }

            setPayments(rows);
        } catch (err) {
            console.error(
                "Load pembayaran denda:",
                err
            );

            setError(
                err.message ||
                    "Gagal mengambil data pembayaran denda."
            );
        } finally {
            setLoading(false);
        }
    };

    // ==================================================
    // LOAD AWAL
    // ==================================================

    useEffect(() => {
        if (!user) {
            return;
        }

        loadPayments();
    }, [user]);

    // ==================================================
    // REFRESH
    // ==================================================

    const handleRefresh = async () => {
        setError("");
        setSuccess("");

        await loadPayments();
    };

    // ==================================================
    // BUKA BUKTI
    // ==================================================

    const openProof = (item) => {
        if (!item?.bukti_bayar) {
            setError(
                "Pembayaran denda ini tidak memiliki bukti pembayaran."
            );

            return;
        }

        setSelectedProof(item);

        setError("");
        setSuccess("");
    };

    // ==================================================
    // TUTUP BUKTI
    // ==================================================

    const closeProof = () => {
        setSelectedProof(null);
    };

    // ==================================================
    // VERIFIKASI PEMBAYARAN DENDA
    // ==================================================

    const verifyPayment = async (
        item,
        askConfirmation = true
    ) => {
        if (!item) {
            return false;
        }

        const status = getStatus(item);

        if (status === "Lunas") {
            setSuccess(
                `Pembayaran denda #${item.id_pembayaran_denda} sudah berstatus Lunas.`
            );

            return false;
        }

        if (status !== "Menunggu Verifikasi") {
            setError(
                `Pembayaran denda #${item.id_pembayaran_denda} belum berada pada status Menunggu Verifikasi.`
            );

            return false;
        }

        if (askConfirmation) {
            const confirmed = window.confirm(
                `Verifikasi pembayaran denda #${item.id_pembayaran_denda} sebesar ${formatRupiah(
                    item.jumlah
                )} dan tandai sebagai Lunas?`
            );

            if (!confirmed) {
                return false;
            }
        }

        try {
            setUpdatingId(
                item.id_pembayaran_denda
            );

            setError("");
            setSuccess("");

            const response = await fetch(
                `/pembayaran-denda/${item.id_pembayaran_denda}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        status: "Lunas",
                        diverifikasi_oleh:
                            user?.id_user,
                    }),
                }
            );

            const result =
                await parseResponse(response);

            if (!response.ok) {
                throw new Error(
                    result.message ||
                        "Gagal memverifikasi pembayaran denda."
                );
            }

            setSuccess(
                `Pembayaran denda #${item.id_pembayaran_denda} berhasil diverifikasi dan berstatus Lunas.`
            );

            await loadPayments();

            return true;
        } catch (err) {
            console.error(
                "Verifikasi pembayaran denda:",
                err
            );

            setError(
                err.message ||
                    "Gagal memverifikasi pembayaran denda."
            );

            return false;
        } finally {
            setUpdatingId(null);
        }
    };

    // ==================================================
    // SEARCH
    // ==================================================

    const filteredPayments = useMemo(() => {
        const keyword = search
            .trim()
            .toLowerCase();

        if (!keyword) {
            return payments;
        }

        return payments.filter((item) => {
            return (
                String(
                    item.id_pembayaran_denda || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||

                String(
                    item.id_denda || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||

                String(
                    item.id_peminjaman || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||

                String(
                    item.nama_user || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||

                String(
                    item.email_user || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||

                String(
                    item.metode || ""
                )
                    .toLowerCase()
                    .includes(keyword) ||

                String(
                    item.status || ""
                )
                    .toLowerCase()
                    .includes(keyword)
            );
        });
    }, [payments, search]);

    // ==================================================
    // SUMMARY
    // ==================================================

    const totalPayments = payments.length;

    const totalMenungguVerifikasi =
        payments.filter(
            (item) =>
                getStatus(item) ===
                "Menunggu Verifikasi"
        ).length;

    const totalLunas = payments.filter(
        (item) =>
            getStatus(item) === "Lunas"
    ).length;

    const totalBelumBayar = payments.filter(
        (item) =>
            getStatus(item) === "Belum Bayar"
    ).length;

    const nominalLunas = payments
        .filter(
            (item) =>
                getStatus(item) === "Lunas"
        )
        .reduce(
            (total, item) =>
                total +
                (Number(item.jumlah) || 0),
            0
        );

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
                <p
                    className="
                        text-[#D4AF37]
                        tracking-[3px]
                        uppercase
                        text-sm
                    "
                >
                    Memuat pembayaran denda...
                </p>
            </div>
        );
    }

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
                    bg-[#111111]
                    border-b
                    border-[#D4AF37]/20
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
                        gap-4
                    "
                >
                    <div>
                        <p
                            className="
                                text-[#D4AF37]
                                text-xs
                                uppercase
                                tracking-[4px]
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
                            Pembayaran Denda
                        </h1>

                        <p
                            className="
                                text-gray-500
                                mt-2
                            "
                        >
                            Verifikasi pembayaran denda
                            yang dikirim customer.
                        </p>
                    </div>

                    <div
                        className="
                            flex
                            flex-wrap
                            gap-3
                        "
                    >
                        <Link
                            to="/petugas/dashboard"
                            className="
                                px-5
                                py-3
                                rounded-xl
                                border
                                border-[#D4AF37]/20
                                text-[#D4AF37]
                                hover:bg-[#D4AF37]/10
                                transition
                                flex
                                items-center
                                gap-2
                            "
                        >
                            <FaArrowLeft />
                            Dashboard
                        </Link>

                        <button
                            type="button"
                            onClick={handleRefresh}
                            className="
                                px-5
                                py-3
                                rounded-xl
                                border
                                border-white/10
                                text-gray-300
                                hover:bg-white/5
                                transition
                                flex
                                items-center
                                gap-2
                            "
                        >
                            <FaSyncAlt />
                            Refresh
                        </button>
                    </div>
                </div>
            </header>

            <main
                className="
                    max-w-7xl
                    mx-auto
                    px-6
                    py-10
                "
            >
                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (
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
                            flex
                            items-center
                            justify-between
                            gap-4
                        "
                    >
                        <span>
                            {error}
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                setError("")
                            }
                            className="
                                text-red-400
                                hover:text-white
                            "
                        >
                            <FaTimes />
                        </button>
                    </div>
                )}

                {/* ==================================================
                    SUCCESS
                ================================================== */}

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
                        {success}
                    </div>
                )}

                {/* ==================================================
                    SUMMARY
                ================================================== */}

                <section
                    className="
                        grid
                        md:grid-cols-2
                        xl:grid-cols-5
                        gap-4
                        mb-7
                    "
                >
                    {/* TOTAL */}

                    <div
                        className="
                            rounded-2xl
                            bg-[#141414]
                            border
                            border-[#D4AF37]/15
                            p-5
                        "
                    >
                        <p className="text-gray-500 text-sm">
                            Total Pembayaran
                        </p>

                        <p
                            className="
                                text-3xl
                                font-bold
                                text-[#D4AF37]
                                mt-2
                            "
                        >
                            {totalPayments}
                        </p>
                    </div>

                    {/* MENUNGGU */}

                    <div
                        className="
                            rounded-2xl
                            bg-[#141414]
                            border
                            border-yellow-500/15
                            p-5
                        "
                    >
                        <p className="text-gray-500 text-sm">
                            Menunggu Verifikasi
                        </p>

                        <p
                            className="
                                text-3xl
                                font-bold
                                text-yellow-400
                                mt-2
                            "
                        >
                            {totalMenungguVerifikasi}
                        </p>
                    </div>

                    {/* LUNAS */}

                    <div
                        className="
                            rounded-2xl
                            bg-[#141414]
                            border
                            border-green-500/15
                            p-5
                        "
                    >
                        <p className="text-gray-500 text-sm">
                            Lunas
                        </p>

                        <p
                            className="
                                text-3xl
                                font-bold
                                text-green-400
                                mt-2
                            "
                        >
                            {totalLunas}
                        </p>
                    </div>

                    {/* BELUM BAYAR */}

                    <div
                        className="
                            rounded-2xl
                            bg-[#141414]
                            border
                            border-red-500/15
                            p-5
                        "
                    >
                        <p className="text-gray-500 text-sm">
                            Belum Bayar
                        </p>

                        <p
                            className="
                                text-3xl
                                font-bold
                                text-red-400
                                mt-2
                            "
                        >
                            {totalBelumBayar}
                        </p>
                    </div>

                    {/* NOMINAL */}

                    <div
                        className="
                            rounded-2xl
                            bg-[#141414]
                            border
                            border-purple-500/15
                            p-5
                        "
                    >
                        <p className="text-gray-500 text-sm">
                            Nominal Denda Lunas
                        </p>

                        <p
                            className="
                                text-xl
                                font-bold
                                text-purple-400
                                mt-2
                            "
                        >
                            {formatRupiah(
                                nominalLunas
                            )}
                        </p>
                    </div>
                </section>

                {/* ==================================================
                    INFO
                ================================================== */}

                <section
                    className="
                        rounded-2xl
                        border
                        border-[#D4AF37]/10
                        bg-[#141414]
                        px-5
                        py-4
                        mb-7
                    "
                >
                    <div
                        className="
                            flex
                            items-start
                            gap-3
                        "
                    >
                        <div
                            className="
                                mt-1
                                text-[#D4AF37]
                            "
                        >
                            <FaMoneyBillWave />
                        </div>

                        <div>
                            <p
                                className="
                                    font-semibold
                                "
                            >
                                Alur pembayaran denda
                            </p>

                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                    mt-1
                                "
                            >
                                Customer melakukan pembayaran
                                denda melalui halaman detail
                                peminjaman. Petugas memeriksa
                                bukti pembayaran dan mengubah
                                status menjadi Lunas setelah
                                pembayaran dinyatakan sesuai.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ==================================================
                    SEARCH
                ================================================== */}

                <section
                    className="
                        rounded-3xl
                        bg-[#141414]
                        border
                        border-[#D4AF37]/15
                        p-5
                        mb-7
                    "
                >
                    <div className="relative">
                        <FaSearch
                            className="
                                absolute
                                left-4
                                top-1/2
                                -translate-y-1/2
                                text-gray-500
                            "
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="Cari ID pembayaran denda, ID denda, ID peminjaman, nama customer, atau metode..."
                            className="
                                w-full
                                pl-11
                                pr-4
                                py-3.5
                                rounded-xl
                                bg-[#1D1D1D]
                                border
                                border-white/10
                                outline-none
                                focus:border-[#D4AF37]
                            "
                        />
                    </div>
                </section>

                {/* ==================================================
                    TABLE
                ================================================== */}

                <section
                    className="
                        rounded-3xl
                        bg-[#141414]
                        border
                        border-[#D4AF37]/15
                        overflow-hidden
                    "
                >
                    <div className="overflow-x-auto">
                        <table
                            className="
                                w-full
                                min-w-[1500px]
                            "
                        >
                            <thead
                                className="
                                    bg-[#1A1A1A]
                                    border-b
                                    border-white/5
                                "
                            >
                                <tr>
                                    <th
                                        className="
                                            text-left
                                            px-5
                                            py-4
                                            text-gray-500
                                            text-sm
                                        "
                                    >
                                        ID
                                    </th>

                                    <th
                                        className="
                                            text-left
                                            px-5
                                            py-4
                                            text-gray-500
                                            text-sm
                                        "
                                    >
                                        Denda
                                    </th>

                                    <th
                                        className="
                                            text-left
                                            px-5
                                            py-4
                                            text-gray-500
                                            text-sm
                                        "
                                    >
                                        Peminjaman
                                    </th>

                                    <th
                                        className="
                                            text-left
                                            px-5
                                            py-4
                                            text-gray-500
                                            text-sm
                                        "
                                    >
                                        Customer
                                    </th>

                                    <th
                                        className="
                                            text-left
                                            px-5
                                            py-4
                                            text-gray-500
                                            text-sm
                                        "
                                    >
                                        Tanggal Bayar
                                    </th>

                                    <th
                                        className="
                                            text-left
                                            px-5
                                            py-4
                                            text-gray-500
                                            text-sm
                                        "
                                    >
                                        Nominal
                                    </th>

                                    <th
                                        className="
                                            text-left
                                            px-5
                                            py-4
                                            text-gray-500
                                            text-sm
                                        "
                                    >
                                        Metode
                                    </th>

                                    <th
                                        className="
                                            text-left
                                            px-5
                                            py-4
                                            text-gray-500
                                            text-sm
                                        "
                                    >
                                        Bukti
                                    </th>

                                    <th
                                        className="
                                            text-left
                                            px-5
                                            py-4
                                            text-gray-500
                                            text-sm
                                        "
                                    >
                                        Status
                                    </th>

                                    <th
                                        className="
                                            text-left
                                            px-5
                                            py-4
                                            text-gray-500
                                            text-sm
                                        "
                                    >
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredPayments.length ===
                                0 ? (
                                    <tr>
                                        <td
                                            colSpan="10"
                                            className="
                                                text-center
                                                py-16
                                                text-gray-500
                                            "
                                        >
                                            Belum ada data
                                            pembayaran denda.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPayments.map(
                                        (item) => {
                                            const status =
                                                getStatus(
                                                    item
                                                );

                                            const isLunas =
                                                status ===
                                                "Lunas";

                                            const isWaiting =
                                                status ===
                                                "Menunggu Verifikasi";

                                            const hasProof =
                                                Boolean(
                                                    item.bukti_bayar
                                                );

                                            return (
                                                <tr
                                                    key={
                                                        item.id_pembayaran_denda
                                                    }
                                                    className="
                                                        border-b
                                                        border-white/5
                                                        hover:bg-white/[0.02]
                                                    "
                                                >
                                                    {/* ID */}

                                                    <td
                                                        className="
                                                            px-5
                                                            py-5
                                                            text-[#D4AF37]
                                                            font-semibold
                                                        "
                                                    >
                                                        #
                                                        {
                                                            item.id_pembayaran_denda
                                                        }
                                                    </td>

                                                    {/* DENDA */}

                                                    <td className="px-5 py-5">
                                                        <p className="font-medium">
                                                            Denda #
                                                            {
                                                                item.id_denda
                                                            }
                                                        </p>

                                                        <p
                                                            className="
                                                                text-xs
                                                                text-gray-600
                                                                mt-1
                                                            "
                                                        >
                                                            {
                                                                item.alasan ||
                                                                "Denda pengembalian"
                                                            }
                                                        </p>
                                                    </td>

                                                    {/* PEMINJAMAN */}

                                                    <td className="px-5 py-5">
                                                        <p className="font-medium">
                                                            #
                                                            {
                                                                item.id_peminjaman
                                                            }
                                                        </p>
                                                    </td>

                                                    {/* CUSTOMER */}

                                                    <td className="px-5 py-5">
                                                        <p className="font-semibold">
                                                            {
                                                                item.nama_user ||
                                                                "-"
                                                            }
                                                        </p>

                                                        <p
                                                            className="
                                                                text-xs
                                                                text-gray-600
                                                                mt-1
                                                            "
                                                        >
                                                            {
                                                                item.email_user ||
                                                                "-"
                                                            }
                                                        </p>
                                                    </td>

                                                    {/* TANGGAL */}

                                                    <td className="px-5 py-5">
                                                        <p>
                                                            {formatTanggal(
                                                                item.tanggal_bayar
                                                            )}
                                                        </p>

                                                        {item.tanggal_bayar && (
                                                            <p
                                                                className="
                                                                    text-xs
                                                                    text-gray-600
                                                                    mt-1
                                                                "
                                                            >
                                                                {formatTanggalWaktu(
                                                                    item.tanggal_bayar
                                                                )}
                                                            </p>
                                                        )}
                                                    </td>

                                                    {/* NOMINAL */}

                                                    <td className="px-5 py-5">
                                                        <p
                                                            className="
                                                                text-[#D4AF37]
                                                                font-semibold
                                                            "
                                                        >
                                                            {formatRupiah(
                                                                item.jumlah
                                                            )}
                                                        </p>
                                                    </td>

                                                    {/* METODE */}

                                                    <td className="px-5 py-5">
                                                        <span
                                                            className="
                                                                inline-flex
                                                                px-3
                                                                py-1.5
                                                                rounded-full
                                                                text-xs
                                                                border
                                                                bg-blue-500/10
                                                                text-blue-400
                                                                border-blue-500/20
                                                            "
                                                        >
                                                            {formatMetode(
                                                                item.metode
                                                            )}
                                                        </span>
                                                    </td>

                                                    {/* BUKTI */}

                                                    <td className="px-5 py-5">
                                                        {String(
                                                            item.metode ||
                                                                ""
                                                        ).toLowerCase() ===
                                                        "cash" ? (
                                                            <span
                                                                className="
                                                                    text-xs
                                                                    text-gray-500
                                                                "
                                                            >
                                                                Tidak
                                                                diperlukan
                                                                <br />
                                                                <span className="text-gray-600">
                                                                    Pembayaran
                                                                    Cash
                                                                </span>
                                                            </span>
                                                        ) : hasProof ? (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    openProof(
                                                                        item
                                                                    )
                                                                }
                                                                className="
                                                                    inline-flex
                                                                    items-center
                                                                    gap-2
                                                                    px-4
                                                                    py-2
                                                                    rounded-lg
                                                                    border
                                                                    border-blue-500/20
                                                                    text-blue-400
                                                                    hover:bg-blue-500/10
                                                                    transition
                                                                "
                                                            >
                                                                <FaEye />
                                                                Lihat
                                                            </button>
                                                        ) : (
                                                            <span
                                                                className="
                                                                    text-xs
                                                                    text-red-400
                                                                "
                                                            >
                                                                Belum
                                                                ada
                                                                bukti
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* STATUS */}

                                                    <td className="px-5 py-5">
                                                        <span
                                                            className={`
                                                                inline-flex
                                                                items-center
                                                                gap-2
                                                                px-3
                                                                py-1.5
                                                                rounded-full
                                                                text-xs
                                                                border
                                                                ${
                                                                    isLunas
                                                                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                                                                        : isWaiting
                                                                        ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                                                        : "bg-white/5 text-gray-400 border-white/10"
                                                                }
                                                            `}
                                                        >
                                                            {isLunas ? (
                                                                <FaCheck />
                                                            ) : isWaiting ? (
                                                                <FaClock />
                                                            ) : (
                                                                <FaExclamationTriangle />
                                                            )}

                                                            {status}
                                                        </span>
                                                    </td>

                                                    {/* AKSI */}

                                                    <td className="px-5 py-5">
                                                        <div
                                                            className="
                                                                flex
                                                                items-center
                                                                gap-2
                                                            "
                                                        >
                                                            {isWaiting && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        verifyPayment(
                                                                            item
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        updatingId ===
                                                                        item.id_pembayaran_denda
                                                                    }
                                                                    className="
                                                                        inline-flex
                                                                        items-center
                                                                        gap-2
                                                                        px-4
                                                                        py-2
                                                                        rounded-lg
                                                                        bg-green-500
                                                                        text-black
                                                                        font-semibold
                                                                        hover:bg-green-400
                                                                        transition
                                                                        disabled:opacity-50
                                                                        disabled:cursor-not-allowed
                                                                    "
                                                                    title="Verifikasi pembayaran denda"
                                                                >
                                                                    <FaCheck />

                                                                    {updatingId ===
                                                                    item.id_pembayaran_denda
                                                                        ? "Memproses..."
                                                                        : "Verifikasi"}
                                                                </button>
                                                            )}

                                                            {hasProof && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        openProof(
                                                                            item
                                                                        )
                                                                    }
                                                                    title="Lihat bukti pembayaran denda"
                                                                    className="
                                                                        px-3
                                                                        py-2
                                                                        rounded-lg
                                                                        border
                                                                        border-blue-500/20
                                                                        text-blue-400
                                                                        hover:bg-blue-500/10
                                                                        transition
                                                                    "
                                                                >
                                                                    <FaEye />
                                                                </button>
                                                            )}

                                                            {isLunas && (
                                                                <span
                                                                    className="
                                                                        text-xs
                                                                        text-green-400
                                                                    "
                                                                >
                                                                    Terverifikasi
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* ==================================================
                    BACK
                ================================================== */}

                <div className="mt-6">
                    <Link
                        to="/petugas/dashboard"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            text-gray-500
                            hover:text-[#D4AF37]
                        "
                    >
                        <FaArrowLeft />
                        Kembali ke Dashboard
                    </Link>
                </div>
            </main>

            {/* ==================================================
                MODAL BUKTI PEMBAYARAN DENDA
            ================================================== */}

            {selectedProof && (
                <div
                    className="
                        fixed
                        inset-0
                        z-[9999]
                        bg-black/80
                        backdrop-blur-sm
                        flex
                        items-center
                        justify-center
                        p-5
                    "
                    onClick={closeProof}
                >
                    <div
                        className="
                            relative
                            w-full
                            max-w-4xl
                            max-h-[90vh]
                            bg-[#141414]
                            border
                            border-[#D4AF37]/20
                            rounded-3xl
                            overflow-hidden
                            shadow-2xl
                        "
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >
                        {/* HEADER */}

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-4
                                px-6
                                py-5
                                border-b
                                border-white/10
                            "
                        >
                            <div>
                                <p
                                    className="
                                        text-xs
                                        uppercase
                                        tracking-[3px]
                                        text-[#D4AF37]
                                    "
                                >
                                    Verifikasi Pembayaran Denda
                                </p>

                                <h2
                                    className="
                                        text-xl
                                        font-bold
                                        mt-1
                                    "
                                >
                                    Bukti Pembayaran #
                                    {
                                        selectedProof.id_pembayaran_denda
                                    }
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={closeProof}
                                className="
                                    w-10
                                    h-10
                                    rounded-full
                                    border
                                    border-white/10
                                    flex
                                    items-center
                                    justify-center
                                    text-gray-400
                                    hover:text-white
                                    hover:bg-white/5
                                "
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* INFORMASI */}

                        <div
                            className="
                                px-6
                                py-4
                                border-b
                                border-white/10
                                grid
                                sm:grid-cols-2
                                lg:grid-cols-4
                                gap-4
                            "
                        >
                            <div>
                                <p className="text-xs text-gray-500">
                                    Customer
                                </p>

                                <p className="mt-1 font-medium">
                                    {
                                        selectedProof.nama_user ||
                                        "-"
                                    }
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Peminjaman
                                </p>

                                <p className="mt-1 font-medium">
                                    #
                                    {
                                        selectedProof.id_peminjaman
                                    }
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Metode
                                </p>

                                <p
                                    className="
                                        mt-1
                                        font-medium
                                        text-[#D4AF37]
                                    "
                                >
                                    {formatMetode(
                                        selectedProof.metode
                                    )}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Nominal
                                </p>

                                <p
                                    className="
                                        mt-1
                                        font-medium
                                        text-[#D4AF37]
                                    "
                                >
                                    {formatRupiah(
                                        selectedProof.jumlah
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* BUKTI */}

                        <div
                            className="
                                p-6
                                overflow-auto
                                max-h-[60vh]
                                flex
                                justify-center
                                bg-[#0A0A0A]
                            "
                        >
                            {isPdfProof(
                                selectedProof.bukti_bayar
                            ) ? (
                                <iframe
                                    src={getProofUrl(
                                        selectedProof.bukti_bayar
                                    )}
                                    title="Bukti pembayaran denda PDF"
                                    className="
                                        w-full
                                        h-[55vh]
                                        rounded-xl
                                        border
                                        border-white/10
                                    "
                                />
                            ) : (
                                <img
                                    src={getProofUrl(
                                        selectedProof.bukti_bayar
                                    )}
                                    alt="Bukti pembayaran denda"
                                    className="
                                        max-w-full
                                        max-h-[55vh]
                                        object-contain
                                        rounded-xl
                                    "
                                    onError={(e) => {
                                        e.currentTarget.style.display =
                                            "none";
                                    }}
                                />
                            )}
                        </div>

                        {/* FOOTER */}

                        <div
                            className="
                                px-6
                                py-5
                                border-t
                                border-white/10
                                flex
                                flex-wrap
                                justify-end
                                gap-3
                            "
                        >
                            <button
                                type="button"
                                onClick={closeProof}
                                className="
                                    px-5
                                    py-3
                                    rounded-xl
                                    border
                                    border-white/10
                                    text-gray-400
                                    hover:text-white
                                "
                            >
                                Tutup
                            </button>

                            {getStatus(
                                selectedProof
                            ) ===
                                "Menunggu Verifikasi" && (
                                <button
                                    type="button"
                                    onClick={async () => {
                                        const result =
                                            await verifyPayment(
                                                selectedProof
                                            );

                                        if (result) {
                                            closeProof();
                                        }
                                    }}
                                    disabled={
                                        updatingId ===
                                        selectedProof.id_pembayaran_denda
                                    }
                                    className="
                                        px-5
                                        py-3
                                        rounded-xl
                                        bg-green-500
                                        text-black
                                        font-semibold
                                        flex
                                        items-center
                                        gap-2
                                        disabled:opacity-50
                                        disabled:cursor-not-allowed
                                    "
                                >
                                    <FaCheck />

                                    {updatingId ===
                                    selectedProof.id_pembayaran_denda
                                        ? "Memproses..."
                                        : "Verifikasi & Tandai Lunas"}
                                </button>
                            )}

                            {getStatus(
                                selectedProof
                            ) === "Lunas" && (
                                <span
                                    className="
                                        px-5
                                        py-3
                                        rounded-xl
                                        bg-green-500/10
                                        border
                                        border-green-500/20
                                        text-green-400
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >
                                    <FaCheck />
                                    Sudah Terverifikasi
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PembayaranDenda;