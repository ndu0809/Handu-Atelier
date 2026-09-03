import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaSave,
  FaLock,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaChevronRight,
} from "react-icons/fa";

import UserLayout from "./UserLayout";

function Settings() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    no_hp: "",
    alamat: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==================================================
  // LOAD USER
  // ==================================================

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError("");

        const storedUser =
          localStorage.getItem("user");

        if (!storedUser) {
          navigate("/login", {
            replace: true,
          });

          return;
        }

        const parsedUser =
          JSON.parse(storedUser);

        if (!parsedUser?.id_user) {
          throw new Error(
            "Data user tidak valid."
          );
        }

        // ==========================================
        // TAMPILKAN DATA SEMENTARA
        // ==========================================

        setUser(parsedUser);

        setFormData({
          nama: parsedUser.nama || "",
          email: parsedUser.email || "",
          no_hp: parsedUser.no_hp || "",
          alamat: parsedUser.alamat || "",
        });

        // ==========================================
        // AMBIL DATA TERBARU
        // ==========================================

        const response = await fetch(
          `/users/${parsedUser.id_user}`
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Gagal mengambil data user."
          );
        }

        const latestUser =
          result.data ||
          result.user ||
          result;

        if (!latestUser?.id_user) {
          throw new Error(
            "Data user dari server tidak valid."
          );
        }

        setUser(latestUser);

        setFormData({
          nama: latestUser.nama || "",
          email: latestUser.email || "",
          no_hp: latestUser.no_hp || "",
          alamat: latestUser.alamat || "",
        });

        localStorage.setItem(
          "user",
          JSON.stringify(latestUser)
        );
      } catch (err) {
        console.error(
          "Settings load error:",
          err
        );

        setError(
          err.message ||
            "Gagal memuat data akun."
        );
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [navigate]);

  // ==================================================
  // HANDLE CHANGE
  // ==================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ==================================================
  // VALIDATION
  // ==================================================

  const validateForm = () => {
    if (!formData.nama.trim()) {
      return "Nama wajib diisi.";
    }

    if (!formData.email.trim()) {
      return "Email wajib diisi.";
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        formData.email
      )
    ) {
      return "Format email tidak valid.";
    }

    return "";
  };

  // ==================================================
  // SAVE
  // ==================================================

  const handleSave = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!user?.id_user) {
      setError(
        "Data user tidak valid. Silakan login kembali."
      );

      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `/users/${user.id_user}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            nama: formData.nama.trim(),

            email:
              formData.email.trim(),

            no_hp:
              formData.no_hp.trim() ||
              null,

            alamat:
              formData.alamat.trim() ||
              null,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Gagal memperbarui data akun."
        );
      }

      // ==========================================
      // REFRESH DATA USER
      // ==========================================

      const refreshResponse =
        await fetch(
          `/users/${user.id_user}`
        );

      const refreshResult =
        await refreshResponse.json();

      if (!refreshResponse.ok) {
        throw new Error(
          refreshResult.message ||
            "Data berhasil disimpan, tetapi gagal mengambil data terbaru."
        );
      }

      const updatedUser =
        refreshResult.data ||
        refreshResult.user ||
        refreshResult;

      setUser(updatedUser);

      setFormData({
        nama:
          updatedUser.nama || "",

        email:
          updatedUser.email || "",

        no_hp:
          updatedUser.no_hp || "",

        alamat:
          updatedUser.alamat || "",
      });

      localStorage.setItem(
        "user",
        JSON.stringify(
          updatedUser
        )
      );

      setSuccess(
        "Data akun berhasil diperbarui."
      );
    } catch (err) {
      console.error(
        "Update settings error:",
        err
      );

      setError(
        err.message ||
          "Terjadi kesalahan saat menyimpan perubahan."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading || !user) {
    return (
      <div
        className="
          min-h-screen
          bg-[#080808]
          text-white
          flex
          items-center
          justify-center
        "
      >
        <p className="text-[#D4AF37]">
          Memuat pengaturan...
        </p>
      </div>
    );
  }

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <UserLayout
      title="Pengaturan"
      subtitle="Kelola data pribadi dan keamanan akun Anda"
    >
      {/* ==================================================
          ALERT
      ================================================== */}

      {error && (
        <div
          className="
            mb-5
            rounded-2xl
            border
            border-red-500/20
            bg-red-500/10
            px-5
            py-4
            text-red-400
            text-sm
          "
        >
          {error}
        </div>
      )}

      {success && (
        <div
          className="
            mb-5
            rounded-2xl
            border
            border-green-500/20
            bg-green-500/10
            px-5
            py-4
            text-green-400
            text-sm
          "
        >
          {success}
        </div>
      )}

      {/* ==================================================
          PERSONAL INFORMATION
      ================================================== */}

      <section
        className="
          rounded-3xl
          border
          border-[#D4AF37]/15
          bg-[#111111]
          overflow-hidden
        "
      >
        {/* HEADER */}

        <div
          className="
            px-6
            md:px-8
            py-7
            border-b
            border-white/5
            bg-gradient-to-r
            from-[#1A160C]
            to-transparent
          "
        >
          <div className="flex items-center gap-4">
            <div
              className="
                w-12
                h-12
                rounded-2xl
                bg-[#D4AF37]/10
                text-[#D4AF37]
                flex
                items-center
                justify-center
              "
            >
              <FaUser />
            </div>

            <div>
              <p
                className="
                  text-[#D4AF37]
                  text-xs
                  uppercase
                  tracking-[4px]
                "
              >
                Account
              </p>

              <h2
                className="
                  text-2xl
                  font-bold
                  mt-1
                "
              >
                Informasi Pribadi
              </h2>
            </div>
          </div>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSave}
          className="p-6 md:p-8"
        >
          <div
            className="
              grid
              md:grid-cols-2
              gap-5
            "
          >
            {/* NAMA */}

            <div>
              <label
                className="
                  block
                  mb-2
                  text-gray-400
                  text-sm
                "
              >
                Nama Lengkap
              </label>

              <div className="relative">
                <FaUser
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-600
                  "
                />

                <input
                  name="nama"
                  type="text"
                  value={
                    formData.nama
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Nama lengkap"
                  className="
                    w-full
                    pl-11
                    pr-4
                    py-4
                    rounded-xl
                    bg-[#181818]
                    border
                    border-white/10
                    focus:border-[#D4AF37]
                    outline-none
                    transition
                  "
                />
              </div>
            </div>

            {/* EMAIL */}

            <div>
              <label
                className="
                  block
                  mb-2
                  text-gray-400
                  text-sm
                "
              >
                Email
              </label>

              <div className="relative">
                <FaEnvelope
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-600
                  "
                />

                <input
                  name="email"
                  type="email"
                  value={
                    formData.email
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Email"
                  className="
                    w-full
                    pl-11
                    pr-4
                    py-4
                    rounded-xl
                    bg-[#181818]
                    border
                    border-white/10
                    focus:border-[#D4AF37]
                    outline-none
                    transition
                  "
                />
              </div>
            </div>

            {/* NO HP */}

            <div>
              <label
                className="
                  block
                  mb-2
                  text-gray-400
                  text-sm
                "
              >
                Nomor HP
              </label>

              <div className="relative">
                <FaPhone
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-600
                  "
                />

                <input
                  name="no_hp"
                  type="tel"
                  value={
                    formData.no_hp
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Nomor HP"
                  className="
                    w-full
                    pl-11
                    pr-4
                    py-4
                    rounded-xl
                    bg-[#181818]
                    border
                    border-white/10
                    focus:border-[#D4AF37]
                    outline-none
                    transition
                  "
                />
              </div>
            </div>

            {/* ROLE */}

            <div>
              <label
                className="
                  block
                  mb-2
                  text-gray-400
                  text-sm
                "
              >
                Role
              </label>

              <input
                disabled
                value={
                  user.nama_role ||
                  user.role ||
                  "User"
                }
                className="
                  w-full
                  px-4
                  py-4
                  rounded-xl
                  bg-[#181818]
                  border
                  border-white/5
                  text-gray-600
                  cursor-not-allowed
                "
              />
            </div>
          </div>

          {/* ALAMAT */}

          <div className="mt-5">
            <label
              className="
                block
                mb-2
                text-gray-400
                text-sm
              "
            >
              Alamat
            </label>

            <div className="relative">
              <FaMapMarkerAlt
                className="
                  absolute
                  left-4
                  top-5
                  text-gray-600
                "
              />

              <textarea
                name="alamat"
                rows={5}
                value={
                  formData.alamat
                }
                onChange={
                  handleChange
                }
                placeholder="Masukkan alamat"
                className="
                  w-full
                  pl-11
                  pr-4
                  py-4
                  rounded-xl
                  bg-[#181818]
                  border
                  border-white/10
                  focus:border-[#D4AF37]
                  outline-none
                  transition
                  resize-none
                "
              />
            </div>
          </div>

          {/* SAVE */}

          <div
            className="
              flex
              flex-col
              sm:flex-row
              gap-3
              mt-7
            "
          >
            <button
              type="submit"
              disabled={saving}
              className="
                flex-1
                flex
                items-center
                justify-center
                gap-2
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
              <FaSave />

              {saving
                ? "Menyimpan..."
                : "Simpan Perubahan"}
            </button>

            <Link
              to="/profile"
              className="
                flex-1
                flex
                items-center
                justify-center
                py-4
                rounded-xl
                border
                border-[#D4AF37]/25
                text-[#D4AF37]
                hover:bg-[#D4AF37]/10
                transition
              "
            >
              Lihat Profil
            </Link>
          </div>
        </form>
      </section>

      {/* ==================================================
          SECURITY
      ================================================== */}

      <section
        className="
          mt-5
          rounded-3xl
          border
          border-[#D4AF37]/15
          bg-[#111111]
          overflow-hidden
        "
      >
        <div
          className="
            px-6
            md:px-8
            py-6
            border-b
            border-white/5
          "
        >
          <p
            className="
              text-[#D4AF37]
              text-xs
              uppercase
              tracking-[4px]
            "
          >
            Security
          </p>

          <h2 className="text-2xl font-bold mt-2">
            Keamanan Akun
          </h2>
        </div>

        <Link
          to="/change-password"
          className="
            w-full
            px-6
            md:px-8
            py-6
            flex
            items-center
            justify-between
            hover:bg-white/[0.03]
            transition
          "
        >
          <div className="flex items-center gap-4">
            <div
              className="
                w-12
                h-12
                rounded-2xl
                bg-[#D4AF37]/10
                text-[#D4AF37]
                flex
                items-center
                justify-center
              "
            >
              <FaLock />
            </div>

            <div>
              <p className="font-semibold">
                Ubah Password
              </p>

              <p className="text-gray-600 text-sm mt-1">
                Perbarui password akun Anda
              </p>
            </div>
          </div>

          <FaChevronRight className="text-gray-600" />
        </Link>
      </section>
    </UserLayout>
  );
}

export default Settings;