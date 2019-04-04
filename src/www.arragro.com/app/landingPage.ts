import * as $ from 'jquery'
import { processStartClouds } from './clouds'

const initialiseLandingPage = () => {
    const $contactForm = $('form#contactForm')
    const $contactFormContainer = $('#contactFormContainer')
    const $sentMessage = $('#sentMessage')
    // const $flipper = $('#contactFormContainer .flipper')

    const isIE = () => {
        return false || !!(document as any).documentMode
    }

    // const isEdge = () => {
    //     return !isIE && !!window.styleMedia
    // }

    $contactForm.on('submit', function (e) {
        e.preventDefault()
        const $recaptchaResponse = $contactForm.find('.g-recaptcha-response')
        const $recaptchaError = $recaptchaResponse.find('.field-validation-error')
        let recaptchaValid = true

        if ($recaptchaResponse.val() === '') {
            $recaptchaError.removeClass('invisible')
            recaptchaValid = false
        } else {
            $recaptchaError.addClass('invisible')
            recaptchaValid = true
        }

        if ($contactForm.valid() && recaptchaValid) {
            const $makeEnquiryButton = $('#contactFormContainer button.make-enquiry')
            const $makeEnquiry = $('#contactFormContainer span.make-enquiry')
            const $sendEnquiry = $('#contactFormContainer span.send-enquiry')

            $makeEnquiry.addClass('hide')
            $sendEnquiry.removeClass('hide')
            $makeEnquiryButton.attr('disabled', 'disabled')

            $.ajax({
                url: '/api/contact',
                contentType: 'application/x-www-form-urlencoded',
                data: $(this).serialize(),
                type: 'POST'
            }).done(function (data) {
                if (data.result) {
                    processStartClouds($('#contactFormContainer .starting-clouds div[class^="cloud-wrapper-"]'), 3)
                    if (isIE()) {
                        $sentMessage.hide().addClass('hide')
                        $contactForm.slideDown(2000)
                        $sentMessage.fadeIn(2000, function () {
                            setTimeout(function () {
                                $contactFormContainer.slideUp(2000)
                            }, 2000)
                        })
                    } else {
                        $('#contactFormContainer .flipper').addClass('flipped')
                        setTimeout(function () {
                            $contactFormContainer.slideUp(2000)
                        }, 2000)
                    }
                } else {
                    alert('Failed to send Enquiry')
                    console.log(data.message)
                }
            })
        }

        return false
    })
}

export default initialiseLandingPage
