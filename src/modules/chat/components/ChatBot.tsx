"use client";
import React, { useState, useRef, useEffect } from "react";
import chatData from "../data/chatbot.json";

type Persona = "Bina" | "Kina";
interface Message {
  id: string;
  from: "user" | "bot";
  text: string;
  timestamp: string;
  liked?: boolean;
  disliked?: boolean;
}

// Interface untuk chat history
interface ChatHistoryItem {
  id: number;
  title: string;
  time: string;
  messages: Message[];
  persona: Persona;
}

// fungsi fuzzy similarity sederhana
function similarity(s1: string, s2: string): number {
  if (!s1.length || !s2.length) return 0;
  const pairs = (str: string) =>
    str
      .toLowerCase()
      .split("")
      .slice(0, -1)
      .map((_, i) => str[i] + str[i + 1]);
  const s1Pairs = pairs(s1);
  const s2Pairs = pairs(s2);
  const intersection = s1Pairs.filter((p) => s2Pairs.includes(p)).length;
  return (2 * intersection) / (s1Pairs.length + s2Pairs.length);
}

// Fungsi untuk mendapatkan waktu sekarang dalam format HH:MM
const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function Chatbot(): JSX.Element {
  const [persona, setPersona] = useState<Persona | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Fungsi untuk menangani like/dislike
  const handleReaction = (messageId: string, reaction: "like" | "dislike") => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          if (reaction === "like") {
            return { ...msg, liked: !msg.liked, disliked: false };
          } else {
            return { ...msg, disliked: !msg.disliked, liked: false };
          }
        }
        return msg;
      })
    );
  };

  // Fungsi untuk memulai chat baru
  const startNewChat = () => {
    if (persona && messages.length > 0) {
      // Simpan chat sebelumnya ke history
      const newChat: ChatHistoryItem = {
        id: Date.now(),
        title:
          messages[0]?.text.substring(0, 30) +
            (messages[0]?.text.length > 30 ? "..." : "") ||
          `Chat dengan ${persona}`,
        time: "Hari ini",
        messages: [...messages],
        persona: persona,
      };

      setChatHistory((prev) => {
        // Hapus chat sebelumnya dengan ID yang sama jika ada (untuk update)
        const filteredHistory = prev.filter((chat) => chat.id !== newChat.id);
        return [newChat, ...filteredHistory];
      });
    }

    // Reset state untuk chat baru
    setPersona(null);
    setMessages([]);
    setInput("");
    setActiveChatId(null);
    setIsTyping(false);
  };

  // Fungsi untuk memuat chat history
  const loadChat = (chatId: number) => {
    const chat = chatHistory.find((chat) => chat.id === chatId);
    if (chat) {
      setPersona(chat.persona);
      setMessages(chat.messages);
      setActiveChatId(chatId);
      setIsTyping(false);
    }
  };

  const sendMessage = () => {
    if (!input.trim() || !persona) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      from: "user",
      text: input,
      timestamp: getCurrentTime(),
    };
    setMessages((prev) => [...prev, userMsg]);

    // fuzzy match dari chatbot.json
    const lower = input.toLowerCase();
    let bestAnswer = "Maaf, saya belum punya jawaban untuk itu.";
    let highest = 0;

    // Menggunakan data dari file JSON
    chatData.forEach((qa: { question: string; answer: string }) => {
      const score = similarity(lower, qa.question.toLowerCase());
      if (score > highest) {
        highest = score;
        bestAnswer = qa.answer;
      }
    });

    const botMsg: Message = {
      id: crypto.randomUUID(),
      from: "bot",
      text:
        highest > 0.3
          ? bestAnswer
          : "Maaf, saya belum punya jawaban untuk itu.",
      timestamp: getCurrentTime(),
    };

    // Tampilkan efek typing
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);

      // Update chat history jika ini adalah chat yang sedang aktif
      if (activeChatId) {
        setChatHistory((prev) =>
          prev.map((chat) =>
            chat.id === activeChatId
              ? {
                  ...chat,
                  messages: [
                    ...prev.find((c) => c.id === activeChatId)!.messages,
                    userMsg,
                    botMsg,
                  ],
                }
              : chat
          )
        );
      }
    }, 1500); // Delay untuk simulasi typing

    setInput("");
  };

  // Data history chat (contoh)
  const sampleChatHistory: ChatHistoryItem[] = [
    {
      id: 1,
      title: "Bagaimana cara mendaftar",
      time: "Hari ini",
      messages: [],
      persona: "Bina",
    },
    {
      id: 2,
      title: "Cara menjaga komunikasi",
      time: "Hari ini",
      messages: [],
      persona: "Kina",
    },
    {
      id: 5,
      title: "Cara menyelesaikan konflik",
      time: "Kemarin",
      messages: [],
      persona: "Bina",
    },
    {
      id: 6,
      title: "Pandangan para orang tua",
      time: "7 hari yang lalu",
      messages: [],
      persona: "Kina",
    },
  ];

  // Gabungkan history dari state dengan sample data
  const allChatHistory = [...chatHistory, ...sampleChatHistory];

  // Kelompokkan history berdasarkan waktu
  const groupChatsByTime = () => {
    const groups: { [key: string]: typeof allChatHistory } = {};
    allChatHistory.forEach((chat) => {
      if (!groups[chat.time]) {
        groups[chat.time] = [];
      }
      groups[chat.time].push(chat);
    });
    return groups;
  };

  const chatGroups = groupChatsByTime();

  return (
    <div className="bg-gray-100 font-sans text-gray-800 min-h-screen flex items-start justify-center p-0">
      <div className="w-full max-w-12xl flex h-screen">
        {/* Sidebar */}
        <aside
          className="w-80 text-white shadow-lg p-6 flex flex-col justify-between"
          style={{ backgroundColor: "rgb(59, 147, 193)", opacity: 1 }}
        >
          <div>
            <div className="flex items-center gap-3 mb-6 mt-1">
              <img src="./bkkbn.png" alt="Logo KEMDIKBUD" />
            </div>

            <nav className="space-y-2">
              <a
                href="https://prototypebkkbn.framer.website/dashboard-beranda"
                className="block px-3 py-2 rounded-lg hover:bg-yellow-500 hover:text-black transition-colors"
              >
                Beranda
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded-lg bg-yellow-500 text-black"
              >
                Konsultasi
              </a>
              <a
                href="https://prototypebkkbn.framer.website/dashboard-ecourse-siap-manten"
                className="block px-3 py-2 rounded-lg hover:bg-yellow-500 hover:text-black transition-colors"
              >
                E-Course
              </a>
              <a
                href="https://prototypebkkbn.framer.website/dashboard-bisik"
                className="block px-3 py-2 rounded-lg hover:bg-yellow-500 hover:text-black transition-colors"
              >
                Bisik Forum
              </a>
              <a
                href="https://prototypebkkbn.framer.website/dashboard-event-tersedia"
                className="block px-3 py-2 rounded-lg hover:bg-yellow-500 hover:text-black transition-colors"
              >
                Event
              </a>
              <a
                href="https://prototypebkkbn.framer.website/dashboard-news"
                className="block px-3 py-2 rounded-lg hover:bg-yellow-500 hover:text-black transition-colors"
              >
                Berita Terkini
              </a>
              <a
                href="https://prototypebkkbn.framer.website/dashboard-setting-detail"
                className="block px-3 py-2 rounded-lg hover:bg-yellow-500 hover:text-black transition-colors"
              >
                Pengaturan
              </a>
            </nav>
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                F
              </div>
              <div className="text-sm">
                <div className="font-medium">Fitri Ariani</div>
                <div className="text-xs opacity-90">fitriariani@gmail.com</div>
              </div>
            </div>
            <p className="text-xs mt-4 opacity-80 text-center">
              Copyright © 2025 All rights reserved.
            </p>
          </div>
        </aside>

        {/* Chat List (history) */}
        <section className="w-80 bg-white shadow-lg p-4 overflow-y-auto">
          <button
            onClick={startNewChat}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 mb-4 transition-colors"
          >
            + Chat Baru
          </button>

          {Object.entries(chatGroups).map(([time, chats]) => (
            <div key={time} className="mb-6">
              <p className="text-sm font-semibold mb-2 text-gray-500">{time}</p>
              <ul className="space-y-2">
                {chats.map((chat) => (
                  <li
                    key={chat.id}
                    className={`p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                      activeChatId === chat.id
                        ? "bg-blue-50 border-blue-200"
                        : ""
                    }`}
                    onClick={() => loadChat(chat.id)}
                  >
                    <div className="font-medium">{chat.title}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Chat dengan {chat.persona}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Chat Panel */}
        <main className="flex-1 bg-white shadow-lg p-6 flex flex-col">
          {!persona ? (
            <>
              <header className="mb-6">
                <h2 className="text-xl font-bold">Chatbot AI</h2>
                <p className="text-sm text-gray-500">
                  Siapa yang ingin Anda temui hari ini?
                </p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="border rounded-xl p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                  <div className="w-20 h-20 bg-blue-100 rounded-full mb-3 flex items-center justify-center">
                    <span className="text-2xl">👨‍🎓</span>
                  </div>
                  <h4 className="font-semibold">Bina</h4>
                  <p className="text-sm text-gray-500">
                    Hai, saya Bina! Siap bantu jawab semua tentang pendidikan 👨‍🎓
                  </p>
                  <button
                    onClick={() => setPersona("Bina")}
                    className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Ayo, bareng Bina!
                  </button>
                </div>

                <div className="border rounded-xl p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                  <div className="w-20 h-20 bg-pink-100 rounded-full mb-3 flex items-center justify-center">
                    <span className="text-2xl">👩‍👩‍👧‍👦</span>
                  </div>
                  <h4 className="font-semibold">Kina</h4>
                  <p className="text-sm text-gray-500">
                    Hai, saya Kina! Siap bantu wujudkan keluarga tangguh 👩‍👩‍👧‍👦
                  </p>
                  <button
                    onClick={() => setPersona("Kina")}
                    className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Yuk, bareng Kina!
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={startNewChat}
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <span className="mr-1">←</span> Kembali ke Pilihan
                </button>
                <h3 className="text-lg font-semibold">Chat dengan {persona}</h3>
              </div>
              <div className="flex-1 overflow-y-auto mb-4 border rounded-xl p-4 bg-gray-50 min-h-[300px]">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p>Mulai percakapan dengan {persona}</p>
                    <p className="text-sm mt-2">
                      {persona === "Bina"
                        ? "Saya siap membantu semua tentang pendidikan"
                        : "Saya siap membantu mewujudkan keluarga tangguh"}
                    </p>
                  </div>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className={`mb-4 flex ${
                        m.from === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs ${
                          m.from === "user" ? "ml-auto" : ""
                        }`}
                      >
                        <div className="flex items-end gap-2">
                          {m.from === "bot" && (
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white flex-shrink-0">
                              {persona === "Bina" ? "B" : "K"}
                            </div>
                          )}
                          <div
                            className={`px-4 py-3 rounded-2xl ${
                              m.from === "user"
                                ? "bg-blue-500 text-white rounded-br-md"
                                : "bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-sm"
                            }`}
                          >
                            {m.text}
                          </div>
                        </div>
                        <div
                          className={`flex items-center mt-1 ${
                            m.from === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          <span className="text-xs text-gray-500 mr-2">
                            {m.timestamp}
                          </span>

                          {m.from === "bot" && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleReaction(m.id, "like")}
                                className={`p-1 rounded-full transition-colors ${
                                  m.liked
                                    ? "bg-green-100 text-green-600"
                                    : "text-gray-400 hover:text-green-500 hover:bg-green-50"
                                }`}
                                title="Suka jawaban ini"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleReaction(m.id, "dislike")}
                                className={`p-1 rounded-full transition-colors ${
                                  m.disliked
                                    ? "bg-red-100 text-red-600"
                                    : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                                }`}
                                title="Tidak suka jawaban ini"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex mb-4 justify-start">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white flex-shrink-0 mr-2">
                      {persona === "Bina" ? "B" : "K"}
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-white border border-gray-200 rounded-bl-md shadow-sm">
                      <div className="flex space-x-1.5">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={bottomRef}></div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder={`Tanyakan sesuatu ke ${persona}...`}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isTyping}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isTyping}
                  className="px-4 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  {isTyping ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    "Kirim"
                  )}
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
