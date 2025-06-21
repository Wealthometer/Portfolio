// Advanced GSAP Animations
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

class AnimationController {
    constructor() {
        this.init();
    }

    init() {
        this.registerPlugins();
        this.setupMasterTimeline();
        this.initParallaxEffects();
        this.setupHoverAnimations();
        this.initTextAnimations();
        this.animateSkillBars();
        this.animateCounters();
        this.initMagneticEffect();
        this.initScrollProgress();
        this.initRevealAnimations();
    }

    registerPlugins() {
        // Plugins are already registered
    }

    setupMasterTimeline() {
        this.masterTL = gsap.timeline();
    }

    // Hero Section Animations
    animateHeroEntry() {
        const tl = gsap.timeline();
        
        tl.fromTo('.hero-title .title-line:first-child', 
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
        )
        .fromTo('.hero-title .title-name', 
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.7)" }, "-=0.4"
        )
        .fromTo('.hero-title .typing-text', 
            { opacity: 0 },
            { opacity: 1, duration: 0.5 }, "-=0.2"
        )
        .fromTo('.hero-description', 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.3"
        )
        .fromTo('.hero-buttons .btn', 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }, "-=0.4"
        )
        .fromTo('.hero-image', 
            { opacity: 0, x: 50, rotation: 5 },
            { opacity: 1, x: 0, rotation: 0, duration: 1, ease: "power2.out" }, "-=0.8"
        )
        .fromTo('.scroll-indicator', 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.3"
        );

        return tl;
    }

    // Page Transition Animations
    createPageTransition(exitPage, enterPage, animationType) {
        const tl = gsap.timeline();
        
        switch(animationType) {
            case 'slide':
                tl.to(exitPage, { x: '-100%', duration: 0.5, ease: "power2.inOut" })
                  .fromTo(enterPage, 
                    { x: '100%' }, 
                    { x: '0%', duration: 0.5, ease: "power2.inOut" }, 0
                  );
                break;
                
            case 'fade':
                tl.to(exitPage, { opacity: 0, duration: 0.3, ease: "power2.out" })
                  .fromTo(enterPage, 
                    { opacity: 0 }, 
                    { opacity: 1, duration: 0.3, ease: "power2.out" }, 0.2
                  );
                break;
                
            case 'scale':
                tl.to(exitPage, { scale: 0.8, opacity: 0, duration: 0.4, ease: "power2.inOut" })
                  .fromTo(enterPage, 
                    { scale: 1.2, opacity: 0 }, 
                    { scale: 1, opacity: 1, duration: 0.4, ease: "power2.inOut" }, 0.2
                  );
                break;
                
            case 'rotate':
                tl.to(exitPage, { rotationY: -90, opacity: 0, duration: 0.5, ease: "power2.inOut" })
                  .fromTo(enterPage, 
                    { rotationY: 90, opacity: 0 }, 
                    { rotationY: 0, opacity: 1, duration: 0.5, ease: "power2.inOut" }, 0.25
                  );
                break;
        }
        
        return tl;
    }

    // Scroll-based Animations
    initParallaxEffects() {
        // Background parallax
        gsap.to('.parallax-bg', {
            yPercent: -50,
            ease: "none",
            scrollTrigger: {
                trigger: 'body',
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        // Floating elements
        gsap.utils.toArray('.float-element').forEach(element => {
            gsap.to(element, {
                y: -20,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "power2.inOut"
            });
        });

        // Parallax cards
        gsap.utils.toArray('.parallax-card').forEach((card, index) => {
            const speed = (index % 2 === 0) ? 0.5 : -0.5;
            gsap.to(card, {
                yPercent: speed * 100,
                ease: "none",
                scrollTrigger: {
                    trigger: card,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });
    }

    // Hover Animations
    setupHoverAnimations() {
        // Button hover effects
        gsap.utils.toArray('.btn').forEach(button => {
            const tl = gsap.timeline({ paused: true });
            
            tl.to(button, { 
                scale: 1.05, 
                y: -2, 
                duration: 0.3, 
                ease: "power2.out" 
            });
            
            button.addEventListener('mouseenter', () => tl.play());
            button.addEventListener('mouseleave', () => tl.reverse());
        });

        // Card hover effects
        gsap.utils.toArray('.project-card, .skill-item, .contact-item').forEach(card => {
            const tl = gsap.timeline({ paused: true });
            
            tl.to(card, { 
                y: -10, 
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                duration: 0.3, 
                ease: "power2.out" 
            });
            
            card.addEventListener('mouseenter', () => tl.play());
            card.addEventListener('mouseleave', () => tl.reverse());
        });

        // Image hover effects
        gsap.utils.toArray('.image-placeholder').forEach(img => {
            const tl = gsap.timeline({ paused: true });
            
            tl.to(img, { 
                scale: 1.1, 
                rotation: 2,
                duration: 0.4, 
                ease: "power2.out" 
            });
            
            img.addEventListener('mouseenter', () => tl.play());
            img.addEventListener('mouseleave', () => tl.reverse());
        });
    }

    // Text Animations
    initTextAnimations() {
        // Stagger text reveal
        gsap.utils.toArray('.stagger-text').forEach(container => {
            const chars = container.textContent.split('');
            container.innerHTML = chars.map(char => 
                `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`
            ).join('');
            
            gsap.fromTo(container.querySelectorAll('.char'), 
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.05,
                    stagger: 0.02,
                    scrollTrigger: {
                        trigger: container,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Typewriter effect
        gsap.utils.toArray('.typewriter-text').forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            
            gsap.to(element, {
                text: text,
                duration: text.length * 0.05,
                ease: "none",
                scrollTrigger: {
                    trigger: element,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });
        });
    }

    // Skill Bar Animations
    animateSkillBars() {
        gsap.utils.toArray('.skill-level').forEach(bar => {
            const level = bar.dataset.level;
            
            gsap.fromTo(bar.querySelector('::after'), 
                { width: '0%' },
                {
                    width: level + '%',
                    duration: 1.5,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: bar,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    }

    // Counter Animations
    animateCounters() {
        gsap.utils.toArray('.counter').forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const obj = { value: 0 };
            
            gsap.to(obj, {
                value: target,
                duration: 2,
                ease: "power2.out",
                onUpdate: () => {
                    counter.textContent = Math.floor(obj.value);
                },
                scrollTrigger: {
                    trigger: counter,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });
        });
    }

    // Magnetic Effect
    initMagneticEffect() {
        gsap.utils.toArray('.magnetic').forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(element, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
            
            element.addEventListener('mouseleave', () => {
                gsap.to(element, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.3)"
                });
            });
        });
    }

    // Scroll Progress Indicator
    initScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: var(--gradient-primary);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
        
        gsap.to(progressBar, {
            width: "100%",
            ease: "none",
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 0.3
            }
        });
    }

    // Reveal Animations
    initRevealAnimations() {
        gsap.utils.toArray('.reveal').forEach(element => {
            gsap.fromTo(element,
                { 
                    opacity: 0, 
                    y: 50,
                    clipPath: "inset(100% 0 0 0)"
                },
                {
                    opacity: 1,
                    y: 0,
                    clipPath: "inset(0% 0 0 0)",
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    }

    // Particle System
    createParticleSystem(container, count = 50) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = `particle particle-${(i % 3) + 1}`;
            particle.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                pointer-events: none;
            `;
            container.appendChild(particle);
            
            // Animate particle
            gsap.to(particle, {
                x: (Math.random() - 0.5) * 200,
                y: (Math.random() - 0.5) * 200,
                rotation: Math.random() * 360,
                duration: Math.random() * 10 + 5,
                repeat: -1,
                yoyo: true,
                ease: "none"
            });
        }
    }

    // Cleanup function
    destroy() {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        this.masterTL.kill();
    }
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    window.animationController = new AnimationController();
});
