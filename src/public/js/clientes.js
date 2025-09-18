// clientes.js - Sistema de gestão de clientes
let clientes = []
let sect = document.querySelector("#paginationClients")
renderPagination()
//
sect.addEventListener("click", (event)=>{
    if(event.target.matches(".btn-genereted")){
        let page = parseInt(event.target.value);
        console.log("CLICOU EM ", page,"NA PAGINAÇÃO")
        reOrderViewButtons(page)
        carregarClientes(page)
    }
})
//
// Variáveis globais
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
    themeToggleLightIcon: document.getElementById('theme-toggle-light-icon')
};

// Inicialização
document.addEventListener('DOMContentLoaded', inicializarSistema);

function inicializarSistema() {
    carregarClientes();
    atualizarData();
    configurarEventListeners();
    configurarTema();
}

// Configurar event listeners
function configurarEventListeners() {
    const { abrirModalBtn, fecharModalBtn, selectTipo, formCliente, modalNovoCliente } = elementos;
    
    abrirModalBtn.addEventListener('click', () => abrirModal());
    fecharModalBtn.addEventListener('click', fecharModal);
    selectTipo.addEventListener('change', alternarCamposTipoCliente);
    formCliente.addEventListener('submit', salvarCliente);
    
    modalNovoCliente.addEventListener('click', (e) => {
        if (e.target === modalNovoCliente) fecharModal();
    });
}

// Configurar tema claro/escuro
function configurarTema() {
    const { themeToggleBtn, themeToggleDarkIcon, themeToggleLightIcon } = elementos;
    
    // Verificar preferência de tema
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
    
    // Alternar tema
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

// Atualizar data atual
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

// Alternar campos conforme tipo de cliente (PF/PJ)
function alternarCamposTipoCliente() {
    const tipo = elementos.selectTipo.value;
    const campos = {
        nome: document.getElementById('nome-container'),
        razaoSocial: document.getElementById('razao-social-container'),
        cpf: document.getElementById('cpf-container'),
        cnpj: document.getElementById('cnpj-container')
    };
    
    const isPF = tipo === 'PF';
    
    // Alternar visibilidade
    campos.nome.classList.toggle('hidden', !isPF);
    campos.razaoSocial.classList.toggle('hidden', isPF);
    campos.cpf.classList.toggle('hidden', !isPF);
    campos.cnpj.classList.toggle('hidden', isPF);
    
    // Alternar obrigatoriedade
    document.querySelector('input[name="nome"]').toggleAttribute('required', isPF);
    document.querySelector('input[name="cpf"]').toggleAttribute('required', isPF);
    document.querySelector('input[name="razao_social"]').toggleAttribute('required', !isPF);
    document.querySelector('input[name="cnpj"]').toggleAttribute('required', !isPF);
}

// Abrir modal para novo cliente ou edição
function abrirModal(cliente = null) {
    clienteEditando = cliente;
    const { formCliente, selectTipo, modalNovoCliente } = elementos;
    
    if (!cliente) {
        // Novo cliente
        formCliente.reset();
        selectTipo.value = 'PF';
        alternarCamposTipoCliente();
        document.querySelector('button[type="submit"]').textContent = 'Cadastrar Cliente';
    } else {
        // Editar cliente existente
        selectTipo.value = cliente.tipo;
        alternarCamposTipoCliente();
        
        // Preencher formulário
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
        document.querySelector('button[type="submit"]').textContent = 'Atualizar Cliente';
    }
    
    modalNovoCliente.classList.remove('hidden');
}

// Fechar modal
function fecharModal() {
    elementos.modalNovoCliente.classList.add('hidden');
    clienteEditando = null;
}

// Salvar cliente (novo ou edição)
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
    
    // Validações
    if (cliente.tipo === 'PF' && !validarCPF(cliente.cpf)) {
        alert('CPF inválido!');
        return;
    }
    
    if (cliente.tipo === 'PJ' && !validarCNPJ(cliente.cnpj)) {
        alert('CNPJ inválido!');
        return;
    }
    
    if (!validarEmail(cliente.email)) {
        alert('E-mail inválido!');
        return;
    }
    
    // Salvar cliente
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

// Carregar clientes do localStorage ou da API
function carregarClientes(page) {
    // Tentar carregar da API primeiro
    buscarClientesDaAPI(page);    
    // Se não houver clientes da API, carregar do localStorage
    if (clientes.length === 0) {
        const clientesSalvos = localStorage.getItem('paymate_clientes');
        if (clientesSalvos) {
            clientes = JSON.parse(clientesSalvos);
        }
    }
    
    renderizarTabelaClientes();
}

// Salvar clientes no localStorage
function salvarClientesNoStorage() {
    localStorage.setItem('paymate_clientes', JSON.stringify(clientes));
}

// Renderizar tabela de clientes
function renderizarTabelaClientes() {
    const { tabelaClientes, totalClientesSpan } = elementos;
    tabelaClientes.innerHTML = '';
    totalClientesSpan.textContent = clientes.length;
    
    if (clientes.length === 0) {
        tabelaClientes.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Nenhum cliente cadastrado.
                </td>
            </tr>
        `;
        return;
    }
    
    // Fragmento de documento para melhor performance
    const fragment = document.createDocumentFragment();
    
    clientes.forEach(cliente => {
        const row = document.createElement('tr');
        const nomeExibicao =cliente.nome
        const documentoExibicao = cliente.tipo === 'PF' ? formatarCPF(cliente.cpf) : formatarCNPJ(cliente.cnpj);
        
        // Gerar iniciais para o avatar
        const iniciais = nomeExibicao.split(" ")
            .map(nome => nome[0])
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
                        <div class="text-sm text-gray-500 dark:text-gray-400">${cliente.email}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">${cliente.email}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">${formatarTelefone(cliente.telefone)}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                ${documentoExibicao}
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
        
        fragment.appendChild(row);
    });
    
    tabelaClientes.appendChild(fragment);
    // Adicionar event listeners
    delegarEventosTabela();
}

// Delegação de eventos para melhor performance
function delegarEventosTabela() {
    elementos.tabelaClientes.addEventListener('click', (e) => {
        const { target } = e;
        
        if (target.classList.contains('editar-cliente')) {
            const id = parseInt(target.getAttribute('data-id'));
            const cliente = clientes.find(c => c.id === id);
            if (cliente) abrirModal(cliente);
        }
        
        if (target.classList.contains('excluir-cliente')) {
            const id = parseInt(target.getAttribute('data-id'));
            if (confirm('Tem certeza que deseja excluir este cliente?')) {
                excluirCliente(id);
            }
        }
    });
}

// Excluir cliente
function excluirCliente(id) {
    clientes = clientes.filter(cliente => cliente.id !== id);
    salvarClientesNoStorage();
    renderizarTabelaClientes();
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

// Função para buscar clientes da API
function buscarClientesDaAPI(page) {
    try {
        const pagina = page || 1
       api.syncClientsPgRequest(pagina);
        api.syncClientsPgResponse((_, data) => {
            clientes = data.registers;
            renderizarTabelaClientes();
        })

    } catch (error) {
        console.error('Erro ao buscar clientes da API:', error);
    }
}

console.log("CARREGAR CLIENTES DO FINAL")
//FUNÇÃO A SER UTILIZADA PARA CARREAGAR CLIENTE COM A PAGINAÇÃO
carregarClientes(3)


// Função para buscar clientes por nome
function buscarClientesPorNome(termo) {
    if (!termo || termo.trim() === '') {
        return clientes; // Retorna todos os clientes se não houver termo de busca
    }
    
    const termoLower = termo.toLowerCase().trim();
    
    // Filtrar clientes pelo nome (busca parcial case-insensitive)
    return clientes.filter(cliente => {
        const nomeCliente = cliente.nome ? cliente.nome.toLowerCase() : '';
        return nomeCliente.includes(termoLower);
    });
}

// Função para exibir resultados da busca
function exibirResultadosBusca(resultados) {
    const { tabelaClientes } = elementos;
    tabelaClientes.innerHTML = '';
    
    if (resultados.length === 0) {
        tabelaClientes.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Nenhum cliente encontrado para a busca realizada.
                </td>
            </tr>
            <br>
        `;
        return;
    }
    
    // Fragmento de documento para melhor performance
    const fragment = document.createDocumentFragment();
    
    resultados.forEach(cliente => {
        const row = document.createElement('tr');
        const nomeExibicao = cliente.nome || cliente.razao_social || 'Nome não informado';
        const documentoExibicao = cliente.tipo === 'PF' ? 
            formatarCPF(cliente.cpf) : 
            formatarCNPJ(cliente.cnpj);
        
        // Gerar iniciais para o avatar
        const iniciais = nomeExibicao.split(" ")
            .map(nome => nome[0])
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
        
        fragment.appendChild(row);
    });
    
    tabelaClientes.appendChild(fragment);
    // Adicionar event listeners para os botões de editar/excluir
    delegarEventosTabela();
}

// Integração com a interface - adicionar campo de busca
function adicionarCampoBusca() {
    // Verificar se já existe um campo de busca para não duplicar
    if (document.getElementById('campo-busca-clientes')) {
        return;
    }
    
    // Criar elemento de busca
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
    
    // Inserir após o header
    header.parentNode.insertBefore(buscaContainer, header.nextSibling);
    
    // Adicionar event listeners
    const campoBusca = document.getElementById('campo-busca-clientes');
    const btnLimpar = document.getElementById('limpar-busca');
    
    campoBusca.addEventListener('input', (e) => {
        const termo = e.target.value;
        const resultados = buscarClientesPorNome(termo);
        exibirResultadosBusca(resultados);
        
        // Mostrar/ocultar botão de limpar
        if (termo.trim() !== '') {
            btnLimpar.classList.remove('hidden');
        } else {
            btnLimpar.classList.add('hidden');
            renderizarTabelaClientes(); // Volta a exibir todos os clientes
        }
    });
    
    btnLimpar.addEventListener('click', () => {
        campoBusca.value = '';
        btnLimpar.classList.add('hidden');
        renderizarTabelaClientes(); // Volta a exibir todos os clientes
    });
}

// Adicionar campo de busca quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um pouco para garantir que a tabela foi renderizada primeiro
    setTimeout(adicionarCampoBusca, 100);
});

// Atualizar a função carregarClientes para usar a API real
function carregarClientes(page) {
    try {
        const pagina = page || 1;
        api.syncClientsPgRequest(pagina);
        api.syncClientsPgResponse((_, data) => {
            if (data && data.registers) {
                clientes = data.registers;
                renderizarTabelaClientes();
                
                // Atualizar a paginação se necessário
                if (data.totalPages && data.totalPages > 1) {
                    atualizarPaginacao(data.currentPage, data.totalPages);
                }
            }
        });
    } catch (error) {
        console.error('Erro ao buscar clientes da API:', error);
        
        // Fallback para localStorage se a API falhar
        const clientesSalvos = localStorage.getItem('paymate_clientes');
        if (clientesSalvos) {
            clientes = JSON.parse(clientesSalvos);
            renderizarTabelaClientes();
        }
    }
}

// Função para atualizar a paginação (se aplicável)
function atualizarPaginacao(paginaAtual, totalPaginas) {
    // Implementar lógica de paginação aqui conforme sua necessidade
    console.log(`Paginação: Página ${paginaAtual} de ${totalPaginas}`);
}