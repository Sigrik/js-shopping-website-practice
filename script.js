const productSort = {
  label: "Sortowanie",
  name: "sort",
  id: "sort",
  options: ["asc", "desc", "default"],
};

const productFilterColor = {
  label: "Kolor",
  name: "color-filter",
  id: "color",
  options: ["Czarny", "Biały", "Brązowy", "Czerwony"], // + All
};

const productFilterType = {
  label: "Typ ubrania",
  name: "type-filter",
  id: "type",
  options: ["Koszulka", "Spodnie", "Kurtka"], // + All
};

const productFilterSize = {
  label: "Rozmiar",
  name: "size-filter",
  id: "size",
  options: ["L", "M", "S"], // + All
};

let rangeMin = 20;
const range = document.querySelector(".range-selected");
const rangeInput = document.querySelectorAll(".price-input input");
const rangePrice = document.querySelectorAll(".price-range input");

rangeInput.forEach((input) => {
  input.addEventListener("input", (e) => {
    let minRange = parseInt(rangeInput[0].value);
    let maxRange = parseInt(rangeInput[1].value);
    if (maxRange - minRange < rangeMin) {
      if (e.target.className === "min") {
        rangeInput[0].value = maxRange - rangeMin;
      } else {
        rangeInput[1].value = minRange + rangeMin;
      }
    } else {
      rangePrice[0].value = minRange;
      rangePrice[1].value = maxRange;
      range.style.left = (minRange / rangeInput[0].max) * 100 + "%";
      range.style.right = 100 - (maxRange / rangeInput[1].max) * 100 + "%";
    }
  });
});

rangePrice.forEach((input) => {
  input.addEventListener("input", (e) => {
    let minPrice = rangePrice[0].value;
    let maxPrice = rangePrice[1].value;
    if (maxPrice - minPrice >= rangeMin && maxPrice <= rangeInput[1].max) {
      if (e.target.className === "min") {
        rangeInput[0].value = minPrice;
        range.style.left = (minPrice / rangeInput[0].max) * 100 + "%";
      } else {
        rangeInput[1].value = maxPrice;
        range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
      }
    }
  });
});

const products = generateProducts();
renderTable(products);

function generateProducts() {
  const products = [];
  for (let i = 0; i < 100; ++i) {
    products.push({
      color: productFilterColor.options[Math.floor(Math.random() * productFilterColor.options.length)],
      type: productFilterType.options[Math.floor(Math.random() * productFilterType.options.length)],
      size: productFilterSize.options[Math.floor(Math.random() * productFilterSize.options.length)],
      price: Math.floor(Math.random() * (200 - 25) + 25),
    });
  }
  return products;
}

function renderTable(products) {
  const productsContainer = document.querySelector(".products-container");
  productsContainer.innerHTML = "";
  products.forEach((product) => {
    const productContent = document.createElement("div");
    const productText = document.createTextNode(
      `${product.color} ${product.type} ${product.size} ${product.price} zł`
    );
    productContent.appendChild(productText);
    productsContainer.appendChild(productContent);
  });
}

const filtersValues = {
  color: null,
  type: null,
  size: null,
  price: null,
};

function filterProducts() {
  return products
    .filter((product) => {
      if (filtersValues.color != null) {
        return product.color === filtersValues.color;
      }
      return product;
    })
    .filter((product) => {
      if (filtersValues.type != null) {
        return product.type === filtersValues.type;
      }
      return product;
    })
    .filter((product) => {
      if (filtersValues.size != null) {
        return product.size === filtersValues.size;
      }
      return product;
      // add price filter after feat/price-slider is finished
    });
}

function renderFilterOptions(filterName) {
  const filterContainer = document.querySelector(".filter-container");
  const filterSelect = document.createElement("select");
  const filterLabel = document.createElement("label");
  filterSelect.setAttribute("name", `${filterName.name}`);
  filterSelect.setAttribute("id", `${filterName.id}`);
  filterLabel.setAttribute("for", `${filterName.name}`);
  filterLabel.innerHTML = filterName.label;
  filterName.options.forEach((option) => {
    const filterOption = document.createElement("option");
    filterOption.text = option;
    filterSelect.add(filterOption);
  });
  filterContainer.appendChild(filterLabel);
  filterContainer.appendChild(filterSelect);
}

const filters = [productFilterColor, productFilterType, productFilterSize]; // add price filter after feat/price-slider is finished

filters.forEach((filter) => {
  renderFilterOptions(filter);
  const select = document.getElementById([filter.id]);
  console.log(select);
  select.onchange = (e) => {
    filtersValues[filter.id] = e.target.value;
    console.log(filtersValues.color);
    renderTable(filterProducts());
  };
});
