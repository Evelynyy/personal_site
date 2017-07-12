/*2048.js*/
var game = {
	data1 : [],		//存储所有单元格数据，二维数组
	RN : 4,			//总行数，可在此处改变，最大为8
	CN : 4,			//总列数，可在此处改变，最大为8
	score : 0, 		//保存分数
	state: 1, 		//游戏当前状态：Running|GameOver
 	RUNNING : 1,	//运行中
 	GAMEOVER : 0,	//游戏结束
 	PLAYING : 2,	//动画播放中

 	//获得所有背景格的html代码
 	getGridHTML : function(){	
 		for(var r = 0, arr = []; r < this.RN; r++){
			for(var c = 0; c < this.CN; c++){
				arr.push("" + r + c);
			}
		}
		return '<div id="g' + arr.join('" class="grid"></div><div id="g') + '" class="grid"></div>';
 	},
 	//获得所有前景格的html代码
 	getCellHTML : function(){	
 		for(var r = 0, arr = []; r < this.RN; r++){
 			for(var c = 0; c < this.CN; c++){
 				arr.push("" + r + c);
 			}
 		}
 		return '<div id="c' + arr.join('" class="cell"></div><div id="c') + '" class="cell"></div>';
 	},
 	//判断游戏状态为结束
	isGameOver:function(){
	  //如果没有满,则返回false
	  if(!this.isFull()){
	   	return false;
	  }else{//否则
	   	//从左上角第一个元素开始，遍历二维数组
	   	for(var r = 0; r < this.RN; r++){
	    	for(var c = 0; c < this.CN; c++){
	     		//如果当前元素不是最右侧元素
	     		if(c < this.CN-1){
	     			// 如果当前元素==右侧元素
	      			if(this.data1[r][c] == this.data1[r][c + 1]){
	       				return false;
	     			}
	     		}
	    	 	//如果当前元素不是最下方元素
			    if(r < this.RN - 1){
			     	// 如果当前元素==下方元素
			      	if(this.data1[r][c] == this.data1[r + 1][c]){
			      		 return false;
			      	}
			    }
			}
	   	}
	   	return true;
		}
	},
	//开始游戏
	start : function(){
		var panel = document.getElementById('gridPanel');
		//游戏开始获得网格布局
		panel.innerHTML = this.getGridHTML() + this.getCellHTML();
		//将panel的高度设置为RN*116+16+"px"
		panel.style.height = this.RN * 116 + 16 + 'px';
		//将panel的宽度设置为CN*116+16+"px"
		panel.style.width = this.CN * 116 + 16 + 'px';

		this.data1 = [];		//清空旧数组		
		for(var r = 0; r < this.RN; r++){		//r从0开始，到<RN结束，每次+1	
			this.data1.push([]);			//在data1中压入一个空数组		
			for(var c = 0; c < this.CN; c++){	//c从0开始，到<CN结束，每次+1
				this.data1[r].push(0);			//向data1中r行，压入一个0
			}
		}

		this.state = this.RUNNING;		//设置游戏状态
		this.score = 0;		//分数重置为0
  		//找到游戏结束界面，隐藏
  		document.getElementById("gameOver").style.display = "none";

		this.randomNum();
		this.randomNum();
		this.updateView();
	},
	//初始界面生成两个随机数
	randomNum : function(){			//在随机的不重复的位置生成一个2或4	
		if(!this.isFull()){			//只有不满时，才尝试生成随机数
			for(;;){			
				var r = Math.floor(Math.random() * this.RN);	//在0~RN-1之间生成一个行下标，存在r中
				var c = Math.floor(Math.random() * this.CN);	//在0~CN-1之间生成一个列下标，存在c中
				/*
					如果data1中r行c列等于0			
					生成一个0~1之间的随机数
						如果随机数>0.5，就在r行c列放入4
						否则放入2
				*/
				if (this.data1[r][c] == 0) {		
					this.data1[r][c] = Math.random() > 0.5 ? 4 : 2;
					break;//	退出循环
				}			
			}
		}		
	},
	//将data1数组中每个元素更新到页面div
	updateView : function(){
		//遍历data1中每个元素的值
		for(var r = 0; r < this.RN; r++){
			for(var c = 0; c < this.CN; c++){
				//找到页面上和当前位置对相应的div
				var divObj = document.getElementById("c" + r + c);
				if (this.data1[r][c] == 0) {		//如果当前值为0
					divObj.innerHTML = "";		//清除innerHTML
					divObj.className = "cell";	//还原className为"cell"
				}else{	
					divObj.innerHTML = this.data1[r][c];		//否则，将当前值放入innerHTML
					divObj.className = "cell n" + this.data1[r][c];		//修改className为"cell n" + 当前值
				}
			}
		}
		var span = document.getElementById("score");
		span.innerHTML = this.score;
		//判断并修改游戏状态为GAMEOVER
		if(this.isGameOver()){
		  	this.state = this.GAMEOVER;
		  	document.getElementById("finalScore").innerHTML=this.score;	 
		  	document.getElementById("gameOver").style.display="block";			//修改div的style属性下的display子属性为"block"
		 }
	},
	//判断是否满格
	isFull : function(){
		for (var r = 0; r < this.RN; r++) {
			for (var c = 0; c < this.CN; c++) {
				if (this.data1[r][c] == 0) {		//如果当前元素等于0
					return false;		//返回false
				}
			}
		}
		return true;	//遍历结束，返回true
	},
	//左移所有行
	moveLeft : function(){
		var before = this.data1.toString();
		for (var r = 0; r < this.RN; r++) {	//遍历data1中的每一行
			this.moveLeftInRow(r);			//左移当前行
		}
		var after = this.data1.toString();
		if(before != after){
			animation.start();
		}
	},
	//左移一行，传入要移动的行号
	moveLeftInRow : function(r){
		//c从0开始，遍历当前行中的元素，到<CN-1结束，每次+1
		for (var c = 0; c < this.CN-1; c++) {
			//找到c之后下一个不为0的值的位置，存在next中
			var nextc = this.getNextInRow(r,c);
			if(nextc == -1){	
				break;		//如果nextc等于-1，退出循环
			}else{			//否则
				if(this.data1[r][c] == 0){		//如果当前位置等于0
					this.data1[r][c] = this.data1[r][nextc];	//将当前位置设为下一个位置的值
					this.data1[r][nextc] = 0;	//将下一位置设为0
					var div = document.getElementById("c" + r + nextc);
					animation.addTask(div,r,nextc,r,c);
					c--;	//保证下次依然检查当前元素
				}else if(this.data1[r][c] == this.data1[r][nextc]){	//否则，如果当前位置等于下一位置
					this.data1[r][c] *= 2;		//当前位置 = 当前位置值*2
					this.score += this.data1[r][c];			//增加分数
					this.data1[r][nextc] = 0;	//将下一位置设为0
					var div = document.getElementById("c" + r + nextc);
					animation.addTask(div,r,nextc,r,c);
				}
			}
		}
	},
	//找r行c列位置之后，不为0的下一个位置
	getNextInRow : function(r,c){
		for(var nextc = c + 1; nextc < this.CN; nextc++){	//nextc从c+1开始，遍历r行剩余元素
			if(this.data1[r][nextc] != 0){		//如果nextc不等于0
				return nextc;
			}
		}
		return -1;		//循环结束，返回-1
	},
	//右移所有行
	moveRight : function(){
		var before = this.data1.toString();
		for (var r = 0; r < this.RN; r++) {	//遍历data1中的每一行
			this.moveRightInRow(r);			//右移当前行
		}
		var after = this.data1.toString();
		if(before != after){
			animation.start();
		}
	},
	//右移一行，传入要移动的行号
	moveRightInRow : function(r){
		//c从CN-1开始，到>0结束，每次-1
		for (var c = this.CN-1; c > 0 ; c--) {
			//找到c之后下一个不为0的值的位置，存在next中
			var prevc = this.getPrevInRow(r,c);
			if(prevc == -1){	
				break;		//如果prevc等于-1，退出循环
			}else{			//否则
				if(this.data1[r][c] == 0){		//如果当前位置等于0
					this.data1[r][c] = this.data1[r][prevc];	//将当前位置设为下一个位置的值
					this.data1[r][prevc] = 0;	//将下一位置设为0
					var div = document.getElementById("c" + r + prevc);
					animation.addTask(div, r, prevc, r, c);
					c++;	//保证下次依然检查当前元素
				}else if(this.data1[r][c] == this.data1[r][prevc]){	//否则，如果当前位置等于下一位置
					this.data1[r][c] *= 2;		//当前位置 = 当前位置值*2
					this.score += this.data1[r][c];			//增加分数
					this.data1[r][prevc] = 0;	//将下一位置设为0
					var div = document.getElementById("c"+r+prevc);
					animation.addTask(div,r,prevc,r,c);
				}
			}
		}
	},
	//找r行c列位置之后，不为0的下一个位置
	getPrevInRow : function(r,c){
		for(var prevc = c - 1; prevc >= 0; prevc--){	//prevc从c+1开始，遍历r行剩余元素
			if(this.data1[r][prevc] != 0){			//如果prevc不等于0
				return prevc;
			}
		}
		return -1;		//循环结束，返回-1
	},
	//上移所有行
	moveUp : function(){
		var before = this.data1.toString();
		for (var c = 0; c < this.CN; c++) {	//遍历data1中的每一列
			this.moveUpInCol(c);			//右移当前行
		}
		var after = this.data1.toString();
		if(before != after){
			animation.start();
		}
	},
	//上移一列，传入要移动的列号
	moveUpInCol : function(c){
		//r从0开始，遍历当前列中的元素，到<RN-1结束，每次+1
		for (var r = 0; r < this.RN-1 ; r++) {
			//找到c之后下一个不为0的值的位置，存在next中
			var nextr = this.getNextInCol(r,c);
			if(nextr == -1){	
				break;		//如果nextr等于-1，退出循环
			}else{			//否则
				if(this.data1[r][c] == 0){		//如果当前位置等于0
					this.data1[r][c] = this.data1[nextr][c];	//将当前位置设为下一个位置的值
					this.data1[nextr][c] = 0;	//将下一位置设为0
					var div = document.getElementById("c"+ nextr + c);
					animation.addTask(div,nextr,c,r,c);
					r--;	//保证下次依然检查当前元素
				}else if(this.data1[r][c] == this.data1[nextr][c]){	//否则，如果当前位置等于下一位置
					this.data1[r][c] *= 2;		//当前位置 = 当前位置值*2
					this.score += this.data1[r][c];			//增加分数
					this.data1[nextr][c] = 0;	//将下一位置设为0
					var div = document.getElementById("c"+ nextr + c);
					animation.addTask(div,nextr,c,r,c);
				}
			}
		}
	},
	//找r行c列位置之后，不为0的下一个位置
	getNextInCol : function(r,c){
		for(var nextr = r + 1; nextr < this.RN; nextr++){	//nextr从c+1开始，遍历c列剩余元素
			if(this.data1[nextr][c] != 0){			//如果nextr不等于0
				return nextr;
			}
		}
		return -1;		//循环结束，返回-1
	},
	//下移所有行
	moveDown : function(){
		var before = this.data1.toString();
		for (var c = 0; c < this.CN; c++) {	//遍历data1中的每一列
			this.moveDownInCol(c);			//右移当前行
		}
		var after = this.data1.toString();
		if(before != after){
			animation.start();
		}
	},
	//下移一列，传入要移动的列号
	moveDownInCol : function(c){
		//r从RN-1开始，遍历当前列中的元素，到>0结束，每次-1
		for (var r = this.RN-1; r > 0 ; r--) {
			//找到c之后下一个不为0的值的位置，存在next中
			var prevr = this.getPrevInCol(r,c);
			if(prevr == -1){	
				break;		//如果prevr等于-1，退出循环
			}else{			//否则
				if(this.data1[r][c] == 0){		//如果当前位置等于0
					this.data1[r][c] = this.data1[prevr][c];	//将当前位置设为下一个位置的值
					this.data1[prevr][c] = 0;	//将下一位置设为0
					var div = document.getElementById("c" + prevr + c);
					animation.addTask(div,prevr,c,r,c);
					r++;	//保证下次依然检查当前元素
				}else if(this.data1[r][c] == this.data1[prevr][c]){	//否则，如果当前位置等于下一位置
					this.data1[r][c] *= 2;		//当前位置 = 当前位置值*2
					this.score += this.data1[r][c];			//增加分数
					this.data1[prevr][c] = 0;	//将下一位置设为0
					var div = document.getElementById("c" + prevr + c);
					animation.addTask(div,prevr,c,r,c);
				}
			}
		}
	},
	//找r行c列位置之后，不为0的下一个位置
	getPrevInCol : function(r,c){
		for(var prevr = r - 1; prevr >= 0; prevr--){	//prevr从r-1开始，遍历c列剩余元素
			if(this.data1[prevr][c] != 0){			//如果prevr不等于0
				return prevr;
			}
		}
		return -1;		//循环结束，返回-1
	}
};
//当窗口加载后
window.onload = function(){
	game.start();
	/*键盘事件绑定*/
	document.onkeydown = function(){
		if(game.state == game.RUNNING){
			var e = window.event || arguments[0];
			var code = e.keyCode;
			//如果按的是向左箭头，就调用左移方法
			//左37 上38 右39 下40
			if(code == 37){
				game.moveLeft();
			}else if(code == 39){
				game.moveRight();
			}else if(code == 38){
				game.moveUp();
			}else if(code == 40){
				game.moveDown();
			}
		}		
	}
}