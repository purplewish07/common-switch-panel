///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
import angular from 'angular';
import _ from 'lodash';
import appEvents from 'app/core/app_events';
import { MetricsPanelCtrl, loadPluginCss } from 'app/plugins/sdk';
import ChangeFont from './fontsize';
import { getI18n, setI18n, initAttrI18n, initAttrArrayI18n } from './i18n';
import grafanaData from '@grafana/data';
import grafanaUI from '@grafana/ui';
import config from 'app/core/config';
//import TemplateSrv from 'app/features/templating/template_srv';


System.import('plugins/advantech-common-switch-panel/css/default.css' + '!css');
loadPluginCss({
  dark: 'plugins/advantech-common-switch-panel/css/commondark.css',
  light: 'plugins/advantech-common-switch-panel/css/commonlight.css',
});


export class commonSwitchPanelCtrl extends MetricsPanelCtrl {
  static templateUrl = 'partials/module.html';
  defaults = {
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
  normalVarOption = [];
  normalVarArrayData = [];
  commonSwitch: any;
  titleFontSizeVWList: any[];
  imageStyle: any;
  borderStyle: any;
  fontColorStyle: any;
  selectedItems: any;
  timeValue: any;
  customTimePickerData: any;
  timeZoneData: any;
  dateMath: any;
  showFlag: any;
  fontSizeData: any;
  queryDateArray = [];
  dataList: any;
  dataTypeList: any;
  timeData: any;
  windowObj: any;
  titleInvalid: boolean;
  elem: any;
  renderFlag: boolean;
  modeOptions = ['Default TimeRange', 'Custome TimeRange'];
  dateModeOptions = ['yyyy/MM', 'yyyy/MM/dd'];
  yearFromOptions: any[];
  yearToOptions: any[];
  timeSelectedArr: any[];
  yearMonthFromOptions: any[];
  yearMonthToOptions: any[];
  tableColumns: any[];
  tableTypeFlag: boolean;
  timeShiftOption = ['hour', 'minute', 'second'];
  refreshTimeFlag: any;
  fontColorData: any;
  isPc: boolean;

  constructor($scope, $injector, $window, $timeout) {
    super($scope, $injector);
    this.windowObj = $window;
    this.titleFontSizeVWList = ChangeFont.defaultValues;
    this.commonSwitch = 'commonSwitch';
    this.isPc = this.dashboard.meta.isPc;
    if (this.dashboard.meta.isPc === undefined) {
      this.isPc = true;
    }
    const varArray = this.dashboard.templating.list;
    _.defaultsDeep(this.panel, this.defaults);
    this.showFlag = false;
    this.imageStyle = {
      'background-image': 'url(/img/grayPhoto.svg)',
    };
    this.borderStyle = config.theme.type === 'light' ? {
      'border': 'solid 1px #c5c5c5',
    } : {
      'border': 'solid 2px #464646',
    };

    this.fontColorStyle = config.theme.type === 'light' ? {
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

    for (let i = 0; i < varArray.length; i++) {
      this.normalVarOption.push({ value: varArray[i].name, text: varArray[i].name })
    }
    if (this.scope.$$listeners.isWisePaas) {
      this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
      this.events.on('render', this.onRender.bind(this));
      this.events.on('init-panel-actions', this.onInitPanelActions.bind(this));
      this.events.on('data-received', this.onDataReceived.bind(this));
    }
    appEvents.on("variable-will-remove", (data: any) => {
      if (data === this.panel.id) {
        appEvents.emit("this-variable-panel-remove", this.panel.commonVarArray);
      }
    });
    appEvents.on('notic-varibale-panel', (data) => {
      const varArray = this.dashboard.templating.list;
      const tempVar = _.cloneDeep(this.panel.commonVarArray);
      let flag;
      for (let i = 0; i < tempVar.length; i++) {
        flag = false;
        for (let k = 0; k < varArray.length; k++) {
          if (varArray[k].name === tempVar[i].name) {
            flag = true;
          }
        }
        if (!flag) {
          this.panel.commonVarArray.splice(i, 1);
          appEvents.emit("var-has-change", { data: name, way: 'delete' });
        }
      }
      this.onRender();
    });
    this.titleInvalid = false;
    this.renderFlag = false;

    /* custome time range */
    this.initFun();
    if (this.panel.timeMode && this.panel.timeMode === "Default TimeRange") {
      this.panel.trueTime = '';
    }
    this.handleYearChanged();
    this.tableTypeFlag = false;
    this.handleTrueTimeChanged();
    this.refreshTimeFlag = false;
    const oldVersion = this.panel.commonSwitchVersion;
    this.panel.commonSwitchVersion = 1;
    if (this.panel.commonSwitchVersion !== oldVersion) {
      if (this.panel.commonFontColor && this.panel.commonFontColor === '#ffffff') {
        delete this.panel.commonFontColor;
      }
    }
  }

  onInitEditMode() {
    this.addEditorTab('Options', 'public/plugins/advantech-common-switch-panel/partials/editor.html', 2);
  }

  onInitPanelActions() {
    this.normalVarOption = [];
    const varArray = this.dashboard.templating.list;
    for (let i = 0; i < varArray.length; i++) {
      this.normalVarOption.push({ value: varArray[i].name, text: varArray[i].name })
    }
  }

  addVarItem() {
    const currentArray = this.panel.commonVarArray;
    const currentValue = this.panel.commonVarName;
    let flag = false;
    if (currentArray.length > 0) {
      for (let i = 0; i < currentArray.length; i++) {
        if (currentArray[i].name === currentValue) {
          flag = true;
          break;
        }
      }
    }
    if (!flag) {
      this.panel.commonVarArray.push({ name: currentValue });
      appEvents.emit("var-has-change", { data: currentValue, way: 'add' });
    }
    this.onRender();
  }

  removeVarItem(index, name) {
    this.panel.commonVarArray.splice(index, 1);
    appEvents.emit("var-has-change", { data: name, way: 'delete' });
    this.onRender();
  }

  variableUpdated(variable: any, emitChangeEvents: any) {
    variable.variableSrv.variableUpdated(variable, emitChangeEvents);
    this.onRender();
  }

  getFontSizeVwOrPx(t) {
    let vwpx;
    ChangeFont.defaultValues.forEach(font => {
      if (font.text === t) {
        if (this.panel.commoneTitleAdjFontSize) {
          vwpx = font.vw;
        } else {
          vwpx = font.px;
        }
      }
    });
    return vwpx;
  }

  fontSizeChanged() {
    setI18n(this.panel, 'commonFontSize', this.panel.commonFontSize, this.dashboard.panelLanguage);
    this.onRender();
  }

  moveVariable(index, dir) {
    // @ts-ignore
    _.move(this.panel.commonVarArray, index, index + dir);
    this.onRender();
  }

  onRender() {
    if (!this.renderFlag) {
      const panelCententElem = this.elem.find('.advantechCommonSwitchPanel').parent().parent();
      panelCententElem.css({ overflow: 'visible' });
    }
    this.renderFlag = true;
    this.initI18n();

    let temp = '';
    if (this.dashboard.meta.isPc === false) {
      temp = 'mobile';
    }
    this.timeData = this.panel.updataTime;
    if (this.dataList && this.dataList.length > 0) {
      for (let p = 0; p < this.dataList.length; p++) {
        if (this.dataList[p].type === 'table') {
          if (this.dataList[p].refId === this.panel.queryDate) {
            if (this.panel.tableData) {
              this.timeData = this.dataList[p].rows[0][this.panel.tableData];
            } else {
              this.timeData = this.dataList[p].rows[0][0];
            }
          }
        } else {
          if (this.dataList[p].name === this.panel.queryDate) {
            this.timeData = this.dataList[p].datapoints[0][0];
          }
        }
      }
    }

    this.fontSizeData = ChangeFont.fontSizeChange(this.panel.commoneTitleAdjFontSize, this.panel.commonFontSize, temp);
    this.normalVarArrayData = [];
    const tempVaraiable = []
    this.selectedItems = '';
    const varNameArray = this.panel.commonVarArray;
    const sourceVarArray = this.dashboard.templating.list;
    if (varNameArray.length > 0) {
      for (let i = 0; i < sourceVarArray.length; i++) {
        for (let j = 0; j < varNameArray.length; j++) {
          if (sourceVarArray[i].name === varNameArray[j].name) {
            tempVaraiable.push(sourceVarArray[i]);
          }
        }
      }
      for (let m = 0; m < varNameArray.length; m++) {
        for (let n = 0; n < tempVaraiable.length; n++) {
          if (varNameArray[m].name === tempVaraiable[n].name) {
            this.normalVarArrayData.push(tempVaraiable[n]);
          }
        }
      }
    }

    const currentData = this.normalVarArrayData;
    for (let k = 0; k < currentData.length; k++) {
      if (k === currentData.length - 1) {
        this.selectedItems = this.selectedItems + currentData[k].current.text;
      } else {
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
    } else {
      if (config && config.theme && config.theme.type) {
        if (config.theme.type === 'light') {
          this.fontColorData = '#323233';
        } else {
          this.fontColorData = '#fff';
        }
      } else {
        this.fontColorData = '#E6E6E6';
      }
    }
  }

  initI18n() {
    this.panel.commonFontSize = getI18n(this.panel, 'commonFontSize', this.dashboard.panelLanguage);
    this.panel.commonTitle = getI18n(this.panel, 'commonTitle', this.dashboard.panelLanguage);
  }

  initDefaultI18n() {
    initAttrI18n(this.panel, 'commonFontSize', this.dashboard.panelLanguage);
    initAttrI18n(this.panel, 'commonTitle', this.dashboard.panelLanguage);
  }

  totalFun() {
    this.hiddenFun();
    this.onRender();
  }

  handleYearChangedonRender() {
    if (this.panel.timeMode && this.panel.timeMode === "Default TimeRange") {
      this.panel.trueTime = '';
    }
    this.onRender();
  }

  hiddenFun() {
    this.showFlag = false;
    this.imageStyle = {
      'background-image': 'url(../img/grayPhoto.svg)',
    };
    this.borderStyle = config.theme.type === 'light' ? {
      'border': 'solid 2px #c5c5c5',
    } : {
      'border': 'solid 2px #464646',
    };
    this.fontColorStyle = config.theme.type === 'light' ? {
      'color': '#323233',
    } : {
      'color': '#fff',
    };
  }

  clearFilterFun() {
    this.selectedItems = '';
    const currentData = this.normalVarArrayData;
    for (let k = 0; k < currentData.length; k++) {
      currentData[k].current.text = currentData[k].options[0].text;
      currentData[k].current.value = currentData[k].options[0].value;
      if (k === currentData.length - 1) {
        this.selectedItems = this.selectedItems + currentData[k].options[0].text;
      } else {
        this.selectedItems = this.selectedItems + currentData[k].options[0].text + ',';
      }
    }
    this.hiddenFun();
  }

  showDropDown() {
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
  }

  hideDropDownFun() {
    this.hiddenFun();
    this.onRender();
  }

  setActiveTimeOption() {
    return this.timeSrv.getTimeRelateFun();
  }

  onChangeTimePicker(timeRange: any) {
    const panel = this.dashboard.timepicker;
    const hasDelay = panel.nowDelay && timeRange.raw.to === 'now';
    const adjustedFrom = this.dateMath.isMathString(timeRange.raw.from) ? timeRange.raw.from : timeRange.from;
    const adjustedTo = this.dateMath.isMathString(timeRange.raw.to) ? timeRange.raw.to : timeRange.to;
    const nextRange = {
      from: adjustedFrom,
      to: hasDelay ? 'now-' + panel.nowDelay : adjustedTo,
    };
    this.timeSrv.setTime(nextRange);
    this.onRender();
  }

  onDataReceived(data: any) {
    this.timeValue = this.timeSrv.timeRange();
    this.dataList = [];
    this.tableColumns = [];
    this.dataTypeList = [];
    if (data && data.length > 0) {
      this.dataList = data;
    }
    this.queryDateArray = [{ value: '', text: '' }];
    if (this.dataList && this.dataList.length > 0) {
      for (let i = 0; i < this.dataList.length; i++) {
        let tempJson = {
          value: '',
          text: '',
        };
        let dataType = 'timeseires'
        if (this.dataList[i].type === 'table') {
          tempJson.value = this.dataList[i].refId;
          tempJson.text = this.dataList[i].refId;
          const tempColumn = this.dataList[i].columns;
          _.forEach(tempColumn, (column, index) => {
            this.tableColumns.push({ value: index, text: column.text });
          });
          dataType = 'table';
        } else {
          tempJson.value = this.dataList[i].name;
          tempJson.text = this.dataList[i].name;
        }
        this.dataTypeList.push({ value: tempJson.value, text: dataType });
        this.queryDateArray.push(tempJson);
      }
    }
    this.handleUpdataFun();
    this.onRender();
  }

  handleUpdataFun() {
    if (this.dataTypeList && this.dataTypeList.length && this.dataTypeList.length > 0) {
      this.tableTypeFlag = false;
      _.forEach(this.dataTypeList, item => {
        if (item.value === this.panel.queryDate) {
          if (item.text === 'table') {
            this.tableTypeFlag = true;
          }
        }
      });
    }
  }

  validTitleFun() {
    this.titleInvalid = false;
    if (this.panel.commonTitle.length > 36) {
      this.titleInvalid = true;
      this.panel.commonTitle = '';
    }
    setI18n(this.panel, 'commonTitle', this.panel.commonTitle, this.dashboard.panelLanguage);
  }

  //custom time range code
  initFun() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    this.yearFromOptions = [];
    this.yearToOptions = [];
    this.yearFromOptions.push('This Year');
    for (let i = year - 1; i >= 1970; i--) {
      this.yearFromOptions.push(i);
      if (i >= this.panel.yearFrom) {
        this.yearToOptions.push(i);
      }
    }
    //yyyy/MM/dd
    this.yearMonthFromOptions = [];
    this.yearMonthToOptions = [];
    this.yearMonthFromOptions.push('This Year/Month');
    for (let i = year; i >= 1970; i--) {
      let count = 12;
      if (year === i) {
        count = month - 1;
      }
      for (let j = count; j > 0; j--) {
        let m: any = j
        if (j < 10) {
          m = '0' + j;
        }
        const temp = i + '/' + m;
        this.yearMonthFromOptions.push(temp);
      }
    }
  }

  handleYearFromFun() {
    const date = new Date();
    const year = date.getFullYear();
    this.yearToOptions = [];
    this.yearToOptions.push('This Year')
    for (let i = year; i > this.panel.yearFrom; i--) {
      this.yearToOptions.push(i);
    }
    this.handleModeOneHistoryYearFun();
  }

  handleModeOneHistoryYearFun() {
    const fromYear = this.panel.yearFrom;
    let toYear = this.panel.yearTo;
    const currentY = new Date().getFullYear();
    const currentM = new Date().getMonth() + 1;
    if (toYear === 'This Year') {
      toYear = currentY;
    } else if (!toYear) {
      toYear = fromYear;
    }
    this.timeSelectedArr = [];
    this.timeSelectedArr.push('This Month');
    let count = 12;
    for (let i = toYear; i > fromYear - 1; i--) {
      if (i === currentY) {
        count = currentM;
      } else {
        count = 12;
      }
      for (let j = count; j > 0; j--) {
        let temp;
        if (j < 10) {
          temp = i + '/0' + j;
        } else {
          temp = i + '/' + j;
        }
        this.timeSelectedArr.push(temp);
      }
    }
  }

  handleModeOneCurrentYearFun() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    this.timeSelectedArr = [];
    this.timeSelectedArr.push('This Month');
    for (let i = 12; i > 0; i--) {
      if (i < month + 1) {
        let tempM: any = i;
        if (i < 10) {
          tempM = '0' + i;
        }
        const tempTime = year + '/' + tempM;
        this.timeSelectedArr.push(tempTime)
      }
    }
  }

  getLastDay(year, month) {
    var date = new Date(year, month, 1);
    var lastday = new Date(date.getTime() - 1000 * 60 * 60 * 24).getDate();
    return lastday;
  }

  handleTrueTimeChanged() {
    if (this.panel.trueTime) {
      let firstTime, lastTime;
      const trueTime = this.panel.trueTime;
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const timeArr = trueTime.split('/');
      let firstDay, lastDay;
      if (this.panel.dateMode === 'yyyy/MM') {
        if (this.panel.trueTime === 'This Month') {
          this.timeSrv.setTime({ from: 'now/M', to: 'now/M' });
          return;
        } else {
          firstDay = trueTime + '/01';
          lastDay = trueTime + '/' + this.getLastDay(timeArr[0], timeArr[1]) + ' 23:59:59:999';
          if (Number(timeArr[1]) === month) {
            lastDay = trueTime + '/' + day + ' 23:59:59:999';
          }
        }
      } else {
        if (this.panel.trueTime === 'Today') {
          this.todayFun();
          return;
        } else {
          // Fix setTime bug by Shaun. 2022/06/14
          // Change Date format from YYYY/MM/DD HH:mm:ss:sss to YYYY-MM-DDTHH:mm:ss.sss(ISO 8601 format)
          firstDay = trueTime.replace(/\//g,'-') + 'T00:00:00.000';
          lastDay = trueTime.replace(/\//g,'-') + 'T23:59:59.999';
        }
      }
      // console.log('timeZone',this.timeZoneData);
      // console.log('day',firstDay,lastDay);
      const startTemp = new Date(firstDay);
      const lastTemp = new Date(lastDay);
      // console.log('daytemp',startTemp,lastTemp);
      firstTime = startTemp.getTime();
      lastTime = lastTemp.getTime();
      // console.log('before',firstTime,lastTime);
      if (this.panel.dayFromShift && this.panel.dayFromType) {
        const type = this.panel.dayFromType;
        const data = this.panel.dayFromShift;
        if (type === 'hour') {
          firstTime = firstTime + data * 60 * 60 * 1000;
        } else if (type === 'minute') {
          firstTime = firstTime + data * 60 * 1000;
        } else if (type === 'second') {
          firstTime = firstTime + data * 1000;
        }
      }
      if (this.panel.dayToType && this.panel.dayToShift) {
        const type = this.panel.dayToType;
        const data = this.panel.dayToShift;
        if (type === 'hour') {
          lastTime = lastTime + data * 60 * 60 * 1000;
        } else if (type === 'minute') {
          lastTime = lastTime + data * 60 * 1000;
        } else if (type === 'second') {
          lastTime = lastTime + data * 1000;
        }
      }
      // console.log('timeSrv',this.timeSrv);
      // console.log('after',firstTime,lastTime);
      // console.log(grafanaData.toUtc(firstTime),grafanaData.toUtc(lastTime));
      this.timeSrv.setTime({
        from: grafanaData.toUtc(firstTime),
        to: grafanaData.toUtc(lastTime)
      });
    }
  }


  todayFormatFun(type, data) {
    let lastTime = '';
    if (type === 'hour') {
      lastTime = data + 'h';
    } else if (type === 'minute') {
      lastTime = data + 'm';
    } else if (type === 'second') {
      lastTime = data + 's';
    }
    return lastTime;
  }

  todayFun() {
    let timeToDataValue, timeFromDataValue;
    if (this.panel.dayToType && this.panel.dayToShift) {
      const type = this.panel.dayToType;
      const data = this.panel.dayToShift;
      timeToDataValue = this.todayFormatFun(type, data);
    }
    if (this.panel.dayFromShift && this.panel.dayFromType) {
      const fromType = this.panel.dayFromType;
      const fromData = this.panel.dayFromShift;
      timeFromDataValue = this.todayFormatFun(fromType, fromData);
    }
    let tempToTime = 'now/d';
    if (timeToDataValue) {
      tempToTime = tempToTime + '+' + timeToDataValue;
    }
    let tempFromTime = 'now/d';
    if (timeFromDataValue) {
      tempFromTime = tempFromTime + "+" + timeFromDataValue;
    }
    this.timeSrv.setTime({ from: tempFromTime, to: tempToTime });
  }

  handleYearChanged() {
    if (this.panel.dateMode === 'yyyy/MM') {
      this.panel.yearandMonthTo = '';
      this.panel.yearandMonthFrom = '';
      this.panel.dayToShift = 0;
      this.panel.dayFromShift = 0;
      if (this.panel.yearFrom === 'This Year') {
        this.panel.yearTo = '';
        this.handleModeOneCurrentYearFun();
      } else {
        this.handleYearFromFun();
      }
    } else if (this.panel.dateMode === 'yyyy/MM/dd') {
      this.panel.yearTo = '';
      this.panel.yearFrom = '';
      if (this.panel.yearandMonthFrom === 'This Year/Month') {
        this.panel.yearandMonthTo = '';
        this.handleCurrentYearMonthFun();
      } else {
        this.handleHistoryYearMonthFun();
      }
    }
  }

  handleCurrentYearMonthFun() {
    const date = new Date();
    const year = date.getFullYear();
    let month: any = date.getMonth() + 1;
    const day = date.getDate();
    this.timeSelectedArr = [];
    this.timeSelectedArr.push('Today');
    if (month < 10) {
      month = '0' + month;
    }
    for (let i = day; i > 0; i--) {
      let tempD: any = i;
      if (i < 10) {
        tempD = '0' + i;
      }
      const tempTime = year + '/' + month + '/' + tempD;
      this.timeSelectedArr.push(tempTime);
    }
  }

  handleHistoryYearMonthFun() {
    // only from
    const fromD = this.panel.yearandMonthFrom;
    const toD = this.panel.yearandMonthTo;
    const fromArr = fromD.split("/");
    this.timeSelectedArr = [];
    this.timeSelectedArr.push('Today');
    this.yearMonthToOptions = [];
    this.yearMonthToOptions.push('This Year/Month');
    //from produces to
    const date = new Date();
    const year = date.getFullYear();
    let month: any = date.getMonth() + 1;
    const dayData = date.getDate();
    const fromTimeD = (Number(fromArr[0]));
    const fromMonthTime = (Number(fromArr[1]));
    this.fromProducteToFun(year, fromTimeD, fromMonthTime, month);
    if (!toD) {
      //get this month last day
      const lastD = this.getLastDay(fromArr[0], fromArr[1]);
      for (let i = lastD; i > 0; i--) {
        let d: any = i;
        if (i < 10) {
          d = '0' + d;
        }
        const tempT = fromD + '/' + d;
        this.timeSelectedArr.push(tempT);
      }
    } else {
      this.calDetailsDayFun(toD, year, month, fromTimeD, fromMonthTime, dayData);
    }
  }

  calDetailsDayFun(toD, year, month, fromYearTime, fromMonthTime, dayData) {
    //cal from for to time yyyy/MM
    let tempCurrentYM = toD;
    if (toD === 'This Year/Month') {
      tempCurrentYM = year + '/' + month;
      if (month < 10) {
        tempCurrentYM = year + '/0' + month;
      }
    }
    //timeTo year and Month
    const toArr = tempCurrentYM.split("/");
    const toYearData = Number(toArr[0]);
    const toMonthData = Number(toArr[1]);
    let calStart, calEnd;
    for (let h = toYearData; h > fromYearTime - 1; h--) {
      if (h === year) {
        //current year
        let count = 1;
        if (year === fromYearTime) {
          count = fromMonthTime;
        }
        calStart = toMonthData;
        calEnd = count;
      } else if (h === fromYearTime) {
        let monthTrueData = 12;
        if (h === toYearData) {
          monthTrueData = toMonthData;
        }
        calStart = monthTrueData;
        calEnd = fromMonthTime;
      } else if ((h > fromYearTime) && (h < toYearData)) {
        calStart = 12;
        calEnd = 1;
      } else {
        if (toYearData - fromYearTime === 0) {
          calStart = toMonthData;
          calEnd = fromMonthTime;
        } else if (toYearData - fromYearTime >= 1) {
          if (h === toYearData) {
            calStart = toMonthData;
            calEnd = 1;
          } else if (h === fromYearTime) {
            calStart = 12;
            calEnd = fromMonthTime;
          } else {
            calStart = 12;
            calEnd = 1;
          }
        }
      }
      for (let e = calStart; e > calEnd - 1; e--) {
        let fromYJson = h + '/' + e;
        if (e < 10) {
          fromYJson = h + '/0' + e;
        }
        let tempDayD = this.getLastDay(h, e);
        if (h === year && month === e) {
          tempDayD = dayData;
        }
        for (let t = tempDayD; t > 0; t--) {
          let day20: any = t;
          if (day20 < 10) {
            day20 = '0' + day20;
          }
          const tempTime1 = fromYJson + '/' + day20;
          this.timeSelectedArr.push(tempTime1);
        }
      }
    }
  }

  fromProducteToFun(year, fromTimeD, toTimeD, month) {
    for (let k = year; k > (fromTimeD - 1); k--) {
      let totalSCount, endCount;
      if (k === year) {
        //current year
        let count = 0;
        if (year === fromTimeD) {
          count = toTimeD;
        }
        totalSCount = count;
        endCount = month;
      } else if (k === fromTimeD) {
        //timeRange from year
        totalSCount = toTimeD;
        endCount = 12;
      } else if ((k > fromTimeD) && (k < year)) {
        totalSCount = 0;
        endCount = 12;
      }
      for (let p = endCount; p > totalSCount; p--) {
        let currentyJson = k + '/' + p;
        if (p < 10) {
          currentyJson = k + '/0' + p;
        }
        this.yearMonthToOptions.push(currentyJson);
      }
    }
  }

  handleTimeShiftFun() {
    this.handleTrueTimeChanged();
    this.refreshTimeFlag = true;
    this.onRender();
  }

  link(scope: any, elem: any, attrs: any, ctrl: any) {
    ctrl.elem = elem;
    const panelCententElem = elem.find('.advantechCommonSwitchPanel').parent().parent().parent();
    if (!ctrl.isPc) {
      const id = ctrl.panel.id;
      const panelElem = document.getElementById('panel-' + id);
      panelElem.removeAttribute("class");
      panelCententElem.addClass("mobile-common-switch-overflow-style");
      //panelCententElem.attr('style', 'overflow:visible');
      //panelCententElem.css('overflow', "visible");
    } else {
      panelCententElem.removeClass("mobile-common-switch-overflow-style");
    }
    ctrl.initDefaultI18n();
    const bodyEl = angular.element(this.windowObj.document.body);

    scope.$watch('ctrl.showFlag', (newValue: any) => {
      if (newValue) {
        openDropdown();
      } else {
        switchToLink();
      }
    });

    function openDropdown() {
      ctrl.$timeout(() => { bodyEl.on('click', bodyOnClick); }, 0, false);
    }

    function bodyOnClick(e: any) {
      if (elem.has(e.target).length === 0 && e.target.className && !e.target.className.includes('variable-option')) {
        scope.$apply(() => {
          scope.ctrl.hideDropDownFun();
        });
      }
    }

    function switchToLink() {
      bodyEl.off('click', bodyOnClick);
    }
  }
}


export { commonSwitchPanelCtrl as PanelCtrl };
