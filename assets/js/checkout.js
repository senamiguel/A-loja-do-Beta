// Script para renderizar o carrinho no checkout
let carrinho = JSON.parse(sessionStorage.getItem('carrinho')) || [];
let currentStep = 1;
let selectedPayment = '';
let deliveryData = {};

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
        const jaInicializado = sessionStorage.getItem('exemplosInicializados');
        if (!jaInicializado) {
            // carrinho = produtosExemplo; // Comentado para não adicionar exemplos automaticamente
            // sessionStorage.setItem('carrinho', JSON.stringify(carrinho));
            sessionStorage.setItem('exemplosInicializados', 'true');
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


window.removerDoCarrinho = function(id) {

    carrinho = carrinho.filter(p => p.id != id);
    sessionStorage.setItem('carrinho', JSON.stringify(carrinho));
    renderizarCheckout();
}


window.atualizarQuantidade = function(id, delta) {

    const produto = carrinho.find(p => p.id == id);
    if (produto) {
        produto.quantidade += delta;
        if (produto.quantidade <= 0) {
            removerDoCarrinho(id);
            return;
        }
        sessionStorage.setItem('carrinho', JSON.stringify(carrinho));
        renderizarCheckout();
    }
}

// Função para atualizar o contador do carrinho na navbar
function atualizarContadorNavbar() {
    const totalItens = carrinho.reduce((sum, p) => sum + p.quantidade, 0);
    const contadores = document.querySelectorAll('.cart-count');
    contadores.forEach(contador => {
        contador.textContent = totalItens;
    });
}

// Função para renderizar o checkout
function renderizarCheckout() {
    carrinho = JSON.parse(sessionStorage.getItem('carrinho')) || [];
    
    // Atualizar contador sempre que renderizar
    atualizarContadorNavbar();

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
                                                <button class="btn btn-outline-custom-orange btn-sm" onclick="atualizarQuantidade('${produto.id}', -1)">
                                                    <i class="bi bi-dash"></i>
                                                </button>
                                                <span class="mx-2 fs-5">${produto.quantidade}</span>
                                                <button class="btn btn-outline-custom-orange btn-sm" onclick="atualizarQuantidade('${produto.id}', 1)">
                                                    <i class="bi bi-plus"></i>
                                                </button>
                                            </div>
                                            <button class="btn btn-custom-orange btn-sm text-white" onclick="removerDoCarrinho('${produto.id}')" title="Remover">
                                                <i class="bi bi-trash"></i> Remover
                                            </button>
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
    carrinho = JSON.parse(sessionStorage.getItem('carrinho')) || [];

    if (carrinho.length === 0) {
        // mostrar modal informando que o carrinho está vazio
        const infoEl = document.getElementById('infoModalMessage');
        if (infoEl) infoEl.textContent = 'Seu carrinho está vazio! Adicione produtos antes de finalizar a compra.';
        const infoModalEl = document.getElementById('infoModal');
        if (infoModalEl) new bootstrap.Modal(infoModalEl).show();
        return;
    }

    // Coletar dados do cliente (adicionados ao HTML)
    const nome = (document.getElementById('nome') || {}).value.trim() || '';
    const email = (document.getElementById('email') || {}).value.trim() || '';
    const rua = (document.getElementById('rua') || {}).value.trim() || '';
    const numero = (document.getElementById('numero') || {}).value.trim() || '';
    const cidade = (document.getElementById('cidade') || {}).value.trim() || '';
    const estado = (document.getElementById('estado') || {}).value.trim() || '';

    const cep = (document.getElementById('cep') || {}).value || '';
    const formaPagamentoEl = document.getElementById('forma-pagamento');
    const formaPagamento = formaPagamentoEl ? formaPagamentoEl.value : '';

    // Validações do formulário do cliente
    if (!nome) {
        const infoEl = document.getElementById('infoModalMessage');
        if (infoEl) infoEl.textContent = 'Por favor, informe seu nome.';
        const infoModalEl = document.getElementById('infoModal');
        if (infoModalEl) new bootstrap.Modal(infoModalEl).show();
        return;
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        const infoEl = document.getElementById('infoModalMessage');
        if (infoEl) infoEl.textContent = 'Por favor, informe um e-mail válido.';
        const infoModalEl = document.getElementById('infoModal');
        if (infoModalEl) new bootstrap.Modal(infoModalEl).show();
        return;
    }

    if (!rua || !numero || !cidade || !estado) {
        const infoEl = document.getElementById('infoModalMessage');
        if (infoEl) infoEl.textContent = 'Por favor, preencha o endereço completo (rua, número, cidade e estado).';
        const infoModalEl = document.getElementById('infoModal');
        if (infoModalEl) new bootstrap.Modal(infoModalEl).show();
        return;
    }

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

    // preencher modal de confirmação com dados do cliente
    const confirmNome = document.getElementById('confirm-nome');
    const confirmEmail = document.getElementById('confirm-email');
    const confirmEndereco = document.getElementById('confirm-endereco');
    const confirmCep = document.getElementById('confirm-cep');
    const confirmPag = document.getElementById('confirm-pagamento');
    const confirmTotal = document.getElementById('confirm-total');
    if (confirmNome) confirmNome.textContent = nome;
    if (confirmEmail) confirmEmail.textContent = email;
    if (confirmEndereco) confirmEndereco.textContent = `${rua}, ${numero} — ${cidade}/${estado}`;
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
            sessionStorage.removeItem('carrinho');
            sessionStorage.removeItem('exemplosInicializados');
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
            // limpar campos do cliente
            const campos = ['nome','email','rua','numero','cidade','estado'];
            campos.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
        });
    }
});

// ============ STEPPER FUNCTIONALITY ============

function updateStepper() {
    const steps = document.querySelectorAll('.step');
    const stepContents = document.querySelectorAll('.step-content');
    const btnVoltar = document.getElementById('btn-voltar');
    const btnContinuar = document.getElementById('btn-continuar');
    const btnFinalizar = document.getElementById('btn-finalizar');

    // Update step circles
    steps.forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNum < currentStep) {
            step.classList.add('completed');
        } else if (stepNum === currentStep) {
            step.classList.add('active');
        }
    });

    // Update step content visibility
    stepContents.forEach((content, index) => {
        content.style.display = (index + 1 === currentStep) ? 'block' : 'none';
    });

    // Update buttons
    btnVoltar.style.display = currentStep > 1 ? 'inline-block' : 'none';
    btnContinuar.style.display = currentStep < 4 ? 'inline-block' : 'none';
    btnFinalizar.style.display = currentStep === 4 ? 'inline-block' : 'none';

    // Re-render cart if on step 1
    if (currentStep === 1) {
        renderizarCheckout();
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateStep(step) {
    if (step === 1) {
        // Validate cart has items
        if (carrinho.length === 0) {
            showMessage('Seu carrinho está vazio!');
            return false;
        }
        return true;
    }
    
    if (step === 2) {
        // Validate delivery form
        const form = document.getElementById('delivery-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return false;
        }
        
        // Save delivery data
        deliveryData = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            rua: document.getElementById('rua').value,
            numero: document.getElementById('numero').value,
            cidade: document.getElementById('cidade').value,
            estado: document.getElementById('estado').value,
            cep: document.getElementById('cep').value
        };
        return true;
    }
    
    if (step === 3) {
        // Validate payment selection
        if (!selectedPayment) {
            showMessage('Selecione uma forma de pagamento!');
            return false;
        }
        return true;
    }
    
    return true;
}

function showMessage(message) {
    const messageEl = document.getElementById('infoModalMessage');
    if (messageEl) messageEl.textContent = message;
    const modalEl = document.getElementById('infoModal');
    if (modalEl) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
        
        // Auto cleanup backdrop when modal closes
        modalEl.addEventListener('hidden.bs.modal', function cleanupBackdrop() {
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => backdrop.remove());
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            modalEl.removeEventListener('hidden.bs.modal', cleanupBackdrop);
        });
    }
}

function updateReviewSection() {
    // Update items
    const reviewItemsContainer = document.getElementById('review-items');
    if (reviewItemsContainer) {
        reviewItemsContainer.innerHTML = carrinho.map(item => `
            <div class="review-item">
                <div class="d-flex align-items-center gap-3">
                    <img src="${item.imagem}" alt="${item.nome}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
                    <div>
                        <div style="color: #fff; font-weight: 600;">${item.nome}</div>
                        <div style="color: rgba(255,255,255,0.6); font-size: 0.9rem;">Qtd: ${item.quantidade}</div>
                    </div>
                </div>
                <div style="color: #61dafb; font-weight: 600;">
                    R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}
                </div>
            </div>
        `).join('');
    }

    // Update delivery data
    if (deliveryData.nome) {
        document.getElementById('review-nome').textContent = deliveryData.nome;
        document.getElementById('review-email').textContent = deliveryData.email;
        document.getElementById('review-endereco').textContent = 
            `${deliveryData.rua}, ${deliveryData.numero} - ${deliveryData.cidade}/${deliveryData.estado}`;
        document.getElementById('review-cep').textContent = deliveryData.cep;
    }

    // Update payment method
    const paymentNames = {
        'pix': 'PIX - Pagamento instantâneo',
        'credito': 'Cartão de Crédito - Parcelamento disponível',
        'debito': 'Cartão de Débito - À vista com desconto'
    };
    document.getElementById('review-pagamento').textContent = paymentNames[selectedPayment] || '-';

    // Update totals
    const subtotal = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    const frete = 15.00; // Fixed shipping
    const total = subtotal + frete;

    document.getElementById('review-subtotal').textContent = subtotal.toFixed(2).replace('.', ',');
    document.getElementById('review-frete').textContent = frete.toFixed(2).replace('.', ',');
    document.getElementById('review-total').textContent = total.toFixed(2).replace('.', ',');
}

// Event Listeners for Stepper
document.addEventListener('DOMContentLoaded', () => {
    const btnContinuar = document.getElementById('btn-continuar');
    const btnVoltar = document.getElementById('btn-voltar');
    const btnFinalizar = document.getElementById('btn-finalizar');

    if (btnContinuar) {
        btnContinuar.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                currentStep++;
                if (currentStep === 4) {
                    updateReviewSection();
                }
                updateStepper();
            }
        });
    }

    if (btnVoltar) {
        btnVoltar.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateStepper();
            }
        });
    }

    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', () => {
            // Show success message
            const messageEl = document.getElementById('infoModalMessage');
            if (messageEl) messageEl.textContent = 'Pedido realizado com sucesso! Você receberá um e-mail de confirmação.';
            
            const modalEl = document.getElementById('infoModal');
            const modal = modalEl ? new bootstrap.Modal(modalEl) : null;
            if (modal) modal.show();
            
            // Clear cart and reset
            setTimeout(() => {
                // Hide modal and remove backdrop
                if (modal) modal.hide();
                
                // Remove all modal backdrops
                const backdrops = document.querySelectorAll('.modal-backdrop');
                backdrops.forEach(backdrop => backdrop.remove());
                
                // Remove modal-open class from body
                document.body.classList.remove('modal-open');
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
                
                sessionStorage.removeItem('carrinho');
                carrinho = [];
                currentStep = 1;
                selectedPayment = '';
                deliveryData = {};
                
                // Clear form fields
                const form = document.getElementById('delivery-form');
                if (form) form.reset();
                
                // Update display
                updateStepper();
                renderizarCheckout();
                
                // Show empty message
                const mensagemVazia = document.getElementById('mensagem-vazia');
                if (mensagemVazia) mensagemVazia.style.display = 'block';
                
                const aquario = document.querySelector('.aquario-wrap');
                if (aquario) aquario.style.display = 'none';
            }, 2000);
        });
    }

    // Payment option selection
    const paymentOptions = document.querySelectorAll('.payment-option');
    paymentOptions.forEach(option => {
        option.addEventListener('click', () => {
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedPayment = option.dataset.payment;
        });
    });

    // Initialize stepper
    updateStepper();
});
