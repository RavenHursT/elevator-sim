import Rx from 'rx'

export default {
  callEventBus: new Rx.Subject(),
  floorArrivalBus: new Rx.Subject()
}