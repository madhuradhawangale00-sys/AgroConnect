'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ZoomIn, ZoomOut, Sprout } from 'lucide-react'
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
    <header className="text-white bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-50">
      <nav className="container max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 bg-emerald-600 rounded-lg text-white group-hover:bg-emerald-500 transition-colors shadow-md">
            <Sprout className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight group-hover:text-emerald-400 transition-colors">
              AgroConnect
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold">
              Buyer Portal
            </span>
          </div>
        </Link>
        
        <div className="flex items-center space-x-3 md:space-x-5">
          <Link href="/bdashboard" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
            Dashboard
          </Link>
          <Link href="/bdashboard/marketplace" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
            Marketplace
          </Link>
          <Link href="/bdashboard/contracts" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
            Contracts
          </Link>
          <Link href="/bdashboard/interests" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
            Proposals
          </Link>

          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
            <button
              onClick={() => changeFontSize(1)}
              className="p-1 text-slate-300 hover:text-emerald-400 hover:bg-slate-700/60 rounded"
              title="Increase text size"
              aria-label="Increase font size"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={() => changeFontSize(-1)}
              className="p-1 text-slate-300 hover:text-emerald-400 hover:bg-slate-700/60 rounded"
              title="Decrease text size"
              aria-label="Decrease font size"
            >
              <ZoomOut size={16} />
            </button>
          </div>

          <GoogleTranslate variant="dropdown" />
          
          <Link href="/" className="text-xs bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/60 px-3 py-1.5 rounded-lg font-semibold transition-colors">
            Exit
          </Link>
        </div>
      </nav>
    </header>
  )
}

export default Header

