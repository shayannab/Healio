/**
 * Dr. Freud.ai - Mental Health Dashboard
 * Interactive functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    initEmojiSelector();
    initMoodWaveTabs();
    initCalendar();
    initNavigation();
    initFAB();
});

function initEmojiSelector() {
    const emojiOptions = document.querySelectorAll('.emoji-option');
    const expandSection = document.getElementById('checkinExpand');

    emojiOptions.forEach(option => {
        option.addEventListener('click', () => {
            emojiOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            expandSection.classList.add('open');

            const textarea = expandSection.querySelector('textarea');
            if (textarea) setTimeout(() => textarea.focus(), 300);

            const face = option.querySelector('.emoji-face');
            face.style.transform = 'scale(1.1)';
            setTimeout(() => face.style.transform = 'scale(1)', 200);
        });
    });

    const submitBtn = document.querySelector('.checkin-submit');
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const selectedMood = document.querySelector('.emoji-option.selected');
            const textarea = expandSection.querySelector('textarea');

            if (selectedMood) {
                submitBtn.textContent = 'Logged! ✓';
                submitBtn.style.background = 'var(--mood-good)';

                setTimeout(() => {
                    emojiOptions.forEach(opt => opt.classList.remove('selected'));
                    expandSection.classList.remove('open');
                    if (textarea) textarea.value = '';
                    submitBtn.textContent = 'Log Mood ✓';
                    submitBtn.style.background = '';
                }, 1500);
            }
        });
    }
}

function initMoodWaveTabs() {
    const tabs = document.querySelectorAll('.mood-wave-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const graph = document.querySelector('.mood-wave-svg');
            if (graph) {
                graph.style.opacity = '0.5';
                graph.style.transform = 'scaleY(0.95)';
                setTimeout(() => {
                    graph.style.opacity = '1';
                    graph.style.transform = 'scaleY(1)';
                }, 200);
            }
        });
    });
}

function initCalendar() {
    const calendarDays = document.getElementById('calendarDays');
    if (!calendarDays) return;

    const moodData = {
        1: 'happy', 2: 'happy', 3: 'good', 4: 'neutral', 5: 'happy', 6: 'sad', 7: 'anxious',
        8: 'good', 9: 'happy', 10: 'happy', 11: 'good', 12: 'sad'
    };

    const startDay = 0;
    const totalDays = 31;
    const today = 12;

    for (let i = 0; i < startDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day empty';
        calendarDays.appendChild(emptyCell);
    }

    for (let day = 1; day <= totalDays; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        dayCell.textContent = day;

        if (moodData[day]) dayCell.classList.add(`mood-${moodData[day]}`);
        if (day === today) dayCell.classList.add('today');

        calendarDays.appendChild(dayCell);
    }
}

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item a');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

function initFAB() {
    const fab = document.querySelector('.fab');
    if (fab) {
        fab.addEventListener('click', () => {
            const checkinCard = document.querySelector('.checkin-card');
            if (checkinCard) {
                checkinCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                checkinCard.style.boxShadow = '0 0 0 3px var(--primary-sage)';
                setTimeout(() => checkinCard.style.boxShadow = '', 1000);
            }
        });
    }
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressRing = document.querySelector('.score-ring-progress');
            if (progressRing) {
                progressRing.style.strokeDashoffset = 440;
                setTimeout(() => progressRing.style.strokeDashoffset = 88, 100);
            }
            observer.unobserve(entry.target);
        }
    });
});

const scoreCard = document.querySelector('.freud-score-card');
if (scoreCard) observer.observe(scoreCard);
