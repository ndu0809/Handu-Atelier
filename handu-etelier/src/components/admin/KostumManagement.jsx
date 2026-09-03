import React, {
  useEffect,
  useState
} from "react";

import api from "../../lib/api";
import Icon from "./Icon";
import AddKostumModal from "./AddKostumModal";

const KostumManagement = () => {

  // =====================================================
  // STATE
  // =====================================================

  const [kostum, setKostum] = useState([]);

  const [kategori, setKategori] = useState([]);

  const [koleksi, setKoleksi] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);

  const [editData, setEditData] = useState(null);


  const [
    confirmDelete,
    setConfirmDelete
  ] = useState(null);


  const [
    deleteLoading,
    setDeleteLoading
  ] = useState(false);


  const [
    message,
    setMessage
  ] = useState("");


  const [
    messageType,
    setMessageType
  ] = useState("success");


  // =====================================================
  // BUKA FORM TAMBAH
  // =====================================================

  const openAddForm = () => {

    console.log(
      "TOMBOL TAMBAH KOSTUM DIKLIK"
    );

    setEditData(null);

    setModalOpen(true);
  };


  // =====================================================
  // STYLE
  // =====================================================

  const styles = {

    page: {
      width: "100%",
      color: "#ffffff",
      position: "relative",
      zIndex: 1000,
      pointerEvents: "auto"
    },


    heading: {
      position: "relative",
      zIndex: 1001,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      gap: "18px",
      flexWrap: "wrap",
      marginBottom: "24px"
    },


    kicker: {
      display: "block",
      marginBottom: "6px",
      color: "#d4af37",
      fontSize: "11px",
      fontWeight: 700,
      letterSpacing: "0.18em"
    },


    title: {
      margin: 0,
      color: "#ffffff",
      fontSize: "30px",
      lineHeight: 1.2
    },


    subtitle: {
      margin: "7px 0 0",
      color: "#7e7e7e",
      fontSize: "13px"
    },


    primaryButton: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      minHeight: "42px",
      padding: "0 15px",
      border: "1px solid #d4af37",
      borderRadius: "8px",
      background: "#d4af37",
      color: "#11100e",
      fontSize: "12px",
      fontWeight: 700,
      cursor: "pointer",
      position: "relative",
      zIndex: 1002,
      pointerEvents: "auto",
      userSelect: "none"
    },


    card: {
      background: "#11100e",
      border: "1px solid #342d1e",
      borderRadius: "14px",
      overflow: "hidden"
    },


    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "15px",
      padding: "17px 20px",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      flexWrap: "wrap"
    },


    searchBox: {
      display: "flex",
      alignItems: "center",
      gap: "9px",
      width: "320px",
      maxWidth: "100%",
      height: "40px",
      padding: "0 12px",
      border: "1px solid #38301f",
      background: "#171613",
      borderRadius: "8px"
    },


    searchInput: {
      width: "100%",
      border: "none",
      outline: "none",
      background: "transparent",
      color: "#ffffff",
      fontSize: "12px"
    },


    resultCount: {
      color: "#8a8a8a",
      fontSize: "11px"
    },


    message: {
      margin: "14px 20px 0",
      padding: "11px 13px",
      borderRadius: "8px",
      fontSize: "11px",
      lineHeight: 1.5
    },


    successMessage: {
      background: "rgba(76,175,80,0.09)",
      border: "1px solid rgba(76,175,80,0.22)",
      color: "#8bd38d"
    },


    errorMessage: {
      background: "rgba(220,70,70,0.09)",
      border: "1px solid rgba(220,70,70,0.22)",
      color: "#ff8585"
    },


    loading: {
      minHeight: "260px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#777777",
      fontSize: "12px"
    },


    tableWrapper: {
      width: "100%",
      overflowX: "auto"
    },


    table: {
      width: "100%",
      minWidth: "1000px",
      borderCollapse: "collapse"
    },


    th: {
      padding: "13px 15px",
      background: "#151411",
      borderBottom: "1px solid #312a1c",
      color: "#c8a84e",
      fontSize: "10px",
      fontWeight: 700,
      textAlign: "left",
      whiteSpace: "nowrap"
    },


    td: {
      padding: "13px 15px",
      borderBottom: "1px solid rgba(255,255,255,0.045)",
      color: "#d4d4d4",
      fontSize: "11px",
      verticalAlign: "middle"
    },


    costumeItem: {
      display: "flex",
      alignItems: "center",
      gap: "10px"
    },


    costumeImage: {
      width: "44px",
      height: "56px",
      minWidth: "44px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      borderRadius: "7px",
      background: "#1b1a17",
      border: "1px solid rgba(212,175,55,0.16)",
      color: "#d4af37"
    },


    costumeImageImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    },


    costumeName: {
      display: "block",
      color: "#ffffff",
      fontSize: "11px",
      fontWeight: 600
    },


    costumeCode: {
      display: "block",
      marginTop: "4px",
      color: "#6c6c6c",
      fontSize: "9px"
    },


    stockBadge: {
      display: "inline-flex",
      minWidth: "30px",
      justifyContent: "center",
      padding: "5px 7px",
      borderRadius: "6px",
      background: "rgba(212,175,55,0.08)",
      color: "#d4af37",
      fontWeight: 700,
      fontSize: "10px"
    },


    statusBadge: {
      display: "inline-flex",
      padding: "5px 9px",
      borderRadius: "20px",
      fontSize: "9px",
      fontWeight: 600
    },


    actionGroup: {
      display: "flex",
      alignItems: "center",
      gap: "6px"
    },


    actionButton: {
      width: "32px",
      height: "32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "7px",
      cursor: "pointer"
    },


    empty: {
      minHeight: "230px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#666666",
      fontSize: "12px"
    },


    modalOverlay: {
      position: "fixed",
      inset: 0,
      zIndex: 10000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      background: "rgba(0,0,0,0.70)"
    },


    confirmModal: {
      width: "min(430px, 100%)",
      background: "#151411",
      border: "1px solid #40351e",
      borderRadius: "14px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.45)"
    },


    confirmHeader: {
      padding: "20px 22px 12px"
    },


    confirmTitle: {
      margin: 0,
      color: "#ffffff",
      fontSize: "18px",
      fontWeight: 700
    },


    confirmText: {
      margin: "8px 0 0",
      color: "#8c8c8c",
      fontSize: "12px",
      lineHeight: 1.6
    },


    confirmName: {
      color: "#d4af37",
      fontWeight: 700
    },


    confirmActions: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "8px",
      padding: "12px 22px 20px"
    },


    cancelButton: {
      height: "38px",
      padding: "0 13px",
      border: "1px solid #40371f",
      borderRadius: "8px",
      background: "transparent",
      color: "#aaa",
      cursor: "pointer",
      fontSize: "11px",
      fontWeight: 600
    },


    deleteButton: {
      height: "38px",
      padding: "0 13px",
      border: "1px solid rgba(220,70,70,0.35)",
      borderRadius: "8px",
      background: "rgba(220,70,70,0.12)",
      color: "#ff7d7d",
      cursor: "pointer",
      fontSize: "11px",
      fontWeight: 600
    }
  };


  // =====================================================
  // MESSAGE
  // =====================================================

  const showMessage = (
    text,
    type = "success"
  ) => {

    setMessage(text);

    setMessageType(type);

    window.setTimeout(() => {
      setMessage("");
    }, 3500);
  };


  // =====================================================
  // NORMALISASI RESPONSE
  // =====================================================

  const getArrayData = (
    response
  ) => {

    let data =
      response;


    if (
      data &&
      typeof data === "object" &&
      data.data !== undefined
    ) {

      data =
        data.data;
    }


    if (
      data &&
      typeof data === "object" &&
      Array.isArray(data.data)
    ) {

      data =
        data.data;
    }


    if (
      data &&
      typeof data === "object" &&
      Array.isArray(data.kostum)
    ) {

      data =
        data.kostum;
    }


    if (
      data &&
      typeof data === "object" &&
      Array.isArray(data.kategori)
    ) {

      data =
        data.kategori;
    }


    if (
      data &&
      typeof data === "object" &&
      Array.isArray(data.koleksi)
    ) {

      data =
        data.koleksi;
    }


    return Array.isArray(data)
      ? data
      : [];
  };


  // =====================================================
  // LOAD DATA
  // =====================================================

  const loadData = async () => {

    try {

      setLoading(true);


      const [
        kostumResponse,
        kategoriResponse,
        koleksiResponse
      ] = await Promise.all([

        api.get(
          "/api/kostum"
        ),

        api.get(
          "/api/kategori"
        ),

        api.get(
          "/api/koleksi"
        )

      ]);


      const kostumData =
        getArrayData(
          kostumResponse
        );


      const kategoriData =
        getArrayData(
          kategoriResponse
        );


      const koleksiData =
        getArrayData(
          koleksiResponse
        );


      console.log(
        "DATA KOSTUM:",
        kostumData
      );

      console.log(
        "DATA KATEGORI:",
        kategoriData
      );

      console.log(
        "DATA KOLEKSI:",
        koleksiData
      );


      setKostum(
        kostumData
      );

      setKategori(
        kategoriData
      );

      setKoleksi(
        koleksiData
      );


    } catch (error) {

      console.error(
        "GAGAL MENGAMBIL DATA:",
        error
      );


      setKostum([]);

      setKategori([]);

      setKoleksi([]);


      showMessage(
        error?.message ||
        "Gagal mengambil data.",
        "error"
      );


    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // LOAD AWAL
  // =====================================================

  useEffect(() => {

    loadData();

  }, []);


  // =====================================================
  // TAMBAH / EDIT
  // =====================================================

  const handleSubmit = async (
    form
  ) => {

    try {

      console.log(
        "FORM KOSTUM:",
        form
      );


      const formData =
        new FormData();


      // =================================================
      // KATEGORI
      // =================================================

      formData.append(
        "id_kategori",
        String(
          form.id_kategori ?? ""
        )
      );


      // =================================================
      // KOLEKSI
      // =================================================

      formData.append(
        "id_koleksi",
        String(
          form.id_koleksi ?? ""
        )
      );


      // =================================================
      // DATA KOLEKSI
      // =================================================

      formData.append(
        "kode_koleksi",
        form.kode_koleksi ?? ""
      );


      formData.append(
        "nama_koleksi",
        form.nama_koleksi ?? ""
      );


      formData.append(
        "kelompok_koleksi",
        form.kelompok_koleksi ?? ""
      );


      // =================================================
      // DATA KOSTUM
      // =================================================

      formData.append(
        "nama_kostum",
        form.nama_kostum ?? ""
      );


      formData.append(
        "ukuran",
        form.ukuran ?? ""
      );


      formData.append(
        "warna",
        form.warna ?? ""
      );


      formData.append(
        "stok",
        String(
          Number(form.stok) || 0
        )
      );


      formData.append(
        "harga_sewa",
        String(
          Number(form.harga_sewa) || 0
        )
      );


      formData.append(
        "status",
        form.status ||
        "Tersedia"
      );


      formData.append(
        "deskripsi",
        form.deskripsi ?? ""
      );


      // =================================================
      // FEATURED
      // =================================================
      //
      // Ini dipisahkan dari FOTO.
      //
      // featured adalah 0/1.
      // FOTO tetap dikirim sebagai FILE.
      //

      formData.append(
        "featured",
        form.featured ? "1" : "0"
      );


      // =================================================
      // FOTO
      // =================================================

      if (
        form.foto_file
      ) {

        formData.append(
          "foto",
          form.foto_file
        );

      }


      // =================================================
      // DEBUG
      // =================================================

      for (
        const [
          key,
          value
        ] of formData.entries()
      ) {

        console.log(
          "FORM DATA:",
          key,
          value
        );

      }


      // =================================================
      // REQUEST
      // =================================================

      if (editData) {

        await api.put(
          `/api/kostum/${editData.id_kostum}`,
          formData
        );


        showMessage(
          "Data kostum berhasil diperbarui."
        );

      } else {

        await api.post(
          "/api/kostum",
          formData
        );


        showMessage(
          "Kostum berhasil ditambahkan."
        );
      }


      // =================================================
      // RESET
      // =================================================

      setModalOpen(false);

      setEditData(null);


      // =================================================
      // LOAD ULANG
      // =================================================

      await loadData();


    } catch (error) {

      console.error(
        "GAGAL SIMPAN KOSTUM:",
        error
      );


      showMessage(
        error?.message ||
        "Gagal menyimpan kostum.",
        "error"
      );
    }
  };


  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = (
    item
  ) => {

    setConfirmDelete(
      item
    );
  };


  const executeDelete =
    async () => {

      if (
        !confirmDelete
      ) {

        return;
      }


      try {

        setDeleteLoading(
          true
        );


        await api.delete(
          `/api/kostum/${confirmDelete.id_kostum}`
        );


        setConfirmDelete(
          null
        );


        showMessage(
          "Kostum berhasil dihapus."
        );


        await loadData();


      } catch (error) {

        console.error(
          "GAGAL HAPUS KOSTUM:",
          error
        );


        showMessage(
          error?.message ||
          "Gagal menghapus kostum.",
          "error"
        );


      } finally {

        setDeleteLoading(
          false
        );
      }
    };


  // =====================================================
  // FOTO URL
  // =====================================================

  const getFotoUrl = (
    foto
  ) => {

    if (!foto) {
      return "";
    }


    const value =
      String(
        foto
      ).trim();


    if (!value) {
      return "";
    }


    if (
      value.startsWith(
        "http://"
      ) ||
      value.startsWith(
        "https://"
      )
    ) {

      return value;
    }


    if (
      value.startsWith(
        "/uploads/"
      )
    ) {

      return value;
    }


    if (
      value.startsWith(
        "uploads/"
      )
    ) {

      return `/${value}`;
    }


    return `/uploads/kostum/${value}`;
  };


  // =====================================================
  // FILTER
  // =====================================================

  const keyword =
    search
      .trim()
      .toLowerCase();


  const filtered =
    kostum.filter(
      (item) => {

        if (!keyword) {
          return true;
        }


        return (

          String(
            item.nama_kostum ||
            ""
          )
            .toLowerCase()
            .includes(keyword)

          ||

          String(
            item.kode_koleksi ||
            ""
          )
            .toLowerCase()
            .includes(keyword)

          ||

          String(
            item.nama_koleksi ||
            ""
          )
            .toLowerCase()
            .includes(keyword)

          ||

          String(
            item.nama_koleksi_koleksi ||
            ""
          )
            .toLowerCase()
            .includes(keyword)

          ||

          String(
            item.nama_kategori ||
            ""
          )
            .toLowerCase()
            .includes(keyword)

          ||

          String(
            item.kelompok_koleksi ||
            ""
          )
            .toLowerCase()
            .includes(keyword)

          ||

          String(
            item.warna ||
            ""
          )
            .toLowerCase()
            .includes(keyword)

        );
      }
    );


  // =====================================================
  // RUPIAH
  // =====================================================

  const formatRupiah =
    (value) => {

      return new Intl.NumberFormat(
        "id-ID",
        {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0
        }
      ).format(
        Number(value) || 0
      );
    };


  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle =
    (status) => {

      const normalized =
        String(
          status || ""
        )
          .toLowerCase()
          .trim();


      if (
        normalized.includes(
          "tersedia"
        )
      ) {

        return {

          background:
            "rgba(76,175,80,0.10)",

          border:
            "1px solid rgba(76,175,80,0.22)",

          color:
            "#79d27d"
        };
      }


      if (
        normalized.includes(
          "tidak"
        )
      ) {

        return {

          background:
            "rgba(220,70,70,0.10)",

          border:
            "1px solid rgba(220,70,70,0.22)",

          color:
            "#ff7e7e"
        };
      }


      if (
        normalized.includes(
          "rusak"
        )
      ) {

        return {

          background:
            "rgba(220,70,70,0.10)",

          border:
            "1px solid rgba(220,70,70,0.22)",

          color:
            "#ff7e7e"
        };
      }


      return {

        background:
          "rgba(212,175,55,0.10)",

        border:
          "1px solid rgba(212,175,55,0.22)",

        color:
          "#d4af37"
      };
    };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div
      style={
        styles.page
      }
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        style={
          styles.heading
        }
      >

        <div>

          <span
            style={
              styles.kicker
            }
          >
            KOLEKSI
          </span>


          <h2
            style={
              styles.title
            }
          >
            Kostum
          </h2>


          <p
            style={
              styles.subtitle
            }
          >
            Kelola koleksi kostum Handu Atelier.
          </p>

        </div>


        <button
          type="button"
          aria-label="Tambah Kostum"
          style={
            styles.primaryButton
          }
          onClick={
            openAddForm
          }
        >

          <Icon
            name="plus"
            size={17}
          />

          Tambah Kostum

        </button>

      </div>


      {/* =================================================
          CARD
      ================================================= */}

      <div
        style={
          styles.card
        }
      >

        {/* =================================================
            TOOLBAR
        ================================================= */}

        <div
          style={
            styles.toolbar
          }
        >

          <div
            style={
              styles.searchBox
            }
          >

            <Icon
              name="search"
              size={17}
            />


            <input
              type="text"
              value={
                search
              }
              onChange={
                (event) =>
                  setSearch(
                    event.target.value
                  )
              }
              placeholder="Cari kostum..."
              style={
                styles.searchInput
              }
            />

          </div>


          <span
            style={
              styles.resultCount
            }
          >
            {
              filtered.length
            }{" "}
            Kostum
          </span>

        </div>


        {/* =================================================
            MESSAGE
        ================================================= */}

        {message && (

          <div
            style={{
              ...styles.message,

              ...(messageType === "error"
                ? styles.errorMessage
                : styles.successMessage)
            }}
          >
            {
              message
            }
          </div>

        )}


        {/* =================================================
            TABLE
        ================================================= */}

        {
          loading ? (

            <div
              style={
                styles.loading
              }
            >
              Memuat data kostum...
            </div>

          ) : filtered.length === 0 ? (

            <div
              style={
                styles.empty
              }
            >
              {
                search
                  ? "Kostum tidak ditemukan."
                  : "Belum ada data kostum."
              }
            </div>

          ) : (

            <div
              style={
                styles.tableWrapper
              }
            >

              <table
                style={
                  styles.table
                }
              >

                <thead>

                  <tr>

                    <th
                      style={
                        styles.th
                      }
                    >
                      No
                    </th>


                    <th
                      style={
                        styles.th
                      }
                    >
                      Kostum
                    </th>


                    <th
                      style={
                        styles.th
                      }
                    >
                      Kategori
                    </th>


                    <th
                      style={
                        styles.th
                      }
                    >
                      Kelompok
                    </th>


                    <th
                      style={
                        styles.th
                      }
                    >
                      Warna
                    </th>


                    <th
                      style={
                        styles.th
                      }
                    >
                      Stok
                    </th>


                    <th
                      style={
                        styles.th
                      }
                    >
                      Harga Sewa
                    </th>


                    <th
                      style={
                        styles.th
                      }
                    >
                      Status
                    </th>


                    <th
                      style={
                        styles.th
                      }
                    >
                      Aksi
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {
                    filtered.map(
                      (
                        item,
                        index
                      ) => {

                        const foto =
                          getFotoUrl(
                            item.foto
                          );


                        return (

                          <tr
                            key={
                              item.id_kostum ||
                              index
                            }
                          >

                            {/* NO */}

                            <td
                              style={
                                styles.td
                              }
                            >
                              {
                                index + 1
                              }
                            </td>


                            {/* KOSTUM */}

                            <td
                              style={
                                styles.td
                              }
                            >

                              <div
                                style={
                                  styles.costumeItem
                                }
                              >

                                <div
                                  style={
                                    styles.costumeImage
                                  }
                                >

                                  {
                                    foto ? (

                                      <img
                                        src={
                                          foto
                                        }
                                        alt={
                                          item.nama_kostum ||
                                          "Kostum"
                                        }
                                        style={
                                          styles.costumeImageImg
                                        }
                                        onError={
                                          (event) => {
                                            event.currentTarget.style.display =
                                              "none";
                                          }
                                        }
                                      />

                                    ) : (

                                      <Icon
                                        name="costume"
                                        size={23}
                                      />

                                    )
                                  }

                                </div>


                                <div>

                                  <span
                                    style={
                                      styles.costumeName
                                    }
                                  >
                                    {
                                      item.nama_kostum ||
                                      "-"
                                    }
                                  </span>


                                  <span
                                    style={
                                      styles.costumeCode
                                    }
                                  >
                                    {
                                      item.kode_koleksi ||
                                      "-"
                                    }
                                  </span>

                                </div>

                              </div>

                            </td>


                            {/* KATEGORI */}

                            <td
                              style={
                                styles.td
                              }
                            >
                              {
                                item.nama_kategori ||
                                "-"
                              }
                            </td>


                            {/* KELOMPOK */}

                            <td
                              style={
                                styles.td
                              }
                            >
                              {
                                item.kelompok_koleksi ||
                                "-"
                              }
                            </td>


                            {/* WARNA */}

                            <td
                              style={
                                styles.td
                              }
                            >
                              {
                                item.warna ||
                                "-"
                              }
                            </td>


                            {/* STOK */}

                            <td
                              style={
                                styles.td
                              }
                            >

                              <span
                                style={
                                  styles.stockBadge
                                }
                              >
                                {
                                  item.stok ??
                                  0
                                }
                              </span>

                            </td>


                            {/* HARGA */}

                            <td
                              style={
                                styles.td
                              }
                            >
                              {
                                formatRupiah(
                                  item.harga_sewa
                                )
                              }
                            </td>


                            {/* STATUS */}

                            <td
                              style={
                                styles.td
                              }
                            >

                              <span
                                style={{
                                  ...styles.statusBadge,
                                  ...getStatusStyle(
                                    item.status
                                  )
                                }}
                              >
                                {
                                  item.status ||
                                  "-"
                                }
                              </span>

                            </td>


                            {/* AKSI */}

                            <td
                              style={
                                styles.td
                              }
                            >

                              <div
                                style={
                                  styles.actionGroup
                                }
                              >

                                <button
                                  type="button"
                                  title="Edit"
                                  style={{
                                    ...styles.actionButton,
                                    border:
                                      "1px solid rgba(212,175,55,0.22)",
                                    background:
                                      "rgba(212,175,55,0.08)",
                                    color:
                                      "#d4af37"
                                  }}
                                  onClick={() => {

                                    setEditData(
                                      item
                                    );

                                    setModalOpen(
                                      true
                                    );

                                  }}
                                >

                                  <Icon
                                    name="edit"
                                    size={15}
                                  />

                                </button>


                                <button
                                  type="button"
                                  title="Hapus"
                                  style={{
                                    ...styles.actionButton,
                                    border:
                                      "1px solid rgba(220,70,70,0.22)",
                                    background:
                                      "rgba(220,70,70,0.08)",
                                    color:
                                      "#ff7d7d"
                                  }}
                                  onClick={() =>
                                    handleDelete(
                                      item
                                    )
                                  }
                                >

                                  <Icon
                                    name="trash"
                                    size={15}
                                  />

                                </button>

                              </div>

                            </td>

                          </tr>

                        );
                      }
                    )
                  }

                </tbody>

              </table>

            </div>

          )
        }

      </div>


      {/* =================================================
          MODAL
      ================================================= */}

      <AddKostumModal

        isOpen={
          modalOpen
        }

        onClose={() => {

          setModalOpen(
            false
          );

          setEditData(
            null
          );

        }}

        onSubmit={
          handleSubmit
        }

        categories={
          kategori
        }

        collections={
          koleksi
        }

        initialData={
          editData
        }

      />


      {/* =================================================
          DELETE CONFIRMATION
      ================================================= */}

      {
        confirmDelete && (

          <div
            style={
              styles.modalOverlay
            }
            onClick={() => {

              if (
                !deleteLoading
              ) {

                setConfirmDelete(
                  null
                );

              }

            }}
          >

            <div
              style={
                styles.confirmModal
              }
              onClick={
                (event) =>
                  event.stopPropagation()
              }
            >

              <div
                style={
                  styles.confirmHeader
                }
              >

                <h3
                  style={
                    styles.confirmTitle
                  }
                >
                  Hapus Kostum?
                </h3>


                <p
                  style={
                    styles.confirmText
                  }
                >

                  Apakah kamu yakin ingin
                  menghapus kostum{" "}

                  <span
                    style={
                      styles.confirmName
                    }
                  >
                    "
                    {
                      confirmDelete.nama_kostum ||
                      "kostum ini"
                    }
                    "
                  </span>

                  ?

                  <br />

                  Tindakan ini tidak
                  dapat dibatalkan.

                </p>

              </div>


              <div
                style={
                  styles.confirmActions
                }
              >

                <button
                  type="button"
                  style={
                    styles.cancelButton
                  }
                  disabled={
                    deleteLoading
                  }
                  onClick={() =>
                    setConfirmDelete(
                      null
                    )
                  }
                >
                  Batal
                </button>


                <button
                  type="button"
                  style={
                    styles.deleteButton
                  }
                  disabled={
                    deleteLoading
                  }
                  onClick={
                    executeDelete
                  }
                >
                  {
                    deleteLoading
                      ? "Menghapus..."
                      : "Ya, Hapus"
                  }
                </button>

              </div>

            </div>

          </div>

        )
      }

    </div>
  );
};


export default KostumManagement;