"use client"

import { useState } from "react"
import Link from "next/link"
import { useEditorStore } from "@/lib/store/editor-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ChevronDown,
  Undo2,
  Redo2,
  Eye,
  Monitor,
  Tablet,
  Smartphone,
  Download,
  Share2,
  Settings,
  Grid3X3,
  Magnet,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Save,
  FolderOpen,
  FilePlus,
  Code,
  Rocket,
  Check,
  Plus,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ExportModal } from "../export/export-modal"

type Breakpoint = "desktop" | "tablet" | "mobile"

export function EditorToolbar() {
  const {
    projectName,
    setProjectName,
    zoom,
    setZoom,
    showGrid,
    toggleGrid,
    snapToGrid,
    toggleSnapToGrid,
    togglePreviewMode,
    undo,
    redo,
    history,
    historyIndex,
    // pages/meta
    steps,
    currentStepIndex,
    setCurrentStepIndex,
    addStep,
    removeStep,
    renameStep,
    artboardWidth,
    setArtboardWidth,
  } = useEditorStore()

  const [isEditingName, setIsEditingName] = useState(false)
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop")
  const [showExportModal, setShowExportModal] = useState(false)

  const canUndo = historyIndex >= 0
  const canRedo = historyIndex < history.length - 1

  return (
    <TooltipProvider delayDuration={300}>
      <header className="h-12 border-b border-border bg-sidebar flex items-center justify-between px-2 gap-2">
        {/* Left Section - Logo & File Menu */}
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 px-2 h-8">
                <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">FC</span>
                </div>
                <span className="text-sm font-medium text-foreground">FormCraft</span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem>
                <FilePlus className="w-4 h-4 mr-2" />
                New Project
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FolderOpen className="w-4 h-4 mr-2" />
                Open Project
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Save className="w-4 h-4 mr-2" />
                Save
                <span className="ml-auto text-xs text-muted-foreground">⌘S</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowExportModal(true)}>
                <Download className="w-4 h-4 mr-2" />
                Export & Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Code className="w-4 h-4 mr-2" />
                  Quick Export
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>HTML/CSS/JS</DropdownMenuItem>
                  <DropdownMenuItem>React Component</DropdownMenuItem>
                  <DropdownMenuItem>Vue Component</DropdownMenuItem>
                  <DropdownMenuItem>JSON Schema</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="h-4 w-px bg-border mx-1" />

          {/* Project Name */}
          {isEditingName ? (
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => e.key === "Enter" && setIsEditingName(false)}
              className="h-7 w-40 text-sm bg-input border-border"
              autoFocus
            />
          ) : (
            <button
              onClick={() => setIsEditingName(true)}
              className="text-sm text-foreground hover:text-primary transition-colors px-2 py-1 rounded hover:bg-secondary"
            >
              {projectName}
            </button>
          )}
        </div>

        {/* Center Section - History, Pages & Viewport */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={undo} disabled={!canUndo}>
                <Undo2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo (⌘Z)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={redo} disabled={!canRedo}>
                <Redo2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo (⌘⇧Z)</TooltipContent>
          </Tooltip>

          <div className="h-4 w-px bg-border mx-2" />

          {/* Page controls */}
          <div className="flex items-center gap-1">
            <select
              className="h-7 text-sm bg-secondary border border-border rounded px-2"
              value={currentStepIndex}
              onChange={(e) => setCurrentStepIndex(Number(e.target.value))}
            >
              {steps.map((s, i) => (
                <option key={s.id} value={i}>
                  {s.name}
                </option>
              ))}
            </select>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => addStep()}>
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => removeStep(currentStepIndex)}
              disabled={steps.length <= 1}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="h-4 w-px bg-border mx-2" />

          {/* Responsive Breakpoints */}
          <div className="flex items-center bg-secondary rounded-md p-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={breakpoint === "desktop" ? "default" : "ghost"}
                  size="icon"
                  className={cn("h-7 w-7", breakpoint === "desktop" && "bg-primary")}
                  onClick={() => setBreakpoint("desktop")}
                >
                  <Monitor className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Desktop (1440px)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={breakpoint === "tablet" ? "default" : "ghost"}
                  size="icon"
                  className={cn("h-7 w-7", breakpoint === "tablet" && "bg-primary")}
                  onClick={() => setBreakpoint("tablet")}
                >
                  <Tablet className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Tablet (768px)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={breakpoint === "mobile" ? "default" : "ghost"}
                  size="icon"
                  className={cn("h-7 w-7", breakpoint === "mobile" && "bg-primary")}
                  onClick={() => setBreakpoint("mobile")}
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Mobile (375px)</TooltipContent>
            </Tooltip>
          </div>

          <div className="h-4 w-px bg-border mx-2" />

          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(zoom - 0.1)}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 px-2 min-w-[60px]">
                  <span className="text-xs">{Math.round(zoom * 100)}%</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {[50, 75, 100, 125, 150, 200].map((z) => (
                  <DropdownMenuItem key={z} onClick={() => setZoom(z / 100)}>
                    {z === Math.round(zoom * 100) && <Check className="w-3 h-3 mr-2" />}
                    <span className={z !== Math.round(zoom * 100) ? "ml-5" : ""}>{z}%</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(zoom + 0.1)}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(1)}>
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Fit to Screen</TooltipContent>
            </Tooltip>
          </div>

          <div className="h-4 w-px bg-border mx-2" />

          {/* Grid Controls */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={showGrid ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={toggleGrid}>
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Grid</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={snapToGrid ? "secondary" : "ghost"}
                size="icon"
                className="h-7 w-7"
                onClick={toggleSnapToGrid}
              >
                <Magnet className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Snap to Grid</TooltipContent>
          </Tooltip>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8">
            <Link href="/workflow" className="text-sm">Workflow</Link>
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 gap-2" onClick={togglePreviewMode}>
                <Eye className="w-4 h-4" />
                <span className="text-sm">Preview</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Preview Form (⌘P)</TooltipContent>
          </Tooltip>

          <Button variant="ghost" size="sm" className="h-8 gap-2" onClick={() => setShowExportModal(true)}>
            <Share2 className="w-4 h-4" />
            <span className="text-sm">Share</span>
          </Button>

          <Button
            size="sm"
            className="h-8 gap-2 bg-primary hover:bg-primary/90"
            onClick={() => setShowExportModal(true)}
          >
            <Rocket className="w-4 h-4" />
            <span className="text-sm">Publish</span>
          </Button>

          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <ExportModal open={showExportModal} onClose={() => setShowExportModal(false)} />
    </TooltipProvider>
  )
}
