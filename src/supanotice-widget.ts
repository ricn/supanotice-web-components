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
  projectName?: string | null;
  projectId?: string | null;
}

interface WidgetApiResponse {
  title: string;
  color: string;
  background_color: string;
  publications: PublicationItem[];
  newspage_url?: string | null;
  project_name?: string | null;
  project_id?: string | null;
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
   * The API endpoint URL for fetching widget configuration.
   * Defaults to production URL but can be overridden for local development.
   */
  @property({ type: String, attribute: 'api-endpoint' })
  apiEndpoint = 'https://supanotice.com';

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
    this.updateViewportHeight();
    
    // Update viewport height on resize and orientation change
    window.addEventListener('resize', this.updateViewportHeight.bind(this));
    window.addEventListener('orientationchange', this.updateViewportHeight.bind(this));
  }
  
  /**
   * Updates the CSS variable for viewport height to handle mobile browsers
   * with dynamic toolbars like Safari
   */
  private updateViewportHeight() {
    // Get the actual viewport height
    const vh = window.innerHeight * 0.01;
    // Set the value in the --vh custom property
    this.style.setProperty('--vh', `${vh}px`);
  }

  /**
   * Safely build absolute API URLs from the configured apiEndpoint
   */
  private buildApiUrl(path: string): string {
    const base = (this.apiEndpoint || '').replace(/\/$/, '');
    return `${base}${path}`;
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
      const response = await fetch(this.buildApiUrl(`/api/v1/widgets/${this.widgetId}`));
      
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
        newspage_url: data.newspage_url || this.widgetSettings.newspage_url,
        projectName: data.project_name || this.widgetSettings.projectName,
        projectId: data.project_id || this.widgetSettings.projectId
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

  private openSubscribeModal() {
    this.subscribeEmail = '';
    this.subscribeError = null;
    this.subscribeSuccess = false;
    this.showSubscribeModal = true;
  }

  private closeSubscribeModal() {
    this.showSubscribeModal = false;
    this.subscribeLoading = false;
  }

  private isValidEmail(email: string): boolean {
    // Simple email regex for basic validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private async submitSubscription(e?: Event) {
    e?.preventDefault();
    this.subscribeError = null;
    this.subscribeSuccess = false;
    this.subscribeMessage = null;
    const email = (this.subscribeEmail || '').trim();
    if (!this.isValidEmail(email)) {
      this.subscribeError = 'Please enter a valid email address.';
      return;
    }
    this.subscribeLoading = true;
    try {
      const url = this.widgetSettings.projectId
        ? this.buildApiUrl(`/api/v1/projects/${this.widgetSettings.projectId}/subscribers`)
        : this.buildApiUrl(`/api/v1/widgets/${this.widgetId}/subscriptions`);

      console.debug('Supanotice subscription request', {
        url,
        projectId: this.widgetSettings.projectId,
        widgetId: this.widgetId
      });

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      let payload: any = null;
      try { payload = await res.json(); } catch { /* ignore */ }

      if (res.status === 201) {
        this.subscribeSuccess = true;
        this.subscribeMessage = payload?.message || 'Subscription successful. Please check your email to confirm your subscription.';
        return;
      }

      if (res.status === 409) {
        this.subscribeError = payload?.error || 'Email address is already subscribed to this project';
        return;
      }

      if (res.status === 422) {
        const emailErrors = payload?.details?.email as string[] | undefined;
        this.subscribeError = emailErrors && emailErrors.length > 0 ? emailErrors[0] : (payload?.error || 'Validation failed');
        return;
      }

      if (res.status === 404) {
        this.subscribeError = payload?.error || 'Project not found';
        return;
      }

      if (res.status === 400) {
        this.subscribeError = payload?.error || 'Missing required parameters: project_id and email';
        return;
      }

      // Fallback for any other error status
      this.subscribeError = payload?.error || 'Unable to subscribe right now. Please try again later.';
    } catch (err) {
      console.error('Supanotice subscription network error', err);
      this.subscribeError = err instanceof TypeError
        ? 'Network error (possibly CORS or connectivity). Please verify your API endpoint and CORS configuration.'
        : (err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      this.subscribeLoading = false;
    }
  }

  private renderSubscribeModal() {
    const title = 'Subscribe to Updates';
    const projectName = this.widgetSettings.projectName || this.widgetSettings.title;
    const subtitle = `Get notified when ${projectName} publishes new updates.`;
    const canSubmit = this.isValidEmail(this.subscribeEmail) && !this.subscribeLoading;
    return html`
      <div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="subscribe-title" @click=${() => this.closeSubscribeModal()}>
        <div class="modal-card" @click=${(e: Event) => e.stopPropagation()}>
          <button class="modal-close" @click=${() => this.closeSubscribeModal()} aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4b5563" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <h3 id="subscribe-title" class="modal-title">${title}</h3>
          <p class="modal-subtitle">${subtitle}</p>

          ${this.subscribeSuccess ? html`
            <div class="success-box">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>${this.subscribeMessage || "Thanks! You're subscribed."}</span>
            </div>
          ` : html`
            <form class="subscribe-form" @submit=${(e: Event) => this.submitSubscription(e)}>
              <label class="input-label" for="subscribe-email">Email address</label>
              <input
                id="subscribe-email"
                type="email"
                class="email-input"
                placeholder="your@email.com"
                .value=${this.subscribeEmail}
                @input=${(e: Event) => {
                  const target = e.target as HTMLInputElement;
                  this.subscribeEmail = target.value;
                }}
                required
                autocomplete="email"
                ?disabled=${this.subscribeLoading}
              />
              ${this.subscribeError ? html`<div class="error-text">${this.subscribeError}</div>` : ''}

              <p class="legal-text">
                By clicking subscribe, you accept our
                <a href="https://supanotice.com/privacy" target="_blank" rel="noopener noreferrer">privacy policy</a>
                and
                <a href="https://supanotice.com/terms" target="_blank" rel="noopener noreferrer">terms and conditions</a>.
              </p>

              <div class="modal-actions">
                <button type="button" class="btn btn-secondary" @click=${() => this.closeSubscribeModal()} ?disabled=${this.subscribeLoading}>Cancel</button>
                <button type="submit" class="btn btn-primary" ?disabled=${!canSubmit}>
                  ${this.subscribeLoading ? html`<span class="btn-spinner"></span> Subscribing...` : 'Subscribe'}
                </button>
              </div>
            </form>
          `}
        </div>
      </div>
    `;
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

  /**
   * Subscribe modal UI state
   */
  @state()
  private showSubscribeModal = false;

  @state()
  private subscribeEmail: string = '';

  @state()
  private subscribeLoading = false;

  @state()
  private subscribeError: string | null = null;

  @state()
  private subscribeSuccess = false;

  @state()
  private subscribeMessage: string | null = null;

  render() {
    return html`
      <div class="container" style="--background-color: ${this.widgetSettings.backgroundColor}; --color: ${this.widgetSettings.color};">
        ${this.errorMessage ? html`<div class="error">${this.errorMessage}</div>` : ''}
        ${this.isOpen ? this.renderWidget() : ''}
        <button 
          class="bubble ${this.isOpen ? 'open' : ''}" 
          @click=${this._toggleWidget}
          aria-label="Notifications"
          aria-expanded=${this.isOpen}
        >
          ${this.unreadCount > 0 ? html`<span class="badge">${this.unreadCount}</span>` : ''}
          ${this.isLoading 
              ? html`<div class="spinner"></div>`
              : this.isOpen 
                ? html`
                  <!-- X icon when open -->
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10" fill="none"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
              ` 
              : html`
                <!-- Beautiful bell notification icon when closed -->
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="notification-bell">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" class="bell-clapper"></path>
                  <circle cx="12" cy="3" r="1" class="bell-top"></circle>
                  <path class="bell-wave bell-wave-1" d="M2 8c0 0 4-1 10-1s10 1 10 1" stroke-opacity="0.3"></path>
                  <path class="bell-wave bell-wave-2" d="M4 6c0 0 3.5-0.5 8-0.5s8 0.5 8 0.5" stroke-opacity="0.6"></path>
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
          <div class="header-actions">
            <button class="subscribe-header-btn" @click=${() => this.openSubscribeModal()} aria-label="Subscribe to updates">
              <svg class="icon-mail" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="6" width="18" height="14" rx="2" ry="2"></rect>
                <polyline points="3 7 12 13 21 7"></polyline>
              </svg>
              <span>Subscribe</span>
            </button>
            <button class="close-button" @click=${() => this.closeWidget()} aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
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
          Powered by <a href="https://supanotice.com" target="_blank" rel="noopener noreferrer" class="supanotice-link">Supanotice</a>
        </footer>
        ${this.showSubscribeModal ? this.renderSubscribeModal() : ''}
      </div>
    `;
  }

  private renderPublication(publication: PublicationItem) {
    const isExpanded = this.expandedPublications.has(publication.id);
    const hasFullBody = !!publication.fullBody;
    const bodyText = isExpanded && hasFullBody ? publication.fullBody : publication.body;
    const isRead = this.isPublicationRead(publication.id);
    const formattedDate = this._formatDate(publication.published_at);
    
    // We will track view time on mouse enter or touch instead of on render
    
    return html`
      <div class="publication-item ${isRead ? 'read' : 'unread'} ${isExpanded ? 'expanded' : ''}"
           @mouseenter=${() => this.startTrackingPublication(publication.id)}
           @touchstart=${() => this.startTrackingPublication(publication.id)}>
        ${formattedDate ? html`<div class="publication-top">
          <span class="publication-date">${formattedDate}</span>
        </div>` : ''}
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
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = date.getFullYear() !== now.getFullYear()
      ? { month: 'short', day: 'numeric', year: 'numeric' }
      : { month: 'short', day: 'numeric' };
    return new Intl.DateTimeFormat(undefined, options).format(date);
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
      --vh: 1vh; /* Dynamic viewport height unit */
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
    
    /* Bell notification animation styles */
    .notification-bell {
      animation: bell-pulse 2s infinite;
      transform-origin: center top;
    }
    
    @keyframes bell-pulse {
      0% { transform: scale(1); }
      5% { transform: scale(1.1); }
      10% { transform: scale(1); }
      15% { transform: scale(1.05); }
      20% { transform: scale(1); }
      100% { transform: scale(1); }
    }
    
    .bell-wave {
      opacity: 0;
      animation: wave-fade 4s infinite;
    }
    
    .bell-wave-1 {
      animation-delay: 0.5s;
    }
    
    .bell-wave-2 {
      animation-delay: 1s;
    }
    
    @keyframes wave-fade {
      0% { opacity: 0; transform: translateY(0); }
      20% { opacity: 0.8; transform: translateY(-2px); }
      40% { opacity: 0; transform: translateY(-4px); }
      100% { opacity: 0; transform: translateY(-4px); }
    }
    
    .bubble:hover .notification-bell {
      animation: bell-ring 0.5s ease;
    }
    
    @keyframes bell-ring {
      0% { transform: rotate(0); }
      20% { transform: rotate(15deg); }
      40% { transform: rotate(-15deg); }
      60% { transform: rotate(7deg); }
      80% { transform: rotate(-7deg); }
      100% { transform: rotate(0); }
    }

    .bubble.open {
      filter: brightness(0.75);
    }
    
    /* Loading spinner animation */
    @keyframes spinner {
      to {transform: rotate(360deg);}
    }
    
    .spinner {
      width: 24px;
      height: 24px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spinner 0.8s linear infinite;
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
      height: calc(var(--vh, 1vh) * 100 - 100px);
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

    .header-actions {
       display: flex;
       align-items: center;
       gap: 8px;
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

    .subscribe-header-btn {
      pointer-events: auto;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.25);
      color: #ffffff;
      padding: 6px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      line-height: 1; /* ensure consistent vertical centering */
      cursor: pointer;
      transition: background-color 0.2s ease, transform 0.1s ease;
    }

    .subscribe-header-btn:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-1px);
    }

    .subscribe-header-btn:active {
      transform: translateY(0);
    }
    
    /* Center and size the email icon in the subscribe button */
    .subscribe-header-btn .icon-mail {
      width: 16px;
      height: 16px;
      display: block;
      flex-shrink: 0;
      margin-top: -2px; /* align exactly centered */
      align-self: center;
      transform: translateY(0.5px); /* micro-tweak for optical centering */
    }

    /* Ensure text aligns with icon vertically */
    .subscribe-header-btn span {
      display: inline-block;
      line-height: 16px; /* match icon height for perfect centering */
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
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      border-radius: 9999px; /* pill */
      font-size: 12px;
      font-weight: 500;
      line-height: 1;
      color: #374151;
      background-color: #f3f4f6; /* neutral badge */
      border: 1px solid #e5e7eb;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
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
      color: #3b82f6;
      text-decoration: none;
      transition: color 0.2s ease;
      font-weight: 500;
    }
    
    .supanotice-link:hover {
      color: #1d4ed8;
    }

    /* Subscribe modal */
    .modal-overlay {
      position: absolute;
      inset: 0;
      background: rgba(17, 24, 39, 0.6); /* slate-900/60 */
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      z-index: 20;
    }

    .modal-card {
      position: relative;
      width: 100%;
      max-width: 520px;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
      border: 1px solid #e5e7eb;
      padding: 20px 20px 16px 20px;
      color: #111827;
    }

    .modal-close {
      position: absolute;
      top: 12px;
      right: 12px;
      background: transparent;
      border: none;
      border-radius: 6px;
      padding: 4px;
      cursor: pointer;
    }

    .modal-close:hover {
      background: #f3f4f6;
    }

    .modal-title {
      margin: 4px 0 6px 0;
      font-size: 20px;
      font-weight: 700;
      color: #111827;
    }

    .modal-subtitle {
      margin: 0 0 16px 0;
      color: #4b5563;
      font-size: 14px;
    }

    .subscribe-form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .input-label {
      font-size: 13px;
      font-weight: 600;
      color: #111827;
    }

    .email-input {
      width: 100%;
      padding: 10px 12px;
      border-radius: 10px;
      border: 1px solid #e5e7eb;
      background: #ffffff;
      font-size: 14px;
      color: #111827;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      box-sizing: border-box;
    }

    .email-input::placeholder {
      color: #9ca3af;
    }

    .email-input:focus {
      border-color: var(--background-color, #4f46e5);
      box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.15);
    }

    .legal-text {
      margin: 2px 0 0 0;
      font-size: 12px;
      color: #6b7280;
    }

    .legal-text a {
      color: #4f46e5;
      text-decoration: underline;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 8px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 36px;
      padding: 0 14px;
      border-radius: 8px;
      border: 1px solid transparent;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, filter 0.2s ease;
    }

    .btn-secondary {
      background: #ffffff;
      color: #111827;
      border-color: #d1d5db;
    }

    .btn-secondary:hover {
      background: #f9fafb;
    }

    .btn-primary {
      background: var(--background-color, #4f46e5);
      border-color: var(--background-color, #4f46e5);
      color: #ffffff;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
    }

    .btn-primary:hover {
      background: var(--background-color, #4f46e5);
      border-color: var(--background-color, #4f46e5);
    }

    .btn[disabled] {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.5);
      border-top-color: #fff;
      border-radius: 50%;
      margin-right: 8px;
      animation: spinner 0.8s linear infinite;
    }

    .error-text {
      color: #b91c1c;
      font-size: 12px;
      margin-top: 2px;
    }

    .success-box {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      border: 1px solid #d1fae5;
      background: #ecfdf5;
      color: #065f46;
      border-radius: 8px;
      margin-top: 8px;
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
        height: calc(var(--vh, 1vh) * 100 - 100px);
        max-height: calc(var(--vh, 1vh) * 80);
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
