"use client"

import type React from "react"

import { useCallback, useRef, useState } from "react"
import { useEditorStore, type FormElement, type ElementType } from "@/lib/store/editor-store"
import { cn } from "@/lib/utils"
import { CanvasElement } from "./canvas-element"

const generateId = () => Math.random().toString(36).substring(2, 11)

const defaultElementSizes: Record<ElementType, { width: number; height: number }> = {
  "text-input": { width: 320, height: 72 },
  textarea: { width: 320, height: 120 },
  "email-input": { width: 320, height: 72 },
  "phone-input": { width: 320, height: 72 },
  "number-input": { width: 200, height: 72 },
  select: { width: 320, height: 72 },
  checkbox: { width: 200, height: 40 },
  radio: { width: 200, height: 40 },
  toggle: { width: 200, height: 40 },
  "date-picker": { width: 280, height: 72 },
  "file-upload": { width: 320, height: 120 },
  button: { width: 160, height: 44 },
  heading: { width: 400, height: 48 },
  paragraph: { width: 400, height: 72 },
  divider: { width: 320, height: 2 },
  container: { width: 400, height: 300 },
  image: { width: 320, height: 200 },
  rating: { width: 200, height: 40 },
  slider: { width: 280, height: 48 },
  signature: { width: 320, height: 150 },
}

export function EditorCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isPanning, setIsPanning] = useState(false)
  const [startPan, setStartPan] = useState({ x: 0, y: 0 })
  const [isDragOver, setIsDragOver] = useState(false)

  const {
    elements,
    elementOrder,
    selectedIds,
    hoveredId,
    zoom,
    pan,
    setPan,
    showGrid,
    snapToGrid,
    gridSize,
    selectElement,
    clearSelection,
    setHoveredId,
    moveElement,
    resizeElement,
    addElement,
    // form/page meta
    formTitle,
    formDescription,
    setFormTitle,
    setFormDescription,
    steps,
    currentStepIndex,
    artboardWidth,
    artboardPadding,
  } = useEditorStore()

  // Handle panning
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 1 || (e.button === 0 && e.altKey)) {
        setIsPanning(true)
        setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y })
        e.preventDefault()
      }
    },
    [pan],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) {
        setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y })
      }
    },
    [isPanning, startPan, setPan],
  )

  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
  }, [])

  // Handle canvas click (deselect)
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === canvasRef.current || (e.target as HTMLElement).dataset.canvas) {
        clearSelection()
      }
    },
    [clearSelection],
  )

  // Handle drag and drop from component library
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const type = e.dataTransfer.getData("componentType") as ElementType
      const name = e.dataTransfer.getData("componentName")

      if (!type || !name) return

      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = (e.clientX - rect.left - pan.x) / zoom
      const y = (e.clientY - rect.top - pan.y) / zoom

      const snappedX = snapToGrid ? Math.round(x / gridSize) * gridSize : x
      const snappedY = snapToGrid ? Math.round(y / gridSize) * gridSize : y

      const size = defaultElementSizes[type]
      const existingCount = Object.values(elements).filter((el) => el.type === type).length

      const newElement: FormElement = {
        id: generateId(),
        type,
        name: `${name} ${existingCount + 1}`,
        label: name,
        placeholder: type.includes("input") || type === "textarea" ? `Enter ${name.toLowerCase()}...` : undefined,
        required: false,
        position: { x: snappedX, y: snappedY },
        size,
        styles: {},
        visible: true,
        locked: false,
      }

      addElement(newElement)
    },
    [pan, zoom, snapToGrid, gridSize, elements, addElement],
  )

  // Handle wheel for zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -0.1 : 0.1
        useEditorStore.getState().setZoom(zoom + delta)
      }
    },
    [zoom],
  )

  return (
    <div
      className="flex-1 overflow-hidden bg-canvas-bg relative"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Canvas Container */}
      <div
        ref={canvasRef}
        className={cn(
          "absolute inset-0 origin-top-left transition-colors",
          showGrid && "canvas-grid",
          isDragOver && "bg-primary/5",
        )}
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          cursor: isPanning ? "grabbing" : "default",
        }}
        onClick={handleCanvasClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-canvas="true"
      >
        {/* Artboard */}
        <div
          className="absolute bg-card border border-border rounded-lg shadow-2xl"
          style={{
            left: 40,
            top: 40,
            width: artboardWidth,
            minHeight: 600,
            padding: artboardPadding,
          }}
          data-canvas="true"
        >
          {/* Form Title */}
          <div className="mb-8" data-canvas="true">
            <h1
              className="text-2xl font-semibold text-foreground mb-2 outline-none"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => setFormTitle(e.currentTarget.textContent ?? "")}
            >
              {formTitle}
            </h1>
            <p
              className="text-sm text-muted-foreground outline-none"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => setFormDescription(e.currentTarget.textContent ?? "")}
            >
              {formDescription}
            </p>
          </div>

          {/* Elements (current page only) */}
          {(steps[currentStepIndex]?.elements || elementOrder).map((id) => {
            const element = elements[id]
            if (!element || element.visible === false) return null

            return (
              <CanvasElement
                key={id}
                element={element}
                isSelected={selectedIds.includes(id)}
                isHovered={hoveredId === id}
                onSelect={(multi) => selectElement(id, multi)}
                onHover={(hovered) => setHoveredId(hovered ? id : null)}
                onMove={(position) => moveElement(id, position)}
                onResize={(size) => resizeElement(id, size)}
                zoom={zoom}
              />
            )
          })}
        </div>
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 bg-card/80 backdrop-blur border border-border rounded-md px-3 py-1.5 text-xs text-muted-foreground">
        {Math.round(zoom * 100)}%
      </div>

      {/* Empty state */}
      {elementOrder.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="text-lg font-medium text-foreground mb-1">Start building your form</p>
            <p className="text-sm text-muted-foreground">Drag components from the left panel or click to add</p>
          </div>
        </div>
      )}
    </div>
  )
}
