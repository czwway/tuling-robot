function send () {
	// function body...
	//获取输入框文字信息
	var question = input.value.trim();
	if(!question){
		return false;
	}
	// console.log("send:"+question)
	questionFun(question);
	//清空输入框
	input.value = ""
	//
	content.scrollTop = content.scrollHeight;
}




function questionFun(question){
	//打印问题
	createTag(question,"question")
	//
	var data = {     
		"key": "88e1b9427e814348940bc4d5f669a52e",            
		"info": question,
		"userid": "123456"
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
        	console.log(data);
        	answerFun(data)
    	}
	});
	// answerFun(question);
}
function answerFun(data){
	
	
	var zczc = handleResponse(data)
	console.log(zczc)
	createTag(zczc,"answer")
}


//向内容区域插入信息
function createTag(text,className){
	var newParent = document.createElement("div");
	newParent.setAttribute("class","list")
	var newChild = document.createElement("span");
	newChild.setAttribute("class",className)
	newChild.innerHTML = text;

	newParent.appendChild(newChild)

	content.appendChild(newParent);
}

//图灵api响应信息类型判断
function handleResponse(data) {
	console.log("handleResponse:"+data.code)
	switch(data.code) {
		case 100000://文本类
        	return data.text;
        case 200000://链接类
        	return `${data.text} : <a href=${data.url}>${data.url}</a>`;
        case 302000://新闻类
        	var listInfo = '';
        	(data.list || []).forEach((it) => {
                    listInfo += `\n文章: ${it.article}\n来源: ${it.source}\n链接: ${it.detailurl}`;
                });
            return `${data.text}\n${listInfo}`;
        case 308000://菜谱类
        	return data.text;
    	default:
            return data.text;
	}
}






document.onkeydown=function(event){
            var e = event || window.event || arguments.callee.caller.arguments[0];          
             if(e && e.keyCode==13){ // enter 键
                 send();
            }
        }; 