import { create } from 'zustand'

/**
 * Global Store (Zustand)
 * Manages the application state including active models, hand tracking data, and targeted controls.
 * 
 * @property {Object|null} activeModel - The currently selected component in the gallery.
 * @property {boolean} isDetailOpen - Whether the detailed component view is open.
 * @property {boolean} isHandTracking - Global toggle for the MediaPipe hand tracking system.
 * @property {string|null} handControlTarget - ID of the specific model being controlled by gestures (e.g., 'main', 'comp-1').
 * @property {Object} handPosition - Normalized coordinates (0-1) of the tracked palm.
 * @property {number} handZoom - Calculated zoom factor based on pinch distance.
 */
export const useStore = create((set) => ({
  activeModel: null,
  isDetailOpen: false,
  setActiveModel: (model) => set({ activeModel: model, isDetailOpen: true }),
  closeDetail: () => set({ isDetailOpen: false, activeModel: null }),
  
  // Hand Gesture State
  isHandTracking: false,
  handControlTarget: null, // can be 'main', or comp-{id}
  setHandTracking: (enabled, target = null) => set({ 
    isHandTracking: enabled, 
    handControlTarget: enabled ? target : null 
  }),
  handPosition: { x: 0.5, y: 0.5 },
  setHandPosition: (x, y) => set({ handPosition: { x, y } }),
  handZoom: 1,
  setHandZoom: (zoom) => set({ handZoom: zoom })
}))
