const passwordDisplay = document.querySelector("[data-passwordDisplay]")
const copyBtn = document.querySelector("[data-cpyBtn]");
const copyMsg = document.querySelector("[data-copyMsg]");
const passLengthDisplay = document.querySelector("[data-lengthValue]");
const inputSlider = document.querySelector("[data-lengthSlider]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase")
const numbersCheck = document.querySelector("#numbers")
const symbolsCheck = document.querySelector("#symbols")
const indicator = document.querySelector("[data-indicator]")
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]")
const symbols = '~`!@#$%^&*()_->={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 1;

setIndicator('#ccc');
// copyMsg.setAttribute('style','scale:0;');

//Initialising the value of Input Slider
inputSlider.value = passwordLength;
passLengthDisplay.innerText= passwordLength;

function handleSlider(){
    // inputSlider.value = passwordLength;
    passLengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    // indicator.setAttribute('style','background-color: green;');
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;

}

function getRndInteger(min,max){
    return Math.floor(min + (max-min) * Math.random());
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateRandomSymbol(){
    const randNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calculateStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 5
    ) {
      setIndicator('#ff0');
    } else {
      setIndicator('#f00');
    }
}

async function copyContent(){

    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }

    // to make copied text appear for a limited time
    copyMsg.classList.add(".active");
    setTimeout(()=>{
        copyMsg.classList.remove(".active");
    },2000);
}

// Copy code works fine
copyBtn.addEventListener('click',()=>{  
    if(passwordDisplay.value){
        copyContent();
    }
});


function handleCheckBoxChange() {
    checkCount = 0;
    
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passwordLength < checkCount ) {
        passwordLength = checkCount;
        handleSlider();
    }
}

function shufflePassword(array){
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

allCheckBox.forEach(checkbox =>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    handleSlider();
});

// This happenn when we click the generate Button
generateBtn.addEventListener('click',()=>{
    // handleCheckBoxChange();
    password = "";
    // agar kuch check hi nahi hai to
    if(checkCount == 0) 
        return;

    // generate karte samay password ki length kam hai to isse handle ho jayega
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // Password Generation Logic - STart

    let typeArray = []; // stores the data type that is checked by user

    if (uppercaseCheck.checked){
        password += generateUpperCase();
        typeArray.push('upper');
    }

    if (lowercaseCheck.checked){
        password += generateLowerCase();
        typeArray.push('lower');
    }

    if (numbersCheck.checked){
        password += generateRandomNumber();
        typeArray.push('number');
    }

    if (symbolsCheck.checked){
        password += generateRandomSymbol();
        typeArray.push('symbol');
    }

    let remaininglen = passwordLength-checkCount;

    for(let i=0; i<remaininglen; i++){

        // Getting random value type from the array
        let randVal = getRndInteger(0,checkCount);
        let checkType = typeArray[randVal];

        if(checkType === 'upper'){
            password += generateUpperCase();
        } else if(checkType === 'lower'){
            password += generateLowerCase();
        } else if(checkType === 'number'){
            password += generateRandomNumber();
        } else{
            password += generateRandomSymbol();
        }
    }

    // Shuffle the password
    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;

    // Password Generation Logic - End here

    // Strength batao aur changes ko implement karo UI mein
    calculateStrength()
    
});


