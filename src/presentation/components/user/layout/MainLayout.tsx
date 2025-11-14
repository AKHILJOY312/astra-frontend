import Header from "../Header/index";
import Footer from "../Footer/index";

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
