// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

const mobileMenuLinks = mobileMenu.querySelectorAll('a');
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// AI Strategy Brief Generation
const generateButton = document.getElementById('generate-brief-button');
const challengeInput = document.getElementById('challenge-input');
const briefLoading = document.getElementById('brief-loading');
const briefResult = document.getElementById('brief-result');
const briefError = document.getElementById('brief-error');

generateButton.addEventListener('click', async () => {
    const userChallenge = challengeInput.value.trim();
    if (!userChallenge) {
        alert('Please describe your challenge first.');
        return;
    }

    briefLoading.style.display = 'flex';
    briefResult.style.display = 'none';
    briefError.style.display = 'none';
    generateButton.disabled = true;
    generateButton.classList.add('opacity-50', 'cursor-not-allowed');

    const prompt = `
        As a Partner-level Design Strategist at Sarvarth, a top-tier enterprise design agency, create a preliminary strategic brief based on the following client challenge. Your response should be structured, insightful, and framed to start a productive conversation. Use markdown for formatting.

        **Client's Stated Challenge:** "${userChallenge}"

        **Your Task:** Generate a brief with the following sections:

        ### 1. Problem Reframing: The Underlying Opportunity
        Reinterpret the client's problem from a human-centered design and business value perspective. What is the deeper issue at play?

        ### 2. Potential Design Levers
        Suggest 3-4 high-level, strategic design solutions or areas of focus. These are not specific features, but approaches. Examples: "Holistic Workflow Simplification," "Data-Driven Decision Support," "Scalable Design System Implementation," "Mobile-First Field Enablement."

        ### 3. Key Metrics for Success (KPIs)
        List measurable indicators that would prove the project's success and ROI. Tie them to business outcomes. Examples: "Reduction in Time-on-Task," "Increase in User Adoption Rate," "Decrease in Critical Errors," "Improved Customer Satisfaction (CSAT) Score."

        ### 4. Critical Questions to Explore
        Pose 3-4 thought-provoking questions that demonstrate deep thinking and would be the basis for a follow-up discovery call. These questions should uncover context, constraints, and strategic goals.
    `;

    try {
        let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };
        const apiKey = ""; // API key will be handled by the environment
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('API request failed with status ' + response.status);
        }

        const result = await response.json();
        
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            
            const text = result.candidates[0].content.parts[0].text;
            
            // Basic markdown to HTML conversion
            let htmlContent = text
                .replace(/### (.*)/g, '<h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">$1</h3>')
                .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>')
                .replace(/<br><br>/g, '<br>')
                .replace(/\* (.*)/g, '<ul class="list-disc list-inside space-y-2"><li>$1</li></ul>')
                .replace(/<\/ul><br><ul/g, '<ul');

            briefResult.innerHTML = htmlContent;
            briefResult.style.display = 'block';
        } else {
            throw new Error("Invalid response structure from API.");
        }

    } catch (error) {
        console.error("Error generating brief:", error);
        briefError.style.display = 'block';
    } finally {
        briefLoading.style.display = 'none';
        generateButton.disabled = false;
        generateButton.classList.remove('opacity-50', 'cursor-not-allowed');
    }
});

// Dark mode toggle
const darkToggle = document.getElementById('dark-toggle');
const htmlEl = document.documentElement;

function setDarkMode(enabled) {
    if (enabled) {
        htmlEl.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        htmlEl.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
}

if (darkToggle) {
    darkToggle.addEventListener('click', () => {
        const isDark = htmlEl.classList.contains('dark');
        setDarkMode(!isDark);
    });
}

// On page load, set theme from localStorage
if (localStorage.getItem('theme') === 'dark') {
    htmlEl.classList.add('dark');
} else if (localStorage.getItem('theme') === 'light') {
    htmlEl.classList.remove('dark');
} 