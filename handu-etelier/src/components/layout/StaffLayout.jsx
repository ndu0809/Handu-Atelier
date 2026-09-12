import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  FaHome,
  FaClipboardList,
  FaUndoAlt,
  FaTshirt,
  FaUsers,
  FaComments,
  FaUserCircle,
  FaCreditCard,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChevronRight,
} from "react-icons/fa";

import { useState } from "react";

// ======================================================
// STAFF LAYOUT
// ======================================================

function StaffLayout({
  children,
  title = "Dashboard",
  subtitle = "",
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  // ======================================================
  // USER
  // ======================================================

  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  // ======================================================
  // MENU
  // ======================================================

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

  // ======================================================
  // ACTIVE MENU
  // ======================================================

  const isActive = (path) => {
    if (path === "/collections") {
      return (
        location.pathname === "/collections" ||
        location.pathname.startsWith("/category")
      );
    }

    return location.pathname === path;
  };

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    navigate("/login", {
      replace: true,
    });
  };

  // ======================================================
  // CLOSE MOBILE
  // ======================================================

  const closeMobileMenu = () => {
    setMenuOpen(false);
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <style>
        {`
          .staff-layout-scroll {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          .staff-layout-scroll::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
          }
        `}
      </style>

      {/* ==================================================
          MOBILE HEADER
      ================================================== */}

      <header
        className="
          lg:hidden
          sticky
          top-0
          z-[60]
          h-[72px]
          bg-[#111111]/95
          backdrop-blur-xl
          border-b
          border-[#D4AF37]/20
        "
      >
        <div
          className="
            h-full
            px-4
            sm:px-5
            flex
            items-center
            justify-between
          "
        >
          <div className="min-w-0">
            <p
              className="
                text-lg
                font-bold
                text-[#D4AF37]
                truncate
              "
            >
              Handu Atelier
            </p>

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

          <button
            type="button"
            onClick={() => setMenuOpen((previous) => !previous)}
            aria-label={
              menuOpen
                ? "Tutup menu"
                : "Buka menu"
            }
            className="
              w-10
              h-10
              rounded-xl
              border
              border-[#D4AF37]/20
              bg-[#121212]
              text-[#D4AF37]
              flex
              items-center
              justify-center
            "
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </header>

      {/* ==================================================
          MOBILE DRAWER
      ================================================== */}

      {menuOpen && (
        <>
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={closeMobileMenu}
            className="
              fixed
              inset-0
              z-40
              bg-black/60
              lg:hidden
            "
          />

          <aside
            className="
              fixed
              top-0
              left-0
              bottom-0
              z-50
              w-[min(320px,88vw)]
              bg-[#0E0E0E]
              border-r
              border-[#D4AF37]/15
              lg:hidden
              flex
              flex-col
              shadow-2xl
            "
          >
            <div
              className="
                h-[72px]
                px-5
                border-b
                border-white/5
                flex
                items-center
                justify-between
                shrink-0
              "
            >
              <div>
                <p
                  className="
                    text-lg
                    font-bold
                    text-[#D4AF37]
                  "
                >
                  Handu Atelier
                </p>

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

              <button
                type="button"
                onClick={closeMobileMenu}
                className="
                  w-9
                  h-9
                  rounded-xl
                  border
                  border-white/10
                  text-gray-400
                  flex
                  items-center
                  justify-center
                "
              >
                <FaTimes />
              </button>
            </div>

            <div
              className="
                flex-1
                min-h-0
                overflow-y-auto
                staff-layout-scroll
                px-4
                py-6
              "
            >
              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-[3px]
                  text-gray-600
                  px-3
                  mb-4
                "
              >
                Menu Utama
              </p>

              <nav className="space-y-2">
                {menu.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <Link
                      key={item.label}
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={`
                        flex
                        items-center
                        justify-between
                        px-4
                        py-3.5
                        rounded-xl
                        border
                        transition
                        ${
                          active
                            ? "bg-[#D4AF37]/15 border-[#D4AF37]/30 text-[#D4AF37]"
                            : "bg-[#121212] border-white/5 text-gray-400"
                        }
                      `}
                    >
                      <div
                        className="
                          flex
                          items-center
                          gap-4
                          min-w-0
                        "
                      >
                        <Icon className="shrink-0" />

                        <span className="text-sm truncate">
                          {item.label}
                        </span>
                      </div>

                      <FaChevronRight
                        className="
                          text-[10px]
                          opacity-40
                          shrink-0
                        "
                      />
                    </Link>
                  );
                })}
              </nav>

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
                  mt-6
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
            </div>
          </aside>
        </>
      )}

      {/* ==================================================
          DESKTOP SIDEBAR
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
          border-[#D4AF37]/15
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
            border-white/5
            shrink-0
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
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
            overflow-y-auto
            staff-layout-scroll
            px-3
            py-7
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
              const active = isActive(item.path);

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
                      min-w-0
                    "
                  >
                    <Icon className="shrink-0" />

                    <span className="text-sm truncate">
                      {item.label}
                    </span>
                  </div>

                  <FaChevronRight
                    className="
                      text-[10px]
                      opacity-40
                      shrink-0
                    "
                  />
                </Link>
              );
            })}
          </nav>

          <div
            className="
              mt-8
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
                mb-3
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
              "
            >
              <FaSignOutAlt />

              <span className="text-sm">
                Keluar
              </span>
            </button>
          </div>
        </div>

        {/* PROFILE */}

        <div
          className="
            p-4
            border-t
            border-white/5
            shrink-0
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
                  shrink-0
                "
              >
                {user?.nama?.charAt(0)?.toUpperCase() || "P"}
              </div>

              <div className="min-w-0">
                <p
                  className="
                    text-sm
                    font-semibold
                    truncate
                  "
                >
                  {user?.nama || "Petugas"}
                </p>

                <p
                  className="
                    text-[11px]
                    text-gray-500
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
          min-w-0
        "
      >
        <div
          className="
            max-w-[1450px]
            mx-auto
            px-4
            sm:px-5
            md:px-8
            py-5
            sm:py-7
          "
        >
          {/* PAGE HEADER */}

          <div
            className="
              flex
              flex-col
              md:flex-row
              md:items-center
              md:justify-between
              gap-4
              mb-6
              sm:mb-8
            "
          >
            <div className="min-w-0">
              <p
                className="
                  uppercase
                  tracking-[4px]
                  text-[#D4AF37]
                  text-[10px]
                  sm:text-xs
                "
              >
                Area Petugas
              </p>

              <h1
                className="
                  text-2xl
                  sm:text-3xl
                  md:text-4xl
                  font-bold
                  mt-2
                  truncate
                "
              >
                {title}
              </h1>

              {subtitle && (
                <p
                  className="
                    text-gray-500
                    text-sm
                    mt-2
                    max-w-2xl
                  "
                >
                  {subtitle}
                </p>
              )}
            </div>

            <div
              className="
                hidden
                md:flex
                items-center
                gap-3
                shrink-0
              "
            >
              <div
                className="
                  w-11
                  h-11
                  rounded-full
                  border
                  border-[#D4AF37]/30
                  bg-[#D4AF37]/10
                  text-[#D4AF37]
                  flex
                  items-center
                  justify-center
                  font-bold
                "
              >
                {user?.nama?.charAt(0)?.toUpperCase() || "P"}
              </div>

              <div>
                <p className="text-sm font-semibold">
                  {user?.nama || "Petugas"}
                </p>

                <p className="text-xs text-gray-600">
                  Petugas
                </p>
              </div>
            </div>
          </div>

          {/* CONTENT */}

          <div className="min-w-0">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

export default StaffLayout;