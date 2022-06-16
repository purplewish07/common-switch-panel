System.register([], function(exports_1) {
    var isEffective, isObject, isObjectOrArray, setI18n, getI18n, initI18n, initAttrI18n, initAttrArrayI18n;
    return {
        setters:[],
        execute: function() {
            isEffective = function (target) {
                return target !== undefined && target !== null;
            };
            isObject = function (target) {
                return Object.prototype.toString.call(target) === '[object Object]';
            };
            isObjectOrArray = function (target) {
                return Object.prototype.toString.call(target) === '[object Array]' || isObject(target);
            };
            setI18n = function (obj, label, value, lang) {
                if (lang && isObject(obj)) {
                    if (!obj.i18n) {
                        obj.i18n = {};
                    }
                    if (!obj.i18n[lang]) {
                        obj.i18n[lang] = {};
                    }
                    obj.i18n[lang][label] = value;
                }
            };
            getI18n = function (obj, label, lang) {
                if (lang &&
                    isObject(obj) &&
                    isObject(obj.i18n) &&
                    isObject(obj.i18n[lang]) &&
                    obj.i18n[lang].hasOwnProperty(label)) {
                    return obj.i18n[lang][label];
                }
                return isEffective(obj[label]) ? obj[label] : '';
            };
            initI18n = function (obj, lang, depth) {
                if (depth === void 0) { depth = 4; }
                if (!isObjectOrArray(obj) || !lang) {
                    return;
                }
                for (var key in obj) {
                    if (typeof obj.hasOwnProperty === 'function' && obj.hasOwnProperty(key)) {
                        if (key === 'i18n' && isObjectOrArray(obj[key])) {
                            if (isObjectOrArray(obj[key][lang])) {
                                for (var attr in obj[key][lang]) {
                                    if (obj[key][lang].hasOwnProperty(attr)) {
                                        obj[attr] = obj[key][lang][attr];
                                    }
                                }
                            }
                        }
                        else if (isObjectOrArray(obj[key])) {
                            if (depth > 0) {
                                initI18n(obj[key], lang, --depth);
                                ++depth;
                            }
                        }
                    }
                }
            };
            initAttrI18n = function (obj, label, lang) {
                if (isObject(obj) && lang) {
                    if (!obj.hasOwnProperty('i18n')) {
                        obj.i18n = {};
                        obj.i18n[lang] = {};
                        obj.i18n[lang][label] = obj[label];
                    }
                    else {
                        if (!isEffective(obj.i18n[lang])) {
                            obj.i18n[lang] = {};
                            obj.i18n[lang][label] = obj[label];
                        }
                        else {
                            if (!isEffective(obj.i18n[lang][label])) {
                                obj.i18n[lang][label] = obj[label];
                            }
                        }
                    }
                }
            };
            initAttrArrayI18n = function (obj, labels, lang) {
                if (Array.isArray(labels)) {
                    labels.forEach(function (label) {
                        initAttrI18n(obj, label, lang);
                    });
                }
            };
            exports_1("setI18n", setI18n);
            exports_1("getI18n", getI18n);
            exports_1("initI18n", initI18n);
            exports_1("initAttrI18n", initAttrI18n);
            exports_1("initAttrArrayI18n", initAttrArrayI18n);
        }
    }
});
//# sourceMappingURL=i18n.js.map