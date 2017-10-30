import * as React from 'react'
import * as FRC from 'formsy-react-components'
import * as ReactSortableHOC from 'react-sortable-hoc'
import { Components } from 'arragrocms-management'

import { ICarousel } from '../../interfaces'
import MarkdownEditor from '../../MarkdownEditor'

const { Input, Checkbox } = FRC

interface SortableItemProps {
    itemIndex: number
    contentUrlRouteId: string
    carousel: ICarousel
    onChange (index: number, carousel: ICarousel)
    onDelete (index: number)
}

interface SortableListProps {
    contentUrlRouteId: string
    index: number
    item: ICarousel
    assetPickerClass: string
    onChange (name: string, value: string)    
}

const SortableCarousel: React.StatelessComponent<SortableListProps> = (props) => {

    const getHasLinkInputs = (hasLink: boolean) => {
        if (hasLink) {
            return <div>
            
                <MarkdownEditor 
                    contentDataUrlRouteId={props.contentUrlRouteId} 
                    name='linkText'
                    label='Link Text'
                    value={props.item.linkText}
                    onChange={props.onChange} 
                    showAssetPicker={false}
                />
            
                <Input
                    type='text'
                    name='href'
                    label='Href'
                    onChange={props.onChange}
                    value={props.item.href}
                    validations={{
                        isValidUrl: 0,
                        maxLength: 2000
                    }}
                    validationErrors={{
                        isValidUrl: 'Please supply a valid url e.g. "https://www.test-url-example.com".',
                        maxLength: 'There is a 2000 character limit to this field.'
                    }}
                />
                
            </div>
        }
        return null
    }

    return <div>
        <Input
            type='text'
            name='name'
            label='Name'
            required
            onChange={props.onChange}
            value={props.item.name}
            validations={{
                maxLength: 128
            }}
            validationErrors={{
                maxLength: 'There is a 128 character limit to this field.'
            }}
        />

        <Components.AssetPicker         
            name='imageUrl'
            required
            selectedAsset={props.item.imageUrl}
            className={props.assetPickerClass} 
            contentUrlRouteId={props.contentUrlRouteId} 
            dropzoneAccept='image/*' 
            mimeTypeFilter='image/*' 
            maxSize={10485760} 
            showResize={true}
            onChange={props.onChange}
            value={props.item.imageUrl}
        />
        
        <Input
            type='text'
            name='imageAlt'
            label='Image Alt Text'
            onChange={props.onChange}
            value={props.item.imageAlt}
            validations={{
                maxLength: 512
            }}
            validationErrors={{
                maxLength: 'There is a 512 character limit to this field.'
            }}
        />

        <Checkbox
            name="hasLink"
            value={props.item.hasLink}
            label="Has Link"
            onChange={props.onChange}
        />

        {getHasLinkInputs(props.item.hasLink)}

    </div>
}

export default SortableCarousel