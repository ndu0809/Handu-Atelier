import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaExclamationTriangle,
    FaSearch,
    FaTshirt,
} from "react-icons/fa";

import { getCostumes } from "../services/CostumeService";

function CategoryPage() {
    const { slug } = useParams();

    // =====================================================
    // STATE
    // =====================================================

    const [costumes, setCostumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    // =====================================================
    // NORMALISASI SLUG
    // =====================================================

    const normalizeText = (value) => {
        return String(value || "")
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-");
    };

    // =====================================================
    // NAMA KATEGORI
    // =====================================================

    const categoryName = useMemo(() => {
        if (!slug) {
            return "";
        }

        return String(slug)
            .replace(/-/g, " ")
            .replace(/\b\w/g, (char) =>
                char.toUpperCase()
            );
    }, [slug]);

    // =====================================================
    // AMBIL DATA KOSTUM
    // =====================================================

    useEffect(() => {
        let cancelled = false;

        const loadCostumes = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getCostumes();

                if (!cancelled) {
                    setCostumes(
                        Array.isArray(data)
                            ? data
                            : []
                    );
                }
            } catch (err) {
                console.error(
                    "Error CategoryPage:",
                    err
                );

                if (!cancelled) {
                    setError(
                        err.message ||
                            "Gagal mengambil data kostum."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadCostumes();

        return () => {
            cancelled = true;
        };
    }, []);

    // =====================================================
    // FILTER BERDASARKAN KATEGORI
    // =====================================================

    const categoryCostumes = useMemo(() => {
        const currentSlug =
            normalizeText(slug);

        if (!currentSlug) {
            return costumes;
        }

        return costumes.filter((costume) => {
            const costumeCategory =
                normalizeText(
                    costume.categoryName
                );

            return (
                costumeCategory ===
                currentSlug
            );
        });
    }, [costumes, slug]);

    // =====================================================
    // SEARCH
    // =====================================================

    const filteredCostumes = useMemo(() => {
        const keyword =
            search
                .trim()
                .toLowerCase();

        if (!keyword) {
            return categoryCostumes;
        }

        return categoryCostumes.filter(
            (costume) => {
                return (
                    String(
                        costume.costumeName ||
                            ""
                    )
                        .toLowerCase()
                        .includes(keyword) ||

                    String(
                        costume.collectionName ||
                            ""
                    )
                        .toLowerCase()
                        .includes(keyword) ||

                    String(
                        costume.collectionGroup ||
                            ""
                    )
                        .toLowerCase()
                        .includes(keyword) ||

                    String(
                        costume.color ||
                            ""
                    )
                        .toLowerCase()
                        .includes(keyword) ||

                    String(
                        costume.code ||
                            ""
                    )
                        .toLowerCase()
                        .includes(keyword)
                );
            }
        );
    }, [
        categoryCostumes,
        search,
    ]);

    // =====================================================
    // FORMAT RUPIAH
    // =====================================================

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

    // =====================================================
    // IMAGE URL
    // =====================================================

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

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div
                className="
                    min-h-screen
                    bg-[#090909]
                    text-white
                    pt-36
                    px-6
                "
            >
                <div className="max-w-7xl mx-auto">
                    <p
                        className="
                            text-[#D4AF37]
                            uppercase
                            tracking-[5px]
                            text-sm
                        "
                    >
                        Kategori
                    </p>

                    <h1
                        className="
                            text-4xl
                            md:text-5xl
                            font-bold
                            mt-4
                        "
                    >
                        {categoryName}
                    </h1>

                    <div
                        className="
                            mt-12
                            text-gray-500
                        "
                    >
                        Memuat koleksi kostum...
                    </div>
                </div>
            </div>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {
        return (
            <div
                className="
                    min-h-screen
                    bg-[#090909]
                    text-white
                    pt-36
                    px-6
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
                            border
                            border-red-500/20
                            bg-red-500/10
                            p-8
                        "
                    >
                        <FaExclamationTriangle
                            className="
                                text-red-400
                                text-3xl
                            "
                        />

                        <h1
                            className="
                                text-2xl
                                font-bold
                                mt-4
                            "
                        >
                            Gagal Memuat Kostum
                        </h1>

                        <p
                            className="
                                text-red-300
                                mt-3
                            "
                        >
                            {error}
                        </p>

                        <Link
                            to="/"
                            className="
                                inline-flex
                                items-center
                                gap-2
                                mt-6
                                px-5
                                py-3
                                rounded-xl
                                bg-[#D4AF37]
                                text-black
                                font-semibold
                            "
                        >
                            <FaArrowLeft />
                            Kembali
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div
            className="
                min-h-screen
                bg-[#090909]
                text-white
                pt-36
                px-6
                pb-20
            "
        >
            <div className="max-w-7xl mx-auto">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div
                    className="
                        flex
                        flex-col
                        md:flex-row
                        md:items-end
                        md:justify-between
                        gap-6
                    "
                >
                    <div>
                        <p
                            className="
                                text-[#D4AF37]
                                uppercase
                                tracking-[5px]
                                text-sm
                            "
                        >
                            Kategori
                        </p>

                        <h1
                            className="
                                text-4xl
                                md:text-5xl
                                font-bold
                                mt-4
                                capitalize
                            "
                        >
                            {categoryName}
                        </h1>

                        <p
                            className="
                                text-gray-400
                                mt-4
                                max-w-2xl
                            "
                        >
                            Temukan koleksi kostum
                            dalam kategori{" "}
                            <span className="text-white">
                                {categoryName}
                            </span>
                            .
                        </p>
                    </div>

                    <Link
                        to="/"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            px-5
                            py-3
                            rounded-xl
                            border
                            border-white/10
                            text-gray-400
                            hover:text-[#D4AF37]
                            hover:border-[#D4AF37]/30
                            transition
                        "
                    >
                        <FaArrowLeft />
                        Kembali
                    </Link>
                </div>

                {/* =================================================
                    SEARCH
                ================================================= */}

                <div
                    className="
                        mt-10
                        rounded-3xl
                        bg-[#141414]
                        border
                        border-white/5
                        p-5
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
                            placeholder="
                                Cari nama kostum,
                                koleksi, kode,
                                atau warna...
                            "
                            className="
                                w-full
                                pl-11
                                pr-4
                                py-3.5
                                rounded-xl
                                bg-[#1D1D1D]
                                border
                                border-white/10
                                text-white
                                outline-none
                                focus:border-[#D4AF37]
                            "
                        />
                    </div>
                </div>

                {/* =================================================
                    RESULT INFO
                ================================================= */}

                <div
                    className="
                        mt-8
                        flex
                        items-center
                        justify-between
                    "
                >
                    <div>
                        <p
                            className="
                                text-gray-500
                                text-sm
                            "
                        >
                            Menampilkan
                        </p>

                        <p
                            className="
                                text-xl
                                font-semibold
                                mt-1
                            "
                        >
                            {filteredCostumes.length}{" "}
                            Kostum
                        </p>
                    </div>
                </div>

                {/* =================================================
                    EMPTY
                ================================================= */}

                {filteredCostumes.length ===
                    0 && (
                    <div
                        className="
                            mt-8
                            rounded-3xl
                            bg-[#141414]
                            border
                            border-white/5
                            py-20
                            px-6
                            text-center
                        "
                    >
                        <FaTshirt
                            className="
                                mx-auto
                                text-5xl
                                text-[#D4AF37]
                            "
                        />

                        <h2
                            className="
                                text-2xl
                                font-bold
                                mt-5
                            "
                        >
                            Kostum Tidak Ditemukan
                        </h2>

                        <p
                            className="
                                text-gray-500
                                mt-3
                            "
                        >
                            Belum ada kostum dalam
                            kategori ini atau tidak
                            ada hasil pencarian yang
                            sesuai.
                        </p>
                    </div>
                )}

                {/* =================================================
                    COSTUME GRID
                ================================================= */}

                {filteredCostumes.length >
                    0 && (
                    <div
                        className="
                            grid
                            sm:grid-cols-2
                            lg:grid-cols-3
                            xl:grid-cols-4
                            gap-6
                            mt-8
                        "
                    >
                        {filteredCostumes.map(
                            (costume) => {
                                const imageUrl =
                                    getImageUrl(
                                        costume.image
                                    );

                                return (
                                    <Link
                                        key={
                                            costume.id
                                        }
                                        to={`/costume/${encodeURIComponent(
                                            costume.code
                                        )}`}
                                        className="
                                            group
                                            rounded-3xl
                                            overflow-hidden
                                            bg-[#141414]
                                            border
                                            border-white/5
                                            hover:border-[#D4AF37]/30
                                            transition
                                        "
                                    >
                                        {/* FOTO */}

                                        <div
                                            className="
                                                relative
                                                aspect-[4/5]
                                                bg-[#1D1D1D]
                                                overflow-hidden
                                            "
                                        >
                                            {imageUrl ? (
                                                <img
                                                    src={
                                                        imageUrl
                                                    }
                                                    alt={
                                                        costume.costumeName
                                                    }
                                                    className="
                                                        w-full
                                                        h-full
                                                        object-cover
                                                        group-hover:scale-105
                                                        transition
                                                        duration-500
                                                    "
                                                    onError={(
                                                        e
                                                    ) => {
                                                        e.currentTarget.style.display =
                                                            "none";
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    className="
                                                        w-full
                                                        h-full
                                                        flex
                                                        items-center
                                                        justify-center
                                                    "
                                                >
                                                    <FaTshirt
                                                        className="
                                                            text-5xl
                                                            text-[#D4AF37]
                                                        "
                                                    />
                                                </div>
                                            )}

                                            {/* STATUS */}

                                            <div
                                                className="
                                                    absolute
                                                    top-4
                                                    left-4
                                                "
                                            >
                                                <span
                                                    className={`
                                                        px-3
                                                        py-1.5
                                                        rounded-full
                                                        text-xs
                                                        font-semibold
                                                        backdrop-blur
                                                        ${
                                                            costume.available
                                                                ? "bg-green-500/80 text-white"
                                                                : "bg-red-500/80 text-white"
                                                        }
                                                    `}
                                                >
                                                    {costume.available
                                                        ? "Tersedia"
                                                        : "Tidak Tersedia"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* INFO */}

                                        <div className="p-5">
                                            <p
                                                className="
                                                    text-xs
                                                    text-[#D4AF37]
                                                    uppercase
                                                    tracking-[2px]
                                                "
                                            >
                                                {
                                                    costume.collectionGroup
                                                }
                                            </p>

                                            <h2
                                                className="
                                                    text-xl
                                                    font-bold
                                                    mt-2
                                                    group-hover:text-[#D4AF37]
                                                    transition
                                                "
                                            >
                                                {
                                                    costume.costumeName
                                                }
                                            </h2>

                                            <p
                                                className="
                                                    text-gray-500
                                                    text-sm
                                                    mt-1
                                                "
                                            >
                                                {
                                                    costume.collectionName
                                                }
                                            </p>

                                            {/* DETAIL */}

                                            <div
                                                className="
                                                    grid
                                                    grid-cols-2
                                                    gap-3
                                                    mt-5
                                                "
                                            >
                                                <div>
                                                    <p className="text-xs text-gray-600">
                                                        Warna
                                                    </p>

                                                    <p className="text-sm text-gray-300 mt-1">
                                                        {costume.color ||
                                                            "-"}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-gray-600">
                                                        Ukuran
                                                    </p>

                                                    <p className="text-sm text-gray-300 mt-1">
                                                        {costume.size ||
                                                            "-"}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* HARGA */}

                                            <div className="mt-6">
                                                <p className="text-xs text-gray-600">
                                                    Harga Sewa
                                                </p>

                                                <p
                                                    className="
                                                        text-lg
                                                        font-bold
                                                        text-[#D4AF37]
                                                        mt-1
                                                    "
                                                >
                                                    {formatRupiah(
                                                        costume.price
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            }
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CategoryPage;