import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaSearch,
  FaUser,
  FaEye,
  FaSyncAlt,
  FaArrowLeft,
  FaCheck,
  FaTimes,
  FaCog,
  FaUndo,
  FaUndoAlt,
} from "react-icons/fa";

function PeminjamanPetugas() {
  const navigate = useNavigate();

  // ==================================================
  // USER
  // ==================================================

  const [user, setUser] = useState(null);

  // ==================================================
  // DATA
  // ==================================================

  const [data, setData] = useState([]);

  // ==================================================
  // LOADING / MESSAGE
  // ==================================================

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==================================================
  // FILTER
  // ==================================================

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  // ==================================================
  // UPDATE STATUS
  // ==================================================

  const [updatingId, setUpdatingId] = useState(null);

  // ==================================================
  // CONFIRM MODAL
  // ==================================================

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    item: null,
    newStatus: "",
    title: "",
    message: "",
  });

  // ==================================================
  // CEK LOGIN PETUGAS
  // ==================================================

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

      // ROLE PETUGAS = 2
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

  // ==================================================
  // LOAD PEMINJAMAN
  // ==================================================

  const loadPeminjaman = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/peminjaman");

      const raw = await response.text();

      let result = {};

      try {
        result = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(
          "Server mengembalikan response yang bukan JSON."
        );
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Gagal mengambil data peminjaman."
        );
      }

      const rows = Array.isArray(result)
        ? result
        : result.data;

      setData(Array.isArray(rows) ? rows : []);
    } catch (err) {
      console.error("Load peminjaman:", err);

      setError(
        err.message ||
          "Gagal mengambil data peminjaman."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // LOAD SAAT USER SIAP
  // ==================================================

  useEffect(() => {
    if (user) {
      loadPeminjaman();
    }
  }, [user]);

  // ==================================================
  // FORMAT RUPIAH
  // ==================================================

  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);
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

    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==================================================
  // STATUS STYLE
  // ==================================================

  const getStatusClass = (status) => {
    switch (
      String(status || "").toLowerCase()
    ) {
      case "menunggu":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";

      case "disetujui":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";

      case "diproses":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";

      case "selesai":
        return "bg-green-500/10 text-green-400 border-green-500/20";

      case "ditolak":
        return "bg-red-500/10 text-red-400 border-red-500/20";

      case "dibatalkan":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";

      default:
        return "bg-white/5 text-gray-300 border-white/10";
    }
  };

  // ==================================================
  // FILTER DATA
  // ==================================================

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const keyword = search
        .trim()
        .toLowerCase();

      const textUser = String(
        item.nama_user || ""
      ).toLowerCase();

      const textId = String(
        item.id_peminjaman || ""
      ).toLowerCase();

      const textKostum = String(
        item.nama_kostum || ""
      ).toLowerCase();

      const textKode = String(
        item.kode_koleksi || ""
      ).toLowerCase();

      const matchesSearch =
        !keyword ||
        textUser.includes(keyword) ||
        textId.includes(keyword) ||
        textKostum.includes(keyword) ||
        textKode.includes(keyword);

      const matchesStatus =
        statusFilter === "Semua" ||
        item.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [data, search, statusFilter]);

  // ==================================================
  // UPDATE STATUS
  // ==================================================

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `/peminjaman/${id}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const raw = await response.text();

      let result = {};

      try {
        result = raw
          ? JSON.parse(raw)
          : {};
      } catch {
        throw new Error(
          "Server mengembalikan response yang bukan JSON."
        );
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Gagal mengubah status peminjaman."
        );
      }

      setSuccess(
        result.message ||
          "Status peminjaman berhasil diperbarui."
      );

      await loadPeminjaman();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(
        "Update status:",
        err
      );

      setError(
        err.message ||
          "Gagal mengubah status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ==================================================
  // KONFIRMASI STATUS
  // ==================================================

  const handleStatusChange = (
    item,
    newStatus
  ) => {
    let title = "Konfirmasi Tindakan";
    let message = "";

    switch (newStatus) {
      case "Disetujui":
        title = "Setujui Peminjaman";
        message =
          `Apakah Anda yakin ingin menyetujui peminjaman #${item.id_peminjaman}?`;
        break;

      case "Ditolak":
        title = "Tolak Peminjaman";
        message =
          `Apakah Anda yakin ingin menolak peminjaman #${item.id_peminjaman}?`;
        break;

      case "Diproses":
        title = "Proses Peminjaman";
        message =
          `Apakah Anda yakin ingin memproses peminjaman #${item.id_peminjaman}?`;
        break;

      case "Dibatalkan":
        title = "Batalkan Peminjaman";
        message =
          `Apakah Anda yakin ingin membatalkan peminjaman #${item.id_peminjaman}?`;
        break;

      default:
        return;
    }

    setConfirmModal({
      open: true,
      item,
      newStatus,
      title,
      message,
    });
  };

  const closeConfirmModal = () => {
    if (updatingId !== null) {
      return;
    }

    setConfirmModal({
      open: false,
      item: null,
      newStatus: "",
      title: "",
      message: "",
    });
  };

  const confirmStatusChange = async () => {
    if (
      !confirmModal.item ||
      !confirmModal.newStatus
    ) {
      return;
    }

    const id =
      confirmModal.item.id_peminjaman;
    const status =
      confirmModal.newStatus;

    setConfirmModal({
      open: false,
      item: null,
      newStatus: "",
      title: "",
      message: "",
    });

    await updateStatus(id, status);
  };

  // ==================================================
  // AKSI BERDASARKAN STATUS
  // ==================================================

  const renderActions = (item) => {
    const status = String(
      item.status || ""
    ).toLowerCase();

    const isUpdating =
      updatingId === item.id_peminjaman;

    return (
      <div className="min-w-[190px] flex flex-col gap-2">

        {/* ==================================================
            DETAIL
        ================================================== */}

        <Link
          to={`/petugas/peminjaman/${item.id_peminjaman}`}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            px-3
            py-2
            rounded-lg
            border
            border-[#D4AF37]/20
            text-[#D4AF37]
            text-xs
            font-semibold
            hover:bg-[#D4AF37]/10
            transition
          "
        >
          <FaEye />
          Detail
        </Link>

        {/* ==================================================
            MENUNGGU
        ================================================== */}

        {status === "menunggu" && (
          <div className="grid grid-cols-2 gap-2">

            <button
              type="button"
              disabled={isUpdating}
              onClick={() =>
                handleStatusChange(
                  item,
                  "Disetujui"
                )
              }
              className="
                inline-flex
                items-center
                justify-center
                gap-1
                px-3
                py-2
                rounded-lg
                bg-green-500
                text-black
                text-xs
                font-semibold
                hover:bg-green-400
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition
              "
            >
              <FaCheck />

              {isUpdating
                ? "..."
                : "Setujui"}
            </button>

            <button
              type="button"
              disabled={isUpdating}
              onClick={() =>
                handleStatusChange(
                  item,
                  "Ditolak"
                )
              }
              className="
                inline-flex
                items-center
                justify-center
                gap-1
                px-3
                py-2
                rounded-lg
                border
                border-red-500/20
                text-red-400
                text-xs
                font-semibold
                hover:bg-red-500/10
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition
              "
            >
              <FaTimes />

              {isUpdating
                ? "..."
                : "Tolak"}
            </button>

          </div>
        )}

        {/* ==================================================
            DISETUJUI
        ================================================== */}

        {status === "disetujui" && (
          <div className="grid grid-cols-2 gap-2">

            <button
              type="button"
              disabled={isUpdating}
              onClick={() =>
                handleStatusChange(
                  item,
                  "Diproses"
                )
              }
              className="
                inline-flex
                items-center
                justify-center
                gap-1
                px-3
                py-2
                rounded-lg
                bg-[#D4AF37]
                text-black
                text-xs
                font-semibold
                hover:brightness-110
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition
              "
            >
              <FaCog />

              {isUpdating
                ? "..."
                : "Proses"}
            </button>

            <button
              type="button"
              disabled={isUpdating}
              onClick={() =>
                handleStatusChange(
                  item,
                  "Dibatalkan"
                )
              }
              className="
                inline-flex
                items-center
                justify-center
                gap-1
                px-3
                py-2
                rounded-lg
                border
                border-gray-500/20
                text-gray-400
                text-xs
                font-semibold
                hover:bg-white/5
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition
              "
            >
              <FaUndo />

              {isUpdating
                ? "..."
                : "Batalkan"}
            </button>

          </div>
        )}

        {/* ==================================================
            DIPROSES
        ================================================== */}

        {status === "diproses" && (
          <Link
            to="/petugas/pengembalian"
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              px-3
              py-2
              rounded-lg
              bg-[#D4AF37]
              text-black
              text-xs
              font-semibold
              hover:brightness-110
              transition
            "
          >
            <FaUndoAlt />
            Pengembalian
          </Link>
        )}

        {/* ==================================================
            SELESAI
        ================================================== */}

        {status === "selesai" && (
          <div
            className="
              text-center
              px-3
              py-2
              rounded-lg
              bg-green-500/5
              border
              border-green-500/10
              text-green-400
              text-xs
            "
          >
            Transaksi selesai
          </div>
        )}

        {/* ==================================================
            DITOLAK
        ================================================== */}

        {status === "ditolak" && (
          <div
            className="
              text-center
              px-3
              py-2
              rounded-lg
              bg-red-500/5
              border
              border-red-500/10
              text-red-400
              text-xs
            "
          >
            Peminjaman ditolak
          </div>
        )}

        {/* ==================================================
            DIBATALKAN
        ================================================== */}

        {status === "dibatalkan" && (
          <div
            className="
              text-center
              px-3
              py-2
              rounded-lg
              bg-gray-500/5
              border
              border-gray-500/10
              text-gray-400
              text-xs
            "
          >
            Peminjaman dibatalkan
          </div>
        )}

      </div>
    );
  };

  // ==================================================
  // LOADING
  // ==================================================

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
        <p className="text-[#D4AF37]">
          Memuat data peminjaman...
        </p>
      </div>
    );
  }

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div
      className="
        min-h-screen
        bg-[#090909]
        text-white
      "
    >

      {/* ==================================================
          HEADER
      ================================================== */}

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
              Daftar Peminjaman
            </h1>

            <p className="text-gray-500 mt-2">
              Pantau dan kelola status
              peminjaman pelanggan.
            </p>

          </div>

          <div className="flex gap-3">

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
              onClick={loadPeminjaman}
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
                hover:brightness-110
                transition
              "
            >
              <FaSyncAlt />
              Refresh
            </button>

          </div>

        </div>
      </header>

      <main
        className="
          max-w-7xl
          mx-auto
          px-6
          py-10
        "
      >

        {/* ==================================================
            TOAST NOTIFICATION
        ================================================== */}

        {(success || error) && (
          <div
            className="
              fixed
              top-6
              right-6
              z-[100]
              w-[360px]
              max-w-[calc(100vw-32px)]
            "
          >
            <div
              className={`
                rounded-2xl
                border
                px-5
                py-4
                shadow-2xl
                backdrop-blur-xl
                ${
                  success
                    ? `
                      bg-green-500/10
                      border-green-500/20
                      text-green-400
                    `
                    : `
                      bg-red-500/10
                      border-red-500/20
                      text-red-400
                    `
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`
                    mt-0.5
                    w-8
                    h-8
                    rounded-full
                    flex
                    items-center
                    justify-center
                    ${
                      success
                        ? "bg-green-500/15"
                        : "bg-red-500/15"
                    }
                  `}
                >
                  {success ? <FaCheck /> : <FaTimes />}
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-white">
                    {success ? "Berhasil" : "Gagal"}
                  </p>

                  <p className="text-sm mt-1 text-gray-400">
                    {success || error}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSuccess("");
                    setError("");
                  }}
                  className="
                    text-gray-500
                    hover:text-white
                    transition
                  "
                  aria-label="Tutup notifikasi"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================
            FILTER
        ================================================== */}

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
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Cari user, ID peminjaman, kostum, atau kode koleksi"
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

            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
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

              <option value="Semua">
                Semua Status
              </option>

              <option value="Menunggu">
                Menunggu
              </option>

              <option value="Disetujui">
                Disetujui
              </option>

              <option value="Diproses">
                Diproses
              </option>

              <option value="Selesai">
                Selesai
              </option>

              <option value="Ditolak">
                Ditolak
              </option>

              <option value="Dibatalkan">
                Dibatalkan
              </option>

            </select>

          </div>
        </section>

        {/* ==================================================
            SUMMARY
        ================================================== */}

        <section
          className="
            grid
            sm:grid-cols-2
            lg:grid-cols-4
            gap-4
            mb-7
          "
        >

          {/* TOTAL */}

          <div
            className="
              rounded-2xl
              bg-[#141414]
              border
              border-[#D4AF37]/10
              p-5
            "
          >
            <p className="text-gray-500 text-sm">
              Total
            </p>

            <p className="text-2xl font-bold mt-2">
              {data.length}
            </p>
          </div>

          {/* MENUNGGU */}

          <div
            className="
              rounded-2xl
              bg-[#141414]
              border
              border-yellow-500/10
              p-5
            "
          >
            <p className="text-gray-500 text-sm">
              Menunggu
            </p>

            <p className="text-2xl font-bold text-yellow-400 mt-2">
              {
                data.filter(
                  (item) =>
                    item.status ===
                    "Menunggu"
                ).length
              }
            </p>
          </div>

          {/* DIPROSES */}

          <div
            className="
              rounded-2xl
              bg-[#141414]
              border
              border-purple-500/10
              p-5
            "
          >
            <p className="text-gray-500 text-sm">
              Diproses
            </p>

            <p className="text-2xl font-bold text-purple-400 mt-2">
              {
                data.filter(
                  (item) =>
                    item.status ===
                    "Diproses"
                ).length
              }
            </p>
          </div>

          {/* SELESAI */}

          <div
            className="
              rounded-2xl
              bg-[#141414]
              border
              border-green-500/10
              p-5
            "
          >
            <p className="text-gray-500 text-sm">
              Selesai
            </p>

            <p className="text-2xl font-bold text-green-400 mt-2">
              {
                data.filter(
                  (item) =>
                    item.status ===
                    "Selesai"
                ).length
              }
            </p>
          </div>

        </section>

        {/* ==================================================
            TABLE
        ================================================== */}

        <section
          className="
            rounded-3xl
            bg-[#141414]
            border
            border-[#D4AF37]/15
            overflow-hidden
          "
        >

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1150px]">

              <thead
                className="
                  bg-[#1A1A1A]
                  border-b
                  border-white/5
                "
              >
                <tr>

                  <th className="text-left px-5 py-4 text-gray-500 text-sm">
                    ID
                  </th>

                  <th className="text-left px-5 py-4 text-gray-500 text-sm">
                    User
                  </th>

                  <th className="text-left px-5 py-4 text-gray-500 text-sm">
                    Kostum
                  </th>

                  <th className="text-left px-5 py-4 text-gray-500 text-sm">
                    Tanggal Pinjam
                  </th>

                  <th className="text-left px-5 py-4 text-gray-500 text-sm">
                    Tanggal Kembali
                  </th>

                  <th className="text-left px-5 py-4 text-gray-500 text-sm">
                    Total
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
                      colSpan="8"
                      className="
                        text-center
                        text-gray-500
                        py-16
                        px-6
                      "
                    >
                      Tidak ada data
                      peminjaman.
                    </td>

                  </tr>
                ) : (
                  filteredData.map(
                    (item) => (
                      <tr
                        key={
                          item.id_peminjaman
                        }
                        className="
                          border-b
                          border-white/5
                          hover:bg-white/[0.02]
                        "
                      >

                        {/* ==================================================
                            ID
                        ================================================== */}

                        <td className="px-5 py-5">

                          <span
                            className="
                              text-[#D4AF37]
                              font-semibold
                            "
                          >
                            #
                            {
                              item.id_peminjaman
                            }
                          </span>

                        </td>

                        {/* ==================================================
                            USER
                        ================================================== */}

                        <td className="px-5 py-5">

                          <div
                            className="
                              flex
                              items-center
                              gap-3
                            "
                          >

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
                              <FaUser />
                            </div>

                            <div>

                              <p className="font-semibold">
                                {item.nama_user ||
                                  "-"}
                              </p>

                              {item.email_user && (
                                <p className="text-gray-600 text-xs mt-1">
                                  {
                                    item.email_user
                                  }
                                </p>
                              )}

                            </div>

                          </div>

                        </td>

                        {/* ==================================================
                            KOSTUM
                        ================================================== */}

                        <td className="px-5 py-5">

                          <div>

                            <p className="font-semibold text-white">
                              {item.nama_kostum ||
                                "-"}
                            </p>

                            {item.kode_koleksi && (
                              <p
                                className="
                                  text-xs
                                  text-[#D4AF37]
                                  mt-1
                                "
                              >
                                {
                                  item.kode_koleksi
                                }
                              </p>
                            )}

                            {item.warna && (
                              <p
                                className="
                                  text-xs
                                  text-gray-600
                                  mt-1
                                "
                              >
                                Warna:{" "}
                                {item.warna}
                              </p>
                            )}

                          </div>

                        </td>

                        {/* ==================================================
                            TANGGAL PINJAM
                        ================================================== */}

                        <td className="px-5 py-5 text-gray-300">
                          {formatTanggal(
                            item.tanggal_peminjaman
                          )}
                        </td>

                        {/* ==================================================
                            TANGGAL KEMBALI
                        ================================================== */}

                        <td className="px-5 py-5 text-gray-300">
                          {formatTanggal(
                            item.tanggal_kembali
                          )}
                        </td>

                        {/* ==================================================
                            TOTAL
                        ================================================== */}

                        <td
                          className="
                            px-5
                            py-5
                            text-[#D4AF37]
                            font-semibold
                          "
                        >
                          {formatRupiah(
                            item.total_harga
                          )}
                        </td>

                        {/* ==================================================
                            STATUS
                        ================================================== */}

                        <td className="px-5 py-5">

                          <span
                            className={`
                              inline-flex
                              px-3
                              py-1.5
                              rounded-full
                              border
                              text-xs
                              font-semibold
                              ${getStatusClass(
                                item.status
                              )}
                            `}
                          >
                            {item.status ||
                              "Tidak diketahui"}
                          </span>

                        </td>

                        {/* ==================================================
                            AKSI
                        ================================================== */}

                        <td className="px-5 py-5">
                          {renderActions(item)}
                        </td>

                      </tr>
                    )
                  )
                )}

              </tbody>

            </table>

          </div>

        </section>

        {/* ==================================================
            BACK
        ================================================== */}

        <div className="mt-6">

          <Link
            to="/petugas/dashboard"
            className="
              inline-flex
              items-center
              gap-2
              text-gray-500
              hover:text-[#D4AF37]
              transition
            "
          >
            <FaArrowLeft />
            Kembali ke Dashboard Petugas
          </Link>

        </div>

      </main>

      {/* ==================================================
          CONFIRM MODAL
      ================================================== */}

      {confirmModal.open && (
        <div
          className="
            fixed
            inset-0
            z-[200]
            flex
            items-center
            justify-center
            p-5
            bg-black/70
            backdrop-blur-sm
          "
          onClick={closeConfirmModal}
        >
          <div
            className="
              w-full
              max-w-md
              rounded-3xl
              border
              border-[#D4AF37]/20
              bg-[#141414]
              shadow-2xl
              p-7
            "
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-[#D4AF37]/10
                border
                border-[#D4AF37]/20
                text-[#D4AF37]
                flex
                items-center
                justify-center
                text-xl
                mb-5
              "
            >
              <FaCog />
            </div>

            <h2 className="text-2xl font-bold text-white">
              {confirmModal.title}
            </h2>

            <p className="text-gray-400 mt-3 leading-6">
              {confirmModal.message}
            </p>

            {confirmModal.item && (
              <div
                className="
                  mt-5
                  rounded-2xl
                  bg-[#1D1D1D]
                  border
                  border-white/5
                  p-4
                "
              >
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Detail
                </p>

                <p className="text-white font-semibold mt-2">
                  {confirmModal.item.nama_kostum || "Kostum"}
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  Peminjaman #{confirmModal.item.id_peminjaman}
                </p>
              </div>
            )}

            <div className="flex gap-3 mt-7">
              <button
                type="button"
                disabled={updatingId !== null}
                onClick={closeConfirmModal}
                className="
                  flex-1
                  px-5
                  py-3
                  rounded-xl
                  border
                  border-white/10
                  text-gray-400
                  hover:text-white
                  hover:bg-white/5
                  transition
                  disabled:opacity-50
                "
              >
                Batal
              </button>

              <button
                type="button"
                disabled={updatingId !== null}
                onClick={confirmStatusChange}
                className={`
                  flex-1
                  px-5
                  py-3
                  rounded-xl
                  font-semibold
                  transition
                  ${
                    confirmModal.newStatus === "Ditolak"
                      ? `
                        bg-red-500
                        text-white
                        hover:bg-red-400
                      `
                      : `
                        bg-[#D4AF37]
                        text-black
                        hover:brightness-110
                      `
                  }
                  disabled:opacity-50
                `}
              >
                {updatingId !== null
                  ? "Memproses..."
                  : confirmModal.newStatus === "Ditolak"
                    ? "Tolak Peminjaman"
                    : "Konfirmasi"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default PeminjamanPetugas;