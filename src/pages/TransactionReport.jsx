// TransactionReport.js
import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const TransactionReport = ({ transactions }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Vel\'z Supermarket', 14, 20);
    doc.setFontSize(12);
    doc.text('Revenue Report', 14, 30);

    const tableColumn = [
      'Order ID',
      'Date',
      'Total Amount ($)',
      'Payment Mode',
      'Payment Status'
    ];

    const tableRows = transactions.map(transaction => [
      transaction._id,
      new Date(transaction.dateTime).toLocaleDateString(),
      transaction.totalAmount.toFixed(2),
      transaction.paymentMode,
      transaction.paymentStatus
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'striped',
    });

    const totalRevenue = transactions.reduce((acc, trans) => acc + trans.totalAmount, 0);
    const totalTransactions = transactions.length;
    const avgRevenue = (totalRevenue / totalTransactions).toFixed(2);

    doc.setFontSize(12);
    doc.text(`Total Transactions: ${totalTransactions}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Total Revenue: $${totalRevenue.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 20);
    doc.text(`Average Revenue per Transaction: $${avgRevenue}`, 14, doc.lastAutoTable.finalY + 30);

    doc.save('Revenue_Report.pdf');
  };

  return (
    <div>
      <h2>Transaction Report</h2>
      <button onClick={generatePDF}>Download PDF</button>
    </div>
  );
};

export default TransactionReport;
