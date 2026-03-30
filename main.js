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

    // 최신 비동기 Fetch API 기반 전송 로직
    const contactForm = document.getElementById('contact-form');
    const contactWrapper = document.getElementById('contact-wrapper');
    const successDisplay = document.getElementById('success-message');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn?.querySelector('.btn-text');
    const btnLoader = submitBtn?.querySelector('.btn-loader');

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            // 버튼 상태 전환
            submitBtn.disabled = true;
            if (btnText) btnText.style.display = 'none';
            if (btnLoader) btnLoader.style.display = 'inline-block';

            const formData = new FormData(contactForm);
            const jsonData = Object.fromEntries(formData.entries());

            try {
                // 최신 안정 전송 방식: JSON 페이로드 사용
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(jsonData)
                });

                if (response.ok) {
                    // 폼을 숨기고 성공 메시지 표시 (Modern UX)
                    contactForm.style.display = 'none';
                    successDisplay.style.display = 'block';
                    successDisplay.classList.add('fade-in');
                } else {
                    const errorData = await response.json();
                    alert(errorData.errors ? errorData.errors[0].message : '전송에 실패했습니다. 이메일 주소를 확인해주세요.');
                    resetButton();
                }
            } catch (error) {
                console.error('Error:', error);
                alert('서버 연결에 실패했습니다. 네트워크 상태를 확인해주세요.');
                resetButton();
            }
        });
    }

    function resetButton() {
        submitBtn.disabled = false;
        if (btnText) btnText.style.display = 'inline-block';
        if (btnLoader) btnLoader.style.display = 'none';
    }
});
