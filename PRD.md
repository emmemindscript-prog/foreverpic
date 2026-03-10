# Product Requirements Document (PRD)
## EventPhoto AI - Never Miss a Moment

---

## Overview

**EventPhoto AI** è una piattaforma SaaS che rivoluziona la condivisione di foto durante eventi sociali. Risolve il problema fondamentale per cui l'80% delle foto scattate dagli ospiti durante matrimoni, conferenze e party aziendali vengono perse a causa di soluzioni disorganizzate come WhatsApp o strumenti troppo costosi e complessi.

**Mission:** Rendere la condivisione delle foto dell'evento istantanea, senza attriti e intelligente attraverso l'AI, garantendo che nessun momento prezioso vada perso.

**Value Proposition Chiave:**
- Setup in 30 secondi, zero app richieste
- AI-powered photo discovery via selfie/facial recognition
- Pricing pro-sumer (€50-100/evento) vs €200-500 dei competitor professionali
- Real-time engagement durante l'evento

**TAM (Total Addressable Market):** €2.8B (event tech 2026)

---

## Market Opportunity

### Pain Points Identificati

| Pain Point | Severità | Soluzione Attuale | Perché Non Funziona |
|------------|----------|-------------------|---------------------|
| Foto perse in chat WhatsApp | Alta | Google Photos shared | Troppo lento, richiede account |
| Fotografi tradizionali costosi | Alta | DIY phone photos | Qualità inconsistente |
| Ospiti riluttanti a installare app | Altissima | App native esistenti | Friction, storage issues |
| Moderazione contenuti manuale | Media | Nessuna | Foto inappropriate circolano |
| Ritardo nella condivisione | Alta | Post-evento via email | Engagement perso |
| Ricerca foto impossibile | Alta | Album cronologici | 500+ foto per evento |

### Market Gaps

**Gap 1: Price-Performance Sweet Spot**
- Problema: Soluzioni professionali €200-500/evento, consumer apps gratis ma limitate
- Opportunity: Positioning "pro-sumer" - qualità pro, prezzo accessibile

**Gap 2: Zero-Friction Experience**
- Problema: Tutte le soluzioni richiedono: app install → signup → tutorial → upload
- Opportunity: Web-based instant, 3-step flow: Scan → Upload → Done

**Gap 3: AI-Native Features**
- Problema: Face recognition esiste ma costa €1000+ per evento enterprise
- Opportunity: AI features inclusi nel prezzo base

**Gap 4: Photographer-as-Reseller**
- Problema: Fotografi vedono queste piattaforme come competitor
- Opportunity: Revenue sharing con fotografi professionisti

**Gap 5: Real-time Integration**
- Problema: Soluzioni esistenti sono batch-based (post-evento)
- Opportunity: Live streaming, reazioni emoji, instant moderation

---

## User Persona

### Primary Persona: La Wedding Planner Indipendente

**Nome:** Giulia, 34 anni
**Ruolo:** Wedding planner freelance, organizza 15-25 matrimoni/anno
**Location:** Milano, Italia

**Pain Points:**
- Gli sposi si lamentano di perdere le foto degli ospiti
- Gestire album WhatsApp è caotico e disordinato
- Soluzioni esistenti richiedono troppo tempo di setup o sono troppo costose
- Gli ospiti rifiutano di installare app dedicate

**Goals:**
- Offrire un'esperienza fotografica senza attriti agli sposi
- Aumentare il valore percepito del suo servizio
- Ridurre il tempo speso nella gestione delle foto

**Quote:** *"Voglio che gli sposi ricevano TUTTE le foto del loro giorno speciale, senza che io debba fare da tecnico informatico."*

### Secondary Persona: Il Fotografo Professionista

**Nome:** Marco, 42 anni
**Ruolo:** Fotografo wedding con 10+ anni di esperienza
**Location:** Roma, Italia

**Pain Points:**
- Perde vendite perché gli ospiti scattano foto con i telefoni
- Vuole distinguersi offrendo valore aggiunto
- Cerca revenue stream aggiuntivi oltre allo shooting

**Goals:**
- Integrare la condivisione foto nel proprio pacchetto servizi
- Monetizzare le foto degli ospiti
- Costruire relazioni a lungo termine con i clienti

### Tertiary Persona: L'Organizzatore di Eventi Corporate

**Nome:** Alessandro, 38 anni
**Ruolo:** Event manager in azienda tech
**Location:** Italia

**Pain Points:**
- Conferenze con centinaia di partecipanti, impossibile raccogliere tutte le foto
- Vuole engagement in tempo reale durante l'evento
- Ha bisogno di moderazione contenuti automatica

**Goals:**
- Creare esperienze coinvolgenti durante gli eventi
- Generare contenuti social-ready automaticamente
- Misurare l'engagement dei partecipanti

---

## Competitive Analysis

### Direct Competitors

#### 1. WedShoots (AppyCouple)
- **Prezzo:** €79/evento
- **Punti di Forza:** Brand recognition, wedding-focused
- **Punti deboli:** Richiede app, UI datata, no AI
- **Minaccia:** Media - audience captive, prodotto stagnante

#### 2. The Guest (Formerly Veri)
- **Prezzo:** €49/evento
- **Punti di Forza:** Buona UX, instant gallery
- **Punti deboli:** Limitato a matrimoni, no live features
- **Minaccia:** Media - stesso target, features simili

#### 3. Eversnap
- **Prezzo:** €39-99/evento
- **Punti di Forza:** Multi-event platform
- **Punti deboli:** Setup complesso, no AI tagging
- **Minaccia:** Bassa - prodotto non innovativo

#### 4. Kwik (PicTime)
- **Prezzo:** €0 (freemium), €59/evento pro
- **Punti di Forza:** Marketplace integrato
- **Punti deboli:** Focus su vendita foto, non sharing
- **Minaccia:** Bassa - different use case

### Indirect Competitors

#### 1. Google Photos Shared Albums
- **Prezzo:** Gratis
- **Vantaggio:** Familiarità, storage gratuito
- **Limite:** No event-specific features, setup confusion
- **Strategia:** Differenziarsi con event-centric UX

#### 2. Dropbox / WeTransfer
- **Prezzo:** €9.99/mese
- **Vantaggio:** Familiarità, reliable
- **Limite:** No curation, gallery experience poor
- **Strategia:** Focus su experience, non storage

#### 3. WhatsApp Groups
- **Prezzo:** Gratis
- **Vantaggio:** Universal adoption
- **Limite:** Disorganizzato, qualità compressa, privacy issues
- **Strategia:** "Better than WhatsApp" messaging

### Emerging Threats

#### 1. Instagram Collabs
- **Rischio:** Alto se Instagram lancia feature native
- **Mitigazione:** Focus su private events, non social

#### 2. Apple Shared Albums
- **Rischio:** Medio, limitato a ecosistema Apple
- **Mitigazione:** Cross-platform, Android incluso

---

## Core Features

### MVP (Fase 1)

#### 1. QR-to-Gallery Instant Sharing
- **Descrizione:** Sistema che genera un QR code unico per evento. Gli ospiti scansionano → caricano immediatamente
- **Tech:** Web app responsive, nessuna installazione
- **Edge:** Setup in 30 secondi, zero learning curve
- **Pricing:** Freemium (fino a 100 foto gratis, €49/evento premium)

#### 2. AI Photo Discovery (MagicFind)
- **Descrizione:** Gli ospiti fanno un selfie, l'AI trova tutte le foto che li ritraggono
- **Tech:** Facial recognition on-device + cloud processing
- **USP:** Trova le tue foto in 2 secondi
- **Upsell:** €20/evento per feature AI avanzate

#### 3. Real-time Photo Wall
- **Descrizione:** Display live delle foto durante l'evento su TV/tablet
- **Tech:** Web streaming, moderazione automatica
- **Use case:** Intrattenimento durante reception/cena
- **Pricing:** €69/evento incluso hosting live

### Fase 2

#### 4. Auto-Generated Video Stories
- **Descrizione:** AI crea automaticamente Reels/TikTok dalle migliori foto
- **Tech:** Computer vision + video generation AI
- **Target:** Gen Z couples, social-savvy planners
- **Pricing:** €29/generazione + €5/export HD
- **Viral potential:** Ogni video è marketing organico

#### 5. Photographer-as-Reseller Program
- **Descrizione:** White-label galleries per fotografi professionisti
- **Tech:** Custom branding, revenue sharing dashboard
- **Model:** 20% revenue sharing con fotografi partner
- **Stickiness:** Fotografi diventano canale di vendita

#### 6. Content Moderation AI
- **Descrizione:** Rilevamento automatico di contenuti inappropriati
- **Tech:** ML models per NSFW detection
- **Benefit:** Zero intervento manuale necessario

### Fase 3

#### 7. Multi-Event Templates
- **Descrizione:** Template specifici per matrimoni, conferenze, party aziendali
- **Tech:** Configurazione drag-and-drop
- **Expansion:** Verticali corporate e private events

#### 8. API & Embedded Integration
- **Descrizione:** API access per venue, catering, wedding platforms
- **Tech:** REST API, webhooks, SDK
- **Model:** B2B2C partnerships

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                       CLIENT LAYER                          │
├─────────────┬─────────────┬─────────────┬─────────────────┤
│  Web App    │  QR Scanner │  Live Wall  │ Photographer   │
│  (Guests)   │  (Mobile)   │  Display    │ Dashboard      │
└──────┬──────┴──────┬──────┴──────┬──────┴────────┬────────┘
       │             │             │               │
       └─────────────┴──────┬──────┴───────────────┘
                            │
┌───────────────────────────▼──────────────────────────────┐
│                    API GATEWAY                           │
│              (Rate Limiting, Auth)                       │
└───────────────────────────┬──────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼──────┐  ┌──────────▼────────┐  ┌───────▼───────┐
│  Event       │  │  Photo            │  │  AI           │
│  Service     │  │  Service          │  │  Service      │
│              │  │                   │  │               │
│ - Create     │  │ - Upload          │  │ - Face Rec    │
│ - Manage     │  │ - Storage         │  │ - Moderation  │
│ - Analytics  │  │ - CDN             │  │ - Video Gen   │
└───────┬──────┘  └──────────┬────────┘  └───────┬───────┘
        │                    │                   │
        └────────────────────┼───────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────┐
│                    DATA LAYER                              │
├──────────────┬──────────────┬──────────────┬──────────────┤
│ PostgreSQL   │ Redis Cache  │ Object       │ Search       │
│ (Events,     │ (Sessions,   │ Storage      │ (Photo       │
│ Users)       │ Hot Data)    │ (S3/MinIO)   │ Discovery)   │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

### Tech Stack

**Backend:**
- Language: Python 3.11+ / Node.js 18+
- Framework: FastAPI / Express.js
- Database: PostgreSQL 15+
- Cache: Redis 7+
- Message Queue: RabbitMQ / Redis Streams
- Object Storage: AWS S3 / MinIO (self-hosted)

**AI/ML:**
- Face Recognition: AWS Rekognition / DeepFace
- Image Processing: Pillow, OpenCV
- Video Generation: FFmpeg + AI models
- Content Moderation: AWS Comprehend / custom ML

**Frontend:**
- Web App: React 18+ / Next.js 14
- Mobile: PWA (Progressive Web App)
- Admin Dashboard: React + Tailwind CSS
- Live Wall: React + WebSocket

**Infrastructure:**
- Cloud: AWS / GCP / Azure
- Container: Docker + Kubernetes
- CI/CD: GitHub Actions
- Monitoring: Prometheus + Grafana + Sentry

**Security:**
- OAuth 2.0 + JWT
- End-to-end encryption per event
- GDPR compliant
- Automatic content scanning

---

## Success Metrics

### North Star Metric
**Time to First Photo (TTFP) < 30 secondi**
- Misurazione: tempo medio tra apertura QR e primo upload
- Target: 95% degli utenti sotto i 30 secondi

### Key Performance Indicators (KPIs)

#### Product Metrics
| Metric | Target Q1 | Target Q2 | Target Annual |
|--------|-----------|-----------|---------------|
| Eventi completati | 50 | 200 | 1,000+ |
| Photo upload rate | 85% | 90% | 95% |
| User satisfaction (NPS) | +40 | +50 | +60 |
| AI feature adoption | 30% | 50% | 70% |
| Photographers onboarded | 10 | 50 | 200+ |

#### Business Metrics
| Metric | Target Q1 | Target Q2 | Target Annual |
|--------|-----------|-----------|---------------|
| MRR (Monthly Recurring Revenue) | €2,500 | €10,000 | €50,000+ |
| ARPU (Average Revenue Per User) | €50 | €55 | €60 |
| Customer Acquisition Cost | €30 | €25 | €20 |
| Churn Rate | <10% | <8% | <5% |
| Gross Margin | 60% | 70% | 75%+ |

#### Technical Metrics
- **Uptime:** 99.9% SLA
- **Photo processing time:** <2 secondi per immagine
- **AI recognition accuracy:** >95%
- **API response time:** <200ms p95
- **Support response time:** <4 ore durante business hours

---

## Timeline

### Fase 1: MVP & Niche Domination (Mesi 1-6)

**Mese 1-2: Foundation**
- [ ] Setup architettura cloud
- [ ] Core QR-to-Gallery system
- [ ] Basic photo upload & storage
- [ ] Landing page + pricing
- [ ] Payment integration (Stripe)

**Mese 3-4: AI Features**
- [ ] MagicFind (face recognition)
- [ ] Content moderation AI
- [ ] Real-time photo wall MVP
- [ ] Mobile PWA optimization

**Mese 5-6: Market Entry**
- [ ] Beta launch con 10 wedding planners
- [ ] Raccolta feedback & iteration
- [ ] Case studies & testimonials
- [ ] **Milestone: 50 eventi completati**

**Deliverables Fase 1:**
- MVP completo con QR sharing, AI discovery, live wall
- 50 eventi, €2,500 MRR
- 10+ case studies

---

### Fase 2: Photographer Network (Mesi 7-12)

**Mese 7-8: Scale Product**
- [ ] White-label offering per fotografi
- [ ] Photographer dashboard
- [ ] Revenue sharing system
- [ ] Auto-generated video stories

**Mese 9-10: Growth**
- [ ] Onboarding 50 fotografi partner
- [ ] Referral program
- [ ] Advanced analytics
- [ ] Multi-event support

**Mese 11-12: Optimization**
- [ ] Performance improvements
- [ ] Mobile app native (iOS/Android)
- [ ] **Milestone: 200 eventi/mese, €10,000 MRR**

**Deliverables Fase 2:**
- Platform fotografi con white-label
- 50+ fotografi partner
- €10,000 MRR

---

### Fase 3: Vertical Expansion (Mesi 13-18)

**Mese 13-15: Corporate Events**
- [ ] Template conferenze
- [ ] API access
- [ ] Enterprise security features
- [ ] SSO integration

**Mese 16-18: Scale**
- [ ] Multi-language support (EN, ES, DE)
- [ ] Marketplace integrations
- [ ] Advanced AI features
- [ ] **Milestone: 500 eventi/mese, €25,000 MRR**

**Deliverables Fase 3:**
- Supporto corporate events
- Multi-tenant architecture
- €25,000 MRR

---

### Fase 4: Platform Play (Mesi 19-24)

**Mese 19-21: Ecosystem**
- [ ] Venue integration
- [ ] Catering partnerships
- [ ] Wedding marketplace launch
- [ ] Plugin system

**Mese 22-24: Global**
- [ ] International expansion
- [ ] Advanced AI features
- [ ] AR/VR photo experiences
- [ ] **Milestone: 2,000 eventi/mese, €50,000+ MRR**

**Deliverables Fase 4:**
- Full platform ecosystem
- Marketplace operations
- €50,000+ MRR
- Profitability

---

## Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Big Tech entry (Instagram, Apple) | High | Medium | Focus on wedding niche, photographer relationships |
| Seasonality (wedding season) | Medium | High | Multi-vertical expansion (corporate, private parties) |
| AI accuracy issues | High | Medium | Human review option, continuous model training |
| Storage costs scaling | Medium | Medium | Smart compression, tiered storage, optimization |
| Photographer resistance | Medium | High | Revenue sharing model, positioning as enabler |
| Quality control | Medium | High | AI moderation + human review option |
| Content appropriateness | Medium | Medium | Automatic AI content scanning |

### Market Entry Strategy

**Phase 1: Niche Domination (Mesi 1-6)**
- Target: Wedding planners indie italiani
- Tattica: Partnership dirette, revenue sharing 20%
- Goal: 50 eventi, case studies, testimonials

**Phase 2: Photographer Network (Mesi 7-12)**
- Target: Fotografi wedding professionali
- Tattica: White-label offering, branded galleries
- Goal: 200 eventi, 50 fotografi partner

**Phase 3: Event Vertical Expansion (Mesi 13-18)**
- Target: Corporate events, conferenze, party privati
- Tattica: Template specifici per use case
- Goal: 500 eventi/mese, 3 verticali

**Phase 4: Platform Play (Mesi 19-24)**
- Target: Venue, catering, wedding venues
- Tattica: API access, embedded integration
- Goal: 2000 eventi/mese, marketplace launch

### Key Success Factors

1. Time-to-first-photo < 30 seconds
2. Zero app installation required
3. AI features that wow users
4. Pricing 50% below competitors
5. Photographer partnership program

---

## Conclusione

EventPhoto AI ha l'opportunità di catturare un mercato significativo (€2.8B TAM) risolvendo un problema reale e universalmente riconosciuto nella condivisione di foto durante eventi. Con un approccio AI-first, zero-friction, e un pricing pro-sumer, possiamo scalare rapidamente dalla nicchia wedding al mercato enterprise.

**Prossimi step immediati:**
1. Finalizzare architettura tecnica
2. Iniziare sviluppo MVP (sprint 2 settimane)
3. Reclutare 3 wedding planner per beta testing
4. Setup infrastruttura cloud

---

*Documento creato: 7 Marzo 2026*
*Ultimo aggiornamento: 7 Marzo 2026*
*Versione: 1.0*
