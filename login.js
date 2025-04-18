
document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const rememberCheck = document.getElementById('remember');
    
    // Load saved email if exists
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberCheck.checked = true;
    }
    
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = emailInput.value;
        
        // Save email if remember me is checked
        if (rememberCheck.checked) {
            localStorage.setItem('userEmail', email);
        } else {
            localStorage.removeItem('userEmail');
        }
        
        // Redirect to main page after login
        window.location.href = 'index.html';
    });
});
