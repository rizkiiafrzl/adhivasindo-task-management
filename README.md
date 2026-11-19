# Adhivasindo Task Management Board

Aplikasi manajemen tugas (Kanban Board) yang dikembangkan sebagai bagian dari Frontend Developer Take Home Test di PT Adhikari Inovasi Indonesia (Adhivasindo).

## Overview

Aplikasi ini menyediakan antarmuka manajemen tugas interaktif berbasis Kanban Board yang memungkinkan pengguna mengorganisir alur kerja tugas tim secara visual, mengelola detail pekerjaan, serta memantau progress penyelesaian tugas secara real-time di sisi client.

Sistem antarmuka dan istilah umum project management (seperti status kolom, label, dan navigasi) menggunakan standar universal, sementara seluruh konten data, aktivitas, dan notifikasi diprioritaskan dalam Bahasa Indonesia agar relevan dan natural bagi pengguna lokal.

## Tech Stack

- **Framework & Build:** React.js (JSX) dengan Vite
- **Styling:** Tailwind CSS (responsif desktop dan mobile)
- **Drag and Drop:** `@hello-pangea/dnd`
- **State Management & Persistence:** Zustand dengan middleware `persist` ke browser Local Storage
- **Icons:** `lucide-react`
- **Notifications:** `sonner` (Toast feedback)
- **Utilities:** `uuid`, `date-fns`

## Fitur Aplikasi

Sesuai dengan spesifikasi tes, seluruh fitur berikut telah diimplementasikan secara fungsional:

1. **Kanban Board & Column Management**
   - Kolom default: *To Do*, *Doing*, *Review*, *Done*, dan *Rework*.
   - Dukungan penambahan kolom baru (*Add new List*), ubah nama kolom (*Rename*), dan hapus kolom (*Delete*).

2. **Task Card Informatif**
   - Menampilkan judul tugas, label badge, tanggal due date, avatar anggota tim yang ditugaskan, cover image, dan indikator jumlah komentar/checklist.
   - Progress bar dinamis pada tiap kartu yang merefleksikan persentase checklist subtask.

3. **Drag and Drop Antar Kolom**
   - Pemindahan kartu tugas antar kolom maupun penyusunan ulang urutan tugas di dalam kolom yang sama secara interaktif.

4. **CRUD Task Lengkap**
   - **Create:** Pembuatan tugas baru melalui tombol quick-add pada kolom.
   - **Read:** Tampilan visual kartu pada board dan modal detail lengkap.
   - **Update:** Pengubahan judul, deskripsi, tanggal due date, label, prioritas, kolom, dan cover image via modal.
   - **Delete:** Penghapusan tugas dengan dialog konfirmasi aman.

5. **Checklist & Subtask Tracking**
   - Penambahan item subtask baru secara dinamis.
   - Centang atau batalkan centang subtask dengan pembaruan otomatis pada progress bar rasio (misal: 1/2 menjadi 2/2).

6. **Pencarian & Penyaringan (Search & Filter)**
   - Fitur pencarian teks langsung (*live search*) berdasarkan judul dan deskripsi tugas.
   - Penyaringan kartu berdasarkan Label (*Feature, Bug, Issue, Undefined*) maupun anggota tim (*Assignee*).

7. **Penyimpanan Data Lokal (Local Storage)**
   - Seluruh perubahan data (tugas baru, posisi drag & drop, status checklist, kolom baru) tersimpan otomatis di Local Storage browser tanpa memerlukan backend/API, sehingga data tetap utuh saat halaman di-refresh.

8. **Fitur Tambahan (Bonus Points)**
   - Dukungan unggah gambar sampul (*Cover Image*) per kartu tugas.
   - Notifikasi Toast untuk setiap aksi utama (pembuatan, pembaruan, penghapusan, dan pemindahan tugas).

## Cara Menjalankan Project

### Prasyarat
- Node.js versi 18 atau lebih baru
- npm versi 9 atau lebih baru

### Langkah Instalasi

1. Clone repository ini:
   ```bash
   git clone https://github.com/rizkiiafrzl/adhivasindo-task-management.git
   ```

2. Masuk ke direktori project:
   ```bash
   cd adhivasindo-task-management
   ```

3. Install seluruh dependencies:
   ```bash
   npm install
   ```

4. Jalankan server pengembangan (development server):
   ```bash
   npm run dev
   ```

5. Buka peramban (browser) pada tautan:
   ```
   http://localhost:5173/
   ```

### Build Production

Untuk memvalidasi atau membuat build siap rilis:
```bash
npm run build
npm run preview
```

## Struktur Project

```
adhivasindo-task-management/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx         # Header aplikasi, pencarian, dan penyaringan
│   │   ├── Board.jsx          # Komponen utama Kanban Board dan DragDropContext
│   │   ├── Column.jsx         # Kolom tugas beserta aksi kolom
│   │   ├── TaskCard.jsx       # Kartu tugas individual
│   │   ├── TaskModal.jsx      # Modal detail, form edit, subtask, dan assignee
│   │   ├── AddTaskModal.jsx   # Form modal pembuatan tugas baru
│   │   └── AddColumnModal.jsx # Form modal pembuatan kolom baru
│   ├── data/
│   │   └── initialData.js     # Data inisial tugas dan anggota tim (Bahasa Indonesia)
│   ├── store/
│   │   └── kanbanStore.js     # State management Zustand dengan localStorage persist
│   ├── utils/
│   │   └── helpers.js         # Konfigurasi warna label, prioritas, dan formatter tanggal
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── package-lock.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## Informasi Pengembang

- **Pengembang:** Rizki Afrizal
- **Posisi / Tes:** Frontend Developer Take Home Test
- **Perusahaan:** PT Adhikari Inovasi Indonesia (Adhivasindo)
