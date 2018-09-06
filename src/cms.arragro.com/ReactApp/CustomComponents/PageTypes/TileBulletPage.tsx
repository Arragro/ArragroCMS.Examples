﻿import * as React from 'react'
import { Grid } from '@material-ui/core'
import { Formik, FormikProps, Form } from 'formik'
import * as Yup from 'yup'

import { ITile } from '../interfaces'
import SortableTiles from '../Components/Tiles/SortableTiles'
import MarkdownEditor from '../MarkdownEditor'
import { tileYup } from 'ReactApp/utils'
import { Hr } from 'ReactApp/helpers'

import { Components, Interfaces, utils } from 'arragrocms-management'

const { CustomContentTypeBase } = Components
const { CustomBubble, TextBox, CheckBox } = Components.FormikControls
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
            contentData,
            edit
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

        return <Formik
            ref={(x: Formik<ITileBulletPageForm, any>) => this.formik = x}
            initialValues={getInitialValues()}
            isInitialValid={edit && this.yup.isValidSync(contentData)}
            onSubmit={() => null}
            validationSchema={this.yup}
            render={({ submitCount, handleBlur, handleChange, values, errors, dirty, isValid, setFieldValue }: FormikProps<ITileBulletPageForm>) => (
                <Form>
                    <CustomBubble dirty={dirty} isValid={isValid} onChange={this.onCustomBubbleChange} />

                    <Grid container>
                        <Grid item xs={12} md={6}>

                            <TextBox
                                type='text'
                                id='title'
                                label='Title'
                                value={values.title}
                                error={errors.title}
                                submitCount={submitCount}
                                handleBlur={handleBlur}
                                handleChange={handleChange}
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
                                id='cloudTileBullets'
                                label='Use Clouds for the Bullets'
                                checked={values.cloudTileBullets}
                                submitCount={submitCount}
                                handleBlur={handleBlur}
                                handleChange={handleChange}
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
                            />

                            <Hr />

                            <TextBox
                                type='text'
                                id='leftColumns'
                                label='Left Columns'
                                value={values.leftColumns}
                                error={errors.leftColumns}
                                submitCount={submitCount}
                                handleBlur={handleBlur}
                                handleChange={handleChange}
                            />

                            <TextBox
                                type='text'
                                id='rightColumns'
                                label='Right Columns'
                                value={values.rightColumns}
                                error={errors.rightColumns}
                                submitCount={submitCount}
                                handleBlur={handleBlur}
                                handleChange={handleChange}
                            />

                        </Grid>
                    </Grid>

                </Form>
            )}
        />
    }
}
