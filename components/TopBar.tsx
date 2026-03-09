'use client'

export default function TopBar() {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
      <span className="text-lg font-bold text-violet-900 md:invisible">ROGI</span>
      <div className="flex items-center gap-5 ml-auto">
        <a href="tel:1-800-000-0000" className="text-sm text-violet-700 font-medium hover:text-violet-900 transition-colors">
          1-800-000-0000
        </a>
        <button className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          Help
        </button>
      </div>
    </div>
  )
}
