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
import 'd2l-polymer-siren-behaviors/store/siren-action-behavior.js';
import { Actions } from 'd2l-hypermedia-constants';
import 'd2l-colors/d2l-colors.js';
import 'd2l-alert/d2l-alert.js';
import 'd2l-loading-spinner/d2l-loading-spinner.js';
import 'd2l-polymer-siren-behaviors/siren-entity-loading.js';
import 'd2l-offscreen/d2l-offscreen.js';
import './d2l-alignment.js';
import './localize-behavior.js';
import './d2l-siren-map-helper.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import 'd2l-typography/d2l-typography.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = /*html*/`<dom-module id="d2l-alignment-list">
	<template strip-whitespace="">
		<style>
			:host {
				display: flex;
				width: 100%;
				max-width: 922px;

				/* The standard button box-shadow width */
				--d2l-alignment-list-overflow-margin: 4px;
			}
			
			.d2l-alignment-list-content {
				display: flex;
				flex-direction: column;
				flex: 1;
				margin: var(--d2l-alignment-list-overflow-margin);
			}

			d2l-loading-spinner {
				width: 100%;
				margin: var(--d2l-alignment-list-overflow-margin);
			}

			siren-entity-loading {
				overflow: hidden;
				width: 100%;
				margin: var(--d2l-alignment-list-overflow-margin);

				--siren-entity-loading-min-height: 10rem;
			}

			siren-entity-loading d2l-loading-spinner {
				--d2l-loading-spinner-size: 10rem;
			}

			ul {
				padding: 0;
				overflow: auto;
				margin: 0;
				margin-top: 0.9rem;
			}

			li {
				position: relative;
				list-style-type: none;
				color: var(--d2l-color-ferrite);

				margin-bottom: 0.9rem;
			}

			li:last-of-type {
				margin-bottom: 0;
			}

			.d2l-alignment-list-editable li {
				padding: 0.6rem;
				padding-right: 0;
				border-top: 1px solid var(--d2l-color-gypsum);
				margin-bottom: 0;
			}

			:host-context([dir="rtl"]) .d2l-alignment-list-editable li {
				padding-right 0.6rem;
				padding-left: 0;
			}

			.d2l-alignment-list-editable li:last-of-type {
				border-bottom: 1px solid var(--d2l-color-gypsum);
			}

			d2l-alert {
				margin-top: 0.5rem;
			}
			
			.alignment-list-header {
				@apply --d2l-heading-3;
				margin-bottom: 0;
			}
		</style>
		<siren-entity-loading href="[[href]]" token="[[token]]">
			<div class="d2l-alignment-list-content">
				<template is="dom-if" if="[[_hasAlignmentsOrEditable(entity, _directAlignmentHrefs, _indirectAlignmentHrefs, readOnly)]]">
					<div>
						<slot name="outcomes-title"></slot>
					</div>
				</template>
				<template is="dom-if" if="[[_hasAlignmentsAndNotEditable(entity, _directAlignmentHrefs, _indirectAlignmentHrefs, readOnly)]]">
					<div>
						<slot name="describe-aligned-outcomes"></slot>
					</div>
				</template>
				<template is="dom-if" if="[[_hasAlignments(_indirectAlignmentHrefs)]]">
					<div class="alignment-list-header">[[localize('indirectAlignments', 'header-title', headerTitle)]]</div>
					<ul aria-busy="[[_loading]]" class$="[[_getClass(entity, true)]]">
						<template is="dom-repeat" items="[[_indirectAlignmentHrefs]]">
							<li>
								<d2l-alignment
									id$="[[id]]-indirect-alignment-intent-[[index]]"
									href="[[item]]"
									token="[[token]]"
									read-only
								></d2l-alignment>
							</li>
						</template>
					</ul>
				</template>
				<template is="dom-if" if="[[_hasAlignments(_directAlignmentHrefs)]]">
					<div class="alignment-list-header">[[localize('directAlignments', 'header-title', headerTitle)]]</div>
					<ul aria-busy="[[_loading]]" class$="[[_getClass(entity, readOnly)]]">
						<template is="dom-repeat" items="[[_directAlignmentHrefs]]">
							<li>
								<d2l-alignment
									id$="[[id]]-direct-alignment-intent-[[index]]"
									href="[[item]]"
									token="[[token]]"
									on-d2l-alignment-remove="_onAlignmentRemove"
									data-index$="[[index]]"
									read-only$="[[readOnly]]"
								></d2l-alignment>
							</li>
						</template>
					</ul>
				</template>
				<template is="dom-repeat" items="[[_alignmentHrefs]]">
					<d2l-siren-map-helper href="[[item]]" token="[[token]]" map="{{_alignmentMap}}"></d2l-siren-map-helper>
				</template>
				<template is="dom-if" if="[[_promiseError]]">
					<d2l-alert type="error">[[localize('error')]]</d2l-alert>
				</template>
			</div>
			<d2l-loading-spinner slot="loading"></d2l-loading-spinner>
			<template is="dom-if" if="[[_isEditable(entity, readOnly)]]">
				<div>
					<slot name="show-select-outcomes"></slot>
				</div>
			</template>
		</siren-entity-loading>
	</template>


</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({

	is: 'd2l-alignment-list',

	behaviors: [
		D2L.PolymerBehaviors.Siren.EntityBehavior,
		D2L.PolymerBehaviors.Siren.SirenActionBehavior,
		window.D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior,
	],

	properties: {
		readOnly: {
			type: Boolean,
			value: false
		},
		_directAlignmentHrefs: {
			type: Array,
			computed: '_getDirectAlignments(_alignmentMap)'
		},
		_indirectAlignmentHrefs: {
			type: Array,
			computed: '_getIndirectAlignments(_alignmentMap)'
		},
		_alignmentHrefs: {
			type: Array,
			computed: '_getAlignmentHrefs(entity)'
		},
		_alignmentMap: Object,
		headerTitle: {
			type: String,
			value: null
		}
	},

	_getClass: function(entity, readOnly) {
		if (this._isEditable(entity, readOnly)) {
			return 'd2l-alignment-list-editable';
		}

		return '';
	},

	_getAlignmentHrefs: function(entity) {
		if (!entity || !entity.entities || !entity.entities.length) {
			return [];
		}

		return entity.entities.map(subentity => subentity.href);
	},

	_getDirectAlignments: function(alignmentMap) {
		if (!alignmentMap) {
			return [];
		}
		return Object.keys(alignmentMap).filter(
			href => alignmentMap[href].properties.relationshipType !== 'referenced'
		);
	},

	_getIndirectAlignments: function(alignmentMap) {
		if (!alignmentMap) {
			return [];
		}
		return Object.keys(alignmentMap).filter(
			href => alignmentMap[href].properties.relationshipType !== 'owned'
		);
	},

	_onAlignmentRemove: function(e) {
		var index = +e.target.dataset.index;
		this.splice('_directAlignmentHrefs', index, 1);

		// Notify screen readers that an alignment has been removed
		var screenReaderAlert = this.create('d2l-offscreen');
		screenReaderAlert.textContent = this.localize('alignmentRemoved');
		this.shadowRoot.appendChild(screenReaderAlert);
		screenReaderAlert.setAttribute('role', 'alert');
		this.async(function() {
			this.shadowRoot.removeChild(screenReaderAlert);
		}.bind(this), 3000);
	},

	_isEditable: function(entity, readOnly) {
		return !readOnly && entity && entity.hasActionByName(Actions.alignments.startUpdateAlignments);
	},

	_hasAlignments: function(alignmentList1, alignmentList2) {
		return (
			(alignmentList1 && alignmentList1.length) ||
			(alignmentList2 && alignmentList2.length)
		);
	},

	_hasAlignmentsAndNotEditable: function(entity, directAlignments, indirectAlignments, readOnly) {
		return !this._isEditable(entity, readOnly) && this._hasAlignments(directAlignments, indirectAlignments);
	},

	_hasAlignmentsOrEditable: function(entity, directAlignments, indirectAlignments, readOnly) {
		return this._hasAlignments(directAlignments, indirectAlignments) || this._isEditable(entity, readOnly);
	}
});
