
import type { BulkResultItem } from '../types';

function escapeCsvField(field: any): string {
    if (field === null || field === undefined) {
        return '';
    }
    const stringField = String(field);
    if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
        return `"${stringField.replace(/"/g, '""')}"`;
    }
    return stringField;
}

function downloadFile(content: string, fileName: string, contentType: string) {
    const blob = new Blob([content], { type: contentType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

// --- Converters ---

function convertToSimpleCsv(data: BulkResultItem[]): string {
    if (data.length === 0) return '';
    const headers = [
        'Query', 'Status', 'Error', 'ProductName', 'Brand', 'Model', 
        'Description', 'ImageURL'
    ];
    const rows = data.map(item => {
        const status = item.error ? 'Failed' : 'Success';
        return [
            escapeCsvField(item.query),
            escapeCsvField(status),
            escapeCsvField(item.error),
            escapeCsvField(item.product?.productName),
            escapeCsvField(item.product?.brand),
            escapeCsvField(item.product?.model),
            escapeCsvField(item.product?.description),
            escapeCsvField(item.product?.imageUrl),
        ].join(',');
    });
    return [headers.join(','), ...rows].join('\n');
}

function convertToExpandedCsv(data: BulkResultItem[]): string {
    if (data.length === 0) return '';
    
    // Find all unique specification names across all results
    const specNameSet = new Set<string>();
    data.forEach(item => {
        if (item.product?.specifications) {
            item.product.specifications.forEach(spec => {
                if(spec.name) specNameSet.add(spec.name);
            });
        }
    });
    const sortedSpecNames = Array.from(specNameSet).sort();

    const baseHeaders = [
        'Query', 'Status', 'Error', 'ProductName', 'Brand', 'Model', 
        'Description', 'ImageURL'
    ];
    const headers = [...baseHeaders, ...sortedSpecNames.map(escapeCsvField)];

    const rows = data.map(item => {
        const status = item.error ? 'Failed' : 'Success';
        
        const specMap = new Map<string, string>();
        if (item.product?.specifications) {
            item.product.specifications.forEach(spec => {
                if (spec.name) specMap.set(spec.name, spec.value);
            });
        }

        const baseRow = [
            escapeCsvField(item.query),
            escapeCsvField(status),
            escapeCsvField(item.error),
            escapeCsvField(item.product?.productName),
            escapeCsvField(item.product?.brand),
            escapeCsvField(item.product?.model),
            escapeCsvField(item.product?.description),
            escapeCsvField(item.product?.imageUrl),
        ];

        const specRow = sortedSpecNames.map(specName => escapeCsvField(specMap.get(specName)));

        return [...baseRow, ...specRow].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
}

// --- Public Download Functions ---

export function downloadAsJson(results: BulkResultItem[]) {
    const jsonString = JSON.stringify(results, null, 2);
    downloadFile(jsonString, 'product_specs_results.json', 'application/json');
}

export function downloadAsSimpleCsv(results: BulkResultItem[]) {
    const csvString = convertToSimpleCsv(results);
    downloadFile(csvString, 'product_specs_simple.csv', 'text/csv;charset=utf-8;');
}

export function downloadAsExpandedCsv(results: BulkResultItem[]) {
    const csvString = convertToExpandedCsv(results);
    downloadFile(csvString, 'product_specs_expanded.csv', 'text/csv;charset=utf-8;');
}
