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
        // Mostrar mensagem vazia
        listaCarrinho.style.display = 'none';
        mensagemVazia.style.display = 'block';
        if (totalCarrinho) {
            totalCarrinho.textContent = '0,00';
        }
    } else {
        // Esconder mensagem vazia e mostrar produtos
        mensagemVazia.style.display = 'none';
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
        alert('Seu carrinho está vazio! Adicione produtos antes de finalizar a compra.');
        return;
    }
    
    const cep = document.getElementById('cep').value;
    const formaPagamento = document.getElementById('forma-pagamento').value;
    
    if (!cep || !/^\d{5}-?\d{3}$/.test(cep)) {
        alert('Por favor, informe um CEP válido.');
        return;
    }
    
    if (!formaPagamento) {
        alert('Por favor, selecione uma forma de pagamento.');
        return;
    }
    
    const total = calcularTotal();
    const confirmacao = confirm(`Finalizar compra no valor de R$ ${formatarPreco(total)}?\n\nCEP: ${cep}\nForma de pagamento: ${document.getElementById('forma-pagamento').selectedOptions[0].text}`);
    
    if (confirmacao) {
        alert('Compra finalizada com sucesso! Obrigado pela preferência!');
        // Limpar carrinho após finalizar
        localStorage.removeItem('carrinho');
        localStorage.removeItem('exemplosInicializados');
        carrinho = [];
        renderizarCheckout();
        // Limpar campos
        document.getElementById('cep').value = '';
        document.getElementById('forma-pagamento').selectedIndex = 0;
    }
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
});

