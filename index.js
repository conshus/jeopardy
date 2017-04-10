let score = 0;
let categoryIdArrays=[];
let answersArray=[];

//clear all timers start
let countdownTimerCount = 0;
let countdownTimerArray =[];
function clearAllCountdwnTimers (){
  for (i=0; i<countdownTimerArray.length; i++){
    clearInterval(countdownTimerArray[i]);
  }
}

//clear all timers end

function Answer (categoryId, category, answerId, answer, question, points){
  this.categoryId = categoryId;
  this.category = category;
  this.answerId = answerId;
  this.answer = answer;
  this.question = question;
  this.points = points;
  this.isCorrect = function(event) {
    clearAllCountdwnTimers();
    let inputId = "input"+this.answerId;
    let questionEntered = document.getElementById(inputId).value.toLowerCase();
    let questionPulled = this.question.toLowerCase();
    if (((questionEntered.search(questionPulled) != -1) || ((questionPulled.search(questionEntered) != -1) && (questionEntered.length > 1))) && (document.getElementById(inputId).value != "") ){
      score += this.points;
      this.showResult("correctResult");
    }else {
      score -= this.points;
      this.showResult("incorrectResult");
    };
    let runningScore = document.querySelector("#score");
    runningScore.innerHTML = score;
    this.toggleAnswer();
  }
  this.showAnswer = function(event) {
    getGiphy("yeah");
    getSoundEffectInfo("yay");
    getGiphy("nope");
    getSoundEffectInfo("crowd+boo");
    document.getElementById("correctAnswer").textContent = this.question;
    this.toggleAnswer();
    document.getElementById(this.answerId).style.display = "block";
    //start timer
    let countdown=30;
    let that = this; //Not sure why I had to do this to invoke isCorrect properly
    let countdownTimerIdInterval = setInterval(function(){
      countdown--;
      let countdownTimerId = that.answerId+"timer";
      if (countdown <  10){
        countdown = "0"+countdown;
      }
      document.getElementById(countdownTimerId).innerHTML=countdown;
      if (countdown == 0){
        that.isCorrect();
        clearInterval(countdownTimerIdInterval);
      }
    },1050);
    countdownTimerArray[countdownTimerCount] = countdownTimerIdInterval;
    countdownTimerCount++
    document.getElementById("thinkSong").play();
  }
  this.display = function () {
    let source = document.querySelector('#gipparody-template').innerHTML;
    let template = Handlebars.compile(source);
    let html = template(this);
    document.querySelector('.gipparody').insertAdjacentHTML('beforeend',html);
    let answerId = this.answerId+"answer";
    document.getElementById(answerId).addEventListener('click', this.showAnswer.bind(this));
    document.getElementById(this.categoryId).addEventListener('click', this.showCategoryAnswers.bind(this));
    let submitId = "submit"+this.answerId;
    document.getElementById(submitId).addEventListener('click', this.isCorrect.bind(this));
    let inputId = "input"+this.answerId;
    let that = this;
    document.getElementById(inputId).addEventListener('keypress', function (e) {
      let key = e.which || e.keyCode;
      if (key === 13) { // 13 is enter
        that.isCorrect();
      }
    });
  }
  this.showResult =function (result){
    document.getElementById("thinkSong").pause();
    document.getElementById("thinkSong").currentTime = 0;
    document.getElementById(result+"Sound").play();
    document.getElementById("results").style.display = "block";
    document.getElementById(result).style.display = "block";
    setTimeout(function(){
      document.getElementById("results").style.display = "none";
      document.getElementById(result).style.display = "none";
      document.getElementById(result+"Sound").pause();
      document.getElementById(result+"Sound").currentTime = 0;
      getCategories();
    }, 3000);
    categoryIdArrays=[];
  }
  this.toggleAnswer = function (){
    let slide = document.getElementById(this.answerId).style;
    if (slide.transform == "translateY(0%)"){
      slide.transform = "translateY(100%)";
      slide.display = "none";
    }
    else {
      slide.transform = "translateY(0%)";
      slide.display = "block";
    }
  }
  this.showCategoryAnswers = function(event){
    for (i=0; i<categoryIdArrays.length; i++){
      document.getElementById(categoryIdArrays[i]).style.display = "none";
    }
    let categoryIdQuestions = this.categoryId+"Questions";
    document.getElementById(categoryIdQuestions).style.display = "block";
  }
}
function displayTemplate(answerArray){
  console.log(answerArray)
  answerArray.forEach(answer => answer.display());
}
function formatAnswers(answerObject){
  categoryIdArrays.push(answerObject.category.id);
  return new Answer(answerObject.category.id, answerObject.category.title, answerObject.id, answerObject.question, answerObject.answer, answerObject.value);
}
function getCategoryAnswers(categoryObject){
  answersArray[categoryObject.category.id].push("this is a test");
  fetch("http://jservice.io/api/clues?category="+categoryObject.category.id+"&value=100")
    .then(response => response.json())
    .then(object => console.log(object))
}
function getCategories(){
  document.querySelector('.gipparody').innerHTML = "";
  fetch("http://jservice.io/api/random?count=3")
    .then(response => response.json())
    .then(array => array.map(formatAnswers))
    .then(displayTemplate)
}
function getStarted(){
  if (document.getElementById("playerName").value != ""){
    document.getElementById("intro").style.display = "none";
    getCategories();
    document.getElementById("player").style.display = "block";
    document.getElementById("playerSign").textContent=document.getElementById("playerName").value;
    document.getElementById("themeSong").pause();

  }
}

//Get a random Giphy for the results
function getGiphy(searchFor){
  fetch("http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag="+searchFor)
    .then(response => response.json())
    .then(object => {
      document.getElementById(searchFor).src=object.data.image_url;
    });
}

//Get a random number for sound effects of the result
function getRandomNumber(maxLimit){
  return Math.floor(Math.random() * (maxLimit));
}

//Sound effects start
function getSoundEffectPreview(soundId){
  return fetch("http://www.freesound.org/apiv2/sounds/"+soundId+"/?token=pSFga3ykFY6rmFgeYxHiHHXpSfLShJgLju6sts1H")
    .then(response => response.json())
}
function getSoundEffectInfo(soundEffect){
  let randomNumber = getRandomNumber(15);
  fetch("http://www.freesound.org/apiv2/search/text/?query="+soundEffect+"&token=pSFga3ykFY6rmFgeYxHiHHXpSfLShJgLju6sts1H")
    .then(response => response.json())
    .then(object => object.results[randomNumber].id)
    .then(getSoundEffectPreview)
    .then(object => {
      if (soundEffect == "yay"){
        correctResultSound.src = object.previews["preview-lq-mp3"]
      }
      if (soundEffect == "crowd+boo"){
        incorrectResultSound.src = object.previews["preview-lq-mp3"]
      }
    })
}
//Sound effects end

//Let's play to get started
document.getElementById("submitUserName").addEventListener('click', getStarted);
document.getElementById("playerName").addEventListener('keypress', function (e) {
  let key = e.which || e.keyCode;
  if (key === 13) { // 13 is enter
    getStarted();
  }
});
