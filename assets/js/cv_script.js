document.addEventListener('DOMContentLoaded', () => {

    const instructionParagraph = document.getElementById('instruction-paragraph');
    const passwordDisplayArea = document.getElementById('password-display-area');
    const passwordCanvas = document.getElementById('passwordCanvas');
    const reloadCaptchaButton = document.getElementById('reloadCaptchaButton');
    const passwordPrompt = document.getElementById('password-prompt');
    const passwordInput = document.getElementById('passwordInput');
    const unlockButton = document.getElementById('unlockButton');
    const errorMessage = document.getElementById('error-message');
    const referencesSection = document.getElementById('references'); 
    const referencesListUl = document.getElementById('references-list'); 

    let currentCaptchaText = '';

    const referenceData = [
        {
            name: "Nuri Çağrı Yolyapar",
            title: "Eğitmen (Bilge Adam Akademi)",
            phone: "0533 766 43 78"
        },
        {
            name: "Fatih Günalp",
            title: "Eğitmen (Bilge Adam Akademi)",
            phone: "0534 835 76 76"
        }

    ];


    function generateCaptcha() {
        const canvas = passwordCanvas;
        const ctx = canvas.getContext('2d');
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let captcha = '';
        for (let i = 0; i < 5; i++) {
            captcha += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        currentCaptchaText = captcha;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#f0f0f0'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = 'bold 24px Arial'; 
        ctx.fillStyle = '#333'; 
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let i = 0; i < 3; i++) {
            ctx.strokeStyle = `rgba(0,0,0,${Math.random() * 0.3 + 0.1})`; 
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.stroke();
        }

        const textWidth = ctx.measureText(captcha).width;
        const startX = (canvas.width - textWidth) / 2 + (Math.random() - 0.5) * 10; 
        const startY = canvas.height / 2 + (Math.random() - 0.5) * 5;       

        ctx.save(); 
        ctx.translate(startX + textWidth / 2, startY); 
        ctx.rotate((Math.random() - 0.5) * 0.1); 
        ctx.fillText(captcha, -textWidth / 2, 0); 
        ctx.restore();

        errorMessage.style.display = 'none';
        passwordInput.value = '';
    }


    function populateReferences() {
        referencesListUl.innerHTML = ''; 

        referenceData.forEach(ref => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<b>${ref.name}</b> - ${ref.title} (Telefon: ${ref.phone})`;
            referencesListUl.appendChild(listItem);
        });
    }

    reloadCaptchaButton.addEventListener('click', generateCaptcha);

    unlockButton.addEventListener('click', () => {
        const userInput = passwordInput.value.trim();

        if (userInput.toLowerCase() === currentCaptchaText.toLowerCase()) {

            errorMessage.style.display = 'none';
            instructionParagraph.style.display = 'none'; 
            passwordDisplayArea.style.display = 'none';  
            passwordPrompt.style.display = 'none';


            populateReferences();
            referencesSection.style.display = 'block';

        } else {
            errorMessage.style.display = 'block';
            generateCaptcha();
        }
    });


    passwordInput.addEventListener('input', () => {
        if (errorMessage.style.display === 'block') {
            errorMessage.style.display = 'none';
        }
    });


    generateCaptcha(); 

    referencesSection.style.display = 'none';
    errorMessage.style.display = 'none'; 
});