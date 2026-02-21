document.addEventListener('DOMContentLoaded', function () {
  const hambtn = document.getElementById('hambtn');
  const mainnav = document.getElementById('mainnav');
  if(hambtn && mainnav){
    hambtn.addEventListener('click', function(){
      // Toggle a simple class to show/hide the nav (CSS should handle the rest)
      mainnav.classList.toggle('open');
    });
  }
});

/* ---------- Trivia Quiz (used only on mini-game.html) ---------- */
/* All quiz code is encapsulated under the `ValorantQuiz` namespace */
const ValorantQuiz = (function(){

  // Quiz questions
  const quizData = [
    { q: "Which role uses smokes and area denial primarily?", choices:["Duelist","Controller","Initiator","Sentinel"], a:1 },
    { q: "How many players per team in a standard match?", choices:["3","4","5","6"], a:2 },
    { q: "Which agent can resurrect teammates?", choices:["Sage","Jett","Raze","Omen"], a:0 },
    { q: "What is the highest competitive rank?", choices:["Immortal","Radiant","Diamond","Platinum"], a:1 },
    { q: "Which agent uses recon arrows?", choices:["Sova","Viper","Killjoy","Brimstone"], a:0 }
  ];

  let idx = 0;
  let score = 0;
  let elements = null;
  const nickname = localStorage.getItem('nickname') || 'Player';

  // Cache selectors once
  function cacheSelectors(){
    elements = {
      qElm: document.getElementById('question'),
      aElm: document.getElementById('answers'),
      resElm: document.getElementById('result'),
      nextBtn: document.getElementById('next'),
      restartBtn: document.getElementById('restart'),
      playerNameElm: document.getElementById('playerName')
    };
    // Initialize player name display (uses the localStorage from earlier :)
    elements.playerNameElm.textContent = `${nickname}, your current score: 0 / ${quizData.length}`;
  }

  // Load question i
  function loadQuestion(i){
    elements.resElm.textContent = '';
    elements.aElm.innerHTML = '';
    const item = quizData[i];
    elements.qElm.textContent = `${i+1}. ${item.q}`;
    item.choices.forEach((c, ci) => {
      const btn = document.createElement('button');
      btn.className = 'answer-btn';
      btn.textContent = c;
      btn.addEventListener('click', function(){ selectAnswer(ci, item.a, btn); });
      elements.aElm.appendChild(btn);
    });
  }

  // Handle answer selection
  function selectAnswer(choiceIndex, correctIndex, btn){
    const buttons = Array.from(elements.aElm.querySelectorAll('button'));
    buttons.forEach(b => b.disabled = true);
    if(choiceIndex === correctIndex){
      btn.style.borderColor = 'rgba(0,255,150,0.18)';
      elements.resElm.textContent = 'Correct!';
      score++;
    } else {
      btn.style.borderColor = 'rgba(255,80,80,0.16)';
      elements.resElm.textContent = `Incorrect — correct: ${quizData[idx].choices[correctIndex]}`;
    }
    // Update current score display
    elements.playerNameElm.textContent = `${nickname}, current score: ${score} / ${quizData.length}`;
  }

  // Wire next and restart buttons
  function wireButtons(){
    elements.nextBtn.addEventListener('click', function(){
      idx++;
      if(idx >= quizData.length){
        elements.resElm.textContent = `${nickname}, you got a score of ${score} / ${quizData.length}`;
        elements.nextBtn.disabled = true;
      } else {
        loadQuestion(idx);
      }
      // Always update score display even during quiz
      elements.playerNameElm.textContent = `${nickname}, current score: ${score} / ${quizData.length}`;
    });

    elements.restartBtn.addEventListener('click', function(){
      idx = 0; score = 0;
      elements.nextBtn.disabled = false;
      loadQuestion(0);
      elements.resElm.textContent = '';
      elements.playerNameElm.textContent = `${nickname}, your current score: 0 / ${quizData.length}`;
    });
  }

  // Public init method
  function init(){
    cacheSelectors();
    loadQuestion(0);
    wireButtons();
  }

  // Expose only init
  return { init: init };

})();