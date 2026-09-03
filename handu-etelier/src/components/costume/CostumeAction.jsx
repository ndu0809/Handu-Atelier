import { Link } from "react-router-dom";

function CostumeAction({ costume }) {
  return (
    <div
      className="
        flex
        flex-col
        sm:flex-row
        gap-4
        mt-10
        md:mt-14
      "
    >
      {/* Tombol Pinjam */}
      <Link
        to={`/borrow/${costume.code}`}
        className="
          w-full
          sm:flex-1
          bg-[#D4AF37]
          text-black
          py-4
          rounded-xl
          text-center
          font-semibold
          hover:scale-[1.02]
          duration-300
          shadow-[0_10px_30px_rgba(212,175,55,.25)]
        "
      >
        Pinjam Sekarang
      </Link>

      {/* Tombol Kembali */}
      <Link
        to={`/category/${costume.category}`}
        className="
          w-full
          sm:flex-1
          border
          border-[#D4AF37]
          text-[#D4AF37]
          py-4
          rounded-xl
          text-center
          font-semibold
          hover:bg-[#D4AF37]
          hover:text-black
          duration-300
        "
      >
        Kembali ke Koleksi
      </Link>
    </div>
  );
}

export default CostumeAction;