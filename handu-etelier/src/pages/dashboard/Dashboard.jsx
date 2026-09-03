import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    FaClipboardList,
    FaClock,
    FaCheckCircle,
    FaTshirt,
    FaChevronRight
} from "react-icons/fa";

import UserLayout from "../user/UserLayout";

function Dashboard() {

    const navigate =
        useNavigate();

    const [user, setUser] =
        useState(null);

    const [borrowings, setBorrowings] =
        useState([]);

    const [kostums, setKostums] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    // ======================================================
    // LOAD DASHBOARD
    // ======================================================

    useEffect(() => {

        const loadDashboard =
            async () => {

                const storedUser =
                    localStorage.getItem(
                        "user"
                    );

                // ==========================================
                // CEK SESSION
                // ==========================================

                if (!storedUser) {

                    navigate(
                        "/login",
                        {
                            replace: true
                        }
                    );

                    return;
                }

                try {

                    // ======================================
                    // PARSE USER
                    // ======================================

                    const parsedUser =
                        JSON.parse(
                            storedUser
                        );

                    if (
                        !parsedUser?.id_user
                    ) {
                        throw new Error(
                            "Data user tidak valid."
                        );
                    }

                    setUser(
                        parsedUser
                    );

                    // ======================================
                    // AMBIL DATA
                    // ======================================

                    const [
                        borrowResponse,
                        costumeResponse
                    ] = await Promise.all([
                        fetch(
                            "/peminjaman"
                        ),
                        fetch(
                            "/kostum"
                        )
                    ]);

                    // ======================================
                    // RESPONSE
                    // ======================================

                    const borrowResult =
                        await borrowResponse.json();

                    const costumeResult =
                        await costumeResponse.json();

                    // ======================================
                    // NORMALISASI PEMINJAMAN
                    // ======================================

                    const allBorrowings =
                        borrowResult?.data ||
                        borrowResult?.peminjaman ||
                        borrowResult;

                    // ======================================
                    // NORMALISASI KOSTUM
                    // ======================================

                    const allKostums =
                        costumeResult?.data ||
                        costumeResult?.kostum ||
                        costumeResult;

                    // ======================================
                    // SIMPAN PEMINJAMAN USER
                    // ======================================

                    if (
                        Array.isArray(
                            allBorrowings
                        )
                    ) {

                        setBorrowings(
                            allBorrowings.filter(
                                (item) =>
                                    Number(
                                        item.id_user
                                    ) ===
                                    Number(
                                        parsedUser.id_user
                                    )
                            )
                        );

                    } else {

                        setBorrowings([]);

                    }

                    // ======================================
                    // SIMPAN KOSTUM
                    // ======================================

                    if (
                        Array.isArray(
                            allKostums
                        )
                    ) {

                        setKostums(
                            allKostums
                        );

                    } else {

                        setKostums([]);

                    }

                } catch (error) {

                    console.error(
                        "Dashboard error:",
                        error
                    );

                    // ======================================
                    // SESSION TIDAK VALID
                    // ======================================

                    localStorage.removeItem(
                        "user"
                    );

                    localStorage.removeItem(
                        "isLoggedIn"
                    );

                    localStorage.removeItem(
                        "admin"
                    );

                    localStorage.removeItem(
                        "isAdminLoggedIn"
                    );

                    navigate(
                        "/login",
                        {
                            replace: true
                        }
                    );

                } finally {

                    setLoading(
                        false
                    );

                }

            };

        loadDashboard();

    }, [
        navigate
    ]);

    // ======================================================
    // FORMAT RUPIAH
    // ======================================================

    const formatRupiah =
        (value) =>
            new Intl.NumberFormat(
                "id-ID",
                {
                    style:
                        "currency",
                    currency:
                        "IDR",
                    maximumFractionDigits:
                        0
                }
            ).format(
                Number(
                    value
                ) || 0
            );

    // ======================================================
    // PEMINJAMAN AKTIF
    // ======================================================

    const activeCount =
        useMemo(
            () =>
                borrowings.filter(
                    (item) =>
                        [
                            "disetujui",
                            "diproses"
                        ].includes(
                            String(
                                item.status ||
                                ""
                            )
                                .toLowerCase()
                                .trim()
                        )
                ).length,
            [
                borrowings
            ]
        );

    // ======================================================
    // PEMINJAMAN MENUNGGU
    // ======================================================

    const waitingCount =
        useMemo(
            () =>
                borrowings.filter(
                    (item) =>
                        String(
                            item.status ||
                            ""
                        )
                            .toLowerCase()
                            .trim() ===
                        "menunggu"
                ).length,
            [
                borrowings
            ]
        );

    // ======================================================
    // PEMINJAMAN SELESAI
    // ======================================================

    const finishedCount =
        useMemo(
            () =>
                borrowings.filter(
                    (item) =>
                        String(
                            item.status ||
                            ""
                        )
                            .toLowerCase()
                            .trim() ===
                        "selesai"
                ).length,
            [
                borrowings
            ]
        );

    // ======================================================
    // PEMINJAMAN TERBARU
    // ======================================================

    const recentBorrowings =
        useMemo(
            () =>
                [...borrowings]
                    .sort(
                        (
                            a,
                            b
                        ) =>
                            Number(
                                b.id_peminjaman ||
                                0
                            ) -
                            Number(
                                a.id_peminjaman ||
                                0
                            )
                    )
                    .slice(
                        0,
                        4
                    ),
            [
                borrowings
            ]
        );

    // ======================================================
    // STATUS CLASS
    // ======================================================

    const getStatusClass =
        (status) => {

            switch (
                String(
                    status ||
                    ""
                )
                    .toLowerCase()
                    .trim()
            ) {

                case "menunggu":

                    return `
                        text-yellow-400
                        bg-yellow-400/10
                    `;

                case "disetujui":

                    return `
                        text-blue-400
                        bg-blue-400/10
                    `;

                case "diproses":

                    return `
                        text-purple-400
                        bg-purple-400/10
                    `;

                case "selesai":

                    return `
                        text-green-400
                        bg-green-400/10
                    `;

                case "ditolak":

                    return `
                        text-red-400
                        bg-red-400/10
                    `;

                default:

                    return `
                        text-gray-400
                        bg-white/5
                    `;

            }
        };

    // ======================================================
    // LOADING
    // ======================================================

    if (
        loading ||
        !user
    ) {

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

                <p
                    className="
                        text-[#D4AF37]
                    "
                >
                    Memuat dashboard...
                </p>

            </div>

        );

    }

    // ======================================================
    // RENDER
    // ======================================================

    return (

        <UserLayout
            title="Dashboard"
            subtitle={`Selamat datang kembali, ${user.nama}`}
        >

            {/* ==================================================
                WELCOME
            ================================================== */}

            <section
                className="
                    relative
                    overflow-hidden
                    rounded-3xl
                    border
                    border-[#D4AF37]/15
                    bg-gradient-to-br
                    from-[#1A160C]
                    to-[#111111]
                    p-7
                    md:p-9
                "
            >

                <div
                    className="
                        absolute
                        -right-20
                        -top-20
                        w-64
                        h-64
                        rounded-full
                        bg-[#D4AF37]/10
                        blur-[90px]
                    "
                />

                <p
                    className="
                        uppercase
                        tracking-[4px]
                        text-[#D4AF37]
                        text-xs
                    "
                >
                    Member Dashboard
                </p>

                <h2
                    className="
                        text-3xl
                        md:text-4xl
                        font-bold
                        mt-3
                    "
                >
                    Halo, {user.nama}
                </h2>

                <p
                    className="
                        text-gray-500
                        mt-3
                        max-w-2xl
                        leading-7
                    "
                >
                    Pantau peminjaman, lihat
                    koleksi kostum, dan kelola
                    akun Anda dalam satu tempat.
                </p>

                {/* =========================================
                    TOMBOL
                    HANYA PEMINJAMAN SAYA
                ========================================= */}

                <div
                    className="
                        flex
                        flex-wrap
                        gap-3
                        mt-7
                    "
                >

                    <Link
                        to="/my-borrowings"
                        className="
                            px-5
                            py-3
                            rounded-xl
                            border
                            border-[#D4AF37]/30
                            text-[#D4AF37]
                            hover:bg-[#D4AF37]/10
                            transition
                        "
                    >
                        Peminjaman Saya
                    </Link>

                </div>

            </section>

            {/* ==================================================
                STAT
            ================================================== */}

            <section
                className="
                    grid
                    sm:grid-cols-2
                    xl:grid-cols-4
                    gap-4
                    mt-5
                "
            >

                {/* TOTAL */}

                <div
                    className="
                        rounded-2xl
                        bg-[#111111]
                        border
                        border-[#D4AF37]/15
                        p-5
                    "
                >

                    <div
                        className="
                            flex
                            justify-between
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-gray-500
                                    text-sm
                                "
                            >
                                Total Peminjaman
                            </p>

                            <p
                                className="
                                    text-3xl
                                    font-bold
                                    text-[#D4AF37]
                                    mt-3
                                "
                            >
                                {
                                    borrowings.length
                                }
                            </p>

                        </div>

                        <FaClipboardList
                            className="
                                text-[#D4AF37]
                                text-3xl
                            "
                        />

                    </div>

                </div>

                {/* AKTIF */}

                <div
                    className="
                        rounded-2xl
                        bg-[#111111]
                        border
                        border-[#D4AF37]/15
                        p-5
                    "
                >

                    <div
                        className="
                            flex
                            justify-between
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-gray-500
                                    text-sm
                                "
                            >
                                Peminjaman Aktif
                            </p>

                            <p
                                className="
                                    text-3xl
                                    font-bold
                                    text-[#D4AF37]
                                    mt-3
                                "
                            >
                                {
                                    activeCount
                                }
                            </p>

                        </div>

                        <FaTshirt
                            className="
                                text-[#D4AF37]
                                text-3xl
                            "
                        />

                    </div>

                </div>

                {/* MENUNGGU */}

                <div
                    className="
                        rounded-2xl
                        bg-[#111111]
                        border
                        border-[#D4AF37]/15
                        p-5
                    "
                >

                    <div
                        className="
                            flex
                            justify-between
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-gray-500
                                    text-sm
                                "
                            >
                                Menunggu
                            </p>

                            <p
                                className="
                                    text-3xl
                                    font-bold
                                    text-[#D4AF37]
                                    mt-3
                                "
                            >
                                {
                                    waitingCount
                                }
                            </p>

                        </div>

                        <FaClock
                            className="
                                text-[#D4AF37]
                                text-3xl
                            "
                        />

                    </div>

                </div>

                {/* SELESAI */}

                <div
                    className="
                        rounded-2xl
                        bg-[#111111]
                        border
                        border-[#D4AF37]/15
                        p-5
                    "
                >

                    <div
                        className="
                            flex
                            justify-between
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-gray-500
                                    text-sm
                                "
                            >
                                Selesai
                            </p>

                            <p
                                className="
                                    text-3xl
                                    font-bold
                                    text-[#D4AF37]
                                    mt-3
                                "
                            >
                                {
                                    finishedCount
                                }
                            </p>

                        </div>

                        <FaCheckCircle
                            className="
                                text-[#D4AF37]
                                text-3xl
                            "
                        />

                    </div>

                </div>

            </section>

            {/* ==================================================
                CONTENT
            ================================================== */}

            <section
                className="
                    grid
                    xl:grid-cols-5
                    gap-5
                    mt-5
                "
            >

                {/* ==================================================
                    PEMINJAMAN TERBARU
                ================================================== */}

                <div
                    className="
                        xl:col-span-3
                        rounded-2xl
                        bg-[#111111]
                        border
                        border-[#D4AF37]/15
                        overflow-hidden
                    "
                >

                    <div
                        className="
                            px-5
                            py-4
                            border-b
                            border-white/5
                            flex
                            justify-between
                            items-center
                        "
                    >

                        <div>

                            <h3
                                className="
                                    font-semibold
                                "
                            >
                                Peminjaman Terbaru
                            </h3>

                            <p
                                className="
                                    text-xs
                                    text-gray-600
                                    mt-1
                                "
                            >
                                Aktivitas terakhir Anda
                            </p>

                        </div>

                        <Link
                            to="/my-borrowings"
                            className="
                                text-xs
                                text-[#D4AF37]
                                hover:underline
                            "
                        >
                            Lihat Semua
                        </Link>

                    </div>

                    {recentBorrowings.length === 0 ? (

                        <div
                            className="
                                px-6
                                py-14
                                text-center
                                text-gray-600
                            "
                        >
                            Belum ada peminjaman.
                        </div>

                    ) : (

                        <div
                            className="
                                divide-y
                                divide-white/5
                            "
                        >

                            {recentBorrowings.map(
                                (
                                    item
                                ) => (

                                    <Link
                                        key={
                                            item.id_peminjaman
                                        }
                                        to={`/borrow-detail/${item.id_peminjaman}`}
                                        className="
                                            flex
                                            items-center
                                            gap-4
                                            px-5
                                            py-4
                                            hover:bg-white/[0.02]
                                            transition
                                        "
                                    >

                                        <div
                                            className="
                                                w-11
                                                h-11
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

                                        <div
                                            className="
                                                flex-1
                                                min-w-0
                                            "
                                        >

                                            <p
                                                className="
                                                    font-semibold
                                                    truncate
                                                "
                                            >
                                                {
                                                    item.nama_kostum ||
                                                    "Kostum"
                                                }
                                            </p>

                                            <p
                                                className="
                                                    text-xs
                                                    text-gray-600
                                                    mt-1
                                                "
                                            >
                                                #{item.id_peminjaman}

                                                {
                                                    item.kode_koleksi
                                                        ? ` • ${item.kode_koleksi}`
                                                        : ""
                                                }
                                            </p>

                                        </div>

                                        <span
                                            className={`
                                                text-[10px]
                                                px-3
                                                py-1.5
                                                rounded-full
                                                ${getStatusClass(
                                                    item.status
                                                )}
                                            `}
                                        >
                                            {
                                                item.status
                                            }
                                        </span>

                                        <FaChevronRight
                                            className="
                                                text-gray-700
                                                text-xs
                                            "
                                        />

                                    </Link>

                                )
                            )}

                        </div>

                    )}

                </div>

                {/* ==================================================
                    KOLEKSI KOSTUM
                ================================================== */}

                <div
                    className="
                        xl:col-span-2
                        rounded-2xl
                        bg-[#111111]
                        border
                        border-[#D4AF37]/15
                        p-5
                    "
                >

                    <div
                        className="
                            flex
                            justify-between
                            items-center
                        "
                    >

                        <div>

                            <h3
                                className="
                                    font-semibold
                                "
                            >
                                Koleksi Kostum
                            </h3>

                            <p
                                className="
                                    text-xs
                                    text-gray-600
                                    mt-1
                                "
                            >
                                Koleksi tersedia untuk Anda
                            </p>

                        </div>

                        <FaTshirt
                            className="
                                text-[#D4AF37]
                            "
                        />

                    </div>

                    <div
                        className="
                            mt-5
                            space-y-3
                        "
                    >

                        {kostums
                            .slice(
                                0,
                                5
                            )
                            .map(
                                (
                                    item
                                ) => (

                                    <div
                                        key={
                                            item.id_kostum
                                        }
                                        className="
                                            rounded-xl
                                            bg-[#161616]
                                            border
                                            border-white/5
                                            px-4
                                            py-3
                                            flex
                                            items-center
                                            justify-between
                                        "
                                    >

                                        <div>

                                            <p
                                                className="
                                                    text-sm
                                                    font-semibold
                                                "
                                            >
                                                {
                                                    item.nama_kostum ||
                                                    "-"
                                                }
                                            </p>

                                            <p
                                                className="
                                                    text-[11px]
                                                    text-gray-600
                                                    mt-1
                                                "
                                            >
                                                {
                                                    item.kode_koleksi ||
                                                    item.id_kostum
                                                }
                                            </p>

                                        </div>

                                        <p
                                            className="
                                                text-xs
                                                text-[#D4AF37]
                                            "
                                        >
                                            {
                                                formatRupiah(
                                                    item.harga_sewa
                                                )
                                            }
                                        </p>

                                    </div>

                                )
                            )}

                        {kostums.length === 0 && (

                            <div
                                className="
                                    py-8
                                    text-center
                                    text-sm
                                    text-gray-600
                                "
                            >
                                Belum ada data kostum.
                            </div>

                        )}

                    </div>

                </div>

            </section>

        </UserLayout>

    );

}

export default Dashboard;