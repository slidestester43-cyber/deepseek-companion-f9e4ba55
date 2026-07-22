import jsPDF from "jspdf";

export type SchoolPaymentData = {
  receipt_no?: string;
  parent_name: string;
  student_name: string;
  grade?: string | null;
  purpose: string;
  amount: string;
  method: "M-Pesa" | "Bank";
  reference_code: string;
  notes?: string | null;
  paid_at?: string;
};

const PINK: [number, number, number] = [232, 33, 109];
const SAPPHIRE: [number, number, number] = [30, 64, 175];
const INK: [number, number, number] = [30, 30, 40];
const MUTED: [number, number, number] = [110, 110, 120];

export function buildSchoolPaymentPdf(d: SchoolPaymentData): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 40;

  // Header band
  doc.setFillColor(...SAPPHIRE);
  doc.rect(0, 0, W, 90, "F");
  doc.setTextColor(255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("HALEL SCHOOL", M, 40);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Second Avenue, Buruburu Farm, Nairobi · +254 715 297 696", M, 60);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.text("Growing Faith · Nurturing Futures", M, 78);

  // Title
  let y = 120;
  doc.setFillColor(...PINK);
  doc.roundedRect(M, y, W - M * 2, 36, 4, 4, "F");
  doc.setTextColor(255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("OFFICIAL PAYMENT RECEIPT", M + 14, y + 23);
  y += 52;

  // Receipt meta
  const receiptNo = d.receipt_no || `HSP-${new Date().getFullYear()}-${Math.floor(Math.random() * 90000 + 10000)}`;
  const paidAt = d.paid_at ? new Date(d.paid_at) : new Date();
  doc.setTextColor(...MUTED);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Receipt No.`, M, y);
  doc.text(`Date`, W - M - 160, y);
  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(receiptNo, M, y + 16);
  doc.text(paidAt.toLocaleString(), W - M - 160, y + 16);
  y += 40;

  // Details card
  const rows: [string, string][] = [
    ["Parent / Guardian", d.parent_name || "—"],
    ["Student Name", d.student_name || "—"],
    ["Grade / Class", d.grade || "—"],
    ["Payment For", d.purpose || "—"],
    ["Amount Paid (KES)", d.amount || "—"],
    ["Payment Method", d.method],
    [d.method === "M-Pesa" ? "M-Pesa Confirmation Code" : "Bank Reference / Message", d.reference_code || "—"],
  ];
  doc.setFillColor(252, 240, 246);
  const cardH = rows.length * 26 + 20;
  doc.roundedRect(M, y, W - M * 2, cardH, 6, 6, "F");
  let ry = y + 22;
  rows.forEach(([k, v]) => {
    doc.setTextColor(...MUTED);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(k.toUpperCase(), M + 14, ry);
    doc.setTextColor(...INK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    const wrapped = doc.splitTextToSize(String(v), W - M * 2 - 200);
    doc.text(wrapped, M + 220, ry);
    ry += 26;
  });
  y += cardH + 20;

  if (d.notes) {
    doc.setTextColor(...MUTED);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("NOTES", M, y);
    y += 14;
    doc.setTextColor(...INK);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const nlines = doc.splitTextToSize(d.notes, W - M * 2);
    doc.text(nlines, M, y);
    y += nlines.length * 12 + 10;
  }

  // Signature line
  y = Math.max(y, H - 140);
  doc.setDrawColor(...MUTED);
  doc.setLineWidth(0.5);
  doc.line(M, y, M + 200, y);
  doc.line(W - M - 200, y, W - M, y);
  doc.setTextColor(...MUTED);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Received by (School Bursar)", M, y + 12);
  doc.text("Payer's Signature", W - M - 200, y + 12);

  // Footer band
  doc.setFillColor(...PINK);
  doc.rect(0, H - 40, W, 40, "F");
  doc.setTextColor(255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Thank you for your payment — please keep this receipt for your records.", W / 2, H - 16, { align: "center" });

  return doc;
}

export function downloadSchoolPaymentPdf(d: SchoolPaymentData) {
  const doc = buildSchoolPaymentPdf(d);
  const safe = (d.student_name || "payment").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  doc.save(`halel-receipt-${d.receipt_no || safe}.pdf`);
}