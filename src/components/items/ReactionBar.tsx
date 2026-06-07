'use client'

import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import type { ReactionCounts, ReactionType } from '@/components/wishlist/types'

// ── Config ────────────────────────────────────────────────────────────────────

const REACTIONS: { type: ReactionType; emoji: string; label: string }[] = [
  { type: 'love',        emoji: '❤️', label: "J'adore"      },
  { type: 'useful',      emoji: '✅', label: 'Utile'         },
  { type: 'interesting', emoji: '🤔', label: 'Intéressant'  },
]

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  itemId: string
  initialCounts: ReactionCounts
  initialMyReaction: ReactionType | null
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ReactionBar({ itemId, initialCounts, initialMyReaction }: Props) {
  const [counts, setCounts]         = useState<ReactionCounts>(initialCounts)
  const [myReaction, setMyReaction] = useState<ReactionType | null>(initialMyReaction)
  const [loading, setLoading]       = useState(false)

  async function handleReact(type: ReactionType) {
    if (loading) return
    setLoading(true)

    const supabase = createSupabaseBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const prev = myReaction

    if (prev === type) {
      // Toggle off — supprimer la réaction
      const { error } = await supabase
        .from('reactions')
        .delete()
        .eq('item_id', itemId)
        .eq('user_id', user.id)
        .eq('reaction_type', type)

      if (!error) {
        setCounts(c => ({ ...c, [type]: Math.max(0, c[type] - 1) }))
        setMyReaction(null)
      }
    } else {
      // Changer ou ajouter — supprimer l'ancienne réaction d'abord
      if (prev) {
        await supabase
          .from('reactions')
          .delete()
          .eq('item_id', itemId)
          .eq('user_id', user.id)
          .eq('reaction_type', prev)
        setCounts(c => ({ ...c, [prev]: Math.max(0, c[prev] - 1) }))
      }

      const { error } = await supabase
        .from('reactions')
        .insert({ item_id: itemId, user_id: user.id, reaction_type: type })

      if (!error) {
        setCounts(c => ({ ...c, [type]: c[type] + 1 }))
        setMyReaction(type)
      }
    }

    setLoading(false)
  }

  const hasAny = counts.love > 0 || counts.useful > 0 || counts.interesting > 0

  return (
    <div
      style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}
      // Empêche le clic de remonter vers le wrapper Link ou div parent
      onClick={e => { e.preventDefault(); e.stopPropagation() }}
    >
      {REACTIONS.map(({ type, emoji, label }) => {
        const count  = counts[type]
        const active = myReaction === type
        // N'afficher que les réactions avec des votes OU la réaction de l'utilisateur,
        // sauf si aucune réaction n'existe encore (afficher les 3 boutons vides)
        if (!hasAny || count > 0 || active) {
          return (
            <button
              key={type}
              onClick={() => handleReact(type)}
              disabled={loading}
              title={label}
              aria-label={`${label}${count > 0 ? ` (${count})` : ''}`}
              aria-pressed={active}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 3,
                padding: '3px 8px', borderRadius: 999,
                border: active ? '1.5px solid var(--t-ink)' : '1px solid var(--t-line)',
                background: active ? 'var(--t-ink)' : 'rgba(255,255,255,0.88)',
                fontSize: 11, fontWeight: 600,
                cursor: loading ? 'default' : 'pointer',
                color: active ? 'var(--t-bg)' : 'var(--t-ink-2)',
                fontFamily: 'var(--t-font-ui)',
                transition: 'all 0.12s',
                opacity: loading ? 0.65 : 1,
                backdropFilter: 'blur(4px)',
              }}
            >
              <span style={{ fontSize: 12, lineHeight: 1 }}>{emoji}</span>
              {count > 0 && <span>{count}</span>}
            </button>
          )
        }
        return null
      })}
    </div>
  )
}
