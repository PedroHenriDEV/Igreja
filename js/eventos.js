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
    }

    // Carregar eventos do localStorage
    loadEvents() {
        const savedEvents = localStorage.getItem('churchEvents');
        if (savedEvents) {
            return JSON.parse(savedEvents);
        }
        // Eventos padrão
        return {
            '2025-06-08': [
                { id: 1, title: 'Culto Dominical', time: '10:00', type: 'worship', location: 'Templo Principal' },
                { id: 2, title: 'Escola Dominical', time: '15:00', type: 'study', location: 'Salas de Aula' },
                { id: 3, title: 'Reunião Jovens', time: '18:00', type: 'youth', location: 'Salão Jovem' }
            ],
            '2025-06-15': [
                { id: 4, title: 'Conferência de Jovens', time: '14:00', type: 'special', location: 'Auditório Principal' }
            ],
            '2025-06-22': [
                { id: 5, title: 'Batismo', time: '16:00', type: 'special', location: 'Batistério' }
            ],
            '2025-06-29': [
                { id: 6, title: 'Festa Junina', time: '18:00', type: 'social', location: 'Quadra Coberta' }
            ],
            '2025-07-05': [
                { id: 7, title: 'Retiro de Casais', time: '08:00', type: 'special', location: 'Chácara Esperança' }
            ]
        };
    }

    // Salvar eventos no localStorage
    saveEvents() {
        localStorage.setItem('churchEvents', JSON.stringify(this.events));
    }

    // Atualizar data de hoje
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

    // Configurar event listeners
    setupEventListeners() {
        // Botões de navegação
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

        // Botão para adicionar evento
        const addEventBtn = document.createElement('button');
        addEventBtn.className = 'btn btn-gradient ms-2';
        addEventBtn.innerHTML = '<i class="bi bi-plus-circle"></i> Adicionar Evento';
        addEventBtn.onclick = () => this.openEventModal();
        
        const headerActions = document.querySelector('.view-selector').parentElement;
        headerActions.appendChild(addEventBtn);
    }

    // Renderizar calendário
    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Atualizar título do mês/ano
        const monthNames = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        document.getElementById('month-year').textContent = `${monthNames[month]} ${year}`;

        // Calcular primeiro dia do mês e dias no mês
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const calendarDays = document.getElementById('calendar-days');
        calendarDays.innerHTML = '';

        // Gerar 42 dias (6 semanas)
        for (let i = 0; i < 42; i++) {
            const cellDate = new Date(startDate);
            cellDate.setDate(startDate.getDate() + i);
            
            const dayCell = this.createDayCell(cellDate, month);
            calendarDays.appendChild(dayCell);
        }
    }

    // Criar célula do dia
    createDayCell(date, currentMonth) {
        const dayCell = document.createElement('div');
        dayCell.className = 'day-cell';
        
        const isCurrentMonth = date.getMonth() === currentMonth;
        const isToday = this.isToday(date);
        const dateStr = this.formatDateString(date);
        
        if (!isCurrentMonth) {
            dayCell.classList.add('other-month');
        }
        
        if (isToday) {
            dayCell.classList.add('today');
        }

        // Número do dia
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = date.getDate();
        dayCell.appendChild(dayNumber);

        // Container de eventos
        const eventsContainer = document.createElement('div');
        eventsContainer.className = 'day-events';
        
        // Adicionar eventos do dia
        const dayEvents = this.events[dateStr] || [];
        dayEvents.forEach(event => {
            const eventDot = document.createElement('div');
            eventDot.className = `event-dot ${event.type}`;
            eventDot.textContent = event.title;
            eventDot.title = `${event.time} - ${event.title}`;
            eventsContainer.appendChild(eventDot);
        });

        dayCell.appendChild(eventsContainer);

        // Adicionar evento de clique
        dayCell.onclick = () => this.selectDate(date, dayCell);

        return dayCell;
    }

    // Selecionar data
    selectDate(date, dayCell) {
        // Limpar seleção anterior
        document.querySelectorAll('.day-cell.selected').forEach(cell => {
            cell.classList.remove('selected');
        });

        // Selecionar nova data
        dayCell.classList.add('selected');
        this.selectedDate = new Date(date);
        
        // Atualizar eventos do dia selecionado
        this.updateSelectedDayEvents();
    }

    // Verificar se é hoje
    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    // Formatar data para string
    formatDateString(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Atualizar eventos de hoje
    updateTodayEvents() {
        const today = new Date();
        const todayStr = this.formatDateString(today);
        const todayEvents = this.events[todayStr] || [];
        
        const container = document.querySelector('.today-events');
        container.innerHTML = '';

        if (todayEvents.length === 0) {
            container.innerHTML = `
                <div class="text-center py-4">
                    <i class="bi bi-calendar-x text-muted" style="font-size: 2rem;"></i>
                    <p class="text-muted mt-2">Nenhum evento hoje</p>
                    <button class="btn btn-sm btn-outline-primary" onclick="calendar.addEventForToday()">
                        <i class="bi bi-plus-circle me-1"></i>
                        Adicionar Evento
                    </button>
                </div>
            `;
            return;
        }

        // Ordenar eventos por horário
        const sortedEvents = todayEvents.sort((a, b) => a.time.localeCompare(b.time));

        sortedEvents.forEach(event => {
            const eventTime = new Date(`${todayStr}T${event.time}`);
            const now = new Date();
            const isPast = eventTime < now;
            const isUpcoming = eventTime > now;
            const isNow = Math.abs(eventTime - now) < 30 * 60 * 1000; // 30 minutos

            let statusClass = '';
            let statusIcon = '';
            let statusText = '';

            if (isPast) {
                statusClass = 'text-muted';
                statusIcon = 'bi-check-circle';
                statusText = 'Concluído';
            } else if (isNow) {
                statusClass = 'text-warning';
                statusIcon = 'bi-clock';
                statusText = 'Agora';
            } else {
                statusClass = 'text-info';
                statusIcon = 'bi-hourglass-split';
                statusText = 'Próximo';
            }

            const eventItem = document.createElement('div');
            eventItem.className = `event-item d-flex align-items-center gap-3 ${isPast ? 'opacity-75' : ''}`;
            eventItem.innerHTML = `
                <div class="event-category ${event.type}"></div>
                <div class="event-time ${statusClass}">${event.time}</div>
                <div class="event-info flex-grow-1" onclick="calendar.showEventDetails('${todayStr}', ${event.id})" style="cursor: pointer;">
                    <h6 class="mb-1 d-flex align-items-center gap-2">
                        ${event.title}
                        <small class="badge bg-light text-dark">
                            <i class="${statusIcon} me-1"></i>${statusText}
                        </small>
                    </h6>
                    <small class="text-muted">${event.location}</small>
                </div>
                <div class="event-actions">
                    <button class="btn btn-sm btn-outline-info" onclick="calendar.showEventDetails('${todayStr}', ${event.id})" title="Ver Detalhes">
                        <i class="bi bi-info-circle"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-primary" onclick="calendar.editEvent('${todayStr}', ${event.id})" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="calendar.deleteEvent('${todayStr}', ${event.id})" title="Excluir">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `;
            container.appendChild(eventItem);
        });

        // Adicionar botão para adicionar mais eventos
        const addMoreBtn = document.createElement('div');
        addMoreBtn.className = 'text-center mt-3 border-top pt-3';
        addMoreBtn.innerHTML = `
            <button class="btn btn-sm btn-outline-primary" onclick="calendar.addEventForToday()">
                <i class="bi bi-plus-circle me-1"></i>
                Adicionar Outro Evento
            </button>
        `;
        container.appendChild(addMoreBtn);
    }

    // Adicionar evento para hoje
    addEventForToday() {
        const today = new Date();
        this.selectedDate = today;
        this.openEventModal();
    }

    // Deletar evento
    deleteEvent(dateStr, eventId) {
        if (confirm('Tem certeza que deseja excluir este evento?')) {
            if (this.events[dateStr]) {
                this.events[dateStr] = this.events[dateStr].filter(e => e.id !== eventId);
                if (this.events[dateStr].length === 0) {
                    delete this.events[dateStr];
                }
                this.saveEvents();
                
                // Atualizar interface
                this.renderCalendar();
                this.updateTodayEvents();
                this.updateUpcomingEvents();
                this.updateStats();
            }
        }
    }

    // Atualizar eventos do dia selecionado
    updateSelectedDayEvents() {
        if (!this.selectedDate) return;
        
        const selectedStr = this.formatDateString(this.selectedDate);
        const selectedEvents = this.events[selectedStr] || [];
        
        // Pode implementar um modal ou painel lateral para mostrar eventos do dia selecionado
        console.log('Eventos do dia selecionado:', selectedEvents);
    }

    // Atualizar próximos eventos
    updateUpcomingEvents() {
        const container = document.querySelector('.upcoming-events');
        const upcomingEvents = this.getUpcomingEvents();
        
        container.innerHTML = '';

        if (upcomingEvents.length === 0) {
            container.innerHTML = '<p class="text-muted text-center">Nenhum evento próximo</p>';
            return;
        }

        upcomingEvents.forEach(event => {
            const eventDate = new Date(event.date);
            const day = eventDate.getDate();
            const month = eventDate.toLocaleDateString('pt-BR', { month: 'short' });
            
            const eventElement = document.createElement('div');
            eventElement.className = 'upcoming-event p-3 mb-3';
            eventElement.style.cursor = 'pointer';
            eventElement.innerHTML = `
                <div class="d-flex gap-3 align-items-center">
                    <div class="text-center" style="min-width: 50px;">
                        <div class="upcoming-day">${day}</div>
                        <div class="upcoming-month">${month}</div>
                    </div>
                    <div class="flex-grow-1" onclick="calendar.goToEventDate('${event.date}')">
                        <h6 class="mb-1">${event.title}</h6>
                        <small class="text-muted">${this.getDayOfWeek(eventDate)}, ${event.time} - ${event.location}</small>
                        <div class="event-type-badge mt-1">
                            <span class="badge" style="background-color: ${this.eventTypes[event.type].color}; font-size: 0.7rem;">
                                ${this.eventTypes[event.type].name}
                            </span>
                        </div>
                    </div>
                    <div class="event-actions">
                        <button class="btn btn-sm btn-outline-info" onclick="calendar.showEventDetails('${event.date}', ${event.id})" title="Ver Detalhes">
                            <i class="bi bi-info-circle"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-primary" onclick="calendar.editEvent('${event.date}', ${event.id})" title="Editar">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="calendar.deleteEvent('${event.date}', ${event.id})" title="Excluir">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            
            // Adicionar evento de clique para navegar para a data
            eventElement.addEventListener('click', (e) => {
                // Evitar que o clique nos botões dispare a navegação
                if (!e.target.closest('.event-actions')) {
                    this.goToEventDate(event.date);
                }
            });
            
            container.appendChild(eventElement);
        });
    }

    // Obter próximos eventos
    getUpcomingEvents() {
        const today = new Date();
        const upcomingEvents = [];
        
        Object.keys(this.events).forEach(dateStr => {
            const eventDate = new Date(dateStr);
            if (eventDate > today) {
                this.events[dateStr].forEach(event => {
                    upcomingEvents.push({
                        ...event,
                        date: dateStr
                    });
                });
            }
        });

        // Ordenar por data
        upcomingEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        return upcomingEvents.slice(0, 10); // Primeiros 10 eventos
    }

    // Obter dia da semana
    getDayOfWeek(date) {
        const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        return days[date.getDay()];
    }

    // Atualizar estatísticas
    updateStats() {
        const currentMonth = this.currentDate.getMonth();
        const currentYear = this.currentDate.getFullYear();
        
        let totalEvents = 0;
        let worshipEvents = 0;
        let studyEvents = 0;
        let specialEvents = 0;

        Object.keys(this.events).forEach(dateStr => {
            const eventDate = new Date(dateStr);
            if (eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear) {
                this.events[dateStr].forEach(event => {
                    totalEvents++;
                    if (event.type === 'worship') worshipEvents++;
                    if (event.type === 'study') studyEvents++;
                    if (event.type === 'special') specialEvents++;
                });
            }
        });

        // Atualizar os números nas estatísticas
        const statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers.length >= 4) {
            statNumbers[0].textContent = totalEvents;
            statNumbers[1].textContent = worshipEvents;
            statNumbers[2].textContent = studyEvents;
            statNumbers[3].textContent = specialEvents;
        }
    }

    // Criar modal de evento
    createEventModal() {
        const modalHTML = `
            <div class="modal fade" id="eventModal" tabindex="-1">
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
                                    <label for="eventDate" class="form-label">Data</label>
                                    <input type="date" class="form-control" id="eventDate" required>
                                </div>
                                <div class="mb-3">
                                    <label for="eventTime" class="form-label">Horário</label>
                                    <input type="time" class="form-control" id="eventTime" required>
                                </div>
                                <div class="mb-3">
                                    <label for="eventType" class="form-label">Tipo de Evento</label>
                                    <select class="form-select" id="eventType" required>
                                        <option value="">Selecione o tipo</option>
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
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-gradient" onclick="calendar.saveEvent()">Salvar Evento</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Abrir modal de evento
    openEventModal(editEvent = null, eventDate = null) {
        const modal = new bootstrap.Modal(document.getElementById('eventModal'));
        const form = document.getElementById('eventForm');
        
        if (editEvent) {
            // Modo edição
            document.querySelector('.modal-title').textContent = 'Editar Evento';
            document.getElementById('eventTitle').value = editEvent.title;
            document.getElementById('eventDate').value = eventDate;
            document.getElementById('eventTime').value = editEvent.time;
            document.getElementById('eventType').value = editEvent.type;
            document.getElementById('eventLocation').value = editEvent.location;
            
            // Armazenar dados para edição
            form.dataset.editMode = 'true';
            form.dataset.eventId = editEvent.id;
            form.dataset.eventDate = eventDate;
        } else {
            // Modo criação
            document.querySelector('.modal-title').textContent = 'Adicionar Evento';
            form.reset();
            delete form.dataset.editMode;
            delete form.dataset.eventId;
            delete form.dataset.eventDate;
            
            // Se tiver data selecionada, usar ela
            if (this.selectedDate) {
                document.getElementById('eventDate').value = this.formatDateString(this.selectedDate);
            }
        }
        
        modal.show();
    }

    // Salvar evento
    saveEvent() {
        const form = document.getElementById('eventForm');
        const title = document.getElementById('eventTitle').value;
        const date = document.getElementById('eventDate').value;
        const time = document.getElementById('eventTime').value;
        const type = document.getElementById('eventType').value;
        const location = document.getElementById('eventLocation').value;

        if (!title || !date || !time || !type || !location) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        const eventData = {
            id: form.dataset.editMode ? parseInt(form.dataset.eventId) : Date.now(),
            title,
            time,
            type,
            location
        };

        if (form.dataset.editMode) {
            // Editar evento existente
            const oldDate = form.dataset.eventDate;
            this.updateEvent(oldDate, eventData, date);
        } else {
            // Adicionar novo evento
            this.addEvent(date, eventData);
        }

        // Fechar modal
        bootstrap.Modal.getInstance(document.getElementById('eventModal')).hide();
        
        // Atualizar interface
        this.renderCalendar();
        this.updateTodayEvents();
        this.updateUpcomingEvents();
        this.updateStats();
    }

    // Adicionar evento
    addEvent(date, eventData) {
        if (!this.events[date]) {
            this.events[date] = [];
        }
        this.events[date].push(eventData);
        this.saveEvents();
    }

    // Atualizar evento
    updateEvent(oldDate, eventData, newDate) {
        // Remover do date antigo
        if (this.events[oldDate]) {
            this.events[oldDate] = this.events[oldDate].filter(e => e.id !== eventData.id);
            if (this.events[oldDate].length === 0) {
                delete this.events[oldDate];
            }
        }
        
        // Adicionar no novo date
        if (!this.events[newDate]) {
            this.events[newDate] = [];
        }
        this.events[newDate].push(eventData);
        this.saveEvents();
    }

    // Editar evento
    editEvent(dateStr, eventId) {
        const event = this.events[dateStr]?.find(e => e.id === eventId);
        if (event) {
            this.openEventModal(event, dateStr);
        }
    }

    // Navegar para data específica do evento
    goToEventDate(dateStr) {
        const eventDate = new Date(dateStr);
        this.currentDate = new Date(eventDate.getFullYear(), eventDate.getMonth(), 1);
        this.renderCalendar();
        
        // Selecionar o dia automaticamente após um pequeno delay
        setTimeout(() => {
            const dayCell = this.findDayCell(eventDate);
            if (dayCell) {
                this.selectDate(eventDate, dayCell);
                dayCell.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
        
        this.updateTodayEvents();
        this.updateUpcomingEvents();
        this.updateStats();
    }

    // Encontrar célula do dia específico
    findDayCell(targetDate) {
        const dayCells = document.querySelectorAll('.day-cell');
        const targetDay = targetDate.getDate();
        const targetMonth = targetDate.getMonth();
        
        for (let cell of dayCells) {
            const dayNumber = cell.querySelector('.day-number');
            if (dayNumber && parseInt(dayNumber.textContent) === targetDay) {
                // Verificar se é do mês correto (não other-month)
                if (!cell.classList.contains('other-month')) {
                    return cell;
                }
            }
        }
        return null;
    }

    // Mostrar detalhes do evento
    showEventDetails(dateStr, eventId) {
        const event = this.events[dateStr]?.find(e => e.id === eventId);
        if (!event) return;

        const eventDate = new Date(dateStr);
        const formattedDate = eventDate.toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Criar modal de detalhes
        const detailsModal = `
            <div class="modal fade" id="eventDetailsModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header" style="background: ${this.eventTypes[event.type].color}; color: white;">
                            <h5 class="modal-title">
                                <i class="bi bi-calendar-event me-2"></i>
                                Detalhes do Evento
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="event-detail-card">
                                <div class="row g-3">
                                    <div class="col-12">
                                        <h4 class="text-primary mb-3">${event.title}</h4>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="detail-item">
                                            <i class="bi bi-calendar3 text-muted me-2"></i>
                                            <strong>Data:</strong><br>
                                            <span class="ms-4">${formattedDate}</span>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="detail-item">
                                            <i class="bi bi-clock text-muted me-2"></i>
                                            <strong>Horário:</strong><br>
                                            <span class="ms-4">${event.time}</span>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="detail-item">
                                            <i class="bi bi-geo-alt text-muted me-2"></i>
                                            <strong>Local:</strong><br>
                                            <span class="ms-4">${event.location}</span>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="detail-item">
                                            <i class="bi bi-tag text-muted me-2"></i>
                                            <strong>Categoria:</strong><br>
                                            <span class="badge ms-4" style="background-color: ${this.eventTypes[event.type].color}">
                                                ${this.eventTypes[event.type].name}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <div class="detail-item">
                                            <i class="bi bi-hourglass-split text-muted me-2"></i>
                                            <strong>Tempo restante:</strong><br>
                                            <span class="ms-4 text-info">${this.getTimeUntilEvent(dateStr, event.time)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline-secondary" onclick="calendar.goToEventDate('${dateStr}')">
                                <i class="bi bi-calendar-check me-1"></i>
                                Ver no Calendário
                            </button>
                            <button type="button" class="btn btn-outline-primary" onclick="calendar.editEvent('${dateStr}', ${event.id}); bootstrap.Modal.getInstance(document.getElementById('eventDetailsModal')).hide();">
                                <i class="bi bi-pencil me-1"></i>
                                Editar
                            </button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remover modal existente se houver
        const existingModal = document.getElementById('eventDetailsModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Adicionar novo modal
        document.body.insertAdjacentHTML('beforeend', detailsModal);
        
        // Mostrar modal
        const modal = new bootstrap.Modal(document.getElementById('eventDetailsModal'));
        modal.show();

        // Remover modal do DOM quando fechado
        document.getElementById('eventDetailsModal').addEventListener('hidden.bs.modal', function() {
            this.remove();
        });
    }

    // Calcular tempo até o evento
    getTimeUntilEvent(dateStr, time) {
        const eventDateTime = new Date(`${dateStr}T${time}`);
        const now = new Date();
        const diffMs = eventDateTime.getTime() - now.getTime();

        if (diffMs < 0) {
            return 'Evento já ocorreu';
        }

        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
            return `${days} dia${days > 1 ? 's' : ''} e ${hours} hora${hours !== 1 ? 's' : ''}`;
        } else if (hours > 0) {
            return `${hours} hora${hours !== 1 ? 's' : ''} e ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
        } else {
            return `${minutes} minuto${minutes !== 1 ? 's' : ''}`;
        }
    }
}

// Inicializar calendário quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    window.calendar = new EventCalendar();
});

// Funções globais para compatibilidade
function previousMonth() {
    if (window.calendar) {
        window.calendar.currentDate.setMonth(window.calendar.currentDate.getMonth() - 1);
        window.calendar.renderCalendar();
        window.calendar.updateTodayEvents();
        window.calendar.updateUpcomingEvents();
        window.calendar.updateStats();
    }
}

function nextMonth() {
    if (window.calendar) {
        window.calendar.currentDate.setMonth(window.calendar.currentDate.getMonth() + 1);
        window.calendar.renderCalendar();
        window.calendar.updateTodayEvents();
        window.calendar.updateUpcomingEvents();
        window.calendar.updateStats();
    }
}