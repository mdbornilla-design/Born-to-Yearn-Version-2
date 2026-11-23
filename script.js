/* Born to Yearn — shared logic for every page. Catalog lives in catalog.js */
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const hash = s => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const products = CATALOG.map(([name, category, price, brand, description, specs, tag]) => ({
  id: slug(name), name, category, price, brand, description, tag: tag || "", specs: specs.split("|"),
  stock: 4 + (hash(name) % 7), sku: "BY-" + String(hash(name) % 100000).padStart(5, "0"),
  link: `https://www.google.com/search?q=${encodeURIComponent(name + " official site")}`
}));
const categories = [...new Set(products.map(p => p.category))];
const FEATURED = ["razer-blade-16", "wooting-60he", "logitech-g-pro-x-superlight-2", "hyperx-cloud-iii-wireless", "lg-ultragear-27gr95qe", "secretlab-titan-evo", "asus-rog-zephyrus-g14", "keychron-q1-pro"];
const FREE_SHIP = 5000, SHIP_FEE = 250;
const VOUCHERS = { BORN10: { type: "pct", val: .1, min: 0, label: "10% off" }, YEARN500: { type: "flat", val: 500, min: 10000, label: "₱500 off ₱10,000+" } };

const ICONS = {
  Laptops: '<rect x="12" y="14" width="40" height="28" rx="3"/><path d="M6 46h52l-4 6H10z"/><path d="M28 50h8"/>',
  Keyboards: '<rect x="4" y="18" width="56" height="28" rx="4"/><path d="M12 26h4M20 26h4M28 26h4M36 26h4M44 26h4M12 34h4M20 34h4M28 34h4M36 34h4M44 34h4M18 41h28"/>',
  Mice: '<rect x="19" y="8" width="26" height="48" rx="13"/><path d="M32 8v18M19 26h26"/>',
  Headsets: '<path d="M12 36v-6a20 20 0 0 1 40 0v6"/><rect x="8" y="34" width="11" height="17" rx="4"/><rect x="45" y="34" width="11" height="17" rx="4"/><path d="M52 51q0 8-13 8"/>',
  Monitors: '<rect x="5" y="10" width="54" height="35" rx="3"/><path d="M24 55h16M32 45v10"/>',
  Chairs: '<path d="M23 7h18l3 24H20z"/><path d="M15 36h34v6H15zM32 42v10M19 59l13-7 13 7M11 29v11M53 29v11"/>'
};
const icon = c => `<svg viewBox="0 0 64 64" aria-hidden="true">${ICONS[c]}</svg>`;
const money = v => new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(v);
const esc = v => String(v).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const dayOffset = n => { const d = new Date(); d.setDate(d.getDate() - n); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
const dateLabel = d => new Date(`${d}T12:00:00`).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
const byId = id => products.find(p => p.id === id);
const art = p => `${icon(p.category)}<img class="shot" src="images/products/${p.id}.jpg" alt="${esc(p.name)}" loading="lazy" onerror="this.remove()">`;

/* ---------- storage ---------- */
const store = { get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } } };
const price = id => byId(id)?.price || 0;
const mk = (id, customer, d, payment, status, items) => ({ id, customer, date: dayOffset(d), payment, status, shipping: 0, discount: 0, items: items.map(([productId, quantity]) => ({ productId, quantity, unitPrice: price(productId) })) });
const seed = [
  mk("BY-1005", "Jamie R.", 0, "GCash", "Processing", [["razer-blade-16", 1]]),
  mk("BY-1004", "Kai M.", 1, "Credit / debit card", "Processing", [["wooting-60he", 1], ["hyperx-cloud-iii-wireless", 1]]),
  mk("BY-1003", "Alex D.", 2, "Cash on delivery", "Shipped", [["secretlab-titan-evo", 1]]),
  mk("BY-1002", "Sam T.", 4, "Bank transfer", "Delivered", [["logitech-g-pro-x-superlight-2", 2]]),
  mk("BY-1001", "Riley C.", 6, "GCash", "Delivered", [["lg-ultragear-27gr95qe", 1]])
];
const KEY_O = "born-to-yearn-orders-v3";
let orders = (() => { const l = store.get(KEY_O, null); return Array.isArray(l) ? l.filter(o => o && o.id && Array.isArray(o.items) && o.items.every(i => byId(i.productId))) : seed; })();
let cart = store.get("bty-cart", []).filter(i => byId(i.id) && i.qty > 0);
let wish = store.get("bty-wish", []).filter(byId);
let voucher = store.get("bty-voucher", "");
let rerender = () => {};

const sold = id => orders.reduce((t, o) => t + o.items.filter(i => i.productId === id).reduce((s, i) => s + i.quantity, 0), 0);
const inCart = id => cart.find(i => i.id === id)?.qty || 0;
const left = p => Math.max(0, p.stock - sold(p.id) - inCart(p.id));
const orderSub = o => o.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
const orderTotal = o => orderSub(o) + (o.shipping || 0) - (o.discount || 0);

function totals() {
  const sub = cart.reduce((s, i) => s + byId(i.id).price * i.qty, 0), v = VOUCHERS[voucher];
  const disc = v && sub >= v.min ? (v.type === "pct" ? Math.round(sub * v.val) : v.val) : 0;
  const ship = !sub || sub - disc >= FREE_SHIP ? 0 : SHIP_FEE;
  return { sub, disc, ship, total: sub - disc + ship };
}

let toastTimer;
function toast(msg) { const t = $("#toast"); if (!t) return; t.textContent = msg; t.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2800); }
function badges() {
  const c = $("#cartCount"); if (c) c.textContent = cart.reduce((t, i) => t + i.qty, 0);
  const w = $("#wishCount"); if (w) w.textContent = wish.length || "";
}
const saveCart = () => { store.set("bty-cart", cart); badges(); };
function addToCart(id, qty = 1) {
  const p = byId(id);
  if (!p || left(p) < 1) { toast("That gear is out of stock."); return false; }
  const n = Math.min(qty, left(p)), row = cart.find(i => i.id === id);
  row ? row.qty += n : cart.push({ id, qty: n });
  saveCart(); toast(`${p.name} added to your bag.`); return true;
}
function setQty(id, qty) {
  const p = byId(id), row = cart.find(i => i.id === id); if (!row) return;
  row.qty = Math.min(qty, p.stock - sold(id));
  if (row.qty <= 0) cart = cart.filter(i => i !== row);
  saveCart();
}
function toggleWish(id) {
  wish = wish.includes(id) ? wish.filter(x => x !== id) : [...wish, id];
  store.set("bty-wish", wish); badges(); toast(wish.includes(id) ? "Saved to your wishlist." : "Removed from wishlist.");
}

/* ---------- shared layout ---------- */
const NAV = [["home", "index.html", "Home"], ["shop", "shop.html", "Shop"], ["orders", "orders.html", "Orders"], ["about", "about.html", "About"], ["support", "support.html", "Support"]];
function layout() {
  const page = document.body.dataset.page, navPage = page === "product" || page === "cart" ? "shop" : page;
  $("#hdr").outerHTML = `<header class="site-header">
    <a class="brand" href="index.html" aria-label="Born to Yearn home"><img src="images/logo.svg" alt=""><span>BORN TO <b>YEARN</b></span></a>
    <nav class="site-nav" id="nav" aria-label="Main">
      <form class="hsearch navsearch" action="shop.html" role="search"><input name="q" type="search" placeholder="Search gear…" aria-label="Search gear"></form>
      ${NAV.map(([k, h, t]) => `<a href="${h}" class="${k === navPage ? "active" : ""}">${t}</a>`).join("")}
    </nav>
    <div class="hdr-actions">
      <a class="icon-btn" href="shop.html?saved=1" aria-label="Saved items">♡ <i id="wishCount"></i></a>
      <a class="cart-button" href="cart.html" aria-label="Open shopping bag">Bag <span class="cart-count" id="cartCount">0</span></a>
      <button class="burger" id="burger" type="button" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
    </div></header>`;
  $("#ftr").outerHTML = `<footer class="site-footer"><div class="wrap fgrid">
    <div><a class="brand" href="index.html"><img src="images/logo.svg" alt=""><span>BORN TO <b>YEARN</b></span></a><p>Handpicked gaming laptops, keyboards, mice, headsets, monitors and chairs — priced in pesos.</p></div>
    <div><h4>SHOP</h4>${categories.map(c => `<a href="shop.html?cat=${c}">${c}</a>`).join("")}</div>
    <div><h4>COMPANY</h4><a href="about.html">Our story</a><a href="about.html#founders">Founders</a><a href="orders.html">Orders &amp; tracking</a><a href="support.html">Support &amp; FAQ</a></div>
    <div><h4>STAY IN THE LOOP</h4><form class="nl" id="nlForm"><input type="email" placeholder="you@email.com" aria-label="Email" required><button class="btn btn-primary" type="submit">Join</button></form><p>New drops and deals. No spam.</p></div>
  </div><div class="wrap fbar"><span>© Born to Yearn · Sample store for a school project. Prices in PHP.</span><a href="#top">BACK TO TOP ↑</a></div></footer>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>`;
  $("#burger").addEventListener("click", () => { const o = document.body.classList.toggle("nav-open"); $("#burger").setAttribute("aria-expanded", o); });
  $("#nav").addEventListener("click", e => { if (e.target.closest("a")) document.body.classList.remove("nav-open"); });
  $("#nlForm").addEventListener("submit", e => { e.preventDefault(); e.target.reset(); toast("Thanks for joining! (demo — nothing is sent)"); });
  badges();
}

/* ---------- shared components ---------- */
function card(p) {
  const l = left(p);
  return `<article class="card">
    <a class="art" href="product.html?id=${p.id}" aria-label="View ${esc(p.name)}">${art(p)}${p.tag ? `<span class="tag">${esc(p.tag)}</span>` : ""}<span class="brand-tag">${esc(p.brand)}</span></a>
    <button class="heart ${wish.includes(p.id) ? "on" : ""}" type="button" data-heart="${p.id}" aria-pressed="${wish.includes(p.id)}" aria-label="Save ${esc(p.name)}">♥</button>
    <div class="body"><a class="name" href="product.html?id=${p.id}">${esc(p.name)}</a><p class="desc">${esc(p.description)}</p>
      <ul class="specs">${p.specs.slice(0, 3).map(s => `<li>${esc(s)}</li>`).join("")}</ul>
      <div class="buy"><div class="price"><strong>${money(p.price)}</strong><small>${l ? `${l} in stock` : "Sold out"}</small></div>
      <button class="add" type="button" data-add="${p.id}" ${l ? "" : "disabled"} aria-label="Add ${esc(p.name)} to bag">${l ? "Add ＋" : "Sold out"}</button></div></div></article>`;
}
document.addEventListener("click", e => {
  const a = e.target.closest("[data-add]"); if (a) { addToCart(a.dataset.add); return rerender(); }
  const h = e.target.closest("[data-heart]"); if (h) { toggleWish(h.dataset.heart); rerender(); }
});

/* ---------- pages ---------- */
const PAGES = {
  home() {
    $("#catTiles").innerHTML = categories.map(c => { const l = products.filter(p => p.category === c); return `<a class="tile" href="shop.html?cat=${c}">${icon(c)}<b>${c}</b><small>${l.length} items · from ${money(Math.min(...l.map(p => p.price)))}</small></a>`; }).join("");
    rerender = () => { $("#featured").innerHTML = FEATURED.map(id => card(byId(id))).join(""); };
    rerender();
    $("#sProducts").textContent = products.length; $("#sOrders").textContent = orders.length; $("#sCats").textContent = categories.length;
  },

  shop() {
    const u = new URLSearchParams(location.search), top = Math.ceil(Math.max(...products.map(p => p.price)) / 5000) * 5000;
    const st = { cat: categories.includes(u.get("cat")) ? u.get("cat") : "all", q: u.get("q") || "", saved: u.get("saved") === "1", max: top, stock: false, sort: "featured" };
    const range = $("#maxPrice"); range.max = top; range.value = top; $("#productSearch").value = st.q;
    rerender = () => {
      $("#chips").innerHTML = ["all", ...categories].map(c => `<button class="chip ${!st.saved && c === st.cat ? "on" : ""}" type="button" data-cat="${c}">${c === "all" ? "All gear" : c}<i>${c === "all" ? products.length : products.filter(p => p.category === c).length}</i></button>`).join("") + `<button class="chip ${st.saved ? "on" : ""}" type="button" data-saved>♥ Saved<i>${wish.length}</i></button>`;
      const q = st.q.trim().toLowerCase();
      const list = products.filter(p => (st.saved ? wish.includes(p.id) : st.cat === "all" || p.category === st.cat) && p.price <= st.max && (!st.stock || left(p) > 0) && `${p.name} ${p.brand} ${p.category} ${p.description} ${p.specs.join(" ")}`.toLowerCase().includes(q));
      if (st.sort === "asc") list.sort((a, b) => a.price - b.price); if (st.sort === "desc") list.sort((a, b) => b.price - a.price); if (st.sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
      $("#grid").innerHTML = list.map(card).join("");
      $("#results").textContent = `${list.length} ${list.length === 1 ? "product" : "products"}`;
      $("#maxLabel").textContent = st.max >= top ? "Any price" : `Up to ${money(st.max)}`;
      $("#empty").classList.toggle("hidden", list.length > 0);
      $("#empty").innerHTML = st.saved && !wish.length ? "No saved items yet. Tap the ♥ on any product to save it." : "No gear found. Try another search or filter.";
    };
    $("#chips").addEventListener("click", e => { const b = e.target.closest(".chip"); if (!b) return; if (b.hasAttribute("data-saved")) st.saved = !st.saved; else { st.saved = false; st.cat = b.dataset.cat; } rerender(); });
    $("#productSearch").addEventListener("input", e => { st.q = e.target.value; rerender(); });
    $("#sort").addEventListener("change", e => { st.sort = e.target.value; rerender(); });
    range.addEventListener("input", e => { st.max = +e.target.value; rerender(); });
    $("#inStock").addEventListener("change", e => { st.stock = e.target.checked; rerender(); });
    rerender();
  },

  product() {
    const p = byId(new URLSearchParams(location.search).get("id")), box = $("#pdp");
    if (!p) { box.innerHTML = `<div class="empty">That product wasn't found. <a href="shop.html">Back to the shop →</a></div>`; return; }
    document.title = `${p.name} — Born to Yearn`; let qty = 1;
    rerender = () => {
      const l = left(p); qty = Math.max(1, Math.min(qty, l || 1));
      $("#crumbs").innerHTML = `<a href="index.html">HOME</a> / <a href="shop.html">SHOP</a> / <a href="shop.html?cat=${p.category}">${p.category.toUpperCase()}</a> / ${esc(p.name.toUpperCase())}`;
      box.innerHTML = `<div class="pdp-art">${art(p)}${p.tag ? `<span class="tag">${esc(p.tag)}</span>` : ""}</div>
      <div class="pdp-info"><p class="eyebrow">${esc(p.brand)} · ${esc(p.category.toUpperCase())}</p><h1>${esc(p.name)}</h1><p class="sub">${esc(p.description)}</p>
        <div class="pdp-price"><strong>${money(p.price)}</strong><small class="${l > 3 ? "stock-ok" : l ? "stock-low" : "stock-out"}">${l > 3 ? `In stock · ${l} available` : l ? `Only ${l} left` : "Sold out"}</small></div>
        <ul class="speclist">${p.specs.map(s => `<li>${esc(s)}</li>`).join("")}</ul>
        <div class="buyrow"><div class="qty"><button type="button" data-q="-1" aria-label="Decrease">−</button><span>${qty}</span><button type="button" data-q="1" ${qty >= l ? "disabled" : ""} aria-label="Increase">＋</button></div>
          <button class="btn btn-primary" type="button" id="addBtn" ${l ? "" : "disabled"}>Add to bag ＋</button>
          <button class="btn btn-ghost" type="button" id="buyNow" ${l ? "" : "disabled"}>Buy now</button>
          <button class="heart ${wish.includes(p.id) ? "on" : ""}" style="position:static" type="button" data-heart="${p.id}" aria-label="Save">♥</button></div>
        <div class="facts"><div class="glass"><b>Shipping</b>Free over ${money(FREE_SHIP)}, otherwise ${money(SHIP_FEE)} flat.</div><div class="glass"><b>Returns</b>7-day return window (sample policy).</div></div>
        <div class="glass facts-kv"><div><span>SKU</span>${p.sku}</div><div><span>Brand</span>${esc(p.brand)}</div><div><span>Category</span>${esc(p.category)}</div><div><span>Manufacturer</span><a href="${esc(p.link)}" target="_blank" rel="noopener noreferrer" style="color:var(--pink)">Find official page ↗</a></div></div>
      </div>`;
      const rel = products.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
      $("#related").innerHTML = rel.map(card).join("");
    };
    box.addEventListener("click", e => {
      const q = e.target.closest("[data-q]"); if (q) { qty += +q.dataset.q; return rerender(); }
      if (e.target.closest("#addBtn")) { if (addToCart(p.id, qty)) { qty = 1; rerender(); } }
      if (e.target.closest("#buyNow") && addToCart(p.id, qty)) location.href = "cart.html";
    });
    rerender();
  },

  cart() {
    const f = $("#checkoutForm"); $("#orderDate").value = dayOffset(0);
    rerender = () => {
      const t = totals(), pct = Math.min(100, Math.round((t.sub - t.disc) / FREE_SHIP * 100));
      $("#cartList").innerHTML = cart.length ? cart.map(i => { const p = byId(i.id); return `<div class="crow glass"><a class="art" href="product.html?id=${p.id}">${art(p)}</a>
        <div><strong>${esc(p.name)}</strong><small>${money(p.price)} each</small><div class="qty"><button type="button" data-cq="${p.id}:-1" aria-label="Decrease">−</button><span>${i.qty}</span><button type="button" data-cq="${p.id}:1" ${left(p) ? "" : "disabled"} aria-label="Increase">＋</button></div></div>
        <div class="rt"><b>${money(p.price * i.qty)}</b><button class="rm" type="button" data-rm="${p.id}">Remove</button></div></div>`; }).join("") : `<div class="empty glass">Your bag is empty. <a href="shop.html">Browse the shop →</a></div>`;
      $("#sub").textContent = money(t.sub); $("#disc").textContent = t.disc ? "−" + money(t.disc) : "—"; $("#ship").textContent = t.ship ? money(t.ship) : (t.sub ? "Free" : "—"); $("#grand").textContent = money(t.total);
      $("#shipbar").innerHTML = t.sub ? (t.ship ? `Add <b>${money(FREE_SHIP - (t.sub - t.disc))}</b> more for free shipping` : "🎉 You've unlocked free shipping") + `<div><i style="width:${pct}%"></i></div>` : "";
      $("#placeBtn").disabled = !cart.length; $("#vMsg").textContent = voucher && VOUCHERS[voucher] ? `Applied: ${voucher} (${VOUCHERS[voucher].label})` : "Try BORN10 for 10% off.";
    };
    $("#cartList").addEventListener("click", e => {
      const q = e.target.closest("[data-cq]"); if (q) { const [id, d] = q.dataset.cq.split(":"); setQty(id, inCart(id) + +d); return rerender(); }
      const r = e.target.closest("[data-rm]"); if (r) { setQty(r.dataset.rm, 0); rerender(); }
    });
    $("#voucherForm").addEventListener("submit", e => {
      e.preventDefault(); const c = $("#voucherCode").value.trim().toUpperCase(), v = VOUCHERS[c];
      if (!v) return toast("That code isn't valid.");
      if (totals().sub < v.min) return toast(`That code needs ${money(v.min)} or more in your bag.`);
      voucher = c; store.set("bty-voucher", c); toast(`Code ${c} applied.`); rerender();
    });
    f.addEventListener("submit", e => {
      e.preventDefault(); if (!cart.length) return; const t = totals();
      const nums = orders.map(o => Number(o.id.split("-")[1]) || 0), id = `BY-${Math.max(1000, ...nums) + 1}`;
      const order = { id, customer: $("#customerName").value.trim(), payment: $("#paymentMethod").value, date: $("#orderDate").value, status: "Processing", shipping: t.ship, discount: t.disc, address: $("#address").value.trim(), items: cart.map(i => ({ productId: i.id, quantity: i.qty, unitPrice: byId(i.id).price })) };
      if (!store.set(KEY_O, [order, ...orders])) return toast("Order could not be saved in this browser.");
      store.set("bty-cart", []); store.set("bty-voucher", ""); location.href = `orders.html?new=${id}`;
    });
    rerender();
  },

  orders() {
    const STEPS = ["Order placed", "Packed", "Shipped", "Out for delivery", "Delivered"], REACHED = { Processing: 2, Shipped: 3, Delivered: 5 };
    const newId = new URLSearchParams(location.search).get("new");
    if (newId && orders.some(o => o.id === newId)) { const b = $("#banner"); b.classList.remove("hidden"); b.textContent = `🎉 Order ${newId} placed! Thanks for shopping Born to Yearn. (Demo checkout — no payment was collected.)`; }
    const render = () => {
      const q = $("#orderSearch").value.trim().toLowerCase(), sorted = [...orders].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
      const list = sorted.filter(o => `${o.id} ${o.customer} ${o.payment} ${o.status} ${o.items.map(i => byId(i.productId).name).join(" ")}`.toLowerCase().includes(q));
      $("#ordersTable").innerHTML = list.map(o => `<tr><td data-l="ORDER"><span class="oid">${esc(o.id)}</span></td><td data-l="CUSTOMER" class="who">${esc(o.customer)}</td>
        <td data-l="ITEMS" class="items">${o.items.map(i => `${esc(byId(i.productId).name)}${i.quantity > 1 ? ` <span>× ${i.quantity}</span>` : ""}`).join("<br>")}</td>
        <td data-l="DATE">${dateLabel(o.date)}</td><td data-l="PAYMENT"><span class="pill">${esc(o.payment)}</span></td><td data-l="STATUS"><span class="pill st-${o.status}">${o.status}</span></td><td data-l="TOTAL" class="r amt">${money(orderTotal(o))}</td></tr>`).join("");
      $("#emptyOrders").classList.toggle("hidden", list.length > 0);
      $("#oCount").textContent = `Showing ${list.length} of ${orders.length} orders`;
      $("#oSales").textContent = money(orders.reduce((s, o) => s + orderTotal(o), 0)); $("#oNum").textContent = orders.length;
      $("#oItems").textContent = orders.reduce((s, o) => s + o.items.reduce((t, i) => t + i.quantity, 0), 0);
    };
    $("#orderSearch").addEventListener("input", render); render();
    $("#trackForm").addEventListener("submit", e => {
      e.preventDefault(); const id = $("#trackId").value.trim().toUpperCase(), o = orders.find(x => x.id === id), out = $("#trackResult");
      if (!o) { out.innerHTML = `<p class="note">No order found for “${esc(id)}”. Check the ID (example: BY-1005).</p>`; return; }
      const n = REACHED[o.status] || 1;
      out.innerHTML = `<p class="note" style="color:var(--ink)">${esc(o.id)} · ${esc(o.customer)} · ${dateLabel(o.date)} · <b class="amt">${money(orderTotal(o))}</b></p><ol class="timeline">${STEPS.map((s, i) => `<li class="${i < n ? "done" : ""}">${s}</li>`).join("")}</ol>`;
    });
    if (newId) { $("#trackId").value = newId; $("#trackForm").requestSubmit(); }
  },

  support() {
    $("#contactForm").addEventListener("submit", e => { e.preventDefault(); e.target.reset(); toast("Message sent! (demo — nothing is actually sent)"); });
  }
};

layout();
PAGES[document.body.dataset.page]?.();
