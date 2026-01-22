export const Modal = ({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-[#232529] border border-gray-800 rounded-xl w-full max-w-md p-6 shadow-2xl">
      <h3 className="text-xl font-semibold mb-6 text-white">{title}</h3>
      {children}
      <button
        onClick={onClose}
        className="mt-4 text-sm text-gray-400 hover:text-gray-300 w-full transition-colors"
      >
        Close
      </button>
    </div>
  </div>
);
