import '@polymer/polymer/polymer-legacy.js';
import 'd2l-localize-behavior/d2l-localize-behavior.js';
import ar from './build/lang/ar.js';
import cy from './build/lang/cy.js';
import da from './build/lang/da.js';
import de from './build/lang/de.js';
import en from './build/lang/en.js';
import esEs from './build/lang/es-es.js';
import es from './build/lang/es.js';
import frFr from './build/lang/fr-fr.js';
import frOn from './build/lang/fr-on.js';
import fr from './build/lang/fr.js';
import ja from './build/lang/ja.js';
import ko from './build/lang/ko.js';
import nl from './build/lang/nl.js';
import pt from './build/lang/pt.js';
import sv from './build/lang/sv.js';
import tr from './build/lang/tr.js';
import zhTw from './build/lang/zh-tw.js';
import zh from './build/lang/zh.js';

window.D2L = window.D2L || {};
window.D2L.PolymerBehaviors = window.D2L.PolymerBehaviors || {};
window.D2L.PolymerBehaviors.SelectOutcomes = window.D2L.PolymerBehaviors.SelectOutcomes || {};

/** @polymerBehavior D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehaviorImpl */
D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehaviorImpl = {
	properties: {
		locale: {
			type: String,
			value: () => {
				const locale = document.documentElement.lang ||
					document.documentElement.getAttribute('data-lang-default') ||
					'en-us';

				return locale.toLowerCase();
			}
		},
		resources: {
			value: () => {
				return {
					'ar': ar,
					'cy': cy,
					'da': da,
					'de': de,
					'en': en,
					'es-es': esEs,
					'es': es,
					'fr-fr': frFr,
					'fr-on': frOn,
					'fr': fr,
					'ja': ja,
					'ko': ko,
					'nl': nl,
					'pt': pt,
					'sv': sv,
					'tr': tr,
					'zh-tw': zhTw,
					'zh': zh
				};
			}
		}
	}
};

/** @polymerBehavior */
window.D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior = [
	D2L.PolymerBehaviors.LocalizeBehavior,
	D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehaviorImpl
];
