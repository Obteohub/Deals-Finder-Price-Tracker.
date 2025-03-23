// Check price changes every hour
setInterval(checkPriceChanges, 3600000);

async function checkPriceChanges() {
    chrome.storage.local.get({ tracked: [] }, async (data) => {
        let tracked = data.tracked;
        for (let product of tracked) {
            let currentPrice = await fetchPrice(product.url);
            if (product.price && currentPrice < product.price) {
                notifyPriceDrop(product.url, currentPrice);
            }
            product.price = currentPrice;
        }
        chrome.storage.local.set({ tracked });
    });
}

// Fetch product price from Shopwice (Simulated API call)
async function fetchPrice(url) {
    try {
        let response = await fetch(`https://shopwice.com/api/product-price?url=${encodeURIComponent(url)}`);
        let data = await response.json();
        return data.price;
    } catch (error) {
        return null;
    }
}

// Notify user of price drop
function notifyPriceDrop(url, newPrice) {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/icon48.png",
        title: "Price Drop Alert!",
        message: `The price dropped to ${newPrice}. Click to view.`,
        buttons: [{ title: "View Deal" }],
        priority: 2
    });
}
