// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
    //Calling the 4th script to use it:
    bsCustomFileInput.init() //so any custom file input on the page when this code runs is going to be initialized by some basic js functionality.

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})()