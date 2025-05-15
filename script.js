document.addEventListener('DOMContentLoaded', function () {
    const navItems = document.querySelectorAll('.nav-item');
    const navScrollContainer = document.querySelector('.nav-scroll-container');
    const contentSections = document.querySelectorAll('.content-section');
    const contentArea = document.querySelector('.content-area');
    const navContainer = document.getElementById('nav-container');
    const themeToggle = document.querySelector('.theme-toggle');
    const themeSwitch = document.getElementById('theme-switch');

    // Hide theme toggle when scrolling down on mobile, show when scrolling up or at top
    let lastScrollTop = 0;

    window.addEventListener('scroll', function () {
        if (!isMobile) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 100 && scrollTop > lastScrollTop) {
            themeToggle.classList.add('hidden'); // hide
        } else {
            themeToggle.classList.remove('hidden'); // show
        }

        lastScrollTop = scrollTop;
    });

    // Create visual nav dot
    const navToggleDot = document.createElement('div');
    navToggleDot.classList.add('nav-toggle-dot');
    document.body.appendChild(navToggleDot);

    // Create hover zone
    const navHoverTrigger = document.createElement('div');
    navHoverTrigger.setAttribute('id', 'nav-hover-trigger');
    document.body.appendChild(navHoverTrigger);

    let activeIndex = 2;
    let isScrolling = false;
    let isMobile = window.innerWidth <= 1024;

    function checkMobile() {
        isMobile = window.innerWidth <= 1024;
        if (isMobile) {
            navContainer.classList.remove('open');
            contentArea.classList.remove('nav-open');
            navHoverTrigger.style.display = 'none';
            navToggleDot.style.display = 'none';
        } else {
            navHoverTrigger.style.display = 'block';
            navToggleDot.style.display = 'block';
        }
    }

    checkMobile();

    // Theme switching
    themeSwitch.addEventListener('change', function () {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeSwitch.checked = true;
    }

    // Navigation handling
    function openNav() {
        if (isMobile) return;
        navContainer.classList.add('open');
        contentArea.classList.add('nav-open');
        navToggleDot.classList.add('hidden');
    }

    function closeNav() {
        if (isMobile) return;
        navContainer.classList.remove('open');
        contentArea.classList.remove('nav-open');
        navToggleDot.classList.remove('hidden');
    }

    function updateActiveStates(index) {
        if (isScrolling || !navItems[index] || !contentSections[index]) return;

        isScrolling = true;
        navItems.forEach((item, i) => item.classList.toggle('active', i === index));
        contentSections.forEach((section, i) => {
            section.classList.toggle('active', i === index);
            if (i === index) section.scrollTop = 0;
        });

        navItems[index].scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(() => {
            isScrolling = false;
        }, 600);

        activeIndex = index;
    }

    setTimeout(() => {
        updateActiveStates(activeIndex);
    }, 100);

    navItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            updateActiveStates(index);
        });
    });

    navScrollContainer.addEventListener('wheel', function (e) {
        e.preventDefault();
        navScrollContainer.scrollTop += e.deltaY;

        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
            let closestItem = 0;
            let minDistance = Infinity;
            navItems.forEach((item, index) => {
                const rect = item.getBoundingClientRect();
                const containerRect = navScrollContainer.getBoundingClientRect();
                const distance = Math.abs((rect.top + rect.height / 2) - (containerRect.top + containerRect.height / 2));
                if (distance < minDistance) {
                    minDistance = distance;
                    closestItem = index;
                }
            });
            if (closestItem !== activeIndex) updateActiveStates(closestItem);
        }, 150);
    }, { passive: false });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            if (activeIndex > 0) updateActiveStates(activeIndex - 1);
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            if (activeIndex < navItems.length - 1) updateActiveStates(activeIndex + 1);
        }
    });

    // Hover logic
    let isInHoverZone = false;
    let isInNav = false;

    navHoverTrigger.addEventListener('mouseenter', () => {
        if (isMobile) return;
        isInHoverZone = true;
        openNav();
    });

    navHoverTrigger.addEventListener('mouseleave', () => {
        isInHoverZone = false;
        setTimeout(checkNavClose, 100);
    });

    navContainer.addEventListener('mouseenter', () => {
        if (isMobile) return;
        isInNav = true;
    });

    navContainer.addEventListener('mouseleave', () => {
        isInNav = false;
        setTimeout(checkNavClose, 100);
    });

    function checkNavClose() {
        if (!isInHoverZone && !isInNav) closeNav();
    }

    // Resize support
    window.addEventListener('resize', () => {
        checkMobile();
        setTimeout(() => {
            navItems[activeIndex].scrollIntoView({ behavior: 'auto', block: 'center' });
        }, 100);
    });

    document.querySelector('.toggle-label').addEventListener('click', function (e) {
        e.stopPropagation();
    });
});
