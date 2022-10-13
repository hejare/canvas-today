import styled from "styled-components";

const StyledArticle = styled.article`
  width: 100%;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  padding-bottom: 16px;
`;

const NewsHeadline = ({ children }) => (
  <StyledArticle>{children}</StyledArticle>
);

const StyledH2 = styled.h2`
  padding: 0 16px;
  margin: 16px 0 0 0;
`;

const Heading = ({ children }) => <StyledH2>{children}</StyledH2>;

const StyledPropsDiv = styled.div`
  padding: 0 16px 0 0;
`;

const PropsWrapper = ({ children }) => (
  <StyledPropsDiv>{children}</StyledPropsDiv>
);

const StyledPropSpan = styled.span`
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 16px;
  margin-top: 16px;
  margin-left: 16px;
  ${({ theme, active }) => {
    if (active) {
      return `
      background-color: ${theme.palette.background.active};
      color: ${theme.palette.text.active};
      `;
    }
  }}
`;

const Prop = ({ active, children }) => (
  <StyledPropSpan active={active}>{children}</StyledPropSpan>
);

NewsHeadline.Heading = Heading;
NewsHeadline.PropsWrapper = PropsWrapper;
NewsHeadline.Prop = Prop;

export default NewsHeadline;
