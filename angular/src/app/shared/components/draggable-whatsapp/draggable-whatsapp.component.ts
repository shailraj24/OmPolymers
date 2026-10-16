import { Component, Input, OnInit, OnDestroy, HostListener, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-draggable-whatsapp',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="isBrowser"
      class="fixed z-50 select-none transition-transform duration-75"
      [class.cursor-grabbing]="isDragging()"
      [class.scale-105]="isDragging()"
      [class.cursor-grab]="!isDragging()"
      [style.left.px]="position().x"
      [style.top.px]="position().y"
      [style.touchAction]="'none'"
      (pointerdown)="onPointerDown($event)"
      (pointermove)="onPointerMove($event)"
      (pointerup)="onPointerUp($event)"
      (pointercancel)="onPointerUp($event)"
      role="button"
      tabindex="0"
      [attr.aria-label]="ariaLabel"
      [title]="tooltipText"
    >
      <div class="relative group">
        <div class="p-3.5 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-full shadow-2xl flex items-center justify-center border-2 border-emerald-300/40 ring-4 ring-emerald-500/20 transition-all hover:scale-105 active:scale-95">
          <!-- WhatsApp Icon SVG -->
          <svg class="w-6 h-6 shrink-0 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          <span class="absolute -top-1 -right-1 w-3 h-3 bg-emerald-300 rounded-full border-2 border-slate-900 animate-pulse"></span>
        </div>
        <!-- Tooltip -->
        <div class="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center px-2.5 py-1 bg-slate-900 text-slate-200 text-[11px] font-medium rounded-lg shadow-xl border border-slate-700 whitespace-nowrap pointer-events-none">
          <span>WhatsApp Chat <span class="text-slate-400 text-[10px]">(Drag to reposition)</span></span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class DraggableWhatsAppComponent implements OnInit, OnDestroy {
  @Input() whatsAppLink = 'https://wa.me/919876543210?text=Hello%20OM%20Polymer%2C%20I%20have%20an%20inquiry.';
  @Input() ariaLabel = 'Contact OM Polymer on WhatsApp - Drag to reposition';
  @Input() tooltipText = 'Chat with OM Polymer on WhatsApp (Drag anywhere to reposition)';

  isBrowser = typeof window !== 'undefined';
  isDragging = signal<boolean>(false);
  position = signal<{ x: number; y: number }>({ x: 0, y: 0 });

  private dragInfo: {
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    moved: boolean;
  } | null = null;

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.initPosition();
  }

  ngOnDestroy(): void {}

  private initPosition(): void {
    const saved = localStorage.getItem('om_whatsapp_pos');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          const boundedX = Math.max(16, Math.min(window.innerWidth - 68, parsed.x));
          const boundedY = Math.max(16, Math.min(window.innerHeight - 68, parsed.y));
          this.position.set({ x: boundedX, y: boundedY });
          return;
        }
      } catch {}
    }

    // Default to bottom-right
    const defaultX = Math.max(16, window.innerWidth - 84);
    const defaultY = Math.max(16, window.innerHeight - 88);
    this.position.set({ x: defaultX, y: defaultY });
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!this.isBrowser) return;
    const current = this.position();
    const boundedX = Math.max(16, Math.min(window.innerWidth - 68, current.x));
    const boundedY = Math.max(16, Math.min(window.innerHeight - 68, current.y));
    this.position.set({ x: boundedX, y: boundedY });
  }

  onPointerDown(e: PointerEvent): void {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const target = e.currentTarget as HTMLElement;
    try {
      target.setPointerCapture(e.pointerId);
    } catch {}

    const cur = this.position();
    this.dragInfo = {
      startX: e.clientX,
      startY: e.clientY,
      origX: cur.x,
      origY: cur.y,
      moved: false
    };
    this.isDragging.set(true);
  }

  onPointerMove(e: PointerEvent): void {
    if (!this.dragInfo) return;
    const deltaX = e.clientX - this.dragInfo.startX;
    const deltaY = e.clientY - this.dragInfo.startY;

    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      this.dragInfo.moved = true;
    }

    const boundedX = Math.max(16, Math.min(window.innerWidth - 68, this.dragInfo.origX + deltaX));
    const boundedY = Math.max(16, Math.min(window.innerHeight - 68, this.dragInfo.origY + deltaY));
    this.position.set({ x: boundedX, y: boundedY });
  }

  onPointerUp(e: PointerEvent): void {
    if (!this.dragInfo) return;
    const moved = this.dragInfo.moved;
    const target = e.currentTarget as HTMLElement;
    try {
      target.releasePointerCapture(e.pointerId);
    } catch {}

    this.dragInfo = null;
    this.isDragging.set(false);

    if (moved) {
      try {
        localStorage.setItem('om_whatsapp_pos', JSON.stringify(this.position()));
      } catch {}
    } else {
      window.open(this.whatsAppLink, '_blank', 'noopener,noreferrer');
    }
  }
}
