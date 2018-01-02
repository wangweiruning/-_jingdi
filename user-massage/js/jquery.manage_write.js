'use strict';

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery || Zepto);
    }	
}(function($){
    var m = {};
 	var g = {};
    m.OPENING = false;
    m._OPTIONS = {
        title: false,
        animateIn : false,
        animateOut : false,
        onSubmit : false,
        onCancel : false,
        required: false, 
    };

    m.tplBase = "<div class=\"gdialog-wrap\">";
    m.tplBase += "<div class=\"gdialog-container\">";
    m.tplBase += "{{HEADER}}";
    m.tplBase += "<div class=\"gdialog-content\">{{message}}{{INPUT}}</div>";
    m.tplBase += "<div class=\"gdialog-button-group\">{{BUTTON_CANCEL}} <button class=\"button button-ok\">确定</button></div>";
    m.tplBase += "</div>";
    m.tplBase += "</div>";

    m.tplHeader = "<div class=\"gdialog-header\">{{title}}</div>";
    m.tplInput = "<div class=\"gdialog-field\"><input type=\"text\" placeholder=\"请输入要修改的密码\" id=\"write\"></div>";

    m.getTeplate = function(type, message, options){
        var t = m.tplBase;
        
        if( type !== 'alert' ){ 
            t = t.replace("{{BUTTON_CANCEL}}", "<button class=\"button button-cancel\">取消</button>"); 
        } else {
            t = t.replace("{{BUTTON_CANCEL}}", ""); 
        }
        if( type == 'prompt' ){ 
            t = t.replace("{{INPUT}}", m.tplInput); 
        } else {
            t = t.replace("{{INPUT}}", ""); 
        }        
        if( options.title ){ 
            t = t.replace("{{HEADER}}", m.tplHeader.replace("{{title}}", options.title) ); 
        } else {
            t = t.replace("{{HEADER}}", ""); 
        }
        t = t.replace("{{message}}", message ); 
        return t;
    };

    m.clear = function(){
        $('.gdialog-shadow').length ? $('.gdialog-shadow').remove() : '';
        $('.gdialog-wrap').length ? $('.gdialog-wrap').remove() : '';
    };

    m.Dialog = function(){
        var that = this;

        that.close = function(){
            $('.gdialog-shadow').addClass("animated fadeOut");
            if( that.options.animateOut ){
                if( that.options.animateIn ){ that.container.find('.gdialog-container').removeClass(that.options.animateIn) }
                that.container.find('.gdialog-container').addClass('animated '+that.options.animateOut);
                setTimeout(function(){
                    that.container.removeClass('is-active');
                    that.container.remove();
                    m.OPENING = false;
                    $('.gdialog-shadow').remove();
                }, 800);
            }else {
                that.container.remove();
                m.OPENING = false;
                $('.gdialog-shadow').remove();
            }
        };

        that.addEvents = function(){
            that.btnOk.on("click", function(e){
                e.preventDefault();
    
              	var manage =  window.sessionStorage.getItem("manage");
				var user  =  window.sessionStorage.getItem("user_id");
                console.log(user)
                /*
                 
                 * 删除需要传入两个参数
                 * 
                 * 管理员的账号
                 * 
                 * 用户的账号
                 * 
                 * 
                 * 
                 * */
                if ($("#write").val()=="") {
                	alert("内容不能为空!")
                } else{
                	
                
              
	               $.ajax({//点击确认按钮时，执行提交功能，后台删除数据
						type:"post",
						url:"https://jindi163.com:8443/JDLot/admin/log/info",
						data:{
						pageNum:1,
						pageSize:20
					},
						dataType:'json',
						contentType:"application/json",
						success:function(data){
						var data= data.datas;
						console.log(data)
						setTimeout(function(){
							window.location.href="manage_list.html";
								that.close();
								},2000)
							}
					})
	             }  
        	});
            that.btnCancel.on("click", function(e){
                e.preventDefault();
                var res = false;
                if( that.field.length && that.field.val().length !== 0 ){ 
                    res = that.field.val(); 
                }
                if( typeof that.options.onCancel == 'function' ){
                    that.options.onCancel(res);
                }
                that.close();
            });
        }

        this.init = function(type, message, options, defaultValue){
            if( m.OPENING ){ $('.gdialog-shadow, .gdialog-wrap').remove(); }
            m.clear();

            that.options = m.getOptions(options);

            $('body').append("<div class=\"gdialog-shadow\"></div> "+m.getTeplate(type, message, that.options) );
            that.container = $('body').find('.gdialog-wrap');
            that.btnOk = that.container.find('.button-ok');
            that.btnCancel = that.container.find('.button-cancel');
            that.field = that.container.find('input');
            if( defaultValue && that.field.length ){
                that.field.val(defaultValue);
            };

            that.container.addClass('is-active').css({'top': $(window).scrollTop()+50});
            if( that.options.animateIn ){
                that.container.find('.gdialog-container').addClass('animated '+that.options.animateIn);
            }
            m.OPENING = true;

            that.addEvents();
        };
    };

    m.getOptions = function(options){
        var o = $.extend({}, m._OPTIONS);

        if( typeof options == 'object' ){
          $.each(options, function(key, val){
            o[key] !== undefined ? o[key] = val : console.error("The option \""+key+"\" not exist.");
          });
        }

        return o;
    };

    //global functions
    g.alert = function(message, userOptions){
        var message = message || "";
        var userOptions = userOptions || {};
        var dialog = new m.Dialog;
        dialog.init('alert', message, userOptions);
    };

    g.confirm = function(message, userOptions){
        var message = message || "";
        var userOptions = userOptions || {};
        var dialog = new m.Dialog;
        dialog.init('confirm', message, userOptions);
    };

    g.prompt = function(message, defaultValue, userOptions){
        var message = message || "";
        var userOptions = userOptions || {};
        var dialog = new m.Dialog;
        dialog.init('prompt', message, userOptions, defaultValue);
    };

    g.config = function(options){
        if( typeof options !== 'object' ){ return false; }
        $.each(options, function(key, val){
            m._OPTIONS[key] !== undefined ? m._OPTIONS[key] = val : console.error("The option \""+key+"\" not exist.");
        });
    };

    $.glog = $.glog || g;
}));
