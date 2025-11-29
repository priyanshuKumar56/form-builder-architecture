"use client"

import { useEditorStore } from "@/lib/store/editor-store"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Paintbrush, Settings2, Workflow, AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react"

interface PanelProps {
  element: NonNullable<ReturnType<typeof useEditorStore.getState>["elements"][string]>
  updateElement: (id: string, updates: Partial<(typeof PanelProps)["element"]>) => void
}

export function RightPanel() {
  const { rightPanelTab, setRightPanelTab, elements, selectedIds, updateElement } = useEditorStore()

  const selectedElement = selectedIds.length === 1 ? elements[selectedIds[0]] : null

  return (
    <div className="w-72 border-l border-border bg-sidebar flex flex-col">
      {/* Panel Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setRightPanelTab("design")}
          className={cn(
            "flex-1 px-3 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2",
            rightPanelTab === "design"
              ? "text-foreground border-b-2 border-primary bg-sidebar-active"
              : "text-muted-foreground hover:text-foreground hover:bg-sidebar-hover",
          )}
        >
          <Paintbrush className="w-4 h-4" />
          Design
        </button>
        <button
          onClick={() => setRightPanelTab("settings")}
          className={cn(
            "flex-1 px-3 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2",
            rightPanelTab === "settings"
              ? "text-foreground border-b-2 border-primary bg-sidebar-active"
              : "text-muted-foreground hover:text-foreground hover:bg-sidebar-hover",
          )}
        >
          <Settings2 className="w-4 h-4" />
          Settings
        </button>
        <button
          onClick={() => setRightPanelTab("logic")}
          className={cn(
            "flex-1 px-3 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2",
            rightPanelTab === "logic"
              ? "text-foreground border-b-2 border-primary bg-sidebar-active"
              : "text-muted-foreground hover:text-foreground hover:bg-sidebar-hover",
          )}
        >
          <Workflow className="w-4 h-4" />
          Logic
        </button>
      </div>

      <ScrollArea className="flex-1">
        {!selectedElement ? (
          <div className="p-4 text-center text-muted-foreground text-sm">Select an element to edit its properties</div>
        ) : rightPanelTab === "design" ? (
          <DesignPanel element={selectedElement} updateElement={updateElement} />
        ) : rightPanelTab === "settings" ? (
          <SettingsPanel element={selectedElement} updateElement={updateElement} />
        ) : (
          <LogicPanel element={selectedElement} updateElement={updateElement} />
        )}
      </ScrollArea>
    </div>
  )
}

function DesignPanel({ element, updateElement }: PanelProps) {
  const update = (updates: Partial<(typeof PanelProps)["element"]>) => updateElement(element.id, updates)
  const updateStyles = (styles: Partial<(typeof PanelProps)["element"]["styles"]>) =>
    update({ styles: { ...element.styles, ...styles } })

  return (
    <TooltipProvider delayDuration={300}>
      <div className="p-3">
        <Accordion
          type="multiple"
          defaultValue={["layout", "spacing", "typography", "background", "border"]}
          className="space-y-2"
        >
          {/* Layout */}
          <AccordionItem value="layout" className="border-border">
            <AccordionTrigger className="text-sm py-2 hover:no-underline">Layout</AccordionTrigger>
            <AccordionContent className="space-y-3 pb-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Width</Label>
                  <div className="flex items-center gap-1 mt-1">
                    <Input
                      type="number"
                      value={element.size.width}
                      onChange={(e) => update({ size: { ...element.size, width: Number(e.target.value) } })}
                      className="h-8 text-xs bg-input"
                    />
                    <span className="text-xs text-muted-foreground">px</span>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Height</Label>
                  <div className="flex items-center gap-1 mt-1">
                    <Input
                      type="number"
                      value={element.size.height}
                      onChange={(e) => update({ size: { ...element.size, height: Number(e.target.value) } })}
                      className="h-8 text-xs bg-input"
                    />
                    <span className="text-xs text-muted-foreground">px</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground">X Position</Label>
                  <div className="flex items-center gap-1 mt-1">
                    <Input
                      type="number"
                      value={element.position.x}
                      onChange={(e) => update({ position: { ...element.position, x: Number(e.target.value) } })}
                      className="h-8 text-xs bg-input"
                    />
                    <span className="text-xs text-muted-foreground">px</span>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Y Position</Label>
                  <div className="flex items-center gap-1 mt-1">
                    <Input
                      type="number"
                      value={element.position.y}
                      onChange={(e) => update({ position: { ...element.position, y: Number(e.target.value) } })}
                      className="h-8 text-xs bg-input"
                    />
                    <span className="text-xs text-muted-foreground">px</span>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Spacing */}
          <AccordionItem value="spacing" className="border-border">
            <AccordionTrigger className="text-sm py-2 hover:no-underline">Spacing</AccordionTrigger>
            <AccordionContent className="space-y-3 pb-3">
              <div>
                <Label className="text-xs text-muted-foreground">Padding</Label>
                <div className="mt-1">
                  <Input
                    placeholder="e.g., 16px or 8px 16px"
                    value={element.styles.padding || ""}
                    onChange={(e) => updateStyles({ padding: e.target.value })}
                    className="h-8 text-xs bg-input"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Margin</Label>
                <div className="mt-1">
                  <Input
                    placeholder="e.g., 0px or 8px auto"
                    value={element.styles.margin || ""}
                    onChange={(e) => updateStyles({ margin: e.target.value })}
                    className="h-8 text-xs bg-input"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Typography */}
          <AccordionItem value="typography" className="border-border">
            <AccordionTrigger className="text-sm py-2 hover:no-underline">Typography</AccordionTrigger>
            <AccordionContent className="space-y-3 pb-3">
              <div>
                <Label className="text-xs text-muted-foreground">Font Size</Label>
                <Select value={element.styles.fontSize || "14px"} onValueChange={(v) => updateStyles({ fontSize: v })}>
                  <SelectTrigger className="h-8 text-xs bg-input mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["12px", "14px", "16px", "18px", "20px", "24px", "32px", "48px"].map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Font Weight</Label>
                <Select
                  value={element.styles.fontWeight || "400"}
                  onValueChange={(v) => updateStyles({ fontWeight: v })}
                >
                  <SelectTrigger className="h-8 text-xs bg-input mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      { value: "300", label: "Light" },
                      { value: "400", label: "Regular" },
                      { value: "500", label: "Medium" },
                      { value: "600", label: "Semibold" },
                      { value: "700", label: "Bold" },
                    ].map((weight) => (
                      <SelectItem key={weight.value} value={weight.value}>
                        {weight.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Text Color</Label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={element.styles.color || "#ffffff"}
                    onChange={(e) => updateStyles({ color: e.target.value })}
                    className="w-8 h-8 rounded border border-border cursor-pointer"
                  />
                  <Input
                    value={element.styles.color || "#ffffff"}
                    onChange={(e) => updateStyles({ color: e.target.value })}
                    className="h-8 text-xs bg-input flex-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Text Align</Label>
                <div className="flex gap-1 mt-1">
                  {[
                    { value: "left", icon: AlignLeft },
                    { value: "center", icon: AlignCenter },
                    { value: "right", icon: AlignRight },
                    { value: "justify", icon: AlignJustify },
                  ].map(({ value, icon: Icon }) => (
                    <Button
                      key={value}
                      variant={element.styles.textAlign === value ? "secondary" : "ghost"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateStyles({ textAlign: value })}
                    >
                      <Icon className="w-4 h-4" />
                    </Button>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Background */}
          <AccordionItem value="background" className="border-border">
            <AccordionTrigger className="text-sm py-2 hover:no-underline">Background</AccordionTrigger>
            <AccordionContent className="space-y-3 pb-3">
              <div>
                <Label className="text-xs text-muted-foreground">Background Color</Label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={element.styles.backgroundColor || "#1a1a2e"}
                    onChange={(e) => updateStyles({ backgroundColor: e.target.value })}
                    className="w-8 h-8 rounded border border-border cursor-pointer"
                  />
                  <Input
                    value={element.styles.backgroundColor || ""}
                    placeholder="transparent"
                    onChange={(e) => updateStyles({ backgroundColor: e.target.value })}
                    className="h-8 text-xs bg-input flex-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Opacity</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Slider
                    value={[element.styles.opacity ?? 100]}
                    onValueChange={([v]) => updateStyles({ opacity: v })}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground w-8">{element.styles.opacity ?? 100}%</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Border */}
          <AccordionItem value="border" className="border-border">
            <AccordionTrigger className="text-sm py-2 hover:no-underline">Border</AccordionTrigger>
            <AccordionContent className="space-y-3 pb-3">
              <div>
                <Label className="text-xs text-muted-foreground">Border Radius</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    placeholder="e.g., 8px or 50%"
                    value={element.styles.borderRadius || ""}
                    onChange={(e) => updateStyles({ borderRadius: e.target.value })}
                    className="h-8 text-xs bg-input flex-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Border Width</Label>
                <Input
                  placeholder="e.g., 1px"
                  value={element.styles.borderWidth || ""}
                  onChange={(e) => updateStyles({ borderWidth: e.target.value })}
                  className="h-8 text-xs bg-input mt-1"
                />
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Border Color</Label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={element.styles.borderColor || "#333344"}
                    onChange={(e) => updateStyles({ borderColor: e.target.value })}
                    className="w-8 h-8 rounded border border-border cursor-pointer"
                  />
                  <Input
                    value={element.styles.borderColor || ""}
                    placeholder="transparent"
                    onChange={(e) => updateStyles({ borderColor: e.target.value })}
                    className="h-8 text-xs bg-input flex-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Border Style</Label>
                <Select
                  value={element.styles.borderStyle || "solid"}
                  onValueChange={(v) => updateStyles({ borderStyle: v })}
                >
                  <SelectTrigger className="h-8 text-xs bg-input mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["none", "solid", "dashed", "dotted", "double"].map((style) => (
                      <SelectItem key={style} value={style}>
                        {style}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Box Shadow</Label>
                <Input
                  placeholder="e.g., 0 4px 6px rgba(0,0,0,0.1)"
                  value={element.styles.boxShadow || ""}
                  onChange={(e) => updateStyles({ boxShadow: e.target.value })}
                  className="h-8 text-xs bg-input mt-1"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </TooltipProvider>
  )
}

function SettingsPanel({ element, updateElement }: PanelProps) {
  const update = (updates: Partial<(typeof PanelProps)["element"]>) => updateElement(element.id, updates)

  const isFormField = [
    "text-input",
    "textarea",
    "email-input",
    "phone-input",
    "number-input",
    "select",
    "checkbox",
    "radio",
    "toggle",
    "date-picker",
    "file-upload",
    "rating",
    "slider",
    "signature",
  ].includes(element.type)

  return (
    <div className="p-3 space-y-4">
      {/* Element Name */}
      <div>
        <Label className="text-xs text-muted-foreground">Element Name</Label>
        <Input
          value={element.name}
          onChange={(e) => update({ name: e.target.value })}
          className="h-8 text-xs bg-input mt-1"
        />
      </div>

      {isFormField && (
        <>
          {/* Label */}
          <div>
            <Label className="text-xs text-muted-foreground">Label</Label>
            <Input
              value={element.label || ""}
              onChange={(e) => update({ label: e.target.value })}
              placeholder="Field label..."
              className="h-8 text-xs bg-input mt-1"
            />
          </div>

          {/* Placeholder */}
          {["text-input", "textarea", "email-input", "phone-input", "number-input"].includes(element.type) && (
            <div>
              <Label className="text-xs text-muted-foreground">Placeholder</Label>
              <Input
                value={element.placeholder || ""}
                onChange={(e) => update({ placeholder: e.target.value })}
                placeholder="Placeholder text..."
                className="h-8 text-xs bg-input mt-1"
              />
            </div>
          )}

          {/* Default Value */}
          <div>
            <Label className="text-xs text-muted-foreground">Default Value</Label>
            <Input
              value={element.defaultValue || ""}
              onChange={(e) => update({ defaultValue: e.target.value })}
              placeholder="Default value..."
              className="h-8 text-xs bg-input mt-1"
            />
          </div>

          {/* Help Text */}
          <div>
            <Label className="text-xs text-muted-foreground">Help Text</Label>
            <Textarea
              value={element.helpText || ""}
              onChange={(e) => update({ helpText: e.target.value })}
              placeholder="Additional help text..."
              className="text-xs bg-input mt-1 min-h-[60px]"
            />
          </div>

          {/* Required */}
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Required Field</Label>
            <Switch checked={element.required || false} onCheckedChange={(checked) => update({ required: checked })} />
          </div>
        </>
      )}

      {/* Button Settings */}
      {element.type === "button" && (
        <>
          <div>
            <Label className="text-xs text-muted-foreground">Button Text</Label>
            <Input
              value={element.label || "Submit"}
              onChange={(e) => update({ label: e.target.value })}
              className="h-8 text-xs bg-input mt-1"
            />
          </div>
        </>
      )}

      {/* Heading/Paragraph Settings */}
      {["heading", "paragraph"].includes(element.type) && (
        <div>
          <Label className="text-xs text-muted-foreground">Text Content</Label>
          <Textarea
            value={element.label || ""}
            onChange={(e) => update({ label: e.target.value })}
            placeholder="Enter text..."
            className="text-xs bg-input mt-1 min-h-[80px]"
          />
        </div>
      )}
    </div>
  )
}

function LogicPanel({ element, updateElement }: PanelProps) {
  return (
    <div className="p-4">
      <div className="text-center text-muted-foreground text-sm">
        <Workflow className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="font-medium mb-1">Conditional Logic</p>
        <p className="text-xs">Add show/hide conditions, validation rules, and calculated fields.</p>
        <Button variant="outline" size="sm" className="mt-4 bg-transparent">
          Add Condition
        </Button>
      </div>
    </div>
  )
}
