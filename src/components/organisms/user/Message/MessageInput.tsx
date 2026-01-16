// import { useState, useRef } from "react";
import { SmileIcon, Paperclip, X, Loader2 } from "lucide-react";
import EmojiPicker, { Theme, type EmojiClickData } from "emoji-picker-react";
import { messageGateway } from "@/services/gateway/MessageGateway";
import axios from "axios";
import { useRef, useState } from "react";
import { requestChatFileUploadUrl } from "@/services/channel.service";

interface MessageInputProps {
  channelId: string;
  projectId: string | undefined;
}

export function MessageInput({ channelId, projectId }: MessageInputProps) {
  const [text, setText] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  const resetFile = () => {
    setFile(null);
    setIsUploading(false);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > MAX_FILE_SIZE) {
      alert(`File too large. Maximum size is 50MB.`);
      return;
    }

    setFile(selectedFile);
  };

  // Request presigned URL from your backend
  const getPresignedUrl = async () => {
    if (!file || !projectId) return null;

    try {
      const presigned = await requestChatFileUploadUrl(projectId, channelId, {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      });

      return presigned;
    } catch (err) {
      console.error("Failed to get presigned URL:", err);
      alert("Could not prepare file upload. Please try again.");
      return null;
    }
  };

  const uploadToS3 = async (uploadUrl: string) => {
    if (!file) return false;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          }
        },
      });

      return true;
    } catch (err) {
      console.error("S3 upload failed:", err);
      alert("File upload failed. Please try again.");
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  const send = async () => {
    const trimmedText = text.trim();

    // Text only message
    if (trimmedText && !file) {
      messageGateway.sendMessage({
        text: trimmedText,
        channelId,
        projectId,
      });
      setText("");
      setShowPicker(false);
      return;
    }

    // File + optional text message
    if (file) {
      const presigned = await getPresignedUrl();
      if (!presigned?.uploadUrl) return;

      const uploadSuccess = await uploadToS3(presigned.uploadUrl);

      if (uploadSuccess) {
        // Send through socket with attachment info
        messageGateway.sendMessage({
          text: trimmedText || "", // never undefined
          channelId,
          projectId,
          attachments: [
            {
              fileName: file.name,
              fileType: file.type,
              fileSize: file.size,
              fileUrl: presigned.permanentUrl,
              key: presigned.key,
            },
          ],
        });

        resetFile();
        setText("");
        setShowPicker(false);
      }
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  const canSend = (text.trim() || file) && !isUploading;

  return (
    <div className="border-t border-[#2A2D31] p-4 bg-[#1A1D21] relative">
      {showPicker && (
        <div className="absolute bottom-20 left-4 z-50">
          <EmojiPicker
            theme={Theme.DARK}
            onEmojiClick={onEmojiClick}
            skinTonesDisabled
            width={320}
          />
        </div>
      )}

      {/* Selected file preview */}
      {file && (
        <div className="mb-3 px-4 py-2 bg-[#2A2D31] rounded-lg flex items-center gap-3 text-sm">
          <div className="flex-1 min-w-0">
            <p className="truncate font-medium">{file.name}</p>
            <p className="text-gray-400">
              {(file.size / 1024 / 1024).toFixed(1)} MB
            </p>
          </div>

          {isUploading ? (
            <div className="flex items-center gap-2 text-blue-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{uploadProgress}%</span>
            </div>
          ) : (
            <button
              onClick={resetFile}
              className="text-gray-400 hover:text-red-400 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 bg-[#2A2D31] rounded-xl px-4 py-3">
        {/* File attach button */}
        <label
          className={`cursor-pointer transition-colors ${
            isUploading ? "opacity-50 pointer-events-none" : "hover:text-white"
          } text-gray-400`}
        >
          <Paperclip size={20} />
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
        </label>

        {/* Emoji button */}
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="text-gray-400 hover:text-white transition-colors"
          type="button"
          disabled={isUploading}
        >
          <SmileIcon size={20} />
        </button>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (canSend) {
                send();
              }
            }
          }}
          placeholder={
            file ? "Add caption (optional)" : "Message in this channel"
          }
          className="flex-1 bg-transparent text-gray-100 outline-none min-w-0"
          disabled={isUploading}
        />

        <button
          onClick={send}
          disabled={!canSend}
          className={`
            min-w-[80px] px-4 py-2 rounded-lg font-medium transition-all
            ${
              canSend
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-600/40 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          {isUploading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
