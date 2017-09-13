import * as React from 'react';

declare module "react-s-alert" {

    abstract class IAlert extends React.Component<any, any> {
        static info(msg, data);
        static error(msg, data);
        static warning(msg, data);
        static success(msg, data);
        static close(id);
        static closeAll();
    }

    export default class Alert extends IAlert { }
}