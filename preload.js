const { contextBridge } = require('electron');

// Expose a safe API to the renderer process
// We'll add API fetch methods here once you share API details
contextBridge.exposeInMainWorld('salesAPI', {
  // Placeholder — will be replaced with real API calls
  fetchSales: async () => {
    // TODO: Replace with your actual API endpoint
    // Example: const res = await fetch('https://your-api.com/sales');
    // return res.json();
    return [];
  }
});
