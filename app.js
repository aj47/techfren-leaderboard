import { createApp, ref, computed, watch } from 'vue';

createApp({
    setup() {
        const models = ref([]);
        const isLoading = ref(true);
        const loadError = ref(null);

        // Fetch models from the JSON file
        fetch('models.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                models.value = data;
                isLoading.value = false;
                // Set the initial date after models are loaded
                currentDate.value = getLastUpdatedDate();
            })
            .catch(error => {
                console.error('Error loading models:', error);
                loadError.value = error.message;
                isLoading.value = false;
            });

        const sortColumn = ref('passRate');
        const sortDirection = ref('desc');
        const showDetailModal = ref(false);
        const selectedModel = ref(null);
        // Initialize with current date as fallback
        const currentDate = ref('');

        // Computed property to get the most recent date from model entries
        const getLastUpdatedDate = () => {
            if (!models.value || models.value.length === 0) return '';

            // Find the most recent date from all model entries
            const dates = models.value.map(model => {
                // Get the date from the model details
                const dateStr = model.details.date;
                // Parse the date string (format: YYYY-MM-DD)
                return dateStr ? new Date(dateStr) : null;
            }).filter(date => date !== null);

            if (dates.length === 0) return '';

            // Get the most recent date
            const mostRecentDate = new Date(Math.max.apply(null, dates));

            // Format the date
            return mostRecentDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        // Update the current date when models are loaded
        watch(models, () => {
            currentDate.value = getLastUpdatedDate();
        });
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
            isLoading,
            loadError,
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
        speedHeader.addEventListener('mouseenter', () => {
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

