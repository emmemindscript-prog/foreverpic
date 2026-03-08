import CreateEventForm from '@/components/features/create-event-form'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewEventPage() {
  return (
    <div className="min-h-screen gradient-radial">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Torna alla home
          </Link>

          <h1 className="text-4xl font-bold mb-8 text-center">
            Crea un Nuovo Evento
          </h1>

          <CreateEventForm />

          <div className="mt-8 text-center text-gray-600">
            <p>
              Cosa succede dopo?{' '}
              <Link href="/how-it-works" className="text-purple-600 hover:underline">
                Scopri come funziona
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
