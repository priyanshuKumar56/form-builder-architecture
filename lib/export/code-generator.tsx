import type { FormElement } from "@/lib/store/editor-store"

export function generateHTMLCode(
  elements: Record<string, FormElement>,
  elementOrder: string[],
  projectName: string,
  includeStyles: boolean,
  includeValidation: boolean,
): string {
  const orderedElements = elementOrder.map((id) => elements[id]).filter(Boolean)

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>`

  if (includeStyles) {
    html += `
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #0f0f1a;
      color: #f0f0f5;
      line-height: 1.5;
    }
    
    .form-container {
      max-width: 480px;
      margin: 40px auto;
      padding: 40px;
      background: #1a1a2e;
      border-radius: 12px;
      border: 1px solid #2a2a3e;
    }
    
    .form-header {
      margin-bottom: 32px;
    }
    
    .form-header h1 {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .form-header p {
      color: #888;
      font-size: 14px;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 6px;
    }
    
    .form-label .required {
      color: #ef4444;
      margin-left: 4px;
    }
    
    .form-input {
      width: 100%;
      padding: 10px 14px;
      font-size: 14px;
      background: #252538;
      border: 1px solid #3a3a4e;
      border-radius: 8px;
      color: #f0f0f5;
      transition: border-color 0.2s;
    }
    
    .form-input:focus {
      outline: none;
      border-color: #6366f1;
    }
    
    .form-input::placeholder {
      color: #666;
    }
    
    .form-textarea {
      min-height: 100px;
      resize: vertical;
    }
    
    .form-select {
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 10px center;
      background-size: 16px;
      padding-right: 40px;
    }
    
    .form-checkbox-group {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .form-checkbox {
      width: 18px;
      height: 18px;
      accent-color: #6366f1;
    }
    
    .form-button {
      width: 100%;
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 500;
      color: white;
      background: #6366f1;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .form-button:hover {
      background: #5558e3;
    }
    
    .form-help {
      font-size: 12px;
      color: #666;
      margin-top: 4px;
    }
    
    .form-error {
      font-size: 12px;
      color: #ef4444;
      margin-top: 4px;
      display: none;
    }
    
    .form-input.error {
      border-color: #ef4444;
    }
    
    .form-input.error + .form-error {
      display: block;
    }
  </style>`
  }

  html += `
</head>
<body>
  <div class="form-container">
    <div class="form-header">
      <h1>${projectName}</h1>
      <p>Fill out the form below to get in touch.</p>
    </div>
    
    <form id="formcraft-form"${includeValidation ? " novalidate" : ""}>
`

  orderedElements.forEach((element) => {
    html += generateHTMLElement(element, includeValidation)
  })

  html += `    </form>
  </div>`

  if (includeValidation) {
    html += `
  
  <script>
    const form = document.getElementById('formcraft-form');
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let isValid = true;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
      // Reset errors
      form.querySelectorAll('.form-input').forEach(input => {
        input.classList.remove('error');
      });
      
      // Validate required fields
      form.querySelectorAll('[required]').forEach(input => {
        if (!input.value.trim()) {
          input.classList.add('error');
          isValid = false;
        }
      });
      
      // Validate email fields
      form.querySelectorAll('input[type="email"]').forEach(input => {
        if (input.value && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(input.value)) {
          input.classList.add('error');
          isValid = false;
        }
      });
      
      if (isValid) {
        console.log('Form submitted:', data);
        // Add your submission logic here
        alert('Form submitted successfully!');
        form.reset();
      }
    });
  </script>`
  }

  html += `
</body>
</html>`

  return html
}

function generateHTMLElement(element: FormElement, includeValidation: boolean): string {
  const required = element.required ? " required" : ""
  const requiredStar = element.required ? '<span class="required">*</span>' : ""

  switch (element.type) {
    case "text-input":
    case "email-input":
    case "phone-input":
    case "number-input":
      const inputType =
        element.type === "email-input"
          ? "email"
          : element.type === "number-input"
            ? "number"
            : element.type === "phone-input"
              ? "tel"
              : "text"
      return `      <div class="form-group">
        <label class="form-label">${element.label || element.name}${requiredStar}</label>
        <input type="${inputType}" name="${element.name}" class="form-input" placeholder="${element.placeholder || ""}"${required}>
        ${element.helpText ? `<p class="form-help">${element.helpText}</p>` : ""}
        ${includeValidation ? '<p class="form-error">This field is required</p>' : ""}
      </div>
`

    case "textarea":
      return `      <div class="form-group">
        <label class="form-label">${element.label || element.name}${requiredStar}</label>
        <textarea name="${element.name}" class="form-input form-textarea" placeholder="${element.placeholder || ""}"${required}></textarea>
        ${element.helpText ? `<p class="form-help">${element.helpText}</p>` : ""}
      </div>
`

    case "select":
      return `      <div class="form-group">
        <label class="form-label">${element.label || element.name}${requiredStar}</label>
        <select name="${element.name}" class="form-input form-select"${required}>
          <option value="">Select an option</option>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
      </div>
`

    case "checkbox":
      return `      <div class="form-group">
        <label class="form-checkbox-group">
          <input type="checkbox" name="${element.name}" class="form-checkbox"${required}>
          <span>${element.label || "Checkbox option"}</span>
        </label>
      </div>
`

    case "button":
      return `      <div class="form-group">
        <button type="submit" class="form-button">${element.label || "Submit"}</button>
      </div>
`

    case "heading":
      return `      <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 16px;">${element.label || "Heading"}</h2>
`

    case "paragraph":
      return `      <p style="color: #888; margin-bottom: 16px;">${element.label || "Paragraph text"}</p>
`

    case "divider":
      return `      <hr style="border: none; border-top: 1px solid #3a3a4e; margin: 24px 0;">
`

    default:
      return ""
  }
}

export function generateReactCode(
  elements: Record<string, FormElement>,
  elementOrder: string[],
  projectName: string,
  includeValidation: boolean,
): string {
  const orderedElements = elementOrder.map((id) => elements[id]).filter(Boolean)
  const formFields = orderedElements.filter((el) =>
    ["text-input", "email-input", "phone-input", "number-input", "textarea", "select", "checkbox"].includes(el.type),
  )

  const stateFields = formFields.map((el) => `    ${el.name.replace(/\s+/g, "_").toLowerCase()}: ''`).join(",\n")

  let code = `"use client"

import { useState } from 'react'

interface FormData {
${formFields.map((el) => `  ${el.name.replace(/\s+/g, "_").toLowerCase()}: string`).join("\n")}
}

export function ${projectName.replace(/\s+/g, "")}Form() {
  const [formData, setFormData] = useState<FormData>({
${stateFields}
  })
  ${includeValidation ? `const [errors, setErrors] = useState<Partial<FormData>>({})` : ""}
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 'true' : '') : value
    }))
    ${includeValidation ? `setErrors(prev => ({ ...prev, [name]: '' }))` : ""}
  }
`

  if (includeValidation) {
    code += `
  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {}
    
${formFields
  .filter((el) => el.required)
  .map((el) => {
    const fieldName = el.name.replace(/\s+/g, "_").toLowerCase()
    return `    if (!formData.${fieldName}) newErrors.${fieldName} = 'This field is required'`
  })
  .join("\n")}

${formFields
  .filter((el) => el.type === "email-input")
  .map((el) => {
    const fieldName = el.name.replace(/\s+/g, "_").toLowerCase()
    return `    if (formData.${fieldName} && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.${fieldName})) {
      newErrors.${fieldName} = 'Please enter a valid email'
    }`
  })
  .join("\n")}

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
`
  }

  code += `
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    ${includeValidation ? `if (!validate()) return` : ""}
    
    setIsSubmitting(true)
    try {
      // Add your submission logic here
      console.log('Form data:', formData)
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Form submitted successfully!')
    } catch (error) {
      console.error('Submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-8 bg-card rounded-xl border border-border">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">${projectName}</h1>
        <p className="text-muted-foreground text-sm">Fill out the form below to get in touch.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
`

  orderedElements.forEach((element) => {
    code += generateReactElement(element, includeValidation)
  })

  code += `      </form>
    </div>
  )
}
`

  return code
}

function generateReactElement(element: FormElement, includeValidation: boolean): string {
  const fieldName = element.name.replace(/\s+/g, "_").toLowerCase()
  const required = element.required

  switch (element.type) {
    case "text-input":
    case "email-input":
    case "phone-input":
    case "number-input":
      const inputType =
        element.type === "email-input"
          ? "email"
          : element.type === "number-input"
            ? "number"
            : element.type === "phone-input"
              ? "tel"
              : "text"
      return `        <div>
          <label className="block text-sm font-medium mb-1.5">
            ${element.label || element.name}${required ? ` <span className="text-destructive">*</span>` : ""}
          </label>
          <input
            type="${inputType}"
            name="${fieldName}"
            value={formData.${fieldName}}
            onChange={handleChange}
            placeholder="${element.placeholder || ""}"
            className="w-full px-4 py-2.5 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          ${includeValidation ? `{errors.${fieldName} && <p className="text-destructive text-xs mt-1">{errors.${fieldName}}</p>}` : ""}
        </div>
`

    case "textarea":
      return `        <div>
          <label className="block text-sm font-medium mb-1.5">
            ${element.label || element.name}${required ? ` <span className="text-destructive">*</span>` : ""}
          </label>
          <textarea
            name="${fieldName}"
            value={formData.${fieldName}}
            onChange={handleChange}
            placeholder="${element.placeholder || ""}"
            className="w-full px-4 py-2.5 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
          />
        </div>
`

    case "select":
      return `        <div>
          <label className="block text-sm font-medium mb-1.5">
            ${element.label || element.name}${required ? ` <span className="text-destructive">*</span>` : ""}
          </label>
          <select
            name="${fieldName}"
            value={formData.${fieldName}}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select an option</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </select>
        </div>
`

    case "checkbox":
      return `        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="${fieldName}"
            checked={formData.${fieldName} === 'true'}
            onChange={handleChange}
            className="w-4 h-4 accent-primary"
          />
          <label className="text-sm">${element.label || "Checkbox option"}</label>
        </div>
`

    case "button":
      return `        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : '${element.label || "Submit"}'}
        </button>
`

    case "heading":
      return `        <h2 className="text-xl font-semibold">${element.label || "Heading"}</h2>
`

    case "paragraph":
      return `        <p className="text-muted-foreground text-sm">${element.label || "Paragraph text"}</p>
`

    case "divider":
      return `        <hr className="border-border" />
`

    default:
      return ""
  }
}

export function generateVueCode(
  elements: Record<string, FormElement>,
  elementOrder: string[],
  projectName: string,
  includeValidation: boolean,
): string {
  const orderedElements = elementOrder.map((id) => elements[id]).filter(Boolean)
  const formFields = orderedElements.filter((el) =>
    ["text-input", "email-input", "phone-input", "number-input", "textarea", "select", "checkbox"].includes(el.type),
  )

  let code = `<template>
  <div class="form-container">
    <div class="form-header">
      <h1>${projectName}</h1>
      <p>Fill out the form below to get in touch.</p>
    </div>
    
    <form @submit.prevent="handleSubmit">
`

  orderedElements.forEach((element) => {
    code += generateVueElement(element, includeValidation)
  })

  code += `    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const formData = reactive({
${formFields.map((el) => `  ${el.name.replace(/\s+/g, "_").toLowerCase()}: ''`).join(",\n")}
})

${includeValidation ? `const errors = reactive<Record<string, string>>({})` : ""}
const isSubmitting = ref(false)

const handleSubmit = async () => {
  ${
    includeValidation
      ? `
  // Validate
  Object.keys(errors).forEach(key => errors[key] = '')
  let isValid = true
  
${formFields
  .filter((el) => el.required)
  .map((el) => {
    const fieldName = el.name.replace(/\s+/g, "_").toLowerCase()
    return `  if (!formData.${fieldName}) {
    errors.${fieldName} = 'This field is required'
    isValid = false
  }`
  })
  .join("\n")}
  
  if (!isValid) return
  `
      : ""
  }
  
  isSubmitting.value = true
  try {
    console.log('Form data:', formData)
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Form submitted successfully!')
  } catch (error) {
    console.error('Submission error:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.form-container {
  max-width: 480px;
  margin: 40px auto;
  padding: 40px;
  background: #1a1a2e;
  border-radius: 12px;
  border: 1px solid #2a2a3e;
}

.form-header h1 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #f0f0f5;
}

.form-header p {
  color: #888;
  font-size: 14px;
  margin-bottom: 32px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
  color: #f0f0f5;
}

.form-input {
  width: 100%;
  padding: 10px 14px;
  font-size: 14px;
  background: #252538;
  border: 1px solid #3a3a4e;
  border-radius: 8px;
  color: #f0f0f5;
}

.form-input:focus {
  outline: none;
  border-color: #6366f1;
}

.form-button {
  width: 100%;
  padding: 12px 24px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.form-button:hover {
  background: #5558e3;
}

.form-error {
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
}
</style>
`

  return code
}

function generateVueElement(element: FormElement, includeValidation: boolean): string {
  const fieldName = element.name.replace(/\s+/g, "_").toLowerCase()
  const required = element.required

  switch (element.type) {
    case "text-input":
    case "email-input":
    case "phone-input":
    case "number-input":
      const inputType =
        element.type === "email-input"
          ? "email"
          : element.type === "number-input"
            ? "number"
            : element.type === "phone-input"
              ? "tel"
              : "text"
      return `      <div class="form-group">
        <label class="form-label">${element.label || element.name}${required ? ' <span style="color: #ef4444">*</span>' : ""}</label>
        <input type="${inputType}" v-model="formData.${fieldName}" class="form-input" placeholder="${element.placeholder || ""}">
        ${includeValidation ? `<p v-if="errors.${fieldName}" class="form-error">{{ errors.${fieldName} }}</p>` : ""}
      </div>
`

    case "button":
      return `      <div class="form-group">
        <button type="submit" class="form-button" :disabled="isSubmitting">
          {{ isSubmitting ? 'Submitting...' : '${element.label || "Submit"}' }}
        </button>
      </div>
`

    default:
      return ""
  }
}

export function generateEmbedCode(
  projectId: string,
  embedType: "iframe" | "popup" | "inline" | "chat",
  width: string,
  height: string,
  showBranding: boolean,
): string {
  const baseUrl = "https://formcraft.pro"
  const params = showBranding ? "" : "?branding=false"

  switch (embedType) {
    case "iframe":
      return `<iframe 
  src="${baseUrl}/embed/${projectId}${params}"
  width="${width}"
  height="${height}"
  frameborder="0"
  style="border: none; border-radius: 8px;"
></iframe>`

    case "popup":
      return `<!-- FormCraft Popup Button -->
<script src="${baseUrl}/embed.js"></script>
<button 
  onclick="FormCraft.openPopup('${projectId}')"
  style="padding: 12px 24px; background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer;"
>
  Open Form
</button>

<script>
  FormCraft.init({
    formId: '${projectId}',
    mode: 'popup',
    ${!showBranding ? "branding: false," : ""}
  });
</script>`

    case "inline":
      return `<!-- FormCraft Inline Widget -->
<div id="formcraft-${projectId}"></div>
<script src="${baseUrl}/embed.js"></script>
<script>
  FormCraft.render('${projectId}', {
    container: '#formcraft-${projectId}',
    ${!showBranding ? "branding: false," : ""}
  });
</script>`

    case "chat":
      return `<!-- FormCraft Chat Widget -->
<script src="${baseUrl}/embed.js"></script>
<script>
  FormCraft.initChatWidget({
    formId: '${projectId}',
    position: 'bottom-right',
    buttonColor: '#6366f1',
    ${!showBranding ? "branding: false," : ""}
  });
</script>`

    default:
      return ""
  }
}

export function generateJSONSchema(
  elements: Record<string, FormElement>,
  elementOrder: string[],
  projectName: string,
): string {
  const orderedElements = elementOrder.map((id) => elements[id]).filter(Boolean)

  const schema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    title: projectName,
    type: "object",
    properties: {} as Record<string, any>,
    required: [] as string[],
  }

  orderedElements.forEach((element) => {
    if (
      ["text-input", "email-input", "phone-input", "number-input", "textarea", "select", "checkbox"].includes(
        element.type,
      )
    ) {
      const fieldName = element.name.replace(/\s+/g, "_").toLowerCase()

      const fieldSchema: any = {
        title: element.label || element.name,
      }

      switch (element.type) {
        case "text-input":
        case "textarea":
        case "phone-input":
          fieldSchema.type = "string"
          break
        case "email-input":
          fieldSchema.type = "string"
          fieldSchema.format = "email"
          break
        case "number-input":
          fieldSchema.type = "number"
          break
        case "select":
          fieldSchema.type = "string"
          fieldSchema.enum = ["option1", "option2", "option3"]
          break
        case "checkbox":
          fieldSchema.type = "boolean"
          break
      }

      if (element.placeholder) {
        fieldSchema.description = element.placeholder
      }

      schema.properties[fieldName] = fieldSchema

      if (element.required) {
        schema.required.push(fieldName)
      }
    }
  })

  return JSON.stringify(schema, null, 2)
}
