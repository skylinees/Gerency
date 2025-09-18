        // Dados de exemplo
        let corretores = [
            {
                id: 1,
                nome: "João da Silva",
                email: "joao@email.com",
                cpf: "123.456.789-00",
                telefone: "(11) 99999-9999",
                comissao: "7,5%",
                status: "ativo"
            },
            {
                id: 2,
                nome: "Maria Andrade",
                email: "maria@email.com",
                cpf: "987.654.321-00",
                telefone: "(11) 98888-8888",
                comissao: "5%",
                status: "ativo"
            },
            {
                id: 3,
                nome: "Pedro Costa",
                email: "pedro@email.com",
                cpf: "456.789.123-00",
                telefone: "(11) 97777-7777",
                comissao: "10%",
                status: "inativo"
            },
            {
                id: 4,
                nome: "Ana Santos",
                email: "ana@email.com",
                cpf: "321.654.987-00",
                telefone: "(11) 96666-6666",
                comissao: "8%",
                status: "ativo"
            },
            {
                id: 5,
                nome: "Carlos Oliveira",
                email: "carlos@email.com",
                cpf: "654.321.987-00",
                telefone: "(11) 95555-5555",
                comissao: "6,5%",
                status: "inativo"
            }
        ];

        let corretorParaExcluir = null;
        let termoPesquisa = '';

        // Inicializar com tema escuro
        document.querySelector('html').classList.add('dark');
        
        // Data atual
        document.getElementById('data-atual').textContent = new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Toggle de tema
        document.getElementById('theme-toggle').addEventListener('click', function() {
            const html = document.querySelector('html');
            if (html.classList.contains('dark')) {
                html.classList.remove('dark');
                localStorage.setItem('theme', 'light');
                document.getElementById('theme-toggle-light-icon').classList.add('hidden');
                document.getElementById('theme-toggle-dark-icon').classList.remove('hidden');
            } else {
                html.classList.add('dark');
                localStorage.setItem('theme', 'dark');
                document.getElementById('theme-toggle-light-icon').classList.remove('hidden');
                document.getElementById('theme-toggle-dark-icon').classList.add('hidden');
            }
        });
        
        // Verificar preferência salva
        if (localStorage.getItem('theme') === 'light') {
            document.querySelector('html').classList.remove('dark');
            document.getElementById('theme-toggle-light-icon').classList.add('hidden');
            document.getElementById('theme-toggle-dark-icon').classList.remove('hidden');
        } else {
            document.querySelector('html').classList.add('dark');
            document.getElementById('theme-toggle-light-icon').classList.remove('hidden');
            document.getElementById('theme-toggle-dark-icon').classList.add('hidden');
        }
        
        // Funções para o modal
        function abrirModalNovoCorretor() {
            document.getElementById('modal-titulo').textContent = 'Adicionar Novo Corretor';
            document.getElementById('corretor-id').value = '';
            document.getElementById('form-corretor').reset();
            document.getElementById('status-field').classList.add('hidden');
            document.getElementById('modal-novo-corretor').classList.remove('hidden');
        }

        function abrirModalEditarCorretor(id) {
            const corretor = corretores.find(c => c.id === id);
            if (corretor) {
                document.getElementById('modal-titulo').textContent = 'Editar Corretor';
                document.getElementById('corretor-id').value = corretor.id;
                document.getElementById('nome-corretor').value = corretor.nome;
                document.getElementById('cpf-cnpj').value = corretor.cpf;
                document.getElementById('email-corretor').value = corretor.email;
                document.getElementById('telefone-corretor').value = corretor.telefone;
                document.getElementById('comissao-corretor').value = parseFloat(corretor.comissao);
                document.getElementById('status-corretor').value = corretor.status;
                document.getElementById('status-field').classList.remove('hidden');
                document.getElementById('modal-novo-corretor').classList.remove('hidden');
            }
        }
        
        function fecharModalNovoCorretor() {
            document.getElementById('modal-novo-corretor').classList.add('hidden');
        }

        function abrirModalConfirmacao(id) {
            corretorParaExcluir = id;
            document.getElementById('modal-confirmacao').classList.remove('hidden');
        }

        function fecharModalConfirmacao() {
            document.getElementById('modal-confirmacao').classList.add('hidden');
            corretorParaExcluir = null;
        }

        function confirmarExclusao() {
            if (corretorParaExcluir) {
                excluirCorretor(corretorParaExcluir);
                fecharModalConfirmacao();
            }
        }
        
        // Fechar modal ao clicar fora
        document.getElementById('modal-novo-corretor').addEventListener('click', function(e) {
            if (e.target.id === 'modal-novo-corretor') {
                fecharModalNovoCorretor();
            }
        });

        document.getElementById('modal-confirmacao').addEventListener('click', function(e) {
            if (e.target.id === 'modal-confirmacao') {
                fecharModalConfirmacao();
            }
        });

        // Funções para manipular corretores
        function salvarCorretor() {
            const id = document.getElementById('corretor-id').value;
            const nome = document.getElementById('nome-corretor').value;
            const cpf = document.getElementById('cpf-cnpj').value;
            const email = document.getElementById('email-corretor').value;
            const telefone = document.getElementById('telefone-corretor').value;
            const comissao = document.getElementById('comissao-corretor').value;
            const status = document.getElementById('status-corretor').value;

            if (id) {
                // Editar corretor existente
                const index = corretores.findIndex(c => c.id === parseInt(id));
                if (index !== -1) {
                    corretores[index] = {
                        ...corretores[index],
                        nome,
                        cpf,
                        email,
                        telefone,
                        comissao: comissao + '%',
                        status
                    };
                }
            } else {
                // Adicionar novo corretor
                const novoId = Math.max(...corretores.map(c => c.id), 0) + 1;
                corretores.push({
                    id: novoId,
                    nome,
                    email,
                    cpf,
                    telefone,
                    comissao: comissao + '%',
                    status: 'ativo'
                });
            }

            // Atualizar tabela e fechar modal
            renderizarCorretores();
            fecharModalNovoCorretor();
        }

        function excluirCorretor(id) {
            corretores = corretores.filter(c => c.id !== id);
            renderizarCorretores();
        }

        // Funções para pesquisa
        function pesquisarCorretores() {
            const termo = document.getElementById('search-input').value.trim().toLowerCase();
            termoPesquisa = termo;
            
            if (termo) {
                // Mostrar barra de resultados
                document.getElementById('search-results-bar').classList.remove('hidden');
                document.getElementById('search-results-bar').classList.add('fade-in');
                document.getElementById('search-query-text').textContent = `"${termo}"`;
                
                // Filtrar corretores
                const resultados = corretores.filter(corretor => 
                    corretor.nome.toLowerCase().includes(termo) ||
                    corretor.cpf.toLowerCase().includes(termo) ||
                    corretor.email.toLowerCase().includes(termo)
                );
                
                // Atualizar contador
                document.getElementById('search-results-count').textContent = 
                    `${resultados.length} ${resultados.length === 1 ? 'corretor encontrado' : 'corretores encontrados'}`;
                
                // Renderizar resultados
                renderizarCorretores(resultados);
            } else {
                // Limpar pesquisa
                limparPesquisa();
            }
        }

        function limparPesquisa() {
            document.getElementById('search-input').value = '';
            termoPesquisa = '';
            document.getElementById('search-results-bar').classList.add('hidden');
            renderizarCorretores();
        }

        function renderizarCorretores(corretoresParaRenderizar = null) {
            const tabela = document.getElementById('tabela-corretores');
            tabela.innerHTML = '';

            const dados = corretoresParaRenderizar || corretores;
            
            if (dados.length === 0) {
                tabela.innerHTML = `
                    <tr>
                        <td colspan="6" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                            ${termoPesquisa ? 'Nenhum corretor encontrado para a pesquisa.' : 'Nenhum corretor cadastrado.'}
                        </td>
                    </tr>
                `;
            } else {
                dados.forEach(corretor => {
                    const iniciais = corretor.nome.split(' ').map(n => n[0]).join('').toUpperCase();
                    const statusClass = corretor.status === 'ativo' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
                    const statusText = corretor.status === 'ativo' ? 'Ativo' : 'Inativo';

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <div class="flex-shrink-0 h-10 w-10">
                                    <div class="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                        <span class="font-medium text-blue-800 dark:text-blue-200">${iniciais}</span>
                                    </div>
                                </div>
                                <div class="ml-4">
                                    <div class="text-sm font-medium text-gray-900 dark:text-white">${corretor.nome}</div>
                                    <div class="text-sm text-gray-500 dark:text-gray-400">${corretor.email}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900 dark:text-white">${corretor.cpf}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class极="text-sm text-gray-900 dark:text-white">${corretor.telefone}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900 dark:text-white">${corretor.comissao}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                                ${statusText}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3" onclick="abrirModalEditarCorretor(${corretor.id})">Editar</button>
                            <button class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" onclick="abrirModalConfirmacao(${corretor.id})">Excluir</button>
                        </td>
                    `;
                    tabela.appendChild(row);
                });
            }

            // Atualizar contadores
            document.getElementById('total-registros').textContent = corretores.length;
            document.getElementById('inicio-registros').textContent = 1;
            document.getElementById('fim-registros').textContent = dados.length;
        }

        // Inicializar a tabela ao carregar a página
        document.addEventListener('DOMContentLoaded', function() {
            renderizarCorretores();
            
            // Configurar evento de pesquisa
            document.getElementById('search-button').addEventListener('click', pesquisarCorretores);
            
            // Pesquisar ao pressionar Enter
            document.getElementById('search-input').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    pesquisarCorretores();
                }
            });
            
            // Configurar botão de limpar pesquisa
            document.getElementById('clear-search').addEventListener('click', limparPesquisa);
        });
        