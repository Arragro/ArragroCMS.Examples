import * as React from 'react'
import * as ReactMarkdown from 'react-markdown'
import { FormHelperText, Grid, Button, createStyles, Theme, WithStyles, withStyles } from '@material-ui/core'
import { Controlled as CodeMirror } from 'react-codemirror2'
import { Interfaces, Components } from 'arragrocms-management'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/addon/display/autorefresh'

const style = (theme: Theme) => createStyles({
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

        const { contentData, classes } = this.props
        const styleIssue = { border: '1px solid red' }
        const style = (this.props.error !== undefined ? styleIssue : {})
        const mimeTypeFilter = 'image/jpeg,image/png,image/pjpeg,image/gif'
        const dropzoneAccept = 'image/jpeg,image/png,image/pjpeg,image/gif'

        return <Grid container>
            <Grid item xs={12} xl={8}>
                <Grid container>
                    <Grid item xs={12}>
                        <label>{this.props.label}</label>
                    </Grid>
                    <Grid item xs={12} md={6} style={style}>
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
            </Grid>
        </Grid>
    }
}

export default withStyles(style)(MarkdownEditor)
