const API_URL = "/kostum";

// ======================================================
// NORMALISASI NAMA FILE
// ======================================================

function normalizeFilename(filename) {
    if (!filename) {
        return "";
    }

    return String(filename)
        .split("/")
        .pop()
        .trim()
        .toLowerCase()
        .replace(/\.(jpg|jpeg|png|webp)$/i, "")
        .replace(/[^a-z0-9]/g, "");
}

// ======================================================
// URL FOTO
// ======================================================

function normalizeImageUrl(foto) {
    if (!foto) {
        return null;
    }

    const value = String(foto).trim();

    if (!value) {
        return null;
    }

    // URL lengkap
    if (
        value.startsWith("http://") ||
        value.startsWith("https://")
    ) {
        return value;
    }

    // Sudah diawali /
    if (value.startsWith("/")) {
        return value;
    }

    // Belum diawali /
    return `/${value}`;
}

// ======================================================
// PARSE RESPONSE JSON YANG AMAN
// ======================================================

async function parseResponse(response) {
    const raw = await response.text();

    // Response 304 biasanya tidak mempunyai body
    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw);
    } catch (error) {
        console.error(
            "Response server bukan JSON:",
            raw
        );

        throw new Error(
            "Server mengembalikan response yang bukan JSON."
        );
    }
}

// ======================================================
// MAP DATA BACKEND
// ======================================================

const mapCostume = (item) => {

    if (!item) {
        return null;
    }

    // ==================================================
    // FEATURED
    // ==================================================
    // Database biasanya:
    // featured = 1 / 0
    //
    // Tetapi backend/frontend juga mungkin mengirim:
    // true / false
    // is_premium = 1 / 0
    // is_premium = true / false
    // ==================================================

    const isFeatured =
        Number(item.featured) === 1 ||
        item.featured === true ||
        Number(item.is_premium) === 1 ||
        item.is_premium === true;

    // ==================================================
    // STATUS
    // ==================================================

    const status =
        item.status ||
        "Tidak tersedia";

    // ==================================================
    // STOK
    // ==================================================

    const stock =
        Number(item.stok) || 0;

    // ==================================================
    // AVAILABLE
    // ==================================================

    const available =
        String(status)
            .trim()
            .toLowerCase() === "tersedia" &&
        stock > 0;

    return {

        // ==================================================
        // ID
        // ==================================================

        id:
            item.id_kostum ??
            item.id ??
            null,

        id_kostum:
            item.id_kostum ??
            item.id ??
            null,

        // ==================================================
        // KODE
        // ==================================================

        code:
            item.kode_koleksi ||
            item.code ||
            "",

        kode_koleksi:
            item.kode_koleksi ||
            item.code ||
            "",

        // ==================================================
        // KOLEKSI
        // ==================================================

        collectionName:
            item.nama_koleksi ||
            item.nama_kostum ||
            item.collectionName ||
            "",

        nama_koleksi:
            item.nama_koleksi ||
            item.nama_kostum ||
            item.collectionName ||
            "",

        collectionGroup:
            item.kelompok_koleksi ||
            item.collectionGroup ||
            "",

        kelompok_koleksi:
            item.kelompok_koleksi ||
            item.collectionGroup ||
            "",

        // ==================================================
        // NAMA KOSTUM
        // ==================================================

        costumeName:
            item.nama_kostum ||
            item.costumeName ||
            "",

        nama_kostum:
            item.nama_kostum ||
            item.costumeName ||
            "",

        costumeType:
            item.nama_kategori ||
            item.costumeType ||
            "",

        // ==================================================
        // DETAIL
        // ==================================================

        size:
            item.ukuran ||
            item.size ||
            "",

        ukuran:
            item.ukuran ||
            item.size ||
            "",

        color:
            item.warna ||
            item.color ||
            "",

        warna:
            item.warna ||
            item.color ||
            "",

        description:
            item.deskripsi ||
            item.description ||
            "",

        deskripsi:
            item.deskripsi ||
            item.description ||
            "",

        // ==================================================
        // HARGA
        // ==================================================

        price:
            Number(
                item.harga_sewa ??
                item.price ??
                0
            ) || 0,

        harga_sewa:
            Number(
                item.harga_sewa ??
                item.price ??
                0
            ) || 0,

        // ==================================================
        // STOK
        // ==================================================

        stock,

        stok: stock,

        // ==================================================
        // STATUS
        // ==================================================

        status,

        // ==================================================
        // KETERSEDIAAN
        // ==================================================

        available,

        // ==================================================
        // FOTO
        // ==================================================

        image:
            normalizeImageUrl(
                item.foto ||
                item.image
            ),

        foto:
            item.foto ||
            item.image ||
            null,

        // ==================================================
        // KATEGORI
        // ==================================================

        categoryId:
            item.id_kategori ??
            item.categoryId ??
            null,

        categoryName:
            item.nama_kategori ||
            item.categoryName ||
            "",

        id_kategori:
            item.id_kategori ??
            item.categoryId ??
            null,

        nama_kategori:
            item.nama_kategori ||
            item.categoryName ||
            "",

        // ==================================================
        // FEATURED
        // ==================================================

        featured:
            isFeatured,

        // Simpan juga nilai asli database
        featuredValue:
            Number(item.featured) === 1
                ? 1
                : 0
    };
};

// ======================================================
// AMBIL ARRAY DARI RESPONSE
// ======================================================

function extractData(result) {

    if (!result) {
        return [];
    }

    // Response langsung:
    // [...]
    if (Array.isArray(result)) {
        return result;
    }

    // Response:
    // { data: [...] }
    if (Array.isArray(result.data)) {
        return result.data;
    }

    // Response:
    // { kostum: [...] }
    if (Array.isArray(result.kostum)) {
        return result.kostum;
    }

    return [];
}

// ======================================================
// GET SEMUA KOSTUM
// ======================================================

export async function getCostumes() {

    try {

        // ==================================================
        // CACHE BUST
        // ==================================================
        // Mencegah browser memberikan response 304 lama.
        // ==================================================

        const url =
            `${API_URL}?_=${Date.now()}`;

        let response =
            await fetch(url, {
                method: "GET",

                cache: "no-store",

                headers: {
                    Accept:
                        "application/json",
                    "Cache-Control":
                        "no-cache"
                }
            });

        // ==================================================
        // JIKA 304
        // ==================================================
        // Coba request ulang dengan URL baru.
        // ==================================================

        if (response.status === 304) {

            response =
                await fetch(
                    `${API_URL}?refresh=${Date.now()}`,
                    {
                        method: "GET",
                        cache: "no-store",

                        headers: {
                            Accept:
                                "application/json",
                            "Cache-Control":
                                "no-cache"
                        }
                    }
                );
        }

        const result =
            await parseResponse(
                response
            );

        console.log(
            "Response kostum:",
            result
        );

        // ==================================================
        // HTTP ERROR
        // ==================================================

        if (!response.ok) {

            throw new Error(
                result?.message ||
                "Gagal mengambil data kostum."
            );
        }

        // ==================================================
        // DATA
        // ==================================================

        const data =
            extractData(result);

        if (!Array.isArray(data)) {

            throw new Error(
                "Format data kostum dari server tidak sesuai."
            );
        }

        // ==================================================
        // MAP
        // ==================================================

        const mappedData =
            data
                .map(mapCostume)
                .filter(Boolean);

        // ==================================================
        // DEBUG
        // ==================================================

        console.log(
            "Total data kostum:",
            mappedData.length
        );

        console.log(
            "Data kostum:",
            mappedData
        );

        console.log(
            "Data featured:",
            mappedData.filter(
                (item) =>
                    item.featured === true
            )
        );

        console.log(
            "Jumlah featured:",
            mappedData.filter(
                (item) =>
                    item.featured === true
            ).length
        );

        return mappedData;

    } catch (error) {

        console.error(
            "Error getCostumes:",
            error
        );

        throw error;
    }
}

// ======================================================
// GET SATU KOSTUM
// ======================================================

export async function getCostumeById(id) {

    try {

        if (!id) {

            throw new Error(
                "ID kostum tidak valid."
            );
        }

        const response =
            await fetch(
                `${API_URL}/${id}?_=${Date.now()}`,
                {
                    method: "GET",

                    cache: "no-store",

                    headers: {
                        Accept:
                            "application/json",
                        "Cache-Control":
                            "no-cache"
                    }
                }
            );

        // ==================================================
        // HANDLE 304
        // ==================================================

        let currentResponse =
            response;

        if (
            currentResponse.status === 304
        ) {

            currentResponse =
                await fetch(
                    `${API_URL}/${id}?refresh=${Date.now()}`,
                    {
                        method: "GET",

                        cache: "no-store",

                        headers: {
                            Accept:
                                "application/json",
                            "Cache-Control":
                                "no-cache"
                        }
                    }
                );
        }

        const result =
            await parseResponse(
                currentResponse
            );

        console.log(
            "Response detail kostum:",
            result
        );

        // ==================================================
        // HTTP ERROR
        // ==================================================

        if (!currentResponse.ok) {

            throw new Error(
                result?.message ||
                "Gagal mengambil detail kostum."
            );
        }

        // ==================================================
        // AMBIL DATA
        // ==================================================

        let data = null;

        if (
            result &&
            result.data &&
            !Array.isArray(result.data)
        ) {

            data =
                result.data;

        } else if (
            result &&
            result.kostum &&
            !Array.isArray(result.kostum)
        ) {

            data =
                result.kostum;

        } else {

            data =
                result;
        }

        // ==================================================
        // VALIDASI
        // ==================================================

        if (
            !data ||
            Array.isArray(data)
        ) {

            throw new Error(
                "Data detail kostum tidak ditemukan."
            );
        }

        // ==================================================
        // MAP
        // ==================================================

        return mapCostume(data);

    } catch (error) {

        console.error(
            "Error getCostumeById:",
            error
        );

        throw error;
    }
}

// ======================================================
// EXPORT HELPER
// ======================================================

export {
    normalizeFilename,
    normalizeImageUrl,
    mapCostume
};