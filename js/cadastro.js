  let currentStep = 1;

    // Navegação dos passos
    function nextStep(step) {
        if (validateCurrentStep()) {
            document.getElementById(`formStep${currentStep}`).classList.add('d-none');
            document.getElementById(`formStep${step}`).classList.remove('d-none');

            document.getElementById(`step${currentStep}`).classList.remove('active');
            document.getElementById(`step${currentStep}`).classList.add('completed');
            document.getElementById(`line${currentStep}`).classList.add('completed');
            document.getElementById(`step${step}`).classList.add('active');

            currentStep = step;
        }
    }

    function prevStep(step) {
        document.getElementById(`formStep${currentStep}`).classList.add('d-none');
        document.getElementById(`formStep${step}`).classList.remove('d-none');

        document.getElementById(`step${currentStep}`).classList.remove('active');
        document.getElementById(`step${step}`).classList.remove('completed');
        document.getElementById(`step${step}`).classList.add('active');

        if (step < 3) {
            document.getElementById(`line${step}`).classList.remove('completed');
        }

        currentStep = step;
    }

    // Validação dos passos
    function validateCurrentStep() {
        const currentStepElement = document.getElementById(`formStep${currentStep}`);
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
            }
        });

        // Validação de confirmação de senha
        if (currentStep === 2) {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                document.getElementById('confirmPassword').classList.add('is-invalid');
                isValid = false;
            } else {
                document.getElementById('confirmPassword').classList.remove('is-invalid');
            }
        }

        return isValid;
    }

    // Verificador de força da senha
    function checkPasswordStrength(password) {
        let strength = 0;
        const strengthBar = document.getElementById('passwordStrength');

        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        strengthBar.className = 'password-strength mb-3';

        if (strength < 3) {
            strengthBar.classList.add('strength-weak');
        } else if (strength < 5) {
            strengthBar.classList.add('strength-medium');
        } else {
            strengthBar.classList.add('strength-strong');
        }
    }

    // Mostrar e ocultar senha
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

    // Submissão do formulário
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();

        if (validateCurrentStep()) {
            const btn = this.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;

            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Cadastrando...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Cadastro Realizado!';
                btn.classList.remove('btn-register');
                btn.classList.add('btn-success');

                setTimeout(() => {
                    const alertDiv = document.createElement('div');
                    alertDiv.className = 'alert alert-success alert-dismissible fade show mt-3';
                    alertDiv.innerHTML = `
                        <i class="bi bi-check-circle me-2"></i>
                        <strong>Bem-vindo à nossa comunidade!</strong>
                        <br><small>Cadastro realizado! Redirecionando para a página inicial...</small>
                    `;
                    document.querySelector('.card-body').appendChild(alertDiv);

                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                }, 1000);
            }, 2500);
        }
    });

    // Máscara de telefone
    document.getElementById('phone').addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
        this.value = value;
    });

    // Máscara de CPF
    document.getElementById('cpf').addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);

        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

        this.value = value;
    });

    // Animação nos campos
    const inputs = document.querySelectorAll('.form-control, .form-select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.closest('.form-floating').style.transform = 'scale(1.01)';
            this.closest('.form-floating').style.transition = 'transform 0.2s ease';
        });

        input.addEventListener('blur', function() {
            this.closest('.form-floating').style.transform = 'scale(1)';
        });
    });

    // Força da senha ao digitar
    document.getElementById('password').addEventListener('input', function() {
        checkPasswordStrength(this.value);
    });