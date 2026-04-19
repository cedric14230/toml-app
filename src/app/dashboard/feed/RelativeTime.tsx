'use client'

/**
 * Composant client isolé uniquement pour le formatage des dates relatives.
 *
 * Pourquoi un Client Component ?
 * - `new Date()` côté serveur et côté client diffèrent de quelques
 *   millisecondes à quelques secondes, ce qui provoque une erreur
 *   d'hydratation React si on rend le texte côté serveur.
 * - `suppressHydrationWarning` sur l'élément <time> dit à React d'ignorer
 *   la différence de contenu texte entre le HTML serveur et le rendu client.
 *   C'est l'approche recommandée dans Next.js pour les valeurs dépendantes
 *   de l'heure courante.
 */

function formatRelative(isoDate: string): string {
  const date = new Date(isoDate)
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

  if (seconds < 60) return 'à l\u2019instant'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `il y a ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `il y a ${hours} h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `il y a ${days} j`
  if (days < 30) return `il y a ${Math.floor(days / 7)} sem.`
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
  }).format(date)
}

export default function RelativeTime({ date }: { date: string }) {
  return (
    <time dateTime={date} suppressHydrationWarning className="text-xs text-gray-400">
      {formatRelative(date)}
    </time>
  )
}
