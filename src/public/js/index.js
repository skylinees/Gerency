// Função para formatar data
        function formatarData(data) {
            return new Date(data).toLocaleDateString('pt-BR');
        }

        // Função para formatar moeda
        function formatarMoeda(valor) {
            return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
        }

        // Função para calcular dias até o vencimento
        function calcularDiasVencimento(dataVencimento) {
            const hoje = new Date();
            const vencimento = new Date(dataVencimento);
            const diffTime = vencimento - hoje;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
        }

        // Dados de exemplo (em um sistema real, isso viria de uma API)
        const contas = [
            {
                cliente: "João Silva",
                email: "joao@email.com",
                descricao: "Serviço de consultoria",
                vencimento: "2023-08-15",
                valor: 1250.00,
                status: "pendente"
            },
            {
                cliente: "Maria Souza",
                email: "maria@email.com",
                descricao: "Desenvolvimento de site",
                vencimento: "2023-08-05",
                valor: 3500.00,
                status: "pago"
            },
            {
                cliente: "Empresa ABC",
                email: "contato@empresa.com",
                descricao: "Hospedagem mensal",
                vencimento: "2023-08-01",
                valor: 250.00,
                status: "vencido"
            },
            {
                cliente: "Carlos Oliveira",
                email: "carlos@email.com",
                descricao: "Manutenção de sistema",
                vencimento: "2023-08-20",
                valor: 800.00,
                status: "pendente"
            },
            {
                cliente: "Ana Santos",
                email: "ana@email.com",
                descricao: "Design de interface",
                vencimento: "2023-07-28",
                valor: 1200.00,
                status: "vencido"
            }
        ];

        // Função para renderizar a tabela
        function renderizarTabela() {
            const tabela = document.getElementById('tabela-contas');
            tabela.innerHTML = '';
            
            contas.forEach(conta => {
                const dias = calcularDiasVencimento(conta.vencimento);
                let statusText = '';
                let statusClass = '';
                let diasText = '';
                
                if (conta.status === 'pago') {
                    statusText = 'Pago';
                    statusClass = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
                } else if (conta.status === 'vencido') {
                    statusText = 'Vencido';
                    statusClass = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
                    diasText = `<div class="text-xs text-red-500">Vencido</div>`;
                } else {
                    statusText = 'Pendente';
                    statusClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
                    if (dias < 0) {
                        statusText = 'Vencido';
                        statusClass = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
                        diasText = `<div class="text-xs text-red-500">Vencido</div>`;
                    } else if (dias <= 3) {
                        diasText = `<div class="text-xs text-red-500">Vence em ${dias} dias</div>`;
                    } else if (dias <= 7) {
                        diasText = `<div class="text-xs text-yellow-500">Vence em ${dias} dias</div>`;
                    } else {
                        diasText = `<div class="text-xs text-gray-500">Vence em ${dias} dias</div>`;
                    }
                }
                
                const tr = document.createElement('tr');
                tr.className = 'hover:bg-gray-50 dark:hover:bg-gray-700';
                tr.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="font-medium text-gray-900 dark:text-white">${conta.cliente}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">${conta.email}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900 dark:text-white">${conta.descricao}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900 dark:text-white">${formatarData(conta.vencimento)}</div>
                        ${diasText}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">${formatarMoeda(conta.valor)}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full status-badge ${statusClass}">${statusText}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">Editar</button>
                        ${conta.status === 'pago' ? 
                            '<button class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300" disabled>Recebido</button>' : 
                            '<button class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">Receber</button>'
                        }
                    </td>
                `;
                tabela.appendChild(tr);
            });
        }

        // Função para atualizar a data atual
        function atualizarDataAtual() {
            const dataElement = document.getElementById('data-atual');
            const agora = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dataElement.textContent = agora.toLocaleDateString('pt-BR', options);
        }

        // Inicializar a página
        document.addEventListener('DOMContentLoaded', function() {
            atualizarDataAtual();
            renderizarTabela();
            
            // Configurar o toggle de tema
            const themeToggleBtn = document.getElementById('theme-toggle');
            const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
            const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
            
            if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                themeToggleLightIcon.classList.remove('hidden');
                document.documentElement.classList.add('dark');
            } else {
                themeToggleDarkIcon.classList.remove('hidden');
                document.documentElement.classList.remove('dark');
            }
            
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
        });