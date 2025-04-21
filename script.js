let scores = {};
let currentRound = 0;

// Función para establecer el número de jugadores
document.getElementById('setPlayers').addEventListener('click', function() {
    const numPlayers = parseInt(document.getElementById('numPlayers').value);
    if (numPlayers >= 3 && numPlayers <= 6) {
        setupPlayerInputs(numPlayers);
        document.getElementById('playerNamesContainer').classList.remove('hidden');
    } else {
        alert("Por favor, establece un número de jugadores entre 3 y 6.");
    }
});

// Función para configurar los inputs de los nombres de los jugadores
function setupPlayerInputs(numPlayers) {
    const playerInputs = document.getElementById('playerInputs');
    playerInputs.innerHTML = ''; // Limpiar entradas anteriores

    for (let i = 1; i <= numPlayers; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Nombre del Jugador ${i}`;
        input.id = `player-${i}`;
        playerInputs.appendChild(input);
    }
    const startButton = document.createElement('button');
    startButton.innerText = 'Iniciar Juego';
    startButton.addEventListener('click', startGame);
    playerInputs.appendChild(startButton);
}

// Función para iniciar el juego
function startGame() {
    const numPlayers = parseInt(document.getElementById('numPlayers').value);
    const scoreTableHeader = document.querySelector('#scoreTable thead tr');
    const scoreTableBody = document.querySelector('#scoreTable tbody');
    const totalPointsContainer = document.getElementById('listPlayerTotalPoints');
    
    // Limpiar entradas anteriores
    scoreTableHeader.innerHTML = '<th>Ronda</th>'; // Reiniciar encabezado
    scoreTableBody.innerHTML = ''; // Limpiar cuerpo de la tabla
    scores = {}; // Reiniciar puntajes

    // Inicializar puntajes y encabezados de la tabla
    for (let i = 1; i <= numPlayers; i++) {
        const playerName = document.getElementById(`player-${i}`).value || `Jugador ${i}`;
        scores[playerName] = []; // Inicializar puntajes como un array
        const th = document.createElement('th');
        th.innerText = playerName;
        scoreTableHeader.appendChild(th);
        
        // Inicializar el total de puntos
        const totalPointsItem = document.createElement('li');
        totalPointsItem.id = `total-${playerName}`;
        totalPointsItem.innerText = `${playerName}: 0`;
        totalPointsContainer.appendChild(totalPointsItem);
    }

    // Iniciar la primera ronda
    currentRound = 0;
    updateScoreTable();
    document.getElementById('playerNamesContainer').classList.add('hidden');
    document.getElementById('scoreManager').classList.remove('hidden');
}

// Función para actualizar los puntos de un jugador en la ronda actual
function updatePoints(playerIndex, points) {
    const playerName = Object.keys(scores)[playerIndex];
    if (!scores[playerName][currentRound]) {
        scores[playerName][currentRound] = 0; // Inicializar si no existe
    }
    scores[playerName][currentRound] += points;
    updateScoreTable();
}

// Función para actualizar la tabla de puntuaciones
function updateScoreTable() {
    const scoreTableBody = document.querySelector('#scoreTable tbody');
    scoreTableBody.innerHTML = ''; // Limpiar el cuerpo de la tabla

    for (let round = 0; round <= currentRound; round++) {
        const row = document.createElement('tr');
        const roundCell = document.createElement('td');
        roundCell.innerText = `Ronda ${round + 1}`;
        row.appendChild(roundCell);

        for (const player in scores) {
            const cell = document.createElement('td');
            cell.innerText = scores[player][round] || 0; // Mostrar 0 si no hay puntos
            row.appendChild(cell);
        }
        scoreTableBody.appendChild(row);
    }
}

// Función para iniciar una nueva baza
function nextRound() {
    currentRound++;
    updateScoreTable(); // Actualiza la tabla al iniciar una nueva ronda
}

// Función para manejar la anterior baza (opcional)
document.getElementById('prevBaza').addEventListener('click', function() {
    if (currentRound > 0) {
        currentRound--;
        updateScoreTable(); // Actualiza la tabla al retroceder una ronda
    }
});