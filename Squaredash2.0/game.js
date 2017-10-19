var pjs = new PointJS(840, 480, {
	backgroundColor : '#4b4843'
});
// pjs.system.initFullPage(); // for Full Page mode
// pjs.system.initFullScreen(); // for Full Screen mode (only Desctop)

var log    = pjs.system.log;
var game   = pjs.game;
var point  = pjs.vector.point;
var camera = pjs.camera;
var brush  = pjs.brush;
var OOP    = pjs.OOP;
var math   = pjs.math;

var key   = pjs.keyControl.initKeyControl();
var mouse = pjs.mouseControl.initMouseControl();
// var touch = pjs.touchControl.initTouchControl();
// var act   = pjs.actionControl.initActionControl();

var width  = game.getWH().w;
var height = game.getWH().h;

pjs.system.initFPSCheck();

game.newLoopFromConstructor('level1', function () {
	var pPos;

	var world = [];
	var deadBlock = [];
	var triangleBlock = [];
	var platformBlock = [];
	var winBlocks = [];
	var moneyBlocks = [];

	var level_finished = false;

	pjs.levels.forStringArray({w: 40, h: 40, source: [
		'                                                                                              G   ',
		'                                                                                --  --  --  ---       ',
		'                                                           --  --  --  --    --                  --                                WWW',
		'                                                        --                --                                                       WWW',
		'   P         T    T       T   T        -       T     --                      --        TT    T       TT                G           WWW',
		'0000000000000000000000000000000000000TTTTT000000000000TTTTTTTTTTTTTTTTTTTTTTT00000000000000000000000000000000 -  -  -  -  -  - 000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
		'0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000                  000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
		'0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000TTTTTTTTTTTTTTTTTT000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
		'0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
		'0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
		'0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
		'0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
		'0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
		'0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
		'0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
		'0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	]}, function(S, X, Y, W, H){
		if (S === "0"){
			world.push(game.newRectObject({
				x: X, y: Y,
				w: W, h: H,
				fillColor: '#bcbcbc'
			}));
		} else if(S === "P"){
			pPos = point(X, Y);
		} else if(S === "D"){
			deadBlock.push(game.newRectObject({
				x: X, y: Y,
				w: W, h: H
			}));	
		} else if(S === "T"){
			triangleBlock.push(game.newTriangleObject({
				x: X+W/4, y: Y+H/2,
				w: W/2, h: H/2,
				fillColor: '#bcbcbc'
			}));	
		} else if(S === "-"){
			platformBlock.push(game.newRectObject({
				x: X, y: Y+H/2,
				w: W, h: H/4,
				fillColor: '#bcbcbc'
			}));	
		} else if(S === "W"){
			winBlocks.push(game.newRectObject({
				x: X, y: Y,
				w: W, h: H,
				fillColor: '#79aa58',
				alpha: 0.5
			}));	
		} else if(level_finished == false && S === "G"){
			moneyBlocks.push(game.newImageObject({
				w: W/2, h: H/2,
				x: X+(W/2)/2, y: Y+H/1.2,
				file: 'img/coin_24.png'
			}));	
		}
	});
	
	var pl = game.newImageObject({
		x: pPos.x, y: pPos.y,
		w: 30, h: 30,
		file: 'img/player/'+pjs.math.random(1, 6)+'.jpg'
	})

	var speed = point();
	var jump = false;
	var score = 1;
	var money = 0;
	var scoreText;
	var gamestopped = false;

	var scoreMenu = pjs.system.newDOM('div', true);
	scoreMenu.className = "scoreMenu";
	var statsMenu = pjs.system.newDOM('div', true);
	statsMenu.className = "statsMenu";
	var loseTable = pjs.system.newDOM('div', true);
	loseTable.className = "loseTable";

	scoreMenu.innerHTML = `
		<div class="back-black"><h1><img src="img/coin_16.png" class="coin"> `+money+`<h1></div><div class="back-white"><h1>Счет: `+score+`</div>
	`;

	statsMenu.innerHTML = `
		<button class="btn-green" onclick="menu();">Меню</button>	
	`;

	var lose = function(){
		var margintop = 16;
		var marginleft = width/2 - 142/2;

		loseTable.innerHTML = `
			<div class="back-white" style="margin-top: `+margintop+`px; margin-left: `+marginleft+`px;"><h1>ВЫ ПРОИГРАЛИ</h1><hr><h1>Счет: `+score+`</h1><h1>Монеты: `+money+`</h1><div style="display:block;padding:5px;"><div class="left"><button type="submit" onclick="restart();" id="restart" class="btn-black">Рестарт</button></div><div class="right"><button onlick="menu();" type="submit" id="menu" class="btn-green">Меню</button></div></div></div>
		`;
	}

	var win = function(){
		var margintop = 16;
		var marginleft = width/2 - 142/2;

		loseTable.innerHTML = `
			<div class="back-black" style="margin-top: `+margintop+`px; margin-left: `+marginleft+`px;"><h1>ВЫ ВЫИГРАЛИ</h1><hr><h1>Счет: `+score+`</h1><h1>Монеты: `+money+`</h1><div style="display:block;padding:5px;"><div class="left"><button type="submit" onclick="restart();" id="restart" class="btn-white">Рестарт</button></div><div class="right"><button onlick="menu();" type="submit" id="menu" class="btn-green">Меню</button></div></div></div>
		`;
	}

	this.update = function () {
		game.clear();

		if (speed.x < 5) speed.y += 0.13;
		else if(speed.x > 4) speed.y += 0.13;
		if (jump == false){
			if (key.isPress('W') || key.isPress('UP') || key.isPress('SPACE') || mouse.isPress('LEFT')){
				jump = true;
				speed.y = -4;
			}
		}

		pl.draw();

		var collisionBlocks = [];
		var drawBlocks = [];

		OOP.forArr(world, function(w, idW){
			if (w.isInCameraStatic()){
				drawBlocks.push(w);
			}
		});

		OOP.forArr(drawBlocks, function(d){
			d.setAlpha(1 - pl.getDistanceC(d.getPositionC()) / 300);

			d.draw();
			speed.x = 2;

			if (pl.getDistanceC(d.getPositionC()) < 100){
				collisionBlocks.push(d);
			}

			if (pl.isStaticIntersect(d)){
				jump = false;
			}
		});

		OOP.forArr(deadBlock, function(l){
			if (pl.isStaticIntersect(l)){
				gamestopped = true;
				game.stop();
				lose();
			}
		});

		OOP.forArr(winBlocks, function(w){
			if (w.isInCameraStatic()) w.draw();

			if (pl.isStaticIntersect(w)){
				gamestopped = true;
				level_finished = true;
				game.stop();
				win();
			}
		});

		OOP.forArr(moneyBlocks, function(m, mId){
			m.setAlpha(1 - pl.getDistanceC(m.getPositionC()) / 300);
			if (m.isInCameraStatic()) m.draw();

			if (pl.isStaticIntersect(m)){
				money++;
				moneyBlocks.splice(mId, 1);

				scoreMenu.innerHTML = `
					<div class="back-black"><h1><img src="img/coin_16.png" class="coin"> `+money+`<h1></div><div class="back-white"><h1>Счет: `+score+`</div>
				`;
			}
		});

		OOP.forArr(triangleBlock, function(t){
			t.setAlpha(1 - pl.getDistanceC(t.getPositionC()) / 300);
			if (t.isInCameraStatic()) t.draw();

			if (pl.getDistanceC(t.getPositionC()) < 100){
				collisionBlocks.push(t);
			}

			if (pl.isStaticIntersect(t)){
				gamestopped = true;
				game.stop();
				lose();
			}
		});

		OOP.forArr(platformBlock, function(p){
			p.setAlpha(1 - pl.getDistanceC(p.getPositionC()) / 300);
			if (p.isInCameraStatic()) p.draw();

			if (pl.getDistanceC(p.getPositionC()) < 100){
				collisionBlocks.push(p);
			}

			if (pl.isStaticIntersect(p)){
				jump = false;
			}
		});

		pjs.vector.moveCollision(pl, collisionBlocks, speed);

		camera.follow(pl, 10);

		if(gamestopped == false){
			score += 1;
			scoreMenu.innerHTML = `
				<div class="back-black"><h1><img src="img/coin_16.png" class="coin"> `+money+`<h1></div><div class="back-white"><h1>Счет: `+score+`</h1></div>
			`;
		}
	};

	this.entry = function () {
		score = 0;
		pl.x = pPos.x;
		pl.y = pPos.y;
		gamestopped = false;
		loseTable.innerHTML = ``;
	};

	this.exit = function () {
		// game is stopped
	};

});

game.startLoop('level1');

var restart = function(){
	game.resume();
	game.setLoop('level1');
}