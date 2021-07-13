import { LocalizeMixin } from './LocalizeMixin';
import { OutcomeParserMixin } from './OutcomeParserMixin.js';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { css, html } from 'lit-element';
import { Rels, Actions } from 'd2l-hypermedia-constants';
import '@brightspace-ui-labs/multi-select/multi-select-list-item.js';
import '@brightspace-ui-labs/multi-select/multi-select-list.js';
import 'd2l-button/d2l-button-icon.js';
import 'd2l-tooltip/d2l-tooltip.js';
import './localize-behavior.js';
import './d2l-siren-map-helper.js';


class ActivityAlignmentTagList extends LocalizeMixin(OutcomeParserMixin(EntityMixinLit(LitElement))) {

	static get is() { return 'd2l-activity-alignment-tag-list'; }

	static get styles() {
		return css`
			.hidden {
				display: none;
			}
		`;
	}
	static get properties() {
		return {
			readOnly: {
				type: Boolean,
				attribute: 'read-only'
			},
			_iconStyle: {
				type: String
			},
			_alignmentHrefs: {
				type: Array
			},
			_alignmentMap: Object,
			_intentMap: Object,
			_outcomeMap: Object,
			_mappings: {
				type: Array,
				value: [],
				computed: '_getAlignmentToOutcomeMap(_alignmentHrefs, _alignmentMap, _intentMap, _outcomeMap, hideIndirectAlignments)'
			},
			_hasUpdateAction: {
				type: Boolean
			},
			//TODO: create event to notify parent
			empty: {
				type: Boolean
			},
			browseOutcomesText: {
				type: String,
				attribute: 'browse-outcomes-text',
				reflect: true
			},
			deferredSave: {
				type: Boolean,
				attribute: 'deferred-save'
			},
			hideIndirectAlignments: {
				type: Boolean,
				attribute: 'hide-indirect-alignments'
			},
			typeName: {
				type: String,
				attribute: 'type-name',
				reflect: true
			},
			title: {
				type: String,
				reflect: true
			}
		};
	}

	constructor() {
		super();

		this.browseOutcomesText = null;
		this.deferredSave = false;
		this.empty = false;
		this.hideIndirectAlignments = false;
		this.readOnly = false;
		this.title = null;
		this.typeName = null;
		this._alignmentHrefs = [];
		this._alignmentMap = {};
		this._intentMap = {};
		this._hasUpdateAction = false;
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

		//this._setEntityType() //Need to define entity item first

	}

	render() {
		const navigationDescription = this._getNavigationDescription(this.title, this.typeName, this.readOnly, this._mappings);
		const intentHrefs = this._getIntentHrefs(this._alignmentMap);
		const outcomeHrefs = this._getOutcomeHrefs(this._intentMap);
		return html`
			<d2l-labs-multi-select-list description="${navigationDescription}">
				${this._mappings.map(item => this._renderListItem(item))}
				${this._canUpdate(this._hasUpdateAction, this.readOnly) ? this._renderAddItemButton() : html``}
			</d2l-labs-multi-select-list>
			<div class="hidden">
				${this._alignmentHrefs.map(item => this._renderSirenMapHelper(item, this._alignmentMap))}
				${intentHrefs.map(item => this._renderSirenMapHelper(item, this._intentMap))}
				${outcomeHrefs.map(item => this._renderSirenMapHelper(item, this._outcomeMap))}
			</div>
		`;
	}

	_canDelete(outcomeMapping, readOnly) {
		if (readOnly) return false;
		const alignment = this._alignmentMap[outcomeMapping.alignmentHref];
		return alignment && alignment.hasActionByName(Actions.alignments.removeAlignment);
	}
	
	_canUpdate(hasUpdateAction, readOnly) {
		return !readOnly && hasUpdateAction;
	}

	set _entity(entity) {
		if (this._entityHasChanged(entity)) {
			this._onEntityChanged(entity);
			super._entity = entity;
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

	_getAlignmentToOutcomeMap(alignmentHrefs, alignmentMap, intentMap, outcomeMap, hideIndirectAlignments) {
		const mappings = [];
		alignmentHrefs.forEach(alignmentHref => {
			const alignment = alignmentMap[alignmentHref];
			if (!alignment) return;
			if (hideIndirectAlignments && this._isIndirectAlignment(alignment)) return;
			const intent = intentMap[alignment.getLinkByRel(Rels.Outcomes.intent).href];
			if (!intent) return;
			const outcome = outcomeMap[intent.getLinkByRel(Rels.Outcomes.outcome).href];
			if (!outcome) return;
			mappings.push({
				alignmentHref: alignmentHref,
				outcomeEntity: outcome
			});
		});
		return mappings;
	}

	_getIntentHrefs(alignmentMap) {
		return Object.keys(alignmentMap).map(alignmentHref =>
			alignmentMap[alignmentHref].getLinkByRel(Rels.Outcomes.intent).href
		);
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

	_getOutcomeHrefs(intentMap) {
		return Object.keys(intentMap).map(intentHref =>
			intentMap[intentHref].getLinkByRel(Rels.Outcomes.outcome).href
		);
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

	_isEmptyList(mappings) {
		return mappings.length === 0;
	}

	_isIndirectAlignment(alignment) {
		return alignment && alignment.properties && alignment.properties.relationshipType === 'referenced';
	}

	_onEntityChanged(entity) {
		if (!entity) {
			return;
		}

		this._hasUpdateAction = entity.hasActionByName(Actions.alignments.startUpdateAlignments);

		entity.subEntitiesLoaded().then(() => {
			this._alignmentHrefs = this._getAlignmentHrefs(entity);
		});
	}

	_removeOutcome(event) {
		const alignment = this._alignmentMap[event.model.item.alignmentHref];
		if (!alignment) return;
		const actionName = this.deferredSave ? Actions.alignments.deferredRemoveAlignment : Actions.alignments.removeAlignment;
		const deleteAlignmentAction = alignment.getActionByName(actionName);
		if (!deleteAlignmentAction) return;
		this.performSirenAction(deleteAlignmentAction);
	}

	_renderAddItemButton() {
		return html`
			<d2l-button-icon
				icon="d2l-tier1:add"
				aria-label="${browseOutcomesText}"
				style="${this._iconStyle}"
				@click="${this._updateAlignments}"
				id="browse-outcome-button"
			></d2l-button-icon>
			<d2l-tooltip for="browse-outcome-button" position="top">
				${this.browseOutcomesText}
			</d2l-tooltip>
		`;
	}
	
	_renderListItem(item) {
		const outcomeTextDescription = this._getOutcomeTextDescription(item);
		const outcomeShortDescription = this._getOutcomeShortDescription(item);
		const canDelete = _canDelete(item, this.readOnly);
		const deletedCallback = this._removeOutcome;
		return html`
			<d2l-labs-multi-select-list-item
				text="${outcomeTextDescription}"
				short-text="${outcomeShortDescription}"
				max-chars="40"
				deletable$="${canDelete}"
				@on-d2l-labs-multi-select-list-item-deleted"${deletedCallback /* TODO: determine where this event is triggered */}"
			></d2l-labs-multi-select-list-item>		
		`;
	}

	_renderSirenMapHelper(item, map) {
		//TODO: map attribute had a 2-way data binding - set up events for this
		return html`
			<d2l-siren-map-helper href="${item}" token="${this.token}" map="${map}"></d2l-siren-map-helper>
		`;
	}

	_updateAlignments(event) {
		this.dispatchEvent(
			new CustomEvent(
				'd2l-activity-alignment-tags-update',
				{
					composed: true,
					bubbles: true,
					sirenAction: this.entity.getActionByName(Actions.alignments.startUpdateAlignments),
					innerEvent: event
				}
			)
		);
	}

}

customElements.define(ActivityAlignmentTagList.is, ActivityAlignmentTagList);