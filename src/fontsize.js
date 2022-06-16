var fontSize = {};
fontSize.defaultValues = [
    {
        text: '55%',
        value: '55%',
        vw: '0.5vw',
        px: '10px',
    },
    {
        text: '60%',
        value: '60%',
        vw: '0.6vw',
        px: '12px',
    },
    {
        text: '65%',
        value: '65%',
        vw: '0.7vw',
        px: '14px',
    },
    {
        text: '70%',
        value: '70%',
        vw: '0.8vw',
        px: '15px',
    },
    {
        text: '80%',
        value: '80%',
        vw: '1vw',
        px: '19px',
    },
    {
        text: '90%',
        value: '90%',
        vw: '1.2vw',
        px: '23px',
    },
    {
        text: '100%',
        value: '100%',
        vw: '1.4vw',
        px: '27px',
    },
    {
        text: '110%',
        value: '110%',
        vw: '1.6vw',
        px: '31px',
    },
    {
        text: '120%',
        value: '120%',
        vw: '1.8vw',
        px: '35px',
    },
    {
        text: '130%',
        value: '130%',
        vw: '2vw',
        px: '38px',
    },
    {
        text: '140%',
        value: '140%',
        vw: '2.2vw',
        px: '42px',
    },
    {
        text: '150%',
        value: '150%',
        vw: '2.4vw',
        px: '46px',
    },
    {
        text: '160%',
        value: '160%',
        vw: '2.6vw',
        px: '50px',
    },
    {
        text: '180%',
        value: '180%',
        vw: '3vw',
        px: '58px',
    },
    {
        text: '200%',
        value: '200%',
        vw: '3.4vw',
        px: '65px',
    },
    {
        text: '220%',
        value: '220%',
        vw: '3.8vw',
        px: '73px',
    },
    {
        text: '230%',
        value: '230%',
        vw: '4vw',
        px: '77px',
    },
];
fontSize.fontSizeChange = function (isVw, text, mobile) {
    var r;
    fontSize.defaultValues.forEach(function (val) {
        if (val.text === text) {
            if (isVw) {
                r = val.vw;
            }
            else {
                r = val.px;
            }
            if (mobile === "mobile") {
                r = val.text;
            }
        }
    });
    return r;
};
fontSize.reportVwToPx = function (vw) {
    var rText = "15px";
    fontSize.defaultValues.forEach(function (val) {
        if (val.vw === vw) {
            rText = val.px;
        }
    });
    return rText;
};
fontSize.mobileVwtoText = function (vw) {
    var rText = "100%";
    fontSize.defaultValues.forEach(function (val) {
        if (val.vw === vw) {
            rText = val.text;
        }
    });
    return rText;
};
fontSize.getFontPx = function (font) {
    var unit = font.charAt(font.length - 1);
    var num = parseFloat(font);
    var ROOT_FONT_SIZE = 13;
    var LINE_HEIGHT = 1.5;
    var rfont;
    if (unit === "%") {
        rfont = LINE_HEIGHT * ROOT_FONT_SIZE * num / 100;
    }
    else if (unit === "w") {
        var vwTopxScale = window.innerWidth / 100;
        rfont = LINE_HEIGHT * num * vwTopxScale;
    }
    else {
        rfont = LINE_HEIGHT * num;
    }
    rfont = Math.round(rfont);
    if (rfont < 19) {
        rfont = 19;
    }
    return rfont;
};
fontSize.getGaugeFontPx = function (font) {
    var unit = font.charAt(font.length - 1);
    var rfont;
    fontSize.defaultValues.forEach(function (val) {
        if (unit === "w") {
            if (val.vw === font) {
                rfont = val.px;
            }
        }
        else if (unit === "%") {
            if (val.text === font) {
                rfont = val.px;
            }
        }
        else {
            rfont = val.vw;
        }
    });
    rfont = parseFloat(rfont);
    return rfont;
};
fontSize.fontSizeCompatibility = function (isVw, value) {
    var r = "70%";
    fontSize.defaultValues.forEach(function (val) {
        if (isVw) {
            if (val.vw === value) {
                r = val.value;
            }
        }
        else {
            if (val.px === value) {
                r = val.value;
            }
            else if (val.text === value) {
                r = val.value;
            }
        }
    });
    return r;
};
exports.default = fontSize;
//# sourceMappingURL=fontsize.js.map