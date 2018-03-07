import * as $ from 'jquery'
import { TimelineLite, TimelineMax, Linear, TweenLite } from 'gsap'

const initialiseLandingPage = () => {
    const allClouds = new TimelineLite(),
        $cloudContainer = $("#cloudContainer"),
        startTimings = [50, 64, 58, 47],
        timings = [60, 74, 68, 77, 60, 74, 68, 77],
        delays = [8, 18, 10, 20, 32, 46, 49, 40, 55],
        animatedCloudStartingLeft = [44, 2, 65, 5],
        animatedCloudLeft = [-68, -120, -82, -134, -68, -120, -82, -134];

    function processStartClouds(startClouds) {
        for (var i = 0; i < startClouds.length; i++) {
            //dynamically create a cloud element
            var cloud = startClouds[i];

            //set its initial position and opacity using GSAP
            TweenLite.set(cloud, { left: animatedCloudStartingLeft[i].toString() + '%', opacity: 0 });
            //create a repeating timeline for this cloud
            var cloudTl = new TimelineMax({ repeat: 0 });
            //fade opacity to 1
            cloudTl.to(cloud, 3, { opacity: 1 })
                //move cloud across its container div with random duration. Start time = 0
                .to(cloud, startTimings[i], { left: "100%", ease: Linear.easeNone }, 0)
                //0.5 seconds before timeline ends start fading opacity to 0
                .to(cloud, .5, { opacity: 0 }, "-=0.5")
            //add this cloud's timeline to the allClouds timeline at a random start time.
            allClouds.add(cloudTl, 0);
        }
    }

    function processInfiniteClouds(infiniteClouds) {

        //loop through creation of 10 clouds
        for (var i = 0; i < infiniteClouds.length; i++) {
            //dynamically create a cloud element
            var cloud = infiniteClouds[i];

            //set its initial position and opacity using GSAP
            TweenLite.set(cloud, { left: "-20%", opacity: 0 });
            //create a repeating timeline for this cloud
            var cloudTl = new TimelineMax({ repeat: -1 });
            //fade opacity to 1
            cloudTl.to(cloud, 3, { opacity: 1 })
                //move cloud across its container div with random duration. Start time = 0
                .to(cloud, timings[i], { left: "100%", ease: Linear.easeNone }, 0)
                //0.5 seconds before timeline ends start fading opacity to 0
                .to(cloud, .5, { opacity: 0 }, "-=0.5")
            //add this cloud's timeline to the allClouds timeline at a random start time.
            allClouds.add(cloudTl, delays[i]);
        }
    }

    function initClouds() {
        processStartClouds($('.starting-clouds div[class^="cloud-wrapper-"]'));
        processInfiniteClouds($('.infinite-clouds div[class^="cloud-wrapper-"]'));
    }


    initClouds();


    var $contactForm = $('form#contactForm');

    $contactForm.on('submit', function () {
        var $recaptchaResponse = $(this).find('.g-recaptcha-response'),
            $recaptchaError = $(this).find('.field-validation-error'),
            recaptchaValid = true;
        if ($recaptchaResponse.val() === '') {
            $recaptchaError.removeClass('invisible');
        } else {
            $recaptchaError.addClass('invisible');
        }
        if ($(this).valid && recaptchaValid) {
            $.ajax({
                url: '/api/contact',
                contentType: 'application/x-www-form-urlencoded',
                data: $(this).serialize(),
                type: "POST"
            }).done(function (data) {
                if (data.result) {
                    alert('Sent Enquiry');
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