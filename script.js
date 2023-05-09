const containerElement = document.querySelector('.container');
const boardElement = document.querySelector('.board');
const settingsElement = document.querySelector('.settings');
const countdownElement = document.querySelector('.countdown');
const resultElement = document.querySelector('.result');
const mosquitoCountElement = document.getElementById('mosquitoCount')
const timeToBeatElement = document.getElementById('timeToBeat')
const stopwatchElement = document.getElementById("stopwatch");

let bestTime;
let time;
let stoptime = false;
let level;
let mosquitoCount;
let timeToBeat;

const soundOfCatch = new Audio(src = "audio/yes.wav"); //from https://freesound.org/people/gnuoctathorpe/sounds/404868/
const soundOfWinner = new Audio(src = "audio/winner.mp3"); //from https://freesound.org/people/FunWithSound/sounds/456966/

const init = number => {
	countdownElement.innerText = '3'
	level = number;
	mosquitoCount = 10;
	stoptime = false;
	settingsElement.classList.add('hidden')
	resultElement.classList.add('hidden')
	startCountdown();
	showMosquitoCount();
	showTimeToBeat();
}

const showMosquitoCount = () => {
	mosquitoCountElement.innerText = mosquitoCount
}

const showTimeToBeat = () => {
	bestTime = localStorage.getItem('Best_time')
	if (bestTime) {
		timeToBeat = bestTime
		timeToBeatElement.innerText = timeToBeat;
	} else {
		timeToBeatElement.innerText = '--:--:--'
	}
}

const initMosquitoes = () => {
	const mosquitoes = [];

	for (let i = 0; i < 10; i++) {
		const mosquito = document.createElement('div');
		mosquito.className = 'mosquito';
		containerElement.appendChild(mosquito);

		const xPos = Math.floor(Math.random() * window.innerWidth);
		const yPos = Math.floor(Math.random() * window.innerHeight);
		mosquito.style.top = `${yPos}px`;
		mosquito.style.left = `${xPos}px`;

		const speed = (Math.random() * level) + 1;

		mosquitoes.push({
			element: mosquito,
			xDir: Math.random() > 0.5 ? 1 : -1,
			yDir: Math.random() > 0.5 ? 1 : -1,
			speed
		});
	}

	const moveMosquitoes = () => {
		mosquitoes.forEach(mosquito => {
			const {element, xDir, yDir, speed} = mosquito;

			let newX = parseInt(element.style.left) + xDir * speed;
			let newY = parseInt(element.style.top) + yDir * speed;

			if (newX < 0 || newX > (window.innerWidth - 10)) {
				mosquito.xDir *= -1;
				newX = parseInt(element.style.left) + mosquito.xDir * speed;
			}

			if (newY < 0 || newY > (window.innerHeight - 10)) {
				mosquito.yDir *= -1;
				newY = parseInt(element.style.top) + mosquito.yDir * speed;
			}

			element.style.top = `${newY}px`;
			element.style.left = `${newX}px`;
		})
		requestAnimationFrame(moveMosquitoes);
	};

	moveMosquitoes();
	document.addEventListener('click', (e) => removeMosquito(e))

	const removeMosquito = e => {
		const index = mosquitoes.findIndex((m) => m.element === e.target);
		if (index !== -1) {
			mosquitoes.splice(index, 1);
			e.target.remove();
			soundOfCatch.play();
			mosquitoCount--;
			mosquitoCount === 0 ? stopGame() : showMosquitoCount()
		}
	};
};

const startCountdown = () => {
	let countdownValue = 2;
	countdownElement.classList.remove('hidden');

	const countdownInterval = setInterval(() => {
		if (countdownValue > 0) {
			countdownElement.innerText = countdownValue;
			countdownValue--;
		} else {
			clearInterval(countdownInterval);
			boardElement.classList.add('hidden');
			startGame();
		}
	}, 1000);
};

const startGame = () => {
	initMosquitoes();
	countdownElement.classList.add('hidden');
	stopwatchStart()
}

const displayResult = (time, bestTime) => {
	if (!bestTime || isBetterTime(time, bestTime)) {
	  resultElement.innerText = `Your time is ${time}. That's the new best time!`;
	  localStorage.setItem('Best_time', time);
	  soundOfWinner.play();
	} else {
	  resultElement.innerText = `Your time is ${time}`;
	}
  };
  
  const isBetterTime = (time, bestTime) => {
	const bestTimeTab = bestTime.split(':').map(numStr => parseInt(numStr));
	const timeTab = time.split(':').map(numStr => parseInt(numStr));
	return (
	  timeTab[0] < bestTimeTab[0] ||
	  (timeTab[0] === bestTimeTab[0] &&
		(timeTab[1] < bestTimeTab[1] ||
		  (timeTab[1] === bestTimeTab[1] && timeTab[2] < bestTimeTab[2])
		)
	  )
	);
  };
  
  const stopGame = () => {
	stopwatchStop();
	boardElement.classList.remove('hidden');
	resultElement.classList.remove('hidden');
	settingsElement.classList.remove('hidden');
  
	const bestTime = localStorage.getItem('Best_time');
	displayResult(time, bestTime);
  };

const stopwatchStart = () => {
	let minutes = 0;
	let seconds = 0;
	let centiseconds = 0;
	const stopwatchInterval = setInterval(() => {
		if (!stoptime) {
			centiseconds++;
			if (centiseconds === 100) {
				seconds++;
				centiseconds = 0;
			}
			if (seconds === 60) {
				minutes++;
				seconds = 0;
			}
			const displayCentiseconds = centiseconds < 10 ? `0${centiseconds}` : centiseconds;
			const displaySeconds = seconds < 10 ? `0${seconds}` : seconds;
			const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;

			time = `${displayMinutes}:${displaySeconds}:${displayCentiseconds}`

			stopwatchElement.innerHTML = time;
		} else {
			clearInterval(stopwatchInterval);
		}
	}, 10);
}

const stopwatchStop = () => {
	stoptime = true;
}