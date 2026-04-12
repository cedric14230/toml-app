import { redirect } from 'next/navigation'

// La page racine redirige vers /dashboard.
// Le middleware s'assure que l'utilisateur est connecté avant d'arriver ici.
export default function RootPage() {
  redirect('/dashboard')
}
