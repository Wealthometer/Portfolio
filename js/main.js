// Main JavaScript functionality
class Portfolio {
  constructor() {
    this.currentPage = "home"
    this.isTransitioning = false
    this.animationTypes = ["fade", "slide", "rise", "rotate", "pop", "skate", "wipe"]
    this.currentAnimation = "fade"

    this.init()
  }

  init() {
    this.setupEventListeners()
    this.initializeTheme()
    this.showLoadingScreen()
    this.initializeGSAP()
  }

  setupEventListeners() {
    // Navigation links
    const navLinks = document.querySelectorAll(".nav-link")
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const pageId = link.dataset.page
        if (pageId && pageId !== this.currentPage && !this.isTransitioning) {
          this.currentAnimation = this.getRandomAnimation()
          this.navigateTo(pageId, this.currentAnimation)
        }
      })
    })

    // Hero buttons
    const heroButtons = document.querySelectorAll(".hero-buttons .btn")
    heroButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault()
        const pageId = button.dataset.page
        if (pageId && pageId !== this.currentPage && !this.isTransitioning) {
          this.currentAnimation = this.getRandomAnimation()
          this.navigateTo(pageId, this.currentAnimation)
        }
      })
    })

    // Theme toggle
    const themeToggle = document.getElementById("theme-toggle")
    themeToggle.addEventListener("click", () => {
      this.toggleTheme()
    })

    // Mobile menu toggle
    const hamburger = document.getElementById("hamburger")
    const navMenu = document.getElementById("nav-menu")

    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active")
      navMenu.classList.toggle("active")
    })

    // Close mobile menu when clicking on a link
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active")
        navMenu.classList.remove("active")
      })
    })

    // Scroll events
    window.addEventListener("scroll", () => {
      this.handleScroll()
    })

    // Resize events
    window.addEventListener("resize", () => {
      this.handleResize()
    })
  }

  showLoadingScreen() {
    const loadingScreen = document.getElementById("loading-screen")
    const progressBar = document.querySelector(".loading-progress")
    const percentage = document.querySelector(".loading-percentage")

    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress > 100) progress = 100

      progressBar.style.width = progress + "%"
      percentage.textContent = Math.floor(progress) + "%"

      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          loadingScreen.style.opacity = "0"
          setTimeout(() => {
            loadingScreen.style.display = "none"
            this.startInitialAnimations()
          }, 500)
        }, 500)
      }
    }, 100)
  }

  startInitialAnimations() {
    // Start typing animation
    this.startTypingAnimation()

    // Initialize scroll animations
    this.initScrollAnimations()

    // Start background animations
    if (window.BackgroundEffects) {
      window.BackgroundEffects.init()
    }
  }

  startTypingAnimation() {
    const typingElement = document.querySelector(".typing-text")
    if (!typingElement) return

    const texts = [
      "Full Stack Developer",
      "Frontend Specialist", 
      "Backend Engineer",
      "UI/UX Enthusiast",
      "Problem Solver",
    ]

    let textIndex = 0
    let charIndex = 0
    let isDeleting = false

    const typeSpeed = 100
    const deleteSpeed = 50
    const pauseTime = 2000

    function type() {
      const currentText = texts[textIndex]

      if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1)
        charIndex--
      } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1)
        charIndex++
      }

      let speed = isDeleting ? deleteSpeed : typeSpeed

      if (!isDeleting && charIndex === currentText.length) {
        speed = pauseTime
        isDeleting = true
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false
        textIndex = (textIndex + 1) % texts.length
      }

      setTimeout(type, speed)
    }

    type()
  }

  navigateTo(pageId, animation = "fade") {
    if (this.isTransitioning) return

    this.isTransitioning = true
    const currentPageEl = document.getElementById(this.currentPage)
    const targetPageEl = document.getElementById(pageId)
    const pageTransitionOverlay = document.getElementById("page-transition-overlay")

    if (!currentPageEl || !targetPageEl) {
      this.isTransitioning = false
      return
    }

    // Update navigation
    this.updateNavigation(pageId)

    // Perform transition
    this.performPageTransition(currentPageEl, targetPageEl, animation, pageTransitionOverlay)

    // Update current page
    this.currentPage = pageId
  }

  performPageTransition(currentPageEl, targetPageEl, animation, pageTransitionOverlay) {
    // Add exit animation class to current page
    currentPageEl.classList.add(`${animation}-exit`)

    // Use overlay for smoother transitions
    pageTransitionOverlay.style.transform = "translateY(0)"
    pageTransitionOverlay.style.transition = "transform 0.5s ease"

    setTimeout(() => {
      // Hide current page and show target page
      currentPageEl.classList.remove("active")
      currentPageEl.classList.remove(`${animation}-exit`)

      targetPageEl.classList.add("active")
      targetPageEl.classList.add(`${animation}-enter`)

      // Hide overlay
      pageTransitionOverlay.style.transform = "translateY(-100%)"

      setTimeout(() => {
        // Complete enter animation
        targetPageEl.classList.remove(`${animation}-enter`)
        targetPageEl.classList.add(`${animation}-enter-active`)

        setTimeout(() => {
          targetPageEl.classList.remove(`${animation}-enter-active`)
          this.isTransitioning = false

          // Initialize page-specific functionality
          this.initPageSpecific(this.currentPage)
        }, 500)
      }, 50)
    }, 500)
  }

  updateNavigation(pageId) {
    const navLinks = document.querySelectorAll(".nav-link")
    navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.dataset.page === pageId) {
        link.classList.add("active")
      }
    })
  }

  getRandomAnimation() {
    const randomIndex = Math.floor(Math.random() * this.animationTypes.length)
    return this.animationTypes[randomIndex]
  }

  initializeTheme() {
    const savedTheme = localStorage.getItem("portfolio-theme") || "light"
    document.documentElement.setAttribute("data-theme", savedTheme)
    this.updateThemeIcon(savedTheme)
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme")
    const newTheme = currentTheme === "dark" ? "light" : "dark"

    document.documentElement.setAttribute("data-theme", newTheme)
    localStorage.setItem("portfolio-theme", newTheme)
    this.updateThemeIcon(newTheme)
  }

  updateThemeIcon(theme) {
    const themeIcon = document.querySelector("#theme-toggle i")
    if (themeIcon) {
      themeIcon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon"
    }
  }

  initializeGSAP() {
    // Register ScrollTrigger plugin
    const gsap = window.gsap
    const ScrollTrigger = window.ScrollTrigger
    if (gsap && ScrollTrigger && gsap.registerPlugin) {
      gsap.registerPlugin(ScrollTrigger)
    }

    // Set up scroll animations
    this.setupScrollAnimations()
  }

  setupScrollAnimations() {
    const gsap = window.gsap
    const ScrollTrigger = window.ScrollTrigger
    if (!gsap || !ScrollTrigger) return

    // Fade in animations
    gsap.utils.toArray(".gsap-fade-in").forEach((element) => {
      gsap.fromTo(
        element,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        },
      )
    })

    // Slide animations
    gsap.utils.toArray(".gsap-slide-left").forEach((element) => {
      gsap.fromTo(
        element,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )
    })

    gsap.utils.toArray(".gsap-slide-right").forEach((element) => {
      gsap.fromTo(
        element,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )
    })

    // Scale animations
    gsap.utils.toArray(".gsap-scale-up").forEach((element) => {
      gsap.fromTo(
        element,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )
    })
  }

  initScrollAnimations() {
    const gsap = window.gsap
    const ScrollTrigger = window.ScrollTrigger
    if (!gsap || !ScrollTrigger) return

    // Parallax effect for hero section
    gsap.to(".parallax-bg", {
      yPercent: -50,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    })

    // Navbar background on scroll
    ScrollTrigger.create({
      start: "top -80",
      end: 99999,
      toggleClass: { className: "scrolled", targets: ".navbar" },
    })
  }

  initPageSpecific(pageId) {
    switch (pageId) {
      case "about":
        this.initAboutPage()
        break
      case "projects":
        this.initProjectsPage()
        break
      case "skills":
        this.initSkillsPage()
        break
      case "contact":
        this.initContactPage()
        break
    }
  }

  initAboutPage() {
    // Load GitHub stats
    if (window.GitHubAPI) {
      window.GitHubAPI.loadStats()
    }

    // Animate about elements
    const gsap = window.gsap
    if (gsap) {
      gsap.fromTo(".about-text", { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 1, delay: 0.2 })
      gsap.fromTo(".about-image", { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 1, delay: 0.4 })
    }
  }

  initProjectsPage() {
    // Load projects
    if (window.GitHubAPI) {
      window.GitHubAPI.loadProjects()
    }

    // Setup project filters
    this.setupProjectFilters()

    // Animate project cards
    const gsap = window.gsap
    if (gsap) {
      gsap.fromTo(
        ".project-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.2,
        },
      )
    }
  }

  initSkillsPage() {
    // Animate skill levels
    this.animateSkillLevels()

    // Animate skill categories
    const gsap = window.gsap
    if (gsap) {
      gsap.fromTo(
        ".skills-category",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          delay: 0.2,
        },
      )
    }
  }

  initContactPage() {
    // Initialize contact form
    if (window.ContactForm) {
      window.ContactForm.init()
    }

    // Animate contact elements
    const gsap = window.gsap
    if (gsap) {
      gsap.fromTo(".contact-info", { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 1, delay: 0.2 })
      gsap.fromTo(".contact-form", { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 1, delay: 0.4 })
    }
  }

  setupProjectFilters() {
    const filterButtons = document.querySelectorAll(".filter-btn")
    const projectCards = document.querySelectorAll(".project-card")

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter

        // Update active button
        filterButtons.forEach((btn) => btn.classList.remove("active"))
        button.classList.add("active")

        // Filter projects
        projectCards.forEach((card) => {
          const category = card.dataset.category
          if (filter === "all" || category === filter) {
            const gsap = window.gsap
            if (gsap) {
              gsap.to(card, { opacity: 1, scale: 1, duration: 0.3 })
            }
            card.style.display = "block"
          } else {
            const gsap = window.gsap
            if (gsap) {
              gsap.to(card, {
                opacity: 0,
                scale: 0.8,
                duration: 0.3,
                onComplete: () => {
                  card.style.display = "none"
                },
              })
            } else {
              card.style.display = "none"
            }
          }
        })
      })
    })
  }

  animateSkillLevels() {
    const skillLevels = document.querySelectorAll(".skill-level")

    skillLevels.forEach((skill) => {
      const level = skill.dataset.level

      const gsap = window.gsap
      const ScrollTrigger = window.ScrollTrigger
      if (gsap && ScrollTrigger) {
        gsap.to(skill, {
          "--skill-width": level + "%",
          duration: 1.5,
          delay: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: skill,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })

        // Animate the pseudo-element
        gsap.fromTo(
          skill,
          { "--skill-width": "0%" },
          {
            "--skill-width": level + "%",
            duration: 1.5,
            delay: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: skill,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        )
      }
    })
  }

  handleScroll() {
    const scrolled = window.pageYOffset
    const navbar = document.querySelector(".navbar")

    if (scrolled > 100) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  }

  handleResize() {
    // Refresh ScrollTrigger on resize
    const ScrollTrigger = window.ScrollTrigger
    if (ScrollTrigger) {
      ScrollTrigger.refresh()
    }
  }
}

// Initialize portfolio when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.portfolio = new Portfolio()
})

// Add CSS for skill level animation
const style = document.createElement("style")
style.textContent = `
    .skill-level {
        --skill-width: 0%;
    }
    
    .skill-level::after {
        width: var(--skill-width);
    }
    
    .navbar.scrolled {
        background: rgba(255, 255, 255, 0.98);
        box-shadow: var(--shadow-light);
    }
    
    [data-theme="dark"] .navbar.scrolled {
        background: rgba(0, 0, 0, 0.98);
    }
`
document.head.appendChild(style)
