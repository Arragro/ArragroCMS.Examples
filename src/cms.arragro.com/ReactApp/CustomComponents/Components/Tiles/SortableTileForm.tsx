import * as React from 'react'
import * as FRC from 'formsy-react-components'
import { Components } from 'arragrocms-management'

import MarkdownEditor from '../../MarkdownEditor'
import { ITile } from '../../interfaces'

const { Input, Checkbox } = FRC

interface SortableTileFormProps {
    contentUrlRouteId: string
    index: number
    item: ITile
    linkIsMandatory: boolean
    useMarkdown: boolean
    onChange (name: string, value: string): void   
}

const SortableTileForm: React.StatelessComponent<SortableTileFormProps> = (props) => {

    const getSvgOrImageInputs = (svgBased: boolean) => {
        if (svgBased) {
            return <div>
                <Components.AssetPicker
                    name='imageUrl'
                    label='SVG'
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

    const getMarkdown = () => {
        if (props.useMarkdown) {
            return <MarkdownEditor
                contentDataUrlRouteId={props.contentUrlRouteId}
                name='markdown'
                label='Markdown'
                value={props.item.markdown}
                onChange={props.onChange}
                showAssetPicker={true}
            />
        }
        return null
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
                        isUrlRoute: 0,
                        maxLength: 2000
                    }}
                    validationErrors={{
                        isUrlRoute: 'Please supply a valid url route e.g. "home".',
                        maxLength: 'There is a 2000 character limit to this field.'
                    }}
                />
                
            </div>
        }
        return null
    }

    const getHasLinkCheckBoxAndLinkInputs = () => {
        if (props.linkIsMandatory === true) {
            return <div>

                <Input
                    type='text'
                    name='linkText'
                    label='Link Text'
                    required
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
                    required
                    onChange={props.onChange}
                    value={props.item.href}
                    validations={{
                        isUrlRoute: 0,
                        maxLength: 2000
                    }}
                    validationErrors={{
                        isUrlRoute: 'Please supply a valid url route e.g. "home".',
                        maxLength: 'There is a 2000 character limit to this field.'
                    }}
                />

            </div>

        }

        return <div>
            <Checkbox
                name="hasLink"
                value={props.item.hasLink}
                label="Has Link"
                onChange={props.onChange}
            />

            { getHasLinkInputs(props.item.hasLink) }
        </div>
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

        {getMarkdown()}

        {getHasLinkCheckBoxAndLinkInputs()}

        <Input
            type='text'
            name='cssClass'
            label='Class'
            onChange={props.onChange}
            value={props.item.cssClass}
            validations={{
                maxLength: 30
            }}
            validationErrors={{
                maxLength: 'There is a 30 character limit to this field.'
            }}
        />

    </div>
}

export default SortableTileForm
