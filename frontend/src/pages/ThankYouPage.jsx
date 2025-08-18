import React from "react";
import { Link } from "react-router-dom";

function ThankYouPage() {
  return (
    <>
      <div className="container text-center py-5">
      <h2>🎉 Cảm ơn bạn đã mua hàng!</h2>
      <p>Chúng tôi sẽ liên hệ bạn sớm nhất để giao hàng.</p>
      <Link to="/" className="btn btn-primary mt-3">Về trang chủ</Link>
    </div>
    </>
  );
}
export default ThankYouPage;
