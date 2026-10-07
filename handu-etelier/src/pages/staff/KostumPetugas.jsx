import React, { useEffect, useMemo, useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiX,
  FiImage,
  FiPackage,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import api from "../../lib/api";

const KostumPetugas = () => {
  const [kostumData, setKostumData] = useState([]);
  const [kategoriData, setKategoriData] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterKategori, setFilterKategori] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    nama_kostum: "",
    id_kategori: "",
    deskripsi: "",
    ukuran: "",
    stok: "",
    harga_sewa: "",
    status: "Tersedia",
  });

  const [foto, setFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState("");

  const [loading, setLoading] = useState(false);

  // =====================================================
  // LOAD KOSTUM
  // =====================================================

  const loadKostum = async () => {
    try {
      const result = await api.get("/kostum");

      const rows = Array.isArray(result) ? result : result.data;

      setKostumData(Array.isArray(rows) ? rows : []);
    } catch (error) {
      console.error("Gagal mengambil data kostum:", error);
      alert(error.message || "Gagal mengambil data kostum.");
    }
  };

  // =====================================================
  // LOAD KATEGORI
  // =====================================================

  const loadKategori = async () => {
    try {
      const result = await api.get("/kategori");

      const rows = Array.isArray(result) ? result : result.data;

      setKategoriData(Array.isArray(rows) ? rows : []);
    } catch (error) {
      console.error("Gagal mengambil data kategori:", error);
      alert(error.message || "Gagal mengambil data kategori.");
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadKostum();
    loadKategori();
  }, []);

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (foto) => {
    if (!foto) {
      return "";
    }

    if (foto.startsWith("http://") || foto.startsWith("https://")) {
      return foto;
    }

    if (foto.startsWith("/")) {
      return foto;
    }

    return `/${foto}`;
  };

  // =====================================================
  // FILTER DATA
  // =====================================================

  const filteredKostum = useMemo(() => {
    return kostumData.filter((item) => {
      const nama = String(item.nama_kostum || "").toLowerCase();

      const matchesSearch = nama.includes(
        searchTerm.toLowerCase()
      );

      const matchesKategori =
        !filterKategori ||
        String(item.id_kategori) === String(filterKategori);

      return matchesSearch && matchesKategori;
    });
  }, [kostumData, searchTerm, filterKategori]);

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalKostum = kostumData.length;

  const totalStok = kostumData.reduce(
    (total, item) => total + Number(item.stok || 0),
    0
  );

  const tersedia = kostumData.filter(
    (item) =>
      String(item.status || "").toLowerCase() ===
      "tersedia"
  ).length;

  const tidakTersedia = kostumData.filter(
    (item) =>
      String(item.status || "").toLowerCase() !==
      "tersedia"
  ).length;

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // HANDLE FOTO
  // =====================================================

  const handleFotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setFoto(null);
      setPreviewFoto("");
      return;
    }

    setFoto(file);
    setPreviewFoto(URL.createObjectURL(file));
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setFormData({
      nama_kostum: "",
      id_kategori: "",
      deskripsi: "",
      ukuran: "",
      stok: "",
      harga_sewa: "",
      status: "Tersedia",
    });

    setFoto(null);
    setPreviewFoto("");
    setEditingId(null);
  };

  // =====================================================
  // OPEN ADD MODAL
  // =====================================================

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const handleEdit = (item) => {
    setEditingId(item.id_kostum);

    setFormData({
      nama_kostum: item.nama_kostum || "",
      id_kategori: item.id_kategori || "",
      deskripsi: item.deskripsi || "",
      ukuran: item.ukuran || "",
      stok: item.stok ?? "",
      harga_sewa: item.harga_sewa ?? "",
      status: item.status || "Tersedia",
    });

    setFoto(null);

    const existingFoto = item.foto
      ? getImageUrl(item.foto)
      : "";

    setPreviewFoto(existingFoto);

    setShowModal(true);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      data.append(
        "nama_kostum",
        formData.nama_kostum
      );

      data.append(
        "id_kategori",
        formData.id_kategori
      );

      data.append(
        "deskripsi",
        formData.deskripsi
      );

      data.append(
        "ukuran",
        formData.ukuran
      );

      data.append(
        "stok",
        formData.stok
      );

      data.append(
        "harga_sewa",
        formData.harga_sewa
      );

      data.append(
        "status",
        formData.status
      );

      if (foto) {
        data.append("foto", foto);
      }

      const result = editingId
        ? await api.put(
            `/kostum/${editingId}`,
            data
          )
        : await api.post(
            "/kostum",
            data
          );

      alert(
        result?.message ||
          (editingId
            ? "Data kostum berhasil diperbarui."
            : "Data kostum berhasil ditambahkan.")
      );

      handleCloseModal();
      await loadKostum();
    } catch (error) {
      console.error(
        "Gagal menyimpan data kostum:",
        error
      );

      alert(
        error.message ||
          "Gagal menyimpan data kostum."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus kostum "${item.nama_kostum}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const result = await api.delete(
        `/kostum/${item.id_kostum}`
      );

      alert(
        result?.message ||
          "Data kostum berhasil dihapus."
      );

      await loadKostum();
    } catch (error) {
      console.error(
        "Gagal menghapus kostum:",
        error
      );

      alert(
        error.message ||
          "Gagal menghapus kostum."
      );
    }
  };

  // =====================================================
  // FORMAT RUPIAH
  // =====================================================

  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(value || 0));
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f8f7f4] p-4 md:p-6">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Kelola Kostum
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Kelola data kostum yang tersedia untuk penyewaan.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#b08d57] px-4 py-2.5 font-medium text-white transition hover:bg-[#967545]"
        >
          <FiPlus size={18} />
          Tambah Kostum
        </button>
      </div>

      {/* SUMMARY */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Kostum
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-800">
                {totalKostum}
              </p>
            </div>

            <div className="rounded-lg bg-[#b08d57]/10 p-3 text-[#b08d57]">
              <FiPackage size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Stok
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-800">
                {totalStok}
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <FiPackage size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Tersedia
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-800">
                {tersedia}
              </p>
            </div>

            <div className="rounded-lg bg-green-50 p-3 text-green-600">
              <FiCheckCircle size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Tidak Tersedia
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-800">
                {tidakTersedia}
              </p>
            </div>

            <div className="rounded-lg bg-orange-50 p-3 text-orange-600">
              <FiClock size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* FILTER */}
      <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="relative">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              placeholder="Cari nama kostum..."
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#b08d57]"
            />
          </div>

          <select
            value={filterKategori}
            onChange={(e) =>
              setFilterKategori(e.target.value)
            }
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#b08d57]"
          >
            <option value="">
              Semua Kategori
            </option>

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
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-48">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Kostum
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Kategori
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Ukuran
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Stok
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Harga Sewa
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredKostum.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-12 text-center text-sm text-gray-500"
                  >
                    Tidak ada data kostum.
                  </td>
                </tr>
              ) : (
                filteredKostum.map((item) => {
                  const kategori =
                    kategoriData.find(
                      (kat) =>
                        String(
                          kat.id_kategori
                        ) ===
                        String(item.id_kategori)
                    );

                  return (
                    <tr
                      key={item.id_kostum}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                    >
                      {/* KOSTUM */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                            {item.foto ? (
                              <img
                                src={getImageUrl(
                                  item.foto
                                )}
                                alt={
                                  item.nama_kostum
                                }
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-gray-400">
                                <FiImage
                                  size={22}
                                />
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="font-medium text-gray-800">
                              {item.nama_kostum}
                            </p>

                            {item.deskripsi && (
                              <p className="mt-1 max-w-62.5 truncate text-xs text-gray-500">
                                {item.deskripsi}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* KATEGORI */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {kategori?.nama_kategori ||
                          item.nama_kategori ||
                          "-"}
                      </td>

                      {/* UKURAN */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {item.ukuran || "-"}
                      </td>

                      {/* STOK */}
                      <td className="px-5 py-4 text-sm font-medium text-gray-700">
                        {item.stok ?? 0}
                      </td>

                      {/* HARGA */}
                      <td className="px-5 py-4 text-sm font-medium text-gray-700">
                        {formatRupiah(
                          item.harga_sewa
                        )}
                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            String(
                              item.status || ""
                            ).toLowerCase() ===
                            "tersedia"
                              ? "bg-green-50 text-green-700"
                              : "bg-orange-50 text-orange-700"
                          }`}
                        >
                          {item.status ||
                            "Tidak Tersedia"}
                        </span>
                      </td>

                      {/* AKSI */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              handleEdit(item)
                            }
                            className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                            title="Edit"
                          >
                            <FiEdit size={17} />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(item)
                            }
                            className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                            title="Hapus"
                          >
                            <FiTrash2 size={17} />
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
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            {/* MODAL HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {editingId
                    ? "Edit Kostum"
                    : "Tambah Kostum"}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Lengkapi informasi kostum.
                </p>
              </div>

              <button
                onClick={handleCloseModal}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              {/* FOTO */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Foto Kostum
                </label>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-gray-300 bg-gray-50">
                    {previewFoto ? (
                      <img
                        src={previewFoto}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FiImage
                        size={30}
                        className="text-gray-400"
                      />
                    )}
                  </div>

                  <div className="flex items-center">
                    <label className="cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                      Pilih Foto
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFotoChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* NAMA */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Nama Kostum
                </label>

                <input
                  type="text"
                  name="nama_kostum"
                  value={formData.nama_kostum}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#b08d57]"
                  placeholder="Masukkan nama kostum"
                />
              </div>

              {/* KATEGORI */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Kategori
                </label>

                <select
                  name="id_kategori"
                  value={formData.id_kategori}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#b08d57]"
                >
                  <option value="">
                    Pilih Kategori
                  </option>

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

              {/* DESKRIPSI */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Deskripsi
                </label>

                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleChange}
                  rows="4"
                  className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#b08d57]"
                  placeholder="Masukkan deskripsi kostum"
                />
              </div>

              {/* UKURAN + STOK */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Ukuran
                  </label>

                  <input
                    type="text"
                    name="ukuran"
                    value={formData.ukuran}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#b08d57]"
                    placeholder="Contoh: S, M, L, XL"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Stok
                  </label>

                  <input
                    type="number"
                    name="stok"
                    value={formData.stok}
                    onChange={handleChange}
                    min="0"
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#b08d57]"
                    placeholder="Masukkan stok"
                  />
                </div>
              </div>

              {/* HARGA + STATUS */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Harga Sewa
                  </label>

                  <input
                    type="number"
                    name="harga_sewa"
                    value={formData.harga_sewa}
                    onChange={handleChange}
                    min="0"
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#b08d57]"
                    placeholder="Masukkan harga sewa"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#b08d57]"
                  >
                    <option value="Tersedia">
                      Tersedia
                    </option>

                    <option value="Tidak Tersedia">
                      Tidak Tersedia
                    </option>
                  </select>
                </div>
              </div>

              {/* BUTTON */}
              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-[#b08d57] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#967545] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Menyimpan..."
                    : editingId
                    ? "Simpan Perubahan"
                    : "Tambah Kostum"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KostumPetugas;