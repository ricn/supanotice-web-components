import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

interface NoticeItem {
  id: string;
  title: string;
  body: string;
  date: string;
  tags: string[];
  read: boolean;
}

interface WidgetSettings {
  title: string;
  theme: 'light' | 'dark';
  backgroundColor: string;
  iconColor: string;
  showReadNotices: boolean;
  maxItems: number;
  pollInterval: number; // in minutes
}

/**
 * A notification bubble component that displays in the bottom right corner
 * and opens a widget with product announcements when clicked.
 */
@customElement('supanotice-widget')
export class SupanoticeWidget extends LitElement {
  /**
   * The widget ID used to fetch configuration from the server.
   */
  @property({ type: String, attribute: 'widget-id' })
  widgetId = 'default';

  /**
   * The widget settings loaded from the server based on widget-id.
   * These are fake settings for now.
   */
  @state()
  private widgetSettings: WidgetSettings = {
    title: 'What\'s New',
    theme: 'light',
    backgroundColor: '#4f46e5', // Default indigo color
    iconColor: '#ffffff', // White color for icons
    showReadNotices: true,
    maxItems: 10,
    pollInterval: 60
  };

  /**
   * The notification items to display in the widget.
   */
  @property({ type: Array })
  notices: NoticeItem[] = [
    {
      id: '1',
      title: 'New Feature: Dark Mode',
      body: 'We\'ve just released dark mode! Enable it in your settings to try it out.',
      date: '2025-05-15',
      tags: ['feature', 'ui'],
      read: false
    },
    {
      id: '2',
      title: 'Performance Improvements',
      body: 'We\'ve made several performance improvements to speed up your experience.',
      date: '2025-05-10',
      tags: ['update', 'performance'],
      read: false
    },
    {
      id: '3',
      title: 'Upcoming Maintenance',
      body: 'We\'ll be performing maintenance on May 25th from 2-4am UTC. Expect brief service interruptions.',
      date: '2025-05-05',
      tags: ['maintenance', 'downtime'],
      read: true
    }
  ];

  /**
   * The number of unread notices.
   */
  @property({ type: Number })
  get unreadCount(): number {
    return this.notices.filter(notice => !notice.read).length;
  }

  /**
   * Whether the widget is open or closed.
   */
  @state()
  private isOpen = false;

  render() {
    return html`
      <div class="container" style="--background-color: ${this.widgetSettings.backgroundColor}; --icon-color: ${this.widgetSettings.iconColor};">
        ${this.isOpen ? this.renderWidget() : ''}
        <button 
          class="bubble ${this.isOpen ? 'open' : ''}" 
          @click=${this._toggleWidget}
          aria-label="Notifications"
          aria-expanded=${this.isOpen}
        >
          ${this.unreadCount > 0 ? html`<span class="badge">${this.unreadCount}</span>` : ''}
          ${this.isOpen 
              ? html`
                <!-- X icon when open -->
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10" fill="none"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              ` 
              : html`
                <!-- News/announcement icon when closed -->
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="7" y1="8" x2="17" y2="8"></line>
                  <line x1="7" y1="12" x2="17" y2="12"></line>
                  <line x1="7" y1="16" x2="17" y2="16"></line>
                </svg>
              `
            }
        </button>
      </div>
    `;
  }

  private closeWidget() {
    this.isOpen = false;
    this.requestUpdate();
  }

  private renderWidget() {
    return html`
      <div class="widget" role="dialog" aria-labelledby="widget-title">
        <header>
          <h2 id="widget-title">${this.widgetSettings.title}</h2>
          <button class="close-button" @click=${() => this.closeWidget()} aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>
        <div class="notice-list">
          ${this.notices.length === 0 
            ? html`<p class="empty">No announcements yet.</p>` 
            : this.notices
                .filter(notice => this.widgetSettings.showReadNotices || !notice.read)
                .slice(0, this.widgetSettings.maxItems)
                .map(notice => this.renderNotice(notice))
          }
        </div>
      </div>
    `;
  }

  private renderNotice(notice: NoticeItem) {
    return html`
      <div class="notice-item ${notice.read ? 'read' : 'unread'}" @click=${() => this._markAsRead(notice.id)}>
        <div class="notice-header">
          <h3>${notice.title}</h3>
          <span class="notice-date">${this._formatDate(notice.date)}</span>
        </div>
        <p class="notice-body">${notice.body}</p>
        <div class="notice-tags">
          ${notice.tags.map(tag => html`<span class="tag">${tag}</span>`)}
        </div>
      </div>
    `;
  }

  private _toggleWidget() {
    this.isOpen = !this.isOpen;
  }

  private _markAsRead(id: string) {
    this.notices = this.notices.map(notice => 
      notice.id === id ? { ...notice, read: true } : notice
    );
    this.requestUpdate();
  }

  private _formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  }

  static styles = css`
    :host {
      display: block;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    .container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      pointer-events: none;
    }

    .bubble {
      pointer-events: auto;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background-color: var(--background-color, #4f46e5);
      color: white;
      border: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: transform 0.2s ease, filter 0.2s ease;
    }

    .bubble:hover {
      transform: scale(1.05);
      filter: brightness(0.85);
    }

    .bubble.open {
      filter: brightness(0.75);
    }

    .badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background-color: #ef4444;
      color: white;
      font-size: 12px;
      font-weight: bold;
      height: 20px;
      min-width: 20px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 6px;
    }

    .widget {
      pointer-events: auto; /* Make widget clickable */
      width: 460px;
      height: calc(100vh - 100px);
      max-height: 80vh;
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      margin-bottom: 16px;
      margin-top: 20px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      position: fixed;
      right: 20px;
      bottom: 96px;
    }

    header {
      padding: 16px 20px;
      background-color: var(--background-color, #4f46e5);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: white;
    }
    
    .close-button {
      pointer-events: auto; /* Make sure it's clickable */
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background-color 0.2s ease;
    }
    
    .close-button:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .feather {
      transition: transform 0.2s ease;
    }

    .notice-list {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      scrollbar-width: thin;
    }

    .notice-item {
      padding: 16px;
      border-radius: 8px;
      background-color: #f9fafb;
      cursor: pointer;
      transition: transform 0.1s ease, box-shadow 0.1s ease;
    }

    .notice-item.unread {
      background-color: #eff6ff;
      border-left: 3px solid #3b82f6;
    }

    .notice-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .notice-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #111827;
    }

    .notice-date {
      font-size: 12px;
      color: #6b7280;
    }

    .notice-body {
      margin: 0 0 12px 0;
      font-size: 14px;
      line-height: 1.5;
      color: #374151;
    }

    .notice-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .tag {
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 9999px;
      background-color: #e5e7eb;
      color: #4b5563;
    }

    .empty {
      text-align: center;
      color: #6b7280;
      font-size: 14px;
      padding: 24px;
    }

    /* Responsive adjustments */
    @media (max-width: 600px) {
      .widget {
        width: 100%;
        max-width: calc(100vw - 40px);
        height: calc(100vh - 100px);
        right: 50%;
        transform: translateX(50%);
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'supanotice-widget': SupanoticeWidget;
  }
}
