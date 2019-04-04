import * as React from 'react'
import Grid from '@material-ui/core/Grid'
import { Formik, FormikProps, Form } from 'formik'
import * as Yup from 'yup'

import { ITile } from '../interfaces'
import SortableTiles from '../Components/Tiles/SortableTiles'
import MarkdownEditor from '../MarkdownEditor'
import { tileYup } from '../../utils'
import { Hr } from '../../helpers'

import { Interfaces, utils } from '@arragro/cms-management'

import { CustomContentTypeBase } from '@arragro/cms-management/dist/src/components/ComponentTypeExtentions/CustomTypeBase'
import TextBox from '@arragro/cms-management/dist/src/components/FormikControls/TextBox/async'
import CheckBox from '@arragro/cms-management/dist/src/components/FormikControls/CheckBox/async'
import CustomBubble from '@arragro/cms-management/dist/src/components/FormikControls/CustomBubble'

const { makeEmptyString } = utils.Helpers

const tileBulletPageHelper = {
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
    }
}

export interface ITileBulletPageForm {
    title: string
    introMarkdown: string
    cloudTileBullets: boolean
    tileBullets: Array<ITile>
    leftColumns: string
    rightColumns: string
}

export default class TileBulletPage extends CustomContentTypeBase {

    constructor (props: Interfaces.IComponentType) {
        super(props)
    }

    yup = Yup.object().shape({
        title: Yup.string()
            .required('Please supply a Title.')
            .max(50, 'Title has a 50 character limit.'),
        introMarkdown: Yup.string()
            .required('Please supply an Introduction.')
            .max(4000, 'Introduction has a 4000 charater limit'),
        cloudTileBullets: Yup.bool(),
        tileBullets: Yup.array().of(tileYup),
        leftColumns: Yup.number().required('Please supply a Left Columns.').max(12, 'Please supply a number <= 12.'),
        rightColumns: Yup.number().required('Please supply a Right Columns.').max(12, 'Please supply a number <= 12.')
    })

    public render () {
        const {
            culture,
            contentData
        } = this.props
        const contentJson = contentData.contentJson

        const getInitialValues = (): ITileBulletPageForm => {
            if (contentJson && contentJson[culture] !== undefined) {
                return {
                    title: makeEmptyString(contentJson[culture].title),
                    introMarkdown: makeEmptyString(contentJson[culture].introMarkdown),
                    cloudTileBullets: contentJson[culture].cloudTileBullets,
                    tileBullets: contentJson[culture].tileBullets ? contentJson[culture].tileBullets : [],
                    leftColumns: makeEmptyString(contentJson[culture].leftColumns),
                    rightColumns: makeEmptyString(contentJson[culture].rightColumns)
                }
            }
            return {
                title: '',
                introMarkdown: '',
                cloudTileBullets: false,
                tileBullets: [],
                leftColumns: '4',
                rightColumns: '6'
            }
        }

        const initialValues = getInitialValues()
        const contentRulesExceptionListContainers = this.getContentRulesExceptionListContainers()

        return <Formik
            ref={(x: Formik<ITileBulletPageForm>) => this.formik = x}
            initialValues={getInitialValues()}
            isInitialValid={this.yup.isValidSync(initialValues)}
            onSubmit={() => null}
            validationSchema={this.yup}
            render={({ submitCount, handleBlur, handleChange, values, errors, dirty, isValid, setFieldValue }: FormikProps<ITileBulletPageForm>) => (
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

                        </Grid>
                    </Grid>

                    <MarkdownEditor
                        contentData={this.props.contentData}
                        name='introMarkdown'
                        label='Intro'
                        value={makeEmptyString(values.introMarkdown)}
                        showAssetPicker={true}
                        saveStashedIncomplete={this.props.saveStashedIncomplete}
                        submitCount={submitCount}
                        handleBlur={handleBlur}
                        setFieldValue={setFieldValue}
                    />

                    <Grid container>
                        <Grid item xs={12} md={6}>

                            <CheckBox
                                name='cloudTileBullets'
                                label='Use Clouds for the Bullets'
                                checked={values.cloudTileBullets}
                                value='cloudTileBullets'
                            />

                            <Hr />

                            <SortableTiles
                                contentData={this.props.contentData}
                                name='tileBullets'
                                typeName='Tile Bullets'
                                items={values.tileBullets}
                                newItem={tileBulletPageHelper.newTile()}
                                onChange={setFieldValue}
                                getName={(item: ITile) => item.name}
                                maxNumberOfItems={8}
                                linkIsMandatory={false}
                                useMarkdown={true}
                                rulesExceptionListContainers={contentRulesExceptionListContainers}
                            />

                            <Hr />

                            <TextBox
                                type='text'
                                name='leftColumns'
                                label='Left Columns'
                                value={values.leftColumns}
                            />

                            <TextBox
                                type='text'
                                name='rightColumns'
                                label='Right Columns'
                                value={values.rightColumns}
                            />

                        </Grid>
                    </Grid>

                </Form>
            )}
        />
    }
}
