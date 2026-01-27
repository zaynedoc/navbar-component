/* NAVBAR COMPONENT JAVASCRIPT */

// Logo spin animation on hover
(function() {
    const logo = document.getElementById('sidebarLogo');
    if (!logo) return;
    logo.addEventListener('mouseenter', function() { this.classList.add('spin-hover'); });
    logo.addEventListener('mouseleave', function() { this.classList.remove('spin-hover'); });
})();

// Social icons hover effects
(function() {
    const container = document.getElementById('socialIconsContainer');
    if (!container) return;
    const links = container.querySelectorAll('.social-icon-link');
    links.forEach(link => {
        link.addEventListener('mouseenter', function() { this.classList.add('hovered'); });
        link.addEventListener('mouseleave', function() { this.classList.remove('hovered'); });
    });
})();