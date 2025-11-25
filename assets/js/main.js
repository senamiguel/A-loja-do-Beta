// Gerenciamento do carrinho usando localStorage
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

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

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarCarrinho();
}

// Funções utilitárias de carrinho importadas de cart-utils.js
import { removerDoCarrinho, atualizarQuantidade } from './cart-utils.js';

// Função para atualizar o carrinho (pode ser usada para atualizar contador, etc.)
function atualizarCarrinho() {
    // Esta função pode ser expandida para atualizar contadores na página
    const totalItens = carrinho.reduce((sum, p) => sum + p.quantidade, 0);
    return totalItens;
}

// Event listeners para os botões de adicionar ao carrinho
document.addEventListener('DOMContentLoaded', function() {
    const botoes = document.querySelectorAll('.buy-btn');
    botoes.forEach(botao => {
        botao.addEventListener('click', function() {
            const nome = this.getAttribute('data-name');
            const preco = this.getAttribute('data-price');
            const card = this.closest('.card');
            const imgElement = card ? card.querySelector('img') : null;
            let imagem = null;
            
            if (imgElement) {
                // Usa o src da imagem, ou tenta pegar do atributo src original
                imagem = imgElement.src || imgElement.getAttribute('src');
            }
            
            adicionarAoCarrinho(nome, preco, imagem);
            alert(`${nome} adicionado ao carrinho!`);
        });
    });
});

window.addEventListener("load", () => {
    const metroReadout = document.getElementById("metro-readout");
    const metroStart = document.getElementById("metro-start");
    const peixesSection = document.getElementById("peixes");

    if (!metroReadout || !metroStart || !peixesSection) {
        console.error("Erro: Um dos elementos (metro-readout, metro-start ou peixes) não foi encontrado.");
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
    const buyButtons = document.querySelectorAll('.buy-btn[data-name]');
    const cartCount = document.querySelector('.cart-count');
    let cartItems = 0;

    buyButtons.forEach(button => {
        button.addEventListener('click', () => {
            cartItems++;
            if (cartCount) {
                cartCount.textContent = cartItems;
                cartCount.style.transform = 'translate(25%, -25%) scale(1.3)';
                setTimeout(() => {
                    cartCount.style.transform = 'translate(25%, -25%) scale(1)';
                }, 200);
            }
        });
    });
});
