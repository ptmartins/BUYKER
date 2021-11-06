let DOM = {
        gallery: document.querySelector('.gallery'),
        cartTotalItems: document.querySelector('.cart-header-items'),
        cartList: document.querySelector('.cart-list'),
        cartTotal: document.querySelector('.cart-total')
    },
    cart = [],
    totalUnits = 0,

    renderGallery = () => {

        let _data = null;

        fetch('../data.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                DOM.gallery.appendChild(renderGalleryItem(item));
            })
        });
    },

    renderGalleryItem = (item) => {
        let galleryItem = document.createElement('DIV'),
            thumbnail = document.createElement('DIV'),
            btnAdd = document.createElement('BUTTON'),
            btnIcon = document.createElement('I'),
            details = document.createElement('DIV'),
            brand = document.createElement('H5'),
            model = document.createElement('H3'),
            price = document.createElement('P'),
            currency = document.createElement('SPAN');
        
            galleryItem.className = 'gallery-item';
            thumbnail.className = 'item-thumbnail';
            btnAdd.className = 'btn--addToCart';
            btnIcon.className = 'fas fa-shopping-cart';
            details.className = 'item-details';
            brand.className = 'item-brand';
            model.className = 'item-model';
            price.className = 'item-price';

            btnAdd.setAttribute('title', 'Add to shopping cart');

            thumbnail.style.backgroundImage = `url(${item.imgSrc})`;
            brand.textContent = item.brand;
            model.textContent = item.model;
            price.textContent = Number(item.price).toFixed(2 );
            currency.textContent = '£';
            btnAdd.appendChild(btnIcon);
            thumbnail.appendChild(btnAdd);
            price.appendChild(currency);
            details.appendChild(brand);
            details.appendChild(model);
            details.appendChild(price);

            galleryItem.appendChild(thumbnail);
            galleryItem.appendChild(details);

            btnAdd.addEventListener('click', addToCart.bind(this, item));

            return galleryItem;
    },

    renderCartItem = (item) => {
        let cartItem = document.createElement('LI'),
            details = document.createElement('DIV'),
            thumb = document.createElement('DIV'),
            title = document.createElement('H4'),
            price = document.createElement('DIV'),
            units = document.createElement('DIV'),
            add = document.createElement('SPAN'),
            unitsNumber = document.createElement('SPAN'),
            remove = document.createElement('SPAN');

            cartItem.className = 'cart-item';
            details.className = 'cart-item-details';
            thumb.className = 'cart-item-thumb';
            title.className = 'cart-item-title';
            price.className = 'cart-item-price';
            units.className = 'cart-item-units';
            remove.className = 'unit-decrease fas fa-minus';
            unitsNumber.className = 'units';
            add.className = 'unit-increase fas fa-plus';

            thumb.style.backgroundImage = `url(${item.imgSrc})`;
            title.textContent = item.model;
            price.textContent = `${item.price} £`;
            unitsNumber.textContent = item.units;

            details.appendChild(thumb);
            details.appendChild(title);

            units.appendChild(remove);
            units.appendChild(unitsNumber);
            units.appendChild(add);

            cartItem.appendChild(details);
            cartItem.appendChild(price);
            cartItem.appendChild(units);

            add.addEventListener('click', addUnits.bind(this, item.id));
            remove.addEventListener('click', removeUnits.bind(this, item.id))
            return cartItem;
    },

    addToCart = (item) => {
        if(!cart.find(el => el.id === item.id)) {
            item.units = 1;
            cart.push(item);
        } else {
            addUnits(item.id);
        }

        updateCartList();
    },

    addUnits = (id) => {
        debugger;
        cart.forEach(item => {
            if(item.id === id && item.units < item.stock) {
                item.units++;
                totalUnits++;
            }
        });

        updateCartList();
    },

    removeUnits = (id) => {
        cart.forEach(item => {
            if(item.id === id && item.units > 0) {
                item.units--;
                totalUnits--;
            }

            if(item.units === 0) {
                removeItemFromCart(id);
            }
        });

        updateCartList();
    },

    clearCart = () => {
        DOM.cartList.innerHTML = DOM.cartTotal.innerHTML = DOM.cartTotalItems.innerHTML = '';
    },

    updateTotalItems = () => {

        let total = 0;

        cart.forEach(item => {
            total += item.units;
        });

        DOM.cartTotalItems.textContent = total;
    },

    updateTotalPrice = () => {

        total = 0;

        cart.forEach(item => {
            total += item.units * item.price;
        })

        DOM.cartTotal.textContent = `Total: £ ${total.toFixed(2)}`;
    },

    updateCartList = () => {
        clearCart();
        cart.forEach(item => {
            DOM.cartList.appendChild(renderCartItem(item));
        });

        updateTotalItems();
        updateTotalPrice();

    },

    removeItemFromCart = (id) => {
        cart.forEach((item, index) => {
            if(item.id === id) {
                cart.splice(index, 1);
            }
        })
    }

    init = () => {
        renderGallery();
    };

    init();
    