import chocolateGanachePhoto from '../assets/photos/chocolate-ganache.jpg';
import martabakCoklatKejuPhoto from '../assets/photos/martabak-coklat-keju.jpg';
import martabakKacangPhoto from '../assets/photos/martabak-kacang.jpg';
import martabakKejuPhoto from '../assets/photos/martabak-keju.jpg';
import martabakPizzaPhoto from '../assets/photos/martabak-pizza.jpg';
import oreoBrowniePhoto from '../assets/photos/oreo-brownie.jpg';
import originalCokelatPhoto from '../assets/photos/original-cokelat.jpg';
import walnutBrowniesPhoto from '../assets/photos/walnut-brownies.jpg';

/**
 * KONFIGURASI USAHA MARTABAK BROWNIS
 * ----------------------------------
 * Ubah informasi di bawah ini sesuai data resmi usaha Anda.
 * Semua foto produk menggunakan foto makanan asli (bukan AI) yang tersimpan
 * di folder `src/assets/photos/` sehingga mudah diganti dengan foto dapur sendiri.
 */
export const BUSINESS_INFO = {
  name: 'MARTABAK BROWNIS',
  tagline: 'Lembut di Dalam, Manis di Setiap Gigitan',
  category: 'Kuliner & Makanan Ringan',
  location: 'Banda Aceh, Aceh',
  // Ganti nomor placeholder ini dengan nomor WhatsApp resmi (format internasional tanpa tanda +)
  whatsappNumber: '628XXXXXXXXXX',
  whatsappDisplayPlaceholder: '+62 8XX-XXXX-XXXX (Placeholder — Ganti Nomor Usaha)',
  addressPlaceholder: 'Banda Aceh, Aceh (Alamat lengkap dapat disesuaikan)',
  hoursPlaceholder: 'Jam operasional dapat disesuaikan di sini',
  socials: [
    { label: 'Instagram', handle: '@martabakbrownis.placeholder' },
    { label: 'TikTok', handle: '@martabakbrownis.placeholder' },
    { label: 'WhatsApp', handle: 'Pemesanan Langsung' },
  ],
} as const;

export const HERO_PHOTO = {
  src: martabakKejuPhoto,
  alt: 'Sajian Martabak Brownis asli dengan lapisan cokelat lumer dan taburan keju parut di atas papan kayu',
  caption: 'Foto asli sajian martabak cokelat lembut dengan topping melimpah',
};

export const ABOUT_PHOTO = {
  src: martabakCoklatKejuPhoto,
  alt: 'Potongan tebal Martabak Brownis dengan tekstur empuk dan lelehan cokelat pekat',
  caption: 'Tekstur lembut di dalam berpadu dengan cokelat khas brownis',
};

export interface NavItem {
  id: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'tentang-kami', label: 'Tentang Kami' },
  { id: 'menu', label: 'Menu' },
  { id: 'galeri', label: 'Galeri' },
  { id: 'keunggulan', label: 'Keunggulan' },
  { id: 'swot', label: 'SWOT' },
  { id: 'kontak', label: 'Kontak' },
];

export type MenuCategory = 'semua' | 'klasik' | 'spesial';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  priceFormatted: string;
  category: Exclude<MenuCategory, 'semua'>;
  categoryLabel: string;
  highlight?: string;
  description: string;
  image: string;
  imageAlt: string;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'original-cokelat',
    name: 'Original Cokelat',
    price: 15000,
    priceFormatted: 'Rp15.000',
    category: 'klasik',
    categoryLabel: 'Varian Klasik',
    highlight: 'Rasa Otentik',
    description:
      'Adonan martabak lembut dengan cita rasa cokelat khas brownis yang pekat, manis seimbang, dan nikmat di setiap gigitan.',
    image: originalCokelatPhoto,
    imageAlt: 'Foto asli Original Cokelat dengan tekstur brownis cokelat lembut dan potongan cokelat pekat',
  },
  {
    id: 'cokelat-keju',
    name: 'Cokelat Keju',
    price: 18000,
    priceFormatted: 'Rp18.000',
    category: 'klasik',
    categoryLabel: 'Varian Klasik',
    highlight: 'Paling Diminati',
    description:
      'Perpaduan manis legit cokelat brownis dengan parutan keju gurih melimpah yang lumer saat disantap hangat.',
    image: martabakKejuPhoto,
    imageAlt: 'Foto asli Cokelat Keju dengan lelehan cokelat dan taburan keju parut',
  },
  {
    id: 'cokelat-kacang',
    name: 'Cokelat Kacang',
    price: 18000,
    priceFormatted: 'Rp18.000',
    category: 'klasik',
    categoryLabel: 'Varian Klasik',
    description:
      'Kelembutan martabak brownis cokelat dipadukan dengan taburan kacang renyah yang harum dan kaya tekstur.',
    image: walnutBrowniesPhoto,
    imageAlt: 'Foto asli Cokelat Kacang dengan tekstur brownis cokelat dan potongan kacang renyah',
  },
  {
    id: 'cokelat-oreo',
    name: 'Cokelat Oreo',
    price: 20000,
    priceFormatted: 'Rp20.000',
    category: 'spesial',
    categoryLabel: 'Varian Spesial',
    highlight: 'Favorit Remaja',
    description:
      'Sentuhan remahan biskuit Oreo renyah dan krim manis di atas martabak brownis cokelat yang lembut.',
    image: oreoBrowniePhoto,
    imageAlt: 'Foto asli Cokelat Oreo dengan potongan biskuit cokelat hitam dan krim',
  },
  {
    id: 'premium-mix',
    name: 'Premium Mix',
    price: 25000,
    priceFormatted: 'Rp25.000',
    category: 'spesial',
    categoryLabel: 'Varian Spesial',
    highlight: 'Topping Lengkap',
    description:
      'Kombinasi lengkap berbagai topping pilihan dalam satu loyang untuk momen kumpul keluarga, teman, maupun acara spesial.',
    image: martabakPizzaPhoto,
    imageAlt: 'Foto asli Premium Mix martabak manis dengan aneka topping lengkap melimpah',
  },
];

export interface ProductFeature {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: 'layers' | 'flame' | 'cookie' | 'tag' | 'shield';
}

export const PRODUCT_FEATURES: ProductFeature[] = [
  {
    id: 'tekstur',
    number: '01',
    title: 'Tekstur lembut dan empuk',
    description:
      'Dipanggang dengan takaran adonan dan suhu yang tepat sehingga menghasilkan serat halus yang lembut di dalam.',
    icon: 'layers',
  },
  {
    id: 'rasa-cokelat',
    number: '02',
    title: 'Rasa cokelat yang khas',
    description:
      'Memadukan karakter martabak manis dengan kedalaman rasa cokelat khas brownis yang tidak enek.',
    icon: 'flame',
  },
  {
    id: 'topping',
    number: '03',
    title: 'Topping bervariasi',
    description:
      'Tersedia mulai dari Original Cokelat, Keju, Kacang, Oreo, hingga Premium Mix sesuai selera pelanggan.',
    icon: 'cookie',
  },
  {
    id: 'harga',
    number: '04',
    title: 'Harga terjangkau',
    description:
      'Mulai dari Rp15.000 hingga Rp25.000, ramah di kantong pelajar, mahasiswa, pekerja, dan keluarga.',
    icon: 'tag',
  },
  {
    id: 'bahan',
    number: '05',
    title: 'Menggunakan bahan berkualitas',
    description:
      'Mengutamakan bahan pilihan yang segar dan bersih untuk menjaga cita rasa serta kualitas setiap pesanan.',
    icon: 'shield',
  },
];

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  alt: string;
  spanClass?: string;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'galeri-utuh',
    title: 'Martabak Brownis Utuh',
    category: 'Sajian Utuh',
    description: 'Loyang penuh dengan isian cokelat melimpah yang siap dinikmati bersama.',
    image: martabakKacangPhoto,
    alt: 'Foto asli martabak manis utuh dengan isian cokelat dan kacang yang padat',
    spanClass: 'md:col-span-2',
  },
  {
    id: 'galeri-potongan',
    title: 'Potongan Martabak Lembut',
    category: 'Tekstur Dalam',
    description: 'Potongan tebal memperlihatkan pori lembut dan lapisan cokelat lumer di bagian tengah.',
    image: martabakCoklatKejuPhoto,
    alt: 'Foto asli martabak manis yang sudah dipotong menampilkan tekstur empuk dan cokelat keju',
  },
  {
    id: 'galeri-lelehan',
    title: 'Lelehan Cokelat Pekat',
    category: 'Cita Rasa Cokelat',
    description: 'Karakter cokelat khas brownis yang mengilap, kental, dan menggugah selera.',
    image: chocolateGanachePhoto,
    alt: 'Foto asli lelehan cokelat pekat mengilap untuk topping dan adonan brownis',
  },
  {
    id: 'galeri-keju-kacang',
    title: 'Topping Keju & Kacang',
    category: 'Kombinasi Gurih',
    description: 'Keseimbangan rasa manis cokelat dengan gurihnya keju dan renyahnya kacang.',
    image: walnutBrowniesPhoto,
    alt: 'Foto asli brownis cokelat dengan potongan kacang renyah',
  },
  {
    id: 'galeri-oreo',
    title: 'Varian Cokelat Oreo',
    category: 'Favorit Kekinian',
    description: 'Perpaduan adonan cokelat gelap dengan remahan biskuit Oreo yang renyah.',
    image: oreoBrowniePhoto,
    alt: 'Foto asli brownis cokelat dengan topping remahan Oreo',
  },
  {
    id: 'galeri-premium-mix',
    title: 'Varian Premium Mix',
    category: 'Aneka Topping',
    description: 'Sajian penuh warna dengan beragam topping melimpah dalam satu loyang spesial.',
    image: martabakPizzaPhoto,
    alt: 'Foto asli martabak manis varian Premium Mix dengan berbagai topping lengkap',
    spanClass: 'md:col-span-2',
  },
];

export interface SwotCardData {
  key: 'S' | 'W' | 'O' | 'T';
  title: string;
  subtitle: string;
  tone: 'strength' | 'weakness' | 'opportunity' | 'threat';
  points: string[];
}

export const SWOT_DATA: SwotCardData[] = [
  {
    key: 'S',
    title: 'STRENGTH',
    subtitle: 'Kekuatan',
    tone: 'strength',
    points: [
      'Rasa lezat dan khas.',
      'Harga terjangkau.',
      'Banyak pilihan topping.',
      'Bahan baku mudah diperoleh.',
      'Cocok untuk berbagai kalangan.',
    ],
  },
  {
    key: 'W',
    title: 'WEAKNESS',
    subtitle: 'Kelemahan',
    tone: 'weakness',
    points: [
      'Produk tidak tahan terlalu lama.',
      'Membutuhkan ketelitian dalam proses pembuatan.',
      'Memerlukan modal awal.',
      'Penjualan dapat menurun jika kurang promosi.',
    ],
  },
  {
    key: 'O',
    title: 'OPPORTUNITY',
    subtitle: 'Peluang',
    tone: 'opportunity',
    points: [
      'Banyak masyarakat menyukai camilan manis.',
      'Bisa dipasarkan melalui Instagram, WhatsApp, dan TikTok.',
      'Menerima pesanan acara ulang tahun.',
      'Berpeluang membuka cabang.',
    ],
  },
  {
    key: 'T',
    title: 'THREAT',
    subtitle: 'Ancaman',
    tone: 'threat',
    points: [
      'Banyak pesaing makanan sejenis.',
      'Harga bahan baku dapat meningkat.',
      'Selera konsumen dapat berubah.',
      'Persaingan harga dengan usaha makanan lainnya.',
    ],
  },
];

export interface TargetSegment {
  id: string;
  label: string;
  value: string;
  detail: string;
  icon: 'calendar' | 'users' | 'briefcase' | 'heart';
}

export const TARGET_MARKET: TargetSegment[] = [
  {
    id: 'usia',
    label: 'Usia',
    value: '12–35 tahun',
    detail: 'Mencakup remaja sekolah, dewasa muda, hingga keluarga muda yang gemar camilan manis.',
    icon: 'calendar',
  },
  {
    id: 'gender',
    label: 'Gender',
    value: 'Laki-laki dan perempuan',
    detail: 'Diformulasikan dengan tingkat kemanisan yang pas untuk dinikmati oleh semua kalangan.',
    icon: 'users',
  },
  {
    id: 'status',
    label: 'Status',
    value: 'Pelajar, mahasiswa, pekerja, dan masyarakat umum',
    detail: 'Praktis sebagai teman belajar, camilan kantor, suguhan santai, maupun hantaran acara.',
    icon: 'briefcase',
  },
  {
    id: 'minat',
    label: 'Minat',
    value: 'Menyukai makanan manis, makanan kekinian, dan camilan',
    detail: 'Cocok bagi pencinta dessert cokelat dan variasi topping modern yang menggugah selera.',
    icon: 'heart',
  },
];

export function formatRupiah(amount: number): string {
  return `Rp${amount.toLocaleString('id-ID')}`;
}

export function buildWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encoded}`;
}
