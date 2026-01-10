/**
 * Cadavre Exquis des Futurs — Main Script
 * Navigation, animations reveal au scroll
 */

document.addEventListener('DOMContentLoaded', function() {
    initSmoothScroll();
    initScrollReveal();
});

/**
 * Navigation fluide vers les ancres
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            // Ignorer les liens vides ou "#"
            if (!targetId || targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();

                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Mettre à jour l'URL sans scroll
                history.pushState(null, '', targetId);
            }
        });
    });
}

/**
 * Système d'animation reveal au scroll
 * Utilise IntersectionObserver pour de meilleures performances
 */
function initScrollReveal() {
    // Sélectionner tous les éléments à animer
    const revealElements = document.querySelectorAll(
        '.reveal-on-scroll, .reveal-fade, .reveal-scale'
    );

    // Si pas d'éléments ou si prefers-reduced-motion, tout révéler immédiatement
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        revealElements.forEach(el => el.classList.add('revealed'));
        return;
    }

    // Configuration de l'observer
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px', // Déclencher un peu avant que l'élément soit visible
        threshold: 0.1
    };

    // Créer l'observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Ajouter un délai stagger si défini
                const delay = entry.target.dataset.revealDelay || 0;

                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);

                // Ne plus observer après révélation (animation unique)
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observer chaque élément avec stagger delay pour les siblings
    revealElements.forEach((el, index) => {
        // Calculer le délai stagger basé sur les éléments frères
        if (el.parentElement) {
            const siblings = el.parentElement.querySelectorAll(
                '.reveal-on-scroll, .reveal-fade, .reveal-scale'
            );
            const siblingIndex = Array.from(siblings).indexOf(el);
            if (siblingIndex > 0) {
                el.dataset.revealDelay = siblingIndex * 100; // 100ms entre chaque
            }
        }

        observer.observe(el);
    });
}
