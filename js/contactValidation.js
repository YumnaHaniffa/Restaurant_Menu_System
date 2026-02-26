//get the form fields
const Name = document.getElementById('name');
const number = document.getElementById('number');
const email = document.getElementById('email');
const subject = document.getElementById('subject');
const message = document.getElementById('message');
function displayRequiredWarning(field, message){
    let errorElement = document.createElement('span');    
    errorElement.classList.add('warning-message');
    errorElement.textContent = message;
    field.parentNode.insertBefore(errorElement, field.nextElementSibling);
    field.errorElement = errorElement
}
function clearWarning(){
    if(field.errorElement && field.errorElement.parentNode){
      field.errorElement.parentNode.removeChild(field.errorElement);  
      field.errorElement = null;  ;
    }
}
Name.addEventListener('blur', function(){
    if(!this.value.trim()){
        displayRequiredWarning(this, 'Name is required.');
    }else{
        clearWarning(this);
    }
});
number.addEventListener('blur', function(){
    if(!this.value.trim()){
        displayRequiredWarning(this, 'Number is required.');
    }else{
        clearWarning(this);
    }
});
email.addEventListener('blur', function(){
    if(!this.value.trim()){
        displayRequiredWarning(this, 'Email is required.');
    }else{
        clearWarning(this);
    }
});

subject.addEventListener('blur', function(){
    if(!this.value.trim()){
        displayRequiredWarning(this, 'Subject is required');
    }else{
        clearWarning(this);
    }
});
message.addEventListener('blur', function(){
    if(!this.value.trim()){
        displayRequiredWarning(this, 'Message is required');
    }else{
        clearWarning(this);
    }
});

const contactForm = document.querySelector('form[name="firstform"]');
if (contactForm){
    contactForm.addEventListener('submit', function(event){
        if(!validateContactForm()){
            event.preventDefault()
            const firstInvalid = contactForm.querySelector('.error-message + input');
            if (firstInvalid){
                firstInvalid.focus();
            }
        }
    });
}

function validateContactForm(){
    let isValid = true;
    clearWarning(Name);
    clearWarning(number);
    clearWarning(email);
    clearWarning(subject);
    clearWarning(message);


    //name validation
    if(!Name.value.trim()){
        displayRequiredWarning(Name, 'Name is required.');
        isValid = false;
        
    }
    //phone number validation
    if(!number.value.trim()){
        displayRequiredWarning(number, 'Name is required.');
        isValid = false;
        
    }else if(!number.value.match(/^[0-9]{10}$/)){
        displayRequiredWarning(number, 'Phone number must be 10 digits.');
        isValid = false;
       
    }
    //email validation
    if(!email.value.trim()){
        displayRequiredWarning(email, 'Email address is required.');
        isValid = false;
    }else if(!email.value.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)){
        displayRequiredWarning(email, 'Please enter a valid email address.');
        isValid = false;
        
    }

    //subject validation
    if(!subject.value.trim()){
        displayRequiredWarning(email, 'Subject is required.');
        isValid = false;
       
    }
    
    //Message validation
    if(!message.value.trim()){
        displayRequiredWarning(message, 'Message is required.');
        isValid = false;
      
    }
    //for invalid validation
    if(!isValid){
        alert('The form invalid, please recheck')
            
    }
    return isValid;
}
