import {
  HiOutlineSparkles,
  HiOutlineUserGroup,
  HiOutlineBuildingStorefront,
  HiOutlineShieldCheck,
} from "react-icons/hi2";

import heroImage from "../../assets/images/costumes/suntiang-pariaman.jpeg";

function About() {
  const stats = [
    {
      icon: HiOutlineBuildingStorefront,
      number: "35+",
      title: "Koleksi Kostum",
    },
    {
      icon: HiOutlineUserGroup,
      number: "1000+",
      title: "Pelanggan",
    },
    {
      icon: HiOutlineShieldCheck,
      number: "100%",
      title: "Kostum Terawat",
    },
    {
      icon: HiOutlineSparkles,
      number: "4.9★",
      title: "Rating Pelanggan",
    },
  ];

  return (
    <section
      id="about"
      className="py-24 px-6 md:px-8"
    >
      <div className="max-w-7xl mx-auto">

        {/* Heading */}

        <div className="text-center mb-16">

          <p className="uppercase tracking-[6px] text-[#D4AF37] text-sm">
            About Us
          </p>

          <h2 className="text-4xl md:text-5xl font-bold mt-4">
            Mengenal
            <span className="text-[#D4AF37]">
              {" "}Handu Atelier
            </span>
          </h2>

        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* FOTO */}

          <div className="relative">

            <div
              className="
                absolute
                -inset-3
                rounded-3xl
                bg-[#D4AF37]/20
                blur-3xl
              "
            ></div>

            <img
              src={heroImage}
              alt="Handu Atelier"
              className="
                relative
                rounded-3xl
                w-full
                h-137.5
                object-cover
                border
                border-[#D4AF37]/20
              "
            />

          </div>

          {/* KANAN */}

          <div>

            <h3 className="text-4xl font-bold leading-tight">

              Elegance For Every Moment

            </h3>

            <p className="mt-8 text-gray-400 leading-9">

              Handu Atelier hadir sebagai penyedia jasa penyewaan
              kostum premium yang menawarkan berbagai pilihan
              kostum tradisional, modern, formal, hingga klasik
              untuk berbagai acara seperti wisuda, pesta,
              pemotretan, pertunjukan, maupun acara adat.

            </p>

            <p className="mt-6 text-gray-400 leading-9">

              Kami percaya bahwa setiap momen spesial layak
              dikenang dengan penampilan terbaik. Oleh karena
              itu seluruh koleksi kami dirawat secara berkala,
              dibersihkan setelah digunakan, serta diperiksa
              kualitasnya sebelum disewakan kembali kepada
              pelanggan.

            </p>

            {/* Statistik */}

            <div className="grid grid-cols-2 gap-6 mt-12">

              {stats.map((item, index) => {

                const Icon = item.icon;

                return (

                  <div
                    key={index}
                    className="
                      rounded-3xl
                      bg-[#141414]
                      border
                      border-[#D4AF37]/20
                      p-6
                      hover:border-[#D4AF37]
                      hover:-translate-y-2
                      hover:shadow-[0_15px_35px_rgba(212,175,55,.20)]
                      transition-all
                      duration-300
                    "
                  >

                    <Icon
                      className="
                        w-10
                        h-10
                        text-[#D4AF37]
                        mb-5
                      "
                    />

                    <h4 className="text-4xl font-bold text-[#D4AF37]">

                      {item.number}

                    </h4>

                    <p className="text-gray-400 mt-3">

                      {item.title}

                    </p>

                  </div>

                );

              })}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default About;