import React from 'react';
import logo from './logo.svg';
import './App.css';
import _ from "lodash";

class App extends React.Component {

constructor (props){
  super(props);

  this.state = {
    rows: 3,
    chairsPerRow: 11,
    reservedSeats: ["R1C1","R1C4","R2C5"], 
    numberOfSeatsToReserve: "",

  }
};

displayRows(){
  return _.times(this.state.rows, r => <div className="row">{this.displayColumns(r)}</div>);
}
displayColumns(r){
 return _.times(this.state.chairsPerRow, c => {
    let seat = `R${r + 1}C${c + 1}`
      return <div className={this.getSeatStyling(seat)}>{seat}</div>
    }
  );
}
getSeatStyling(seat){
if (_.includes(this.state.reservedSeats, seat)) {
return "reserved seat"
  }
  return "seat"
}
// values or scores assigned to best seats to determine availability in a row
calculateDistanceFromGoal(goalRow, goalColumn, row, column) {
  let d = Math.abs(row + 1 - goalRow) + Math.abs(column + 1 -goalColumn);
  return d;
}

calculateBestSeats(){
  const goalSeat = {row: 1, column: 6}; //This is best seat! 
  let seatName = "";
  let availableSeatMap = [];

  _.times(this.state.rows, r => 
    _.times(this.state.chairsPerRow, c => {

//Checking through the rows and columns to find a seat
      seatName = `R${r+1}C${c+1}`;
//Checking to see what seats are available

      if (!_.includes(this.state.reservedSeats, seatName)){
        availableSeatMap.push({
          seatName: seatName,
          distanceFromGoal: this.calculateDistanceFromGoal(
            goalSeat.row,
            goalSeat.column,
            r,
            c
          )
        });
      }
    })
  )
  return availableSeatMap;
}
getBestScore(availableSeatMap) {
  let scores = _.uniqBy(availableSeatMap, "distanceFromGoal");
  let min = _.minBy(scores, s => s.distanceFromGoal);
  return min;
}
reserveSeats(){
  const availableSeatMap = this.calculateBestSeats();
  if (this.state.numberOfSeatsToReserve == 1 ){
    let bestScore = this.getBestScore(availableSeatMap);
    for (let s of availableSeatMap) {
      if (s.distanceFromGoal === bestScore.distanceFromGoal) {
      console.log(s.seatName);
      var newReservedSeatMap = this.state.reservedSeats.concat(s.seatName);
      this.setState({ reservedSeats: newReservedSeatMap, numberOfSeatsToReserve: ""});
      }
    }
  }
}

render(){
  return (
    <div className="App">
      <label>How many seats would you like?
      <input 
      type="text"
      value={this.state.numberOfSeatsToReserve}
      onChange={n => 
        this.setState({ numberOfSeatsToReserve: n.target.value})
        }
      />
      <button onClick={() => this.reserveSeats()}>Submit</button>
      </label> 

       {this.displayRows()}
       {console.log(this.calculateBestSeats())}

    </div>
    );
  }
}

export default App;
