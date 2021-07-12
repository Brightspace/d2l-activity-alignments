/**
`d2l-alignment`

@demo demo/index.html
*/

import 'd2l-button/d2l-button-icon.js';
import 'd2l-icons/tier1-icons.js';
import { Actions, Rels } from 'd2l-hypermedia-constants';
import 'd2l-outcomes-level-of-achievements/d2l-outcomes-level-of-achievements.js';
import 'd2l-resize-aware/d2l-resize-aware.js';
import './d2l-alignment-intent.js';
import { LocalizeMixin } from './LocalizeMixin';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { css, html } from 'lit-element';

const $_documentContainer = document.createElement('template');

class D2lAlignment extends LocalizeMixin(EntityMixinLit(LitElement)) {

	static get is() { return 'd2l-alignment'; }

	static get properties() {
		return {
			readOnly: Boolean,
			_demonstrationsHref: String,
			_intentHref: String,
			_isRemovable: Boolean,
			_hasDemonstrations: Boolean
		};
	}
	
	static get styles() {
		return css`
			div#outer {
				display: flex;
				flex-direction: row;
				align-items: center;
			}

			div.alignment-container {
				display: flex;
				flex: 1;
			}

			d2l-alignment-intent {
				flex: 1;
			}

			d2l-button-icon {
				padding-left: 0.25rem;
				height: 100%;
			}

			:host-context([dir="rtl"]) {
				padding-right: 0.25rem;
				padding-left: 0;
			}

			d2l-outcomes-level-of-achievements {
				flex: 1;
			}

			div#outer.side-by-side div.alignment-container {
				padding-right: 15px;
			}

			:host-context([dir="rtl"]) div#outer.side-by-side div.alignment-container {
				padding-right: 0px;
				padding-left: 15px;
			}

			div#outer.side-by-side d2l-outcomes-level-of-achievements {
				padding-left: 15px;
			}

			:host-context([dir="rtl"]) div#outer.side-by-side d2l-outcomes-level-of-achievements {
				padding-left: 0px;
				padding-right: 15px;
			}

			div#outer.stack {
				flex-direction: column;
				align-items: stretch;
			}

			div#outer.stack d2l-outcomes-level-of-achievements {
				margin-top: 0.6rem;
			}
			
			d2l-resize-aware {
				width: 100%;
			}		
		`;
	}

	constructor() {
		super();
		this.readOnly = false;
		this._intentHref = null;
		this._isRemovable = false;
		this._hasDemonstrations = false;
		this._demonstrationsHref = null;

		this._stack = this._stack.bind(this);

		//this._setEntityType(xyz) //Need to make entity object first
	}

	render() {
		return html`
			<d2l-resize-aware @d2l-resize-aware-resized="${this._stack}"> ${null /*TODO: verify this is the right event */} 
				<div id="outer">
					${this._renderAlignmentsContainer()}
					${this._renderOutcomesLoa()}
				</div>
			</d2l-resize-aware>
		`;
	}

	set _entity(entity) {
		if (this._entityHasChanged(entity)) {
			this._onEntityChanged(entity);
			super._entity = entity;
		}
	}

	_getIsRemovable(entity, readOnly) {
		if (readOnly) {
			return false;
		}

		if (!entity) {
			return false;
		}

		if (!entity.hasActionByName(Actions.alignments.removeAlignment)) {
			return false;
		}

		return true;
	}

	_onEntityChanged(entity) {
		if (!entity) {
			return;
		}
		
		this._isRemovable = this._getIsRemovable(entity, this.readOnly);

		if(entity.hasLinkByRel(Rels.Outcomes.intent)) {
			this._intentHref = entity.getLinkByRel(Rels.Outcomes.intent).href;
		}

		// TODO: Add to hmConstants when this gets finalized
		this._hasDemonstrations = entity.hasLinkByRel('https://achievements.api.brightspace.com/rels/demonstration');
		if(this._hasDemonstrations) {
			this._demonstrationsHref = entity.getLinkByRel('https://achievements.api.brightspace.com/rels/demonstration').href;
		}
	}

	_remove() {
		var action = this.entity && this.entity.getActionByName(Actions.alignments.removeAlignment);
		if (action) {
			this.dispatchEvent(new CustomEvent('d2l-alignment-remove', {
				bubbles: true,
				composed: true,
				detail: {
					entity: this.entity,
					action: action
				}
			}));
			this.performSirenAction(action);
		}
	}

	_renderAlignmentsContainer() {
		const closeButton = this._isRemovable ? html`
			<d2l-button-icon
				icon="d2l-tier1:close-default"
				text="${this.localize('removeAlignment')}"
				@click="${this._remove}"
			></d2l-button-icon>
		` : html``;

		return html`
			<div class="alignment-container">
				<d2l-alignment-intent href=${this._intentHref}" token${this.token}"></d2l-alignment-intent>
				${closeButton}
			</div>
		`;
	}
	_renderOutcomesLoa() {
		if(!this._hasDemonstrations) {
			return html``;
		}

		return html`
			<d2l-outcomes-level-of-achievements
				token="${this.token}"
				href="${this._demonstrationsHref}"
				read-only="${this.readOnly}"
			></d2l-outcomes-level-of-achievements>
		`;
	}

	_stack(e) {
		var width = e.detail.current.width;
		if (width > 630) {
			this.$.outer.classList.add('side-by-side');
			this.$.outer.classList.remove('stack');
		} else {
			this.$.outer.classList.add('stack');
			this.$.outer.classList.remove('side-by-side');
		}
	}

}

customElements.define(D2lAlignment.is, D2lAlignment);