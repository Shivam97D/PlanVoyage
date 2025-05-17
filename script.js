
    document.addEventListener('DOMContentLoaded', function () {
      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      };

      const animateOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('animate-hidden');
            entry.target.classList.add(entry.target.dataset.animation);
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      document.querySelectorAll('section').forEach(section => {
        section.querySelectorAll('h1, h2, h3, p, .planner-card, .countdown-card, button, .features-card').forEach((element, index) => {
          element.classList.add('animate-hidden');

          if (element.classList.contains('planner-card')) {
            element.dataset.animation = 'animate-scaleIn';
          } else if (element.tagName === 'H1' || element.tagName === 'H2') {
            element.dataset.animation = 'animate-fadeInUp';
          } else if (element.tagName === 'P') {
            element.dataset.animation = 'animate-fadeInLeft';
          } else if (element.tagName === 'BUTTON') {
            element.dataset.animation = 'animate-fadeInUp';
          } else {
            element.dataset.animation = 'animate-fadeInRight';
          }

          element.style.animationDelay = `${index * 100}ms`;
          animateOnScroll.observe(element);
        });
      });

      const plannerCards = document.querySelectorAll('.planner-card');
      plannerCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          card.style.transform = 'translateY(-10px) scale(1.02)';
          card.style.transition = 'all 0.3s ease';
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = 'translateY(0) scale(1)';
          card.style.transition = 'all 0.3s ease';
        });
      });

      const countdownCards = document.querySelectorAll('.countdown-card');
      countdownCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          card.style.transform = 'scale(1.02)';
          card.style.transition = 'all 0.3s ease';
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = 'scale(1)';
          card.style.transition = 'all 0.3s ease';
        });
      });
      // 3D Camera animation
      const container = document.getElementById('camera-container');
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);
      // Create modern camera model
      const cameraGeometry = new THREE.Group();
      // Main body
      const mainBodyGeometry = new THREE.BoxGeometry(2.5, 2, 1.2);
      const mainBodyMaterial = new THREE.MeshPhongMaterial({
        color: 0x2c2c2c,
        shininess: 90,
        specular: 0x444444
      });
      const mainBody = new THREE.Mesh(mainBodyGeometry, mainBodyMaterial);
      cameraGeometry.add(mainBody);
      // Lens mount
      const mountGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.3, 32);
      const mountMaterial = new THREE.MeshPhongMaterial({
        color: 0x1a1a1a,
        shininess: 100
      });
      const mount = new THREE.Mesh(mountGeometry, mountMaterial);
      mount.rotation.z = Math.PI / 2;
      mount.position.x = 0.8;
      cameraGeometry.add(mount);
      // Main lens
      const lensGeometry = new THREE.CylinderGeometry(0.7, 0.6, 1.2, 32);
      const lensMaterial = new THREE.MeshPhongMaterial({
        color: 0x111111,
        shininess: 120,
        specular: 0x666666
      });
      const lens = new THREE.Mesh(lensGeometry, lensMaterial);
      lens.rotation.z = Math.PI / 2;
      lens.position.x = 1.4;
      cameraGeometry.add(lens);
      // Lens detail rings
      const ringGeometry = new THREE.TorusGeometry(0.65, 0.05, 16, 32);
      const ringMaterial = new THREE.MeshPhongMaterial({
        color: 0x444444,
        shininess: 100
      });
      const ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
      ring1.rotation.y = Math.PI / 2;
      ring1.position.x = 1.2;
      cameraGeometry.add(ring1);
      const ring2 = ring1.clone();
      ring2.position.x = 1.6;
      cameraGeometry.add(ring2);
      // Top details (viewfinder)
      const viewfinderGeometry = new THREE.BoxGeometry(0.8, 0.4, 0.6);
      const viewfinder = new THREE.Mesh(viewfinderGeometry, mainBodyMaterial);
      viewfinder.position.set(0, 1.2, 0);
      cameraGeometry.add(viewfinder);
      // Add lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);
      scene.add(cameraGeometry);
      camera.position.z = 8;
      // Initial position and scale
      cameraGeometry.rotation.y = Math.PI / 4;
      cameraGeometry.rotation.x = Math.PI / 12;
      cameraGeometry.position.x = 0;
      cameraGeometry.position.y = 0;
      cameraGeometry.scale.set(0.8, 0.8, 0.8);
      // Scroll animation
      let scrollPercent = 0;
      document.addEventListener('scroll', () => {
        const heroContent = document.getElementById('hero-content');
        const rect = heroContent.getBoundingClientRect();
        scrollPercent = 1 - (rect.top + rect.height) / (window.innerHeight + rect.height);
        scrollPercent = Math.max(0, Math.min(1, scrollPercent));
      });
      function animate() {
        requestAnimationFrame(animate);
        // Rotate based on scroll position
        cameraGeometry.rotation.y = Math.PI / 4 + (scrollPercent * Math.PI * 1.5);
        cameraGeometry.rotation.x = Math.PI / 12 + (scrollPercent * Math.PI / 8);
        // Subtle floating animation
        cameraGeometry.position.y = Math.sin(Date.now() * 0.001) * 0.1;
        renderer.render(scene, camera);
      }
      animate();
      // Handle window resize
      window.addEventListener('resize', function () {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      });
      // Handle visibility change
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
          renderer.setAnimationLoop(null);
        } else {
          renderer.setAnimationLoop(animate);
        }
      });
    });
    document.addEventListener('DOMContentLoaded', function () {
      // Countdown flip animation
      const flipCards = document.querySelectorAll('.flip-card');
      flipCards.forEach(card => {
        setInterval(() => {
          card.classList.add('flipped');
          setTimeout(() => {
            card.classList.remove('flipped');
          }, 500);
        }, 5000);
      });
    });
    document.addEventListener('DOMContentLoaded', function () {
      // Emoji picker toggle
      const emojiToggles = document.querySelectorAll('.emoji-toggle');
      emojiToggles.forEach(toggle => {
        toggle.addEventListener('click', function () {
          const picker = this.nextElementSibling;
          picker.classList.toggle('hidden');
        });
      });
      // Add emoji to notes
      const emojiButtons = document.querySelectorAll('.emoji-btn');
      emojiButtons.forEach(btn => {
        btn.addEventListener('click', function () {
          const emoji = this.textContent;
          const card = this.closest('.planner-card');
          const textarea = card.querySelector('textarea');
          textarea.value += emoji;
          this.closest('.emoji-picker').classList.add('hidden');
        });
      });
      // Close emoji picker when clicking outside
      document.addEventListener('click', function (event) {
        if (!event.target.closest('.emoji-toggle') && !event.target.closest('.emoji-picker')) {
          document.querySelectorAll('.emoji-picker').forEach(picker => {
            picker.classList.add('hidden');
          });
        }
      });
    });