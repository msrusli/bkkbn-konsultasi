"use client";
import Image from "next/image";
import MessageBubble from "./MessageBubble";
import { useChatbot } from "../hooks/useChatbot";
import type { Persona } from "../types";
import "../styles.css";
import { useState } from "react";

export default function ChatWindow() {
  const { persona, messages, ask, greet, reset, bottomRef } = useChatbot();
  const [input, setInput] = useState("");

  const onSend = () => {
    const text = input.trim();
    if (!text) return;
    ask(text);
    setInput("");
  };

  const PickCard = ({ p, img }: { p: Persona; img: string }) => (
    <div className="card">
      <div className="flex items-center gap-3">
        <Image
          src={img}
          alt={p}
          width={56}
          height={56}
          className="rounded-full"
        />
        <div>
          <div className="font-semibold">{p}</div>
          <p className="text-sm text-gray-600">
            Pilih {p} sebagai pendamping percakapan.
          </p>
        </div>
      </div>
      <button className="btn-primary mt-4" onClick={() => greet(p)}>
        Ayo, bareng {p}
      </button>
    </div>
  );

  return (
    <div className="grid grid-cols-12 gap-6">
      <aside className="hidden md:block col-span-3">
        <div className="sticky top-24 space-y-3">
          <div className="menu">
            <div className="menu-title">Hari ini</div>
            <ul className="menu-list">
              <li>Bagaimana cara memulai?</li>
              <li>Cara menjaga informasi</li>
              <li>Apa saja fitur utama?</li>
            </ul>
          </div>
          <div className="menu">
            <div className="menu-title">Kemarin</div>
            <ul className="menu-list">
              <li>Memperbaiki kata sandi</li>
            </ul>
          </div>
          <button onClick={reset} className="btn-outline w-full">
            Hapus Riwayat
          </button>
        </div>
      </aside>

      <section className="col-span-12 md:col-span-9">
        <div className="panel">
          {!persona ? (
            <div>
              <h2 className="text-lg font-bold mb-4">Chatbot AI</h2>
              <p className="text-sm text-gray-600 mb-4">
                Pilih pendamping virtual yang sesuai dengan preferensi Anda:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <PickCard p="Bina" img="/avatars/bina.svg" />
                <PickCard p="Kina" img="/avatars/kina.svg" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-[68vh]">
              <div className="flex-1 overflow-y-auto chat-scroll pr-1">
                {messages.length === 0 && (
                  <div className="text-sm text-gray-500">
                    Mulai percakapan dengan mengetik pertanyaan di bawah.
                  </div>
                )}
                {messages.map((m) => (
                  <MessageBubble key={m.id} m={m} />
                ))}
                <div ref={bottomRef} />
              </div>

              <div className="mt-3 flex items-center gap-2">
                <input
                  className="input flex-1"
                  placeholder={`Tanya ${persona}…`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onSend();
                  }}
                />
                <button className="btn-primary" onClick={onSend}>
                  Kirim
                </button>
                <button className="btn-outline" onClick={reset}>
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
