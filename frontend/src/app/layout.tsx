import React from 'react'
import './globals.css'

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-radial from-blue-200 via-blue-100 to-white text-gray-900">
      {children}
    </div>
  )
}