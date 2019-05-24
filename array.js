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

function isIn(array, value) {
	let isIn = false;
	for(let i in array) {
		if(array[i] === value) {
			isIn = true;
			break;
		}
	}
	return isIn;
}


exports.hasDupliData = hasDupliData;
exports.isIn = isIn;

