// rasgar ticket 
// Seleciona todos os tickets
const tickets = document.querySelectorAll('.ticket');

tickets.forEach(ticket => {
  ticket.addEventListener('click', event => {
    event.preventDefault(); // evita o clique padrão de navegar direto

    // Adiciona a classe para animar o rasgar
    ticket.classList.add('rasgar');

    // Depois da animação (500ms), redireciona para o link do ticket
    setTimeout(() => {
      // pega o href do próprio ticket clicado
      window.location.href = ticket.href;
    }, 500);
  });
});

// horario cultos botao
function mostrarHorarios(e) {
  e.preventDefault(); // Evita o comportamento padrão do link

  const card = document.getElementById('cardHorarios');
  card.style.display = card.style.display === 'none' ? 'block' : 'none';

}
