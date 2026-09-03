import {
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowUp,
} from "react-icons/fa";

function Footer() {
  return (
    <footer
      id="footer"
      className="
        relative
        mt-24
        border-t
        border-[#D4AF37]/20
        bg-[#090909]
        overflow-hidden
      "
    >
      {/* Background Glow */}

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-125 h-125 bg-[#D4AF37]/10 blur-[180px] rounded-full"></div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-8 py-20">

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Logo */}

          <div>

            <h2 className="text-3xl font-bold text-[#D4AF37]">

              Handu Atelier

            </h2>

            <p className="mt-5 text-gray-400 leading-8">

              Penyedia jasa penyewaan kostum premium
              untuk wisuda, adat, pesta,
              pemotretan dan berbagai acara spesial.

            </p>

          </div>

          {/* Navigasi */}

          <div>

            <h3 className="text-xl font-semibold text-white mb-6">

              Navigasi

            </h3>

            <ul className="space-y-4 text-gray-400">

              <li><a href="/">Beranda</a></li>

              <li><a href="/#about">Tentang Kami</a></li>

              <li><a href="/#featured">Koleksi</a></li>

              <li><a href="/#footer">Kontak</a></li>

            </ul>

          </div>

          {/* Kontak */}

          <div>

            <h3 className="text-xl font-semibold text-white mb-6">

              Hubungi Kami

            </h3>

            <div className="space-y-5">

              <div className="flex gap-3">

                <FaWhatsapp className="text-[#D4AF37] mt-1"/>

                <span className="text-gray-400">

                  +62 812-3456-7890

                </span>

              </div>

              <div className="flex gap-3">

                <FaEnvelope className="text-[#D4AF37] mt-1"/>

                <span className="text-gray-400">

                  handuatelier@gmail.com

                </span>

              </div>

              <div className="flex gap-3">

                <FaMapMarkerAlt className="text-[#D4AF37] mt-1"/>

                <span className="text-gray-400">

                  Padang, Sumatera Barat

                </span>

              </div>

            </div>

          </div>

          {/* Sosial */}

          <div>

            <h3 className="text-xl font-semibold text-white mb-6">

              Ikuti Kami

            </h3>

            <div className="flex gap-5">

              <a
                href="#"
                className="
                  w-12
                  h-12
                  rounded-full
                  border
                  border-[#D4AF37]/20
                  flex
                  items-center
                  justify-center
                  hover:bg-[#D4AF37]
                  hover:text-black
                  duration-300
                "
              >
                <FaInstagram/>
              </a>

              <a
                href="#"
                className="
                  w-12
                  h-12
                  rounded-full
                  border
                  border-[#D4AF37]/20
                  flex
                  items-center
                  justify-center
                  hover:bg-[#D4AF37]
                  hover:text-black
                  duration-300
                "
              >
                <FaWhatsapp/>
              </a>

            </div>

          </div>

        </div>

        {/* Bottom */}

        <div
          className="
            mt-16
            pt-8
            border-t
            border-[#D4AF37]/10
            flex
            flex-col
            md:flex-row
            justify-between
            items-center
            gap-6
          "
        >

          <p className="text-gray-500 text-center">

            © 2026 Handu Atelier.
            All Rights Reserved.

          </p>

          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="
              w-12
              h-12
              rounded-full
              bg-[#D4AF37]
              text-black
              flex
              items-center
              justify-center
              hover:scale-110
              duration-300
            "
          >

            <FaArrowUp/>

          </button>

        </div>

      </div>

    </footer>
  );
}

export default Footer;