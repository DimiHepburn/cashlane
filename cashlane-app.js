
const KEY="cashlane-live-v2";
const SEED_PRODUCTS=[
  {id:"prod_notion_os",name:"Life OS Notion System",tagline:"Goals, habits, weekly reviews",description:"Personal OS for Notion: goals, habits, meeting notes, weekly review. Instant PDF + template link.",priceCents:2900,category:"Templates",delivery:"Notion + PDF",featured:true,sales:128},
  {id:"prod_proposal_pack",name:"Freelance Proposal Pack",tagline:"Win more clients faster",description:"Five proposal templates plus pricing sheet. Google Docs + DOCX.",priceCents:1900,category:"Business",delivery:"Google Docs + DOCX",featured:true,sales:214},
  {id:"prod_pitch_deck",name:"Seed Pitch Deck Kit",tagline:"12-slide investor narrative",description:"Story-first pitch with speaker notes. Keynote, PPT, Figma.",priceCents:3900,category:"Business",delivery:"Keynote + PPT + Figma",featured:true,sales:87},
  {id:"prod_resume_bundle",name:"Resume + Cover Bundle",tagline:"ATS-friendly, still premium",description:"Three resume layouts, cover letters, LinkedIn About guide.",priceCents:1500,category:"Career",delivery:"DOCX + PDF",featured:false,sales:301},
  {id:"prod_social_kit",name:"Creator Content OS",tagline:"30 days of posts, planned",description:"Calendar, hook bank, carousel outlines for solo creators.",priceCents:2400,category:"Creator",delivery:"Notion + Canva",featured:false,sales:156},
  {id:"prod_invoice_kit",name:"Client Onboarding Kit",tagline:"Contracts, kickoff, payment terms",description:"Welcome packet, scope form, MSA language, payment schedule.",priceCents:2200,category:"Business",delivery:"PDF + Docs",featured:false,sales:99},
];
const SEED_INVOICES=[
  {id:"inv_1001",number:"CL-1042",clientName:"Northline Studio",clientEmail:"ops@northline.studio",project:"Brand site redesign",amountCents:480000,status:"sent",issuedAt:"2026-08-01T12:00:00.000Z",dueAt:"2026-08-15T12:00:00.000Z",notes:"Final milestone."},
  {id:"inv_1002",number:"CL-1041",clientName:"Harbor Coffee",clientEmail:"maya@harbor.coffee",project:"Menu + packaging",amountCents:125000,status:"paid",issuedAt:"2026-07-18T12:00:00.000Z",dueAt:"2026-08-01T12:00:00.000Z",notes:"Paid via bank transfer."},
  {id:"inv_1003",number:"CL-1040",clientName:"Kite Analytics",clientEmail:"finance@kite.io",project:"Q3 dashboard prototype",amountCents:320000,status:"overdue",issuedAt:"2026-07-01T12:00:00.000Z",dueAt:"2026-07-20T12:00:00.000Z",notes:"Follow up scheduled."},
];
const BANK={accountName:"Dimitri Romanov",sortCode:"04-00-06",accountNumber:"32164716",bankName:"Monzo Business",receiveOnly:true};
const DEFAULT={
  profile:{brandName:"Cashlane",tagline:"Sell digital products. Invoice clients. Get paid.",monthlyGoalCents:500000,supportEmail:"hello@cashlane.shop",ownerName:"Dimitri Romanov",bank:{...BANK}},
  products:SEED_PRODUCTS,cart:[],orders:[],invoices:SEED_INVOICES
};
const money=cents=>new Intl.NumberFormat("en-GB",{style:"currency",currency:"GBP"}).format((cents||0)/100);
const uid=(p="id")=>p+"_"+Math.random().toString(36).slice(2,10);
const fmtDate=iso=>new Intl.DateTimeFormat("en-GB",{day:"numeric",month:"short",year:"numeric"}).format(new Date(iso));
function load(){
  try{
    const raw=localStorage.getItem(KEY);
    if(!raw) return structuredClone(DEFAULT);
    const parsed=JSON.parse(raw);
    const merged={...structuredClone(DEFAULT),...parsed};
    merged.profile={...DEFAULT.profile,...(parsed.profile||{})};
    merged.profile.bank={...BANK,...(parsed.profile&&parsed.profile.bank||{}),receiveOnly:true};
    merged.products=parsed.products||DEFAULT.products;
    merged.invoices=parsed.invoices||DEFAULT.invoices;
    merged.cart=parsed.cart||[];
    merged.orders=parsed.orders||[];
    return merged;
  }catch{return structuredClone(DEFAULT)}
}
function save(s){localStorage.setItem(KEY,JSON.stringify(s))}
let state=load();
let route=location.hash.slice(1)||"/";
let shopCategory="All";
let formOpen={product:false,invoice:false};
function setState(patch){state={...state,...patch}; if(patch.profile){state.profile={...state.profile,...patch.profile,bank:{...BANK,...(patch.profile.bank||state.profile.bank),receiveOnly:true}}} save(state); render()}
function navigate(path){route=path; location.hash=path; render()}
function toast(title,sub=""){const el=document.getElementById("toast"); el.innerHTML=`<strong>${esc(title)}</strong>${sub?`<div class="subtle" style="font-size:.8rem;margin-top:.2rem">${esc(sub)}</div>`:""}`; el.classList.add("show"); clearTimeout(toast._t); toast._t=setTimeout(()=>el.classList.remove("show"),2800)}
function esc(s){const d=document.createElement("div");d.textContent=String(s);return d.innerHTML}
function cartCount(){return state.cart.reduce((n,c)=>n+c.qty,0)}
function cartTotal(){return state.cart.reduce((n,c)=>{const p=state.products.find(x=>x.id===c.productId); return n+(p?p.priceCents*c.qty:0)},0)}
function revenue(){const paidInv=state.invoices.filter(i=>i.status==="paid").reduce((n,i)=>n+i.amountCents,0); const orders=state.orders.reduce((n,o)=>n+o.totalCents,0); return paidInv+orders}
function openInvoices(){return state.invoices.filter(i=>i.status==="sent"||i.status==="overdue").reduce((n,i)=>n+i.amountCents,0)}
function bankCard(compact=false){
  const b=state.profile.bank||BANK;
  return `<div class="card bank-card" style="padding:1.1rem 1.25rem">
    <div style="display:flex;flex-wrap:wrap;align-items:center;gap:.5rem;margin-bottom:.5rem">
      <strong class="display" style="font-size:1rem">Pay into this account</strong>
      <span class="badge badge-accent">Receive only</span>
    </div>
    ${compact?"":`<p class="muted" style="margin:0 0 .85rem;font-size:.85rem">Bank transfer instructions for clients. Inbound payments only — never used to send money out.</p>`}
    <dl class="bank-grid">
      <div><dt>Account name</dt><dd>${esc(b.accountName)}</dd></div>
      <div><dt>Bank</dt><dd>${esc(b.bankName)}</dd></div>
      <div><dt>Sort code</dt><dd class="mono">${esc(b.sortCode)}</dd></div>
      <div><dt>Account number</dt><dd class="mono">${esc(b.accountNumber)}</dd></div>
    </dl>
    <p class="subtle" style="margin:.85rem 0 0;font-size:.75rem;line-height:1.45">Reference the invoice number when paying. Shop card checkout is demo-only until a processor is connected; client invoices use this Monzo Business account for real transfers.</p>
  </div>`
}
function header(){
  const path=route.split("?")[0];
  const link=(href,label)=>`<a href="#${href}" class="${path===href||(href!=='/'&&path.startsWith(href))?'active':''}" data-nav="${href}">${label}</a>`;
  return `<header class="site"><div class="wrap inner">
    <a class="logo" href="#/" data-nav="/"><span class="dot"><i></i></span>Cashlane</a>
    <nav class="links">${link("/","Home")}${link("/shop","Shop")}${link("/dashboard","Dashboard")}${link("/dashboard?tab=invoices","Invoices")}</nav>
    <div class="actions">
      <a class="btn btn-ghost btn-sm" href="#/cart" data-nav="/cart">Cart (${cartCount()})</a>
      <a class="btn btn-primary btn-sm" href="#/dashboard" data-nav="/dashboard">Seller desk</a>
    </div>
  </div></header>`
}
function footer(){
  return `<footer class="site"><div class="wrap" style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:1rem">
    <div><strong class="display">Cashlane</strong><div class="subtle" style="margin-top:.35rem">Owned by ${esc(state.profile.ownerName)} · payments to Monzo Business (receive only)</div></div>
    <div class="subtle">Sort ${esc(BANK.sortCode)} · a/c ${esc(BANK.accountNumber)}</div>
  </div></footer>`
}
function pageHome(){
  const featured=state.products.filter(p=>p.featured).slice(0,3);
  return `<section class="hero"><div class="hero-grid"></div><div class="wrap" style="position:relative">
    <span class="badge badge-accent">Live · bank transfer ready</span>
    <h1>Sell digital products. Invoice clients. Get paid into Monzo.</h1>
    <p class="lead">${esc(state.profile.tagline)} Client invoices show your receive-only Monzo Business details so money lands in account ${esc(BANK.accountNumber)}.</p>
    <div class="cta-row">
      <a class="btn btn-primary btn-lg" href="#/shop" data-nav="/shop">Browse shop</a>
      <a class="btn btn-outline btn-lg" href="#/dashboard?tab=invoices" data-nav="/dashboard?tab=invoices">Create invoice</a>
    </div>
    <div class="grid" style="grid-template-columns:repeat(3,1fr);gap:.75rem;max-width:28rem;margin-top:1.5rem">
      <div class="card" style="padding:.75rem"><dt class="subtle" style="font-size:.65rem;text-transform:uppercase">Revenue</dt><dd class="mono" style="margin:.25rem 0 0;font-size:1.1rem">${money(revenue())}</dd></div>
      <div class="card" style="padding:.75rem"><dt class="subtle" style="font-size:.65rem;text-transform:uppercase">Open</dt><dd class="mono" style="margin:.25rem 0 0;font-size:1.1rem">${money(openInvoices())}</dd></div>
      <div class="card" style="padding:.75rem"><dt class="subtle" style="font-size:.65rem;text-transform:uppercase">Products</dt><dd class="mono" style="margin:.25rem 0 0;font-size:1.1rem">${state.products.length}</dd></div>
    </div>
  </div></section>
  <section class="section"><div class="wrap">
    <h2>Featured products</h2>
    <p class="sub">Digital kits ready to sell. Shop checkout is demo until card rails are connected.</p>
    <div class="grid grid-3">${featured.map(productCard).join("")}</div>
    <div style="margin-top:1.5rem"><a class="btn btn-secondary" href="#/shop" data-nav="/shop">View all products</a></div>
  </div></section>
  <section class="section" style="padding-top:0"><div class="wrap">
    <h2>Where money lands</h2>
    <p class="sub">Every client invoice points here. Receive only — Cashlane never sends money out of this account.</p>
    ${bankCard()}
  </div></section>`
}
function productCard(p){
  return `<article class="card product">
    <div style="display:flex;justify-content:space-between;gap:.5rem"><span class="badge">${esc(p.category)}</span>${p.featured?'<span class="badge badge-accent">Featured</span>':''}</div>
    <h3>${esc(p.name)}</h3>
    <p class="tag">${esc(p.tagline)}</p>
    <div class="row"><span class="price">${money(p.priceCents)}</span>
      <div style="display:flex;gap:.35rem">
        <a class="btn btn-outline btn-sm" href="#/product/${p.id}" data-nav="/product/${p.id}">Details</a>
        <button class="btn btn-primary btn-sm" data-add="${p.id}">Add</button>
      </div>
    </div>
  </article>`
}
function pageShop(){
  const cats=["All",...new Set(state.products.map(p=>p.category))];
  const list=shopCategory==="All"?state.products:state.products.filter(p=>p.category===shopCategory);
  return `<section class="section"><div class="wrap">
    <h2>Shop</h2>
    <p class="sub">Digital downloads for freelancers and creators. Card checkout is demo; invoices use real bank transfer.</p>
    <div class="tabs">${cats.map(c=>`<button class="${c===shopCategory?'on':''}" data-cat="${esc(c)}">${esc(c)}</button>`).join("")}</div>
    <div class="grid grid-3">${list.map(productCard).join("")||'<div class="empty card">No products in this category.</div>'}</div>
  </div></section>`
}
function pageProduct(id){
  const p=state.products.find(x=>x.id===id);
  if(!p) return `<section class="section"><div class="wrap empty card">Product not found. <a href="#/shop" data-nav="/shop">Back to shop</a></div></section>`;
  return `<section class="section"><div class="wrap grid grid-2">
    <div class="card" style="padding:1.5rem">
      <span class="badge">${esc(p.category)}</span>
      <h1 class="display" style="font-size:2rem;margin:.75rem 0 .5rem">${esc(p.name)}</h1>
      <p class="muted">${esc(p.tagline)}</p>
      <p style="line-height:1.6">${esc(p.description)}</p>
      <p class="subtle" style="font-size:.85rem">Delivery: ${esc(p.delivery)} · ${p.sales} sales</p>
    </div>
    <div class="card" style="padding:1.5rem;height:fit-content">
      <div class="mono" style="font-size:2rem">${money(p.priceCents)}</div>
      <p class="muted" style="font-size:.85rem;margin:.5rem 0 1rem">One-time purchase · instant delivery (demo)</p>
      <button class="btn btn-primary" style="width:100%" data-add="${p.id}">Add to cart</button>
      <a class="btn btn-outline" style="width:100%;margin-top:.5rem" href="#/shop" data-nav="/shop">Back to shop</a>
    </div>
  </div></section>`
}
function pageCart(){
  const items=state.cart.map(c=>{const p=state.products.find(x=>x.id===c.productId); return p?{...c,product:p}:null}).filter(Boolean);
  if(!items.length) return `<section class="section"><div class="wrap card empty">Your cart is empty. <a href="#/shop" data-nav="/shop">Browse products</a></div></section>`;
  return `<section class="section"><div class="wrap grid grid-2">
    <div class="stack">${items.map(({product:p,qty})=>`<div class="card" style="padding:1rem;display:flex;justify-content:space-between;gap:1rem;align-items:center">
      <div><strong>${esc(p.name)}</strong><div class="muted" style="font-size:.85rem">${money(p.priceCents)} each</div></div>
      <div style="display:flex;align-items:center;gap:.35rem">
        <button class="btn btn-outline btn-sm" data-qty="${p.id}:-1">−</button>
        <span class="mono">${qty}</span>
        <button class="btn btn-outline btn-sm" data-qty="${p.id}:1">+</button>
        <button class="btn btn-ghost btn-sm" data-remove="${p.id}">Remove</button>
      </div>
    </div>`).join("")}</div>
    <div class="card" style="padding:1.25rem;height:fit-content">
      <h3 class="display" style="margin:0 0 1rem">Checkout</h3>
      <div style="display:flex;justify-content:space-between;margin-bottom:1rem"><span class="muted">Total</span><strong class="mono">${money(cartTotal())}</strong></div>
      <form id="checkout-form">
        <div class="field-wrap"><label class="field">Name</label><input name="name" required placeholder="Your name"/></div>
        <div class="field-wrap"><label class="field">Email</label><input name="email" type="email" required placeholder="you@example.com"/></div>
        <button class="btn btn-primary" style="width:100%" type="submit">Pay (demo)</button>
      </form>
      <p class="subtle" style="font-size:.75rem;margin:1rem 0 0;line-height:1.45">Shop card payments are demo-only. For real money, send clients an invoice — they pay by bank transfer into your Monzo Business account (receive only).</p>
      ${bankCard(true)}
    </div>
  </div></section>`
}
function pageDashboard(){
  const params=new URLSearchParams(route.split("?")[1]||"");
  const tab=params.get("tab")||"overview";
  const tabs=[["overview","Overview"],["products","Products"],["invoices","Invoices"]];
  const goal=state.profile.monthlyGoalCents||500000;
  const rev=revenue();
  const pct=Math.min(100,Math.round(rev/goal*100));
  let body="";
  if(tab==="overview"){
    body=`<div class="grid" style="grid-template-columns:repeat(2,1fr);gap:1rem;margin-bottom:1rem"><div class="card stat"><div class="lbl">Revenue</div><div class="val">${money(rev)}</div><div class="hint">${pct}% of ${money(goal)} goal</div></div>
      <div class="card stat"><div class="lbl">Open invoices</div><div class="val">${money(openInvoices())}</div><div class="hint">${state.invoices.filter(i=>i.status!=='paid').length} outstanding</div></div>
      <div class="card stat"><div class="lbl">Orders</div><div class="val">${state.orders.length}</div><div class="hint">Shop checkouts (demo)</div></div>
      <div class="card stat"><div class="lbl">Products</div><div class="val">${state.products.length}</div><div class="hint">${state.products.filter(p=>p.featured).length} featured</div></div>
    </div>
    <div style="margin-bottom:1rem">${bankCard()}</div>
    <div class="card" style="padding:1.25rem">
      <h3 class="display" style="margin:0 0 .75rem">How you make real money</h3>
      <ol class="muted" style="margin:0;padding-left:1.2rem;line-height:1.7">
        <li>Create an invoice on the Invoices tab with client + amount.</li>
        <li>Share the invoice — payment details show your Monzo Business receive-only account.</li>
        <li>Client pays by bank transfer to sort <span class="mono">${esc(BANK.sortCode)}</span> / a/c <span class="mono">${esc(BANK.accountNumber)}</span> with the invoice reference.</li>
        <li>Mark the invoice paid when the transfer hits Monzo.</li>
      </ol>
      <p class="subtle" style="font-size:.8rem;margin:1rem 0 0">Cashlane never initiates outbound payments from this account.</p>
    </div>`
      } else if(tab==="products"){
    body=`<div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;margin-bottom:1rem">
      <p class="muted" style="margin:0">Publish digital products for the shop.</p>
      <button class="btn btn-primary btn-sm" id="toggle-prod">${formOpen.product?'Close':'Add product'}</button>
    </div>
    ${formOpen.product?`<form id="prod-form" class="card" style="padding:1.25rem;margin-bottom:1rem">
      <div class="grid" style="grid-template-columns:1fr 1fr;gap:.75rem">
        <div class="field-wrap"><label class="field">Name</label><input name="name" required/></div>
        <div class="field-wrap"><label class="field">Price (GBP)</label><input name="price" type="number" min="1" step="0.01" required placeholder="29"/></div>
        <div class="field-wrap"><label class="field">Category</label><input name="category" placeholder="Business"/></div>
        <div class="field-wrap"><label class="field">Delivery</label><input name="delivery" placeholder="PDF + Docs"/></div>
      </div>
      <div class="field-wrap"><label class="field">Tagline</label><input name="tagline" placeholder="Short pitch"/></div>
      <div class="field-wrap"><label class="field">Description</label><textarea name="description"></textarea></div>
      <button class="btn btn-primary" type="submit">Publish product</button>
    </form>`:""}
    <div class="stack">${state.products.map(p=>`<div class="card" style="padding:1rem;display:flex;flex-wrap:wrap;justify-content:space-between;gap:.75rem;align-items:center">
      <div><strong>${esc(p.name)}</strong><div class="muted" style="font-size:.85rem">${money(p.priceCents)} · ${esc(p.category)} · ${p.sales} sales</div></div>
      <div style="display:flex;gap:.35rem">
        <button class="btn btn-outline btn-sm" data-feature="${p.id}">${p.featured?'Unfeature':'Feature'}</button>
        <button class="btn btn-ghost btn-sm" data-del-prod="${p.id}">Delete</button>
      </div>
    </div>`).join("")}</div>`
  } else {
    body=`<div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;margin-bottom:1rem;flex-wrap:wrap">
      <p class="muted" style="margin:0">Client invoices pay into your Monzo Business account (receive only).</p>
      <button class="btn btn-primary btn-sm" id="toggle-inv">${formOpen.invoice?'Close':'New invoice'}</button>
    </div>
    <div style="margin-bottom:1rem">${bankCard(true)}</div>
    ${formOpen.invoice?`<form id="inv-form" class="card" style="padding:1.25rem;margin-bottom:1rem">
      <div class="grid" style="grid-template-columns:1fr 1fr;gap:.75rem">
        <div class="field-wrap"><label class="field">Client name</label><input name="clientName" required/></div>
        <div class="field-wrap"><label class="field">Client email</label><input name="clientEmail" type="email" placeholder="client@example.com"/></div>
        <div class="field-wrap"><label class="field">Project</label><input name="project" required/></div>
        <div class="field-wrap"><label class="field">Amount (GBP)</label><input name="amount" type="number" min="1" step="0.01" required/></div>
        <div class="field-wrap"><label class="field">Due in days</label><input name="dueDays" type="number" min="1" value="14"/></div>
      </div>
      <div class="field-wrap"><label class="field">Notes</label><textarea name="notes" placeholder="Payment terms..."></textarea></div>
      <button class="btn btn-primary" type="submit">Create invoice</button>
    </form>`:""}
    <div class="stack">${state.invoices.map(inv=>`<div class="card" style="padding:1rem">
      <div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:.75rem">
        <div>
          <div style="display:flex;gap:.5rem;align-items:center;flex-wrap:wrap">
            <strong class="mono">${esc(inv.number)}</strong>
            <span class="badge ${inv.status==='paid'?'badge-accent':''}">${esc(inv.status)}</span>
          </div>
          <div style="margin-top:.35rem">${esc(inv.clientName)} · ${esc(inv.project)}</div>
          <div class="subtle" style="font-size:.8rem;margin-top:.25rem">Due ${fmtDate(inv.dueAt)} · ${esc(inv.clientEmail||'')}</div>
          <div class="subtle" style="font-size:.75rem;margin-top:.5rem;max-width:28rem">Pay to ${esc(BANK.accountName)} · sort ${esc(BANK.sortCode)} · a/c ${esc(BANK.accountNumber)} · ref ${esc(inv.number)} · receive only</div>
        </div>
        <div style="text-align:right">
          <div class="mono" style="font-size:1.25rem">${money(inv.amountCents)}</div>
          <div style="display:flex;flex-wrap:wrap;gap:.35rem;justify-content:flex-end;margin-top:.5rem">
            ${['sent','paid','overdue'].map(st=>`<button class="btn btn-sm ${inv.status===st?'btn-primary':'btn-outline'}" data-inv-status="${inv.id}:${st}">${st}</button>`).join("")}
            <button class="btn btn-ghost btn-sm" data-del-inv="${inv.id}">Delete</button>
          </div>
        </div>
      </div>
    </div>`).join("")||`<div class="card empty">No invoices yet.</div>`}</div>`
  }
  return `<section class="section"><div class="wrap">
    <h2>Seller dashboard</h2>
    <p class="sub">Revenue, products, and client invoices — payments receive-only to Monzo Business.</p>
    <div class="dash-nav">${tabs.map(([k,l])=>`<a class="btn btn-sm ${tab===k?'btn-primary':'btn-outline'}" href="#/dashboard?tab=${k}" data-nav="/dashboard?tab=${k}">${l}</a>`).join("")}
      <button class="btn btn-ghost btn-sm" id="reset-demo">Reset demo data</button>
    </div>
    ${body}
  </div></section>`
}
function render(){
  const path=route.split("?")[0];
  let body="";
  if(path==="/"||path==="") body=pageHome();
  else if(path==="/shop") body=pageShop();
  else if(path.startsWith("/product/")) body=pageProduct(path.slice("/product/".length));
  else if(path==="/cart") body=pageCart();
  else if(path.startsWith("/dashboard")) body=pageDashboard();
  else body=pageHome();
  document.getElementById("app").innerHTML=header()+`<main>${body}</main>`+footer();
  bind();
}
function bind(){
  document.querySelectorAll("[data-nav]").forEach(el=>{el.onclick=e=>{e.preventDefault();navigate(el.dataset.nav)}});
  document.querySelectorAll("[data-cat]").forEach(el=>el.onclick=()=>{shopCategory=el.dataset.cat;render()});
  document.querySelectorAll("[data-add]").forEach(el=>el.onclick=()=>{
    const id=el.dataset.add; const cart=[...state.cart]; const ex=cart.find(c=>c.productId===id);
    if(ex) ex.qty++; else cart.push({productId:id,qty:1});
    setState({cart}); toast("Added to cart", state.products.find(p=>p.id===id)?.name||"");
  });
  document.querySelectorAll("[data-qty]").forEach(el=>el.onclick=()=>{
    const [id,d]=el.dataset.qty.split(":"); const delta=Number(d);
    const cart=state.cart.map(c=>c.productId===id?{...c,qty:c.qty+delta}:c).filter(c=>c.qty>0);
    setState({cart});
  });
  document.querySelectorAll("[data-remove]").forEach(el=>el.onclick=()=>setState({cart:state.cart.filter(c=>c.productId!==el.dataset.remove)}));
  const cf=document.getElementById("checkout-form");
  if(cf) cf.onsubmit=e=>{
    e.preventDefault(); const fd=new FormData(cf);
    const items=state.cart.map(c=>{const p=state.products.find(x=>x.id===c.productId); return p?{productId:p.id,name:p.name,priceCents:p.priceCents,qty:c.qty}:null}).filter(Boolean);
    if(!items.length) return;
    const totalCents=items.reduce((s,i)=>s+i.priceCents*i.qty,0);
    const order={id:uid("ord"),items,totalCents,customerName:String(fd.get("name")),customerEmail:String(fd.get("email")),createdAt:new Date().toISOString(),status:"paid"};
    const products=state.products.map(p=>{const sold=items.find(i=>i.productId===p.id); return sold?{...p,sales:p.sales+sold.qty}:p});
    setState({orders:[order,...state.orders],cart:[],products});
    toast("Payment received (demo)", money(totalCents)+" · Order "+order.id.slice(-8));
    navigate("/dashboard");
  };
  const tp=document.getElementById("toggle-prod"); if(tp) tp.onclick=()=>{formOpen.product=!formOpen.product;render()};
  const ti=document.getElementById("toggle-inv"); if(ti) ti.onclick=()=>{formOpen.invoice=!formOpen.invoice;render()};
  const pf=document.getElementById("prod-form");
  if(pf) pf.onsubmit=e=>{
    e.preventDefault(); const fd=new FormData(pf);
    const priceCents=Math.round(parseFloat(String(fd.get("price")||"0"))*100);
    if(priceCents<=0) return toast("Price required");
    const product={id:uid("prod"),name:String(fd.get("name")).trim(),tagline:String(fd.get("tagline")||"Digital download").trim(),description:String(fd.get("description")||"A ready-to-use digital product.").trim(),priceCents,category:String(fd.get("category")||"General").trim(),delivery:String(fd.get("delivery")||"Download").trim(),featured:false,sales:0};
    formOpen.product=false; setState({products:[product,...state.products]}); toast("Product published", product.name);
  };
  document.querySelectorAll("[data-feature]").forEach(el=>el.onclick=()=>setState({products:state.products.map(p=>p.id===el.dataset.feature?{...p,featured:!p.featured}:p)}));
  document.querySelectorAll("[data-del-prod]").forEach(el=>el.onclick=()=>{setState({products:state.products.filter(p=>p.id!==el.dataset.delProd),cart:state.cart.filter(c=>c.productId!==el.dataset.delProd)}); toast("Product removed")});
  const inf=document.getElementById("inv-form");
  if(inf) inf.onsubmit=e=>{
    e.preventDefault(); const fd=new FormData(inf);
    const amountCents=Math.round(parseFloat(String(fd.get("amount")||"0"))*100);
    if(amountCents<=0) return toast("Amount required");
    const due=new Date(); due.setDate(due.getDate()+Math.max(1,parseInt(String(fd.get("dueDays")||"14"),10)));
    const inv={id:uid("inv"),number:"CL-"+(1040+state.invoices.length+1),clientName:String(fd.get("clientName")).trim(),clientEmail:String(fd.get("clientEmail")||"client@example.com").trim(),project:String(fd.get("project")).trim(),amountCents,status:"sent",issuedAt:new Date().toISOString(),dueAt:due.toISOString(),notes:String(fd.get("notes")||"").trim()};
    formOpen.invoice=false; setState({invoices:[inv,...state.invoices]}); toast("Invoice created", inv.clientName+" · "+money(amountCents));
  };
  document.querySelectorAll("[data-inv-status]").forEach(el=>el.onclick=()=>{const [id,st]=el.dataset.invStatus.split(":"); setState({invoices:state.invoices.map(i=>i.id===id?{...i,status:st}:i)}); toast("Invoice marked "+st)});
  document.querySelectorAll("[data-del-inv]").forEach(el=>el.onclick=()=>{setState({invoices:state.invoices.filter(i=>i.id!==el.dataset.delInv)}); toast("Invoice deleted")});
  const reset=document.getElementById("reset-demo"); if(reset) reset.onclick=()=>{state=structuredClone(DEFAULT); save(state); toast("Demo data reset"); render()};
}
window.addEventListener("hashchange",()=>{route=location.hash.slice(1)||"/"; render()});
render();
