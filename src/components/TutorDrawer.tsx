import React, { useState } from 'react';
import { Bot, Send, Sparkles, X, Lightbulb } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface TutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTopic?: string;
}

interface ChatMessage {
  id: string;
  sender: 'tutor' | 'student';
  text: string;
  time: string;
}

export const TutorDrawer: React.FC<TutorDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'tutor',
      text: 'Halo! Saya Kak Geo 📐, tutor geometri SMP kamu. Sedang bingung dengan rumus 2D (Pythagoras, trapesium, sudut lingkaran) atau 3D (luas selimut kerucut, tabung, volume bola)? Tanyakan saja di sini!',
      time: 'Baru saja',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isLoading) return;

    const userQuery = inputVal.trim();
    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'student',
      text: userQuery,
      time: 'Baru saja',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Kamu adalah Kak Geo, guru tutor matematika geometri ramah dan ahli untuk siswa SMP Indonesia. Berikan penjelasan yang ringkas, mudah dipahami siswa kelas 7-9 SMP, lengkap dengan rumus bertahap jika ditanyakan. Pertanyaan siswa: "${userQuery}"`,
        });

        const replyText = response.text || 'Maaf, Kak Geo sedang memproses jawaban. Silakan coba kembali!';
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            sender: 'tutor',
            text: replyText,
            time: 'Baru saja',
          },
        ]);
      } else {
        // High quality rule-based educational assistant for common geometry queries
        setTimeout(() => {
          let responseText = '';
          const qLower = userQuery.toLowerCase();

          if (qLower.includes('pythagoras') || qLower.includes('tripel')) {
            responseText =
              '📌 **Trik Teorema Pythagoras SMP:**\nRumusnya: c² = a² + b² (c selalu sisi miring terpanjang di depan sudut 90°).\nTripel sakti yang sering keluar di ujian:\n1. 3, 4, 5 (dan kelipatannya: 6-8-10, 9-12-15)\n2. 5, 12, 13 (dan 10-24-26)\n3. 7, 24, 25 (sering dipakai di kerucut!)\n4. 8, 15, 17.';
          } else if (qLower.includes('kerucut') || qLower.includes('pelukis')) {
            responseText =
              '🍦 **Rumus Kerucut Praktis:**\n1. Garis pelukis: s = √(r² + t²)\n2. Luas Selimut = π × r × s\n3. Luas Permukaan Penuh = πr(r + s)\n4. Volume = ⅓ × π × r² × t (tepat sepertiga volume tabung!).';
          } else if (qLower.includes('tabung') || qLower.includes('silinder')) {
            responseText =
              '🥫 **Tabung (Silinder):**\n1. Volume = π × r² × t\n2. Luas Selimut = 2 × π × r × t\n3. Luas Tabung Tanpa Tutup = πr² + 2πrt = πr(r + 2t)\n💡 Tips: Jika r = 7 cm, luas alas lingkarannya pasti 154 cm²!';
          } else if (qLower.includes('bola') || qLower.includes('kubah')) {
            responseText =
              '⚽ **Bola & Belahan Bola:**\n1. Volume Bola = ⁴⁄₃ × π × r³\n2. Luas Bola Penuh = 4 × π × r²\n3. Kubah Masjid / Belahan Berongga = 2 × π × r²\n4. Belahan Bola Padat / Pejal = 3 × π × r² (karena ada alas penutup lingkaran).';
          } else if (qLower.includes('trapesium')) {
            responseText =
              '📐 **Trapesium:**\nLuas = ½ × (sisi atas + sisi bawah) × tinggi.\n💡 Jika tinggi belum diketahui pada trapesium sama kaki, potong segitiga siku-siku di sampingnya dengan alas x = (bawah - atas) / 2, lalu gunakan Pythagoras untuk mencari tingginya!';
          } else {
            responseText = `Pertanyaan yang bagus tentang "${userQuery}"! Pada geometri SMP, kuncinya adalah:\n1. Tentukan apakah bangun tersebut 2D (luas & keliling) atau 3D (luas permukaan & volume).\n2. Cek apakah ada unsur siku-siku untuk memanfaatkan tripel Pythagoras.\n3. Periksa nilai π: gunakan 22/7 jika jari-jari kelipatan 7, atau 3,14 jika bukan. Ada yang ingin Kak Geo jelaskan lebih detail?`;
          }

          setMessages((prev) => [
            ...prev,
            {
              id: String(Date.now() + 1),
              sender: 'tutor',
              text: responseText,
              time: 'Baru saja',
            },
          ]);
          setIsLoading(false);
        }, 600);
        return;
      }
    } catch (err) {
      console.warn('GenAI error or key issue', err);
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'tutor',
          text: 'Tips Geometri: Untuk menghitung volume bangun ruang yang meruncing (kerucut & limas), selalu ada faktor ⅓ di depan rumus luas alas kali tinggi! Ada lagi yang ingin kamu tanyakan?',
          time: 'Baru saja',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'Tripel Pythagoras yang sering keluar?',
    'Cara hitung garis pelukis kerucut?',
    'Beda kubah berongga vs bola padat?',
    'Rumus luas trapesium sama kaki?',
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              Kak Geo <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            </h3>
            <p className="text-[11px] text-slate-500">Tutor Belajar Geometri SMP</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Tutup Panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'student' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                m.sender === 'student'
                  ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-bl-xs whitespace-pre-line'
              }`}
            >
              {m.text}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-1">{m.time}</span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            Kak Geo sedang menyusun penjelasan...
          </div>
        )}
      </div>

      {/* Suggested Quick Inquiries */}
      <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/40">
        <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1.5 flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-500" /> Tanya Cepat:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setInputVal(p);
              }}
              className="text-[11px] px-2 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input box */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <input
          type="text"
          placeholder="Tanyakan rumus atau langkah pengerjaan..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 dark:text-slate-100"
        />
        <button
          type="submit"
          disabled={!inputVal.trim() || isLoading}
          className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition-colors"
          aria-label="Kirim Pesan"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
