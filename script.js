// ============================================
// VELORA INVOICE GENERATOR
// ============================================


// ================================
// ELEMENTS
// ================================

const itemsBody = document.getElementById("itemsBody");

const subtotalElement =
    document.getElementById("subtotal");

const discountElement =
    document.getElementById("discount");

const discountAmountElement =
    document.getElementById("discountAmount");

const taxElement =
    document.getElementById("tax");

const taxAmountElement =
    document.getElementById("taxAmount");

const grandTotalElement =
    document.getElementById("grandTotal");


// ================================
// FORMAT MONEY
// ================================

function formatMoney(number) {

    return new Intl.NumberFormat("uz-UZ").format(
        Math.round(number)
    ) + " so‘m";

}


// ================================
// CURRENT DATE
// ================================

function setDates() {

    const today = new Date();

    const year = today.getFullYear();

    const month =
        String(today.getMonth() + 1).padStart(2, "0");

    const day =
        String(today.getDate()).padStart(2, "0");

    const currentDate =
        `${year}-${month}-${day}`;

    document.getElementById("invoiceDate").value =
        currentDate;


    // Due date = 7 days later

    const due = new Date(today);

    due.setDate(
        due.getDate() + 7
    );

    const dueYear =
        due.getFullYear();

    const dueMonth =
        String(due.getMonth() + 1)
            .padStart(2, "0");

    const dueDay =
        String(due.getDate())
            .padStart(2, "0");

    document.getElementById("dueDate").value =
        `${dueYear}-${dueMonth}-${dueDay}`;
}


// ================================
// INVOICE NUMBER
// ================================

function generateInvoiceNumber() {

    const year =
        new Date().getFullYear();

    const randomNumber =
        Math.floor(
            100 + Math.random() * 900
        );

    document.getElementById("invoiceNumber").value =
        `VEL-${year}-${randomNumber}`;
}


// ================================
// ADD ITEM
// ================================

function addItem(
    name = "",
    quantity = 1,
    price = 0
) {

    const row =
        document.createElement("tr");


    row.innerHTML = `

        <td class="row-number"></td>

        <td>
            <input
                type="text"
                class="item-input"
                placeholder="Mahsulot yoki xizmat"
                value="${name}"
                oninput="calculateTotal()"
            >
        </td>

        <td>
            <input
                type="number"
                class="qty-input"
                min="1"
                value="${quantity}"
                oninput="calculateTotal()"
            >
        </td>

        <td>
            <input
                type="number"
                class="price-input"
                min="0"
                value="${price}"
                oninput="calculateTotal()"
            >
        </td>

        <td class="line-total">
            0 so‘m
        </td>

        <td>
            <button
                class="delete-item"
                onclick="deleteItem(this)"
            >
                ×
            </button>
        </td>

    `;


    itemsBody.appendChild(row);

    updateRowNumbers();

    calculateTotal();
}


// ================================
// DELETE ITEM
// ================================

function deleteItem(button) {

    const row =
        button.closest("tr");

    row.remove();

    updateRowNumbers();

    calculateTotal();
}


// ================================
// ROW NUMBERS
// ================================

function updateRowNumbers() {

    const rows =
        document.querySelectorAll(
            "#itemsBody tr"
        );

    rows.forEach(
        (row, index) => {

            const number =
                row.querySelector(".row-number");

            number.textContent =
                index + 1;

        }
    );
}


// ================================
// CALCULATE TOTAL
// ================================

function calculateTotal() {

    const rows =
        document.querySelectorAll(
            "#itemsBody tr"
        );


    let subtotal = 0;


    rows.forEach(row => {

        const quantity =
            parseFloat(
                row.querySelector(".qty-input").value
            ) || 0;


        const price =
            parseFloat(
                row.querySelector(".price-input").value
            ) || 0;


        const lineTotal =
            quantity * price;


        subtotal += lineTotal;


        row.querySelector(".line-total")
            .textContent =
            formatMoney(lineTotal);

    });


    // DISCOUNT

    const discountPercent =
        parseFloat(discountElement.value) || 0;


    const discountAmount =
        subtotal *
        discountPercent /
        100;


    // AFTER DISCOUNT

    const afterDiscount =
        subtotal - discountAmount;


    // TAX

    const taxPercent =
        parseFloat(taxElement.value) || 0;


    const taxAmount =
        afterDiscount *
        taxPercent /
        100;


    // FINAL

    const grandTotal =
        afterDiscount + taxAmount;


    subtotalElement.textContent =
        formatMoney(subtotal);


    discountAmountElement.textContent =
        formatMoney(discountAmount);


    taxAmountElement.textContent =
        formatMoney(taxAmount);


    grandTotalElement.textContent =
        formatMoney(grandTotal);
}


// ================================
// CLEAR INVOICE
// ================================

function clearInvoice() {

    const answer =
        confirm(
            "Invoice ma'lumotlarini tozalashni xohlaysizmi?"
        );


    if (!answer) {
        return;
    }


    // Client

    document.getElementById("clientName").value = "";

    document.getElementById("clientAddress").value = "";

    document.getElementById("clientPhone").value = "";

    document.getElementById("clientEmail").value = "";


    // Notes

    document.getElementById("notes").value = "";


    // Discount / tax

    discountElement.value = 0;

    taxElement.value = 0;


    // Items

    itemsBody.innerHTML = "";


    // New invoice number

    generateInvoiceNumber();


    // Dates

    setDates();


    // Add empty row

    addItem();


    calculateTotal();


    showNotification(
        "Invoice tozalandi!"
    );
}


// ================================
// PRINT
// ================================

function printInvoice() {

    calculateTotal();

    window.print();

}


// ================================
// NOTIFICATION
// ================================

function showNotification(
    message = "Invoice muvaffaqiyatli yangilandi!"
) {

    const notification =
        document.getElementById(
            "notification"
        );


    notification.innerHTML = `
        <span>✓</span>
        ${message}
    `;


    notification.classList.add("show");


    setTimeout(() => {

        notification.classList.remove(
            "show"
        );

    }, 2500);
}


// ================================
// INITIAL DATA
// ================================

function initialize() {

    setDates();

    generateInvoiceNumber();


    // Example products

    addItem(
        "Web sayt dizayni",
        1,
        2500000
    );


    addItem(
        "UI/UX Design xizmati",
        2,
        850000
    );


    addItem(
        "Texnik qo‘llab-quvvatlash",
        1,
        500000
    );


    calculateTotal();
}


// ================================
// START
// ================================

initialize();