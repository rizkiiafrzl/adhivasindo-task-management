import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import { INITIAL_COLUMNS, INITIAL_TASKS, MEMBERS } from '../data/initialData'

const useKanbanStore = create(
  persist(
    (set, get) => ({
      // ── STATE ──────────────────────────────────────────────
      columns:    INITIAL_COLUMNS,
      tasks:      INITIAL_TASKS,
      members:    MEMBERS,
      searchQuery:  '',
      filterLabel:  '',
      filterMember: '',

      // ── COLUMN ACTIONS ─────────────────────────────────────
      addColumn: (title) => {
        const newCol = { id: uuidv4(), title }
        set((s) => ({ columns: [...s.columns, newCol] }))
      },

      updateColumn: (id, title) =>
        set((s) => ({
          columns: s.columns.map((c) => (c.id === id ? { ...c, title } : c)),
        })),

      deleteColumn: (id) =>
        set((s) => ({
          columns: s.columns.filter((c) => c.id !== id),
          tasks:   s.tasks.filter((t) => t.columnId !== id),
        })),

      // ── TASK ACTIONS ───────────────────────────────────────
      addTask: (columnId, partial = {}) => {
        const newTask = {
          id:            uuidv4(),
          title:         'New Task',
          description:   '',
          columnId,
          label:         'Feature',
          priority:      'Medium',
          dueDate:       '',
          assignees:     [],
          subtasks:      [],
          coverImage:    null,
          commentsCount: 0,
          ...partial,
        }
        set((s) => ({ tasks: [...s.tasks, newTask] }))
        return newTask.id
      },

      updateTask: (id, changes) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...changes } : t)),
        })),

      deleteTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      moveTask: (taskId, destColumnId, destIndex) => {
        const tasks   = get().tasks
        const task    = tasks.find((t) => t.id === taskId)
        if (!task) return
        const others  = tasks.filter((t) => t.id !== taskId)
        const inDest  = others.filter((t) => t.columnId === destColumnId)
        const outDest = others.filter((t) => t.columnId !== destColumnId)
        inDest.splice(destIndex, 0, { ...task, columnId: destColumnId })
        set({ tasks: [...outDest, ...inDest] })
      },

      reorderTask: (columnId, srcIndex, destIndex) => {
        const tasks   = get().tasks
        const col     = tasks.filter((t) => t.columnId === columnId)
        const others  = tasks.filter((t) => t.columnId !== columnId)
        const [moved] = col.splice(srcIndex, 1)
        col.splice(destIndex, 0, moved)
        set({ tasks: [...others, ...col] })
      },

      // ── SUBTASK ACTIONS ────────────────────────────────────
      addSubtask: (taskId, title) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? { ...t, subtasks: [...t.subtasks, { id: uuidv4(), title, completed: false }] }
              : t
          ),
        })),

      toggleSubtask: (taskId, subtaskId) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  subtasks: t.subtasks.map((st) =>
                    st.id === subtaskId ? { ...st, completed: !st.completed } : st
                  ),
                }
              : t
          ),
        })),

      deleteSubtask: (taskId, subtaskId) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? { ...t, subtasks: t.subtasks.filter((st) => st.id !== subtaskId) }
              : t
          ),
        })),

      // ── FILTER / SEARCH ────────────────────────────────────
      setSearchQuery:  (q) => set({ searchQuery:  q }),
      setFilterLabel:  (l) => set({ filterLabel:  l }),
      setFilterMember: (m) => set({ filterMember: m }),

      // Computed: tasks visible setelah filter
      getFilteredTasks: () => {
        const { tasks, searchQuery, filterLabel, filterMember } = get()
        return tasks.filter((t) => {
          const matchSearch = searchQuery
            ? t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              t.description.toLowerCase().includes(searchQuery.toLowerCase())
            : true
          const matchLabel  = filterLabel  ? t.label === filterLabel   : true
          const matchMember = filterMember
            ? t.assignees.some((a) => a.id === filterMember)
            : true
          return matchSearch && matchLabel && matchMember
        })
      },
    }),
    {
      name: 'adhivasindo-kanban-store',
      version: 1,
    }
  )
)

export default useKanbanStore
