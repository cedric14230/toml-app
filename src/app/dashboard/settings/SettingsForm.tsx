'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

type Profile = {
  name: string | null
  avatar_url: string | null
  bio: string | null
  birthday: string | null
  default_visibility: string | null
}

type Props = {
  userId: string
  initialProfile: Profile
}

const VISIBILITY_OPTIONS = [
  { value: 'public',  label: 'Publique',  description: 'Visible par tout le monde' },
  { value: 'friends', label: 'Amis',      description: 'Visible par vos amis uniquement' },
  { value: 'private', label: 'Privée',    description: 'Visible par vous uniquement' },
]

export default function SettingsForm({ userId, initialProfile }: Props) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createSupabaseBrowserClient()

  const [form, setForm] = useState({
    name:               initialProfile.name               ?? '',
    bio:                initialProfile.bio                ?? '',
    birthday:           initialProfile.birthday           ?? '',
    default_visibility: initialProfile.default_visibility ?? 'public',
  })
  const [avatarUrl, setAvatarUrl]     = useState<string | null>(initialProfile.avatar_url)
  const [avatarFile, setAvatarFile]   = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [saving, setSaving]           = useState(false)
  const [error, setError]             = useState<string | null>(null)
  const [success, setSuccess]         = useState(false)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    let finalAvatarUrl = avatarUrl

    // Upload avatar si un fichier a été sélectionné
    if (avatarFile) {
      const ext = avatarFile.name.split('.').pop() ?? 'jpg'
      const path = `${userId}/avatar.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, avatarFile, { upsert: true, contentType: avatarFile.type })

      if (uploadError) {
        setError(`Erreur upload avatar : ${uploadError.message}`)
        setSaving(false)
        return
      }

      finalAvatarUrl = supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({
        name:               form.name.trim() || null,
        avatar_url:         finalAvatarUrl,
        bio:                form.bio.trim() || null,
        birthday:           form.birthday || null,
        default_visibility: form.default_visibility,
      })
      .eq('id', userId)

    if (updateError) {
      setError(updateError.message)
      setSaving(false)
      return
    }

    setAvatarUrl(finalAvatarUrl)
    setAvatarFile(null)
    setSaving(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
    router.refresh()
  }

  const displayedAvatar = avatarPreview ?? avatarUrl
  const initial = (form.name || 'U').charAt(0).toUpperCase()

  return (
    <form onSubmit={handleSave} className="space-y-6">

      {/* Avatar */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Photo de profil
        </label>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center ring-1 ring-gray-200">
            {displayedAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={displayedAvatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-gray-400 select-none">{initial}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Choisir une photo
            </button>
            {(avatarPreview || avatarUrl) && (
              <button
                type="button"
                onClick={() => { setAvatarFile(null); setAvatarPreview(null); setAvatarUrl(null) }}
                className="text-xs text-red-500 hover:text-red-700 text-left transition-colors"
              >
                Supprimer la photo
              </button>
            )}
            <p className="text-xs text-gray-400">JPG, PNG ou WebP · Max 2 Mo</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Nom */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
          Nom complet
        </label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="Votre prénom et nom"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        />
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1.5">
          Bio
          <span className="ml-1.5 text-xs font-normal text-gray-400">optionnel</span>
        </label>
        <textarea
          id="bio"
          value={form.bio}
          onChange={e => setForm(f => ({ ...f, bio: e.target.value.slice(0, 160) }))}
          placeholder="Quelques mots sur vous…"
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
        />
        <p className="text-xs text-gray-400 mt-1 text-right">{form.bio.length}/160</p>
      </div>

      {/* Date d'anniversaire */}
      <div>
        <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 mb-1.5">
          Date d&apos;anniversaire
          <span className="ml-1.5 text-xs font-normal text-gray-400">optionnel</span>
        </label>
        <input
          id="birthday"
          type="date"
          value={form.birthday}
          onChange={e => setForm(f => ({ ...f, birthday: e.target.value }))}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        />
      </div>

      {/* Visibilité par défaut */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Visibilité par défaut des nouvelles listes
        </label>
        <div className="flex flex-col gap-2">
          {VISIBILITY_OPTIONS.map(opt => (
            <label
              key={opt.value}
              className={[
                'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                form.default_visibility === opt.value
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300',
              ].join(' ')}
            >
              <input
                type="radio"
                name="default_visibility"
                value={opt.value}
                checked={form.default_visibility === opt.value}
                onChange={() => setForm(f => ({ ...f, default_visibility: opt.value }))}
                className="accent-gray-900"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">{opt.label}</p>
                <p className="text-xs text-gray-500">{opt.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Feedback */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Modifications enregistrées.
        </p>
      )}

      {/* Bouton enregistrer */}
      <button
        type="submit"
        disabled={saving}
        className="w-full py-2.5 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {saving ? 'Enregistrement…' : 'Enregistrer'}
      </button>
    </form>
  )
}
