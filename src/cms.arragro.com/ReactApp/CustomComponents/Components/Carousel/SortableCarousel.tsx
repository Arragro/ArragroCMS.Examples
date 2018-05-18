import * as React from 'react'
import { Components, Interfaces } from 'arragrocms-management'

import { ICarousel } from '../../interfaces'
import SortableCarouselForm from './SortableCarouselForm'

interface SortableListProps {
    name: string
    carousels: Array<ICarousel>
    contentData: Interfaces.IContentData
    newItem: ICarousel
    onChange (name: string, carousels: Array<ICarousel>): void
}

interface SortableListState {
    assetPickerClass: string
}

export default class SortableCarousel extends React.Component<SortableListProps, SortableListState> {
    sortableCarousel: Components.SortableItems<ICarousel> | null = null

    public constructor(props: SortableListProps) {
        super(props);

        this.state = {
            assetPickerClass: 'asset-picker'
        }

        this.getForm = this.getForm.bind(this)
    }

    getItemHeader = (item: ICarousel) => {
        if (item.name &&
            item.name !== null &&
            item.name.length > 0) {
            return <span>{item.name}</span>
        }
        return <span></span>
    }
    
    getForm = (index: number, item: ICarousel, onChange: (name: string, value: any) => void) => {
        return <SortableCarouselForm        
            contentData={this.props.contentData}
            assetPickerClass={this.state.assetPickerClass}
            index={index}
            item={item}
            onChange={onChange}
        />
    }

    public render() {
        return <Components.SortableItems
                    // ref={x => this.sortableCarousel = x as Components.SortableItems<ICarousel>}
                    name={this.props.name}
                    typeName='Carousel'
                    items={this.props.carousels} 
                    newItem={this.props.newItem}
                    getName={(item: ICarousel) => item.name}
                    getItemHeader={this.getItemHeader}
                    getForm={this.getForm}
                    onChange={this.props.onChange}
                />;
    }
}
