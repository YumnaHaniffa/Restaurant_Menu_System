
//1.variable declaration

//select all the element with id cart-popup and stores them in the cartPopup variable(container for cart display)
const cartPopup = document.getElementById('cart-popup');
//select all the element with id cart-items and stores them in the cart-popup variable(container to display each menue item individually)
const cartItemsContainer = document.getElementById('cart-items');
//select all the element with id cart-total and stores them in the  variable(container to display the total)
const cartTotalElement = document.getElementById('cart-total');
//select all the element with id close-cart and stores them in the  variable
const closeCart = document.getElementById('close-cart');


const navLinks = document.querySelectorAll('.navbar .nav-links .nav-link a')  //select all <a> tags with calss nav-link
//select all the element with class nav-category and stores them in the navCategories variable as a list
const navCategories = document.querySelectorAll('.nav-category');
//select all the element with class price-category and stores them in the priceCategories variable as a list
const priceCategories = document.querySelectorAll('.price-category');
//2.manage behavior of the dropdown menus with the navigation categories(when a category ids clicked, it toggels the visibility corresponding of the dropdown while other dropdowns are closed)
const dropdowns = document.querySelectorAll('.drop-down');
const sections = document.querySelectorAll('section');

let cart = {};   //Initialize the cart as an empty object
let allMenuItems =[];//holds all the menu items extracted from the menu xml
let activeFilter ={}; //an empty object store the currently active filter values(the key represents the filter type)
let menuItems;



//================================================================================================================================================================

//REVIEW MENU ITEMS FROM XML=======================================================================================================
//5#CREATE HTML STRUCTURE FOR EACH MENU ITEM =================================
function createMenuItemHTML(itemData){

	return `
		<article class="box-item" data-item-id="${itemData.id}" data-item-name="${itemData.title}" data-item-price="${itemData.price}" data-item-category="${itemData.category}" data-price-range ="${itemData.priceRange}"> 

			  <figure class="box-item-image">
				<img src="${itemData.image}" alt="${itemData.title}">
			  </figure>

			  <div class="box-item-content">
				<h3>${itemData.title}</h3>
					<p class="descrip">${itemData.description}</p>
				<p class="price">$${itemData.price}</p>
					</div>

					</article>
	`;
}

//1#

//LOADING XML WHEN THE PAGE LOADS======================== (request)
document.addEventListener('DOMContentLoaded', () => {
	//run after the page is fully loaded
	fetch('menu.xml')   									
	 //retrieve the XML file from the server

		.then(response => response.text())   //.then() a method of promise API to handle operations that take some time			
		 // convert response as text

		//2#.
		 //PARSING THE XML INTO USABLE DATA =====================(take text in using the method of the tool)
    	.then(xmlString => { 
			const parser = new DOMParser();   				
			//create a new instance  of DOMParser class, a tool to parse XML
        	const xmlDoc = parser.parseFromString(xmlString, "application/xml"); 
			//converts the XML into a document structure        $parameter


			//3#.EXTRACTING MENU ITEM FROM XML ============================
			function extractItems(selector, category, priceRangeFn) {
				const items = xmlDoc.querySelectorAll(selector);   
				//Finds all items matching the selector(items of a specific type) in the xml

				return Array.from(items).map(item => ({
					//convert each one to an easy to use format

					id: item.querySelector('title').textContent.replace(/\s+/g, '-').toLowerCase(),  
					 //creates an ID from the title
					title: item.querySelector('title').textContent, 
					  //gets the item title
					price: parseFloat(item.querySelector('price').textContent.replace('$', '')),
					//get the price and convert to a number
					description: item.querySelector('description').textContent,
					//gets the description
					image: item.querySelector('image').textContent,
					//gets the image URL
					category: category,
					//Assigns the category passed in
					priceRange: priceRangeFn ? priceRangeFn(parseFloat(item.querySelector('price').textContent.replace('$', ''))) : 'unknown',
					//dettermines the price rannge based on the provided function
					mealPreference: item.querySelector('preference')?.textContent.toLowerCase() || 'non-veg'
					//gets meal preference if it exists
					
				}));
			}
			


			//4#COMBINE ALL MENU ITEMS TO AN ARRAY=======================================
			allMenuItems = [
				...extractItems('appetizers item', 'appetizers', price => {
					if (price < 5) return 'under-5';
					if (price <= 10) return '5-10';
					return 'over-10';

				//extract appertizers items with price ranges
				}),
				...extractItems('mains item', 'mains', price => {
					if (price < 5) return 'under-5';
					if (price <= 10) return '5-10';
					if (price <= 15) return '10-15';
					return 'over-15';
				//extract main course items with price ranges
				}),
				...extractItems('drinks item', 'drinks', price => price < 5 ? 'under-5' : '5-10'),
				//extract drink course items with price ranges

				...extractItems('desserts item', 'desserts', price => price < 5 ? 'under-5' : '5-10')
				//extract dessert course items with price ranges
			];
			



			//6# LOADING EACH MENU SECTION IN TO THE WEBPAGE================================
			const appetizersItems = xmlDoc.querySelectorAll('appetizers item');
			// gets all appertizer items from xml

			const appetizersHTML = Array.from(appetizersItems).map(item => ({
				//converts each xml item to a js object
				id: item.querySelector('title').textContent.replace(/\s+/g, '-').toLowerCase(), 
				// create properties for each item
				title: item.querySelector('title').textContent,
				price: parseFloat(item.querySelector('price').textContent.replace('$', '')),
				description: item.querySelector('description').textContent,
				image: item.querySelector('image').textContent,
				category: 'appetizers',
				priceRange: '5-8', // You'll need to determine this based on the price
				
			}))
			.map(createMenuItemHTML).join('');
			//converts each object to html and join them together
			document.getElementById('appetizers-items').innerHTML = appetizersHTML;  
			//places the html into webpage element with ID appetizers-items


			const mainsItems = xmlDoc.querySelectorAll('mains item');
			const mainsHTML = Array.from(mainsItems).map(item => ({
				id: item.querySelector('title').textContent.replace(/\s+/g, '-').toLowerCase(), // Generate a unique ID
				title: item.querySelector('title').textContent,
				price: parseFloat(item.querySelector('price').textContent.replace('$', '')),
				description: item.querySelector('description').textContent,
				image: item.querySelector('image').textContent,
				category: 'mains',
				priceRange: '5-10',
			})).map(createMenuItemHTML).join('');
			document.getElementById('mains-items').innerHTML = mainsHTML;


			const drinksItems = xmlDoc.querySelectorAll('drinks item');		 
			const drinksHTML = Array.from(drinksItems).map(item => ({
				id: item.querySelector('title').textContent.replace(/\s+/g, '-').toLowerCase(), // Generate a unique ID
				title: item.querySelector('title').textContent,
				price: parseFloat(item.querySelector('price').textContent.replace('$', '')),
				description: item.querySelector('description').textContent,
				image: item.querySelector('image').textContent,
				category: 'drinks',
				priceRange: '5-10', 
			})).map(createMenuItemHTML).join('');
			document.getElementById('drinks-items').innerHTML = drinksHTML;

				
			const dessertsItems = xmlDoc.querySelectorAll('desserts item'); 
			const dessertsHTML = Array.from(dessertsItems).map(item =>({
				id: item.querySelector('title').textContent.replace(/\s+/g, '-').toLowerCase(), // Generate a unique ID
				title: item.querySelector('title').textContent,
				price: parseFloat(item.querySelector('price').textContent.replace('$', '')),
				description: item.querySelector('description').textContent,
				image: item.querySelector('image').textContent,
				category: 'desserts',
				priceRange: '5-10', 
			})).map(createMenuItemHTML).join('');	
			document.getElementById('desserts-items').innerHTML = dessertsHTML;


//========================================================================================================================================


//========================================================================================================================================

		//1##. SETTING UP THE FILTER STATE ---------------------------------------------------------------------------------------
			activeFilter = {
				category: 'all',
				price: 'all',
				preference: 'all'
			};
			//creates  global object that tracks which filters are currently active
			//default is 'all' for each filter type, showing everything

			//-----------------------------------------------------------------------------------



			filterItems(); // Show all items initially
			setupFilterEvents();
						
			const options = document.querySelectorAll('.drop-down .nav-link');	

			options.forEach(option =>{
				option.addEventListener('click', handleOptionClick);
			});

			//4. ADDING ITEMS TO CART
			
			menuItems = document.querySelectorAll('.box-item');

			menuItems.forEach(item => {            
				item.addEventListener('click', (event) => {  
					//sets up what happens when a menu item is clicked

				// sets up what happens when a menu item clicked
					
					const clickedItem = event.currentTarget;
					const itemId = clickedItem.dataset.itemId;     
					const itemName = clickedItem.dataset.itemName;	 
					const itemPrice = parseFloat(clickedItem.dataset.itemPrice);   
					// gtes details of the clicked item
									
					if(cart[itemId]) {     
						cart[itemId].quantity++;  
						//if item is already in cart, increase qunatity  
					} else {
						cart[itemId] = {   
							name: itemName, 
							price: itemPrice, 
							quantity: 1
						};
						// if item is not in cart, add it with quantity 1
					}
					updateCartPopup();     
					// refreshes the cart display
					cartPopup.style.display = 'block';   
					// shows the cart popup
					cartPopup.scrollIntoView({ behavior: 'smooth', block: 'center' }); 
					// scrolls to msake the cart visible  
				
				});
			});

			


			//5 CHECKOUT PROCESS
			//event lestner to handdle the button click
			document.getElementById('checkout-button').addEventListener('click', function(){
				let cartDataJSON = JSON.stringify(cart);
				//convert  car t data  to string
				sessionStorage.setItem('cartData', cartDataJSON); 
				//save cart data browser storage
				window.location.href = 'orderForm.html';  
				// Redirects to the order form page
			});

			

			navCategories.forEach(category =>{                  //iterates through each element in the array(navCategories)  , category->the current category processed in each iteration, item=> difines the code to be executed for each menu item
				category.addEventListener('click', (event) =>{     //a click event is added to each category so when a category is clicked the bellow function will be executed
					event.preventDefault();                         //prevent default behavior of the click event,such as navigate to a new page
					const categoryName = event.target.dataset.category;  //(event.target)referse to the specific element that was clicked,retrieves the value of the data-category of the clicked element
					console.log("Clicked Nav Category:", categoryName);
					const clickedDropdown = document.querySelector(`.dropdown-content[data-category = "${categoryName}"]`); //selects a element with the class dropdown-contenet with the attribute  data-category that matsces the categoryName
					console.log("Clicked Nav Category:", clickedDropdown);

					dropdowns.forEach(dropdown=>{                 //iterates through each element in the array(dropdowns)  , dropdown->the current dropdown processed in each iteration, dropdown=> difines the code to be executed for each menu item
						if (dropdown !== clickedDropdown){        //if the clicked drpdown is not eqaul to the dropdown that is processing currently
							dropdown.classList.remove('show');   //the line removes the show class from it
						}	
					});
					
					clickedDropdown.classList.toggle('show');  //if it is equal the dropdown menu is shown
				});
			});

			priceCategories.forEach(category =>{
				category.addEventListener('click', (event) =>{
					event.preventDefault();
					const categoryName = event.target.dataset.category ;
					console.log("Clicked Price Category:",category_name);
					const clickedDropdown = document.querySelector(`.dropdown-content[data-category = "${categoryName}"]`);
					console.log("Selected Dropdown:", clickedDropdown);
					console.log("Dropdown after toggle:", clickedDropdown);


					dropdowns.forEach(dropdown =>{
						if(dropdown !== clickedDropdown){
							dropdown.classList.remove('show');

						}
					});

					clickedDropdown.classList.toggle('show');
				
				});
			});


					
			// user sees relevant content after clicking a navigation link, prioritizing the first visible item
			document.addEventListener('click', (event) =>{                                
				const target = event.target;
				let isClickInsideDropdown = false;
				
				dropdowns.forEach(dropdown => {
					if (dropdown.classList.contains('show') && (target === dropdown || dropdown.contains(target) || target.classList.contains('nav-category'))){
						isClickInsideDropdown = true;
					}
				});

				if (!isClickInsideDropdown){
					dropdowns.forEach(dropdown => {
						dropdown.classList.remove('show');
					});
				}
			});	
		});
	});

//===============================================================================================================================

//===============================================================================================================================
//1. UPDATE THE CART DISPLAY

function updateCartPopup(){
		
	cartItemsContainer.innerHTML = '';                          //clear the content in the cartItemsContatiner removing any exsisting cart items
	let total = 0;                                              //initializing the total to 0
	let totalItemCount = 0;                                     //initialize the item count to 0
	
	 //iterating through each cart item in the cart object using the itemId as the key
	for (const itemId in cart){                               
		const item = cart[itemId];                              // retreive the item obeject using the itemId

		//Create a container to each menu item
		const itemElement = document.createElement('div');       //create a div to represent a cart item
		itemElement.classList.add('cart-item');                  //add the class cart-item to the itemElement, this is in the css
		
		// create elements for each item name
		const itemDetails = document.createElement('div');       //create a div to hold the item details
		itemDetails.innerHTML = `${item.name}`;                  //set the inner HTML of the item deatils to include the item name
		itemDetails.classList.add('item-details');               // add the class item-details to the itemDetails,this is in the css
		
		//creae container for price and qunatity controls
		const quantityPriceContainer = document.createElement('div');      //create a div to represent the quantity and price container
		quantityPriceContainer.classList.add('quantity-price-container');  // add the class quantity-price-container to the quantitiPrice Container,this is in the css
		 
		//create price display
		const priceDisplay = document.createElement('div');                             //creates a div to represent the item price
		priceDisplay.innerHTML = `$${(item.price * item.quantity).toFixed(2)}`;          //set the inner HTML of the priceDispaly element to the formula
		priceDisplay.classList.add('price-display');                                     //add the class price-display to the priceDispaly, in css,child of quantityPriceContainer
		
		// create +/- buttons to adjust quantity
		const quantityControls = document.createElement('div');      //create a div to hold the quantity controls
		quantityControls.innerHTML = `
			<button class= "quantity-btn decrease" data-item-id = "${itemId}">-</button>
			<span>${item.quantity}<span>
			<button class= "quantity-btn increase" data-item-id = "${itemId}">+</button>
		`;	
		//sets the inner HTML of the quantityControl element to include the increase and decrease buttons and the quantity display
		quantityControls.classList.add('quantity-controls')         // add the class quantity-controls to the quantityControls, in css,child of quantityPriceContainer
		
		//add price and quantity controls to thier container
		quantityPriceContainer.appendChild(priceDisplay);           //append the child to the main container
		quantityPriceContainer.appendChild(quantityControls);		  //append the child to the main container
				
		//Remove button
		const removeButton = document.createElement('button');               //create a new button element
		removeButton.textContent = 'Remove';                                 //set the text contenet of the button to 'remove'
		removeButton.classList.add('remove-btn');                            //add the class 'remove-btn' to the button
		removeButton.dataset.itemId = itemId;                                //sets the data-item-Id attribute of the remove button to itemId
		
		//group item name and remove button
		const itemAndRemove = document.createElement('div');                  //creatig a div to represent the item and remove button conainer
		itemAndRemove.classList.add('item-and-remove');                       //add the class item-and-remove to the itemAndRemove, in css
		itemAndRemove.appendChild(itemDetails);                               //appending the itemDetails element to the item and remove element
		itemAndRemove.appendChild(removeButton);			                   //appending the remove button element to the item and remove element
		
		// combine all elements into item container
		itemElement.appendChild(itemAndRemove);                                //appending theitem-details elements to the item Element
		itemElement.appendChild(quantityPriceContainer);                       //appending theitem-details elements to the item Element
						  
						
		//add the item to the cart display
		cartItemsContainer.appendChild(itemElement);                         //appending the itemElement to the cartItems container adding it to the cart display

		//update running totals
		total += item.price * item.quantity;                                 //add the total price to the total variable  
		totalItemCount += item.quantity;                                                 //increment item count
	}
	cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;            //setting the text content of the artTotalElement to dispaly thetotal price of th eitems in the cart
	
	//Atatch event listners to quantity buttons and remove buttons
	
	attachQuantityEventListeners();                                                                       
	attachRemoveEventListeners();
	//call the fuctions to attach event listners to the quantity buttons and remove buttons
	
	//update the cart item count
	const cartIconCount = document.querySelector('.cart-button .cart span');              //this targets the span element with the cart icon in the cart button
	cartIconCount.textContent = totalItemCount;                                                //set the count to the number of unique items
}
//4.

//2.HANDLE ITEM REMOVAL
function attachQuantityEventListeners(){
	const quantityButtons = document.querySelectorAll('.quantity-btn');    //select all elements with the class name and stores them in the quantityButtons variable
	//finds all + and - buttons
	quantityButtons.forEach(button =>{                                     //iterates through ech quantity-btn element  in the  quantityButtons list
		button.addEventListener('click', (event)=> {                        //add a click event listner to each quantity-btn element
		// set up what item this button belong to	
			
			const itemId = event.target.dataset.itemId;                    //retreive the itemId of the clicked item
			const action = event.target.classList.contains('increase')? 'increase' : 'decrease'; 
			 //determines whether the button is a increase or decrease bsed on its class
			 //detremines if this is a + or - button
					
			if (cart[itemId]){                                                //checks if the item exsist in the cart object
				if (action === 'increase'){
					if (cart[itemId].quantity < 50){
					cart[itemId].quantity++;                                  //if the action is increase increments the items quantity
					// increase qunatity  up to max 50
					}
					const increaseButton = button.parentElement.querySelector('.increase');
					if (cart[itemId].quantity >=50){
						increaseButton.disabled = true;
						//disables + button at max quantity
					}else{
						increaseButton.disabled = false;
					}	
				}else if (action === 'decrease' && cart[itemId].quantity > 1){
					cart[itemId].quantity--; //if the action is decrease and the quantity is greater than 1 decrements the items quantity
					//decrease quantity if more than 1
				} else if (action == 'decrease' && cart[itemId].quantity === 1){
					delete cart[itemId];  //if the action is decrease and the quantity is equal to 1 deletes the item
					// removes item completely if qunatity would go to 0
						
				}
				updateCartPopup();      
				// refreshes the cart display
			}	
						
						
		});
	});	
			
}

//3.
function attachRemoveEventListeners(){
	const removeButtons = document.querySelectorAll('.remove-btn');     //select all elements with the class name  remove-btn and stores them in the removeBuuttons variable
	// finds all remove buttons
	removeButtons.forEach(button =>{                                              //iterates through each remove-btn element  in the  removeButtons list
		button.addEventListener('click', (event) =>{  //add a click event listner to each remove-btn element
		//sets up what happnes when a remove button is clicked
			
			const itemId = event.target.dataset.itemId;  //retreive the itemId of the clicked item
			//remove the item from the cart
			delete cart[itemId];                                                  //deletes the item with the respective itemId
			updateCartPopup();                                                   //again updates the cart display
		});
	});
}	

//5## MAIN FILTERING FUNCTION ---------------------------------------

function filterItems(){
	const filteredMenuItems = allMenuItems.filter(item =>{
		//Goes through each menu items and decides if it should be shown

		let matchesCategory = true;
		let matchesPrice = true;
		let matchesPreference = true;
		// Assumes each item passes all filters initially

		if (activeFilter.category !== 'all'){
			matchesCategory = item.category === activeFilter.category;
		}
		//if a category filter is active, check if the item's category matches

		if (activeFilter.price !== 'all'){
			matchesPrice = filterByPrice({dataset: { itemPrice: item.price}}, activeFilter.price);

		}
		//if a price filter is active, check if the item's price falls within the range
		if (activeFilter.preference !== 'all'){
			matchesPreference = item.mealPreference === activeFilter.preference;
			// if a meal preference filter is active, check if the item matches(veg/non-veg)

		}
		return matchesCategory && matchesPrice && matchesPreference;
		//the item is only shown if it passes ALL active filters
	

	});


	readerMenueItems(filteredMenuItems);
	//updates the webpage with only the filtered items

	
	//find the first visible item
	const firstVisisbleSection = Array.from(sections).find(section=> section.style.display === 'block');

	//scroll to the first visible Area
	if (firstVisisbleSection) {
		const headingHeight = 100;
		const sectionTop = firstVisisbleSection.offsetTop;
		window.scrollTo({
			top: sectionTop - headingHeight,
			behavior: 'auto'
		});
		//firstVisisbleSection.scrollIntoView({ behavior: 'auto', block: 'start'});
	}	

}

//2.DIPLAYING THE FILTERED ITEMS
function readerMenueItems(items){
	const appetizersContainer = document.getElementById('appetizers-items');
	const mainsContainer = document.getElementById('mains-items');
	const drinksContainer = document.getElementById('drinks-items');
	const dessertsContainer = document.getElementById('desserts-items');
	//gets reference to the html containers for each menu section

	const appetizersSection = document.querySelector('.Appetizers-box');
    const mainsSection = document.querySelector('.Mains-box');
    const drinksSection = document.querySelector('.Drinks-box');
    const dessertsSection = document.querySelector('.Desserts-box');
	// gets references to the entire section boxes

	//UPDATES EACH SECTION BOXES
    // Get the heading elements (adjust selectors based on your HTML)
    const appetizersHeading = appetizersSection ? appetizersSection.querySelector('.category-title') : null;
    const mainsHeading = mainsSection ? mainsSection.querySelector('.category-title') : null;
    const drinksHeading = drinksSection ? drinksSection.querySelector('.category-title') : null;
    const dessertsHeading = dessertsSection ? dessertsSection.querySelector('.category-title') : null;


	    // Initially hide all sections and headings
		if (appetizersSection) appetizersSection.style.display = 'none';
		if (mainsSection) mainsSection.style.display = 'none';
		if (drinksSection) drinksSection.style.display = 'none';
		if (dessertsSection) dessertsSection.style.display = 'none';
		if (appetizersHeading) appetizersHeading.style.display = 'none';
		if (mainsHeading) mainsHeading.style.display = 'none';
		if (drinksHeading) drinksHeading.style.display = 'none';
		if (dessertsHeading) dessertsHeading.style.display = 'none';
		
	
		// Distribute the already filtered items into their respective containers
		const filteredAppetizers = items.filter(item => item.category === 'appetizers');
		const filteredMains = items.filter(item => item.category === 'mains');
		const filteredDrinks = items.filter(item => item.category === 'drinks');
		const filteredDesserts = items.filter(item => item.category === 'desserts');

		console.log("filteredAppetizers length:", filteredAppetizers.length);
    	console.log("filteredMains length:", filteredMains.length);
    	console.log("filteredDrinks length:", filteredDrinks.length);
    	console.log("filteredDesserts length:", filteredDesserts.length);


		//-----------------------------------
		if (appetizersContainer) appetizersContainer.innerHTML = filteredAppetizers.map(createMenuItemHTML).join('');
		if (mainsContainer) mainsContainer.innerHTML = filteredMains.map(createMenuItemHTML).join('');
		if (drinksContainer)  drinksContainer.innerHTML = filteredDrinks.map(createMenuItemHTML).join('');
		if (dessertsContainer)  dessertsContainer.innerHTML = filteredDesserts.map(createMenuItemHTML).join('');
        //-------------------------------------

		menuItems = document.querySelectorAll('.box-item');
			menuItems.forEach(item => {            
				item.addEventListener('click', (event) => {  
					
					console.log("Cart click listeners attached to menu items.");
					const clickedItem = event.currentTarget;
					const itemId = clickedItem.dataset.itemId;     
					const itemName = clickedItem.dataset.itemName;	 
					const itemPrice = parseFloat(clickedItem.dataset.itemPrice);   
									
					if(cart[itemId]) {     
						cart[itemId].quantity++;    
					} else {
						cart[itemId] = {   
							name: itemName, 
							price: itemPrice, 
							quantity: 1
						};
					}
					updateCartPopup();     
					cartPopup.style.display = 'block';   
					cartPopup.scrollIntoView({ behavior: 'smooth', block: 'center' });  
				
				});
			});

		// Show the sections and headings if they have items or if 'all' is selected
		if (appetizersSection){
			appetizersSection.style.display = filteredAppetizers.length > 0 ? 'block' : 'none';
			if (appetizersHeading)  appetizersHeading.style.display = filteredAppetizers.length > 0 ? 'block' : 'none';
		}
		if (mainsSection){
			mainsSection.style.display = filteredMains.length > 0 ? 'block' : 'none';
			if (mainsHeading)  mainsHeading.style.display = filteredMains.length > 0 ? 'block' : 'none';
		}
		
        if (drinksSection) {
			drinksSection.style.display = filteredDrinks.length > 0 ? 'block' : 'none';
            if (drinksHeading)  drinksHeading.style.display = filteredDrinks.length > 0 ? 'block' : 'none';         
        }
		if (dessertsSection) {
			dessertsSection.style.display = filteredDesserts.length > 0 ? 'block' : 'none';
			if (dessertsHeading)  dessertsHeading.style.display = filteredDesserts.length > 0 ? 'block' : 'none';  
        }
		
}


let selectedCateory = 'all';
let selectedPrice = 'all';


//2## SETTING UP FILTER CLICK EVENTS --------------------------------------------
function setupFilterEvents(){
	navLinks.forEach(link => {
		link.addEventListener('click', (event)=>{
			//runs when a filter option is clicked

			event.preventDefault();
			//prevents the link from navigating

			const filterType = link.dataset.filterType;
			const filterValue = link.dataset.filter;
			//gets the type of filter and its value
			

			if(filterValue === 'all'){
				activeFilter.category = filterValue;
				activeFilter.price = filterValue;
				activeFilter.preference = filterValue;
				//if "all" is selected,,reset all filters
				
			}else if(filterType === 'category') {
				activeFilter.category = filterValue;
				//update only the price filter
				
			}else if(filterType === 'price'){
				activeFilter.price = filterValue;
				// update only the preference filter

			}else if(filterType === 'preference'){
				activeFilter.preference = filterValue;
			}
			

			//apply filters
			filterItems();
			//re- filter the items based on the new settings
			updateFilter(link);
			// opdate the UI  show which filters are active
			
			
		});
	});
}
//

//3## HANDLING DROPDOWN OPTION CICKS ---------------------------------------------------------------------------------
function handleOptionClick(event){
	event.preventDefault();
	//prevents the link from navigating
	const clickedOption = event.target;
	const filterType = clickedOption.dataset.filterType;
	const filterValue = clickedOption.dataset.filter;
	const parentCategory = clickedOption.closest('.nav-link.items').querySelector('.nav-category');
	const dropdown = clickedOption.closest('.drop-down');
	// gets the type and value of the filter that was clicked
	

	if (parentCategory && filterValue !== 'all'){
		parentCategory.innerText = clickedOption.innerText;
		// updates the filter label to show the selected option
	}else if (parentCategory && filterValue === 'all'){
		parentCategory.innerHTML = parentCategory.dataset.defaultText || 'Food Type';
		// reset the filter label if "all" was  selected
	}	

	if(dropdown){
		dropdown.style.dispaly= 'none';
		// hide the dropdown menu after selection
	}

	if(filterType === 'category'){
		activeFilter.category = filterValue;
		//update the category filter
	}else if(filterType === 'price'){
		activeFilter.price = filterValue;
		//update the price filter                      


	}
	filterItems();
	// Re-filters the menu items based on the new settings
	updateFilter(clickedOption);
	// Updates the UI to show which filters are active
}

//10.
function updateFilter(activeLink){
	if (activeLink.dataset.category === 'all'){
		navLinks.forEach(link =>{
			link.classList.remove('active-filter')
		});
	}else{
	navLinks.forEach(link =>{
		link.classList.remove('active-filter');
	
	});
	activeLink.classList.add('active-filter');
	}

}

//4## PRICE RANGE FILTERING LOGIC ----------------------------------------------------------
function filterByPrice(item, priceRange){
	const itemPrice = parseFloat(item.dataset.itemPrice);
	//Gets the item's price as a number
	console.log("Filtering item with price:", itemPrice, "against range:", priceRange);
	// logs information for debugging

	switch(priceRange){
		case 'under-5':
            return (itemPrice >= 0 && itemPrice <= 5);
			//return true if price 5 or less
        case '5-10':
            return (itemPrice > 5 && itemPrice <= 10);
			//return true if price between 5 or 10
        case '10-15':
            return (itemPrice > 10 && itemPrice <= 15);
			//return true if price between 10 or 15
		case '15+':
			return (itemPrice >15 );
			//returns true if price is above 15

        default:
            return true; 
			//if the filter is invlaid, show the item
	}
}

function filterFunction(){
	
	document.getElementById("filterDropdown").style.display = document.getElementById("filterDropdown").style.display === "none" ? "block" : "none" ;
}	
//6.CLOSING THE CART
if (closeCart) {
    closeCart.addEventListener('click', () => {
        cartPopup.style.display = 'none';
		// hides the cart popup when the close button is clicked
    });
}



