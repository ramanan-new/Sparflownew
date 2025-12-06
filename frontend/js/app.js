async function fetchJSON(url, opts) { const r = await fetch(url, opts); return r.json(); }

const productsEl = document.getElementById('products');
const cartBtn = document.getElementById('cartBtn');
const cartPanel = document.getElementById('cartPanel');
const cartCount = document.getElementById('cartCount');
const cartItemsEl = document.getElementById('cartItems');
const checkoutBtn = document.getElementById('checkoutBtn');
const closeCart = document.getElementById('closeCart');
const paymentMethod = document.getElementById('paymentMethod');
const loginBtn = document.getElementById('loginBtn');
const loginPanel = document.getElementById('loginPanel');
const closeLogin = document.getElementById('closeLogin');
const registerBtn = document.getElementById('registerBtn');
const loginSubmitBtn = document.getElementById('loginSubmitBtn');
const categoryList = document.getElementById('categoryList');

// Category color map (distinct vibrant colors for each category)
const categoryColors = {
  'fashion': '#ff4d6d',
  'mobiles': '#4d96ff',
  'electronics': '#7b61ff',
  'appliances': '#ff9f43',
  'beauty': '#ff8fb3',
  'home': '#3ad29f',
  'food': '#f7b731',
  'medcines': '#20bf6b',
  'toys': '#f5a623',
  'automobiles': '#34495e',
  'sports': '#0fb9b1',
  'furniture': '#9b59b6',
  'books': '#e67e22',
  'for you': '#4d96ff'
};

function getCart(){ return JSON.parse(localStorage.getItem('cart')||'[]'); }
function saveCart(c){ localStorage.setItem('cart', JSON.stringify(c)); updateCartUI(); }

function updateCartUI(){
  const cart = getCart();
  cartCount.textContent = cart.reduce((s,i)=>s+i.qty,0);
  if(cart.length===0){
    cartItemsEl.innerHTML = '<div>Your cart is empty</div>';
    return;
  }
  cartItemsEl.innerHTML = cart.map(i=>`<div class="card" data-id="${i.id}" style="padding:8px;display:flex;align-items:center;gap:12px">
    <img src="${i.image}" style="width:60px;height:60px;border-radius:8px"/>
    <div style="flex:1">
      <div style="font-weight:700">${i.name}</div>
      <div style="color:var(--muted);font-size:13px">₹${i.price.toFixed(2)} x ${i.qty} = <strong>₹${(i.price*i.qty).toFixed(2)}</strong></div>
      <div style="margin-top:6px;display:flex;gap:8px;align-items:center">
        <button class="cart-dec">-</button>
        <div class="cart-qty">${i.qty}</div>
        <button class="cart-inc">+</button>
        <button class="cart-rem" style="margin-left:8px;color:#c0392b">Remove</button>
      </div>
    </div>
  </div>`).join('');

  // wire cart controls
  cartItemsEl.querySelectorAll('.cart-inc').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const card = e.target.closest('.card'); const id = parseInt(card.dataset.id,10);
      const c = getCart(); const item = c.find(x=>x.id===id); if(item){ item.qty+=1; saveCart(c); }
    });
  });
  cartItemsEl.querySelectorAll('.cart-dec').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const card = e.target.closest('.card'); const id = parseInt(card.dataset.id,10);
      const c = getCart(); const item = c.find(x=>x.id===id); if(item){ item.qty = Math.max(1, item.qty-1); saveCart(c); }
    });
  });
  cartItemsEl.querySelectorAll('.cart-rem').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const card = e.target.closest('.card'); const id = parseInt(card.dataset.id,10);
      let c = getCart(); c = c.filter(x=>x.id!==id); saveCart(c);
    });
  });
}

function starString(n){ return '★'.repeat(n) + '☆'.repeat(5-n); }

function renderProducts(list){
  productsEl.innerHTML = list.map(p=>`<div class="card" data-cat="${p.category}" data-id="${p.id}">
    <div class="card-accent" style="background:linear-gradient(90deg,var(--cat-bg,#4d96ff),rgba(0,0,0,0.02))"></div>
    <div style="display:flex;justify-content:center;padding-top:6px"><img src="${p.image}" alt="${p.name}" style="max-height:140px;object-fit:contain"/></div>
    <h3 style="margin:8px 0 2px">${p.name}</h3>
    <div class="price">₹${p.price.toFixed(2)}</div>
    <div style="display:flex;align-items:center;gap:8px;margin-top:6px">
      <span class="cat-chip ${'cat-'+p.category.replace(/\s+/g,'-')}" style="background:var(--cat-bg,#4d96ff)">${p.category}</span>
      <div class="offer" style="margin-left:auto">${p.offerPercent}% OFF</div>
    </div>
    <div style="margin-top:10px;display:flex;gap:8px"><a class="btn" href="/product.html?id=${p.id}">Details</a> <button class="btn add" data-id="${p.id}" style="background:var(--accent);">Add</button></div>
    <div class="meta" style="margin-top:10px"><span class="rating">${p.avgRating?starString(Math.round(p.avgRating)): 'No ratings'}</span></div>
  </div>`).join('');

  // assign category colors to chips and card accents
  document.querySelectorAll('.card').forEach(card=>{
    const cat = card.dataset.cat || 'mobiles';
    const map = categoryColors[cat] || '#4d96ff';
    card.style.setProperty('--cat-bg', map);
    const chip = card.querySelector('.cat-chip');
    if (chip) chip.style.background = map;
    const ribbonBefore = card.querySelector('.ribbon');
  });

  // add event handlers for add buttons with animation
  document.querySelectorAll('.btn.add').forEach(b=>{
    b.addEventListener('click', async e=>{
      const id = parseInt(e.target.dataset.id,10);
      const res = await fetchJSON('/api/products/' + id);
      const cart = getCart();
      const found = cart.find(x=>x.id===res.id);
      if(found) found.qty += 1; else cart.push({ id: res.id, qty: 1, name: res.name, price: res.price, image: res.image });
      saveCart(cart);
      // animate fly to cart
      flyToCart(e.target);
    });
  });
}

// small animated fly-to-cart effect
function flyToCart(el){
  try{
    const rect = el.getBoundingClientRect();
    const img = document.createElement('div');
    img.className = 'add-fly';
    img.style.left = rect.left + 'px';
    img.style.top = rect.top + 'px';
    img.style.width = rect.width + 'px';
    img.style.height = rect.height + 'px';
    img.style.borderRadius = '8px';
    img.style.background = 'linear-gradient(90deg,var(--accent),var(--accent-2))';
    img.style.opacity = '0.95';
    document.body.appendChild(img);
    const cartEl = cartBtn.getBoundingClientRect();
    requestAnimationFrame(()=>{
      img.style.transform = `translate(${cartEl.left-rect.left}px, ${cartEl.top-rect.top}px) scale(.3)`;
      img.style.opacity = '0';
    });
    setTimeout(()=>img.remove(),800);
  }catch(e){}
}

async function loadProducts(q='', category=''){
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (category) params.set('category', category);
  const list = await fetchJSON('/api/products' + (params.toString()?('?'+params.toString()):''));
  const withRatings = await Promise.all(list.map(async p=>{
    const rev = await fetchJSON('/api/reviews/product/' + p.id);
    const avg = rev.length? (rev.reduce((s,r)=>s+r.rating,0)/rev.length) : 0;
    return Object.assign(p,{ avgRating: avg });
  }));
  renderProducts(withRatings);
}

  document.getElementById('search').addEventListener('input', (e)=> loadProducts(e.target.value));
  // filter button: quick category chooser
  const filterBtn = document.getElementById('filterBtn');
  if(filterBtn){
    filterBtn.addEventListener('click', ()=>{
      const cat = prompt('Enter category to filter (e.g. mobiles, fashion, books)');
      if(cat) loadProducts('', cat.trim());
    });
  }
cartBtn.addEventListener('click', ()=>{ cartPanel.classList.toggle('hidden'); updateCartUI(); });
closeCart.addEventListener('click', ()=> cartPanel.classList.add('hidden'));
loginBtn.addEventListener('click', ()=> loginPanel.classList.toggle('hidden'));
closeLogin.addEventListener('click', ()=> loginPanel.classList.add('hidden'));

registerBtn.addEventListener('click', async ()=>{
  const name = document.getElementById('nameInput').value;
  const email = document.getElementById('emailInput').value;
  const password = document.getElementById('passwordInput').value;
  const r = await fetchJSON('/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,password})});
  if (r.error) alert(r.error); else { alert('Registered'); loginPanel.classList.add('hidden'); }
});

loginSubmitBtn.addEventListener('click', async ()=>{
  const email = document.getElementById('emailInput').value;
  const password = document.getElementById('passwordInput').value;
  const r = await fetchJSON('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
  if (r.error) alert(r.error); else { alert('Logged in as '+r.name); loginPanel.classList.add('hidden'); }
});

// show logged in user (if any)
async function refreshAuth(){
  try{
    const me = await fetchJSON('/api/auth/me');
    if(me && me.user){
      loginBtn.textContent = me.user.name + ' (Logout)';
      loginBtn.onclick = async ()=>{ await fetchJSON('/api/auth/logout',{method:'POST'}); loginBtn.textContent='Login'; location.reload(); };
    } else {
      loginBtn.textContent = 'Login';
      loginBtn.onclick = ()=> loginPanel.classList.toggle('hidden');
    }
  }catch(e){ console.warn('auth refresh failed',e); }
}

refreshAuth();

checkoutBtn.addEventListener('click', async ()=>{
  const cart = getCart();
  if (cart.length===0) return alert('Cart empty');
  const pm = paymentMethod.value;
  const guestName = prompt('Enter your name (if not logged in):');
  const guestEmail = prompt('Enter your email (if not logged in):');
  const r = await fetchJSON('/api/orders/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:cart,paymentMethod:pm,guest:{name:guestName,email:guestEmail}})});
  if (r.error) alert(r.error); else { localStorage.removeItem('cart'); updateCartUI(); alert('Order placed: ' + r.orderId); cartPanel.classList.add('hidden'); }
});

categoryList.addEventListener('click',(e)=>{
  const it = e.target.closest('.category-item');
  if (!it) return;
  const cat = it.dataset.cat;
  loadProducts('', cat);
});

function startHeroCountdown(){
  const until = new Date(Date.now() + 48*60*60*1000);
  const el = document.getElementById('heroCountdown');
  if(!el) return;
  setInterval(()=>{
    const diff = until - Date.now();
    if(diff<=0){ el.textContent = 'Offer ended'; return; }
    const h = String(Math.floor(diff/3600000)).padStart(2,'0');
    const m = String(Math.floor((diff%3600000)/60000)).padStart(2,'0');
    const s = String(Math.floor((diff%60000)/1000)).padStart(2,'0');
    el.textContent = `${h}:${m}:${s}`;
  }, 1000);
}

// initial
loadProducts(); updateCartUI(); startHeroCountdown();
