function ImageCard({ src, alt, variant = "hero" }) {
  const variants = {
    hero: {
      width:
        "w-full max-w-[320px] sm:max-w-[380px] md:max-w-[450px] lg:max-w-[520px]",
      height:
        "h-105 sm:h-125 md:h-150 lg:h-170",
    },

    collection: {
      width:
        "w-full max-w-[280px] sm:max-w-[320px]",
      height:
        "h-95 sm:h-105",
    },

    thumbnail: {
      width: "w-28",
      height: "h-28",
    },
  };

  const size = variants[variant];

  return (
    <div
      className={`
        relative
        ${size.width}
        ${size.height}
        overflow-hidden
        rounded-4xl
        border
        border-[#D4AF37]/20
        bg-linear-to-b
        from-[#2D2214]
        to-black
        shadow-[0_25px_80px_rgba(0,0,0,.6)]
      `}
    >
      {/* Ornament */}
      <div className="absolute top-6 right-6 w-20 h-20 md:w-24 md:h-24 rounded-full border border-[#D4AF37]/20"></div>

      <div className="absolute bottom-8 left-8 w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#D4AF37]/30"></div>

      {/* Image */}
      <img
        src={src}
        alt={alt}
        className="
          w-full
          h-full
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

export default ImageCard;