function CostumeGallery({ costume }) {
  return (
    <div
      className="
        overflow-hidden
        rounded-3xl
        border
        border-[#D4AF37]/20
        bg-[#141414]
        shadow-[0_20px_60px_rgba(0,0,0,.35)]
      "
    >
      <img
        src={costume.image}
        alt={costume.collectionName}
        className="
          w-full
          h-100
          sm:h-125
          md:h-150
          lg:h-175
          object-cover
          object-top
          transition-transform
          duration-700
          hover:scale-105
        "
      />
    </div>
  );
}

export default CostumeGallery;