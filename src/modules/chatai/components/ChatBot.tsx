import React, { useState } from "react";

export default function Chatbot(): JSX.Element {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [activeMenu, setActiveMenu] = useState("Konsultasi");

  const handleNewChat = () => {
    setActiveChat("Chat Baru " + new Date().toLocaleTimeString());
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      console.log("Mengirim pesan:", message);
      setMessage("");
    }
  };

  const chatHistory = [
    { id: 1, title: "Bagaimana cara mendaftar", time: "Hari ini" },
    { id: 2, title: "Cara menjaga komunikasi", time: "Hari ini" },
    { id: 3, title: "Apa saja hal yang perlu dipersiapkan", time: "Hari ini" },
    { id: 4, title: "Menemui hubungan erat", time: "Kemarin" },
    { id: 5, title: "Cara menyelesaikan konflik", time: "Kemarin" },
    { id: 6, title: "Pandangan para orang tua", time: "7 hari yang lalu" },
  ];

  const groupChatsByTime = () => {
    const groups: { [key: string]: typeof chatHistory } = {};
    chatHistory.forEach((chat) => {
      if (!groups[chat.time]) {
        groups[chat.time] = [];
      }
      groups[chat.time].push(chat);
    });
    return groups;
  };

  const chatGroups = groupChatsByTime();

  // Data menu dengan ikon
  const menuItems = [
    { id: 1, name: "Beranda", icon: "🏠" },
    { id: 2, name: "Konsultasi", icon: "💬" },
    { id: 3, name: "E-Course", icon: "📚" },
    { id: 4, name: "Bilik Forum", icon: "👥" },
    { id: 5, name: "Event", icon: "🎉" },
    { id: 6, name: "Berita Terkini", icon: "📰" },
    { id: 7, name: "Pengaturan", icon: "⚙️" },
  ];

  return (
    <div className="bg-gray-100 font-sans text-gray-800 min-h-screen flex items-start justify-center p-0">
      <div className="w-full max-w-7xl flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-[#0b63b7] text-white shadow-lg p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/20 rounded-md flex items-center justify-center font-bold">
                KB
              </div>
              <div>
                <h4 className="font-semibold">KEMDIKBUD</h4>
                <p className="text-sm opacity-90">/BKRGN</p>
              </div>
            </div>

            <nav className="space-y-1">
              {menuItems.map((item) => (
                <a
                  key={item.id}
                  href="#"
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                    activeMenu === item.name
                      ? "bg-white/20"
                      : "hover:bg-[#0a57a0]"
                  }`}
                  onClick={() => setActiveMenu(item.name)}
                >
                  <span className="text-lg mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </a>
              ))}
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
            onClick={handleNewChat}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 mb-4 transition-colors flex items-center justify-center"
          >
            <span className="mr-2">+</span> Chat Baru
          </button>

          {Object.entries(chatGroups).map(([time, chats]) => (
            <div key={time} className="mb-6">
              <p className="text-sm font-semibold mb-2 text-gray-500">{time}</p>
              <ul className="space-y-2">
                {chats.map((chat) => (
                  <li
                    key={chat.id}
                    className={`p-3 rounded-lg border border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors ${
                      activeChat === chat.title
                        ? "bg-blue-50 border-blue-200"
                        : ""
                    }`}
                    onClick={() => setActiveChat(chat.title)}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">💭</span>
                      {chat.title}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Chat Panel */}
        <main className="flex-1 bg-white shadow-lg p-6 flex flex-col">
          <header className="mb-6">
            <h2 className="text-xl font-bold">Chatbot AI</h2>
            <p className="text-sm text-gray-500">
              Siapa yang ingin Anda temui hari ini?
            </p>
          </header>

          {!activeChat ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border rounded-xl p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow hover:border-blue-300">
                <div className="w-20 h-20 bg-blue-100 rounded-full mb-3 flex items-center justify-center">
                  <span className="text-2xl">👨‍🎓</span>
                </div>
                <h4 className="font-semibold mb-1">Bina</h4>
                <p className="text-sm text-gray-500 mb-3">
                  Hai, saya Bina! Siap bantu jawab semua tentang pendidikan
                </p>
                <button
                  onClick={handleNewChat}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Ayo, bareng Bina!
                </button>
              </div>

              <div className="border rounded-xl p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow hover:border-pink-300">
                <div className="w-20 h-20 bg-pink-100 rounded-full mb-3 flex items-center justify-center">
                  <span className="text-2xl">👩‍👩‍👧‍👦</span>
                </div>
                <h4 className="font-semibold mb-1">Kina</h4>
                <p className="text-sm text-gray-500 mb-3">
                  Hai, saya Kina! Siap bantu wujudkan keluarga tangguh
                </p>
                <button
                  onClick={handleNewChat}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Yuk, bareng Kina!
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="border rounded-xl p-4 mb-4 flex-1 flex items-center justify-center text-gray-400 bg-gray-50">
                <div className="text-center">
                  <div className="text-4xl mb-2">💬</div>
                  <p>Percakapan dengan {activeChat}</p>
                  <p className="text-sm mt-2">
                    (Fitur chat akan ditampilkan di sini)
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-3"
              >
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tanyakan sesuatu..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center"
                >
                  <span className="mr-2">✉️</span> Kirim
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
