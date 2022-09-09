

// *************************************
// *************************************
//              Classes
// *********************************** */
// *************************************


// *************************************
//                Deck
// *********************************** */

class Deck {

    //Constructor
    constructor() {
        this.deckId = "";
        this.playerHand = [];
        this.cardValues = [];
        this.dealData = "";
        this.numOfPlayers = 0;
        this.deckSize = 0;
        this.numOfDecks = 1;

        document.querySelector(`.shuffle-button`).addEventListener(`click`, this.shuffle.bind(this));
    }

    //Methods
    
    //New Game
    //Shuffles the deck and deals the beginning hands 
    async newGame(numOfPlayers,numOfDecks) {
        await fetch(`https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${this.numOfDecks}`)
            .then(res => res.json())
            .then(data => {
                this.changeDeckSize(data);
                this.setDeckId(data.deck_id);
            })
            .catch(err => {
                console.log(`error ${err}`)
            })

            this.numOfPlayers = numOfPlayers;
            // this.numOfDecks = numOfDecks;
    }

    //Shuffle
    async shuffle() {
        await fetch(`https://www.deckofcardsapi.com/api/deck/${this.deckId}/shuffle/`)
        .then(res => res.json())
        .then(data => {
            this.changeDeckSize(data);
        })
        .catch(err => {
            console.log(`error ${err}`)
        })
        this.removeCardsFromDOM();
        document.querySelector(".shuffle-button").style.display = "none";
        document.querySelector(".new-round-button").style.display = "block";
    }
   
    //getNumOfDecks 
    getNumOfDecks() {
        return this.numOfDecks;
    }

    //getNumOfPlayers 
    getNumOfPlayers() {
        return this.numOfPlayers;
    }

    //Deal
    //Deals out number of specified cards and returns an array
    //with all the cards dealt
    async deal(numOfCards) {
        await fetch(`https://www.deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=${numOfCards}`)
            .then(res => res.json())
            .then(data => {
                this.changeDeckSize(data);
                this.dealData = data;
            })
            .catch(err => {
                console.log(`error ${err}`)
            })
    }
    
    //getDealData
    getDealData() {
        return this.dealData;
    }

    //getDeckSize
    getDeckSize() {
        return this.deckSize;
    }

    //changeDeckSize
    //changes the deck size element on the DOM
    changeDeckSize(data) {
        document.querySelector(".deck-size").innerText = data.remaining;
        this.deckSize = data.remaining;
    }

    //get deckId
    //returns deckId for other called players
    getDeckId() {
        return this.deckId;
    }

    //set deckId
    //sets deckId for other called players
    setDeckId(deckId) {
        this.deckId = deckId;
    }

    //getHand
    //gets player hand
    getHand() {
        return this.playerHand;
    }

    //addToHand
    //adds cards to a player hand array to easily keep track
    addToHand(card) {
        this.playerHand.push(card);
    }

    //emptyHand
    //empties player hand array for next round
    emptyHand() {
        this.playerHand = [];
    }

    getValue(value) {
        if(value === "JACK"||
           value === "QUEEN"||
           value === "KING") {
                return 10;
        } else if(value === "ACE") {
            return this.handCount > 11 ? 1 : 11;
        } else {
            return Number(value);
        }
    }
}


// *************************************
//                Player
// *********************************** */

class Player extends Deck{

    //Constructor
    constructor(playerNumber) {
        super();
        this.handCount = 0;
        this.container = document.querySelector(`.player-container`);
        this.domCount = document.querySelector(`.player-count`);
        this.playerNumber = playerNumber;
        this.container.querySelector(`.hit-button`).addEventListener(`click`, this.hit.bind(this));
        this.container.querySelector(`.stay-button`).addEventListener(`click`, this.stay.bind(this));
    }

    //Methods
    
    //addCardToDOM
    //adds cards to DOM
    addCardToDOM(card,playerName) {
        let img = document.createElement("img");
        img.src = card.image;
        this.container.appendChild(img);
    }

    //removeCardsFromDOM
    removeCardsFromDOM() {
        let allCards = this.container.querySelectorAll("img");
        allCards.forEach(image => {
            this.container.removeChild(image);
        })
    }

    getHandCount() {
        return this.handCount;
    }

     //countHand
    //Adds up card values player has
    //then puts number on DOM
    addToHandCount(card) {
        let value = this.getValue(card.value);
        this.cardValues.push(this.getValue(card.value));

        if(this.handCount + value > 21) {
            if(this.cardValues.includes(11)) {
                let index = this.cardValues.indexOf(11);
                this.cardValues[index] = 1;
                value = 1;
            }
        }
        this.handCount += value;
        this.domCount.innerText = this.handCount;
        console.log(this.cardValues);
    }

    //resetHandCount
    //resets hand count for next round
    //then puts number on DOM
    resetHandCount() {
        this.handCount = 0;
        this.domCount.innerText = 0;
        this.cardValues = [];
    }

    //hit
    //Adds card to hand and dom
    async hit() {
        await this.deal(1);
        this.addToHandCount(this.dealData.cards[0]);
        this.addToHand(this.dealData.cards[0]);
        this.addCardToDOM(this.dealData.cards[0]);

        if(this.handCount > 21) 
            this.bust();
    }

    stay() {
        this.container.querySelector(".player-hitOrStay").style.display = "none";
        document.querySelector(".reveal-button").style.display = "block";
    }

    bust() {
        this.domCount.innerText = "BUSTED";
        document.querySelector(".player-hitOrStay").style.display = "none";
        if(this.getDeckSize() < ((this.getNumOfDecks() * 52) * .6)) {
            document.querySelector(".shuffle-button").style.display = "block";
        } else {
            document.querySelector(".new-round-button").style.display = "block";
        }
        document.querySelector(".winner").innerText = "Dealer Wins!";
    }
}


// *************************************
//                Dealer
// *********************************** */

class Dealer extends Deck {

    //Constructor
    constructor() {
        super();
        this.container = document.querySelector(`.dealer-container`);
        // this.container.querySelector(`.hit-button`).addEventListener(`click`, this.hit.bind(this));
        this.handCount = 0;
        this.domCount = document.querySelector(`.dealer-count`);
        document.querySelector(".reveal-button").addEventListener("click", this.revealFaceDown.bind(this));
    }

    //Methods
    
    getHandCount() {
        return this.handCount;
    }

    //addCardToDOM
    //adds cards to DOM
    addCardToDOM(card) {
        let img = document.createElement("img");
        if(this.getHand().length === 0) {
            img.src = "images/face-down.jpg"
        } else {
            img.src = card.image;
        }
        this.container.appendChild(img);
    }

     //countHand
    //Adds up card values player has
    //then puts number on DOM
    addToHandCount(card) {
        let value = this.getValue(card.value);
        this.cardValues.push(this.getValue(card.value));

        if(this.handCount + value > 21) {
            if(this.cardValues.includes(11)) {
                let index = this.cardValues.indexOf(11);
                this.cardValues[index] = 1;
                value = 1;
            }
        }
        this.handCount += value;
        this.domCount.innerText = this.handCount;
        console.log(this.cardValues);
    }

    //resetHandCount
    //resets hand count for next round
    //then puts number on DOM
    resetHandCount() {
        this.handCount = 0;
        this.domCount.innerText = 0;
        this.cardValues = [];
    }

    //removeCardsFromDOM
    removeCardsFromDOM() {
        let allCards = this.container.querySelectorAll("img");
        allCards.forEach(image => {
            this.container.removeChild(image);
        })
    }
    //hit
    //Adds card to hand and dom
    async hit() {
        await this.deal(1);
        this.addToHandCount(this.dealData.cards[0]);
        this.addToHand(this.dealData.cards[0]);
        this.addCardToDOM(this.dealData.cards[0]);
    }

    bust() {
        this.domCount.innerText = "BUSTED";
        if(this.getDeckSize() < ((this.getNumOfDecks() * 52) * .6)) {
            document.querySelector(".shuffle-button").style.display = "block";
        } else {
            document.querySelector(".new-round-button").style.display = "block";
        }
        document.querySelector(".dealer-hitOrStay").style.display = "none";
        document.querySelector(".winner").innerText = "Player Wins!";
    }

    revealFaceDown() {
        this.removeCardsFromDOM();
        this.playerHand.forEach(card => {
            let img = document.createElement("img");
            img.src = card.image;
            this.container.appendChild(img);
        })
        document.querySelector(".reveal-button").style.display = "none";
        document.querySelector(".dealer-count").style.display = "inline";
        document.querySelector(".dealer-hitOrStay").style.display = "block";
    }
}



// *************************************
// *************************************
//              Game
// *********************************** */
// *************************************

// *************************************
//              Variables
// *********************************** */
const deck = new Deck();
const dealer = new Dealer();
const player1 = new Player(1);

// *************************************
//           Query Selectors
// *********************************** */
//New Game
document.querySelector(`.new-game-button`).addEventListener(`click`, startGame);

//New Round
document.querySelector(`.new-round-button`).addEventListener(`click`, newRound);

//dealer stay button
document.querySelector(".dealer-container").querySelector(".hit-button")
.addEventListener("click", whoWins);

//checkWin after reveal
document.querySelector(".reveal-button").addEventListener("click", checkWin);
// *************************************
//              Functions
// *********************************** */

//Start Game
async function startGame() {
    //Need to make an array of players + dealer
    await deck.newGame(2);
    //set deckIds of all players
    player1.setDeckId(deck.getDeckId());
    dealer.setDeckId(deck.getDeckId());
    //need to add cards to hand from dealData
    //need to iterate through this array for each player

    newRound();
}

async function newRound() {

    //empties DOM and player hands from last round
    dealer.removeCardsFromDOM();
    dealer.resetHandCount();
    dealer.emptyHand();

    player1.removeCardsFromDOM();
    player1.resetHandCount();
    player1.emptyHand();

    document.querySelector(".winner").innerText = "";
    document.querySelector(".dealer-count").style.display = "none";
    //DEALING 
    await deck.deal(deck.getNumOfPlayers() * 2);
    document.querySelector(".new-game-button").style.display = "none";

    for(let i = 0; i < 4; i+=2) { //numOFPlayers * 2
        for(let j = 0; j < 2; j++) { //numOfPlayers
            if((j+i) % (j+1) === 0) {
                dealer.addCardToDOM(deck.getDealData().cards[j+i]);
                dealer.addToHand(deck.getDealData().cards[j+i]);
                dealer.addToHandCount(deck.getDealData().cards[j+i]);
            } else {
                player1.addCardToDOM(deck.getDealData().cards[j+i]);
                player1.addToHand(deck.getDealData().cards[j+i]);
                player1.addToHandCount(deck.getDealData().cards[j+i]);
            }
        }
    }

    document.querySelector(".new-round-button").style.display = "none";
    document.querySelector(".player-hitOrStay").style.display = "block";
}

async function whoWins() {
    let winner = document.querySelector(".winner");

    await dealer.hit();
    console.log(dealer.getHandCount());

    if(dealer.getHandCount() > player1.getHandCount() 
       && dealer.getHandCount() <= 21) {
        winner.innerText = "Dealer Wins!"
    } else if(dealer.getHandCount() > 21) {
        dealer.bust();
    } else if(dealer.getHandCount() <= 17) {
        return;
    } else if (dealer.getHandCount() == player1.getHandCount()) {
        winner.innerText = "Push! Player and Dealer Tie!"
    } else {
        winner.innerText = "Player Wins!"
    }

    if(winner.innerText === "Dealer Wins!"
    || winner.innerText === "Player Wins!"
    || winner.innerText === "Push! Player and Dealer Tie!") {
        document.querySelector(".dealer-hitOrStay").style.display = "none";

        if(deck.getDeckSize() < ((deck.getNumOfDecks() * 52) * .6)) {
            document.querySelector(".shuffle-button").style.display = "block";
        } else {
            document.querySelector(".new-round-button").style.display = "block";
        }
    }
}


function checkWin() {
    let winner = document.querySelector(".winner");

    console.log(dealer.getHandCount());
    console.log(player1.getHandCount());
    if(dealer.getHandCount() === 21
       || dealer.getHandCount() > player1.getHandCount() ) {
        winner.innerText = "Dealer Wins!"
        document.querySelector(".dealer-hitOrStay").style.display = "none";

        if(deck.getDeckSize() < ((deck.getNumOfDecks() * 52) * .6)) {
            document.querySelector(".shuffle-button").style.display = "block";
        } else {
            document.querySelector(".new-round-button").style.display = "block";
        }
    }
}


//NEED TO MAKE PLAYER WIN IF THEY HAVE NATURAL 21
//NEED TO MAKE DEALER HIT IF LOWER THAN PLAYER \
//FIX ACE WHEN OVER 21
//FIX SHUFFLE AND NEXT ROUND
//hide counts after shuffle
//remove cards from DOM is not a function

//make code look nice tomorrow