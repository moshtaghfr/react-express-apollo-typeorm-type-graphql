import styled, { css } from 'styled-components';

const baseBoxShadow = '0px 8px 16px rgba(0, 0, 0, 0.375)';
const focusedBoxShadow = '0 0 0 3px #88b8ff';

const baseStyle = css`
  padding: 12px;
  border: none;
  border-radius: 19px;
  box-shadow: ${baseBoxShadow};
  background-color: black;
  font-size: 14px;
  color: #fafafa;
  text-transform: uppercase;
  font-weight: bold;

  &:focus {
    outline: none;
    box-shadow: ${baseBoxShadow}, ${focusedBoxShadow};
  }
`;

const Button = styled.button`
  ${baseStyle}
`;

const FixedButton = styled(Button)`
  position: fixed;
  bottom: 24px;
  right: 24px;
`;

const InputTypeFileButton = styled.input`
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  overflow: hidden;
  padding: 0;
  position: absolute !important;
  white-space: nowrap;
  width: 1px;

  & + label {
    ${baseStyle}
  }

  &:focus + label {
    box-shadow: ${baseBoxShadow}, ${focusedBoxShadow};
  }
`;

export { Button, FixedButton, InputTypeFileButton };
