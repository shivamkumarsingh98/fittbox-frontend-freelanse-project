import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  getHeroSection,
  createHeroSectionImage,
  updateHeroSectionImage,
  deleteHeroSectionImage,
  getAboutSection,
  createAboutSection,
  updateAboutSection,
  deleteAboutSection,
  getNutrition,
  createNutrition,
  updateNutrition,
  deleteNutrition,
  getContact,
  createContact,
  updateContact,
  deleteContact,
} from "../../../api/admin";

export default function FutureTab({ theme }) {
  const token = useSelector((s) => s.adminAuth?.token);
  const [heroUrl, setHeroUrl] = useState(null);
  const [heroFile, setHeroFile] = useState(null);
  const [heroLoading, setHeroLoading] = useState(false);

  const [aboutText, setAboutText] = useState("");
  const [aboutLoading, setAboutLoading] = useState(false);

  const [nutritionList, setNutritionList] = useState([]);
  const [nutritionForm, setNutritionForm] = useState({
    providerName: "",
    providerContact: "",
    nutritionPrice: "",
  });
  const [nutritionLoading, setNutritionLoading] = useState(false);
  const [editingNutritionId, setEditingNutritionId] = useState(null);

  const [contact, setContact] = useState({ address: "", email: "", phone: "" });
  const [contactLoading, setContactLoading] = useState(false);

  useEffect(() => {
    loadHero();
    loadAbout();
    loadNutrition();
    loadContact();
  }, []);

  const loadHero = async () => {
    try {
      setHeroLoading(true);
      const data = await getHeroSection(token);
      setHeroUrl(data?.image || data?.url || data?.heroImage || null);
    } catch (err) {
      console.error(err);
      setHeroUrl(null);
    } finally {
      setHeroLoading(false);
    }
  };

  const handleHeroFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const fileSizeMB = file.size / (1024 * 1024);
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`Image size is ${fileSizeMB.toFixed(2)}MB. Maximum allowed is 2MB`);
        e.target.value = ""; // Clear the input
        return;
      }
      setHeroFile(file);
    } else {
      setHeroFile(null);
    }
  };

  const uploadHero = async () => {
    if (!heroFile) {
      toast.error("Please select an image first");
      return;
    }
    
    const fileSizeMB = heroFile.size / (1024 * 1024);
    if (heroFile.size > 2 * 1024 * 1024) {
      toast.error(`Hero image must be 2MB or less. Current size: ${fileSizeMB.toFixed(2)}MB`);
      return;
    }
    
    try {
      setHeroLoading(true);
      const res = await createHeroSectionImage(heroFile, token);
      setHeroUrl(res?.image || res?.url || null);
      setHeroFile(null);
      toast.success("Hero image uploaded successfully");
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Upload failed");
    } finally {
      setHeroLoading(false);
    }
  };

  const removeHero = async () => {
    if (!confirm("Delete current hero image?")) return;
    try {
      setHeroLoading(true);
      await deleteHeroSectionImage(token);
      setHeroUrl(null);
      alert("Hero image deleted");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Delete failed");
    } finally {
      setHeroLoading(false);
    }
  };

  const loadAbout = async () => {
    try {
      setAboutLoading(true);
      const data = await getAboutSection(token);
      setAboutText(data?.text || data?.about || "");
    } catch (err) {
      console.error(err);
      setAboutText("");
    } finally {
      setAboutLoading(false);
    }
  };

  const saveAbout = async () => {
    const trimmedText = aboutText.trim();
    const words = trimmedText.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    
    if (wordCount > 150) {
      toast.error(`About section must be 150 words or less. Current: ${wordCount} words`);
      return;
    }
    
    if (!trimmedText) {
      toast.error("About text cannot be empty");
      return;
    }
    
    try {
      setAboutLoading(true);
      await createAboutSection({ about: aboutText }, null, token);
      toast.success("About text saved successfully");
      await loadAbout();
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Save failed");
    } finally {
      setAboutLoading(false);
    }
  };

  const removeAbout = async () => {
    if (!confirm("Delete about text?")) return;
    try {
      setAboutLoading(true);
      await deleteAboutSection(token);
      setAboutText("");
      alert("About text deleted");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Delete failed");
    } finally {
      setAboutLoading(false);
    }
  };

  const loadNutrition = async () => {
    try {
      setNutritionLoading(true);
      const data = await getNutrition(token);
      const list = Array.isArray(data) ? data : data?.items || (data ? [data] : []);
      setNutritionList(list);
    } catch (err) {
      console.error(err);
      setNutritionList([]);
    } finally {
      setNutritionLoading(false);
    }
  };

  const saveNutrition = async () => {
    try {
      setNutritionLoading(true);
      const payload = {
        providerName: nutritionForm.providerName,
        providerContact: nutritionForm.providerContact,
        nutritionPrice: Number(nutritionForm.nutritionPrice || 0),
      };
      if (editingNutritionId) {
        await updateNutrition(
          { ...payload, _id: editingNutritionId },
          null,
          token
        );
        alert("Nutrition updated");
      } else {
        await createNutrition(payload, null, token);
        alert("Nutrition created");
      }
      setNutritionForm({
        providerName: "",
        providerContact: "",
        nutritionPrice: "",
      });
      setEditingNutritionId(null);
      await loadNutrition();
    } catch (err) {
      console.error(err);
      alert(err?.message || "Save failed");
    } finally {
      setNutritionLoading(false);
    }
  };

  const editNutrition = (item) => {
    setEditingNutritionId(item._id || item.id || null);
    setNutritionForm({
      providerName: item.providerName || item.name || "",
      providerContact: item.providerContact || item.number || "",
      nutritionPrice:
        item.nutritionPrice != null
          ? item.nutritionPrice
          : item.price != null
          ? item.price
          : "",
    });
  };

  const removeNutrition = async (id) => {
    if (!confirm("Delete nutrition item?")) return;
    try {
      setNutritionLoading(true);
      await deleteNutrition(id || editingNutritionId, token);
      alert("Nutrition deleted");
      setNutritionForm({
        providerName: "",
        providerContact: "",
        nutritionPrice: "",
      });
      setEditingNutritionId(null);
      await loadNutrition();
    } catch (err) {
      console.error(err);
      alert(err?.message || "Delete failed");
    } finally {
      setNutritionLoading(false);
    }
  };

  const loadContact = async () => {
    try {
      setContactLoading(true);
      const data = await getContact(token);
      setContact({ address: data?.address || data?.addr || "", email: data?.email || "", phone: data?.phone || data?.phoneNumber || "" });
    } catch (err) {
      console.error(err);
      setContact({ address: "", email: "", phone: "" });
    } finally {
      setContactLoading(false);
    }
  };

  const saveContact = async () => {
    try {
      setContactLoading(true);
      await createContact(contact, null, token);
      alert("Contact saved");
      await loadContact();
    } catch (err) {
      console.error(err);
      alert(err?.message || "Save failed");
    } finally {
      setContactLoading(false);
    }
  };

  const removeContact = async () => {
    if (!confirm("Delete contact info?")) return;
    try {
      setContactLoading(true);
      await deleteContact(token);
      setContact({ address: "", email: "", phone: "" });
      alert("Contact deleted");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Delete failed");
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 space-y-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-neutral-800">Update Landing UI Content</h3>
      </div>

      {/* Hero Section */}
      <div className="p-5 rounded-2xl border border-neutral-200/80 bg-white shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h4 className="font-bold text-neutral-800">Hero Section Image</h4>
            <div className="text-xs text-neutral-500 mt-0.5">Upload or manage the landing hero image (max 2MB)</div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <input id="hero-file" type="file" accept="image/*" onChange={handleHeroFileChange} className="hidden" />
            <label htmlFor="hero-file" className="px-3.5 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer text-xs font-semibold text-neutral-700 transition">Choose File</label>
            <button onClick={uploadHero} disabled={heroLoading || !heroFile} className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-neutral-200 disabled:cursor-not-allowed text-white text-xs font-semibold transition shadow-sm">{heroLoading ? "Uploading..." : "Upload"}</button>
            {heroUrl && (<button onClick={removeHero} disabled={heroLoading} className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-black text-white text-xs font-medium transition shadow-sm">Delete</button>)}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-full sm:w-48 h-32 bg-neutral-50 rounded-xl overflow-hidden border border-neutral-200/80 flex-shrink-0 flex items-center justify-center">
            {heroFile ? (<img src={URL.createObjectURL(heroFile)} alt="preview" className="w-full h-full object-cover" />) : heroUrl ? (<img src={heroUrl} alt="hero" className="w-full h-full object-cover" />) : (<div className="text-xs text-neutral-400">No image uploaded</div>)}
          </div>
          <div className="flex-1">
            <div className="text-xs font-medium text-neutral-500">Status: <span className="font-bold text-neutral-700">{heroUrl ? "Live on website" : "Not configured"}</span></div>
            {heroFile && (
              <div className={`text-xs mt-1.5 ${heroFile.size > 2 * 1024 * 1024 ? "text-red-600 font-bold" : "text-neutral-600"}`}>
                File size: {(heroFile.size / (1024 * 1024)).toFixed(2)}MB / 2MB limit
                {heroFile.size > 2 * 1024 * 1024 && <span className="ml-1">(Exceeded!)</span>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="p-5 rounded-2xl border border-neutral-200/80 bg-white shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h4 className="font-bold text-neutral-800">About Section Text</h4>
            <div className="text-xs text-neutral-500 mt-0.5 font-medium">Create or update the about text shown on landing (max 150 words)</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={saveAbout}
              disabled={aboutLoading}
              className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition"
            >
              {aboutLoading ? "Saving..." : "Save Text"}
            </button>
            <button
              onClick={removeAbout}
              disabled={aboutLoading}
              className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-black text-white text-xs font-medium transition shadow-sm"
            >
              Delete
            </button>
          </div>
        </div>

        <textarea
          rows={5}
          value={aboutText}
          onChange={(e) => setAboutText(e.target.value)}
          className="w-full rounded-xl border border-neutral-200 p-3 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-neutral-800 text-sm bg-white"
          placeholder="Write about section text here..."
        />
        <div className="mt-1.5 text-[11px] font-semibold text-neutral-500">
          {aboutText.trim()
            ? `${aboutText.trim().split(/\s+/).filter(Boolean).length} / 150 words`
            : "0 / 150 words"}
        </div>
      </div>

      {/* Nutrition Items */}
      <div className="p-5 rounded-2xl border border-neutral-200/80 bg-white shadow-xs">
        <div className="mb-4">
          <h4 className="font-bold text-neutral-800">Nutrition Items</h4>
          <div className="text-xs text-neutral-500 mt-0.5">Create / update / delete nutrition entries</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <input
            value={nutritionForm.providerName}
            onChange={(e) =>
              setNutritionForm((s) => ({
                ...s,
                providerName: e.target.value,
              }))
            }
            placeholder="Provider Name"
            className="px-3.5 py-2 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white text-neutral-800"
          />
          <input
            value={nutritionForm.providerContact}
            onChange={(e) =>
              setNutritionForm((s) => ({
                ...s,
                providerContact: e.target.value,
              }))
            }
            placeholder="Contact Number"
            className="px-3.5 py-2 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white text-neutral-800"
          />
          <input
            value={nutritionForm.nutritionPrice}
            onChange={(e) =>
              setNutritionForm((s) => ({
                ...s,
                nutritionPrice: e.target.value,
              }))
            }
            placeholder="Price (₹)"
            type="number"
            className="px-3.5 py-2 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white text-neutral-800"
          />
        </div>
        <div className="flex gap-2 mb-4">
          <button
            onClick={saveNutrition}
            disabled={nutritionLoading}
            className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition"
          >
            {nutritionLoading
              ? "Saving..."
              : editingNutritionId
              ? "Update Item"
              : "Create Item"}
          </button>
          {editingNutritionId && (
            <button
              onClick={() => removeNutrition(editingNutritionId)}
              disabled={nutritionLoading}
              className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-black text-white text-xs font-medium transition"
            >
              Delete
            </button>
          )}
          <button
            onClick={() => {
              setNutritionForm({
                providerName: "",
                providerContact: "",
                nutritionPrice: "",
              });
              setEditingNutritionId(null);
            }}
            className="px-4 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold transition"
          >
            Clear Form
          </button>
        </div>

        <div className="space-y-2.5 max-h-48 overflow-auto pr-1">
          {nutritionList.length === 0 ? (
            <div className="text-xs text-neutral-500 text-center py-4">No nutrition items available</div>
          ) : (
            nutritionList.map((n) => {
              const name = n.providerName || n.name || "-";
              const number = n.providerContact || n.number || "-";
              const price =
                n.nutritionPrice != null
                  ? n.nutritionPrice
                  : n.price != null
                  ? n.price
                  : "-";
              return (
                <div
                  key={n._id || n.id || name}
                  className="p-3.5 rounded-xl border border-neutral-200/80 bg-white flex items-center justify-between shadow-xs hover:border-neutral-300 transition duration-150"
                >
                  <div
                    role="button"
                    onClick={() => editNutrition(n)}
                    className="cursor-pointer min-w-0 flex-1"
                    title="Click to edit item details"
                  >
                    <div className="font-bold text-neutral-800 text-sm truncate">{name}</div>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      Phone: {number} • Price: ₹{price}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => removeNutrition(n._id || n.id)}
                      className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Contact Info */}
      <div className="p-5 rounded-2xl border border-neutral-200/80 bg-white shadow-xs">
        <div className="mb-4">
          <h4 className="font-bold text-neutral-800">Contact Info</h4>
          <div className="text-xs text-neutral-500 mt-0.5">Address, email and phone for landing contact section</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <input value={contact.address} onChange={(e) => setContact((s) => ({ ...s, address: e.target.value }))} placeholder="Physical Address" className="px-3.5 py-2 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white text-neutral-800" />
          <input value={contact.email} onChange={(e) => setContact((s) => ({ ...s, email: e.target.value }))} placeholder="Email Address" className="px-3.5 py-2 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white text-neutral-800" />
          <input value={contact.phone} onChange={(e) => setContact((s) => ({ ...s, phone: e.target.value }))} placeholder="Phone Number" className="px-3.5 py-2 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white text-neutral-800" />
        </div>

        <div className="flex gap-2">
          <button onClick={saveContact} disabled={contactLoading} className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition">{contactLoading ? "Saving..." : "Save Contact Info"}</button>
          <button onClick={removeContact} disabled={contactLoading} className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-black text-white text-xs font-medium transition shadow-sm">Delete Info</button>
        </div>
      </div>
    </div>
  );
}
