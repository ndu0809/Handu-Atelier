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
} from "react-icons/fa";

function Payments() {
    const navigate = useNavigate();

    // ==================================================
    // SESSION
    // ==================================================

    const [user, setUser] = useState(null);

    // ==================================================
    // DATA
    // ==================================================

    const [payments, setPayments] = useState([]);
    const [peminjaman, setPeminjaman] = useState([]);

    // ==================================================
    // UI
    // ==================================================

    const [loading, setLoading] = useState(true);
    const [loadingPeminjaman, setLoadingPeminjaman] =
        useState(false);

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
    // NORMALIZE METHOD
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
    // URL BUKTI PEMBAYARAN
    // ==================================================

    const getProofUrl = (bukti) => {
        if (!bukti) {
            return "";
        }

        const value = String(bukti).trim();

        if (!value) {
            return "";
        }

        // Base64 / data URL
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
        return `/uploads/pembayaran/${value}`;
    };

    // ==================================================
    // CEK APAKAH BUKTI PDF
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
    // CEK SESSION PETUGAS
    // ==================================================

    useEffect(() => {
        const storedUser =
            localStorage.getItem("user");

        if (!storedUser) {
            navigate("/login", {
                replace: true,
            });

            return;
        }

        try {
            const parsedUser =
                JSON.parse(storedUser);

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
    // LOAD PEMBAYARAN
    // ==================================================

    const loadPayments = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "/api/pembayaran"
            );

            const result =
                await parseResponse(response);

            if (!response.ok) {
                throw new Error(
                    result.message ||
                        "Gagal mengambil data pembayaran."
                );
            }

            const rows = Array.isArray(result)
                ? result
                : result.data;

            if (!Array.isArray(rows)) {
                throw new Error(
                    "Format data pembayaran tidak sesuai."
                );
            }

            setPayments(rows);
        } catch (err) {
            console.error(
                "Load pembayaran:",
                err
            );

            setError(
                err.message ||
                    "Gagal mengambil data pembayaran."
            );
        } finally {
            setLoading(false);
        }
    };

    // ==================================================
    // LOAD PEMINJAMAN
    // ==================================================

    const loadPeminjaman = async () => {
        try {
            setLoadingPeminjaman(true);

            const response = await fetch(
                "/api/peminjaman"
            );

            const result =
                await parseResponse(response);

            if (!response.ok) {
                throw new Error(
                    result.message ||
                        "Gagal mengambil data peminjaman."
                );
            }

            const rows = Array.isArray(result)
                ? result
                : result.data;

            setPeminjaman(
                Array.isArray(rows)
                    ? rows
                    : []
            );
        } catch (err) {
            console.error(
                "Load peminjaman:",
                err
            );

            setError(
                err.message ||
                    "Gagal mengambil data peminjaman."
            );
        } finally {
            setLoadingPeminjaman(false);
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
        loadPeminjaman();
    }, [user]);

    // ==================================================
    // REFRESH
    // ==================================================

    const handleRefresh = async () => {
        setError("");
        setSuccess("");

        await Promise.all([
            loadPayments(),
            loadPeminjaman(),
        ]);
    };

    // ==================================================
    // CARI DATA PEMINJAMAN
    // ==================================================

    const getLoanByPayment = (payment) => {
        if (!payment) {
            return null;
        }

        return peminjaman.find(
            (item) =>
                Number(item.id_peminjaman) ===
                Number(payment.id_peminjaman)
        );
    };

    // ==================================================
    // TOTAL PEMINJAMAN
    // ==================================================

    const getTotalPeminjaman = (payment) => {
        const loan = getLoanByPayment(payment);

        const value =
            payment?.total_harga ??
            payment?.total_peminjaman ??
            loan?.total_harga ??
            0;

        return Number(value) || 0;
    };

    // ==================================================
    // JENIS PEMBAYARAN
    // ==================================================

    const getJenisPembayaran = (payment) => {
        const totalPembayaran =
            Number(payment?.total) || 0;

        const totalPeminjaman =
            getTotalPeminjaman(payment);

        if (
            totalPembayaran > 0 &&
            totalPeminjaman > 0
        ) {
            const percentage =
                (totalPembayaran /
                    totalPeminjaman) *
                100;

            if (
                Math.abs(percentage - 50) <
                1
            ) {
                return "DP 50%";
            }

            if (
                Math.abs(percentage - 100) <
                1
            ) {
                return "Pembayaran Penuh";
            }
        }

        return "Pembayaran";
    };

    // ==================================================
    // OPEN BUKTI
    // ==================================================

    const openProof = (item) => {
        if (!item?.bukti_bayar) {
            setError(
                "Pembayaran ini tidak memiliki bukti pembayaran."
            );

            return;
        }

        setSelectedProof(item);
        setError("");
        setSuccess("");
    };

    // ==================================================
    // CLOSE BUKTI
    // ==================================================

    const closeProof = () => {
        setSelectedProof(null);
    };

    // ==================================================
    // VERIFIKASI PEMBAYARAN
    // ==================================================

    const verifyPayment = async (
        item,
        askConfirmation = true
    ) => {
        if (!item) {
            return false;
        }

        if (item.status === "Lunas") {
            setSuccess(
                `Pembayaran #${item.id_pembayaran} sudah berstatus Lunas.`
            );

            return false;
        }

        if (askConfirmation) {
            const confirmed =
                window.confirm(
                    `Verifikasi pembayaran #${item.id_pembayaran} sebesar ${formatRupiah(
                        item.total
                    )} dan tandai sebagai Lunas?`
                );

            if (!confirmed) {
                return false;
            }
        }

        try {
            setUpdatingId(
                item.id_pembayaran
            );

            setError("");
            setSuccess("");

            const response =
                await fetch(
                    `/api/pembayaran/${item.id_pembayaran}/status`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            status: "Lunas",
                        }),
                    }
                );

            const result =
                await parseResponse(
                    response
                );

            if (!response.ok) {
                throw new Error(
                    result.message ||
                        "Gagal memverifikasi pembayaran."
                );
            }

            setSuccess(
                `Pembayaran #${item.id_pembayaran} berhasil diverifikasi dan berstatus Lunas.`
            );

            await loadPayments();

            return true;
        } catch (err) {
            console.error(
                "Verifikasi pembayaran:",
                err
            );

            setError(
                err.message ||
                    "Gagal memverifikasi pembayaran."
            );

            return false;
        } finally {
            setUpdatingId(null);
        }
    };

    // ==================================================
    // SEARCH
    // ==================================================

    const filteredPayments =
        useMemo(() => {
            const keyword =
                search
                    .trim()
                    .toLowerCase();

            if (!keyword) {
                return payments;
            }

            return payments.filter(
                (item) =>
                    String(
                        item.id_pembayaran || ""
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
        }, [
            payments,
            search,
        ]);

    // ==================================================
    // SUMMARY
    // ==================================================

    const totalPayments =
        payments.length;

    const totalLunas =
        payments.filter(
            (item) =>
                item.status ===
                "Lunas"
        ).length;

    const totalBelumBayar =
        payments.filter(
            (item) =>
                item.status ===
                "Belum Bayar"
        ).length;

    const totalDenganBukti =
        payments.filter(
            (item) =>
                Boolean(
                    item.bukti_bayar
                )
        ).length;

    const nominalLunas =
        payments
            .filter(
                (item) =>
                    item.status ===
                    "Lunas"
            )
            .reduce(
                (total, item) =>
                    total +
                    (Number(
                        item.total
                    ) || 0),
                0
            );

    // ==================================================
    // LOADING
    // ==================================================

    if (
        !user ||
        loading
    ) {
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
                    Memuat data pembayaran...
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
                            Pembayaran
                        </h1>

                        <p
                            className="
                                text-gray-500
                                mt-2
                            "
                        >
                            Verifikasi pembayaran
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

                    {/* PERLU VERIFIKASI */}

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
                            Perlu Verifikasi
                        </p>

                        <p
                            className="
                                text-3xl
                                font-bold
                                text-yellow-400
                                mt-2
                            "
                        >
                            {totalBelumBayar}
                        </p>
                    </div>

                    {/* BUKTI */}

                    <div
                        className="
                            rounded-2xl
                            bg-[#141414]
                            border
                            border-blue-500/15
                            p-5
                        "
                    >
                        <p className="text-gray-500 text-sm">
                            Ada Bukti
                        </p>

                        <p
                            className="
                                text-3xl
                                font-bold
                                text-blue-400
                                mt-2
                            "
                        >
                            {totalDenganBukti}
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
                            Nominal Lunas
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
                                Alur pembayaran
                            </p>

                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                    mt-1
                                "
                            >
                                Pembayaran dibuat oleh
                                customer. Petugas hanya
                                memeriksa bukti dan
                                memverifikasi pembayaran
                                menjadi Lunas.
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
                            placeholder="Cari ID pembayaran, ID peminjaman, nama customer, atau metode..."
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
                                min-w-[1550px]
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
                                        Tanggal
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
                                        Jenis
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
                                            pembayaran.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPayments.map(
                                        (item) => {
                                            const hasProof =
                                                Boolean(
                                                    item.bukti_bayar
                                                );

                                            const isLunas =
                                                item.status ===
                                                "Lunas";

                                            const loan =
                                                getLoanByPayment(
                                                    item
                                                );

                                            const totalPeminjaman =
                                                getTotalPeminjaman(
                                                    item
                                                );

                                            const jenis =
                                                getJenisPembayaran(
                                                    item
                                                );

                                            const metode =
                                                formatMetode(
                                                    item.metode
                                                );

                                            return (
                                                <tr
                                                    key={
                                                        item.id_pembayaran
                                                    }
                                                    className="
                                                        border-b
                                                        border-white/5
                                                        hover:bg-white/5
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
                                                            item.id_pembayaran
                                                        }
                                                    </td>

                                                    {/* PEMINJAMAN */}

                                                    <td className="px-5 py-5">
                                                        <p className="font-medium">
                                                            #
                                                            {
                                                                item.id_peminjaman
                                                            }
                                                        </p>

                                                        {loan?.status && (
                                                            <span
                                                                className="
                                                                    inline-flex
                                                                    mt-2
                                                                    px-2.5
                                                                    py-1
                                                                    rounded-full
                                                                    text-xs
                                                                    bg-white/5
                                                                    text-gray-400
                                                                "
                                                            >
                                                                {
                                                                    loan.status
                                                                }
                                                            </span>
                                                        )}
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

                                                    <td
                                                        className="
                                                            px-5
                                                            py-5
                                                        "
                                                    >
                                                        <p
                                                            className="
                                                                text-[#D4AF37]
                                                                font-semibold
                                                            "
                                                        >
                                                            {formatRupiah(
                                                                item.total
                                                            )}
                                                        </p>

                                                        {totalPeminjaman >
                                                            0 && (
                                                            <p
                                                                className="
                                                                    text-xs
                                                                    text-gray-600
                                                                    mt-1
                                                                "
                                                            >
                                                                dari{" "}
                                                                {formatRupiah(
                                                                    totalPeminjaman
                                                                )}
                                                            </p>
                                                        )}
                                                    </td>

                                                    {/* JENIS */}

                                                    <td className="px-5 py-5">
                                                        <span
                                                            className={`
                                                                inline-flex
                                                                px-3
                                                                py-1.5
                                                                rounded-full
                                                                text-xs
                                                                border
                                                                ${
                                                                    jenis ===
                                                                    "DP 50%"
                                                                        ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                                                        : jenis ===
                                                                          "Pembayaran Penuh"
                                                                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                                                                        : "bg-white/5 text-gray-400 border-white/10"
                                                                }
                                                            `}
                                                        >
                                                            {jenis}
                                                        </span>
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
                                                            {metode}
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
                                                                        : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                                                }
                                                            `}
                                                        >
                                                            {isLunas ? (
                                                                <FaCheck />
                                                            ) : (
                                                                <FaClock />
                                                            )}

                                                            {item.status ||
                                                                "Belum Bayar"}
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
                                                            {!isLunas && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        verifyPayment(
                                                                            item
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        updatingId ===
                                                                        item.id_pembayaran
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
                                                                    title="Verifikasi pembayaran"
                                                                >
                                                                    <FaCheck />

                                                                    {updatingId ===
                                                                    item.id_pembayaran
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
                                                                    title="Lihat bukti pembayaran"
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
                MODAL BUKTI PEMBAYARAN
            ================================================== */}

            {selectedProof && (
                <div
                    className="
                        fixed
                        inset-0
                        z-50
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
                                    Verifikasi Pembayaran
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
                                        selectedProof.id_pembayaran
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
                                        selectedProof.total
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
                                    title="Bukti pembayaran PDF"
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
                                    alt="Bukti pembayaran"
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

                            {selectedProof.status !==
                                "Lunas" && (
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
                                        selectedProof.id_pembayaran
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
                                    selectedProof.id_pembayaran
                                        ? "Memproses..."
                                        : "Verifikasi & Tandai Lunas"}
                                </button>
                            )}

                            {selectedProof.status ===
                                "Lunas" && (
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

export default Payments;