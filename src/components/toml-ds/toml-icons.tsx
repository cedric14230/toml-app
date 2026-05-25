'use client'

import type { CSSProperties } from 'react'

interface TomlIconProps {
  name: string
  size?: number
  stroke?: number
  style?: CSSProperties
}

export const TomlIcon = ({ name, size = 22, stroke = 2, style }: TomlIconProps) => {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: stroke,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    style,
  }

  const icons: Record<string, React.ReactElement> = {
    home:     <svg {...props}><path d="M3 11 L12 3 L21 11 V20 a1 1 0 0 1 -1 1 H15 V14 H9 V21 H4 a1 1 0 0 1 -1 -1 Z"/></svg>,
    list:     <svg {...props}><path d="M8 6 L21 6 M8 12 L21 12 M8 18 L21 18"/><circle cx="4" cy="6" r="1.5" fill="currentColor"/><circle cx="4" cy="12" r="1.5" fill="currentColor"/><circle cx="4" cy="18" r="1.5" fill="currentColor"/></svg>,
    friends:  <svg {...props}><circle cx="9" cy="8" r="3.5"/><path d="M3 21 c0 -4 3 -6 6 -6 s6 2 6 6"/><circle cx="17" cy="6" r="2.5"/><path d="M14 14 c2 -1 4 -1 6 0 s2 3 2 5"/></svg>,
    search:   <svg {...props}><circle cx="11" cy="11" r="7"/><path d="M21 21 L16.5 16.5"/></svg>,
    bell:     <svg {...props}><path d="M6 16 V11 a6 6 0 1 1 12 0 V16 L20 18 H4 Z"/><path d="M10 21 a2 2 0 0 0 4 0"/></svg>,
    heart:    <svg {...props}><path d="M12 21 s-7 -4.5 -9 -10 c-1 -3 1 -6 4 -6 c2 0 3.5 1 5 3 c1.5 -2 3 -3 5 -3 c3 0 5 3 4 6 c-2 5.5 -9 10 -9 10 z"/></svg>,
    star:     <svg {...props}><path d="M12 2 L14.8 8.5 L22 9.3 L16.5 13.9 L18.2 21 L12 17.3 L5.8 21 L7.5 13.9 L2 9.3 L9.2 8.5 Z"/></svg>,
    plus:     <svg {...props}><path d="M12 5 V19 M5 12 H19"/></svg>,
    check:    <svg {...props}><path d="M4 12 L10 18 L20 6"/></svg>,
    x:        <svg {...props}><path d="M6 6 L18 18 M6 18 L18 6"/></svg>,
    gift:     <svg {...props}><path d="M3 11 H21 V21 H3 Z"/><path d="M12 11 V21 M4 7 H20 V11 H4 Z M8 7 c-1.5 0 -3 -1 -3 -2.5 S6.5 2 8 2 c2 0 4 5 4 5 s2 -5 4 -5 c1.5 0 3 1 3 2.5 S17.5 7 16 7"/></svg>,
    link:     <svg {...props}><path d="M10 14 a4 4 0 0 0 5.7 0 L19 11 a4 4 0 0 0 -5.7 -5.7 L11.5 7"/><path d="M14 10 a4 4 0 0 0 -5.7 0 L5 13 a4 4 0 0 0 5.7 5.7 L12.5 17"/></svg>,
    share:    <svg {...props}><path d="M4 12 V20 h16 V12 M16 6 L12 2 L8 6 M12 2 V15"/></svg>,
    bookmark: <svg {...props}><path d="M6 3 H18 V21 L12 17 L6 21 Z"/></svg>,
    sparkle:  <svg {...props}><path d="M12 3 L14 10 L21 12 L14 14 L12 21 L10 14 L3 12 L10 10 Z"/></svg>,
    eye:      <svg {...props}><path d="M2 12 s4 -7 10 -7 s10 7 10 7 s-4 7 -10 7 s-10 -7 -10 -7 Z"/><circle cx="12" cy="12" r="3"/></svg>,
    lock:     <svg {...props}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11 V8 a4 4 0 0 1 8 0 V11"/></svg>,
    chat:     <svg {...props}><path d="M4 12 c0 -4 4 -7 8 -7 s8 3 8 7 s-4 7 -8 7 c-1 0 -2 0 -3 -0.5 L4 20 V15 c0 -1 0 -2 0 -3 Z"/></svg>,
    edit:     <svg {...props}><path d="M11 5 H6 a2 2 0 0 0 -2 2 V18 a2 2 0 0 0 2 2 H17 a2 2 0 0 0 2 -2 V13"/><path d="M18 3 L21 6 L11 16 L7 17 L8 13 Z"/></svg>,
    trash:    <svg {...props}><path d="M4 7 H20 M9 7 V4 H15 V7 M6 7 L7 21 H17 L18 7 M10 11 V17 M14 11 V17"/></svg>,
    arrow:    <svg {...props}><path d="M5 12 H19 M13 6 L19 12 L13 18"/></svg>,
    menu:     <svg {...props}><path d="M4 7 H20 M4 12 H20 M4 17 H20"/></svg>,
    settings: <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M12 1 V4 M12 20 V23 M4.2 4.2 L6.3 6.3 M17.7 17.7 L19.8 19.8 M1 12 H4 M20 12 H23 M4.2 19.8 L6.3 17.7 M17.7 6.3 L19.8 4.2"/></svg>,
    user:     <svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21 c0 -4 4 -7 8 -7 s8 3 8 7"/></svg>,
    filter:   <svg {...props}><path d="M4 5 H20 L14 12 V20 L10 18 V12 Z"/></svg>,
    grid:     <svg {...props}><rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/></svg>,
    rows:     <svg {...props}><rect x="3" y="4" width="18" height="5" rx="1"/><rect x="3" y="11" width="18" height="5" rx="1"/><rect x="3" y="18" width="18" height="3" rx="1"/></svg>,
  }

  return icons[name] ?? <svg {...props}><circle cx="12" cy="12" r="9" /></svg>
}
