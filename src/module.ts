import { MetricsPanelCtrl } from 'grafana/app/plugins/sdk';
import defaultsDeep from 'lodash/defaultsDeep';
import _ from 'lodash';
import { DataFrame } from '@grafana/data';
import axios from 'axios';
// import { examples } from './examples';
interface KeyValue {
  key: string;
  value: any;
}
const BASE_FONT_SIZE = 38;
export default class SimpleCtrl extends MetricsPanelCtrl {
  static templateUrl = 'partials/module.html';
  isRelay = true;
  isMqtt = false;
  fontSizes: any[] = [];
  panelDefaults = {
    textButton: 'ON',
    valueFontSize: '80%',
    valueFontSize2: '80%',
    textOnly: false,
    imgOnly: false,
    textImg: true,
    textOnly2: false,
    imgOnly2: false,
    textImg2: true,
    imgGridPer: 0,
    textGridPer: 0,
    imgGridPer2: 0,
    textGridPer2: 0,
    fontSize: '50px',
    textColor: '#C8F2C2',
    bgColor: '#37872D',
    img: 'https://image.flaticon.com/icons/svg/607/607300.svg',
    imgSize: '150',
    textButton2: 'OFF',
    fontSize2: '50px',
    textColor2: '#FFA6B0',
    bgColor2: '#C4162A',
    img2: 'https://image.flaticon.com/icons/svg/2374/2374355.svg',
    imgSize2: '150',
    switchButton: true,
    valueSwitch: '',
    loading: false,
    text: 'Hello World',
    request: 'http',
    // method: 'GET',
    damUrl: 'http://127.0.0.1:1880/test',
    damOptions: {
      control: 'relay',
      relayChanel: '1',
      mqttTopic: '',
      mode: 'toggle',
      switchMode: 'trigger',
      trigMessage: '',
    },
  };

  // Simple example showing the last value of all data
  firstValues: KeyValue[] = [];
  time = 'timenull';
  /** @ngInject */
  constructor($scope, $injector) {
    super($scope, $injector);
    defaultsDeep(this.panel, this.panelDefaults);

    // _.defaults(this.panel, examples[0].config);

    // Get results directly as DataFrames
    (this as any).dataFormat = 'series';
    console.log(document.getElementsByClassName("dam-image"));

    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    this.events.on('render', this.onRender.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));
    this.events.on('panel-initialized', this.onPanelInitalized.bind(this));
  }

  onInitEditMode() {
    this.fontSizes = ['20%', '30%', '50%', '70%', '80%', '100%', '110%', '120%', '150%', '170%', '200%'];
    this.addEditorTab('General', `public/plugins/${this.pluginId}/partials/options.html`, 2);
    this.addEditorTab('Option Controls', `public/plugins/${this.pluginId}/partials/controls.html`, 2);
    this.addEditorTab('Display', `public/plugins/${this.pluginId}/partials/display.html`, 2);
    this.chkNull();
  }

  onRender() {
    console.log('renderr');

    if (!this.firstValues || !this.firstValues.length) {
      return;
    }

    // Tells the screen capture system that you finished
    this.renderingCompleted();
  }

  onDataError(err: any) {
    console.log('onDataError', err);
  }
  onPanelInitalized() {
    this.updateTemplate();
    console.log('onInit');
  }
  // 6.3+ get typed DataFrame directly
  handleDataFrame(data: DataFrame[]) {
    const values: KeyValue[] = [];

    for (const frame of data) {
      for (let i = 0; i < frame.fields.length; i++) {
        values.push({
          key: frame.fields[i].name,
          value: frame.fields[i].values,
        });
      }
    }

    this.firstValues = values;
  }

  onConfigChanged() {
    this.refresh();
  }
  updateTemplate() {
    this.isRelay = this.panel.damOptions.control === 'relay';
    this.isMqtt = this.panel.damOptions.control === 'mqtt';
  }

  modeChanged() {
    this.panel.switchButton = true;
  }
  link(scope, elem, attrs, ctrl) {

    // const panelContainer = (elem.find('.dam-control-panel')[0]);
    // const image = (panelContainer.querySelector('#imageit-image'));
    // const $panelGrid = (elem.find('.dam-control-grid'));
    // const image = (panelContainer.querySelector('#imageit-image'));

    this.events.on('render', () => {
      // const $panelGrid2 = elem.closest('#dam-grid');
      // console.log($panelGrid2);
      // $panelGrid2.css('font-size', '20px');
      // const $panelContainer = elem.find('.panel-container');

      // if (this.panel.bgColor) {
      //   $panelContainer.css('background-color', this.panel.bgColor);
      // } else {
      //   $panelContainer.css('background-color', '');
      // }
      // console.log(ctrl);

    });
  }
  chkNull() {
    if (this.panel.textButton && this.panel.img) {
      this.panel.imgGridPer = 80;
      this.panel.textGridPer = 20;
      this.panel.textImg = true;
      this.panel.imgOnly = false;
      this.panel.textOnly = false;
    } else {
      if (this.panel.textButton) {
        this.panel.textGridPer = 100;
        this.panel.textImg = false;
        this.panel.imgOnly = false;
        this.panel.textOnly = true;
      }
      if (this.panel.img) {
        this.panel.imgGridPer = 100;
        this.panel.textImg = false;
        this.panel.imgOnly = true;
        this.panel.textOnly = false;
      }
    }
    if (this.panel.textButton2 && this.panel.img2) {
      this.panel.imgGridPer2 = 80;
      this.panel.textGridPer2 = 20;
      this.panel.textImg2 = true;
      this.panel.imgOnly2 = false;
      this.panel.textOnly2 = false;
    } else {
      if (this.panel.textButton2) {
        this.panel.textGridPer2 = 100;
        this.panel.textImg2 = false;
        this.panel.imgOnly2 = false;
        this.panel.textOnly2 = true;
      }
      if (this.panel.img2) {
        this.panel.imgGridPer2 = 100;
        this.panel.textImg2 = false;
        this.panel.imgOnly2 = true;
        this.panel.textOnly2 = false;
      }
    }

    console.log(this.panel.textImg, this.panel.imgOnly, this.panel.textOnly);

    this.render();
  }
  calFontSize() {
    const pixelSize = (parseInt(this.panel.valueFontSize, 10) / 100) * BASE_FONT_SIZE;
    this.panel.fontSize = pixelSize + 'px';
    this.render();
  }
  calFontSize2() {
    const pixelSize = (parseInt(this.panel.valueFontSize2, 10) / 100) * BASE_FONT_SIZE;
    this.panel.fontSize2 = pixelSize + 'px';
    this.render();
  }
  sendData(switchONOFF) {
    this.panel.loading = true;
    //   this.render();
    //   this.refresh();
    if (this.panel.damOptions.control === 'relay') {
      // ถ้าเป็น relay แบบ ON,OFF
      if (this.panel.damOptions.mode !== 'toggle') {
        axios
          .post(this.panel.damUrl, {
            key: 'relay' + this.panel.damOptions.relayChanel,
            value: this.panel.damOptions.mode,
          })
          .then(response => {
            this.panel.loading = false;
            console.log(response);
            this.refresh();
          })
          .catch(error => {
            this.panel.loading = false;
            console.log(error);
            this.refresh();
          });
      } else {
        // ถ้าเป็น relay แล้วเป็นแบบ toggle
        if (this.panel.switchButton === false) {
          this.panel.valueSwitch = 'ON';
          console.log(this.panel.valueSwitch);
        } else {
          this.panel.valueSwitch = 'OFF';
          console.log(this.panel.valueSwitch);
        }
        axios
          .post(this.panel.damUrl, {
            key: 'relay' + this.panel.damOptions.relayChanel,
            value: this.panel.valueSwitch,
          })
          .then(response => {
            this.panel.loading = false;
            this.panel.switchButton = !this.panel.switchButton;
            console.log(response);
            this.refresh();
          })
          .catch(error => {
            this.panel.loading = false;
            console.log(error);
            this.refresh();
          });
      }
    } else if (this.panel.damOptions.control !== 'relay') {
      // ถ้า ไม่ เป็น relay แล้วเป็นแบบ trigger
      if (this.panel.damOptions.switchMode === 'trigger') {
        if (this.panel.damOptions.control !== 'mqtt') {
          axios
            .post(this.panel.damUrl, {
              key: this.panel.damOptions.control,
              value: this.panel.damOptions.trigMessage,
            })
            .then(response => {
              this.panel.loading = false;
              console.log(response);
              this.refresh();
            })
            .catch(error => {
              this.panel.loading = false;
              console.log(error);
              this.refresh();
            });
        } else {
          axios
            .post(this.panel.damUrl, {
              key: this.panel.damOptions.control,
              value: this.panel.damOptions.trigMessage,
              topic: this.panel.damOptions.mqttTopic,
            })
            .then(response => {
              this.panel.loading = false;
              console.log(response);
              this.refresh();
            })
            .catch(error => {
              this.panel.loading = false;
              console.log(error);
              this.refresh();
            });
        }
      } else if (this.panel.damOptions.switchMode === 'toggle') {
        if (this.panel.switchButton === false) {
          this.panel.valueSwitch = this.panel.damOptions.ToggleOFFMessage;
        } else {
          this.panel.valueSwitch = this.panel.damOptions.ToggleONMessage;
        }
        if (this.panel.damOptions.control !== 'mqtt') {
          axios
            .post(this.panel.damUrl, {
              key: this.panel.damOptions.control,
              value: this.panel.valueSwitch,
            })
            .then(response => {
              this.panel.loading = false;
              this.panel.switchButton = !this.panel.switchButton;
              console.log(response);
              this.refresh();
            })
            .catch(error => {
              this.panel.loading = false;
              console.log(error);
              this.refresh();
            });
        } else {
          axios
            .post(this.panel.damUrl, {
              key: this.panel.damOptions.control,
              value: this.panel.valueSwitch,
              topic: this.panel.damOptions.mqttTopic,
            })
            .then(response => {
              this.panel.loading = false;
              this.panel.switchButton = !this.panel.switchButton;
              console.log(response);
              this.refresh();
            })
            .catch(error => {
              this.panel.loading = false;
              console.log(error);
              this.refresh();
            });
        }
      }
    }
  }
}

export { SimpleCtrl as PanelCtrl };
