# Adhivasindo Kanban Board

Aplikasi manajemen tugas berbasis Kanban Board yang dibangun dengan React.js.

## 🛠️ Tech Stack

| Teknologi | Fungsi |
|---|---|
| **Vite + React (JSX)** | Build tool & framework utama |
| **Tailwind CSS** | Styling & layout responsif |
| **@hello-pangea/dnd** | Drag & Drop antar kolom |
| **Zustand + persist** | State management + localStorage |
| **lucide-react** | Icon library |
| **sonner** | Toast notifications |
| **uuid** | Generate ID unik untuk task |

## ✨ Fitur

- ✅ **Kanban Board** — Tampilan multi-kolom (To Do, Doing, Review, Done, Rework)
- ✅ **CRUD Task** — Create, Read, Update, Delete task secara penuh
- ✅ **Drag & Drop** — Pindahkan task antar kolom dengan animasi smooth
- ✅ **Task Detail Modal** — Edit semua field: judul, deskripsi, assignee, label, prioritas, due date
- ✅ **Checklist / Subtask** — Progress bar otomatis dengan checkbox
- ✅ **Cover Image** — Upload gambar cover untuk task
- ✅ **Manage Columns** — Tambah, rename, dan hapus kolom
- ✅ **Search & Filter** — Cari task real-time, filter by label & assignee
- ✅ **Data Persistent** — Tersimpan di localStorage (tidak hilang saat refresh)
- ✅ **Toast Notifications** — Feedback untuk setiap aksi (create, update, delete, move)
- ✅ **Mark Complete** — Tandai task selesai langsung dari modal

## 🚀 Cara Menjalankan

### Prerequisites
- Node.js >= 18
- npm >= 9

### Install & Run

```bash
# Clone repository
git clone https://github.com/rizkiiafrzl/adhivasindo-task-management.git
cd adhivasindo-task-management

# Install dependencies
npm install

# Jalankan dev server
npm run dev
```

Buka browser di **http://localhost:5173**

### Build Production

```bash
npm run build
npm run preview
```

## 📁 Struktur Project

```
src/
├── components/
│   ├── Navbar.jsx         # Header: search, filter, team avatars
│   ├── Board.jsx          # Kanban board utama + DragDropContext
│   ├── Column.jsx         # Kolom dengan Droppable area
│   ├── TaskCard.jsx       # Card task dengan label, due date, avatar
│   ├── TaskModal.jsx      # Modal detail edit task lengkap
│   ├── AddTaskModal.jsx   # Modal quick-add task baru
│   └── AddColumnModal.jsx # Modal tambah kolom baru
├── store/
│   └── kanbanStore.js     # Zustand store + localStorage persist
├── data/
│   └── initialData.js     # Data awal (10 task + 5 member)
├── utils/
│   └── helpers.js         # Formatter, label config, constants
├── App.jsx
├── main.jsx
└── index.css
```

---

> Built for Adhivasindo Frontend Take-Home Test
