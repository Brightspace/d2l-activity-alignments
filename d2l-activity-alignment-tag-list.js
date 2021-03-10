import { PolymerElement, html } from '@polymer/polymer';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import 'd2l-polymer-siren-behaviors/store/siren-action-behavior.js';
import OutcomeParserBehavior from './d2l-outcome-parser-behavior.js';
import '@brightspace-ui-labs/multi-select/multi-select-list-item.js';
import '@brightspace-ui-labs/multi-select/multi-select-list.js';
import 'd2l-hypermedia-constants/d2l-hypermedia-constants.js';
import 'd2l-button/d2l-button-icon.js';
import 'd2l-tooltip/d2l-tooltip.js';
import './localize-behavior.js';
import './d2l-siren-map-helper.js';

class ActivityAlignmentTagList extends mixinBehaviors([
	D2L.PolymerBehaviors.Siren.EntityBehavior,
	D2L.PolymerBehaviors.Siren.SirenActionBehavior,
	D2L.PolymerBehaviors.SelectOutcomes.LocalizeBehavior,
	D2L.Hypermedia.HMConstantsBehavior,
	OutcomeParserBehavior
], PolymerElement) {

	static get properties() {
		return {
			readOnly: {
				type: Boolean,
				value: false
			},
			_iconStyle: {
				type: String,
				value: null
			},
			_alignmentHrefs: {
				type: Array,
				computed: '_getAlignmentHrefs(entity)'
			},
			_alignmentMap: Object,
			_intentMap: Object,
			_outcomeMap: Object,
			_mappings: {
				type: Array,
				value: [],
				computed: '_getAlignmentToOutcomeMap(_alignmentHrefs, _alignmentMap, _intentMap, _outcomeMap, hideIndirectAlignments)'
			},
			empty: {
				type: Boolean,
				notify: true,
				readOnly: true,
				computed: '_isEmptyList(_mappings)'
			},
			browseOutcomesText: {
				type: String,
				value: null,
				reflectToAttribute: true
			},
			deferredSave: {
				type: Boolean,
				value: false
			},
			hideIndirectAlignments: {
				type: Boolean,
				value: false
			},
			typeName: {
				type: String,
				value: null,
				reflectToAttribute: true
			},
			title: {
				type: String,
				value: null,
				reflectToAttribute: true
			}
		};
	}

	static get template() {
		return html`
			<style>
				.tag-list-container {
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
				}

				.hidden {
					display: none;
				}
			</style>
			<div class="tag-list-container">
				<d2l-labs-multi-select-list description="[[_getNavigationDescription(title, typeName, readOnly, _mappings)]]">
					<template is="dom-repeat" items="[[_mappings]]">
						<d2l-labs-multi-select-list-item
							text="[[_getOutcomeTextDescription(item)]]"
							short-text="[[_getOutcomeShortDescription(item)]]"
							max-chars="40"
							deletable$="[[_canDelete(item, readOnly)]]"
							on-d2l-labs-multi-select-list-item-deleted="_removeOutcome"
						></d2l-labs-multi-select-list-item>
					</template>
				</d2l-labs-multi-select-list>
				<template is="dom-if" if="[[_canUpdate(entity, readOnly)]]">
					<d2l-button-icon
						icon="d2l-tier1:add"
						aria-label$="[[browseOutcomesText]]"
						style$="[[_iconStyle]]"
						on-click="_updateAlignments"
						id="browse-outcome-button"
					></d2l-button-icon>
					<d2l-tooltip for="browse-outcome-button" position="top">
						[[browseOutcomesText]]
					</d2l-tooltip>
				</template>
			<div>
			<div class="hidden">
				<template is="dom-repeat" items="[[_alignmentHrefs]]">
					<d2l-siren-map-helper href="[[item]]" token="[[token]]" map="{{_alignmentMap}}"></d2l-siren-map-helper>
				</template>
				<template is="dom-repeat" items="[[_getIntentHrefs(_alignmentMap)]]">
					<d2l-siren-map-helper href="[[item]]" token="[[token]]" map="{{_intentMap}}"></d2l-siren-map-helper>
				</template>
				<template is="dom-repeat" items="[[_getOutcomeHrefs(_intentMap)]]">
					<d2l-siren-map-helper href="[[item]]" token="[[token]]" map="{{_outcomeMap}}"></d2l-siren-map-helper>
				</template>
			</div>
		`;
	}

	constructor() {
		super();
		this._alignmentMap = {};
		this._intentMap = {};
		this._outcomeMap = {};

		const userAgent = window.navigator.userAgent;
		if (userAgent.indexOf('Trident/') >= 0) {
			this._iconStyle = 'transform: translateY( -0.6rem );';
		} else if (
			window.navigator.userAgent.indexOf('Edge/') >= 0 ||
			window.navigator.userAgent.indexOf('WebKit') < 0
		) {
			this._iconStyle = 'transform: translateY( -2px );';
		}
	}

	_getAlignmentHrefs(entity) {
		this.dispatchEvent(
			new CustomEvent(
				'd2l-activity-alignment-outcomes-updated', {
					composed: true,
					bubbles: true,
					detail: entity
				}
			)
		);

		if (!entity) return [];

		const alignmentEntities = entity.getSubEntitiesByClass('alignment');

		if (alignmentEntities.some(alignment => alignment.hasLinkByRel && alignment.hasLinkByRel('self'))) {
			return alignmentEntities.map(alignment => alignment.getLinkByRel('self').href);
		}

		return alignmentEntities.map(alignment => alignment.href);
	}

	_getIntentHrefs(alignmentMap) {
		return Object.keys(alignmentMap).map(alignmentHref =>
			alignmentMap[alignmentHref].getLinkByRel(this.HypermediaRels.Outcomes.intent).href
		);
	}

	_getOutcomeHrefs(intentMap) {
		return Object.keys(intentMap).map(intentHref =>
			intentMap[intentHref].getLinkByRel(this.HypermediaRels.Outcomes.outcome).href
		);
	}

	_getAlignmentToOutcomeMap(alignmentHrefs, alignmentMap, intentMap, outcomeMap, hideIndirectAlignments) {
		const mappings = [];
		alignmentHrefs.forEach(alignmentHref => {
			const alignment = alignmentMap[alignmentHref];
			if (!alignment) return;
			if (hideIndirectAlignments && this._isIndirectAlignment(alignment)) return;
			const intent = intentMap[alignment.getLinkByRel(this.HypermediaRels.Outcomes.intent).href];
			if (!intent) return;
			const outcome = outcomeMap[intent.getLinkByRel(this.HypermediaRels.Outcomes.outcome).href];
			if (!outcome) return;
			mappings.push({
				alignmentHref: alignmentHref,
				outcomeEntity: outcome
			});
		});
		return mappings;
	}

	_isEmptyList(mappings) {
		return mappings.length === 0;
	}

	_getOutcomeShortDescription(outcomeMapping) {
		const outcome = outcomeMapping.outcomeEntity;
		if (this.outcomeHasNotation(outcome)) {
			return outcome.properties.notation || outcome.properties.altNotation;
		} else if (this.outcomeHasNotationOrLabel(outcome)) {
			return this.getOutcomeIdentifier(outcome);
		} else {
			return undefined;
		}
	}

	_getOutcomeTextDescription(outcomeMapping) {
		return this.getOutcomeDescriptionPlainText(outcomeMapping.outcomeEntity);
	}

	_canDelete(outcomeMapping, readOnly) {
		if (readOnly) return false;
		const alignment = this._alignmentMap[outcomeMapping.alignmentHref];
		return alignment && alignment.hasActionByName(this.HypermediaActions.alignments.removeAlignment);
	}

	_removeOutcome(event) {
		const alignment = this._alignmentMap[event.model.item.alignmentHref];
		if (!alignment) return;
		const actionName = this.deferredSave ? this.HypermediaActions.alignments.deferredRemoveAlignment : this.HypermediaActions.alignments.removeAlignment;
		const deleteAlignmentAction = alignment.getActionByName(actionName);
		if (!deleteAlignmentAction) return;
		this.performSirenAction(deleteAlignmentAction);
	}

	_canUpdate(entity, readOnly) {
		return !readOnly && entity && entity.hasActionByName(this.HypermediaActions.alignments.startUpdateAlignments);
	}

	_updateAlignments(event) {
		this.dispatchEvent(
			new CustomEvent(
				'd2l-activity-alignment-tags-update',
				{
					composed: true,
					bubbles: true,
					sirenAction: this.entity.getActionByName(this.HypermediaActions.alignments.startUpdateAlignments),
					innerEvent: event
				}
			)
		);
	}

	_isIndirectAlignment(alignment) {
		return alignment && alignment.properties && alignment.properties.relationshipType === 'referenced';
	}

	_getNavigationDescription(title, typeName, readOnly, outcomeMappings) {
		if (!title && !typeName) {
			return;
		}

		if (!typeName) {
			typeName = this.localize('defaultTagType');
		}

		if (!title) {
			title = typeName;
		}

		if (!readOnly) {
			let canDelete = false;

			for (const outcomeMapping of outcomeMappings) {
				if (this._canDelete(outcomeMapping, readOnly)) {
					canDelete = true;

					break;
				}
			}

			if (canDelete) {
				return this.localize('navigationDescription', 'title', title, 'typeName', typeName);
			}
		}

		return this.localize('navigationDescriptionNoActions', 'title', title, 'typeName', typeName);
	}

}

customElements.define('d2l-activity-alignment-tag-list', ActivityAlignmentTagList);
