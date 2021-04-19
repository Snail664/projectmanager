export default function (dateString) {
  var currentDate = new Date();
  var date = new Date(dateString);
  if (date.getTime() - currentDate.getTime() < 0) {
    return false;
  } else if (date.getTime() < currentDate.getTime() + 604800000) {
    return true;
  } else {
    return false;
  }
}
