// Calendar functionality
const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// Sample events data
const events = {
    '2025-06-01': [{ type: 'worship', title: 'Culto Dominical', time: '10:00' }],
    '2025-06-04': [{ type: 'study', title: 'Estudo Bíblico', time: '19:30' }],
    '2025-06-08': [
        { type: 'worship', title: 'Culto Dominical', time: '10:00' },
        { type: 'youth', title: 'Reunião Jovens', time: '18:00' }
    ],
    '2025-06-11': [{ type: 'study', title: 'Estudo Bíblico', time: '19:30' }],
    '2025-06-15': [
        { type: 'worship', title: 'Culto Dominical', time: '10:00' },
        { type: 'special', title: 'Conferência Jovens', time: '14:00' }
    ],
    '2025-06-18': [{ type: 'study', title: 'Estudo Bíblico', time: '19:30' }],
    '2025-06-22': [
        { type: 'worship', title: 'Culto Dominical', time: '10:00' },
        { type: 'special', title: 'Batismo', time: '16:00' }
    ],
    '2025-06-25': [{ type: 'study', title: 'Estudo Bíblico', time: '19:30' }],
    '2025-06-29': [
        { type: 'worship', title: 'Culto Dominical', time: '10:00' },
        { type: 'social', title: 'Festa Junina', time: '18:00' }
    ]
};

let selectedDateStr = '';

function updateTodayDate() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('today-date').textContent =
        today.toLocaleDateString('pt-BR', options);
}

function generateCalendar(month, year) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    document.getElementById('month-year').textContent =
        `${monthNames[month]} ${year}`;

    const calendarDays = document.getElementById('calendar-days');
    calendarDays.innerHTML = '';

    for (let i = firstDay - 1; i >= 0; i--) {
        const dayCell = createDayCell(daysInPrevMonth - i, true, month, year);
        calendarDays.appendChild(dayCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = createDayCell(day, false, month, year);
        calendarDays.appendChild(dayCell);
    }

    const totalCells = calendarDays.children.length;
    const remainingCells = 42 - totalCells;
    for (let day = 1; day <= remainingCells; day++) {
        const dayCell = createDayCell(day, true, month, year);
        calendarDays.appendChild(dayCell);
    }
}

function createDayCell(day, isOtherMonth, month, year) {
    const dayCell = document.createElement('div');
    dayCell.className = 'day-cell';

    if (isOtherMonth) {
        dayCell.classList.add('other-month');
    }

    const today = new Date();
    const cellDate = new Date(year, month, day);
    if (!isOtherMonth && cellDate.toDateString() === today.toDateString()) {
        dayCell.classList.add('today');
    }

    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = day;
    dayCell.appendChild(dayNumber);

    if (!isOtherMonth) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (events[dateStr]) {
            const dayEvents = document.createElement('div');
            dayEvents.className = 'day-events';

            events[dateStr].forEach(event => {
                const eventDot = document.createElement('div');
                eventDot.className = `event-dot ${event.type}`;
                eventDot.textContent = event.title;
                eventDot.title = `${event.time} - ${event.title}`;
                dayEvents.appendChild(eventDot);
            });

            dayCell.appendChild(dayEvents);
        }
    }

    dayCell.addEventListener('click', () => {
        document.querySelectorAll('.day-cell').forEach(cell =>
            cell.classList.remove('selected')
        );
        dayCell.classList.add('selected');

        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        openEventModal(dateStr);
    });

    return dayCell;
}

function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar(currentMonth, currentYear);
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar(currentMonth, currentYear);
}

function openEventModal(dateStr) {
    selectedDateStr = dateStr;
    const label = document.getElementById('selectedDateLabel');
    label.textContent = `Eventos em ${dateStr}`;

    const eventList = document.getElementById('eventList');
    eventList.innerHTML = '';

    const dayEvents = events[dateStr] || [];
    if (dayEvents.length === 0) {
        eventList.innerHTML = '<em>Nenhum evento cadastrado</em>';
    } else {
        dayEvents.forEach((e) => {
            const el = document.createElement('div');
            el.className = `event-dot ${e.type}`;
            el.textContent = `${e.time} - ${e.title}`;
            eventList.appendChild(el);
        });
    }

    const modal = new bootstrap.Modal(document.getElementById('eventModal'));
    modal.show();
}

document.getElementById('addEventBtn').addEventListener('click', () => {
    const title = document.getElementById('eventTitle').value;
    const time = document.getElementById('eventTime').value;
    const type = document.getElementById('eventType').value;

    if (!title || !time) {
        alert("Preencha o título e o horário!");
        return;
    }

    if (!events[selectedDateStr]) events[selectedDateStr] = [];

    events[selectedDateStr].push({ title, time, type });

    generateCalendar(currentMonth, currentYear);

    document.getElementById('eventTitle').value = '';
    document.getElementById('eventTime').value = '';
    document.getElementById('eventType').value = 'worship';

    openEventModal(selectedDateStr);
});

document.getElementById('removeEventBtn').addEventListener('click', () => {
    if (confirm("Deseja remover todos os eventos deste dia?")) {
        delete events[selectedDateStr];
        generateCalendar(currentMonth, currentYear);
        document.getElementById('eventList').innerHTML = '<em>Nenhum evento cadastrado</em>';
    }
});

// View selector functionality
document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.view-btn').forEach(b =>
            b.classList.remove('active'));
        btn.classList.add('active');
    });
});

  function scrollGaleria(direction) {
    const galeria = document.getElementById('galeriaScroll');
    const scrollAmount = 300 * direction; // ajuste o valor conforme desejar
    galeria.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

// Inicializa
updateTodayDate();
generateCalendar(currentMonth, currentYear);
setInterval(updateTodayDate, 60000);

// Carregar imagens salvas no LocalStorage ao carregar a página
  window.onload = function () {
    const imagensSalvas = JSON.parse(localStorage.getItem('galeriaImagens')) || [];
    imagensSalvas.forEach(url => adicionarImagemNaGaleria(url));
  };

  // Upload de imagem
  function uploadImagem() {
    const input = document.getElementById('uploadInput');
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const url = e.target.result;
        adicionarImagemNaGaleria(url);
        salvarImagem(url);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  // Adiciona imagem na galeria
 function adicionarImagemNaGaleria(url) {
  const galeria = document.getElementById('galeriaScroll');
  const iconeFinal = galeria.lastElementChild;

  const div = document.createElement('div');
  div.className = 'col-md-6 col-lg-3 me-3 flex-shrink-0';
  div.innerHTML = `
    <div class="gallery-item position-relative">
      <img src="${url}" alt="Imagem da comunidade" class="img-fluid rounded">
      <button class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1" onclick="removerImagem(this, '${url}')">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>
  `;
  galeria.insertBefore(div, iconeFinal);
}

  // Salva imagem no LocalStorage
  function salvarImagem(url) {
    const imagens = JSON.parse(localStorage.getItem('galeriaImagens')) || [];
    imagens.push(url);
    localStorage.setItem('galeriaImagens', JSON.stringify(imagens));
  }

  // Remove imagem da galeria e do LocalStorage
  function removerImagem(botao, url) {
    botao.parentElement.parentElement.remove();

    let imagens = JSON.parse(localStorage.getItem('galeriaImagens')) || [];
    imagens = imagens.filter(img => img !== url);
    localStorage.setItem('galeriaImagens', JSON.stringify(imagens));
  }

  // Rolagem da galeria
  function scrollGaleria(direction) {
    const galeria = document.getElementById('galeriaScroll');
    const scrollAmount = 300;
    galeria.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
  }
