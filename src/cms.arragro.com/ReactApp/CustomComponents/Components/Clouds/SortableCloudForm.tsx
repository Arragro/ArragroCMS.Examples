import * as React from 'react'
import * as FRC from 'formsy-react-components'
import * as ReactSortableHOC from 'react-sortable-hoc'
import { Components } from 'arragrocms-management'

import { ICloud } from '../../interfaces'

const { Input, Checkbox, Textarea } = FRC

interface SortableCloudFormFormProps {
    contentUrlRouteId: string
    index: number
    item: ICloud
    onChange (name: string, value: string)    
}

const SortableCloudForm: React.StatelessComponent<SortableCloudFormFormProps> = (props) => {

    const getSvgOrImageInputs = (svgBased: boolean) => {
        if (svgBased) {
            return <div>
                <Components.AssetPicker
                    name='imageUrl'
                    label='SVG'
                    // required
                    selectedAsset={props.item.imageUrl}
                    contentUrlRouteId={props.contentUrlRouteId}
                    dropzoneAccept='image/svg+xml'
                    mimeTypeFilter='image/svg+xml'
                    maxSize={10485760}
                    showResize={true}
                    onChange={props.onChange}
                    value={props.item.imageUrl}
                />
            </div>
        } else {
            return <div>
                <Components.AssetPicker
                    name='imageUrl'
                    label='Image'
                    // required
                    selectedAsset={props.item.imageUrl}
                    contentUrlRouteId={props.contentUrlRouteId}
                    dropzoneAccept='image/jpeg,image/pjpeg,image/png,image/gif'
                    mimeTypeFilter='image/jpeg,image/pjpeg,image/png,image/gif'
                    maxSize={10485760}
                    showResize={true}
                    onChange={props.onChange}
                    value={props.item.imageUrl}
                />
            </div>
        }
    }

    const getHasLinkInputs = (hasLink: boolean) => {
        if (hasLink) {
            return <div>

                <Input
                    type='text'
                    name='linkText'
                    label='Link Text'
                    onChange={props.onChange}
                    value={props.item.linkText}
                    validations={{
                        maxLength: 100
                    }}
                    validationErrors={{
                        maxLength: 'There is a 100 character limit to this field.'
                    }}
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
            onChange={props.onChange}
            value={props.item.name}
            validations={{
                maxLength: 128
            }}
            validationErrors={{
                maxLength: 'There is a 128 character limit to this field.'
            }}
        />

        <Checkbox
            name="svgBased"
            value={props.item.svgBased}
            label="Svg Icon?"
            onChange={props.onChange}
        />

        {getSvgOrImageInputs(props.item.svgBased)}
        
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

export default SortableCloudForm