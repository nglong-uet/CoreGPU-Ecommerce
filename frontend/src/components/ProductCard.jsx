import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <div className="card h-100">
      <img src={product.imageUrl} className="card-img-top" alt={product.name} />
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">{product.price.toLocaleString()} VND</p>
        <Link to={`/product/${product.id}`} className="btn btn-primary">Xem chi tiết</Link>
      </div>
    </div>
  );
}

export default ProductCard;
