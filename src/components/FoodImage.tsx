import { useState } from 'react';
import { Camera } from 'lucide-react';

interface FoodImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
  loading?: 'eager' | 'lazy';
}

/**
 * Komponen foto makanan dengan fallback placeholder yang rapi.
 * Jika suatu saat file foto diganti atau belum tersedia, area placeholder
 * akan tampil bersih tanpa ikon gambar rusak.
 */
export function FoodImage({
  src,
  alt,
  className = '',
  fallbackLabel = 'Area Foto Produk Asli',
  loading = 'lazy',
}: FoodImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#362015] to-[#24150E] p-6 text-center text-[#DFCBB5] ${className}`}
      >
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[#DEB05B]/30 bg-[#DEB05B]/10 text-[#DEB05B]">
          <Camera className="h-5 w-5" aria-hidden="true" />
        </div>
        <p className="font-display text-base font-medium text-[#FAF6F0]">
          {fallbackLabel}
        </p>
        <p className="mt-1 max-w-xs text-xs text-[#DFCBB5]/80">
          Ganti dengan foto produk milik sendiri di src/data/business.ts
        </p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
