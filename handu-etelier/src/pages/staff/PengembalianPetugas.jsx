import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function PengembalianPetugas() {
    const navigate = useNavigate();

    // ==================================================
    // SESSION
    // ==================================================

    const [user, setUser] = useState(null);

    // ==================================================
    // DATA
    // ==================================================

    const [data, setData] = useState([]);
    const [
        peminjamanTersedia,
        setPeminjamanTersedia,
    ] = useState([]);

    // ==================================================
    // UI
    // ==================================================

    const [loading, setLoading] = useState(true);
    const [
        loadingPeminjaman,
        setLoadingPeminjaman,
    ] = useState(false);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [search, setSearch] = useState("");

    // ==================================================
    // FORM
    // ==================================================

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const getToday = () => {
        const now = new Date();

        const year = now.getFullYear();

        const month = String(
            now.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            now.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const emptyForm = {
        id_peminjaman: "",
        tanggal_pengembalian: getToday(),
        kondisi_baju: "Baik",
        denda: "0",
        keterangan: "",
    };

    const [form, setForm] = useState(
        emptyForm
    );

    // ==================================================
    // PARSE JSON
    // ==================================================

    const parseResponse = async (
        response
    ) => {
        const raw = await response.text();

        if (!raw) {
            return {};
        }

        try {
            return JSON.parse(raw);
        } catch {
            throw new Error(
                "Server mengembalikan response yang bukan JSON."
            );
        }
    };

    // ==================================================
    // CEK PETUGAS
    // ==================================================

    useEffect(() => {
        const storedUser =
            localStorage.getItem("user");

        if (!storedUser) {
            navigate("/login", {
                replace: true,
            });

            return;
        }

        try {
            const parsed =
                JSON.parse(storedUser);

            if (
                !parsed?.id_user ||
                Number(parsed.id_role) !== 2
            ) {
                navigate("/dashboard", {
                    replace: true,
                });

                return;
            }

            setUser(parsed);
        } catch (err) {
            console.error(
                "Data user tidak valid:",
                err
            );

            localStorage.removeItem("user");
            localStorage.removeItem(
                "isLoggedIn"
            );

            navigate("/login", {
                replace: true,
            });
        }
    }, [navigate]);

    // ==================================================
    // LOAD SEMUA PENGEMBALIAN
    // ==================================================

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await fetch(
                    "/pengembalian"
                );

            const result =
                await parseResponse(
                    response
                );

            if (!response.ok) {
                throw new Error(
                    result.message ||
                        "Gagal mengambil data pengembalian."
                );
            }

            const rows =
                Array.isArray(result)
                    ? result
                    : result.data;

            setData(
                Array.isArray(rows)
                    ? rows
                    : []
            );
        } catch (err) {
            console.error(
                "Load pengembalian:",
                err
            );

            setError(
                err.message ||
                    "Gagal mengambil data pengembalian."
            );
        } finally {
            setLoading(false);
        }
    };

    // ==================================================
    // LOAD PEMINJAMAN YANG BISA DIKEMBALIKAN
    // ==================================================

    const loadPeminjamanTersedia = async (
        currentPengembalianId = null
    ) => {
        try {
            setLoadingPeminjaman(true);
            setError("");

            const response =
                await fetch(
                    "/pengembalian/peminjaman-belum-dikembalikan"
                );

            const result =
                await parseResponse(
                    response
                );

            if (!response.ok) {
                throw new Error(
                    result.message ||
                        "Gagal mengambil daftar peminjaman."
                );
            }

            const rows =
                Array.isArray(result)
                    ? result
                    : result.data;

            let available =
                Array.isArray(rows)
                    ? rows
                    : [];

            // ==================================================
            // FILTER HANYA STATUS DIPROSES
            // ==================================================

            available =
                available.filter(
                    (item) =>
                        String(
                            item.status || ""
                        ).toLowerCase() ===
                        "diproses"
                );

            // ==================================================
            // MODE EDIT
            // ==================================================

            if (
                currentPengembalianId
            ) {
                const currentData =
                    data.find(
                        (item) =>
                            Number(
                                item.id_pengembalian
                            ) ===
                            Number(
                                currentPengembalianId
                            )
                    );

                if (
                    currentData &&
                    !available.some(
                        (item) =>
                            Number(
                                item.id_peminjaman
                            ) ===
                            Number(
                                currentData.id_peminjaman
                            )
                    )
                ) {
                    available = [
                        {
                            id_peminjaman:
                                currentData.id_peminjaman,

                            id_user:
                                currentData.id_user,

                            nama_user:
                                currentData.nama_user ||
                                "-",

                            nama_kostum:
                                currentData.nama_kostum ||
                                "Kostum",

                            kode_koleksi:
                                currentData.kode_koleksi ||
                                "",

                            warna:
                                currentData.warna ||
                                "",

                            ukuran:
                                currentData.ukuran ||
                                "",

                            status:
                                currentData.status ||
                                "Selesai",

                            tanggal_peminjaman:
                                currentData.tanggal_peminjaman ||
                                "",

                            tanggal_kembali:
                                currentData.tanggal_kembali ||
                                "",

                            total_harga:
                                currentData.total_harga ||
                                0,
                        },
                        ...available,
                    ];
                }
            }

            setPeminjamanTersedia(
                available
            );
        } catch (err) {
            console.error(
                "Load peminjaman tersedia:",
                err
            );

            setError(
                err.message ||
                    "Gagal mengambil daftar peminjaman."
            );
        } finally {
            setLoadingPeminjaman(false);
        }
    };

    // ==================================================
    // LOAD AWAL
    // ==================================================

    useEffect(() => {
        if (!user) {
            return;
        }

        loadData();
    }, [user]);

    // ==================================================
    // FORM CHANGE
    // ==================================================

    const handleChange = (e) => {
        const {
            name,
            value,
        } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };

    // ==================================================
    // OPEN ADD
    // ==================================================

    const openAddForm = async () => {
        setEditingId(null);

        setForm({
            ...emptyForm,
            tanggal_pengembalian:
                getToday(),
        });

        setError("");
        setSuccess("");

        setShowForm(true);

        await loadPeminjamanTersedia();

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // ==================================================
    // CLOSE FORM
    // ==================================================

    const closeForm = () => {
        setEditingId(null);
        setForm(emptyForm);
        setShowForm(false);

        setError("");
        setSuccess("");
    };

    // ==================================================
    // SUBMIT
    // ==================================================

    const handleSubmit = async (
        e
    ) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // ==================================================
        // VALIDASI
        // ==================================================

        if (
            !form.id_peminjaman ||
            Number(form.id_peminjaman) <= 0
        ) {
            setError(
                "Silakan pilih peminjaman terlebih dahulu."
            );

            return;
        }

        if (
            !form.tanggal_pengembalian
        ) {
            setError(
                "Tanggal pengembalian wajib diisi."
            );

            return;
        }

        if (!form.kondisi_baju) {
            setError(
                "Kondisi kostum wajib dipilih."
            );

            return;
        }

        if (
            Number(form.denda) < 0
        ) {
            setError(
                "Denda tidak boleh kurang dari 0."
            );

            return;
        }

        try {
            setSaving(true);

            const selected =
                peminjamanTersedia.find(
                    (item) =>
                        Number(
                            item.id_peminjaman
                        ) ===
                        Number(
                            form.id_peminjaman
                        )
                );

            // ==================================================
            // CREATE HARUS DIPROSES
            // ==================================================

            if (
                !editingId &&
                selected &&
                String(
                    selected.status || ""
                ).toLowerCase() !==
                    "diproses"
            ) {
                setError(
                    "Hanya peminjaman dengan status Diproses yang dapat dikembalikan."
                );

                setSaving(false);

                return;
            }

            // ==================================================
            // PETUGAS ID
            // ==================================================

            const idPetugas =
                user?.id_petugas ||
                user?.id_user ||
                null;

            const payload = {
                id_peminjaman:
                    Number(
                        form.id_peminjaman
                    ),

                tanggal_pengembalian:
                    form.tanggal_pengembalian,

                kondisi_baju:
                    form.kondisi_baju,

                denda:
                    Number(
                        form.denda
                    ) || 0,

                keterangan:
                    form.keterangan?.trim() ||
                    null,

                diterima_oleh:
                    idPetugas,
            };

            console.log(
                "PAYLOAD PENGEMBALIAN:",
                payload
            );

            // ==================================================
            // URL
            // ==================================================

            const url = editingId
                ? `/pengembalian/${editingId}`
                : "/pengembalian";

            const method = editingId
                ? "PUT"
                : "POST";

            const response =
                await fetch(
                    url,
                    {
                        method,

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify(
                            payload
                        ),
                    }
                );

            const result =
                await parseResponse(
                    response
                );

            if (!response.ok) {
                throw new Error(
                    result.message ||
                        "Gagal menyimpan pengembalian."
                );
            }

            setSuccess(
                editingId
                    ? "Pengembalian berhasil diperbarui."
                    : "Pengembalian berhasil ditambahkan. Status peminjaman menjadi Selesai."
            );

            setForm(emptyForm);
            setEditingId(null);
            setShowForm(false);

            await loadData();
            await loadPeminjamanTersedia();

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        } catch (err) {
            console.error(
                "Submit pengembalian:",
                err
            );

            setError(
                err.message ||
                    "Gagal menyimpan data pengembalian."
            );
        } finally {
            setSaving(false);
        }
    };

    // ==================================================
    // DELETE
    // ==================================================

    const handleDelete = async (
        id
    ) => {
        const confirmed =
            window.confirm(
                "Yakin ingin menghapus data pengembalian ini?"
            );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            const response =
                await fetch(
                    `/pengembalian/${id}`,
                    {
                        method: "DELETE",
                    }
                );

            const result =
                await parseResponse(
                    response
                );

            if (!response.ok) {
                throw new Error(
                    result.message ||
                        "Gagal menghapus pengembalian."
                );
            }

            setSuccess(
                "Pengembalian berhasil dihapus."
            );

            await loadData();
            await loadPeminjamanTersedia();
        } catch (err) {
            console.error(
                "Delete pengembalian:",
                err
            );

            setError(
                err.message ||
                    "Gagal menghapus data pengembalian."
            );
        }
    };

    // ==================================================
    // EDIT
    // ==================================================

    const handleEdit = async (
        item
    ) => {
        setEditingId(
            item.id_pengembalian
        );

        setForm({
            id_peminjaman:
                item.id_peminjaman || "",

            tanggal_pengembalian:
                item.tanggal_pengembalian ||
                getToday(),

            kondisi_baju:
                item.kondisi_baju ||
                "Baik",

            denda:
                item.denda != null
                    ? String(
                          item.denda
                      )
                    : "0",

            keterangan:
                item.keterangan || "",
        });

        setError("");
        setSuccess("");
        setShowForm(true);

        await loadPeminjamanTersedia(
            item.id_pengembalian
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // ==================================================
    // FILTER
    // ==================================================

    const filteredData =
        useMemo(() => {
            const keyword =
                search
                    .trim()
                    .toLowerCase();

            if (!keyword) {
                return data;
            }

            return data.filter(
                (item) =>
                    String(
                        item.id_pengembalian
                    )
                        .toLowerCase()
                        .includes(
                            keyword
                        ) ||
                    String(
                        item.id_peminjaman
                    )
                        .toLowerCase()
                        .includes(
                            keyword
                        ) ||
                    String(
                        item.nama_user ||
                            ""
                    )
                        .toLowerCase()
                        .includes(
                            keyword
                        ) ||
                    String(
                        item.nama_kostum ||
                            ""
                    )
                        .toLowerCase()
                        .includes(
                            keyword
                        )
            );
        }, [data, search]);

    // ==================================================
    // SELECTED PEMINJAMAN
    // ==================================================

    const selectedPeminjaman =
        peminjamanTersedia.find(
            (item) =>
                Number(
                    item.id_peminjaman
                ) ===
                Number(
                    form.id_peminjaman
                )
        );

    // ==================================================
    // FORMAT TANGGAL
    // ==================================================

    const formatTanggal = (
        value
    ) => {
        if (!value) {
            return "-";
        }

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return value;
        }

        return date.toLocaleDateString(
            "id-ID",
            {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }
        );
    };

    // ==================================================
    // FORMAT RUPIAH
    // ==================================================

    const formatRupiah = (
        value
    ) => {
        return new Intl.NumberFormat(
            "id-ID",
            {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
            }
        ).format(
            Number(value) || 0
        );
    };

    // ==================================================
    // SUMMARY
    // ==================================================

    const totalDenda =
        useMemo(() => {
            return data.reduce(
                (total, item) =>
                    total +
                    (Number(
                        item.denda
                    ) || 0),
                0
            );
        }, [data]);

    const totalPengembalian =
        data.length;

    // ==================================================
    // LOADING
    // ==================================================

    if (
        !user ||
        loading
    ) {
        return (
            <div
                className="
                    min-h-screen
                    bg-[#090909]
                    text-white
                    flex
                    items-center
                    justify-center
                "
            >
                <p className="text-[#D4AF37]">
                    Memuat data
                    pengembalian...
                </p>
            </div>
        );
    }

    // ==================================================
    // RENDER
    // ==================================================

    return (
        <div className="min-h-screen bg-[#090909] text-white">

            {/* ==================================================
                HEADER
            ================================================== */}

            <header
                className="
                    border-b
                    border-[#D4AF37]/20
                    bg-[#111111]
                "
            >
                <div
                    className="
                        max-w-7xl
                        mx-auto
                        px-6
                        py-6
                        flex
                        flex-col
                        md:flex-row
                        md:items-center
                        md:justify-between
                        gap-4
                    "
                >
                    <div>
                        <p
                            className="
                                text-[#D4AF37]
                                text-xs
                                uppercase
                                tracking-[4px]
                            "
                        >
                            Petugas Area
                        </p>

                        <h1
                            className="
                                text-3xl
                                font-bold
                                mt-2
                            "
                        >
                            Pengembalian
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Kelola data pengembalian
                            kostum.
                        </p>
                    </div>

                    <div className="flex gap-3">

                        <Link
                            to="/petugas/dashboard"
                            className="
                                px-5
                                py-3
                                rounded-xl
                                border
                                border-[#D4AF37]/20
                                text-[#D4AF37]
                                hover:bg-[#D4AF37]/10
                                transition
                            "
                        >
                            Dashboard
                        </Link>

                        <button
                            type="button"
                            onClick={
                                showForm
                                    ? closeForm
                                    : openAddForm
                            }
                            className="
                                px-5
                                py-3
                                rounded-xl
                                bg-[#D4AF37]
                                text-black
                                font-semibold
                                hover:brightness-110
                                transition
                            "
                        >
                            {showForm
                                ? "Tutup Form"
                                : "Tambah Pengembalian"}
                        </button>
                    </div>
                </div>
            </header>

            {/* ==================================================
                CONTENT
            ================================================== */}

            <main
                className="
                    max-w-7xl
                    mx-auto
                    px-6
                    py-10
                "
            >

                {/* ERROR */}

                {error && (
                    <div
                        className="
                            mb-5
                            bg-red-500/10
                            border
                            border-red-500/20
                            text-red-400
                            rounded-2xl
                            px-5
                            py-4
                        "
                    >
                        {error}
                    </div>
                )}

                {/* SUCCESS */}

                {success && (
                    <div
                        className="
                            mb-5
                            bg-green-500/10
                            border
                            border-green-500/20
                            text-green-400
                            rounded-2xl
                            px-5
                            py-4
                        "
                    >
                        {success}
                    </div>
                )}

                {/* ==================================================
                    SUMMARY
                ================================================== */}

                <section
                    className="
                        grid
                        sm:grid-cols-2
                        lg:grid-cols-3
                        gap-4
                        mb-7
                    "
                >
                    <div
                        className="
                            rounded-2xl
                            bg-[#141414]
                            border
                            border-[#D4AF37]/15
                            p-5
                        "
                    >
                        <p className="text-gray-500 text-sm">
                            Total Pengembalian
                        </p>

                        <p
                            className="
                                text-3xl
                                font-bold
                                text-[#D4AF37]
                                mt-2
                            "
                        >
                            {totalPengembalian}
                        </p>
                    </div>

                    <div
                        className="
                            rounded-2xl
                            bg-[#141414]
                            border
                            border-green-500/15
                            p-5
                        "
                    >
                        <p className="text-gray-500 text-sm">
                            Siap Dikembalikan
                        </p>

                        <p
                            className="
                                text-3xl
                                font-bold
                                text-green-400
                                mt-2
                            "
                        >
                            {
                                peminjamanTersedia.length
                            }
                        </p>
                    </div>

                    <div
                        className="
                            rounded-2xl
                            bg-[#141414]
                            border
                            border-yellow-500/15
                            p-5
                        "
                    >
                        <p className="text-gray-500 text-sm">
                            Total Denda
                        </p>

                        <p
                            className="
                                text-2xl
                                font-bold
                                text-yellow-400
                                mt-2
                            "
                        >
                            {formatRupiah(
                                totalDenda
                            )}
                        </p>
                    </div>
                </section>

                {/* ==================================================
                    FORM
                ================================================== */}

                {showForm && (
                    <section
                        className="
                            mb-7
                            rounded-3xl
                            bg-[#141414]
                            border
                            border-[#D4AF37]/15
                            p-7
                        "
                    >
                        <div>
                            <p
                                className="
                                    text-[#D4AF37]
                                    text-xs
                                    uppercase
                                    tracking-[4px]
                                "
                            >
                                {editingId
                                    ? "Update"
                                    : "Create"}
                            </p>

                            <h2
                                className="
                                    text-2xl
                                    font-bold
                                    mt-2
                                "
                            >
                                {editingId
                                    ? "Edit Pengembalian"
                                    : "Tambah Pengembalian"}
                            </h2>

                            <p
                                className="
                                    text-gray-500
                                    text-sm
                                    mt-2
                                "
                            >
                                Hanya peminjaman
                                dengan status
                                <span className="text-[#D4AF37]">
                                    {" "}
                                    Diproses
                                </span>{" "}
                                yang dapat dikembalikan.
                            </p>
                        </div>

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="
                                grid
                                md:grid-cols-2
                                gap-5
                                mt-7
                            "
                        >

                            {/* PEMINJAMAN */}

                            <div className="md:col-span-2">

                                <label
                                    className="
                                        block
                                        text-sm
                                        text-gray-400
                                        mb-2
                                    "
                                >
                                    Peminjaman
                                </label>

                                <select
                                    name="id_peminjaman"
                                    value={
                                        form.id_peminjaman
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    disabled={
                                        loadingPeminjaman
                                    }
                                    className="
                                        w-full
                                        px-4
                                        py-3
                                        rounded-xl
                                        bg-[#1D1D1D]
                                        border
                                        border-white/10
                                        outline-none
                                        focus:border-[#D4AF37]
                                        disabled:opacity-50
                                    "
                                >
                                    <option value="">
                                        {loadingPeminjaman
                                            ? "Memuat peminjaman..."
                                            : peminjamanTersedia.length ===
                                              0
                                            ? "Tidak ada peminjaman yang siap dikembalikan"
                                            : "Pilih peminjaman"}
                                    </option>

                                    {peminjamanTersedia.map(
                                        (
                                            item
                                        ) => (
                                            <option
                                                key={
                                                    item.id_peminjaman
                                                }
                                                value={
                                                    item.id_peminjaman
                                                }
                                            >
                                                #
                                                {
                                                    item.id_peminjaman
                                                }{" "}
                                                —{" "}
                                                {
                                                    item.nama_user ||
                                                    "User"
                                                }{" "}
                                                —{" "}
                                                {
                                                    item.nama_kostum ||
                                                    "Kostum"
                                                }{" "}
                                                —{" "}
                                                {
                                                    item.status ||
                                                    "Diproses"
                                                }
                                            </option>
                                        )
                                    )}
                                </select>

                                {/* DETAIL */}

                                {selectedPeminjaman && (
                                    <div
                                        className="
                                            mt-3
                                            rounded-2xl
                                            border
                                            border-[#D4AF37]/15
                                            bg-[#D4AF37]/5
                                            p-5
                                        "
                                    >
                                        <p
                                            className="
                                                text-[#D4AF37]
                                                font-semibold
                                            "
                                        >
                                            #
                                            {
                                                selectedPeminjaman.id_peminjaman
                                            }{" "}
                                            —{" "}
                                            {
                                                selectedPeminjaman.nama_kostum
                                            }
                                        </p>

                                        <div
                                            className="
                                                grid
                                                sm:grid-cols-2
                                                lg:grid-cols-4
                                                gap-4
                                                mt-4
                                                text-sm
                                            "
                                        >
                                            <div>
                                                <p className="text-gray-500">
                                                    User
                                                </p>

                                                <p className="mt-1">
                                                    {
                                                        selectedPeminjaman.nama_user
                                                    }
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-gray-500">
                                                    Status
                                                </p>

                                                <p className="mt-1 text-[#D4AF37]">
                                                    {
                                                        selectedPeminjaman.status
                                                    }
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-gray-500">
                                                    Tanggal Peminjaman
                                                </p>

                                                <p className="mt-1">
                                                    {formatTanggal(
                                                        selectedPeminjaman.tanggal_peminjaman
                                                    )}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-gray-500">
                                                    Tanggal Kembali
                                                </p>

                                                <p className="mt-1">
                                                    {formatTanggal(
                                                        selectedPeminjaman.tanggal_kembali
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* TANGGAL */}

                            <div>

                                <label
                                    className="
                                        block
                                        text-sm
                                        text-gray-400
                                        mb-2
                                    "
                                >
                                    Tanggal Pengembalian
                                </label>

                                <input
                                    type="date"
                                    name="tanggal_pengembalian"
                                    value={
                                        form.tanggal_pengembalian
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    className="
                                        w-full
                                        px-4
                                        py-3
                                        rounded-xl
                                        bg-[#1D1D1D]
                                        border
                                        border-white/10
                                        outline-none
                                        focus:border-[#D4AF37]
                                    "
                                />
                            </div>

                            {/* KONDISI */}

                            <div>

                                <label
                                    className="
                                        block
                                        text-sm
                                        text-gray-400
                                        mb-2
                                    "
                                >
                                    Kondisi Kostum
                                </label>

                                <select
                                    name="kondisi_baju"
                                    value={
                                        form.kondisi_baju
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="
                                        w-full
                                        px-4
                                        py-3
                                        rounded-xl
                                        bg-[#1D1D1D]
                                        border
                                        border-white/10
                                        outline-none
                                        focus:border-[#D4AF37]
                                    "
                                >
                                    <option value="Baik">
                                        Baik
                                    </option>

                                    <option value="Kotor">
                                        Kotor
                                    </option>

                                    <option value="Rusak Ringan">
                                        Rusak Ringan
                                    </option>

                                    <option value="Rusak Berat">
                                        Rusak Berat
                                    </option>
                                </select>
                            </div>

                            {/* DENDA */}

                            <div>

                                <label
                                    className="
                                        block
                                        text-sm
                                        text-gray-400
                                        mb-2
                                    "
                                >
                                    Denda
                                </label>

                                <div className="relative">

                                    <span
                                        className="
                                            absolute
                                            left-4
                                            top-1/2
                                            -translate-y-1/2
                                            text-gray-500
                                        "
                                    >
                                        Rp
                                    </span>

                                    <input
                                        type="number"
                                        name="denda"
                                        value={
                                            form.denda
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        min="0"
                                        step="1"
                                        className="
                                            w-full
                                            pl-12
                                            pr-4
                                            py-3
                                            rounded-xl
                                            bg-[#1D1D1D]
                                            border
                                            border-white/10
                                            outline-none
                                            focus:border-[#D4AF37]
                                        "
                                    />
                                </div>
                            </div>

                            {/* KETERANGAN */}

                            <div>

                                <label
                                    className="
                                        block
                                        text-sm
                                        text-gray-400
                                        mb-2
                                    "
                                >
                                    Keterangan
                                </label>

                                <textarea
                                    name="keterangan"
                                    value={
                                        form.keterangan
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    rows="4"
                                    placeholder="Catatan pengembalian..."
                                    className="
                                        w-full
                                        px-4
                                        py-3
                                        rounded-xl
                                        bg-[#1D1D1D]
                                        border
                                        border-white/10
                                        outline-none
                                        focus:border-[#D4AF37]
                                        resize-none
                                    "
                                />
                            </div>

                            {/* BUTTON */}

                            <div
                                className="
                                    md:col-span-2
                                    flex
                                    flex-wrap
                                    gap-3
                                "
                            >

                                <button
                                    type="submit"
                                    disabled={
                                        saving ||
                                        loadingPeminjaman ||
                                        !form.id_peminjaman
                                    }
                                    className="
                                        px-6
                                        py-3
                                        rounded-xl
                                        bg-[#D4AF37]
                                        text-black
                                        font-semibold
                                        disabled:opacity-50
                                        disabled:cursor-not-allowed
                                    "
                                >
                                    {saving
                                        ? "Menyimpan..."
                                        : editingId
                                        ? "Simpan Perubahan"
                                        : "Simpan Pengembalian"}
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        closeForm
                                    }
                                    className="
                                        px-6
                                        py-3
                                        rounded-xl
                                        border
                                        border-white/10
                                        text-gray-400
                                        hover:text-white
                                        transition
                                    "
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    </section>
                )}

                {/* ==================================================
                    SEARCH
                ================================================== */}

                <section
                    className="
                        rounded-3xl
                        bg-[#141414]
                        border
                        border-[#D4AF37]/15
                        p-5
                        mb-7
                    "
                >
                    <input
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        placeholder="Cari ID pengembalian, ID peminjaman, user, atau kostum..."
                        className="
                            w-full
                            px-4
                            py-3.5
                            rounded-xl
                            bg-[#1D1D1D]
                            border
                            border-white/10
                            outline-none
                            focus:border-[#D4AF37]
                        "
                    />
                </section>

                {/* ==================================================
                    TABLE
                ================================================== */}

                <section
                    className="
                        rounded-3xl
                        bg-[#141414]
                        border
                        border-[#D4AF37]/15
                        overflow-hidden
                    "
                >

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[1100px]">

                            <thead
                                className="
                                    bg-[#1A1A1A]
                                    border-b
                                    border-white/5
                                "
                            >
                                <tr>

                                    <th className="text-left px-5 py-4 text-gray-500 text-sm">
                                        ID
                                    </th>

                                    <th className="text-left px-5 py-4 text-gray-500 text-sm">
                                        Peminjaman
                                    </th>

                                    <th className="text-left px-5 py-4 text-gray-500 text-sm">
                                        User
                                    </th>

                                    <th className="text-left px-5 py-4 text-gray-500 text-sm">
                                        Tanggal
                                    </th>

                                    <th className="text-left px-5 py-4 text-gray-500 text-sm">
                                        Kondisi
                                    </th>

                                    <th className="text-left px-5 py-4 text-gray-500 text-sm">
                                        Denda
                                    </th>

                                    <th className="text-left px-5 py-4 text-gray-500 text-sm">
                                        Petugas
                                    </th>

                                    <th className="text-left px-5 py-4 text-gray-500 text-sm">
                                        Aksi
                                    </th>

                                </tr>
                            </thead>

                            <tbody>

                                {filteredData.length ===
                                0 ? (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="
                                                text-center
                                                py-16
                                                text-gray-500
                                            "
                                        >
                                            Belum ada data
                                            pengembalian.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map(
                                        (
                                            item
                                        ) => (
                                            <tr
                                                key={
                                                    item.id_pengembalian
                                                }
                                                className="
                                                    border-b
                                                    border-white/5
                                                    hover:bg-white/[0.02]
                                                "
                                            >

                                                <td
                                                    className="
                                                        px-5
                                                        py-5
                                                        text-[#D4AF37]
                                                        font-semibold
                                                    "
                                                >
                                                    #
                                                    {
                                                        item.id_pengembalian
                                                    }
                                                </td>

                                                <td className="px-5 py-5">

                                                    <p className="font-semibold">
                                                        #
                                                        {
                                                            item.id_peminjaman
                                                        }
                                                    </p>

                                                    {item.nama_kostum && (
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {
                                                                item.nama_kostum
                                                            }
                                                        </p>
                                                    )}

                                                </td>

                                                <td className="px-5 py-5">

                                                    <p>
                                                        {
                                                            item.nama_user ||
                                                            "-"
                                                        }
                                                    </p>

                                                    {item.email_user && (
                                                        <p className="text-xs text-gray-600 mt-1">
                                                            {
                                                                item.email_user
                                                            }
                                                        </p>
                                                    )}

                                                </td>

                                                <td className="px-5 py-5">
                                                    {formatTanggal(
                                                        item.tanggal_pengembalian
                                                    )}
                                                </td>

                                                <td className="px-5 py-5">

                                                    <span
                                                        className={`
                                                            inline-flex
                                                            items-center
                                                            rounded-full
                                                            px-3
                                                            py-1.5
                                                            text-xs
                                                            border
                                                            ${
                                                                item.kondisi_baju ===
                                                                "Baik"
                                                                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                                                                    : item.kondisi_baju ===
                                                                      "Kotor"
                                                                    ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                                                    : "bg-red-500/10 text-red-400 border-red-500/20"
                                                            }
                                                        `}
                                                    >
                                                        {
                                                            item.kondisi_baju ||
                                                            "-"
                                                        }
                                                    </span>

                                                </td>

                                                <td
                                                    className="
                                                        px-5
                                                        py-5
                                                        text-[#D4AF37]
                                                        font-semibold
                                                    "
                                                >
                                                    {formatRupiah(
                                                        item.denda
                                                    )}
                                                </td>

                                                <td className="px-5 py-5">
                                                    {
                                                        item.nama_petugas ||
                                                        "-"
                                                    }
                                                </td>

                                                <td className="px-5 py-5">

                                                    <div className="flex gap-2">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    item
                                                                )
                                                            }
                                                            className="
                                                                px-3
                                                                py-2
                                                                rounded-lg
                                                                border
                                                                border-[#D4AF37]/20
                                                                text-[#D4AF37]
                                                                text-xs
                                                                hover:bg-[#D4AF37]/10
                                                            "
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    item.id_pengembalian
                                                                )
                                                            }
                                                            className="
                                                                px-3
                                                                py-2
                                                                rounded-lg
                                                                border
                                                                border-red-500/20
                                                                text-red-400
                                                                text-xs
                                                                hover:bg-red-500/10
                                                            "
                                                        >
                                                            Hapus
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>
                                        )
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </section>

                {/* BACK */}

                <div className="mt-6">

                    <Link
                        to="/petugas/dashboard"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            text-gray-500
                            hover:text-[#D4AF37]
                        "
                    >
                        ← Kembali ke Dashboard
                    </Link>

                </div>

            </main>
        </div>
    );
}

export default PengembalianPetugas;