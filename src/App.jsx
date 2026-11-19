// src/App.jsx
import { Toaster } from 'sonner'
import Navbar from './components/Navbar'
import Board from './components/Board'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Board />
      </main>
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'text-sm font-medium',
          duration: 2500,
        }}
        richColors
      />
    </div>
  )
}
