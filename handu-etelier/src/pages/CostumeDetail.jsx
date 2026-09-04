import {
    useEffect,
    useState,
} from "react";

import {
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

    const [costume, setCostume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


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
    // IMAGE URL
    // ==================================================

    const getImageUrl = (image) => {
        if (!image) {
            return "";
        }

        const value = String(image).trim();

        if (!value) {
            return "";
        }

        if (
            value.startsWith("http://") ||
            value.startsWith("https://")
        ) {
            return value;
        }

        if (value.startsWith("/")) {
            return value;
        }

        return `/${value}`;
    };


    // ==================================================
    // KEMBALI KE HALAMAN KOLEKSI
    // ==================================================

    const handleBackToCollection = () => {
        navigate("/collections");
    };


    // ==================================================
    // LOAD DATA KOSTUM
    // ==================================================

    useEffect(() => {
        let cancelled = false;

        const loadCostume = async () => {
            try {
                setLoading(true);
                setError("");
                setCostume(null);

                const data = await getCostumes();

                if (cancelled) {
                    return;
                }

                const normalizedCode =
                    String(code || "")
                        .trim()
                        .toLowerCase();

                const found =
                    Array.isArray(data)
                        ? data.find(
                            (item) =>
                                String(
                                    item.code || ""
                                )
                                    .trim()
                                    .toLowerCase() ===
                                normalizedCode
                        )
                        : null;

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
                        err?.message ||
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


    // ==================================================
    // LOADING
    // ==================================================

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


    // ==================================================
    // ERROR
    // ==================================================

    if (error || !costume) {
        return (
            <div
                className="
                    min-h-screen
                    bg-[#090909]
                    text-white
                    pt-40
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

                        <button
                            type="button"
                            onClick={
                                handleBackToCollection
                            }
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                mt-7
                                px-6
                                py-3
                                rounded-xl
                                bg-[#D4AF37]
                                text-black
                                font-semibold
                                hover:bg-[#e2bd43]
                                transition
                                cursor-pointer
                            "
                        >
                            <FaArrowLeft />

                            Kembali ke Koleksi
                        </button>
                    </div>
                </div>
            </div>
        );
    }


    // ==================================================
    // DATA
    // ==================================================

    const imageUrl =
        getImageUrl(
            costume.image
        );

    const available =
        costume.available === true &&
        Number(costume.stock) > 0;


    // ==================================================
    // HANDLE PEMINJAMAN
    // ==================================================

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
                CONTENT
            ================================================== */}

            <main
                className="
                    max-w-7xl
                    mx-auto
                    px-6
                    pt-52
                    pb-20
                "
            >

                {/* ==================================================
                    TOMBOL KEMBALI KE KOLEKSI
                ================================================== */}

                <div className="mb-8">

                    <button
                        type="button"
                        onClick={
                            handleBackToCollection
                        }
                        className="
                            group
                            inline-flex
                            items-center
                            gap-3
                            px-5
                            py-3
                            rounded-full
                            bg-[#141414]
                            border
                            border-[#D4AF37]/40
                            text-[#D4AF37]
                            text-sm
                            font-semibold
                            shadow-lg
                            shadow-black/20
                            hover:bg-[#D4AF37]
                            hover:text-black
                            hover:border-[#D4AF37]
                            transition-all
                            duration-300
                            cursor-pointer
                        "
                    >

                        <span
                            className="
                                flex
                                items-center
                                justify-center
                                w-7
                                h-7
                                rounded-full
                                border
                                border-[#D4AF37]/40
                                group-hover:border-black/20
                                transition-all
                                duration-300
                            "
                        >
                            <FaArrowLeft
                                className="
                                    text-[11px]
                                    transition-transform
                                    duration-300
                                    group-hover:-translate-x-1
                                "
                            />
                        </span>

                        <span>
                            Kembali ke Koleksi
                        </span>

                    </button>

                </div>


                {/* ==================================================
                    DETAIL KOSTUM
                ================================================== */}

                <div
                    className="
                        grid
                        lg:grid-cols-2
                        gap-10
                        items-start
                    "
                >

                    {/* ==================================================
                        FOTO KOSTUM
                    ================================================== */}

                    <div
                        className="
                            rounded-3xl
                            overflow-hidden
                            bg-[#141414]
                            border
                            border-white/5
                            shadow-2xl
                            shadow-black/30
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
                                        costume.costumeName ||
                                        "Kostum"
                                    }
                                    className="
                                        w-full
                                        h-full
                                        object-cover
                                    "
                                    onError={(event) => {
                                        event.currentTarget.style.display =
                                            "none";

                                        const parent =
                                            event.currentTarget
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
                                                "image-fallback flex items-center justify-center w-full h-full";

                                            const icon =
                                                document.createElement(
                                                    "div"
                                                );

                                            icon.textContent =
                                                "Kostum";

                                            icon.style.color =
                                                "#D4AF37";

                                            icon.style.fontSize =
                                                "24px";

                                            fallback.appendChild(
                                                icon
                                            );

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


                    {/* ==================================================
                        INFORMASI KOSTUM
                    ================================================== */}

                    <div>

                        {/* ==================================================
                            COLLECTION
                        ================================================== */}

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


                        {/* ==================================================
                            NAMA KOSTUM
                        ================================================== */}

                        <h1
                            className="
                                text-4xl
                                md:text-5xl
                                font-bold
                                mt-3
                            "
                        >
                            {costume.costumeName ||
                                "Nama Kostum"}
                        </h1>


                        {/* ==================================================
                            NAMA COLLECTION
                        ================================================== */}

                        <p
                            className="
                                text-gray-400
                                mt-3
                                text-base
                            "
                        >
                            {costume.collectionName ||
                                "-"}
                        </p>


                        {/* ==================================================
                            STATUS
                        ================================================== */}

                        <div className="mt-6">

                            <span
                                className={`
                                    inline-flex
                                    items-center
                                    px-4
                                    py-2
                                    rounded-full
                                    text-sm
                                    font-semibold
                                    border

                                    ${
                                        available
                                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                                            : "bg-red-500/10 text-red-400 border-red-500/20"
                                    }
                                `}
                            >

                                <span className="mr-1">
                                    •
                                </span>

                                {available
                                    ? "Tersedia"
                                    : "Tidak Tersedia"}

                            </span>

                        </div>


                        {/* ==================================================
                            HARGA
                        ================================================== */}

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
                                    text-gray-500
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


                        {/* ==================================================
                            DETAIL GRID
                        ================================================== */}

                        <div
                            className="
                                grid
                                sm:grid-cols-2
                                gap-4
                                mt-6
                            "
                        >

                            {/* ==================================================
                                KODE KOLEKSI
                            ================================================== */}

                            <div
                                className="
                                    rounded-2xl
                                    bg-[#141414]
                                    border
                                    border-white/5
                                    p-5
                                "
                            >

                                <p
                                    className="
                                        text-xs
                                        text-gray-500
                                    "
                                >
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


                            {/* ==================================================
                                KATEGORI
                            ================================================== */}

                            <div
                                className="
                                    rounded-2xl
                                    bg-[#141414]
                                    border
                                    border-white/5
                                    p-5
                                "
                            >

                                <p
                                    className="
                                        text-xs
                                        text-gray-500
                                    "
                                >
                                    Kategori
                                </p>

                                <p
                                    className="
                                        font-semibold
                                        mt-2
                                    "
                                >
                                    {costume.categoryName ||
                                        "-"}
                                </p>

                            </div>


                            {/* ==================================================
                                UKURAN
                            ================================================== */}

                            <div
                                className="
                                    rounded-2xl
                                    bg-[#141414]
                                    border
                                    border-white/5
                                    p-5
                                "
                            >

                                <p
                                    className="
                                        text-xs
                                        text-gray-500
                                    "
                                >
                                    Ukuran
                                </p>

                                <p
                                    className="
                                        font-semibold
                                        mt-2
                                    "
                                >
                                    {costume.size ||
                                        "-"}
                                </p>

                            </div>


                            {/* ==================================================
                                WARNA
                            ================================================== */}

                            <div
                                className="
                                    rounded-2xl
                                    bg-[#141414]
                                    border
                                    border-white/5
                                    p-5
                                "
                            >

                                <p
                                    className="
                                        text-xs
                                        text-gray-500
                                    "
                                >
                                    Warna
                                </p>

                                <p
                                    className="
                                        font-semibold
                                        mt-2
                                    "
                                >
                                    {costume.color ||
                                        "-"}
                                </p>

                            </div>


                            {/* ==================================================
                                STOK
                            ================================================== */}

                            <div
                                className="
                                    rounded-2xl
                                    bg-[#141414]
                                    border
                                    border-white/5
                                    p-5
                                "
                            >

                                <p
                                    className="
                                        text-xs
                                        text-gray-500
                                    "
                                >
                                    Stok
                                </p>

                                <p
                                    className="
                                        font-semibold
                                        mt-2
                                    "
                                >
                                    {costume.stock ??
                                        0}
                                </p>

                            </div>

                        </div>


                        {/* ==================================================
                            DESKRIPSI
                        ================================================== */}

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
                                    text-gray-500
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


                        {/* ==================================================
                            TOMBOL AJUKAN PEMINJAMAN
                        ================================================== */}

                        <div
                            className="
                                mt-8
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
                                    w-full
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
                                    hover:bg-[#e2bd43]
                                    transition-all
                                    duration-300
                                    disabled:opacity-40
                                    disabled:cursor-not-allowed
                                "
                            >

                                <FaCalendarAlt />

                                {available
                                    ? "Ajukan Peminjaman"
                                    : "Kostum Tidak Tersedia"}

                            </button>

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}


export default CostumeDetail;