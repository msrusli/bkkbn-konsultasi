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
  containsHTML?: boolean;
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

// Fungsi untuk mendeteksi HTML
const containsHTML = (text: string): boolean => {
  return /<[a-z][\s\S]*>/i.test(text);
};

export default function Chatbot(): JSX.Element {
  const [persona, setPersona] = useState<Persona | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Inisialisasi Speech Recognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "id-ID"; // Bahasa Indonesia

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Fungsi untuk memulai/penghentian voice typing
  const toggleVoiceTyping = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Error starting voice recognition:", error);
        setIsListening(false);
      }
    }
  };

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
        const filteredHistory = prev.filter((chat) => chat.id !== newChat.id);
        return [newChat, ...filteredHistory];
      });
    }

    setPersona(null);
    setMessages([]);
    setInput("");
    setActiveChatId(null);
    setIsTyping(false);
    setIsListening(false);
  };

  // Fungsi untuk memuat chat history
  const loadChat = (chatId: number) => {
    const chat = chatHistory.find((chat) => chat.id === chatId);
    if (chat) {
      setPersona(chat.persona);
      setMessages(chat.messages);
      setActiveChatId(chatId);
      setIsTyping(false);
      setIsListening(false);
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

    const lower = input.toLowerCase();
    let bestAnswer = "Maaf, saya belum punya jawaban untuk itu.";
    let highest = 0;

    chatData.forEach((qa: { question: string; answer: string }) => {
      const score = similarity(lower, qa.question.toLowerCase());
      if (score > highest) {
        highest = score;
        bestAnswer = qa.answer;
      }
    });

    const hasHTML = containsHTML(bestAnswer);

    const botMsg: Message = {
      id: crypto.randomUUID(),
      from: "bot",
      text:
        highest > 0.3
          ? bestAnswer
          : "Maaf, saya belum punya jawaban untuk itu.",
      timestamp: getCurrentTime(),
      containsHTML: highest > 0.3 && hasHTML,
    };

    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);

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
    }, 1500);

    setInput("");
  };

  // Komponen untuk merender pesan
  const MessageContent = ({ message }: { message: Message }) => {
    if (message.containsHTML) {
      return (
        <div
          className="message-html-content"
          dangerouslySetInnerHTML={{ __html: message.text }}
        />
      );
    }
    return <div className="message-text-content">{message.text}</div>;
  };

  // Data history chat
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
    {
      id: 7,
      title: "Apakah Program KB Berlaku",
      time: "7 hari yang lalu",
      messages: [],
      persona: "Kina",
    },
  ];

  const allChatHistory = [...chatHistory, ...sampleChatHistory];

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

        {/* Chat List */}
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
          <div className="text-sm mt-20">
            <a
              href="https://wa.me/081252000540"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.63.42 3.2.98 4.6l-1.05 3.86 3.93-1.03c1.39.76 2.97 1.15 4.6 1.15 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm3.87 11.2a1.07 1.07 0 01-.25.86c-.08.1-.47.56-.66.68-.2.12-.39.18-.56.23-.19.05-.38.03-.58-.1-.19-.15-.76-.84-.91-.98-.15-.15-.3-.21-.5-.07-.19.15-.49.5-.66.68-.17.18-.34.25-.52.25-.19 0-1.15-.44-2.18-1.35-1.5-1.32-2.5-2.92-2.8-3.4-.3-.49-.03-.76.1-.88.1-.1.25-.2.34-.33.09-.12.19-.3.26-.45.07-.15.03-.28-.01-.39-.04-.1-.38-.93-.52-1.27-.14-.35-.29-.29-.49-.29-.19 0-.41-.03-.6-.03-.19 0-.52.12-.76.34-.23.23-.88.86-.88 2.09 0 1.23.9 2.4 1.03 2.58.14.18 1.77 2.66 4.29 3.73 2.06.87 2.45.69 2.9 1.1.4.38.64.64.84.81.2.19.15.25.1.41-.05.15-.35.5-.6.64-.25.15-.49.23-.6.3-.12.08-.24.16-.36.25l-.26.2c-.10.08-.23.15-.34.23z" />
              </svg>
              Sahabat Konsultasi Anda!
            </a>
          </div>
        </section>

        {/* Chat Panel */}
        <main className="flex-1 bg-white shadow-lg p-6 flex flex-col">
          {!persona ? (
            <>
              <header className="mb-6 ">
                <div className="flex items-center justify-center gap-3 mb-6 mt-6 ">
                  <img src="./chatbot.png" alt="Logo KEMDIKBUD" />
                </div>
                <p
                  className="text-sm text-gray-500 text-center font-semibold"
                  style={{ fontSize: "18px" }}
                >
                  Siapa yang ingin Anda temui hari ini?
                </p>
                <p
                  className="text-sm text-gray-500 text-center font-semibold"
                  style={{ fontSize: "18px" }}
                >
                  Pilih pendamping virtual yang sesuai dengan preferensi Anda:
                </p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="border rounded-xl p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-6  w-24 h-24 mt-6 ">
                    <img src="./bina.png" alt="Logo KEMDIKBUD" />
                  </div>
                  <h4 className="font-semibold">Bina</h4>
                  <p className="text-sm text-gray-500">
                    Hai, saya Bina! Siap bantu jawab semua tentang pra-nikah
                  </p>
                  <button
                    onClick={() => setPersona("Bina")}
                    className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Ayo, bareng Bina!
                  </button>
                </div>

                <div className="border rounded-xl p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-6  w-24 h-24 mt-6 ">
                    <img src="./kina.png" alt="Logo KEMDIKBUD" />
                  </div>

                  <h4 className="font-semibold">Kina</h4>
                  <p className="text-sm text-gray-500">
                    Hai, saya Kina! Siap bantu wujudkan keluarga langgeng
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
                        ? "Hai, saya Bina! Siap bantu jawab semua tentang pra-nikah"
                        : " Hai, saya Kina! Siap bantu wujudkan keluarga langgeng"}
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
                        className={`max-w-3xl ${
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
                            <MessageContent message={m} />
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

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder={`Tanyakan sesuatu ke ${persona}...`}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isTyping}
                />

                {/* Tombol Voice Typing */}
                <button
                  onClick={toggleVoiceTyping}
                  disabled={isTyping}
                  className={`p-3 rounded-lg transition-colors ${
                    isListening
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                  title={
                    isListening ? "Hentikan voice typing" : "Mulai voice typing"
                  }
                >
                  {isListening ? (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>

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
