import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaEdit,
  FaPlus,
  FaSearch,
  FaSyncAlt,
  FaTshirt,
  FaTrash,
  FaTimes,
} from "react-icons/fa";

function KostumPetugas() {
  const navigate = useNavigate();

  // =========================================================
  // SESSION
  // =========================================================

  const [user, setUser] = useState(null);

  // =========================================================
  // DATA
  // =========================================================

  const [kostumData, setKostumData] = useState([]);
  const [kategoriData, setKategoriData] = useState([]);

  // =========================================================
  // UI
  // =========================================================

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("Semua");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // =========================================================
  // FOTO
  // =========================================================

  const [fotoFile, setFotoFile] = useState(null);
  const [fotoPreview, setFotoPreview] = useState("");

  // =========================================================
  // FORM
  // =========================================================

  const emptyForm = {
    id_kategori: "",
    kode_koleksi: "",
    nama_koleksi: "",
    kelompok_koleksi: "",
    nama_kostum: "",
    ukuran: "",
    warna: "",
    stok: "0",
    harga_sewa: "0",
    status: "Tersedia",
    foto: "",
    deskripsi: "",
  };

  const [form, setForm] = useState(emptyForm);

  // =========================================================
  // SESSION CHECK
  // =========================================================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      if (!parsedUser?.id_user) {
        throw new Error("Data user tidak valid.");
      }

      // role 2 = petugas
      if (Number(parsedUser.id_role) !== 2) {
        navigate("/dashboard", {
          replace: true,
        });

        return;
      }

      setUser(parsedUser);
    } catch (err) {
      console.error("Session error:", err);

      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");

      navigate("/login", {
        replace: true,
      });
    }
  }, [navigate]);

  // =========================================================
  // PARSE RESPONSE
  // =========================================================

  const parseResponse = async (response) => {
    const raw = await response.text();

    if (!raw) {
      return {};
    }

    try {
      return JSON.parse(raw);
    } catch {
      throw new Error("Server mengembalikan response yang bukan JSON.");
    }
  };

  // =========================================================
  // LOAD KOSTUM
  // =========================================================

  const loadKostum = async () => {
    const response = await fetch("/kostum");

    const result = await parseResponse(response);

    if (!response.ok) {
      throw new Error(result.message || "Gagal mengambil data kostum.");
    }

    const rows = Array.isArray(result) ? result : result.data;

    setKostumData(Array.isArray(rows) ? rows : []);
  };

  // =========================================================
  // LOAD KATEGORI
  // =========================================================

  const loadKategori = async () => {
    const response = await fetch("/kategori");

    const result = await parseResponse(response);

    if (!response.ok) {
      throw new Error(result.message || "Gagal mengambil data kategori.");
    }

    const rows = Array.isArray(result) ? result : result.data;

    setKategoriData(Array.isArray(rows) ? rows : []);
  };

  // =========================================================
  // LOAD SEMUA DATA
  // =========================================================

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      await Promise.all([loadKostum(), loadKategori()]);
    } catch (err) {
      console.error("Load data kostum:", err);

      setError(err.message || "Gagal memuat data kostum.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  // =========================================================
  // FORMAT RUPIAH
  // =========================================================

  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);
  };

  // =========================================================
  // URL FOTO
  // =========================================================

  const getImageUrl = (foto) => {
    if (!foto) {
      return "";
    }

    if (foto.startsWith("http://") || foto.startsWith("https://")) {
      return foto;
    }

    return `http://localhost:3001${foto}`;
  };

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // =========================================================
  // HANDLE FOTO
  // =========================================================

  const handleFotoChange = (e) => {
    const file = e.target.files?.[0] || null;

    if (!file) {
      setFotoFile(null);

      if (fotoPreview) {
        URL.revokeObjectURL(fotoPreview);
      }

      setFotoPreview("");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Format foto harus JPG, JPEG, PNG, atau WEBP.");

      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran foto maksimal 5 MB.");

      e.target.value = "";
      return;
    }

    if (fotoPreview) {
      URL.revokeObjectURL(fotoPreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setFotoFile(file);
    setFotoPreview(previewUrl);

    setError("");
    setSuccess("");
  };

  // =========================================================
  // OPEN ADD
  // =========================================================

  const openAddForm = () => {
    setEditingId(null);

    setForm({
      ...emptyForm,
      status: "Tersedia",
    });

    setFotoFile(null);
    setFotoPreview("");

    setError("");
    setSuccess("");

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // OPEN EDIT
  // =========================================================

  const openEditForm = (item) => {
    setEditingId(item.id_kostum);

    setForm({
      id_kategori: item.id_kategori != null ? String(item.id_kategori) : "",

      kode_koleksi: item.kode_koleksi || "",

      nama_koleksi: item.nama_koleksi || "",

      kelompok_koleksi: item.kelompok_koleksi || "",

      nama_kostum: item.nama_kostum || "",

      ukuran: item.ukuran || "",

      warna: item.warna || "",

      stok: item.stok != null ? String(item.stok) : "0",

      harga_sewa: item.harga_sewa != null ? String(item.harga_sewa) : "0",

      status: item.status || "Tersedia",

      foto: item.foto || "",

      deskripsi: item.deskripsi || "",
    });

    setFotoFile(null);

    if (fotoPreview) {
      URL.revokeObjectURL(fotoPreview);
    }

    setFotoPreview("");

    setError("");
    setSuccess("");

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // CLOSE FORM
  // =========================================================

  const closeForm = () => {
    if (fotoPreview) {
      URL.revokeObjectURL(fotoPreview);
    }

    setShowForm(false);
    setEditingId(null);

    setForm(emptyForm);

    setFotoFile(null);
    setFotoPreview("");

    setError("");
    setSuccess("");
  };

  // =========================================================
  // STATUS OPTIONS
  // =========================================================

  const statusOptions = useMemo(() => {
    const values = kostumData
      .map((item) => String(item.status || "").trim())
      .filter(Boolean);

    return [...new Set(["Tersedia", ...values])];
  }, [kostumData]);

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // =============================================
    // VALIDASI
    // =============================================

    if (!form.id_kategori) {
      setError("Kategori kostum wajib dipilih.");
      return;
    }

    if (!form.kode_koleksi.trim()) {
      setError("Kode koleksi wajib diisi.");
      return;
    }

    if (!form.nama_koleksi.trim()) {
      setError("Nama koleksi wajib diisi.");
      return;
    }

    if (!form.kelompok_koleksi.trim()) {
      setError("Kelompok koleksi wajib diisi.");
      return;
    }

    if (!form.nama_kostum.trim()) {
      setError("Nama kostum wajib diisi.");
      return;
    }

    if (Number(form.stok) < 0) {
      setError("Stok tidak boleh kurang dari 0.");
      return;
    }

    if (Number(form.harga_sewa) < 0) {
      setError("Harga sewa tidak boleh kurang dari 0.");
      return;
    }

    if (!form.status.trim()) {
      setError("Status kostum wajib diisi.");
      return;
    }

    // =============================================
    // KIRIM FORM DATA
    // =============================================

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("id_kategori", form.id_kategori);

      formData.append("kode_koleksi", form.kode_koleksi.trim());

      formData.append("nama_koleksi", form.nama_koleksi.trim());

      formData.append("kelompok_koleksi", form.kelompok_koleksi.trim());

      formData.append("nama_kostum", form.nama_kostum.trim());

      formData.append("ukuran", form.ukuran.trim());

      formData.append("warna", form.warna.trim());

      formData.append("stok", String(Number(form.stok) || 0));

      formData.append("harga_sewa", String(Number(form.harga_sewa) || 0));

      formData.append("status", form.status.trim());

      formData.append("deskripsi", form.deskripsi.trim());

      // Edit tanpa foto baru:
      // pertahankan foto lama
      if (editingId && form.foto && !fotoFile) {
        formData.append("foto", form.foto);
      }

      // Foto baru
      if (fotoFile) {
        formData.append("foto", fotoFile);
      }

      const url = editingId ? `/kostum/${editingId}` : "/kostum";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      const result = await parseResponse(response);

      if (!response.ok) {
        throw new Error(result.message || "Gagal menyimpan data kostum.");
      }

      setSuccess(result.message || "Kostum berhasil disimpan.");

      if (fotoPreview) {
        URL.revokeObjectURL(fotoPreview);
      }

      setShowForm(false);
      setEditingId(null);

      setForm(emptyForm);

      setFotoFile(null);
      setFotoPreview("");

      await loadKostum();
    } catch (err) {
      console.error("Submit kostum:", err);

      setError(err.message || "Gagal menyimpan data kostum.");
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Yakin ingin menghapus kostum "${item.nama_kostum}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(`/kostum/${item.id_kostum}`, {
        method: "DELETE",
      });

      const result = await parseResponse(response);

      if (!response.ok) {
        throw new Error(result.message || "Gagal menghapus kostum.");
      }

      setSuccess(result.message || "Kostum berhasil dihapus.");

      await loadKostum();
    } catch (err) {
      console.error("Delete kostum:", err);

      setError(err.message || "Gagal menghapus kostum.");
    }
  };

  // =========================================================
  // FILTER
  // =========================================================

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return kostumData.filter((item) => {
      const matchesSearch =
        !keyword ||
        String(item.nama_kostum || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.kode_koleksi || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.nama_koleksi || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.kelompok_koleksi || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.nama_kategori || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.warna || "")
          .toLowerCase()
          .includes(keyword);

      const matchesKategori =
        kategoriFilter === "Semua" ||
        String(item.id_kategori) === String(kategoriFilter);

      return matchesSearch && matchesKategori;
    });
  }, [kostumData, search, kategoriFilter]);

  // =========================================================
  // SUMMARY
  // =========================================================

  const totalStok = useMemo(() => {
    return kostumData.reduce(
      (total, item) => total + (Number(item.stok) || 0),
      0,
    );
  }, [kostumData]);

  const stokHabis = useMemo(() => {
    return kostumData.filter((item) => Number(item.stok) <= 0).length;
  }, [kostumData]);

  // =========================================================
  // CLEANUP PREVIEW
  // =========================================================

  useEffect(() => {
    return () => {
      if (fotoPreview) {
        URL.revokeObjectURL(fotoPreview);
      }
    };
  }, [fotoPreview]);

  // =========================================================
  // LOADING
  // =========================================================

  if (!user || loading) {
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
        <p className="text-[#D4AF37]">Memuat data kostum...</p>
      </div>
    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      className="
                min-h-screen
                bg-[#090909]
                text-white
            "
    >
      {/* =================================================
                HEADER
            ================================================= */}

      <header
        className="
                    bg-[#111111]
                    border-b
                    border-[#D4AF37]/20
                "
      >
        <div
          className="
                        max-w-7xl
                        mx-auto
                        px-6
                        py-6
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
                                uppercase
                                tracking-[4px]
                                text-[#D4AF37]
                                text-xs
                            "
            >
              Petugas Area
            </p>

            <h1
              className="
                                text-3xl
                                font-bold
                                mt-2
                            "
            >
              Kelola Kostum
            </h1>

            <p className="text-gray-500 mt-2">
              Kelola koleksi dan stok kostum atelier.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/petugas/dashboard"
              className="
                                px-5
                                py-3
                                rounded-xl
                                border
                                border-[#D4AF37]/20
                                text-[#D4AF37]
                                hover:bg-[#D4AF37]/10
                                transition
                            "
            >
              Dashboard
            </Link>

            <button
              type="button"
              onClick={showForm ? closeForm : openAddForm}
              className="
                                px-5
                                py-3
                                rounded-xl
                                bg-[#D4AF37]
                                text-black
                                font-semibold
                                flex
                                items-center
                                gap-2
                            "
            >
              {showForm ? (
                <>
                  <FaTimes />
                  Tutup Form
                </>
              ) : (
                <>
                  <FaPlus />
                  Tambah Kostum
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* =================================================
                MAIN
            ================================================= */}

      <main
        className="
                    max-w-7xl
                    mx-auto
                    px-6
                    py-10
                "
      >
        {/* ERROR */}

        {error && (
          <div
            className="
                            mb-5
                            rounded-2xl
                            border
                            border-red-500/20
                            bg-red-500/10
                            text-red-400
                            px-5
                            py-4
                        "
          >
            {error}
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div
            className="
                            mb-5
                            rounded-2xl
                            border
                            border-green-500/20
                            bg-green-500/10
                            text-green-400
                            px-5
                            py-4
                        "
          >
            {success}
          </div>
        )}

        {/* =================================================
                    SUMMARY
                ================================================= */}

        <section
          className="
                        grid
                        sm:grid-cols-2
                        lg:grid-cols-3
                        gap-4
                        mb-7
                    "
        >
          <div
            className="
                            rounded-2xl
                            bg-[#141414]
                            border
                            border-[#D4AF37]/15
                            p-5
                        "
          >
            <p className="text-gray-500 text-sm">Total Jenis Kostum</p>

            <p
              className="
                                text-3xl
                                font-bold
                                text-[#D4AF37]
                                mt-2
                            "
            >
              {kostumData.length}
            </p>
          </div>

          <div
            className="
                            rounded-2xl
                            bg-[#141414]
                            border
                            border-green-500/15
                            p-5
                        "
          >
            <p className="text-gray-500 text-sm">Total Stok</p>

            <p
              className="
                                text-3xl
                                font-bold
                                text-green-400
                                mt-2
                            "
            >
              {totalStok}
            </p>
          </div>

          <div
            className="
                            rounded-2xl
                            bg-[#141414]
                            border
                            border-red-500/15
                            p-5
                        "
          >
            <p className="text-gray-500 text-sm">Stok Habis</p>

            <p
              className="
                                text-3xl
                                font-bold
                                text-red-400
                                mt-2
                            "
            >
              {stokHabis}
            </p>
          </div>
        </section>

        {/* =================================================
                    FORM
                ================================================= */}

        {showForm && (
          <section
            className="
                            rounded-3xl
                            bg-[#141414]
                            border
                            border-[#D4AF37]/15
                            p-7
                            mb-7
                        "
          >
            <div className="mb-7">
              <p
                className="
                                    text-[#D4AF37]
                                    text-xs
                                    uppercase
                                    tracking-[4px]
                                "
              >
                {editingId ? "Update" : "Create"}
              </p>

              <h2
                className="
                                    text-2xl
                                    font-bold
                                    mt-2
                                "
              >
                {editingId ? "Edit Kostum" : "Tambah Kostum"}
              </h2>
            </div>

            <form
              onSubmit={handleSubmit}
              className="
                                grid
                                md:grid-cols-2
                                gap-5
                            "
            >
              {/* KATEGORI */}

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Kategori
                </label>

                <select
                  name="id_kategori"
                  value={form.id_kategori}
                  onChange={handleChange}
                  required
                  className="
                                        w-full
                                        px-4
                                        py-3
                                        rounded-xl
                                        bg-[#1D1D1D]
                                        border
                                        border-white/10
                                        outline-none
                                        focus:border-[#D4AF37]
                                    "
                >
                  <option value="">Pilih kategori</option>

                  {kategoriData.map((kategori) => (
                    <option
                      key={kategori.id_kategori}
                      value={kategori.id_kategori}
                    >
                      {kategori.nama_kategori}
                    </option>
                  ))}
                </select>
              </div>

              {/* KODE KOLEKSI */}

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Kode Koleksi
                </label>

                <input
                  type="text"
                  name="kode_koleksi"
                  value={form.kode_koleksi}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: CL007"
                  className="
                                        w-full
                                        px-4
                                        py-3
                                        rounded-xl
                                        bg-[#1D1D1D]
                                        border
                                        border-white/10
                                        outline-none
                                        focus:border-[#D4AF37]
                                    "
                />
              </div>

              {/* NAMA KOLEKSI */}

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Nama Koleksi
                </label>

                <input
                  type="text"
                  name="nama_koleksi"
                  value={form.nama_koleksi}
                  onChange={handleChange}
                  required
                  placeholder="Nama koleksi"
                  className="
                                        w-full
                                        px-4
                                        py-3
                                        rounded-xl
                                        bg-[#1D1D1D]
                                        border
                                        border-white/10
                                        outline-none
                                        focus:border-[#D4AF37]
                                    "
                />
              </div>

              {/* KELOMPOK KOLEKSI */}

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Kelompok Koleksi
                </label>

                <input
                  type="text"
                  name="kelompok_koleksi"
                  value={form.kelompok_koleksi}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: Gothic"
                  className="
                                        w-full
                                        px-4
                                        py-3
                                        rounded-xl
                                        bg-[#1D1D1D]
                                        border
                                        border-white/10
                                        outline-none
                                        focus:border-[#D4AF37]
                                    "
                />
              </div>

              {/* NAMA KOSTUM */}

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Nama Kostum
                </label>

                <input
                  type="text"
                  name="nama_kostum"
                  value={form.nama_kostum}
                  onChange={handleChange}
                  required
                  placeholder="Nama kostum"
                  className="
                                        w-full
                                        px-4
                                        py-3
                                        rounded-xl
                                        bg-[#1D1D1D]
                                        border
                                        border-white/10
                                        outline-none
                                        focus:border-[#D4AF37]
                                    "
                />
              </div>

              {/* UKURAN */}

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Ukuran
                </label>

                <input
                  type="text"
                  name="ukuran"
                  value={form.ukuran}
                  onChange={handleChange}
                  placeholder="Contoh: M / L / XL"
                  className="
                                        w-full
                                        px-4
                                        py-3
                                        rounded-xl
                                        bg-[#1D1D1D]
                                        border
                                        border-white/10
                                        outline-none
                                        focus:border-[#D4AF37]
                                    "
                />
              </div>

              {/* WARNA */}

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Warna
                </label>

                <input
                  type="text"
                  name="warna"
                  value={form.warna}
                  onChange={handleChange}
                  placeholder="Warna kostum"
                  className="
                                        w-full
                                        px-4
                                        py-3
                                        rounded-xl
                                        bg-[#1D1D1D]
                                        border
                                        border-white/10
                                        outline-none
                                        focus:border-[#D4AF37]
                                    "
                />
              </div>

              {/* STOK */}

              <div>
                <label className="block text-sm text-gray-400 mb-2">Stok</label>

                <input
                  type="number"
                  name="stok"
                  value={form.stok}
                  onChange={handleChange}
                  min="0"
                  required
                  className="
                                        w-full
                                        px-4
                                        py-3
                                        rounded-xl
                                        bg-[#1D1D1D]
                                        border
                                        border-white/10
                                        outline-none
                                        focus:border-[#D4AF37]
                                    "
                />
              </div>

              {/* HARGA */}

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Harga Sewa
                </label>

                <div className="relative">
                  <span
                    className="
                                            absolute
                                            left-4
                                            top-1/2
                                            -translate-y-1/2
                                            text-gray-500
                                        "
                  >
                    Rp
                  </span>

                  <input
                    type="number"
                    name="harga_sewa"
                    value={form.harga_sewa}
                    onChange={handleChange}
                    min="0"
                    required
                    className="
                                            w-full
                                            pl-12
                                            pr-4
                                            py-3
                                            rounded-xl
                                            bg-[#1D1D1D]
                                            border
                                            border-white/10
                                            outline-none
                                            focus:border-[#D4AF37]
                                        "
                  />
                </div>
              </div>

              {/* STATUS */}

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  required
                  className="
                                        w-full
                                        px-4
                                        py-3
                                        rounded-xl
                                        bg-[#1D1D1D]
                                        border
                                        border-white/10
                                        outline-none
                                        focus:border-[#D4AF37]
                                    "
                >
                  <option value="">Pilih status</option>

                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* FOTO */}

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Foto Kostum
                </label>

                <input
                  type="file"
                  name="foto"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFotoChange}
                  className="
                                        w-full
                                        px-4
                                        py-3
                                        rounded-xl
                                        bg-[#1D1D1D]
                                        border
                                        border-white/10
                                        text-gray-400
                                        file:mr-4
                                        file:py-2
                                        file:px-4
                                        file:rounded-lg
                                        file:border-0
                                        file:bg-[#D4AF37]
                                        file:text-black
                                        file:font-semibold
                                        file:cursor-pointer
                                    "
                />

                <p className="text-xs text-gray-600 mt-2">
                  JPG, JPEG, PNG, atau WEBP. Maksimal 5 MB.
                </p>

                {/* PREVIEW FOTO BARU */}

                {fotoPreview && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2">
                      Preview foto baru:
                    </p>

                    <img
                      src={fotoPreview}
                      alt="Preview"
                      className="
                                                w-40
                                                h-40
                                                object-cover
                                                rounded-xl
                                                border
                                                border-[#D4AF37]/30
                                            "
                    />
                  </div>
                )}

                {/* FOTO LAMA */}

                {!fotoPreview && form.foto && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2">Foto saat ini:</p>

                    <img
                      src={getImageUrl(form.foto)}
                      alt={form.nama_kostum || "Kostum"}
                      className="
                                                    w-40
                                                    h-40
                                                    object-cover
                                                    rounded-xl
                                                    border
                                                    border-white/10
                                                "
                      onError={(e) => {
                        e.currentTarget.onerror = null;

                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* DESKRIPSI */}

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-2">
                  Deskripsi
                </label>

                <textarea
                  name="deskripsi"
                  value={form.deskripsi}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Deskripsi kostum..."
                  className="
                                        w-full
                                        px-4
                                        py-3
                                        rounded-xl
                                        bg-[#1D1D1D]
                                        border
                                        border-white/10
                                        outline-none
                                        focus:border-[#D4AF37]
                                        resize-none
                                    "
                />
              </div>

              {/* BUTTON */}

              <div className="md:col-span-2 flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="
                                        px-6
                                        py-3
                                        rounded-xl
                                        bg-[#D4AF37]
                                        text-black
                                        font-semibold
                                        disabled:opacity-50
                                        disabled:cursor-not-allowed
                                    "
                >
                  {saving
                    ? "Menyimpan..."
                    : editingId
                      ? "Simpan Perubahan"
                      : "Simpan Kostum"}
                </button>

                <button
                  type="button"
                  onClick={closeForm}
                  className="
                                        px-6
                                        py-3
                                        rounded-xl
                                        border
                                        border-white/10
                                        text-gray-400
                                        hover:text-white
                                    "
                >
                  Batal
                </button>
              </div>
            </form>
          </section>
        )}

        {/* =================================================
                    SEARCH + FILTER
                ================================================= */}

        <section
          className="
                        rounded-3xl
                        bg-[#141414]
                        border
                        border-[#D4AF37]/15
                        p-5
                        mb-7
                    "
        >
          <div
            className="
                            grid
                            md:grid-cols-2
                            gap-4
                        "
          >
            {/* SEARCH */}

            <div className="relative">
              <FaSearch
                className="
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-500
                                "
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama kostum, kode, koleksi, kategori, atau warna..."
                className="
                                    w-full
                                    pl-11
                                    pr-4
                                    py-3.5
                                    rounded-xl
                                    bg-[#1D1D1D]
                                    border
                                    border-white/10
                                    outline-none
                                    focus:border-[#D4AF37]
                                "
              />
            </div>

            {/* FILTER KATEGORI */}

            <select
              value={kategoriFilter}
              onChange={(e) => setKategoriFilter(e.target.value)}
              className="
                                w-full
                                px-4
                                py-3.5
                                rounded-xl
                                bg-[#1D1D1D]
                                border
                                border-white/10
                                outline-none
                                focus:border-[#D4AF37]
                            "
            >
              <option value="Semua">Semua Kategori</option>

              {kategoriData.map((kategori) => (
                <option key={kategori.id_kategori} value={kategori.id_kategori}>
                  {kategori.nama_kategori}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* =================================================
                    TABLE
                ================================================= */}

        <section
          className="
                        rounded-3xl
                        bg-[#141414]
                        border
                        border-[#D4AF37]/15
                        overflow-hidden
                    "
        >
          <div
            className="
                            flex
                            items-center
                            justify-between
                            px-5
                            py-4
                            border-b
                            border-white/5
                        "
          >
            <div className="flex items-center gap-3">
              <FaTshirt className="text-[#D4AF37]" />

              <div>
                <h2 className="font-semibold">Daftar Kostum</h2>

                <p className="text-xs text-gray-600 mt-1">
                  {filteredData.length} data
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={loadData}
              className="
                                p-3
                                rounded-lg
                                border
                                border-white/10
                                text-gray-400
                                hover:text-[#D4AF37]
                            "
              title="Refresh"
            >
              <FaSyncAlt />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1400px]">
              <thead className="bg-[#1A1A1A]">
                <tr>
                  <th className="text-left px-5 py-4 text-gray-500 text-sm">
                    ID
                  </th>

                  <th className="text-left px-5 py-4 text-gray-500 text-sm">
                    Kostum
                  </th>

                  <th className="text-left px-5 py-4 text-gray-500 text-sm">
                    Koleksi
                  </th>

                  <th className="text-left px-5 py-4 text-gray-500 text-sm">
                    Kelompok
                  </th>

                  <th className="text-left px-5 py-4 text-gray-500 text-sm">
                    Kategori
                  </th>

                  <th className="text-left px-5 py-4 text-gray-500 text-sm">
                    Ukuran
                  </th>

                  <th className="text-left px-5 py-4 text-gray-500 text-sm">
                    Warna
                  </th>

                  <th className="text-left px-5 py-4 text-gray-500 text-sm">
                    Stok
                  </th>

                  <th className="text-left px-5 py-4 text-gray-500 text-sm">
                    Harga
                  </th>

                  <th className="text-left px-5 py-4 text-gray-500 text-sm">
                    Status
                  </th>

                  <th className="text-left px-5 py-4 text-gray-500 text-sm">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="11"
                      className="
                                                text-center
                                                py-16
                                                text-gray-500
                                            "
                    >
                      Tidak ada data kostum.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => {
                    const imageUrl = getImageUrl(item.foto);

                    return (
                      <tr
                        key={item.id_kostum}
                        className="
                                                        border-t
                                                        border-white/5
                                                        hover:bg-white/[0.02]
                                                    "
                      >
                        {/* ID */}

                        <td className="px-5 py-5 text-[#D4AF37] font-semibold">
                          #{item.id_kostum}
                        </td>

                        {/* KOSTUM */}

                        <td className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            <div
                              className="
                                                                    w-16
                                                                    h-16
                                                                    rounded-xl
                                                                    bg-[#1D1D1D]
                                                                    overflow-hidden
                                                                    flex
                                                                    items-center
                                                                    justify-center
                                                                    flex-shrink-0
                                                                    border
                                                                    border-white/10
                                                                "
                            >
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt={item.nama_kostum || "Kostum"}
                                  className="
                                                                            w-full
                                                                            h-full
                                                                            object-cover
                                                                        "
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;

                                    e.currentTarget.style.display = "none";

                                    const parent =
                                      e.currentTarget.parentElement;

                                    if (
                                      parent &&
                                      !parent.querySelector(".fallback-icon")
                                    ) {
                                      const icon =
                                        document.createElement("div");

                                      icon.className =
                                        "fallback-icon text-[#D4AF37]";

                                      parent.appendChild(icon);
                                    }
                                  }}
                                />
                              ) : (
                                <FaTshirt className="text-[#D4AF37]" />
                              )}

                              {!imageUrl && (
                                <FaTshirt className="text-[#D4AF37]" />
                              )}
                            </div>

                            <div>
                              <p className="font-semibold">
                                {item.nama_kostum}
                              </p>

                              <p className="text-xs text-[#D4AF37] mt-1">
                                {item.kode_koleksi}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* KOLEKSI */}

                        <td className="px-5 py-5">
                          <p className="text-sm">{item.nama_koleksi}</p>
                        </td>

                        {/* KELOMPOK */}

                        <td className="px-5 py-5">
                          <p className="text-sm text-gray-300">
                            {item.kelompok_koleksi}
                          </p>
                        </td>

                        {/* KATEGORI */}

                        <td className="px-5 py-5">
                          {item.nama_kategori || "-"}
                        </td>

                        {/* UKURAN */}

                        <td className="px-5 py-5">{item.ukuran || "-"}</td>

                        {/* WARNA */}

                        <td className="px-5 py-5">{item.warna || "-"}</td>

                        {/* STOK */}

                        <td className="px-5 py-5">
                          <span
                            className={`
                                                                font-semibold
                                                                ${
                                                                  Number(
                                                                    item.stok,
                                                                  ) <= 0
                                                                    ? "text-red-400"
                                                                    : Number(
                                                                          item.stok,
                                                                        ) <= 2
                                                                      ? "text-yellow-400"
                                                                      : "text-green-400"
                                                                }
                                                            `}
                          >
                            {item.stok}
                          </span>
                        </td>

                        {/* HARGA */}

                        <td className="px-5 py-5 text-[#D4AF37] font-semibold">
                          {formatRupiah(item.harga_sewa)}
                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-5">
                          <span
                            className="
                                                                inline-flex
                                                                px-3
                                                                py-1.5
                                                                rounded-full
                                                                bg-white/5
                                                                border
                                                                border-white/10
                                                                text-xs
                                                            "
                          >
                            {item.status}
                          </span>
                        </td>

                        {/* AKSI */}

                        <td className="px-5 py-5">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => openEditForm(item)}
                              className="
                                                                    p-2.5
                                                                    rounded-lg
                                                                    border
                                                                    border-[#D4AF37]/20
                                                                    text-[#D4AF37]
                                                                    hover:bg-[#D4AF37]/10
                                                                "
                              title="Edit"
                            >
                              <FaEdit />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              className="
                                                                    p-2.5
                                                                    rounded-lg
                                                                    border
                                                                    border-red-500/20
                                                                    text-red-400
                                                                    hover:bg-red-500/10
                                                                "
                              title="Hapus"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* =================================================
                    BACK
                ================================================= */}

        <div className="mt-6">
          <Link
            to="/petugas/dashboard"
            className="
                            inline-flex
                            items-center
                            gap-2
                            text-gray-500
                            hover:text-[#D4AF37]
                        "
          >
            <FaArrowLeft />
            Kembali ke Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}

export default KostumPetugas;
