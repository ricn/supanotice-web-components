import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './supanotice-widget';

/**
 * A preview component for the Supanotice Widget that allows toggling between
 * light and dark modes and resetting widget states.
 */
@customElement('supanotice-preview')
export class SupanoticePreview extends LitElement {
    // This component uses slots to allow nested widget components

  /**
   * Whether the preview is in dark mode
   */
  @state()
  private isDarkMode = false;

  /**
   * Toggle between dark and light mode
   */
  private toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
  }

  /**
   * Reset the widget states (clears localStorage for read publications)
   */
  private resetWidgetStates() {
    localStorage.removeItem('supanotice-read-publications');
    // Force a re-render of the widget
    const widget = this.shadowRoot?.querySelector('supanotice-widget');
    if (widget) {
      widget.dispatchEvent(new CustomEvent('reset'));
    }
    // We also need to manually refresh the page to ensure the widget is re-initialized
    window.location.reload();
  }

  connectedCallback() {
    super.connectedCallback();
    // We don't actually need to check for slotted widgets anymore
    // since we're using slots directly
  }

  render() {
    return html`
      <div class="preview-container ${this.isDarkMode ? 'dark-mode' : 'light-mode'}">
        <div class="controls">
          <div class="theme-toggles">
            <button class="theme-toggle desktop" title="Desktop view" aria-label="Desktop view">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </button>
            <button class="theme-toggle mobile" title="Mobile view" aria-label="Mobile view">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="mode-toggle">
            <button 
              class="theme-toggle ${this.isDarkMode ? 'active' : ''}" 
              @click=${this.toggleTheme} 
              title="Dark mode"
              aria-label="Toggle dark mode">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </button>
            <button 
              class="theme-toggle ${!this.isDarkMode ? 'active' : ''}" 
              @click=${this.toggleTheme} 
              title="Light mode"
              aria-label="Toggle light mode">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            </button>
          </div>
          <button 
            class="reset-button" 
            @click=${this.resetWidgetStates}
            title="Reset widget states"
            aria-label="Reset widget states">
            Reset widget states
          </button>
        </div>
        <div class="preview-frame">
          <slot></slot>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    .preview-container {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 80vh;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    .dark-mode {
      background-color: #0f172a;
      color: #f1f5f9;
    }

    .light-mode {
      background-color: #f1f5f9;
      color: #0f172a;
    }

    .controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid;
      border-color: rgba(229, 231, 235, 0.1);
    }

    .dark-mode .controls {
      border-color: rgba(229, 231, 235, 0.1);
    }

    .light-mode .controls {
      border-color: rgba(15, 23, 42, 0.1);
    }

    .theme-toggles {
      display: flex;
      gap: 8px;
    }

    .mode-toggle {
      display: flex;
      gap: 8px;
    }

    .theme-toggle {
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px;
      border-radius: 8px;
      transition: background-color 0.2s ease;
    }

    .theme-toggle:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .light-mode .theme-toggle:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    .theme-toggle.active {
      background-color: rgba(255, 255, 255, 0.2);
    }

    .light-mode .theme-toggle.active {
      background-color: rgba(0, 0, 0, 0.1);
    }

    .reset-button {
      background-color: #3b82f6;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .reset-button:hover {
      background-color: #2563eb;
    }

    .preview-frame {
      flex: 1;
      position: relative;
      background-image: linear-gradient(45deg, rgba(0, 0, 0, 0.05) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.05) 75%),
                        linear-gradient(45deg, rgba(0, 0, 0, 0.05) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.05) 75%);
      background-size: 40px 40px;
      background-position: 0 0, 20px 20px;
      /* Make the frame behave like a real browser viewport */
      overflow: hidden;
    }

    .dark-mode .preview-frame {
      background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.05) 25%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.05) 75%),
                        linear-gradient(45deg, rgba(255, 255, 255, 0.05) 25%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.05) 75%);
    }
    
    /* Style the slotted widget to ensure it behaves as expected */
    ::slotted(supanotice-widget) {
      position: absolute !important;
      bottom: 0 !important;
      right: 0 !important;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'supanotice-preview': SupanoticePreview;
  }
}
