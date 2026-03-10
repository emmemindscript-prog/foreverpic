# MEMORY.md - Long-Term Memory

## 4 Mar 2026 — Business System 8 Fasi + Extra

**Modello:** Software Factory automatizzata per sviluppo SaaS/tool basati sui bisogni reali degli utenti.

---

### FASE 1: Brain Dump e Inizializzazione del Business (Il Manager)
- Configurazione mente aziendale
- File memoria MD per modello di business
- rules.md e logica di smistamento task ai sub-agenti
- **Focus:** Cercare gap di mercato → sviluppare SaaS/tool → monetizzare

---

### FASE 2: Market Hunting su Reddit e HackerNews (Il Dipartimento Ricerca)
- **Atlas:** Scansiona Reddit/HackerNews via API, trova problemi reali, salva link esatti in report
- **Trendy** (GLM 4.7, economico): Trend virali ogni 2 ore

---

### FASE 3: Specifica del Prodotto e PRD (Il Product Manager)
- Analisi report Atlas → selezione opportunity più profittevole
- **PRD completo:** funzionalità, architettura tecnica, requisiti utente

---

### FASE 4: Sviluppo dell'MVP (Il Dipartimento Sviluppo)
- **Sviluppatore Senior:** Usa Claude Code / OpenCode / alternative
- **Cron job:** 23:00 (background)
- **Integrazione:** Stripe per monetizzazione

---

### FASE 5: Documentazione e Manuale d'Uso (Il Tech Writer)
- README.md professionale
- Manuale d'Uso dettagliato (step-by-step installazione/utilizzo)

---

### FASE 6: QA, Sicurezza e Deploy su GitHub (Il Dipartimento di Controllo / DevOps)
- **Sentinel:** Revisione codice + manuale
- **Filtro sicurezza:** Secondo LLM
- **Output:** PR autonoma su GitHub (codice + manuale + documentazione)

---

### FASE 7: Acquisizione Clienti e Monetizzazione Diretta (Il Reparto Vendite)
- **Copywriter (Scribe):** Bozze risposte personalizzate dai link Fase 2
- **Output:** File pronto per copia-incolla → primi utenti paganti

---

### FASE 8: Traffico Organico e Crescita Continua (Il Reparto Marketing)
- **Clip:** Contenuti automatizzati (post, articoli, video)
- **Postiz:** Pubblicazione automatica API sui social
- **Goal:** Traffico organico 24/7

---

## EXTRA: Migliorie e Fonti Aggiuntive

### Fonti di Ricerca Estese
| Fonte | Descrizione |
|-------|-------------|
| **X (Twitter)** | Scansiona founder/tech/B2B (target dev, DevOps, founder) |
| **YouTuber/Podcaster** | Commenti sotto video tech, recensioni SaaS |
| **Community iper-nicchiate** | Forum specifici al progetto (trading, DevOps, clippers, etc.) |

### Suggerimento Avanzato — Qualità Ricerca
- Atlas analizza framework virali (MrBeast, Dan Koe)
- Crea **"viral X masterclass"** (manuale interno)
- Scribe lo usa per copy irresistibile

---

## 28 Feb 2026 — Il Bootstrapping di Emme
- **Chi sono:** Emme, il fantasmino esperto di codice di Egix
- **Il patto:** Egix = visione + istinto, Emme = logica + debug + velocità
- **Progetto MindScript:** Il nostro business - coding, trading forex, hunting di mercato, calcio statistico

---

## 2 Mar 2026 — Agent System & Model Optimization

### Model Optimization
- GPT-5.3 Codex configurato come primary
- Fallback chain: GLM4.7 → MinimaxM2.5 → GLM5
- Streaming ENABLED per feedback real-time

### System Lessons
- Streaming ON = user sees progress
- Timeout optimization prevents "blocked" perception
- Fallback chain = resilience against provider downtime
