// Typing Animation
const typedTextSpan = document.getElementById("typed-text");
const textArray = ["Vijey Sachin A"];
const typingDelay = 100;
const erasingDelay = 90;
const newTextDelay = 500;
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    }
}

// Start typing when page loads
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(type, newTextDelay);
});

// Particle Canvas Animation
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, ${Math.random() * 0.5 + 0.5})`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0) {
            this.speedX *= -1;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.speedY *= -1;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Create particles
const particlesArray = [];
const numberOfParticles = 100;

function init() {
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();

        // Connect particles with lines
        for (let j = i + 1; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.strokeStyle = `rgba(0, 212, 255, ${1 - distance / 100})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animate);
}

init();
animate();

// Resize canvas on window resize
window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Scroll Animation Observer (AOS-like functionality)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
        }
    });
}, observerOptions);

// Observe all elements with data-aos attribute
document.addEventListener('DOMContentLoaded', function () {
    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(el => observer.observe(el));
});

// Counter Animation for Statistics
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
}

// Counter Animation for Statistics (Mobile + Desktop safe)
const statsObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number');

                counters.forEach(counter => {
                    if (!counter.classList.contains('counted')) {
                        counter.classList.add('counted');
                        animateCounter(counter);
                    }
                });

                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
    }
);

document.addEventListener("DOMContentLoaded", () => {
    const statsGrid = document.querySelector(".stats-grid");
    if (statsGrid) {
        statsObserver.observe(statsGrid);
    }
});



// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Parallax effect for about section
window.addEventListener('scroll', function () {
    const scrolled = window.pageYOffset;
    const parallaxBg = document.querySelector('.parallax-bg');

    if (parallaxBg) {
        parallaxBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add hover effect to skill cards
document.addEventListener('DOMContentLoaded', function () {
    const skillCards = document.querySelectorAll('.skill-card');

    skillCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.05)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });
    });
});

// 3D tilt effect for contact cards
document.addEventListener('DOMContentLoaded', function () {
    const contactCards = document.querySelectorAll('.contact-card');

    contactCards.forEach(card => {
        card.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px)`;
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
});

// Add fade-in class to elements as they appear
const fadeInObserver = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', function () {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        fadeInObserver.observe(el);
    });
});

// Mouse trail effect
let mouseX = 0;
let mouseY = 0;
let trailX = 0;
let trailY = 0;

document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateTrail() {
    trailX += (mouseX - trailX) * 0.1;
    trailY += (mouseY - trailY) * 0.1;

    // Create trail particle
    if (Math.random() > 0.9) {
        createTrailParticle(trailX, trailY);
    }

    requestAnimationFrame(animateTrail);
}

function createTrailParticle(x, y) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '5px';
    particle.style.height = '5px';
    particle.style.borderRadius = '50%';
    particle.style.background = 'rgba(0, 212, 255, 0.5)';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '1';
    particle.style.transition = 'all 1s ease-out';

    document.body.appendChild(particle);

    setTimeout(() => {
        particle.style.opacity = '0';
        particle.style.transform = 'scale(0)';
    }, 10);

    setTimeout(() => {
        document.body.removeChild(particle);
    }, 1000);
}

animateTrail();

// Loading animation
window.addEventListener('load', function () {
    document.body.classList.add('loaded');
});

// Add ripple effect to buttons
document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Function for the Interactive Debugger
function resolveBug() {
    const codeArea = document.getElementById("buggy-code");
    const status = document.getElementById("fix-status");

    // Applying the fix mentioned in your professional experience [cite: 8, 9]
    codeArea.innerHTML = `-- FIX APPLIED [cite: 12]
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
SELECT ProductID, Qty 
FROM Inventory WITH (NOLOCK)
WHERE StoreID = @@ID;`;

    codeArea.style.color = "#b5cea8"; // SQL Comment green
    status.innerHTML = "Query executed successfully. (1 row affected)";

    // Add a "Success" toast for additional feedback
    if (typeof showToast === "function") {
        showToast("Database Integrity Restored.");
    }
}

/*-----------------------------------------------------------------*/

const logContainer = document.getElementById('live-logs');
const messages = [
    "Cache hit for product_data",
    "SQL Query optimized (0.02ms)",
    "Memory usage stable at 124MB",
    "API Request: GET /api/v1/inventory",
    "Security handshake successful",
    "Optimizing INP performance..."
];

setInterval(() => {
    const time = new Date().toLocaleTimeString();
    const msg = messages[Math.floor(Math.random() * messages.length)];
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `<span class="time">${time}</span> <span class="status">[OK]</span> ${msg}`;
    logContainer.prepend(entry);
    if (logContainer.childNodes.length > 5) logContainer.lastChild.remove();
}, 3000);



function filterTech(category) {
    const cards = document.querySelectorAll('.skill-card');
    cards.forEach(card => {
        const icon = card.querySelector('.icon').innerText;

        // "🤖" (AI) and "🚀" (Full Stack) are universal - ALWAYS SHOW
        if (icon === "🤖" || icon === "🚀") {
            card.style.display = 'block';
            return;
        }

        const isBackend = ["🎯", "⚡", "🔌", "💾"].includes(icon);
        const isFrontend = ["🛒", "🎬"].includes(icon);

        if (category === 'backend') {
            card.style.display = isBackend ? 'block' : 'none';
        } else if (category === 'frontend') {
            card.style.display = isFrontend ? 'block' : 'none';
        }
    });
}

// Add this to your existing mouse trail logic
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.skill-card, .terminal-window');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;

        const deltaX = e.clientX - cardCenterX;
        const deltaY = e.clientY - cardCenterY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance < 300) {
            const angle = Math.atan2(deltaY, deltaX);
            const force = (300 - distance) / 20;
            card.style.transform = `translate3d(${Math.cos(angle) * force}px, ${Math.sin(angle) * force}px, 0)`;
        } else {
            card.style.transform = `translate3d(0, 0, 0)`;
        }
    });
});


function triggerFlowDemo(event) {
    event.stopPropagation();
    const toast = document.getElementById("stackToast");
    const steps = ["step-ui", "step-dotnet", "step-sql", "step-final"];
    const btn = event.target;
    const statusBar = document.getElementById("fix-status");

    // UI Code Logs to show in your Debugger
    const technicalLogs = [
        ">> $.ajax({ type: 'POST', url: '/UpdateInventory' });",
        ">> Executing: public IHttpActionResult SaveData(Model m)",
        ">> SQL: UPDATE Inventory SET Stock = @qty WHERE ID = @id",
        ">> HTTP 200: Response.Json({ success: true });"
    ];

    // Reset and Show
    btn.disabled = true;
    steps.forEach(id => document.getElementById(id).classList.remove('done'));
    toast.classList.add("active");

    let i = 0;
    const interval = setInterval(() => {
        if (i < steps.length) {
            document.getElementById(steps[i]).classList.add('done');

            // This links it to your SSMS / Debugger window at the bottom!
            if (statusBar) {
                statusBar.innerText = technicalLogs[i];
                statusBar.style.background = "#28a745"; // Success Green
            }

            i++;
        } else {
            clearInterval(interval);

            setTimeout(() => {
                toast.classList.remove("active");
                btn.disabled = false;
                if (statusBar) {
                    statusBar.innerText = "Full Stack Lifecycle Verified.";
                    statusBar.style.background = "#007acc"; // Back to Blue
                }
            }, 3500);
        }
    }, 1200); // Slightly slower for readability
}

// Console Easter Egg
console.log('%c👋 Hello Developer!', 'font-size: 20px; font-weight: bold; color: #00d4ff;');
console.log('%cThis portfolio was crafted with ❤️ using ASP.NET', 'font-size: 14px; color: #7b2cbf;');
console.log('%cLooking for a talented .NET developer? Let\'s talk!', 'font-size: 12px; color: #ff006e;');
console.log('%c📧 vijeysachin1605@gmail.com', 'font-size: 12px; color: #00d4ff;');
