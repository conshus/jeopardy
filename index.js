let score = 0;
function Answer (categoryId, category, answerId, answer, question, points){
  this.categoryId = categoryId;
  this.category = category;
  this.answerId = answerId;
  this.answer = answer;
  this.question = question;
  this.points = points;
  this.isCorrect = function(event) {
    console.log("click", this.answerId, event);
    console.log(this.question);
    let inputId = "input"+this.answerId;
    //if (document.getElementById(inputId).value.toLowerCase() == this.question.toLowerCase()){
    if ((document.getElementById(inputId).value.toLowerCase().search(this.question.toLowerCase()) != -1) &&  (document.getElementById(inputId).value != "") ){
      console.log("correct");
      score += this.points;
      this.showResult("correctResult");
    }else {
      console.log("not correct");
      score -= this.points;
      this.showResult("incorrectResult");
    };
    let runningScore = document.querySelector("#score");
    runningScore.innerHTML = score;
    this.toggleAnswer();
  }
  this.showAnswer = function(event) {
    console.log("click", this.answerId);
    this.toggleAnswer();
    //document.getElementById(this.answerId).style.transform="translateY(0%)";
    //document.querySelector(".questionPicker").style.display = "none";
    document.getElementById(this.answerId).style.display = "block";
  }
  this.display = function () {
    let source = document.querySelector('#gipparody-template').innerHTML;
    let template = Handlebars.compile(source);
    let html = template(this);
    document.querySelector('.gipparody').insertAdjacentHTML('beforeend',html);
    console.log(this.categoryId);
    document.getElementById(this.categoryId).addEventListener('click', this.showAnswer.bind(this));
    let submitId = "submit"+this.answerId;
    document.getElementById(submitId).addEventListener('click', this.isCorrect.bind(this));
  }
  this.showResult =function (result){
    document.getElementById("results").style.display = "block";
    document.getElementById(result).style.display = "block";
    setTimeout(function(){
      document.getElementById("results").style.display = "none";
      document.getElementById(result).style.display = "none";
      getCategories();
    }, 3000);
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
}
function displayTemplate(answerArray){
  console.log(answerArray)
  answerArray.forEach(answer => answer.display());
}
function formatAnswers(answerObject){
  //console.log(answerObject);
  if ((answerObject.value == "") || (answerObject.value == null)){
    answerObject.value = 100;
  }
  return new Answer(answerObject.category.id, answerObject.category.title, answerObject.id, answerObject.question, answerObject.answer, answerObject.value);
}
function getCategories(){
  document.querySelector('.gipparody').innerHTML = "";
  fetch("http://jservice.io/api/random?count=3")
    .then(response => response.json())
    .then(array => array.map(formatAnswers))
    .then(displayTemplate)
    //.then(array => console.log(array))
}
function getStarted(){
  if (document.getElementById("playerName").value != ""){
    document.getElementById("intro").style.display = "none";
    getCategories();
    document.getElementById("player").style.display = "block";
    document.getElementById("playerSign").textContent=document.getElementById("playerName").value;
  }
}
document.getElementById("submitUserName").addEventListener('click', getStarted);
//getStarted();
