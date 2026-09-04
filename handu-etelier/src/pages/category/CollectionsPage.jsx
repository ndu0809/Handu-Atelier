import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import {
    FaTshirt,
    FaCrown,
    FaStar,
    FaUserTie,
    FaArrowLeft
} from "react-icons/fa";


// ======================================================
// GAMBAR KATEGORI LAMA
// ======================================================

const categoryImages =
    import.meta.glob(
        "../../assets/images/costumes/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}",
        {
            eager: true,
            query: "?url",
            import: "default",
        }
    );


// ======================================================
// SLUG
// ======================================================

function makeSlug(value) {

    return String(value || "")
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .replace(
            /[^a-z0-9]+/g,
            "-"
        )
        .replace(
            /^-+|-+$/g,
            "");

}


// ======================================================
// CARI GAMBAR LOKAL
// ======================================================

function findLocalImage(slug) {

    const keywordMap = {

        traditional: [
            "tingkuluak",
            "suntiang",
            "traditional",
            "tradisional",
            "adat"
        ],

        modern: [
            "modern",
            "dress",
            "awards",
            "fashion"
        ],

        classic: [
            "bridgerton",
            "classic",
            "vintage"
        ],

        formal: [
            "tuxedo",
            "formal",
            "jas"
        ],

    };


    const keywords =
        keywordMap[slug] || [];


    for (
        const [
            path,
            imageUrl
        ]
        of Object.entries(
            categoryImages
        )
    ) {

        const filename =
            path
                .split("/")
                .pop()
                .toLowerCase();


        const found =
            keywords.some(
                (keyword) =>
                    filename.includes(
                        keyword
                    )
            );


        if (found) {

            return imageUrl;

        }

    }


    return null;

}


// ======================================================
// URL FOTO DATABASE
// ======================================================

function getDatabaseImageUrl(foto) {

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


    return `/uploads/koleksi/${value}`;

}


// ======================================================
// DATA PRESENTASI KOLEKSI LAMA
//
// INI BUKAN DATA DATABASE.
// HANYA UNTUK ICON/SUBTITLE/DESKRIPSI FALLBACK.
// ======================================================

const legacyMeta = {

    traditional: {

        subtitle:
            "Warisan Budaya",

        description:
            "Koleksi busana tradisional dengan karakter budaya Nusantara yang elegan dan berkelas.",

        icon:
            FaCrown,

    },


    modern: {

        subtitle:
            "Modern Elegance",

        description:
            "Koleksi modern untuk berbagai acara dengan desain elegan, stylish, dan contemporary.",

        icon:
            FaTshirt,

    },


    classic: {

        subtitle:
            "Timeless Beauty",

        description:
            "Koleksi klasik dengan nuansa vintage dan elegansi yang tetap menarik sepanjang masa.",

        icon:
            FaStar,

    },


    formal: {

        subtitle:
            "Formal Attire",

        description:
            "Pilihan busana formal yang sophisticated untuk acara resmi dan momen istimewa.",

        icon:
            FaUserTie,

    },

};


// ======================================================
// COMPONENT
// ======================================================

function CollectionsPage() {

    const [
        collections,
        setCollections
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    // ==================================================
    // LOAD DATABASE
    // ==================================================

    useEffect(() => {

        let cancelled = false;


        const loadCollections =
            async () => {

                try {

                    setLoading(true);
                    setError("");


                    const response =
                        await fetch(
                            `/api/koleksi?_=${Date.now()}`,
                            {
                                method: "GET",
                                cache: "no-store",
                                headers: {
                                    Accept:
                                        "application/json",
                                },
                            }
                        );


                    if (!response.ok) {

                        throw new Error(
                            `Gagal mengambil koleksi (${response.status})`
                        );

                    }


                    const result =
                        await response.json();


                    let data = [];


                    if (
                        Array.isArray(
                            result
                        )
                    ) {

                        data =
                            result;

                    }
                    else if (
                        Array.isArray(
                            result?.data
                        )
                    ) {

                        data =
                            result.data;

                    }
                    else if (
                        Array.isArray(
                            result?.koleksi
                        )
                    ) {

                        data =
                            result.koleksi;

                    }


                    if (!cancelled) {

                        setCollections(
                            data
                        );

                    }

                }
                catch (err) {

                    console.error(
                        "COLLECTIONS PAGE ERROR:",
                        err
                    );


                    if (!cancelled) {

                        setError(
                            err?.message ||
                            "Gagal mengambil data koleksi."
                        );

                        setCollections([]);

                    }

                }
                finally {

                    if (!cancelled) {

                        setLoading(false);

                    }

                }

            };


        loadCollections();


        return () => {

            cancelled = true;

        };

    }, []);


    // ==================================================
    // KOLEKSI AKTIF
    // ==================================================

    const activeCollections =
        collections.filter(
            (collection) => {

                const status =
                    String(
                        collection?.status ||
                        ""
                    )
                        .trim()
                        .toLowerCase();


                if (!status) {

                    return true;

                }


                return (
                    status === "aktif" ||
                    status === "tersedia"
                );

            }
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
                        max-w-6xl
                        mx-auto
                        px-6
                        py-7
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
                                text-[#D4AF37]
                                text-xs
                                uppercase
                                tracking-[4px]
                            "
                        >
                            Handu Atelier
                        </p>


                        <h1
                            className="
                                text-3xl
                                md:text-4xl
                                font-bold
                                mt-2
                            "
                        >
                            Koleksi Kostum
                        </h1>


                        <p
                            className="
                                text-gray-500
                                mt-2
                            "
                        >
                            Pilih koleksi yang ingin Anda lihat.
                        </p>

                    </div>


                    <Link
                        to="/#collections"
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            px-5
                            py-3
                            rounded-xl
                            border
                            border-[#D4AF37]/20
                            text-[#D4AF37]
                            hover:bg-[#D4AF37]/10
                            transition
                            w-fit
                        "
                    >
                        <FaArrowLeft />
                        Kembali
                    </Link>

                </div>

            </header>


            {/* ==================================================
                CONTENT
            ================================================== */}

            <main
                className="
                    max-w-6xl
                    mx-auto
                    px-6
                    py-12
                "
            >

                {/* INTRO */}

                <section
                    className="
                        text-center
                        mb-12
                    "
                >

                    <p
                        className="
                            text-[#D4AF37]
                            uppercase
                            tracking-[5px]
                            text-xs
                        "
                    >
                        Explore Our Collections
                    </p>


                    <h2
                        className="
                            text-3xl
                            md:text-5xl
                            font-bold
                            mt-4
                        "
                    >
                        Temukan Koleksi Anda
                    </h2>


                    <p
                        className="
                            max-w-2xl
                            mx-auto
                            text-gray-500
                            mt-5
                            leading-7
                        "
                    >
                        Jelajahi koleksi Handu Atelier
                        dan temukan kostum yang sesuai
                        dengan kebutuhan acara Anda.
                    </p>

                </section>


                {/* LOADING */}

                {loading && (

                    <div
                        className="
                            flex
                            items-center
                            justify-center
                            py-20
                        "
                    >

                        <div
                            className="
                                w-10
                                h-10
                                rounded-full
                                border-2
                                border-[#D4AF37]/20
                                border-t-[#D4AF37]
                                animate-spin
                            "
                        />

                    </div>

                )}


                {/* ERROR */}

                {!loading && error && (

                    <div
                        className="
                            text-center
                            py-20
                            text-red-400
                        "
                    >
                        {error}
                    </div>

                )}


                {/* ==================================================
                    COLLECTION GRID
                ================================================== */}

                {!loading &&
                    !error &&
                    activeCollections.length > 0 && (

                    <section
                        className="
                            grid
                            sm:grid-cols-2
                            gap-6
                        "
                    >

                        {activeCollections.map(
                            (
                                collection,
                                index
                            ) => {

                                const title =
                                    collection.nama_koleksi ||
                                    "Koleksi";


                                const slug =
                                    makeSlug(
                                        title
                                    );


                                const meta =
                                    legacyMeta[
                                        slug
                                    ] || {};


                                const Icon =
                                    meta.icon ||
                                    FaTshirt;


                                const imageUrl =
                                    getDatabaseImageUrl(
                                        collection.foto
                                    ) ||
                                    (
                                        meta.icon
                                            ? findLocalImage(
                                                slug
                                            )
                                            : null
                                    );


                                const description =
                                    collection.deskripsi ||
                                    meta.description ||
                                    "Temukan berbagai pilihan kostum dari koleksi ini.";


                                const subtitle =
                                    meta.subtitle ||
                                    "Handu Atelier Collection";


                                return (

                                    <Link
                                        key={
                                            collection.id_koleksi ??
                                            index
                                        }
                                        to={
                                            `/category/${slug}`
                                        }
                                        className="
                                            group
                                            relative
                                            min-h-115
                                            rounded-3xl
                                            overflow-hidden
                                            border
                                            border-[#D4AF37]/20
                                            bg-[#141414]
                                        "
                                    >

                                        {/* IMAGE */}

                                        {imageUrl && (

                                            <img
                                                src={imageUrl}
                                                alt={title}
                                                className="
                                                    absolute
                                                    inset-0
                                                    w-full
                                                    h-full
                                                    object-cover
                                                    object-top
                                                    opacity-55
                                                    group-hover:scale-105
                                                    transition
                                                    duration-700
                                                "
                                                onError={(e) => {

                                                    e.currentTarget.style.display =
                                                        "none";

                                                }}
                                            />

                                        )}


                                        {/* OVERLAY */}

                                        <div
                                            className="
                                                absolute
                                                inset-0
                                                bg-linear-to-t
                                                from-black
                                                via-black/65
                                                to-black/10
                                            "
                                        />


                                        {/* CONTENT */}

                                        <div
                                            className="
                                                relative
                                                z-10
                                                h-full
                                                min-h-115
                                                flex
                                                flex-col
                                                justify-end
                                                p-7
                                                md:p-9
                                            "
                                        >

                                            {/* ICON */}

                                            <div
                                                className="
                                                    w-14
                                                    h-14
                                                    rounded-2xl
                                                    bg-[#D4AF37]/15
                                                    border
                                                    border-[#D4AF37]/30
                                                    text-[#D4AF37]
                                                    flex
                                                    items-center
                                                    justify-center
                                                    text-xl
                                                    mb-5
                                                "
                                            >
                                                <Icon />
                                            </div>


                                            <p
                                                className="
                                                    text-[#D4AF37]
                                                    text-xs
                                                    uppercase
                                                    tracking-[4px]
                                                "
                                            >
                                                {subtitle}
                                            </p>


                                            <h3
                                                className="
                                                    text-3xl
                                                    md:text-4xl
                                                    font-bold
                                                    mt-2
                                                "
                                            >
                                                {title}
                                            </h3>


                                            <p
                                                className="
                                                    text-gray-400
                                                    mt-4
                                                    leading-6
                                                    max-w-lg
                                                "
                                            >
                                                {description}
                                            </p>


                                            {/* COUNT */}

                                            <p
                                                className="
                                                    text-[#D4AF37]
                                                    text-sm
                                                    font-semibold
                                                    mt-4
                                                "
                                            >
                                                {Number(
                                                    collection.jumlah_kostum
                                                ) || 0}{" "}
                                                Kostum
                                            </p>


                                            {/* BUTTON */}

                                            <div
                                                className="
                                                    mt-6
                                                    inline-flex
                                                    items-center
                                                    justify-between
                                                    gap-4
                                                    text-[#D4AF37]
                                                    font-semibold
                                                "
                                            >

                                                <span>
                                                    Lihat Koleksi
                                                </span>


                                                <span
                                                    className="
                                                        text-xl
                                                        group-hover:translate-x-2
                                                        transition
                                                    "
                                                >
                                                    →
                                                </span>

                                            </div>

                                        </div>

                                    </Link>

                                );

                            }
                        )}

                    </section>

                )}


                {/* EMPTY */}

                {!loading &&
                    !error &&
                    activeCollections.length === 0 && (

                    <div
                        className="
                            text-center
                            py-20
                            text-gray-500
                        "
                    >
                        Belum ada koleksi.
                    </div>

                )}

            </main>

        </div>

    );

}


export default CollectionsPage;