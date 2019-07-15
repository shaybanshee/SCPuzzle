import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: 3,
      chairsPerRow: 11,
      // These seat reservations, now, are only for initilly populating the grid.
      // Future reservation information will be held in the 2d array itself.
      initialSeatReservations: ["R3C11", "R1C6"],
      // this seat map will now be a proper 2d array, but for now it's empty
      seatMap: [],
      numberOfSeatsToReserve: ""
    };
  }

  componentDidMount() {
    // on mount, based on the number of rows and chairsPerRow in state, this creates a 2d
    // array. Each point in this array has a seat name, whether the seat is reserved,
    // and it's distance from the goat seat.
    let newSeatMap = [];
    let name;
    const goalSeat = { row: 1, column: 6 };

    _.times(this.state.rows, r => {
      let seats = [];
      _.times(this.state.chairsPerRow, c => {
        name = `R${r + 1}C${c + 1}`;
        seats.push({
          name: name,
          row: r,
          column: c,
          isReserved: _.includes(this.state.initialSeatReservations, name),
          distanceFromGoal: this.calculateDistanceFromGoal(
            goalSeat.row,
            goalSeat.column,
            r,
            c
          )
        });
      });
      newSeatMap.push(seats);
    });
    this.setState({ seatMap: newSeatMap });
  }

  componentDidUpdate() {
    //This is just so that every time things change, I can see what the state looks
    // like in the console, just for easy debugging. Will need to die eventually.
    console.log(this.state);
  }

  determineSeatStyling(isReserved) {
    if (isReserved) {
      return "seat reserved";
    }
    return "seat";
  }

  calculateDistanceFromGoal(goalRow, goalColumn, row, column) {
    let d = Math.abs(row + 1 - goalRow) + Math.abs(column + 1 - goalColumn);
    return d;
  }

  displaySeats(row) {
    // called by displayRows, and maps over the specific seats in seatMap, and
    // after checking if the seat is reserved, wraps the name in a div styled
    // based on whether or not it's reserved
    return _.map(row, seat => {
      return (
        <div
          className={this.determineSeatStyling(seat.isReserved)}
          key={seat.name}
        >
          {seat.name}
        </div>
      );
    });
  }

  displaySeatMap() {
    // maps over the rows in seatMap and tucks them into styled divs for proper display
    return _.map(this.state.seatMap, (r, rowIndex) => (
      <div className="row" key={`row${rowIndex}`}>
        {this.displaySeats(r)}
      </div>
    ));
  }

  reserveSeats() {
   
    // do stuff here
    // go over the SeatMap to see if there are numberOfSeatsToReserve;
    //return _.map(this.state.seatMap, this.state.numberOfSeatsToReserve) => ()
    
    let bestScore = 9999; 
    let bestSeats = [];
    console.log("AMITWICE?");
    for (let i = 0; i < this.state.seatMap.length; i++) {
      for(let j = 0; j < this.state.seatMap[i].length; j++){
        let count = 0; 
        let currentScore = 0;
        let currentSeats = [];
        let openSeatsInARow = 0; 
        while (
            this.state.seatMap[i][j + count] && 
            !this.state.seatMap[i][j + count].isReserved && 
            openSeatsInARow < this.state.numberOfSeatsToReserve) {
              currentScore = currentScore + this.state.seatMap[i][j + count].distanceFromGoal
              currentSeats.push(this.state.seatMap[i][j + count])
              count++ 
              openSeatsInARow++
            }
            if (openSeatsInARow == this.state.numberOfSeatsToReserve) {
              if (currentScore < bestScore) {
                bestScore = currentScore
                bestSeats = currentSeats
              } 
            }
          } console.log(bestSeats);
        }
          let seatMapClone = _.clone(this.state.seatMap);

          if (_.isEmpty(bestSeats)) {
            alert ("Not Available");
          } else {
          _.map(bestSeats, seat => {
              seatMapClone[seat.row][seat.column].isReserved = true;
          });
          this.setState({seatMap: seatMapClone});
            }    
    //once we get the return from that this fcn must also deny us if grouping of seats is not available
    // we need to find the lowest scored group of available numberofSeatsToReserve
    //we need to update the state of the seat in the seatmap to isReserved:true 
    //show visual of isReserved:true, best seats 
      }
   displayAvailableSeats(){
     let seatsAvailable = 0;

     for (let i = 0; i < this.state.seatMap.length; i++) {
      for(let j = 0; j < this.state.seatMap[i].length; j++){
        if (!this.state.seatMap[i][j].isReserved) {
          seatsAvailable++
          }
        }
      }
      return <div>{seatsAvailable}</div>;
    }


  render() {
    return (
      <div>
        <div className="row">
          <label className="text1 row">
            How many seats would you like to reserve?
            <input
              type="text"
              value={this.state.numberOfSeatsToReserve}
              onChange={n =>
                this.setState({ numberOfSeatsToReserve: n.target.value })
              }
            />
            <button onClick={() => this.reserveSeats()}>Submit</button>
          </label>
        </div>
          <div className="text1">
            {this.displaySeatMap()}
          </div>
        <div>
          <label className="text1 row">Number of seats remaining:<span> {this.displayAvailableSeats()}</span></label>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  navigation: PropTypes.object
};

export default App;
