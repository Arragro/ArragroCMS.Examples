import * as React from 'react'
import * as ReactMarkdown from 'react-markdown'
import { FormHelperText, Grid, Button, createStyles, Theme, WithStyles, withStyles, FormControl } from '@material-ui/core'
import { Controlled as CodeMirror } from 'react-codemirror2'
import { Interfaces, Components } from 'arragrocms-management'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/addon/display/autorefresh'
import { FormControlProps } from '@material-ui/core/FormControl'

const style = (theme: Theme) => createStyles({
    formControl: {
        width: '100%',
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit
    },
    preview: {
        paddingTop: 20,
        paddingLeft: 5,
        '& img': {
            width: '100%'
        }
    }
})

export interface IMarkdownEditorProps extends WithStyles<typeof style> {
    contentData: Interfaces.IContentData
    name: string
    label: string
    value: string
    error?: any
    submitCount: number
    showAssetPicker: boolean
    options?: any
    formControlProps?: FormControlProps
    handleBlur (event: any): void
    setFieldValue (name: string, value: any): void
    saveStashedIncomplete? (): void
}

interface IMarkdownEditorState {
    dirty: boolean
    assetModalOpen: boolean
}

class MarkdownEditor extends React.Component<IMarkdownEditorProps, IMarkdownEditorState> {
    codeMirror: any

    constructor (props: IMarkdownEditorProps) {
        super(props)

        this.state = {
            dirty: false,
            assetModalOpen: false
        }

        this.onChange = this.onChange.bind(this)
        this.showImageAssetModal = this.showImageAssetModal.bind(this)
    }

    closeClick = () => {
        this.setState({
            ...this.state,
            assetModalOpen: false
        })
    }

    selectClick = (asset: Interfaces.IAsset) => {
        let cursor = this.codeMirror.editor.getCursor()
        this.codeMirror.editor.replaceRange(`![${asset.alt}](${asset.cdnUrl})`, cursor, cursor)
        this.showImageAssetModal()
    }

    showImageAssetModal = () => {
        this.setState({
            ...this.state,
            assetModalOpen: true
        })
    }

    onChange (editor: any, metadata: any, value: any) {
        this.setState({
            ...this.state,
            dirty: true
        }, () => this.props.setFieldValue(this.props.name, value))
    }

    getError = () => {
        const {
            name,
            submitCount,
            error
        } = this.props
        if ((submitCount > 0 || this.state.dirty) && error) {
            return <FormHelperText id={`${name}--error-text`}>{error}</FormHelperText>
        }
        return null
    }

    render () {
        const options = {
            ...this.props.options,
            lineNumbers: true,
            readOnly: false,
            mode: 'markdown',
            theme: 'eclipse',
            autofocus: false,
            lineWrapping: true,
            autoRefresh: true
        }

        const { contentData, classes, formControlProps, submitCount, error } = this.props
        const { dirty } = this.state
        const styleIssue = { color: 'rgb(244, 67, 54)' }
        const style = (this.props.error !== undefined ? styleIssue : {})
        const mimeTypeFilter = 'image/jpeg,image/png,image/pjpeg,image/gif'
        const dropzoneAccept = 'image/jpeg,image/png,image/pjpeg,image/gif'

        return <FormControl {...formControlProps} className={classes.formControl} error={(submitCount > 0 || dirty) && error !== undefined}>
            <Grid container>
                <Grid item xs={12}>
                    <label style={style}>{this.props.label}</label>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Components.AssetModal
                        contentData={contentData}
                        mimeTypeFilter={mimeTypeFilter}
                        selectClick={this.selectClick}
                        closeClick={this.closeClick}
                        dropzoneAccept={dropzoneAccept}
                        maxSize={10485760}
                        showResize={true}
                        saveStashedIncomplete={this.props.saveStashedIncomplete}
                        modalOpen={this.state.assetModalOpen}
                    />
                    <Button onClick={this.showImageAssetModal} variant='contained' color='secondary' fullWidth={true}>Select Image</Button>
                    {/* {utils.HtmlHelper.renderCmsButton(this.showImageAssetModal, null, 'Select Image', this.props.showAssetPicker, false)} */}
                    <CodeMirror
                        ref={(x) => this.codeMirror = x}
                        value={this.props.value}
                        options={options}
                        onChange={this.onChange}
                        onBeforeChange={this.onChange}
                    />
                    {this.getError()}
                </Grid>
                <Grid item xs={12} md={6} className={classes.preview} >
                    <ReactMarkdown source={this.props.value} escapeHtml={false} />
                </Grid>
            </Grid>
        </FormControl>
    }
}

export default withStyles(style)(MarkdownEditor)
