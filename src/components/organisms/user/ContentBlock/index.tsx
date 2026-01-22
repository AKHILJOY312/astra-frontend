import { useRef, useEffect } from "react";
import { Row, Col } from "antd";
import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { ContentBlockProps } from "./types";
import { Button } from "../../../atoms/user/Button/index";
import { SvgIcon } from "../common/SvgIcon/index";
import {
  ContentSection,
  Content,
  ContentWrapper,
  ServiceWrapper,
  MinTitle,
  MinPara,
  StyledRow,
  ButtonWrapper,
} from "./styles";

const ContentBlock = ({
  icon,
  title,
  content,
  section,
  button,
  id,
  direction,
}: ContentBlockProps) => {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id) as HTMLDivElement;
    element.scrollIntoView({
      behavior: "smooth",
    });
  };

  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rowRef.current) {
      // Fade animation from left or right
      gsap.from(rowRef.current, {
        opacity: 0,
        x: direction === "right" ? 100 : -100,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: rowRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }
  }, [direction]);

  return (
    <ContentSection>
      <StyledRow
        ref={rowRef}
        justify="space-between"
        align="middle"
        id={id}
        direction={direction}
      >
        <Col lg={11} md={11} sm={12} xs={24}>
          <SvgIcon src={icon} width="100%" height="100%" />
        </Col>
        <Col lg={11} md={11} sm={11} xs={24}>
          <ContentWrapper>
            <h1>{title}</h1>
            <Content>{content}</Content>
            {direction === "right" ? (
              <ButtonWrapper>
                {typeof button === "object" &&
                  button.map(
                    (item: { color?: string; title: string }, id: number) => (
                      <Button
                        key={id}
                        color={item.color}
                        onClick={() => scrollTo("about")}
                      >
                        {item.title}
                      </Button>
                    )
                  )}
              </ButtonWrapper>
            ) : (
              <ServiceWrapper>
                <Row justify="space-between">
                  {typeof section === "object" &&
                    section.map(
                      (
                        item: { title: string; content: string; icon: string },
                        id: number
                      ) => (
                        <Col key={id} span={11}>
                          <SvgIcon src={item.icon} width="60px" height="60px" />
                          <MinTitle>{item.title}</MinTitle>
                          <MinPara>{item.content}</MinPara>
                        </Col>
                      )
                    )}
                </Row>
              </ServiceWrapper>
            )}
          </ContentWrapper>
        </Col>
      </StyledRow>
    </ContentSection>
  );
};

export default ContentBlock;
