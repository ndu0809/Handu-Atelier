import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  FaHome,
  FaTshirt,
  FaClipboardList,
  FaUser,
  FaCog,
  FaComments,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChevronRight,
} from "react-icons/fa";

import { useState } from "react";

// ======================================================
// USER LAYOUT
// ======================================================

function UserLayout({
  children,
  title = "Dashboard",
  subtitle = "",
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  // ======================================================
  // USER DATA
  // ======================================================

  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

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
  // MENU
  // ======================================================

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
      label: "Chat Petugas",
      to: "/chat",
      icon: FaComments,
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

  // ======================================================
  // ACTIVE MENU
  // ======================================================

  const isActive = (to) => {
    if (to === "/collections") {
      return (
        location.pathname === "/collections" ||
        location.pathname.startsWith("/category")
      );
    }

    return location.pathname === to;
  };

  // ======================================================
  // CLOSE MOBILE MENU WHEN CLICK OUTSIDE
  // ======================================================

  const closeMobileMenu = () => {
    setMenuOpen(false);
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* ==================================================
          GLOBAL STYLE
      ================================================== */}

      <style>
        {`
          .user-layout-scroll {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          .user-layout-scroll::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
          }

          .user-no-scrollbar {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          .user-no-scrollbar::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
          }

          @media (max-width: 1023px) {
            .user-layout-content {
              width: 100%;
              max-width: 100%;
              min-width: 0;
            }
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
          bg-[#111111]/95
          backdrop-blur-xl
          border-b
          border-[#D4AF37]/20
        "
      >
        <div
          className="
            h-[72px]
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
                mt-1
              "
            >
              MEMBER AREA
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
              shrink-0
              rounded-xl
              border
              border-[#D4AF37]/20
              bg-[#121212]
              text-[#D4AF37]
              flex
              items-center
              justify-center
              text-lg
            "
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </header>

      {/* ==================================================
          MOBILE DRAWER
          HANYA MUNCUL SAAT MENU DIBUKA
      ================================================== */}

      {menuOpen && (
        <>
          {/* OVERLAY */}

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

          {/* DRAWER */}

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
                  MEMBER AREA
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
                user-layout-scroll
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
                Menu Member
              </p>

              <nav className="space-y-2">
                {menu.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.to);

                  return (
                    <Link
                      key={item.label}
                      to={item.to}
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
                  text-sm
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
            py-8
            border-b
            border-white/5
            shrink-0
          "
        >
          <p
            className="
              text-2xl
              font-bold
              text-[#D4AF37]
            "
          >
            Handu Atelier
          </p>

          <p
            className="
              text-[9px]
              tracking-[4px]
              text-gray-500
              mt-1
            "
          >
            ELEGANCE FOR EVERY MOMENT
          </p>
        </div>

        {/* MENU */}

        <div
          className="
            flex-1
            min-h-0
            overflow-y-auto
            user-layout-scroll
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
                      text-[9px]
                      opacity-30
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
              rounded-2xl
              bg-[#141414]
              border
              border-[#D4AF37]/10
              p-4
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
                  shrink-0
                "
              >
                {user?.nama?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div className="min-w-0">
                <p
                  className="
                    text-sm
                    font-semibold
                    truncate
                  "
                >
                  {user?.nama || "User"}
                </p>

                <p
                  className="
                    text-[11px]
                    text-gray-500
                    truncate
                  "
                >
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

      {/* ==================================================
          MAIN CONTENT
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
            user-layout-content
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
                Member Area
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
                {user?.nama?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div className="min-w-0">
                <p
                  className="
                    text-sm
                    font-semibold
                    truncate
                    max-w-[180px]
                  "
                >
                  {user?.nama || "User"}
                </p>

                <p className="text-xs text-gray-600">
                  Member
                </p>
              </div>
            </div>
          </div>

          {/* PAGE CONTENT */}

          <div className="min-w-0">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

export default UserLayout;