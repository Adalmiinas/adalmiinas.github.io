//Starting values
let pay = 0;
let bank = 0;
let loan = 0;

//Getting all the buttons
const workBtn = document.getElementById("work-btn");
const bankBtn = document.getElementById("bank-btn");
const loanBtn = document.getElementById("loan-btn");
const repayBtn = document.getElementById("repay-btn");
const buyBtn = document.getElementById("buy-btn");

//getting all the elements
const workAmountElement = document.getElementById("workAmount");
const loanAmountElement = document.getElementById("loanAmount");
const balanceAmountElement = document.getElementById("balanceAmount");
const loanContainerElement = document.getElementById("loanTextContainer");
const laptopsElement = document.getElementById("laptopsSelection");

//getting all the elements to put the laptop info in
const laptopSpecsElement = document.getElementById("laptopSpecs");
const priceElement = document.getElementById("price");
const laptopTitleElement = document.getElementById("laptopTitle");
const laptopDescriptionElement = document.getElementById("laptopDescription");
const laptopImageElement = document.getElementById("image");

//setting up array ready for fetching
let laptops = [];

//Hide or show the loan text and repay button
//depending if there is loan or not
function hidden() {
  if (loan === 0) {
    repayBtn.style.display = "none";
    loanContainerElement.style.visibility = "hidden";
  } else {
    repayBtn.style.display = "inline";
    loanContainerElement.style.visibility = "visible";
  }
}

//updates all the values on page
function updateValues() {
  workAmountElement.innerText = pay + " Kr.";
  loanAmountElement.innerText = loan + " Kr.";
  balanceAmountElement.innerText = bank + " Kr.";
}

//Event listener for get a loan - button
loanBtn.addEventListener("click", function () {
  if (loan !== 0) {
    window.alert("Sorry, not possible to have two loans. Pay first!");
  } else {
    const loanValue = Number(window.prompt("How much of a loan you want", ""));
    //checking that the input is valid number
    if (isNaN(loanValue) || loanValue <= 0) {
      window.alert("Please enter a valid number!");
      return;
    } else if (loanValue > bank * 2) {
      window.alert("Asked for too much money!");
    } else {
      loan = loanValue;
      bank += loan;
      updateValues();
      hidden();
    }
  }
});

//Event listener for work-button
workBtn.addEventListener("click", function () {
  const amount = workAmountElement.innerText.split(" ")[0];
  const number = parseInt(amount) + 100;
  pay = number;
  updateValues();
  hidden();
});

//Event listener for putting the work money in the bank 
bankBtn.addEventListener("click", function () {
  if (loan > 0) {
    //10% of the work money is taken to pay the loan balance if there is any
    let interest = pay * 0.1;
    //checking if loan is smaller than the interest
    //so that loan balance doesn't go to negative
    if (loan < interest) {
      interest -= loan;
      loan = 0;
      bank += interest;
    } else {
      loan -= interest;
      bank += pay - interest;
    }
  } else {
    bank += pay;
  }
  pay = 0;
  updateValues();
  hidden();
});

//Event listener for repaying directly from the loan amount
repayBtn.addEventListener("click", function () {
  //if the loan is payed the rest of the money goes to the balance
  if (loan > pay) {
    loan -= pay;
    pay = 0;
  } else {
    pay -= loan;
    loan = 0;
    bank += pay;
    pay = 0;
  }

  updateValues();
  hidden();
});

//Event listener for buying the laptop button 
buyBtn.addEventListener("click", function () {
  const price = priceElement.innerText.split(" ");
  if (price[0] <= bank) {
    window.alert(
      "You are the proud owner of " +
        document.getElementById("laptopTitle").innerText
    );
    bank -= price[0];
    updateValues();
  } else {
    window.alert("You don't have enough balance in the bank :(");
  }
});

//Fetching the laptops info
fetch("https://hickory-quilled-actress.glitch.me/computers")
  .then((response) => response.json())
  .then((data) => (laptops = data))
  .then((laptops) => addLaptopsToMenu(laptops));

//iterating through the array
const addLaptopsToMenu = (laptops) => {
  laptops.forEach((laptop) => addLaptopToMenu(laptop));
};

//adding the laptops to the menu one by one
const addLaptopToMenu = (laptop) => {
  const laptopElement = document.createElement("option");
  laptopElement.value = laptop.id;
  laptopElement.appendChild(document.createTextNode(laptop.title));
  laptopsElement.appendChild(laptopElement);
};

//adding all the laptop info to the page after the user has chosen one from the menu
const handleLaptopChoice = (e) => {
  buyBtn.style.display = "inline";
  const selectedLaptop = laptops[e.target.selectedIndex - 1];
  priceElement.innerText = selectedLaptop.price + " Kr.";
  laptopTitleElement.innerText = selectedLaptop.title;
  laptopDescriptionElement.innerText = selectedLaptop.description;
  laptopSpecsElement.innerText = selectedLaptop.specs.join(" \n");
  laptopImageElement.src =
    "https://hickory-quilled-actress.glitch.me/assets/images/" +
    selectedLaptop.id +
    ".jpg";
  //Event listener for an error
  //Looks up the photo as a png if the photo is not found earlier with jpg
  laptopImageElement.addEventListener("error", function (event) {
    event.target.src =
      "https://hickory-quilled-actress.glitch.me/assets/images/" +
      selectedLaptop.id +
      ".png";
    event.onerror = null;
  });
};

laptopsElement.addEventListener("change", handleLaptopChoice);
