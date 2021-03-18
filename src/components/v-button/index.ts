class Button {
  constructor () {
    console.log(`button组件`)
  }
}

export default class {
  static render () {
    return new Button()
  }
}