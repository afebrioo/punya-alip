/**
 * =======================================================================
 * KONFIGURASI 14 TEKA-TEKI ALIP UNTUK RARA (PENCARIAN "cwtch")
 * =======================================================================
 */

export const gameConfig = {
  targetName: "Rara",
  senderName: "Alip",
  finalWord: "cwtch",
  themeTitle: "Teka-Teki Samudra Alip & Rara",

  // Pengaturan BGM Audio
  bgm: {
    audioUrl: "Justin Timberlake - Mirrors (Lyrics).mp3",
    title: "Justin Timberlake - Mirrors",
    artist: "Untuk Rara"
  },

  // 14 Pertanyaan & Jawaban dari Alip (Pilihan Ganda sudah di-mix posisinya)
  questions: [
    {
      id: 1,
      question: "nama lau sape?",
      answer: "rara",
      options: ["riri", "ruru", "rara", "rara gemoy"],
      feedback: "Nah bener, masa nama sendiri lupa! 😂",
      letterUnlocked: null
    },
    {
      id: 2,
      question: "minuman yang nanti diminum?",
      answer: "matcha",
      options: ["kopi hitam pahit", "matcha", "es teh tawar", "boba gula aren"],
      feedback: "Paling bener emang matcha kesayangan! 🍵",
      letterUnlocked: null
    },
    {
      id: 3,
      question: "jabatanya cukup seram di komplek?",
      answer: "anak rw 14",
      options: ["ketua geng motor", "hansip teladan", "duta ronda malam", "anak rw 14"],
      feedback: "Takut banget sama anak RW 14! 😭",
      letterUnlocked: "C" // Huruf 1 dari 'cwtch'
    },
    {
      id: 4,
      question: "ngassist ngerjain apaan dah?",
      answer: "gigi",
      options: ["mesin motor", "gigi", "skripsi orang", "cuci piring"],
      feedback: "Dokter gigi masa depan andalan! 🦷",
      letterUnlocked: null
    },
    {
      id: 5,
      question: "17 desember ketemuan dimana? aamiin",
      answer: "bali",
      options: ["bantar gebang", "cikini", "bali", "pasar rebo"],
      feedback: "Aamiin paling kenceng! Bali gaspol! 🌴",
      letterUnlocked: null
    },
    {
      id: 6,
      question: "motor lu gaull?",
      answer: "pespa",
      options: ["beat mberr", "supra bapak", "odong-odong", "pespa"],
      feedback: "Anak pespa gaul tiada tanding! 🛵",
      letterUnlocked: "W" // Huruf 2 dari 'cwtch'
    },
    {
      id: 7,
      question: "trip kalau di bolehin kemana yah asiknya?",
      answer: "aussie",
      options: ["aussie", "cibubur", "monas", "dufan"],
      feedback: "Terbang jauh ke Aussie seru parah! 🦘",
      letterUnlocked: null
    },
    {
      id: 8,
      question: "nonton balapan mobil namanya apaan?",
      answer: "f1",
      options: ["tamiya gp", "f1", "formula e", "motogp"],
      feedback: "Ngebuttt bareng F1! 🏎️",
      letterUnlocked: null
    },
    {
      id: 9,
      question: "asep srimulat ada dimana?",
      answer: "line",
      options: ["wechat", "bbm", "line", "telegram"],
      feedback: "Asep srimulat di LINE emang legendaris wkwk! 🤣",
      letterUnlocked: "T" // Huruf 3 dari 'cwtch'
    },
    {
      id: 10,
      question: "beli ayam 3 dapet 5 asikk?",
      answer: "ayam nasville",
      options: ["ayam geprek bensu", "ayam kampus", "ayam nasville", "ayam bakar kalasan"],
      feedback: "Asik bener ayam nashville langganan! 🍗",
      letterUnlocked: null
    },
    {
      id: 11,
      question: "abis cbt enaknya ngapain yah?",
      answer: "tidur",
      options: ["belajar lagi", "tidur", "overthinking", "lari marathon"],
      feedback: "Tidur seharian adalah koentji abis CBT! 😴",
      letterUnlocked: null
    },
    {
      id: 12,
      question: "baju yang dipake tidur tadi malem?",
      answer: "polkadot",
      options: ["kaos partai", "baju astronot", "daster sobek", "polkadot"],
      feedback: "Polkadot emang paling pewe! 👗",
      letterUnlocked: "C" // Huruf 4 dari 'cwtch'
    },
    {
      id: 13,
      question: "lahh sekarang dapet apa?",
      answer: "bunga",
      options: ["bunga", "piring cantik", "minyak goreng", "token listrik"],
      feedback: "Bunga cantik buat kamu! 💐",
      letterUnlocked: null
    },
    {
      id: 14,
      question: "itu agung mart ada dimana?",
      answer: "jimbaran",
      options: ["ciledug", "rawamangun", "jimbaran", "tambun"],
      feedback: "Agung Mart Jimbaran pusat peradaban! 🏖️",
      letterUnlocked: "H" // Huruf 5 dari 'cwtch'
    }
  ],

  // Peti Karun Akhir
  finalChest: {
    heading: "Peti Karun Samudra",
    subheading: "Semua 14 teka-teki selesai & 5 huruf terkumpul! Susun huruf ini untuk membuka peti:",
    lettersAvailable: ["C", "W", "T", "C", "H"],
    placeholder: "masukkan kata rahasia...",
    revealWord: "cwtch"
  }
};
