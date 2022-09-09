

// *************************************
// *************************************
//              Classes
// *********************************** */
// *************************************
// *************************************
//                DECK
// *********************************** */
class Deck {
    
 /////Deck constructor////////////////////
    constructor() {
        this.numOfPlayers;
        this.numOfDecks
        this.deckId
        this.deckSize
        this.dealData
    }

//////Deck Methods/////////////////////////

// *********Get/Set Methods***************


    //getNumOfDecks 
    getNumOfDecks() {
        return this.numOfDecks;
    }
    //setNumOfDecks
    setNumOfDecks(num) {
        this.numOfDecks = num;
    }


    //getNumOfPlayers
    getNumOfPlayers() {
        return this.numOfPlayers;
    }
    //setNumOfPlayers
    setNumOfPlayers(num) {
        this.numOfPlayers = num;
    }


    //getDeckId 
    getDeckId() {
        return this.deckId;
    }
    setDeckId(deckId) {
        this.deckId = deckId;
    }


    //getDeckSize
    getDeckSize() {
        return this.deckSize;
    }
    //setDeckSize
    setDeckSize(numOfCards) {
        this.deckSize = numOfCards;
    }


    //Stored Data from deal fetch to use in other functions
    //getDealData
    getDealData() {
        return this.dealData;
    }
    //setDealData
    setDealData(data) {
        this.dealData = data;
    }

    //Toggles the html containers for each player playing the game
    togglePlayerContainers(numOfPlayers) {
        for(let i = 1; i <= numOfPlayers; i++) 
            document.querySelector(`.player${i}-container`).classList.toggle("hidden");
    }

// **********Other Methods*****************


    //New Game
    //Decides how many players and decks the card game will use, shuffles the deck
    //Also sets the deckId to use in other functions
    async createDeck() {
        await fetch(`https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${this.numOfDecks}`)
            .then(res => res.json())
            .then(data => {
                //Sets the Deck Size and Deck ID
                this.setDeckSize(data.remaining);
                this.setDeckId(data.deck_id);
            })
            .catch(err => {
                console.log(`error ${err}`)
            })
    }

    //Shuflle 
    //Shuffles all cards back into the deck and edits the decksize
    async shuffle() {
        await fetch(`https://www.deckofcardsapi.com/api/deck/${this.deckId}/shuffle/`)
        .then(res => res.json())
        .then(data => {
            this.setDeckSize(data.remaining);
        })
        .catch(err => {
            console.log(`error ${err}`)
        })
    }

    //Deal
    //Deals out number of specified cards 
    //Stores the data in dealData for use in other functions
    async deal(numOfCards) {
        await fetch(`https://www.deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=${numOfCards}`)
            .then(res => res.json())
            .then(data => {
                this.setDeckSize(data.remaining);
                this.setDealData(data);
            })
            .catch(err => {
                console.log(`error ${err}`)
            })
    }


    //edits deck size on DOM
    edtDeckSizeDOM() {
        document.querySelector(".deck-size").innerText = this.deckSize;
    }
}
// *************************************
//              BLACKJACK
// *********************************** */
class Blackjack extends Deck {

/////Blackjack constructor////////////////////
    constructor() {
        super();

        // *********Variables***************

        //array of players(including dealer) and how much money they have
        //if Dealer is playing 1 on 1 against a player, money is set to this.money
        //Else, Dealer money is set to 0 since they aren't betting
        //dealer is last in the array
        this.playerMoney = [];
        //array of player "hands"
        //dealer is last in the array
        this.playersHands = [];

        // *********Query Selectors***************

        // this.form = document.querySelector(".form");
        // this.playerForm = document.querySelector(".player-info");
        // this.deckForm = document.querySelector(".deck-info");

        // *********Event Listeners***************


        //On click for New Game, hide button and bring up player form
        document.querySelector(".new-game-button").addEventListener("click", this.toggleNewGameButton.bind(this));
        document.querySelector(".new-game-button").addEventListener("click", this.togglePlayerForm.bind(this));

        //On submit for player form, hide player form
        document.querySelector(".player-input").addEventListener("change", this.setPlayersAtStart.bind(this));
       
        //On submit for deck form, hide deck form and reveal first deal button
        document.querySelector(".deck-input").addEventListener("change", this.setDecksAtStart.bind(this));

        //On Click for Deal, hide playersAndDecks, start new Round
        document.querySelector(".deal-button").addEventListener("click", this.startGame.bind(this));

    }


    /////Blackjack methods////////////////////

    // *********Get/Set Methods***************


    //Set numer of players at start of Game
    setPlayersAtStart() {
        let value = parseInt(document.querySelector(".player-input").value);
        if(Number.isNaN(value) === false) {
            super.setNumOfPlayers(value);
            this.togglePlayerForm();
            this.toggleDeckForm();
        } else {
            document.querySelector(".blackjack-player-rules").innerText = "Not a valid input. Please input a number between 1 and 8";
        }
    }
    //Set numer of decks at start of Game
    setDecksAtStart() {
        let value = parseInt(document.querySelector(".deck-input").value);
        if(Number.isNaN(value) === false) {
            super.setNumOfDecks(value);
            this.toggleDeckForm();
            this.firstDeal();
        } else {
            document.querySelector(".blackjack-deck-rules").innerText = "Not a valid input. Please input a number between 1 and 8";
        }
    }
    //SetPlayersAndDecks
    setPlayersAndDecks() {
        document.querySelector(".num-of-players").innerText = super.getNumOfPlayers();
        document.querySelector(".num-of-decks").innerText = super.getNumOfDecks();
    }


    // *********Toggle Button/Form Methods***************


    //Toggle New Game Button
    toggleNewGameButton() {
        document.querySelector(".new-game-button").classList.toggle("hidden");
    }


    //Reveal player Form
    togglePlayerForm() {
        document.querySelector(".player-info").classList.toggle("hidden");
    }
    //Reveal Deck Form
    toggleDeckForm() {
        document.querySelector(".deck-info").classList.toggle("hidden");
    }

    //Toggle playersAndDecks
    togglePlayersAndDecks() {
        document.querySelector(".players-and-decks").classList.toggle("hidden");
    }

    //First Deal
     //Shows How many decks and players were picked and shows deal button
     firstDeal() {
        this.togglePlayersAndDecks();
        this.setPlayersAndDecks();
    }

    //Toggle Blackjack Container
    toggleBlackJackContainer() {
        document.querySelector(".blackjack").classList.toggle("hidden");
    }

    // *********Other Methods***************


    //Start Game
    async startGame() {
        // hides player and deck number confirmation
        this.togglePlayersAndDecks(); 
        this.toggleBlackJackContainer(); 

        //creates a deck and shuffles it. Stores deck data in constructor
        await super.createDeck(); 
        super.edtDeckSizeDOM(); //edits the deck size on DOM

        //reveals the player boards from the DOM
        super.togglePlayerContainers(this.numOfPlayers);

        //Starts the first Round
        this.newRound(); 

    }


    //New Round
    async newRound() {

        //Deals out number of cards from the deck
        await super.deal(this.numOfPlayers * 2); 

        //Then deals out the cards to each player and stores them in playerHands array
        for(let i = 0; i < this.numOfPlayers; i++) {
            this.playersHands[i] = ([this.dealData.cards[i], this.dealData.cards[i + this.numOfPlayers]]);
        }
    }   

}

// *************************************
//              PLAYER 
// *********************************** */
class Player  {

    /////Player Constructor////////////////////
    constructor(playerNumber) {
        // *********Variables***************
        this.number = playerNumber;
        this.hand = [];
        this.handCount;
        // this.money = moneyToBet;
    }

    /////Player Methods////////////////////

    // *********Get/Set Methods***************

    //Get/Set Hand
    getHand() {
        return this.hand;
    }
    setHand(arrayOfCards) {
        this.hand = arrayOfCards;
    }
    addToHand(card) {
        this.hand.push(card);
    }
    emptyHand() {
        this.hand = [];
    }


    //Get/Set Money
    // getMoney() {
    //     return this.money;
    // }
    // setMoney(money) {
    //     this.money = money;
    // }


    //Add to/Reset HandCount
    addToHandCount(cardValue) {

    }
    resetHandCount() {
        handCount = 0;
    }

    
    //Add/Remove Cards from DOM
    addCardToDOM() {

    }
    removeCardsFromDOM() {

    }


    //*********Other Methods***************

    //hit/stay/bust/blackjack
    
    //Adds card to field, adding up the count
    hit() {

    }

    //Passes Turn to next player
    stay() {

    }

    //If count over 21, Auto Lose
    bust() {

    }

    //If natural 21, auto win
    checkBlackjack() {
        
    }

    //getValue 
    //changes face card values into numbers
    getValue(value) {
        if(value === "JACK"||
           value === "QUEEN"||
           value === "KING") {
                return 10;
        } else if(value === "ACE") {
            //if current hand count is bigger than 11, ACE value is 1
            return this.handCount > 11 ? 1 : 11;
        } else {
            return Number(value);
        }
    }
}   




// *************************************
//              DEALER  
// *********************************** */
class Dealer extends Player{

    /////Dealer Constructor////////////////////
    constructor() {
        super();
        // *********Variables***************
    }


    /////Dealer Methods////////////////////

    //*********Get/Set Methods***************
    


    //*********Other Methods***************

}



// *************************************
//          SETTING THE STAGE     
// *********************************** */

/////////Variables////////////////////
let blackjack = new Blackjack();
let players = [];
let dealer = new Dealer();

/////////Event Listeners////////////////////

//create player and dealer classes to store hands and update board
document.querySelector(".deal-button").addEventListener("click", createPlayers);



/////////Functions////////////////////

//creates players up to blackjack.numOfPlayers and updates player hands
function createPlayers() {
    for(let i = 0; i < blackjack.getNumOfPlayers(); i++) {
        players[i] = new Player(i+1);
    }
}
