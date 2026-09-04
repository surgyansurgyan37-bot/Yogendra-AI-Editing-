const photo = document.getElementById('photo');
const img = document.getElementById('previewImg');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const script = document.getElementById('script');
const voiceSelect = document.getElementById('voice');
const ratio = document.getElementById('ratio');
const animation = document.getElementById('animation');
const duration = document.getElementById('duration');
const status = document.getElementById('status');

let imageReady = false;
let animating = false;
let mediaRecorder, chunks = [];

function setCanvasSize(){
  if(ratio.value === 'shorts'){canvas.width=720;canvas.height=1280}
  else {canvas.width=1280;canvas.height=720}
  draw(0);
}
ratio.addEventListener('change', setCanvasSize);

photo.addEventListener('change', e=>{
  const file=e.target.files[0]; if(!file) return;
  const url=URL.createObjectURL(file);
  img.onload=()=>{imageReady=true; setCanvasSize(); img.style.display='block';};
  img.src=url;
});

function draw(t){
  ctx.fillStyle='#050813';ctx.fillRect(0,0,canvas.width,canvas.height);
  if(!imageReady) return;
  const iw=img.naturalWidth, ih=img.naturalHeight;
  const cw=canvas.width,ch=canvas.height;
  const cover=Math.max(cw/iw,ch/ih);
  let scale=cover, x=(cw-iw*scale)/2, y=(ch-ih*scale)/2;
  const p=t;
  if(animation.value==='zoom'){scale=cover*(1+0.12*p)}
  if(animation.value==='pan'){x=(cw-iw*scale)/2 + Math.sin(p*Math.PI*2)*cw*.04}
  if(animation.value==='kenburns'){scale=cover*(1+0.08*p);x=(cw-iw*scale)/2-cw*.02*p;y=(ch-ih*scale)/2-ch*.01*p}
  if(animation.value==='float'){y=(ch-ih*scale)/2+Math.sin(p*Math.PI*2)*ch*.025}
  ctx.drawImage(img,x,y,iw*scale,ih*scale);
}

function runAnimation(exporting=false){
  if(!imageReady){status.textContent='पहले फोटो चुनें।';return}
  animating=true; const start=performance.now(); const ms=Math.max(3,Math.min(30,+duration.value))*1000;
  if(exporting){
    chunks=[];
    const stream=canvas.captureStream(30);
    mediaRecorder=new MediaRecorder(stream,{mimeType:'video/webm'});
    mediaRecorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
    mediaRecorder.onstop=()=>{
      const blob=new Blob(chunks,{type:'video/webm'});
      const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='yogendra-ai-animation.webm';a.click();
      status.textContent='वीडियो export हो गया।';
    };
    mediaRecorder.start();
  }
  function frame(now){
    const p=Math.min(1,(now-start)/ms); draw(p);
    if(p<1){requestAnimationFrame(frame)}
    else {animating=false;if(exporting)mediaRecorder.stop()}
  }
  requestAnimationFrame(frame);
}
document.getElementById('preview').onclick=()=>runAnimation(false);
document.getElementById('download').onclick=()=>runAnimation(true);

function loadVoices(){
  const voices=speechSynthesis.getVoices();
  voiceSelect.innerHTML='';
  voices.filter(v=>/^hi(-|_)?/i.test(v.lang)||/hindi/i.test(v.name)).concat(
    voices.filter(v=>!(/^hi(-|_)?/i.test(v.lang)||/hindi/i.test(v.name))).slice(0,8)
  ).forEach(v=>{const o=document.createElement('option');o.value=v.name;o.textContent=`${v.name} (${v.lang})`;voiceSelect.appendChild(o)});
}
loadVoices(); speechSynthesis.onvoiceschanged=loadVoices;

document.getElementById('speak').onclick=()=>{
  speechSynthesis.cancel();
  const text=script.value.trim();
  if(!text){status.textContent='पहले script लिखें।';return}
  const u=new SpeechSynthesisUtterance(text);
  const v=speechSynthesis.getVoices().find(x=>x.name===voiceSelect.value);
  if(v)u.voice=v;
  u.lang=v?.lang||'hi-IN'; u.rate=1; u.pitch=1;
  speechSynthesis.speak(u);
};
document.getElementById('stop').onclick=()=>speechSynthesis.cancel();

setCanvasSize();