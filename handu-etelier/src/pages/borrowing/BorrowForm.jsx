import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";

function BorrowForm() {
  const { code } = useParams();
  const navigate = useNavigate();

  // ======================================================
  // STATE
  // ======================================================

  const [costume, setCostume] = useState(null);

  const [paymentSettings, setPaymentSettings] = useState(null);

  const [formData, setFormData] = useState({
    tanggal_peminjaman: "",
    tanggal_kembali: "",
    metode_pembayaran: "QRIS",
    persentase_pembayaran: "50",
  });

  const [buktiFile, setBuktiFile] = useState(null);
  const [buktiPreview, setBuktiPreview] = useState("");

  const [qris, setQris] = useState(null);
  const [loadingQris, setLoadingQris] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ======================================================
  // AMBIL DATA KOSTUM
  // ======================================================

  useEffect(() => {
    const fetchCostume = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/kostum/${code}`);

        const result = await response.json();

        console.log("Response kostum:", result);

        if (!response.ok) {
          throw new Error(result.message || "Kostum tidak ditemukan.");
        }

        const data = result.data || result.kostum || result;

        if (!data || !data.id_kostum) {
          throw new Error("Data kostum tidak valid.");
        }

        setCostume(data);
      } catch (err) {
        console.error("Error mengambil kostum:", err);

        setError(err.message || "Data kostum tidak dapat dimuat.");
      } finally {
        setLoading(false);
      }
    };

    fetchCostume();
  }, [code]);

  useEffect(() => {
    const fetchPaymentSettings = async () => {
      try {
        const response = await fetch("/api/pengaturan-pembayaran/qris-aktif");

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Gagal mengambil data pembayaran.");
        }

        setPaymentSettings(result.data || null);
      } catch (err) {
        console.error("Error mengambil rekening pembayaran:", err);
      }
    };

    fetchPaymentSettings();
  }, []);

  // ======================================================
  // AMBIL QRIS AKTIF
  // ======================================================

  useEffect(() => {
    const fetchQris = async () => {
      try {
        setLoadingQris(true);

        const response = await fetch("/api/pengaturan-pembayaran/qris-aktif");

        const result = await response.json();

        console.log("Response QRIS:", result);

        if (!response.ok) {
          throw new Error(result.message || "QRIS tidak dapat dimuat.");
        }

        setQris(result.data?.qris || null);
      } catch (err) {
        console.error("Error mengambil QRIS:", err);
        setQris(null);
      } finally {
        setLoadingQris(false);
      }
    };

    fetchQris();
  }, []);

  // ======================================================
  // HANDLE INPUT
  // ======================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ======================================================
  // HANDLE BUKTI PEMBAYARAN
  // ======================================================

  const handleBuktiChange = (e) => {
    const file = e.target.files?.[0];

    setError("");
    setSuccess("");

    if (!file) {
      setBuktiFile(null);
      setBuktiPreview("");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setBuktiFile(null);
      setBuktiPreview("");

      setError("Format bukti pembayaran harus JPG, PNG, atau WEBP.");

      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setBuktiFile(null);
      setBuktiPreview("");

      setError("Ukuran bukti pembayaran maksimal 2 MB.");

      e.target.value = "";
      return;
    }

    setBuktiFile(file);

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setBuktiPreview(reader.result);
      }
    };

    reader.onerror = () => {
      setError("Gagal membaca file bukti pembayaran.");
    };

    reader.readAsDataURL(file);
  };

  // ======================================================
  // HITUNG JUMLAH HARI
  // ======================================================

  const calculateDays = () => {
    if (!formData.tanggal_peminjaman || !formData.tanggal_kembali) {
      return 0;
    }

    const start = new Date(`${formData.tanggal_peminjaman}T00:00:00`);

    const end = new Date(`${formData.tanggal_kembali}T00:00:00`);

    const difference = end.getTime() - start.getTime();

    const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

    return days > 0 ? days : 0;
  };

  const getQrisUrl = (value) => {
    if (!value) return "";

    const qrisValue = String(value).trim();

    if (!qrisValue) return "";

    if (qrisValue.startsWith("http://") || qrisValue.startsWith("https://")) {
      return qrisValue;
    }

    if (qrisValue.startsWith("/uploads/")) {
      return qrisValue;
    }

    if (qrisValue.startsWith("uploads/")) {
      return `/${qrisValue}`;
    }

    return `/uploads/pembayaran/${qrisValue}`;
  };

  const jumlahHari = calculateDays();

  // ======================================================
  // HARGA
  // ======================================================

  const hargaPerHari = Number(costume?.harga_sewa) || 0;

  const totalHarga = jumlahHari * hargaPerHari;

  // ======================================================
  // PEMBAYARAN
  // ======================================================

  const persentasePembayaran = Number(formData.persentase_pembayaran) || 50;

  const jumlahPembayaran = Math.round(
    totalHarga * (persentasePembayaran / 100),
  );

  const sisaPembayaran = Math.max(0, totalHarga - jumlahPembayaran);

  const membutuhkanBukti =
    formData.metode_pembayaran === "QRIS" ||
    formData.metode_pembayaran === "Transfer Bank";

  // ======================================================
  // STATUS KOSTUM
  // ======================================================

  const isAvailable =
    String(costume?.status || "").toLowerCase() === "tersedia" &&
    Number(costume?.stok || 0) > 0;

  // ======================================================
  // SUBMIT PEMINJAMAN
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // ==================================================
    // 1. CEK LOGIN
    // ==================================================

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    let user;

    try {
      user = JSON.parse(storedUser);
    } catch (err) {
      console.error("Data user tidak valid:", err);

      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");

      navigate("/login", {
        replace: true,
      });

      return;
    }

    const idUser = user?.id_user || user?.id;

    if (!idUser) {
      setError("Data user tidak valid. Silakan login kembali.");

      return;
    }

    // ==================================================
    // 2. VALIDASI KOSTUM
    // ==================================================

    if (!costume) {
      setError("Data kostum belum tersedia.");

      return;
    }

    if (!isAvailable) {
      setError("Kostum sedang tidak tersedia.");

      return;
    }

    // ==================================================
    // 3. VALIDASI TANGGAL
    // ==================================================

    if (!formData.tanggal_peminjaman || !formData.tanggal_kembali) {
      setError("Tanggal peminjaman dan tanggal kembali wajib diisi.");

      return;
    }

    if (jumlahHari <= 0) {
      setError("Tanggal kembali harus setelah tanggal peminjaman.");

      return;
    }

    if (totalHarga <= 0) {
      setError("Total harga peminjaman tidak valid.");

      return;
    }

    // ==================================================
    // 4. VALIDASI PEMBAYARAN
    // ==================================================

    if (
      !["QRIS", "Transfer Bank", "Cash"].includes(formData.metode_pembayaran)
    ) {
      setError("Metode pembayaran tidak valid.");

      return;
    }

    if (![50, 100].includes(persentasePembayaran)) {
      setError("Persentase pembayaran harus 50% atau 100%.");

      return;
    }

    if (membutuhkanBukti && !buktiFile) {
      setError(
        "Bukti pembayaran wajib diunggah untuk QRIS atau Transfer Bank.",
      );

      return;
    }

    // ==================================================
    // 5. KIRIM PEMINJAMAN
    // ==================================================

    try {
      setSubmitting(true);

      const dataPeminjaman = {
        id_user: idUser,

        disetujui_oleh: null,

        diproses_oleh: null,

        tanggal_peminjaman: formData.tanggal_peminjaman,

        tanggal_kembali: formData.tanggal_kembali,

        total_harga: totalHarga,

        status: "Menunggu",
      };

      console.log("DATA PEMINJAMAN:", dataPeminjaman);

      const peminjamanResponse = await fetch("/peminjaman", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(dataPeminjaman),
      });

      const peminjamanResult = await peminjamanResponse.json();

      console.log("HASIL PEMINJAMAN:", peminjamanResult);

      if (!peminjamanResponse.ok) {
        throw new Error(
          peminjamanResult.message || "Gagal membuat peminjaman.",
        );
      }

      const idPeminjaman = peminjamanResult.id_peminjaman;

      if (!idPeminjaman) {
        throw new Error("ID peminjaman tidak ditemukan dari backend.");
      }

      // ==================================================
      // 6. SIMPAN DETAIL PEMINJAMAN
      // ==================================================

      const dataDetail = {
        id_peminjaman: idPeminjaman,

        id_kostum: costume.id_kostum,

        // JUMLAH KOSTUM / UNIT
        // BUKAN JUMLAH HARI
        jumlah: 1,

        // HARGA SEWA PER HARI
        harga: hargaPerHari,

        // TOTAL BERDASARKAN DURASI
        subtotal: totalHarga,
      };

      console.log("DATA DETAIL PEMINJAMAN:", dataDetail);

      const detailResponse = await fetch("/detail-peminjaman", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(dataDetail),
      });

      const detailResult = await detailResponse.json();

      console.log("HASIL DETAIL PEMINJAMAN:", detailResult);

      if (!detailResponse.ok) {
        throw new Error(
          detailResult.message ||
            "Peminjaman berhasil dibuat, tetapi detail kostum gagal disimpan.",
        );
      }

      // ==================================================
      // 7. SIMPAN PEMBAYARAN
      // ==================================================

      const paymentFormData = new FormData();

      paymentFormData.append("id_peminjaman", String(idPeminjaman));

      paymentFormData.append("tanggal_bayar", new Date().toISOString());

      paymentFormData.append("total", String(jumlahPembayaran));

      paymentFormData.append("metode", formData.metode_pembayaran);

      paymentFormData.append(
        "status",
        persentasePembayaran === 100 ? "Lunas" : "Belum Bayar",
      );

      if (buktiFile) {
        paymentFormData.append("bukti_bayar", buktiFile);
      }

      console.log("DATA PEMBAYARAN:", {
        id_peminjaman: idPeminjaman,
        total: jumlahPembayaran,
        metode: formData.metode_pembayaran,
        persentase: persentasePembayaran,
        adaBukti: Boolean(buktiFile),
      });

      const pembayaranResponse = await fetch("/pembayaran", {
        method: "POST",
        body: paymentFormData,
      });

      const pembayaranResult = await pembayaranResponse.json();

      console.log("HASIL PEMBAYARAN:", pembayaranResult);

      if (!pembayaranResponse.ok) {
        throw new Error(
          pembayaranResult.message ||
            "Peminjaman berhasil dibuat, tetapi pembayaran gagal disimpan.",
        );
      }

      // ==================================================
      // 8. BERHASIL
      // ==================================================

      setSuccess("Peminjaman dan pembayaran berhasil diajukan!");

      setFormData({
        tanggal_peminjaman: "",
        tanggal_kembali: "",
        metode_pembayaran: "QRIS",
        persentase_pembayaran: "50",
      });

      setBuktiFile(null);
      setBuktiPreview("");

      setTimeout(() => {
        navigate("/borrow-success", {
          replace: true,

          state: {
            idPeminjaman: idPeminjaman,

            idKostum: costume.id_kostum,

            namaKostum: costume.nama_kostum,

            tanggalPeminjaman: dataPeminjaman.tanggal_peminjaman,

            tanggalKembali: dataPeminjaman.tanggal_kembali,

            totalHarga: totalHarga,

            jumlahPembayaran: jumlahPembayaran,

            sisaPembayaran: sisaPembayaran,

            persentasePembayaran: persentasePembayaran,

            metodePembayaran: formData.metode_pembayaran,
          },
        });
      }, 1200);
    } catch (err) {
      console.error("ERROR PEMINJAMAN:", err);

      setError(err.message || "Terjadi kesalahan saat mengajukan peminjaman.");
    } finally {
      setSubmitting(false);
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090909] text-white">
        <Navbar />

        <div
          className="
            min-h-[70vh]
            flex
            items-center
            justify-center
          "
        >
          <div className="text-center">
            <div
              className="
                w-12
                h-12
                border-4
                border-[#D4AF37]/30
                border-t-[#D4AF37]
                rounded-full
                animate-spin
                mx-auto
              "
            />

            <p className="text-gray-400 mt-5">Memuat data kostum...</p>
          </div>
        </div>
      </div>
    );
  }

  // ======================================================
  // KOSTUM TIDAK DITEMUKAN
  // ======================================================

  if (!costume) {
    return (
      <div className="min-h-screen bg-[#090909] text-white">
        <Navbar />

        <div
          className="
            min-h-[70vh]
            flex
            items-center
            justify-center
            px-6
          "
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold">Kostum tidak ditemukan.</h1>

            <p className="text-gray-400 mt-4">
              {error || "Data kostum tidak tersedia."}
            </p>

            <Link
              to="/"
              className="
                inline-block
                mt-6
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
      </div>
    );
  }

  // ======================================================
  // TAMPILAN
  // ======================================================

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <Navbar />

      <main
        className="
          pt-32
          pb-20
          px-6
        "
      >
        <div className="max-w-6xl mx-auto">
          {/* HEADER */}

          <div className="mb-10">
            <Link
              to={`/costume/${costume.id_kostum}`}
              className="
                inline-block
                text-gray-400
                hover:text-[#D4AF37]
                transition
                mb-6
              "
            >
              ← Kembali ke Detail Kostum
            </Link>

            <p
              className="
                uppercase
                tracking-[5px]
                text-[#D4AF37]
                text-sm
              "
            >
              Handu Atelier
            </p>

            <h1
              className="
                text-4xl
                md:text-5xl
                font-bold
                mt-4
              "
            >
              Form Peminjaman
            </h1>

            <p className="text-gray-400 mt-4">
              Lengkapi data peminjaman kostum yang ingin Anda sewa.
            </p>
          </div>

          {/* GRID */}

          <div
            className="
              grid
              lg:grid-cols-2
              gap-8
              items-start
            "
          >
            {/* INFORMASI KOSTUM */}

            <div
              className="
                bg-[#141414]
                border
                border-[#D4AF37]/20
                rounded-3xl
                p-7
              "
            >
              <p
                className="
                  text-[#D4AF37]
                  text-sm
                  uppercase
                  tracking-widest
                "
              >
                Kostum yang dipilih
              </p>

              <h2
                className="
                  text-3xl
                  font-bold
                  mt-3
                "
              >
                {costume.nama_koleksi || costume.nama_kostum || "Kostum"}
              </h2>

              <p className="text-gray-400 mt-2">
                {costume.nama_kostum || costume.nama_kategori || "-"}
              </p>

              {/* DETAIL */}

              <div className="mt-8 space-y-5">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-400">ID Kostum</span>

                  <span>{costume.id_kostum}</span>
                </div>

                {costume.kode_koleksi && (
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-400">Kode Koleksi</span>

                    <span className="text-[#D4AF37]">
                      {costume.kode_koleksi}
                    </span>
                  </div>
                )}

                <div className="flex justify-between gap-4">
                  <span className="text-gray-400">Warna</span>

                  <span>{costume.warna || "-"}</span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-400">Ukuran</span>

                  <span>{costume.ukuran || "-"}</span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-400">Stok</span>

                  <span>{costume.stok ?? 0}</span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-400">Status</span>

                  <span
                    className={isAvailable ? "text-green-400" : "text-red-400"}
                  >
                    {isAvailable ? "Tersedia" : "Tidak tersedia"}
                  </span>
                </div>
              </div>

              {/* HARGA */}

              <div
                className="
                  mt-8
                  pt-6
                  border-t
                  border-[#D4AF37]/20
                "
              >
                <p className="text-gray-400">Harga sewa per hari</p>

                <p
                  className="
                    text-3xl
                    font-bold
                    text-[#D4AF37]
                    mt-2
                  "
                >
                  Rp {hargaPerHari.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="
                bg-[#141414]
                border
                border-[#D4AF37]/20
                rounded-3xl
                p-7
              "
            >
              <h2
                className="
                  text-2xl
                  font-bold
                  mb-7
                "
              >
                Detail Peminjaman
              </h2>

              {/* TANGGAL PEMINJAMAN */}

              <div className="mb-6">
                <label
                  htmlFor="tanggal_peminjaman"
                  className="
                    block
                    text-gray-300
                    mb-2
                  "
                >
                  Tanggal Peminjaman
                </label>

                <input
                  id="tanggal_peminjaman"
                  type="date"
                  name="tanggal_peminjaman"
                  value={formData.tanggal_peminjaman}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="
                    w-full
                    bg-[#0D0D0D]
                    border
                    border-[#D4AF37]/20
                    rounded-xl
                    px-4
                    py-3
                    text-white
                    outline-none
                    focus:border-[#D4AF37]
                  "
                  required
                />
              </div>

              {/* TANGGAL KEMBALI */}

              <div className="mb-6">
                <label
                  htmlFor="tanggal_kembali"
                  className="
                    block
                    text-gray-300
                    mb-2
                  "
                >
                  Tanggal Kembali
                </label>

                <input
                  id="tanggal_kembali"
                  type="date"
                  name="tanggal_kembali"
                  value={formData.tanggal_kembali}
                  onChange={handleChange}
                  min={
                    formData.tanggal_peminjaman ||
                    new Date().toISOString().split("T")[0]
                  }
                  className="
                    w-full
                    bg-[#0D0D0D]
                    border
                    border-[#D4AF37]/20
                    rounded-xl
                    px-4
                    py-3
                    text-white
                    outline-none
                    focus:border-[#D4AF37]
                  "
                  required
                />
              </div>

              {/* RINGKASAN HARGA */}

              <div
                className="
                  mt-8
                  p-5
                  rounded-2xl
                  bg-[#0D0D0D]
                  border
                  border-[#D4AF37]/20
                "
              >
                <div className="flex justify-between">
                  <span className="text-gray-400">Harga per hari</span>

                  <span>Rp {hargaPerHari.toLocaleString("id-ID")}</span>
                </div>

                <div className="flex justify-between mt-3">
                  <span className="text-gray-400">Durasi</span>

                  <span>{jumlahHari > 0 ? `${jumlahHari} hari` : "-"}</span>
                </div>

                <div className="flex justify-between mt-3">
                  <span className="text-gray-400">Jumlah Kostum</span>

                  <span>1 kostum</span>
                </div>

                <div className="flex justify-between mt-3">
                  <span className="text-gray-400">Total Sewa</span>

                  <span
                    className="
                      text-xl
                      font-bold
                      text-[#D4AF37]
                    "
                  >
                    Rp {totalHarga.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* PEMBAYARAN */}

              <div className="mt-8">
                <h3
                  className="
                    text-xl
                    font-bold
                    mb-5
                  "
                >
                  Pembayaran
                </h3>

                {/* METODE */}

                <div className="mb-5">
                  <label
                    htmlFor="metode_pembayaran"
                    className="
                      block
                      text-gray-300
                      mb-2
                    "
                  >
                    Metode Pembayaran
                  </label>

                  <select
                    id="metode_pembayaran"
                    name="metode_pembayaran"
                    value={formData.metode_pembayaran}
                    onChange={handleChange}
                    className="
                      w-full
                      bg-[#0D0D0D]
                      border
                      border-[#D4AF37]/20
                      rounded-xl
                      px-4
                      py-3
                      text-white
                      outline-none
                      focus:border-[#D4AF37]
                    "
                  >
                    <option value="QRIS">QRIS</option>

                    <option value="Transfer Bank">Transfer Bank</option>

                    <option value="Cash">Cash</option>
                  </select>
                </div>

                {/* PERSENTASE */}

                <div className="mb-5">
                  <label
                    htmlFor="persentase_pembayaran"
                    className="
                      block
                      text-gray-300
                      mb-2
                    "
                  >
                    Pembayaran
                  </label>

                  <select
                    id="persentase_pembayaran"
                    name="persentase_pembayaran"
                    value={formData.persentase_pembayaran}
                    onChange={handleChange}
                    className="
                      w-full
                      bg-[#0D0D0D]
                      border
                      border-[#D4AF37]/20
                      rounded-xl
                      px-4
                      py-3
                      text-white
                      outline-none
                      focus:border-[#D4AF37]
                    "
                  >
                    <option value="50">DP 50%</option>

                    <option value="100">Bayar 100%</option>
                  </select>
                </div>

                {/* INFO PEMBAYARAN */}

                <div
                  className="
                    p-5
                    rounded-2xl
                    bg-[#0D0D0D]
                    border
                    border-[#D4AF37]/20
                  "
                >
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-400">Total Sewa</span>

                    <span>Rp {totalHarga.toLocaleString("id-ID")}</span>
                  </div>

                  <div className="flex justify-between gap-4 mt-3">
                    <span className="text-gray-400">Dibayar Sekarang</span>

                    <span className="text-[#D4AF37] font-semibold">
                      Rp {jumlahPembayaran.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 mt-3">
                    <span className="text-gray-400">Sisa Pembayaran</span>

                    <span>Rp {sisaPembayaran.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                {/* INFO METODE */}

                {formData.metode_pembayaran === "QRIS" && (
                  <div
                    className="
      mt-5
      p-5
      rounded-2xl
      bg-blue-950/20
      border
      border-blue-500/20
    "
                  >
                    <div className="text-center">
                      <h4 className="text-white font-semibold text-lg mb-2">
                        Pembayaran QRIS
                      </h4>

                      <p className="text-blue-300 text-sm mb-5">
                        Scan QRIS berikut untuk melakukan pembayaran.
                      </p>

                      {loadingQris ? (
                        <div className="py-10 text-gray-400">
                          Memuat QRIS...
                        </div>
                      ) : qris ? (
                        <div className="flex justify-center">
                          <div
                            className="
              bg-white
              p-4
              rounded-2xl
              shadow-lg
            "
                          >
                            <img
                              src={getQrisUrl(qris)}
                              alt="QRIS Pembayaran"
                              className="
                w-64
                h-64
                object-contain
                rounded-lg
              "
                            />
                          </div>
                        </div>
                      ) : (
                        <div
                          className="
            py-8
            px-4
            rounded-xl
            bg-red-950/30
            border
            border-red-500/30
            text-red-400
            text-sm
          "
                        >
                          QRIS belum tersedia. Silakan hubungi petugas.
                        </div>
                      )}

                      {qris && (
                        <p className="text-gray-400 text-xs mt-5">
                          Silakan lakukan pembayaran sebesar{" "}
                          <span className="text-[#D4AF37] font-semibold">
                            Rp {jumlahPembayaran.toLocaleString("id-ID")}
                          </span>
                          , kemudian unggah bukti pembayaran.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {formData.metode_pembayaran === "Transfer Bank" && (
                  <div
                    className="
      mt-5
      p-5
      rounded-xl
      bg-blue-950/20
      border
      border-blue-500/20
    "
                  >
                    <p
                      className="
        text-blue-300
        text-sm
        mb-4
      "
                    >
                      Silakan transfer pembayaran ke rekening berikut, kemudian
                      unggah bukti pembayaran.
                    </p>

                    <div
                      className="
                      rounded-xl
                      bg-black/30
                      border
                      border-white/10
                      p-4
                      space-y-3
                    "
                    >
                      {/* BANK */}
                      <div
                        className="
                        flex
                        justify-between
                        gap-4
                      "
                                    >
                        <span className="text-gray-400">Bank</span>

                        <span
                          className="
                        text-white
                         font-semibold
                      "
                        >
                          {paymentSettings?.nama_bank || "-"}
                        </span>
                      </div>

                      {/* NOMOR REKENING */}
                      <div
                        className="
          flex
          justify-between
          gap-4
        "
                      >
                        <span className="text-gray-400">Nomor Rekening</span>

                        <span
                          className="
            text-[#D4AF37]
            font-bold
            text-lg
            tracking-wide
          "
                        >
                          {paymentSettings?.nomor_rekening || "-"}
                        </span>
                      </div>

                      {/* NAMA PEMILIK */}
                      <div
                        className="
          flex
          justify-between
          gap-4
        "
                      >
                        <span className="text-gray-400">Atas Nama</span>

                        <span
                          className="
            text-white
            font-semibold
          "
                        >
                          {paymentSettings?.nama_penerima || "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {formData.metode_pembayaran === "Cash" && (
                  <div
                    className="
                      mt-5
                      p-4
                      rounded-xl
                      bg-yellow-950/20
                      border
                      border-yellow-500/20
                      text-yellow-300
                      text-sm
                    "
                  >
                    Pembayaran cash dilakukan langsung sesuai ketentuan yang
                    diberikan oleh petugas. Bukti pembayaran tidak diperlukan.
                  </div>
                )}

                {/* UPLOAD BUKTI */}

                {membutuhkanBukti && (
                  <div className="mt-6">
                    <label
                      htmlFor="bukti_bayar"
                      className="
                        block
                        text-gray-300
                        mb-2
                      "
                    >
                      Bukti Pembayaran
                    </label>

                    <input
                      id="bukti_bayar"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleBuktiChange}
                      className="
                        w-full
                        bg-[#0D0D0D]
                        border
                        border-[#D4AF37]/20
                        rounded-xl
                        px-4
                        py-3
                        text-gray-300
                        file:mr-4
                        file:rounded-lg
                        file:border-0
                        file:px-4
                        file:py-2
                        file:bg-[#D4AF37]
                        file:text-black
                        file:font-semibold
                      "
                    />

                    <p className="text-gray-500 text-xs mt-2">
                      Format JPG, PNG, atau WEBP. Maksimal 2 MB.
                    </p>

                    {buktiPreview && (
                      <div className="mt-5">
                        <p className="text-gray-400 text-sm mb-3">
                          Preview Bukti Pembayaran
                        </p>

                        <div
                          className="
                            rounded-xl
                            overflow-hidden
                            border
                            border-[#D4AF37]/20
                            bg-[#0D0D0D]
                          "
                        >
                          <img
                            src={buktiPreview}
                            alt="Preview bukti pembayaran"
                            className="
                              w-full
                              max-h-72
                              object-contain
                            "
                          />
                        </div>

                        {buktiFile && (
                          <p className="text-gray-500 text-xs mt-2">
                            {buktiFile.name}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ERROR */}

              {error && (
                <div
                  className="
                    mt-6
                    p-4
                    rounded-xl
                    bg-red-950/30
                    border
                    border-red-500/30
                    text-red-400
                  "
                >
                  {error}
                </div>
              )}

              {/* SUCCESS */}

              {success && (
                <div
                  className="
                    mt-6
                    p-4
                    rounded-xl
                    bg-green-950/30
                    border
                    border-green-500/30
                    text-green-400
                  "
                >
                  {success}
                </div>
              )}

              {/* BUTTON */}

              <button
                type="submit"
                disabled={
                  submitting || !isAvailable || !costume || totalHarga <= 0
                }
                className="
                  w-full
                  mt-8
                  py-4
                  rounded-xl
                  bg-[#D4AF37]
                  text-black
                  font-semibold
                  hover:scale-[1.02]
                  transition-all
                  duration-300
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                {submitting ? "Mengirim..." : "Ajukan Peminjaman & Bayar"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BorrowForm;
