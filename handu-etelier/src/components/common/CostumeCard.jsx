import { Link } from "react-router-dom";
import { normalizeFilename } from "../../services/CostumeService";

// ======================================================
// LOAD SEMUA GAMBAR KOSTUM
// ======================================================

const costumeImages = import.meta.glob(
  "../../assets/images/costumes/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

// ======================================================
// PEMETAAN KODE KOLEKSI -> NAMA FILE GAMBAR
// ======================================================

const collectionImageMap = {
  // ==========================================
  // TRADISIONAL
  // ==========================================

  TR001: "tingkuluak-tanduak",
  TR002: "suntiang-taram",
  TR003: "tingkuluak-lenggek",
  TR004: "suntiang-solok",
  TR005: "basiba-tingkuluak-kopong",
  TR006: "tingkuluak-kopong-batik",
  TR007: "baju-tari-kapalo-batik-kucing",
  TR008: "baju-tari-badestar",
  TR009: "suntiang-pariaman",
  TR010: "tingkuluak-koto-gadang",
  TR011: "siger-jawa",
  TR012: "ageng-kanigaran",
  TR013: "paes-ageng-jangkep",
  TR014: "jogja-putri",
  TR015: "pakaian-adat-solo-putri",

  // ==========================================
  // MODERN
  // ==========================================

  MD001: "jas-pria-hitam",
  MD002: "jas-pria-putih",
  MD003: "jas-pria-hitam-putih",
  MD004: "wedding-dress-non-hijab",
  MD005: "wedding-dress-hijab",
  MD006: "dress-awards-non-hijab",
  MD007: "dress-awards-hijab",
  MD008: "glam-outfit-men",

  // ==========================================
  // CLASSIC
  // ==========================================

  CL001: "dress-noni-belanda-vintage",
  CL002: "dress-vintage-eropa-italian",
  CL003: "french-style-retro",
  CL004: "dress-vintage-kerajaan",
  CL005: "halloween-kostum",
  CL006: "bridgerton-kostum",

  // ==========================================
  // FORMAL
  // ==========================================

  FR001: "guide-formal-attire",
  FR002: "house-of-cuff-housecuff-vest",
  FR003: "tuxedo",
  FR004: "dress-korean-style",
  FR005: "semi-formal",
  FR006: "blazer",
};

// ======================================================
// NORMALISASI NAMA FILE
// ======================================================

function normalizeImageName(value) {
  if (!value) {
    return "";
  }

  return String(value)
    .toLowerCase()
    .trim()
    .replace(/\.(jpg|jpeg|png|webp)$/i, "")
    .replace(/[^a-z0-9]/g, "");
}

// ======================================================
// CARI GAMBAR BERDASARKAN KODE KOLEKSI
// ======================================================

function getImageByCollectionCode(
  collectionCode
) {
  if (!collectionCode) {
    return null;
  }

  const expectedName =
    collectionImageMap[
      collectionCode
    ];

  if (!expectedName) {
    return null;
  }

  const normalizedExpected =
    normalizeImageName(
      expectedName
    );

  const entry = Object.entries(
    costumeImages
  ).find(([path]) => {
    const filename =
      path.split("/").pop();

    const normalizedFilename =
      normalizeImageName(filename);

    return (
      normalizedFilename ===
        normalizedExpected ||
      normalizedFilename.includes(
        normalizedExpected
      ) ||
      normalizedExpected.includes(
        normalizedFilename
      )
    );
  });

  return entry ? entry[1] : null;
}

// ======================================================
// CARI GAMBAR DARI FOTO DATABASE
// ======================================================

function getImageByDatabaseFilename(
  filename
) {
  if (!filename) {
    return null;
  }

  const normalizedDatabase =
    normalizeFilename(filename);

  if (!normalizedDatabase) {
    return null;
  }

  const entry = Object.entries(
    costumeImages
  ).find(([path]) => {
    const localFilename =
      path.split("/").pop();

    const normalizedLocal =
      normalizeFilename(
        localFilename
      );

    return (
      normalizedLocal ===
      normalizedDatabase
    );
  });

  return entry ? entry[1] : null;
}

// ======================================================
// CARI GAMBAR
//
// Prioritas:
// 1. Berdasarkan kode koleksi
// 2. Berdasarkan nama file database
// ======================================================

function getCostumeImage(
    collectionCode,
    databaseFilename
) {
    // ==================================================
    // PRIORITAS 1: FOTO DARI DATABASE
    // ==================================================

    if (databaseFilename) {
        const value = String(databaseFilename).trim();

        if (value) {
            // Sudah URL lengkap
            if (
                value.startsWith("http://") ||
                value.startsWith("https://")
            ) {
                return value;
            }

            // Sudah berupa /uploads/...
            if (
                value.startsWith("/uploads/")
            ) {
                return value;
            }

            // Berupa uploads/...
            if (
                value.startsWith("uploads/")
            ) {
                return `/${value}`;
            }

            // Kalau database hanya menyimpan nama file
            return `/uploads/kostum/${value}`;
        }
    }

    // ==================================================
    // PRIORITAS 2: GAMBAR LOCAL ASSETS
    // ==================================================

    const imageByCode =
        getImageByCollectionCode(
            collectionCode
        );

    if (imageByCode) {
        return imageByCode;
    }

    return getImageByDatabaseFilename(
        databaseFilename
    );
}

// ======================================================
// COSTUME CARD
// ======================================================

function CostumeCard({
  code,
  collectionCode,
  image,
  collectionName,
  costumeType,
  price,
  available,
  stock,
  size,
  premium = false,
}) {
  const imageUrl =
    getCostumeImage(
      collectionCode,
      image
    );

  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        bg-[#141414]
        border
        border-[#D4AF37]/20
        hover:border-[#D4AF37]/50
        transition-all
        duration-300
        hover:-translate-y-2
      "
    >

      {/* ==================================================
          FOTO
      ================================================== */}

      <div
        className="
          relative
          h-105
          overflow-hidden
          bg-[#1D1D1D]
        "
      >

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={
              collectionName ||
              "Kostum Handu Atelier"
            }
            className="
              w-full
              h-full
              object-cover
              object-top
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        ) : (
          <div
            className="
              w-full
              h-full
              flex
              items-center
              justify-center
              px-6
              text-center
              text-gray-500
              text-sm
            "
          >
            Foto tidak tersedia
          </div>
        )}

        {/* ==================================================
            PREMIUM BADGE
        ================================================== */}

        {premium && (
          <div
            className="
              absolute
              top-4
              left-4
              bg-[#D4AF37]
              text-black
              text-xs
              font-bold
              px-4
              py-2
              rounded-full
              shadow-lg
            "
          >
            ⭐ Premium
          </div>
        )}

      </div>

      {/* ==================================================
          INFORMASI
      ================================================== */}

      <div className="p-6">

        {/* JENIS */}

        <p
          className="
            text-gray-400
            mt-2
            min-h-6
          "
        >
          {costumeType || "-"}
        </p>

        {/* KODE KOLEKSI */}

        <p
          className="
            text-[#D4AF37]
            text-sm
            font-semibold
            mt-5
          "
        >
          Koleksi:{" "}
          {collectionCode || "-"}
        </p>

        {/* ID DATABASE */}

        <p
          className="
            text-gray-500
            text-xs
            mt-1
          "
        >
          ID Kostum: {code || "-"}
        </p>

        {/* HARGA */}

        <p
          className="
            text-[#D4AF37]
            text-2xl
            font-bold
            mt-5
          "
        >
          Rp{" "}
          {Number(price || 0).toLocaleString(
            "id-ID"
          )}
        </p>

        {/* STATUS */}

        <div className="mt-4">

          {available ? (
            <span className="text-green-400">
              ● Tersedia
            </span>
          ) : (
            <span className="text-red-400">
              ● Tidak tersedia
            </span>
          )}

        </div>

        {/* STOK */}

        <p
          className="
            text-gray-400
            text-sm
            mt-2
          "
        >
          Stok: {stock ?? 0}
        </p>

        {/* UKURAN */}

        <p
          className="
            text-gray-400
            text-sm
            mt-1
          "
        >
          Ukuran: {size || "-"}
        </p>

        {/* DETAIL */}

        <Link
          to={`/costume/${code}`}
          className="
            block
            w-full
            mt-6
            text-center
            bg-[#D4AF37]
            text-black
            py-4
            rounded-xl
            font-semibold
            hover:scale-[1.02]
            transition-all
            duration-300
          "
        >
          Lihat Detail
        </Link>

      </div>

    </div>
  );
}

export default CostumeCard;