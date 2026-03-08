# ForeverPic 📸

Wedding/Event Photo Sharing Platform - Condividi foto e video con un semplice QR code.

## 🚀 Caratteristiche

### MVP (Phase 1)
- ✅ QR Code upload senza app
- ✅ Galleria privata
- ✅ Upload multi-file
- ✅ Download zip
- ✅ RSVP integrata

### Advantange (Phase 2)
- 🌟 MagicFind - Trova foto via selfie
- 🌟 Live Display - Muro foto in tempo reale
- 🌟 Multi-gallery - Fino a 30 gallerie/evento
- 🌟 AI Moderation - Flag contenuti

### Unique (Phase 3)
- 💡 AI Tagging Automatico
- 💡 Live Emoji Reactions
- 💡 Auto-Generated Stories (TikTok/Reels)
- 💡 Instant Printable Photobooth

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React 18, Tailwind CSS, TypeScript
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL (Supabase)
- **Storage:** Supabase Storage
- **Auth:** Supabase Auth
- **AI:** face-api.js, TensorFlow.js

## 📦 Installazione

```bash
# Clone repository
git clone https://github.com/your-username/foreverpic.git
cd foreverpic

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your Supabase credentials

# Setup database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

## 🎯 Getting Started

1. **Crea un progetto Supabase:**
   - Vai su https://supabase.com
   - Crea un progetto
   - Copia URL e API keys

2. **Configura ambiente:**
   ```bash
   # .env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role
   ```

3. **Push schema database:**
   ```bash
   npx prisma db push
   ```

4. **Start development:**
   ```bash
   npm run dev
   ```

## 📚 Struttura Progetto

```
foreverpic/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/                   # Next.js 14 app directory
│   │   ├── api/               # API routes
│   │   ├── events/            # Event pages
│   │   ├── scan/              # QR scanning
│   │   └── upload/            # Upload interface
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   └── features/          # Feature-specific components
│   └── lib/
│       ├── supabase/          # Supabase client
│       ├── ai/                # AI/ML utilities
│       └── storage/           # Storage utilities
└── public/                    # Static assets
```

## 🔧 Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:push          # Push schema to database
npm run db:studio        # Open Supabase Studio
npm run db:seed          # Seed database (TODO)

# Type checking
npm run type-check       # TypeScript type check
npm run lint             # ESLint
```

## 📄 Roadmap

### Phase 1: MVP (Weeks 1-2)
- [x] Project setup
- [ ] Auth system
- [ ] Event creation & QR generation
- [ ] Photo upload/download
- [ ] Gallery view

### Phase 2: Core Features (Weeks 3-4)
- [ ] RSVP integration
- [ ] Live display
- [ ] Multi-gallery

### Phase 3: AI Features (Weeks 5-6)
- [ ] Face detection & embeddings
- [ ] MagicFind implementation
- [ ] AI tagging

### Phase 4: Unique Features (Weeks 7-8)
- [ ] Live emoji reactions
- [ ] Auto-generated stories
- [ ] Printable photobooth

## 💰 Pricing

- **Starter:** €49/evento (Basic features)
- **Pro:** €69/evento (+ AI features, live display)
- **Enterprise:** €89/evento (+ Unique features)

## 📝 License

Proprietary. All rights reserved.

---

Built with ❤️ by MindScript
