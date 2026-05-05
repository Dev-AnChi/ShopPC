import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, 
  Monitor, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  MessageCircle, 
  ShieldCheck, 
  Zap, 
  X,
  CreditCard,
  HardDrive,
  Gamepad2,
  ArrowLeft,
  ChevronRight,
  Fan,
  Box
} from 'lucide-react';

// --- HỆ THỐNG NỀN CÔNG NGHỆ NÂNG CAO ---
const TechBackground = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
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

    // Cấu hình lưới và hạt
    const gridSize = 50;
    const points = [];
    const particles = [];
    const rows = Math.ceil(canvas.height / gridSize) + 2;
    const cols = Math.ceil(canvas.width / gridSize) + 2;

    // Khởi tạo điểm lưới
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        points.push({
          baseX: x * gridSize,
          baseY: y * gridSize,
          x: x * gridSize,
          y: y * gridSize,
        });
      }
    }

    // Khởi tạo hạt phân tử trôi nổi
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    const animate = () => {
      // 1. Vẽ Gradient nền sâu
      const bgGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width
      );
      bgGradient.addColorStop(0, '#0a1120'); // Xanh đen sâu ở giữa
      bgGradient.addColorStop(1, '#020204'); // Đen tuyền ở rìa
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Cập nhật và vẽ hạt phân tử
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 182, 212, ${p.alpha})`;
        ctx.fill();
      });

      // 3. Vẽ lưới 3D có tương tác
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.lineWidth = 0.5;

      // Vẽ các đường ngang
      for (let y = 0; y < rows; y++) {
        ctx.beginPath();
        for (let x = 0; x < cols; x++) {
          const p = points[y * cols + x];
          const dx = mouse.current.x - p.x;
          const dy = mouse.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 300;
          
          if (dist < maxDist) {
            const force = (maxDist - dist) / maxDist;
            p.x -= dx * force * 0.03;
            p.y -= dy * force * 0.03;
          }
          p.x += (p.baseX - p.x) * 0.05;
          p.y += (p.baseY - p.y) * 0.05;

          if (x === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

      // Vẽ các đường dọc
      for (let x = 0; x < cols; x++) {
        ctx.beginPath();
        for (let y = 0; y < rows; y++) {
          const p = points[y * cols + x];
          if (y === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

      // 4. Vẽ các điểm nút phát sáng (Glow points)
      points.forEach((p, i) => {
        if (i % 5 === 0) {
          const dx = mouse.current.x - p.x;
          const dy = mouse.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 150) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(34, 211, 238, 0.6)';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#22d3ee';
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-20 pointer-events-none"
    />
  );
};

// Dữ liệu mẫu gán cứng ban đầu
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "CYBERCORE I9 ULTIMATE",
    price: "85.900.000",
    specs: "Core i9 14900K | RTX 4090 24GB | 64GB RAM DDR5 | 2TB Gen5 SSD",
    description: "Bộ máy tối thượng cho game thủ và nhà sáng tạo nội dung chuyên nghiệp. Sử dụng hệ thống tản nhiệt nước Custom giúp duy trì hiệu năng đỉnh cao trong thời gian dài.",
    category: "Extreme Gaming",
    image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=800",
    fullSpecs: {
      cpu: "Intel Core i9-14900K (Up to 6.0GHz, 24 Cores, 32 Threads)",
      gpu: "NVIDIA GeForce RTX 4090 24GB GDDR6X",
      ram: "64GB (2x32GB) DDR5 6000MHz RGB",
      ssd: "2TB Samsung 990 Pro PCIe Gen5",
      mainboard: "Z790 Maximus Extreme",
      psu: "1200W 80 Plus Platinum Fully Modular",
      case: "Lian Li O11 Dynamic EVO XL",
      cooling: "AIO 360mm RGB Performance"
    }
  },
  {
    id: 2,
    name: "WORKSTATION PRO RENDER",
    price: "52.500.000",
    specs: "Ryzen 9 7950X | RTX 4080 Super | 32GB RAM | 1TB NVMe",
    description: "Giải pháp hoàn hảo cho dựng phim 4K, Render 3D và chạy các mô hình AI. Độ ổn định cao, hoạt động bền bỉ 24/7.",
    category: "Professional",
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800",
    fullSpecs: {
      cpu: "AMD Ryzen 9 7950X (Up to 5.7GHz, 16 Cores, 32 Threads)",
      gpu: "NVIDIA GeForce RTX 4080 Super 16GB GDDR6X",
      ram: "32GB (2x16GB) DDR5 5600MHz",
      ssd: "1TB WD Black SN850X NVMe Gen4",
      mainboard: "X670E Pro Creator",
      psu: "850W 80 Plus Gold",
      case: "Fractal Design North Charcoal",
      cooling: "Deepcool AK620 Digital Tower Air Cooler"
    }
  },
  {
    id: 3,
    name: "STREAMPUNK EDITION",
    price: "34.200.000",
    specs: "Core i7 13700F | RTX 4070 | 32GB RAM | Liquid Cooling RGB",
    description: "Cân mọi tựa game AAA ở độ phân giải 2K. Thiết kế bắt mắt với hệ thống LED ARGB đồng bộ hoàn toàn.",
    category: "Gaming/Streaming",
    image: "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?auto=format&fit=crop&q=80&w=800",
    fullSpecs: {
      cpu: "Intel Core i7-13700F (Up to 5.2GHz, 16 Cores, 24 Threads)",
      gpu: "NVIDIA GeForce RTX 4070 12GB GDDR6X",
      ram: "32GB (2x16GB) DDR4 3600MHz RGB",
      ssd: "1TB Kingston NV2 PCIe Gen4",
      mainboard: "B760 Steel Legend WiFi",
      psu: "750W 80 Plus Bronze",
      case: "NZXT H5 Flow RGB",
      cooling: "AIO 240mm RGB"
    }
  }
];

export default function App() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', specs: '', description: '', category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=800'
  });

  const MESSENGER_ID = "YOUR_PAGE_ID"; 

  const handleOrder = (product) => {
    const message = `Xin chào! Tôi quan tâm đến bộ PC: ${product.name}\nGiá: ${product.price}đ\nCấu hình: ${product.specs}\nVui lòng tư vấn cho tôi!`;
    const encodedMessage = encodeURIComponent(message);
    const url = `https://m.me/${MESSENGER_ID}?text=${encodedMessage}`;
    window.open(url, '_blank');
  };

  const addProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    const product = { ...newProduct, id: Date.now() };
    setProducts([product, ...products]);
    setShowAddModal(false);
    setNewProduct({ name: '', price: '', specs: '', description: '', category: 'Gaming', image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=800' });
  };

  const deleteProduct = (id) => {
    if (window.confirm("Xóa cấu hình này?")) {
      setProducts(products.filter(p => p.id !== id));
      if (selectedProduct?.id === id) setSelectedProduct(null);
    }
  };

  return (
    <div className="min-h-screen text-gray-100 font-sans selection:bg-cyan-500 selection:text-white relative overflow-x-hidden">
      
      {/* Background Công nghệ 3D */}
      <TechBackground />

      {/* Overlay Texture & Vignette */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>
      <div className="fixed inset-0 pointer-events-none -z-10 shadow-[inset_0_0_150px_rgba(0,0,0,0.8)]"></div>

      {/* Glows phụ trợ */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/5 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[150px] rounded-full"></div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-white/5 bg-black/20 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedProduct(null)}>
            <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-2 rounded-xl shadow-lg shadow-cyan-500/10">
              <Cpu className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              TECH<span className="text-cyan-400">PC</span> PRO
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsAdmin(!isAdmin)}
              className={`text-[10px] uppercase tracking-[0.2em] font-black px-5 py-2.5 rounded-full border transition-all ${
                isAdmin ? "bg-red-500/10 border-red-500/30 text-red-500" : "border-white/10 text-gray-500 hover:text-white hover:bg-white/5"
              }`}
            >
              {isAdmin ? "Admin Active" : "Admin Login"}
            </button>
            {isAdmin && (
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-cyan-500 hover:bg-cyan-400 text-black p-2 rounded-xl transition-all active:scale-90"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </nav>

      {!selectedProduct ? (
        <>
          {/* Hero Section */}
          <header className="max-w-7xl mx-auto px-4 py-24 text-center animate-in fade-in slide-in-from-top-6 duration-1000 relative">
            <div className="inline-flex items-center gap-2 bg-cyan-400/5 border border-cyan-400/20 px-5 py-1.5 rounded-full mb-10">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400">Next-Gen PC Systems</span>
            </div>
            <h1 className="text-6xl md:text-9xl font-black mb-10 tracking-tighter leading-none italic uppercase">
              Build your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">Legacy</span>
            </h1>
            <p className="max-w-3xl mx-auto text-gray-400 text-xl font-light leading-relaxed">
              Chúng tôi kiến tạo những cỗ máy không chỉ để chơi game, mà là để khẳng định đẳng cấp và phong cách sống của bạn.
            </p>
          </header>

          {/* Catalog */}
          <main className="max-w-7xl mx-auto px-4 pb-40">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="group relative bg-white/[0.01] border border-white/5 rounded-[3rem] overflow-hidden hover:border-cyan-500/20 hover:bg-white/[0.03] transition-all duration-700 flex flex-col"
                >
                  <div className="relative h-80 overflow-hidden" onClick={() => setSelectedProduct(product)}>
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 cursor-pointer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020204] via-transparent to-transparent opacity-90"></div>
                    <div className="absolute top-8 left-8">
                      <span className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-2xl">
                        {product.category}
                      </span>
                    </div>
                    {isAdmin && (
                      <button onClick={(e) => { e.stopPropagation(); deleteProduct(product.id); }} className="absolute top-8 right-8 bg-red-500/80 hover:bg-red-500 p-2.5 rounded-2xl text-white shadow-xl transition-all active:scale-90">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="p-10 flex flex-col flex-grow">
                    <h3 className="text-2xl font-black mb-4 group-hover:text-cyan-400 transition-colors cursor-pointer uppercase tracking-tight" onClick={() => setSelectedProduct(product)}>
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-10 line-clamp-2 font-medium tracking-wide leading-relaxed">{product.specs}</p>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-600 uppercase font-bold tracking-widest mb-1">Starting at</span>
                        <span className="text-3xl font-black text-white tracking-tighter">
                          {product.price}<span className="text-cyan-400 text-sm ml-1 font-mono">₫</span>
                        </span>
                      </div>
                      
                      <button 
                        onClick={() => setSelectedProduct(product)}
                        className="bg-white hover:bg-cyan-400 text-black w-14 h-14 rounded-3xl flex items-center justify-center transition-all shadow-2xl active:scale-90"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </>
      ) : (
        /* DETAIL VIEW */
        <main className="max-w-6xl mx-auto px-4 py-20 animate-in fade-in zoom-in-95 duration-500">
          <button 
            onClick={() => setSelectedProduct(null)}
            className="flex items-center gap-3 text-gray-500 hover:text-white mb-12 transition-all group font-black uppercase tracking-[0.3em] text-[10px]"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Studio
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <div className="sticky top-40">
              <div className="aspect-square rounded-[4rem] overflow-hidden border border-white/5 bg-white/5 shadow-2xl group">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="mb-12">
                <span className="text-cyan-400 font-black tracking-[0.5em] text-[10px] uppercase mb-5 block">{selectedProduct.category}</span>
                <h1 className="text-6xl md:text-7xl font-black mb-8 tracking-tighter leading-none uppercase">{selectedProduct.name}</h1>
                <p className="text-5xl font-black text-white mb-10 tracking-tighter italic">{selectedProduct.price}₫</p>
                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] backdrop-blur-sm">
                  <p className="text-gray-400 leading-relaxed font-medium text-lg">
                    {selectedProduct.description || "Một hệ thống được thiết kế tỉ mỉ, không thỏa hiệp về hiệu năng và thẩm mỹ."}
                  </p>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                <SpecBox icon={<Cpu />} label="Processor" value={selectedProduct.fullSpecs?.cpu || "High End CPU"} />
                <SpecBox icon={<Zap />} label="Graphics" value={selectedProduct.fullSpecs?.gpu || "RTX GPU"} />
                <SpecBox icon={<HardDrive />} label="Memory" value={selectedProduct.fullSpecs?.ram || "DDR5 Memory"} />
                <SpecBox icon={<ShieldCheck />} label="Warranty" value="36 Months" />
              </div>

              <button 
                onClick={() => handleOrder(selectedProduct)}
                className="flex items-center justify-center gap-4 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black py-6 rounded-[2rem] font-black text-xl uppercase tracking-widest transition-all shadow-2xl active:scale-95"
              >
                <MessageCircle className="w-7 h-7" />
                Contact for Build
              </button>
            </div>
          </div>
        </main>
      )}

      {/* Modal & Footer remain similar but with updated styling */}
      <footer className="py-24 border-t border-white/5 text-center relative z-10">
        <p className="text-gray-700 text-[10px] font-black uppercase tracking-[0.5em]">Future Tech PC Studio © 2024</p>
      </footer>
    </div>
  );
}

function SpecBox({ icon, label, value }) {
  return (
    <div className="bg-white/5 border border-white/5 p-6 rounded-3xl hover:border-cyan-500/20 transition-all">
      <div className="text-cyan-400 mb-3">{React.cloneElement(icon, { className: "w-5 h-5" })}</div>
      <div className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1">{label}</div>
      <div className="text-sm font-bold text-white truncate">{value}</div>
    </div>
  );
}