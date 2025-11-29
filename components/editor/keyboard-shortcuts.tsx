"use client"

import { useEffect } from "react"
import { useEditorStore } from "@/lib/store/editor-store"

export function KeyboardShortcuts() {
  const { selectedIds, deleteElement, duplicateElement, undo, redo, togglePreviewMode, setZoom, zoom, clearSelection } =
    useEditorStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey

      // Prevent default for our shortcuts
      const isShortcut = cmdOrCtrl && ["z", "d", "p", "s", "0", "+", "-", "="].includes(e.key.toLowerCase())
      if (isShortcut) e.preventDefault()

      // Delete selected elements
      if ((e.key === "Delete" || e.key === "Backspace") && selectedIds.length > 0) {
        if (document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
          selectedIds.forEach(deleteElement)
        }
      }

      // Undo: Cmd/Ctrl + Z
      if (cmdOrCtrl && e.key.toLowerCase() === "z" && !e.shiftKey) {
        undo()
      }

      // Redo: Cmd/Ctrl + Shift + Z
      if (cmdOrCtrl && e.key.toLowerCase() === "z" && e.shiftKey) {
        redo()
      }

      // Duplicate: Cmd/Ctrl + D
      if (cmdOrCtrl && e.key.toLowerCase() === "d") {
        selectedIds.forEach(duplicateElement)
      }

      // Preview: Cmd/Ctrl + P
      if (cmdOrCtrl && e.key.toLowerCase() === "p") {
        togglePreviewMode()
      }

      // Zoom controls
      if (cmdOrCtrl && (e.key === "+" || e.key === "=")) {
        setZoom(zoom + 0.1)
      }
      if (cmdOrCtrl && e.key === "-") {
        setZoom(zoom - 0.1)
      }
      if (cmdOrCtrl && e.key === "0") {
        setZoom(1)
      }

      // Escape to deselect
      if (e.key === "Escape") {
        clearSelection()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedIds, deleteElement, duplicateElement, undo, redo, togglePreviewMode, setZoom, zoom, clearSelection])

  return null
}
