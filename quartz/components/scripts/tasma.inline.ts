// @ts-nocheck
// Taşma / Polaris — gönderilen kaynak deneyimin Bura uyarlaması.

function setupTasmaExperience(){var root=document.querySelector('[data-tasma-experience]');if(!root||root.dataset.ready==='true')return;root.dataset.ready='true';var lifecycle=new AbortController(),signal=lifecycle.signal,REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches,PH=matchMedia('(pointer:coarse),(max-width:700px)').matches,B=[[[["İşe", 0.812], ["giderken", 0.799], ["otobüste", 0.805], ["uyuyorum.", 0.818], ["Başım", 0.741], ["camda.", 0.753], ["İşten", 0.846], ["dönerken", 0.854], ["de.", 0.838], ["Bugün", 0.698], ["karşımda", 0.72], ["bir", 0.734], ["çocuk", 0.73], ["vardı,", 0.702], ["o", 0.727], ["da", 0.705], ["başını", 0.713], ["cama", 0.709], ["yaslamıştı,", 0.688], ["bana", 0.723], ["bakıp", 0.716], ["ağlamaya", 0.691], ["başladı.", 0.695], ["Cam", 0.886], ["titredikçe", 0.891], ["ağlaması", 0.896], ["da", 0.901], ["titriyordu.", 0.881]], [["Gözlerimi", 0.9], ["şaşı", 0.892], ["yaptım.", 0.908], ["Dilimi", 0.888], ["huni", 0.87], ["şekline", 0.876], ["getirdim.", 0.882], ["Nanik", 0.814], ["yaptım.", 0.826], ["Çapraz", 0.828], ["karşımdaki", 0.822], ["teyze", 0.816], ["güldü.", 0.809], ["Çocuk", 0.802], ["gülmedi.", 0.789]], [["Onu", 0.872], ["güldürmek", 0.865], ["için", 0.855], ["her", 0.876], ["şeyi", 0.869], ["denedim", 0.858], ["oysa.", 0.862]], [["Her", 0.84], ["şeyi", 0.831], ["mi?", 0.823]], [["Değil", 0.724], ["galiba.", 0.737]]], [[["İşe", 0.694], ["başlamadan", 0.687], ["böyle", 0.701], ["şeyler", 0.68], ["yaşanması", 0.715], ["can", 0.708], ["sıkıyor.", 0.673], ["Sabah", 0.808], ["her", 0.813], ["zamanki", 0.803], ["gibi", 0.823], ["toplandık.", 0.818], ["Herkes", 0.885], ["yarım", 0.875], ["ay", 0.87], ["biçiminde", 0.89], ["ayaktaydı.", 0.88], ["Şef", 0.702], ["dünkü", 0.695], ["işlerden", 0.674], ["ve", 0.688], ["bugün", 0.667], ["yapılacaklardan", 0.659], ["bahsediyordu.", 0.681], ["Çizelgeler", 0.716], ["dalgalanıyordu", 0.703], ["elindeki", 0.71], ["tabloda.", 0.722], ["Köşeye", 0.746], ["iliştirilmiş", 0.779], ["gülen", 0.757], ["suratlı", 0.79], ["sarı", 0.774], ["bir", 0.752], ["güneş", 0.768], ["bile", 0.785], ["vardı.", 0.763], ["Öğlene", 0.736], ["kadar", 0.746], ["güneş", 0.726], ["göremeyeceğim", 0.731], ["sonuçta.", 0.741], ["Telefonum", 0.816], ["ara", 0.801], ["sıra", 0.831], ["eski", 0.826], ["fotoğrafları", 0.806], ["gösteriyor,", 0.821], ["tamamen", 0.796], ["nasıl", 0.791], ["kapatıldığını", 0.811], ["öğrenemedim.", 0.836], ["Bir", 0.766], ["yıl", 0.753], ["önce", 0.747], ["bugün.", 0.76], ["Geçen", 0.793], ["ay", 0.798], ["bugün,", 0.828], ["geçen", 0.808], ["kıştan", 0.803], ["ya", 0.818], ["da", 0.783], ["yedi-sekiz", 0.823], ["ay", 0.788], ["öncesinden.", 0.813], ["Ben", 0.694], ["istemeden", 0.709], ["küçük", 0.669], ["sergiler", 0.684], ["açıyor,", 0.674], ["ben", 0.689], ["kapatıyorum,", 0.699], ["o", 0.714], ["tekrar", 0.679], ["açıyor.", 0.704], ["Bu", 0.781], ["konuda", 0.768], ["telefonum", 0.777], ["benden", 0.789], ["daha", 0.785], ["ısrarlı.", 0.773], ["Bizim", 9], ["bir", 9], ["fotoğrafımız", 9], ["yok.", 9], ["Uzun", 0.624], ["süre", 0.658], ["bunun", 0.651], ["iyi", 0.632], ["bir", 0.635], ["şey", 0.616], ["olduğunu", 0.662], ["düşündüm,", 0.62], ["telefonun", 0.643], ["beni", 0.639], ["hazırlıksız", 0.628], ["yakalayamayacağını", 0.647], ["yani.", 0.654], ["Gerçi", 0.636], ["hazırlıksız", 0.643], ["yakalanmak", 0.664], ["için", 0.679], ["fotoğrafa", 0.65], ["ihtiyacım", 0.657], ["yok.", 0.672], ["Yüzünü", 0.687], ["hatırlıyorum,", 0.683], ["en", 0.691], ["azından", 0.65], ["hatırladığımı", 0.675], ["düşünüyorum,", 0.67], ["bu", 0.666], ["ikisi", 0.679], ["arasındaki", 0.662], ["fark", 0.695], ["da", 0.654], ["ayrı.", 0.658], ["Ne", 0.829], ["fotoğrafımız", 0.848], ["var", 0.811], ["ne", 0.817], ["de", 0.842], ["senin", 0.805], ["bir", 0.836], ["fotoğrafın.", 0.823], ["Ama", 0.666], ["gönderilmek", 0.655], ["üzere", 0.683], ["çekilmiş", 0.644], ["fotoğraflar", 0.661], ["birikmiş", 0.672], ["bu", 0.677], ["sefer", 0.65], ["de.", 0.639], ["Fotoğrafın", 0.654], ["neden", 0.611], ["orada", 0.647], ["olduğu", 0.618], ["problemli", 0.64], ["bir", 0.625], ["mesele.", 0.633], ["Fotoğraf", 0.816], ["tek", 0.821], ["başına", 0.811], ["da", 0.846], ["güzel,", 0.851], ["gönderilmek", 0.836], ["için", 0.806], ["çekildiğini", 0.826], ["bilmese", 0.831], ["de.", 0.841], ["Gönderilmemiş", 0.866], ["mesajlar", 0.878], ["da", 0.86], ["öyle.", 0.872], ["Yazıp", 0.638], ["göndermediğimi", 0.631], ["silebiliyorum,", 0.617], ["hiç", 0.603], ["yazmadığımı", 0.596], ["silemiyorum", 0.61], ["gerçi.", 0.624], ["Orası", 0.732], ["sınırsız", 0.726], ["bir", 0.719], ["depo.", 0.738], ["Geçen", 0.922], ["hafta", 0.91], ["sana", 0.914], ["bir", 0.927], ["köpek", 0.918], ["göndermedim.", 0.906], ["Marketin", 0.679], ["önünde", 0.688], ["sarı", 0.696], ["yağmurluklu,", 0.712], ["yağmur", 0.704], ["yağmıyordu.", 0.671], ["Bunu", 9], ["görsen", 9], ["gülerdin", 9], ["diye", 9], ["düşündüm.", 9], ["Sonra", 0.84], ["neden", 0.858], ["güleceğini", 0.846], ["düşündüm.", 0.852], ["Bilmiyorum,", 9], ["belki", 9], ["gülmezdin.", 9]], [["Ben", 0.785], ["gülersem", 0.792], ["Shrek", 0.789], ["yapma", 0.796], ["ihtimalin", 0.799], ["de", 0.807], ["vardı.", 0.803]]], [[["“Anlaşıldı", 0.895], ["mı?”", 0.883], ["dedi", 0.826], ["şef.", 0.814]], [["“Evet.”", 0.768]], [["Toplantı", 0.732], ["bitti.", 0.72], ["İşe", 0.763], ["başladık.", 0.751]], [["Öğle", 0.821], ["arasında", 0.809], ["dışarı", 0.815], ["çıktım.", 0.828], ["Sis", 0.791], ["her", 0.781], ["yeri", 0.788], ["kaplamış,", 0.802], ["yağmur", 0.795], ["da", 0.799], ["başlamıştı.", 0.784], ["Öğleden", 0.865], ["sonra", 0.871], ["da", 0.883], ["çalıştık.", 0.877], ["Saat", 0.826], ["altıda", 0.817], ["paydos.", 0.809]], [["Dönüşte", 0.805], ["otobüste", 0.789], ["uyudum.", 0.797], ["Evde", 0.847], ["artık", 0.855], ["uyuyamıyorum.", 0.839], ["Otobüste", 0.712], ["ne", 0.692], ["kadar", 0.672], ["kalabalık", 0.682], ["olursa", 0.707], ["o", 0.702], ["kadar", 0.677], ["iyi,", 0.687], ["evde", 0.697], ["olmuyor.", 0.717]], [["Gece", 0.841], ["yarısını", 0.855], ["geçince", 0.848], ["revani", 0.834], ["yapmaya", 0.813], ["karar", 0.82], ["verdim.", 0.827]], [["00.12", 0.476], ["revani", 0.497], ["tarifi", 0.487]], [["00.14", 0.445], ["tek", 0.452], ["kişilik", 0.46], ["revani", 0.468]], [["00.16", 0.47], ["revani", 0.454], ["yarım", 0.462], ["tarif", 0.477]], [["00.19", 0.485], ["yarım", 0.472], ["yumurta", 0.491], ["nasıl", 0.466], ["yapılır", 0.478]], [["00.31", 0.443], ["revani", 0.452], ["şerbeti", 0.465], ["sıcak", 0.439], ["mı", 0.456], ["soğuk", 0.461], ["mu", 0.448]], [["00.58", 0.447], ["revani", 0.437], ["kaç", 0.442], ["gün", 0.432], ["dolapta", 0.421], ["durur", 0.426]], [["Yarım", 0.791], ["yumurtanın", 0.783], ["nasıl", 0.808], ["yapılacağını", 0.799], ["gerçekten", 0.775], ["araştırdım.", 0.816], ["Bunu", 0.921], ["nedense", 0.928], ["hile", 0.909], ["sandım.", 0.915]], [["Revaniyi", 0.769], ["yapmadım.", 0.757]], [["Bir", 0.871], ["süre", 0.877], ["mutfakta", 0.883], ["oturdum.", 0.865], ["Sonra", 0.777], ["banyoya", 0.76], ["gittim.", 0.768], ["Aynada", 0.799], ["su", 0.805], ["lekeleri", 0.786], ["vardı.", 0.793], ["Tek", 0.903], ["tek", 0.912], ["sildim.", 0.92], ["Uzaktan", 0.746], ["kontrol", 0.729], ["ettim.", 0.737], ["Birkaç", 0.857], ["tane", 0.853], ["kalmıştı,", 0.841], ["onları", 0.845], ["da", 0.849], ["sildim.", 0.837], ["Yüzümü", 0.861], ["yıkadım,", 0.855], ["aynaya", 0.842], ["baktım.", 0.849], ["Bir", 0.76], ["süre", 0.753], ["öyle", 0.747], ["durdum.", 0.766], ["Sonra", 0.818], ["ışığı", 0.834], ["kapattım.", 0.826]], [["Ertesi", 0.903], ["sabah", 0.918], ["otobüste", 0.913], ["yine", 0.908], ["uyudum.", 0.898], ["Başımı", 0.709], ["bu", 0.73], ["kez", 0.713], ["cama", 0.721], ["yaslamamaya", 0.726], ["çalıştım.", 0.717], ["İki", 0.913], ["durak", 0.919], ["sonra", 0.901], ["camdaydı.", 0.907]], [["İş", 0.875], ["çıkışı", 0.893], ["markete", 0.887], ["uğradım.", 0.881], ["Yumurta", 0.862], ["aldım,", 0.85], ["tam", 0.869], ["fiyatına.", 0.856], ["Yarım", 0.856], ["yumurta", 0.837], ["diye", 0.862], ["bir", 0.831], ["şey", 0.825], ["satmıyorlar,", 0.85], ["haklı", 0.844], ["olarak.", 0.868]], [["Eve", 0.881], ["gelince", 0.9], ["revaniyi", 0.894], ["yaptım.", 0.888], ["Tarifi", 0.785], ["yarıya", 0.769], ["indirmedim.", 0.777]], [["Kokusu", 0.779], ["yayıldı.", 0.767], ["Pencereyi", 0.853], ["açtım,", 0.824], ["kokunun", 0.817], ["dışarı", 0.838], ["çıkmasına", 0.86], ["yardım", 0.831], ["ettim.", 0.846]], [["Revani", 0.83], ["soğudu.", 0.817], ["Kesmedim.", 0.832]]], [[["Ertesi", 0.711], ["sabah", 0.728], ["işe", 0.715], ["giderken", 0.719], ["yanımda", 0.724], ["götürdüm.", 0.707], ["İş", 0.816], ["yerinde", 0.808], ["bıraktım.", 0.824], ["‘Kim", 0.593], ["isterse", 0.615], ["yesin’", 0.621], ["diye", 0.599], ["bir", 0.604], ["not", 0.626], ["yazmadım,", 0.61], ["sadece", 0.632], ["bıraktım.", 0.637]], [["Akşam", 0.615], ["çıkarken", 0.639], ["baktım,", 0.608], ["ne", 0.621], ["tabak", 0.633], ["vardı", 0.627], ["ne", 0.652], ["revani.", 0.646], ["Bıraktığım", 9], ["yer", 9], ["boştu,", 9], ["tertemiz,", 9], ["sanki", 9], ["hiçbir", 9], ["şey", 9], ["olmamış", 9], ["gibi.", 9]]]],S=PH?[0,.06,.12,.18]:[0,.09,.18,.27],W=PH?.07:.08,EB=PH?.40:.36,LOCKP=.55,DUR=15*60*1000,KEY='bura_tasma_polaris_v1';
var p=0,st=null,words=[],blks=[],fl=document.getElementById('tasma-flow'),im=document.getElementById('tasma-image'),cd=document.getElementById('tasma-countdown'),ph=document.getElementById('tasma-photo');
function ld(){try{return JSON.parse(localStorage.getItem(KEY))}catch(e){return null}}
function sv(o){try{localStorage.setItem(KEY,JSON.stringify(o))}catch(e){}}
function clr(){try{localStorage.removeItem(KEY)}catch(e){}}
B.forEach(function(lines){var b=document.createElement('div');b.className='blk';
 lines.forEach(function(ln){var d=document.createElement('p');d.className='l';
  ln.forEach(function(w){var s=document.createElement('span');s.className='w';s.textContent=w[0];s.dataset.t=w[1];d.appendChild(s);d.appendChild(document.createTextNode(' '));words.push(s)});b.appendChild(d)});
 fl.appendChild(b);blks.push(b)});
var T=[],D=[],G=[],R=[],maxSeen=0,lastSnap=0;
function seen(){maxSeen=Math.max(maxSeen,scrollY+innerHeight)}
addEventListener('scroll',seen,{passive:true,signal:signal});seen();
words.forEach(function(w,i){T[i]=+w.dataset.t;D[i]=1;G[i]=0});
function snap(){lastSnap=Date.now();seen();var tb=document.querySelector('.tasma-top').getBoundingClientRect().bottom,hi=innerHeight,c=(tb+hi)/2,half=Math.max(40,(hi-tb)/2);
 for(var i=0;i<words.length;i++){var r=words[i].getBoundingClientRect(),y=r.top+r.height/2;D[i]=Math.max(0,Math.min(1,(Math.abs(y-c)-.2*half)/(1.5*half)));R[i]=(y+scrollY)<=maxSeen}}
function te(i){var t=T[i];if(t>=9)return 9;if(!R[i])return .86+Math.max(0,Math.min(1,(t-.36)/.62))*.08;var tc=EB+(t-.36)*(PH?.70:.75);return Math.max(EB,tc-.2*(1-D[i]))}
function wr(){var ch=false;
 for(var i=0;i<words.length;i++){var e=te(i),o;
  if(st){if(p>=e&&!G[i]){G[i]=1;ch=true}o=G[i]?(p>=e?Math.max(0,1-(p-e)/.04):0):1}
  else o=p<e?1:Math.max(0,1-(p-e)/.04);
  if(LO[i]===undefined||Math.abs(o-LO[i])>.01){LO[i]=o;words[i].style.opacity=o}}
 if(ch&&st){st.g=[];for(var j=0;j<G.length;j++)if(G[j])st.g.push(j);sv(st)}}
var LO=[],pend=false,renderRaf=null;
function sched(){if(pend)return;pend=true;renderRaf=requestAnimationFrame(function(){pend=false;render()})}
var rg=document.getElementById('tasma-ring'),gr=document.getElementById('tasma-groove'),plain=false,touched=false,demo=false,b0w=[].slice.call(blks[0].querySelectorAll('.w')),L0=[],hs=0;var K0=0,K10=0;(function(){var c=0;b0w.forEach(function(w,i){var t=w.textContent;if(!K0&&t==='ağlamaya')K0=i;if(!K10&&t==='güldü.')K10=i})})();
function calcLines(){var tops=[];b0w.forEach(function(w){var t=w.offsetTop;if(tops.indexOf(t)<0)tops.push(t)});tops.sort(function(a,b){return a-b});var lim=tops[Math.min(2,tops.length-1)];b0w.forEach(function(w,i){L0[i]=w.offsetTop<=lim?1:0})}
calcLines();
function renderRing(){rg.style.left='calc((100% - var(--tasma-ring-width))*'+p+')';rg.setAttribute('aria-valuenow',Math.round(p*100))}
function render(){
 if(plain){im.style.filter='none';im.style.opacity=1;blks.forEach(function(b){b.style.filter='none';b.style.opacity=1});words.forEach(function(w){w.style.opacity=1});gr.classList.remove('done');return}renderRing();
 im.style.filter='blur('+(18*(1-p)*(1-p)).toFixed(1)+'px)';im.style.opacity=(.75+.25*p).toFixed(2);
 var cB=Math.max(0,Math.min(1,p/.05)),cC=Math.max(0,Math.min(1,(p-.07)/.05));blks[0].style.filter='none';blks[0].style.opacity=1;
 b0w.forEach(function(w,i){w.style.filter=i<=K0?'none':'blur('+(7*(1-(i<=K10?cB:cC))).toFixed(1)+'px)'});
 for(var k=1;k<blks.length;k++){var c=Math.max(0,Math.min(1,(p-S[k])/W));
  blks[k].style.filter='blur('+(7*(1-c)).toFixed(1)+'px)';blks[k].style.opacity=(.3+.7*c).toFixed(2)}
 wr();
 gr.classList.toggle('done',!!(st&&p>=0.98));
}
function tick(){
 if(st){var r=st.end-Date.now();
  if(r<=0){st=null;clr();G=G.map(function(){return 0});p=0;render();return}
  var m=Math.floor(r/60000),s=Math.floor(r%60000/1000);cd.textContent=(m<10?'0':'')+m+':'+(s<10?'0':'')+s}
}
function move(d){if(plain)return;

 var f=1;
 if(st){if(d>0){p=Math.min(1,p+d*f);if(p>st.pmax){st.pmax=p;sv(st)}}p=st.pmax}
 else{p=Math.max(0,Math.min(1,p+d*f));if(p>=LOCKP){st={end:Date.now()+DUR,pmax:p};sv(st)}}
 tick();renderRing();sched();
}
var drag=null,moved=0;
var holdT=null,raf=null,demoRaf=null,trembleTimer=null,last=0,HOLD=.12;
function holdStep(t){
 if(!drag||moved>=6){raf=null;return}
 var dt=Math.min(60,t-last)/1000;last=t;
 if(!st&&p>=LOCKP-0.005){raf=requestAnimationFrame(holdStep);return}
 move(((t-hs)<1200?.25:HOLD)*dt);raf=requestAnimationFrame(holdStep)}
function holdStart(){if(!drag||raf)return;last=performance.now();hs=last;if(st||p<LOCKP-.04)move(.03);raf=requestAnimationFrame(holdStep)}
function endDrag(){clearTimeout(holdT);drag=null}
ph.addEventListener('pointerdown',function(e){touch();snap();drag={x:e.clientX,y:e.clientY};moved=0;ph.setPointerCapture(e.pointerId);clearTimeout(holdT);holdT=setTimeout(holdStart,220)});
ph.addEventListener('pointermove',function(e){if(!drag)return;var dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.x=e.clientX;drag.y=e.clientY;moved+=Math.abs(dx)+Math.abs(dy);if(moved<6)return;clearTimeout(holdT);move(dx/(ph.clientWidth*1.1))});
ph.addEventListener('pointerup',endDrag);
ph.addEventListener('pointercancel',endDrag);
ph.addEventListener('keydown',function(e){touch();if(Date.now()-lastSnap>500)snap();if(e.key==='ArrowRight'||e.key==='ArrowDown')move(.03);if(e.key==='ArrowLeft'||e.key==='ArrowUp')move(-.03)});
document.getElementById('tasma-skip').addEventListener('click',function(e){e.preventDefault();plain=true;render();fl.focus()});
var s0=ld();if(s0&&s0.end>Date.now()){st=s0;p=s0.pmax;(s0.g||[]).forEach(function(j){G[j]=1});touched=true}else clr();

function touch(){touched=true;rg.classList.remove('shake');if(demo){demo=false;p=0;render()}}
var rdrag=null;
gr.addEventListener('pointerdown',function(e){touch();snap();rdrag={x:e.clientX};gr.setPointerCapture(e.pointerId)});
gr.addEventListener('pointermove',function(e){if(!rdrag)return;var tw=Math.max(40,gr.clientWidth-rg.offsetWidth),dx=e.clientX-rdrag.x;rdrag.x=e.clientX;move(dx/tw)});
gr.addEventListener('pointerup',function(){rdrag=null});
gr.addEventListener('pointercancel',function(){rdrag=null});
[ph,gr].forEach(function(el){el.addEventListener('contextmenu',function(e){e.preventDefault()})});
rg.addEventListener('keydown',function(e){touch();if(Date.now()-lastSnap>500)snap();if(e.key==='ArrowRight'||e.key==='ArrowDown')move(.03);if(e.key==='ArrowLeft'||e.key==='ArrowUp')move(-.03)});
function ease(x){return x*x*(3-2*x)}
function startTremble(){if(touched||st||plain)return;rg.classList.remove('shake');void rg.offsetWidth;rg.classList.add('shake');trembleTimer=setTimeout(startTremble,3800)}
function demoOnce(){if(REDUCED)return;if(touched||st||plain||p>0){startTremble();return}
 demo=true;var t0=performance.now(),A=700,H=1500,TT=A+H+A;
 (function f(t){if(!demo)return;var x=t-t0,v;
  if(x<A)v=ease(x/A);else if(x<A+H)v=1;else if(x<TT)v=1-ease((x-A-H)/A);
  else{demo=false;p=0;render();startTremble();return}
  p=.06*v;render();demoRaf=requestAnimationFrame(f)})(t0)}
document.addEventListener('keydown',function(e){if(e.key==='Tab')document.body.classList.add('kbd')},{signal:signal});
document.addEventListener('pointerdown',function(){document.body.classList.remove('kbd')},{signal:signal});
addEventListener('resize',function(){calcLines();snap();render()},{signal:signal});
addEventListener('load',function(){calcLines();snap();render()},{signal:signal});
snap();tick();render();var tickTimer=setInterval(tick,1000);var demoTimer=setTimeout(demoOnce,1200);window.addCleanup(function(){lifecycle.abort();clearInterval(tickTimer);clearTimeout(demoTimer);clearTimeout(holdT);clearTimeout(trembleTimer);if(raf)cancelAnimationFrame(raf);if(demoRaf)cancelAnimationFrame(demoRaf);if(renderRaf)cancelAnimationFrame(renderRaf)});}

document.addEventListener('nav',setupTasmaExperience);
document.addEventListener('render',setupTasmaExperience);





