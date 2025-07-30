import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

interface Label {
  id: string;
  name: string;
}

interface PublicationItem {
  id: string;
  title: string;
  body: string;
  fullBody?: string; // Optional longer text for expanded view
  image?: string; // URL to the image
  published_at: string; // ISO date string
  labels: Label[];
}

interface WidgetSettings {
  title: string;
  backgroundColor: string;
  color: string;
  maxItems: number;
  newspage_url?: string | null;
}

interface WidgetApiResponse {
  title: string;
  color: string;
  background_color: string;
  publications: PublicationItem[];
  newspage_url?: string | null;
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
   * Whether the widget is being displayed in preview mode.
   * This changes the positioning to work within a preview container.
   */
  @property({ type: Boolean, attribute: 'preview-mode' })
  previewMode = false;

  /**
   * The refresh key that triggers a reload of the widget configuration when changed.
   */
  @property({ type: String, attribute: 'refresh-key' })
  refreshKey = '';

  /**
   * The widget settings loaded from the server based on widget-id.
   */
  @state()
  private widgetSettings: WidgetSettings = {
    title: 'What\'s New',
    backgroundColor: '#4f46e5', // Default indigo color
    color: '#ffffff', // White color for icons and text
    maxItems: 10
  };

  /**
   * Indicates if the widget configuration is currently loading
   */
  @state()
  private isLoading = false;

  /**
   * Error message if configuration loading fails
   */
  @state()
  private errorMessage: string | null = null;

  /**
   * The notification items to display in the widget.
   */
  @state()
  private publications: PublicationItem[] = [];
  
  /**
   * Local storage key for read publications
   */
  private readonly LOCAL_STORAGE_KEY = 'supanotice-read-publications';
  
  /**
   * Map to track view times of publications
   */
  @state()
  private publicationViewTimes: Map<string, number> = new Map();

  /**
   * Timer for tracking view duration
   */
  private viewTimer: number | null = null;

  /**
   * Lifecycle callback when element is connected to DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.fetchWidgetConfiguration();
  }

  /**
   * Called when an observed property changes.
   * Detects changes to the refresh-key property and reloads the configuration.
   */
  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('refreshKey')) {
      // If refresh-key changed, reload the widget configuration
      this.fetchWidgetConfiguration();
    }
    
    // Setup attachment links after any update
    this.setupAttachmentLinks();
  }

  /**
   * Fetches widget configuration from the API
   */
  async fetchWidgetConfiguration() {
    if (!this.widgetId) return;
    
    this.isLoading = true;
    this.errorMessage = null;
    
    try {
      const response = await fetch(`http://localhost:4000/api/v1/widgets/${this.widgetId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch widget configuration: ${response.statusText}`);
      }
      
      const data: WidgetApiResponse = await response.json();
      
      // Map the API response to our internal format
      this.widgetSettings = {
        ...this.widgetSettings,
        title: data.title || this.widgetSettings.title,
        color: data.color || this.widgetSettings.color,
        backgroundColor: data.background_color || this.widgetSettings.backgroundColor,
        newspage_url: data.newspage_url || this.widgetSettings.newspage_url
      };
      
      // Update publications from the API response
      if (data.publications) {
        this.publications = data.publications;
      }
    } catch (error) {
      console.error('Error fetching widget configuration:', error);
      this.errorMessage = error instanceof Error ? error.message : 'Unknown error';
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * The number of unread notices.
   */
  @property({ type: Number })
  get unreadCount(): number {
    const readPublications = this.getReadPublications();
    return this.publications.filter(publication => !readPublications.includes(publication.id)).length;
  }

  /**
   * Whether the widget is open or closed.
   */
  @state()
  private isOpen = false;

  @state()
  private expandedPublications: Set<string> = new Set();

  render() {
    return html`
      <div class="container" style="--background-color: ${this.widgetSettings.backgroundColor}; --color: ${this.widgetSettings.color};">
        ${this.isLoading ? html`<div class="loading">Loading widget configuration...</div>` : ''}
        ${this.errorMessage ? html`<div class="error">${this.errorMessage}</div>` : ''}
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
    this.clearViewTracking();
    this.requestUpdate();
  }

  private openNewsPage() {
    if (this.widgetSettings.newspage_url) {
      window.open(this.widgetSettings.newspage_url, '_blank', 'noopener,noreferrer');
    }
  }

  private renderWidget() {
    return html`
      <div class="widget" role="dialog" aria-labelledby="widget-title">
        <header>
          ${this.widgetSettings.newspage_url ? html`
            <h2 id="widget-title" class="clickable-title" @click=${() => this.openNewsPage()}>
              ${this.widgetSettings.title}
              <svg class="external-link-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15,3 21,3 21,9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </h2>
          ` : html`
            <h2 id="widget-title">${this.widgetSettings.title}</h2>
          `}
          <button class="close-button" @click=${() => this.closeWidget()} aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>
        <div class="publication-list">
              ${this.publications.length === 0 ? 
                html`<div class="empty">No publications available</div>` :
                this.publications
                .slice(0, this.widgetSettings.maxItems)
                .map(publication => this.renderPublication(publication))
          }
        </div>
        <footer class="widget-footer">
          <a href="https://supanotice.com" target="_blank" rel="noopener noreferrer" class="supanotice-link">supanotice.</a>
        </footer>
      </div>
    `;
  }

  private renderPublication(publication: PublicationItem) {
    const isExpanded = this.expandedPublications.has(publication.id);
    const hasFullBody = !!publication.fullBody;
    const bodyText = isExpanded && hasFullBody ? publication.fullBody : publication.body;
    const isRead = this.isPublicationRead(publication.id);
    
    // We will track view time on mouse enter or touch instead of on render
    
    return html`
      <div class="publication-item ${isRead ? 'read' : 'unread'} ${isExpanded ? 'expanded' : ''}"
           @mouseenter=${() => this.startTrackingPublication(publication.id)}
           @touchstart=${() => this.startTrackingPublication(publication.id)}>
        <div class="publication-top">
          <span class="publication-date">${this._formatDate(publication.published_at)}</span>
        </div>
        <div class="publication-header" @click=${() => this.startTrackingPublication(publication.id)}>
          <h3>${publication.title}</h3>
          <div class="publication-labels">
            ${publication.labels.map(label => html`<span class="label">${label.name}</span>`)}
          </div>
        </div>
        ${publication.image ? html`
          <div class="publication-image" @click=${() => this.startTrackingPublication(publication.id)}>
            <img src="${publication.image as string}" alt="${publication.title || 'Publication image'}" />
          </div>
        ` : ''}
        <div class="publication-content" @click=${() => this.startTrackingPublication(publication.id)}>
          <div class="publication-body" .innerHTML=${bodyText}></div>
          ${hasFullBody ? html`
            <button @click=${(e: Event) => this._toggleExpand(e, publication.id)} class="read-more-btn">
              ${isExpanded ? 'Read less' : 'Read more'}
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }

  private _toggleWidget() {
    this.isOpen = !this.isOpen;
    
    if (!this.isOpen) {
      // Clear all tracking when widget is closed
      this.clearViewTracking();
    } else {
      // Start tracking when widget is opened
      this.startViewTracking();
      // Setup attachment links when widget opens
      this.setupAttachmentLinks();
    }
  }



  private _toggleExpand(e: Event, id: string) {
    e.stopPropagation(); // Prevent triggering parent click handlers
    
    if (this.expandedPublications.has(id)) {
      this.expandedPublications.delete(id);
    } else {
      this.expandedPublications.add(id);
    }
    
    this.requestUpdate();
  }



  private _formatDate(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  }
  
  /**
   * Get read publications from localStorage
   */
  private getReadPublications(): string[] {
    try {
      const stored = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error('Error accessing localStorage', err);
      return [];
    }
  }
  
  /**
   * Add a publication ID to the read list in localStorage
   */
  private addToReadPublications(id: string): void {
    try {
      const readPublications = this.getReadPublications();
      if (!readPublications.includes(id)) {
        readPublications.push(id);
        localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(readPublications));
      }
    } catch (err) {
      console.error('Error writing to localStorage', err);
    }
  }
  
  /**
   * Check if publication is read
   */
  private isPublicationRead(id: string): boolean {
    return this.getReadPublications().includes(id);
  }
  
  /**
   * Begin tracking view time for a specific publication
   */
  private startTrackingPublication(id: string): void {
    if (!this.publicationViewTimes.has(id)) {
      this.publicationViewTimes.set(id, Date.now());
    }
  }
  
  /**
   * Start view tracking timer for all visible publications
   */
  private startViewTracking(): void {
    // Clear any existing timer
    this.clearViewTracking();
    
    // Set up a timer to check view duration every second
    this.viewTimer = window.setInterval(() => {
      const now = Date.now();
      this.publicationViewTimes.forEach((startTime, id) => {
        const viewDuration = now - startTime;
        // If viewed for more than 3 seconds, mark as read
        if (viewDuration > 3000) {
          this.addToReadPublications(id);
          // Remove from tracking after marking as read
          this.publicationViewTimes.delete(id);
        }
      });
      this.requestUpdate();
    }, 1000);
  }
  

  
  /**
   * Clear all view tracking
   */
  private clearViewTracking(): void {
    if (this.viewTimer !== null) {
      window.clearInterval(this.viewTimer);
      this.viewTimer = null;
    }
    this.publicationViewTimes.clear();
  }

  /**
   * Setup attachment links to open in new tab
   */
  private setupAttachmentLinks(): void {
    // Use a longer timeout to ensure DOM is fully rendered
    setTimeout(() => {
      // Try multiple selectors to catch all attachment links
      const selectors = [
        '.publication-body .attachment[href]',
        '.publication-body a[href*=".jpg"]',
        '.publication-body a[href*=".png"]',
        '.publication-body a[href*=".jpeg"]',
        '.publication-body figure a[href]'
      ];
      
      selectors.forEach(selector => {
        const links = this.shadowRoot?.querySelectorAll(selector) as NodeListOf<HTMLAnchorElement>;
        links?.forEach(link => {
          if (link.href && (link.href.includes('.jpg') || link.href.includes('.png') || link.href.includes('.jpeg') || link.classList.contains('attachment'))) {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
          }
        });
      });
    }, 100); // Increased timeout
  }

  static styles = css`
    :host {
      --bubble-size: 4rem;
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
    
    :host([preview-mode]) .container {
      position: absolute;
      bottom: 20px;
      right: 20px;
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
    
    :host([preview-mode]) .widget {
      position: absolute;
      height: auto;
      max-height: 400px; /* Better size for preview context */
      width: 400px; /* Slightly smaller for preview */
      bottom: 50px;
      right: 20px;
    }

    header {
      padding: 16px 20px;
      background-color: var(--background-color, #4f46e5);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    #widget-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--color, #ffffff);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .external-link-icon {
      opacity: 0.8;
      transition: opacity 0.2s ease;
      flex-shrink: 0;
    }
    
    .external-link-icon:hover {
      opacity: 1;
    }
    
    .clickable-title {
      cursor: pointer;
      transition: opacity 0.2s ease;
    }
    
    .clickable-title:hover {
      opacity: 0.9;
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

    .publication-list {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      scrollbar-width: thin;
    }

    .publication-item {
      padding: 16px;
      border-radius: 8px;
      background-color: white;
      cursor: pointer;
      transition: transform 0.1s ease, box-shadow 0.1s ease;
      border: 1px solid #e5e7eb;
    }

    .publication-item.unread {
      background-color: white;
      border-left: 3px solid #3b82f6;
    }

    .publication-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .publication-top {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-bottom: 8px;
    }

    .publication-header {
      margin-bottom: 8px;
    }

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #111827;
    }

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #111827;
    }


    .publication-date {
      font-size: 12px;
      color: #6b7280;
    }

    .publication-body {
      margin: 0 0 12px 0;
      font-size: 14px;
      line-height: 1.5;
      color: #374151;
      white-space: pre-line;
    }
    
    .publication-image {
      margin: 0 0 12px 0;
      width: 100%;
      max-height: 200px;
      border-radius: 6px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f9fafb;
    }
    
    .publication-image img {
      width: 100%;
      height: auto;
      max-height: 200px;
      object-fit: cover;
      object-position: center;
      display: block;
      transition: transform 0.3s ease;
    }
    
    /* Styles for Trix attachment galleries and figures */
    .publication-body .attachment-gallery {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 12px 0;
    }
    
    .publication-body .attachment-gallery figure {
      flex: 1;
      min-width: 0;
      margin: 0;
    }
    
    .publication-body .attachment-gallery--3 figure {
      flex-basis: calc(33.333% - 6px);
    }
    
    .publication-body .attachment {
      display: block;
      width: 100%;
    }
    
    .publication-body .attachment[href] {
      cursor: pointer;
    }
    
    /* Style regular links in publication content */
    .publication-body a:not(.attachment) {
      color: #2563eb;
      text-decoration: underline;
    }
    
    .publication-body a:not(.attachment):hover {
      color: #1d4ed8;
    }
    
    .publication-body .attachment img {
      width: 100%;
      height: auto;
      max-height: 150px;
      object-fit: cover;
      object-position: center;
      border-radius: 4px;
      display: block;
    }
    
    .publication-body .attachment__caption {
      display: none;
    }
    
    /* Handle standalone figures (not in galleries) */
    .publication-body figure:not(.attachment-gallery figure) {
      margin: 16px 0;
      text-align: center;
    }
    
    .publication-body figure:not(.attachment-gallery figure) .attachment {
      display: inline-block;
      max-width: 100%;
    }
    
    .publication-body figure:not(.attachment-gallery figure) .attachment img {
      max-width: 100%;
      height: auto;
      max-height: 200px;
      object-fit: contain;
      object-position: center;
      border-radius: 4px;
      display: block;
      margin: 0 auto;
    }
    
    .publication-body figure:not(.attachment-gallery figure) .attachment__caption {
      display: none;
    }
    
    /* Handle single images in content */
    .publication-body img:not(.attachment img) {
      max-width: 100%;
      height: auto;
      max-height: 200px;
      object-fit: cover;
      border-radius: 4px;
      display: block;
      margin: 8px auto;
    }
    
    .publication-item:hover .publication-image img {
      transform: scale(1.02);
    }
    
    .publication-content {
      position: relative;
    }
    
    .read-more-btn {
      background: none;
      border: none;
      color: #4f46e5;
      font-size: 14px;
      font-weight: 500;
      padding: 0;
      cursor: pointer;
      margin-top: 4px;
      text-decoration: underline;
      transition: color 0.2s ease;
    }
    
    .read-more-btn:hover {
      color: #4338ca;
    }
    
    .publication-item {
      transition: all 0.3s ease;
    }
    
    .publication-item.expanded {
      padding-bottom: 24px;
    }

    .publication-labels {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
    }

    .label {
      font-size: 11px;
      font-weight: 500;
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    /* Different colors for different label types */
    .label:nth-child(1) {
      background-color: #dbeafe;
      color: #1e40af;
    }

    .label:nth-child(2) {
      background-color: #dcfce7;
      color: #166534;
    }

    .label:nth-child(3) {
      background-color: #fef3c7;
      color: #92400e;
    }

    .label:nth-child(4) {
      background-color: #fce7f3;
      color: #be185d;
    }

    .label:nth-child(n+5) {
      background-color: #f3f4f6;
      color: #374151;
    }

    .empty {
      text-align: center;
      color: #6b7280;
      font-size: 14px;
      padding: 24px;
    }
    
    .widget-footer {
      padding: 12px 16px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      font-size: 12px;
    }
    
    .supanotice-link {
      color: #6b7280;
      text-decoration: none;
      transition: color 0.2s ease;
      font-weight: 500;
    }
    
    .supanotice-link:hover {
      color: #4f46e5;
    }

    /* Blockquote styling */
    .publication-body blockquote {
      margin: 16px 0;
      padding: 12px 16px;
      border-left: 4px solid #e5e7eb;
      background-color: #f9fafb;
      font-style: italic;
      color: #6b7280;
      border-radius: 0 4px 4px 0;
    }
    
    .publication-body blockquote p {
      margin: 0;
      font-size: 14px;
      line-height: 1.5;
    }
    
    .publication-body blockquote p:not(:last-child) {
      margin-bottom: 8px;
    }
    
    /* Code block styling */
    .publication-body pre {
      margin: 16px 0;
      padding: 16px;
      background-color: #1e293b;
      color: #e2e8f0;
      border-radius: 8px;
      overflow-x: auto;
      font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.5;
      border: 1px solid #334155;
    }
    
    .publication-body pre code {
      background: none;
      padding: 0;
      border-radius: 0;
      font-size: inherit;
      color: inherit;
    }
    
    /* Inline code styling */
    .publication-body code {
      background-color: #f1f5f9;
      color: #475569;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
      font-size: 13px;
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
