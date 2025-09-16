// clientes.js
api.syncClientsPaginationRequest(1)
api.syncClientsPaginationResponse((_, data) => {
    console.log(data)
})

// Variáveis globais
let clientes = [];
let clienteEditando = null;

// Elementos DOM
const modalNovoCliente = document.getElementById('modal-novo-cliente');
const abrirModalBtn = document.getElementById('abrir-modal');
const fecharModalBtn = document.getElementById('fechar-modal');
const formCliente = document.getElementById('form-cliente');
const tabelaClientes = document.getElementById('tabela-clientes');
const totalClientesSpan = document.getElementById('total-clientes');
const selectTipo = document.querySelector('select[name="tipo"]');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    carregarClientes();
    atualizarData();
    configurarEventListeners();
    configurarTema();
});

// Configurar event listeners
function configurarEventListeners() {
    // Modal
    abrirModalBtn.addEventListener('click', () => abrirModal());
    fecharModalBtn.addEventListener('click', fecharModal);
    
    // Alternar campos conforme tipo de cliente
    selectTipo.addEventListener('change', alternarCamposTipoCliente);
    
    // Formulário
    formCliente.addEventListener('submit', salvarCliente);
    
    // Fechar modal ao clicar fora dele
    modalNovoCliente.addEventListener('click', function(e) {
        if (e.target === modalNovoCliente) {
            fecharModal();
        }
    });
}

// Configurar tema claro/escuro
function configurarTema() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
    
    // Verificar se há preferência salva ou usar preferência do sistema
    if (localStorage.getItem('color-theme') === 'dark' || 
        (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        themeToggleLightIcon.classList.remove('hidden');
        themeToggleDarkIcon.classList.add('hidden');
    } else {
        document.documentElement.classList.remove('dark');
        themeToggleDarkIcon.classList.remove('hidden');
        themeToggleLightIcon.classList.add('hidden');
    }
    
    // Alternar tema
    themeToggleBtn.addEventListener('click', function() {
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
    const dataElement = document.getElementById('data-atual');
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
    const tipo = selectTipo.value;
    const nomeContainer = document.getElementById('nome-container');
    const razaoSocialContainer = document.getElementById('razao-social-container');
    const cpfContainer = document.getElementById('cpf-container');
    const cnpjContainer = document.getElementById('cnpj-container');
    
    if (tipo === 'PF') {
        nomeContainer.classList.remove('hidden');
        razaoSocialContainer.classList.add('hidden');
        cpfContainer.classList.remove('hidden');
        cnpjContainer.classList.add('hidden');
        
        // Tornar campos obrigatórios conforme necessário
        document.querySelector('input[name="nome"]').setAttribute('required', '');
        document.querySelector('input[name="cpf"]').setAttribute('required', '');
        document.querySelector('input[name="razao_social"]').removeAttribute('required');
        document.querySelector('input[name="cnpj"]').removeAttribute('required');
    } else {
        nomeContainer.classList.add('hidden');
        razaoSocialContainer.classList.remove('hidden');
        cpfContainer.classList.add('hidden');
        cnpjContainer.classList.remove('hidden');
        
        // Tornar campos obrigatórios conforme necessário
        document.querySelector('input[name="razao_social"]').setAttribute('required', '');
        document.querySelector('input[name="cnpj"]').setAttribute('required', '');
        document.querySelector('input[name="nome"]').removeAttribute('required');
        document.querySelector('input[name="cpf"]').removeAttribute('required');
    }
}

// Abrir modal para novo cliente ou edição
function abrirModal(cliente = null) {
    clienteEditando = cliente;
    
    // Limpar formulário se for um novo cliente
    if (!cliente) {
        formCliente.reset();
        selectTipo.value = 'PF';
        alternarCamposTipoCliente();
        document.querySelector('button[type="submit"]').textContent = 'Cadastrar Cliente';
    } else {
        // Preencher formulário com dados do cliente para edição
        selectTipo.value = cliente.tipo;
        alternarCamposTipoCliente();
        
        if (cliente.tipo === 'PF') {
            document.querySelector('input[name="nome"]').value = cliente.nome || '';
            document.querySelector('input[name="cpf"]').value = cliente.cpf || '';
        } else {
            document.querySelector('input[name="razao_social"]').value = cliente.razao_social || '';
            document.querySelector('input[name="cnpj"]').value = cliente.cnpj || '';
        }
        
        document.querySelector('input[name="email"]').value = cliente.email || '';
        document.querySelector('input[name="telefone"]').value = cliente.telefone || '';
        document.querySelector('button[type="submit"]').textContent = 'Atualizar Cliente';
    }
    
    modalNovoCliente.classList.remove('hidden');
}

// Fechar modal
function fecharModal() {
    modalNovoCliente.classList.add('hidden');
    clienteEditando = null;
}

// Salvar cliente (novo ou edição)
function salvarCliente(e) {
    e.preventDefault();
    
    const formData = new FormData(formCliente);
    const cliente = {
        tipo: formData.get('tipo'),
        nome: formData.get('nome'),
        razao_social: formData.get('razao_social'),
        cpf: formData.get('cpf'),
        cnpj: formData.get('cnpj'),
        email: formData.get('email'),
        telefone: formData.get('telefone'),
        status: 'Ativo',
        id: clienteEditando ? clienteEditando.id : Date.now() // Usar timestamp como ID simples
    };
    
    // Validações básicas
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
    
    if (clienteEditando) {
        // Atualizar cliente existente
        const index = clientes.findIndex(c => c.id === clienteEditando.id);
        if (index !== -1) {
            clientes[index] = cliente;
        }
    } else {
        // Adicionar novo cliente
        clientes.push(cliente);
    }
    
    // Salvar no localStorage
    salvarClientesNoStorage();
    
    // Atualizar tabela
    renderizarTabelaClientes();
    
    // Fechar modal e limpar formulário
    fecharModal();
    formCliente.reset();
}

// Carregar clientes do localStorage ou da API
function carregarClientes() {
    // Verificar se temos uma variável global clientList (da API)
    if (typeof clientList !== 'undefined' && clientList && clientList.length > 0) {
        clientes = clientList;
        console.log('Clientes carregados da API:', clientes);
    } else {
        // Se não, tentar carregar do localStorage
        const clientesSalvos = localStorage.getItem('paymate_clientes');
        if (clientesSalvos) {
            clientes = JSON.parse(clientesSalvos);
        } else {
            // Dados iniciais de exemplo
            clientes = [
                {
                    id: 1,
                    tipo: 'PF',
                    nome: 'Carlos Kauan',
                    cpf: '123.456.789-00',
                    email: 'carloskauan@gmail.com',
                    telefone: '(86) 99590-6122',
                    status: 'Ativo'
                },
                {
                    id: 2,
                    tipo: 'PJ',
                    razao_social: 'Empresa XYZ Ltda',
                    cnpj: '12.345.678/0001-90',
                    email: 'contato@xyz.com',
                    telefone: '(11) 3456-7890',
                    status: 'Ativo'
                }
            ];
            salvarClientesNoStorage();
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
    
    clientes.forEach(cliente => {
        const row = document.createElement('tr');
        
        // Determinar nome para exibição
        const nomeExibicao = cliente.tipo === 'PF' ? cliente.nome : cliente.razao_social;
        
        // Determinar documento para exibição
        const documentoExibicao = cliente.tipo === 'PF' ? 
            formatarCPF(cliente.cpf) : formatarCNPJ(cliente.cnpj);
        
        // Gerar iniciais para o avatar
        const iniciais = nomeExibicao
            .split(' ')
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
        
        tabelaClientes.appendChild(row);
    });
    
    // Adicionar event listeners para os botões de editar e excluir
    document.querySelectorAll('.editar-cliente').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const cliente = clientes.find(c => c.id === id);
            if (cliente) {
                abrirModal(cliente);
            }
        });
    });
    
    document.querySelectorAll('.excluir-cliente').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            if (confirm('Tem certeza que deseja excluir este cliente?')) {
                excluirCliente(id);
            }
        });
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
    // Implementação simplificada - na prática, use uma validação completa de CPF
    cpf = cpf.replace(/\D/g, '');
    return cpf.length === 11;
}

function validarCNPJ(cnpj) {
    // Implementação simplificada - na prática, use uma validação completa de CNPJ
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
    
    // Remove tudo que não é dígito
    const numeros = telefone.replace(/\D/g, '');
    
    // Formatação para telefone fixo ou celular
    if (numeros.length === 10) {
        return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (numeros.length === 11) {
        return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return telefone; // Retorna sem formatação se não for 10 ou 11 dígitos
}

// Função para buscar clientes da API (se disponível)
function buscarClientesDaAPI() {
    // Verificar se a API está disponível
    if (typeof api !== 'undefined' && typeof api.getAllClients === 'function') {
        try {
            const clientesAPI = api.getAllClients();
            if (clientesAPI && clientesAPI.length > 0) {
                clientes = clientesAPI;
                renderizarTabelaClientes();
                console.log('Clientes carregados da API:', clientes);
            }
        } catch (error) {
            console.error('Erro ao buscar clientes da API:', error);
        }
    }
}

// Inicializar a busca de clientes da API
buscarClientesDaAPI();