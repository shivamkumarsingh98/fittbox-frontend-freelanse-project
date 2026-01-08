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
    // Check word count BEFORE any async operations
    const trimmedText = aboutText.trim();
    const words = trimmedText.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    console.log("[FutureTab] About word count:", wordCount, "text:", trimmedText);
    
    if (wordCount > 150) {
      console.log("[FutureTab] Word count exceeded! Blocking save. Count:", wordCount);
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
    <div className={` ${theme === "dark" ? "bg-neutral-800 border-neutral-700 text-white" : "bg-white border"} rounded-xl p-4 space-y-4`}>
      <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">Update UI</h3></div>

      <div className={`p-4 rounded-lg border ${theme === "dark" ? "bg-neutral-900 border-neutral-800" : "bg-white"}`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-semibold">Hero Section Image</h4>
            <div className={`text-sm ${theme === "dark" ? "text-neutral-400" : "text-neutral-500"}`}>Upload or manage the landing hero image (max 2MB)</div>
          </div>
          <div className="flex items-center gap-2">
            <input id="hero-file" type="file" accept="image/*" onChange={handleHeroFileChange} className="hidden" />
            <label htmlFor="hero-file" className="px-3 py-1 rounded border cursor-pointer text-sm">Choose</label>
            <button onClick={uploadHero} disabled={heroLoading || !heroFile} className="px-3 py-1 rounded bg-emerald-600 text-white text-sm">{heroLoading ? "Uploading..." : "Upload"}</button>
            {heroUrl && (<button onClick={removeHero} disabled={heroLoading} className="px-3 py-1 rounded bg-red-600 text-white text-sm">Delete</button>)}
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-48 h-28 bg-neutral-100 rounded overflow-hidden border">
            {heroFile ? (<img src={URL.createObjectURL(heroFile)} alt="preview" className="w-full h-full object-cover" />) : heroUrl ? (<img src={heroUrl} alt="hero" className="w-full h-full object-cover" />) : (<div className="w-full h-full flex items-center justify-center text-sm text-neutral-400">No image</div>)}
          </div>
          <div className="flex-1">
            <div className="text-sm text-neutral-500 mb-1">Current: {heroUrl ? "Stored" : "None"}</div>
            {heroFile && (
              <div className={`text-xs ${heroFile.size > 2 * 1024 * 1024 ? "text-red-600" : theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}>
                File size: {(heroFile.size / (1024 * 1024)).toFixed(2)}MB / 2MB max
                {heroFile.size > 2 * 1024 * 1024 && <span className="ml-2 font-semibold">(Exceeds limit!)</span>}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`p-4 rounded-lg border ${theme === "dark" ? "bg-neutral-900 border-neutral-800" : "bg-white"}`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-semibold">About Section Text</h4>
            <div
              className={`text-sm ${
                theme === "dark" ? "text-neutral-400" : "text-neutral-500"
              }`}
            >
              Create or update the about text shown on landing (max 150 words)
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={saveAbout}
              disabled={aboutLoading}
              className="px-3 py-1 rounded bg-emerald-600 text-white text-sm"
            >
              {aboutLoading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={removeAbout}
              disabled={aboutLoading}
              className="px-3 py-1 rounded bg-red-600 text-white text-sm"
            >
              Delete
            </button>
          </div>
        </div>

        <textarea
          rows={6}
          value={aboutText}
          onChange={(e) => {
            const next = e.target.value;
            setAboutText(next);
          }}
          className={`w-full rounded border p-3 ${
            theme === "dark"
              ? "bg-neutral-900 border-neutral-700 text-white"
              : "bg-white"
          }`}
          placeholder="Write about section text here..."
        />
        <div
          className={`mt-1 text-xs ${
            theme === "dark" ? "text-neutral-400" : "text-neutral-500"
          }`}
        >
          {aboutText.trim()
            ? `${aboutText.trim().split(/\s+/).filter(Boolean).length}/200 words`
            : "0/200 words"}
        </div>
      </div>

      <div className={`p-4 rounded-lg border ${theme === "dark" ? "bg-neutral-900 border-neutral-800" : "bg-white"}`}>
        <div className="flex items-center justify-between mb-3"><div><h4 className="font-semibold">Nutrition Items</h4><div className={`text-sm ${theme === "dark" ? "text-neutral-400" : "text-neutral-500"}`}>Create / update / delete nutrition entries</div></div></div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
          <input
            value={nutritionForm.providerName}
            onChange={(e) =>
              setNutritionForm((s) => ({
                ...s,
                providerName: e.target.value,
              }))
            }
            placeholder="Name"
            className="px-3 py-2 rounded border"
          />
          <input
            value={nutritionForm.providerContact}
            onChange={(e) =>
              setNutritionForm((s) => ({
                ...s,
                providerContact: e.target.value,
              }))
            }
            placeholder="Number"
            className="px-3 py-2 rounded border"
          />
          <input
            value={nutritionForm.nutritionPrice}
            onChange={(e) =>
              setNutritionForm((s) => ({
                ...s,
                nutritionPrice: e.target.value,
              }))
            }
            placeholder="Price"
            type="number"
            className="px-3 py-2 rounded border"
          />
        </div>
        <div className="flex gap-2 mb-3">
          <button
            onClick={saveNutrition}
            disabled={nutritionLoading}
            className="px-3 py-1 rounded bg-emerald-600 text-white"
          >
            {nutritionLoading
              ? "Saving..."
              : editingNutritionId
              ? "Update"
              : "Create"}
          </button>
          {editingNutritionId && (
            <button
              onClick={() => removeNutrition(editingNutritionId)}
              disabled={nutritionLoading}
              className="px-3 py-1 rounded bg-red-600 text-white"
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
            className="px-3 py-1 rounded border"
          >
            Clear
          </button>
        </div>

        <div className="space-y-2 max-h-40 overflow-auto">
          {nutritionList.length === 0 ? (
            <div className="text-sm text-neutral-500">No nutrition items</div>
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
                  className="p-2 rounded border flex items-center justify-between"
                >
                  <div
                    role="button"
                    onClick={() => editNutrition(n)}
                    className="cursor-pointer"
                    title="Click to load into form for editing"
                  >
                    <div className="font-medium">{name}</div>
                    <div className="text-xs text-neutral-500">
                      Number: {number} • Price: ₹{price}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => removeNutrition(n._id || n.id)}
                      className="px-2 py-1 rounded bg-red-600 text-white text-sm"
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

      <div className={`p-4 rounded-lg border ${theme === "dark" ? "bg-neutral-900 border-neutral-800" : "bg-white"}`}>
        <div className="flex items-center justify-between mb-3"><div><h4 className="font-semibold">Contact Info</h4><div className={`text-sm ${theme === "dark" ? "text-neutral-400" : "text-neutral-500"}`}>Address, email and phone for landing contact</div></div></div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3"><input value={contact.address} onChange={(e) => setContact((s) => ({ ...s, address: e.target.value }))} placeholder="Address" className="px-3 py-2 rounded border" /><input value={contact.email} onChange={(e) => setContact((s) => ({ ...s, email: e.target.value }))} placeholder="Email" className="px-3 py-2 rounded border" /><input value={contact.phone} onChange={(e) => setContact((s) => ({ ...s, phone: e.target.value }))} placeholder="Phone" className="px-3 py-2 rounded border" /></div>

        <div className="flex gap-2"><button onClick={saveContact} disabled={contactLoading} className="px-3 py-1 rounded bg-emerald-600 text-white">{contactLoading ? "Saving..." : "Save"}</button><button onClick={removeContact} disabled={contactLoading} className="px-3 py-1 rounded bg-red-600 text-white">Delete</button></div>
      </div>
    </div>
  );
}
