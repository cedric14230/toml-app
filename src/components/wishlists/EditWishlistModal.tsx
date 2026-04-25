'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

type Visibility = 'private' | 'friends' | 'public'

export type WishlistEditData = {
  id: string
  title: string
  description: string | null
  visibility: Visibility
  cover_url: string | null
}

type Props = {
  wishlist: WishlistEditData
  onClose: () => void
  onSuccess: () => void
}

const VISIBILITY_OPTIONS: {
  value: Visibility
  label: string
  description: string
  icon: React.ReactNode
}[] = [
  {
    value: 'private',
    label: 'Privé',
    description: 'Vous seul',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    value: 'friends',
    label: 'Amis',
    description: 'Vos amis',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    value: 'public',
    label: 'Public',
    description: 'Tout le monde',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export default function EditWishlistModal({ wishlist, onClose, onSuccess }: Props) {
  const supabase = createSupabaseBrowserClient()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState(wishlist.title)
  const [description, setDescription] = useState(wishlist.description ?? '')
  const [visibility, setVisibility] = useState<Visibility>(wishlist.visibility)
  const [coverUrl, setCoverUrl] = useState(wishlist.cover_url ?? '')
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(wishlist.cover_url)
  const [archiveConfirm, setArchiveConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [archiving, setArchiving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Focus sur le titre à l'ouverture
  const titleRef = useRef<HTMLInputElement>(null)
  useEffect(() => { titleRef.current?.focus() }, [])

  // Fermeture sur Escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  // Sélection d'un fichier image
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Seules les images sont acceptées.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("L'image doit faire moins de 5 Mo.")
      return
    }
    setError(null)
    setPendingFile(file)
    setCoverUrl('') // vider le champ URL si un fichier est choisi
    const reader = new FileReader()
    reader.onload = () => setPreviewUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  // Mise à jour de l'aperçu depuis le champ URL
  function handleUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setCoverUrl(val)
    setPendingFile(null) // annuler le fichier en attente
    setPreviewUrl(val.trim() || null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleRemoveCover() {
    setCoverUrl('')
    setPendingFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Enregistrer
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    let finalCoverUrl: string | null = coverUrl.trim() || null

    // Upload du fichier si nécessaire
    if (pendingFile) {
      const formData = new FormData()
      formData.append('file', pendingFile)

      const res = await fetch(`/api/wishlists/${wishlist.id}/upload-cover`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Erreur lors de l'envoi de l'image.")
        setLoading(false)
        return
      }

      finalCoverUrl = data.url
    }

    const { error: updateError } = await supabase
      .from('wishlists')
      .update({
        title: title.trim(),
        description: description.trim() || null,
        visibility,
        cover_url: finalCoverUrl,
      })
      .eq('id', wishlist.id)

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    onSuccess()
  }

  // Archiver
  async function handleArchive() {
    setError(null)
    setArchiving(true)

    const { error: archiveError } = await supabase
      .from('wishlists')
      .update({ archived: true })
      .eq('id', wishlist.id)

    if (archiveError) {
      setError(archiveError.message)
      setArchiving(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-modal-title"
        className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col"
      >
        {/* En-tête */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
          <h2 id="edit-modal-title" className="text-lg font-semibold text-gray-900">
            Modifier la wishlist
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Formulaire scrollable */}
        <form
          onSubmit={handleSubmit}
          className="px-6 py-5 space-y-5 overflow-y-auto flex-1"
        >
          {error && (
            <div role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {/* Titre */}
          <div>
            <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1.5">
              Titre <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id="edit-title"
              ref={titleRef}
              type="text"
              required
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex : Noël, Anniversaire…"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1.5">
              Description{' '}
              <span className="text-gray-400 font-normal">(optionnel)</span>
            </label>
            <textarea
              id="edit-description"
              rows={3}
              maxLength={300}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez votre liste en quelques mots…"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition resize-none"
            />
          </div>

          {/* Visibilité */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Visibilité</p>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Visibilité de la wishlist">
              {VISIBILITY_OPTIONS.map((opt) => {
                const isSelected = visibility === opt.value
                return (
                  <label
                    key={opt.value}
                    className={`
                      flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 cursor-pointer
                      text-center transition-all duration-100 select-none
                      ${isSelected
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="edit-visibility"
                      value={opt.value}
                      checked={isSelected}
                      onChange={() => setVisibility(opt.value)}
                      className="sr-only"
                    />
                    <span aria-hidden="true">{opt.icon}</span>
                    <span className="text-xs font-semibold leading-none">{opt.label}</span>
                    <span className={`text-[10px] leading-none ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>
                      {opt.description}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Image de couverture */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Image de couverture{' '}
              <span className="text-gray-400 font-normal">(optionnel)</span>
            </p>

            {/* Aperçu */}
            {previewUrl && (
              <div className="relative mb-3 rounded-xl overflow-hidden border border-gray-200 h-32 bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Aperçu couverture"
                  className="w-full h-full object-cover"
                  onError={() => setPreviewUrl(null)}
                />
                <button
                  type="button"
                  onClick={handleRemoveCover}
                  aria-label="Supprimer l'image"
                  className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Champ URL */}
            <input
              type="url"
              value={coverUrl}
              onChange={handleUrlChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
            />

            {/* Séparateur */}
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">ou</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Upload fichier */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
              id="cover-file-input"
            />
            <label
              htmlFor="cover-file-input"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {pendingFile ? pendingFile.name : 'Choisir une image depuis votre appareil'}
            </label>
          </div>

          {/* Bouton enregistrer */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="flex-1 py-2.5 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </div>

          {/* Zone archivage */}
          <div className="pt-2 border-t border-gray-100">
            {!archiveConfirm ? (
              <button
                type="button"
                onClick={() => setArchiveConfirm(true)}
                className="w-full py-2.5 px-4 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                Archiver cette wishlist
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-center text-gray-500">
                  La wishlist sera masquée du tableau de bord. Confirmez ?
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setArchiveConfirm(false)}
                    className="flex-1 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={handleArchive}
                    disabled={archiving}
                    className="flex-1 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {archiving ? 'Archivage…' : 'Confirmer'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
