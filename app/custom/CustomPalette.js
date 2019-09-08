const SUITABILITY_SCORE_HIGH = 100,
      SUITABILITY_SCORE_AVERGE = 50,
      SUITABILITY_SCORE_LOW = 25;

import { saveAs } from 'file-saver';
import diagramXML from '../../resources/diagram.bpmn';

export default class CustomPalette {

  constructor(bpmnFactory, create, elementFactory, palette, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }

 

  getPaletteEntries(element) {
    const {
      bpmnFactory,
      create,
      elementFactory,
      translate
    } = this;

    function onInputFileChange(event) {
      console.log('onInputFileChange');
      if (typeof window.bpmnModeler !== 'undefined') {
        const files = this.files;
        // const url = URL.createObjectURL(files[0]);
  
        const reader = new FileReader();
        reader.onload = function(){
          const text = reader.result;
          const bpmnModeler = window.bpmnModeler;
          bpmnModeler.importXML(text, function(err) {
            if (err) {
              console.error('something went wrong:', err);
            }
            bpmnModeler.get('canvas').zoom('fit-viewport');
            // modeler.addCustomElements(customElements);
          });
          // console.log(text);
        };
        reader.readAsText(files[0]);
      }
      this.value = null;
    }
  

    function createTask(suitabilityScore, shapeType) {
     
      return function(event) {
        
        const businessObject = bpmnFactory.create('bpmn:Task');
  
        businessObject.suitable = suitabilityScore;
        if (typeof shapeType !== 'undefined') {
          businessObject.shapeType = shapeType;
        }
  
        const shape = elementFactory.createShape({
          type: 'bpmn:Task',
          businessObject: businessObject
        });
  
        create.start(event, shape); 
      }
    }

    return {
      // 'create.low-task': {
      //   group: 'activity',
      //   className: 'bpmn-icon-task red',
      //   title: translate('Create Task with low suitability score'),
      //   action: {
      //     dragstart: createTask(SUITABILITY_SCORE_LOW),
      //     click: createTask(SUITABILITY_SCORE_LOW)
      //   }
      // },
      // 'create.average-task': {
      //   group: 'activity',
      //   className: 'bpmn-icon-task yellow',
      //   title: translate('Create Task with average suitability score'),
      //   action: {
      //     dragstart: createTask(SUITABILITY_SCORE_AVERGE),
      //     click: createTask(SUITABILITY_SCORE_AVERGE)
      //   }
      // },
      // 'create.high-task': {
      //   group: 'activity',
      //   className: 'bpmn-icon-task green',
      //   title: translate('Create Task with high suitability score'),
      //   action: {
      //     dragstart: createTask(SUITABILITY_SCORE_HIGH),
      //     click: createTask(SUITABILITY_SCORE_HIGH)
      //   }
      // },
       'create.ironman-task': {
        group: 'activity',
        className: 'icon-custom-ironman',
        title: translate('ironman'),
        action: {
          dragstart: createTask(200, 'ironman'),
          click: createTask(200, 'ironman')
        }
      },
      'create.superman-task': {
        group: 'activity',
        className: 'icon-custom-superman',
        title: translate('superman'),
        action: {
          dragstart: createTask(200, 'superman'),
          click: createTask(200, 'superman')
        }
      },
      'create.batman-task': {
        group: 'activity',
        className: 'icon-custom-batman',
        title: translate('batman'),
        action: {
          dragstart: createTask(200, 'batman'),
          click: createTask(200, 'batman')
        }
      },
      'create.save-task': {
        group: 'activity',
        className: 'icon-save',
        title: translate('save'),
        action: {
          click: function(event) {
            // alert('save');
            if (typeof window.bpmnModeler !== 'undefined') {
              window.bpmnModeler.saveXML({ format: true }, function (err, xml) {
                   console.log('xml ', xml);
                  //  localStorage.setItem('xml',xml);
                   const blob = new Blob([xml], {type: "text/plain;charset=utf-8"});
                   saveAs(blob, "save.xml");
                  // const blob = new Blob([xml], {type: "text/plain;charset=utf-8"});
                  // saveAs(blob, "save.xml");
                  //here xml is the bpmn format 
              });
            }
          }
        }
      },
      'create.load-task': {
        group: 'activity',
        className: 'icon-load',
        title: translate('load'),
        action: {
          click: function(event) {
            // alert('save');
            if (typeof window.bpmnModeler !== 'undefined') {
              // const data = localStorage.getItem('xml');
              // if (data) {
              //   console.log(data);
              //   window.bpmnModeler.importXML(data, function(err) {
              //     if (err) {
              //       console.error('something went wrong:', err);
              //     }
              //     window.bpmnModeler.get('canvas').zoom('fit-viewport');
              //     // modeler.addCustomElements(customElements);
              //   });
              // }
              const inputFile = document.getElementById('inputFile');
              if (inputFile !== null && typeof inputFile.addEventListener !== 'undefined') {
                console.log('create.load-task');
                inputFile.removeEventListener("change", onInputFileChange, false);
                inputFile.addEventListener("change", onInputFileChange, false);
                inputFile.click();
              }
            }
          }
        }
      },
      'create.clear-task': {
        group: 'activity',
        className: 'icon-clear',
        title: translate('clear'),
        action: {
          click: function(event) {
            // alert('save');
            if (typeof window.bpmnModeler !== 'undefined') {
              const bpmnModeler = window.bpmnModeler;
              bpmnModeler.importXML(diagramXML, function(err) {
                if (err) {
                  console.error('something went wrong:', err);
                }
                bpmnModeler.get('canvas').zoom('fit-viewport');
                // modeler.addCustomElements(customElements);
              });
              
            }
          }
        }
      },
    }
  }
}

CustomPalette.$inject = [
  'bpmnFactory',
  'create',
  'elementFactory',
  'palette',
  'translate'
];