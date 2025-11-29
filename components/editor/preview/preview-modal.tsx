"use client"

import { useEditorStore } from "@/lib/store/editor-store"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Monitor, Tablet, Smartphone, ExternalLink } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { FormFieldRenderer } from "../renderers/form-field-renderer"

type PreviewDevice = "desktop" | "tablet" | "mobile"

const deviceWidths: Record<PreviewDevice, number> = {
  desktop: 800,
  tablet: 768,
  mobile: 375,
}

export function PreviewModal() {
  const { togglePreviewMode, elements, elementOrder, projectName } = useEditorStore()
  const [device, setDevice] = useState<PreviewDevice>("desktop")

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-14 bg-sidebar border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-medium text-foreground">{projectName} - Preview</h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Device switcher */}
          <div className="flex items-center bg-secondary rounded-md p-0.5">
            <Button
              variant={device === "desktop" ? "default" : "ghost"}
              size="icon"
              className={cn("h-7 w-7", device === "desktop" && "bg-primary")}
              onClick={() => setDevice("desktop")}
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={device === "tablet" ? "default" : "ghost"}
              size="icon"
              className={cn("h-7 w-7", device === "tablet" && "bg-primary")}
              onClick={() => setDevice("tablet")}
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              variant={device === "mobile" ? "default" : "ghost"}
              size="icon"
              className={cn("h-7 w-7", device === "mobile" && "bg-primary")}
              onClick={() => setDevice("mobile")}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>

          <div className="h-4 w-px bg-border mx-2" />

          <Button variant="ghost" size="sm" className="gap-2">
            <ExternalLink className="w-4 h-4" />
            Open in new tab
          </Button>

          <Button variant="ghost" size="icon" onClick={togglePreviewMode}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="mt-14 w-full h-[calc(100%-3.5rem)] flex items-center justify-center p-8">
        <div
          className="bg-card rounded-lg shadow-2xl transition-all duration-300 overflow-hidden"
          style={{ width: deviceWidths[device], maxHeight: "90%" }}
        >
          <ScrollArea className="h-full max-h-[80vh]">
            <div className="p-8">
              <div className="mb-8">
                <h1 className="text-2xl font-semibold text-foreground mb-2">Contact Form</h1>
                <p className="text-sm text-muted-foreground">Fill out the form below to get in touch.</p>
              </div>

              <div className="space-y-6">
                {elementOrder.map((id) => {
                  const element = elements[id]
                  if (!element || element.visible === false) return null

                  return (
                    <div key={id}>
                      <FormFieldRenderer element={element} />
                    </div>
                  )
                })}

                {elementOrder.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No form elements yet.</p>
                    <p className="text-sm">Add components to see them here.</p>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
