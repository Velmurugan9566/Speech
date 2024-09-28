
 // Import autoTable plugin
 import React from "react";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
 function generatePDF(cart) {
    const doc = new jsPDF();
  
    // Title
    doc.setFontSize(18);
    doc.text("Shopping Cart Bill", doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
  
    // Date and Time
    const currentDate = new Date().toLocaleString();
    doc.setFontSize(12);
    doc.text(`Date: ${currentDate}`, 10, 30); // Left aligned
  
    // Table headers
    const headers = [["S.No.", "Product Name", "Quantity", "Price", "Total"]];
  
    // Table body (product details)
    const data = cart.map((item, index) => [
      index + 1,
      item.proname,
      item.quantity,
      parseFloat(item.price).toFixed(2), // Ensure price is a number
      parseFloat(item.totalPrice || 0).toFixed(2) // Ensure totalPrice is a number and fallback to 0 if undefined
    ]);
  
    // Draw the table
    doc.autoTable({
      head: headers,
      body: data,
      startY: 40, // Start after the Date
      theme: 'grid', // Adds borders around the cells
      styles: {
        halign: 'center', // Center align text
        cellPadding: 3,
      },
      headStyles: { fillColor: [71, 103, 154] }, // Header background color
      bodyStyles: { valign: 'middle' }, // Vertically align text to the middle
      columnStyles: {
        0: { cellWidth: 15 },  // S.No.
        1: { cellWidth: 80 },  // Product Name
        2: { cellWidth: 30 },  // Quantity
        3: { cellWidth: 30 },  // Price
        4: { cellWidth: 30 },  // Total Price
      },
    });
  
    // Calculate total price
    const totalPrice = cart.reduce((acc, item) => acc + parseFloat(item.totalPrice || 0), 0).toFixed(2);
  
    // Add total amount at the end of the table
    const finalY = doc.lastAutoTable.finalY + 10; // Position after the table
    doc.setFontSize(14);
    doc.text(`Total Amount: Rs. ${totalPrice}`, 10, finalY);
  
    // Add footer (thank you message)
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(12);
    doc.text("Thank you for purchasing!", doc.internal.pageSize.getWidth() / 2, pageHeight - 10, { align: 'center' });
  
    // Save the PDF
    doc.save("shopping-cart-bill.pdf");
  }

  export default generatePDF;