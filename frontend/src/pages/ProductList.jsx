import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import "../style/ProductList.css";
import { Link } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";

function Product() {
  usePageTitle("Danh sách sản phẩm | CoreGPU");

  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [sortOption, setSortOption] = useState("featured");
  const [priceFilter, setPriceFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [conditionFilter, setConditionFilter] = useState("");
  const [memoryFilter, setMemoryFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:8080/api/products")
      .then(res => {
        setProducts(res.data);
        setOriginalProducts(res.data);
      })
      .catch(err => console.error("Lỗi tải sản phẩm:", err))
      .finally(() => setLoading(false));
  }, []);


  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOption(value);

    let sortedProducts = [...originalProducts];

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

  const filterByConditon = (products) => {
    if (!conditionFilter) return products;
    return products.filter(p => p.product_condition === conditionFilter);
  }

  const filterByMemory = (products) => {
    if (!memoryFilter) return products;
    return products.filter(p => p.memory === memoryFilter);
  }

  const filterByBrand = (products) => {
    if (!brandFilter) return products;
    return products.filter(p => p.brand === brandFilter);
  };

  const applyAllFilters = () => {
    let result = [...products];
    result = filterByPrice(result);
    result = filterByBrand(result);
    result = filterByConditon(result);
    result = filterByMemory(result);
    return result;
};

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="product-background py-3">
        <div className="container">
          <div className="breadcrumb mb-3">
            <Link to="/" className="breadcrumb-link">
              <img src="/icons/home.svg" alt="Home" className="icon-home" />
              Trang chủ
            </Link>
            <span className="mx-2">/</span>
            <span>Sản phẩm</span>
          </div>

          <div className="product-wrapper p-4 rounded">
            <div className="row mb-4 g-2 filter-row">
              <div className="col">
                <button className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center">
                  <img src="/icons/filter.svg" alt="Filter" width="16" className="me-2" />
                  Bộ lọc
                </button>
              </div>
              <div className="col">
                <select
                  className="form-select"
                  value={conditionFilter}
                  onChange={(e) => setConditionFilter(e.target.value)}
                >
                  <option value="">Tình trạng</option>
                  <option value="Mới">Mới</option>
                  <option value="Đã qua sử dụng">Đã qua sử dụng</option>
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
                <select
                  className="form-select"
                  value={memoryFilter}
                  onChange={(e) => setMemoryFilter(e.target.value)}
                >
                  <option value="">Bộ nhớ</option>
                  <option value="4GB">4GB</option>
                  <option value="6GB">6GB</option>
                  <option value="8GB">8GB</option>
                  <option value="10GB">10GB</option>
                  <option value="12GB">12GB</option>
                  <option value="16GB">16GB</option>
                  <option value="24GB">24GB</option>
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
              {applyAllFilters().map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Product;
