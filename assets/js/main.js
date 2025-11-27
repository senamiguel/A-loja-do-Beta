// Gerenciamento do carrinho usando sessionStorage
let carrinho = JSON.parse(sessionStorage.getItem('carrinho')) || [];

// Função para adicionar produto ao carrinho
function adicionarAoCarrinho(nome, preco, imagem) {
    const produto = {
        id: crypto.randomUUID(),
        nome: nome,
        preco: parseFloat(preco),
        imagem: imagem || 'assets/images/peixe-1.png',
        quantidade: 1
    };

    // Verifica se o produto já existe no carrinho
    const produtoExistente = carrinho.find(p => p.nome === nome);
    if (produtoExistente) {
        produtoExistente.quantidade += 1;
    } else {
        carrinho.push(produto);
    }

    sessionStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarCarrinho();

    // pequena animação no contador do carrinho para feedback visual
    const contadores = document.querySelectorAll('.cart-count');
    contadores.forEach(contador => {
        try {
            contador.style.transform = 'translate(25%, -25%) scale(1.3)';
            setTimeout(() => { contador.style.transform = 'translate(25%, -25%) scale(1)'; }, 200);
        } catch (e) {}
    });
}

// Funções utilitárias de carrinho (placeholder se o arquivo existisse)
// import { removerDoCarrinho, atualizarQuantidade } from './cart-utils.js';

// Função para atualizar o carrinho (pode ser usada para atualizar contadores na página)
function atualizarCarrinho() {
    const totalItens = carrinho.reduce((sum, p) => sum + p.quantidade, 0);
    
    // Atualiza todos os contadores de carrinho na página
    const contadores = document.querySelectorAll('.cart-count');
    contadores.forEach(contador => {
        contador.textContent = totalItens;
        // Opcional: esconder se for zero
        // contador.style.display = totalItens > 0 ? 'flex' : 'none';
    });

    return totalItens;
}

// Inicializar contador ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    atualizarCarrinho();
    
    const botoes = document.querySelectorAll('.buy-btn');
    botoes.forEach(botao => {
        botao.addEventListener('click', function() {
            const nome = this.getAttribute('data-name');
            const preco = this.getAttribute('data-price');
            
            if (!nome || !preco) return;

            // Prioriza um atributo data-image (setado em páginas como produto.html),
            // senão tenta encontrar a imagem mais próxima no DOM, senão fallback.
            let imagem = this.getAttribute('data-image') || null;
            if (!imagem) {
                const card = this.closest('.card');
                const imgElement = card ? card.querySelector('img') : null;
                if (imgElement) imagem = imgElement.getAttribute('src');
                else {
                    // tentar encontrar imagem em componentes de produto (ex: produto-page)
                    const mainImg = document.querySelector('.produto-gallery-main img');
                    if (mainImg) imagem = mainImg.getAttribute('src');
                }
            }

            adicionarAoCarrinho(nome, preco, imagem);
            
            // Show Bootstrap Alert
            const alertContainer = document.getElementById('alert-container');
            if (alertContainer) {
                const alertHTML = `
                    <div class="alert alert-custom alert-dismissible fade show" role="alert">
                        ${nome} adicionado ao carrinho com sucesso!
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
                alertContainer.innerHTML = alertHTML;
                
                // Auto dismiss after 3 seconds
                setTimeout(() => {
                    const alertEl = alertContainer.querySelector('.alert');
                    if (alertEl) {
                        const bsAlert = new bootstrap.Alert(alertEl);
                        bsAlert.close();
                    }
                }, 3000);
            } else {
                // Fallback if alert container is not present
                alert(`${nome} adicionado ao carrinho!`);
            }
        });
    });

    // Adicionar funcionalidade de clique nos produtos para ir à página de detalhes
    // Funciona tanto para index.html quanto para outras páginas
    const productCards = document.querySelectorAll('.card');
    productCards.forEach(card => {
        const cardTitle = card.querySelector('.card-title');
        const cardImg = card.querySelector('img');
        const cardDesc = card.querySelector('.card-text');
        const cardFooter = card.querySelector('.card-footer');
        
        if (!cardTitle || !cardImg || !cardFooter) return;
        
        const buyBtn = cardFooter.querySelector('.buy-btn');
        if (!buyBtn) return;
        
        const name = buyBtn.getAttribute('data-name');
        const price = buyBtn.getAttribute('data-price');
        const image = cardImg.getAttribute('src');
        const description = cardDesc ? cardDesc.innerText : '';
        const specs = card.querySelector('.fish-specs') ? card.querySelector('.fish-specs').innerHTML : '';
        
        // Criar dados do produto com valores padrão caso não existam
        const productData = {
            name: name,
            price: price,
            image: image,
            description: description,
            longDescription: `<p>${description}</p>`,
            care: '<ul><li>Consulte um especialista para cuidados específicos.</li></ul>',
            parameters: '<ul class="param-list"><li><span>Informação</span><strong>Sob consulta</strong></li></ul>',
            specs: specs
        };
        
        // Adicionar cursor pointer e evento de clique na imagem e título
        [cardImg, cardTitle].forEach(el => {
            if (el) {
                el.style.cursor = 'pointer';
                el.addEventListener('click', () => {
                    sessionStorage.setItem('selectedProduct', JSON.stringify(productData));
                    window.location.href = 'produto.html';
                });
            }
        });
    });
});
window.addEventListener("load", () => {
    const metroReadout = document.getElementById("metro-readout");
    const metroStart = document.getElementById("metro-start");
    const peixesSection = document.getElementById("peixes");

    // Só executa se todos os elementos existirem (página index.html)
    if (!metroReadout || !metroStart || !peixesSection) {
        return; // Sai silenciosamente se não estiver na página correta
    }

    const peixesAbsoluteTop = peixesSection.offsetTop;
    const peixesHeight = peixesSection.offsetHeight;
    const startTriggerPoint = peixesAbsoluteTop + (peixesHeight * 0.1);

    let scrollTimer = null;
    let isCounting = false;
    let startRulerY = 0;

    window.addEventListener("scroll", () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        const peixesRect = peixesSection.getBoundingClientRect();
        const peixesTop = peixesRect.top;
        const peixesBottom = peixesRect.bottom;

        const inSection = peixesTop < windowHeight && peixesBottom > 0;
        const hasReachedTriggerPoint = scrollY >= startTriggerPoint;

        clearTimeout(scrollTimer);

        if (inSection && hasReachedTriggerPoint) {
            if (!isCounting) {
                isCounting = true;
                startRulerY = scrollY;
            }

            const distance = Math.max(0, (scrollY - startRulerY) / 10);
            metroReadout.textContent = `${distance.toFixed(1)} Metros`;

            metroReadout.classList.add("is-active");
            metroStart.classList.add("is-active");

            scrollTimer = setTimeout(() => {
                metroReadout.classList.remove("is-active");
                metroStart.classList.remove("is-active");
            }, 2000);

        } else {
            isCounting = false;
            metroReadout.classList.remove("is-active");
            metroStart.classList.remove("is-active");
        }
    });
});
// NOTE: contador do carrinho agora é atualizado pela função atualizarCarrinho
// e a animação é aplicada dentro de adicionarAoCarrinho — evita estados locais divergentes.

// Adicionar funcionalidade de clique nos produtos para redirecionar para página de produto
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todos os cards de produtos (tanto com .fish-item quanto .card quanto .related-card)
    const productCards = document.querySelectorAll('.fish-item, article.card, .related-card');
    
    productCards.forEach(card => {
        const titleElement = card.querySelector('.card-title, h4');
        const imgElement = card.querySelector('img');
        const descElement = card.querySelector('.card-text, p');
        const specsElement = card.querySelector('.fish-specs');
        const priceElement = card.querySelector('.card-footer strong, .related-meta span');
        
        if (!titleElement || !imgElement) return;
        
        const cardTitle = titleElement.innerText;
        const cardImg = imgElement.src;
        const cardDesc = descElement ? descElement.innerText : '';
        const specs = specsElement ? specsElement.innerHTML : '';
        
        // Pega o preço do botão ou do elemento de preço
        let cardPrice = card.dataset.price;
        if (!cardPrice) {
            const buyBtn = card.querySelector('.buy-btn');
            cardPrice = buyBtn ? buyBtn.getAttribute('data-price') : '0.00';
        }
        
        // Se ainda não tiver preço, tenta pegar do texto do priceElement
        if ((!cardPrice || cardPrice === '0.00') && priceElement) {
            const priceText = priceElement.innerText;
            const priceMatch = priceText.match(/[\d.,]+/);
            if (priceMatch) {
                cardPrice = priceMatch[0].replace('.', '').replace(',', '.');
            }
        }
        
        // Dados estendidos dos atributos data-*
        const longDesc = card.dataset.descriptionFull || `<p>${cardDesc}</p>`;
        const care = card.dataset.care || '<ul><li>Consulte um especialista para cuidados específicos.</li></ul>';
        const params = card.dataset.params || '<ul class="param-list"><li><span>Informação</span><strong>Sob consulta</strong></li></ul>';
        
        // Adiciona cursor pointer e evento de clique na imagem e título
        const clickableElements = [imgElement, titleElement];
        
        clickableElements.forEach(el => {
            if (el) {
                el.style.cursor = 'pointer';
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const productData = {
                        name: cardTitle,
                        price: cardPrice,
                        image: cardImg,
                        description: cardDesc,
                        longDescription: longDesc,
                        care: care,
                        parameters: params,
                        specs: specs
                    };
                    
                    sessionStorage.setItem('selectedProduct', JSON.stringify(productData));
                    window.location.href = 'produto.html';
                });
            }
        });
    });
});
