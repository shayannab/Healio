/**
 * LandingPage - Warm, Comforting, Premium
 * Cozy wellness vibes with sophisticated polish
 */
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/components/LandingPage.css';

// ... (keep existing hook code)

// Scroll reveal hook
function useScrollReveal(threshold = 0.15) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(element);
                }
            },
            { threshold, rootMargin: '0px 0px -80px 0px' }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [threshold]);

    return [ref, isVisible];
}

// Card spread animation - freezes scroll, animates once, stays spread
function useCardSpreadAnimation() {
    const sectionRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const hasAnimatedRef = useRef(false); // One-time animation flag

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const handleScroll = () => {
            // If already animated, keep progress at 1 (cards stay spread)
            if (hasAnimatedRef.current) {
                setProgress(1);
                return;
            }

            const rect = section.getBoundingClientRect();

            // Trigger ONLY when section top has scrolled past viewport top
            // This ensures Features section is fully visible on screen
            if (rect.top <= 0 && !hasAnimatedRef.current) {
                hasAnimatedRef.current = true;

                // Freeze scroll
                document.body.style.overflow = 'hidden';
                document.documentElement.style.overflow = 'hidden';

                // Wait 500ms so user can see the stacked deck
                setTimeout(() => {
                    // Animate progress from 0 to 1 over 1.5 seconds (smoother)
                    let start = null;
                    const duration = 1500;

                    const animate = (timestamp) => {
                        if (!start) start = timestamp;
                        const elapsed = timestamp - start;
                        const p = Math.min(elapsed / duration, 1);

                        // Smooth easing
                        const eased = 1 - Math.pow(1 - p, 3);
                        setProgress(eased);

                        if (p < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            // Done - unfreeze scroll, cards stay at progress=1
                            document.body.style.overflow = '';
                            document.documentElement.style.overflow = '';
                            setProgress(1);
                        }
                    };

                    requestAnimationFrame(animate);
                }, 500); // 500ms delay to see the deck
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, []);

    return [sectionRef, progress];
}

// Data
const testimonials = [
    { text: "Healio helped me understand patterns I never noticed. It feels like having a gentle guide.", name: "Sarah", role: "Designer" },
    { text: "Finally, an app that feels warm and understanding. Not clinical, not childish—just right.", name: "Marcus", role: "Teacher" },
    { text: "The AI companion actually listens. It's become part of my daily wellness routine.", name: "Emily", role: "Writer" },
    { text: "Beautiful, calming, and genuinely helpful. This is what mental health apps should feel like.", name: "David", role: "Therapist" },
];

const features = [
    {
        icon: "📊",
        img: "/mood-illustrationsbr.png",
        title: "Mood Tracking",
        desc: "Beautiful visualizations reveal patterns in your emotions. Watch your journey unfold with intuitive charts and gentle insights.",
        highlights: ["Daily check-ins", "Pattern recognition", "Visual insights"],
        color: "sage"
    },
    {
        icon: "📝",
        img: "/journal-illustrationsbr.png",
        title: "Guided Journaling",
        desc: "Gentle prompts help you reflect and process your thoughts. Write your way to clarity with AI-curated guidance.",
        highlights: ["Smart prompts", "Mood-based themes", "Private & secure"],
        color: "terracotta"
    },
    {
        icon: "🤖",
        img: "/ai_illustrationsbr.png",
        title: "AI Companion",
        desc: "A supportive presence available 24/7. Always listening, never judging. Your personal wellness ally.",
        highlights: ["24/7 availability", "Empathetic responses", "Personalized support"],
        color: "lavender"
    },
    {
        icon: "🌱",
        img: "/hero-illustartionsbr.png",
        title: "Growth Insights",
        desc: "Personalized recommendations to build resilience. Celebrate wins, learn from patterns, grow stronger.",
        highlights: ["Weekly reports", "Goal tracking", "Progress celebration"],
        color: "sage"
    },
];

function LandingPage() {
    const navigate = useNavigate();
    const handleStart = () => navigate('/dashboard');

    const [openFaq, setOpenFaq] = useState(null);

    const [heroRef, heroVisible] = useScrollReveal(0.1);
    const [featuresRef, featuresProgress] = useCardSpreadAnimation();
    const [howRef, howVisible] = useScrollReveal();
    const [testimonialsRef, testimonialsVisible] = useScrollReveal();
    const [ctaRef, ctaVisible] = useScrollReveal();

    // Track window width for responsive card scaling
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="landing">
            {/* Navigation */}
            <nav className="nav">
                <div className="nav-brand">
                    <span className="brand-icon">🌿</span>
                    <span className="brand-name">Healio</span>
                </div>
                <div className="nav-links">
                    <a href="#features">Features</a>
                    <a href="#how">How It Works</a>
                    <a href="#testimonials">Stories</a>
                </div>
                <div className="nav-actions">
                    <Link to="/login" className="nav-login">Login</Link>
                    <button className="nav-cta" onClick={handleStart}>Start Your Journey</button>
                </div>
            </nav>

            {/* Hero */}
            <section className="hero" ref={heroRef}>
                <div className="hero-bg">
                    <div className="hero-shape shape-1"></div>
                    <div className="hero-shape shape-2"></div>
                    <div className="hero-shape shape-3"></div>
                </div>
                <div className={`hero-content ${heroVisible ? 'visible' : ''}`}>
                    <span className="hero-badge">Your emotional wellness companion</span>
                    <h1 className="hero-title">
                        Find calm in the chaos.
                        <br />
                        <span className="hero-accent">Understand yourself better.</span>
                    </h1>
                    <p className="hero-desc">
                        A gentle space to track your moods, reflect on your days,
                        and grow with AI-powered guidance. No judgment, just understanding.
                    </p>
                    <div className="hero-actions">
                        <button className="btn-primary" onClick={handleStart}>
                            Begin Free Trial
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </button>
                        <button className="btn-secondary">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5,3 19,12 5,21" />
                            </svg>
                            Watch Demo
                        </button>
                    </div>
                    <div className="hero-trust">
                        <div className="trust-avatars">
                            <div className="avatar">S</div>
                            <div className="avatar">M</div>
                            <div className="avatar">E</div>
                            <div className="avatar">+</div>
                        </div>
                        <span>Trusted by 50,000+ people on their wellness journey</span>
                    </div>
                </div>
                <div className={`hero-illustration ${heroVisible ? 'visible' : ''}`}>
                    <img src="/hero-illustartionsbr.png" alt="Peaceful meditation illustration" />
                </div>
            </section>

            {/* Features - Card Stack Animation */}
            <section id="features" className="features" ref={featuresRef}>
                <div className={`section-header ${featuresProgress > 0 ? 'visible' : ''}`}>
                    <span className="section-tag">Features</span>
                    <h2>Everything you need to feel understood</h2>
                    <p>Thoughtful tools designed with care, for every moment of your journey.</p>
                </div>
                <div className="features-stack" style={{
                    height: windowWidth < 1024 ? 'auto' : '550px',
                    flexDirection: windowWidth < 1024 ? 'column' : 'row',
                    gap: windowWidth < 1024 ? '24px' : '0',
                    alignItems: windowWidth < 1024 ? 'center' : 'center',
                    marginTop: windowWidth < 1024 ? '40px' : '0'
                }}>
                    {features.map((feature, i) => {
                        const totalCards = features.length;
                        const spreadProgress = Math.min(1, Math.max(0, featuresProgress));
                        const isMobile = windowWidth < 1024;

                        // Desktop: Horizontal Spread Animation
                        // Mobile: Vertical Stack (Natural Layout)

                        // Base dimensions
                        const baseCardWidth = 360;
                        const baseGap = 32;

                        // Calculate required width
                        const padding = 48;
                        const requiredWidth = (totalCards * baseCardWidth) + ((totalCards - 1) * baseGap) + (padding * 2);

                        // Scale factor (Desktop only)
                        const scaleFactor = isMobile ? 1 : Math.min(1, Math.max(0.6, windowWidth / requiredWidth));

                        // 1. Calculate Desktop Transform
                        const cardWidth = baseCardWidth * scaleFactor;
                        const gap = baseGap * scaleFactor;
                        const totalWidth = totalCards * cardWidth + (totalCards - 1) * gap;
                        const startX = -totalWidth / 2 + cardWidth / 2;
                        const finalX = startX + i * (cardWidth + gap);
                        const translateX = spreadProgress * finalX;
                        const shadowOffset = (1 - spreadProgress) * i * 8;
                        const scale = (1 - (1 - spreadProgress) * 0.03 * i) * scaleFactor;
                        const zIndex = spreadProgress > 0.5 ? 1 : (totalCards - i);

                        // 2. Apply Styles based on mode
                        const style = isMobile ? {
                            position: 'relative',
                            transform: 'none',
                            zIndex: 1,
                            width: '100%',
                            maxWidth: '360px',
                            minHeight: 'auto',
                            padding: '48px 40px 32px',
                        } : {
                            position: 'absolute',
                            transform: `translateX(${translateX}px) translateY(${shadowOffset}px) scale(${scale})`,
                            zIndex: zIndex,
                            width: `${cardWidth}px`,
                            minHeight: `${480 * scaleFactor}px`,
                            padding: `${48 * scaleFactor}px ${40 * scaleFactor}px ${32 * scaleFactor}px`
                        };

                        return (
                            <div
                                key={i}
                                className={`feature-card feature-${feature.color}`}
                                style={style}
                            >
                                {/* Icon Badge */}
                                <span className="feature-icon">{feature.icon}</span>

                                {/* Image */}
                                <div className="feature-img">
                                    <img src={feature.img} alt={feature.title} />
                                </div>

                                {/* Content */}
                                <div className="feature-content">
                                    <h3>{feature.title}</h3>
                                    <p>{feature.desc}</p>

                                    {/* Highlights */}
                                    <ul className="feature-highlights">
                                        {feature.highlights.map((h, j) => (
                                            <li key={j}>
                                                <span className="highlight-dot"></span>
                                                {h}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* CTA */}
                                <a href="#" className="feature-cta">
                                    Learn more
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </a>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* How It Works */}
            <section id="how" className="how-section" ref={howRef}>
                <div className={`section-header ${howVisible ? 'visible' : ''}`}>
                    <span className="section-tag">How It Works</span>
                    <h2>Simple steps, meaningful change</h2>
                </div>
                <div className="steps-container">
                    {[
                        { num: "01", title: "Check in daily", desc: "Take 30 seconds to log how you're feeling. It's quick, gentle, and becomes a calming ritual." },
                        { num: "02", title: "Reflect & process", desc: "Journal when you need to. Chat with AI when you want support. Go at your own pace." },
                        { num: "03", title: "Discover patterns", desc: "Watch beautiful insights emerge. Understand your triggers, celebrate your growth." },
                    ].map((step, i) => (
                        <div
                            key={i}
                            className={`step-card ${howVisible ? 'visible' : ''}`}
                            style={{ transitionDelay: `${i * 0.15}s` }}
                        >
                            <span className="step-num">{step.num}</span>
                            <h3>{step.title}</h3>
                            <p>{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="testimonials" ref={testimonialsRef}>
                <div className={`section-header ${testimonialsVisible ? 'visible' : ''}`}>
                    <span className="section-tag">Stories</span>
                    <h2>Real people, real growth</h2>
                </div>
                <div className={`testimonials-grid ${testimonialsVisible ? 'visible' : ''}`}>
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            className="testimonial-card"
                            style={{ transitionDelay: `${i * 0.1}s` }}
                        >
                            <p>"{t.text}"</p>
                            <div className="testimonial-author">
                                <div className="author-avatar">{t.name[0]}</div>
                                <div>
                                    <strong>{t.name}</strong>
                                    <span>{t.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="faq">
                <div className="section-header">
                    <span className="section-tag">FAQ</span>
                    <h2>Common questions</h2>
                </div>
                <div className="faq-list">
                    {[
                        { q: "Is my data private and secure?", a: "Absolutely. Your data is encrypted end-to-end. We never sell it, and you can delete everything anytime." },
                        { q: "Is this a replacement for therapy?", a: "No—Healio is a supportive companion, not a substitute for professional care." },
                        { q: "How much time does it take?", a: "A quick check-in takes 30 seconds. Journaling and AI chats are entirely on your schedule." },
                        { q: "Can I try it for free?", a: "Yes! We offer a 14-day free trial with full access. No credit card required." },
                    ].map((item, i) => (
                        <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
                            <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                <span>{item.q}</span>
                                <span className="faq-icon">{openFaq === i ? '−' : '+'}</span>
                            </button>
                            <div className="faq-a">
                                <p>{item.a}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Final CTA */}
            <section className="final-cta" ref={ctaRef}>
                <div className={`cta-content ${ctaVisible ? 'visible' : ''}`}>
                    <h2>Ready to feel more understood?</h2>
                    <p>Start your free 14-day trial. No credit card needed.</p>
                    <button className="btn-primary btn-large" onClick={handleStart}>
                        Begin Your Journey
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-main">
                    <div className="footer-brand">
                        <span>🌿 Healio</span>
                        <p>Your gentle companion for emotional wellness.</p>
                    </div>
                    <div className="footer-links">
                        <div className="footer-col">
                            <h4>Product</h4>
                            <a href="#">Features</a>
                            <a href="#">Pricing</a>
                            <a href="#">FAQ</a>
                        </div>
                        <div className="footer-col">
                            <h4>Company</h4>
                            <a href="#">About</a>
                            <a href="#">Blog</a>
                            <a href="#">Contact</a>
                        </div>
                        <div className="footer-col">
                            <h4>Legal</h4>
                            <a href="#">Privacy</a>
                            <a href="#">Terms</a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <span>© 2024 Healio. Made with 💚 for your wellbeing.</span>
                </div>
            </footer>
        </div >
    );
}

export default LandingPage;
