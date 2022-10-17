import NavLink from "@/components/molecules/NavLink";
import styled from "styled-components";
import ImageCard from "./ImageCard";

const NftCard = ImageCard;

const ErrorProp = styled.span`
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 16px;
  margin-top: 16px;
  margin-left: 16px;
  background-color: ${({ theme }) => theme.palette.background.error};
  color: ${({ theme }) => theme.palette.text.error};
`;

const StyledContractPropsSpan = styled.span`
  overflow: scroll;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 0;
  padding: 8px;
  margin-top: 16px;
  margin-left: 16px;
  text-align: left;
  display: flex;
`;

const ContractPropTitle = styled.h3`
  margin: 0;
  transform: rotate(-90deg);
  font-size: 0.7em;
  line-height: 0;
`;

const StyledContractPropSpan = styled.span`
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 0;
  padding: 4px;
  margin-top: 4px;
  margin-left: 4px;
  font-size: 0.8em;
`;
const StyledContractPropLink = styled(NavLink)`
  border: none;
  white-space: normal;
  padding: 2px 4px;
  margin-top: 4px;
  border: 1px solid #ccc;
  padding: 4px;
  margin-top: 4px;
  margin-left: 4px;
  font-size: 0.8em;
`;

const ContractProps = ({ tokenType, address, name, symbol }) => {
  return (
    <StyledContractPropsSpan>
      <ContractPropTitle>Contract</ContractPropTitle>
      <div>
        <StyledContractPropSpan>Name: {name}</StyledContractPropSpan>
        <StyledContractPropSpan>Symbol: {symbol}</StyledContractPropSpan>
        <StyledContractPropSpan>{tokenType}</StyledContractPropSpan>
        <StyledContractPropLink
          href={`https://goerli.etherscan.io/address/${address}#code`}
        >
          {address}
        </StyledContractPropLink>
      </div>
    </StyledContractPropsSpan>
  );
};

NftCard.ErrorProp = ErrorProp;
NftCard.ContractProps = ContractProps;

export default NftCard;
