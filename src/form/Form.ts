import m from 'mithril';
import './form.style.css';
import { Box } from '..';
import { BoxExtendedContentType } from '../box/Box';
import { IdType } from '../common/Types';
import { Editor, EditorAttributes, EditorEventTypes } from '../editors/Editor';
import { Vnode } from 'mithril';

declare type FormAttributes = BoxExtendedContentType;

export class Form extends Box {

	constructor(attrs?: FormAttributes) {
		if (!attrs) {
			attrs = {};
		}
		if (!attrs.gap) {
			attrs.gap = 'none';
		}
		super(attrs as BoxExtendedContentType);
	}

	getAllEditors(): Editor<unknown, EditorAttributes<unknown>, EditorEventTypes<unknown>>[] {
		const containers = this.getAllContainers();
		if (!containers) {
			return [];
		}
		return containers.map(container => container.getContent()).filter(content => content instanceof Editor) as Editor<unknown, EditorAttributes<unknown>, EditorEventTypes<unknown>>[];
	}

	getEditor(id: IdType): Editor<unknown, EditorAttributes<unknown>, EditorEventTypes<unknown>> | undefined {
		const contents = this.getAllContainers()?.map(container => container.getContent());
		if (!contents) {
			return undefined;
		}
		return contents.find(content => content instanceof Editor && content.getId() === id) as Editor<unknown, EditorAttributes<unknown>, EditorEventTypes<unknown>>;
	}
	
	setDisabled(disabled: boolean): void {
		this.getAllEditors().forEach(editor => {
			editor.setDisabled(disabled);
		});
	}

	getValue(): Record<IdType, unknown> {		
		return Object.fromEntries(this.getAllEditors().map(editor => [editor.getId(), editor.getValue()]));
	}

	setValue(value: Record<IdType, unknown>): void {
		Object.entries(value).forEach(entry => {
			this.getEditor(entry[0])?.setValue(entry[1]);
		});
	}

	clear(): void {
		this.getAllEditors().forEach(editor => editor.clear());
	}

	validate(): boolean {
		return this.getAllEditors().map(editor => editor.validate()).includes(false) ? false : true;
	}

	view(): Vnode<unknown, unknown> {
		return m('div.webcraft_form', super.view());
	}
}