import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import Navbar from "../../components/layout/Navbar";

function BorrowForm() {

    const { code } = useParams();
    const navigate = useNavigate();

    // ======================================================
    // STATE KOSTUM
    // ======================================================

    const [costume, setCostume] = useState(null);

    // ======================================================
    // FORM
    // ======================================================

    const [formData, setFormData] = useState({
        tanggal_peminjaman: "",
        tanggal_kembali: "",
        metode_pembayaran: "QRIS",
        persentase_pembayaran: "50"
    });

    // ======================================================
    // BUKTI PEMBAYARAN
    // ======================================================

    const [buktiFile, setBuktiFile] = useState(null);
    const [buktiPreview, setBuktiPreview] = useState("");

    // ======================================================
    // DOKUMEN JAMINAN
    // ======================================================

    const [jenisDokumen, setJenisDokumen] = useState("KTP");
    const [dokumenJaminan, setDokumenJaminan] = useState(null);
    const [dokumenPreview, setDokumenPreview] = useState("");

    // ======================================================
    // STATUS
    // ======================================================

    const [loading, setLoading] = useState(true);
    const [checkingAvailability, setCheckingAvailability] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [availability, setAvailability] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ======================================================
    // AMBIL DATA KOSTUM
    // ======================================================

    useEffect(() => {

        let cancelled = false;

        const fetchCostume = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await fetch(
                    `/kostum/${code}`,
                    {
                        cache: "no-store"
                    }
                );

                let result = {};

                try {
                    result = await response.json();
                } catch {
                    result = {};
                }

                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Kostum tidak ditemukan."
                    );

                }

                const data =
                    result.data ||
                    result.kostum ||
                    result;

                if (!data || !data.id_kostum) {

                    throw new Error(
                        "Data kostum tidak valid."
                    );

                }

                if (!cancelled) {

                    setCostume(data);

                }

            } catch (err) {

                console.error(
                    "Error mengambil kostum:",
                    err
                );

                if (!cancelled) {

                    setError(
                        err.message ||
                        "Data kostum tidak dapat dimuat."
                    );

                }

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }

            }

        };

        if (code) {

            fetchCostume();

        } else {

            setLoading(false);

            setError(
                "Kode kostum tidak ditemukan."
            );

        }

        return () => {
            cancelled = true;
        };

    }, [code]);

    // ======================================================
    // HANDLE INPUT
    // ======================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        setError("");
        setSuccess("");

        if (
            name === "tanggal_peminjaman" ||
            name === "tanggal_kembali"
        ) {

            setAvailability(null);

        }

    };

    // ======================================================
    // HANDLE BUKTI PEMBAYARAN
    // ======================================================

    const handleBuktiChange = (e) => {

        const file = e.target.files?.[0];

        setError("");
        setSuccess("");

        if (!file) {

            setBuktiFile(null);
            setBuktiPreview("");

            return;

        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "application/pdf"
        ];

        if (!allowedTypes.includes(file.type)) {

            setBuktiFile(null);
            setBuktiPreview("");

            e.target.value = "";

            setError(
                "Bukti pembayaran harus berupa JPG, PNG, WEBP, atau PDF."
            );

            return;

        }

        if (file.size > 5 * 1024 * 1024) {

            setBuktiFile(null);
            setBuktiPreview("");

            e.target.value = "";

            setError(
                "Ukuran bukti pembayaran maksimal 5 MB."
            );

            return;

        }

        setBuktiFile(file);

        if (file.type.startsWith("image/")) {

            const previewUrl =
                URL.createObjectURL(file);

            setBuktiPreview(previewUrl);

        } else {

            setBuktiPreview("");

        }

    };

    // ======================================================
    // HANDLE DOKUMEN JAMINAN
    // ======================================================

    const handleDokumenChange = (e) => {

        const file = e.target.files?.[0];

        setError("");
        setSuccess("");

        if (!file) {

            setDokumenJaminan(null);
            setDokumenPreview("");

            return;

        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {

            setDokumenJaminan(null);
            setDokumenPreview("");

            e.target.value = "";

            setError(
                "Dokumen jaminan harus berupa JPG, PNG, atau WEBP."
            );

            return;

        }

        if (file.size > 5 * 1024 * 1024) {

            setDokumenJaminan(null);
            setDokumenPreview("");

            e.target.value = "";

            setError(
                "Ukuran dokumen jaminan maksimal 5 MB."
            );

            return;

        }

        setDokumenJaminan(file);

        const previewUrl =
            URL.createObjectURL(file);

        setDokumenPreview(previewUrl);

    };

    // ======================================================
    // HITUNG DURASI
    // ======================================================

    const calculateDays = () => {

        if (
            !formData.tanggal_peminjaman ||
            !formData.tanggal_kembali
        ) {

            return 0;

        }

        const start = new Date(
            `${formData.tanggal_peminjaman}T00:00:00`
        );

        const end = new Date(
            `${formData.tanggal_kembali}T00:00:00`
        );

        const difference =
            end.getTime() -
            start.getTime();

        const days =
            Math.ceil(
                difference /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            );

        return days > 0 ? days : 0;

    };

    const jumlahHari = calculateDays();

    // ======================================================
    // PARSE HARGA
    // ======================================================

    const parseHarga = (value) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

            return 0;

        }

        if (
            typeof value === "number" &&
            Number.isFinite(value)
        ) {

            return value;

        }

        let cleaned =
            String(value)
                .trim()
                .replace(/Rp/gi, "")
                .replace(/\s/g, "");

        if (
            cleaned.includes(".") &&
            cleaned.includes(",")
        ) {

            cleaned =
                cleaned
                    .replace(/\./g, "")
                    .replace(/,/g, ".");

        } else if (
            cleaned.includes(".")
        ) {

            cleaned =
                cleaned.replace(/\./g, "");

        } else if (
            cleaned.includes(",")
        ) {

            cleaned =
                cleaned.replace(/,/g, ".");

        }

        const parsed =
            Number(cleaned);

        return Number.isFinite(parsed)
            ? parsed
            : 0;

    };

    // ======================================================
    // HARGA
    // ======================================================

    const hargaPerHari =
        parseHarga(costume?.harga_sewa) ||
        parseHarga(costume?.harga) ||
        parseHarga(costume?.harga_per_hari) ||
        parseHarga(costume?.hargaSewa) ||
        parseHarga(costume?.data?.harga_sewa) ||
        parseHarga(costume?.data?.harga) ||
        0;

    // ======================================================
    // TOTAL
    // ======================================================

    const totalHarga =
        jumlahHari *
        hargaPerHari;

    // ======================================================
    // PEMBAYARAN
    // ======================================================

    const persentasePembayaran =
        Number(
            formData.persentase_pembayaran
        ) === 100
            ? 100
            : 50;

    const jumlahPembayaran =
        Math.round(
            totalHarga *
            (
                persentasePembayaran /
                100
            )
        );

    const sisaPembayaran =
        Math.max(
            0,
            totalHarga -
            jumlahPembayaran
        );

    // ======================================================
    // STATUS KOSTUM
    // ======================================================

    const stokKostum =
        Number(costume?.stok) || 0;

    const statusKostum =
        String(
            costume?.status || ""
        )
            .trim()
            .toLowerCase();

    const isAvailable =
        statusKostum === "tersedia" &&
        stokKostum > 0;

    const hasCompleteDates =
        Boolean(
            formData.tanggal_peminjaman &&
            formData.tanggal_kembali
        );

    // ======================================================
    // CEK AVAILABILITY
    // ======================================================

    useEffect(() => {

        let cancelled = false;

        const checkAvailability = async () => {

            if (
                !costume?.id_kostum ||
                !formData.tanggal_peminjaman ||
                !formData.tanggal_kembali ||
                jumlahHari <= 0
            ) {

                setAvailability(null);

                return;

            }

            try {

                setCheckingAvailability(true);
                setError("");

                const params =
                    new URLSearchParams({
                        id_kostum:
                            String(
                                costume.id_kostum
                            ),

                        tanggal_peminjaman:
                            formData.tanggal_peminjaman,

                        tanggal_kembali:
                            formData.tanggal_kembali,

                        jumlah: "1"
                    });

                const response =
                    await fetch(
                        `/peminjaman/check-availability?${params.toString()}`,
                        {
                            cache: "no-store"
                        }
                    );

                let result = {};

                try {

                    result =
                        await response.json();

                } catch {

                    result = {};

                }

                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Gagal mengecek ketersediaan kostum."
                    );

                }

                const data =
                    result.data ||
                    result;

                if (!cancelled) {

                    setAvailability(data);

                }

            } catch (err) {

                console.error(
                    "Availability error:",
                    err
                );

                if (!cancelled) {

                    setAvailability({
                        tersedia: false,
                        message:
                            err.message ||
                            "Ketersediaan kostum tidak dapat diperiksa."
                    });

                }

            } finally {

                if (!cancelled) {

                    setCheckingAvailability(false);

                }

            }

        };

        checkAvailability();

        return () => {
            cancelled = true;
        };

    }, [
        costume?.id_kostum,
        formData.tanggal_peminjaman,
        formData.tanggal_kembali,
        jumlahHari
    ]);

    // ======================================================
    // FORMAT RUPIAH
    // ======================================================

    const formatRupiah = (value) => {

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

    // ======================================================
    // SUBMIT
    // ======================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        // ==================================================
        // LOGIN
        // ==================================================

        const storedUser =
            localStorage.getItem("user");

        if (!storedUser) {

            navigate(
                "/login",
                {
                    replace: true
                }
            );

            return;

        }

        let user;

        try {

            user =
                JSON.parse(
                    storedUser
                );

        } catch {

            localStorage.removeItem("user");
            localStorage.removeItem("isLoggedIn");

            navigate(
                "/login",
                {
                    replace: true
                }
            );

            return;

        }

        const idUser =
            user?.id_user ||
            user?.id;

        if (!idUser) {

            setError(
                "Data user tidak valid. Silakan login kembali."
            );

            return;

        }

        // ==================================================
        // VALIDASI KOSTUM
        // ==================================================

        if (!costume) {

            setError(
                "Data kostum belum tersedia."
            );

            return;

        }

        if (!isAvailable) {

            setError(
                "Kostum sedang tidak tersedia."
            );

            return;

        }

        // ==================================================
        // VALIDASI TANGGAL
        // ==================================================

        if (
            !formData.tanggal_peminjaman ||
            !formData.tanggal_kembali
        ) {

            setError(
                "Tanggal peminjaman dan tanggal kembali wajib diisi."
            );

            return;

        }

        if (jumlahHari <= 0) {

            setError(
                "Tanggal kembali harus setelah tanggal peminjaman."
            );

            return;

        }

        // ==================================================
        // VALIDASI HARGA
        // ==================================================

        if (hargaPerHari <= 0) {

            setError(
                "Harga sewa kostum tidak valid."
            );

            return;

        }

        if (totalHarga <= 0) {

            setError(
                "Total harga peminjaman tidak valid."
            );

            return;

        }

        // ==================================================
        // VALIDASI AVAILABILITY
        // ==================================================

        if (
            availability &&
            availability.tersedia === false
        ) {

            setError(
                availability.message ||
                "Kostum tidak tersedia pada tanggal tersebut."
            );

            return;

        }

        // ==================================================
        // VALIDASI BUKTI PEMBAYARAN
        // ==================================================

        const membutuhkanBukti =
            formData.metode_pembayaran === "QRIS" ||
            formData.metode_pembayaran === "Transfer Bank";

        if (
            membutuhkanBukti &&
            !buktiFile
        ) {

            setError(
                "Bukti pembayaran wajib diunggah untuk QRIS atau Transfer Bank."
            );

            return;

        }

        // ==================================================
        // VALIDASI DOKUMEN JAMINAN
        // ==================================================

        if (!jenisDokumen) {

            setError(
                "Jenis dokumen jaminan wajib dipilih."
            );

            return;

        }

        if (!dokumenJaminan) {

            setError(
                "Dokumen jaminan wajib diunggah."
            );

            return;

        }

        // ==================================================
        // MULAI SUBMIT
        // ==================================================

        try {

            setSubmitting(true);

            // ==================================================
            // 1. BUAT PEMINJAMAN
            // ==================================================

            const dataPeminjaman = {

                id_user:
                    Number(idUser),

                disetujui_oleh:
                    null,

                diproses_oleh:
                    null,

                tanggal_peminjaman:
                    formData.tanggal_peminjaman,

                tanggal_kembali:
                    formData.tanggal_kembali,

                total_harga:
                    totalHarga,

                status:
                    "Menunggu"

            };

            const peminjamanResponse =
                await fetch(
                    "/peminjaman",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                dataPeminjaman
                            )
                    }
                );

            let peminjamanResult = {};

            try {

                peminjamanResult =
                    await peminjamanResponse.json();

            } catch {

                peminjamanResult = {};

            }

            if (!peminjamanResponse.ok) {

                throw new Error(
                    peminjamanResult.message ||
                    "Gagal membuat peminjaman."
                );

            }

            const idPeminjaman =
                peminjamanResult.id_peminjaman ||
                peminjamanResult.data
                    ?.id_peminjaman;

            if (!idPeminjaman) {

                throw new Error(
                    "ID peminjaman tidak ditemukan dari backend."
                );

            }

            // ==================================================
            // 2. SIMPAN DETAIL
            // ==================================================

            const dataDetail = {

                id_peminjaman:
                    Number(idPeminjaman),

                id_kostum:
                    Number(
                        costume.id_kostum
                    ),

                jumlah: 1,

                harga:
                    hargaPerHari,

                subtotal:
                    totalHarga

            };

            const detailResponse =
                await fetch(
                    "/detail-peminjaman",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                dataDetail
                            )
                    }
                );

            let detailResult = {};

            try {

                detailResult =
                    await detailResponse.json();

            } catch {

                detailResult = {};

            }

            if (!detailResponse.ok) {

                throw new Error(
                    detailResult.message ||
                    "Peminjaman berhasil dibuat, tetapi detail kostum gagal disimpan."
                );

            }

            // ==================================================
            // 3. SIMPAN PEMBAYARAN
            // ==================================================

            const paymentFormData =
                new FormData();

            paymentFormData.append(
                "id_peminjaman",
                String(idPeminjaman)
            );

            paymentFormData.append(
                "tanggal_bayar",
                new Date().toISOString()
            );

            paymentFormData.append(
                "total",
                String(
                    jumlahPembayaran
                )
            );

            paymentFormData.append(
                "metode",
                formData.metode_pembayaran
            );

            // Customer tidak dapat langsung membuat
            // pembayaran menjadi Lunas.
            paymentFormData.append(
                "status",
                "Belum Bayar"
            );

            if (membutuhkanBukti) {

                paymentFormData.append(
                    "bukti_bayar",
                    buktiFile,
                    buktiFile.name
                );

            }

            const paymentResponse =
                await fetch(
                    "/pembayaran",
                    {
                        method: "POST",
                        body: paymentFormData
                    }
                );

            let paymentResult = {};

            try {

                paymentResult =
                    await paymentResponse.json();

            } catch {

                paymentResult = {};

            }

            if (!paymentResponse.ok) {

                throw new Error(
                    paymentResult.message ||
                    "Peminjaman berhasil dibuat, tetapi pembayaran gagal disimpan."
                );

            }

            // ==================================================
            // 4. SIMPAN DOKUMEN JAMINAN
            // ==================================================

            const dokumenFormData =
                new FormData();

            dokumenFormData.append(
                "id_peminjaman",
                String(idPeminjaman)
            );

            dokumenFormData.append(
                "jenis_dokumen",
                jenisDokumen
            );

            dokumenFormData.append(
                "keterangan",
                `Dokumen jaminan ${jenisDokumen} untuk peminjaman #${idPeminjaman}`
            );

            dokumenFormData.append(
                "dokumen_jaminan",
                dokumenJaminan,
                dokumenJaminan.name
            );

            const dokumenResponse =
                await fetch(
                    "/dokumen-jaminan",
                    {
                        method: "POST",
                        body: dokumenFormData
                    }
                );

            let dokumenResult = {};

            try {

                dokumenResult =
                    await dokumenResponse.json();

            } catch {

                dokumenResult = {};

            }

            if (!dokumenResponse.ok) {

                throw new Error(
                    dokumenResult.message ||
                    "Peminjaman dan pembayaran berhasil, tetapi dokumen jaminan gagal disimpan."
                );

            }

            // ==================================================
            // BERHASIL
            // ==================================================

            setSuccess(
                "Peminjaman, pembayaran, dan dokumen jaminan berhasil diajukan. Pembayaran dan dokumen menunggu verifikasi Petugas."
            );

            const successState = {

                idPeminjaman:
                    idPeminjaman,

                idKostum:
                    costume.id_kostum,

                namaKostum:
                    costume.nama_kostum ||
                    costume.nama_koleksi ||
                    "Kostum",

                tanggalPeminjaman:
                    formData.tanggal_peminjaman,

                tanggalKembali:
                    formData.tanggal_kembali,

                totalHarga:
                    totalHarga,

                jumlahPembayaran:
                    jumlahPembayaran,

                sisaPembayaran:
                    sisaPembayaran,

                persentasePembayaran:
                    persentasePembayaran,

                metodePembayaran:
                    formData.metode_pembayaran,

                jenisDokumen:
                    jenisDokumen

            };

            // ==================================================
            // RESET
            // ==================================================

            setFormData({
                tanggal_peminjaman: "",
                tanggal_kembali: "",
                metode_pembayaran: "QRIS",
                persentase_pembayaran: "50"
            });

            setAvailability(null);

            setBuktiFile(null);
            setBuktiPreview("");

            setJenisDokumen("KTP");

            setDokumenJaminan(null);
            setDokumenPreview("");

            // ==================================================
            // HALAMAN SUKSES
            // ==================================================

            setTimeout(() => {

                navigate(
                    "/borrow-success",
                    {
                        replace: true,
                        state: successState
                    }
                );

            }, 1200);

        } catch (err) {

            console.error(
                "ERROR PEMINJAMAN:",
                err
            );

            setError(
                err.message ||
                "Terjadi kesalahan saat mengajukan peminjaman."
            );

        } finally {

            setSubmitting(false);

        }

    };

    // ======================================================
    // TANGGAL MINIMUM
    // ======================================================

    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {

        return (

            <div className="
                min-h-screen
                bg-[#090909]
                text-white
            ">

                <Navbar />

                <div className="
                    min-h-[70vh]
                    flex
                    items-center
                    justify-center
                ">

                    <div className="text-center">

                        <div className="
                            w-12
                            h-12
                            border-4
                            border-[#D4AF37]/30
                            border-t-[#D4AF37]
                            rounded-full
                            animate-spin
                            mx-auto
                        " />

                        <p className="
                            text-gray-400
                            mt-5
                        ">
                            Memuat data kostum...
                        </p>

                    </div>

                </div>

            </div>

        );

    }

    // ======================================================
    // KOSTUM TIDAK DITEMUKAN
    // ======================================================

    if (!costume) {

        return (

            <div className="
                min-h-screen
                bg-[#090909]
                text-white
            ">

                <Navbar />

                <div className="
                    min-h-[70vh]
                    flex
                    items-center
                    justify-center
                    px-6
                ">

                    <div className="text-center">

                        <h1 className="
                            text-3xl
                            font-bold
                        ">
                            Kostum tidak ditemukan.
                        </h1>

                        <p className="
                            text-gray-400
                            mt-4
                        ">
                            {error ||
                                "Data kostum tidak tersedia."}
                        </p>

                        <Link
                            to="/"
                            className="
                                inline-block
                                mt-6
                                px-6
                                py-3
                                rounded-xl
                                bg-[#D4AF37]
                                text-black
                                font-semibold
                            "
                        >
                            Kembali ke Beranda
                        </Link>

                    </div>

                </div>

            </div>

        );

    }

    // ======================================================
    // RENDER
    // ======================================================

    return (

        <div className="
            min-h-screen
            bg-[#090909]
            text-white
        ">

            <Navbar />

            <main className="
                pt-32
                pb-20
                px-6
            ">

                <div className="
                    max-w-6xl
                    mx-auto
                ">

                    {/* HEADER */}

                    <div className="mb-10">

                        <Link
                            to={`/costume/${costume.id_kostum}`}
                            className="
                                inline-block
                                text-gray-400
                                hover:text-[#D4AF37]
                                transition
                                mb-6
                            "
                        >
                            ← Kembali ke Detail Kostum
                        </Link>

                        <p className="
                            uppercase
                            tracking-[5px]
                            text-[#D4AF37]
                            text-sm
                        ">
                            Handu Atelier
                        </p>

                        <h1 className="
                            text-4xl
                            md:text-5xl
                            font-bold
                            mt-4
                        ">
                            Form Peminjaman
                        </h1>

                        <p className="
                            text-gray-400
                            mt-4
                        ">
                            Lengkapi data peminjaman kostum
                            yang ingin Anda sewa.
                        </p>

                    </div>

                    <div className="
                        grid
                        lg:grid-cols-2
                        gap-8
                        items-start
                    ">

                        {/* ==================================================
                            INFORMASI KOSTUM
                        ================================================== */}

                        <div className="
                            bg-[#141414]
                            border
                            border-[#D4AF37]/20
                            rounded-3xl
                            p-7
                        ">

                            <p className="
                                text-[#D4AF37]
                                text-sm
                                uppercase
                                tracking-widest
                            ">
                                Kostum yang dipilih
                            </p>

                            <h2 className="
                                text-3xl
                                font-bold
                                mt-3
                            ">
                                {costume.nama_koleksi ||
                                    costume.nama_kostum ||
                                    "Kostum"}
                            </h2>

                            <p className="
                                text-gray-400
                                mt-2
                            ">
                                {costume.nama_kostum ||
                                    costume.nama_kategori ||
                                    "-"}
                            </p>

                            <div className="
                                mt-8
                                space-y-5
                            ">

                                <div className="
                                    flex
                                    justify-between
                                    gap-4
                                ">
                                    <span className="text-gray-400">
                                        ID Kostum
                                    </span>

                                    <span>
                                        {costume.id_kostum}
                                    </span>
                                </div>

                                {costume.kode_kostum && (

                                    <div className="
                                        flex
                                        justify-between
                                        gap-4
                                    ">

                                        <span className="text-gray-400">
                                            Kode Kostum
                                        </span>

                                        <span className="text-[#D4AF37]">
                                            {costume.kode_kostum}
                                        </span>

                                    </div>

                                )}

                                {costume.kode_koleksi && (

                                    <div className="
                                        flex
                                        justify-between
                                        gap-4
                                    ">

                                        <span className="text-gray-400">
                                            Kode Koleksi
                                        </span>

                                        <span className="text-[#D4AF37]">
                                            {costume.kode_koleksi}
                                        </span>

                                    </div>

                                )}

                                <div className="
                                    flex
                                    justify-between
                                    gap-4
                                ">

                                    <span className="text-gray-400">
                                        Warna
                                    </span>

                                    <span>
                                        {costume.warna || "-"}
                                    </span>

                                </div>

                                <div className="
                                    flex
                                    justify-between
                                    gap-4
                                ">

                                    <span className="text-gray-400">
                                        Ukuran
                                    </span>

                                    <span>
                                        {costume.ukuran || "-"}
                                    </span>

                                </div>

                                <div className="
                                    flex
                                    justify-between
                                    gap-4
                                ">

                                    <span className="text-gray-400">
                                        Stok Fisik
                                    </span>

                                    <span>
                                        {costume.stok ?? 0}
                                    </span>

                                </div>

                                <div className="
                                    flex
                                    justify-between
                                    gap-4
                                ">

                                    <span className="text-gray-400">
                                        Status
                                    </span>

                                    <span className={
                                        isAvailable
                                            ? "text-green-400"
                                            : "text-red-400"
                                    }>
                                        {isAvailable
                                            ? "Tersedia"
                                            : "Tidak tersedia"}
                                    </span>

                                </div>

                            </div>

                            <div className="
                                mt-8
                                pt-6
                                border-t
                                border-[#D4AF37]/20
                            ">

                                <p className="text-gray-400">
                                    Harga sewa per hari
                                </p>

                                <p className="
                                    text-3xl
                                    font-bold
                                    text-[#D4AF37]
                                    mt-2
                                ">
                                    {formatRupiah(
                                        hargaPerHari
                                    )}
                                </p>

                            </div>

                        </div>

                        {/* ==================================================
                            FORM
                        ================================================== */}

                        <form
                            onSubmit={handleSubmit}
                            className="
                                bg-[#141414]
                                border
                                border-[#D4AF37]/20
                                rounded-3xl
                                p-7
                            "
                        >

                            <h2 className="
                                text-2xl
                                font-bold
                                mb-7
                            ">
                                Detail Peminjaman
                            </h2>

                            {/* TANGGAL PEMINJAMAN */}

                            <div className="mb-6">

                                <label
                                    htmlFor="tanggal_peminjaman"
                                    className="
                                        block
                                        text-gray-300
                                        mb-2
                                    "
                                >
                                    Tanggal Peminjaman
                                </label>

                                <input
                                    id="tanggal_peminjaman"
                                    type="date"
                                    name="tanggal_peminjaman"
                                    value={
                                        formData.tanggal_peminjaman
                                    }
                                    onChange={handleChange}
                                    min={today}
                                    required
                                    className="
                                        w-full
                                        bg-[#0D0D0D]
                                        border
                                        border-[#D4AF37]/20
                                        rounded-xl
                                        px-4
                                        py-3
                                        text-white
                                        outline-none
                                        focus:border-[#D4AF37]
                                    "
                                />

                            </div>

                            {/* TANGGAL KEMBALI */}

                            <div className="mb-6">

                                <label
                                    htmlFor="tanggal_kembali"
                                    className="
                                        block
                                        text-gray-300
                                        mb-2
                                    "
                                >
                                    Tanggal Kembali
                                </label>

                                <input
                                    id="tanggal_kembali"
                                    type="date"
                                    name="tanggal_kembali"
                                    value={
                                        formData.tanggal_kembali
                                    }
                                    onChange={handleChange}
                                    min={
                                        formData.tanggal_peminjaman ||
                                        today
                                    }
                                    required
                                    className="
                                        w-full
                                        bg-[#0D0D0D]
                                        border
                                        border-[#D4AF37]/20
                                        rounded-xl
                                        px-4
                                        py-3
                                        text-white
                                        outline-none
                                        focus:border-[#D4AF37]
                                    "
                                />

                            </div>

                            {/* AVAILABILITY */}

                            {hasCompleteDates && (

                                <div className={`
                                    mb-6
                                    p-4
                                    rounded-xl
                                    border
                                    ${
                                        checkingAvailability
                                            ? "border-blue-500/20 bg-blue-950/20"
                                            : availability?.tersedia === true
                                                ? "border-green-500/20 bg-green-950/20"
                                                : availability?.tersedia === false
                                                    ? "border-red-500/20 bg-red-950/20"
                                                    : "border-white/10 bg-black/20"
                                    }
                                `}>

                                    {checkingAvailability ? (

                                        <p className="
                                            text-blue-300
                                            text-sm
                                        ">
                                            Mengecek ketersediaan kostum
                                            pada tanggal tersebut...
                                        </p>

                                    ) : availability?.tersedia === true ? (

                                        <div>

                                            <p className="
                                                text-green-400
                                                font-semibold
                                            ">
                                                Kostum tersedia
                                            </p>

                                            {availability.stok_tersedia !== undefined && (

                                                <p className="
                                                    text-gray-400
                                                    text-sm
                                                    mt-1
                                                ">
                                                    Stok tersedia:{" "}
                                                    {
                                                        availability.stok_tersedia
                                                    }
                                                </p>

                                            )}

                                        </div>

                                    ) : availability?.tersedia === false ? (

                                        <p className="
                                            text-red-400
                                            text-sm
                                        ">
                                            {availability.message ||
                                                "Kostum tidak tersedia pada tanggal tersebut."}
                                        </p>

                                    ) : (

                                        <p className="
                                            text-gray-400
                                            text-sm
                                        ">
                                            Ketersediaan belum diperiksa.
                                        </p>

                                    )}

                                </div>

                            )}

                            {/* RINGKASAN SEWA */}

                            <div className="
                                p-5
                                rounded-2xl
                                bg-[#0D0D0D]
                                border
                                border-[#D4AF37]/20
                            ">

                                <div className="
                                    flex
                                    justify-between
                                ">

                                    <span className="text-gray-400">
                                        Harga per hari
                                    </span>

                                    <span>
                                        {formatRupiah(
                                            hargaPerHari
                                        )}
                                    </span>

                                </div>

                                <div className="
                                    flex
                                    justify-between
                                    mt-3
                                ">

                                    <span className="text-gray-400">
                                        Durasi
                                    </span>

                                    <span>
                                        {jumlahHari > 0
                                            ? `${jumlahHari} hari`
                                            : "-"}
                                    </span>

                                </div>

                                <div className="
                                    flex
                                    justify-between
                                    mt-3
                                ">

                                    <span className="text-gray-400">
                                        Jumlah Kostum
                                    </span>

                                    <span>
                                        1 kostum
                                    </span>

                                </div>

                                <div className="
                                    flex
                                    justify-between
                                    mt-3
                                    pt-3
                                    border-t
                                    border-white/10
                                ">

                                    <span className="text-gray-400">
                                        Total
                                    </span>

                                    <span className="
                                        text-xl
                                        font-bold
                                        text-[#D4AF37]
                                    ">
                                        {formatRupiah(
                                            totalHarga
                                        )}
                                    </span>

                                </div>

                            </div>

                            {/* ==================================================
                                PEMBAYARAN
                            ================================================== */}

                            <div className="
                                mt-6
                                p-5
                                rounded-2xl
                                bg-[#0D0D0D]
                                border
                                border-[#D4AF37]/20
                            ">

                                <div className="mb-5">

                                    <p className="
                                        text-lg
                                        font-semibold
                                    ">
                                        Pembayaran
                                    </p>

                                    <p className="
                                        text-sm
                                        text-gray-500
                                        mt-1
                                    ">
                                        Pilih metode dan jumlah pembayaran.
                                    </p>

                                </div>

                                {/* METODE */}

                                <div className="mb-6">

                                    <p className="
                                        text-sm
                                        text-gray-300
                                        mb-3
                                    ">
                                        Metode Pembayaran
                                    </p>

                                    <div className="
                                        grid
                                        grid-cols-1
                                        gap-3
                                    ">

                                        {[
                                            {
                                                value: "QRIS",
                                                description:
                                                    "Pembayaran melalui QRIS."
                                            },
                                            {
                                                value: "Transfer Bank",
                                                description:
                                                    "Pembayaran melalui rekening bank."
                                            },
                                            {
                                                value: "Cash",
                                                description:
                                                    "Pembayaran langsung kepada Petugas."
                                            }
                                        ].map((method) => (

                                            <label
                                                key={method.value}
                                                className={`
                                                    flex
                                                    items-center
                                                    gap-3
                                                    p-4
                                                    rounded-xl
                                                    border
                                                    cursor-pointer
                                                    transition
                                                    ${
                                                        formData.metode_pembayaran ===
                                                        method.value
                                                            ? "border-[#D4AF37] bg-[#D4AF37]/10"
                                                            : "border-white/10 bg-black/20"
                                                    }
                                                `}
                                            >

                                                <input
                                                    type="radio"
                                                    name="metode_pembayaran"
                                                    value={method.value}
                                                    checked={
                                                        formData.metode_pembayaran ===
                                                        method.value
                                                    }
                                                    onChange={handleChange}
                                                    className="
                                                        accent-[#D4AF37]
                                                    "
                                                />

                                                <div>

                                                    <p className="font-medium">
                                                        {method.value}
                                                    </p>

                                                    <p className="
                                                        text-xs
                                                        text-gray-500
                                                        mt-1
                                                    ">
                                                        {method.description}
                                                    </p>

                                                </div>

                                            </label>

                                        ))}

                                    </div>

                                </div>

                                {/* JUMLAH */}

                                <div>

                                    <p className="
                                        text-sm
                                        text-gray-300
                                        mb-3
                                    ">
                                        Jumlah Pembayaran
                                    </p>

                                    <div className="
                                        grid
                                        grid-cols-2
                                        gap-3
                                    ">

                                        <label className={`
                                            flex
                                            items-center
                                            gap-3
                                            p-4
                                            rounded-xl
                                            border
                                            cursor-pointer
                                            ${
                                                formData.persentase_pembayaran === "50"
                                                    ? "border-[#D4AF37] bg-[#D4AF37]/10"
                                                    : "border-white/10 bg-black/20"
                                            }
                                        `}>

                                            <input
                                                type="radio"
                                                name="persentase_pembayaran"
                                                value="50"
                                                checked={
                                                    formData.persentase_pembayaran === "50"
                                                }
                                                onChange={handleChange}
                                                className="accent-[#D4AF37]"
                                            />

                                            <div>

                                                <p className="font-medium">
                                                    DP 50%
                                                </p>

                                                <p className="
                                                    text-xs
                                                    text-gray-500
                                                    mt-1
                                                ">
                                                    Bayar setengah dari total.
                                                </p>

                                            </div>

                                        </label>

                                        <label className={`
                                            flex
                                            items-center
                                            gap-3
                                            p-4
                                            rounded-xl
                                            border
                                            cursor-pointer
                                            ${
                                                formData.persentase_pembayaran === "100"
                                                    ? "border-[#D4AF37] bg-[#D4AF37]/10"
                                                    : "border-white/10 bg-black/20"
                                            }
                                        `}>

                                            <input
                                                type="radio"
                                                name="persentase_pembayaran"
                                                value="100"
                                                checked={
                                                    formData.persentase_pembayaran === "100"
                                                }
                                                onChange={handleChange}
                                                className="accent-[#D4AF37]"
                                            />

                                            <div>

                                                <p className="font-medium">
                                                    Bayar 100%
                                                </p>

                                                <p className="
                                                    text-xs
                                                    text-gray-500
                                                    mt-1
                                                ">
                                                    Bayar seluruh total.
                                                </p>

                                            </div>

                                        </label>

                                    </div>

                                    {/* RINGKASAN PEMBAYARAN */}

                                    <div className="
                                        mt-5
                                        p-4
                                        rounded-xl
                                        border
                                        border-white/10
                                        bg-black/20
                                    ">

                                        <div className="
                                            flex
                                            justify-between
                                        ">

                                            <span className="text-gray-400">
                                                Total Peminjaman
                                            </span>

                                            <span>
                                                {formatRupiah(
                                                    totalHarga
                                                )}
                                            </span>

                                        </div>

                                        <div className="
                                            flex
                                            justify-between
                                            mt-3
                                        ">

                                            <span className="text-gray-400">
                                                Dibayar Sekarang
                                            </span>

                                            <span className="
                                                text-[#D4AF37]
                                                font-semibold
                                            ">
                                                {formatRupiah(
                                                    jumlahPembayaran
                                                )}
                                            </span>

                                        </div>

                                        <div className="
                                            flex
                                            justify-between
                                            mt-3
                                            pt-3
                                            border-t
                                            border-white/10
                                        ">

                                            <span className="text-gray-400">
                                                Sisa Pembayaran
                                            </span>

                                            <span className="font-semibold">
                                                {formatRupiah(
                                                    sisaPembayaran
                                                )}
                                            </span>

                                        </div>

                                    </div>

                                    <div className="
                                        mt-4
                                        p-4
                                        rounded-xl
                                        bg-yellow-950/20
                                        border
                                        border-yellow-500/20
                                    ">

                                        <p className="
                                            text-xs
                                            text-yellow-300/80
                                            leading-relaxed
                                        ">
                                            Pembayaran akan dicatat sebagai{" "}
                                            <strong>
                                                "Belum Bayar"
                                            </strong>
                                            . Setelah bukti pembayaran diperiksa,
                                            Petugas akan mengubah status menjadi{" "}
                                            <strong>
                                                "Lunas"
                                            </strong>
                                            .
                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* ==================================================
                                BUKTI PEMBAYARAN
                            ================================================== */}

                            {(
                                formData.metode_pembayaran === "QRIS" ||
                                formData.metode_pembayaran === "Transfer Bank"
                            ) && (

                                <div className="mt-6">

                                    <label
                                        htmlFor="bukti_bayar"
                                        className="
                                            block
                                            text-gray-300
                                            mb-2
                                        "
                                    >
                                        Bukti Pembayaran

                                        <span className="
                                            text-red-400
                                            ml-1
                                        ">
                                            *
                                        </span>

                                    </label>

                                    <input
                                        id="bukti_bayar"
                                        name="bukti_bayar"
                                        type="file"
                                        accept="
                                            image/jpeg,
                                            image/png,
                                            image/webp,
                                            application/pdf
                                        "
                                        onChange={handleBuktiChange}
                                        className="
                                            w-full
                                            bg-[#0D0D0D]
                                            border
                                            border-[#D4AF37]/20
                                            rounded-xl
                                            px-4
                                            py-3
                                            text-gray-300

                                            file:mr-4
                                            file:rounded-lg
                                            file:border-0
                                            file:px-4
                                            file:py-2
                                            file:bg-[#D4AF37]
                                            file:text-black
                                            file:font-semibold
                                        "
                                    />

                                    <p className="
                                        text-gray-500
                                        text-xs
                                        mt-2
                                    ">
                                        JPG, PNG, WEBP, atau PDF.
                                        Maksimal 5 MB.
                                    </p>

                                    {buktiPreview && (

                                        <div className="mt-5">

                                            <p className="
                                                text-gray-400
                                                text-sm
                                                mb-3
                                            ">
                                                Preview Bukti Pembayaran
                                            </p>

                                            <div className="
                                                rounded-xl
                                                overflow-hidden
                                                border
                                                border-[#D4AF37]/20
                                                bg-[#0D0D0D]
                                            ">

                                                <img
                                                    src={buktiPreview}
                                                    alt="Preview bukti pembayaran"
                                                    className="
                                                        w-full
                                                        max-h-72
                                                        object-contain
                                                    "
                                                />

                                            </div>

                                        </div>

                                    )}

                                    {buktiFile && (

                                        <p className="
                                            text-gray-500
                                            text-xs
                                            mt-3
                                        ">
                                            File:{" "}
                                            <span className="text-gray-300">
                                                {buktiFile.name}
                                            </span>
                                        </p>

                                    )}

                                </div>

                            )}

                            {/* CASH */}

                            {formData.metode_pembayaran === "Cash" && (

                                <div className="
                                    mt-6
                                    p-4
                                    rounded-xl
                                    bg-blue-950/20
                                    border
                                    border-blue-500/20
                                ">

                                    <p className="
                                        text-sm
                                        text-blue-300
                                    ">
                                        Pembayaran Cash dilakukan
                                        secara langsung kepada Petugas.
                                        Status pembayaran tetap
                                        menunggu verifikasi Petugas.
                                    </p>

                                </div>

                            )}

                            {/* ==================================================
                                DOKUMEN JAMINAN
                            ================================================== */}

                            <div className="
                                mt-6
                                p-5
                                rounded-2xl
                                bg-[#0D0D0D]
                                border-2
                                border-[#D4AF37]/40
                            ">

                                <div className="mb-5">

                                    <p className="
                                        text-xl
                                        font-semibold
                                        text-[#D4AF37]
                                    ">
                                        Dokumen Jaminan
                                        <span className="
                                            text-red-400
                                            ml-1
                                        ">
                                            *
                                        </span>
                                    </p>

                                    <p className="
                                        text-sm
                                        text-gray-400
                                        mt-1
                                    ">
                                        Wajib mengunggah dokumen identitas
                                        sebagai jaminan peminjaman.
                                    </p>

                                </div>

                                {/* JENIS DOKUMEN */}

                                <div className="mb-5">

                                    <label
                                        htmlFor="jenis_dokumen"
                                        className="
                                            block
                                            text-sm
                                            text-gray-300
                                            mb-2
                                        "
                                    >
                                        Jenis Dokumen
                                    </label>

                                    <select
                                        id="jenis_dokumen"
                                        name="jenis_dokumen"
                                        value={jenisDokumen}
                                        onChange={(e) => {

                                            setJenisDokumen(
                                                e.target.value
                                            );

                                            setError("");
                                            setSuccess("");

                                        }}
                                        className="
                                            w-full
                                            bg-[#0D0D0D]
                                            border
                                            border-[#D4AF37]/30
                                            rounded-xl
                                            px-4
                                            py-3
                                            text-white
                                            outline-none
                                            focus:border-[#D4AF37]
                                        "
                                    >

                                        <option
                                            value="KTP"
                                            className="bg-[#141414]"
                                        >
                                            KTP
                                        </option>

                                        <option
                                            value="Kartu Keluarga"
                                            className="bg-[#141414]"
                                        >
                                            Kartu Keluarga
                                        </option>

                                    </select>

                                </div>

                                {/* FILE DOKUMEN */}

                                <div>

                                    <label
                                        htmlFor="dokumen_jaminan"
                                        className="
                                            block
                                            text-sm
                                            text-gray-300
                                            mb-2
                                        "
                                    >
                                        File Dokumen Jaminan

                                        <span className="
                                            text-red-400
                                            ml-1
                                        ">
                                            *
                                        </span>

                                    </label>

                                    <input
                                        id="dokumen_jaminan"
                                        name="dokumen_jaminan"
                                        type="file"
                                        accept="
                                            image/jpeg,
                                            image/png,
                                            image/webp
                                        "
                                        onChange={handleDokumenChange}
                                        required
                                        className="
                                            w-full
                                            bg-[#0D0D0D]
                                            border
                                            border-[#D4AF37]/30
                                            rounded-xl
                                            px-4
                                            py-3
                                            text-gray-300

                                            file:mr-4
                                            file:rounded-lg
                                            file:border-0
                                            file:px-4
                                            file:py-2
                                            file:bg-[#D4AF37]
                                            file:text-black
                                            file:font-semibold
                                        "
                                    />

                                    <p className="
                                        text-gray-500
                                        text-xs
                                        mt-2
                                    ">
                                        Format yang diperbolehkan:
                                        JPG, PNG, atau WEBP.
                                        Maksimal 5 MB.
                                    </p>

                                    {/* PREVIEW DOKUMEN */}

                                    {dokumenPreview && (

                                        <div className="mt-5">

                                            <p className="
                                                text-gray-400
                                                text-sm
                                                mb-3
                                            ">
                                                Preview Dokumen Jaminan
                                            </p>

                                            <div className="
                                                rounded-xl
                                                overflow-hidden
                                                border
                                                border-[#D4AF37]/30
                                                bg-[#0D0D0D]
                                            ">

                                                <img
                                                    src={dokumenPreview}
                                                    alt="Preview dokumen jaminan"
                                                    className="
                                                        w-full
                                                        max-h-72
                                                        object-contain
                                                    "
                                                />

                                            </div>

                                        </div>

                                    )}

                                    {/* NAMA FILE */}

                                    {dokumenJaminan && (

                                        <div className="
                                            mt-3
                                            p-3
                                            rounded-xl
                                            bg-[#D4AF37]/5
                                            border
                                            border-[#D4AF37]/20
                                        ">

                                            <p className="
                                                text-xs
                                                text-gray-500
                                            ">
                                                File terpilih:
                                            </p>

                                            <p className="
                                                text-sm
                                                text-[#D4AF37]
                                                mt-1
                                                break-all
                                            ">
                                                {dokumenJaminan.name}
                                            </p>

                                        </div>

                                    )}

                                </div>

                                <div className="
                                    mt-5
                                    p-4
                                    rounded-xl
                                    bg-yellow-950/20
                                    border
                                    border-yellow-500/20
                                ">

                                    <p className="
                                        text-xs
                                        text-yellow-300/80
                                        leading-relaxed
                                    ">
                                        Dokumen jaminan akan diperiksa
                                        oleh Petugas. Pastikan foto
                                        dokumen terlihat jelas dan seluruh
                                        informasi dapat dibaca.
                                    </p>

                                </div>

                            </div>

                            {/* ERROR */}

                            {error && (

                                <div className="
                                    mt-6
                                    p-4
                                    rounded-xl
                                    bg-red-950/30
                                    border
                                    border-red-500/30
                                    text-red-400
                                    text-sm
                                ">
                                    {error}
                                </div>

                            )}

                            {/* SUCCESS */}

                            {success && (

                                <div className="
                                    mt-6
                                    p-4
                                    rounded-xl
                                    bg-green-950/30
                                    border
                                    border-green-500/30
                                    text-green-400
                                    text-sm
                                ">
                                    {success}
                                </div>

                            )}

                            {/* SUBMIT */}

                            <button
                                type="submit"
                                disabled={
                                    submitting ||
                                    checkingAvailability ||
                                    !isAvailable ||
                                    !costume ||
                                    hargaPerHari <= 0 ||
                                    totalHarga <= 0 ||
                                    !dokumenJaminan ||
                                    (
                                        hasCompleteDates &&
                                        availability &&
                                        availability.tersedia === false
                                    ) ||
                                    (
                                        (
                                            formData.metode_pembayaran === "QRIS" ||
                                            formData.metode_pembayaran === "Transfer Bank"
                                        ) &&
                                        !buktiFile
                                    )
                                }
                                className="
                                    w-full
                                    mt-8
                                    py-4
                                    rounded-xl
                                    bg-[#D4AF37]
                                    text-black
                                    font-semibold
                                    hover:scale-[1.02]
                                    transition-all
                                    duration-300
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                    disabled:hover:scale-100
                                "
                            >

                                {checkingAvailability
                                    ? "Mengecek Ketersediaan..."
                                    : submitting
                                        ? "Mengirim..."
                                        : "Ajukan Peminjaman"}

                            </button>

                        </form>

                    </div>

                </div>

            </main>

        </div>

    );

}

export default BorrowForm;