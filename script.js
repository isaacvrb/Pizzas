let modalKey = 0;
let modalQT = 1;
let cart = [];

const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);


pizzaJson.map(function(item, index) {
    let pizzaItem = c('.models .pizza-item').cloneNode(true);
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `Aparti de R$ ${item.price[0].toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();
        modalKey = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQT = 1;
        c('.pizzaBig img').src = item.img;
        c('.pizzaInfo h1').innerHTML = item.name;
        c('.pizzaInfo--desc').innerHTML = item.description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${item.price[2].toFixed(2)}`;
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach(function(size, sizeIndex) {
            if(sizeIndex == 2) {
                size.classList.add('selected')
            };
            size.querySelector('span').innerHTML = item.sizes[sizeIndex];
        });
        
        c('.pizzaInfo--qt').innerHTML = modalQT;
        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200); 
    });
    c('.pizza-area').append(pizzaItem);
});

function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);     
};

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach(function(item){
    item.addEventListener('click', closeModal)
});

cs('.pizzaInfo--size').forEach(function(size, sizeIndex){
    size.addEventListener('click', ()=>{
       c('.pizzaInfo--size.selected').classList.remove('selected');
       size.classList.add('selected');
    });
    size.addEventListener('click', ()=>{
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[modalKey].price[sizeIndex].toFixed(2)}`;
    });
});

c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQT++;
    c('.pizzaInfo--qt').innerHTML = modalQT;
})
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQT > 1){
        modalQT--;
        c('.pizzaInfo--qt').innerHTML = modalQT;
    }
})

c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id+'@'+size;
    let key = cart.findIndex((item)=> item.identifier == identifier);
    if(key > - 1){
        cart[key].qt += modalQT;
    }else{
        cart.push({
            id: pizzaJson[modalKey].id,
            size,
            price: pizzaJson[modalKey].price[size],
            qt: modalQT,
            identifier
        });
    }

    closeModal();
    updateCart();
});

c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0){
        c('aside').style.left = 0;
    }
});

c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
});

function updateCart(){
    c('.menu-openner span').innerHTML = cart.length;
    if(cart.length > 0){
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';
        let subtotal = 0;
        let desconto = 0;
        let total = 0;
        for(let i in cart){
            let pizzaItem = pizzaJson.find(function(item){
                return item.id == cart[i].id
            });
            subtotal += cart[i].price * cart[i].qt
            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P'
                    break;
                case 1:
                    pizzaSizeName = 'M'
                    break;
                case 2:
                    pizzaSizeName = 'G'
                    break;
            }
            let = pizzaName = `${pizzaItem.name} (${pizzaSizeName})`
            let cartItem = c('.models .cart--item').cloneNode(true);
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                }else{
                    cart.splice(i, 1);
                }
                updateCart();
            });
            c('.cart').append(cartItem);
        };
        desconto = subtotal * 0.1;
        total = subtotal - desconto;
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    }else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    } 
};



