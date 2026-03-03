// renderer.js — runs in the browser window

const statusDot = document.getElementById('connection-status');
const statusText = document.getElementById('status-text');
const salesBody = document.getElementById('sales-body');
const totalSalesEl = document.getElementById('total-sales');
const ordersTodayEl = document.getElementById('orders-today');
const revenueEl = document.getElementById('revenue');
const topProductEl = document.getElementById('top-product');

function setOnline() {
  statusDot.classList.remove('offline');
  statusDot.classList.add('online');
  statusText.textContent = 'Live';
}

function setOffline() {
  statusDot.classList.remove('online');
  statusDot.classList.add('offline');
  statusText.textContent = 'Disconnected';
}

function formatCurrency(amount) {
  return '$' + Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function renderSales(sales) {
  if (!sales || sales.length === 0) return;

  salesBody.innerHTML = '';

  sales.forEach(sale => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${sale.time || '--'}</td>
      <td>${sale.product || '--'}</td>
      <td>${sale.quantity || '--'}</td>
      <td>${formatCurrency(sale.price || 0)}</td>
      <td>${formatCurrency(sale.total || 0)}</td>
    `;
    salesBody.appendChild(row);
  });
}

function updateStats(sales) {
  if (!sales || sales.length === 0) return;

  const totalOrders = sales.length;
  const totalRevenue = sales.reduce((sum, s) => sum + (s.total || 0), 0);

  // Find top product by total revenue
  const productTotals = {};
  sales.forEach(s => {
    const name = s.product || 'Unknown';
    productTotals[name] = (productTotals[name] || 0) + (s.total || 0);
  });
  const topProduct = Object.entries(productTotals)
    .sort((a, b) => b[1] - a[1])[0];

  totalSalesEl.textContent = totalOrders;
  ordersTodayEl.textContent = totalOrders;
  revenueEl.textContent = formatCurrency(totalRevenue);
  topProductEl.textContent = topProduct ? topProduct[0] : '--';
}

// Poll for sales data — will activate once API is connected
async function pollSales() {
  try {
    const sales = await window.salesAPI.fetchSales();
    if (sales && sales.length > 0) {
      setOnline();
      renderSales(sales);
      updateStats(sales);
    }
  } catch (err) {
    setOffline();
    console.error('Failed to fetch sales:', err);
  }
}

// Poll every 5 seconds
setInterval(pollSales, 5000);

// Initial fetch
pollSales();
