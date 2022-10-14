import SelectProp from "@/components/molecules/SelectProp";
import VoteProp from "@/components/molecules/VoteProp";
import styled from "styled-components";

const StyledArticle = styled.article`
  max-width: min(100vw, 450px);
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  padding-bottom: 16px;
`;

const ImageCard = ({ children }) => <StyledArticle>{children}</StyledArticle>;

const StyledH2 = styled.h2`
  padding: 0 16px;
  margin: 16px 0 0 0;
`;

const Heading = ({ children }) => <StyledH2>{children}</StyledH2>;

const StyledImageDiv = styled.div`
  margin-top: 16px;
`;

const ImageWrapper = ({ children }) => (
  <StyledImageDiv>{children}</StyledImageDiv>
);

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

ImageCard.Heading = Heading;
ImageCard.Image = ImageWrapper;
ImageCard.PropsWrapper = PropsWrapper;
ImageCard.SelectProp = SelectProp;
ImageCard.VoteProp = VoteProp;
ImageCard.Prop = Prop;

export default ImageCard;
