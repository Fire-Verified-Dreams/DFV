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
loadSprite("mountains", "../sprites/bg/mountains.png")
loadSprite("sky", "../sprites/bg/sky.png")
loadAseprite("enemies", "../sprites/mario/enemies.png", "../sprites/mario/enemies.json");
loadSound("death","../sounds/death.mp3")
loadSound("jump","../sounds/jump.mp3")
loadSound("hurt","../sounds/hurt.mp3")

///////////
//LEVEL 1//
///////////

scene("level1", () => {
	const fallThreshold = height() + 400;
	const bgLayer1 = add([
		sprite("sky"),
		pos(-700,-350),
		scale(11),
		layer("bg"),
		// {
		//   speed: 0.2
		// }
	  ])
	addLevel([
		"          ;                           ;  ",
		"      ;                      ;           ",
		"             ;                    ;      ",
		"                                         ",
		"  ;     ;                                ",
		"                      000    	   ;      ",
		"    ;           E            	          ",
		"				 					      ",
		"              000          		      ",
		"                             		      ",
		"  ^                     ^    		      ",
		"  |                     |     	E	      ",
		" .*  #   E  .    E  .   *  #  -=!	.  #  ",
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
		pos(50,650),
		body(),
		scale(2),
		{
			invincible: false,
			dir: 1.5 // add a dir property to the player entity
		}
	])
	
	  
	//   const bgLayer2 = add([
	// 	sprite("bg-layer2"),
	// 	pos(0, 0),
	// 	scale(2),
	// 	layer("bg"),
	// 	{
	// 	  speed: 0.4
	// 	}
	//   ]);
	  
	  // move the background layers based on their speed property
	  action("bg", (bg) => {
		bg.move(-bg.speed, 0);
	  });
	// runs code constantly on the player
	player.onUpdate(() => {
		camPos(player.pos)
		if (player.pos.y > fallThreshold){
			player.hurt(3);
		}

	})
	//////////
	//MOVEMENT
	//////////
	//jump
	onKeyPress("space", () => {
		if(player.isColliding){
		player.jump()
		play("jump")
		}
		else{
			
		}
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
			// play("hurt")
			player.hurt(1);
			makeInvincible(player);
		  }
	})
	
	
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
		go("level1");
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
go("begin");


//////////////////
//HELPER FUNCTIONS
//////////////////

function badGuyMovement(){

}
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
			this.move(speed * dir, 0)
		},
	}
}

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