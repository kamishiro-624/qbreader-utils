alert("This script does not work in the official multiplayer rooms due to setting restrictions. - kamishiro >w<");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)); // sleep
let lockingRoom = false;

function dragHandle(handleId) {
  const handle = document.getElementById(handleId);
  const track = document.getElementById('year-slider');

  const t = track.getBoundingClientRect();
  const h = handle.getBoundingClientRect();

  const targetX = t.left;
  const startX = h.left + h.width / 2;
  const y = h.top + h.height / 2;

  const opts = (x) => ({
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y,
    view: window
});

  handle.dispatchEvent(new MouseEvent('mousedown', opts(startX)));
  document.dispatchEvent(new MouseEvent('mousemove', opts(targetX)));
  document.dispatchEvent(new MouseEvent('mouseup', opts(targetX)));
}

dragHandle('min-year-handle');
dragHandle('max-year-handle');

const menu = document.querySelector('[aria-labelledby="dropdownMenu1"]');

menu.querySelectorAll('input[type="checkbox"]').forEach(cb => {
  const label = cb.closest('label');
  const isZero = cb.value === '0';

  if (isZero !== cb.checked) cb.click();
});

const skipBtn = document.getElementById("toggle-skip")
if (!skipBtn.checked) skipBtn.click();

async function lockRoom() {
    if (!lockingRoom) return;
    for (let i = 0; i < 100; i++) {
        document.getElementById("next").click();
        await sleep(10);
    }
}

// UI

const toggleLocker = document.createElement("button");
    toggleLocker.id = "toggle-locker";
    toggleLocker.innerText = 'Lock Room';

toggleLocker.style.cssText = `
  padding: 10px 20px;
  display: block;
  margin: 0 auto;
  margin-bottom: 5px;
  background-color: #343a40;
  color: #E0E0E0;
  border: 2px solid #6c757d;
`;

toggleLocker.addEventListener("mouseenter", () => {
  toggleLocker.style.backgroundColor = "#646e79";
});

toggleLocker.addEventListener("mouseleave", () => {
  toggleLocker.style.backgroundColor = "#343a40";
});

toggleLocker.addEventListener('click', async () => {
    if (toggleLocker.textContent === "Lock Room") {
        console.log("Locking Room - Script by kamishiro-624 <3");
        lockingRoom = true;

        toggleLocker.textContent = "Locking Room...";
        window.alert = function() {}; 
        await sleep(100);
        toggleLocker.textContent = "Unlock Room";

        while (lockingRoom) {
            await lockRoom();
        }
    } else if (toggleLocker.textContent === "Unlock Room") {
        lockingRoom = false;
        toggleLocker.textContent = "Lock Room";
    }
});

document.getElementById('settings').prepend(toggleLocker);