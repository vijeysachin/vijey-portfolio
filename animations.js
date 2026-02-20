
/*V2*/
// Typing Animation
const typedTextSpan = document.getElementById("typed-text");
const textArray = ["Vijey Sachin A"];
const typingDelay = 100;
const newTextDelay = 500;
let charIndex = 0;

function type() {
    if (charIndex < textArray[0].length) {
        typedTextSpan.textContent += textArray[0].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    }
}

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
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

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

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// AOS-like Scroll Observer
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

document.addEventListener('DOMContentLoaded', function () {
    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(el => observer.observe(el));
});

// Counter Animation
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
    { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
);

document.addEventListener("DOMContentLoaded", () => {
    const statsGrid = document.querySelector(".stats-grid");
    if (statsGrid) statsObserver.observe(statsGrid);
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Parallax
window.addEventListener('scroll', function () {
    const scrolled = window.pageYOffset;
    const parallaxBg = document.querySelector('.parallax-bg');
    if (parallaxBg) {
        parallaxBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Skill card hover
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

// 3D tilt for contact cards
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

// Fade-in observer
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

// Mouse trail
let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateTrail() {
    trailX += (mouseX - trailX) * 0.1;
    trailY += (mouseY - trailY) * 0.1;
    if (Math.random() > 0.9) createTrailParticle(trailX, trailY);
    requestAnimationFrame(animateTrail);
}

function createTrailParticle(x, y) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed; left: ${x}px; top: ${y}px;
        width: 5px; height: 5px; border-radius: 50%;
        background: rgba(0, 212, 255, 0.5); pointer-events: none;
        z-index: 1; transition: all 1s ease-out;
    `;
    document.body.appendChild(particle);
    setTimeout(() => { particle.style.opacity = '0'; particle.style.transform = 'scale(0)'; }, 10);
    setTimeout(() => { document.body.removeChild(particle); }, 1000);
}

animateTrail();

// Ripple for buttons
document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            ripple.style.cssText = `width: ${size}px; height: ${size}px; left: ${x}px; top: ${y}px;`;
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
});

// SQL Debugger — shows data analysis query fix
function resolveBug() {
    const codeArea = document.getElementById("buggy-code");
    const status = document.getElementById("fix-status");

    codeArea.innerHTML = `-- ANALYSIS QUERY FIXED ✔
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

;WITH StockCTE AS (
    SELECT ProductID, SUM(Qty) AS TotalStock
    FROM Inventory WITH (NOLOCK)
    WHERE StoreID = @@SPID
    GROUP BY ProductID
)
SELECT * FROM StockCTE WHERE TotalStock < 10
ORDER BY TotalStock ASC;`;

    codeArea.style.color = "#b5cea8";
    status.innerHTML = "Query executed successfully. Inventory mismatch identified. (12 rows affected)";
    status.style.background = "#28a745";
    setTimeout(() => { status.style.background = "#007acc"; }, 4000);
}

// Live Logs
const logContainer = document.getElementById('live-logs');
const messages = [
    "SQL View refreshed: vw_ProductInventory",
    "Stored Proc executed: usp_GetOrderSummary",
    "CTE resolved: 0.04ms execution time",
    "Temp Table #ProductData populated",
    "Excel Report: 1,240 rows validated",
    "API Request: GET /api/v1/inventory",
    "Data Sync: Products table updated",
    "Query optimized — execution plan cached"
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

// Tech Toggle Filter
function filterTech(category) {
    const allButtons = document.querySelectorAll('.tech-toggle-container .btn');
    allButtons.forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');

    const dataCards = document.querySelectorAll('.data-card');
    const backendCards = document.querySelectorAll('.backend-card');
    const frontendCards = document.querySelectorAll('.frontend-card');
    const bridgeCard = document.querySelector('.full-stack-card');
    const aiCard = document.querySelector('.ai-expert-front')?.closest('.skill-card');

    // Always show bridge card and AI card
    if (bridgeCard) bridgeCard.style.display = 'block';
    if (aiCard) aiCard.style.display = 'block';

    if (category === 'data') {
        dataCards.forEach(c => c.style.display = 'block');
        backendCards.forEach(c => c.style.display = 'none');
        frontendCards.forEach(c => c.style.display = 'none');
    } else if (category === 'backend') {
        dataCards.forEach(c => c.style.display = 'none');
        backendCards.forEach(c => c.style.display = 'block');
        frontendCards.forEach(c => c.style.display = 'none');
    } else if (category === 'frontend') {
        dataCards.forEach(c => c.style.display = 'none');
        backendCards.forEach(c => c.style.display = 'none');
        frontendCards.forEach(c => c.style.display = 'block');
    }
}

// Mouse proximity magnetic effect
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
            card.style.transform = 'translate3d(0, 0, 0)';
        }
    });
});

// Data Pipeline Toast Demo
function triggerFlowDemo(event) {
    event.stopPropagation();
    const toast = document.getElementById("stackToast");
    const steps = ["step-ui", "step-dotnet", "step-sql", "step-final"];
    const btn = event.target;
    const statusBar = document.getElementById("fix-status");

    const technicalLogs = [
        ">> Source: SELECT * FROM Cbazaar_DB.dbo.Products",
        ">> EXEC usp_GetInventorySummary @StoreID = 1",
        ">> CTE + Temp Table aggregation complete",
        ">> Report Ready: 1,240 rows — 0 errors"
    ];

    btn.disabled = true;
    steps.forEach(id => document.getElementById(id).classList.remove('done'));
    toast.classList.add("active");

    let i = 0;
    const interval = setInterval(() => {
        if (i < steps.length) {
            document.getElementById(steps[i]).classList.add('done');
            if (statusBar) {
                statusBar.innerText = technicalLogs[i];
                statusBar.style.background = "#28a745";
            }
            i++;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                toast.classList.remove("active");
                btn.disabled = false;
                if (statusBar) {
                    statusBar.innerText = "Data Pipeline Complete. Insight Delivered.";
                    statusBar.style.background = "#007acc";
                }
            }, 3500);
        }
    }, 1200);
}

window.addEventListener('load', function () {
    document.body.classList.add('loaded');
});

// Console Easter Egg
console.log('%c👋 Hello Recruiter!', 'font-size: 20px; font-weight: bold; color: #00d4ff;');
console.log('%cVijey Sachin — Full Stack .NET Developer transitioning to Data Analyst', 'font-size: 14px; color: #7b2cbf;');
console.log('%c🗄️ 2 years of real production SQL: Stored Procs, CTEs, Views, Temp Tables', 'font-size: 12px; color: #11998e;');
console.log('%c📊 Looking for Data Analyst opportunities', 'font-size: 12px; color: #ff006e;');
console.log('%c📧 vijeysachin1605@gmail.com', 'font-size: 12px; color: #00d4ff;');


/* ============================================================
   EXCEL HIRE ME — Full Analysis Engine
   ============================================================ */

const skillData = [
    { row: 2, label: "SQL (Prod Experience)", score: 95, avg: 60 },
    { row: 3, label: "CTE / Stored Proc Knowledge", score: 92, avg: 50 },
    { row: 4, label: "Excel & VBA Skills", score: 88, avg: 55 },
    { row: 5, label: "E-commerce Data Exposure", score: 100, avg: 40 },
    { row: 6, label: "Problem Solving (Dev BG)", score: 90, avg: 58 },
    { row: 7, label: "Dedication & Hardwork 😤", score: 99, avg: 65 }
];

const funnyHRMessages = [
    {
        msg: "✅ VALIDATION PASSED!",
        sub: "Sachin's SQL score is 95. Industry average is 60.\nFormula result: =IF(95>60, \"HIRE NOW\", \"Big Mistake\")\nResult: HIRE NOW 🎉\n\nYour spreadsheet has spoken. Resistance is futile."
    },
    {
        msg: "📊 The Data Doesn't Lie!",
        sub: "After running 6 validation checks, all rows returned ✅ GREEN.\n\nConclusion: Hiring Vijey Sachin = +ROI\nNot hiring = #REF! Error in your team.\n\nPlease proceed to send offer letter. 😄"
    },
    {
        msg: "🚨 HR Alert: Rare Candidate Detected!",
        sub: "Developer + SQL + Data = Unicorn 🦄\n\nMost analysts can't read a Stored Procedure.\nVijey wrote them in production.\n\nThis is not a coincidence. This is an opportunity."
    },
    {
        msg: "🧮 Excel Has Decided!",
        sub: "=SUMIF(Skills, \"≥88\", Count) → 6 out of 6 ✅\n\nAll skills above threshold.\nVBA Macros validated. CTEs confirmed. E-commerce data: real.\n\nYour move, HR. 😏"
    }
];

let analysisRunning = false;

function runExcelAnalysis() {
    if (analysisRunning) return;
    analysisRunning = true;

    const btn = document.querySelector('.btn-run-analysis');
    btn.textContent = '⏳ Running Analysis...';
    btn.disabled = true;

    // Update formula bar
    document.getElementById('formulaText').textContent = '=VLOOKUP("Vijey_Sachin", CandidateDB, HireScore, TRUE)';
    document.getElementById('excelStatus').textContent = 'Calculating...';
    document.getElementById('verdictCell').textContent = '⏳ Running =IF analysis...';

    // Build chart bars
    buildChartBars();

    // Animate each row one by one
    let delay = 0;
    skillData.forEach((skill, index) => {
        setTimeout(() => {
            animateRow(skill, index);
        }, delay);
        delay += 700;
    });

    // After all rows done → show verdict
    setTimeout(() => {
        showVerdict();
        updateStatusBar();
        btn.textContent = '✅ Analysis Complete! Run Again?';
        btn.disabled = false;
        analysisRunning = false;
    }, delay + 800);
}

function animateRow(skill, index) {
    const scoreCell = document.querySelector(`.data-row[data-row="${skill.row}"] .score-cell`);
    const validationCell = document.getElementById(`v${skill.row}`);
    const row = document.querySelector(`.data-row[data-row="${skill.row}"]`);

    // Animate score counting up
    let current = 0;
    const target = skill.score;
    const step = target / 20;
    const counter = setInterval(() => {
        current = Math.min(current + step, target);
        if (scoreCell) scoreCell.textContent = Math.round(current) + '%';
        if (current >= target) clearInterval(counter);
    }, 40);

    // Row flash
    if (row) {
        row.style.background = '#c6efce';
        setTimeout(() => { row.style.background = ''; }, 500);
    }

    // Show validation icon
    setTimeout(() => {
        if (validationCell) {
            validationCell.innerHTML = skill.score > skill.avg
                ? '<span style="color:#217346;font-size:1.2rem;">✅ PASS</span>'
                : '<span style="color:#c00;font-size:1.2rem;">❌ FAIL</span>';
        }
        // Animate corresponding bar
        animateChartBar(index, skill.score, skill.avg);
        // Show Excel-style tooltip
        showValidationTooltip(skill);
    }, 850);
}

function showValidationTooltip(skill) {
    const tip = document.createElement('div');
    tip.className = 'validation-tooltip';
    tip.textContent = `✔ Data Validation: ${skill.label} — Score ${skill.score} exceeds threshold (${skill.avg})`;
    tip.style.left = (Math.random() * 40 + 30) + '%';
    tip.style.top = (Math.random() * 30 + 30) + '%';
    document.body.appendChild(tip);
    setTimeout(() => {
        tip.style.opacity = '0';
        tip.style.transition = 'opacity 0.5s';
        setTimeout(() => tip.remove(), 500);
    }, 1500);
}

function buildChartBars() {
    const container = document.getElementById('chartBars');
    container.innerHTML = '';
    skillData.forEach((skill, i) => {
        const row = document.createElement('div');
        row.className = 'chart-bar-row';
        row.innerHTML = `
            <div class="chart-bar-label">${skill.label}</div>
            <div class="chart-bar-track">
                <div class="chart-bar-fill" id="bar-me-${i}" style="width:0%"></div>
            </div>
            <div class="chart-bar-val" id="bar-val-${i}">0%</div>
        `;
        container.appendChild(row);
    });
}

function animateChartBar(index, score, avg) {
    const barFill = document.getElementById(`bar-me-${index}`);
    const barVal = document.getElementById(`bar-val-${index}`);
    if (barFill) {
        setTimeout(() => {
            barFill.style.width = score + '%';
            if (barVal) barVal.textContent = score + '%';
        }, 100);
    }
}

function showVerdict() {
    const verdictCell = document.getElementById('verdictCell');
    verdictCell.textContent = '🎉 RESULT: HIRE VIJEY SACHIN = TRUE ✅';
    verdictCell.style.color = '#217346';
    verdictCell.style.fontSize = '13px';
    verdictCell.style.fontWeight = 'bold';

    document.getElementById('formulaText').textContent = '=IF(HireVijey=TRUE, "Send Offer Letter NOW!", "Ctrl+Z your decision")';
    document.getElementById('excelStatus').textContent = 'Analysis Complete — 6 validations passed';

    // Confetti!
    shootConfetti();

    // Show funny HR popup after 1 second
    setTimeout(() => {
        const msg = funnyHRMessages[Math.floor(Math.random() * funnyHRMessages.length)];
        document.getElementById('hrMessage').textContent = msg.msg;
        document.getElementById('hrSub').textContent = msg.sub;
        document.getElementById('hrPopup').classList.add('show');
    }, 1200);
}

function updateStatusBar() {
    const scores = skillData.map(s => s.score);
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const sum = scores.reduce((a, b) => a + b, 0);
    document.getElementById('avgDisplay').textContent = `Average: ${avg}%`;
    document.getElementById('sumDisplay').textContent = `Sum: ${sum}`;
}

function closeHrPopup() {
    document.getElementById('hrPopup').classList.remove('show');
}

function shootConfetti() {
    const colors = ['#217346', '#38ef7d', '#00d4ff', '#ff006e', '#ffd200', '#7b2cbf'];
    for (let i = 0; i < 80; i++) {
        setTimeout(() => {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + 'vw';
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.width = (Math.random() * 10 + 6) + 'px';
            piece.style.height = (Math.random() * 10 + 6) + 'px';
            piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
            piece.style.animationDelay = Math.random() * 0.5 + 's';
            document.body.appendChild(piece);
            setTimeout(() => piece.remove(), 4000);
        }, i * 30);
    }
}

// Ribbon tab click (cosmetic)
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.ribbon-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            document.querySelectorAll('.ribbon-tab').forEach(t => t.classList.remove('active-tab'));
            this.classList.add('active-tab');
        });
    });
});



/* ============================================================
   UPGRADED FOOTER — Scroll Message + Fun Notes
   ============================================================ */

const hrScrollMessages = [
    "Hey HR... you scrolled ALL the way down here. 😄\nThat means you're interested! So let's skip the suspense —\n<highlight>just send the offer letter already!</highlight> My inbox is ready. 📩",
    "Congratulations! 🎉 You've reached the bottom of my portfolio.\nYou've seen the SQL. You've seen the Excel sheet.\nThe data has spoken — <highlight>Vijey = Hired.</highlight> 😄",
    "Still here? Amazing dedication, HR! 😄\nYou clearly have great taste. People with great taste\nalways make great decisions. Like <highlight>hiring me.</highlight> Coincidence? I think not. 🔥",
    "Fun fact: The probability of you scrolling this far\nand NOT hiring me is approximately <highlight>0.00001%</highlight>.\nI'm a Data Analyst. I ran the numbers. 📊"
];

const footerFunNotes = [
    "Fun fact: I once debugged a SQL JOIN at 11pm and it worked. That's dedication. 😤",
    "Powered by caffeine, CTEs, and the dream of becoming a Data Analyst ☕📊",
    "SELECT * FROM candidates WHERE skills = 'SQL' AND attitude = 'great' — Only 1 row returned. That's me. 😄",
    "Warning: Hiring me may result in cleaner data, better reports, and excessive SQL comments 😁",
    "Error 404: Average Candidate Not Found. Loading Vijey Sachin instead... ✅"
];

// Show a random fun note in footer
document.addEventListener('DOMContentLoaded', function () {
    const noteEl = document.getElementById('footerFunNote');
    if (noteEl) {
        noteEl.textContent = footerFunNotes[Math.floor(Math.random() * footerFunNotes.length)];
    }
});

// Scroll-triggered HR message — fires when footer comes into view
let hrMsgShown = false;

const footerObserver = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting && !hrMsgShown) {
            hrMsgShown = true;
            showHrScrollMessage();
        }
    });
}, { threshold: 0.3 });

document.addEventListener('DOMContentLoaded', function () {
    const footer = document.getElementById('mainFooter');
    if (footer) footerObserver.observe(footer);
});

function showHrScrollMessage() {
    const msgEl = document.getElementById('hrScrollMsg');
    const textEl = document.getElementById('hrScrollText');
    if (!msgEl || !textEl) return;

    const chosen = hrScrollMessages[Math.floor(Math.random() * hrScrollMessages.length)];

    // Show bubble
    msgEl.classList.add('visible');

    // Typewriter effect for the message
    const plainText = chosen.replace(/<highlight>/g, '').replace(/<\/highlight>/g, '');
    let i = 0;
    textEl.innerHTML = '';

    function typeChar() {
        if (i < plainText.length) {
            textEl.textContent += plainText[i];
            i++;
            setTimeout(typeChar, 22);
        } else {
            // After typing done — apply highlight formatting
            setTimeout(() => {
                const formatted = chosen.replace(/<highlight>(.*?)<\/highlight>/g,
                    '<span class="highlight-word">$1</span>')
                    .replace(/\n/g, '<br>');
                textEl.innerHTML = formatted;
            }, 300);
        }
    }

    // Small delay before typing starts
    setTimeout(typeChar, 400);
}



/* ============================================================
   FULLSCREEN STORY PANEL — Scramble Decode Engine
   ============================================================ */

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*<>[]{}';

let currentPanel = null;
let scrambleTimers = [];

// Open story panel
function openStoryPanel(panelId) {
    const overlay = document.getElementById('storyOverlay');

    // Show overlay
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Hide all panels
    document.querySelectorAll('.story-panel').forEach(p => p.classList.remove('active'));

    // Show target panel
    const panel = document.getElementById('panel-' + panelId);
    if (panel) {
        panel.classList.add('active');
        currentPanel = panelId;
    }

    // Update nav buttons
    document.querySelectorAll('.snav-btn').forEach(b => b.classList.remove('active'));
    const activeNav = document.getElementById('snav-' + panelId);
    if (activeNav) activeNav.classList.add('active');

    // Spawn floating particles in background
    spawnStoryParticles();

    // Run scramble decode on all elements in this panel
    clearAllScrambles();
    setTimeout(() => {
        runScrambleOnPanel(panel);
    }, 200);
}

// Close story panel
function closeStoryPanel() {
    const overlay = document.getElementById('storyOverlay');
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.classList.remove('active');
        overlay.style.opacity = '';
        document.body.style.overflow = '';
        clearAllScrambles();
        // Clear particles
        document.getElementById('storyParticles').innerHTML = '';
    }, 400);
}

// ESC key closes panel
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeStoryPanel();
});

// ── Scramble Decode Engine ──────────────────────────────────
function clearAllScrambles() {
    scrambleTimers.forEach(t => clearInterval(t));
    scrambleTimers = [];
}

function runScrambleOnPanel(panel) {
    const elements = panel.querySelectorAll('[data-scramble]');
    elements.forEach((el, index) => {
        const finalText = el.getAttribute('data-scramble');
        setTimeout(() => {
            scrambleDecode(el, finalText);
        }, index * 180);
    });

    // Also run on strength cards
    const scards = panel.querySelectorAll('.scard');
    scards.forEach((card, ci) => {
        const h4 = card.querySelector('h4[data-scramble]');
        const p = card.querySelector('p[data-scramble]');
        if (h4) setTimeout(() => scrambleDecode(h4, h4.getAttribute('data-scramble')), ci * 250 + 100);
        if (p) setTimeout(() => scrambleDecode(p, p.getAttribute('data-scramble')), ci * 250 + 300);
    });

    // Goals timeline
    const goalItems = panel.querySelectorAll('.goal-text h4[data-scramble], .goal-text p[data-scramble]');
    goalItems.forEach((el, i) => {
        setTimeout(() => scrambleDecode(el, el.getAttribute('data-scramble')), i * 200 + 150);
    });
}

function scrambleDecode(element, finalText, duration) {
    if (!element || !finalText) return;

    const totalDuration = duration || Math.max(800, finalText.length * 35);
    const totalFrames = Math.floor(totalDuration / 40);
    const revealPerFrame = finalText.length / totalFrames;

    let revealed = 0;
    let frame = 0;

    // Start with full scramble
    element.textContent = randomString(finalText.length);
    element.style.fontFamily = "'Courier New', monospace";

    const timer = setInterval(() => {
        frame++;
        revealed = Math.min(Math.floor(frame * revealPerFrame), finalText.length);

        let display = '';
        for (let i = 0; i < finalText.length; i++) {
            if (i < revealed) {
                display += finalText[i];
            } else if (finalText[i] === ' ') {
                display += ' ';
            } else {
                display += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
            }
        }

        element.textContent = display;

        if (revealed >= finalText.length) {
            element.textContent = finalText;
            clearInterval(timer);

            // Tags pop in after text decodes (only for story-tags children)
            if (element.classList.contains('panel-title')) {
                const tags = element.closest('.story-panel')
                    ? element.closest('.story-panel').querySelectorAll('.stag')
                    : [];
                tags.forEach((tag, ti) => {
                    tag.style.opacity = '0';
                    setTimeout(() => {
                        tag.style.opacity = '1';
                        tag.style.animation = `tag-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both`;
                    }, ti * 120 + 200);
                });
            }
        }
    }, 40);

    scrambleTimers.push(timer);
}

function randomString(len) {
    let s = '';
    for (let i = 0; i < len; i++) {
        s += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
    }
    return s;
}

// ── Floating Particles inside Story Panel ──────────────────
function spawnStoryParticles() {
    const container = document.getElementById('storyParticles');
    container.innerHTML = '';
    const colors = ['#00d4ff', '#7b2cbf', '#ff006e', '#38ef7d'];

    for (let i = 0; i < 35; i++) {
        const dot = document.createElement('div');
        const size = Math.random() * 5 + 2;
        const color = colors[Math.floor(Math.random() * colors.length)];

        dot.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.4 + 0.1};
            animation: particle-float-story ${Math.random() * 8 + 6}s ease-in-out infinite;
            animation-delay: ${Math.random() * 4}s;
            box-shadow: 0 0 ${size * 3}px ${color};
        `;
        container.appendChild(dot);
    }
}

// Add keyframe via JS for story particles
const storyStyle = document.createElement('style');
storyStyle.textContent = `
@keyframes particle-float-story {
    0%,100% { transform: translateY(0px) translateX(0px); opacity: 0.15; }
    25%      { transform: translateY(-30px) translateX(15px); opacity: 0.4; }
    50%      { transform: translateY(-15px) translateX(-20px); opacity: 0.25; }
    75%      { transform: translateY(-40px) translateX(10px); opacity: 0.35; }
}`;
document.head.appendChild(storyStyle);
