/*
 * @描述 配置数据
*/
var config = [
	{
		title : '娱乐在线',
		url : 'data/entertainment.json',
		id : 'a_1'
	},
	{
		title : '头条新闻',
		url : 'data/headlinejson.json',
		id : 'a_2'
	},
	{
		title : '新闻在线',
		url : 'data/message.json',
		id : 'a_3'
	},
	{
		title : '段子',
		url : 'data/duanzi.json',
		id : 'a_4'
	}
];
/*
 * @描述 元素信息
*/
var element = {
	odiv : $('.odiv'),
	header : $('.header'),
	content : $('.content'),
	page : $('.page')
}

/*
 * @描述 方法存放地方
*/
var _fn = {
	createTab : function(){
		var i=0;
		var len=config.length;
		var arr = [];
		for(;i<len;i++){
			arr.push(`
				<span onclick="_fn.switch(this)" code="handle_${i+1}" class="h-tab${this.tabInit(config[i],i)}" url="${config[i]['url']}" 
				id="${config[i]['id']}">${config[i].title}</span>
			`);
		}
		element.header.innerHTML = arr.join('');

		this.getData()
	},//代码松耦合 
	tabInit : function(el,index,css){
		css = css || 'on'
		return index == 0?' '+css:'';
	},
	switch : function(obj){
		$('span.on').classList.remove('on');
		obj.classList.add('on');
		this.getData()
	},
	getData: function(){
		var url = $('span.on').getAttribute('url');
		ajax({
			url : url,
			callback : function(msg){
				//console.log(msg)
				var arr = ['T1348648517839','T1348647853363','result','段子'];
				_fn.fn_lists[$('span.on').getAttribute('code')](msg);
				
			}
		});
	},
	/*
	 * @描述 每页显示条数
	*/
	num : 6,
	next : function(obj){console.log($('span.cur'))
		$('span.cur').classList.remove('cur');
		obj.classList.add('cur')
		var msg = this.getPage(this.data,obj.getAttribute('num'));
		this.fn_lists.makeData(msg)
	},
	data : [],
	/*
	 * @描述 分页
	*/
	getPage : function(data,index){console.log(data)
		index = index || 1;
		var len = data.length%this.num==0 ? data.length/this.num:Math.ceil(data.length/this.num)
		var arr = [];
		var res = [];
		for(var i=0;i<len;i++){
			arr.push(`
				<span onclick="_fn.next(this)" class="p-num${this.tabInit(null,i,'cur')}" num='${i+1}'>${i+1}</span>
			`)
		}
		element.page.innerHTML=arr.join('');
		for(var i=0;i<data.length;i++){
			if((index-1)*this.num <=i && i<index*this.num){
				res.push(data[i])
			}
		}

		return res;

	},
	fn_lists : {
		makeData : function(data){
			var arr = [];
			for(var i=0;i<data.length;i++){
				arr.push(`
					<div class="c-info">
						<div class="c-title">${data[i].title}</div>
						<div class="c-pic">
							<div class="cp-l fl">
								<img width="200" src="${data[i].imgsrc}" />
							</div>
							<div class="cp-r fr">
								${data[i].digest}
							</div>
						</div>
						<div>
							时间：${data[i].mtime}
							来源：${data[i].source}
							下载次数：${data[i].downTimes}
							数量：${data[i].quality}
							类型：${data[i].tname?data[i].tname:'新闻'}
							优先级：${data[i].priority}
						</div>
					</div>
				`);
			}
			element.content.innerHTML = arr.join('');
		},
		handle_1 : function(msg){
			console.log(1,msg)
			var data = msg.T1348648517839;
			_fn.data = data;
			
			data = _fn.getPage(data);
			this.makeData(data)
			
		},
		handle_2 : function(msg){
			//console.log(2,msg)
			var data = msg.T1348647853363;
		},
		handle_3 : function(msg){
			//console.log(3,msg)
			var data = msg.result.data;
		},
		handle_4 : function(msg){
			//console.log(4,msg)
			var data = msg['段子'];
		}
	}
}



/*
 * @描述 初始化
*/
function init(){
	_fn.createTab();
}

init();



// 20条

// 一页显示6条
// 拿第二页 i代表页数 t代表显示多少条
// (i-1)*t =<  <i*t

