import React, { createContext, useContext, useMemo, useState } from 'react';

export type SupportedLocale = 'en' | 'zh';

type Messages = Record<string, string>;

const messagesByLocale: Record<SupportedLocale, Messages> = {
  en: {
    'menu.open': 'Open',
    'menu.saveFile': 'Save File',
    'menu.exportImage': 'Export Image',
    'menu.exportImage.png': 'PNG',
    'menu.exportImage.jpg': 'JPG',
    'menu.cleanBoard': 'Clear Board',
    'menu.github': 'GitHub',
    'theme.default': 'Default',
    'theme.colorful': 'Colorful',
    'theme.soft': 'Soft',
    'theme.retro': 'Retro',
    'theme.dark': 'Dark',
    'theme.starry': 'Starry',
    'clean.title': 'Clear Board',
    'clean.description': 'This will clear the entire board. Do you want to continue?',
    'clean.cancel': 'Cancel',
    'clean.confirm': 'Confirm',
    'app.menu': 'App Menu',
    'toolbar.undo': 'Undo',
    'toolbar.redo': 'Redo',
    'toolbar.duplicate': 'Duplicate',
    'toolbar.trash': 'Trash',
    'lang.selector': 'Language',
    'lang.en': 'English',
    'lang.zh': '中文',
    'zoom.fit': 'Fit',
    'zoom.fitZoom': 'Fit Zoom',
    'zoom.to100': 'Zoom to 100%',
    'zoom.zoomIn': 'Zoom In — Cmd++',
    'zoom.zoomOut': 'Zoom Out — Cmd+-',
    'link.default': 'Link',
    'extra.mermaidToDrawnix': 'Mermaid to Drawnix',
    'extra.markdownToDrawnix': 'Markdown to Drawnix',
    'ttd.mermaid.label': 'Mermaid Syntax',
    'ttd.mermaid.placeholder': 'Write Mermaid chart definition here...',
    'ttd.preview': 'Preview',
    'ttd.insert': 'Insert',
    'ttd.markdown.label': 'Markdown Syntax',
    'ttd.markdown.placeholder': 'Write Markdown text here...'
  },
  zh: {
    'menu.open': '打开',
    'menu.saveFile': '保存文件',
    'menu.exportImage': '导出图片',
    'menu.exportImage.png': '透明背景',
    'menu.exportImage.jpg': '白色背景',
    'menu.cleanBoard': '清除画布',
    'menu.github': 'GitHub',
    'theme.default': '默认',
    'theme.colorful': '缤纷',
    'theme.soft': '柔和',
    'theme.retro': '复古',
    'theme.dark': '暗夜',
    'theme.starry': '星空',
    'clean.title': '清除画布',
    'clean.description': '这将会清除整个画布。你是否要继续?',
    'clean.cancel': '取消',
    'clean.confirm': '确认',
    'app.menu': 'App Menu',
    'toolbar.undo': '撤销',
    'toolbar.redo': '重做',
    'toolbar.duplicate': '复制',
    'toolbar.trash': '删除',
    'lang.selector': '语言',
    'lang.en': 'English',
    'lang.zh': '中文',
    'zoom.fit': '自适应',
    'zoom.fitZoom': '自适应缩放',
    'zoom.to100': '缩放至 100%',
    'zoom.zoomIn': '放大 — Cmd++',
    'zoom.zoomOut': '缩小 — Cmd+-',
    'link.default': '链接',
    'extra.mermaidToDrawnix': 'Mermaid 到 Drawnix',
    'extra.markdownToDrawnix': 'Markdown 到 Drawnix',
    'ttd.mermaid.label': 'Mermaid 语法',
    'ttd.mermaid.placeholder': '在此处编写 Mermaid 图表定义...',
    'ttd.preview': '预览',
    'ttd.insert': '插入',
    'ttd.markdown.label': 'Markdown 语法',
    'ttd.markdown.placeholder': '在此处编写 Markdown 文本定义...'
  },
};

type I18nContextValue = {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const STORAGE_KEY = 'drawnix_locale';

export const I18nProvider: React.FC<{ initialLocale?: SupportedLocale; children: React.ReactNode; }> = ({ initialLocale, children }) => {
  const getInitialLocale = (): SupportedLocale => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as SupportedLocale | null;
      if (stored === 'en' || stored === 'zh') return stored;
    } catch {}
    if (initialLocale === 'en' || initialLocale === 'zh') return initialLocale;
    const nav = typeof navigator !== 'undefined' ? navigator.language || (navigator as any).userLanguage : 'en';
    return nav && nav.toLowerCase().startsWith('zh') ? 'zh' : 'en';
  };
  const [locale, setLocaleState] = useState<SupportedLocale>(getInitialLocale);
  const t = useMemo(() => {
    const dict = messagesByLocale[locale];
    return (key: string) => dict[key] ?? key;
  }, [locale]);
  const setLocale = (next: SupportedLocale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  };

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
};


