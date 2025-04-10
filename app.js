import { createApp, ref, computed } from 'vue';

createApp({
    setup() {
        const models = ref([
            { id: 1, name: 'GPT-4 Turbo', passRate: 92.7, speed: 1250, cost: 0.0180 },
            { id: 2, name: 'Claude 3 Opus', passRate: 93.5, speed: 1500, cost: 0.0200 },
            { id: 3, name: 'GPT-4o', passRate: 95.3, speed: 850, cost: 0.0150 },
            { id: 4, name: 'Claude 3 Sonnet', passRate: 87.8, speed: 730, cost: 0.0090 },
            { id: 5, name: 'GPT-3.5 Turbo', passRate: 75.4, speed: 450, cost: 0.0015 },
            { id: 6, name: 'Llama 3 70B', passRate: 85.2, speed: 1100, cost: 0.0030 },
            { id: 7, name: 'Gemini Pro', passRate: 88.9, speed: 980, cost: 0.0075 },
            { id: 8, name: 'Claude 3 Haiku', passRate: 82.3, speed: 520, cost: 0.0060 },
            { id: 9, name: 'Mistral Large', passRate: 84.6, speed: 890, cost: 0.0045 },
            { id: 10, name: 'Code Llama 70B', passRate: 81.7, speed: 920, cost: 0.0020 },
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

