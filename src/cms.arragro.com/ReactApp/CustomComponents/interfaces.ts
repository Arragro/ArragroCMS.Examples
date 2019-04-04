export interface ICarousel extends IItemType {
    name: string | null
    imageUrl: string
    imageAlt: string
    hasLink: boolean
    linkText: string
    href: string
}

export interface ITile extends IItemType {
    name: string | null
    svgBased: boolean
    imageUrl: string
    imageAlt: string
    markdown: string
    hasLink: boolean
    linkText: string
    href: string
    cssClass: string
}

export interface IContact extends IItemType {
    title: string
    name: string | null
    phoneNumber: string
    email: string
    linkedIn: string
    gravitar: string
    bio: string
}

export interface IRandomCarousel {
    carousels: Array<ICarousel>
}

export interface ICloudBannerText {
    markdown: string
}

export interface ISvgIconLink {
    title: string
    svg: string
    href: string
    markdown: string
}

export interface IItemType {
    name: string | null
}
