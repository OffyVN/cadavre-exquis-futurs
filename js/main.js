/**
 * Cadavre Exquis des Futurs — Main Script
 * Navigation et interactions pages publiques
 */

document.addEventListener('DOMContentLoaded', function() {
    initSmoothScroll();
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

                // Calculer l'offset pour le bandeau festival
                const bannerHeight = document.querySelector('.festival-banner')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - bannerHeight - 20;

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
