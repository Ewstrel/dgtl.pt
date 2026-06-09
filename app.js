// Interactive Network Constellation Visual and Navigation Logic

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle Logic
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            mobileNav.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                mobileNav.classList.remove('open');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // 2. Interactive Network Canvas
    const canvas = document.getElementById('network-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    
    // Adjust canvas resolution for high-DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    let mouse = { x: null, y: null, radius: 120 };
    let activeNode = null; // Node highlighted from list hover

    // Handle resizing
    window.addEventListener('resize', () => {
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        initNodes();
    });

    // Handle mouse movement globally relative to the canvas
    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseout', (e) => {
        if (e.relatedTarget === null) {
            mouse.x = null;
            mouse.y = null;
        }
    });

    // Define main network nodes representing research areas
    let mainNodes = [];
    let backgroundPoints = [];
    let pulses = [];

    // Helper to calculate positions based on percentage of container
    function getPos(pctX, pctY) {
        const vizContainer = document.querySelector('.hero-visualization');
        if (vizContainer) {
            const vizRect = vizContainer.getBoundingClientRect();
            const canvasRect = canvas.getBoundingClientRect();
            
            // Calculate relative coordinates
            const relativeLeft = vizRect.left - canvasRect.left;
            const relativeTop = vizRect.top - canvasRect.top;
            
            if (vizRect.width > 0 && vizRect.height > 0) {
                return {
                    x: relativeLeft + vizRect.width * pctX,
                    y: relativeTop + vizRect.height * pctY
                };
            }
        }
        
        // Fallback calculations if vizContainer is not ready or has 0 dimensions
        const constHeight = Math.min(height, 580);
        if (width <= 1024) {
            return {
                x: width * pctX,
                y: constHeight * pctY
            };
        } else {
            const containerWidth = Math.min(width, 1280);
            const leftMargin = (width - containerWidth) / 2;
            const colStart = leftMargin + containerWidth * 0.55;
            const colWidth = containerWidth * 0.45;
            return {
                x: colStart + colWidth * pctX,
                y: constHeight * pctY
            };
        }
    }


    // Connect specific nodes (based on mockup layout)
    const connections = [
        ['portugal', 'tourism'],
        ['portugal', 'housing'],
        ['portugal', 'energy'],
        ['portugal', 'publicservices'],
        ['portugal', 'aiadoption'],
        ['portugal', 'demographics'],
        ['tourism', 'energy'],
        ['tourism', 'housing'],
        ['housing', 'demographics'],
        ['demographics', 'publicservices'],
        ['publicservices', 'aiadoption'],
        ['aiadoption', 'energy'],
        // Connections to fake nodes for density
        ['tourism', 'fake1'],
        ['energy', 'fake1'],
        ['housing', 'fake2'],
        ['demographics', 'fake2'],
        ['publicservices', 'fake3'],
        ['aiadoption', 'fake3'],
        ['portugal', 'fake4'],
        ['demographics', 'fake4'],
        ['energy', 'fake5'],
        ['aiadoption', 'fake5'],
        ['portugal', 'fake6'],
        ['housing', 'fake6']
    ];

    function initPulses() {
        pulses = [];
        const numPulses = 16; // Increased from 12 to match higher density
        for (let i = 0; i < numPulses; i++) {
            const conn = connections[Math.floor(Math.random() * connections.length)];
            pulses.push({
                from: conn[0],
                to: conn[1],
                progress: Math.random(),
                speed: 0.003 + Math.random() * 0.004
            });
        }
    }

    function initNodes() {
        mainNodes = [
            {
                id: 'portugal',
                label: 'Portugal',
                xPct: 0.62,
                yPct: 0.45,
                radius: 6,
                isCenter: true,
                pulse: 0,
                color: '#0F1219'
            },
            {
                id: 'tourism',
                label: 'Tourism',
                xPct: 0.68,
                yPct: 0.18,
                radius: 4.5,
                pulse: 0,
                color: '#0F1219'
            },
            {
                id: 'housing',
                label: 'Housing',
                xPct: 0.41,
                yPct: 0.28,
                radius: 4.5,
                pulse: 0,
                color: '#0F1219'
            },
            {
                id: 'energy',
                label: 'Energy',
                xPct: 0.95,
                yPct: 0.34,
                radius: 4.5,
                pulse: 0,
                color: '#0F1219'
            },
            {
                id: 'publicservices',
                label: 'Public Services',
                xPct: 0.52,
                yPct: 0.72,
                radius: 4.5,
                pulse: 0,
                color: '#0F1219'
            },
            {
                id: 'aiadoption',
                label: 'AI Adoption',
                xPct: 0.75,
                yPct: 0.76,
                radius: 4.5,
                pulse: 0,
                color: '#0F1219'
            },
            {
                id: 'demographics',
                label: 'Demographics',
                xPct: 0.18,
                yPct: 0.52,
                radius: 4.5,
                pulse: 0,
                color: '#0F1219'
            },
            // Fake nodes (no labels)
            {
                id: 'fake1',
                label: '',
                xPct: 0.80,
                yPct: 0.15,
                radius: 2.5,
                pulse: 0,
                color: '#736E65'
            },
            {
                id: 'fake2',
                label: '',
                xPct: 0.26,
                yPct: 0.44,
                radius: 2.5,
                pulse: 0,
                color: '#736E65'
            },
            {
                id: 'fake3',
                label: '',
                xPct: 0.64,
                yPct: 0.82,
                radius: 2.5,
                pulse: 0,
                color: '#736E65'
            },
            {
                id: 'fake4',
                label: '',
                xPct: 0.48,
                yPct: 0.52,
                radius: 2.5,
                pulse: 0,
                color: '#736E65'
            },
            {
                id: 'fake5',
                label: '',
                xPct: 0.88,
                yPct: 0.58,
                radius: 2.5,
                pulse: 0,
                color: '#736E65'
            },
            {
                id: 'fake6',
                label: '',
                xPct: 0.55,
                yPct: 0.22,
                radius: 2.5,
                pulse: 0,
                color: '#736E65'
            }
        ];

        // Initialize state variables for physics and animation
        mainNodes.forEach(node => {
            const basePos = getPos(node.xPct, node.yPct);
            node.x = basePos.x;
            node.y = basePos.y;
            node.baseX = basePos.x;
            node.baseY = basePos.y;
            node.vx = 0;
            node.vy = 0;
            node.hovered = false;
            node.angle = Math.random() * Math.PI * 2;
            node.speed = 0.2 + Math.random() * 0.3;
        });

        // Initialize faint background points for starfield depth
        backgroundPoints = [];
        const numBgPoints = 25;
        for (let i = 0; i < numBgPoints; i++) {
            backgroundPoints.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.15,
                vy: (Math.random() - 0.5) * 0.15,
                radius: 1 + Math.random() * 1.5
            });
        }

        initPulses();
    }

    initNodes();

    // Link cards hover state to canvas nodes
    const researchCards = document.querySelectorAll('.research-card');
    researchCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const nodeId = card.getAttribute('data-node');
            activeNode = nodeId;
            const node = mainNodes.find(n => n.id === nodeId);
            if (node) node.hovered = true;
        });

        card.addEventListener('mouseleave', () => {
            const nodeId = card.getAttribute('data-node');
            activeNode = null;
            const node = mainNodes.find(n => n.id === nodeId);
            if (node) node.hovered = false;
        });
    });

    // Animation Loop
    function animate(time) {
        ctx.clearRect(0, 0, width, height);

        // 1. Draw and update background points
        ctx.fillStyle = 'rgba(115, 110, 101, 0.12)';
        backgroundPoints.forEach(pt => {
            pt.x += pt.vx;
            pt.y += pt.vy;

            // Bounce back bounds
            if (pt.x < 0 || pt.x > width) pt.vx *= -1;
            if (pt.y < 0 || pt.y > height) pt.vy *= -1;

            ctx.beginPath();
            ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        // 2. Physics & positions update for main nodes
        mainNodes.forEach(node => {
            // Drift slightly in a slow circular motion
            node.angle += 0.005 * node.speed;
            const driftX = Math.cos(node.angle) * 8;
            const driftY = Math.sin(node.angle) * 8;
            const targetX = node.baseX + driftX;
            const targetY = node.baseY + driftY;

            // Mouse interaction (gravity push/pull)
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - node.x;
                const db = mouse.y - node.y;
                const distance = Math.sqrt(dx * dx + db * db);

                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    // Push away slightly
                    node.vx -= (dx / distance) * force * 0.4;
                    node.vy -= (db / distance) * force * 0.4;
                    
                    // Highlight if mouse is directly hovering over the node
                    if (distance < 20) {
                        node.hovered = true;
                    } else if (activeNode !== node.id) {
                        node.hovered = false;
                    }
                } else if (activeNode !== node.id) {
                    node.hovered = false;
                }
            } else if (activeNode !== node.id) {
                node.hovered = false;
            }

            // Return to target base position (spring physics)
            const ax = (targetX - node.x) * 0.05;
            const ay = (targetY - node.y) * 0.05;

            node.vx += ax;
            node.vy += ay;
            node.vx *= 0.82; // damping
            node.vy *= 0.82;

            node.x += node.vx;
            node.y += node.vy;

            // Update pulse for hovered state
            if (node.hovered) {
                node.pulse = (node.pulse + 0.1) % (Math.PI * 2);
            } else {
                node.pulse = 0;
            }
        });

        // 3. Draw connections (lines)
        connections.forEach(conn => {
            const nodeA = mainNodes.find(n => n.id === conn[0]);
            const nodeB = mainNodes.find(n => n.id === conn[1]);

            if (nodeA && nodeB) {
                const isHoveredConnection = nodeA.hovered || nodeB.hovered;
                ctx.beginPath();
                ctx.moveTo(nodeA.x, nodeA.y);
                ctx.lineTo(nodeB.x, nodeB.y);
                
                if (isHoveredConnection) {
                    ctx.strokeStyle = 'rgba(15, 18, 25, 0.25)';
                    ctx.lineWidth = 1.25;
                } else {
                    ctx.strokeStyle = 'rgba(115, 110, 101, 0.06)';
                    ctx.lineWidth = 0.75;
                }
                ctx.stroke();
            }
        });

        // 3.5 Update and draw data flow pulses along connections
        pulses.forEach(pulse => {
            pulse.progress += pulse.speed;
            if (pulse.progress >= 1) {
                pulse.progress = 0;
                // Pick a new random connection path
                const conn = connections[Math.floor(Math.random() * connections.length)];
                pulse.from = conn[0];
                pulse.to = conn[1];
                pulse.speed = 0.003 + Math.random() * 0.004;
            }

            const nodeA = mainNodes.find(n => n.id === pulse.from);
            const nodeB = mainNodes.find(n => n.id === pulse.to);

            if (nodeA && nodeB) {
                const x = nodeA.x + (nodeB.x - nodeA.x) * pulse.progress;
                const y = nodeA.y + (nodeB.y - nodeA.y) * pulse.progress;
                
                const isHovered = nodeA.hovered || nodeB.hovered;

                ctx.beginPath();
                ctx.arc(x, y, isHovered ? 2.5 : 1.75, 0, Math.PI * 2);
                ctx.fillStyle = isHovered ? 'rgba(15, 18, 25, 0.65)' : 'rgba(15, 18, 25, 0.22)';
                ctx.fill();
            }
        });

        // 3.6 Draw Scroll-linked "Light Cable" from Portugal node to Research Areas heading
        const portugalNode = mainNodes.find(n => n.id === 'portugal');
        const heading = document.querySelector('#research-areas .section-overline');
        if (portugalNode && heading) {
            const headingRect = heading.getBoundingClientRect();
            const canvasRect = canvas.getBoundingClientRect();
            
            // Connect to the top-left side of the heading (minus 12px padding horizontally, and 4px above the top)
            const targetX = headingRect.left - canvasRect.left - 12;
            const targetY = headingRect.top - canvasRect.top - 4;
            
            const startX = portugalNode.x;
            const startY = portugalNode.y;
            
            // Control points for smooth S-curve (vertical start, horizontal end)
            const cp1x = startX;
            const cp1y = startY + (targetY - startY) * 0.45;
            const cp2x = startX - (startX - targetX) * 0.55;
            const cp2y = targetY;

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, targetX, targetY);
            ctx.strokeStyle = 'rgba(15, 18, 25, 0.08)';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.stroke();
            ctx.restore();

            const scrollY = window.scrollY;
            const maxScroll = 500; // Scroll distance to reach next section
            const scrollPct = Math.min(scrollY / maxScroll, 1);

            if (scrollPct > 0) {
                const t = scrollPct;
                const mt = 1 - t;
                
                // Calculate position along curve (Cubic Bezier formula)
                const pulseX = mt * mt * mt * startX + 3 * mt * mt * t * cp1x + 3 * mt * t * t * cp2x + t * t * t * targetX;
                const pulseY = mt * mt * mt * startY + 3 * mt * mt * t * cp1y + 3 * mt * t * t * cp2y + t * t * t * targetY;
                
                const time = Date.now() * 0.005;

                ctx.save();
                // Draw glowing active path along the curve
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                const steps = 30;
                for (let i = 1; i <= steps; i++) {
                    const currT = (i / steps) * scrollPct;
                    const currMt = 1 - currT;
                    const currX = currMt * currMt * currMt * startX + 3 * currMt * currMt * currT * cp1x + 3 * currMt * currT * currT * cp2x + currT * currT * currT * targetX;
                    const currY = currMt * currMt * currMt * startY + 3 * currMt * currMt * currT * cp1y + 3 * currMt * currT * currT * cp2y + currT * currT * currT * targetY;
                    ctx.lineTo(currX, currY);
                }
                ctx.strokeStyle = 'rgba(15, 18, 25, 0.18)';
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Draw active scroll pulse
                ctx.beginPath();
                ctx.arc(pulseX, pulseY, 3.5, 0, Math.PI * 2);
                ctx.fillStyle = '#0F1219';
                ctx.fill();

                // Concentric outer pulse ring (radar effect, made tighter)
                ctx.beginPath();
                ctx.arc(pulseX, pulseY, 5 + Math.sin(time) * 0.8, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(15, 18, 25, 0.3)';
                ctx.lineWidth = 1;
                ctx.stroke();

                // Monospace text label next to the pulse showing scroll coordinates
                ctx.fillStyle = 'rgba(115, 110, 101, 0.7)';
                ctx.font = '600 8.5px monospace';
                ctx.textAlign = 'right';
                ctx.fillText(`SYS.LINK // Z:${Math.round(scrollY)}PX`, pulseX - 12, pulseY + 3);
                ctx.restore();
            }
        }

        // 4. Draw main nodes and their text labels
        mainNodes.forEach(node => {
            ctx.save();

            // Draw pulsing outer glow if hovered
            if (node.hovered) {
                // Tighter pulsing outer glow (radar effect)
                const glowRadius = node.radius + 3 + Math.sin(node.pulse) * 1.5;
                ctx.beginPath();
                ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(15, 18, 25, 0.08)';
                ctx.fill();
            }

            // Draw core node
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            
            if (node.isCenter) {
                ctx.fillStyle = '#0F1219';
                ctx.fill();
                // Draw a small outline circle around center node (radar effect, made tighter)
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius + 2.5, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(15, 18, 25, 0.6)';
                ctx.lineWidth = 1;
                ctx.stroke();
            } else {
                ctx.fillStyle = node.hovered ? '#0F1219' : '#736E65';
                ctx.fill();
            }

            // Draw text labels
            if (node.label) {
                ctx.fillStyle = node.hovered ? '#0F1219' : '#736E65';
                ctx.font = node.hovered ? 'bold 11px "Plus Jakarta Sans"' : '500 11px "Plus Jakarta Sans"';
                
                // Text alignment offsets to match mockup layout
                let offsetX = 10;
                let offsetY = 4;
                let align = 'left';

                if (node.id === 'portugal') {
                    offsetX = 14;
                    align = 'left';
                } else if (node.id === 'housing') {
                    offsetX = -10;
                    align = 'right';
                } else if (node.id === 'tourism') {
                    offsetY = -12;
                    offsetX = 0;
                    align = 'center';
                } else if (node.id === 'publicservices') {
                    offsetX = -10;
                    align = 'right';
                } else if (node.id === 'demographics') {
                    offsetX = -10;
                    align = 'right';
                } else if (node.id === 'energy') {
                    offsetX = -10;
                    align = 'right';
                }

                ctx.textAlign = align;
                ctx.fillText(node.label, node.x + offsetX, node.y + offsetY);
            }
            ctx.restore();
        });

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    // Global mousemove position listener to update spotlight variables in CSS
    window.addEventListener('mousemove', (e) => {
        document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    });

    // Dynamic Header class toggle on scroll
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
        // Initial check in case page starts scrolled
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        }
    }

    // Scroll Reveal IntersectionObserver
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // 3. Subscription Modal Controller
    const subscribeModal = document.getElementById('subscribe-modal');
    const subscribeBtns = document.querySelectorAll('.btn-subscribe, .btn-subscribe-mobile, a[href="#subscribe"]');
    const modalContainer = subscribeModal ? subscribeModal.querySelector('.modal-container') : null;
    const modalCloseBtn = subscribeModal ? subscribeModal.querySelector('.modal-close') : null;
    const modalDismissBtn = subscribeModal ? subscribeModal.querySelector('.modal-dismiss-btn') : null;
    const subscribeForm = document.getElementById('subscribe-form');
    const subscribeEmail = document.getElementById('subscribe-email');
    const emailError = document.getElementById('email-error');
    const submitBtn = subscribeForm ? subscribeForm.querySelector('.modal-submit-btn') : null;

    function openModal(e) {
        if (e) e.preventDefault();
        if (!subscribeModal) return;
        
        subscribeModal.classList.add('open');
        document.body.classList.add('modal-open');
        subscribeModal.setAttribute('aria-hidden', 'false');
        
        // Auto focus email input after modal transition completes
        setTimeout(() => {
            if (subscribeEmail) subscribeEmail.focus();
        }, 300);
    }

    function closeModal() {
        if (!subscribeModal) return;
        
        subscribeModal.classList.remove('open');
        document.body.classList.remove('modal-open');
        subscribeModal.setAttribute('aria-hidden', 'true');
        
        // Reset modal state after transition closes
        setTimeout(() => {
            if (subscribeForm) subscribeForm.reset();
            if (modalContainer) modalContainer.classList.remove('success');
            if (subscribeEmail) {
                subscribeEmail.classList.remove('has-error');
            }
            if (emailError) {
                emailError.textContent = '';
                emailError.classList.remove('show');
            }
            if (submitBtn) {
                submitBtn.classList.remove('loading');
            }
        }, 400);
    }

    // Bind open events
    subscribeBtns.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    // Bind close events
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeModal);
    
    if (subscribeModal) {
        subscribeModal.addEventListener('click', (e) => {
            // Close if clicking outside the modal-container (i.e. on the overlay)
            if (e.target === subscribeModal) {
                closeModal();
            }
        });
    }

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && subscribeModal && subscribeModal.classList.contains('open')) {
            closeModal();
        }
    });

    // Email validation helper
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // Input event to clear error on typing
    if (subscribeEmail) {
        subscribeEmail.addEventListener('input', () => {
            if (subscribeEmail.classList.contains('has-error')) {
                subscribeEmail.classList.remove('has-error');
                if (emailError) {
                    emailError.classList.remove('show');
                    emailError.textContent = '';
                }
            }
        });
    }

    // Form submit intercept
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailValue = subscribeEmail.value.trim();
            
            // Validation check
            if (!emailValue) {
                subscribeEmail.classList.add('has-error');
                if (emailError) {
                    emailError.textContent = 'Please enter an email address.';
                    emailError.classList.add('show');
                }
                return;
            }
            
            if (!validateEmail(emailValue)) {
                subscribeEmail.classList.add('has-error');
                if (emailError) {
                    emailError.textContent = 'Please enter a valid email address.';
                    emailError.classList.add('show');
                }
                return;
            }
            
            // Show loading state
            if (submitBtn) {
                submitBtn.classList.add('loading');
            }
            
            // Mock API dispatch & transition to success state
            setTimeout(() => {
                // Success action
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                }
                if (modalContainer) {
                    modalContainer.classList.add('success');
                }
                
                console.log(`[DGTL Newsletter] Capturing subscription: ${emailValue}`);
                
                // -------------------------------------------------------------
                // Google Forms Integration Template
                // -------------------------------------------------------------
                // To collect newsletter registrations in Google Sheets directly:
                // 1. Create a Google Form with a single short answer text field for "Email".
                // 2. Open the form in public view, inspect the page source, and locate the:
                //    - Form action URL: "https://docs.google.com/forms/u/0/d/e/[FORM-ID]/formResponse"
                //    - Input name attribute: "entry.[ENTRY-ID]"
                // 3. Uncomment the code below and replace placeholders with your custom values.
                const formUrl = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLScQbP0MU6o_aTKqyYb9W7mLG29fSIZN7xTu6OcJftOpwkqwcw/formResponse';
                const entryId = 'entry.779150717';
                
                const formBody = new URLSearchParams();
                formBody.append(entryId, emailValue);
                
                fetch(formUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: formBody.toString()
                })
                .then(() => {
                    console.log('[DGTL Newsletter] Successfully submitted email to Google Form');
                })
                .catch((error) => {
                    console.error('[DGTL Newsletter] Failed to submit email to Google Form:', error);
                });
                // -------------------------------------------------------------
                
            }, 1200);
        });
    }

    // Recalculate node positions on full page load (when stylesheets/fonts are loaded and layout shifts are done)
    window.addEventListener('load', () => {
        initNodes();
    });
});
