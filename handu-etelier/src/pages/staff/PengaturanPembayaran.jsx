import { useEffect, useState } from "react";
import {
    FaArrowLeft,
    FaCheckCircle,
    FaCloudUploadAlt,
    FaCreditCard,
    FaImage,
    FaSave,
    FaTimes,
} from "react-icons/fa";

import { Link } from "react-router-dom";

function PengaturanPembayaran() {
    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savingBank, setSavingBank] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [qrisFile, setQrisFile] = useState(null);
    const [qrisPreview, setQrisPreview] = useState("");

    const [bankData, setBankData] = useState({
        nama_bank: "",
        nomor_rekening: "",
        nama_penerima: "",
    });

    // ======================================================
    // HELPER RESPONSE
    // ======================================================

    const parseResponse = async (response) => {
        const contentType =
            response.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
            return await response.json();
        }

        const text = await response.text();

        console.error(
            "Response bukan JSON:",
            text
        );

        throw new Error(
            `Server mengembalikan response yang tidak valid (${response.status}).`
        );
    };

    // ======================================================
    // AMBIL DATA PENGATURAN PEMBAYARAN
    // ======================================================

    const fetchQris = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "/api/pengaturan-pembayaran/qris-aktif",
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            const result =
                await parseResponse(response);

            console.log(
                "DATA PENGATURAN PEMBAYARAN:",
                result
            );

            if (!response.ok) {
                throw new Error(
                    result.message ||
                        "Gagal mengambil data pengaturan pembayaran."
                );
            }

            const paymentData =
                result.data || null;

            setData(paymentData);

            // ==================================================
            // ISI DATA REKENING
            // ==================================================

            setBankData({
                nama_bank:
                    paymentData?.nama_bank || "",

                nomor_rekening:
                    paymentData?.nomor_rekening || "",

                nama_penerima:
                    paymentData?.nama_penerima || "",
            });
        } catch (err) {
            console.error(
                "Error mengambil pengaturan pembayaran:",
                err
            );

            setError(
                err.message ||
                    "Gagal mengambil data pengaturan pembayaran."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQris();
    }, []);

    // ======================================================
    // URL FOTO QRIS
    // ======================================================

    const getQrisUrl = (qris) => {
        if (!qris) {
            return "";
        }

        const value =
            String(qris).trim();

        if (!value) {
            return "";
        }

        if (
            value.startsWith("http://") ||
            value.startsWith("https://")
        ) {
            return value;
        }

        if (
            value.startsWith("/uploads/")
        ) {
            return value;
        }

        if (
            value.startsWith("uploads/")
        ) {
            return `/${value}`;
        }

        return `/uploads/pembayaran/${value}`;
    };

    // ======================================================
    // PILIH QRIS
    // ======================================================

    const handleQrisChange = (e) => {
        const file =
            e.target.files?.[0];

        setError("");
        setSuccess("");

        if (!file) {
            setQrisFile(null);
            setQrisPreview("");
            return;
        }

        // ==================================================
        // VALIDASI FORMAT
        // ==================================================

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (
            !allowedTypes.includes(
                file.type
            )
        ) {
            setQrisFile(null);
            setQrisPreview("");

            setError(
                "Format QRIS harus JPG, PNG, atau WEBP."
            );

            e.target.value = "";

            return;
        }

        // ==================================================
        // VALIDASI UKURAN
        // ==================================================

        if (
            file.size >
            5 * 1024 * 1024
        ) {
            setQrisFile(null);
            setQrisPreview("");

            setError(
                "Ukuran QRIS maksimal 5 MB."
            );

            e.target.value = "";

            return;
        }

        // ==================================================
        // SIMPAN FILE
        // ==================================================

        setQrisFile(file);

        // ==================================================
        // PREVIEW
        // ==================================================

        const reader =
            new FileReader();

        reader.onload = () => {
            if (
                typeof reader.result ===
                "string"
            ) {
                setQrisPreview(
                    reader.result
                );
            }
        };

        reader.onerror = () => {
            setQrisPreview("");

            setError(
                "Gagal membaca file QRIS."
            );
        };

        reader.readAsDataURL(file);
    };

    // ======================================================
    // SIMPAN QRIS
    // ======================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // ==================================================
        // VALIDASI FILE
        // ==================================================

        if (!qrisFile) {
            setError(
                "Silakan pilih file QRIS terlebih dahulu."
            );

            return;
        }

        // ==================================================
        // VALIDASI DATA
        // ==================================================

        if (
            !data?.id_pengaturan
        ) {
            setError(
                "Data pengaturan pembayaran tidak ditemukan."
            );

            return;
        }

        try {
            setSaving(true);

            const formData =
                new FormData();

            formData.append(
                "qris",
                qrisFile
            );

            console.log(
                "Mengirim QRIS:",
                qrisFile.name
            );

            console.log(
                "ID Pengaturan:",
                data.id_pengaturan
            );

            // ==================================================
            // UPDATE QRIS
            // ==================================================

            const response =
                await fetch(
                    `/api/pengaturan-pembayaran/${data.id_pengaturan}/qris`,
                    {
                        method: "PUT",
                        body: formData,
                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );

            const result =
                await parseResponse(
                    response
                );

            console.log(
                "HASIL UPDATE QRIS:",
                result
            );

            if (!response.ok) {
                throw new Error(
                    result.message ||
                        "Gagal memperbarui QRIS."
                );
            }

            setSuccess(
                result.message ||
                    "QRIS berhasil diperbarui."
            );

            // ==================================================
            // RESET FILE
            // ==================================================

            setQrisFile(null);
            setQrisPreview("");

            const input =
                document.getElementById(
                    "qris"
                );

            if (input) {
                input.value = "";
            }

            // ==================================================
            // AMBIL DATA TERBARU
            // ==================================================

            await fetchQris();
        } catch (err) {
            console.error(
                "Error update QRIS:",
                err
            );

            setError(
                err.message ||
                    "Gagal memperbarui QRIS."
            );
        } finally {
            setSaving(false);
        }
    };

    // ======================================================
    // INPUT REKENING
    // ======================================================

    const handleBankChange = (e) => {
        const {
            name,
            value,
        } = e.target;

        setBankData(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );

        setError("");
        setSuccess("");
    };

    // ======================================================
    // SIMPAN REKENING
    // ======================================================

    const handleSaveBank = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // ==================================================
        // VALIDASI ID
        // ==================================================

        if (
            !data?.id_pengaturan
        ) {
            setError(
                "Data pengaturan pembayaran tidak ditemukan."
            );

            return;
        }

        // ==================================================
        // VALIDASI NAMA BANK
        // ==================================================

        if (
            !bankData.nama_bank.trim()
        ) {
            setError(
                "Nama bank wajib diisi."
            );

            return;
        }

        // ==================================================
        // VALIDASI NOMOR REKENING
        // ==================================================

        if (
            !bankData.nomor_rekening.trim()
        ) {
            setError(
                "Nomor rekening wajib diisi."
            );

            return;
        }

        // ==================================================
        // VALIDASI NAMA PEMILIK
        // ==================================================

        if (
            !bankData.nama_penerima.trim()
        ) {
            setError(
                "Nama pemilik rekening wajib diisi."
            );

            return;
        }

        try {
            setSavingBank(true);

            console.log(
                "UPDATE REKENING:",
                bankData
            );

            // ==================================================
            // UPDATE REKENING
            // ==================================================

            const response =
                await fetch(
                    `/api/pengaturan-pembayaran/${data.id_pengaturan}/bank`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json",
                        },

                        body: JSON.stringify({
                            nama_bank:
                                bankData.nama_bank.trim(),

                            nomor_rekening:
                                bankData.nomor_rekening.trim(),

                            nama_penerima:
                                bankData.nama_penerima.trim(),
                        }),
                    }
                );

            const result =
                await parseResponse(
                    response
                );

            console.log(
                "HASIL UPDATE REKENING:",
                result
            );

            if (!response.ok) {
                throw new Error(
                    result.message ||
                        "Gagal memperbarui data rekening."
                );
            }

            setSuccess(
                result.message ||
                    "Data rekening berhasil diperbarui."
            );

            // ==================================================
            // AMBIL DATA TERBARU
            // ==================================================

            await fetchQris();
        } catch (err) {
            console.error(
                "Error update rekening:",
                err
            );

            setError(
                err.message ||
                    "Gagal memperbarui data rekening."
            );
        } finally {
            setSavingBank(false);
        }
    };

    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {
        return (
            <div
                className="
                    min-h-screen
                    bg-[#080808]
                    text-white
                    flex
                    items-center
                    justify-center
                "
            >
                <div className="text-center">

                    <div
                        className="
                            w-12
                            h-12
                            border-4
                            border-[#D4AF37]/30
                            border-t-[#D4AF37]
                            rounded-full
                            animate-spin
                            mx-auto
                        "
                    />

                    <p
                        className="
                            text-gray-400
                            mt-5
                        "
                    >
                        Memuat pengaturan pembayaran...
                    </p>

                </div>
            </div>
        );
    }

    // ======================================================
    // RENDER
    // ======================================================

    return (
        <div
            className="
                min-h-screen
                bg-[#080808]
                text-white
            "
        >

            {/* ==================================================
                HEADER
            ================================================== */}

            <header
                className="
                    sticky
                    top-0
                    z-30
                    bg-[#080808]/95
                    backdrop-blur
                    border-b
                    border-white/5
                "
            >
                <div
                    className="
                        max-w-7xl
                        mx-auto
                        px-6
                        py-5
                        flex
                        items-center
                        justify-between
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-4
                        "
                    >

                        <div
                            className="
                                w-11
                                h-11
                                rounded-xl
                                bg-[#D4AF37]/10
                                border
                                border-[#D4AF37]/20
                                flex
                                items-center
                                justify-center
                            "
                        >
                            <FaCreditCard
                                className="
                                    text-[#D4AF37]
                                    text-lg
                                "
                            />
                        </div>

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
                                    text-2xl
                                    font-bold
                                "
                            >
                                Pengaturan Pembayaran
                            </h1>

                        </div>

                    </div>

                    <Link
                        to="/petugas/dashboard"
                        className="
                            inline-flex
                            items-center
                            gap-2
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
                        <FaArrowLeft />

                        Dashboard
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

                {/* ==================================================
                    TITLE
                ================================================== */}

                <div className="mb-8">

                    <h2
                        className="
                            text-3xl
                            font-bold
                        "
                    >
                        Pengaturan Pembayaran
                    </h2>

                    <p
                        className="
                            text-gray-500
                            mt-2
                        "
                    >
                        Kelola QRIS dan rekening bank
                        yang digunakan pelanggan untuk
                        melakukan pembayaran.
                    </p>

                </div>

                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (
                    <div
                        className="
                            mb-6
                            p-4
                            rounded-xl
                            bg-red-950/30
                            border
                            border-red-500/30
                            text-red-400
                            flex
                            items-center
                            gap-3
                        "
                    >
                        <FaTimes />

                        <span>
                            {error}
                        </span>
                    </div>
                )}

                {/* ==================================================
                    SUCCESS
                ================================================== */}

                {success && (
                    <div
                        className="
                            mb-6
                            p-4
                            rounded-xl
                            bg-green-950/30
                            border
                            border-green-500/30
                            text-green-400
                            flex
                            items-center
                            gap-3
                        "
                    >
                        <FaCheckCircle />

                        <span>
                            {success}
                        </span>
                    </div>
                )}

                {/* ==================================================
                    QRIS GRID
                ================================================== */}

                <div
                    className="
                        grid
                        lg:grid-cols-2
                        gap-8
                    "
                >

                    {/* ==================================================
                        QRIS SAAT INI
                    ================================================== */}

                    <section
                        className="
                            bg-[#121212]
                            border
                            border-[#D4AF37]/20
                            rounded-3xl
                            p-7
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                mb-6
                            "
                        >

                            <div>

                                <p
                                    className="
                                        text-[#D4AF37]
                                        text-xs
                                        uppercase
                                        tracking-[3px]
                                    "
                                >
                                    QRIS Aktif
                                </p>

                                <h3
                                    className="
                                        text-2xl
                                        font-bold
                                        mt-2
                                    "
                                >
                                    QRIS Saat Ini
                                </h3>

                            </div>

                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    px-3
                                    py-2
                                    rounded-full
                                    bg-green-500/10
                                    text-green-400
                                    text-sm
                                "
                            >

                                <span
                                    className="
                                        w-2
                                        h-2
                                        rounded-full
                                        bg-green-400
                                    "
                                />

                                Aktif

                            </span>

                        </div>

                        {data?.qris ? (

                            <div
                                className="
                                    rounded-2xl
                                    overflow-hidden
                                    border
                                    border-white/10
                                    bg-white
                                    flex
                                    items-center
                                    justify-center
                                    min-h-[380px]
                                "
                            >

                                <img
                                    src={getQrisUrl(
                                        data.qris
                                    )}
                                    alt="QRIS pembayaran"
                                    className="
                                        max-w-full
                                        max-h-[420px]
                                        object-contain
                                    "
                                />

                            </div>

                        ) : (

                            <div
                                className="
                                    min-h-[380px]
                                    rounded-2xl
                                    border
                                    border-dashed
                                    border-[#D4AF37]/20
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    text-center
                                    px-6
                                "
                            >

                                <FaImage
                                    className="
                                        text-5xl
                                        text-gray-700
                                    "
                                />

                                <p
                                    className="
                                        text-gray-400
                                        mt-5
                                    "
                                >
                                    QRIS belum diupload.
                                </p>

                                <p
                                    className="
                                        text-gray-600
                                        text-sm
                                        mt-2
                                    "
                                >
                                    Upload QRIS pada
                                    form di sebelah.
                                </p>

                            </div>

                        )}

                    </section>

                    {/* ==================================================
                        FORM UPLOAD QRIS
                    ================================================== */}

                    <section
                        className="
                            bg-[#121212]
                            border
                            border-[#D4AF37]/20
                            rounded-3xl
                            p-7
                        "
                    >

                        <div className="mb-6">

                            <p
                                className="
                                    text-[#D4AF37]
                                    text-xs
                                    uppercase
                                    tracking-[3px]
                                "
                            >
                                Kelola
                            </p>

                            <h3
                                className="
                                    text-2xl
                                    font-bold
                                    mt-2
                                "
                            >
                                Ganti QRIS
                            </h3>

                            <p
                                className="
                                    text-gray-500
                                    text-sm
                                    mt-2
                                "
                            >
                                Upload gambar QRIS baru
                                untuk mengganti QRIS
                                yang sedang digunakan.
                            </p>

                        </div>

                        <form
                            onSubmit={
                                handleSubmit
                            }
                        >

                            <label
                                htmlFor="qris"
                                className="
                                    block
                                    text-gray-300
                                    mb-3
                                "
                            >
                                File QRIS
                            </label>

                            <input
                                id="qris"
                                type="file"
                                accept="
                                    image/jpeg,
                                    image/png,
                                    image/webp
                                "
                                onChange={
                                    handleQrisChange
                                }
                                disabled={saving}
                                className="
                                    w-full
                                    bg-[#0D0D0D]
                                    border
                                    border-[#D4AF37]/20
                                    rounded-xl
                                    px-4
                                    py-3
                                    text-gray-300
                                    file:mr-4
                                    file:rounded-lg
                                    file:border-0
                                    file:px-4
                                    file:py-2
                                    file:bg-[#D4AF37]
                                    file:text-black
                                    file:font-semibold
                                    disabled:opacity-50
                                "
                            />

                            <p
                                className="
                                    text-gray-500
                                    text-xs
                                    mt-3
                                "
                            >
                                JPG, PNG, atau WEBP.
                                Maksimal 5 MB.
                            </p>

                            {/* ==================================================
                                PREVIEW
                            ================================================== */}

                            {qrisPreview && (
                                <div className="mt-7">

                                    <p
                                        className="
                                            text-gray-400
                                            text-sm
                                            mb-3
                                        "
                                    >
                                        Preview QRIS Baru
                                    </p>

                                    <div
                                        className="
                                            rounded-2xl
                                            overflow-hidden
                                            border
                                            border-white/10
                                            bg-white
                                            p-5
                                            flex
                                            justify-center
                                        "
                                    >

                                        <img
                                            src={
                                                qrisPreview
                                            }
                                            alt="Preview QRIS"
                                            className="
                                                max-h-[350px]
                                                max-w-full
                                                object-contain
                                            "
                                        />

                                    </div>

                                    <p
                                        className="
                                            text-gray-500
                                            text-xs
                                            mt-2
                                            break-all
                                        "
                                    >
                                        {
                                            qrisFile?.name
                                        }
                                    </p>

                                </div>
                            )}

                            {/* ==================================================
                                BUTTON
                            ================================================== */}

                            <button
                                type="submit"
                                disabled={
                                    saving ||
                                    !qrisFile ||
                                    !data?.id_pengaturan
                                }
                                className="
                                    w-full
                                    mt-8
                                    py-4
                                    rounded-xl
                                    bg-[#D4AF37]
                                    text-black
                                    font-semibold
                                    flex
                                    items-center
                                    justify-center
                                    gap-3
                                    hover:scale-[1.01]
                                    transition
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                "
                            >

                                {saving ? (
                                    <>
                                        <span
                                            className="
                                                w-5
                                                h-5
                                                border-2
                                                border-black/30
                                                border-t-black
                                                rounded-full
                                                animate-spin
                                            "
                                        />

                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <FaCloudUploadAlt />

                                        Simpan QRIS
                                    </>
                                )}

                            </button>

                        </form>

                    </section>

                </div>

                {/* ==================================================
                    TRANSFER BANK
                ================================================== */}

                <section
                    className="
                        mt-8
                        bg-[#121212]
                        border
                        border-[#D4AF37]/20
                        rounded-3xl
                        p-7
                    "
                >

                    <div className="mb-7">

                        <p
                            className="
                                text-[#D4AF37]
                                text-xs
                                uppercase
                                tracking-[3px]
                            "
                        >
                            Transfer Bank
                        </p>

                        <h3
                            className="
                                text-2xl
                                font-bold
                                mt-2
                            "
                        >
                            Rekening Pembayaran
                        </h3>

                        <p
                            className="
                                text-gray-500
                                text-sm
                                mt-2
                            "
                        >
                            Data rekening ini akan
                            digunakan pelanggan ketika
                            memilih metode pembayaran
                            Transfer Bank.
                        </p>

                    </div>

                    <form
                        onSubmit={
                            handleSaveBank
                        }
                        className="
                            grid
                            md:grid-cols-2
                            gap-5
                        "
                    >

                        {/* ==================================================
                            NAMA BANK
                        ================================================== */}

                        <div>

                            <label
                                htmlFor="nama_bank"
                                className="
                                    block
                                    text-gray-300
                                    mb-2
                                "
                            >
                                Nama Bank
                            </label>

                            <input
                                id="nama_bank"
                                name="nama_bank"
                                type="text"
                                value={
                                    bankData.nama_bank
                                }
                                onChange={
                                    handleBankChange
                                }
                                placeholder="Contoh: BCA"
                                disabled={
                                    savingBank
                                }
                                className="
                                    w-full
                                    bg-[#0D0D0D]
                                    border
                                    border-[#D4AF37]/20
                                    rounded-xl
                                    px-4
                                    py-3
                                    text-white
                                    outline-none
                                    focus:border-[#D4AF37]
                                    disabled:opacity-50
                                "
                            />

                        </div>

                        {/* ==================================================
                            NOMOR REKENING
                        ================================================== */}

                        <div>

                            <label
                                htmlFor="nomor_rekening"
                                className="
                                    block
                                    text-gray-300
                                    mb-2
                                "
                            >
                                Nomor Rekening
                            </label>

                            <input
                                id="nomor_rekening"
                                name="nomor_rekening"
                                type="text"
                                inputMode="numeric"
                                value={
                                    bankData.nomor_rekening
                                }
                                onChange={
                                    handleBankChange
                                }
                                placeholder="Contoh: 1234567890"
                                disabled={
                                    savingBank
                                }
                                className="
                                    w-full
                                    bg-[#0D0D0D]
                                    border
                                    border-[#D4AF37]/20
                                    rounded-xl
                                    px-4
                                    py-3
                                    text-white
                                    outline-none
                                    focus:border-[#D4AF37]
                                    disabled:opacity-50
                                "
                            />

                        </div>

                        {/* ==================================================
                            NAMA PEMILIK REKENING
                        ================================================== */}

                        <div
                            className="
                                md:col-span-2
                            "
                        >

                            <label
                                htmlFor="nama_penerima"
                                className="
                                    block
                                    text-gray-300
                                    mb-2
                                "
                            >
                                Nama Pemilik Rekening
                            </label>

                            <input
                                id="nama_penerima"
                                name="nama_penerima"
                                type="text"
                                value={
                                    bankData.nama_penerima
                                }
                                onChange={
                                    handleBankChange
                                }
                                placeholder="Contoh: Handu Atelier"
                                disabled={
                                    savingBank
                                }
                                className="
                                    w-full
                                    bg-[#0D0D0D]
                                    border
                                    border-[#D4AF37]/20
                                    rounded-xl
                                    px-4
                                    py-3
                                    text-white
                                    outline-none
                                    focus:border-[#D4AF37]
                                    disabled:opacity-50
                                "
                            />

                        </div>

                        {/* ==================================================
                            BUTTON SIMPAN REKENING
                        ================================================== */}

                        <div
                            className="
                                md:col-span-2
                            "
                        >

                            <button
                                type="submit"
                                disabled={
                                    savingBank ||
                                    !data?.id_pengaturan
                                }
                                className="
                                    w-full
                                    py-4
                                    rounded-xl
                                    bg-[#D4AF37]
                                    text-black
                                    font-semibold
                                    flex
                                    items-center
                                    justify-center
                                    gap-3
                                    hover:scale-[1.01]
                                    transition
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                "
                            >

                                {savingBank ? (
                                    <>
                                        <span
                                            className="
                                                w-5
                                                h-5
                                                border-2
                                                border-black/30
                                                border-t-black
                                                rounded-full
                                                animate-spin
                                            "
                                        />

                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <FaSave />

                                        Simpan Rekening
                                    </>
                                )}

                            </button>

                        </div>

                    </form>

                </section>

                {/* ==================================================
                    INFO
                ================================================== */}

                <div
                    className="
                        mt-8
                        p-5
                        rounded-2xl
                        bg-[#D4AF37]/5
                        border
                        border-[#D4AF37]/10
                    "
                >

                    <div
                        className="
                            flex
                            items-start
                            gap-4
                        "
                    >

                        <FaSave
                            className="
                                text-[#D4AF37]
                                mt-1
                            "
                        />

                        <div>

                            <p
                                className="
                                    font-semibold
                                    text-gray-300
                                "
                            >
                                Informasi
                            </p>

                            <p
                                className="
                                    text-gray-500
                                    text-sm
                                    mt-1
                                    leading-relaxed
                                "
                            >
                                QRIS dan data rekening
                                yang disimpan pada halaman
                                ini akan menjadi data
                                pembayaran aktif yang
                                digunakan pelanggan.
                            </p>

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default PengaturanPembayaran;