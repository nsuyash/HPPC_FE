import logo from './hppc_logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import useFetch from './useFetch';
import { useState } from 'react';

function App() {
  const { data, loading, error } = useFetch("https://hppc-be.vercel.app/products");

  const [categoryName, setCategoryName] = useState("");
  const [productName, setProductName] = useState("");
  const [filterCategory, setFilterCategory] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [calcualteSection, setCalcualteSection] = useState(false)
  const [discountRate, setDiscountRate] = useState("")
  const [finalProducts, setFinalProducts] = useState([])
  const [showFinalCalculation, setShowFinalCalculation] = useState(false)

  const handleSelectedCategory = (event) => {
    const { value } = event.target;
    setCategoryName(value);

    const selectedCategory = data.filter(item => item.category === value);
    setFilterCategory(selectedCategory);
  };

  const handleAddProductBtn = () => {
    const productCategory = data.find(item => item.category === categoryName);
    const product = productCategory.products.find(item => item.name === productName);
    const withProductQuantity = { ...product, quantity: 1 };
    setSelectedProducts((prev) => [...prev, withProductQuantity]);
    setProductName("");
    setCategoryName("");
  };

  const handleQuantityChange = (idx, action) => {
    const updatedProducts = [...selectedProducts];
    if (action === 'increase') {
      updatedProducts[idx].quantity += 1;
    } else if (action === 'decrease' && updatedProducts[idx].quantity > 1) {
      updatedProducts[idx].quantity -= 1;
    }
    setSelectedProducts(updatedProducts);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleCalculateBtn = () => {
    setFinalProducts([])
    selectedProducts.forEach(item => {
      const finalPrice = item[discountRate]*item.quantity
      const product = {name: item.name, price: finalPrice, quantity: item.quantity, discount: discountRate === "mrp" ? "MRP" : discountRate === "atTwentyFivePercent" ? "25 %" : discountRate === "atThirtyFivePercent" ? "35 %" : discountRate === "atFortyTwoPercent" ? "42 %" : discountRate === "atFiftyPercent" ? "50 %" : "Not Define"}
      setFinalProducts(prev => [...prev, product])
    })
    setShowFinalCalculation(true)
  }

  return (
    <>
      <header className="App-header text-center">
        <img src={logo} className="img-fluid" alt="logo" style={{ width: "250px" }} />
      </header>
      <main className="mb-3 mx-4">
        <div style={{ backgroundColor: "#eaf1ea" }} className="rounded border border-dark-subtle">
          <div className="row px-3 pt-2">
            <div className="col-md-6 pt-3">
              <label style={{ color: "black" }} className="pb-2"><strong>Category</strong></label>
              <select className="form-select" value={categoryName} onChange={(e) => handleSelectedCategory(e)}>
                <option value="">--Select Option--</option>
                {data && data.length > 0 && data.map((item, idx) => (
                  <option value={item.category} key={idx} style={{ color: "black" }}>
                    {item.category}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 pt-3">
              <label style={{ color: "black" }} className="pb-2"><strong>Product</strong></label>
              <select className="form-select" value={productName} onChange={(e) => setProductName(e.target.value)}>
                <option value="">--Select Option--</option>
                {filterCategory && filterCategory.length > 0 && filterCategory[0].products.map((item, idx) => (
                  <option value={item.name} key={idx}>{item.name}</option>
                ))}
              </select>
            </div>
            <div className="text-center py-4">
              <button className="btn btn-success" onClick={handleAddProductBtn}>Add Product</button>
            </div>
          </div>
        </div>

        {selectedProducts && selectedProducts.length > 0 && (
          <div style={{ backgroundColor: "#f5c69f"}} className="mt-3 rounded border border-dark-subtle">
            <div className='row px-4 pt-3'>
                <div className='col'>
                  <label style={{ color: "black" }}><strong>Product Name</strong></label>
                </div>
                <div className='col'>
                  <label style={{ color: "black" }}><strong>MRP</strong></label>
                </div>
                <div className='col'>
                  <label style={{ color: "black" }}><strong>Quantity</strong></label>
                </div>
            </div>
            <hr />
            <div className='px-4 pt-3'>
              {selectedProducts.map((item, idx) => (
                  <div className='row'>
                  <div className='col'>
                    <p style={{ color: "black", fontSize: 12 }}><strong>{idx + 1}.</strong> {item.name}</p>
                  </div>
                  <div className='col'>
                    <p style={{ color: "black", fontSize: 12}}>₹ {item.mrp}</p>
                  </div>
                  <div className='col'>
                      <div>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleQuantityChange(idx, 'decrease')}
                      >-</button>
                      <label style={{ color: "black", fontSize: 12, backgroundColor: "white" }} className='px-1 py-1 rounded mx-1'>{item.quantity}</label>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleQuantityChange(idx, 'increase')}
                      >+</button>
                      </div>
                  </div>
                </div>
              ))}
              <div className='text-center my-3'>
                <button className='btn btn-secondary' onClick={() => setCalcualteSection(!calcualteSection)}>Next to Calculate</button>
              </div>
            </div>
          </div>
        )}

        {
          calcualteSection && (
            <div style={{backgroundColor: "#a0e0a0", minHeight: "20vh"}} className='rounded mt-3 px-3 py-3'>
              <label style={{ color: "black" }} className="pb-2"><strong>Discount %</strong></label>
              <select className="form-select" value={discountRate} onChange={(e) => setDiscountRate(e.target.value)}>
                <option value="">--Select Option--</option>
                <option value="mrp">MRP</option>
                <option value="atTwentyFivePercent">25 %</option>
                <option value="atThirtyFivePercent">35 %</option>
                <option value="atFortyTwoPercent">42 %</option>
                <option value="atFiftyPercent">50 %</option>
              </select>
              <div className='pt-4'>
                <div className='text-center'>
                  <button className='btn btn-success' onClick={() => handleCalculateBtn()}>Calculate</button><br /><hr />
                </div>
                {
                  showFinalCalculation && (
                    <>
                      <div className='row'>
                        <div className='col'><strong>Product Name</strong></div>
                        <div className='col'><strong>Quantity</strong></div>
                        <div className='col'><strong>Discount</strong></div>
                        <div className='col'><strong>Final Price</strong></div>
                      </div>
                      <hr />
                      <div>
                        {
                          finalProducts && finalProducts.length > 0 && finalProducts.map((item,idx) => (
                            <div className='row pb-2' key={idx}>
                              <div className='col' style={{fontSize: 12}}><strong>{idx + 1}. </strong>{item.name}</div>
                              <div className='col' style={{fontSize: 12}}>{item.quantity}</div>
                              <div className='col' style={{fontSize: 12}}>{item.discount}</div>
                              <div className='col' style={{fontSize: 12}}>₹ {item.price}</div>
                            </div>
                          ))
                        }
                      </div>
                      <hr />
                      <div className='row'>
                        <div className='col float-end'><strong>Total Price</strong></div>
                        <div className='col'><strong>₹ {finalProducts.reduce((acc, curr) => {
                          return acc + curr.price
                        },0)}</strong>
                        </div>
                      </div>
                      <hr />
                    </>
                  )
                }
              </div>
            </div>
          )
        }
      </main>
      <footer className="footer text-center mb-3">
        <div className="px-5">
          <p><span>&copy; HPPC 2025</span><br /><span>Independent Herbalife Associate</span></p>
        </div>
      </footer>
    </>
  );
}

export default App;
