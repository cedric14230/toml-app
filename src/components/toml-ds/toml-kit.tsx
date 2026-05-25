'use client'

import { useEffect, useRef } from 'react'
import type {
  CSSProperties,
  ReactNode,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  HTMLAttributes,
} from 'react'
import { TomlIcon } from './toml-icons'

// ── Root wrapper ──────────────────────────────────────────────────────────────

interface TomlRootProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const TomlRoot = ({ children, style, className = '', ...rest }: TomlRootProps) => (
  <div className={`toml-ds ${className}`} style={style} {...rest}>
    {children}
  </div>
)

// ── Buttons ───────────────────────────────────────────────────────────────────

interface TomlButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'rose' | 'outline' | 'ghost'
  size?: 'sm' | 'lg'
  stamp?: boolean
  icon?: string
}

export const TomlButton = ({
  variant = 'primary',
  size,
  stamp = true,
  icon,
  children,
  className = '',
  ...rest
}: TomlButtonProps) => {
  const cls = [
    'btn',
    `btn-${variant}`,
    size === 'sm' && 'btn-sm',
    size === 'lg' && 'btn-lg',
    stamp && (variant === 'primary' || variant === 'accent') && 'btn-stamp',
    className,
  ].filter(Boolean).join(' ')
  return (
    <button className={cls} {...rest}>
      {icon && <TomlIcon name={icon} size={size === 'sm' ? 14 : 16} />}
      {children}
    </button>
  )
}

interface TomlIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string
  variant?: string
  size?: number
  stamp?: boolean
}

export const TomlIconButton = ({
  icon,
  variant = 'outline',
  size = 42,
  stamp = false,
  className = '',
  ...rest
}: TomlIconButtonProps) => {
  const cls = ['btn', `btn-${variant}`, stamp && 'btn-stamp', className].filter(Boolean).join(' ')
  return (
    <button
      className={cls}
      style={{ width: size, height: size, padding: 0, borderRadius: 999 }}
      {...rest}
    >
      <TomlIcon name={icon} size={Math.round(size * 0.45)} />
    </button>
  )
}

// ── Inputs ────────────────────────────────────────────────────────────────────

interface TomlInputProps extends InputHTMLAttributes<HTMLInputElement> {
  soft?: boolean
}

export const TomlInput = ({ soft = false, className = '', ...rest }: TomlInputProps) => (
  <input className={`input ${soft ? 'input-soft' : ''} ${className}`} {...rest} />
)

export const TomlTextarea = ({ className = '', rows = 3, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement> & { rows?: number }) => (
  <textarea
    className={`input ${className}`}
    rows={rows}
    style={{ resize: 'none', fontFamily: 'var(--t-font-ui)' }}
    {...rest}
  />
)

// ── Chip ──────────────────────────────────────────────────────────────────────

interface TomlChipProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'mustard' | 'rose' | 'denim'
  active?: boolean
  children: ReactNode
}

export const TomlChip = ({ variant, active = false, children, className = '', ...rest }: TomlChipProps) => {
  const cls = [
    'chip',
    active && 'chip-active',
    variant && `chip-${variant}`,
    className,
  ].filter(Boolean).join(' ')
  return <span className={cls} {...rest}>{children}</span>
}

// ── Badge ─────────────────────────────────────────────────────────────────────

interface TomlBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  dot?: boolean
  color?: string
  children?: ReactNode
}

export const TomlBadge = ({ dot = false, color, children, style, ...rest }: TomlBadgeProps) => (
  <span
    className={`badge ${dot ? 'badge-dot' : ''}`}
    style={{ ...(color ? { background: color } : {}), ...style }}
    {...rest}
  >
    {!dot && children}
  </span>
)

// ── Sticker ───────────────────────────────────────────────────────────────────

interface TomlStickerProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'rose' | 'denim' | 'soft'
  children: ReactNode
}

export const TomlSticker = ({ variant, children, className = '', ...rest }: TomlStickerProps) => {
  const cls = ['sticker', variant && `sticker-${variant}`, className].filter(Boolean).join(' ')
  return <span className={cls} {...rest}>{children}</span>
}

// ── Hand (italic accent) ──────────────────────────────────────────────────────

interface TomlHandProps extends HTMLAttributes<HTMLSpanElement> {
  color?: string
  size?: number
  children: ReactNode
}

export const TomlHand = ({ color, size = 20, children, style, ...rest }: TomlHandProps) => (
  <span
    className="hand"
    style={{ fontSize: size, color: color ?? 'var(--t-rose)', ...style }}
    {...rest}
  >
    {children}
  </span>
)

// ── Card ──────────────────────────────────────────────────────────────────────

interface TomlCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'stamp' | 'soft' | 'flat'
  children: ReactNode
}

export const TomlCard = ({ variant = 'soft', children, className = '', ...rest }: TomlCardProps) => {
  const map: Record<string, string> = { stamp: 'card', soft: 'card-soft', flat: 'card-flat' }
  return (
    <div className={`${map[variant] ?? 'card-soft'} ${className}`} {...rest}>
      {children}
    </div>
  )
}

// ── Avatar ────────────────────────────────────────────────────────────────────

interface TomlAvatarProps extends HTMLAttributes<HTMLDivElement> {
  initial?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  tone?: 1 | 2 | 3 | 4 | 5
  src?: string
}

export const TomlAvatar = ({ initial = '?', size = 'md', tone, src, style, ...rest }: TomlAvatarProps) => {
  const t = tone ?? ((initial.charCodeAt(0) % 5) + 1)
  const cls = `avatar avatar-${size} avatar-${t}`
  if (src) {
    return (
      <div
        className={cls}
        style={{ backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center', ...style }}
        {...rest}
      />
    )
  }
  return <div className={cls} style={style} {...rest}>{initial}</div>
}

interface Person {
  initial?: string
  tone?: 1 | 2 | 3 | 4 | 5
}

interface TomlAvatarStackProps {
  people?: Person[]
  max?: number
  size?: 'xs' | 'sm' | 'md'
}

export const TomlAvatarStack = ({ people = [], max = 4, size = 'sm' }: TomlAvatarStackProps) => {
  const shown = people.slice(0, max)
  const more = Math.max(0, people.length - max)
  return (
    <div style={{ display: 'flex' }}>
      {shown.map((p, i) => (
        <TomlAvatar
          key={i}
          initial={p.initial ?? '?'}
          tone={(p.tone ?? ((i % 5) + 1)) as 1 | 2 | 3 | 4 | 5}
          size={size}
          style={{ marginLeft: i ? -10 : 0, border: '2px solid var(--t-bg)' }}
        />
      ))}
      {more > 0 && (
        <div
          className={`avatar avatar-${size}`}
          style={{
            marginLeft: -10,
            border: '2px solid var(--t-bg)',
            background: 'var(--t-bg-2)',
            color: 'var(--t-ink-2)',
            fontSize: 12,
          }}
        >
          +{more}
        </div>
      )}
    </div>
  )
}

// ── Stars (priority) ──────────────────────────────────────────────────────────

interface TomlStarsProps {
  value?: number
  max?: number
  size?: number
}

export const TomlStars = ({ value = 3, max = 3, size = 14 }: TomlStarsProps) => (
  <span style={{ display: 'inline-flex', gap: 2 }}>
    {Array.from({ length: max }).map((_, i) => (
      <span
        key={i}
        className={`star ${i >= value ? 'star-dim' : ''}`}
        style={{ width: size, height: size }}
      />
    ))}
  </span>
)

// ── Status dot ────────────────────────────────────────────────────────────────

export const TomlDot = ({ status = 'available' }: { status?: 'available' | 'reserved' | 'gifted' }) => (
  <span className={`dot dot-${status}`} />
)

// ── Divider ───────────────────────────────────────────────────────────────────

export const TomlDivider = ({ dashed = false, style }: { dashed?: boolean; style?: CSSProperties }) => (
  <hr className={`divider ${dashed ? 'divider-dashed' : ''}`} style={style} />
)

// ── Image placeholder ─────────────────────────────────────────────────────────

interface TomlImageProps extends HTMLAttributes<HTMLDivElement> {
  tone?: 1 | 2 | 3 | 4 | 5 | 6
  height?: number
  label?: string
}

export const TomlImage = ({ tone = 1, height = 180, label, style, ...rest }: TomlImageProps) => (
  <div className={`img img-${tone}`} style={{ height, position: 'relative', ...style }} {...rest}>
    {label && (
      <span style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'rgba(26,31,46,.5)', fontFamily: 'monospace', fontSize: 12,
      }}>
        {label}
      </span>
    )}
  </div>
)

// ── Label ─────────────────────────────────────────────────────────────────────

interface TomlLabelProps extends HTMLAttributes<HTMLDivElement> {
  color?: string
  children: ReactNode
}

export const TomlLabel = ({ color, children, style, ...rest }: TomlLabelProps) => (
  <div className="label" style={{ color, ...style }} {...rest}>{children}</div>
)

// ── Toast ─────────────────────────────────────────────────────────────────────

interface TomlToastProps {
  icon?: string
  title: string
  body?: string
  color?: string
}

export const TomlToast = ({ icon = 'check', title, body, color = 'var(--t-success)' }: TomlToastProps) => (
  <div className="card" style={{ padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'center' }}>
    <span style={{
      width: 36, height: 36, borderRadius: 999, background: color, color: 'white',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <TomlIcon name={icon} size={20} />
    </span>
    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: 600, fontSize: 14 }}>{title}</div>
      {body && <div style={{ fontSize: 12, color: 'var(--t-ink-2)' }}>{body}</div>}
    </div>
  </div>
)

// ── Gift-giver banner ─────────────────────────────────────────────────────────

interface TomlGiverBannerProps {
  emoji?: string
  title: string
  body?: string
  badge?: string
}

export const TomlGiverBanner = ({ emoji = '🤫', title, body, badge }: TomlGiverBannerProps) => (
  <div className="giver-banner">
    <span style={{ fontSize: 26 }}>{emoji}</span>
    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: 700, fontSize: 14 }}>{title}</div>
      {body && <div style={{ fontSize: 12, color: 'var(--t-ink-2)' }}>{body}</div>}
    </div>
    {badge && <span className="chip" style={{ background: 'var(--t-paper)' }}>{badge}</span>}
  </div>
)

// ── Bookmarklet ───────────────────────────────────────────────────────────────
// Même logique que BookmarkletInstall.tsx : le href javascript: est injecté
// via useEffect pour éviter les problèmes de hydration SSR.

export const TomlBookmarklet = ({ children = '+ Ajouter à Toml' }: { children?: ReactNode }) => {
  const linkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!linkRef.current) return
    const origin = window.location.origin
    const code = `(function(){
function g(p){var e=document.querySelector('meta[property="'+p+'"]')||document.querySelector('meta[name="'+p+'"]');return e?e.getAttribute('content'):'';}
var t=g('og:title')||g('twitter:title')||document.title||'';
var im=g('og:image')||g('og:image:url')||g('twitter:image')||'';
var pr=g('og:price:amount')||g('product:price:amount')||'';
var ss=document.querySelectorAll('script[type="application/ld+json"]');
for(var k=0;k<ss.length;k++){
  try{
    var d=JSON.parse(ss[k].textContent||'');
    var ns=d['@graph']?d['@graph']:(Array.isArray(d)?d:[d]);
    for(var j=0;j<ns.length;j++){
      var n=ns[j];
      if(n['@type']==='Product'){
        t=t||n.name||'';
        var imd=n.image;
        if(!im){if(typeof imd==='string')im=imd;else if(imd&&imd.url)im=imd.url;else if(Array.isArray(imd)&&imd[0])im=typeof imd[0]==='string'?imd[0]:(imd[0].url||'');}
        if(!pr){var of=Array.isArray(n.offers)?n.offers[0]:n.offers;if(of&&of.price)pr=String(of.price);}
        break;
      }
    }
  }catch(e){}
}
window.open('${origin}/add-item?'+new URLSearchParams({title:t,image:im,price:pr,sourceUrl:window.location.href}).toString(),'_blank');
})()`.replace(/\n/g, '')
    linkRef.current.setAttribute('href', 'javascript:' + code)
  }, [])

  return (
    <a
      ref={linkRef}
      href="#"
      className="bookmarklet"
      draggable="true"
      aria-label="Bookmarklet TOML — glisser dans les favoris"
    >
      {children}
    </a>
  )
}
