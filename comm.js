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

	var randNum = randNum(allProbs);

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
//des: draw an random obj by given probilities.
//in: array of probilities.
//ret: index drawn.
exports.drawOneFromAll = drawOneFromAll;
//des: draw multi random no-repeat obj by given probilities.
//in: array of probilities.
//ret: indexes drawn.
exports.drawMultiFromAll = drawMultiFromAll;

//des: get byte length of str.
//in: str.
//ret: byte length of the given str.
exports.strByteLength = strByteLength;

//des: check if array has duplicate elements.
//in: array.
//ret: true or false.
exports.hasDupliData = hasDupliData;
exports.expendObj = expendObj;



