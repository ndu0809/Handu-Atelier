import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  FaCalendarAlt,
  FaTshirt,
  FaClipboardList,
  FaRulerCombined,
  FaPalette,
  FaTag,
  FaArrowLeft,
  FaCheckCircle,
  FaMoneyBillWave,
  FaUndoAlt,
  FaReceipt,
  FaUpload,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa";

import UserLayout from "./UserLayout";

function BorrowingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [detail, setDetail] = useState(null);
  const [payment, setPayment] = useState(null);
  const [refund, setRefund] = useState(null);
  const [denda, setDenda] = useState(null);
  const [pembayaranDenda, setPembayaranDenda] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showDendaPayment, setShowDendaPayment] = useState(false);
  const [savingDendaPayment, setSavingDendaPayment] = useState(false);
  const [dendaPaymentError, setDendaPaymentError] = useState("");
  const [dendaPaymentSuccess, setDendaPaymentSuccess] = useState("");

  const [dendaPaymentForm, setDendaPaymentForm] = useState({
    metode: "Transfer",
    tanggal_bayar: "",
    bukti_bayar: null,
    keterangan: "",
  });

  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);
  };

  const formatTanggal = (value) => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const loadDetail = async () => {
    try {
      setLoading(true);
      setError("");

      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        navigate("/login", {
          replace: true,
        });

        return;
      }

      let parsedUser;

      try {
        parsedUser = JSON.parse(storedUser);
      } catch (err) {
        console.error("Data user tidak valid:", err);

        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");

        navigate("/login", {
          replace: true,
        });

        return;
      }

      if (!parsedUser?.id_user) {
        throw new Error("Data user tidak valid.");
      }

      // ==================================================
      // DETAIL PEMINJAMAN
      // ==================================================

      const response = await fetch(
        `/detail-peminjaman/${id}/${parsedUser.id_user}`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Detail peminjaman tidak ditemukan."
        );
      }

      const data = result.data || result;

      const detailData = Array.isArray(data)
        ? data[0]
        : data;

      if (!detailData) {
        throw new Error(
          "Data detail peminjaman kosong."
        );
      }

      setDetail(detailData);

      console.log(
        "DETAIL PEMINJAMAN FINAL:",
        detailData
      );

      console.log(
        "ID PENGEMBALIAN:",
        detailData.id_pengembalian
      );

      setDetail(detailData);

      // ==================================================
      // PEMBAYARAN PEMINJAMAN
      // ==================================================

      try {
        const paymentResponse = await fetch(
          `/pembayaran/peminjaman/${id}`
        );

        if (paymentResponse.ok) {
          const paymentResult =
            await paymentResponse.json();

          const paymentData =
            paymentResult.data ||
            paymentResult.pembayaran ||
            paymentResult;

          if (Array.isArray(paymentData)) {
            setPayment(
              paymentData.length > 0
                ? paymentData[0]
                : null
            );
          } else if (
            paymentData &&
            paymentData.id_pembayaran
          ) {
            setPayment(paymentData);
          } else {
            setPayment(null);
          }
        } else {
          setPayment(null);
        }
      } catch (paymentError) {
        console.error(
          "Gagal mengambil pembayaran:",
          paymentError
        );

        setPayment(null);
      }

      // ==================================================
      // REFUND
      // ==================================================

      if (
        String(detailData.status || "")
          .toLowerCase() === "ditolak"
      ) {
        try {
          const refundResponse = await fetch(
            `/pengembalian-dana/peminjaman/${id}`
          );

          if (refundResponse.ok) {
            const refundResult =
              await refundResponse.json();

            const refundData =
              refundResult.data ||
              refundResult.pengembalian_dana ||
              refundResult;

            if (Array.isArray(refundData)) {
              setRefund(
                refundData.length > 0
                  ? refundData[0]
                  : null
              );
            } else if (
              refundData &&
              refundData.id_pengembalian_dana
            ) {
              setRefund(refundData);
            } else {
              setRefund(null);
            }
          } else {
            setRefund(null);
          }
        } catch (refundError) {
          console.error(
            "Gagal mengambil refund:",
            refundError
          );

          setRefund(null);
        }
      } else {
        setRefund(null);
      }

      // ==================================================
      // DENDA
      // ==================================================

      setDenda(null);
      setPembayaranDenda(null);

      if (detailData.id_pengembalian) {
        try {
          const dendaResponse = await fetch(
            `/api/denda/pengembalian/${detailData.id_pengembalian}?_t=${Date.now()}`,
            {
              cache: "no-store",
            }
          );

          const dendaResult =
            await dendaResponse.json();

          console.log(
            "RESPONSE DENDA:",
            dendaResult
          );

          if (!dendaResponse.ok) {
            console.error(
              "Gagal mengambil data denda:",
              dendaResult
            );
          } else {
            let dendaData =
              dendaResult.data ??
              dendaResult.denda ??
              dendaResult;

            console.log(
              "DATA DENDA:",
              dendaData
            );

            let dendaItem = null;

            if (Array.isArray(dendaData)) {
              dendaItem =
                dendaData.length > 0
                  ? dendaData[0]
                  : null;
            } else if (
              dendaData &&
              typeof dendaData === "object"
            ) {
              if (dendaData.id_denda) {
                dendaItem = dendaData;
              } else if (
                Array.isArray(dendaData.rows) &&
                dendaData.rows.length > 0
              ) {
                dendaItem =
                  dendaData.rows[0];
              } else if (
                Array.isArray(dendaData.data) &&
                dendaData.data.length > 0
              ) {
                dendaItem =
                  dendaData.data[0];
              }
            }

            console.log(
              "DENDA ITEM FINAL:",
              dendaItem
            );

            setDenda(dendaItem);

            // ==================================================
            // PEMBAYARAN DENDA
            // ==================================================

            if (dendaItem?.id_denda) {
              try {
                const dendaPaymentResponse =
                  await fetch(
                    `/api/pembayaran-denda/denda/${dendaItem.id_denda}?_t=${Date.now()}`,
                    {
                      cache: "no-store",
                    }
                  );

                const dendaPaymentResult =
                  await dendaPaymentResponse.json();

                console.log(
                  "RESPONSE PEMBAYARAN DENDA:",
                  dendaPaymentResult
                );

                if (dendaPaymentResponse.ok) {
                  let dendaPaymentData =
                    dendaPaymentResult.data ??
                    dendaPaymentResult.pembayaran_denda ??
                    dendaPaymentResult;

                  let pembayaranDendaItem =
                    null;

                  if (
                    Array.isArray(
                      dendaPaymentData
                    )
                  ) {
                    pembayaranDendaItem =
                      dendaPaymentData.length >
                      0
                        ? dendaPaymentData[0]
                        : null;
                  } else if (
                    dendaPaymentData &&
                    typeof dendaPaymentData ===
                      "object"
                  ) {
                    if (
                      dendaPaymentData.id_pembayaran_denda
                    ) {
                      pembayaranDendaItem =
                        dendaPaymentData;
                    } else if (
                      Array.isArray(
                        dendaPaymentData.rows
                      ) &&
                      dendaPaymentData.rows
                        .length > 0
                    ) {
                      pembayaranDendaItem =
                        dendaPaymentData.rows[0];
                    } else if (
                      Array.isArray(
                        dendaPaymentData.data
                      ) &&
                      dendaPaymentData.data
                        .length > 0
                    ) {
                      pembayaranDendaItem =
                        dendaPaymentData.data[0];
                    }
                  }

                  console.log(
                    "PEMBAYARAN DENDA FINAL:",
                    pembayaranDendaItem
                  );

                  setPembayaranDenda(
                    pembayaranDendaItem
                  );
                } else {
                  console.error(
                    "Gagal mengambil pembayaran denda:",
                    dendaPaymentResult
                  );

                  setPembayaranDenda(null);
                }
              } catch (
                dendaPaymentError
              ) {
                console.error(
                  "Error pembayaran denda:",
                  dendaPaymentError
                );

                setPembayaranDenda(null);
              }
            }
          }
        } catch (dendaError) {
          console.error(
            "Error mengambil denda:",
            dendaError
          );

          setDenda(null);
          setPembayaranDenda(null);
        }
      }
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

  useEffect(() => {
    loadDetail();
  }, [id, navigate]);

  // ==================================================
  // STATUS PEMINJAMAN
  // ==================================================

  const getStatusClass = (status) => {
    switch (
      String(status || "").toLowerCase()
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
  // STATUS PEMBAYARAN
  // ==================================================

  const getPaymentStatusClass = (status) => {
    switch (
      String(status || "").toLowerCase()
    ) {
      case "lunas":
        return `
          bg-green-400/10
          text-green-400
          border-green-400/15
        `;

      case "belum bayar":
        return `
          bg-yellow-400/10
          text-yellow-400
          border-yellow-400/15
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
  // STATUS REFUND
  // ==================================================

  const getRefundStatusClass = (status) => {
    switch (
      String(status || "").toLowerCase()
    ) {
      case "menunggu pengembalian":
        return `
          bg-yellow-400/10
          text-yellow-400
          border-yellow-400/15
        `;

      case "diproses":
        return `
          bg-blue-400/10
          text-blue-400
          border-blue-400/15
        `;

      case "berhasil":
        return `
          bg-green-400/10
          text-green-400
          border-green-400/15
        `;

      case "gagal":
        return `
          bg-red-400/10
          text-red-400
          border-red-400/15
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
  // STATUS DENDA
  // ==================================================

  const getDendaStatusClass = (status) => {
    switch (
      String(status || "").toLowerCase()
    ) {
      case "lunas":
        return `
          bg-green-400/10
          text-green-400
          border-green-400/15
        `;

      case "menunggu verifikasi":
        return `
          bg-blue-400/10
          text-blue-400
          border-blue-400/15
        `;

      case "belum dibayar":
        return `
          bg-red-400/10
          text-red-400
          border-red-400/15
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
  // JENIS PEMBAYARAN
  // ==================================================

  const getPaymentType = () => {
    if (!payment) {
      return "-";
    }

    const jumlah =
      Number(payment.total) || 0;

    const total =
      Number(detail?.total_harga) || 0;

    if (
      total > 0 &&
      jumlah === Math.round(total * 0.5)
    ) {
      return "DP 50%";
    }

    if (
      total > 0 &&
      jumlah === total
    ) {
      return "Pembayaran 100%";
    }

    return "Pembayaran";
  };

  // ==================================================
  // BUKA MODAL BAYAR DENDA
  // ==================================================

  const openDendaPayment = () => {
    setDendaPaymentError("");
    setDendaPaymentSuccess("");

    setDendaPaymentForm({
      metode: "Transfer",
      tanggal_bayar:
        new Date()
          .toISOString()
          .slice(0, 16),
      bukti_bayar: null,
      keterangan: "",
    });

    setShowDendaPayment(true);
  };

  // ==================================================
  // TUTUP MODAL
  // ==================================================

  const closeDendaPayment = () => {
    if (savingDendaPayment) {
      return;
    }

    setShowDendaPayment(false);
    setDendaPaymentError("");
    setDendaPaymentSuccess("");
  };

  // ==================================================
  // SUBMIT PEMBAYARAN DENDA
  // ==================================================

  const handleDendaPaymentSubmit = async (
    e
  ) => {
    e.preventDefault();

    setDendaPaymentError("");
    setDendaPaymentSuccess("");

    if (!denda?.id_denda) {
      setDendaPaymentError(
        "Data denda tidak ditemukan."
      );

      return;
    }

    const metode =
      dendaPaymentForm.metode;

    if (
      (metode === "Transfer" ||
        metode === "QRIS") &&
      !dendaPaymentForm.bukti_bayar
    ) {
      setDendaPaymentError(
        "Bukti pembayaran wajib diunggah untuk Transfer atau QRIS."
      );

      return;
    }

    try {
      setSavingDendaPayment(true);

      const formData = new FormData();

      formData.append(
        "id_denda",
        String(denda.id_denda)
      );

      formData.append(
        "tanggal_bayar",
        dendaPaymentForm.tanggal_bayar ||
          new Date().toISOString()
      );

      formData.append(
        "jumlah",
        String(
          Number(denda.nominal_denda) || 0
        )
      );

      formData.append(
        "metode",
        metode
      );

      formData.append(
        "status",
        "Menunggu Verifikasi"
      );

      if (
        dendaPaymentForm.keterangan.trim()
      ) {
        formData.append(
          "keterangan",
          dendaPaymentForm.keterangan.trim()
        );
      }

      if (
        dendaPaymentForm.bukti_bayar
      ) {
        formData.append(
          "bukti_bayar",
          dendaPaymentForm.bukti_bayar
        );
      }

      const response = await fetch(
        "/api/pembayaran-denda",
        {
          method: "POST",
          body: formData,
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Gagal mengirim pembayaran denda."
        );
      }

      setDendaPaymentSuccess(
        "Pembayaran denda berhasil dikirim dan sedang menunggu verifikasi Petugas."
      );

      await loadDetail();

      setTimeout(() => {
        setShowDendaPayment(false);
        setDendaPaymentSuccess("");
      }, 1500);
    } catch (err) {
      console.error(
        "Pembayaran denda error:",
        err
      );

      setDendaPaymentError(
        err.message ||
          "Gagal mengirim pembayaran denda."
      );
    } finally {
      setSavingDendaPayment(false);
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
  // DATA TAMBAHAN
  // ==================================================

  const totalHarga =
    Number(detail.total_harga) || 0;

  const jumlahDibayar =
    Number(payment?.total) || 0;

  const sisaPembayaran = Math.max(
    0,
    totalHarga - jumlahDibayar
  );

  const statusPeminjaman =
    String(detail.status || "")
      .toLowerCase();

  const statusPembayaran =
    payment?.status || "Belum Bayar";

  const statusDenda =
    String(denda?.status || "")
      .toLowerCase();

  const statusPembayaranDenda =
    pembayaranDenda?.status ||
    denda?.status ||
    "Belum Dibayar";

  const pembayaranDendaSudahAda =
    Boolean(
      pembayaranDenda?.id_pembayaran_denda
    );

  const pembayaranDendaLunas =
    String(
      pembayaranDenda?.status || ""
    ).toLowerCase() === "lunas" ||
    statusDenda === "lunas";

  const pembayaranDendaMenunggu =
    String(
      pembayaranDenda?.status || ""
    ).toLowerCase() ===
    "menunggu verifikasi";

  const dendaBelumDibayar =
    statusDenda === "belum dibayar" &&
    !pembayaranDendaSudahAda;

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <>
      <UserLayout
        title="Detail Peminjaman"
        subtitle={`Peminjaman #${
          detail.id_peminjaman || id
        }`}
      >
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
              {statusPeminjaman ===
                "selesai" && (
                <FaCheckCircle />
              )}

              {detail.status || "Menunggu"}
            </div>
          </div>
        </section>

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
                    {detail.nama_kostum ||
                      "-"}
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
                    {detail.kode_koleksi ||
                      "-"}
                  </p>
                </div>

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

              <div className="mt-8 space-y-5">
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
            PEMBAYARAN PEMINJAMAN
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
          <div className="p-7 md:p-9">
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
              <div>
                <p
                  className="
                    text-[#D4AF37]
                    text-xs
                    uppercase
                    tracking-[4px]
                  "
                >
                  Payment
                </p>

                <h2
                  className="
                    text-2xl
                    md:text-3xl
                    font-bold
                    mt-3
                  "
                >
                  Informasi Pembayaran
                </h2>
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
                    statusPembayaran
                  )}
                `}
              >
                {statusPembayaran}
              </span>
            </div>

            {payment ? (
              <>
                <div
                  className="
                    grid
                    md:grid-cols-2
                    lg:grid-cols-4
                    gap-4
                    mt-7
                  "
                >
                  <div className="rounded-2xl bg-[#171717] border border-white/5 p-5">
                    <FaReceipt className="text-[#D4AF37]" />

                    <p className="text-gray-600 text-xs mt-4">
                      Jenis Pembayaran
                    </p>

                    <p className="font-semibold mt-1">
                      {getPaymentType()}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#171717] border border-white/5 p-5">
                    <FaMoneyBillWave className="text-[#D4AF37]" />

                    <p className="text-gray-600 text-xs mt-4">
                      Jumlah Dibayar
                    </p>

                    <p className="font-semibold mt-1 text-[#D4AF37]">
                      {formatRupiah(
                        payment.total
                      )}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#171717] border border-white/5 p-5">
                    <p className="text-gray-600 text-xs">
                      Metode Pembayaran
                    </p>

                    <p className="font-semibold mt-2">
                      {payment.metode || "-"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#171717] border border-white/5 p-5">
                    <p className="text-gray-600 text-xs">
                      Tanggal Pembayaran
                    </p>

                    <p className="font-semibold mt-2">
                      {formatTanggal(
                        payment.tanggal_bayar
                      )}
                    </p>
                  </div>
                </div>

                <div
                  className="
                    mt-5
                    rounded-2xl
                    bg-[#171717]
                    border
                    border-white/5
                    p-5
                  "
                >
                  <div
                    className="
                      flex
                      flex-col
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                      gap-3
                    "
                  >
                    <div>
                      <p className="text-gray-600 text-xs">
                        Sisa Pembayaran
                      </p>

                      <p className="text-xl font-bold mt-1">
                        {formatRupiah(
                          sisaPembayaran
                        )}
                      </p>
                    </div>

                    <div
                      className={`
                        px-4
                        py-2
                        rounded-xl
                        text-sm
                        ${
                          sisaPembayaran ===
                          0
                            ? "bg-green-400/10 text-green-400"
                            : "bg-yellow-400/10 text-yellow-400"
                        }
                      `}
                    >
                      {sisaPembayaran ===
                      0
                        ? "Pembayaran Lunas"
                        : "Masih Ada Sisa"}
                    </div>
                  </div>
                </div>

                {String(
                  payment.status || ""
                ).toLowerCase() ===
                  "belum bayar" && (
                  <div className="mt-5 p-5 rounded-2xl bg-yellow-950/20 border border-yellow-500/15">
                    <p className="text-yellow-300 text-sm leading-6">
                      Pembayaran Anda sudah
                      tercatat dan sedang
                      menunggu verifikasi
                      Petugas. Status akan
                      berubah menjadi
                      <strong> Lunas </strong>
                      setelah pembayaran
                      diverifikasi.
                    </p>
                  </div>
                )}

                {String(
                  payment.status || ""
                ).toLowerCase() ===
                  "lunas" && (
                  <div className="mt-5 p-5 rounded-2xl bg-green-950/20 border border-green-500/15">
                    <div className="flex items-start gap-3">
                      <FaCheckCircle className="text-green-400 mt-1" />

                      <p className="text-green-300 text-sm leading-6">
                        Pembayaran telah
                        diverifikasi oleh
                        Petugas.
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="mt-7 p-5 rounded-2xl bg-yellow-950/20 border border-yellow-500/15">
                <p className="text-yellow-300 text-sm">
                  Belum terdapat data
                  pembayaran untuk peminjaman
                  ini.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ==================================================
            REFUND
        ================================================== */}

        {statusPeminjaman ===
          "ditolak" && (
          <section
            className="
              mt-5
              rounded-3xl
              border
              border-red-500/20
              bg-[#111111]
              overflow-hidden
            "
          >
            <div className="p-7 md:p-9">
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
                <div>
                  <p className="text-red-400 text-xs uppercase tracking-[4px]">
                    Refund
                  </p>

                  <h2 className="text-2xl md:text-3xl font-bold mt-3">
                    Pengembalian Dana
                  </h2>
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

              {refund ? (
                <div
                  className="
                    grid
                    md:grid-cols-2
                    lg:grid-cols-3
                    gap-4
                    mt-7
                  "
                >
                  <div className="rounded-2xl bg-[#171717] border border-white/5 p-5">
                    <FaUndoAlt className="text-red-400" />

                    <p className="text-gray-600 text-xs mt-4">
                      Dana Dikembalikan
                    </p>

                    <p className="font-bold text-xl mt-1 text-[#D4AF37]">
                      {formatRupiah(
                        refund.jumlah_dana
                      )}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#171717] border border-white/5 p-5">
                    <p className="text-gray-600 text-xs">
                      Metode Pengembalian
                    </p>

                    <p className="font-semibold mt-2">
                      {refund.metode_pengembalian ||
                        "-"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#171717] border border-white/5 p-5">
                    <p className="text-gray-600 text-xs">
                      Tanggal Pengembalian
                    </p>

                    <p className="font-semibold mt-2">
                      {refund.tanggal_pengembalian
                        ? formatTanggal(
                            refund.tanggal_pengembalian
                          )
                        : "-"}
                    </p>
                  </div>

                  {refund.keterangan && (
                    <div className="md:col-span-2 lg:col-span-3 rounded-2xl bg-[#171717] border border-white/5 p-5">
                      <p className="text-gray-600 text-xs">
                        Keterangan
                      </p>

                      <p className="font-semibold mt-2 text-gray-300 leading-6">
                        {refund.keterangan}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-7 p-5 rounded-2xl bg-red-950/20 border border-red-500/15">
                  <p className="text-red-300 text-sm leading-6">
                    Peminjaman Anda ditolak.
                    Data pengembalian dana
                    belum tersedia.
                  </p>
                </div>
              )}

              {refund &&
                String(
                  refund.status || ""
                ).toLowerCase() ===
                  "berhasil" && (
                  <div className="mt-5 p-5 rounded-2xl bg-green-950/20 border border-green-500/15">
                    <div className="flex items-start gap-3">
                      <FaCheckCircle className="text-green-400 mt-1" />

                      <p className="text-green-300 text-sm leading-6">
                        Pengembalian dana telah
                        berhasil diproses.
                      </p>
                    </div>
                  </div>
                )}
            </div>
          </section>
        )}

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
              <p className="text-green-400 text-xs uppercase tracking-[4px]">
                Return Information
              </p>

              <h2 className="text-2xl md:text-3xl font-bold mt-3">
                Informasi Pengembalian
              </h2>

              <div className="grid md:grid-cols-2 gap-4 mt-7">
                <div className="rounded-2xl bg-[#171717] border border-white/5 p-5">
                  <p className="text-gray-600 text-xs">
                    Tanggal Pengembalian
                  </p>

                  <p className="font-semibold mt-2">
                    {formatTanggal(
                      detail.tanggal_pengembalian
                    )}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#171717] border border-white/5 p-5">
                  <p className="text-gray-600 text-xs">
                    Kondisi Kostum
                  </p>

                  <p className="font-semibold mt-2 text-green-400">
                    {detail.kondisi_baju ||
                      "-"}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#171717] border border-white/5 p-5">
                  <p className="text-gray-600 text-xs">
                    Denda
                  </p>

                  <p className="font-bold text-xl text-[#D4AF37] mt-2">
                    {formatRupiah(
                      detail.denda
                    )}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#171717] border border-white/5 p-5">
                  <p className="text-gray-600 text-xs">
                    Diterima Oleh
                  </p>

                  <p className="font-semibold mt-2">
                    {detail.nama_petugas ||
                      "-"}
                  </p>
                </div>

                <div className="md:col-span-2 rounded-2xl bg-[#171717] border border-white/5 p-5">
                  <p className="text-gray-600 text-xs">
                    Keterangan
                  </p>

                  <p className="font-semibold mt-2 text-gray-300 leading-7">
                    {detail.keterangan ||
                      "Tidak ada keterangan."}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ==================================================
            INFORMASI DENDA
        ================================================== */}

        {denda && (
          <section
            className="
              mt-5
              rounded-3xl
              border
              border-orange-500/20
              bg-[#111111]
              overflow-hidden
            "
          >
            <div className="p-7 md:p-9">
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
                <div>
                  <p className="text-orange-400 text-xs uppercase tracking-[4px]">
                    Fine
                  </p>

                  <h2 className="text-2xl md:text-3xl font-bold mt-3">
                    Informasi Denda
                  </h2>
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
                    ${getDendaStatusClass(
                      pembayaranDenda?.status ||
                        denda.status
                    )}
                  `}
                >
                  {pembayaranDenda?.status ||
                    denda.status ||
                    "Belum Dibayar"}
                </span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-7">
                <div className="rounded-2xl bg-[#171717] border border-white/5 p-5">
                  <p className="text-gray-600 text-xs">
                    Nominal Denda
                  </p>

                  <p className="font-bold text-xl text-orange-400 mt-2">
                    {formatRupiah(
                      denda.nominal_denda
                    )}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#171717] border border-white/5 p-5">
                  <p className="text-gray-600 text-xs">
                    Status Pembayaran Denda
                  </p>

                  <p className="font-semibold mt-2">
                    {pembayaranDenda?.status ||
                      denda.status ||
                      "Belum Dibayar"}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#171717] border border-white/5 p-5">
                  <p className="text-gray-600 text-xs">
                    Alasan
                  </p>

                  <p className="font-semibold mt-2">
                    {denda.alasan || "-"}
                  </p>
                </div>
              </div>

              {/* PEMBAYARAN DENDA SUDAH ADA */}

              {pembayaranDenda && (
                <div className="mt-5 rounded-2xl bg-[#171717] border border-white/5 p-5">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="text-gray-600 text-xs">
                        Pembayaran Denda
                      </p>

                      <p className="font-semibold mt-1">
                        {formatRupiah(
                          pembayaranDenda.jumlah
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-600 text-xs">
                        Metode
                      </p>

                      <p className="font-semibold mt-1">
                        {pembayaranDenda.metode ||
                          "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-600 text-xs">
                        Tanggal Bayar
                      </p>

                      <p className="font-semibold mt-1">
                        {formatTanggal(
                          pembayaranDenda.tanggal_bayar
                        )}
                      </p>
                    </div>

                    {pembayaranDenda.bukti_bayar && (
                      <a
                        href={
                          pembayaranDenda.bukti_bayar
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="
                          inline-flex
                          items-center
                          justify-center
                          gap-2
                          px-4
                          py-2
                          rounded-xl
                          border
                          border-[#D4AF37]/30
                          text-[#D4AF37]
                          text-sm
                          font-semibold
                        "
                      >
                        <FaReceipt />
                        Lihat Bukti
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* BELUM BAYAR */}

              {dendaBelumDibayar && (
                <div className="mt-5 p-5 rounded-2xl bg-red-950/20 border border-red-500/15">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                    <div className="flex items-start gap-3">
                      <FaExclamationTriangle className="text-red-400 mt-1" />

                      <div>
                        <p className="text-red-300 font-semibold">
                          Denda belum dibayar
                        </p>

                        <p className="text-red-300/70 text-sm leading-6 mt-1">
                          Silakan lakukan
                          pembayaran denda sebesar{" "}
                          <strong>
                            {formatRupiah(
                              denda.nominal_denda
                            )}
                          </strong>
                          .
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={
                        openDendaPayment
                      }
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        px-5
                        py-3
                        rounded-xl
                        bg-[#D4AF37]
                        text-black
                        font-semibold
                        hover:opacity-90
                        transition
                        whitespace-nowrap
                      "
                    >
                      <FaMoneyBillWave />
                      Bayar Denda
                    </button>
                  </div>
                </div>
              )}

              {/* MENUNGGU VERIFIKASI */}

              {pembayaranDendaMenunggu && (
                <div className="mt-5 p-5 rounded-2xl bg-blue-950/20 border border-blue-500/15">
                  <div className="flex items-start gap-3">
                    <FaReceipt className="text-blue-400 mt-1" />

                    <div>
                      <p className="text-blue-300 font-semibold">
                        Pembayaran sedang
                        diverifikasi
                      </p>

                      <p className="text-blue-300/70 text-sm leading-6 mt-1">
                        Bukti pembayaran denda
                        telah dikirim. Silakan
                        menunggu verifikasi dari
                        Petugas.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* LUNAS */}

              {pembayaranDendaLunas && (
                <div className="mt-5 p-5 rounded-2xl bg-green-950/20 border border-green-500/15">
                  <div className="flex items-start gap-3">
                    <FaCheckCircle className="text-green-400 mt-1" />

                    <p className="text-green-300 text-sm leading-6">
                      Denda telah dibayar dan
                      diverifikasi oleh Petugas.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ACTIONS */}

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

      {/* ======================================================
          MODAL PEMBAYARAN DENDA
      ====================================================== */}

      {showDendaPayment && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            bg-black/80
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-4
          "
        >
          <div
            className="
              w-full
              max-w-xl
              max-h-[90vh]
              overflow-y-auto
              rounded-3xl
              bg-[#111111]
              border
              border-[#D4AF37]/20
              shadow-2xl
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                p-6
                md:p-7
                border-b
                border-white/5
              "
            >
              <div>
                <p className="text-orange-400 text-xs uppercase tracking-[4px]">
                  Fine Payment
                </p>

                <h2 className="text-2xl font-bold mt-2">
                  Bayar Denda
                </h2>
              </div>

              <button
                type="button"
                onClick={
                  closeDendaPayment
                }
                disabled={
                  savingDendaPayment
                }
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-white/5
                  text-gray-400
                  flex
                  items-center
                  justify-center
                  hover:bg-white/10
                  transition
                "
              >
                <FaTimes />
              </button>
            </div>

            <form
              onSubmit={
                handleDendaPaymentSubmit
              }
              className="p-6 md:p-7"
            >
              {dendaPaymentError && (
                <div className="mb-5 rounded-2xl bg-red-950/30 border border-red-500/20 p-4">
                  <p className="text-red-300 text-sm leading-6">
                    {dendaPaymentError}
                  </p>
                </div>
              )}

              {dendaPaymentSuccess && (
                <div className="mb-5 rounded-2xl bg-green-950/30 border border-green-500/20 p-4">
                  <p className="text-green-300 text-sm leading-6">
                    {dendaPaymentSuccess}
                  </p>
                </div>
              )}

              <div
                className="
                  rounded-2xl
                  bg-[#171717]
                  border
                  border-orange-500/15
                  p-5
                "
              >
                <p className="text-gray-500 text-xs">
                  Total Denda
                </p>

                <p
                  className="
                    text-3xl
                    font-bold
                    text-orange-400
                    mt-2
                  "
                >
                  {formatRupiah(
                    denda?.nominal_denda
                  )}
                </p>

                <p className="text-gray-600 text-xs mt-2">
                  Nominal pembayaran otomatis
                  mengikuti nominal denda.
                </p>
              </div>

              <div className="mt-5">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Metode Pembayaran
                </label>

                <select
                  value={
                    dendaPaymentForm.metode
                  }
                  onChange={(e) =>
                    setDendaPaymentForm(
                      (prev) => ({
                        ...prev,
                        metode:
                          e.target.value,
                        bukti_bayar: null,
                      })
                    )
                  }
                  disabled={
                    savingDendaPayment
                  }
                  className="
                    w-full
                    rounded-xl
                    bg-[#171717]
                    border
                    border-white/10
                    px-4
                    py-3
                    text-white
                    outline-none
                    focus:border-[#D4AF37]/50
                  "
                >
                  <option value="Transfer">
                    Transfer
                  </option>

                  <option value="QRIS">
                    QRIS
                  </option>

                  <option value="Cash">
                    Cash
                  </option>
                </select>
              </div>

              <div className="mt-5">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Tanggal Pembayaran
                </label>

                <input
                  type="datetime-local"
                  value={
                    dendaPaymentForm.tanggal_bayar
                  }
                  onChange={(e) =>
                    setDendaPaymentForm(
                      (prev) => ({
                        ...prev,
                        tanggal_bayar:
                          e.target.value,
                      })
                    )
                  }
                  disabled={
                    savingDendaPayment
                  }
                  className="
                    w-full
                    rounded-xl
                    bg-[#171717]
                    border
                    border-white/10
                    px-4
                    py-3
                    text-white
                    outline-none
                    focus:border-[#D4AF37]/50
                  "
                />
              </div>

              {(dendaPaymentForm.metode ===
                "Transfer" ||
                dendaPaymentForm.metode ===
                  "QRIS") && (
                <div className="mt-5">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Bukti Pembayaran
                  </label>

                  <label
                    className="
                      flex
                      flex-col
                      items-center
                      justify-center
                      gap-3
                      min-h-32
                      rounded-2xl
                      border
                      border-dashed
                      border-[#D4AF37]/30
                      bg-[#171717]
                      cursor-pointer
                      hover:bg-[#1c1c1c]
                      transition
                      px-5
                      py-6
                    "
                  >
                    <FaUpload className="text-[#D4AF37] text-xl" />

                    <span className="text-sm text-gray-400 text-center">
                      {dendaPaymentForm.bukti_bayar
                        ? dendaPaymentForm
                            .bukti_bayar.name
                        : "Klik untuk memilih bukti pembayaran"}
                    </span>

                    <span className="text-xs text-gray-600">
                      JPG, PNG, WEBP, maksimal
                      5 MB
                    </span>

                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      className="hidden"
                      disabled={
                        savingDendaPayment
                      }
                      onChange={(e) => {
                        const file =
                          e.target.files?.[0];

                        setDendaPaymentError("");

                        if (!file) {
                          setDendaPaymentForm(
                            (prev) => ({
                              ...prev,
                              bukti_bayar:
                                null,
                            })
                          );

                          return;
                        }

                        const allowedTypes = [
                          "image/jpeg",
                          "image/png",
                          "image/webp",
                        ];

                        if (
                          !allowedTypes.includes(
                            file.type
                          )
                        ) {
                          setDendaPaymentError(
                            "Format bukti pembayaran harus JPG, PNG, atau WEBP."
                          );

                          e.target.value = "";

                          return;
                        }

                        if (
                          file.size >
                          5 * 1024 * 1024
                        ) {
                          setDendaPaymentError(
                            "Ukuran bukti pembayaran maksimal 5 MB."
                          );

                          e.target.value = "";

                          return;
                        }

                        setDendaPaymentForm(
                          (prev) => ({
                            ...prev,
                            bukti_bayar:
                              file,
                          })
                        );
                      }}
                    />
                  </label>
                </div>
              )}

              <div className="mt-5">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Keterangan
                </label>

                <textarea
                  rows={4}
                  value={
                    dendaPaymentForm.keterangan
                  }
                  onChange={(e) =>
                    setDendaPaymentForm(
                      (prev) => ({
                        ...prev,
                        keterangan:
                          e.target.value,
                      })
                    )
                  }
                  disabled={
                    savingDendaPayment
                  }
                  placeholder="Keterangan pembayaran jika diperlukan..."
                  className="
                    w-full
                    rounded-xl
                    bg-[#171717]
                    border
                    border-white/10
                    px-4
                    py-3
                    text-white
                    outline-none
                    resize-none
                    focus:border-[#D4AF37]/50
                  "
                />
              </div>

              <div
                className="
                  flex
                  flex-col-reverse
                  sm:flex-row
                  gap-3
                  mt-7
                "
              >
                <button
                  type="button"
                  onClick={
                    closeDendaPayment
                  }
                  disabled={
                    savingDendaPayment
                  }
                  className="
                    flex-1
                    py-3
                    rounded-xl
                    border
                    border-white/10
                    text-gray-400
                    font-semibold
                    hover:bg-white/5
                    transition
                  "
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={
                    savingDendaPayment
                  }
                  className="
                    flex-1
                    py-3
                    rounded-xl
                    bg-[#D4AF37]
                    text-black
                    font-semibold
                    hover:opacity-90
                    transition
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >
                  {savingDendaPayment
                    ? "Mengirim..."
                    : "Kirim Pembayaran"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default BorrowingDetail;