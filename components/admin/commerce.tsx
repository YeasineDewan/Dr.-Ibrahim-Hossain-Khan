'use client'
import { useState, useMemo } from 'react'
import {
  Plus, Search, Filter, X, Edit3, Trash2, Eye, ChevronRight, Download, Upload, Save, Star,
  Phone, MapPin, Mail, MoreHorizontal, ShoppingBag, Package, Tag, Box, Truck
} from 'lucide-react'
import { Avatar, Drawer, Field, Input, Modal, Pill, Select, Textarea, EmptyState, BarChart } from '../admin-ui'
import type { AdminData, Product, Order, Customer, Coupon } from '../../lib/admin-data'

const formatBn = (n: number) => '৳' + n.toLocaleString('en-IN')

// ────────────────────────────────────────────────────────────
// PRODUCTS
// ────────────────────────────────────────────────────────────
export function ProductsView({ data, copy, onLog, toast }: { data: AdminData; copy: any; onLog: any; toast: any }) {
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('All')
  const [status, setStatus] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [viewing, setViewing] = useState<Product | null>(null)
  const [confirm, setConfirm] = useState<Product | null>(null)

  const filtered = data.products.filter(p => {
    if (search && !`${p.name} ${p.sku} ${p.category}`.toLowerCase().includes(search.toLowerCase())) return false
    if (cat !== 'All' && p.category !== cat) return false
    if (status !== 'All' && p.status !== status) return false
    return true
  })

  const onSave = (p: Product) => { data.addProduct(p); onLog('Dr. Ibrahim', 'updated', `Product ${p.name}`); toast.show(copy.saved); setShowForm(false); setEditing(null) }
  const onDelete = (p: Product) => { data.removeProduct(p.id); onLog('Dr. Ibrahim', 'deleted', `Product ${p.name}`); toast.show(copy.deleted, 'error'); setConfirm(null) }

  return (
    <>
      <section className="adm-page-head">
        <div>
          <span className="pro-kicker">COMMERCE</span>
          <h1>Products</h1>
          <p className="muted-light">{data.products.length} products · {data.products.filter(p => p.stock === 0).length} out of stock · {data.products.filter(p => p.stock < 20 && p.stock > 0).length} low stock</p>
        </div>
        <div className="adm-head-actions">
          <button className="pro-outline"><Upload size={14}/> {copy.import}</button>
          <button className="pro-primary" onClick={() => { setEditing(null); setShowForm(true) }}><Plus size={14}/> Add product</button>
        </div>
      </section>

      <div className="adm-stat-grid adm-stagger">
        <div className="adm-stat-card blue"><strong>{data.products.length}</strong><small>Total products</small></div>
        <div className="adm-stat-card teal"><strong>{data.products.filter(p => p.stock > 0).length}</strong><small>In stock</small></div>
        <div className="adm-stat-card coral"><strong>{data.products.filter(p => p.stock === 0).length}</strong><small>Out of stock</small></div>
        <div className="adm-stat-card gold"><strong>{data.products.reduce((s, p) => s + p.stock, 0)}</strong><small>Total units</small></div>
      </div>

      <section className="pro-panel adm-toolbar">
        <div className="adm-filters">
          <div className="pro-search grow"><Search size={15}/><input placeholder="Search products, SKU, category…" value={search} onChange={e => setSearch(e.target.value)}/></div>
          <Select value={cat} onChange={e => setCat(e.target.value)}>
            <option>All</option>{[...new Set(data.products.map(p => p.category))].map(c => <option key={c}>{c}</option>)}
          </Select>
          <Select value={status} onChange={e => setStatus(e.target.value)}>
            <option>All</option><option>Active</option><option>Draft</option><option>Archived</option>
          </Select>
          <button className="pro-outline" onClick={() => { setSearch(''); setCat('All'); setStatus('All') }}><X size={14}/> {copy.reset}</button>
        </div>
      </section>

      <section className="pro-panel">
        <div className="adm-products-grid adm-stagger">
          {filtered.map(p => (
            <article key={p.id} className="adm-product-card">
              <div className="adm-product-image" style={{ backgroundImage: `url(${p.image})` }}>
                <Pill tone={p.status === 'Active' ? 'teal' : p.status === 'Draft' ? 'sand' : 'neutral'}>{p.status}</Pill>
                {p.stock === 0 && <span className="adm-product-flag">Out of stock</span>}
                {p.stock > 0 && p.stock < 20 && <span className="adm-product-flag coral">Low stock</span>}
              </div>
              <div className="adm-product-meta">
                <small>{p.category} · {p.sku}</small>
                <h4>{p.name}</h4>
                <div className="adm-product-foot">
                  <strong>{formatBn(p.price)}</strong>
                  <span>Stock · {p.stock}</span>
                </div>
                <div className="adm-product-actions">
                  <button onClick={() => setViewing(p)}><Eye size={14}/></button>
                  <button onClick={() => { setEditing(p); setShowForm(true) }}><Edit3 size={14}/></button>
                  <button className="danger" onClick={() => setConfirm(p)}><Trash2 size={14}/></button>
                </div>
              </div>
            </article>
          ))}
        </div>
        {filtered.length === 0 && <EmptyState title="No products found" body="Try a different search or add a new product."/>}
      </section>

      {showForm && <ProductForm initial={editing} onClose={() => { setShowForm(false); setEditing(null) }} onSave={onSave} copy={copy} data={data} />}
      {viewing && <ProductDetail product={viewing} onClose={() => setViewing(null)} copy={copy}/>}
      {confirm && <Modal open onClose={() => setConfirm(null)} title="Delete product?" footer={<><button className="pro-outline" onClick={() => setConfirm(null)}>Cancel</button><button className="pro-danger" onClick={() => onDelete(confirm)}><Trash2 size={14}/> Delete</button></>}><p>Delete <strong>{confirm.name}</strong>? This cannot be undone.</p></Modal>}
    </>
  )
}

function ProductForm({ initial, onClose, onSave, copy, data }: { initial: Product | null; onClose: () => void; onSave: (p: Product) => void; copy: any; data: AdminData }) {
  const [p, setP] = useState<Product>(initial || { id: `PRD-${data.products.length + 100}`, name: '', sku: '', category: copy.categories[0], price: 0, stock: 0, status: 'Active', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=400&q=80' })
  return (
    <Drawer open onClose={onClose} title={initial ? `Edit ${initial.name}` : 'Add product'} width={620}>
      <form className="adm-form" onSubmit={e => { e.preventDefault(); onSave(p) }}>
        <div className="adm-form-grid">
          <Field label="Name" required><Input value={p.name} onChange={e => setP({ ...p, name: e.target.value })}/></Field>
          <Field label="SKU"><Input value={p.sku} onChange={e => setP({ ...p, sku: e.target.value })}/></Field>
          <Field label="Category" required><Select value={p.category} onChange={e => setP({ ...p, category: e.target.value })}>{[...new Set([...copy.categories, ...data.products.map(pr => pr.category)])].map(c => <option key={c}>{c}</option>)}</Select></Field>
          <Field label="Status"><Select value={p.status} onChange={e => setP({ ...p, status: e.target.value as any })}><option>Active</option><option>Draft</option><option>Archived</option></Select></Field>
          <Field label="Price" required><Input type="number" value={p.price} onChange={e => setP({ ...p, price: Number(e.target.value) })}/></Field>
          <Field label="Stock" required><Input type="number" value={p.stock} onChange={e => setP({ ...p, stock: Number(e.target.value) })}/></Field>
        </div>
        <Field label="Image URL"><Input value={p.image} onChange={e => setP({ ...p, image: e.target.value })}/></Field>
        <div className="adm-form-foot"><button type="button" className="pro-outline" onClick={onClose}>{copy.cancel}</button><button type="submit" className="pro-primary"><Save size={14}/> {copy.save}</button></div>
      </form>
    </Drawer>
  )
}

function ProductDetail({ product, onClose, copy }: { product: Product; onClose: () => void; copy: any }) {
  return (
    <Drawer open onClose={onClose} title={product.name} width={520}>
      <img src={product.image} alt={product.name} className="adm-detail-image"/>
      <div className="adm-detail-grid">
        <div><span>SKU</span><strong>{product.sku}</strong></div>
        <div><span>Category</span><strong>{product.category}</strong></div>
        <div><span>Price</span><strong>{formatBn(product.price)}</strong></div>
        <div><span>Stock</span><strong>{product.stock}</strong></div>
        <div><span>Status</span><Pill tone={product.status === 'Active' ? 'teal' : 'sand'}>{product.status}</Pill></div>
      </div>
      <h4 className="adm-section-h">Stock trend (last 30 days)</h4>
      <BarChart values={[18, 16, 14, 15, 17, 13, 12, 10, 8, 9, 7, 5, 6, 4, 5, 3, 2, 3, 2, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0]} labels={['1','5','10','15','20','25','30']}/>
    </Drawer>
  )
}

// ────────────────────────────────────────────────────────────
// CATEGORIES
// ────────────────────────────────────────────────────────────
export function CategoriesView({ data, copy, onLog, toast }: { data: AdminData; copy: any; onLog: any; toast: any }) {
  const [show, setShow] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const onSave = (c: any) => { data.addCategory(c); toast.show(copy.saved); onLog('Dr. Ibrahim', 'updated', `Category ${c.name}`); setShow(false); setEditing(null) }
  return (
    <>
      <section className="adm-page-head">
        <div><span className="pro-kicker">COMMERCE</span><h1>Categories</h1><p className="muted-light">{data.categories.length} categories</p></div>
        <div className="adm-head-actions"><button className="pro-primary" onClick={() => { setEditing(null); setShow(true) }}><Plus size={14}/> Add category</button></div>
      </section>
      <section className="pro-panel">
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Name</th><th>Slug</th><th>Products</th><th>Status</th><th/></tr></thead>
            <tbody>
              {data.categories.map((c: any) => (
                <tr key={c.id}>
                  <td><div className="adm-cell-person"><span className="adm-cat-mark"><Tag size={14}/></span><strong>{c.name}</strong></div></td>
                  <td><span className="adm-code">{c.slug}</span></td>
                  <td>{c.products}</td>
                  <td><Pill tone={c.status === 'Active' ? 'teal' : 'sand'}>{c.status}</Pill></td>
                  <td><div className="adm-row-actions"><button onClick={() => { setEditing(c); setShow(true) }}><Edit3 size={14}/></button><button className="danger" onClick={() => { data.removeCategory(c.id); toast.show(copy.deleted, 'error') }}><Trash2 size={14}/></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {show && (
        <Modal open onClose={() => setShow(false)} title={editing ? 'Edit category' : 'Add category'} footer={<><button className="pro-outline" onClick={() => setShow(false)}>Cancel</button><button className="pro-primary" onClick={() => onSave(editing || { id: `CAT-${data.categories.length + 100}`, name: 'New', slug: 'new', products: 0, status: 'Active' })}><Save size={14}/> Save</button></>}>
          <Field label="Name" required><Input value={editing?.name || ''} onChange={e => setEditing({ ...(editing || {}), name: e.target.value })}/></Field>
          <Field label="Slug" required><Input value={editing?.slug || ''} onChange={e => setEditing({ ...(editing || {}), slug: e.target.value })}/></Field>
          <Field label="Status"><Select value={editing?.status || 'Active'} onChange={e => setEditing({ ...(editing || {}), status: e.target.value })}><option>Active</option><option>Inactive</option></Select></Field>
        </Modal>
      )}
    </>
  )
}

// ────────────────────────────────────────────────────────────
// INVENTORY
// ────────────────────────────────────────────────────────────
export function InventoryView({ data, copy, onLog, toast }: { data: AdminData; copy: any; onLog: any; toast: any }) {
  const [tab, setTab] = useState<'all' | 'low' | 'out'>('all')
  const list = data.products.filter(p => tab === 'all' ? true : tab === 'low' ? (p.stock > 0 && p.stock < 20) : p.stock === 0)
  return (
    <>
      <section className="adm-page-head">
        <div><span className="pro-kicker">COMMERCE</span><h1>Inventory</h1><p className="muted-light">Stock overview across all products</p></div>
        <div className="adm-head-actions">
          <button className="pro-outline" onClick={() => toast.show('Export queued', 'info')}><Download size={14}/> Export</button>
          <button className="pro-primary"><Plus size={14}/> Add stock</button>
        </div>
      </section>
      <div className="adm-tabs">
        <button className={tab === 'all' ? 'on' : ''} onClick={() => setTab('all')}>All <span>{data.products.length}</span></button>
        <button className={tab === 'low' ? 'on' : ''} onClick={() => setTab('low')}>Low stock <span>{data.products.filter(p => p.stock > 0 && p.stock < 20).length}</span></button>
        <button className={tab === 'out' ? 'on' : ''} onClick={() => setTab('out')}>Out of stock <span>{data.products.filter(p => p.stock === 0).length}</span></button>
      </div>
      <section className="pro-panel">
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Product</th><th>SKU</th><th>Stock</th><th>Value</th><th>Status</th><th/></tr></thead>
            <tbody>
              {list.map((p: any) => (
                <tr key={p.id}>
                  <td><div className="adm-cell-person"><img src={p.image} alt=""/><strong>{p.name}</strong></div></td>
                  <td><span className="adm-code">{p.sku}</span></td>
                  <td>
                    <div className="adm-stock-cell">
                      <div className="adm-stock-bar"><span style={{ width: `${Math.min(100, (p.stock / 50) * 100)}%`, background: p.stock === 0 ? '#e77761' : p.stock < 20 ? '#e3a443' : '#3b9b91' }}/></div>
                      <strong>{p.stock}</strong>
                    </div>
                  </td>
                  <td><strong>{formatBn(p.stock * p.price)}</strong></td>
                  <td><Pill tone={p.stock === 0 ? 'coral' : p.stock < 20 ? 'gold' : 'teal'}>{p.stock === 0 ? 'Out of stock' : p.stock < 20 ? 'Low' : 'In stock'}</Pill></td>
                  <td><button className="pro-text-link">Adjust</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

// ────────────────────────────────────────────────────────────
// ORDERS
// ────────────────────────────────────────────────────────────
export function OrdersView({ data, copy, onLog, toast }: { data: AdminData; copy: any; onLog: any; toast: any }) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [payment, setPayment] = useState('All')
  const [viewing, setViewing] = useState<Order | null>(null)
  const filtered = data.orders.filter(o => {
    if (search && !`${o.id} ${o.customer}`.toLowerCase().includes(search.toLowerCase())) return false
    if (status !== 'All' && o.status !== status) return false
    if (payment !== 'All' && o.payment !== payment) return false
    return true
  })
  const statuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled']
  return (
    <>
      <section className="adm-page-head">
        <div><span className="pro-kicker">COMMERCE</span><h1>Orders</h1><p className="muted-light">{data.orders.length} orders · {data.orders.filter(o => o.status === 'Processing').length} processing</p></div>
        <div className="adm-head-actions"><button className="pro-outline"><Download size={14}/> Export</button></div>
      </section>
      <section className="pro-panel adm-toolbar">
        <div className="adm-filters">
          <div className="pro-search grow"><Search size={15}/><input placeholder="Search by ID or customer…" value={search} onChange={e => setSearch(e.target.value)}/></div>
          <Select value={status} onChange={e => setStatus(e.target.value)}><option>All</option>{statuses.map(s => <option key={s}>{s}</option>)}</Select>
          <Select value={payment} onChange={e => setPayment(e.target.value)}><option>All</option>{copy.paymentStatuses.map((p: string) => <option key={p}>{p}</option>)}</Select>
        </div>
      </section>
      <section className="pro-panel">
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th/></tr></thead>
            <tbody>
              {filtered.map((o: any) => (
                <tr key={o.id} onClick={() => setViewing(o)}>
                  <td><span className="adm-code">{o.id}</span></td>
                  <td><div className="adm-cell-person"><Avatar name={o.customer} size={28}/><strong>{o.customer}</strong></div></td>
                  <td>{o.date}</td>
                  <td>{o.items.length} item{o.items.length > 1 ? 's' : ''}</td>
                  <td><strong>{formatBn(o.total)}</strong></td>
                  <td><Pill tone={o.payment === 'Paid' ? 'teal' : o.payment === 'Pending' ? 'sand' : o.payment === 'Refunded' ? 'coral' : 'neutral'}>{o.payment}</Pill></td>
                  <td><Pill tone={o.status === 'Delivered' ? 'teal' : o.status === 'Shipped' ? 'blue' : o.status === 'Cancelled' ? 'coral' : 'gold'}>{o.status}</Pill></td>
                  <td><button className="pro-text-link" onClick={(e) => { e.stopPropagation(); setViewing(o) }}><Eye size={14}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {viewing && (
        <Drawer open onClose={() => setViewing(null)} title={viewing.id} width={560}>
          <div className="adm-detail">
            <div className="adm-detail-hero">
              <Avatar name={viewing.customer} size={56}/>
              <div><h3>{viewing.customer}</h3><p className="muted-light">{viewing.date}</p><Pill tone={viewing.status === 'Delivered' ? 'teal' : 'gold'}>{viewing.status}</Pill></div>
            </div>
            <h4 className="adm-section-h">Items</h4>
            <ul className="adm-rx-list">
              {viewing.items.map((i: any, n: number) => <li key={n}><Box size={16}/><div className="grow"><strong>{i.name}</strong><small>Qty {i.qty} · {formatBn(i.price)}</small></div><strong>{formatBn(i.qty * i.price)}</strong></li>)}
            </ul>
            <div className="adm-detail-grid">
              <div><span>Subtotal</span><strong>{formatBn(viewing.total)}</strong></div>
              <div><span>Shipping</span><strong>{formatBn(0)}</strong></div>
              <div><span>Total</span><strong>{formatBn(viewing.total)}</strong></div>
              <div><span>Payment</span><Pill tone="teal">{viewing.payment}</Pill></div>
            </div>
            <h4 className="adm-section-h">Shipping address</h4>
            <p>{viewing.address}</p>
            <div className="adm-form-foot">
              <button className="pro-outline" onClick={() => toast.show('Invoice downloaded', 'info')}><Download size={14}/> Invoice</button>
              <button className="pro-primary" onClick={() => toast.show('Status updated', 'info')}>Mark as shipped</button>
            </div>
          </div>
        </Drawer>
      )}
    </>
  )
}

// ────────────────────────────────────────────────────────────
// CUSTOMERS
// ────────────────────────────────────────────────────────────
export function CustomersView({ data, copy }: { data: AdminData; copy: any }) {
  const [search, setSearch] = useState('')
  const filtered = data.customers.filter((c: any) => !search || `${c.name} ${c.email} ${c.phone}`.toLowerCase().includes(search.toLowerCase()))
  return (
    <>
      <section className="adm-page-head">
        <div><span className="pro-kicker">COMMERCE</span><h1>Customers</h1><p className="muted-light">{data.customers.length} customers</p></div>
      </section>
      <section className="pro-panel adm-toolbar">
        <div className="adm-filters">
          <div className="pro-search grow"><Search size={15}/><input placeholder="Search customers…" value={search} onChange={e => setSearch(e.target.value)}/></div>
        </div>
      </section>
      <section className="pro-panel">
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Customer</th><th>Contact</th><th>Orders</th><th>Spent</th><th>Joined</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map((c: any) => (
                <tr key={c.id}>
                  <td><div className="adm-cell-person"><Avatar name={c.name}/><div><strong>{c.name}</strong><small>{c.id}</small></div></div></td>
                  <td><div className="adm-contact-cell"><span><Mail size={11}/> {c.email}</span><span><Phone size={11}/> {c.phone}</span></div></td>
                  <td><strong>{c.orders}</strong></td>
                  <td><strong>{formatBn(c.spent)}</strong></td>
                  <td>{c.joined}</td>
                  <td><Pill tone={c.status === 'Active' ? 'teal' : 'sand'}>{c.status}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

// ────────────────────────────────────────────────────────────
// COUPONS
// ────────────────────────────────────────────────────────────
export function CouponsView({ data, copy, onLog, toast }: { data: AdminData; copy: any; onLog: any; toast: any }) {
  const [show, setShow] = useState(false)
  const [editing, setEditing] = useState<Coupon | null>(null)
  const onSave = (c: Coupon) => { data.addCoupon(c); toast.show(copy.saved); onLog('Dr. Ibrahim', 'updated', `Coupon ${c.code}`); setShow(false); setEditing(null) }
  return (
    <>
      <section className="adm-page-head">
        <div><span className="pro-kicker">COMMERCE</span><h1>Coupons</h1><p className="muted-light">{data.coupons.length} coupons · {data.coupons.filter(c => c.status === 'Active').length} active</p></div>
        <div className="adm-head-actions"><button className="pro-primary" onClick={() => { setEditing(null); setShow(true) }}><Plus size={14}/> Add coupon</button></div>
      </section>
      <section className="pro-panel">
        <div className="adm-coupon-grid adm-stagger">
          {data.coupons.map((c: any) => (
            <article key={c.id} className={`adm-coupon tone-${c.status.toLowerCase()}`}>
              <div className="adm-coupon-dots"/>
              <div className="adm-coupon-content">
                <div className="adm-coupon-head">
                  <Pill tone={c.status === 'Active' ? 'teal' : c.status === 'Expired' ? 'coral' : 'sand'}>{c.status}</Pill>
                  <div className="adm-row-actions">
                    <button onClick={() => { setEditing(c); setShow(true) }}><Edit3 size={14}/></button>
                    <button className="danger" onClick={() => { data.removeCoupon(c.id); toast.show(copy.deleted, 'error') }}><Trash2 size={14}/></button>
                  </div>
                </div>
                <h3>{c.code}</h3>
                <strong>{c.type === 'Percent' ? `${c.value}% OFF` : `${formatBn(c.value)} OFF`}</strong>
                <small>Min order: {formatBn(c.minOrder)} · Expires {c.expiry}</small>
                <div className="adm-coupon-uses"><div className="adm-stock-bar"><span style={{ width: `${(c.uses / c.maxUses) * 100}%` }}/></div><span>{c.uses} / {c.maxUses} used</span></div>
              </div>
            </article>
          ))}
        </div>
      </section>
      {show && <CouponForm initial={editing} onClose={() => { setShow(false); setEditing(null) }} onSave={onSave} data={data} copy={copy}/>}
    </>
  )
}

function CouponForm({ initial, onClose, onSave, data, copy }: { initial: Coupon | null; onClose: () => void; onSave: (c: Coupon) => void; data: AdminData; copy: any }) {
  const [c, setC] = useState<Coupon>(initial || { id: `CP-${data.coupons.length + 100}`, code: 'NEW10', type: 'Percent', value: 10, minOrder: 50, uses: 0, maxUses: 100, expiry: '2026-12-31', status: 'Active' })
  return (
    <Drawer open onClose={onClose} title={initial ? `Edit ${initial.code}` : 'Add coupon'} width={520}>
      <form className="adm-form" onSubmit={e => { e.preventDefault(); onSave(c) }}>
        <div className="adm-form-grid">
          <Field label="Code" required><Input value={c.code} onChange={e => setC({ ...c, code: e.target.value.toUpperCase() })}/></Field>
          <Field label="Type"><Select value={c.type} onChange={e => setC({ ...c, type: e.target.value as any })}><option>Percent</option><option>Flat</option></Select></Field>
          <Field label="Value" required><Input type="number" value={c.value} onChange={e => setC({ ...c, value: Number(e.target.value) })}/></Field>
          <Field label="Min order"><Input type="number" value={c.minOrder} onChange={e => setC({ ...c, minOrder: Number(e.target.value) })}/></Field>
          <Field label="Max uses"><Input type="number" value={c.maxUses} onChange={e => setC({ ...c, maxUses: Number(e.target.value) })}/></Field>
          <Field label="Expiry"><Input type="date" value={c.expiry} onChange={e => setC({ ...c, expiry: e.target.value })}/></Field>
        </div>
        <Field label="Status"><Select value={c.status} onChange={e => setC({ ...c, status: e.target.value as any })}><option>Active</option><option>Scheduled</option><option>Expired</option></Select></Field>
        <div className="adm-form-foot"><button type="button" className="pro-outline" onClick={onClose}>{copy.cancel}</button><button type="submit" className="pro-primary"><Save size={14}/> {copy.save}</button></div>
      </form>
    </Drawer>
  )
}
