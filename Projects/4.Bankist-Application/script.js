'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Sir',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jess Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steve Tom Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

////////////////////////////

const displayMovements = function(movements, sort=false){
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a,b) => a-b) : movements;

  movs.forEach(function(mov, i , arr){
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i+1}  ${type}</div>
      <div class="movements__date">3 days ago</div>
      <div class="movements__value">${mov}€</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });

};

// displayMovements(account1.movements);

accounts.forEach(function(acc){
  acc.username = acc.owner.toLowerCase().split(' ').map(name=>name[0]).join("");
})
let curAccount;

const updateUI = function(acc){
  displayMovements(curAccount.movements);
  printBalance(curAccount);
  displaySummary(curAccount);
};
//event handlers
btnLogin.addEventListener("click", function(e){
  //prevent default form submission
  e.preventDefault();
  // console.log("LOGIN");
  // accounts.forEach(function(acc){
  //   if (acc.username === inputLoginUsername.value){
  //     containerApp.style.opacity = 100;
  //   }    
  // });
  curAccount = accounts.find((acc)=>acc.username === inputLoginUsername.value);
  if(curAccount?.pin === Number(inputLoginPin.value)){
    labelWelcome.textContent = `Welcome back, ${curAccount.owner.split(" ")[0]}!`;
    containerApp.style.opacity = 100;
    
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
    updateUI(curAccount);
  }
});

///////////////
const printBalance = function(acc){
  const movements = acc.movements;
  const bal = movements.reduce(function(acc, cur, i, arr){
    return acc+cur;
  },0);
  curAccount.balance = bal;
  labelBalance.textContent = bal + "$";
}

// printBalance(account1.movements);

const displaySummary = function(account){
  const movements = account.movements;
  const incomes = movements.filter(mov => mov > 0).reduce((acc,mov) => acc+mov, 0);
  labelSumIn.textContent = `${incomes} $`;
  const expenses = movements.filter(mov => mov < 0).reduce((acc,mov) => acc+mov, 0);
  labelSumOut.textContent = `${Math.abs(expenses)} $`;

  const interest = movements.filter(mov => mov > 0).map(deposit => deposit*account.interestRate/100).filter(deposit => deposit>1).reduce((acc,interest)=>acc+interest,0);
  labelSumInterest.textContent = `${interest} $`
};

// displaySummary(account1.movements);

///////
btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const recieverUsername = inputTransferTo.value;
  const transferAmount = Number(inputTransferAmount.value);

  inputTransferAmount.value = inputTransferTo.value = '';

  const recieverAcc = accounts.find(acc => acc.username === recieverUsername);

  if (recieverAcc && recieverUsername!=curAccount.username && transferAmount && curAccount.balance > transferAmount){
      curAccount.movements.push(-transferAmount);
      recieverAcc.movements.push(transferAmount);
  }
  updateUI(curAccount);
});

btnClose.addEventListener('click', function(e){
  e.preventDefault();
  inputCloseUsername.value = inputClosePin.value = '';

  if (curAccount.username === inputCloseUsername.value &&
    curAccount.pin === Number(inputClosePin.value)){
      index = accounts.findIndex(acc => acc.username === curAccount.username);
      //Delete account
      accounts.splice(index,1);

      // Hide UI
      containerApp.style.opacity = 0;
    }
});

btnLoan.addEventListener("click", function(e){
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  inputLoanAmount.value = '';
  if (amount>0 && curAccount.movements.some(mov => mov >= 0.1*amount)){
    curAccount.movements.push(amount);
    updateUI(curAccount);
  }
});

let isSorted = false
btnSort.addEventListener("click", function(e){
  e.preventDefault();
  
  displayMovements(curAccount.movements, true);

  isSorted = !isSorted;
});