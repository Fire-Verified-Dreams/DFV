import kaboom from "kaboom";

kaboom({
	width: 1280,
	height: 720,
	font: "sinko",
	debug: true,
	background: [51, 151, 255],

});

//variables

let badGuys = get("bad");

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

loadSprite("cloud", "../sprites/mario/cloud.png")
loadAseprite("enemies", "../sprites/mario/enemies.png", "../sprites/mario/enemies.json");
loadSound("death","../sounds/death.mp3")

///////////
//LEVEL 1//
///////////
scene("level1", () => {

	addLevel([
		"         ;             ;            ",
		"      ;            ;     ;          ",
		"             ;       ;              ",
		"                ;       ;           ",
		"       ;                            ",
		"                   ;       	     ",
		"               E            	     ",
		"									 ",
		"              000          		 ",
		"                             		 ",
		"                      ^    		 ",
		"                      |     		 ",
		"    #  E       E  .   *  # 	E	 ",
		"-=======! = -======================!",
		",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,",
	], {
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
			// patrol(50),
			// enemy(),
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
		],

	})

	const player = add([
		sprite("run", {
			frame: 0
		}),
		health(3),
		area(),
		pos(center()),
		body(),
		scale(2),
		{
			invincible: false,
			dir: 1.5 // add a dir property to the player entity
		}
	])
	// runs code constantly on this player
	player.onUpdate(() => {
		camPos(player.pos)
		area()
		body()

	})
	//////////
	//MOVEMENT
	//////////
	//jump
	onKeyPress("space", () => {
		player.jump()

	})
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

	player.onCollide("bad", (bad) => {
		if (!player.invincible) {
			player.hurt(1);
			makeInvincible(player);
		  }
	})
	function makeInvincible(player) {
		let playerColor = player.playerColor
		player.invincible = true;
		player.hidden = true;
		wait(0.1, () => {
		  player.hidden = false;
		  player.color = RED;
		  wait(0.1, () => {
			player.hidden = true;
			wait(0.1, () => {
			  player.hidden = false;
			  wait(0.1, () => {
				player.invincible = false;
				player.color = playerColor;
			  });
			});
		  });
		});
	}

	player.on("death", () => {
		play("death")
		destroy(player)
		go("game_over")
	})
	// badGuys.on("death", () => {
	// 	destroy(player)
	// 	go("game_over")
	// })
});

scene("begin", () => {
	add([
		text("DFV", { size: 64 }),
		pos(580, 200),
		color(255, 255, 255),
	]);
	add([
		text("Press enter to start", { size: 24 }),
		pos(450, 300),
		color(255, 255, 255),
	]);

	onKeyRelease("enter", () => {
		go("game");
	});
});
///GAME OVER
scene("game_over", () => {
	add([
		text("You have lost!", { size: 64 }),
		pos(320, 200),
		color(255, 255, 255),
	]);
	add([
		text("Press enter to start again", { size: 24 }),
		pos(400, 300),
		color(255, 255, 255),
	]);

	onKeyRelease("enter", () => {
		go("level1");
	});
});

//starts the scene 
go("level1");

