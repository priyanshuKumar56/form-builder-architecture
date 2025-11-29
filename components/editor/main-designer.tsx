"use client"

import { useCallback, useMemo, useState } from "react"
import { useEditorStore } from "@/lib/store/editor-store"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { FormFieldRenderer } from "./renderers/form-field-renderer"
import { GripVertical, Plus, Rows, Columns } from "lucide-react"

export function MainDesigner() {
  const {
    formTitle,
    formDescription,
    formLayout,
    setFormTitle,
    setFormDescription,
    setFormLayout,
    elements,
    elementOrder,
    reorderElements,
    selectElement,
    selectedIds,
  } = useEditorStore()

  // Drag and drop reorder within the vertical list
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const handleDragStart = useCallback((index: number) => () => {
    setDragIndex(index)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }, [])

  const handleDrop = useCallback(
    (toIndex: number) => (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      if (dragIndex === null || dragIndex === toIndex) return
      reorderElements(dragIndex, toIndex)
      setDragIndex(null)
    },
    [dragIndex, reorderElements]
  )

  const gridClass = useMemo(() => (formLayout === "two-column" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"), [formLayout])

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="max-w-3xl mx-auto p-6">
        {/* Editable heading and description */}
        <div className="mb-6 space-y-3">
          <Input
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            className="text-2xl h-12 px-3 font-semibold bg-card border-border"
          />
          <Textarea
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            className="min-h-20 bg-card border-border"
          />

          <div className="flex items-center gap-2">
            <Button
              variant={formLayout === "one-column" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFormLayout("one-column")}
              className="gap-2"
            >
              <Rows className="w-4 h-4" /> One column
            </Button>
            <Button
              variant={formLayout === "two-column" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFormLayout("two-column")}
              className="gap-2"
            >
              <Columns className="w-4 h-4" /> Two columns
            </Button>
          </div>
        </div>

        {/* Fields area */}
        <div className={cn(gridClass)} onDragOver={handleDragOver}>
          {elementOrder.map((id, index) => {
            const element = elements[id]
            if (!element || element.visible === false) return null

            const isSelected = selectedIds.includes(id)

            return (
              <div
                key={id}
                className={cn(
                  "group relative bg-card border border-border rounded-md p-3",
                  isSelected && "ring-2 ring-primary"
                )}
                draggable
                onDragStart={handleDragStart(index)}
                onDrop={handleDrop(index)}
                onClick={(e) => selectElement(id, e.metaKey || e.ctrlKey)}
              >
                <div className="absolute -left-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-6 w-6 rounded bg-secondary border border-border flex items-center justify-center cursor-grab">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                <FormFieldRenderer element={element} isEditing />
              </div>
            )
          })}
        </div>

        {/* Empty state */}
        {elementOrder.length === 0 && (
          <div className="border border-dashed border-border rounded-lg p-10 text-center">
            <p className="text-sm text-muted-foreground mb-3">Add fields from the left panel to start building</p>
            <div className="flex items-center justify-center">
              <Plus className="w-4 h-4 mr-2" />
              <span className="text-sm">Use the Components panel</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
