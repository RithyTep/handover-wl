"use client"

import Image from "next/image"

interface SantaMailModalProps {
  text: string
  sign: string
  onClose: () => void
}

export function SantaMailModal({ text, sign, onClose }: SantaMailModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="mail relative max-w-lg w-full animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mail-inner relative">
          <button
            type="button"
            className="mail-close absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-600 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors z-50"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            aria-label="Close mail"
          >
            ✕
          </button>
          <div className="flex items-center gap-2 mb-4">
            <Image
              src="/icons/christmas/star.svg"
              alt=""
              width={24}
              height={24}
              className="w-6 h-6 opacity-70"
            />
            <p className="mail-title text-xl font-semibold text-red-800">
              Season&apos;s Greetings
            </p>
          </div>
          <p className="mb-4 text-gray-700 leading-relaxed">{text}</p>
          <div className="mt-6 space-y-4">
            <Image
              src="/aba.jpg"
              alt="QR Code"
              width={160}
              height={160}
              className="w-32 sm:w-40 mx-auto object-contain border border-red-200 shadow-md rounded-lg bg-white p-1 sm:p-2"
            />
            <div className="text-right">
              <div className="text-gray-500 text-sm">{sign}</div>
              <div className="text-red-700 text-lg font-medium">Santa Thy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
