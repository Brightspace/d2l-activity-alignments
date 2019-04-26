var fs = require('fs');
var buildLangFolder = 'build/lang/';
var langFolder = 'lang/';
var buildFiles = fs.readdirSync(buildLangFolder);
var app = 'SelectOutcomes'

// Mapping form json names to behavior lang names
langMap = {
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
	this[index] = filename.substring(0, filename.length-3)
	try {
		var lang_json = fs.readFileSync(`lang/${this[index]}.json`, 'utf8');
		writeJSLangFile(langMap[this[index]], lang_json, filename);

	}
	catch (err) {
		console.log(err);
	}
}, buildFiles);


function writeJSLangFile(lang, lang_json, filename) {
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
	${lang.toLowerCase()}: ${JSON.stringify(JSON.parse(lang_json), null, "\t\t").replace(/"/g, '\'')}
};
`;
	fs.writeFile(buildLangFolder+filename, contents, function (err) {
		if (err) {
			console.log(err);
		}
	});
}