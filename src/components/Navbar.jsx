// src/components/Navbar.jsx
import { useState } from 'react'
import { Search, Filter, Download, UserPlus, ChevronDown, X, Lock } from 'lucide-react'
import useKanbanStore from '../store/kanbanStore'
import { LABEL_OPTIONS } from '../utils/helpers'

export default function Navbar() {
  const {
    members, searchQuery, setSearchQuery,
    filterLabel, setFilterLabel,
    filterMember, setFilterMember,
  } = useKanbanStore()

  const [showFilter, setShowFilter] = useState(false)
  const hasActiveFilter = filterLabel || filterMember

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-3 gap-4">

        {/* Left — Board Name + Team Avatars */}
        <div className="flex items-center gap-4 min-w-0">
          <button className="flex items-center gap-1.5 font-semibold text-gray-800 hover:text-blue-600 transition-colors whitespace-nowrap">
            <Lock size={14} className="text-gray-500" />
            <span>Adhivasindo</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          <div className="flex items-center">
            <div className="flex -space-x-2">
              {members.slice(0, 4).map((m) => (
                <img
                  key={m.id}
                  src={m.avatar}
                  alt={m.name}
                  title={m.name}
                  className="w-7 h-7 rounded-full border-2 border-white object-cover"
                />
              ))}
              {members.length > 4 && (
                <div className="w-7 h-7 rounded-full border-2 border-white bg-blue-100 text-blue-700 text-xs font-semibold flex items-center justify-center">
                  +{members.length - 4}
                </div>
              )}
            </div>
            <button className="ml-2 flex items-center gap-1 text-xs text-gray-500 border border-dashed border-gray-300 rounded-full px-2.5 py-1 hover:border-blue-400 hover:text-blue-600 transition-colors">
              <UserPlus size={12} />
              <span>Invite</span>
            </button>
          </div>
        </div>

        {/* Right — Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">

          {/* Filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition-colors ${hasActiveFilter
                ? 'border-blue-400 bg-blue-50 text-blue-600'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
            >
              <Filter size={14} />
              <span>Filter</span>
              {hasActiveFilter && (
                <span className="bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {(filterLabel ? 1 : 0) + (filterMember ? 1 : 0)}
                </span>
              )}
            </button>

            {showFilter && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowFilter(false)} />
                <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-sm text-gray-800">Filter Tasks</span>
                    <button onClick={() => setShowFilter(false)}>
                      <X size={14} className="text-gray-400 hover:text-gray-600" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Label</label>
                      <select
                        value={filterLabel}
                        onChange={(e) => setFilterLabel(e.target.value)}
                        className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Semua Label</option>
                        {LABEL_OPTIONS.map((l) => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Assignee</label>
                      <select
                        value={filterMember}
                        onChange={(e) => setFilterMember(e.target.value)}
                        className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Semua Anggota</option>
                        {members.map((m) => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                    </div>

                    {hasActiveFilter && (
                      <button
                        onClick={() => { setFilterLabel(''); setFilterMember('') }}
                        className="w-full text-sm text-red-500 hover:text-red-700 py-1 transition-colors"
                      >
                        Hapus Filter
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Export/Import */}
          <button className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            <Download size={14} />
            <span className="hidden sm:inline">Export / Import</span>
          </button>

          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search Tasks"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-8 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 sm:w-52 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <X size={12} className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
