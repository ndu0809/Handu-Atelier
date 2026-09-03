import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import api from "../../lib/api";


// ======================================================
// COLLECTION SECTION
// ======================================================

function CollectionSection() {

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


    // ======================================================
    // NORMALIZE SLUG
    // ======================================================

    const makeSlug = (value) => {

        return String(
            value || ""
        )
            .trim()
            .toLowerCase()
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

    };


    // ======================================================
    // FOTO URL
    // ======================================================

    const getFotoUrl = (foto) => {

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

    };


    // ======================================================
    // DEFAULT IMAGE
    // ======================================================

    const getDefaultImage = (
        collection
    ) => {

        const name =
            String(
                collection?.nama_koleksi ||
                ""
            )
                .toLowerCase();


        // Kalau foto database tersedia,
        // selalu gunakan foto database.
        if (
            collection?.foto
        ) {

            return getFotoUrl(
                collection.foto
            );

        }


        // Tidak ada foto
        return "";

    };


    // ======================================================
    // LOAD COLLECTION
    // ======================================================

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
                    // AMBIL DATA LANGSUNG DARI BACKEND
                    // ==================================================

                    const response =
                        await api.get(
                            `/koleksi?_=${Date.now()}`
                        );


                    const rawData =
                        response?.data;


                    console.log(
                        "HOME - DATA KOLEKSI:",
                        rawData
                    );


                    // ==================================================
                    // SUPPORT BEBERAPA BENTUK RESPONSE
                    // ==================================================

                    let data = [];


                    if (
                        Array.isArray(
                            rawData
                        )
                    ) {

                        data =
                            rawData;

                    }

                    else if (
                        Array.isArray(
                            rawData?.data
                        )
                    ) {

                        data =
                            rawData.data;

                    }

                    else if (
                        Array.isArray(
                            rawData?.koleksi
                        )
                    ) {

                        data =
                            rawData.koleksi;

                    }


                    console.log(
                        "HOME - JUMLAH KOLEKSI:",
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
                        "HOME - GAGAL MENGAMBIL KOLEKSI:",
                        err
                    );


                    if (
                        !cancelled
                    ) {

                        setError(
                            err?.response?.data?.message ||
                            err?.message ||
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


    // ======================================================
    // FILTER KOLEKSI AKTIF
    // ======================================================

    const activeCollections =
        useMemo(() => {

            return collections.filter(
                (
                    item
                ) => {

                    const status =
                        String(
                            item?.status ||
                            ""
                        )
                            .trim()
                            .toLowerCase();


                    // Kalau backend tidak mengirim
                    // status, tetap tampilkan.
                    if (
                        !status
                    ) {

                        return true;

                    }


                    return (
                        status ===
                            "aktif" ||
                        status ===
                            "tersedia"
                    );

                }
            );

        }, [
            collections
        ]);


    // ======================================================
    // RENDER
    // ======================================================

    return (

        <section
            id="collections"
            className="
                relative
                w-full
                py-20
                md:py-24
                bg-[#080808]
                overflow-hidden
            "
        >

            {/* ==================================================
                BACKGROUND GLOW
            ================================================== */}

            <div
                className="
                    absolute
                    top-0
                    left-1/2
                    -translate-x-1/2
                    w-[700px]
                    h-[300px]
                    bg-[#D4AF37]/5
                    blur-[120px]
                    rounded-full
                    pointer-events-none
                "
            />


            {/* ==================================================
                CONTAINER
            ================================================== */}

            <div
                className="
                    relative
                    max-w-7xl
                    mx-auto
                    px-4
                    sm:px-6
                    lg:px-8
                "
            >

                {/* ==================================================
                    SECTION HEADER
                ================================================== */}

                <div
                    className="
                        text-center
                        mb-12
                        md:mb-14
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-center
                            gap-4
                            mb-4
                        "
                    >

                        <span
                            className="
                                block
                                w-12
                                md:w-20
                                h-px
                                bg-[#D4AF37]/60
                            "
                        />


                        <span
                            className="
                                text-[#D4AF37]
                                text-xs
                                md:text-sm
                                uppercase
                                tracking-[5px]
                            "
                        >
                            KOLEKSI PILIHAN
                        </span>


                        <span
                            className="
                                block
                                w-12
                                md:w-20
                                h-px
                                bg-[#D4AF37]/60
                            "
                        />

                    </div>


                    <h2
                        className="
                            text-3xl
                            sm:text-4xl
                            md:text-5xl
                            font-bold
                            text-white
                        "
                    >
                        Kostum Premium Kami
                    </h2>


                    <p
                        className="
                            max-w-2xl
                            mx-auto
                            mt-4
                            text-gray-400
                            leading-7
                        "
                    >
                        Temukan koleksi kostum premium
                        Handu Atelier untuk berbagai
                        kebutuhan dan momen spesial.
                    </p>

                </div>


                {/* ==================================================
                    LOADING
                ================================================== */}

                {
                    loading && (

                        <div
                            className="
                                flex
                                justify-center
                                items-center
                                min-h-[250px]
                            "
                        >

                            <div
                                className="
                                    flex
                                    flex-col
                                    items-center
                                    gap-4
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

                                <p
                                    className="
                                        text-gray-500
                                        text-sm
                                    "
                                >
                                    Memuat koleksi...
                                </p>

                            </div>

                        </div>

                    )
                }


                {/* ==================================================
                    ERROR
                ================================================== */}

                {
                    !loading &&
                    error && (

                        <div
                            className="
                                max-w-xl
                                mx-auto
                                text-center
                                py-12
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


                {/* ==================================================
                    EMPTY
                ================================================== */}

                {
                    !loading &&
                    !error &&
                    activeCollections.length ===
                        0 && (

                        <div
                            className="
                                max-w-xl
                                mx-auto
                                text-center
                                py-12
                                rounded-3xl
                                border
                                border-[#D4AF37]/10
                                bg-[#111111]
                            "
                        >

                            <p
                                className="
                                    text-gray-500
                                    text-sm
                                "
                            >
                                Belum ada koleksi yang
                                tersedia.
                            </p>

                        </div>

                    )
                }


                {/* ==================================================
                    COLLECTION GRID
                ================================================== */}

                {
                    !loading &&
                    activeCollections.length >
                        0 && (

                        <div
                            className="
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                lg:grid-cols-4
                                gap-5
                                md:gap-6
                            "
                        >

                            {
                                activeCollections.map(
                                    (
                                        item,
                                        index
                                    ) => {

                                        const image =
                                            getDefaultImage(
                                                item
                                            );


                                        const slug =
                                            makeSlug(
                                                item.nama_koleksi
                                            );


                                        const jumlah =
                                            Number(
                                                item.jumlah_kostum
                                            ) ||
                                            0;


                                        return (

                                            <article
                                                key={
                                                    item.id_koleksi ??
                                                    index
                                                }
                                                className="
                                                    group
                                                    relative
                                                    overflow-hidden
                                                    rounded-2xl
                                                    border
                                                    border-[#D4AF37]/15
                                                    bg-[#111111]
                                                    transition-all
                                                    duration-500
                                                    hover:border-[#D4AF37]/45
                                                    hover:-translate-y-1
                                                    hover:shadow-[0_20px_50px_rgba(0,0,0,.45)]
                                                "
                                            >

                                                {/* ==================================================
                                                    IMAGE
                                                ================================================== */}

                                                <div
                                                    className="
                                                        relative
                                                        h-[280px]
                                                        overflow-hidden
                                                        bg-[#171717]
                                                    "
                                                >

                                                    {
                                                        image ? (

                                                            <img
                                                                src={
                                                                    image
                                                                }
                                                                alt={
                                                                    item.nama_koleksi ||
                                                                    "Koleksi"
                                                                }
                                                                className="
                                                                    w-full
                                                                    h-full
                                                                    object-cover
                                                                    transition-transform
                                                                    duration-700
                                                                    group-hover:scale-105
                                                                "
                                                                loading="lazy"
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
                                                                                    ".collection-image-fallback"
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


                                                    {/* ==================================================
                                                        FALLBACK IMAGE
                                                    ================================================== */}

                                                    <div
                                                        className="
                                                            collection-image-fallback
                                                            absolute
                                                            inset-0
                                                            hidden
                                                            items-center
                                                            justify-center
                                                            bg-gradient-to-br
                                                            from-[#1b1b1b]
                                                            via-[#111111]
                                                            to-[#080808]
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                text-center
                                                                px-5
                                                            "
                                                        >

                                                            <div
                                                                className="
                                                                    text-[#D4AF37]
                                                                    text-4xl
                                                                    mb-3
                                                                "
                                                            >
                                                                ♛
                                                            </div>


                                                            <p
                                                                className="
                                                                    text-gray-500
                                                                    text-xs
                                                                "
                                                            >
                                                                Foto koleksi
                                                                belum tersedia
                                                            </p>

                                                        </div>

                                                    </div>


                                                    {/* ==================================================
                                                        GRADIENT
                                                    ================================================== */}

                                                    <div
                                                        className="
                                                            absolute
                                                            inset-0
                                                            bg-gradient-to-t
                                                            from-black/80
                                                            via-black/10
                                                            to-transparent
                                                            pointer-events-none
                                                        "
                                                    />

                                                </div>


                                                {/* ==================================================
                                                    CONTENT
                                                ================================================== */}

                                                <div
                                                    className="
                                                        p-5
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            items-start
                                                            justify-between
                                                            gap-3
                                                        "
                                                    >

                                                        <div>

                                                            <h3
                                                                className="
                                                                    text-xl
                                                                    font-semibold
                                                                    text-white
                                                                    leading-tight
                                                                "
                                                            >
                                                                {
                                                                    item.nama_koleksi ||
                                                                    "Koleksi"
                                                                }
                                                            </h3>


                                                            <p
                                                                className="
                                                                    mt-2
                                                                    text-[#D4AF37]
                                                                    text-sm
                                                                    font-medium
                                                                "
                                                            >
                                                                {
                                                                    jumlah
                                                                }{" "}
                                                                Koleksi
                                                            </p>

                                                        </div>


                                                        <span
                                                            className="
                                                                flex-shrink-0
                                                                w-8
                                                                h-8
                                                                rounded-full
                                                                border
                                                                border-[#D4AF37]/30
                                                                flex
                                                                items-center
                                                                justify-center
                                                                text-[#D4AF37]
                                                                transition-all
                                                                duration-300
                                                                group-hover:bg-[#D4AF37]
                                                                group-hover:text-black
                                                            "
                                                        >
                                                            →
                                                        </span>

                                                    </div>


                                                    {/* ==================================================
                                                        DESCRIPTION
                                                    ================================================== */}

                                                    {
                                                        item.deskripsi && (

                                                            <p
                                                                className="
                                                                    mt-4
                                                                    text-gray-500
                                                                    text-sm
                                                                    leading-6
                                                                    line-clamp-3
                                                                "
                                                            >
                                                                {
                                                                    item.deskripsi
                                                                }
                                                            </p>

                                                        )
                                                    }


                                                    {/* ==================================================
                                                        BUTTON
                                                    ================================================== */}

                                                    <Link
                                                        to={
                                                            slug
                                                                ? `/category/${slug}`
                                                                : "/collections"
                                                        }
                                                        className="
                                                            mt-5
                                                            flex
                                                            items-center
                                                            justify-center
                                                            w-full
                                                            min-h-[44px]
                                                            rounded-xl
                                                            bg-[#D4AF37]
                                                            text-black
                                                            text-sm
                                                            font-semibold
                                                            transition-all
                                                            duration-300
                                                            hover:bg-[#e4c04c]
                                                        "
                                                    >
                                                        Lihat Koleksi
                                                    </Link>

                                                </div>

                                            </article>

                                        );

                                    }
                                )
                            }

                        </div>

                    )
                }


                {/* ==================================================
                    VIEW ALL
                ================================================== */}

                {
                    !loading &&
                    activeCollections.length >
                        0 && (

                        <div
                            className="
                                flex
                                justify-center
                                mt-10
                            "
                        >

                            <Link
                                to="/collections"
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    px-7
                                    py-3
                                    rounded-xl
                                    border
                                    border-[#D4AF37]/40
                                    text-[#D4AF37]
                                    text-sm
                                    font-medium
                                    transition-all
                                    duration-300
                                    hover:bg-[#D4AF37]
                                    hover:text-black
                                "
                            >
                                Lihat Semua Koleksi
                                <span>
                                    →
                                </span>
                            </Link>

                        </div>

                    )
                }

            </div>

        </section>

    );

}


export default CollectionSection;