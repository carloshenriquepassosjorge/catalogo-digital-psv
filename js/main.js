// PS do Vidro - Catálogo Digital
document.addEventListener('DOMContentLoaded', function() {
    
    // ACCORDION
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const accordionItem = this.parentElement;
            const isActive = accordionItem.classList.contains('active');
            // Fecha todos os outros
            document.querySelectorAll('.accordion-item').forEach(item => {
                if(item !== accordionItem) item.classList.remove('active');
            });
            
            // Toggle este
            if(isActive) {
                accordionItem.classList.remove('active');
            } else {
                accordionItem.classList.add('active');
                // Scroll para o header do accordion aberto
                setTimeout(() => {
                    this.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
            }
        });
    });
    
    // Hero button scroll
    const heroButton = document.querySelector('.hero-button');
    if(heroButton) {
        heroButton.addEventListener('click', function() {
            document.querySelector('.destaques-container').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    
    // ANIMAÇÕES ON SCROLL com Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = entry.target.dataset.animation || 
                    entry.target.style.animation;
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar elementos para animar (EXCETO Hero, CTA e Footer)
    const animatedElements = document.querySelectorAll(
        '.section-small-label, .section-heading, .destaques-heading, ' +
        '.accordion-title, .product-card-destaque, .product-card-normal'
    );
    
    animatedElements.forEach(el => {
        // Remove animação inicial
        const currentAnimation = window.getComputedStyle(el).animation;
        el.dataset.animation = currentAnimation;
        el.style.animation = 'none';
        el.style.opacity = '0';
        
        // Observa elemento
        observer.observe(el);
    });
    
    // BOTÃO WHATSAPP - Mostrar após hero sair da tela
    const whatsappBtn = document.querySelector('.btn-whatsapp-tab');
    const hero = document.querySelector('.hero, .hero-produto');
    
    if (whatsappBtn && hero) {
        const whatsappObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    // Hero saiu da tela - mostrar botão
                    whatsappBtn.classList.add('visible');
                } else {
                    // Hero está na tela - esconder botão
                    whatsappBtn.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });
        
        whatsappObserver.observe(hero);
    }
});
