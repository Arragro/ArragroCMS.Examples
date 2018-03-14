import * as React from 'react'
import * as ReactSortableHOC from 'react-sortable-hoc'
import { Components } from 'arragrocms-management'

import { IContact } from '../../interfaces'
import SortableContactForm from './SortableContactForm'

interface SortableContactsProps {
    name: string
    label: string
    contacts: Array<IContact>
    contentUrlRouteId: string
    newItem: IContact
    maxContacts: number
    onChange(name: string, carousels: Array<IContact>)
}

export default class SortableContacts extends React.Component<SortableContactsProps> {

    public constructor(props: SortableContactsProps) {
        super(props);

        this.getForm = this.getForm.bind(this)
    }

    sortableClouds: Components.SortableItems<IContact>

    getItemHeader = (item: IContact) => {
        if (item.name &&
            item.name !== null &&
            item.name.length > 0) {
            return <span>{item.name}</span>
        }
        return null
    }

    getItemDetails = (item: IContact) => {
        if (item.gravitar !== null && item.gravitar.length > 0) {
            return <img src={item.gravitar} alt={item.name} />
        }
        return null
    }
    
    getForm = (index: number, item: IContact, onChange: (name, value) => void) => {
        return <SortableContactForm        
            contentUrlRouteId={this.props.contentUrlRouteId}
            index={index}
            item={item}
            onChange={onChange}
        />
    }

    public render() {
        return <Components.SortableItems
            ref={x => this.sortableClouds = x as Components.SortableItems<IContact>}
            name={this.props.name}
            typeName={this.props.label}
            contentUrlRouteId={this.props.contentUrlRouteId}
            items={this.props.contacts}
            newItem={this.props.newItem}
            getName={(item: IContact) => item.name}
            getItemHeader={this.getItemHeader}
            getItemDetails={this.getItemDetails}
            getForm={this.getForm}
            onChange={this.props.onChange}
            maxNumberOfItems={this.props.maxContacts}
        />;
    }
}