import eventsBus from './events-bus'

export default class FloorPanel {
  constructor (floorNumber, isTopFloor) {
    // Button lights enumerator. undefined: both off, 0: up on, 1: down on, true: both on
    this.state = undefined
    this.floorNumber = floorNumber
    this.isTopFloor = isTopFloor
    this.isLobby = floorNumber === 1
    eventsBus.floorArrivalBus.subscribe(this.handleFloorArrivals.bind(this))
  }

  static callElevator (callEvent) {
    eventsBus.callEventBus.onNext(callEvent)
  }

  handleFloorArrivals(e) {
    if (e.floorNumber === this.floorNumber) {
      this.clearState()
    }
  }

  clearState() {
    this.state = undefined
  }

  handleButtonPush (direction) {
    if (direction !== this.state && this.state !== true) {
      this.state = direction
      FloorPanel.callElevator({
        direction,
        floorNumber: this.floorNumber
      })
    }
  }
}
