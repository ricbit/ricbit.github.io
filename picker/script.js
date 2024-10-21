let paintData = {};

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");

    fetch('colors.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("JSON data successfully loaded");
            paintData = data;
            populatePaintTypes();
        })
        .catch(error => console.error('Error loading JSON:', error));
});

// Populate the Paint Type dropdown
function populatePaintTypes() {
    const paintTypeSelect = document.getElementById("paintType");
    for (let paintType in paintData) {
        let option = document.createElement("option");
        option.value = paintType;
        option.textContent = paintType;
        paintTypeSelect.appendChild(option);
    }
}

// Update Type dropdown based on selected paint type
function updateTypes() {
    const paintType = document.getElementById("paintType").value;
    const paintTypeSelect = document.getElementById("paintTypeSelect");
    paintTypeSelect.innerHTML = '<option value="">--Select Type--</option>'; // Reset Type dropdown
    document.getElementById("paintName").innerHTML = '<option value="">--Select Name--</option>'; // Reset Name dropdown

    if (paintType) {
        const types = [...new Set(paintData[paintType].map(item => item.Type))];
        types.forEach(type => {
            let option = document.createElement("option");
            option.value = type;
            option.textContent = type;
            paintTypeSelect.appendChild(option);
        });
    }
}

// Update Name dropdown based on selected type
function updateNames() {
    const paintType = document.getElementById("paintType").value;
    const selectedType = document.getElementById("paintTypeSelect").value;
    const paintNameSelect = document.getElementById("paintName");
    paintNameSelect.innerHTML = '<option value="">--Select Name--</option>'; // Reset Name dropdown

    if (paintType && selectedType) {
        const names = paintData[paintType].filter(item => item.Type === selectedType);
        names.forEach(nameData => {
            let option = document.createElement("option");
            option.value = JSON.stringify(nameData);
            option.textContent = nameData.Name;
            paintNameSelect.appendChild(option);
        });
    }
}

// Show color based on selected name and generate brand buttons
function showColor() {
    const selectedData = document.getElementById("paintName").value;
    if (!selectedData) return;

    const colorData = JSON.parse(selectedData);
    const { R, G, B, Hex } = colorData;

    // Update the selected color box
    const colorBox = document.getElementById("colorBox");
    colorBox.style.backgroundColor = Hex;

    // Generate brand buttons
    generateBrandButtons(R, G, B, colorData.Name);
}

// Show color based on entered hex value and generate brand buttons
function showRGB() {
    let hexInput = document.getElementById("paintRGB").value.trim();

    // Make the '#' optional, so if it is not present, we add it.
    if (!hexInput.startsWith("#")) {
        hexInput = "#" + hexInput;
    }

    // Validate the hex code (it should be 7 characters long, including the '#')
    const hexMatch = /^#([0-9A-Fa-f]{6})$/.test(hexInput);
    if (!hexMatch) {
        return;
    }

    // Convert hex to RGB
    const R = parseInt(hexInput.slice(1, 3), 16);
    const G = parseInt(hexInput.slice(3, 5), 16);
    const B = parseInt(hexInput.slice(5, 7), 16);

    // Update the selected color box
    const colorBox = document.getElementById("colorBox");
    colorBox.style.backgroundColor = hexInput.toUpperCase();

    // Generate brand buttons to find similar colors
    generateBrandButtons(R, G, B, hexInput);
}

// Generate brand buttons and show the default brand (first one)
function generateBrandButtons(r, g, b, selectedName) {
    const brandsContainer = document.getElementById("brandsContainer");
    brandsContainer.innerHTML = ''; // Clear previous buttons

    const similarColors = [];

    // Iterate through all brands and calculate the closest colors
    for (let brand in paintData) {
        const colors = paintData[brand].filter(color => color.Name !== selectedName); // Exclude the selected color
        const distances = paintData[brand].map(color => {
            return {
                ...color,
                distance: colorDistance(r, g, b, color.R, color.G, color.B)
            };
        });

        // Sort by distance and pick the three closest colors
        const closestColors = distances.sort((a, b) => a.distance - b.distance).slice(0, 3);
        similarColors.push({ brand, colors: closestColors });

        // Create a button for each brand
        let brandButton = document.createElement("button");
        brandButton.textContent = brand;
        brandButton.onclick = () => showSimilarColors(brand, closestColors);
        brandsContainer.appendChild(brandButton);
    }

    // Automatically show the first brand's colors
    if (similarColors.length > 0) {
        showSimilarColors(similarColors[0].brand, similarColors[0].colors);
    }
}

// Display the 3 closest colors for the selected brand
function showSimilarColors(brand, colors) {
    const similarColorsContainer = document.getElementById("similarColors");
    similarColorsContainer.innerHTML = `<h3>Similar Colors from ${brand}:</h3>`; // Clear and add the brand title

    colors.forEach(color => {
        const colorDiv = document.createElement('div');
        colorDiv.classList.add('color-swatch');
        colorDiv.style.backgroundColor = color.Hex;
        const colorInfo = document.createElement('div');
        colorInfo.classList.add('color-info');
        colorInfo.innerHTML = `<strong>${color.Name}</strong> <br> Type: ${color.Type} <br> Code: ${color.Code}`;
        similarColorsContainer.appendChild(colorDiv);
        similarColorsContainer.appendChild(colorInfo);
    });
}

// Calculate CIELab deltaE00 difference between two colors
function colorDistance(r1, g1, b1, r2, g2, b2) {
    let [l1, la1, lb1] = Colour.rgba2lab(r1, g1, b1);
    let [l2, la2, lb2] = Colour.rgba2lab(r2, g2, b2);
    return Colour.deltaE00(l1, la1, lb1, l2, la2, lb2);
}

