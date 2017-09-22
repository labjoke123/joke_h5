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

    if (id.length == 32) {

        var requestJson = {"apiVersion": "1", "appId": "2000", "uuid": id};

        $.ajax({

            headers: {"Content-Type": "application/json"},
            url: 'http://app.idouxiao.com/joke/audio/detail',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(requestJson),

            success: function (result) {

                console.log(result.state.code);

                if (result.state.code == "1000") {

                    // var play_url = "http://www.5ijoke.com/xiaohua/frontend/web/uploads/test.mp3";

                    console.log(result);

                    var data = result.data;

                    if (data != null) {

                        setDetail(data);
                    }
                }
            },

            error: function (result) {

                console.log(result);
            }
        })
    }

    function AddImgClickEvent() {

        var title = document.getElementById("title_dx");

        title.onclick = function () {

            window.location.href="http://a.app.qq.com/o/simple.jsp?pkgname=com.lzqz.idouxiao";
        }
    }

    AddImgClickEvent();

    // initPlayWave();

    // initPlayTime();
})

function setDetail(data) {

    var avatar = data.portrait;
    var name = data.userName;
    var createTime = data.createTime;
    var playNum = data.playNum;
    var speakNum = data.speakNum;
    var content = data.content;
    var url = data.url;

    if (typeof(speakNum) == "undefined") {
        speakNum = '0';
    }

    console.log("avatar:" + avatar);
    console.log("content:" + content);

    var audioUrl = url;

    console.log("url:" + audioUrl);

    document.getElementById("avatar").setAttribute("src", avatar);
    $('#name').html(name);
    $('#data').html(timeago(createTime));
    $('#play_num').html("播放" + playNum);
    $('#speak_num').html("讲过" + speakNum);
    $('#content').html(content);
    var playAudio = document.getElementById("play_audio");
    playAudio.setAttribute("src", audioUrl);
    playAudio.loop = false;
    playAudio.play();
}

function doPlay() {

    // var btnPlay = document.getElementById("btn_play");
    var playAudio = document.getElementById("play_audio");

    // btnPlay.setAttribute("src", "../images/icon_play.png");

    playAudio.loop = false;
    playAudio.addEventListener('ended', function () {

        // btnPlay.setAttribute("src", "../images/icon_play.png");
        // initPlayWave();

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
            // btnPlay.setAttribute("src", "../images/icon_pause.png");
            doPlayWave();
        } else {
            playAudio.pause();
            // btnPlay.setAttribute("src", "../images/icon_play.png");
            initPlayWave();
        }
    }

    playPause();

    // doPlayWave();
}

function playPause() {

    var playAudio = document.getElementById("play_audio");
    playAudio.pause();
}

function doPlayWave() {

    // var canvas = document.querySelector("#play_wave"), context = canvas.getContext('2d');
    // var width = canvas.width, height = canvas.height;
    // var audio = document.querySelector("#play_audio");
    //
    // window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
    //
    // try {
    //     var audioContext = new window.AudioContext();
    // } catch (e) {
    //     throw new Error("您的浏览器不支持！");
    // }
    //
    // var analyser = audioContext.createAnalyser();
    // var source = audioContext.createMediaElementSource(audio);
    //
    // source.connect(analyser);//截取音频信号
    // analyser.connect(audioContext.destination);//声音连接到扬声器
    //
    // function getSource() {
    //
    //     if (audio.paused) {
    //         return false;
    //     }
    //     var data = new Uint8Array(analyser.frequencyBinCount);
    //     analyser.getByteFrequencyData(data);//得到音频能量值
    //     var playerTimeDomainData = new Uint8Array(analyser.fftSize);
    //     analyser.getByteTimeDomainData(playerTimeDomainData);//得到频谱
    //     context.clearRect(0, 0, width, height);
    //
    //     drawColumns(data);
    // }
    //
    // function drawColumn() {
    //
    //     var lineHeight;
    //     var lineWidth = 3;//柱体宽度
    //     var start = 3;//从X轴何处坐标开始画
    //     var lineGap = 3;//柱体间距
    //     var dataGap = 5;//每隔多少取一个数据用于绘画，意抽取片段数据来反映整体频谱规律
    //     var count = parseInt((width - start * 2) / (lineWidth + lineGap));
    //     var thisCap;
    //     var drawX;
    //
    //     return function (data) {
    //
    //         context.beginPath();
    //         context.strokeStyle = "#11B7AD";
    //         context.moveTo(0, height / 2);
    //         context.lineTo(width - 6, height / 2);
    //
    //         for (var i = 0; i < count; i++) {
    //
    //             thisCap = data[start + i * dataGap];
    //             //lineHeight = parseInt(height - (thisCap + thisCap * 0.8));
    //             lineHeight = parseInt((height - thisCap + thisCap * 0.1));
    //             context.lineWidth = lineWidth;
    //             drawX = start + (lineWidth + lineGap) * i;
    //
    //             /*画频谱柱条*/
    //
    //             // context.moveTo(drawX, height / 2);
    //             // context.lineTo(drawX, lineHeight / 2);
    //             // context.moveTo(drawX, height / 2);
    //             // context.lineTo(drawX, height / 2 + height / 2 - lineHeight / 2);
    //
    //             context.moveTo(drawX, height / 2);
    //             context.lineTo(drawX, lineHeight);
    //             context.moveTo(drawX, height / 2);
    //             context.lineTo(drawX, height - lineHeight);
    //         }
    //
    //         context.stroke();
    //         // context.closePath();
    //     }
    // }
    //
    // var drawColumns;
    // var timer;
    //
    // function init() {
    //     drawColumns = drawColumn();
    //     timer = setInterval(function () {
    //         getSource()
    //     }, 1);
    // }
    //
    // init();
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
    // context.closePath();
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
