 // Toggle de modo escuro/claro
        document.addEventListener('DOMContentLoaded', function() {
            const themeToggleBtn = document.getElementById('theme-toggle');
            const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
            const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

            // Verifica se há preferência salva, caso contrário usa preferência do sistema
            if (localStorage.getItem('color-theme') === 'dark' || 
                (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
                themeToggleLightIcon.classList.remove('hidden');
            } else {
                document.documentElement.classList.remove('dark');
                themeToggleDarkIcon.classList.remove('hidden');
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

            // Animação de carregamento
            const cards = document.querySelectorAll('.report-card');
            cards.forEach((card, index) => {
                card.style.animationDelay = `${index * 0.1}s`;
                card.classList.add('animate-fade-in');
            });

            // Modal de exportação para Excel
            const exportButton = document.getElementById('exportButton');
            const exportModal = document.getElementById('exportExcelModal');
            const closeExportModal = document.getElementById('closeExportModal');
            const cancelExport = document.getElementById('cancelExport');
            const confirmExport = document.getElementById('confirmExport');

            function openExportModal() {
                exportModal.classList.add('show');
                document.body.style.overflow = 'hidden';
            }

            function closeExportModalHandler() {
                exportModal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }

            exportButton.addEventListener('click', openExportModal);
            closeExportModal.addEventListener('click', closeExportModalHandler);
            cancelExport.addEventListener('click', closeExportModalHandler);
            
            confirmExport.addEventListener('click', function() {
                // Simulação de exportação para Excel
                const format = document.querySelector('input[name="fileFormat"]:checked').value;
                alert(`Exportando dados para ${format.toUpperCase()}...`);
                closeExportModalHandler();
            });

            // Fechar modal clicando fora dele
            exportModal.addEventListener('click', function(e) {
                if (e.target === exportModal) {
                    closeExportModalHandler();
                }
            });
        });