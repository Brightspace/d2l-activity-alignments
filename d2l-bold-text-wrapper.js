import { css, html } from 'lit-element';
import 'd2l-hypermedia-constants/d2l-hypermedia-constants.js';
import 'd2l-alert/d2l-alert.js';
import './localize-behavior.js';

class BoldTextWrapper extends LitElement {

	static get is() {
		return 'd2l-bold-text-wrapper';
	}

	static get properties() {
		return {
			content: {
				type: String
			},
			parsedContent: {
				type: Array
			}
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline;
			}
		`;
	}

	constructor() {
		super();
		this.content = null;
		this.parsedContent = [];
	}

	set content(content) {
		this.parsedContent = this._computeParsedContent(content);
	}

	render() {
		return html`
			${this.parsedContent.map(item => {
				if(item.bold) {
					return html`<b>${item.data}</b>`;
				}
				else {
					return item.data;
				}
			})}
        `;
	}

	_computeParsedContent(content) {
		if (!content) return undefined;

		const findTag = (str, val) => {
			var indexes = [], i = -1;
			while ((i = str.indexOf(val, i + 1)) !== -1) {
				indexes.push(parseInt(i));
			}
			return indexes;
		};
		const boldStart = findTag(content, '<b>');
		const boldEnd = findTag(content, '</b>').map(i => i + '</b>'.length);
		const parsedContent = [];

		if (boldStart.length === 0 || !boldEnd.length === 0 || boldStart.length !== boldEnd.length) {
			parsedContent.push({ data: content, bold: false });
			return parsedContent;
		}

		let nonBoldStart = 0;
		return boldStart.reduce((acc, item, index) => {
			const start = item;
			const end = boldEnd[index];
			acc.push({
				data: content.substring(nonBoldStart, start),
				bold: false
			});
			acc.push({
				data: content.substring(start + '<b>'.length, end - '</b>'.length),
				bold: true
			});
			nonBoldStart = end;

			if (boldStart.length - 1 === index) {
				acc.push({
					data: content.substring(end),
					bold: false
				});
			}
			return acc;
		}, []);
	}
}

customElements.define(BoldTextWrapper.is, BoldTextWrapper);