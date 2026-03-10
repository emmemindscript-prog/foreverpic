# TaskFlowAI 🚀

## Orchestrazione Agenti AI - Sistema Business 8 Fasi

Piattaforma open-source per automatizzare workflow SaaS con agenti AI specializzati.

## Quick Start

```bash
git clone https://github.com/yourusername/taskflowai.git
cd taskflowai && docker-compose up
```

## Le 8 Fasi

| Fase | Agente | Funzione |
|------|--------|----------|
| 1 | Manager | Setup business e memoria |
| 2 | Atlas | Market hunting (Reddit/HN) |
| 3 | PM | Generazione PRD |
| 4 | Senior Dev | MVP + Stripe |
| 5 | Tech Writer | Docs automatiche |
| 6 | Sentinel | QA + Deploy |
| 7 | Scribe | Outreach vendite |
| 8 | Clip/Postiz | Marketing auto |

## Configurazione

```bash
# Configura provider AI
cp .env.example .env
# Aggiungi OPENAI_API_KEY o GEMINI_API_KEY

# Lancia orchestrator
./orchestrator.sh [1-8]
```

## Requisiti
- Docker 24+
- Node.js 22+
- API Key (OpenAI / Gemini / NVidia)

## License

**MIT License**

Copyright (c) 2026 TaskFlowAI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---
*TaskFlowAI - Automazione intelligente per workflow AI*