// src/utils/helpers.js

/**
 * Format tanggal dari YYYY-MM-DD ke "20 Aug, 2025"
 */
export function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-GB', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  })
}

/**
 * Hitung apakah due date sudah lewat
 */
export function isOverdue(dateStr) {
  if (!dateStr) return false
  return new Date(dateStr) < new Date()
}

/**
 * Config warna untuk tiap label
 */
export const LABEL_CONFIG = {
  Feature:   { bg: 'bg-blue-100',   text: 'text-blue-700',   bar: 'bg-blue-500'   },
  Bug:       { bg: 'bg-pink-100',   text: 'text-pink-700',   bar: 'bg-pink-500'   },
  Issue:     { bg: 'bg-orange-100', text: 'text-orange-700', bar: 'bg-orange-500' },
  Undefined: { bg: 'bg-gray-100',   text: 'text-gray-600',   bar: 'bg-gray-400'   },
}

export const LABEL_OPTIONS   = ['Feature', 'Bug', 'Issue', 'Undefined']
export const PRIORITY_OPTIONS = ['Low', 'Medium', 'High']

export const PRIORITY_CONFIG = {
  Low:    { bg: 'bg-green-100',  text: 'text-green-700'  },
  Medium: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  High:   { bg: 'bg-red-100',   text: 'text-red-700'    },
}
