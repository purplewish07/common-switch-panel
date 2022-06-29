System.register(['angular', 'lodash', 'app/core/app_events', 'app/plugins/sdk', './fontsize', './i18n', '@grafana/data', 'app/core/config'], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var angular_1, lodash_1, app_events_1, sdk_1, fontsize_1, i18n_1, data_1, config_1;
    var commonSwitchPanelCtrl;
    return {
        setters:[
            function (angular_1_1) {
                angular_1 = angular_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (app_events_1_1) {
                app_events_1 = app_events_1_1;
            },
            function (sdk_1_1) {
                sdk_1 = sdk_1_1;
            },
            function (fontsize_1_1) {
                fontsize_1 = fontsize_1_1;
            },
            function (i18n_1_1) {
                i18n_1 = i18n_1_1;
            },
            function (data_1_1) {
                data_1 = data_1_1;
            },
            function (config_1_1) {
                config_1 = config_1_1;
            }],
        execute: function() {
            //import TemplateSrv from 'app/features/templating/template_srv';
            System.import('plugins/advantech-common-switch-panel/css/default.css' + '!css');
            sdk_1.loadPluginCss({
                dark: 'plugins/advantech-common-switch-panel/css/commondark.css',
                light: 'plugins/advantech-common-switch-panel/css/commonlight.css',
            });
            commonSwitchPanelCtrl = (function (_super) {
                __extends(commonSwitchPanelCtrl, _super);
                function commonSwitchPanelCtrl($scope, $injector, $window, $timeout) {
                    var _this = this;
                    _super.call(this, $scope, $injector);
                    this.defaults = {
                        commonVarName: '',
                        commonVarArray: [],
                        noBeyond: false,
                        mode: 'NormalVariable',
                        commonTitle: '',
                        commonFontSize: '90%',
                        commonFontColor: '',
                        commoneTitleAdjFontSize: true,
                        updataTime: '',
                        queryDate: '',
                        timeMode: 'Default TimeRange',
                        dateMode: '',
                        yearFrom: '',
                        yearTo: '',
                        trueTime: '',
                        timeRangeEnable: true,
                        tableData: '',
                        dayFromShift: 0,
                        dayFromType: '',
                        dayToType: '',
                        dayToShift: 0,
                        commonSwitchVersion: '',
                    };
                    this.normalVarOption = [];
                    this.normalVarArrayData = [];
                    this.queryDateArray = [];
                    this.modeOptions = ['Default TimeRange', 'Custome TimeRange'];
                    this.dateModeOptions = ['yyyy/MM', 'yyyy/MM/dd'];
                    this.timeShiftOption = ['hour', 'minute', 'second'];
                    this.windowObj = $window;
                    this.titleFontSizeVWList = fontsize_1.default.defaultValues;
                    this.commonSwitch = 'commonSwitch';
                    this.isPc = this.dashboard.meta.isPc;
                    if (this.dashboard.meta.isPc === undefined) {
                        this.isPc = true;
                    }
                    var varArray = this.dashboard.templating.list;
                    lodash_1.default.defaultsDeep(this.panel, this.defaults);
                    this.showFlag = false;
                    this.imageStyle = {
                        'background-image': 'url(/img/grayPhoto.svg)',
                    };
                    this.borderStyle = config_1.default.theme.type === 'light' ? {
                        'border': 'solid 1px #c5c5c5',
                    } : {
                        'border': 'solid 2px #464646',
                    };
                    this.fontColorStyle = config_1.default.theme.type === 'light' ? {
                        'color': '#323233',
                    } : {
                        'color': '#fff',
                    };
                    /* add time Range component start */
                    this.timeSrv = this.$scope.ctrl.timeSrv;
                    this.timeValue = this.timeSrv.timeRange();
                    this.timeZoneData = this.dashboard.getTimezone();
                    this.dateMath = this.timeSrv.dateMath();
                    /* add time Range component end */
                    this.customTimePickerData = {
                        customTimePickerOption: this.dashboard.timepicker.panelTimePicker,
                        customRangeHide: this.dashboard.timepicker.customRangeHide,
                        customRefreshHide: this.dashboard.timepicker.customRefreshHide,
                        customTimePickerHide: this.dashboard.timepicker.hidden,
                        dashboardTimeRangeFlag: true,
                        customTimeRangePicker: this.dashboard.timepicker.customTimeRange,
                    };
                    /* add time Range component end */
                    for (var i = 0; i < varArray.length; i++) {
                        this.normalVarOption.push({ value: varArray[i].name, text: varArray[i].name });
                    }
                    if (this.scope.$$listeners.isWisePaas) {
                        this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
                        this.events.on('render', this.onRender.bind(this));
                        this.events.on('init-panel-actions', this.onInitPanelActions.bind(this));
                        this.events.on('data-received', this.onDataReceived.bind(this));
                    }
                    app_events_1.default.on("variable-will-remove", function (data) {
                        if (data === _this.panel.id) {
                            app_events_1.default.emit("this-variable-panel-remove", _this.panel.commonVarArray);
                        }
                    });
                    app_events_1.default.on('notic-varibale-panel', function (data) {
                        var varArray = _this.dashboard.templating.list;
                        var tempVar = lodash_1.default.cloneDeep(_this.panel.commonVarArray);
                        var flag;
                        for (var i = 0; i < tempVar.length; i++) {
                            flag = false;
                            for (var k = 0; k < varArray.length; k++) {
                                if (varArray[k].name === tempVar[i].name) {
                                    flag = true;
                                }
                            }
                            if (!flag) {
                                _this.panel.commonVarArray.splice(i, 1);
                                app_events_1.default.emit("var-has-change", { data: name, way: 'delete' });
                            }
                        }
                        _this.onRender();
                    });
                    this.titleInvalid = false;
                    this.renderFlag = false;
                    /* custome time range */
                    this.initFun();
                    if (this.panel.timeMode && this.panel.timeMode === "Default TimeRange") {
                        this.panel.trueTime = '';
                    }
                    // console.log(this.timeValue.from);
                    // console.log(this.timeValue.from.toISOString().replace(/T.*/g,'').replace(/-/g,'/'));
                    // console.log('construction',this.panel.trueTime);
                    this.panel.trueTime = this.timeValue.from.toISOString().replace(/T.*/g, '').replace(/-/g, '/');
                    // console.log(this.panel.trueTime);
                    this.firstload = true;
                    this.handleYearChanged();
                    this.tableTypeFlag = false;
                    this.handleTrueTimeChanged();
                    this.refreshTimeFlag = false;
                    this.firstload = false;
                    var oldVersion = this.panel.commonSwitchVersion;
                    this.panel.commonSwitchVersion = 1;
                    if (this.panel.commonSwitchVersion !== oldVersion) {
                        if (this.panel.commonFontColor && this.panel.commonFontColor === '#ffffff') {
                            delete this.panel.commonFontColor;
                        }
                    }
                }
                commonSwitchPanelCtrl.prototype.onInitEditMode = function () {
                    this.addEditorTab('Options', 'public/plugins/advantech-common-switch-panel/partials/editor.html', 2);
                };
                commonSwitchPanelCtrl.prototype.onInitPanelActions = function () {
                    this.normalVarOption = [];
                    var varArray = this.dashboard.templating.list;
                    for (var i = 0; i < varArray.length; i++) {
                        this.normalVarOption.push({ value: varArray[i].name, text: varArray[i].name });
                    }
                };
                commonSwitchPanelCtrl.prototype.addVarItem = function () {
                    var currentArray = this.panel.commonVarArray;
                    var currentValue = this.panel.commonVarName;
                    var flag = false;
                    if (currentArray.length > 0) {
                        for (var i = 0; i < currentArray.length; i++) {
                            if (currentArray[i].name === currentValue) {
                                flag = true;
                                break;
                            }
                        }
                    }
                    if (!flag) {
                        this.panel.commonVarArray.push({ name: currentValue });
                        app_events_1.default.emit("var-has-change", { data: currentValue, way: 'add' });
                    }
                    this.onRender();
                };
                commonSwitchPanelCtrl.prototype.removeVarItem = function (index, name) {
                    this.panel.commonVarArray.splice(index, 1);
                    app_events_1.default.emit("var-has-change", { data: name, way: 'delete' });
                    this.onRender();
                };
                commonSwitchPanelCtrl.prototype.variableUpdated = function (variable, emitChangeEvents) {
                    variable.variableSrv.variableUpdated(variable, emitChangeEvents);
                    this.onRender();
                };
                commonSwitchPanelCtrl.prototype.getFontSizeVwOrPx = function (t) {
                    var _this = this;
                    var vwpx;
                    fontsize_1.default.defaultValues.forEach(function (font) {
                        if (font.text === t) {
                            if (_this.panel.commoneTitleAdjFontSize) {
                                vwpx = font.vw;
                            }
                            else {
                                vwpx = font.px;
                            }
                        }
                    });
                    return vwpx;
                };
                commonSwitchPanelCtrl.prototype.fontSizeChanged = function () {
                    i18n_1.setI18n(this.panel, 'commonFontSize', this.panel.commonFontSize, this.dashboard.panelLanguage);
                    this.onRender();
                };
                commonSwitchPanelCtrl.prototype.moveVariable = function (index, dir) {
                    // @ts-ignore
                    lodash_1.default.move(this.panel.commonVarArray, index, index + dir);
                    this.onRender();
                };
                commonSwitchPanelCtrl.prototype.onRender = function () {
                    if (!this.renderFlag) {
                        var panelCententElem = this.elem.find('.advantechCommonSwitchPanel').parent().parent();
                        panelCententElem.css({ overflow: 'visible' });
                    }
                    this.renderFlag = true;
                    this.initI18n();
                    var temp = '';
                    if (this.dashboard.meta.isPc === false) {
                        temp = 'mobile';
                    }
                    this.timeData = this.panel.updataTime;
                    if (this.dataList && this.dataList.length > 0) {
                        for (var p = 0; p < this.dataList.length; p++) {
                            if (this.dataList[p].type === 'table') {
                                if (this.dataList[p].refId === this.panel.queryDate) {
                                    if (this.panel.tableData) {
                                        this.timeData = this.dataList[p].rows[0][this.panel.tableData];
                                    }
                                    else {
                                        this.timeData = this.dataList[p].rows[0][0];
                                    }
                                }
                            }
                            else {
                                if (this.dataList[p].name === this.panel.queryDate) {
                                    this.timeData = this.dataList[p].datapoints[0][0];
                                }
                            }
                        }
                    }
                    this.fontSizeData = fontsize_1.default.fontSizeChange(this.panel.commoneTitleAdjFontSize, this.panel.commonFontSize, temp);
                    this.normalVarArrayData = [];
                    var tempVaraiable = [];
                    this.selectedItems = '';
                    var varNameArray = this.panel.commonVarArray;
                    var sourceVarArray = this.dashboard.templating.list;
                    if (varNameArray.length > 0) {
                        for (var i = 0; i < sourceVarArray.length; i++) {
                            for (var j = 0; j < varNameArray.length; j++) {
                                if (sourceVarArray[i].name === varNameArray[j].name) {
                                    tempVaraiable.push(sourceVarArray[i]);
                                }
                            }
                        }
                        for (var m = 0; m < varNameArray.length; m++) {
                            for (var n = 0; n < tempVaraiable.length; n++) {
                                if (varNameArray[m].name === tempVaraiable[n].name) {
                                    this.normalVarArrayData.push(tempVaraiable[n]);
                                }
                            }
                        }
                    }
                    var currentData = this.normalVarArrayData;
                    for (var k = 0; k < currentData.length; k++) {
                        if (k === currentData.length - 1) {
                            this.selectedItems = this.selectedItems + currentData[k].current.text;
                        }
                        else {
                            this.selectedItems = this.selectedItems + currentData[k].current.text + ',';
                        }
                    }
                    this.timeValue = this.timeSrv.timeRange();
                    if (!this.panel.isEditing && this.refreshTimeFlag) {
                        this.timeSrv.refreshDashboard();
                        this.refreshTimeFlag = false;
                    }
                    if (this.panel.commonFontColor) {
                        this.fontColorData = this.panel.commonFontColor;
                    }
                    else {
                        if (config_1.default && config_1.default.theme && config_1.default.theme.type) {
                            if (config_1.default.theme.type === 'light') {
                                this.fontColorData = '#323233';
                            }
                            else {
                                this.fontColorData = '#fff';
                            }
                        }
                        else {
                            this.fontColorData = '#E6E6E6';
                        }
                    }
                };
                commonSwitchPanelCtrl.prototype.initI18n = function () {
                    this.panel.commonFontSize = i18n_1.getI18n(this.panel, 'commonFontSize', this.dashboard.panelLanguage);
                    this.panel.commonTitle = i18n_1.getI18n(this.panel, 'commonTitle', this.dashboard.panelLanguage);
                };
                commonSwitchPanelCtrl.prototype.initDefaultI18n = function () {
                    i18n_1.initAttrI18n(this.panel, 'commonFontSize', this.dashboard.panelLanguage);
                    i18n_1.initAttrI18n(this.panel, 'commonTitle', this.dashboard.panelLanguage);
                };
                commonSwitchPanelCtrl.prototype.totalFun = function () {
                    this.hiddenFun();
                    this.onRender();
                };
                commonSwitchPanelCtrl.prototype.handleYearChangedonRender = function () {
                    if (this.panel.timeMode && this.panel.timeMode === "Default TimeRange") {
                        this.panel.trueTime = '';
                    }
                    this.onRender();
                };
                commonSwitchPanelCtrl.prototype.hiddenFun = function () {
                    this.showFlag = false;
                    this.imageStyle = {
                        'background-image': 'url(../img/grayPhoto.svg)',
                    };
                    this.borderStyle = config_1.default.theme.type === 'light' ? {
                        'border': 'solid 2px #c5c5c5',
                    } : {
                        'border': 'solid 2px #464646',
                    };
                    this.fontColorStyle = config_1.default.theme.type === 'light' ? {
                        'color': '#323233',
                    } : {
                        'color': '#fff',
                    };
                };
                commonSwitchPanelCtrl.prototype.clearFilterFun = function () {
                    this.selectedItems = '';
                    var currentData = this.normalVarArrayData;
                    for (var k = 0; k < currentData.length; k++) {
                        currentData[k].current.text = currentData[k].options[0].text;
                        currentData[k].current.value = currentData[k].options[0].value;
                        if (k === currentData.length - 1) {
                            this.selectedItems = this.selectedItems + currentData[k].options[0].text;
                        }
                        else {
                            this.selectedItems = this.selectedItems + currentData[k].options[0].text + ',';
                        }
                    }
                    this.hiddenFun();
                };
                commonSwitchPanelCtrl.prototype.showDropDown = function () {
                    this.imageStyle = {
                        'background-image': 'url(../img/bluePhoto.svg)',
                    };
                    this.borderStyle = {
                        'border': 'solid 1px #019ff3',
                    };
                    this.fontColorStyle = {
                        'color': '#019ff3',
                    };
                    this.showFlag = true;
                };
                commonSwitchPanelCtrl.prototype.hideDropDownFun = function () {
                    this.hiddenFun();
                    this.onRender();
                };
                commonSwitchPanelCtrl.prototype.setActiveTimeOption = function () {
                    return this.timeSrv.getTimeRelateFun();
                };
                commonSwitchPanelCtrl.prototype.onChangeTimePicker = function (timeRange) {
                    var panel = this.dashboard.timepicker;
                    var hasDelay = panel.nowDelay && timeRange.raw.to === 'now';
                    var adjustedFrom = this.dateMath.isMathString(timeRange.raw.from) ? timeRange.raw.from : timeRange.from;
                    var adjustedTo = this.dateMath.isMathString(timeRange.raw.to) ? timeRange.raw.to : timeRange.to;
                    var nextRange = {
                        from: adjustedFrom,
                        to: hasDelay ? 'now-' + panel.nowDelay : adjustedTo,
                    };
                    this.timeSrv.setTime(nextRange);
                    this.onRender();
                };
                commonSwitchPanelCtrl.prototype.onDataReceived = function (data) {
                    var _this = this;
                    this.timeValue = this.timeSrv.timeRange();
                    this.dataList = [];
                    this.tableColumns = [];
                    this.dataTypeList = [];
                    if (data && data.length > 0) {
                        this.dataList = data;
                    }
                    this.queryDateArray = [{ value: '', text: '' }];
                    if (this.dataList && this.dataList.length > 0) {
                        for (var i = 0; i < this.dataList.length; i++) {
                            var tempJson = {
                                value: '',
                                text: '',
                            };
                            var dataType = 'timeseires';
                            if (this.dataList[i].type === 'table') {
                                tempJson.value = this.dataList[i].refId;
                                tempJson.text = this.dataList[i].refId;
                                var tempColumn = this.dataList[i].columns;
                                lodash_1.default.forEach(tempColumn, function (column, index) {
                                    _this.tableColumns.push({ value: index, text: column.text });
                                });
                                dataType = 'table';
                            }
                            else {
                                tempJson.value = this.dataList[i].name;
                                tempJson.text = this.dataList[i].name;
                            }
                            this.dataTypeList.push({ value: tempJson.value, text: dataType });
                            this.queryDateArray.push(tempJson);
                        }
                    }
                    this.handleUpdataFun();
                    this.onRender();
                };
                commonSwitchPanelCtrl.prototype.handleUpdataFun = function () {
                    var _this = this;
                    if (this.dataTypeList && this.dataTypeList.length && this.dataTypeList.length > 0) {
                        this.tableTypeFlag = false;
                        lodash_1.default.forEach(this.dataTypeList, function (item) {
                            if (item.value === _this.panel.queryDate) {
                                if (item.text === 'table') {
                                    _this.tableTypeFlag = true;
                                }
                            }
                        });
                    }
                };
                commonSwitchPanelCtrl.prototype.validTitleFun = function () {
                    this.titleInvalid = false;
                    if (this.panel.commonTitle.length > 36) {
                        this.titleInvalid = true;
                        this.panel.commonTitle = '';
                    }
                    i18n_1.setI18n(this.panel, 'commonTitle', this.panel.commonTitle, this.dashboard.panelLanguage);
                };
                //custom time range code
                commonSwitchPanelCtrl.prototype.initFun = function () {
                    var date = new Date();
                    var year = date.getFullYear();
                    var month = date.getMonth() + 1;
                    this.yearFromOptions = [];
                    this.yearToOptions = [];
                    this.yearFromOptions.push('This Year');
                    for (var i = year - 1; i >= 1970; i--) {
                        this.yearFromOptions.push(i);
                        if (i >= this.panel.yearFrom) {
                            this.yearToOptions.push(i);
                        }
                    }
                    //yyyy/MM/dd
                    this.yearMonthFromOptions = [];
                    this.yearMonthToOptions = [];
                    this.yearMonthFromOptions.push('This Year/Month');
                    for (var i = year; i >= 1970; i--) {
                        var count = 12;
                        if (year === i) {
                            count = month - 1;
                        }
                        for (var j = count; j > 0; j--) {
                            var m = j;
                            if (j < 10) {
                                m = '0' + j;
                            }
                            var temp = i + '/' + m;
                            this.yearMonthFromOptions.push(temp);
                        }
                    }
                };
                commonSwitchPanelCtrl.prototype.handleYearFromFun = function () {
                    var date = new Date();
                    var year = date.getFullYear();
                    this.yearToOptions = [];
                    this.yearToOptions.push('This Year');
                    for (var i = year; i > this.panel.yearFrom; i--) {
                        this.yearToOptions.push(i);
                    }
                    this.handleModeOneHistoryYearFun();
                };
                commonSwitchPanelCtrl.prototype.handleModeOneHistoryYearFun = function () {
                    var fromYear = this.panel.yearFrom;
                    var toYear = this.panel.yearTo;
                    var currentY = new Date().getFullYear();
                    var currentM = new Date().getMonth() + 1;
                    if (toYear === 'This Year') {
                        toYear = currentY;
                    }
                    else if (!toYear) {
                        toYear = fromYear;
                    }
                    this.timeSelectedArr = [];
                    this.timeSelectedArr.push('This Month');
                    var count = 12;
                    for (var i = toYear; i > fromYear - 1; i--) {
                        if (i === currentY) {
                            count = currentM;
                        }
                        else {
                            count = 12;
                        }
                        for (var j = count; j > 0; j--) {
                            var temp = void 0;
                            if (j < 10) {
                                temp = i + '/0' + j;
                            }
                            else {
                                temp = i + '/' + j;
                            }
                            this.timeSelectedArr.push(temp);
                        }
                    }
                };
                commonSwitchPanelCtrl.prototype.handleModeOneCurrentYearFun = function () {
                    var date = new Date();
                    var year = date.getFullYear();
                    var month = date.getMonth() + 1;
                    this.timeSelectedArr = [];
                    this.timeSelectedArr.push('This Month');
                    for (var i = 12; i > 0; i--) {
                        if (i < month + 1) {
                            var tempM = i;
                            if (i < 10) {
                                tempM = '0' + i;
                            }
                            var tempTime = year + '/' + tempM;
                            this.timeSelectedArr.push(tempTime);
                        }
                    }
                };
                commonSwitchPanelCtrl.prototype.getLastDay = function (year, month) {
                    var date = new Date(year, month, 1);
                    var lastday = new Date(date.getTime() - 1000 * 60 * 60 * 24).getDate();
                    return lastday;
                };
                commonSwitchPanelCtrl.prototype.handleTrueTimeChanged = function () {
                    if (this.panel.trueTime) {
                        var firstTime, lastTime;
                        var trueTime = this.panel.trueTime;
                        var date = new Date();
                        var year = date.getFullYear();
                        var month = date.getMonth() + 1;
                        var day = date.getDate();
                        var timeArr = trueTime.split('/');
                        var firstDay, lastDay;
                        if (this.panel.dateMode === 'yyyy/MM') {
                            if (this.panel.trueTime === 'This Month') {
                                if (this.firstload === false) {
                                    this.timeSrv.setTime({ from: 'now/M', to: 'now/M' });
                                }
                                return;
                            }
                            else {
                                firstDay = trueTime + '/01' + 'T00:00:00.000';
                                lastDay = trueTime + '/' + this.getLastDay(timeArr[0], timeArr[1]) + 'T23:59:59.999';
                                if (Number(timeArr[1]) === month) {
                                    lastDay = trueTime + '/' + day + 'T23:59:59.999';
                                }
                                firstDay = firstDay.replace(/\//g, '-');
                                lastDay = lastDay.replace(/\//g, '-');
                            }
                        }
                        else {
                            if (this.panel.trueTime === 'Today') {
                                this.todayFun();
                                return;
                            }
                            else {
                                // Fix setTime bug by Shaun. 2022/06/14
                                // Change Date format from YYYY/MM/DD HH:mm:ss:sss to YYYY-MM-DDTHH:mm:ss.sss(ISO 8601 format)
                                firstDay = trueTime.replace(/\//g, '-') + 'T00:00:00.000';
                                lastDay = trueTime.replace(/\//g, '-') + 'T23:59:59.999';
                            }
                        }
                        // console.log('day',firstDay,lastDay);
                        var startTemp = new Date(firstDay);
                        var lastTemp = new Date(lastDay);
                        // console.log('daytemp',startTemp,lastTemp);
                        firstTime = startTemp.getTime();
                        lastTime = lastTemp.getTime();
                        // console.log('before',firstTime,lastTime);
                        if (this.panel.dayFromShift && this.panel.dayFromType) {
                            var type = this.panel.dayFromType;
                            var data = this.panel.dayFromShift;
                            if (type === 'hour') {
                                firstTime = firstTime + data * 60 * 60 * 1000;
                            }
                            else if (type === 'minute') {
                                firstTime = firstTime + data * 60 * 1000;
                            }
                            else if (type === 'second') {
                                firstTime = firstTime + data * 1000;
                            }
                        }
                        if (this.panel.dayToType && this.panel.dayToShift) {
                            var type = this.panel.dayToType;
                            var data = this.panel.dayToShift;
                            if (type === 'hour') {
                                lastTime = lastTime + data * 60 * 60 * 1000;
                            }
                            else if (type === 'minute') {
                                lastTime = lastTime + data * 60 * 1000;
                            }
                            else if (type === 'second') {
                                lastTime = lastTime + data * 1000;
                            }
                        }
                        // console.log('timeSrv',this.timeSrv);
                        // console.log('after',firstTime,lastTime);
                        // console.log(grafanaData.toUtc(firstTime),grafanaData.toUtc(lastTime));
                        if (this.firstload === false) {
                            this.timeSrv.setTime({
                                from: data_1.default.toUtc(firstTime),
                                to: data_1.default.toUtc(lastTime)
                            });
                        }
                    }
                };
                commonSwitchPanelCtrl.prototype.todayFormatFun = function (type, data) {
                    var lastTime = '';
                    if (type === 'hour') {
                        lastTime = data + 'h';
                    }
                    else if (type === 'minute') {
                        lastTime = data + 'm';
                    }
                    else if (type === 'second') {
                        lastTime = data + 's';
                    }
                    return lastTime;
                };
                commonSwitchPanelCtrl.prototype.todayFun = function () {
                    var timeToDataValue, timeFromDataValue;
                    if (this.panel.dayToType && this.panel.dayToShift) {
                        var type = this.panel.dayToType;
                        var data = this.panel.dayToShift;
                        timeToDataValue = this.todayFormatFun(type, data);
                    }
                    if (this.panel.dayFromShift && this.panel.dayFromType) {
                        var fromType = this.panel.dayFromType;
                        var fromData = this.panel.dayFromShift;
                        timeFromDataValue = this.todayFormatFun(fromType, fromData);
                    }
                    var tempToTime = 'now/d';
                    if (timeToDataValue) {
                        tempToTime = tempToTime + '+' + timeToDataValue;
                    }
                    var tempFromTime = 'now/d';
                    if (timeFromDataValue) {
                        tempFromTime = tempFromTime + "+" + timeFromDataValue;
                    }
                    if (this.firstload === false) {
                        this.timeSrv.setTime({ from: tempFromTime, to: tempToTime });
                    }
                };
                commonSwitchPanelCtrl.prototype.handleYearChanged = function () {
                    if (this.panel.dateMode === 'yyyy/MM') {
                        this.panel.yearandMonthTo = '';
                        this.panel.yearandMonthFrom = '';
                        this.panel.dayToShift = 0;
                        this.panel.dayFromShift = 0;
                        if (this.panel.yearFrom === 'This Year') {
                            this.panel.yearTo = '';
                            this.handleModeOneCurrentYearFun();
                        }
                        else {
                            this.handleYearFromFun();
                        }
                    }
                    else if (this.panel.dateMode === 'yyyy/MM/dd') {
                        this.panel.yearTo = '';
                        this.panel.yearFrom = '';
                        if (this.panel.yearandMonthFrom === 'This Year/Month') {
                            this.panel.yearandMonthTo = '';
                            this.handleCurrentYearMonthFun();
                        }
                        else {
                            this.handleHistoryYearMonthFun();
                        }
                    }
                };
                commonSwitchPanelCtrl.prototype.handleCurrentYearMonthFun = function () {
                    var date = new Date();
                    var year = date.getFullYear();
                    var month = date.getMonth() + 1;
                    var day = date.getDate();
                    this.timeSelectedArr = [];
                    this.timeSelectedArr.push('Today');
                    if (month < 10) {
                        month = '0' + month;
                    }
                    for (var i = day; i > 0; i--) {
                        var tempD = i;
                        if (i < 10) {
                            tempD = '0' + i;
                        }
                        var tempTime = year + '/' + month + '/' + tempD;
                        this.timeSelectedArr.push(tempTime);
                    }
                };
                commonSwitchPanelCtrl.prototype.handleHistoryYearMonthFun = function () {
                    // only from
                    var fromD = this.panel.yearandMonthFrom;
                    var toD = this.panel.yearandMonthTo;
                    var fromArr = fromD.split("/");
                    this.timeSelectedArr = [];
                    this.timeSelectedArr.push('Today');
                    this.yearMonthToOptions = [];
                    this.yearMonthToOptions.push('This Year/Month');
                    //from produces to
                    var date = new Date();
                    var year = date.getFullYear();
                    var month = date.getMonth() + 1;
                    var dayData = date.getDate();
                    var fromTimeD = (Number(fromArr[0]));
                    var fromMonthTime = (Number(fromArr[1]));
                    this.fromProducteToFun(year, fromTimeD, fromMonthTime, month);
                    if (!toD) {
                        //get this month last day
                        var lastD = this.getLastDay(fromArr[0], fromArr[1]);
                        for (var i = lastD; i > 0; i--) {
                            var d = i;
                            if (i < 10) {
                                d = '0' + d;
                            }
                            var tempT = fromD + '/' + d;
                            this.timeSelectedArr.push(tempT);
                        }
                    }
                    else {
                        this.calDetailsDayFun(toD, year, month, fromTimeD, fromMonthTime, dayData);
                    }
                };
                commonSwitchPanelCtrl.prototype.calDetailsDayFun = function (toD, year, month, fromYearTime, fromMonthTime, dayData) {
                    //cal from for to time yyyy/MM
                    var tempCurrentYM = toD;
                    if (toD === 'This Year/Month') {
                        tempCurrentYM = year + '/' + month;
                        if (month < 10) {
                            tempCurrentYM = year + '/0' + month;
                        }
                    }
                    //timeTo year and Month
                    var toArr = tempCurrentYM.split("/");
                    var toYearData = Number(toArr[0]);
                    var toMonthData = Number(toArr[1]);
                    var calStart, calEnd;
                    for (var h = toYearData; h > fromYearTime - 1; h--) {
                        if (h === year) {
                            //current year
                            var count = 1;
                            if (year === fromYearTime) {
                                count = fromMonthTime;
                            }
                            calStart = toMonthData;
                            calEnd = count;
                        }
                        else if (h === fromYearTime) {
                            var monthTrueData = 12;
                            if (h === toYearData) {
                                monthTrueData = toMonthData;
                            }
                            calStart = monthTrueData;
                            calEnd = fromMonthTime;
                        }
                        else if ((h > fromYearTime) && (h < toYearData)) {
                            calStart = 12;
                            calEnd = 1;
                        }
                        else {
                            if (toYearData - fromYearTime === 0) {
                                calStart = toMonthData;
                                calEnd = fromMonthTime;
                            }
                            else if (toYearData - fromYearTime >= 1) {
                                if (h === toYearData) {
                                    calStart = toMonthData;
                                    calEnd = 1;
                                }
                                else if (h === fromYearTime) {
                                    calStart = 12;
                                    calEnd = fromMonthTime;
                                }
                                else {
                                    calStart = 12;
                                    calEnd = 1;
                                }
                            }
                        }
                        for (var e = calStart; e > calEnd - 1; e--) {
                            var fromYJson = h + '/' + e;
                            if (e < 10) {
                                fromYJson = h + '/0' + e;
                            }
                            var tempDayD = this.getLastDay(h, e);
                            if (h === year && month === e) {
                                tempDayD = dayData;
                            }
                            for (var t = tempDayD; t > 0; t--) {
                                var day20 = t;
                                if (day20 < 10) {
                                    day20 = '0' + day20;
                                }
                                var tempTime1 = fromYJson + '/' + day20;
                                this.timeSelectedArr.push(tempTime1);
                            }
                        }
                    }
                };
                commonSwitchPanelCtrl.prototype.fromProducteToFun = function (year, fromTimeD, toTimeD, month) {
                    for (var k = year; k > (fromTimeD - 1); k--) {
                        var totalSCount = void 0, endCount = void 0;
                        if (k === year) {
                            //current year
                            var count = 0;
                            if (year === fromTimeD) {
                                count = toTimeD;
                            }
                            totalSCount = count;
                            endCount = month;
                        }
                        else if (k === fromTimeD) {
                            //timeRange from year
                            totalSCount = toTimeD;
                            endCount = 12;
                        }
                        else if ((k > fromTimeD) && (k < year)) {
                            totalSCount = 0;
                            endCount = 12;
                        }
                        for (var p = endCount; p > totalSCount; p--) {
                            var currentyJson = k + '/' + p;
                            if (p < 10) {
                                currentyJson = k + '/0' + p;
                            }
                            this.yearMonthToOptions.push(currentyJson);
                        }
                    }
                };
                commonSwitchPanelCtrl.prototype.handleTimeShiftFun = function () {
                    this.handleTrueTimeChanged();
                    this.refreshTimeFlag = true;
                    this.onRender();
                };
                commonSwitchPanelCtrl.prototype.link = function (scope, elem, attrs, ctrl) {
                    ctrl.elem = elem;
                    var panelCententElem = elem.find('.advantechCommonSwitchPanel').parent().parent().parent();
                    if (!ctrl.isPc) {
                        var id = ctrl.panel.id;
                        var panelElem = document.getElementById('panel-' + id);
                        panelElem.removeAttribute("class");
                        panelCententElem.addClass("mobile-common-switch-overflow-style");
                    }
                    else {
                        panelCententElem.removeClass("mobile-common-switch-overflow-style");
                    }
                    ctrl.initDefaultI18n();
                    var bodyEl = angular_1.default.element(this.windowObj.document.body);
                    scope.$watch('ctrl.showFlag', function (newValue) {
                        if (newValue) {
                            openDropdown();
                        }
                        else {
                            switchToLink();
                        }
                    });
                    function openDropdown() {
                        ctrl.$timeout(function () { bodyEl.on('click', bodyOnClick); }, 0, false);
                    }
                    function bodyOnClick(e) {
                        if (elem.has(e.target).length === 0 && e.target.className && !e.target.className.includes('variable-option')) {
                            scope.$apply(function () {
                                scope.ctrl.hideDropDownFun();
                            });
                        }
                    }
                    function switchToLink() {
                        bodyEl.off('click', bodyOnClick);
                    }
                };
                commonSwitchPanelCtrl.templateUrl = 'partials/module.html';
                return commonSwitchPanelCtrl;
            })(sdk_1.MetricsPanelCtrl);
            exports_1("commonSwitchPanelCtrl", commonSwitchPanelCtrl);
            exports_1("PanelCtrl", commonSwitchPanelCtrl);
        }
    }
});
//# sourceMappingURL=module.js.map