import * as React from 'react'
import * as FRC from 'formsy-react-components'
import * as ReactSortableHOC from 'react-sortable-hoc'
import { Components } from 'arragrocms-management'

import { ISvgIconLink } from '../../interfaces'

const { Input, Textarea } = FRC

interface SortableItemProps<ItemType> {
    contentUrlRouteId: string
    index: number
    item: ItemType
    onChange (name: string, value: string)    
}

const SortableSvgIcon: React.StatelessComponent<SortableItemProps<ISvgIconLink>> = (props) => {
    return <div>
            <Input
                type='text'
                name='title'
                label='Title'
                required
                onChange={props.onChange}
                value={props.item.title}
                validations={{
                    maxLength: 255
                }}
                validationErrors={{
                    maxLength: 'There is a 255 character limit to this field.'
                }}
            />

            <Components.AssetPicker
                name='svg'
                label='SVG'
                required
                selectedAsset={props.item.svg}
                contentUrlRouteId={props.contentUrlRouteId}
                dropzoneAccept='image/svg+xml'
                mimeTypeFilter='image/svg+xml'
                maxSize={10485760}
                showResize={true}
                onChange={props.onChange}
                value={props.item.svg}
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

export default SortableSvgIcon