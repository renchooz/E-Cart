import React from 'react';

export function ReceiptModal({ receipt, onClose }) {
  if (!receipt) return null;
  function formatINR(value) {
    try {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(value || 0));
    } catch {
      return `₹${Number(value || 0).toFixed(2)}`;
    }
  }
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded p-4 w-full max-w-sm space-y-2">
        <div className="text-lg font-semibold">Receipt</div>
        <div className="text-sm text-gray-700">Thanks, {receipt.name}!</div>
        <div className="text-sm">Total: {formatINR(receipt.total)}</div>
        <div className="text-xs text-gray-500">{new Date(receipt.timestamp).toLocaleString()}</div>
        <div className="flex justify-end">
          <button className="px-3 py-2 bg-gray-900 text-white rounded" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}


