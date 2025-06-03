import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const productImages = [
  { label: "Lavender Oil", image: "/images/cosmeticsoils01.jpg" },
{ label: "Lemon Oil", image: "/images/cosmeticsoils02.jpg" },
{ label: "Mint Essential Oil", image: "/images/cosmeticsoils03.jpg" },
{ label: "Avocado Oil", image: "/images/avocadooil.jpg" },

  {
    label: "Frankincense & Myrrh Essential Oil",
    image: "/images/myrrhoil01.jpg",
  },
  { label: "Native African Pear Oil", image: "/images/cosmeticsoils04.jpg" },
  { label: "Neem Oil", image: "/images/neemoil.jpg" },
  {
    label: "Eucalyptus Citriodora Essential Oil",
    image: "/images/eucaliptusoil.jpg",
  },
  // New soaps
  { label: "Herbal Liquid Soap", image: "/images/liquidsoap01.jpg" },
  { label: "Moisturizing Liquid Cleanser", image: "/images/liquidsoap02.jpg" },
  { label: "Raw African Black Soap", image: "/images/blacksoap02.jpg" },
  { label: "Floral Infused Soap Bar", image: "/images/flowersoap01.jpg" },

  { label: "Argan Oil", image: "/images/arganoil01.jpg" },
{ label: "Castor Oil", image: "/images/castoroil.jpg" },
{ label: "Coconut Oil", image: "/images/coconutoil01.jpg" },
{ label: "Grape Oil", image: "/images/grapeoil.jpg" },
{ label: "Kanel Soap", image: "/images/kanelsoap.jpg" },
{ label: "Moringa Oil", image: "/images/moringaoil.jpg" },
{ label: "Shea Butter", image: "/images/sheabutter01.jpg" },
{ label: "Tumeric Oil", image: "/images/tumericoil.jpg" },
{ label: "Tumeric Oil", image: "/images/sheaoil.jpg" },

];

const countries = [
  "Sweden",
  "Denmark",
  "Norway",
  "Finland",
  "Iceland",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Netherlands",
  "Belgium",
  "Austria",
  "Poland",
  "Portugal",
  "Greece",
  "Ireland",
  "Switzerland",
  "Czech Republic",
  "Hungary",
  "Estonia",
];

export default function OrderForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    postal: "",
    city: "",
    country: "",
    products: [],
    notes: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      const updated = checked
        ? [...formData.products, value]
        : formData.products.filter((p) => p !== value);
      setFormData((prev) => ({ ...prev, products: updated }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const newErrors = {};
    [
      "name",
      "email",
      "phone",
      "street",
      "postal",
      "city",
      "country",
      "notes",
    ].forEach((field) => {
      if (!formData[field]) newErrors[field] = `${field} is required.`;
    });
    if (formData.products.length === 0)
      newErrors.products = "Select at least one product.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formURL =
      "https://docs.google.com/forms/d/e/1FAIpQLSePSc0eb42eMrU-KGKZiPbTtXGKmItQU6ds2Mw4KuuS-cFbdA/formResponse";

    const form = new FormData();
    form.append("entry.1745646469", formData.name);
    form.append("entry.1753855891", formData.email);
    form.append("entry.361469899", formData.phone);
    form.append("entry.80064995", formData.street);
    form.append("entry.817185816", formData.postal);
    form.append("entry.163553468", formData.city);
    form.append("entry.656108758", formData.country);
    formData.products.forEach((p) => form.append("entry.174925592", p));
    form.append("entry.1578636434", formData.notes);

    fetch(formURL, {
      method: "POST",
      mode: "no-cors",
      body: form,
    }).then(() => {
      generatePDF();
      alert(
        "✅ Your order was submitted! You'll receive a confirmation email shortly."
      );
      sendToEmailAndWhatsApp();
      setFormData({
        name: "",
        email: "",
        phone: "",
        street: "",
        postal: "",
        city: "",
        country: "",
        products: [],
        notes: "",
      });
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("TropiNord Order Summary", 20, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${formData.name}`, 20, 40);
    doc.text(`Email: ${formData.email}`, 20, 48);
    doc.text(`Phone: ${formData.phone}`, 20, 56);
    doc.text(
      `Address: ${formData.street}, ${formData.postal}, ${formData.city}, ${formData.country}`,
      20,
      64
    );
    doc.text("Products:", 20, 74);
    formData.products.forEach((product, idx) => {
      doc.text(`- ${product}`, 26, 82 + idx * 8);
    });
    doc.text(`Notes: ${formData.notes}`, 20, 90 + formData.products.length * 8);
    doc.save("TropiNord-Order-Summary.pdf");
  };

  const sendToEmailAndWhatsApp = () => {
    // Integration Note: This triggers backend Apps Script via Google Sheet formSubmit trigger
    console.log("🔔 Email and WhatsApp alerts will be sent via Apps Script.");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6 text-green-700">
        Place Your Order
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["name", "email", "phone", "street", "postal", "city"].map((field) => (
          <div key={field}>
            <label className="block font-semibold capitalize">
              {field
                .replace("postal", "Postal Code")
                .replace("street", "Street Address")}{" "}
              *
            </label>
            <input
              name={field}
              type={field === "email" ? "email" : "text"}
              value={formData[field]}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            {errors[field] && (
              <p className="text-red-600 text-sm">{errors[field]}</p>
            )}
          </div>
        ))}

        <div>
          <label className="block font-semibold">Country *</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select a country</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.country && (
            <p className="text-red-600 text-sm">{errors.country}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold">Select Products *</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {productImages.map(({ label, image }) => (
              <label
                key={label}
                className="relative border rounded-md shadow-sm p-2 flex flex-col items-center hover:shadow-lg"
              >
                <img
                  src={image}
                  alt={label}
                  className="w-full h-32 object-cover rounded mb-2"
                />
                <span className="text-center text-sm font-medium mb-1">
                  {label}
                </span>
                <input
                  type="checkbox"
                  value={label}
                  checked={formData.products.includes(label)}
                  onChange={handleChange}
                  className="absolute top-2 right-2"
                />
              </label>
            ))}
          </div>
          {errors.products && (
            <p className="text-red-600 text-sm mt-1">{errors.products}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold">Quantity / Notes *</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows="3"
          />
          {errors.notes && (
            <p className="text-red-600 text-sm">{errors.notes}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Submit Order
        </button>
      </form>

      <div className="mt-6">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            generatePDF();
          }}
          className="text-blue-600 underline"
        >
          📄 Download Order Summary PDF
        </a>
      </div>
    </div>
  );
}
