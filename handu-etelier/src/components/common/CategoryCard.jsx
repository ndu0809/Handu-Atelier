import { Link } from "react-router-dom";

function CategoryCard({
  title,
  image,
  description,
  totalCostume,
  button,
  slug,
}) {
  return (
    <div
      className="
        group
        overflow-hidden
        rounded-3xl
        border
        border-[#D4AF37]/20
        bg-[#141414]
        transition-all
        duration-500
        hover:-translate-y-3
        hover:border-[#D4AF37]
        hover:shadow-[0_20px_60px_rgba(212,175,55,.18)]
      "
    >
      {/* Gambar */}
      <div className="overflow-hidden h-56 sm:h-64 lg:h-72">

        <img
          src={image}
          alt={title}
          className="
            w-full
            h-full
            object-cover
            transition-transform
            duration-700
            group-hover:scale-110
          "
        />

      </div>

      {/* Isi */}
      <div className="p-5 md:p-7">

        <h3
          className="
            text-2xl
            md:text-3xl
            font-serif
            text-white
          "
        >
          {title}
        </h3>

        <p className="mt-2 text-[#D4AF37] font-medium text-sm md:text-base">
          {totalCostume} Kostum
        </p>

        <p
          className="
            mt-5
            text-gray-400
            leading-7
            md:leading-8
            text-sm
            md:text-base
          "
        >
          {description}
        </p>

        <Link
          to={`/category/${slug}`}
          className="
            block
            mt-8
            w-full
            rounded-full
            bg-[#D4AF37]
            py-3
            md:py-4
            text-center
            font-semibold
            text-black
            transition
            duration-300
            hover:scale-[1.02]
          "
        >
          {button}
        </Link>

      </div>
    </div>
  );
}

export default CategoryCard;