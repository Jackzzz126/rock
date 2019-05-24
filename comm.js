function randStr(len)
{
	var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqretuvwxyz0123456789";
	var ret = '';
	for(var i = 0; i < len; i++) {
		ret += chars[randNum(chars.length)];
	}
	return ret;
}

function randNum(maxNum)//return range:[0, maxNum -1 ]
{
	return Math.floor(Math.random() * maxNum);
}

function strByteLength(str)
{
	var len = 0;
	var charCode;
	for(var i = 0; i < str.length; i++)
	{
		charCode = str.charCodeAt(i);
		if(charCode >= 0 && charCode <= 128)
		{
			len += 1;
		}
		else
		{
			len += 2;
		}
	}
	return len;
}

function expendObj(obj1, obj2)
{
	if(!obj1) {
		obj1 = {};
	}
	for(let k in obj2)
	{
		if(typeof(obj2[k]) === "number" ||
			typeof(obj2[k]) === "string" ||
			typeof(obj2[k]) === "boolean"
		){
			obj1[k] = obj2[k];
		} else if(typeof(obj2[k]) === "object") {
			obj1[k] = expendObj(obj1[k], obj2[k]);
		} else {//function or undefined
			continue;
		}
		
	}
	return obj1;
}

//des: create a random str.
//in: str length
//ret: random str with given length
exports.randStr = randStr;
//des: create a random num.
//in: range max
//ret: random num , >=0 and < max
exports.randNum = randNum;
//des: get byte length of str.
//in: str.
//ret: byte length of the given str.
exports.strByteLength = strByteLength;

exports.expendObj = expendObj;

