// *************************************
//              DECK
// *********************************** */

class Deck {

    /////Blackjack constructor////////////////////
    constructor() {
        
         // *********Variables***************
        this.deckId;
        this.data;
        this.cardsDrawn;
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
    get cardsDrawn() {
        return this._cardsDrawn;
    }
    set cardsDrawn(cards) {
        this._cardsDrawn = cards;
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
                document.querySelector(".deck-size").innerText = data.remaining;
            })
            .catch(err => {
                console.log(`error ${err}`)
            })
    }

    //test deck

    // async createDeck() {
    //     await fetch(`https://www.deckofcardsapi.com/api/deck/new/?cards=AS,JC,2D,JH,2H,2C,2S,2D,2H,2C,3S,3D,3H`)
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

    // Shuflle 
    // Shuffles all cards back into the deck and rewrites deckData
    async shuffle() {
        await fetch(`https://www.deckofcardsapi.com/api/deck/${this.deckId}/shuffle/`)
        .then(res => res.json())
        .then(data => {
            this.data = data;
            document.querySelector(".deck-size").innerText = data.remaining;
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
                this.cardsDrawn = data.cards;
                document.querySelector(".deck-size").innerText = data.remaining;
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
        this.numOfDecks;
        this.hands = []; //array of players' "hands"
        this.handValues = [];
         // *********Query Selectors***************
        this.newRoundButton = document.querySelector(".new-round-button")
         // *********Event Listeners***************
        this.newRoundButton.addEventListener("click", this.toggleNewRound.bind(this));
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
    get hands() {
        return this._hands;
    }
    //setNumOfPlayers
    set hands(arrayOfCards) {
        this._hands = arrayOfCards;
    }

    //gethandValues
    get handValues() {
        return this._handValues;
    }
    //setHandValues
    set handValues(arrayOfCards) {
        this._handValues = arrayOfCards;
    }



    // *********Toggle Button/Form Methods**************

    toggleNewRound() {
       this.newRoundButton.classList.toggle("hidden");
    }

    // *********Other Methods***************

    //deal 2 cards to player and dealer
    //add cards to playersHands and Values arrays
    deal(cards) {
         for(let i = 0; i < 2; i++) {
            this.hands[i] = [cards[i], cards[i + 2]];
            this.handValues[i] = [this.getValue(cards[i].value), this.getValue(cards[i + 2].value)];
            //check for double aces
            //if both cards are aces, make the second ace a value of 1
            if(this.handValues[i].every((value) => { return value === 11; })) {
                this.handValues[i] = [11,1];
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

    //// Player constructor////////////////////
    constructor() {

         // *********Variables***************
        this.hand = [];
        this.handCount = 0;
        this.handValues = [];
        this.dealCount = 0;
        this.animationCount = 0;

         // *********Query Selectors***************
        this.container = document.querySelector(".player-container");
        this.standButton = this.container.querySelector(".stand-button");
        this.newRoundButton = document.querySelector(".new-round-button");
        this.dealButton = document.querySelector(".deal-button");

         // *********Event Listeners***************
        this.dealButton.addEventListener("click", this.resetDealCount.bind(this));
    }


    /////Player methods////////////////////

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
    
    //set dom count
    setDomCount(num) {
        //if no arguments are passed in, use constructor
        //arguments are for clearing the board (use 0 )
        let handCount;
        num === 0 ? handCount = "" : handCount = this._handCount;
        // if(this.checkBust())
        //     this.container.querySelector(".count").innerText = "BUSTED";
        // else if(this.hasBlackjack())
        //     this.container.querySelector(".count").innerText = "BLACKJACK";
        // else    
        this.container.querySelector(".count").innerText = handCount;
    }
    

    //add to hand
    addToHand(card, value) {
        this._hand.push(card);
        this._handValues.push(value);
        this._handCount += value;
        //set dom handCount
        this.setDomCount();
        //set images
        this.addCardImage(card.image)
    }

    //empty hand and all values
    emptyHand() {
        this._hand = [];
        this._handValues = [];
        this._handCount = 0;
        //set dom handCount
        this.setDomCount(0);
        //set images
        this.removeCardImages();
    }
    

    //addCardImage
    async addCardImage(cardImage) {
        let img = document.createElement("img");
        img.src = cardImage;
        
        let toRight = 50 - (this.dealCount * 3);
        this.createKeyFrame(img, 0, 0, 65, toRight);
        this.dealCount++;
        this.animationCount++;

        img.className = "player-card";
        this.container.appendChild(img);
    }

    // async moveCardImage() {
    //     let allCardImages = this.container.querySelectorAll("img");
    //     let top = "";
    //     let right = "";
    //     allCardImages.forEach(card => {
    //         top = card.style.top;
    //         right = card.style.right;

    //         this.createKeyFrame
    //     });
    // }

    //remove card images
    removeCardImages() {
        let allCards = this.container.querySelectorAll("img");
        allCards.forEach(image => {
            this.container.removeChild(image);
        })
        
    }

    //dealCount - used for card placement
    resetDealCount() {
        this.dealCount = 0;
        this.animationCount = 0;
    }

    createKeyFrame(item,fromTop,fromRight,toTop,toRight) {
        let dynamicStyles = null;

        function addAnimation(body) {
            if (!dynamicStyles) {
                dynamicStyles = document.createElement('style');
                dynamicStyles.type = 'text/css';
                document.head.appendChild(dynamicStyles);
            }

            dynamicStyles.sheet.insertRule(body, dynamicStyles.length);
        }

        addAnimation(`
            @keyframes playerDeal${this.animationCount} { 
                0% {
                    top: ${fromTop}%;
                    right: ${fromRight}%;
                }
                100% {
                    top: ${toTop}%;
                    right: ${toRight}%
                }
            }`);

            item.style.animation = `playerDeal${this.animationCount} 1s forwards`;

            let degrees = Math.floor(Math.random() * 10 - 5);
            item.style.transform = `rotate(${degrees}deg)`
    }
    // *********Toggle Button/Form Methods**************

    
    //player hit or stay div
    toggleHitOrStand() {
        document.querySelector(".player-hit-or-stand").classList.toggle("hidden");
    }

    toggleTie() {
        document.querySelector(".tie").classList.toggle("hidden");
    }

    toggleWin() {
        this.container.querySelector(".win").classList.toggle("hidden");
    }

    toggleWinBlackjack() {
        this.container.querySelector(".win-blackjack").classList.toggle("hidden");
    }
    toggleBust() {
        this.container.querySelector(".bust").classList.toggle("hidden");
    }

    hideWinLose() {
        document.querySelector(".tie").classList.add("hidden");
        this.container.querySelector(".win").classList.add("hidden");
        this.container.querySelector(".bust").classList.add("hidden");
        this.container.querySelector(".win-blackjack").classList.add("hidden");
    }

    // *********Other Methods***************

    //new Round
    newRound(hand, handValues) {
        let i = 0;
         //add values to hand
        function dealCardLoop(item) {
                item.addToHand(hand[i], handValues[i]);
            setTimeout(() => {
                i++;
                if(i < hand.length) {
                    dealCardLoop(item);
                }
            } , 1000);
        }

        dealCardLoop(this);
        this.setDomCount();
    }


    //HIT ME
    hit(card, value) {
        //Once hand count goes over 21
        if(this.handCount + value > 21) {
            //check for ace in hand
            if(this.handValues.includes(11) && this.handValues.includes(1) === false) {
                let index = this.handValues.indexOf(11);
                this.handValues[index] = 1;
                //edit handCount with ace change
                this.handCount = this._handValues.reduce((acc,cV) => 
                    acc + cV, 0);
            //if card flip is an ace, set value to 1
            } else if(value === 11) 
                value = 1;
        }
        //add card and value to hand
        this.addToHand(card,value);
    }

    stand() {
        this.toggleHitOrStand();
    }

    //checks if handCount is over 21, returns true if yes
    checkBust() {
        return this.handCount > 21 ? true : false;
    }
    
    //checks if player gets 21 at the start
    hasBlackjack() {
        return this.handCount === 21 && this.handValues.length === 2 ? true : false;
    }

}


// *************************************
//              DEALER
// *********************************** */

class Dealer extends Player{

    /////Dealer constructor////////////////////
    constructor() {
        super();
         // *********Variables***************

         // *********Query Selectors***************
         this.container = document.querySelector(".dealer-container");

    
        // *********Event Listeners***************
       
    }


    /////Dealer methods////////////////////

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

    //edit count on dom
    setDomCount() {
        super.setDomCount();
    }

    //complete add to hand function
    addToHand(card, value) {
        this._hand.push(card);
        this._handValues.push(value);
        this._handCount += value;
        // //set dom handCount
        this.setDomCount();
        //set images
        if(this.hand.length === 1) {
            this.addFaceDown();
        } else {
            this.addCardImage(card.image);
        }
    }

    emptyHand() {
        super.emptyHand();
    }

    //addCardImage
     addCardImage(cardImage) {
        let img = document.createElement("img");
        img.src = cardImage;
        img.style.zIndex = "1";
       
        //create keyframe
        let toRight = 50 - (this.dealCount * 3);
        this.createKeyFrame(img, 0, 0, 7, toRight, 1);
        this.dealCount++;
        this.animationCount++;

        img.className = "dealer-card";
        this.container.appendChild(img);
    }

    //remove card images
    removeCardImages() {
       super.removeCardImages();
    }

    //add Face-down
    addFaceDown() {
        let div = document.createElement("div");

        //creating keyframe dynamically
        let toRight = 50 - (this.dealCount * 3);
        this.createKeyFrame(div, 0, 0, 7, toRight, 1);
        this.dealCount++;
        this.animationCount++;

        div.className = "dealer-card";
        div.classList.add("face-down");
        this.container.appendChild(div);
    }

    //reveal face-down
    revealFaceDown() {

        //slide facedown over
        let faceDown = document.querySelector(".face-down");
        faceDown.style.top = "7%";
        faceDown.style.right = "50%";

        this.createKeyFrame(faceDown, 7, 50, 7, 47, .3);
       
        //create image of actual card
        let img = document.createElement("img");
        img.src = this.hand[0].image;
        img.style.zIndex = "0";

        img.className = "dealer-card";

        //slide card back over to "flip" it
        setTimeout(() => { 
            this.createKeyFrame(img, 7, 47, 7, 50, .3); 
            this.container.querySelector(".face-down").remove();
            this.container.appendChild(img);
            this.animationCount++;
        }, 300);

        //show dom count
        this.toggleDomCount();

    }

    createKeyFrame(item,fromTop,fromRight,toTop,toRight, time) {
        let dynamicStyles = null;

        function addAnimation(body) {
            if (!dynamicStyles) {
                dynamicStyles = document.createElement('style');
                dynamicStyles.type = 'text/css';
                document.head.appendChild(dynamicStyles);
            }

            dynamicStyles.sheet.insertRule(body, dynamicStyles.length);
        }

        addAnimation(`
            @keyframes dealerDeal${this.animationCount} { 
                0% {
                    top: ${fromTop}%;
                    right: ${fromRight}%;
                }
                100% {
                    top: ${toTop}%;
                    right: ${toRight}%
                }
            }`);

            item.style.animation = `dealerDeal${this.animationCount} ${time}s forwards`;

            let degrees = Math.floor(Math.random() * 10 - 5);
            item.style.transform = `rotate(${degrees}deg)`
    }


    // *********Toggle Button/Form Methods**************

    toggleDomCount() {
        this.container.querySelector(".count").classList.toggle("hidden");
        this.container.querySelector(".newRoundCount").classList.toggle("hidden");
    }

      
    //player hit or stay div

    toggleTie() {
        super.toggleTie();
    }

    toggleWin() {
        super.toggleWin();
    }

    toggleBust() {
        super.toggleBust();
    }

    hideWinLose() {
       super.hideWinLose();
    }
    // *********Other Methods***************
    newRound(hand, handValues) {
        let i = 0;
        let time = 500;
         //add values to hand
        function dealCardLoop(item) {
            setTimeout(() => {
                item.addToHand(hand[i], handValues[i]);
                i++;
                time += 500;
                if(i < hand.length) {
                    dealCardLoop(item);
                }
            } , time);
        }

        dealCardLoop(this);
        this.toggleDomCount();

        //show only first card value for dealer hand count
        this.container.querySelector(".newRoundCount").innerText = handValues[1];
    }


    //HIT ME
    hit(card, value) {
        super.hit(card,value);
    }

    stand() {
        super.stand();
    }

    //checks if handCount is over 21, returns true if yes
    checkBust() {
        return super.checkBust();
    }
    
    // //checks if player gets 21 at the start
    hasBlackjack() {
       return super.hasBlackjack();
    }   

    //checks for a soft 17 or less
    checkSoftSeventeen() {
        if(dealer.handCount < 17 ||
        (dealer.handCount === 17 && dealer.handValues.includes(11))) 
            return true;
        else 
            return false;
    }
}

// *************************************
//              GAME
// *********************************** */


// *********Variables***************
let deck = new Deck();
let blackjack = new Blackjack();
let dealer = new Dealer();
let player = new Player();

// *********Query Selectors ***************

let startTarget = document.querySelectorAll(".chip2")[4];

 // *********Event Listeners***************

 //hit methods
 player.container.querySelector(".hit-button").addEventListener("click", playerHit);

 //deal button
 document.querySelector(".deal-button").addEventListener("click", newRound);

 //player stand button
 player.standButton.addEventListener("click", switchTurns)

//new round button
document.querySelector(".new-round-button").addEventListener("click", betRound);



 // *********Functions***************
async function startGame() {   
    //creates a deck and shuffles it
    await deck.createDeck(4);
}

startGame();

async function betRound() {
    
    addbets();
    if(document.querySelector(".deck-size") < 80) {
        deck.shuffle();
    }
    //reveal deal button
    if(Number(document.querySelector(".bet-tracker").innerText) === 0)
        document.querySelector(".deal-button").classList.add("hidden");
    else 
        document.querySelector(".deal-button").classList.remove("hidden");
        
    document.querySelector(".blackjack").classList.add("hidden");

    //stops darken
    document.querySelector(".bet-container").classList.remove("darken");

    //empty the hands
    player.emptyHand();
    dealer.emptyHand();
    //hide the win divs
    player.hideWinLose();
    dealer.hideWinLose();


}

async function newRound() {

    //hides deal button
    document.querySelector(".deal-button").classList.add("hidden");
    document.querySelector(".blackjack").classList.remove("hidden");
    
    //Deals 2 cards to each player
    await deck.draw(4);
     //takes the stored data in deck.cardsDrawn and deals them out to each player
    blackjack.deal(deck.cardsDrawn);
    //store hand data for each player
    player.newRound(blackjack.hands[0], blackjack.handValues[0]);
    dealer.newRound(blackjack.hands[1], blackjack.handValues[1]);



    setTimeout(() => {
        if(player.hasBlackjack()) {
            dealer.revealFaceDown();
            checkWin();
            //start new round
            blackjack.toggleNewRound();
        }
        else
            player.toggleHitOrStand();
    }, 2500)
    //need to come back to this later
    //if player has blackjack, player wins
   
}

function switchTurns() {
    player.toggleHitOrStand();
    dealer.revealFaceDown();
    //if dealer has to hit, hit
    if(dealer.checkSoftSeventeen())
        setTimeout( () => dealerHit(), 600);
    else {
        //if dealer has a soft 17 or higher, end round
        checkWin();
        //start new round
        blackjack.toggleNewRound();
    }
}   

async function playerHit() {
    //draw cards
    await deck.draw(1);

    //player hit function
    let card = deck.cardsDrawn[0];
    let value = blackjack.getValue(card.value);
    player.hit(card,value);
    
    //check for player bust, edit dom accordingly
    if(player.checkBust() === true) {
        //end the round
        player.stand();
        dealer.revealFaceDown();
        //check who wins
        checkWin();
        //start new round
        blackjack.toggleNewRound();
    }
}

async function dealerHit() {
    //draw cards
    await deck.draw(1);

    //dealer hit function
    let card = deck.cardsDrawn[0];
    let value = blackjack.getValue(card.value);
    dealer.hit(card,value);
    
    //if player bust or dealer has higher than soft 17, end round
    if(dealer.checkBust() || dealer.checkSoftSeventeen() === false) {
        checkWin();
        //start new round
        blackjack.toggleNewRound();
    } else
        setTimeout(() => { dealerHit() }, 900);
    
}

function checkWin() {

    document.querySelector(".bet-container").classList.add("darken");
    //checks for blackjack in both player hands
    if(player.hasBlackjack() && dealer.hasBlackjack()) {
        player.toggleTie();
        //if greater than 21(bust), auto lose
    } else if(player.handCount > 21) {
        player.toggleBust();
        dealer.toggleWin();
        if(Number(document.querySelector(".money").innerText) === 0) {
            setTimeout( () => { gameOver() }, 700);
            blackjack.toggleNewRound();
        }
        //if dealer busts, players auto win
    } else if(dealer.handCount > 21) {
        player.toggleWin();
        dealer.toggleBust();
    } else {
        //if less than 22, check for win, lose, or tie
        if(player.handCount > dealer.handCount || player.hasBlackjack()) {
            player.hasBlackjack() ? player.toggleWinBlackjack() : player.toggleWin();
        } else if(player.handCount < dealer.handCount || dealer.hasBlackjack()) {
            dealer.hasBlackjack() ? dealer.toggleWinBlackjack() : dealer.toggleWin();
            //if player lost, check bank, if 0, game over
            if(Number(document.querySelector(".money").innerText) === 0) {
                setTimeout( () => { gameOver() }, 700);
                blackjack.toggleNewRound();
            }
        } else {
            player.toggleTie();
        }
    }


    
}


// *************************************
//              extras
// *********************************** */

chips2 = document.querySelectorAll(".chip2");
chips2.forEach(chip2 => {
    chip2.addEventListener("click", moveChipToCenter);
})

let money = Number(document.querySelector(".money").innerText);

async function moveChipToCenter(target) {

    // if function was not used as a click event, make target a random
    // chip that is currently shown
    if(target.classList === undefined) {
        target = event.target;
        //select target chip
         if(target.tagName === "P") {
            target = target.parentElement;
        }
    }
    

    //check which chip color was picked and edit position 
    checkColorPosition(target);
    target.classList.remove(checkColorAnimation(target));

    //create a clone and move it to center of board
    let target_prime = target.cloneNode(true);
    document.querySelector(".chips2").appendChild(target_prime);
    await target_prime.classList.add("moveToCenter");

    //class used in check chips
    target_prime.classList.remove("hero");
    //class used in resetBet
    target_prime.classList.add("chip-bet");

    //edit bank accordingly
    money -= Number(target.classList[1]);
    document.querySelector(".money").innerText = money;

    checkChips(money);

    //edit bet accordingly
    let bet = Number(document.querySelector(".bet-tracker").innerText);
    bet += Number(target.classList[1]);
    document.querySelector(".bet-tracker").innerText = bet;

    //add move back to bank event listener
    target_prime.addEventListener("click", moveChipBack);

    document.querySelector(".deal-button").classList.remove("hidden");
}


async function moveChipBack(target) {

    // if function was not used as a click event, make target a random
    // chip that is currently shown
    if(target.classList === undefined) {
        target = event.target;
        //select target chip
         if(target.tagName === "P") {
            target = target.parentElement;
        }
    }

    //edit position - moveToCenter Animation doesn't auto edit position
    target.style.bottom = "44%";
    target.style.left = "38%";
    target.classList.remove("moveToCenter");
    
    //class used in checkChips
    target.classList.add("hero");
    //class used in resetBet
    target.classList.remove("chip-bet");

    //add event listener for the clone
    target.removeEventListener("click", moveChipBack);
    target.addEventListener("click", moveChipToCenter);

    //move clone back to bank
    await target.classList.add(checkColorAnimation(target));

    //edit bank accordingly
    money += Number(target.classList[1]);
    document.querySelector(".money").innerText = money;

    //edit bet accordingly
    let bet = Number(document.querySelector(".bet-tracker").innerText);
    bet -= Number(target.classList[1]);
    document.querySelector(".bet-tracker").innerText = bet;

    checkChips(money);

    if(Number(document.querySelector(".bet-tracker").innerText) === 0)
        document.querySelector(".deal-button").classList.add("hidden");
}

function checkColorPosition(target) {
    let bottom;
    let left;
    switch(target.classList[2]) {
        case "white" :
            bottom = "20.8%";
            left = "5.3%";
            break;
        case "red" :
            bottom = "20.8%";
            left = "16.7%";
            break;
        case "green" :
            bottom = "20.8%";
            left = "28.5%";
            break;
        case "orange" :
            bottom = "20.8%";
            left = "39.7%";
            break;
        case "black" :
            bottom = "20.8%";
            left = "51.2%";
            break;
        case "pink" :
            bottom = "6%";
            left = "5.3%";
            break;
        case "purple" :
            bottom = "6%";
            left = "16.7%";
            break;
        case "yellow" :
            bottom = "6%";
            left = "28.5%";
            break;
        case "light-blue" :
            bottom = "6%";
            left = "39.7%";
            break;
        case "brown" :
            bottom = "6%";
            left = "51.2%";
            break;
        default:
            console.log(target.classList[2]);
     }

     target.style.bottom = bottom;
     target.style.left = left;
}


function checkColorAnimation(target) {

    let moveColor;
    switch(target.classList[2]) {
        case "white" :
            moveColor = "moveBackWhite";
            break;
        case "red" :
            moveColor = "moveBackRed";
            break;
        case "green" :
            moveColor = "moveBackGreen";
            break;
        case "orange" :
            moveColor = "moveBackOrange";
            break;
        case "black" :
            moveColor = "moveBackBlack";
            break;
        case "pink" :
            moveColor = "moveBackPink";
            break;
        case "purple" :
            moveColor = "moveBackPurple";
            break;
        case "yellow" :
            moveColor = "moveBackYellow";
            break;
        case "light-blue" :
            moveColor = "moveBackBlue";
            break;
        case "brown" :
            moveColor = "moveBackBrown";
            break;
        default:
            console.log(target.classList[2]);
     }

     return moveColor;
}

//checks chips that show in bank once bank money changes
function checkChips(money) {

    let chips = document.querySelectorAll(".chip");
    let heroes = document.querySelectorAll(".hero");

    //hides/shows chip on top
    heroes.forEach(hero => {
        if(Number(hero.textContent) > money) 
            hero.classList.add("invisible")
        else
            hero.classList.remove("invisible")
    })

     //hides/shows chip stack
     chips.forEach(chip => {
        if(Number(chip.textContent) > money) 
            chip.classList.add("invisible")
        else
            chip.classList.remove("invisible")
    })
}


document.querySelector(".all-in-button").addEventListener("click", allIn) 


async function allIn() {

    money = Number(document.querySelector(".money").innerText);
    let count = 0;
    let currentChips = [...document.querySelectorAll(".hero")];
    let randomChip = "";
    let zIndex = 100;

    for(let i = 10; i < currentChips.length; i++) {
        currentChips[i].remove();
    }
    currentChips.splice(10);
    
    // subtract random chips until 0
    while(money > 0) {

        //find a random chip
        count = 0;
        currentChips.forEach(chip => {
            if(chip.classList.contains("invisible") === false)
                count++;
        })

        randomChip = currentChips[Math.floor(Math.random() * count)];
       
        //move chip to center, subtract from bank
        await moveChipToCenter(randomChip);

        randomChip.style.zIndex = zIndex;
        if(zIndex > 0) {
            zIndex--;
        }
    }
}

document.querySelector(".reset-bet-button").addEventListener("click", resetBet);


function resetBet() {
    chipsCurrentlyBet = document.querySelectorAll(".chip-bet");
    chipsCurrentlyBet.forEach(chip => {
        moveChipBack(chip);
    })
    checkChips(money);
}


document.querySelector(".deal-button").addEventListener("click", moveDiv);
document.querySelector(".new-round-button").addEventListener("click", moveDivBack);
document.querySelector(".game-over-button").addEventListener("click", moveDivBack);

function moveDiv() {

    document.querySelector(".bet").classList.add("moveDiv");
    document.querySelector(".bet").classList.remove("moveDivBack");

    let chips = document.querySelectorAll(".hero");

    chips.forEach(chip => {
        chip.classList.add("moveChip")
        chip.classList.remove("moveChipBack")
    })

    document.querySelector(".reset-bet-button").classList.add("hidden");
}

function moveDivBack() {

    document.querySelector(".bet").classList.add("moveDivBack");
    document.querySelector(".bet").classList.remove("moveDiv");
    
    let chips = document.querySelectorAll(".chip2");

    chips.forEach(chip => {
        chip.classList.add("moveChipBack")
        chip.classList.remove("moveChip")
    })

    document.querySelector(".reset-bet-button").classList.remove("hidden");
}

document.querySelector(".deal-button").addEventListener("click", () => {
    let chipsInCenter = [...document.querySelectorAll(".chip2")];
    chipsInCenter.splice(0,10);
    chipsInCenter.forEach(chip => {
        chip.removeEventListener("click",moveChipBack);
    })
})

//redo
async function addbets() {

    money = Number(document.querySelector(".money").innerText);
    let bet = Number(document.querySelector(".bet-tracker").innerText);

    let win = document.querySelector(".player-container").querySelector(".win");
    let blackjackWin = document.querySelector(".player-container").querySelector(".win-blackjack");
    let tie = document.querySelector(".tie");

    if(win.classList.contains("hidden") === false)
        bet *= 2;
    else if(blackjackWin.classList.contains("hidden") === false)
        bet *= 2.5;
    else if(tie.classList.contains("hidden") === false)
        bet = bet;
    else {
        bet = 0;
    }

    money += bet;

    document.querySelector(".money").innerText = money;
    document.querySelector(".bet-tracker").innerText = 0;

    checkChips(money);

    let chipsInCenter = [...document.querySelectorAll(".chip-bet")];
    chipsInCenter.forEach(chip => {
        chip.remove();
    });
    
    //delete all extra clones if there are any
    let allHeroes = document.querySelectorAll(".hero");

    for(let i = 10; i< allHeroes.length; i++) {
        document.querySelector(".chips2").removeChild(allHeroes[i]);
    }

}


//game over 
function gameOver() {
    document.querySelector(".game-over-container").classList.remove("hidden");
}

document.querySelector(".game-over-button").addEventListener("click", async () => {


    deck.shuffle();

    document.querySelector(".game-over-container").classList.add("hidden");

    money = 1000;

    document.querySelector(".money").innerText = money;
    document.querySelector(".bet-tracker").innerText = 0;

    // moveChipToCenter(startTarget)
    checkChips(money);

    let chipsInCenter = [...document.querySelectorAll(".chip-bet")];
    chipsInCenter.forEach(chip => {
        chip.remove();
    });
    
    //delete all extra clones if there are any
    let allHeroes = document.querySelectorAll(".hero");

    for(let i = 10; i< allHeroes.length; i++) {
        document.querySelector(".chips2").removeChild(allHeroes[i]);
    }

    //reveal deal button
    document.querySelector(".deal-button").classList.remove("hidden");
    document.querySelector(".blackjack").classList.add("hidden");

    //stops darken
    document.querySelector(".bet-container").classList.remove("darken");

    //empty the hands
    player.emptyHand();
    dealer.emptyHand();
    //hide the win divs
    player.hideWinLose();
    dealer.hideWinLose();

});



moveChipToCenter(startTarget)
