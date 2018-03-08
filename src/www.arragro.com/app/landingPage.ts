import * as $ from 'jquery'
import { processStartClouds, processInfiniteClouds } from './clouds'

const initialiseLandingPage = () => {

    function initClouds() {
        processStartClouds($('header .starting-clouds div[class^="cloud-wrapper-"]'), 1);
        processInfiniteClouds($('header .infinite-clouds div[class^="cloud-wrapper-"]'));
    }

    try {
        initClouds();
    } catch (e) {
        console.log('error-initClouds', e);
    }


    const $contactForm = $('form#contactForm');
    const $contactFormContainer = $('#contactFormContainer');
    const $sentMessage = $('#sentMessage');

    const isIE = () => {
        return false || !!(document as any).documentMode
    }

    const isEdge = () => {
        return !isIE && !!window.styleMedia
    }

    $contactForm.on('submit', function (e) {
        e.preventDefault();
        debugger
        var $recaptchaResponse = $contactForm.find('.g-recaptcha-response'),
            $recaptchaError = $recaptchaResponse.find('.field-validation-error'),
            recaptchaValid = true;
        if ($recaptchaResponse.val() === '') {
            $recaptchaError.removeClass('invisible');
            recaptchaValid = false;
        } else {
            $recaptchaError.addClass('invisible');
            recaptchaValid = true;
        }
        debugger
        if ($contactForm.valid() && recaptchaValid) {
            $.ajax({
                url: '/api/contact',
                contentType: 'application/x-www-form-urlencoded',
                data: $(this).serialize(),
                type: "POST"
            }).done(function (data) {
                if (data.result) {
                    processStartClouds($('#contactFormContainer .starting-clouds div[class^="cloud-wrapper-"]'), 3);
                    if (isIE()) {
                        $sentMessage.hide().addClass('hide');
                        $contactForm.fadeOut(2000);
                        $sentMessage.fadeIn(2000, function () {
                            setTimeout(function () {
                                $contactFormContainer.slideUp(2000);
                            }, 2000)
                        });
                    } else {
                        $('#contactFormContainer .flipper').addClass('flipped');
                        setTimeout(function () {
                            $contactFormContainer.slideUp(2000);
                        }, 2000);
                    }
                } else {
                    alert('Failed to send Enquiry');
                    console.log(data.message);
                }
            })
        }

        return false;
    });
}

export default initialiseLandingPage