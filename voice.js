export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"POST required"});
  try{
    const {text,voice="alloy"}=req.body||{};
    if(!text?.trim()) return res.status(400).json({error:"text is required"});
    const key=process.env.OPENAI_API_KEY;
    if(!key) return res.status(500).json({error:"OPENAI_API_KEY is not configured in Vercel"});
    const r=await fetch("https://api.openai.com/v1/audio/speech",{
      method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${key}`},
      body:JSON.stringify({model:"gpt-4o-mini-tts",voice,input:text,format:"mp3"})
    });
    if(!r.ok){const e=await r.text();return res.status(r.status).send(e)}
    const buf=Buffer.from(await r.arrayBuffer());
    res.setHeader("Content-Type","audio/mpeg");res.setHeader("Content-Length",buf.length);res.status(200).send(buf);
  }catch(e){res.status(500).json({error:e.message})}
}