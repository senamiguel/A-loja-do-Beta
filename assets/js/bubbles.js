document.addEventListener("DOMContentLoaded", () => {
    const bubblesContainer = document.querySelector(".bubbles-container");
    if (!bubblesContainer) return;

    function updateContainerHeight() {
        const main = document.querySelector("main");
        const footer = document.querySelector("footer");
        const sobreNosSection = document.querySelector("#sobre-nos");
        
        if (sobreNosSection && main && footer) {
            // Calcular posição relativa ao main usando getBoundingClientRect
            const mainRect = main.getBoundingClientRect();
            const sobreNosRect = sobreNosSection.getBoundingClientRect();
            const footerRect = footer.getBoundingClientRect();
            
            // Altura total: desde o início da seção sobre-nos até o final do footer
            const footerBottom = footerRect.bottom;
            const sobreNosTop = sobreNosRect.top;
            const totalHeight = footerBottom - sobreNosTop;
            
            // Posição top do container: diferença entre o top da seção sobre-nos e o top do main
            // Se sobre-nos está antes do main, usar valor negativo
            const topOffset = sobreNosRect.top - mainRect.top;
            bubblesContainer.style.top = `${topOffset}px`;
            
            // Altura do container: altura total calculada
            bubblesContainer.style.height = `${totalHeight}px`;
            bubblesContainer.style.bottom = 'auto';
        } else if (main && footer) {
            // Fallback: calcular altura até o final do footer
            const mainRect = main.getBoundingClientRect();
            const footerRect = footer.getBoundingClientRect();
            const footerBottom = footerRect.bottom;
            const heightUntilFooterEnd = footerBottom - mainRect.top;
            
            if (heightUntilFooterEnd > 0) {
                bubblesContainer.style.top = '0px';
                bubblesContainer.style.height = `${heightUntilFooterEnd}px`;
            }
        }
    }

    // Aguardar o carregamento completo antes de calcular
    if (document.readyState === 'loading') {
        window.addEventListener('load', updateContainerHeight);
    } else {
        // Pequeno delay para garantir que o layout esteja completo
        setTimeout(updateContainerHeight, 100);
    }
    
    window.addEventListener("resize", () => {
        updateContainerHeight();
        // Limpar bolhas existentes e recriar com novos parâmetros baseados no tamanho da tela
        const existingBubbles = bubblesContainer.querySelectorAll('.bubble');
        existingBubbles.forEach(bubble => bubble.remove());
    });
    
    window.addEventListener("scroll", () => {
        // Recalcular ao fazer scroll para garantir posicionamento correto
        updateContainerHeight();
    });
    
    const observer = new MutationObserver(updateContainerHeight);
    const sobreNosSection = document.querySelector("#sobre-nos");
    if (sobreNosSection) {
        observer.observe(sobreNosSection, { childList: true, subtree: true });
    }
    const footer = document.querySelector("footer");
    if (footer) {
        observer.observe(footer, { childList: true, subtree: true });
    }
    const main = document.querySelector("main");
    if (main) {
        observer.observe(main, { childList: true, subtree: true });
    }

    function createBubble() {
        const bubble = document.createElement("div");
        bubble.className = "bubble";
        
        // Limitar tamanho máximo baseado na largura da tela
        const maxSize = Math.min(window.innerWidth * 0.15, 80);
        const minSize = Math.max(window.innerWidth * 0.05, 20);
        const size = Math.random() * (maxSize - minSize) + minSize;
        
        // Limitar posição left para evitar bolhas fora da tela
        // Deixar margem de segurança baseada no tamanho da bolha (em pixels)
        const margin = size / 2 + 10; // 10px extra de segurança
        const maxLeftPx = window.innerWidth - margin;
        const minLeftPx = margin;
        const leftPx = Math.random() * (maxLeftPx - minLeftPx) + minLeftPx;
        const left = (leftPx / window.innerWidth) * 100;
        
        // Reduzir drift horizontal no mobile
        const isMobile = window.innerWidth < 768;
        const maxDrift = isMobile ? 30 : 100;
        const drift = (Math.random() - 0.5) * maxDrift;
        
        const duration = Math.random() * 120 + 100;
        const delay = Math.random() * 3;
        
        // Variação na posição inicial: algumas bolhas começam mais em cima
        // Limitar para não aparecer no footer
        const bubblesContainerHeight = bubblesContainer.offsetHeight;
        const minBottom = 50;
        const maxBottom = Math.min(bubblesContainerHeight * 0.8, window.innerHeight * 0.6);
        const bottom = Math.random() * (maxBottom - minBottom) + minBottom;
        
        // Opacidade inicial varia com a posição (bolhas mais altas podem ter opacidade diferente)
        const bottomRatio = (bottom - minBottom) / (maxBottom - minBottom);
        const initialOpacity = 0.15 + (bottomRatio * 0.15); // Entre 0.15 e 0.3
        
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${left}%`;
        bubble.style.bottom = `${bottom}px`;
        bubble.style.opacity = initialOpacity.toString();
        bubble.style.animationDuration = `${duration}s`;
        bubble.style.animationDelay = `${delay}s`;
        bubble.style.setProperty('--drift', `${drift}px`);
        
        bubblesContainer.appendChild(bubble);
        
        const removeTime = (duration + delay + 2) * 1000;
        
        const removeBubble = () => {
            if (bubble && bubble.parentNode) {
                bubble.remove();
            }
        };
        
        bubble.addEventListener('animationend', removeBubble);
        setTimeout(removeBubble, removeTime);
    }
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => createBubble(), i * 200);
    }
    
    setInterval(() => {
        createBubble();
    }, 3000);
});