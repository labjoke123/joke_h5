$(function () {
    var obj = Parse(),
        code = obj.code,
        openid;
    window.localStorage.getItem("name") ? name = $('.name').val(window.localStorage.getItem("name")) : $('.name').val('');
    window.localStorage.getItem("phone") ? name = $('.phone').val(window.localStorage.getItem("phone")) : $('.phone').val('');
    window.localStorage.getItem("nameStop") ? name = $('.stop_name').val(window.localStorage.getItem("nameStop")) : $('.stop_name').val('');
    window.localStorage.getItem("content") ? name = $('.content').val(window.localStorage.getItem("content")) : $('.content').val('');
    $('.btn').on('click', function () {
        var name = $('.name').val(),
            phone = $('.phone').val(),
            nameStop = $('.stop_name').val(),
            content = $('.content').val();
        window.localStorage.setItem("name", name);
        window.localStorage.setItem("phone", phone);
        window.localStorage.setItem("nameStop", nameStop);
        window.localStorage.setItem("content", content);
        if (!code) {
            window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx489321bacf87bcef&redirect_uri=' + encodeURIComponent('http://api.hlvan.cn/active/html/index.html') + '&response_type=code&scope=snsapi_userinfo&state=12sdgFA3#wechat_redirect';
        } else {
            if (name == '') {
                dialogFn.remind('请填写您的姓名');
                return false;
            } else if (phone == '') {
                dialogFn.remind('请填写您的手机号');
                return false;
            } else if (nameStop == '') {
                dialogFn.remind('请填写您的店铺名称');
                return false;
            } else if (content == '') {
                dialogFn.remind('请填写您的拉票宣言');
                return false;
            } else {
                $.ajax({
                    url: 'http://api.hlvan.cn/wxController/getOpenid?callback=?',
                    type: 'GET',
                    data: {
                        appId: 'wx489321bacf87bcef',
                        secret: 'c5504674e103380340d4d8ace0a912f9',
                        code: code,
                    },
                    dataType: 'jsonp',
                    success: function (e) {
                        console.log(e);
                        if (e.state.stateCode == '0') {
                            openid = e.data.openid;
                            if (!openid) return false;
                            $.ajax({
                                url: '/popularKingController/toBeKing',
                                type: 'post',
                                data: {
                                    electorName: name,
                                    electorPhone: phone,
                                    declaration: content,
                                    shopName: nameStop,
                                    electorOpenid: openid
                                },
                                dataType: 'json',
                                success: function (e) {
                                    console.log(e);
                                    if (e.state.stateCode == '0') {
                                        $('.mask').show();
                                        window.localStorage.removeItem('name');
                                        window.localStorage.removeItem('phone');
                                        window.localStorage.removeItem('nameStop');
                                        window.localStorage.removeItem('content');
                                        setTimeout(function () {
                                            window.location.href = '../html/vote.html?openid=' + openid + '';
                                        }, 1500)
                                    } else {
                                        dialogFn.remind(e.state.stateMessage);
                                    }
                                }
                            })
                        }
                    }
                })
            }
        }

    })
})