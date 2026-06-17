// ========================================================
// THE FOOD DELIVERY PLATFORM DATA STATE CONTROLLER
// ========================================================
const DeliverySystem = {
    STORAGE_KEY: "delivery_platform_records",
    menu: [],
    cart: {},
    orders: [],

    // 1. Initial System Boot Initialization Loop
    init() {
        // Core static baseline food asset matrix classification data
        this.menu = [
            { id: "fd_brg", name: "Crispy Avocado Burger", price: 12.49, desc: "Topped with fresh swiss cheese, toasted artisan bun variations, and spicy mayo." },
            { id: "fd_pza", name: "Truffle Mushroom Pizza", price: 16.99, desc: "Stone-baked white pizza platform infused with fresh mozzarella and wild sage." },
            { id: "fd_tco", name: "Chipotle Shrimp Tacos", price: 10.99, desc: "Three flame-grilled corn tortilla items stacked with signature lime cilantro slaw." },
            { id: "fd_sal", name: "Mediterranean Quinoa Bowl", price: 11.50, desc: "Crisp cucumber mixes tossed with kalamata olives, feta, and lemon herb emulsion." }
        ];

        // Hydrate platform order history from browser cache structures
        this.orders = JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];

        this.syncSystemState();
        this.renderMenuUI();
    },

    // 2. Add Selected Item Into Checkout Cart Structure
    addItemToCart(itemId) {
        const item = this.menu.find(food => food.id === itemId);
        if (!item) return;

        if (this.cart[itemId]) {
            this.cart[itemId].qty += 1;
        } else {
            this.cart[itemId] = {
                name: item.name,
                price: item.price,
                qty: 1
            };
        }

        this.renderCartUI();
    },

    // 3. Process Checkout Order and Refresh Database Variables
    commitCheckout() {
        const itemIds = Object.keys(this.cart);
        if (itemIds.length === 0) return;

        // Compile cart items details string summaries
        const summarizedItemsList = itemIds
            .map(id => `${this.cart[id].name} (x${this.cart[id].qty})`)
            .join(', ');

        const calculatedSubtotal = itemIds.reduce((sum, id) => sum + (this.cart[id].price * this.cart[id].qty), 0);
        const logisticsDeliveryFee = 3.99;
        const compiledGrandTotal = calculatedSubtotal + logisticsDeliveryFee;

        const newOrderRecord = {
            id: "ORD-" + Math.floor(1000 + Math.random() * 9000),
            summary: summarizedItemsList,
            totalCost: compiledGrandTotal,
            status: "Out For Delivery"
        };

        // Mutate system database stacks
        this.orders.unshift(newOrderRecord); // Place newest transactions at the head of the log array
        this.cart = {}; // Wipe active cart structure clean back to empty parameter models

        this.syncSystemState();
        this.renderCartUI();
    },

    syncSystemState() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.orders));
        this.calculateMetrics();
        this.renderLedgerUI();
    },

    // 4. System Analytics Engine Calculations
    calculateMetrics() {
        const totalProcessedCount = this.orders.length;
        const grossSalesRevenue = this.orders.reduce((sum, ord) => sum + ord.totalCost, 0);
        const activeDeliveriesCount = this.orders.filter(ord => ord.status === "Out For Delivery").length;

        // Update presentation scorecard canvas text items
        document.getElementById('totalOrdersCount').textContent = totalProcessedCount;
        document.getElementById('grossRevenueCount').textContent = `$${grossSalesRevenue.toFixed(2)}`;
        document.getElementById('activeDeliveriesCount').textContent = activeDeliveriesCount;
    },

    // 5. Dynamic HTML DOM Parsing: Restaurant Menu Grid Card List
    renderMenuUI() {
        const container = document.getElementById('menuContainer');
        container.innerHTML = "";

        this.menu.forEach(food => {
            const card = document.createElement('div');
            card.className = "menu-card";

            card.innerHTML = `
                <div>
                    <h4>${food.name}</h4>
                    <p>${food.desc}</p>
                </div>
                <div class="menu-meta">
                    <span class="price-tag">$${food.price.toFixed(2)}</span>
                    <button class="btn-add add-btn" data-id="${food.id}">+ Add To Cart</button>
                </div>
            `;
            container.appendChild(card);
        });
    },

    // 6. Dynamic HTML DOM Parsing: Shopping Cart Row Layouts & Cost Aggregators
    renderCartUI() {
        const container = document.getElementById('cartItemsContainer');
        const totalsBlock = document.getElementById('cartTotalsBlock');
        const itemIds = Object.keys(this.cart);

        if (itemIds.length === 0) {
            container.innerHTML = `<p style="text-align:center; color:#64748b; padding: 20px 0;">Your active cart is empty.</p>`;
            totalsBlock.style.display = "none";
            return;
        }

        container.innerHTML = "";
        totalsBlock.style.display = "block";

        let computedSubtotal = 0;

        itemIds.forEach(id => {
            const item = this.cart[id];
            const rowTotalCost = item.price * item.qty;
            computedSubtotal += rowTotalCost;

            const div = document.createElement('div');
            div.className = "cart-item";
            div.innerHTML = `
                <div><strong>${item.name}</strong> <span style="color:#64748b;">x${item.qty}</span></div>
                <div style="font-family:monospace;">$${rowTotalCost.toFixed(2)}</div>
            `;
            container.appendChild(div);
        });

        const deliveryFee = 3.99;
        const totalBill = computedSubtotal + deliveryFee;

        document.getElementById('subtotalVal').textContent = `$${computedSubtotal.toFixed(2)}`;
        document.getElementById('grandTotalVal').textContent = `$${totalBill.toFixed(2)}`;
    },

    // 7. Dynamic HTML DOM Parsing: Dispatched Order Log Matrix
    renderLedgerUI() {
        const container = document.getElementById('ordersLedgerContainer');
        container.innerHTML = "";

        if (this.orders.length === 0) {
            container.innerHTML = `<p style="text-align:center; color:#64748b; padding: 20px 0;">No transactional dispatches active inside current historical database ledger.</p>`;
            return;
        }

        this.orders.forEach(ord => {
            const item = document.createElement('div');
            item.className = "order-item";

            item.innerHTML = `
                <div class="order-header">
                    <span>Code Identifier: ${ord.id}</span>
                    <span style="color:#4ade80;">$${ord.totalCost.toFixed(2)}</span>
                </div>
                <div class="order-details">${ord.summary}</div>
                <span class="status-badge">${ord.status}</span>
            `;
            container.appendChild(item);
        });
    }
};

// ========================================================
// CONTROLLER EVENT HANDLING INTERFACE LOGIC
// ========================================================

// Event Delegation capture block maps menu add clicks down to state objects
document.getElementById('menuContainer').addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('add-btn')) {
        const selectedFoodId = target.getAttribute('data-id');
        DeliverySystem.addItemToCart(selectedFoodId);
    }
});

// Hook transaction commit action triggers to checkout buttons
document.getElementById('checkoutBtn').addEventListener('click', () => {
    DeliverySystem.commitCheckout();
});

// Boot central execution processes when HTML documents finish compilation layouts
document.addEventListener('DOMContentLoaded', () => {
    DeliverySystem.init();
});