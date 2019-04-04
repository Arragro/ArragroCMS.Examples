import * as React from 'react'
import Grid from '@material-ui/core/Grid'
import { Formik, FormikProps, Form } from 'formik'
import * as Yup from 'yup'
import { Interfaces, utils } from '@arragro/cms-management'

import { ITile, ICloudBannerText, ISvgIconLink } from '../interfaces'

import { CustomContentTypeBase } from '@arragro/cms-management/dist/src/components/ComponentTypeExtentions/CustomTypeBase'
import TextBox from '@arragro/cms-management/dist/src/components/FormikControls/TextBox/async'
import CheckBox from '@arragro/cms-management/dist/src/components/FormikControls/CheckBox/async'
import CustomBubble from '@arragro/cms-management/dist/src/components/FormikControls/CustomBubble'

import SortableTiles from '../Components/Tiles/SortableTiles'
import SortableCloudBannerTexts from '../Components/CloudBannerTexts/SortableCloudBannerTexts'
import SortableSvgIcons from '../Components/SvgIconLinks/SortableSvgIcons'
import MarkdownEditor from '../MarkdownEditor'
import { cloudBannerTextYup, tileYup, svgIconLinkYup } from '../../utils'
import { Hr } from '../../helpers'

const { makeEmptyString } = utils.Helpers

const landingPageHelper = {
    newTile: (): ITile => {
        return {
            name: '',
            svgBased: false,
            imageUrl: '',
            imageAlt: '',
            markdown: '',
            hasLink: false,
            linkText: '',
            href: '',
            cssClass: ''
        }
    },

    newTiles: (): Array<ITile> => {
        return new Array<ITile>()
    },

    newCloudBannerText: (): ICloudBannerText => {
        return {
            markdown: ''
        }
    },

    newCloudBannerTexts: (): Array<ICloudBannerText> => {
        return new Array<ICloudBannerText>()
    },

    newSvgIconLink: (): ISvgIconLink => {
        return {
            title: '',
            svg: '',
            href: '',
            markdown: ''
        }
    }
}

export interface ILandingPageForm {
    title: string
    startingClouds: Array<ITile>
    infiniteClouds: Array<ITile>
    cloudBannerTexts: Array<ICloudBannerText>
    markdownIntro: string
    svgIconLinksServices: Array<ISvgIconLink>
    whatWeveDones: Array<ITile>
    technologyClouds: Array<ITile>
    technologyMarkdown: string
    markdownOutro: string
    hasContactForm: boolean
}

export default class LandingPage extends CustomContentTypeBase {
    constructor (props: Interfaces.IComponentType) {
        super(props)
    }

    yup = Yup.object().shape({
        title: Yup.string().required('Please supply a Title.').max(512, 'Title has a 512 character limit.'),
        startingClouds: Yup.array().of(tileYup),
        infiniteClouds: Yup.array().of(tileYup),
        cloudBannerTexts: Yup.array().of(cloudBannerTextYup),
        markdownIntro: Yup.string(),
        svgIconLinksServices: Yup.array().of(svgIconLinkYup),
        whatWeveDones: Yup.array().of(tileYup),
        technologyClouds: Yup.array().of(tileYup),
        technologyMarkdown: Yup.string(),
        markdownOutro: Yup.string(),
        hasContactForm: Yup.bool()
    })

    public render () {
        const {
            culture,
            contentData
        } = this.props
        const contentJson = contentData.contentJson

        const getArray = (array: any): Array<any> => {
            if (array !== undefined) {
                return array
            }
            return []
        }

        const getInitialValues = (): ILandingPageForm => {
            if (contentJson && contentJson[culture]) {
                return {
                    title: makeEmptyString(contentJson[culture].title),
                    startingClouds: getArray(contentJson[culture].startingClouds),
                    infiniteClouds: getArray(contentJson[culture].infiniteClouds),
                    cloudBannerTexts: getArray(contentJson[culture].cloudBannerTexts),
                    markdownIntro: makeEmptyString(contentJson[culture].markdownIntro),
                    svgIconLinksServices: getArray(contentJson[culture].svgIconLinksServices),
                    whatWeveDones: getArray(contentJson[culture].whatWeveDones),
                    technologyClouds: getArray(contentJson[culture].technologyClouds),
                    technologyMarkdown: makeEmptyString(contentJson[culture].technologyMarkdown),
                    markdownOutro: makeEmptyString(contentJson[culture].markdownOutro),
                    hasContactForm: contentJson[culture].hasContactForm === undefined ?
                        false :
                        contentJson[culture].hasContactForm
                }
            }
            return {
                title: '',
                startingClouds: [],
                infiniteClouds: [],
                cloudBannerTexts: [],
                markdownIntro: '',
                svgIconLinksServices: [],
                whatWeveDones: [],
                technologyClouds: [],
                technologyMarkdown: '',
                markdownOutro: '',
                hasContactForm: false
            }
        }

        const initialValues = getInitialValues()
        const contentRulesExceptionListContainers = this.getContentRulesExceptionListContainers()
        console.log(contentRulesExceptionListContainers)

        return <Formik
            ref={(x: Formik<ILandingPageForm>) => this.formik = x}
            initialValues={getInitialValues()}
            isInitialValid={this.yup.isValidSync(initialValues)}
            onSubmit={() => null}
            validationSchema={this.yup}
            render={({ submitCount, handleBlur, handleChange, values, errors, dirty, isValid, setFieldValue }: FormikProps<ILandingPageForm>) => (
                <Form>
                    <CustomBubble dirty={dirty} isValid={isValid} onChange={this.onCustomBubbleChange} />

                    <Grid container>
                        <Grid item xs={12} md={6}>

                            <TextBox
                                type='text'
                                name='title'
                                label='Title'
                                value={values.title}
                            />

                            <Hr />

                            <SortableTiles
                                contentData={this.props.contentData}
                                name='startingClouds'
                                typeName='Starting Clouds'
                                items={values.startingClouds}
                                newItem={landingPageHelper.newTile()}
                                onChange={setFieldValue}
                                getName={(item: ITile) => item.name}
                                maxNumberOfItems={4}
                                linkIsMandatory={false}
                                useMarkdown={false}
                                rulesExceptionListContainers={contentRulesExceptionListContainers}
                            />

                            <Hr />

                            <SortableTiles
                                contentData={this.props.contentData}
                                name='infiniteClouds'
                                typeName='Infinite Clouds'
                                items={values.infiniteClouds}
                                newItem={landingPageHelper.newTile()}
                                onChange={setFieldValue}
                                getName={(item: ITile) => item.name}
                                maxNumberOfItems={8}
                                linkIsMandatory={false}
                                useMarkdown={false}
                                rulesExceptionListContainers={contentRulesExceptionListContainers}
                            />

                            <Hr />

                            <SortableCloudBannerTexts
                                contentData={this.props.contentData}
                                name='cloudBannerTexts'
                                typeName='Cloud Banner Texts'
                                items={values.cloudBannerTexts}
                                newItem={landingPageHelper.newCloudBannerText()}
                                onChange={setFieldValue}
                                getName={(item: ICloudBannerText) => ''}
                                rulesExceptionListContainers={contentRulesExceptionListContainers}
                            />

                            <Hr />

                        </Grid>
                    </Grid>

                    <MarkdownEditor
                        contentData={this.props.contentData}
                        name='markdownIntro'
                        label='Markdown Intro'
                        value={makeEmptyString(values.markdownIntro)}
                        showAssetPicker={true}
                        saveStashedIncomplete={this.props.saveStashedIncomplete}
                        submitCount={submitCount}
                        handleBlur={handleBlur}
                        setFieldValue={setFieldValue}
                    />

                    <Grid container>
                        <Grid item xs={12} md={6}>

                            <Hr />

                            <SortableSvgIcons
                                contentData={this.props.contentData}
                                name='svgIconLinksServices'
                                typeName='SVG Icon Link'
                                items={values.svgIconLinksServices}
                                newItem={landingPageHelper.newSvgIconLink()}
                                onChange={setFieldValue}
                                getName={(item: ISvgIconLink) => item.title}
                                rulesExceptionListContainers={contentRulesExceptionListContainers}
                            />

                            <Hr />

                            <SortableTiles
                                contentData={this.props.contentData}
                                name='whatWeveDones'
                                typeName='What We&quot;ve Done Tiles'
                                items={values.whatWeveDones}
                                newItem={landingPageHelper.newTile()}
                                onChange={setFieldValue}
                                getName={(item: ITile) => item.name}
                                maxNumberOfItems={4}
                                linkIsMandatory={true}
                                useMarkdown={true}
                                rulesExceptionListContainers={contentRulesExceptionListContainers}
                            />

                            <Hr />

                            <SortableTiles
                                contentData={this.props.contentData}
                                name='technologyClouds'
                                typeName='Technology Clouds'
                                items={values.technologyClouds}
                                newItem={landingPageHelper.newTile()}
                                onChange={setFieldValue}
                                getName={(item: ITile) => item.name}
                                maxNumberOfItems={5}
                                linkIsMandatory={false}
                                useMarkdown={false}
                                rulesExceptionListContainers={contentRulesExceptionListContainers}
                            />

                            <Hr />

                        </Grid>
                    </Grid>

                    <MarkdownEditor
                        contentData={this.props.contentData}
                        name='technologyMarkdown'
                        label='Technology Markdown'
                        value={makeEmptyString(values.technologyMarkdown)}
                        showAssetPicker={true}
                        saveStashedIncomplete={this.props.saveStashedIncomplete}
                        submitCount={submitCount}
                        handleBlur={handleBlur}
                        setFieldValue={setFieldValue}
                    />

                    <MarkdownEditor
                        contentData={this.props.contentData}
                        name='markdownOutro'
                        label='Outro'
                        value={makeEmptyString(values.markdownOutro)}
                        showAssetPicker={true}
                        saveStashedIncomplete={this.props.saveStashedIncomplete}
                        submitCount={submitCount}
                        handleBlur={handleBlur}
                        setFieldValue={setFieldValue}
                    />

                    <CheckBox
                        name='hasContactForm'
                        label='Has Contact Form'
                        checked={values.hasContactForm}
                        value='hasContactForm'
                    />

                </Form>
            )} />
    }
}
