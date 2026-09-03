import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

import Navbar from "../../components/layout/Navbar";
import heroImage from "../../assets/images/hero.jpeg";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    confirmPassword: "",
    no_hp: "",
    alamat: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.nama.trim()) {
      setError("Nama lengkap wajib diisi.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email wajib diisi.");
      return;
    }

    if (!formData.password) {
      setError("Password wajib diisi.");
      return;
    }

    if (formData.password.length < 6) {
      setError(
        "Password minimal terdiri dari 6 karakter."
      );
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError(
        "Konfirmasi password tidak sesuai."
      );
      return;
    }

    if (!formData.no_hp.trim()) {
      setError("Nomor HP wajib diisi.");
      return;
    }

    if (!formData.alamat.trim()) {
      setError("Alamat wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      /*
       * PENTING:
       * Ganti angka 3 di bawah dengan id_role
       * yang benar untuk role "User" di database.
       */
      const ID_ROLE_USER = 3;

      const data = {
        nama: formData.nama.trim(),
        email: formData.email.trim(),
        password: formData.password,
        no_hp: formData.no_hp.trim(),
        alamat: formData.alamat.trim(),
        id_role: ID_ROLE_USER,
      };

      console.log("Data registrasi:", data);

      const response = await fetch("/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      console.log(
        "Register response:",
        result
      );

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Registrasi gagal."
        );
      }

      setSuccess(
        "Registrasi berhasil. Mengarahkan ke halaman login..."
      );

      setFormData({
        nama: "",
        email: "",
        password: "",
        confirmPassword: "",
        no_hp: "",
        alamat: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.error(
        "Register error:",
        err
      );

      setError(
        err.message ||
          "Terjadi kesalahan saat registrasi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090909] text-white">

      <Navbar />

      <section className="pt-36 pb-20 px-6">

        <div className="max-w-6xl mx-auto">

          <div
            className="
              grid
              lg:grid-cols-2
              overflow-hidden
              rounded-3xl
              border
              border-[#D4AF37]/20
              bg-[#141414]
            "
          >

            {/* IMAGE */}

            <div className="hidden lg:block relative">

              <img
                src={heroImage}
                alt="Handu Atelier"
                className="
                  w-full
                  h-full
                  object-cover
                "
              />

              <div className="absolute inset-0 bg-black/40" />

              <div className="absolute bottom-10 left-10">

                <h2 className="text-4xl font-bold">
                  Handu Atelier
                </h2>

                <p className="text-gray-300 mt-4 max-w-sm">
                  Buat akun Anda dan nikmati
                  pengalaman peminjaman kostum
                  Handu Atelier.
                </p>

              </div>

            </div>

            {/* FORM */}

            <div className="p-8 md:p-12">

              <p
                className="
                  uppercase
                  tracking-[6px]
                  text-[#D4AF37]
                "
              >
                Create Account
              </p>

              <h1
                className="
                  text-4xl
                  font-bold
                  mt-4
                "
              >
                Buat Akun
              </h1>

              <p className="text-gray-400 mt-4">
                Daftar untuk mulai menggunakan
                layanan Handu Atelier.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-10 space-y-5"
              >

                {/* NAMA */}

                <div>

                  <label className="block">
                    Nama Lengkap
                  </label>

                  <div className="relative mt-2">

                    <FaUser
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-500
                      "
                    />

                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleChange}
                      placeholder="Masukkan nama lengkap"
                      autoComplete="name"
                      className="
                        w-full
                        pl-12
                        pr-4
                        py-4
                        rounded-xl
                        bg-[#1D1D1D]
                        border
                        border-[#D4AF37]/20
                        focus:border-[#D4AF37]
                        outline-none
                      "
                    />

                  </div>

                </div>

                {/* EMAIL */}

                <div>

                  <label className="block">
                    Email
                  </label>

                  <div className="relative mt-2">

                    <FaEnvelope
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-500
                      "
                    />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Masukkan email"
                      autoComplete="email"
                      className="
                        w-full
                        pl-12
                        pr-4
                        py-4
                        rounded-xl
                        bg-[#1D1D1D]
                        border
                        border-[#D4AF37]/20
                        focus:border-[#D4AF37]
                        outline-none
                      "
                    />

                  </div>

                </div>

                {/* NOMOR HP */}

                <div>

                  <label className="block">
                    Nomor HP
                  </label>

                  <div className="relative mt-2">

                    <FaPhone
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-500
                      "
                    />

                    <input
                      type="tel"
                      name="no_hp"
                      value={formData.no_hp}
                      onChange={handleChange}
                      placeholder="Masukkan nomor HP"
                      autoComplete="tel"
                      className="
                        w-full
                        pl-12
                        pr-4
                        py-4
                        rounded-xl
                        bg-[#1D1D1D]
                        border
                        border-[#D4AF37]/20
                        focus:border-[#D4AF37]
                        outline-none
                      "
                    />

                  </div>

                </div>

                {/* ALAMAT */}

                <div>

                  <label className="block">
                    Alamat
                  </label>

                  <div className="relative mt-2">

                    <FaMapMarkerAlt
                      className="
                        absolute
                        left-4
                        top-5
                        text-gray-500
                      "
                    />

                    <textarea
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleChange}
                      placeholder="Masukkan alamat"
                      rows="3"
                      className="
                        w-full
                        pl-12
                        pr-4
                        py-4
                        rounded-xl
                        bg-[#1D1D1D]
                        border
                        border-[#D4AF37]/20
                        focus:border-[#D4AF37]
                        outline-none
                        resize-none
                      "
                    />

                  </div>

                </div>

                {/* PASSWORD */}

                <div>

                  <label className="block">
                    Password
                  </label>

                  <div className="relative mt-2">

                    <FaLock
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-500
                      "
                    />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimal 6 karakter"
                      autoComplete="new-password"
                      className="
                        w-full
                        pl-12
                        pr-12
                        py-4
                        rounded-xl
                        bg-[#1D1D1D]
                        border
                        border-[#D4AF37]/20
                        focus:border-[#D4AF37]
                        outline-none
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-500
                      "
                    >
                      {showPassword ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}
                    </button>

                  </div>

                </div>

                {/* KONFIRMASI PASSWORD */}

                <div>

                  <label className="block">
                    Konfirmasi Password
                  </label>

                  <div className="relative mt-2">

                    <FaLock
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-500
                      "
                    />

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      name="confirmPassword"
                      value={
                        formData.confirmPassword
                      }
                      onChange={handleChange}
                      placeholder="Ulangi password"
                      autoComplete="new-password"
                      className="
                        w-full
                        pl-12
                        pr-12
                        py-4
                        rounded-xl
                        bg-[#1D1D1D]
                        border
                        border-[#D4AF37]/20
                        focus:border-[#D4AF37]
                        outline-none
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-500
                      "
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}
                    </button>

                  </div>

                </div>

                {/* ERROR */}

                {error && (
                  <div
                    className="
                      bg-red-500/10
                      border
                      border-red-500/30
                      text-red-400
                      rounded-xl
                      px-4
                      py-3
                      text-sm
                    "
                  >
                    {error}
                  </div>
                )}

                {/* SUCCESS */}

                {success && (
                  <div
                    className="
                      bg-green-500/10
                      border
                      border-green-500/30
                      text-green-400
                      rounded-xl
                      px-4
                      py-3
                      text-sm
                    "
                  >
                    {success}
                  </div>
                )}

                {/* BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full
                    py-4
                    rounded-xl
                    bg-[#D4AF37]
                    text-black
                    font-semibold
                    hover:scale-[1.02]
                    transition-all
                    duration-300
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >
                  {loading
                    ? "Mendaftarkan..."
                    : "Daftar"}
                </button>

              </form>

              <p className="text-center mt-8 text-gray-400">

                Sudah punya akun?

                <Link
                  to="/login"
                  className="text-[#D4AF37] ml-2"
                >
                  Masuk
                </Link>

              </p>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Register;