import kaboom from "kaboom";

kaboom({
	width: 1280,
    height: 720,
	font: "sinko",
	debug:true,
	background:[51, 151, 255],
	
});
loadSprite("knight","../sprites/Knight/Idle/Idle-Sheet.png",{
	sliceX:4,
	anims:{
		idle:{
			from:0,
			to:3,
		}
	},
})
loadSprite("run","../sprites/Knight/Run/run-sheet2.png",{
	sliceX:6,
	anims:{
		run:{
			from:0,
			to:5,
		}
	},
})
loadSprite("tiles","../sprites/nature/tileset.png",{
	sliceX:7,
	sliceY:11,
})
scene("game", () => {
	
	addLevel([
		"                           ",
		"                           ",
		"                           ",
		"                           ",
		"                           ",
		"                           ",
		"                           ",
		"							",
		"              000         ",
		"                           ",
		"                           ",
		"                           ",
		"                           ",
		"-=======!  -==============!",
	], {
		// define the size of each block
		width: 64,
		height: 64,
		// define what each symbol means, by a function returning a component list (what will be passed to add())
		"-": () => [
			sprite("tiles",{
				frame:0
			}),
			scale(4),
			area(),
			solid(),
		],
		"0": () => [
			sprite("tiles",{
				frame:6
			}),
			scale(4),
			area(),
			solid(),
		],
		"!": () => [
			sprite("tiles",{
				frame:2
			}),
			scale(4),
			area(),
			solid(),
		],
		"=": () => [
			sprite("tiles",{
				frame:1
			}), 
			scale(4),
			area(),
			solid(),
		],
		
	})
	
	const player = add([
		sprite("run",{
			frame:0
		}),
		area(),
		pos(center()),
		body(),
		scale(2)

	])
	// runs code constantly on this player
	player.onUpdate(()=> {
		camPos(player.pos)
		
	})
	//////////
	//MOVEMENT
	//////////
	//jump
	onKeyPress("space",()=>{
		player.jump()
		
	})
	//left
	onKeyPress("a",()=>{
		body()
		area()
		player.scale.x=-2;
		
		player.play("run")
	})
	onKeyDown("a", () => {
	
		player.move(-200, 0)
		
		
		
	})
	//right
	onKeyPress("d",()=>{
		player.scale.x=2;
		player.play("run")
	})
	onKeyDown("d", () => {
		
		player.play("run")
		player.move(200, 0)
	
		
	})
  });
scene("begin", () => {
	add([
	  text("DFV", { size: 64 }),
	  pos(580,200),
	  color(255, 255, 255),
	]);
	add([
		text("Press enter to start", { size: 24 }),
		pos(450 ,300),
		color(255, 255, 255),
	  ]);
  
	onKeyRelease("enter", () => {
	  go("game");
	});
  });
//starts the scene 
  go("begin");

 