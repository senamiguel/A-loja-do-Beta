let carrinho = JSON.parse(sessionStorage.getItem('carrinho')) || [];

function adicionarAoCarrinho(nome, preco, imagem) {
    const produto = {
        id: crypto.randomUUID(),
        nome: nome,
        preco: parseFloat(preco),
        imagem: imagem || 'assets/images/peixe-1.png',
        quantidade: 1
    };

    const produtoExistente = carrinho.find(p => p.nome === nome);
    if (produtoExistente) {
        produtoExistente.quantidade += 1;
    } else {
        carrinho.push(produto);
    }

    sessionStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const totalItens = carrinho.reduce((sum, p) => sum + p.quantidade, 0);
    
    const contadores = document.querySelectorAll('.cart-count');
    contadores.forEach(contador => {
        contador.textContent = totalItens;
    });

    return totalItens;
}

document.addEventListener('DOMContentLoaded', function() {
    atualizarCarrinho();
    
    const botoes = document.querySelectorAll('.buy-btn');
    botoes.forEach(botao => {
        botao.addEventListener('click', function() {
            const nome = this.getAttribute('data-name');
            const preco = this.getAttribute('data-price');
            
            if (!nome || !preco) return;

            let imagem = this.getAttribute('data-image') || null;
            if (!imagem) {
                const card = this.closest('.card') || this.closest('.related-card');
                const imgElement = card ? card.querySelector('img') : null;
                if (imgElement) imagem = imgElement.getAttribute('src');
                else {
                    const mainImg = document.querySelector('.produto-gallery-main img');
                    if (mainImg) imagem = mainImg.getAttribute('src');
                }
            }

            adicionarAoCarrinho(nome, preco, imagem);
            
            const alertContainer = document.getElementById('alert-container');
            if (alertContainer) {
                const alertHTML = `
                    <div class="alert alert-custom alert-dismissible fade show" role="alert">
                        ${nome} adicionado ao carrinho com sucesso!
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
                alertContainer.innerHTML = alertHTML;
                
                setTimeout(() => {
                    const alertEl = alertContainer.querySelector('.alert');
                    if (alertEl) {
                        const bsAlert = new bootstrap.Alert(alertEl);
                        bsAlert.close();
                    }
                }, 3000);
            } else {
                alert(`${nome} adicionado ao carrinho!`);
            }
        });
    });

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

    if (!metroReadout || !metroStart || !peixesSection) {
        return;
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

document.addEventListener('DOMContentLoaded', () => {
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
        
        let cardPrice = card.dataset.price;
        if (!cardPrice) {
            const buyBtn = card.querySelector('.buy-btn');
            cardPrice = buyBtn ? buyBtn.getAttribute('data-price') : '0.00';
        }
        
        if ((!cardPrice || cardPrice === '0.00') && priceElement) {
            const priceText = priceElement.innerText;
            const priceMatch = priceText.match(/[\d.,]+/);
            if (priceMatch) {
                cardPrice = priceMatch[0].replace('.', '').replace(',', '.');
            }
        }
        
        const longDesc = card.dataset.descriptionFull || `<p>${cardDesc}</p>`;
        const care = card.dataset.care || '<ul><li>Consulte um especialista para cuidados específicos.</li></ul>';
        const params = card.dataset.params || '<ul class="param-list"><li><span>Informação</span><strong>Sob consulta</strong></li></ul>';
        
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
