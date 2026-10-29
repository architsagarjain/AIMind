'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BatteryCharging,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  Check,
  Expand,
  Monitor,
  Search,
  Sun,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { profile } from '@/content/profile';
import { useWindows, WINDOW_IDS } from '@/lib/store/windows';
import { cn } from '@/lib/utils';
import { WINDOW_META } from './icons';
import { Spotlight } from './spotlight';
import type { WindowId } from '@/types';

/**
 * The macOS menu bar, and it works.
 *
 * Proportions are copied from the real thing: 26px tall, the app name in
 * semibold with the menus in regular weight beside it, status glyphs and a
 * clock pinned right. Behaviour is copied too: click a title to open its
 * menu, slide across to switch menus while one is open, Escape or a click
 * outside to close, arrow keys and Enter to drive it from the keyboard.
 * Every item does something real on this site.
 *
 * Right of centre: the user menu, battery (the device's own, where the
 * browser reports it), a Control Centre, Spotlight (⌘K) and a calendar.
 *
 * The leading mark is the ARCHIT dot, not an Apple logo: this is an homage,
 * not an impersonation, and the logo is a trademark.
 */

type Item =
  | { label: string; shortcut?: string; checked?: boolean; disabled?: boolean; run: () => void }
  | 'separator';

interface MenuDef {
  id: string;
  title: React.ReactNode;
  label: string;
  items: Item[];
  /** Hidden on phones, where the logo menu carries the essentials. */
  wide?: boolean;
  bold?: boolean;
}

const SITE_URL = 'https://www.architsagarjain.com';

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(interval);
  }, []);
  return now;
}

interface BatteryState {
  level: number;
  charging: boolean;
}

/** The device's battery where the browser exposes it (Chrome, Edge); null elsewhere. */
function useBattery(): BatteryState | null {
  const [state, setState] = useState<BatteryState | null>(null);
  useEffect(() => {
    const nav = navigator as Navigator & {
      getBattery?: () => Promise<{
        level: number;
        charging: boolean;
        addEventListener: (t: string, f: () => void) => void;
        removeEventListener: (t: string, f: () => void) => void;
      }>;
    };
    if (!nav.getBattery) return;
    let battery: Awaited<ReturnType<NonNullable<typeof nav.getBattery>>> | null = null;
    const read = () => battery && setState({ level: battery.level, charging: battery.charging });
    nav
      .getBattery()
      .then((b) => {
        battery = b;
        read();
        b.addEventListener('levelchange', read);
        b.addEventListener('chargingchange', read);
      })
      .catch(() => {});
    return () => {
      battery?.removeEventListener('levelchange', read);
      battery?.removeEventListener('chargingchange', read);
    };
  }, []);
  return state;
}

function useOnline() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    setOnline(navigator.onLine);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  return online;
}

function useFullscreen() {
  const [full, setFull] = useState(false);
  useEffect(() => {
    const sync = () => setFull(Boolean(document.fullscreenElement));
    sync();
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);
  const toggle = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    else void document.documentElement.requestFullscreen?.().catch(() => {});
  }, []);
  const supported = typeof document !== 'undefined' && Boolean(document.documentElement.requestFullscreen);
  return { full, toggle, supported };
}

export function MenuBar({ onExit }: { onExit: () => void }) {
  const now = useClock();
  const battery = useBattery();
  const online = useOnline();
  const fullscreen = useFullscreen();
  const { windows, focused, open, close, focus, minimize, toggleMaximize, closeAll } = useWindows();

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [active, setActive] = useState(-1);
  const [spotlight, setSpotlight] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [brightness, setBrightness] = useState(1);
  const barRef = useRef<HTMLDivElement>(null);

  const notify = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 1600);
  }, []);

  const copy = useCallback(
    async (text: string, what: string) => {
      try {
        await navigator.clipboard.writeText(text);
        notify(`${what} copied`);
      } catch {
        notify('Copy blocked by the browser');
      }
    },
    [notify],
  );

  const openWindows = WINDOW_IDS.filter((id) => windows[id].open);
  const showDesktop = useCallback(() => {
    for (const id of WINDOW_IDS) if (windows[id].open && !windows[id].minimized) minimize(id);
  }, [minimize, windows]);

  const windowItem = (id: WindowId, n: number): Item => ({
    label: WINDOW_META[id].label,
    shortcut: `⌘${n}`,
    checked: focused === id,
    run: () => open(id),
  });

  const menus: MenuDef[] = useMemo(
    () => [
      {
        id: 'logo',
        label: 'ARCHIT menu',
        title: <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-accent-2 to-accent" />,
        items: [
          { label: 'About Archit', shortcut: '⌘1', run: () => open('about') },
          { label: 'Ask Archit…', shortcut: '⌘6', run: () => open('ask') },
          'separator',
          { label: 'Spotlight Search…', shortcut: '⌘K', run: () => setSpotlight(true) },
          { label: 'Read the Articles', run: () => (window.location.href = '/articles') },
          { label: 'Open Resume Page', run: () => (window.location.href = '/resume') },
          { label: 'Work With Me…', run: () => (window.location.href = '/work-with-me') },
          'separator',
          { label: 'Copy Email Address', run: () => void copy(profile.links.email, 'Email address') },
          { label: 'Connect on LinkedIn', run: () => window.open(profile.links.linkedin, '_blank', 'noopener') },
          'separator',
          { label: 'Back to the Intro', run: onExit },
        ],
      },
      {
        id: 'app',
        label: 'ARCHIT.OS',
        title: 'ARCHIT.OS',
        bold: true,
        wide: true,
        items: [
          { label: 'About ARCHIT.OS', run: () => open('about') },
          'separator',
          { label: 'Hide Windows', run: showDesktop },
          { label: 'Close All Windows', run: closeAll },
          'separator',
          { label: 'Quit to the Intro', run: onExit },
        ],
      },
      {
        id: 'file',
        label: 'File',
        title: 'File',
        wide: true,
        items: [
          { label: 'New Conversation with Archit', shortcut: '⌘6', run: () => open('ask') },
          'separator',
          ...WINDOW_IDS.filter((id) => id !== 'ask').map((id) => {
            const n = WINDOW_IDS.indexOf(id) + 1;
            return { label: `Open ${WINDOW_META[id].label}`, shortcut: `⌘${n}`, run: () => open(id) } as Item;
          }),
          'separator',
          { label: 'Download Resume (PDF)', run: () => window.open('/resume', '_blank', 'noopener') },
          { label: 'Close Window', shortcut: 'Esc', disabled: !focused, run: () => focused && close(focused) },
        ],
      },
      {
        id: 'edit',
        label: 'Edit',
        title: 'Edit',
        wide: true,
        items: [
          { label: 'Copy Email Address', run: () => void copy(profile.links.email, 'Email address') },
          { label: 'Copy LinkedIn URL', run: () => void copy(profile.links.linkedin, 'LinkedIn URL') },
          { label: 'Copy Link to This Site', run: () => void copy(SITE_URL, 'Site link') },
          'separator',
          { label: 'Find…', shortcut: '⌘K', run: () => setSpotlight(true) },
        ],
      },
      {
        id: 'view',
        label: 'View',
        title: 'View',
        wide: true,
        items: [
          {
            label: fullscreen.full ? 'Exit Full Screen' : 'Enter Full Screen',
            shortcut: '⌃⌘F',
            disabled: !fullscreen.supported,
            run: fullscreen.toggle,
          },
          { label: 'Show Desktop', run: showDesktop },
          'separator',
          { label: 'Read in Light Mode (Articles)', run: () => (window.location.href = '/articles') },
        ],
      },
      {
        id: 'window',
        label: 'Window',
        title: 'Window',
        wide: true,
        items: [
          { label: 'Minimise', shortcut: '⌘M', disabled: !focused, run: () => focused && minimize(focused) },
          { label: 'Zoom', disabled: !focused, run: () => focused && toggleMaximize(focused) },
          {
            label: 'Bring All to Front',
            disabled: openWindows.length === 0,
            run: () => openWindows.forEach((id) => focus(id)),
          },
          'separator',
          ...WINDOW_IDS.map((id, i) => windowItem(id, i + 1)),
        ],
      },
      {
        id: 'help',
        label: 'Help',
        title: 'Help',
        wide: true,
        items: [
          { label: 'Search Everything…', shortcut: '⌘K', run: () => setSpotlight(true) },
          { label: 'Keyboard Shortcuts', run: () => notify('⌘1 to ⌘6 open apps · ⌘K searches · Esc closes') },
          'separator',
          { label: 'Email Archit', run: () => (window.location.href = `mailto:${profile.links.email}`) },
          { label: 'Message on LinkedIn', run: () => window.open(profile.links.linkedin, '_blank', 'noopener') },
        ],
      },
    ],
    // windowItem depends only on focused and open, both listed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [close, closeAll, copy, focus, focused, fullscreen, minimize, notify, onExit, open, openWindows.join(), showDesktop, toggleMaximize],
  );


  // Close on a click outside the bar or its menus.
  useEffect(() => {
    if (!openMenu) return;
    const onDown = (e: PointerEvent) => {
      if (!barRef.current?.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [openMenu]);

  // Keyboard: the shortcuts the menus advertise, and arrow keys inside a menu.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpenMenu(null);
        setSpotlight((s) => !s);
        return;
      }
      if (mod && e.key.toLowerCase() === 'm' && focused) {
        e.preventDefault();
        minimize(focused);
        return;
      }
      if (mod && e.ctrlKey && e.metaKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        fullscreen.toggle();
        return;
      }
      if (!openMenu) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopImmediatePropagation();
        setOpenMenu(null);
        return;
      }
      const titles = menus.map((m) => m.id);
      const current = menus.find((m) => m.id === openMenu);
      const runnable = current
        ? current.items.filter((i): i is Exclude<Item, 'separator'> => i !== 'separator')
        : [];
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const i = titles.indexOf(openMenu);
        if (i === -1) return;
        const next = titles[(i + (e.key === 'ArrowRight' ? 1 : -1) + titles.length) % titles.length]!;
        setOpenMenu(next);
        setActive(-1);
        return;
      }
      if (!runnable.length) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const step = e.key === 'ArrowDown' ? 1 : -1;
        let i = active;
        for (let n = 0; n < runnable.length; n++) {
          i = (i + step + runnable.length) % runnable.length;
          if (!runnable[i]!.disabled) break;
        }
        setActive(i);
      } else if (e.key === 'Enter' && active >= 0) {
        e.preventDefault();
        const item = runnable[active];
        if (item && !item.disabled) {
          setOpenMenu(null);
          item.run();
        }
      }
    };
    // Capture, so Escape closes the menu before the desktop closes a window.
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [active, focused, fullscreen, menus, minimize, openMenu]);

  useEffect(() => setActive(-1), [openMenu]);

  // Sliding onto a title while another menu is open switches to it, as on a
  // Mac. The click that follows must not then close the menu it just opened.
  const hoverOpened = useRef<{ id: string; at: number } | null>(null);
  const toggleMenu = (id: string) => {
    const recent = hoverOpened.current;
    hoverOpened.current = null;
    if (recent?.id === id && performance.now() - recent.at < 700) {
      setOpenMenu(id);
      return;
    }
    setOpenMenu((m) => (m === id ? null : id));
  };
  const hoverMenu = (id: string) =>
    setOpenMenu((m) => {
      if (m && m !== id) {
        hoverOpened.current = { id, at: performance.now() };
        return id;
      }
      return m;
    });

  // The macOS menu bar clock: "Thu 29 Oct  4:05 PM".
  const time = now
    ? `${now.toLocaleDateString('en-GB', { weekday: 'short' })} ${now.getDate()} ${now.toLocaleDateString('en-GB', {
        month: 'short',
      })}\u2002${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
    : ' ';

  const BatteryIcon = !battery
    ? BatteryFull
    : battery.charging
      ? BatteryCharging
      : battery.level > 0.6
        ? BatteryFull
        : battery.level > 0.25
          ? BatteryMedium
          : BatteryLow;

  const titleClass = (id: string) =>
    cn(
      'relative flex h-[22px] items-center rounded-[5px] px-2 transition-colors',
      openMenu === id ? 'bg-black/10' : 'hover:bg-black/[0.06]',
    );

  return (
    <>
      {/* Brightness, from the Control Centre: a dimming layer over the desktop. */}
      {brightness < 1 && (
        <div
          className="pointer-events-none fixed inset-0 z-[880] bg-black"
          style={{ opacity: (1 - brightness) * 0.75 }}
          aria-hidden
        />
      )}

      <div
        ref={barRef}
        role="menubar"
        aria-label="Menu bar"
        className="glass absolute inset-x-0 top-0 z-900 flex h-[26px] items-center justify-between border-b border-hairline px-1.5 text-[13px] text-ink select-none sm:px-2"
      >
        <div className="flex min-w-0 items-center">
          {menus.map((m) => (
            <div key={m.id} className={cn('relative', m.wide && 'hidden md:block', m.id === 'app' && 'hidden sm:block')}>
              <button
                type="button"
                role="menuitem"
                aria-haspopup="menu"
                aria-expanded={openMenu === m.id}
                aria-label={m.label}
                onClick={() => toggleMenu(m.id)}
                onPointerEnter={() => hoverMenu(m.id)}
                className={cn(titleClass(m.id), m.bold && 'font-semibold tracking-tight', m.id === 'logo' && 'w-7 justify-center')}
              >
                {m.title}
              </button>
              <AnimatePresence>
                {openMenu === m.id && (
                  <MenuPanel
                    items={m.items}
                    active={active}
                    setActive={setActive}
                    onRun={(item) => {
                      setOpenMenu(null);
                      item.run();
                    }}
                    align="left"
                  />
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="flex items-center text-muted">
          {/* The user menu. */}
          <div className="relative hidden lg:block">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={openMenu === 'user'}
              onClick={() => toggleMenu('user')}
              onPointerEnter={() => hoverMenu('user')}
              className={cn(titleClass('user'), 'text-[12px] text-ink/80')}
            >
              {profile.name}
            </button>
            <AnimatePresence>
              {openMenu === 'user' && (
                <MenuPanel
                  align="right"
                  active={active}
                  setActive={setActive}
                  onRun={(item) => {
                    setOpenMenu(null);
                    item.run();
                  }}
                  header={
                    <div className="flex items-center gap-2.5 px-2.5 pt-1.5 pb-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1d9bf0,#5e5ce6)] text-[11px] font-bold text-white">
                        AJ
                      </span>
                      <span className="leading-tight">
                        <span className="block text-[13px] font-semibold text-ink">{profile.name}</span>
                        <span className="block text-[11px] text-faint">{profile.links.email}</span>
                      </span>
                    </div>
                  }
                  items={[
                    { label: 'Email Archit', run: () => (window.location.href = `mailto:${profile.links.email}`) },
                    { label: 'Copy Email Address', run: () => void copy(profile.links.email, 'Email address') },
                    { label: 'LinkedIn', run: () => window.open(profile.links.linkedin, '_blank', 'noopener') },
                    'separator',
                    { label: 'Resume', run: () => open('resume') },
                  ]}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Battery. */}
          <div className="relative hidden sm:block">
            <button
              type="button"
              aria-label="Battery"
              aria-expanded={openMenu === 'battery'}
              onClick={() => toggleMenu('battery')}
              onPointerEnter={() => hoverMenu('battery')}
              className={titleClass('battery')}
            >
              <BatteryIcon className="h-4 w-4" strokeWidth={1.6} />
            </button>
            <AnimatePresence>
              {openMenu === 'battery' && (
                <Popover align="right" className="w-56">
                  <p className="text-[13px] font-semibold text-ink">Battery</p>
                  <p className="mt-1 text-[12px] text-muted">
                    {battery
                      ? `${Math.round(battery.level * 100)}%${battery.charging ? ', charging' : ''}`
                      : 'Your browser does not share the battery level.'}
                  </p>
                  {battery && (
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/10">
                      <div className="h-full rounded-full bg-[#34c759]" style={{ width: `${battery.level * 100}%` }} />
                    </div>
                  )}
                </Popover>
              )}
            </AnimatePresence>
          </div>

          {/* Wi-Fi status: the connection the page is actually on. */}
          <span
            className="flex h-[22px] items-center px-2"
            role="img"
            aria-label={online ? 'Wi-Fi: connected' : 'Wi-Fi: offline'}
            title={online ? 'Wi-Fi: connected' : 'Wi-Fi: offline'}
          >
            {online ? <Wifi className="h-3.5 w-3.5" strokeWidth={2.2} /> : <WifiOff className="h-3.5 w-3.5" strokeWidth={2.2} />}
          </span>

          {/* Spotlight. */}
          <button
            type="button"
            aria-label="Spotlight Search"
            onClick={() => {
              setOpenMenu(null);
              setSpotlight(true);
            }}
            className={titleClass('search')}
          >
            <Search className="h-3.5 w-3.5" strokeWidth={2} />
          </button>

          {/* Control Centre. */}
          <div className="relative">
            <button
              type="button"
              aria-label="Control Centre"
              aria-expanded={openMenu === 'control'}
              onClick={() => toggleMenu('control')}
              onPointerEnter={() => hoverMenu('control')}
              className={titleClass('control')}
            >
              <ControlCentreGlyph />
            </button>
            <AnimatePresence>
              {openMenu === 'control' && (
                <Popover align="right" className="w-[min(18rem,calc(100vw-1rem))]">
                  <div className="grid grid-cols-2 gap-2">
                    <Tile
                      on={online}
                      icon={online ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                      label="Wi-Fi"
                      detail={online ? 'Connected' : 'Offline'}
                    />
                    <Tile
                      on={fullscreen.full}
                      icon={<Expand className="h-4 w-4" />}
                      label="Full Screen"
                      detail={fullscreen.full ? 'On' : 'Off'}
                      onClick={fullscreen.supported ? fullscreen.toggle : undefined}
                    />
                    <Tile
                      on={false}
                      icon={<Monitor className="h-4 w-4" />}
                      label="Show Desktop"
                      detail="Hide windows"
                      onClick={() => {
                        setOpenMenu(null);
                        showDesktop();
                      }}
                    />
                    <Tile
                      on
                      icon={<Search className="h-4 w-4" />}
                      label="Spotlight"
                      detail="⌘K"
                      onClick={() => {
                        setOpenMenu(null);
                        setSpotlight(true);
                      }}
                    />
                  </div>
                  <label className="mt-3 block rounded-xl bg-black/[0.04] p-3">
                    <span className="text-[12px] font-semibold text-ink">Display</span>
                    <span className="mt-2 flex items-center gap-2">
                      <Sun className="h-3.5 w-3.5 text-faint" />
                      <input
                        type="range"
                        min={0.3}
                        max={1}
                        step={0.01}
                        value={brightness}
                        onChange={(e) => setBrightness(Number(e.target.value))}
                        aria-label="Brightness"
                        className="h-1 w-full cursor-pointer accent-[#0a84ff]"
                      />
                    </span>
                  </label>
                </Popover>
              )}
            </AnimatePresence>
          </div>

          {/* Clock and calendar. */}
          <div className="relative">
            <button
              type="button"
              aria-label="Calendar"
              aria-expanded={openMenu === 'clock'}
              onClick={() => toggleMenu('clock')}
              onPointerEnter={() => hoverMenu('clock')}
              className={cn(titleClass('clock'), 'text-[12.5px] text-ink tabular-nums sm:text-[13px]')}
            >
              {time}
            </button>
            <AnimatePresence>
              {openMenu === 'clock' && now && (
                <Popover align="right" className="w-[min(17rem,calc(100vw-1rem))]">
                  <Calendar now={now} />
                </Popover>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>{spotlight && <Spotlight onClose={() => setSpotlight(false)} onExit={onExit} />}</AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            role="status"
            className="glass-strong fixed top-9 left-1/2 z-[950] -translate-x-1/2 rounded-full px-4 py-1.5 text-[12px] font-medium text-ink shadow-[var(--shadow-window)]"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ---------------------------------------------------------------- pieces

const panelMotion = {
  initial: { opacity: 0, y: -4, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, transition: { duration: 0.08 } },
  transition: { duration: 0.12 },
};

function MenuPanel({
  items,
  active,
  setActive,
  onRun,
  align,
  header,
}: {
  items: Item[];
  active: number;
  setActive: (i: number) => void;
  onRun: (item: Exclude<Item, 'separator'>) => void;
  align: 'left' | 'right';
  header?: React.ReactNode;
}) {
  let index = -1;
  return (
    <motion.div
      {...panelMotion}
      role="menu"
      className={cn(
        'glass-strong absolute top-[25px] z-[920] min-w-[230px] rounded-[10px] p-[5px] text-[13px] text-ink shadow-[var(--shadow-window)]',
        align === 'left' ? 'left-0' : 'right-0',
      )}
    >
      {header}
      {header && <div className="mx-2 my-1 h-px bg-black/10" />}
      {items.map((item, i) => {
        if (item === 'separator') return <div key={`sep-${i}`} className="mx-2 my-1 h-px bg-black/10" />;
        index++;
        const mine = index;
        return (
          <button
            key={item.label}
            type="button"
            role="menuitem"
            disabled={item.disabled}
            onPointerEnter={() => setActive(mine)}
            onClick={() => onRun(item)}
            className={cn(
              'flex w-full items-center gap-2 rounded-[5px] px-2 py-[3px] text-left whitespace-nowrap',
              item.disabled ? 'text-faint' : active === mine ? 'bg-[#0a64d6] text-white' : 'hover:bg-[#0a64d6] hover:text-white',
            )}
          >
            <span className="w-3.5 shrink-0">{item.checked && <Check className="h-3.5 w-3.5" strokeWidth={2.5} />}</span>
            <span className="flex-1">{item.label}</span>
            {item.shortcut && <span className="pl-6 text-[12px] opacity-60">{item.shortcut}</span>}
          </button>
        );
      })}
    </motion.div>
  );
}

function Popover({ children, align, className }: { children: React.ReactNode; align: 'left' | 'right'; className?: string }) {
  return (
    <motion.div
      {...panelMotion}
      className={cn(
        'glass-strong fixed top-[30px] z-[920] rounded-2xl p-3 text-ink shadow-[var(--shadow-window)] sm:absolute sm:top-[25px]',
        align === 'right' ? 'right-2 sm:right-0' : 'left-2 sm:left-0',
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

function Tile({
  on,
  icon,
  label,
  detail,
  onClick,
}: {
  on: boolean;
  icon: React.ReactNode;
  label: string;
  detail: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className="flex items-center gap-2.5 rounded-xl bg-black/[0.04] p-2.5 text-left transition-colors enabled:hover:bg-black/[0.07]"
    >
      <span
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
          on ? 'bg-[#0a84ff] text-white' : 'bg-black/10 text-ink',
        )}
      >
        {icon}
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block truncate text-[12px] font-semibold text-ink">{label}</span>
        <span className="block truncate text-[11px] text-faint">{detail}</span>
      </span>
    </button>
  );
}

/** The Control Centre symbol: two switches, one on the left and one on the right. */
function ControlCentreGlyph() {
  return (
    <svg viewBox="0 0 16 16" className="h-[15px] w-[15px]" aria-hidden>
      <rect x="1" y="2.2" width="14" height="5" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="12.4" cy="4.7" r="1.6" fill="currentColor" />
      <rect x="1" y="8.8" width="14" height="5" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="3.6" cy="11.3" r="1.6" fill="currentColor" />
    </svg>
  );
}

function Calendar({ now }: { now: Date }) {
  const year = now.getFullYear();
  const month = now.getMonth();
  const first = new Date(year, month, 1);
  // Monday-first, as an Indian calendar usually is.
  const lead = (first.getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  return (
    <div>
      <p className="text-[12px] font-semibold text-accent uppercase">
        {new Intl.DateTimeFormat('en-IN', { weekday: 'long' }).format(now)}
      </p>
      <p className="font-display text-[22px] leading-tight font-bold text-ink">
        {new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).format(now)}
      </p>
      <div className="mt-3 grid grid-cols-7 gap-y-1 text-center text-[11px]">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <span key={`${d}${i}`} className="font-semibold text-faint">
            {d}
          </span>
        ))}
        {cells.map((d, i) => (
          <span
            key={i}
            className={cn(
              'mx-auto flex h-6 w-6 items-center justify-center rounded-full tabular-nums',
              d === now.getDate() ? 'bg-[#ff3b30] font-semibold text-white' : 'text-ink',
            )}
          >
            {d ?? ''}
          </span>
        ))}
      </div>
    </div>
  );
}
