import { colors, fontFamily } from '@swym/design-system';

/**
 * Global device CSS — dark background, high contrast for pool readability.
 * Applied once at app mount.
 */
export function applyGlobalStyles() {
  const style = document.createElement('style');
  style.textContent = `
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html, body, #root {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: ${colors.gray900};
      color: ${colors.white};
      font-family: ${fontFamily.base};
      font-weight: 400;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    #root {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `;
  document.head.appendChild(style);
}
