"use client"

import { useState } from "react"
import { useEditorStore } from "@/lib/store/editor-store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Monitor, Tablet, Smartphone, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { FormFieldRenderer } from "@/components/editor/renderers/form-field-renderer"

export default function PreviewDashboardPage() {
  const { projectName, formTitle, formDescription, steps, elements, elementOrder } = useEditorStore()
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [pageIndex, setPageIndex] = useState(0)

  const deviceWidths = { desktop: 800, tablet: 768, mobile: 375 }
  const currentIds = (steps[pageIndex]?.elements || elementOrder)

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border bg-sidebar">
        <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
          <h1 className="text-sm text-foreground">{projectName} - Preview Dashboard</h1>
          <div className="flex items-center bg-secondary rounded-md p-0.5">
            <Button variant={device === "desktop" ? "default" : "ghost"} size="icon" className={cn("h-7 w-7", device === "desktop" && "bg-primary")} onClick={() => setDevice("desktop")}>
              <Monitor className="w-4 h-4" />
            </Button>
            <Button variant={device === "tablet" ? "default" : "ghost"} size="icon" className={cn("h-7 w-7", device === "tablet" && "bg-primary")} onClick={() => setDevice("tablet")}>
              <Tablet className="w-4 h-4" />
            </Button>
            <Button variant={device === "mobile" ? "default" : "ghost"} size="icon" className={cn("h-7 w-7", device === "mobile" && "bg-primary")} onClick={() => setDevice("mobile")}>
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <Tabs defaultValue="preview">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="responses">Received Data</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-4">
            <div className="w-full flex items-start gap-6">
              <div className="flex-1 flex items-center justify-center">
                <div className="bg-card rounded-lg shadow-2xl transition-all duration-300 overflow-hidden" style={{ width: deviceWidths[device], maxHeight: "80vh" }}>
                  <ScrollArea className="h-full">
                    <div className="p-8">
                      <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-foreground mb-2">{formTitle}</h2>
                        <p className="text-sm text-muted-foreground">{formDescription}</p>
                      </div>

                      <div className="space-y-6">
                        {currentIds.map((id) => {
                          const element = elements[id]
                          if (!element || element.visible === false) return null
                          return (
                            <div key={id}>
                              <FormFieldRenderer element={element} />
                            </div>
                          )
                        })}

                        {currentIds.length === 0 && (
                          <div className="text-center py-12 text-muted-foreground">
                            <p>No form elements yet.</p>
                            <p className="text-sm">Add components to see them here.</p>
                          </div>
                        )}
                      </div>

                      {steps.length > 1 && (
                        <div className="mt-8 flex items-center justify-between">
                          <Button variant="secondary" size="sm" onClick={() => setPageIndex((p) => Math.max(0, p - 1))} disabled={pageIndex === 0} className="gap-2">
                            <ChevronLeft className="w-4 h-4" /> Prev
                          </Button>
                          <div className="text-xs text-muted-foreground">Page {pageIndex + 1} of {steps.length}</div>
                          <Button size="sm" onClick={() => setPageIndex((p) => Math.min(steps.length - 1, p + 1))} className="gap-2">
                            {pageIndex === steps.length - 1 ? "Submit" : (<><span>Next</span> <ChevronRight className="w-4 h-4" /></>)}
                          </Button>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              {/* Pages quick switch on dashboard */}
              <div className="w-64 border border-border rounded-md bg-card p-3">
                <p className="text-xs text-muted-foreground mb-2">Pages</p>
                <div className="flex flex-col gap-1">
                  {steps.map((s, i) => (
                    <button key={s.id} onClick={() => setPageIndex(i)} className={cn("text-xs px-2 py-1 rounded border text-left", i === pageIndex ? "bg-primary text-primary-foreground border-primary" : "border-border")}>{s.name}</button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="responses" className="mt-4">
            <div className="border border-border rounded-md bg-card p-6 text-sm text-muted-foreground">
              Placeholder for Received Data. We can integrate submission storage and list entries here.
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <div className="border border-border rounded-md bg-card p-6 text-sm text-muted-foreground">
              Placeholder for Analytics. Charts like completion rate, drop-off per page, response time, etc.
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
