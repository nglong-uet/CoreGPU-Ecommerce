import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import "../style/Search.css";
import usePageTitle from "../hooks/usePageTitle";

export default function Search() {
  usePageTitle("Tìm kiếm | CorePGU");
  
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    if (query?.trim()) {
      searchProducts(query.trim());
    } else {
      setSearchResults([]);
      setLoading(false);
    }
  }, [query]);

  const searchProducts = async (searchTerm) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/api/products/search?q=${encodeURIComponent(searchTerm)}`
      );
      setSearchResults(response.data);
    } catch (err) {
      setError("Không thể tìm kiếm sản phẩm. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container search-page">
        <div className="search-header my-4">
          <h2>
            Kết quả tìm kiếm cho: "<span className="highlight">{query}</span>"
          </h2>
          {!loading && !error && (
            <p className="result-count">
              Tìm thấy {searchResults.length} sản phẩm
            </p>
          )}
        </div>

        {loading ? (
          <div className="status-message">🔍 Đang tìm kiếm...</div>
        ) : error ? (
          <div className="status-message error">{error}</div>
        ) : searchResults.length > 0 ? (
          <div className="row">
            {searchResults.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="no-results text-center">
            <p>
              Không tìm thấy sản phẩm phù hợp với từ khóa{" "}
              <strong>"{query}"</strong>
            </p>
            <Link to="/products" className="btn btn-outline-primary mt-3">
              ← Xem tất cả sản phẩm
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
