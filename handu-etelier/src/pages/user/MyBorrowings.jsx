import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaClipboardList,
  FaTshirt,
  FaChevronRight,
  FaCalendarAlt,
} from "react-icons/fa";

import UserLayout from "./UserLayout";

function MyBorrowings() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [borrowings, setBorrowings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==================================================
  // LOAD
  // ==================================================

  useEffect(() => {
    const loadBorrowings = async () => {
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

        setUser(parsedUser);

        const response =
          await fetch("/peminjaman");

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Gagal mengambil data peminjaman."
          );
        }

        const allBorrowings =
          result.data ||
          result.peminjaman ||
          result;

        if (
          !Array.isArray(
            allBorrowings
          )
        ) {
          throw new Error(
            "Format data peminjaman dari server tidak sesuai."
          );
        }

        const userBorrowings =
          allBorrowings.filter(
            (item) =>
              Number(item.id_user) ===
              Number(
                parsedUser.id_user
              )
          );

        setBorrowings(
          userBorrowings
        );
      } catch (err) {
        console.error(
          "Load borrowings error:",
          err
        );

        setError(
          err.message ||
            "Gagal memuat data peminjaman."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBorrowings();
  }, [navigate]);

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
    ).format(
      Number(value) || 0
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
        return "bg-yellow-400/10 text-yellow-400 border-yellow-400/15";

      case "disetujui":
        return "bg-blue-400/10 text-blue-400 border-blue-400/15";

      case "diproses":
        return "bg-purple-400/10 text-purple-400 border-purple-400/15";

      case "selesai":
        return "bg-green-400/10 text-green-400 border-green-400/15";

      case "ditolak":
        return "bg-red-400/10 text-red-400 border-red-400/15";

      case "dibatalkan":
        return "bg-gray-400/10 text-gray-400 border-gray-400/15";

      default:
        return "bg-white/5 text-gray-400 border-white/5";
    }
  };

  // ==================================================
  // STATISTIK
  // ==================================================

  const statistics = useMemo(() => {
    const total =
      borrowings.length;

    const active =
      borrowings.filter(
        (item) =>
          [
            "disetujui",
            "diproses",
          ].includes(
            String(
              item.status || ""
            ).toLowerCase()
          )
      ).length;

    const waiting =
      borrowings.filter(
        (item) =>
          String(
            item.status || ""
          ).toLowerCase() ===
          "menunggu"
      ).length;

    const completed =
      borrowings.filter(
        (item) =>
          String(
            item.status || ""
          ).toLowerCase() ===
          "selesai"
      ).length;

    return {
      total,
      active,
      waiting,
      completed,
    };
  }, [borrowings]);

  // ==================================================
  // LOADING
  // ==================================================

  if (loading || !user) {
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
          Memuat peminjaman...
        </p>
      </div>
    );
  }

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <UserLayout
      title="Peminjaman Saya"
      subtitle="Riwayat dan status peminjaman kostum Anda"
    >
      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div
          className="
            mb-5
            rounded-2xl
            border
            border-red-500/20
            bg-red-500/10
            px-5
            py-4
            text-red-400
            text-sm
          "
        >
          {error}
        </div>
      )}

      {/* ==================================================
          STATISTICS
      ================================================== */}

      <section
        className="
          grid
          sm:grid-cols-2
          xl:grid-cols-4
          gap-4
          mb-5
        "
      >
        <div
          className="
            rounded-2xl
            border
            border-[#D4AF37]/15
            bg-[#111111]
            p-5
          "
        >
          <div className="flex justify-between">
            <div>
              <p className="text-gray-600 text-sm">
                Total
              </p>

              <p className="text-3xl font-bold text-[#D4AF37] mt-2">
                {statistics.total}
              </p>
            </div>

            <FaClipboardList className="text-[#D4AF37] text-2xl" />
          </div>
        </div>

        <div
          className="
            rounded-2xl
            border
            border-[#D4AF37]/15
            bg-[#111111]
            p-5
          "
        >
          <div className="flex justify-between">
            <div>
              <p className="text-gray-600 text-sm">
                Aktif
              </p>

              <p className="text-3xl font-bold text-[#D4AF37] mt-2">
                {statistics.active}
              </p>
            </div>

            <FaTshirt className="text-[#D4AF37] text-2xl" />
          </div>
        </div>

        <div
          className="
            rounded-2xl
            border
            border-[#D4AF37]/15
            bg-[#111111]
            p-5
          "
        >
          <div className="flex justify-between">
            <div>
              <p className="text-gray-600 text-sm">
                Menunggu
              </p>

              <p className="text-3xl font-bold text-[#D4AF37] mt-2">
                {statistics.waiting}
              </p>
            </div>

            <FaCalendarAlt className="text-[#D4AF37] text-2xl" />
          </div>
        </div>

        <div
          className="
            rounded-2xl
            border
            border-[#D4AF37]/15
            bg-[#111111]
            p-5
          "
        >
          <div className="flex justify-between">
            <div>
              <p className="text-gray-600 text-sm">
                Selesai
              </p>

              <p className="text-3xl font-bold text-[#D4AF37] mt-2">
                {statistics.completed}
              </p>
            </div>

            <FaClipboardList className="text-[#D4AF37] text-2xl" />
          </div>
        </div>
      </section>

      {/* ==================================================
          EMPTY
      ================================================== */}

      {borrowings.length === 0 && (
        <section
          className="
            rounded-3xl
            border
            border-[#D4AF37]/15
            bg-[#111111]
            p-10
            md:p-14
            text-center
          "
        >
          <div
            className="
              w-20
              h-20
              rounded-3xl
              mx-auto
              bg-[#D4AF37]/10
              text-[#D4AF37]
              flex
              items-center
              justify-center
              text-3xl
            "
          >
            <FaTshirt />
          </div>

          <p
            className="
              mt-6
              text-[#D4AF37]
              text-xs
              uppercase
              tracking-[4px]
            "
          >
            Belum Ada Peminjaman
          </p>

          <h2
            className="
              text-3xl
              md:text-4xl
              font-bold
              mt-3
            "
          >
            Mulai koleksi pengalaman Anda
          </h2>

          <p
            className="
              text-gray-600
              mt-4
              max-w-xl
              mx-auto
              leading-7
            "
          >
            Jelajahi koleksi kostum
            Handu Atelier dan ajukan
            peminjaman.
          </p>

          <Link
            to="/collections"
            className="
              inline-flex
              items-center
              gap-2
              mt-7
              px-6
              py-3.5
              rounded-xl
              bg-[#D4AF37]
              text-black
              font-semibold
            "
          >
            Jelajahi Koleksi
            <FaChevronRight />
          </Link>
        </section>
      )}

      {/* ==================================================
          LIST
      ================================================== */}

      {borrowings.length > 0 && (
        <section className="space-y-4">
          {borrowings.map(
            (item, index) => (
              <article
                key={
                  item.id_peminjaman ||
                  item.id ||
                  index
                }
                className="
                  rounded-3xl
                  border
                  border-[#D4AF37]/15
                  bg-[#111111]
                  overflow-hidden
                  hover:border-[#D4AF37]/30
                  transition
                "
              >
                <div className="p-6 md:p-7">
                  {/* HEADER */}

                  <div
                    className="
                      flex
                      flex-col
                      md:flex-row
                      md:items-center
                      md:justify-between
                      gap-4
                    "
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="
                          w-14
                          h-14
                          rounded-2xl
                          bg-[#D4AF37]/10
                          text-[#D4AF37]
                          flex
                          items-center
                          justify-center
                          text-xl
                        "
                      >
                        <FaTshirt />
                      </div>

                      <div>
                        <p
                          className="
                            text-[#D4AF37]
                            text-xs
                            uppercase
                            tracking-[3px]
                          "
                        >
                          Peminjaman #
                          {
                            item.id_peminjaman ||
                              item.id
                          }
                        </p>

                        <h2 className="text-xl font-bold mt-1">
                          {item.nama_koleksi ||
                            item.nama_kostum ||
                            item.nama ||
                            "Kostum"}
                        </h2>

                        {item.kode_koleksi && (
                          <p className="text-gray-600 text-xs mt-1">
                            Kode:{" "}
                            {
                              item.kode_koleksi
                            }
                          </p>
                        )}
                      </div>
                    </div>

                    <span
                      className={`
                        inline-flex
                        items-center
                        border
                        rounded-full
                        px-4
                        py-2
                        text-xs
                        font-semibold
                        w-fit
                        ${getStatusClass(
                          item.status
                        )}
                      `}
                    >
                      {item.status ||
                        "Tidak diketahui"}
                    </span>
                  </div>

                  {/* DETAILS */}

                  <div
                    className="
                      grid
                      sm:grid-cols-2
                      lg:grid-cols-4
                      gap-5
                      mt-6
                      pt-6
                      border-t
                      border-white/5
                    "
                  >
                    <div>
                      <p className="text-gray-600 text-xs">
                        Tanggal Peminjaman
                      </p>

                      <p className="mt-1">
                        {
                          item.tanggal_peminjaman ||
                            "-"
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-600 text-xs">
                        Tanggal Kembali
                      </p>

                      <p className="mt-1">
                        {
                          item.tanggal_kembali ||
                            "-"
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-600 text-xs">
                        Total Harga
                      </p>

                      <p className="mt-1 text-[#D4AF37] font-semibold">
                        {formatRupiah(
                          item.total_harga
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-600 text-xs">
                        ID User
                      </p>

                      <p className="mt-1">
                        {item.id_user ||
                          user.id_user}
                      </p>
                    </div>
                  </div>

                  {/* ACTION */}

                  <div
                    className="
                      mt-6
                      pt-6
                      border-t
                      border-white/5
                    "
                  >
                    <Link
                      to={`/borrow-detail/${
                        item.id_peminjaman ||
                        item.id
                      }`}
                      className="
                        w-full
                        flex
                        items-center
                        justify-center
                        gap-2
                        py-3.5
                        rounded-xl
                        bg-[#D4AF37]
                        text-black
                        font-semibold
                        hover:scale-[1.01]
                        transition
                      "
                    >
                      Lihat Detail
                      <FaChevronRight />
                    </Link>
                  </div>
                </div>
              </article>
            )
          )}
        </section>
      )}
    </UserLayout>
  );
}

export default MyBorrowings;