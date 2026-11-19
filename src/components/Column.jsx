// src/components/Column.jsx
import { useState } from 'react'
import { Droppable, Draggable } from '@hello-pangea/dnd'
import { Plus, MoreHorizontal, Maximize2, Pencil, Trash2, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import TaskCard from './TaskCard'
import useKanbanStore from '../store/kanbanStore'

export default function Column({ column, tasks, onCardClick, onAddTask }) {
  const { updateColumn, deleteColumn } = useKanbanStore()
  const [menuOpen,     setMenuOpen]     = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft,   setTitleDraft]   = useState(column.title)

  const handleSaveTitle = () => {
    if (titleDraft.trim()) {
      updateColumn(column.id, titleDraft.trim())
      toast.success('Nama kolom berhasil diubah!')
    }
    setEditingTitle(false)
  }

  const handleDelete = () => {
    if (tasks.length > 0) {
      if (!window.confirm(`Hapus kolom "${column.title}" beserta ${tasks.length} tugas di dalamnya?`)) return
    }
    deleteColumn(column.id)
    toast.success('Kolom berhasil dihapus!')
    setMenuOpen(false)
  }

  return (
    <div className="flex flex-col w-72 flex-shrink-0">
      {/* Column Header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        {editingTitle ? (
          <div className="flex items-center gap-1 flex-1">
            <input
              autoFocus
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle()
                if (e.key === 'Escape') setEditingTitle(false)
              }}
              className="flex-1 text-sm font-semibold bg-white border border-blue-400 rounded px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={handleSaveTitle} className="text-green-600 hover:text-green-800">
              <Check size={14} />
            </button>
            <button onClick={() => setEditingTitle(false)} className="text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <h2 className="font-semibold text-sm text-gray-700 flex-1 truncate">{column.title}</h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full font-medium">
              {tasks.length}
            </span>
            <button
              onClick={onAddTask}
              className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-0.5 rounded transition-colors"
              title="Add task"
            >
              <Plus size={16} />
            </button>
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-0.5 rounded transition-colors"
              >
                <MoreHorizontal size={16} />
              </button>
              {menuOpen && (
                <>
                  {/* backdrop klik luar untuk tutup menu */}
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-20">
                    <button
                      onClick={() => { setEditingTitle(true); setMenuOpen(false) }}
                      className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Pencil size={12} /> Rename
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={12} /> Hapus Kolom
                    </button>
                  </div>
                </>
              )}
            </div>
            <button className="text-gray-400 hover:text-gray-600 p-0.5 rounded">
              <Maximize2 size={14} />
            </button>
          </>
        )}
      </div>

      {/* Droppable area */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-col gap-2 flex-1 min-h-16 rounded-xl p-2 transition-colors ${
              snapshot.isDraggingOver ? 'bg-blue-50 ring-2 ring-blue-200' : 'bg-gray-100/50'
            }`}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(dragProvided, dragSnapshot) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                    className={`transition-transform ${dragSnapshot.isDragging ? 'rotate-1 scale-105 shadow-xl' : ''}`}
                  >
                    <TaskCard task={task} onClick={() => onCardClick(task)} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            <button
              onClick={onAddTask}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg px-2 py-1.5 mt-1 transition-colors w-full"
            >
              <Plus size={14} />
              <span>+ Add Task</span>
            </button>
          </div>
        )}
      </Droppable>
    </div>
  )
}
