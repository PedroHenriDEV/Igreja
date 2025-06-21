   document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const btn = this.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;
            
            if (email && password) {
                // Loading state
                btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Entrando...';
                btn.disabled = true;
                
                // Simulate API call
                setTimeout(() => {
                    // Success feedback
                    btn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Sucesso!';
                    btn.classList.remove('btn-login');
                    btn.classList.add('btn-success');
                    
                    setTimeout(() => {
                        // Show success message
                        const alertDiv = document.createElement('div');
                        alertDiv.className = 'alert alert-success alert-dismissible fade show mt-3';
                        alertDiv.innerHTML = `
                            <i class="bi bi-check-circle me-2"></i>
                            <strong>Login realizado com sucesso!</strong>
                            <br><small>Redirecionando para a página inicial...</small>
                        `;
                        
                        document.querySelector('.card-body').appendChild(alertDiv);
                        
                        // Redirect to home page
                        setTimeout(() => {
                            window.location.href = '/index.html'; // ou 'home.html' ou 'index.html'
                        }, 1500);
                    }, 1000);
                }, 2000);
            }
        });

        // Enhanced form interactions
        const inputs = document.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.closest('.form-floating').style.transform = 'scale(1.01)';
                this.closest('.form-floating').style.transition = 'transform 0.2s ease';
            });
            
            input.addEventListener('blur', function() {
                this.closest('.form-floating').style.transform = 'scale(1)';
            });
        });

        // Show password toggle (optional enhancement)
        const passwordInput = document.getElementById('password');
        const passwordContainer = passwordInput.closest('.form-floating');
        
        // Add toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'btn btn-outline-secondary position-absolute end-0 top-50 translate-middle-y me-3';
        toggleBtn.style.zIndex = '10';
        toggleBtn.innerHTML = '<i class="bi bi-eye"></i>';
        
        passwordContainer.style.position = 'relative';
        passwordContainer.appendChild(toggleBtn);
        
        toggleBtn.addEventListener('click', function() {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            this.innerHTML = type === 'password' ? '<i class="bi bi-eye"></i>' : '<i class="bi bi-eye-slash"></i>';
        });