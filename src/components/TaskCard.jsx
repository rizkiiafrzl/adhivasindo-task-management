// src/components/TaskCard.jsx
import { Calendar, MessageSquare, CheckSquare } from 'lucide-react'
import { LABEL_CONFIG, formatDate, isOverdue } from '../utils/helpers'

export default function TaskCard({ task, onClick }) {
  const labelCfg = LABEL_CONFIG[task.label] || LABEL_CONFIG.Feature
  const totalSub = task.subtasks?.length ?? 0
  const doneSub  = task.subtasks?.filter((s) => s.completed).length ?? 0
  const progress = totalSub > 0 ? Math.round((doneSub / totalSub) * 100) : 0
  const overdue  = isOverdue(task.dueDate)

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group"
    >
      {/* Cover Image */}
      {task.coverImage && (
        <div className="w-full h-32 overflow-hidden">
          <img
            src={task.coverImage}
            alt="cover"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-3">
        {/* Label pill + progress bar */}
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${labelCfg.bg} ${labelCfg.text}`}>
            {task.label}
          </span>
        </div>

        <div className="h-0.5 w-full rounded-full mb-2 bg-gray-100">
          <div
            className={`h-full rounded-full transition-all duration-500 ${labelCfg.bar}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Title */}
        <h3 className="text-sm font-medium text-gray-800 leading-snug mb-3 line-clamp-2">
          {task.title}
        </h3>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {task.dueDate && (
              <span className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-md font-medium ${
                overdue ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'
              }`}>
                <Calendar size={10} />
                {formatDate(task.dueDate)}
              </span>
            )}
            {task.commentsCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <MessageSquare size={10} />
                {task.commentsCount}
              </span>
            )}
            {totalSub > 0 && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <CheckSquare size={10} />
                {doneSub}/{totalSub}
              </span>
            )}
          </div>

          {/* Assignee Avatars */}
          {task.assignees?.length > 0 && (
            <div className="flex -space-x-1.5 flex-shrink-0">
              {task.assignees.slice(0, 3).map((a) => (
                <img
                  key={a.id}
                  src={a.avatar}
                  alt={a.name}
                  title={a.name}
                  className="w-6 h-6 rounded-full border-2 border-white object-cover"
                />
              ))}
              {task.assignees.length > 3 && (
                <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 text-gray-600 text-[10px] font-semibold flex items-center justify-center">
                  +{task.assignees.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
