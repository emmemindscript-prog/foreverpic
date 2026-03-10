# TaskFlowAI - Product Requirements Document

## Visione
Piattaforma open-source per orchestrazione agenti AI con workflow automatizzati a 8 fasi. 
Trasforma l'idea di un utente in un MVP deployato in ore, non settimane.

---

## Obiettivi Prodotto

| Obiettivo | Metrica | Target M3 | Target M6 | Target M12 |
|-----------|---------|-----------|-----------|------------|
| Ridurre time-to-MVP | Ore da idea a deploy | 8h | 4h | 2h |
| Automazione workflow | % fasi automatizzate | 70% | 85% | 95% |
| Utenti attivi | Numero | 100 | 500 | 2.000 |
| MRR | Euro | €1.000 | €5.000 | €20.000 |
| GitHub Stars | Numero | 500 | 2.000 | 10.000 |

---

## Target User

**Primario:**
- Indie hackers
- Freelance sviluppatori
- Piccole agency (5-20 dipendenti)
- Startup pre-seed

**Pain Points:**
- Make/Zapier troppo costosi per scale
- Soluzioni self-hosted troppo complesse
- Vendor lock-in
- Time-to-market troppo lungo

---

## 8 Fasi Workflow

### FASE 1: Brain Dump & Business Init
**Agente:** Manager
**Input:** Idea utente (testo libero)
**Output:** 
- Modello di business completo (Markdown)
- File AGENTS.md con configurazione
- Task list prioritarizzata

**Tempo:** 30 minuti
**Auto:** 100%

---

### FASE 2: Market Hunting
**Agente:** Atlas
**Input:** Tema/nichia dal business model
**Output:**
- Report Reddit/HN analysis (links esatti)
- Identificazione problemi reali
- Trends emergenti
- Competitor analysis

**Tempo:** 45 minuti
**Auto:** 95%

---

### FASE 3: Product Spec & PRD
**Agente:** Product Manager
**Input:** Report Fase 2
**Output:**
- PRD completo (funzionalità)
- Architecture Decision Records
- API spec (OpenAPI)
- UI/UX wireframes (descrizioni)

**Tempo:** 60 minuti
**Auto:** 90%

---

### FASE 4: MVP Development
**Agente:** Senior Dev
**Input:** PRD Fase 3
**Output:**
- Codice sorgente completo
- Test suite (unit + integration)
- Database schema migration
- API endpoints implementate

**Tempo:** 3-4 ore
**Auto:** 85%

---

### FASE 5: Documentation
**Agente:** Tech Writer
**Input:** Codice Fase 4
**Output:**
- README.md professionale
- Manuale d'uso step-by-step
- API documentation
- Setup guide

**Tempo:** 45 minuti
**Auto:** 95%

---

### FASE 6: QA & Security
**Agente:** Sentinel
**Input:** Codice + Docs Fase 4-5
**Output:**
- Security audit report
- Code review
- Vulnerability fixes
- PR su GitHub (codice + docs + guida)

**Tempo:** 30 minuti
**Auto:** 90%

---

### FASE 7: Customer Acquisition
**Agente:** Scribe (Copywriter)
**Input:** Links Fase 2 (dove si parla del problema)
**Output:**
- 10 risposte personalizzate pronte per copy-paste
- Pitch per ProductHunt/Reddit/IndieHackers
- Landing page copy

**Tempo:** 30 minuti
**Auto:** 85%

---

### FASE 8: Organic Growth
**Agenti:** Clip + Postiz
**Input:** Prodotto + Nicchia
**Output:**
- Post social generatori (X, LinkedIn)
- Articoli blog AI-generated
- Newsletter content
- Schedule posting automatico

**Tempo:** Continuo (settimanale)
**Auto:** 90%

---

## Architecture Tecnica

### Stack (v1 - MVP)
- **Frontend:** Next.js 14 + TypeScript + Tailwind
- **Backend:** Node.js + tRPC / REST API
- **Database:** PostgreSQL (Supabase)
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage
- **AI:** Multi-model (KimiK2.5 primary, GLM4.7/MinimaxM2.5 fallback)
- **Queue:** BullMQ (Redis)
- **Monitoring:** OpenClaw native + external logs

### Core Modules
```
src/
├── core/
│   ├── orchestrator.ts      # Gestione 8 fasi
│   ├── agent-dispatcher.ts  # Smistamento task
│   ├── state-manager.ts     # Persistenza stato workflow
│   └── delivery.ts          # Notifiche/channels
├── api/
│   ├── workflow.ts          # CRUD workflow
│   ├── agents.ts            # Agent management
│   └── marketplace.ts       # Template marketplace
└── web/
    ├── dashboard/           # UI principale
    ├── workflow-builder/    # Builder visuale
    └── agent-monitor/       # Monitor agenti
```

---

## Pricing Model

### Tier Free (€0)
- Self-hosted, self-managed
- Tutte le fasi base
- 3 workflow attivi
- Community support

### Tier Pro (€29/mese)
- Hosting gestito
- Unlimited workflows
- Priority API
- Email support
- Analytics avanzate

### Tier Enterprise (Custom)
- On-premise deployment
- SLA garantito
- Custom agents
- Training sessions
- White-label

---

## Roadmap M3

| Settimana | Obiettivo | Output |
|-----------|-----------|--------|
| 1 | Core orchestrator + Fase 1 | Manager agent funzionante |
| 2 | Fasi 2-3 | Atlas + Product Manager |
| 3 | Fase 4 | Senior Dev integration |
| 4 | Fasi 5-6 | Tech Writer + Sentinel |
| 5 | Fasi 7-8 | Scribe + Clip/Postiz |
| 6 | Dashboard UI + polish | MVP completo |
| 7-8 | Launch + feedback | Primi 100 utenti |

---

## Risks & Mitigation

| Rischio | Probabilità | Mitigazione |
|---------|-------------|-------------|
| Costi API troppo alti | Alta | Fallback chain economica |
| Adozione lenta | Media | Template pronti + DX focus |
| Quality output incoerente | Media | Human-in-the-loop opzionale |
| Concorrenza Big Tech | Bassa | Nichia indie + open-source |

---

## Success Criteria

**M3:**
- [ ] MVP completo con 8 fasi
- [ ] 100 utenti attivi
- [ ] €1.000 MRR
- [ ] 500 GitHub Stars

**M6:**
- [ ] 500 utenti attivi
- [ ] €5.000 MRR
- [ ] 2.000 GitHub Stars
- [ ] 10 template marketplace

**M12:**
- [ ] 2.000 utenti attivi
- [ ] €20.000 MRR
- [ ] 10.000 GitHub Stars
- [ ] Enterprise pilots

---

*Document Version: 1.0*
*Last Updated: 2026-03-09*
*Owner: TaskFlowAI Project*