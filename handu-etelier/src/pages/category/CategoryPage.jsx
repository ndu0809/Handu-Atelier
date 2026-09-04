import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Link,
    useParams
} from "react-router-dom";

import {
    FaArrowLeft,
    FaExclamationTriangle,
    FaSearch,
    FaTshirt
} from "react-icons/fa";

import CostumeCard
    from "../../components/common/CostumeCard";

import {
    getCostumes
} from "../../services/CostumeService";


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
// NORMALISASI
// ======================================================

function normalizeText(value) {

    return String(value || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        );

}


// ======================================================
// COMPONENT
// ======================================================

function CategoryPage() {

    const {
        slug
    } = useParams();


    // ==================================================
    // STATE
    // ==================================================

    const [
        costumes,
        setCostumes
    ] = useState([]);


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


    const [
        search,
        setSearch
    ] = useState("");


    const [
        availability,
        setAvailability
    ] = useState("Semua");


    const [
        sortBy,
        setSortBy
    ] = useState("default");


    // ==================================================
    // SLUG SAAT INI
    // ==================================================

    const currentSlug =
        makeSlug(slug);


    // ==================================================
    // LOAD DATA
    //
    // AMBIL:
    // 1. KOLEKSI
    // 2. SEMUA KOSTUM
    //
    // KEDUANYA DARI DATABASE
    // ==================================================

    useEffect(() => {

        let cancelled = false;


        const loadData =
            async () => {

                try {

                    setLoading(true);
                    setError("");


                    // ==========================================
                    // AMBIL KOLEKSI
                    // ==========================================

                    const collectionResponse =
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


                    if (
                        !collectionResponse.ok
                    ) {

                        throw new Error(
                            `Gagal mengambil data koleksi (${collectionResponse.status})`
                        );

                    }


                    const collectionResult =
                        await collectionResponse.json();


                    let collectionData = [];


                    if (
                        Array.isArray(
                            collectionResult
                        )
                    ) {

                        collectionData =
                            collectionResult;

                    }
                    else if (
                        Array.isArray(
                            collectionResult?.data
                        )
                    ) {

                        collectionData =
                            collectionResult.data;

                    }
                    else if (
                        Array.isArray(
                            collectionResult?.koleksi
                        )
                    ) {

                        collectionData =
                            collectionResult.koleksi;

                    }


                    // ==========================================
                    // AMBIL KOSTUM
                    // ==========================================

                    const costumeData =
                        await getCostumes();


                    if (
                        !Array.isArray(
                            costumeData
                        )
                    ) {

                        throw new Error(
                            "Data kostum dari server tidak valid."
                        );

                    }


                    if (!cancelled) {

                        setCollections(
                            collectionData
                        );

                        setCostumes(
                            costumeData
                        );

                    }

                }
                catch (err) {

                    console.error(
                        "CATEGORY PAGE ERROR:",
                        err
                    );


                    if (!cancelled) {

                        setError(
                            err?.message ||
                            "Gagal mengambil data koleksi dan kostum."
                        );

                        setCollections([]);
                        setCostumes([]);

                    }

                }
                finally {

                    if (!cancelled) {

                        setLoading(false);

                    }

                }

            };


        loadData();


        return () => {

            cancelled = true;

        };

    }, []);


    // ==================================================
    // CARI KOLEKSI BERDASARKAN SLUG
    // ==================================================

    const currentCollection =
        useMemo(() => {

            if (!currentSlug) {
                return null;
            }


            return collections.find(
                (collection) => {

                    const collectionSlug =
                        makeSlug(
                            collection?.nama_koleksi
                        );


                    return (
                        collectionSlug ===
                        currentSlug
                    );

                }
            ) || null;

        }, [
            collections,
            currentSlug
        ]);


    // ==================================================
    // INFORMASI JUDUL
    // ==================================================

    const categoryTitle =
        currentCollection?.nama_koleksi ||
        String(slug || "Koleksi")
            .replace(/-/g, " ")
            .replace(
                /\b\w/g,
                (char) =>
                    char.toUpperCase()
            );


    // ==================================================
    // DESKRIPSI
    // ==================================================

    const categoryDescription =
        currentCollection?.deskripsi ||
        "Temukan koleksi kostum Handu Atelier yang tersedia.";


    // ==================================================
    // FILTER BERDASARKAN KOLEKSI DATABASE
    //
    // PRIORITAS:
    //
    // 1. id_koleksi
    // 2. nama_koleksi
    //
    // TIDAK ADA LAGI FILTER
    // BERDASARKAN KODE KST-001 DST.
    // ==================================================

    const categoryCostumes =
        useMemo(() => {

            if (!currentSlug) {

                return costumes;

            }


            // ==========================================
            // ID KOLEKSI DARI DATABASE
            // ==========================================

            const collectionId =
                currentCollection?.id_koleksi;


            return costumes.filter(
                (item) => {

                    // ======================================
                    // PRIORITAS 1
                    // ID KOLEKSI
                    // ======================================

                    if (
                        collectionId !==
                        undefined &&
                        collectionId !==
                        null
                    ) {

                        const itemCollectionId =
                            item?.id_koleksi ??
                            item?.collectionId;


                        if (
                            itemCollectionId !==
                            undefined &&
                            itemCollectionId !==
                            null
                        ) {

                            return String(
                                itemCollectionId
                            ) === String(
                                collectionId
                            );

                        }

                    }


                    // ======================================
                    // PRIORITAS 2
                    // NAMA KOLEKSI
                    // ======================================

                    const itemCollectionName =
                        makeSlug(
                            item?.collectionName ||
                            item?.nama_koleksi ||
                            ""
                        );


                    if (
                        itemCollectionName ===
                        currentSlug
                    ) {

                        return true;

                    }


                    return false;

                }
            );

        }, [
            costumes,
            currentCollection,
            currentSlug
        ]);


    // ==================================================
    // SEARCH + FILTER
    // ==================================================

    const filteredCostumes =
        useMemo(() => {

            const keyword =
                normalizeText(
                    search
                );


            let result =
                categoryCostumes.filter(
                    (item) => {

                        // ==================================
                        // SEARCH
                        // ==================================

                        if (keyword) {

                            const searchable = [

                                item?.collectionName,

                                item?.costumeName,

                                item?.nama_kostum,

                                item?.costumeType,

                                item?.categoryName,

                                item?.nama_kategori,

                                item?.collectionGroup,

                                item?.kelompok_koleksi,

                                item?.code,

                                item?.kode_koleksi,

                                item?.color,

                                item?.warna,

                                item?.size,

                                item?.ukuran

                            ]
                                .map(
                                    normalizeText
                                )
                                .join(" ");


                            if (
                                !searchable.includes(
                                    keyword
                                )
                            ) {

                                return false;

                            }

                        }


                        // ==================================
                        // TERSEDIA
                        // ==================================

                        if (
                            availability ===
                            "Tersedia"
                        ) {

                            return Boolean(
                                item?.available
                            );

                        }


                        // ==================================
                        // TIDAK TERSEDIA
                        // ==================================

                        if (
                            availability ===
                            "Tidak Tersedia"
                        ) {

                            return !Boolean(
                                item?.available
                            );

                        }


                        return true;

                    }
                );


            // ==============================================
            // COPY
            // ==============================================

            result = [
                ...result
            ];


            // ==============================================
            // NAMA A-Z
            // ==============================================

            if (
                sortBy ===
                "name-asc"
            ) {

                result.sort(
                    (
                        a,
                        b
                    ) => {

                        const nameA =
                            a?.costumeName ||
                            a?.nama_kostum ||
                            a?.collectionName ||
                            a?.nama_koleksi ||
                            "";

                        const nameB =
                            b?.costumeName ||
                            b?.nama_kostum ||
                            b?.collectionName ||
                            b?.nama_koleksi ||
                            "";


                        return String(
                            nameA
                        ).localeCompare(
                            String(nameB),
                            "id"
                        );

                    }
                );

            }


            // ==============================================
            // NAMA Z-A
            // ==============================================

            if (
                sortBy ===
                "name-desc"
            ) {

                result.sort(
                    (
                        a,
                        b
                    ) => {

                        const nameA =
                            a?.costumeName ||
                            a?.nama_kostum ||
                            a?.collectionName ||
                            a?.nama_koleksi ||
                            "";

                        const nameB =
                            b?.costumeName ||
                            b?.nama_kostum ||
                            b?.collectionName ||
                            b?.nama_koleksi ||
                            "";


                        return String(
                            nameB
                        ).localeCompare(
                            String(nameA),
                            "id"
                        );

                    }
                );

            }


            // ==============================================
            // HARGA TERMURAH
            // ==============================================

            if (
                sortBy ===
                "price-low"
            ) {

                result.sort(
                    (
                        a,
                        b
                    ) =>
                        Number(
                            a?.price ||
                            a?.harga_sewa ||
                            0
                        ) -
                        Number(
                            b?.price ||
                            b?.harga_sewa ||
                            0
                        )
                );

            }


            // ==============================================
            // HARGA TERMAHAL
            // ==============================================

            if (
                sortBy ===
                "price-high"
            ) {

                result.sort(
                    (
                        a,
                        b
                    ) =>
                        Number(
                            b?.price ||
                            b?.harga_sewa ||
                            0
                        ) -
                        Number(
                            a?.price ||
                            a?.harga_sewa ||
                            0
                        )
                );

            }


            return result;

        }, [
            categoryCostumes,
            search,
            availability,
            sortBy
        ]);


    // ==================================================
    // FORMAT RUPIAH
    // ==================================================

    const formatRupiah =
        (value) => {

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

    const getImageUrl =
        (image) => {

            if (!image) {
                return "";
            }


            const value =
                String(image).trim();


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


            // Foto database kostum
            return `/uploads/kostum/${value}`;

        };


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

                <p
                    className="
                        text-[#D4AF37]
                    "
                >
                    Memuat koleksi...
                </p>

            </div>

        );

    }


    // ==================================================
    // ERROR
    // ==================================================

    if (error) {

        return (

            <div
                className="
                    min-h-screen
                    bg-[#090909]
                    text-white
                    flex
                    items-center
                    justify-center
                    px-6
                "
            >

                <div
                    className="
                        max-w-xl
                        w-full
                        text-center
                        rounded-3xl
                        border
                        border-red-500/20
                        bg-[#141414]
                        p-10
                    "
                >

                    <FaExclamationTriangle
                        className="
                            mx-auto
                            text-4xl
                            text-red-400
                        "
                    />


                    <h1
                        className="
                            text-2xl
                            font-bold
                            text-red-400
                            mt-5
                        "
                    >
                        Koleksi Tidak
                        Dapat Dimuat
                    </h1>


                    <p
                        className="
                            text-gray-400
                            mt-4
                        "
                    >
                        {error}
                    </p>


                    <Link
                        to="/#collections"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            mt-7
                            px-6
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
                pt-36
                px-6
                pb-20
            "
        >

            <div
                className="
                    max-w-7xl
                    mx-auto
                "
            >

                {/* ==================================================
                    HEADER
                ================================================== */}

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
                            Koleksi
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
                            {categoryTitle}
                        </h1>


                        <p
                            className="
                                text-gray-400
                                mt-4
                                max-w-2xl
                            "
                        >
                            {categoryDescription}
                        </p>


                        <p
                            className="
                                text-gray-500
                                text-sm
                                mt-3
                            "
                        >
                            Menampilkan{" "}

                            <span
                                className="
                                    text-[#D4AF37]
                                    font-semibold
                                "
                            >
                                {
                                    categoryCostumes.length
                                }
                            </span>{" "}

                            kostum
                        </p>

                    </div>


                    <Link
                        to="/#collections"
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


                {/* ==================================================
                    FILTER
                ================================================== */}

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

                    <div
                        className="
                            flex
                            flex-col
                            lg:flex-row
                            gap-4
                            justify-between
                        "
                    >

                        {/* SEARCH */}

                        <div
                            className="
                                relative
                                w-full
                            "
                        >

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


                        {/* SORT */}

                        <select
                            value={sortBy}
                            onChange={(e) =>
                                setSortBy(
                                    e.target.value
                                )
                            }
                            className="
                                bg-[#111111]
                                border
                                border-[#D4AF37]/20
                                rounded-xl
                                px-5
                                py-3
                                text-white
                                outline-none
                            "
                        >

                            <option value="default">
                                Urutkan
                            </option>

                            <option value="name-asc">
                                Nama A-Z
                            </option>

                            <option value="name-desc">
                                Nama Z-A
                            </option>

                            <option value="price-low">
                                Harga Terendah
                            </option>

                            <option value="price-high">
                                Harga Tertinggi
                            </option>

                        </select>

                    </div>


                    {/* AVAILABILITY */}

                    <div
                        className="
                            flex
                            flex-wrap
                            gap-3
                            mt-4
                        "
                    >

                        <button
                            type="button"
                            onClick={() =>
                                setAvailability(
                                    "Semua"
                                )
                            }
                            className={`
                                px-5
                                py-2.5
                                rounded-full
                                border
                                transition

                                ${
                                    availability ===
                                    "Semua"
                                        ? `
                                            bg-[#D4AF37]
                                            text-black
                                            border-[#D4AF37]
                                          `
                                        : `
                                            bg-transparent
                                            text-gray-300
                                            border-[#D4AF37]/20
                                          `
                                }
                            `}
                        >
                            Semua
                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                setAvailability(
                                    "Tersedia"
                                )
                            }
                            className={`
                                px-5
                                py-2.5
                                rounded-full
                                border
                                transition

                                ${
                                    availability ===
                                    "Tersedia"
                                        ? `
                                            bg-[#D4AF37]
                                            text-black
                                            border-[#D4AF37]
                                          `
                                        : `
                                            bg-transparent
                                            text-gray-300
                                            border-[#D4AF37]/20
                                          `
                                }
                            `}
                        >
                            Tersedia
                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                setAvailability(
                                    "Tidak Tersedia"
                                )
                            }
                            className={`
                                px-5
                                py-2.5
                                rounded-full
                                border
                                transition

                                ${
                                    availability ===
                                    "Tidak Tersedia"
                                        ? `
                                            bg-[#D4AF37]
                                            text-black
                                            border-[#D4AF37]
                                          `
                                        : `
                                            bg-transparent
                                            text-gray-300
                                            border-[#D4AF37]/20
                                          `
                                }
                            `}
                        >
                            Tidak Tersedia
                        </button>

                    </div>

                </div>


                {/* ==================================================
                    EMPTY
                ================================================== */}

                {filteredCostumes.length === 0 && (

                    <div
                        className="
                            mt-8
                            rounded-3xl
                            border
                            border-[#D4AF37]/20
                            bg-[#141414]
                            p-12
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
                                text-[#D4AF37]
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
                            koleksi ini atau tidak
                            ada hasil pencarian yang
                            sesuai.
                        </p>

                    </div>

                )}


                {/* ==================================================
                    COSTUME GRID
                ================================================== */}

                {filteredCostumes.length > 0 && (

                    <div
                        className="
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            lg:grid-cols-3
                            xl:grid-cols-4
                            gap-6
                            mt-8
                        "
                    >

                        {filteredCostumes.map(
                            (
                                item,
                                index
                            ) => (

                                <CostumeCard
                                    key={
                                        item.id ||
                                        item.id_kostum ||
                                        index
                                    }

                                    code={
                                        item.id ||
                                        item.id_kostum
                                    }

                                    collectionCode={
                                        item.code ||
                                        item.kode_koleksi ||
                                        ""
                                    }

                                    image={
                                        item.image ||
                                        item.foto
                                    }

                                    collectionName={
                                        item.collectionName ||
                                        item.nama_koleksi ||
                                        item.costumeName ||
                                        item.nama_kostum ||
                                        "Kostum"
                                    }

                                    costumeType={
                                        item.costumeType ||
                                        item.nama_kategori ||
                                        item.kelompok_koleksi ||
                                        "Kostum"
                                    }

                                    price={
                                        item.price ||
                                        item.harga_sewa ||
                                        0
                                    }

                                    available={
                                        Boolean(
                                            item.available
                                        )
                                    }

                                    stock={
                                        item.stock ??
                                        item.stok ??
                                        0
                                    }

                                    size={
                                        item.size ||
                                        item.ukuran ||
                                        ""
                                    }

                                    premium={
                                        Boolean(
                                            item.featured
                                        )
                                    }
                                />

                            )
                        )}

                    </div>

                )}

            </div>

        </div>

    );

}


export default CategoryPage;