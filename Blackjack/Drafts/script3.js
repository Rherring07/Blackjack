// *************************************
//              DECK
// *********************************** */

class Deck {

    /////Blackjack constructor////////////////////
    constructor() {
        
         // *********Variables***************
        this.deckId;
        this.data;
        this.cardsDealt;
         // *********Query Selectors***************

         // *********Event Listeners***************
    }


    /////Blackjack methods////////////////////

    // *********Get/Set Methods***************
    
    //data
    get data() {
        return this._data;
    }
    set data(data) {
        this._data = data;
    }

    //cardsDealt
    get cardsDealt() {
        return this._cardsDealt;
    }
    set cardsDealt(cards) {
        this._cardsDealt = cards;
    }

    // *********Toggle Button/Form Methods**************

    // *********Other Methods***************

    //createDeck
    //cretes a shoe made up of numOfDecks and shuffles it
    //stores the deckId for future use
    //stores the deckData for future use
    async createDeck(numOfDecks) {
        await fetch(`https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${numOfDecks}`)
            .then(res => res.json())
            .then(data => {
                //Sets the Deck Size and Deck ID
                this.deckId = data.deck_id;
                this.data = data;
            })
            .catch(err => {
                console.log(`error ${err}`)
            })
    }

    //test deck

    // async createDeck() {
    //     await fetch(`https://www.deckofcardsapi.com/api/deck/new/?cards=6S,JS,7S,6C,AD,4D,9D`)
    //         .then(res => res.json())
    //         .then(data => {
    //             //Sets the Deck Size and Deck ID
    //             this.deckId = data.deck_id;
    //             this.data = data;
    //         })
    //         .catch(err => {
    //             console.log(`error ${err}`)
    //         })
    // }

    //Shuflle 
    //Shuffles all cards back into the deck and rewrites deckData
    async shuffle() {
        await fetch(`https://www.deckofcardsapi.com/api/deck/${this.deckId}/shuffle/`)
        .then(res => res.json())
        .then(data => {
            this.data = data;
        })
        .catch(err => {
            console.log(`error ${err}`)
        })
    }

    //draw
    //draws a number of specified cards and rewrites deckData
    async draw(numOfCards) {
        await fetch(`https://www.deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=${numOfCards}`)
            .then(res => res.json())
            .then(data => {
                this.data = data;
                this.cardsDealt = data.cards;
            })
            .catch(err => {
                console.log(`error ${err}`)
            })
    }
}




// *************************************
//              BLACKJACK
// *********************************** */

class Blackjack {

    /////Blackjack constructor////////////////////
    constructor() {
        
         // *********Variables***************
        this.numOfPlayers; //must be between 1 and 8, counting dealer
        this.numOfDecks;
        this.playersHands = []; //array of players' "hands"
        this.playersHandsValues = [];
         // *********Query Selectors***************

         // *********Event Listeners***************
    }


    /////Blackjack methods////////////////////

    // *********Get/Set Methods***************


    //getNumOfDecks 
    get numOfDecks() {
        return this._numOfDecks;
    }
    //setNumOfDecks
    set numOfDecks(num) {
        this._numOfDecks = num;
    }


    //getNumOfPlayers
    get numOfPlayers() {
        return this._numOfPlayers;
    }
    //setNumOfPlayers
    set numOfPlayers(num) {
        this._numOfPlayers = num;
    }


    // *********Toggle Button/Form Methods**************

    // *********Other Methods***************

    //deal 2 cards to each player
    //add cards to playersHands and Values arrays
    deal(cards) {
         for(let i = 0; i < this.numOfPlayers+1; i++) {
            this.playersHands[i] = [cards[i], cards[i + this.numOfPlayers+1]];
            this.playersHandsValues[i] = [this.getValue(cards[i].value), this.getValue(cards[i + this.numOfPlayers+1].value)];
            //check for double aces
            //if both cards are aces, make the second ace a value of 1
            if(this.playersHandsValues[i].every((value) => { return value === 11; })) {
                this.playersHandsValues[i] = [11,1];
            }
        }
    }

    getValue(value) {
        if(value === "JACK"||
           value === "QUEEN"||
           value === "KING") {
                return 10;
        } else if(value === "ACE") {
            return 11;
        } else {
            return Number(value);
        }
    }


}

// *************************************
//              PLAYER
// *********************************** */

class Player {

    /////Blackjack constructor////////////////////
    constructor(playerNumber) {

         // *********Variables***************
        this.number = playerNumber;
        this.hand = [];
        this.handCount;
        this.handValues = [];
         // *********Query Selectors***************
        
         // *********Event Listeners***************
    }


    /////Blackjack methods////////////////////

    // *********Get/Set Methods***************

    //Get/Set Hand
    get hand() {
        return this._hand;
    }
    set hand(arrayOfCards) {
        this._hand = arrayOfCards;
    }

    //Get/Set handValues
    get handValues() {
        return this._handValues;
    }
    set handValues(values) {
        this._handValues = values;
    }

    //Get/Set Hand Count
    get handCount() {
        return this._handCount;
    }
    set handCount(value) {
        this._handCount = value;
    }
    
    //add to hand
    addToHand(card, value) {
        this._hand.push(card);
        this.handValues.push(value);
        this._handCount += value;
    }

    //empty hand and all values
    emptyHand() {
        this._hand = [];
        this._handValues = [];
        this._handCount = 0;
    }
    
    // *********Toggle Button/Form Methods**************

    // *********Other Methods***************

    //HIT ME
    hit(card, value) {
        //if hand count becomes higher than 21,
        if(this.handCount + value > 21) {
            //if hand already has an ace, set ace value to 1
            if(this.handValues.includes(11)) {
                let index = this.handValues.indexOf(11);
                this.handValues[index] = 1;
                //edit handCount with ace change
                this.handCount = this._handValues.reduce((acc,cV) => 
                    acc + cV, 0
                );
            } else if(value === 11) {
                //if not, set value to 1
                value = 1;
            } 
        }
        //add card and value to hand
        this.addToHand(card,value);
    }

    //checks if handCount is over 21, returns true if yes
    checkBust() {
        return this.handCount > 21 ? true : false;
    }
    
    //checks if player gets 21 at the start
    checkBlackjack() {
        return this.handCount === 21 && this.handValues.length === 2 ? true : false;
    }



}


// *************************************
//              DEALER
// *********************************** */

class Dealer extends Player{

    /////Blackjack constructor////////////////////
    constructor() {
        super();
         // *********Variables***************

         // *********Query Selectors***************

         // *********Event Listeners***************
    }


    /////Blackjack methods////////////////////

    // *********Get/Set Methods***************

    // *********Toggle Button/Form Methods**************

    // *********Other Methods***************
    


}


// *************************************
//              Dom
// *********************************** */

//all functions that remove or add to the dom are here
class Dom {

    /////Dom constructor////////////////////
    constructor() {

        // *********Variables***************
        this.players = []
        this.playersHitOrStay = [];
        this.hitButtons = [];
        this.stayButtons = [];


        // *********Query Selectors***************

        //player info container
        this.playerInfo = document.querySelector(".player-info");
        this.playerInput = document.querySelector(".player-input");
        this.blackjackPlayerRules = document.querySelector(".blackjack-player-rules");

        //deck info container
        this.deckInfo = document.querySelector(".deck-info");
        this.deckInput = document.querySelector(".deck-input");
        this.blackjackDeckRules = document.querySelector(".blackjack-deck-rules");

        //players and decks deal info container
        this.playersAndDecks = document.querySelector(".players-and-decks");
        this.numOfPlayers = document.querySelector(".num-of-players");
        this.numOfDecks = document.querySelector(".num-of-decks");

        //buttons
        this.newGameButton =  document.querySelector(".new-game-button")
        this.dealButton = document.querySelector(".deal-button");
        this.newRoundButton = document.querySelector(".new-round-button");
        //hit buttons
        this.hitButtons = document.querySelectorAll(".hit-button");
        this.stayButtons = document.querySelectorAll(".stay-button");

        //blackjack container
        this.blackjack = document.querySelector(".blackjack");
        this.deckSize = document.querySelector(".deck-size");

        //stay message
        this.stayMessages = document.querySelectorAll(".stay");

        // *********Event Listeners***************

        //New Game Button
        this.newGameButton.addEventListener("click", this.togglePlayerForm.bind(this));
        this.newGameButton.addEventListener("click", this.toggleNewGameButton.bind(this));

        //Deal Button
        this.dealButton.addEventListener("click", this.toggleDealInfo.bind(this));
        this.dealButton.addEventListener("click", this.toggleBlackjack.bind(this));

        //new round button
        this.newRoundButton.addEventListener("click", this.toggleNewRoundButton.bind(this));
        this.newRoundButton.addEventListener("click", this.toggleDealerCount.bind(this)); //hides dealer count)
        this.newRoundButton.addEventListener("click", this.hideStay.bind(this)); //hides stay messages)
    }


    /////Dom methods////////////////////

    // *********Edit Methods***************

    //count
    editCount(value,playerNumber) {
        this.players[playerNumber-1].querySelector(".count").innerText = value;
    }
    //deck size
    editDeckSize(cardsRemaining) {
        this.deckSize.innerText = cardsRemaining;
    }
    // *********Toggle Button/Form Methods**************

    //player form and deck form toggle
    togglePlayerForm() {
        this.playerInfo.classList.toggle("hidden");
    }
    toggleDeckForm() {
        this.deckInfo.classList.toggle("hidden");
    }

    //toggle buttons
    //new game
    toggleNewGameButton() {
        this.newGameButton.classList.toggle("hidden");
    }
    //new round
    toggleNewRoundButton() {
        this.newRoundButton.classList.toggle("hidden");
    }


    //deal info also toggles player and deck info
    toggleDealInfo(numOfPlayers, numOfDecks) {
        this.playersAndDecks.classList.toggle("hidden");
        dom.numOfPlayers.innerText = numOfPlayers;
        dom.numOfDecks.innerText = numOfDecks;
    }

    //toggles Blackjack container
    toggleBlackjack() {
        this.blackjack.classList.toggle("hidden");
    }
    
    //toggle player containers
    togglePlayerContainers(numOfPlayers) {
        for(let i = 1; i <= numOfPlayers; i++) 
            document.querySelector(`.player${i}-container`).classList.toggle("hidden");
    }


    //player hit or stay div
    toggleHitOrStay(playerNumber) {
        this.playersHitOrStay[playerNumber-1].classList.toggle("hidden");
    }

    //toggle player checkWin
    togglePlayerWin(playerNumber) {
        this.players[playerNumber -1].querySelector(".player-win")
        .classList.toggle("hidden");
    }
    togglePlayerLose(playerNumber) {
        this.players[playerNumber -1].querySelector(".player-lose")
        .classList.toggle("hidden");
    }
    togglePlayerTie(playerNumber) {
        this.players[playerNumber -1].querySelector(".player-tie")
        .classList.toggle("hidden");
    }

    //toggle dealer count 
    toggleDealerCount() {
        document.querySelector(".dealerCount").classList.toggle("hidden");
    }

    //toggle stay message
    showStay(playerNumber) {
        this.stayMessages[playerNumber-1].classList.remove("hidden");
    }
    //hide all stay messages
    hideStay() {
        this.stayMessages.forEach(message => message.classList.add("hidden"));
    }

    //hide player checkWin
    hidePlayerCheckWin(playerNumber) {
        this.players[playerNumber -1].querySelector(".player-win")
        .classList.add("hidden");
        this.players[playerNumber -1].querySelector(".player-lose")
        .classList.add("hidden");
        this.players[playerNumber -1].querySelector(".player-tie")
        .classList.add("hidden");
    }


    //empty Methods

    //removes all Images in each player container
    //also resets Hand Counts
    emptyHands() {
        this.players.forEach((player,index) => {
            //remove hand count
            this.editCount("", index + 1);
            //remove images
            let allCards = player.querySelectorAll("img");
            allCards.forEach(image => {
                player.removeChild(image);
            })
        })
    }
    // *********Other Methods***************

    //creates an array of querySelectors for each player
    //then adds dealer querySelector
    //is used to update DOM Images
    createQuerySelectors(numOfPlayers) {
        for(let i = 0; i < numOfPlayers; i++) {
            this.players[i] = document.querySelector(`.player${i+1}-container`);
            this.playersHitOrStay[i] = document.querySelector(`.player${i+1}-hitOrStay`);
        }
        this.players.push(document.querySelector(".dealer-container"));
        this.playersHitOrStay.push(document.querySelector(`.dealer-hitOrStay`));
    }


    //adds card image to specific player containers
    addCardImage(cardImage, playerNumber) {
        let img = document.createElement("img");
        img.src = cardImage;
        this.players[playerNumber-1].appendChild(img);
    }
    
    //reveal face-down
    revealFaceDown(cardImage) {
        let dealer = this.players[players.length-1]
        let faceDown = dealer.querySelector("img");
        faceDown.src = cardImage;

        //show dealer count on dom
        this.toggleDealerCount();
    }


}

// *************************************
//              GAME
// *********************************** */


// *********Variables***************

//board
let deck = new Deck();
let blackjack = new Blackjack();
let dom = new Dom();

//players and dealer
//will run function on deal start to create and store player data
//dealer is last in the array
let players = [];
let dealer = new Dealer();
//bustCount - used to track who busts each round
let bustCount = 0;
//blackjackCount - used to track blackjacks at round start
let blackjackCount = 0;

// *********Query Selectors*********




// *********Event Listeners*********

//Forms
dom.playerInfo.addEventListener("change", selectPlayers);
dom.deckInfo.addEventListener("change", selectDecks);


//Create Players
//create player and dealer classes to store hands and update board
document.querySelector(".deal-button").addEventListener("click", createPlayers);
document.querySelector(".deal-button").addEventListener("click", startGame);

//hit
dom.hitButtons.forEach(button =>{
    button.addEventListener("click", hit);
})

//stay
dom.stayButtons.forEach(button =>{
    button.addEventListener("click", stay);
})

//new round
dom.newRoundButton.addEventListener("click", newRound);




    

// *********Functions****************
//creates players up to blackjack.numOfPlayers
function createPlayers() {
    for(let i = 0; i < blackjack.numOfPlayers; i++) {
        players[i] = new Player(i+1);
    }
    players.push(dealer);
}

//User Player and Deck Number Selections

//run selectPlayers at start
function selectPlayers() {

    //make sure input is a number 1-8
    //dealer is not considered a player for this input
    let value = parseInt(dom.playerInput.value);
    if(Number.isNaN(value) === false && 
        (value > 0 && value < 9)) {
        //set number of players in Blackjack class
        blackjack.numOfPlayers = value;
        //close players form
        dom.togglePlayerForm();
        //open decks form
        dom.toggleDeckForm();
    //if not, have the user input it again
    } else {
        dom.blackjackPlayerRules.innerText = "Not a valid input. Please input a number between 1 and 8";
    }

}
//run selectDecks after selectPlayers form is completed
function selectDecks() {
    
    //make sure the input is a number 1-8
    let value = parseInt(dom.deckInput.value);
    if(Number.isNaN(value) === false &&
       (value > 0 && value < 9)) {
        //set number of decks in Blackjack class
        blackjack.numOfDecks = value;
        //close decks form  
        dom.toggleDeckForm();
        //reveal deal info and button
        dom.toggleDealInfo(blackjack.numOfPlayers, blackjack.numOfDecks);
    //if not, have the user input it again
} else {
    dom.blackjackDeckRules.innerText = "Not a valid input. Please input a number between 1 and 8";
}

}


//StartGame
//stars the game when deal button is hit
async function startGame() {

    //creates a deck and shuffles it
    await deck.createDeck(blackjack.numOfDecks);
    dom.editDeckSize(deck.data.remaining); //edits deck size on dom

    //reveals player boards from DOM
    dom.togglePlayerContainers(blackjack.numOfPlayers);
    //creates dom query Selectors for Images
    dom.createQuerySelectors(blackjack.numOfPlayers);

    //starts the first round
    newRound();

    
}

//New Round
//run new round new round button is hit
async function newRound() {
    //wipes the board for a new round
    await cleanBoard();
    //Deals 2 cards to each player
    //draws cards equal to (number of players + dealer) * 2 
    await deck.draw(players.length * 2);
    dom.editDeckSize(deck.data.remaining);
    //takes the stored data in deck.cardsDealt and deals them out to each player
    blackjack.deal(deck.cardsDealt);

    //store hand data for each player
    //dealer hand data is at the end
    for(let i = 0; i < players.length; i++) {
        players[i].hand = blackjack.playersHands[i];
        players[i].handValues = await blackjack.playersHandsValues[i];

        //add player hand to DOM
        for(let j = 0; j < players[i].hand.length; j++) {
            //check for dealer
            if(i === players.length - 1 && j === 0) 
                cardImage = "images/face-down.jpg"
            else
                cardImage = players[i].hand[j].image

            dom.addCardImage(cardImage, i + 1);
        }
        //add player count to DOM
        players[i].handCount = players[i].handValues.reduce((acc, cV) => acc + cV, 0);
        //check for dealer
        if(i !== players.length - 1)
            dom.editCount(players[i].handCount, i + 1);

        //check for blackjack 
        if(players[i].checkBlackjack()) {
            dom.editCount("BLACKJACK", i + 1);
            //if dealer, do nothing
            if(i !== players.length-1) {
                blackjackCount++;
            } 
        }  
    }

    dom.toggleHitOrStay(1);
}


async function hit() {

    //find the player number of selected hit button
    let target = event.target.parentElement.classList;
    let playerNumber = Number(target[0].charAt(6));

    //checking if hit button is on dealer container
    if(isNaN(playerNumber) === true) {
        playerNumber = players.length;
    }
    
    //draw cards
    await deck.draw(1);
    //edit dom deck size
    dom.editDeckSize(deck.data.remaining);

    
    //player hit function using player number found
    let card = deck.cardsDealt[0];
    let value = blackjack.getValue(card.value);
    players[playerNumber-1].hit(card, value);
    //edit dom with card
    dom.addCardImage(card.image, playerNumber)

    //check for player bust, edit dom accordingly
    if(players[playerNumber-1].checkBust() === true) {
        dom.editCount("BUSTED", playerNumber);
        bustCount++;
        stay(playerNumber);
    } else {
        //edit dom handCount
        dom.editCount(players[playerNumber-1].handCount ,playerNumber);
    

        //check for dealer turn
        let dealer = players[players.length-1];
        if(players[playerNumber-1] === dealer) {
            //if dealer has 17, see if dealer has an ace
            if(dealer.handCount === 17) {
                //if no Ace, end dealer turn
                if(!dealer.handValues.includes(11)) {
                    stay(playerNumber);
                }
            //if dealer is 18 or above, end dealer turn
            } else {
                if(dealer.handCount > 17) {
                    stay(playerNumber);
                }
            }
        } 
    }
    

}

async function stay(playerNumber) {

    if(typeof(playerNumber) !== "number") {
        //if no value is passed in
        //find the player number of selected hit button
        let target = event.target.parentElement.classList;
        playerNumber = Number(target[0].charAt(6));
    }


    //end turn
    dom.toggleHitOrStay(playerNumber);
    let dealer = players[players.length-1];


    //if dealer has gone, end round and check who wins
    if(playerNumber === players.length) {
        dom.toggleNewRoundButton();
        checkWin();
    //if last player has gone, reveal dealer card and check hand count
    //if dealer has hard 17 or over, checkwin
    } else if(playerNumber === players.length - 1){
         //reveal dealer card
        dom.revealFaceDown(dealer.hand[0].image);
        //edit dom count
        if(dealer.handCount === 21) 
            dom.editCount("BLACKJACK", playerNumber+1)
        else
            dom.editCount(dealer.handCount, playerNumber+1);

        //if all players bust, dealer wins
        if(bustCount + blackjackCount === players.length-1) {
            dom.toggleNewRoundButton();
            checkWin();
        } else if(dealer.handCount === 17) {
            //if no Ace, end dealer turn
            if(!dealer.handValues.includes(11)) 
                dom.toggleNewRoundButton();
                checkWin();
            //if dealer is 18 or above, end dealer turn
        } else if(dealer.handCount > 17) {
                dom.toggleNewRoundButton();
                checkWin();
        } else 
            dom.toggleHitOrStay(playerNumber + 1);
    } else {
    //if not, cycle to next player
        //if next player has blackjack, auto skip turn

        //CHECK, IF LAST PLAYER GET'S SKIPPED, DEALER REVEAL DOESN'T HAPPEN
        //MAKE FIRST PLAYER GET SKIPPED


        // if(players[playerNumber].handCount === 21) {
        //     dom.showStay(playerNumber+1);
        //     dom.toggleHitOrStay(playerNumber + 2)
        // } else
            dom.toggleHitOrStay(playerNumber + 1);
            dom.showStay(playerNumber);
    }
}


//clean Board
//cleans the board, wipes player hands, wipes hand counts
async function cleanBoard() {
    //reset counts
    bustCount = 0;
    blackjackCount = 0

    dom.emptyHands(); //removes images and hand counts


    //hide player checkWin divs
    for(let i = 0; i < players.length-1; i++) {
        dom.hidePlayerCheckWin(i+1);
    }

    //empty player hands
    blackjack.playersHands = [];
    players.forEach(player => {
        player.emptyHand();
    })

}



//checks who wins and updates info
function checkWin() {

    dom.hideStay();
    //compares each player hand to dealer hand
    for(let i = 0; i < players.length -1; i++) {
        //if player has 21, run some tests
        if(players[i].checkBlackjack() && dealer.checkBlackjack()) {
            dom.togglePlayerTie(i+1);
        //if greater than 21(bust), auto lose
        } else if(players[i].handCount > 21) {
            dom.togglePlayerLose(i+1);
            //if dealer busts, players auto win
        } else if(dealer.handCount > 21) {
            dom.togglePlayerWin(i+1);
        } else {
            //if less than 22, check for win, lose, or tie
            if(players[i].handCount > dealer.handCount || players[i].checkBlackjack()) {
                dom.togglePlayerWin(i+1);
            } else if(players[i].handCount < dealer.handCount || dealer.checkBlackjack()) {
                dom.togglePlayerLose(i+1);
            } else {
                dom.togglePlayerTie(i+1);
            }
        }
    }
}

//auto stay at 21 - done for player - need to fix

 //CHECK, IF LAST PLAYER GET'S SKIPPED, DEALER REVEAL DOESN'T HAPPEN
        //MAKE FIRST PLAYER GET SKIPPED
        //stop player from having to hit stay

//money??

//split

//auto shuffle
