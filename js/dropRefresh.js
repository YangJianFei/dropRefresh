
/**
 * 实现下拉刷新
 * @param $listbody 装载列表的容器
 * return true/false true:可以刷新了. false：不用刷新
 */
var dropDownRefresh = function (handle,list) {
    var $list = list || $("body");//装载下拉刷新的容器。没有则默认为body

    var startX, startY, moveX, moveY, X, Y;
    var gorefresh = false;
    var downStart = false;//标识当向下滑动开始

    //开始
    $list.on("touchstart", function (e) {//changedTouches
        startX = e.touches[0].pageX;
        startY = e.touches[0].pageY;
    });

    $(".weui_mask_transparent").on("touchmove", function (e) {
        var a = e || window.event;
        a.stopPropagation();
        e.preventDefault();
    });

    $list.on("touchmove", function (e) {
        moveX = e.touches[0].pageX;
        moveY = e.touches[0].pageY;
        X = moveX - startX;
        Y = moveY - startY;

        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if ((Math.abs(Y) > Math.abs(X) && Y > 0 && scrollTop == 0) || gorefresh) {//此时手指为从顶部向下滑动
            var a = e || window.event;
            a.stopPropagation();
            e.preventDefault();

            downStart = true;
            gorefresh = true;
            if($list.find(".down_refresh").size()=="0"){
                $list.prepend("<div class='down_refresh'><i class='iconfont icon-xiajiantou text-gray'></i><span class='down_font'>下拉刷新<span></div>");
            }
            //$(".down_refresh", $list).remove();
            //$list.prepend("<div class='down_refresh'><i class='iconfont icon-xiajiantou text-gray'></i><span class='down_font'>下拉刷新<span></div>");
            $list.addClass("down_refresh_hide");
            //$(".down_refresh .iconfont", $list).removeClass("icon-xiajiantou").
            //    removeClass("icon-shangjiantou").removeClass("icon-loadding").addClass("icon-xiajiantou").next().text("下拉刷新");

            var scrollY = Y - 20;
            if(scrollY>60 && scrollY<=80){
                scrollY=60+parseInt((scrollY-60)/2);
            }else if(scrollY>80 && scrollY<=100){
                scrollY=70+parseInt((scrollY-80)/3);
            }else if(scrollY>100 && scrollY<=130){
                scrollY=76+parseInt((scrollY-100)/4);
            }else if(scrollY>130){
                scrollY=83+parseInt((scrollY-130)/4.5);
            }
            $list.css({
                "-webkit-transform": "translateY(" + scrollY + "px)",
                "-moz-transform": "translateY(" + scrollY + "px)",
                "-ms-transform": "translateY(" + scrollY + "px)",
                "-o-transform": "translateY(" + scrollY + "px)",
                "transform": "translateY(" + scrollY + "px)",
                "-webkit-transition": "all 0",
                "-moz-transition": "all 0",
                "-ms-transition": "all 0",
                "-o-transition": "all 0",
                "transition": "all 0"
            });
            if (Y > 50) {
                $(".down_refresh .iconfont", $list).removeClass("icon-xiajiantou").addClass("icon-shangjiantou").next().text("释放刷新");
            } else if (Y < 50) {
                $(".down_refresh .iconfont", $list).removeClass("icon-shangjiantou").addClass("icon-xiajiantou").next().text("下拉刷新");
            }
        } else {
            downStart = false;
            gorefresh = false;
        }

    });

    //离开
    $list.on("touchend", function (e) {
        if (!gorefresh) {
            gorefresh = false;
        } else {
            gorefresh = false;
            downStart = false;
            if (Y > 50) {
                $list.css({
                    "-webkit-transform": "translateY(0px)",
                    "-moz-transform": "translateY(0px)",
                    "-ms-transform": "translateY(0px)",
                    "-o-transform": "translateY(0px)",
                    "transform": "translateY(0px)"
                    //"-webkit-transition": "all 500ms ease-out",
                    //"-moz-transition": "all 500ms ease-out",
                    //"-ms-transition": "all 500ms ease-out",
                    //"-o-transition": "all 500ms ease-out",
                    //"transition": "all 500ms ease-out"
                });
                $(".down_refresh .iconfont", $list).removeClass("icon-xiajiantou").removeClass("icon-shangjiantou").addClass("icon-loadding").next().text("正在加载");
                setTimeout(function(){
                    handle();
                    setTimeout(function(){
                        $(".down_refresh").remove();
                    },300);
                    tip("已更新到最新",500,$("#right"));
                },200);
            } else {
                $(".down_refresh", $list).remove();
                $list.css({
                    "-webkit-transform": "translateY(0px)",
                    "-moz-transform": "translateY(0px)",
                    "-ms-transform": "translateY(0px)",
                    "-o-transform": "translateY(0px)",
                    "transform": "translateY(0px)",
                    "-webkit-transition": "all 500ms ease-out",
                    "-moz-transition": "all 500ms ease-out",
                    "-ms-transition": "all 500ms ease-out",
                    "-o-transition": "all 500ms ease-out",
                    "transition": "all 500ms ease-out"
                });
            }
        }
    });

};