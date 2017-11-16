import * as React from 'react'
import * as ReactSortableHOC from 'react-sortable-hoc'
import { Components } from 'arragrocms-management'

import { ICarousel } from '../../interfaces'
import SortableCarouselForm from './SortableCarouselForm'

interface SortableListProps {
    name: string
    carousels: Array<ICarousel>
    contentUrlRouteId: string
    newItem: ICarousel
    onChange (name: string, carousels: Array<ICarousel>)
}

interface SortableListState {
    assetPickerClass: string
}

export default class SortableCarousel extends React.Component<SortableListProps, SortableListState> {

    public constructor(props: SortableListProps) {
        super(props);

        this.state = {
            assetPickerClass: 'asset-picker'
        }

        this.getForm = this.getForm.bind(this)
    }

    sortableCarousel: Components.SortableItems<ICarousel>

    getItemHeader = (item: ICarousel) => {
        if (item.name &&
            item.name !== null &&
            item.name.length > 0) {
            return <span>{item.name}</span>
        }
        return null
    }

    getItemDetails = (item: ICarousel) => {
        if (item.imageUrl &&
            item.imageUrl !== null &&
            item.imageUrl.length > 0) {
            return <img src={item.imageUrl} alt={item.imageAlt} />
        }
        return null
    }
    
    getForm = (index: number, item: ICarousel, onChange: (name, value) => void) => {
        return <SortableCarouselForm        
            contentUrlRouteId={this.props.contentUrlRouteId}
            assetPickerClass={this.state.assetPickerClass}
            index={index}
            item={item}
            onChange={onChange}
        />
    }

    public render() {
        return <Components.SortableItems
                    ref={x => this.sortableCarousel = x as Components.SortableItems<ICarousel>}
                    name={this.props.name}
                    typeName='Carousel'
                    contentUrlRouteId={this.props.contentUrlRouteId} 
                    items={this.props.carousels} 
                    newItem={this.props.newItem}
                    getName={(item: ICarousel) => item.name}
                    getItemHeader={this.getItemHeader}
                    getItemDetails={this.getItemDetails}
                    getForm={this.getForm}
                    onChange={this.props.onChange}
                />;
    }
}