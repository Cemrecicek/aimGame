let parent = document.querySelector(".parent");
let aim = document.querySelector(".aim");
let oyunaBasla = document.querySelector(".oyunaBasla");
let skor = 0;
let width = 30;
let height = 30;
let gameTime = 60;
let gameStarted = false;

function rndDeger() {
  let coorX = Math.floor(Math.random() * (parent.offsetWidth - 30));
  let coorY = Math.floor(Math.random() * (parent.offsetHeight - 30));
  aim.style.left = `${coorX}px`;
  aim.style.top = `${coorY}px`;
}

aim.addEventListener("click", () => {
  if (gameStarted ) {
    rndDeger();
    skor++;
  }
});

oyunaBasla.addEventListener("click", () => {
  if (!gameStarted) {
    gameStarted = true;
    aim.style.display = "block";

    let time = setInterval(() => {
      gameTime--;
      document.querySelector(".gameTime").innerHTML = `Kalan Süre: ${gameTime} Saniye`;
      if (gameTime == 0) {
        clearInterval(time);
        document.querySelector(".gameTime").innerHTML = `Oyun Bitti! Skorunuz: ${skor}`;
        aim.style.display = "none";
      }
    }, 1000);

    rndDeger();
    oyunaBasla.style.display = "none";
  }
});