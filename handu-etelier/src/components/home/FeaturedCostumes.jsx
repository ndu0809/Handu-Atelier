import {
    useEffect,
    useState
} from "react";

import CostumeCard from "../common/CostumeCard";

import {
    getCostumes
} from "../../services/CostumeService";

// ======================================================
// FEATURED COSTUMES
// ======================================================

function FeaturedCostumes() {

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

    // ======================================================
    // AMBIL DATA FEATURED DARI BACKEND
    // ======================================================

    useEffect(() => {

        let cancelled = false;

        const loadFeaturedCostumes =
            async () => {

                try {

                    setLoading(true);
                    setError("");

                    const data =
                        await getCostumes();

                    console.log(
                        "Response kostum:",
                        data
                    );

                    // ==========================================
                    // NORMALISASI RESPONSE
                    // ==========================================

                    let rows = data;

                    if (
                        rows &&
                        !Array.isArray(rows) &&
                        Array.isArray(
                            rows.data
                        )
                    ) {
                        rows = rows.data;
                    }

                    if (
                        rows &&
                        !Array.isArray(rows) &&
                        Array.isArray(
                            rows.costumes
                        )
                    ) {
                        rows = rows.costumes;
                    }

                    if (
                        !Array.isArray(rows)
                    ) {
                        rows = [];
                    }

                    console.log(
                        "Total data kostum:",
                        rows.length
                    );

                    // ==========================================
                    // FILTER FEATURED DARI DATABASE
                    // ==========================================

                    const featuredData =
                        rows.filter(
                            (item) => {

                                const featured =
                                    item?.featured;

                                return (
                                    featured ===
                                        true ||
                                    Number(
                                        featured
                                    ) === 1
                                );
                            }
                        );

                    console.log(
                        "Kostum featured dari database:",
                        featuredData
                    );

                    // ==========================================
                    // URUTKAN BERDASARKAN ID DATABASE
                    // ==========================================

                    featuredData.sort(
                        (
                            a,
                            b
                        ) => {

                            const idA =
                                Number(
                                    a?.id_kostum ??
                                    a?.id ??
                                    0
                                );

                            const idB =
                                Number(
                                    b?.id_kostum ??
                                    b?.id ??
                                    0
                                );

                            return idA - idB;

                        }
                    );

                    if (!cancelled) {

                        setCostumes(
                            featuredData
                        );

                    }

                } catch (err) {

                    console.error(
                        "Gagal mengambil kostum featured:",
                        err
                    );

                    if (!cancelled) {

                        setError(
                            err?.message ||
                            "Kostum pilihan tidak dapat dimuat."
                        );

                        setCostumes([]);

                    }

                } finally {

                    if (!cancelled) {
                        setLoading(false);
                    }

                }

            };

        loadFeaturedCostumes();

        return () => {
            cancelled = true;
        };

    }, []);

    // ======================================================
    // HELPER
    // ======================================================

    const getId =
        (item) => {

            return (
                item?.id_kostum ??
                item?.id ??
                item?.kode_koleksi ??
                item?.code
            );

        };

    const getCode =
        (item) => {

            return (
                item?.kode_koleksi ||
                item?.code ||
                ""
            );

        };

    const getImage =
        (item) => {

            return (
                item?.image ||
                item?.foto ||
                ""
            );

        };

    const getCollectionName =
        (item) => {

            return (
                item?.collectionName ||
                item?.nama_kostum ||
                "Kostum"
            );

        };

    const getCostumeType =
        (item) => {

            return (
                item?.kelompok_koleksi ||
                item?.costumeType ||
                item?.nama_kategori ||
                "Kostum"
            );

        };

    const getPrice =
        (item) => {

            return Number(
                item?.harga_sewa ??
                item?.price ??
                0
            );

        };

    const getAvailable =
        (item) => {

            const status =
                String(
                    item?.status ||
                    ""
                )
                    .toLowerCase()
                    .trim();

            if (
                status ===
                "tersedia"
            ) {
                return true;
            }

            if (
                status ===
                    "dipinjam" ||
                status ===
                    "perawatan" ||
                status ===
                    "rusak"
            ) {
                return false;
            }

            if (
                item?.available !==
                undefined
            ) {
                return Boolean(
                    item.available
                );
            }

            return (
                Number(
                    item?.stok ??
                    item?.stock ??
                    0
                ) > 0
            );

        };

    const getStock =
        (item) => {

            return Number(
                item?.stok ??
                item?.stock ??
                0
            );

        };

    const getSize =
        (item) => {

            // Jika backend mengirim array
            if (
                Array.isArray(
                    item?.size
                )
            ) {
                return item.size;
            }

            // Jika backend hanya mengirim ukuran string
            if (
                item?.ukuran
            ) {
                return [
                    item.ukuran
                ];
            }

            return [];

        };

    // ======================================================
    // RENDER
    // ======================================================

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

                {/* ==================================================
                    HEADER
                ================================================== */}

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
                        Premium Collection
                    </p>

                    <h2
                        className="
                            text-4xl
                            md:text-5xl
                            font-bold
                            mt-4
                        "
                    >
                        Kostum{" "}
                        <span
                            className="
                                text-[#D4AF37]
                            "
                        >
                            Pilihan Pelanggan
                        </span>
                    </h2>

                    <p
                        className="
                            text-gray-400
                            max-w-3xl
                            mx-auto
                            mt-5
                            leading-7
                        "
                    >
                        Koleksi kostum premium
                        Handu Atelier untuk
                        berbagai acara spesial,
                        mulai dari wisuda,
                        pesta, pernikahan,
                        hingga acara adat.
                    </p>

                </div>

                {/* ==================================================
                    LOADING
                ================================================== */}

                {loading && (

                    <div
                        className="
                            py-20
                            text-center
                        "
                    >

                        <p
                            className="
                                text-[#D4AF37]
                            "
                        >
                            Memuat kostum pilihan...
                        </p>

                    </div>

                )}

                {/* ==================================================
                    ERROR
                ================================================== */}

                {!loading &&
                    error && (

                        <div
                            className="
                                max-w-2xl
                                mx-auto
                                text-center
                                rounded-3xl
                                border
                                border-red-500/20
                                bg-red-500/5
                                p-8
                            "
                        >

                            <h3
                                className="
                                    text-2xl
                                    font-bold
                                    text-red-400
                                "
                            >
                                Kostum Pilihan
                                Tidak Dapat Dimuat
                            </h3>

                            <p
                                className="
                                    text-gray-400
                                    mt-3
                                "
                            >
                                {error}
                            </p>

                        </div>

                    )}

                {/* ==================================================
                    DATA
                ================================================== */}

                {!loading &&
                    !error &&
                    costumes.length > 0 && (

                        <div
                            className="
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                lg:grid-cols-3
                                xl:grid-cols-4
                                gap-6
                                lg:gap-8
                            "
                        >

                            {costumes.map(
                                (
                                    item,
                                    index
                                ) => (

                                    <CostumeCard
                                        key={
                                            getId(
                                                item
                                            ) ||
                                            index
                                        }

                                        code={
                                            getId(
                                                item
                                            )
                                        }

                                        collectionCode={
                                            getCode(
                                                item
                                            )
                                        }

                                        image={
                                            getImage(
                                                item
                                            )
                                        }

                                        collectionName={
                                            getCollectionName(
                                                item
                                            )
                                        }

                                        costumeType={
                                            getCostumeType(
                                                item
                                            )
                                        }

                                        price={
                                            getPrice(
                                                item
                                            )
                                        }

                                        available={
                                            getAvailable(
                                                item
                                            )
                                        }

                                        stock={
                                            getStock(
                                                item
                                            )
                                        }

                                        size={
                                            getSize(
                                                item
                                            )
                                        }

                                        premium={
                                            true
                                        }
                                    />

                                )
                            )}

                        </div>

                    )}

                {/* ==================================================
                    EMPTY
                ================================================== */}

                {!loading &&
                    !error &&
                    costumes.length === 0 && (

                        <div
                            className="
                                py-20
                                text-center
                                text-gray-400
                            "
                        >
                            Belum ada kostum pilihan.
                        </div>

                    )}

            </div>

        </section>

    );
}

export default FeaturedCostumes;