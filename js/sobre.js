function animateNumber(element, target) {
    let current = 0;
    const increment = target / 50;
    const showPlus = element.getAttribute('data-plus') === 'true';

    const timer = setInterval(() => {
        current += increment;

        if (current >= target) {
            clearInterval(timer);
            element.textContent = showPlus ? target + '+' : target;
        } else {
            element.textContent = Math.floor(current);
        }
    }, 40);
}

 window.addEventListener('load', () => {
            setTimeout(() => {
                document.querySelectorAll('.stats-number').forEach(number => {
                    const target = parseInt(number.getAttribute('data-target'));
                    animateNumber(number, target);
                });
            }, 1000);
        });