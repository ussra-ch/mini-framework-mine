const hookStorage = new Map();
let currentComponent = null;
let __previousVDOM__ = null;
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
            newElement.addEventListener(event, func)
            newElement.__listeners__.push({
              type: event,
              handler: func
            });
          } else {
            console.error(`Handler for event ${key} is not a function.`);
          }
        } else if (attribute == 'className') {
          newElement.setAttribute('class', element.attrs[attribute])
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
  currentComponent = componentFunction

  const newVDOM = runComponent(componentFunction);
  if (oldDOM) {
    // unmount(oldDOM)
    // rootContainer.removeChild(oldDOM)
    updateDom(__previousVDOM__, newVDOM, oldDOM);
  } else {
    const newDom = createRealElement(newVDOM)
    rootContainer.appendChild(newDom)
    rootContainer.__lastDom__ = newDom
  }
  __previousVDOM__ = newVDOM;
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


function component() {
  const [name, setName] = useState("Jane");
  const [count, setCount] = useState(10);

  console.log("count 1 ", count);
  setCount(20)
  console.log("name 2 ", name);
}
const root = document.getElementById('app-root')
render(component, root)


function updateDom(oldDOM, newDOM) {
  if (newDOM.tag != oldDOM.tag){
    createRealElement(newDOM)
  }
  updateAttributes(oldDOM, oldDOM.attrs, newDOM.attrs)
  newDOM.forEach((oldDOM)=>{
    updateDom(oldDOM, newDOM)
  })
}

function updateAttributes(oldDOM, oldAttributes, newAttributes) {
  oldAttributes = oldAttributes || {}
  newAttributes = newAttributes || {}
  //Loop1 : tl9a ri l elements li tmes7ou
  for (const oldKey of Object.keys(oldAttributes)) {
    if (!(oldKey in newAttributes)) {
      if (oldKey.startsWith('$')) {
        const eventType = oldKey.toLowerCase().substring(1);
        oldDOM.removeEventListener(eventType, oldAttributes[oldKey]);
      }else{
        oldDOM.removeAttribute(oldKey)
      }
    }
  }

  //Loop2 : t handle l add w modify
  for (const newKey in newAttributes) {
    const oldValue = oldAttributes[newKey]
    const newValue = newAttributes[newKey]

    if (oldValue != newValue) {
      if (newKey.startsWith("$")) {
        const event = newKey.slice(1)
        const func = newValue
        if (typeof func === 'function') {
          if (oldValue) {
            oldDOM.removeEventListener(event, oldValue);
          }
          oldDOM.addEventListener(event, func)
          oldDOM.__listeners__.push({
            type: event,
            handler: func
          });
        } else {
          console.error(`Handler for event ${key} is not a function.`);
        }
      } else if (newKey == 'className') {
        oldDOM.setAttribute('class', newValue)
      } else {
        oldDOM.setAttribute(newKey, newValue)
      }
    }

  }
}