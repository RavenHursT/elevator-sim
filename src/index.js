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
      description: `Number of seconds to run the simulation for`
    }
  })
  .alias(`h`, `help`)
  .help()
  .argv

let elevators = []
let floorPanels = []

let elevatorCount = yargs.argv.elevators
let floorCount = yargs.argv.floors

for (let i = 1; i <= elevatorCount; i++) {
  elevators.push(new Elevator(i))
}

for (let f = 1; f <= floorCount; f++) {
  floorPanels.push(new FloorPanel(f, f === floorCount))
}


function getRandomDirection () {
  return DIRECTIONS[Object.keys(DIRECTIONS)[Math.floor(Math.random() * 2)]]
}

let intervalHandle = setInterval(() => {
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
}, 500)

setTimeout(() => {
    clearInterval(intervalHandle)
  },
  (yargs.argv.timeout || yargs.argv.timeout === 0) ? yargs.argv.timeout * 1000 : 10000
)
