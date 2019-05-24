
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

exports.drawOneFromAll = drawOneFromAll;
exports.drawMultiFromAll = drawMultiFromAll;

