import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, Monitor, ShoppingBag, Trash2, Plus, MessageCircle, 
  ShieldCheck, Zap, X, HardDrive, Gamepad2, ArrowLeft, 
  ChevronRight, Fan, Box, Edit3, Save, AlertCircle, CheckCircle2,
  Database, ShieldAlert, WifiOff, RefreshCcw
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, onSnapshot, addDoc, 
  updateDoc, deleteDoc, doc 
} from 'firebase/firestore';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';

/**
 * --- HỆ THỐNG XỬ LÝ CẤU HÌNH AN TOÀN ---
 * Khắc phục lỗi "import.meta" và loại bỏ hoàn toàn các ký tự gây lỗi JSX
 */
const getSafeEnvValue = (key) => {
  try {
    // Kiểm tra import.meta một cách an toàn thông qua một biến trung gian
    const metaEnv = (import.meta && import.meta.env) ? import.meta.env : {};
    return metaEnv[key] || null;
  } catch (e) {
    return null;
  }
};

const getFirebaseConfig = () => {
  // Lấy cấu hình từ Vercel Env hoặc từ biến toàn cục của môi trường demo
  let raw = getSafeEnvValue('VITE_FIREBASE_CONFIG') || (typeof __firebase_config !== 'undefined' ? __firebase_config : null);
  
  if (!raw) return null;
  if (typeof raw === 'object') return raw;

  try {
    // Dọn dẹp chuỗi JSON (xử lý các ký tự xuống dòng và khoảng trắng từ Vercel)
    const clean = raw.trim()
      .replace(/^(const|let|var)\s+\w+\s*=\s*/, '')
      .replace(/;$/, '')
      .replace(/[\n\r]/g, '')
      .replace(/\s+/g, ' ');

    return JSON.parse(clean);
  } catch (e) {
    console.error("Cấu hình Firebase không hợp lệ:", e);
    return null;
  }
};

const fConfig = getFirebaseConfig();
const appId = getSafeEnvValue('VITE_APP_ID') || (typeof __app_id !== 'undefined' ? __app_id : 'tech-pc-pro-store');

let db = null;
let auth = null;

if (fConfig && fConfig.apiKey) {
  try {
    const app = initializeApp(fConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (e) { 
    console.error("Lỗi khởi tạo Firebase:", e); 
  }
}

/**
 * --- COMPONENT NỀN NEURAL NETWORK 3D ---
 */
const TechBackground = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    });
    resize();

    const particles = [];
    for (let i = 0; i < 75; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 800,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1
      });
    }

    const animate = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const grad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0, 
        canvas.width / 2, canvas.height / 2, canvas.width
      );
      grad.addColorStop(0, '#0a1a3c');
      grad.addColorStop(0.8, '#000000');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const fov = 400;
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        const scale = fov / (fov + p.z + 100);
        if (scale <= 0) return;
        const x2d = (p.x - canvas.width / 2) * scale + canvas.width / 2;
        const y2d = (p.y - canvas.height / 2) * scale + canvas.height / 2;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.sqrt(Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2));
          if (dist < 150) {
            ctx.beginPath();
            const alpha = (1 - dist / 150) * 0.25 * scale;
            ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
            ctx.lineWidth = 0.6 * scale;
            ctx.moveTo(x2d, y2d);
            const s2 = fov / (fov + p2.z + 100);
            ctx.lineTo((p2.x - canvas.width / 2) * s2 + canvas.width / 2, (p2.y - canvas.height / 2) * s2 + canvas.height / 2);
            ctx.stroke();
          }
        }
        
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${scale * 0.8})`;
        ctx.arc(x2d, y2d, Math.max(0.1, p.size * scale), 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => { 
      window.removeEventListener('resize', resize); 
      cancelAnimationFrame(animationFrameId); 
    };
  }, []);

  return <div className="fixed inset-0 -z-50 bg-black"><canvas ref={canvasRef} className="w-full h-full" /></div>;
};

export default function App() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [status, setStatus] = useState({ type: '', msg: '' });
  
  const [formData, setFormData] = useState({
    name: '', price: '', specs: '', image: '', category: 'Gaming', description: '',
    fullSpecs: { cpu: '', gpu: '', ram: '', ssd: '', case: '', cooling: '' },
    gallery: []
  });

  const MESSENGER_ID = getSafeEnvValue('VITE_MESSENGER_ID') || "YOUR_PAGE_ID";

  useEffect(() => {
    if (status.msg) {
      const timer = setTimeout(() => setStatus({ type: '', msg: '' }), 6000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) { 
        setStatus({ type: 'error', msg: 'Lỗi Firebase Auth: ' + err.message }); 
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!db || !user) return;
    // Sử dụng path chuẩn cho Firestore
    const colRef = collection(db, 'artifacts', appId, 'public', 'data', 'products');
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      setProducts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => {
      if (err.code === 'permission-denied') {
        setStatus({ type: 'error', msg: 'Lỗi quyền: Hãy chỉnh Rules Firestore thành "allow read, write: if true;"' });
      }
    });
    return () => unsubscribe();
  }, [user, appId]);

  useEffect(() => {
    if (selectedProduct) {
      setActiveImage(selectedProduct.image);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedProduct]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!db || !user) return;
    setStatus({ type: 'loading', msg: 'Đang đẩy dữ liệu lên Cloud...' });
    const colRef = collection(db, 'artifacts', appId, 'public', 'data', 'products');
    try {
      const data = { 
        ...formData, 
        gallery: formData.gallery && formData.gallery.length ? formData.gallery : [formData.image],
        updatedAt: Date.now() 
      };
      if (modalType === 'add') {
        await addDoc(colRef, data);
        setStatus({ type: 'success', msg: 'Đã lưu sản phẩm mới!' });
      } else {
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'products', editingItem.id), data);
        setStatus({ type: 'success', msg: 'Đã cập nhật cấu hình!' });
      }
      setModalType(null);
    } catch (err) { 
      setStatus({ type: 'error', msg: 'Lỗi lưu: ' + err.message }); 
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!db || !user || !confirm("Xóa PC này khỏi Cloud?")) return;
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'products', id));
      if (selectedProduct?.id === id) setSelectedProduct(null);
      setStatus({ type: 'success', msg: 'Đã xóa sản phẩm.' });
    } catch (err) { 
      setStatus({ type: 'error', msg: 'Lỗi xóa: ' + err.message }); 
    }
  };

  return (
    <div className="min-h-screen text-white font-sans selection:bg-cyan-500 bg-transparent relative overflow-x-hidden">
      <TechBackground />
      
      <div className="fixed inset-0 pointer-events-none -z-40 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

      {status.msg && (
        <div className={`fixed top-24 right-6 z-[200] flex items-center gap-4 px-6 py-5 rounded-3xl border backdrop-blur-2xl animate-in slide-in-from-right shadow-2xl ${status.type === 'error' ? 'bg-red-500/20 border-red-500/50 text-red-100' : status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-100' : 'bg-cyan-500/10 border-cyan-500/40 text-cyan-100'}`}>
          {status.type === 'error' ? <ShieldAlert size={24} className="text-red-400" /> : status.type === 'loading' ? <RefreshCcw size={24} className="animate-spin text-cyan-400" /> : <CheckCircle2 size={24} className="text-emerald-400" />}
          <div>
            <p className="font-black text-xs uppercase tracking-widest leading-none mb-1">{status.type === 'error' ? 'Hệ thống báo lỗi' : 'Thông báo'}</p>
            <p className="text-sm opacity-80 font-medium">{status.msg}</p>
          </div>
        </div>
      )}

      {!fConfig && (
        <div className="max-w-3xl mx-auto mt-32 p-10 bg-black/80 border border-white/10 rounded-[3rem] backdrop-blur-xl text-center shadow-2xl animate-in zoom-in duration-700">
          <WifiOff size={48} className="mx-auto text-red-500 mb-6" />
          <h2 className="text-2xl font-black uppercase mb-4 tracking-tighter italic">CHƯA KẾT NỐI DATABASE</h2>
          <p className="text-gray-400 mb-10 leading-relaxed italic">Vercel chưa nhận được biến môi trường hoặc bạn cần <strong>Redeploy</strong> lại dự án sau khi lưu biến.</p>
          <div className="bg-black/50 p-6 rounded-3xl text-left mb-10 border border-white/5 text-xs text-gray-300">
             <p className="text-[10px] font-black uppercase text-gray-500 mb-2">Cách khắc phục:</p>
             <ul className="space-y-2 list-disc ml-4">
                <li>Vào tab <strong>Deployments</strong> trên Vercel.</li>
                <li>Chọn bản build mới nhất, nhấn dấu 3 chấm {'→'} <strong>Redeploy</strong>.</li>
                <li>Đảm bảo biến <strong>VITE_FIREBASE_CONFIG</strong> là 1 dòng duy nhất.</li>
             </ul>
          </div>
          <button onClick={() => window.location.reload()} className="bg-white text-black px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-xl">Tải lại trang</button>
        </div>
      )}

      {fConfig && (
        <>
          <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
              <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setSelectedProduct(null)}>
                <div className="bg-cyan-500 p-2 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:scale-110 transition-all">
                  <Cpu className="text-black w-6 h-6" />
                </div>
                <span className="text-2xl font-black tracking-tighter uppercase italic">TECH<span className="text-cyan-400">PC</span> PRO</span>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => setIsAdmin(!isAdmin)} className={`text-[10px] font-black uppercase px-4 py-2 rounded-full border transition-all ${isAdmin ? "text-red-500 border-red-500/30" : "text-gray-500 border-white/10"}`}>
                  {isAdmin ? "Admin: ON" : "Admin Mode"}
                </button>
                {isAdmin && <button onClick={() => { setEditingItem(null); setModalType('add'); }} className="bg-cyan-500 text-black p-2.5 rounded-xl hover:rotate-90 transition-all shadow-xl"><Plus size={20}/></button>}
              </div>
            </div>
          </nav>

          {!selectedProduct ? (
            <main className="max-w-7xl mx-auto px-6 py-20 animate-in fade-in duration-1000">
              <header className="text-center mb-24 relative">
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-8">
                  <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Cloud Inventory: {products.length} Machines</span>
                </div>
                <h1 className="text-7xl md:text-9xl font-black mb-10 tracking-tighter uppercase italic leading-none">
                  FUTURE <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient-x">SYSTEMS</span>
                </h1>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                {products.length === 0 && <div className="col-span-full py-20 opacity-30 italic uppercase tracking-[0.4em] font-black text-center">Đang đồng bộ từ Cloud...</div>}
                {products.map(p => (
                  <div key={p.id} className="group relative bg-white/[0.03] border border-white/10 rounded-[3.5rem] overflow-hidden hover:border-cyan-500/50 transition-all duration-700 flex flex-col shadow-2xl backdrop-blur-sm">
                    <div className="h-80 overflow-hidden relative cursor-pointer" onClick={() => setSelectedProduct(p)}>
                      <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={p.name} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#000] via-transparent to-transparent opacity-90"></div>
                      <div className="absolute top-8 left-8"><span className="bg-cyan-500 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">{p.category}</span></div>
                      {isAdmin && (
                        <div className="absolute top-8 right-8 flex gap-2">
                          <button onClick={(e) => { e.stopPropagation(); setEditingItem(p); setFormData(p); setModalType('edit'); }} className="bg-blue-500/80 p-3 rounded-2xl text-white shadow-xl transition-all active:scale-90"><Edit3 size={16}/></button>
                          <button onClick={(e) => handleDelete(p.id, e)} className="bg-red-500/80 p-3 rounded-2xl text-white shadow-xl transition-all active:scale-90"><Trash2 size={16}/></button>
                        </div>
                      )}
                    </div>
                    <div className="p-12 flex flex-col flex-grow">
                      <h3 className="text-2xl font-black uppercase mb-4 group-hover:text-cyan-400 transition-colors cursor-pointer tracking-tight leading-tight italic" onClick={() => setSelectedProduct(p)}>{p.name}</h3>
                      <p className="text-gray-500 text-sm mb-12 line-clamp-2 italic leading-relaxed">{p.specs}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-3xl font-black tracking-tighter text-white italic">{p.price}₫</span>
                        <button onClick={() => setSelectedProduct(p)} className="w-16 h-16 bg-white text-black rounded-3xl flex items-center justify-center hover:bg-cyan-400 hover:scale-105 transition-all shadow-xl active:scale-90 shadow-cyan-500/10">
                          <ChevronRight size={28}/>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          ) : (
            <main className="max-w-6xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-right-12 duration-700">
              <button onClick={() => setSelectedProduct(null)} className="flex items-center gap-3 text-gray-400 hover:text-white mb-16 transition-all group font-black uppercase tracking-[0.4em] text-[10px]">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" /> Back to Store
              </button>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
                <div className="flex flex-col">
                  <div className="aspect-square rounded-[5rem] overflow-hidden border border-white/10 bg-white/5 shadow-2xl relative mb-10 group">
                    <img src={activeImage || selectedProduct.image} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" alt={selectedProduct.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none opacity-60"></div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 px-2">
                    {(selectedProduct.gallery || [selectedProduct.image]).map((img, idx) => (
                      <button key={idx} onClick={() => setActiveImage(img)} className={`aspect-square rounded-[1.5rem] overflow-hidden border-2 transition-all hover:scale-110 ${activeImage === img ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.6)] scale-105' : 'border-white/5 opacity-50 hover:opacity-100'}`}>
                        <img src={img} className="w-full h-full object-cover" alt="Preview" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <span className="text-cyan-400 font-black tracking-[0.5em] text-[10px] uppercase mb-4 block italic">Precision Engineering</span>
                  <h2 className="text-6xl md:text-7xl font-black mb-10 tracking-tighter leading-none italic uppercase">{selectedProduct.name}</h2>
                  <p className="text-5xl font-black text-white mb-12 tracking-tighter italic border-l-4 border-cyan-500 pl-8 bg-white/5 py-4 rounded-r-3xl shadow-xl shadow-cyan-900/10">
                    {selectedProduct.price}₫
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
                     <DetailItem Icon={Cpu} label="Vi xử lý" value={selectedProduct.fullSpecs?.cpu} />
                     <DetailItem Icon={Zap} label="Đồ họa" value={selectedProduct.fullSpecs?.gpu} />
                     <DetailItem Icon={HardDrive} label="RAM / SSD" value={selectedProduct.fullSpecs?.ram} />
                     <DetailItem Icon={ShieldCheck} label="Bảo hành" value="36 Tháng" />
                     <DetailItem Icon={Fan} label="Tản nhiệt" value={selectedProduct.fullSpecs?.cooling} />
                     <DetailItem Icon={Box} label="Vỏ máy" value={selectedProduct.fullSpecs?.case} />
                  </div>

                  <button onClick={() => {
                    const msg = `Xin chào! Tôi muốn build hệ thống: ${selectedProduct.name} (Giá: ${selectedProduct.price}đ)`;
                    window.open(`https://m.me/${MESSENGER_ID}?text=${encodeURIComponent(msg)}`, '_blank');
                  }} className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 text-black py-8 rounded-[2.5rem] font-black text-2xl uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-6 group italic shadow-cyan-500/20">
                    <MessageCircle size={32}/> BUILD MY SYSTEM
                  </button>
                </div>
              </div>
            </main>
          )}
        </>
      )}

      {modalType && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-2xl rounded-[4rem] p-16 shadow-2xl my-auto animate-in zoom-in duration-300">
            <h2 className="text-4xl font-black mb-12 uppercase italic tracking-tighter">{modalType === 'add' ? 'Deploy System' : 'Update Specs'}</h2>
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <InputBox label="Tên bộ máy" value={formData.name} onChange={v => setFormData({...formData, name: v})} />
                <InputBox label="Giá bán (Số)" value={formData.price} onChange={v => setFormData({...formData, price: v})} />
                <InputBox label="Ảnh bìa URL" value={formData.image} onChange={v => setFormData({...formData, image: v})} />
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-500 ml-4 italic">Cấu hình vắn tắt</label>
                  <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-cyan-500 h-24 transition-all italic" value={formData.specs} onChange={e => setFormData({...formData, specs: e.target.value})} />
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-cyan-400 font-bold text-xs uppercase italic tracking-widest mb-2">Detailed Components</p>
                <InputBox label="CPU" value={formData.fullSpecs?.cpu} onChange={v => setFormData({...formData, fullSpecs: {...formData.fullSpecs, cpu: v}})} />
                <InputBox label="GPU" value={formData.fullSpecs?.gpu} onChange={v => setFormData({...formData, fullSpecs: {...formData.fullSpecs, gpu: v}})} />
                <InputBox label="RAM" value={formData.fullSpecs?.ram} onChange={v => setFormData({...formData, fullSpecs: {...formData.fullSpecs, ram: v}})} />
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-500 ml-4 italic">Ảnh Gallery (Dấu phẩy)</label>
                  <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-cyan-500 h-20 text-xs transition-all italic" value={formData.gallery?.join(', ')} onChange={e => setFormData({...formData, gallery: e.target.value.split(',').map(s => s.trim())})} />
                </div>
              </div>
              <div className="col-span-full flex gap-4 pt-6">
                <button type="submit" disabled={status.type === 'loading'} className="flex-1 bg-cyan-500 text-black font-black py-6 rounded-2xl shadow-xl hover:bg-cyan-400 uppercase flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 italic">
                  <Save size={20}/> {status.type === 'loading' ? 'Đang lưu...' : 'Lưu Cloud'}
                </button>
                <button type="button" onClick={() => setModalType(null)} className="px-10 bg-white/5 rounded-2xl font-black uppercase text-xs tracking-widest text-gray-500 hover:bg-white/10 transition-all italic">Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="py-24 text-center opacity-30 italic"><p className="text-[10px] font-black uppercase tracking-[1em]">TechPC Pro Studio © 2024</p></footer>
    </div>
  );
}

function InputBox({ label, value, onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-black uppercase text-gray-500 ml-4 italic">{label}</label>
      <input required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-cyan-500 font-bold transition-all shadow-inner" value={value || ''} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

function DetailItem({ Icon, label, value }) {
  return (
    <div className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] flex items-center gap-5 hover:bg-white/10 transition-all group backdrop-blur-sm shadow-xl border-white/5">
      <div className="text-cyan-400 group-hover:scale-110 transition-transform">
        {Icon && <Icon className="w-7 h-7" />}
      </div>
      <div>
        <div className="text-[9px] font-black uppercase text-gray-500 tracking-widest italic">{label}</div>
        <div className="text-sm font-bold text-white truncate max-w-[140px]">{value || "High-End"}</div>
      </div>
    </div>
  );
}