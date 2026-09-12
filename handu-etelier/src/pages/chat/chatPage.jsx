import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  FaArrowLeft,
  FaPaperPlane,
  FaComments,
  FaUser,
} from "react-icons/fa";

import {
  getCustomerChat,
  getPetugasChats,
  getPetugasChatDetail,
  sendChatMessage,
  markChatAsRead,
} from "../../services/chatService";

import {
  createChatSocket,
} from "../../services/socket";

import {
  useNavigate,
} from "react-router-dom";

// ======================================================
// GET CURRENT USER
// ======================================================

const getCurrentUser = () => {
  const possibleKeys = [
    "user",
    "currentUser",
    "userData",
    "users",
  ];

  for (const key of possibleKeys) {
    try {
      const raw = localStorage.getItem(key);

      if (!raw) {
        continue;
      }

      const parsed = JSON.parse(raw);

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
      // lanjut
    }
  }

  const id_user = localStorage.getItem("id_user");

  if (id_user) {
    return {
      id_user: Number(id_user),
    };
  }

  return null;
};

// ======================================================
// FORMAT TIME
// ======================================================

const formatTime = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString(
    "id-ID",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};

// ======================================================
// FORMAT DATE
// ======================================================

const formatDate = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString(
    "id-ID",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

// ======================================================
// CHAT PAGE
// ======================================================

function ChatPage({
  mode = "customer",
}) {
  const navigate = useNavigate();

  // ====================================================
  // USER
  // ====================================================

  const currentUser = getCurrentUser();

  const id_user = Number(
    currentUser?.id_user ??
    currentUser?.id
  );

  const isPetugas =
    mode === "petugas";

  // ====================================================
  // STATE
  // ====================================================

  const [
    conversation,
    setConversation,
  ] = useState(null);

  const [
    messages,
    setMessages,
  ] = useState([]);

  const [
    chats,
    setChats,
  ] = useState([]);

  const [
    selectedConversation,
    setSelectedConversation,
  ] = useState(null);

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    sending,
    setSending,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    connected,
    setConnected,
  ] = useState(false);

  // Mobile petugas:
  // true = daftar pelanggan
  // false = detail chat
  const [
    showConversationList,
    setShowConversationList,
  ] = useState(true);

  // ====================================================
  // REFS
  // ====================================================

  const socketRef =
    useRef(null);

  const bottomRef =
    useRef(null);

  const conversationRef =
    useRef(null);

  const selectedConversationRef =
    useRef(null);

  // ====================================================
  // SYNC REFS
  // ====================================================

  useEffect(() => {
    conversationRef.current =
      conversation;
  }, [conversation]);

  useEffect(() => {
    selectedConversationRef.current =
      selectedConversation;
  }, [selectedConversation]);

  // ====================================================
  // SCROLL
  // ====================================================

  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 50);
  };

  // ====================================================
  // ADD MESSAGE WITHOUT DUPLICATE
  // ====================================================

  const appendMessage = (newMessage) => {
    if (!newMessage) {
      return;
    }

    setMessages((previous) => {
      const exists = previous.some(
        (item) =>
          Number(item.id_pesan) ===
          Number(newMessage.id_pesan)
      );

      if (exists) {
        return previous;
      }

      return [
        ...previous,
        newMessage,
      ];
    });
  };

  // ====================================================
  // LOAD CUSTOMER CHAT
  // ====================================================

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
        await getCustomerChat(id_user);

      const newConversation =
        result?.conversation || null;

      const newMessages =
        Array.isArray(result?.messages)
          ? result.messages
          : [];

      setConversation(
        newConversation
      );

      setMessages(
        newMessages
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

  // ====================================================
  // LOAD PETUGAS CHAT LIST
  // ====================================================

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
        await getPetugasChats(id_user);

      const data =
        Array.isArray(result?.data)
          ? result.data
          : [];

      setChats(data);
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

  // ====================================================
  // LOAD PETUGAS DETAIL
  // ====================================================

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
      setLoading(true);

      const result =
        await getPetugasChatDetail(
          id_user,
          id_percakapan
        );

      const newConversation =
        result?.conversation ||
        null;

      const newMessages =
        Array.isArray(result?.messages)
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

      setShowConversationList(false);

      await markChatAsRead(
        id_user,
        id_percakapan
      );

      setChats((previous) =>
        previous.map((item) => {
          if (
            Number(item.id_percakapan) ===
            Number(id_percakapan)
          ) {
            return {
              ...item,
              unread_count: 0,
            };
          }

          return item;
        })
      );

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
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // INITIAL LOAD
  // ====================================================

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    id_user,
    isPetugas,
  ]);

  // ====================================================
  // SOCKET.IO
  // ====================================================

  useEffect(() => {
    if (!id_user) {
      return;
    }

    const socket =
      createChatSocket();

    socketRef.current =
      socket;

    // --------------------------------------------------
    // CONNECT
    // --------------------------------------------------

    const handleConnect = () => {
      console.log(
        "Chat socket connected:",
        socket.id
      );

      setConnected(true);

      // PETUGAS
      if (isPetugas) {
        socket.emit(
          "join_user",
          {
            id_user,
          }
        );
      }

      // CURRENT CONVERSATION
      const currentConversation =
        conversationRef.current
          ?.id_percakapan;

      if (currentConversation) {
        socket.emit(
          "join_conversation",
          Number(currentConversation)
        );
      }
    };

    // --------------------------------------------------
    // DISCONNECT
    // --------------------------------------------------

    const handleDisconnect = () => {
      setConnected(false);
    };

    // --------------------------------------------------
    // CONNECT ERROR
    // --------------------------------------------------

    const handleConnectError = (err) => {
      console.error(
        "Chat socket connection error:",
        err?.message || err
      );

      setConnected(false);
    };

    // --------------------------------------------------
    // NEW MESSAGE
    // --------------------------------------------------

    const handleNewMessage = async (
      newMessage
    ) => {
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

      const currentConversation =
        Number(
          conversationRef.current
            ?.id_percakapan
        );

      const currentSelected =
        Number(
          selectedConversationRef.current
        );

      // ==================================================
      // CUSTOMER
      // ==================================================

      if (!isPetugas) {
        if (
          currentConversation &&
          incomingConversation !==
            currentConversation
        ) {
          return;
        }

        appendMessage(
          newMessage
        );

        scrollToBottom();

        return;
      }

      // ==================================================
      // PETUGAS
      // ==================================================

      const isCurrentConversation =
        (
          currentSelected &&
          currentSelected ===
            incomingConversation
        ) ||
        (
          currentConversation &&
          currentConversation ===
            incomingConversation
        );

      // --------------------------------------------------
      // UPDATE LIST CUSTOMER
      // --------------------------------------------------

      setChats((previous) => {
        const exists =
          previous.some(
            (item) =>
              Number(
                item.id_percakapan
              ) ===
              incomingConversation
          );

        if (!exists) {
          return previous;
        }

        return previous.map(
          (item) => {
            if (
              Number(
                item.id_percakapan
              ) !==
              incomingConversation
            ) {
              return item;
            }

            return {
              ...item,

              pesan_terakhir:
                newMessage.pesan,

              waktu_terakhir:
                newMessage.created_at,

              unread_count:
                isCurrentConversation
                  ? 0
                  : Number(
                      item.unread_count ||
                      0
                    ) + 1,
            };
          }
        );
      });

      // --------------------------------------------------
      // JIKA CONVERSATION BELUM ADA
      // --------------------------------------------------

      const conversationExists =
        chats.some(
          (item) =>
            Number(
              item.id_percakapan
            ) ===
            incomingConversation
        );

      if (!conversationExists) {
        try {
          const result =
            await getPetugasChats(
              id_user
            );

          if (
            Array.isArray(
              result?.data
            )
          ) {
            setChats(
              result.data
            );
          }
        } catch (err) {
          console.error(
            "Refresh petugas chats:",
            err
          );
        }
      }

      // --------------------------------------------------
      // UPDATE CURRENT CHAT
      // --------------------------------------------------

      if (isCurrentConversation) {
        appendMessage(
          newMessage
        );

        if (
          Number(
            newMessage.id_pengirim
          ) !==
          Number(id_user)
        ) {
          try {
            await markChatAsRead(
              id_user,
              incomingConversation
            );
          } catch (err) {
            console.error(
              "Mark chat read:",
              err
            );
          }
        }

        scrollToBottom();
      }
    };

    socket.on(
      "connect",
      handleConnect
    );

    socket.on(
      "disconnect",
      handleDisconnect
    );

    socket.on(
      "connect_error",
      handleConnectError
    );

    socket.on(
      "new_message",
      handleNewMessage
    );

    // Socket mungkin sudah connect
    // sebelum listener terpasang.

    if (socket.connected) {
      handleConnect();
    }

    // --------------------------------------------------
    // CLEANUP
    // --------------------------------------------------

    return () => {
      socket.off(
        "connect",
        handleConnect
      );

      socket.off(
        "disconnect",
        handleDisconnect
      );

      socket.off(
        "connect_error",
        handleConnectError
      );

      socket.off(
        "new_message",
        handleNewMessage
      );

      socket.disconnect();

      socketRef.current = null;
    };

    // Jangan masukkan conversation /
    // selected ke dependency agar socket
    // tidak dibuat ulang setiap klik chat.

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    id_user,
    isPetugas,
  ]);

  // ====================================================
  // JOIN CURRENT CONVERSATION
  // ====================================================

  useEffect(() => {
    const socket =
      socketRef.current;

    const idPercakapan =
      Number(
        conversation?.id_percakapan
      );

    if (
      !socket ||
      !idPercakapan
    ) {
      return;
    }

    if (socket.connected) {
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
      if (socket.connected) {
        socket.emit(
          "leave_conversation",
          idPercakapan
        );
      }

      socket.off(
        "connect",
        handleConnect
      );
    };
  }, [
    conversation?.id_percakapan,
  ]);

  // ====================================================
  // AUTO SCROLL
  // ====================================================

  useEffect(() => {
    scrollToBottom();
  }, [
    messages.length,
  ]);

  // ====================================================
  // SEND MESSAGE
  // ====================================================

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

      // --------------------------------------------------
      // SOCKET AKAN MENAMBAHKAN PESAN
      // --------------------------------------------------
      //
      // Jika socket sedang disconnect,
      // tambahkan dari response API
      // sebagai fallback.
      // --------------------------------------------------

      if (
        !socketRef.current ||
        !socketRef.current.connected
      ) {
        appendMessage(
          sentMessage
        );
      }

      setMessage("");

      scrollToBottom();

      // --------------------------------------------------
      // UPDATE PETUGAS LIST
      // --------------------------------------------------

      if (isPetugas) {
        setChats((previous) =>
          previous.map((item) => {
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
                  sentMessage?.created_at ||
                  new Date().toISOString(),

                unread_count: 0,
              };
            }

            return item;
          })
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

  // ====================================================
  // ENTER
  // ====================================================

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

  // ====================================================
  // MOBILE BACK
  // ====================================================

  const handleMobileBack = () => {
    if (isPetugas) {
      setShowConversationList(true);
      return;
    }

    navigate(-1);
  };

  // ====================================================
  // INVALID USER
  // ====================================================

  if (!id_user) {
    return (
      <div
        className="
          w-full
          min-h-[420px]
          rounded-2xl
          border
          border-red-500/20
          bg-[#111111]
          flex
          items-center
          justify-center
          p-6
        "
      >
        <p className="text-red-400 text-sm">
          Data pengguna tidak ditemukan.
        </p>
      </div>
    );
  }

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div
      className="
        w-full
        h-[calc(100dvh-205px)]
        min-h-[500px]
        max-h-[760px]
        min-w-0
      "
    >
      <div
        className="
          w-full
          h-full
          min-w-0
          rounded-2xl
          sm:rounded-3xl
          border
          border-[#D4AF37]/20
          bg-[#111111]
          overflow-hidden
          shadow-[0_20px_70px_rgba(0,0,0,.35)]
        "
      >
        {/* ==================================================
            PETUGAS
            DESKTOP: LIST + CHAT
            MOBILE: LIST ATAU CHAT
        ================================================== */}

        {isPetugas ? (
          <div
            className="
              w-full
              h-full
              min-w-0
              flex
            "
          >
            {/* ==================================================
                CUSTOMER LIST
            ================================================== */}

            <aside
              className={`
                w-full
                lg:w-[310px]
                shrink-0
                bg-[#151515]
                border-r
                border-white/10
                flex
                flex-col
                min-h-0
                ${
                  showConversationList
                    ? "flex"
                    : "hidden lg:flex"
                }
              `}
            >
              {/* LIST HEADER */}

              <div
                className="
                  shrink-0
                  px-4
                  sm:px-5
                  py-4
                  border-b
                  border-white/10
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >
                  <div className="min-w-0">
                    <p
                      className="
                        text-[#D4AF37]
                        text-[9px]
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

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        mt-1
                      "
                    >
                      <span
                        className={`
                          w-2
                          h-2
                          rounded-full
                          shrink-0
                          ${
                            connected
                              ? "bg-green-500"
                              : "bg-yellow-500"
                          }
                        `}
                      />

                      <span
                        className="
                          text-[10px]
                          text-gray-500
                        "
                      >
                        {connected
                          ? "Realtime aktif"
                          : "Menghubungkan..."}
                      </span>
                    </div>
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
                      shrink-0
                    "
                    aria-label="Kembali ke dashboard"
                  >
                    <FaArrowLeft />
                  </button>
                </div>
              </div>

              {/* LIST */}

              <div
                className="
                  flex-1
                  min-h-0
                  overflow-y-auto
                  user-no-scrollbar
                "
              >
                {loading &&
                  chats.length === 0 && (
                    <div
                      className="
                        p-5
                        text-sm
                        text-gray-500
                      "
                    >
                      Memuat chat...
                    </div>
                  )}

                {!loading &&
                  chats.length === 0 && (
                    <div
                      className="
                        p-8
                        text-center
                        text-gray-500
                      "
                    >
                      <FaComments
                        className="
                          mx-auto
                          text-3xl
                          text-[#D4AF37]/40
                          mb-3
                        "
                      />

                      <p className="text-sm">
                        Belum ada percakapan.
                      </p>
                    </div>
                  )}

                {chats.map((chat) => {
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
                        py-3.5
                        border-b
                        border-white/5
                        transition
                        ${
                          active
                            ? "bg-[#D4AF37]/10"
                            : "hover:bg-white/[0.03]"
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
                        <div
                          className="
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
                            shrink-0
                          "
                        >
                          <FaUser />
                        </div>

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
                              {chat.nama_pelanggan ||
                                "Pelanggan"}
                            </p>

                            {chat.waktu_terakhir && (
                              <span
                                className="
                                  text-[9px]
                                  text-gray-600
                                  whitespace-nowrap
                                  shrink-0
                                "
                              >
                                {formatTime(
                                  chat.waktu_terakhir
                                )}
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
                            {chat.pesan_terakhir ||
                              "Belum ada pesan"}
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
                })}
              </div>
            </aside>

            {/* ==================================================
                CHAT DETAIL PETUGAS
            ================================================== */}

            <section
              className={`
                flex-1
                min-w-0
                min-h-0
                flex
                flex-col
                bg-[#141414]
                ${
                  showConversationList
                    ? "hidden lg:flex"
                    : "flex"
                }
              `}
            >
              {!conversation ? (
                <div
                  className="
                    flex-1
                    flex
                    flex-col
                    items-center
                    justify-center
                    text-center
                    px-6
                  "
                >
                  <FaComments
                    className="
                      text-4xl
                      text-[#D4AF37]/40
                      mb-4
                    "
                  />

                  <h2
                    className="
                      text-lg
                      sm:text-xl
                      font-semibold
                    "
                  >
                    Chat Pelanggan
                  </h2>

                  <p
                    className="
                      text-sm
                      text-gray-500
                      mt-2
                      max-w-md
                    "
                  >
                    Pilih pelanggan untuk
                    melihat dan membalas
                    percakapan.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setShowConversationList(
                        true
                      )
                    }
                    className="
                      lg:hidden
                      mt-5
                      px-4
                      py-2.5
                      rounded-xl
                      border
                      border-[#D4AF37]/20
                      text-[#D4AF37]
                      text-sm
                    "
                  >
                    Lihat Pelanggan
                  </button>
                </div>
              ) : (
                <>
                  {/* HEADER */}

                  <div
                    className="
                      shrink-0
                      px-4
                      sm:px-5
                      py-3
                      sm:py-4
                      border-b
                      border-white/10
                      bg-[#151515]
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <button
                      type="button"
                      onClick={
                        handleMobileBack
                      }
                      className="
                        lg:hidden
                        w-9
                        h-9
                        rounded-full
                        border
                        border-[#D4AF37]/20
                        text-[#D4AF37]
                        flex
                        items-center
                        justify-center
                        shrink-0
                      "
                      aria-label="Kembali ke daftar pelanggan"
                    >
                      <FaArrowLeft />
                    </button>

                    <div
                      className="
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
                        shrink-0
                      "
                    >
                      <FaUser />
                    </div>

                    <div className="min-w-0">
                      <p
                        className="
                          font-semibold
                          text-sm
                          sm:text-base
                          truncate
                        "
                      >
                        {conversation.nama_pelanggan ||
                          "Pelanggan"}
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
                          className={`
                            w-2
                            h-2
                            rounded-full
                            shrink-0
                            ${
                              connected
                                ? "bg-green-500"
                                : "bg-yellow-500"
                            }
                          `}
                        />

                        <span
                          className="
                            text-[10px]
                            text-gray-500
                          "
                        >
                          {connected
                            ? "Realtime aktif"
                            : "Menghubungkan..."}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ERROR */}

                  {error && (
                    <div
                      className="
                        mx-4
                        mt-3
                        shrink-0
                        px-4
                        py-3
                        rounded-xl
                        bg-red-500/10
                        border
                        border-red-500/20
                        text-red-400
                        text-sm
                      "
                    >
                      {error}
                    </div>
                  )}

                  {/* MESSAGES */}

                  <div
                    className="
                      flex-1
                      min-h-0
                      overflow-y-auto
                      user-no-scrollbar
                      px-3
                      sm:px-4
                      md:px-6
                      py-4
                      sm:py-5
                    "
                  >
                    <div
                      className="
                        min-h-full
                        flex
                        flex-col
                        gap-3
                      "
                    >
                      {loading &&
                        messages.length === 0 && (
                          <div
                            className="
                              flex-1
                              flex
                              items-center
                              justify-center
                              text-gray-500
                            "
                          >
                            Memuat percakapan...
                          </div>
                        )}

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
                            "
                          >
                            <FaComments
                              className="
                                text-3xl
                                text-[#D4AF37]/40
                                mb-3
                              "
                            />

                            <p className="text-sm">
                              Belum ada pesan.
                            </p>
                          </div>
                        )}

                      {messages.map(
                        (item) => {
                          const mine =
                            Number(
                              item.id_pengirim
                            ) ===
                            Number(id_user);

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
                                  max-w-[88%]
                                  sm:max-w-[75%]
                                  md:max-w-[65%]
                                  flex
                                  flex-col
                                  ${
                                    mine
                                      ? "items-end"
                                      : "items-start"
                                  }
                                `}
                              >
                                <div
                                  className={`
                                    px-3
                                    sm:px-4
                                    py-2.5
                                    sm:py-3
                                    rounded-2xl
                                    ${
                                      mine
                                        ? "bg-[#D4AF37] text-black rounded-br-md"
                                        : "bg-[#202020] text-white border border-white/5 rounded-bl-md"
                                    }
                                  `}
                                >
                                  {!mine && (
                                    <p
                                      className="
                                        text-[#D4AF37]
                                        text-xs
                                        font-semibold
                                        mb-1
                                      "
                                    >
                                      {item.nama_pengirim ||
                                        "Pelanggan"}
                                    </p>
                                  )}

                                  <p
                                    className="
                                      whitespace-pre-wrap
                                      break-words
                                      text-sm
                                      leading-6
                                    "
                                  >
                                    {item.pesan}
                                  </p>

                                  <p
                                    className={`
                                      text-[10px]
                                      mt-1
                                      text-right
                                      ${
                                        mine
                                          ? "text-black/60"
                                          : "text-gray-500"
                                      }
                                    `}
                                  >
                                    {formatTime(
                                      item.created_at
                                    )}
                                  </p>
                                </div>

                                {mine && (
                                  <span
                                    className="
                                      text-[9px]
                                      text-[#D4AF37]
                                      mt-1
                                    "
                                  >
                                    {item.status ===
                                    "Dibaca"
                                      ? "Dibaca"
                                      : "Terkirim"}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        }
                      )}

                      <div
                        ref={bottomRef}
                        className="h-px shrink-0"
                      />
                    </div>
                  </div>

                  {/* INPUT */}

                  <form
                    onSubmit={handleSend}
                    className="
                      shrink-0
                      border-t
                      border-white/10
                      bg-[#151515]
                      p-2.5
                      sm:p-3
                      md:p-4
                    "
                  >
                    <div
                      className="
                        flex
                        items-end
                        gap-2
                        sm:gap-3
                      "
                    >
                      <textarea
                        value={message}
                        onChange={(event) =>
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
                          sending
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
                          !message.trim()
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
                </>
              )}
            </section>
          </div>
        ) : (
          /* ==================================================
             CUSTOMER CHAT
          ================================================== */

          <section
            className="
              w-full
              h-full
              min-w-0
              flex
              flex-col
              bg-[#141414]
            "
          >
            {/* HEADER */}

            <div
              className="
                shrink-0
                px-4
                sm:px-5
                py-3
                sm:py-4
                border-b
                border-white/10
                flex
                items-center
                gap-3
              "
            >
              <button
                type="button"
                onClick={
                  handleMobileBack
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
                  shrink-0
                "
                aria-label="Kembali"
              >
                <FaArrowLeft />
              </button>

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

              <div className="min-w-0">
                <p
                  className="
                    font-semibold
                    text-sm
                    sm:text-base
                    truncate
                  "
                >
                  Petugas Handu Atelier
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
                    className={`
                      w-2
                      h-2
                      rounded-full
                      shrink-0
                      ${
                        connected
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }
                    `}
                  />

                  <span
                    className="
                      text-[10px]
                      sm:text-xs
                      text-gray-500
                    "
                  >
                    {connected
                      ? "Realtime aktif"
                      : "Menghubungkan..."}
                  </span>
                </div>
              </div>
            </div>

            {/* ERROR */}

            {error && (
              <div
                className="
                  mx-4
                  mt-3
                  shrink-0
                  px-4
                  py-3
                  rounded-xl
                  bg-red-500/10
                  border
                  border-red-500/20
                  text-red-400
                  text-sm
                "
              >
                {error}
              </div>
            )}

            {/* MESSAGE AREA */}

            <div
              className="
                flex-1
                min-h-0
                overflow-y-auto
                user-no-scrollbar
                px-3
                sm:px-4
                md:px-6
                py-4
                sm:py-5
              "
            >
              <div
                className="
                  min-h-full
                  flex
                  flex-col
                  gap-3
                "
              >
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

                        <p className="text-sm">
                          Memuat percakapan...
                        </p>
                      </div>
                    </div>
                  )}

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
                      "
                    >
                      <FaComments
                        className="
                          text-4xl
                          text-[#D4AF37]/40
                          mb-4
                        "
                      />

                      <p className="text-sm">
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

                {messages.map(
                  (item) => {
                    const mine =
                      Number(
                        item.id_pengirim
                      ) ===
                      Number(id_user);

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
                            max-w-[88%]
                            sm:max-w-[75%]
                            md:max-w-[65%]
                            flex
                            flex-col
                            ${
                              mine
                                ? "items-end"
                                : "items-start"
                            }
                          `}
                        >
                          <div
                            className={`
                              px-3
                              sm:px-4
                              py-2.5
                              sm:py-3
                              rounded-2xl
                              ${
                                mine
                                  ? "bg-[#D4AF37] text-black rounded-br-md"
                                  : "bg-[#202020] text-white border border-white/5 rounded-bl-md"
                              }
                            `}
                          >
                            {!mine && (
                              <p
                                className="
                                  text-[#D4AF37]
                                  text-xs
                                  font-semibold
                                  mb-1
                                "
                              >
                                {item.nama_pengirim ||
                                  "Petugas"}
                              </p>
                            )}

                            <p
                              className="
                                whitespace-pre-wrap
                                break-words
                                text-sm
                                leading-6
                              "
                            >
                              {item.pesan}
                            </p>
                          </div>

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                              mt-1
                              px-1
                            "
                          >
                            <span
                              className="
                                text-[9px]
                                sm:text-[10px]
                                text-gray-600
                              "
                            >
                              {formatDate(
                                item.created_at
                              )}{" "}
                              {formatTime(
                                item.created_at
                              )}
                            </span>

                            {mine && (
                              <span
                                className="
                                  text-[9px]
                                  sm:text-[10px]
                                  text-[#D4AF37]
                                "
                              >
                                {item.status ===
                                "Dibaca"
                                  ? "Dibaca"
                                  : "Terkirim"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}

                <div
                  ref={bottomRef}
                  className="h-px shrink-0"
                />
              </div>
            </div>

            {/* INPUT */}

            <form
              onSubmit={handleSend}
              className="
                shrink-0
                p-2.5
                sm:p-3
                md:p-4
                border-t
                border-white/10
                bg-[#151515]
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
                  value={message}
                  onChange={(event) =>
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
          </section>
        )}
      </div>
    </div>
  );
}

export default ChatPage;