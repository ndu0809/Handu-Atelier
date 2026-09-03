import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FaLock, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";

function ChangePassword() {
  const navigate = useNavigate();

  // ==================================================
  // FORM
  // ==================================================

  const [formData, setFormData] = useState({
    passwordLama: "",
    passwordBaru: "",
    konfirmasiPassword: "",
  });

  // ==================================================
  // SHOW / HIDE PASSWORD
  // ==================================================

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ==================================================
  // UI
  // ==================================================

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // ==================================================
  // HANDLE INPUT
  // ==================================================

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Jangan ubah focus/input saat mengetik.
    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };

  // ==================================================
  // SUBMIT
  // ==================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // ==============================================
    // VALIDASI
    // ==============================================

    if (
      !formData.passwordLama ||
      !formData.passwordBaru ||
      !formData.konfirmasiPassword
    ) {
      setError("Semua kolom password wajib diisi.");

      return;
    }

    if (formData.passwordBaru.length < 6) {
      setError("Password baru minimal 6 karakter.");

      return;
    }

    if (formData.passwordBaru === formData.passwordLama) {
      setError("Password baru harus berbeda dari password lama.");

      return;
    }

    if (formData.passwordBaru !== formData.konfirmasiPassword) {
      setError("Konfirmasi password baru tidak sesuai.");

      return;
    }

    // ==============================================
    // SESSION
    // ==============================================

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    let user;

    try {
      user = JSON.parse(storedUser);
    } catch (err) {
      console.error("Data user tidak valid:", err);

      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");

      navigate("/login", {
        replace: true,
      });

      return;
    }

    if (!user?.id_user) {
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");

      navigate("/login", {
        replace: true,
      });

      return;
    }

    // ==============================================
    // REQUEST
    // ==============================================

    try {
      setLoading(true);

      console.log("USER SESSION:", user);
      console.log("ID USER:", user?.id_user);
      console.log("PASSWORD LAMA:", formData.passwordLama);
      console.log("PASSWORD BARU:", formData.passwordBaru);

      const response = await fetch("/users/change-password", {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id_user: user.id_user,

          password_lama: formData.passwordLama,

          password_baru: formData.passwordBaru,
        }),
      });

      const raw = await response.text();

      let result = {};

      try {
        result = raw ? JSON.parse(raw) : {};
      } catch (jsonError) {
        console.error("Response bukan JSON:", raw);

        throw new Error("Server mengembalikan response yang tidak valid.");
      }

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengubah password.");
      }

      // ==========================================
      // BERHASIL
      // ==========================================

      setSuccess(
        "Password berhasil diubah. Anda akan diarahkan ke halaman login.",
      );

      setFormData({
        passwordLama: "",
        passwordBaru: "",
        konfirmasiPassword: "",
      });

      setTimeout(() => {
        localStorage.removeItem("user");

        localStorage.removeItem("isLoggedIn");

        navigate("/login", {
          replace: true,
        });
      }, 1800);
    } catch (err) {
      console.error("Change password error:", err);

      setError(err.message || "Terjadi kesalahan saat mengubah password.");
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      {/* HEADER */}

      <header
        className="
                    border-b
                    border-[#D4AF37]/20
                    bg-[#111111]
                "
      >
        <div
          className="
                        max-w-3xl
                        mx-auto
                        px-6
                        py-5
                        flex
                        items-center
                        justify-between
                        gap-4
                    "
        >
          <div>
            <p
              className="
                                uppercase
                                tracking-[4px]
                                text-[#D4AF37]
                                text-xs
                            "
            >
              Member Area
            </p>

            <h1
              className="
                                text-2xl
                                md:text-3xl
                                font-bold
                                mt-2
                            "
            >
              Ubah Password
            </h1>

            <p className="text-gray-500 mt-2">Perbarui keamanan akun Anda</p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/settings")}
            className="
                            inline-flex
                            items-center
                            gap-2
                            px-4
                            py-2.5
                            rounded-xl
                            border
                            border-white/10
                            text-gray-400
                            hover:text-white
                            hover:border-[#D4AF37]/30
                            transition
                        "
          >
            <FaArrowLeft />
            Kembali
          </button>
        </div>
      </header>

      {/* CONTENT */}

      <main
        className="
                    max-w-3xl
                    mx-auto
                    px-6
                    py-12
                "
      >
        <div
          className="
                        rounded-3xl
                        border
                        border-[#D4AF37]/20
                        bg-[#141414]
                        p-8
                    "
        >
          {/* TITLE */}

          <div className="mb-8">
            <p
              className="
                                uppercase
                                tracking-[4px]
                                text-[#D4AF37]
                                text-sm
                            "
            >
              Account Security
            </p>

            <h2 className="text-3xl font-bold mt-3">Keamanan Akun</h2>

            <p
              className="
                                text-gray-400
                                mt-3
                                leading-6
                            "
            >
              Masukkan password lama untuk memverifikasi akun, kemudian masukkan
              password baru Anda.
            </p>
          </div>

          {/* ERROR */}

          {error && (
            <div
              className="
                                mb-6
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
                                mb-6
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

          {/* FORM */}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PASSWORD LAMA */}

            <div>
              <label
                htmlFor="passwordLama"
                className="
                                    block
                                    mb-2
                                    text-gray-300
                                "
              >
                Password Lama
              </label>

              <div className="relative">
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
                  id="passwordLama"
                  name="passwordLama"
                  type={showOld ? "text" : "password"}
                  value={formData.passwordLama}
                  onChange={handleChange}
                  autoComplete="current-password"
                  placeholder="Masukkan password lama"
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
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => setShowOld((previous) => !previous)}
                  className="
                                        absolute
                                        right-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-gray-500
                                        hover:text-[#D4AF37]
                                    "
                >
                  {showOld ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* PASSWORD BARU */}

            <div>
              <label
                htmlFor="passwordBaru"
                className="
                                    block
                                    mb-2
                                    text-gray-300
                                "
              >
                Password Baru
              </label>

              <div className="relative">
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
                  id="passwordBaru"
                  name="passwordBaru"
                  type={showNew ? "text" : "password"}
                  value={formData.passwordBaru}
                  onChange={handleChange}
                  autoComplete="new-password"
                  placeholder="Minimal 6 karakter"
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
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => setShowNew((previous) => !previous)}
                  className="
                                        absolute
                                        right-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-gray-500
                                        hover:text-[#D4AF37]
                                    "
                >
                  {showNew ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <p className="text-gray-500 text-xs mt-2">
                Password baru minimal 6 karakter.
              </p>
            </div>

            {/* KONFIRMASI */}

            <div>
              <label
                htmlFor="konfirmasiPassword"
                className="
                                    block
                                    mb-2
                                    text-gray-300
                                "
              >
                Konfirmasi Password Baru
              </label>

              <div className="relative">
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
                  id="konfirmasiPassword"
                  name="konfirmasiPassword"
                  type={showConfirm ? "text" : "password"}
                  value={formData.konfirmasiPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  placeholder="Ulangi password baru"
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
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => setShowConfirm((previous) => !previous)}
                  className="
                                        absolute
                                        right-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-gray-500
                                        hover:text-[#D4AF37]
                                    "
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

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
                                hover:scale-[1.01]
                                transition
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                            "
            >
              {loading ? "Menyimpan..." : "Simpan Password"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ChangePassword;
