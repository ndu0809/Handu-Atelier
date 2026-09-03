import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import { FaCheckCircle } from "react-icons/fa";

function BorrowSuccess() {
  return (
    <div className="min-h-screen bg-[#090909] text-white">

      <Navbar />

      <section className="pt-36 pb-20 px-6">

        <div className="max-w-3xl mx-auto">

          <div
            className="
              bg-[#141414]
              border
              border-[#D4AF37]/20
              rounded-3xl
              p-10
              text-center
            "
          >

            <FaCheckCircle
              className="
                text-green-400
                text-7xl
                mx-auto
              "
            />

            <h1
              className="
                text-5xl
                font-bold
                mt-8
              "
            >
              Peminjaman Berhasil
            </h1>

            <p
              className="
                text-gray-400
                mt-6
                leading-8
              "
            >
              Terima kasih telah melakukan
              pengajuan peminjaman kostum
              di Handu Atelier.
            </p>

            <div
              className="
                mt-10
                rounded-2xl
                bg-[#1D1D1D]
                p-6
              "
            >

              <div className="flex justify-between">

                <span>Kode Peminjaman</span>

                <span className="text-[#D4AF37] font-bold">
                  HD-2026-001
                </span>

              </div>

              <div className="flex justify-between mt-5">

                <span>Status</span>

                <span className="text-yellow-400">
                  Menunggu Konfirmasi
                </span>

              </div>

            </div>

            <p className="mt-8 text-gray-400">

              Admin akan segera
              menghubungi Anda
              melalui WhatsApp.

            </p>

            <div className="flex gap-5 mt-10">

              <Link
                to="/dashboard"
                className="
                  flex-1
                  bg-[#D4AF37]
                  text-black
                  py-4
                  rounded-xl
                  font-semibold
                  text-center
                "
              >
                Dashboard
              </Link>

              <Link
                to="/"
                className="
                  flex-1
                  border
                  border-[#D4AF37]
                  text-[#D4AF37]
                  py-4
                  rounded-xl
                  text-center
                "
              >
                Beranda
              </Link>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default BorrowSuccess;