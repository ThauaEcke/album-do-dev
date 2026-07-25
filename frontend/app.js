// ===================================================
// ÁLBUM DO DEV — figurinhas geradas por APIs públicas
// GitHub · IBGE · REST Countries · Open-Meteo ·
// WorldTimeAPI · Devicon · Iconify · QRServer ·
// iTunes Search · Open Library · DiceBear
// ===================================================

// ---------------------------------------------------
// Helpers de URL das APIs
// ---------------------------------------------------
function urlQrCode(dados, tamanho = 180) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=${tamanho}x${tamanho}` +
        `&data=${encodeURIComponent(dados)}&bgcolor=f5f3ff&color=1e1b4b&qzone=1&format=svg`;
}

function urlIcone(icone, cor = "8be9fd") {
    return `https://api.iconify.design/${icone.replace(":", "/")}.svg?color=%23${cor}`;
}

function urlAvatarFallback(seed) {
    return `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(seed)}&backgroundColor=1e1b4b`;
}

function normalizar(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

// Requisição JSONP (a iTunes Search API não garante CORS)
function jsonp(url) {
    return new Promise((resolve, reject) => {
        const nomeCallback = "cb_" + Math.random().toString(36).slice(2);
        const script = document.createElement("script");
        const limpar = () => { delete window[nomeCallback]; script.remove(); };

        window[nomeCallback] = (dados) => { limpar(); resolve(dados); };
        script.onerror = () => { limpar(); reject(new Error("Falha na requisição JSONP")); };
        script.src = `${url}&callback=${nomeCallback}`;
        document.body.appendChild(script);
    });
}

// Descrição do clima a partir do código WMO da Open-Meteo
function descricaoClima(codigo) {
    if (codigo === 0) return { emoji: "☀️", texto: "Céu limpo" };
    if (codigo <= 2) return { emoji: "🌤️", texto: "Parcialmente nublado" };
    if (codigo === 3) return { emoji: "☁️", texto: "Nublado" };
    if (codigo <= 48) return { emoji: "🌫️", texto: "Neblina" };
    if (codigo <= 57) return { emoji: "🌦️", texto: "Garoa" };
    if (codigo <= 67) return { emoji: "🌧️", texto: "Chuva" };
    if (codigo <= 77) return { emoji: "🌨️", texto: "Neve" };
    if (codigo <= 82) return { emoji: "🌧️", texto: "Pancadas de chuva" };
    return { emoji: "⛈️", texto: "Tempestade" };
}

// ---------------------------------------------------
// Criação e desbloqueio de figurinhas
// ---------------------------------------------------
let contadorFigurinha = 0;

function criarSlot(grid, { nome, dica, especial = false, classeExtra = "" }) {
    contadorFigurinha++;
    const slot = document.createElement("div");
    slot.className = `sticker-slot ${especial ? "special-slot" : ""} ${classeExtra}`.trim();
    slot.innerHTML = `
        <div class="slot-number">#${String(contadorFigurinha).padStart(2, "0")}</div>
        <div class="slot-name">${nome}</div>
        <div class="slot-role">${dica}</div>`;
    grid.appendChild(slot);
    return slot;
}

// Substitui o conteúdo do slot pela figurinha "colada", com animação
function desbloquear(slot, { midia, nome, detalhe = "", atraso = 0 }) {
    setTimeout(() => {
        slot.querySelector(".slot-name")?.remove();
        slot.querySelector(".slot-role")?.remove();

        const conteudo = document.createElement("div");
        conteudo.className = "fig-conteudo";
        conteudo.innerHTML = `
            <div class="fig-midia">${midia}</div>
            <div class="fig-nome">${nome}</div>
            ${detalhe ? `<div class="fig-detalhe">${detalhe}</div>` : ""}`;

        slot.appendChild(conteudo);
        slot.classList.add("desbloqueada");
    }, atraso);
}

// ---------------------------------------------------
// CAPA E CONTRACAPA
// ---------------------------------------------------
function montarCapa() {
    document.getElementById("capa-nome").textContent = DADOS.nome.toUpperCase();
    document.getElementById("capa-numero").textContent = `ÁLBUM ${DADOS.numeroAlbum}`;
    document.getElementById("capa-titulo").textContent = DADOS.titulo.toUpperCase();
    document.getElementById("capa-qr-linkedin").src = urlQrCode(DADOS.linkedinUrl, 120);
    document.getElementById("capa-avatar").src = urlAvatarFallback(DADOS.nome);
}

function montarContracapa() {
    const container = document.getElementById("contracapa-qrs");
    const links = [
        { rotulo: "GITHUB", url: `https://github.com/${DADOS.githubUser}` },
        { rotulo: "LINKEDIN", url: DADOS.linkedinUrl },
        { rotulo: "PORTFÓLIO", url: DADOS.portfolioUrl },
    ];

    for (const link of links) {
        const card = document.createElement("a");
        card.className = "qr-card";
        card.href = link.url;
        card.target = "_blank";
        card.rel = "noopener";
        card.innerHTML = `
            <img src="${urlQrCode(link.url, 140)}" alt="QR Code ${link.rotulo}" draggable="false">
            <span>${link.rotulo}</span>`;
        container.appendChild(card);
    }

    document.getElementById("contracapa-rodape").textContent =
        `${DADOS.nome} · Álbum ${DADOS.numeroAlbum} · 2026`;
}

// ---------------------------------------------------
// PÁGINA 1: PERFIL (GitHub, IBGE, REST Countries,
// Open-Meteo e WorldTimeAPI)
// ---------------------------------------------------
async function montarPerfil() {
    const grid = document.getElementById("grid-perfil");

    const slotGitHub = criarSlot(grid, { nome: "Perfil", dica: "GitHub API", especial: true });
    const slotLocal = criarSlot(grid, { nome: "Localização", dica: "IBGE API" });
    const slotBandeira = criarSlot(grid, { nome: "Brasil", dica: "IBGE + FlagCDN" });
    const slotClima = criarSlot(grid, { nome: "Clima", dica: "Open-Meteo" });
    const slotHora = criarSlot(grid, { nome: "Hora local", dica: "WorldTimeAPI" });

    carregarGitHub(slotGitHub);
    carregarLocalizacao(slotLocal);
    carregarBandeira(slotBandeira);
    carregarClima(slotClima);
    carregarHora(slotHora);
}

async function carregarGitHub(slot) {
    let avatar = urlAvatarFallback(DADOS.nome);
    let detalhe = "figurinha nº 1 da coleção";
    let nome = DADOS.nome;

    try {
        const resposta = await fetch(`https://api.github.com/users/${DADOS.githubUser}`);
        if (!resposta.ok) throw new Error(`GitHub respondeu ${resposta.status}`);
        const usuario = await resposta.json();

        avatar = usuario.avatar_url;
        nome = usuario.name || DADOS.nome;
        detalhe = `${usuario.public_repos} repositórios · ${usuario.followers} seguidores`;
    } catch (erro) {
        console.warn("GitHub API indisponível, usando avatar DiceBear:", erro.message);
    }

    document.getElementById("capa-avatar").src = avatar;
    desbloquear(slot, {
        midia: `<img src="${avatar}" alt="Foto de perfil" class="fig-avatar" draggable="false">`,
        nome,
        detalhe,
    });
}

async function carregarLocalizacao(slot) {
    let detalhe = "Brasil";
    try {
        const resposta = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${DADOS.uf}/municipios`);
        const municipios = await resposta.json();
        const municipio = municipios.find(m => normalizar(m.nome) === normalizar(DADOS.cidade));
        if (municipio) {
            detalhe = `${municipio.microrregiao.mesorregiao.nome} · cód. IBGE ${municipio.id}`;
        }
    } catch (erro) {
        console.warn("IBGE API indisponível:", erro.message);
    }

    desbloquear(slot, {
        midia: `<img src="${urlIcone("mdi:map-marker", "ff79c6")}" alt="" class="fig-icone" draggable="false">`,
        nome: `${DADOS.cidade} · ${DADOS.uf}`,
        detalhe,
    });
}

async function carregarBandeira(slot) {
    const bandeira = `<img src="https://flagcdn.com/w320/br.png" alt="Bandeira do Brasil" class="fig-bandeira" draggable="false">`;

    try {
        const resposta = await fetch("https://servicodados.ibge.gov.br/api/v1/paises/BR");
        const [pais] = await resposta.json();
        const capital = pais.governo.capital.nome;
        const areaMilhoes = (parseFloat(pais.area.total.replace(/\./g, "").replace(",", ".")) / 1e6).toFixed(1);

        desbloquear(slot, {
            midia: bandeira,
            nome: "Brasil",
            detalhe: `Capital: ${capital} · ${areaMilhoes} mi km²`,
        });
    } catch (erro) {
        console.warn("IBGE Países indisponível:", erro.message);
        desbloquear(slot, {
            midia: bandeira,
            nome: "Brasil",
            detalhe: "América do Sul",
        });
    }
}

async function carregarClima(slot) {
    try {
        // 1. Geocodifica a cidade para latitude/longitude
        const geoResposta = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(DADOS.cidade)}&count=10&language=pt&format=json`
        );
        const geo = await geoResposta.json();
        const lugar = (geo.results || []).find(r => r.country_code === "BR");
        if (!lugar) throw new Error("cidade não encontrada no geocoding");

        // 2. Busca o clima atual
        const climaResposta = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lugar.latitude}&longitude=${lugar.longitude}` +
            `&current=temperature_2m,relative_humidity_2m,weather_code&timezone=${encodeURIComponent(DADOS.fusoHorario)}`
        );
        const clima = await climaResposta.json();
        const atual = clima.current;
        const { emoji, texto } = descricaoClima(atual.weather_code);

        desbloquear(slot, {
            midia: `<span class="fig-emoji">${emoji}</span>`,
            nome: `${Math.round(atual.temperature_2m)}°C · ${texto}`,
            detalhe: `Umidade ${atual.relative_humidity_2m}% · ${DADOS.cidade}`,
        });
    } catch (erro) {
        console.warn("Open-Meteo indisponível:", erro.message);
        desbloquear(slot, {
            midia: `<span class="fig-emoji">🌡️</span>`,
            nome: "Clima",
            detalhe: "Open-Meteo indisponível",
        });
    }
}

async function carregarHora(slot) {
    let deslocamento = 0; // diferença entre a hora da API e a do dispositivo
    let detalhe = "Hora do dispositivo";

    try {
        // WorldTimeAPI é instável: limita a espera a 6 segundos
        const resposta = await fetch(`https://worldtimeapi.org/api/timezone/${DADOS.fusoHorario}`, {
            signal: AbortSignal.timeout(6000),
        });
        const dados = await resposta.json();
        deslocamento = new Date(dados.datetime).getTime() - Date.now();
        detalhe = `${dados.timezone} (${dados.abbreviation})`;
    } catch (erro) {
        console.warn("WorldTimeAPI indisponível, tentando timeapi.io:", erro.message);
        try {
            const resposta = await fetch(
                `https://timeapi.io/api/time/current/zone?timeZone=${encodeURIComponent(DADOS.fusoHorario)}`,
                { signal: AbortSignal.timeout(6000) }
            );
            const dados = await resposta.json();
            detalhe = `${dados.timeZone} · timeapi.io`;
        } catch (erroReserva) {
            console.warn("timeapi.io também indisponível, usando hora local:", erroReserva.message);
        }
    }

    desbloquear(slot, {
        midia: `<span class="fig-relogio" id="relogio-live">--:--:--</span>`,
        nome: "Hora local",
        detalhe,
    });

    // Relógio ao vivo, sincronizado com a API
    setTimeout(() => {
        const atualizar = () => {
            const el = document.getElementById("relogio-live");
            if (!el) return;
            const agora = new Date(Date.now() + deslocamento);
            el.textContent = agora.toLocaleTimeString("pt-BR", { timeZone: DADOS.fusoHorario });
        };
        atualizar();
        setInterval(atualizar, 1000);
    }, 600);
}

// ---------------------------------------------------
// PÁGINA 2: CARREIRA (ícones via Iconify)
// ---------------------------------------------------
function montarCarreira() {
    const grid = document.getElementById("grid-carreira");
    DADOS.carreira.forEach((etapa, i) => {
        const slot = criarSlot(grid, { nome: etapa.nome, dica: "Carregando..." });
        desbloquear(slot, {
            midia: `<img src="${urlIcone(etapa.icone, "8be9fd")}" alt="" class="fig-icone" draggable="false">
                    <span class="fig-etapa">ETAPA ${i + 1}</span>`,
            nome: etapa.nome,
            detalhe: etapa.detalhe,
            atraso: 200 + i * 180,
        });
    });
}

// ---------------------------------------------------
// PÁGINA 3: TECNOLOGIAS (logos via Devicon/Iconify)
// ---------------------------------------------------
function montarTecnologias() {
    const grid = document.getElementById("grid-tecnologias");
    DADOS.tecnologias.forEach((tec, i) => {
        const slot = criarSlot(grid, { nome: tec.nome, dica: "Devicon" });
        desbloquear(slot, {
            midia: `<img src="${tec.url}" alt="Logo de ${tec.nome}" class="fig-logo" draggable="false">`,
            nome: tec.nome,
            atraso: 200 + i * 130,
        });
    });
}

// ---------------------------------------------------
// PÁGINA 4: PROJETOS
// ---------------------------------------------------
function montarProjetos() {
    const grid = document.getElementById("grid-projetos");
    DADOS.projetos.forEach((projeto, i) => {
        const slot = criarSlot(grid, {
            nome: projeto.nome,
            dica: "Carregando...",
            especial: projeto.especial,
        });
        desbloquear(slot, {
            midia: `<img src="${urlIcone(projeto.icone, projeto.especial ? "f0c14b" : "bd93f9")}" alt="" class="fig-icone" draggable="false">`,
            nome: `${projeto.especial ? "⭐ " : ""}${projeto.nome}`,
            detalhe: projeto.detalhe,
            atraso: 200 + i * 180,
        });
    });
}

// ---------------------------------------------------
// PÁGINA 5: CERTIFICADOS (QR Codes via QRServer)
// ---------------------------------------------------
function montarCertificados() {
    const grid = document.getElementById("grid-certificados");
    DADOS.certificados.forEach((cert, i) => {
        const slot = criarSlot(grid, { nome: cert.nome, dica: "Gerando QR Code...", classeExtra: "cert-slot" });
        desbloquear(slot, {
            midia: `
                <a href="${cert.url}" target="_blank" rel="noopener" class="cert-qr" title="Abrir certificado">
                    <img src="${urlQrCode(cert.url, 150)}" alt="QR Code do certificado ${cert.nome}" draggable="false">
                </a>
                <div class="cert-info">
                    <img src="${urlIcone(cert.icone, "8be9fd")}" alt="" class="fig-icone-mini" draggable="false">
                    <div>
                        <div class="fig-nome">${cert.nome}</div>
                        <div class="fig-detalhe">${cert.detalhe}</div>
                        <div class="cert-dica">Escaneie ou clique no QR Code</div>
                    </div>
                </div>`,
            nome: "",
            atraso: 200 + i * 200,
        });
    });
}

// ---------------------------------------------------
// PÁGINA 6: CURIOSIDADES (iTunes + Open Library)
// ---------------------------------------------------
function montarCuriosidades() {
    const grid = document.getElementById("grid-curiosidades");
    const c = DADOS.curiosidades;

    const slotCafe = criarSlot(grid, { nome: "Café", dica: "☕" });
    const slotSO = criarSlot(grid, { nome: "Sistema", dica: "💻" });
    const slotMusica = criarSlot(grid, { nome: "Música pra codar", dica: "iTunes API", especial: true });
    const slotEditor = criarSlot(grid, { nome: "Editor", dica: "⌨️" });
    const slotLivro = criarSlot(grid, { nome: "Livro", dica: "Open Library" });

    desbloquear(slotCafe, {
        midia: `<img src="${urlIcone("mdi:coffee", "d4a017")}" alt="" class="fig-icone" draggable="false">`,
        nome: "Café favorito",
        detalhe: c.cafe,
        atraso: 200,
    });

    desbloquear(slotSO, {
        midia: `<img src="${urlIcone("mdi:microsoft-windows", "8be9fd")}" alt="" class="fig-icone" draggable="false">`,
        nome: "Sistema Operacional",
        detalhe: c.sistemaOperacional,
        atraso: 380,
    });

    desbloquear(slotEditor, {
        midia: `<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" alt="" class="fig-icone" draggable="false">`,
        nome: "Editor de Código",
        detalhe: c.editor,
        atraso: 560,
    });

    carregarMusica(slotMusica, c.musica);
    carregarLivro(slotLivro, c.livro);
}

async function carregarMusica(slot, musica) {
    let midia = `<img src="${urlIcone("mdi:music", "50fa7b")}" alt="" class="fig-icone" draggable="false">`;

    try {
        const termo = encodeURIComponent(`${musica.faixa} ${musica.artista}`);
        const dados = await jsonp(`https://itunes.apple.com/search?term=${termo}&media=music&limit=1&country=br`);
        const faixa = dados.results?.[0];
        if (faixa) {
            const capa = faixa.artworkUrl100.replace("100x100", "300x300");
            midia = `<img src="${capa}" alt="Capa de ${musica.faixa}" class="fig-capa" draggable="false">`;
        }
    } catch (erro) {
        console.warn("iTunes Search indisponível:", erro.message);
    }

    desbloquear(slot, {
        midia,
        nome: `🎵 ${musica.faixa}`,
        detalhe: musica.artista,
    });
}

async function carregarLivro(slot, livro) {
    let midia = `<img src="${urlIcone("mdi:book-open-page-variant", "ffb86c")}" alt="" class="fig-icone" draggable="false">`;
    let detalhe = "Leitura de cabeceira";

    try {
        const resposta = await fetch(
            `https://openlibrary.org/search.json?q=${encodeURIComponent(livro.busca)}&limit=1&fields=cover_i,author_name`
        );
        const dados = await resposta.json();
        const doc = dados.docs?.[0];
        if (doc?.cover_i) {
            midia = `<img src="https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg" alt="Capa de ${livro.titulo}" class="fig-capa" draggable="false">`;
        }
        if (doc?.author_name?.length) {
            detalhe = doc.author_name[0];
        }
    } catch (erro) {
        console.warn("Open Library indisponível:", erro.message);
    }

    desbloquear(slot, { midia, nome: `📖 ${livro.titulo}`, detalhe });
}

// ---------------------------------------------------
// PÁGINA 7: ESTATÍSTICAS
// ---------------------------------------------------
let estatisticasAnimadas = false;

function montarEstatisticas() {
    const container = document.getElementById("stats-container");

    for (const stat of DADOS.estatisticas) {
        const linha = document.createElement("div");
        linha.className = "stat-linha";
        linha.innerHTML = `
            <div class="stat-cabecalho">
                <span class="stat-nome">${stat.nome}</span>
                <span class="stat-valor">${stat.valor}</span>
            </div>
            <div class="stat-trilha">
                <div class="stat-barra" data-valor="${stat.valor}"></div>
            </div>`;
        container.appendChild(linha);
    }

    const media = Math.round(DADOS.estatisticas.reduce((soma, s) => soma + s.valor, 0) / DADOS.estatisticas.length);
    const geral = document.createElement("div");
    geral.className = "stat-geral";
    geral.innerHTML = `<span class="stat-geral-valor">${media}</span><span class="stat-geral-rotulo">OVERALL</span>`;
    container.appendChild(geral);
}

function animarEstatisticas() {
    if (estatisticasAnimadas) return;
    estatisticasAnimadas = true;

    document.querySelectorAll(".stat-barra").forEach((barra, i) => {
        setTimeout(() => {
            barra.style.width = `${barra.dataset.valor}%`;
        }, 150 + i * 120);
    });
}

// ---------------------------------------------------
// PÁGINA 8: FIGURINHAS LENDÁRIAS (efeito holográfico)
// ---------------------------------------------------
function montarLendarias() {
    const grid = document.getElementById("grid-lendarias");

    DADOS.lendarias.forEach((figura, i) => {
        contadorFigurinha++;
        const card = document.createElement("div");
        card.className = "holo-card";
        card.innerHTML = `
            <div class="holo-brilho"></div>
            <div class="slot-number holo-numero">L${i + 1}</div>
            <div class="holo-conteudo">
                <img src="${urlIcone(figura.icone, "ffd700")}" alt="" class="fig-icone" draggable="false">
                <div class="fig-nome">${figura.nome}</div>
                <div class="fig-detalhe">${figura.detalhe}</div>
                <span class="holo-selo">★ LENDÁRIA ★</span>
            </div>`;
        grid.appendChild(card);

        // Inclinação 3D acompanhando o mouse
        card.addEventListener("mousemove", (e) => {
            const area = card.getBoundingClientRect();
            const x = (e.clientX - area.left) / area.width;
            const y = (e.clientY - area.top) / area.height;
            card.style.setProperty("--mx", `${x * 100}%`);
            card.style.setProperty("--my", `${y * 100}%`);
            card.style.transform = `perspective(600px) rotateY(${(x - 0.5) * 16}deg) rotateX(${(0.5 - y) * 16}deg)`;
        });
        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });

        setTimeout(() => card.classList.add("desbloqueada"), 250 + i * 200);
    });
}

// ---------------------------------------------------
// MONTAGEM GERAL DO ÁLBUM
// ---------------------------------------------------
function montarAlbum() {
    montarCapa();
    montarContracapa();
    montarPerfil();
    montarCarreira();
    montarTecnologias();
    montarProjetos();
    montarCertificados();
    montarCuriosidades();
    montarEstatisticas();
    montarLendarias();
}

// ---------------------------------------------------
// INICIALIZAÇÃO DO LIVRO (PageFlip)
// ---------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    const bookElement = document.getElementById("book");
    const btnPrev = document.getElementById("btn-prev");
    const btnNext = document.getElementById("btn-next");
    const soundToggle = document.getElementById("sound-toggle");
    const iconOn = soundToggle.querySelector(".sound-icon-on");
    const iconOff = soundToggle.querySelector(".sound-icon-off");

    let isMuted = false;
    let pageFlip = null;

    // Preenche o conteúdo das páginas antes de inicializar o livro
    montarAlbum();

    // 1. Inicializa o St.PageFlip
    try {
        pageFlip = new St.PageFlip(bookElement, {
            width: 550,
            height: 800,
            size: "stretch",
            minWidth: 315,
            maxWidth: 1000,
            minHeight: 420,
            maxHeight: 1350,
            drawShadow: true,
            maxShadowOpacity: 0.4,
            showCover: true,
            mobileScrollSupport: true,
            useMouseEvents: false,
            showPageCorners: false,
            disableFlipByClick: true,
            flippingTime: 800
        });

        // Carrega as páginas do HTML
        pageFlip.loadFromHTML(document.querySelectorAll(".page"));

        // Estado de arraste personalizado
        let activeDragPage = null;
        let isClicking = false;
        let startX = 0;
        let startY = 0;
        let dragStarted = false;

        // Monitora o mousedown/touchstart em cada página para iniciar a intenção de arraste
        document.querySelectorAll(".page").forEach((page, index) => {
            page.addEventListener("mousedown", (e) => {
                if (e.target.closest("button") || e.target.closest("a")) return;
                isClicking = true;
                startX = e.clientX;
                startY = e.clientY;
                dragStarted = false;
                activeDragPage = { page, index };
            });

            page.addEventListener("touchstart", (e) => {
                if (e.target.closest("button") || e.target.closest("a")) return;
                const touch = e.touches[0];
                isClicking = true;
                startX = touch.clientX;
                startY = touch.clientY;
                dragStarted = false;
                activeDragPage = { page, index };
            });
        });

        // Executa o movimento de dobra apenas se o mouse/dedo se mover além de um limiar (threshold)
        const handleMove = (clientX, clientY, isTouch = false) => {
            if (!isClicking || !activeDragPage) return;

            const deltaX = clientX - startX;
            const deltaY = clientY - startY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            const bookRect = bookElement.getBoundingClientRect();

            // Só ativa o flip se mover mais de 10px (evita disparar ao clicar e soltar)
            if (distance > 10 && !dragStarted) {
                dragStarted = true;
                let cornerX, cornerY;

                // Determina canto vertical (topo vs base) em coordenadas relativas ao livro
                const centerY = bookRect.top + bookRect.height / 2;
                if (startY < centerY) {
                    cornerY = 0; // Canto superior
                } else {
                    cornerY = bookRect.height; // Canto inferior
                }

                // Determina canto horizontal (direita vs esquerda) em coordenadas relativas ao livro
                if (activeDragPage.index % 2 === 0) {
                    cornerX = bookRect.width; // Canto direito
                } else {
                    cornerX = 0; // Canto esquerdo
                }

                document.body.classList.add("dragging");
                pageFlip.startUserTouch({ x: cornerX, y: cornerY });
                playPaperTurnSound();
            }

            if (dragStarted) {
                const relX = clientX - bookRect.left;
                const relY = clientY - bookRect.top;
                pageFlip.userMove({ x: relX, y: relY }, isTouch);
            }
        };

        const handleRelease = (clientX, clientY, isTouch = false) => {
            if (dragStarted) {
                const bookRect = bookElement.getBoundingClientRect();
                const relX = clientX - bookRect.left;
                const relY = clientY - bookRect.top;
                pageFlip.userStop({ x: relX, y: relY }, isTouch);
            }
            isClicking = false;
            dragStarted = false;
            activeDragPage = null;
            document.body.classList.remove("dragging");
        };

        window.addEventListener("mousemove", (e) => {
            handleMove(e.clientX, e.clientY, false);
        });

        window.addEventListener("touchmove", (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                handleMove(touch.clientX, touch.clientY, true);
            }
        });

        window.addEventListener("mouseup", (e) => {
            handleRelease(e.clientX, e.clientY, false);
        });

        window.addEventListener("touchend", (e) => {
            const touch = e.changedTouches[0] || e.touches[0];
            if (touch) {
                handleRelease(touch.clientX, touch.clientY, true);
            } else {
                handleRelease(startX, startY, true);
            }
        });

        bookElement.style.display = "block";

    } catch (error) {
        console.error("Erro ao inicializar a biblioteca PageFlip:", error);
    }

    // 2. Efeito sonoro (Web Audio API)
    function playPaperTurnSound() {
        if (isMuted) return;

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;

            const audioCtx = new AudioContext();
            const duration = 0.45;
            const sampleRate = audioCtx.sampleRate;
            const bufferSize = sampleRate * duration;
            const buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
            const data = buffer.getChannelData(0);

            // Som ao virar a página
            for (let i = 0; i < bufferSize; i++) {
                const progress = i / bufferSize;
                const noise = Math.random() * 2 - 1;

                let envelope = 0;
                if (progress < 0.3) {
                    envelope = progress / 0.3;
                } else {
                    envelope = (1 - progress) / 0.7;
                }

                // Simula o som de fricção do papel
                const paperCrackle = Math.random() > 0.985 ? (Math.random() * 2 - 1) * 0.35 : 0;

                data[i] = (noise * 0.65 + paperCrackle) * envelope * 0.12;
            }

            const noiseNode = audioCtx.createBufferSource();
            noiseNode.buffer = buffer;

            const bandpassFilter = audioCtx.createBiquadFilter();
            bandpassFilter.type = "bandpass";
            bandpassFilter.Q.value = 2.0;

            bandpassFilter.frequency.setValueAtTime(1500, audioCtx.currentTime);
            bandpassFilter.frequency.exponentialRampToValueAtTime(350, audioCtx.currentTime + duration);

            const lowpassFilter = audioCtx.createBiquadFilter();
            lowpassFilter.type = "lowpass";
            lowpassFilter.frequency.setValueAtTime(3800, audioCtx.currentTime);

            noiseNode.connect(bandpassFilter);
            bandpassFilter.connect(lowpassFilter);
            lowpassFilter.connect(audioCtx.destination);

            noiseNode.start();
        } catch (e) {
            console.warn("Falha ao tocar som de virada de página:", e);
        }
    }

    // 3. Controle de estados do áudio
    soundToggle.addEventListener("click", () => {
        isMuted = !isMuted;
        if (isMuted) {
            iconOn.classList.add("hidden");
            iconOff.classList.remove("hidden");
        } else {
            iconOn.classList.remove("hidden");
            iconOff.classList.add("hidden");
        }
    });

    // 4. Controles e eventos de navegação
    if (pageFlip) {
        // Ativa o som ao virar a página
        pageFlip.on("changeState", (e) => {
            if (e.data === "flipping") {
                playPaperTurnSound();
            }
        });

        // Ativa e desativa a presença das setas dependendo da página atual
        pageFlip.on("flip", (e) => {
            const currentPage = e.data;
            const totalPages = pageFlip.getPageCount();

            // Anima as barras de estatísticas quando a página 7 entra em cena
            if (currentPage >= 6) {
                animarEstatisticas();
            }

            // Esconde a seta esquerda quando está na capa
            if (currentPage === 0) {
                btnPrev.classList.add("hidden");
            } else {
                btnPrev.classList.remove("hidden");
            }

            // Esconde a seta direita quando está na contracapa
            if (currentPage === totalPages - 1) {
                btnNext.classList.add("hidden");
            } else {
                btnNext.classList.remove("hidden");
            }
        });

        // Eventos de clique para as setas de navegação
        btnPrev.addEventListener("click", () => {
            pageFlip.flipPrev();
        });

        btnNext.addEventListener("click", () => {
            pageFlip.flipNext();
        });

        // Eventos de teclado para as setas de navegação
        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowLeft") {
                pageFlip.flipPrev();
            } else if (e.key === "ArrowRight") {
                pageFlip.flipNext();
            }
        });

        // Esconde a seta esquerda ao iniciar o álbum (pois inicia na capa)
        btnPrev.classList.add("hidden");
    }
});
