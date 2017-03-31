import eventsBus from './events-bus'
import Rx from 'rx'

export default class Elevator {
  constructor (id) {
    this.id = id
    this.isIdle = true
    this.currentFloor = 1
    this.destinationStream = new Rx.Subject()
    this.destinationStream
      .subscribe(this.handleAddDestinationEvent.bind(this))

    eventsBus.callEventBus.subscribe(this.handleCallEvent.bind(this))
  }

  handleAddDestinationEvent (e) {
    if(e) {
      this.gotoFloor(e.floorNumber)
    }
  }

  handleCallEvent(e) {
    if (this.isIdle && !e.claimedBy) {
      console.log(`elevator-${this.id} captured call event =>`, e)
      e.claimedBy = this
      this.destinationStream.onNext(e)
    } else {
      console.warn(`claimed call event ignored by elevator-${this.id}`)
    }
  }

  gotoFloor(floorNumber) {
    this.isIdle = false
    setTimeout(() => {
      this.arriveAtFloor(floorNumber)
    }, 2000)
  }

  arriveAtFloor (floorNumber) {
    console.info(`elevator-${this.id} arrived at floor-${floorNumber}`)
    this.isIdle = true
    this.currentFloor = floorNumber
    eventsBus.floorArrivalBus.onNext({
      elevator: this,
      floorNumber
    })
  }
}
