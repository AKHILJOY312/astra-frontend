import Header from "@/components/organisms/user/Header";
import Footer from "@/components/organisms/user/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-10rem)]">{children}</main>
      <Footer />
    </>
  );
}
