import * as React from 'react'
import * as ReactSortableHOC from 'react-sortable-hoc'
import { Components } from 'arragrocms-management'

import { ICloud } from '../../interfaces'
import SortableCloudForm from './SortableCloudForm'

interface SortableCloudsProps {
    name: string
    label: string
    clouds: Array<ICloud>
    contentUrlRouteId: string
    newItem: ICloud
    onChange(name: string, carousels: Array<ICloud>)
}

export default class SortableClouds extends React.Component<SortableCloudsProps> {

    public constructor(props: SortableCloudsProps) {
        super(props);

        this.getForm = this.getForm.bind(this)
    }

    sortableClouds: Components.SortableItems<ICloud>

    getItemHeader = (item: ICloud) => {
        if (item.name &&
            item.name !== null &&
            item.name.length > 0) {
            return <span>{item.name}</span>
        }
        return null
    }

    getItemDetails = (item: ICloud) => {
        if (item.svgBased) {
            return <div dangerouslySetInnerHTML={{ __html: item.svgIcon }}></div>
        } else {
            return <img src={item.imageUrl} alt={item.imageAlt} />
        }
    }
    
    getForm = (index: number, item: ICloud, onChange: (name, value) => void) => {
        return <SortableCloudForm        
            contentUrlRouteId={this.props.contentUrlRouteId}
            index={index}
            item={item}
            onChange={onChange}
        />
    }

    public render() {
        return <Components.SortableItems
                ref={x => this.sortableClouds = x as Components.SortableItems<ICloud>}
                    name={this.props.name}
                    typeName={this.props.label}
                    contentUrlRouteId={this.props.contentUrlRouteId} 
                    items={this.props.clouds} 
                    newItem={this.props.newItem}
                    getName={(item: ICloud) => item.name}
                    getItemHeader={this.getItemHeader}
                    getItemDetails={this.getItemDetails}
                    getForm={this.getForm}
                    onChange={this.props.onChange}
                    maxNumberOfItems={2}
                />;
    }
}