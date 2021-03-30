import '@polymer/polymer/polymer-legacy.js';
import 'd2l-localize-behavior/d2l-localize-behavior.js';
import './build/lang/ar.js';
import './build/lang/cy.js';
import './build/lang/da.js';
import './build/lang/de.js';
import './build/lang/en.js';
import './build/lang/es-es.js';
import './build/lang/es.js';
import './build/lang/fr-fr.js';
import './build/lang/fr-on.js';
import './build/lang/fr.js';
import './build/lang/ja.js';
import './build/lang/ko.js';
import './build/lang/nl.js';
import './build/lang/pt.js';
import './build/lang/sv.js';
import './build/lang/tr.js';
import './build/lang/zh-tw.js';
import './build/lang/zh.js';

window.D2L = window.D2L || {};
window.D2L.PolymerBehaviors = window.D2L.PolymerBehaviors || {};
window.D2L.PolymerBehaviors.SelectOutcomes = window.D2L.PolymerBehaviors.SelectOutcomes || {};

/** @polymerBehavior D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehaviorImpl */
D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehaviorImpl = {
	properties: {
		locale: {
			type: String,
			value: function() {
				var locale = document.documentElement.lang
					|| document.documentElement.getAttribute('data-lang-default')
					|| 'en-us';
				return locale.toLowerCase();
			}
		},
		resources: {
			value: function() {
				return {
					'ar': this.ar,
					'cy': this.cy,
					'da': this.da,
					'de': this.de,
					'en': this.en,
					'es-es': this.esEs,
					'es': this.es,
					'fr-fr': this.frFr,
					'fr-on': this.frOn,
					'fr': this.fr,
					'ja': this.ja,
					'ko': this.ko,
					'nl': this.nl,
					'pt': this.pt,
					'sv': this.sv,
					'tr': this.tr,
					'zh-tw': this.zhTw,
					'zh': this.zh
				};
			}
		}
	}
};
/** @polymerBehavior */
window.D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior = [
	D2L.PolymerBehaviors.LocalizeBehavior,
	D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehaviorImpl,
	D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangArBehavior,
	D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangCyBehavior,
	D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangDaBehavior,
	D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangDeBehavior,
	D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangEnBehavior,
	D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangEsEsBehavior,
	D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangEsBehavior,
	D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangFrFrBehavior,
	D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangFrOnBehavior,
	D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangFrBehavior,
	D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangJaBehavior,
	D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangKoBehavior,
	D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangNlBehavior,
	D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangPtBehavior,
	D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangSvBehavior,
	D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangTrBehavior,
	D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangZhTwBehavior,
	D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior.LangZhBehavior
];
