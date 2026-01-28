function scrollProjects(direction) {
    const track = document.getElementById('projectsScrollTrack');
    if (!track) return;

    // Scroll by one card width (380px) plus gap (24px)
    const scrollAmount = 404;

    if (direction === 'left') {
        track.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    } else {
        track.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }
}

// Sidebar toggle and logo spinner behavior
(function () {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    // create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'sidebar-toggle';
    toggleBtn.setAttribute('aria-label', 'Toggle sidebar');
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.innerHTML = '<i class="bi bi-chevron-double-left"></i>';
    document.body.appendChild(toggleBtn);

    // Initialize collapsed state from body class
    let collapsed = document.body.classList.contains('sidebar-collapsed');
    updateToggleUI();

    function updateToggleUI() {
        if (collapsed) {
            document.body.classList.add('sidebar-collapsed');
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.innerHTML = '<i class="bi bi-chevron-double-right"></i>';
        } else {
            document.body.classList.remove('sidebar-collapsed');
            toggleBtn.setAttribute('aria-expanded', 'true');
            toggleBtn.innerHTML = '<i class="bi bi-chevron-double-left"></i>';
        }
    }

    toggleBtn.addEventListener('click', function () {
        collapsed = !collapsed;
        updateToggleUI();
    });

    // Logo hover spinner with inertia and smooth settle
    const logo = document.getElementById('sidebarLogo');
    if (!logo) return;

    // Duration values in seconds
    const MIN_DURATION = 0.12;   // fastest spin (s)
    const BASE_DURATION = 0.9;   // spin while hovering initially (s)
    const MAX_DURATION = 1.8;    // slowest spin before stopping (s)
    const DECEL_TIME = 2000;     // ms to decelerate to stop

    let isHovering = false;
    let isSpinning = false;      // true while spin animation present
    let decelHandle = null;
    let decelStart = null;
    let decelStartDuration = null;
    let lastLeaveTime = 0;

    // helper to set CSS variable for duration
    function setLogoDuration(s) {
        logo.style.setProperty('--logo-spin-duration', `${s}s`);
    }

    // helper: get current rotation degrees from computed transform matrix
    function getRotationDegrees(el) {
        const st = window.getComputedStyle(el);
        const tr = st.getPropertyValue('transform');
        if (!tr || tr === 'none') return 0;
        const values = tr.split('(')[1].split(')')[0].split(',');
        const a = parseFloat(values[0]);
        const b = parseFloat(values[1]);
        const angle = Math.atan2(b, a) * (180 / Math.PI);
        return angle;
    }

    function startSpin(initialDuration = BASE_DURATION) {
        // Cancel any running deceleration
        if (decelHandle) {
            cancelAnimationFrame(decelHandle);
            decelHandle = null;
        }
        // ensure no lingering transform transition
        logo.style.transition = logo.style.transition ? logo.style.transition.replace(/transform[^;]+;?/, '') : logo.style.transition;
        setLogoDuration(initialDuration);
        if (!logo.classList.contains('spin-hover')) logo.classList.add('spin-hover');
        isSpinning = true;
    }

    function finishDecelerationAndSettle() {
        // Compute current rotation while animation is still active
        const angle = getRotationDegrees(logo);
        // Lock current rotation via inline transform
        logo.style.transform = `rotate(${angle}deg)`;
        // Remove the continuous animation class so it no longer updates transform
        logo.classList.remove('spin-hover');

        // Force a reflow so the browser acknowledges the inline transform
        // eslint-disable-next-line no-unused-expressions
        logo.offsetHeight;

        // Smoothly transition back to 0deg (original position)
        const prevTransition = logo.style.transition || '';
        const ease = 'transform 600ms cubic-bezier(0.22,0.9,0.36,1)';
        // Preserve other transition properties (filter/box-shadow) by appending
        logo.style.transition = prevTransition ? prevTransition + ' ' + ease : ease;

        // start transition to 0deg on next frame
        requestAnimationFrame(() => {
            logo.style.transform = 'rotate(0deg)';
        });

        // cleanup after transition
        const onTransEnd = (e) => {
            if (e.propertyName === 'transform') {
                // remove transform and restore previous transition (remove only our ease if appended)
                logo.style.transform = '';
                // try to remove our ease from transition string
                logo.style.transition = prevTransition;
                logo.removeEventListener('transitionend', onTransEnd);
            }
        };
        logo.addEventListener('transitionend', onTransEnd);

        isSpinning = false;
        decelHandle = null;
    }

    function beginDeceleration() {
        // If already decelerating, don't start another
        if (decelHandle) return;
        decelStart = performance.now();
        // capture current computed duration
        const current = parseFloat(getComputedStyle(logo).getPropertyValue('--logo-spin-duration')) || BASE_DURATION;
        decelStartDuration = current;

        function step(now) {
            const t = now - decelStart;
            const progress = Math.min(t / DECEL_TIME, 1);
            const newDuration = decelStartDuration + (MAX_DURATION - decelStartDuration) * progress;
            setLogoDuration(newDuration);
            if (progress < 1) {
                decelHandle = requestAnimationFrame(step);
            } else {
                // finished decelerating; smoothly settle back to original rotation
                finishDecelerationAndSettle();
            }
        }

        decelHandle = requestAnimationFrame(step);
    }

    logo.addEventListener('mouseenter', (e) => {
        // If logo is currently decelerating (we left recently and it is still spinning), accelerate
        const timeSinceLeave = Date.now() - lastLeaveTime;
        const REENTER_WINDOW = DECEL_TIME; // within decel period

        if (isSpinning && timeSinceLeave > 0 && timeSinceLeave < REENTER_WINDOW) {
            // accelerate to faster spin on re-enter
            startSpin(MIN_DURATION);
        } else {
            // fresh hover -> start at base speed
            startSpin(BASE_DURATION);
        }

        isHovering = true;
    });

    // Do not change speed on mousemove while hovering (prevents spazz)
    // Instead, detect only quick re-entries to accelerate.

    logo.addEventListener('mouseleave', () => {
        isHovering = false;
        lastLeaveTime = Date.now();
        // start deceleration to MAX_DURATION and then settle
        beginDeceleration();
    });

})();