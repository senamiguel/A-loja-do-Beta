// Script para renderizar o carrinho no checkout
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Produtos de exemplo para demonstração
const produtosExemplo = [
    {
        id: Date.now() + 1,
        nome: 'Neon Tetra',
        preco: 9.90,
        imagem: 'assets/images/peixe-1.png',
        quantidade: 2
    },
    {
        id: Date.now() + 2,
        nome: 'Betta Splendens',
        preco: 24.90,
        imagem: 'assets/images/peixe-2.png',
        quantidade: 1
    },
    {
        id: Date.now() + 3,
        nome: 'Cardinal Tetra',
        preco: 12.90,
        imagem: 'assets/images/peixe-3.png',
        quantidade: 3
    },
    {
        id: Date.now() + 4,
        nome: 'Guppy',
        preco: 7.50,
        imagem: 'assets/images/peixe-1.png',
        quantidade: 4
    },
    {
        id: Date.now() + 5,
        nome: 'Molinésia',
        preco: 8.90,
        imagem: 'assets/images/peixe-2.png',
        quantidade: 2
    },
    {
        id: Date.now() + 6,
        nome: 'Platy',
        preco: 6.90,
        imagem: 'assets/images/peixe-3.png',
        quantidade: 3
    }
];

// Função para inicializar produtos de exemplo (apenas se carrinho estiver vazio)
function inicializarExemplos() {
    if (carrinho.length === 0) {
        // Verifica se já foi inicializado antes (para não sobrescrever se o usuário limpar o carrinho)
        const jaInicializado = localStorage.getItem('exemplosInicializados');
        if (!jaInicializado) {
            carrinho = produtosExemplo;
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            localStorage.setItem('exemplosInicializados', 'true');
        }
    }
}

// Função para formatar preço
function formatarPreco(preco) {
    return preco.toFixed(2).replace('.', ',');
}

// Função para calcular total
function calcularTotal() {
    return carrinho.reduce((total, produto) => {
        return total + (produto.preco * produto.quantidade);
    }, 0);
}

// Função para remover produto
function removerDoCarrinho(id) {
    carrinho = carrinho.filter(p => p.id !== id);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    renderizarCheckout();
}

// Função para atualizar quantidade
function atualizarQuantidade(id, delta) {
    const produto = carrinho.find(p => p.id === id);
    if (produto) {
        produto.quantidade += delta;
        if (produto.quantidade <= 0) {
            removerDoCarrinho(id);
            return;
        }
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        renderizarCheckout();
    }
}

// Função para renderizar o checkout
function renderizarCheckout() {
    carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const listaCarrinho = document.getElementById('lista-carrinho');
    const mensagemVazia = document.getElementById('mensagem-vazia');
    const totalCarrinho = document.getElementById('total-carrinho');

    if (carrinho.length === 0) {
        // Não mostrar container quando vazio; mostrar apenas a mensagem vazia
        const aquario = document.querySelector('.aquario-wrap');
        if (aquario) aquario.style.display = 'none';
        mensagemVazia.style.display = 'block';
        listaCarrinho.innerHTML = '';
        if (totalCarrinho) totalCarrinho.textContent = '0,00';
    } else {
        // Esconder mensagem vazia e mostrar produtos
        mensagemVazia.style.display = 'none';
        const aquario = document.querySelector('.aquario-wrap');
        if (aquario) aquario.style.display = '';
        listaCarrinho.style.display = '';
        
        // Renderizar produtos em layout vertical
        listaCarrinho.innerHTML = carrinho.map(produto => `
            <div class="produto-item-vertical">
                <div class="card bg-transparent border-light text-white">
                    <div class="row g-0">
                        <div class="col-md-3">
                            <img src="${produto.imagem || 'assets/images/peixe-1.png'}" class="img-fluid rounded-start" alt="${produto.nome}" style="object-fit:cover; height:100%; min-height:200px;" onerror="this.src='assets/images/peixe-1.png'">
                        </div>
                        <div class="col-md-9">
                            <div class="card-body d-flex flex-column h-100">
                                <div class="flex-grow-1">
                                    <h5 class="card-title">${produto.nome}</h5>
                                    <p class="card-text">Preço unitário: R$ ${formatarPreco(produto.preco)}</p>
                                </div>
                                <div class="card-footer bg-transparent border-light p-0 pt-3">
                                    <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                                        <div>
                                            <strong class="fs-5">Total: R$ ${formatarPreco(produto.preco * produto.quantidade)}</strong>
                                        </div>
                                        <div class="d-flex align-items-center gap-3">
                                            <div class="d-flex align-items-center gap-2">
                                                <button class="btn btn-outline-light btn-sm" onclick="atualizarQuantidade(${produto.id}, -1)">-</button>
                                                <span class="mx-2 fs-5">${produto.quantidade}</span>
                                                <button class="btn btn-outline-light btn-sm" onclick="atualizarQuantidade(${produto.id}, 1)">+</button>
                                            </div>
                                            <button class="btn btn-outline-danger btn-sm" onclick="removerDoCarrinho(${produto.id})" title="Remover">Remover</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Atualizar total
        if (totalCarrinho) {
            totalCarrinho.textContent = formatarPreco(calcularTotal());
        }
    }
}

// Função para finalizar compra
function finalizarCompra() {
    carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    if (carrinho.length === 0) {
        // mostrar modal informando que o carrinho está vazio
        const infoEl = document.getElementById('infoModalMessage');
        if (infoEl) infoEl.textContent = 'Seu carrinho está vazio! Adicione produtos antes de finalizar a compra.';
        const infoModalEl = document.getElementById('infoModal');
        if (infoModalEl) new bootstrap.Modal(infoModalEl).show();
        return;
    }

    const cep = (document.getElementById('cep') || {}).value || '';
    const formaPagamentoEl = document.getElementById('forma-pagamento');
    const formaPagamento = formaPagamentoEl ? formaPagamentoEl.value : '';

    if (!cep || !/^\d{5}-?\d{3}$/.test(cep)) {
        const infoEl = document.getElementById('infoModalMessage');
        if (infoEl) infoEl.textContent = 'Por favor, informe um CEP válido.';
        const infoModalEl = document.getElementById('infoModal');
        if (infoModalEl) new bootstrap.Modal(infoModalEl).show();
        return;
    }

    if (!formaPagamento) {
        const infoEl = document.getElementById('infoModalMessage');
        if (infoEl) infoEl.textContent = 'Por favor, selecione uma forma de pagamento.';
        const infoModalEl = document.getElementById('infoModal');
        if (infoModalEl) new bootstrap.Modal(infoModalEl).show();
        return;
    }

    const total = calcularTotal();

    // preencher modal de confirmação
    const confirmCep = document.getElementById('confirm-cep');
    const confirmPag = document.getElementById('confirm-pagamento');
    const confirmTotal = document.getElementById('confirm-total');
    if (confirmCep) confirmCep.textContent = cep;
    if (confirmPag && formaPagamentoEl) confirmPag.textContent = formaPagamentoEl.selectedOptions[0].text;
    if (confirmTotal) confirmTotal.textContent = formatarPreco(total);

    const confirmModalEl = document.getElementById('confirmPurchaseModal');
    if (confirmModalEl) new bootstrap.Modal(confirmModalEl).show();
}

// Renderizar ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    inicializarExemplos();
    renderizarCheckout();
    
    // Adicionar event listener ao botão de finalizar compra
    const btnFinalizar = document.getElementById('btn-finalizar');
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', finalizarCompra);
    }

    // Abrir modal de checkout quando o botão flutuante for clicado
    const openCheckoutBtn = document.getElementById('open-checkout-modal');
    if (openCheckoutBtn) {
        openCheckoutBtn.addEventListener('click', function () {
            const modalEl = document.getElementById('checkoutModal');
            if (modalEl) {
                const modal = new bootstrap.Modal(modalEl);
                modal.show();
            }
        });
    }

    // Máscara para o campo CEP (formato 00000-000)
    function aplicarMascaraCEP(valor) {
        if (!valor) return '';
        const digits = valor.replace(/\D/g, '').slice(0, 8); // apenas números, até 8 dígitos
        if (digits.length > 5) {
            return digits.slice(0,5) + '-' + digits.slice(5);
        }
        return digits;
    }

    const cepInput = document.getElementById('cep');
    if (cepInput) {
        // mobile numeric keyboard
        cepInput.setAttribute('inputmode', 'numeric');

        cepInput.addEventListener('input', function (e) {
            const cursorPos = cepInput.selectionStart || cepInput.value.length;
            const oldLen = cepInput.value.length;
            const newVal = aplicarMascaraCEP(cepInput.value);
            cepInput.value = newVal;
            // tentar restaurar posição do cursor no fim razoavelmente
            const newLen = newVal.length;
            const diff = newLen - oldLen;
            try { cepInput.setSelectionRange(cursorPos + (diff > 0 ? diff : 0), cursorPos + (diff > 0 ? diff : 0)); } catch (e) {}
        });

        // Ao colar, limpar e aplicar máscara
        cepInput.addEventListener('paste', function (e) {
            e.preventDefault();
            const paste = (e.clipboardData || window.clipboardData).getData('text') || '';
            cepInput.value = aplicarMascaraCEP(paste);
        });
    }

    // Lidar com confirmação final da compra (botão dentro do modal de confirmação)
    const confirmPurchaseBtn = document.getElementById('confirm-purchase-btn');
    if (confirmPurchaseBtn) {
        confirmPurchaseBtn.addEventListener('click', function () {
            // efetivar compra: limpar carrinho e mostrar mensagem de sucesso via infoModal
            localStorage.removeItem('carrinho');
            localStorage.removeItem('exemplosInicializados');
            carrinho = [];
            renderizarCheckout();

            // fechar modais abertos (confirm + checkout)
            const confirmModalEl = document.getElementById('confirmPurchaseModal');
            const checkoutModalEl = document.getElementById('checkoutModal');
            try {
                if (confirmModalEl) bootstrap.Modal.getInstance(confirmModalEl)?.hide();
            } catch (e) {}
            try {
                if (checkoutModalEl) bootstrap.Modal.getInstance(checkoutModalEl)?.hide();
            } catch (e) {}

            // mostrar info de sucesso
            const infoEl = document.getElementById('infoModalMessage');
            if (infoEl) infoEl.textContent = 'Compra finalizada com sucesso! Obrigado pela preferência!';
            const infoModalEl = document.getElementById('infoModal');
            if (infoModalEl) new bootstrap.Modal(infoModalEl).show();

            // limpar campos do formulário
            const cepInput = document.getElementById('cep');
            if (cepInput) cepInput.value = '';
            const formaSelect = document.getElementById('forma-pagamento');
            if (formaSelect) formaSelect.selectedIndex = 0;
        });
    }
});

