$(function(){
	function  ajax_act(param){
		var _this = this;
		$.ajax({
			type:param.type || 'get',
			url:param.url || '',
			dataType:param.dataType || 'json',
			data:param.data || '',
			contentType:param.contentType || 'application/json',
			// processData:param.processData || true,
			// mimeType:param.mimeType || '',
			success:function(res){
					console.log(res)
				if ('0'===res.status) {
					typeof param.success === 'function' && param.success(res.data,res.msg);
				} else if('10'===res.status){//如果没有登录跳转到登录
					_this.do_login();
				} else if('1'===res.status){//请求 数据错误
					typeof param.error === 'function' && param.error(res.msg);
				}
			},
			error:function(res){
					typeof param.error === 'function' && param.error(res.statusText);
			}
		})
	}








show_listView()

	function show_listView(){
		list_data = {
			type:'post',
			url:'http://www.jindi163.com:8888/manage/user/login.do',
			dataType:'json',
			data:{
				planInfoId:1,
                      planNum:'A',
                      phase:1,//期数
                      uid:14
                  },
            contentType:"application/json",
			success:function(res){
				console.log(res)
			},
			error:function(res){
				console.log(res)	
			}
		};
		ajax_act(list_data)
	}

	
})