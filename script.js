var backgrounds=["./assets/micky.jpg","./assets/pooh.jpeg","./assets/goofy.jpg","./assets/donaldduck.jpg"];
var overlay=document.querySelector(".overlay");
var startmodal=document.querySelector(".startmodal");
var giphymodal=document.querySelector(".giphymodal");
var questionmodal=document.querySelector(".questionmodal");
var storymodal=document.querySelector(".storymodal");
var titleDOM=document.querySelector(".title");
var questionDOM=document.querySelector(".question");
var nextBtn=document.querySelector(".nextBtn");
var questionsleft=document.querySelector(".questionsleft");


var progressBar=document.querySelector(".progressbar")
var progress=document.querySelector(".progress")

//sounds
var click=new Audio("./assets/click.wav")
var haha=new Audio("./assets/haha.wav")
var horn=new Audio("./assets/horn.wav")
var applause=new Audio("./assets/applause.wav")
var fart=new Audio("./assets/fart.wav")

var startsounds=[haha,horn,applause]
var nextsounds=[fart,click,click,click]


let gameData=[];
//blank (array) counter
let counter=0;
let usersAnswers=[];


function init(){
    questionmodal.style.display='none'
    storymodal.style.display='none'


    loadOverlayImg()
}




function loadOverlayImg(){
    overlay.innerHTML=`<img src=${backgrounds[Math.random() * backgrounds.length | 0]} class='overlayimg' alt="background_img">` 
}


 function fetchStory(){
    return new Promise(resolve=>{
    fetch('https://madlibz.herokuapp.com/api/random?minlength=5&maxlength=20')
    .then(res=>res.json())
    .then(res=>{
        // console.log(res)
        resolve(res)
        if(res.title.split(" ").length > 5){
        titleDOM.innerHTML=res.title
        titleDOM.style.fontSize="15px"
        }
        else{
            titleDOM.innerHTML=res.title

        }
        questionsleft.innerHTML=`Questions Left:${res.blanks.length}`
        progressBar.style.display='block'

    })
})
}



init()


startmodal.onclick=madLibs;
nextBtn.onclick=getAnswer;


async function madLibs(){
    startsounds[Math.random() * startsounds.length | 0].play()
    startmodal.style.display='none'
    gameData=await fetchStory();
    questionmodal.style.display='block'
    console.log(gameData)
    let blanks=gameData.blanks;

    renderQuestion(blanks[counter])

//TESTING code on answer display 
    // var dumbAnswers=[];
    // for(let i=0;i<gameData.value.length;i++){
    //     dumbAnswers.push('stupidface')
    // }
    //  printStory(dumbAnswers,gameData.value)

}

function renderQuestion(question){
    questionDOM.innerHTML=question
}


function getAnswer(){
   
    var answer=document.querySelector("input[name='answer']").value;
    let blanks=gameData.blanks;

    getGiphy(answer)

   // console.log(answer);
    usersAnswers.push(answer);
    console.log(usersAnswers)
  
    console.log(gameData)
    if(counter < gameData.blanks.length-1){
        let questionCount=questionsleft.innerHTML;
        console.log(questionCount)
        questionCount=questionCount.split(":")[1];
        console.log(questionCount)
        questionCount--;
        questionsleft.innerHTML=`Questions Left: ${questionCount}`
        counter++
        nextsounds[nextsounds.length * Math.random() | 0].play()
        setTimeout(()=>{
   renderQuestion(blanks[counter])
   document.querySelector("input[name='answer']").value=""
        },1000);
    }
    else{
        console.log("no more questions!")
        let story=gameData.value;
        story.pop()
       // giphymodal.style.display='none'
        printStory(usersAnswers,story)
        progress.style.width=`100%`

    }
    progress.style.width=`${(counter/gameData.blanks.length) * 100}%`



}



function printStory(userAnswers,story){
    console.log(usersAnswers)
    console.log(story);


    let newStory=story.map((phrase,idx)=>`${phrase} ${usersAnswers[idx]}`);

    console.log(newStory.join(" "));
    newStory=newStory.join(" ");
    readStory(newStory)
    questionmodal.style.display='none';
    storymodal.style.display='block';
    // storymodal.innerHTML=`<h4>${newStory}</h4>`;

    let storyDiv=document.createElement("div")
    
    story.forEach((phrase,idx)=>{
        let pPhrase=document.createElement('p');
        let div=document.createElement("div")
        div.className='storytext'
        div.style.display='flex'
        pPhrase.textContent=phrase;
        pPhrase.className="pword"
        let pWord=document.createElement("p");
        pWord.textContent=` ${userAnswers[idx]}`
        pWord.className='word-choice'
        pWord.className += " pword"
        console.log(pWord)
        // div.appendChild(pPhrase)
        // div.appendChild(pWord)
        div.textContent += `${pPhrase.textContent} ${pWord.textContent}`
        storyDiv.appendChild(div)
    })

     storymodal.appendChild(storyDiv)
     
}




function getGiphy(answer="dumbo"){
    let apikey="6gRm9WZ0hk8YcvjvVS4tX2HAAnV5WmgE"
    fetch(`https://api.giphy.com/v1/gifs/search?q=${answer}&api_key=${apikey}`)
    .then(res=>res.json())
    .then(res=>{
        console.log(res)
        giphymodal.innerHTML=`<img src=${res.data[res.data.length * Math.random() | 0].images.fixed_height.url} class='giphyimg' alt='img'/>`


    })
}



function readStory(story){
    var SS = window.SpeechSynthesisUtterance || window.webkitSpeechSynthesisUtterance;

    var speechObj = new SS;
    speechObj.text=story
    speechObj.rate=1;

    

    console.log(speechObj)

    window.speechSynthesis.speak(speechObj)
}










