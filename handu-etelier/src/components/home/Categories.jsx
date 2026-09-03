import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";


// ======================================================
// LOAD SEMUA GAMBAR KATEGORI LAMA
// ======================================================

const categoryImages = import.meta.glob(
    "../../assets/images/category/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}",
    {
        eager: true,
        query: "?url",
        import: "default",
    }
);


// ======================================================
// NORMALISASI NAMA
// ======================================================

function normalizeName(value) {

    if (!value) {
        return "";
    }

    return String(value)
        .toLowerCase()
        .trim()
        .replace(
            /\.(jpg|jpeg|png|webp)$/i,
            ""
        )
        .replace(
            /[^a-z0-9]/g,
            ""
        );
}


// ======================================================
// SLUG
// ======================================================

function makeSlug(value) {

    if (!value) {
        return "";
    }

    return String(value)
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
// CARI GAMBAR KATEGORI LAMA
// ======================================================

function findCategoryImage(slug) {

    const keywordMap = {

        traditional: [
            "traditional",
            "tradisional",
            "adat",
            "minangkabau",
        ],

        modern: [
            "modern",
            "fashion",
            "modernwear",
        ],

        classic: [
            "classic",
            "klasik",
            "vintage",
            "royal",
        ],

        formal: [
            "formal",
            "office",
            "jas",
            "business",
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
                .pop();


        const normalizedFilename =
            normalizeName(
                filename
            );


        const found =
            keywords.some(
                (keyword) =>
                    normalizedFilename.includes(
                        normalizeName(
                            keyword
                        )
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
        String(
            foto
        ).trim();


    if (!value) {
        return "";
    }


    // URL lengkap
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


    // /uploads/...
    if (
        value.startsWith(
            "/uploads/"
        )
    ) {

        return value;

    }


    // uploads/...
    if (
        value.startsWith(
            "uploads/"
        )
    ) {

        return `/${value}`;

    }


    // Nama file saja
    return `/uploads/koleksi/${value}`;

}


// ======================================================
// DESKRIPSI DEFAULT UNTUK KOLEKSI LAMA
// ======================================================

const defaultDescriptions = {

    traditional:
        "Koleksi busana adat Indonesia dengan karakter khas daerah, mulai dari Minangkabau, Jawa, hingga pakaian tradisional Nusantara.",

    modern:
        "Koleksi modern dengan siluet elegan dan gaya kontemporer untuk pesta, pernikahan, penghargaan, maupun acara spesial.",

    classic:
        "Koleksi klasik bernuansa vintage, Eropa, dan kerajaan dengan karakter elegan yang timeless.",

    formal:
        "Koleksi formal dengan potongan elegan dan profesional untuk acara resmi, gala, pertemuan hingga acara spesial.",

};


// ======================================================
// COMPONENT
// ======================================================

function Categories() {

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
    // LOAD DARI BACKEND
    // ==================================================

    useEffect(() => {

        let cancelled =
            false;


        const loadCollections =
            async () => {

                try {

                    setLoading(
                        true
                    );

                    setError("");


                    // ==================================================
                    // AMBIL DATA KOLEKSI DARI BACKEND
                    // ==================================================

                    const response =
                        await fetch(
                            `/api/koleksi?_=${Date.now()}`,
                            {
                                method: "GET",

                                cache:
                                    "no-store",

                                headers: {
                                    Accept:
                                        "application/json",
                                },
                            }
                        );


                    // ==================================================
                    // CEK RESPONSE
                    // ==================================================

                    if (
                        !response.ok
                    ) {

                        throw new Error(
                            `Gagal mengambil koleksi (${response.status})`
                        );

                    }


                    const result =
                        await response.json();


                    console.log(
                        "CATEGORIES - RESPONSE KOLEKSI:",
                        result
                    );


                    // ==================================================
                    // AMBIL ARRAY DATA
                    // ==================================================

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


                    console.log(
                        "CATEGORIES - TOTAL:",
                        data.length
                    );


                    if (
                        !cancelled
                    ) {

                        setCollections(
                            data
                        );

                    }

                } catch (
                    err
                ) {

                    console.error(
                        "CATEGORIES - ERROR:",
                        err
                    );


                    if (
                        !cancelled
                    ) {

                        setError(
                            err.message ||
                            "Gagal mengambil data koleksi."
                        );


                        setCollections(
                            []
                        );

                    }

                } finally {

                    if (
                        !cancelled
                    ) {

                        setLoading(
                            false
                        );

                    }

                }

            };


        loadCollections();


        return () => {

            cancelled =
                true;

        };

    }, []);


    // ==================================================
    // FILTER KOLEKSI AKTIF
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


                // Jika status kosong,
                // tetap tampilkan.
                if (
                    !status
                ) {

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

        <section
            className="
                py-20
                px-6
                bg-[#090909]
                text-white
            "
        >

            <div
                className="
                    max-w-7xl
                    mx-auto
                "
            >

                {/* ================================================
                    HEADER
                ================================================ */}

                <div
                    className="
                        text-center
                        mb-14
                    "
                >

                    <p
                        className="
                            uppercase
                            tracking-[5px]
                            text-[#D4AF37]
                            text-sm
                        "
                    >
                        Our Collections
                    </p>


                    <h2
                        className="
                            text-4xl
                            md:text-5xl
                            font-bold
                            mt-4
                        "
                    >
                        Pilih Kategori Kostum
                    </h2>


                    <p
                        className="
                            text-gray-400
                            max-w-2xl
                            mx-auto
                            mt-5
                            leading-7
                        "
                    >
                        Handu Atelier menyediakan
                        berbagai koleksi kostum premium
                        untuk berbagai kebutuhan acara,
                        mulai dari busana adat hingga
                        gaya modern dan formal.
                    </p>

                </div>


                {/* ================================================
                    LOADING
                ================================================ */}

                {
                    loading && (

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

                    )
                }


                {/* ================================================
                    ERROR
                ================================================ */}

                {
                    !loading &&
                    error && (

                        <div
                            className="
                                text-center
                                py-16
                            "
                        >

                            <p
                                className="
                                    text-red-400
                                    text-sm
                                "
                            >
                                {error}
                            </p>

                        </div>

                    )
                }


                {/* ================================================
                    CATEGORY GRID
                ================================================ */}

                {
                    !loading &&
                    !error &&
                    activeCollections.length >
                        0 && (

                        <div
                            className="
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                lg:grid-cols-4
                                gap-6
                            "
                        >

                            {
                                activeCollections.map(
                                    (
                                        collection,
                                        index
                                    ) => {

                                        // ==========================================
                                        // NAMA
                                        // ==========================================

                                        const name =
                                            collection.nama_koleksi ||
                                            "Koleksi";


                                        // ==========================================
                                        // SLUG
                                        // ==========================================

                                        const slug =
                                            makeSlug(
                                                name
                                            );


                                        // ==========================================
                                        // CARI DATA LAMA
                                        // ==========================================

                                        const knownCategory =
                                            [
                                                "traditional",
                                                "modern",
                                                "classic",
                                                "formal",
                                            ].find(
                                                (item) =>
                                                    item ===
                                                    slug
                                            );


                                        // ==========================================
                                        // FOTO
                                        // ==========================================

                                        const databaseImage =
                                            getDatabaseImageUrl(
                                                collection.foto
                                            );


                                        const localImage =
                                            knownCategory
                                                ? findCategoryImage(
                                                    knownCategory
                                                )
                                                : null;


                                        const imageUrl =
                                            databaseImage ||
                                            localImage;


                                        // ==========================================
                                        // DESKRIPSI
                                        // ==========================================

                                        const description =
                                            collection.deskripsi ||
                                            (
                                                knownCategory
                                                    ? defaultDescriptions[
                                                        knownCategory
                                                    ]
                                                    : "Temukan berbagai pilihan kostum dari koleksi Handu Atelier."
                                            );


                                        // ==========================================
                                        // JUMLAH KOSTUM
                                        // ==========================================

                                        const count =
                                            Number(
                                                collection.jumlah_kostum
                                            ) ||
                                            0;


                                        return (

                                            <div
                                                key={
                                                    collection.id_koleksi ??
                                                    index
                                                }
                                                className="
                                                    group
                                                    overflow-hidden
                                                    rounded-3xl
                                                    bg-[#141414]
                                                    border
                                                    border-[#D4AF37]/20
                                                    hover:border-[#D4AF37]/60
                                                    transition-all
                                                    duration-300
                                                    hover:-translate-y-2
                                                "
                                            >

                                                {/* ======================================
                                                    IMAGE
                                                ====================================== */}

                                                <div
                                                    className="
                                                        relative
                                                        h-64
                                                        overflow-hidden
                                                        bg-[#1D1D1D]
                                                    "
                                                >

                                                    {
                                                        imageUrl ? (

                                                            <img
                                                                src={
                                                                    imageUrl
                                                                }
                                                                alt={
                                                                    name
                                                                }
                                                                className="
                                                                    w-full
                                                                    h-full
                                                                    object-cover
                                                                    transition-transform
                                                                    duration-500
                                                                    group-hover:scale-105
                                                                "
                                                                onError={
                                                                    (
                                                                        e
                                                                    ) => {

                                                                        e.currentTarget.style.display =
                                                                            "none";


                                                                        const fallback =
                                                                            e.currentTarget
                                                                                .parentElement
                                                                                ?.querySelector(
                                                                                    ".category-image-fallback"
                                                                                );


                                                                        if (
                                                                            fallback
                                                                        ) {

                                                                            fallback.style.display =
                                                                                "flex";

                                                                        }

                                                                    }
                                                                }
                                                            />

                                                        ) : null
                                                    }


                                                    {/* ======================================
                                                        FALLBACK
                                                    ====================================== */}

                                                    <div
                                                        className="
                                                            category-image-fallback
                                                            absolute
                                                            inset-0
                                                            flex
                                                            items-center
                                                            justify-center
                                                            text-gray-500
                                                            text-sm
                                                        "
                                                        style={{
                                                            display:
                                                                imageUrl
                                                                    ? "none"
                                                                    : "flex"
                                                        }}
                                                    >
                                                        Foto kategori
                                                        tidak tersedia
                                                    </div>

                                                </div>


                                                {/* ======================================
                                                    CONTENT
                                                ====================================== */}

                                                <div
                                                    className="
                                                        p-6
                                                    "
                                                >

                                                    <h3
                                                        className="
                                                            text-2xl
                                                            font-bold
                                                            text-white
                                                        "
                                                    >
                                                        {
                                                            name
                                                        }
                                                    </h3>


                                                    <p
                                                        className="
                                                            text-[#D4AF37]
                                                            text-sm
                                                            font-semibold
                                                            mt-2
                                                        "
                                                    >
                                                        {
                                                            count
                                                        }{" "}
                                                        Kostum
                                                    </p>


                                                    <p
                                                        className="
                                                            text-gray-400
                                                            text-sm
                                                            leading-6
                                                            mt-4
                                                            min-h-24
                                                        "
                                                    >
                                                        {
                                                            description
                                                        }
                                                    </p>


                                                    {/* ======================================
                                                        BUTTON
                                                    ====================================== */}

                                                    <Link
                                                        to={
                                                            `/category/${slug}`
                                                        }
                                                        className="
                                                            block
                                                            text-center
                                                            mt-6
                                                            bg-[#D4AF37]
                                                            text-black
                                                            font-semibold
                                                            py-3
                                                            rounded-xl
                                                            hover:scale-[1.02]
                                                            transition
                                                        "
                                                    >
                                                        Lihat Koleksi
                                                    </Link>

                                                </div>

                                            </div>

                                        );

                                    }
                                )
                            }

                        </div>

                    )
                }


                {/* ================================================
                    EMPTY
                ================================================ */}

                {
                    !loading &&
                    !error &&
                    activeCollections.length ===
                        0 && (

                        <div
                            className="
                                text-center
                                py-16
                                text-gray-500
                            "
                        >
                            Belum ada koleksi.
                        </div>

                    )
                }

            </div>

        </section>

    );

}


export default Categories;