import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    FaArrowLeft,
    FaComments,
    FaPaperPlane,
    FaUser
} from "react-icons/fa";

import {
    useNavigate
} from "react-router-dom";

import {
    getPetugasChats,
    getPetugasChatDetail,
    markChatAsRead,
    sendChatMessage
} from "../../services/chatService";

import {
    createChatSocket
} from "../../services/socket";

function ChatPetugas() {

    const navigate =
        useNavigate();

    const messagesEndRef =
        useRef(null);

    const socketRef =
        useRef(null);

    const [user, setUser] =
        useState(null);

    const [conversations, setConversations] =
        useState([]);

    const [selected, setSelected] =
        useState(null);

    const [messages, setMessages] =
        useState([]);

    const [input, setInput] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [loadingMessages, setLoadingMessages] =
        useState(false);

    const [sending, setSending] =
        useState(false);

    const [connected, setConnected] =
        useState(false);

    const [error, setError] =
        useState("");

    // ==================================================
    // USER
    // ==================================================

    useEffect(() => {

        const storedUser =
            localStorage.getItem(
                "user"
            );

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

            const parsedUser =
                JSON.parse(
                    storedUser
                );

            if (
                !parsedUser?.id_user
            ) {
                navigate(
                    "/login",
                    {
                        replace: true
                    }
                );

                return;
            }

            if (
                Number(
                    parsedUser.id_role
                ) !== 2
            ) {
                navigate(
                    "/dashboard",
                    {
                        replace: true
                    }
                );

                return;
            }

            setUser(
                parsedUser
            );

        } catch (err) {

            console.error(
                "User tidak valid:",
                err
            );

            navigate(
                "/login",
                {
                    replace: true
                }
            );
        }

    }, [navigate]);

    // ==================================================
    // LOAD CONVERSATIONS
    // ==================================================

    const loadConversations =
        async () => {

            if (
                !user?.id_user
            ) {
                return;
            }

            try {

                const result =
                    await getPetugasChats(
                        user.id_user
                    );

                setConversations(
                    result.conversations ||
                    []
                );

            } catch (err) {

                console.error(
                    "Load conversations:",
                    err
                );

                setError(
                    err.message ||
                    "Gagal mengambil daftar chat"
                );
            }
        };

    useEffect(() => {

        if (
            !user?.id_user
        ) {
            return;
        }

        const initialLoad =
            async () => {

                try {

                    setLoading(true);

                    await loadConversations();

                } finally {

                    setLoading(false);
                }
            };

        initialLoad();

    }, [user]);

    // ==================================================
    // SOCKET PETUGAS
    // ==================================================

    useEffect(() => {

        if (
            !user?.id_user
        ) {
            return;
        }

        const socket =
            createChatSocket();

        socketRef.current =
            socket;

        socket.on(
            "connect",
            () => {

                setConnected(
                    true
                );

                socket.emit(
                    "join_user",
                    {
                        id_user:
                            user.id_user
                    }
                );
            }
        );

        socket.on(
            "disconnect",
            () => {

                setConnected(
                    false
                );
            }
        );

        // Ketika pelanggan mengirim
        // pesan baru, daftar chat petugas
        // langsung diperbarui.
        socket.on(
            "chat:conversation_updated",
            () => {

                loadConversations();
            }
        );

        socket.on(
            "chat:new_message",
            (message) => {

                if (
                    !selected
                ) {
                    return;
                }

                if (
                    Number(
                        message.id_percakapan
                    ) !==
                    Number(
                        selected.id_percakapan
                    )
                ) {
                    return;
                }

                setMessages(
                    (previous) => {

                        const exists =
                            previous.some(
                                (item) =>
                                    Number(
                                        item.id_pesan
                                    ) ===
                                    Number(
                                        message.id_pesan
                                    )
                            );

                        if (exists) {
                            return previous;
                        }

                        return [
                            ...previous,
                            message
                        ];
                    }
                );

                // Jika pelanggan mengirim,
                // petugas sedang membuka chat,
                // tandai langsung dibaca.
                if (
                    Number(
                        message.id_pengirim
                    ) !==
                    Number(
                        user.id_user
                    )
                ) {

                    markChatAsRead(
                        user.id_user,
                        selected.id_percakapan
                    ).catch(
                        (err) =>
                            console.error(
                                "Mark petugas chat:",
                                err
                            )
                    );
                }
            }
        );

        return () => {

            socket.disconnect();

            socketRef.current =
                null;
        };

    }, [
        user,
        selected
    ]);

    // ==================================================
    // OPEN CONVERSATION
    // ==================================================

    const openConversation =
        async (conversation) => {

            if (
                selected &&
                Number(
                    selected.id_percakapan
                ) !==
                Number(
                    conversation.id_percakapan
                )
            ) {

                socketRef.current?.emit(
                    "leave_conversation",
                    {
                        id_percakapan:
                            selected.id_percakapan
                    }
                );
            }

            try {

                setLoadingMessages(
                    true
                );

                setError("");

                const result =
                    await getPetugasChatDetail(
                        user.id_user,
                        conversation.id_percakapan
                    );

                setSelected(
                    result.conversation
                );

                setMessages(
                    result.messages ||
                    []
                );

                socketRef.current?.emit(
                    "join_conversation",
                    {
                        id_user:
                            user.id_user,
                        id_percakapan:
                            conversation.id_percakapan
                    }
                );

                await markChatAsRead(
                    user.id_user,
                    conversation.id_percakapan
                );

                setConversations(
                    (previous) =>
                        previous.map(
                            (item) =>
                                Number(
                                    item.id_percakapan
                                ) ===
                                Number(
                                    conversation.id_percakapan
                                )
                                    ? {
                                        ...item,
                                        unread_count:
                                            0
                                    }
                                    : item
                        )
                );

            } catch (err) {

                console.error(
                    "Open conversation:",
                    err
                );

                setError(
                    err.message ||
                    "Gagal membuka chat"
                );

            } finally {

                setLoadingMessages(
                    false
                );
            }
        };

    // ==================================================
    // AUTO SCROLL
    // ==================================================

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView(
            {
                behavior: "smooth"
            }
        );

    }, [messages]);

    // ==================================================
    // SEND
    // ==================================================

    const handleSend =
        async () => {

            const text =
                input.trim();

            if (
                !text ||
                !selected ||
                sending
            ) {
                return;
            }

            try {

                setSending(
                    true
                );

                setInput("");

                const result =
                    await sendChatMessage(
                        user.id_user,
                        selected.id_percakapan,
                        text
                    );

                if (
                    !socketRef.current ||
                    !socketRef.current.connected
                ) {

                    setMessages(
                        (previous) => {

                            const exists =
                                previous.some(
                                    (item) =>
                                        Number(
                                            item.id_pesan
                                        ) ===
                                        Number(
                                            result.data.id_pesan
                                        )
                                );

                            if (exists) {
                                return previous;
                            }

                            return [
                                ...previous,
                                result.data
                            ];
                        }
                    );
                }

                await loadConversations();

            } catch (err) {

                console.error(
                    "Send petugas message:",
                    err
                );

                setInput(text);

                setError(
                    err.message ||
                    "Pesan gagal dikirim"
                );

            } finally {

                setSending(
                    false
                );
            }
        };

    // ==================================================
    // ENTER
    // ==================================================

    const handleKeyDown =
        (event) => {

            if (
                event.key ===
                    "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                handleSend();
            }
        };

    // ==================================================
    // FORMAT WAKTU
    // ==================================================

    const formatTime =
        (value) => {

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

    const formatDate =
        (value) => {

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
                    month: "short"
                }
            );
        };

    // ==================================================
    // LOADING
    // ==================================================

    if (loading) {

        return (
            <div className="
                min-h-screen
                bg-[#090909]
                text-white
                flex
                items-center
                justify-center
            ">
                <p className="
                    text-[#D4AF37]
                ">
                    Memuat chat...
                </p>
            </div>
        );
    }

    return (
        <div className="
            min-h-screen
            bg-[#090909]
            text-white
            pt-28
            pb-8
            px-4
            md:px-8
        ">

            <div className="
                max-w-7xl
                mx-auto
                h-[calc(100vh-9rem)]
                min-h-[600px]
                rounded-3xl
                overflow-hidden
                border
                border-[#D4AF37]/20
                bg-[#111111]
                flex
                shadow-[0_20px_70px_rgba(0,0,0,.45)]
            ">

                {/* ==============================
                    LIST PELANGGAN
                ============================== */}

                <aside className="
                    w-[320px]
                    hidden
                    md:flex
                    flex-col
                    border-r
                    border-white/10
                    bg-[#151515]
                ">

                    <div className="
                        px-5
                        py-5
                        border-b
                        border-white/10
                    ">

                        <div className="
                            flex
                            items-center
                            justify-between
                        ">

                            <div>
                                <h1 className="
                                    font-semibold
                                    text-lg
                                ">
                                    Chat Pelanggan
                                </h1>

                                <p className="
                                    text-xs
                                    text-gray-500
                                    mt-1
                                ">
                                    {connected
                                        ? "Realtime aktif"
                                        : "Menghubungkan..."}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/petugas/dashboard"
                                    )
                                }
                                className="
                                    w-9
                                    h-9
                                    rounded-full
                                    border
                                    border-[#D4AF37]/20
                                    text-[#D4AF37]
                                    flex
                                    items-center
                                    justify-center
                                "
                            >
                                <FaArrowLeft />
                            </button>

                        </div>

                    </div>

                    <div className="
                        flex-1
                        overflow-y-auto
                    ">

                        {conversations.length === 0 ? (

                            <div className="
                                px-6
                                py-12
                                text-center
                                text-gray-500
                            ">

                                <FaComments
                                    className="
                                        mx-auto
                                        text-3xl
                                        text-[#D4AF37]/40
                                        mb-3
                                    "
                                />

                                <p className="
                                    text-sm
                                ">
                                    Belum ada percakapan.
                                </p>

                            </div>

                        ) : (

                            conversations.map(
                                (conversation) => {

                                    const active =
                                        selected &&
                                        Number(
                                            selected.id_percakapan
                                        ) ===
                                        Number(
                                            conversation.id_percakapan
                                        );

                                    return (
                                        <button
                                            type="button"
                                            key={
                                                conversation.id_percakapan
                                            }
                                            onClick={() =>
                                                openConversation(
                                                    conversation
                                                )
                                            }
                                            className={`
                                                w-full
                                                text-left
                                                px-5
                                                py-4
                                                border-b
                                                border-white/5
                                                transition
                                                ${
                                                    active
                                                        ? "bg-[#D4AF37]/10"
                                                        : "hover:bg-white/[.03]"
                                                }
                                            `}
                                        >

                                            <div className="
                                                flex
                                                items-start
                                                gap-3
                                            ">

                                                <div className="
                                                    w-10
                                                    h-10
                                                    rounded-full
                                                    bg-[#D4AF37]/10
                                                    border
                                                    border-[#D4AF37]/20
                                                    flex
                                                    items-center
                                                    justify-center
                                                    text-[#D4AF37]
                                                    flex-shrink-0
                                                ">
                                                    <FaUser />
                                                </div>

                                                <div className="
                                                    min-w-0
                                                    flex-1
                                                ">

                                                    <div className="
                                                        flex
                                                        justify-between
                                                        gap-2
                                                    ">

                                                        <p className="
                                                            font-medium
                                                            truncate
                                                            text-sm
                                                        ">
                                                            {
                                                                conversation.nama_pelanggan ||
                                                                "Pelanggan"
                                                            }
                                                        </p>

                                                        <span className="
                                                            text-[10px]
                                                            text-gray-600
                                                            whitespace-nowrap
                                                        ">
                                                            {
                                                                formatDate(
                                                                    conversation.waktu_pesan_terakhir
                                                                )
                                                            }
                                                        </span>

                                                    </div>

                                                    <div className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                        mt-1
                                                    ">

                                                        <p className="
                                                            text-xs
                                                            text-gray-500
                                                            truncate
                                                            flex-1
                                                        ">
                                                            {
                                                                conversation.pesan_terakhir ||
                                                                "Belum ada pesan"
                                                            }
                                                        </p>

                                                        {Number(
                                                            conversation.unread_count
                                                        ) > 0 && (
                                                            <span className="
                                                                min-w-5
                                                                h-5
                                                                px-1.5
                                                                rounded-full
                                                                bg-[#D4AF37]
                                                                text-black
                                                                text-[10px]
                                                                font-bold
                                                                flex
                                                                items-center
                                                                justify-center
                                                            ">
                                                                {
                                                                    conversation.unread_count
                                                                }
                                                            </span>
                                                        )}

                                                    </div>

                                                </div>

                                            </div>

                                        </button>
                                    );
                                }
                            )

                        )}

                    </div>

                </aside>

                {/* ==============================
                    CHAT DETAIL
                ============================== */}

                <section className="
                    flex-1
                    flex
                    flex-col
                    min-w-0
                ">

                    {!selected ? (

                        <div className="
                            flex-1
                            flex
                            flex-col
                            items-center
                            justify-center
                            text-center
                            px-6
                        ">

                            <div className="
                                w-20
                                h-20
                                rounded-full
                                bg-[#D4AF37]/10
                                border
                                border-[#D4AF37]/20
                                flex
                                items-center
                                justify-center
                                text-[#D4AF37]
                                text-2xl
                                mb-5
                            ">
                                <FaComments />
                            </div>

                            <h2 className="
                                text-xl
                                font-semibold
                            ">
                                Chat Pelanggan
                            </h2>

                            <p className="
                                text-sm
                                text-gray-500
                                max-w-md
                                mt-2
                            ">
                                Pilih pelanggan di sebelah
                                kiri untuk melihat dan
                                membalas percakapan.
                            </p>

                        </div>

                    ) : (

                        <>

                            {/* HEADER */}

                            <div className="
                                px-5
                                py-4
                                border-b
                                border-white/10
                                bg-[#151515]
                                flex
                                items-center
                                gap-3
                            ">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelected(
                                            null
                                        )
                                    }
                                    className="
                                        md:hidden
                                        w-9
                                        h-9
                                        rounded-full
                                        border
                                        border-[#D4AF37]/20
                                        text-[#D4AF37]
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >
                                    <FaArrowLeft />
                                </button>

                                <div className="
                                    w-10
                                    h-10
                                    rounded-full
                                    bg-[#D4AF37]/15
                                    border
                                    border-[#D4AF37]/30
                                    flex
                                    items-center
                                    justify-center
                                    text-[#D4AF37]
                                ">
                                    <FaUser />
                                </div>

                                <div>
                                    <h2 className="
                                        font-semibold
                                    ">
                                        {
                                            selected.nama_pelanggan ||
                                            "Pelanggan"
                                        }
                                    </h2>

                                    <p className="
                                        text-xs
                                        text-gray-500
                                        mt-1
                                    ">
                                        {
                                            selected.email_pelanggan ||
                                            "Percakapan pelanggan"
                                        }
                                    </p>
                                </div>

                            </div>

                            {/* ERROR */}

                            {error && (
                                <div className="
                                    mx-5
                                    mt-4
                                    px-4
                                    py-3
                                    rounded-xl
                                    bg-red-500/10
                                    border
                                    border-red-500/20
                                    text-red-400
                                    text-sm
                                ">
                                    {error}
                                </div>
                            )}

                            {/* MESSAGES */}

                            <div className="
                                flex-1
                                overflow-y-auto
                                px-4
                                md:px-8
                                py-6
                                space-y-3
                            ">

                                {loadingMessages ? (

                                    <div className="
                                        h-full
                                        flex
                                        items-center
                                        justify-center
                                        text-[#D4AF37]
                                        text-sm
                                    ">
                                        Memuat percakapan...
                                    </div>

                                ) : messages.length === 0 ? (

                                    <div className="
                                        h-full
                                        flex
                                        items-center
                                        justify-center
                                        text-gray-500
                                        text-sm
                                    ">
                                        Belum ada pesan.
                                    </div>

                                ) : (

                                    messages.map(
                                        (message) => {

                                            const mine =
                                                Number(
                                                    message.id_pengirim
                                                ) ===
                                                Number(
                                                    user.id_user
                                                );

                                            return (
                                                <div
                                                    key={
                                                        message.id_pesan
                                                    }
                                                    className={`
                                                        flex
                                                        ${
                                                            mine
                                                                ? "justify-end"
                                                                : "justify-start"
                                                        }
                                                    `}
                                                >

                                                    <div className={`
                                                        max-w-[80%]
                                                        md:max-w-[65%]
                                                        px-4
                                                        py-3
                                                        rounded-2xl
                                                        ${
                                                            mine
                                                                ? "bg-[#D4AF37] text-black rounded-br-md"
                                                                : "bg-[#202020] text-white border border-white/5 rounded-bl-md"
                                                        }
                                                    `}>

                                                        {!mine && (
                                                            <p className="
                                                                text-[#D4AF37]
                                                                text-xs
                                                                font-semibold
                                                                mb-1
                                                            ">
                                                                {
                                                                    message.nama_pengirim ||
                                                                    "Pelanggan"
                                                                }
                                                            </p>
                                                        )}

                                                        <p className="
                                                            text-sm
                                                            leading-6
                                                            whitespace-pre-wrap
                                                            break-words
                                                        ">
                                                            {
                                                                message.pesan
                                                            }
                                                        </p>

                                                        <p className={`
                                                            text-[10px]
                                                            mt-1
                                                            text-right
                                                            ${
                                                                mine
                                                                    ? "text-black/60"
                                                                    : "text-gray-500"
                                                            }
                                                        `}>
                                                            {
                                                                formatTime(
                                                                    message.created_at
                                                                )
                                                            }
                                                        </p>

                                                    </div>

                                                </div>
                                            );
                                        }
                                    )

                                )}

                                <div
                                    ref={
                                        messagesEndRef
                                    }
                                />

                            </div>

                            {/* INPUT */}

                            <div className="
                                border-t
                                border-white/10
                                bg-[#151515]
                                p-4
                            ">

                                <div className="
                                    flex
                                    items-end
                                    gap-3
                                ">

                                    <textarea
                                        value={
                                            input
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setInput(
                                                event.target.value
                                            )
                                        }
                                        onKeyDown={
                                            handleKeyDown
                                        }
                                        rows={1}
                                        maxLength={2000}
                                        placeholder="Tulis balasan..."
                                        className="
                                            flex-1
                                            resize-none
                                            min-h-[48px]
                                            max-h-32
                                            rounded-2xl
                                            bg-[#202020]
                                            border
                                            border-white/10
                                            px-4
                                            py-3
                                            text-sm
                                            text-white
                                            placeholder:text-gray-600
                                            focus:outline-none
                                            focus:border-[#D4AF37]/40
                                        "
                                    />

                                    <button
                                        type="button"
                                        onClick={
                                            handleSend
                                        }
                                        disabled={
                                            !input.trim() ||
                                            sending
                                        }
                                        className="
                                            w-12
                                            h-12
                                            rounded-2xl
                                            bg-[#D4AF37]
                                            text-black
                                            flex
                                            items-center
                                            justify-center
                                            disabled:opacity-40
                                            disabled:cursor-not-allowed
                                            hover:scale-105
                                            transition
                                        "
                                    >
                                        <FaPaperPlane />
                                    </button>

                                </div>

                            </div>

                        </>

                    )}

                </section>

            </div>

        </div>
    );
}

export default ChatPetugas;