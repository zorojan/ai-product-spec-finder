
import React from 'react';
import type { BulkResultItem } from '../types';

interface ResultsTableProps {
  results: BulkResultItem[];
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  return (
    <div className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-800">
                <tr>
                    <th className="p-4 text-sm font-semibold text-slate-300">Query</th>
                    <th className="p-4 text-sm font-semibold text-slate-300">Status</th>
                    <th className="p-4 text-sm font-semibold text-slate-300">Product Name</th>
                    <th className="p-4 text-sm font-semibold text-slate-300">Brand</th>
                    <th className="p-4 text-sm font-semibold text-slate-300">Model</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                {results.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 align-top">
                        <span className="font-mono text-sm text-slate-400">{item.query}</span>
                    </td>
                    <td className="p-4 align-top">
                        {item.error ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900 text-red-200">
                            Failed
                        </span>
                        ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-200">
                            Success
                        </span>
                        )}
                    </td>
                    <td className="p-4 align-top text-white">{item.product?.productName || <span className="text-slate-500 italic">{item.error}</span>}</td>
                    <td className="p-4 align-top text-slate-300">{item.product?.brand || 'N/A'}</td>
                    <td className="p-4 align-top text-slate-300">{item.product?.model || 'N/A'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};
