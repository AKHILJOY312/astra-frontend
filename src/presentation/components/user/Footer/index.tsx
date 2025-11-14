import { Link } from "react-router-dom";
import { Row, Col } from "antd";
import { SvgIcon } from "../common/SvgIcon/index";
import Container from "../common/Container/index";

interface SocialLinkProps {
  href: string;
  src: string;
}

const Footer = () => {
  const SocialLink = ({ href, src }: SocialLinkProps) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={src}
      className="transition-transform duration-200 hover:scale-110"
    >
      <SvgIcon src={src} width="25px" height="25px" />
    </a>
  );

  return (
    <>
      {/* MAIN FOOTER */}
      <footer className="bg-gray-100 py-10">
        <Container>
          <Row justify="space-between" gutter={[16, 32]}>
            {/* Contact */}
            <Col lg={10} md={10} sm={12} xs={24}>
              <h4 className="text-[22px] capitalize text-[#18216d] mb-2">
                {"Contact"}
              </h4>
              <Link
                to="/"
                className="block text-base capitalize text-black mb-2 hover:text-[#ff825c] hover:underline underline-offset-4 decoration-wavy"
              >
                {"Tell us everything"}
              </Link>
              <p className="text-[#18216d] text-sm w-[70%]">
                {`Do you have any question? Feel free to reach out.`}
              </p>
              <a href="mailto:l.qqbadze@gmail.com">
                <p className="text-[#18216d] border-b border-[#18216d] w-fit mt-4 cursor-pointer transition-all duration-300 hover:text-[#ff825c] hover:border-[#ff825c]">
                  {`Let's Chat`}
                </p>
              </a>
            </Col>

            {/* Policy */}
            <Col lg={8} md={8} sm={12} xs={24}>
              <h4 className="text-[22px] capitalize text-[#18216d] mb-4">
                {"Policy"}
              </h4>
              <Link
                to="/"
                className="block text-base mb-2 hover:text-[#15418e]"
              >
                {"Application Security"}
              </Link>
              <Link
                to="/"
                className="block text-base mb-2 hover:text-[#15418e]"
              >
                {"Software Principles"}
              </Link>
            </Col>

            {/* Support */}
            <Col lg={6} md={6} sm={12} xs={24}>
              <div className="h-[53px]" />
              <Link
                to="/"
                className="block text-base mb-2 hover:text-[#15418e]"
              >
                {"Support Center"}
              </Link>
              <Link
                to="/"
                className="block text-base mb-2 hover:text-[#15418e]"
              >
                {"Customer Support"}
              </Link>
            </Col>
          </Row>

          {/* Address & Language */}
          <Row justify="space-between" gutter={[16, 32]} className="mt-6">
            <Col lg={10} md={10} sm={12} xs={24}>
              <div className="h-[53px]" />
              <h4 className="text-[22px] capitalize text-[#18216d] mb-2">
                {"Address"}
              </h4>
              <p className="text-[#18216d] text-sm">Rancho Santa Margarita</p>
              <p className="text-[#18216d] text-sm">2131 Elk Street</p>
              <p className="text-[#18216d] text-sm">California</p>
            </Col>

            {/* Company */}
            <Col lg={8} md={8} sm={12} xs={24}>
              <h4 className="text-[22px] capitalize text-[#18216d] mb-4">
                {"Company"}
              </h4>
              <Link
                to="/"
                className="block text-base mb-2 hover:text-[#15418e]"
              >
                {"About"}
              </Link>
              <Link
                to="/"
                className="block text-base mb-2 hover:text-[#15418e]"
              >
                {"Blog"}
              </Link>
              <Link
                to="/"
                className="block text-base mb-2 hover:text-[#15418e]"
              >
                {"Press"}
              </Link>
              <Link
                to="/"
                className="block text-base mb-2 hover:text-[#15418e]"
              >
                {"Careers & Culture"}
              </Link>
            </Col>

            {/* Language */}
            <Col lg={6} md={6} sm={12} xs={24}>
              <label
                htmlFor="select-lang"
                className="text-[22px] text-[#18216d] capitalize font-bold block mb-4"
              >
                {"Language"}
              </label>
              <div className="flex justify-between w-[85px]">
                <div className="cursor-pointer transition-transform hover:scale-110">
                  <SvgIcon
                    src="united-states.svg"
                    aria-label="english"
                    width="30px"
                    height="30px"
                  />
                </div>
                <div className="cursor-pointer transition-transform hover:scale-110">
                  <SvgIcon
                    src="spain.svg"
                    aria-label="spanish"
                    width="30px"
                    height="30px"
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>

      {/* EXTRA SECTION */}
      <section className="bg-gray-100 pb-8">
        <Container border={true}>
          <Row
            justify="space-between"
            align="middle"
            className="pt-12 flex-wrap"
          >
            <Link to="/">
              <div className="flex items-center">
                <SvgIcon
                  src="logo.svg"
                  aria-label="homepage"
                  width="101px"
                  height="64px"
                />
              </div>
            </Link>

            <div className="flex justify-between items-center gap-5 max-w-[510px] w-full transition-all">
              <SocialLink
                href="https://github.com/Adrinlol/create-react-app-adrinlol"
                src="github.svg"
              />
              <SocialLink
                href="https://twitter.com/Adrinlolx"
                src="twitter.svg"
              />
              <SocialLink
                href="https://www.linkedin.com/in/lasha-kakabadze/"
                src="linkedin.svg"
              />
              <SocialLink
                href="https://medium.com/@lashakakabadze/"
                src="medium.svg"
              />
              <a
                href="https://ko-fi.com/Y8Y7H8BNJ"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  height="36"
                  src="https://storage.ko-fi.com/cdn/kofi3.png?v=3"
                  alt="Buy Me a Coffee at ko-fi.com"
                  className="h-9 border-0"
                />
              </a>
            </div>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Footer;
