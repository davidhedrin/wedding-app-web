import { GroomBrideEnum } from "@/generated/prisma";

function numberToOrdinal(num: number): string {
  const ordinalMap: Record<number, string> = {
    1: "pertama",
    2: "kedua",
    3: "ketiga",
    4: "keempat",
    5: "kelima",
    6: "keenam",
    7: "ketujuh",
    8: "kedelapan",
    9: "kesembilan",
    10: "kesepuluh",
  };

  if (ordinalMap[num]) return ordinalMap[num];

  // fallback jika lebih dari 10
  return `ke-${num}`;
};

type ProfileData = {
  type: GroomBrideEnum;
  birth_order: number;
  father_name?: string | null;
  mother_name?: string | null;
  place_origin?: string | null;
  occupation?: string | null;
};

function randomPick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
};
export function GenProfileDescWedding(data: ProfileData): string {
  const {
    type,
    birth_order,
    father_name,
    mother_name,
    place_origin,
    occupation,
  } = data;

  const ordinal = numberToOrdinal(birth_order);
  const childLabel = type === "Bride" ? "Putri" : "Putra";

  /* =========================
     VARIASI KALIMAT PERTAMA
  ========================== */
  const introVariants = [
    `${childLabel} ${ordinal}`,
    `Anak ${ordinal} yang merupakan ${childLabel.toLowerCase()}`,
    `${childLabel} tercinta, anak ${ordinal}`,
    `${childLabel} ${ordinal} dalam keluarga`,
  ];

  let kalimatPertama = randomPick(introVariants);

  /* =========================
     VARIASI ORANG TUA
  ========================== */
  if (father_name || mother_name) {
    const parentText = father_name && mother_name ? [
      `dari pasangan Bapak ${father_name} dan Ibu ${mother_name}`,
      `buah hati Bapak ${father_name} & Ibu ${mother_name}`,
      `putra dari Bapak ${father_name} serta Ibu ${mother_name}`,
      `anak dari Bapak ${father_name} dan Ibu ${mother_name}`,
    ] : father_name ? [
      `putra dari Bapak ${father_name}`,
      `anak dari Bapak ${father_name}`,
    ] : [
      `putri dari Ibu ${mother_name}`,
      `anak dari Ibu ${mother_name}`,
    ];

    kalimatPertama += " " + randomPick(parentText);
  }

  kalimatPertama += ".";

  /* =========================
     VARIASI TEMPAT ASAL
  ========================== */
  const asalKalimat = place_origin ? randomPick([
    `Berasal dari ${place_origin}.`,
    `Lahir dan dibesarkan di ${place_origin}.`,
    `Yang berasal dari ${place_origin}.`,
    `Memiliki latar belakang keluarga dari ${place_origin}.`,
  ]) : "";

  /* =========================
     VARIASI PEKERJAAN
  ========================== */
  const pekerjaanKalimat = occupation ? randomPick([
    `Seorang ${occupation}.`,
    `Berprofesi sebagai ${occupation}.`,
    `Saat ini berkarya sebagai ${occupation}.`,
    `Menekuni bidang sebagai ${occupation}.`,
  ]) : "";

  return [kalimatPertama, asalKalimat, pekerjaanKalimat].filter(Boolean).join(" ").trim();
}