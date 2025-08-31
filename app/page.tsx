export default function HomePage() {
  return (
    <section className="grid md:grid-cols-2 gap-8 items-center">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Selamat datang 👋</h1>
        <p className="mb-6 text-gray-600">Klik tombol di kanan atas untuk membuka modul Chatbot Konsultasi.</p>
        <a href="/konsultasi" className="inline-block px-5 py-3 rounded-xl bg-blue-600 text-white">Mulai Konsultasi</a>
      </div>
      <div className="hidden md:block justify-self-end opacity-80">
        <div className="w-[520px] h-[300px] bg-gradient-to-br from-blue-100 to-white rounded-3xl shadow"></div>
      </div>
    </section>
  )
}
