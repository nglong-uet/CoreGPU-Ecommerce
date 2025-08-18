import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PaymentReturn() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Đang xử lý...");
  const navigate = useNavigate();

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    axios.get("http://localhost:8080/api/payment/return", { params })
      .then(res => {
        setMessage(res.data);
        setTimeout(() => navigate("/thankyou"), 2000);
      })
      .catch(err => {
        setMessage("Thanh toán thất bại");
      });
  }, [searchParams]);

  return <div style={{ padding: 30 }}>{message}</div>;
}
