import * as React from 'react'
import { Components } from 'arragrocms-management'

import { ISvgIconLink } from '../../interfaces'
import SortableSvgIconForm from './SortableSvgIconForm'

interface SortableListProps<ItemType> {
    name: string
    svgIconLinksServices: Array<ISvgIconLink>
    contentUrlRouteId: string
    newItem: ISvgIconLink
    onChange(name: string, svgIconLinksServices: Array<ISvgIconLink>): void
}

export default class SortableCarousel extends React.Component<SortableListProps<ISvgIconLink>> {
    sortableItems: Components.SortableItems<ISvgIconLink> | null = null

    public constructor(props: SortableListProps<ISvgIconLink>) {
        super(props);

        this.getForm = this.getForm.bind(this)
    }

    getItemHeader = (item: ISvgIconLink) => {
        if (item.title.length > 0) {
            return <span>{item.title}</span>
        }
        return <span></span>
    }
    
    getForm = (index: number, item: ISvgIconLink, onChange: (name: string, value: any) => void) => {
        return <SortableSvgIconForm        
            contentUrlRouteId={this.props.contentUrlRouteId}
            index={index}
            item={item}
            onChange={onChange}
        />
    }

    public render() {
        return <Components.SortableItems
                    ref={(x: Components.SortableItems<ISvgIconLink> | null) => this.sortableItems = x}
                    name={this.props.name}
                    typeName='Svg Icon Links'
                    contentUrlRouteId={this.props.contentUrlRouteId} 
                    items={this.props.svgIconLinksServices} 
                    newItem={this.props.newItem}
                    getName={(item: ISvgIconLink) => item.title}
                    getItemHeader={this.getItemHeader}
                    getForm={this.getForm}
                    onChange={this.props.onChange}
                />;
    }
}
