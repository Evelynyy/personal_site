// 0 游戏的初始化阶段
// 01 获取<canvas>元素,创建画布对象
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
// 02 获取画布的宽度和高度
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
// 03 初始化游戏的五个阶段
const START = 0;
const STARTTING = 1;
const RUNNING = 2;
const PAUSED = 3;
const GAMEOVER = 4;
// 04 定义标识用于表示游戏的当前阶段
var state = START;
// 05 定义游戏的得分
var score = 0;
// 06 定义生命值
var life = 3;//拥有3条生命值

// 1 游戏欢迎阶段
// 11 操作游戏的背景图片
// 1101 加载游戏的背景图片
var bg = new Image();
bg.src = "img/img_plane/background.png";
// 1102 初始化有关背景的数据
var SKY = {
	imgs : bg,//表示所需要的图片
	width : 480,//表示图片的宽度
	height : 852//表示图片的高度
}
// 1103 创建操作背景图片的构造器
function Sky(config){//config指接收的初始化数据
	// 初始化数据
	this.imgs = config.imgs;
	this.width = config.width;
	this.height = config.height;
	// 图片的坐标值
	this.x1 = 0;
	this.y1 = 0;
	this.x2 = 0;
	this.y2 = -this.height;
	// 绘制方法
	this.paint = function(cxt){
		cxt.drawImage(this.imgs,this.x1,this.y1);
		cxt.drawImage(this.imgs,this.x2,this.y2);
	}
	// 移动方法
	this.step = function(){
		// 向下移动
		this.y1++;
		this.y2++;
		// 边界判断
		if(this.y1 == HEIGHT){
			this.y1 = -this.height;
		}
		if(this.y2 == HEIGHT){
			this.y2 = -this.height;
		}
	}
}
// 1104 创建操作背景图片的对象
var sky = new Sky(SKY);

// 12 操作游戏的LOGO图片
var logo = new Image();
logo.src = "img/img_plane/start.png";

// 1-2 从游戏欢迎阶段到游戏过渡阶段
canvas.onclick = function(){
	// 当前是否为游戏欢迎阶段
	if(state == START){
		state = STARTTING;
	}
}

// 2. 完成游戏过渡阶段
// 21 加载过渡动画所需要的所有图片
var loadings = [];
loadings[0] = new Image();
loadings[0].src = "img/img_plane/game_loading1.png";
loadings[1] = new Image();
loadings[1].src = "img/img_plane/game_loading2.png";
loadings[2] = new Image();
loadings[2].src = "img/img_plane/game_loading3.png";
loadings[3] = new Image();
loadings[3].src = "img/img_plane/game_loading4.png";
// 22 初始化数据内容
var LOADING = {
	imgs : loadings,//动画图片
	width : 186,//图片的宽度
	height : 38,//图片的高度
	count : loadings.length//图片的总数
}
// 23 创建过渡动画的构造函数
function Loading(config){
	// 初始化数据
	this.imgs = config.imgs;
	this.width = config.width;
	this.height = config.height;
	this.count = config.count;
	// 定义表示数组角标
	this.index = 0;
	// 定义图片的坐标值
	this.x = 0;
	this.y = HEIGHT - this.height;
	// 绘制方法
	this.paint = function(cxt){
		cxt.drawImage(this.imgs[this.index],this.x,this.y);
	}
	// 定义相对速度
	this.speed = 0;
	// 动画方法
	this.step = function(){
		this.speed++;
		if(this.speed%2 == 0){
			// 切换过渡动画
			this.index++;
		}
		// 过渡动画在什么时间执行完毕?
		if(this.index == this.count){
			// 表示过渡动画执行完毕 - 进入到游戏运行阶段
			state = RUNNING;
		}
	}
}
// 24 创建过渡动画的对象
var loading = new Loading(LOADING);

// 3 游戏运行阶段
// 31 有关我方飞机的逻辑
// 3101 加载我方飞机的图片
var heros = [];
heros[0] = new Image();
heros[0].src = "img/img_plane/hero1.png";
heros[1] = new Image();
heros[1].src = "img/img_plane/hero2.png";
heros[2] = new Image();
heros[2].src = "img/img_plane/hero_blowup_n1.png";
heros[3] = new Image();
heros[3].src = "img/img_plane/hero_blowup_n2.png";
heros[4] = new Image();
heros[4].src = "img/img_plane/hero_blowup_n3.png";
heros[5] = new Image();
heros[5].src = "img/img_plane/hero_blowup_n4.png";
// 3102 初始化相关数据
var HERO = {
	imgs : heros,//我方飞机的图片
	width : 99,//图片宽度
	height : 124,//图片高度
	count : heros.length,//图片总数
	frame : 2
}
// 3103 创建我方飞机的构造器
function Hero(config){
	// 初始化数据
	this.imgs = config.imgs;
	this.width = config.width;
	this.height = config.height;
	this.count = config.count;
	this.frame = config.frame;
	// 定义数组角标
	this.index = 0;
	// 定义是否执行爆破动画的标识
	this.canDown = false;
	// 定义绘制的坐标值
	this.x = (WIDTH - this.width)/2;//水平方向中间位置
	this.y = HEIGHT - this.height - 30;
	// 绘制方法
	this.paint = function(cxt){
		cxt.drawImage(this.imgs[this.index],this.x,this.y);
	}
	// 动画方法
	this.step = function(){
		this.index++;
		if(this.canDown){//爆破
			if(this.index == this.count){
				// 爆破动画执行完毕
				life--;
				// 判断生命值
				if(life > 0){
					hero = new Hero(HERO);
				}else{
					state = GAMEOVER;
				}
				this.index = this.count-1;
			}
		}else{
			/* 0 1 0 1 0 1 0 1 ...
			if(this.index == 0){
				this.index = 1;
			}else{
				this.index = 0;
			}*/
			//this.index = (this.index == 0) ? 1: 0;
			this.index = this.index%this.frame;
		}
	}
	// 射击方法
	this.shoot = function(){
		// 创建子弹的对象,将它添加到存储子弹的数组中
		var bullet = new Bullet(BULLET);
		bullets[bullets.length] = bullet;
	}
	// 是否执行爆破动画的方法
	this.down = function(){
		this.canDown = true;
		this.index = 2;
	}
}
// 3104 创建我方飞机的对象
var hero = new Hero(HERO);
// 3105 我方飞机跟随鼠标移动 - mousemove事件
canvas.onmousemove = function(event){
	if(state == RUNNING){
		hero.x = event.offsetX - hero.width/2;
		hero.y = event.offsetY - hero.height/2;
	}
}

// 32 完成有关子弹的逻辑
// 3201 加载子弹的图片
var bullet = new Image();
bullet.src = "img/img_plane/bullet.png";
// 3202 初始化子弹的数据
var BULLET = {
	imgs : bullet,// 子弹的图片
	width : 9,//图片宽度
	height : 21//图片高度
}
// 3203 创建子弹的构造器
function Bullet(config){
	// 初始化数据
	this.imgs = config.imgs;
	this.width = config.width;
	this.height = config.height;
	// 定义坐标值
	this.x = hero.x + hero.width/2 - this.width/2;
	this.y = hero.y - this.height - 10;
	// 定义是否删除标识
	this.canDelete = false;
	// 绘制方法
	this.paint = function(cxt){
		cxt.drawImage(this.imgs,this.x,this.y);
	}
	// 移动方法
	this.step = function(){
		// 从下向上移动
		this.y -= 25;
	}
}
// 3204 定义数组用于存储所有的子弹
var bullets = [];
// 3205 定义绘制所有子弹的函数
function paintBullets(){
	// 遍历存储所有子弹的数组
	for(var i=0;i<bullets.length;i++){
		// 得到每个子弹对象
		var bullet = bullets[i];
		// 进行绘制
		bullet.paint(context);
	}
}
// 3206 定义移动所有子弹的函数
function stepBullets(){
	// 遍历存储所有子弹的数组
	for(var i=0;i<bullets.length;i++){
		// 得到每个子弹对象
		var bullet = bullets[i];
		// 进行移动
		bullet.step();
	}
}
// 3207 定义移出画布的子弹进行删除的方法
function deleteBullets(){
	// 遍历所有的子弹
	for(var i=0;i<bullets.length;i++){
		var bullet = bullets[i];
		if(bullet.y <= -bullet.height||bullet.canDelete){
			// 将当前子弹删除
			bullets.splice(i,1);
			i--;
		}
	}
}

// 33 有关敌方飞机的逻辑
// 3301 加载所有敌方飞机的图片
var enemies1 = [];//小飞机
enemies1[0] = new Image();
enemies1[0].src = "img/img_plane/enemy1.png";
enemies1[1] = new Image();
enemies1[1].src = "img/img_plane/enemy1_down1.png";
enemies1[2] = new Image();
enemies1[2].src = "img/img_plane/enemy1_down2.png";
enemies1[3] = new Image();
enemies1[3].src = "img/img_plane/enemy1_down3.png";
enemies1[4] = new Image();
enemies1[4].src = "img/img_plane/enemy1_down4.png";
var enemies2 = [];//中飞机
enemies2[0] = new Image();
enemies2[0].src = "img/img_plane/enemy2.png";
enemies2[1] = new Image();
enemies2[1].src = "img/img_plane/enemy2_down1.png";
enemies2[2] = new Image();
enemies2[2].src = "img/img_plane/enemy2_down2.png";
enemies2[3] = new Image();
enemies2[3].src = "img/img_plane/enemy2_down3.png";
enemies2[4] = new Image();
enemies2[4].src = "img/img_plane/enemy2_down4.png";
var enemies3 = [];//大飞机
enemies3[0] = new Image();
enemies3[0].src = "img/img_plane/enemy3_n1.png";
enemies3[1] = new Image();
enemies3[1].src = "img/img_plane/enemy3_n2.png";
enemies3[2] = new Image();
enemies3[2].src = "img/img_plane/enemy3_down1.png";
enemies3[3] = new Image();
enemies3[3].src = "img/img_plane/enemy3_down2.png";
enemies3[4] = new Image();
enemies3[4].src = "img/img_plane/enemy3_down3.png";
enemies3[5] = new Image();
enemies3[5].src = "img/img_plane/enemy3_down4.png";
enemies3[6] = new Image();
enemies3[6].src = "img/img_plane/enemy3_down5.png";
enemies3[7] = new Image();
enemies3[7].src = "img/img_plane/enemy3_down6.png";
// 3302 初始化敌方飞机的数据
var ENEMY1 = {//小飞机
	imgs : enemies1,//小飞机的图片
	width : 57,//小飞机的宽度
	height : 51,//小飞机的高度
	count : enemies1.length,
	frameCount : 1,//小飞机正常图片的数量
	type : 1,//表示为小飞机
	life : 10,//小飞机的生命值
	score : 1
}
var ENEMY2 = {//中飞机
	imgs : enemies2,//中飞机的图片
	width : 69,//中飞机的宽度
	height : 95,//中飞机的高度
	count : enemies2.length,
	frameCount : 1,//中飞机正常图片的数量
	type : 2,//表示为中飞机
	life : 30,//中飞机的生命值
	score : 5
}
var ENEMY3 = {//大飞机
	imgs : enemies3,//大飞机的图片
	width : 169,//大飞机的宽度
	height : 258,//大飞机的高度
	count : enemies3.length,
	frameCount : 2,//大飞机正常图片的数量
	type : 3,//表示为大飞机
	life : 100,//大飞机的生命值
	score : 20
}
// 3303 创建敌方飞机的构造器
function Enemy(config){
	// 初始化数据
	this.imgs = config.imgs;
	this.width = config.width;
	this.height = config.height;
	this.count = config.count;
	this.frameCount = config.frameCount;
	this.type = config.type;
	this.life = config.life;
	this.score = config.score;
	// 坐标值
	this.x = Math.random() * (WIDTH - this.width);
	this.y = -this.height;
	// 数组的角标
	this.index = 0;
	// 定义标识是否执行爆破
	this.canDown = false;
	// 定义标识是否删除
	this.canDelete = false;
	// 绘制方法
	this.paint = function(cxt){
		cxt.drawImage(this.imgs[this.index],this.x,this.y);
	}
	// 移动和动画方法
	this.step = function(){
		this.index++;
		if(this.canDown){//爆破
			// 判断爆破动画是否执行完毕
			if(this.index == this.count){
				this.canDelete = true;
			}
		}else{//正常
			// 小飞机|中飞机 - 0 | 大飞机 - 0 1 0 1 0 1
			this.index = this.index%this.frameCount;
			
			// 自上向下移动
			switch (this.type){
				case 1://小飞机
					//this.index = 0;
					this.y += 10;
					break;
				case 2://中飞机
					//this.index = 0;
					this.y += 3;
					break;
				case 3://大飞机
					//this.index = (++this.index)%2;
					this.y++;
					break;
			}
		}
	}
	// 定义被撞击后的逻辑 - 只能执行一次
	this.down = function(){
		this.life--;
		if(this.life == 0){
			// 修改canDown标识为true
			this.canDown = true;
			if(this.type == 3){//大飞机
				this.index = 2;
			}else{
				this.index = 1;
			}
			// 游戏得分
			score += this.score;
		}
	}
	// 检查是否被撞击的方法
	this.hit = function(compont){
		return compont.y < this.y + this.height &&
			   compont.x + compont.width > this.x &&
			   compont.x < this.x + this.width &&
			   compont.y + compont.height > this.y;
	}
}
// 3304 创建存储敌方飞机的数组
var enemies = [];
// 3305 定义创建敌方飞机的函数
function createEnemies(){
	// 生成一个随机数 - 0~1000
	var num = Math.random()*1000;
	if(num < 50){//小飞机
		var enemy = new Enemy(ENEMY1);
		enemies.push(enemy);
	}else if(num < 60){//中飞机
		var enemy = new Enemy(ENEMY2);
		enemies.push(enemy);
	}else if(num < 62){//大飞机
		var enemy = new Enemy(ENEMY3);
		enemies.push(enemy);
	}
}
// 3306 绘制所有的敌方飞机
function paintEnemies(){
	for(var i=0;i<enemies.length;i++){
		var enemy = enemies[i];
		enemy.paint(context);
	}
}
// 3307 移动所有的敌方飞机
function stepEnemies(){
	for(var i=0;i<enemies.length;i++){
		var enemy = enemies[i];
		enemy.step();
	}
}
// 3308 删除移出画布的敌方飞机
function deleteEnemies(){
	for(var i=0;i<enemies.length;i++){
		var enemy = enemies[i];
		if(enemy.y >= HEIGHT||enemy.canDelete){
			enemies.splice(i,1);
			i--;
		}
	}
}

// 34 完成 打飞机 的逻辑
// 3401 定义检查敌机是否被撞击的函数
function checkHit(){
	// 遍历画布中存在的所有敌方飞机
	for(var i=0;i<enemies.length;i++){
		var enemy = enemies[i];
		// a. 我方飞机 撞击 敌方飞机
		if(enemy.hit(hero)&&!enemy.canDown&&!hero.canDown){
			// 敌方飞机被撞击后的处理
			enemy.down();
			// 我方飞机被撞击后的处理
			hero.down();
		}
		// b. 子弹 撞击 敌方飞机
		for(var j=0;j<bullets.length;j++){
			var bullet = bullets[j];
			if(enemy.hit(bullet)&&!enemy.canDown){
				// 敌方飞机被撞击后的处理
				enemy.down();
				// 子弹被撞击后的处理
				bullet.canDelete = true;
			}
		}
	}
}

// 35 完成游戏的得分和生命值
// 3501 游戏的得分
function paintScore(){
	context.font = "bold 24px 微软雅黑";
	context.fillText("SCORE : "+score,10,30);
} 
// 3502 生命值
function paintLife(){
	context.font = "bold 24px 微软雅黑";
	context.fillText("LIFE : "+life,370,30);
}

// 4 完成游戏暂停阶段
// 41 鼠标离开 - 进入暂停阶段
canvas.onmouseout = function(){
	if(state == RUNNING){
		state = PAUSED;
	}
}
// 42 鼠标回来 - 恢复运行阶段
canvas.onmouseover = function(){
	if(state == PAUSED){
		state = RUNNING;
	}
}
// 43 绘制暂停图标
var paused = new Image();
paused.src = "img/img_plane/game_pause_nor.png";
paused.width = 60;
paused.height = 45;

// 5 完成游戏结束阶段
function paintOver(){
	context.font = "bold 48px 微软雅黑";
	context.fillText("GAME OVER",WIDTH/2-150,HEIGHT/2);
}

// 定义游戏的核心控制器
setInterval(function(){
	sky.paint(context);// 绘制背景
	sky.step();// 移动背景
	switch (state){
		case START:
			context.drawImage(logo,10,0);
			break;
		case STARTTING:
			loading.paint(context);
			loading.step();
			break;
		case RUNNING:
			hero.paint(context);//绘制我方飞机
			hero.step();//执行飞机动画
			hero.shoot();//射击(创建子弹)
			paintBullets();//绘制所有子弹
			stepBullets();//移动所有子弹
			deleteBullets();//删除移出画布的子弹
			createEnemies();//创建敌方飞机
			paintEnemies();//绘制敌方飞机
			stepEnemies();//移动敌方飞机
			deleteEnemies();//删除移出画布的敌方飞机
			checkHit();//检查敌机是否被撞击
			paintScore();//绘制游戏的得分
			paintLife();//绘制生命值
			break;
		case PAUSED:
			// 绘制暂停图标
			context.drawImage(paused,(WIDTH-paused.width)/2,(HEIGHT-paused.height)/2);
			hero.paint(context);//绘制我方飞机
			paintBullets();//绘制所有子弹
			paintEnemies();//绘制敌方飞机
			paintScore();//绘制游戏的得分
			paintLife();//绘制生命值
			break;
		case GAMEOVER:
			paintOver();
			hero.paint(context);//绘制我方飞机
			paintBullets();//绘制所有子弹
			paintEnemies();//绘制敌方飞机
			paintScore();//绘制游戏的得分
			paintLife();//绘制生命值
			break;
	}
},100);