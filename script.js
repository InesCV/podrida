document.getElementById('setPlayers').addEventListener('click', function() {
  const numPlayers = parseInt(document.getElementById('numPlayers').value);
  const playerInputs = document.getElementById('playerInputs');
  playerInputs.innerHTML = '';

  for (let i = 1; i <= numPlayers; i++) {
      playerInputs.innerHTML += `<input type="text" placeholder="Nombre del Jugador ${i}" class="playerName">`;
  }

  document.getElementById('playerNamesContainer').classList.remove('hidden');
});

document.getElementById('startGame').addEventListener('click', function() {
  const playerNames = Array.from(document.querySelectorAll('.playerName')).map(input => input.value);
  const totalPoints = Array(playerNames.length).fill(0);
  const bazaHistory = [];

  document.getElementById('playerNamesContainer').classList.add('hidden');
  document.getElementById('gameContainer').classList.remove('hidden');

  const totalPointsContainer = document.getElementById('totalPointsContainer');
  totalPointsContainer.innerHTML = `<h3>Puntos Totales</h3>${playerNames.map((name, index) => `<p>${name}: <span id="points-${index}">0</span></p>`).join('')}`;

  document.getElementById('addBaza').addEventListener('click', function() {
    const bazaPoints = parseInt(document.getElementById('bazaPoints').value);
    const numBazas = parseInt(document.getElementById('bazas').value);
    
    if (!isNaN(bazaPoints) && !isNaN(numBazas)) {
        bazaHistory.push(bazaPoints);
        const playerIndex = bazaHistory.length % totalPoints.length;
        totalPoints[playerIndex] += bazaPoints;

        // Update the displayed points for each player
        totalPoints.forEach((points, index) => {
            document.getElementById(`points-${index}`).innerText = points;
        });

        // Clear the input fields
        document.getElementById('bazaPoints').value = 0;
        document.getElementById('bazas').value = 0;
    }
});
});

let totalPoints = [0, 0]; // Array para almacenar puntos de cada jugador

function updatePoints(playerIndex, operation) {
    const basePoints = 10; // Puntos iniciales por cumplir la baza
    const additionalPoints = 3; // Puntos por cada baza adicional

    if (operation === 1) {
        totalPoints[playerIndex] += (totalPoints[playerIndex] === 0) ? basePoints : additionalPoints;
    } else if (operation === -1) {
        totalPoints[playerIndex] -= additionalPoints;
    }

    // Actualiza la visualización de puntos
    document.getElementById(`points-${playerIndex}`).innerText = totalPoints[playerIndex];
}