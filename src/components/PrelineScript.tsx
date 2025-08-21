'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import $ from 'jquery';
import _ from 'lodash';
import noUiSlider from 'nouislider';

import 'datatables.net';
import 'dropzone/dist/dropzone-min.js';
import * as VanillaCalendarPro from 'vanilla-calendar-pro';

// ✅ Tambahkan ini untuk perbaiki overlay
import { HSOverlay, IStaticMethods } from 'preline/preline';

// ✅ Tambahkan deklarasi global agar TypeScript tahu struktur window
declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
    HSOverlay: typeof HSOverlay;
    $hsOverlayCollection?: any;
    _: any;
    $: typeof $;
    jQuery: typeof $;
    DataTable: any;
    noUiSlider: any;
    VanillaCalendarPro: any;
  }
}

// ✅ Assign library ke window
if (typeof window !== 'undefined') {
  window._ = _;
  window.$ = $;
  window.jQuery = $;
  window.DataTable = $.fn.dataTable;
  window.noUiSlider = noUiSlider;
  window.VanillaCalendarPro = VanillaCalendarPro;

  // 🧩 Fix utama untuk error `$hsOverlayCollection`
  window.HSOverlay = HSOverlay;
}

async function loadPreline() {
  // ✅ Gunakan file build agar tidak error
  return import('preline/dist/preline.js');
}

export default function PrelineScript() {
  const path = usePathname();

  // Load script Preline satu kali
  useEffect(() => {
    (async () => {
      try {
        await loadPreline();
      } catch (err) { }
    })();
  }, []);

  // Auto-init setiap navigasi
  useEffect(() => {
    setTimeout(() => {
      try {
        window.HSStaticMethods?.autoInit?.();
      } catch (err) { }
    }, 100);
  }, [path]);

  return null;
}
