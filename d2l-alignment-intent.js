/**
`d2l-alignment-intent`

@demo demo/index.html
*/

import { Rels } from 'd2l-hypermedia-constants';
import './d2l-outcome.js';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { css, html } from 'lit-element';

class D2lAlignmentIntent extends EntityMixinLit(LitElement) {

	static get is() { return 'd2l-alignment-intent' }

	static get properties() {
		return {
			_outcomeHref: String
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
		`;
	}

	constructor() {
		super();
		this._outcomeHref = null;

		//this._setEntityType(xyz) //Need to make entity object first
	}

	render() {
		return html`
			<d2l-outcome href="${this._outcomeHref}" token="${this.token}" d2l-outcome>
		`;
	}

	set _entity(entity) {
		if (this._entityHasChanged(entity)) {
			this._onEntityChanged(entity);
			super._entity = entity;
		}
	}

	_onEntityChanged(entity) {
		if(!entity) {
			return;
		}

		if(entity.hasLinkByRel(Rels.Outcomes.outcome)) {
			this._outcomeHref = entity.getLinkByRel(Rels.Outcomes.outcome).href;
		}
	}

}

customElements.define(D2lAlignmentIntent.is, D2lAlignmentIntent);