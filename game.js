const params = new URLSearchParams(window.location.search);

const level = params.get("level");

function getGameIdioms(level) {

  switch(level) {

      case "l1":
          return idioms.slice(0, 25);

      case "l2":
          return idioms.slice(25, 50);

      case "short":
          return getRandomIdioms(5);

      default:
          return idioms;
  }
}

let remainingIdioms = [], currentIdiom = null, correctOrder = [], round = 1, score = 0, gameFinished = false;
let correctList = [], wrongList = [];
let answered = false;
let totalRounds = 0;

const holes = document.querySelectorAll(".hole");
const slots = document.querySelectorAll(".slot");
const message = document.getElementById("message");
const nextBtn = document.getElementById("nextBtn");
const roundDisplay = document.getElementById("round");
const imgDisplay = document.getElementById("chengyuImg");
const scoreDisplay = document.getElementById("score");
const finalScore = document.getElementById("finalScore");

document.getElementById('backToStartBtn').addEventListener('click', function() {
    window.location.href = 'index.html'; // Redirects back to the start page
});

function initGame() {
  console.log("LEVEL:", level);
  console.log("TOTAL:", totalRounds);
  console.log(remainingIdioms);

  remainingIdioms = getGameIdioms(level);
  totalRounds = remainingIdioms.length;
  round = 1; score = 0; gameFinished = false; answered = false;
  correctList = []; wrongList = [];

  scoreDisplay.textContent = `得分: 0/${totalRounds}`;
  finalScore.style.display = "none"; finalScore.textContent = "";
  roundDisplay.textContent = ""; message.textContent = "";
  imgDisplay.style.display = "block";
  document.getElementById("holes").style.display = "flex";
  document.getElementById("slots").style.display = "flex";
  document.getElementById("reviewScreen").style.display = "none";
  nextBtn.style.display = "inline-block";

  startRound();
}

function startRound() {
  if(gameFinished) return;
  if(remainingIdioms.length===0){ endGame(); return; }

  const index = Math.floor(Math.random()*remainingIdioms.length);
  currentIdiom = remainingIdioms[index];
  correctOrder = [...currentIdiom.text];
  roundDisplay.textContent = `第${round}回`;
  message.textContent=""; answered=false;

  holes.forEach(h=>{h.innerHTML=""; h.classList.remove("filled");});
  slots.forEach(s=>{s.innerHTML="";});
  //imgDisplay.src=currentIdiom.img;    
  imgDisplay.src="imgs/" + currentIdiom.img; 
  buildBlocks();
}

function buildBlocks(){
  const chars = [...currentIdiom.text]; shuffle(chars);
  chars.forEach((char,i)=>{
    const block=document.createElement("div");
    block.className="block"; block.textContent=char; block.draggable=true;
    block.id="block"+i;
    block.addEventListener("dragstart",e=>{ if(gameFinished) return; e.dataTransfer.setData("text/plain",block.id); });
    slots[i].appendChild(block);
  });
}

holes.forEach(h=>{
  h.addEventListener("dragover",e=>{if(gameFinished) return; e.preventDefault();});
  h.addEventListener("drop",e=>{
    if(gameFinished) return; e.preventDefault();
    if(h.children.length===0){
      const id=e.dataTransfer.getData("text/plain");
      const block=document.getElementById(id);
      h.appendChild(block); h.classList.add("filled");
      checkAnswer();
    }
  });
});

function checkAnswer(){
  let filled=true, playerOrder=[];
  holes.forEach(h=>{
    if(h.children.length===0) filled=false;
    else playerOrder.push(h.children[0].textContent);
  });
  if(!filled) return;

  answered=true;
  const isCorrect = JSON.stringify(playerOrder)===JSON.stringify(correctOrder);
  slots.forEach(s=>[...s.children].forEach(c=>c.draggable=false));
  holes.forEach(h=>[...h.children].forEach(c=>c.draggable=false));

  if(isCorrect){ score++; correctList.push(currentIdiom); message.textContent="對"; message.style.color="green"; }
  else { if(!wrongList.includes(currentIdiom)){
    wrongList.push(currentIdiom);
}; message.textContent="錯"; message.style.color="red"; }

  speakIdiom(currentIdiom);
  scoreDisplay.textContent=`得分: ${score}/${totalRounds}`;
}

nextBtn.addEventListener("click",()=>{
  if(gameFinished) return;

  if(!answered){ 
    if(!wrongList.includes(currentIdiom)){
      wrongList.push(currentIdiom);
  }
    message.textContent="錯（未完成）"; message.style.color="red"; 
  }

  slots.forEach(s=>[...s.children].forEach(c=>c.draggable=false));
  holes.forEach(h=>[...h.children].forEach(c=>c.draggable=false));

  answered=false;

  remainingIdioms =
  remainingIdioms.filter(i => i !== currentIdiom);

if (remainingIdioms.length === 0) {
    endGame();
    return;
}

round++;
startRound();

});

function endGame(){
  gameFinished=true;
  message.textContent="完畢"; message.style.color="blue"; roundDisplay.textContent="";
  imgDisplay.style.display="none";
  document.getElementById("holes").style.display="none";
  document.getElementById("slots").style.display="none";
  nextBtn.style.display="none";

  finalScore.textContent=`最終得分: ${score}/${totalRounds}`;
  finalScore.style.display="block";
  buildReview();
  document.getElementById("reviewScreen").style.display="block";
}

/* REVIEW & CARDS */
let currentCardList=[], currentCardIndex=0;

function buildReview(){
  const correctDiv=document.getElementById("correctListUI"), wrongDiv=document.getElementById("wrongListUI");
  correctDiv.innerHTML=""; wrongDiv.innerHTML="";

  correctList.forEach((item,index)=>{
    const el=document.createElement("div"); el.textContent=item.text;
    el.onclick=()=>openCard(correctList,index);
    correctDiv.appendChild(el);
  });
  wrongList.forEach((item,index)=>{
    const el=document.createElement("div"); el.textContent=item.text;
    el.onclick=()=>openCard(wrongList,index);
    wrongDiv.appendChild(el);
  });
}

function openCard(list,index){
  currentCardList=list; currentCardIndex=index;
  document.getElementById("cardOverlay").style.display="flex";
  updateCard();
}

function updateCard(){
  const item=currentCardList[currentCardIndex];
  document.getElementById("cardImg").src= "imgs/" + item.img;  
  document.getElementById("cardText").innerHTML=`<b>${item.text}</b><br>解釋: ${item.def}<br>例句: ${item.ex}`;
}

function nextCard(){ currentCardIndex=(currentCardIndex+1)%currentCardList.length; updateCard(); }
function prevCard(){ currentCardIndex=(currentCardIndex-1+currentCardList.length)%currentCardList.length; updateCard(); }
document.getElementById("cardOverlay").onclick=(e)=>{ if(e.target.id==="cardOverlay") e.currentTarget.style.display="none"; }

function shuffle(array){ for(let i=array.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [array[i],array[j]]=[array[j],array[i]]; } }

function getRandomIdioms(count){

  const shuffled = [...idioms];

  shuffle(shuffled);

  return shuffled.slice(0, count);
}

function speakIdiom(idiom){
  if('speechSynthesis' in window){
    const utter=new SpeechSynthesisUtterance(idiom.text);
    utter.lang='zh-CN';
    utter.rate=0.9; utter.pitch=1.2;
    window.speechSynthesis.speak(utter);
  }
}

initGame();