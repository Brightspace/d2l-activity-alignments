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

import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import 'd2l-hypermedia-constants/d2l-hm-constants-behavior.js';
import 'd2l-alert/d2l-alert.js';
import './d2l-alignment-list.js';
import './localize-behavior.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-activity-alignments">
	<template strip-whitespace="">
		<style>
			:host {
				display: flex;
			}

			.d2l-activity-alignments-main {
				flex: 1;
				display: flex;
				flex-direction: column;
				height: 100%;
				z-index: 0;
			}
		</style>
		<div class="d2l-activity-alignments-main">
			<d2l-alignment-list href="[[_getAlignments(entity)]]" token="[[token]]" read-only$="[[readOnly]]">
				<slot name="outcomes-title" slot="outcomes-title"></slot>
				<slot name="show-select-outcomes" slot="show-select-outcomes"></slot>
				<slot name="describe-aligned-outcomes" slot="describe-aligned-outcomes"></slot>
			</d2l-alignment-list>
			<template is="dom-if" if="[[_showError]]">
				<d2l-alert type="error">[[localize('error')]]</d2l-alert>
			</template>
		</div>
	</template>

	
</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({

	is: 'd2l-activity-alignments',

	properties: {
		readOnly: Boolean,

		_showError: {
			type: Boolean,
			value: false
		}
	},

	behaviors: [
		D2L.PolymerBehaviors.Siren.EntityBehavior,
		window.D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior,
		window.D2L.Hypermedia.HMConstantsBehavior
	],

	ready: function() {
		this._boundHandleError = this._handleError.bind(this);
	},

	attached: function() {
		this._showError = false;
		this.addEventListener('d2l-siren-entity-error', this._boundHandleError);
	},

	detached: function() {
		this.removeEventListener('d2l-siren-entity-error', this._boundHandleError);
	},

	_handleError: function() {
		this._showError = true;
	},

	_getAlignments: function(entity) {
		return entity && entity.hasLinkByRel(this.HypermediaRels.Alignments.alignments) && entity.getLinkByRel(this.HypermediaRels.Alignments.alignments).href;
	}

});
