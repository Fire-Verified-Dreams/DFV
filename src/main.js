import kaboom from "../node_modules/kaboom/dist/kaboom"

kaboom({
	width: 1280,
	height: 720,
	font: "sinko",
	debug: true,
	background: [51, 151, 255],

});

//variables
let numJumps = 0;


//LOADING ASSETS
loadSprite("knight", "../sprites/Knight/Idle/Idle-Sheet.png", {
	sliceX: 4,
	anims: {
		idle: {
			from: 0,
			to: 3,
		}
	},
})
loadSprite("portal", "../sprites/portal2.gif")
loadSprite("run", "../sprites/Knight/Run/run-sheet2.png", {
	sliceX: 6,
	anims: {
		run: {
			from: 0,
			to: 5,
		}
	},
})
loadSprite("tiles", "../sprites/nature/tileset.png", {
	sliceX: 7,
	sliceY: 11,
})

loadSprite("shadow", "../sprites/bg/shadow.png", {
	sliceX: 7,
	sliceY: 11,
})


loadSprite("start_bg", "../sprites/start.png")

loadSprite("cloud", "../sprites/mario/cloud.png")
loadSprite("mountains", "../sprites/bg/mountains.png")
loadSprite("sky", "../sprites/bg/sky.png")
loadSprite("stars", "../sprites/bg/space.png")
loadAseprite("enemies", "../sprites/mario/enemies.png", "../sprites/mario/enemies.json");
loadSound("death", "../sounds/death.mp3")
loadSound("jump", "../sounds/jump.mp3")
loadSound("hurt", "../sounds/hurt.mp3")
loadSound("start", "../sounds/game-start.mp3")
loadSound("background_music", "../sounds/background_music.mp3")

loadSprite("bg", "sprites/bg.png");
loadSprite("lavaland", "sprites/lavaland.png");
loadSprite("rock", "sprites/rock.png");
loadSprite("skull", "sprites/skull.png");

loadSprite("fullHealth", "../sprites/fullHealth.png");
loadSprite("halfHealth", "../sprites/halfHealth.png");
loadSprite("oneHealth", "../sprites/oneHealth.png");

///////////
//LEVEL 1//
///////////

scene("level1", () => {
	const fallThreshold = height() + 400;

	const bgLayer1 = add([
		sprite("sky"),
		pos(-700, -350),
		scale(11),
		layer("bg"),
		// {
		//   speed: 0.2
		// }
	])
	let hp = add([
		sprite("fullHealth"),
		pos(0, 0),
		scale(0.2),
		fixed(),
		layer("ui")
	])
	addLevel([
		"          ;                           ;  ",
		"      ;                      ;           ",
		"             ;                    ;      ",
		"                                         ",
		"  ;     ;              E                 ",
		"                      000    	   ;      ",
		"    ;                       	          ",
		"				 					      ",
		"                          000  	     9 ",
		"              000               	      ",
		"  ^                     ^    		      ",
		"  |                     |     	E	      ",
		"  * .      0. E #  E0   *  #  -=!.  #    ",
		"-======! = -========!  -======,,,=======!",
		",,,,,,,, , ,,,,,,,,,,  ,,,,,,,,,,,,,,,,,,",
	],
		{
			// define the size of each block
			width: 60,
			height: 60,
			// define what each symbol means, by a function returning a component list (what will be passed to add())
			"-": () => [
				sprite("tiles", {
					frame: 0
				}),
				scale(4),
				area(),
				solid(),
			], "9": () => [
				sprite("portal"),
				scale(.75),
				area(),
				"portal"

			], ",": () => [
				sprite("tiles", {
					frame: 8
				}),
				scale(4),
				area(),
				solid(),
			],
			"E": () => [
				sprite("enemies", { anim: "Walking" }),
				area(),
				body(),
				scale(2.5),
				health(1),
				patrol(),
				color(148, 0, 211),
				"bad"
			],
			";": () => [
				sprite("cloud", {
					frame: 0
				}),
				scale(4),
				area(),

			],
			"#": () => [
				sprite("tiles", {
					frame: 48
				}),
				scale(4),
				area(),

			],
			".": () => [ //rock
				sprite("tiles", {
					frame: 47
				}),
				scale(4),
				area(),

			],
			"^": () => [
				sprite("tiles", {
					frame: 23
				}),
				scale(4),
				area(),

			],
			"|": () => [
				sprite("tiles", {
					frame: 30
				}),
				scale(4),
				area(),

			],
			"*": () => [
				sprite("tiles", {
					frame: 37
				}),
				scale(4),
				area(),

			],
			"0": () => [
				sprite("tiles", {
					frame: 6
				}),
				scale(4),
				area(),
				solid(),
			],
			"!": () => [
				sprite("tiles", {
					frame: 2
				}),
				scale(4),
				area(),
				solid(),
			],
			"=": () => [
				sprite("tiles", {
					frame: 1
				}),
				scale(4),
				area(),
				solid(),
				"floor"
			],

		})

	const player = add([
		sprite("run", {
			frame: 0
		}),
		health(3),
		area(),
		pos(50, 650),
		body(),
		scale(2),
		{
			invincible: false,
			dir: 1.5
		},
		"player"
	])

	// runs code constantly on the player
	player.onUpdate(() => {
		camPos(player.pos)
		if (player.pos.y > fallThreshold) {
			player.hurt(3);
		}
		if (player.hp() == 2) {
			hp = add([
				sprite("halfHealth"),
				pos(0, 0),
				scale(0.2),
				fixed(),
				destroy(hp),
				layer("ui")
			])
		}
		else if (player.hp() == 1) {
			hp = add([
				sprite("oneHealth"),
				pos(0, 0),
				scale(0.2),
				fixed(),
				destroy(hp),
				layer("ui")
			])
		}
	})
	//////////
	//MOVEMENT
	//////////
	//jump
	player.onUpdate(() => {
		if (player.isGrounded()) {
			numJumps = 0;
		}
	});
	onKeyPress("space", () => {
		if (player.isColliding && numJumps < 2) {
			player.jump();
			play("jump");
			numJumps += 1;
		}
	});
	//left
	onKeyPress("a", () => {
		player.play("run")
		player.flipX(true)
	})
	onKeyDown("a", () => {
		player.move(-350, 0)
	})
	//right
	onKeyPress("d", () => {
		player.play("run")
		player.flipX(false)
	})
	onKeyDown("d", () => {
		player.move(350, 0)
	})
	//logic
	//wait is used to delay how many times the on collide is checking
	player.onCollide("bad", (d) => {
		if (!player.isGrounded()) {
			player.jump
			play("jump");
			destroy(d);
		}
		else if (!player.invincible) {
			play("hurt")
			player.hurt();
			makeInvincible(player);
		}
	})
	player.onCollide("bad", (d) => {
		if (!player.isGrounded()) {
			player.jump
			play("jump");
			destroy(d);
		}
		else if (!player.invincible) {
			play("hurt")
			player.hurt();
			makeInvincible(player);
		}
	})
	player.onCollide("portal", () => {
		go("level2")
	})
	player.on("death", () => {
		play("death")
		destroy(player)
		go("game_over")
	})

});
///////////second level

scene("level2", () => {
	const fallThreshold = height() + 400;
	addLevel([
		"                           ",
		"l                           ",
		"                           ",
		"                           ",
		"                          ",
		"  %                        X",
		"                  E           ",
		"       !       =       =  =        =",
		"                                   ",
		"    0          E                        @",
		"        ^     ^                   ",
		"        E               E         ^",
		"=  =    =  =  =    =    =  =     =",
	],

		{
			// define the size of each block
			width: 60,
			height: 60,
			"l": () => [
				sprite("bg", { width: width(), height: height() }),
				pos(34, 9984),
				origin("bot"),
				fixed(),
				scale(32),
			],
			"0": () => [
				sprite("tiles", {
					frame: 6
				}),
				scale(4),
				area(),
				solid(),
			],
			"=": () => [
				sprite("lavaland"),
				area(),
				solid(),
				origin("bot"),
				scale(0.3),
			],
			"E": () => [
				sprite("enemies", { anim: "Walking" }),
				area(),
				body(),
				scale(2.5),
				health(1),
				patrol(),
				color(255, 0, 0),
				"bad"
			],
			"^": () => [
				sprite("rock"),
				area(),
				solid(),
				origin("bot"),
				scale(0.4),
				"danger",
			],
			"X": () => [
				sprite("skull"),
				area(),
				solid(),
				origin("bot"),
				scale(0.8),
				"danger",
			],
			"@": () => [
				sprite("portal"),
				area({ scale: 0.5, }),
				origin("bot"),
				pos(0, -12),
				"portal",
			],

		})
	let hp = add([
		sprite("fullHealth"),
		pos(0, 0),
		scale(0.2),
		fixed(),
		layer("ui")
	])
	const player = add([
		sprite("run", {
			frame: 0
		}),
		health(3),
		area(),
		pos(0, 200),
		body(),
		scale(2),
		{
			invincible: false,
			dir: 1.5
		},
		"player"
	])

	// runs code constantly on the player
	player.onUpdate(() => {
		camPos(player.pos)
		if (player.pos.y > fallThreshold) {
			player.hurt(3);
		}
		if (player.hp() == 2) {
			hp = add([
				sprite("halfHealth"),
				pos(0, 0),
				scale(0.2),
				fixed(),
				destroy(hp),
				layer("ui")
			])
		}
		else if (player.hp() == 1) {
			hp = add([
				sprite("oneHealth"),
				pos(0, 0),
				scale(0.2),
				fixed(),
				destroy(hp),
				layer("ui")
			])
		}
	})
	//////////
	//MOVEMENT
	//////////
	//jump
	player.onUpdate(() => {
		if (player.isGrounded()) {
			numJumps = 0;
		}
	});
	onKeyPress("space", () => {
		if (player.isColliding && numJumps < 2) {
			player.jump();
			play("jump");
			numJumps += 1;
		}
	});
	//left
	onKeyPress("a", () => {
		player.play("run")
		player.flipX(true)
	})
	onKeyDown("a", () => {
		player.move(-350, 0)
	})
	//right
	onKeyPress("d", () => {
		player.play("run")
		player.flipX(false)
	})
	onKeyDown("d", () => {
		player.move(350, 0)
	})
	//logic
	//wait is used to delay how many times the on collide is checking
	player.onCollide("bad", (d) => {
		if (!player.isGrounded()) {
			player.jump
			play("jump");
			destroy(d);
		}
		else if (!player.invincible) {
			play("hurt")
			player.hurt();
			makeInvincible(player);
		}
	})
	player.onCollide("bad", (d) => {
		if (!player.isGrounded()) {
			player.jump
			play("jump");
			destroy(d);
		}
		else if (!player.invincible) {
			play("hurt")
			player.hurt();
			makeInvincible(player);
		}
	})
	player.onCollide("portal", () => {
		go("level3")
	})
	player.on("death", () => {
		play("death")
		destroy(player)
		go("game_over")
	})

});
//////////////third level

scene("level3", () => {
	gravity(-800)
	const bgLayer1 = add([
		sprite("stars"),
		pos(-800, -200),
		scale(2),
		layer("bg"),
	])
	let hp = add([
		sprite("fullHealth"),
		pos(0, 0),
		scale(0.2),
		fixed(),
		layer("ui")
	])
	addLevel([
		"                                    ",
		"                                    ",
		"                                    ",
		"                                    ",
		"                                    ",
		"                         	         ",
		"                           	     ",
		"									 ",
		"                           		 ",
		"              ===               	 ",
		"                           		 ",
		" =              ===           		 ",
		"                       		     ",
		"       ====         ====            ",
		"  ========     =====        ========",
		"  =                                 ",
		"   ==        ==  ======  ======     ",
		"     ====     E   E  ==          9  ",
		"    						         ",
		"       E         E     E            ",
	],
		{
			// define the size of each block
			width: 60,
			height: 60,
			// define what each symbol means, by a function returning a component list (what will be passed to add())
			"9": () => [
				sprite("portal"),
				scale(.75),
				area(),
				body(),
				"portal"

			],
			"E": () => [
				sprite("enemies", { anim: "Walking" }),
				rotate(180),
				area(),
				body(),
				scale(2.5),
				health(1),
				patrol(),
				color(0, 255, 0),
				"bad"
			],
			"=": () => [
				sprite("shadow"),
				scale(1),
				area(),
				solid(),
				"ground"
			],

		})

	const player = add([
		sprite("run", {
			frame: 0
		}),
		health(3),
		area(),
		pos(70, 1000),
		body(),
		scale(2),
		{
			invincible: false,
			dir: 1.5
		},
		"player"
	])

	// runs code constantly on the player
	player.onUpdate(() => {
		camPos(player.pos)
		if (player.pos.y < 300) {
			player.hurt(3);
		}
		player.flipY(true)
		if (player.hp() == 2) {
			hp = add([
				sprite("halfHealth"),
				pos(0, 0),
				scale(0.2),
				fixed(),
				destroy(hp),
				layer("ui")
			])
		}
		else if (player.hp() == 1) {
			hp = add([
				sprite("oneHealth"),
				pos(0, 0),
				scale(0.2),
				fixed(),
				destroy(hp),
				layer("ui")
			])
		}
	})
	//////////
	//MOVEMENT
	//////////
	//jump

	player.onCollide("ground", () => {
		numJumps = 0;
	})
	onKeyPress("space", () => {
		if (numJumps < 2) {
			player.jump(-350);
			play("jump");
			numJumps += 1;
		}
	});
	//left
	onKeyPress("a", () => {
		player.play("run")
		player.flipX(true)

	})
	onKeyDown("a", () => {
		player.move(-350, 0)
	})
	//right
	onKeyPress("d", () => {
		player.play("run")
		player.flipX(false)
	})
	onKeyDown("d", () => {
		player.move(350, 0)
	})
	//logic
	//wait is used to delay how many times the on collide is checking
	player.onCollide("bad", (d) => {
		if (!player.isGrounded()) {
			player.jump
			play("jump");
			destroy(d);
		}
		else if (!player.invincible) {
			play("hurt")
			player.hurt();
			makeInvincible(player);
		}
	})
	player.on("death", () => {
		play("death")
		destroy(player)
		go("game_over")
	})

	player.onCollide("portal", () => {
		go("game_won")
	})
});

scene("begin", () => {
	const bgLayer1 = add([
		sprite("start_bg"),
		layer("bg"),
		scale(3.8)
	])
	play("background_music", {
		loop: true,
		volume: 0.3
	})
	add([
		text("Connor's Voyage", { size: 64 }),
		pos(280, 200),
		color(255, 0, 0),
	]);
	add([
		text("Press enter to start", { size: 24 }),
		pos(450, 300),
		color(0, 255, 0),
	]);
	add([
		text("A and D to control movement", { size: 24 }),
		pos(450, 500),
		color(0, 255, 0),
	]);
	add([
		text("Space to Jump", { size: 24 }),
		pos(500, 550),
		color(0, 255, 0),
	]);

	onKeyRelease("enter", () => {
		go("level1");
	});
});

///GAME OVER
scene("game_over", () => {
	add([
		text("You have lost!", { size: 64 }),
		pos(320, 200),
		color(255, 0, 0),
	]);
	add([
		text("Press enter to start again", { size: 24 }),
		pos(400, 300),
		color(255, 0, 0),
	]);

	onKeyRelease("enter", () => {
		go("level1");
	});
});
///GAME WON
scene("game_won", () => {
	add([
		text("You win!", { size: 64 }),
		pos(width() / 2, height() / 4),
		origin("center"),
		color(0, 255, 0),
		scale(0.1),
		move(0, -height() / 8,),
		scale(1, 1,),
	]);
	add([
		text("Press enter to play again!", { size: 24 }),
		pos(width() / 2, height() * 3 / 4),
		origin("center"),
		color(255, 255, 255),
	]);
	onKeyRelease("enter", () => {
		go("begin")
	});
});

//starts the game 
go("begin");


//////////////////
//HELPER FUNCTIONS
//////////////////

function patrol(speed = 30, dir = 1) {
	return {
		id: "patrol",
		add() {
			this.on("collide", (obj, col) => {
				if (col.isLeft() || col.isRight()) {
					dir = -dir
				}
			})
		},
		update() {
			if (this.isGrounded()) {
				this.move(speed * dir, 0)
			} else {
				this.dir = -dir;

			}
		},
	}
}
function makeInvincible(player) {
	let playerColor = player.playerColor
	player.invincible = true;
	player.hidden = true;
	player.color = RED;
	wait(0.3, () => {
		player.hidden = false;

		wait(0.2, () => {
			player.hidden = true;
			wait(0.3, () => {
				player.hidden = false;
				player.color = playerColor
				wait(0.1, () => {
					player.invincible = false;

				});
			});
		});
	});
}
