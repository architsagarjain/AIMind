'use client';

import { create } from 'zustand';
import type { DesktopWindowState, WindowId } from '@/types';

/**
 * A small window manager: open/close/focus/minimise/maximise plus drag and
 * resize. Positions are cascaded so a fresh window never lands exactly on the
 * previous one.
 */

const BASE_Z = 100;

/** Default geometry per window, tuned to each window's content density. */
const DEFAULTS: Record<WindowId, { width: number; height: number }> = {
  about: { width: 620, height: 520 },
  projects: { width: 940, height: 620 },
  timeline: { width: 780, height: 600 },
  resume: { width: 820, height: 660 },
  ask: { width: 720, height: 640 },
};

function initialWindow(id: WindowId, index: number): DesktopWindowState {
  const { width, height } = DEFAULTS[id];
  return {
    id,
    open: false,
    minimized: false,
    maximized: false,
    x: 0,
    y: 0,
    width,
    height,
    z: BASE_Z + index,
  };
}

const IDS: WindowId[] = ['about', 'projects', 'timeline', 'resume', 'ask'];

interface WindowStore {
  windows: Record<WindowId, DesktopWindowState>;
  focused: WindowId | null;
  topZ: number;
  /** Cascade counter so successive opens step down-right. */
  cascade: number;

  open: (id: WindowId) => void;
  close: (id: WindowId) => void;
  focus: (id: WindowId) => void;
  minimize: (id: WindowId) => void;
  toggleMaximize: (id: WindowId) => void;
  move: (id: WindowId, x: number, y: number) => void;
  resize: (id: WindowId, width: number, height: number) => void;
  closeAll: () => void;
}

export const useWindows = create<WindowStore>((set, get) => ({
  windows: Object.fromEntries(IDS.map((id, i) => [id, initialWindow(id, i)])) as Record<
    WindowId,
    DesktopWindowState
  >,
  focused: null,
  topZ: BASE_Z + IDS.length,
  cascade: 0,

  open: (id) => {
    const state = get();
    const win = state.windows[id];
    const topZ = state.topZ + 1;

    // Already open: just focus and un-minimise.
    if (win.open) {
      set({
        focused: id,
        topZ,
        windows: { ...state.windows, [id]: { ...win, minimized: false, z: topZ } },
      });
      return;
    }

    // Place with a cascade, clamped to the viewport on the client.
    const cascade = state.cascade % 5;
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
    const width = Math.min(win.width, vw - 48);
    const height = Math.min(win.height, vh - 140);
    const x = Math.max(24, Math.round((vw - width) / 2) + cascade * 28 - 56);
    const y = Math.max(52, Math.round((vh - height) / 2) + cascade * 24 - 48);

    set({
      focused: id,
      topZ,
      cascade: state.cascade + 1,
      windows: {
        ...state.windows,
        [id]: { ...win, open: true, minimized: false, x, y, width, height, z: topZ },
      },
    });
  },

  close: (id) => {
    const state = get();
    const remaining = Object.values(state.windows)
      .filter((w) => w.open && w.id !== id)
      .sort((a, b) => b.z - a.z);

    set({
      focused: remaining[0]?.id ?? null,
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], open: false, minimized: false, maximized: false },
      },
    });
  },

  focus: (id) => {
    const state = get();
    if (state.focused === id && !state.windows[id].minimized) return;
    const topZ = state.topZ + 1;
    set({
      focused: id,
      topZ,
      windows: { ...state.windows, [id]: { ...state.windows[id], z: topZ, minimized: false } },
    });
  },

  minimize: (id) => {
    const state = get();
    const remaining = Object.values(state.windows)
      .filter((w) => w.open && !w.minimized && w.id !== id)
      .sort((a, b) => b.z - a.z);
    set({
      focused: remaining[0]?.id ?? null,
      windows: { ...state.windows, [id]: { ...state.windows[id], minimized: true } },
    });
  },

  toggleMaximize: (id) => {
    const state = get();
    const win = state.windows[id];
    set({ windows: { ...state.windows, [id]: { ...win, maximized: !win.maximized } } });
  },

  move: (id, x, y) => {
    const state = get();
    set({ windows: { ...state.windows, [id]: { ...state.windows[id], x, y } } });
  },

  resize: (id, width, height) => {
    const state = get();
    set({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          width: Math.max(360, width),
          height: Math.max(280, height),
        },
      },
    });
  },

  closeAll: () => {
    const state = get();
    set({
      focused: null,
      windows: Object.fromEntries(
        Object.entries(state.windows).map(([k, w]) => [k, { ...w, open: false, minimized: false }]),
      ) as Record<WindowId, DesktopWindowState>,
    });
  },
}));

export const WINDOW_IDS = IDS;
