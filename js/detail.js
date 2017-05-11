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

        var requestJson = {"apiVersion": "1", "appId": "2000", "userId": "", "audioId": id};

        $.ajax({

            url: 'http://www.5ijoke.com/xiaohua/frontend/web/index.php?r=audio/detail',
            type: 'POST',
            data: JSON.stringify(requestJson),
            dataType: 'json',

            success: function (result) {

                console.log(result.state.stateCode);

                if (result.state.stateCode == "200") {

                    // var play_url = "http://www.5ijoke.com/xiaohua/frontend/web/uploads/test.mp3";

                    console.log(result);

                    var data = result.data;

                    if (data != null) {

                        setDetail(data);
                    }
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

    initPlayWave();

    initPlayTime();
})

function setDetail(data) {

    var avatar = data.portrait;
    var name = data.userName;
    var createTime = data.createTime * 1000;
    var playNum = data.playNum;
    var speakNum = data.speakNum;
    var content = data.textContent;
    var url = data.audioUrl;

    console.log("avatar:" + avatar);
    console.log("content:" + content);

    var audioUrl = "http://www.5ijoke.com:80/xiaohua/frontend/web/" + url;

    console.log("url:" + audioUrl);

    document.getElementById("avatar").setAttribute("src", avatar);
    $('#name').html(name);
    $('#data').html(timeago(createTime));
    $('#play_num').html("播放" + playNum);
    $('#speak_num').html("讲过" + speakNum);
    $('#content').html(content);
    document.getElementById("play_audio").setAttribute("src", audioUrl);

    //
    // var canvas = document.getElementById('canvas');
    //
    // if (canvas.getContext) {
    //     var ctx = canvas.getContext("2d");
    //     ctx.beginPath();
    //     ctx.strokeStyle = 'darkgreen';
    //     ctx.lineCap = 'round';
    //     ctx.lineWidth = 6;
    //     ctx.arc(160, 160, 150, 0, Math.PI, false);
    //     ctx.stroke();
    // }
    //
    // togglePlay();
}

function doPlay() {

    var btnPlay = document.getElementById("btn_play");
    var playAudio = document.getElementById("play_audio");

    btnPlay.setAttribute("src", "../images/icon_play.png");

    playAudio.loop = false;
    playAudio.addEventListener('ended', function () {

        btnPlay.setAttribute("src", "../images/icon_play.png");

    }, false);

    playAudio.addEventListener("timeupdate", function () {

        // var duration = playAudio.duration;
        // var currentTime = playAudio.currentTime;
        //
        // $('#play_time').html("00:32");

    }, false);

    function playPause() {

        if (playAudio.paused) {
            playAudio.play();
            btnPlay.setAttribute("src", "../images/icon_pause.png");
            doPlayWave();
        } else {
            playAudio.pause();
            btnPlay.setAttribute("src", "../images/icon_play.png");
            initPlayWave();
        }
    }

    playPause();

    doPlayWave();
}

function doPlayWave() {

    var canvas = document.querySelector("#play_wave"), context = canvas.getContext('2d');
    var width = canvas.width, height = canvas.height;
    var audio = document.querySelector("#play_audio");

    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;

    try {
        var audioContext = new window.AudioContext();
    } catch (e) {
        throw new Error("您的浏览器不支持！");
    }

    var analyser = audioContext.createAnalyser(), source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);//截取音频信号
    analyser.connect(audioContext.destination);//声音连接到扬声器

    function getSource() {

        if (audio.paused) {
            return false;
        }
        var data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);//得到音频能量值
        var playerTimeDomainData = new Uint8Array(analyser.fftSize);
        analyser.getByteTimeDomainData(playerTimeDomainData);//得到频谱
        var volumn = Math.max.apply(null, playerTimeDomainData) - Math.min.apply(null, playerTimeDomainData);
        context.clearRect(0, 0, width, height);

        drawColumns(data);
    }

    function drawColumn() {

        var gradient, lineHeight,
            start = 3,//从X轴何处坐标开始画
            lineWidth = 3,//柱体宽度
            lineGap = 3,//柱体间距
            dataGap = 5;//每隔多少取一个数据用于绘画，意抽取片段数据来反映整体频谱规律
        var count = parseInt((width - start * 2) / (lineWidth + lineGap));
        var thisCap, drawX;

        return function (data) {

            initPlayWave();

            for (var i = 0; i < count; i++) {
                thisCap = data[start + i * dataGap];
                //lineHeight = parseInt(height - (thisCap + thisCap * 0.8));
                lineHeight = parseInt((height - thisCap + thisCap * 0.5));
                context.lineWidth = lineWidth;
                drawX = start + (lineWidth + lineGap) * i;
                gradient = context.createLinearGradient(drawX, height, drawX, lineHeight);
                gradient.addColorStop(1, 'rgba(255,0,0,.5)');

                var gradient2 = context.createLinearGradient(drawX, height, drawX, lineHeight);
                gradient2.addColorStop(1, 'rgba(255,0,0,.5)');

                /*画频谱柱条*/
                context.beginPath();
                context.strokeStyle = "#11B7AD";
                context.moveTo(drawX, height / 2);
                context.lineTo(drawX, lineHeight / 2);
                context.stroke();


                context.beginPath();
                context.strokeStyle = "#11B7AD";
                context.moveTo(drawX, height / 2);
                context.lineTo(drawX, height / 2 + height / 2 - lineHeight / 2);
                context.stroke();
                context.closePath();
            }
        }
    }

    var drawColumns, timer;

    function init() {
        drawColumns = drawColumn();
        timer = setInterval(function () {
            getSource()
        }, 10);
    }

    init();
}

function initPlayWave() {

    var canvas = document.querySelector("#play_wave"), context = canvas.getContext('2d');
    var width = canvas.width, height = canvas.height;

    context.clearRect(0, 0, width, height);
    context.lineWidth = 2;
    context.beginPath();
    context.strokeStyle = "#11B7AD";
    context.moveTo(0, height / 2);
    context.lineTo(width - 6, height / 2);
    context.stroke();
    context.closePath();
}

function initPlayTime() {

    var playAudio = document.getElementById("play_audio");

    playAudio.addEventListener('durationchange', function () {

        var duration = playAudio.duration / 60;

        var formatDuration = duration.toFixed(2);

        var split = formatDuration.split(".");

        if (split[0] < 10) {
            formatDuration = "0" + formatDuration;
        }

        formatDuration = formatDuration.replace(".", ":");

        $('#play_time').html(formatDuration);

    }, false);
}

function timeago(dateTimeStamp) {

    //dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
    var second = 1000;      //把分，时，天，周，半个月，一个月用毫秒表示
    var minute = 1000 * 60;      //把分，时，天，周，半个月，一个月用毫秒表示
    var hour = minute * 60;
    var day = hour * 24;
    var week = day * 7;
    var halfamonth = day * 15;
    var month = day * 30;
    var year = month * 12;

    var now = new Date().getTime();   //获取当前时间毫秒
    var diffValue = now - dateTimeStamp; //时间差

    if (diffValue < 0) {
        return;
    }

    var secondC = diffValue / second;  //计算时间差的分，时，天，周，月
    var minC = diffValue / minute;  //计算时间差的分，时，天，周，月
    var hourC = diffValue / hour;
    var dayC = diffValue / day;
    var weekC = diffValue / week;
    var monthC = diffValue / month;
    var yearC = diffValue / year;
    var result;

    if (yearC >= 1) {

        result = " " + parseInt(yearC) + "年前"

    } else if (monthC >= 1) {

        result = " " + parseInt(monthC) + "月前"

    } else if (weekC >= 1) {

        result = " " + parseInt(weekC) + "周前"

    } else if (dayC >= 1) {

        result = " " + parseInt(dayC) + "天前"

    } else if (hourC >= 1) {

        result = " " + parseInt(hourC) + "小时前"

    } else if (minC >= 1) {

        result = " " + parseInt(minC) + "分钟前"

    } else if (secondC >= 1) {

        result = " " + parseInt(secondC) + "秒钟前"

    } else {

        result = "刚刚";
    }

    return result;
}
