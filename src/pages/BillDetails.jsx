import React, { useEffect ,useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Popup from './Popup';
import '../style/BillStyle.css'; // Assuming you use this CSS for the bill

function BillDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPopup,setShowPopup] =useState(true);
  const { user, cart, paymentMethod, orderMethod, grandTotal, orderId } = location.state || {};

  useEffect(() => {
    if (!user || !cart || !orderId) {
      navigate('/checkout');
    }
  }, [user, cart, orderId, navigate]);
const timer = setTimeout(() => {
    setShowPopup(false);
}, 8000);
timer;

  const handlePrint = () => {
    const doc = new jsPDF();
    
    // Bill Header
    doc.setFontSize(18);
    doc.text('Bill Statement', 14, 20);
    doc.setFontSize(12);
    doc.text(`Order ID: ${orderId}`, 14, 30);
    doc.text(`User: ${user}`, 14, 40);
    doc.text(`Payment Method: ${paymentMethod}`, 14, 50);
    doc.text(`Delivery Method: ${orderMethod}`, 14, 60);

    // Bill Table
    const tableColumn = ['Product Name', 'Quantity', 'Price', 'Total Price'];
    const tableRows = cart.map(item => [
      item.proname,
      item.quantity,
      `Rs.${item.price}`,
      `Rs.${item.totalPrice}`
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 70
    });

    // Grand Total
    doc.text(`Grand Total: Rs.${grandTotal}`, 14, doc.lastAutoTable.finalY + 10);

    // Print Bill
    doc.save(`bill_${orderId}.pdf`);
  };

  return (
    <>
     
    <div className="bill-container">
      <h2 className="bill-title">Order Summary</h2>

      <div className="bill-summary">
        <h3>Order Details</h3>
        <p><strong>Order ID:</strong> {orderId}</p>
        <p><strong>Delivery Method:</strong> {orderMethod}</p>
        <p><strong>Payment Method:</strong> {paymentMethod}</p>
        <p><strong>Grand Total:</strong> Rs.{grandTotal}</p>
      </div>

      <table className="bill-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, index) => (
            <tr key={index}>
              <td>{item.proname}</td>
              <td>{item.quantity}</td>
              <td>Rs.{item.price}</td>
              <td>Rs.{item.totalPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="bill-actions">
        <button className="bill-print-button" onClick={handlePrint}>Print Bill</button>
        <Popup showPopup={showPopup} /> {/* Popup for success message */}
      </div>
    </div>
    </>
  );
}

export default BillDetails;
