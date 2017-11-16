import * as React from 'react'
import * as ReactSortableHOC from 'react-sortable-hoc'
import { Components } from 'arragrocms-management'

import { ISvgIconLink } from '../../interfaces'
import SortableSvgIconForm from './SortableSvgIconForm'

interface SortableListProps<ItemType> {
    name: string
    svgIconLinksServices: Array<ISvgIconLink>
    contentUrlRouteId: string
    newItem: ISvgIconLink
    onChange(name: string, svgIconLinksServices: Array<ISvgIconLink>)
}

export default class SortableCarousel extends React.Component<SortableListProps<ISvgIconLink>> {

    public constructor(props: SortableListProps<ISvgIconLink>) {
        super(props);

        this.getForm = this.getForm.bind(this)
    }

    sortableItems: Components.SortableItems<ISvgIconLink>

    getItemHeader = (item: ISvgIconLink) => {
        debugger
        if (item.title.length > 0) {
            return <span>{item.title}</span>
        }
        return null
    }

    getItemDetails = (item: ISvgIconLink) => {
        if (item.svg.length > 0) {
            return <img src={item.svg} />
        }
        return null
    }
    
    getForm = (index: number, item: ISvgIconLink, onChange: (name, value) => void) => {
        return <SortableSvgIconForm        
            contentUrlRouteId={this.props.contentUrlRouteId}
            index={index}
            item={item}
            onChange={onChange}
        />
    }

    public render() {
        return <Components.SortableItems
                    ref={x => this.sortableItems = x as Components.SortableItems<ISvgIconLink>}
                    name={this.props.name}
                    typeName='Svg Icon Links'
                    contentUrlRouteId={this.props.contentUrlRouteId} 
                    items={this.props.svgIconLinksServices} 
                    newItem={this.props.newItem}
                    getName={(item: ISvgIconLink) => item.title}
                    getItemHeader={this.getItemHeader}
                    getItemDetails={this.getItemDetails}
                    getForm={this.getForm}
                    onChange={this.props.onChange}
                />;
    }
}