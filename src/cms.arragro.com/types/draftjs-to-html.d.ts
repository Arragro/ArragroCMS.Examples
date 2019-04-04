declare module 'draftjs-to-html' {
    import { RawDraftContentState, ContentState } from "draft-js"
    export default function (content: RawDraftContentState): string
}
