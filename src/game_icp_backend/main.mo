import Debug "mo:base/Debug";

actor Game {
    // Card data structure
    public type Card = {
        name: Text;
        element: Text;
    };

    // Dice data structure
    public type Dice = {
        element: Text;
        var face: Nat;
    };

    // Player data structure
    public type Player = {
        var hp: Nat;
        var shield: Nat;
        handSize: Nat;
        var deck: [Card];    // Make deck mutable
        var gold: Nat;
        var dicePool: [Dice]; // Make dicePool mutable
    };

    // Monster data structure
    public type Monster = {
        var name: Text;
        var hp: Nat;
        var shield: Nat;
    };

    // Function to create a list of cards and dice and add to player's deck and dice pool
    func createDeckAndDicePool(player: Player, cards: [Card], dice: [Dice]) : async () {
        player.deck := cards;
        player.dicePool := dice;
    };

    // Function to set a face on a dice in the dice pool at a specific index
    func setDiceFace(player: Player, index: Nat, newFace: Nat) : async () {
        if (index < player.dicePool.size()) {
            player.dicePool[index].face := newFace;
        } else {
            Debug.print("Invalid dice index.");
        };
    };

    func modifyGold(player: Player, newHp: Nat, newShield: Nat, newGold: Nat) : async () {
        player.hp := newHp;
        player.shield := newShield;
        player.gold := newGold;
    };


    // Function to modify player's hp, shield, and gold
    func modifyStats(player: Player, newHp: Nat, newShield: Nat, newGold: Nat) : async () {
        player.hp := newHp;
        player.shield := newShield;
        player.gold := newGold;
    };

        public func Initialize() : async () {
        // Creating sample cards and dice as mutable arrays
        var cards: [Card] = [
            {name = "Fireball"; element = "Fire"},
            {name = "Ice Shard"; element = "Ice"},
        ];

        var dice: [Dice] = [
            {element = "Fire"; var face = 0},
            {element = "Ice"; var face = 0},
        ];

        // Creating a player with explicit `var` for each mutable field
        var player: Player = {
            var hp = 100;
            var shield = 50;
            handSize = 5;
            var deck = [];
            var gold = 10;
            var dicePool = [];
        };

        // Populating player's deck and dice pool
        await createDeckAndDicePool(player, cards, dice);

        // Changing the face of a dice
        await setDiceFace(player, 0, 3);

        // Modifying player stats
        await modifyStats(player, 20, 0, 0);
    };

}
