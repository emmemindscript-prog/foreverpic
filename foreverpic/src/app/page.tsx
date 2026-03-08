import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen gradient-radial">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            ForeverPic
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Condividi foto e video del tuo matrimonio o evento con un semplice QR code.<br />
            Nessuna app richiesta, semplicemente magico.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="glass rounded-2xl p-6">
              <Link href="/events/new" className="block">
                <div className="text-5xl mb-4">📸</div>
                <h2 className="text-2xl font-bold mb-2">Crea Evento</h2>
                <p className="text-gray-600">Organizza il tuo matrimonio o evento</p>
              </Link>
            </div>

            <div className="glass rounded-2xl p-6">
              <Link href="/scan" className="block">
                <div className="text-5xl mb-4">📱</div>
                <h2 className="text-2xl font-bold mb-2">Scannerizza QR</h2>
                <p className="text-gray-600">Carica foto come ospite</p>
              </Link>
            </div>
          </div>

          <div className="glass rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">✨ Funzionalità</h3>
            <div className="grid md:grid-cols-3 gap-4 text-left">
              <div className="p-4 rounded-lg bg-white/50">
                <div className="text-3xl mb-2">🚫</div>
                <h4 className="font-bold mb-1">No App Richiesta</h4>
                <p className="text-sm text-gray-600">Funziona nel browser</p>
              </div>
              <div className="p-4 rounded-lg bg-white/50">
                <div className="text-3xl mb-2">⚡</div>
                <h4 className="font-bold mb-1">Upload Veloce</h4>
                <p className="text-sm text-gray-600">Foto e video istantanei</p>
              </div>
              <div className="p-4 rounded-lg bg-white/50">
                <div className="text-3xl mb-2">🎭</div>
                <h4 className="font-bold mb-1">Galleria Privata</h4>
                <p className="text-sm text-gray-600">Solo per gli invitati</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
