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
  FaMoneyBillWave,
} from "react-icons/fa";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

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

  const parseResponse = async (
    response,
    endpoint = "API"
  ) => {
    const raw = await response.text();

    if (!response.ok) {
      if (response.status === 530) {
        throw new Error(
          `Tunnel Cloudflare gagal menghubungkan backend untuk ${endpoint} (HTTP 530). Pastikan cloudflared tunnel backend masih berjalan.`
        );
      }

      throw new Error(
        `Gagal mengambil ${endpoint}. HTTP ${response.status}.`
      );
    }

    if (!raw) {
      return {};
    }

    try {
      return JSON.parse(raw);
    } catch {
      throw new Error(
        `Server mengembalikan response yang bukan JSON untuk ${endpoint}.`
      );
    }
  };

  const fetchWithRetry = async (
    url,
    endpoint,
    attempts = 3
  ) => {
    let lastError = null;

    for (
      let attempt = 1;
      attempt <= attempts;
      attempt += 1
    ) {
      try {
        const response = await fetch(url, {
          method: "GET",
          cache: "no-store",
        });

        if (response.ok) {
          return response;
        }

        if (
          response.status !== 530 ||
          attempt === attempts
        ) {
          return response;
        }

        await new Promise((resolve) =>
          setTimeout(resolve, 400 * attempt)
        );
      } catch (err) {
        lastError = err;

        if (attempt === attempts) {
          throw err;
        }

        await new Promise((resolve) =>
          setTimeout(resolve, 400 * attempt)
        );
      }
    }

    throw (
      lastError ||
      new Error("Gagal menghubungi server.")
    );
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
          fetchWithRetry(
            "/kostum",
            "kostum"
          ),
          fetchWithRetry(
            "/users",
            "users"
          ),
          fetchWithRetry(
            "/peminjaman",
            "peminjaman"
          ),
          fetchWithRetry(
            "/pengembalian",
            "pengembalian"
          ),
        ]);

        const [
          kostumResult,
          usersResult,
          peminjamanResult,
          pengembalianResult,
        ] = await Promise.all([
          parseResponse(
            kostumResponse,
            "kostum"
          ),
          parseResponse(
            usersResponse,
            "users"
          ),
          parseResponse(
            peminjamanResponse,
            "peminjaman"
          ),
          parseResponse(
            pengembalianResponse,
            "pengembalian"
          ),
        ]);

        const kostumRows =
          Array.isArray(kostumResult)
            ? kostumResult
            : kostumResult.data;

        setKostumData(
          Array.isArray(kostumRows)
            ? kostumRows
            : []
        );

        const userRows =
          Array.isArray(usersResult)
            ? usersResult
            : usersResult.data;

        const customerRows = (
          Array.isArray(userRows)
            ? userRows
            : []
        ).filter((item) => {
          const role = String(
            item.nama_role || ""
          )
            .trim()
            .toLowerCase();

          return (
            role !== "admin" &&
            role !== "petugas"
          );
        });

        setUserData(customerRows);

        const peminjamanRows =
          Array.isArray(peminjamanResult)
            ? peminjamanResult
            : peminjamanResult.data;

        setPeminjamanData(
          Array.isArray(peminjamanRows)
            ? peminjamanRows
            : []
        );

        const pengembalianRows =
          Array.isArray(
            pengembalianResult
          )
            ? pengembalianResult
            : pengembalianResult.data;

        setPengembalianData(
          Array.isArray(
            pengembalianRows
          )
            ? pengembalianRows
            : []
        );
      } catch (err) {
        console.error(
          "Dashboard error:",
          err
        );

        setError(
          err.message ||
            "Gagal memuat dashboard."
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
    return rupiahFormatter.format(
      Number(value) || 0
    );
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
        month: "short",
        year: "numeric",
      }
    );
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
  // DATA DASHBOARD TERHITUNG
  // ==================================================

  const dashboardStats = useMemo(() => {
    const now = new Date();

    const today = getDateKey(now);

    const year = now.getFullYear();

    const month = now.getMonth();

    const daysInMonth = new Date(
      year,
      month + 1,
      0
    ).getDate();

    const counts =
      Array(daysInMonth).fill(0);

    let active = 0;
    let waiting = 0;
    let completed = 0;
    let todayReturnCount = 0;
    let fineTotal = 0;
    let monthTotal = 0;

    for (const item of peminjamanData) {
      const status = String(
        item.status || ""
      ).toLowerCase();

      if (
        status === "disetujui" ||
        status === "diproses"
      ) {
        active += 1;
      } else if (
        status === "menunggu"
      ) {
        waiting += 1;
      } else if (
        status === "selesai"
      ) {
        completed += 1;
      }

      if (item.tanggal_peminjaman) {
        const date = new Date(
          item.tanggal_peminjaman
        );

        if (
          !Number.isNaN(
            date.getTime()
          ) &&
          date.getFullYear() === year &&
          date.getMonth() === month
        ) {
          monthTotal += 1;

          const day =
            date.getDate();

          if (
            day >= 1 &&
            day <= daysInMonth
          ) {
            counts[day - 1] += 1;
          }
        }
      }
    }

    for (const item of pengembalianData) {
      if (
        item.tanggal_pengembalian &&
        getDateKey(
          item.tanggal_pengembalian
        ) === today
      ) {
        todayReturnCount += 1;
      }

      fineTotal +=
        Number(item.denda) || 0;
    }

    const recentBorrowings =
      [...peminjamanData]
        .sort(
          (a, b) =>
            Number(
              b.id_peminjaman || 0
            ) -
            Number(
              a.id_peminjaman || 0
            )
        )
        .slice(0, 5);

    const recentReturns =
      [...pengembalianData]
        .sort(
          (a, b) =>
            Number(
              b.id_pengembalian || 0
            ) -
            Number(
              a.id_pengembalian || 0
            )
        )
        .slice(0, 5);

    const popularCostumes =
      [...kostumData]
        .sort(
          (a, b) =>
            Number(b.stok || 0) -
            Number(a.stok || 0)
        )
        .slice(0, 5);

    return {
      activeBorrowings: active,

      waitingBorrowings: waiting,

      completedBorrowings:
        completed,

      todayReturns:
        todayReturnCount,

      totalDenda: fineTotal,

      recentBorrowings,

      recentReturns,

      popularCostumes,

      monthlyBorrowingChart: {
        counts,

        daysInMonth,

        maxCount: Math.max(
          ...counts,
          1
        ),
      },

      monthlyBorrowingTotal:
        monthTotal,
    };
  }, [
    kostumData,
    peminjamanData,
    pengembalianData,
  ]);

  const {
    activeBorrowings,
    waitingBorrowings,
    completedBorrowings,
    todayReturns,
    totalDenda,
    recentBorrowings,
    recentReturns,
    popularCostumes,
    monthlyBorrowingChart,
    monthlyBorrowingTotal,
  } = dashboardStats;

  // ==================================================
  // MENU PETUGAS
  // ==================================================

  const menu = useMemo(
    () => [
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
        label: "Pembayaran",
        path: "/petugas/pengaturan-pembayaran",
        icon: FaCreditCard,
      },

      {
        label: "Pembayaran Denda",
        path: "/petugas/pembayaran-denda",
        icon: FaMoneyBillWave,
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
    ],
    []
  );

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
      {/* MOBILE HEADER */}

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

      {/* MOBILE MENU */}

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

      {/* SIDEBAR */}

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
            <div
              className="
                w-11
                h-11
                rounded-xl
                bg-[#D4AF37]/10
                border
                border-[#D4AF37]/20
                flex
                items-center
                justify-center
              "
            >
              <span
                className="
                  text-[#D4AF37]
                  text-xl
                "
              >
                ♛
              </span>
            </div>

            <div>
              <h1
                className="
                  text-lg
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
                "
              >
                PETUGAS
              </p>
            </div>
          </div>
        </div>

        {/* USER */}

        <div
          className="
            px-5
            py-5
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
            <div
              className="
                w-10
                h-10
                rounded-full
                bg-[#D4AF37]
                text-black
                flex
                items-center
                justify-center
                font-bold
              "
            >
              {user?.nama_user
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
                {user?.nama_user ||
                  "Petugas"}
              </p>

              <p
                className="
                  text-[11px]
                  text-gray-500
                  truncate
                "
              >
                {user?.email ||
                  "petugas"}
              </p>
            </div>
          </div>
        </div>

        {/* MENU */}

        <nav
          className="
            flex-1
            px-4
            py-5
            overflow-y-auto
          "
        >
          <p
            className="
              text-[9px]
              tracking-[3px]
              text-gray-600
              uppercase
              px-3
              mb-3
            "
          >
            Menu Utama
          </p>

          <div className="space-y-1">
            {menu.map((item) => {
              const Icon = item.icon;

              const isActive =
                window.location.pathname ===
                item.path;

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`
                    flex
                    items-center
                    gap-3
                    px-3
                    py-3
                    rounded-xl
                    text-sm
                    transition
                    ${
                      isActive
                        ? "bg-[#D4AF37]/10 text-[#D4AF37]"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }
                  `}
                >
                  <Icon
                    className="
                      text-sm
                      flex-shrink-0
                    "
                  />

                  <span className="truncate">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* LOGOUT */}

        <div
          className="
            px-4
            py-5
            border-t
            border-[#D4AF37]/10
          "
        >
          <button
            type="button"
            onClick={handleLogout}
            className="
              w-full
              flex
              items-center
              gap-3
              px-3
              py-3
              rounded-xl
              text-sm
              text-red-400
              hover:bg-red-500/5
              transition
            "
          >
            <FaSignOutAlt />
            Keluar
          </button>
        </div>
      </aside>

      {/* MAIN */}

      <main
        className="
          lg:ml-[245px]
          min-h-screen
        "
      >
        <div
          className="
            max-w-[1600px]
            mx-auto
            px-5
            sm:px-7
            lg:px-10
            py-8
          "
        >
          {/* TOP BAR */}

          <div
            className="
              flex
              flex-col
              md:flex-row
              md:items-center
              md:justify-between
              gap-5
              mb-8
            "
          >
            <div>
              <p
                className="
                  text-[10px]
                  tracking-[4px]
                  text-[#D4AF37]
                  uppercase
                  mb-2
                "
              >
                Dashboard
              </p>

              <h1
                className="
                  text-3xl
                  md:text-4xl
                  font-bold
                "
              >
                Selamat datang kembali,
                <span className="text-[#D4AF37]">
                  {" "}
                  {user?.nama_user ||
                    "Petugas"}
                </span>
              </h1>

              <p
                className="
                  text-gray-500
                  text-sm
                  mt-2
                "
              >
                Kelola aktivitas penyewaan
                kostum Handu Atelier.
              </p>
            </div>

            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  px-4
                  py-3
                  rounded-xl
                  bg-[#111111]
                  border
                  border-[#D4AF37]/15
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <FaCalendarAlt
                    className="
                      text-[#D4AF37]
                      text-sm
                    "
                  />

                  <span
                    className="
                      text-xs
                      text-gray-400
                    "
                  >
                    {new Date().toLocaleDateString(
                      "id-ID",
                      {
                        weekday:
                          "long",
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ERROR */}

          {error && (
            <div
              className="
                mb-6
                rounded-xl
                border
                border-red-500/20
                bg-red-500/5
                px-5
                py-4
                text-red-400
                text-sm
              "
            >
              {error}
            </div>
          )}

          {/* STAT CARDS */}

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              xl:grid-cols-4
              gap-4
              mb-6
            "
          >
            {/* TOTAL KOSTUM */}

            <Link
              to="/petugas/kostum"
              className="
                rounded-2xl
                border
                border-[#D4AF37]/15
                bg-[#111111]
                p-5
                hover:border-[#D4AF37]/40
                transition
              "
            >
              <div
                className="
                  flex
                  items-start
                  justify-between
                "
              >
                <div>
                  <p
                    className="
                      text-gray-500
                      text-sm
                    "
                  >
                    Total Kostum
                  </p>

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
                <span
                  className="
                    text-[#D4AF37]
                    text-xs
                  "
                >
                  Lihat Detail
                </span>

                <FaChevronRight
                  className="
                    text-[#D4AF37]
                    text-xs
                  "
                />
              </div>
            </Link>

            {/* PELANGGAN */}

            <Link
              to="/petugas/customer"
              className="
                rounded-2xl
                border
                border-[#D4AF37]/15
                bg-[#111111]
                p-5
                hover:border-[#D4AF37]/40
                transition
              "
            >
              <div
                className="
                  flex
                  items-start
                  justify-between
                "
              >
                <div>
                  <p
                    className="
                      text-gray-500
                      text-sm
                    "
                  >
                    Pelanggan
                  </p>

                  <p
                    className="
                      text-3xl
                      font-bold
                      text-[#D4AF37]
                      mt-2
                    "
                  >
                    {userData.length}
                  </p>
                </div>

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
                <span
                  className="
                    text-[#D4AF37]
                    text-xs
                  "
                >
                  Lihat Detail
                </span>

                <FaChevronRight
                  className="
                    text-[#D4AF37]
                    text-xs
                  "
                />
              </div>
            </Link>

            {/* PEMINJAMAN AKTIF */}

            <Link
              to="/petugas/peminjaman"
              className="
                rounded-2xl
                border
                border-[#D4AF37]/15
                bg-[#111111]
                p-5
                hover:border-[#D4AF37]/40
                transition
              "
            >
              <div
                className="
                  flex
                  items-start
                  justify-between
                "
              >
                <div>
                  <p
                    className="
                      text-gray-500
                      text-sm
                    "
                  >
                    Peminjaman Aktif
                  </p>

                  <p
                    className="
                      text-3xl
                      font-bold
                      text-[#D4AF37]
                      mt-2
                    "
                  >
                    {activeBorrowings}
                  </p>
                </div>

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
                <span
                  className="
                    text-[#D4AF37]
                    text-xs
                  "
                >
                  Disetujui + Diproses
                </span>

                <FaChevronRight
                  className="
                    text-[#D4AF37]
                    text-xs
                  "
                />
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
              <div
                className="
                  flex
                  items-start
                  justify-between
                "
              >
                <div>
                  <p
                    className="
                      text-gray-500
                      text-sm
                    "
                  >
                    Menunggu Tindakan
                  </p>

                  <p
                    className="
                      text-3xl
                      font-bold
                      text-yellow-400
                      mt-2
                    "
                  >
                    {waitingBorrowings}
                  </p>
                </div>

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
                <span
                  className="
                    text-yellow-400
                    text-xs
                  "
                >
                  Perlu tindakan
                </span>

                <FaChevronRight
                  className="
                    text-yellow-400
                    text-xs
                  "
                />
              </div>
            </Link>
          </div>

          {/* SECONDARY STATISTICS */}

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-4
              mb-6
            "
          >
            {/* SELESAI */}

            <div
              className="
                rounded-2xl
                border
                border-green-500/10
                bg-[#111111]
                p-5
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
                  <p
                    className="
                      text-gray-500
                      text-sm
                    "
                  >
                    Selesai
                  </p>

                  <p
                    className="
                      text-2xl
                      font-bold
                      text-green-400
                      mt-2
                    "
                  >
                    {completedBorrowings}
                  </p>
                </div>

                <FaCheckCircle
                  className="
                    text-green-400
                    text-2xl
                  "
                />
              </div>
            </div>

            {/* PENGEMBALIAN HARI INI */}

            <div
              className="
                rounded-2xl
                border
                border-blue-500/10
                bg-[#111111]
                p-5
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
                  <p
                    className="
                      text-gray-500
                      text-sm
                    "
                  >
                    Pengembalian Hari Ini
                  </p>

                  <p
                    className="
                      text-2xl
                      font-bold
                      text-blue-400
                      mt-2
                    "
                  >
                    {todayReturns}
                  </p>
                </div>

                <FaUndoAlt
                  className="
                    text-blue-400
                    text-2xl
                  "
                />
              </div>
            </div>

            {/* TOTAL DENDA */}

            <div
              className="
                rounded-2xl
                border
                border-red-500/10
                bg-[#111111]
                p-5
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
                  <p
                    className="
                      text-gray-500
                      text-sm
                    "
                  >
                    Total Denda
                  </p>

                  <p
                    className="
                      text-xl
                      font-bold
                      text-red-400
                      mt-2
                    "
                  >
                    {formatRupiah(
                      totalDenda
                    )}
                  </p>
                </div>

                <FaMoneyBillWave
                  className="
                    text-red-400
                    text-2xl
                  "
                />
              </div>
            </div>

            {/* PEMINJAMAN BULAN INI */}

            <div
              className="
                rounded-2xl
                border
                border-purple-500/10
                bg-[#111111]
                p-5
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
                  <p
                    className="
                      text-gray-500
                      text-sm
                    "
                  >
                    Peminjaman Bulan Ini
                  </p>

                  <p
                    className="
                      text-2xl
                      font-bold
                      text-purple-400
                      mt-2
                    "
                  >
                    {monthlyBorrowingTotal}
                  </p>
                </div>

                <FaChartLine
                  className="
                    text-purple-400
                    text-2xl
                  "
                />
              </div>
            </div>
          </div>

          {/* GRAFIK + PEMINJAMAN TERBARU */}

          <div
            className="
              grid
              grid-cols-1
              xl:grid-cols-3
              gap-5
              mb-6
            "
          >
            {/* GRAFIK */}

            <section
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
                  <FaChartLine
                    className="
                      text-[#D4AF37]
                    "
                  />

                  <div>
                    <h2
                      className="
                        text-lg
                        font-semibold
                      "
                    >
                      Grafik Peminjaman
                    </h2>

                    <p
                      className="
                        text-xs
                        text-gray-600
                        mt-1
                      "
                    >
                      Aktivitas peminjaman
                      bulan ini
                    </p>
                  </div>
                </div>

                <span
                  className="
                    text-xs
                    text-gray-500
                  "
                >
                  {monthlyBorrowingTotal} total
                </span>
              </div>

              <div
                className="
                  h-[260px]
                  flex
                  items-end
                  gap-1
                  overflow-x-auto
                  pb-7
                  relative
                "
              >
                {monthlyBorrowingChart.counts.map(
                  (count, index) => {
                    const height =
                      Math.max(
                        (count /
                          monthlyBorrowingChart.maxCount) *
                          100,
                        count > 0
                          ? 8
                          : 2
                      );

                    return (
                      <div
                        key={index}
                        className="
                          flex-1
                          min-w-[10px]
                          h-full
                          flex
                          items-end
                          group
                          relative
                        "
                      >
                        <div
                          className="
                            absolute
                            bottom-full
                            left-1/2
                            -translate-x-1/2
                            mb-2
                            hidden
                            group-hover:block
                            bg-black
                            border
                            border-[#D4AF37]/20
                            rounded-lg
                            px-2
                            py-1
                            text-[10px]
                            text-white
                            whitespace-nowrap
                            z-10
                          "
                        >
                          {index + 1}:{" "}
                          {count}
                        </div>

                        <div
                          className="
                            w-full
                            rounded-t-md
                            bg-[#D4AF37]/70
                            hover:bg-[#D4AF37]
                            transition
                          "
                          style={{
                            height: `${height}%`,
                          }}
                        />
                      </div>
                    );
                  }
                )}

                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    flex
                    justify-between
                    text-[9px]
                    text-gray-700
                  "
                >
                  <span>1</span>
                  <span>5</span>
                  <span>10</span>
                  <span>15</span>
                  <span>20</span>
                  <span>25</span>
                  <span>
                    {
                      monthlyBorrowingChart.daysInMonth
                    }
                  </span>
                </div>
              </div>
            </section>

            {/* PEMINJAMAN TERBARU */}

            <section
              className="
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
                  <FaCalendarAlt
                    className="
                      text-[#D4AF37]
                    "
                  />

                  <h2
                    className="
                      text-lg
                      font-semibold
                    "
                  >
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

              <div
                className="
                  divide-y
                  divide-white/5
                "
              >
                {recentBorrowings.length ===
                0 ? (
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
                  recentBorrowings.map(
                    (item) => (
                      <Link
                        key={
                          item.id_peminjaman
                        }
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
                              border
                              border-[#D4AF37]/10
                              flex
                              items-center
                              justify-center
                              flex-shrink-0
                            "
                          >
                            <FaClipboardList
                              className="
                                text-[#D4AF37]
                              "
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p
                              className="
                                text-sm
                                font-medium
                                truncate
                              "
                            >
                              Peminjaman #
                              {
                                item.id_peminjaman
                              }
                            </p>

                            <p
                              className="
                                text-[11px]
                                text-gray-600
                                mt-1
                                truncate
                              "
                            >
                              {item.nama_user ||
                                "Pelanggan"}
                            </p>
                          </div>

                          <div className="text-right">
                            <span
                              className={`
                                inline-flex
                                px-2
                                py-1
                                rounded-full
                                text-[9px]
                                ${getStatusClass(
                                  item.status
                                )}
                              `}
                            >
                              {item.status ||
                                "-"}
                            </span>

                            <p
                              className="
                                text-[9px]
                                text-gray-600
                                mt-1
                              "
                            >
                              {formatTanggal(
                                item.tanggal_peminjaman
                              )}
                            </p>
                          </div>
                        </div>
                      </Link>
                    )
                  )
                )}
              </div>
            </section>
          </div>

          {/* PENGEMBALIAN TERBARU */}

          <section
            className="
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
                <FaUndoAlt className="text-green-400" />

                <h2
                  className="
                    text-lg
                    font-semibold
                  "
                >
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
              <table
                className="
                  w-full
                  min-w-[850px]
                "
              >
                <thead
                  className="
                    bg-[#161616]
                  "
                >
                  <tr>
                    <th
                      className="
                        text-left
                        px-5
                        py-3
                        text-gray-600
                        text-xs
                      "
                    >
                      ID
                    </th>

                    <th
                      className="
                        text-left
                        px-5
                        py-3
                        text-gray-600
                        text-xs
                      "
                    >
                      Peminjaman
                    </th>

                    <th
                      className="
                        text-left
                        px-5
                        py-3
                        text-gray-600
                        text-xs
                      "
                    >
                      User
                    </th>

                    <th
                      className="
                        text-left
                        px-5
                        py-3
                        text-gray-600
                        text-xs
                      "
                    >
                      Tanggal
                    </th>

                    <th
                      className="
                        text-left
                        px-5
                        py-3
                        text-gray-600
                        text-xs
                      "
                    >
                      Kondisi
                    </th>

                    <th
                      className="
                        text-left
                        px-5
                        py-3
                        text-gray-600
                        text-xs
                      "
                    >
                      Denda
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentReturns.length ===
                  0 ? (
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
                    recentReturns.map(
                      (item) => (
                        <tr
                          key={
                            item.id_pengembalian
                          }
                          className="
                            border-t
                            border-white/5
                          "
                        >
                          <td
                            className="
                              px-5
                              py-4
                              text-[#D4AF37]
                              font-semibold
                            "
                          >
                            #
                            {
                              item.id_pengembalian
                            }
                          </td>

                          <td
                            className="
                              px-5
                              py-4
                            "
                          >
                            #
                            {
                              item.id_peminjaman
                            }
                          </td>

                          <td
                            className="
                              px-5
                              py-4
                            "
                          >
                            {item.nama_user ||
                              "-"}
                          </td>

                          <td
                            className="
                              px-5
                              py-4
                              text-gray-300
                            "
                          >
                            {formatTanggal(
                              item.tanggal_pengembalian
                            )}
                          </td>

                          <td
                            className="
                              px-5
                              py-4
                            "
                          >
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
                              {item.kondisi_baju ||
                                "-"}
                            </span>
                          </td>

                          <td
                            className="
                              px-5
                              py-4
                              text-[#D4AF37]
                              font-semibold
                            "
                          >
                            {formatRupiah(
                              item.denda
                            )}
                          </td>
                        </tr>
                      )
                    )
                  )}
                </tbody>
              </table>
            </div>
          </section>
                    {/* KOLEKSI KOSTUM */}

          <section
            className="
              rounded-2xl
              border
              border-[#D4AF37]/15
              bg-[#111111]
              p-5
              mt-6
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
                <div
                  className="
                    w-10
                    h-10
                    rounded-xl
                    bg-[#D4AF37]/10
                    border
                    border-[#D4AF37]/10
                    flex
                    items-center
                    justify-center
                  "
                >
                  <FaTshirt
                    className="
                      text-[#D4AF37]
                    "
                  />
                </div>

                <div>
                  <h2
                    className="
                      text-lg
                      font-semibold
                    "
                  >
                    Koleksi Kostum
                  </h2>

                  <p
                    className="
                      text-xs
                      text-gray-600
                      mt-1
                    "
                  >
                    Ringkasan koleksi kostum
                    yang tersedia
                  </p>
                </div>
              </div>

              <Link
                to="/petugas/kostum"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-4
                  py-2
                  rounded-lg
                  border
                  border-[#D4AF37]/20
                  text-[#D4AF37]
                  text-xs
                  hover:bg-[#D4AF37]/10
                  transition
                "
              >
                Kelola Kostum

                <FaChevronRight
                  className="
                    text-[10px]
                  "
                />
              </Link>
            </div>

            {popularCostumes.length ===
            0 ? (
              <div
                className="
                  py-12
                  text-center
                  text-gray-600
                  text-sm
                "
              >
                Belum ada data kostum.
              </div>
            ) : (
              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  lg:grid-cols-3
                  xl:grid-cols-5
                  gap-4
                "
              >
                {popularCostumes.map(
                  (item, index) => (
                    <div
                      key={
                        item.id_kostum ||
                        item.id ||
                        index
                      }
                      className="
                        rounded-xl
                        overflow-hidden
                        border
                        border-white/5
                        bg-[#0D0D0D]
                        hover:border-[#D4AF37]/20
                        transition
                      "
                    >
                      <div
                        className="
                          h-36
                          bg-[#171717]
                          overflow-hidden
                          relative
                        "
                      >
                        {item.gambar ||
                        item.image ||
                        item.foto ? (
                          <img
                            src={
                              item.gambar ||
                              item.image ||
                              item.foto
                            }
                            alt={
                              item.nama_kostum ||
                              item.nama ||
                              "Kostum"
                            }
                            className="
                              w-full
                              h-full
                              object-cover
                            "
                            loading="lazy"
                          />
                        ) : (
                          <div
                            className="
                              w-full
                              h-full
                              flex
                              items-center
                              justify-center
                            "
                          >
                            <FaTshirt
                              className="
                                text-4xl
                                text-gray-700
                              "
                            />
                          </div>
                        )}

                        <div
                          className="
                            absolute
                            top-3
                            right-3
                            px-2
                            py-1
                            rounded-full
                            bg-black/70
                            text-[9px]
                            text-[#D4AF37]
                          "
                        >
                          #{index + 1}
                        </div>
                      </div>

                      <div className="p-4">
                        <p
                          className="
                            text-sm
                            font-semibold
                            truncate
                          "
                        >
                          {item.nama_kostum ||
                            item.nama ||
                            "Kostum"}
                        </p>

                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            gap-3
                            mt-3
                          "
                        >
                          <span
                            className="
                              text-[11px]
                              text-gray-500
                            "
                          >
                            Stok
                          </span>

                          <span
                            className="
                              text-xs
                              font-semibold
                              text-[#D4AF37]
                            "
                          >
                            {item.stok ??
                              item.jumlah_stok ??
                              0}
                          </span>
                        </div>

                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            gap-3
                            mt-2
                          "
                        >
                          <span
                            className="
                              text-[11px]
                              text-gray-500
                            "
                          >
                            Harga
                          </span>

                          <span
                            className="
                              text-xs
                              text-gray-300
                            "
                          >
                            {formatRupiah(
                              item.harga ||
                                item.harga_sewa ||
                                0
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </section>

          {/* RINGKASAN AKTIVITAS */}

          <section
            className="
              grid
              grid-cols-1
              lg:grid-cols-2
              gap-5
              mt-6
            "
          >
            {/* AKTIVITAS PEMINJAMAN */}

            <div
              className="
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
                  <div
                    className="
                      w-10
                      h-10
                      rounded-xl
                      bg-blue-500/10
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <FaClipboardList
                      className="
                        text-blue-400
                      "
                    />
                  </div>

                  <div>
                    <h2
                      className="
                        text-lg
                        font-semibold
                      "
                    >
                      Ringkasan Peminjaman
                    </h2>

                    <p
                      className="
                        text-xs
                        text-gray-600
                      "
                    >
                      Status transaksi saat ini
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="
                  space-y-3
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    p-4
                    rounded-xl
                    bg-yellow-500/5
                    border
                    border-yellow-500/10
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <span
                      className="
                        w-2
                        h-2
                        rounded-full
                        bg-yellow-400
                      "
                    />

                    <span
                      className="
                        text-sm
                        text-gray-300
                      "
                    >
                      Menunggu
                    </span>
                  </div>

                  <span
                    className="
                      font-bold
                      text-yellow-400
                    "
                  >
                    {waitingBorrowings}
                  </span>
                </div>

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    p-4
                    rounded-xl
                    bg-blue-500/5
                    border
                    border-blue-500/10
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <span
                      className="
                        w-2
                        h-2
                        rounded-full
                        bg-blue-400
                      "
                    />

                    <span
                      className="
                        text-sm
                        text-gray-300
                      "
                    >
                      Aktif
                    </span>
                  </div>

                  <span
                    className="
                      font-bold
                      text-blue-400
                    "
                  >
                    {activeBorrowings}
                  </span>
                </div>

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    p-4
                    rounded-xl
                    bg-green-500/5
                    border
                    border-green-500/10
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <span
                      className="
                        w-2
                        h-2
                        rounded-full
                        bg-green-400
                      "
                    />

                    <span
                      className="
                        text-sm
                        text-gray-300
                      "
                    >
                      Selesai
                    </span>
                  </div>

                  <span
                    className="
                      font-bold
                      text-green-400
                    "
                  >
                    {completedBorrowings}
                  </span>
                </div>
              </div>
            </div>

            {/* AKTIVITAS PENGEMBALIAN */}

            <div
              className="
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
                  <div
                    className="
                      w-10
                      h-10
                      rounded-xl
                      bg-green-500/10
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <FaUndoAlt
                      className="
                        text-green-400
                      "
                    />
                  </div>

                  <div>
                    <h2
                      className="
                        text-lg
                        font-semibold
                      "
                    >
                      Pengembalian
                    </h2>

                    <p
                      className="
                        text-xs
                        text-gray-600
                      "
                    >
                      Aktivitas pengembalian
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="
                  grid
                  grid-cols-2
                  gap-3
                "
              >
                <div
                  className="
                    rounded-xl
                    bg-[#0D0D0D]
                    border
                    border-white/5
                    p-4
                  "
                >
                  <p
                    className="
                      text-xs
                      text-gray-600
                    "
                  >
                    Hari Ini
                  </p>

                  <p
                    className="
                      text-2xl
                      font-bold
                      text-green-400
                      mt-2
                    "
                  >
                    {todayReturns}
                  </p>
                </div>

                <div
                  className="
                    rounded-xl
                    bg-[#0D0D0D]
                    border
                    border-white/5
                    p-4
                  "
                >
                  <p
                    className="
                      text-xs
                      text-gray-600
                    "
                  >
                    Total Data
                  </p>

                  <p
                    className="
                      text-2xl
                      font-bold
                      text-[#D4AF37]
                      mt-2
                    "
                  >
                    {pengembalianData.length}
                  </p>
                </div>
              </div>

              <div
                className="
                  mt-4
                  rounded-xl
                  border
                  border-red-500/10
                  bg-red-500/5
                  p-4
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >
                  <span
                    className="
                      text-xs
                      text-gray-500
                    "
                  >
                    Total denda tercatat
                  </span>

                  <span
                    className="
                      text-sm
                      font-semibold
                      text-red-400
                    "
                  >
                    {formatRupiah(
                      totalDenda
                    )}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* QUICK ACTION */}

          <section
            className="
              rounded-2xl
              border
              border-[#D4AF37]/15
              bg-[#111111]
              p-5
              mt-6
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
                mb-5
              "
            >
              <div
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-[#D4AF37]/10
                  flex
                  items-center
                  justify-center
                "
              >
                <FaChartLine
                  className="
                    text-[#D4AF37]
                  "
                />
              </div>

              <div>
                <h2
                  className="
                    text-lg
                    font-semibold
                  "
                >
                  Akses Cepat
                </h2>

                <p
                  className="
                    text-xs
                    text-gray-600
                    mt-1
                  "
                >
                  Menu yang sering digunakan
                </p>
              </div>
            </div>

            <div
              className="
                grid
                grid-cols-2
                md:grid-cols-3
                xl:grid-cols-6
                gap-3
              "
            >
              <Link
                to="/petugas/peminjaman"
                className="
                  rounded-xl
                  bg-[#0D0D0D]
                  border
                  border-white/5
                  p-4
                  hover:border-[#D4AF37]/30
                  hover:bg-[#D4AF37]/5
                  transition
                  group
                "
              >
                <FaClipboardList
                  className="
                    text-[#D4AF37]
                    mb-3
                  "
                />

                <p
                  className="
                    text-sm
                    font-medium
                    group-hover:text-[#D4AF37]
                  "
                >
                  Peminjaman
                </p>
              </Link>

              <Link
                to="/petugas/pengembalian"
                className="
                  rounded-xl
                  bg-[#0D0D0D]
                  border
                  border-white/5
                  p-4
                  hover:border-[#D4AF37]/30
                  hover:bg-[#D4AF37]/5
                  transition
                  group
                "
              >
                <FaUndoAlt
                  className="
                    text-green-400
                    mb-3
                  "
                />

                <p
                  className="
                    text-sm
                    font-medium
                    group-hover:text-[#D4AF37]
                  "
                >
                  Pengembalian
                </p>
              </Link>

              <Link
                to="/petugas/kostum"
                className="
                  rounded-xl
                  bg-[#0D0D0D]
                  border
                  border-white/5
                  p-4
                  hover:border-[#D4AF37]/30
                  hover:bg-[#D4AF37]/5
                  transition
                  group
                "
              >
                <FaTshirt
                  className="
                    text-[#D4AF37]
                    mb-3
                  "
                />

                <p
                  className="
                    text-sm
                    font-medium
                    group-hover:text-[#D4AF37]
                  "
                >
                  Koleksi Kostum
                </p>
              </Link>

              <Link
                to="/petugas/customer"
                className="
                  rounded-xl
                  bg-[#0D0D0D]
                  border
                  border-white/5
                  p-4
                  hover:border-[#D4AF37]/30
                  hover:bg-[#D4AF37]/5
                  transition
                  group
                "
              >
                <FaUsers
                  className="
                    text-blue-400
                    mb-3
                  "
                />

                <p
                  className="
                    text-sm
                    font-medium
                    group-hover:text-[#D4AF37]
                  "
                >
                  Customer
                </p>
              </Link>

              <Link
                to="/petugas/chat"
                className="
                  rounded-xl
                  bg-[#0D0D0D]
                  border
                  border-white/5
                  p-4
                  hover:border-[#D4AF37]/30
                  hover:bg-[#D4AF37]/5
                  transition
                  group
                "
              >
                <FaComments
                  className="
                    text-purple-400
                    mb-3
                  "
                />

                <p
                  className="
                    text-sm
                    font-medium
                    group-hover:text-[#D4AF37]
                  "
                >
                  Chat
                </p>
              </Link>

              <Link
                to="/petugas/profile"
                className="
                  rounded-xl
                  bg-[#0D0D0D]
                  border
                  border-white/5
                  p-4
                  hover:border-[#D4AF37]/30
                  hover:bg-[#D4AF37]/5
                  transition
                  group
                "
              >
                <FaUserCircle
                  className="
                    text-gray-400
                    mb-3
                  "
                />

                <p
                  className="
                    text-sm
                    font-medium
                    group-hover:text-[#D4AF37]
                  "
                >
                  Profil
                </p>
              </Link>
            </div>
          </section>

          {/* FOOTER */}

          <footer
            className="
              mt-10
              pt-6
              border-t
              border-white/5
              flex
              flex-col
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-3
              text-xs
              text-gray-600
            "
          >
            <p>
              © {new Date().getFullYear()}{" "}
              Handu Atelier
            </p>

            <p>
              Dashboard Petugas
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default StaffDashboard;