var This = null;
function Uploader(params) {
    this.url = params.url,   //上传URL
    this.uploadBtn = params.uploadBtn,   //上传按钮
    this.progressBar = params.progressBar,   //进度条
    this.progressBarLabel = params.progressBarLabel,   //进度文本显示框：90%
    this.pick = params.pick,   //点击打开文件选择窗口的容器div
    this.onlyOneFile = params.onlyOneFile,    //文件个数限制
    this.sumOfFiles = 0,        //同时上传的文件数
    this.accept = params.accept,    //接受的文件后缀：*.jpg, *.mp3, *.txt, *.pdf等
                                    //接收的文件类型：application/*, audio/*, image/*, text/*, video/*
    this.thumb = params.thumb, //略缩图，写入一个或多个img标签
    this.thumbClassName = params.thumbClassName,   //略缩图内的img标签的className
    this.callBack = params.callback,
    this.datas = params.datas,
    this.init();
}
Uploader.prototype = {
    constructor: Uploader,
    startUpload: function() {  //开始上传
        var resultFile = document.getElementById("pick_ic0525").files;
        for (var num=0;num<resultFile.length;num++) {
            var dt = new Date().getTime();
            var key = dt.toString() + Math.random(0, 10000).toString();
            This.sentData(resultFile[num], key);
        }
    },
    showThumb: function() {   //读取文件的本地地址
        var resultFile = document.getElementById("pick_ic0525").files;
        This.sumOfFiles = resultFile.length;
        for (var num=0;num<resultFile.length;num++) {
            var reader = new FileReader();
            var className = This.thumbClassName;
            reader.readAsDataURL(resultFile[num]);
            var obj = document.getElementById(This.thumb);
            reader.onloadend = function (e) {
                var newEle = document.createElement("img");
                newEle.setAttribute("class", className);
                newEle.setAttribute("src", this.result);
                //var s = resultFile[num];
                //newEle.setAttribute("alt", resultFile[num].name);
                obj.appendChild(newEle);
            };
        }
    },
    init: function() {    //初始化
        This = this;
        var $pick = document.getElementById(this.pick);
        //上传按钮绑定
        document.getElementById(this.uploadBtn).onclick = this.startUpload;

        //创建容器
        var newEle = document.createElement("input");
        newEle.setAttribute("style", "display:none;");
        newEle.setAttribute("id", "pick_ic0525");
        newEle.setAttribute("type", "file");
        newEle.setAttribute("style", "width:0px;height:0px;");
        if (!this.onlyOneFile)
            newEle.setAttribute("multiple", "multiple");
        if (this.accept)
            newEle.setAttribute("accept", this.accept);
        $pick.appendChild(newEle);
        if (This.thumb) {
            document.getElementById(This.progressBar).innerHTML = '<div id="progressbar" style="width:0;height:100%;;position:abspolute;background:red;"></div>';
            document.getElementById("pick_ic0525").onchange = this.showThumb;
        }
        $pick.onclick = function() {
            document.getElementById("pick_ic0525").click();
        };
    },
    sentData: function(file, key) {
        //创建HTTP请求对象
        var xmlhttp = null;
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp=new XMLHttpRequest();
        } else {// code for IE6, IE5
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.open('POST', This.url, true);
        formData = new FormData();
        if (key !== null && key !== undefined) formData.append('key', key);

        //传写入传输给服务器的参数数据
        for (var key in This.datas)
            formData.append(key, This.datas[key]);

        //写入文件数据
        formData.append('file', file);
        xmlhttp.upload.onprogress = This.progress;
        xmlhttp.onprogress = This.progress;

        xmlhttp.onreadystatechange = function(response) {
            if (xmlhttp.readyState == 4)
                This.callBack(xmlhttp.status, xmlhttp.responseText)
        };
        xmlhttp.send(formData);
    },
    progress: function(evt) {
        if (evt.lengthComputable) {
            var percentComplete = Math.round(evt.loaded * 100 / evt.total);
            document.getElementById("progressbar").style.width = percentComplete + "%";
            
        }
    },
}