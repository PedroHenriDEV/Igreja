// Sistema de Calendário de Eventos
class EventCalendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.events = this.loadEvents();
        this.eventTypes = {
            worship: { name: 'Cultos e Adoração', color: '#9f7aea' },
            study: { name: 'Estudos Bíblicos', color: '#4299e1' },
            youth: { name: 'Ministério Jovem', color: '#48bb78' },
            meeting: { name: 'Reuniões', color: '#ed8936' },
            special: { name: 'Eventos Especiais', color: '#e53e3e' },
            social: { name: 'Atividades Sociais', color: '#38b2ac' }
        };
        this.init();
    }

    init() {
        this.updateTodayDate();
        this.renderCalendar();
        this.updateTodayEvents();
        this.updateUpcomingEvents();
        this.updateStats();
        this.setupEventListeners();
        this.createEventModal();
        this.addUpcomingEventsHeader();
    }

    loadEvents() {
        // Como não podemos usar localStorage em artifacts, vamos usar dados de exemplo
        return {
            '2025-06-22': [
                { id: 1, title: 'Culto Dominical', time: '10:00', type: 'worship', location: 'Templo Principal' },
                { id: 2, title: 'Escola Dominical', time: '15:00', type: 'study', location: 'Salas de Aula' },
                { id: 3, title: 'Reunião Jovens', time: '18:00', type: 'youth', location: 'Salão Jovem' }
            ],
            '2025-06-25': [
                { id: 4, title: 'Estudo Bíblico', time: '19:30', type: 'study', location: 'Sala de Estudos' }
            ],
            '2025-06-29': [
                { id: 5, title: 'Festa Junina', time: '18:00', type: 'social', location: 'Quadra Coberta' }
            ],
            '2025-07-02': [
                { id: 6, title: 'Conferência de Jovens', time: '14:00', type: 'special', location: 'Auditório Principal' }
            ],
            '2025-07-06': [
                { id: 7, title: 'Culto de Oração', time: '19:00', type: 'worship', location: 'Templo Principal' }
            ],
            '2025-07-10': [
                { id: 8, title: 'Reunião de Líderes', time: '20:00', type: 'meeting', location: 'Sala de Reuniões' }
            ]
        };
    }

    saveEvents() {
        // Em um ambiente real, salvaria no localStorage
        console.log('Eventos salvos:', this.events);
    }

    updateTodayDate() {
        const today = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        document.getElementById('today-date').textContent = today.toLocaleDateString('pt-BR', options);
    }

    setupEventListeners() {
        window.previousMonth = () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
            this.updateTodayEvents();
            this.updateUpcomingEvents();
            this.updateStats();
        };

        window.nextMonth = () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
            this.updateTodayEvents();
            this.updateUpcomingEvents();
            this.updateStats();
        };

        window.openAddEventModal = () => {
            this.openEventModal();
        };

        window.saveEvent = () => {
            this.saveEvent();
        };

        window.deleteEvent = (eventId, dateStr) => {
            this.deleteEvent(eventId, dateStr);
        };

        window.goToEventDate = (dateStr) => {
            this.goToEventDate(dateStr);
        };

        window.quickAddEvent = () => {
            this.quickAddEvent();
        };
    }

    goToEventDate(dateStr) {
        const targetDate = new Date(dateStr);
        this.currentDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
        this.selectedDate = targetDate;
        this.renderCalendar();
        this.updateTodayEvents();
        this.updateUpcomingEvents();
        this.updateStats();
        
        // Destacar a data selecionada
        setTimeout(() => {
            const dayCell = document.querySelector(`.day-cell[data-date="${dateStr}"]`);
            if (dayCell) {
                dayCell.classList.add('selected');
                dayCell.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    }

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        const monthNames = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        document.getElementById('month-year').textContent = `${monthNames[month]} ${year}`;

        const firstDay = new Date(year, month, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const calendarGrid = document.querySelector('.calendar-grid');

        // Remove os dias anteriores (mantém apenas os cabeçalhos)
        while (calendarGrid.children.length > 7) {
            calendarGrid.removeChild(calendarGrid.lastChild);
        }

        for (let i = 0; i < 42; i++) {
            const cellDate = new Date(startDate);
            cellDate.setDate(startDate.getDate() + i);

            const dayCell = this.createDayCell(cellDate, month);
            calendarGrid.appendChild(dayCell);
        }
    }

    createDayCell(date, currentMonth) {
        const dayCell = document.createElement('div');
        dayCell.className = 'day-cell';

        const isCurrentMonth = date.getMonth() === currentMonth;
        const isToday = this.isToday(date);
        const dateStr = this.formatDateString(date);

        // Adicionar data como atributo para facilitar a busca
        dayCell.setAttribute('data-date', dateStr);

        if (!isCurrentMonth) {
            dayCell.classList.add('other-month');
        }

        if (isToday) {
            dayCell.classList.add('today');
        }

        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = date.getDate();
        dayCell.appendChild(dayNumber);

        const eventsContainer = document.createElement('div');
        eventsContainer.className = 'day-events';

        const dayEvents = this.events[dateStr] || [];
        dayEvents.forEach((event, index) => {
            const eventDot = document.createElement('div');
            eventDot.className = `event-dot ${event.type}`;
            eventDot.textContent = event.title;
            eventDot.title = `${event.time} - ${event.title}`;
            
            // Adicionar evento de clique para mostrar detalhes/remover
            eventDot.onclick = (e) => {
                e.stopPropagation();
                this.showEventDetails(event, dateStr);
            };
            
            eventsContainer.appendChild(eventDot);
        });

        dayCell.appendChild(eventsContainer);

        // Adicionar evento para criar novo evento
        dayCell.onclick = () => {
            this.selectDate(date, dayCell);
            this.selectedDate = date;
        };

        // Duplo clique para adicionar evento
        dayCell.ondblclick = () => {
            this.selectedDate = date;
            this.openEventModal();
        };

        return dayCell;
    }

    selectDate(date, dayCell) {
        document.querySelectorAll('.day-cell.selected').forEach(cell => {
            cell.classList.remove('selected');
        });

        dayCell.classList.add('selected');
        this.selectedDate = new Date(date);
    }

    showEventDetails(event, dateStr) {
        const modal = document.getElementById('eventDetailsModal');
        if (modal) {
            document.getElementById('eventDetailTitle').textContent = event.title;
            document.getElementById('eventDetailTime').textContent = event.time;
            document.getElementById('eventDetailType').textContent = this.eventTypes[event.type].name;
            document.getElementById('eventDetailLocation').textContent = event.location;
            
            // Configurar botão de deletar
            const deleteBtn = document.getElementById('deleteEventBtn');
            deleteBtn.onclick = () => {
                this.deleteEvent(event.id, dateStr);
                modal.style.display = 'none';
            };
            
            modal.style.display = 'block';
        }
    }

    deleteEvent(eventId, dateStr) {
        if (this.events[dateStr]) {
            this.events[dateStr] = this.events[dateStr].filter(event => event.id !== eventId);
            if (this.events[dateStr].length === 0) {
                delete this.events[dateStr];
            }
            this.saveEvents();
            this.renderCalendar();
            this.updateTodayEvents();
            this.updateUpcomingEvents();
            this.updateStats();
        }
    }

    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    formatDateString(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    updateTodayEvents() {
        const today = new Date();
        const todayStr = this.formatDateString(today);
        const todayEvents = this.events[todayStr] || [];
        
        const container = document.querySelector('.today-events');
        container.innerHTML = '';
        
        if (todayEvents.length === 0) {
            container.innerHTML = '<p class="text-muted">Nenhum evento hoje</p>';
            return;
        }
        
        todayEvents.forEach(event => {
            const eventItem = document.createElement('div');
            eventItem.className = 'event-item d-flex align-items-center gap-3';
            eventItem.innerHTML = `
                <div class="event-category ${event.type}"></div>
                <div class="event-time">${event.time}</div>
                <div class="event-info flex-grow-1">
                    <h6 class="mb-1">${event.title}</h6>
                    <small class="text-muted">${event.location}</small>
                </div>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteEvent(${event.id}, '${todayStr}')">
                    <i class="bi bi-trash"></i>
                </button>
            `;
            container.appendChild(eventItem);
        });
    }

    addUpcomingEventsHeader() {
        const upcomingCard = document.querySelector('.upcoming-events').closest('.card');
        const cardBody = upcomingCard.querySelector('.card-body');
        const title = cardBody.querySelector('.card-title');
        
        // Adicionar botão de adicionar evento no cabeçalho
        const headerActions = document.createElement('div');
        headerActions.className = 'd-flex gap-2 mb-3';
        headerActions.innerHTML = `
            <button class="btn btn-sm btn-gradient" onclick="quickAddEvent()" title="Adicionar Evento Rápido">
                <i class="bi bi-plus-circle"></i>
            </button>
            <button class="btn btn-sm btn-outline-primary" onclick="openAddEventModal()" title="Adicionar Evento">
                <i class="bi bi-calendar-plus"></i>
            </button>
        `;
        
        title.parentNode.insertBefore(headerActions, title.nextSibling);
    }

    updateUpcomingEvents() {
        const container = document.querySelector('.upcoming-events');
        container.innerHTML = '';
        
        const today = new Date();
        const upcomingEvents = [];
        
        // Pegar eventos dos próximos 60 dias
        for (let i = 1; i <= 60; i++) {
            const futureDate = new Date(today);
            futureDate.setDate(today.getDate() + i);
            const dateStr = this.formatDateString(futureDate);
            
            if (this.events[dateStr]) {
                this.events[dateStr].forEach(event => {
                    upcomingEvents.push({
                        ...event,
                        date: futureDate,
                        dateStr: dateStr
                    });
                });
            }
        }
        
        // Ordenar por data
        upcomingEvents.sort((a, b) => a.date - b.date);
        
        if (upcomingEvents.length === 0) {
            container.innerHTML = `
                <div class="text-center py-4">
                    <i class="bi bi-calendar-x text-muted mb-2" style="font-size: 2rem;"></i>
                    <p class="text-muted mb-3">Nenhum evento próximo</p>
                    <button class="btn btn-sm btn-gradient" onclick="openAddEventModal()">
                        <i class="bi bi-plus-circle me-1"></i>
                        Adicionar Evento
                    </button>
                </div>
            `;
            return;
        }
        
        // Mostrar apenas os próximos 8 eventos
        upcomingEvents.slice(0, 8).forEach((event, index) => {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'upcoming-event p-3 mb-3 position-relative';
            eventDiv.style.cursor = 'pointer';
            
            const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
            const daysUntil = Math.ceil((event.date - today) / (1000 * 60 * 60 * 24));
            
            let timeLabel = '';
            if (daysUntil === 1) {
                timeLabel = 'Amanhã';
            } else if (daysUntil <= 7) {
                timeLabel = `Em ${daysUntil} dias`;
            } else {
                timeLabel = `${event.date.getDate()} ${monthNames[event.date.getMonth()]}`;
            }
            
            eventDiv.innerHTML = `
                <div class="d-flex gap-3">
                    <div class="text-center" style="min-width: 60px;">
                        <div class="upcoming-day">${event.date.getDate()}</div>
                        <div class="upcoming-month">${monthNames[event.date.getMonth()]}</div>
                        <small class="text-muted d-block mt-1">${timeLabel}</small>
                    </div>
                    <div class="flex-grow-1">
                        <div class="d-flex align-items-center gap-2 mb-1">
                            <div class="event-category ${event.type}" style="width: 8px; height: 8px; border-radius: 50%;"></div>
                            <h6 class="mb-0">${event.title}</h6>
                        </div>
                        <div class="d-flex align-items-center gap-2 text-muted">
                            <small><i class="bi bi-clock me-1"></i>${event.time}</small>
                            <small><i class="bi bi-geo-alt me-1"></i>${event.location}</small>
                        </div>
                        <small class="text-muted">${this.eventTypes[event.type].name}</small>
                    </div>
                    <div class="d-flex flex-column gap-1">
                        <button class="btn btn-sm btn-outline-primary" onclick="goToEventDate('${event.dateStr}')" title="Ir para data">
                            <i class="bi bi-calendar-event"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteEvent(${event.id}, '${event.dateStr}')" title="Excluir evento">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            
            // Adicionar click no evento para mostrar detalhes
            eventDiv.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    this.showEventDetails(event, event.dateStr);
                }
            });
            
            container.appendChild(eventDiv);
        });
        
        // Adicionar botão "Ver Todos" se houver mais eventos
        if (upcomingEvents.length > 8) {
            const showMoreBtn = document.createElement('div');
            showMoreBtn.className = 'text-center mt-3 pt-3 border-top';
            showMoreBtn.innerHTML = `
                <button class="btn btn-sm btn-outline-primary" onclick="this.showAllUpcomingEvents()">
                    <i class="bi bi-eye me-1"></i>
                    Ver todos (${upcomingEvents.length - 8} restantes)
                </button>
            `;
            container.appendChild(showMoreBtn);
        }
    }

    quickAddEvent() {
        const title = prompt('Título do evento:');
        if (!title) return;
        
        const time = prompt('Horário (HH:MM):');
        if (!time) return;
        
        const location = prompt('Local:');
        if (!location) return;
        
        const date = this.selectedDate || new Date();
        const dateStr = this.formatDateString(date);
        
        const newEvent = {
            id: Date.now(),
            title: title,
            time: time,
            type: 'meeting', // Tipo padrão para eventos rápidos
            location: location
        };
        
        if (!this.events[dateStr]) {
            this.events[dateStr] = [];
        }
        
        this.events[dateStr].push(newEvent);
        this.saveEvents();
        
        // Atualizar interface
        this.renderCalendar();
        this.updateTodayEvents();
        this.updateUpcomingEvents();
        this.updateStats();
        
        alert('Evento adicionado com sucesso!');
    }

    updateStats() {
        const currentMonth = this.currentDate.getMonth();
        const currentYear = this.currentDate.getFullYear();
        
        let totalEvents = 0;
        let cultos = 0;
        let estudos = 0;
        let especiais = 0;
        
        Object.keys(this.events).forEach(dateStr => {
            const date = new Date(dateStr);
            if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
                this.events[dateStr].forEach(event => {
                    totalEvents++;
                    switch (event.type) {
                        case 'worship':
                            cultos++;
                            break;
                        case 'study':
                            estudos++;
                            break;
                        case 'special':
                            especiais++;
                            break;
                    }
                });
            }
        });
        
        document.querySelector('.stat-item .stat-number').textContent = totalEvents;
        document.querySelectorAll('.stat-item .stat-number')[1].textContent = cultos;
        document.querySelectorAll('.stat-item .stat-number')[2].textContent = estudos;
        document.querySelectorAll('.stat-item .stat-number')[3].textContent = especiais;
    }

    createEventModal() {
        const modalHTML = `
            <!-- Modal para Adicionar Evento -->
            <div class="modal fade" id="addEventModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Adicionar Evento</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="eventForm">
                                <div class="mb-3">
                                    <label for="eventTitle" class="form-label">Título do Evento</label>
                                    <input type="text" class="form-control" id="eventTitle" required>
                                </div>
                                <div class="mb-3">
                                    <label for="eventTime" class="form-label">Horário</label>
                                    <input type="time" class="form-control" id="eventTime" required>
                                </div>
                                <div class="mb-3">
                                    <label for="eventType" class="form-label">Tipo do Evento</label>
                                    <select class="form-control" id="eventType" required>
                                        <option value="">Selecione...</option>
                                        <option value="worship">Cultos e Adoração</option>
                                        <option value="study">Estudos Bíblicos</option>
                                        <option value="youth">Ministério Jovem</option>
                                        <option value="meeting">Reuniões</option>
                                        <option value="special">Eventos Especiais</option>
                                        <option value="social">Atividades Sociais</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="eventLocation" class="form-label">Local</label>
                                    <input type="text" class="form-control" id="eventLocation" required>
                                </div>
                                <div class="mb-3">
                                    <label for="eventDate" class="form-label">Data</label>
                                    <input type="date" class="form-control" id="eventDate" required>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" onclick="saveEvent()">Salvar Evento</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal para Detalhes do Evento -->
            <div id="eventDetailsModal" class="modal" style="display: none;">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Detalhes do Evento</h5>
                            <button type="button" class="btn-close" onclick="document.getElementById('eventDetailsModal').style.display='none'"></button>
                        </div>
                        <div class="modal-body">
                            <p><strong>Evento:</strong> <span id="eventDetailTitle"></span></p>
                            <p><strong>Horário:</strong> <span id="eventDetailTime"></span></p>
                            <p><strong>Tipo:</strong> <span id="eventDetailType"></span></p>
                            <p><strong>Local:</strong> <span id="eventDetailLocation"></span></p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" id="deleteEventBtn">Excluir Evento</button>
                            <button type="button" class="btn btn-secondary" onclick="document.getElementById('eventDetailsModal').style.display='none'">Fechar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    openEventModal() {
        if (this.selectedDate) {
            const dateStr = this.formatDateString(this.selectedDate);
            document.getElementById('eventDate').value = dateStr;
        }
        
        // Limpar formulário
        document.getElementById('eventForm').reset();
        
        const modal = new bootstrap.Modal(document.getElementById('addEventModal'));
        modal.show();
    }

    saveEvent() {
        const title = document.getElementById('eventTitle').value;
        const time = document.getElementById('eventTime').value;
        const type = document.getElementById('eventType').value;
        const location = document.getElementById('eventLocation').value;
        const date = document.getElementById('eventDate').value;
        
        if (!title || !time || !type || !location || !date) {
            alert('Por favor, preencha todos os campos!');
            return;
        }
        
        const newEvent = {
            id: Date.now(), // ID simples baseado em timestamp
            title: title,
            time: time,
            type: type,
            location: location
        };
        
        if (!this.events[date]) {
            this.events[date] = [];
        }
        
        this.events[date].push(newEvent);
        this.saveEvents();
        
        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addEventModal'));
        modal.hide();
        
        // Atualizar interface
        this.renderCalendar();
        this.updateTodayEvents();
        this.updateUpcomingEvents();
        this.updateStats();
        
        alert('Evento adicionado com sucesso!');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    window.calendar = new EventCalendar();
});

// Adiciona suporte para o Bootstrap Modal
document.addEventListener('click', function (event) {
    if (event.target.matches('[data-bs-toggle="modal"]')) {
        const target = document.querySelector(event.target.getAttribute('data-bs-target'));
        if (target) {
            const modal = new bootstrap.Modal(target);
            modal.show();
        }
    }
});