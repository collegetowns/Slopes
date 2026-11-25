/* Policy Slopes Live: the phone page */
(function(){
"use strict";
var params=new URLSearchParams(location.search);
var room=normRoom(params.get("room"));if(room&&!validRoom(room))room="";
var P=null,conn=null,lastState=null,lastStateAt=0,joinSentAt=0,resendT=null,editing=false;

function key(){return "policySlopesLive.phone."+room}
/* real phones remember the rider across refreshes; in demo mode each tab is its own "phone" */
function store(){try{return isDemo()?window.sessionStorage:window.localStorage}catch(e){return null}}
function save(){try{store().setItem(key(),JSON.stringify(P))}catch(e){}}
function load(){try{return JSON.parse(store().getItem(key())||"null")}catch(e){return null}}
function rid(){var a="abcdefghijkmnpqrstuvwxyz23456789",s="";for(var i=0;i<10;i++)s+=a[Math.floor(Math.random()*a.length)];return s}
function only(id){["sCode","sProfile","sWait","sPlace","sLocked","sReveal","sLodge","sEnded"].forEach(function(s){$("#"+s).classList.toggle("hidden",s!==id)})}
function setBadge(st){var b=$("#modeBadge");b.className="modebadge "+st;b.querySelector("span").textContent=st==="live"?"Live":st==="demo"?"Demo":st==="down"?"Reconnecting…":"Connecting…"}

/* ---------- code entry ---------- */
function askCode(){only("sCode");$("#codeIn").value=room?fmtRoom(room):"";setTimeout(function(){$("#codeIn").focus()},50)}
$("#codeGo").onclick=function(){
  var c=normRoom($("#codeIn").value);
  if(!validRoom(c)){toast("Type the code on the board, like SNOW-42");return}
  var u=new URL(location.href);u.searchParams.set("room",c);location.href=u.href;
};
$("#codeIn").addEventListener("keydown",function(e){if(e.key==="Enter")$("#codeGo").click()});
$("#newCode").onclick=function(){room="";askCode()};

/* ---------- rider picker ---------- */
function renderProfile(){
  var p=P.profile;
  $("#prevAv").innerHTML=avatarSVG(p,130);
  $("#kindGrid").innerHTML=KINDS.map(function(k){return '<button data-kind="'+k+'" class="'+(k===p.kind?"on":"")+'" aria-label="'+NAMES[k]+'">'+avatarSVG({kind:k,variant:k===p.kind?p.variant:0,look:"none"},54)+'</button>'}).join("");
  $("#colorRow").innerHTML='<span class="l">Color</span>'+PAL[p.kind].map(function(c,v){return '<button class="dot'+(v===p.variant?" on":"")+'" data-var="'+v+'" style="background:linear-gradient(135deg,'+c[0]+' 50%,'+c[2]+' 50%)" aria-label="Color '+(v+1)+'"></button>'}).join("");
  $("#styleRow").innerHTML='<span class="l">Style</span>'+LOOKS.map(function(l){return '<button class="chip'+(l===p.look?" on":"")+'" data-look="'+l+'">'+l+'</button>'}).join("");
  $("#rideRow").innerHTML='<span class="l">Ride</span>'+RIDES.map(function(r){return '<button class="chip'+(r===p.ride?" on":"")+'" data-ride="'+r+'">'+r+'</button>'}).join("");
}
$("#sProfile").addEventListener("click",function(e){
  var b=e.target.closest("button");if(!b||b.id==="hopOn")return;var p=P.profile;
  if(b.dataset.kind){p.kind=b.dataset.kind}else if(b.dataset.var!=null){p.variant=+b.dataset.var}else if(b.dataset.look){p.look=b.dataset.look}else if(b.dataset.ride){p.ride=b.dataset.ride}else return;
  save();renderProfile();
});
$("#nameIn").addEventListener("input",function(e){P.profile.name=e.target.value.slice(0,24);save()});
$("#hopOn").onclick=function(){P.joined=true;editing=false;save();sendJoin(true);route()};
$("#editRider").onclick=function(){editing=true;only("sProfile");$("#nameIn").value=P.profile.name||"";renderProfile()};

/* ---------- phone slope ---------- */
var X0=18,X1=582,Y0=18,Y1=468;
function phoneSlope(spot){
  var F='font-family="Avenir Next, Segoe UI, Helvetica, Arial, sans-serif"',w=X1-X0,h=Y1-Y0,t1=Y0+h/3,t2=Y0+2*h/3,mx=X0+w/2;
  var s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 560" role="img" aria-label="Slope: tap to place">';
  s+='<defs><linearGradient id="psky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E4F0FA"/><stop offset=".5" stop-color="#F6FAFD"/><stop offset="1" stop-color="#FFFFFF"/></linearGradient><clipPath id="pclip"><rect x="'+X0+'" y="'+Y0+'" width="'+w+'" height="'+h+'" rx="16"/></clipPath></defs>';
  s+='<rect width="600" height="560" fill="#fff"/><g clip-path="url(#pclip)"><rect x="'+X0+'" y="'+Y0+'" width="'+w+'" height="'+h+'" fill="url(#psky)"/>';
  s+='<path d="M18 190 L90 110 L150 150 L230 50 L300 120 L360 80 L440 40 L520 120 L582 90 L582 468 L18 468 Z" fill="#DCEAF6" opacity=".85"/>';
  s+='<path d="M18 250 Q160 196 300 232 T582 220 L582 468 L18 468 Z" fill="#FFFFFF"/></g>';
  s+='<g stroke="#A9C9E4" stroke-width="2" stroke-dasharray="8 8"><line x1="'+X0+'" y1="'+t1+'" x2="'+X1+'" y2="'+t1+'"/><line x1="'+X0+'" y1="'+t2+'" x2="'+X1+'" y2="'+t2+'"/><line x1="'+mx+'" y1="'+Y0+'" x2="'+mx+'" y2="'+Y1+'"/></g>';
  s+='<rect x="'+X0+'" y="'+Y0+'" width="'+w+'" height="'+h+'" rx="16" fill="none" stroke="#C9DCEC" stroke-width="2"/>';
  [["FEDERAL",Y0,'<path d="M0 -13 L13 0 L0 13 L-13 0 Z" fill="#1B2440"/>'],["STATE",t1,'<rect x="-11" y="-11" width="22" height="22" fill="#1E66A6"/>'],["LOCAL",t2,'<circle r="12" fill="#2E9A5B"/>']].forEach(function(b){
    s+='<g transform="translate('+(X0+30)+' '+(b[1]+32)+')">'+b[2]+'<text x="22" y="9" '+F+' font-size="26" font-weight="800" letter-spacing="2" fill="#1B2440" opacity=".85">'+b[0]+'</text></g>';
  });
  s+='<g stroke="#1B2440" stroke-width="3" fill="none" stroke-linecap="round"><line x1="'+(X0+16)+'" y1="500" x2="'+(X1-16)+'" y2="500"/><path d="M'+(X0+28)+' 490 L'+(X0+14)+' 500 L'+(X0+28)+' 510"/><path d="M'+(X1-28)+' 490 L'+(X1-14)+' 500 L'+(X1-28)+' 510"/></g>';
  s+='<text x="'+X0+'" y="545" '+F+' font-size="28" font-weight="800" letter-spacing="2" fill="#1B2440">PRECISE</text><text x="'+X1+'" y="545" text-anchor="end" '+F+' font-size="28" font-weight="800" letter-spacing="2" fill="#1B2440">FLEXIBLE</text>';
  if(spot){
    var x=X0+spot.x*w,y=Y0+spot.y*h;
    s+='<circle cx="'+x+'" cy="'+y+'" r="54" fill="#FFFFFF" opacity=".9" stroke="#3A97DA" stroke-width="4"/>'+avatarAt(P.profile,x,y,96);
  }
  return s+'</svg>';
}
function renderSlope(){
  $("#slope").innerHTML=phoneSlope(P.spot);
  $("#lockBtn").disabled=!P.spot;$("#rerunBtn").disabled=!P.spot;
  $("#placeHint").textContent=P.spot?"Your spot: "+lvl(P.spot.y)+", "+lean(P.spot.x).toLowerCase()+". Lock it in, or tap again to move it.":"Tap the slope where this policy fits.";
  var svg=$("#slope svg");
  svg.addEventListener("click",function(e){
    var r=svg.getBoundingClientRect(),sx=(e.clientX-r.left)/r.width*600,sy=(e.clientY-r.top)/r.height*560;
    if(sx<X0-10||sx>X1+10||sy<Y0-10||sy>Y1+10)return;
    P.spot={x:Math.max(0,Math.min(1,(sx-X0)/(X1-X0))),y:Math.max(0,Math.min(1,(sy-Y0)/(Y1-Y0)))};
    save();renderSlope();
  });
}
$("#rerunBtn").onclick=function(){P.spot=null;save();renderSlope()};
$("#lockBtn").onclick=function(){
  if(!P.spot||!lastState)return;
  P.lockedRound=lastState.round;P.pending=true;save();sendPlace();route();
};
$("#changeBtn").onclick=function(){
  if(lastState&&lastState.phase!=="place")return;
  conn.send("unplace",{room:room,pid:P.pid,round:P.lockedRound});
  P.lockedRound=-1;P.pending=false;save();route();
};

/* ---------- messages ---------- */
function sendJoin(force){
  var now=Date.now();if(!force&&now-joinSentAt<2500)return;joinSentAt=now;
  conn.send("join",{room:room,pid:P.pid,profile:cleanProfile(P.profile)});
}
function sendPlace(){
  if(!P.spot||!lastState)return;
  conn.send("place",{room:room,pid:P.pid,round:P.lockedRound,x:+P.spot.x.toFixed(4),y:+P.spot.y.toFixed(4)});
  clearTimeout(resendT);
  resendT=setTimeout(function(){if(P.pending&&lastState&&lastState.phase==="place"&&lastState.round===P.lockedRound&&(lastState.locked||[]).indexOf(P.pid)<0)sendPlace()},2500);
}
function onEvent(ev,s){
  if(ev!=="state"||!s||s.room!==room)return;
  lastState=s;lastStateAt=Date.now();$("#lostMsg").textContent="";
  if(P.joined&&(s.known||[]).indexOf(P.pid)<0&&s.phase!=="ended")sendJoin(false);
  if(s.round!==P.round){P.round=s.round;P.spot=null;P.lockedRound=-1;P.pending=false;save()}
  var locked=(s.locked||[]).indexOf(P.pid)>=0;
  if(locked){P.pending=false;P.lockedRound=s.round}
  else if(s.phase==="place"&&P.lockedRound===s.round&&!P.pending){P.lockedRound=-1}
  route();
}

/* ---------- screens ---------- */
function route(){
  if(!room){askCode();return}
  if(!P.joined||editing){if(!editing){only("sProfile");$("#nameIn").value=P.profile.name||"";renderProfile()}return}
  var s=lastState,av=function(sz){return avatarSVG(P.profile,sz)};
  if(!s){only("sWait");$("#waitAv").innerHTML=av(150);return}
  if(s.phase==="lobby"){only("sWait");$("#waitAv").innerHTML=av(150);return}
  if(s.phase==="place"){
    if(P.lockedRound===s.round){
      only("sLocked");$("#lockAv").innerHTML=av(130);
      $("#lockMsg").textContent=P.pending?"Sending your spot…":"Your spot is hidden until your teacher reveals the class average.";
      return;
    }
    var wasHidden=$("#sPlace").classList.contains("hidden")||$("#caseTitle").dataset.round!==String(s.round);
    only("sPlace");
    if(wasHidden){$("#caseNum").textContent="On the lift · Case "+s.n;$("#caseTitle").textContent=s.title;$("#caseTitle").dataset.round=String(s.round);renderSlope()}
    return;
  }
  if(s.phase==="revealed"){only("sReveal");$("#revAv").innerHTML=av(140);return}
  if(s.phase==="lodge"){only("sLodge");$("#lodgeAv").innerHTML=av(140);return}
  if(s.phase==="ended"){only("sEnded");return}
}

/* ---------- start ---------- */
if(!room){setBadge("");askCode();return}
P=load()||{pid:rid(),profile:{name:"",kind:KINDS[Math.floor(Math.random()*KINDS.length)],variant:0,look:"none",ride:"none"},joined:false,round:-1,lockedRound:-1,spot:null,pending:false};
if(!P.profile.ride)P.profile.ride="none";
save();
conn=liveConnect(room,onEvent,function(st){setBadge(st);if(st==="live"||st==="demo"){conn.send("hello",{room:room});if(P.joined)sendJoin(true)}});
setInterval(function(){
  if(Date.now()-lastStateAt>9000){
    conn.send("hello",{room:room});
    if(P.joined&&!editing)$("#lostMsg").textContent=lastState?"Lost the board for a moment… reconnecting.":"Looking for the board with code "+fmtRoom(room)+"… check the code on the screen.";
  }
},3000);
route();
})();
