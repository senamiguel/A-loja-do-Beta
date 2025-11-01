document.addEventListener("DOMContentLoaded", () => {
    const bubblesContainer = document.querySelector(".bubbles-container");
    if (!bubblesContainer) return;

    function updateContainerHeight() {
        const main = document.querySelector("main");
        if (main) {
            bubblesContainer.style.height = `${main.scrollHeight}px`;
        }
    }

    updateContainerHeight();
    
    window.addEventListener("resize", updateContainerHeight);
    
    const observer = new MutationObserver(updateContainerHeight);
    const main = document.querySelector("main");
    if (main) {
        observer.observe(main, { childList: true, subtree: true });
    }

    function createBubble() {
        const bubble = document.createElement("div");
        bubble.className = "bubble";
        
        const size = Math.random() * 80 + 30;
        const left = Math.random() * 100;
        const duration = Math.random() * 30 + 20;
        const delay = Math.random() * 3;
        const drift = (Math.random() - 0.5) * 100;
        
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${left}%`;
        bubble.style.bottom = '300px';
        bubble.style.opacity = '0.2';
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