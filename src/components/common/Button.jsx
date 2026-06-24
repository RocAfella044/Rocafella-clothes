import styled, { css } from 'styled-components';

const variants = {
  primary: css`
    background: #1f2420;
    color: #f3efe7;
    border: 1px solid #1f2420;
    &:hover {
      background: #343c34;
    }
  `,
  secondary: css`
    background: transparent;
    color: #1f2420;
    border: 1px solid #1f2420;
    &:hover {
      background: #1f2420;
      color: #f3efe7;
    }
  `,
  ghost: css`
    background: transparent;
    color: #1f2420;
    border: 1px solid transparent;
    &:hover {
      background: #e3dacb;
    }
  `,
  danger: css`
    background: transparent;
    color: #b0613c;
    border: 1px solid #b0613c;
    &:hover {
      background: #b0613c;
      color: #f3efe7;
    }
  `,
};

const sizes = {
  sm: css`
    padding: 0.4rem 0.9rem;
    font-size: 0.75rem;
  `,
  md: css`
    padding: 0.65rem 1.4rem;
    font-size: 0.8rem;
  `,
  lg: css`
    padding: 0.85rem 2rem;
    font-size: 0.85rem;
  `,
};

export const Button = styled.button`
  font-family: 'IBM Plex Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-weight: 500;
  border-radius: 2px;
  cursor: pointer;
  transition:
    background-color 160ms ease,
    color 160ms ease,
    opacity 160ms ease;
  white-space: nowrap;
  ${(props) => sizes[props.$size || 'md']}
  ${(props) => variants[props.$variant || 'primary']}
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;
