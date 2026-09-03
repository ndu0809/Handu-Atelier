import { Link } from "react-router-dom";
import ImageCard from "../common/ImageCard";
import heroImage from "../../assets/images/hero.jpeg";

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-32 md:pt-40 pb-20 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 w-125 h-125 bg-[#D4AF37]/20 rounded-full blur-[180px]"></div>

      <div className="absolute bottom-0 right-0 w-100 h-100 bg-yellow-500/10 rounded-full blur-[180px]"></div>

      <div
        className="
          max-w-7xl
          mx-auto
          w-full
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-16
          items-center
          px-6
          md:px-8
          relative
          z-10
        "
      >

        {/* ================= LEFT ================= */}

        <div>

          {/* Badge */}

          <div
            className="
              inline-flex
              items-center
              gap-3
              px-5
              py-2
              rounded-full
              border
              border-[#D4AF37]/30
              bg-[#D4AF37]/10
              backdrop-blur-xl
            "
          >

            <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>

            <span className="text-[#D4AF37] text-sm">
              👑 Premium Costume Rental
            </span>

          </div>

          {/* Welcome */}

          <p
            className="
              mt-10
              uppercase
              tracking-[8px]
              text-[#D4AF37]
            "
          >
            Welcome To
          </p>

          {/* Ornament */}

          <div className="flex items-center gap-4 mt-6">

            <div className="w-16 h-px bg-[#D4AF37]"></div>

            <div className="w-3 h-3 rounded-full bg-[#D4AF37]"></div>

            <div className="w-16 h-px bg-[#D4AF37]"></div>

          </div>

          {/* Heading */}

          <h1
            className="
              mt-8
              font-serif
              font-bold
              leading-none
            "
          >

            <span className="block text-5xl md:text-7xl lg:text-8xl">

              Handu 

            </span>

            <span
              className="
                block
                text-5xl
                md:text-7xl
                lg:text-8xl
                text-[#D4AF37]
                mt-2
              "
            >

              Atelier

            </span>

          </h1>

          {/* Subtitle */}

          <h2
            className="
              mt-10
              text-2xl
              md:text-3xl
              text-gray-300
            "
          >
            Elegance For Every Moment
          </h2>

          {/* Description */}

          <p
            className="
              mt-8
              max-w-xl
              text-gray-400
              leading-9
              text-lg
            "
          >
            Temukan berbagai koleksi kostum premium untuk acara adat,
            wisuda, pesta, pertunjukan, hingga pemotretan.
            Handu Atelier menghadirkan pengalaman penyewaan kostum
            yang elegan, mudah, dan terpercaya.
          </p>

          {/* Button */}

          <div className="flex flex-col sm:flex-row gap-5 mt-12">

            <Link
              to="/#collections"
              className="
                px-10
                py-5
                rounded-full
                bg-[#D4AF37]
                text-black
                font-semibold
                hover:scale-105
                hover:shadow-[0_10px_35px_rgba(212,175,55,.45)]
                duration-300
                text-center
              "
            >
              Jelajahi Koleksi
            </Link>

            <Link
              to="/#how-to-rent"
              className="
                px-10
                py-5
                rounded-full
                border
                border-[#D4AF37]
                text-[#D4AF37]
                hover:bg-[#D4AF37]
                hover:text-black
                duration-300
                text-center
              "
            >
              Cara Penyewaan
            </Link>

          </div>

          {/* Statistik */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-16">

            <div
              className="
                rounded-2xl
                border
                border-[#D4AF37]/20
                bg-[#141414]/70
                backdrop-blur-xl
                p-6
                hover:border-[#D4AF37]
                hover:-translate-y-2
                hover:shadow-[0_15px_35px_rgba(212,175,55,.2)]
                transition-all
                duration-300
              "
            >

              <h3 className="text-4xl font-bold text-[#D4AF37]">
                250+
              </h3>

              <p className="text-gray-400 mt-2">
                Koleksi Premium
              </p>

            </div>

            <div
              className="
                rounded-2xl
                border
                border-[#D4AF37]/20
                bg-[#141414]/70
                backdrop-blur-xl
                p-6
                hover:border-[#D4AF37]
                hover:-translate-y-2
                hover:shadow-[0_15px_35px_rgba(212,175,55,.2)]
                transition-all
                duration-300
              "
            >

              <h3 className="text-4xl font-bold text-[#D4AF37]">
                1000+
              </h3>

              <p className="text-gray-400 mt-2">
                Pelanggan Puas
              </p>

            </div>

            <div
              className="
                rounded-2xl
                border
                border-[#D4AF37]/20
                bg-[#141414]/70
                backdrop-blur-xl
                p-6
                hover:border-[#D4AF37]
                hover:-translate-y-2
                hover:shadow-[0_15px_35px_rgba(212,175,55,.2)]
                transition-all
                duration-300
                col-span-2
                md:col-span-1
              "
            >

              <h3 className="text-4xl font-bold text-[#D4AF37]">
                4.9★
              </h3>

              <p className="text-gray-400 mt-2">
                Rating Pelanggan
              </p>

            </div>

          </div>

        </div>

        {/* ================= RIGHT ================= */}

        <div className="relative flex items-center justify-center mt-10 lg:mt-0">

          {/* Glow */}

          <div
            className="
              absolute
              w-80
              h-80
              sm:w-105
              sm:h-105
              lg:w-140
              lg:h-140
              rounded-full
              bg-[#D4AF37]/20
              blur-[150px]
            "
          ></div>

          {/* Floating Card */}

          <div
            className="
              absolute
              bottom-6
              left-1/2
              -translate-x-1/2
              lg:left-0
              lg:-translate-x-10
              z-20
              w-64
              rounded-2xl
              bg-black/70
              backdrop-blur-xl
              border
              border-[#D4AF37]/20
              p-5
              shadow-xl
            "
          >

            <p className="text-[#D4AF37] text-sm">
              Kostum Terpopuler
            </p>

            <h3 className="text-xl font-semibold mt-2">
              Adat Minangkabau
            </h3>

            <p className="text-gray-400 mt-2 text-sm">
              Premium Collection
            </p>

          </div>

          {/* Image */}

          <div className="relative z-10">

            <ImageCard
              src={heroImage}
              alt="Handu Atelier"
              variant="hero"
            />

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;