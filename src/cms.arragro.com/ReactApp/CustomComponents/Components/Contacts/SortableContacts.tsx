import * as React from 'react'
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
    onChange(name: string, carousels: Array<IContact>): void
}

export default class SortableContacts extends React.Component<SortableContactsProps> {
    sortableClouds: Components.SortableItems<IContact> | null = null

    public constructor(props: SortableContactsProps) {
        super(props);

        this.getForm = this.getForm.bind(this)
    }

    getItemHeader = (item: IContact) => {
        if (item.name &&
            item.name !== null &&
            item.name.length > 0) {
            return <span>{item.name}</span>
        }
        return <span></span>
    }
    
    getForm = (index: number, item: IContact, onChange: (name: string, value: any) => void) => {
        return <SortableContactForm        
            contentUrlRouteId={this.props.contentUrlRouteId}
            index={index}
            item={item}
            onChange={onChange}
        />
    }

    public render() {
        return <Components.SortableItems
            ref={(x: Components.SortableItems<IContact> | null) => this.sortableClouds = x}
            name={this.props.name}
            typeName={this.props.label}
            contentUrlRouteId={this.props.contentUrlRouteId}
            items={this.props.contacts}
            newItem={this.props.newItem}
            getName={(item: IContact) => item.name}
            getItemHeader={this.getItemHeader}
            getForm={this.getForm}
            onChange={this.props.onChange}
            maxNumberOfItems={this.props.maxContacts}
        />;
    }
}
