# Battleships

Simple battleships game. Play against AI and sink its battleships.

## How to play

Click coordinates on opponents game area on your turn to fire.
To win, find and destroy all enemy ships before enemy destroyes yours.
You get points based on number of rounds it took to destroy all enemy ships.
The less rounds the game lasted, the more points you get. Maximum points are 1000.

Game saves automatically after each round.
Last saved game is automatically restored when game starts. Press **New Game** to reset saves.

## Modules

The game sources are split in multiple modules for easier management.
Below is an image describing game structure.

![Battleships modules](https://gitlab.rd.tut.fi/kallone2/wsd17-devnull/blob/master/src/js_games/battleships/modules.png)

Here is a shord description for modules. More detailed information can be found in the source files.

- **battleships**: Responsible for UI and controls.

- **Communication**: Responsible for implementing communication between the game and the game store.

- **GameLogic**: Responsible for maintaining game state.

- **GameArea**: Represents one player's area.

- **GameSquare**: Represents a single square on GameArea. Responsible for drawing itself.

- **Ship**: Represents a signle ship on game area.

- **GameAI**: Makes decisions for the computer opponent.

- **Coordinate**: Represents a location on game area.

- **GameState**: Is used for storing saved game state.

- **HitInfo**: Result of an hit action on Game Area.

## Testing

The game was developed using the TDD (Test Driven Development) method. Tests are implemented using
the Jasmine testing framework. Instructions for Linux:

Install jasmine:
```sh
sudo apt-get install nodejs npm
sudo ln -s /usr/bin/nodejs /usr/bin/node # Not always necessary
npm jasmine -g
```

Run tests: 
```sh
# In this directory
jasmine
```
