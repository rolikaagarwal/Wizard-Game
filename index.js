const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

let moveSound = new Audio('sound.mp3');

canvas.width = 1250;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;



const background = new sprite({
    position: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 215
    },
    imageSrc: './img/Background.png',
    scale: {
        x: 1.349,
        y: 1
    },
})

const shop = new sprite({
    position: {
        x: 800,
        y: 170
    },
    
    imageSrc: './img/shop.png',
    scale: {
        x: 2.75,
        y: 2.75
    },
    maxFrames: 6,
})

const player = new fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    color: 'red',
    imageSrc: './img/Wizard Pack/idle.png',
    maxFrames: 8,
    scale: {
        x: 1.7,
        y: 1.7
    },
    offset: {
        x: -50,
        y: 148
    },
    sprites: {
        idle: {
            imageSrc: './img/wizard pack/idle.png',
            maxFrames: 6,
        },
        run: {
            imageSrc: './img/wizard pack/run.png',
            maxFrames: 8,
        },
        jump: {
            imageSrc: './img/wizard pack/jump.png',
            maxFrames: 2,
        },
        fall: {
            imageSrc: './img/wizard pack/fall.png',
            maxFrames: 2,
        },
        attack1: {
            imageSrc: './img/wizard pack/attack3.png',
            maxFrames: 4,
        },
        takeHit: {
            imageSrc: './img/wizard pack/hit.png',
            maxFrames: 4,
        },
        death: {
            imageSrc: './img/wizard pack/death.png',
            maxFrames: 7,
        },
    },

    attackBox: {
        offset: {
            x: 190,
            y: -20,
        },
        width: 255,
        height: 50,
    }
})

const enemy = new fighter({
    position: {
        x: 760,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    color: 'blue',
    imageSrc: './img/kenji/idle.png',
    maxFrames: 4,
    scale: {
        x: 2.5,
        y: 2.5
    },
    offset: {
        x: 215,
        y: 230
    },
    sprites: {
        idle: {
            imageSrc: './img/kenji/idle.png',
            maxFrames: 4,
        },
        run: {
            imageSrc: './img/kenji/run.png',
            maxFrames: 8,
        },
        jump: {
            imageSrc: './img/kenji/jump.png',
            maxFrames: 2,
        },
        fall: {
            imageSrc: './img/kenji/fall.png',
            maxFrames: 2,
        },
        attack1: {
            imageSrc: './img/kenji/attack3.png',
            maxFrames: 3,
        },
        takeHit: {
            imageSrc: './img/kenji/take hit.png',
            maxFrames: 3,
        },
        death: {
            imageSrc: './img/kenji/death.png',
            maxFrames: 7,
        },
    },
    attackBox: {
        offset: {
            x: -380,
            y: -30,
        },
        width: 170,
        height: 50,
    },

})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },

    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
}


function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x
        && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
        && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}
//Determine Winner
function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId);

    document.querySelector('#displayText').style.display = 'flex';

    if (player.health === enemy.health) document.querySelector('#displayText').innerHTML = 'Tie';
    else if (player.health > enemy.health) document.querySelector('#displayText').innerHTML = 'Player 1 Wins!!';
    else if (player.health < enemy.health) document.querySelector('#displayText').innerHTML = 'Player 2 Wins!!';
}
//Timer Countdown
let timer = 60;
let timerId;
function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000);
        timer--;
        document.querySelector('#timer').innerHTML = timer;
    }
    if (timer === 0) {
        determineWinner({ player, enemy, timerId });
    }
}
decreaseTimer();

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = ('black');
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    c.fillStyle = 'rgba(255,255,255,0.06)';
    c.fillRect(0,0,canvas.width,canvas.height);
    player.update();
    enemy.update();
    

    //Player Movement
    player.velocity.x = 0;

    if (keys.a.pressed && player.lastkey === 'a') {
        
        player.velocity.x = -5;
        player.switchSprite('run');
        console.log("run")
    }
    else if (keys.d.pressed && player.lastkey === 'd') {
        player.velocity.x = 5;
        player.switchSprite('run');
    }
    else {
        player.switchSprite('idle');
    }

    //Jump
    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    }
    else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }

    //Enemy Movement
    enemy.velocity.x = 0;
    if (keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft') {
        enemy.velocity.x = -5;
        enemy.switchSprite('run');
    }
    else if (keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight') {
        enemy.velocity.x = 5;
        enemy.switchSprite('run');
    }
    else {
        enemy.switchSprite('idle');
    }

    //Jump
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    }
    else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall');
    }


    //Detect Collision
    if (rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
        player.isAttacking
        && player.currentFrames === 1) {
        enemy.takeHit();
        player.isAttacking = false;

        // document.querySelector('#enemyHealth').style.width = enemy.health + '%';
        gsap.to('#enemyHealth',{
            width: enemy.health + '%',
        })
        console.log("Player Attack");
    }

    if (player.isAttacking && player.currentFrames === 1) player.isAttacking = false;

    if (rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
        enemy.isAttacking
        && enemy.currentFrames === 1) {
        player.takeHit();
        enemy.isAttacking = false;

        // document.querySelector('#playerHealth').style.width = player.health + '%';
        gsap.to('#playerHealth',{
            width: player.health + '%',
        })
        console.log("Enemy Attack");
    }

    if (enemy.isAttacking && enemy.currentFrames === 1) enemy.isAttacking = false;


    //winner
    if (enemy.health <= 0 || player.health <= 0) determineWinner({ player, enemy, timerId });
}
animate();

window.addEventListener('keydown', (event) => {
    if (!player.dead) {

        switch (event.key) {
            //Player
            case 'd':
                keys.d.pressed = true;
                player.lastkey = 'd';
                break;

            case 'a':
                keys.a.pressed = true;
                player.lastkey = 'a';
                break;

            case 'w':
                player.velocity.y = -20;
                break;

            case ' ':
                player.attack();
                break;

             
        }
    }


    //Enemy
    if (!enemy.dead) {
        switch (event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                enemy.lastkey = 'ArrowRight';
                break;

            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                enemy.lastkey = 'ArrowLeft';
                break;

            case 'ArrowUp':
                enemy.velocity.y = -20;
                break;

            case 'ArrowDown':
                enemy.attack();
                break;
        }
    }
})

window.addEventListener('keyup', (event) => {
    if(!player.dead){
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            break;

        case 'a':
            keys.a.pressed = false;
            break;
    }
}

    if(!enemy.dead){
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;

        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
    }

}

})


audio = new Audio('sound.mp3');
// audio.play();
setTimeout(()=>{
    try {
        audio.play()
    } catch (error) {
        console.log("play");
    };
    
},1000);


