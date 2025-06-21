 // Tab functionality
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                console.log('Filter by:', this.textContent);
            });
        });

        // Team member click
        document.querySelectorAll('.team-member').forEach(member => {
            member.addEventListener('click', function() {
                const name = this.querySelector('h6').textContent;
                console.log('View profile:', name);
            });
        });

        // Resource links
        document.querySelectorAll('.resource-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const resource = this.querySelector('h6').textContent;
                console.log('Access resource:', resource);
            });
        });

        // Load more functionality
        document.querySelector('.load-more-btn').addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Carregando...';
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-plus me-2"></i>Ver Mais Notícias';
                console.log('Loading more ministry news...');
            }, 1500);
        });

        // Article cards click
        document.querySelectorAll('.article-card, .featured-article').forEach(card => {
            card.addEventListener('click', function() {
                const title = this.querySelector('.article-title').textContent;
                console.log('Open article:', title);
            });
        });

        // Schedule items hover effect
        document.querySelectorAll('.schedule-item').forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(5px)';
                this.style.transition = 'transform 0.3s ease';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateX(0)';
            });
        });