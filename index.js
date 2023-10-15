let display = document.getElementById('display');
let copyButton = document.getElementById('copyButton');
let copied = document.getElementById('copied');
let passLen = document.getElementById('passLen');
let range = document.getElementById('range');
let uppercaseCheck = document.getElementById('uppercase');
let lowercaseCheck = document.getElementById('lowercase');
let numberCheck = document.getElementById('number');
let symbolCheck = document.getElementById('symbol');
let indicator = document.getElementById('indicator');
let genPass = document.getElementById('genPass');
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 8;
handleRange();
let checkBoxCount = 0;

indicator.style.backgroundColor = "grey";

function handleRange(){
    range.value = passwordLength;
    passLen.innerHTML = passwordLength;

}

range.addEventListener('input', (e)=>{
    passwordLength = e.target.value;
    handleRange();
});

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = color;
}

function getRandomInteger(min, max){
    return Math.floor(Math.random() * (max - min) + min);
}

function generateRandomInteger(){
    return getRandomInteger(1, 10);
}

function getRandomUppercaseChar(min, max){
    return Math.floor(Math.random() * (max - min) + min);
}

function generateUppercaseLetter(){
    return String.fromCharCode(getRandomUppercaseChar(65, 91));
}

function getRandomLowercaseChar(min, max){
    return Math.floor(Math.random() * (max - min) + min);
}

function generateLowercaseLetter(){
    return String.fromCharCode(getRandomLowercaseChar(97, 123));
}

function generateRandomSymbol(){
    let random = getRandomInteger(0, symbols.length);
    return symbols.charAt(random);
}

function calculateStrength(){
    let hasUpperCase = false;
    let hasLowerCase = false;
    let hasNumber = false;
    let hasSymbol = false;

    if(uppercaseCheck.checked){
        hasUpperCase = true;
    }

    if(lowercaseCheck.checked){
        hasLowerCase = true;
    }

    if(numberCheck.checked){
        hasNumber = true;
    }

    if(symbolCheck.checked){
        hasSymbol = true;
    }

    if(hasUpperCase && hasLowerCase && (hasNumber || hasSymbol) && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if((hasUpperCase || hasLowerCase) && (hasNumber || hasSymbol) && passwordLength >= 6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try {
        await navigator.clipboard.writeText(display.value);
        copied.innerHTML = "Copied";
    } catch (error) {
        copied.innerHTML = "Failed";
    }
    copied.classList.add("active");
    setTimeout(() => {
        copied.classList.remove("active");
    }, 2000);
}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange(){
    checkBoxCount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkBoxCount++;
        }
    });

    if(passwordLength < checkBoxCount){
        passwordLength = checkBoxCount;
        handleRange();
    }
}

allCheckBox.forEach((checkBox)=>{
    checkBox.addEventListener('change', handleCheckBoxChange);
});

copyButton.addEventListener("click", () => {
    if(display.value){
        copyContent();
    }
});

genPass.addEventListener("click", () => {
    if(checkBoxCount <= 0){
        return;
    }

    password = "";

    let functionArray = [];
    if(uppercaseCheck.checked){
        functionArray.push(generateUppercaseLetter);
    }

    if(lowercaseCheck.checked){
        functionArray.push(generateLowercaseLetter);
    }

    if(numberCheck.checked){
        functionArray.push(generateRandomInteger);
    }

    if(symbolCheck.checked){
        functionArray.push(generateRandomSymbol);
    }

    for(let i = 0; i < functionArray.length; i++){
        password += functionArray[i]();
    }

    for(let i = 0; i < passwordLength - functionArray.length; i++){
        let randomIndex = getRandomInteger(0, functionArray.length);
        password += functionArray[randomIndex]();
    }
    password = shufflePassword(Array.from(password));
    display.value = password;
    calculateStrength();
});