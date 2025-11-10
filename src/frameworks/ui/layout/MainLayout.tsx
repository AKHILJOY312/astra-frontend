import Header from "../components/user/Header/index";
import Footer from "../components/user/Footer/index";

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
