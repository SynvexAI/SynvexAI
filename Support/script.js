document.addEventListener('DOMContentLoaded', function() { 
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggleButton.addEventListener('click', () => {
        let newTheme = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        const icon = themeToggleButton.querySelector('i');
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    
    const backToTopButton = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            if (!backToTopButton.style.display || backToTopButton.style.display === 'none') {
                backToTopButton.style.display = 'flex';
                backToTopButton.style.opacity = '1';
            }
        } else {
            backToTopButton.style.opacity = '0';
            setTimeout(() => {
                if (window.pageYOffset <= 300) {
                    backToTopButton.style.display = 'none';
                }
            }, 300);
        }
    });
    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    
    const copyrightYearsElement = document.getElementById('copyright-years');
    if (copyrightYearsElement) {
        const currentYear = new Date().getFullYear();
        copyrightYearsElement.textContent = `© ${currentYear} SynvexAI`;
    }
    
    
    const textarea = document.getElementById('promptInput');
    textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = (textarea.scrollHeight) + 'px';
    });

    
    const supportForm = document.getElementById('support-form');
    const formStatus = document.getElementById('form-status');

    supportForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const message = textarea.value.trim();
        if (!message) {
            showStatus('Пожалуйста, введите ваше сообщение.', 'error');
            return;
        }

        const email = 'synvexai@gmail.com';
        const subject = 'Обращение в поддержку SynvexAI';      
        
        const body = encodeURIComponent(message);     
        
        const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${body}`;       
        
        window.location.href = mailtoLink;

        showStatus('Откройте ваш почтовый клиент, чтобы завершить отправку.', 'success');
    });

    function showStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = `status-${type}`;       
        
        setTimeout(() => {
           formStatus.textContent = '';
           formStatus.className = '';
        }, 7000);
    }
});