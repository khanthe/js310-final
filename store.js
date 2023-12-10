(function(){

    const base_asset_url = 'assets/img/'
    const products = new Array();
    const productSlider = document.getElementById('product-slider');
    const colorOptions = document.getElementById('colors');
    const sizeOptions = document.getElementById('size');
    const slideshowBtn = document.getElementById('slideshowBtn');
    const addToCartBtn = document.getElementById('add-cart');
    const ordersCart = document.getElementById('orders-cart');
    const productDetails = document.getElementById('product-details');

    const activeProduct = {
        setActiveProduct: (productId) => {
            localStorage.setItem("activeProduct", productId);
        },
        getActiveProduct: () => {
            return localStorage.getItem('activeProduct');
        }
    }

    const shoppingCart = {
        cartItems: [],
        setCart: () => {
            localStorage.setItem('storedCart', JSON.stringify(shoppingCart.cartItems));
        },
        getCart: () => {
            if (localStorage.getItem('storedCart') === null) {
                return [];
            } else {
                return JSON.parse(localStorage.getItem('storedCart'));
            }
            
        },
        addToCart: () => {
            shoppingCart.cartItems = shoppingCart.getCart();
            if (typeof productDetails.dataset.selectedSize === 'undefined')  {
                alert('Please select a size');
                return false;
            }
            shoppingCart.cartItems.push({
                productId: activeProduct.getActiveProduct(),
                size: productDetails.dataset.selectedSize,
                colorId: productDetails.dataset.selectedColor
            });
            shoppingCart.setCart();
            let successMsg = document.createElement('p');
            addToCartBtn.classList.add('hide');
            successMsg.innerText = "Added to cart!";
            productDetails.insertBefore(successMsg, addToCartBtn);
            let messageRemoval = setTimeout(
                ()=>{
                    successMsg.remove();
                    addToCartBtn.classList.remove('hide');
                },
                1500
            );
        },
        removeFromCart: (item) => {
            shoppingCart.cartItems = shoppingCart.getCart();
            shoppingCart.cartItems.splice(item, 1);
            shoppingCart.setCart();
        },
        displayCart: () => {
            shoppingCart.cartItems = shoppingCart.getCart();
            let overlayContent = document.querySelector('.overlay-content');
            let overlayTitle = document.createElement('div');
            overlayTitle.innerHTML = '<h2 class="cart-title">Your Shopping Cart</h2>';
            overlayContent.appendChild(overlayTitle);
            if (shoppingCart.cartItems.length > 0) {
                shoppingCart.cartItems.forEach((item, index) => {
                    let cartItem = document.createElement('div');
                    cartItem.classList.add('cart-item');
                    cartItem.dataset.cartNumber = index;
                    cartItem.innerHTML = `
                    <img src="${products[item.productId].details.colors[item.colorId].color_img}" />
                    <span class="item-detail product-name"><strong>Name: </strong>${products[item.productId].details.product_name}</span>
                    <span class="item-detail product-price"><strong>Price: </strong>$${products[item.productId].details.price}</span>
                    <span class="item-detail product-color-name"><strong>Color: </strong>${products[item.productId].details.colors[item.colorId].color_name}</span>
                    <span class="item-detail product-size"><strong>Size: </strong>${products[item.productId].details.sizes[item.size]}</span>
                    `; 
                    let removeLink = document.createElement('a');
                    removeLink.classList.add('remove');
                    removeLink.innerText = 'Remove from cart';
                    removeLink.dataset.cartItemNum = item;
                    cartItem.appendChild(removeLink);
                    overlayContent.appendChild(cartItem);
                    removeLink.addEventListener('click', (e) => {
                        let clickedOption = e.target.getAttribute("cart-item-num");
                        shoppingCart.removeFromCart(clickedOption);
                        e.target.closest('.cart-item').remove();
                    });
                });
                let orderNowBtn = document.createElement('button');
                orderNowBtn.innerText = 'Order Now';
                orderNowBtn.classList.add('centered');
                overlayContent.appendChild(orderNowBtn);
                orderNowBtn.addEventListener('click', (e) => {
                    let overlayContainer = document.querySelector('.overlay-container');
                    overlayContainer.remove();
                    createOverlay('orderForm');
                })
            } else {
                let message = document.createElement('p');
                message.innerText = 'There are no items in your cart. Browse the store to find clothing thats fit for you!';
                overlayContent.appendChild(message);
            }
        }
    }

    const ordersLog = {
        orders: [],
        setOrders: () => {
            localStorage.setItem('ordersLog', JSON.stringify(ordersLog.orders));
        },
        getOrders: () => {
            if (localStorage.getItem('ordersLog') === null) {
                ordersLog.orders = [];
            } else {
                ordersLog.orders = JSON.parse(localStorage.getItem('ordersLog'));
            }
        },
        submitOrder: () => {

            ordersLog.getOrders();
            let order = {
                date: new Date(),
                orderItems: shoppingCart.cartItems,
                formData: {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    address: document.getElementById('address').value,
                    city: document.getElementById('city').value,
                    state: document.getElementById('state').value,
                    zip: document.getElementById('zip').value
                }
            }
            ordersLog.orders.push(order);
            ordersLog.setOrders();
            shoppingCart.cartItems = [];
            shoppingCart.setCart();
        },
        displayOrders: () => {
            let overlayContent = document.querySelector('.overlay-content');
            ordersLog.getOrders();
            if (ordersLog.orders.length >= 1) {
                let ordersList = document.createElement('div');
                ordersList.classList.add('orders-list');
                ordersList.innerHTML = '<h2 class="cart-title">Your Orders</h2>';

                for (let i = 0; i < ordersLog.orders.length; i++) {
                    let orderListItem = document.createElement('div');
                    orderListItem.classList.add('order-list-item');
                    orderListItem.innerHTML = `
                    <h3>Order #${i+1}</h3>
                    <span><strong>Date of order:</strong> ${Date(ordersLog.orders[i].date).toString()}</span>
                    <span><strong>Number of items:</strong> ${ordersLog.orders[i].orderItems.length}</span>`
                    let details = document.createElement('div');
                    details.classList.add('more-details');

                    let orderItems = document.createElement('ol');
                    ordersLog.orders[i].orderItems.forEach((item) => {
                        let orderItem = document.createElement('li');
                        orderItem.classList.add('order-item');
                        orderItem.innerHTML = `
                        <strong>${products[item.productId].details.product_name}</strong>
                        <ul>
                        <li>Price: $${products[item.productId].details.price}</li>
                        <li>Color: ${products[item.productId].details.colors[item.colorId].color_name}</li>
                        <li>Size: ${products[item.productId].details.sizes[item.size]}</li>
                        </ul>
                        `; 
                        orderItems.appendChild(orderItem);
                    });
                    orderListItem.appendChild(orderItems);

                    let shippingDetails = document.createElement('div');
                    shippingDetails.classList.add('shipping-details');
                    shippingDetails.innerHTML = `
                    <span><strong>Shipping details:</strong></span>
                    <span>${ordersLog.orders[i].formData.name}</span>
                    <span>${ordersLog.orders[i].formData.address}</span>
                    <span>${ordersLog.orders[i].formData.city}, ${ordersLog.orders[i].formData.state} ${ordersLog.orders[i].formData.zip}</span>
                    <span>Email: ${ordersLog.orders[i].formData.email}</span>
                    <span>Phone: ${ordersLog.orders[i].formData.phone}</span>
                    `
                    orderListItem.appendChild(shippingDetails);

                    ordersList.appendChild(orderListItem);
                }
                overlayContent.appendChild(ordersList);
            } else {
                let noOrders = document.createElement('div');
                noOrders.innerHTML = `<p>You don't have any orders</p>`;
                overlayContent.appendChild(noOrders);
            }

        },
        displayOrder: () => {
            console.log('displaying specific order...')
        },
        validateInput: {
            validLength: (input, min) => {
                if (input.value.trim().length > min) {
                    return true;
                } else {
                    return false;
                }
            },
            validEmail:(emailInput) => {
                const myRegex = /\w+@\w+\.\w+/;
                if (myRegex.test(emailInput.value.trim())) {
                    return true;
                } else {
                    return false;
                }
            },
            validPhone:(phoneInput) => {
                const myRegex = /^(\(\d{3}\)|\d{3})[-\s]?\d{3}[-\s]?\d{4}$/;
                if (myRegex.test(phoneInput.value.trim())) {
                    return true;
                } else {
                    return false;
                }
            },
            validState:(stateInput) => {
                const myRegex = /^[a-zA-Z]{2}$/;
                if (myRegex.test(stateInput.value.trim())) {
                    return true;
                } else {
                    return false;
                }
            },
            validZip:(zipInput) => {
                const myRegex = /^\d{5}$/;
                if (myRegex.test(zipInput.value.trim())) {
                    return true;
                } else {
                    return false;
                }
            },
            validator: () => {
                let checks = [];
                const name = document.getElementById('name');
                const email = document.getElementById('email');
                const phone = document.getElementById('phone');
                const address = document.getElementById('address');
                const city = document.getElementById('city');
                const state = document.getElementById('state');
                const zip = document.getElementById('zip');

                if (ordersLog.validateInput.validLength(name, 3) === false) {
                    name.closest('p').classList.add('exception');
                    checks.push(false);
                } else {
                    name.closest('p').classList.remove('exception');
                    checks.push(true);
                }

                if (ordersLog.validateInput.validEmail(email) === false) {
                    email.closest('p').classList.add('exception');
                    checks.push(false);
                } else {
                    email.closest('p').classList.remove('exception');
                    checks.push(true);
                }

                if (ordersLog.validateInput.validPhone(phone) === false) {
                    phone.closest('p').classList.add('exception');
                    checks.push(false);
                } else {
                    phone.closest('p').classList.remove('exception');
                    checks.push(true);
                }

                if (ordersLog.validateInput.validLength(address, 5) === false) {
                    address.closest('p').classList.add('exception');
                    checks.push(false);
                } else {
                    address.closest('p').classList.remove('exception');
                    checks.push(true);
                }

                if (ordersLog.validateInput.validLength(city, 2) === false) {
                    city.closest('p').classList.add('exception');
                    checks.push(false);
                } else {
                    city.closest('p').classList.remove('exception');
                    checks.push(true);
                }

                if (ordersLog.validateInput.validState(state) === false) {
                    state.closest('p').classList.add('exception');
                    checks.push(false);
                } else {
                    state.closest('p').classList.remove('exception');
                    checks.push(true);
                }

                if (ordersLog.validateInput.validZip(zip) === false) {
                    zip.closest('p').classList.add('exception');
                    checks.push(false);
                } else {
                    zip.closest('p').classList.remove('exception');
                    checks.push(true);
                }

                return checks.every(val => val === true);
            }
        },
        orderForm: () => {
            let overlayContent = document.querySelector('.overlay-content');
            let orderFormWrap = document.createElement('div');
            orderFormWrap.classList.add("order-form-wrap");
            let overlayTitleInstructions = document.createElement('div');
            overlayTitleInstructions.innerHTML = '<h2 class="order-form-title">Complete Your Order</h2><p>Please fill out the following details and click the submit button to complete your order.';
            orderFormWrap.appendChild(overlayTitleInstructions);
            let formFields = document.createElement('div');
            formFields.innerHTML = `
            <form id="orderForm">
            <p class="field"><label for="name">Name:</label><input type="text" id="name" name="name" size="30" /><span class="error-message">Name must be at least 3 characters long.</span></p>
            <p class="field"><label for="email">Email:</label><input type="text" id="email" name="email" size="30" /><span class="error-message">Not a valid email format.</span></p>
            <p class="field"><label for="phone">Phone Number:</label><input type="text" id="phone" name="phone" size="20" /><span class="error-message">Not a valid phone number.</span></p>
            <p class="field"><label for="address">Address:</label><input type="text" id="address" name="address" size="40" /><span class="error-message">Address must be at least 10 characters long.</span></p>
            <p class="field"><label for="city">City:</label><input type="text" id="city" name="city" size="20" /><span class="error-message">City name must be at least 2 characters long.</span></p>
            <p class="field"><label for="state">State: <small>(two letter code)</small></label><input type="text" id="state" name="state"  size="5" /><span class="error-message">Please use a two-character state code.</span></p>
            <p class="field"><label for="zip">Zip Code:</label><input type="number" id="zip" name="zip" size="10" /><span class="error-message">Zip code must be 5 numbers long.</span></p>
            </form>
            `
            orderFormWrap.appendChild(formFields);
            overlayContent.appendChild(orderFormWrap);
            let orderSummary = document.createElement('div');
            orderSummary.innerHTML = '<h3>Order Summary</h3>--------------------';
            
            if (shoppingCart.cartItems.length > 0) {
                let orderItems = document.createElement('ol');
                shoppingCart.cartItems.forEach((item, index) => {
                    let orderItem = document.createElement('li');
                    orderItem.classList.add('order-item');
                    orderItem.innerHTML = `
                    <strong>Name: ${products[item.productId].details.product_name}</strong>
                    <ul>
                    <li>Price: $${products[item.productId].details.price}</li>
                    <li>Color: ${products[item.productId].details.colors[item.colorId].color_name}</li>
                    <li>Size: ${products[item.productId].details.sizes[item.size]}</li>
                    </ul>
                    `; 
                    orderItems.appendChild(orderItem);
                });
                orderSummary.appendChild(orderItems);
                let submitOrder = document.createElement('button');
                submitOrder.id = 'submitBtn';
                submitOrder.innerText = ('Submit Order');
                orderSummary.appendChild(submitOrder);
                submitOrder.addEventListener('click', (e)   => {
                    let validateForm = ordersLog.validateInput.validator();
                    if (validateForm) {
                        ordersLog.submitOrder();
                        orderFormWrap.innerHTML = `<p><em>Your order has been submitted. Thank you for shopping at Nick's Clothing Emporium</em></p>`
                        let errMsgToRemove = document.querySelector('.errors-message');
                        errMsgToRemove.remove();
                    } else {
                        overlayContent.classList.add('errors');
                        let errMsgCheck = document.getElementsByClassName('errors-message');
                        if (errMsgCheck.length < 1) {
                            let errMsg = document.createElement('div');
                            errMsg.innerText = 'Please fix the errors above.';
                            errMsg.classList.add('errors-message');
                            overlayContent.appendChild(errMsg);
                        }
                    }
                })
            }
            orderFormWrap.appendChild(orderSummary);
        }
    }

    const populateSlider = () => {

        for (let y = 0; y < products.length; y++) {
            let sliderOption = document.createElement('span');
            sliderOption.className = 'option';
            sliderOption.dataset.productId = y;
            let image = document.createElement('img');
            image.src = products[y].details.colors[0].color_img;
            image.alt = products[y].details.product_name;
            sliderOption.appendChild(image);
            productSlider.appendChild(sliderOption);
        }

        // sets first product active and stores it in local storage
        //products[0].display(0);

    }
    
    const createOverlay = (overlay) => {
        let overlayContainer = document.createElement('div');
        overlayContainer.classList.add('overlay-container');
        let overlayContent = document.createElement('div');
        overlayContent.classList.add('overlay-content');
        let closeBtn = document.createElement('button');
        closeBtn.innerText = "Close";
        closeBtn.classList.add('right');
        overlayContent.appendChild(closeBtn);
        overlayContainer.appendChild(overlayContent);
        document.body.insertBefore(overlayContainer, document.body.querySelector('main'));
        populateOverlay(overlay);
        closeBtn.addEventListener('click', () => {
            overlayContainer.remove();
        });
    }

    const populateOverlay = (overlay, order) => {
        if (overlay === 'cart') {
            shoppingCart.displayCart();
        } else if (overlay === 'orders') {
            ordersLog.displayOrders();
        } else if (overlay === 'orderForm') {
            ordersLog.orderForm(); 
        } else if (overlay === 'order') {
            ordersLog.displayOrder(order);
        }
    }


   class Product {
        constructor(details) {
            this.details = details;
            products.push(this);
        }

        display(productId) {
            document.getElementById('default-message').classList.add('hide');
            document.getElementById('product-wrap').classList.remove('hide');
            console.log(`Showing product ${this.details.product_name}`);
            document.querySelector('#product-image img').src = this.details.colors[0].color_img;
            document.querySelector('#product-details #name .data').innerText = this.details.product_name;
            document.querySelector('#product-details #description .data').innerText = this.details.product_desc;
            document.querySelector('#product-details #price .data').innerText = this.details.price;
            document.querySelector('#product-details #upc .data').innerText = this.details.UPC;

            productDetails.dataset.selectedColor = 0;
            delete productDetails.dataset.selectedSize;

            let colorsWrap = document.querySelector('#product-details #colors .data');
            colorsWrap.innerHTML = '';

            for (let i = 0; i < this.details.colors.length; i++) {
                let swatch = document.createElement('span');
                swatch.className = 'swatch';
                swatch.title = this.details.colors[i].color_name;
                swatch.style.backgroundColor = this.details.colors[i].swatch; 
                swatch.dataset.colorId = i;
                if (i === 0) {
                    swatch.classList.add('active');
                }
                colorsWrap.appendChild(swatch);
            }

            let sizesWrap = document.querySelector('#product-details #size .data');
            sizesWrap.innerHTML = '';

            for (let i = 0; i < this.details.sizes.length; i++) {
                let size = document.createElement('span');
                size.className = 'size';
                size.innerText = this.details.sizes[i];
                size.dataset.sizeId = i;
                sizesWrap.appendChild(size);
            }

            document.querySelectorAll('#product-slider span.option').forEach((option)=>{
                option.classList.remove('active');
            });

            if(typeof productId !== 'undefined') {
                let product = document.querySelector(`[data-product-id="${productId}"]`);
                product.classList.add('active');
                /*
                localStorage.setItem("activeProduct", productId);
                */
                activeProduct.setActiveProduct(productId);
            }

        }

        changeColor(colorId) {
            document.querySelector('#product-image img').src = this.details.colors[colorId].color_img;
        }

    }

    dress1 = new Product({
        product_name: `Junebaby Midi`,
        product_desc: `An elegant evening dress perfect for a night out. Light, breathing fabric and strap shoulders to keep you comfortable on hot days`,
        price: 192.95,
        UPC: `8675309`,
        colors: [
            {
                color_name: `Flower Pink`,
                color_img: `${base_asset_url}dress-1-flowerpink.png`,
                swatch: `#d64dbc`
            },
            {
                color_name: `Ruby Red`,
                color_img: `${base_asset_url}dress-1-rubyred.png`,
                swatch: `#ff3131`
            }

        ],
        sizes: [
            'XS',
            'S',
            'M',
            'L'
        ],
    });

    dress2 = new Product({
        product_name: `Demi Retro`,
        product_desc: `A casual dress for any occasion. Impress your peers with the simple elegance of this dresses shape, tone and appeal.`,
        price: 89.55,
        UPC: `78572582`,
        colors: [
            {
                color_name: `Cucumber`,
                color_img: `${base_asset_url}dress-2-cucumber.png`,
                swatch: `#2f5634`
            },
            {
                color_name: `Mustard`,
                color_img: `${base_asset_url}dress-2-mustard.png`,
                swatch: `#eaa711`
            }
        ],
        sizes: [
            'S',
            'M',
            'L'
        ],
    });

    jacket1 = new Product({
        product_name: `Bomber Jacket`,
        product_desc: `Fly the town in style with this cozy bomber jacket. Real leather exterior with a cashmere polyester blend lining to keep you cozy, even at altitude.`,
        price: 299.00,
        UPC: `19391945`,
        colors: [
            {
                color_name: `Aviation Brown`,
                color_img: `${base_asset_url}jacket-1-aviationbrown.png`,
                swatch: `#843f20`
            }
        ],
        sizes: [
            'M',
            'L',
            'XL',
            'XXL'
        ],
    });

    pants1 = new Product({
        product_name: `Classic Blue Jeans`,
        product_desc: `A timeless classic: denim blue jeans. These rustic jeans are laser etched to rough perfection so they look like you've been wearing them for decades.`,
        price: 149.99,
        UPC: `85584124`,
        colors: [
            {
                color_name: `Classic Blue`,
                color_img: `${base_asset_url}pants-1-bluejeans.png`,
                swatch: `#4b82a3`
            }
        ],
        sizes: [
            'XS',
            'S',
            'M',
            'L',
            'XL'
        ],
    });

    pants2 = new Product({
        product_name: `Cordial Slacks`,
        product_desc: `For occasions when you need to level your pants game, choose these cordial slacks. From semi-formal to formal-ish occasions, they fit the bill.`,
        price: 129.99,
        UPC: `784587771`,
        colors: [
            {
                color_name: `Khaki`,
                color_img: `${base_asset_url}pants-2-khaki.png`,
                swatch: `#cebfaa`
            },
            {
                color_name: `Navy`,
                color_img: `${base_asset_url}pants-2-navy.png`,
                swatch: `#2d3550`
            }
        ],
        sizes: [
            'S',
            'L',
            'XL'
        ],
    });

    pants3 = new Product({
        product_name: `Short Shorts`,
        product_desc: `Are you tired of it being hot outside so you're not sure what to wear? Short shorts are the answer. Who wears short shorts? You do!`,
        price: 19.95,
        UPC: `79847125`,
        colors: [
            {
                color_name: `Azul`,
                color_img: `${base_asset_url}pants-3-azul.png`,
                swatch: `#59c2fc`
            },
            {
                color_name: `Marron`,
                color_img: `${base_asset_url}pants-3-marron.png`,
                swatch: `#998368`
            },
            {
                color_name: `Verde`,
                color_img: `${base_asset_url}pants-3-verde.png`,
                swatch: `#92c486`
            }
        ],
        sizes: [
            'S',
            'M',
            'XXL'
        ],
    });

    shirt1 = new Product({
        product_name: `Simple Tee`,
        product_desc: `There's not much more to say about this shirt other than it's a simple T-Shirt. Perfect for when you want things simple -- most days.`,
        price: 9.03,
        UPC: `67845875`,
        colors: [
            {
                color_name: `Forest`,
                color_img: `${base_asset_url}shirt-1-forest.png`,
                swatch: `#95b287`
            },
            {
                color_name: `Red`,
                color_img: `${base_asset_url}shirt-1-red.png`,
                swatch: `#c86464`
            },
            {
                color_name: `Teal`,
                color_img: `${base_asset_url}shirt-1-teal.png`,
                swatch: `#afd6e0`
            }
        ],
        sizes: [
            'XS',
            'S',
            'M',
            'L',
            'XL',
            'XXL'
        ],
    });

    shirt2 = new Product({
        product_name: `Vee Tee`,
        product_desc: `Want to add a touch of flare to your simple T-Shirt days? Do it with V neck. Vee Tee will make you feel a smidge above average.`,
        price: 10.52,
        UPC: `003975125`,
        colors: [
            {
                color_name: `Aqua`,
                color_img: `${base_asset_url}shirt-2-aqua.png`,
                swatch: `#59c2fc`
            },
            {
                color_name: `Purple`,
                color_img: `${base_asset_url}shirt-2-purple.png`,
                swatch: `#bf97c4`
            },
            {
                color_name: `Sand`,
                color_img: `${base_asset_url}shirt-2-sand.png`,
                swatch: `#c4c158`
            }
        ],
        sizes: [
            'XS',
            'S',
            'M',
            'L',
            'XXL'
        ],
    });

    shirt3 = new Product({
        product_name: `The Sweater`,
        product_desc: `You know that friend that always wears the same sweater all winter long. Like every day. And all of their friends call it "the sweater"? Be that friend.`,
        price: 39.19,
        UPC: `10032005`,
        colors: [
            {
                color_name: `Savanna`,
                color_img: `${base_asset_url}shirt-3-savanna.png`,
                swatch: `#d7c99a`
            },
            {
                color_name: `Grass`,
                color_img: `${base_asset_url}shirt-3-grass.png`,
                swatch: `#b8e8aa`
            },
            {
                color_name: `Stone`,
                color_img: `${base_asset_url}shirt-3-stone.png`,
                swatch: `#8c9ac1`
            }
        ],
        sizes: [
            'M'
        ],
    });

    shirt4 = new Product({
        product_name: `Button Up, Down, All 'round`,
        product_desc: `When you add a button to a shirt, it instantly becomes nicer. We took that concept and dialed it up to 11. That's right, 11 buttons. Bet you can't find the last two!`,
        price: 11.11,
        UPC: `11011011011`,
        colors: [
            {
                color_name: `Nickelodeon`,
                color_img: `${base_asset_url}shirt-4-nickelodeon.png`,
                swatch: `#ff27b7`
            },
            {
                color_name: `Lavender`,
                color_img: `${base_asset_url}shirt-4-lavender.png`,
                swatch: `#ac86bf`
            },
            {
                color_name: `Sage`,
                color_img: `${base_asset_url}shirt-4-sage.png`,
                swatch: `#69c261`
            },
            {
                color_name: `Burnt Umber`,
                color_img: `${base_asset_url}shirt-4-sunset.png`,
                swatch: `#d67f39`
            }
        ],
        sizes: [
            'S',
            'M',
            'L'
        ],
    });

    vest1 = new Product({
        product_name: `Fisherman's Vest`,
        product_desc: `You don't have to go fishing when you're wearing this vest. But you'll want to. And you should. Think of all the gear you could store in the pockets? With room left over for a candy bar. Mmmmm, candy.`,
        price: 123.45,
        UPC: `5551234`,
        colors: [
            {
                color_name: `Tan`,
                color_img: `${base_asset_url}vest-1-fisherman.png`,
                swatch: `#c1a078`
            }
        ],
        sizes: [
            'M',
            'L'
        ],
    });
      
    productSlider.addEventListener('click', (e) => {
        let clickedOption = e.target.closest('span');
        if (clickedOption) {
            let clickedOptionId = e.target.closest('span').dataset.productId;
            products[clickedOptionId].display(clickedOptionId);
        }
    });

    colorOptions.addEventListener('click', (e) => {
        let clickedOption = e.target.getAttribute("data-color-id");
        if (clickedOption !== null) {
            // activeProduct = localStorage.getItem('activeProduct');
            products[activeProduct.getActiveProduct()].changeColor(clickedOption);
            document.querySelectorAll('.swatch').forEach((option)=>{
                option.classList.remove('active');
            });
            e.target.classList.add('active');
            productDetails.dataset.selectedColor = clickedOption;
        }
    });

    sizeOptions.addEventListener('click', (e) => {
        let clickedOption = e.target.getAttribute("data-size-id");
        if (clickedOption !== null) {
            document.querySelectorAll('.size').forEach((option)=>{
                option.classList.remove('active');
            });
            e.target.classList.add('active');
            productDetails.dataset.selectedSize = clickedOption;
        }
    });

    slideshowBtn.addEventListener('click', (e) => {
        slideshowBtn.classList.toggle('active');
        if (typeof productScroll !== 'undefined' && productScroll !== 'off') {
            clearInterval(productScroll);
            slideshowBtn.innerHTML = "Start Slideshow &#8227;";
            productScroll = 'off';
        } else {
            let startingPoint = document.querySelector('#product-slider span.option.active') ? document.querySelector('#product-slider span.option.active').dataset.productId : 0;
            productScroll = setInterval(() => {
                if (startingPoint < products.length - 1) {
                    startingPoint++;
                    products[startingPoint].display(startingPoint);
                } else {
                    startingPoint = 0;
                    products[startingPoint].display(startingPoint);
                }
                
            }, 3000 );
            slideshowBtn.innerHTML = "Stop Slideshow &#9744;";
        }
    });

    ordersCart.addEventListener('click', (e) => {
        if (e.target.tagName.toLowerCase() === 'button') {
            const overlay = e.target.id;
            createOverlay(overlay);
        }
    });

    addToCartBtn.addEventListener('click', (e) => {
        shoppingCart.addToCart();
    })

    populateSlider();

})();