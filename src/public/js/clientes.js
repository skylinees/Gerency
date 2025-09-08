let clientes = [];

console
// Exibir data atual
function formatarData(data) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return data.toLocaleDateString('pt-BR', options);
}

document.getElementById('data-atual').textContent = formatarData(new Date());

// Inicializar dark mode
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}

// Controle do modal
const modal = document.getElementById('modal-novo-cliente');
const abrirModalBtn = document.getElementById('abrir-modal');
const fecharModalBtn = document.getElementById('fechar-modal');
const formCliente = document.getElementById('form-cliente');
const tipoSelect = document.querySelector('select[name="tipo"]');
const tabelaClientes = document.getElementById('tabela-clientes');
const totalClientesSpan = document.getElementById('total-clientes');

// Alternar campos baseado no tipo de cliente
tipoSelect.addEventListener('change', function() {
    const isPJ = this.value === 'pj';

    document.getElementById('nome-container').classList.toggle('hidden', isPJ);
    document.getElementById('razao-social-container').classList.toggle('hidden', !isPJ);
    document.getElementById('cpf-container').classList.toggle('hidden', isPJ);
    document.getElementById('cnpj-container').classList.toggle('hidden', !isPJ);

    // Adiciona/remove atributo required conforme o tipo
    document.querySelector('input[name="nome"]').required = !isPJ;
    document.querySelector('input[name="razao_social"]').required = isPJ;
    document.querySelector('input[name="cpf"]').required = !isPJ;
    document.querySelector('input[name="cnpj"]').required = isPJ;
});

// Abrir modal
abrirModalBtn.addEventListener('click', function() {
    modal.classList.remove('hidden');
});

// Fechar modal
fecharModalBtn.addEventListener('click', function() {
    modal.classList.add('hidden');
});

// Fechar modal ao clicar fora
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.classList.add('hidden');
    }
});

// Formulário de cadastro
formCliente.addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const cliente = Object.fromEntries(formData.entries());

    // Adiciona data de cadastro
    cliente.dataCadastro = new Date().toISOString();
    cliente.status = 'ativo';
    cliente.id = Date.now(); // ID único

    // Adiciona ao array de clientes
    clientes.unshift(cliente); // Adiciona no início do array

    // Atualiza a tabela
    atualizarTabelaClientes();

    // Atualiza contador
    totalClientesSpan.textContent = clientes.length;

    // Fechar modal e limpar formulário
    modal.classList.add('hidden');
    this.reset();

    // Mostrar mensagem de sucesso
    alert('Cliente cadastrado com sucesso!');
});

// Função para atualizar a tabela de clientes
function atualizarTabelaClientes() {
    // Limpa a tabela
    tabelaClientes.innerHTML = '';

    // Adiciona cada cliente à tabela
    clientes.forEach(cliente => {
        const novaLinha = document.createElement('tr');
        novaLinha.className = 'hover:bg-gray-50 dark:hover:bg-gray-700';

        const tipo = cliente.tipo === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica';
        const nome = cliente.tipo === 'pf' ? cliente.nome : cliente.razao_social;
        const documento = cliente.tipo === 'pf' ? formatarCPF(cliente.cpf) : formatarCNPJ(cliente.cnpj);
        const iniciais = cliente.tipo === 'pf'
            ? cliente.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
            : cliente.razao_social.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

        // Cor do avatar baseado no tipo
        const avatarColor = cliente.tipo === 'pf' ? 'blue' : 'purple';

        novaLinha.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-${avatarColor}-100 dark:bg-${avatarColor}-900 flex items-center justify-center">
                                <span class="text-${avatarColor}-600 dark:text-${avatarColor}-300 font-medium">${iniciais}</span>
                            </div>
                            <div class="ml-4">
                                <div class="font-medium">${nome}</div>
                                <div class="text-sm text-gray-500 dark:text-gray-400">${cliente.email}</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm">${formatarTelefone(cliente.telefone)}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm">${documento}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm">${tipo}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${cliente.status === 'ativo' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}">
                            ${cliente.status === 'ativo' ? 'Ativo' : 'Inativo'}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3" onclick="editarCliente(${cliente.id})">
                            Editar
                        </button>
                        <button class="${cliente.status === 'ativo' ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300' : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'}" 
                                onclick="toggleStatusCliente(${cliente.id})">
                            ${cliente.status === 'ativo' ? 'Inativar' : 'Ativar'}
                        </button>
                    </td>
                `;

        tabelaClientes.appendChild(novaLinha);
    });
}

// Funções auxiliares para formatação
function formatarCPF(cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatarCNPJ(cnpj) {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

function formatarTelefone(telefone) {
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

// Funções para manipulação de clientes
function editarCliente(id) {
    const cliente = clientes.find(c => c.id === id);
    if (cliente) {
        // Preenche o formulário com os dados do cliente
        tipoSelect.value = cliente.tipo;

        // Dispara o evento change para mostrar os campos corretos
        tipoSelect.dispatchEvent(new Event('change'));

        if (cliente.tipo === 'pf') {
            document.querySelector('input[name="nome"]').value = cliente.nome;
            document.querySelector('input[name="cpf"]').value = cliente.cpf;
        } else {
            document.querySelector('input[name="razao_social"]').value = cliente.razao_social;
            document.querySelector('input[name="cnpj"]').value = cliente.cnpj;
        }

        document.querySelector('input[name="email"]').value = cliente.email;
        document.querySelector('input[name="telefone"]').value = cliente.telefone;

        // Abre o modal
        modal.classList.remove('hidden');

        // Altera o botão para "Atualizar"
        const submitBtn = formCliente.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Atualizar Cliente';
        submitBtn.onclick = function(e) {
            e.preventDefault();
            atualizarCliente(id);
        };
    }
}

function atualizarCliente(id) {
    const formData = new FormData(formCliente);
    const clienteAtualizado = Object.fromEntries(formData.entries());

    // Encontra o índice do cliente no array
    const index = clientes.findIndex(c => c.id === id);

    if (index !== -1) {
        // Mantém os dados originais que não estão no formulário
        clienteAtualizado.id = id;
        clienteAtualizado.status = clientes[index].status;
        clienteAtualizado.dataCadastro = clientes[index].dataCadastro;

        // Atualiza o cliente no array
        clientes[index] = clienteAtualizado;

        // Atualiza a tabela
        atualizarTabelaClientes();

        // Fecha o modal e reseta o formulário
        modal.classList.add('hidden');
        formCliente.reset();

        // Restaura o botão para "Cadastrar"
        const submitBtn = formCliente.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Cadastrar Cliente';
        submitBtn.onclick = null;

        alert('Cliente atualizado com sucesso!');
    }
}

function toggleStatusCliente(id) {
    const cliente = clientes.find(c => c.id === id);
    if (cliente) {
        cliente.status = cliente.status === 'ativo' ? 'inativo' : 'ativo';
        atualizarTabelaClientes();

        const novoStatus = cliente.status === 'ativo' ? 'ativado' : 'inativado';
        alert(`Cliente ${novoStatus} com sucesso!`);
    }
}
// Inicializa a tabela (pode carregar dados do localStorage ou API)
async function inicializar() {

    await api.syncClientsRequest()
    await api.syncClientsResponse((event, response) => {
        clientes = response;
        console.log(response);

        atualizarTabelaClientes();
        totalClientesSpan.textContent = clientes.length;
        console.log("TOTAL CLIENTES", totalClientesSpan.textContent);
    });

}

// Inicializa a aplicação
document.addEventListener('DOMContentLoaded', inicializar);