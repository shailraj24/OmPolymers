import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APP_CONSTANTS } from '../../../core/constants/app.constant';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-maintenance-ref',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative min-h-[600px] flex items-center justify-center p-6 sm:p-12 overflow-hidden text-center">
      
      <!-- Ambient Circles -->
      <div class="absolute rounded-full pointer-events-none w-[350px] h-[350px] bg-blue-100 dark:bg-blue-900/10 -top-[120px] -left-[100px] animate-pulse"></div>
      <div class="absolute rounded-full pointer-events-none w-[280px] h-[280px] bg-indigo-100 dark:bg-indigo-900/10 -bottom-[100px] -right-[80px] animate-pulse"></div>

      <div class="max-w-2xl relative z-10 flex flex-col items-center">
        
        <!-- Illustration -->
        <div class="w-[280px] h-[200px] mx-auto mb-4 relative">
          <div class="absolute w-[190px] h-[125px] bg-[#172554] rounded-xl left-[45px] top-[25px] p-2.5 shadow-2xl">
            <div class="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-md flex flex-col items-center justify-center gap-2">
              <div class="text-4xl anim-gear">⚙️</div>
              <div class="w-20 h-1.5 bg-blue-200 rounded-full overflow-hidden anim-loading-bar"></div>
            </div>
          </div>
          <div class="absolute w-[220px] h-[10px] bg-slate-500 rounded-b-[18px] bottom-[48px] left-[30px]"></div>

          <div class="absolute right-[5px] bottom-[40px]">
            <div class="w-9 h-9 rounded-full bg-[#f8c9a0] mx-auto relative">
              <div class="absolute w-[46px] h-[18px] bg-[#fbbf24] rounded-t-[24px] rounded-b-[4px] -top-[6px] -left-[5px] shadow-sm"></div>
            </div>
            <div class="w-12 h-14 bg-blue-600 rounded-t-xl rounded-b-md mt-1 mx-auto"></div>
            <div class="absolute text-3xl -right-[30px] top-[45px] -rotate-[30deg]">🔧</div>
          </div>
        </div>

        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-4 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          MAINTENANCE REFERENCE VIEW
        </div>

        <h1 class="text-4xl font-extrabold tracking-tight mb-3">
          Site <span class="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Under Maintenance</span>
        </h1>

        <p class="text-xs sm:text-sm text-slate-500 max-w-lg mb-8 leading-relaxed">
          We're currently working behind the scenes to improve our website and provide you with a better experience. We'll be back online shortly.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          <a [href]="phoneTel" class="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all flex flex-col items-center">
            <span class="text-2xl mb-1">📞</span>
            <strong class="text-xs">Phone Support</strong>
            <span class="text-[11px] font-mono text-slate-500">{{ phone }}</span>
          </a>
          <a [href]="emailMailto" class="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all flex flex-col items-center">
            <span class="text-2xl mb-1">✉️</span>
            <strong class="text-xs">Email Us</strong>
            <span class="text-[11px] text-slate-500">{{ email }}</span>
          </a>
          <a [href]="mapsUrl" target="_blank" rel="noopener noreferrer" class="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all flex flex-col items-center">
            <span class="text-2xl mb-1">🏢</span>
            <strong class="text-xs">Head Office</strong>
            <span class="text-[10px] text-slate-500">Vegdi GIDC, Dhoraji</span>
          </a>
        </div>
      </div>
    </div>
  `
})
export class MaintenanceRefComponent {
  theme = inject(ThemeService);
  phone = APP_CONSTANTS.DEFAULT_CONTACT.PHONE;
  phoneTel = APP_CONSTANTS.DEFAULT_CONTACT.PHONE_TEL;
  email = APP_CONSTANTS.DEFAULT_CONTACT.EMAIL;
  emailMailto = APP_CONSTANTS.DEFAULT_CONTACT.EMAIL_MAILTO;
  mapsUrl = APP_CONSTANTS.DEFAULT_CONTACT.MAPS_URL;
}
