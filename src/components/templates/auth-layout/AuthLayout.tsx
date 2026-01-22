export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen  flex items-center rounder-md justify-center  p-4 ">
      {children}
    </div>
  );
}
