/* Policy Slopes Live: the board (teacher's projector screen) */
(function(){
"use strict";
var KEY="policySlopesLive.board";
var CASES=casesFromArr(STARTER);
var H=null,conn=null,bcastT=null,hbT=null,justRevealed=false,PASS=null;

/* ---------- state ---------- */
function fresh(cls){return {room:roomCode(),cls:cls,deck:shuffle(CASES.map(function(c){return c.id})),idx:0,phase:"lobby",round:0,roster:{},marks:{},view:"avg",hl:null,stopAt:null,created:Date.now()}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(H))}catch(e){}}
function load(){try{return JSON.parse(localStorage.getItem(KEY)||"null")}catch(e){return null}}
function caseById(id){for(var i=0;i<CASES.length;i++)if(CASES[i].id===id)return CASES[i];return {id:id,short:"?",title:"?"}}
function curId(){return H.deck[H.idx]}
function riderCount(){return Object.keys(H.roster).length}
function rname(pid){var r=H.roster[pid];return r?((r.name&&r.name.trim())||NAMES[r.kind]):"?"}
function show(scr){
  ["Start","Board","Lodge"].forEach(function(n){$("#scr"+n).classList.toggle("hidden",n.toLowerCase()!==scr)});
  $("#endBtn").classList.toggle("hidden",scr==="start");
  window.scrollTo({top:0,behavior:"smooth"});
}
function joinURL(){
  var u=new URL("join.html",location.href);u.searchParams.set("room",H.room);
  if(/[?&]demo=1\b/.test(location.search))u.searchParams.set("demo","1");
  return u.href;
}
function qrSVG(text){try{var q=qrcode(0,"M");q.addData(text);q.make();return q.createSvgTag({cellSize:4,margin:2,scalable:true})}catch(e){return ""}}

/* ---------- live connection ---------- */
function setBadge(st){
  var b=$("#modeBadge");b.className="modebadge "+st;
  b.querySelector("span").textContent=st==="live"?"Live":st==="demo"?"Demo mode (this browser only)":st==="down"?"Reconnecting…":"Connecting…";
}
function statePayload(){
  var id=curId(),c=caseById(id),m=H.marks[id]||{},showCase=H.phase==="place"||H.phase==="revealed";
  return {room:H.room,phase:H.phase,round:H.round,n:H.idx+1,title:showCase?c.title:"",locked:showCase?Object.keys(m):[],known:Object.keys(H.roster),cls:H.cls||""};
}
function sendState(){if(conn&&H)conn.send("state",statePayload())}
function bcast(){clearTimeout(bcastT);bcastT=setTimeout(sendState,120)}
function onEvent(ev,p){
  if(!p||!H||p.room&&p.room!==H.room)return;
  var pid=typeof p.pid==="string"&&p.pid.length<=24?p.pid:null;
  if(ev==="hello"){bcast();return}
  if(ev==="join"&&pid){H.roster[pid]=cleanProfile(p.profile);save();renderStatus();bcast();return}
  if(ev==="place"&&pid){
    if(H.phase!=="place"||p.round!==H.round||!H.roster[pid])return;
    var x=+p.x,y=+p.y;if(!(x>=0&&x<=1&&y>=0&&y<=1))return;
    (H.marks[curId()]=H.marks[curId()]||{})[pid]={x:x,y:y};save();renderStatus();bcast();return;
  }
  if(ev==="unplace"&&pid){
    if(H.phase!=="place"||p.round!==H.round)return;
    var mm=H.marks[curId()];if(mm)delete mm[pid];save();renderStatus();bcast();
  }
}
function connect(){
  setBadge("");
  conn=liveConnect(H.room,onEvent,function(st){setBadge(st);if(st==="live"||st==="demo")sendState()});
  clearInterval(hbT);hbT=setInterval(sendState,4000);
}

/* ---------- finished cases ---------- */
function doneItems(){
  var last=H.phase==="lodge"?H.stopAt:H.idx+(H.phase==="revealed"?1:0),out=[];
  for(var i=0;i<last&&i<H.deck.length;i++){
    var id=H.deck[i],m=H.marks[id]||{},marks=[];
    Object.keys(m).forEach(function(pid){if(H.roster[pid])marks.push({x:m[pid].x,y:m[pid].y,p:H.roster[pid],pid:pid})});
    if(!marks.length)continue;
    var a=avgOf(marks),c=caseById(id);
    out.push({id:id,n:i+1,label:c.short,title:c.title,x:a.x,y:a.y,marks:marks,fresh:justRevealed&&i===H.idx});
  }
  return out;
}

/* ---------- render ---------- */
function renderAll(anim){renderLift(anim);renderBoard();renderStatus();renderActs();renderLog();setView(H.view)}
function setView(v){H.view=v;$("#vAvg").classList.toggle("on",v==="avg");$("#vOrig").classList.toggle("on",v==="orig");save()}
function renderJoin(){
  var url=joinURL();
  $("#roomCode").textContent=fmtRoom(H.room);$("#roomCode2").textContent=fmtRoom(H.room);
  $("#joinUrl").textContent=url.replace(/^https?:\/\//,"");$("#joinUrl2").textContent=url.replace(/^https?:\/\//,"").replace(/\?.*$/,"")+"  ·  code "+fmtRoom(H.room);
  var q=qrSVG(url);$("#qrSmall").innerHTML=q;$("#qrBig").innerHTML=q;
}
function renderBoard(){
  var items=doneItems(),cur=H.phase==="revealed"?curId():null,opts={pfx:"b",mode:H.view,items:items,hl:H.hl};
  var showing="";
  if(H.view==="orig"){
    var focus=H.hl||cur||(items.length?items[items.length-1].id:null);
    opts.items=items.filter(function(it){return it.id===focus});opts.hl=null;
    var f=opts.items[0];showing=f?"Showing case "+f.n+" · click a case in the trail log to switch":"No cases revealed yet";
  } else if(cur&&!H.hl)opts.showMarksFor=cur;
  $("#showing").textContent=showing;
  $("#board").innerHTML=boardSVG(opts);
  $("#lobby").classList.toggle("hidden",H.phase!=="lobby");
}
function renderLift(anim){
  var el=$("#policyCard"),c=caseById(curId());
  var cable='<svg class="cable" viewBox="0 0 360 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 10 L360 22" stroke="#1B2440" stroke-width="3"/></svg>'+
    '<svg aria-hidden="true" width="60" height="50" viewBox="0 0 60 50" style="position:absolute;left:50%;top:6px;margin-left:-30px"><rect x="18" y="4" width="24" height="12" rx="4" fill="#1B2440"/><circle cx="24" cy="10" r="2.5" fill="#fff"/><circle cx="36" cy="10" r="2.5" fill="#fff"/><path d="M30 16 V46" stroke="#1B2440" stroke-width="4"/><path d="M12 46 H48" stroke="#1B2440" stroke-width="4" stroke-linecap="round"/></svg>';
  if(H.phase==="lobby")el.innerHTML=cable+'<div class="liftcard"><div class="lbl"><i>Boarding</i>'+riderCount()+' on the lift</div><h3>Waiting for riders</h3><p>When everyone has joined, start the first case.</p></div>';
  else el.innerHTML=cable+'<div class="liftcard"><div class="lbl"><i>On the lift</i>Case '+(H.idx+1)+'</div><h3>'+esc(c.title)+'</h3><p>'+(H.phase==="place"?"Place it on your phone: who usually sets it, and how much room does it leave?":"Here's where the class landed.")+'</p></div>';
  el.classList.remove("draw");if(anim){void el.offsetWidth;el.classList.add("draw")}
}
function renderStatus(){
  if(!H)return;
  var n=riderCount(),m=H.marks[curId()]||{},k=Object.keys(m).filter(function(p){return H.roster[p]}).length;
  var lc=$("#lockCount"),meter=$("#lockMeter"),rb=$("#revealBtn");
  if(H.phase==="lobby"){lc.innerHTML=n+' <small>rider'+(n===1?"":"s")+' on the lift</small>';meter.style.width=Math.min(100,n*4)+"%";rb.classList.add("hidden")}
  else if(H.phase==="place"){lc.innerHTML=k+' <small>of '+n+' locked in</small>';meter.style.width=(n?k/n*100:0)+"%";rb.classList.remove("hidden");rb.disabled=k===0}
  else {lc.innerHTML=k+' <small>rider'+(k===1?"":"s")+' placed this case</small>';meter.style.width=(n?k/n*100:0)+"%";rb.classList.add("hidden")}
  var pids=Object.keys(H.roster);
  $("#riders").innerHTML=pids.length?pids.map(function(pid){
    var cls=H.phase==="place"?(m[pid]?"locked":"wait"):"";
    return '<span class="rider '+cls+'" title="'+esc(rname(pid))+'">'+avatarSVG(H.roster[pid],30)+esc(rname(pid))+(H.phase==="place"&&m[pid]?" ✓":"")+'</span>';
  }).join(""):'<span style="color:var(--muted)">No one has joined yet. Point phones at the QR code.</span>';
  if(H.phase==="lobby")renderLift(false);
}
function renderActs(){
  var off=H.phase==="lobby"?0:1,up=H.deck.slice(H.idx+off,H.idx+off+3),can=H.phase==="revealed"||H.phase==="lobby",last=H.idx>=H.deck.length-1,html="";
  if(H.phase==="lobby")html+='<button class="btn dark wide" style="font-size:18px;padding:14px 16px" id="startCase">Start the first case →</button>';
  else html+='<button class="btn dark wide" style="font-size:18px;padding:14px 16px" id="nextBtn"'+(H.phase==="revealed"?"":" disabled")+'>'+(last?"To the lodge →":"Draw the next case →")+'</button>';
  if(H.phase==="place")html+='<button class="btn sm" id="skipCur">Skip this case</button>';
  html+='<div><h4 class="uh">Up next</h4><div style="font-size:13.5px;color:var(--muted);margin:-4px 0 8px">'+(can?"Click a case to ride it next, or skip one.":"You can pick once this case is revealed.")+'</div><div class="ucards">';
  if(!up.length)html+='<div class="ucard" style="padding-bottom:12px">That’s every policy. Head to the lodge!</div>';
  up.forEach(function(id,k){html+='<div class="ucard'+(can?" pick":"")+'" data-k="'+k+'"'+(can?' role="button" tabindex="0"':'')+'>'+esc(caseById(id).title)+'<span class="go">'+(can?"Ride this one →":"On deck")+'</span><button class="skip" data-skip="'+k+'">Skip ✕</button></div>'});
  html+='</div></div>';
  var any=doneItems().length>0;
  html+='<button class="btn wide" id="lodgeBtn"'+(any?'':' disabled title="Reveal at least one case first"')+'>Hit the Lodge (end the run)</button>';
  var el=$("#sideActs");el.innerHTML=html;
  if($("#startCase"))$("#startCase").onclick=startCase;
  if($("#nextBtn"))$("#nextBtn").onclick=nextCase;
  if($("#skipCur"))$("#skipCur").onclick=function(){ask("Skip this case? It goes to the bottom of the deck and any spots placed on it are cleared.","Skip it",skipCurrent)};
  $("#lodgeBtn").onclick=hitLodge;
  el.querySelectorAll(".skip").forEach(function(b){b.onclick=function(e){e.stopPropagation();skipCase(+b.dataset.skip)}});
  if(can)el.querySelectorAll(".ucard.pick").forEach(function(c){
    c.onclick=function(){pickCase(+c.dataset.k)};
    c.onkeydown=function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();pickCase(+c.dataset.k)}};
  });
}
function renderLog(){
  var items=doneItems(),el=$("#logList");
  if(!items.length){el.innerHTML='<li class="empty" style="cursor:default">No cases revealed yet.</li>';return}
  el.innerHTML=items.map(function(d){return '<li data-id="'+esc(d.id)+'" class="'+(H.hl===d.id?"on":"")+'"><span class="n">'+d.n+'</span><span class="t">'+esc(d.label)+'</span><span class="a">'+lvl(d.y)+'<br>'+lean(d.x)+'</span></li>'}).join("");
}

/* ---------- actions ---------- */
function startCase(){H.phase="place";H.round++;H.hl=null;justRevealed=false;save();renderAll(true);sendState()}
function nextCase(){
  if(H.idx>=H.deck.length-1){toLodge(H.deck.length);return}
  H.idx++;startCase();
}
function moveTo(k){var off=H.phase==="lobby"?0:1,at=H.idx+off+k;if(at>=H.deck.length)return false;var id=H.deck.splice(at,1)[0];H.deck.splice(H.idx+off,0,id);return true}
function pickCase(k){if(!moveTo(k))return;if(H.phase==="lobby")startCase();else nextCase()}
function skipCase(k){
  var off=H.phase==="lobby"?0:1,at=H.idx+off+k;if(at>=H.deck.length)return;
  var id=H.deck.splice(at,1)[0],remaining=H.deck.length-(H.idx+off);
  if(remaining>=3){H.deck.push(id);toast("Skipped: sent to the bottom of the deck")}else toast("Skipped");
  save();renderActs();
}
function skipCurrent(){
  var id=H.deck.splice(H.idx,1)[0];delete H.marks[id];
  if(H.deck.length-H.idx>=3)H.deck.push(id);
  if(H.idx>=H.deck.length){toLodge(H.deck.length);return}
  startCase();
}
function reveal(){H.phase="revealed";justRevealed=true;H.hl=null;save();renderAll(false);sendState();setTimeout(function(){justRevealed=false},1200)}
function toLodge(stop){
  if(H.phase==="place"){var id=curId();if(id)delete H.marks[id]}
  H.stopAt=stop;H.phase="lodge";H.hl=null;justRevealed=false;save();sendState();
  show("lodge");renderPass();
}
function hitLodge(){
  var stop=H.phase==="revealed"?H.idx+1:H.idx;
  var n=doneItems().length;if(!n){toast("Reveal at least one case first");return}
  ask(H.phase==="place"?"Head to the lodge? The case on the lift now won't be counted.":"Head to the lodge with "+n+" case"+(n>1?"s":"")+" on the slope?","Hit the Lodge",function(){toLodge(stop)});
}

/* ---------- class lift pass ---------- */
function exportSVG(){
  var F='font-family="Avenir Next, Segoe UI, Helvetica Neue, Helvetica, Arial, sans-serif"',P=[];
  var items=doneItems(),date=new Date().toLocaleDateString(undefined,{year:"numeric",month:"long",day:"numeric"});
  var W=2240,cx0=210,bw=960,bh=614.4,gap=50,cols=3,colW=(W-cx0-60)/cols,rows=Math.ceil(items.length/cols);
  var pids=Object.keys(H.roster),my=232,mx=cx0,mem=[];
  pids.forEach(function(pid){
    var nm=rname(pid).slice(0,16),wid=50+nm.length*10+16;
    if(mx+wid>W-60){mx=cx0;my+=46}
    mem.push('<rect x="'+mx+'" y="'+(my-19)+'" width="'+wid+'" height="38" rx="19" fill="#F4F9FD" stroke="#D6E4F0"/>'+avatarAt(H.roster[pid],mx+20,my,32)+'<text x="'+(mx+42)+'" y="'+(my+6)+'" '+F+' font-size="17" font-weight="700" fill="#1B2440">'+esc(nm)+'</text>');
    mx+=wid+10;
  });
  var by=my+56,legY=by+44+bh+60,H2=Math.ceil(legY+30+rows*40+70+70);
  P.push('<rect width="'+W+'" height="'+H2+'" fill="#EAF3FA"/>');
  P.push('<rect x="20" y="20" width="'+(W-40)+'" height="'+(H2-40)+'" rx="30" fill="#FFFFFF" stroke="#C9DCEC" stroke-width="2"/>');
  P.push('<path d="M50 20 H170 V'+(H2-20)+' H50 Q20 '+(H2-20)+' 20 '+(H2-50)+' V50 Q20 20 50 20 Z" fill="#1B2440"/>');
  P.push('<line x1="172" y1="40" x2="172" y2="'+(H2-40)+'" stroke="#C9DCEC" stroke-width="2.5" stroke-dasharray="8 9"/>');
  P.push('<circle cx="95" cy="82" r="17" fill="#EAF3FA"/>');
  P.push('<g transform="translate(95 150)"><path d="M0 -14 L14 0 L0 14 L-14 0 Z" fill="#FFFFFF"/><rect x="-11" y="26" width="22" height="22" fill="#3A97DA"/><circle cy="78" r="12" fill="#2E9A5B"/></g>');
  P.push('<text transform="translate(116 '+(H2/2)+') rotate(-90)" text-anchor="middle" '+F+' font-size="54" font-weight="800" letter-spacing="14" fill="#FFFFFF">LIFT PASS</text>');
  P.push('<text transform="translate(58 '+(H2/2)+') rotate(-90)" text-anchor="middle" '+F+' font-size="17" font-weight="800" letter-spacing="7" fill="#8FB6DA">POLICY SLOPES LIVE</text>');
  var seed=0;(H.cls||H.room).split("").forEach(function(c){seed=(seed*31+c.charCodeAt(0))%9973});
  var yy=H2-80;for(var k=0;k<34;k++){seed=(seed*7+13)%97;var t=1+(seed%4);P.push('<rect x="52" y="'+(yy-t)+'" width="86" height="'+t+'" fill="#FFFFFF"/>');yy-=t+2+(seed%3)}
  P.push('<text x="'+cx0+'" y="84" '+F+' font-size="18" font-weight="800" letter-spacing="5" fill="#1E66A6">POLICY SLOPES · PRECISION vs. FLEXIBILITY</text>');
  P.push('<text x="'+cx0+'" y="146" '+F+' font-size="54" font-weight="800" fill="#1B2440">'+esc(H.cls||"Our class")+'</text>');
  P.push('<text x="'+cx0+'" y="186" '+F+' font-size="21" fill="#62708C">'+esc(date)+' · '+items.length+' case'+(items.length===1?"":"s")+' · '+pids.length+' rider'+(pids.length===1?"":"s")+'</text>');
  P.push('<g transform="translate('+(W-210)+' 112)"><rect x="-80" y="-62" width="160" height="124" rx="16" fill="#F4F9FD" stroke="#D6E4F0"/><path d="M-50 34 L-18 -14 L-2 6 L22 -34 L52 34 Z" fill="#E7F1F9" stroke="#1B2440" stroke-width="3" stroke-linejoin="round"/><path d="M22 -34 L14 -20 L20 -22 L24 -16 L28 -22 L32 -20 Z" fill="#fff" stroke="#1B2440" stroke-width="2" stroke-linejoin="round"/><text y="54" text-anchor="middle" '+F+' font-size="14" font-weight="800" letter-spacing="3" fill="#1B2440">ALL ACCESS</text></g>');
  P.push(mem.join(""));
  var bx2=cx0+bw+gap;
  P.push('<text x="'+cx0+'" y="'+(by+26)+'" '+F+' font-size="22" font-weight="800" letter-spacing="4" fill="#1B2440">CLASS AVERAGE</text>');
  P.push('<text x="'+bx2+'" y="'+(by+26)+'" '+F+' font-size="22" font-weight="800" letter-spacing="4" fill="#1B2440">INDIVIDUAL RUN</text>');
  P.push(boardSVG({pfx:"xa",mode:"avg",items:items,attrs:'x="'+cx0+'" y="'+(by+40)+'" width="'+bw+'" height="'+bh+'"'}));
  P.push(boardSVG({pfx:"xo",mode:"orig",items:items,attrs:'x="'+bx2+'" y="'+(by+40)+'" width="'+bw+'" height="'+bh+'"'}));
  P.push('<line x1="'+cx0+'" y1="'+(legY-30)+'" x2="'+(W-60)+'" y2="'+(legY-30)+'" stroke="#D6E4F0" stroke-width="2"/>');
  P.push('<text x="'+cx0+'" y="'+(legY+4)+'" '+F+' font-size="16" font-weight="800" letter-spacing="4" fill="#1E66A6">CASES</text>');
  items.forEach(function(d,k){
    var col=Math.floor(k/rows),row=k%rows,x=cx0+col*colW,y=legY+46+row*40,nm=d.title.length>38?d.label:d.title;
    P.push('<circle cx="'+(x+15)+'" cy="'+(y-7)+'" r="15" fill="#1B2440"/><text x="'+(x+15)+'" y="'+(y-1)+'" text-anchor="middle" '+F+' font-size="16" font-weight="800" fill="#FFFFFF">'+d.n+'</text>'+
      '<text x="'+(x+40)+'" y="'+y+'" '+F+' font-size="20" font-weight="700" fill="#1B2440">'+esc(nm)+'</text>'+
      '<text x="'+(x+colW-30)+'" y="'+y+'" text-anchor="end" '+F+' font-size="17" fill="#62708C">'+esc(lvl(d.y)+" · "+lean(d.x))+'</text>');
  });
  var multi=items.filter(function(d){return d.marks.length>1}).sort(function(a,b){return spreadOf(b.marks)-spreadOf(a.marks)});
  var fy=legY+46+rows*40+40;
  if(multi.length)P.push('<text x="'+cx0+'" y="'+fy+'" '+F+' font-size="20" fill="#1B2440"><tspan font-weight="800">Most debated:</tspan> '+esc(multi[0].n+". "+multi[0].label)+'<tspan dx="36" font-weight="800">Most agreed:</tspan> '+esc(multi[multi.length-1].n+". "+multi[multi.length-1].label)+'<tspan dx="36" fill="#62708C">Individual Run: each character is one student’s spot; dashed lines run to the class average.</tspan></text>');
  return {svg:'<svg xmlns="http://www.w3.org/2000/svg" width="'+W+'" height="'+H2+'" viewBox="0 0 '+W+' '+H2+'">'+P.join("")+'</svg>',w:W,h:H2};
}
function renderPass(){
  $("#passImg").innerHTML="Printing the lift pass…";PASS=null;
  var o=exportSVG();
  toPNG(o,1.5).then(function(r){PASS=r;$("#passImg").innerHTML='<img alt="Class lift pass" src="'+r.dataUrl+'">'})
  .catch(function(){$("#passImg").innerHTML=o.svg;toast("Couldn't build the image here. Take a screenshot instead.")});
}
function passName(ext){return slug(H.cls||"class")+"-lift-pass."+ext}
$("#dlPass").onclick=function(){downloadBlob(PASS&&PASS.blob,passName("png"))};
$("#pdfPass").onclick=function(){if(!PASS){toast("Still printing…");return}downloadBlob(makePDFfromImg($("#passImg img")),passName("pdf"))};
$("#printPass").onclick=function(){
  if(!PASS){toast("Still printing…");return}
  $("#printArea").innerHTML='<img src="'+PASS.dataUrl+'" alt="">';
  setTimeout(function(){try{window.print()}catch(e){}},150);
};
$("#backToSlopes").onclick=function(){
  var st=H.stopAt!=null?H.stopAt:H.deck.length;
  H.idx=Math.max(0,st-1);H.phase=st>0?"revealed":"lobby";H.stopAt=null;save();sendState();show("board");renderAll(false);
};

/* ---------- wiring ---------- */
$("#vAvg").onclick=function(){setView("avg");renderBoard()};
$("#vOrig").onclick=function(){setView("orig");renderBoard()};
$("#revealBtn").onclick=reveal;
$("#logList").addEventListener("click",function(e){var li=e.target.closest("li[data-id]");if(!li)return;H.hl=H.hl===li.dataset.id?null:li.dataset.id;save();renderBoard();renderLog()});
$("#diceBtn").onclick=function(){$("#className").value=randPun()};
$("#className").placeholder="e.g., Period 3: "+randPun();
function openSession(st){
  H=st;save();renderJoin();connect();
  if(H.phase==="lodge"){show("lodge");renderPass()}else{show("board");renderAll(false)}
}
$("#openBtn").onclick=function(){openSession(fresh(($("#className").value||"").trim()||randPun()))};
$("#endBtn").onclick=function(){ask("End this session? Phones will be disconnected and the board resets.","End session",function(){
  if(H){H.phase="ended";sendState()}
  try{localStorage.removeItem(KEY)}catch(e){}
  clearInterval(hbT);H=null;conn=null;setTimeout(function(){location.reload()},300);
})};
var saved=load();
if(saved&&saved.room&&saved.phase&&saved.phase!=="ended"&&Date.now()-(saved.created||0)<12*3600*1000){
  $("#resumeBar").classList.remove("hidden");
  $("#resumeInfo").textContent=(saved.cls?saved.cls+" · ":"")+"room "+fmtRoom(saved.room)+" · "+Object.keys(saved.roster||{}).length+" riders";
  $("#resumeBtn").onclick=function(){$("#resumeBar").classList.add("hidden");openSession(saved)};
  $("#freshBtn").onclick=function(){$("#resumeBar").classList.add("hidden");try{localStorage.removeItem(KEY)}catch(e){}};
}
setBadge(isDemo()?"demo":"");
if(isDemo())$("#modeBadge span").textContent="Demo mode (this browser only)";
})();
