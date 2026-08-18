'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ZoomIn, ZoomOut } from 'lucide-react'
import GoogleTranslate from '@/components/GoogleTranslate'

const Header = () => {
  const [fontSize, setFontSize] = useState(16)

  useEffect(() => {
    const savedFontSize = parseInt(localStorage.getItem('fontSize') || '16', 10)
    setFontSize(savedFontSize)
    document.documentElement.style.fontSize = `${savedFontSize}px`
  }, [])

  const changeFontSize = (delta: number) => {
    const newSize = Math.max(12, Math.min(20, fontSize + delta))
    setFontSize(newSize)
    document.documentElement.style.fontSize = `${newSize}px`
    localStorage.setItem('fontSize', newSize.toString())
  }

  return (
    <header className="text-white bg-transparent"> {/* Transparent header */}
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          AgroConnect
        </Link>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => changeFontSize(1)}
            className="p-2 rounded-full hover:bg-green-700"
            aria-label="Increase font size"
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={() => changeFontSize(-1)}
            className="p-2 rounded-full hover:bg-green-700"
            aria-label="Decrease font size"
          >
            <ZoomOut size={20} />
          </button>
          <GoogleTranslate />
          <Link href="/bdashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link href="/login" className="hover:underline">
            Logout
          </Link>
        </div>
      </nav>
    </header>
  )
}

export default Header
