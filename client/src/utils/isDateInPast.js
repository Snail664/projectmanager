export default function (dateString) {
  var currentDate = new Date();
  var date = new Date(dateString);

  if (currentDate.getTime() - date.getTime() > 0) {
    return true;
  } else {
    return false;
  }
}
