import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";

function CostumeDetail() {
    const { code } = useParams();
    const navigate = useNavigate();

    const [costume, setCostume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ======================================================
    // AMBIL DATA KOSTUM
    // ======================================================

    useEffect(() => {
        const fetchCostume = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(`/kostum/${code}`, {
                    headers: {
                        Accept: "application/json",
                    },
                    cache: "no-store",
                });

                const result = await response.json();

                console.log("DETAIL KOSTUM:", result);

                if (!response.ok) {
                    throw new Error(
                        result?.message ||
                        "Kostum tidak ditemukan."
                    );
                }

                const data =
                    result?.data ||
                    result?.kostum ||
                    result;

                if (!data || !data.id_kostum) {
                    throw new Error(
                        "Data kostum tidak valid."
                    );
                }

                setCostume(data);
            } catch (err) {
                console.error(
                    "ERROR DETAIL KOSTUM:",
                    err
                );

                setError(
                    err?.message ||
                    "Data kostum tidak dapat dimuat."
                );

                setCostume(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCostume();
    }, [code]);

    // ======================================================
    // FOTO KOSTUM
    // ======================================================

    const getFotoUrl = (foto) => {
        if (!foto) {
            return "";
        }

        const value = String(foto).trim();

        if (!value) {
            return "";
        }

        // URL lengkap
        if (
            value.startsWith("http://") ||
            value.startsWith("https://")
        ) {
            return value;
        }

        // Sudah berupa /uploads/...
        if (value.startsWith("/uploads/")) {
            return value;
        }

        // Berupa uploads/...
        if (value.startsWith("uploads/")) {
            return `/${value}`;
        }

        // Nama file saja
        return `/uploads/kostum/${value}`;
    };

    // ======================================================
    // STATUS KOSTUM
    // ======================================================

    const isAvailable =
        String(costume?.status || "")
            .toLowerCase() === "tersedia" &&
        Number(costume?.stok || 0) > 0;

    // ======================================================
    // HARGA
    // ======================================================

    const hargaPerHari =
        Number(costume?.harga_sewa) || 0;

    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-[#090909] text-white">
                <Navbar />

                <main
                    className="
                        min-h-screen
                        flex
                        items-center
                        justify-center
                        px-6
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

                        <p className="text-gray-400 mt-5">
                            Memuat data kostum...
                        </p>
                    </div>
                </main>
            </div>
        );
    }

    // ======================================================
    // KOSTUM TIDAK DITEMUKAN
    // ======================================================

    if (!costume) {
        return (
            <div className="min-h-screen bg-[#090909] text-white">
                <Navbar />

                <main
                    className="
                        min-h-screen
                        flex
                        items-center
                        justify-center
                        px-6
                    "
                >
                    <div className="text-center">
                        <p
                            className="
                                text-[#D4AF37]
                                uppercase
                                tracking-[5px]
                                text-sm
                            "
                        >
                            Handu Atelier
                        </p>

                        <h1
                            className="
                                text-3xl
                                md:text-4xl
                                font-bold
                                mt-4
                            "
                        >
                            Kostum Tidak Ditemukan
                        </h1>

                        <p className="text-gray-400 mt-4">
                            {error ||
                                "Data kostum tidak tersedia."}
                        </p>

                        {/* ==================================================
                            KEMBALI KE FOTO KE-3 / SECTION COLLECTIONS
                        ================================================== */}

                        <a
                            href="/#collections"
                            className="
                                inline-flex
                                items-center
                                justify-center
                                mt-7
                                px-6
                                py-3
                                rounded-xl
                                bg-[#D4AF37]
                                text-black
                                font-semibold
                                hover:scale-[1.02]
                                transition
                            "
                        >
                            Kembali ke Koleksi
                        </a>
                    </div>
                </main>
            </div>
        );
    }

    // ======================================================
    // FOTO
    // ======================================================

    const imageUrl = getFotoUrl(
        costume.foto
    );

    // ======================================================
    // TAMPILAN UTAMA
    // ======================================================

    return (
        <div
            className="
                min-h-screen
                bg-[#090909]
                text-white
            "
        >
            <Navbar />

            <main
                className="
                    pt-28
                    md:pt-32
                    pb-20
                    px-6
                "
            >
                <div
                    className="
                        max-w-6xl
                        mx-auto
                    "
                >

                    {/* ==================================================
                        KEMBALI KE FOTO KE-3
                    ================================================== */}

                    <div className="mb-8">
                        <a
                            href="/#collections"
                            className="
                                inline-flex
                                items-center
                                gap-2
                                text-[#D4AF37]
                                hover:text-white
                                transition
                            "
                        >
                            ← Kembali ke koleksi
                        </a>
                    </div>

                    {/* ==================================================
                        DETAIL CARD
                    ================================================== */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            lg:grid-cols-2
                            rounded-3xl
                            overflow-hidden
                            border
                            border-[#D4AF37]/20
                            bg-[#141414]
                        "
                    >

                        {/* ==================================================
                            FOTO
                        ================================================== */}

                        <div
                            className="
                                relative
                                min-h-[500px]
                                lg:min-h-[650px]
                                bg-[#1D1D1D]
                                flex
                                items-center
                                justify-center
                            "
                        >
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={
                                        costume.nama_kostum ||
                                        "Foto kostum"
                                    }
                                    className="
                                        w-full
                                        h-full
                                        min-h-[500px]
                                        lg:min-h-[650px]
                                        object-cover
                                    "
                                    onError={(e) => {
                                        e.currentTarget.style.display =
                                            "none";

                                        const fallback =
                                            e.currentTarget
                                                .parentElement
                                                ?.querySelector(
                                                    ".image-fallback"
                                                );

                                        if (fallback) {
                                            fallback.style.display =
                                                "flex";
                                        }
                                    }}
                                />
                            ) : null}

                            <div
                                className="
                                    image-fallback
                                    absolute
                                    inset-0
                                    items-center
                                    justify-center
                                    text-gray-500
                                    text-center
                                    px-6
                                "
                                style={{
                                    display: imageUrl
                                        ? "none"
                                        : "flex",
                                }}
                            >
                                <div>
                                    <p className="text-lg">
                                        Foto tidak tersedia
                                    </p>

                                    <p className="text-sm mt-2 text-gray-600">
                                        Foto kostum belum tersedia.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ==================================================
                            INFORMASI
                        ================================================== */}

                        <div
                            className="
                                p-8
                                md:p-10
                                lg:p-12
                                flex
                                flex-col
                                justify-center
                            "
                        >

                            {/* LABEL */}

                            <p
                                className="
                                    uppercase
                                    tracking-[5px]
                                    text-[#D4AF37]
                                    text-sm
                                "
                            >
                                Collection
                            </p>

                            {/* NAMA KOLEKSI */}

                            <h1
                                className="
                                    text-4xl
                                    md:text-5xl
                                    font-bold
                                    mt-4
                                "
                            >
                                {costume.nama_koleksi ||
                                    costume.nama_kostum ||
                                    "Kostum"}
                            </h1>

                            {/* NAMA KOSTUM */}

                            <p
                                className="
                                    text-gray-400
                                    text-base
                                    md:text-lg
                                    mt-3
                                "
                            >
                                {costume.nama_kostum ||
                                    costume.nama_kategori ||
                                    "-"}
                            </p>

                            {/* ==================================================
                                KODE KOLEKSI
                            ================================================== */}

                            {costume.kode_koleksi && (
                                <div className="mt-8">
                                    <p
                                        className="
                                            text-gray-500
                                            text-sm
                                        "
                                    >
                                        Kode Koleksi
                                    </p>

                                    <p
                                        className="
                                            text-[#D4AF37]
                                            font-semibold
                                            mt-1
                                        "
                                    >
                                        {costume.kode_koleksi}
                                    </p>
                                </div>
                            )}

                            {/* ==================================================
                                DESKRIPSI
                            ================================================== */}

                            <div className="mt-7">
                                <p
                                    className="
                                        text-gray-500
                                        text-sm
                                    "
                                >
                                    Deskripsi
                                </p>

                                <p
                                    className="
                                        text-gray-300
                                        leading-7
                                        mt-2
                                    "
                                >
                                    {costume.deskripsi ||
                                        costume.deskripsi_koleksi ||
                                        "Tidak ada deskripsi kostum."}
                                </p>
                            </div>

                            {/* ==================================================
                                HARGA
                            ================================================== */}

                            <div
                                className="
                                    mt-8
                                    pt-6
                                    border-t
                                    border-white/10
                                "
                            >
                                <p
                                    className="
                                        text-gray-500
                                        text-sm
                                    "
                                >
                                    Harga Sewa
                                </p>

                                <p
                                    className="
                                        text-3xl
                                        md:text-4xl
                                        font-bold
                                        text-[#D4AF37]
                                        mt-2
                                    "
                                >
                                    Rp{" "}
                                    {hargaPerHari.toLocaleString(
                                        "id-ID"
                                    )}
                                </p>
                            </div>

                            {/* ==================================================
                                INFORMASI DETAIL
                            ================================================== */}

                            <div
                                className="
                                    grid
                                    grid-cols-2
                                    gap-x-8
                                    gap-y-6
                                    mt-7
                                    pt-6
                                    border-t
                                    border-white/10
                                "
                            >

                                {/* STOK */}

                                <div>
                                    <p
                                        className="
                                            text-gray-500
                                            text-sm
                                        "
                                    >
                                        Stok
                                    </p>

                                    <p className="mt-1">
                                        {costume.stok ?? 0}
                                    </p>
                                </div>

                                {/* STATUS */}

                                <div>
                                    <p
                                        className="
                                            text-gray-500
                                            text-sm
                                        "
                                    >
                                        Status
                                    </p>

                                    <p
                                        className={`
                                            mt-1
                                            ${
                                                isAvailable
                                                    ? "text-green-400"
                                                    : "text-red-400"
                                            }
                                        `}
                                    >
                                        <span className="mr-1">
                                            •
                                        </span>

                                        {isAvailable
                                            ? "Tersedia"
                                            : "Tidak tersedia"}
                                    </p>
                                </div>

                                {/* UKURAN */}

                                <div>
                                    <p
                                        className="
                                            text-gray-500
                                            text-sm
                                        "
                                    >
                                        Ukuran
                                    </p>

                                    <p className="mt-1">
                                        {costume.ukuran ||
                                            "-"}
                                    </p>
                                </div>

                                {/* WARNA */}

                                <div>
                                    <p
                                        className="
                                            text-gray-500
                                            text-sm
                                        "
                                    >
                                        Warna
                                    </p>

                                    <p className="mt-1">
                                        {costume.warna ||
                                            "-"}
                                    </p>
                                </div>

                            </div>

                            {/* ==================================================
                                BUTTON PEMINJAMAN
                            ================================================== */}

                            <div className="mt-9">

                                {isAvailable ? (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                `/borrow/${costume.id_kostum}`
                                            )
                                        }
                                        className="
                                            w-full
                                            px-6
                                            py-4
                                            rounded-xl
                                            bg-[#D4AF37]
                                            text-black
                                            font-semibold
                                            hover:bg-[#e0bd42]
                                            hover:scale-[1.01]
                                            transition
                                        "
                                    >
                                        Ajukan Peminjaman
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        disabled
                                        className="
                                            w-full
                                            px-6
                                            py-4
                                            rounded-xl
                                            bg-gray-700
                                            text-gray-400
                                            font-semibold
                                            cursor-not-allowed
                                        "
                                    >
                                        Kostum Tidak Tersedia
                                    </button>
                                )}

                            </div>

                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

export default CostumeDetail;