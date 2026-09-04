export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"POST required"});
  try{
    const {prompt}=req.body||{};
    if(!prompt?.trim()) return res.status(400).json({error:"prompt is required"});
    const key=process.env.OPENAI_API_KEY;
    if(!key) return res.status(500).json({error:"OPENAI_API_KEY is not configured in Vercel"});
    const r=await fetch("https://api.openai.com/v1/images/generations",{
      method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${key}`},
      body:JSON.stringify({model:"gpt-image-1",prompt,size:"1024x1536",quality:"auto"})
    });
    const data=await r.json();if(!r.ok)return res.status(r.status).json({error:data});
    res.status(200).json({image_base64:data.data?.[0]?.b64_json||null});
  }catch(e){res.status(500).json({error:e.message})}
}