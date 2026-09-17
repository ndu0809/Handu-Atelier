import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaClipboardList,
  FaTshirt,
  FaChevronRight,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUndoAlt,
} from "react-icons/fa";

import UserLayout from "./UserLayout";

function MyBorrowings() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [borrowings, setBorrowings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ======================================================
  // LOAD DATA PEMINJAMAN + PEMBAYARAN + REFUND
  // ======================================================

  useEffect(() => {
    const loadBorrowings = async () => {
      try {
        setLoading(true);
        setError("");

        // ==================================================
        // CEK LOGIN
        // ==================================================

        const storedUser =
          localStorage.getItem("user");

        if (!storedUser) {
          navigate("/login", {
            replace: true,
          });

          return;
        }

        let parsedUser;

        try {
          parsedUser =
            JSON.parse(storedUser);
        } catch (err) {
          localStorage.removeItem("user");
          localStorage.removeItem(
            "isLoggedIn"
          );

          navigate("/login", {
            replace: true,
          });

          return;
        }

        if (!parsedUser?.id_user) {
          throw new Error(
            "Data user tidak valid."
          );
        }

        setUser(parsedUser);

        // ==================================================
        // AMBIL PEMINJAMAN
        // ==================================================

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

        // ==================================================
        // FILTER PEMINJAMAN USER
        // ==================================================

        const userBorrowings =
          allBorrowings.filter(
            (item) =>
              Number(item.id_user) ===
              Number(
                parsedUser.id_user
              )
          );

        // ==================================================
        // AMBIL PEMBAYARAN
        // ==================================================
        //
        // Kita ambil berdasarkan masing-masing
        // peminjaman supaya tidak menampilkan
        // pembayaran milik user lain.
        // ==================================================

        const borrowingsWithPayment =
          await Promise.all(
            userBorrowings.map(
              async (item) => {
                const idPeminjaman =
                  item.id_peminjaman ||
                  item.id;

                let payment = null;
                let refund = null;

                // ==========================================
                // PEMBAYARAN
                // ==========================================

                try {
                  const paymentResponse =
                    await fetch(
                      `/pembayaran/peminjaman/${idPeminjaman}`
                    );

                  if (
                    paymentResponse.ok
                  ) {
                    const paymentResult =
                      await paymentResponse.json();

                    const paymentData =
                      paymentResult.data ||
                      paymentResult.pembayaran ||
                      paymentResult;

                    if (
                      Array.isArray(
                        paymentData
                      ) &&
                      paymentData.length > 0
                    ) {
                      payment =
                        paymentData[0];
                    } else if (
                      paymentData &&
                      !Array.isArray(
                        paymentData
                      ) &&
                      paymentData.id_pembayaran
                    ) {
                      payment =
                        paymentData;
                    }
                  }
                } catch (paymentError) {
                  console.error(
                    `Gagal mengambil pembayaran peminjaman #${idPeminjaman}:`,
                    paymentError
                  );
                }

                // ==========================================
                // REFUND
                // ==========================================

                if (
                  String(
                    item.status || ""
                  ).toLowerCase() ===
                  "ditolak"
                ) {
                  try {
                    const refundResponse =
                      await fetch(
                        `/pengembalian-dana/peminjaman/${idPeminjaman}`
                      );

                    if (
                      refundResponse.ok
                    ) {
                      const refundResult =
                        await refundResponse.json();

                      const refundData =
                        refundResult.data ||
                        refundResult.pengembalian_dana ||
                        refundResult;

                      if (
                        Array.isArray(
                          refundData
                        ) &&
                        refundData.length > 0
                      ) {
                        refund =
                          refundData[0];
                      } else if (
                        refundData &&
                        !Array.isArray(
                          refundData
                        ) &&
                        refundData.id_pengembalian_dana
                      ) {
                        refund =
                          refundData;
                      }
                    }
                  } catch (refundError) {
                    console.error(
                      `Gagal mengambil refund peminjaman #${idPeminjaman}:`,
                      refundError
                    );
                  }
                }

                return {
                  ...item,
                  payment,
                  refund,
                };
              }
            )
          );

        setBorrowings(
          borrowingsWithPayment
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

  // ======================================================
  // FORMAT RUPIAH
  // ======================================================

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

  // ======================================================
  // FORMAT TANGGAL
  // ======================================================

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    try {
      const date =
        new Date(value);

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
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
    } catch {
      return value;
    }
  };

  // ======================================================
  // STATUS PEMINJAMAN
  // ======================================================

  const getStatusClass = (
    status
  ) => {
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
        return "bg-white/5 text-gray-400 border-gray-400/10";
    }
  };

  // ======================================================
  // STATUS PEMBAYARAN
  // ======================================================

  const getPaymentStatusClass = (
    status
  ) => {
    switch (
      String(status || "")
        .toLowerCase()
    ) {
      case "lunas":
        return "bg-green-400/10 text-green-400 border-green-400/15";

      case "belum bayar":
        return "bg-yellow-400/10 text-yellow-400 border-yellow-400/15";

      default:
        return "bg-white/5 text-gray-400 border-white/5";
    }
  };

  // ======================================================
  // STATUS REFUND
  // ======================================================

  const getRefundStatusClass = (
    status
  ) => {
    switch (
      String(status || "")
        .toLowerCase()
    ) {
      case "berhasil":
        return "bg-green-400/10 text-green-400 border-green-400/15";

      case "diproses":
        return "bg-blue-400/10 text-blue-400 border-blue-400/15";

      case "menunggu pengembalian":
        return "bg-yellow-400/10 text-yellow-400 border-yellow-400/15";

      case "gagal":
        return "bg-red-400/10 text-red-400 border-red-400/15";

      default:
        return "bg-white/5 text-gray-400 border-white/5";
    }
  };

  // ======================================================
  // JENIS PEMBAYARAN
  // ======================================================

  const getPaymentType = (
    payment,
    totalHarga
  ) => {
    if (!payment) {
      return "-";
    }

    const jumlah =
      Number(payment.total) || 0;

    const total =
      Number(totalHarga) || 0;

    if (
      total > 0 &&
      jumlah ===
        Math.round(total * 0.5)
    ) {
      return "DP 50%";
    }

    if (
      total > 0 &&
      jumlah === total
    ) {
      return "100%";
    }

    return "Pembayaran";
  };

  // ======================================================
  // STATISTIK
  // ======================================================

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

  // ======================================================
  // LOADING
  // ======================================================

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

  // ======================================================
  // RENDER
  // ======================================================

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
        {/* TOTAL */}

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

        {/* AKTIF */}

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

        {/* MENUNGGU */}

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

        {/* SELESAI */}

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
            (item, index) => {
              const idPeminjaman =
                item.id_peminjaman ||
                item.id;

              const payment =
                item.payment;

              const refund =
                item.refund;

              const statusPeminjaman =
                String(
                  item.status || ""
                ).toLowerCase();

              const paymentStatus =
                payment?.status ||
                "Belum Bayar";

              const paymentType =
                getPaymentType(
                  payment,
                  item.total_harga
                );

              return (
                <article
                  key={
                    idPeminjaman ||
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
                            {idPeminjaman}
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

                    {/* DETAIL PEMINJAMAN */}

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
                          {formatDate(
                            item.tanggal_peminjaman
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-600 text-xs">
                          Tanggal Kembali
                        </p>

                        <p className="mt-1">
                          {formatDate(
                            item.tanggal_kembali
                          )}
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

                    {/* ==================================================
                        PEMBAYARAN
                    ================================================== */}

                    <div
                      className="
                        mt-6
                        p-5
                        rounded-2xl
                        border
                        border-[#D4AF37]/10
                        bg-black/20
                      "
                    >
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
                        <div className="flex items-center gap-3">
                          <div
                            className="
                              w-10
                              h-10
                              rounded-xl
                              bg-[#D4AF37]/10
                              text-[#D4AF37]
                              flex
                              items-center
                              justify-center
                            "
                          >
                            <FaMoneyBillWave />
                          </div>

                          <div>
                            <p className="text-gray-500 text-xs">
                              Pembayaran
                            </p>

                            <p className="font-semibold mt-1">
                              {payment
                                ? paymentType
                                : "Belum ada pembayaran"}
                            </p>
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
                            ${getPaymentStatusClass(
                              paymentStatus
                            )}
                          `}
                        >
                          {paymentStatus}
                        </span>
                      </div>

                      {payment && (
                        <div
                          className="
                            grid
                            sm:grid-cols-2
                            lg:grid-cols-4
                            gap-4
                            mt-5
                            pt-5
                            border-t
                            border-white/5
                          "
                        >
                          <div>
                            <p className="text-gray-600 text-xs">
                              Jumlah Dibayar
                            </p>

                            <p className="mt-1 text-[#D4AF37] font-semibold">
                              {formatRupiah(
                                payment.total
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-gray-600 text-xs">
                              Metode
                            </p>

                            <p className="mt-1">
                              {payment.metode ||
                                "-"}
                            </p>
                          </div>

                          <div>
                            <p className="text-gray-600 text-xs">
                              Tanggal Bayar
                            </p>

                            <p className="mt-1">
                              {formatDate(
                                payment.tanggal_bayar
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-gray-600 text-xs">
                              Sisa Pembayaran
                            </p>

                            <p className="mt-1">
                              {formatRupiah(
                                Math.max(
                                  0,
                                  Number(
                                    item.total_harga
                                  ) -
                                    Number(
                                      payment.total
                                    )
                                )
                              )}
                            </p>
                          </div>
                        </div>
                      )}

                      {!payment && (
                        <p className="text-gray-600 text-sm mt-4">
                          Belum terdapat data pembayaran
                          untuk peminjaman ini.
                        </p>
                      )}
                    </div>

                    {/* ==================================================
                        REFUND
                    ================================================== */}

                    {statusPeminjaman ===
                      "ditolak" && (
                      <div
                        className="
                          mt-4
                          p-5
                          rounded-2xl
                          border
                          border-red-500/10
                          bg-red-950/10
                        "
                      >
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
                          <div className="flex items-center gap-3">
                            <div
                              className="
                                w-10
                                h-10
                                rounded-xl
                                bg-red-400/10
                                text-red-400
                                flex
                                items-center
                                justify-center
                              "
                            >
                              <FaUndoAlt />
                            </div>

                            <div>
                              <p className="text-gray-500 text-xs">
                                Pengembalian Dana
                              </p>

                              <p className="font-semibold mt-1">
                                {refund
                                  ? formatRupiah(
                                      refund.jumlah_dana
                                    )
                                  : "Sedang diproses"}
                              </p>
                            </div>
                          </div>

                          {refund && (
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
                                ${getRefundStatusClass(
                                  refund.status
                                )}
                              `}
                            >
                              {refund.status}
                            </span>
                          )}
                        </div>

                        {!refund && (
                          <p className="text-gray-500 text-sm mt-4">
                            Peminjaman ditolak.
                            Pengembalian dana akan
                            diproses berdasarkan
                            pembayaran yang telah
                            diverifikasi.
                          </p>
                        )}

                        {refund?.tanggal_pengembalian && (
                          <p className="text-gray-500 text-xs mt-4">
                            Tanggal pengembalian:{" "}
                            {formatDate(
                              refund.tanggal_pengembalian
                            )}
                          </p>
                        )}
                      </div>
                    )}

                    {/* ==================================================
                        ACTION
                    ================================================== */}

                    <div
                      className="
                        mt-6
                        pt-6
                        border-t
                        border-white/5
                      "
                    >
                      <Link
                        to={`/borrow-detail/${idPeminjaman}`}
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
              );
            }
          )}
        </section>
      )}
    </UserLayout>
  );
}

export default MyBorrowings;