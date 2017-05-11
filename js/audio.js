/**
 * Created by luokaiwen on 17/2/23.
 */
$(function () {

    var id = -1;
    var obj = Parse();

    if (obj) {
        id = obj.audioId;
        console.log(id);
    }

    console.log(obj);

    if (id > 0) {

        var requestJson = {"apiVersion": "1", "appId": "2000", "audioId": id};

        $.ajax({

            url: 'http://www.5ijoke.com/xiaohua/frontend/web/index.php?r=audio/detail',
            type: 'POST',
            data: JSON.stringify(requestJson),
            dataType: 'json',

            success: function (result) {

                console.log(result.state.stateCode);

                if (result.state.stateCode == "200") {

                    // var play_url = "http://www.5ijoke.com/xiaohua/frontend/web/uploads/test.mp3";

                    var url = result.data.audioUrl;

                    if (url != null) {

                        var audioUrl = "http://www.5ijoke.com:80/xiaohua/frontend/web/" + url;

                        console.log(audioUrl);

                        setPlayUrl(audioUrl);
                    }

                    console.log(result);
                }
            },

            error: function (result) {

                // var play_url = "http://www.5ijoke.com/xiaohua/frontend/web/uploads/test.mp3";
                //
                // setDetail(play_url);

                console.log(result);
            }
        })
    }
})

function setPlayUrl(play_url) {

    document.getElementById("audio").setAttribute("src", play_url);

    var canvas = document.getElementById('canvas');

    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.strokeStyle = 'darkgreen';
        ctx.lineCap = 'round';
        ctx.lineWidth = 6;
        ctx.arc(160, 160, 150, 0, Math.PI, false);
        ctx.stroke();
    }

    togglePlay();
}