import React, {
    useEffect,
    useState
} from "react";

import api from "../../lib/api";


const KoleksiPage = () => {

    // ==================================================
    // STATE
    // ==================================================

    const [
        koleksi,
        setKoleksi
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        saving,
        setSaving
    ] = useState(false);

    const [
        search,
        setSearch
    ] = useState("");

    const [
        showModal,
        setShowModal
    ] = useState(false);

    const [
        editMode,
        setEditMode
    ] = useState(false);

    const [
        selectedFile,
        setSelectedFile
    ] = useState(null);

    const [
        previewUrl,
        setPreviewUrl
    ] = useState("");

    const [
        form,
        setForm
    ] = useState({
        id_koleksi: null,
        nama_koleksi: "",
        foto: "",
        deskripsi: "",
        status: "Aktif"
    });


    // ==================================================
    // LOAD KOLEKSI
    // ==================================================

    const loadKoleksi = async () => {

        try {

            setLoading(true);


            const response =
                await api.get(
                    `/koleksi?_=${Date.now()}`
                );


            /*
             * API kamu bisa mengembalikan:
             *
             * response.data
             * atau
             * response.data.data
             *
             */

            let result =
                response?.data;


            console.log(
                "DATA KOLEKSI:",
                result
            );


            // ==================================================
            // JIKA RESPONSE BERBENTUK:
            //
            // {
            //   success: true,
            //   total: 5,
            //   data: [...]
            // }
            // ==================================================

            if (
                result &&
                !Array.isArray(result) &&
                Array.isArray(result.data)
            ) {

                result =
                    result.data;

            }


            // ==================================================
            // JIKA RESPONSE BERBENTUK:
            //
            // {
            //   koleksi: [...]
            // }
            // ==================================================

            if (
                result &&
                !Array.isArray(result) &&
                Array.isArray(result.koleksi)
            ) {

                result =
                    result.koleksi;

            }


            // ==================================================
            // PASTIKAN ARRAY
            // ==================================================

            if (
                Array.isArray(result)
            ) {

                setKoleksi(
                    result
                );

            } else {

                setKoleksi([]);

            }


        } catch (error) {

            console.error(
                "Gagal mengambil koleksi:",
                error
            );


            setKoleksi([]);


            alert(
                error?.message ||
                "Gagal mengambil data koleksi"
            );


        } finally {

            setLoading(false);

        }

    };


    // ==================================================
    // LOAD AWAL
    // ==================================================

    useEffect(() => {

        loadKoleksi();

    }, []);


    // ==================================================
    // FORMAT FOTO URL
    // ==================================================
    //
    // PENTING:
    //
    // Jangan gunakan:
    // http://localhost:3001
    //
    // Gunakan:
    // /uploads/koleksi/nama-file.jpg
    //
    // Karena Vite sudah melakukan proxy
    // /uploads ke backend.
    //
    // ==================================================

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


        // ==================================================
        // URL LENGKAP
        // ==================================================

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


        // ==================================================
        // /uploads/...
        //
        // CONTOH:
        // /uploads/koleksi/dokter.jpg
        //
        // JANGAN DIUBAH KE localhost:3001
        // ==================================================

        if (
            value.startsWith(
                "/uploads/"
            )
        ) {

            return value;

        }


        // ==================================================
        // uploads/...
        //
        // CONTOH:
        // uploads/koleksi/dokter.jpg
        //
        // MENJADI:
        // /uploads/koleksi/dokter.jpg
        // ==================================================

        if (
            value.startsWith(
                "uploads/"
            )
        ) {

            return `/${value}`;

        }


        // ==================================================
        // JIKA HANYA NAMA FILE
        //
        // CONTOH:
        // dokter.jpg
        //
        // MENJADI:
        // /uploads/koleksi/dokter.jpg
        // ==================================================

        return `/uploads/koleksi/${value}`;

    };


    // ==================================================
    // HANDLE TEXT INPUT
    // ==================================================

    const handleChange = (
        e
    ) => {

        const {
            name,
            value
        } = e.target;


        setForm(
            (prev) => ({
                ...prev,

                [name]:
                    value
            })
        );

    };


    // ==================================================
    // HANDLE FILE
    // ==================================================

    const handleFileChange = (
        e
    ) => {

        const file =
            e.target.files?.[0];


        if (!file) {

            setSelectedFile(
                null
            );

            return;

        }


        // ==================================================
        // FORMAT
        // ==================================================

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


            e.target.value =
                "";


            return;

        }


        // ==================================================
        // MAX 5 MB
        // ==================================================

        if (
            file.size >
            5 * 1024 * 1024
        ) {

            alert(
                "Ukuran foto maksimal 5 MB."
            );


            e.target.value =
                "";


            return;

        }


        // ==================================================
        // HAPUS PREVIEW BLOB LAMA
        // ==================================================

        if (
            previewUrl &&
            previewUrl.startsWith(
                "blob:"
            )
        ) {

            URL.revokeObjectURL(
                previewUrl
            );

        }


        // ==================================================
        // SIMPAN FILE
        // ==================================================

        setSelectedFile(
            file
        );


        // ==================================================
        // PREVIEW FILE BARU
        // ==================================================

        const url =
            URL.createObjectURL(
                file
            );


        setPreviewUrl(
            url
        );

    };


    // ==================================================
    // OPEN ADD
    // ==================================================

    const handleAdd = () => {

        setEditMode(
            false
        );


        setSelectedFile(
            null
        );


        setPreviewUrl(
            ""
        );


        setForm({
            id_koleksi: null,
            nama_koleksi: "",
            foto: "",
            deskripsi: "",
            status: "Aktif"
        });


        setShowModal(
            true
        );

    };


    // ==================================================
    // OPEN EDIT
    // ==================================================

    const handleEdit = (
        item
    ) => {

        setEditMode(
            true
        );


        setSelectedFile(
            null
        );


        setForm({

            id_koleksi:
                item.id_koleksi,

            nama_koleksi:
                item.nama_koleksi ||
                "",

            foto:
                item.foto ||
                "",

            deskripsi:
                item.deskripsi ||
                "",

            status:
                item.status ||
                "Aktif"

        });


        // ==================================================
        // FOTO LAMA
        // ==================================================

        setPreviewUrl(

            item.foto
                ? getFotoUrl(
                    item.foto
                )
                : ""

        );


        setShowModal(
            true
        );

    };


    // ==================================================
    // CLOSE MODAL
    // ==================================================

    const closeModal = () => {

        if (
            saving
        ) {

            return;

        }


        // ==================================================
        // HAPUS BLOB URL
        // ==================================================

        if (
            previewUrl &&
            previewUrl.startsWith(
                "blob:"
            )
        ) {

            URL.revokeObjectURL(
                previewUrl
            );

        }


        setShowModal(
            false
        );


        setEditMode(
            false
        );


        setSelectedFile(
            null
        );


        setPreviewUrl(
            ""
        );


        setForm({

            id_koleksi:
                null,

            nama_koleksi:
                "",

            foto:
                "",

            deskripsi:
                "",

            status:
                "Aktif"

        });

    };


    // ==================================================
    // SAVE
    // ==================================================

    const handleSubmit = async (
        e
    ) => {

        e.preventDefault();


        // ==================================================
        // VALIDASI NAMA
        // ==================================================

        if (
            !form.nama_koleksi.trim()
        ) {

            alert(
                "Nama koleksi wajib diisi."
            );


            return;

        }


        try {

            setSaving(
                true
            );


            // ==================================================
            // FORMDATA
            // ==================================================

            const formData =
                new FormData();


            // ==================================================
            // NAMA
            // ==================================================

            formData.append(
                "nama_koleksi",
                form.nama_koleksi.trim()
            );


            // ==================================================
            // DESKRIPSI
            // ==================================================

            formData.append(
                "deskripsi",
                form.deskripsi?.trim() ||
                ""
            );


            // ==================================================
            // STATUS
            // ==================================================

            formData.append(
                "status",
                form.status ||
                "Aktif"
            );


            // ==================================================
            // FOTO BARU
            // ==================================================

            if (
                selectedFile
            ) {

                formData.append(
                    "foto",
                    selectedFile
                );

            }


            // ==================================================
            // DEBUG
            // ==================================================

            for (
                const [
                    key,
                    value
                ]
                of formData.entries()
            ) {

                console.log(
                    "FORM KOLEKSI:",
                    key,
                    value
                );

            }


            // ==================================================
            // UPDATE
            // ==================================================

            if (
                editMode
            ) {

                await api.put(
                    `/koleksi/${form.id_koleksi}`,
                    formData
                );


                alert(
                    "Koleksi berhasil diperbarui."
                );

            }


            // ==================================================
            // CREATE
            // ==================================================

            else {

                await api.post(
                    "/koleksi",
                    formData
                );


                alert(
                    "Koleksi berhasil ditambahkan."
                );

            }


            // ==================================================
            // CLOSE
            // ==================================================

            closeModal();


            // ==================================================
            // RELOAD
            // ==================================================

            await loadKoleksi();


        } catch (
            error
        ) {

            console.error(
                "Gagal menyimpan koleksi:",
                error
            );


            alert(
                error?.response?.data?.message ||
                error?.message ||
                "Gagal menyimpan koleksi."
            );


        } finally {

            setSaving(
                false
            );

        }

    };


    // ==================================================
    // DELETE
    // ==================================================

    const handleDelete =
        async (
            id
        ) => {

            const yakin =
                window.confirm(
                    "Yakin ingin menghapus koleksi ini?"
                );


            if (
                !yakin
            ) {

                return;

            }


            try {

                await api.delete(
                    `/koleksi/${id}`
                );


                alert(
                    "Koleksi berhasil dihapus."
                );


                await loadKoleksi();


            } catch (
                error
            ) {

                console.error(
                    "Gagal menghapus koleksi:",
                    error
                );


                alert(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Koleksi tidak dapat dihapus."
                );

            }

        };


    // ==================================================
    // SEARCH
    // ==================================================

    const keyword =
        search
            .toLowerCase()
            .trim();


    const filteredKoleksi =
        koleksi.filter(
            (item) => {

                return String(
                    item.nama_koleksi ||
                    ""
                )
                    .toLowerCase()
                    .includes(
                        keyword
                    );

            }
        );


    // ==================================================
    // RENDER
    // ==================================================

    return (

        <>

            <style>
                {`

                .koleksi-page {
                    width: 100%;
                    min-height: 100%;
                    padding: 30px;
                    box-sizing: border-box;
                    color: #f5f5f5;
                }


                .koleksi-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 25px;
                }


                .koleksi-header h1 {
                    margin: 0;
                    color: #ffffff;
                    font-size: 30px;
                    font-weight: 700;
                }


                .koleksi-header p {
                    margin: 6px 0 0;
                    color: #999999;
                }


                .btn-add {
                    min-height: 44px;
                    padding: 12px 20px;
                    border: 1px solid #d9b43b;
                    border-radius: 8px;
                    background: #d9b43b;
                    color: #111111;
                    font-size: 14px;
                    font-weight: 700;
                    cursor: pointer;
                }


                .btn-add:hover {
                    background: #edca51;
                }


                .koleksi-toolbar {
                    margin-bottom: 25px;
                }


                .koleksi-toolbar input {
                    width: 100%;
                    max-width: 400px;
                    height: 46px;
                    box-sizing: border-box;
                    padding: 13px 15px;
                    border: 1px solid #333333;
                    border-radius: 8px;
                    outline: none;
                    background: #181818;
                    color: #ffffff;
                }


                .koleksi-toolbar input:focus {
                    border-color: #d9b43b;
                }


                .koleksi-grid {
                    display: grid;
                    grid-template-columns:
                        repeat(
                            auto-fill,
                            minmax(280px, 1fr)
                        );
                    gap: 20px;
                }


                .koleksi-card {
                    overflow: hidden;
                    background: #181818;
                    border: 1px solid #2c2c2c;
                    border-radius: 14px;
                }


                .koleksi-image {
                    width: 100%;
                    height: 190px;
                    overflow: hidden;
                    background: #111111;
                }


                .koleksi-image img {
                    display: block;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }


                .no-image {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #777777;
                    font-size: 13px;
                }


                .koleksi-content {
                    padding: 20px;
                }


                .koleksi-title {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 10px;
                }


                .koleksi-title h2 {
                    margin: 0;
                    color: #ffffff;
                    font-size: 21px;
                    line-height: 1.3;
                }


                .jumlah {
                    margin: 10px 0 0;
                    color: #d9b43b;
                    font-weight: 600;
                }


                .deskripsi {
                    margin: 12px 0 0;
                    color: #999999;
                    line-height: 1.6;
                    min-height: 75px;
                }


                .status {
                    padding: 5px 9px;
                    border-radius: 20px;
                    font-size: 11px;
                    white-space: nowrap;
                }


                .status.aktif {
                    background: #183c26;
                    color: #68d391;
                }


                .status.nonaktif {
                    background: #3b1c1c;
                    color: #f87171;
                }


                .card-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 15px;
                }


                .card-actions button {
                    flex: 1;
                    min-height: 40px;
                    padding: 10px;
                    border-radius: 7px;
                    font-weight: 600;
                    cursor: pointer;
                }


                .btn-edit {
                    border: 1px solid #d9b43b;
                    background: transparent;
                    color: #d9b43b;
                }


                .btn-edit:hover {
                    background: rgba(
                        217,
                        180,
                        59,
                        0.10
                    );
                }


                .btn-delete {
                    border: 1px solid #9b3333;
                    background: transparent;
                    color: #ff6b6b;
                }


                .btn-delete:hover {
                    background: rgba(
                        155,
                        51,
                        51,
                        0.12
                    );
                }


                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 99999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    background: rgba(
                        0,
                        0,
                        0,
                        0.78
                    );
                    overflow-y: auto;
                }


                .modal {
                    width: 500px;
                    max-width: 100%;
                    max-height: calc(
                        100vh - 40px
                    );
                    overflow-y: auto;
                    box-sizing: border-box;
                    padding: 25px;
                    background: #181818;
                    border: 1px solid #333333;
                    border-radius: 14px;
                }


                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }


                .modal-header h2 {
                    margin: 0;
                    color: #ffffff;
                    font-size: 22px;
                }


                .modal-header button {
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: none;
                    border-radius: 7px;
                    background: transparent;
                    color: #ffffff;
                    font-size: 28px;
                    cursor: pointer;
                }


                .modal-header button:hover {
                    background: rgba(
                        255,
                        255,
                        255,
                        0.08
                    );
                    color: #d9b43b;
                }


                .form-group {
                    margin-bottom: 18px;
                }


                .form-group label {
                    display: block;
                    margin-bottom: 7px;
                    color: #dddddd;
                    font-size: 13px;
                    font-weight: 600;
                }


                .form-group input,
                .form-group textarea,
                .form-group select {
                    width: 100%;
                    box-sizing: border-box;
                    padding: 12px;
                    border: 1px solid #333333;
                    border-radius: 7px;
                    outline: none;
                    background: #111111;
                    color: #ffffff;
                    font-size: 14px;
                }


                .form-group input:focus,
                .form-group textarea:focus,
                .form-group select:focus {
                    border-color: #d9b43b;
                }


                .form-group textarea {
                    min-height: 110px;
                    resize: vertical;
                }


                .form-help {
                    margin-top: 6px;
                    color: #777777;
                    font-size: 11px;
                    line-height: 1.5;
                }


                .photo-preview {
                    width: 100%;
                    height: 220px;
                    margin-top: 10px;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #0d0d0d;
                    border: 1px solid
                        rgba(
                            217,
                            180,
                            59,
                            0.20
                        );
                    border-radius: 9px;
                }


                .photo-preview img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }


                .old-photo-note {
                    margin-top: 7px;
                    color: #d9b43b;
                    font-size: 11px;
                }


                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    margin-top: 25px;
                    padding-top: 18px;
                    border-top: 1px solid
                        rgba(
                            255,
                            255,
                            255,
                            0.07
                        );
                }


                .btn-cancel,
                .btn-save {
                    min-height: 42px;
                    padding: 11px 20px;
                    border-radius: 7px;
                    font-weight: 600;
                    cursor: pointer;
                }


                .btn-cancel {
                    border: 1px solid #444444;
                    background: transparent;
                    color: #ffffff;
                }


                .btn-save {
                    border: 1px solid #d9b43b;
                    background: #d9b43b;
                    color: #111111;
                }


                .btn-save:disabled,
                .btn-cancel:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }


                .loading,
                .empty {
                    text-align: center;
                    padding: 50px;
                    color: #888888;
                }


                @media (max-width: 700px) {

                    .koleksi-page {
                        padding: 18px 14px;
                    }


                    .koleksi-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }


                    .btn-add {
                        width: 100%;
                    }


                    .koleksi-toolbar input {
                        max-width: none;
                    }


                    .koleksi-grid {
                        grid-template-columns: 1fr;
                    }


                    .modal-actions {
                        flex-direction: column-reverse;
                    }


                    .btn-cancel,
                    .btn-save {
                        width: 100%;
                    }

                }

                `}
            </style>


            <div
                className="koleksi-page"
            >

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div
                    className="koleksi-header"
                >

                    <div>

                        <h1>
                            Koleksi
                        </h1>

                        <p>
                            Kelola kelompok koleksi kostum
                        </p>

                    </div>


                    <button
                        type="button"
                        className="btn-add"
                        onClick={
                            handleAdd
                        }
                    >
                        + Tambah Koleksi
                    </button>

                </div>


                {/* ==================================================
                    SEARCH
                ================================================== */}

                <div
                    className="koleksi-toolbar"
                >

                    <input
                        type="text"
                        placeholder="Cari koleksi..."
                        value={
                            search
                        }
                        onChange={
                            (e) =>
                                setSearch(
                                    e.target.value
                                )
                        }
                    />

                </div>


                {/* ==================================================
                    CONTENT
                ================================================== */}

                {
                    loading ? (

                        <div
                            className="loading"
                        >
                            Memuat data...
                        </div>

                    ) : (

                        <div
                            className="koleksi-grid"
                        >

                            {
                                filteredKoleksi.map(
                                    (
                                        item
                                    ) => {

                                        const fotoUrl =
                                            getFotoUrl(
                                                item.foto
                                            );


                                        return (

                                            <div
                                                className="koleksi-card"
                                                key={
                                                    item.id_koleksi
                                                }
                                            >

                                                {/* ======================================
                                                    FOTO
                                                ====================================== */}

                                                <div
                                                    className="koleksi-image"
                                                >

                                                    {
                                                        fotoUrl ? (

                                                            <img
                                                                src={
                                                                    fotoUrl
                                                                }
                                                                alt={
                                                                    item.nama_koleksi ||
                                                                    "Koleksi"
                                                                }
                                                                onError={
                                                                    (
                                                                        e
                                                                    ) => {

                                                                        console.error(
                                                                            "Gagal memuat foto koleksi:",
                                                                            fotoUrl
                                                                        );


                                                                        e.currentTarget.style.display =
                                                                            "none";


                                                                        const parent =
                                                                            e.currentTarget.parentElement;


                                                                        if (
                                                                            parent &&
                                                                            !parent.querySelector(
                                                                                ".no-image"
                                                                            )
                                                                        ) {

                                                                            const fallback =
                                                                                document.createElement(
                                                                                    "div"
                                                                                );


                                                                            fallback.className =
                                                                                "no-image";


                                                                            fallback.textContent =
                                                                                "Foto tidak tersedia";


                                                                            parent.appendChild(
                                                                                fallback
                                                                            );

                                                                        }

                                                                    }
                                                                }
                                                            />

                                                        ) : (

                                                            <div
                                                                className="no-image"
                                                            >
                                                                Tidak ada foto
                                                            </div>

                                                        )
                                                    }

                                                </div>


                                                {/* ======================================
                                                    CONTENT
                                                ====================================== */}

                                                <div
                                                    className="koleksi-content"
                                                >

                                                    <div
                                                        className="koleksi-title"
                                                    >

                                                        <h2>
                                                            {
                                                                item.nama_koleksi
                                                            }
                                                        </h2>


                                                        <span
                                                            className={
                                                                String(
                                                                    item.status ||
                                                                    ""
                                                                ).toLowerCase() ===
                                                                "aktif"
                                                                    ? "status aktif"
                                                                    : "status nonaktif"
                                                            }
                                                        >
                                                            {
                                                                item.status
                                                            }
                                                        </span>

                                                    </div>


                                                    <p
                                                        className="jumlah"
                                                    >

                                                        {
                                                            item.jumlah_kostum ||
                                                            0
                                                        }{" "}
                                                        Kostum

                                                    </p>


                                                    <p
                                                        className="deskripsi"
                                                    >

                                                        {
                                                            item.deskripsi ||
                                                            "Belum ada deskripsi."
                                                        }

                                                    </p>


                                                    <div
                                                        className="card-actions"
                                                    >

                                                        <button
                                                            type="button"
                                                            className="btn-edit"
                                                            onClick={
                                                                () =>
                                                                    handleEdit(
                                                                        item
                                                                    )
                                                            }
                                                        >
                                                            Edit
                                                        </button>


                                                        <button
                                                            type="button"
                                                            className="btn-delete"
                                                            onClick={
                                                                () =>
                                                                    handleDelete(
                                                                        item.id_koleksi
                                                                    )
                                                            }
                                                        >
                                                            Hapus
                                                        </button>

                                                    </div>

                                                </div>

                                            </div>

                                        );

                                    }
                                )
                            }

                        </div>

                    )
                }


                {/* ==================================================
                    EMPTY
                ================================================== */}

                {
                    !loading &&
                    filteredKoleksi.length ===
                        0 && (

                        <div
                            className="empty"
                        >

                            {
                                search
                                    ? "Koleksi tidak ditemukan."
                                    : "Data koleksi tidak ditemukan."
                            }

                        </div>

                    )
                }


                {/* ==================================================
                    MODAL
                ================================================== */}

                {
                    showModal && (

                        <div
                            className="modal-overlay"
                            onMouseDown={
                                (e) => {

                                    if (
                                        e.target ===
                                        e.currentTarget
                                    ) {

                                        closeModal();

                                    }

                                }
                            }
                        >

                            <div
                                className="modal"
                                onMouseDown={
                                    (e) =>
                                        e.stopPropagation()
                                }
                            >

                                <div
                                    className="modal-header"
                                >

                                    <h2>
                                        {
                                            editMode
                                                ? "Edit Koleksi"
                                                : "Tambah Koleksi"
                                        }
                                    </h2>


                                    <button
                                        type="button"
                                        onClick={
                                            closeModal
                                        }
                                        disabled={
                                            saving
                                        }
                                    >
                                        ×
                                    </button>

                                </div>


                                <form
                                    onSubmit={
                                        handleSubmit
                                    }
                                >

                                    {/* ==========================================
                                        NAMA
                                    ========================================== */}

                                    <div
                                        className="form-group"
                                    >

                                        <label>
                                            Nama Koleksi *
                                        </label>


                                        <input
                                            type="text"
                                            name="nama_koleksi"
                                            value={
                                                form.nama_koleksi
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Contoh: Tradisional"
                                            autoComplete="off"
                                            required
                                        />

                                    </div>


                                    {/* ==========================================
                                        FOTO
                                    ========================================== */}

                                    <div
                                        className="form-group"
                                    >

                                        <label>
                                            Foto Koleksi
                                        </label>


                                        <input
                                            type="file"
                                            name="foto"
                                            accept="
                                                .jpg,
                                                .jpeg,
                                                .png,
                                                .webp,
                                                image/jpeg,
                                                image/png,
                                                image/webp
                                            "
                                            onChange={
                                                handleFileChange
                                            }
                                        />


                                        <div
                                            className="form-help"
                                        >
                                            Format JPG, JPEG,
                                            PNG, atau WEBP.
                                            Maksimal 5 MB.
                                        </div>


                                        {
                                            editMode &&
                                            form.foto &&
                                            !selectedFile && (

                                                <div
                                                    className="old-photo-note"
                                                >
                                                    Foto lama akan
                                                    dipertahankan jika
                                                    kamu tidak memilih
                                                    foto baru.
                                                </div>

                                            )
                                        }


                                        {
                                            previewUrl && (

                                                <div
                                                    className="photo-preview"
                                                >

                                                    <img
                                                        src={
                                                            previewUrl
                                                        }
                                                        alt="Preview foto koleksi"
                                                        onError={
                                                            () => {

                                                                console.error(
                                                                    "Preview foto gagal:",
                                                                    previewUrl
                                                                );


                                                                setPreviewUrl(
                                                                    ""
                                                                );

                                                            }
                                                        }
                                                    />

                                                </div>

                                            )
                                        }

                                    </div>


                                    {/* ==========================================
                                        DESKRIPSI
                                    ========================================== */}

                                    <div
                                        className="form-group"
                                    >

                                        <label>
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
                                            rows="5"
                                            placeholder="Deskripsi koleksi..."
                                        />

                                    </div>


                                    {/* ==========================================
                                        STATUS
                                    ========================================== */}

                                    <div
                                        className="form-group"
                                    >

                                        <label>
                                            Status
                                        </label>


                                        <select
                                            name="status"
                                            value={
                                                form.status
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        >

                                            <option
                                                value="Aktif"
                                            >
                                                Aktif
                                            </option>


                                            <option
                                                value="Tidak Aktif"
                                            >
                                                Tidak Aktif
                                            </option>

                                        </select>

                                    </div>


                                    {/* ==========================================
                                        BUTTON
                                    ========================================== */}

                                    <div
                                        className="modal-actions"
                                    >

                                        <button
                                            type="button"
                                            className="btn-cancel"
                                            onClick={
                                                closeModal
                                            }
                                            disabled={
                                                saving
                                            }
                                        >
                                            Batal
                                        </button>


                                        <button
                                            type="submit"
                                            className="btn-save"
                                            disabled={
                                                saving
                                            }
                                        >

                                            {
                                                saving
                                                    ? "Menyimpan..."
                                                    : editMode
                                                        ? "Simpan Perubahan"
                                                        : "Tambah Koleksi"
                                            }

                                        </button>

                                    </div>

                                </form>

                            </div>

                        </div>

                    )
                }

            </div>

        </>

    );

};


export default KoleksiPage;