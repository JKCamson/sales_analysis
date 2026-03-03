'use client';

import { useState, useEffect, useCallback } from 'react';

function formatCurrency(amount) {
  return '$' + Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function Home() {
  const [sales, setSales] = useState([]);
  const [isOnline, setIsOnline] = useState(false);

  const fetchSales = useCallback(async () => {
    try {
      const res = await fetch('/api/sales/live');
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      if (data && data.length > 0) {
        setSales(data);
        setIsOnline(true);
      }
    } catch {
      setIsOnline(false);
    }
  }, []);

  useEffect(() => {
    fetchSales();
    const interval = setInterval(fetchSales, 5000);
    return () => clearInterval(interval);
  }, [fetchSales]);

  const totalOrders = sales.length;
  const totalRevenue = sales.reduce((sum, s) => sum + (s.total || 0), 0);

  const productTotals = {};
  sales.forEach(s => {
    const name = s.product || 'Unknown';
    productTotals[name] = (productTotals[name] || 0) + (s.total || 0);
  });
  const topProduct = Object.entries(productTotals)
    .sort((a, b) => b[1] - a[1])[0];

  return (
    <>
      <header>
        <h1>Sales Analyst</h1>
        <div className="status">
          <span className={`status-dot ${isOnline ? 'online' : 'offline'}`}></span>
          <span>{isOnline ? 'Live' : 'Waiting for API...'}</span>
        </div>
      </header>

      <main>
        <section className="stats-row">
          <div className="stat-card">
            <span className="stat-label">Total Sales</span>
            <span className="stat-value">{totalOrders || '--'}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Orders Today</span>
            <span className="stat-value">{totalOrders || '--'}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Revenue</span>
            <span className="stat-value">{totalRevenue ? formatCurrency(totalRevenue) : '--'}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Top Product</span>
            <span className="stat-value">{topProduct ? topProduct[0] : '--'}</span>
          </div>
        </section>

        <section className="sales-table-container">
          <h2>Live Sales</h2>
          <table className="sales-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {sales.length === 0 ? (
                <tr className="empty-row">
                  <td colSpan="5">No sales data yet. Connect your API to get started.</td>
                </tr>
              ) : (
                sales.map((sale, i) => (
                  <tr key={i}>
                    <td>{sale.time || '--'}</td>
                    <td>{sale.product || '--'}</td>
                    <td>{sale.quantity || '--'}</td>
                    <td>{formatCurrency(sale.price || 0)}</td>
                    <td>{formatCurrency(sale.total || 0)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>
    </>
  );
}
