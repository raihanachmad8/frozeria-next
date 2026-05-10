import { PUBLIC_ENV } from "@/commons/constants/public-env";

type HelpStepSegment = {
  text: string;
  strong?: boolean;
};

type HelpStep = readonly HelpStepSegment[];

function step(segments: HelpStep): HelpStep {
  return segments;
}

export const HELP_PAGE_COPY = {
  title: "Bantuan",
  description: "Panduan penggunaan aplikasi Frozeria untuk staf toko.",
  usageGuideTitle: "Panduan Penggunaan Sistem",
  stockGuideTitle: "Status stok",
  noteTitle: "Catatan",
  identityTitle: "Identitas peserta",
} as const;

export const HELP_USAGE_SECTIONS = [
  {
    title: "Cara menambah barang baru",
    steps: [
      step([
        { text: "Buka halaman " },
        { text: "Dashboard", strong: true },
        { text: ", lalu klik tombol " },
        { text: "Tambah Barang", strong: true },
        { text: "." },
      ]),
      step([
        { text: "Unggah " },
        { text: "foto barang", strong: true },
        { text: " bila tersedia." },
      ]),
      step([
        { text: "Isi " },
        { text: "nama barang", strong: true },
        { text: ", " },
        { text: "kategori", strong: true },
        { text: ", " },
        { text: "satuan", strong: true },
        { text: ", " },
        { text: "jumlah stok", strong: true },
        {
          text: ", harga, berat atau ukuran, lokasi simpan, dan deskripsi bila diperlukan.",
        },
      ]),
      step([
        { text: "Klik " },
        { text: "Simpan", strong: true },
        { text: ". Barang baru akan muncul di tabel dashboard." },
      ]),
    ],
  },
  {
    title: "Cara update stok barang masuk",
    steps: [
      step([
        { text: "Temukan barang di " },
        { text: "Dashboard", strong: true },
        { text: " menggunakan kolom pencarian atau filter kategori." },
      ]),
      step([
        { text: "Klik tombol " },
        { text: "Edit", strong: true },
        { text: " pada baris barang tersebut." },
      ]),
      step([
        { text: "Ubah nilai " },
        { text: "Jumlah stok", strong: true },
        { text: " sesuai kondisi stok terbaru." },
      ]),
      step([
        { text: "Klik " },
        { text: "Simpan", strong: true },
        {
          text: ". Data stok pada dashboard dan detail barang akan diperbarui.",
        },
      ]),
    ],
  },
  {
    title: "Cara mencari dan memfilter barang",
    steps: [
      step([
        { text: "Ketik " },
        { text: "nama barang", strong: true },
        { text: " pada kolom pencarian di Dashboard." },
      ]),
      step([
        { text: "Pilih kategori pada dropdown " },
        { text: "Semua kategori", strong: true },
        { text: " untuk membatasi daftar barang." },
      ]),
      step([
        { text: "Gunakan tombol " },
        { text: "Detail", strong: true },
        { text: " untuk melihat informasi lengkap barang dan fotonya." },
      ]),
    ],
  },
  {
    title: "Cara mengelola kategori",
    steps: [
      step([
        { text: "Buka halaman " },
        { text: "Kategori", strong: true },
        { text: " dari navigasi atas." },
      ]),
      step([
        { text: "Klik " },
        { text: "Tambah Kategori", strong: true },
        { text: " untuk membuat kategori baru." },
      ]),
      step([
        { text: "Gunakan tombol " },
        { text: "Edit", strong: true },
        { text: " untuk mengubah nama atau deskripsi kategori." },
      ]),
      step([
        { text: "Gunakan tombol " },
        { text: "Hapus", strong: true },
        { text: " untuk menghapus kategori setelah dialog konfirmasi muncul." },
      ]),
      step([
        { text: "Menghapus kategori " },
        { text: "tidak menghapus barang", strong: true },
        { text: ". Barang terkait akan menjadi tanpa kategori." },
      ]),
    ],
  },
  {
    title: "Cara menghapus data dengan aman",
    steps: [
      step([
        { text: "Klik tombol " },
        { text: "Hapus", strong: true },
        { text: " pada barang atau kategori yang ingin dihapus." },
      ]),
      step([
        { text: "Baca " },
        { text: "dialog konfirmasi", strong: true },
        { text: " yang muncul." },
      ]),
      step([
        { text: "Pilih " },
        { text: "Batal", strong: true },
        { text: " jika data tidak jadi dihapus." },
      ]),
      step([
        { text: "Pilih " },
        { text: "Hapus", strong: true },
        {
          text: " jika data sudah benar. Data akan hilang dari tampilan dan database.",
        },
      ]),
    ],
  },
] as const;

export const STOCK_GUIDES = [
  {
    label: "Tersedia",
    tone: "available",
    description: "Stok lebih besar atau sama dengan batas minimum.",
  },
  {
    label: "Menipis",
    tone: "low",
    description:
      "Stok lebih kecil dari 20 atau batas minimum yang digunakan pada dashboard.",
  },
  {
    label: "Stok habis",
    tone: "empty",
    description: "Stok bernilai 0 dan perlu segera diperbarui.",
  },
] as const;

export const HELP_NOTES = [
  "Satuan barang dapat diisi sesuai kebutuhan, misalnya pcs, pack, box, kg, gram, atau liter.",
  "Foto barang bersifat opsional, tetapi disarankan untuk memudahkan pengecekan stok.",
  "Gunakan data uji saat demo agar data utama toko tetap rapi.",
] as const;

export const PARTICIPANT_IDENTITY = [
  { label: "Nama", value: PUBLIC_ENV.participant.name },
  { label: "NIM", value: PUBLIC_ENV.participant.studentId },
  { label: "Kelas", value: PUBLIC_ENV.participant.className },
  { label: "Alamat", value: PUBLIC_ENV.participant.address },
  { label: "Telepon", value: PUBLIC_ENV.participant.phone },
  { label: "Email", value: PUBLIC_ENV.participant.email },
] as const;
