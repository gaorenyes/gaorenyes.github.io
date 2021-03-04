//
// 以下部分是工具函数等与日历无直接关系，如果不需要可以删除
// 1、测试工具
// 2、说明书
//-->

function K_getJD(){
 JD.Y = Iy.value-0;
 JD.M = Im.value-0;
 JD.D = Id.value-0;
 JD.h = Ih.value-0;
 JD.m = Ii.value-0;
 JD.s = Is.value-0;
 return JD.toJD();
}

function testDD(UT){ //坐标测试
 var s="",T,T2,dt;
 T=(K_getJD()-J2000);  //力学时
 if(UT){
   T += dt_T(T)-8/24;
 }

 z=new Array(),z2=new Array(); //坐标数组

 msc.calc(T,I_dlLon.value/180*Math.PI,I_dlLat.value/180*Math.PI,0); //坐标测试
 s += msc.toHTML(1);

 //月球迭代算法测试
 L =XL.M_Lon(T/36525,-1); //正算
 T2=XL.M_Lon_t(L)*36525;  //反算
 dt=(T2-T)*86400;
 s += "<b>月球迭代算法测试:</b><br>";
 s += "高速迭代法求指定Date平分点黄经的发生时刻。测试如下：<br>";
 s += "输入时间(日数):" + T + "<br>";
 s += "月球黄经(弧度):" + L + "<br>";
 s += "反算时间(日数):" + T2 + "<br>";
 s += "迭代误差(秒):" +dt +"<br><br>";

 //地球迭代算法测试
 L=XL.E_Lon(T/36525,-1);
 T2=XL.E_Lon_t(L)*36525;
 dt=(T2-T)*86400;
 s += "<b>地球迭代算法测试:</b><br>";
 s += "输入时间(日数):"+T+"<br>";
 s += "地球黄经(弧度):"+L+"<br>";
 s += "反算时间(日数):"+T2+"<br>";
 s += "迭代误差(秒):"+dt+"<br><br>";

 L=XL.MS_aLon(T/36525,-1,60); //-1表示月球序列全部计算,60表示地球序列只算60项就可以了
 T2=XL.MS_aLon_t(L)*36525;
 dt=(T2-T)*86400;
 s += "月日黄经差返算迭代的时间误差(秒):" + dt + "<br><br>";

 out.innerHTML=s;
}


function dingQi_cmp(){ //定气误差测试
 var i,T,maxT=0;
 var y=year.value-2000;
 var N=testN.value-0;
 for(i=0;i<N;i++){
  W = (y+i/24)*2*Math.PI;
  T= XL.S_aLon_t2( W ) - XL.S_aLon_t( W ); //节气粗算与精算的差异
  T = int2( Math.abs(T*36525*86400) );
  if( T>maxT ) maxT=T;
 }
 out.innerHTML = (2000+y)+"年之后"+N+"个节气粗算与精算的最大差异:"+maxT+"秒。";
 out.innerHTML = '<font color=red>' + out.innerHTML + '</font>';
}

function dingSuo_cmp(){ //定朔测试函数
 var i,T,maxT=0;
 var y=year.value-2000;
 var N=testN.value-0;
 var n=int2(y*(365.2422/29.53058886)); //截止当年首经历朔望的个数
 for(i=0;i<N;i++){
  W = (n+i/24)*2*Math.PI;
  T= XL.MS_aLon_t2( W ) - XL.MS_aLon_t( W ); //合塑粗算与精算的差异
  T = int2( Math.abs(T*36525*86400) );
  if( T>maxT ) maxT=T;
 }
 out.innerHTML = (2000+y)+"年之后"+N+"个朔日粗算与精算的最大差异:"+maxT+"秒。";
 out.innerHTML = '<font color=red>' + out.innerHTML + '</font>';
}

function dingQi_v(){ //定气计算速度测试
 var d1=new Date(); for(i=0;i<1000;i++) XL.S_aLon_t(0);
 var d2=new Date(); for(i=0;i<1000;i++) XL.S_aLon_t2(0);
 var d3=new Date();
 out.innerHTML =  "高精度:"+(d2-d1)+"毫秒/千个<br>"
               +  "低精度:"+(d3-d2)+"毫秒/千个<br>";
 out.innerHTML = '<font color=red>' + out.innerHTML + '</font>';
}

function dingSuo_v(){ //定朔计算速度测试
 var d1=new Date(); for(i=0;i<1000;i++) XL.MS_aLon_t(0);
 var d2=new Date(); for(i=0;i<1000;i++) XL.MS_aLon_t2(0);
 var d3=new Date();
 out.innerHTML =  "高精度:"+(d2-d1)+"毫秒/千个<br>"
               +  "低精度:"+(d3-d2)+"毫秒/千个<br>";
 out.innerHTML = '<font color=red>' + out.innerHTML + '</font>';
}

function K_show(f){
 pan_1.style.display='none';
 if(f==1) pan_1.style.display='block';
 out.innerHTML='';
}