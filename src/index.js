import Platform from './components/Platform.js';
import ElementsUtil from './components/utils/ElementsUtil.js';
// import './styles.css'

const elel = ElementsUtil.createElement('div', {
    class: 'koko',
    id: '1312',
    dataset: {
        koko: 1,
        dsda: '22'
    },
    style: {
        width: '300px',
        height: '222px'
    }
});

console.dir(elel);

const platform = new Platform(800, 800);

platform.drawMap();
platform.handleUnitSelectionStage();

// platform.handleStartGame();


// BUGS: 

// 1. Activating an unit, if we click on enemy unit, the activated uits atacks isMainThread, nomather the distance (cels)
// 2. If p1 picks a faction, p2 can still pick the same faction (remove the awready selected faction)
// 3. Make ElementUtil and use it, make optimization  of rendering
// 4. Energy units, not working properly when hiting 100 energy
// 5. Rage units sometimes atack an enemy with  a damege numbers like 67.5372 (round them up)

// const a = 213;
// console.log(a);

/*
    WAR OF FACTIONS

    1 v 1 - Turn base strategy game
    
    Each pick a faction in the beginning (Dwarfs, Elves, Orcs, Humans, Undead).
    Each user has HP (will be decided if it will be <3 based or number based).
    Each time a unit dies the Player Hp is Lowered.

    User starts with 3 units, by choice.
    With each unit killed the Player gets Essences, with this essences he can buy new Units from a Unit pool.

    On a random turn during the game, An Essences Cluster or a Health Crystal will appear on the map.

    Essences Cluster: If an players unit reached the cluster, the player gets to Buy one Unit from the pool.
    Health Crystal: If an players unit reaches the crystal, the player gets his HP rejuvenated with a particular amount.

    During the units life on the game map, each faction has specific bonuses based on the map position they are 
    e.g (Dwarfs have increased HP on a mountain terrain, Elves have Increased DMG on forest terrain )

    Winning: If HP of opponent reaches zero or he leaves with no units on the map
*/