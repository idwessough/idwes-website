// Variable to track petal effect state
let petalEffectEnabled = true;

// Function to enable or disable petal effect
function togglePetalEffect(enabled) {
    petalEffectEnabled = enabled;
    console.log(`Petal effect enabled: ${petalEffectEnabled}`); // Log toggle state
    if (!enabled) {
        // Remove all existing petals
        const petals = document.querySelectorAll('.petal');
        petals.forEach(petal => petal.remove());
    }
}

// Array of petal image URLs
const petalImages = [
    '../assets/images/invitation/background/cherry_blossom.png', 
    '../assets/images/invitation/background/white_rose.png', 
    '../assets/images/invitation/background/rose_petal.png', 
    '../assets/images/invitation/background/white_petal.png', 
    '../assets/images/invitation/background/single_pampa.png', 
    '../assets/images/invitation/background/multi_pampas.png' 
];

// Function to create a petal
function createPetal(x, y) {
    if (!petalEffectEnabled) return;

    const petal = document.createElement('div');
    petal.classList.add('petal');

    // Randomly select a petal image
    const imgURL = petalImages[Math.floor(Math.random() * petalImages.length)];
    petal.style.backgroundImage = `url(${imgURL})`;

    // Set initial position
    petal.style.left = x + 'px';
    petal.style.top = y + 'px';

    // Randomize animation properties
    const driftX = (Math.random() - 0.5) * 1000; // Drift between -100px and +100px
    const duration = Math.random() * 2 + 8; // Duration between 3s and 5s
    const delay = Math.random() * 0.11; // Delay between 0s and 0.5s
    const rotate = (Math.random() - 0.5) * 360; // Rotate between -180deg and +180deg
    const scale = Math.random() * 0.5 + 0.75; // Scale between 0.75 and 1.25

    // Set CSS variables
    petal.style.setProperty('--driftX', driftX + 'px');
    petal.style.setProperty('--duration', duration + 's');
    petal.style.setProperty('--delay', delay + 's');
    petal.style.setProperty('--rotate', rotate + 'deg');
    petal.style.setProperty('--scale', scale);

    document.body.appendChild(petal);

    // Remove petal after animation ends
    setTimeout(function () {
        petal.parentElement?.removeChild(petal);
    }, (duration + delay) * 1000);
}

// Throttle function to reduce the number of petals created per second
let lastSpawnTime = 0;
const spawnInterval = 42; // Time in milliseconds between petal spawns

document.addEventListener('mousemove', function (e) {
    if (!petalEffectEnabled) return;

    const currentTime = Date.now();
    if (currentTime - lastSpawnTime > spawnInterval) {
        createPetal(e.clientX, e.clientY);
        lastSpawnTime = currentTime;
    }
});

// Event listener for the toggle checkbox
document.getElementById('backgroundToggle').addEventListener('change', function (e) {
    console.log(`Checkbox state changed: ${e.target.checked}`); // Log checkbox state
    togglePetalEffect(e.target.checked);
});


// Repulsive effect on click or touch
function repulsePetals(event) { 
    // Check if the click target is an interactive element
    const interactiveElements = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'LABEL'];
    let targetElement = event.target;

    while (targetElement) {
        if (interactiveElements.includes(targetElement.tagName)) {
            // Do not prevent default or repulse petals when clicking interactive elements
            return;
        }
        targetElement = targetElement.parentElement;
    } 

    const x = event.clientX || (event.touches && event.touches[0].clientX);
    const y = event.clientY || (event.touches && event.touches[0].clientY);
  
    const petals = document.querySelectorAll('.petal');

    petals.forEach(petal => {
        const petalRect = petal.getBoundingClientRect();
        const petalX = petalRect.left + petalRect.width / 2;
        const petalY = petalRect.top + petalRect.height / 2;

        const dx = petalX - x;
        const dy = petalY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const repulseRadius = 100; // Radius within which petals are repelled

        if (distance < repulseRadius) {
            // Calculate repulsion strength
            const force = (1 - distance / repulseRadius) * 500; // Adjust the multiplier as needed
            const angle = Math.atan2(dy, dx);

            const repulseX = Math.cos(angle) * force;
            const repulseY = Math.sin(angle) * force;

            // Apply repulsion animation
            petal.style.animation = 'none'; // Reset animation
            petal.offsetHeight; // Trigger reflow to restart animation
            petal.style.setProperty('--repulseX', repulseX + 'px');
            petal.style.setProperty('--repulseY', repulseY + 'px');
            petal.style.animation = 'repulse 1s ease-out forwards';
        }
    });
}

// Event listeners for click and touch
document.addEventListener('click', repulsePetals);
document.addEventListener('touchstart', repulsePetals);