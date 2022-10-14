import { backendClient } from "@/services/backendClient";
import Icon from "@/components/atoms/Icon";
import IconButton from "@/components/atoms/IconButton";
import { useState } from "react";
import styled from "styled-components";

const VoteWrapper = styled.div`
  display: flex;
  margin-top: 16px;
  margin-right: 16px;
  border: 1px solid green;
  height: 64px;
  width: 100px;
  border: 1px solid #ccc;
  border-radius: 4px;

  overflow: hidden;
  background-color: none;
  transition: background-color 0.3s ease-out;
  :hover {
    background-color: white;
  }

  div {
    position: relative;
    bottom: -64px;
  }
  :hover div {
    bottom: 0;
  }
`;

const Selecter = styled.div`
  text-align: center;
  z-index: 4;
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: row;
  place-content: space-around;
  align-items: center;
  position: absolute;
  background-color: white;
`;

const StyledPropSpan = styled.span`
  font-size: 0.8em;
  z-index: 3;
  width: inherit;
  height: inherit;
  display: flex;
  align-items: center;
  flex-flow: row;
  justify-content: space-around;
  position: absolute;
  padding: 4px;
`;

const StyledIcon = styled(Icon)`
  position: absolute;
`;

const Circle = styled.div`
  flex: none;
  border: 3px solid ${({ color }) => color};
  border-radius: 50%;
  height: 40px;
  width: 40px;

  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  transition: all 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
  :hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
`;

const SelectProp = ({ id, selected: initialSelected }) => {
  const [selected, setSelected] = useState(initialSelected);
  const onClick = async (e) => {
    e.preventDefault();
    if (selected) {
      await backendClient.delete(`headline/${id}/select`);
    } else {
      await backendClient.get(`headline/${id}/select`);
    }
    setSelected(!selected);
  };

  return (
    <VoteWrapper>
      <Selecter>
        <IconButton onClick={onClick}>
          {selected && (
            <StyledIcon name="checked" fill="#00ff00" width="24" height="24" />
          )}
          <Circle color={selected ? "#00ff00" : "#ff0000"} />
        </IconButton>
      </Selecter>

      <StyledPropSpan>{selected ? "SELECTED" : "NOT SELECTED"}</StyledPropSpan>
    </VoteWrapper>
  );
};

export default SelectProp;
