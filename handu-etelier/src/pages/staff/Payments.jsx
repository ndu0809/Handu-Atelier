import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    FaArrowLeft,
    FaCheck,
    FaClock,
    FaEdit,
    FaEye,
    FaMoneyBillWave,
    FaPlus,
    FaSearch,
    FaSyncAlt,
    FaTrash,
    FaTimes,
} from "react-icons/fa";

function Payments() {
    const navigate = useNavigate();

    // ==================================================
    // SESSION
    // ==================================================

    const [user, setUser] = useState(null);

    // ==================================================
    // DATA
    // ==================================================

    const [payments, setPayments] = useState([]);
    const [peminjaman, setPeminjaman] = useState([]);

    // ==================================================
    // UI
    // ==================================================

    const [loading, setLoading] = useState(true);
    const [loadingPeminjaman, setLoadingPeminjaman] =
        useState(false);

    const [saving, setSaving] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [search, setSearch] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // ==================================================
    // MODAL BUKTI PEMBAYARAN
    // ==================================================

    const [selectedProof, setSelectedProof] = useState(null);

    // ==================================================
    // FORM
    // ==================================================

    const emptyForm = {
        id_peminjaman: "",
        tanggal_bayar: "",
        total: "",
        metode: "Cash",
        status: "Belum Bayar",
        bukti_bayar: "",
    };

    const [form, setForm] = useState(emptyForm);

    // ==================================================
    // HELPER RESPONSE
    // ==================================================

    const parseResponse = async (response) => {
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
    // FORMAT RUPIAH
    // ==================================================

    const formatRupiah = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(Number(value) || 0);
    };

    // ==================================================
    // FORMAT TANGGAL
    // ==================================================

    const formatTanggal = (value) => {
        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    // ==================================================
    // URL BUKTI PEMBAYARAN
    // ==================================================

    const getProofUrl = (bukti) => {
        if (!bukti) {
            return "";
        }

        const value = String(bukti).trim();

        if (!value) {
            return "";
        }

        // Base64 / data URL
        if (value.startsWith("data:image/")) {
            return value;
        }

        // URL penuh
        if (
            value.startsWith("http://") ||
            value.startsWith("https://")
        ) {
            return value;
        }

        // Sudah /uploads/...
        if (value.startsWith("/uploads/")) {
            return value;
        }

        // uploads/...
        if (value.startsWith("uploads/")) {
            return `/${value}`;
        }

        // Nama file saja
        return `/uploads/pembayaran/${value}`;
    };

    // ==================================================
    // CEK SESSION PETUGAS
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
            const parsedUser =
                JSON.parse(storedUser);

            if (
                !parsedUser?.id_user ||
                Number(parsedUser.id_role) !== 2
            ) {
                navigate("/dashboard", {
                    replace: true,
                });

                return;
            }

            setUser(parsedUser);
        } catch (err) {
            console.error(
                "Session error:",
                err
            );

            localStorage.removeItem("user");
            localStorage.removeItem("isLoggedIn");

            navigate("/login", {
                replace: true,
            });
        }
    }, [navigate]);

    // ==================================================
    // LOAD PEMBAYARAN
    // ==================================================

    const loadPayments = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "/pembayaran"
            );

            const result =
                await parseResponse(response);

            if (!response.ok) {
                throw new Error(
                    result.message ||
                        "Gagal mengambil data pembayaran."
                );
            }

            const rows = Array.isArray(result)
                ? result
                : result.data;

            if (!Array.isArray(rows)) {
                throw new Error(
                    "Format data pembayaran tidak sesuai."
                );
            }

            setPayments(rows);
        } catch (err) {
            console.error(
                "Load pembayaran:",
                err
            );

            setError(
                err.message ||
                    "Gagal mengambil data pembayaran."
            );
        } finally {
            setLoading(false);
        }
    };

    // ==================================================
    // LOAD PEMINJAMAN
    // ==================================================

    const loadPeminjaman = async () => {
        try {
            setLoadingPeminjaman(true);

            const response = await fetch(
                "/peminjaman"
            );

            const result =
                await parseResponse(response);

            if (!response.ok) {
                throw new Error(
                    result.message ||
                        "Gagal mengambil data peminjaman."
                );
            }

            const rows = Array.isArray(result)
                ? result
                : result.data;

            setPeminjaman(
                Array.isArray(rows)
                    ? rows
                    : []
            );
        } catch (err) {
            console.error(
                "Load peminjaman:",
                err
            );

            setError(
                err.message ||
                    "Gagal mengambil data peminjaman."
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

        loadPayments();
        loadPeminjaman();
    }, [user]);

    // ==================================================
    // HANDLE FORM
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
    // SELECT PEMINJAMAN
    // ==================================================

    const handlePeminjamanChange = (e) => {
        const id = e.target.value;

        const selected =
            peminjaman.find(
                (item) =>
                    Number(
                        item.id_peminjaman
                    ) === Number(id)
            );

        setForm((prev) => ({
            ...prev,

            id_peminjaman: id,

            total: selected
                ? String(
                      Number(
                          selected.total_harga
                      ) || 0
                  )
                : prev.total,
        }));

        setError("");
        setSuccess("");
    };

    // ==================================================
    // PEMINJAMAN YANG BELUM MEMILIKI PEMBAYARAN
    // ==================================================

    const availablePeminjaman =
        useMemo(() => {
            const paidIds =
                new Set(
                    payments.map(
                        (item) =>
                            Number(
                                item.id_peminjaman
                            )
                    )
                );

            return peminjaman.filter(
                (item) => {
                    const id =
                        Number(
                            item.id_peminjaman
                        );

                    const isCurrentEdit =
                        editingId &&
                        payments.some(
                            (payment) =>
                                Number(
                                    payment.id_pembayaran
                                ) ===
                                    Number(
                                        editingId
                                    ) &&
                                Number(
                                    payment.id_peminjaman
                                ) === id
                        );

                    return (
                        !paidIds.has(id) ||
                        isCurrentEdit
                    );
                }
            );
        }, [
            peminjaman,
            payments,
            editingId,
        ]);

    // ==================================================
    // OPEN ADD FORM
    // ==================================================

    const openAddForm = () => {
        setEditingId(null);

        setForm({
            ...emptyForm,
        });

        setError("");
        setSuccess("");
        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // ==================================================
    // OPEN EDIT FORM
    // ==================================================

    const openEditForm = (item) => {
        setEditingId(
            item.id_pembayaran
        );

        setForm({
            id_peminjaman:
                item.id_peminjaman || "",

            tanggal_bayar:
                item.tanggal_bayar
                    ? String(
                          item.tanggal_bayar
                      ).slice(0, 16)
                    : "",

            total:
                item.total != null
                    ? String(item.total)
                    : "0",

            metode:
                item.metode ||
                "Cash",

            status:
                item.status ||
                "Belum Bayar",

            bukti_bayar:
                item.bukti_bayar ||
                "",
        });

        setError("");
        setSuccess("");
        setShowForm(true);

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
    };

    // ==================================================
    // OPEN PROOF
    // ==================================================

    const openProof = (item) => {
        if (!item?.bukti_bayar) {
            setError(
                "Pembayaran ini tidak memiliki bukti pembayaran."
            );

            return;
        }

        setSelectedProof(item);
        setError("");
        setSuccess("");
    };

    // ==================================================
    // CLOSE PROOF
    // ==================================================

    const closeProof = () => {
        setSelectedProof(null);
    };

    // ==================================================
    // SUBMIT PEMBAYARAN
    // ==================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!form.id_peminjaman) {
            setError(
                "Peminjaman wajib dipilih."
            );

            return;
        }

        if (
            Number(form.total) < 0
        ) {
            setError(
                "Total pembayaran tidak boleh negatif."
            );

            return;
        }

        try {
            setSaving(true);

            const payload = {
                id_peminjaman:
                    Number(
                        form.id_peminjaman
                    ),

                tanggal_bayar:
                    form.tanggal_bayar ||
                    null,

                total:
                    Number(
                        form.total
                    ) || 0,

                metode:
                    form.metode,

                status:
                    form.status,

                bukti_bayar:
                    form.bukti_bayar
                        ?.trim() ||
                    null,
            };

            const url = editingId
                ? `/pembayaran/${editingId}`
                : "/pembayaran";

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

                        body:
                            JSON.stringify(
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
                        "Gagal menyimpan pembayaran."
                );
            }

            setSuccess(
                editingId
                    ? "Pembayaran berhasil diperbarui."
                    : "Pembayaran berhasil ditambahkan."
            );

            setEditingId(null);
            setForm(emptyForm);
            setShowForm(false);

            await loadPayments();
            await loadPeminjaman();

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        } catch (err) {
            console.error(
                "Submit pembayaran:",
                err
            );

            setError(
                err.message ||
                    "Gagal menyimpan pembayaran."
            );
        } finally {
            setSaving(false);
        }
    };

    // ==================================================
    // UPDATE STATUS
    // ==================================================

    const updateStatus = async (
        item,
        askConfirmation = true
    ) => {
        const newStatus =
            item.status === "Lunas"
                ? "Belum Bayar"
                : "Lunas";

        if (askConfirmation) {
            const confirmed =
                window.confirm(
                    `Ubah status pembayaran #${item.id_pembayaran} menjadi "${newStatus}"?`
                );

            if (!confirmed) {
                return;
            }
        }

        try {
            setUpdatingId(
                item.id_pembayaran
            );

            setError("");
            setSuccess("");

            const response =
                await fetch(
                    `/pembayaran/${item.id_pembayaran}/status`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify({
                                status:
                                    newStatus,
                            }),
                    }
                );

            const result =
                await parseResponse(
                    response
                );

            if (!response.ok) {
                throw new Error(
                    result.message ||
                        "Gagal mengubah status pembayaran."
                );
            }

            setSuccess(
                `Status pembayaran #${item.id_pembayaran} menjadi "${newStatus}".`
            );

            await loadPayments();

            return true;
        } catch (err) {
            console.error(
                "Update status:",
                err
            );

            setError(
                err.message ||
                    "Gagal mengubah status pembayaran."
            );

            return false;
        } finally {
            setUpdatingId(null);
        }
    };

    // ==================================================
    // DELETE
    // ==================================================

    const deletePayment = async (
        id
    ) => {
        const confirmed =
            window.confirm(
                `Yakin ingin menghapus pembayaran #${id}?`
            );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            const response =
                await fetch(
                    `/pembayaran/${id}`,
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
                        "Gagal menghapus pembayaran."
                );
            }

            setSuccess(
                "Pembayaran berhasil dihapus."
            );

            await loadPayments();
            await loadPeminjaman();
        } catch (err) {
            console.error(
                "Delete pembayaran:",
                err
            );

            setError(
                err.message ||
                    "Gagal menghapus pembayaran."
            );
        }
    };

    // ==================================================
    // SEARCH
    // ==================================================

    const filteredPayments =
        useMemo(() => {
            const keyword =
                search
                    .trim()
                    .toLowerCase();

            if (!keyword) {
                return payments;
            }

            return payments.filter(
                (item) =>
                    String(
                        item.id_pembayaran ||
                            ""
                    )
                        .toLowerCase()
                        .includes(
                            keyword
                        ) ||

                    String(
                        item.id_peminjaman ||
                            ""
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
                        item.email_user ||
                            ""
                    )
                        .toLowerCase()
                        .includes(
                            keyword
                        ) ||

                    String(
                        item.metode ||
                            ""
                    )
                        .toLowerCase()
                        .includes(
                            keyword
                        ) ||

                    String(
                        item.status ||
                            ""
                    )
                        .toLowerCase()
                        .includes(
                            keyword
                        )
            );
        }, [
            payments,
            search,
        ]);

    // ==================================================
    // SUMMARY
    // ==================================================

    const totalPayments =
        payments.length;

    const totalLunas =
        payments.filter(
            (item) =>
                item.status ===
                "Lunas"
        ).length;

    const totalBelumBayar =
        payments.filter(
            (item) =>
                item.status ===
                "Belum Bayar"
        ).length;

    const totalDenganBukti =
        payments.filter(
            (item) =>
                Boolean(
                    item.bukti_bayar
                )
        ).length;

    const nominalLunas =
        payments
            .filter(
                (item) =>
                    item.status ===
                    "Lunas"
            )
            .reduce(
                (
                    total,
                    item
                ) =>
                    total +
                    Number(
                        item.total || 0
                    ),
                0
            );

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
                <p
                    className="
                        text-[#D4AF37]
                        tracking-[3px]
                        uppercase
                        text-sm
                    "
                >
                    Memuat data pembayaran...
                </p>
            </div>
        );
    }

    // ==================================================
    // RENDER
    // ==================================================

    return (
        <div
            className="
                min-h-screen
                bg-[#090909]
                text-white
            "
        >
            {/* ==================================================
                HEADER
            ================================================== */}

            <header
                className="
                    bg-[#111111]
                    border-b
                    border-[#D4AF37]/20
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
                            Pembayaran
                        </h1>

                        <p
                            className="
                                text-gray-500
                                mt-2
                            "
                        >
                            Kelola dan verifikasi
                            pembayaran peminjaman.
                        </p>
                    </div>

                    <div
                        className="
                            flex
                            flex-wrap
                            gap-3
                        "
                    >
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
                                flex
                                items-center
                                gap-2
                            "
                        >
                            <FaArrowLeft />

                            Dashboard
                        </Link>

                        <button
                            type="button"
                            onClick={() => {
                                if (
                                    showForm
                                ) {
                                    closeForm();
                                } else {
                                    openAddForm();
                                }
                            }}
                            className="
                                px-5
                                py-3
                                rounded-xl
                                bg-[#D4AF37]
                                text-black
                                font-semibold
                                flex
                                items-center
                                gap-2
                            "
                        >
                            <FaPlus />

                            {showForm
                                ? "Tutup Form"
                                : "Tambah Pembayaran"}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                loadPayments();
                                loadPeminjaman();
                            }}
                            className="
                                px-5
                                py-3
                                rounded-xl
                                border
                                border-white/10
                                text-gray-300
                                flex
                                items-center
                                gap-2
                            "
                        >
                            <FaSyncAlt />

                            Refresh
                        </button>
                    </div>
                </div>
            </header>

            <main
                className="
                    max-w-7xl
                    mx-auto
                    px-6
                    py-10
                "
            >
                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (
                    <div
                        className="
                            mb-6
                            rounded-2xl
                            border
                            border-red-500/20
                            bg-red-500/10
                            text-red-400
                            px-5
                            py-4
                            flex
                            items-center
                            justify-between
                            gap-4
                        "
                    >
                        <span>
                            {error}
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                setError("")
                            }
                            className="
                                text-red-400
                                hover:text-white
                            "
                        >
                            <FaTimes />
                        </button>
                    </div>
                )}

                {/* ==================================================
                    SUCCESS
                ================================================== */}

                {success && (
                    <div
                        className="
                            mb-6
                            rounded-2xl
                            border
                            border-green-500/20
                            bg-green-500/10
                            text-green-400
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
                        md:grid-cols-2
                        xl:grid-cols-5
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
                            Total Pembayaran
                        </p>

                        <p
                            className="
                                text-3xl
                                font-bold
                                text-[#D4AF37]
                                mt-2
                            "
                        >
                            {totalPayments}
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
                            Lunas
                        </p>

                        <p
                            className="
                                text-3xl
                                font-bold
                                text-green-400
                                mt-2
                            "
                        >
                            {totalLunas}
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
                            Belum Bayar
                        </p>

                        <p
                            className="
                                text-3xl
                                font-bold
                                text-yellow-400
                                mt-2
                            "
                        >
                            {totalBelumBayar}
                        </p>
                    </div>

                    <div
                        className="
                            rounded-2xl
                            bg-[#141414]
                            border
                            border-blue-500/15
                            p-5
                        "
                    >
                        <p className="text-gray-500 text-sm">
                            Ada Bukti
                        </p>

                        <p
                            className="
                                text-3xl
                                font-bold
                                text-blue-400
                                mt-2
                            "
                        >
                            {totalDenganBukti}
                        </p>
                    </div>

                    <div
                        className="
                            rounded-2xl
                            bg-[#141414]
                            border
                            border-purple-500/15
                            p-5
                        "
                    >
                        <p className="text-gray-500 text-sm">
                            Nominal Lunas
                        </p>

                        <p
                            className="
                                text-xl
                                font-bold
                                text-purple-400
                                mt-2
                            "
                        >
                            {formatRupiah(
                                nominalLunas
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
                            rounded-3xl
                            bg-[#141414]
                            border
                            border-[#D4AF37]/15
                            p-7
                            mb-7
                        "
                    >
                        <div className="mb-7">
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
                                    ? "Edit Pembayaran"
                                    : "Tambah Pembayaran"}
                            </h2>

                            <p className="text-gray-500 text-sm mt-2">
                                Satu peminjaman memiliki
                                satu data pembayaran.
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
                            "
                        >
                            {/* PEMINJAMAN */}

                            <div>
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
                                        handlePeminjamanChange
                                    }
                                    required
                                    disabled={
                                        loadingPeminjaman
                                    }
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
                                        disabled:opacity-50
                                    "
                                >
                                    <option value="">
                                        {loadingPeminjaman
                                            ? "Memuat peminjaman..."
                                            : "Pilih peminjaman"}
                                    </option>

                                    {availablePeminjaman.map(
                                        (item) => (
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
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            {/* TOTAL */}

                            <div>
                                <label
                                    className="
                                        block
                                        text-sm
                                        text-gray-400
                                        mb-2
                                    "
                                >
                                    Total
                                </label>

                                <input
                                    type="number"
                                    name="total"
                                    value={
                                        form.total
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                    step="1"
                                    required
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

                                <p className="text-xs text-gray-600 mt-2">
                                    Nilai otomatis mengikuti
                                    total harga peminjaman.
                                </p>
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
                                    Tanggal Bayar
                                </label>

                                <input
                                    type="datetime-local"
                                    name="tanggal_bayar"
                                    value={
                                        form.tanggal_bayar
                                    }
                                    onChange={
                                        handleChange
                                    }
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
                            </div>

                            {/* METODE */}

                            <div>
                                <label
                                    className="
                                        block
                                        text-sm
                                        text-gray-400
                                        mb-2
                                    "
                                >
                                    Metode
                                </label>

                                <select
                                    name="metode"
                                    value={
                                        form.metode
                                    }
                                    onChange={
                                        handleChange
                                    }
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
                                >
                                    <option value="Cash">
                                        Cash
                                    </option>

                                    <option value="Transfer">
                                        Transfer
                                    </option>

                                    <option value="QRIS">
                                        QRIS
                                    </option>
                                </select>
                            </div>

                            {/* STATUS */}

                            <div>
                                <label
                                    className="
                                        block
                                        text-sm
                                        text-gray-400
                                        mb-2
                                    "
                                >
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
                                >
                                    <option value="Belum Bayar">
                                        Belum Bayar
                                    </option>

                                    <option value="Lunas">
                                        Lunas
                                    </option>
                                </select>
                            </div>

                            {/* BUKTI */}

                            <div>
                                <label
                                    className="
                                        block
                                        text-sm
                                        text-gray-400
                                        mb-2
                                    "
                                >
                                    Bukti Bayar
                                </label>

                                <input
                                    type="text"
                                    name="bukti_bayar"
                                    value={
                                        form.bukti_bayar
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Nama file / URL / data bukti"
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

                                <p className="text-xs text-gray-600 mt-2">
                                    Bukti yang sudah di-upload
                                    customer dapat dilihat
                                    melalui tabel pembayaran.
                                </p>
                            </div>

                            {/* DETAIL PEMINJAMAN */}

                            {form.id_peminjaman && (
                                <div
                                    className="
                                        md:col-span-2
                                        rounded-2xl
                                        border
                                        border-[#D4AF37]/15
                                        bg-[#D4AF37]/5
                                        p-5
                                    "
                                >
                                    {(() => {
                                        const selected =
                                            peminjaman.find(
                                                (item) =>
                                                    Number(
                                                        item.id_peminjaman
                                                    ) ===
                                                    Number(
                                                        form.id_peminjaman
                                                    )
                                            );

                                        if (
                                            !selected
                                        ) {
                                            return null;
                                        }

                                        return (
                                            <>
                                                <p
                                                    className="
                                                        text-[#D4AF37]
                                                        font-semibold
                                                    "
                                                >
                                                    Peminjaman #
                                                    {
                                                        selected.id_peminjaman
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
                                                                selected.nama_user ||
                                                                "-"
                                                            }
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-gray-500">
                                                            Tanggal Pinjam
                                                        </p>

                                                        <p className="mt-1">
                                                            {formatTanggal(
                                                                selected.tanggal_peminjaman
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-gray-500">
                                                            Tanggal Kembali
                                                        </p>

                                                        <p className="mt-1">
                                                            {formatTanggal(
                                                                selected.tanggal_kembali
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-gray-500">
                                                            Total Peminjaman
                                                        </p>

                                                        <p
                                                            className="
                                                                mt-1
                                                                text-[#D4AF37]
                                                                font-semibold
                                                            "
                                                        >
                                                            {formatRupiah(
                                                                selected.total_harga
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            )}

                            {/* BUTTON */}

                            <div
                                className="
                                    md:col-span-2
                                    flex
                                    gap-3
                                "
                            >
                                <button
                                    type="submit"
                                    disabled={
                                        saving ||
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
                                    "
                                >
                                    {saving
                                        ? "Menyimpan..."
                                        : editingId
                                        ? "Simpan Perubahan"
                                        : "Simpan Pembayaran"}
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
                    <div className="relative">
                        <FaSearch
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
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="Cari ID pembayaran, ID peminjaman, nama customer, atau metode..."
                            className="
                                w-full
                                pl-11
                                pr-4
                                py-3.5
                                rounded-xl
                                bg-[#1D1D1D]
                                border
                                border-white/10
                                outline-none
                                focus:border-[#D4AF37]
                            "
                        />
                    </div>
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
                        <table
                            className="
                                w-full
                                min-w-[1500px]
                            "
                        >
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
                                        Customer
                                    </th>

                                    <th className="text-left px-5 py-4 text-gray-500 text-sm">
                                        Tanggal
                                    </th>

                                    <th className="text-left px-5 py-4 text-gray-500 text-sm">
                                        Total
                                    </th>

                                    <th className="text-left px-5 py-4 text-gray-500 text-sm">
                                        Metode
                                    </th>

                                    <th className="text-left px-5 py-4 text-gray-500 text-sm">
                                        Bukti
                                    </th>

                                    <th className="text-left px-5 py-4 text-gray-500 text-sm">
                                        Status
                                    </th>

                                    <th className="text-left px-5 py-4 text-gray-500 text-sm">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredPayments.length ===
                                0 ? (
                                    <tr>
                                        <td
                                            colSpan="9"
                                            className="
                                                text-center
                                                py-16
                                                text-gray-500
                                            "
                                        >
                                            Belum ada data
                                            pembayaran.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPayments.map(
                                        (item) => {
                                            const hasProof =
                                                Boolean(
                                                    item.bukti_bayar
                                                );

                                            const isCash =
                                                String(
                                                    item.metode ||
                                                        ""
                                                ).toLowerCase() ===
                                                "cash";

                                            return (
                                                <tr
                                                    key={
                                                        item.id_pembayaran
                                                    }
                                                    className="
                                                        border-b
                                                        border-white/5
                                                        hover:bg-white/[0.02]
                                                    "
                                                >
                                                    {/* ID */}

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
                                                            item.id_pembayaran
                                                        }
                                                    </td>

                                                    {/* PEMINJAMAN */}

                                                    <td className="px-5 py-5">
                                                        #
                                                        {
                                                            item.id_peminjaman
                                                        }
                                                    </td>

                                                    {/* CUSTOMER */}

                                                    <td className="px-5 py-5">
                                                        <p className="font-semibold">
                                                            {
                                                                item.nama_user ||
                                                                "-"
                                                            }
                                                        </p>

                                                        <p
                                                            className="
                                                                text-xs
                                                                text-gray-600
                                                                mt-1
                                                            "
                                                        >
                                                            {
                                                                item.email_user ||
                                                                "-"
                                                            }
                                                        </p>
                                                    </td>

                                                    {/* TANGGAL */}

                                                    <td className="px-5 py-5">
                                                        {formatTanggal(
                                                            item.tanggal_bayar
                                                        )}
                                                    </td>

                                                    {/* TOTAL */}

                                                    <td
                                                        className="
                                                            px-5
                                                            py-5
                                                            text-[#D4AF37]
                                                            font-semibold
                                                        "
                                                    >
                                                        {formatRupiah(
                                                            item.total
                                                        )}
                                                    </td>

                                                    {/* METODE */}

                                                    <td className="px-5 py-5">
                                                        <span
                                                            className={`
                                                                inline-flex
                                                                px-3
                                                                py-1.5
                                                                rounded-full
                                                                text-xs
                                                                border
                                                                ${
                                                                    isCash
                                                                        ? "bg-gray-500/10 text-gray-300 border-gray-500/20"
                                                                        : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                                                }
                                                            `}
                                                        >
                                                            {
                                                                item.metode
                                                            }
                                                        </span>
                                                    </td>

                                                    {/* BUKTI */}

                                                    <td className="px-5 py-5">
                                                        {isCash ? (
                                                            <span
                                                                className="
                                                                    text-xs
                                                                    text-gray-500
                                                                "
                                                            >
                                                                Tidak ada
                                                                bukti
                                                                <br />
                                                                <span className="text-gray-600">
                                                                    Pembayaran
                                                                    Cash
                                                                </span>
                                                            </span>
                                                        ) : hasProof ? (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    openProof(
                                                                        item
                                                                    )
                                                                }
                                                                className="
                                                                    inline-flex
                                                                    items-center
                                                                    gap-2
                                                                    px-4
                                                                    py-2
                                                                    rounded-lg
                                                                    border
                                                                    border-blue-500/20
                                                                    text-blue-400
                                                                    hover:bg-blue-500/10
                                                                    transition
                                                                "
                                                            >
                                                                <FaEye />

                                                                Lihat
                                                                Bukti
                                                            </button>
                                                        ) : (
                                                            <span
                                                                className="
                                                                    text-xs
                                                                    text-red-400
                                                                "
                                                            >
                                                                Belum
                                                                ada
                                                                bukti
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* STATUS */}

                                                    <td className="px-5 py-5">
                                                        <span
                                                            className={`
                                                                inline-flex
                                                                items-center
                                                                gap-2
                                                                px-3
                                                                py-1.5
                                                                rounded-full
                                                                text-xs
                                                                border
                                                                ${
                                                                    item.status ===
                                                                    "Lunas"
                                                                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                                                                        : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                                                }
                                                            `}
                                                        >
                                                            {item.status ===
                                                            "Lunas" ? (
                                                                <FaCheck />
                                                            ) : (
                                                                <FaClock />
                                                            )}

                                                            {
                                                                item.status
                                                            }
                                                        </span>
                                                    </td>

                                                    {/* AKSI */}

                                                    <td className="px-5 py-5">
                                                        <div
                                                            className="
                                                                flex
                                                                items-center
                                                                gap-2
                                                            "
                                                        >
                                                            {/* VERIFIKASI */}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    updateStatus(
                                                                        item
                                                                    )
                                                                }
                                                                disabled={
                                                                    updatingId ===
                                                                    item.id_pembayaran
                                                                }
                                                                title={
                                                                    item.status ===
                                                                    "Lunas"
                                                                        ? "Ubah menjadi Belum Bayar"
                                                                        : "Verifikasi / Tandai Lunas"
                                                                }
                                                                className="
                                                                    px-3
                                                                    py-2
                                                                    rounded-lg
                                                                    border
                                                                    border-green-500/20
                                                                    text-green-400
                                                                    hover:bg-green-500/10
                                                                    disabled:opacity-50
                                                                "
                                                            >
                                                                <FaCheck />
                                                            </button>

                                                            {/* LIHAT BUKTI */}

                                                            {hasProof && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        openProof(
                                                                            item
                                                                        )
                                                                    }
                                                                    title="Lihat Bukti Pembayaran"
                                                                    className="
                                                                        px-3
                                                                        py-2
                                                                        rounded-lg
                                                                        border
                                                                        border-blue-500/20
                                                                        text-blue-400
                                                                        hover:bg-blue-500/10
                                                                    "
                                                                >
                                                                    <FaEye />
                                                                </button>
                                                            )}

                                                            {/* EDIT */}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    openEditForm(
                                                                        item
                                                                    )
                                                                }
                                                                title="Edit"
                                                                className="
                                                                    px-3
                                                                    py-2
                                                                    rounded-lg
                                                                    border
                                                                    border-[#D4AF37]/20
                                                                    text-[#D4AF37]
                                                                    hover:bg-[#D4AF37]/10
                                                                "
                                                            >
                                                                <FaEdit />
                                                            </button>

                                                            {/* DELETE */}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    deletePayment(
                                                                        item.id_pembayaran
                                                                    )
                                                                }
                                                                title="Hapus"
                                                                className="
                                                                    px-3
                                                                    py-2
                                                                    rounded-lg
                                                                    border
                                                                    border-red-500/20
                                                                    text-red-400
                                                                    hover:bg-red-500/10
                                                                "
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* ==================================================
                    BACK
                ================================================== */}

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
                        <FaArrowLeft />

                        Kembali ke Dashboard
                    </Link>
                </div>
            </main>

            {/* ==================================================
                MODAL BUKTI PEMBAYARAN
            ================================================== */}

            {selectedProof && (
                <div
                    className="
                        fixed
                        inset-0
                        z-[9999]
                        bg-black/80
                        backdrop-blur-sm
                        flex
                        items-center
                        justify-center
                        p-5
                    "
                    onClick={closeProof}
                >
                    <div
                        className="
                            relative
                            w-full
                            max-w-4xl
                            max-h-[90vh]
                            bg-[#141414]
                            border
                            border-[#D4AF37]/20
                            rounded-3xl
                            overflow-hidden
                            shadow-2xl
                        "
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >
                        {/* HEADER MODAL */}

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-4
                                px-6
                                py-5
                                border-b
                                border-white/10
                            "
                        >
                            <div>
                                <p
                                    className="
                                        text-xs
                                        uppercase
                                        tracking-[3px]
                                        text-[#D4AF37]
                                    "
                                >
                                    Verifikasi Pembayaran
                                </p>

                                <h2
                                    className="
                                        text-xl
                                        font-bold
                                        mt-1
                                    "
                                >
                                    Bukti Pembayaran #
                                    {
                                        selectedProof.id_pembayaran
                                    }
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={closeProof}
                                className="
                                    w-10
                                    h-10
                                    rounded-full
                                    border
                                    border-white/10
                                    flex
                                    items-center
                                    justify-center
                                    text-gray-400
                                    hover:text-white
                                    hover:bg-white/5
                                "
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* INFORMASI PEMBAYARAN */}

                        <div
                            className="
                                px-6
                                py-4
                                border-b
                                border-white/10
                                grid
                                sm:grid-cols-2
                                lg:grid-cols-4
                                gap-4
                            "
                        >
                            <div>
                                <p className="text-xs text-gray-500">
                                    Customer
                                </p>

                                <p className="mt-1 font-medium">
                                    {
                                        selectedProof.nama_user ||
                                        "-"
                                    }
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Peminjaman
                                </p>

                                <p className="mt-1 font-medium">
                                    #
                                    {
                                        selectedProof.id_peminjaman
                                    }
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Metode
                                </p>

                                <p className="mt-1 font-medium text-[#D4AF37]">
                                    {
                                        selectedProof.metode ||
                                        "-"
                                    }
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">
                                    Nominal
                                </p>

                                <p className="mt-1 font-medium text-[#D4AF37]">
                                    {formatRupiah(
                                        selectedProof.total
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* GAMBAR BUKTI */}

                        <div
                            className="
                                p-6
                                overflow-auto
                                max-h-[60vh]
                                flex
                                justify-center
                                bg-[#0A0A0A]
                            "
                        >
                            <img
                                src={getProofUrl(
                                    selectedProof.bukti_bayar
                                )}
                                alt="Bukti pembayaran"
                                className="
                                    max-w-full
                                    max-h-[55vh]
                                    object-contain
                                    rounded-xl
                                "
                                onError={(e) => {
                                    e.currentTarget.style.display =
                                        "none";
                                }}
                            />
                        </div>

                        {/* FOOTER */}

                        <div
                            className="
                                px-6
                                py-5
                                border-t
                                border-white/10
                                flex
                                flex-wrap
                                justify-end
                                gap-3
                            "
                        >
                            <button
                                type="button"
                                onClick={closeProof}
                                className="
                                    px-5
                                    py-3
                                    rounded-xl
                                    border
                                    border-white/10
                                    text-gray-400
                                    hover:text-white
                                "
                            >
                                Tutup
                            </button>

                            {selectedProof.status !==
                                "Lunas" && (
                                <button
                                    type="button"
                                    onClick={async () => {
                                        const result =
                                            await updateStatus(
                                                selectedProof
                                            );

                                        if (
                                            result
                                        ) {
                                            closeProof();
                                        }
                                    }}
                                    disabled={
                                        updatingId ===
                                        selectedProof.id_pembayaran
                                    }
                                    className="
                                        px-5
                                        py-3
                                        rounded-xl
                                        bg-green-500
                                        text-black
                                        font-semibold
                                        flex
                                        items-center
                                        gap-2
                                        disabled:opacity-50
                                    "
                                >
                                    <FaCheck />

                                    Verifikasi &
                                    Tandai Lunas
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Payments;