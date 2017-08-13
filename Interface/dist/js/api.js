//数据池
var mainData={};


//将指定数据保存
function writeApi(data) {
    $.ajax({
            type:'POST',
            url:'http://localhost:3000/write',
            data:{dataKs:JSON.stringify(data)},
            success:function (data) {
                console.log(data.status);
                readApi();
            },
            error:function () {
                console.log('保存失败');
                alert('操作失败');
                readApi();
            }
    })
}

//将保存的数据读入数据池
function readApi() {
    $.ajax({
            type:'POST',
            url:'http://localhost:3000/read',
            success:function (data) {
                //console.log(data);               
                mainData = JSON.parse(data);
                ksBalance();
                selectFilling('addType',mainData.inType);
                $("#addMainType").change(function (){
                    switch($("#addMainType").val())
                    {
                        case "收入":
                            selectFilling('addType',mainData.inType);
                            break;
                        case "支出":
                            selectFilling('addType',mainData.outType);
                            break;
                    }
                });
            },
            error:function () {
                alert('数据请求失败');
            }
    });
    //mainData = JSON.parse( mainData );
}

//余额页面加载
function ksBalance() {
    $('#documentbox').load('./document/balance.html',function () {
        var z = 0 ;
        var f = 0 ;
        for(var i = 0; i < mainData.data.length ;i++){
            if(mainData.data[i].mainType === "收入"){
            z+=mainData.data[i].money;
            }
            else{
            f+=mainData.data[i].money;
            }
        };
        var x = z-f;
        $("#balance").text(x);
    });
}

//列表页面加载
function ksTable() {
    $('#documentbox').load('./document/table.html',function (){
        for(var i=0; i < mainData.data.length ; i++){
            $('#tableKs tbody').append('<tr><td>'+mainData.data[i].date+'</td><td>'+mainData.data[i].mainType+'</td><td>'+mainData.data[i].type+'</td><td>'+mainData.data[i].money+'</td><td><button class="btn btn-danger btn-xs" onclick="removeRecording('+mainData.data[i].id+')">删除</button></td></tr>');
        }
        $('#tableKs').DataTable({
            "searching": false,
            "lengthChange": false,
            "info": false,
            "pageLength": 7,
            language: {
                "sProcessing": "处理中...",
                "sLengthMenu": "显示 _MENU_ 项结果",
                "sZeroRecords": "没有匹配结果",
                "sInfo": "第 _START_ 至 _END_ 项，共 _TOTAL_ 项",
                "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
                "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
                "sInfoPostFix": "",
                "sSearch": "搜索:",
                "sUrl": "",
                "sEmptyTable": "表中数据为空",
                "sLoadingRecords": "载入中...",
                "sInfoThousands": ",",
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": "<",
                    "sNext": ">",
                    "sLast": "末页"
                },
                "oAria": {
                    "sSortAscending": ": 以升序排列此列",
                    "sSortDescending": ": 以降序排列此列"
                }
            }
        });
        selectFillingAll('filterType');
    });
}

//图表页面加载
function ksCharts() {
  $('#documentbox').load('./document/charts.html',function (){
      pieChart('#inCharts',mainData.inType);
      pieChart('#outCharts',mainData.outType);
      var z = 0 ;
      var f = 0 ;
      for(var i = 0; i < mainData.data.length ;i++){
        if(mainData.data[i].mainType === "收入"){
        z+=mainData.data[i].money;
        }
        else{
        f+=mainData.data[i].money;
        }
      };
      $("#inNumber").text(z);
      $("#outNumber").text(f);
  });
}

//管理页面加载
function ksCog() {
  $('#documentbox').load('./document/cog.html',function (){
      typeTableLoading('#inTypeTable',mainData.inType);
      typeTableLoading('#outTypeTable',mainData.outType);
  });
}

//将指定类型的数据充填到指定的下拉列表中
function selectFilling( selectID , dataArray ) {
    //清空原先的选项
    $("#"+selectID).empty();
    //循环遍历，添加选项
    for(var i=0;i<dataArray.length;i++){
        $("#"+selectID).append('<option>'+dataArray[i]+'</option>');
    }
}

//充填一个全分类的下拉框
function selectFillingAll(selectID) {
    $("#"+selectID).empty();
    $("#"+selectID).append('<option>全部分类</option>');
    for(var i=0;i<mainData.inType.length;i++){
        $("#"+selectID).append('<option>'+mainData.inType[i]+'</option>');
    }
    for(var i=0;i<mainData.outType.length;i++){
        $("#"+selectID).append('<option>'+mainData.outType[i]+'</option>');
    }
}

//将添加的数据保存
function addRecording( ) {
    if( $('#addMoney').val()===''&& $('#addDate').val()===''){
        alert('请填写完整的记录');
        return;
    }
    var newID = 0;
    if(mainData.data.length>0){
        newID = mainData.data[mainData.data.length-1].id+1
    }
    var recording = {
        id : newID,
        mainType : $('#addMainType').val(),
        type:$('#addType').val(),
        money:parseInt($('#addMoney').val()),
        date:$('#addDate').val()
    };
    mainData.data[mainData.data.length] = recording;
    writeApi(mainData);
    $('#addMainType').val('');
    $('#addType').val('');
    $('#addMoney').val('');
    $('#addDate').val('');
    $('#addModal').modal('hide');
}

//删除记录
function removeRecording( reID ) {
    for(var i =0 ; i<mainData.data.length;i++){
        if( mainData.data[i].id === reID ){
            mainData.data.splice(i,1);
            writeApi(mainData);
            return;
        }
    }
    
}

//筛选功能
function filterRecording() {   
    var d =new Date();
    if($('#startDate').val()===""){
        $('#startDate').val("1997-01-01");
    }
    if($('#endDate').val()===""){
        $('#endDate').val("2030-01-01");
    }
    var endDate = $('#endDate').val();
    var startDate = $('#startDate').val();
    var filterType = $('#filterType').val();
    if(endDate<startDate){
        alert("起始时间不能大于截止时间");
        $('#endDate').val('');
        $('#startDate').val('');
        return;
    }
    $('#documentbox').load('./document/table.html',function (){
        for(var i=0;i<mainData.data.length;i++){
            if(mainData.data[i].date>=startDate&&mainData.data[i].date<=endDate){
                if(filterType=="全部分类"||filterType==mainData.data[i].type){
                    $('#tableKs tbody').append('<tr><td>'+mainData.data[i].date+'</td><td>'+mainData.data[i].mainType+'</td><td>'+mainData.data[i].type+'</td><td>'+mainData.data[i].money+'</td><td><button class="btn btn-danger btn-xs" onclick="removeRecording('+mainData.data[i].id+')">删除</button></td></tr>');
                }
            }
        }
        $('#tableKs').DataTable({
            "searching": false,
            "lengthChange": false,
            "info": false,
            "pageLength": 7,
            language: {
                "sProcessing": "处理中...",
                "sLengthMenu": "显示 _MENU_ 项结果",
                "sZeroRecords": "没有匹配结果",
                "sInfo": "第 _START_ 至 _END_ 项，共 _TOTAL_ 项",
                "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
                "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
                "sInfoPostFix": "",
                "sSearch": "搜索:",
                "sUrl": "",
                "sEmptyTable": "表中数据为空",
                "sLoadingRecords": "载入中...",
                "sInfoThousands": ",",
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": "<",
                    "sNext": ">",
                    "sLast": "末页"
                },
                "oAria": {
                    "sSortAscending": ": 以升序排列此列",
                    "sSortDescending": ": 以降序排列此列"
                }
            }
        });
        selectFillingAll('filterType');
        $('#endDate').val(endDate);
        $('#startDate').val(startDate);
        $('#filterType').val(filterType);
    });
}

//给定inType或者outType数组,返回给定数组的数据集合,该函数集成于饼图生成函数,无需调用
function typeDataBack(typeArray){
    var dataArray=[];
    for(var x=0;x<typeArray.length;x++){
        dataArray[x] = {};
        dataArray[x].name = typeArray[x];
        var number = 0;
        for(var i=0;i<mainData.data.length;i++){
            if(mainData.data[i].type === typeArray[x]){
                number += mainData.data[i].money;
            }
        }
        dataArray[x].y = number;
    }
    return dataArray;
}

//生成数据饼图
function pieChart(id,typeArray) {
    $(id).highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title:{
            text:null
        },
        credits:{
            enabled: false
        },
        tooltip: {
            pointFormat: '占比:<b>{point.percentage:.1f}%</b><br>总额(￥):<b>{point.y}</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            type: 'pie',
            name: '收入支出占比图-分表',
            data: typeDataBack(typeArray)
        }]
      });
}

//在指定表中生成指定的类操作表
function typeTableLoading(tableId,typeArray) {
    for(var i=0;i<typeArray.length;i++){
        var rowData = {};
        rowData.type = typeArray[i];
        rowData.number = 0;
        for(var x=0 ;x<mainData.data.length;x++){
            if(mainData.data[x].type===rowData.type){
                rowData.number++;
            }
        }
        if(rowData.number==0){
            $(tableId).append('<tr><td>'+rowData.type+'</td><td>'+rowData.number+'</td><td><button class="btn btn-xs btn-danger" onclick="removeType('+'\''+rowData.type+'\''+')">删除</button></td></tr>');            
        }
        else{
            $(tableId).append('<tr><td>'+rowData.type+'</td><td>'+rowData.number+'</td><td><button class="btn btn-xs btn-danger disabled">禁止操作</button></td></tr>');            
        }
    }
}

//添加分类
function addType() {
    var mainType = $('#addSortMainType').val();
    var type = $('#addSortType').val();
    if(type == ''){
        alert('请输入类名');
        return;
    }
    for(var i=0;i<mainData.inType.length;i++){
            if(mainData.inType[i]===type){
                alert('新建类重复');
                return;
            }
    }
    for(var i=0;i<mainData.outType.length;i++){
            if(mainData.outType[i]===type){
                alert('新建类重复');
                return;
            }
    }
    if(mainType=='收入'){
        mainData.inType.push(type);
    }
    else{
        mainData.outType.push(type);
    }
    writeApi(mainData);
    $('#addSortModal').modal('hide');
    alert('添加成功');
    $('#addSortMainType').val('');
    $('#addSortType').val('');
}

function removeType( type ) {
    for(var x=0;x<mainData.inType.length;x++){
        if(mainData.inType[x]==type){
            mainData.inType.splice(x,1);
        }
    }
    for(var x=0;x<mainData.outType.length;x++){
        if(mainData.outType[x]==type){
            mainData.outType.splice(x,1);
        }
    }
    writeApi(mainData);
    ksCog();
    alert("删除成功")
} 

$(function ( ) {
    readApi();
});