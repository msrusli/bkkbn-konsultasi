import "./globals.css";

export const metadata = { title: "Konsultasi AI" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-gray-50 text-gray-800">
        {/* <header className="sticky top-0 z-10 bg-white border-b">
          <nav className="mx-auto max-w-12xl px-4 py-3 flex items-center justify-between">
            <div className="font-semibold">
              KEMDIKBUD<span className="text-blue-600">.AI</span>
            </div>
            <a
              href="/konsultasi"
              className="px-3 py-2 rounded-xl bg-blue-600 text-white"
            >
              Konsultasi
            </a>
          </nav>
        </header> */}
        {/* <main className="mx-auto max-w-12xl px-4 py-6">{children}</main> */}
        <main>{children}</main>
      </body>
    </html>
  );
}
