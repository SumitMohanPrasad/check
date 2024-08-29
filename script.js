document.addEventListener("DOMContentLoaded", function() {
    // Smooth scrolling for internal links
    const navLinks = document.querySelectorAll('.nav-item');

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const href = this.getAttribute('href');
            
            // Check if the link is an internal link (i.e., same page section)
            if (!href.startsWith('http') && href.startsWith('#')) {
                event.preventDefault(); // Prevent default navigation

                // Handle internal link smooth scrolling
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});


function loadHTML(elementId, fileName) {
    fetch(fileName)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        })
        .catch(error => console.error('Error loading HTML:', error));
}

window.onload = function() {
    loadHTML('footer', 'footer.html');
};
