import { useState, useRef, useEffect } from "react";
import { SmileIcon, Paperclip, X, Loader2, AlertCircle } from "lucide-react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { messageGateway } from "@/services/gateway/MessageGateway";
import axios from "axios";
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
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  // Auto-hide error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const resetFile = () => {
    setFile(null);
    setIsUploading(false);
    setUploadProgress(0);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File is too large (max 50MB)");
      return;
    }

    setError(null);
    setFile(selectedFile);
    inputRef.current?.focus();
  };

  const uploadToS3 = async (uploadUrl: string) => {
    if (!file) return false;
    setIsUploading(true);
    setUploadProgress(0);

    try {
      await axios.put(uploadUrl, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setUploadProgress(
              Math.round((progressEvent.loaded * 100) / progressEvent.total),
            );
          }
        },
      });
      return true;
    } catch (err) {
      console.error(err);
      setError("Failed to upload file. Please try again.");
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  const send = async () => {
    const trimmedText = text.trim();
    if (!trimmedText && !file) return;

    if (file) {
      try {
        const presigned = await requestChatFileUploadUrl(
          projectId!,
          channelId,
          {
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
          },
        );

        if (!presigned?.uploadUrl) throw new Error();

        const success = await uploadToS3(presigned.uploadUrl);
        if (success) {
          messageGateway.sendMessage({
            text: trimmedText,
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
        }
      } catch (err) {
        console.error(err);
        setError("Could not send message with file.");
      }
    } else {
      messageGateway.sendMessage({ text: trimmedText, channelId, projectId });
      setText("");
    }
    setShowPicker(false);
  };

  const canSend = (text.trim() || file) && !isUploading;

  return (
    <div className="border-t border-[#2A2D31] p-4 bg-[#1A1D21] relative">
      {/* Error Toast */}
      {error && (
        <div className="absolute -top-12 left-4 right-4 bg-red-500/10 border border-red-500/50 text-red-400 px-3 py-2 rounded-lg flex items-center gap-2 text-sm animate-in fade-in slide-in-from-bottom-2">
          <AlertCircle size={16} />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto opacity-70 hover:opacity-100"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {showPicker && (
        <div className="absolute bottom-20 left-4 z-50">
          <EmojiPicker
            theme={Theme.DARK}
            onEmojiClick={(data) => {
              setText((prev) => prev + data.emoji);
              inputRef.current?.focus();
            }}
            skinTonesDisabled
            width={320}
          />
        </div>
      )}

      {/* Selected file preview */}
      {file && (
        <div className="mb-3 px-4 py-3 bg-[#2A2D31] rounded-lg flex flex-col gap-2 transition-all">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium text-gray-200">{file.name}</p>
              <p className="text-gray-400 text-xs">
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </p>
            </div>
            {!isUploading && (
              <button
                onClick={resetFile}
                className="text-gray-400 hover:text-red-400"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {isUploading && (
            <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 bg-[#2A2D31] rounded-xl px-4 py-3 focus-within:ring-1 focus-within:ring-blue-500/50">
        <label
          className={`cursor-pointer transition-colors ${isUploading ? "opacity-50 pointer-events-none" : "hover:text-white"} text-gray-400`}
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

        <button
          onClick={() => setShowPicker(!showPicker)}
          className={`transition-colors ${showPicker ? "text-blue-400" : "text-gray-400 hover:text-white"}`}
          type="button"
          disabled={isUploading}
        >
          <SmileIcon size={20} />
        </button>

        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && canSend) {
              e.preventDefault();
              send();
            }
          }}
          placeholder={file ? "Add a caption..." : "Message in this channel"}
          className="flex-1 bg-transparent text-gray-100 outline-none min-w-0"
          disabled={isUploading}
        />

        <button
          onClick={send}
          disabled={!canSend}
          className={`
            min-w-[80px] px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center
            ${canSend ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-600/20 text-gray-500 cursor-not-allowed"}
          `}
        >
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
        </button>
      </div>
    </div>
  );
}
