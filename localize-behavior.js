import '@polymer/polymer/polymer-legacy.js';
import 'd2l-localize-behavior/d2l-localize-behavior.js';
import ar from './lang/ar.js';
import cy from './lang/cy.js';
import da from './lang/da.js';
import de from './lang/de.js';
import en from './lang/en.js';
import esEs from './lang/es-es.js';
import es from './lang/es.js';
import frFr from './lang/fr-fr.js';
import frOn from './lang/fr-on.js';
import fr from './lang/fr.js';
import ja from './lang/ja.js';
import ko from './lang/ko.js';
import nl from './lang/nl.js';
import pt from './lang/pt.js';
import sv from './lang/sv.js';
import tr from './lang/tr.js';
import zhTw from './lang/zh-tw.js';
import zh from './lang/zh.js';

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
