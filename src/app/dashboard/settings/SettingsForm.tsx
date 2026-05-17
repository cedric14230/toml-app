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
  phone_number: string | null
  phone_verified: boolean
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

  // WhatsApp
  const [phone]                           = useState(initialProfile.phone_number ?? '')
  const [phoneVerified]                   = useState(initialProfile.phone_verified)
  const [editMode, setEditMode]           = useState(false)
  const [phoneSending, setPhoneSending]   = useState(false)
  const [phoneMsg, setPhoneMsg]           = useState<{ type: 'ok' | 'error'; text: string } | null>(null)

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

  /**
   * Génère un token de vérification, ouvre WhatsApp avec un message pré-rempli.
   * L'utilisateur envoie le message → le webhook lie son numéro au compte.
   */
  async function handleVerify() {
    setPhoneSending(true)
    setPhoneMsg(null)
    try {
      const res = await fetch('/api/whatsapp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (!res.ok) {
        setPhoneMsg({ type: 'error', text: data.error ?? 'Erreur inconnue' })
      } else {
        window.open(data.waUrl, '_blank')
        setPhoneMsg({
          type: 'ok',
          text: 'WhatsApp va s\'ouvrir avec un message pré-rempli. Envoyez-le pour connecter votre compte. La connexion sera effective dans quelques secondes.',
        })
      }
    } catch {
      setPhoneMsg({ type: 'error', text: 'Impossible de contacter le serveur.' })
    } finally {
      setPhoneSending(false)
    }
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

      {/* WhatsApp */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          WhatsApp
          <span className="ml-1.5 text-xs font-normal text-gray-400">optionnel</span>
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Connectez votre WhatsApp pour ajouter des articles en envoyant un lien.
        </p>

        {phoneVerified && !editMode ? (
          /* ── Numéro vérifié — mode lecture ── */
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 rounded-lg border border-emerald-200 bg-emerald-50">
              <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-emerald-800 font-medium flex-1">{phone}</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Connecté</span>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => { setEditMode(true); setPhoneMsg(null) }}
                className="text-sm text-gray-500 underline hover:text-gray-700 transition-colors"
              >
                Modifier
              </button>
            </div>
          </div>
        ) : (
          /* ── Pas de numéro, non vérifié, ou mode édition ── */
          <div className="flex flex-col gap-2">
            {editMode && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => { setEditMode(false); setPhoneMsg(null) }}
                  className="text-sm text-gray-500 underline hover:text-gray-700 transition-colors"
                >
                  Annuler
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={handleVerify}
              disabled={phoneSending}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-white bg-[#25D366] rounded-lg hover:bg-[#1ebe5c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {phoneSending ? 'Ouverture…' : 'Connecter WhatsApp'}
            </button>
            {phoneMsg && (
              <p className={['text-xs px-3 py-2 rounded-lg border', phoneMsg.type === 'ok' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-red-600 bg-red-50 border-red-200'].join(' ')}>
                {phoneMsg.text}
              </p>
            )}
          </div>
        )}
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
