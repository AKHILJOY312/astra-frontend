import { useState } from "react";
import { Drawer, Row } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { SvgIcon } from "../common/SvgIcon";
import { Button } from "../common/Button/index";
import Container from "../common/Container";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/presentation/hooks/useAuth";

const Header = () => {
  const [visible, setVisible] = useState(false);
  const { isAuthenticated } = useAuth();
  const toggleDrawer = () => setVisible(!visible);
  const navigate = useNavigate();
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setVisible(false);
    }
  };

  const MenuItem = () => (
    <>
      <div
        onClick={() => scrollTo("about")}
        className="text-lg text-[#18216d] mx-6 my-2 cursor-pointer transition-all duration-200 hover:text-orange-500 hover:underline underline-offset-4 decoration-wavy"
      >
        About
      </div>
      <div
        onClick={() => scrollTo("mission")}
        className="text-lg text-[#18216d] mx-6 my-2 cursor-pointer transition-all duration-200 hover:text-orange-500 hover:underline underline-offset-4 decoration-wavy"
      >
        Mission
      </div>
      <div
        onClick={() => scrollTo("product")}
        className="text-lg text-[#18216d] mx-6 my-2 cursor-pointer transition-all duration-200 hover:text-orange-500 hover:underline underline-offset-4 decoration-wavy"
      >
        Product
      </div>
      <div
        onClick={() => scrollTo("contact")}
        className="text-lg text-[#18216d] mx-6 my-2 cursor-pointer transition-all duration-200 hover:text-orange-500 hover:underline underline-offset-4 decoration-wavy"
      >
        Contact
      </div>
      {isAuthenticated ? (
        <>
          <div className="flex items-center gap-4 ml-6">
            <Button onClick={() => navigate("/project")}>Project</Button>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-4 ml-6">
            <Button onClick={() => navigate("/login")}>Login</Button>
          </div>
          <div className="flex items-center gap-4 ml-6">
            <Button onClick={() => navigate("/register")}>Sign Up</Button>
          </div>
        </>
      )}
    </>
  );

  return (
    <header className="py-4 px-2 shadow-sm">
      <Container>
        <Row justify="space-between" align="middle">
          {/* Logo */}
          <a href="/" aria-label="homepage" className="flex items-center">
            <SvgIcon src="untitled1.svg" width="50px" height="50px" /> Astra
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center">
            <MenuItem />
          </div>

          {/* Burger for mobile */}
          <div
            onClick={toggleDrawer}
            className="block md:hidden text-[#2e186a] cursor-pointer text-2xl"
          >
            <MenuOutlined />
          </div>
        </Row>

        {/* Drawer (mobile menu) */}
        <Drawer
          closable={false}
          open={visible}
          onClose={toggleDrawer}
          style={{ backgroundColor: "white" }}
        >
          <div
            className="flex justify-between items-center mb-8 cursor-pointer"
            onClick={toggleDrawer}
          >
            <h5 className="text-xl font-semibold">Menu</h5>
            <MenuOutlined className="text-xl" />
          </div>
          <div className="flex flex-col items-start space-y-3">
            <MenuItem />
          </div>
        </Drawer>
      </Container>
    </header>
  );
};

export default Header;
