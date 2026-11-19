// src/components/TaskModal.jsx
import { useState, useRef, useEffect } from 'react'
import {
  X, Check, Pencil, Calendar, Upload,
  Plus, Trash2, ChevronDown, Image as ImageIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import useKanbanStore from '../store/kanbanStore'
import { LABEL_OPTIONS, PRIORITY_OPTIONS } from '../utils/helpers'

export default function TaskModal({ task, onClose }) {
  const {
    columns, members, tasks, updateTask, deleteTask,
    addSubtask, toggleSubtask, deleteSubtask,
  } = useKanbanStore()

  // Ambil task terbaru secara reaktif dari store
  const liveTask = tasks.find((t) => t.id === task.id) || task

  const [draft, setDraft] = useState({ ...liveTask })
  const [subtaskInput, setSubtaskInput] = useState('')
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState(liveTask.title)
  const [showAssigneePicker, setShowAssigneePicker] = useState(false)
  const coverRef = useRef()

  const subtasks = liveTask.subtasks ?? []
  const totalSub = subtasks.length
  const doneSub = subtasks.filter((s) => s.completed).length
  const progress = totalSub > 0 ? Math.round((doneSub / totalSub) * 100) : 0

  // Tutup modal dengan Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleSave = () => {
    if (!titleDraft.trim()) {
      toast.error('Judul tugas wajib diisi!')
      return
    }
    updateTask(task.id, {
      ...draft,
      title: titleDraft.trim(),
      subtasks: liveTask.subtasks, // jaga checklist terbaru
      assignees: draft.assignees,
    })
    toast.success('Tugas berhasil diperbarui!')
    onClose()
  }

  const handleDelete = () => {
    if (!window.confirm('Hapus tugas ini? Tindakan ini tidak dapat dibatalkan.')) return
    deleteTask(task.id)
    toast.success('Tugas berhasil dihapus!')
    onClose()
  }

  const handleMarkComplete = () => {
    const newCol = draft.columnId === 'done' ? 'todo' : 'done'
    setDraft((d) => ({ ...d, columnId: newCol }))
    updateTask(task.id, { columnId: newCol })
    toast.success(newCol === 'done' ? 'Tugas ditandai selesai!' : 'Tugas dipindahkan ke To Do')
  }

  const handleCoverUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setDraft((d) => ({ ...d, coverImage: reader.result }))
      updateTask(task.id, { coverImage: reader.result })
      toast.success('Gambar sampul diperbarui!')
    }
    reader.readAsDataURL(file)
  }

  const handleAddSubtask = () => {
    if (!subtaskInput.trim()) return
    addSubtask(task.id, subtaskInput.trim())
    setSubtaskInput('')
    toast.success('Checklist berhasil ditambahkan!')
  }

  const handleAssigneeToggle = (member) => {
    const isAssigned = (draft.assignees || []).some((a) => a.id === member.id)
    const newAssignees = isAssigned
      ? (draft.assignees || []).filter((a) => a.id !== member.id)
      : [...(draft.assignees || []), member]

    setDraft((d) => ({ ...d, assignees: newAssignees }))
    updateTask(task.id, { assignees: newAssignees })
    toast.success(isAssigned ? `${member.name} dihapus dari tugas` : `${member.name} ditugaskan`)
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-8 pb-8 px-4 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col">

        {/* ── TOP ACTIONS ─────────────────────────── */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2">
          <button
            onClick={handleMarkComplete}
            className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg border transition-colors ${
              draft.columnId === 'done'
                ? 'bg-green-50 text-green-700 border-green-300'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Check size={14} />
            {draft.columnId === 'done' ? 'Completed' : 'Mark Complete'}
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Hapus tugas"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── COVER IMAGE ─────────────────────────── */}
        <div className="mx-6 mb-4">
          {draft.coverImage ? (
            <div className="relative rounded-xl overflow-hidden h-44 bg-gray-100">
              <img src={draft.coverImage} alt="cover" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => coverRef.current.click()}
                  className="bg-white text-gray-700 text-xs px-3 py-1.5 rounded-lg shadow font-medium flex items-center gap-1.5"
                >
                  <Pencil size={12} /> Ganti
                </button>
                <button
                  onClick={() => {
                    setDraft((d) => ({ ...d, coverImage: null }))
                    updateTask(task.id, { coverImage: null })
                  }}
                  className="bg-white text-red-600 text-xs px-3 py-1.5 rounded-lg shadow font-medium flex items-center gap-1.5"
                >
                  <Trash2 size={12} /> Hapus
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => coverRef.current.click()}
              className="w-full h-24 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
            >
              <ImageIcon size={20} />
              <span className="text-xs font-medium">Tambah Gambar Sampul</span>
            </button>
          )}
          <input
            ref={coverRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCoverUpload}
          />
        </div>

        {/* ── MAIN BODY (2 kolom) ─────────────────── */}
        <div className="flex gap-6 px-6 pb-6 flex-col md:flex-row">

          {/* LEFT PANEL */}
          <div className="flex-1 space-y-5 min-w-0">

            {/* Judul */}
            <div>
              {editingTitle ? (
                <div className="flex items-start gap-2">
                  <textarea
                    autoFocus
                    value={titleDraft}
                    onChange={(e) => setTitleDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        setEditingTitle(false)
                      }
                    }}
                    rows={2}
                    className="flex-1 text-lg font-semibold border border-blue-400 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => setEditingTitle(false)}
                    className="text-green-600 mt-1 hover:text-green-800"
                  >
                    <Check size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-start gap-2 group">
                  <h2 className="text-lg font-semibold text-gray-900 flex-1 leading-snug">
                    {titleDraft}
                  </h2>
                  <button
                    onClick={() => setEditingTitle(true)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600 mt-0.5 transition-opacity"
                  >
                    <Pencil size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Assignee */}
            <FormRow label="Assignee">
              <div className="flex items-center gap-2 flex-wrap relative">
                {(draft.assignees || []).map((a) => (
                  <div key={a.id} className="relative group/avatar">
                    <img
                      src={a.avatar}
                      alt={a.name}
                      title={a.name}
                      className="w-7 h-7 rounded-full border-2 border-white shadow-sm object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleAssigneeToggle(a)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-3.5 h-3.5 items-center justify-center hidden group-hover/avatar:flex"
                      title={`Hapus ${a.name}`}
                    >
                      <X size={8} />
                    </button>
                  </div>
                ))}

                {/* Tombol + klik untuk buka menu anggota */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowAssigneePicker(!showAssigneePicker)}
                    className={`w-7 h-7 rounded-full border-2 border-dashed flex items-center justify-center transition-colors ${
                      showAssigneePicker
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-500'
                    }`}
                    title="Tambah anggota tim"
                  >
                    <Plus size={12} />
                  </button>

                  {/* Dropdown pilih anggota (buka via klik, tidak hilang saat digeser) */}
                  {showAssigneePicker && (
                    <>
                      <div
                        className="fixed inset-0 z-20"
                        onClick={() => setShowAssigneePicker(false)}
                      />
                      <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 z-30 max-h-56 overflow-y-auto">
                        <div className="text-xs font-semibold text-gray-400 px-2 py-1 mb-1 border-b border-gray-100">
                          Pilih Anggota Tim
                        </div>
                        {members.map((m) => {
                          const assigned = (draft.assignees || []).some((a) => a.id === m.id)
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => handleAssigneeToggle(m)}
                              className={`flex items-center gap-2.5 w-full px-2 py-1.5 rounded-lg text-sm transition-colors ${
                                assigned
                                  ? 'bg-blue-50 text-blue-700 font-medium'
                                  : 'hover:bg-gray-50 text-gray-700'
                              }`}
                            >
                              <img
                                src={m.avatar}
                                alt={m.name}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                              <span className="flex-1 text-left truncate">{m.name}</span>
                              {assigned && <Check size={14} className="text-blue-600" />}
                            </button>
                          )
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </FormRow>

            {/* Due Date */}
            <FormRow label="Due Date">
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 w-fit">
                <Calendar size={14} className="text-gray-400" />
                <input
                  type="date"
                  value={draft.dueDate}
                  onChange={(e) => setDraft((d) => ({ ...d, dueDate: e.target.value }))}
                  className="text-sm text-gray-700 border-none outline-none bg-transparent"
                />
              </div>
            </FormRow>

            {/* Board + Column */}
            <div className="grid grid-cols-2 gap-3">
              <FormRow label="Board">
                <SelectBox
                  value="Adhivasindo"
                  disabled
                  options={['Adhivasindo']}
                  onChange={() => {}}
                />
              </FormRow>
              <FormRow label="Column">
                <SelectBox
                  value={draft.columnId}
                  options={columns.map((c) => ({ label: c.title, value: c.id }))}
                  onChange={(v) => setDraft((d) => ({ ...d, columnId: v }))}
                />
              </FormRow>
            </div>

            {/* Label + Priority */}
            <div className="grid grid-cols-2 gap-3">
              <FormRow label="Label">
                <SelectBox
                  value={draft.label}
                  options={LABEL_OPTIONS}
                  onChange={(v) => setDraft((d) => ({ ...d, label: v }))}
                />
              </FormRow>
              <FormRow label="Priority">
                <SelectBox
                  value={draft.priority}
                  options={PRIORITY_OPTIONS}
                  onChange={(v) => setDraft((d) => ({ ...d, priority: v }))}
                />
              </FormRow>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Description
              </label>
              <div className="border border-gray-200 rounded-xl p-3">
                <textarea
                  rows={3}
                  value={draft.description}
                  onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                  placeholder="Tambahkan deskripsi tugas di sini..."
                  className="w-full text-sm text-gray-600 resize-none border-none outline-none bg-transparent placeholder-gray-300"
                />
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="w-full md:w-64 space-y-5 flex-shrink-0">

            {/* Attachments */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Attachments
              </label>
              <div
                onDrop={(e) => { e.preventDefault(); toast.info('Fitur lampiran akan segera hadir!') }}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => toast.info('Fitur lampiran akan segera hadir!')}
                className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <Upload size={16} className="mx-auto text-gray-300 mb-1" />
                <p className="text-xs text-gray-400">
                  Seret &amp; lepas file di sini{' '}
                  <span className="text-blue-500">atau pilih dari perangkat</span>
                </p>
              </div>
            </div>

            {/* Check List (Subtask) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">Check List</label>
                <span className="text-xs text-gray-400">{doneSub}/{totalSub}</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-gray-100 rounded-full mb-3 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Daftar subtask interaktif */}
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {subtasks.length === 0 ? (
                  <p className="text-xs text-gray-400 italic py-1">Belum ada checklist.</p>
                ) : (
                  subtasks.map((st) => (
                    <div key={st.id} className="flex items-center gap-2 group/item hover:bg-gray-50 p-1 rounded-lg transition-colors">
                      <input
                        type="checkbox"
                        checked={Boolean(st.completed)}
                        onChange={() => toggleSubtask(task.id, st.id)}
                        className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-blue-600"
                      />
                      <span
                        onClick={() => toggleSubtask(task.id, st.id)}
                        className={`flex-1 text-sm cursor-pointer select-none ${
                          st.completed ? 'line-through text-gray-400' : 'text-gray-700'
                        }`}
                      >
                        {st.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteSubtask(task.id, st.id)}
                        className="opacity-0 group-hover/item:opacity-100 text-gray-300 hover:text-red-500 transition-all p-0.5"
                        title="Hapus checklist"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Input tambah subtask */}
              <div className="mt-2 flex items-center gap-1.5">
                <input
                  id="subtask-input"
                  type="text"
                  value={subtaskInput}
                  onChange={(e) => setSubtaskInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddSubtask()
                    }
                  }}
                  placeholder="Checklist baru..."
                  className="flex-1 text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  disabled={!subtaskInput.trim()}
                  className="text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                type="button"
                onClick={() => document.getElementById('subtask-input')?.focus()}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 mt-2 transition-colors"
              >
                <Plus size={12} />
                <span>+ Add subtask</span>
              </button>
            </div>

            {/* Activity */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Activity</label>
              <p className="text-xs text-gray-400 italic">Belum ada aktivitas.</p>
            </div>
          </div>
        </div>

        {/* ── FOOTER ──────────────────────────────── */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Helper Components ─────────────────────────────────────

function FormRow({ label, children }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-500 mb-1.5 block">{label}</label>
      {children}
    </div>
  )
}

function SelectBox({ value, options, onChange, disabled = false }) {
  const normalizedOptions = options.map((o) =>
    typeof o === 'string' ? { label: o, value: o } : o
  )
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full text-sm border border-gray-200 rounded-lg pl-3 pr-7 py-1.5 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400 cursor-pointer"
      >
        {normalizedOptions.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown
        size={12}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  )
}
