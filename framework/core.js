// had l function kachd lia l VDOM mn 3and l user wkatkhdm hia b DOm bach trj3o real DOM
function createRealElement(element) {
  if (element.tag == 'text') {

  }
  const newElement = document.createElement(element.tag) // there is a special tag = text rdi balk mno mn ba3d :)
  const HTMLevents = [] //binma 3raft ach khas ydar bihoum wsafi

  // const newElement = []
  // let listners = []
  if (element.attrs && Object.keys(element.attrs).length > 0) {
    newElement.__listeners__ = [];
    for (attribute in element.attrs) {
      if (element.attrs.hasOwnProperty(attribute)) {
        if (attribute.startsWith("on")) {
          HTMLevents.push(element.attrs[attribute])
        } else if (attribute.startsWith("$")) {
          const event = attribute.slice(1)
          const func = element.attrs[attribute]
          if (typeof func === 'function') {
            newElement.EventListener(event, func)
            newElement.__listeners__.push({
              type: event,
              handler: func
            });
          } else {
            console.error(`Handler for event ${key} is not a function.`);
          }
        } else {
          newElement.setAttribute(attribute, element.attrs[attribute])
        }
      }
    }
  }
  if (element.children == undefined || element.children.length == 0) {
    return newElement
  }

  element.children.forEach(node => {
    const realChild = createRealElement(node)
    // if (realChild != undefined){
    newElement.appendChild(realChild)
    // newElement.push(realChild)
    // }
  });
  return newElement
}

// let currentComponent = null;
// currentComponent.hookIndex = 0
// const hookStorage = new Map();

function runComponent(componentFunction) {
  currentComponent = componentFunction
  if (!hookStorage.has(componentFunction)) {
    hookStorage.set(componentFunction, [])
  }
  componentFunction.stateIndex = 0
  const VDOM = componentFunction()
  currentComponent = null;
  return VDOM
}

function render(componentFunction, rootContainer) {
  const oldDOM = rootContainer.__lastDom__
  if (oldDOM) {
    unmount(oldDOM)
    rootContainer.removeChild(oldDOM)
  }
  const VDOM = runComponent(componentFunction);
  const newDom = createRealElement(VDOM)
  rootContainer.appendChild(newDom)
  rootContainer.__lastDom__ = newDom
  currentComponent = newDom
}

function unmount(oldDOM) {
  if (oldDOM.__listeners__) {
    const listenersToRemove = oldDOM.__listeners__;

    listenersToRemove.forEach(listener => {
      oldDOM.removeEventListener(listener.type, listener.handler);
    });

    delete oldDOM.__listeners__;
  }

  const children = oldDOM.children
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    unmount(child)
  }
}
const hookStates = [] //hada howa l value dyal l component f had lmap : hookStorage
// let hookIndex = 0;

// function useState(initialValue) {
//   if (!currentComponent) {
//     throw new Error("useState must be called inside a component function.")
//   }

//   const componentState = stateStorage.get(currentComponent)
//   const index = currentComponent.stateIndex

//   if (index === componentState.length) {
//     const stateObj = {
//       value: initialValue,
//       setValue: function (newValue) {
//         stateObj.value = newValue
//         //3ayt l re-render tani
//         const rootContainer = document.getElementById('app-root')
//         render(currentComponent, rootContainer)
//       }
//     }
//     componentState.push(stateObj)
//   }
//   currentComponent.stateIndex++;
//   return [componentState[index].value, componentState[index].setValue]
// }
let currentComponent = null;
currentComponent.hookIndex = 0
const hookStorage = new Map();
function useState(initialValue) {
  if (!currentComponent) {
    throw new Error("useState must be called inside a component function.")
  }
  if (!hookStorage.get(currentComponent)) {
    hookStorage.set(currentComponent, [])
  }
  const currentIndex = currentComponent.hookIndex;
  // hookStates[currentIndex] = hookStates[currentIndex] || initialValue;
  hookStorage.get(currentComponent)[currentIndex] = hookStorage.get(currentComponent)[currentIndex] || initialValue
  if (currentIndex === hookStorage.get(currentComponent).length) {
    const stateObj = {
      value: initialValue,
      setValue: function (newValue) {
        const value = hookStorage.get(currentComponent)[currentIndex]
        const arcals = c.get(inde)
        if (value != newValue){
          hookStorage.get(currentComponent)[inde]= newValue;
          // stateObj.value = newValue;
          const rootContainer = document.getElementById('app-root');
          render(currentComponent, rootContainer);
        }
      }
    };
  }

  currentComponent.hookIndex++;
  return [hookStorage[currentComponent][currentIndex], setState];
}

c = map (1 : [calfun1, calfun2])

function useEffect() {
  if (!currentComponent) {
    throw new Error("useEffect must be called inside a component function (during render).");
  }
  //kanjibo l useState variables kamlin dyal dak l component
  const componentState = stateStorage.get(currentComponent);
  const index = currentComponent.effectIndex || 0; //had l index bach n3arfo achmn useEffect ra7na. kanbdaw mn 0
}

createRealElement({
  "tag": "html",
  "attrs": {
    "type": "1",
  },
  "children": [
    {
      "tag": "div",
      "attrs": {
        "class": "2"
      },
      "children": [
        {
          "tag": "input",
          "attrs": {
            "type": "3",
          }
        },
        {
          "tag": "input",
          "attrs": {
            "type": "4",
          }
        }
      ]
    }
  ]
})