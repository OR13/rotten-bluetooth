jest.setTimeout(60 * 1000);

const noble = require("@abandonware/noble");
const bleno = require("bleno-mac");

var pizza = require("./pizza/pizza");

//
// The BLE Pizza Service!
//
var PizzaService = require("./pizza/pizza-service");

//
// A name to advertise our Pizza Service.
//
var name = "PizzaSquat";
var pizzaService = new PizzaService(new pizza.Pizza());

describe("scanner", () => {
  it("should advertise", (done) => {
    bleno.on("advertisingStart", function (err) {
      if (!err) {
        console.log("advertising...");
        bleno.setServices([pizzaService]);
        done();
      }
    });
    bleno.on("stateChange", function (state) {
      if (state === "poweredOn") {
        bleno.startAdvertising(name, [pizzaService.uuid], function (err) {
          if (err) {
            console.log(err);
          }
        });
      } else {
        bleno.stopAdvertising();
      }
    });
  });

  it("should discover 3 devices", (done) => {
    let count = 0;
    noble.on("discover", async (peripheral) => {
      // count++;
      console.log(peripheral.id);
      // if (count === 3) {
      //   done();
      // }
    });
    noble.startScanning([], false); // particular UUIDs
  });
});
