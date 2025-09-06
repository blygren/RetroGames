document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const passwordDisplay = document.getElementById('password-display');
    const copyBtn = document.getElementById('copy-btn');
    const copyStatus = document.getElementById('copy-status');
    const passwordHistory = document.getElementById('password-history');
    
    // Character sets
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    // Fixed password length
    const PASSWORD_LENGTH = 18;
    
    // Variables
    let currentPassword = '';
    let generatorInterval;
    let historyPasswords = [];
    let lastUpdateTime = 0;
    const updateFrequency = 50; // milliseconds
    
    // Generate password function
    function generatePassword() {
        // Use all character types
        const charPool = uppercase + lowercase + numbers + symbols;
        const charPoolLength = charPool.length;
        
        // Generate password
        let newPassword = '';
        
        // Ensure inclusion of at least one character from each type
        newPassword += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
        newPassword += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
        newPassword += numbers.charAt(Math.floor(Math.random() * numbers.length));
        newPassword += symbols.charAt(Math.floor(Math.random() * symbols.length));
        
        // Fill the rest of the password
        while (newPassword.length < PASSWORD_LENGTH) {
            const randomIndex = Math.floor(Math.random() * charPoolLength);
            newPassword += charPool.charAt(randomIndex);
        }
        
        // Shuffle password (Fisher-Yates algorithm)
        newPassword = newPassword.split('').sort(() => 0.5 - Math.random()).join('');
        
        // Trim if necessary (shouldn't be needed with our approach)
        if (newPassword.length > PASSWORD_LENGTH) {
            newPassword = newPassword.substring(0, PASSWORD_LENGTH);
        }
        
        currentPassword = newPassword;
        passwordDisplay.textContent = currentPassword;
        
        return currentPassword;
    }
    
    // Copy password to clipboard
    copyBtn.addEventListener('click', () => {
        if (!currentPassword) return;
        
        navigator.clipboard.writeText(currentPassword)
            .then(() => {
                copyStatus.textContent = 'Copied!';
                copyStatus.classList.add('show');
                
                // Add to history
                addToHistory(currentPassword);
                
                setTimeout(() => {
                    copyStatus.classList.remove('show');
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    });
    
    // Add password to history
    function addToHistory(password) {
        // Prevent duplicates
        if (historyPasswords.includes(password)) return;
        
        // Add to array (max 5)
        historyPasswords.unshift(password);
        if (historyPasswords.length > 5) {
            historyPasswords.pop();
        }
        
        // Update UI
        updateHistoryUI();
    }
    
    // Update history UI
    function updateHistoryUI() {
        passwordHistory.innerHTML = '';
        
        historyPasswords.forEach(password => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const passwordText = document.createElement('span');
            passwordText.className = 'history-password';
            passwordText.textContent = password;
            
            const copyHistoryBtn = document.createElement('button');
            copyHistoryBtn.className = 'copy-history-btn';
            copyHistoryBtn.innerHTML = '<i class="fas fa-copy"></i>';
            copyHistoryBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(password)
                    .then(() => {
                        copyStatus.textContent = 'Copied from history!';
                        copyStatus.classList.add('show');
                        
                        setTimeout(() => {
                            copyStatus.classList.remove('show');
                        }, 2000);
                    });
            });
            
            historyItem.appendChild(passwordText);
            historyItem.appendChild(copyHistoryBtn);
            passwordHistory.appendChild(historyItem);
        });
    }
    
    // Start continuous millisecond password generation
    function startPasswordGeneration() {
        // Generate initial password
        generatePassword();
        
        // Use requestAnimationFrame for smoother updates
        function animatePasswordGeneration(timestamp) {
            // Update if enough time has passed
            if (timestamp - lastUpdateTime >= updateFrequency) {
                lastUpdateTime = timestamp;
                generatePassword();
            }
            
            // Continue animation loop
            requestAnimationFrame(animatePasswordGeneration);
        }
        
        // Start the animation loop
        requestAnimationFrame(animatePasswordGeneration);
    }
    
    // Start the generator
    startPasswordGeneration();
});
