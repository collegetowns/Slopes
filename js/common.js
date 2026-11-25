/* Policy Slopes Live: shared code (cases, characters, slope drawing, saving, live connection) */
/* ---------- starter cases ---------- */
var STARTER = [
  ["Curriculum in elementary and middle school", "Elem. & middle curriculum"],
  ["Curriculum in high school", "High school curriculum"],
  ["Curriculum in universities", "University curriculum"],
  ["How much teachers are paid", "Teacher pay"],
  ["Discrimination/ protected classes (race, gender, etc.)", "Protected classes"],
  ["Driver’s license rules", "Driver’s license rules"],
  ["Highway speeds", "Highway speeds"],
  ["Speeds on local streets", "Local street speeds"],
  ["Obscenity speech codes", "Obscenity speech codes"],
  ["Building codes (such as fire safety and disability accommodations)", "Building codes"],
  ["Building zoning codes", "Zoning codes"],
  ["Workplace safety codes", "Workplace safety codes"],
  ["International Diplomacy", "International diplomacy"],
  ["Privacy laws", "Privacy laws"],
  ["Artificial Intelligence", "Artificial intelligence"],
  ["Police conduct", "Police conduct"],
  ["Rights for those arrested/ prisoners", "Arrestee & prisoner rights"],
  ["Immigration rules", "Immigration rules"],
  ["Income taxes", "Income taxes"],
  ["Corporate taxes", "Corporate taxes"],
  ["Health insurance regulations", "Health insurance regs"],
  ["Car insurance regulations", "Car insurance regs"],
  ["Border Control", "Border control"],
  ["Responses to homelessness", "Homelessness responses"],
  ["Drug and alcohol regulations", "Drug & alcohol regs"],
  ["Voter rights", "Voter rights"],
  ["Voting age", "Voting age"],
  ["Election management", "Election management"],
  ["Hair stylist licensure", "Hair stylist licensure"],
  ["Teacher licensure", "Teacher licensure"],
  ["Environmental protection", "Environmental protection"]
];
function casesFromArr(a){return a.map(function(r,i){var full=r[0],sh=(r[1]||"").trim()||(full.length>26?full.slice(0,25)+"…":full);return {id:"c"+i+"_"+full.length,title:full,short:sh}})}

/* ---------- Poller Crowd characters ---------- */
var PUNS=["The Ice Ice Maybes","Snow Problem","The Slope Opera","The Ski Bills","Ski-Partisans","Powder to the People","Mogul Majority","The Downhill Docket","Black Diamond Caucus","The Gondola Governors","Fresh Powder Policy","Checks & Chairlifts","The Avalanche of Laws","Après-Ski Amendments","Lift Legislators","The Bunny Slope Bureau","Federal Flurries","The Snowcial Contract"];
function randPun(){return PUNS[Math.floor(Math.random()*PUNS.length)]}
var KINDS=["penguin","polarbear","snowman","fox","owl","whale","seal","narwhal","snowball","iceberg"];
var NAMES={iceberg:"Iceberg",snowball:"Snowball",snowman:"Snowman",penguin:"Penguin",whale:"Whale",narwhal:"Narwhal",seal:"Seal pup",polarbear:"Polar bear",fox:"Arctic fox",owl:"Snowy owl"};
var LOOKS=["none","beanie","sunglasses","glasses","beard"];
var RIDES=["none","skis","snowboard","snowshoes","snowmobile"];
function rideSVG(r,c3){
  if(r==="skis")return '<path d="M30 60 L18 110 M90 60 L102 110" stroke="#7D8AA0" stroke-width="3" stroke-linecap="round"/><circle cx="18" cy="108" r="3.5" fill="none" stroke="#7D8AA0" stroke-width="2"/><circle cx="102" cy="108" r="3.5" fill="none" stroke="#7D8AA0" stroke-width="2"/>'+
    '<path d="M4 103 H104 Q113 103 115 95 Q118 102 113 107 H6 Q2 107 2 105 Q2 103 4 103 Z" fill="'+c3+'" '+SK+'/><path d="M10 110 H98 Q107 110 109 102 Q112 109 107 114 H12 Q8 114 8 112 Q8 110 10 110 Z" fill="'+c3+'" '+SK+'/>';
  if(r==="snowboard")return '<rect x="6" y="104" width="108" height="12" rx="6" fill="'+c3+'" '+SK+'/><path d="M14 110 H106" stroke="#FFFFFF" stroke-width="2.5" opacity=".7"/><rect x="34" y="98" width="13" height="8" rx="2" fill="#1B2440"/><rect x="73" y="98" width="13" height="8" rx="2" fill="#1B2440"/>';
  if(r==="snowshoes")return ['36','84'].map(function(x){return '<ellipse cx="'+x+'" cy="109" rx="19" ry="8" fill="#FFFFFF" stroke="'+c3+'" stroke-width="4"/><path d="M'+(x-12)+' 109 H'+(+x+12)+' M'+(x-6)+' 103 V115 M'+x+' 102 V116 M'+(+x+6)+' 103 V115" stroke="#1B2440" stroke-width="1.4" opacity=".6"/>'}).join("");
  if(r==="snowmobile")return '<rect x="14" y="104" width="62" height="12" rx="6" fill="#1B2440"/><circle cx="24" cy="110" r="3" fill="#7D8AA0"/><circle cx="45" cy="110" r="3" fill="#7D8AA0"/><circle cx="66" cy="110" r="3" fill="#7D8AA0"/>'+
    '<path d="M74 116 H108 Q116 116 117 108" stroke="#1B2440" stroke-width="3.5" fill="none" stroke-linecap="round"/>'+
    '<path d="M6 100 Q8 86 30 86 L84 86 Q104 86 114 98 L114 102 Q114 106 108 106 L12 106 Q6 106 6 100 Z" fill="'+c3+'" '+SK+'/><path d="M16 96 H92" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity=".8"/>'+
    '<path d="M92 86 L101 70 L108 72 L104 90 Z" fill="#BFE3FA" stroke="#1B2440" stroke-width="2" stroke-linejoin="round"/>';
  return "";
}
var PAL={
  iceberg:[["#DFF3FF","#FFFFFF","#5FB6EC"],["#C9F2E9","#F2FFFC","#2FA88A"],["#E4DBFF","#F7F3FF","#8B78C9"],["#FFE3D6","#FFF6F0","#F08A5D"]],
  snowball:[["#F4FAFF","#D6E9F7","#E8524A"],["#F4FAFF","#D6E9F7","#3A97DA"],["#F4FAFF","#D6E9F7","#2FA88A"],["#F4FAFF","#D6E9F7","#FFB547"]],
  snowman:[["#FFFFFF","#2A3550","#E8524A"],["#FFFFFF","#6A58A8","#FFB547"],["#FFFFFF","#1E66A6","#6EE7A8"],["#FFFFFF","#B4436C","#9FD3F5"]],
  penguin:[["#24304D","#FFFFFF","#FFB547"],["#2F4F7A","#F2F8FF","#FF8A3D"],["#4B3B7A","#FFF7F0","#F5C542"],["#1F5C5C","#F0FFFB","#FF9F6E"]],
  whale:[["#3A7BD5","#BFE3FA","#9FD3F5"],["#5A6FD6","#D8DEFF","#B8C2FF"],["#2FA88A","#C8F2E6","#9FE8D4"],["#7A5BC9","#E3D8FF","#C9B8FF"]],
  narwhal:[["#7E9CC0","#C9DAEE","#FFF4D6"],["#8FB6A9","#D6EEE6","#FFF4D6"],["#B08FC0","#E6D6EE","#FFF4D6"],["#C0A07E","#EEE0CF","#FFFFFF"]],
  seal:[["#C9D3E0","#EEF3F8","#3A4560"],["#E8D9C9","#FBF4EC","#5A4535"],["#CFE6F7","#F2FAFF","#2A4A72"],["#E0D3EC","#F7F2FB","#4A3A60"]],
  polarbear:[["#FFFFFF","#EAF3FA","#5FB6EC"],["#FFFFFF","#EAF3FA","#FF8FB1"],["#FFF8EC","#F3EADB","#2FA88A"],["#F4F4FF","#E6E8F7","#FFB547"]],
  fox:[["#E7EEF6","#FFFFFF","#9FD3F5"],["#FFFFFF","#EAF3FA","#FFB3C7"],["#F2E3D0","#FFFFFF","#E8A27A"],["#DCD3EE","#FFFFFF","#B39DDB"]],
  owl:[["#FFFFFF","#7D8AA0","#FFC93C"],["#F3F7FF","#5FB6EC","#FFC93C"],["#FFF7F0","#C98B5A","#FFB547"],["#F4F0FF","#8B78C9","#7EE8C8"]]
};
var AN={
  iceberg:{e:[60,70,1],b:[60,78,1],h:[58,40,.75]}, snowball:{e:[60,70,1],b:[60,78,1],h:[60,46,1.2]},
  snowman:{e:[60,44,.8],b:[60,57,.75],h:[60,30,.85]}, penguin:{e:[60,56,1],b:[60,71,1],h:[60,32,1]},
  whale:{e:[46,66,1],b:[46,77,.9],h:[54,46,.9]}, narwhal:{e:[60,66,1],b:[60,75,1],h:[60,40,1.05]},
  seal:{e:[60,60,1.4],b:[60,84,1.1],h:[60,40,1.1]}, polarbear:{e:[60,60,1.4],b:[60,86,1.1],h:[60,34,1.15]},
  fox:{e:[60,60,1.4],b:[60,88,1],h:[60,42,1.2]}, owl:{e:[60,56,1.4],b:[60,74,1],h:[60,32,1.05]}
};
var K="#1B2440", SK='stroke="'+K+'" stroke-width="3" stroke-linejoin="round"';
function eye(x,y,r){return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+K+'"/><circle cx="'+(x+1.8)+'" cy="'+(y-1.8)+'" r="1.7" fill="#FFFFFF"/>'}
function blush(x,y){return '<ellipse cx="'+x+'" cy="'+y+'" rx="5" ry="3" fill="#FF8FA3" opacity="0.6"/>'}
function smile(d){return '<path d="'+d+'" stroke="'+K+'" stroke-width="2.5" fill="none" stroke-linecap="round"/>'}
var BODY={
  iceberg:function(a,b,c){return '<path d="M18 104 L30 58 L44 46 L58 20 L72 40 L86 36 L102 104 Z" fill="'+a+'" '+SK+'/><path d="M58 20 L72 40 L64 54 L52 44 Z" fill="'+b+'"/>'+eye(50,70,5)+eye(70,70,5)+blush(42,79)+blush(78,79)+smile("M55 78 Q60 83 65 78")+'<path d="M8 102 Q20 94 32 102 T56 102 T80 102 T104 102 T116 102 V116 H8 Z" fill="'+c+'" '+SK+'/>'},
  snowball:function(a,b,c,h){return '<circle cx="60" cy="68" r="40" fill="'+a+'" '+SK+'/><circle cx="34" cy="84" r="4" fill="'+b+'"/><circle cx="86" cy="62" r="3" fill="'+b+'"/><circle cx="80" cy="92" r="5" fill="'+b+'"/><g opacity="'+h+'"><path d="M26 46 Q30 18 60 16 Q90 18 94 46 Q60 38 26 46 Z" fill="'+c+'" '+SK+'/><path d="M25 44 Q60 34 95 44 L96 52 Q60 42 24 52 Z" fill="'+b+'" '+SK+'/><circle cx="60" cy="14" r="8" fill="'+b+'" '+SK+'/></g>'+eye(50,70,5)+eye(70,70,5)+blush(42,79)+blush(78,79)+smile("M55 78 Q60 83 65 78")},
  snowman:function(a,b,c,h){return '<circle cx="60" cy="94" r="23" fill="'+a+'" '+SK+'/><circle cx="60" cy="88" r="3" fill="'+K+'"/><circle cx="60" cy="100" r="3" fill="'+K+'"/><circle cx="60" cy="48" r="23" fill="'+a+'" '+SK+'/><path d="M70 72 L78 92 L67 91 L63 74 Z" fill="'+c+'" '+SK+'/><path d="M38 64 Q60 74 82 64 L82 72 Q60 82 38 72 Z" fill="'+c+'" '+SK+'/><g opacity="'+h+'"><rect x="36" y="25" width="48" height="7" rx="3" fill="'+b+'" '+SK+'/><rect x="44" y="5" width="32" height="21" rx="3" fill="'+b+'" '+SK+'/><rect x="45.5" y="18" width="29" height="5" fill="'+c+'"/></g>'+eye(52,44,4)+eye(68,44,4)+'<path d="M60 50 L75 53 L60 56 Z" fill="#FF8A3D" stroke="'+K+'" stroke-width="2" stroke-linejoin="round"/>'+blush(44,54)+blush(76,54)+smile("M56 59 Q60 64 64 59")},
  penguin:function(a,b,c){return '<ellipse cx="24" cy="74" rx="8" ry="20" transform="rotate(20 24 74)" fill="'+a+'" '+SK+'/><ellipse cx="96" cy="74" rx="8" ry="20" transform="rotate(-20 96 74)" fill="'+a+'" '+SK+'/><ellipse cx="48" cy="108" rx="10" ry="5" fill="'+c+'" '+SK+'/><ellipse cx="72" cy="108" rx="10" ry="5" fill="'+c+'" '+SK+'/><ellipse cx="60" cy="64" rx="36" ry="44" fill="'+a+'" '+SK+'/><ellipse cx="60" cy="80" rx="24" ry="26" fill="'+b+'"/><path d="M36 56 Q36 34 60 46 Q84 34 84 56 Q84 74 60 74 Q36 74 36 56 Z" fill="'+b+'"/>'+eye(50,56,5)+eye(70,56,5)+blush(42,66)+blush(78,66)+'<path d="M54 63 L66 63 L60 71 Z" fill="'+c+'" stroke="'+K+'" stroke-width="2" stroke-linejoin="round"/>'},
  whale:function(a,b,c){return '<path d="M50 38 Q46 26 38 22 M56 38 V18 M62 38 Q66 26 74 22" stroke="'+c+'" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="36" cy="18" r="3.5" fill="'+c+'"/><circle cx="56" cy="12" r="3.5" fill="'+c+'"/><circle cx="76" cy="18" r="3.5" fill="'+c+'"/><path d="M92 70 Q104 58 112 46 Q116 62 106 74 Q114 84 112 94 Q100 84 92 80 Z" fill="'+a+'" '+SK+'/><path d="M10 76 Q10 42 54 42 Q96 42 98 74 Q98 98 66 98 L36 98 Q10 98 10 76 Z" fill="'+a+'" '+SK+'/><path d="M16 84 Q28 96 48 96 L68 96 Q90 94 93 82 Q58 92 16 84 Z" fill="'+b+'"/>'+eye(36,66,4.5)+eye(56,66,4.5)+blush(28,75)+blush(64,75)+smile("M41 74 Q46 79 51 74")},
  narwhal:function(a,b,c){return '<path d="M57 32 L62 2 L67 32 Z" fill="'+c+'" stroke="'+K+'" stroke-width="2" stroke-linejoin="round"/><path d="M59 24 L65 21 M60 15 L64 12" stroke="'+K+'" stroke-width="1.5"/><ellipse cx="22" cy="94" rx="12" ry="6" transform="rotate(-25 22 94)" fill="'+a+'" '+SK+'/><ellipse cx="98" cy="94" rx="12" ry="6" transform="rotate(25 98 94)" fill="'+a+'" '+SK+'/><ellipse cx="60" cy="70" rx="42" ry="38" fill="'+a+'" '+SK+'/><circle cx="36" cy="50" r="5" fill="'+b+'"/><circle cx="86" cy="56" r="6" fill="'+b+'"/><circle cx="28" cy="78" r="4" fill="'+b+'"/><circle cx="92" cy="82" r="4" fill="'+b+'"/><circle cx="74" cy="40" r="3" fill="'+b+'"/><ellipse cx="60" cy="92" rx="24" ry="12" fill="'+b+'" opacity="0.8"/>'+eye(50,66,5)+eye(70,66,5)+blush(42,75)+blush(78,75)+smile("M55 74 Q60 79 65 74")},
  seal:function(a,b,c){return '<ellipse cx="26" cy="100" rx="13" ry="6" transform="rotate(-20 26 100)" fill="'+b+'" '+SK+'/><ellipse cx="94" cy="100" rx="13" ry="6" transform="rotate(20 94 100)" fill="'+b+'" '+SK+'/><ellipse cx="60" cy="70" rx="40" ry="38" fill="'+a+'" '+SK+'/>'+eye(46,60,6)+eye(74,60,6)+blush(36,74)+blush(84,74)+'<ellipse cx="53" cy="80" rx="8" ry="6" fill="'+b+'" stroke="'+K+'" stroke-width="2"/><ellipse cx="67" cy="80" rx="8" ry="6" fill="'+b+'" stroke="'+K+'" stroke-width="2"/><ellipse cx="60" cy="74" rx="5.5" ry="3.8" fill="'+c+'"/><path d="M45 80 L32 78 M45 84 L32 87 M75 80 L88 78 M75 84 L88 87" stroke="'+c+'" stroke-width="1.6" stroke-linecap="round"/>'},
  polarbear:function(a,b,c,h){return '<g opacity="'+h+'"><path d="M28 34 Q60 2 92 34" stroke="'+c+'" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="28" cy="38" r="13" fill="'+c+'" '+SK+'/><circle cx="92" cy="38" r="13" fill="'+c+'" '+SK+'/></g><circle cx="60" cy="66" r="40" fill="'+a+'" '+SK+'/><ellipse cx="60" cy="82" rx="18" ry="13" fill="'+b+'" stroke="'+K+'" stroke-width="2"/><ellipse cx="60" cy="76" rx="6" ry="4" fill="'+K+'"/><path d="M60 80 V85 M54 87 Q60 91 66 87" stroke="'+K+'" stroke-width="2.2" fill="none" stroke-linecap="round"/>'+eye(46,60,5)+eye(74,60,5)+blush(36,74)+blush(84,74)},
  fox:function(a,b,c){return '<path d="M22 54 L26 14 L50 38 Z" fill="'+a+'" '+SK+'/><path d="M98 54 L94 14 L70 38 Z" fill="'+a+'" '+SK+'/><path d="M29 44 L30 25 L43 37 Z" fill="'+c+'"/><path d="M91 44 L90 25 L77 37 Z" fill="'+c+'"/><path d="M16 58 Q18 34 60 34 Q102 34 104 58 Q100 86 60 102 Q20 86 16 58 Z" fill="'+a+'" '+SK+'/><path d="M22 64 Q36 92 60 100 Q84 92 98 64 Q80 82 60 82 Q40 82 22 64 Z" fill="'+b+'"/>'+eye(46,60,5)+eye(74,60,5)+blush(36,72)+blush(84,72)+'<ellipse cx="60" cy="84" rx="5" ry="4" fill="'+K+'"/>'+smile("M56 90 Q60 95 64 90")},
  owl:function(a,b,c){return '<path d="M30 36 L33 16 L46 30 Z" fill="'+a+'" '+SK+'/><path d="M90 36 L87 16 L74 30 Z" fill="'+a+'" '+SK+'/><ellipse cx="24" cy="76" rx="9" ry="22" fill="'+a+'" '+SK+'/><ellipse cx="96" cy="76" rx="9" ry="22" fill="'+a+'" '+SK+'/><ellipse cx="60" cy="68" rx="38" ry="44" fill="'+a+'" '+SK+'/><path d="M40 90 l4 4 l4 -4 M56 98 l4 4 l4 -4 M72 90 l4 4 l4 -4 M48 80 l4 4 l4 -4 M64 80 l4 4 l4 -4" stroke="'+b+'" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="46" cy="56" r="11" fill="'+c+'" stroke="'+K+'" stroke-width="2"/><circle cx="74" cy="56" r="11" fill="'+c+'" stroke="'+K+'" stroke-width="2"/>'+eye(46,56,5.5)+eye(74,56,5.5)+blush(34,70)+blush(86,70)+'<path d="M55 66 L65 66 L60 74 Z" fill="#FFB547" stroke="'+K+'" stroke-width="2" stroke-linejoin="round"/>'}
};
function avatarInner(p){
  var kind=PAL[p.kind]?p.kind:"penguin", v=((p.variant||0)%4+4)%4, pal=PAL[kind][v], an=AN[kind], look=p.look||"none";
  var out=BODY[kind](pal[0],pal[1],pal[2],look==="beanie"?0:1);
  var e=an.e,b=an.b,h=an.h;
  if(look==="beanie") out+='<g transform="translate('+h[0]+' '+h[1]+') scale('+h[2]+')"><path d="M-28 2 Q-28 -30 0 -32 Q28 -30 28 2 Z" fill="'+pal[2]+'" '+SK+'/><path d="M-14 -3 V-24 M0 -3 V-30 M14 -3 V-24" stroke="'+K+'" stroke-opacity="0.25" stroke-width="2.5" fill="none"/><rect x="-31" y="-5" width="62" height="11" rx="5" fill="'+pal[1]+'" stroke="'+K+'" stroke-width="3"/><circle cx="0" cy="-34" r="7" fill="'+pal[1]+'" stroke="'+K+'" stroke-width="3"/></g>';
  if(look==="sunglasses") out+='<g transform="translate('+e[0]+' '+e[1]+') scale('+e[2]+')"><path d="M-22 -6 H22" stroke="'+K+'" stroke-width="2.5" stroke-linecap="round"/><path d="M-20 -6 H-3 V2 Q-3 8 -11.5 8 Q-20 8 -20 2 Z" fill="'+K+'"/><path d="M3 -6 H20 V2 Q20 8 11.5 8 Q3 8 3 2 Z" fill="'+K+'"/><path d="M-16 -3 L-12 -3 M7 -3 L11 -3" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity="0.85"/></g>';
  if(look==="glasses") out+='<g transform="translate('+e[0]+' '+e[1]+') scale('+e[2]+')"><circle cx="-10" cy="0" r="8.5" fill="#FFFFFF" fill-opacity="0.2" stroke="'+K+'" stroke-width="2.5"/><circle cx="10" cy="0" r="8.5" fill="#FFFFFF" fill-opacity="0.2" stroke="'+K+'" stroke-width="2.5"/><path d="M-2 -1 Q0 -3 2 -1 M-18.5 -1 L-24 -3 M18.5 -1 L24 -3" stroke="'+K+'" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>';
  if(look==="beard") out+='<g transform="translate('+b[0]+' '+b[1]+') scale('+b[2]+')"><path d="M-18 0 Q-22 22 0 30 Q22 22 18 0 Q9 7 0 4 Q-9 7 -18 0 Z" fill="#F4FAFF" stroke="'+K+'" stroke-width="3" stroke-linejoin="round"/><path d="M-12 1 Q-6 -4 0 1 Q6 -4 12 1 Q6 5 0 3 Q-6 5 -12 1 Z" fill="#DCEBF7" stroke="'+K+'" stroke-width="2" stroke-linejoin="round"/></g>';
  var ride=p.ride||"none";
  if(ride!=="none"){
    var lift=ride==="snowmobile"?"translate(60 0) scale(.86) translate(-60 0)":"translate(60 0) scale(.84) translate(-60 0)";
    out='<g transform="'+lift+'">'+out+'</g>';
    if(ride==="skis"){var sk=rideSVG(ride,pal[2]);var poles=sk.slice(0,sk.indexOf('<path d="M4 103'));out=poles+out+sk.slice(sk.indexOf('<path d="M4 103'))}
    else out+=rideSVG(ride,pal[2]);
  }
  return out;
}
function avatarSVG(p,size){return '<svg xmlns="http://www.w3.org/2000/svg" width="'+size+'" height="'+size+'" viewBox="0 0 120 120" role="img" aria-label="'+esc(NAMES[p.kind]||"")+'">'+avatarInner(p)+'</svg>'}
function avatarAt(p,x,y,s,extra){return '<g transform="translate('+(x-s/2).toFixed(1)+' '+(y-s/2).toFixed(1)+') scale('+(s/120).toFixed(4)+')"'+(extra||"")+'>'+avatarInner(p)+'</g>'}

function $(s){return document.querySelector(s)}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
function lvl(y){return y<1/3?"Federal":y<2/3?"State":"Local"}
function lean(x){return x<.2?"Very precise":x<.4?"Leans precise":x<=.6?"Middle ground":x<=.8?"Leans flexible":"Very flexible"}
function avgOf(marks){var n=0,sx=0,sy=0;marks.forEach(function(m){if(m){n++;sx+=m.x;sy+=m.y}});return n?{x:sx/n,y:sy/n}:null}
function spreadOf(marks){var a=avgOf(marks);if(!a)return 0;var n=0,s=0;marks.forEach(function(m){if(m){n++;s+=Math.hypot(m.x-a.x,m.y-a.y)}});return n?s/n:0}
function agreeLabel(marks){var n=marks.filter(Boolean).length;if(n<2)return "Solo pick";var s=spreadOf(marks);return s<.07?"Tight pack":s<.16?"Some spread":"Big debate"}
function slug(s){return (s||"group").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,40)||"group"}
function ask(msg,yes,fn){$("#dlgMsg").textContent=msg;$("#dlgYes").textContent=yes;$("#dlg").classList.remove("hidden");$("#dlgYes").onclick=function(){$("#dlg").classList.add("hidden");fn()};$("#dlgNo").onclick=function(){$("#dlg").classList.add("hidden")}}
var toastT;function toast(m){var t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(toastT);toastT=setTimeout(function(){t.classList.remove("show")},2400)}

/* ---------- board ---------- */
var B={W:1000,H:640,x0:130,x1:968,y0:34,y1:556};
function PX(x){return B.x0+x*(B.x1-B.x0)}
function PY(y){return B.y0+y*(B.y1-B.y0)}
function boardBase(p){
  var x0=B.x0,x1=B.x1,y0=B.y0,y1=B.y1,w=x1-x0,h=y1-y0,t1=PY(1/3),t2=PY(2/3);
  var s='<defs>'+
    '<linearGradient id="'+p+'sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E4F0FA"/><stop offset=".45" stop-color="#F6FAFD"/><stop offset="1" stop-color="#FFFFFF"/></linearGradient>'+
    '<linearGradient id="'+p+'ridge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CFE2F3"/><stop offset="1" stop-color="#EAF3FA"/></linearGradient>'+
    '<filter id="'+p+'sh" x="-20%" y="-30%" width="140%" height="170%"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#1B2440" flood-opacity=".16"/></filter>'+
    '<clipPath id="'+p+'clip"><rect x="'+x0+'" y="'+y0+'" width="'+w+'" height="'+h+'" rx="14"/></clipPath>'+
  '</defs>';
  s+='<rect width="1000" height="640" fill="#FFFFFF"/>';
  s+='<g clip-path="url(#'+p+'clip)">';
  s+='<rect x="'+x0+'" y="'+y0+'" width="'+w+'" height="'+h+'" fill="url(#'+p+'sky)"/>';
  // far ridge
  s+='<path d="M130 250 L200 160 L250 196 L340 82 L410 160 L470 120 L548 52 L620 136 L690 96 L770 166 L842 86 L910 150 L968 118 L968 556 L130 556 Z" fill="url(#'+p+'ridge)" opacity=".85"/>';
  // snow caps
  s+='<path d="M548 52 L526 82 L538 78 L548 90 L558 76 L572 84 Z" fill="#FFFFFF"/><path d="M340 82 L320 108 L332 104 L342 114 L352 102 L364 108 Z" fill="#FFFFFF"/><path d="M842 86 L824 110 L836 106 L846 116 L854 104 L866 110 Z" fill="#FFFFFF"/>';
  // front slope
  s+='<path d="M130 300 Q300 232 470 276 T810 246 Q900 236 968 262 L968 556 L130 556 Z" fill="#FFFFFF"/>';
  s+='<path d="M130 300 Q300 232 470 276 T810 246 Q900 236 968 262" fill="none" stroke="#D6E6F3" stroke-width="2"/>';
  // ski tracks
  s+='<g fill="none" stroke="#E3EEF7" stroke-width="3" stroke-linecap="round"><path d="M260 300 Q300 360 250 410 T300 520"/><path d="M268 300 Q308 360 258 410 T308 520"/><path d="M690 270 Q640 330 700 390 T650 520"/><path d="M698 270 Q648 330 708 390 T658 520"/></g>';
  // trees
  function tree(x,y,sc){return '<g transform="translate('+x+' '+y+') scale('+sc+')" opacity=".55"><path d="M0 -26 L10 -8 L5 -8 L13 6 L-13 6 L-5 -8 L-10 -8 Z" fill="#9DC5B0"/><rect x="-2" y="6" width="4" height="6" fill="#B9A58E"/></g>'}
  s+=tree(158,540,1)+tree(180,546,.8)+tree(944,540,1)+tree(922,548,.75)+tree(902,544,.6);
  s+='</g>';
  // bands
  s+='<g stroke="#A9C9E4" stroke-width="1.6" stroke-dasharray="7 7"><line x1="'+x0+'" y1="'+t1+'" x2="'+x1+'" y2="'+t1+'"/><line x1="'+x0+'" y1="'+t2+'" x2="'+x1+'" y2="'+t2+'"/></g>';
  s+='<line x1="'+PX(.5)+'" y1="'+y0+'" x2="'+PX(.5)+'" y2="'+y1+'" stroke="#A9C9E4" stroke-width="1.6" stroke-dasharray="7 7"/>';
  s+='<rect x="'+x0+'" y="'+y0+'" width="'+w+'" height="'+h+'" rx="14" fill="none" stroke="#C9DCEC" stroke-width="1.6"/>';
  // left trail signs
  var bands=[["FEDERAL",PY(1/6),'<path d="M0 -15 L15 0 L0 15 L-15 0 Z" fill="#1B2440"/>'],["STATE",PY(.5),'<rect x="-12" y="-12" width="24" height="24" fill="#1E66A6"/>'],["LOCAL",PY(5/6),'<circle r="13" fill="#2E9A5B"/>']];
  bands.forEach(function(b){
    s+='<g transform="translate(64 '+(b[1]-12)+')"><rect x="-62" y="-30" width="124" height="86" rx="12" fill="#FFFFFF" stroke="#D6E4F0" stroke-width="1.5"/>'+b[2]+'<text y="42" text-anchor="middle" font-family="Avenir Next, Segoe UI, Helvetica, Arial, sans-serif" font-size="20" font-weight="800" letter-spacing="1" fill="#1B2440">'+b[0]+'</text></g>';
  });
  // bottom axis
  var ay=588;
  s+='<g stroke="#1B2440" stroke-width="2.4" fill="none" stroke-linecap="round"><line x1="'+(x0+14)+'" y1="'+ay+'" x2="'+(x1-14)+'" y2="'+ay+'"/><path d="M'+(x0+24)+' '+(ay-8)+' L'+(x0+12)+' '+ay+' L'+(x0+24)+' '+(ay+8)+'"/><path d="M'+(x1-24)+' '+(ay-8)+' L'+(x1-12)+' '+ay+' L'+(x1-24)+' '+(ay+8)+'"/></g>';
  [.25,.5,.75].forEach(function(t){s+='<line x1="'+PX(t)+'" y1="'+(ay-6)+'" x2="'+PX(t)+'" y2="'+(ay+6)+'" stroke="#1B2440" stroke-width="2"/>'});
  var F='font-family="Avenir Next, Segoe UI, Helvetica, Arial, sans-serif"';
  s+='<text x="'+x0+'" y="'+(ay+38)+'" '+F+' font-size="26" font-weight="800" letter-spacing="3" fill="#1B2440">PRECISION</text>';
  s+='<text x="'+x1+'" y="'+(ay+40)+'" text-anchor="end" '+F+' font-size="26" font-weight="800" letter-spacing="3" fill="#1B2440">FLEXIBILITY</text>';
  s+='<text x="'+PX(.5)+'" y="'+(ay+38)+'" text-anchor="middle" '+F+' font-size="20" fill="#62708C">middle ground</text>';
  return s;
}
function overlap(a,b){var x=Math.max(0,Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x)),y=Math.max(0,Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y));return x*y}
function layoutTags(items){
  var placed=[],pts=items.map(function(it){return {x:PX(it.x),y:PY(it.y)}});
  return items.map(function(it,i){
    var X=pts[i].x,Y=pts[i].y,w=Math.round(62+it.label.length*13.2),h=46;
    var c=[[14,-h-10],[14,10],[-w-14,-h-10],[-w-14,10],[-w/2,-h-20],[-w/2,18],[24,-h/2],[-w-24,-h/2],[30,-h-34],[-w-30,-h-34],[30,34],[-w-30,34]];
    var best=null,bs=1e12;
    c.forEach(function(d,k){
      var r={x:X+d[0],y:Y+d[1],w:w,h:h},sc=k*2;
      if(r.x<B.x0+4||r.x+w>B.x1-4||r.y<B.y0+4||r.y+h>B.y1-4)sc+=100000;
      placed.forEach(function(q){sc+=overlap(r,q)});
      pts.forEach(function(p){if(p.x>r.x-8&&p.x<r.x+w+8&&p.y>r.y-8&&p.y<r.y+h+8)sc+=400});
      if(sc<bs){bs=sc;best=r}
    });
    placed.push(best);
    return {it:it,X:X,Y:Y,r:best};
  });
}
function tagSVG(L,p,cls,dim){
  var r=L.r,it=L.it,F='font-family="Avenir Next, Segoe UI, Helvetica, Arial, sans-serif"';
  var lx=Math.max(r.x,Math.min(L.X,r.x+r.w)),ly=Math.max(r.y,Math.min(L.Y,r.y+r.h));
  var rot=((it.n*37)%5-2)*0.9, cx=r.x+r.w/2, cy=r.y+r.h/2;
  return '<g class="'+(cls||"")+'" data-id="'+esc(it.id)+'" opacity="'+(dim?.18:1)+'">'+
    '<line x1="'+L.X+'" y1="'+L.Y+'" x2="'+lx+'" y2="'+ly+'" stroke="#7FA9CF" stroke-width="1.6"/>'+
    '<g transform="rotate('+rot+' '+cx+' '+cy+')">'+
      '<rect x="'+r.x+'" y="'+r.y+'" width="'+r.w+'" height="'+r.h+'" rx="4" fill="#FFFFFF" stroke="#C6D9EA" filter="url(#'+p+'sh)"/>'+
      '<circle cx="'+(r.x+24)+'" cy="'+cy+'" r="16.5" fill="#1B2440"/>'+
      '<text x="'+(r.x+24)+'" y="'+(cy+6.8)+'" text-anchor="middle" '+F+' font-size="19" font-weight="800" fill="#FFFFFF">'+it.n+'</text>'+
      '<text x="'+(r.x+49)+'" y="'+(cy+8.2)+'" '+F+' font-size="23.5" font-weight="700" fill="#1B2440">'+esc(it.label)+'</text>'+
    '</g>'+
    '<circle cx="'+L.X+'" cy="'+L.Y+'" r="7.5" fill="#1B2440" stroke="#FFFFFF" stroke-width="2.5"/>'+
  '</g>';
}
/* opts: pfx, mode('avg'|'orig'), hl, live(bool, show current-turn state), attrs */
function toPNG(o,scale){
  return new Promise(function(res,rej){
    var img=new Image();
    img.onload=function(){
      var c=document.createElement("canvas");c.width=o.w*scale;c.height=o.h*scale;
      var ctx=c.getContext("2d");ctx.fillStyle="#fff";ctx.fillRect(0,0,c.width,c.height);ctx.drawImage(img,0,0,c.width,c.height);
      var dataUrl;try{dataUrl=c.toDataURL("image/png")}catch(e){rej(e);return}
      if(c.toBlob)c.toBlob(function(b){res({blob:b,dataUrl:dataUrl})},"image/png");else res({blob:null,dataUrl:dataUrl});
    };
    img.onerror=rej;
    img.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(o.svg);
  });
}
function dataURLtoBytes(u){var b=atob(u.split(",")[1]),a=new Uint8Array(b.length);for(var i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return a}

/* ---------- generic slope for the live board ----------
   items: [{id,n,label,x,y,marks:[{x,y,p}] }]
   o: {pfx, mode:'avg'|'orig', hl, items, showMarksFor:id, attrs, small} */
function boardSVG(o){
  var p=o.pfx||"b",s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 640" '+(o.attrs||"")+'>'+boardBase(p);
  var F='font-family="Avenir Next, Segoe UI, Helvetica, Arial, sans-serif"',items=o.items||[];
  var totalMarks=0;items.forEach(function(it){totalMarks+=it.marks.length});
  function marksFor(it,size,badge){
    var ax=PX(it.x),ay=PY(it.y),out="";
    it.marks.forEach(function(m){out+='<line x1="'+PX(m.x)+'" y1="'+PY(m.y)+'" x2="'+ax+'" y2="'+ay+'" stroke="#8FB6DA" stroke-width="1.5" stroke-dasharray="4 4"/>'});
    out+='<circle cx="'+ax+'" cy="'+ay+'" r="13" fill="#FFFFFF" stroke="#1B2440" stroke-width="2" stroke-dasharray="3 2"/><text x="'+ax+'" y="'+(ay+5)+'" text-anchor="middle" '+F+' font-size="14" font-weight="800" fill="#1B2440">'+it.n+'</text>';
    it.marks.forEach(function(m){
      var x=PX(m.x),y=PY(m.y);
      out+=avatarAt(m.p,x,y,size);
      if(badge)out+='<circle cx="'+(x+size*.38)+'" cy="'+(y+size*.32)+'" r="10" fill="#FFFFFF" stroke="#1B2440" stroke-width="1.6"/><text x="'+(x+size*.38)+'" y="'+(y+size*.32+4.3)+'" text-anchor="middle" '+F+' font-size="12" font-weight="800" fill="#1B2440">'+it.n+'</text>';
    });
    return out;
  }
  if(o.mode==="orig"){
    var size=totalMarks>120?28:totalMarks>60?34:44;
    items.forEach(function(it){
      var dim=o.hl&&o.hl!==it.id;
      s+='<g opacity="'+(dim?.12:1)+'">'+marksFor(it,size,true)+'</g>';
    });
  } else {
    items.forEach(function(it){if(o.showMarksFor===it.id)s+='<g class="fade">'+marksFor(it,it.marks.length>25?44:58,false)+'</g>'});
    if(items.length>14||o.small){
      items.forEach(function(it){var x=PX(it.x),y=PY(it.y),dim=o.hl&&o.hl!==it.id;
        s+='<g class="'+(it.fresh?"pop":"")+'" opacity="'+(dim?.18:1)+'"><title>'+esc(it.label)+'</title><circle cx="'+x+'" cy="'+y+'" r="17" fill="#1B2440" stroke="#FFFFFF" stroke-width="3" filter="url(#'+p+'sh)"/><text x="'+x+'" y="'+(y+6)+'" text-anchor="middle" '+F+' font-size="17" font-weight="800" fill="#FFFFFF">'+it.n+'</text></g>'});
    } else layoutTags(items).forEach(function(L){s+=tagSVG(L,p,L.it.fresh?"pop":"",o.hl&&o.hl!==L.it.id)});
  }
  return s+'</svg>';
}

/* ---------- saving (PNG / PDF) ---------- */
function makePDFfromImg(img){
  if(!img)return null;
  var c=document.createElement("canvas");c.width=img.naturalWidth;c.height=img.naturalHeight;
  var ctx=c.getContext("2d");ctx.fillStyle="#fff";ctx.fillRect(0,0,c.width,c.height);ctx.drawImage(img,0,0);
  var jpg=dataURLtoBytes(c.toDataURL("image/jpeg",0.92));
  var PW=792,PH=612,M=24,sc=Math.min((PW-2*M)/c.width,(PH-2*M)/c.height),dw=c.width*sc,dh=c.height*sc,dx=(PW-dw)/2,dy=(PH-dh)/2;
  var enc=new TextEncoder(),parts=[],len=0,offs=[];
  function add(x){var u=typeof x==="string"?enc.encode(x):x;parts.push(u);len+=u.length}
  function obj(n,body){offs[n]=len;add(n+" 0 obj\n");body();add("\nendobj\n")}
  add("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");
  obj(1,function(){add("<< /Type /Catalog /Pages 2 0 R >>")});
  obj(2,function(){add("<< /Type /Pages /Kids [3 0 R] /Count 1 >>")});
  obj(3,function(){add("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 "+PW+" "+PH+"] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>")});
  obj(4,function(){add("<< /Type /XObject /Subtype /Image /Width "+c.width+" /Height "+c.height+" /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length "+jpg.length+" >>\nstream\n");add(jpg);add("\nendstream")});
  var cs="q "+dw.toFixed(2)+" 0 0 "+dh.toFixed(2)+" "+dx.toFixed(2)+" "+dy.toFixed(2)+" cm /Im0 Do Q";
  obj(5,function(){add("<< /Length "+cs.length+" >>\nstream\n"+cs+"\nendstream")});
  var xref=len,x="xref\n0 6\n0000000000 65535 f \n";
  for(var i=1;i<=5;i++)x+=String(offs[i]).padStart(10,"0")+" 00000 n \n";
  add(x+"trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n"+xref+"\n%%EOF");
  return new Blob(parts,{type:"application/pdf"});
}
function downloadBlob(blob,name){
  if(!blob){toast("Still printing… try again in a second");return}
  try{
    var url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;a.download=name;a.rel="noopener";document.body.appendChild(a);a.click();a.remove();
    setTimeout(function(){URL.revokeObjectURL(url)},60000);
    toast("Saving "+name+"…");
  }catch(e){toast("Right-click the lift pass and choose Save image as…")}
}

/* ---------- live connection ----------
   Uses the Supabase project in js/config.js (same as Poller Crowd).
   With no Supabase settings, or with ?demo=1, it runs in demo mode:
   the board and "phones" talk inside one browser (tabs of the same site). */
var CFG=window.POLICY_SLOPES_CONFIG||{};
var LIVE_EVENTS=["state","join","place","unplace","hello"];
function isDemo(){return /[?&]demo=1\b/.test(location.search)||!CFG.supabaseUrl||!CFG.supabaseKey||!window.supabase}
function liveConnect(room,onEvent,onStatus){
  if(isDemo()){
    var bc=null;
    try{bc=new BroadcastChannel("policyslopes-"+room)}catch(e){}
    if(bc)bc.onmessage=function(e){if(e.data&&e.data.ev)onEvent(e.data.ev,e.data.p)};
    setTimeout(function(){onStatus(bc?"demo":"down")},0);
    return {demo:true,send:function(ev,p){if(bc)bc.postMessage({ev:ev,p:p})}};
  }
  var sb=window.supabase.createClient(CFG.supabaseUrl,CFG.supabaseKey,{auth:{persistSession:false},realtime:{params:{eventsPerSecond:20}}});
  var ch=sb.channel("policyslopes-"+room,{config:{broadcast:{self:false,ack:false}}});
  LIVE_EVENTS.forEach(function(ev){ch.on("broadcast",{event:ev},function(msg){onEvent(ev,msg.payload)})});
  var ok=false,queue=[];
  ch.subscribe(function(st){
    if(st==="SUBSCRIBED"){ok=true;onStatus("live");var q=queue.splice(0);q.forEach(function(m){ch.send(m)})}
    else if(st==="CHANNEL_ERROR"||st==="TIMED_OUT"||st==="CLOSED"){ok=false;onStatus("down")}
  });
  return {demo:false,send:function(ev,p){var m={type:"broadcast",event:ev,payload:p};if(ok)ch.send(m);else{queue.push(m);if(queue.length>20)queue.shift()}}};
}
function cleanProfile(p){
  p=p||{};
  return {name:String(p.name||"").slice(0,24),kind:KINDS.indexOf(p.kind)>=0?p.kind:"penguin",variant:Math.max(0,Math.min(3,parseInt(p.variant,10)||0)),
    look:LOOKS.indexOf(p.look)>=0?p.look:"none",ride:RIDES.indexOf(p.ride)>=0?p.ride:"none"};
}
var SKI_WORDS=["SNOW","LIFT","PEAK","LODGE","POWDER","MOGUL","SLOPE","ALPINE","CHALET","GLADE","BUNNY","CABIN","COCOA","FLAKE","IGLOO","SLED","TRAIL","SUMMIT","BOOTS","POLES","FROST","PISTE","YETI","CARVE","GROOMER","RIDGE","GOGGLE","PARKA","MITTEN","SKIS"];
function roomCode(){return SKI_WORDS[Math.floor(Math.random()*SKI_WORDS.length)]+(10+Math.floor(Math.random()*90))}
function normRoom(s){return String(s||"").toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,10)}
function fmtRoom(s){s=normRoom(s);var m=s.match(/^([A-Z]+)(\d+)$/);return m?m[1]+"-"+m[2]:s}
function validRoom(s){s=normRoom(s);return /^[A-Z]{3,8}\d{2}$/.test(s)||/^[A-Z]{4}$/.test(s)}
