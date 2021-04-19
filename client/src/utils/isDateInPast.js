const isDateInPast = (dateString) => {
  var currentDate = new Date();
  var date = new Date(dateString);

  if (currentDate.getTime() - date.getTime() > 0) {
    return true;
  } else {
    return false;
  }
};

export default isDateInPast;
