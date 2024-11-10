Game On Chain ICP

If you want to start working on your project right away, you might want to try the following commands:

cd game_icp/
npm i

Running the project locally

If you want to test your project locally, you can use the following commands:

Starts the replica, running in the background
dfx start --background

Deploys your canisters to the replica and generates your candid interface
dfx deploy


Game Overview:

1.Card Randomization

In each round, players draw a random cards until it reach player maximum handsize.
Each card has a unique ability, including:
Attack Cards: Used to deal damage to enemies.
Armor Cards: Increases the player’s defense.
HP Recovery Cards: Restores the player’s health.
Extra Draw Cards: Allows the player to draw additional cards in the next round.

2.Dice Rolling

After select the card from player hand, players roll all of the dice in their dice pool.
The number rolled (1-6) determines the power of the cards that player select will depend on the sum result from all of the same element dice that they put on the card. For example, we roll 2 fire dice and the roll result is 4,6 then, when we put the both of them (dice) into the card that player select the card will do damage to enemy from 4+6 = 10 damage.

3.Gameplay

Players battle against monsters using the cards fron they deck.
The goal is to defeat all of the monsters before the player’s health runs out.

4.Transparent Randomization on ICP Chain

All randomization, including card draws and dice rolls, is performed on the ICP Chain.
Players can verify the results of each random event, ensuring fairness and transparency.

Project Vision:

The project is currently in its prototype phase, offering a streamlined version with a limited set of features. The goal is to focus on the core gameplay mechanics and establish a foundation for future development.


Key Objectives:
Core Functionality: Provide a basic yet engaging experience with essential features such as card randomization, dice rolling, and transparent randomization on the ICP Chain.
Transparency and Fairness: Ensure all randomization processes are fully verifiable to build trust with players.
User Feedback: Gather valuable insights from early users to improve and expand the game in future updates.


Future Development Roadmap :

To enhance the gaming experience and increase long-term engagement, we plan to introduce the following features:
-Improve accessibility for all user by web3
-Token System on ICP Chain
-Implement a token system on the ICP Chain, allowing players to trade, purchase, and earn rewards within the game.
-NFT for Card or Character Marketplace
-Launch an NFT Marketplace for buying and selling cards or characters.
-Each character will have unique attributes, such as health points (HP) or an attack power multiplier.
More Levels and Challenges
-Expand the game with a wider variety of levels to increase the challenge and excitement.
-Each level will feature different difficulty settings and enemies with special abilities.
-Weekly Leaderboard Rewards
-Implement a leaderboard system to rank players based on their scores or achievements.
-Top-ranking players will receive special rewards every week, such as tokens or in-game items.