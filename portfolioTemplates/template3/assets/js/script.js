document.addEventListener('DOMContentLoaded', function () {
    // --- Element Referansları ---
    const titleElement = document.getElementById('title');
    const contentElement = document.getElementById('content');
    const outputContainer = document.getElementById('output-container');
    const menuElement = document.getElementById('menu');
    const inputAreaElement = document.getElementById('input-area');
    const contentWrapper = document.querySelector('.content-wrapper');
    const headerSection = document.getElementById('header-section');
    const mainContentSection = document.getElementById('main-content-section');
    const postAnimationSpacing = document.getElementById('post-animation-spacing'); // Boşluk için

    const animationTargets = [titleElement, contentElement, menuElement];

    // --- Sabitler ve Değişkenler ---
    const CURSOR_CLASS = 'typing-cursor';
    let isScriptTyping = false;
    let errorIntervalId = null;
    const TYPE_DELAY = { NORMAL: 35, FAST: 25, SLOW: 60 };
    const ERROR_INTERVAL = 10000;
    const MAX_RANDOM_ERRORS = 10;
    let randomErrorCount = 0;

    // --- İçerik ve Menü Tanımları (Güncellendi) ---
    const siteContent = {
        title: "Linux Interactive Terminal", // Yeni Başlık
        home: `Linux interaktif terminali, veya komut satırı arayüzü, modern bilişimin temelinde yer alan, işletim sistemiyle doğrudan ve güçlü bir iletişim kanalı sunan, Unix'in ilk günlerinden miras kalan bir araçtır. Grafik arayüzlerin yaygınlığına rağmen, terminal özellikle sunucu yönetimi, yazılım geliştirme ve otomasyon gibi alanlarda hız, esneklik, kaynak verimliliği ve derinlemesine sistem kontrolü gibi avantajları nedeniyle vazgeçilmezliğini korur; SSH gibi protokoller sayesinde uzaktan yönetimi standart hale getirir.\n\nBu interaktif deneyim, kullanıcının girdiği komutları yorumlayan Bash veya Zsh gibi bir kabuk aracılığıyla çalışır ve genellikle kullanıcıyı, makine adını ve bulunulan dizini gösteren bir komut istemiyle başlar. Kullanıcılar, ls, cd, rm gibi temel komutları, davranışlarını değiştiren argümanlar ve seçeneklerle birlikte kullanarak görevleri yerine getirirler; bu süreçte klavyeden gelen standart girdi, ekrana giden standart çıktı ve standart hata akışları kullanılır.\n\nKomut satırının gerçek gücü, bir komutun çıktısını diğerinin girdisine bağlayan boru hatları (|) ve akışları dosyalara yönlendiren yönlendirme (>, <) gibi mekanizmalarla ortaya çıkar; bunlar, komut geçmişi ve Tab tuşuyla otomatik tamamlama gibi özelliklerle birleşerek verimliliği artırır. Bu yapı, "her program tek bir işi iyi yapsın" Unix felsefesini yansıtır; küçük, özelleşmiş araçların birleştirilmesiyle karmaşık sorunlar çözülür.\n\nBaşlangıçta bir öğrenme eğrisi olsa da, komut satırında ustalaşmak, görevleri otomatikleştirme ve sistemi derinlemesine anlama konusunda büyük bir tatmin ve yetkinlik sağlar. Web tabanlı terminal simülasyonları ise bu deneyimi tarayıcıya taşıyarak eğitim, portfolyo sunumu ve interaktif kullanıcı deneyimleri için popüler bir yöntem haline gelmiştir, terminalin minimalist estetiğini ve temel işlevselliğini taklit ederek bu güçlü arayüzün ruhunu yansıtır.`, // Yeni Metin
        about: `Hakkımda\n\nİnşaat Yüksek Mühendisi olarak edindiğim sağlam analitik temel ve problem çözme disiplinini, yazılım geliştirme dünyasına duyduğum derin tutkuyla birleştirerek kariyerimde yeni bir sayfa açıyorum. Bu dönüşüm sürecinde kendimi .NET Framework MVC, .NET Core MVC/WEB API, C#, Python, JavaScript ve Entity Framework/EF Core gibi modern teknolojilerde yetkinlik kazanmaya adadım.\n\nÖzellikle BilgeAdam Akademi'nin 320 saatlik kapsamlı Yazılım (.Net) Sertifikasyon Programı ile teknik bilgimi pekiştirirken, Nesne Yönelimli Programlama, temel Tasarım Desenleri, NTier ve Onion gibi mimari yaklaşımlar ile SOLID prensipleri üzerine güçlü bir anlayış geliştirdim.\n\nMühendislik geçmişimin getirdiği sistematik düşünce yapısını, yazılımın yaratıcı ve dinamik doğasıyla harmanlayarak yenilikçi ve sürdürülebilir çözümler üretmeyi hedefliyorum. Takım çalışmasına yatkınlığım ve hedef odaklı projelerde değer yaratma isteğimle, hızla gelişen teknoloji dünyasına uyum sağlayarak yazılım sektöründe tam zamanlı, başarılı bir kariyer inşa etmeyi amaçlıyorum. Öğrenmeye ve kendimi geliştirmeye olan bağlılığımla, işbirlikçi ortamlarda pozitif katkı sağlamaya hazırım.`, // Yeni Hakkımda Metni
        contact: `İletişim\n\nE-posta: abdulkadirgungor.86@outlook.com \nGitHub: abdulkadirgungor86\nLinkedIn: https://www.linkedin.com/in/abdulkadir-güngör/ \n\nProje/işbirliği için ulaşın.` // Öncekiyle aynı
    };
    const menuItems = [ /* Öncekiyle aynı */
        { name: "Anasayfa", contentKey: "home" },
        { name: "Hakkımda", contentKey: "about" },
        { name: "İletişim", contentKey: "contact" }
    ];

    // --- Hata Mesajları ---
     const allErrorMessages = [ /* Önceki uzun liste */
        "Error: Unknown command entered by user", "Syntax error near unexpected token `fi` found", "Permission denied for current operation",
        "File not found in specified directory", "No such file or directory available", "Command not found, check your PATH",
        "Invalid argument provided to function", "Operation not permitted for this user", "Segmentation fault (core dumped) - memory access error",
        "Bus error detected during execution", "Floating point exception occurred now", "Illegal instruction encountered in code",
        "Kernel panic - not syncing: Fatal exception occurred", "Out of memory: Kill process or sacrifice child immediately",
        "Disk quota exceeded for user account", "Read-only file system detected, cannot write", "Too many open files in system",
        "Connection refused by remote server", "Connection timed out waiting for response", "Network is unreachable at the moment",
        "Host not found in DNS records", "Authentication failure, please check credentials", "Access denied for requested resource",
        "Resource temporarily unavailable, try again later", "Interrupted system call received by process", "Bad file descriptor used in operation",
        "I/O error occurred during read/write", "No space left on device storage", "Broken pipe detected during communication",
        "Invalid configuration file syntax found", "Module not found for required library", "Dependency conflict detected between packages",
        "Timeout waiting for server response", "Unexpected end of file reached prematurely", "Format error in data stream",
        "Data corruption detected in file system", "Checksum error during data validation", "Invalid input provided by the user",
        "Operation canceled by user request", "Not implemented feature or function", "Feature disabled by administrator settings",
        "Internal server error, please contact support", "Service unavailable due to maintenance", "Gateway timeout, upstream server not responding",
        "TypeError: Cannot read property 'value' of undefined", "ReferenceError: specificVariable is not defined",
        "SyntaxError: Invalid or unexpected token found", "RangeError: Maximum call stack size exceeded",
        "URIError: URI malformed, check encoding", "EvalError: Eval function is disabled for security",
        "NullPointerException in Java code simulation", "IndexOutOfBoundsException: Array index out of range",
        "ArithmeticException: Division by zero attempted", "FileNotFoundException: Could not locate the file",
        "IOException during file operation sequence", "ClassCastException: Invalid type casting attempted",
        "IllegalArgumentException: Method received invalid parameter", "IllegalStateException: Object in wrong state for operation",
        "StackOverflowError: Recursive function too deep", "OutOfMemoryError: Java heap space exhausted",
        "AssertionError: Assertion condition failed verification", "UnsatisfiedLinkError: Native library link failed",
        "ImportError: No module named 'required_module'", "KeyError: 'missing_key' not found in dictionary",
        "AttributeError: 'object_instance' object has no attribute 'missing_attribute'",
        "IndentationError: expected an indented block in Python", "ValueError: invalid literal for int() with base 10: 'text'",
        "ZeroDivisionError: integer division or modulo by zero", "NotImplementedError: Functionality not yet implemented",
        "EPERM: Operation not permitted by permissions", "ENOENT: No such file or directory on path",
        "ESRCH: No such process found with PID", "EINTR: Interrupted system call during wait",
        "EIO: Input/output error during disk access", "ENXIO: No such device or address configured",
        "E2BIG: Argument list too long for system", "ENOEXEC: Exec format error, not executable",
        "EBADF: Bad file number or descriptor", "ECHILD: No child processes available to wait for",
        "EAGAIN: Try again, resource temporarily unavailable", "ENOMEM: Out of memory allocating resources",
        "EACCES: Permission denied to access file", "EFAULT: Bad address pointer encountered",
        "ENOTBLK: Block device required for operation", "EBUSY: Device or resource busy, cannot access",
        "EEXIST: File exists, cannot overwrite/create", "EXDEV: Cross-device link not permitted",
        "ENODEV: No such device found in system", "ENOTDIR: Not a directory component in path",
        "EISDIR: Is a directory, cannot treat as file", "EINVAL: Invalid argument passed to syscall",
        "ENFILE: File table overflow in system", "EMFILE: Too many open files by process",
        "ENOTTY: Not a typewriter device (inappropriate ioctl)", "ETXTBSY: Text file busy, cannot execute",
        "EFBIG: File too large for system limits", "ENOSPC: No space left on device partition",
        "ESPIPE: Illegal seek operation attempted", "EROFS: Read-only file system modification attempted",
        "EMLINK: Too many links pointing to file", "EPIPE: Broken pipe during inter-process communication",
        "EDOM: Math argument out of domain of function", "ERANGE: Math result not representable (overflow/underflow)",
        "EDEADLK: Resource deadlock would occur, avoided", "ENAMETOOLONG: File name too long for filesystem",
        "ENOLCK: No record locks available currently", "ENOSYS: Function not implemented in kernel",
        "ENOTEMPTY: Directory not empty, cannot remove", "ELOOP: Too many symbolic links encountered",
        "EWOULDBLOCK: Operation would block (non-blocking I/O)", "ENOMSG: No message of desired type in queue",
        "EIDRM: Identifier removed from system", "ECONNRESET: Connection reset by peer unexpectedly",
        "ENOBUFS: No buffer space available for operation", "EISCONN: Transport endpoint is already connected",
        "ENOTCONN: Transport endpoint is not connected", "ESHUTDOWN: Cannot send after transport endpoint shutdown",
        "ETOOMANYREFS: Too many references: cannot splice", "ETIMEDOUT: Connection timed out during network operation",
        "ECONNREFUSED: Connection refused by target host", "EHOSTDOWN: Host is down and unreachable",
        "EHOSTUNREACH: No route to host available", "EALREADY: Operation already in progress now",
        "EINPROGRESS: Operation now in progress (non-blocking)"
    ];
    const filteredErrorMessages = allErrorMessages.filter(msg => msg.split(' ').length >= 3);


    // --- Temel Fonksiyonlar ---

    function placeCursor(targetElement = inputAreaElement) { /* Öncekiyle aynı */
        animationTargets.forEach(el => el?.classList.remove(CURSOR_CLASS));
        inputAreaElement.classList.remove(CURSOR_CLASS);
        if (targetElement && (targetElement !== inputAreaElement || inputAreaElement.textContent.trim() === '')) {
             targetElement.classList.add(CURSOR_CLASS);
        }
        if (targetElement === inputAreaElement && !isScriptTyping) {
            setTimeout(() => {
                inputAreaElement.focus();
                const range = document.createRange(); const sel = window.getSelection();
                range.selectNodeContents(inputAreaElement); range.collapse(false);
                sel?.removeAllRanges(); sel?.addRange(range);
            }, 0);
        }
    }

    function typeWriter(element, text, delay, callback) { /* Öncekiyle aynı */
        if (!element) { console.error("typeWriter: Element eksik!"); if (callback) callback(); return; }
        isScriptTyping = true;
        const prefix = (element !== menuElement) ? "> " : "";
        element.innerHTML = prefix;
        placeCursor(element);
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i); i++;
                contentWrapper.scrollTop = contentWrapper.scrollHeight;
            } else {
                clearInterval(typeInterval); isScriptTyping = false;
                if (callback) { callback(); }
                else { placeCursor(inputAreaElement); }
            }
        }, delay);
    }

    function shakeElements() { /* Öncekiyle aynı */
        const elementsToShake = [ headerSection, mainContentSection, ...outputContainer.querySelectorAll('.prompt-line') ];
        elementsToShake.forEach(el => { if(el) { el.classList.add('shake'); setTimeout(() => { el.classList.remove('shake'); }, 400); } });
    }

    function addOutputLine(message, type = 'normal') { /* Öncekiyle aynı */
        const lineDiv = document.createElement('div');
        if (type === 'error') {
            lineDiv.classList.add('prompt-line');
            const promptSymbol = document.createElement('span'); promptSymbol.classList.add('prompt-symbol', 'visible'); promptSymbol.textContent = '>'; lineDiv.appendChild(promptSymbol);
            const errorP = document.createElement('p'); errorP.textContent = message; lineDiv.appendChild(errorP);
        } else { lineDiv.classList.add('output-line', type); lineDiv.textContent = message; }
        outputContainer.appendChild(lineDiv);
        contentWrapper.scrollTop = contentWrapper.scrollHeight;
        if (!isScriptTyping) { placeCursor(inputAreaElement); }
    }

    function showError(message) { shakeElements(); addOutputLine(message, 'error'); }
    function showOutput(message) { addOutputLine(message, 'normal'); }
    function showInputEcho(command) { addOutputLine(`> ${command}`, 'echo'); }

    function showRandomError() { /* Öncekiyle aynı */
         if (isScriptTyping || randomErrorCount >= MAX_RANDOM_ERRORS) { if (randomErrorCount >= MAX_RANDOM_ERRORS && errorIntervalId) { clearInterval(errorIntervalId); errorIntervalId = null; } return; }
         if (filteredErrorMessages.length === 0) { if(errorIntervalId) clearInterval(errorIntervalId); return; }
         const randomIndex = Math.floor(Math.random() * filteredErrorMessages.length);
         showError(filteredErrorMessages[randomIndex]); randomErrorCount++;
         if (randomErrorCount >= MAX_RANDOM_ERRORS && errorIntervalId) { clearInterval(errorIntervalId); errorIntervalId = null; console.log("Maksimum rastgele hata sayısına ulaşıldı."); }
    }

    function buildMenuLinks() { /* Öncekiyle aynı */
        if (!menuElement) return; menuElement.innerHTML = '';
        menuItems.forEach((item, index) => {
            const a = document.createElement('a'); a.href = '#'; a.dataset.contentKey = item.contentKey; a.textContent = item.name; menuElement.appendChild(a);
            if (index < menuItems.length - 1) { const separator = document.createElement('span'); separator.classList.add('menu-separator'); separator.textContent = '|'; menuElement.appendChild(separator); }
        });
        addMenuListeners();
    }

    function addMenuListeners() { /* Öncekiyle aynı */
        if (!menuElement) return;
        menuElement.querySelectorAll('a').forEach(link => {
            const linkClone = link.cloneNode(true); link.parentNode.replaceChild(linkClone, link);
            linkClone.addEventListener('click', function (event) {
                event.preventDefault(); if (isScriptTyping) return;
                if (errorIntervalId) clearInterval(errorIntervalId); errorIntervalId = null; randomErrorCount = 0;
                outputContainer.innerHTML = '';

                const key = this.dataset.contentKey; const newContent = siteContent[key];
                if (newContent) {
                    contentElement.innerHTML = '';
                    typeWriter(contentElement, newContent, TYPE_DELAY.NORMAL, () => {
                        postAnimationSpacing.innerHTML = '\n\n'; // Add spacing after content typing
                        placeCursor(inputAreaElement);
                        if (randomErrorCount < MAX_RANDOM_ERRORS) { errorIntervalId = setInterval(showRandomError, ERROR_INTERVAL); }
                    });
                } else { placeCursor(inputAreaElement); }
            });
        })
    }

    // Kullanıcı Girişini İşleme (Genişletilmiş Fake Komutlarla)
    function handleCommand(command) {
        if (!command) { placeCursor(inputAreaElement); return; }
        showInputEcho(command);

        const parts = command.split(' ').filter(p => p !== '');
        const mainCmd = parts[0]?.toLowerCase();
        const args = parts.slice(1);

        const menuItem = menuItems.find(item => item.name.toLowerCase() === command.toLowerCase());
        if (menuItem) {
            const menuLink = menuElement.querySelector(`a[data-content-key="${menuItem.contentKey}"]`);
            menuLink?.click(); return;
        }

        // *** GENİŞLETİLMİŞ KOMUT LİSTESİ ***
        switch (mainCmd) {
            // File System Navigation & Listing
            case 'ls': if (args.includes('-l') || args.includes('-la') || args.includes('-al')) { showOutput(`total 24`); showOutput(`drwxr-xr-x 4 user user 4096 Oct 27 11:00 .`); showOutput(`drwxr-xr-x 3 root root 4096 Oct 26 09:15 ..`); showOutput(`-rw-r--r-- 1 user user 1024 Oct 26 10:15 README.md`); showOutput(`-rw-r--r-- 1 user user  150 Oct 27 10:55 config.json`); showOutput(`drwxr-xr-x 2 user user 4096 Oct 26 10:10 images/`); showOutput(`-rw-r--r-- 1 user user 2500 Oct 27 11:00 index.html`); showOutput(`-rw-r--r-- 1 user user 4500 Oct 27 11:05 script.js`); showOutput(`-rw-r--r-- 1 user user 3200 Oct 27 11:02 style.css`); if (args.includes('-a') || args.includes('-la') || args.includes('-al')) { showOutput(`-rw------- 1 user user  512 Oct 26 09:20 .bash_history`); showOutput(`-rw-r--r-- 1 user user  220 Oct 26 09:15 .bash_logout`); showOutput(`-rw-r--r-- 1 user user 3771 Oct 26 09:15 .bashrc`); } } else { showOutput(`README.md    config.json  images/    index.html   script.js    style.css`); } break;
            case 'cd': const targetDir = args[0] || '~'; if (targetDir === '..' || targetDir === 'images' || targetDir === '~' || targetDir === '/home/user/web-terminal' || !targetDir) { showOutput(""); } else { showError(`bash: cd: ${targetDir}: No such file or directory`); } break;
            case 'pwd': showOutput("/home/user/web-terminal"); break;
            case 'mkdir': if (args.length > 0) { args.forEach(dir => showOutput(``)); } else { showError(`mkdir: missing operand`); } break;
            case 'rmdir': if (args.length > 0) { if (args[0] === 'images') { showError(`rmdir: failed to remove 'images': Directory not empty`);} else {showError(`rmdir: failed to remove '${args[0]}': No such file or directory`);}} else { showError(`rmdir: missing operand`); } break;

            // File Operations
            case 'rm': if (args.length > 0) { if (args.includes('-rf') && args.includes('/')) { showError('rm: refusing to remove "/" recursively'); } else if (args.includes('nonexistent.txt')) { showError(`rm: cannot remove 'nonexistent.txt': No such file or directory`); } else if (args.includes('images')) { showError(`rm: cannot remove 'images': Is a directory`); } else { showOutput(""); } } else { showError(`rm: missing operand`); } break;
            case 'cp': case 'mv': if (args.length >= 2) { if (args[0] === 'nonexistent.txt') { showError(`${mainCmd}: cannot stat '${args[0]}': No such file or directory`); } else { showOutput(""); } } else { showError(`${mainCmd}: missing file operand`); } break;
            case 'touch': if (args.length > 0) { showOutput(""); } else { showError(`touch: missing file operand`); } break;
            case 'file': if (args.length > 0) { if (args[0].endsWith('.js')) { showOutput(`${args[0]}: JavaScript source, ASCII text`); } else if (args[0].endsWith('.css')) { showOutput(`${args[0]}: CSS source, ASCII text`); } else if (args[0].endsWith('.html')) { showOutput(`${args[0]}: HTML document, ASCII text`); } else if (args[0] === 'images') { showOutput(`images: directory`); } else { showOutput(`${args[0]}: ASCII text`);} } else { showError(`file: missing file operand`); } break;
            case 'cat': const fileToCat = args[0]; if (fileToCat === 'README.md') { showOutput(`# İnteraktif Terminal\n\nAbdulkadir Güngör tarafından geliştirildi.`); } else if (fileToCat === 'config.json') { showOutput(`{\n  "theme": "dark",\n  "showErrors": true\n}`); } else if (fileToCat) { showError(`cat: ${fileToCat}: No such file or directory`); } else { showOutput(""); /* cat without args waits for input */ } break;
            case 'less': case 'nano': case 'vim': case 'emacs': if (args.length > 0) { showOutput(`(Simulating opening ${args[0]} in ${mainCmd} - Press Ctrl+X to exit simulation)`); } else { showOutput(`(${mainCmd} requires a filename - simulation)`); } break; // Simple simulation
            case 'head': case 'tail': const fileToRead = args[args.length - 1]; if (fileToRead === 'README.md') { if (mainCmd === 'head') showOutput("# İnteraktif Terminal\nAbdulkadir Güngör tarafından geliştirildi."); else showOutput("- Fake komut yanıtları"); } else if (args.length > 0 && fileToRead && !fileToRead.startsWith('-')) { showError(`${mainCmd}: cannot open '${fileToRead}' for reading: No such file or directory`); } else { showOutput(""); /* head/tail without file reads stdin */ } break;
            case 'echo': showOutput(args.join(' ')); break;
            case 'ln': if (args.length >= 2) { showOutput(""); } else { showError(`ln: missing file operand`); } break;

            // Searching
            case 'grep': const pattern = args[0]; const fileToGrep = args[1]; if (pattern && fileToGrep === 'README.md') { if (pattern.toLowerCase().includes('abdulkadir')) showOutput("Abdulkadir Güngör tarafından geliştirildi."); else showOutput(""); } else if (!pattern) { showError("grep: (standard input): binary file matches"); } else { showError(`grep: ${fileToGrep || '<stdin>'}: No such file or directory`); } break;
            case 'find': showOutput(".\n./README.md\n./config.json\n./images\n./index.html\n./script.js\n./style.css"); break; // Fake find .
            case 'locate': case 'updatedb': showOutput(""); break; // Usually silent or needs sudo

            // System Information
            case 'uname': let unameOutput = "Linux"; if (args.includes('-a')) { unameOutput = "Linux fake-term 6.1.0-generic #FakeBuild SMP x86_64 GNU/Linux"; } else if (args.includes('-r')) { unameOutput = "6.1.0-generic"; } else if (args.includes('-m')) { unameOutput = "x86_64"; } showOutput(unameOutput); break;
            case 'hostname': showOutput("fake-terminal"); break;
            case 'uptime': showOutput(" 14:30:00 up 2 days,  3:15,  1 user,  load average: 0.15, 0.10, 0.05"); break;
            case 'whoami': showOutput("user"); break;
            case 'w': showOutput(" 14:30:00 up 2 days,  3:15,  1 user,  load average: 0.15, 0.10, 0.05"); showOutput("USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT"); showOutput("user     pts/0    :0               11:15    3:15m  0.20s  0.05s bash"); break;
            case 'date': showOutput(new Date().toLocaleString('tr-TR', { dateStyle: 'full', timeStyle: 'medium'})); break;

            // Process Management
            case 'ps': showOutput("  PID TTY          TIME CMD"); showOutput(" 1234 pts/0    00:00:00 bash"); showOutput(" 5678 pts/0    00:00:01 web-terminal"); showOutput(" 9101 pts/0    00:00:00 ps"); break;
            case 'top': case 'htop': showOutput("(Simulating process monitor - Press 'q' to quit simulation)"); break;
            case 'kill': case 'killall': if (args.length > 0) { showOutput(""); } else { showError(`${mainCmd}: usage: ${mainCmd} [-s sigspec | -n signum | -sigspec] pid | jobspec ... or ${mainCmd} -l [sigspec]`); } break;
            case 'nice': case 'renice': showOutput(""); break; // Assume success
            case 'jobs': case 'bg': case 'fg': showOutput(""); break; // No background jobs in this simulation

            // System Control
            case 'shutdown': case 'reboot': showOutput(`Shutdown/Reboot initiated by user (simulation).`); break; // Don't actually do it!

            // Disk Usage
            case 'df': showOutput("Filesystem     1K-blocks     Used Available Use% Mounted on"); showOutput("/dev/vda1      51475068 10456884  41018184  21% /"); showOutput("tmpfs           1016992        0   1016992   0% /dev/shm"); break;
            case 'du': showOutput("4\t./images\n28\t."); break; // du -sh might be better: showOutput("28K\t.");
            case 'free': showOutput("              total        used        free      shared  buff/cache   available"); showOutput("Mem:          2033984      516784      987200       10164      530000     1357200"); showOutput("Swap:               0           0           0"); break;

            // User and Group Management
            case 'useradd': case 'userdel': case 'groupadd': case 'groupdel': case 'usermod': case 'passwd': showOutput(""); break; // Assume success, usually needs sudo

            // Permissions
            case 'chown': case 'chgrp': case 'chmod': if (args.length >= 2) { showOutput(""); } else { showError(`${mainCmd}: missing operand`); } break;

            // Networking
            case 'ifconfig': case 'ip': if(mainCmd === 'ip' && (args[0] === 'addr' || args[0] === 'a')) { /* ip addr handling */ } showOutput("eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500\n        inet 10.0.2.15  netmask 255.255.255.0  broadcast 10.0.2.255\n        ether 08:00:27:ab:cd:ef  txqueuelen 1000  (Ethernet)\nlo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536\n        inet 127.0.0.1  netmask 255.0.0.0"); break;
            case 'ping': if (args.length > 0) { showOutput(`PING ${args[0]} (1.2.3.4) 56(84) bytes of data.\n64 bytes from 1.2.3.4: icmp_seq=1 ttl=55 time=10.5 ms\n64 bytes from 1.2.3.4: icmp_seq=2 ttl=55 time=11.1 ms\n--- ${args[0]} ping statistics ---\n2 packets transmitted, 2 received, 0% packet loss, time 1002ms`); } else { showError("ping: usage error: Destination address required"); } break;
            case 'netstat': case 'ss': showOutput("Active Internet connections (w/o servers)\nProto Recv-Q Send-Q Local Address           Foreign Address         State\ntcp        0      0 10.0.2.15:ssh           some-client:54321       ESTABLISHED"); break;
            case 'ssh': if(args.length > 0) showOutput(`Connecting to ${args[0]}...\nWelcome to Fake Server!`); else showError("usage: ssh [...] [user@]hostname [command]"); break;
            case 'scp': if(args.length >= 2) showOutput(`fake_file.txt                             100%   12KB  11.8KB/s   00:00`); else showError("usage: scp [...] [[user@]host1:]file1 ... [[user@]host2:]file2"); break;
            case 'wget': if (args.length > 0) { showOutput(`--FAKE-- Resolving ${args[0]}... OK.\nConnecting... connected.\nHTTP request sent... 200 OK\nLength: 12345 (12K) [text/html]\nSaving... Done.`); } else { showError("wget: missing URL"); } break;
            case 'curl': if (args.length > 0) { showOutput("<html><body><h1>Fake Page</h1></body></html>"); } else { showError("curl: try 'curl --help' for more information"); } break;
            case 'route': case 'arp': showOutput("Kernel IP routing table\nDestination     Gateway         Genmask         Flags Metric Ref    Use Iface\ndefault         fake-gateway    0.0.0.0         UG    100    0        0 eth0\n10.0.2.0        0.0.0.0         255.255.255.0   U     100    0        0 eth0"); break;
            case 'dig': case 'nslookup': if (args.length > 0) { showOutput(`Server:\t\t8.8.8.8\nAddress:\t8.8.8.8#53\n\nNon-authoritative answer:\nName:\t${args[0]}\nAddress: 1.2.3.4`); } else { showOutput("> "); /* Waits for input */ } break;
            case 'traceroute': case 'mtr': if (args.length > 0) { showOutput(`traceroute to ${args[0]} (1.2.3.4), 30 hops max\n 1  fake-gw (10.0.2.1)  0.5 ms\n 2  isp.router (10.10.0.1)  10 ms\n 3  * * *\n 4  target (1.2.3.4)  20 ms`); } else { showError("traceroute: missing host"); } break;
            case 'iwconfig': case 'iwlist': case 'rfkill': showOutput("wlan0     IEEE 802.11  ESSID:\"FakeWiFi\"  \n          Mode:Managed  Frequency:2.412 GHz  Access Point: 00:11:22:33:44:55   \n          Bit Rate=72.2 Mb/s   Tx-Power=20 dBm   \n          Link Quality=70/70  Signal level=-40 dBm  \n          Rx invalid nwid:0  Rx invalid crypt:0  Rx invalid frag:0\n          Tx excessive retries:0  Invalid misc:0   Missed beacon:0"); break;

            // Archiving & Compression
            case 'tar': case 'gzip': case 'gunzip': case 'bzip2': case 'bunzip2': case 'zip': case 'unzip': if (args.length > 0) { showOutput(`(Simulating ${mainCmd} on ${args[args.length - 1]}...) Done.`); } else { showError(`${mainCmd}: missing operand`); } break;

            // Text Processing Utilities
            case 'diff': case 'patch': case 'cmp': if(args.length === 2) { showOutput(`Files ${args[0]} and ${args[1]} differ`); } else { showError(`${mainCmd}: missing operand`); } break;
            case 'sort': case 'uniq': case 'wc': case 'tr': case 'sed': case 'awk': case 'cut': case 'paste': case 'join': case 'xargs': case 'tee': case 'nohup': showOutput("(Simulating text processing...) Output depends on input."); break; // Generic

            // Package Management
            case 'apt-get': case 'apt': case 'yum': case 'dnf': case 'pacman': if (args.length > 0) showOutput(`(${mainCmd}) Simulating ${args[0]}... Done.`); else showError(`${mainCmd}: requires an argument`); break;

            // System Administration & Monitoring
            case 'sudo': if (args.length > 0) { showOutput(`[sudo] password for user: `); setTimeout(() => { handleCommand(args.join(' ')); }, 600); return; } else { showError("usage: sudo <command>"); } break;
            case 'su': showOutput("Password: "); setTimeout(() => { showError("su: Authentication failure"); placeCursor(inputAreaElement); }, 800); return; break; // Fake failure
            case 'man': const manPage = args[0]; if (manPage) { showOutput(`MAN(${args[0].length % 8 + 1})                  Manual                  MAN(${args[0].length % 8 + 1})\n\nNAME\n       ${manPage} - (Fake description for ${manPage})\n\nSYNOPSIS\n       ${manPage} [OPTIONS]...\n\n(Press 'q' to quit simulation)`); } else { showError("What manual page do you want?"); } break;
            case 'history': showOutput("    1  ls -l\n    2  cd ..\n    3  cat README.md\n    4  clear\n    5  history"); break;
            case 'clear': titleElement.innerHTML = "> "; contentElement.innerHTML = ""; outputContainer.innerHTML = ""; break; // Already handled
            case 'alias': showOutput("alias ll='ls -alF'\nalias c='clear'"); break;
            case 'exit': case 'logout': showOutput("logout"); /* Terminal would close here */ break;
            case 'screen': case 'tmux': showOutput("[detached (from session fake-session)]"); break;
            case 'lsof': showOutput("COMMAND    PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME\nbash      1234 user  cwd    DIR    8,1     4096 /home/user/web-terminal\nweb-term  5678 user  txt    REG    8,1    4500 /home/user/web-terminal/script.js"); break;
            case 'iptables': showOutput("-P INPUT ACCEPT\n-P FORWARD ACCEPT\n-P OUTPUT ACCEPT"); break;
            case 'journalctl': case 'systemctl': showOutput("-- Logs begin Thu 2023-10-26... --\nOct 27 14:30:00 fake-terminal systemd[1]: Started Fake Service."); break;
            case 'crontab': showOutput("no crontab for user"); break;
            case 'ufw': showOutput("Status: active"); break;
            case 'docker': case 'docker-compose': showOutput("Docker version 20.10.17, build 100c701\n(Docker simulation)"); break;

            // Other Utilities
            case 'cal': const now = new Date(); const month = now.toLocaleString('tr-TR', { month: 'long' }); const year = now.getFullYear(); showOutput(`      ${month} ${year}\nPz Pt Sa Ça Pe Cu Ct\n                   1  2\n 3  4  5  6  7  8  9\n10 11 12 13 14 15 16\n17 18 19 20 21 22 23\n24 25 26 27 28 29 30`); break;
            case 'dd': showOutput("1+0 records in\n1+0 records out\n512 bytes copied, 0.0001 s, 5.1 MB/s"); break;
            case 'whereis': case 'whatis': if(args.length > 0) showOutput(`${args[0]}: /usr/bin/${args[0]}`); else showError(`${mainCmd}: requires an argument`); break;

            // Default: Command not found
            default:
                showError(`bash: ${command}: command not found`);
                break;
        }

        placeCursor(inputAreaElement); // Ensure cursor returns to input
    }

    // --- Olay Dinleyicileri ---
    inputAreaElement.addEventListener('keydown', (event) => { /* Öncekiyle aynı */
        if (event.key === 'Enter') { event.preventDefault(); const command = inputAreaElement.textContent.trim(); inputAreaElement.textContent = ''; handleCommand(command); }
        inputAreaElement.classList.remove(CURSOR_CLASS);
    });
    inputAreaElement.addEventListener('input', () => { inputAreaElement.classList.remove(CURSOR_CLASS); });
    inputAreaElement.addEventListener('focus', () => { inputAreaElement.classList.remove(CURSOR_CLASS); });
    inputAreaElement.addEventListener('blur', () => { if (inputAreaElement.textContent.trim() === '' && !isScriptTyping) { placeCursor(inputAreaElement); } });

    // --- Başlangıç Sırası ---
    function startSequence() {
        isScriptTyping = true;
        typeWriter(titleElement, siteContent.title, TYPE_DELAY.SLOW, () => {
            typeWriter(contentElement, siteContent.home, TYPE_DELAY.NORMAL, () => {
                // Add spacing after initial content typing
                postAnimationSpacing.innerHTML = '\n\n'; // İki satır boşluk ekle
                buildMenuLinks(); // Menüyü oluştur
                isScriptTyping = false;
                placeCursor(inputAreaElement); // Cursor'ı input'a taşı
                // Hata mesajlarını başlat (limit kontrolü ile)
                if (randomErrorCount < MAX_RANDOM_ERRORS) {
                     if (errorIntervalId) clearInterval(errorIntervalId);
                     errorIntervalId = setInterval(showRandomError, ERROR_INTERVAL);
                }
            });
        });
    }

    // --- Başlatma ---
    startSequence();

});