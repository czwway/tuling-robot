//全局昵称
var _nickname_ = ''


$(document).ready(function(){
	console.log(localStorage.getItem('nickname'))
	if(localStorage.getItem('nickname')){
		console.log("null localStorage")
	}

	//如果本地有记录
	if(localStorage.getItem('nickname')){
		$("#login").addClass("displaydiv")
		$("#container").removeClass("displaydiv")
	}
	//nickname enter
	$('#nickname').bind('keypress',function(event){
        if(event.keyCode == 13)      
        {login()}
     })
	//对话
	$('#input').bind('keypress',function(event){
        if(event.keyCode == 13)      
        {send()}
     })
})


function login(){
	let nickname_ = nickname.value.trim()
	if(!nickname_){
		return false
	}
	_nickname_ = nickname_
	localStorage.setItem("nickname", nickname_)
	$("#login").addClass("hidediv")
	setTimeout(function(){
		$("#login").addClass("displaydiv")
		$("#container").removeClass("displaydiv")
		$("#container").removeClass("hidediv")
	},5000)
	
}

function send () {
	// function body...
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
			$("#login").removeClass("hidediv")
			input.value = ""
			content.innerHTML = ''
		},5000)
		return false
	}
	// console.log("send:"+question)
	questionFun(question)
	//清空输入框
	input.value = ""
	//
	content.scrollTop = content.scrollHeight
}




function questionFun(question){
	//打印问题
	createTag(question,"question")
	//
	var data = {     
		"key": "88e1b9427e814348940bc4d5f669a52e",            
		"info": question,
		"userid": _nickname_
	}
	//
	$.ajax({ 
		type: 'POST',
		url: "http://www.tuling123.com/openapi/api",
		dataType:"json",
		data:data,
		async:false,
		// context: document.body, 
		success: function(data){
        	console.log(data)
        	answerFun(data)
    	}
	})
	// answerFun(question)
}
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
}

//图灵api响应信息类型判断
function handleResponse(data) {
	console.log("handleResponse:"+data.code)
	switch(data.code) {
		case 100000://文本类
        	return data.text
        case 200000://链接类
        	return `${data.text} : <a href=${data.url}>${data.url}</a>`
        case 302000://新闻类
        	var listInfo = ''
        	(data.list || []).forEach((it) => {
                    listInfo += `\n文章: ${it.article}\n来源: ${it.source}\n链接: ${it.detailurl}`
                })
            return `${data.text}\n${listInfo}`
        case 308000://菜谱类
        	return data.text
    	default:
            return data.text
	}
}






// document.onkeydown=function(event){
//             var e = event || window.event || arguments.callee.caller.arguments[0]          
//              if(e && e.keyCode==13){ // enter 键
//                  send()
//             }
//         } 