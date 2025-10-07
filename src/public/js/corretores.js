// corretores.js - Sistema de gestão de corretores (versão simplificada)
let corretores = [];
let corretorEditando = null;
let paginaAtual = 1;
let termoPesquisa = '';
let corretorParaExcluir = null;

// Cache de elementos DOM
const elementos = {
    modalNovoCorretor: document.getElementById('modal-novo-corretor'),
    modalConfirmacao: document.getElementById('modal-confirmacao'),
    abrirModalBtn: document.getElementById('abrir-modal'),
    fecharModalBtn: document.getElementById('fechar-modal'),
    formCorretor: document.getElementById('form-corretor'),
    tabelaCorretores: document.getElementById('tabela-corretores'),
    totalCorretoresSpan: document.getElementById('total-corretores'),
    dataElement: document.getElementById('data-atual'),
    themeToggleBtn: document.getElementById('theme-toggle'),
    themeToggleDarkIcon: document.getElementById('theme-toggle-dark-icon'),
    themeToggleLightIcon: document.getElementById('theme-toggle-light-icon'),
    searchResultsBar: document.getElementById('search-results-bar'),
    searchResultsCount: document.getElementById('search-results-count'),
    searchQueryText: document.getElementById('search-query-text'),
    clearSearchBtn: document.getElementById('clear-search'),
    searchInput: document.getElementById('search-input'),
    searchButton: document.getElementById('search-button')
};

// Inicialização
document.addEventListener('DOMContentLoaded', inicializarSistema);

function inicializarSistema() {
    carregarCorretores();
    atualizarData();
    configurarEventListeners();
    configurarTema();
}

// Configurar event listeners unificados
function configurarEventListeners() {
    const { abrirModalBtn, fecharModalBtn, formCorretor, modalNovoCorretor, clearSearchBtn, searchInput, searchButton } = elementos;
    
    if (abrirModalBtn) {
        abrirModalBtn.addEventListener('click', () => abrirModal());
    }
    
    if (fecharModalBtn) {
        fecharModalBtn.addEventListener('click', fecharModal);
    }
    
    if (formCorretor) {
        formCorretor.addEventListener('submit', salvarCorretor);
    }
    
    if (modalNovoCorretor) {
        modalNovoCorretor.addEventListener('click', (e) => {
            if (e.target === modalNovoCorretor) fecharModal();
        });
    }

    if (elementos.modalConfirmacao) {
        elementos.modalConfirmacao.addEventListener('click', (e) => {
            if (e.target === elementos.modalConfirmacao) fecharModalConfirmacao();
        });
    }

    // Eventos da tabela (delegação unificada)
    if (elementos.tabelaCorretores) {
        elementos.tabelaCorretores.addEventListener('click', (e) => {
            const { target } = e;
            
            if (target.classList.contains('editar-corretor')) {
                const id = parseInt(target.getAttribute('data-id'));
                const corretor = corretores.find(c => c.id === id);
                if (corretor) abrirModal(corretor);
            }
            
            if (target.classList.contains('excluir-corretor')) {
                const id = parseInt(target.getAttribute('data-id'));
                abrirModalConfirmacao(id);
            }
        });
    }

    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', limparPesquisa);
    }

    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            const termo = e.target.value;
            if (e.key === "Enter" && termo === "") {
                carregarCorretores();
                return;
            } else if (e.key === "Enter") {
                pesquisarCorretores(termo);
            }
        });
    }

    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const termo = searchInput.value;
            pesquisarCorretores(termo);
        });
    }

    // Botão de excluir no modal de confirmação
    const btnConfirmarExclusao = document.querySelector('#modal-confirmacao button.bg-red-600');
    if (btnConfirmarExclusao) {
        btnConfirmarExclusao.addEventListener('click', confirmarExclusao);
    }

    // Botão de cancelar no modal de confirmação
    const btnCancelarExclusao = document.querySelector('#modal-confirmacao button.border-gray-300');
    if (btnCancelarExclusao) {
        btnCancelarExclusao.addEventListener('click', fecharModalConfirmacao);
    }
}

// Função unificada para carregar corretores
function carregarCorretores(page = 1) {
    paginaAtual = page;
    
    try {
        // Integração com API - ajustar conforme sua implementação real
        if (typeof api !== 'undefined' && api.syncBrokersPgRequest) {
            api.syncBrokersPgRequest(paginaAtual);
            api.syncBrokersPgResponse((_, data) => {
                if (data && data.registers) {
                    corretores = data.registers;
                    renderizarTabelaCorretores();
                    
                    // Atualizar paginação com dados reais da API
                    if (data.totalPages && data.currentPage) {
                        atualizarPaginacao(data.currentPage, data.totalPages);
                    }
                }
            });
        } else {
            // Fallback para dados locais
            carregarCorretoresDoLocalStorage();
        }
    } catch (error) {
        console.error('Erro ao buscar corretores da API:', error);
        carregarCorretoresDoLocalStorage();
    }
}

function carregarCorretoresDoLocalStorage() {
    const corretoresSalvos = localStorage.getItem('paymate_corretores');
    if (corretoresSalvos) {
        corretores = JSON.parse(corretoresSalvos);
        renderizarTabelaCorretores();
    }
}

// Função unificada para renderizar tabela
function renderizarTabelaCorretores(corretoresParaExibir = null) {
    const { tabelaCorretores, totalCorretoresSpan } = elementos;
    if (!tabelaCorretores || !totalCorretoresSpan) return;
    
    const corretoresExibicao = corretoresParaExibir || corretores;
    
    tabelaCorretores.innerHTML = '';
    totalCorretoresSpan.textContent = corretores.length;
    
    if (corretoresExibicao.length === 0) {
        tabelaCorretores.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    ${corretoresParaExibir ? 'Nenhum corretor encontrado.' : 'Nenhum corretor cadastrado.'}
                </td>
            </tr>
        `;
        return;
    }
    
    const fragment = document.createDocumentFragment();
    
    corretoresExibicao.forEach(corretor => {
        fragment.appendChild(criarLinhaCorretor(corretor));
    });
    
    tabelaCorretores.appendChild(fragment);
}

// Função unificada para criar linha de corretor
function criarLinhaCorretor(corretor) {
    const row = document.createElement('tr');
    const iniciais = corretor.nome.split(' ').map(n => n[0] || '').join('').toUpperCase().substring(0, 2);
    const statusClass = corretor.status === 'ativo' 
        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    const statusText = corretor.status === 'ativo' ? 'Ativo' : 'Inativo';
    
    row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white">
                        ${iniciais}
                    </div>
                </div>
                <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">${corretor.nome}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">${corretor.email || 'Email não informado'}</div>
                </div>
            </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
            ${formatarCPF(corretor.cpf) || 'CPF não informado'}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900 dark:text-white">${corretor.email || 'Email não informado'}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">${formatarTelefone(corretor.telefone) || 'Telefone não informado'}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
            ${corretor.comissao || '0%'}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                ${statusText}
            </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3 editar-corretor" data-id="${corretor.id}">
                Editar
            </button>
            <button class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 excluir-corretor" data-id="${corretor.id}">
                Excluir
            </button>
        </td>
    `;
    
    return row;
}

// Funções de modal
function abrirModal(corretor = null) {
    corretorEditando = corretor;
    const { formCorretor, modalNovoCorretor } = elementos;
    
    if (!formCorretor || !modalNovoCorretor) return;
    
    formCorretor.reset();
    
    if (corretor) {
        preencherFormularioCorretor(corretor);
        document.getElementById('modal-titulo').textContent = 'Editar Corretor';
        document.getElementById('status-field').classList.remove('hidden');
        document.querySelector('#form-corretor button[type="submit"]').textContent = 'Atualizar Corretor';
    } else {
        document.getElementById('modal-titulo').textContent = 'Novo Corretor';
        document.getElementById('status-field').classList.add('hidden');
        document.querySelector('#form-corretor button[type="submit"]').textContent = 'Cadastrar Corretor';
    }
    
    modalNovoCorretor.classList.remove('hidden');
}

function preencherFormularioCorretor(corretor) {
    const campos = {
        nome: document.getElementById('nome-corretor'),
        cpf: document.getElementById('cpf-cnpj'),
        email: document.getElementById('email-corretor'),
        telefone: document.getElementById('telefone-corretor'),
        comissao: document.getElementById('comissao-corretor'),
        status: document.getElementById('status-corretor'),
        id: document.getElementById('corretor-id')
    };
    
    if (campos.nome) campos.nome.value = corretor.nome || '';
    if (campos.cpf) campos.cpf.value = corretor.cpf || '';
    if (campos.email) campos.email.value = corretor.email || '';
    if (campos.telefone) campos.telefone.value = corretor.telefone || '';
    if (campos.comissao) {
        const comissaoNumerica = parseFloat(corretor.comissao) || '';
        campos.comissao.value = comissaoNumerica;
    }
    if (campos.status) campos.status.value = corretor.status || 'ativo';
    if (campos.id) campos.id.value = corretor.id || '';
}

function fecharModal() {
    if (elementos.modalNovoCorretor) {
        elementos.modalNovoCorretor.classList.add('hidden');
    }
    corretorEditando = null;
}

function abrirModalConfirmacao(id) {
    corretorParaExcluir = id;
    if (elementos.modalConfirmacao) {
        elementos.modalConfirmacao.classList.remove('hidden');
    }
}

function fecharModalConfirmacao() {
    if (elementos.modalConfirmacao) {
        elementos.modalConfirmacao.classList.add('hidden');
    }
    corretorParaExcluir = null;
}

function confirmarExclusao() {
    if (corretorParaExcluir) {
        excluirCorretor(corretorParaExcluir);
        fecharModalConfirmacao();
    }
}

function salvarCorretor(e) {
    e.preventDefault();
    
    const formData = new FormData(elementos.formCorretor);
    const corretor = {
        nome: formData.get('nome') || document.getElementById('nome-corretor').value,
        cpf: formData.get('cpf') || document.getElementById('cpf-cnpj').value,
        email: formData.get('email') || document.getElementById('email-corretor').value,
        telefone: formData.get('telefone') || document.getElementById('telefone-corretor').value,
        comissao: (formData.get('comissao') || document.getElementById('comissao-corretor').value) + '%',
        status: formData.get('status') || 'ativo',
        id: corretorEditando ? corretorEditando.id : Date.now()
    };
    
    // Validação simplificada - apenas verifica se o nome existe
    if (!corretor.nome || corretor.nome.trim() === '') {
        alert('Nome é obrigatório!');
        return;
    }
    
    if (corretorEditando) {
        const index = corretores.findIndex(c => c.id === corretorEditando.id);
        if (index !== -1) {
            corretores[index] = { ...corretores[index], ...corretor };
        }
    } else {
        corretores.push(corretor);
    }
    
    salvarCorretoresNoStorage();
    renderizarTabelaCorretores();
    fecharModal();
}

function validarCorretor(corretor) {
    if (!corretor.nome || corretor.nome.trim() === '') {
        alert('Nome é obrigatório!');
        return false;
    }
    
    if (corretor.cpf && !validarCPF(corretor.cpf)) {
        alert('CPF inválido!');
        return false;
    }
    
    if (corretor.email && !validarEmail(corretor.email)) {
        alert('E-mail inválido!');
        return false;
    }
    
    return true;
}

function pesquisarCorretores(termo) {
    termoPesquisa = termo.trim().toLowerCase();
    
    if (termoPesquisa) {
        // Mostrar barra de resultados
        if (elementos.searchResultsBar) {
            elementos.searchResultsBar.classList.remove('hidden');
            elementos.searchResultsBar.classList.add('fade-in');
        }
        if (elementos.searchQueryText) {
            elementos.searchQueryText.textContent = `"${termoPesquisa}"`;
        }
        
        // Buscar via API ou localmente
        if (typeof api !== 'undefined' && api.searchBrokerByNameRequest) {
            api.searchBrokerByNameRequest(termoPesquisa);
            api.searchBrokerByNameResponse((_, data) => {
                if (elementos.searchResultsCount) {
                    elementos.searchResultsCount.textContent = 
                        `${data.length} ${data.length === 1 ? 'corretor encontrado' : 'corretores encontrados'}`;
                }
                renderizarTabelaCorretores(data);
            });
        } else {
            // Busca local
            const resultados = corretores.filter(corretor => 
                corretor.nome.toLowerCase().includes(termoPesquisa) ||
                (corretor.cpf && corretor.cpf.toLowerCase().includes(termoPesquisa)) ||
                (corretor.email && corretor.email.toLowerCase().includes(termoPesquisa))
            );
            
            if (elementos.searchResultsCount) {
                elementos.searchResultsCount.textContent = 
                    `${resultados.length} ${resultados.length === 1 ? 'corretor encontrado' : 'corretores encontrados'}`;
            }
            renderizarTabelaCorretores(resultados);
        }
    } else {
        limparPesquisa();
    }
}

function limparPesquisa() {
    if (elementos.searchInput) {
        elementos.searchInput.value = '';
    }
    termoPesquisa = '';
    if (elementos.searchResultsBar) {
        elementos.searchResultsBar.classList.add('hidden');
    }
    carregarCorretores();
}

function atualizarData() {
    const { dataElement } = elementos;
    if (!dataElement) return;
    
    const hoje = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    dataElement.textContent = hoje.toLocaleDateString('pt-BR', options);
}

function excluirCorretor(id) {
    corretores = corretores.filter(corretor => corretor.id !== id);
    salvarCorretores();
    renderizarTabelaCorretores();
}

function salvarCorretores() {
    localStorage.setItem('paymate_corretores', JSON.stringify(corretores));
}

// Funções de validação e formatação (reutilizadas do clientes.js)
function validarCPF(cpf) {
    if (!cpf) return true; // CPF não é obrigatório
    cpf = cpf.replace(/\D/g, '');
    return cpf.length === 11;
}

function validarEmail(email) {
    if (!email) return true; // Email não é obrigatório
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function formatarCPF(cpf) {
    if (!cpf) return '';
    cpf = cpf.replace(/\D/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatarTelefone(telefone) {
    if (!telefone) return '';
    const numeros = telefone.replace(/\D/g, '');
    
    if (numeros.length === 10) {
        return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (numeros.length === 11) {
        return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    
    return telefone;
}

function configurarTema() {
    const { themeToggleBtn, themeToggleDarkIcon, themeToggleLightIcon } = elementos;
    if (!themeToggleBtn || !themeToggleDarkIcon || !themeToggleLightIcon) return;
    
    const isDark = localStorage.getItem('color-theme') === 'dark' || 
                  (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
        document.documentElement.classList.add('dark');
        themeToggleLightIcon.classList.remove('hidden');
        themeToggleDarkIcon.classList.add('hidden');
    } else {
        document.documentElement.classList.remove('dark');
        themeToggleDarkIcon.classList.remove('hidden');
        themeToggleLightIcon.classList.add('hidden');
    }
    
    themeToggleBtn.addEventListener('click', () => {
        themeToggleDarkIcon.classList.toggle('hidden');
        themeToggleLightIcon.classList.toggle('hidden');
        
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        }
    });
}

// Função para atualizar paginação (similar à do clientes.js)
function atualizarPaginacao(paginaAtual, totalPaginas) {
    const sectCorretores = document.getElementById('paginationCorretores');
    if (!sectCorretores) return;
    
    sectCorretores.innerHTML = '';
    
    // Implementar lógica de paginação similar à do clientes.js
    console.log(`Paginação corretores: Página ${paginaAtual} de ${totalPaginas}`);
}