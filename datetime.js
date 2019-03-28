function date2Str(date)
{
	function format(i)
	{
		return (i < 10) ? "0" + i : "" + i;
	}
	var str = format(date.getFullYear()) + "-";
	str = str + format(date.getMonth()+1) + "-";
	str = str + format(date.getDate()) + " ";
	str = str + format(date.getHours()) + ":";
	str = str + format(date.getMinutes()) + ":";
	str = str + format(date.getSeconds()) + "";
	return str;
}

function str2Date(dateStr)
{
	var array0 = dateStr.split(" ");
	var array1 = array0[0].split("-");
	var array2 = array0[1].split(":");
	var array = array1.concat(array2);
	if(array.length !== 6 ||
		array[0] > 9999 ||
		array[1] > 12 ||
		array[2] > 31 ||
		array[3] > 23 ||
		array[4] > 59 ||
		array[5] > 59 ||
		array[0] < 0 ||
		array[1] < 1 ||
		array[2] < 1 ||
		array[3] < 0 ||
		array[4] < 0 ||
		array[5] < 0
		)
	{
		throw new Error('Error when convert string to date: ' + dateStr);
	}
	var date = new Date();
	date.setFullYear(parseInt(array[0], 10), parseInt(array[1], 10) - 1, parseInt(array[2], 10));
	date.setHours(parseInt(array[3], 10), parseInt(array[4], 10), parseInt(array[5], 10));
	return date;
}

function date2TimeStamp(date)
{
	return Math.floor(date.getTime() / 1000);
}

function timeStamp2Date(timeStamp)
{
	var date = new Date();
	date.setTime(timeStamp * 1000);
	return date;
}

function date2TimeStampLocal(date)
{
	return Math.floor(date.getTime() / 1000) - date.getTimezoneOffset() * 60;
}


function timeStamp()
{
	var now = new Date();
	return date2TimeStamp(now);
}

function timeStampLocal()
{
	var now = new Date();
	return date2TimeStampLocal(now);
}

function timeOfDay()
{
	return timeStampLocal() % (60 * 60 * 24);
}

function timeStr2TimeOfDay(timeStr)
{
	var dateStr = "2016-02-20 " + timeStr;
	var date = str2Date(dateStr);
	return date2TimeStampLocal(date) % (60 * 60 * 24);
}

function validDateStr(str)
{
	try
	{
		str += " 23:10:10";
		str2Date(str);
		return true;
	}
	catch (err)
	{
		return false;
	}
}
function validTimeStr(str)
{
	try
	{
		str = "2015-05-08 " + str;
		str2Date(str);
		return true;
	}
	catch (err)
	{
		return false;
	}
}


function isSameDay(timeStamp1, timeStamp2)
{
	var now = new Date();
	timeStamp1 -= now.getTimezoneOffset() * 60;
	timeStamp2 -= now.getTimezoneOffset() * 60;

	var day1 = Math.floor(timeStamp1 / (60 * 60 * 24));
	var day2 = Math.floor(timeStamp2 / (60 * 60 * 24));
	return day1 === day2;
}

function isSameWeek(timeStamp1, timeStamp2)
{
	var now = new Date();
	timeStamp1 -= now.getTimezoneOffset() * 60;
	timeStamp2 -= now.getTimezoneOffset() * 60;

	var startDate = str2Date("1970-01-04 00:00:00");
	var startTimeStamp = date2TimeStampLocal(startDate);

	var week1 = Math.floor((timeStamp1 - startTimeStamp) / (60 * 60 * 24 * 7));
	var week2 = Math.floor((timeStamp2 - startTimeStamp) / (60 * 60 * 24 * 7));

	return week1 === week2;
}

function isSameMonth(timeStamp1, timeStamp2)
{
	var date1 = timeStamp2Date(timeStamp1);
	var monthNum1 = date1.getFullYear() * 12 + date1.getMonth();

	var date2 = timeStamp2Date(timeStamp2);
	var monthNum2 = date2.getFullYear() * 12 + date2.getMonth();

	return monthNum1 === monthNum2;
}

function isSameYear(timeStamp1, timeStamp2)
{
	var date1 = timeStamp2Date(timeStamp1);
	var yearNum1 = date1.getFullYear();

	var date2 = timeStamp2Date(timeStamp2);
	var yearNum2 = date2.getFullYear();

	return yearNum1 === yearNum2;
}

function getDays(timeStamp)
{
	var now = new Date();
	timeStamp -= now.getTimezoneOffset() * 60;
	return Math.floor(timeStamp / (60 * 60 * 24));
}

//des: trans date obj to str format.(can't handle DST)
//in: timeStamp
//ret: date in str format, such as "2015-08-05 23:42:05"
exports.date2Str = date2Str;
//des: trans str to date obj.(can't handle DST)
//in: date in str format.
//ret: data obj.
exports.str2Date = str2Date;
//des: trans date obj to timestamp.
//in: date obj
//ret: time stamp num
exports.date2TimeStamp = date2TimeStamp;
//des: trans date obj to timestamp in loacl time.
//in: date obj
//ret: time stamp num in local time
exports.date2TimeStampLocal = date2TimeStampLocal;
//des: trans timestamp to date obj .
//in: time stamp num
//ret: date obj
exports.timeStamp2Date = timeStamp2Date;
//des: get current time stamp.(seconds from 1970-01-01 00:00:00)
//in: null
//ret: time stamp
exports.timeStamp = timeStamp;
//des: get current time stamp in local time.(seconds from 1970-01-01 00:00:00)
//in: null
//ret: time stamp in local time
exports.timeStampLocal = timeStampLocal;
//des: get current time stamp of day(local timeStamp % (60 * 60 * 24)).
//in: date obj
//ret: time stamp of day
exports.timeOfDay = timeOfDay;
//des: get time stamp of day(local timeStamp % (60 * 60 * 24)) by time str.
//in: time str
//ret: time stamp of day
exports.timeStr2TimeOfDay = timeStr2TimeOfDay;
//des: check date str format.
//in: date str(no time).
//ret: true or false.
exports.validDateStr = validDateStr;
//des: check time str format.
//in: time str(no date).
//ret: true or false.
exports.validTimeStr = validTimeStr;
//des: in same day
//in: two time stamp
//ret: true or false.
exports.isSameDay = isSameDay;
//des: in same week
//in: two time stamp
//ret: true or false.
exports.isSameWeek = isSameWeek;
//des: in same month
//in: two time stamp
//ret: true or false.
exports.isSameMonth = isSameMonth;
//des: in same year
//in: two time stamp
//ret: true or false.
exports.isSameYear = isSameYear;
//des: get days.(1970-01-01 00:00:00)
//in: timeStamp
//ret: days num from 1970-01-01 00:00:00
exports.getDays = getDays;

