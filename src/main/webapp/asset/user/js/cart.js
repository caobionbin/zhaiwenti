(function ($) {
    var cart = {
        init: function () {
            this.isScroll=1;
            this.initScroller();
            this.initShopState();
            this.bindCheckboxClick();
            this.bindCheckAll();
            this.autoCheckbox();
            $('a.arrow_num').on('click', this.initKeyBoard);
            $('.cart_item').on('click','.prd_gift .prd_price,.have_gift',this.initGiftList);
            $('.cart_item').on('click','p.attrs',this.initPrdColorSize);
            $('.block').on('click','.c_del',this.deletePackage);
            $('.cart_list').on('click','.c_edit',this.editShop);
            $('.cart_item').on('click','.garbage',this.deleteItem); // 单品删除
            $('.invlid_opt').on('click','a',this.deleteAllInvlid);
            $('#gift_block').on('click','.cart_item',this.changeItem);
            $('#gift_block').on('click','.c_close',this.closeBox);
            $('#gift_block').on('click','.c_btn',this.overGiftList);
            $('#choose_color_size').on('click','.c_btn',this.overColorSize);
            $('a.c_back').on('click',this.historyBack);
            $('.cart_item').on('click','.collect',this.collect);
			$(".header .menu").click(function(e){
				if($(this).hasClass("active")){
					$(this).removeClass("active");
					$(".t-nav").removeClass("active");
				}else{
					$(this).addClass("active");
					$(".t-nav").addClass("active");
				}
				e.preventDefault();
			});
        },
        historyBack:function() {
        },
        initScroller:function() {
            var h = $(".list_null").height();
            /*if(h){
               var navh = $(".nav_main").height() / 2;
               $(".list_null").css({"margin-top":-h / 2 + navh});
            }*/
             function iScrollClick(){
                if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) return false;
                if (/Chrome/i.test(navigator.userAgent)) return (/Android/i.test(navigator.userAgent));
                if (/Silk/i.test(navigator.userAgent)) return false;
                if (/Android/i.test(navigator.userAgent)) {
                   var s=navigator.userAgent.substr(navigator.userAgent.indexOf('Android')+8,3);
                   return parseFloat(s[0]+s[3]) < 44 ? false : true
                }
            }
            if(navigator.userAgent.indexOf("MQQB") > -1){
                $(".jp_block").css({"top":"50%"});
            }
            
            //设置frame的高度
          
             setTimeout(function(){
                if(h){
                    cart.empty = true;
                    $("html,body").css({"-webkit-overflow-scrolling":"touch","height":"auto"});
                    var count = $(".advs").val();
                    var width = (190 * count - 10) / 20;
                    $(".guessList").css({"width":width + "rem"});
                    /*$("#wrapper").css({"overflow":"hidden"});*/
                    $(".viewport section:last-child").css({"margin-bottom":"0px"});
                    /*$(".viewport section").css({"overflow":"hidden"});*/
                }else{
                    var windowHeight = window.innerHeight-$('footer').height() - $(".h_label").height();
                    cart.empty = false;
                    $("#wrapper").height(windowHeight);
                    $(".viewport").css({"overflow":"initial"});
                    cart.scroller= new IScroll('#wrapper',{click:iScrollClick()});
					$(".header .menu").on("click", function(){
						setTimeout(function(){
							var windowHeight = window.innerHeight - $(".t-nav").height() - $('footer').height() - $(".h_label").height();
							$("#wrapper").height(windowHeight);
							cart.scroller && cart.scroller.refresh();
						}, 500);
					});
                }
             },0);
                

        },
        bindCheckAll: function() {
            var that = this;
            $('#cart_check_all').click(function(){
                $('input[type=checkbox]', $('.block')).prop('checked', $(this).prop('checked'));
                var item_ids = '';
                $('div.cart_item', $('.content')).each(function(k, elm){
                    item_ids += $(elm).attr('item_id') +',';
                });
                if($(this).prop('checked')) {
                    that.checkItems(item_ids.substr(0, item_ids.length-1), '');
                } else {
                    that.unCheckItems(item_ids.substr(0, item_ids.length-1), '');
                }
            });
        },

        bindCheckboxClick: function () {
            var that = this;
            // 点击shop title前的checkbox
            $('input[type=checkbox]', $('.shop_title')).click(function () {
                var p = $(this).parent().parent();
                $('input[type=checkbox]', $('.cart_item', p)).prop('checked', $(this).prop('checked'));
                that.checkShopCheckboxes($(this));
                // check/uncheck this shop's products
                var item_ids = '';
                $('.cart_item', p).each(function(k, elm){
                    item_ids += $(elm).attr('item_id') +',';
                });
                $(this).prop('checked') ? that.checkItems(item_ids.substr(0, item_ids.length-1), '') : that.unCheckItems(item_ids.substr(0, item_ids.length-1), '');
                return;
            });
            // 点击单品前的checkbox
            $('input[type=checkbox]', $('.cart_item')).click(function () {
                var p = $(this).parent().parent();
                var checkboxes = $('input[type=checkbox]', $('.cart_item', p));
                if(typeof p.prev().attr('class') != 'undefined' && p.prev().hasClass('batch_promotion')) {
                    //that.batchPromotionUpdate(p.prev(), $(this).prop('checked'));
                    // check/uncheck this shop's products
                    var item_ids = '';
                    $('.cart_item', p).each(function(k, elm){
                        item_ids += $(elm).attr('item_id') +',';
                    });
                    $(this).prop('checked') ? that.checkItems(item_ids.substr(0, item_ids.length-1), '') : that.unCheckItems(item_ids.substr(0, item_ids.length-1), '');
                    return;
                } else {
                    var allChecked = true;
                    for (i = 0; i < checkboxes.length; i++) {
                        if (!$(checkboxes[i]).prop('checked')) {
                            allChecked = false;
                            break;
                        }
                    }
                    $('input[type=checkbox]', $('div:first-child', p)).prop('checked', allChecked);
                    $(this).prop('checked') ? that.checkItems($(this).parent().attr('item_id'), '') : that.unCheckItems($(this).parent().attr('item_id'), '');
                }
                that.checkShopCheckboxes($(this));
                // send response to backend
                return;
            });
            // 点击促销信息前的checkbox
            $('input[type=checkbox]', $('.promotion_title')).click(function () {
                var p = $(this).parent();
                $('input[type=checkbox]', p.next()).prop('checked', $(this).prop('checked'));
                var divs = $('.cart_item', p.parent());
                var item_ids = '';
                for (i = 0; i < divs.length; i++) {
                    item_ids += $(divs[i]).attr('item_id')+',';
                }
                item_ids = item_ids.substr(0, item_ids.length-1);
                $(this).prop('checked') ? that.checkItems(item_ids, '') : that.unCheckItems(item_ids, '');

            });
        },
        checkShopCheckboxes: function (elm) {
            // for promotion
            //console.log(elm.parents('.block'));
            var block = elm.parents('.block');
            if (block.children('*:nth-child(1)').hasClass('promotion_title')) {
                var shopCheckboxes = $('input[type=checkbox]', $('.shop_title', block));
                var allChecked = true;
                for (i = 0; i < shopCheckboxes.length; i++) {
                    if (!$(shopCheckboxes[i]).prop('checked')) {
                        allChecked = false;
                        break;
                    }
                }
                $('input[type=checkbox]', $('.promotion_title', block)).prop('checked', allChecked);
            }
        },

        autoCheckbox:function() {
            // 如果shop下所有单品选中状态，shop前的checkbox选中
            var cartAllChecked = true;
            $('.shop_title', '.content').each(function(k, elm){
                var allChecked = true;
                $('input[type=checkbox]', $('div.cart_item', $(elm).parent())).each(function(ik, ielm){
                    //console.log($(ielm).prop('checked'));
                    if(!$(ielm).prop('checked')) {
                        allChecked = false;
                    }
                });
                if(allChecked) {
                    $('input[type=checkbox]', $(elm)).prop('checked', true);
                    var promotionDiv = $(elm).parent().prev();
                    if(typeof promotionDiv.attr('class') != 'undefined' && promotionDiv.hasClass('promotion_title')) {
                        $('input[type=checkbox]', promotionDiv).prop('checked', true);
                    }
                    $('#cart_check_all').prop('checked', true);
                } else {
                    $('input[type=checkbox]', $(elm)).prop('checked', false);
                    var promotionDiv = $(elm).parent().prev();
                    if(typeof promotionDiv.attr('class') != 'undefined' && promotionDiv.hasClass('promotion_title')) {
                        $('input[type=checkbox]', promotionDiv).prop('checked', false);
                    }
                }
                if(!$('input[type=checkbox]', $(elm)).prop('checked')) {
                    cartAllChecked = false;
                }
            });
            //console.log(cartAllChecked);
            cartAllChecked ? $('#cart_check_all').prop('checked', true) : $('#cart_check_all').prop('checked', false);

        // 如果促销下所有shop都处于选中状态，则促销前checkbox选中

        },

        batchPromotionUpdate: function(p, checked) {
            var batch_count = 1;
            var batch_id = p.attr('batch_id');
            $('div.cart_item', p.next()).each(function(k, elm){
                batch_count = $('span.quantity', $(elm)).text();
            });
            checked ? this.checkItems('', batch_id + '-' + batch_count) : this.unCheckItems('', batch_id + '-' + batch_count);
        },

        initPrdColorSize: function () {
           if(!cart.empty){
                var body = document.getElementsByTagName('body')[0];
                body.style.height = document.documentElement.clientHeight + 'px';
            }
            var opt={},item = $(this).closest('.cart_item'),
            pid=item.attr('id'),itemId=item.attr('item_id'),
            spans = $(this).find('span'),
            pem = $(this).closest('.block').find('div.promotion_title');
            opt.attrs=[];
            spans.each(function(){
                opt.attrs.push($(this).text());
            });
            opt.pid=pid;
            opt.itemId=itemId;
            if(pem[0]){
                opt.batch_id=pem.attr('batch_id');
            }
            $.ajaxOpt('get_color_size',{
                pid:pid
            },function(data,opt){
                $('#choose_color_size').initSelectList(data,opt);
                $('#choose_color_size').slideUp();
            },opt);
        },
        checkItems: function(item_ids, batch_ids) {
        },

        unCheckItems: function(item_ids, batch_ids) {

            //            console.log(data);
            //            return;

        },

        getCartPriceAndQuantity: function() {
            var data = {};
            data.action = 'get_cart_price_quantity';
            data.sid = sid;
            // $.ajax({
            //     type: "GET",
            //     url: 'cart.php',
            //     data: data,
            //     dataType: "json",
            //     success: function(data) {
            //         if(data.errorCode != 0) {
            //             $.simpleBox(data.errorMsg);
            //             return false;
            //         } else {
            //             $('#cart_price').html(data.price);
            //             $('#cart_quantity').html(data.quantity);
            //         }
            //     }
            // });
        },
        //初始化购物车内店铺编辑状态。
        initShopState: function() {
            var str = window.location.hash;
            if(str.length>1){
                var s = str.substr(1),tar =$('#e_'+s),
                dels=tar.closest('.cart_list').find('.garbage');
                tar.addClass('on');
                dels.each(function(){
                    $(this).show().siblings('a').hide().end().siblings('.collect').show();
                });
            }
        },
        editShop:function () {
            var css= $(this).attr('class'),eds = $('.c_edit.on'),
            id=$(this).attr('id').substr(2),
            ads = eds.closest('.cart_list').find('.garbage'),
            dels = $(this).closest('.cart_list').find('.garbage');
            if(css.indexOf('on')<0){
                window.location.hash ='#'+id;
                ads.each(function(){
                    $(this).hide().siblings('a').show().end().siblings(".collect").hide();
                });
                eds.removeClass('on');
                $(this).addClass('on');
                dels.each(function(){
                    $(this).show().siblings('a').hide().end().siblings('.collect').show();
                });
            }else{
                window.location.hash ='';
                $(this).removeClass('on');
                dels.each(function(){
                    $(this).hide().siblings('a').show().end().siblings(".collect").hide();
                });
            }
        },
        //删除单个无效商品
        deleteItem:function (jq) {
            var param ={},batchId='',em=this==cart?jq:$(this),
            pm =em.closest('.block').find('div.promotion_title');
            item=em.closest('.cart_item');
            em.attr('class')=='garbage'&& em.addClass('on');
            pm[0] && (batchId = pm.attr('batch_id'));
            param.batch_ids = !!batchId?batchId:'';
            param.item_ids = !!batchId?'':item.attr('item_id');
            $.dialogBox('确定要删除该商品吗？','',function(){
               $.post("/user/delCartitem.action",{"id":param.item_ids},function (data) {
                  if(data=="success"){
                      item.remove();
                      jisuan();
                  }else if(data=="noLogin"){
                      window.location.href ="/user/login.action"
                  }else if(data=="error"){
                      alert("未知的错误");
                  }
               })
               
               
            },function(){
                em.removeClass('on');
            });
        },
        //关闭所有浮层面板，取消便捷操作
        closeBox:function(){
            $('#gift_block').slideDown();
            $('.f_mask').off();
        },
        //完成选择赠品换购商品；
        overGiftList:function(){
            console.log(1111)
        },
        //切换赠品；
        changeItem:function(){
            var radio = $(this).find('input'),
            ok=$(this).closest('#gift_block').find('.c_btn');
            radio.prop('checked','checked');
            ok.addClass('orange');
        },

    }
   //当地址栏和工具栏隐藏时重新计算滑动区域高度
   $(window).resize(function(event) {
       
            if(!cart.empty){
                var windowHeight = window.innerHeight-$('footer').height() - $(".h_label").height();
                $("#wrapper").height(windowHeight);
                var body = document.getElementsByTagName('body')[0];
                body.style.height = document.documentElement.clientHeight + 'px';
            }
            cart.scroller && cart.scroller.refresh();
   });
    $(document).ready(function(){
        cart.init();
        if(document.documentElement.scrollHeight <= document.documentElement.clientHeight) {
            window.hideurlbar = true;
            var body = document.getElementsByTagName('body')[0];
            body.style.height = document.documentElement.clientWidth / screen.width * screen.height + 'px';
        }
        window.hideurlbar && setTimeout(function() {
        	window.scrollTo(0, 1);
            // header高度始终取不带下拉窗口的原始高度
            var windowHeight = body.style.height.replace("px", "") - $('footer').height() - $(".h_label").height();
            
            cart.scroller && cart.scroller.refresh();
            !cart.empty && $("#wrapper").height(windowHeight);
        }, 0);
    });

})(Zepto);
