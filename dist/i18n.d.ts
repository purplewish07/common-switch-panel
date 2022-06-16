declare const setI18n: (obj: any, label: string, value: any, lang: string) => void;
declare const getI18n: (obj: any, label: string, lang: string) => any;
declare const initI18n: (obj: any, lang: string, depth?: number) => void;
declare const initAttrI18n: (obj: any, label: string, lang: string) => void;
declare const initAttrArrayI18n: (obj: any, labels: string[], lang: string) => void;
export { setI18n, getI18n, initI18n, initAttrI18n, initAttrArrayI18n };
