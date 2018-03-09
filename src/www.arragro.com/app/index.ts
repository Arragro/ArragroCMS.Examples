import '../wwwroot/css/site.scss'
import initialiseLandingPage from './landingPage'

import * as $ from 'jquery'
import 'jquery-validation'
import 'jquery-validation-unobtrusive'
import 'bootstrap'
import 'popper.js'
import './fontawesome'
import './fa-custom'

$(document).ready(function () {

    initialiseLandingPage()

    if ($('#contactFormContainer').length > 0) {
        const $flipper = $('#contactFormContainer .flipper')
        const $contactForm = $('#contactForm')
        const $sentMessage = $('#sentMessage')

        $flipper.height($contactForm.outerHeight())
        $sentMessage.height($contactForm.outerHeight())
    }

})