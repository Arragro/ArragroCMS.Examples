import * as React from 'react'
import { FormikProps } from 'formik'

import MarkdownEditor from '../../MarkdownEditor'
import { ITile } from '../../interfaces'

import { Components, Interfaces, utils } from 'arragrocms-management'

const { TextBox, CheckBox } = Components.FormikControls
const { makeEmptyString } = utils.Helpers
const { Aux } = utils

interface SortableListProps {
    contentData: Interfaces.IContentData
    formikBag: FormikProps<ITile>
    saveStashedIncomplete? (): void
    linkIsMandatory: boolean
    useMarkdown: boolean
}

const SortableTileForm: React.StatelessComponent<SortableListProps> = (props) => {
    const {
        contentData,
        formikBag,
        saveStashedIncomplete,
        linkIsMandatory,
        useMarkdown
    } = props

    const getSvgOrImageInputs = (svgBased: boolean) => {
        if (svgBased) {
            return <Aux>

                <Components.AssetPicker
                    id='imageUrl'
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

            </Aux>
        } else {
            return <Aux>

                <Components.AssetPicker
                    id='imageUrl'
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

            </Aux>
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
            return <Aux>

                <TextBox
                    type='text'
                    id='linkText'
                    label='Link Text'
                    value={makeEmptyString(formikBag.values.linkText)}
                    error={formikBag.errors.linkText}
                    submitCount={formikBag.submitCount}
                    handleBlur={formikBag.handleBlur}
                    handleChange={formikBag.handleChange}
                />

                <TextBox
                    type='text'
                    id='href'
                    label='Href'
                    value={makeEmptyString(formikBag.values.href)}
                    error={formikBag.errors.href}
                    submitCount={formikBag.submitCount}
                    handleBlur={formikBag.handleBlur}
                    handleChange={formikBag.handleChange}
                />

            </Aux>
        }
        return null
    }

    const getHasLinkCheckBoxAndLinkInputs = () => {
        if (linkIsMandatory === true) {
            return <Aux>

                <TextBox
                    type='text'
                    id='linkText'
                    label='Link Text'
                    value={makeEmptyString(formikBag.values.linkText)}
                    error={formikBag.errors.linkText}
                    submitCount={formikBag.submitCount}
                    handleBlur={formikBag.handleBlur}
                    handleChange={formikBag.handleChange}
                />

                <TextBox
                    type='text'
                    id='href'
                    label='Href'
                    value={makeEmptyString(formikBag.values.href)}
                    error={formikBag.errors.href}
                    submitCount={formikBag.submitCount}
                    handleBlur={formikBag.handleBlur}
                    handleChange={formikBag.handleChange}
                />

            </Aux>
        }

        return <Aux>
            <CheckBox
                id='hasLink'
                label='Has Link'
                checked={formikBag.values.hasLink}
                value='hasLink'
                submitCount={formikBag.submitCount}
                handleBlur={formikBag.handleBlur}
                handleChange={formikBag.handleChange}
            />

            { getHasLinkInputs(formikBag.values.hasLink) }
        </Aux>
    }

    return <Aux>

        <TextBox
            type='text'
            id='name'
            label='Name'
            value={makeEmptyString(formikBag.values.name)}
            error={formikBag.errors.name}
            submitCount={formikBag.submitCount}
            handleBlur={formikBag.handleBlur}
            handleChange={formikBag.handleChange}
        />

        <CheckBox
            id='svgBased'
            label='Svg Icon?'
            checked={formikBag.values.svgBased}
            value='svgBased'
            submitCount={formikBag.submitCount}
            handleBlur={formikBag.handleBlur}
            handleChange={formikBag.handleChange}
        />

        {getSvgOrImageInputs(formikBag.values.svgBased)}

        <TextBox
            type='text'
            id='imageAlt'
            label='Image Alt Text'
            value={makeEmptyString(formikBag.values.imageAlt)}
            error={formikBag.errors.imageAlt}
            submitCount={formikBag.submitCount}
            handleBlur={formikBag.handleBlur}
            handleChange={formikBag.handleChange}
        />

        {getMarkdown()}

        {getHasLinkCheckBoxAndLinkInputs()}

        <TextBox
            type='text'
            id='cssClass'
            label='Class'
            value={makeEmptyString(formikBag.values.cssClass)}
            error={formikBag.errors.cssClass}
            submitCount={formikBag.submitCount}
            handleBlur={formikBag.handleBlur}
            handleChange={formikBag.handleChange}
        />

    </Aux>
}

export default SortableTileForm
