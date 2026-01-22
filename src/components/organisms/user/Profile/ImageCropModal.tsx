// src/components/organisms/user/Profile/ImageCropModal.tsx

import React, { useState } from "react";
import ReactCrop, {
  type Crop,
  type PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Camera, X, AlertCircle } from "lucide-react";

interface ImageCropModalProps {
  open: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedFile: File) => void;
  error?: string; // ← Add this prop
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  open,
  imageSrc,
  onClose,
  onCropComplete,
  error, // ← Receive error message
}) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget;

    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        1,
        width,
        height
      ),
      width,
      height
    );

    setCrop(crop);
  };

  const createCroppedImage = async () => {
    if (!completedCrop || !imageSrc) return;

    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));

    // For circular crop: we want the diameter = smallest side of the crop box
    const size = Math.min(completedCrop.width, completedCrop.height);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    // Calculate center of the selected crop
    const centerX = completedCrop.x + completedCrop.width / 2;
    const centerY = completedCrop.y + completedCrop.height / 2;

    // Draw circular clip + image centered
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Draw image centered on canvas
    ctx.drawImage(
      image,
      centerX - size / 2, // source x
      centerY - size / 2, // source y
      size, // source width
      size, // source height
      0, // dest x
      0, // dest y
      size, // dest width
      size // dest height
    );

    ctx.restore();

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const croppedFile = new File([blob], "profile-cropped.jpg", {
            type: "image/jpeg",
          });
          onCropComplete(croppedFile);
          onClose();
        }
      },
      "image/jpeg",
      0.95
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#232529] border border-gray-800 rounded-xl w-full max-w-lg p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Camera size={20} /> Crop Profile Picture
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Error Message Inside Modal */}
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="relative w-full h-96 bg-black rounded-lg overflow-hidden mb-6">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
            circularCrop={true}
            ruleOfThirds={false}
          >
            <img
              src={imageSrc}
              alt="Crop preview"
              onLoad={onImageLoad}
              className="max-w-full max-h-full object-contain"
            />
          </ReactCrop>
        </div>

        <div className="flex gap-3">
          <button
            onClick={createCroppedImage}
            disabled={!completedCrop}
            className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-all"
          >
            Confirm & Upload
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-[#1a1d21] hover:bg-[#2a2d31] border border-gray-700 text-gray-200 py-3 rounded-lg font-medium transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
