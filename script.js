// Theme Toggle (with localStorage)
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.checked = true;
}

// Toggle on change
themeToggle.addEventListener('change', function() {
    if (this.checked) {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }
});

// Existing Toggle password visibility
document.getElementById('toggle-password').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.getElementById('toggle-password');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = '🙈';  // Closed eye for hidden
        toggleBtn.title = 'Hide Password';
    } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = '👁️';  // Open eye for visible
        toggleBtn.title = 'Show Password';
    }
});

function calculateEntropy() {
    const pwd = document.getElementById('password').value;
    if (!pwd) {
        document.getElementById('result').style.display = 'none';
        return;
    }

    // Detect sets (94 max charset)
    const lowercase = /[a-z]/.test(pwd) ? 26 : 0;
    const uppercase = /[A-Z]/.test(pwd) ? 26 : 0;
    const digits = /\d/.test(pwd) ? 10 : 0;
    const symbols = /[^a-zA-Z0-9]/.test(pwd) ? 32 : 0;
    const totalCharset = lowercase + uppercase + digits + symbols;
    const length = pwd.length;

    // Entropy (log2(charset^length))
    const entropy = totalCharset > 0 ? Math.log2(Math.pow(totalCharset, length)) : 0;

    // Debug logs (F12 Console)
    console.log(`Input: "${pwd}" | Length: ${length} | Charset: ${totalCharset} (L:${lowercase} U:${uppercase} D:${digits} S:${symbols}) | Entropy: ${entropy.toFixed(2)} bits`);

    // Strength
    let strength = 'weak';
    let strengthText = 'Weak (Guessable)';
    if (entropy < 40) {
        strengthText = 'Weak (Guessable)';
    } else if (entropy < 80) {
        strength = 'medium';
        strengthText = 'Medium (Fair)';
    } else {
        strength = 'strong';
        strengthText = 'Strong (Secure)';
    }

    // Crack time (1e10/sec GPU)
    let secondsToCrack;
    try {
        secondsToCrack = Math.pow(2, entropy) / 1e10;
        if (!isFinite(secondsToCrack)) {
            const exponent = entropy / Math.log2(1e10);
            secondsToCrack = Math.pow(10, exponent * Math.log10(31536000));
        }
        console.log(`Guesses: ~2^${entropy.toFixed(2)} | Seconds to crack: ${secondsToCrack.toExponential(2)}`);
    } catch (e) {
        secondsToCrack = entropy < 0 ? 0 : Math.pow(10, (entropy - 30) * 0.3);
    }

    // Cosmic scales
    const years = secondsToCrack / 31536000;
    let timeStr;
    if (secondsToCrack < 1) {
        timeStr = '< 1 second';
    } else if (secondsToCrack < 3600) {
        timeStr = `${Math.round(secondsToCrack)} seconds`;
    } else if (secondsToCrack < 86400) {
        timeStr = `${Math.round(secondsToCrack / 3600)} hours`;
    } else if (secondsToCrack < 31536000) {
        timeStr = `${Math.round(secondsToCrack / 86400)} days`;
    } else if (years < 100) {
        timeStr = `${Math.round(years)} years (longer than a human lifetime: ~80 years)`;
    } else if (years < 1e4) {
        timeStr = `${(years / 1000).toFixed(1)} thousand years (since human civilization began: ~10,000 years)`;
    } else if (years < 6.6e7) {
        timeStr = `${(years / 1e6).toFixed(1)} million years (dinosaur extinction: 66 million years ago)`;
    } else if (years < 4.5e9) {
        timeStr = `${(years / 1e9).toFixed(1)} billion years (age of Earth: 4.5 billion years)`;
    } else if (years < 1.38e10) {
        timeStr = `${(years / 1e9).toFixed(1)} billion years (age of the universe: 13.8 billion years)`;
    } else if (years < 5e9 * 2) {
        timeStr = `${(years / 1e9).toFixed(1)} billion years (until the Sun becomes a red giant and engulfs Earth: ~5 billion years)`;
    } else if (years < 1e23) {
        timeStr = `${(years / 1e12).toExponential(1)} trillion years (galactic clusters dissolve: ~10^14 years)`;
    } else if (years < 1e34) {
        timeStr = `${(years / 1e12).toExponential(1)} trillion years (proton decay timescale: 10^34 years)`;
    } else if (years < 2e66) {
        timeStr = `${(years / 1e34).toExponential(1)} × 10^34 years (stellar black hole evaporation: 10^67 years)`;
    } else if (years < 1e100) {
        timeStr = `${(years / 1e66).toExponential(1)} × 10^66 years (supermassive black hole dominance ends: 10^100 years)`;
    } else {
        timeStr = `${(years / 1e100).toExponential(1)} googol years (heat death of the universe: 10^100 years or beyond)`;
    }

    // Update DOM
    document.getElementById('length').textContent = length;
    document.getElementById('lowercase').textContent = lowercase > 0 ? 'Yes' : 'No';
    document.getElementById('uppercase').textContent = uppercase > 0 ? 'Yes' : 'No';
    document.getElementById('digits').textContent = digits > 0 ? 'Yes' : 'No';
    document.getElementById('symbols').textContent = symbols > 0 ? 'Yes' : 'No';
    document.getElementById('charset').textContent = totalCharset;
    document.getElementById('entropy').textContent = entropy.toFixed(2);
    document.getElementById('strength').textContent = strengthText;
    document.getElementById('strength').className = `strength ${strength}`;
    document.getElementById('crack-time').textContent = timeStr;

    document.getElementById('result').style.display = 'block';
    document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
}

// Live on input
document.getElementById('password').addEventListener('input', calculateEntropy);

// Button click
document.getElementById('calculate-btn').addEventListener('click', calculateEntropy);

// Enter key
document.getElementById('password').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') calculateEntropy();
});
