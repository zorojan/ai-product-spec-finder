
import React from 'react';
import type { ProductInfo, GroundingChunk } from '../types';
import { SourceLink } from './SourceLink';
import { ImageIcon } from './icons/ImageIcon';

interface ProductCardProps {
  product: ProductInfo;
  sources: GroundingChunk[];
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, sources }) => {
  return (
    <div className="w-full max-w-4xl bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-lg p-6 sm:p-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-1 flex flex-col items-center">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.productName} 
              className="w-full h-auto max-h-80 object-contain rounded-lg bg-slate-700/50 p-2"
              onError={(e) => { 
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none'; 
                  const nextSibling = target.nextElementSibling;
                  if (nextSibling) {
                    nextSibling.classList.remove('hidden');
                  }
                }}
            />
          ) : null}
          <div className={`${product.imageUrl ? 'hidden' : ''} w-full h-64 bg-slate-700/50 rounded-lg flex items-center justify-center`}>
              <ImageIcon className="w-24 h-24 text-slate-500" />
          </div>
        </div>
        <div className="lg:col-span-2">
          <p className="text-sm font-semibold text-sky-400">{product.brand}</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">{product.productName}</h2>
          <p className="text-md text-slate-400 mt-1">{product.model}</p>
          {product.description && <p className="mt-4 text-slate-300">{product.description}</p>}
        </div>
      </div>

      <div className="mt-8 border-t border-slate-700 pt-6">
        <h3 className="text-xl font-semibold text-white mb-4">Specifications</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
          {product.specifications.map((spec, index) => (
            <li key={index} className="flex flex-col bg-slate-700/30 p-3 rounded-lg">
              <span className="text-sm font-medium text-slate-400">{spec.name}</span>
              <span className="text-md font-semibold text-white">{spec.value}</span>
            </li>
          ))}
        </ul>
      </div>

      {sources && sources.length > 0 && (
         <div className="mt-8 border-t border-slate-700 pt-6">
            <h3 className="text-xl font-semibold text-white mb-4">Sources</h3>
            <div className="flex flex-wrap gap-3">
                {sources.map((source, index) => (
                    <SourceLink key={index} source={source} />
                ))}
            </div>
        </div>
      )}
    </div>
  );
};