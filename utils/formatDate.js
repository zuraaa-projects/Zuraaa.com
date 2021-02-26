const moment = require('moment-timezone');

module.exports = function formatDate(time, zone, format) {
  return moment(time, format).tz(zone).format(format);
};
