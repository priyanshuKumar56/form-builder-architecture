"use client"

import { useState } from "react"
import { useEditorStore } from "@/lib/store/editor-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Copy,
  Check,
  Code,
  FileCode,
  Globe,
  QrCode,
  Link2,
  MessageSquare,
  Mail,
  Smartphone,
  Download,
  ExternalLink,
  Webhook,
  Braces,
  FileJson,
  Monitor,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  generateHTMLCode,
  generateReactCode,
  generateEmbedCode,
  generateVueCode,
  generateJSONSchema,
} from "@/lib/export/code-generator"

interface ExportModalProps {
  open: boolean
  onClose: () => void
}

type ExportTab = "embed" | "code" | "share" | "api"

export function ExportModal({ open, onClose }: ExportModalProps) {
  const { elements, elementOrder, projectName, projectId } = useEditorStore()
  const [activeTab, setActiveTab] = useState<ExportTab>("embed")
  const [copiedField, setCopiedField] = useState<string | null>(null)

  // Embed options
  const [embedType, setEmbedType] = useState<"iframe" | "popup" | "inline" | "chat">("iframe")
  const [embedWidth, setEmbedWidth] = useState("100%")
  const [embedHeight, setEmbedHeight] = useState("500px")
  const [showBranding, setShowBranding] = useState(true)

  // Code export options
  const [codeFormat, setCodeFormat] = useState<"html" | "react" | "vue" | "json">("html")
  const [includeStyles, setIncludeStyles] = useState(true)
  const [includeValidation, setIncludeValidation] = useState(true)

  const formUrl = `https://formcraft.pro/f/${projectId}`
  const embedUrl = `https://formcraft.pro/embed/${projectId}`

  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const getExportedCode = () => {
    switch (codeFormat) {
      case "html":
        return generateHTMLCode(elements, elementOrder, projectName, includeStyles, includeValidation)
      case "react":
        return generateReactCode(elements, elementOrder, projectName, includeValidation)
      case "vue":
        return generateVueCode(elements, elementOrder, projectName, includeValidation)
      case "json":
        return generateJSONSchema(elements, elementOrder, projectName)
      default:
        return ""
    }
  }

  const getEmbedCode = () => {
    return generateEmbedCode(projectId, embedType, embedWidth, embedHeight, showBranding)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0 bg-card">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <DialogTitle className="text-xl">Export & Share</DialogTitle>
          <DialogDescription>Choose how you want to deploy or integrate your form</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ExportTab)} className="flex-1">
          <div className="border-b border-border px-6">
            <TabsList className="h-12 bg-transparent gap-4 p-0">
              <TabsTrigger
                value="embed"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3"
              >
                <Code className="w-4 h-4 mr-2" />
                Embed
              </TabsTrigger>
              <TabsTrigger
                value="code"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3"
              >
                <FileCode className="w-4 h-4 mr-2" />
                Export Code
              </TabsTrigger>
              <TabsTrigger
                value="share"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3"
              >
                <Globe className="w-4 h-4 mr-2" />
                Share
              </TabsTrigger>
              <TabsTrigger
                value="api"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3"
              >
                <Webhook className="w-4 h-4 mr-2" />
                API & Webhooks
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[500px]">
            {/* Embed Tab */}
            <TabsContent value="embed" className="p-6 mt-0 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Embed Type Selection */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium">Embed Type</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "iframe", label: "Iframe", icon: Monitor, desc: "Standard embed" },
                      { value: "popup", label: "Popup", icon: ExternalLink, desc: "Button trigger" },
                      { value: "inline", label: "Inline", icon: FileCode, desc: "Widget embed" },
                      { value: "chat", label: "Chat Bubble", icon: MessageSquare, desc: "Floating widget" },
                    ].map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setEmbedType(type.value as typeof embedType)}
                        className={cn(
                          "p-4 rounded-lg border text-left transition-all",
                          embedType === type.value
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50",
                        )}
                      >
                        <type.icon
                          className={cn(
                            "w-5 h-5 mb-2",
                            embedType === type.value ? "text-primary" : "text-muted-foreground",
                          )}
                        />
                        <p className="font-medium text-sm">{type.label}</p>
                        <p className="text-xs text-muted-foreground">{type.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Embed Options */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium">Options</Label>

                  {embedType === "iframe" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs text-muted-foreground">Width</Label>
                          <Input
                            value={embedWidth}
                            onChange={(e) => setEmbedWidth(e.target.value)}
                            placeholder="100% or 500px"
                            className="h-9 mt-1 bg-input"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Height</Label>
                          <Input
                            value={embedHeight}
                            onChange={(e) => setEmbedHeight(e.target.value)}
                            placeholder="500px"
                            className="h-9 mt-1 bg-input"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label className="text-sm">Show FormCraft branding</Label>
                      <p className="text-xs text-muted-foreground">Display "Powered by FormCraft"</p>
                    </div>
                    <Switch checked={showBranding} onCheckedChange={setShowBranding} />
                  </div>
                </div>
              </div>

              {/* Generated Embed Code */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Embed Code</Label>
                <div className="relative">
                  <pre className="bg-background border border-border rounded-lg p-4 text-sm font-mono overflow-x-auto">
                    <code className="text-foreground">{getEmbedCode()}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopy(getEmbedCode(), "embed")}
                  >
                    {copiedField === "embed" ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                    {copiedField === "embed" ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>

              {/* Platform-specific instructions */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium text-sm mb-2">Platform Instructions</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="font-medium text-muted-foreground">WordPress</p>
                    <p className="text-xs text-muted-foreground">Paste in Custom HTML block</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-muted-foreground">Webflow</p>
                    <p className="text-xs text-muted-foreground">Use Embed element</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-muted-foreground">Shopify</p>
                    <p className="text-xs text-muted-foreground">Add to theme.liquid</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Code Export Tab */}
            <TabsContent value="code" className="p-6 mt-0 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Export Format</Label>
                  <p className="text-xs text-muted-foreground">Download production-ready code</p>
                </div>

                <Select value={codeFormat} onValueChange={(v) => setCodeFormat(v as typeof codeFormat)}>
                  <SelectTrigger className="w-48 bg-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="html">
                      <div className="flex items-center">
                        <FileCode className="w-4 h-4 mr-2" />
                        HTML / CSS / JS
                      </div>
                    </SelectItem>
                    <SelectItem value="react">
                      <div className="flex items-center">
                        <Braces className="w-4 h-4 mr-2" />
                        React Component
                      </div>
                    </SelectItem>
                    <SelectItem value="vue">
                      <div className="flex items-center">
                        <Braces className="w-4 h-4 mr-2" />
                        Vue Component
                      </div>
                    </SelectItem>
                    <SelectItem value="json">
                      <div className="flex items-center">
                        <FileJson className="w-4 h-4 mr-2" />
                        JSON Schema
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Export Options */}
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Switch checked={includeStyles} onCheckedChange={setIncludeStyles} />
                  <Label className="text-sm">Include Styles</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={includeValidation} onCheckedChange={setIncludeValidation} />
                  <Label className="text-sm">Include Validation</Label>
                </div>
              </div>

              {/* Code Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Generated Code</Label>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleCopy(getExportedCode(), "code")}>
                      {copiedField === "code" ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                      Copy
                    </Button>
                    <Button size="sm" variant="default">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <pre className="bg-background border border-border rounded-lg p-4 text-sm font-mono overflow-x-auto max-h-[300px]">
                    <code className="text-foreground whitespace-pre">{getExportedCode()}</code>
                  </pre>
                </div>
              </div>
            </TabsContent>

            {/* Share Tab */}
            <TabsContent value="share" className="p-6 mt-0 space-y-6">
              {/* Direct Link */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Direct Link</Label>
                <div className="flex gap-2">
                  <Input value={formUrl} readOnly className="bg-input font-mono text-sm" />
                  <Button variant="secondary" onClick={() => handleCopy(formUrl, "link")}>
                    {copiedField === "link" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button variant="secondary">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* QR Code */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">QR Code</Label>
                <div className="flex gap-6">
                  <div className="w-40 h-40 bg-white rounded-lg flex items-center justify-center border">
                    <QrCode className="w-32 h-32 text-foreground" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Scan this QR code to open the form on any device. Perfect for printed materials, events, and
                      physical locations.
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download PNG
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download SVG
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Share Options */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Share via</Label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { name: "Email", icon: Mail, color: "bg-blue-500" },
                    { name: "WhatsApp", icon: MessageSquare, color: "bg-green-500" },
                    { name: "SMS", icon: Smartphone, color: "bg-purple-500" },
                    { name: "Copy Link", icon: Link2, color: "bg-gray-500" },
                  ].map((option) => (
                    <Button
                      key={option.name}
                      variant="outline"
                      className="h-auto py-4 flex-col gap-2 bg-transparent"
                      onClick={() => option.name === "Copy Link" && handleCopy(formUrl, "shareLink")}
                    >
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", option.color)}>
                        <option.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs">{option.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Email Embed */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Email Embed (Limited)</Label>
                <p className="text-xs text-muted-foreground">
                  Email clients have limited HTML support. You can embed buttons, single choice, or ratings.
                </p>
                <Button variant="outline" size="sm">
                  Generate Email HTML
                </Button>
              </div>
            </TabsContent>

            {/* API & Webhooks Tab */}
            <TabsContent value="api" className="p-6 mt-0 space-y-6">
              {/* API Endpoint */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Submit Endpoint</Label>
                <div className="flex gap-2">
                  <div className="px-3 py-2 bg-primary/20 rounded-l-md text-primary font-mono text-sm">POST</div>
                  <Input
                    value={`https://api.formcraft.pro/v1/forms/${projectId}/submit`}
                    readOnly
                    className="bg-input font-mono text-sm rounded-l-none"
                  />
                  <Button
                    variant="secondary"
                    onClick={() => handleCopy(`https://api.formcraft.pro/v1/forms/${projectId}/submit`, "api")}
                  >
                    {copiedField === "api" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Webhook Configuration */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Webhooks</Label>
                    <p className="text-xs text-muted-foreground">Send form data to your server on submission</p>
                  </div>
                  <Button size="sm">Add Webhook</Button>
                </div>

                <div className="border border-border rounded-lg p-4 bg-muted/30">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Webhook className="w-8 h-8" />
                    <div>
                      <p className="font-medium text-foreground">No webhooks configured</p>
                      <p className="text-sm">Add a webhook to receive real-time submission data</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SDK Example */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">JavaScript SDK</Label>
                <pre className="bg-background border border-border rounded-lg p-4 text-sm font-mono overflow-x-auto">
                  <code className="text-foreground">{`import FormCraft from 'formcraft-sdk';

// Initialize
const form = new FormCraft('${projectId}');

// Load form
form.render('#form-container');

// Listen to events
form.on('submit', (data) => {
  console.log('Form submitted:', data);
});

form.on('fieldChange', (field, value) => {
  console.log(\`\${field} changed to \${value}\`);
});`}</code>
                </pre>
              </div>

              {/* API Keys */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">API Keys</Label>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    value="fc_live_xxxxxxxxxxxxxxxxxxxxxxxx"
                    readOnly
                    className="bg-input font-mono text-sm"
                  />
                  <Button variant="secondary">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="outline">Regenerate</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Keep your API keys secure. Never expose them in client-side code.
                </p>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
