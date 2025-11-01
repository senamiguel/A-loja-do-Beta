// É importante usar 'load' para que a altura da seção (com imagens)
// seja calculada corretamente.
window.addEventListener("load", () => {
    
    const metroReadout = document.getElementById("metro-readout");
    const metroStart = document.getElementById("metro-start");
    const peixesSection = document.getElementById("peixes");

    if (!metroReadout || !metroStart || !peixesSection) {
        console.error("Erro: Um dos elementos (metro-readout, metro-start ou peixes) não foi encontrado.");
        return;
    }

    // --- CÁLCULO DO PONTO DE GATILHO ---
    const peixesAbsoluteTop = peixesSection.offsetTop;
    const peixesHeight = peixesSection.offsetHeight;
    
    // Este é o PONTO DE GATILHO (20% da seção)
    const startTriggerPoint = peixesAbsoluteTop + (peixesHeight * 0.1);
    // ----------------------------------------

    let scrollTimer = null;
    
    // NOVO: 'isCounting' controla se já ativamos o contador
    let isCounting = false;
    // NOVO: 'startRulerY' vai guardar o 'scrollY' 
    // exato de onde o 0.0 metros começou.
    let startRulerY = 0; 

    window.addEventListener("scroll", () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        const peixesRect = peixesSection.getBoundingClientRect();
        const peixesTop = peixesRect.top;
        const peixesBottom = peixesRect.bottom;
        
        // Condição 1: A seção está visível na tela?
        const inSection = peixesTop < windowHeight && peixesBottom > 0;
        
        // Condição 2: O scroll já passou do ponto de GATILHO de 20%?
        const hasReachedTriggerPoint = scrollY >= startTriggerPoint;

        clearTimeout(scrollTimer);

        // ATIVA/ATUALIZA o contador
        if (inSection && hasReachedTriggerPoint) {
            
            // NOVO: Se esta é a PRIMEIRA VEZ que ativamos...
            if (!isCounting) {
                isCounting = true;
                // ...marcamos a posição ATUAL do scroll como o nosso "0.0 Metros".
                startRulerY = scrollY; 
            }
            
            // A distância agora é calculada a partir do 'startRulerY'
            const distance = Math.max(0, (scrollY - startRulerY) / 10);
            metroReadout.textContent = `${distance.toFixed(1)} Metros`;

            metroReadout.classList.add("is-active");
            metroStart.classList.add("is-active");

            scrollTimer = setTimeout(() => {
                metroReadout.classList.remove("is-active");
                metroStart.classList.remove("is-active");
            }, 2000);

        } else {
            // DESATIVA
            
            // NOVO: Reseta o 'isCounting' para que o contador 
            // possa começar do zero na próxima vez.
            isCounting = false; 
            
            metroReadout.classList.remove("is-active");
            metroStart.classList.remove("is-active");
        }
    });
});

// Gerenciamento do carrinho
document.addEventListener('DOMContentLoaded', () => {
    const buyButtons = document.querySelectorAll('.buy-btn');
    const cartCount = document.querySelector('.cart-count');
    let cartItems = 0;

    buyButtons.forEach(button => {
        button.addEventListener('click', () => {
            cartItems++;
            if (cartCount) {
                cartCount.textContent = cartItems;
                // Animação de atualização
                cartCount.style.transform = 'translate(25%, -25%) scale(1.3)';
                setTimeout(() => {
                    cartCount.style.transform = 'translate(25%, -25%) scale(1)';
                }, 200);
            }
        });
    });
});