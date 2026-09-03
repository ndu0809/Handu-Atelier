import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import { getCostumeById } from "../../services/CostumeService";

// ======================================================
// SEMUA GAMBAR KOSTUM
// ======================================================

const costumeImages = import.meta.glob(
  "../../assets/images/costumes/*",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

// ======================================================
// CARI GAMBAR
// ======================================================

function getCostumeImage(filename) {
  if (!filename) {
    return null;
  }

  const cleanFilename = filename
    .split("/")
    .pop()
    .trim()
    .toLowerCase();

  const entry = Object.entries(
    costumeImages
  ).find(([path]) => {
    const pathFilename = path
      .split("/")
      .pop()
      .trim()
      .toLowerCase();

    return pathFilename === cleanFilename;
  });

  return entry ? entry[1] : null;
}

// ======================================================
// COMPONENT
// ======================================================

function CostumeDetail() {
  const { code } = useParams();

  const [costume, setCostume] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCostume = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getCostumeById(code);

        console.log(
          "Detail kostum:",
          data
        );

        setCostume(data);

      } catch (err) {
        console.error(
          "Gagal mengambil detail kostum:",
          err
        );

        setError(
          err.message ||
            "Detail kostum tidak dapat dimuat."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCostume();
  }, [code]);

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090909] text-white flex items-center justify-center">
        <p className="text-[#D4AF37]">
          Memuat detail kostum...
        </p>
      </div>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (error || !costume) {
    return (
      <div className="min-h-screen bg-[#090909] text-white">

        <Navbar />

        <main className="max-w-4xl mx-auto px-6 pt-40 pb-20">

          <div
            className="
              rounded-3xl
              border
              border-red-500/20
              bg-red-500/5
              p-10
              text-center
            "
          >

            <h1 className="text-3xl font-bold text-red-400">
              Kostum Tidak Ditemukan
            </h1>

            <p className="text-gray-400 mt-4">
              {error ||
                "Data kostum tidak tersedia."}
            </p>

            <Link
              to="/"
              className="
                inline-block
                mt-8
                bg-[#D4AF37]
                text-black
                px-6
                py-3
                rounded-xl
                font-semibold
              "
            >
              Kembali ke Beranda
            </Link>

          </div>

        </main>

      </div>
    );
  }

  // ======================================================
  // FOTO
  // ======================================================

  const imageUrl =
    getCostumeImage(costume.image);

  return (
    <div className="min-h-screen bg-[#090909] text-white">

      <Navbar />

      <main
        className="
          max-w-6xl
          mx-auto
          px-6
          pt-32
          pb-20
        "
      >

        {/* ==================================================
            BREADCRUMB
        ================================================== */}

        <div className="mb-8">

          <Link
            to={`/category/${
              costume.collectionGroup ===
              "Tradisional"
                ? "traditional"
                : costume.collectionGroup ===
                  "Modern"
                ? "modern"
                : costume.collectionGroup ===
                  "Classic"
                ? "classic"
                : "formal"
            }`}
            className="text-gray-400 hover:text-[#D4AF37] transition"
          >
            ← Kembali ke koleksi
          </Link>

        </div>

        {/* ==================================================
            DETAIL CARD
        ================================================== */}

        <div
          className="
            grid
            lg:grid-cols-2
            gap-10
            rounded-3xl
            border
            border-[#D4AF37]/20
            bg-[#141414]
            overflow-hidden
          "
        >

          {/* FOTO */}

          <div className="bg-[#1D1D1D] min-h-165.5">

            {imageUrl ? (
              <img
                src={imageUrl}
                alt={
                  costume.collectionName ||
                  "Kostum Handu Atelier"
                }
                className="
                  w-full
                  h-full
                  min-h-165.5
                  object-cover
                  object-top
                "
              />
            ) : (
              <div
                className="
                  w-full
                  min-h-165.5
                  flex
                  items-center
                  justify-center
                  text-gray-500
                "
              >
                Foto tidak tersedia
              </div>
            )}

          </div>

          {/* INFORMASI */}

          <div className="p-8 lg:p-12">

            <p
              className="
                uppercase
                tracking-[4px]
                text-[#D4AF37]
                text-sm
              "
            >
              {costume.collectionGroup ||
                "Collection"}
            </p>

            <h1
              className="
                text-4xl
                md:text-5xl
                font-bold
                mt-4
              "
            >
              {costume.collectionName ||
                costume.costumeName}
            </h1>

            <p className="text-gray-400 mt-4 text-lg">
              {costume.costumeType ||
                "-"}
            </p>

            {/* KODE */}

            <div className="mt-8">

              <p className="text-gray-500 text-sm">
                Kode Koleksi
              </p>

              <p className="text-[#D4AF37] font-semibold mt-1">
                {costume.code || "-"}
              </p>

            </div>

            {/* DESKRIPSI */}

            <div className="mt-8">

              <p className="text-gray-500 text-sm">
                Deskripsi
              </p>

              <p className="text-gray-300 leading-7 mt-2">
                {costume.description ||
                  "Belum ada deskripsi."}
              </p>

            </div>

            {/* HARGA */}

            <div className="mt-8">

              <p className="text-gray-500 text-sm">
                Harga Sewa
              </p>

              <p
                className="
                  text-[#D4AF37]
                  text-3xl
                  font-bold
                  mt-1
                "
              >
                Rp{" "}
                {Number(
                  costume.price || 0
                ).toLocaleString("id-ID")}
              </p>

            </div>

            {/* DETAIL */}

            <div
              className="
                grid
                sm:grid-cols-2
                gap-5
                mt-8
                pt-8
                border-t
                border-white/5
              "
            >

              <div>

                <p className="text-gray-500 text-sm">
                  Stok
                </p>

                <p className="mt-1">
                  {costume.stock ?? 0}
                </p>

              </div>

              <div>

                <p className="text-gray-500 text-sm">
                  Status
                </p>

                <p
                  className={
                    costume.available
                      ? "text-green-400 mt-1"
                      : "text-red-400 mt-1"
                  }
                >
                  {costume.available
                    ? "● Tersedia"
                    : "● Tidak tersedia"}
                </p>

              </div>

              <div>

                <p className="text-gray-500 text-sm">
                  Ukuran
                </p>

                <p className="mt-1">
                  {costume.size || "-"}
                </p>

              </div>

              <div>

                <p className="text-gray-500 text-sm">
                  Warna
                </p>

                <p className="mt-1">
                  {costume.color || "-"}
                </p>

              </div>

            </div>

            {/* BUTTON */}

            {costume.available ? (

              <Link
                to={`/borrow/${costume.id}`}
                className="
                  block
                  w-full
                  text-center
                  mt-10
                  bg-[#D4AF37]
                  text-black
                  py-4
                  rounded-xl
                  font-semibold
                  hover:scale-[1.02]
                  transition
                "
              >
                Ajukan Peminjaman
              </Link>

            ) : (

              <button
                disabled
                className="
                  w-full
                  mt-10
                  py-4
                  rounded-xl
                  bg-gray-700
                  text-gray-400
                  cursor-not-allowed
                "
              >
                Kostum Tidak Tersedia
              </button>

            )}

          </div>

        </div>

      </main>

    </div>
  );
}

export default CostumeDetail;