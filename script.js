
var toggleOpen = document.getElementById('toggleOpen');
var toggleClose = document.getElementById('toggleClose');
var collapseMenu = document.getElementById('collapseMenu');

function handleClick() {
    if (collapseMenu.style.display === 'block') {
        collapseMenu.style.display = 'none';
    } else {
        collapseMenu.style.display = 'block';
    }
}

toggleOpen.addEventListener('click', handleClick);
toggleClose.addEventListener('click', handleClick);

let allProducts = [];

let carts = document.getElementById('carts')

const Api = 'https://dummyjson.com/products'
function getData() {
    fetch(Api)
        .then(res => res.json())
        .then(data => {
            allProducts = data.products;
            carts.innerHTML = ''

            data.products.forEach(item => {
                carts.innerHTML +=`
                    <div class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col overflow-hidden">
                        <div class="h-56 p-4 bg-gray-100 flex items-center justify-center relative">
                            <img src="${item.thumbnail}" alt="${item.title}" class="h-full object-contain mix-blend-multiply">
                        </div>

                        <div class="p-5 flex flex-col flex-grow">
                            <h3 class="text-lg font-bold text-gray-800 mb-1">${item.title}</h3>
                            <p class="text-xs text-gray-500 mb-3">${item.brand}</p>

                            <div class="flex items-center gap-3 mb-2">

                                <span id="card-price-${item.id}" data-price="${item.price}" class="text-xl font-bold text-green-600">
                                    $${item.price}
                                </span>

                                <span class="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded">
                                    -${item.discountPercentage}% OFF
                                </span>
                            </div>

                            <p class="text-sm text-gray-600 mb-4 line-clamp-3">${item.description}</p>

                            <div class="flex text-yellow-400 text-sm mb-4">
                                ★${item.rating} <span class="text-gray-400 ml-2 text-xs">(4.69)</span>
                            </div>

                            <div class="mt-auto">
                                <p class="text-xs text-green-600 mb-3 font-medium">In Stock: ${item.stock}</p>

                                <div class="flex gap-2 mb-3">
                                    <button onclick="addToCart(${item.id})"
                                        class="flex-1 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-medium py-2.5 px-4 rounded transition-colors duration-200">
                                        Add to Cart
                                    </button>

                                    <button onclick="addToUrek(${item.id})" class="bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500 p-2.5 rounded border border-gray-200 transition-colors duration-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>
                                </div>

                                <div class="flex items-center justify-between bg-gray-50 rounded-lg border border-gray-200 p-1">

                                    <button onclick="changeQty(${item.id}, -1)" class="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100 text-gray-600 transition cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                                        </svg>
                                    </button>

                                    <input id="qty-${item.id}" type="number" value="1" min="1"
                                        class="w-full text-center bg-transparent outline-none text-gray-800 font-semibold text-sm h-8">

                                        <button onclick="changeQty(${item.id}, 1)" class="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100 text-gray-600 transition cursor-pointer">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                </div>

                            </div>
                        </div>
                    </div>
                    `;
            })
        })
}


// Sayı artırıb azaltmaq üçün funksiya
function changeQty(id, change) {
    const input = document.getElementById(`qty-${id}`);
    let currentValue = parseInt(input.value);
    
    let newValue = currentValue + change;
    if (newValue < 1) newValue = 1;  
    input.value = newValue;
    const priceElement = document.getElementById(`card-price-${id}`);
    const unitPrice = parseFloat(priceElement.getAttribute('data-price'));
    const newTotalPrice = (unitPrice * newValue).toFixed(2);
    priceElement.innerText = '$' + newTotalPrice;
}



// sebet data basladi

let myCart = [];
const cartItemsContainer = document.getElementById('cart-items');

function addToCart(id) {
    const product = allProducts.find(item => item.id === id);
    const existingItem = myCart.find(item => item.id === id);

    const inputElement = document.getElementById(`qty-${id}`);
    const selectedQty = parseInt(inputElement.value);

    if (existingItem) {
        existingItem.quantity += selectedQty;
    } else {
        myCart.push({ ...product, quantity: selectedQty });
    }

    renderCart();
}




// 2. sebeti ekranda gosdermek 
function renderCart() {
    cartItemsContainer.innerHTML = '';
    let totalAmount = 0;
    let totalCount = 0;

    myCart.forEach((item, index) => {
        totalAmount += item.price * item.quantity;
        totalCount += item.quantity;
        cartItemsContainer.innerHTML += `
            <div class="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border mb-2">
                <img src="${item.thumbnail}" class="w-16 h-16 object-cover rounded bg-white">
                    <div class="flex-1">
                        <h4 class="text-sm font-bold text-gray-800 line-clamp-1">${item.title}</h4>
                        <div class="flex justify-between items-center mt-1">
                            <p class="text-sm text-gray-500">$${item.price} x ${item.quantity}</p>
                            <p class="text-sm font-bold text-blue-600">$${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    </div>
                    <button onclick="removeFromCart(${index})" class="text-red-500 hover:bg-red-50 p-1 rounded transition">
                        ✕
                    </button>
            </div>
            `;
    });


    // sebet hissede umumi qiymet basladi
    const totalPriceElement = document.getElementById('total-price');
    if (totalPriceElement) {
        totalPriceElement.innerText = '$' + totalAmount.toFixed(2);
    }
    // sebet hissede umumi qiymet bitdi

    // sebetdeki mehsul sayi basladi 
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.innerText = totalCount;
    }
    // sebetdeki mehsul sayi bitdi
}

//  sebet silme funksiyası basladi
function removeFromCart(index) {
    myCart.splice(index, 1);
    renderCart();
}
// sebet data bitti
getData()


// sebet basladi 
const openBtn = document.getElementById('open-cart-btn'); // Sənin yeni ikonun
const cartSidebar = document.getElementById('cart-sidebar'); // Səbət pəncərəsi
const cartOverlay = document.getElementById('cart-overlay'); // Qara fon
const closeBtn = document.getElementById('close-cart'); // X düyməsi

// sebet iconuna kilik edende acilma
openBtn.addEventListener('click', function () {
    cartSidebar.classList.remove('translate-x-full');
    cartOverlay.classList.remove('hidden');
});

// x yada harasa kilik edende baxglanma funksiyasi
function closeCart() {
    cartSidebar.classList.add('translate-x-full');
    cartOverlay.classList.add('hidden');
}

// X duymesini cilik edende  bağla
if (closeBtn) {
    closeBtn.addEventListener('click', closeCart);
}

//qara fona cilik edende bagla
if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCart);
}
// sebet bitti

// sevimliler basladi 
const open_urek_btn = document.getElementById('open-urek-btn')
const cart_sidebar2 = document.getElementById('cart-sidebar2')
const close_cart2 = document.getElementById('close-cart2')
open_urek_btn.addEventListener('click', function () {
    cart_sidebar2.classList.remove('translate-x-full')
    cartOverlay.classList.remove('hidden');
});

function closeCart2() {
    cart_sidebar2.classList.add('translate-x-full');
    cartOverlay.classList.add('hidden');
}

if (close_cart2) {
    close_cart2.addEventListener('click', closeCart2);
}
if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCart2);
}

let myUrek = [];
const cartItemsContainer2 = document.getElementById('cart-items2');
function addToUrek(id) {
    const product = allProducts.find(item => item.id === id);
    const existingItem = myUrek.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        myUrek.push({ ...product, quantity: 1 });
    }
    renderCart2();
}

function renderCart2() {
    cartItemsContainer2.innerHTML = '';
    let totalAmount = 0;
    let totalCount = 0;

    myUrek.forEach((item, index) => {
        totalAmount += item.price * item.quantity;
        totalCount += item.quantity;
        cartItemsContainer2.innerHTML += `
                        <div class="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border mb-2">
                            <img src="${item.thumbnail}" class="w-16 h-16 object-cover rounded bg-white">
                            <div class="flex-1">
                                <h4 class="text-sm font-bold text-gray-800 line-clamp-1">${item.title}</h4>
                                <div class="flex justify-between items-center mt-1">
                                    <p class="text-sm text-gray-500">$${item.price} x ${item.quantity}</p>
                                    <p class="text-sm font-bold text-blue-600">$${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            </div>
                            <button onclick="removeFromUrek(${index})" class="text-red-500 hover:bg-red-50 p-1 rounded transition">
                                ✕
                            </button>
                        </div>
                    `;
    });

    // sebetdeki mehsul sayi basladi 

    const urekCountElement = document.getElementById('urek-count');
    if (urekCountElement) {
        urekCountElement.innerText = totalCount;
    }
    // sebetdeki mehsul sayi bitdi

}

//  sevimlilerde silmə funksiyası basladi
function removeFromUrek(index) {
    myUrek.splice(index, 1);
    renderCart2();
}
//  sevimlilerde silmə funksiyası bitti

getData()


// sevimliler bitti
