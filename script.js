var currentUserNumber = 0;
var answers = [,,,,,,,,,,];
var inputs =  [,,,,,,,,,,];
var isFirstTest = false;

async function login() {
  // 입력된 계정과 비밀번호 가져오기
  var usernameInput = document.getElementById('username');
  var passwordInput = document.getElementById('password');
  var username = usernameInput.value;
  var password = passwordInput.value;

  // 입력된 계정과 비밀번호가 올바른지 확인 - Database 접근
  var validMember = await getData("SELECT USER_NUMBER AS num FROM USERS WHERE ID=" + '"' + username + '"' + " AND PASSWORD=" + '"' + password + '"');

  if (validMember.length > 0) {
    alert("로그인 성공!");
  } else {
    alert("로그인 실패...\nID와 비밀번호를 다시 확인해주세요.");
    return;
  }

  // value 초기화
  usernameInput.value = "";
  passwordInput.value = "";

  var userNumber = JSON.parse(validMember[0]).num;
  currentUserNumber = userNumber;

  // 다음 페이지로
  showMain(userNumber);
}
  
async function signup() {
  // 입력된 계정과 비밀번호 가져오기
  var usernameInput = document.getElementById("signupUsername");
  var passwordInput = document.getElementById("signupPassword");
  var username = usernameInput.value;
  var password = passwordInput.value;

  // 입력한 ID가 이미 존재하는지 확인 - Database 접근
  var existingMember = await getData("SELECT * FROM USERS WHERE ID=" + '"' + username + '"');

  if (existingMember.length > 0) {
    alert('이미 존재하는 ID입니다!');
    return;
  }

  // 중복되지 않는 ID라면 정보 추가  - Database 접근
  var userNumber = Number(JSON.parse(await getData("SELECT COUNT(*) AS cnt FROM USERS")).cnt) + 1;
  var check = getData("INSERT INTO USERS VALUES (" + '"' + username + '"' + ',"' +  password + '"' + ", " + userNumber + ")");
  alert("회원가입이 완료되었습니다.");
  // 입력 창 초기화
  usernameInput.value = '';
  passwordInput.value = '';

  showLogin();
}
  
function showSignup() {
  document.getElementById("loginDiv").style.display = "none";
  document.getElementById("signupDiv").style.display = "block";
  document.getElementById("signupBtn").style.display = "none";
  document.getElementById("loginBtn").style.display = "block";
}

function showLogin() {
  document.getElementById("loginDiv").style.display = "block";
  document.getElementById("signupDiv").style.display = "none";
  document.getElementById("signupBtn").style.display = "block";
  document.getElementById("loginBtn").style.display = "none";
}

function showMain(userNum) {
  document.getElementById("loginDiv").style.display = "none";
  document.getElementById("signupBtn").style.display = "none";
  document.getElementById("main").style.display = "block";

  // 시험 기록과 재시험 버튼 로딩
  addTestRecord(userNum);
  addTestAgainButton(userNum);
}

async function getData(q) {
  var url = "https://php.flare.moe/jpdb/query.php?query=" + q;
  try {
    var response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
    return 'Error';
  }
}

function addTestRecord(userNum) {
  // 우선 이전 남의 기록 지우기
  var testRecord = document.getElementById("testRecord");
  while (testRecord.firstChild) {
    testRecord.removeChild(testRecord.firstChild);
  }

  var url = "https://php.flare.moe/jpdb/query.php?query=" + "SELECT TEST_DATE AS test_date, WRONG AS wrong FROM TEST_RESULT WHERE USER_NUMBER = " + userNum + " ORDER BY TEST_DATE";

  // 시험 기록 추가 - Database 접근
  axios.get(url)
  .then(response => {
      // Process the response data
      var result = response.data;

      for (var i = 0; i < result.length; i++) {
        var element = JSON.parse(result[i]);
        var newItem = document.createElement("li");
        var textNode = document.createTextNode(element.test_date + " 誤答数 : " + element.wrong);

        newItem.appendChild(textNode);
        testRecord.appendChild(newItem);
      }
  })
  .catch(error => {
      // Handle errors
      console.error(error);
  });
}

function addTestAgainButton(userNum) {
  // 우선 이전 남의 기록 지우기
  var testAgainButton = document.getElementById("testAgain");
  while (testAgainButton.firstChild) {
    testAgainButton.removeChild(testRecord.firstChild);
  }

  // 재시험 버튼 추가 - Database 접근 
  var url = "https://php.flare.moe/jpdb/query.php?query=" + "SELECT * FROM WORDS WHERE USER_NUMBER = " + userNum + " ORDER BY NUMBER";
  axios.get(url)
      .then(response => {
        // Process the response data
        var result = response.data;

        for (var i = 0; i < result.length; i++) {
          var element = JSON.parse(result[i]);
        
          var newButton = document.createElement("button");
          var buttonText = document.createTextNode(element.TEST_DATE + " " + element.NUMBER);

          newButton.appendChild(buttonText);
          newButton.onclick = toReTest;
          testAgainButton.appendChild(newButton);
        }
      })
      .catch(error => {
          // Handle errors
          console.error(error);
      });
}

function addWord() {
  // 모든 Input 초기화
  resetWordValues();

  document.getElementById("main").style.display = "none";
  document.getElementById("addWord").style.display = "block";
}

function resetReTestValues() {
  document.getElementById("ra1").value = '';
  document.getElementById("ra2").value = '';
  document.getElementById("ra3").value = '';
  document.getElementById("ra4").value = '';
  document.getElementById("ra5").value = '';
  document.getElementById("ra6").value = '';
  document.getElementById("ra7").value = '';
  document.getElementById("ra8").value = '';
  document.getElementById("ra9").value = '';
  document.getElementById("ra10").value = '';
}

function resetFirstTestValues() {
  document.getElementById("fa1").value = '';
  document.getElementById("fa2").value = '';
  document.getElementById("fa3").value = '';
  document.getElementById("fa4").value = '';
  document.getElementById("fa5").value = '';
  document.getElementById("fa6").value = '';
  document.getElementById("fa7").value = '';
  document.getElementById("fa8").value = '';
  document.getElementById("fa9").value = '';
  document.getElementById("fa10").value = '';
}

function resetWordValues() {
  document.getElementById('hanja1').value = '';
  document.getElementById('hurigana1').value = '';
  document.getElementById('meaning1').value = '';
  document.getElementById('hanja2').value = '';
  document.getElementById('hurigana2').value = '';
  document.getElementById('meaning2').value = '';
  document.getElementById('hanja3').value = '';
  document.getElementById('hurigana3').value = '';
  document.getElementById('meaning3').value = '';
  document.getElementById('hanja4').value = '';
  document.getElementById('hurigana4').value = '';
  document.getElementById('meaning4').value = '';
  document.getElementById('hanja5').value = '';
  document.getElementById('hurigana5').value = '';
  document.getElementById('meaning5').value = '';
  document.getElementById('hanja6').value = '';
  document.getElementById('hurigana6').value = '';
  document.getElementById('meaning6').value = '';
  document.getElementById('hanja7').value = '';
  document.getElementById('hurigana7').value = '';
  document.getElementById('meaning7').value = '';
  document.getElementById('hanja8').value = '';
  document.getElementById('hurigana8').value = '';
  document.getElementById('meaning8').value = '';
  document.getElementById('hanja9').value = '';
  document.getElementById('hurigana9').value = '';
  document.getElementById('meaning9').value = '';
  document.getElementById('hanja10').value = '';
  document.getElementById('hurigana10').value = '';
  document.getElementById('meaning10').value = '';
}

// 날짜 형식 재정의 - 1
function leftPad(value) {
  if (value >= 10) {
      return value;
  }

  return `0${value}`;
}

// 날짜 형식 재정의 - 2
function toStringByFormatting(source, delimiter = '-') {
  const year = source.getFullYear();
  const month = leftPad(source.getMonth() + 1);
  const day = leftPad(source.getDate());

  return [year, month, day].join(delimiter);
}

async function sendWords() {
  // Database 접근
  var number =  Number(JSON.parse(await getData("SELECT COUNT(*) AS cnt FROM WORDS")).cnt) + 1;
  var today =  new Date();

  var cmd = 'INSERT INTO WORDS VALUES (' +
  number + ", " + currentUserNumber + ', "' + toStringByFormatting(today) + '", ' + 
  '"' + document.getElementById('hanja1').value + '", "' + document.getElementById('hurigana1').value + '", "' + document.getElementById('meaning1').value + '", ' +
  '"' + document.getElementById('hanja2').value + '", "' + document.getElementById('hurigana2').value + '", "' + document.getElementById('meaning2').value + '", ' +
  '"' + document.getElementById('hanja3').value + '", "' + document.getElementById('hurigana3').value + '", "' + document.getElementById('meaning3').value + '", ' +
  '"' + document.getElementById('hanja4').value + '", "' + document.getElementById('hurigana4').value + '", "' + document.getElementById('meaning4').value + '", ' +
  '"' + document.getElementById('hanja5').value + '", "' + document.getElementById('hurigana5').value + '", "' + document.getElementById('meaning5').value + '", ' +
  '"' + document.getElementById('hanja6').value + '", "' + document.getElementById('hurigana6').value + '", "' + document.getElementById('meaning6').value + '", ' +
  '"' + document.getElementById('hanja7').value + '", "' + document.getElementById('hurigana7').value + '", "' + document.getElementById('meaning7').value + '", ' +
  '"' + document.getElementById('hanja8').value + '", "' + document.getElementById('hurigana8').value + '", "' + document.getElementById('meaning8').value + '", ' +
  '"' + document.getElementById('hanja9').value + '", "' + document.getElementById('hurigana9').value + '", "' + document.getElementById('meaning9').value + '", ' +
  '"' + document.getElementById('hanja10').value + '", "' + document.getElementById('hurigana10').value + '", "' + document.getElementById('meaning10').value + '")';
  
  var result = await getData(cmd);
  alert(result);

  backToMain();
}

function backToMain() {
  document.getElementById("main").style.display = "block";
  document.getElementById("addWord").style.display = "none";
  document.getElementById("reTest").style.display = "none";
  document.getElementById("firstTest").style.display = "none";
}

async function toFirstTest() {
  // 초기화
  resetFirstTestValues();
  isFristTest = true;

  document.getElementById("main").style.display = "none";
  document.getElementById("firstTest").style.display = "block";
  
  // Database 접근
  var query = JSON.parse(await getData("SELECT * FROM WORDS WHERE USER_NUMBER = " + currentUserNumber + " ORDER BY NUMBER DESC LIMIT 1"));
  setQuestion(query, true);
}

async function toReTest() {
  // 초기화
  resetReTestValues();
  isFirstTest = false;

  document.getElementById("main").style.display = "none";
  document.getElementById("reTest").style.display = "block";

  // Database 접근
  var buttonText = this.innerText;
  var arr = buttonText.split(" ");
  var query = JSON.parse(await getData("SELECT * FROM WORDS WHERE USER_NUMBER = " + currentUserNumber + " AND TEST_DATE = " + '"' + arr[0] + '" AND NUMBER = ' + arr[1]));
  setQuestion(query, false);
}

function setQuestion(info, isFirst) {
  // 문제 세팅
  var version1 = getRandomInt(1, 3);
  var question1 = "";
  var arr1 = [,,];
  if (version1 === 1) {
    arr1 = questionVer1(info.WORD1_KANJI, info.WORD1_FURIGANA, info.WORD1_KOREAN);
  }
  if (version1 === 2) {
    arr1 = questionVer2(info.WORD1_KANJI, info.WORD1_FURIGANA, info.WORD1_KOREAN);
  }
  if (version1 === 3) {
    arr1 = questionVer3(info.WORD1_KANJI, info.WORD1_FURIGANA, info.WORD1_KOREAN);
  }
  question1 = arr1[0];
  answers[0] = arr1[1];

  var version2 = getRandomInt(1, 3);
  var question2 = "";
  var arr1 = [,,];
  if (version2 === 1) {
    arr2 = questionVer1(info.WORD2_KANJI, info.WORD2_FURIGANA, info.WORD2_KOREAN);
  }
  if (version2 === 2) {
    arr2 = questionVer2(info.WORD2_KANJI, info.WORD2_FURIGANA, info.WORD2_KOREAN);
  }
  if (version2 === 3) {
    arr2 = questionVer3(info.WORD2_KANJI, info.WORD2_FURIGANA, info.WORD2_KOREAN);
  }
  question2 = arr2[0];
  answers[1] = arr2[1];

  var version3 = getRandomInt(1, 3);
  var question3 = "";
  var arr3 = [,,];
  if (version3 === 1) {
    arr3 = questionVer1(info.WORD3_KANJI, info.WORD3_FURIGANA, info.WORD3_KOREAN);
  }
  if (version3 === 2) {
    arr3 = questionVer2(info.WORD3_KANJI, info.WORD3_FURIGANA, info.WORD3_KOREAN);
  }
  if (version3 === 3) {
    arr3 = questionVer3(info.WORD3_KANJI, info.WORD3_FURIGANA, info.WORD3_KOREAN);
  }
  question3 = arr3[0];
  answers[2] = arr3[1];

  var version4 = getRandomInt(1, 3);
  var question4 = "";
  var arr4 = [,,];
  if (version4 === 1) {
    arr4 = questionVer1(info.WORD4_KANJI, info.WORD4_FURIGANA, info.WORD4_KOREAN);
  }
  if (version4 === 2) {
    arr4 = questionVer2(info.WORD4_KANJI, info.WORD4_FURIGANA, info.WORD4_KOREAN);
  }
  if (version4 === 3) {
    arr4 = questionVer3(info.WORD4_KANJI, info.WORD4_FURIGANA, info.WORD4_KOREAN);
  }
  question4 = arr4[0];
  answers[3] = arr4[1];

  var version5 = getRandomInt(1, 3);
  var question5 = "";
  var arr5 = [,,];
  if (version5 === 1) {
    arr5 = questionVer1(info.WORD5_KANJI, info.WORD5_FURIGANA, info.WORD5_KOREAN);
  }
  if (version5 === 2) {
    arr5 = questionVer2(info.WORD5_KANJI, info.WORD5_FURIGANA, info.WORD5_KOREAN);
  }
  if (version5 === 3) {
    arr5 = questionVer3(info.WORD5_KANJI, info.WORD5_FURIGANA, info.WORD5_KOREAN);
  }
  question5 = arr5[0];
  answers[4] = arr5[1]; 

  var version6 = getRandomInt(1, 3);
  var question6 = "";
  var arr6 = [,,];
  if (version6 === 1) {
    arr6 = questionVer1(info.WORD6_KANJI, info.WORD6_FURIGANA, info.WORD6_KOREAN);
  }
  if (version6 === 2) {
    arr6 = questionVer2(info.WORD6_KANJI, info.WORD6_FURIGANA, info.WORD6_KOREAN);
  }
  if (version6 === 3) {
    arr6 = questionVer3(info.WORD6_KANJI, info.WORD6_FURIGANA, info.WORD6_KOREAN);
  }
  question6 = arr6[0];
  answers[5] = arr6[1];

  var version7 = getRandomInt(1, 3);
  var question7 = "";
  var arr7 = [,,];
  if (version7 === 1) {
    arr7 = questionVer1(info.WORD7_KANJI, info.WORD7_FURIGANA, info.WORD7_KOREAN);
  }
  if (version7 === 2) {
    arr7 = questionVer2(info.WORD7_KANJI, info.WORD7_FURIGANA, info.WORD7_KOREAN);
  }
  if (version7 === 3) {
    arr7 = questionVer3(info.WORD7_KANJI, info.WORD7_FURIGANA, info.WORD7_KOREAN);
  }
  question7 = arr7[0];
  answers[6] = arr7[1];

  var version8 = getRandomInt(1, 3);
  var question8 = "";
  var arr8 = [,,];
  if (version8 === 1) {
    arr8 = questionVer1(info.WORD8_KANJI, info.WORD8_FURIGANA, info.WORD8_KOREAN);
  }
  if (version8 === 2) {
    arr8 = questionVer2(info.WORD8_KANJI, info.WORD8_FURIGANA, info.WORD8_KOREAN);
  }
  if (version8 === 3) {
    arr8 = questionVer3(info.WORD8_KANJI, info.WORD8_FURIGANA, info.WORD8_KOREAN);
  }
  question8 = arr8[0];
  answers[7] = arr8[1];

  var version9 = getRandomInt(1, 3);
  var question9 = "";
  var arr9 = [,,];
  if (version9 === 1) {
    arr9 = questionVer1(info.WORD9_KANJI, info.WORD9_FURIGANA, info.WORD9_KOREAN);
  }
  if (version9 === 2) {
    arr9 = questionVer2(info.WORD9_KANJI, info.WORD9_FURIGANA, info.WORD9_KOREAN);
  }
  if (version9 === 3) {
    arr9 = questionVer3(info.WORD9_KANJI, info.WORD9_FURIGANA, info.WORD9_KOREAN);
  }
  question9 = arr9[0];
  answers[8] = arr9[1];

  var version10 = getRandomInt(1, 3);
  var question10 = "";
  var arr10 = [,,];
  if (version10 === 1) {
    arr10 = questionVer1(info.WORD10_KANJI, info.WORD10_FURIGANA, info.WORD10_KOREAN);
  }
  if (version10 === 2) {
    arr10 = questionVer2(info.WORD10_KANJI, info.WORD10_FURIGANA, info.WORD10_KOREAN);
  }
  if (version10 === 3) {
    arr10 = questionVer3(info.WORD10_KANJI, info.WORD10_FURIGANA, info.WORD10_KOREAN);
  }
  question10 = arr10[0];
  answers[9] = arr10[1];

  // 문제 띄워주기
  if (isFirst) {
    document.getElementById("fq1").innerHTML = question1;
    document.getElementById("fq2").innerHTML = question2;
    document.getElementById("fq3").innerHTML = question3;
    document.getElementById("fq4").innerHTML = question4;
    document.getElementById("fq5").innerHTML = question5;
    document.getElementById("fq6").innerHTML = question6;
    document.getElementById("fq7").innerHTML = question7;
    document.getElementById("fq8").innerHTML = question8;
    document.getElementById("fq9").innerHTML = question9;
    document.getElementById("fq10").innerHTML = question10;
  }
  else {
    document.getElementById("rq1").innerHTML = question1;
    document.getElementById("rq2").innerHTML = question2;
    document.getElementById("rq3").innerHTML = question3;
    document.getElementById("rq4").innerHTML = question4;
    document.getElementById("rq5").innerHTML = question5;
    document.getElementById("rq6").innerHTML = question6;
    document.getElementById("rq7").innerHTML = question7;
    document.getElementById("rq8").innerHTML = question8;
    document.getElementById("rq9").innerHTML = question9;
    document.getElementById("rq10").innerHTML = question10;
  }
}

async function gradeFirstTest() {
  syncInput(true);
  var wrongQuestions = checkWrongAnswers();
  var str = "誤答 : ";

  for (var i = 0; i < wrongQuestions.length - 1; i++) {
    str = str + wrongQuestions[i] +  ", ";
  }
  str = str + wrongQuestions[wrongQuestions.length - 1] + "番です。";

  if (wrongQuestions.length === 0) {
    str = "全部正解です！";
  }

  alert(str);

  // 오답 기록 업데이트 - Database 접근
  var resultNumber = Number(JSON.parse(await getData("SELECT COUNT(*) AS cnt FROM TEST_RESULT")).cnt) + 1;
  var today =  new Date();
  var query = await getData("INSERT INTO TEST_RESULT VALUES (" + resultNumber + ", " + currentUserNumber + ', "' + toStringByFormatting(today) + '", ' + wrongQuestions.length + ", " + 10 + ")");

  // 업데이트 
  addTestRecord(currentUserNumber);

  // main으로 복귀
  backToMain();
}

function gradeReTest() {
  syncInput(false);
  var wrongQuestions = checkWrongAnswers();
  var str = "誤答 : ";

  for (var i = 0; i < wrongQuestions.length - 1; i++) {
    str = str + wrongQuestions[i] +  ", ";
  }
  str = str + wrongQuestions[wrongQuestions.length - 1] + "番です。";

  if (wrongQuestions.length === 0) {
    str = "全部正解です！";
  }

  alert(str);

  backToMain();
}

function syncInput(isFirst) {
  if (isFirst) {
    inputs[0] = document.getElementById("fa1").value;
    inputs[1] = document.getElementById("fa2").value;
    inputs[2] = document.getElementById("fa3").value;
    inputs[3] = document.getElementById("fa4").value;
    inputs[4] = document.getElementById("fa5").value;
    inputs[5] = document.getElementById("fa6").value;
    inputs[6] = document.getElementById("fa7").value;
    inputs[7] = document.getElementById("fa8").value;
    inputs[8] = document.getElementById("fa9").value;
    inputs[9] = document.getElementById("fa10").value;
  }
  else {
    inputs[0] = document.getElementById("ra1").value;
    inputs[1] = document.getElementById("ra2").value;
    inputs[2] = document.getElementById("ra3").value;
    inputs[3] = document.getElementById("ra4").value;
    inputs[4] = document.getElementById("ra5").value;
    inputs[5] = document.getElementById("ra6").value;
    inputs[6] = document.getElementById("ra7").value;
    inputs[7] = document.getElementById("ra8").value;
    inputs[8] = document.getElementById("ra9").value;
    inputs[9] = document.getElementById("ra10").value;
  }
}

function checkWrongAnswers() {
  var ret = [];
  for (var i = 0; i < answers.length; i++) {
    if (answers[i] !== inputs[i]) {
      ret.push(i + 1);
    }
  }

  return ret;
}


// 단어 문제 내는 함수
function questionVer1(kanji, furigana, korean) {
  var question = '';
  var answer = '';
  var ret = [,,];

  question = "「" + kanji + "」のふりがと韓国語は？答えは/で分離して入力してください。";
  answer = furigana + "/" + korean;

  ret[0] = question;
  ret[1] = answer;
  return ret;
}

function questionVer2(kanji, furigana, korean) {
  var question = '';
  var answer = '';
  var ret = [,,];

  question = "「" + korean + "」の漢字は？"
  answer = kanji;
  
  ret[0] = question;
  ret[1] = answer;
  return ret;
}

function questionVer3(kanji, furigana, korean) {
  var question = '';
  var answer = '';
  var ret = [,,];

  question = "「" + korean + "」のふりがなは？"
  answer = furigana;

  ret[0] = question;
  ret[1] = answer;
  return ret;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
