import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaTshirt,
  FaClipboardList,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChevronRight,
} from "react-icons/fa";
import { useState } from "react";

function UserLayout({ children, title, subtitle }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    navigate("/login", {
      replace: true,
    });
  };

  const menu = [
    {
      label: "Dashboard",
      to: "/dashboard",
      icon: FaHome,
    },
    {
      label: "Koleksi Kostum",
      to: "/collections",
      icon: FaTshirt,
    },
    {
      label: "Peminjaman Saya",
      to: "/my-borrowings",
      icon: FaClipboardList,
    },
    {
      label: "Profil",
      to: "/profile",
      icon: FaUser,
    },
    {
      label: "Pengaturan",
      to: "/settings",
      icon: FaCog,
    },
  ];

  const isActive = (to) => {
    if (to === "/collections") {
      return (
        location.pathname === "/collections" ||
        location.pathname.startsWith("/category")
      );
    }

    return location.pathname === to;
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* ================= MOBILE HEADER ================= */}

      <header
        className="
          lg:hidden
          sticky
          top-0
          z-50
          bg-[#111111]/95
          backdrop-blur-xl
          border-b
          border-[#D4AF37]/20
        "
      >
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-[#D4AF37]">
              Handu Atelier
            </p>

            <p className="text-[9px] tracking-[3px] text-gray-500">
              MEMBER AREA
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-[#D4AF37] text-xl"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </header>

      {/* ================= MOBILE MENU ================= */}

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
              const active = isActive(item.to);

              return (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={`
                    flex
                    items-center
                    justify-between
                    px-5
                    py-4
                    rounded-2xl
                    border
                    transition
                    ${
                      active
                        ? "bg-[#D4AF37]/15 border-[#D4AF37]/30 text-[#D4AF37]"
                        : "bg-[#121212] border-white/5 text-gray-400"
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    <Icon />
                    <span>{item.label}</span>
                  </div>

                  <FaChevronRight className="text-xs opacity-40" />
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
                rounded-2xl
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

      {/* ================= SIDEBAR ================= */}

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
          border-[#D4AF37]/15
          flex-col
          z-40
        "
      >
        <div className="px-6 py-8 border-b border-white/5">
          <p className="text-2xl font-bold text-[#D4AF37]">
            Handu Atelier
          </p>

          <p className="text-[9px] tracking-[4px] text-gray-500 mt-1">
            ELEGANCE FOR EVERY MOMENT
          </p>
        </div>

        <div className="flex-1 px-3 py-7 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-[3px] text-gray-600 px-4 mb-4">
            Menu Member
          </p>

          <nav className="space-y-1">
            {menu.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);

              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`
                    flex
                    items-center
                    justify-between
                    px-4
                    py-3.5
                    rounded-xl
                    transition
                    ${
                      active
                        ? "bg-gradient-to-r from-[#D4AF37]/25 to-transparent text-[#F1C75B]"
                        : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    <Icon />
                    <span className="text-sm">
                      {item.label}
                    </span>
                  </div>

                  <FaChevronRight className="text-[9px] opacity-30" />
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-[10px] uppercase tracking-[3px] text-gray-600 px-4 mb-3">
              Akses Cepat
            </p>

            <Link
              to="/"
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
              <FaHome />
              <span className="text-sm">
                Beranda
              </span>
            </Link>
          </div>
        </div>

        <div className="p-4 border-t border-white/5">
          <div className="rounded-2xl bg-[#141414] border border-[#D4AF37]/10 p-4">
            <div className="flex items-center gap-3">
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
                {user?.nama?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">
                  {user?.nama || "User"}
                </p>

                <p className="text-[11px] text-gray-500 truncate">
                  {user?.email || ""}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="
                w-full
                mt-4
                py-2.5
                rounded-xl
                border
                border-red-500/20
                bg-red-500/5
                text-red-400
                text-sm
              "
            >
              Keluar
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MAIN ================= */}

      <main className="lg:ml-[245px] min-h-screen">
        <div className="max-w-[1450px] mx-auto px-5 md:px-8 py-7">
          {/* PAGE HEADER */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
            <div>
              <p className="uppercase tracking-[4px] text-[#D4AF37] text-xs">
                Member Area
              </p>

              <h1 className="text-3xl md:text-4xl font-bold mt-2">
                {title}
              </h1>

              {subtitle && (
                <p className="text-gray-500 mt-2">
                  {subtitle}
                </p>
              )}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <div className="w-11 h-11 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center font-bold">
                {user?.nama?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div>
                <p className="text-sm font-semibold">
                  {user?.nama || "User"}
                </p>

                <p className="text-xs text-gray-600">
                  Member
                </p>
              </div>
            </div>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}

export default UserLayout;