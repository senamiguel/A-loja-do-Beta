document.addEventListener("DOMContentLoaded", () => {
    const metroReadout = document.getElementById("metro-readout");
    const metroStart = document.getElementById("metro-start");

    if (!metroReadout || !metroStart) {
        return;
    }

    let isCounting = false;
    let startScrollY = 0;
    const hrOffsetTop = metroStart.offsetTop;
    let scrollTimer = null;

    window.addEventListener("scroll", () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const hrTop = metroStart.getBoundingClientRect().top;
        const inCountingZone = hrTop < windowHeight && (scrollY + windowHeight) > hrOffsetTop;

        clearTimeout(scrollTimer);

        if (inCountingZone) {
            if (!isCounting) {
                isCounting = true;
                startScrollY = scrollY;
            }

            const distance = Math.max(0, (scrollY - startScrollY) / 10);
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