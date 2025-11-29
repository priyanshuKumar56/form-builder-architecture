import { create } from "zustand"

export type ElementType =
  | "text-input"
  | "textarea"
  | "email-input"
  | "phone-input"
  | "number-input"
  | "select"
  | "checkbox"
  | "radio"
  | "toggle"
  | "date-picker"
  | "file-upload"
  | "button"
  | "heading"
  | "paragraph"
  | "divider"
  | "container"
  | "image"
  | "rating"
  | "slider"
  | "signature"

export interface ElementStyles {
  width?: string
  height?: string
  padding?: string
  margin?: string
  backgroundColor?: string
  borderRadius?: string
  borderWidth?: string
  borderColor?: string
  borderStyle?: string
  fontSize?: string
  fontWeight?: string
  color?: string
  textAlign?: string
  boxShadow?: string
  opacity?: number
}

export interface FormElement {
  id: string
  type: ElementType
  name: string
  label?: string
  placeholder?: string
  required?: boolean
  helpText?: string
  defaultValue?: string
  validation?: {
    type: string
    message: string
    value?: string | number
  }[]
  options?: { label: string; value: string }[]
  position: { x: number; y: number }
  size: { width: number; height: number }
  styles: ElementStyles
  parentId?: string
  children?: string[]
  locked?: boolean
  visible?: boolean
}

export interface FormStep {
  id: string
  name: string
  elements: string[]
}

export interface EditorState {
  // Project
  projectName: string
  projectId: string

  // Form metadata
  formTitle: string
  formDescription: string
  formLayout: "one-column" | "two-column"

  // Elements
  elements: Record<string, FormElement>
  elementOrder: string[]

  // Multi-step
  steps: FormStep[]
  currentStepIndex: number

  // Selection
  selectedIds: string[]
  hoveredId: string | null

  // Canvas
  zoom: number
  pan: { x: number; y: number }
  showGrid: boolean
  snapToGrid: boolean
  gridSize: number
  artboardWidth: number
  artboardPadding: number
  artboardHeight: number

  // UI State
  leftPanelTab: "layers" | "components"
  rightPanelTab: "design" | "settings" | "logic"
  isPreviewMode: boolean

  // History
  history: { elements: Record<string, FormElement>; elementOrder: string[] }[]
  historyIndex: number

  // Actions
  setProjectName: (name: string) => void
  setFormTitle: (title: string) => void
  setFormDescription: (desc: string) => void
  setFormLayout: (layout: "one-column" | "two-column") => void
  addElement: (element: FormElement) => void
  updateElement: (id: string, updates: Partial<FormElement>) => void
  deleteElement: (id: string) => void
  duplicateElement: (id: string) => void
  selectElement: (id: string, multi?: boolean) => void
  clearSelection: () => void
  setHoveredId: (id: string | null) => void
  moveElement: (id: string, position: { x: number; y: number }) => void
  resizeElement: (id: string, size: { width: number; height: number }) => void
  reorderElements: (startIndex: number, endIndex: number) => void
  setZoom: (zoom: number) => void
  setPan: (pan: { x: number; y: number }) => void
  toggleGrid: () => void
  toggleSnapToGrid: () => void
  setLeftPanelTab: (tab: "layers" | "components") => void
  setRightPanelTab: (tab: "design" | "settings" | "logic") => void
  togglePreviewMode: () => void
  // Pages/steps
  setCurrentStepIndex: (index: number) => void
  addStep: (name?: string) => void
  removeStep: (index: number) => void
  renameStep: (index: number, name: string) => void
  setArtboardWidth: (w: number) => void
  setArtboardHeight: (h: number) => void
  undo: () => void
  redo: () => void
  saveToHistory: () => void
}

const generateId = () => Math.random().toString(36).substring(2, 11)

export const useEditorStore = create<EditorState>((set, get) => ({
  // Initial state
  projectName: "Untitled Form",
  projectId: generateId(),
  formTitle: "Untitled form",
  formDescription: "Form description",
  formLayout: "one-column",
  elements: {},
  elementOrder: [],
  steps: [{ id: generateId(), name: "Step 1", elements: [] }],
  currentStepIndex: 0,
  selectedIds: [],
  hoveredId: null,
  zoom: 1,
  pan: { x: 0, y: 0 },
  showGrid: true,
  snapToGrid: true,
  gridSize: 8,
  artboardWidth: 720,
  artboardPadding: 40,
  artboardHeight: 800,
  leftPanelTab: "components",
  rightPanelTab: "design",
  isPreviewMode: false,
  history: [],
  historyIndex: -1,

  // Actions
  setProjectName: (name) => set({ projectName: name }),

  setFormTitle: (title) => set({ formTitle: title }),
  setFormDescription: (desc) => set({ formDescription: desc }),
  setFormLayout: (layout) => set({ formLayout: layout }),

  addElement: (element) => {
    const state = get()
    state.saveToHistory()
    // Attach element to current step
    const steps = state.steps.slice()
    steps[state.currentStepIndex] = {
      ...steps[state.currentStepIndex],
      elements: [...steps[state.currentStepIndex].elements, element.id],
    }
    set({
      elements: { ...state.elements, [element.id]: element },
      elementOrder: [...state.elementOrder, element.id],
      steps,
      selectedIds: [element.id],
    })
  },

  updateElement: (id, updates) => {
    const state = get()
    if (!state.elements[id]) return
    set({
      elements: {
        ...state.elements,
        [id]: { ...state.elements[id], ...updates },
      },
    })
  },

  deleteElement: (id) => {
    const state = get()
    state.saveToHistory()
    const newElements = { ...state.elements }
    delete newElements[id]
    const steps = state.steps.map((s) => ({ ...s, elements: s.elements.filter((eid) => eid !== id) }))
    set({
      elements: newElements,
      elementOrder: state.elementOrder.filter((eid) => eid !== id),
      steps,
      selectedIds: state.selectedIds.filter((sid) => sid !== id),
    })
  },

  duplicateElement: (id) => {
    const state = get()
    const element = state.elements[id]
    if (!element) return

    state.saveToHistory()
    const newId = generateId()
    const newElement: FormElement = {
      ...element,
      id: newId,
      name: `${element.name} Copy`,
      position: {
        x: element.position.x + 20,
        y: element.position.y + 20,
      },
    }

    set({
      elements: { ...state.elements, [newId]: newElement },
      elementOrder: [...state.elementOrder, newId],
      selectedIds: [newId],
    })
  },

  selectElement: (id, multi = false) => {
    const state = get()
    if (multi) {
      const isSelected = state.selectedIds.includes(id)
      set({
        selectedIds: isSelected ? state.selectedIds.filter((sid) => sid !== id) : [...state.selectedIds, id],
      })
    } else {
      set({ selectedIds: [id] })
    }
  },

  clearSelection: () => set({ selectedIds: [] }),

  setHoveredId: (id) => set({ hoveredId: id }),

  moveElement: (id, position) => {
    const state = get()
    const gridSize = state.snapToGrid ? state.gridSize : 1
    const snappedPosition = {
      x: Math.round(position.x / gridSize) * gridSize,
      y: Math.round(position.y / gridSize) * gridSize,
    }

    set({
      elements: {
        ...state.elements,
        [id]: { ...state.elements[id], position: snappedPosition },
      },
    })
  },

  resizeElement: (id, size) => {
    const state = get()
    const gridSize = state.snapToGrid ? state.gridSize : 1
    const snappedSize = {
      width: Math.round(size.width / gridSize) * gridSize,
      height: Math.round(size.height / gridSize) * gridSize,
    }

    set({
      elements: {
        ...state.elements,
        [id]: { ...state.elements[id], size: snappedSize },
      },
    })
  },

  reorderElements: (startIndex, endIndex) => {
    const state = get()
    const newOrder = [...state.elementOrder]
    const [removed] = newOrder.splice(startIndex, 1)
    newOrder.splice(endIndex, 0, removed)
    set({ elementOrder: newOrder })
  },

  setZoom: (zoom) => set({ zoom: Math.min(Math.max(zoom, 0.1), 5) }),

  setPan: (pan) => set({ pan }),

  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),

  toggleSnapToGrid: () => set((state) => ({ snapToGrid: !state.snapToGrid })),

  setLeftPanelTab: (tab) => set({ leftPanelTab: tab }),

  setRightPanelTab: (tab) => set({ rightPanelTab: tab }),

  togglePreviewMode: () => set((state) => ({ isPreviewMode: !state.isPreviewMode })),

  setCurrentStepIndex: (index) => {
    const state = get()
    const i = Math.max(0, Math.min(index, state.steps.length - 1))
    set({ currentStepIndex: i })
  },
  addStep: (name) => {
    const state = get()
    const newStep: FormStep = { id: generateId(), name: name || `Step ${state.steps.length + 1}`, elements: [] }
    set({ steps: [...state.steps, newStep], currentStepIndex: state.steps.length })
  },
  removeStep: (index) => {
    const state = get()
    if (state.steps.length <= 1) return
    const newSteps = state.steps.slice()
    newSteps.splice(index, 1)
    const newIndex = Math.max(0, Math.min(state.currentStepIndex, newSteps.length - 1))
    set({ steps: newSteps, currentStepIndex: newIndex })
  },
  renameStep: (index, name) => {
    const state = get()
    const newSteps = state.steps.map((s, i) => (i === index ? { ...s, name } : s))
    set({ steps: newSteps })
  },
  setArtboardWidth: (w) => set({ artboardWidth: Math.max(360, Math.min(w, 1440)) }),
  setArtboardHeight: (h) => set({ artboardHeight: Math.max(400, Math.min(h, 2000)) }),

  undo: () => {
    const state = get()
    if (state.historyIndex < 0) return

    const historyItem = state.history[state.historyIndex]
    set({
      elements: historyItem.elements,
      elementOrder: historyItem.elementOrder,
      historyIndex: state.historyIndex - 1,
    })
  },

  redo: () => {
    const state = get()
    if (state.historyIndex >= state.history.length - 1) return

    const historyItem = state.history[state.historyIndex + 1]
    set({
      elements: historyItem.elements,
      elementOrder: historyItem.elementOrder,
      historyIndex: state.historyIndex + 1,
    })
  },

  saveToHistory: () => {
    const state = get()
    const newHistory = state.history.slice(0, state.historyIndex + 1)
    newHistory.push({
      elements: { ...state.elements },
      elementOrder: [...state.elementOrder],
    })

    // Keep only last 50 history items
    if (newHistory.length > 50) {
      newHistory.shift()
    }

    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    })
  },
}))
