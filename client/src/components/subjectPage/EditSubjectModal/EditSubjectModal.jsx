import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { updateSubject } from '../../../api/api';

// 🔁 Recursive Info Editor
const InfoEditor = ({ infoArray = [], onChange }) => {
  const handleChange = (index, field, value) => {
    const updated = [...infoArray];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleSubInfoChange = (index, newSubInfo) => {
    const updated = [...infoArray];
    updated[index] = { ...updated[index], subInfo: newSubInfo };
    onChange(updated);
  };

  const addInfo = () => {
    onChange([
      ...infoArray,
      { infoTitle: '', infoDescription: '', subInfo: [] },
    ]);
  };

  const removeInfo = (index) => {
    const updated = infoArray.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-4 border-l-2 pl-4">
      {infoArray.map((item, index) => (
        <div key={index} className="border p-3 rounded-lg bg-gray-50">
          <input
            type="text"
            placeholder="Info Title"
            value={item.infoTitle || ''}
            onChange={(e) => handleChange(index, 'infoTitle', e.target.value)}
            className="w-full border rounded p-1 mb-2"
          />
          <textarea
            placeholder="Info Description"
            value={item.infoDescription || ''}
            onChange={(e) =>
              handleChange(index, 'infoDescription', e.target.value)
            }
            className="w-full border rounded p-1 mb-2"
          />

          {/* Recursive Sub Info */}
          {item.subInfo && item.subInfo.length > 0 && (
            <div className="ml-4 mt-3">
              <InfoEditor
                infoArray={item.subInfo}
                onChange={(sub) => handleSubInfoChange(index, sub)}
              />
            </div>
          )}

          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() =>
                handleSubInfoChange(index, [
                  ...(item.subInfo || []),
                  { infoTitle: '', infoDescription: '', subInfo: [] },
                ])
              }
              className="text-indigo-600 hover:text-indigo-800 text-sm"
            >
              + Add SubInfo
            </button>
            <button
              type="button"
              onClick={() => removeInfo(index)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              ✕ Remove
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addInfo}
        className="text-indigo-600 hover:text-indigo-800 text-sm"
      >
        + Add Info
      </button>
    </div>
  );
};

// 🧠 Main Modal
const EditSubjectModal = ({ isOpen, onClose, subject, onSave }) => {
  const [formData, setFormData] = useState(subject || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 🩹 Fix: ensure modal updates form when subject changes
  useEffect(() => {
    setFormData(subject || {});
  }, [subject]);

  if (!subject) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Tags Handlers
  const handleTagChange = (index, field, value) => {
    const updatedTags = [...(formData.tags || [])];
    updatedTags[index] = { ...updatedTags[index], [field]: value };
    setFormData((prev) => ({ ...prev, tags: updatedTags }));
  };

  const addTag = () => {
    setFormData((prev) => ({
      ...prev,
      tags: [...(prev.tags || []), { tagName: '', tagColor: '#000000' }],
    }));
  };

  const removeTag = (index) => {
    const updated = (formData.tags || []).filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, tags: updated }));
  };

  // Info Handler
  const handleInfoChange = (updatedInfo) => {
    setFormData((prev) => ({ ...prev, info: updatedInfo }));
  };

  // Save Handler
  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await updateSubject(subject._id, formData);
      if (res.success) {
        onSave(res.data);
        onClose();
      } else {
        setError('Error saving changes.');
      }
    } catch (err) {
      setError('Server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 relative z-10 overflow-y-auto max-h-[90vh]">
          <DialogTitle className="text-2xl font-bold mb-4 text-center">
            Edit Subject
          </DialogTitle>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <div className="space-y-3">
            {/* Basic Fields */}
            {['subjectName', 'courseName', 'imageUrl', 'youTubeUrl'].map(
              (field) => (
                <div key={field}>
                  <label className="block text-sm font-medium capitalize">
                    {field}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field] || ''}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 mt-1"
                  />
                </div>
              )
            )}

            {/* ---------- TAGS ---------- */}
            <div className="mt-5">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">Tags</label>
                <button
                  type="button"
                  onClick={addTag}
                  className="text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  + Add Tag
                </button>
              </div>

              {(formData.tags || []).map((tag, index) => (
                <div
                  key={index}
                  className="flex gap-2 items-center mb-2 border p-2 rounded-lg"
                >
                  <input
                    type="text"
                    placeholder="Tag Name"
                    value={tag.tagName || ''}
                    onChange={(e) =>
                      handleTagChange(index, 'tagName', e.target.value)
                    }
                    className="flex-1 border rounded p-1"
                  />
                  <input
                    type="color"
                    value={tag.tagColor || '#000000'}
                    onChange={(e) =>
                      handleTagChange(index, 'tagColor', e.target.value)
                    }
                    className="w-10 h-8 border rounded"
                  />
                  <button
                    onClick={() => removeTag(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* ---------- INFO ---------- */}
            <div className="mt-5">
              <label className="text-sm font-medium mb-2 block">Info</label>
              <InfoEditor
                infoArray={formData.info || []}
                onChange={handleInfoChange}
              />
            </div>
          </div>

          {/* ---------- BUTTONS ---------- */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default EditSubjectModal;
