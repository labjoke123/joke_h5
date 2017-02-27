//解析地址栏参数
function Parse() {
    var url = location.search.substr(1), obj = {};
    if (url) {
        var arr = url.split('&'),
            len = arr.length;
        for (var i = 0; i < len; i++) {
            var parse = arr[i].split('=');
            obj[parse[0]] = parse[1];
        }
        return obj;
    }
    return false;
}
//提示文字弹框
var dialogFn = {
    remind: function (title) {
        var html = '<div class="dialog">'
            + '<div class="title">' + title + '</div>'
            + '</div>';
        if ($('.dialog').length > 0) {
            return false;
        }
        $('body').append(html);

        setTimeout(function () {
            $('.dialog').remove();
        }, 1500)
    }
}