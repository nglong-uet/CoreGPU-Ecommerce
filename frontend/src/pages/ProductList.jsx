import React, { useEffect, useState, useMemo, useCallback } from "react";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import "../style/ProductList.css";
import { Link } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";

function ProductList() {
  usePageTitle("Danh sách sản phẩm | CoreGPU");

  const [originalProducts, setOriginalProducts] = useState([]);
  const [sortOption, setSortOption] = useState("featured");
  const [priceFilter, setPriceFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [conditionFilter, setConditionFilter] = useState("");
  const [memoryFilter, setMemoryFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  useEffect(() => {
    axios.get("http://localhost:8080/api/products")
      .then(res => {
        setOriginalProducts(res.data);
      })
      .catch(err => console.error("Lỗi tải sản phẩm:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOption(value);
    setCurrentPage(1);
  };


  const applyAllFilters = useCallback(() => {
    let result = [...originalProducts];

    switch (priceFilter) {
      case "under-1m":
        result = result.filter(p => p.price < 1_000_000);
        break;
      case "1m-3m":
        result = result.filter(p => p.price >= 1_000_000 && p.price <= 3_000_000);
        break;
      case "3m-5m":
        result = result.filter(p => p.price > 3_000_000 && p.price <= 5_000_000);
        break;
      case "5m-10m":
        result = result.filter(p => p.price > 5_000_000 && p.price <= 10_000_000);
        break;
      case "above-10m":
        result = result.filter(p => p.price > 10_000_000);
        break;
      default:
        break;
    }

    if (brandFilter) {
      result = result.filter(p => p.brand === brandFilter);
    }
 
    if (conditionFilter) {
      result = result.filter(p => p.product_condition === conditionFilter);
    }

    if (memoryFilter) {
      result = result.filter(p => p.memory === memoryFilter);
    }
    
    switch (sortOption) {
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    
    return result;
  }, [originalProducts, sortOption, priceFilter, brandFilter, conditionFilter, memoryFilter]);

  const filteredProducts = useMemo(() => applyAllFilters(), [applyAllFilters]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    setCurrentPage(1);
  }, [priceFilter, brandFilter, conditionFilter, memoryFilter]);

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

            <div className="row mb-4">
              <div className="col">
                <p className="mb-0 text-muted">
                  Hiển thị {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} của {filteredProducts.length} sản phẩm
                </p>
              </div>
            </div>

            <div className="row mb-4">
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-12 text-center py-5">
                  <h4>Không tìm thấy sản phẩm nào phù hợp</h4>
                  <p className="text-muted">Hãy thử điều chỉnh bộ lọc của bạn</p>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      &laquo;
                    </button>
                  </li>

                  {currentPage > 3 && (
                    <>
                      <li className="page-item">
                        <button className="page-link" onClick={() => paginate(1)}>1</button>
                      </li>
                      {currentPage > 4 && (
                        <li className="page-item disabled">
                          <span className="page-link">...</span>
                        </li>
                      )}
                    </>
                  )}

                  {pageNumbers.map(number => {
                    if (number >= currentPage - 2 && number <= currentPage + 2) {
                      return (
                        <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => paginate(number)}>
                            {number}
                          </button>
                        </li>
                      );
                    }
                    return null;
                  })}
                  
                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && (
                        <li className="page-item disabled">
                          <span className="page-link">...</span>
                        </li>
                      )}
                      <li className="page-item">
                        <button className="page-link" onClick={() => paginate(totalPages)}>
                          {totalPages}
                        </button>
                      </li>
                    </>
                  )}
                  
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      &raquo;
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductList;