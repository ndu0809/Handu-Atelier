import {
  LuCrown,
  LuShieldCheck,
  LuCalendarCheck,
  LuBadgeDollarSign,
} from "react-icons/lu";

function Features() {
  const features = [
    {
      title: "Kostum Premium",
      description:
        "Berbagai pilihan kostum berkualitas tinggi dengan desain elegan.",
      icon: LuCrown,
    },
    {
      title: "Bersih & Terawat",
      description:
        "Seluruh kostum dicuci dan diperiksa sebelum disewakan.",
      icon: LuShieldCheck,
    },
    {
      title: "Reservasi Mudah",
      description:
        "Proses pemesanan cepat melalui website.",
      icon: LuCalendarCheck,
    },
    {
      title: "Harga Terjangkau",
      description:
        "Pilihan paket sesuai kebutuhan pelanggan.",
      icon: LuBadgeDollarSign,
    },
  ];

  return (
    <section
      id="features"
      className="py-20 md:py-28 px-6 md:px-8"
    >
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-14 md:mb-16">

          <p className="uppercase tracking-[4px] md:tracking-[6px] text-[#D4AF37] mb-4 text-sm">
            Why Choose Us
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Mengapa Memilih
            <span className="text-[#D4AF37]">
              {" "}Handu Atelier?
            </span>
          </h2>

          <p className="text-gray-400 mt-6 max-w-2xl mx-auto leading-7 md:leading-8 text-sm md:text-base">
            Kami menghadirkan pengalaman penyewaan kostum yang nyaman,
            berkualitas, dan terpercaya untuk setiap momen spesial Anda.
          </p>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">

          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="
                  p-6
                  md:p-8
                  rounded-3xl
                  border
                  border-[#D4AF37]/20
                  bg-[#141414]
                  hover:border-[#D4AF37]
                  hover:-translate-y-2
                  hover:shadow-[0_15px_35px_rgba(212,175,55,.15)]
                  duration-300
                "
              >

                <div className="mb-5">
                  <Icon className="w-10 h-10 md:w-12 md:h-12 text-[#D4AF37]" />
                </div>

                <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">
                  {item.title}
                </h3>

                <p className="text-gray-400 leading-7 md:leading-8 text-sm md:text-base">
                  {item.description}
                </p>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}

export default Features;