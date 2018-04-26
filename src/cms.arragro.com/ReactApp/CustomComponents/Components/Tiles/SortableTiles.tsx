import * as React from 'react'
import { Components, Interfaces } from 'arragrocms-management'

import { ITile } from '../../interfaces'
import SortableTileForm from './SortableTileForm'

interface SortableTilesProps {
    name: string
    label: string
    clouds: Array<ITile>
    contentData: Interfaces.IContentData
    newItem: ITile
    maxClouds: number
    onChange(name: string, carousels: Array<ITile>): void
    linkIsMandatory: boolean
    useMarkdown: boolean
}

export default class SortableTiles extends React.Component<SortableTilesProps> {
    sortableClouds: Components.SortableItems<ITile> | null = null

    public constructor(props: SortableTilesProps) {
        super(props);

        this.getForm = this.getForm.bind(this)
    }

    getItemHeader = (item: ITile) => {
        if (item.name &&
            item.name !== null &&
            item.name.length > 0) {
            return <span>{item.name}</span>
        }
        return <span></span>
    }
    
    getForm = (index: number, item: ITile, onChange: (name: string, value: any) => void) => {
        return <SortableTileForm        
            contentData={this.props.contentData}
            index={index}
            item={item}
            onChange={onChange}
            linkIsMandatory={this.props.linkIsMandatory}
            useMarkdown={this.props.useMarkdown}
        />
    }

    public render() {
        return <Components.SortableItems
            ref={(x: Components.SortableItems<ITile> | null) => this.sortableClouds = x}
            name={this.props.name}
            typeName={this.props.label}
            items={this.props.clouds}
            newItem={this.props.newItem}
            getName={(item: ITile) => item.name}
            getItemHeader={this.getItemHeader}
            getForm={this.getForm}
            onChange={this.props.onChange}
            maxNumberOfItems={this.props.maxClouds}
        />;
    }
}
