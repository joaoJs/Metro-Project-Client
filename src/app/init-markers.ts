export class Init {
  load() {
    if(localStorage.getItem('markers') === null ||
      localStorage.getItem('markers') === undefined) {
        console.log('No Markers found... creating...');

        const markers = [
          {
            name: "miami",
            lat: 25.7617,
            lng: -80.1918
            //draggable: true
          },
          {
            name: "sao paulo",
            lat: -23.5505199,
            lng: -46.63330939999999
            //draggable: true
          }
        ];

        localStorage.setItem('markers', JSON.stringify(markers));
    } else {
      console.log("Loading Markers...");
    }
  }
}
