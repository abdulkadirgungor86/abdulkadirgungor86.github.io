/**
 * Footer'daki telif hakkı metninde geçen yılı güncel yıl ile değiştirir.
 */
function updateFooterYear() {
  const footerTextEl = document.getElementById('footerTextContent');
  if (footerTextEl) {
    const currentYear = new Date().getFullYear();
    footerTextEl.textContent = footerTextEl.textContent.replace('{YEAR}', currentYear);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Footer yılı güncelle
  updateFooterYear();

  // Captcha ve referans işlemleri
  const instructionParagraph = document.getElementById("instruction-paragraph"),
    passwordDisplayArea = document.getElementById("password-display-area"),
    passwordCanvas = document.getElementById("passwordCanvas"),
    reloadCaptchaButton = document.getElementById("reloadCaptchaButton"),
    passwordPrompt = document.getElementById("password-prompt"),
    passwordInput = document.getElementById("passwordInput"),
    unlockButton = document.getElementById("unlockButton"),
    errorMessage = document.getElementById("error-message"),
    references = document.getElementById("references"),
    referencesList = document.getElementById("references-list");

  let captchaCode = "";

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
    const ctx = canvas.getContext("2d");
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    captchaCode = code;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "bold 24px Arial";
    ctx.fillStyle = "#333";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Draw random lines
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = `rgba(0,0,0,${0.3 * Math.random() + 0.1})`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    const textWidth = ctx.measureText(code).width;
    const x = (canvas.width - textWidth) / 2 + (Math.random() - 0.5) * 10;
    const y = canvas.height / 2 + (Math.random() - 0.5) * 5;

    ctx.save();
    ctx.translate(x + textWidth / 2, y);
    ctx.rotate((Math.random() - 0.5) * 0.1);
    ctx.fillText(code, -textWidth / 2, 0);
    ctx.restore();

    errorMessage.style.display = "none";
    passwordInput.value = "";
  }

  function showReferences() {
    referencesList.innerHTML = "";
    referenceData.forEach((ref) => {
      const li = document.createElement("li");
      li.innerHTML = `<b>${ref.name}</b> - ${ref.title} (Telefon: ${ref.phone})`;
      referencesList.appendChild(li);
    });
  }

  reloadCaptchaButton.addEventListener("click", generateCaptcha);

  unlockButton.addEventListener("click", () => {
    const input = passwordInput.value.trim();
    if (input.toLowerCase() === captchaCode.toLowerCase()) {
      errorMessage.style.display = "none";
      instructionParagraph.style.display = "none";
      passwordDisplayArea.style.display = "none";
      passwordPrompt.style.display = "none";
      showReferences();
      references.style.display = "block";
    } else {
      errorMessage.style.display = "block";
      generateCaptcha();
    }
  });

  passwordInput.addEventListener("input", () => {
    if (errorMessage.style.display === "block") {
      errorMessage.style.display = "none";
    }
  });

  generateCaptcha();
  references.style.display = "none";
  errorMessage.style.display = "none";
});
