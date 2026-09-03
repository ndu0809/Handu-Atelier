// ===== Traditional =====
import tingkuluakTanduak from "../assets/images/costumes/tingkuluak-tanduak.jpeg";
import suntiangTaram from "../assets/images/costumes/suntiang-taram.jpeg";
import tingkuluakLenggek from "../assets/images/costumes/tingkuluak-lenggek.jpeg";
import suntiangSolok from "../assets/images/costumes/suntiang-solok.jpeg";
import basibaTingkuluakKopong from "../assets/images/costumes/basiba-tingkuluak-kopong.jpeg";
import tingkuluakKopongBatik from "../assets/images/costumes/tingkuluak-kopong-batik.jpeg";
import bajuTariKapaloBatikKuciang from "../assets/images/costumes/baju-tari-kapalo-batik-kucing.jpeg";
import bajuTariBadestar from "../assets/images/costumes/baju-tari-badestar.jpeg";
import suntiangPariaman from "../assets/images/costumes/suntiang-pariaman.jpeg";
import tingkuluakKotoGadang from "../assets/images/costumes/tingkuluak-koto-gadang.jpeg";
import sigerJawa from "../assets/images/costumes/siger-jawa.jpeg";
import agengKanigaran from "../assets/images/costumes/ageng-kanigaran.jpeg";
import paesAgengJangkep from "../assets/images/costumes/paes-ageng-jangkep.jpeg";
import jogjaPutri from "../assets/images/costumes/jogja-putri.jpeg";
import pakaianAdatSoloPutri from "../assets/images/costumes/pakaian-adat-solo-putri.jpeg";

// ===== Modern =====
import jasPriaHitam from "../assets/images/costumes/jas-pria-hitam.jpeg";
import jasPriaPutih from "../assets/images/costumes/jas-pria-putih.jpeg";
import jasPriaHitamPutih from "../assets/images/costumes/jas-pria-hitam-putih.jpeg";
import weddingDressNonHijab from "../assets/images/costumes/wedding-dress-non-hijab.jpeg";
import weddingDressHijab from "../assets/images/costumes/wedding-dress-hijab.jpeg";
import dressAwardsNonHijab from "../assets/images/costumes/dress-awards-non-hijab.jpeg";
import dressAwardsHijab from "../assets/images/costumes/dress-awards-hijab.jpeg";
import glamOutfitMen from "../assets/images/costumes/glam-outfit-men.jpeg";

// ===== Classic =====
import dressNoniBelandaVintage from "../assets/images/costumes/dress-noni-belanda-vintage.jpeg";
import dressVintageEropaItalian from "../assets/images/costumes/dress-vintage-eropa-italian.jpeg";
import frenchStyleRetro from "../assets/images/costumes/french-style-retro.jpeg";
import dressVintageKerajaan from "../assets/images/costumes/dress-vintage-kerajaan.jpeg";
import halloweenKostum from "../assets/images/costumes/halloween-kostum.jpeg";
import bridgertonKostum from "../assets/images/costumes/bridgerton-kostum.jpeg";

// ===== Formal =====
import guideFormalAttireWanita from "../assets/images/costumes/guide-formal-attire-wanita.jpeg";
import houseOfCuffHousecuffVest from "../assets/images/costumes/house-of-cuff-housecuff-vest.jpeg";
import tuxedo from "../assets/images/costumes/tuxedo.jpeg";
import dressKoreanStyle from "../assets/images/costumes/dress-korean-style.jpeg";
import semiFormal from "../assets/images/costumes/semi-formal.jpeg";
import blazer from "../assets/images/costumes/blazer.jpeg";

const costumes = [
      // =========================
  // TRADITIONAL
  // =========================

  {
    id: 1,
    code: "TR001",
    category: "traditional",
    slug: "tingkuluak-tanduak",
    collectionName: "Tingkuluak Tanduak",
    costumeType: "Pakaian Adat Minangkabau",
    image: tingkuluakTanduak,
    price: 350000,
    deposit: 175000,
    stock: 1,
    available: true,
    size: ["S", "M", "L", "XL"],
    gender: "Wanita",
    featured: true,
  },

  {
    id: 2,
    code: "TR002",
    category: "traditional",
    slug: "suntiang-taram",
    collectionName: "Suntiang Taram",
    costumeType: "Pakaian Adat Minangkabau",
    image: suntiangTaram,
    price: 400000,
    deposit: 200000,
    stock: 1,
    available: true,
    size: ["M", "L"],
    gender: "Wanita",
    featured: false,
  },

  {
    id: 3,
    code: "TR003",
    category: "traditional",
    slug: "tingkuluak-lenggek",
    collectionName: "Tingkuluak Lenggek",
    costumeType: "Pakaian Adat Minangkabau",
    image: tingkuluakLenggek,
    price: 350000,
    deposit: 175000,
    stock: 1,
    available: true,
    size: ["S", "M", "L"],
    gender: "Wanita",
    featured: false,
  },

  {
    id: 4,
    code: "TR004",
    category: "traditional",
    slug: "suntiang-solok",
    collectionName: "Suntiang Solok",
    costumeType: "Pakaian Adat Minangkabau",
    image: suntiangSolok,
    price: 400000,
    deposit: 200000,
    stock: 1,
    available: true,
    size: ["M", "L"],
    gender: "Wanita",
    featured: false,
  },

  {
    id: 5,
    code: "TR005",
    category: "traditional",
    slug: "basiba-tingkuluak-kopong",
    collectionName: "Basiba Tingkuluak Kopong",
    costumeType: "Baju Basiba",
    image: basibaTingkuluakKopong,
    price: 300000,
    deposit: 150000,
    stock: 1,
    available: true,
    size: ["S", "M", "L"],
    gender: "Wanita",
    featured: false,
  },

  {
    id: 6,
    code: "TR006",
    category: "traditional",
    slug: "tingkuluak-kopong-batik",
    collectionName: "Tingkuluak Kopong Batik",
    costumeType: "Pakaian Adat Minangkabau",
    image: tingkuluakKopongBatik,
    price: 300000,
    deposit: 150000,
    stock: 1,
    available: true,
    size: ["S", "M", "L"],
    gender: "Wanita",
    featured: false,
  },

  {
    id: 7,
    code: "TR007",
    category: "traditional",
    slug: "kapalo-kuciang",
    collectionName: "Kapalo Kuciang",
    costumeType: "Baju Tari",
    image: bajuTariKapaloBatikKuciang,
    price: 250000,
    deposit: 125000,
    stock: 2,
    available: true,
    size: ["S", "M"],
    gender: "Wanita",
    featured: false,
  },

  {
    id: 8,
    code: "TR008",
    category: "traditional",
    slug: "badestar",
    collectionName: "Badestar",
    costumeType: "Baju Tari",
    image: bajuTariBadestar,
    price: 250000,
    deposit: 125000,
    stock: 2,
    available: true,
    size: ["S", "M"],
    gender: "Wanita",
    featured: false,
  },

  {
    id: 9,
    code: "TR009",
    category: "traditional",
    slug: "suntiang-pariaman",
    collectionName: "Suntiang Pariaman",
    costumeType: "Pengantin Minangkabau",
    image: suntiangPariaman,
    price: 700000,
    deposit: 350000,
    stock: 1,
    available: true,
    size: ["M", "L"],
    gender: "Wanita",
    featured: true,
  },

  {
    id: 10,
    code: "TR010",
    category: "traditional",
    slug: "tingkuluak-koto-gadang",
    collectionName: "Tingkuluak Koto Gadang",
    costumeType: "Pengantin Minangkabau",
    image: tingkuluakKotoGadang,
    price: 700000,
    deposit: 350000,
    stock: 1,
    available: true,
    size: ["M", "L"],
    gender: "Wanita",
    featured: true,
  },

  {
    id: 11,
    code: "TR011",
    category: "traditional",
    slug: "siger-jawa",
    collectionName: "Siger Jawa Barat",
    costumeType: "Pakaian Adat",
    image: sigerJawa,
    price: 600000,
    deposit: 300000,
    stock: 1,
    available: true,
    size: ["M", "L"],
    gender: "Wanita",
    featured: false,
  },

  {
    id: 12,
    code: "TR012",
    category: "traditional",
    slug: "paes-ageng-kanigaran",
    collectionName: "Paes Ageng Kanigaran",
    costumeType: "Pakaian Adat Jawa",
    image: agengKanigaran,
    price: 650000,
    deposit: 325000,
    stock: 1,
    available: true,
    size: ["M", "L"],
    gender: "Wanita",
    featured: false,
  },

  {
    id: 13,
    code: "TR013",
    category: "traditional",
    slug: "paes-ageng-jangkep",
    collectionName: "Paes Ageng Jangkep",
    costumeType: "Pakaian Adat Jawa",
    image: paesAgengJangkep,
    price: 650000,
    deposit: 325000,
    stock: 1,
    available: true,
    size: ["M", "L"],
    gender: "Wanita",
    featured: false,
  },

  {
    id: 14,
    code: "TR014",
    category: "traditional",
    slug: "jogja-putri",
    collectionName: "Jogja Putri",
    costumeType: "Pakaian Adat Jawa",
    image: jogjaPutri,
    price: 600000,
    deposit: 300000,
    stock: 1,
    available: true,
    size: ["M", "L"],
    gender: "Wanita",
    featured: false,
  },

  {
    id: 15,
    code: "TR015",
    category: "traditional",
    slug: "solo-putri",
    collectionName: "Solo Putri",
    costumeType: "Pakaian Adat Jawa",
    image: pakaianAdatSoloPutri,
    price: 600000,
    deposit: 300000,
    stock: 1,
    available: true,
    size: ["M", "L"],
    gender: "Wanita",
    featured: false,
  },
    // =========================
  // MODERN
  // =========================

  {
    id: 16,
    code: "MD001",
    category: "modern",
    slug: "jas-pria-hitam",
    collectionName: "Black Signature",
    costumeType: "Jas Pria Hitam",
    image: jasPriaHitam,
    price: 300000,
    deposit: 150000,
    stock: 2,
    available: true,
    size: ["M", "L", "XL"],
    gender: "Pria",
    featured: false,
  },

  {
    id: 17,
    code: "MD002",
    category: "modern",
    slug: "jas-pria-putih",
    collectionName: "White Prestige",
    costumeType: "Jas Pria Putih",
    image: jasPriaPutih,
    price: 300000,
    deposit: 150000,
    stock: 2,
    available: true,
    size: ["M", "L", "XL"],
    gender: "Pria",
    featured: false,
  },

  {
    id: 18,
    code: "MD003",
    category: "modern",
    slug: "jas-pria-hitam-putih",
    collectionName: "Monochrome Royale",
    costumeType: "Jas Pria Hitam Putih",
    image: jasPriaHitamPutih,
    price: 350000,
    deposit: 175000,
    stock: 2,
    available: true,
    size: ["M", "L", "XL"],
    gender: "Pria",
    featured: false,
  },

  {
    id: 19,
    code: "MD004",
    category: "modern",
    slug: "wedding-dress-non-hijab",
    collectionName: "Aurora",
    costumeType: "Wedding Dress Non Hijab",
    image: weddingDressNonHijab,
    price: 800000,
    deposit: 400000,
    stock: 1,
    available: true,
    size: ["M", "L"],
    gender: "Wanita",
    featured: true,
  },

  {
    id: 20,
    code: "MD005",
    category: "modern",
    slug: "wedding-dress-hijab",
    collectionName: "Celestia",
    costumeType: "Wedding Dress Hijab Friendly",
    image: weddingDressHijab,
    price: 850000,
    deposit: 425000,
    stock: 1,
    available: true,
    size: ["M", "L"],
    gender: "Wanita",
    featured: true,
  },

  {
    id: 21,
    code: "MD006",
    category: "modern",
    slug: "dress-awards-non-hijab",
    collectionName: "Florence",
    costumeType: "Dress Awards Non Hijab",
    image: dressAwardsNonHijab,
    price: 500000,
    deposit: 250000,
    stock: 2,
    available: true,
    size: ["S", "M", "L"],
    gender: "Wanita",
    featured: false,
  },

  {
    id: 22,
    code: "MD007",
    category: "modern",
    slug: "dress-awards-hijab",
    collectionName: "Serenity",
    costumeType: "Dress Awards Hijab Friendly",
    image: dressAwardsHijab,
    price: 500000,
    deposit: 250000,
    stock: 2,
    available: true,
    size: ["S", "M", "L"],
    gender: "Wanita",
    featured: false,
  },

  {
    id: 23,
    code: "MD008",
    category: "modern",
    slug: "glam-outfit-men",
    collectionName: "Noir Gentleman",
    costumeType: "Glam Outfit Men",
    image: glamOutfitMen,
    price: 400000,
    deposit: 200000,
    stock: 2,
    available: true,
    size: ["M", "L", "XL"],
    gender: "Pria",
    featured: false,
  },

  // =====================
// FORMAL
// =====================

{
  id: 30,
  code: "FR001",
  category: "formal",
  slug: "guide-formal-attire-wanita",
  collectionName: "Guide Formal Attire Wanita",
  costumeType: "Formal",
  image: guideFormalAttireWanita,
  price: 250000,
  deposit: 125000,
  stock: 1,
  available: true,
  size: ["S", "M", "L", "XL"],
  gender: "Wanita",
  featured: false,
},

{
  id: 31,
  code: "FR002",
  category: "formal",
  slug: "house-of-cuff-vest",
  collectionName: "House of Cuff Vest",
  costumeType: "Formal",
  image: houseOfCuffHousecuffVest,
  price: 300000,
  deposit: 150000,
  stock: 1,
  available: true,
  size: ["M", "L", "XL"],
  gender: "Pria",
  featured: true,
},

{
  id: 32,
  code: "FR003",
  category: "formal",
  slug: "tuxedo",
  collectionName: "Tuxedo",
  costumeType: "Formal",
  image: tuxedo,
  price: 450000,
  deposit: 225000,
  stock: 1,
  available: true,
  size: ["M", "L", "XL"],
  gender: "Pria",
  featured: true,
},

{
  id: 33,
  code: "FR004",
  category: "formal",
  slug: "dress-korean-style",
  collectionName: "Dress Korean Style",
  costumeType: "Formal",
  image: dressKoreanStyle,
  price: 300000,
  deposit: 150000,
  stock: 1,
  available: true,
  size: ["S", "M", "L"],
  gender: "Wanita",
  featured: false,
},

{
  id: 34,
  code: "FR005",
  category: "formal",
  slug: "semi-formal",
  collectionName: "Semi Formal",
  costumeType: "Formal",
  image: semiFormal,
  price: 225000,
  deposit: 112500,
  stock: 1,
  available: true,
  size: ["S", "M", "L", "XL"],
  gender: "Unisex",
  featured: false,
},

{
  id: 35,
  code: "FR006",
  category: "formal",
  slug: "blazer",
  collectionName: "Blazer",
  costumeType: "Formal",
  image: blazer,
  price: 275000,
  deposit: 137500,
  stock: 1,
  available: true,
  size: ["M", "L", "XL"],
  gender: "Unisex",
  featured: false,
},

    // =========================
  // CLASSIC
  // =========================

  {
    id: 24,
    code: "CL001",
    category: "classic",
    slug: "dress-noni-belanda-vintage",
    collectionName: "Dutch Belle",
    costumeType: "Gaun Noni Belanda Vintage",
    image: dressNoniBelandaVintage,
    price: 450000,
    deposit: 225000,
    stock: 1,
    available: true,
    size: ["M", "L"],
    gender: "Wanita",
    featured: false,
  },

  {
    id: 25,
    code: "CL002",
    category: "classic",
    slug: "dress-vintage-eropa-italian",
    collectionName: "Verona",
    costumeType: "Gaun Vintage Eropa",
    image: dressVintageEropaItalian,
    price: 500000,
    deposit: 250000,
    stock: 1,
    available: true,
    size: ["M", "L"],
    gender: "Wanita",
    featured: false,
  },

  {
    id: 26,
    code: "CL003",
    category: "classic",
    slug: "french-style-retro",
    collectionName: "Madeleine",
    costumeType: "French Style Retro",
    image: frenchStyleRetro,
    price: 500000,
    deposit: 250000,
    stock: 1,
    available: true,
    size: ["M", "L"],
    gender: "Wanita",
    featured: false,
  },

  {
    id: 27,
    code: "CL004",
    category: "classic",
    slug: "dress-vintage-kerajaan",
    collectionName: "Royal Dynasty",
    costumeType: "Gaun Vintage Kerajaan",
    image: dressVintageKerajaan,
    price: 700000,
    deposit: 350000,
    stock: 1,
    available: true,
    size: ["M", "L"],
    gender: "Wanita",
    featured: true,
  },

  {
    id: 28,
    code: "CL005",
    category: "classic",
    slug: "halloween-kostum",
    collectionName: "Midnight Manor",
    costumeType: "Kostum Halloween",
    image: halloweenKostum,
    price: 300000,
    deposit: 150000,
    stock: 2,
    available: true,
    size: ["S", "M", "L"],
    gender: "Unisex",
    featured: false,
  },

  {
    id: 29,
    code: "CL006",
    category: "classic",
    slug: "bridgerton-kostum",
    collectionName: "Bridgerton Royale",
    costumeType: "Kostum Bridgerton",
    image: bridgertonKostum,
    price: 650000,
    deposit: 325000,
    stock: 1,
    available: true,
    size: ["M", "L"],
    gender: "Wanita",
    featured: true,
  },
  ];

export default costumes;