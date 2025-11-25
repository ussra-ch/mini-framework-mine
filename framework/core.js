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
            console.error(`Handler for event ${attribute} is not a function.`);
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


function updateDom(oldVDOM, newVDOM, realElement) {
  if (newVDOM.tag != oldVDOM.tag) {
    const newRealElement = createRealElement(newVDOM)
    realElement.replaceWith(newRealElement);
    return newRealElement
  }
  updateAttributes(realElement, oldVDOM.attrs, newVDOM.attrs)

  const realChildren = Array.from(realElement.childNodes)
  const maxLen = Math.max(oldChildren.length, newChildren.length)
  const oldChildren = oldVDOM.children || [];
  const newChildren = newVDOM.children || [];
  for (let i = 0; i < maxLen; i++) {
    const oldChild = oldChildren[i]
    const newChild = newChildren[i]
    const realChild = realChildren[i]

    // CaseA: Both exist
    if (newChild && oldChild) {
      updateDom(oldChild, newChild, realChild)

    }
    // CaseB: New Child Added
    else if (newChild && !oldChild) {
      // Create the new element and append it to the current real element.
      const newChildElement = createRealElement(newChild)
      realElement.appendChild(newChildElement)

    }
    // CaseC: Old Child Removed (Unmount)
    else if (!newChild && oldChild) {
      // Remove the corresponding real DOM element.
      realElement.removeChild(realChild)
    }
  }
  return realElement
}

function updateAttributes(oldDOM, oldAttributes, newAttributes) {
  oldAttributes = oldAttributes || {}
  newAttributes = newAttributes || {}
  //Loop1 : tl9a ri l elements li tmes7ou
  for (const oldKey of Object.keys(oldAttributes)) {
    if (!(oldKey in newAttributes)) {
      if (oldKey.startsWith('$')) {
        const eventType = oldKey.toLowerCase().substring(1)
        oldDOM.removeEventListener(eventType, oldAttributes[oldKey]);
      } else {
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

function component() {
  return ({
  "tag": "div",
  "attrs": {
    "className": "todoapp"
  },
  "children": [
    {
      "tag": "header",
      "attrs": {
        "className": "header"
      },
      "children": [
        {
          "tag": "h1",
          "attrs": {},
          "children": ["todos"]
        },
        {
          "tag": "input",
          "attrs": {
            "className": "new-todo",
            "placeholder": "What needs to be done?",
            "autofocus": true,
            "$onkeyup": "handleNewTodoEntry"
          },
          "children": []
        }
      ]
    },
    {
      "tag": "section",
      "attrs": {
        "className": "main"
      },
      "children": [
        {
          "tag": "input",
          "attrs": {
            "id": "toggle-all",
            "className": "toggle-all",
            "type": "checkbox",
            "checked": false,
            "$onclick": "handleToggleAll"
          },
          "children": []
        },
        {
          "tag": "label",
          "attrs": {
            "htmlFor": "toggle-all"
          },
          "children": ["Mark all as complete"]
        },
        {
          "tag": "ul",
          "attrs": {
            "className": "todo-list"
          },
          "children": [
            {
              "tag": "li",
              "attrs": {
                "className": "todo active"
              },
              "children": [
                {
                  "tag": "div",
                  "attrs": {
                    "className": "view"
                  },
                  "children": [
                    {
                      "tag": "input",
                      "attrs": {
                        "className": "toggle",
                        "type": "checkbox",
                        "checked": false,
                        "$onclick": "handleToggle(1)"
                      },
                      "children": []
                    },
                    {
                      "tag": "label",
                      "attrs": {
                        "$ondblclick": "handleEdit(1)"
                      },
                      "children": ["Walk the dog"]
                    },
                    {
                      "tag": "button",
                      "attrs": {
                        "className": "destroy",
                        "$onclick": "handleDestroy(1)"
                      },
                      "children": []
                    }
                  ]
                }
              ]
            }
            // ... more <li> items would go here ...
          ]
        }
      ]
    },
    {
      "tag": "footer",
      "attrs": {
        "className": "footer"
      },
      "children": [
        {
          "tag": "span",
          "attrs": {
            "className": "todo-count"
          },
          "children": [
            {
              "tag": "strong",
              "attrs": {},
              "children": ["1"] // Dynamic count
            },
            " item left"
          ]
        },
        {
          "tag": "ul",
          "attrs": {
            "className": "filters"
          },
          "children": [
            {
              "tag": "li",
              "attrs": {},
              "children": [
                {
                  "tag": "a",
                  "attrs": {
                    "className": "selected",
                    "href": "#/",
                    "$onclick": "setFilter('all')"
                  },
                  "children": ["All"]
                }
              ]
            },
            {
              "tag": "li",
              "attrs": {},
              "children": [
                {
                  "tag": "a",
                  "attrs": {
                    "href": "#/active",
                    "$onclick": "setFilter('active')"
                  },
                  "children": ["Active"]
                }
              ]
            },
            {
              "tag": "li",
              "attrs": {},
              "children": [
                {
                  "tag": "a",
                  "attrs": {
                    "href": "#/completed",
                    "$onclick": "setFilter('completed')"
                  },
                  "children": ["Completed"]
                }
              ]
            }
          ]
        },
        {
          "tag": "button",
          "attrs": {
            "className": "clear-completed",
            "$onclick": "handleClearCompleted"
          },
          "children": ["Clear completed"]
        }
      ]
    }
  ]
})
}
const root = document.getElementById('app-root')
render(component, root)
