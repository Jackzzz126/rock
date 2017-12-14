var crypto = require('crypto');
//var http = require("http");

function validStr(str)
{
	if(typeof(str) === "string")
	{
		return true;
	}
	return false;
}

function validNum(num)
{
	if(typeof(num) === "number")
	{
		return true;
	}
	return false;
}

function verifySignature() {
	var str = "";
	for(var i = 1; i < arguments.length; i++) {
		str += arguments[i];
	}
	str += 'hwi=UhRi#+iY;oo^rDRMrVwhx9DRauAGd5DVEr%?rvyNqf@@R_?PPA0cK?ff$HO(';
	var signature = crypto.createHash('md5').update(str).digest("hex");
	if(signature === arguments[0])
	{
		return true;
	}
	return false;
}

function toIdString(str) {
	return crypto.createHash('md5').update(str).digest("base64").substr(0, 22);
}

function getRandStr(len)
{
	var chars = "`~=+-_/?;:!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqretuvwxyz0123456789";
	var ret = '';
	for(var i = 0; i < len; i++) {
		ret += chars[getRandNum(82)];
	}
	return ret;
}

function getRandNum(maxNum)//return range:[0, maxNum -1 ]
{
	return Math.floor(Math.random() * maxNum);
}

function getCharId()
{
       var charId = "";

       var firstDigit = getRandNum(9) + 1;
       charId += firstDigit;
       for(var i = 1; i < 9; i++)
       {
               var otherDigit = getRandNum(10);
               charId += otherDigit;
       }

       return parseInt(charId);
}

function drawMultiFromAll(probs, count)
{
	var indexes = [];
	for(var i in probs)
	{
		indexes.push(i);
	}

	var drawnIndexes = [];
	while(drawnIndexes.length !== count)
	{
		var index = drawOneFromAll(probs);
		//save index
		drawnIndexes.push(parseInt(indexes[index]));
		//remove
		probs.splice(index, 1);
		indexes.splice(index, 1);
		if(probs.length < 1)
		{
			break;
		}
	}

	return drawnIndexes;
}

function drawOneFromAll(probs)
{
	var allProbs = 0;
	for(var i in probs)
	{
		allProbs += probs[i];
	}

	var randNum = getRandNum(allProbs);

	var probSum = 0;
	for(i in probs)
	{
		probSum += probs[i];
		if(randNum < probSum)
		{
			return parseInt(i);
		}
	}
	throw new Error("error in draw by probs: " + JSON.stringify(probs));
}

function getNewToken() {
	return getRandStr(6);
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

function removeAttr(obj, attr)
{
	var newObj = {};
	for(var item in obj)
	{
		if(item !== (attr + ""))
		{
			newObj[item] = obj[item];
		}
	}
	return newObj;
}

function hasDupliData(array)
{
	for(var i in array)
	{
		for(var j = i + 1; j < array.length; j++)
		{
			if(array[i] === array[j])
			{
				return true;
			}
		}
	}
	return false;
}

function clone(oldObj)
{
	if(typeof(oldObj) === 'object')
	{
		var newObj;
		if(oldObj.constructor === Array)
		{
			newObj = [];
		}
		else
		{
			newObj = {};
		}
			
		for(var i in oldObj)
		{
			newObj[i] = clone(oldObj[i]);
		}
		return newObj;
	}
	else
	{
		return oldObj;
	}
}

function copyProperty(sourceObj, targetObj)
{
	for(var k in sourceObj)
	{
		if(sourceObj[k] === null || sourceObj[k] === undefined)
		{
			continue;
		}
		if(typeof(sourceObj[k]) === "number")
		{
			targetObj[k] = sourceObj[k];
		}
		else if(typeof(sourceObj[k]) === "string")
		{
			targetObj[k] = sourceObj[k];
		}
		else if(typeof(sourceObj[k]) === "boolean")
		{
			targetObj[k] = sourceObj[k];
		}
		else if(typeof(sourceObj[k]) === "object")
		{
			if((typeof sourceObj[k].length === 'number') &&
				(typeof sourceObj[k].splice === 'function'))
			{
				targetObj[k] = [];
				for(var j = 0; j < sourceObj[k].length; j++)
				{
					targetObj[k].push(sourceObj[k][j]);
				}
			}
			else
			{
				targetObj[k] = {};
				copyProperty(sourceObj[k], targetObj[k]);
			}
		}
		else//function or undefined
		{
			continue;
		}
		
	}
}

function isInt(num)
{
	return (Math.round(num) === num);
}

//des: checK if is str type.
//in: any value
//ret: true or false
exports.validStr = validStr;
//des: checK if is num type.
//in: any value
//ret: true or false
exports.validNum = validNum;

//des: trans str to id str (digest, 22 chars).
//in: str
//ret: id str
exports.toIdString = toIdString;
//des: create a random str.
//in: str length
//ret: random str with given length
exports.getRandStr = getRandStr;
//des: create a new token(random str with 6 chars).
//in: null
//ret: new token
exports.getNewToken = getNewToken;
//des: create a random num.
//in: range max
//ret: random num , >=0 and < max
exports.getRandNum = getRandNum;
//des: draw an random obj by given probilities.
//in: array of probilities.
//ret: index drawn.
exports.drawOneFromAll = drawOneFromAll;
//des: draw multi random no-repeat obj by given probilities.
//in: array of probilities.
//ret: indexes drawn.
exports.drawMultiFromAll = drawMultiFromAll;

//des: check is signature right.
//in: signature, other args.
//ret: true or false.
exports.verifySignature = verifySignature;
//des: get byte length of str.
//in: str.
//ret: byte length of the given str.
exports.strByteLength = strByteLength;

//des: remove attr from given obj.
//in: obj, attr to remove.
//ret: new obj without given attr.
exports.removeAttr = removeAttr;
//des: check if array has duplicate elements.
//in: array.
//ret: true or false.
exports.hasDupliData = hasDupliData;
//des: clone obj.
//in: obj to clone.
//ret: clone of the given obj.
exports.clone = clone;
//des: copy attrs(without funcitons) from obj to obj.
//in: source and target obj.
//ret: null.
exports.copyProperty = copyProperty;
//des: generate char id of 9 numbers.
//in: none.
//ret: char id of 9 numbers.
exports.getCharId = getCharId;
//des: check if a number is int.
//in: num to check.
//ret: true or false.
exports.isInt = isInt;



