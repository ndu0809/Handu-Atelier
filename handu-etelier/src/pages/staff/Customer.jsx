import { useEffect, useMemo, useState } from "react";
import {
    FaArrowLeft,
    FaEnvelope,
    FaPhone,
    FaSearch,
    FaSyncAlt,
    FaUser,
    FaMapMarkerAlt,
} from "react-icons/fa";
import {
    Link,
    useNavigate,
} from "react-router-dom";

function Customer() {
    const navigate = useNavigate();

    // ==================================================
    // SESSION
    // ==================================================

    const [user, setUser] = useState(null);

    // ==================================================
    // DATA
    // ==================================================

    const [customers, setCustomers] =
        useState([]);

    // ==================================================
    // UI
    // ==================================================

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

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
            const parsedUser =
                JSON.parse(storedUser);

            if (!parsedUser?.id_user) {
                throw new Error(
                    "Data user tidak valid."
                );
            }

            // Role 2 = Petugas
            if (
                Number(
                    parsedUser.id_role
                ) !== 2
            ) {
                navigate(
                    "/dashboard",
                    {
                        replace: true,
                    }
                );

                return;
            }

            setUser(parsedUser);
        } catch (err) {
            console.error(
                "Session error:",
                err
            );

            localStorage.removeItem(
                "user"
            );

            localStorage.removeItem(
                "isLoggedIn"
            );

            navigate("/login", {
                replace: true,
            });
        }
    }, [navigate]);

    // ==================================================
    // LOAD USERS
    // ==================================================

    const loadCustomers =
        async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await fetch(
                        "/users"
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
                            "Gagal mengambil data customer."
                    );
                }

                const rows =
                    Array.isArray(
                        result
                    )
                        ? result
                        : result.data;

                if (
                    !Array.isArray(
                        rows
                    )
                ) {
                    throw new Error(
                        "Format data user dari server tidak sesuai."
                    );
                }

                // ==================================================
                // CUSTOMER
                // ==================================================
                // Kita tidak menebak ID role.
                // Ambil user yang bukan admin/petugas.
                //
                // Bila nama_role kosong, data tetap disimpan
                // agar tidak kehilangan customer karena perbedaan
                // penamaan role di database.
                // ==================================================

                const customerRows =
                    rows.filter(
                        (item) => {
                            const role =
                                String(
                                    item.nama_role ||
                                        ""
                                )
                                    .trim()
                                    .toLowerCase();

                            // Role yang jelas bukan customer
                            const isStaff =
                                role ===
                                    "petugas" ||
                                role ===
                                    "admin";

                            return !isStaff;
                        }
                    );

                setCustomers(
                    customerRows
                );
            } catch (err) {
                console.error(
                    "Load customer:",
                    err
                );

                setError(
                    err.message ||
                        "Gagal mengambil data customer."
                );
            } finally {
                setLoading(false);
            }
        };

    // ==================================================
    // LOAD AWAL
    // ==================================================

    useEffect(() => {
        if (user) {
            loadCustomers();
        }
    }, [user]);

    // ==================================================
    // FILTER SEARCH
    // ==================================================

    const filteredCustomers =
        useMemo(() => {
            const keyword =
                search
                    .trim()
                    .toLowerCase();

            if (!keyword) {
                return customers;
            }

            return customers.filter(
                (item) =>
                    String(
                        item.nama ||
                            ""
                    )
                        .toLowerCase()
                        .includes(
                            keyword
                        ) ||
                    String(
                        item.email ||
                            ""
                    )
                        .toLowerCase()
                        .includes(
                            keyword
                        ) ||
                    String(
                        item.no_hp ||
                            ""
                    )
                        .toLowerCase()
                        .includes(
                            keyword
                        ) ||
                    String(
                        item.alamat ||
                            ""
                    )
                        .toLowerCase()
                        .includes(
                            keyword
                        )
            );
        }, [
            customers,
            search,
        ]);

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
                    Memuat data customer...
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
                            Customer
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Melihat data pelanggan
                            yang terdaftar.
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
                                loadCustomers
                            }
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
                            <FaSyncAlt />
                            Refresh
                        </button>
                    </div>
                </div>
            </header>

            {/* ==================================================
                MAIN
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
                    SUMMARY
                ================================================== */}

                <section
                    className="
                        grid
                        sm:grid-cols-2
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
                            Total Customer
                        </p>

                        <p
                            className="
                                text-3xl
                                font-bold
                                text-[#D4AF37]
                                mt-2
                            "
                        >
                            {customers.length}
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
                            Hasil Pencarian
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
                                filteredCustomers.length
                            }
                        </p>
                    </div>
                </section>

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
                            placeholder="Cari nama, email, nomor HP, atau alamat..."
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
                        <table className="w-full min-w-[1000px]">

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
                                        Customer
                                    </th>

                                    <th className="text-left px-5 py-4 text-gray-500 text-sm">
                                        Email
                                    </th>

                                    <th className="text-left px-5 py-4 text-gray-500 text-sm">
                                        No. HP
                                    </th>

                                    <th className="text-left px-5 py-4 text-gray-500 text-sm">
                                        Alamat
                                    </th>

                                    <th className="text-left px-5 py-4 text-gray-500 text-sm">
                                        Role
                                    </th>

                                </tr>
                            </thead>

                            <tbody>

                                {filteredCustomers.length ===
                                0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="
                                                text-center
                                                py-16
                                                text-gray-500
                                            "
                                        >
                                            Tidak ada customer
                                            yang ditemukan.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCustomers.map(
                                        (
                                            item
                                        ) => (
                                            <tr
                                                key={
                                                    item.id_user
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
                                                        item.id_user
                                                    }
                                                </td>

                                                {/* CUSTOMER */}

                                                <td className="px-5 py-5">

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
                                                            <FaUser />
                                                        </div>

                                                        <div>
                                                            <p className="font-semibold">
                                                                {
                                                                    item.nama
                                                                }
                                                            </p>

                                                            <p className="text-xs text-gray-600 mt-1">
                                                                Customer
                                                            </p>
                                                        </div>
                                                    </div>

                                                </td>

                                                {/* EMAIL */}

                                                <td className="px-5 py-5">

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-2
                                                        "
                                                    >
                                                        <FaEnvelope className="text-gray-600" />

                                                        <span className="text-gray-300">
                                                            {
                                                                item.email ||
                                                                "-"
                                                            }
                                                        </span>
                                                    </div>

                                                </td>

                                                {/* PHONE */}

                                                <td className="px-5 py-5">

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-2
                                                        "
                                                    >
                                                        <FaPhone className="text-gray-600" />

                                                        <span className="text-gray-300">
                                                            {
                                                                item.no_hp ||
                                                                "-"
                                                            }
                                                        </span>
                                                    </div>

                                                </td>

                                                {/* ALAMAT */}

                                                <td className="px-5 py-5">

                                                    <div
                                                        className="
                                                            flex
                                                            items-start
                                                            gap-2
                                                        "
                                                    >
                                                        <FaMapMarkerAlt
                                                            className="
                                                                text-gray-600
                                                                mt-1
                                                            "
                                                        />

                                                        <span className="text-gray-300 max-w-xs">
                                                            {
                                                                item.alamat ||
                                                                "-"
                                                            }
                                                        </span>
                                                    </div>

                                                </td>

                                                {/* ROLE */}

                                                <td className="px-5 py-5">

                                                    <span
                                                        className="
                                                            inline-flex
                                                            px-3
                                                            py-1.5
                                                            rounded-full
                                                            bg-green-500/10
                                                            border
                                                            border-green-500/20
                                                            text-green-400
                                                            text-xs
                                                        "
                                                    >
                                                        {
                                                            item.nama_role ||
                                                            "Customer"
                                                        }
                                                    </span>

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
                            transition
                        "
                    >
                        <FaArrowLeft />
                        Kembali ke Dashboard
                    </Link>

                </div>
            </main>
        </div>
    );
}

export default Customer;