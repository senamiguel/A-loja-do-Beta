// Small ES6 module to create a smooth 'descending into the sea' effect
// It updates CSS variables on .page-header based on how far the user has scrolled

const header = document.querySelector('.page-header');
if (header) {
    let ticking = false;

    const updateFromScroll = () => {
        const scrollY = window.scrollY || window.pageYOffset;
        const height = header.offsetHeight || window.innerHeight;

        // progress is 0 when at top, 1 when scrolled past header height
        const progress = Math.min(1, Math.max(0, scrollY / height));

        // overlay alpha ranges 0..0.85 (controls darkening)
        const alpha = (progress * 0.85).toFixed(3);

        // parallax: small Y offset (subtle)
        const offsetPx = Math.round(progress * 60); // up to 60px offset

        // fade opacity: slightly stronger than overlay to blend into page
        const fadeOpacity = Math.min(1, 0.55 + progress * 0.9).toFixed(3); // 0.55..1.0

        // fade height: get deeper (higher) as we scroll a bit more
        const minHeight = 18; // vh
        const maxHeight = 40; // vh
        const heightVh = Math.round(minHeight + (maxHeight - minHeight) * progress);

        header.style.setProperty('--overlay-alpha', alpha);
        header.style.setProperty('--fade-opacity', fadeOpacity);
        header.style.setProperty('--fade-height', `${heightVh}vh`);
        header.style.backgroundPosition = `center calc(50% + ${offsetPx}px)`;

        ticking = false;
    };

    const onScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(updateFromScroll);
            ticking = true;
        }
    };

    // initial set
    updateFromScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateFromScroll);
}

export default null;
