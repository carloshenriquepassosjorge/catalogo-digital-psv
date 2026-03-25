// PS do Vidro - Página de Produto
document.addEventListener('DOMContentLoaded', function() {

    let currentSlide = 0;
    const heroSection = document.querySelector('.hero-produto');
    const heroBg = heroSection ? heroSection.querySelector('.hero-bg') : null;
    const sliderDots = document.querySelectorAll('.slider-dot');

    // Imagens do hero lidas do HTML via data attributes
    const heroImagens = [
        heroSection ? heroSection.dataset['slide-0'] : null,
        heroSection ? heroSection.dataset['slide-1'] : null,
        heroSection ? heroSection.dataset['slide-2'] : null,
    ];

    let transitioning = false;

    function goToSlide(index) {
        if (index < 0) index = 0;
        if (index >= heroImagens.length) index = heroImagens.length - 1;
        if (transitioning) return;

        currentSlide = index;

        const src = heroImagens[currentSlide];

        // Atualiza dots
        sliderDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });

        if (!heroSection || !src) return;

        transitioning = true;

        const img = new Image();
        img.onload = function() {
            const isFirst = !heroSection.classList.contains('slide-ready');

            if (isFirst) {
                // Primeira imagem: coloca direto no ::before, sem fade
                heroSection.style.setProperty('--slide-current', `url('../${src}')`);
                heroSection.classList.add('slide-ready');
                transitioning = false;
            } else {
                // Crossfade real:
                // 1. hero-bg (z-index 2) recebe a nova imagem e faz fade-in sobre ::before
                heroBg.style.backgroundImage = `url('../${src}')`;

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        heroBg.classList.add('visible'); // fade-in 0.7s

                        setTimeout(() => {
                            // 2. Após fade-in: atualiza ::before com nova imagem
                            heroSection.style.setProperty('--slide-current', `url('../${src}')`);
                            // 3. Esconde hero-bg instantaneamente (sem transição)
                            heroBg.style.transition = 'none';
                            heroBg.classList.remove('visible');
                            heroBg.style.backgroundImage = '';
                            // 4. Restaura transição para próximo slide
                            requestAnimationFrame(() => {
                                heroBg.style.transition = '';
                                transitioning = false;
                            });
                        }, 750);
                    });
                });
            }
        };
        img.onerror = function() {
            transitioning = false;
        };
        img.src = src;
    }

    // Click nos dots
    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    // Inicializa o primeiro slide
    goToSlide(0);

    // AUTOPLAY - Timer de 4 segundos
    let autoplayInterval;

    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            const nextIndex = (currentSlide + 1) % heroImagens.length;
            goToSlide(nextIndex);
        }, 5000);
    }

    function stopAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
    }

    startAutoplay();

    sliderDots.forEach(dot => {
        dot.addEventListener('click', () => {
            stopAutoplay();
            startAutoplay();
        });
    });

    // BOTÃO SAIBA MAIS
    const btnSaibaMais = document.getElementById('btnSaibaMais');
    const btnSaibaMaisMobile = document.getElementById('btnSaibaMaisMobile');
    const descricaoExpandida = document.getElementById('descricaoExpandida');

    if (descricaoExpandida) {
        descricaoExpandida.classList.add('active');

        function scrollToDescricao() {
            descricaoExpandida.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        if (btnSaibaMais) btnSaibaMais.addEventListener('click', scrollToDescricao);
        if (btnSaibaMaisMobile) btnSaibaMaisMobile.addEventListener('click', scrollToDescricao);
    }

    // SELEÇÃO DE OPÇÕES
    const opcoesGrupos = document.querySelectorAll('.opcao-grupo');

    opcoesGrupos.forEach(grupo => {
        const tagItems = grupo.querySelectorAll('.tag-item.no-border');
        if (tagItems.length > 0) tagItems[0].classList.add('active');

        tagItems.forEach(tag => {
            tag.addEventListener('click', function() {
                tagItems.forEach(item => item.classList.remove('active'));
                this.classList.add('active');
            });
        });
    });

    // ANIMAÇÕES ON SCROLL
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = entry.target.dataset.animation || entry.target.style.animation;
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
        '.section-small-label, .opcoes-titulo, .coluna-titulo, .credibilidade-titulo, .descricao-section p, .obra-item'
    );

    animatedElements.forEach(el => {
        const currentAnimation = window.getComputedStyle(el).animation;
        el.dataset.animation = currentAnimation;
        el.style.animation = 'none';
        el.style.opacity = '0';
        observer.observe(el);
    });

});
