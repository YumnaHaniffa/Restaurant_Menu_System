const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const codeInput = document.getElementById("code");
const mobileInput = document.getElementById("mobile");
const emailInput = document.getElementById("email");
const addressInput = document.getElementById("address");
const cardNumberInput = document.getElementById("cardNumber");
const expirationMonthSelect = document.getElementById("expairationMonth");
const expirationYearSelect = document.getElementById("expairationYears");
const cvnInput = document.getElementById("pin");
const cardTypeCredit = document.getElementById("creditCard");
const cardTypeDebit = document.getElementById("debitCard");
const cardNetworkVisa = document.getElementById("visa");
const cardNetworkMastercard = document.getElementById("mastercard");
const titleInput = document.getElementById("title");
const choiceRadios = document.querySelectorAll('input[name="choice"]');
const choiceError = document.getElementById('choiceError');
const Payform = document.getElementById('payment-form');

function formatItem(item){

	return{
		name: item.name,
		quantity: item.quantity,
		price: (item.price * item.quantity).toFixed(2)
	};
}


//pfunction to populate the oderform with the cart data

function populateOderSummary(){
	const cartDataJSON = sessionStorage.getItem('cartData');
	//parse JSON data(string) to to the object
	

	if(!cartDataJSON){
		document.getElementById('orderSummary').innerHTML = "<p> Your cart is empty.</p>";
		return;
	}

	let cartItems = JSON.parse(cartDataJSON);
	let orderSummaryContainer = document.getElementById('orderSummary');
	orderSummaryContainer.innerHTML = '';//clear the previous contenet

	let total = 0;
	for (let productId in cartItems){
		if (cartItems.hasOwnProperty(productId)){

			let item = cartItems[productId]; //itemId
			let formattedItem = formatItem(item);


			let itemDiv = document.createElement('div');
			itemDiv.classList.add('summary-item');

			let nameSpan = document.createElement('span');
			nameSpan.classList.add('item-name');
			nameSpan.textContent = formattedItem.name;

			let priceSpan = document.createElement('span');
			priceSpan.classList.add('item-price');
			priceSpan.textContent = `$${formattedItem.price}`

			let quantitySpan = document.createElement('span');
			quantitySpan.classList.add('item-quantity');
			quantitySpan.textContent = `(${formattedItem.quantity})`;

			itemDiv.appendChild(nameSpan);
			itemDiv.appendChild(priceSpan);
			itemDiv.appendChild(quantitySpan);

			orderSummaryContainer.appendChild(itemDiv);
			total += item.price * item.quantity;
		}	
	}

	let totalDiv = document.createElement('div');
	totalDiv.classList.add('summary-total');

	let totalLabel = document.createElement('span');
	totalLabel.classList.add('total-label');
	totalLabel.textContent = 'Total:';

	let totalAmount = document.createElement('span');
	totalAmount.classList.add('total-amount');
	totalAmount.textContent = `$${total.toFixed(2)}`;

	totalDiv.appendChild(totalLabel);
	totalDiv.appendChild(totalAmount);
	orderSummaryContainer.appendChild(totalDiv);

	
}
document.addEventListener('DOMContentLoaded',populateOderSummary);


//==================================================================================

//function to dispaly an error message next to input
function displayError(inputElement, message){
	let errorElement = inputElement.nextElementSibling;
	if (!errorElement || !errorElement.classList.contains('error-message')){
		errorElement = document.createElement('div');
		errorElement.classList.add('error-message');
		inputElement.parentNode.insertBefore(errorElement, inputElement.nextElementSibling);
		
	}
	errorElement.textContent = message;
}
function clearError(inputElement){
	let errorElement = inputElement.nextElementSibling;
	if (errorElement && errorElement.classList.contains('error-message')){
		errorElement.textContent ='';
	}
}





//Validations for interaction
//variable to track the user interaction
let firstNameTouched = false;
let lastNameTouched = false;
let titleTouched = false;
//if the user only focus but not interact, the interaction is set to false
firstNameInput.addEventListener('focus', () =>{
	firstNameTouched = false;
});
lastNameInput.addEventListener('focus', () =>{
	lastNameTouched = false;
});
titleInput.addEventListener('focus', () =>{
	titleTouched = false;
});

//then again when user interacts with the field the error dissapear
firstNameInput.addEventListener('input', () =>{
	firstNameTouched = true;
	clearError(firstNameInput);
});

lastNameInput.addEventListener('input', () =>{
	lastNameTouched = true;
	clearError(lastNameInput)
});
titleInput.addEventListener('input', () =>{
	titleTouched = true;
	clearError(titleInput)
});



//if the field is empty the erro is popped again
firstNameInput.addEventListener('blur', () => {
    if (!firstNameInput.value.trim()) {
        displayError(firstNameInput, "Please enter your first name.");
    } 	
});
lastNameInput.addEventListener('blur', () => {
    if (!lastNameInput.value.trim()) {
        displayError(lastNameInput, "Please enter your last name.");
    } 
});
titleInput.addEventListener('blur', () => {
    if (!titleInput.value.trim()) {
        displayError(titleInput, "Please enter a title.");
    } 
});
//Validations
function validateCardTypeBlur(){
	const creditCardSelected = cardTypeCredit.checked;
	const debitCardSelected = cardTypeDebit.checked;
	const visaSelected = cardNetworkVisa.checked;
	const masterSelected = cardNetworkMastercard.checked;
	let cardTypeContainer = cardTypeCredit.parentNode.parentNode;

	if(!(creditCardSelected || debitCardSelected)){
		displayError(cardTypeContainer, "Please select a cardtype");
		return false;
	}else{
		clearError(cardTypeContainer)
	}
	let cardNetworkContainer = cardNetworkVisa.parentNode.parentNode;

	if(!(visaSelected || masterSelectedSelected)){
		displayError(cardNetworkContainer, "Please select a one of the given");
		return false;
	}else{
		clearError(cardNetworkContainer)
	}
	return (creditCardSelected || debitCardSelected) && (visaSelected || masterSelected);
}
function validateSelect(){
	if (titleInput.value === ""){
		displayError(titleInput, "Please select a title.");
		return false;
	}else{
		displayError(titleInput, "");
		return true;
	}
}

//at least one radio button is selected
function validateChoice(){
	let isChecked = false;
	for (const radio of choiceRadios){
		if (radio.checked){
			isChecked = true;
			break;
		}
	}
	if(!isChecked){
		choiceError.textContent = "Please select one option"
		return false;
	} else{
		choiceError.textContent ="";
		return true;
	}
}

const firstChoiceRadio = document.querySelector('input[name ="choice"]');
if(firstChoiceRadio){
	firstChoiceRadio.addEventListener('blur', validateChoice);
}
function validateForm(){
	//const isChoiceVlaid = validateChoice();
	const isFirstNameValid = validateFNameOnBlur();
	const isLastNameValid = validateLNameOnBlur();
	
	if (!isFirstNameValid || isLastNameValid){
		displayError(firstNameInput, "Please enter your name before submitting")
		return false;
	}
	return true;
}
	
Payform.addEventListener('submit', (event) =>{
	const validationMessage = validateForm()
	if(!validateForm()){
		event.preventDefault();
		alert(validationMessage)
	}
})

