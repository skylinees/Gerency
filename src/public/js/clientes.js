// clientes.js - Sistema de gestão de clientes (versão simplificada)
let clientes = [];
let clienteEditando = null;
let clienteParaExcluir = null;
let paginaAtual = 1;

// Cache de elementos DOM
const elementos = {
    modalNovoCliente: document.getElementById('modal-novo-cliente'),
    abrirModalBtn: document.getElementById('abrir-modal'),
    fecharModalBtn: document.getElementById('fechar-modal'),
    formCliente: document.getElementById('form-cliente'),
    tabelaClientes: document.getElementById('tabela-clientes'),
    totalClientesSpan: document.getElementById('total-clientes'),
    selectTipo: document.querySelector('select[name="tipo"]'),
    dataElement: document.getElementById('data-atual'),
    themeToggleBtn: document.getElementById('theme-toggle'),
    themeToggleDarkIcon: document.getElementById('theme-toggle-dark-icon'),
    themeToggleLightIcon: document.getElementById('theme-toggle-light-icon'),
    sectClient: document.querySelector("#paginationClients")
    
};
function mostrarMensagemModal(texto) {
    const modal = document.getElementById('modal-mensagem');
    const textoDiv = document.getElementById('modal-mensagem-texto');
    textoDiv.textContent = texto;
    modal.classList.remove('hidden');
}

function fecharMensagemModal() {
    const modal = document.getElementById('modal-mensagem');
    modal.classList.add('hidden');
}
// Event listener para botão de fechar
document.addEventListener('DOMContentLoaded', () => {
    const btnFechar = document.getElementById('btn-fechar-mensagem');
    if (btnFechar) btnFechar.addEventListener('click', fecharMensagemModal);
});
// Inicialização
document.addEventListener('DOMContentLoaded', inicializarSistema);

function inicializarSistema() {
    renderPagination(); // Renderizar paginação inicial
    carregarClientes();
    atualizarData();
    configurarEventListeners();
    configurarTema();
    adicionarCampoBusca();

    const btnCancelar = document.getElementById('btn-cancelar-exclusao-cliente');
    const btnConfirmar = document.getElementById('btn-confirmar-exclusao-cliente');

    if (btnCancelar) btnCancelar.addEventListener('click', fecharModalConfirmacaoCliente);
    if (btnConfirmar) btnConfirmar.addEventListener('click', confirmarExclusaoCliente);
    
}

function configurarEventListeners() {
    const { abrirModalBtn, fecharModalBtn, selectTipo, formCliente, modalNovoCliente, sectClient } = elementos;
    
    abrirModalBtn.addEventListener('click', () => abrirModal());
    fecharModalBtn.addEventListener('click', fecharModal);
    selectTipo.addEventListener('change', alternarCamposTipoCliente);
    formCliente.addEventListener('submit', salvarCliente);
    
    modalNovoCliente.addEventListener('click', (e) => {
        if (e.target === modalNovoCliente) fecharModal();
    });

    // Paginação
    sectClient.addEventListener("click", (event) => {
        if (event.target.matches(".btn-genereted")) {
            let page = event.target;
            console.log("CLICOU EM ", page.value, "NA PAGINAÇÃO");
            renderPagination(page);
            carregarClientes(parseInt(page.value));
        }
    });

    // Eventos da tabela (delegação unificada) - ATUALIZADA
    elementos.tabelaClientes.addEventListener('click', (e) => {
        const { target } = e;
        
        if (target.classList.contains('editar-cliente')) {
            const id = parseInt(target.getAttribute('data-id'));
            const cliente = clientes.find(c => c.id === id);
            if (cliente) abrirModal(cliente);
            
            // EXTRAIR DADOS DO CLIENTE
            const dadosCliente = extrairDadosCliente(target);
            console.log('Dados do cliente para edição:', dadosCliente);
        }
        
        if (target.classList.contains('excluir-cliente')) {
            const id = parseInt(target.getAttribute('data-id'));
            const dadosCliente = extrairDadosCliente(target);
            console.log('Dados do cliente para exclusão:', dadosCliente);
            abrirModalConfirmacaoCliente(id); // Corrigido: passa o id
        }
        
        // NOVO: Capturar clique em qualquer lugar da linha para debug
        if (target.matches('td') || target.matches('div') || target.matches('span')) {
            const linha = target.closest('tr');
            if (linha && !target.closest('button')) {
                const dadosCliente = extrairDadosCliente(target);
                console.log('Dados do cliente (clique na linha):', dadosCliente);
            }
        }
    });
}
// FUNÇÃO DE PAGINAÇÃO RESTAURADA (MÉTODO ORIGINAL)
function renderPagination(page = null) {
    const sectClient = elementos.sectClient;
    
    // Limpar paginação existente
    sectClient.innerHTML = '';
    
    // Aqui você pode implementar a lógica de paginação baseada nos dados da API
    // Exemplo básico - ajuste conforme sua necessidade real
    const totalPages = 5; // Isso deve vir da API
    const currentPage = page ? parseInt(page.value) : 1;
    
    // Botão Anterior
    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.className = 'btn-genereted px-3 py-1 mx-1 border rounded';
        prevButton.value = currentPage - 1;
        prevButton.textContent = 'Anterior';
        sectClient.appendChild(prevButton);
    }
    
    // Botões de página
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = `btn-genereted px-3 py-1 mx-1 border rounded ${i === currentPage ? 'bg-blue-500 text-white' : ''}`;
        pageButton.value = i;
        pageButton.textContent = i;
        sectClient.appendChild(pageButton);
    }
    
    // Botão Próximo
    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.className = 'btn-genereted px-3 py-1 mx-1 border rounded';
        nextButton.value = currentPage + 1;
        nextButton.textContent = 'Próximo';
        sectClient.appendChild(nextButton);
    }
}

// Função unificada para carregar clientes
function carregarClientes(page = 1) {
    paginaAtual = page;
    
    try {
        api.syncClientsPgRequest(paginaAtual);
        api.syncClientsPgResponse((_, data) => {
            if (data && data.registers) {
                clientes = data.registers;
                renderizarTabelaClientes();
                
                // Atualizar paginação com dados reais da API
                if (data.totalPages && data.currentPage) {
                    atualizarPaginacao(data.currentPage, data.totalPages);
                }
            }
        });
    } catch (error) {
        console.error('Erro ao buscar clientes da API:', error);
        carregarClientesDoLocalStorage();
    }
}

// Função para atualizar a paginação com dados da API
function atualizarPaginacao(paginaAtual, totalPaginas) {
    const sectClient = elementos.sectClient;
    
    // Limpar paginação existente
    sectClient.innerHTML = '';
    
    console.log(`Paginação: Página ${paginaAtual} de ${totalPaginas}`);
    
    // Botão Anterior
    if (paginaAtual > 1) {
        const prevButton = document.createElement('button');
        prevButton.className = 'btn-genereted px-3 py-2 mx-1 border rounded bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600';
        prevButton.value = paginaAtual - 1;
        prevButton.textContent = '‹ Anterior';
        sectClient.appendChild(prevButton);
    }
    
    // Botões de página numérica
    const inicio = Math.max(1, paginaAtual - 2);
    const fim = Math.min(totalPaginas, paginaAtual + 2);
    
    for (let i = inicio; i <= fim; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = `btn-genereted px-4 py-2 mx-1 border rounded ${
            i === paginaAtual 
                ? 'bg-blue-500 text-white border-blue-500' 
                : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
        }`;
        pageButton.value = i;
        pageButton.textContent = i;
        sectClient.appendChild(pageButton);
    }
    
    // Botão Próximo
    if (paginaAtual < totalPaginas) {
        const nextButton = document.createElement('button');
        nextButton.className = 'btn-genereted px-3 py-2 mx-1 border rounded bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600';
        nextButton.value = paginaAtual + 1;
        nextButton.textContent = 'Próximo ›';
        sectClient.appendChild(nextButton);
    }
}

function carregarClientesDoLocalStorage() {
    const clientesSalvos = localStorage.getItem('paymate_clientes');
    if (clientesSalvos) {
        clientes = JSON.parse(clientesSalvos);
        renderizarTabelaClientes();
    }
}

// Função unificada para renderizar tabela
function renderizarTabelaClientes(clientesParaExibir = null) {
    const { tabelaClientes, totalClientesSpan } = elementos;
    const clientesExibicao = clientesParaExibir || clientes;
    
    tabelaClientes.innerHTML = '';
    totalClientesSpan.textContent = clientesExibicao.length;
    
    if (clientesExibicao.length === 0) {
        tabelaClientes.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    ${clientesParaExibir ? 'Nenhum cliente encontrado.' : 'Nenhum cliente cadastrado.'}
                </td>
            </tr>
        `;
        return;
    }
    
    const fragment = document.createDocumentFragment();
    
    clientesExibicao.forEach(cliente => {
        fragment.appendChild(criarLinhaCliente(cliente));
    });
    
    tabelaClientes.appendChild(fragment);
}

// Função unificada para criar linha de cliente
function criarLinhaCliente(cliente) {
    const row = document.createElement('tr');
    const nomeExibicao = cliente.nome || cliente.razao_social || 'Nome não informado';
    const documentoExibicao = cliente.tipo === 'PF' ? 
        formatarCPF(cliente.cpf) : 
        formatarCNPJ(cliente.cnpj);
    
    const iniciais = nomeExibicao.split(" ")
        .map(nome => nome[0] || '')
        .join('')
        .toUpperCase()
        .substring(0, 2);
    
    row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white">
                        ${iniciais}
                    </div>
                </div>
                <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">${nomeExibicao}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">${cliente.email || 'Email não informado'}</div>
                </div>
            </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900 dark:text-white">${cliente.email || 'Email não informado'}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">${formatarTelefone(cliente.telefone) || 'Telefone não informado'}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
            ${documentoExibicao || 'Documento não informado'}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
            ${cliente.tipo === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                ${cliente.status || 'Ativo'}
            </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3 editar-cliente" data-id="${cliente.id}">
                Editar
            </button>
            <button class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 excluir-cliente" data-id="${cliente.id}">
                Excluir
            </button>
        </td>
    `;
    
    return row;
}

// Resto do código mantido igual...
// [As funções abrirModal, preencherFormularioCliente, fecharModal, salvarCliente, validarCliente, 
//  adicionarCampoBusca, buscarClientesPorNome, alternarCamposTipoCliente, atualizarData, 
//  excluirCliente, salvarClientesNoStorage, validarCPF, validarCNPJ, validarEmail, 
//  formatarCPF, formatarCNPJ, formatarTelefone, configurarTema permanecem exatamente como estavam]

// Funções de modal
function abrirModal(cliente = null) {
    clienteEditando = cliente;
    const { formCliente, selectTipo, modalNovoCliente } = elementos;
    
    formCliente.reset();
    
    if (cliente) {
        selectTipo.value = cliente.tipo;
        preencherFormularioCliente(cliente);
        document.querySelector('button[type="submit"]').textContent = 'Atualizar Cliente';
    } else {
        selectTipo.value = 'PF';
        document.querySelector('button[type="submit"]').textContent = 'Cadastrar Cliente';
    }
    
    alternarCamposTipoCliente();
    modalNovoCliente.classList.remove('hidden');
}

function preencherFormularioCliente(cliente) {
    const campos = {
        nome: document.querySelector('input[name="nome"]'),
        cpf: document.querySelector('input[name="cpf"]'),
        razao_social: document.querySelector('input[name="razao_social"]'),
        cnpj: document.querySelector('input[name="cnpj"]'),
        email: document.querySelector('input[name="email"]'),
        telefone: document.querySelector('input[name="telefone"]')
    };
    
    if (cliente.tipo === 'PF') {
        campos.nome.value = cliente.nome || '';
        campos.cpf.value = cliente.cpf || '';
    } else {
        campos.razao_social.value = cliente.razao_social || '';
        campos.cnpj.value = cliente.cnpj || '';
    }
    
    campos.email.value = cliente.email || '';
    campos.telefone.value = cliente.telefone || '';
}

function fecharModal() {
    elementos.modalNovoCliente.classList.add('hidden');
    clienteEditando = null;
}

// criei aqui
function abrirModalConfirmacaoCliente(id) {
    clienteParaExcluir = id;
    const modal = document.getElementById('modal-confirmacao-cliente');
    if (modal) modal.classList.remove('hidden');
}
function fecharModalConfirmacaoCliente() {
    const modal = document.getElementById('modal-confirmacao-cliente');
    if (modal) modal.classList.add('hidden');
    clienteParaExcluir = null;
}
// Event listeners do modal
//document.getElementById('btn-cancelar-exclusao-cliente').addEventListener('click', fecharModalConfirmacaoCliente);
//document.getElementById('btn-confirmar-exclusao-cliente').addEventListener('click', confirmarExclusaoCliente);

function confirmarExclusaoCliente() {
    if (clienteParaExcluir !== null) {
        excluirCliente(clienteParaExcluir);
        fecharModalConfirmacaoCliente();
    }
}
function salvarCliente(e) {
    e.preventDefault();
    
    const formData = new FormData(elementos.formCliente);
    const cliente = {
        tipo: formData.get('tipo'),
        nome: formData.get('nome'),
        razao_social: formData.get('razao_social'),
        cpf: formData.get('cpf'),
        cnpj: formData.get('cnpj'),
        email: formData.get('email'),
        telefone: formData.get('telefone'),
        status: 'Ativo',
        id: clienteEditando ? clienteEditando.id : Date.now()
    };
    
    if (!validarCliente(cliente)) return;
    
    if (clienteEditando) {
        const index = clientes.findIndex(c => c.id === clienteEditando.id);
        if (index !== -1) clientes[index] = cliente;
    } else {
        clientes.push(cliente);
    }
    
    salvarClientesNoStorage();
    renderizarTabelaClientes();
    fecharModal();
}

function validarCliente(cliente) {
    if (cliente.tipo === 'PF' && !validarCPF(cliente.cpf)) {
        alert('CPF inválido!');
        return false;
    }
    
    if (cliente.tipo === 'PJ' && !validarCNPJ(cliente.cnpj)) {
        alert('CNPJ inválido!');
        return false;
    }
    
    if (!validarEmail(cliente.email)) {
        alert('E-mail inválido!');
        return false;
    }
    
    return true;
}

function adicionarCampoBusca() {
    if (document.getElementById('campo-busca-clientes')) return;
    
    const header = document.querySelector('.mb-6.flex.justify-between.items-center');
    const buscaContainer = document.createElement('div');
    buscaContainer.className = 'flex items-center mt-4';
    buscaContainer.innerHTML = `
        <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input 
                type="text" 
                id="campo-busca-clientes" 
                placeholder="Buscar clientes por nome..." 
                class="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600"
            >
        </div>
        <button id="limpar-busca" class="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hidden">
            Limpar
        </button>
    `;
    
    header.parentNode.insertBefore(buscaContainer, header.nextSibling);
    
    const campoBusca = document.getElementById('campo-busca-clientes');
    const btnLimpar = document.getElementById('limpar-busca');
    
    campoBusca.addEventListener('keyup', (e) => {
        const termo = e.target.value;
        if(e.key == "Enter" && termo == ""){
            carregarClientes()
            return
        }else if(e.key == "Enter"){
            console.log("valor de input recebido...", termo)
            buscarClientesPorNome(termo);
            renderizarTabelaClientes(resultados);
            removePagination()
        }
        
        btnLimpar.classList.toggle('hidden', termo.trim() === '');
    });
    
    btnLimpar.addEventListener('click', () => {
        campoBusca.value = '';
        btnLimpar.classList.add('hidden');
        renderizarTabelaClientes();
    });
}


//aqui para fazer a função de busca
function buscarClientesPorNome(termo) {
    api.searchClientByNameRequest(termo)
    api.searchClientByNameResponse((_, data) =>{
        console.log("RESULTADO DO GET DE CLIENTE POR NOME",data)
        renderizarTabelaClientes(data);
    })
}
//

function alternarCamposTipoCliente() {
    const tipo = elementos.selectTipo.value;
    const isPF = tipo === 'PF';
    const campos = {
        nome: document.getElementById('nome-container'),
        razaoSocial: document.getElementById('razao-social-container'),
        cpf: document.getElementById('cpf-container'),
        cnpj: document.getElementById('cnpj-container')
    };
    
    Object.entries(campos).forEach(([key, element]) => {
        if (element) {
            const shouldHide = (key === 'nome' || key === 'cpf') ? !isPF : isPF;
            element.classList.toggle('hidden', shouldHide);
        }
    });
    
    const inputs = {
        nome: document.querySelector('input[name="nome"]'),
        cpf: document.querySelector('input[name="cpf"]'),
        razao_social: document.querySelector('input[name="razao_social"]'),
        cnpj: document.querySelector('input[name="cnpj"]')
    };
    
    if (inputs.nome) inputs.nome.toggleAttribute('required', isPF);
    if (inputs.cpf) inputs.cpf.toggleAttribute('required', isPF);
    if (inputs.razao_social) inputs.razao_social.toggleAttribute('required', !isPF);
    if (inputs.cnpj) inputs.cnpj.toggleAttribute('required', !isPF);
}

function atualizarData() {
    const { dataElement } = elementos;
    const hoje = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    dataElement.textContent = hoje.toLocaleDateString('pt-BR', options);
}

function excluirCliente(id) {
    api.deleteClientRequest(id)
    api.deleteClientResponse((_, data)=>{
        if (data && data.error) {
            mostrarMensagemModal("Erro ao excluir cliente...");
        } else {
            mostrarMensagemModal("Cliente excluído com sucesso...");
            carregarClientes(paginaAtual); // Recarrega os dados reais da API
        }
    })
}

function salvarClientesNoStorage() {
    localStorage.setItem('paymate_clientes', JSON.stringify(clientes));
}

// Funções de validação e formatação
function validarCPF(cpf) {
    if (!cpf) return false;
    cpf = cpf.replace(/\D/g, '');
    return cpf.length === 11;
}

function validarCNPJ(cnpj) {
    if (!cnpj) return false;
    cnpj = cnpj.replace(/\D/g, '');
    return cnpj.length === 14;
}

function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function formatarCPF(cpf) {
    if (!cpf) return '';
    cpf = cpf.replace(/\D/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatarCNPJ(cnpj) {
    if (!cnpj) return '';
    cnpj = cnpj.replace(/\D/g, '');
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
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

// função extrair dados
function extrairDadosCliente(target) {
    
    const linhaCliente = target.closest('tr');
    
    if (!linhaCliente) {
        console.error('Linha do cliente não encontrada');
        return null;
    }
    
    // Extrair dados das células
    const celulas = linhaCliente.querySelectorAll('td');
    
    // Nome e Email (primeira célula)
    const primeiraCelula = celulas[0];
    const nome = primeiraCelula.querySelector('.text-sm.font-medium')?.textContent || '';
    const email = primeiraCelula.querySelector('.text-sm.text-gray-500')?.textContent || '';
    
    // Telefone (segunda célula)
    const segundaCelula = celulas[1];
    const telefone = segundaCelula.querySelector('.text-sm.text-gray-500')?.textContent || '';
    
    // Documento (terceira célula)
    const documentoCelula = celulas[2];
    const documento = documentoCelula.textContent.trim() || '';
    
    // Tipo (quarta célula)
    const tipoCelula = celulas[3];
    const tipoTexto = tipoCelula.textContent.trim();
    const tipo = tipoTexto === 'Pessoa Física' ? 'PF' : 'PJ';
    
    // Status (quinta célula)
    const statusCelula = celulas[4];
    const status = statusCelula.querySelector('span')?.textContent.trim() || 'Ativo';
    
    // ID dos botões de ação
    const botoesAcao = celulas[5];
    const botaoEditar = botoesAcao.querySelector('.editar-cliente');
    const id = botaoEditar ? parseInt(botaoEditar.getAttribute('data-id')) : null;
    
    let cpf = '';
    let cnpj = '';
    
    if (tipo === 'PF') {
        cpf = documento.replace(/\D/g, '');
    } else {
        cnpj = documento.replace(/\D/g, '');
    }
    
    // JSON
    const dadosCliente = {
        id: id,
        tipo: tipo,
        nome: nome,
        cpf: cpf,
        cnpj: cnpj,
        email: email,
        telefone: telefone.replace(/\D/g, ''),
        status: status
    };
    
    return dadosCliente;
}