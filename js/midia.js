 // Initialize tooltips
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Fade in animation on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        // Contact function
        function showContact() {
            const toastEl = document.createElement('div');
            toastEl.className = 'toast position-fixed bottom-0 end-0 m-3';
            toastEl.setAttribute('role', 'alert');
            toastEl.innerHTML = `
                <div class="toast-header bg-primary text-white">
                    <i class="bi bi-chat-heart me-2"></i>
                    <strong class="me-auto">Ministério de Mídia</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">
                    <p class="mb-2"><strong>Entre em contato conosco:</strong></p>
                    <div class="d-grid gap-2">
                        <a href="mailto:midia@igreja.com" class="btn btn-sm btn-outline-primary">
                            <i class="bi bi-envelope me-2"></i>midia@igreja.com
                        </a>
                        <a href="https://wa.me/5511999999999" class="btn btn-sm btn-outline-success">
                            <i class="bi bi-whatsapp me-2"></i>(11) 99999-9999
                        </a>
                    </div>
                </div>
            `;
            document.body.appendChild(toastEl);
            const toast = new bootstrap.Toast(toastEl);
            toast.show();
            
            setTimeout(() => {
                toastEl.remove();
            }, 8000);
        }

        // Add initial fade-in animation to hero elements
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.querySelectorAll('.hero-section .fade-in').forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('visible');
                    }, index * 200);
                });
            }, 300);
        });

        function scrollGaleria(direction) {
  const galeria = document.getElementById("galeriaScroll");
  const scrollAmount = 300 * direction;
  galeria.scrollBy({ left: scrollAmount, behavior: "smooth" });
}

// Upload dinâmico para galeria
document.getElementById("uploadForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const input = document.getElementById("fotoInput");
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const imgUrl = e.target.result;

    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-3 me-3 flex-shrink-0";
    col.innerHTML = `
      <div class="gallery-item">
        <img src="${imgUrl}" alt="Nova imagem" class="img-fluid rounded">
      </div>
    `;
    document.getElementById("galeriaScroll").appendChild(col);
    input.value = "";
  };
  reader.readAsDataURL(file);
});