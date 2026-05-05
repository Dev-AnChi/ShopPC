import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, ShoppingBag, Trash2, Plus, MessageCircle, 
  Zap, X, ChevronRight, ArrowLeft, HardDrive, 
  ShieldCheck, Fan, Box, Monitor, Gamepad2 
} from 'lucide-react';

/**
 * --- COMPONENT NỀN NEURAL NETWORK 3D ---
 * Thiết kế mới với độ tương phản cực cao và chiều sâu không gian
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

    const handleMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();

    // Khởi tạo các hạt phân tử (Nodes)
    const particles = [];
    const particleCount = 80;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000, // Chiều sâu Z
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1
      });
    }

    const animate = (time) => {
      // Vẽ nền Gradient đa tầng để tạo chiều sâu tối
      const bgGrad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width
      );
      bgGrad.addColorStop(0, '#0a1a3c');
      bgGrad.addColorStop(0.5, '#02040a');
      bgGrad.addColorStop(1, '#000000');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const fov = 400;

      particles.forEach((p, i) => {
        // Di chuyển hạt
        p.x += p.vx;
        p.y += p.vy;

        // Xử lý va chạm biên
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Phối cảnh 3D
        const scale = fov / (fov + p.z);
        const x2d = (p.x - canvas.width / 2) * scale + canvas.width / 2;
        const y2d = (p.y - canvas.height / 2) * scale + canvas.height / 2;

        // Vẽ các đường nối (Mạng lưới Network)
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.sqrt(Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2));
          
          if (dist < 150) {
            ctx.beginPath();
            const alpha = (1 - dist / 150) * 0.4 * scale;
            ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`; // Cyan mờ
            ctx.lineWidth = 0.5 * scale;
            ctx.moveTo(x2d, y2d);
            const scale2 = fov / (fov + p2.z);
            ctx.lineTo((p2.x - canvas.width / 2) * scale2 + canvas.width / 2, (p2.y - canvas.height / 2) * scale2 + canvas.height / 2);
            ctx.stroke();
          }
        }

        // Tương tác chuột: Kết nối với chuột
        const mDist = Math.sqrt(Math.pow(mouse.current.x - x2d, 2) + Math.pow(mouse.current.y - y2d, 2));
        if (mDist < 200) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - mDist / 200) * 0.5})`;
          ctx.lineWidth = 1;
          ctx.moveTo(x2d, y2d);
          ctx.lineTo(mouse.current.x, mouse.current.y);
          ctx.stroke();
        }

        // Vẽ Hạt (Node)
        const radius = Math.max(0.1, p.size * scale);
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${scale * 0.8})`;
        ctx.arc(x2d, y2d, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Hiệu ứng Glow cho hạt ở gần
        if (scale > 0.7) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#22d3ee';
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate(0);
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-50 bg-black">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

// --- DỮ LIỆU SẢN PHẨM MẪU ---
const INITIAL_PRODUCTS = [
  { 
    id: 1, 
    name: "CYBERCORE I9 ULTIMATE", 
    price: "85.900.000", 
    category: "Extreme Gaming",
    specs: "i9 14900K | RTX 4090 24GB | 64GB DDR5 | 2TB SSD",
    description: "Bộ máy tính mạnh nhất hiện nay với tản nhiệt Custom cao cấp.",
    image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=800",
    gallery: [
      "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1555617766-c94804975da3?auto=format&fit=crop&q=80&w=800"
    ],
    details: { cpu: "Intel Core i9-14900K", vga: "RTX 4090 24GB", ram: "64GB DDR5", ssd: "2TB Gen5", psu: "1200W", case: "Lian Li" }
  },
  { 
    id: 2, 
    name: "WORKSTATION PRO RENDER", 
    price: "52.500.000", 
    category: "Professional",
    specs: "Ryzen 9 7950X | RTX 4080 Super | 32GB RAM",
    description: "Giải pháp đồ họa và render 3D chuyên nghiệp cho studio.",
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800",
    gallery: [
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800"
    ],
    details: { cpu: "Ryzen 9 7950X", vga: "RTX 4080 Super", ram: "32GB DDR5", ssd: "1TB NVMe", psu: "850W", case: "Fractal Design" }
  },
  { 
    id: 3, 
    name: "STREAMPUNK EDITION", 
    price: "34.200.000", 
    category: "Gaming/Streaming",
    specs: "i7 13700F | RTX 4070 | 32GB RAM | RGB",
    description: "Thiết kế cực đẹp với hệ thống tản nhiệt nước và đèn LED ARGB.",
    image: "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?auto=format&fit=crop&q=80&w=800",
    gallery: [
      "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1603481546238-487240415921?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1625842268584-8f3bf9ff16a0?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800"
    ],
    details: { cpu: "Core i7-13700F", vga: "RTX 4070 12GB", ram: "32GB RGB", ssd: "1TB Gen4", psu: "750W", case: "NZXT" }
  }
];

export default function App() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', specs: '', image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=800', category: 'Gaming' });

  const MESSENGER_ID = "YOUR_PAGE_ID"; 

  useEffect(() => {
    if (selectedProduct) {
      setActiveImage(selectedProduct.image);
      window.scrollTo(0, 0);
    }
  }, [selectedProduct]);

  const handleOrder = (product) => {
    const message = `Xin chào! Tôi muốn tư vấn bộ PC: ${product.name}\nGiá: ${product.price}đ`;
    window.open(`https://m.me/${MESSENGER_ID}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const addProduct = (e) => {
    e.preventDefault();
    const itemToAdd = {
      ...newProduct,
      id: Date.now(),
      gallery: [newProduct.image],
      details: { cpu: "High-End", vga: "RTX Series", ram: "32GB DDR5", ssd: "1TB NVMe", psu: "Gold", case: "Premium" }
    };
    setProducts([itemToAdd, ...products]);
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen text-white font-sans selection:bg-cyan-500 bg-transparent">
      {/* Lớp nền Canvas (Neural Grid) */}
      <TechBackground />
      
      {/* Lớp phủ Texture Carbon mờ */}
      <div className="fixed inset-0 pointer-events-none -z-40 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setSelectedProduct(null)}>
            <div className="bg-cyan-500 p-2 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.5)] group-hover:scale-110 transition-all">
              <Cpu className="text-black w-6 h-6" />
            </div>
            <span className="text-2xl font-black uppercase italic tracking-tighter">TECH<span className="text-cyan-400">PC</span> PRO</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsAdmin(!isAdmin)} className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border transition-all ${isAdmin ? "text-red-500 border-red-500/30 bg-red-500/5" : "text-gray-500 border-white/10"}`}>
              {isAdmin ? "ADMIN: ON" : "ADMIN LOGIN"}
            </button>
            {isAdmin && <button onClick={() => setShowAddModal(true)} className="bg-cyan-500 text-black p-2 rounded-xl hover:rotate-90 transition-all"><Plus size={20}/></button>}
          </div>
        </div>
      </nav>

      {!selectedProduct ? (
        /* --- VIEW 1: DANH SÁCH SẢN PHẨM --- */
        <main className="max-w-7xl mx-auto px-6 py-20 animate-in fade-in duration-1000">
          <header className="text-center mb-24 relative">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-8">
              <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Master Performance Gear</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-black mb-10 tracking-tighter uppercase italic leading-none">
              DESIGN <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient-x">YOUR POWER</span>
            </h1>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {products.map(product => (
              <div key={product.id} className="group relative bg-white/[0.03] border border-white/10 rounded-[3.5rem] overflow-hidden hover:border-cyan-500/50 hover:bg-white/[0.05] transition-all duration-700 flex flex-col shadow-2xl backdrop-blur-sm">
                <div className="h-80 overflow-hidden relative cursor-pointer" onClick={() => setSelectedProduct(product)}>
                  <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={product.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000] via-transparent to-transparent opacity-90"></div>
                  <div className="absolute top-8 left-8">
                    <span className="bg-cyan-500 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="p-12 flex flex-col flex-grow">
                  <h3 className="text-2xl font-black uppercase mb-4 group-hover:text-cyan-400 transition-colors cursor-pointer tracking-tight" onClick={() => setSelectedProduct(product)}>{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-12 line-clamp-2 italic leading-relaxed">{product.specs}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-3xl font-black tracking-tighter text-white italic">{product.price}₫</span>
                    <button onClick={() => setSelectedProduct(product)} className="w-16 h-16 bg-white text-black rounded-3xl flex items-center justify-center hover:bg-cyan-400 hover:scale-105 transition-all shadow-xl active:scale-90 shadow-cyan-500/20">
                      <ChevronRight size={28}/>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      ) : (
        /* --- VIEW 2: TRANG CHI TIẾT SẢN PHẨM (DETAIL VIEW) --- */
        <main className="max-w-6xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-right-12 duration-700">
          <button onClick={() => setSelectedProduct(null)} className="flex items-center gap-3 text-gray-500 hover:text-white mb-16 transition-all group font-black uppercase tracking-[0.4em] text-[10px]">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" /> Back to Store
          </button>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            {/* Cột trái: Gallery & Main Image */}
            <div className="flex flex-col">
              <div className="aspect-square rounded-[5rem] overflow-hidden border border-white/10 bg-white/5 shadow-2xl relative mb-10 group">
                <img src={activeImage} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" alt={selectedProduct.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none opacity-60"></div>
              </div>

              {/* Bộ sưu tập ảnh nhỏ (Thumbnails) */}
              <div className="flex gap-4 justify-center">
                {selectedProduct.gallery?.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-24 h-24 rounded-[2rem] overflow-hidden border-2 transition-all hover:scale-110 ${activeImage === img ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.6)] scale-105' : 'border-white/10 opacity-40 hover:opacity-100'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt="Preview" />
                  </button>
                ))}
              </div>
            </div>

            {/* Cột phải: Spec Sheet */}
            <div className="flex flex-col justify-center">
              <span className="text-cyan-400 font-black tracking-[0.5em] text-[10px] uppercase mb-4 block italic">Precision Engineering</span>
              <h2 className="text-6xl md:text-7xl font-black mb-10 tracking-tighter leading-none italic uppercase">{selectedProduct.name}</h2>
              <p className="text-5xl font-black text-white mb-12 tracking-tighter italic border-l-4 border-cyan-500 pl-8 bg-white/5 py-4 rounded-r-3xl shadow-xl shadow-cyan-900/10">
                {selectedProduct.price}₫
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
                 <DetailItem Icon={Cpu} label="Vi xử lý" value={selectedProduct.details?.cpu} />
                 <DetailItem Icon={Zap} label="Đồ họa" value={selectedProduct.details?.vga} />
                 <DetailItem Icon={HardDrive} label="RAM / SSD" value={selectedProduct.details?.ram} />
                 <DetailItem Icon={ShieldCheck} label="Bảo hành" value={selectedProduct.details?.psu || "36 Tháng"} />
                 <DetailItem Icon={Fan} label="Tản nhiệt" value={selectedProduct.details?.cooling} />
                 <DetailItem Icon={Box} label="Vỏ máy" value={selectedProduct.details?.case} />
              </div>

              <button 
                onClick={() => handleOrder(selectedProduct)}
                className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-400 text-black py-8 rounded-[2.5rem] font-black text-2xl uppercase tracking-[0.2em] transition-all shadow-[0_0_40px_rgba(6,182,212,0.3)] active:scale-95 flex items-center justify-center gap-6 group italic"
              >
                <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                BUILD MY SYSTEM
              </button>
            </div>
          </div>
        </main>
      )}

      {/* MODAL ADMIN */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
          <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-xl rounded-[4rem] p-16 shadow-2xl animate-in zoom-in duration-300">
            <h2 className="text-4xl font-black mb-10 uppercase italic">Deploy New System</h2>
            <form onSubmit={addProduct} className="space-y-6">
              <input required className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white outline-none focus:border-cyan-500 font-bold" placeholder="Product Name..." value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
              <input required className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white outline-none focus:border-cyan-500 font-bold" placeholder="Price (VNĐ)..." value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
              <textarea required className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white outline-none focus:border-cyan-500 h-28" placeholder="Specs Summary..." value={newProduct.specs} onChange={e => setNewProduct({...newProduct, specs: e.target.value})}></textarea>
              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-cyan-500 text-black font-black py-6 rounded-2xl shadow-xl hover:bg-cyan-400 uppercase">Save</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="px-10 bg-white/5 rounded-2xl font-black uppercase text-xs tracking-widest text-gray-500">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="py-24 text-center opacity-30 italic"><p className="text-[10px] font-black uppercase tracking-[1em]">TechPC Pro Studio © 2024</p></footer>
    </div>
  );
}

function DetailItem({ Icon, label, value }) {
  return (
    <div className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] flex items-center gap-5 hover:bg-white/10 transition-all group shadow-xl backdrop-blur-sm">
      <div className="text-cyan-400 group-hover:scale-110 transition-transform">
        {Icon && <Icon className="w-7 h-7" />}
      </div>
      <div>
        <div className="text-[9px] font-black uppercase text-gray-500 tracking-widest">{label}</div>
        <div className="text-sm font-bold text-white truncate max-w-[120px]">{value || "Premium"}</div>
      </div>
    </div>
  );
}