let audioCtx = null;
function playStampSound() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(440, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.2);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.2);
}

const CASES = [
  {
    id: 1,
    title: "사탕과 눈물의 사건",
    tokens: [
      { text: "동생이" },
      { text: "사탕을" },
      { text: "먹고" },
      { text: "십다고", err: true, correct: "싶다고", options: ["싶다고", "십다고", "슾다고"], rule: "'바라다'의 뜻을 지닌 보조 형용사는 '싶다'로 적는 것이 맞습니다." },
      { text: "울고" },
      { text: "이써요.", err: true, correct: "있어요.", options: ["있어요.", "이써요.", "잇어요."], rule: "받침 'ㅆ' 뒤에 모음이 오면 연음되더라도 기본형 '있다'의 원형을 밝혀 적습니다." }
    ]
  },
  {
    id: 2,
    title: "빗길 미끄럼 사건",
    tokens: [
      { text: "비가" },
      { text: "와서" },
      { text: "길이" },
      { text: "정말" },
      { text: "미끄럽내요.", err: true, correct: "미끄럽네요.", options: ["미끄럽네요.", "미끄럽내요.", "미끄럽네여."], rule: "종결 어미 '-네요'는 '네'로 적어야 하며 '내'로 적는 것은 잘못입니다." }
    ]
  },
  {
    id: 3,
    title: "선생님과의 약속",
    tokens: [
      { text: "선생님을" },
      { text: "내일" },
      { text: "뵈러", err: false },
      { text: "봬요.", err: true, correct: "뵈어요.", options: ["뵈어요.", "봬요.", "뵈요."], rule: "'뵈다'에 어미 '-어요'가 붙으면 '뵈어요'가 되고, 줄여서 '봬요'로 쓸 수 있습니다. '뵈요'는 오답입니다." }
    ]
  },
  {
    id: 4,
    title: "의문의 어제 일",
    tokens: [
      { text: "어제" },
      { text: "그" },
      { text: "일은" },
      { text: "도대체" },
      { text: "어떻해", err: true, correct: "어떡해", options: ["어떡해", "어떻해", "어떡케"], rule: "'어떻게 해'가 줄어든 말은 '어떡해'입니다. '어떻해'라는 표기는 표준어가 아닙니다." },
      { text: "된" },
      { text: "거야?" }
    ]
  },
  {
    id: 5,
    title: "미완성 숙제 미스터리",
    tokens: [
      { text: "시간이" },
      { text: "부족해서" },
      { text: "숙제를" },
      { text: "다" },
      { text: "못했어여.", err: true, correct: "못했어요.", options: ["못했어요.", "못했어여.", "못헸어요."], rule: "존칭의 종결 어미는 '-요'입니다. 구어체 발음 '-여'로 표기하지 않습니다." }
    ]
  },
  {
    id: 6,
    title: "방과 후 약속",
    tokens: [
      { text: "놀이터에서" },
      { text: "이따가" },
      { text: "보자구.", err: true, correct: "보자고.", options: ["보자고.", "보자구.", "보자꼬."], rule: "청유나 연결 어미는 '-고'가 원칙이며 사투리 구어체 '-구'는 표준 맞춤법이 아닙니다." }
    ]
  },
  {
    id: 7,
    title: "수수께끼 퀴즈쇼",
    tokens: [
      { text: "수수께끼를" },
      { text: "마추면", err: true, correct: "맞히면", options: ["맞히면", "마추면", "맞추면"], rule: "답을 적중시키는 것은 '맞히다'이고, 서로 비교하거나 조각을 맞추는 것은 '맞추다'입니다." },
      { text: "선물을" },
      { text: "받습니다." }
    ]
  },
  {
    id: 8,
    title: "외출 전 단속",
    tokens: [
      { text: "외출할" },
      { text: "때는" },
      { text: "문을" },
      { text: "잠구고", err: true, correct: "잠그고", options: ["잠그고", "잠구고", "잠궈고"], rule: "기본형은 '잠그다'이므로 어간 '잠그-'에 '-고'가 붙어 '잠그고'가 표준어입니다." },
      { text: "나갑니다." }
    ]
  },
  {
    id: 9,
    title: "친구의 성격",
    tokens: [
      { text: "그" },
      { text: "친구는" },
      { text: "항상" },
      { text: "예의가" },
      { text: "바르대.", err: true, correct: "바르대.", options: ["바르대.", "바르데.", "바르대요."], rule: "남의 말을 전할 때는 '-대', 자신이 직접 경험한 것을 회상할 때는 '-데'를 씁니다." }
    ]
  },
  {
    id: 10,
    title: "마지막 시험 사건",
    tokens: [
      { text: "생각보다" },
      { text: "이번" },
      { text: "시험이" },
      { text: "쉬웠어요.", err: true, correct: "쉬웠어요.", options: ["쉬웠어요.", "쉬었어요.", "쉬웟어요."], rule: "'쉽다'의 과거형은 'ㅂ 불규칙' 활용으로 '쉬웠어요'가 맞습니다." }
    ]
  }
];

let currentCaseIdx = 0;
let solvedCases = new Set();
let activeToken = null;

const caseTitle = document.getElementById('caseTitle');
const detectiveRank = document.getElementById('detectiveRank');
const solvedCount = document.getElementById('solvedCount');
const sentenceStage = document.getElementById('sentenceStage');
const inspectSheet = document.getElementById('inspectSheet');
const sheetWord = document.getElementById('sheetWord');
const optionsGrid = document.getElementById('optionsGrid');
const ruleBox = document.getElementById('ruleBox');
const ruleText = document.getElementById('ruleText');
const btnCloseSheet = document.getElementById('btnCloseSheet');
const btnSpeak = document.getElementById('btnSpeak');
const btnPrevCase = document.getElementById('btnPrevCase');
const btnNextCase = document.getElementById('btnNextCase');

function renderCase() {
  const c = CASES[currentCaseIdx];
  caseTitle.textContent = `사건 파일 #${c.id}: ${c.title}`;
  sentenceStage.innerHTML = '';

  c.tokens.forEach((tok, idx) => {
    const span = document.createElement('span');
    span.className = 'word-token';
    span.textContent = tok.text;

    if (tok.err) {
      if (tok.isSolved) {
        span.classList.add('solved');
        span.textContent = tok.correct;
      } else {
        span.classList.add('error-token');
        span.addEventListener('click', () => openInspectSheet(tok, span));
      }
    }
    sentenceStage.appendChild(span);
  });

  updateHUD();
}

function updateHUD() {
  solvedCount.textContent = `${solvedCases.size} / ${CASES.length}`;
  if (solvedCases.size >= 8) {
    detectiveRank.textContent = "전설의 명탐정 🏆";
  } else if (solvedCases.size >= 4) {
    detectiveRank.textContent = "공식 수사관 🕵️";
  } else {
    detectiveRank.textContent = "수습 탐정 🔍";
  }
}

function openInspectSheet(tok, spanEl) {
  activeToken = { tok, spanEl };
  sheetWord.textContent = `의심 어절: ${tok.text}`;
  optionsGrid.innerHTML = '';
  ruleBox.classList.add('hidden');

  tok.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'opt-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => checkOption(opt));
    optionsGrid.appendChild(btn);
  });

  inspectSheet.classList.remove('hidden');
}

function checkOption(choice) {
  if (!activeToken) return;
  const { tok, spanEl } = activeToken;

  if (choice === tok.correct) {
    playStampSound();
    tok.isSolved = true;
    spanEl.classList.remove('error-token');
    spanEl.classList.add('solved');
    spanEl.textContent = tok.correct;

    ruleBox.classList.remove('hidden');
    ruleText.textContent = tok.rule;

    // Check if entire case solved
    const c = CASES[currentCaseIdx];
    const allDone = c.tokens.filter(t => t.err).every(t => t.isSolved);
    if (allDone) {
      solvedCases.add(currentCaseIdx);
      updateHUD();
    }
  } else {
    alert("다시 생각해보세요! 이 맞춤법은 오답입니다.");
  }
}

btnCloseSheet.addEventListener('click', () => {
  inspectSheet.classList.add('hidden');
});

btnSpeak.addEventListener('click', () => {
  if (!('speechSynthesis' in window)) {
    alert("이 브라우저는 음성 합성을 지원하지 않습니다.");
    return;
  }
  const text = Array.from(sentenceStage.children).map(c => c.textContent).join(' ');
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'ko-KR';
  utter.rate = 0.9;
  window.speechSynthesis.speak(utter);
});

btnPrevCase.addEventListener('click', () => {
  if (currentCaseIdx > 0) {
    currentCaseIdx--;
    renderCase();
  }
});

btnNextCase.addEventListener('click', () => {
  if (currentCaseIdx < CASES.length - 1) {
    currentCaseIdx++;
    renderCase();
  }
});

renderCase();
