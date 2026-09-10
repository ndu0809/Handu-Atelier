import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    FaArrowLeft,
    FaPaperPlane,
    FaComments,
    FaUser
} from "react-icons/fa";

import {
    getCustomerChat,
    getPetugasChats,
    getPetugasChatDetail,
    sendChatMessage,
    markChatAsRead
} from "../../services/chatService";

import {
    createChatSocket
} from "../../services/socket";

import {
    useNavigate
} from "react-router-dom";


// ======================================================
// HELPER USER
// ======================================================

const getCurrentUser = () => {

    const possibleKeys = [
        "user",
        "currentUser",
        "userData",
        "users"
    ];

    for (const key of possibleKeys) {

        try {

            const raw =
                localStorage.getItem(key);

            if (!raw) {
                continue;
            }

            const parsed =
                JSON.parse(raw);

            if (
                parsed &&
                (
                    parsed.id_user ||
                    parsed.id
                )
            ) {
                return parsed;
            }

        } catch {
            // lanjut mencari
        }

    }

    const id_user =
        localStorage.getItem(
            "id_user"
        );

    if (id_user) {

        return {
            id_user: Number(id_user)
        };

    }

    return null;
};


// ======================================================
// FORMAT WAKTU
// ======================================================

const formatTime = (value) => {

    if (!value) {
        return "";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "";
    }

    return date.toLocaleTimeString(
        "id-ID",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );
};


// ======================================================
// FORMAT TANGGAL
// ======================================================

const formatDate = (value) => {

    if (!value) {
        return "";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "";
    }

    return date.toLocaleDateString(
        "id-ID",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
};


// ======================================================
// COMPONENT
// ======================================================

function ChatPage({
    mode = "customer"
}) {

    const navigate =
        useNavigate();


    // ==================================================
    // USER
    // ==================================================

    const currentUser =
        getCurrentUser();

    const id_user =
        Number(
            currentUser?.id_user ??
            currentUser?.id
        );

    const isPetugas =
        mode === "petugas";


    // ==================================================
    // STATE
    // ==================================================

    const [
        conversation,
        setConversation
    ] = useState(null);

    const [
        messages,
        setMessages
    ] = useState([]);

    const [
        chats,
        setChats
    ] = useState([]);

    const [
        selectedConversation,
        setSelectedConversation
    ] = useState(null);

    const [
        message,
        setMessage
    ] = useState("");

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        sending,
        setSending
    ] = useState(false);

    const [
        error,
        setError
    ] = useState("");


    // ==================================================
    // REFS
    // ==================================================

    const socketRef =
        useRef(null);

    const bottomRef =
        useRef(null);


    // ==================================================
    // SCROLL KE PESAN TERAKHIR
    // ==================================================

    const scrollToBottom = () => {

        setTimeout(() => {

            bottomRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end"
            });

        }, 50);

    };


    // ==================================================
    // LOAD CUSTOMER CHAT
    // ==================================================

    const loadCustomerChat = async () => {

        if (!id_user) {

            setError(
                "Data pengguna tidak ditemukan."
            );

            setLoading(false);

            return;
        }

        try {

            setLoading(true);

            setError("");

            const result =
                await getCustomerChat(
                    id_user
                );

            setConversation(
                result?.conversation ||
                null
            );

            setMessages(
                Array.isArray(
                    result?.messages
                )
                    ? result.messages
                    : []
            );

        } catch (err) {

            console.error(
                "GET CUSTOMER CHAT ERROR:",
                err
            );

            setError(
                err?.message ||
                "Gagal memuat chat."
            );

        } finally {

            setLoading(false);

        }

    };


    // ==================================================
    // LOAD PETUGAS CHAT LIST
    // ==================================================

    const loadPetugasChats = async (
        showLoading = true
    ) => {

        if (!id_user) {

            setError(
                "Data petugas tidak ditemukan."
            );

            setLoading(false);

            return;
        }

        try {

            if (showLoading) {
                setLoading(true);
            }

            setError("");

            const result =
                await getPetugasChats(
                    id_user
                );

            setChats(
                Array.isArray(
                    result?.data
                )
                    ? result.data
                    : []
            );

        } catch (err) {

            console.error(
                "GET PETUGAS CHATS ERROR:",
                err
            );

            setError(
                err?.message ||
                "Gagal memuat daftar chat."
            );

        } finally {

            if (showLoading) {
                setLoading(false);
            }

        }

    };


    // ==================================================
    // LOAD PETUGAS DETAIL
    // ==================================================

    const loadPetugasDetail = async (
        id_percakapan
    ) => {

        if (
            !id_user ||
            !id_percakapan
        ) {
            return;
        }

        try {

            setError("");

            const result =
                await getPetugasChatDetail(
                    id_user,
                    id_percakapan
                );

            const newConversation =
                result?.conversation ||
                null;

            const newMessages =
                Array.isArray(
                    result?.messages
                )
                    ? result.messages
                    : [];

            setConversation(
                newConversation
            );

            setMessages(
                newMessages
            );

            setSelectedConversation(
                Number(id_percakapan)
            );

            await markChatAsRead(
                id_user,
                id_percakapan
            );

            setChats(previous => {

                return previous.map(
                    item => {

                        if (
                            Number(
                                item.id_percakapan
                            ) ===
                            Number(
                                id_percakapan
                            )
                        ) {

                            return {
                                ...item,
                                unread_count: 0
                            };

                        }

                        return item;

                    }
                );

            });

            scrollToBottom();

        } catch (err) {

            console.error(
                "GET PETUGAS CHAT DETAIL ERROR:",
                err
            );

            setError(
                err?.message ||
                "Gagal memuat percakapan."
            );

        }

    };


    // ==================================================
    // INITIAL LOAD
    // ==================================================

    useEffect(() => {

        if (!id_user) {

            setLoading(false);

            return;
        }

        if (isPetugas) {

            loadPetugasChats();

        } else {

            loadCustomerChat();

        }

    }, [
        id_user,
        isPetugas
    ]);


    // ==================================================
    // SOCKET.IO
    // ==================================================

    useEffect(() => {

        if (!id_user) {
            return;
        }

        const socket =
            createChatSocket();

        socketRef.current =
            socket;


        // ==============================================
        // CONNECT
        // ==============================================

        socket.on(
            "connect",
            () => {

                console.log(
                    "Chat socket connected:",
                    socket.id
                );

                if (
                    conversation?.id_percakapan
                ) {

                    socket.emit(
                        "join_conversation",
                        conversation.id_percakapan
                    );

                }

            }
        );


        // ==============================================
        // CONNECT ERROR
        // ==============================================

        socket.on(
            "connect_error",
            (err) => {

                console.error(
                    "Chat socket connection error:",
                    err?.message ||
                    err
                );

            }
        );


        // ==============================================
        // NEW MESSAGE
        // ==============================================

        socket.on(
            "new_message",
            (newMessage) => {

                if (
                    !newMessage ||
                    !newMessage.id_percakapan
                ) {
                    return;
                }


                const incomingConversation =
                    Number(
                        newMessage.id_percakapan
                    );


                // ==========================================
                // CUSTOMER
                // ==========================================

                if (!isPetugas) {

                    if (
                        conversation?.id_percakapan &&
                        incomingConversation !==
                            Number(
                                conversation.id_percakapan
                            )
                    ) {
                        return;
                    }

                    setMessages(
                        previous => {

                            const exists =
                                previous.some(
                                    item =>
                                        Number(
                                            item.id_pesan
                                        ) ===
                                        Number(
                                            newMessage.id_pesan
                                        )
                                );

                            if (exists) {
                                return previous;
                            }

                            return [
                                ...previous,
                                newMessage
                            ];

                        }
                    );

                    scrollToBottom();

                    return;
                }


                // ==========================================
                // PETUGAS
                // ==========================================

                setChats(
                    previous => {

                        const conversationExists =
                            previous.some(
                                item =>
                                    Number(
                                        item.id_percakapan
                                    ) ===
                                    incomingConversation
                            );


                        if (
                            !conversationExists
                        ) {

                            loadPetugasChats(
                                false
                            );

                            return previous;

                        }


                        return previous.map(
                            item => {

                                if (
                                    Number(
                                        item.id_percakapan
                                    ) !==
                                    incomingConversation
                                ) {
                                    return item;
                                }


                                const isCurrent =
                                    Number(
                                        selectedConversation
                                    ) ===
                                    incomingConversation;


                                return {
                                    ...item,

                                    pesan_terakhir:
                                        newMessage.pesan,

                                    waktu_terakhir:
                                        newMessage.created_at,

                                    unread_count:
                                        isCurrent
                                            ? 0
                                            : Number(
                                                item.unread_count || 0
                                            ) + 1
                                };

                            }
                        );

                    }
                );


                // ==========================================
                // UPDATE CURRENT CHAT
                // ==========================================

                if (
                    conversation?.id_percakapan &&
                    Number(
                        conversation.id_percakapan
                    ) ===
                    incomingConversation
                ) {

                    setMessages(
                        previous => {

                            const exists =
                                previous.some(
                                    item =>
                                        Number(
                                            item.id_pesan
                                        ) ===
                                        Number(
                                            newMessage.id_pesan
                                        )
                                );

                            if (exists) {
                                return previous;
                            }

                            return [
                                ...previous,
                                newMessage
                            ];

                        }
                    );

                    markChatAsRead(
                        id_user,
                        incomingConversation
                    );

                    scrollToBottom();

                }

            }
        );


        // ==============================================
        // CLEANUP
        // ==============================================

        return () => {

            socket.disconnect();

            socketRef.current =
                null;

        };

    }, [
        id_user,
        isPetugas,
        conversation?.id_percakapan,
        selectedConversation
    ]);


    // ==================================================
    // JOIN CONVERSATION
    // ==================================================

    useEffect(() => {

        const socket =
            socketRef.current;

        if (
            !socket ||
            !conversation?.id_percakapan
        ) {
            return;
        }


        const idPercakapan =
            Number(
                conversation.id_percakapan
            );


        if (
            socket.connected
        ) {

            socket.emit(
                "join_conversation",
                idPercakapan
            );

        }


        const handleConnect = () => {

            socket.emit(
                "join_conversation",
                idPercakapan
            );

        };


        socket.on(
            "connect",
            handleConnect
        );


        return () => {

            socket.emit(
                "leave_conversation",
                idPercakapan
            );

            socket.off(
                "connect",
                handleConnect
            );

        };

    }, [
        conversation?.id_percakapan
    ]);


    // ==================================================
    // SEND MESSAGE
    // ==================================================

    const handleSend = async (
        event
    ) => {

        event?.preventDefault();


        const text =
            message.trim();


        if (
            !text ||
            sending
        ) {
            return;
        }


        if (!id_user) {

            setError(
                "User tidak ditemukan."
            );

            return;
        }


        if (
            !conversation?.id_percakapan
        ) {

            setError(
                "Percakapan belum tersedia."
            );

            return;
        }


        try {

            setSending(true);

            setError("");


            const result =
                await sendChatMessage(
                    id_user,
                    conversation.id_percakapan,
                    text
                );


            const sentMessage =
                result?.data;


            if (
                sentMessage
            ) {

                setMessages(
                    previous => {

                        const exists =
                            previous.some(
                                item =>
                                    Number(
                                        item.id_pesan
                                    ) ===
                                    Number(
                                        sentMessage.id_pesan
                                    )
                            );


                        if (exists) {
                            return previous;
                        }


                        return [
                            ...previous,
                            sentMessage
                        ];

                    }
                );

            }


            setMessage("");

            scrollToBottom();


            // ==========================================
            // PETUGAS - UPDATE LIST
            // ==========================================

            if (
                isPetugas
            ) {

                setChats(
                    previous => {

                        return previous.map(
                            item => {

                                if (
                                    Number(
                                        item.id_percakapan
                                    ) ===
                                    Number(
                                        conversation.id_percakapan
                                    )
                                ) {

                                    return {
                                        ...item,

                                        pesan_terakhir:
                                            text,

                                        waktu_terakhir:
                                            new Date().toISOString(),

                                        unread_count:
                                            0
                                    };

                                }

                                return item;

                            }
                        );

                    }
                );

            }

        } catch (err) {

            console.error(
                "SEND CHAT ERROR:",
                err
            );

            setError(
                err?.message ||
                "Pesan gagal dikirim."
            );

        } finally {

            setSending(false);

        }

    };


    // ==================================================
    // ENTER SEND
    // ==================================================

    const handleKeyDown = (
        event
    ) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            handleSend(event);

        }

    };


    // ==================================================
    // INVALID USER
    // ==================================================

    if (!id_user) {

        return (

            <div
                className="
                    min-h-[100dvh]
                    w-full
                    bg-[#090909]
                    text-white
                    flex
                    items-center
                    justify-center
                    px-5
                    overflow-hidden
                "
            >

                <div
                    className="
                        w-full
                        max-w-md
                        bg-[#141414]
                        border
                        border-[#D4AF37]/20
                        rounded-2xl
                        p-8
                        text-center
                    "
                >

                    <FaComments
                        className="
                            text-[#D4AF37]
                            text-4xl
                            mx-auto
                            mb-5
                        "
                    />

                    <h1
                        className="
                            text-2xl
                            font-bold
                        "
                    >
                        Chat
                    </h1>


                    <p
                        className="
                            text-gray-400
                            mt-3
                        "
                    >
                        Silakan login terlebih dahulu
                        untuk menggunakan fitur chat.
                    </p>


                    <button
                        onClick={() =>
                            navigate(
                                "/login"
                            )
                        }
                        className="
                            mt-6
                            w-full
                            rounded-xl
                            bg-[#D4AF37]
                            text-black
                            font-semibold
                            py-3
                            hover:bg-[#e2bf4d]
                            transition
                        "
                    >
                        Login
                    </button>

                </div>

            </div>

        );

    }


    // ==================================================
    // RENDER
    // ==================================================

    return (

        <div
            className="
                chat-page
                w-full
                h-[100dvh]
                min-h-[100dvh]
                bg-[#090909]
                text-white
                overflow-hidden
            "
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <header
                className="
                    h-[76px]
                    w-full
                    shrink-0
                    border-b
                    border-[#D4AF37]/20
                    bg-[#111111]
                    flex
                    items-center
                "
            >

                <div
                    className="
                        w-full
                        max-w-7xl
                        mx-auto
                        px-4
                        sm:px-6
                        lg:px-8
                        flex
                        items-center
                        gap-3
                    "
                >

                    <button
                        type="button"
                        onClick={() =>
                            navigate(-1)
                        }
                        aria-label="Kembali"
                        className="
                            w-10
                            h-10
                            shrink-0
                            rounded-full
                            border
                            border-[#D4AF37]/20
                            flex
                            items-center
                            justify-center
                            text-[#D4AF37]
                            hover:bg-[#D4AF37]/10
                            transition
                        "
                    >

                        <FaArrowLeft />

                    </button>


                    <div
                        className="
                            min-w-0
                        "
                    >

                        <p
                            className="
                                text-[#D4AF37]
                                text-[9px]
                                sm:text-[10px]
                                uppercase
                                tracking-[3px]
                                truncate
                            "
                        >
                            Handu Atelier
                        </p>


                        <h1
                            className="
                                text-lg
                                sm:text-xl
                                md:text-2xl
                                font-bold
                            "
                        >
                            Chat
                        </h1>

                    </div>

                </div>

            </header>


            {/* =================================================
                MAIN
            ================================================= */}

            <div
                className="
                    w-full
                    h-[calc(100dvh-76px)]
                    overflow-hidden
                "
            >

                <div
                    className="
                        w-full
                        max-w-7xl
                        h-full
                        mx-auto
                        px-3
                        sm:px-4
                        md:px-6
                        lg:px-8
                        py-3
                        sm:py-4
                    "
                >

                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <div
                            className="
                                mb-3
                                shrink-0
                                rounded-xl
                                border
                                border-red-500/30
                                bg-red-500/10
                                text-red-400
                                px-4
                                py-3
                                text-sm
                            "
                        >
                            {error}
                        </div>

                    )}


                    {/* =================================================
                        CONTENT GRID
                    ================================================= */}

                    <div
                        className={`
                            w-full
                            h-full
                            min-h-0
                            grid
                            gap-3
                            sm:gap-4
                            ${
                                isPetugas
                                    ? `
                                        grid-cols-1
                                        lg:grid-cols-[320px_minmax(0,1fr)]
                                    `
                                    : `
                                        grid-cols-1
                                    `
                            }
                        `}
                    >


                        {/* =================================================
                            PETUGAS - CUSTOMER LIST
                        ================================================= */}

                        {isPetugas && (

                            <aside
                                className="
                                    w-full
                                    min-w-0
                                    min-h-0
                                    h-[170px]
                                    lg:h-full
                                    bg-[#141414]
                                    border
                                    border-[#D4AF37]/20
                                    rounded-2xl
                                    overflow-hidden
                                    flex
                                    flex-col
                                "
                            >

                                {/* LIST HEADER */}

                                <div
                                    className="
                                        shrink-0
                                        px-4
                                        py-3
                                        sm:px-5
                                        sm:py-4
                                        border-b
                                        border-white/10
                                    "
                                >

                                    <p
                                        className="
                                            text-[#D4AF37]
                                            text-[9px]
                                            sm:text-[10px]
                                            uppercase
                                            tracking-[3px]
                                        "
                                    >
                                        Pesan Masuk
                                    </p>


                                    <h2
                                        className="
                                            text-lg
                                            sm:text-xl
                                            font-bold
                                            mt-1
                                        "
                                    >
                                        Pelanggan
                                    </h2>

                                </div>


                                {/* CUSTOMER LIST */}

                                <div
                                    className="
                                        flex-1
                                        min-h-0
                                        overflow-y-auto
                                        chat-scroll
                                    "
                                >

                                    {/* LOADING */}

                                    {loading &&
                                        chats.length === 0 && (

                                            <div
                                                className="
                                                    p-5
                                                    text-gray-500
                                                    text-sm
                                                "
                                            >
                                                Memuat chat...
                                            </div>

                                        )}


                                    {/* EMPTY */}

                                    {!loading &&
                                        chats.length === 0 && (

                                            <div
                                                className="
                                                    p-5
                                                    text-gray-500
                                                    text-sm
                                                "
                                            >
                                                Belum ada percakapan.
                                            </div>

                                        )}


                                    {/* LIST */}

                                    {chats.map(
                                        chat => {

                                            const active =
                                                Number(
                                                    selectedConversation
                                                ) ===
                                                Number(
                                                    chat.id_percakapan
                                                );


                                            return (

                                                <button
                                                    key={
                                                        chat.id_percakapan
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        loadPetugasDetail(
                                                            chat.id_percakapan
                                                        )
                                                    }
                                                    className={`
                                                        w-full
                                                        text-left
                                                        px-4
                                                        py-3
                                                        border-b
                                                        border-white/5
                                                        hover:bg-white/5
                                                        transition
                                                        ${
                                                            active
                                                                ? "bg-[#D4AF37]/10"
                                                                : ""
                                                        }
                                                    `}
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-3
                                                        "
                                                    >

                                                        {/* AVATAR */}

                                                        <div
                                                            className="
                                                                w-10
                                                                h-10
                                                                sm:w-11
                                                                sm:h-11
                                                                rounded-full
                                                                bg-[#D4AF37]/10
                                                                border
                                                                border-[#D4AF37]/20
                                                                flex
                                                                items-center
                                                                justify-center
                                                                text-[#D4AF37]
                                                                shrink-0
                                                            "
                                                        >

                                                            <FaUser />

                                                        </div>


                                                        {/* INFO */}

                                                        <div
                                                            className="
                                                                min-w-0
                                                                flex-1
                                                            "
                                                        >

                                                            <div
                                                                className="
                                                                    flex
                                                                    items-center
                                                                    justify-between
                                                                    gap-2
                                                                "
                                                            >

                                                                <p
                                                                    className="
                                                                        font-semibold
                                                                        text-sm
                                                                        truncate
                                                                    "
                                                                >
                                                                    {
                                                                        chat.nama_pelanggan ||
                                                                        "Pelanggan"
                                                                    }
                                                                </p>


                                                                {chat.waktu_terakhir && (

                                                                    <span
                                                                        className="
                                                                            text-[9px]
                                                                            text-gray-500
                                                                            shrink-0
                                                                        "
                                                                    >
                                                                        {
                                                                            formatTime(
                                                                                chat.waktu_terakhir
                                                                            )
                                                                        }
                                                                    </span>

                                                                )}

                                                            </div>


                                                            <p
                                                                className="
                                                                    text-xs
                                                                    text-gray-500
                                                                    truncate
                                                                    mt-1
                                                                "
                                                            >
                                                                {
                                                                    chat.pesan_terakhir ||
                                                                    "Belum ada pesan"
                                                                }
                                                            </p>


                                                            {Number(
                                                                chat.unread_count
                                                            ) > 0 && (

                                                                <span
                                                                    className="
                                                                        inline-flex
                                                                        mt-2
                                                                        min-w-5
                                                                        h-5
                                                                        px-1.5
                                                                        rounded-full
                                                                        bg-[#D4AF37]
                                                                        text-black
                                                                        text-[10px]
                                                                        font-bold
                                                                        items-center
                                                                        justify-center
                                                                    "
                                                                >
                                                                    {
                                                                        chat.unread_count
                                                                    }
                                                                </span>

                                                            )}

                                                        </div>

                                                    </div>

                                                </button>

                                            );

                                        }
                                    )}

                                </div>

                            </aside>

                        )}


                        {/* =================================================
                            CHAT AREA
                        ================================================= */}

                        <main
                            className="
                                w-full
                                min-w-0
                                min-h-0
                                h-full
                                bg-[#141414]
                                border
                                border-[#D4AF37]/20
                                rounded-2xl
                                overflow-hidden
                                flex
                                flex-col
                            "
                        >

                            {/* =================================================
                                CHAT HEADER
                            ================================================= */}

                            <div
                                className="
                                    shrink-0
                                    px-4
                                    py-3
                                    sm:px-5
                                    sm:py-4
                                    border-b
                                    border-white/10
                                    flex
                                    items-center
                                    gap-3
                                "
                            >

                                <div
                                    className="
                                        w-10
                                        h-10
                                        sm:w-11
                                        sm:h-11
                                        rounded-full
                                        bg-[#D4AF37]/10
                                        border
                                        border-[#D4AF37]/20
                                        flex
                                        items-center
                                        justify-center
                                        text-[#D4AF37]
                                        shrink-0
                                    "
                                >

                                    <FaUser />

                                </div>


                                <div
                                    className="
                                        min-w-0
                                    "
                                >

                                    <p
                                        className="
                                            font-semibold
                                            text-sm
                                            sm:text-base
                                            truncate
                                        "
                                    >

                                        {isPetugas
                                            ? (
                                                conversation?.nama_pelanggan ||
                                                "Pelanggan"
                                            )
                                            : (
                                                "Petugas Handu Atelier"
                                            )
                                        }

                                    </p>


                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            mt-1
                                        "
                                    >

                                        <span
                                            className="
                                                w-2
                                                h-2
                                                rounded-full
                                                bg-green-500
                                                shrink-0
                                            "
                                        />

                                        <span
                                            className="
                                                text-[10px]
                                                sm:text-xs
                                                text-gray-500
                                            "
                                        >
                                            Online
                                        </span>

                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                                MESSAGE AREA
                            ================================================= */}

                            <div
                                className="
                                    flex-1
                                    min-h-0
                                    overflow-y-auto
                                    chat-scroll
                                    px-3
                                    sm:px-4
                                    md:px-6
                                    py-4
                                    sm:py-6
                                "
                            >

                                <div
                                    className="
                                        w-full
                                        min-h-full
                                        flex
                                        flex-col
                                        gap-3
                                    "
                                >

                                    {/* LOADING */}

                                    {loading &&
                                        messages.length === 0 && (

                                            <div
                                                className="
                                                    flex-1
                                                    flex
                                                    items-center
                                                    justify-center
                                                    text-center
                                                    text-gray-500
                                                    py-10
                                                "
                                            >

                                                <div>

                                                    <FaComments
                                                        className="
                                                            text-3xl
                                                            text-[#D4AF37]/30
                                                            mx-auto
                                                            mb-3
                                                        "
                                                    />

                                                    <p
                                                        className="
                                                            text-sm
                                                        "
                                                    >
                                                        Memuat percakapan...
                                                    </p>

                                                </div>

                                            </div>

                                        )}


                                    {/* EMPTY */}

                                    {!loading &&
                                        messages.length === 0 && (

                                            <div
                                                className="
                                                    flex-1
                                                    flex
                                                    flex-col
                                                    items-center
                                                    justify-center
                                                    text-center
                                                    text-gray-500
                                                    py-10
                                                "
                                            >

                                                <FaComments
                                                    className="
                                                        text-4xl
                                                        text-[#D4AF37]/40
                                                        mb-4
                                                    "
                                                />


                                                <p
                                                    className="
                                                        text-sm
                                                    "
                                                >
                                                    Belum ada pesan.
                                                </p>


                                                <p
                                                    className="
                                                        text-xs
                                                        sm:text-sm
                                                        mt-1
                                                    "
                                                >
                                                    Mulai percakapan sekarang.
                                                </p>

                                            </div>

                                        )}


                                    {/* MESSAGES */}

                                    {messages.map(
                                        item => {

                                            const mine =
                                                Number(
                                                    item.id_pengirim
                                                ) ===
                                                Number(
                                                    id_user
                                                );


                                            return (

                                                <div
                                                    key={
                                                        item.id_pesan
                                                    }
                                                    className={`
                                                        w-full
                                                        flex
                                                        ${
                                                            mine
                                                                ? "justify-end"
                                                                : "justify-start"
                                                        }
                                                    `}
                                                >

                                                    <div
                                                        className={`
                                                            flex
                                                            flex-col
                                                            ${
                                                                mine
                                                                    ? "items-end"
                                                                    : "items-start"
                                                            }
                                                            max-w-[88%]
                                                            sm:max-w-[75%]
                                                            md:max-w-[65%]
                                                        `}
                                                    >

                                                        {/* MESSAGE BUBBLE */}

                                                        <div
                                                            className={`
                                                                px-3
                                                                sm:px-4
                                                                py-2.5
                                                                sm:py-3
                                                                rounded-2xl
                                                                ${
                                                                    mine
                                                                        ? `
                                                                            bg-[#D4AF37]
                                                                            text-black
                                                                            rounded-br-md
                                                                        `
                                                                        : `
                                                                            bg-[#202020]
                                                                            text-white
                                                                            border
                                                                            border-white/5
                                                                            rounded-bl-md
                                                                        `
                                                                }
                                                            `}
                                                        >

                                                            <p
                                                                className="
                                                                    whitespace-pre-wrap
                                                                    break-words
                                                                    text-sm
                                                                    leading-6
                                                                "
                                                            >
                                                                {
                                                                    item.pesan
                                                                }
                                                            </p>

                                                        </div>


                                                        {/* MESSAGE META */}

                                                        <div
                                                            className={`
                                                                flex
                                                                items-center
                                                                gap-2
                                                                mt-1
                                                                px-1
                                                                ${
                                                                    mine
                                                                        ? "justify-end"
                                                                        : "justify-start"
                                                                }
                                                            `}
                                                        >

                                                            <span
                                                                className="
                                                                    text-[9px]
                                                                    sm:text-[10px]
                                                                    text-gray-600
                                                                "
                                                            >
                                                                {
                                                                    formatDate(
                                                                        item.created_at
                                                                    )
                                                                }

                                                                {" "}

                                                                {
                                                                    formatTime(
                                                                        item.created_at
                                                                    )
                                                                }
                                                            </span>


                                                            {mine && (

                                                                <span
                                                                    className="
                                                                        text-[9px]
                                                                        sm:text-[10px]
                                                                        text-[#D4AF37]
                                                                    "
                                                                >
                                                                    {
                                                                        item.status ===
                                                                        "Dibaca"
                                                                            ? "Dibaca"
                                                                            : "Terkirim"
                                                                    }
                                                                </span>

                                                            )}

                                                        </div>

                                                    </div>

                                                </div>

                                            );

                                        }
                                    )}


                                    {/* BOTTOM */}

                                    <div
                                        ref={
                                            bottomRef
                                        }
                                        className="
                                            h-px
                                            shrink-0
                                        "
                                    />

                                </div>

                            </div>


                            {/* =================================================
                                INPUT
                            ================================================= */}

                            <form
                                onSubmit={
                                    handleSend
                                }
                                className="
                                    shrink-0
                                    p-2.5
                                    sm:p-3
                                    md:p-4
                                    border-t
                                    border-white/10
                                "
                            >

                                <div
                                    className="
                                        w-full
                                        flex
                                        items-end
                                        gap-2
                                        sm:gap-3
                                    "
                                >

                                    <textarea
                                        value={
                                            message
                                        }
                                        onChange={
                                            event =>
                                                setMessage(
                                                    event.target.value
                                                )
                                        }
                                        onKeyDown={
                                            handleKeyDown
                                        }
                                        rows={1}
                                        maxLength={5000}
                                        placeholder="Tulis pesan..."
                                        disabled={
                                            sending ||
                                            !conversation
                                        }
                                        className="
                                            flex-1
                                            min-w-0
                                            min-h-[44px]
                                            max-h-[120px]
                                            resize-none
                                            bg-[#202020]
                                            border
                                            border-white/10
                                            rounded-2xl
                                            px-3
                                            sm:px-4
                                            py-2.5
                                            sm:py-3
                                            text-sm
                                            outline-none
                                            focus:border-[#D4AF37]/50
                                            placeholder:text-gray-600
                                            disabled:opacity-50
                                        "
                                    />


                                    <button
                                        type="submit"
                                        disabled={
                                            sending ||
                                            !message.trim() ||
                                            !conversation
                                        }
                                        aria-label="Kirim pesan"
                                        className="
                                            w-11
                                            h-11
                                            sm:w-12
                                            sm:h-12
                                            shrink-0
                                            rounded-full
                                            bg-[#D4AF37]
                                            text-black
                                            flex
                                            items-center
                                            justify-center
                                            disabled:opacity-40
                                            disabled:cursor-not-allowed
                                            hover:bg-[#e2bf4d]
                                            transition
                                        "
                                    >

                                        <FaPaperPlane />

                                    </button>

                                </div>

                            </form>

                        </main>

                    </div>

                </div>

            </div>


            {/* =================================================
                RESPONSIVE + HIDE SCROLLBAR
            ================================================= */}

            <style>
                {`

                    /* =========================================
                       GLOBAL CHAT PAGE
                    ========================================= */

                    .chat-page,
                    .chat-page * {
                        box-sizing: border-box;
                    }


                    /* =========================================
                       HILANGKAN SCROLLBAR
                    ========================================= */

                    .chat-scroll {
                        scrollbar-width: none;
                        -ms-overflow-style: none;
                        overscroll-behavior: contain;
                    }

                    .chat-scroll::-webkit-scrollbar {
                        width: 0;
                        height: 0;
                        display: none;
                    }


                    /* =========================================
                       MOBILE
                    ========================================= */

                    @media (max-width: 1023px) {

                        .chat-page {
                            width: 100%;
                            max-width: 100vw;
                            overflow: hidden;
                        }

                    }


                    /* =========================================
                       TABLET / MOBILE PETUGAS
                    ========================================= */

                    @media (max-width: 1023px) {

                        .chat-page
                        .chat-scroll {
                            overscroll-behavior: contain;
                        }

                    }


                    /* =========================================
                       HP KECIL
                    ========================================= */

                    @media (max-width: 480px) {

                        .chat-page textarea {
                            font-size: 14px;
                        }

                        .chat-page main {
                            border-radius: 14px;
                        }

                        .chat-page aside {
                            border-radius: 14px;
                        }

                    }


                    /* =========================================
                       LAPTOP BESAR
                    ========================================= */

                    @media (min-width: 1024px) {

                        .chat-page main {
                            min-width: 0;
                        }

                    }


                    /* =========================================
                       TEXTAREA
                    ========================================= */

                    .chat-page textarea {
                        overflow-y: auto;
                        scrollbar-width: none;
                        -ms-overflow-style: none;
                    }

                    .chat-page textarea::-webkit-scrollbar {
                        display: none;
                        width: 0;
                        height: 0;
                    }

                `}
            </style>

        </div>

    );

}


export default ChatPage;