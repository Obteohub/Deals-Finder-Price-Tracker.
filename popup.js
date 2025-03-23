document.addEventListener("DOMContentLoaded", function () {
    const dealsContainer = document.getElementById("deals-container");
    const trackBtn = document.getElementById("track-btn");
    const productUrlInput = document.getElementById("product-url");
    const trackedProductsDiv = document.getElementById("tracked-products");

    // Fetch best deals from Shopwice
    async function fetchDeals() {
        try {
            let response = await fetch("https://shopwice.com/api/deals");
            let deals = await response.json();
            dealsContainer.innerHTML = deals.map(deal => `
                <div>
                    <a href="${deal.url}" target="_blank">${deal.name} - ${deal.price}</a>
                </div>
            `).join("");
        } catch (error) {
            dealsContainer.innerHTML = "Failed to load deals.";
        }
    }

    // Track product price
    trackBtn.addEventListener("click", () => {
        let productUrl = productUrlInput.value.trim();
        if (productUrl) {
            chrome.storage.local.get({ tracked: [] }, (data) => {
                let tracked = data.tracked;
                tracked.push({ url: productUrl, price: null });
                chrome.storage.local.set({ tracked });
                loadTrackedProducts();
            });
        }
    });

    // Load tracked products
    function loadTrackedProducts() {
        chrome.storage.local.get({ tracked: [] }, (data) => {
            trackedProductsDiv.innerHTML = data.tracked.map(p => `
                <div>
                    <a href="${p.url}" target="_blank">${p.url}</a>
                </div>
            `).join("");
        });
    }

    fetchDeals();
    loadTrackedProducts();
});
