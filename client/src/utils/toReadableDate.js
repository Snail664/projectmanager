const toReadableDate = (timestamp) => {
  var array = timestamp.split("T");
  return array[0];
};

export default toReadableDate;
