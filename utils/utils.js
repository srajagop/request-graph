var colorPalette = [
"rgb(0, 205, 225)",
"rgb(0, 255, 255)",
"rgb(255, 65, 80)",
"rgb(255, 84, 103)",
"rgb(255, 104, 128)",
"rgb(255, 133, 83)",
"rgb(255, 171, 107)",
"rgb(255, 212, 132)",
"rgb(255, 255, 103)",
"rgb(255, 255, 133)",
"rgb(255, 255, 165)"
];

function getDomainName(url) {
    return new URL(url).hostname;
}

module.exports = {
    colorPalette: colorPalette,
    getDomain: getDomainName
};