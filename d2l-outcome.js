/**
`d2l-outcome`

@demo demo/index.html
*/

import 'd2l-loading-spinner/d2l-loading-spinner.js';
import 'd2l-typography/d2l-typography-shared-styles.js';
import 's-html/s-html.js';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit';
import { OutcomeParserMixin } from './OutcomeParserMixin.js';
import { css, html } from 'lit-element';

class D2lOutcome extends OutcomeParserMixin(EntityMixinLit(LitElement)) {

	static get is() { return 'd2l-outcome'; }

	static get properties() {
		return {
			href: String
		}
	}

	static get styles() {
		return css`
			:host {
				display: block;
				width: 100%;
			}

			.d2l-outcome-wrap {
				display: flex;
				flex-direction: column-reverse;
			}

			.d2l-outcome-identifier {
				@apply --d2l-body-small-text;

				margin: 0.3rem 0 0 0;
			}

			.d2l-outcome-text {
				@apply --d2l-body-compact-text;
			}

			siren-entity-loading {
				--siren-entity-loading-min-height: 1.2rem;
			}

			d2l-loading-spinner {
				--d2l-loading-spinner-size: 1.2rem;
			}

			.d2l-outcome-wrap, .d2l-outcome-text {
				width: 100%;
			}		
		`;
	}

	constructor() {
		super();
		this.href = null;

		//this._setEntityType(xyz) //Need to make entity object first
		//No need currently for _onEntityChanged management since everything is retrieved from properties (no subentities to load)
	}

	render() {
		return html`
			<siren-entity-loading href="${this.href}" token="${this.token}">
				<div class="d2l-outcome-wrap">
					${this._hasOutcomeIdentifier(entity) ? html`
					<div class="d2l-outcome-identifier">[[getOutcomeIdentifier(entity)]]</div>
					` : html``}
					<div class="d2l-outcome-text">
						<s-html hidden="${!this._fromTrustedSource(entity)}" html="${this.getOutcomeDescriptionHtml(entity)}"></s-html>
						<span hidden="${this._fromTrustedSource(entity)}">${this.getOutcomeDescriptionPlainText(entity)}</span>
					</div>
				</div>

				<d2l-loading-spinner slot="loading"></d2l-loading-spinner>
			</siren-entity-loading>
		`;
	}

	_hasOutcomeIdentifier(entity) {
		return !!this.getOutcomeIdentifier(entity);
	}

}

customElements.define(D2lOutcome.is, D2lOutcome);
