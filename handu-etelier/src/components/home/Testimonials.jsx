import { HiStar } from "react-icons/hi2";

function Testimonials() {
  const testimonials = [
    {
      name: "Aisyah Putri",
      event: "Wisuda",
      review:
        "Kostumnya sangat bersih, ukurannya pas, dan pelayanannya sangat ramah. Sangat puas menyewa di Handu Atelier.",
    },
    {
      name: "Dinda Maharani",
      event: "Pernikahan",
      review:
        "Pilihan kostumnya banyak dan kualitasnya premium. Proses penyewaannya juga sangat mudah.",
    },
    {
      name: "Rara Amelia",
      event: "Pemotretan",
      review:
        "Saya sangat suka karena kostumnya wangi, rapi, dan terlihat seperti baru. Recommended sekali.",
    },
  ];

  return (
    <section
      id="testimonials"
      className="py-20 md:py-28 px-6 md:px-8"
    >
      <div className="max-w-7xl mx-auto">

        {/* Heading */}

        <div className="text-center mb-16">

          <p className="uppercase tracking-[6px] text-[#D4AF37] text-sm">
            Testimonials
          </p>

          <h2 className="text-3xl md:text-5xl font-bold mt-4">
            Apa Kata
            <span className="text-[#D4AF37]">
              {" "}Pelanggan Kami
            </span>
          </h2>

          <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
            Kepuasan pelanggan merupakan prioritas utama Handu Atelier.
          </p>

        </div>

        {/* Cards */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {testimonials.map((item, index) => (

            <div
              key={index}
              className="
                rounded-3xl
                border
                border-[#D4AF37]/20
                bg-[#141414]
                p-8
                hover:border-[#D4AF37]
                duration-300
              "
            >

              <div className="flex gap-1 text-[#D4AF37] mb-6">

                <HiStar />
                <HiStar />
                <HiStar />
                <HiStar />
                <HiStar />

              </div>

              <p className="text-gray-300 leading-8 italic">
                "{item.review}"
              </p>

              <div className="mt-8">

                <h3 className="font-semibold text-xl">
                  {item.name}
                </h3>

                <p className="text-[#D4AF37] text-sm mt-2">
                  {item.event}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}

export default Testimonials;