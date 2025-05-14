document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const toneDisplay = document.getElementById('tone-display');
    const newToneBtn = document.getElementById('new-tone-btn');
    const notationToggle = document.getElementById('notation-toggle');
    const notationLabel = document.getElementById('notation-label');
    const modeToggle = document.getElementById('mode-toggle');
    const modeLabel = document.getElementById('mode-label');
    const sessionToggle = document.getElementById('session-toggle');
    const sessionLabel = document.getElementById('session-label');
    const repeatsToggle = document.getElementById('repeats-toggle');
    const repeatsLabel = document.getElementById('repeats-label');
    const autoIntervalContainer = document.getElementById('auto-interval-container');
    const autoInterval = document.getElementById('auto-interval');
    const intervalValue = document.getElementById('interval-value');
    const timerContainer = document.getElementById('timer-container');
    const timerText = document.getElementById('timer-text');
    const timerBar = document.getElementById('timer-bar');
    const sessionProgress = document.getElementById('session-progress');
    const progressText = document.getElementById('progress-text');
    const progressBar = document.getElementById('progress-bar');
    const toggleSettings = document.getElementById('toggle-settings');
    const settingsContent = document.getElementById('settings-content');
    
    // European notation (B and H)
    const europeanTones = ['E', 'F', 'F#', 'G', 'G#', 'A', 'B', 'H', 'C', 'C#', 'D', 'D#'];
            
    // American notation (Bb and B)
    const americanTones = ['E', 'F', 'Fb', 'G', 'Ab', 'A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb'];
             
    // State variables
    let isEuropean = true;
    let isAutoMode = false;
    let isSessionMode = false;
    let allowRepeats = false;
    let currentTones = europeanTones;
    let usedTones = [];
    let sessionCount = 0;
    let timerInterval = null;
    let currentSeconds = 5;
    let settingsVisible = true;
    
    // Function to get a random tone
    function getRandomTone() {
        if (isSessionMode) {
            return getSessionTone();
        }
        
        if (!allowRepeats) {
            // If we don't allow repeats, filter out the current tone
            let availableTones = currentTones.filter(tone => tone !== toneDisplay.textContent);
            if (availableTones.length === 0) {
                // If we've used all tones, reset
                availableTones = currentTones;
            }
            const randomIndex = Math.floor(Math.random() * availableTones.length);
            return availableTones[randomIndex];
        } else {
            // If repeats are allowed, just pick any random tone
            const randomIndex = Math.floor(Math.random() * currentTones.length);
            return currentTones[randomIndex];
        }
    }
    
    // Function to get the next tone in session mode
    function getSessionTone() {
        if (sessionCount >= currentTones.length) {
            // Session complete
            sessionCount = 0;
            usedTones = [];
            
            // Show completion message
            alert('Practice session complete! All 12 tones practiced.');
        }
        
        // Get the next tone in sequence
        const nextTone = currentTones[sessionCount];
        sessionCount++;
        
        // Update progress
        updateSessionProgress();
        
        return nextTone;
    }
    
    // Update the displayed tone
    function updateTone() {
        toneDisplay.textContent = getRandomTone();
        
        // Reset timer if in auto mode
        if (isAutoMode) {
            resetTimer();
        }
    }
    
    // Toggle between European and American notation
    function toggleNotation() {
        isEuropean = !isEuropean;
        notationLabel.textContent = isEuropean ? 'European' : 'American';
        currentTones = isEuropean ? europeanTones : americanTones;
        
        // Convert the current tone if it's one of the different ones
        if (toneDisplay.textContent === 'B' && isEuropean) {
            toneDisplay.textContent = 'B'; // European B (American Bb)
        } else if (toneDisplay.textContent === 'H' && !isEuropean) {
            toneDisplay.textContent = 'B'; // American B (European H)
        } else if (toneDisplay.textContent === 'B' && !isEuropean) {
            toneDisplay.textContent = 'Bb'; // American Bb (European B)
        } else if (toneDisplay.textContent === 'Bb' && isEuropean) {
            toneDisplay.textContent = 'B'; // European B (American Bb)
        }
        
        // Reset session if active
        if (isSessionMode) {
            sessionCount = 0;
            updateSessionProgress();
        }
    }
    
    // Toggle between manual and auto mode
    function toggleMode() {
        isAutoMode = !isAutoMode;
        modeLabel.textContent = isAutoMode ? 'Auto' : 'Manual';
        
        // Show/hide auto interval settings
        autoIntervalContainer.classList.toggle('hidden', !isAutoMode);
        
        // Show/hide timer
        timerContainer.classList.toggle('hidden', !isAutoMode);
        
        // Enable/disable the new tone button
        newToneBtn.disabled = isAutoMode;
        newToneBtn.classList.toggle('opacity-50', isAutoMode);
        newToneBtn.classList.toggle('cursor-not-allowed', isAutoMode);
        
        if (isAutoMode) {
            // Start the timer
            resetTimer();
        } else {
            // Clear the timer
            clearInterval(timerInterval);
        }
    }
    
    // Toggle session mode
    function toggleSession() {
        isSessionMode = !isSessionMode;
        sessionLabel.textContent = isSessionMode ? 'On' : 'Off';
        
        // Show/hide session progress
        sessionProgress.classList.toggle('hidden', !isSessionMode);
        
        // Reset session
        sessionCount = 0;
        usedTones = [];
        
        if (isSessionMode) {
            updateSessionProgress();
            updateTone(); // Get the first tone in the session
        }
    }
    
    // Toggle allowing repeats
    function toggleRepeats() {
        allowRepeats = !allowRepeats;
        repeatsLabel.textContent = allowRepeats ? 'Yes' : 'No';
    }
    
    // Update session progress display
    function updateSessionProgress() {
        const progress = (sessionCount / currentTones.length) * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${sessionCount}/${currentTones.length}`;
    }
    
    // Reset and start the timer
    function resetTimer() {
        clearInterval(timerInterval);
        currentSeconds = parseInt(autoInterval.value);
        timerText.textContent = `${currentSeconds}s`;
        timerBar.style.width = '100%';
        
        timerInterval = setInterval(() => {
            currentSeconds--;
            timerText.textContent = `${currentSeconds}s`;
            
            // Update timer bar
            const percentage = (currentSeconds / parseInt(autoInterval.value)) * 100;
            timerBar.style.width = `${percentage}%`;
            
            if (currentSeconds <= 0) {
                updateTone();
            }
        }, 1000);
    }
    
    // Toggle settings visibility
    function toggleSettingsVisibility() {
        settingsVisible = !settingsVisible;
        settingsContent.classList.toggle('hidden', !settingsVisible);
        toggleSettings.textContent = settingsVisible ? 'Hide' : 'Show';
    }
    
    // Update interval value display
    function updateIntervalDisplay() {
        intervalValue.textContent = `${autoInterval.value}s`;
        if (isAutoMode) {
            resetTimer();
        }
    }
    
    // Event listeners
    newToneBtn.addEventListener('click', updateTone);
    notationToggle.addEventListener('change', toggleNotation);
    modeToggle.addEventListener('change', toggleMode);
    sessionToggle.addEventListener('change', toggleSession);
    repeatsToggle.addEventListener('change', toggleRepeats);
    autoInterval.addEventListener('input', updateIntervalDisplay);
    toggleSettings.addEventListener('click', toggleSettingsVisibility);
    
    // Initialize with a random tone
    updateTone();
});