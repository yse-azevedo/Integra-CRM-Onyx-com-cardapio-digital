const CREDENCIAIS_SUPORTE = {
    usuario: 'admin',
    senha: '1234'
};

const CHAVE_BANCO = 'onyx_lojas_db_v2';
const CHAVE_SESSAO = 'onyx_suporte_logado';

const CHAVE_SEED = 'onyx_seed_familia_dog_v1';
const ID_FAMILIA_DOG = 1;

let lojasCadastradas = [];
let lojaAtualId = null;
let lojaEditandoId = null;
let produtoEditandoId = null;

function carregarBanco() {
    try {
        const salvo = localStorage.getItem(CHAVE_BANCO);
        lojasCadastradas = salvo ? JSON.parse(salvo) : [];
    } catch (e) {
        lojasCadastradas = [];
    }
    semearLojaPadrao();
}

function semearLojaPadrao() {
    try {
        if (localStorage.getItem(CHAVE_SEED)) return;
        if (!lojasCadastradas.some(l => l.id === ID_FAMILIA_DOG)) {
            lojasCadastradas.unshift({
                id: ID_FAMILIA_DOG,
                nomeLoja: 'FAMILIA DOG',
                responsavel: '',
                whatsapp: '(11) 91640-0439',
                cidade: 'São Paulo',
                produtos: []
            });
            salvarBanco();
        }
        localStorage.setItem(CHAVE_SEED, '1');
    } catch (e) {}
}

function salvarBanco() {
    try {
        localStorage.setItem(CHAVE_BANCO, JSON.stringify(lojasCadastradas));
    } catch (e) {}
}

function esc(texto) {
    return String(texto).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

// ---------- MÁSCARA DE MOEDA ----------
const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const reais = (v) => moeda.format(Number(v) || 0);

function valorNumerico(input) {
    const digitos = input.value.replace(/\D/g, '');
    return digitos ? Number(digitos) / 100 : NaN;
}

function mascararMoeda(input) {
    const digitos = input.value.replace(/\D/g, '');
    input.value = digitos ? moeda.format(Number(digitos) / 100) : '';
}

document.addEventListener('input', (e) => {
    if (e.target.classList && e.target.classList.contains('input-moeda')) mascararMoeda(e.target);
});

document.addEventListener('DOMContentLoaded', () => {
    carregarBanco();

    const $ = (id) => document.getElementById(id);
    const loginScreen = $('login-screen');
    const dashboardScreen = $('dashboard-screen');
    const formLogin = $('form-suporte-login');
    const loginErro = $('login-erro');
    const buscaCliente = $('busca-cliente');
    const lojaAtual = () => lojasCadastradas.find(l => l.id === lojaAtualId);

    // ---------- LOGIN ----------
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = $('sup-user').value.trim().toLowerCase();
        const pass = $('sup-pass').value.trim();

        if ((user === CREDENCIAIS_SUPORTE.usuario || user === 'admin@onyx.com') && pass === CREDENCIAIS_SUPORTE.senha) {
            loginErro.classList.add('hidden');
            try { sessionStorage.setItem(CHAVE_SESSAO, '1'); } catch (e) {}
            entrar();
        } else {
            loginErro.textContent = 'Usuário ou senha inválidos. Use admin / 1234.';
            loginErro.classList.remove('hidden');
        }
    });

    $('btn-logout').addEventListener('click', () => {
        try { sessionStorage.removeItem(CHAVE_SESSAO); } catch (e) {}
        history.replaceState(null, '', location.pathname);
        dashboardScreen.classList.add('hidden');
        loginScreen.classList.remove('hidden');
        formLogin.reset();
        voltarParaClientes();
    });

    // ---------- CLIENTES ----------
    function renderizarClientes(filtro = '') {
        const grid = $('lista-clientes-grid');
        grid.innerHTML = '';

        const termo = filtro.toLowerCase();
        const filtradas = lojasCadastradas.filter(loja =>
            loja.nomeLoja.toLowerCase().includes(termo) ||
            loja.cidade.toLowerCase().includes(termo) ||
            loja.responsavel.toLowerCase().includes(termo)
        );

        if (!filtradas.length) {
            grid.innerHTML = `<p class="hint-text" style="grid-column:1/-1">${
                lojasCadastradas.length
                    ? 'Nenhum cliente encontrado.'
                    : 'Nenhum cliente cadastrado. Clique em “+ Novo Cliente” para começar.'
            }</p>`;
            return;
        }

        filtradas.forEach(loja => {
            const card = document.createElement('div');
            card.className = 'cliente-card';
            card.innerHTML = `
                <div>
                    <div class="cliente-card-top">
                        <h3>${esc(loja.nomeLoja)}</h3>
                        <span class="status-ativo">Ativa</span>
                    </div>
                    <div class="cliente-info">
                        <p><strong>Responsável:</strong> ${esc(loja.responsavel)}</p>
                        <p><strong>WhatsApp:</strong> ${esc(loja.whatsapp)}</p>
                        <p><strong>Cidade:</strong> ${esc(loja.cidade)}</p>
                        <p><strong>Produtos:</strong> ${loja.produtos.length} itens cadastrados no CRM</p>
                    </div>
                </div>
                <a class="btn-acessar-loja btn-link" href="#loja-${loja.id}">Gerenciar Produtos e Preços →</a>
                <div class="card-actions">
                    <a class="btn-outline btn-link" href="../index.html?loja=${loja.id}">Cardápio ↗</a>
                    <button class="btn-outline" data-editar="${loja.id}">Editar</button>
                    <button class="btn-outline btn-excluir" data-excluir="${loja.id}">Excluir</button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    $('lista-clientes-grid').addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        if (btn.dataset.editar) abrirModalCliente(Number(btn.dataset.editar));
        if (btn.dataset.excluir) {
            const id = Number(btn.dataset.excluir);
            const loja = lojasCadastradas.find(l => l.id === id);
            if (loja && confirm(`Excluir "${loja.nomeLoja}" e todos os produtos dela?`)) {
                lojasCadastradas = lojasCadastradas.filter(l => l.id !== id);
                salvarBanco();
                renderizarClientes(buscaCliente.value);
            }
        }
    });

    buscaCliente.addEventListener('input', (e) => renderizarClientes(e.target.value));

    const modalCliente = $('modal-cliente');
    const formCliente = $('form-novo-cliente');

    function abrirModalCliente(idEdicao = null) {
        lojaEditandoId = idEdicao;
        formCliente.reset();

        if (idEdicao) {
            const loja = lojasCadastradas.find(l => l.id === idEdicao);
            if (!loja) return;
            $('modal-cliente-titulo').textContent = 'Editar Cliente';
            $('cli-nome').value = loja.nomeLoja;
            $('cli-cidade').value = loja.cidade;
            $('cli-responsavel').value = loja.responsavel;
            $('cli-telefone').value = loja.whatsapp;
        } else {
            $('modal-cliente-titulo').textContent = 'Cadastrar Novo Cliente';
        }

        modalCliente.classList.remove('hidden');
        $('cli-nome').focus();
    }

    $('btn-novo-cliente').addEventListener('click', () => abrirModalCliente());
    $('btn-editar-loja').addEventListener('click', () => abrirModalCliente(lojaAtualId));
    $('btn-fechar-modal-cliente').addEventListener('click', () => modalCliente.classList.add('hidden'));

    formCliente.addEventListener('submit', (e) => {
        e.preventDefault();
        const dados = {
            nomeLoja: $('cli-nome').value.trim(),
            responsavel: $('cli-responsavel').value.trim(),
            whatsapp: $('cli-telefone').value.trim(),
            cidade: $('cli-cidade').value.trim()
        };

        if (lojaEditandoId) {
            const loja = lojasCadastradas.find(l => l.id === lojaEditandoId);
            if (loja) Object.assign(loja, dados);
            if (lojaAtualId === lojaEditandoId) atualizarCabecalhoLoja(loja);
        } else {
            lojasCadastradas.push({ id: Date.now(), ...dados, produtos: [] });
            buscaCliente.value = '';
        }

        salvarBanco();
        modalCliente.classList.add('hidden');
        renderizarClientes(buscaCliente.value);
    });

    // ---------- PRODUTOS ----------
    function atualizarCabecalhoLoja(loja) {
        $('titulo-loja-selecionada').textContent = loja.nomeLoja;
        $('subtitulo-loja-selecionada').textContent = `Responsável: ${loja.responsavel} • ${loja.whatsapp}`;
        $('link-cardapio').href = `../index.html?loja=${loja.id}`;
    }

    function abrirProdutosCliente(id) {
        lojaAtualId = id;
        const loja = lojaAtual();
        if (!loja) return;

        atualizarCabecalhoLoja(loja);
        $('view-clientes').classList.add('hidden');
        $('view-produtos').classList.remove('hidden');
        renderizarTabelaProdutos(loja);
    }

    function voltarParaClientes() {
        lojaAtualId = null;
        $('view-produtos').classList.add('hidden');
        $('view-clientes').classList.remove('hidden');
        renderizarClientes(buscaCliente.value);
    }

    function renderizarTabelaProdutos(loja) {
        const tbody = $('tabela-produtos-body');
        tbody.innerHTML = '';

        if (!loja.produtos.length) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#78746E">Nenhum produto ajustado no CRM. Clique em “+ Adicionar Produto”.</td></tr>';
            return;
        }

        loja.produtos.forEach(prod => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${prod.id}</td>
                <td><strong>${esc(prod.nome)}</strong></td>
                <td>${esc(prod.categoria)}</td>
                <td>${reais(prod.preco)}</td>
                <td>
                    <input type="text" inputmode="numeric" class="input-preco-edit input-moeda" id="preco-input-${prod.id}" value="${reais(prod.preco)}">
                </td>
                <td>
                    <select class="input-preco-edit" id="status-select-${prod.id}">
                        <option value="true" ${prod.ativo ? 'selected' : ''}>Ativo</option>
                        <option value="false" ${!prod.ativo ? 'selected' : ''}>Pausado</option>
                    </select>
                </td>
                <td>
                    <div class="acoes-produto">
                        <button class="btn-salvar-preco" data-acao="salvar" data-prod-id="${prod.id}">Salvar</button>
                        <button class="btn-outline btn-sm" data-acao="editar" data-prod-id="${prod.id}">Editar</button>
                        <button class="btn-outline btn-sm btn-excluir" data-acao="excluir" data-prod-id="${prod.id}">Excluir</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    $('tabela-produtos-body').addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn || !btn.dataset.acao) return;

        const loja = lojaAtual();
        const prodId = Number(btn.dataset.prodId);
        const produto = loja && loja.produtos.find(p => p.id === prodId);
        if (!produto) return;

        if (btn.dataset.acao === 'salvar') {
            const novoPreco = valorNumerico($(`preco-input-${prodId}`));
            const novoStatus = $(`status-select-${prodId}`).value === 'true';

            if (isNaN(novoPreco) || novoPreco < 0) {
                alert('Digite um valor numérico válido para o preço.');
                return;
            }

            produto.preco = novoPreco;
            produto.ativo = novoStatus;
            salvarBanco();
            renderizarTabelaProdutos(loja);
            mostrarToast(`Preço de "${produto.nome}" atualizado para ${reais(novoPreco)}!`);
        }

        if (btn.dataset.acao === 'editar') abrirModalProduto(produto);

        if (btn.dataset.acao === 'excluir' && confirm(`Excluir o produto "${produto.nome}"?`)) {
            loja.produtos = loja.produtos.filter(p => p.id !== prodId);
            salvarBanco();
            renderizarTabelaProdutos(loja);
            mostrarToast(`Produto "${produto.nome}" excluído.`);
        }
    });

    function mostrarToast(msg) {
        const toast = $('toast-sucesso');
        toast.textContent = msg;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3000);
    }

    const modalProduto = $('modal-produto');
    const formProduto = $('form-novo-produto');

    function abrirModalProduto(produto = null) {
        produtoEditandoId = produto ? produto.id : null;
        formProduto.reset();
        $('modal-produto-titulo').textContent = produto ? 'Editar Produto' : 'Novo Produto no Cardápio';

        if (produto) {
            $('prod-nome').value = produto.nome;
            $('prod-categoria').value = produto.categoria;
            $('prod-preco').value = reais(produto.preco);
            $('prod-imagem').value = produto.imagem || '';
        }
        modalProduto.classList.remove('hidden');
    }

    $('btn-novo-produto').addEventListener('click', () => abrirModalProduto());
    $('btn-fechar-modal').addEventListener('click', () => modalProduto.classList.add('hidden'));

    formProduto.addEventListener('submit', (e) => {
        e.preventDefault();
        const loja = lojaAtual();
        if (!loja) return;

        const nome = $('prod-nome').value.trim();
        const categoria = $('prod-categoria').value;
        const preco = valorNumerico($('prod-preco'));
        const imagem = $('prod-imagem').value.trim();
        if (isNaN(preco)) { alert('Digite um preço válido.'); return; }

        if (produtoEditandoId) {
            const produto = loja.produtos.find(p => p.id === produtoEditandoId);
            if (produto) Object.assign(produto, { nome, categoria, preco, imagem });
            mostrarToast(`Produto "${nome}" atualizado!`);
        } else {
            loja.produtos.push({ id: Date.now(), nome, categoria, preco, imagem, ativo: true });
            mostrarToast(`Produto "${nome}" adicionado com sucesso!`);
        }

        salvarBanco();
        renderizarTabelaProdutos(loja);
        modalProduto.classList.add('hidden');
    });

    // ---------- BACKUP (exportar / importar) ----------
    $('btn-exportar').addEventListener('click', () => {
        const conteudo = JSON.stringify({ app: 'onyx', versao: 1, lojas: lojasCadastradas }, null, 2);
        const blob = new Blob([conteudo], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `onyx-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    });

    $('btn-importar').addEventListener('click', () => $('input-importar').click());

    $('input-importar').addEventListener('change', (e) => {
        const arquivo = e.target.files[0];
        if (!arquivo) return;

        const leitor = new FileReader();
        leitor.onload = () => {
            try {
                const dados = JSON.parse(leitor.result);
                const lojas = Array.isArray(dados) ? dados : dados.lojas;

                const valido = Array.isArray(lojas) && lojas.every(l =>
                    l && typeof l.id === 'number' && typeof l.nomeLoja === 'string' &&
                    Array.isArray(l.produtos) &&
                    l.produtos.every(p => typeof p.id === 'number' && typeof p.nome === 'string' && typeof p.preco === 'number')
                );
                if (!valido) throw new Error('formato inválido');

                if (confirm(`Importar ${lojas.length} cliente(s)? Os dados atuais serão substituídos.`)) {
                    lojasCadastradas = lojas.map(l => ({
                        ...l,
                        responsavel: l.responsavel || '',
                        whatsapp: l.whatsapp || '',
                        cidade: l.cidade || ''
                    }));
                    salvarBanco();
                    renderizarClientes(buscaCliente.value);
                }
            } catch (err) {
                alert('Arquivo inválido. Use um backup exportado por este painel.');
            }
            e.target.value = '';
        };
        leitor.readAsText(arquivo);
    });

    // ---------- NAVEGAÇÃO POR ÂNCORAS ----------
    function entrar() {
        loginScreen.classList.add('hidden');
        dashboardScreen.classList.remove('hidden');
        rotear();
    }

    function rotear() {
        if (dashboardScreen.classList.contains('hidden')) return;
        const m = location.hash.match(/^#loja-(\d+)$/);
        if (m && lojasCadastradas.some(l => l.id === Number(m[1]))) abrirProdutosCliente(Number(m[1]));
        else voltarParaClientes();
    }

    window.addEventListener('hashchange', rotear);

    let logado = false;
    try { logado = sessionStorage.getItem(CHAVE_SESSAO) === '1'; } catch (e) {}
    if (logado) entrar();
});
