document.addEventListener('DOMContentLoaded', () => {
    // --- Data for the wheels ---
    const nflTeams = {
        "Arizona Cardinals": { primary: '#9B2743', secondary: '#000000' },
        "Atlanta Falcons": { primary: '#A71930', secondary: '#000000' },
        "Baltimore Ravens": { primary: '#241773', secondary: '#000000' },
        "Buffalo Bills": { primary: '#00338D', secondary: '#C60C30' },
        "Carolina Panthers": { primary: '#0085CA', secondary: '#101820' },
        "Chicago Bears": { primary: '#0B162A', secondary: '#C83803' },
        "Cincinnati Bengals": { primary: '#FB4F14', secondary: '#000000' },
        "Cleveland Browns": { primary: '#311D00', secondary: '#FF3C00' },
        "Dallas Cowboys": { primary: '#041E42', secondary: '#869397' },
        "Denver Broncos": { primary: '#FB4F14', secondary: '#002244' },
        "Detroit Lions": { primary: '#0076B6', secondary: '#B0B7BC' },
        "Green Bay Packers": { primary: '#203731', secondary: '#FFB612' },
        "Houston Texans": { primary: '#03203F', secondary: '#A71930' },
        "Indianapolis Colts": { primary: '#002C5F', secondary: '#A2AAAD' },
        "Jacksonville Jaguars": { primary: '#006778', secondary: '#9F792C' },
        "Kansas City Chiefs": { primary: '#E31837', secondary: '#FFB81C' },
        "Las Vegas Raiders": { primary: '#000000', secondary: '#A5ACAF' },
        "Los Angeles Chargers": { primary: '#0080C6', secondary: '#FFC20E' },
        "Los Angeles Rams": { primary: '#003594', secondary: '#FFD100' },
        "Miami Dolphins": { primary: '#008E97', secondary: '#FC4C02' },
        "Minnesota Vikings": { primary: '#4F2683', secondary: '#FFC62F' },
        "New England Patriots": { primary: '#002244', secondary: '#C60C30' },
        "New Orleans Saints": { primary: '#D3BC8D', secondary: '#162431' },
        "New York Giants": { primary: '#0D2266', secondary: '#A71930' },
        "New York Jets": { primary: '#125740', secondary: '#000000' },
        "Philadelphia Eagles": { primary: '#004C54', secondary: '#A5ACAF' },
        "Pittsburgh Steelers": { primary: '#FFB612', secondary: '#000000' },
        "San Francisco 49ers": { primary: '#AA0000', secondary: '#B3995D' },
        "Seattle Seahawks": { primary: '#002244', secondary: '#69BE28' },
        "Tampa Bay Buccaneers": { primary: '#A71930', secondary: '#34302B' },
        "Tennessee Titans": { primary: '#0C2340', secondary: '#4B92DB' },
        "Washington Commanders": { primary: '#5A1414', secondary: '#FFB612' }
    };

    const usStates = [
        "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
        "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
        "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
        "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
        "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
        "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
        "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
    ];

    // Keep track of the current lists and the original data
    let currentTeams = Object.keys(nflTeams);
    let currentStates = [...usStates];
    const originalTeams = { ...nflTeams };
    const originalStates = [...usStates];

    // Variables to store the last spun result
    let lastSpunTeam = null;
    let lastSpunState = null;
    let isSpinning = false; // Add a flag to prevent multiple spins at once

    // Get all the elements from the DOM
    const teamDisplay = document.getElementById('team-display');
    const stateDisplay = document.getElementById('state-display');
    const teamResult = document.getElementById('team-result');
    const stateResult = document.getElementById('state-result');
    const directionArrow = document.getElementById('direction-arrow');
    const arrowResult = document.getElementById('arrow-result');

    const moveCombinationBtn = document.getElementById('move-combination-btn');
    const restoreWheelsBtn = document.getElementById('restore-wheels-btn');
    const deleteCombinationsBtn = document.getElementById('delete-combinations-btn');
    const pickedList = document.getElementById('picked-list');
    
    // Get all the buttons by their IDs
    const spinTeamBtn = document.getElementById('spin-team-btn');
    const quickSpinTeamBtn = document.getElementById('quick-spin-team-btn');
    const spinStateBtn = document.getElementById('spin-state-btn');
    const quickSpinStateBtn = document.getElementById('quick-spin-state-btn');
    const spinArrowBtn = document.getElementById('spin-arrow-btn');
    const quickSpinArrowBtn = document.getElementById('quick-spin-arrow-btn');
    const spinAllBtn = document.getElementById('spin-all-btn');
    const generateAllCombinationsBtn = document.getElementById('generate-all-combinations-btn');

    // Function to shuffle an array randomly
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // A single function to disable/enable all main buttons
    function setButtonsDisabled(disabled) {
        const buttons = [
            spinTeamBtn, quickSpinTeamBtn, spinStateBtn, quickSpinStateBtn,
            spinArrowBtn, quickSpinArrowBtn, spinAllBtn, generateAllCombinationsBtn,
            moveCombinationBtn, restoreWheelsBtn, deleteCombinationsBtn
        ];
        buttons.forEach(btn => {
            // Only disable if the condition is met
            if (disabled) {
                btn.disabled = true;
            } else {
                // For enabling, check if the move button should stay disabled
                if (btn.id === 'move-combination-btn' && (!lastSpunTeam || !lastSpunState)) {
                    btn.disabled = true;
                } else {
                    btn.disabled = false;
                }
            }
        });
    }

    // SpinText function with customizable duration
    function spinText(display, items, resultDisplay, isTeamWheel, spinDuration = 5000) {
        if (isSpinning) return;
        isSpinning = true;
        setButtonsDisabled(true);
        
        resultDisplay.textContent = 'Spinning...';
        
        const listToSpin = isTeamWheel ? currentTeams : currentStates;
        
        if (listToSpin.length === 0) {
            display.textContent = isTeamWheel ? 'No more teams!' : 'No more states!';
            display.style.backgroundColor = '#333';
            display.style.color = 'var(--text-color)';
            resultDisplay.textContent = 'List is empty!';
            isSpinning = false;
            setButtonsDisabled(false);
            return;
        }

        const shuffledItems = shuffleArray([...listToSpin]);
        
        // --- Logic for instant spin (duration 0) ---
        if (spinDuration === 0) {
            const winner = shuffledItems[Math.floor(Math.random() * shuffledItems.length)];
            
            if (isTeamWheel) {
                const teamColors = nflTeams[winner];
                display.style.backgroundColor = teamColors.primary;
                display.style.color = teamColors.secondary === '#000000' ? '#FFFFFF' : teamColors.secondary;
                lastSpunTeam = winner;
            } else {
                display.style.backgroundColor = '#333';
                display.style.color = 'var(--text-color)';
                lastSpunState = winner;
            }
            display.textContent = winner;
            resultDisplay.textContent = `Winner: ${winner}`;

            if (lastSpunTeam && lastSpunState) {
                moveCombinationBtn.disabled = false;
            }
            isSpinning = false;
            setButtonsDisabled(false);
            return;
        }

        // --- Logic for animated spin ---
        let currentIndex = 0;
        let speed = 50; // Milliseconds
        let startTime = Date.now();
        let animationFrameId;

        function updateDisplay() {
            const item = shuffledItems[currentIndex];
            display.textContent = item;

            if (isTeamWheel) {
                const teamColors = nflTeams[item];
                display.style.backgroundColor = teamColors.primary;
                display.style.color = teamColors.secondary === '#000000' ? '#FFFFFF' : teamColors.secondary;
            } else {
                display.style.backgroundColor = '#333';
                display.style.color = 'var(--text-color)';
            }
            
            currentIndex = (currentIndex + 1) % shuffledItems.length;
            
            const elapsedTime = Date.now() - startTime;
            if (elapsedTime < spinDuration) {
                const newSpeed = speed * (1 + (elapsedTime / 1000) * 0.5);
                animationFrameId = setTimeout(updateDisplay, newSpeed);
            } else {
                const winner = shuffledItems[Math.floor(Math.random() * shuffledItems.length)];
                
                if (isTeamWheel) {
                    const teamColors = nflTeams[winner];
                    display.style.backgroundColor = teamColors.primary;
                    display.style.color = teamColors.secondary === '#000000' ? '#FFFFFF' : teamColors.secondary;
                    lastSpunTeam = winner;
                } else {
                    display.style.backgroundColor = '#333';
                    display.style.color = 'var(--text-color)';
                    lastSpunState = winner;
                }
                
                display.textContent = winner;
                resultDisplay.textContent = `Winner: ${winner}`;

                if (lastSpunTeam && lastSpunState) {
                    moveCombinationBtn.disabled = false;
                }
                isSpinning = false;
                setButtonsDisabled(false);
            }
        }
        
        updateDisplay();
    }
    
    // FIX: Spinning logic for the 360-degree arrow with counterclockwise calculation
    function spinArrow(arrow, resultDisplay, spinDuration = 5000) {
        if (isSpinning) return;
        isSpinning = true;
        setButtonsDisabled(true);

        const randomAngleDegrees = Math.floor(Math.random() * 360); // A random angle from 0-359

        // --- Logic for instant spin (duration 0) ---
        if (spinDuration === 0) {
            arrow.style.transition = 'none'; // No transition for instant spin
            // We need to negate the angle for CSS to rotate counterclockwise from 0 (right)
            arrow.style.transform = `translate(0, -50%) rotate(${-randomAngleDegrees}deg)`;
            resultDisplay.textContent = `Direction: ${randomAngleDegrees}°`;
            isSpinning = false;
            setButtonsDisabled(false);
            return;
        }

        // --- Logic for animated spin ---
        resultDisplay.textContent = 'Spinning...';
        
        const randomRotations = Math.floor(Math.random() * 5) + 5;
        // The final rotation is the number of full rotations plus the final random angle.
        // We negate the angle because CSS rotation is clockwise by default.
        const finalRotation = randomRotations * 360 + randomAngleDegrees;

        arrow.style.transition = `transform ${spinDuration / 1000}s cubic-bezier(0.2, 0.8, 0.4, 1.0)`;
        arrow.style.transform = `translate(0, -50%) rotate(${-finalRotation}deg)`; // Apply the negative rotation

        setTimeout(() => {
            resultDisplay.textContent = `Direction: ${randomAngleDegrees}°`;
            arrow.style.transition = 'none'; // Reset transition after spin
            isSpinning = false;
            setButtonsDisabled(false);
        }, spinDuration);
    }
    
    // Function to handle moving the combination
    function moveCombination() {
        if (!lastSpunTeam || !lastSpunState) {
            return;
        }

        // Remove the team and state from the current pools
        const teamIndex = currentTeams.indexOf(lastSpunTeam);
        if (teamIndex > -1) {
            currentTeams.splice(teamIndex, 1);
        }

        const stateIndex = currentStates.indexOf(lastSpunState);
        if (stateIndex > -1) {
            currentStates.splice(stateIndex, 1);
        }

        // Add the combination to the picked list
        const listItem = document.createElement('li');
        listItem.textContent = `${lastSpunTeam} - ${lastSpunState}`;
        pickedList.appendChild(listItem);

        // Reset the displays and disable the button
        teamDisplay.textContent = 'Spin to pick a team!';
        stateDisplay.textContent = 'Spin to pick a state!';
        teamResult.textContent = '';
        stateResult.textContent = '';
        teamDisplay.style.backgroundColor = '#333';
        stateDisplay.style.backgroundColor = '#333';
        
        lastSpunTeam = null;
        lastSpunState = null;
        moveCombinationBtn.disabled = true;

        if (currentTeams.length === 0) {
            teamDisplay.textContent = 'All teams picked!';
        }
        if (currentStates.length === 0) {
            stateDisplay.textContent = 'All states picked!';
        }
    }

    // Function to restore all items (does not clear list)
    function restoreWheels() {
        currentTeams = Object.keys(originalTeams);
        currentStates = [...originalStates];
        
        teamDisplay.textContent = 'Spin to pick a team!';
        stateDisplay.textContent = 'Spin to pick a state!';
        teamResult.textContent = '';
        stateResult.textContent = '';
        teamDisplay.style.backgroundColor = '#333';
        stateDisplay.style.backgroundColor = '#333';

        lastSpunTeam = null;
        lastSpunState = null;
        moveCombinationBtn.disabled = true;
        
        alert('All teams and states have been restored to the spin pool!');
    }

    // Function to delete combinations
    function deleteCombinations() {
        if (pickedList.children.length > 0 && confirm('Are you sure you want to delete all picked combinations? This cannot be undone.')) {
            pickedList.innerHTML = '';
        }
    }
    
    // Function to generate all 32 combinations at once
    function generateAllCombinations() {
        if (isSpinning) return;
        isSpinning = true;
        setButtonsDisabled(true);

        if (currentTeams.length === 0 || currentStates.length === 0) {
            alert('Cannot generate combinations. One or both lists are empty. Please restore the wheels first.');
            isSpinning = false;
            setButtonsDisabled(false);
            return;
        }
        
        const shuffledTeams = shuffleArray([...currentTeams]);
        const shuffledStates = shuffleArray([...currentStates]);
        
        pickedList.innerHTML = ''; // Clear the list first
        
        // Loop through the teams and assign a state to each
        for (let i = 0; i < shuffledTeams.length && i < shuffledStates.length; i++) {
            const team = shuffledTeams[i];
            const state = shuffledStates[i];
            
            const listItem = document.createElement('li');
            listItem.textContent = `${team} - ${state}`;
            pickedList.appendChild(listItem);
        }
        
        // Update the pools to be empty
        currentTeams = [];
        currentStates = [];
        
        // Update the displays
        teamDisplay.textContent = 'All teams picked!';
        stateDisplay.textContent = 'All states picked!';
        teamDisplay.style.backgroundColor = '#333';
        stateDisplay.style.backgroundColor = '#333';
        
        teamResult.textContent = 'All combinations generated!';
        stateResult.textContent = 'All combinations generated!';
        
        lastSpunTeam = null;
        lastSpunState = null;

        isSpinning = false;
        setButtonsDisabled(false);
    }
    
    // --- Attach event listeners to all buttons ---
    spinTeamBtn.addEventListener('click', () => spinText(teamDisplay, nflTeams, teamResult, true));
    quickSpinTeamBtn.addEventListener('click', () => spinText(teamDisplay, nflTeams, teamResult, true, 0));
    
    spinStateBtn.addEventListener('click', () => spinText(stateDisplay, usStates, stateResult, false));
    quickSpinStateBtn.addEventListener('click', () => spinText(stateDisplay, usStates, stateResult, false, 0));

    spinArrowBtn.addEventListener('click', () => spinArrow(directionArrow, arrowResult));
    quickSpinArrowBtn.addEventListener('click', () => spinArrow(directionArrow, arrowResult, 0));

    // Spin both team and state
    spinAllBtn.addEventListener('click', () => {
        spinText(teamDisplay, nflTeams, teamResult, true);
        // Add a small delay for the second spin to start after the first animation begins
        setTimeout(() => spinText(stateDisplay, usStates, stateResult, false), 100);
    });

    // Generate all combinations
    generateAllCombinationsBtn.addEventListener('click', generateAllCombinations);

    // Move and restore buttons
    moveCombinationBtn.addEventListener('click', moveCombination);
    restoreWheelsBtn.addEventListener('click', restoreWheels);
    deleteCombinationsBtn.addEventListener('click', deleteCombinations);
});