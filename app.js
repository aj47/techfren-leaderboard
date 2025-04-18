import { createApp, ref, computed } from 'vue';

createApp({
    setup() {
        const models = ref([
            {
                id: 1,
                name: 'Gemini Flash 1.5 8B',
                passRate: 2.7,
                speed: 88600, // milliseconds per test case
                cost: 0.0000,
                details: {
                    dirname: '2025-04-18-15-38-46--flash-1.5-8b',
                    test_cases: 225,
                    model: 'openrouter/google/gemini-flash-1.5-8b-exp',
                    edit_format: 'diff',
                    commit_hash: '490cab3',
                    pass_rate_1: 2.7,
                    pass_rate_2: 2.7,
                    pass_num_1: 6,
                    pass_num_2: 6,
                    percent_cases_well_formed: 76.4,
                    error_outputs: 1992,
                    num_malformed_responses: 147,
                    num_with_malformed_responses: 53,
                    user_asks: 12,
                    lazy_comments: 2,
                    syntax_errors: 0,
                    indentation_errors: 0,
                    exhausted_context_windows: 11,
                    test_timeouts: 0,
                    total_tests: 225,
                    command: 'aider --model openrouter/google/gemini-flash-1.5-8b-exp',
                    date: '2025-04-18',
                    versions: '0.71.2.dev',
                    seconds_per_case: 88.6,
                    total_cost: 0.0000
                }
            }
        ]);

        const sortColumn = ref('passRate');
        const sortDirection = ref('desc');
        const showDetailModal = ref(false);
        const selectedModel = ref(null);
        const currentDate = ref(new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }));
        const sortBy = (column) => {
            if (sortColumn.value === column) {
                sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
            } else {
                sortColumn.value = column;
                sortDirection.value = 'desc';
            }
        };

        const showDetails = (model) => {
            selectedModel.value = model;
            showDetailModal.value = true;
            // Add event listener to close modal when clicking outside
            setTimeout(() => {
                document.addEventListener('click', closeModalOnOutsideClick);
            }, 100);
        };

        const closeDetailModal = () => {
            showDetailModal.value = false;
            document.removeEventListener('click', closeModalOnOutsideClick);
        };

        const closeModalOnOutsideClick = (event) => {
            const modalContent = document.querySelector('.modal-content');
            if (modalContent && !modalContent.contains(event.target) && event.target.id !== 'detail-modal') {
                closeDetailModal();
            }
        };

        const sortedModels = computed(() => {
            const sorted = [...models.value].sort((a, b) => {
                let comparison = 0;

                if (a[sortColumn.value] < b[sortColumn.value]) {
                    comparison = -1;
                } else if (a[sortColumn.value] > b[sortColumn.value]) {
                    comparison = 1;
                }

                return sortDirection.value === 'asc' ? comparison : -comparison;
            });

            // Update text colors after Vue updates the DOM
            setTimeout(() => {
                updateProgressTextColors();
            }, 50);

            return sorted;
        });

        // Initialize digital rain animation
        setTimeout(() => {
            initDigitalRain();
            updateProgressTextColors();
        }, 100);

        return {
            models,
            sortColumn,
            sortDirection,
            sortBy,
            sortedModels,
            currentDate,
            showDetailModal,
            selectedModel,
            showDetails,
            closeDetailModal
        };
    }
}).mount('#app');

function initDigitalRain() {
    const canvas = document.createElement('canvas');
    const container = document.querySelector('.digital-rain');
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Characters for the digital rain
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

    // Column settings
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);

    // Array to track the y position of each column
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }

    function draw() {
        // Set a semi-transparent black background to create fade effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Set the text color and font
        ctx.fillStyle = '#0f0';
        ctx.font = `${fontSize}px monospace`;

        // Draw the characters
        for (let i = 0; i < drops.length; i++) {
            // Get a random character
            const text = characters.charAt(Math.floor(Math.random() * characters.length));

            // Draw the character
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            // Move the drop down
            drops[i]++;

            // If the drop has reached the bottom, reset it to the top with some randomness
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
        }
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const newColumns = Math.floor(canvas.width / fontSize);

        // Update drops array if needed
        if (newColumns > columns) {
            for (let i = drops.length; i < newColumns; i++) {
                drops[i] = Math.random() * -100;
            }
        }
    });

    // Run the animation
    setInterval(draw, 50);
}

function updateProgressTextColors() {
    // Function to determine if text should be light or dark based on background
    const progressBars = document.querySelectorAll('.progress-bar');

    // Update colors initially
    updateColors();

    // Update colors whenever the window is resized or after sorting
    window.addEventListener('resize', updateColors);
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            // Wait for Vue to update the DOM
            setTimeout(updateColors, 100);
        });
    });

    // Setup tooltip functionality
    setupTooltip();

    function updateColors() {
        progressBars.forEach(bar => {
            const progressElement = bar.querySelector('.progress');
            const textElement = bar.querySelector('.progress-text');

            if (!progressElement || !textElement) return;

            const progressWidth = parseFloat(progressElement.style.width);
            const barWidth = bar.offsetWidth;
            const textWidth = textElement.offsetWidth;

            // Calculate the center position of the text
            const textCenter = barWidth / 2;

            // Calculate the right edge of the progress bar
            const progressRightEdge = (progressWidth / 100) * barWidth;

            // Determine if the text is mostly over the colored part of the progress bar
            const textLeftEdge = textCenter - (textWidth / 2);
            const textRightEdge = textCenter + (textWidth / 2);

            // Calculate how much of the text is over the colored part
            const overlapStart = Math.max(textLeftEdge, 0);
            const overlapEnd = Math.min(textRightEdge, progressRightEdge);
            const overlapWidth = Math.max(0, overlapEnd - overlapStart);

            // If more than 50% of the text is over the colored part, use light text
            if (overlapWidth > textWidth / 2) {
                textElement.style.color = '#0a0a0a'; // Dark text (same as background)
            } else {
                textElement.style.color = '#e0e0e0'; // Light text (same as text color)
            }
        });
    }

    function setupTooltip() {
        const speedHeader = document.querySelector('th.speed .tooltip-container');
        const speedTooltip = document.getElementById('speed-tooltip');
        const tooltipOverlay = document.getElementById('tooltip-overlay');

        if (!speedHeader || !speedTooltip || !tooltipOverlay) return;

        // Show tooltip on hover
        speedHeader.addEventListener('mouseenter', (e) => {
            const rect = speedHeader.getBoundingClientRect();

            // Position the tooltip above the header
            speedTooltip.style.left = (rect.left + rect.width / 2) + 'px';
            speedTooltip.style.top = (rect.top - 10) + 'px';

            // Show the tooltip
            speedTooltip.style.visibility = 'visible';
            speedTooltip.style.opacity = '1';
        });

        // Hide tooltip when mouse leaves
        speedHeader.addEventListener('mouseleave', () => {
            speedTooltip.style.visibility = 'hidden';
            speedTooltip.style.opacity = '0';
        });

        // For mobile: show on tap
        speedHeader.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const rect = speedHeader.getBoundingClientRect();

            // Position the tooltip above the header
            speedTooltip.style.left = (rect.left + rect.width / 2) + 'px';
            speedTooltip.style.top = (rect.top - 10) + 'px';

            // Show the tooltip
            speedTooltip.style.visibility = 'visible';
            speedTooltip.style.opacity = '1';

            // Hide after 3 seconds
            setTimeout(() => {
                speedTooltip.style.visibility = 'hidden';
                speedTooltip.style.opacity = '0';
            }, 3000);
        });
    }
}

