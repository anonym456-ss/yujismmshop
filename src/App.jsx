import React, { useEffect, useState, useMemo } from "react";

/*
  Shop with Owner-mode image upload (client-side)
  - Images are stored as base64 data URLs in localStorage together with products.
  - This allows owner to add/edit/delete products and upload images without backend.
  - For cross-device persistence or public image hosting, later add Cloudinary or GitHub asset upload.
  - PayPal & Discord secrets are NOT included. Set them as environment variables in Vercel.
*/

const STORAGE_KEY = "yms_products_v1";
const OWNER_DEFAULT = "mediaweiden";

const sampleItems = [
  { id: 1, name: "Tacorita Bicicleta", price: 5, type: "Pet", desc: "Beliebtes Einstiegs-Secret.", image: "" },
  { id: 2, name: "Nuclearo Dinossauro", price: 6, type: "Pet", desc: "Cooles Design, mittlere Seltenheit.", image: "" },
  { id: 3, name: "Dragon Cannelloni", price: 28, type: "Pet", desc: "Luxus-Secret, langsam drehbar.", image: "" }
];

function readStorage(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return null;
    return JSON.parse(raw);
  }catch(e){ return null; }
}

function writeStorage(items){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }catch(e){ console.error("Storage error", e); }
}

export default function App(){
  const [items, setItems] = useState(()=> readStorage() || sampleItems);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const [ownerMode, setOwnerMode] = useState(false);
  const [ownerCode, setOwnerCode] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({name:"", price:"", type:"Pet", desc:"", image:""});

  useEffect(()=>{ writeStorage(items); }, [items]);

  const categories = ["All","Pet","Lucky Block","Service"];

  const filtered = useMemo(()=>{
    let list = items.filter(i=>i.name.toLowerCase().includes(query.toLowerCase()));
    if(category !== "All") list = list.filter(i=>i.type === category);
    return list;
  }, [items, query, category]);

  const handleOwnerLogin = ()=>{
    const allowed = import.meta.env.VITE_OWNER_CODE || OWNER_DEFAULT;
    if(ownerCode.trim() === allowed){ setOwnerMode(true); setOwnerCode(""); alert("Owner-Modus aktiviert"); }
    else alert("Falscher Owner-Code");
  };

  const startAdd = ()=>{
    setEditing(null);
    setForm({name:"", price:"", type:"Pet", desc:"", image:""});
    window.scrollTo({top:0, behavior:"smooth"});
  };

  const startEdit = (item)=>{
    setEditing(item.id);
    setForm({...item});
    window.scrollTo({top:0, behavior:"smooth"});
  };

  const handleFile = async (file) => {
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ()=>{
      setForm(prev=>({...prev, image: reader.result}));
    };
    reader.readAsDataURL(file);
  };

  const saveForm = ()=>{
    if(!form.name || !form.price) return alert("Name und Preis angeben");
    if(editing){
      setItems(prev=> prev.map(p=> p.id===editing ? {...p, ...form, price: parseFloat(form.price)} : p));
      setEditing(null);
    }else{
      const id = items.length ? Math.max(...items.map(i=>i.id))+1 : 1;
      setItems(prev=> [{...form, id, price: parseFloat(form.price)}, ...prev]);
    }
    setForm({name:"", price:"", type:"Pet", desc:"", image:""});
    alert("Produkt gespeichert (lokal).");
  };

  const removeItem = (id)=>{
    if(!confirm("Produkt wirklich löschen?")) return;
    setItems(prev=> prev.filter(p=> p.id!==id));
  };

  return (
    <div className="container">
      <header className="header">
        <div className="brand">
          <div className="logo">YMS</div>
          <div>
            <div className="title">Yuji's Mega Service</div>
            <div className="subtitle">Secret Pets, Lucky Blocks & Private Servers</div>
          </div>
        </div>

        <div className="controls">
          <input className="input" placeholder="Suche..." value={query} onChange={(e)=>setQuery(e.target.value)} />
          <select className="input" value={category} onChange={(e)=>setCategory(e.target.value)}>
            {categories.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
          {!ownerMode ? (
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <input className="input" type="password" placeholder="Owner-Code" value={ownerCode} onChange={(e)=>setOwnerCode(e.target.value)} />
              <button className="button" onClick={handleOwnerLogin}>Owner Login</button>
            </div>
          ) : (
            <div className="ownerbox">Owner-Modus aktiv</div>
          )}
        </div>
      </header>

      {ownerMode && (
        <section className="ownerbox">
          <div style={{fontWeight:700, marginBottom:8}}>🛠 Owner Dashboard</div>

          <div style={{display:"flex",gap:8,flexWrap:"wrap", marginBottom:10}}>
            <button className="button" onClick={startAdd}>Neues Produkt</button>
            <div style={{fontSize:13, color:"#9ca3af"}}>Bilder werden lokal gespeichert (Nur im Browser).</div>
          </div>

          <div style={{display:"flex",gap:8,flexWrap:"wrap", marginBottom:8}}>
            <input className="input" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} />
            <input className="input" placeholder="Preis (€)" value={form.price} onChange={(e)=>setForm({...form, price:e.target.value})} style={{width:120}} />
            <select className="input" value={form.type} onChange={(e)=>setForm({...form, type:e.target.value})}>
              <option>Pet</option><option>Lucky Block</option><option>Service</option>
            </select>
            <input className="input" placeholder="Kurzbeschreibung" value={form.desc} onChange={(e)=>setForm({...form, desc:e.target.value})} />
          </div>

          <div style={{display:"flex",gap:8,alignItems:"center", marginBottom:8}}>
            <input type="file" accept="image/*" onChange={(e)=> handleFile(e.target.files[0])} />
            <button className="button" onClick={saveForm}>Speichern</button>
            {editing && <button className="smallbtn" onClick={()=>{ setEditing(null); setForm({name:"", price:"", type:"Pet", desc:"", image:""}); }}>Abbrechen</button>}
          </div>

          {form.image && (
            <div style={{marginTop:8}}>
              <div style={{fontSize:13, color:"#9ca3af", marginBottom:6}}>Bild Vorschau:</div>
              <img src={form.image} alt="preview" style={{maxWidth:200, borderRadius:8}} />
            </div>
          )}
        </section>
      )}

      <main>
        <div className="grid">
          {filtered.map(item=>(
            <article key={item.id} className="card">
              <div className="thumb">
                {item.image ? <img src={item.image} alt={item.name} style={{width:"100%", height:"100%", objectFit:"cover"}} /> : <div style={{padding:8}}>{item.name[0]}</div>}
              </div>
              <div style={{flex:1}}>
                <div className="name">{item.name}</div>
                <div className="desc">{item.desc}</div>
                <div style={{marginTop:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div className="price">{item.price} €</div>
                  <div>
                    <button className="smallbtn" onClick={()=>setSelected(item)}>Anschauen</button>
                    {ownerMode && <>
                      <button className="smallbtn" onClick={()=>startEdit(item)} style={{marginLeft:8}}>Bearbeiten</button>
                      <button className="smallbtn" onClick={()=>removeItem(item.id)} style={{marginLeft:8}}>Löschen</button>
                    </>}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <footer className="footer">© {new Date().getFullYear()} Yuji's Mega Service</footer>

      {selected && (
        <div className="modal-back">
          <div className="modal">
            <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
              <div style={{flex:"0 0 40%", minWidth:220, height:220, borderRadius:10, background:"linear-gradient(135deg,#0b1220,#1f2937)", display:"flex",alignItems:"center",justifyContent:"center"}}>
                {selected.image ? <img src={selected.image} alt={selected.name} style={{width:"100%", height:"100%", objectFit:"cover"}} /> : "Bild"}
              </div>
              <div style={{flex:1}}>
                <h2 style={{margin:0}}>{selected.name}</h2>
                <div style={{color:"#9ca3af",marginTop:8}}>{selected.desc}</div>
                <div style={{fontSize:28,color:"#38bdf8",fontWeight:800,marginTop:12}}>{selected.price} €</div>
                <div style={{marginTop:16,display:"flex",gap:8,alignItems:"center"}}>
                  <button className="button" onClick={()=>{ alert('Zahlung / Link Integration: setze VITE_PAYPAL_CLIENT_ID in Vercel env'); }}>Jetzt bezahlen</button>
                  <button className="smallbtn" onClick={()=>setSelected(null)}>Schließen</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
