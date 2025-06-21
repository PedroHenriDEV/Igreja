// Filter functionality
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                // Here you would implement actual filtering logic
                console.log('Filter by:', this.textContent);
            });
        });

        // Load more functionality
        document.querySelector('.load-more-btn').addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Carregando...';
            
            // Simulate loading
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-plus me-2"></i>Carregar Mais Cultos';
                // Here you would load more posts
                console.log('Loading more posts...');
            }, 1500);
        });

        // Add hover effects and animations
        document.querySelectorAll('.post-card, .featured-post').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.cursor = 'pointer';
            });
            
            card.addEventListener('click', function() {
                console.log('Navigate to post detail');
            });
        });