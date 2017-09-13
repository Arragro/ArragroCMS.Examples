import * as React from 'react';

declare module "react-copy-to-clipboard" {
    export default class CopyToClipboard extends React.Component<any, any> { }
}