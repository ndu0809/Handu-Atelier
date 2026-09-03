import React, {
  useEffect,
  useState
} from "react";

import {
  createPortal
} from "react-dom";


const AddKostumModal = ({
  isOpen,
  onClose,
  onSubmit,
  categories = [],
  collections = [],
  initialData = null
}) => {


  // =====================================================
  // DEFAULT FORM
  // =====================================================

  const emptyForm = {

    id_kategori: "",

    id_koleksi: "",

    kode_koleksi: "",

    nama_koleksi: "",

    kelompok_koleksi: "",

    nama_kostum: "",

    ukuran: "",

    warna: "",

    stok: 0,

    harga_sewa: "",

    status: "Tersedia",

    foto: "",

    deskripsi: "",

    featured: false

  };


  const [
    form,
    setForm
  ] = useState(
    emptyForm
  );


  const [
    fotoFile,
    setFotoFile
  ] = useState(null);


  const [
    fotoPreview,
    setFotoPreview
  ] = useState("");


  // =====================================================
  // ISI FORM SAAT TAMBAH / EDIT
  // =====================================================

  useEffect(() => {

    if (!isOpen) {
      return;
    }


    if (initialData) {

      setForm({

        id_kategori:
          initialData.id_kategori ??
          "",


        id_koleksi:
          initialData.id_koleksi ??
          "",


        kode_koleksi:
          initialData.kode_koleksi ??
          "",


        nama_koleksi:
          initialData.nama_koleksi ??
          "",


        kelompok_koleksi:
          initialData.kelompok_koleksi ??
          "",


        nama_kostum:
          initialData.nama_kostum ??
          "",


        ukuran:
          initialData.ukuran ??
          "",


        warna:
          initialData.warna ??
          "",


        stok:
          initialData.stok ??
          0,


        harga_sewa:
          initialData.harga_sewa ??
          "",


        status:
          initialData.status ??
          "Tersedia",


        foto:
          initialData.foto ??
          "",


        deskripsi:
          initialData.deskripsi ??
          "",


        featured:
          Number(
            initialData.featured
          ) === 1

      });


      setFotoFile(
        null
      );


      setFotoPreview(
        initialData.foto ||
        ""
      );


    } else {

      setForm({
        ...emptyForm
      });


      setFotoFile(
        null
      );


      setFotoPreview(
        ""
      );

    }

  }, [
    isOpen,
    initialData
  ]);


  // =====================================================
  // LOCK SCROLL
  // =====================================================

  useEffect(() => {

    if (!isOpen) {
      return;
    }


    const oldOverflow =
      document.body.style.overflow;


    document.body.style.overflow =
      "hidden";


    return () => {

      document.body.style.overflow =
        oldOverflow;

    };

  }, [
    isOpen
  ]);


  // =====================================================
  // CLEANUP OBJECT URL
  // =====================================================

  useEffect(() => {

    return () => {

      if (
        fotoPreview &&
        fotoPreview.startsWith(
          "blob:"
        )
      ) {

        URL.revokeObjectURL(
          fotoPreview
        );

      }

    };

  }, [
    fotoPreview
  ]);


  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (
    event
  ) => {

    const {
      name,
      value
    } = event.target;


    setForm(
      (previous) => ({

        ...previous,

        [name]:
          value

      })
    );

  };


  // =====================================================
  // HANDLE KOLEKSI
  // =====================================================

  const handleCollectionChange = (
    event
  ) => {

    const id =
      event.target.value;


    const selectedCollection =
      collections.find(
        (item) =>
          String(
            item.id_koleksi
          ) ===
          String(id)
      );


    setForm(
      (previous) => ({

        ...previous,

        id_koleksi:
          id,


        /*
         * Nama koleksi disimpan
         * juga agar field lama
         * di backend tetap terisi.
         */

        nama_koleksi:
          selectedCollection?.nama_koleksi ||
          previous.nama_koleksi ||
          ""

      })
    );

  };


  // =====================================================
  // HANDLE FOTO
  // =====================================================

  const handleFotoChange = (
    event
  ) => {

    const file =
      event.target.files?.[0];


    if (!file) {
      return;
    }


    // =================================================
    // FORMAT
    // =================================================

    const allowedTypes = [

      "image/jpeg",

      "image/jpg",

      "image/png",

      "image/webp"

    ];


    if (
      !allowedTypes.includes(
        file.type
      )
    ) {

      alert(
        "Format foto harus JPG, JPEG, PNG, atau WEBP."
      );


      event.target.value =
        "";


      return;
    }


    // =================================================
    // MAX 5 MB
    // =================================================

    if (
      file.size >
      5 * 1024 * 1024
    ) {

      alert(
        "Ukuran foto maksimal 5 MB."
      );


      event.target.value =
        "";


      return;
    }


    // =================================================
    // HAPUS PREVIEW LAMA
    // =================================================

    if (
      fotoPreview &&
      fotoPreview.startsWith(
        "blob:"
      )
    ) {

      URL.revokeObjectURL(
        fotoPreview
      );

    }


    // =================================================
    // SIMPAN FILE
    // =================================================

    setFotoFile(
      file
    );


    // =================================================
    // BUAT PREVIEW
    // =================================================

    const previewUrl =
      URL.createObjectURL(
        file
      );


    setFotoPreview(
      previewUrl
    );

  };


  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const handleClose = (
    event
  ) => {

    event?.preventDefault();

    event?.stopPropagation();


    if (
      typeof onClose ===
      "function"
    ) {

      onClose();

    }

  };


  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = (
    event
  ) => {

    event.preventDefault();

    event.stopPropagation();


    // =================================================
    // VALIDASI KATEGORI
    // =================================================

    if (
      !form.id_kategori
    ) {

      alert(
        "Kategori kostum wajib dipilih."
      );

      return;

    }


    // =================================================
    // VALIDASI KOLEKSI
    // =================================================

    if (
      !form.id_koleksi
    ) {

      alert(
        "Koleksi kostum wajib dipilih."
      );

      return;

    }


    // =================================================
    // VALIDASI KODE KOLEKSI
    // =================================================

    if (
      !form.kode_koleksi ||
      !form.kode_koleksi.trim()
    ) {

      alert(
        "Kode koleksi wajib diisi."
      );

      return;

    }


    // =================================================
    // VALIDASI KELOMPOK
    // =================================================

    if (
      !form.kelompok_koleksi ||
      !form.kelompok_koleksi.trim()
    ) {

      alert(
        "Kelompok koleksi wajib diisi."
      );

      return;

    }


    // =================================================
    // VALIDASI NAMA KOSTUM
    // =================================================

    if (
      !form.nama_kostum ||
      !form.nama_kostum.trim()
    ) {

      alert(
        "Nama kostum wajib diisi."
      );

      return;

    }


    // =================================================
    // VALIDASI STOK
    // =================================================

    if (
      Number(form.stok) <
      0
    ) {

      alert(
        "Stok tidak boleh kurang dari 0."
      );

      return;

    }


    // =================================================
    // VALIDASI HARGA
    // =================================================

    if (
      form.harga_sewa === "" ||
      Number(form.harga_sewa) <
      0
    ) {

      alert(
        "Harga sewa wajib diisi dengan benar."
      );

      return;

    }


    // =================================================
    // VALIDASI STATUS
    // =================================================

    if (
      !form.status
    ) {

      alert(
        "Status kostum wajib dipilih."
      );

      return;

    }


    // =================================================
    // NAMA KOLEKSI
    // =================================================

    const selectedCollection =
      collections.find(
        (item) =>
          String(
            item.id_koleksi
          ) ===
          String(
            form.id_koleksi
          )
      );


    const namaKoleksi =
      selectedCollection?.nama_koleksi ||
      form.nama_koleksi ||
      form.nama_kostum.trim();


    // =================================================
    // DATA AKHIR
    // =================================================

    const data = {

      ...form,


      // -----------------------------------------------
      // RELASI
      // -----------------------------------------------

      id_kategori:
        Number(
          form.id_kategori
        ),


      id_koleksi:
        Number(
          form.id_koleksi
        ),


      // -----------------------------------------------
      // KOLEKSI
      // -----------------------------------------------

      kode_koleksi:
        form.kode_koleksi.trim(),


      nama_koleksi:
        namaKoleksi.trim(),


      kelompok_koleksi:
        form.kelompok_koleksi.trim(),


      // -----------------------------------------------
      // KOSTUM
      // -----------------------------------------------

      nama_kostum:
        form.nama_kostum.trim(),


      ukuran:
        form.ukuran ||
        "",


      warna:
        form.warna?.trim() ||
        "",


      stok:
        Number(
          form.stok
        ) || 0,


      harga_sewa:
        Number(
          form.harga_sewa
        ) || 0,


      status:
        form.status,


      // -----------------------------------------------
      // FOTO
      // -----------------------------------------------

      foto_file:
        fotoFile,


      // -----------------------------------------------
      // FEATURED
      // -----------------------------------------------

      featured:
        form.featured
          ? 1
          : 0,


      // -----------------------------------------------
      // DESKRIPSI
      // -----------------------------------------------

      deskripsi:
        form.deskripsi?.trim() ||
        ""

    };


    console.log(
      "FORM TAMBAH/EDIT KOSTUM:",
      data
    );


    if (
      typeof onSubmit ===
      "function"
    ) {

      onSubmit(
        data
      );

    }

  };


  // =====================================================
  // JIKA MODAL TUTUP
  // =====================================================

  if (!isOpen) {
    return null;
  }


  // =====================================================
  // MODAL CONTENT
  // =====================================================

  const modalContent = (

    <div

      style={{
        position: "fixed",
        inset: 0,

        zIndex: 999999,

        display: "flex",

        alignItems:
          "center",

        justifyContent:
          "center",

        padding: "20px",

        background:
          "rgba(0, 0, 0, 0.78)",

        pointerEvents:
          "auto"
      }}


      onClick={
        (event) => {

          if (
            event.target ===
            event.currentTarget
          ) {

            handleClose(
              event
            );

          }

        }
      }


      onMouseDown={
        (event) => {

          if (
            event.target ===
            event.currentTarget
          ) {

            event.stopPropagation();

          }

        }
      }

    >


      {/* =================================================
          MODAL CARD
      ================================================= */}

      <div

        style={{
          position: "relative",

          zIndex: 1000000,

          width:
            "min(900px, 100%)",

          maxHeight:
            "calc(100vh - 40px)",

          display:
            "flex",

          flexDirection:
            "column",

          overflow:
            "hidden",

          background:
            "#151411",

          border:
            "1px solid rgba(212,175,55,0.28)",

          borderRadius:
            "16px",

          boxShadow:
            "0 30px 100px rgba(0,0,0,0.65)",

          pointerEvents:
            "auto"
        }}


        onClick={
          (event) =>
            event.stopPropagation()
        }


        onMouseDown={
          (event) =>
            event.stopPropagation()
        }

      >


        {/* =================================================
            HEADER
        ================================================= */}

        <div

          style={{
            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",

            gap:
              "20px",

            padding:
              "20px 22px",

            borderBottom:
              "1px solid rgba(255,255,255,0.08)",

            flexShrink:
              0
          }}

        >

          <div>

            <h2

              style={{
                margin:
                  0,

                color:
                  "#ffffff",

                fontSize:
                  "20px",

                fontWeight:
                  700
              }}

            >

              {
                initialData
                  ? "Edit Kostum"
                  : "Tambah Kostum"
              }

            </h2>


            <p

              style={{
                margin:
                  "5px 0 0",

                color:
                  "#777777",

                fontSize:
                  "11px"
              }}

            >
              Kelola informasi kostum Handu Atelier.
            </p>

          </div>


          <button

            type="button"

            aria-label="Tutup modal"

            title="Tutup"

            onClick={
              handleClose
            }

            style={{
              width:
                "38px",

              height:
                "38px",

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              flexShrink:
                0,

              border:
                "1px solid #41371f",

              borderRadius:
                "8px",

              background:
                "#191815",

              color:
                "#dddddd",

              fontSize:
                "22px",

              lineHeight:
                1,

              cursor:
                "pointer",

              pointerEvents:
                "auto"
            }}

          >
            ×
          </button>

        </div>


        {/* =================================================
            FORM
        ================================================= */}

        <form

          onSubmit={
            handleSubmit
          }

          style={{
            overflowY:
              "auto",

            padding:
              "22px"
          }}

        >


          {/* =================================================
              GRID
          ================================================= */}

          <div

            style={{
              display:
                "grid",

              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",

              gap:
                "18px"
            }}

          >


            {/* =================================================
                KATEGORI
            ================================================= */}

            <div
              style={
                fieldStyle
              }
            >

              <label
                style={
                  labelStyle
                }
              >
                Kategori *
              </label>


              <select

                name="id_kategori"

                value={
                  form.id_kategori
                }

                onChange={
                  handleChange
                }

                required

                style={
                  inputStyle
                }

              >

                <option value="">
                  Pilih kategori
                </option>


                {
                  categories.map(
                    (
                      category
                    ) => (

                      <option

                        key={
                          category.id_kategori
                        }

                        value={
                          category.id_kategori
                        }

                      >
                        {
                          category.nama_kategori
                        }
                      </option>

                    )
                  )
                }

              </select>

            </div>


            {/* =================================================
                KOLEKSI
            ================================================= */}

            <div
              style={
                fieldStyle
              }
            >

              <label
                style={
                  labelStyle
                }
              >
                Koleksi *
              </label>


              <select

                name="id_koleksi"

                value={
                  form.id_koleksi
                }

                onChange={
                  handleCollectionChange
                }

                required

                style={
                  inputStyle
                }

              >

                <option value="">
                  Pilih koleksi
                </option>


                {
                  collections.map(
                    (
                      collection
                    ) => (

                      <option

                        key={
                          collection.id_koleksi
                        }

                        value={
                          collection.id_koleksi
                        }

                      >

                        {
                          collection.nama_koleksi
                        }

                      </option>

                    )
                  )
                }

              </select>


              <small
                style={{
                  color:
                    "#777777",

                  fontSize:
                    "10px"
                }}
              >
                Pilih koleksi yang menjadi induk kostum ini.
              </small>

            </div>


            {/* =================================================
                KODE KOLEKSI
            ================================================= */}

            <div
              style={
                fieldStyle
              }
            >

              <label
                style={
                  labelStyle
                }
              >
                Kode Koleksi *
              </label>


              <input

                type="text"

                name="kode_koleksi"

                value={
                  form.kode_koleksi
                }

                onChange={
                  handleChange
                }

                placeholder="Contoh: KST001"

                required

                style={
                  inputStyle
                }

              />

            </div>


            {/* =================================================
                KELOMPOK KOLEKSI
            ================================================= */}

            <div
              style={
                fieldStyle
              }
            >

              <label
                style={
                  labelStyle
                }
              >
                Kelompok Koleksi *
              </label>


              <input

                type="text"

                name="kelompok_koleksi"

                value={
                  form.kelompok_koleksi
                }

                onChange={
                  handleChange
                }

                placeholder="Contoh: Tradisional"

                required

                style={
                  inputStyle
                }

              />

            </div>


            {/* =================================================
                NAMA KOSTUM
            ================================================= */}

            <div
              style={
                fieldStyle
              }
            >

              <label
                style={
                  labelStyle
                }
              >
                Nama Kostum *
              </label>


              <input

                type="text"

                name="nama_kostum"

                value={
                  form.nama_kostum
                }

                onChange={
                  handleChange
                }

                placeholder="Contoh: Adat Minangkabau"

                required

                style={
                  inputStyle
                }

              />

            </div>


            {/* =================================================
                UKURAN
            ================================================= */}

            <div
              style={
                fieldStyle
              }
            >

              <label
                style={
                  labelStyle
                }
              >
                Ukuran *
              </label>


              <select

                name="ukuran"

                value={
                  form.ukuran
                }

                onChange={
                  handleChange
                }

                required

                style={
                  inputStyle
                }

              >

                <option value="">
                  Pilih ukuran
                </option>


                <option value="XS">
                  XS
                </option>


                <option value="S">
                  S
                </option>


                <option value="M">
                  M
                </option>


                <option value="L">
                  L
                </option>


                <option value="XL">
                  XL
                </option>


                <option value="XXL">
                  XXL
                </option>

              </select>

            </div>


            {/* =================================================
                WARNA
            ================================================= */}

            <div
              style={
                fieldStyle
              }
            >

              <label
                style={
                  labelStyle
                }
              >
                Warna
              </label>


              <input

                type="text"

                name="warna"

                value={
                  form.warna
                }

                onChange={
                  handleChange
                }

                placeholder="Contoh: Hitam"

                style={
                  inputStyle
                }

              />

            </div>


            {/* =================================================
                STOK
            ================================================= */}

            <div
              style={
                fieldStyle
              }
            >

              <label
                style={
                  labelStyle
                }
              >
                Stok *
              </label>


              <input

                type="number"

                min="0"

                name="stok"

                value={
                  form.stok
                }

                onChange={
                  handleChange
                }

                required

                style={
                  inputStyle
                }

              />

            </div>


            {/* =================================================
                HARGA
            ================================================= */}

            <div
              style={
                fieldStyle
              }
            >

              <label
                style={
                  labelStyle
                }
              >
                Harga Sewa *
              </label>


              <input

                type="number"

                min="0"

                name="harga_sewa"

                value={
                  form.harga_sewa
                }

                onChange={
                  handleChange
                }

                placeholder="150000"

                required

                style={
                  inputStyle
                }

              />

            </div>


            {/* =================================================
                STATUS
            ================================================= */}

            <div
              style={
                fieldStyle
              }
            >

              <label
                style={
                  labelStyle
                }
              >
                Status *
              </label>


              <select

                name="status"

                value={
                  form.status
                }

                onChange={
                  handleChange
                }

                required

                style={
                  inputStyle
                }

              >

                <option value="Tersedia">
                  Tersedia
                </option>


                <option value="Dipinjam">
                  Dipinjam
                </option>


                <option value="Perawatan">
                  Perawatan
                </option>


                <option value="Rusak">
                  Rusak
                </option>

              </select>

            </div>


          </div>


          {/* =================================================
              FOTO
          ================================================= */}

          <div
            style={{
              ...fieldStyle,
              marginTop:
                "18px"
            }}
          >

            <label
              style={
                labelStyle
              }
            >
              Foto Kostum
            </label>


            <input

              type="file"

              name="foto"

              accept=".jpg,.jpeg,.png,.webp"

              onChange={
                handleFotoChange
              }

              style={{
                ...inputStyle,

                height:
                  "auto",

                padding:
                  "11px"
              }}

            />


            <small
              style={{
                color:
                  "#777777",

                fontSize:
                  "10px"
              }}
            >
              Format JPG, JPEG, PNG,
              atau WEBP. Maksimal 5 MB.
            </small>


            {
              initialData?.foto &&
              !fotoFile && (

                <small
                  style={{
                    color:
                      "#d4af37",

                    fontSize:
                      "10px"
                  }}
                >
                  Foto lama akan dipertahankan
                  jika tidak memilih foto baru.
                </small>

              )
            }


            {/* PREVIEW */}

            {
              fotoPreview && (

                <div

                  style={{
                    marginTop:
                      "10px",

                    width:
                      "100%",

                    height:
                      "190px",

                    display:
                      "flex",

                    alignItems:
                      "center",

                    justifyContent:
                      "center",

                    overflow:
                      "hidden",

                    background:
                      "#0c0c0b",

                    border:
                      "1px solid rgba(212,175,55,0.20)",

                    borderRadius:
                      "10px"
                  }}

                >

                  <img

                    src={
                      fotoPreview.startsWith(
                        "/uploads/"
                      ) ||
                      fotoPreview.startsWith(
                        "http://"
                      ) ||
                      fotoPreview.startsWith(
                        "https://"
                      )
                        ? (
                            fotoPreview.startsWith(
                              "/uploads/"
                            )
                              ? fotoPreview
                              : fotoPreview
                          )
                        : fotoPreview
                    }

                    alt="Preview kostum"

                    style={{
                      width:
                        "100%",

                      height:
                        "100%",

                      objectFit:
                        "contain"
                    }}

                    onError={(
                      event
                    ) => {

                      event.currentTarget.style.display =
                        "none";

                    }}

                  />

                </div>

              )
            }

          </div>


          {/* =================================================
              DESKRIPSI
          ================================================= */}

          <div

            style={{
              ...fieldStyle,

              marginTop:
                "18px"
            }}

          >

            <label
              style={
                labelStyle
              }
            >
              Deskripsi
            </label>


            <textarea

              name="deskripsi"

              value={
                form.deskripsi
              }

              onChange={
                handleChange
              }

              rows={4}

              placeholder="Deskripsi kostum..."

              style={{
                ...inputStyle,

                height:
                  "auto",

                minHeight:
                  "100px",

                resize:
                  "vertical",

                padding:
                  "12px"
              }}

            />

          </div>


          {/* =================================================
              FEATURED
          ================================================= */}

          <div

            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                "10px",

              marginTop:
                "18px",

              padding:
                "12px",

              background:
                "rgba(212,175,55,0.05)",

              border:
                "1px solid rgba(212,175,55,0.12)",

              borderRadius:
                "8px"
            }}

          >

            <input

              id="featured-kostum"

              type="checkbox"

              checked={
                form.featured
              }

              onChange={
                (event) =>
                  setForm(
                    (previous) => ({
                      ...previous,
                      featured:
                        event.target.checked
                    })
                  )
              }

            />


            <label

              htmlFor="featured-kostum"

              style={{
                color:
                  "#d0d0d0",

                fontSize:
                  "11px",

                cursor:
                  "pointer"
              }}

            >
              Tampilkan sebagai kostum unggulan
            </label>

          </div>


          {/* =================================================
              ACTION
          ================================================= */}

          <div

            style={{
              display:
                "flex",

              justifyContent:
                "flex-end",

              gap:
                "10px",

              marginTop:
                "24px",

              paddingTop:
                "18px",

              borderTop:
                "1px solid rgba(255,255,255,0.07)"
            }}

          >

            <button

              type="button"

              onClick={
                handleClose
              }

              style={
                secondaryButtonStyle
              }

            >
              Batal
            </button>


            <button

              type="submit"

              style={
                primaryButtonStyle
              }

            >

              {
                initialData
                  ? "Simpan Perubahan"
                  : "Tambah Kostum"
              }

            </button>

          </div>


        </form>

      </div>

    </div>

  );


  // =====================================================
  // RENDER VIA PORTAL
  // =====================================================

  return createPortal(
    modalContent,
    document.body
  );

};


// =========================================================
// STYLE
// =========================================================

const fieldStyle = {

  display:
    "flex",

  flexDirection:
    "column",

  gap:
    "7px"
};


const labelStyle = {

  color:
    "#d0d0d0",

  fontSize:
    "11px",

  fontWeight:
    600
};


const inputStyle = {

  width:
    "100%",

  minHeight:
    "42px",

  boxSizing:
    "border-box",

  padding:
    "0 12px",

  border:
    "1px solid #393126",

  borderRadius:
    "8px",

  outline:
    "none",

  background:
    "#1b1916",

  color:
    "#ffffff",

  fontSize:
    "11px",

  cursor:
    "text",

  pointerEvents:
    "auto"
};


const primaryButtonStyle = {

  minHeight:
    "40px",

  padding:
    "0 18px",

  border:
    "1px solid #d4af37",

  borderRadius:
    "8px",

  background:
    "#d4af37",

  color:
    "#11100e",

  fontSize:
    "11px",

  fontWeight:
    700,

  cursor:
    "pointer",

  pointerEvents:
    "auto"
};


const secondaryButtonStyle = {

  minHeight:
    "40px",

  padding:
    "0 18px",

  border:
    "1px solid #40371f",

  borderRadius:
    "8px",

  background:
    "transparent",

  color:
    "#bbbbbb",

  fontSize:
    "11px",

  fontWeight:
    600,

  cursor:
    "pointer",

  pointerEvents:
    "auto"
};


export default AddKostumModal;