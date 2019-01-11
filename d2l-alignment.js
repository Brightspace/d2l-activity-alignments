/**
`d2l-select-outcomes`

@demo demo/index.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import 'd2l-button/d2l-button-icon.js';
import 'd2l-icons/tier1-icons.js';
import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import 'd2l-polymer-siren-behaviors/store/siren-action-behavior.js';
import 'd2l-hypermedia-constants/d2l-hm-constants-behavior.js';
import 'd2l-outcomes-level-of-achievements/d2l-outcomes-level-of-achievements.js';
import './d2l-alignment-intent.js';
import './localize-behavior.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-alignment">
	<template strip-whitespace="">
		<style>
			:host > div {
				display: flex;
			}

			d2l-alignment-intent {
				flex: 1;
			}

			d2l-button-icon {
				padding-left: 0.25rem;
			}

			:host-context([dir="rtl"]) {
				padding-right: 0.25rem;
				padding-left: 0;
			}

			d2l-outcomes-level-of-achievements {
				margin-top: 0.6rem;
				margin-bottom: 1.5rem;
			}
		</style>

		<div>
			<d2l-alignment-intent href="[[_getIntent(entity)]]" token="[[token]]"></d2l-alignment-intent>
			<template is="dom-if" if="[[_isRemovable(entity, readOnly)]]">
				<d2l-button-icon icon="d2l-tier1:close-default" text="[[localize('removeAlignment')]]" on-click="_remove"></d2l-button-icon>
			</template>
		</div>
		<template is="dom-if" if="[[_hasDemonstrations(entity)]]">
			<d2l-outcomes-level-of-achievements token="[[token]]" href="[[_getDemonstrations(entity)]]" read-only$="[[readOnly]]"></d2l-outcomes-level-of-achievements>
		</template>
	</template>

	
</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({

	is: 'd2l-alignment',

	properties: {
		readOnly: Boolean
	},

	behaviors: [
		D2L.PolymerBehaviors.Siren.EntityBehavior,
		D2L.PolymerBehaviors.Siren.SirenActionBehavior,
		window.D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior,
		window.D2L.Hypermedia.HMConstantsBehavior
	],

	_getIntent: function(entity) {
		return entity && entity.hasLinkByRel(this.HypermediaRels.Outcomes.intent) && entity.getLinkByRel(this.HypermediaRels.Outcomes.intent).href;
	},

	_hasDemonstrations: function(entity) {
		// TODO: Add to hmConstants when this gets finalized
		return entity && entity.hasLinkByRel('https://achievements.api.brightspace.com/rels/demonstration');
	},

	_getDemonstrations: function(entity) {
		// TODO: Add to hmConstants when this gets finalized
		return this._hasDemonstrations(entity) && entity.getLinkByRel('https://achievements.api.brightspace.com/rels/demonstration').href;
	},

	_isRemovable: function(entity, readOnly) {
		if (readOnly) {
			return false;
		}

		if (!entity) {
			return false;
		}

		if (!entity.hasActionByName(this.HypermediaActions.alignments.removeAlignment)) {
			return false;
		}

		return true;
	},

	_remove: function() {
		var action = this.entity && this.entity.getActionByName(this.HypermediaActions.alignments.removeAlignment);
		if (action) {
			this.dispatchEvent(new CustomEvent('d2l-alignment-remove', {
				bubbles: true,
				composed: true,
				detail: {
					entity: this.entity,
					action: action
				}
			}));
			this.performSirenAction(action)
				.catch(function() {})
				.then(function() {
					var alignments = this.entity && this.entity.getLinkByRel('collection');
					if (alignments) {
						window.D2L.Siren.EntityStore.fetch(alignments.href, this.token, true);
					}
				}.bind(this));
		}
	}

});
