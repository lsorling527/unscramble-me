// nine letter words
const WORDS = [
    "ABUNDANCE", "ACCOMPANY", "ACOUSTICS", "ADJECTIVE", 
    "BEGINNING", "BUTTERFLY", "CHARACTER", "CHALLENGE", 
    "DANGEROUS", "DIFFERENT", "FREQUENCY", "HAPPINESS",
    "KNOWLEDGE", "CRANBERRY", "DANDILION", "ASTRONOMY",
    "EARTHWORM", "GRASSLAND", "HURRICANE", "CURIOSITY",
    "LANDSCAPE", "LIGHTNING", "MANGROVES", "GYROSCOPE",
    "NIGHTFALL", "METEORITE", "MOONLIGHT", "IGNITIONS",
    "SNOWSTORM", "TIDALWAVE", "SUNFLOWER", "LUMINANCE",
    "TORTOISES", "WOODLANDS", "STARLIGHT", "MAGNITUDE",
    "PULSATING", "SHOCKWAVE", "SPACESHIP", "STARGAZER",
    "BROADCAST", "BUBBLEGUM", "CHILDHOOD", "CREATURES",
    "DAREDEVIL", "EXPLOSION", "FANTASTIC", "HILARIOUS",
    "NARRATION", "PUPPETEER", "RENDERING", "ELEMENTAL",
    "HAPPYFEET", "INSIDEJOB", "ROBINHOOD", "PINOCCHIO",
    "WRESTLING", "SOMEWHERE", "FINGERTIP", "SOMMELIER"
];

let currentWord = "";
let scrambledLetters = [];
let isGameOver = false;

const slotsContainer = document.getElementById('slotsContainer');
const tilesContainer = document.getElementById('tilesContainer');
const messageEl = document.getElementById('message');
const newWordBtn = document.getElementById('newWordBtn');

// Drag and Drop Handlers
let draggedTileId = null; // why use this?

function initGame() {
    console.log(EIGHTLETWORDS.length);

    isGameOver = false;
    messageEl.textContent = "";
    document.querySelector('.game-container').classList.remove('game-over');
    
    // Pick a random word
    if (Math.random() < 0.54) {
        const randomIndex = Math.floor(Math.random() * WORDS.length);
        currentWord = WORDS[randomIndex];
    } else {
        const randomIndex = Math.floor(Math.random() * EIGHTLETWORDS.length);
        currentWord = EIGHTLETWORDS[randomIndex];
    }

    // Create slots
    slotsContainer.innerHTML = "";
    for (let i = 0; i < currentWord.length; i++) {
        const slot = document.createElement('div');
        slot.classList.add('slot');
        slot.dataset.index = i;
        
        // HTML5 Drag and Drop Events for Slots
        slot.addEventListener('dragover', handleDragOver);
        slot.addEventListener('dragleave', handleDragLeave);
        slot.addEventListener('drop', handleDrop);
        
        slotsContainer.appendChild(slot);
    }

    // Shuffle letters
    scrambledLetters = shuffleString(currentWord);

    // Create tiles
    renderTiles(tilesContainer, scrambledLetters);

    // Allow dragging back from slot to tiles container
    tilesContainer.addEventListener('dragover', (e) => e.preventDefault());
    tilesContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        if (isGameOver) return;
        const tile = document.getElementById(draggedTileId);
        if (tile) {
            tilesContainer.appendChild(tile);
            checkGameProgress();
        }
    });

    // Also allow slots to accept dropping tiles back onto other slots or swapping
    slotsContainer.addEventListener('dragover', (e) => e.preventDefault());

    // event handler for button click
    newWordBtn.addEventListener('click', initGame);
}

function shuffleString(str) {
    let arr = str.split('');
    do {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    } while (arr.join('') === str); // Ensure it's actually scrambled
    return arr;
}

function renderTiles(container, letters) {
    container.innerHTML = "";
    letters.forEach((char, index) => {
        const tile = createTileElement(char, `tile-${index}`);
        container.appendChild(tile);
    });
}

function createTileElement(char, id) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.textContent = char;
    tile.draggable = true;
    tile.id = id;

    tile.addEventListener('dragstart', handleDragStart);
    tile.addEventListener('dragend', handleDragEnd);
    return tile;
}

function handleDragStart(e) {
    if (isGameOver) return;
    draggedTileId = e.target.id;
    e.dataTransfer.setData('text/plain', e.target.id);
    // i found out why this next line is needed
    setTimeout(() => e.target.style.opacity = '0.4', 0);
}

function handleDragEnd(e) {
    e.target.style.opacity = '1';
    document.querySelectorAll('.slot').forEach(s => s.classList.remove('drag-over'));
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    if (isGameOver) return;

    const slot = e.currentTarget;
    const tile = document.getElementById(draggedTileId);

    if (!tile) return;

    // If slot already contains a tile, return it to the pool first
    if (slot.children.length > 0) {
        tilesContainer.appendChild(slot.firstElementChild);
    }

    slot.appendChild(tile);
    checkGameProgress();
}

function checkGameProgress() {
    const slots = slotsContainer.querySelectorAll('.slot');
    let formedWord = "";
    let allFilled = true;

    slots.forEach((slot, index) => {
        const tile = slot.querySelector('.tile');
        if (tile) {
            const char = tile.textContent;
            formedWord += char;
            // Check if individual position is correct
            if (char === currentWord[index]) {
                tile.classList.add('correct');
            } else {
                tile.classList.remove('correct');
            }
        } else {
            formedWord += "_";
            allFilled = false;
        }
    });

    // Check if game is over (all slots filled and correct)
    if (allFilled && formedWord === currentWord) {
        isGameOver = true;
        document.querySelector('.game-container').classList.add('game-over');
        messageEl.textContent = "🎉 Awesome! Game Over - You Win!";
        messageEl.style.color = "var(--win-color)";
        
        // Disable dragging after win
        document.querySelectorAll('.tile').forEach(t => t.draggable = false);
    } else {
        messageEl.textContent = "";
    }
}

// Initialize the first game on load
initGame();