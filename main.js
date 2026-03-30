document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.roadmap-section').forEach(section => {
        observer.observe(section);
    });

    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        updateToggleIcon(savedTheme);
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateToggleIcon(newTheme);
    });

    function updateToggleIcon(theme) {
        const icon = themeToggle.querySelector('.mode-icon');
        icon.textContent = theme === 'light' ? '☀️' : '🌙';
    }

    // Formspree AJAX Submission
    const contactForm = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const data = new FormData(event.target);
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            status.textContent = '';
            status.className = 'form-status';

            try {
                const response = await fetch(event.target.action, {
                    method: contactForm.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    status.textContent = '문의가 성공적으로 전달되었습니다. 감사합니다!';
                    status.classList.add('success');
                    contactForm.reset();
                } else {
                    const result = await response.json();
                    if (Object.hasOwn(result, 'errors')) {
                        status.textContent = result.errors.map(error => error.message).join(", ");
                    } else {
                        status.textContent = '오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
                    }
                    status.classList.add('error');
                }
            } catch (error) {
                status.textContent = '서버와 통신 중 오류가 발생했습니다.';
                status.classList.add('error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Inquiry';
            }
        });
    }
});
