const PRODUCTS = [
 {id:1,name:'Эластичный бинт',category:'first-aid',description:'Для домашней аптечки',price:18000,icon:'🩹'},
 {id:2,name:'Набор пластырей',category:'first-aid',description:'Разные размеры, 20 шт.',price:12000,icon:'🩹'},
 {id:3,name:'Марлевые салфетки',category:'first-aid',description:'Стерильные салфетки',price:15000,icon:'🧻'},
 {id:4,name:'Антисептик для рук',category:'care',description:'Средство для гигиены рук',price:22000,icon:'🧴'},
 {id:5,name:'Жидкое мыло',category:'care',description:'Для ежедневной гигиены',price:19000,icon:'🫧'},
 {id:6,name:'Солнцезащитный крем',category:'care',description:'Средство для ухода за кожей',price:65000,icon:'☀️'},
 {id:7,name:'Электронный термометр',category:'devices',description:'Прибор для измерения температуры',price:45000,icon:'🌡️'},
 {id:8,name:'Медицинская маска',category:'care',description:'Одноразовая маска',price:3000,icon:'😷'}
];
const money = n => new Intl.NumberFormat('ru-RU').format(n) + ' сум';
const getCart = () => JSON.parse(localStorage.getItem('medpoint-cart') || '[]');
const saveCart = cart => { localStorage.setItem('medpoint-cart',JSON.stringify(cart)); updateCount(); };
function updateCount(){const count=getCart().reduce((s,x)=>s+x.qty,0);document.querySelectorAll('.cart-count').forEach(el=>el.textContent=count);}
function productCard(p){return `<article class="product-card"><div class="product-icon">${p.icon}</div><h3>${p.name}</h3><p>${p.description}</p><div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-btn" data-add="${p.id}">+ В корзину</button></div></article>`;}
function renderProducts(target,items){if(!target)return;target.innerHTML=items.length?items.map(productCard).join(''):'<div class="empty-state">Ничего не найдено. Попробуйте изменить поиск.</div>';}
function addToCart(id){const cart=getCart();const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id,qty:1});saveCart(cart);}
document.addEventListener('click',e=>{
 const add=e.target.closest('[data-add]');if(add){addToCart(Number(add.dataset.add));add.textContent='Добавлено ✓';setTimeout(()=>add.textContent='+ В корзину',900);}
 const toggle=e.target.closest('.menu-toggle');if(toggle)document.querySelector('nav')?.classList.toggle('open');
 const action=e.target.closest('[data-cart-action]');if(action){const id=Number(action.dataset.id),act=action.dataset.cartAction;let cart=getCart();const item=cart.find(x=>x.id===id);if(item){if(act==='plus')item.qty++;if(act==='minus')item.qty--;if(act==='remove'||item.qty<=0)cart=cart.filter(x=>x.id!==id);saveCart(cart);renderCart();}}
});
const featured=document.querySelector('#featured-products');if(featured)renderProducts(featured,PRODUCTS.slice(0,4));
const catalog=document.querySelector('#catalog-products');
if(catalog){const search=document.querySelector('#search-input'),filter=document.querySelector('#category-filter');const params=new URLSearchParams(location.search);if(params.get('category'))filter.value=params.get('category');const update=()=>renderProducts(catalog,PRODUCTS.filter(p=>(filter.value==='all'||p.category===filter.value)&&p.name.toLowerCase().includes(search.value.toLowerCase())));search.addEventListener('input',update);filter.addEventListener('change',update);update();}
function renderCart(){const root=document.querySelector('#cart-content');if(!root)return;const cart=getCart();if(!cart.length){root.innerHTML='<div class="empty-state"><h2>Корзина пока пуста</h2><p>Добавьте товары из каталога.</p><a class="btn" href="catalog.html">Открыть каталог</a></div>';return;}let total=0;const rows=cart.map(item=>{const p=PRODUCTS.find(x=>x.id===item.id);if(!p)return '';total+=p.price*item.qty;return `<div class="cart-row"><div><strong>${p.icon} ${p.name}</strong><p>${money(p.price)} за шт.</p></div><div class="qty-controls"><button data-cart-action="minus" data-id="${p.id}">−</button><strong>${item.qty}</strong><button data-cart-action="plus" data-id="${p.id}">+</button></div><div><strong>${money(p.price*item.qty)}</strong> <button class="remove-btn" data-cart-action="remove" data-id="${p.id}" aria-label="Удалить">×</button></div></div>`;}).join('');root.innerHTML=`${rows}<div class="cart-summary"><p>Итого</p><strong>${money(total)}</strong><br><button class="btn" id="demo-order">Оформить (демо)</button><p class="form-message">Демонстрация: заказ не будет отправлен.</p></div>`;document.querySelector('#demo-order')?.addEventListener('click',()=>alert('Это учебный макет. Реальный заказ и оплата не выполняются.'));}renderCart();updateCount();
document.querySelector('#contact-form')?.addEventListener('submit',e=>{e.preventDefault();document.querySelector('#form-message').textContent='Спасибо! Это демонстрационная форма — сообщение не отправлено.';e.target.reset();});
