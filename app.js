import { createApp, ref, computed } from 'vue';

createApp({
    setup() {
        const models = ref([
            { id: 1, name: 'Optimus Alpha', passRate: 23.6, speed: 4225, cost: 0.0000 }
        ]);

        const sortColumn = ref('passRate');
        const sortDirection = ref('desc');
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

        const sortedModels = computed(() => {
            return [...models.value].sort((a, b) => {
                let comparison = 0;
                
                if (a[sortColumn.value] < b[sortColumn.value]) {
                    comparison = -1;
                } else if (a[sortColumn.value] > b[sortColumn.value]) {
                    comparison = 1;
                }
                
                return sortDirection.value === 'asc' ? comparison : -comparison;
            });
        });

        // Initialize digital rain animation
        setTimeout(() => {
            initDigitalRain();
        }, 100);

        return {
            models,
            sortColumn,
            sortDirection,
            sortBy,
            sortedModels,
            currentDate
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

