const API_URL = 'https://my.api.mockaroo.com/rnl.json?key=5dcd9580&__method=POST';

function parseCSV(csv) {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',');

  return lines.slice(1).map(line => {
    const values = [];
    let current = '';
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const row = {};
    headers.forEach((h, i) => {
      row[h.trim()] = values[i] || '';
    });
    return row;
  });
}

export async function GET() {
  try {
    const res = await fetch(API_URL, { method: 'POST' });
    if (!res.ok) {
      return Response.json({ error: 'Mockaroo API error' }, { status: res.status });
    }

    const text = await res.text();
    const rows = parseCSV(text);

    const sales = rows.map(row => ({
      time: row.date || '',
      product: row.product || '',
      quantity: parseInt(row.quantity, 10) || 0,
      price: parseFloat(row.price) || 0,
      total: (parseFloat(row.price) || 0) * (parseInt(row.quantity, 10) || 0)
    }));

    return Response.json(sales);
  } catch (err) {
    return Response.json({ error: 'Failed to fetch sales data' }, { status: 500 });
  }
}
