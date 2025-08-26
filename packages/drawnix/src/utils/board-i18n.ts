import type { PlaitElement } from '@plait/core';

const zhToEnMap: Record<string, string> = {
  '中心主题': 'Main Topic',
  '思维导图': 'Mindmap',
  '观点一': 'Topic 1',
  '观点二': 'Topic 2',
  '观点三': 'Topic 3',
  '观点四': 'Topic 4',
  '开始': 'Start',
  '结束': 'End',
  '过程': 'Process',
  '判断': 'Decision',
  '是': 'Yes',
  '否': 'No',
};

const enToZhMap: Record<string, string> = Object.fromEntries(
  Object.entries(zhToEnMap).map(([zh, en]) => [en, zh])
);

type Direction = 'toEn' | 'toZh';

const translateElements = (elements: PlaitElement[], direction: Direction) => {
  const dict = direction === 'toEn' ? zhToEnMap : enToZhMap;
  const visit = (el: any) => {
    if (!el || typeof el !== 'object') return;
    // mind/topic text
    if (el.data && el.data.topic && Array.isArray(el.data.topic.children)) {
      el.data.topic.children.forEach((c: any) => {
        if (typeof c.text === 'string' && dict[c.text]) {
          c.text = dict[c.text];
        }
      });
    }
    // geometry text or line texts
    if (el.text && Array.isArray(el.text.children)) {
      el.text.children.forEach((c: any) => {
        if (typeof c.text === 'string' && dict[c.text]) {
          c.text = dict[c.text];
        }
      });
    }
    if (Array.isArray(el.texts)) {
      el.texts.forEach((t: any) => {
        if (t.text && Array.isArray(t.text.children)) {
          t.text.children.forEach((c: any) => {
            if (typeof c.text === 'string' && dict[c.text]) {
              c.text = dict[c.text];
            }
          });
        }
      });
    }
    // recurse children
    if (Array.isArray(el.children)) {
      el.children.forEach(visit);
    }
  };
  elements.forEach(visit);
};

export const replaceDefaultChineseTexts = (elements: PlaitElement[]): void => {
  translateElements(elements, 'toEn');
};

export const translateBoardTexts = (
  elements: PlaitElement[],
  locale: 'en' | 'zh'
): void => {
  if (locale === 'en') {
    translateElements(elements, 'toEn');
  } else {
    translateElements(elements, 'toZh');
  }
};


