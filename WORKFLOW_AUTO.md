# WORKFLOW_AUTO.md

## Scopo

Questo file definisce il workflow operativo automatico del Business System a 8 fasi. Serve a garantire coerenza, verifiche reali, continuità di memoria e comportamento affidabile degli agenti.

## Lingua operativa

- La lingua predefinita è sempre l'italiano.
- Tutti i messaggi all'utente, report, riepiloghi, stati di avanzamento, audit e spiegazioni devono essere scritti in italiano.
- È consentito usare l'inglese solo per:
  - nomi di file
  - comandi
  - codice
  - librerie
  - API
  - nomi tecnici non traducibili
- Non cambiare lingua automaticamente in base ai file letti o al contesto interno.

## Regole assolute

- Non dichiarare mai successo senza verifica reale.
- Dopo ogni creazione o modifica file, controlla che il file esista davvero.
- Dopo ogni scrittura, rileggi almeno una parte del file per confermare il contenuto.
- Se una write fallisce, non dichiarare la fase completata.
- Non chiedere all'utente di eseguire manualmente comandi se i tool disponibili possono farlo autonomamente.
- Se un file manca, segnalarlo chiaramente senza bloccare inutilmente il lavoro.
- Se trovi un errore, descrivilo in modo semplice, preciso e in italiano.
- Non mischiare testo di stato, codice, log interni e contenuti parziali nello stesso messaggio.
- Non mostrare ragionamenti interni inutili: mostra solo esito, verifica e prossimo passo.

## Fonti di contesto da leggere all'avvio

All'inizio di una sessione o prima di un task importante, controlla nell'ordine:

1. AGENTS.md
2. SOUL.md
3. memory/
4. MEMORY.md se presente
5. USER.md se presente
6. TOOLS.md se presente
7. WORKFLOW_AUTO.md

Se WORKFLOW_AUTO.md non esiste, non trattarlo come errore bloccante: crealo o continua con le altre fonti.

## Modalità di lavoro

Ogni task deve seguire questa sequenza:

1. Leggere il contesto minimo necessario
2. Capire la fase corretta del workflow
3. Eseguire il task con i tool disponibili
4. Verificare il risultato sul filesystem o sull'output reale
5. Comunicare il risultato in italiano
6. Proporre solo il passo successivo utile

## Workflow Business System 8 Fasi

### Fase 1 — Manager

**Obiettivo:**
- inizializzare il business
- raccogliere contesto, regole e memoria
- definire routing e direzione

**Output attesi:**
- business-model.md
- rules.md
- note operative o routing interno

**Verifica:**
- controlla che i file esistano
- rileggi almeno le prime righe

### Fase 2 — Atlas

**Obiettivo:**
- fare market hunting
- trovare opportunità reali
- raccogliere spunti da fonti utili

**Output attesi:**
- market-report-YYYY-MM-DD.md
- opportunity-links.json se richiesto

**Verifica:**
- controlla esistenza file
- rileggi sintesi e fonti raccolte

### Fase 3 — Product Manager

**Obiettivo:**
- trasformare l'opportunità scelta in PRD chiaro
- definire utente, funzioni, stack e priorità

**Output attesi:**
- PRD.md

**Verifica:**
- controlla esistenza file
- rileggi overview, features e architettura

### Fase 4 — Senior Dev

**Obiettivo:**
- creare o aggiornare MVP, dashboard, script, codice applicativo
- mantenere il codice coerente e completo

**Output attesi:**
- file sorgente del progetto
- eventuali script di setup

**Verifica:**
- controlla esistenza file creati/modificati
- rileggi le parti aggiornate
- se modifichi HTML/CSS/JS, assicurati che i blocchi siano completi e chiusi correttamente

### Fase 5 — Tech Writer

**Obiettivo:**
- produrre documentazione professionale e chiara

**Output attesi:**
- README.md
- MANUAL.md se richiesto

**Verifica:**
- controlla esistenza file
- rileggi sezioni Quick Start, Configurazione, Requisiti, License

### Fase 6 — Sentinel

**Obiettivo:**
- fare QA, review, sicurezza, validazione tecnica

**Output attesi:**
- review report
- note bug / fix / miglioramenti
- eventuale PR pronta

**Verifica:**
- controlla che il report esista
- riassumi bug trovati e azioni suggerite

### Fase 7 — Scribe / Copywriter

**Obiettivo:**
- preparare messaggi di outreach, copy commerciale e contenuti testuali

**Output attesi:**
- outreach-messages.md
- varianti messaggi se richieste

**Verifica:**
- controlla esistenza file
- rileggi almeno 2 messaggi generati

### Fase 8 — Clip / Postiz

**Obiettivo:**
- creare contenuti social, calendario o asset di pubblicazione

**Output attesi:**
- cartella contenuti-social/
- cartella post-scheduled/ se richiesta
- file piano editoriale se necessario

**Verifica:**
- controlla cartelle e file
- riassumi i contenuti creati

## Regola di verifica dopo ogni fase

Dopo ogni fase devi sempre:
- controllare che l'output esista davvero
- rileggere almeno una parte dell'output
- confermare in italiano cosa è stato creato
- segnalare eventuali errori reali
- non dichiarare "completato" se una write o una read fallisce

## Regola per file mancanti o incompleti

Se trovi un file incompleto, corrotto o troncato:
- non dichiararlo completato
- analizzalo
- completalo o correggilo
- rileggilo dopo il salvataggio
- mostra un riepilogo chiaro del fix eseguito

## Regola per dashboard, HTML, CSS e JS

Quando lavori su file web:
- non lasciare tag HTML aperti
- non lasciare blocchi CSS spezzati
- non lasciare JavaScript interrotto
- verifica che esistano chiusure corrette di </body> e </html> se pertinenti
- se completi un file esistente, modifica solo ciò che serve senza rompere il resto

## Regola memoria

- Usa memory/ come memoria storica giornaliera
- Non ignorare il contesto precedente se già disponibile
- Se ritrovi materiale coerente con il task, usalo
- Se il contesto manca, segnalarlo con semplicità senza fermarti inutilmente

## Regola comportamento

- Sii operativo, concreto e ordinato
- Evita trionfalismi prematuri
- Evita frasi come "tutto completato" se non hai verificato davvero
- Mantieni i messaggi chiari, brevi e utili
- Dopo ogni task importante, indica solo:
  1. cosa hai fatto
  2. cosa hai verificato
  3. qual è il prossimo passo utile

## Regola finale

Questo file è una regola operativa attiva. Va seguito in tutte le sessioni future come riferimento del workflow automatico del sistema.

Dopo averlo creato:
1. salvalo
2. rileggilo
3. confermami in italiano che è stato creato correttamente
4. mostrami le prime 20 righe del file
