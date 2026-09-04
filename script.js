export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"POST required"});
  try{
    const {story}=req.body||{};
    if(!story?.trim()) return res.status(400).json({error:"story is required"});
    const key=process.env.OPENAI_API_KEY;
    if(!key) return res.status(500).json({error:"OPENAI_API_KEY is not configured in Vercel"});
    const r=await fetch("https://api.openai.com/v1/responses",{
      method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${key}`},
      body:JSON.stringify({model:"gpt-4.1-mini",input:`Convert this Hindi/English story into 6-10 short video scenes. Return ONLY valid JSON as {"scenes":[{"title":"","narration":"","image_prompt":""}]}. Story:\n${story}`})
    });
    const data=await r.json(); if(!r.ok) return res.status(r.status).json({error:data});
    const text=data.output_text||"";
    let json; try{json=JSON.parse(text)}catch{json={raw:text}};
    res.status(200).json(json);
  }catch(e){res.status(500).json({error:e.message})}
}