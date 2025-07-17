import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import "./Product.css";
import { Link } from "react-router-dom";

function Product() {
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [sortOption, setSortOption] = useState("featured");
  const [priceFilter, setPriceFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/api/products")
      .then(res => {
        setProducts(res.data);
        setOriginalProducts(res.data);
      })
      .catch(err => console.error("Lỗi tải sản phẩm:", err));
  }, []);

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOption(value);

    let sortedProducts = [...products];

    switch (value) {
      case "name-asc":
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price-asc":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        sortedProducts = [...originalProducts];
        break;
    }

    setProducts(sortedProducts);
  };

  const filterByPrice = (products) => {
    switch (priceFilter) {
      case "under-1m":
        return products.filter(p => p.price < 1_000_000);
      case "1m-3m":
        return products.filter(p => p.price >= 1_000_000 && p.price <= 3_000_000);
      case "3m-5m":
        return products.filter(p => p.price > 3_000_000 && p.price <= 5_000_000);
      case "5m-10m":
        return products.filter(p => p.price > 5_000_000 && p.price <= 10_000_000);
      case "above-10m":
        return products.filter(p => p.price > 10_000_000);
      default:
        return products;
    }
  };

  const filterByBrand = (products) => {
    if (!brandFilter) return products;
    return products.filter(p => p.brand === brandFilter);
  };

  const applyAllFilters = () => {
    let result = [...originalProducts];
    result = filterByPrice(result);
    result = filterByBrand(result);
    return result;
  };

  return (
    <>
      <Navbar />
      <div className="product-background py-4">
        <div className="container">
          <div className="breadcrumb mb-3">
            <Link to="/" className="breadcrumb-link">
              <img src="/icons/home.svg" alt="Home" className="icon-home" />
              Trang chủ
            </Link>
            <span className="mx-2">/</span>
            <span>Sản phẩm</span>
          </div>

          <div className="product-wrapper p-4 rounded shadow-sm bg-white">
            <div className="row mb-4 g-2 filter-row">
              <div className="col">
                <button className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center">
                  <img src="/icons/filter.svg" alt="Filter" width="16" className="me-2" />
                  Bộ lọc
                </button>
              </div>
              <div className="col">
                <select className="form-select">
                  <option>Tình trạng</option>
                  <option>Mới</option>
                  <option>Đã qua sử dụng</option>
                </select>
              </div>
              <div className="col">
                <select className="form-select" value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
                  <option value="">Giá</option>
                  <option value="under-1m">Dưới 1 triệu</option>
                  <option value="1m-3m">1 - 3 triệu</option>
                  <option value="3m-5m">3 - 5 triệu</option>
                  <option value="5m-10m">5 - 10 triệu</option>
                  <option value="above-10m">Trên 10 triệu</option>
                </select>
              </div>
              <div className="col">
                <select className="form-select" value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}>
                  <option value="">Hãng</option>
                  <option value="NVIDIA">NVIDIA</option>
                  <option value="AMD">AMD</option>
                  <option value="ASUS">ASUS</option>
                  <option value="MSI">MSI</option>
                  <option value="Sapphire">Sapphire</option>
                  <option value="GIGABYTE">GIGABYTE</option>
                  <option value="Zotac">Zotac</option>
                </select>
              </div>
              <div className="col">
                <select className="form-select">
                  <option>Bộ nhớ</option>
                  <option>4GB</option>
                  <option>8GB</option>
                  <option>12GB</option>
                  <option>16GB</option>
                </select>
              </div>
              <div className="col text-end">
                <select className="form-select" value={sortOption} onChange={handleSortChange}>
                  <option value="featured">Sắp xếp: Nổi bật</option>
                  <option value="name-asc">Từ A-Z</option>
                  <option value="price-asc">Giá tăng dần</option>
                  <option value="price-desc">Giá giảm dần</option>
                </select>
              </div>
            </div>

            <div className="row">
              {applyAllFilters().map((product, idx) => (
                <div key={idx} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                  <Link to={`/products/${product.id}`} className="text-decoration-none text-dark">
                    <div className="product-card text-center p-3">
                      <img src={product.imageUrl} alt={product.name} className="product-image mb-3" />
                      <h5 className="product-name">{product.name}</h5>
                      <p className="product-desc">{product.description}</p>
                      <p className="product-price text-danger fw-bold">{product.price?.toLocaleString()} ₫</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Product;
