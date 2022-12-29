import * as React from "react";
import styled from "styled-components";
import Button from "../atoms/Button";
import { useLockedBody, useOnClickOutside } from "usehooks-ts";

const ContentContainer = styled.div`
  /* display: flex; */
  overflow: auto;
  height: -webkit-fill-available;
`;

const Box = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  height: 90%;
  background-color: ${({ theme }) => theme.palette.background.secondary};
  box-shadow: 24;
  padding: 16px;
`;

const ModalContent = styled.div`
  z-index: 5;
  display: flex;
  position: fixed;
  background-color: ${({ theme }) => theme.palette.background.backdrop};
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const CancelButtonContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  bottom: -24px;
`;

const CircularButton = styled(Button)`
  border-radius: 50%;
  display: inline-block;
  height: 50px;
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: red; // TODO
`;

export default function Modal({
  isOpen,
  onClose,
  children,
  enableOnClickOutside,
}) {
  const ref = React.useRef(null);
  const [locked, setLocked] = useLockedBody(false, "root");

  const handleClose = () => {
    onClose();
  };

  React.useEffect(() => {
    setLocked(isOpen);
  }, [isOpen]);

  useOnClickOutside(ref, handleClose);

  return isOpen ? (
    <ModalContent
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box ref={enableOnClickOutside ? ref : null}>
        <CancelButtonContainer>
          <CircularButton onClick={handleClose}>
            <>X</>
          </CircularButton>
        </CancelButtonContainer>
        <ContentContainer>{children}</ContentContainer>
      </Box>
    </ModalContent>
  ) : (
    <></>
  );
}
