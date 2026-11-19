// src/components/AddColumnModal.jsx
import { useState } from 'react'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import useKanbanStore from '../store/kanbanStore'

export default function AddColumnModal({ onClose }) {
  const { addColumn } = useKanbanStore()
  const [title, setTitle] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Nama kolom wajib diisi!')
      return
    }
    addColumn(title.trim())
    toast.success(`Kolom "${title.trim()}" berhasil ditambahkan!`)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-gray-800">Add New List</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            autoFocus
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nama kolom (cth: Sedang Dikerjakan)"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Add List
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
