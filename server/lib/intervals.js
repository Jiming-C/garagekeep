export const SERVICE_INTERVALS = {
  'Oil change':         { miles: 5000,   months: 6  },
  'Tire rotation':      { miles: 7500,   months: 6  },
  'Brake inspection':   { miles: 12000,  months: 12 },
  'Brake pads':         { miles: 50000,  months: null },
  'Air filter':         { miles: 30000,  months: 24 },
  'Cabin filter':       { miles: 30000,  months: 24 },
  'Battery':            { miles: null,   months: 48 },
  'Coolant flush':      { miles: 100000, months: 60 },
  'Transmission fluid': { miles: 60000,  months: null },
};

export const SERVICE_TYPES = Object.keys(SERVICE_INTERVALS);
