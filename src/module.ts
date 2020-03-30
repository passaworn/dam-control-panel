import { MetricsPanelCtrl } from 'grafana/app/plugins/sdk';
import defaultsDeep from 'lodash/defaultsDeep';
import _ from 'lodash';
import { DataFrame } from '@grafana/data';
// import axios from 'axios'
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
    imgSize: '150px',
    loading: false,
    loading1: false,
    text: 'Hello World',
    request: 'http',
    method: 'GET',
    damUrl: 'http://dam-server',
    damOptions: {
      control: 'relay',
      relayChanel: '1',
      mqttTopic: '',
      mode: 'toggle',
      switchMode: 'trigger',
      trigMessage: '',
    }
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

  sendData() {
    this.panel.loading = true;
    this.time = 'timenull';
    setTimeout(() => {
      console.log('timeout');
      this.panel.loading = false;
      // this.$scope.ctrl.panel.loading = false;
      // console.log(this.$scope);
      this.time = 'changetimeout';

      this.render();
      this.refresh();
      console.log(this.panel.loading);
    }, 2000);

    // await axios.post('http://www.mocky.io/v2/5e7dc3a930000079004af67c', {
    //   firstName: 'Fred',
    //   lastName: 'Flintstone'
    // })
    // .then((response)=>{
    //   this.panel.loading = false;
    //   console.log(this.panel.loading);
    //   console.log(response);
    // })
    // .catch((error)=>{
    //   this.panel.loading = false;
    //   console.log(this.panel.loading);
    //   console.log(error);
    // });
  }
}

export { SimpleCtrl as PanelCtrl };
