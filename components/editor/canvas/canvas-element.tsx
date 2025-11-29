"use client"

import type React from "react"

import { useCallback, useState, useRef } from "react"
import type { FormElement } from "@/lib/store/editor-store"
import { cn } from "@/lib/utils"
import { FormFieldRenderer } from "../renderers/form-field-renderer"

interface CanvasElementProps {
  element: FormElement
  isSelected: boolean
  isHovered: boolean
  onSelect: (multi: boolean) => void
  onHover: (hovered: boolean) => void
  onMove: (position: { x: number; y: number }) => void
  onResize: (size: { width: number; height: number }) => void
  zoom: number
}

export function CanvasElement({
  element,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  onMove,
  onResize,
  zoom,
}: CanvasElementProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState<string | null>(null)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [initialPos, setInitialPos] = useState({ x: 0, y: 0 })
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 })

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (element.locked) return
      e.stopPropagation()

      onSelect(e.metaKey || e.ctrlKey)

      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
      setInitialPos({ ...element.position })
    },
    [element.locked, element.position, onSelect],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging && !element.locked) {
        const deltaX = (e.clientX - dragStart.x) / zoom
        const deltaY = (e.clientY - dragStart.y) / zoom

        onMove({
          x: initialPos.x + deltaX,
          y: initialPos.y + deltaY,
        })
      }

      if (isResizing && !element.locked) {
        const deltaX = (e.clientX - dragStart.x) / zoom
        const deltaY = (e.clientY - dragStart.y) / zoom

        let newWidth = initialSize.width
        let newHeight = initialSize.height
        let newX = initialPos.x
        let newY = initialPos.y

        if (resizeHandle?.includes("e")) newWidth = initialSize.width + deltaX
        if (resizeHandle?.includes("w")) {
          newWidth = initialSize.width - deltaX
          newX = initialPos.x + deltaX
        }
        if (resizeHandle?.includes("s")) newHeight = initialSize.height + deltaY
        if (resizeHandle?.includes("n")) {
          newHeight = initialSize.height - deltaY
          newY = initialPos.y + deltaY
        }

        onResize({
          width: Math.max(40, newWidth),
          height: Math.max(20, newHeight),
        })

        if (resizeHandle?.includes("w") || resizeHandle?.includes("n")) {
          onMove({ x: newX, y: newY })
        }
      }
    },
    [isDragging, isResizing, element.locked, dragStart, initialPos, initialSize, resizeHandle, zoom, onMove, onResize],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsResizing(false)
    setResizeHandle(null)
  }, [])

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent, handle: string) => {
      if (element.locked) return
      e.stopPropagation()

      setIsResizing(true)
      setResizeHandle(handle)
      setDragStart({ x: e.clientX, y: e.clientY })
      setInitialSize({ ...element.size })
      setInitialPos({ ...element.position })
    },
    [element.locked, element.size, element.position],
  )

  const resizeHandles = ["nw", "n", "ne", "w", "e", "sw", "s", "se"]

  const getHandleStyle = (handle: string) => {
    const baseStyle = "absolute w-2 h-2 bg-primary border border-primary-foreground rounded-sm"
    const styles: Record<string, string> = {
      nw: "top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nw-resize",
      n: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-n-resize",
      ne: "top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-ne-resize",
      w: "top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 cursor-w-resize",
      e: "top-1/2 right-0 translate-x-1/2 -translate-y-1/2 cursor-e-resize",
      sw: "bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-sw-resize",
      s: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-s-resize",
      se: "bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-se-resize",
    }
    return cn(baseStyle, styles[handle])
  }

  return (
    <div
      ref={elementRef}
      className={cn(
        "absolute transition-shadow",
        isSelected && "ring-2 ring-primary ring-offset-1 ring-offset-background",
        isHovered && !isSelected && "ring-1 ring-primary/50",
        element.locked && "opacity-70 cursor-not-allowed",
        isDragging && "cursor-grabbing",
      )}
      style={{
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        ...element.styles,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseEnter={() => onHover(true)}
      onMouseOut={() => onHover(false)}
    >
      <FormFieldRenderer element={element} isEditing />

      {/* Resize handles */}
      {isSelected && !element.locked && (
        <>
          {resizeHandles.map((handle) => (
            <div
              key={handle}
              className={getHandleStyle(handle)}
              onMouseDown={(e) => handleResizeMouseDown(e, handle)}
            />
          ))}
        </>
      )}
    </div>
  )
}
