import * as $ from 'jquery'
import { processStartClouds, processInfiniteClouds } from './clouds'

const initialiseLandingPage = () => {

    function initClouds() {
        processStartClouds($('header .starting-clouds div[class^="cloud-wrapper-"]'), 1);
        processInfiniteClouds($('header .infinite-clouds div[class^="cloud-wrapper-"]'));
    }


    initClouds();


    var $contactForm = $('form#contactForm');

    $contactForm.on('submit', function () {
        var $recaptchaResponse = $(this).find('.g-recaptcha-response'),
            $recaptchaError = $recaptchaResponse.find('.field-validation-error'),
            recaptchaValid = true;
        if ($recaptchaResponse.val() === '') {
            $recaptchaError.removeClass('invisible');
            recaptchaValid = false;
        } else {
            $recaptchaError.addClass('invisible');
            recaptchaValid = true;
        }

        if ($(this).valid() && recaptchaValid) {
            $.ajax({
                url: '/api/contact',
                contentType: 'application/x-www-form-urlencoded',
                data: $(this).serialize(),
                type: "POST"
            }).done(function (data) {
                if (data.result) {
                    $('#contactFormContainer .flipper').addClass('flipped');
                    processStartClouds($('#contactFormContainer .starting-clouds div[class^="cloud-wrapper-"]'), 3);
                    setTimeout(function () {
                        $('#contactFormContainer').slideUp(4000);
                    }, 3000);
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