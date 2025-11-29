"use client"

import { useEditorStore } from "@/lib/store/editor-store"
import { EditorToolbar } from "./toolbar/editor-toolbar"
import { LeftPanel } from "./panels/left-panel"
import { RightPanel } from "./panels/right-panel"
import { EditorCanvas } from "./canvas/editor-canvas"
import { PreviewModal } from "./preview/preview-modal"
import { KeyboardShortcuts } from "./keyboard-shortcuts"

export function FormEditor() {
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode)

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <KeyboardShortcuts />
      <EditorToolbar />

      <div className="flex flex-1 overflow-hidden">
        <LeftPanel />
        <EditorCanvas />
        <RightPanel />
      </div>

      {isPreviewMode && <PreviewModal />}
    </div>
  )
}
