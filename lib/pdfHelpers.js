const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const getTranslation = require("../lib/getTranslation");

async function generateOrderPDF({
  name,
  email,
  phone,
  address,
  items,
  total,
  method,
  locale = "sv",
  isAdmin = false,
}) {
  const t = getTranslation(locale)?.receipt || {};
  const doc = new PDFDocument({ margin: 50 });
  const buffers = [];
  doc.on("data", buffers.push.bind(buffers));

  // Logo
  const logoPath = path.join(
    __dirname,
    "../public/images/tropinordlogo001.png"
  );
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 10, 8, { width: 50 });
  }

  // Header
  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .fillColor("#228B22")
    .text("Orderbekräftelse - Naturligt Val", { align: "center" });

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#000")
    .text(`Datum: ${new Date().toLocaleString("sv-SE")}`, { align: "center" });

  doc.moveDown(2);

  // Customer Info
  doc.fontSize(12).font("Helvetica-Bold").text("Kundinformation");
  doc.font("Helvetica").fontSize(11);
  doc.text(`Namn: ${name}`);
  doc.text(`E-post: ${email}`);
  if (phone) doc.text(`Telefon: ${phone}`);
  doc.text(`Adress: ${address}`);
  doc.text(`Sverige`);
  doc.moveDown(2);

  // Product Section
  doc
    .fontSize(12)
    .fillColor("#228B22")
    .font("Helvetica-Bold")
    .text("Ekologiska Produkter");

  doc.moveDown(0.5);

  const startX = 50;
  const colWidths = { name: 200, qty: 60, unit: 80, total: 80 };

  // Table Header
  doc.font("Helvetica-Bold").fontSize(10).fillColor("#000");
  doc.text("Produkt", startX, doc.y);
  doc.text("Antal", startX + colWidths.name, doc.y);
  doc.text("Pris/st", startX + colWidths.name + colWidths.qty, doc.y);
  doc.text(
    "Totalt",
    startX + colWidths.name + colWidths.qty + colWidths.unit,
    doc.y
  );
  doc.moveDown(0.5);

  // Product Rows
  doc.font("Helvetica").fontSize(10);
  let subtotal = 0;

  items.forEach((item) => {
    const rawPrice = item.price ?? "0";
    const numericPrice =
      parseFloat(
        typeof rawPrice === "string"
          ? rawPrice.replace(/[^\d,.-]/g, "").replace(",", ".")
          : rawPrice
      ) || 0;

    const itemTotal = numericPrice * item.quantity;
    subtotal += itemTotal;

    doc.text(item.name || "Okänd produkt", startX, doc.y);
    doc.text(item.quantity?.toString() || "1", startX + colWidths.name, doc.y);
    doc.text(
      `${numericPrice.toFixed(2)} kr`,
      startX + colWidths.name + colWidths.qty,
      doc.y
    );
    doc.text(
      `${itemTotal.toFixed(2)} kr`,
      startX + colWidths.name + colWidths.qty + colWidths.unit,
      doc.y
    );
    doc.moveDown(0.5);
  });

  // Totals
  const moms = subtotal * 0.12;
  const shipping = 49;
  const grandTotal = subtotal + moms + shipping;

  doc.moveDown(1);
  doc.font("Helvetica").fontSize(10);

  doc.text("Delsumma", startX + 290);
  doc.text(`${subtotal.toFixed(2)} kr`, startX + 390, doc.y - 12);

  doc.text("Moms", startX + 290);
  doc.text(`${moms.toFixed(2)} kr`, startX + 390, doc.y - 12);

  doc.text("Frakt", startX + 290);
  doc.text(`${shipping.toFixed(2)} kr`, startX + 390, doc.y - 12);

  doc.font("Helvetica-Bold");
  doc.text("Totalt", startX + 290);
  doc.text(`${grandTotal.toFixed(2)} kr`, startX + 390, doc.y - 12);

  // QR Code
  doc.moveDown(2);
  const qrData = `mailto:support@tropinord.com?subject=Orderfråga`;
  const qrImage = await QRCode.toDataURL(qrData);
  const qrBuffer = Buffer.from(qrImage.split(",")[1], "base64");
  doc.image(qrBuffer, startX, doc.y, { width: 80 });

  // Footer
  doc
    .font("Helvetica-Oblique")
    .fontSize(9)
    .fillColor("#228B22")
    .text(
      "Tack för att du valde hållbara produkter! Kontakta oss: support@tropinord.com",
      startX + 90,
      doc.y + 10
    );

  // Return PDF as buffer
  return new Promise((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);
    doc.end();
  });
}

module.exports = { generateOrderPDF };
