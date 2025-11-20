
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
const hookStorage = new Map();
let currentComponent = null;
// currentComponent.hookIndex = 0
// const hookStorage = new Map();

function runComponent(componentFunction) {
  // currentComponent = componentFunction

  if (!hookStorage.has(componentFunction)) {
    hookStorage.set(componentFunction, [])
    hookStorage.get(componentFunction)[0] = 1
  }

  // componentFunction.stateIndex = 0
  const VDOM = componentFunction()

  // currentComponent = null;
  return VDOM
}

function render(componentFunction, rootContainer) {
  const oldDOM = rootContainer.__lastDom__
  if (oldDOM) {
    unmount(oldDOM)
    rootContainer.removeChild(oldDOM)
  }
  currentComponent = componentFunction
  const VDOM = runComponent(componentFunction);
  const newDom = createRealElement(VDOM)
  rootContainer.appendChild(newDom)
  rootContainer.__lastDom__ = newDom
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
// let currentComponent = null;
function useState(initialValue) {
  const value = hookStorage.get(component);

  const temp = hookStorage.get(currentComponent)
  const currectIndex = temp[0]

  //set that value f blasthaa
  hookStorage.get(currentComponent)[currectIndex] = initialValue

  //setValue
  const setterFunc = (newValue) => {
    hookStorage.get(currentComponent)[currectIndex] = newValue
    
    //Call re-render
    // render()
  }

  hookStorage.get(currentComponent)[0]++
  return [hookStorage.get(currentComponent)[currectIndex], setterFunc]
}

function useEffect() {
  if (!currentComponent) {
    throw new Error("useEffect must be called inside a component function (during render).");
  }
  //kanjibo l useState variables kamlin dyal dak l component
  const componentState = stateStorage.get(currentComponent);
  const index = currentComponent.effectIndex || 0; //had l index bach n3arfo achmn useEffect ra7na. kanbdaw mn 0
}

function component() {
  const [name, setName] = useState("Jane");
  const [count, setCount] = useState(10);

  console.log("count 1 ", count);
  setCount(20)
  console.log("name 2 ", name);
}
const root = document.getElementById('app-root')
render(component, root)