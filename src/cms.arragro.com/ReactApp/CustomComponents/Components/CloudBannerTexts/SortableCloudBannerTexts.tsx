import * as React from 'react'
import { Components } from 'arragrocms-management'
import * as ReactMarkdown from 'react-markdown'

import { ICloudBannerText } from '../../interfaces'
import SortableCloudBannerTextForm from './SortableCloudBannerTextForm'

interface SortableCloudsProps {
    name: string
    cloudBannerTexts: Array<ICloudBannerText>
    contentUrlRouteId: string
    newItem: ICloudBannerText
    onChange(name: string, items: Array<ICloudBannerText>): void
}

export default class SortableClouds extends React.Component<SortableCloudsProps> {
    sortableItems: Components.SortableItems<ICloudBannerText> | null = null

    public constructor(props: SortableCloudsProps) {
        super(props);

        this.getForm = this.getForm.bind(this)
    }


    getItemHeader = (item: ICloudBannerText) => {
        return <ReactMarkdown source={item.markdown} escapeHtml={false} />
    }
    
    getForm = (index: number, item: ICloudBannerText, onChange: (name: string, value: any) => void) => {
        return <SortableCloudBannerTextForm        
            contentUrlRouteId={this.props.contentUrlRouteId}
            index={index}
            item={item}
            onChange={onChange}
        />
    }

    public render() {
        return <Components.SortableItems
                    ref={(x: Components.SortableItems<ICloudBannerText> | null)  => this.sortableItems = x}
                    name={this.props.name}
                    typeName='Cloud Banner Text'
                    contentUrlRouteId={this.props.contentUrlRouteId} 
                    items={this.props.cloudBannerTexts} 
                    newItem={this.props.newItem}
                    getName={(item: ICloudBannerText) => ''}
                    getItemHeader={this.getItemHeader}
                    getForm={this.getForm}
                    onChange={this.props.onChange}
                />;
    }
}
