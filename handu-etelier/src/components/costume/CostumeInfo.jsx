function CostumeInfo({ costume }) {
  return (
    <>

      {/* Kode */}
      <p
        className="
          uppercase
          tracking-[4px]
          md:tracking-[6px]
          text-[#D4AF37]
          text-sm
          md:text-base
        "
      >
        {costume.code}
      </p>

      {/* Nama Kostum */}
      <h1
        className="
          text-3xl
          sm:text-4xl
          lg:text-5xl
          font-bold
          mt-3
          leading-tight
        "
      >
        {costume.collectionName}
      </h1>

      {/* Badge Premium */}
      {costume.featured && (
        <div
          className="
            inline-flex
            items-center
            mt-5
            px-4
            py-2
            md:px-5
            rounded-full
            bg-[#D4AF37]
            text-black
            text-sm
            md:text-base
            font-semibold
          "
        >
          ⭐ Premium Collection
        </div>
      )}

      {/* Jenis Kostum */}
      <p
        className="
          text-gray-400
          text-lg
          md:text-xl
          mt-5
        "
      >
        {costume.costumeType}
      </p>

      {/* Harga */}
      <h2
        className="
          text-[#D4AF37]
          text-3xl
          sm:text-4xl
          lg:text-5xl
          font-bold
          mt-8
          md:mt-10
        "
      >
        Rp {costume.price.toLocaleString("id-ID")}
      </h2>

    </>
  );
}

export default CostumeInfo;