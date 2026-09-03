import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FaCalendarAlt,
  FaTshirt,
  FaClipboardList,
  FaRulerCombined,
  FaPalette,
  FaTag,
  FaArrowLeft,
  FaCheckCircle,
} from "react-icons/fa";

import UserLayout from "./UserLayout";

function BorrowingDetail() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [detail, setDetail] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ==================================================
  // LOAD DETAIL
  // ==================================================

  useEffect(() => {
    const loadDetail = async () => {
      try {
        setLoading(true);
        setError("");

        const storedUser =
          localStorage.getItem("user");

        if (!storedUser) {
          navigate("/login", {
            replace: true,
          });

          return;
        }

        const parsedUser =
          JSON.parse(storedUser);

        if (!parsedUser?.id_user) {
          throw new Error(
            "Data user tidak valid."
          );
        }

        const response = await fetch(
          `/detail-peminjaman/${id}/${parsedUser.id_user}`
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Detail peminjaman tidak ditemukan."
          );
        }

        const data =
          result.data || result;

        const detailData =
          Array.isArray(data)
            ? data[0]
            : data;

        if (!detailData) {
          throw new Error(
            "Data detail peminjaman kosong."
          );
        }

        setDetail(detailData);
      } catch (err) {
        console.error(
          "Borrowing detail error:",
          err
        );

        setError(
          err.message ||
            "Gagal mengambil detail peminjaman."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [id, navigate]);

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
    ).format(Number(value) || 0);
  };

  // ==================================================
  // FORMAT TANGGAL
  // ==================================================

  const formatTanggal = (value) => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString(
      "id-ID",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  // ==================================================
  // STATUS
  // ==================================================

  const getStatusClass = (status) => {
    switch (
      String(status || "")
        .toLowerCase()
    ) {
      case "menunggu":
        return `
          bg-yellow-400/10
          text-yellow-400
          border-yellow-400/15
        `;

      case "disetujui":
        return `
          bg-blue-400/10
          text-blue-400
          border-blue-400/15
        `;

      case "diproses":
        return `
          bg-purple-400/10
          text-purple-400
          border-purple-400/15
        `;

      case "selesai":
        return `
          bg-green-400/10
          text-green-400
          border-green-400/15
        `;

      case "ditolak":
        return `
          bg-red-400/10
          text-red-400
          border-red-400/15
        `;

      case "dibatalkan":
        return `
          bg-gray-400/10
          text-gray-400
          border-gray-400/15
        `;

      default:
        return `
          bg-white/5
          text-gray-400
          border-white/5
        `;
    }
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div
        className="
          min-h-screen
          bg-[#080808]
          text-white
          flex
          items-center
          justify-center
        "
      >
        <p className="text-[#D4AF37]">
          Memuat detail peminjaman...
        </p>
      </div>
    );
  }

  // ==================================================
  // ERROR
  // ==================================================

  if (error || !detail) {
    return (
      <div
        className="
          min-h-screen
          bg-[#080808]
          text-white
          flex
          items-center
          justify-center
          px-6
        "
      >
        <div
          className="
            max-w-lg
            w-full
            rounded-3xl
            border
            border-red-500/20
            bg-[#111111]
            p-9
            text-center
          "
        >
          <div
            className="
              w-16
              h-16
              rounded-2xl
              bg-red-500/10
              text-red-400
              mx-auto
              flex
              items-center
              justify-center
              text-2xl
            "
          >
            <FaClipboardList />
          </div>

          <h1
            className="
              text-2xl
              font-bold
              mt-5
            "
          >
            Detail Tidak Ditemukan
          </h1>

          <p
            className="
              text-gray-500
              mt-3
              leading-6
            "
          >
            {error ||
              "Data peminjaman tidak tersedia."}
          </p>

          <div
            className="
              flex
              flex-wrap
              justify-center
              gap-3
              mt-7
            "
          >
            <Link
              to="/my-borrowings"
              className="
                px-6
                py-3
                rounded-xl
                bg-[#D4AF37]
                text-black
                font-semibold
              "
            >
              Peminjaman Saya
            </Link>

            <Link
              to="/dashboard"
              className="
                px-6
                py-3
                rounded-xl
                border
                border-[#D4AF37]/30
                text-[#D4AF37]
              "
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <UserLayout
      title="Detail Peminjaman"
      subtitle={`Peminjaman #${
        detail.id_peminjaman || id
      }`}
    >
      {/* ==================================================
          STATUS HERO
      ================================================== */}

      <section
        className="
          rounded-3xl
          border
          border-[#D4AF37]/15
          bg-gradient-to-br
          from-[#1A160C]
          to-[#111111]
          p-7
          md:p-8
        "
      >
        <div
          className="
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
              Transaction
            </p>

            <h2
              className="
                text-3xl
                md:text-4xl
                font-bold
                mt-3
              "
            >
              Peminjaman #
              {detail.id_peminjaman || id}
            </h2>

            <p
              className="
                text-gray-500
                mt-2
              "
            >
              Informasi lengkap transaksi
              peminjaman Anda.
            </p>
          </div>

          <div
            className={`
              inline-flex
              items-center
              gap-2
              px-4
              py-2.5
              rounded-full
              border
              text-sm
              font-semibold
              w-fit
              ${getStatusClass(
                detail.status
              )}
            `}
          >
            {String(
              detail.status || ""
            ).toLowerCase() === "selesai" && (
              <FaCheckCircle />
            )}

            {detail.status || "Menunggu"}
          </div>
        </div>
      </section>

      {/* ==================================================
          MAIN DETAIL
      ================================================== */}

      <section
        className="
          mt-5
          rounded-3xl
          border
          border-[#D4AF37]/15
          bg-[#111111]
          overflow-hidden
        "
      >
        <div
          className="
            grid
            xl:grid-cols-2
          "
        >
          {/* ==================================================
              KOSTUM
          ================================================== */}

          <div
            className="
              p-7
              md:p-9
              bg-[#171717]
              border-b
              xl:border-b-0
              xl:border-r
              border-white/5
            "
          >
            <p
              className="
                text-[#D4AF37]
                text-xs
                uppercase
                tracking-[4px]
              "
            >
              Costume
            </p>

            <div
              className="
                flex
                items-center
                gap-4
                mt-4
              "
            >
              <div
                className="
                  w-16
                  h-16
                  rounded-2xl
                  bg-[#D4AF37]/10
                  text-[#D4AF37]
                  flex
                  items-center
                  justify-center
                  text-2xl
                "
              >
                <FaTshirt />
              </div>

              <div>
                <h2
                  className="
                    text-2xl
                    md:text-3xl
                    font-bold
                  "
                >
                  {detail.nama_koleksi ||
                    detail.nama_kostum ||
                    "Kostum"}
                </h2>

                <p
                  className="
                    text-gray-500
                    mt-1
                  "
                >
                  {detail.nama_kostum || "-"}
                </p>
              </div>
            </div>

            <div
              className="
                mt-8
                grid
                sm:grid-cols-2
                gap-4
              "
            >
              {/* KODE */}

              <div
                className="
                  rounded-2xl
                  bg-[#111111]
                  border
                  border-white/5
                  p-5
                "
              >
                <FaTag className="text-[#D4AF37]" />

                <p className="text-gray-600 text-xs mt-4">
                  Kode Koleksi
                </p>

                <p className="font-semibold mt-1 text-[#D4AF37]">
                  {detail.kode_koleksi || "-"}
                </p>
              </div>

              {/* WARNA */}

              <div
                className="
                  rounded-2xl
                  bg-[#111111]
                  border
                  border-white/5
                  p-5
                "
              >
                <FaPalette className="text-[#D4AF37]" />

                <p className="text-gray-600 text-xs mt-4">
                  Warna
                </p>

                <p className="font-semibold mt-1">
                  {detail.warna || "-"}
                </p>
              </div>

              {/* UKURAN */}

              <div
                className="
                  rounded-2xl
                  bg-[#111111]
                  border
                  border-white/5
                  p-5
                "
              >
                <FaRulerCombined className="text-[#D4AF37]" />

                <p className="text-gray-600 text-xs mt-4">
                  Ukuran
                </p>

                <p className="font-semibold mt-1">
                  {detail.ukuran || "-"}
                </p>
              </div>

              {/* JUMLAH */}

              <div
                className="
                  rounded-2xl
                  bg-[#111111]
                  border
                  border-white/5
                  p-5
                "
              >
                <FaTshirt className="text-[#D4AF37]" />

                <p className="text-gray-600 text-xs mt-4">
                  Jumlah
                </p>

                <p className="font-semibold mt-1">
                  {detail.jumlah ?? 0}
                </p>
              </div>
            </div>

            {/* HARGA */}

            <div
              className="
                mt-5
                rounded-2xl
                bg-[#111111]
                border
                border-white/5
                p-5
              "
            >
              <p className="text-gray-600 text-xs">
                Harga Sewa / Hari
              </p>

              <p
                className="
                  text-xl
                  font-bold
                  text-[#D4AF37]
                  mt-2
                "
              >
                {formatRupiah(
                  detail.harga_sewa ??
                    detail.harga
                )}
              </p>
            </div>
          </div>

          {/* ==================================================
              TRANSACTION
          ================================================== */}

          <div
            className="
              p-7
              md:p-9
            "
          >
            <p
              className="
                text-[#D4AF37]
                text-xs
                uppercase
                tracking-[4px]
              "
            >
              Rental Information
            </p>

            <h2
              className="
                text-2xl
                md:text-3xl
                font-bold
                mt-3
              "
            >
              Detail Transaksi
            </h2>

            <div
              className="
                mt-8
                space-y-5
              "
            >
              {/* TANGGAL PINJAM */}

              <div
                className="
                  flex
                  items-start
                  gap-4
                  rounded-2xl
                  bg-[#171717]
                  border
                  border-white/5
                  p-5
                "
              >
                <FaCalendarAlt className="text-[#D4AF37] mt-1" />

                <div>
                  <p className="text-gray-600 text-xs">
                    Tanggal Peminjaman
                  </p>

                  <p className="mt-1 font-semibold">
                    {formatTanggal(
                      detail.tanggal_peminjaman
                    )}
                  </p>
                </div>
              </div>

              {/* TANGGAL KEMBALI */}

              <div
                className="
                  flex
                  items-start
                  gap-4
                  rounded-2xl
                  bg-[#171717]
                  border
                  border-white/5
                  p-5
                "
              >
                <FaCalendarAlt className="text-[#D4AF37] mt-1" />

                <div>
                  <p className="text-gray-600 text-xs">
                    Tanggal Kembali
                  </p>

                  <p className="mt-1 font-semibold">
                    {formatTanggal(
                      detail.tanggal_kembali
                    )}
                  </p>
                </div>
              </div>

              {/* SUBTOTAL */}

              <div
                className="
                  rounded-2xl
                  bg-[#171717]
                  border
                  border-white/5
                  p-5
                "
              >
                <p className="text-gray-600 text-xs">
                  Subtotal
                </p>

                <p
                  className="
                    text-xl
                    font-bold
                    text-[#D4AF37]
                    mt-2
                  "
                >
                  {formatRupiah(
                    detail.subtotal
                  )}
                </p>
              </div>
            </div>

            {/* TOTAL */}

            <div
              className="
                mt-7
                pt-7
                border-t
                border-white/5
              "
            >
              <p className="text-gray-600 text-sm">
                Total Peminjaman
              </p>

              <p
                className="
                  text-4xl
                  font-bold
                  text-[#D4AF37]
                  mt-2
                "
              >
                {formatRupiah(
                  detail.total_harga
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          INFORMASI PENGEMBALIAN
      ================================================== */}

      {detail.id_pengembalian && (
        <section
          className="
            mt-5
            rounded-3xl
            border
            border-green-500/20
            bg-[#111111]
            overflow-hidden
          "
        >
          <div className="p-7 md:p-9">
            <p
              className="
                text-green-400
                text-xs
                uppercase
                tracking-[4px]
              "
            >
              Return Information
            </p>

            <h2
              className="
                text-2xl
                md:text-3xl
                font-bold
                mt-3
              "
            >
              Informasi Pengembalian
            </h2>

            <div
              className="
                grid
                md:grid-cols-2
                gap-4
                mt-7
              "
            >
              {/* TANGGAL */}

              <div
                className="
                  rounded-2xl
                  bg-[#171717]
                  border
                  border-white/5
                  p-5
                "
              >
                <p className="text-gray-600 text-xs">
                  Tanggal Pengembalian
                </p>

                <p className="font-semibold mt-2">
                  {formatTanggal(
                    detail.tanggal_pengembalian
                  )}
                </p>
              </div>

              {/* KONDISI */}

              <div
                className="
                  rounded-2xl
                  bg-[#171717]
                  border
                  border-white/5
                  p-5
                "
              >
                <p className="text-gray-600 text-xs">
                  Kondisi Kostum
                </p>

                <p
                  className="
                    font-semibold
                    mt-2
                    text-green-400
                  "
                >
                  {detail.kondisi_baju || "-"}
                </p>
              </div>

              {/* DENDA */}

              <div
                className="
                  rounded-2xl
                  bg-[#171717]
                  border
                  border-white/5
                  p-5
                "
              >
                <p className="text-gray-600 text-xs">
                  Denda
                </p>

                <p
                  className="
                    font-bold
                    text-xl
                    text-[#D4AF37]
                    mt-2
                  "
                >
                  {formatRupiah(
                    detail.denda
                  )}
                </p>
              </div>

              {/* PETUGAS */}

              <div
                className="
                  rounded-2xl
                  bg-[#171717]
                  border
                  border-white/5
                  p-5
                "
              >
                <p className="text-gray-600 text-xs">
                  Diterima Oleh
                </p>

                <p className="font-semibold mt-2">
                  {detail.nama_petugas || "-"}
                </p>
              </div>

              {/* KETERANGAN */}

              <div
                className="
                  md:col-span-2
                  rounded-2xl
                  bg-[#171717]
                  border
                  border-white/5
                  p-5
                "
              >
                <p className="text-gray-600 text-xs">
                  Keterangan
                </p>

                <p
                  className="
                    font-semibold
                    mt-2
                    text-gray-300
                    leading-7
                  "
                >
                  {detail.keterangan ||
                    "Tidak ada keterangan."}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==================================================
          ACTIONS
      ================================================== */}

      <div
        className="
          flex
          flex-col
          sm:flex-row
          gap-3
          mt-5
        "
      >
        <Link
          to="/my-borrowings"
          className="
            flex-1
            flex
            items-center
            justify-center
            gap-2
            py-3.5
            rounded-xl
            bg-[#D4AF37]
            text-black
            font-semibold
          "
        >
          <FaArrowLeft />
          Peminjaman Saya
        </Link>

        <Link
          to="/dashboard"
          className="
            flex-1
            flex
            items-center
            justify-center
            py-3.5
            rounded-xl
            border
            border-[#D4AF37]/25
            text-[#D4AF37]
          "
        >
          Dashboard
        </Link>
      </div>
    </UserLayout>
  );
}

export default BorrowingDetail;