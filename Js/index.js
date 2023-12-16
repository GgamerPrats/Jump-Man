(() => {
    const principalScreen = document.querySelector('.principal-screen');
    const mario = document.querySelector('.mario');
    const pipe = document.querySelector('.pipe');
    const play = document.querySelector('.play');
    const pontos = document.querySelector('.pontos');
    const highscore = document.querySelector('.highscore');
    let root = document.querySelector(':root');

    const jumpSound = new Audio('.//Audio/Jump.mp3');
    const damageSound = new Audio('.//Audio/Damage.mp3');
    const deadSound = new Audio('.//Audio/Dead.mp3');
    const music = new Audio('.//Audio/Music.mp3');

    const gameWidth = +window.getComputedStyle(principalScreen).width.replace('px', '');
    const gameHeight = +window.getComputedStyle(principalScreen).height.replace('px', '');

    let ponto = 0;
    let speed = 3000;

    let savedHighscore = localStorage.getItem('highscore');
    let currentHighscore = savedHighscore ? parseInt(savedHighscore) : 0;

    highscore.innerText = currentHighscore;

    const classes = {
        gameRunning: 'game-running',
        big: 'big',
        small: 'small',
        jump: 'jump',
        animation: 'animation',
        animationPipe: 'animation-pipe',
        fall: 'fall',
        pipeslide: 'pipeslide',
        dead: 'dead'
    };

    const images = {
        normalMarioWalking: './Imgs/normal-mario-walking.gif',
        normalMarioJumping: './Imgs/normal-mario-jumping.png',
        tinyMarioWalking: './Imgs/tiny-mario-walking.gif',
        tinyMarioJumping: './Imgs/tiny-mario-jumping.png',
        marioDead: './Imgs/mario-dead.png',
        marioDeadAnimation: './Imgs/mario-dead-animation.gif'
    };

    jogo = () => {
        (start = () => {
            play.style.display = 'none';
            principalScreen.classList.add(classes.gameRunning);

            music.play();
            music.loop = true;

            mario.classList.add(classes.big);
            mario.classList.remove(classes.dead);
            mario.src = images.normalMarioWalking;
            mario.style.bottom = 0;

            pipe.classList.add(classes.animationPipe);

            pontos.innerText = 0;
            ponto = 0;
            speed = 3000;
            root.style.setProperty('--speed', `${speed}ms`);

            setTimeout(() => {
                mario.classList.remove(classes.animation);
            }, 100);
        })();

        let pontuacaoInterval;
        let speedInterval;

        speedInterval = setInterval(() => {
            if (speed > 1500) {
                speed -= 1;
                root.style.setProperty('--speed', `${speed}ms`);
            }
            if (speed <= 1500 && speed > 1000) {
                speed -= 0.5;
                root.style.setProperty('--speed', `${speed}ms`);
            }
        }, 150);

        pontuacaoInterval = setInterval(() => {
            ponto++;
            pontos.innerText = ponto;
        }, 10);

        function jump(e) {
            if (mario.classList.contains(classes.big)) {
                mario.classList.add(classes.jump);
                mario.src = images.normalMarioJumping;
                jumpSound.play();

                setTimeout(() => {
                    mario.classList.remove(classes.jump);
                    mario.src = images.normalMarioWalking;
                }, 1100);
            }
            if (mario.classList.contains(classes.small)) {
                mario.classList.add(classes.jump);
                mario.src = images.tinyMarioJumping;
                jumpSound.play();

                setTimeout(() => {
                    if (mario.classList.contains(classes.animation) || mario.classList.contains(classes.dead)) return;
                    mario.classList.remove(classes.jump);
                    mario.src = images.tinyMarioWalking;
                }, 1100);
            }
        }

        document.addEventListener('keydown', (e) => {
            if (mario.classList.contains(classes.jump) || mario.classList.contains(classes.animation) || mario.classList.contains(classes.dead)) return;
            if (e.keyCode === 32 || e.keyCode === 38 || e.keyCode === 87) {
                jump(e);
            }
        });
        document.addEventListener('click', (e) => {
            if (mario.classList.contains(classes.jump) || mario.classList.contains(classes.animation) || mario.classList.contains(classes.dead)) return;
            jump(e);
        });

        let hitboxInterval;

        hitboxInterval = setInterval(() => {
            let pipePosition = pipe.offsetLeft;
            let marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

            const pipeLeft = Math.round(gameWidth * 0.12);
            const pipeRight = Math.round(gameWidth * -0.075);
            const minJump = Math.round((gameHeight * 0.18) * 1000) / 1000;

            if (pipePosition >= pipeRight && pipePosition <= pipeLeft && marioPosition <= minJump) {
                if (mario.classList.contains('animation') || mario.classList.contains('dead')) return;

                if (mario.classList.contains(classes.big)) {
                    mario.classList.add(classes.animation);

                    const pipePositionNow = pipePosition;
                    const mariopositionNow = marioPosition;
                    root.style.setProperty('--left', `${pipePositionNow}px`);
                    root.style.setProperty('--height', `${mariopositionNow}px`);

                    pipe.classList.remove(classes.animationPipe);
                    mario.classList.remove(classes.jump);
                    pipe.style.left = `${pipePosition}px`;
                    mario.style.bottom = `${marioPosition}px`;

                    damageSound.play();

                    let animation1 = setInterval(() => {
                        mario.src = images.tinyMarioWalking;
                    }, 150);
                    let animation2 = setInterval(() => {
                        mario.src = images.normalMarioWalking;
                    }, 300);

                    setTimeout(() => {
                        clearInterval(animation2);
                        clearInterval(animation1);

                        mario.classList.remove(classes.big);
                        mario.classList.add(classes.small);

                        mario.classList.add(classes.fall);
                        pipe.classList.add(classes.pipeslide);

                        mario.src = images.tinyMarioWalking;
                    }, 1000);
                    setTimeout(() => {
                        mario.classList.remove(classes.fall);
                        pipe.classList.remove(classes.pipeslide);

                        root.style.setProperty('--left', 0);
                        root.style.setProperty('--height', 0);

                        mario.style.bottom = 0;

                        mario.classList.remove(classes.animation);
                        pipe.classList.add(classes.animationPipe);

                    }, 1500);
                }
                if (mario.classList.contains(classes.small)) {
                    const mariopositionNow = marioPosition;
                    root.style.setProperty('--height', `${mariopositionNow}px`);

                    mario.classList.remove(classes.small);
                    mario.classList.add(classes.dead);

                    pipe.classList.remove(classes.animationPipe);
                    mario.classList.remove(classes.jump);
                    pipe.style.left = `${pipePosition}px`;
                    mario.style.bottom = `${marioPosition}px`;

                    mario.src = images.marioDead
                    mario.classList.add(classes.dead);

                    music.pause();
                    music.currentTime = 0;
                    deadSound.play();
                    clearInterval(pontuacaoInterval);
                    clearInterval(speedInterval);

                    pontuacaoInterval = 0;

                    setTimeout(() => {
                        mario.src = images.marioDeadAnimation;
                    }, 500);

                    setTimeout(() => {
                        play.style.display = 'flex';
                        if (+pontos.innerText > currentHighscore) {
                            currentHighscore = pontos.innerText;
                            highscore.innerText = currentHighscore;

                            localStorage.setItem('highscore', currentHighscore.toString());
                        }

                        mario.src = images.marioDead;
                        principalScreen.classList.remove(classes.gameRunning);

                        clearInterval(hitboxInterval);
                    }, 3010);
                }
            }
        }, 10);
    }

    document.addEventListener('click', () => {
        if (principalScreen.classList.contains(classes.gameRunning)) return;
        jogo();
    });
})();
