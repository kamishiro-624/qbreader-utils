// If the packet search returns 404 just skip the question and it should work
// Toggle the bot off and on to fix most problems. (works in multiplayer rooms only)

let runBot = false;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)); // sleep

function answerQuestion(answer) {
  answer = answer.toLowerCase();

  if (answer.includes("prompt")) {
    const firstOcc = answer.indexOf("prompt");
    answer = answer.substring(0,firstOcc);
  }

  document.getElementById("buzz").click();
  document.getElementById("answer-input").value = answer;
  document.getElementById("answer-submit").click();
  document.getElementById("next").click();
}

/*
async function showError(error) {
  const errorMsg = document.createElement('div');
  const targetArea = document.getElementById('settings');
    errorMsg.textContent = "Could not fetch packet data; try re-enabling bot on the next question.";
    errorMsg.color = "E0E0E0";
  targetArea.prepend(errorMsg);
}
*/

async function getPacket() {
  const SET_NAME = document.getElementById("set-name-info").textContent;
  const PACKET_NUMBER = document.getElementById("packet-number-info").textContent;

  // console.log("SET_NAME: " + SET_NAME);
  // console.log("PACKET_NUMBER: " + Number(PACKET_NUMBER.trim()));
  // console.log("QUESTION_NUMBER: " + QUESTION_NUMBER);

  const params = new URLSearchParams({
    setName: SET_NAME,
    packetNumber: Number(PACKET_NUMBER.trim()),
    questionTypes: ["tossups"]
  });

  try {
    const response = await fetch(`https://www.qbreader.org/api/packet?${params}`);

    if (!response.ok) {
      if (response.status === 404) {
        console.log("!!! IMPORTANT !!!\nCould not find packet; try skipping to next question and re-enabling the bot!");
        // showError();
      }
      throw new Error(`HTTP error with a status of: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}

async function main() {
  const QUESTION_NUMBER = document.getElementById("question-number-info").textContent;
  const packetObject = await getPacket();
  // console.log("Successfully fetched packet data:", packetObject);

  const tossupArray = packetObject.tossups;
  const targetIndex = Number(QUESTION_NUMBER.trim()) - 1;

  const answer = tossupArray[targetIndex].answer_sanitized;
  const questionLength = tossupArray[targetIndex].question_sanitized.length

  let readingQuestion = document.getElementById("question").textContent;
  let wordsLeft = questionLength - readingQuestion.length;

  // console.log("reading: " + readingQuestion);

  while ((wordsLeft / questionLength) > 0.95) {
    await sleep(50); // no crashy

    readingQuestion = document.getElementById("question").textContent;
    wordsLeft = questionLength - readingQuestion.length;

    // console.log("readingQ: " + readingQuestion);
    // console.log("wordsLeft: " + wordsLeft);
    // console.log("celerity: " + wordsLeft / questionLength);

    // console.log("DONT BUZZ!");
  }

  // console.log("BUZZ!");
  answerQuestion(answer);
}
async function startBot() {
  while (runBot) {
    await main();
    await sleep(1000); // lil delay in case
  }
}

// UI

const targetArea = document.getElementById('settings'); 
const toggleBtn = document.createElement('button');
  toggleBtn.innerText = 'Enable Bot';
  toggleBtn.style.padding = '10px 20px';
  toggleBtn.style.display = 'block';
  toggleBtn.style.margin = '0 auto';
  toggleBtn.style.marginBottom = '5px';
  toggleBtn.style.backgroundColor = "#343a40";
  toggleBtn.style.color = "#E0E0E0";
  toggleBtn.style.border = "2px solid #6c757d";
  // toggleBtn.style.borderColor = "#6c757d";
targetArea.prepend(toggleBtn);

toggleBtn.addEventListener('click', () => {
  if (toggleBtn.textContent === 'Enable Bot') {
    toggleBtn.textContent = 'Disable Bot';
    runBot = true;
    console.log("Bot Started - Script by kamishiro-624 <3");
    startBot();
  } else {
    toggleBtn.textContent = 'Enable Bot';
    runBot = false;
    console.log("Bot Stopped");
    startBot();
  }
});

toggleBtn.addEventListener("mouseenter", () => {
  toggleBtn.style.backgroundColor = "#646e79";
});

toggleBtn.addEventListener("mouseleave", () => {
  toggleBtn.style.backgroundColor = "#343a40";
});
