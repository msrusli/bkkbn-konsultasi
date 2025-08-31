import React from "react";

export default function Chatbot(): JSX.Element {
  return (
    <div className="bg-gray-100 font-sans text-gray-800 min-h-screen flex items-start justify-center p-0">
      <div className="w-full max-w-7xl flex">
        {/* Sidebar */}
        <aside className="w-64 bg-[#0b63b7] text-white rounded-none shadow-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/20 rounded-md flex items-center justify-center">
                KB
              </div>
              <div>
                <h4 className="font-semibold">KEMDIKBUD</h4>
                <p className="text-sm opacity-90">/BKRGN</p>
              </div>
            </div>

            <nav className="space-y-2">
              <a
                href="#"
                className="block px-3 py-2 rounded-lg hover:bg-white/20"
              >
                Beranda
              </a>
              <a href="#" className="block px-3 py-2 rounded-lg bg-white/20">
                Konsultasi
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded-lg hover:bg-white/20"
              >
                E-Course
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded-lg hover:bg-white/20"
              >
                Bilik Forum
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded-lg hover:bg-white/20"
              >
                Event
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded-lg hover:bg-white/20"
              >
                Berita Terkini
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded-lg hover:bg-white/20"
              >
                Pengaturan
              </a>
            </nav>
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
              <img
                src="https://via.placeholder.com/40"
                alt="avatar"
                className="rounded-full"
              />
              <div className="text-sm">
                <div className="font-medium">Fitri Ariani</div>
                <div className="text-xs opacity-90">fitriariani@gmail.com</div>
              </div>
            </div>
            <p className="text-xs mt-4 opacity-80">
              Copyright © 2025 All right reserved.
            </p>
          </div>
        </aside>

        {/* Chat List */}
        <section className="w-80 bg-white shadow-card p-4 rounded-none">
          <button className="w-full bg-blue-600 text-white rounded-lg py-2 mb-4">
            + Chat Baru
          </button>

          <div>
            <p className="text-sm font-semibold mb-2">Hari ini</p>
            <ul className="space-y-2">
              <li className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
                Bagaimana cara mendaftar
              </li>
              <li className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
                Cara menjaga komunikasi
              </li>
              <li className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
                Apa saja hal yang perlu dipersiapkan
              </li>
            </ul>
          </div>

          <div className="mt-4">
            <p className="text-sm font-semibold mb-2">Kemarin</p>
            <ul className="space-y-2">
              <li className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
                Menemui hubungan erat
              </li>
              <li className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
                Cara menyelesaikan konflik
              </li>
            </ul>
          </div>

          <div className="mt-4">
            <p className="text-sm font-semibold mb-2">7 hari yang lalu</p>
            <ul className="space-y-2">
              <li className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
                Pandangan para orang tua
              </li>
            </ul>
          </div>
        </section>

        {/* Chat Panel */}
        <main className="flex-1 bg-white shadow-card p-6 rounded-none">
          <header className="mb-6">
            <h2 className="text-xl font-bold">Chatbot AI</h2>
            <p className="text-sm text-gray-500">
              Siapa yang ingin Anda temui hari ini?
            </p>
          </header>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="border rounded-xl p-4 flex flex-col items-center text-center">
              <img
                src="https://via.placeholder.com/80"
                alt="Bina"
                className="rounded-full mb-2"
              />
              <h4 className="font-semibold">Bina</h4>
              <p className="text-sm text-gray-500">
                Hai, saya Bina! Siap bantu jawab semua tentang pendidikan 👨‍🎓
              </p>
              <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg">
                Ayo, bareng Bina!
              </button>
            </div>

            <div className="border rounded-xl p-4 flex flex-col items-center text-center">
              <img
                src="https://via.placeholder.com/80"
                alt="Kina"
                className="rounded-full mb-2"
              />
              <h4 className="font-semibold">Kina</h4>
              <p className="text-sm text-gray-500">
                Hai, saya Kina! Siap bantu wujudkan keluarga tangguh 👩‍👩‍👧‍👦
              </p>
              <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg">
                Yuk, bareng Kina!
              </button>
            </div>
          </div>

          <div className="border rounded-xl p-4 mb-4 h-40 flex items-center justify-center text-gray-400">
            Area percakapan (preview)
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Tanyakan sesuatu..."
              className="flex-1 p-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button className="px-4 py-2 bg-green-500 text-white rounded-full">
              Sahabat Konsultasi Anda!
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
