document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    const navScrollContainer = document.querySelector('.nav-scroll-container');
    const contentSections = document.querySelectorAll('.content-section');
    const contentArea = document.querySelector('.content-area');
    
    // Initialize with the middle item (3rd) active
    let activeIndex = 2; // 0-based index
    let isScrolling = false;

    // Function to update active states and scroll nav to center the active item
    function updateActiveStates(index) {
        // Prevent multiple rapid updates
        if (isScrolling) return;
        isScrolling = true;
        
        // Update navigation items
        navItems.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Update content sections
        contentSections.forEach((section, i) => {
            if (i === index) {
                section.classList.add('active');
                
                // Lock scrolling at the top of the section
                contentArea.scrollTop = 0;
                
                // Disable scrolling for a moment to prevent accidental scrolling
                contentArea.style.overflow = 'hidden';
                
                // Re-enable scrolling after a short delay
                setTimeout(() => {
                    contentArea.style.overflow = 'auto';
                    isScrolling = false;
                }, 800);
            } else {
                section.classList.remove('active');
            }
        });
        
        // Scroll nav to center the active item
        navItems[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        activeIndex = index;
    }
    
    // Initialize with the middle item active
    setTimeout(() => {
        updateActiveStates(activeIndex);
    }, 100);
    
    // Add click event listeners to nav items
    navItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            updateActiveStates(index);
        });
    });
    
    // Add wheel event listener to enable scroll wheel navigation
    navScrollContainer.addEventListener('wheel', function(e) {
        e.preventDefault();
        const delta = e.deltaY;
        navScrollContainer.scrollTop += delta;
        
        // Detect which item is centered after scrolling
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
            let closestItem = 0;
            let minDistance = Infinity;
            
            navItems.forEach((item, index) => {
                const rect = item.getBoundingClientRect();
                const containerRect = navScrollContainer.getBoundingClientRect();
                const distance = Math.abs(
                    (rect.top + rect.height/2) - 
                    (containerRect.top + containerRect.height/2)
                );
                
                if (distance < minDistance) {
                    minDistance = distance;
                    closestItem = index;
                }
            });
            
            if (closestItem !== activeIndex) {
                updateActiveStates(closestItem);
            }
        }, 150);
    }, { passive: false });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowUp' && activeIndex > 0) {
            updateActiveStates(activeIndex - 1);
        } else if (e.key === 'ArrowDown' && activeIndex < navItems.length - 1) {
            updateActiveStates(activeIndex + 1);
        }
    });
});
