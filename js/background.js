// Background Effects Controller
import gsap from "gsap" // Import gsap library

class BackgroundEffects {
  constructor() {
    this.bubbles = []
    this.particles = []
    this.isAnimating = false
  }

  init() {
    this.createBubbles()
    this.createParticles()
    this.initParallax()
    this.startAnimations()
  }

  createBubbles() {
    const bubblesContainer = document.querySelector(".bubbles-container")
    if (!bubblesContainer) return

    const bubbleCount = 20

    for (let i = 0; i < bubbleCount; i++) {
      const bubble = document.createElement("div")
      bubble.className = "bubble"

      const size = Math.random() * 60 + 20
      const left = Math.random() * 100
      const animationDuration = Math.random() * 10 + 15
      const delay = Math.random() * 5

      bubble.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${left}%;
                animation-duration: ${animationDuration}s;
                animation-delay: ${delay}s;
            `

      bubblesContainer.appendChild(bubble)
      this.bubbles.push(bubble)
    }
  }

  createParticles() {
    const particleContainer = document.createElement("div")
    particleContainer.className = "particles-container"
    particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `

    document.body.appendChild(particleContainer)

    const particleCount = 30

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div")
      particle.className = "floating-particle"

      const size = Math.random() * 4 + 2
      const x = Math.random() * window.innerWidth
      const y = Math.random() * window.innerHeight

      particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: var(--border-color);
                border-radius: 50%;
                left: ${x}px;
                top: ${y}px;
                opacity: 0.3;
            `

      particleContainer.appendChild(particle)
      this.particles.push({
        element: particle,
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: size,
      })
    }
  }

  initParallax() {
    // Mouse parallax effect
    document.addEventListener("mousemove", (e) => {
      const mouseX = e.clientX / window.innerWidth
      const mouseY = e.clientY / window.innerHeight

      // Move parallax background
      const parallaxBg = document.querySelector(".parallax-bg")
      if (parallaxBg) {
        const moveX = (mouseX - 0.5) * 20
        const moveY = (mouseY - 0.5) * 20
        parallaxBg.style.transform = `translate(${moveX}px, ${moveY}px)`
      }

      // Move particles
      this.particles.forEach((particle, index) => {
        const speed = ((index % 3) + 1) * 0.5
        const moveX = (mouseX - 0.5) * speed * 10
        const moveY = (mouseY - 0.5) * speed * 10

        particle.element.style.transform = `translate(${moveX}px, ${moveY}px)`
      })
    })
  }

  startAnimations() {
    if (this.isAnimating) return
    this.isAnimating = true

    this.animateParticles()
    this.createFloatingElements()
  }

  animateParticles() {
    const animate = () => {
      this.particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        // Bounce off edges
        if (particle.x <= 0 || particle.x >= window.innerWidth) {
          particle.vx *= -1
        }
        if (particle.y <= 0 || particle.y >= window.innerHeight) {
          particle.vy *= -1
        }

        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(window.innerWidth, particle.x))
        particle.y = Math.max(0, Math.min(window.innerHeight, particle.y))

        particle.element.style.left = particle.x + "px"
        particle.element.style.top = particle.y + "px"
      })

      if (this.isAnimating) {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }

  createFloatingElements() {
    // Create geometric shapes that float around
    const shapesContainer = document.createElement("div")
    shapesContainer.className = "floating-shapes"
    shapesContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `

    document.body.appendChild(shapesContainer)

    const shapes = ["circle", "square", "triangle"]

    for (let i = 0; i < 10; i++) {
      const shape = document.createElement("div")
      const shapeType = shapes[Math.floor(Math.random() * shapes.length)]
      const size = Math.random() * 30 + 10

      shape.className = `floating-shape floating-${shapeType}`
      shape.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: 0.1;
            `

      if (shapeType === "circle") {
        shape.style.borderRadius = "50%"
        shape.style.background = "var(--text-primary)"
      } else if (shapeType === "square") {
        shape.style.background = "var(--text-primary)"
        shape.style.transform = "rotate(45deg)"
      } else if (shapeType === "triangle") {
        shape.style.width = "0"
        shape.style.height = "0"
        shape.style.borderLeft = `${size / 2}px solid transparent`
        shape.style.borderRight = `${size / 2}px solid transparent`
        shape.style.borderBottom = `${size}px solid var(--text-primary)`
      }

      shapesContainer.appendChild(shape)

      // Animate the shape
      this.animateShape(shape)
    }
  }

  animateShape(shape) {
    const duration = Math.random() * 20 + 10
    const delay = Math.random() * 5

    gsap.to(shape, {
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 200,
      rotation: Math.random() * 360,
      scale: Math.random() * 0.5 + 0.5,
      duration: duration,
      delay: delay,
      repeat: -1,
      yoyo: true,
      ease: "none",
    })
  }

  // Gradient animation
  createGradientAnimation() {
    const gradientOverlay = document.createElement("div")
    gradientOverlay.className = "gradient-overlay"
    gradientOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, 
                rgba(0,0,0,0.02) 0%, 
                rgba(255,255,255,0.02) 50%, 
                rgba(0,0,0,0.02) 100%);
            background-size: 400% 400%;
            pointer-events: none;
            z-index: -1;
            animation: gradientShift 15s ease infinite;
        `

    document.body.appendChild(gradientOverlay)

    // Add CSS animation
    const style = document.createElement("style")
    style.textContent = `
            @keyframes gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
        `
    document.head.appendChild(style)
  }

  // Interactive cursor effect
  initCursorEffect() {
    const cursor = document.createElement("div")
    cursor.className = "custom-cursor"
    cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: var(--text-primary);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0.3;
            transform: translate(-50%, -50%);
            transition: all 0.1s ease;
        `

    document.body.appendChild(cursor)

    document.addEventListener("mousemove", (e) => {
      cursor.style.left = e.clientX + "px"
      cursor.style.top = e.clientY + "px"
    })

    // Change cursor on hover
    document.addEventListener("mouseenter", (e) => {
      if (e.target.matches("a, button, .btn")) {
        cursor.style.transform = "translate(-50%, -50%) scale(1.5)"
        cursor.style.opacity = "0.6"
      }
    })

    document.addEventListener("mouseleave", (e) => {
      if (e.target.matches("a, button, .btn")) {
        cursor.style.transform = "translate(-50%, -50%) scale(1)"
        cursor.style.opacity = "0.3"
      }
    })
  }

  // Scroll-based effects
  initScrollEffects() {
    let ticking = false

    const updateScrollEffects = () => {
      const scrolled = window.pageYOffset
      const rate = scrolled * -0.5

      // Move background elements
      const parallaxBg = document.querySelector(".parallax-bg")
      if (parallaxBg) {
        parallaxBg.style.transform = `translateY(${rate}px)`
      }

      // Fade bubbles based on scroll
      this.bubbles.forEach((bubble, index) => {
        const offset = scrolled * (index * 0.1 + 0.1)
        bubble.style.transform = `translateY(${offset}px)`
      })

      ticking = false
    }

    const requestScrollUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollEffects)
        ticking = true
      }
    }

    window.addEventListener("scroll", requestScrollUpdate)
  }

  // Resize handler
  handleResize() {
    window.addEventListener("resize", () => {
      // Update particle positions
      this.particles.forEach((particle) => {
        if (particle.x > window.innerWidth) {
          particle.x = window.innerWidth
        }
        if (particle.y > window.innerHeight) {
          particle.y = window.innerHeight
        }
      })
    })
  }

  // Cleanup
  destroy() {
    this.isAnimating = false

    // Remove created elements
    const containers = [
      ".bubbles-container",
      ".particles-container",
      ".floating-shapes",
      ".gradient-overlay",
      ".custom-cursor",
    ]

    containers.forEach((selector) => {
      const element = document.querySelector(selector)
      if (element) {
        element.remove()
      }
    })
  }
}

// Initialize background effects
window.BackgroundEffects = new BackgroundEffects()

// Auto-initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  if (window.BackgroundEffects) {
    window.BackgroundEffects.init()
    window.BackgroundEffects.createGradientAnimation()
    window.BackgroundEffects.initCursorEffect()
    window.BackgroundEffects.initScrollEffects()
    window.BackgroundEffects.handleResize()
  }
})
