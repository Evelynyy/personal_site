var animation={
	DURA:500,//总时间
	STEPS:50,//总步数
	moved:0,//当前移动步数
	timer:null,//保存当前定时器的序号
	tasks:[],//放入每次任务需要移动的所有元素和距离
	addTask:function(divObj,currR,currC,tarR,tarC){//向tasks数组中增加任务对象
		var topDist=(tarR-currR)*116;
		var leftDist=(tarC-currC)*116;
		var topStep=topDist/this.STEPS;
		var leftStep=leftDist/this.STEPS;
		console.log(topStep+","+leftStep);
		this.tasks.push(
			{obj:divObj,top:topStep,left:leftStep}
		);
	},
	move:function(){
		for(var i=0;i<this.tasks.length;i++){
			var task=this.tasks[i];//获得当前对象
			var style=getComputedStyle(task.obj);
			console.log(task.obj);
			task.obj.style.top=
				parseFloat(style.top)+task.top+"px";
			task.obj.style.left=
				parseFloat(style.left)+task.left+"px";
		}
		if(--this.moved==0){
			clearInterval(this.timer);
			for(var i=0;i<this.tasks.length;i++){
				var task=this.tasks[i];
				task.obj.style.top="";
				task.obj.style.left="";
			}
			this.tasks=[];
			game.randomNum();
			game.state=game.RUNNING;
			game.updateView();
		}
	},
	start:function(){
		game.state=game.PLAYING;
		var self=this;//留住this
		self.moved=self.STEPS;
		self.timer=setInterval(function(){
			self.move();
		},self.DURA/self.STEPS);
	}
}