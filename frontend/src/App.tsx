import { useState, useEffect } from "react";

function App() {
  const [products, setProducts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantify, setStockQuantify] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

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
        setName(""); setDescription(""); setPrice(""); setStockQuantify("");
      });
  };

  const handleDeleteProduct = (id: string) => {
    fetch(`http://localhost:3000/products/${id}`, { method: 'DELETE' })
      .then(() => setProducts(products.filter(p => p.id !== id)))
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h1>Meu Inventário</h1>

      <form onSubmit={handleAddProduct} style={{ marginBottom: '20px' }}>
        <input placeholder="Nome" value={name} onChange={e => setName(e.target.value)} required />
        <input placeholder="Descrição" value={description} onChange={e => setDescription(e.target.value)} required />
        <input placeholder="Preço" type="number" value={price} onChange={e => setPrice(e.target.value)} required />
        <input placeholder="Estoque" type="number" value={stockQuantify} onChange={e => setStockQuantify(e.target.value)} required />

        <button type="submit">
          {editingId ? "Atualizar Produto" : "Salvar Produto"}
        </button>
      </form>

      <ul>
        {products.map((product: any) => (
          <li key={product.id} style={{ marginBottom: '10px' }}>
            <strong>{product.name}</strong> - R$ {product.price} ({product.stock_quantify} em estoque)
            <button onClick={() => handleEditClick(product)} style={{ marginLeft: '10px' }}>Editar</button>
            <button onClick={() => handleDeleteProduct(product.id)} style={{ marginLeft: '10px', color: 'red' }}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;