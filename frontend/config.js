// ===================================================
// CONFIGURAÇÃO DO ÁLBUM — EDITE OS CAMPOS MARCADOS
// Tudo que o álbum mostra sobre você vem deste arquivo.
// As figurinhas em si (fotos, bandeira, clima, hora,
// QR Codes, capas) são buscadas em APIs públicas.
// ===================================================

const DADOS = {

    // ---------- IDENTIDADE ----------
    nome: "Thauã Ecke",                 // EDITE: seu nome
    titulo: "Desenvolvedor Full Stack",     // EDITE: seu título profissional
    numeroAlbum: "#001",

    // ---------- LINKS (usados nos QR Codes e na API do GitHub) ----------
    githubUser: "thauaecke",                                        // EDITE: seu usuário do GitHub
    linkedinUrl: "https://www.linkedin.com/in/thau%C3%A3-ecke-27397326b/",     // EDITE: seu LinkedIn
    portfolioUrl: "https://github.com/thauaecke",                   // EDITE: seu portfólio (ou deixe o GitHub)

    // ---------- LOCALIZAÇÃO (usada pelo IBGE e Open-Meteo) ----------
    cidade: "Independência",    // EDITE: sua cidade
    uf: "RS",                   // EDITE: sigla do seu estado
    fusoHorario: "America/Sao_Paulo",

    // ---------- PÁGINA 2: CARREIRA ----------
    carreira: [
        { nome: "Aprendiz 10", detalhe: "Cooperconcórdia", icone: "mdi:handshake" },
        { nome: "Unimed", detalhe: "Alto Uruguai", icone: "mdi:hospital-building" },
        { nome: "Técnico em Informática", detalhe: "Formação técnica", icone: "mdi:school" },
        { nome: "Desenvolvedor", detalhe: "Carreira atual", icone: "mdi:code-braces" },
    ],

    // ---------- PÁGINA 3: TECNOLOGIAS (logos via Devicon/Iconify) ----------
    tecnologias: [
        { nome: "JavaScript", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
        { nome: "Node.js", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
        { nome: "PostgreSQL", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
        { nome: "HTML", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
        { nome: "CSS", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
        { nome: "Git", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
        { nome: "Express", url: "https://api.iconify.design/simple-icons/express.svg?color=%23f5f5f5" },
        { nome: "Python", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    ],

    // ---------- PÁGINA 4: PROJETOS ----------
    projetos: [
        { nome: "FlowSet", detalhe: "Projeto principal", icone: "mdi:star-shooting", especial: true },
        { nome: "APIs", detalhe: "REST · FastAPI · Express", icone: "mdi:api" },
        { nome: "Banco de Dados", detalhe: "PostgreSQL · Modelagem", icone: "mdi:database" },
        { nome: "IA", detalhe: "Integrações inteligentes", icone: "mdi:robot" },
        { nome: "Automação", detalhe: "Scripts e rotinas", icone: "mdi:cog-sync" },
    ],

    // ---------- PÁGINA 5: CERTIFICADOS (o QR Code aponta para a URL) ----------
    certificados: [
        { nome: "Alura", detalhe: "Formação em programação", icone: "mdi:laptop", url: "https://cursos.alura.com.br" },              // EDITE: link do certificado
        { nome: "Wizard", detalhe: "Inglês", icone: "mdi:translate", url: "https://www.wizard.com.br" },                             // EDITE: link do certificado
        { nome: "SETREM", detalhe: "Técnico em Informática", icone: "mdi:certificate", url: "https://www.setrem.com.br" },           // EDITE: link do certificado
    ],

    // ---------- PÁGINA 6: CURIOSIDADES ----------
    curiosidades: {
        cafe: "Café preto, sem açúcar",        // EDITE: sua preferência de café
        sistemaOperacional: "Windows 11",       // EDITE: seu sistema operacional favorito
        editor: "VS Code / Cursor / Antigravity IDE",             // EDITE: seu editor de código favorito
        // A capa da música é buscada na iTunes Search API (pública, sem chave)
        musica: { faixa: "Além do Rio Azul", artista: "Voz da Verdade" },   // EDITE: sua música favorita
        // A capa do livro é buscada na Open Library API
        livro: { titulo: "Código Limpo", busca: "Clean Code Robert Martin" },   // EDITE: seu livro favorito
    },

    // ---------- PÁGINA 7: ESTATÍSTICAS ----------
    estatisticas: [
        { nome: "Criatividade", valor: 95 },
        { nome: "Backend", valor: 90 },
        { nome: "Frontend", valor: 82 },
        { nome: "Banco de Dados", valor: 88 },
        { nome: "IA", valor: 85 },
        { nome: "Aprendizado", valor: 99 },
    ],

    // ---------- PÁGINA 8: FIGURINHAS LENDÁRIAS ----------
    lendarias: [
        { nome: "FlowSet", detalhe: "Projeto autoral", icone: "mdi:star-shooting" },
        { nome: "Alura", detalhe: "Formação dev", icone: "mdi:laptop" },
        { nome: "Unimed", detalhe: "Experiência", icone: "mdi:hospital-building" },
        { nome: "Cooperconcórdia", detalhe: "Primeiro emprego", icone: "mdi:handshake" },
    ],
};
