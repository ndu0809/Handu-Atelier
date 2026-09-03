import {
    useEffect,
    useState,
} from "react";

import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    FaArrowLeft,
    FaCalendarAlt,
    FaExclamationTriangle,
    FaTshirt,
} from "react-icons/fa";

import {
    getCostumes,
} from "./services/CostumeService";

function CostumeDetail() {
    const { code } = useParams();
    const navigate = useNavigate();

    const [costume, setCostume] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    // =============================================
    // FORMAT RUPIAH
    // =============================================

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

    // =============================================
    // IMAGE URL
    // =============================================

    const getImageUrl = (image) => {
        if (!image) {
            return "";
        }

        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        return image;
    };

    // =============================================
    // LOAD COSTUME BY CODE
    // =============================================

    useEffect(() => {
        let cancelled = false;

        const loadCostume = async () => {
            try {
                setLoading(true);
                setError("");
                setCostume(null);

                const data =
                    await getCostumes();

                if (cancelled) {
                    return;
                }

                const normalizedCode =
                    String(
                        code || ""
                    )
                        .trim()
                        .toLowerCase();

                const found =
                    data.find(
                        (item) =>
                            String(
                                item.code || ""
                            )
                                .trim()
                                .toLowerCase() ===
                            normalizedCode
                    );

                if (!found) {
                    setError(
                        `Kostum dengan kode ${code} tidak ditemukan.`
                    );

                    return;
                }

                setCostume(found);
            } catch (err) {
                console.error(
                    "Error detail kostum:",
                    err
                );

                if (!cancelled) {
                    setError(
                        err.message ||
                            "Gagal mengambil detail kostum."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadCostume();

        return () => {
            cancelled = true;
        };
    }, [code]);

    // =============================================
    // LOADING
    // =============================================

    if (loading) {
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
                    Memuat detail kostum...
                </p>
            </div>
        );
    }

    // =============================================
    // ERROR
    // =============================================

    if (error || !costume) {
        return (
            <div
                className="
                    min-h-screen
                    bg-[#090909]
                    text-white
                    pt-32
                    px-6
                    pb-20
                "
            >
                <div
                    className="
                        max-w-4xl
                        mx-auto
                    "
                >
                    <div
                        className="
                            rounded-3xl
                            bg-[#141414]
                            border
                            border-red-500/20
                            p-8
                        "
                    >
                        <FaExclamationTriangle
                            className="
                                text-red-400
                                text-4xl
                            "
                        />

                        <h1
                            className="
                                text-3xl
                                font-bold
                                mt-5
                            "
                        >
                            Kostum Tidak Ditemukan
                        </h1>

                        <p
                            className="
                                text-gray-500
                                mt-3
                            "
                        >
                            {error ||
                                "Data kostum tidak tersedia."}
                        </p>

                        <Link
                            to="/"
                            className="
                                inline-flex
                                items-center
                                gap-2
                                mt-7
                                px-5
                                py-3
                                rounded-xl
                                bg-[#D4AF37]
                                text-black
                                font-semibold
                            "
                        >
                            <FaArrowLeft />
                            Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // =============================================
    // DATA
    // =============================================

    const imageUrl =
        getImageUrl(
            costume.image
        );

    const available =
        costume.available === true &&
        Number(costume.stock) > 0;

    // =============================================
    // PINJAM
    // =============================================

    const handleBorrow = () => {
        if (!available) {
            return;
        }

        navigate(
            `/borrow/${encodeURIComponent(
                costume.code
            )}`
        );
    };

    // =============================================
    // RENDER
    // =============================================

    return (
        <div
            className="
                min-h-screen
                bg-[#090909]
                text-white
                pt-32
                px-6
                pb-20
            "
        >
            <main
                className="
                    max-w-7xl
                    mx-auto
                "
            >
                {/* BACK */}

                <Link
                    to="/"
                    className="
                        inline-flex
                        items-center
                        gap-2
                        text-gray-500
                        hover:text-[#D4AF37]
                        transition
                        mb-8
                    "
                >
                    <FaArrowLeft />
                    Kembali
                </Link>

                {/* DETAIL */}

                <div
                    className="
                        grid
                        lg:grid-cols-2
                        gap-10
                    "
                >
                    {/* FOTO */}

                    <div
                        className="
                            rounded-3xl
                            overflow-hidden
                            bg-[#141414]
                            border
                            border-white/5
                        "
                    >
                        <div
                            className="
                                aspect-[4/5]
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
                                        costume.costumeName
                                    }
                                    className="
                                        w-full
                                        h-full
                                        object-cover
                                    "
                                    onError={(e) => {
                                        e.currentTarget.style.display =
                                            "none";

                                        const parent =
                                            e.currentTarget
                                                .parentElement;

                                        if (
                                            parent &&
                                            !parent.querySelector(
                                                ".image-fallback"
                                            )
                                        ) {
                                            const fallback =
                                                document.createElement(
                                                    "div"
                                                );

                                            fallback.className =
                                                "image-fallback";

                                            parent.appendChild(
                                                fallback
                                            );
                                        }
                                    }}
                                />
                            ) : (
                                <FaTshirt
                                    className="
                                        text-7xl
                                        text-[#D4AF37]
                                    "
                                />
                            )}
                        </div>
                    </div>

                    {/* INFORMASI */}

                    <div>
                        <p
                            className="
                                text-[#D4AF37]
                                uppercase
                                tracking-[4px]
                                text-sm
                            "
                        >
                            {costume.collectionGroup ||
                                "Koleksi"}
                        </p>

                        <h1
                            className="
                                text-4xl
                                md:text-5xl
                                font-bold
                                mt-3
                            "
                        >
                            {
                                costume.costumeName
                            }
                        </h1>

                        <p
                            className="
                                text-gray-500
                                mt-3
                            "
                        >
                            {
                                costume.collectionName
                            }
                        </p>

                        {/* STATUS */}

                        <div className="mt-6">
                            <span
                                className={`
                                    inline-flex
                                    px-4
                                    py-2
                                    rounded-full
                                    text-sm
                                    font-semibold
                                    ${
                                        available
                                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                                    }
                                `}
                            >
                                {available
                                    ? "Tersedia"
                                    : "Tidak Tersedia"}
                            </span>
                        </div>

                        {/* HARGA */}

                        <div
                            className="
                                mt-8
                                rounded-2xl
                                bg-[#141414]
                                border
                                border-[#D4AF37]/15
                                p-6
                            "
                        >
                            <p
                                className="
                                    text-xs
                                    uppercase
                                    tracking-[3px]
                                    text-gray-600
                                "
                            >
                                Harga Sewa
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
                                    costume.price
                                )}
                            </p>
                        </div>

                        {/* DETAIL GRID */}

                        <div
                            className="
                                grid
                                sm:grid-cols-2
                                gap-4
                                mt-6
                            "
                        >
                            <div
                                className="
                                    rounded-2xl
                                    bg-[#141414]
                                    border
                                    border-white/5
                                    p-5
                                "
                            >
                                <p className="text-xs text-gray-600">
                                    Kode Koleksi
                                </p>

                                <p
                                    className="
                                        font-semibold
                                        text-[#D4AF37]
                                        mt-2
                                    "
                                >
                                    {costume.code ||
                                        "-"}
                                </p>
                            </div>

                            <div
                                className="
                                    rounded-2xl
                                    bg-[#141414]
                                    border
                                    border-white/5
                                    p-5
                                "
                            >
                                <p className="text-xs text-gray-600">
                                    Kategori
                                </p>

                                <p className="font-semibold mt-2">
                                    {costume.categoryName ||
                                        "-"}
                                </p>
                            </div>

                            <div
                                className="
                                    rounded-2xl
                                    bg-[#141414]
                                    border
                                    border-white/5
                                    p-5
                                "
                            >
                                <p className="text-xs text-gray-600">
                                    Ukuran
                                </p>

                                <p className="font-semibold mt-2">
                                    {costume.size ||
                                        "-"}
                                </p>
                            </div>

                            <div
                                className="
                                    rounded-2xl
                                    bg-[#141414]
                                    border
                                    border-white/5
                                    p-5
                                "
                            >
                                <p className="text-xs text-gray-600">
                                    Warna
                                </p>

                                <p className="font-semibold mt-2">
                                    {costume.color ||
                                        "-"}
                                </p>
                            </div>

                            <div
                                className="
                                    rounded-2xl
                                    bg-[#141414]
                                    border
                                    border-white/5
                                    p-5
                                "
                            >
                                <p className="text-xs text-gray-600">
                                    Stok
                                </p>

                                <p className="font-semibold mt-2">
                                    {
                                        costume.stock
                                    }
                                </p>
                            </div>
                        </div>

                        {/* DESKRIPSI */}

                        <div
                            className="
                                mt-6
                                rounded-2xl
                                bg-[#141414]
                                border
                                border-white/5
                                p-6
                            "
                        >
                            <p
                                className="
                                    text-xs
                                    uppercase
                                    tracking-[3px]
                                    text-gray-600
                                "
                            >
                                Deskripsi
                            </p>

                            <p
                                className="
                                    text-gray-400
                                    leading-7
                                    mt-3
                                "
                            >
                                {costume.description ||
                                    "Tidak ada deskripsi kostum."}
                            </p>
                        </div>

                        {/* TOMBOL PINJAM */}

                        <div
                            className="
                                mt-8
                                flex
                                flex-col
                                sm:flex-row
                                gap-3
                            "
                        >
                            <button
                                type="button"
                                onClick={
                                    handleBorrow
                                }
                                disabled={
                                    !available
                                }
                                className="
                                    flex-1
                                    px-6
                                    py-4
                                    rounded-xl
                                    bg-[#D4AF37]
                                    text-black
                                    font-bold
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    disabled:opacity-40
                                    disabled:cursor-not-allowed
                                "
                            >
                                <FaCalendarAlt />

                                {available
                                    ? "Pinjam Kostum"
                                    : "Kostum Tidak Tersedia"}
                            </button>

                            <Link
                                to="/"
                                className="
                                    px-6
                                    py-4
                                    rounded-xl
                                    border
                                    border-white/10
                                    text-gray-400
                                    text-center
                                    hover:text-white
                                "
                            >
                                Kembali
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default CostumeDetail;