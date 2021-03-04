var lun = new Lunar(); //月历全局对象
var curJD; //现在日期
var curTZ; //当前时区

function showHXK0(){ //显示恒星库名称例表
 var i,n,c;
 for(i=0;i<HXK.length;i++){
  n = HXK[i].indexOf('#');
  addOp(document.all.Cf_xk,i,HXK[i].substr(0,n));
 }
 for(i=0;i<xz88.length;i+=5){
  addOp(document.all.Cf_xk, i+1000, xz88[i].substr(0,3));
 }
}
function showHXK(ind){ //显示恒星库
 ind -= 0;
 var bt='   RA(时分秒)   DEC(度分秒)   自行1  自行2  视差  星等  星名  星座', r='';
 if(ind<100){
  r = HXK[ind];
  var n = r.indexOf('#');
  r = r.substr(n, r.length-n); //去除第一行
 }
 else if(ind>=1000){
  r = schHXK( xz88[ind-1000].substr(3,3) );
 }
 Cf_db.innerText = bt + r.replace(/\#/g,'\r\n');
}
showHXK0();
showHXK(0);
function aCalc(){ //恒星计算
 var jd = JD.JD( year2Ayear(Cf_y.value), Cf_m.value-0, (Cf_d.value-0)+timeStr2hour(Cf_t.value)/24 ) - J2000;  //取屏幕时间
 if(Cf_ut.checked) jd += curTZ/24+dt_T(jd); //转为力学时

 var dt = Cf_dt.value-0, n = Cf_n.value-0;
 var Q  = Cf_nsn.checked ? 35 : 0;                     //小于35天的称短周期项
 var lx = Cf_lx.options[Cf_lx.selectedIndex].value-0;  //坐标类型
 var L  = Cf_J.value/180*Math.PI; //地标
 var fa = Cf_W.value/180*Math.PI;

 var i,s = '', F = getHXK(Cf_db.innerText,0);
 for(i=0; i<n; i++, jd+=dt)
   s += hxCalc(jd/36525,F,Q, lx, L,fa);
 Cf_xl.innerText = s;
}


function txFormatT(t){ //天象时间格式化输出
  var t1 = t*36525 + J2000;
  var t2 = t1  - dt_T(t1-J2000) - curTZ/24;
  return JD.JD2str(t1) +' TD '
       + JD.JD2str(t2).substr(9,11) +' UT ';
}
function tianXiang(xm,xm2){
 var jd = JD.JD( year2Ayear(Ce_y.value), Ce_m.value-0, (Ce_d.value-0) ) - J2000;  //取屏幕时间
 var n=Ce_n.value-0;
 var s='',i,re;
 jd /= 36525;

 if(xm==1||xm==2){ //求月亮近远点
  for(i=0;i<n;i++,jd=re[0]+27.555/36525){
   if(xm==1) re=XL.moonMinR(jd,1); //求近点
   if(xm==2) re=XL.moonMinR(jd,0); //求远点
   s += txFormatT(re[0]) + re[1].toFixed(2)+'千米\r\n';
  }
 }
 if(xm==3||xm==4){ //求月亮升降交点
  for(i=0;i<n;i++,jd=re[0]+27.555/36525){
   if(xm==3) re=XL.moonNode(jd,1); //求升
   if(xm==4) re=XL.moonNode(jd,0); //求降
   s += txFormatT(re[0]) + rad2str(rad2mrad(re[1]),0)+'\r\n';
  }
 }
 if(xm==5||xm==6){ //求地球近远点
  for(i=0;i<n;i++,jd=re[0]+365.259636/36525){
   if(xm==5) re=XL.earthMinR(jd,1); //求近点
   if(xm==6) re=XL.earthMinR(jd,0); //求远点
   s += txFormatT(re[0]) + re[1].toFixed(8)+' AU\r\n';
  }
 }
 if(xm==7||xm==8){ //大距计算
  for(i=0;i<n;i++,jd=re[0]+115.8774777586/36525){
   if(xm==7) re=daJu(1,jd,1); //求水星东大距
   if(xm==8) re=daJu(1,jd,0); //求水星东西距
   s += txFormatT(re[0]) + (re[1]/Math.PI*180).toFixed(5)+'度\r\n';
  }
 }
 if(xm==9||xm==10){ //大距计算
  for(i=0;i<n;i++,jd=re[0]+583.9213708245/36525){
   if(xm==9) re=daJu(2,jd,1); //求水星东大距
   if(xm==10)re=daJu(2,jd,0); //求水星东西距
   s += txFormatT(re[0]) + (re[1]/Math.PI*180).toFixed(5)+'度\r\n';
  }
 }
 if(xm==11){ //合月计算
  s = '合月时间(TD UT) 星月赤纬差(小于1度可能月掩星,由视差决定)\r\n';
  for(i=0;i<n;i++,jd=re[0]+28/36525){
   re = xingHY(xm2,jd);
   s += txFormatT(re[0]) + (-re[1]/Math.PI*180).toFixed(5)+'度\r\n';
  }
 }

 if(xm==12||xm==13){
  if(xm==12) s = xxName[xm2]+'合日(地内行星上合)\r\n';
  if(xm==13) s = xxName[xm2]+'冲日(地内行星下合)\r\n';
  s +='黄经合/冲日时间(TD UT) 星日赤纬差\r\n';
  for(i=0;i<n;i++,jd=re[0]+cs_xxHH[xm2-1]/36525){
   if(xm==12) re = xingHR(xm2,jd,0);
   if(xm==13) re = xingHR(xm2,jd,1);
   s += txFormatT(re[0]) + (-re[1]/Math.PI*180).toFixed(5)+'度\r\n';
  }
 }
 if(xm==14||xm==15){ //顺留
  if(xm==14) s = xxName[xm2]+'顺留\r\n';
  if(xm==15) s = xxName[xm2]+'逆留\r\n';
  s +='留时间(TD UT)\r\n';
  for(i=0;i<n;i++,jd=re+cs_xxHH[xm2-1]/36525){
   if(xm==14) re = xingLiu(xm2,jd,1);
   if(xm==15) re = xingLiu(xm2,jd,0);
   s += txFormatT(re)+'\r\n';
  }
 }
 Ce_tab.innerText=s;
}

function pCalc(xm){ //行星星历计算
 var jd = JD.JD( year2Ayear(Cd_y.value), Cd_m.value-0, (Cd_d.value-0)+timeStr2hour(Cd_t.value)/24 ) - J2000;  //取屏幕时间
 if(Cd_ut.checked) jd += curTZ/24+dt_T(jd); //转为力学时
 var xt = Cd_xt.options[Cd_xt.selectedIndex].value;
 var dt = Cd_dt.value-0, n = Cd_n.value-0;
 var L  = Cd_J.value/180*Math.PI; //地标
 var fa = Cd_W.value/180*Math.PI;
 if(n>1000) {alert("个数太多了"); return;}
 var s='',i;
 //求星历
 for(i=0;i<n;i++,jd+=dt){
   var jd2=jd+2451545;
   s += JD.JD2str(jd2)+'TD, JED = '+jd2.toFixed(7)+' '+'\r\n';
   s += xingX(xt,jd,L,fa)+'\r\n';
 }
 Cd_tab.innerText=s;
}

//=============日月食图表===========
function zb_calc(){ //即时坐标计算
  if(Cal_pause.checked) return;

  var now = new Date();
  var jd = now/86400000-10957.5; //J2000起算的儒略日数
  jd += dt_T(jd);
  msc.calc(jd, Cb_J.value/radd, Cb_W.value/radd,0); //传入力学时间(J2000.0起算)
  Cal_zb.innerHTML = msc.toHTML(0);
}

function zxsCopy(J,W){ //复制某时刻中心食地标，并计算该处日食
  Cb_J.value=J;
  Cb_W.value=W;
  tu_calc(2);
}
function tu_calc(ly){ //ly是取时间的方式,xm是计算的项目
 tu1.init(Can1); //画布初始化
 var jd; //J2000起算的儒略日数(当地时间)
 var vJ = Cb_J.value/radd;
 var vW = Cb_W.value/radd;
 //取时间
 jd = JD.JD( year2Ayear(Cb_y.value), Cb_m.value-0, (Cb_d.value-0)+timeStr2hour(Cb_t.value)/24 ) - J2000;  //取屏幕时间
 if(ly==0) jd = (new Date())/86400000-10957.5-curTZ/24, Cb_ut.checked=true; //取现在时间(UTC)
 if(ly==1) jd -= Cb_step.value/86400;
 if(ly==2); //常规取时间
 if(ly==3) jd += Cb_step.value/86400;

 if(ly==4) jd -=29.53;
 if(ly==5) ;
 if(ly==6) jd +=29.53;
 if(ly==7) jd -=29.53;
 if(ly==8) ;
 if(ly==9) jd +=29.53;

 if(ly==4||ly==5||ly==6) jd = XL.MS_aLon_t2( Math.floor((jd+8)/29.5306)*pi2 )*36525;
 if(ly==7||ly==8||ly==9) jd = XL.MS_aLon_t2( Math.floor((jd-4)/29.5306)*pi2+Math.PI )*36525;
 if(ly>=4&&ly<=9){
   if(Cb_ut.checked) jd -= curTZ/24+dt_T(jd);
 }

 //置时间
 var ts=JD.JD2str(jd+J2000);
 Cb_y.value = ts.substr(0,5)-0;
 Cb_m.value = ts.substr(6,2);
 Cb_d.value = ts.substr(9,2);
 Cb_t.value = ts.substr(12,8);

 if(Cb_ut.checked) jd += curTZ/24+dt_T(jd); //转为力学时
 var i;


 var sn = int2( (jd-6)/29.53058885*2+0.5 ) + 100000000; //半月积数,用作月食标签
 var sn2 = sn+' '+vJ+' '+vW+Cb_nasa.checked+Cb_ut.checked; //某地日食标签

 msc.calc(jd,vJ,vW,Cb_high.value-0);
 Cal_zb.innerHTML=msc.toHTML(1); //显示坐标

 if(Cb_sjzb.checked){
  tu1.move4(tu1.sun, msc.sCJ,msc.sCW, msc.gst);
  tu1.move4(tu1.moon,msc.mCJ,msc.mCW, msc.gst);
 }else{
  tu1.move(tu1.sun, msc.sPJ,msc.sPW, Cb_bei.checked);
  tu1.move(tu1.moon,msc.mPJ,msc.mPW, Cb_bei.checked);
 }

 var msHJ = rad2mrad(msc.mHJ-msc.sHJ);
 var s='',J1,W1,J2,W2,  sr,mr,er,Er,d0,d1,d2;

 if(msHJ<3/radd || msHJ>357/radd){ //日食图表放大计算
  J1=msc.mCJ2,W1=msc.mCW2, J2=msc.sCJ2, W2=msc.sCW2;  //用未做大气折射的来计算日食
  sr=msc.sRad, mr=msc.mRad;
  d1=j1_j2(J1,W1,J2,W2)*rad,d0=mr+sr;
  tu1.move2a(J1,W1,J2,W2,mr,sr);
  tu1.move3(msc.zx_J,msc.zx_W,Cb_phSave.checked);
  s2 = '此刻月亮本影中心线不经过地球。';
  if(msc.zx_W!=100){
    var zxsJ=(msc.zx_J/Math.PI*180).toFixed(5);
    var zxsW=(msc.zx_W/Math.PI*180).toFixed(5);
    s2 = '食中心地标：经 '+ zxsJ  +' 纬 '+ zxsW
       +' <a href="javascript:zxsCopy('+zxsJ+','+zxsW+')">此地</a>';
  }

  s = '日月站心视半径 '+m2fm(sr,2,0)+'及'+m2fm(mr,2,0)+' <font color=red>'+s2+'</font><br>'
    + '日月中心视距 '+m2fm( d1,2,0 ) +' 日月半径和 '+m2fm(d0,2,0) + ' 半径差 ' + m2fm(sr-mr,2,0) +' 距外切 '+m2fm(d1-d0,2,0);
  Cb_zb.innerHTML = s;

  //显示南北界数据
  rsPL.nasa_r=0; if(Cb_nasa.checked) rsPL.nasa_r=1; //视径选择
  s=JD.JD2str(jd+J2000)+' TD<br>南北界点：经度　　　　纬度<br>',mc=new Array('食中心点','本影北界','本影南界','半影北界','半影南界');
  rsPL.nbj(jd);
  for(i=0;i<5;i++){
    s += mc[i]+'：';
    if(rsPL.V[i*2+1]==100) { s += '无　　　　　无<br>'; continue; }
    s += (rsPL.V[i*2]*radd).toFixed(5)+'　'+(rsPL.V[i*2+1]*radd).toFixed(5)+'<br>';
  }
  s += '中心类型：'+rsPL.Vc+'食<br>';
  s += '本影南北界距约'+rsPL.Vb;
  Cb_b1.innerHTML = s;

  //显示食甚等时间
  if(Cb_b2.sn&&Cb_b2.sn==sn2) return;//日食甚计算等已计算

  rsPL.nasa_r=0; if(Cb_nasa.checked) rsPL.nasa_r=1; //视径选择
  var td=' TD',mc=new Array('初亏','食甚','复圆','食既','生光');
  rsPL.secMax(jd, vJ,vW, Cb_high.value-0);
  if(rsPL.LX=='环') mc[3]='环食始',mc[4]='环食终'; //环食没有食既和生光
  var s='时间表 (日'+rsPL.LX+'食)<br>'
  for(i=0;i<5;i++){
   jd=rsPL.sT[i]; if(!jd) continue;
   if(Cb_ut.checked) jd -= curTZ/24+dt_T(jd),td=' UTC'; //转为UTC(本地时间)
   s+=mc[i]+':'+JD.JD2str(jd+J2000)+td+'<br>';
  }
  s+='时长: '+m2fm(rsPL.dur*86400,1,1)+'<br>';
  s+='食分: '+rsPL.sf.toFixed(5)+'<br>';
  s+='月日视径比: '+rsPL.b1.toFixed(5)+'(全或环食分)<br>';
  s+='是否NASA径比(1是,0否): '+rsPL.nasa_r+'<br>';
  s+='食分指日面直径被遮比例';
  Cb_b2.innerHTML = s;
  Cb_b2.sn = sn2;
  return;
 }
 if(msHJ>170/radd && msHJ<190/radd){ //月食图表放大计算
  J1=msc.mCJ,W1=msc.mCW, J2=msc.sCJ+Math.PI, W2=-msc.sCW;
  er=msc.eShadow, Er=msc.eShadow2, mr=msc.e_mRad; //用未做大气折射的来计算日食
  d1=j1_j2(J1,W1,J2,W2)*rad, d0=mr+er,d2=mr+Er;
  tu1.move2b(J1,W1,J2,W2, mr,er,Er);
  s= '本影半径 '+m2fm(er,2,0)+' 半影半径 '+m2fm(Er,2,0)+' 月亮地心视半径 '+m2fm(mr,2,0)+'<br>'
    + '影月中心距 '+m2fm( d1,2,0 ) +' 影月半径和 '+m2fm(d0,2,0) +' 距相切 <font color=red>'+m2fm(d1-d0,2,0) +'</font> 距第二相切 '+m2fm(d1-d2,2,0) ;
  Cb_zb.innerHTML = s;

  if(Cb_b2.sn&&Cb_b2.sn==sn) return; //已经显示月食甚计算等结果
  var td=' TD',mc=new Array('初亏','食甚','复圆','半影食始','半影食终','食既','生光');
  ysPL.lecMax(jd);
  var s='时间表(月'+ysPL.LX+'食)<br>';
  for(i=0;i<7;i++){
   jd=ysPL.lT[i]; if(!jd) continue;
   if(Cb_ut.checked) jd -= curTZ/24+dt_T(jd),td=' UTC'; //转为UTC(本地时间)
   s+=mc[i]+':'+JD.JD2str(jd+J2000)+td+'<br>';
  }
  s+='食分:'+ysPL.sf.toFixed(5)+'<br>';
  s+='食分指月面直径被遮比例';
  Cb_b2.innerHTML = s;
  Cb_b1.innerHTML = '';
  Cb_b2.sn = sn;
  return;
 }
 tu1.ecShow(0,0,0,0);
 Cb_zb.innerHTML = Cb_b1.innerHTML = Cb_b2.innerHTML = '';
 Cb_b2.sn = 0;

}
function tu_cls_path(){
  tu1.init(Can1);
  tu1.mark.p_cls();
  tu1.mark.p_save();
}

//==================日食概略图=================
function tu2_jxb(){ //显示界线表
 var jd = Cp10_jd.value-J2000; //取屏幕时间
 jd = XL.MS_aLon_t2( int2((jd+8)/29.5306)*Math.PI*2 )*36525; //归朔
 rsGS.init(jd,7);
 Cp10_tz.innerHTML=rsGS.jieX3(jd);
}

function tu2_xx(jd){ //转到详细日食图表页面
 //置时间
 var ts=JD.JD2str(jd+J2000);
 Cb_y.value = ts.substr(0,5)-0;
 Cb_m.value = ts.substr(6,2);
 Cb_d.value = ts.substr(9,2);
 Cb_t.value = ts.substr(12,8);
 Cb_ut.checked = false;
 showPage(3);
}
function tuGL_search(fs){ //查找日食
  var i,k,r,s='',s2='', n=Cp10_an.value-0;
  var jd = JD.JD( year2Ayear(Cp10_y.value), Cp10_m.value-0, 0) - J2000;  //取屏幕时间
  jd = XL.MS_aLon_t2( int2((jd+8)/29.5306)*Math.PI*2 )*36525; //定朔
  for(i=0,k=0;i<n;i++){
   r=ecFast(jd); //低精度高速搜索
   if(r.lx=='NN') { jd += 29.5306; continue; } //排除不可能的情况，加速计算
   if(!r.ac){
     if(fs==0) rsGS.init(jd, 2); //低精度
     if(fs==1) rsGS.init(jd, 7); //高精度
     r = rsGS.feature(jd);
   }
   if(r.lx!='N'){
    s += '<a href="javascript:tu2_calc(1,'+r.jd+');">'+JD.JD2str(r.jd+J2000).substr(0,11)+'</a>';
    s += r.lx;
    k++;
    if(k%10==0) s+='<br>';
    if(k%100==0) s2+=s, s='';
   }
   jd = r.jd+29.5306;
  }
  Cp10_b1.innerHTML = s2+s;
}

var tu3_buff=0;
function tu2_calc(fs,jd0){
 tu2.init(Can2);
 if(fs==0) return;

 var step = Cp10_step.value-0;
 var jd = Cp10_jd.value-J2000; //取屏幕时间
 if(fs==1) jd = jd0;
 if(fs==2) ; //保持时间不变
 if(fs==3) jd -= step;
 if(fs==4) jd += step;
 jd = XL.MS_aLon_t2( int2((jd+8)/29.5306)*Math.PI*2 )*36525; //归朔
 Cp10_jd.value = Cp10_jd2.value = (jd+J2000).toFixed(6);    //保存在屏幕上
 Cp10_jdstr.innerHTML=JD.JD2str(jd+J2000); //显示时间串


 //计算单个日食
 if(fs==1||fs==2||fs==3||fs==4){

  rsGS.init(jd,7);
  var r = rsGS.feature(jd); //特征计算
  var lxb={T:'全食',A:'环食',P:'偏食',T0:'无中心全食',T1:'部分本影有中心全食',A0:'无中心环食',A1:'部分伪本影有中心全食',H:'全环全',H2:'全全环',H3:'环全全'};
  if(r.lx=='N') Cp10_tz.innerHTML='无日食';
  else Cp10_tz.innerHTML = '<table><tr>'
   + '<td class=dRB><b>本次日食概述(力学时)</b><br>'

   + '偏食始：'+JD.JD2str(r.gk3[2]+J2000)+' '+rad2str2(r.gk3[0])+','+rad2str2(r.gk3[1])+'<br>'
   + '中心始：'+JD.JD2str(r.gk1[2]+J2000)+' '+rad2str2(r.gk1[0])+','+rad2str2(r.gk1[1])+'<br>'
   + (r.gk5[1]!=100 ?
     '视午食：'+JD.JD2str(r.gk5[2]+J2000)+' '+rad2str2(r.gk5[0])+','+rad2str2(r.gk5[1])+'<br>' : '')
   + '中心终：'+JD.JD2str(r.gk2[2]+J2000)+' '+rad2str2(r.gk2[0])+','+rad2str2(r.gk2[1])+'<br>'
   + '偏食终：'+JD.JD2str(r.gk4[2]+J2000)+' '+rad2str2(r.gk4[0])+','+rad2str2(r.gk4[1])+'</td>'

   + '<td class=dRB><b>中心点特征</b><br>'
   + '影轴地心距 γ = '+r.D.toFixed(4)+'<br>'
   + '中心地标 (经,纬) = ' + (r.zxJ*radd).toFixed(2)    + ',' + (r.zxW*radd).toFixed(2)    + '<br>'
   + '中心时刻 tm = '+JD.JD2str(r.jd+J2000)+'<br>'
   + '太阳方位 (经,纬) = ' + (r.Sdp[0]*radd).toFixed(0) + ',' + (r.Sdp[1]*radd).toFixed(0) + '<br>'
   + '日食类型 LX = '+r.lx+' '+lxb[r.lx]+'<br>'
   + '食分='+r.sf.toFixed(4)+', 食延='+m2fm(r.tt*86400,0,2)+', 食带='+r.dw.toFixed(0)+'km<br>'
   + '</td>'
   + '</tr></table>';

  if(Cp10_showJX.checked){
    Can2.style.display='none';
    Can3.style.display='block';
    tu3.init(Can3);
    tu3_buff=rsGS.jieX(jd); //取界线
    var J0=(tu3_buff.zxJ*radd).toFixed(0);
    var W0=(tu3_buff.zxW*radd).toFixed(0);
    Cp10_J0.value = J0;
    Cp10_W0.value = W0;
    var jb=[Cp10_x0.value/10, Cp10_y0.value/10, Cp10_dx.value/10, Cp10_dy.value/10];
    tu3.draw(tu3_buff, J0/radd, W0/radd, Cp10_eR.value-0, jb, Cp10_tylx.options.selectedIndex);
  }else{
    Can2.style.display='block';
    //Can3.style.display='none';
    tu2.line1(r,Cp10_hc.checked);
  }
  return;
 }

 //计算多个日食
 if(fs==5){
  Can2.style.display='block';
  Can3.style.display='none';
  var i,r, bn = Cp10_bn.value-0; //并设置为多步
  var s = '<table border="0" width="100%" cellpadding="0" cellspacing="0">'
        + '<tr align=center bgcolor="#EEFFEE"><td>力学时</td><td>γ</td><td>型</td><td>中心地标</td><td>方位角</td><td>食分</td><td>食带</td><td>食延</td><td>详表</td></tr>';
  for(i=0;i<bn;i++,jd+=step){
   rsGS.init(jd,3);  //中精度计算
   r = rsGS.feature(jd);
   if(r.lx=='N') continue;
   s += '<tr align=center><td>'
     + JD.JD2str(r.jd+J2000) + '</td><td>' + r.D.toFixed(4) + '</td><td>' + r.lx + '</td><td>'
     + (r.zxJ*radd).toFixed(2)    + ',' + (r.zxW*radd).toFixed(2)    + '</td><td>'
     + (r.Sdp[0]*radd).toFixed(0) + ',' + (r.Sdp[1]*radd).toFixed(0) + '</td><td>'
     + r.sf.toFixed(4) + '</td><td>' + r.dw.toFixed(0) + '</td><td>' + m2fm(r.tt*86400,0,2) + '</td><td>'
     + '<a href="javascript:tu2_xx('+r.jd+');">详细</a>'+ '</td><td>'
     + '</td></tr>';
   tu2.line1(r,Cp10_hc.checked);
  }
  s += '</table>';
  Cp10_tz.innerHTML = s;
 }

}

function tu3_xz(xm){ //旋转图3
 if(!tu3_buff) { alert('请把“食界”钩上并计算'); return; }
 tu3.init(Can3);
 var J0=Cp10_J0.value-0, W0=Cp10_W0.value-0;
 if(xm==0) J0 += 15;
 if(xm==1) J0 -= 15;
 if(xm==2) W0 += 15;
 if(xm==3) W0 -= 15;
 if(xm==4); //保持不变
 Cp10_J0.value = J0, Cp10_W0.value = W0;
 var jb=[Cp10_x0.value/10, Cp10_y0.value/10, Cp10_dx.value/10, Cp10_dy.value/10];
 tu3.draw(tu3_buff, J0/radd, W0/radd, Cp10_eR.value-0, jb, Cp10_tylx.options.selectedIndex);
}

function tu3_yingzi(xm){ //显示影子
 var jd = Cp10_jd2.value-J2000; //取屏幕时间
 if(xm==1) jd -= Cp10_step2.value/86400;
 if(xm==2) jd += Cp10_step2.value/86400;
 Cp10_jd2.value = (jd+J2000).toFixed(4);

 rsGS.init(jd,7);
 var r=rsGS.jieX2(jd);
 tu3.draw2(r);
}

function dfRS(ly){ //地方日食表生成
 var jd = JD.JD( year2Ayear(Cc_y.value), Cc_m.value-0, (Cc_d.value-0) ) - J2000;  //取屏幕时间
 if(ly==1) jd -=29.53;
 if(ly==2) jd +=29.53;
 jd = XL.MS_aLon_t2( Math.floor((jd+8)/29.5306)*pi2 )*36525;

 //置时间
 var ts=JD.JD2str(jd+J2000-curTZ/24-dt_T(jd));
 Cc_y.value = ts.substr(0,5)-0;
 Cc_m.value = ts.substr(6,2);
 Cc_d.value = ts.substr(9,2);

 rsPL.nasa_r=0; if(Cc_nasa.checked) rsPL.nasa_r=1; //视径选择
 var i,j,t,c, ou='地名	食分	初亏	食甚	复圆	食既	生光	日出	日落	P1,V1	P2,V2\r\n', s=Cc_db.innerText;
 s=s.replace(/\r\n/g,'#'); s=s.replace(/ /g,''); s=s.split('#');
 for(i=0;i<s.length;i++){
  c=s[i];         if(c.length==0||c.substr(0,1)=='*') continue;
  c=c.split(','); if(c.length<=3) continue;
  c[2]/=radd, c[1]/=radd; //经纬度
  rsPL.secMax(jd,c[2],c[1],c[3]/1000); //日食计算
  ou += c[0]+'['+rsPL.LX+']';
  ou += '	'+rsPL.sf.toFixed(5); //食分
  for(j=0;j<5;j++){
   t  = rsPL.sT[j]; if(!t) {ou+='	--:--:--'; continue;}
   t = t -curTZ/24 -dt_T(t) +J2000; //转为UTC(本地时间)
   ou+='	'+JD.JD2str(t).substr(12,8);
  }
  if(rsPL.sf){
   ou += '	'+JD.timeStr(rsPL.sun_s -curTZ/24+J2000);
   ou += '	'+JD.timeStr(rsPL.sun_j -curTZ/24+J2000);
   ou += '	'+(rsPL.P1*radd).toFixed(0)+','+(rsPL.V1*radd).toFixed(0);
   ou += '	'+(rsPL.P2*radd).toFixed(0)+','+(rsPL.V2*radd).toFixed(0);
  }
  ou += '\r\n';
 }
 Cc_tb.innerText=ou;
}

//====================升降表===================
function shengjiang(){
  SZJ.L  = Cp9_J.value/radd; //设置站点参数
  SZJ.fa = Cp9_W.value/radd;
  var jd = JD.JD( year2Ayear(Cp9_y.value), Cp9_m.value-0, (Cp9_d.value-0)+0.5 ) - J2000;  //取屏幕时间
  var sq = SZJ.L/pi2*24;

  var s="<font color=red>北京时间(转为格林尼治时间请减8小时)：</font><br>", r, c=J2000+8/24;

  r=SZJ.St(jd-sq/24);
  s +="太阳升起 " + JD.JD2str(r.s+c) + " 太阳降落 " + JD.JD2str(r.j+c)+"<br>";
  s +="日上中天 " + JD.JD2str(r.z+c) + " 日下中天 " + JD.JD2str(r.x+c)+"<br>";
  s +="民用天亮 " + JD.JD2str(r.c+c) + " 民用天黑 " + JD.JD2str(r.h+c)+"<br>";
  s +="航海天亮 " + JD.JD2str(r.c2+c)+ " 航海天黑 " + JD.JD2str(r.h2+c)+"<br>";
  s +="天文天亮 " + JD.JD2str(r.c3+c)+ " 天文天黑 " + JD.JD2str(r.h3+c)+"<br>";
  s +="日照长度 " + JD.timeStr(r.j-r.s-0.5) + " 日光长度 " + JD.timeStr(r.h-r.c-0.5) + "<br>";
  if(r.sm) s += '注：'+r.sm+'<br>';
  r=SZJ.Mt(jd-sq/24);
  s +="月亮升起 " + JD.JD2str(r.s+c) + " 月亮降落 " + JD.JD2str(r.j+c)+"<br>";
  s +="月上中天 " + JD.JD2str(r.z+c) + " 月下中天 " + JD.JD2str(r.x+c)+"<br>";
  Cp9_out.innerHTML=s;
}
function shengjiang2(){ //太阳升降快算
  var L  = Cp9_J.value/radd; //设置站点参数
  var fa = Cp9_W.value/radd;
  var jd = JD.JD( year2Ayear(Cp9_y.value), 1, 1.5 ) - J2000;  //取屏幕时间
  var i,t, s='',s2='';
  for(i=0;i<368;i++){
    t=sunShengJ(jd+i,L,fa,-1)+J2000+8/24; s2+='<font color=red>'+JD.JD2str(t).substr(6,14)+'</font>，';
    t=sunShengJ(jd+i,L,fa, 1)+J2000+8/24; s2+=JD.timeStr(t)+'<br>';
    if(i== 91||i==275) s+='<td>'+s2+'<td>', s2='';
    if(i==183||i==367) s+='<td>'+s2+'<td>', s2='';
  }
  Cp9_out.innerHTML='<center><b>太阳年度升降表</b><table><tr>'+s+s2+'</tr></table></center>';
}
function shengjiang3(){ //年度时差
  var jd = JD.JD( year2Ayear(Cp9_y.value), 1, 1.5 );  //取屏幕时间
  var i,t,D, s='',s2='';
  for(i=0;i<368;i++){
    D=jd+i-8/24-J2000, D+=dt_T(D);
    t=pty_zty(D/36525); s2+=JD.JD2str(jd+i).substr(0,11)+' <font color=red>'+m2fm(t*86400,2,2)+'</font><br>';
    if(i== 91||i==275) s+='<td>'+s2+'<td>', s2='';
    if(i==183||i==367) s+='<td>'+s2+'<td>', s2='';
  }
  Cp9_out.innerHTML='<center><b>太阳时差表(所用时间为北京时间每日12点)<br</b><table><tr>'+s+s2+'</tr></table></center>';
}

//====================气朔表===================
function suoCalc(jiao){ //定朔测试函数
 if(jiao==-1) jiao=prompt("请输入角度(0朔,90上弦,180望,270下弦,或其它):",0)-0;
 var i,r,T,s = "月-日黄经差"+jiao+"<br>", s2="";
 var y = year2Ayear(Cp8_y.value)-2000;
 var n = Cp8_n.value-0;
 var n0 = int2(y*(365.2422/29.53058886)); //截止当年首经历朔望的个数
 for(i=0;i<n;i++){
  T = XL.MS_aLon_t( (n0+i+jiao/360)*2*Math.PI );  //精确时间计算,入口参数是当年各朔望黄经
  r = XL1_calc(2,T,-1); //计算月亮
  s2 += JD.JD2str( T*36525+J2000+8/24-dt_T(T*36525) )+' '+r.toFixed(2)+"千米<br>";   //日期转为字串
  if(i%50==0) s+=s2,s2="";
 }
 Cp8_out.innerHTML=s+s2;
}
function qiCalc(){ //定气测试函数
 var i,T,s="",s2="";
 var y=year2Ayear(Cp8_y.value)-2000;
 var n=Cp8_n.value-0;
 for(i=0;i<n;i++){
  T = XL.S_aLon_t( (y+i*15/360+1)*2*Math.PI );    //精确节气时间计算
  s2+=JD.JD2str( T*36525+J2000+8/24-dt_T(T*36525) )+obb.jqmc[(i+6)%24];  //日期转为字串
  if(i%2==1) s2+=' 视黄经'+(i*15)+'<br>'; else s2+='　'
  if(i%50==0) s+=s2,s2="";
 }
 Cp8_out.innerHTML=s+s2;
}

function houCalc(){ //定候测试函数
 var i, T, s='初候　　　　　　　　　　　　二候　　　　　　　　　三候', s2='';
 var y=year2Ayear(Cp8_y.value)-2000;
 var n=Cp8_n.value-0;
 for(i=0;i<n*3;i++){
  T = XL.S_aLon_t( (y+i*5/360+1)*2*Math.PI );    //精确节气时间计算
  if(i%3==0) s2+='<br>'+obb.jqmc[(i/3+6)%24]; else s2+='　';
  s2+=JD.JD2str( T*36525+J2000+8/24-dt_T(T*36525) );  //日期转为字串
  if(i%50==0) s+=s2,s2="";
 }
 Cp8_out.innerHTML=s+s2;
}


//==========================
//页面生成有关的函数
//==========================
function showPage(pg){
  showHelp(0); //关闭可能已打开的帮助页面
  Cal_pause.checked=true;
  page1.style.display='none';
  page2.style.display='none';
  page3.style.display='none';
  page4.style.display='none';
  page5.style.display='none';
  page6.style.display='none';
  page7.style.display='none';
  page8.style.display='none';
  page9.style.display='none';
  page10.style.display='none';
  page11.style.display='none';
  page12.style.display='none';
  page13.style.display='none';
  if(pg==1) page1.style.display='block';
  if(pg==2){page2.style.display='block'; getNianLi(0);} //年历
  if(pg==3){page3.style.display='block'; tu_calc(2);} //图表
  if(pg==4) page4.style.display='block'; //地方日食
  if(pg==5) page5.style.display='block'; //行星星历
  if(pg==6) page6.style.display='block'; //行星天象
  if(pg==7) page7.style.display='block'; //恒星星历
  if(pg==8) page8.style.display='block'; //气朔表
  if(pg==9) page9.style.display='block'; //升降表
  if(pg==10) page10.style.display='block'; //食概
  if(pg==11) page11.style.display='block'; //命理八字
  if(pg==12) page12.style.display='block'; //工具
  if(pg==13) page13.style.display='block'; //常数表
}

/********************
当前时间初始化,在屏幕上显示时间、保存本地时区信息等
*********************/
function set_date_screen(fw){ //把当前时间置于屏幕的便入框之中
 var now=new Date();
 curTZ = now.getTimezoneOffset()/60; //时区 -8为北京时
 curJD = now/86400000-10957.5 - curTZ/24; //J2000起算的儒略日数(当前本地时间)
 JD.setFromJD(curJD+J2000);

 if(!fw||fw==1){
  Cml_y.value = JD.Y;
  Cml_m.value = JD.M;
  Cml_d.value = JD.D;
  Cml_his.value = JD.h+':'+JD.m+':'+JD.s.toFixed(0);
 }

 if(!fw||fw==2){
  Cal_y.value = JD.Y;
  Cal_m.value = JD.M;
 }
 curJD=int2(curJD+0.5);
}
set_date_screen(0);

/****************
外地时间选择
****************/
function change_dq(){ //国家或地区改变
  var i,v = Sel_dq.options[Sel_dq.selectedIndex].value;
  v = v.split('#');
  Sel_dq.v = v[0]; //地区时差
  Sel_dq.rg= v[1]; //日光节约参数
  Sel_sqsm.innerHTML=v[2];  //时区说明
}

function change_zhou(){ //洲别改变
  var i, ob = SQv[ Sel_zhou.options[Sel_zhou.selectedIndex].value-0 ]; //某洲数组
  Sel_dq.length=0;
  for(i=1; i<ob.length; i+=2) addOp(Sel_dq,ob[i+1],ob[i]);
  change_dq();
}

for(i=0;i<SQv.length;i++) addOp(document.all.Sel_zhou,i,SQv[i][0]);
change_zhou();



function show_clock(t){ //显示时钟,传入日期对象
  var h  = Sel_dq.v-0, rg='';
  var v  = Sel_dq.rg;
  var jd = t/86400000-10957.5 + h/24; //J2000起算的儒略日数(当地时间)

  Clock1.innerHTML = t.toLocaleString();

  if(v){
   var y1 = JD.Y, y2=y1; //该时所在年份
   var m1 = v.substr(0,2)-0, m2 = v.substr(5,2)-0;
   if(m2<m1) y2++;
   //nnweek(y,m,n,w)求y年m月第n个星期w的jd
   var J1 = JD.nnweek( y1, m1, v.substr(2,1), v.substr(3,1)-0  )-0.5-J2000 +(v.charCodeAt(4)-97)/24;
   var J2 = JD.nnweek( y2, m2, v.substr(7,1), v.substr(8,1)-0  )-0.5-J2000 +(v.charCodeAt(9)-97)/24;
   if(jd>=J1 && jd<J2) jd+=1/24, rg='<font color=red>¤</font>';  //夏令时
  }
  JD.setFromJD(jd+J2000);
  var mm=JD.m<10? '0'+JD.m:JD.m;
  var ss=int2(JD.s)<10? '0'+int2(JD.s):int2(JD.s);
  document.all.Clock2.innerHTML =h+'时区　　'+JD.D+'日 ' + rg+JD.h+':'+mm+':'+ss; //为了与clock1同步,秒数取整而不四舍五入

}

/****************
地理经纬度选择的页面控制函数
****************/
function change2(){
  var i,v = new JWdecode( Sel2.options[Sel2.selectedIndex].value );
  Sel2.vJ = v.J; Sel2.vW = v.W;
  Cb_J.value=(v.J/Math.PI*180).toFixed(6), Cb_W.value=(v.W/Math.PI*180).toFixed(6);
  Cf_J.value = Cd_J.value = Cp9_J.value = Cb_J.value;
  Cf_W.value = Cd_W.value = Cp9_W.value = Cb_W.value;
  Cp11_J.value = Cb_J.value
  Cal_zdzb.innerHTML = '经 '+rad2str2(v.J) + ' 纬 '+rad2str2(v.W);
  showMessD(-2);
  setCookie('Sel1',Sel1.selectedIndex);
  setCookie('Sel2',Sel2.selectedIndex);
}
function change(){
  Sel2.length=0; 
  var i, ob=JWv[ Sel1.options[Sel1.selectedIndex].value-0 ];
  for(i=1; i<ob.length; i++)
   addOp( Sel2, ob[i].substr(0,4), ob[i].substr(4,ob[i].length-4) );
  change2();
}
var i;
for(i=0;i<JWv.length;i++) addOp(document.all.Sel1,i,JWv[i][0]);

var seI1=getCookie('Sel1');
var seI2=getCookie('Sel2');
Sel1.selectedIndex = seI1; change();
Sel2.selectedIndex = seI2; change2();


/**********************
命理八字计算
**********************/
function ML_calc(){
 var ob=new Object();
 var t = timeStr2hour(Cml_his.value);
 var jd=JD.JD(year2Ayear(Cml_y.value), Cml_m.value-0, Cml_d.value-0+t/24)

 obb.mingLiBaZi( jd+curTZ/24-J2000, Cp11_J.value/radd, ob ); //八字计算
 Cal6.innerHTML =
     '<font color=red>  <b>[日标]：</b></font>'+'公历 '+Cml_y.value+'-'+Cml_m.value+'-'+Cml_d.value + ' 儒略日数 ' + int2(jd+0.5) + ' 距2000年首' + int2(jd+0.5-J2000) + '日<br>'
   + '<font color=red  ><b>[八字]：</b></font>'    + ob.bz_jn+'年 '+ob.bz_jy+'月 '+ob.bz_jr+'日 '+ob.bz_js+'时 真太阳 <font color=red>' + ob.bz_zty+ '</font><br>'
   + '<font color=red  ><b>[纳音]：</b></font>'    + ob.bz_jnny+' '+ob.bz_jyny+' '+ob.bz_jrny+' '+ob.bz_jsny+'<br>'
   + '<font color=green><b>[纪时]：</b></font><i>' + ob.bz_JS + '</i><br>'
   + '<font color=green><b>[时标]：</b></font><i>' + '23　 01　 03　 05　 07　 09　 11　 13　 15　 17　 19　 21　 23';
}
//ML_calc(); //在时间、地标初始化完成后就可执行

function ML_settime(){ set_date_screen(1); ML_calc(); }

/**********************
月历的年、月跳转控制函数
**********************/

function changeYear(ud){ //跳到上(或下)一年
 var y = year2Ayear(Cal_y.value);
 if(y==-10000) return;
 if(ud==0){
   if(y<=-10000) { alert('到顶了！'); return; }
   Cal_y.value = Ayear2year(y-1);
 }else{
   if(y>=9999) { alert('到顶了！'); return; }
   Cal_y.value = Ayear2year(y+1);
 }
 getLunar();
}
function changeMonth(ud){ //跳到上(或下)下月
 var y,m;
 y = year2Ayear(Cal_y.value);
 m = Cal_m.value-0;
 if(ud==0){
   if(m<=1 && y<=-10000) { alert('到顶了！'); return; }
   if(m<=1) Cal_m.value = 12, Cal_y.value = Ayear2year(y-1);
   else     Cal_m.value = m-1;
 }
 if(ud==1){
   if(m>=12 && y>=9999) { alert('到顶了！'); return; }
   if(m>=12) Cal_m.value = 1, Cal_y.value = Ayear2year(y+1);
   else      Cal_m.value = m+1;
 }
 if(ud==2) set_date_screen(2);
 getLunar();
}



/********************
升降计算等
*********************/

function RTS1(jd,vJ,vW,tz){
 SZJ.calcRTS(jd, 1, vJ, vW, tz); //升降计算,使用北时时间,tz=-8指东8区,jd+tz应在当地正午左右(误差数小时不要紧)
 var s, ob = SZJ.rts[0];
// JD.setFromJD(jd+J2000);
 s  = '日出 <font color=red>'+ob.s + '</font> 日落 '+ob.j +' 中天 '+ob.z +'<br>';
 s += '月出 '+ob.Ms+ ' 月落 '+ob.Mj+' 月中 '+ob.Mz+'<br>';
 s += '晨起天亮 '+ob.c + ' 晚上天黑 '+ob.h +'<br>';
 s += '日照时间 '+ob.sj+ ' 白天时间 '+ob.ch+'<br>';
 return s;
}


/**********************
日历(某日)信息页面生成
**********************/
function showMessD(n){ //显时本月第n日的摘要信息。调用前应先执月历页面生成，产生有效的lun对象
 if(event){ if(event.ctrlKey) return; }
 if(!lun.dn||n>=lun.dn) return;
 var vJ = Sel2.vJ-0, vW = Sel2.vW-0;

 if(n==-1){ //鼠标移出日期上方
   Cal_pan.style.display = 'none';
   Cal5.innerHTML = Cal5.bak;
 }
 if(n==-2) Cal5.bak = Cal5.innerHTML = RTS1(curJD, vJ, vW, curTZ);
 if(n<0) return;
 //显示n指定的日期信息
 var ob = lun.lun[n];
 Cal5.innerHTML = RTS1(ob.d0, vJ, vW, curTZ);

 if(window.event && window.event.srcElement.tagName=='SPAN'){ //鼠标移过日期上方

  var J=document.all.Cb_J.value/radd
  obb.mingLiBaZi( ob.d0+curTZ/24, J, ob ); //命理纳音计算,jd为格林尼治UT(J2000起算),J为本地经度,返回在物件ob中

  s  = Ayear2year(ob.y) + '年' + ob.m + '月' + ob.d + '日<br/>'
  s += ob.Lyear4+'年 星期' + JD.Weeks[ob.week] + ' ' + ob.XiZ +'<br/>';
  s += ob.Lyear3+'年 '+ob.Lleap + ob.Lmc + '月' + (ob.Ldn>29?'大 ':'小 ') + ob.Ldc + '日<br/>';
  s += ob.Lyear2+'年 '+ob.Lmonth2+'月 '+ob.Lday2+'日<br/>';
  s += ob.bz_jnny+' '+ob.bz_jyny+' '+ob.bz_jrny+'<br/>';
  s += '回历['+ob.Hyear+'年'+ob.Hmonth+'月'+ob.Hday+'日]<br/>';
  s += 'JD '+(ob.d0+J2000)+'('+ob.d0+')<br/>';
  if(ob.yxmc) s += ob.yxmc+' '+ob.yxsj+'<br/>';
  if(ob.jqmc) s += '定'+ob.jqmc+' '+ob.jqsj+'<br/>';
  //else { if(ob.Ljq) s += ob.Ljq+'<br/>';}
  if(ob.Ljq) s += '<br/>'+ob.dtpq+' ';//ob.dtpq明大统历平气交节时刻ob.Ljq实气

  if(ob.A)    s += ob.A +'<br>';
  if(ob.B)    s += ob.B +'<br>';
  if(ob.C)    s += ob.C;
  Cal_pan.style.display = 'block'; //先显示再传值屏幕流畅
  Cal_pan_in.innerHTML = s;
  Cal_pan.style.left = window.event.x+document.body.scrollLeft + ( (ob.week>3) ? -180 : 20 );
  Cal_pan.style.top  = window.event.y+document.body.scrollTop  - ( (ob.weeki<2)?    0 :100 );
 }
}

/**********************
月历页面生成
**********************/
function getLunar(){ //月历页面生成

  var By  = year2Ayear(Cal_y.value);
  var Bm  = Cal_m.value-0;
  if(By == -10000) return;

  if(!lun.dn || lun.y!=By || lun.m!=Bm){  //月历未计算
   lun.yueLiHTML(By,Bm,curJD);
   Cal2.innerHTML = lun.pg1;
   Cal4.innerHTML = lun.pg2;
  }

  showMessD(-2);
}

getLunar(); //调用月历页面生成函数

/**********************
年历面页生成
**********************/
function getNianLi(dy){ //dy起始年份偏移数
 y=year2Ayear(Cp2_y.value);  if(y==-10000) return;         //检查输入值
 y+=dy;                      Cp2_y.value = Ayear2year(y); //加上偏移年数
 if(y<-10000) { alert('到底了'); return; } //检查输入值
 if(Cp2_tg.checked) Cal7.innerHTML = Ayear2year(y)+'年<br>'+nianLiHTML(y);
 else               Cal7.innerHTML = Ayear2year(y)+'年<br>'+nianLi2HTML(y);
}
function getNianLiN(){ //dy起始年份偏移数
 y=year2Ayear(Cp2_y.value);
 if(y==-10000) return; //检查输入值
 n=Cp2_n.value-0;
 if(n<1||n>500) {alert("超出范围"); return;}
 var i,s='';
 for(i=0;i<n;i++){
  if(Cp2_tg.checked) s += Ayear2year(y+i)+'年<br>'+nianLiHTML(y+i);
  else               s += Ayear2year(y+i)+'年<br>'+nianLi2HTML(y+i);
 }
 Cal7.innerHTML = s;
}

/**********************
时钟1秒定时
**********************/
function tick() { //即时坐标计算
  var now = new Date();
  show_clock(now);
  zb_calc();
  window.setTimeout("tick()", 1000);
}
tick(); //触发时钟

