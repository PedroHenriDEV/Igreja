let currentStep = 1;
        let countdownTimer;
        let countdownValue = 60;

        // Step 1: Send verification code
        function sendCode() {
            const email = document.getElementById('email').value;
            
            if (!email || !email.includes('@')) {
                document.getElementById('email').classList.add('is-invalid');
                return;
            }
            
            document.getElementById('email').classList.remove('is-invalid');
            const btn = event.target;
            const originalHTML = btn.innerHTML;
            
            // Loading state
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Enviando...';
            btn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Show step 2
                document.getElementById('formStep1').classList.add('d-none');
                document.getElementById('formStep2').classList.remove('d-none');
                
                // Update step indicators
                document.getElementById('step1').classList.remove('active');
                document.getElementById('step1').classList.add('completed');
                document.getElementById('line1').classList.add('completed');
                document.getElementById('step2').classList.add('active');
                
                // Display email
                document.getElementById('emailDisplay').textContent = email;
                
                // Start countdown
                startCountdown();
                
                currentStep = 2;
                
                // Reset button
                btn.innerHTML = originalHTML;
                btn.disabled = false;
            }, 2000);
        }

        // Step 2: Code verification
        function verifyCode() {
            const code = [];
            for (let i = 1; i <= 6; i++) {
                const value = document.getElementById(`code${i}`).value;
                if (!value) {
                    document.getElementById(`code${i}`).classList.add('is-invalid');
                    return;
                }
                code.push(value);
                document.getElementById(`code${i}`).classList.remove('is-invalid');
            }
            
            const fullCode = code.join('');
            const btn = event.target;
            const originalHTML = btn.innerHTML;
            
            // Loading state
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Verificando...';
            btn.disabled = true;
            
            // Simulate API verification
            setTimeout(() => {
                // For demo, accept any 6-digit code
                if (fullCode.length === 6) {
                    // Show step 3
                    document.getElementById('formStep2').classList.add('d-none');
                    document.getElementById('formStep3').classList.remove('d-none');
                    
                    // Update step indicators
                    document.getElementById('step2').classList.remove('active');
                    document.getElementById('step2').classList.add('completed');
                    document.getElementById('line2').classList.add('completed');
                    document.getElementById('step3').classList.add('active');
                    
                    // Clear countdown
                    clearInterval(countdownTimer);
                    
                    currentStep = 3;
                } else {
                    // Invalid code
                    for (let i = 1; i <= 6; i++) {
                        document.getElementById(`code${i}`).classList.add('is-invalid');
                    }
                }
                
                // Reset button
                btn.innerHTML = originalHTML;
                btn.disabled = false;
            }, 1500);
        }

        // Step navigation functions
        function backToStep1() {
            document.getElementById('formStep2').classList.add('d-none');
            document.getElementById('formStep1').classList.remove('d-none');
            
            // Update step indicators
            document.getElementById('step2').classList.remove('active');
            document.getElementById('step1').classList.remove('completed');
            document.getElementById('step1').classList.add('active');
            document.getElementById('line1').classList.remove('completed');
            
            clearInterval(countdownTimer);
            currentStep = 1;
        }

        function backToStep2() {
            document.getElementById('formStep3').classList.add('d-none');
            document.getElementById('formStep2').classList.remove('d-none');
            
            // Update step indicators
            document.getElementById('step3').classList.remove('active');
            document.getElementById('step2').classList.remove('completed');
            document.getElementById('step2').classList.add('active');
            document.getElementById('line2').classList.remove('completed');
            
            currentStep = 2;
        }

        // Resend code
        function resendCode() {
            const btn = document.getElementById('resendBtn');
            btn.disabled = true;
            btn.textContent = 'Enviando...';
            
            setTimeout(() => {
                btn.textContent = 'Código reenviado!';
                btn.classList.add('success-animation');
                
                // Restart countdown
                countdownValue = 60;
                startCountdown();
                
                setTimeout(() => {
                    btn.textContent = 'Reenviar código';
                    btn.classList.remove('success-animation');
                }, 2000);
            }, 1000);
        }

        // Countdown timer
        function startCountdown() {
            const resendBtn = document.getElementById('resendBtn');
            const countdownElement = document.getElementById('countdown');
            
            resendBtn.disabled = true;
            countdownValue = 60;
            
            countdownTimer = setInterval(() => {
                countdownValue--;
                countdownElement.textContent = countdownValue;
                
                if (countdownValue <= 0) {
                    clearInterval(countdownTimer);
                    resendBtn.disabled = false;
                    countdownElement.textContent = '60';
                }
            }, 1000);
        }

        // Toggle password visibility
        function togglePassword(inputId) {
            const input = document.getElementById(inputId);
            const button = input.nextElementSibling.nextElementSibling;
            const icon = button.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'bi bi-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'bi bi-eye';
            }
        }

        // Form submission (Step 3)
        document.getElementById('recoveryForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmNewPassword').value;
            
            if (newPassword !== confirmPassword) {
                document.getElementById('confirmNewPassword').classList.add('is-invalid');
                return;
            }
            
            if (newPassword.length < 6) {
                document.getElementById('newPassword').classList.add('is-invalid');
                return;
            }
            
            document.getElementById('newPassword').classList.remove('is-invalid');
            document.getElementById('confirmNewPassword').classList.remove('is-invalid');
            
            const btn = this.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;
            
            // Loading state
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Alterando...';
            btn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Success feedback
                btn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Senha Alterada!';
                btn.classList.remove('btn-recover');
                btn.classList.add('btn-success');
                
                setTimeout(() => {
                    // Show success message
                    const alertDiv = document.createElement('div');
                    alertDiv.className = 'alert alert-success alert-dismissible fade show mt-3';
                    alertDiv.innerHTML = `
                        <i class="bi bi-check-circle me-2"></i>
                        <strong>Senha alterada com sucesso!</strong>
                        <br><small>Redirecionando para o login...</small>
                    `;
                    
                    document.querySelector('.card-body').appendChild(alertDiv);
                    
                    // Redirect to login
                    setTimeout(() => {
                        window.location.href = '/login.html'; // ou 'login.html'
                    }, 2000);
                }, 1000);
            }, 2000);
        });

        // Code input navigation
        document.addEventListener('DOMContentLoaded', function() {
            const codeInputs = document.querySelectorAll('[id^="code"]');
            
            codeInputs.forEach((input, index) => {
                input.addEventListener('input', function() {
                    if (this.value.length === 1 && index < codeInputs.length - 1) {
                        codeInputs[index + 1].focus();
                    }
                });
                
                input.addEventListener('keydown', function(e) {
                    if (e.key === 'Backspace' && this.value === '' && index > 0) {
                        codeInputs[index - 1].focus();
                    }
                });
            });
        });

        // Enhanced form interactions
        const inputs = document.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                if (this.closest('.form-floating')) {
                    this.closest('.form-floating').style.transform = 'scale(1.01)';
                    this.closest('.form-floating').style.transition = 'transform 0.2s ease';
                }
            });
            
            input.addEventListener('blur', function() {
                if (this.closest('.form-floating')) {
                    this.closest('.form-floating').style.transform = 'scale(1)';
                }
            });
        });