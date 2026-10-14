document.addEventListener('DOMContentLoaded', function() {
    const water = document.querySelector('.water');
    const waterSurface = document.querySelector('.water-surface');
    const photosContainer = document.querySelector('.photos-container');
    const photoColors = ['#FF5733', '#33FF57', '#3357FF'];
    
    // Start with water at 40vh height
    let waterHeight = 40;
    
    // Function to create a photo
    function createPhoto() {
        const photo = document.createElement('div');
        photo.className = 'photo';
        
        // Random color from the array
        const randomColor = photoColors[Math.floor(Math.random() * photoColors.length)];
        photo.style.backgroundColor = randomColor;
        
        // Random position
        const randomLeft = Math.random() * (window.innerWidth - 150);
        photo.style.left = randomLeft + 'px';
        
        // Random top position above the viewport
        const randomTop = -100 - Math.random() * 100;
        photo.style.top = randomTop + 'px';
        
        photosContainer.appendChild(photo);
        
        // Start falling animation
        setTimeout(() => {
            photo.classList.add('falling');
            
            // Remove photo after animation completes
            setTimeout(() => {
                photo.remove();
            }, 3000);
        }, 1000);
    }
    
    // Create photos at random intervals
    setInterval(createPhoto, 2000);
    
    // Create wave effect when photo hits water
    function createWave(x, y) {
        const wave = document.createElement('div');
        wave.className = 'wave';
        wave.style.left = x + 'px';
        wave.style.bottom = y + 'px';
        water.appendChild(wave);
        
        // Animate wave
        wave.style.opacity = '1';
        
        // Remove wave after animation
        setTimeout(() => {
            wave.remove();
        }, 1000);
    }
    
    // Check for photo-water collision
    function checkCollision() {
        const photos = document.querySelectorAll('.photo.falling');
        const waterRect = water.getBoundingClientRect();
        
        photos.forEach(photo => {
            const photoRect = photo.getBoundingClientRect();
            
            // Check if photo is intersecting with water
            if (photoRect.bottom > waterRect.top && photoRect.top < waterRect.bottom) {
                // Calculate collision point
                const collisionY = Math.max(photoRect.top, waterRect.top);
                const collisionX = photoRect.left + (photoRect.width / 2);
                
                // Create wave at collision point
                createWave(collisionX - waterRect.left, waterRect.height - (collisionY - waterRect.top));
                
                // Remove photo
                photo.remove();
            }
        });
        
        // Continue checking for collisions
        requestAnimationFrame(checkCollision);
    }
    
    // Start collision detection
    requestAnimationFrame(checkCollision);
    
    // Add subtle wave animation to water surface
    function animateSurfaceWaves() {
        let waveOffset = 0;
        
        function updateWave() {
            waveOffset += 0.5;
            waterSurface.style.transform = `translateY(${Math.sin(waveOffset * 0.1) * 2}px)`;
            requestAnimationFrame(updateWave);
        }
        
        updateWave();
    }
    
    animateSurfaceWaves();
});