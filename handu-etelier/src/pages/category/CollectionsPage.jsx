import { Link, useNavigate } from "react-router-dom";

import {
  FaTshirt,
  FaCrown,
  FaStar,
  FaUserTie,
  FaArrowLeft,
} from "react-icons/fa";

function CollectionsPage() {
  const navigate = useNavigate();

  const collections = [
    {
      slug: "traditional",
      title: "Tradisional",
      subtitle: "Warisan Budaya",
      description:
        "Koleksi busana tradisional dengan karakter budaya Nusantara yang elegan dan berkelas.",
      icon: FaCrown,
      image:
        "/src/assets/images/costumes/tingkuluak-tanduak.jpeg",
    },
    {
      slug: "modern",
      title: "Modern",
      subtitle: "Modern Elegance",
      description:
        "Koleksi modern untuk berbagai acara dengan desain elegan, stylish, dan contemporary.",
      icon: FaTshirt,
      image:
        "/src/assets/images/costumes/dress-awards-hijab.jpeg",
    },
    {
      slug: "classic",
      title: "Classic",
      subtitle: "Timeless Beauty",
      description:
        "Koleksi klasik dengan nuansa vintage dan elegansi yang tetap menarik sepanjang masa.",
      icon: FaStar,
      image:
        "/src/assets/images/costumes/bridgerton-kostum.jpeg",
    },
    {
      slug: "formal",
      title: "Formal",
      subtitle: "Formal Attire",
      description:
        "Pilihan busana formal yang sophisticated untuk acara resmi dan momen istimewa.",
      icon: FaUserTie,
      image:
        "/src/assets/images/costumes/tuxedo.jpeg",
    },
  ];

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        className="
          border-b
          border-[#D4AF37]/20
          bg-[#111111]
        "
      >
        <div
          className="
            max-w-6xl
            mx-auto
            px-6
            py-7
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
                text-[#D4AF37]
                text-xs
                uppercase
                tracking-[4px]
              "
            >
              Handu Atelier
            </p>

            <h1
              className="
                text-3xl
                md:text-4xl
                font-bold
                mt-2
              "
            >
              Koleksi Kostum
            </h1>

            <p
              className="
                text-gray-500
                mt-2
              "
            >
              Pilih koleksi yang ingin Anda lihat.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              px-5
              py-3
              rounded-xl
              border
              border-[#D4AF37]/20
              text-[#D4AF37]
              hover:bg-[#D4AF37]/10
              transition
              w-fit
            "
          >
            <FaArrowLeft />
            Kembali
          </button>
        </div>
      </header>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main
        className="
          max-w-6xl
          mx-auto
          px-6
          py-12
        "
      >
        {/* INTRO */}

        <section className="text-center mb-12">
          <p
            className="
              text-[#D4AF37]
              uppercase
              tracking-[5px]
              text-xs
            "
          >
            Explore Our Collections
          </p>

          <h2
            className="
              text-3xl
              md:text-5xl
              font-bold
              mt-4
            "
          >
            Temukan Koleksi Anda
          </h2>

          <p
            className="
              max-w-2xl
              mx-auto
              text-gray-500
              mt-5
              leading-7
            "
          >
            Jelajahi empat kategori utama Handu
            Atelier dan temukan kostum yang sesuai
            dengan kebutuhan acara Anda.
          </p>
        </section>

        {/* =====================================================
            COLLECTION GRID
        ===================================================== */}

        <section
          className="
            grid
            sm:grid-cols-2
            gap-6
          "
        >
          {collections.map((collection) => {
            const Icon = collection.icon;

            return (
              <Link
                key={collection.slug}
                to={`/category/${collection.slug}`}
                className="
                  group
                  relative
                  min-h-115
                  rounded-3xl
                  overflow-hidden
                  border
                  border-[#D4AF37]/20
                  bg-[#141414]
                "
              >
                {/* IMAGE */}

                <img
                  src={collection.image}
                  alt={collection.title}
                  className="
                    absolute
                    inset-0
                    w-full
                    h-full
                    object-cover
                    object-top
                    opacity-55
                    group-hover:scale-105
                    transition
                    duration-700
                  "
                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";
                  }}
                />

                {/* OVERLAY */}

                <div
                  className="
                    absolute
                    inset-0
                    bg-linear-to-t
                    from-black
                    via-black/65
                    to-black/10
                  "
                />

                {/* CONTENT */}

                <div
                  className="
                    relative
                    z-10
                    h-full
                    min-h-115
                    flex
                    flex-col
                    justify-end
                    p-7
                    md:p-9
                  "
                >
                  {/* ICON */}

                  <div
                    className="
                      w-14
                      h-14
                      rounded-2xl
                      bg-[#D4AF37]/15
                      border
                      border-[#D4AF37]/30
                      text-[#D4AF37]
                      flex
                      items-center
                      justify-center
                      text-xl
                      mb-5
                    "
                  >
                    <Icon />
                  </div>

                  <p
                    className="
                      text-[#D4AF37]
                      text-xs
                      uppercase
                      tracking-[4px]
                    "
                  >
                    {collection.subtitle}
                  </p>

                  <h3
                    className="
                      text-3xl
                      md:text-4xl
                      font-bold
                      mt-2
                    "
                  >
                    {collection.title}
                  </h3>

                  <p
                    className="
                      text-gray-400
                      mt-4
                      leading-6
                      max-w-lg
                    "
                  >
                    {collection.description}
                  </p>

                  <div
                    className="
                      mt-6
                      inline-flex
                      items-center
                      justify-between
                      gap-4
                      text-[#D4AF37]
                      font-semibold
                    "
                  >
                    <span>
                      Lihat Koleksi
                    </span>

                    <span
                      className="
                        text-xl
                        group-hover:translate-x-2
                        transition
                      "
                    >
                      →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </section>
      </main>
    </div>
  );
}

export default CollectionsPage;