import Header from '@/components/Header'

export default function Home() {
  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900">Mes wishlists</h1>
        <p className="mt-2 text-gray-500">Tes listes apparaîtront ici.</p>
      </main>
    </>
  )
}
