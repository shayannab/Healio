/**
 * KawaiiCharacters - Sophisticated minimal SVG characters
 * Elegant line art companions for the landing page
 */

// Mochi - Soft cloud companion representing calm
export function MochiCloud({ className = '', size = 120 }) {
    return (
        <svg
            className={`kawaii-character mochi ${className}`}
            width={size}
            height={size}
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Main cloud body */}
            <ellipse
                cx="60"
                cy="65"
                rx="45"
                ry="35"
                fill="var(--bg-card)"
                stroke="var(--primary-sage)"
                strokeWidth="2"
            />
            {/* Top bumps */}
            <circle cx="35" cy="50" r="20" fill="var(--bg-card)" stroke="var(--primary-sage)" strokeWidth="2" />
            <circle cx="60" cy="40" r="22" fill="var(--bg-card)" stroke="var(--primary-sage)" strokeWidth="2" />
            <circle cx="85" cy="50" r="18" fill="var(--bg-card)" stroke="var(--primary-sage)" strokeWidth="2" />

            {/* Fill overlap */}
            <ellipse cx="60" cy="55" rx="40" ry="25" fill="var(--bg-card)" />

            {/* Cute face - minimal */}
            <ellipse cx="48" cy="65" rx="3" ry="4" fill="var(--accent-brown)" />
            <ellipse cx="72" cy="65" rx="3" ry="4" fill="var(--accent-brown)" />

            {/* Gentle smile */}
            <path
                d="M54 75 Q60 80 66 75"
                stroke="var(--accent-brown)"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
            />

            {/* Blush */}
            <ellipse cx="42" cy="72" rx="5" ry="3" fill="var(--primary-sage-light)" opacity="0.5" />
            <ellipse cx="78" cy="72" rx="5" ry="3" fill="var(--primary-sage-light)" opacity="0.5" />
        </svg>
    );
}

// Petal - Gentle leaf/plant spirit representing growth
export function PetalSpirit({ className = '', size = 100 }) {
    return (
        <svg
            className={`kawaii-character petal ${className}`}
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Main leaf body */}
            <path
                d="M50 15 C20 35, 20 75, 50 90 C80 75, 80 35, 50 15Z"
                fill="var(--primary-sage-light)"
                stroke="var(--primary-sage)"
                strokeWidth="2"
            />

            {/* Leaf vein */}
            <path
                d="M50 25 L50 80"
                stroke="var(--primary-sage)"
                strokeWidth="1.5"
                opacity="0.6"
            />
            <path
                d="M50 40 L35 50"
                stroke="var(--primary-sage)"
                strokeWidth="1"
                opacity="0.4"
            />
            <path
                d="M50 40 L65 50"
                stroke="var(--primary-sage)"
                strokeWidth="1"
                opacity="0.4"
            />
            <path
                d="M50 55 L38 62"
                stroke="var(--primary-sage)"
                strokeWidth="1"
                opacity="0.4"
            />
            <path
                d="M50 55 L62 62"
                stroke="var(--primary-sage)"
                strokeWidth="1"
                opacity="0.4"
            />

            {/* Cute face */}
            <circle cx="42" cy="50" r="2.5" fill="var(--accent-brown)" />
            <circle cx="58" cy="50" r="2.5" fill="var(--accent-brown)" />

            {/* Small content smile */}
            <path
                d="M46 58 Q50 62 54 58"
                stroke="var(--accent-brown)"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
            />
        </svg>
    );
}

// WaveForm - Flowing water drop representing emotions
export function WaveForm({ className = '', size = 100 }) {
    return (
        <svg
            className={`kawaii-character wave ${className}`}
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Water drop body */}
            <path
                d="M50 10 C50 10, 20 45, 20 65 C20 82, 33 95, 50 95 C67 95, 80 82, 80 65 C80 45, 50 10, 50 10Z"
                fill="var(--bg-card)"
                stroke="var(--mood-anxious)"
                strokeWidth="2"
                opacity="0.9"
            />

            {/* Inner highlight */}
            <path
                d="M40 35 C40 35, 30 55, 32 70"
                stroke="var(--mood-anxious)"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.3"
            />

            {/* Cute face */}
            <ellipse cx="40" cy="60" rx="3" ry="3.5" fill="var(--accent-brown)" />
            <ellipse cx="60" cy="60" rx="3" ry="3.5" fill="var(--accent-brown)" />

            {/* Wavy smile */}
            <path
                d="M44 72 Q50 77 56 72"
                stroke="var(--accent-brown)"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
            />

            {/* Blush */}
            <ellipse cx="34" cy="68" rx="4" ry="2.5" fill="var(--mood-anxious)" opacity="0.25" />
            <ellipse cx="66" cy="68" rx="4" ry="2.5" fill="var(--mood-anxious)" opacity="0.25" />
        </svg>
    );
}

// Sparkle decorative element
export function Sparkle({ className = '', size = 24 }) {
    return (
        <svg
            className={`kawaii-sparkle ${className}`}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12 2 L13 9 L20 10 L13 11 L12 18 L11 11 L4 10 L11 9 Z"
                fill="var(--mood-happy)"
                opacity="0.8"
            />
        </svg>
    );
}

// Small floating hearts for decoration
export function FloatingHeart({ className = '', size = 20 }) {
    return (
        <svg
            className={`kawaii-heart ${className}`}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="var(--primary-sage-light)"
                stroke="var(--primary-sage)"
                strokeWidth="1"
            />
        </svg>
    );
}

export default { MochiCloud, PetalSpirit, WaveForm, Sparkle, FloatingHeart };
