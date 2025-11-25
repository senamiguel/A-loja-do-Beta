document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchFish');
  const checkSalgada = document.getElementById('checkSalgada');
  const checkDoce = document.getElementById('checkDoce');
  const priceRange = document.getElementById('priceRange');
  const priceValue = document.getElementById('priceValue');
  const fishItems = document.querySelectorAll('.fish-item');
  const paginationContainer = document.querySelector('.pagination');

  const itemsPerPage = 6;
  let currentPage = 1;
  let filteredItems = Array.from(fishItems);

  function filterFish() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const showSalgada = checkSalgada ? checkSalgada.checked : false;
    const showDoce = checkDoce ? checkDoce.checked : false;
    const maxPrice = priceRange ? parseFloat(priceRange.value) : 2000;

    // Update price label
    if(priceValue) priceValue.textContent = `R$ ${maxPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

    filteredItems = Array.from(fishItems).filter(item => {
      const name = item.dataset.name.toLowerCase();
      const price = parseFloat(item.dataset.price);
      const type = item.dataset.type;

      let matchesSearch = name.includes(searchTerm);
      let matchesType = false;
      
      if (!showSalgada && !showDoce) {
        matchesType = true;
      } else {
        if (showSalgada && type === 'salgada') matchesType = true;
        if (showDoce && type === 'doce') matchesType = true;
      }

      let matchesPrice = price <= maxPrice;

      return matchesSearch && matchesType && matchesPrice;
    });

    currentPage = 1;
    renderPagination();
    renderItems();
  }

  function renderItems() {
    // Hide all first
    fishItems.forEach(item => item.classList.add('d-none'));

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const itemsToShow = filteredItems.slice(start, end);

    itemsToShow.forEach(item => item.classList.remove('d-none'));
  }

  function renderPagination() {
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    paginationContainer.innerHTML = '';

    if (totalPages <= 1) return;

    // Previous
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link bg-transparent text-white border-secondary" href="#" aria-label="Previous">Anterior</a>`;
    prevLi.onclick = (e) => {
      e.preventDefault();
      if (currentPage > 1) {
        currentPage--;
        renderItems();
        renderPagination();
      }
    };
    paginationContainer.appendChild(prevLi);

    // Pages
    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement('li');
      li.className = `page-item ${currentPage === i ? 'active' : ''}`;
      const linkClass = currentPage === i ? 'bg-info border-info text-dark fw-bold' : 'bg-transparent text-white border-secondary';
      li.innerHTML = `<a class="page-link ${linkClass}" href="#">${i}</a>`;
      li.onclick = (e) => {
        e.preventDefault();
        currentPage = i;
        renderItems();
        renderPagination();
      };
      paginationContainer.appendChild(li);
    }

    // Next
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link bg-transparent text-white border-secondary" href="#" aria-label="Next">Próximo</a>`;
    nextLi.onclick = (e) => {
      e.preventDefault();
      if (currentPage < totalPages) {
        currentPage++;
        renderItems();
        renderPagination();
      }
    };
    paginationContainer.appendChild(nextLi);
  }

  // Product Click Logic
  fishItems.forEach(item => {
    const cardTitle = item.querySelector('.card-title').innerText;
    const cardPrice = item.dataset.price;
    const cardImg = item.querySelector('img').src;
    const cardDesc = item.querySelector('.card-text').innerText;
    const specs = item.querySelector('.fish-specs').innerHTML;

    // Add click event to image and title
    const clickableElements = [item.querySelector('img'), item.querySelector('.card-title')];
    
    clickableElements.forEach(el => {
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => {
        const productData = {
          name: cardTitle,
          price: cardPrice,
          image: cardImg,
          description: cardDesc,
          specs: specs
        };
        sessionStorage.setItem('selectedProduct', JSON.stringify(productData));
        window.location.href = 'produto.html';
      });
    });
  });

  if(searchInput) searchInput.addEventListener('input', filterFish);
  if(checkSalgada) checkSalgada.addEventListener('change', filterFish);
  if(checkDoce) checkDoce.addEventListener('change', filterFish);
  if(priceRange) priceRange.addEventListener('input', filterFish);

  // Initial render
  filterFish();
});
