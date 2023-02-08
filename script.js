const range = document.querySelector('.range-wrap');

const backblaze = document.querySelector('.backblaze')
const bunny = document.querySelector('.bunny')
const scaleway = document.querySelector('.scaleway')
const vultr = document.querySelector('.vultr')

const storageGbAmount = document.querySelector('.storageGbAmount')
const transferGbAmount = document.querySelector('.transferGbAmount')

const bunnyRadioBtns = document.querySelector('.bunny-radio-btns')
const scalewayRadioBtns = document.querySelector('.scaleway-radio-btns')

range.addEventListener("change", rangeHandler)
bunnyRadioBtns.addEventListener("change", bunnyOptionHandler)
scalewayRadioBtns.addEventListener("change", scalewayOptionsHandler)

let bunnyOption = bunnyRadioBtns.elements["bunny-option"].value;
let scalewayOption = scalewayRadioBtns.elements["scaleway-option"].value;

const GIGABYTES = {
	storageGB: 0,
	transferGB: 0,
}

const PRICES = [
	{ provider: backblaze, price: 0 },
	{ provider: bunny, price: 0 },
	{ provider: scaleway, price: 0 },
	{ provider: vultr, price: 0 }
];

const MAX_PRICE = 74;

function bunnyOptionHandler(e) {
	bunnyOption = e.target.value
	bunnyHandler(GIGABYTES)
}

function scalewayOptionsHandler(e) {
	scalewayOption = e.target.value
	scalewayHandler(GIGABYTES)
}

function rangeHandler(e) {
	if (e.target.name === "storage") {
		storageGbAmount.textContent = e.target.value;
		GIGABYTES.storageGB = Number(e.target.value);
	}

	if (e.target.name === "transfer") {
		transferGbAmount.textContent = e.target.value;
		GIGABYTES.transferGB = Number(e.target.value);
	}

	backblazeHandler(GIGABYTES)
	bunnyHandler(GIGABYTES)
	scalewayHandler(GIGABYTES)
	vultrHandler(GIGABYTES)
}

function lowestPrice(provider, price) {
	const pricesItem = PRICES.find(item => item.provider === provider)
	pricesItem.price = price;

	const allPricesIsNull = PRICES.every(item => item.price === 0)

	if (allPricesIsNull) {
		for (let item of PRICES) {
			item.provider.style.backgroundColor = "lightgray"
		}
		return;
	}

	PRICES.sort((a, b) => a.price - b.price);

	for (let item of PRICES) {
		item.provider.style.backgroundColor = "lightgray"
	}

	PRICES[0].provider.style.backgroundColor = "violet"
}

function getWidthAndPrice(provider, price) {
	const viewPortWidth = window.innerWidth;

	provider.nextSibling.textContent = `${price.toFixed(2)}$`

	if (viewPortWidth < 768 && !price) {
		provider.style.height = "5px"
		provider.style.width = "20px"
		return
	}

	if (viewPortWidth > 767 && !price) {
		provider.style.height = "20px"
		provider.style.width = "5px"
		return
	}

	if (viewPortWidth < 768) {
		provider.style.width = "20px"
		provider.style.height = `${price * 100 / MAX_PRICE}%`;
		return
	}

	provider.style.height = "20px"
	provider.style.width = `${price * 100 / MAX_PRICE}%`
}

function backblazeHandler({ storageGB, transferGB }) {
	const minPrice = 7;
	const storPrice = 0.005;
	const transferPrice = 0.01;

	const mainPrice = storPrice * storageGB + transferPrice * transferGB;

	if (!mainPrice) {
		getWidthAndPrice(backblaze, 0)
		lowestPrice(backblaze, 0)
		return
	}

	if (mainPrice > minPrice) {
		getWidthAndPrice(backblaze, mainPrice)
		lowestPrice(backblaze, mainPrice)
		return;
	}

	getWidthAndPrice(backblaze, minPrice)
	lowestPrice(backblaze, minPrice)
}

function bunnyHandler({ storageGB, transferGB }) {
	const maxPrice = 10;
	let storPrice = 0.01;
	const transferPrice = 0.01;

	if (bunnyOption === "SSD") {
		storPrice = 0.02;
	}

	const mainPrice = storPrice * storageGB + transferPrice * transferGB;

	if (!mainPrice) {
		getWidthAndPrice(bunny, 0)
		lowestPrice(bunny, 0)
		return
	}

	if (mainPrice > maxPrice) {
		getWidthAndPrice(bunny, maxPrice)
		lowestPrice(bunny, maxPrice)
		return;
	}

	getWidthAndPrice(bunny, mainPrice)
	lowestPrice(bunny, mainPrice)
}

function scalewayHandler({ storageGB, transferGB }) {
	let transferPrice = 0;
	let storPrice = 0;

	if (transferGB < 75 && storageGB < 75) {
		getWidthAndPrice(scaleway, 0)
		lowestPrice(scaleway, 0)
		return
	}

	if (transferGB > 75) {
		transferPrice = 0.02;
	}

	if (scalewayOption === "Multi" && storageGB > 75) {
		storPrice = 0.06;
	}

	if (scalewayOption === "Single" && storageGB > 75) {
		storPrice = 0.03;
	}

	const mainPrice = (storPrice * (storageGB - 75)) + (transferPrice * (transferGB - 75));

	getWidthAndPrice(scaleway, mainPrice)
	lowestPrice(scaleway, mainPrice)
}

function vultrHandler({ storageGB, transferGB }) {
	const minPrice = 5;
	const storPrice = 0.01;
	const transferPrice = 0.01;

	const mainPrice = storPrice * storageGB + transferPrice * transferGB;

	if (!mainPrice) {
		getWidthAndPrice(vultr, 0)
		lowestPrice(vultr, 0)
		return
	}

	if (mainPrice > minPrice) {
		getWidthAndPrice(vultr, mainPrice)
		lowestPrice(vultr, mainPrice)
		return;
	}

	getWidthAndPrice(vultr, minPrice)
	lowestPrice(vultr, minPrice)
}


