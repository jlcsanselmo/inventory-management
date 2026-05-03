import { useState, useEffect } from "react";

function App() {
  const [products, setProducts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantify, setStockQuantify] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch('http://localhost:3000/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  const handleEditClick = (product: any) => {
    setName(product.name);
    setDescription(product.description);
    setPrice(String(product.price));
    setStockQuantify(String(product.stock_quantify));
    setEditingId(product.id);
  };

  const handleAddProduct = (event: any) => {
    event.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `http://localhost:3000/products/${editingId}` : 'http://localhost:3000/products';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description,
        price: Number(price),
        stock_quantify: Number(stockQuantify),
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (editingId) {
          setProducts(products.map(p => p.id === editingId ? data : p));
          setEditingId(null);
        } else {
          setProducts([...products, data]);
        }
        setName("");
        setDescription("");
        setPrice("");
        setStockQuantify("");
      });
  };

  const handleDeleteProduct = (id: string) => {
    fetch(`http://localhost:3000/products/${id}`, { method: 'DELETE' })
      .then(() => setProducts(products.filter(p => p.id !== id)))
      .catch(err => console.error(err));
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValue = products.reduce((acc, product) => {
    return acc + (product.price * product.stock_quantify);
  }, 0);

  const lowStockCount = products.filter(p => p.stock_quantify < 5).length;
  const totalProducts = products.length;

  return (
    <div style={{ backgroundColor: '#F3F4F6', minHeight: '100vh', paddingBottom: '50px', fontFamily: 'sans-serif' }}>

      <header style={{ backgroundColor: '#1B4332', padding: '32px 0 160px 0', textAlign: 'center', color: '#fff' }}>
        <h1>Gestão de Inventário</h1>
      </header>

      <main style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 20px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', marginTop: '-80px' }}>
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '5px', color: '#1F2937', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p>Total de Produtos</p>
            </header>
            <strong style={{ display: 'block', marginTop: '16px', fontSize: '36px', fontWeight: 'normal' }}>
              {totalProducts}
            </strong>
          </div>

          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '5px', color: '#1F2937', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p>Estoque Baixo ( &lt; 5 un. )</p>
            </header>
            <strong style={{ display: 'block', marginTop: '16px', fontSize: '36px', fontWeight: 'normal', color: lowStockCount > 0 ? '#DC2626' : '#1F2937' }}>
              {lowStockCount}
            </strong>
          </div>

          <div style={{ backgroundColor: '#2D6A4F', padding: '24px', borderRadius: '5px', color: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p>Valor Patrimonial</p>
            </header>
            <strong style={{ display: 'block', marginTop: '16px', fontSize: '36px', fontWeight: 'normal' }}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
            </strong>
          </div>
        </div>

        <div style={{ marginTop: '64px', backgroundColor: '#fff', padding: '24px', borderRadius: '5px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          {/* Formulário de Cadastro/Edição */}
          <div style={{ marginTop: '64px', backgroundColor: '#fff', padding: '24px', borderRadius: '5px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <form onSubmit={handleAddProduct} style={{
              display: 'grid',
              gridTemplateColumns: '1.5fr 1.5fr 0.8fr 0.8fr 1fr',
              gap: '12px',
              alignItems: 'center'
            }}>
              <input
                placeholder="Nome"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                style={{ padding: '12px', borderRadius: '5px', border: '1px solid #D1D5DB', background: '#F9FAFB', fontSize: '15px' }}
              />
              <input
                placeholder="Descrição"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                style={{ padding: '12px', borderRadius: '5px', border: '1px solid #D1D5DB', background: '#F9FAFB', fontSize: '15px' }}
              />
              <input
                placeholder="Preço"
                type="number"
                step="0.01"
                value={price}
                onChange={e => setPrice(e.target.value)}
                required
                style={{ padding: '12px', borderRadius: '5px', border: '1px solid #D1D5DB', background: '#F9FAFB', fontSize: '15px' }}
              />
              <input
                placeholder="Estoque"
                type="number"
                value={stockQuantify}
                onChange={e => setStockQuantify(e.target.value)}
                required
                style={{ padding: '12px', borderRadius: '5px', border: '1px solid #D1D5DB', background: '#F9FAFB', fontSize: '15px' }}
              />

              <button type="submit" style={{
                height: '100%',
                padding: '0 20px',
                backgroundColor: '#2D6A4F',
                color: '#fff',
                border: '0',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 600,
                whiteSpace: 'nowrap'
              }}>
                {editingId ? "Atualizar" : "Salvar"}
              </button>
            </form>
          </div>
        </div>

        <div style={{ marginTop: '40px' }}>
          <input
            type="text"
            placeholder="Buscar produto pelo nome..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '16px', borderRadius: '5px', border: '1px solid #D1D5DB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '32px', fontSize: '16px', color: '#1F2937' }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredProducts.map((product: any) => (
              <div key={product.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr 1fr 1fr', gap: '16px', alignItems: 'center', backgroundColor: '#fff', padding: '20px 32px', borderRadius: '5px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <span style={{ color: '#1F2937', fontSize: '16px', fontWeight: 500 }}>{product.name}</span>
                <span style={{ color: '#2D6A4F', fontSize: '16px', fontWeight: 500 }}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}</span>
                <span style={{ color: '#6B7280', fontSize: '16px' }}>{product.description}</span>
                <span style={{ color: product.stock_quantify < 5 ? '#DC2626' : '#6B7280', fontSize: '16px', fontWeight: product.stock_quantify < 5 ? 600 : 'normal' }}>
                  {product.stock_quantify} un.
                </span>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button onClick={() => handleEditClick(product)} style={{ padding: '8px 16px', backgroundColor: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '4px', cursor: 'pointer', color: '#374151', fontWeight: 600 }}>Editar</button>
                  <button onClick={() => handleDeleteProduct(product.id)} style={{ padding: '8px 16px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '4px', cursor: 'pointer', color: '#DC2626', fontWeight: 600 }}>Excluir</button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;