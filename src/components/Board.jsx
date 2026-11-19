// src/components/Board.jsx
import { useState } from 'react'
import { DragDropContext } from '@hello-pangea/dnd'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import Column from './Column'
import TaskModal from './TaskModal'
import AddTaskModal from './AddTaskModal'
import AddColumnModal from './AddColumnModal'
import useKanbanStore from '../store/kanbanStore'

export default function Board() {
  const { columns, tasks, moveTask, reorderTask, getFilteredTasks } = useKanbanStore()

  const [selectedTaskId,    setSelectedTaskId]    = useState(null)
  const [addTaskColumnId,   setAddTaskColumnId]   = useState(null)
  const [showAddColumn,     setShowAddColumn]     = useState(false)

  const selectedTask = tasks.find((t) => t.id === selectedTaskId)
  const filteredTasks = getFilteredTasks()

  // ── Drag and Drop Handler ─────────────────────
  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    if (source.droppableId === destination.droppableId) {
      reorderTask(source.droppableId, source.index, destination.index)
      toast.success('Urutan tugas berhasil diubah!')
    } else {
      moveTask(draggableId, destination.droppableId, destination.index)
      const destCol = columns.find((c) => c.id === destination.droppableId)
      toast.success(`Tugas dipindahkan ke "${destCol?.title}"`)
    }
  }

  const getColumnTasks = (columnId) =>
    filteredTasks.filter((t) => t.columnId === columnId)

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto px-6 py-4 pb-8 items-start scrollbar-thin min-h-[calc(100vh-64px)]">
          {columns.map((col) => (
            <Column
              key={col.id}
              column={col}
              tasks={getColumnTasks(col.id)}
              onCardClick={(task) => setSelectedTaskId(task.id)}
              onAddTask={() => setAddTaskColumnId(col.id)}
            />
          ))}

          {/* Add New List button */}
          <button
            onClick={() => setShowAddColumn(true)}
            className="flex-shrink-0 w-72 flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-xl px-4 py-3 transition-colors bg-white/50 hover:bg-blue-50"
          >
            <Plus size={16} />
            <span className="font-medium">+ Add new List</span>
          </button>
        </div>
      </DragDropContext>

      {/* Modals */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
      {addTaskColumnId && (
        <AddTaskModal
          columnId={addTaskColumnId}
          onClose={() => setAddTaskColumnId(null)}
        />
      )}
      {showAddColumn && (
        <AddColumnModal onClose={() => setShowAddColumn(false)} />
      )}
    </>
  )
}
