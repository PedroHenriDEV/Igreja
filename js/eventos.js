// Variáveis globais
let currentDate = new Date();
let selectedDate = null;
let currentView = 'month';

// Dados dos eventos (simulando um banco de dados)
let events = {
    '2025-06-07': [
        { id: 1, title: 'Culto Dominical', time: '10:00', location: 'Templo Principal', category: 'worship' },
        { id: 2, title: 'Escola Dominical', time: '15:00', location: 'Salas de Aula', category: 'study' },
        { id: 3, title: 'Reunião Jovens', time: '18:00', location: 'Salão Jovem', category: 'youth' }
    ],
    '2025-06-08': [
        { id: 4, title: 'Estudo Bíblico', time: '19:30', location: 'Sala 1', category: 'study' }
    ],
    '2025-06-10': [
        { id: 5, title: 'Reunião de Oração', time: '19:00', location: 'Santuário', category: 'worship' }
    ],
    '2025-06-15': [
        { id: 6, title: 'Conferência de Jovens', time: '14:00', location: 'Auditório Principal', category: 'special' }
    ],
    '2025-06-22': [
        { id: 7, title: 'Batismo', time: '16:00', location: 'Batistério', category: 'special' }
    ],
    '2025-06-29': [
        { id: 8, title: 'Festa Junina', time: '18:00', location: 'Quadra Coberta', category: 'social' }
    ],
    '2025-07-05': [
        { id: 9, title: 'Retiro de Casais', time: '09:00', location: 'Chácara Esperança', category: 'special' }
    ]
};

// Nomes dos meses e dias da semana
const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    initializeCalendar();
    updateTodayDate();
    setupEventListeners();
    updateTodayEvents();
    updateStats();
    updateUpcomingEvents();
});

// Configurar event listeners
function setupEventListeners() {
    // Seletores de visualização
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            viewButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentView = this.textContent.toLowerCase();
            renderCalendar();
        });
    });

 
    // Event listener para adicionar evento (duplo clique)
    document.addEventListener('dblclick', function(e) {
        if (e.target.classList.contains('day-cell') && !e.target.classList.contains('other-month')) {
            const dayNumber = parseInt(e.target.textContent);
            if (!isNaN(dayNumber)) {
                openAddEventModal(dayNumber);
            }
        }
    });
}

// Inicializar calendário
function initializeCalendar() {
    renderCalendar();
}

// Atualizar data de hoje
function updateTodayDate() {
    const today = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    document.getElementById('today-date').textContent = today.toLocaleDateString('pt-BR', options);
}

// Renderizar calendário
function renderCalendar() {
    const monthYear = document.getElementById('month-year');
    const calendarDays = document.getElementById('calendar-days');
    
    monthYear.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    
    // Limpar dias anteriores
    calendarDays.innerHTML = '';
    
    // Primeiro dia do mês e último dia do mês anterior
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Gerar 42 dias (6 semanas)
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dayElement = createDayElement(date);
        calendarDays.appendChild(dayElement);
    }
}

// Criar elemento do dia
function createDayElement(date) {
    const dayDiv = document.createElement('div');
    const dayNumber = date.getDate();
    const dateKey = formatDateKey(date);
    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
    const isToday = isDateToday(date);
    const hasEvents = events[dateKey] && events[dateKey].length > 0;
    
    dayDiv.className = 'day-cell';
    dayDiv.textContent = dayNumber;
    
    if (!isCurrentMonth) {
        dayDiv.classList.add('other-month');
    }
    
    if (isToday) {
        dayDiv.classList.add('today');
    }
    
    if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
        dayDiv.classList.add('selected');
    }
    
    if (hasEvents) {
        dayDiv.classList.add('has-events');
        
        // Adicionar indicadores de eventos
        const eventsContainer = document.createElement('div');
        eventsContainer.className = 'day-events';
        
        events[dateKey].forEach(event => {
            const eventDot = document.createElement('div');
            eventDot.className = `event-dot ${event.category}`;
            eventDot.title = `${event.time} - ${event.title}`;
            eventsContainer.appendChild(eventDot);
        });
        
        dayDiv.appendChild(eventsContainer);
    }
    
    return dayDiv;
}

// Selecionar data
function selectDate(dayNumber) {
    selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
    renderCalendar();
    updateSelectedDateEvents();
}

// Atualizar eventos da data selecionada
function updateSelectedDateEvents() {
    if (!selectedDate) return;
    
    const dateKey = formatDateKey(selectedDate);
    const dayEvents = events[dateKey] || [];
    
    // Atualizar título dos eventos de hoje
    const todayTitle = document.querySelector('.card-title');
    if (todayTitle && todayTitle.textContent.includes('Eventos de Hoje')) {
        const selectedDateStr = selectedDate.toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
        });
        todayTitle.innerHTML = `<i class="bi bi-calendar-day text-primary"></i> Eventos - ${selectedDateStr}`;
    }
    
    updateEventsDisplay('.today-events', dayEvents);
}

// Atualizar eventos de hoje
function updateTodayEvents() {
    const today = new Date();
    const dateKey = formatDateKey(today);
    const todayEvents = events[dateKey] || [];
    
    updateEventsDisplay('.today-events', todayEvents);
}

// Atualizar display de eventos
function updateEventsDisplay(selector, eventsList) {
    const container = document.querySelector(selector);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (eventsList.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">Nenhum evento programado</p>';
        return;
    }
    
    eventsList.forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item d-flex align-items-center gap-3';
        eventItem.innerHTML = `
            <div class="event-category ${event.category}"></div>
            <div class="event-time">${event.time}</div>
            <div class="event-info flex-grow-1">
                <h6 class="mb-1">${event.title}</h6>
                <small class="text-muted">${event.location}</small>
            </div>
            <div class="event-actions">
                <button class="btn btn-sm btn-outline-primary" onclick="editEvent(${event.id})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteEvent(${event.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(eventItem);
    });
}

// Navegar para mês anterior
function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
    updateStats();
    updateUpcomingEvents();
}

// Navegar para próximo mês
function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
    updateStats();
    updateUpcomingEvents();
}

// Abrir modal para adicionar evento
function openAddEventModal(dayNumber) {
    const eventDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
    const dateStr = eventDate.toLocaleDateString('pt-BR');
    
    // Criar modal dinamicamente
    const modalHTML = `
        <div class="modal fade" id="eventModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Adicionar Evento - ${dateStr}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="eventForm">
                            <div class="mb-3">
                                <label for="eventTitle" class="form-label">Título do Evento</label>
                                <input type="text" class="form-control" id="eventTitle" required>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <label for="eventTime" class="form-label">Horário</label>
                                    <input type="time" class="form-control" id="eventTime" required>
                                </div>
                                <div class="col-md-6">
                                    <label for="eventCategory" class="form-label">Categoria</label>
                                    <select class="form-select" id="eventCategory" required>
                                        <option value="worship">Cultos e Adoração</option>
                                        <option value="study">Estudos Bíblicos</option>
                                        <option value="youth">Ministério Jovem</option>
                                        <option value="meeting">Reuniões</option>
                                        <option value="special">Eventos Especiais</option>
                                        <option value="social">Atividades Sociais</option>
                                    </select>
                                </div>
                            </div>
                            <div class="mb-3 mt-3">
                                <label for="eventLocation" class="form-label">Local</label>
                                <input type="text" class="form-control" id="eventLocation" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="saveEvent(${dayNumber})">Salvar Evento</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remover modal existente se houver
    const existingModal = document.getElementById('eventModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Adicionar modal ao body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('eventModal'));
    modal.show();
}

// Salvar evento
function saveEvent(dayNumber) {
    const title = document.getElementById('eventTitle').value;
    const time = document.getElementById('eventTime').value;
    const category = document.getElementById('eventCategory').value;
    const location = document.getElementById('eventLocation').value;
    
    if (!title || !time || !location) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    const eventDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
    const dateKey = formatDateKey(eventDate);
    
    // Criar novo evento
    const newEvent = {
        id: Date.now(), // ID simples baseado no timestamp
        title: title,
        time: time,
        location: location,
        category: category
    };
    
    // Adicionar evento ao objeto de eventos
    if (!events[dateKey]) {
        events[dateKey] = [];
    }
    events[dateKey].push(newEvent);
    
    // Fechar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('eventModal'));
    modal.hide();
    
    // Atualizar interface
    renderCalendar();
    updateTodayEvents();
    updateStats();
    updateUpcomingEvents();
    
    // Mostrar mensagem de sucesso
    showNotification('Evento adicionado com sucesso!', 'success');
}

// Editar evento
function editEvent(eventId) {
    // Encontrar evento
    let eventToEdit = null;
    let eventDateKey = null;
    
    for (const dateKey in events) {
        const event = events[dateKey].find(e => e.id === eventId);
        if (event) {
            eventToEdit = event;
            eventDateKey = dateKey;
            break;
        }
    }
    
    if (!eventToEdit) return;
    
    // Criar modal de edição
    const modalHTML = `
        <div class="modal fade" id="editEventModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Editar Evento</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editEventForm">
                            <div class="mb-3">
                                <label for="editEventTitle" class="form-label">Título do Evento</label>
                                <input type="text" class="form-control" id="editEventTitle" value="${eventToEdit.title}" required>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <label for="editEventTime" class="form-label">Horário</label>
                                    <input type="time" class="form-control" id="editEventTime" value="${eventToEdit.time}" required>
                                </div>
                                <div class="col-md-6">
                                    <label for="editEventCategory" class="form-label">Categoria</label>
                                    <select class="form-select" id="editEventCategory" required>
                                        <option value="worship" ${eventToEdit.category === 'worship' ? 'selected' : ''}>Cultos e Adoração</option>
                                        <option value="study" ${eventToEdit.category === 'study' ? 'selected' : ''}>Estudos Bíblicos</option>
                                        <option value="youth" ${eventToEdit.category === 'youth' ? 'selected' : ''}>Ministério Jovem</option>
                                        <option value="meeting" ${eventToEdit.category === 'meeting' ? 'selected' : ''}>Reuniões</option>
                                        <option value="special" ${eventToEdit.category === 'special' ? 'selected' : ''}>Eventos Especiais</option>
                                        <option value="social" ${eventToEdit.category === 'social' ? 'selected' : ''}>Atividades Sociais</option>
                                    </select>
                                </div>
                            </div>
                            <div class="mb-3 mt-3">
                                <label for="editEventLocation" class="form-label">Local</label>
                                <input type="text" class="form-control" id="editEventLocation" value="${eventToEdit.location}" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="updateEvent(${eventId}, '${eventDateKey}')">Atualizar Evento</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remover modal existente se houver
    const existingModal = document.getElementById('editEventModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Adicionar modal ao body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('editEventModal'));
    modal.show();
}

// Atualizar evento
function updateEvent(eventId, dateKey) {
    const title = document.getElementById('editEventTitle').value;
    const time = document.getElementById('editEventTime').value;
    const category = document.getElementById('editEventCategory').value;
    const location = document.getElementById('editEventLocation').value;
    
    if (!title || !time || !location) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Encontrar e atualizar evento
    const eventIndex = events[dateKey].findIndex(e => e.id === eventId);
    if (eventIndex !== -1) {
        events[dateKey][eventIndex] = {
            ...events[dateKey][eventIndex],
            title: title,
            time: time,
            category: category,
            location: location
        };
    }
    
    // Fechar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('editEventModal'));
    modal.hide();
    
    // Atualizar interface
    renderCalendar();
    updateTodayEvents();
    updateSelectedDateEvents();
    updateStats();
    updateUpcomingEvents();
    
    showNotification('Evento atualizado com sucesso!', 'success');
}

// Deletar evento
function deleteEvent(eventId) {
    if (!confirm('Tem certeza que deseja excluir este evento?')) {
        return;
    }
    
    // Encontrar e remover evento
    for (const dateKey in events) {
        const eventIndex = events[dateKey].findIndex(e => e.id === eventId);
        if (eventIndex !== -1) {
            events[dateKey].splice(eventIndex, 1);
            if (events[dateKey].length === 0) {
                delete events[dateKey];
            }
            break;
        }
    }
    
    // Atualizar interface
    renderCalendar();
    updateTodayEvents();
    updateSelectedDateEvents();
    updateStats();
    updateUpcomingEvents();
    
    showNotification('Evento excluído com sucesso!', 'info');
}

// Atualizar estatísticas
function updateStats() {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    let totalEvents = 0;
    let worshipEvents = 0;
    let studyEvents = 0;
    let specialEvents = 0;
    
    for (const dateKey in events) {
        const date = new Date(dateKey);
        if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
            events[dateKey].forEach(event => {
                totalEvents++;
                switch (event.category) {
                    case 'worship':
                        worshipEvents++;
                        break;
                    case 'study':
                        studyEvents++;
                        break;
                    case 'special':
                        specialEvents++;
                        break;
                }
            });
        }
    }
    
    // Atualizar elementos do DOM
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length >= 4) {
        statNumbers[0].textContent = totalEvents;
        statNumbers[1].textContent = worshipEvents;
        statNumbers[2].textContent = studyEvents;
        statNumbers[3].textContent = specialEvents;
    }
}

// Atualizar próximos eventos
function updateUpcomingEvents() {
    const today = new Date();
    const upcomingEvents = [];
    
    // Coletar todos os eventos futuros
    for (const dateKey in events) {
        const eventDate = new Date(dateKey);
        if (eventDate >= today) {
            events[dateKey].forEach(event => {
                upcomingEvents.push({
                    ...event,
                    date: eventDate
                });
            });
        }
    }
    
    // Ordenar por data
    upcomingEvents.sort((a, b) => a.date - b.date);
    
    // Pegar apenas os próximos 4 eventos
    const nextEvents = upcomingEvents.slice(0, 4);
    
    // Atualizar interface
    const container = document.querySelector('.upcoming-events');
    if (container) {
        container.innerHTML = '';
        
        nextEvents.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = 'upcoming-event p-3 mb-3';
            eventElement.innerHTML = `
                <div class="d-flex gap-3">
                    <div class="text-center" style="min-width: 50px;">
                        <div class="upcoming-day">${event.date.getDate()}</div>
                        <div class="upcoming-month">${monthNames[event.date.getMonth()].substr(0, 3)}</div>
                    </div>
                    <div class="flex-grow-1">
                        <h6 class="mb-1">${event.title}</h6>
                        <small class="text-muted">${dayNames[event.date.getDay()]}, ${event.time} - ${event.location}</small>
                    </div>
                </div>
            `;
            container.appendChild(eventElement);
        });
        
        if (nextEvents.length === 0) {
            container.innerHTML = '<p class="text-muted text-center">Nenhum evento programado</p>';
        }
    }
}

// Mostrar notificação
function showNotification(message, type = 'info') {
    const alertClass = type === 'success' ? 'alert-success' : 
                      type === 'error' ? 'alert-danger' : 'alert-info';
    
    const notification = document.createElement('div');
    notification.className = `alert ${alertClass} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Remover automaticamente após 3 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Funções auxiliares
function formatDateKey(date) {
    return date.toISOString().split('T')[0];
}

function isDateToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

// Exportar funções para uso global
window.previousMonth = previousMonth;
window.nextMonth = nextMonth;
window.editEvent = editEvent;
window.deleteEvent = deleteEvent;
window.saveEvent = saveEvent;
window.updateEvent = updateEvent;