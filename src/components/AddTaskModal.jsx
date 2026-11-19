// src/components/AddTaskModal.jsx
import { useState } from 'react'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import useKanbanStore from '../store/kanbanStore'
import { LABEL_OPTIONS, PRIORITY_OPTIONS } from '../utils/helpers'

export default function AddTaskModal({ columnId, onClose }) {
  const { addTask } = useKanbanStore()
  const [title, setTitle] = useState('')
  const [label, setLabel] = useState('Feature')
  const [priority, setPriority] = useState('Medium')
  const [dueDate, setDueDate] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Judul tugas wajib diisi!')
      return
    }
    addTask(columnId, { title: title.trim(), label, priority, dueDate })
    toast.success('Tugas berhasil dibuat!')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-gray-800">Tugas Baru</h3>
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
            placeholder="Judul tugas..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Label</label>
              <select
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {LABEL_OPTIONS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {PRIORITY_OPTIONS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3 pt-1">
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
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
