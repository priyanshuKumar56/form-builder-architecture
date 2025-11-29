"use client"

import { useState } from "react"
import type React from "react"
import { useEditorStore } from "@/lib/store/editor-store"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Layers,
  Component,
  Search,
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Type,
  TextCursorInput,
  Mail,
  Phone,
  Hash,
  ListFilter,
  CheckSquare,
  Circle,
  ToggleLeft,
  Calendar,
  Upload,
  MousePointer2,
  Heading1,
  AlignLeft,
  Minus,
  Square,
  ImageIcon,
  Star,
  SlidersHorizontal,
  PenTool,
  Trash2,
  Copy,
  MoreHorizontal,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { ElementType, FormElement } from "@/lib/store/editor-store"

const componentCategories = [
  {
    name: "Form Inputs",
    icon: TextCursorInput,
    items: [
      { type: "text-input" as ElementType, name: "Text Input", icon: Type },
      { type: "textarea" as ElementType, name: "Text Area", icon: AlignLeft },
      { type: "email-input" as ElementType, name: "Email", icon: Mail },
      { type: "phone-input" as ElementType, name: "Phone", icon: Phone },
      { type: "number-input" as ElementType, name: "Number", icon: Hash },
    ],
  },
  {
    name: "Selection",
    icon: ListFilter,
    items: [
      { type: "select" as ElementType, name: "Dropdown", icon: ListFilter },
      { type: "checkbox" as ElementType, name: "Checkbox", icon: CheckSquare },
      { type: "radio" as ElementType, name: "Radio", icon: Circle },
      { type: "toggle" as ElementType, name: "Toggle", icon: ToggleLeft },
    ],
  },
  {
    name: "Advanced",
    icon: Calendar,
    items: [
      { type: "date-picker" as ElementType, name: "Date Picker", icon: Calendar },
      { type: "file-upload" as ElementType, name: "File Upload", icon: Upload },
      { type: "rating" as ElementType, name: "Rating", icon: Star },
      { type: "slider" as ElementType, name: "Slider", icon: SlidersHorizontal },
      { type: "signature" as ElementType, name: "Signature", icon: PenTool },
    ],
  },
  {
    name: "Layout & UI",
    icon: Square,
    items: [
      { type: "button" as ElementType, name: "Button", icon: MousePointer2 },
      { type: "heading" as ElementType, name: "Heading", icon: Heading1 },
      { type: "paragraph" as ElementType, name: "Paragraph", icon: AlignLeft },
      { type: "divider" as ElementType, name: "Divider", icon: Minus },
      { type: "container" as ElementType, name: "Container", icon: Square },
      { type: "image" as ElementType, name: "Image", icon: ImageIcon },
    ],
  },
]

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

export function LeftPanel() {
  const {
    leftPanelTab,
    setLeftPanelTab,
    elements,
    elementOrder,
    steps,
    currentStepIndex,
    setCurrentStepIndex,
    selectedIds,
    selectElement,
    addElement,
    deleteElement,
    duplicateElement,
    updateElement,
  } = useEditorStore()

  const [searchQuery, setSearchQuery] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["Form Inputs"])

  const toggleCategory = (name: string) => {
    setExpandedCategories((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]))
  }

  const handleAddComponent = (type: ElementType, name: string) => {
    const size = defaultElementSizes[type]
    const existingCount = Object.values(elements).filter((e) => e.type === type).length

    const newElement: FormElement = {
      id: generateId(),
      type,
      name: `${name} ${existingCount + 1}`,
      label: name,
      placeholder: type.includes("input") || type === "textarea" ? `Enter ${name.toLowerCase()}...` : undefined,
      required: false,
      position: { x: 60, y: 60 + elementOrder.length * 20 },
      size,
      styles: {},
      visible: true,
      locked: false,
    }

    addElement(newElement)
  }

  const filteredCategories = componentCategories
    .map((cat) => ({
      ...cat,
      items: cat.items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())),
    }))
    .filter((cat) => cat.items.length > 0)

  const currentOrder = steps[currentStepIndex]?.elements || elementOrder

  return (
    <div className="w-64 border-r border-border bg-sidebar flex flex-col">
      {/* Panel Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setLeftPanelTab("layers")}
          className={cn(
            "flex-1 px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2",
            leftPanelTab === "layers"
              ? "text-foreground border-b-2 border-primary bg-sidebar-active"
              : "text-muted-foreground hover:text-foreground hover:bg-sidebar-hover",
          )}
        >
          <Layers className="w-4 h-4" />
          Layers
        </button>
        <button
          onClick={() => setLeftPanelTab("components")}
          className={cn(
            "flex-1 px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2",
            leftPanelTab === "components"
              ? "text-foreground border-b-2 border-primary bg-sidebar-active"
              : "text-muted-foreground hover:text-foreground hover:bg-sidebar-hover",
          )}
        >
          <Component className="w-4 h-4" />
          Components
        </button>
      </div>

      {/* Search */}
      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={leftPanelTab === "layers" ? "Search layers..." : "Search components..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-sm bg-input border-border"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {leftPanelTab === "layers" ? (
          <LayersPanel
            elements={elements}
            elementOrder={currentOrder}
            selectedIds={selectedIds}
            selectElement={selectElement}
            deleteElement={deleteElement}
            duplicateElement={duplicateElement}
            updateElement={updateElement}
            searchQuery={searchQuery}
            steps={steps}
            currentStepIndex={currentStepIndex}
            setCurrentStepIndex={setCurrentStepIndex}
          />
        ) : (
          <div className="p-2 space-y-1">
            {filteredCategories.map((category) => (
              <div key={category.name}>
                <button
                  onClick={() => toggleCategory(category.name)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-hover rounded transition-colors"
                >
                  {expandedCategories.includes(category.name) ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                  <category.icon className="w-4 h-4" />
                  <span className="font-medium">{category.name}</span>
                </button>

                {expandedCategories.includes(category.name) && (
                  <div className="ml-4 mt-1 space-y-0.5">
                    {category.items.map((item) => (
                      <button
                        key={item.type}
                        onClick={() => handleAddComponent(item.type, item.name)}
                        className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-foreground hover:bg-sidebar-hover rounded transition-colors group"
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("componentType", item.type)
                          e.dataTransfer.setData("componentName", item.name)
                        }}
                      >
                        <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                        <span>{item.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

interface LayersPanelProps {
  elements: Record<string, FormElement>
  elementOrder: string[]
  selectedIds: string[]
  selectElement: (id: string, multi?: boolean) => void
  deleteElement: (id: string) => void
  duplicateElement: (id: string) => void
  updateElement: (id: string, updates: Partial<FormElement>) => void
  searchQuery: string
  steps: { id: string; name: string; elements: string[] }[]
  currentStepIndex: number
  setCurrentStepIndex: (index: number) => void
}

function LayersPanel({
  elements,
  elementOrder,
  selectedIds,
  selectElement,
  deleteElement,
  duplicateElement,
  updateElement,
  searchQuery,
  steps,
  currentStepIndex,
  setCurrentStepIndex,
}: LayersPanelProps) {
  const filteredOrder = elementOrder.filter((id) => {
    const element = elements[id]
    return element?.name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const getElementIcon = (type: ElementType) => {
    const iconMap: Record<ElementType, typeof Type> = {
      "text-input": Type,
      textarea: AlignLeft,
      "email-input": Mail,
      "phone-input": Phone,
      "number-input": Hash,
      select: ListFilter,
      checkbox: CheckSquare,
      radio: Circle,
      toggle: ToggleLeft,
      "date-picker": Calendar,
      "file-upload": Upload,
      button: MousePointer2,
      heading: Heading1,
      paragraph: AlignLeft,
      divider: Minus,
      container: Square,
      image: ImageIcon,
      rating: Star,
      slider: SlidersHorizontal,
      signature: PenTool,
    }
    return iconMap[type] || Square
  }

  if (filteredOrder.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground text-sm">
        {searchQuery ? "No layers found" : "No elements yet. Drag components to get started."}
      </div>
    )
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="p-2 space-y-2">
        {/* Pages list (nested tree root) */}
        <div className="space-y-1">
          {steps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrentStepIndex(i)}
              className={cn(
                "w-full flex items-center justify-between px-2 py-1 rounded border text-xs",
                i === currentStepIndex ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:bg-sidebar-hover",
              )}
            >
              <span className="font-medium">{s.name}</span>
              <span className={cn("ml-2", i === currentStepIndex ? "opacity-90" : "text-muted-foreground")}>
                {s.elements.length}
              </span>
            </button>
          ))}
        </div>

        {/* Layers list (nested by parent) */}
        {(() => {
          const byParent: Record<string, string[]> = {}
          const ROOT = "__root__"
          filteredOrder.forEach((eid) => {
            const p = elements[eid]?.parentId
            const key = p ?? ROOT
            if (!byParent[key]) byParent[key] = []
            byParent[key].push(eid)
          })

          const renderTree = (parentId: string, depth: number): React.ReactNode[] => {
            const ids = byParent[parentId] || []
            return ids.flatMap((id: string) => {
              const element = elements[id]
              if (!element) return []
              const Icon = getElementIcon(element.type)
              const isSelected = selectedIds.includes(id)
              const row = (
                <div
                  key={id}
                  onClick={(e) => selectElement(id, e.metaKey || e.ctrlKey)}
                  className={cn(
                    "group flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors",
                    isSelected ? "bg-primary/20 text-foreground" : "hover:bg-sidebar-hover text-foreground",
                  )}
                  style={{ paddingLeft: 8 + depth * 12 }}
                >
                  <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="flex-1 text-sm truncate">{element.name}</span>

                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation()
                            updateElement(id, { visible: !element.visible })
                          }}
                        >
                          {element.visible !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">Toggle Visibility</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation()
                            updateElement(id, { locked: !element.locked })
                          }}
                        >
                          {element.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">Toggle Lock</TooltipContent>
                    </Tooltip>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => duplicateElement(id)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteElement(id)} className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )
              return [row, ...renderTree(id, depth + 1)]
            })
          }

          return renderTree(ROOT, 0)
        })()}
      </div>
    </TooltipProvider>
  )
}
