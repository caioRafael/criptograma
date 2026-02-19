'use client'

import React from "react";

interface ModalProps {
  open: boolean
  onClose?: () => void
  children: React.ReactNode
  closeOnBackdrop?: boolean
}

export function Modal({ open, onClose, children, closeOnBackdrop = true }: ModalProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={closeOnBackdrop && onClose ? onClose : undefined}
      />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-xl shadow-2xl p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

