function CostumeDescription({ costume }) {
  return (
    <div
      className="
        mt-10
        rounded-3xl
        border
        border-[#D4AF37]/20
        bg-[#141414]
        p-6
        md:p-8
      "
    >
      <h3
        className="
          text-2xl
          md:text-3xl
          font-bold
          mb-6
        "
      >
        Deskripsi
      </h3>

      <p
        className="
          text-gray-400
          leading-7
          md:leading-8
          text-sm
          md:text-base
        "
      >
        Kostum{" "}
        <span className="text-white font-semibold">
          {costume.collectionName}
        </span>{" "}
        merupakan koleksi premium Handu Atelier yang selalu
        dirawat secara berkala sehingga tetap bersih,
        rapi, dan siap digunakan untuk berbagai acara.
      </p>

      <div className="mt-8 space-y-4">

        <div className="flex items-start gap-3">
          <span className="text-[#D4AF37]">✔</span>

          <p className="text-gray-300">
            Kondisi kostum bersih dan siap digunakan.
          </p>
        </div>

        <div className="flex items-start gap-3">
          <span className="text-[#D4AF37]">✔</span>

          <p className="text-gray-300">
            Kualitas premium dengan perawatan rutin.
          </p>
        </div>

        <div className="flex items-start gap-3">
          <span className="text-[#D4AF37]">✔</span>

          <p className="text-gray-300">
            Cocok digunakan untuk acara formal,
            pesta, wisuda maupun pemotretan.
          </p>
        </div>

        <div className="flex items-start gap-3">
          <span className="text-[#D4AF37]">✔</span>

          <p className="text-gray-300">
            Disarankan melakukan reservasi sebelum hari acara.
          </p>
        </div>

      </div>
    </div>
  );
}

export default CostumeDescription;