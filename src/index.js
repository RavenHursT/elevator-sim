import FloorPanel from './floor-panel'
import Elevator from './elevator'
import {DIRECTIONS} from './consts'
import 'console-info'
import 'console-warn'
import 'console-error'
import yargs from 'yargs'

yargs.usage(`$0 -f {floorCount} -e {elevatorCount}`)
  .example(
    `$0 --floors=5 --elevators=4 -t `,
    `Will start simulator w/ 30 floors and 6 elevators`
  )
  .options({
    f: {
      alias: `floors`,
      number: true,
      demandOption: true
    },
    e: {
      alias: `elevators`,
      number: true,
      demandOption: true
    },
    t: {
      alias: `timeout`,
      number: true,
      description: `Number of seconds to run the simulation for`,
      default: 10
    }
  })
  .alias(`h`, `help`)
  .help()

let elevators = []
let floorPanels = []

const elevatorCount = yargs.argv.elevators
const floorCount = yargs.argv.floors

const simDuration = yargs.argv.timeout * 1000

let simIsRunning = true

for (let i = 1; i <= elevatorCount; i++) {
  elevators.push(new Elevator(i))
}

for (let f = 1; f <= floorCount; f++) {
  floorPanels.push(new FloorPanel(f, f === floorCount))
}

function getRandomInt (int) {
  return Math.floor(Math.random() * int)
}

setTimeout(() => {
  simIsRunning = false
}, simDuration)

function initUser () {
  if (simIsRunning) {
    const floorIndex = Math.floor(Math.random() * floorPanels.length)
    const floorPanel = floorPanels[floorIndex]
    console.info(`floor-${floorIndex + 1} Current panel state =>`, floorPanel.state)
    let direction = getRandomDirection()

    direction = (floorPanel.isLobby && direction === DIRECTIONS.DOWN) ?
      DIRECTIONS.UP : direction
    direction = (floorPanel.isTopFloor && direction === DIRECTIONS.UP) ?
      DIRECTIONS.DOWN : direction

    console.info(`floor-${floorIndex + 1} pushing button =>`, direction)
    floorPanel.handleButtonPush(direction)
    setTimeout(initUser, getRandomInt(200) + 50)
  }
}

initUser()

function getRandomDirection () {
  return DIRECTIONS[Object.keys(DIRECTIONS)[getRandomInt(2)]]
}
