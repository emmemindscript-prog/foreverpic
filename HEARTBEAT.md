# HEARTBEAT.md

## Scopo

Questo file definisce il comportamento del heartbeat automatico del sistema. Il heartbeat serve a fare controlli periodici utili, non a generare rumore. La lingua operativa è sempre l'italiano.

## Frequenza

- Heartbeat ogni 60 minuti

## Regole generali

- Rispondi sempre in italiano
- Sii sintetico, chiaro e utile
- Non inviare messaggi inutili o ripetitivi
- Non dichiarare problemi se non hai verificato davvero
- Se non trovi nulla di rilevante, invia un riepilogo molto breve
- Se trovi un problema, indica chiaramente:
  1. cosa hai controllato
  2. cosa non va
  3. quale azione consigli o hai già eseguito

## Controlli obbligatori a ogni heartbeat

### 1. Memoria

Controlla:
- cartella memory/
- eventuali file giornalieri recenti
- presenza di note utili per task aperti

Obiettivo:
- capire se esistono contesti recenti da non perdere
- evitare amnesie operative

### 2. Workspace

Controlla:
- file nuovi o modificati recentemente
- file incompleti, corrotti o sospetti
- file temporanei lasciati a metà
- documenti importanti come:
  - AGENTS.md
  - SOUL.md
  - WORKFLOW_AUTO.md
  - README.md
  - PRD.md
  - file HTML/JS/CSS in lavorazione
  - file di configurazione rilevanti

Obiettivo:
- intercettare problemi reali
- mantenere ordinata la workspace

### 3. Task aperti

Controlla se esistono:
- lavori incompleti
- file dichiarati completati ma non verificati
- output mancanti rispetto all'ultima attività
- prossimi passi evidenti già emersi dal contesto

Obiettivo:
- aiutare la continuità del lavoro
- proporre il prossimo passo utile

### 4. Cron job

Controlla:
- errori recenti nei cron
- problemi di delivery
- job falliti o non consegnati
- eventuali warning ripetuti

Obiettivo:
- capire se i report programmati stanno funzionando davvero
- segnalare subito errori di consegna o configurazione

### 5. Stato generale

Controlla in modo sintetico:
- stato della workspace
- stato degli output recenti
- presenza di anomalie evidenti
- eventuali segnali di incoerenza tra messaggi dell'agente e file reali

Obiettivo:
- mantenere il sistema affidabile
- evitare falsi "completato con successo"

## Regole di comportamento

- Non fermarti su dettagli inutili
- Non elencare file a caso se non sono rilevanti
- Non rifare audit completi se non servono
- Non cambiare lingua
- Non chiedere all'utente di eseguire comandi manuali se i tool disponibili possono farlo
- Non dire "tutto perfetto" se non hai verificato davvero

## Output heartbeat: formato richiesto

Quando invii un heartbeat, usa questo schema sintetico:

### Se tutto è ok

HEARTBEAT OK
- memoria: ok
- workspace: ok
- cron: ok
- task aperti: nessun blocco critico
- prossimo passo utile: [scrivi solo se esiste]

### Se trovi problemi

HEARTBEAT ATTENZIONE
- area: [memory / workspace / cron / task / altro]
- problema: [descrizione chiara]
- impatto: [basso / medio / alto]
- azione consigliata: [breve]
- prossimo passo utile: [breve]

## Regola anti-rumore

Se non ci sono problemi reali:
- non inviare report lunghi
- non inviare inventari completi
- non ripetere sempre le stesse informazioni

## Regola anti-false conferme

Se un file è stato dichiarato creato o modificato:
- verifica che esista davvero
- rileggine almeno una parte
- solo dopo consideralo valido

## Regola per file web

Se trovi file HTML/CSS/JS incompleti:
- controlla se mancano chiusure HTML
- controlla se il CSS è spezzato
- controlla se il JavaScript è interrotto
- segnala il problema in modo chiaro

## Regola finale

Il heartbeat deve essere utile, leggero e affidabile. Deve aiutare Egix a capire subito se c'è qualcosa di importante da vedere, correggere o completare.
