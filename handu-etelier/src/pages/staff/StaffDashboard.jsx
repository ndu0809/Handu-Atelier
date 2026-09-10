import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaCreditCard,
  FaTshirt,
  FaUsers,
  FaClipboardList,
  FaUndoAlt,
  FaUserCircle,
  FaSignOutAlt,
  FaHome,
  FaBars,
  FaTimes,
  FaCalendarAlt,
  FaChevronRight,
  FaChartLine,
  FaClock,
  FaCheckCircle,
  FaComments,
} from "react-icons/fa";

function StaffDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [kostumData, setKostumData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [peminjamanData, setPeminjamanData] = useState([]);
  const [pengembalianData, setPengembalianData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==================================================
  // CEK SESSION
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

      // ROLE 2 = PETUGAS
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
  // PARSE RESPONSE
  // ==================================================

  const parseResponse = async (response) => {
    const raw = await response.text();

    if (!raw) {
      return {};
    }

    try {
      return JSON.parse(raw);
    } catch {
      throw new Error(
        "Server mengembalikan response yang bukan JSON."
      );
    }
  };

  // ==================================================
  // LOAD DASHBOARD
  // ==================================================

  useEffect(() => {
    if (!user) {
      return;
    }

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          kostumResponse,
          usersResponse,
          peminjamanResponse,
          pengembalianResponse,
        ] = await Promise.all([
          fetch("/kostum"),
          fetch("/users"),
          fetch("/peminjaman"),
          fetch("/pengembalian"),
        ]);

        const [
          kostumResult,
          usersResult,
          peminjamanResult,
          pengembalianResult,
        ] = await Promise.all([
          parseResponse(kostumResponse),
          parseResponse(usersResponse),
          parseResponse(peminjamanResponse),
          parseResponse(pengembalianResponse),
        ]);

        // KOSTUM
        const kostumRows = Array.isArray(kostumResult)
          ? kostumResult
          : kostumResult.data;

        setKostumData(
          Array.isArray(kostumRows) ? kostumRows : []
        );

        // USERS
        const userRows = Array.isArray(usersResult)
          ? usersResult
          : usersResult.data;

        const customerRows = (
          Array.isArray(userRows) ? userRows : []
        ).filter((item) => {
          const role = String(item.nama_role || "")
            .trim()
            .toLowerCase();

          return role !== "admin" && role !== "petugas";
        });

        setUserData(customerRows);

        // PEMINJAMAN
        const peminjamanRows = Array.isArray(
          peminjamanResult
        )
          ? peminjamanResult
          : peminjamanResult.data;

        setPeminjamanData(
          Array.isArray(peminjamanRows)
            ? peminjamanRows
            : []
        );

        // PENGEMBALIAN
        const pengembalianRows = Array.isArray(
          pengembalianResult
        )
          ? pengembalianResult
          : pengembalianResult.data;

        setPengembalianData(
          Array.isArray(pengembalianRows)
            ? pengembalianRows
            : []
        );
      } catch (err) {
        console.error("Dashboard error:", err);

        setError(
          err.message || "Gagal memuat dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user]);

  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    navigate("/login", {
      replace: true,
    });
  };

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
  // KEY TANGGAL LOKAL
  // ==================================================

  const getDateKey = (value) => {
    if (!value) {
      return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value).slice(0, 10);
    }

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // ==================================================
  // PEMINJAMAN AKTIF
  // ==================================================

  const activeBorrowings = useMemo(() => {
    return peminjamanData.filter((item) => {
      const status = String(
        item.status || ""
      ).toLowerCase();

      return [
        "disetujui",
        "diproses",
      ].includes(status);
    }).length;
  }, [peminjamanData]);

  // ==================================================
  // MENUNGGU
  // ==================================================

  const waitingBorrowings = useMemo(() => {
    return peminjamanData.filter(
      (item) =>
        String(item.status || "").toLowerCase() ===
        "menunggu"
    ).length;
  }, [peminjamanData]);

  // ==================================================
  // SELESAI
  // ==================================================

  const completedBorrowings = useMemo(() => {
    return peminjamanData.filter(
      (item) =>
        String(item.status || "").toLowerCase() ===
        "selesai"
    ).length;
  }, [peminjamanData]);

  // ==================================================
  // PENGEMBALIAN HARI INI
  // ==================================================

  const todayReturns = useMemo(() => {
    const today = getDateKey(new Date());

    return pengembalianData.filter(
      (item) =>
        getDateKey(item.tanggal_pengembalian) ===
        today
    ).length;
  }, [pengembalianData]);

  // ==================================================
  // TOTAL DENDA
  // ==================================================

  const totalDenda = useMemo(() => {
    return pengembalianData.reduce(
      (total, item) =>
        total + (Number(item.denda) || 0),
      0
    );
  }, [pengembalianData]);

  // ==================================================
  // PEMINJAMAN TERBARU
  // ==================================================

  const recentBorrowings = useMemo(() => {
    return [...peminjamanData]
      .sort(
        (a, b) =>
          Number(b.id_peminjaman || 0) -
          Number(a.id_peminjaman || 0)
      )
      .slice(0, 5);
  }, [peminjamanData]);

  // ==================================================
  // PENGEMBALIAN TERBARU
  // ==================================================

  const recentReturns = useMemo(() => {
    return [...pengembalianData]
      .sort(
        (a, b) =>
          Number(b.id_pengembalian || 0) -
          Number(a.id_pengembalian || 0)
      )
      .slice(0, 5);
  }, [pengembalianData]);

  // ==================================================
  // KOSTUM
  // ==================================================

  const popularCostumes = useMemo(() => {
    return [...kostumData]
      .sort(
        (a, b) =>
          Number(b.stok || 0) -
          Number(a.stok || 0)
      )
      .slice(0, 5);
  }, [kostumData]);

  // ==================================================
  // GRAFIK PEMINJAMAN BULAN INI
  // ==================================================

  const monthlyBorrowingChart = useMemo(() => {
    const now = new Date();

    const year = now.getFullYear();
    const month = now.getMonth();

    const daysInMonth = new Date(
      year,
      month + 1,
      0
    ).getDate();

    const counts = Array(
      daysInMonth
    ).fill(0);

    peminjamanData.forEach((item) => {
      if (!item.tanggal_peminjaman) {
        return;
      }

      const date = new Date(
        item.tanggal_peminjaman
      );

      if (Number.isNaN(date.getTime())) {
        return;
      }

      if (
        date.getFullYear() !== year ||
        date.getMonth() !== month
      ) {
        return;
      }

      const day = date.getDate();

      if (
        day >= 1 &&
        day <= daysInMonth
      ) {
        counts[day - 1] += 1;
      }
    });

    const maxCount = Math.max(
      ...counts,
      1
    );

    return {
      counts,
      daysInMonth,
      maxCount,
    };
  }, [peminjamanData]);

  // ==================================================
  // TOTAL PEMINJAMAN BULAN INI
  // ==================================================

  const monthlyBorrowingTotal = useMemo(() => {
    const now = new Date();

    const year = now.getFullYear();
    const month = now.getMonth();

    return peminjamanData.filter((item) => {
      if (!item.tanggal_peminjaman) {
        return false;
      }

      const date = new Date(
        item.tanggal_peminjaman
      );

      return (
        !Number.isNaN(date.getTime()) &&
        date.getFullYear() === year &&
        date.getMonth() === month
      );
    }).length;
  }, [peminjamanData]);

  // ==================================================
  // MENU
  // ==================================================

const menu = [
  {
    label: "Dashboard",
    path: "/petugas/dashboard",
    icon: FaHome,
  },

  {
    label: "Peminjaman",
    path: "/petugas/peminjaman",
    icon: FaClipboardList,
  },

  {
    label: "Pengembalian",
    path: "/petugas/pengembalian",
    icon: FaUndoAlt,
  },

  {
    label: "Koleksi Kostum",
    path: "/collections",
    icon: FaTshirt,
  },

  {
    label: "Customer",
    path: "/petugas/customer",
    icon: FaUsers,
  },

  {
    label: "Chat Pelanggan",
    path: "/petugas/chat",
    icon: FaComments,
  },

  {
    label: "Profil",
    path: "/petugas/profile",
    icon: FaUserCircle,
  },

  {
    label: "Pembayaran",
    path: "/petugas/pengaturan-pembayaran",
    icon: FaCreditCard,
  },
];

  // ==================================================
  // STATUS STYLE
  // ==================================================

  const getStatusClass = (status) => {
    switch (
      String(status || "").toLowerCase()
    ) {
      case "menunggu":
        return "bg-yellow-500/10 text-yellow-400";

      case "disetujui":
        return "bg-blue-500/10 text-blue-400";

      case "diproses":
        return "bg-purple-500/10 text-purple-400";

      case "selesai":
        return "bg-green-500/10 text-green-400";

      case "ditolak":
        return "bg-red-500/10 text-red-400";

      case "dibatalkan":
        return "bg-gray-500/10 text-gray-400";

      default:
        return "bg-white/5 text-gray-400";
    }
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
        <p
          className="
            text-[#D4AF37]
            tracking-[3px]
            uppercase
            text-sm
          "
        >
          Memuat Dashboard Petugas...
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
        bg-[#080808]
        text-white
      "
    >
      {/* ==================================================
          MOBILE HEADER
      ================================================== */}

      <header
        className="
          lg:hidden
          sticky
          top-0
          z-50
          bg-[#111111]
          border-b
          border-[#D4AF37]/20
          px-5
          py-4
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
          "
        >
          <div>
            <h1
              className="
                text-xl
                font-bold
                text-[#D4AF37]
              "
            >
              Handu Atelier
            </h1>

            <p
              className="
                text-[10px]
                tracking-[3px]
                text-gray-500
                mt-1
              "
            >
              PETUGAS
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            className="
              text-[#D4AF37]
              text-xl
            "
          >
            {menuOpen ? (
              <FaTimes />
            ) : (
              <FaBars />
            )}
          </button>
        </div>
      </header>

      {/* ==================================================
          MOBILE MENU
      ================================================== */}

      {menuOpen && (
        <div
          className="
            fixed
            inset-0
            z-40
            bg-[#080808]
            lg:hidden
            pt-24
            px-6
          "
        >
          <nav className="space-y-2">
            {menu.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className="
                    flex
                    items-center
                    gap-4
                    px-5
                    py-4
                    rounded-xl
                    border
                    border-[#D4AF37]/10
                    bg-[#121212]
                    text-gray-300
                  "
                >
                  <Icon className="text-[#D4AF37]" />
                  {item.label}
                </Link>
              );
            })}

            <button
              type="button"
              onClick={handleLogout}
              className="
                w-full
                flex
                items-center
                gap-4
                px-5
                py-4
                mt-5
                rounded-xl
                border
                border-red-500/20
                bg-red-500/5
                text-red-400
              "
            >
              <FaSignOutAlt />
              Keluar
            </button>
          </nav>
        </div>
      )}

      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <aside
        className="
          hidden
          lg:flex
          fixed
          left-0
          top-0
          bottom-0
          w-[245px]
          bg-[#0E0E0E]
          border-r
          border-[#D4AF37]/20
          flex-col
          z-40
        "
      >
        {/* LOGO */}

        <div
          className="
            px-6
            py-7
            border-b
            border-[#D4AF37]/10
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <FaHome
              className="
                text-[#D4AF37]
                text-2xl
              "
            />

            <div>
              <h1
                className="
                  text-2xl
                  font-bold
                  text-[#D4AF37]
                "
              >
                Handu Atelier
              </h1>

              <p
                className="
                  text-[9px]
                  tracking-[3px]
                  text-gray-500
                  mt-1
                "
              >
                ELEGANCE FOR EVERY MOMENT
              </p>
            </div>
          </div>
        </div>

        {/* MENU */}

        <div
          className="
            flex-1
            min-h-0
            px-3
            py-7
            overflow-y-auto
            [scrollbar-width:none]
            [-ms-overflow-style:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          <p
            className="
              text-[10px]
              uppercase
              tracking-[3px]
              text-gray-600
              px-4
              mb-4
            "
          >
            Menu Utama
          </p>

          <nav className="space-y-1">
            {menu.map((item) => {
              const Icon = item.icon;

              const active =
                item.path ===
                "/petugas/dashboard";

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`
                    flex
                    items-center
                    justify-between
                    px-4
                    py-3.5
                    rounded-xl
                    transition-all
                    duration-300
                    ${
                      active
                        ? "bg-gradient-to-r from-[#D4AF37]/30 to-[#D4AF37]/5 text-[#F1C75B]"
                        : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                    }
                  `}
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-4
                    "
                  >
                    <Icon />

                    <span className="text-sm">
                      {item.label}
                    </span>
                  </div>

                  {item.label !==
                    "Dashboard" && (
                    <FaChevronRight
                      className="
                        text-[10px]
                        opacity-40
                      "
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div
            className="
              mt-9
              pt-6
              border-t
              border-white/5
            "
          >
            <p
              className="
                text-[10px]
                uppercase
                tracking-[3px]
                text-gray-600
                px-4
                mb-4
              "
            >
              Pengaturan
            </p>

            <Link
              to="/petugas/profile"
              className="
                flex
                items-center
                gap-4
                px-4
                py-3.5
                rounded-xl
                text-gray-400
                hover:bg-white/[0.04]
                hover:text-white
                transition
              "
            >
              <FaUserCircle />

              <span className="text-sm">
                Profil
              </span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="
                w-full
                flex
                items-center
                gap-4
                px-4
                py-3.5
                mt-1
                rounded-xl
                text-red-400
                hover:bg-red-500/5
                transition
              "
            >
              <FaSignOutAlt />

              <span className="text-sm">
                Keluar
              </span>
            </button>
          </div>
        </div>

        {/* MINI PROFILE */}

        <div
          className="
            p-4
            border-t
            border-[#D4AF37]/10
          "
        >
          <div
            className="
              rounded-xl
              bg-[#151515]
              border
              border-[#D4AF37]/10
              p-3
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  w-9
                  h-9
                  rounded-full
                  bg-[#D4AF37]
                  text-black
                  flex
                  items-center
                  justify-center
                  font-bold
                "
              >
                {user.nama
                  ?.charAt(0)
                  ?.toUpperCase() || "P"}
              </div>

              <div className="min-w-0">
                <p
                  className="
                    text-sm
                    font-semibold
                    truncate
                  "
                >
                  {user.nama}
                </p>

                <p
                  className="
                    text-[11px]
                    text-gray-500
                    truncate
                  "
                >
                  Petugas
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ==================================================
          MAIN
      ================================================== */}

      <main
        className="
          lg:ml-[245px]
          min-h-screen
        "
      >
        <div
          className="
            max-w-[1500px]
            mx-auto
            px-5
            md:px-8
            py-6
          "
        >
          {/* TOP BAR */}

          <header
            className="
              flex
              items-center
              justify-between
              gap-5
              mb-7
            "
          >
            <div>
              <h2
                className="
                  text-3xl
                  md:text-4xl
                  font-bold
                "
              >
                Dashboard
              </h2>

              <p
                className="
                  text-gray-500
                  mt-1
                "
              >
                Selamat datang kembali,{" "}
                {user.nama}
              </p>
            </div>

            <div
              className="
                hidden
                md:flex
                items-center
                gap-4
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                  px-5
                  py-3
                  rounded-xl
                  border
                  border-[#D4AF37]/15
                  bg-[#121212]
                "
              >
                <FaCalendarAlt className="text-[#D4AF37]" />

                <div>
                  <p className="text-xs font-semibold">
                    {new Date().toLocaleDateString(
                      "id-ID",
                      {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </p>

                  <p className="text-[10px] text-gray-500">
                    Area Petugas
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="
                    w-12
                    h-12
                    rounded-full
                    border
                    border-[#D4AF37]/50
                    bg-[#D4AF37]/10
                    text-[#D4AF37]
                    flex
                    items-center
                    justify-center
                    text-lg
                    font-semibold
                  "
                >
                  {user.nama
                    ?.charAt(0)
                    ?.toUpperCase() || "P"}
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    {user.nama}
                  </p>

                  <p className="text-xs text-gray-500">
                    Petugas
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* ERROR */}

          {error && (
            <div
              className="
                mb-6
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

          {/* ==================================================
              STAT CARDS
          ================================================== */}

          <section
            className="
              grid
              sm:grid-cols-2
              xl:grid-cols-5
              gap-4
            "
          >
            {/* TOTAL KOSTUM */}

            <Link
              to="/petugas/kostum"
              className="
                rounded-2xl
                border
                border-[#D4AF37]/20
                bg-gradient-to-br
                from-[#1A160D]
                to-[#101010]
                p-5
                hover:border-[#D4AF37]/50
                transition
              "
            >
              <p className="text-gray-400 text-sm">
                Total Kostum
              </p>

              <div
                className="
                  flex
                  items-end
                  justify-between
                  mt-3
                "
              >
                <p className="text-4xl font-bold text-[#D4AF37]">
                  {kostumData.length}
                </p>

                <FaTshirt
                  className="
                    text-[#D4AF37]
                    text-3xl
                    opacity-80
                  "
                />
              </div>

              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-t
                  border-white/5
                  pt-3
                  mt-4
                "
              >
                <span className="text-[#D4AF37] text-xs">
                  Lihat Detail
                </span>

                <FaChevronRight className="text-[#D4AF37] text-xs" />
              </div>
            </Link>

            {/* USERS */}

            <Link
              to="/petugas/customer"
              className="
                rounded-2xl
                border
                border-[#D4AF37]/20
                bg-[#111111]
                p-5
                hover:border-[#D4AF37]/50
                transition
              "
            >
              <p className="text-gray-400 text-sm">
                Pelanggan
              </p>

              <div
                className="
                  flex
                  items-end
                  justify-between
                  mt-3
                "
              >
                <p className="text-4xl font-bold text-[#D4AF37]">
                  {userData.length}
                </p>

                <FaUsers
                  className="
                    text-[#D4AF37]
                    text-3xl
                    opacity-80
                  "
                />
              </div>

              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-t
                  border-white/5
                  pt-3
                  mt-4
                "
              >
                <span className="text-[#D4AF37] text-xs">
                  Lihat Detail
                </span>

                <FaChevronRight className="text-[#D4AF37] text-xs" />
              </div>
            </Link>

            {/* AKTIF */}

            <Link
              to="/petugas/peminjaman"
              className="
                rounded-2xl
                border
                border-[#D4AF37]/20
                bg-[#111111]
                p-5
                hover:border-[#D4AF37]/50
                transition
              "
            >
              <p className="text-gray-400 text-sm">
                Peminjaman Aktif
              </p>

              <div
                className="
                  flex
                  items-end
                  justify-between
                  mt-3
                "
              >
                <p className="text-4xl font-bold text-[#D4AF37]">
                  {activeBorrowings}
                </p>

                <FaClipboardList
                  className="
                    text-[#D4AF37]
                    text-3xl
                    opacity-80
                  "
                />
              </div>

              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-t
                  border-white/5
                  pt-3
                  mt-4
                "
              >
                <span className="text-[#D4AF37] text-xs">
                  Disetujui + Diproses
                </span>

                <FaChevronRight className="text-[#D4AF37] text-xs" />
              </div>
            </Link>

            {/* MENUNGGU */}

            <Link
              to="/petugas/peminjaman"
              className="
                rounded-2xl
                border
                border-yellow-500/20
                bg-[#111111]
                p-5
                hover:border-yellow-500/40
                transition
              "
            >
              <p className="text-gray-400 text-sm">
                Menunggu Tindakan
              </p>

              <div
                className="
                  flex
                  items-end
                  justify-between
                  mt-3
                "
              >
                <p className="text-4xl font-bold text-yellow-400">
                  {waitingBorrowings}
                </p>

                <FaClock
                  className="
                    text-yellow-400
                    text-3xl
                    opacity-80
                  "
                />
              </div>

              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-t
                  border-white/5
                  pt-3
                  mt-4
                "
              >
                <span className="text-yellow-400 text-xs">
                  Perlu tindakan
                </span>

                <FaChevronRight className="text-yellow-400 text-xs" />
              </div>
            </Link>

            {/* PENGEMBALIAN */}

            <Link
              to="/petugas/pengembalian"
              className="
                rounded-2xl
                border
                border-green-500/20
                bg-[#111111]
                p-5
                hover:border-green-500/40
                transition
              "
            >
              <p className="text-gray-400 text-sm">
                Pengembalian Hari Ini
              </p>

              <div
                className="
                  flex
                  items-end
                  justify-between
                  mt-3
                "
              >
                <p className="text-4xl font-bold text-green-400">
                  {todayReturns}
                </p>

                <FaCheckCircle
                  className="
                    text-green-400
                    text-3xl
                    opacity-80
                  "
                />
              </div>

              <div
                className="
                  border-t
                  border-white/5
                  pt-3
                  mt-4
                "
              >
                <span className="text-green-400 text-xs">
                  Total denda:{" "}
                  {formatRupiah(totalDenda)}
                </span>
              </div>
            </Link>
          </section>

          {/* ==================================================
              SECONDARY SUMMARY
          ================================================== */}

          <section
            className="
              grid
              sm:grid-cols-2
              lg:grid-cols-3
              gap-4
              mt-5
            "
          >
            <div
              className="
                rounded-2xl
                border
                border-white/5
                bg-[#111111]
                p-5
              "
            >
              <p className="text-gray-500 text-sm">
                Total Peminjaman
              </p>

              <p className="text-2xl font-bold mt-2">
                {peminjamanData.length}
              </p>
            </div>

            <div
              className="
                rounded-2xl
                border
                border-white/5
                bg-[#111111]
                p-5
              "
            >
              <p className="text-gray-500 text-sm">
                Selesai
              </p>

              <p className="text-2xl font-bold text-green-400 mt-2">
                {completedBorrowings}
              </p>
            </div>

            <div
              className="
                rounded-2xl
                border
                border-white/5
                bg-[#111111]
                p-5
              "
            >
              <p className="text-gray-500 text-sm">
                Peminjaman Bulan Ini
              </p>

              <p className="text-2xl font-bold text-[#D4AF37] mt-2">
                {monthlyBorrowingTotal}
              </p>
            </div>
          </section>

          {/* ==================================================
              CONTENT GRID
          ================================================== */}

          <section
            className="
              grid
              xl:grid-cols-5
              gap-5
              mt-5
            "
          >
            {/* GRAFIK */}

            <div
              className="
                xl:col-span-3
                rounded-2xl
                border
                border-[#D4AF37]/15
                bg-[#111111]
                p-5
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-5
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <FaChartLine className="text-[#D4AF37]" />

                  <div>
                    <h2 className="text-lg font-semibold">
                      Grafik Peminjaman
                    </h2>

                    <p className="text-xs text-gray-600 mt-1">
                      Jumlah peminjaman per hari
                      bulan berjalan
                    </p>
                  </div>
                </div>

                <div
                  className="
                    px-4
                    py-2
                    rounded-lg
                    border
                    border-white/10
                    text-xs
                    text-gray-400
                  "
                >
                  Bulan Ini
                </div>
              </div>

              <div
                className="
                  h-[270px]
                  rounded-xl
                  bg-[#0D0D0D]
                  border
                  border-white/5
                  p-4
                "
              >
                {peminjamanData.length === 0 ? (
                  <div
                    className="
                      h-full
                      flex
                      items-center
                      justify-center
                      text-gray-600
                      text-sm
                    "
                  >
                    Belum ada data
                    peminjaman.
                  </div>
                ) : (
                  <div
                    className="
                      h-full
                      flex
                      flex-col
                      justify-end
                    "
                  >
                    {/* 
                      PERBAIKAN:
                      Tidak menggunakan overflow-x-auto.
                      Semua tanggal dipaksa masuk ke
                      lebar grafik.
                    */}
                    <div
                      className="
                        grid
                        items-end
                        gap-[3px]
                        h-[210px]
                        w-full
                        overflow-hidden
                      "
                      style={{
                        gridTemplateColumns:
                          `repeat(${monthlyBorrowingChart.daysInMonth}, minmax(0, 1fr))`,
                      }}
                    >
                      {monthlyBorrowingChart.counts.map(
                        (count, index) => {
                          const height =
                            count === 0
                              ? 4
                              : Math.max(
                                  12,
                                  (count /
                                    monthlyBorrowingChart.maxCount) *
                                    180
                                );

                          return (
                            <div
                              key={index}
                              className="
                                min-w-0
                                h-full
                                flex
                                flex-col
                                items-center
                                justify-end
                                gap-1
                              "
                            >
                              <span
                                className="
                                  text-[9px]
                                  text-gray-600
                                  leading-none
                                "
                              >
                                {count > 0
                                  ? count
                                  : ""}
                              </span>

                              <div
                                className="
                                  w-full
                                  min-w-[3px]
                                  rounded-t-md
                                  bg-gradient-to-t
                                  from-[#8F6B16]
                                  to-[#D4AF37]
                                  opacity-80
                                "
                                style={{
                                  height: `${height}px`,
                                }}
                                title={`Tanggal ${
                                  index + 1
                                }: ${count} peminjaman`}
                              />

                              <span
                                className="
                                  text-[8px]
                                  text-gray-700
                                  leading-none
                                "
                              >
                                {index + 1}
                              </span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* PEMINJAMAN TERBARU */}

            <div
              className="
                xl:col-span-2
                rounded-2xl
                border
                border-[#D4AF37]/15
                bg-[#111111]
                p-5
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-5
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <FaCalendarAlt className="text-[#D4AF37]" />

                  <h2 className="text-lg font-semibold">
                    Peminjaman Terbaru
                  </h2>
                </div>

                <Link
                  to="/petugas/peminjaman"
                  className="
                    text-xs
                    text-[#D4AF37]
                    hover:underline
                  "
                >
                  Lihat Semua
                </Link>
              </div>

              <div className="divide-y divide-white/5">
                {recentBorrowings.length === 0 ? (
                  <div
                    className="
                      py-10
                      text-center
                      text-gray-600
                      text-sm
                    "
                  >
                    Belum ada peminjaman.
                  </div>
                ) : (
                  recentBorrowings.map((item) => (
                    <Link
                      key={item.id_peminjaman}
                      to={`/petugas/peminjaman/${item.id_peminjaman}`}
                      className="
                        block
                        py-3
                        hover:bg-white/[0.02]
                        transition
                      "
                    >
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
                            font-semibold
                          "
                        >
                          {item.nama_user
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">
                            {item.nama_user || "-"}
                          </p>

                          <p className="text-[11px] text-gray-600 mt-1 truncate">
                            #{item.id_peminjaman} •{" "}
                            {item.nama_kostum ||
                              "Kostum"}
                          </p>
                        </div>

                        <span
                          className={`
                            text-[10px]
                            px-2
                            py-1
                            rounded-full
                            ${getStatusClass(
                              item.status
                            )}
                          `}
                        >
                          {item.status || "-"}
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* ==================================================
              PENGEMBALIAN TERBARU
          ================================================== */}

          <section
            className="
              mt-5
              rounded-2xl
              border
              border-green-500/10
              bg-[#111111]
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
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <FaUndoAlt className="text-green-400" />

                <h2 className="text-lg font-semibold">
                  Pengembalian Terbaru
                </h2>
              </div>

              <Link
                to="/petugas/pengembalian"
                className="
                  text-xs
                  text-green-400
                "
              >
                Lihat Semua
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead className="bg-[#161616]">
                  <tr>
                    <th className="text-left px-5 py-3 text-gray-600 text-xs">
                      ID
                    </th>

                    <th className="text-left px-5 py-3 text-gray-600 text-xs">
                      Peminjaman
                    </th>

                    <th className="text-left px-5 py-3 text-gray-600 text-xs">
                      User
                    </th>

                    <th className="text-left px-5 py-3 text-gray-600 text-xs">
                      Tanggal
                    </th>

                    <th className="text-left px-5 py-3 text-gray-600 text-xs">
                      Kondisi
                    </th>

                    <th className="text-left px-5 py-3 text-gray-600 text-xs">
                      Denda
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentReturns.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="
                          text-center
                          py-12
                          text-gray-600
                          text-sm
                        "
                      >
                        Belum ada data
                        pengembalian.
                      </td>
                    </tr>
                  ) : (
                    recentReturns.map((item) => (
                      <tr
                        key={item.id_pengembalian}
                        className="
                          border-t
                          border-white/5
                        "
                      >
                        <td className="px-5 py-4 text-[#D4AF37] font-semibold">
                          #{item.id_pengembalian}
                        </td>

                        <td className="px-5 py-4">
                          #{item.id_peminjaman}
                        </td>

                        <td className="px-5 py-4">
                          {item.nama_user || "-"}
                        </td>

                        <td className="px-5 py-4 text-gray-300">
                          {formatTanggal(
                            item.tanggal_pengembalian
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`
                              inline-flex
                              px-3
                              py-1.5
                              rounded-full
                              text-xs
                              ${
                                item.kondisi_baju ===
                                "Baik"
                                  ? "bg-green-500/10 text-green-400"
                                  : item.kondisi_baju ===
                                    "Kotor"
                                  ? "bg-yellow-500/10 text-yellow-400"
                                  : "bg-red-500/10 text-red-400"
                              }
                            `}
                          >
                            {item.kondisi_baju || "-"}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-[#D4AF37] font-semibold">
                          {formatRupiah(item.denda)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* ==================================================
              KOLEKSI KOSTUM
          ================================================== */}

          <section
            className="
              mt-5
              rounded-2xl
              border
              border-[#D4AF37]/15
              bg-[#111111]
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
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <FaTshirt className="text-[#D4AF37]" />

                <h2 className="text-lg font-semibold">
                  Koleksi Kostum
                </h2>
              </div>

              <Link
                to="/petugas/kostum"
                className="
                  text-xs
                  text-[#D4AF37]
                "
              >
                Lihat Semua
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-[#161616]">
                  <tr>
                    <th className="text-left px-5 py-3 text-gray-600 text-xs">
                      No
                    </th>

                    <th className="text-left px-5 py-3 text-gray-600 text-xs">
                      Kostum
                    </th>

                    <th className="text-left px-5 py-3 text-gray-600 text-xs">
                      Kategori
                    </th>

                    <th className="text-left px-5 py-3 text-gray-600 text-xs">
                      Stok
                    </th>

                    <th className="text-left px-5 py-3 text-gray-600 text-xs">
                      Harga Sewa
                    </th>

                    <th className="text-left px-5 py-3 text-gray-600 text-xs">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {popularCostumes.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="
                          text-center
                          py-12
                          text-gray-600
                          text-sm
                        "
                      >
                        Belum ada data
                        kostum.
                      </td>
                    </tr>
                  ) : (
                    popularCostumes.map(
                      (costume, index) => (
                        <tr
                          key={
                            costume.id_kostum ||
                            index
                          }
                          className="
                            border-t
                            border-white/5
                          "
                        >
                          <td className="px-5 py-4 text-gray-500 text-sm">
                            {index + 1}
                          </td>

                          <td className="px-5 py-4">
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
                                  rounded-lg
                                  bg-[#1D1D1D]
                                  flex
                                  items-center
                                  justify-center
                                  text-[#D4AF37]
                                "
                              >
                                <FaTshirt />
                              </div>

                              <div>
                                <p className="text-sm font-semibold">
                                  {costume.nama_kostum}
                                </p>

                                <p className="text-[10px] text-gray-600 mt-1">
                                  {costume.kode_koleksi ||
                                    costume.id_kostum ||
                                    "-"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-gray-400 text-sm">
                            {costume.nama_kategori ||
                              costume.kategori ||
                              "-"}
                          </td>

                          <td className="px-5 py-4 text-gray-300 text-sm">
                            {costume.stok ?? "-"}
                          </td>

                          <td className="px-5 py-4 text-[#D4AF37] text-sm font-semibold">
                            {formatRupiah(
                              costume.harga_sewa
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <Link
                              to="/petugas/kostum"
                              className="
                                inline-flex
                                items-center
                                gap-2
                                px-4
                                py-2
                                rounded-lg
                                border
                                border-[#D4AF37]/30
                                text-[#D4AF37]
                                text-xs
                              "
                            >
                              Detail
                            </Link>
                          </td>
                        </tr>
                      )
                    )
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* FOOTER */}

          <div
            className="
              flex
              flex-col
              md:flex-row
              items-center
              justify-between
              gap-3
              mt-6
              text-xs
              text-gray-600
            "
          >
            <p>
              Handu Atelier — Area
              Petugas
            </p>

            <p>
              {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default StaffDashboard;