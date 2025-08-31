"use client"

import React from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"

type ConfirmModalProps = {
  open: boolean
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  busy?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  open,
  title = "Confirm",
  description,
  confirmText = "Yes",
  cancelText = "Cancel",
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (typeof window === "undefined") return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/50"
            onClick={onCancel}
          />

          <motion.div
            initial={{ y: 10, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-xl p-6"
          >
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            {description && <p className="text-sm text-slate-600 mb-4">{description}</p>}
            <div className="flex justify-end gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                disabled={busy}
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                disabled={busy}
              >
                {busy ? "Processing..." : confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
