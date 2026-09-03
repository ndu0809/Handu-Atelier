import { useEffect, useMemo, useState } from "react";
import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    FaArrowLeft,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaUser,
    FaTshirt,
    FaUndoAlt,
    FaCalendarAlt,
} from "react-icons/fa";

function CustomerDetail() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [user, setUser] = useState(null);

    const [customer, setCustomer] = useState(null);
    const [history, setHistory] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

            if (!parsedUser?.id_user) {
                throw new Error(
                    "Data user tidak valid."
                );
            }

            // ROLE 2 = PETUGAS
            if (
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
            localStorage.removeItem(
                "isLoggedIn"
            );

            navigate("/login", {
                replace: true,
            });
        }
    }, [navigate]);

    // ==================================================
    // LOAD DETAIL CUSTOMER
    // ==================================================

    useEffect(() => {
        if (!user || !id) {
            return;
        }

        const loadCustomerDetail =
            async () => {
                try {
                    setLoading(true);
                    setError("");

                    const response =
                        await fetch(
                            `/users/${id}/detail`
                        );

                    const raw =
                        await response.text();

                    let result = {};

                    try {
                        result = raw
                            ? JSON.parse(raw)
                            : {};
                    } catch {
                        throw new Error(
                            "Server mengembalikan response yang bukan JSON."
                        );
                    }

                    if (!response.ok) {
                        throw new Error(
                            result.message ||
                                "Gagal mengambil detail customer."
                        );
                    }

                    const rows =
                        Array.isArray(
                            result.data
                        )
                            ? result.data
                            : [];

                    if (
                        rows.length === 0
                    ) {
                        throw new Error(
                            "Customer tidak ditemukan."
                        );
                    }

                    // ==================================================
                    // DATA CUSTOMER
                    // ==================================================

                    setCustomer({
                        id_user:
                            rows[0].id_user,

                        nama:
                            rows[0].nama,

                        email:
                            rows[0].email,

                        no_hp:
                            rows[0].no_hp,

                        alamat:
                            rows[0].alamat,

                        id_role:
                            rows[0].id_role,

                        nama_role:
                            rows[0].nama_role,

                        created_at:
                            rows[0].created_at,
                    });

                    // ==================================================
                    // RIWAYAT
                    // ==================================================

                    const grouped =
                        new Map();

                    rows.forEach(
                        (item) => {
                            if (
                                !item.id_peminjaman
                            ) {
                                return;
                            }

                            if (
                                !grouped.has(
                                    item.id_peminjaman
                                )
                            ) {
                                grouped.set(
                                    item.id_peminjaman,
                                    {
                                        id_peminjaman:
                                            item.id_peminjaman,

                                        tanggal_peminjaman:
                                            item.tanggal_peminjaman,

                                        tanggal_kembali:
                                            item.tanggal_kembali,

                                        total_harga:
                                            item.total_harga,

                                        status:
                                            item.status,

                                        kostum: [],

                                        pengembalian: null,
                                    }
                                );
                            }

                            const borrowing =
                                grouped.get(
                                    item.id_peminjaman
                                );

                            if (
                                item.id_detail
                            ) {
                                borrowing.kostum.push(
                                    {
                                        id_detail:
                                            item.id_detail,

                                        id_kostum:
                                            item.id_kostum,

                                        nama_kostum:
                                            item.nama_kostum,

                                        kode_koleksi:
                                            item.kode_koleksi,

                                        nama_koleksi:
                                            item.nama_koleksi,

                                        ukuran:
                                            item.ukuran,

                                        warna:
                                            item.warna,

                                        jumlah:
                                            item.jumlah,

                                        harga:
                                            item.harga,

                                        subtotal:
                                            item.subtotal,
                                    }
                                );
                            }

                            if (
                                item.id_pengembalian
                            ) {
                                borrowing.pengembalian =
                                    {
                                        id_pengembalian:
                                            item.id_pengembalian,

                                        tanggal_pengembalian:
                                            item.tanggal_pengembalian,

                                        kondisi_baju:
                                            item.kondisi_baju,

                                        denda:
                                            item.denda,

                                        keterangan:
                                            item.keterangan,

                                        nama_petugas:
                                            item.nama_petugas,
                                    };
                            }
                        }
                    );

                    setHistory(
                        Array.from(
                            grouped.values()
                        )
                    );
                } catch (err) {
                    console.error(
                        "Customer detail error:",
                        err
                    );

                    setError(
                        err.message ||
                            "Gagal mengambil detail customer."
                    );
                } finally {
                    setLoading(false);
                }
            };

        loadCustomerDetail();
    }, [user, id]);

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
    // STATUS CLASS
    // ==================================================

    const getStatusClass =
        (status) => {
            switch (
                String(
                    status || ""
                ).toLowerCase()
            ) {
                case "menunggu":
                    return "bg-yellow-500/10 text-yellow-400";

                case "disetujui":
                    return "bg-blue-500/10 text-blue-400";

                case "diproses":
                    return "bg-purple-500/10 text-purple-400";

                case "selesai":
                    return "bg-green-500/10 text-green-400";

                case "ditolak":
                    return "bg-red-500/10 text-red-400";

                case "dibatalkan":
                    return "bg-gray-500/10 text-gray-400";

                default:
                    return "bg-white/5 text-gray-400";
            }
        };

    // ==================================================
    // SUMMARY
    // ==================================================

    const totalPeminjaman =
        history.length;

    const totalSelesai =
        useMemo(() => {
            return history.filter(
                (item) =>
                    String(
                        item.status ||
                            ""
                    ).toLowerCase() ===
                    "selesai"
            ).length;
        }, [history]);

    const totalDenda =
        useMemo(() => {
            return history.reduce(
                (
                    total,
                    item
                ) =>
                    total +
                    Number(
                        item.pengembalian
                            ?.denda ||
                            0
                    ),
                0
            );
        }, [history]);

    // ==================================================
    // LOADING
    // ==================================================

    if (!user || loading) {
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
                    Memuat detail customer...
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
                        gap-5
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
                            Petugas Area
                        </p>

                        <h1
                            className="
                                text-3xl
                                font-bold
                                mt-2
                            "
                        >
                            Detail Customer
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Informasi pelanggan dan
                            riwayat transaksi.
                        </p>
                    </div>

                    <Link
                        to="/petugas/customer"
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
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
                        <FaArrowLeft />
                        Kembali
                    </Link>
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
                {/* ERROR */}

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
                        "
                    >
                        {error}
                    </div>
                )}

                {/* ==================================================
                    CUSTOMER PROFILE
                ================================================== */}

                {customer && (
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
                        <div
                            className="
                                flex
                                flex-col
                                lg:flex-row
                                lg:items-center
                                gap-7
                            "
                        >
                            {/* AVATAR */}

                            <div
                                className="
                                    w-24
                                    h-24
                                    rounded-3xl
                                    bg-[#D4AF37]/10
                                    border
                                    border-[#D4AF37]/20
                                    text-[#D4AF37]
                                    flex
                                    items-center
                                    justify-center
                                    text-4xl
                                    flex-shrink-0
                                "
                            >
                                <FaUser />
                            </div>

                            {/* DATA */}

                            <div className="flex-1">
                                <p
                                    className="
                                        text-[#D4AF37]
                                        text-xs
                                        uppercase
                                        tracking-[3px]
                                    "
                                >
                                    Customer
                                </p>

                                <h2
                                    className="
                                        text-3xl
                                        font-bold
                                        mt-2
                                    "
                                >
                                    {customer.nama}
                                </h2>

                                <div
                                    className="
                                        grid
                                        md:grid-cols-2
                                        xl:grid-cols-4
                                        gap-4
                                        mt-5
                                    "
                                >
                                    <div>
                                        <p className="text-gray-500 text-xs">
                                            Email
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                break-all
                                            "
                                        >
                                            {customer.email ||
                                                "-"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500 text-xs">
                                            No. HP
                                        </p>

                                        <p className="mt-1 text-sm">
                                            {customer.no_hp ||
                                                "-"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500 text-xs">
                                            Alamat
                                        </p>

                                        <p className="mt-1 text-sm">
                                            {customer.alamat ||
                                                "-"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500 text-xs">
                                            Terdaftar
                                        </p>

                                        <p className="mt-1 text-sm">
                                            {formatTanggal(
                                                customer.created_at
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
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
                            Total Peminjaman
                        </p>

                        <p
                            className="
                                text-3xl
                                font-bold
                                text-[#D4AF37]
                                mt-2
                            "
                        >
                            {totalPeminjaman}
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
                            Peminjaman Selesai
                        </p>

                        <p
                            className="
                                text-3xl
                                font-bold
                                text-green-400
                                mt-2
                            "
                        >
                            {totalSelesai}
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
                                text-3xl
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
                    RIWAYAT PEMINJAMAN
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
                    <div
                        className="
                            px-6
                            py-5
                            border-b
                            border-white/5
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >
                            <FaCalendarAlt className="text-[#D4AF37]" />

                            <div>
                                <h2 className="text-xl font-semibold">
                                    Riwayat Peminjaman
                                </h2>

                                <p className="text-xs text-gray-600 mt-1">
                                    Seluruh transaksi
                                    customer.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-5">
                        {history.length === 0 ? (
                            <div
                                className="
                                    text-center
                                    py-16
                                    text-gray-500
                                "
                            >
                                Customer belum memiliki
                                riwayat peminjaman.
                            </div>
                        ) : (
                            history.map(
                                (item) => (
                                    <div
                                        key={
                                            item.id_peminjaman
                                        }
                                        className="
                                            rounded-2xl
                                            border
                                            border-white/5
                                            bg-[#101010]
                                            p-5
                                        "
                                    >
                                        {/* HEADER */}

                                        <div
                                            className="
                                                flex
                                                flex-col
                                                md:flex-row
                                                md:items-center
                                                md:justify-between
                                                gap-4
                                            "
                                        >
                                            <div>
                                                <p className="text-[#D4AF37] font-semibold">
                                                    #
                                                    {
                                                        item.id_peminjaman
                                                    }
                                                </p>

                                                <p className="text-sm text-gray-400 mt-1">
                                                    {formatTanggal(
                                                        item.tanggal_peminjaman
                                                    )}{" "}
                                                    →{" "}
                                                    {formatTanggal(
                                                        item.tanggal_kembali
                                                    )}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={`
                                                        px-3
                                                        py-1.5
                                                        rounded-full
                                                        text-xs
                                                        ${getStatusClass(
                                                            item.status
                                                        )}
                                                    `}
                                                >
                                                    {item.status ||
                                                        "-"}
                                                </span>

                                                <Link
                                                    to={`/petugas/peminjaman/${item.id_peminjaman}`}
                                                    className="
                                                        px-3
                                                        py-2
                                                        rounded-lg
                                                        border
                                                        border-[#D4AF37]/20
                                                        text-[#D4AF37]
                                                        text-xs
                                                    "
                                                >
                                                    Detail
                                                </Link>
                                            </div>
                                        </div>

                                        {/* KOSTUM */}

                                        <div className="mt-5 space-y-3">
                                            {item.kostum
                                                .length ===
                                            0 ? (
                                                <p className="text-gray-600 text-sm">
                                                    Tidak ada detail
                                                    kostum.
                                                </p>
                                            ) : (
                                                item.kostum.map(
                                                    (
                                                        costume
                                                    ) => (
                                                        <div
                                                            key={
                                                                costume.id_detail
                                                            }
                                                            className="
                                                                rounded-xl
                                                                border
                                                                border-white/5
                                                                bg-[#151515]
                                                                p-4
                                                                flex
                                                                flex-col
                                                                md:flex-row
                                                                md:items-center
                                                                md:justify-between
                                                                gap-4
                                                            "
                                                        >
                                                            <div
                                                                className="
                                                                    flex
                                                                    items-center
                                                                    gap-3
                                                                "
                                                            >
                                                                <div
                                                                    className="
                                                                        w-10
                                                                        h-10
                                                                        rounded-xl
                                                                        bg-[#D4AF37]/10
                                                                        text-[#D4AF37]
                                                                        flex
                                                                        items-center
                                                                        justify-center
                                                                    "
                                                                >
                                                                    <FaTshirt />
                                                                </div>

                                                                <div>
                                                                    <p className="font-semibold">
                                                                        {
                                                                            costume.nama_kostum
                                                                        }
                                                                    </p>

                                                                    <p className="text-xs text-[#D4AF37] mt-1">
                                                                        {
                                                                            costume.kode_koleksi
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div
                                                                className="
                                                                    grid
                                                                    grid-cols-3
                                                                    gap-6
                                                                    text-sm
                                                                "
                                                            >
                                                                <div>
                                                                    <p className="text-gray-600 text-xs">
                                                                        Jumlah
                                                                    </p>

                                                                    <p className="mt-1">
                                                                        {
                                                                            costume.jumlah
                                                                        }
                                                                    </p>
                                                                </div>

                                                                <div>
                                                                    <p className="text-gray-600 text-xs">
                                                                        Harga
                                                                    </p>

                                                                    <p className="mt-1">
                                                                        {formatRupiah(
                                                                            costume.harga
                                                                        )}
                                                                    </p>
                                                                </div>

                                                                <div>
                                                                    <p className="text-gray-600 text-xs">
                                                                        Subtotal
                                                                    </p>

                                                                    <p className="mt-1 text-[#D4AF37] font-semibold">
                                                                        {formatRupiah(
                                                                            costume.subtotal
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                )
                                            )}
                                        </div>

                                        {/* TOTAL */}

                                        <div
                                            className="
                                                flex
                                                justify-end
                                                border-t
                                                border-white/5
                                                mt-5
                                                pt-4
                                            "
                                        >
                                            <div className="text-right">
                                                <p className="text-gray-600 text-xs">
                                                    Total Peminjaman
                                                </p>

                                                <p
                                                    className="
                                                        text-lg
                                                        font-bold
                                                        text-[#D4AF37]
                                                        mt-1
                                                    "
                                                >
                                                    {formatRupiah(
                                                        item.total_harga
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {/* ==================================================
                                            PENGEMBALIAN
                                        ================================================== */}

                                        {item.pengembalian && (
                                            <div
                                                className="
                                                    mt-5
                                                    rounded-2xl
                                                    border
                                                    border-green-500/10
                                                    bg-green-500/5
                                                    p-5
                                                "
                                            >
                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-3
                                                        mb-4
                                                    "
                                                >
                                                    <FaUndoAlt className="text-green-400" />

                                                    <h3 className="font-semibold text-green-400">
                                                        Informasi Pengembalian
                                                    </h3>
                                                </div>

                                                <div
                                                    className="
                                                        grid
                                                        md:grid-cols-2
                                                        lg:grid-cols-4
                                                        gap-4
                                                    "
                                                >
                                                    <div>
                                                        <p className="text-gray-600 text-xs">
                                                            Tanggal
                                                        </p>

                                                        <p className="mt-1 text-sm">
                                                            {formatTanggal(
                                                                item
                                                                    .pengembalian
                                                                    .tanggal_pengembalian
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-gray-600 text-xs">
                                                            Kondisi
                                                        </p>

                                                        <p className="mt-1 text-sm">
                                                            {
                                                                item
                                                                    .pengembalian
                                                                    .kondisi_baju
                                                            }
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-gray-600 text-xs">
                                                            Denda
                                                        </p>

                                                        <p className="mt-1 text-sm text-yellow-400 font-semibold">
                                                            {formatRupiah(
                                                                item
                                                                    .pengembalian
                                                                    .denda
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-gray-600 text-xs">
                                                            Diterima Oleh
                                                        </p>

                                                        <p className="mt-1 text-sm">
                                                            {item
                                                                .pengembalian
                                                                .nama_petugas ||
                                                                "-"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {item
                                                    .pengembalian
                                                    .keterangan && (
                                                    <div className="mt-4">
                                                        <p className="text-gray-600 text-xs">
                                                            Keterangan
                                                        </p>

                                                        <p className="mt-1 text-sm text-gray-300">
                                                            {
                                                                item
                                                                    .pengembalian
                                                                    .keterangan
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )
                            )
                        )}
                    </div>
                </section>

                <div className="mt-6">
                    <Link
                        to="/petugas/customer"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            text-gray-500
                            hover:text-[#D4AF37]
                            transition
                        "
                    >
                        <FaArrowLeft />
                        Kembali ke Customer
                    </Link>
                </div>
            </main>
        </div>
    );
}

export default CustomerDetail;