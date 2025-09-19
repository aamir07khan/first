document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const gridContainer = document.getElementById('grid-container');
    const codeEditor = document.getElementById('code-editor');
    const runButton = document.getElementById('run-button');
    const instructionsPanel = document.getElementById('instructions-panel');
    const errorMessageDiv = document.getElementById('error-message');

    // --- Game State ---
    let currentLevelIndex = 0;
    let guruState = { x: 0, y: 0, dir: 0 }; // dir: 0:R, 1:D, 2:L, 3:U
    let commandQueue = [];
    let isExecuting = false;

    // --- Level Data ---
    const levels = [
        {
            name: "Chapter 1, Level 1: The First Step",
            instructions: `<h1>Level 1: The First Step</h1>
                           <p>Welcome to CodeShala! Your goal is to guide Guru to the data crystal (💎).</p>
                           <p>Use the command <code>guru.moveForward()</code> in the editor to move Guru.</p>
                           <p>Click "Run Code" to see Guru in action!</p>`,
            grid: [
                ['S', '.', 'G']
            ],
            startCode: `guru.moveForward();\nguru.moveForward();`
        },
        {
            name: "Chapter 1, Level 2: Making a Turn",
            instructions: `<h1>Level 2: Making a Turn</h1>
                           <p>Great! Now, let's learn to turn. Use <code>guru.turnRight()</code> to change Guru's direction.</p>
                           <p>Can you navigate the corner to reach the goal?</p>`,
            grid: [
                ['S', '.', '.'],
                ['W', 'W', '.'],
                ['W', 'W', 'G']
            ],
            startCode: ``
        },
        {
            name: "Chapter 1, Level 3: Left and Right",
            instructions: `<h1>Level 3: Left and Right</h1>
                           <p>You've mastered turning right. Now use <code>guru.turnLeft()</code> to navigate this simple maze.</p>`,
            grid: [
                ['S', '.', 'W'],
                ['.', '.', '.'],
                ['W', '.', 'G']
            ],
            startCode: ``
        },
        {
            name: "Chapter 1, Level 4: A Quick Detour",
            instructions: `<h1>Level 4: A Quick Detour</h1>
                           <p>Combine your skills to navigate this path. Plan your moves carefully!</p>`,
            grid: [
                ['S', '.', 'G'],
                ['.', 'W', '.'],
                ['.', '.', '.']
            ],
            startCode: ``
        },
        {
            name: "Chapter 1, Level 5: The 'S' Bend",
            instructions: `<h1>Level 5: The 'S' Bend</h1>
                           <p>This is the final test of Chapter 1. Can you guide Guru through the S-bend?</p>`,
            grid: [
                ['S', '.', 'W', 'W'],
                ['W', '.', '.', '.'],
                ['W', 'W', '.', 'G']
            ],
            startCode: ``
        }
    ];

    // --- Guru API ---
    const guru = {
        moveForward: () => commandQueue.push({ action: 'moveForward' }),
        turnLeft: () => commandQueue.push({ action: 'turnLeft' }),
        turnRight: () => commandQueue.push({ action: 'turnRight' }),
    };

    // --- Game Logic ---
    function loadLevel(levelIndex) {
        if (levelIndex >= levels.length) {
            alert("Congratulations! You've completed all available levels!");
            return;
        }
        currentLevelIndex = levelIndex;
        const level = levels[currentLevelIndex];

        // Reset state
        const startPos = findChar(level.grid, 'S');
        guruState = { x: startPos.x, y: startPos.y, dir: 0 }; // Start facing right
        commandQueue = [];
        isExecuting = false;
        errorMessageDiv.textContent = '';

        // Update UI
        instructionsPanel.innerHTML = level.instructions;
        codeEditor.value = level.startCode || '';
        renderGrid();
    }

    function renderGrid() {
        const level = levels[currentLevelIndex];
        const grid = level.grid;
        gridContainer.innerHTML = '';
        gridContainer.style.gridTemplateColumns = `repeat(${grid[0].length}, 50px)`;
        gridContainer.style.gridTemplateRows = `repeat(${grid.length}, 50px)`;

        grid.forEach((row, y) => {
            row.forEach((cell, x) => {
                const cellDiv = document.createElement('div');
                cellDiv.className = 'grid-cell';
                if (cell === 'W') cellDiv.classList.add('wall');
                if (cell === 'S') cellDiv.classList.add('start');
                if (cell === 'G') cellDiv.classList.add('goal');
                gridContainer.appendChild(cellDiv);
            });
        });

        // Render Guru
        const guruDiv = document.createElement('div');
        guruDiv.className = 'guru';
        guruDiv.style.transform = `translate(${guruState.x * 50}px, ${guruState.y * 50}px) rotate(${guruState.dir * 90}deg)`;
        gridContainer.appendChild(guruDiv);
    }

    function runCode() {
        if (isExecuting) return;
        isExecuting = true;
        errorMessageDiv.textContent = '';
        commandQueue = [];

        // Reset Guru to start for this run
        const startPos = findChar(levels[currentLevelIndex].grid, 'S');
        guruState = { x: startPos.x, y: startPos.y, dir: 0 };
        renderGrid(); // Show Guru at start position

        const playerCode = codeEditor.value;
        try {
            const sandboxedCode = new Function('guru', playerCode);
            sandboxedCode(guru);
        } catch (e) {
            showError(`Code Error: ${e.message}`);
            isExecuting = false;
            return;
        }

        processCommandQueue();
    }

    function processCommandQueue() {
        if (commandQueue.length === 0) {
            checkWinCondition();
            isExecuting = false;
            return;
        }

        const command = commandQueue.shift();
        let success = true;

        if (command.action === 'moveForward') {
            success = handleMoveForward();
        } else if (command.action === 'turnLeft') {
            guruState.dir = (guruState.dir + 3) % 4; // +3 is equivalent to -1 for modulo
        } else if (command.action === 'turnRight') {
            guruState.dir = (guruState.dir + 1) % 4;
        }

        renderGrid();

        if (success) {
            setTimeout(processCommandQueue, 300); // Animate next command
        } else {
            isExecuting = false; // Stop execution on failure
        }
    }

    function handleMoveForward() {
        const { x, y, dir } = guruState;
        let nextX = x;
        let nextY = y;

        if (dir === 0) nextX++; // Right
        else if (dir === 1) nextY++; // Down
        else if (dir === 2) nextX--; // Left
        else if (dir === 3) nextY--; // Up

        const grid = levels[currentLevelIndex].grid;
        // Check bounds
        if (nextY < 0 || nextY >= grid.length || nextX < 0 || nextX >= grid[0].length) {
            showError("Oops! Guru went off the grid.");
            return false;
        }
        // Check walls
        if (grid[nextY][nextX] === 'W') {
            showError("Oops! Guru bumped into a wall.");
            return false;
        }

        guruState.x = nextX;
        guruState.y = nextY;
        return true;
    }

    function checkWinCondition() {
        const goalPos = findChar(levels[currentLevelIndex].grid, 'G');
        if (guruState.x === goalPos.x && guruState.y === goalPos.y) {
            setTimeout(() => {
                alert(`Level ${currentLevelIndex + 1} Complete! Well done!`);
                loadLevel(currentLevelIndex + 1);
            }, 300);
        }
    }

    function showError(message) {
        errorMessageDiv.textContent = message;
    }

    function findChar(grid, char) {
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                if (grid[y][x] === char) {
                    return { x, y };
                }
            }
        }
        return null; // Should not happen in valid levels
    }

    // --- Initial Setup ---
    runButton.addEventListener('click', runCode);
    loadLevel(0);
});
