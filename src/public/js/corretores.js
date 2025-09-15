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
            document.getElementById('modal-novo-corretor').classList.remove('hidden');
        }
        
        function fecharModalNovoCorretor() {
            document.getElementById('modal-novo-corretor').classList.add('hidden');
        }
        
        // Fechar modal ao clicar fora
        document.getElementById('modal-novo-corretor').addEventListener('click', function(e) {
            if (e.target.id === 'modal-novo-corretor') {
                fecharModalNovoCorretor();
            }
        });