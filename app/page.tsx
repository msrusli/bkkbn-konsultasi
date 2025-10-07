"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // ✅ gunakan useRouter untuk navigasi
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import "../styles/LoginForm.css";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter(); // ✅ inisialisasi router

  const handleLogin = (e) => {
    e.preventDefault(); // ✅ mencegah reload halaman
    // di sini bisa ditambahkan validasi login atau request API jika perlu
    router.push("/chatbot"); // ✅ arahkan ke halaman chatbot
  };

  return (
    <section className="login-section">
      <div className="login-left">
        <div>
          <Link href="/">
            <Image
              src="/2eTzXPBoTKuS8kPybABkBxXoQ.png"
              alt="KEMENDUKBANGGA Logo"
              width={155.5}
              height={21}
              className="login-logo"
            />
          </Link>
        </div>

        <div className="form-wrapper">
          <h1 className="login-title">Selamat Datang Kembali!</h1>
          <p className="login-subtitle">
            Akses akun Anda untuk terus menjelajahi layanan kami
          </p>

          {/* ✅ gunakan onSubmit untuk menangani login */}
          <form onSubmit={handleLogin}>
            <label htmlFor="email" className="input-label">
              Email
            </label>
            <div className="input-container">
              <input
                type="email"
                id="email"
                placeholder="email@example.com"
                className="input-field"
                required
              />
            </div>

            <label
              htmlFor="password"
              className="input-label"
              style={{ marginTop: "1rem" }}
            >
              Password
            </label>
            <div className="input-container" style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="••••••••"
                className="input-field"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <div className="remember-row">
              <label>
                <input type="checkbox" /> Simpan login saya
              </label>
              <Link href="#">Lupa Password</Link>
            </div>

            {/* ✅ tombol submit */}
            <button type="submit" className="login-button">
              Login Sekarang
            </button>

            <div className="divider">
              <span>atau lanjutkan dengan</span>
            </div>

            <div className="social-buttons">
              <button type="button" className="social-btn">
                <FcGoogle /> Google
              </button>
              <button type="button" className="social-btn">
                <FaFacebook className="text-[#1877F2]" /> Facebook
              </button>
            </div>
          </form>
        </div>

        <footer className="login-footer">
          <p>Copyright © 2025 All rights reserved.</p>
          <div>
            <Link href="#">Privacy Policy</Link> |{" "}
            <Link href="#">Terms of Service</Link>
          </div>
        </footer>
      </div>

      <div className="login-right">
        <Image
          src="/QuC1dz4UwiCPjWjMUapsJy78kg.png"
          alt="Illustration"
          width={400}
          height={388}
        />
        <div>
          <h2>SELAMAT DATANG DI KELUARGA INDONESIA</h2>
          <p>Berawal dari harmoni untuk tumbuh bersama!</p>
          <p>#KeluargaBerdayaIndonesiaJuara</p>
        </div>
      </div>
    </section>
  );
}
