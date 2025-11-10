let scene, camera, renderer, basket, apples = [];
let score = 0;

function init() {
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;
    camera.position.y = 5;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('game-container').appendChild(renderer.domElement);
    
    // Create basket
    const basketGeometry = new THREE.BoxGeometry(2, 1, 1);
    const basketMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
    basket = new THREE.Mesh(basketGeometry, basketMaterial);
    basket.position.y = -5;
    scene.add(basket);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 5);
    scene.add(directionalLight);
    
    // Add ground
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x90EE90 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -6;
    scene.add(ground);
    
    // Event listeners
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onTouchMove);
}

function createApple() {
    const appleGeometry = new THREE.SphereGeometry(0.5);
    const appleMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const apple = new THREE.Mesh(appleGeometry, appleMaterial);
    apple.position.x = Math.random() * 20 - 10;
    apple.position.y = 10;
    apple.position.z = 0;
    scene.add(apple);
    apples.push(apple);
}

function onMouseMove(event) {
    const x = (event.clientX / window.innerWidth) * 20 - 10;
    basket.position.x = x;
}

function onTouchMove(event) {
    event.preventDefault();
    const x = (event.touches[0].clientX / window.innerWidth) * 20 - 10;
    basket.position.x = x;
}

function updateGame() {
    // Move apples
    apples.forEach((apple, index) => {
        apple.position.y -= 0.1;
        
        // Check collision with basket
        if (apple.position.y <= basket.position.y + 1 &&
            Math.abs(apple.position.x - basket.position.x) < 1) {
            scene.remove(apple);
            apples.splice(index, 1);
            score++;
            document.getElementById('scoreValue').textContent = score;
        }
        
        // Remove apples that fell
        if (apple.position.y < -6) {
            scene.remove(apple);
            apples.splice(index, 1);
        }
    });
    
    // Create new apples randomly
    if (Math.random() < 0.02) {
        createApple();
    }
}

function animate() {
    requestAnimationFrame(animate);
    updateGame();
    renderer.render(scene, camera);
}

init();
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});