//全局昵称
var _nickname_ = ''

//输入昵称登录
function login(){
	var nickname_ = nickname.value.trim()
	if(!nickname_){
		return false
	}
	_nickname_ = nickname_
	//本地保存
	localStorage.setItem("nickname", nickname_)
	//过渡动画
	$("#login").addClass("hidediv")
	setTimeout(function(){
		$("#login").addClass("displaydiv")
		$("#container").removeClass("displaydiv")
		$("#login").removeClass("hidediv")
	},5000)
}

function send () {
	//获取输入框文字信息
	var question = input.value.trim()
	if(!question){
		return false
	}
	//退出
	if(question == "退出"){
		localStorage.removeItem("nickname")
		$("#container").addClass("hidediv")
		setTimeout(function(){
			$("#container").addClass("displaydiv")
			$("#login").removeClass("displaydiv")
			$("#container").removeClass("hidediv")
			$("#login").removeClass("hidediv")
			input.value = ""
			content.innerHTML = ''
		},5000)
		return false
	}
	// 生成问题对话框
	questionFun(question)
	//清空输入框
	input.value = ""
}

//生成问题对话框
function questionFun(question){
	//打印问题
	createTag(question,"question")
	setTimeout(function(){
		postApi(question)
		},1500);
}

//生成回答对话框
function answerFun(data){
	var zczc = handleResponse(data)
	console.log(zczc)
	createTag(zczc,"answer")
}

//向内容区域插入信息
function createTag(text,className){
	var newParent = document.createElement("div")
	newParent.setAttribute("class","list")
	var newChild = document.createElement("span")
	newChild.setAttribute("class",className)
	newChild.innerHTML = text

	newParent.appendChild(newChild)

	content.appendChild(newParent)
	//保持对话框滚动条在底部
	content.scrollTop = content.scrollHeight
}

// //图灵api响应信息类型判断
function handleResponse(data) {
	console.log("handleResponse:"+data.code)
	switch(data.code) {
		case 100000://文本类
        	return data.text
        case 200000://链接类
        	return data.text+":<a href='"+data.url+"'>"+data.url+"</a>"
        	// return `${data.text} : <a href=${data.url}>${data.url}</a>`
        // case 302000://新闻类
        // 	var listInfo = ''
        // 	(data.list || []).forEach((it) => {
        //             listInfo += `\n文章: ${it.article}\n来源: ${it.source}\n链接: ${it.detailurl}`
        //         })
        //     return `${data.text}\n${listInfo}`
        case 308000://菜谱类
        	return data.text
    	default:
            return data.text
	}
}

//图灵api ajax
function postApi(question){
	//初始化json数据
	var data = {     
		"key": "88e1b9427e814348940bc4d5f669a52e",            
		"info": question,
		"userid": _nickname_
	}
	//开始ajax
	$.ajax({ 
		type: 'POST',
		url: "http://www.tuling123.com/openapi/api",
		dataType:"json",
		data:data,
		async:false,
		success: function(data){
        	console.log(data)
        	answerFun(data)
    	}
	})
}

$(document).ready(function(){
	//初始化
	$("#main").css('height',document.body.clientHeight-130)
	$("#content").css('height',document.body.clientHeight-182)
	//如果本地有记录，则显示对话窗口
	if(localStorage.getItem('nickname')){
		$("#login").addClass("displaydiv")
		$("#container").removeClass("displaydiv")
	}
	//nickname enter事件
	$('#nickname').bind('keypress',function(event){
        if(event.keyCode == 13)      
        {login()}
     })
	//对话 enter事件
	$('#input').bind('keypress',function(event){
        if(event.keyCode == 13)      
        {send()}
     })
})
