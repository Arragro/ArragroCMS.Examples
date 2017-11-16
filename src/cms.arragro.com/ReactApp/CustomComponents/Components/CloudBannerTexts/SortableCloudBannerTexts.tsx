﻿import * as React from 'react'
import * as ReactSortableHOC from 'react-sortable-hoc'
import { Components } from 'arragrocms-management'
import ReactMarkdown from 'react-markdown'

import { ICloudBannerText } from '../../interfaces'
import SortableCloudBannerTextForm from './SortableCloudBannerTextForm'

interface SortableCloudsProps {
    name: string
    cloudBannerTexts: Array<ICloudBannerText>
    contentUrlRouteId: string
    newItem: ICloudBannerText
    onChange(name: string, items: Array<ICloudBannerText>)
}

export default class SortableClouds extends React.Component<SortableCloudsProps> {

    public constructor(props: SortableCloudsProps) {
        super(props);

        this.getForm = this.getForm.bind(this)
    }

    sortableItems: Components.SortableItems<ICloudBannerText>

    getItemHeader = (item: ICloudBannerText) => {
        return null
    }

    getItemDetails = (item: ICloudBannerText) => {        
        return <ReactMarkdown source={item.markdown} escapeHtml={false} />
    }
    
    getForm = (index: number, item: ICloudBannerText, onChange: (name, value) => void) => {
        return <SortableCloudBannerTextForm        
            contentUrlRouteId={this.props.contentUrlRouteId}
            index={index}
            item={item}
            onChange={onChange}
        />
    }

    public render() {
        return <Components.SortableItems
            ref={x => this.sortableItems = x as Components.SortableItems<ICloudBannerText>}
                    name={this.props.name}
                    typeName='Cloud Banner Text'
                    contentUrlRouteId={this.props.contentUrlRouteId} 
                    items={this.props.cloudBannerTexts} 
                    newItem={this.props.newItem}
                    getName={(item: ICloudBannerText) => ''}
                    getItemHeader={this.getItemHeader}
                    getItemDetails={this.getItemDetails}
                    getForm={this.getForm}
                    onChange={this.props.onChange}
                />;
    }
}