console.log("Script loaded");
document.addEventListener("DOMContentLoaded", function() {
    
    // As JavaScript is not able to create a real timer, we'll create it here
    function sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
          if ((new Date().getTime() - start) > milliseconds){
            break;
          }
        }
      }
      
    const canvas = document.getElementById('interactive_background');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight; 
    let particles = [];
    let repulse = false; // Flag for repulsion 

    // Wait till the main animation is finished..
    sleep(442)

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 2 + 1;
            this.baseX = x;
            this.baseY = y;
            this.density = (Math.random() * 10) + 2;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.opacity = 0; 
        }

        update() {
            // Movement based on mouse position
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceX = dx / distance;
            let forceY = dy / distance;
            let maxDistance = mouse.radius * 1.17;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceX * force * this.density;
            let directionY = forceY * force * this.density;

            if (distance < maxDistance) {
                this.x += directionX;
                this.y += directionY;
            }

            // Continuous random movement
            this.x += this.speedX;
            this.y += this.speedY;

 

            if (repulse) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let forceX = (dx / distance) * -1;
                let forceY = (dy / distance) * -1;
                let maxDistance = mouse.radius * 2; // Increased radius for repulsion
                if (distance < maxDistance) {
                    this.x += forceX * this.density * 2; // Increased effect
                    this.y += forceY * this.density * 2; // Increased effect
                }
            }

            // Increase the opacity gradually
            if(this.opacity < 1) {
                this.opacity += 0.042;
            }
        
        }

        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`; // Use opacity in fillStyle
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let distance = ((particles[a].x - particles[b].x) ** 2) + ((particles[a].y - particles[b].y) ** 2);
                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    let lineOpacity = Math.min(particles[a].opacity, particles[b].opacity, opacityValue); // Use the lowest opacity of the two particles
                    ctx.strokeStyle = `rgba(255, 255, 255, ${lineOpacity})`; // Use lineOpacity in strokeStyle
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    let intervalId; // Variable to store interval ID

    function init() {
        particles = [];
        const particlesPerUnitArea = 1.17; // You can adjust this value
        const numberOfParticles = Math.floor(canvas.width * canvas.height * particlesPerUnitArea / 10000);
        let count = 0;

        intervalId = setInterval(() => {
            if (count < numberOfParticles) {
                let x = Math.random() * canvas.width;
                let y = Math.random() * canvas.height;
                particles.push(new Particle(x, y));
                count++;
            } else {
                clearInterval(intervalId); // Clear the interval once all particles are added
            }
        }, 20); // Adjust this value to control the speed of particle appearance
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        connect();
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });

    let mouse = {
        x: null,
        y: null,
        radius: 150 // Adjust the radius for attraction effect
    };
    
    canvas.addEventListener('mousedown', function(event) {
        if (event.button === 0) { // Left mouse button
            repulse = true;
            setTimeout(() => { repulse = false; }, 200); // Duration of the repulsion effect
        }
    });
    canvas.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    canvas.addEventListener('mouseout', function() {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    init();
    animate();
});
