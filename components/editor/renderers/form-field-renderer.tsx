"use client"

import type { FormElement } from "@/lib/store/editor-store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Calendar, Upload, Star } from "lucide-react"

interface FormFieldRendererProps {
  element: FormElement
  isEditing?: boolean
  value?: string
  onChange?: (value: string) => void
}

export function FormFieldRenderer({ element, isEditing = false, value, onChange }: FormFieldRendererProps) {
  const renderField = () => {
    switch (element.type) {
      case "text-input":
      case "email-input":
      case "phone-input":
      case "number-input":
        return (
          <div className="space-y-1.5 w-full">
            {element.label && (
              <Label className="text-sm font-medium">
                {element.label}
                {element.required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
            <Input
              type={element.type === "email-input" ? "email" : element.type === "number-input" ? "number" : "text"}
              placeholder={element.placeholder}
              defaultValue={element.defaultValue}
              className="h-10 bg-input border-border"
              disabled={isEditing}
            />
            {element.helpText && <p className="text-xs text-muted-foreground">{element.helpText}</p>}
          </div>
        )

      case "textarea":
        return (
          <div className="space-y-1.5 w-full">
            {element.label && (
              <Label className="text-sm font-medium">
                {element.label}
                {element.required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
            <Textarea
              placeholder={element.placeholder}
              defaultValue={element.defaultValue}
              className="min-h-[80px] bg-input border-border resize-none"
              disabled={isEditing}
            />
            {element.helpText && <p className="text-xs text-muted-foreground">{element.helpText}</p>}
          </div>
        )

      case "select":
        return (
          <div className="space-y-1.5 w-full">
            {element.label && (
              <Label className="text-sm font-medium">
                {element.label}
                {element.required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
            <Select disabled={isEditing}>
              <SelectTrigger className="h-10 bg-input border-border">
                <SelectValue placeholder={element.placeholder || "Select an option"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
            {element.helpText && <p className="text-xs text-muted-foreground">{element.helpText}</p>}
          </div>
        )

      case "checkbox":
        return (
          <div className="flex items-center gap-2">
            <Checkbox id={element.id} disabled={isEditing} />
            <Label htmlFor={element.id} className="text-sm font-medium cursor-pointer">
              {element.label || "Checkbox option"}
            </Label>
          </div>
        )

      case "radio":
        return (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-border flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-primary" />
            </div>
            <Label className="text-sm font-medium cursor-pointer">{element.label || "Radio option"}</Label>
          </div>
        )

      case "toggle":
        return (
          <div className="flex items-center justify-between w-full">
            <Label className="text-sm font-medium">{element.label || "Toggle option"}</Label>
            <Switch disabled={isEditing} />
          </div>
        )

      case "date-picker":
        return (
          <div className="space-y-1.5 w-full">
            {element.label && (
              <Label className="text-sm font-medium">
                {element.label}
                {element.required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
            <div className="relative">
              <Input
                type="text"
                placeholder="Pick a date"
                className="h-10 bg-input border-border pr-10"
                disabled={isEditing}
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        )

      case "file-upload":
        return (
          <div className="space-y-1.5 w-full">
            {element.label && (
              <Label className="text-sm font-medium">
                {element.label}
                {element.required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Drag & drop or <span className="text-primary">browse</span>
              </p>
            </div>
          </div>
        )

      case "button":
        return (
          <Button className="w-full h-full" disabled={isEditing}>
            {element.label || "Submit"}
          </Button>
        )

      case "heading":
        return (
          <h2
            className="text-xl font-semibold text-foreground"
            style={{
              fontSize: element.styles.fontSize,
              fontWeight: element.styles.fontWeight,
              color: element.styles.color,
              textAlign: element.styles.textAlign as "left" | "center" | "right" | "justify" | undefined,
            }}
          >
            {element.label || "Heading text"}
          </h2>
        )

      case "paragraph":
        return (
          <p
            className="text-sm text-muted-foreground"
            style={{
              fontSize: element.styles.fontSize,
              fontWeight: element.styles.fontWeight,
              color: element.styles.color,
              textAlign: element.styles.textAlign as "left" | "center" | "right" | "justify" | undefined,
            }}
          >
            {element.label || "Paragraph text goes here. Edit this text in the settings panel."}
          </p>
        )

      case "divider":
        return <div className="w-full h-px bg-border" />

      case "container":
        return (
          <div
            className="w-full h-full border border-dashed border-border rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: element.styles.backgroundColor,
              borderRadius: element.styles.borderRadius,
            }}
          >
            <span className="text-xs text-muted-foreground">Container</span>
          </div>
        )

      case "image":
        return (
          <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
            <span className="text-xs text-muted-foreground">Image placeholder</span>
          </div>
        )

      case "rating":
        return (
          <div className="space-y-1.5">
            {element.label && <Label className="text-sm font-medium">{element.label}</Label>}
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "w-6 h-6 cursor-pointer transition-colors",
                    star <= 3 ? "fill-warning text-warning" : "text-muted-foreground",
                  )}
                />
              ))}
            </div>
          </div>
        )

      case "slider":
        return (
          <div className="space-y-3 w-full">
            {element.label && (
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">{element.label}</Label>
                <span className="text-sm text-muted-foreground">50</span>
              </div>
            )}
            <Slider defaultValue={[50]} max={100} step={1} disabled={isEditing} />
          </div>
        )

      case "signature":
        return (
          <div className="space-y-1.5 w-full">
            {element.label && (
              <Label className="text-sm font-medium">
                {element.label}
                {element.required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
            <div className="border border-border rounded-lg h-24 flex items-center justify-center bg-input">
              <span className="text-xs text-muted-foreground">Sign here</span>
            </div>
          </div>
        )

      default:
        return (
          <div className="p-2 border border-dashed border-border rounded text-xs text-muted-foreground">
            Unknown element type: {element.type}
          </div>
        )
    }
  }

  return <div className="w-full h-full flex items-start">{renderField()}</div>
}
