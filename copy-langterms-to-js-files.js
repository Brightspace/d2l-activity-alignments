var fs = require('fs');
var buildLangFolder = 'build/lang/';
var buildFiles = fs.readdirSync(buildLangFolder);
var app = 'SelectOutcomes'

// Mapping form json names to behavior lang names
var langMap = {
	'ar': 'Ar',
	'da': 'Da',
	'de': 'De',
	'en': 'En',
	'es': 'Es',
	'fi': 'Fi',
	'fr': 'Fr',
	'ja': 'Ja',
	'ko': 'Ko',
	'nl': 'Nl',
	'pt': 'Pt',
	'sv': 'Sv',
	'tr': 'Tr',
	'zh': 'Zh',
	'zh-tw': 'ZhTw'
};

// loop through all json files
buildFiles.forEach(function(filename, index) {
	// get lang name from file
	this[index] = filename.substring(0, filename.length-3)
	try {
		var langJSON = fs.readFileSync(`lang/${this[index]}.json`, 'utf8');
		writeJSLangFile(langMap[this[index]], langJSON, filename);

	}
	catch (err) {
		console.log(err);
	}
}, buildFiles);

// hardcoded strings since all files follow the same format
// replacing double quotes with single quotes and using double tabs for spacing issues
// TODO: Fix 2nd last bracket spacing
function writeJSLangFile(lang, langJSON, filename) {
	var langName = lang.charAt(0).toLowerCase() + lang.substring(1, lang.length);
	var contents = `import '@polymer/polymer/polymer-legacy.js';
window.D2L = window.D2L || {};
window.D2L.PolymerBehaviors = window.D2L.PolymerBehaviors || {};
window.D2L.PolymerBehaviors.${app} = window.D2L.PolymerBehaviors.${app} || {};
window.D2L.PolymerBehaviors.${app}.LocalizeBehavior = window.D2L.PolymerBehaviors.${app}.LocalizeBehavior || {};

/*
* ${lang} lang terms
* @polymerBehavior D2L.PolymerBehaviors.${app}.LocalizeBehavior.Lang${lang}Behavior
 */
D2L.PolymerBehaviors.${app}.LocalizeBehavior.Lang${lang}Behavior = {
	${langName}: ${JSON.stringify(JSON.parse(langJSON), null, "\t\t").replace(/"/g, '\'')}
};
`;
	fs.writeFile(buildLangFolder + filename, contents, function (err) {
		if (err) {
			console.log(err);
		}
	});
}