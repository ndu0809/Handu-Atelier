import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Link,
    useParams
} from "react-router-dom";

import CostumeCard
    from "../../components/common/CostumeCard";

import {
    getCostumes
} from "../../services/CostumeService";


// ======================================================
// CATEGORY PAGE
// ======================================================

function CategoryPage() {

    const {
        slug
    } = useParams();


    // ======================================================
    // STATE
    // ======================================================

    const [
        costumes,
        setCostumes
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


    // ======================================================
    // NORMALISASI SLUG
    // ======================================================

    const currentSlug =
        String(
            slug || ""
        )
            .trim()
            .toLowerCase();


    // ======================================================
    // KODE KOLEKSI LAMA
    //
    // TIDAK DIHAPUS.
    //
    // Digunakan sebagai fallback untuk data lama yang
    // belum mempunyai informasi kategori yang lengkap.
    // ======================================================

    const categoryCodes = {

        traditional: [
            "KST-001",
            "KST-002",
            "KST-003",
            "KST-004",
            "KST-021",
            "KST-022",
            "KST-023",
            "KST-025",
            "KST-026",
            "KST-027",
            "KST-028",
            "KST-029",
            "KST-030",
            "KST-031",
            "KST-032"
        ],

        modern: [
            "KST-007",
            "KST-008",
            "KST-014",
            "KST-018",
            "KST-019",
            "KST-020",
            "KST-034",
            "KST-035"
        ],

        classic: [
            "KST-006",
            "KST-010",
            "KST-011",
            "KST-012",
            "KST-013",
            "KST-016"
        ],

        formal: [
            "KST-005",
            "KST-009",
            "KST-015",
            "KST-017",
            "KST-024",
            "KST-033"
        ]

    };


    // ======================================================
    // INFORMASI KATEGORI
    // ======================================================

    const categoryInfo =
        useMemo(() => {

            const categories = {

                traditional: {
                    title: "Tradisional",
                    description:
                        "Koleksi pakaian adat dan busana tradisional pilihan Handu Atelier."
                },

                modern: {
                    title: "Modern",
                    description:
                        "Koleksi kostum modern dan elegan untuk berbagai acara spesial."
                },

                classic: {
                    title: "Classic",
                    description:
                        "Koleksi klasik dengan sentuhan vintage dan elegan."
                },

                formal: {
                    title: "Formal",
                    description:
                        "Koleksi formal untuk acara resmi dan momen spesial."
                }

            };


            return (
                categories[
                    currentSlug
                ] || {
                    title: "Koleksi",
                    description:
                        "Koleksi kostum Handu Atelier."
                }
            );

        }, [
            currentSlug
        ]);


    // ======================================================
    // LOAD DATA KOSTUM
    // ======================================================

    useEffect(() => {

        let cancelled = false;


        const loadCostumes =
            async () => {

                try {

                    setLoading(true);
                    setError("");


                    const data =
                        await getCostumes();


                    console.log(
                        "========================================"
                    );

                    console.log(
                        "CATEGORY PAGE - SEMUA DATA KOSTUM:",
                        data
                    );


                    if (
                        !Array.isArray(
                            data
                        )
                    ) {

                        throw new Error(
                            "Data kostum dari server tidak valid."
                        );

                    }


                    if (
                        !cancelled
                    ) {

                        setCostumes(
                            data
                        );

                    }


                } catch (err) {

                    console.error(
                        "CATEGORY PAGE ERROR:",
                        err
                    );


                    if (
                        !cancelled
                    ) {

                        setError(
                            err?.message ||
                            "Gagal mengambil data kostum."
                        );


                        setCostumes(
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


        loadCostumes();


        return () => {

            cancelled = true;

        };

    }, []);


    // ======================================================
    // NORMALISASI TEXT
    // ======================================================

    const normalizeText =
        (value) => {

            return String(
                value || ""
            )
                .trim()
                .toLowerCase();

        };


    // ======================================================
    // NORMALISASI KATEGORI
    // ======================================================

    const normalizeCategory =
        (value) => {

            return String(
                value || ""
            )
                .trim()
                .toLowerCase()
                .replace(
                    /[\s_-]+/g,
                    ""
                );

        };


    // ======================================================
    // ALIAS KATEGORI
    //
    // Supaya:
    //
    // classic
    // klasik
    //
    // dianggap kategori yang sama.
    //
    // Begitu juga:
    //
    // traditional
    // tradisional
    //
    // ======================================================

    const categoryAliases = {

        traditional: [
            "traditional",
            "tradisional"
        ],

        modern: [
            "modern"
        ],

        classic: [
            "classic",
            "klasik"
        ],

        formal: [
            "formal"
        ]

    };


    // ======================================================
    // FILTER BERDASARKAN DATABASE
    // ======================================================

    const categoryCostumes =
        useMemo(() => {

            // ----------------------------------------------
            // KODE LAMA
            // ----------------------------------------------

            const fallbackCodes =
                categoryCodes[
                    currentSlug
                ] || [];


            // ----------------------------------------------
            // ALIAS KATEGORI SAAT INI
            // ----------------------------------------------

            const aliases =
                (
                    categoryAliases[
                        currentSlug
                    ] || [
                        currentSlug
                    ]
                )
                    .map(
                        normalizeCategory
                    );


            console.log(
                "========================================"
            );

            console.log(
                "CATEGORY PAGE - SLUG:",
                currentSlug
            );

            console.log(
                "CATEGORY PAGE - ALIAS:",
                aliases
            );

            console.log(
                "CATEGORY PAGE - FALLBACK:",
                fallbackCodes
            );


            // ----------------------------------------------
            // FILTER
            // ----------------------------------------------

            const result =
                costumes.filter(
                    (item) => {

                        // ==================================
                        // KATEGORI DATABASE
                        // ==================================

                        const categoryName =
                            normalizeCategory(
                                item?.categoryName ||
                                item?.nama_kategori ||
                                item?.kategori ||
                                item?.namaKategori ||
                                ""
                            );


                        // ==================================
                        // KELOMPOK KOLEKSI
                        // ==================================

                        const collectionGroup =
                            normalizeCategory(
                                item?.collectionGroup ||
                                item?.kelompok_koleksi ||
                                ""
                            );


                        // ==================================
                        // NAMA KOLEKSI
                        // ==================================

                        const collectionName =
                            normalizeCategory(
                                item?.collectionName ||
                                item?.nama_koleksi ||
                                ""
                            );


                        // ==================================
                        // KODE KOSTUM
                        // ==================================

                        const code =
                            String(
                                item?.code ||
                                item?.kode_koleksi ||
                                ""
                            )
                                .trim()
                                .toUpperCase();


                        // ==================================
                        // DEBUG ITEM
                        // ==================================

                        console.log(
                            "CATEGORY CHECK:",
                            {
                                id:
                                    item?.id ||
                                    item?.id_kostum,

                                code,

                                categoryName,

                                collectionGroup,

                                collectionName,

                                id_kategori:
                                    item?.id_kategori,

                                currentSlug,

                                cocokKategori:
                                    aliases.includes(
                                        categoryName
                                    ),

                                cocokKelompok:
                                    aliases.includes(
                                        collectionGroup
                                    ),

                                cocokNamaKoleksi:
                                    aliases.includes(
                                        collectionName
                                    ),

                                cocokKode:
                                    fallbackCodes.includes(
                                        code
                                    )
                            }
                        );


                        // ==================================
                        // PRIORITAS 1
                        // NAMA KATEGORI DATABASE
                        // ==================================

                        if (
                            categoryName &&
                            aliases.includes(
                                categoryName
                            )
                        ) {

                            return true;

                        }


                        // ==================================
                        // PRIORITAS 2
                        // KELOMPOK KOLEKSI
                        // ==================================

                        if (
                            collectionGroup &&
                            aliases.includes(
                                collectionGroup
                            )
                        ) {

                            return true;

                        }


                        // ==================================
                        // PRIORITAS 3
                        // NAMA KOLEKSI
                        // ==================================

                        if (
                            collectionName &&
                            aliases.includes(
                                collectionName
                            )
                        ) {

                            return true;

                        }


                        // ==================================
                        // PRIORITAS 4
                        // KODE KOSTUM LAMA
                        // ==================================

                        if (
                            fallbackCodes.includes(
                                code
                            )
                        ) {

                            return true;

                        }


                        // ==================================
                        // TIDAK COCOK
                        // ==================================

                        return false;

                    }
                );


            console.log(
                "CATEGORY PAGE - HASIL FILTER:",
                result
            );


            console.log(
                "CATEGORY PAGE - JUMLAH:",
                result.length
            );


            console.log(
                "========================================"
            );


            return result;

        }, [
            costumes,
            currentSlug
        ]);


    // ======================================================
    // SEARCH + FILTER
    // ======================================================

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

                        if (
                            keyword
                        ) {

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

                                item?.kode_koleksi

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
            // COPY ARRAY
            // ==============================================

            result = [
                ...result
            ];


            // ==============================================
            // SORT NAMA A-Z
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
                            String(
                                nameB
                            ),
                            "id"
                        );

                    }
                );

            }


            // ==============================================
            // SORT NAMA Z-A
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
                            String(
                                nameA
                            ),
                            "id"
                        );

                    }
                );

            }


            // ==============================================
            // SORT HARGA TERMURAH
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
            // SORT HARGA TERMAHAL
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


    // ======================================================
    // DEBUG
    // ======================================================

    useEffect(() => {

        console.log(
            "========================================"
        );

        console.log(
            "CATEGORY:",
            currentSlug
        );

        console.log(
            "JUMLAH SEMUA KOSTUM:",
            costumes.length
        );

        console.log(
            "JUMLAH KOSTUM CATEGORY:",
            categoryCostumes.length
        );

        console.log(
            "JUMLAH KOSTUM SETELAH FILTER:",
            filteredCostumes.length
        );

        console.log(
            "DATA CATEGORY:",
            categoryCostumes
        );

        console.log(
            "========================================"
        );

    }, [
        currentSlug,
        costumes,
        categoryCostumes,
        filteredCostumes
    ]);


    // ======================================================
    // LOADING
    // ======================================================

    if (
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
                    "
                >
                    Memuat koleksi...
                </p>

            </div>

        );

    }


    // ======================================================
    // ERROR
    // ======================================================

    if (
        error
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

                    <h1
                        className="
                            text-2xl
                            font-bold
                            text-red-400
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
                        to="/"
                        className="
                            inline-flex
                            mt-7
                            px-6
                            py-3
                            rounded-xl
                            bg-[#D4AF37]
                            text-black
                            font-semibold
                        "
                    >
                        Kembali ke Beranda
                    </Link>

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
                bg-[#090909]
                text-white
            "
        >

            {/* ==================================================
                HEADER
            ================================================== */}

            <header
                className="
                    pt-28
                    pb-10
                    px-6
                "
            >

                <div
                    className="
                        max-w-6xl
                        mx-auto
                    "
                >

                    <p
                        className="
                            uppercase
                            tracking-[5px]
                            text-[#D4AF37]
                            text-xs
                            text-center
                        "
                    >
                        Handu Atelier
                    </p>


                    <h1
                        className="
                            text-4xl
                            md:text-5xl
                            font-bold
                            text-center
                            mt-4
                        "
                    >
                        {
                            categoryInfo.title
                        }
                    </h1>


                    <p
                        className="
                            text-gray-400
                            text-center
                            mt-4
                            max-w-3xl
                            mx-auto
                        "
                    >
                        {
                            categoryInfo.description
                        }
                    </p>


                    <p
                        className="
                            text-gray-500
                            text-sm
                            text-center
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

                        koleksi
                    </p>

                </div>

            </header>


            {/* ==================================================
                FILTER
            ================================================== */}

            <section
                className="
                    px-6
                    pb-10
                "
            >

                <div
                    className="
                        max-w-6xl
                        mx-auto
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

                        <input
                            type="text"
                            value={
                                search
                            }
                            onChange={(
                                event
                            ) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="
                                Cari nama kategori...
                            "
                            className="
                                w-full
                                lg:max-w-md
                                bg-[#111111]
                                border
                                border-[#D4AF37]/20
                                rounded-xl
                                px-5
                                py-3
                                text-white
                                outline-none
                                focus:border-[#D4AF37]
                            "
                        />


                        {/* SORT */}

                        <select
                            value={
                                sortBy
                            }
                            onChange={(
                                event
                            ) =>
                                setSortBy(
                                    event.target.value
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

            </section>


            {/* ==================================================
                LIST KOSTUM
            ================================================== */}

            <main
                className="
                    px-6
                    pb-20
                "
            >

                <div
                    className="
                        max-w-6xl
                        mx-auto
                    "
                >

                    {
                        filteredCostumes.length >
                        0 ? (

                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    sm:grid-cols-2
                                    lg:grid-cols-3
                                    xl:grid-cols-4
                                    gap-6
                                "
                            >

                                {
                                    filteredCostumes.map(
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
                                    )
                                }

                            </div>

                        ) : (

                            <div
                                className="
                                    rounded-3xl
                                    border
                                    border-[#D4AF37]/20
                                    bg-[#141414]
                                    p-12
                                    text-center
                                "
                            >

                                <h2
                                    className="
                                        text-2xl
                                        font-bold
                                        text-[#D4AF37]
                                    "
                                >
                                    Koleksi Tidak
                                    Ditemukan
                                </h2>


                                <p
                                    className="
                                        text-gray-500
                                        mt-3
                                    "
                                >
                                    Belum ada kostum
                                    dalam kategori ini
                                    yang sesuai dengan
                                    pencarian.
                                </p>

                            </div>

                        )
                    }

                </div>

            </main>

        </div>

    );

}


export default CategoryPage;