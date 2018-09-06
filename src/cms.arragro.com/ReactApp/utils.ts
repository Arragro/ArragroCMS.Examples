import * as Yup from 'yup'
import { utils } from 'arragrocms-management'

const { isValidUrl, isUrlRoute } = utils

export const isValidPhoneNumber = /^\+?\d{7,13}$/i

export const contactYup = Yup.object().shape({
    title: Yup.string().max(100, 'Title has a 100 character limit.'),
    name: Yup.string().max(100, 'Name has a 100 character limit.').required('Please supply a Name.'),
    phoneNumber: Yup.string().max(20, 'Phone Number has a 20 character limit.').matches(isValidPhoneNumber, 'Please supply a valid Phone Number.'),
    email: Yup.string().max(100, 'Title has a 100 character limit.').required('Please supply an Email.').email('Please supply a valid Email,'),
    linkedIn: Yup.string().max(255, 'LinkedIn has a 255 character limit.').matches(isValidUrl),
    gravitar: Yup.string().max(2000, 'Gravitar has a 100 character limit.'),
    bio: Yup.string().max(4000, 'Bio has a 4000 character limit.')
})

export const tileYup = Yup.object().shape({
    name: Yup.string().max(100, 'Name has a 100 character limit.').required('Please supply a Name'),
    svgBased: Yup.bool(),
    imageUrl: Yup.string().max(2000, 'Image Url has a 2000 character limit.'),
    imageAlt: Yup.string().max(512, 'Image Alt has a 512 character limit.'),
    hasLink: Yup.bool(),
    linkText: Yup.string().max(100, 'Link Text has a 100 character limit.'),
    href: Yup.string().max(2000, 'Href has a 2000 character limit.').matches(isValidUrl),
    markdown: Yup.string().max(4000, 'Markdown has a 4000 character limit.'),
    cssClass: Yup.string().max(30, 'CSS Class has a 30 character limit.')
})

export const svgIconLinkYup = Yup.object().shape({
    title: Yup.string().max(255, 'Title has a 255 character limit.').required('Please supply a Title.'),
    svg: Yup.string().required('Please supply an SVG.'),
    href: Yup.string().max(2000, 'Href has a 255 character limit.').matches(isUrlRoute, 'Please supply a valid url route e.g. "home".'),
    markdown: Yup.string()
})

export const cloudBannerTextYup = Yup.object().shape({
    markdown: Yup.string().required('Please supply Markdown').max(200, 'Markdown has a 200 character limit.')
})

export const carouselYup = Yup.object().shape({
    name: Yup.string().max(128, 'Name has a 128 character limit.').required('Please supply a Name.'),
    imageUrl: Yup.string().max(2000, 'Image Url has a 2000 character limit.').required('Please supply a Slide Image.'),
    imageAlt: Yup.string().max(512, 'Image Alt has a 512 character limit.'),
    linkText: Yup.string(),
    href: Yup.string().max(2000, 'Href has a 2000 character limit.').matches(isValidUrl)
})
