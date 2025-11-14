import { lazy } from "react";
import IntroContent from "../../../content/IntroContent.json";
import MiddleBlockContent from "../../../content/MiddleBlockContent.json";
import AboutContent from "../../../content/AboutContent.json";
import MissionContent from "../../../content/MissionContent.json";
import ProductContent from "../../../content/ProductContent.json";

const MiddleBlock = lazy(() => import("../../../components/user/MiddleBlock"));
const Container = lazy(
  () => import("@/presentation/components/user/common/Container/index")
);
const ScrollToTop = lazy(
  () => import("@/presentation/components/user/common/ScrollToTop/index")
);
const ContentBlock = lazy(
  () => import("../../../components/user/ContentBlock")
);

const Home = () => {
  return (
    <Container>
      <ScrollToTop />

      <ContentBlock
        direction="right"
        title={IntroContent.title}
        content={IntroContent.text}
        button={IntroContent.button}
        icon="developer.svg"
        id="intro"
      />
      <MiddleBlock
        title={MiddleBlockContent.title}
        content={MiddleBlockContent.text}
        button={MiddleBlockContent.button}
      />
      <ContentBlock
        direction="left"
        title={AboutContent.title}
        content={AboutContent.text}
        section={AboutContent.section}
        icon="graphs.svg"
        id="about"
      />
      <ContentBlock
        direction="right"
        title={MissionContent.title}
        content={MissionContent.text}
        icon="product-launch.svg"
        id="mission"
      />
      <ContentBlock
        direction="left"
        title={ProductContent.title}
        content={ProductContent.text}
        icon="waving.svg"
        id="product"
      />
    </Container>
  );
};

export default Home;
