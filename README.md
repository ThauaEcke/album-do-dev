# Álbum do Dev

Álbum de figurinhas interativo no estilo Panini + Spotify Wrapped, com efeito realista de virar páginas. Cada figurinha é **gerada dinamicamente por APIs públicas** — foto de perfil, clima da cidade, hora local, bandeira, logos de tecnologias, QR Codes, capas de música e de livro são buscados em tempo real quando o álbum é aberto.

## Sobre o projeto

O álbum é composto por uma capa personalizada, oito páginas temáticas e uma contracapa com QR Codes de contato. A navegação é feita por arraste, pelas setas laterais ou pelas teclas direcionais, com efeito sonoro de papel sintetizado via Web Audio API. Cada figurinha é "colada" no álbum com animação de desbloqueio conforme os dados chegam das APIs.

## Estrutura do álbum

| Página | Conteúdo | APIs utilizadas |
|--------|----------|-----------------|
| Capa | Foto, nome, QR Code do LinkedIn, número do álbum | GitHub, QRServer, DiceBear |
| 1 · Perfil | Foto de perfil, localização, bandeira, clima, hora local | GitHub, IBGE, FlagCDN, Open-Meteo, WorldTimeAPI |
| 2 · Carreira | Etapas da trajetória profissional | Iconify |
| 3 · Tecnologias | Logos das linguagens e ferramentas | Devicon, Iconify |
| 4 · Projetos | Figurinhas dos principais projetos | Iconify |
| 5 · Certificados | QR Codes que abrem cada certificado | QRServer |
| 6 · Curiosidades | Café, SO, editor, música de estudo, livro | iTunes Search, Open Library |
| 7 · Estatísticas | Atributos estilo card de jogo, com barras animadas | — |
| 8 · Lendárias | Figurinhas raras com efeito holográfico 3D | Iconify |
| Contracapa | QR Codes do GitHub, LinkedIn e portfólio | QRServer |

## APIs públicas consumidas

| API | Uso |
|-----|-----|
| [GitHub API](https://api.github.com) | Foto de perfil, nome, repositórios e seguidores |
| [Open-Meteo](https://open-meteo.com) | Geocodificação da cidade e clima atual |
| [IBGE Localidades](https://servicodados.ibge.gov.br/api/docs/localidades) | Dados do município (mesorregião, código IBGE) |
| [IBGE Países](https://servicodados.ibge.gov.br/api/docs/paises) | Capital e área do Brasil |
| [FlagCDN](https://flagcdn.com) | Bandeira do Brasil |
| [WorldTimeAPI](https://worldtimeapi.org) | Hora local sincronizada (fallback: timeapi.io) |
| [Devicon](https://devicon.dev) | Logos das tecnologias |
| [Iconify](https://iconify.design) | Ícones das figurinhas |
| [QRServer](https://goqr.me/api/) | Geração dos QR Codes |
| [iTunes Search](https://performance-partners.apple.com/search-api) | Capa da música de estudo (via JSONP) |
| [Open Library](https://openlibrary.org/developers/api) | Capa do livro favorito |
| [DiceBear](https://www.dicebear.com) | Avatar de fallback caso o GitHub esteja indisponível |

Todas as APIs são gratuitas e não exigem chave. Cada figurinha tem tratamento de erro individual: se uma API estiver fora do ar, apenas aquela figurinha usa um fallback, sem quebrar o restante do álbum.

## Personalização

Todos os dados pessoais ficam em **`frontend/config.js`** (nome, usuário do GitHub, LinkedIn, cidade, carreira, tecnologias, projetos, certificados, curiosidades, estatísticas). Basta editar os campos marcados com `EDITE` para gerar o seu próprio álbum.

## Tecnologias utilizadas

**Frontend**
- HTML5, CSS3 e JavaScript (Vanilla)
- Page Flip (efeito de virar páginas)
- Web Audio API (som de papel sintetizado)
- Fetch API e JSONP para consumo das APIs

**Backend**
- Python 3.12 + FastAPI + Uvicorn (serve o álbum estático)

## Estrutura do projeto

```
.
├── backend/
│   └── main.py               (FastAPI — serve o frontend)
├── frontend/
│   ├── app.js                (integração com as APIs e lógica do álbum)
│   ├── config.js             (seus dados pessoais — edite aqui)
│   ├── index.html
│   └── style.css
├── README.md
└── requirements.txt
```

## Publicar no GitHub Pages

O álbum (pasta `frontend/`) é estático e pode ser publicado no GitHub Pages. O backend FastAPI **não** roda no Pages — apenas o álbum com as APIs públicas.

1. Crie um repositório no GitHub e envie o código (branch `main`).
2. Em **Settings → Pages → Build and deployment**, escolha a fonte **GitHub Actions**.
3. No primeiro push para `main`, o workflow `.github/workflows/deploy-pages.yml` publica a pasta `frontend/`.

URL esperada: `https://<seu-usuario>.github.io/<nome-do-repositorio>/`

## Como executar

### Opção 1 — Direto no navegador

Abra `frontend/index.html` no navegador. As figurinhas são carregadas de APIs públicas, sem necessidade de servidor.

### Opção 2 — Com o backend FastAPI

1. Crie e ative um ambiente virtual (recomendado):
   ```
   python -m venv .venv
   .venv\Scripts\activate
   ```

2. Instale as dependências:
   ```
   pip install -r requirements.txt
   ```

3. Inicie o servidor a partir da pasta `backend`:
   ```
   cd backend
   uvicorn main:app --reload
   ```

4. Acesse `http://localhost:8000`.

## Créditos

Feito por **Thauã Ecke**.

Projeto desenvolvido a partir da Imersão Arquitetura Web com IA, promovida pela Alura, em julho de 2026.
