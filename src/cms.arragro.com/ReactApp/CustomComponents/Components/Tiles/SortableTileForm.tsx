import * as React from 'react'
import { FormikProps } from 'formik'

import MarkdownEditor from '../../MarkdownEditor'
import { ITile } from '../../interfaces'

import { Interfaces, utils } from '@arragro/cms-management'
import TextBox from '@arragro/cms-management/dist/src/components/FormikControls/TextBox/async'
import CheckBox from '@arragro/cms-management/dist/src/components/FormikControls/CheckBox/async'
import AssetPicker from '@arragro/cms-management/dist/src/components/Asset/AssetPicker'

const { makeEmptyString } = utils.Helpers

interface SortableListProps {
    contentData: Interfaces.IContentData
    formikBag: FormikProps<ITile>
    saveStashedIncomplete? (): void
    linkIsMandatory: boolean
    useMarkdown: boolean
}

const SortableTileForm: React.FunctionComponent<SortableListProps> = (props) => {
    const {
        contentData,
        formikBag,
        saveStashedIncomplete,
        linkIsMandatory,
        useMarkdown
    } = props

    const getSvgOrImageInputs = (svgBased: boolean) => {
        if (svgBased) {
            return <React.Fragment>

                <AssetPicker
                    name='imageUrl'
                    label='SVG'
                    contentData={contentData}
                    selectedAsset={formikBag.values.imageUrl}
                    dropzoneAccept='image/svg+xml'
                    mimeTypeFilter='image/svg+xml'
                    maxSize={10485760}
                    showResize={true}
                    onChange={formikBag.setFieldValue}
                    value={formikBag.values.imageUrl}
                    error={formikBag.errors.imageUrl}
                    submitCount={formikBag.submitCount}
                    saveStashedIncomplete={saveStashedIncomplete}
                />

            </React.Fragment>
        } else {
            return <React.Fragment>

                <AssetPicker
                    name='imageUrl'
                    label='Image'
                    contentData={contentData}
                    selectedAsset={formikBag.values.imageUrl}
                    dropzoneAccept='image/jpeg,image/pjpeg,image/png,image/gif'
                    mimeTypeFilter='image/jpeg,image/pjpeg,image/png,image/gif'
                    maxSize={10485760}
                    showResize={true}
                    onChange={formikBag.setFieldValue}
                    value={formikBag.values.imageUrl}
                    error={formikBag.errors.imageUrl}
                    submitCount={formikBag.submitCount}
                    saveStashedIncomplete={saveStashedIncomplete}
                />

            </React.Fragment>
        }
    }

    const getMarkdown = () => {
        if (useMarkdown) {
            return <MarkdownEditor
                contentData={contentData}
                name='markdown'
                label='Markdown'
                value={formikBag.values.markdown}
                error={formikBag.errors.markdown}
                submitCount={formikBag.submitCount}
                handleBlur={formikBag.handleBlur}
                setFieldValue={formikBag.setFieldValue}
                showAssetPicker={false}
                saveStashedIncomplete={saveStashedIncomplete}
            />
        }
        return null
    }

    const getHasLinkInputs = (hasLink: boolean) => {
        if (hasLink) {
            return <React.Fragment>

                <TextBox
                    type='text'
                    name='linkText'
                    label='Link Text'
                    value={makeEmptyString(formikBag.values.linkText)}
                />

                <TextBox
                    type='text'
                    name='href'
                    label='Href'
                    value={makeEmptyString(formikBag.values.href)}
                />

            </React.Fragment>
        }
        return null
    }

    const getHasLinkCheckBoxAndLinkInputs = () => {
        if (linkIsMandatory === true) {
            return <React.Fragment>

                <TextBox
                    type='text'
                    name='linkText'
                    label='Link Text'
                    value={makeEmptyString(formikBag.values.linkText)}
                />

                <TextBox
                    type='text'
                    name='href'
                    label='Href'
                    value={makeEmptyString(formikBag.values.href)}
                />

            </React.Fragment>
        }

        return <React.Fragment>
            <CheckBox
                name='hasLink'
                label='Has Link'
                checked={formikBag.values.hasLink}
                value='hasLink'
            />

            { getHasLinkInputs(formikBag.values.hasLink) }
        </React.Fragment>
    }

    return <React.Fragment>

        <TextBox
            type='text'
            name='name'
            label='Name'
            value={makeEmptyString(formikBag.values.name)}
        />

        <CheckBox
            name='svgBased'
            label='Svg Icon?'
            checked={formikBag.values.svgBased}
            value='svgBased'
        />

        {getSvgOrImageInputs(formikBag.values.svgBased)}

        <TextBox
            type='text'
            name='imageAlt'
            label='Image Alt Text'
            value={makeEmptyString(formikBag.values.imageAlt)}
        />

        {getMarkdown()}

        {getHasLinkCheckBoxAndLinkInputs()}

        <TextBox
            type='text'
            name='cssClass'
            label='Class'
            value={makeEmptyString(formikBag.values.cssClass)}
        />

    </React.Fragment>
}

export default SortableTileForm
