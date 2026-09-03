import {
  HiOutlineSparkles,
  HiOutlineClipboardDocumentList,
  HiOutlineCheckCircle,
  HiOutlineTruck,
  HiOutlineArrowRight,
} from "react-icons/hi2";

function HowToRent() {
  const steps = [
    {
      icon: HiOutlineSparkles,
      title: "Pilih Kostum",
      description:
        "Temukan kostum favorit sesuai kebutuhan acara Anda.",
    },
    {
      icon: HiOutlineClipboardDocumentList,
      title: "Lihat Detail",
      description:
        "Periksa ukuran, harga, stok, dan informasi kostum.",
    },
    {
      icon: HiOutlineCheckCircle,
      title: "Isi Form",
      description:
        "Lengkapi formulir peminjaman dengan data yang benar.",
    },
    {
      icon: HiOutlineTruck,
      title: "Konfirmasi",
      description:
        "Admin akan menghubungi Anda untuk konfirmasi penyewaan.",
    },
  ];

  return (
    <section
      id="how-to-rent"
      className="py-20 md:py-28 px-6 md:px-8"
    >
      <div className="max-w-7xl mx-auto">

        {/* Heading */}

        <div className="text-center mb-16">

          <p className="uppercase tracking-[6px] text-[#D4AF37] text-sm">
            Cara Penyewaan
          </p>

          <h2 className="text-3xl md:text-5xl font-bold mt-4">
            Menyewa Kostum
            <span className="text-[#D4AF37]">
              {" "}Hanya 4 Langkah
            </span>
          </h2>

          <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
            Kami membuat proses penyewaan kostum menjadi mudah,
            cepat, dan nyaman untuk semua pelanggan.
          </p>

        </div>

        {/* Step */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">

          {steps.map((item, index) => {
            const Icon = item.icon;

            return (

              <div
                key={index}
                className="
                  relative
                  rounded-3xl
                  bg-[#141414]
                  border
                  border-[#D4AF37]/20
                  p-8
                  hover:border-[#D4AF37]
                  duration-300
                "
              >

                {/* Nomor */}

                <div
                  className="
                    absolute
                    top-6
                    right-6
                    text-5xl
                    font-bold
                    text-[#D4AF37]/15
                  "
                >
                  0{index + 1}
                </div>

                {/* Icon */}

                <div
                  className="
                    w-16
                    h-16
                    rounded-2xl
                    bg-[#D4AF37]/10
                    flex
                    items-center
                    justify-center
                    mb-8
                  "
                >
                  <Icon className="w-8 h-8 text-[#D4AF37]" />
                </div>

                {/* Title */}

                <h3 className="text-2xl font-semibold">
                  {item.title}
                </h3>

                {/* Description */}

                <p className="text-gray-400 leading-8 mt-5">
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

export default HowToRent;