import m from 'mithril';
import { Component, ComponentAttributes } from '../common/Component';
import { TreeData } from '../data/TreeData';
import { TemplateCallbackType, getTemplateFunction } from '../common/Template';

import './tree.style.css';
import { IDataComponent, IdType } from '../common/Types';
import classNames from 'classnames';
import { Selection, SelectionAttributes, SelectionEventTypes } from '../selection/Selection';
import { TreeDataItemType } from '../data/Types';

declare type TreeEventTypes = SelectionEventTypes & {
	onClick: (e: PointerEvent) => void;
}

declare type TreeAttributes = ComponentAttributes & {	
	template?: TemplateCallbackType;
	selection?: SelectionAttributes;
}

export class Tree extends Component<TreeAttributes, TreeEventTypes> implements IDataComponent<TreeDataItemType> {
	data: TreeData;
	selection: Selection<TreeDataItemType>;	

	constructor(attrs: TreeAttributes) {
		super(attrs);
		this.data = new TreeData(this);
		this.selection = new Selection(this, this.attrs.selection);
	}

	isCollapsed(id: IdType): boolean {
		return !this.data.getItemById(id)?.$opened;
	}

	expandAll(): void {
		this.data.forEach(item => {
			this.expand(item.id);
		});
	}

	collapseAll(): void {
		this.data.forEach(item => {
			this.collapse(item.id);
		});
	}

	expand(id: IdType): void {
		this.data.update(id, { $opened: true });
		m.redraw();
	}

	collapse(id: IdType): void {
		this.data.update(id, { $opened: false });
		m.redraw();
	}

	toggle(id: IdType): void {
		if (this.isCollapsed(id)) {
			this.expand(id);
		} else {
			this.collapse(id);
		}
	}

	view(): m.Vnode<unknown, unknown> {
		const template = getTemplateFunction(this.attrs.template, {
			className: 'webcraft_tree_item'
		});
		const generateLeaves = (leaves: TreeDataItemType[]): m.Children => {
			if (!leaves?.length) {
				return null;
			}

			return m('div.webcraft_tree_leaves', {
				style: {
					paddingLeft: '20px',
				},
			}, leaves.map((item) => generateBranch(item)));
		};

		const getIcon = (item: TreeDataItemType) => {
			let iconClassName = 'icon-folder';
			if (this.data.getChildrenByParent(item.id).length === 0) {
				iconClassName = 'icon-doc-inv';
			}
			if (item.$opened) {
				iconClassName = 'icon-folder-open';
			}
			return m('span.webcraft_tree_leaf_icon', { className: iconClassName });
		};
		
		const generateBranch = (item: TreeDataItemType) => {
			const children = this.data.getChildrenByParent(item.id);
			return m('div.webcraft_tree_branch', { key: item.id }, [
				m('div.webcraft_tree_leaf', {
					className: classNames([
						this.selection.isSelected(item.id) ? 'webcraft_tree_leaf--selected': null,
					]),
					onclick: (e: PointerEvent) => {
						this.events.emit('onClick', e);
						if ((e.target as HTMLElement).classList.contains('webcraft_tree_leaf_populated')) {
							this.toggle(item.id);
						} else {
							this.selection.select(item.id, e);
						}
					},
				}, [
					children?.length ? m('span.webcraft_tree_leaf_populated', {
						className: classNames([
							item.$opened ? 'icon-down-dir' : 'icon-right-dir',
						]),
					}) : m('span.webcraft_tree_leaf_empty'),
					getIcon(item),
					template(item),
				]),
				item.$opened ? generateLeaves(children) : null,
			]);
		};

		const rootLevelItems = this.data.getRootLevelItems();
		return m('div.webcraft_tree_wrapper', m('div.webcraft_tree', rootLevelItems.length ? rootLevelItems.map((item) => generateBranch(item)) : 
			m('span.webcraft_text_no_data', 'There is no data to display' )),
		);
	}

}