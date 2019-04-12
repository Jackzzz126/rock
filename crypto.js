var crypto = require("crypto");

function md5(str) {
	return crypto.createHash('md5').update(str).digest("hex");
}

function toBase64(str) {
	let buff = Buffer.from(str);
	return buff.toString('base64');
}

function frombase64(base64Str) {
	let buff = Buffer.from(base64Str, 'base64');
	return buff.toString();
}

//pwd need to be 24 bytes
function encryptStr(rawStr, pwd) {
	var cipher = crypto.createCipher('des-ede3-cbc', pwd);//pwd needs 24 Byte
	var ciph = cipher.update(rawStr, 'utf8', 'hex');
	ciph += cipher.final('hex');
	return ciph;
}

function decryptStr(enStr, pwd) {
	var decipher = crypto.createDecipher('des-ede3-cbc', pwd);
	var txt = decipher.update(enStr, 'hex', 'utf8');
	txt += decipher.final('utf8');
	return txt;
}

exports.md5 = md5;
exports.toBase64 = toBase64;
exports.frombase64 = frombase64;
exports.encryptStr = encryptStr;
exports.decryptStr = decryptStr;

