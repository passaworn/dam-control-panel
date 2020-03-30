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

export default class SimpleCtrl extends MetricsPanelCtrl {
  static templateUrl = 'partials/module.html';
  isRelay = true;
  isMqtt = false;
  panelDefaults = {
    textButton: 'test',
    fontSize: '50px',
    bgColor: 'rgba(0,255,0,0.5)',
    img: 'https://image.flaticon.com/icons/svg/402/402593.svg',
    imgSize: '150',
    switchButton: false,
    valueSwitch: '',
    loading: false,
    text: 'Hello World',
    request: 'http',
    method: 'GET',
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

    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    this.events.on('render', this.onRender.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));
    this.events.on('panel-initialized', this.onPanelInitalized.bind(this));
  }

  onInitEditMode() {
    this.addEditorTab('General', `public/plugins/${this.pluginId}/partials/options.html`, 2);
    this.addEditorTab('Option Controls', `public/plugins/${this.pluginId}/partials/controls.html`, 2);
    this.addEditorTab('Display', `public/plugins/${this.pluginId}/partials/display.html`, 2);
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

  sendData(switchONOFF) {
    this.panel.loading = true;
    // this.time = 'timenull';
    // setTimeout(() => {
    //   console.log('timeout');
    //   this.panel.loading = false;
    //   // this.$scope.ctrl.panel.loading = false;
    //   // console.log(this.$scope);
    //   this.time = 'changetimeout';

    //   this.render();
    //   this.refresh();
    //   console.log(this.panel.loading);
    // }, 2000);
    if (this.panel.damOptions.control === 'relay') {
      // ถ้าเป็น relay แบบ ON,OFF
      if (this.panel.damOptions.mode !== 'toggle') {
        if (this.panel.method === 'POST') {
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
        } else if (this.panel.method === 'GET') {
          axios
            .get(this.panel.damUrl, {
              // value: this.panel.damOptions.mode,
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
          if (this.panel.method === 'POST') {
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
          } else if (this.panel.method === 'GET') {
            axios
              .get(this.panel.damUrl, {
                // value: this.panel.damOptions.trigMessage,
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
        } else {
          if (this.panel.method === 'POST') {
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
          } else if (this.panel.method === 'GET') {
            axios
              .get(this.panel.damUrl, {
                // value: this.panel.damOptions.trigMessage,
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
