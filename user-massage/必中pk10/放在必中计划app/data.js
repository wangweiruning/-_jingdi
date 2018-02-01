$(function() {


  function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var url = "http://www.jindi163.com:8888/manage/user/login.do?planInfoId=7&planNum=A&phase=2&uid=14&appid=1&lotType=1";

    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
      var str = url.substr(url.indexOf("?") + 1);
      strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
      }
    }
    console.log(theRequest); //返回数据

    return theRequest;
  }



  var Request = new Object(); //创建对象，用于接收参数
  Request = GetRequest();
  if (Request != undefined || Request != "") {
    var planInfoId = Request["planInfoId"];
    var planNum = Request["planNum"];
    var phase = Request["phase"];
    var uid = Request["uid"];
    var appid = Request["appid"];
    var num = Request["lotType"];
    var lotteryName="";

                if (appid==1) {
                  lotteryName="pk10";
                } else if (appid==2){
                    lotteryName="cqssc";
                } else if (appid==3){
                    lotteryName="xyftpk10";
                } else if (appid==4){
                       if (num==1) {
                          lotteryName="jsks";
                      } else if (num==2){
                          lotteryName="jlks";
                      } else if (num==3){
                          lotteryName="ahks";
                      }
                      else if (num==4){
                          lotteryName="gxks";
                      }
                }else{
                  appid=1;
                  lotteryName="pk10";
                }

    var URL = 'http://www.jindi163.com:8888/app/plan/select';
    var opennum = "http://47.94.140.92:8080/JDLot/type/new/number";
    var aas = "";
    var Time_new;
    getTimes();
    getNum();

    function time() {
      Time_new--;

      if (Time_new <= 0) {
        setTimeout(function() {
          getTimes()
          getNum()
          console.log(Time_new)
        }, 2000)
      } else {
        setTimeout(function() {
          time()
          console.log(Time_new)
        }, 1000)
      }
    }

    function getTimes() {
      console.log(lotteryName)
      hui.postJSON(
        'http://www.jindi163.com:8888/app/common/next_time', {
          "lotteryName": lotteryName
        },
        function(res) {
          console.log(res)
          Time_new = res.data;
          console.log(Time_new)
          time();
        }

      )
    }


    if (uid == undefined || uid == "") {
      hui.toast("请先登录");
      return false;
    }
    hui.loading("加载中。。。");

    function getNum() {


      $.ajax({ //请求数据
        type: 'post',
        url: URL,
        dataType: 'json',
        headers: {
          contentType: "application/json"
        },
        data: {
          planInfoId: planInfoId,
          planNum: planNum,
          phase: phase, //期数
          uid: uid,
          num: num,
          appId: appid
        },
        success: function(data) {
          hui.closeLoading();

          console.log(data)
          $("#jutidata").empty();
          $("#data_show").empty();
          
          $("#data_h1").empty();
          if (data.status == "1") {
            hui.toast(data.msg);
            var imgs = '<article>' +
              '<p class="error-title">' +
              '<span class="va-m"><img src="./endtime.png" style="width:25%;margin-left:40%"></span>' +
              '</p>' +
              '<p class="error-description" style="text-align:center">~暂无更多数据~</p>' +
              '</article>';
            hui("#shuju").html(imgs);
            return
          } else if (data.status == "0") {
            aas = data.data[0].awardPhase;
            var pps = "";
            var res = data.data;
            data = data.data;
            console.log(data)
            if (data.length > 10) {
              data = data.slice(0, 20);

            }

            $("#data_h1").html(res[0].planName + phase + "期"); //标题 

            // pps   最新一期开奖结果

            var html = "<tr><th style='width:20%'>期数</th><th>预测号码</th><th>当期</th><th>开奖</th></tr>";
            data.reverse(); //翻转数组
            $.map(data, function(item) { //动态创建具体开奖种类  ：大小单双
              //         +item.planName+       计划名称   
             

              var Cts = item.planNumber;
              if (Cts.indexOf("0") > 0) {
                Cts = Cts;
              } else {
                Cts = Cts + '<span style="color:#FFFFFF;margin:0;padding:0">0</span>';
              }

              var awardPhase = item.awardPhase;
              awardPhase = awardPhase.slice(awardPhase.length - 3);



              html += '<tr>' +
                      '<td>'+item.payPhase+'</td>' +
                      '<td>'+Cts+'</td>' +
                      '<td style="margin:0 0.1rem"><span>'+awardPhase+'</span>期</td>' +
                      '<td style="color:red;">'+(item.isWinning == 0 ? "错" : item.isWinning == 1 ? "中" : "开奖中") + '</td>'+
                      '</tr>';
            });

            $("#jutidata").html(html);
            show_nun();
          
          }

        },
        error: function(err) {
          var imgs = '<article>' +
            '<p class="error-title">' +
            '<span class="va-m"><img src="./endtime.png" style="width:25%;margin-left:40%"></span>' +
            '</p>' +
            '<p class="error-description" style="text-align:center">~暂无更多数据~</p>' +
            '</article>';
          hui("#shuju").html(imgs)
        }
      })
    }
  } else {
    return false;
  }


  function show_nun() {
    $.ajax({
      type:"post",
      url:"http://47.94.140.92:8080/JDLot/type/new/number", 
      data:{"lottery_name":'type_'+lotteryName},
       dataType: 'json',
          contentType: "application/json",
      success: function(res) {
      console.log(res.datas[0].period)

      var awardPhase = res.datas[0].period;


      awardPhase = awardPhase.slice(awardPhase.length - 3)
      var pps = '<p style="color:red ;text-align:center" class="opennum">第' + awardPhase + '期开奖号码:</p>' +
        '<p style="text-align:center" class="opennum">' + res.datas[0].number + '</p>';
      $("#data_show").append(pps);
      //复制功能实现

      
    }, 
    error:function(err) {

    }

    })

  }
  var htmls = '<input type="button" value="一键复制"  data-clipboard-action="copy" data-clipboard-text="" class="btn_list">';
     $("#shuju").append(htmls);
     $('.btn_list').on('click', function() {
        var value = $("#alldata").text();
        $('.btn_list').attr('data-clipboard-text', value);
        var clipboard = new Clipboard('.btn_list');
        clipboard.on('success', function(e) {
          hui.toast('复制成功');
        });
        clipboard.on('error', function(e) {
          hui.toast('复制失败');
        });
      })
   
})