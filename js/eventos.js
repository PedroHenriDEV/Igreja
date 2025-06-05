 let dataAtual = new Date();
        let diaSelecionado = null;
        let eventos = {}; // Armazena eventos por data no formato YYYY-MM-DD

        const nomesDosMeses = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];

        const nomesDasSemanas = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

        // Criar partículas flutuantes
        function criarParticulas() {
            const container = document.querySelector('.container-calendario');
            for (let i = 0; i < 10; i++) {
                const particula = document.createElement('div');
                particula.className = 'particula';
                particula.style.left = Math.random() * 100 + '%';
                particula.style.top = Math.random() * 100 + '%';
                particula.style.animationDelay = Math.random() * 6 + 's';
                particula.style.animationDuration = (Math.random() * 4 + 4) + 's';
                container.appendChild(particula);
            }
        }

        function renderizarCalendario() {
            const calendario = document.getElementById('calendario');
            const mesAno = document.getElementById('mesAno');
            
            const ano = dataAtual.getFullYear();
            const mes = dataAtual.getMonth();
            
            mesAno.textContent = `${nomesDosMeses[mes]} ${ano}`;
            
            // Limpar calendário
            calendario.innerHTML = '';
            
            // Adicionar cabeçalhos dos dias
            nomesDasSemanas.forEach(dia => {
                const cabecalhoDia = document.createElement('div');
                cabecalhoDia.className = 'cabecalho-dia';
                cabecalhoDia.textContent = dia;
                calendario.appendChild(cabecalhoDia);
            });
            
            // Primeiro dia do mês e quantos dias tem o mês
            const primeiroDia = new Date(ano, mes, 1).getDay();
            const diasNoMes = new Date(ano, mes + 1, 0).getDate();
            const hoje = new Date();
            
            // Dias do mês anterior
            const mesAnterior = new Date(ano, mes, 0).getDate();
            for (let i = primeiroDia - 1; i >= 0; i--) {
                const elementoDia = criarElementoDia(mesAnterior - i, true, ano, mes - 1);
                calendario.appendChild(elementoDia);
            }
            
            // Dias do mês atual
            for (let dia = 1; dia <= diasNoMes; dia++) {
                const ehHoje = hoje.getFullYear() === ano && 
                               hoje.getMonth() === mes && 
                               hoje.getDate() === dia;
                
                const elementoDia = criarElementoDia(dia, false, ano, mes, ehHoje);
                calendario.appendChild(elementoDia);
            }
            
            // Completar com dias do próximo mês
            const celulasTotal = calendario.children.length - 7; // -7 para os cabeçalhos
            const celulasRestantes = 42 - celulasTotal; // 6 semanas × 7 dias
            for (let dia = 1; dia <= celulasRestantes; dia++) {
                const elementoDia = criarElementoDia(dia, true, ano, mes + 1);
                calendario.appendChild(elementoDia);
            }
        }

        function criarElementoDia(dia, ehOutroMes, ano, mes, ehHoje = false) {
            const elementoDia = document.createElement('div');
            elementoDia.className = 'dia';
            
            if (ehOutroMes) {
                elementoDia.classList.add('outro-mes');
            }
            
            if (ehHoje) {
                elementoDia.classList.add('hoje');
            }
            
            const numeroDia = document.createElement('div');
            numeroDia.className = 'numero-dia';
            numeroDia.textContent = dia;
            elementoDia.appendChild(numeroDia);
            
            // Verificar se há evento neste dia
            const chaveData = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
            if (eventos[chaveData]) {
                elementoDia.classList.add('tem-evento');
                
                const imagemEvento = document.createElement('img');
                imagemEvento.className = 'imagem-evento';
                imagemEvento.src = eventos[chaveData].imagem;
                imagemEvento.alt = eventos[chaveData].titulo;
                elementoDia.appendChild(imagemEvento);
                
                const tituloEvento = document.createElement('div');
                tituloEvento.className = 'titulo-evento';
                tituloEvento.textContent = eventos[chaveData].titulo;
                elementoDia.appendChild(tituloEvento);
            }
            
            if (!ehOutroMes) {
                elementoDia.onclick = () => abrirModal(dia, ano, mes);
            }
            
            return elementoDia;
        }

        function abrirModal(dia, ano, mes) {
            diaSelecionado = { dia, ano, mes };
            const chaveData = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
            
            const modal = document.getElementById('modalEvento');
            const tituloModal = document.getElementById('tituloModal');
            const tituloEvento = document.getElementById('tituloEvento');
            const botaoDeletar = document.getElementById('botaoDeletar');
            const previewImagem = document.getElementById('previewImagem');
            
            if (eventos[chaveData]) {
                tituloModal.textContent = `Editar Evento - ${dia}/${mes + 1}/${ano}`;
                tituloEvento.value = eventos[chaveData].titulo;
                previewImagem.src = eventos[chaveData].imagem;
                previewImagem.style.display = 'block';
                botaoDeletar.style.display = 'inline-block';
            } else {
                tituloModal.textContent = `Adicionar Evento - ${dia}/${mes + 1}/${ano}`;
                tituloEvento.value = '';
                previewImagem.style.display = 'none';
                botaoDeletar.style.display = 'none';
            }
            
            modal.style.display = 'block';
        }

        function fecharModal() {
            document.getElementById('modalEvento').style.display = 'none';
            document.getElementById('imagemEvento').value = '';
            document.getElementById('previewImagem').style.display = 'none';
        }

        function previewImagem() {
            const arquivo = document.getElementById('imagemEvento').files[0];
            const preview = document.getElementById('previewImagem');
            
            if (arquivo) {
                const leitor = new FileReader();
                leitor.onload = function(e) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                };
                leitor.readAsDataURL(arquivo);
            }
        }

        function salvarEvento() {
            const titulo = document.getElementById('tituloEvento').value;
            const arquivoImagem = document.getElementById('imagemEvento').files[0];
            const previewImagem = document.getElementById('previewImagem');
            
            if (!titulo.trim()) {
                alert('Por favor, digite um título para o evento.');
                return;
            }
            
            const chaveData = `${diaSelecionado.ano}-${String(diaSelecionado.mes + 1).padStart(2, '0')}-${String(diaSelecionado.dia).padStart(2, '0')}`;
            
            // Se há uma imagem prévia (editando evento existente) ou nova imagem
            if (previewImagem.src || arquivoImagem) {
                const srcImagem = arquivoImagem ? 
                    URL.createObjectURL(arquivoImagem) : 
                    previewImagem.src;
                
                // Se é um arquivo novo, criar URL
                if (arquivoImagem) {
                    const leitor = new FileReader();
                    leitor.onload = function(e) {
                        eventos[chaveData] = {
                            titulo: titulo.trim(),
                            imagem: e.target.result
                        };
                        renderizarCalendario();
                        fecharModal();
                    };
                    leitor.readAsDataURL(arquivoImagem);
                } else {
                    // Usar imagem existente
                    eventos[chaveData] = {
                        titulo: titulo.trim(),
                        imagem: previewImagem.src
                    };
                    renderizarCalendario();
                    fecharModal();
                }
            } else {
                alert('Por favor, selecione uma imagem para o evento.');
            }
        }

        function deletarEvento() {
            if (confirm('Tem certeza que deseja excluir este evento?')) {
                const chaveData = `${diaSelecionado.ano}-${String(diaSelecionado.mes + 1).padStart(2, '0')}-${String(diaSelecionado.dia).padStart(2, '0')}`;
                delete eventos[chaveData];
                renderizarCalendario();
                fecharModal();
            }
        }

        function mesAnterior() {
            dataAtual.setMonth(dataAtual.getMonth() - 1);
            renderizarCalendario();
        }

        function proximoMes() {
            dataAtual.setMonth(dataAtual.getMonth() + 1);
            renderizarCalendario();
        }

        // Fechar modal clicando fora dele
        window.onclick = function(evento) {
            const modal = document.getElementById('modalEvento');
            if (evento.target === modal) {
                fecharModal();
            }
        }

        // Inicializar calendário e efeitos
        renderizarCalendario();
        criarParticulas();