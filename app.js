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

// 국립국어원 표준 한글 맞춤법 및 표준어 규정 기반 50대 필수 사건 케이스
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
      { text: "뵈러" },
      { text: "갈게요.", err: false },
      { text: "내일" },
      { text: "봬요!", err: true, correct: "봬요!", options: ["봬요!", "뵈요!", "배요!"], rule: "'뵈다'에 어미 '-어요'가 붙으면 '뵈어요'가 되고, 준말은 '봬요'입니다. '뵈요'는 어미가 빠진 잘못된 표기입니다." }
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
      { text: "어떻해", err: true, correct: "어떡해", options: ["어떡해", "어떻해", "어떡케"], rule: "'어떻게 해'가 줄어든 말은 '어떡해'입니다. 문장 끝 종결형에서는 '어떡해'를 씁니다." },
      { text: "된" },
      { text: "건가요?" }
    ]
  },
  {
    id: 5,
    title: "감기와 회복의 비밀",
    tokens: [
      { text: "약을" },
      { text: "먹고" },
      { text: "감기가" },
      { text: "빨리" },
      { text: "낳았으면", err: true, correct: "나았으면", options: ["나았으면", "낳았으면", "낮았으면"], rule: "'병이 치료되다'는 '낫다(나아, 나았으면)'이고, '아이를 낳다'는 출산의 의미입니다." },
      { text: "좋겠어요." }
    ]
  },
  {
    id: 6,
    title: "우체국과 편지 봉투",
    tokens: [
      { text: "친구에게" },
      { text: "보낼" },
      { text: "편지를" },
      { text: "우체통에" },
      { text: "부쳤어요.", err: false },
      { text: "우표는" },
      { text: "봉투에" },
      { text: "단단히" },
      { text: "부쳤나요?", err: true, correct: "붙였나요?", options: ["붙였나요?", "부쳤나요?", "붗였나요?"], rule: "'떨어지지 않게 풀로 대다'는 '붙이다'입니다. 편지를 부치거나 힘에 부칠 때는 '부치다'를 씁니다." }
    ]
  },
  {
    id: 7,
    title: "수수께끼 퀴즈쇼",
    tokens: [
      { text: "탐정님이" },
      { text: "어려운" },
      { text: "퀴즈의" },
      { text: "정답을" },
      { text: "단번에" },
      { text: "맞췄어요!", err: true, correct: "맞혔어요!", options: ["맞혔어요!", "맞췄어요!", "맏혔어요!"], rule: "문제의 답을 옳게 대거나 표적을 적중할 때는 '맞히다'입니다. '맞추다'는 기준에 비교하거나 배열할 때 씁니다." }
    ]
  },
  {
    id: 8,
    title: "저녁 식사 준비",
    tokens: [
      { text: "어머니께서" },
      { text: "맛있는" },
      { text: "김치" },
      { text: "찌게를", err: true, correct: "찌개를", options: ["찌개를", "찌게를", "찌걔를"], rule: "'찌개'는 'ㅐ'로 적어야 표준어입니다. '찌게'는 비표준어입니다." },
      { text: "보글보글" },
      { text: "끓이셨어요." }
    ]
  },
  {
    id: 9,
    title: "깜짝 놀란 순간",
    tokens: [
      { text: "마법처럼" },
      { text: "사탕이" },
      { text: "금새", err: true, correct: "금세", options: ["금세", "금새", "금새에"], rule: "'금시에'가 줄어든 부사이므로 '금세'로 적어야 바릅니다. '금새'는 물건의 값을 뜻합니다." },
      { text: "사라져" },
      { text: "버렸어요." }
    ]
  },
  {
    id: 10,
    title: "새 신발의 행방",
    tokens: [
      { text: "그" },
      { text: "신발은" },
      { text: "내" },
      { text: "것이" },
      { text: "안이야.", err: true, correct: "아니야.", options: ["아니야.", "안이야.", "않이야."], rule: "'아니다'의 활용형은 '아니야'입니다. '안'은 부사 '아니'의 준말입니다." }
    ]
  },
  {
    id: 11,
    title: "이유 모를 끌림",
    tokens: [
      { text: "오늘따라" },
      { text: "웬지", err: true, correct: "왠지", options: ["왠지", "웬지", "왠일인지"], rule: "'왜인지'가 줄어든 말은 '왠지'뿐입니다. 그 밖의 '웬일', '웬만하면' 등은 모두 '웬'으로 적습니다." },
      { text: "좋은" },
      { text: "일이" },
      { text: "생길" },
      { text: "것" },
      { text: "같아요." }
    ]
  },
  {
    id: 12,
    title: "뜻밖의 손님",
    tokens: [
      { text: "골목길에서" },
      { text: "마주치다니" },
      { text: "이게" },
      { text: "왠일이니?", err: true, correct: "웬일이니?", options: ["웬일이니?", "왠일이니?", "웬일이냐?"], rule: "'어찌 된 일'을 뜻할 때는 관형사 '웬'을 붙여 '웬일'로 적습니다." }
    ]
  },
  {
    id: 13,
    title: "성공과 실패의 갈림길",
    tokens: [
      { text: "노력하지" },
      { text: "않으면", err: false },
      { text: "꿈을" },
      { text: "이룰" },
      { text: "수" },
      { text: "없게" },
      { text: "되요.", err: true, correct: "돼요.", options: ["돼요.", "되요.", "대요."], rule: "'되다'의 어간 '되-'에 어미 '-어'가 붙으면 '되어'가 되고, 줄여서 '돼'가 됩니다. '되요'는 불가능한 형태입니다 ('하'를 넣어 말이 안 되면 '돼')." }
    ]
  },
  {
    id: 14,
    title: "거절의 예의",
    tokens: [
      { text: "그런" },
      { text: "무리한" },
      { text: "부탁은" },
      { text: "삼가해주세요.", err: true, correct: "삼가 주세요.", options: ["삼가 주세요.", "삼가해주세요.", "삼가해 주세요."], rule: "기본형은 '삼가다'이므로 어간 '삼가-' 뒤에 '주세요'가 붙습니다. '삼가하다'는 잘못된 표현입니다." }
    ]
  },
  {
    id: 15,
    title: "청소 시간의 분투",
    tokens: [
      { text: "식사를" },
      { text: "마치고" },
      { text: "모두" },
      { text: "함께" },
      { text: "설겆이를", err: true, correct: "설거지를", options: ["설거지를", "설겆이를", "설것이를"], rule: "현대 국어에서는 원형을 밝히지 않고 소리 나는 대로 '설거지'로 적는 것이 표준어입니다." },
      { text: "도왔습니다." }
    ]
  },
  {
    id: 16,
    title: "사과의 말씀",
    tokens: [
      { text: "제가" },
      { text: "어제" },
      { text: "약속에" },
      { text: "늦어서" },
      { text: "죄송하않습니다.", err: true, correct: "죄송합니다.", options: ["죄송합니다.", "죄송하않습니다.", "죄송안합니다."], rule: "정중한 서술격 종결형은 '죄송합니다'로 적어야 합니다." }
    ]
  },
  {
    id: 17,
    title: "결제의 순간",
    tokens: [
      { text: "서점에서" },
      { text: "책값을" },
      { text: "카드로" },
      { text: "결재했어요.", err: true, correct: "결제했어요.", options: ["결제했어요.", "결재했어요.", "결졔했어요."], rule: "대금을 치르는 것은 '결제(濟)'이고, 상사에게 서류 승인을 받는 것은 '결재(裁)'입니다." }
    ]
  },
  {
    id: 18,
    title: "부장님의 도장",
    tokens: [
      { text: "팀장님이" },
      { text: "올린" },
      { text: "보고서에" },
      { text: "부장님이" },
      { text: "최종" },
      { text: "결제 서명을", err: true, correct: "결재 서명을", options: ["결재 서명을", "결제 서명을", "결재서명을"], rule: "서류를 검토하여 승인(도장 찍음)하는 행위는 '결재'입니다." },
      { text: "하셨습니다." }
    ]
  },
  {
    id: 19,
    title: "사과 껍질의 비밀",
    tokens: [
      { text: "비타민이" },
      { text: "풍부하니" },
      { text: "사과를" },
      { text: "껍질채", err: true, correct: "껍질째", options: ["껍질째", "껍질채", "껍질 채"], rule: "'그대로 전부'를 뜻하는 접미사는 '째(뿌리째, 껍질째)'입니다. '채'는 상태를 나타내는 의존명사입니다." },
      { text: "먹는" },
      { text: "것이" },
      { text: "좋아요." }
    ]
  },
  {
    id: 20,
    title: "순서의 접속",
    tokens: [
      { text: "숙제를" },
      { text: "끝냈습니다." },
      { text: "그리고 나서", err: true, correct: "그러고 나서", options: ["그러고 나서", "그리고 나서", "그리하고 나서"], rule: "'그렇게 하고 나서'의 준말이므로 '그러고 나서'가 표준어입니다. '그리고 나서'는 비표준어입니다." },
      { text: "놀이터로" },
      { text: "나갔어요." }
    ]
  },
  {
    id: 21,
    title: "머리를 받치는 도구",
    tokens: [
      { text: "잠을" },
      { text: "잘" },
      { text: "때는" },
      { text: "편안한" },
      { text: "베게가", err: true, correct: "베개가", options: ["베개가", "베게가", "배게가"], rule: "동사 '베다'에 접미사 '-개'가 붙은 말이므로 '베개'로 적는 것이 맞습니다." },
      { text: "필요해요." }
    ]
  },
  {
    id: 22,
    title: "놀라운 마술쇼",
    tokens: [
      { text: "눈앞에서" },
      { text: "동전이" },
      { text: "사라지다니" },
      { text: "참" },
      { text: "희안한", err: true, correct: "희한한", options: ["희한한", "희안한", "희한한"], rule: "드물고 기이하다는 뜻의 한자어는 '희한(稀罕)하다'입니다. '희안'은 오기입니다." },
      { text: "일이네요." }
    ]
  },
  {
    id: 23,
    title: "오뚝 서는 인형",
    tokens: [
      { text: "아무리" },
      { text: "넘어뜨려도" },
      { text: "다시" },
      { text: "일어나는" },
      { text: "오뚜기", err: true, correct: "오뚝이", options: ["오뚝이", "오뚜기", "오뜩이"], rule: "'오뚝하다'의 어간에 접미사 '-이'가 붙었으므로 어간의 원형을 밝혀 '오뚝이'로 적습니다." },
      { text: "인형입니다." }
    ]
  },
  {
    id: 24,
    title: "방 안의 난장판",
    tokens: [
      { text: "동생이" },
      { text: "장난감을" },
      { text: "방바닥에" },
      { text: "널부러뜨려", err: true, correct: "널브러뜨려", options: ["널브러뜨려", "널부러뜨려", "널브러트려"], rule: "'널브러지다'가 표준어이므로 '널브러뜨리다'로 적어야 바릅니다." },
      { text: "놓았습니다." }
    ]
  },
  {
    id: 25,
    title: "나무를 쪼는 새",
    tokens: [
      { text: "숲속에서" },
      { text: "부리로" },
      { text: "나무를" },
      { text: "쪼는" },
      { text: "딱다구리를", err: true, correct: "딱따구리를", options: ["딱따구리를", "딱다구리를", "딱따구리"], rule: "된소리 규정에 따라 '딱따구리'로 적습니다. 같은 음절이나 유사 음절이 겹치는 경우 된소리로 적습니다." },
      { text: "발견했어요." }
    ]
  },
  {
    id: 26,
    title: "아픈 친구의 얼굴",
    tokens: [
      { text: "독감에" },
      { text: "걸린" },
      { text: "친구의" },
      { text: "얼굴이" },
      { text: "눈에" },
      { text: "띄게" },
      { text: "해쓱해졌어요.", err: false },
      { text: "매우" },
      { text: "핼쑥해", err: false },
      { text: "보였습니다." }
    ]
  },
  {
    id: 27,
    title: "시간과 약속의 거리",
    tokens: [
      { text: "그를" },
      { text: "마지막으로" },
      { text: "만난" },
      { text: "지가", err: true, correct: "지가 (만난 지가)", options: ["지가", "지", "지만"], rule: "시간의 경과를 나타내는 '지'는 의존명사이므로 앞말과 띄어 써야 합니다 (만난 v 지)." },
      { text: "벌써" },
      { text: "삼" },
      { text: "년이나" },
      { text: "흘렀다." }
    ]
  },
  {
    id: 28,
    title: "학교로 가는 길",
    tokens: [
      { text: "아침마다" },
      { text: "친구들과" },
      { text: "함께" },
      { text: "걷는" },
      { text: "등교길은", err: true, correct: "등굣길은", options: ["등굣길은", "등교길은", "등굣길"], rule: "순우리말과 한자어(등교)의 결합에서 뒷말의 첫소리가 된소리로 나므로 사이시옷을 받쳐 '등굣길'로 적습니다." },
      { text: "즐겁습니다." }
    ]
  },
  {
    id: 29,
    title: "시원한 물가",
    tokens: [
      { text: "맑은" },
      { text: "송사리가" },
      { text: "헤엄치는" },
      { text: "내가에서", err: true, correct: "냇가에서", options: ["냇가에서", "내가에서", "냇가"], rule: "순우리말 결합(내+가)에서 뒷말 첫소리가 된소리[내가/낻까]로 나므로 사이시옷을 받쳐 '냇가'로 적습니다." },
      { text: "발을" },
      { text: "담갔어요." }
    ]
  },
  {
    id: 30,
    title: "자신만의 능력",
    tokens: [
      { text: "학생들은" },
      { text: "자신의" },
      { text: "잠재된" },
      { text: "소질과" },
      { text: "능력을" },
      { text: "개발해야", err: true, correct: "계발해야", options: ["계발해야", "개발해야", "계발하여야"], rule: "지능, 소질, 재능 따위를 일깨워 발전시키는 것은 '계발(啓發)'입니다. 자원이나 경제는 '개발(開發)'입니다." },
      { text: "합니다." }
    ]
  },
  {
    id: 31,
    title: "머릿결의 윤기",
    tokens: [
      { text: "할머니께서는" },
      { text: "동백꽃으로" },
      { text: "만든" },
      { text: "머리기름을", err: true, correct: "머릿기름을", options: ["머릿기름을", "머리기름을", "머릿기름"], rule: "'머리'와 '기름'이 결합하여 뒷말이 된소리[머리끼름/머릳끼름]로 나므로 사이시옷을 받쳐 '머릿기름'이 바릅니다." },
      { text: "바르셨습니다." }
    ]
  },
  {
    id: 32,
    title: "어두운 방의 도구",
    tokens: [
      { text: "헝클어진" },
      { text: "머리카락을" },
      { text: "단정하게" },
      { text: "빛으로", err: true, correct: "빗으로", options: ["빗으로", "빛으로", "빚으로"], rule: "머리를 빗는 도구는 '빗'입니다. '빛'은 광선이고, '빚'은 갚아야 할 부채입니다." },
      { text: "빗었습니다." }
    ]
  },
  {
    id: 33,
    title: "은행과 채무",
    tokens: [
      { text: "사업을" },
      { text: "위해" },
      { text: "은행에서" },
      { text: "빌린" },
      { text: "빗을", err: true, correct: "빚을", options: ["빚을", "빗을", "빛을"], rule: "남에게 갚아야 할 돈이나 은혜는 받침 'ㅈ'의 '빚'입니다." },
      { text: "모두" },
      { text: "갚았습니다." }
    ]
  },
  {
    id: 34,
    title: "유일한 희망",
    tokens: [
      { text: "지금" },
      { text: "내게" },
      { text: "남은" },
      { text: "것은" },
      { text: "너" },
      { text: "뿐이야.", err: true, correct: "너뿐이야.", options: ["너뿐이야.", "너 뿐이야.", "너뿐"], rule: "'뿐'이 체언(너) 뒤에 붙어 한정의 뜻을 나타낼 때는 조사이므로 앞말에 붙여 씁니다." }
    ]
  },
  {
    id: 35,
    title: "행동의 한계",
    tokens: [
      { text: "나는" },
      { text: "그저" },
      { text: "소리쳐" },
      { text: "웃을뿐이었다.", err: true, correct: "웃을 뿐이었다.", options: ["웃을 뿐이었다.", "웃을뿐이었다.", "웃을 뿐"], rule: "용언의 관형사형(웃을) 뒤에서 오직 그것뿐임을 나타낼 때는 의존명사이므로 띄어 씁니다." }
    ]
  },
  {
    id: 36,
    title: "대등한 비교",
    tokens: [
      { text: "동생도" },
      { text: "형" },
      { text: "만큼", err: true, correct: "형만큼", options: ["형만큼", "형 만큼", "형만큼은"], rule: "'만큼'이 체언(형) 뒤에 붙어 대등함을 나타낼 때는 조사이므로 앞말에 붙여 씁니다." },
      { text: "키가" },
      { text: "훌쩍" },
      { text: "자랐습니다." }
    ]
  },
  {
    id: 37,
    title: "노력의 대가",
    tokens: [
      { text: "땀" },
      { text: "흘려" },
      { text: "노력한만큼", err: true, correct: "노력한 만큼", options: ["노력한 만큼", "노력한만큼", "노력한 만큼은"], rule: "관형사형 어미(노력한) 뒤에 쓰인 '만큼'은 의존명사이므로 앞말과 띄어 써야 합니다." },
      { text: "좋은" },
      { text: "결과가" },
      { text: "나올" },
      { text: "것입니다." }
    ]
  },
  {
    id: 38,
    title: "피할 수 없는 길",
    tokens: [
      { text: "진실을" },
      { text: "알았으니" },
      { text: "이제" },
      { text: "신고할" },
      { text: "수밖에", err: false },
      { text: "없다.", err: false }
    ]
  },
  {
    id: 39,
    title: "방향을 가리킴",
    tokens: [
      { text: "나침반" },
      { text: "바늘이" },
      { text: "북쪽을" },
      { text: "가르치고", err: true, correct: "가리키고", options: ["가리키고", "가르치고", "갈리키고"], rule: "방향이나 대상을 손가락 따위로 지목하는 것은 '가리키다'입니다. 지식을 전달하는 것은 '가르치다'입니다." },
      { text: "있습니다." }
    ]
  },
  {
    id: 40,
    title: "교실 속 배움",
    tokens: [
      { text: "선생님께서" },
      { text: "우리에게" },
      { text: "수학을" },
      { text: "친절하게" },
      { text: "가리켜", err: true, correct: "가르쳐", options: ["가르쳐", "가리켜", "갈쳐"], rule: "지식이나 기술을 깨우치게 하는 것은 '가르치다(가르쳐)'입니다." },
      { text: "주셨습니다." }
    ]
  },
  {
    id: 41,
    title: "장마철의 폭우",
    tokens: [
      { text: "여름철" },
      { text: "세차게" },
      { text: "내리는" },
      { text: "장마비로", err: true, correct: "장맛비로", options: ["장맛비로", "장마비로", "장마비"], rule: "순우리말 '장마'와 '비'의 결합에서 된소리[장마삐/장맏삐]가 나므로 사이시옷을 받쳐 '장맛비'가 표준어입니다." },
      { text: "하천이" },
      { text: "불어났어요." }
    ]
  },
  {
    id: 42,
    title: "수학 함수의 극점",
    tokens: [
      { text: "이차함수" },
      { text: "그래프의" },
      { text: "가장" },
      { text: "높은" },
      { text: "지점인" },
      { text: "최대값을", err: true, correct: "최댓값을", options: ["최댓값을", "최대값을", "최대값"], rule: "한자어와 순우리말 결합(최대+값)에서 된소리[최대깝/최댇깝]로 발음되므로 사이시옷을 표기하여 '최댓값'으로 적습니다." },
      { text: "구하시오." }
    ]
  },
  {
    id: 43,
    title: "모임의 반복",
    tokens: [
      { text: "올해" },
      { text: "독서" },
      { text: "모임의" },
      { text: "전체" },
      { text: "회수를", err: true, correct: "횟수를", options: ["횟수를", "회수를", "회수"], rule: "한자어 중 사이시옷이 인정되는 6개 단어(곳간, 셋방, 숫자, 찻간, 툇간, 횟수) 중 하나이므로 '횟수(回數)'로 적습니다." },
      { text: "확인하세요." }
    ]
  },
  {
    id: 44,
    title: "나무의 가지",
    tokens: [
      { text: "참새가" },
      { text: "푸른" },
      { text: "나무가지에", err: true, correct: "나뭇가지에", options: ["나뭇가지에", "나무가지에", "나무가지"], rule: "'나무'와 '가지'의 결합에서 뒷말이 된소리[나무까지/나묻까치]로 발음되므로 '나뭇가지'가 맞습니다." },
      { text: "앉아" },
      { text: "노래합니다." }
    ]
  },
  {
    id: 45,
    title: "단호한 거절",
    tokens: [
      { text: "친구의" },
      { text: "거짓말에" },
      { text: "속지" },
      { text: "않기로", err: false },
      { text: "다짐했다." }
    ]
  },
  {
    id: 46,
    title: "조용한 발걸음",
    tokens: [
      { text: "아기가" },
      { text: "깰까" },
      { text: "봐" },
      { text: "숨도" },
      { text: "제대로" },
      { text: "못" },
      { text: "쉬고", err: false },
      { text: "조심조심" },
      { text: "걸었다." }
    ]
  },
  {
    id: 47,
    title: "구시렁거리는 불평",
    tokens: [
      { text: "동생은" },
      { text: "심부름이" },
      { text: "싫다며" },
      { text: "뒤에서" },
      { text: "궁시렁거렸다.", err: true, correct: "구시렁거렸다.", options: ["구시렁거렸다.", "궁시렁거렸다.", "구시렁거렷다."], rule: "불만을 품고 자꾸 혼잣말로 투덜거리는 것은 '구시렁거리다'가 표준어입니다. '궁시렁'은 비표준어입니다." }
    ]
  },
  {
    id: 48,
    title: "어물쩍 넘어가기",
    tokens: [
      { text: "잘못을" },
      { text: "했으면" },
      { text: "사과해야지" },
      { text: "어물쩡", err: true, correct: "어물쩍", options: ["어물쩍", "어물쩡", "어물적"], rule: "말이나 행동을 슬그머니 얼버무려 넘기는 모양은 '어물쩍'이 표준어입니다." },
      { text: "넘어가면" },
      { text: "안" },
      { text: "돼요." }
    ]
  },
  {
    id: 49,
    title: "단련과 닦달",
    tokens: [
      { text: "남을" },
      { text: "너무" },
      { text: "닥달하지", err: true, correct: "닦달하지", options: ["닦달하지", "닥달하지", "딱달하지"], rule: "성가시게 굴거나 단단히 윽박지르는 행위는 '닦달하다'가 맞습니다. '닥달'은 틀린 표기입니다." },
      { text: "말고" },
      { text: "여유를" },
      { text: "갖자." }
    ]
  },
  {
    id: 50,
    title: "명탐정의 최종 결론",
    tokens: [
      { text: "증거가" },
      { text: "명백히" },
      { text: "드러났으니", err: false },
      { text: "사건은" },
      { text: "해결된" },
      { text: "것이나" },
      { text: "다름없다." }
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
  if (solvedCases.size >= 40) {
    detectiveRank.textContent = "전설의 명탐정 🏆";
  } else if (solvedCases.size >= 25) {
    detectiveRank.textContent = "특급 수사관 🕵️";
  } else if (solvedCases.size >= 10) {
    detectiveRank.textContent = "선임 탐정 🔎";
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
