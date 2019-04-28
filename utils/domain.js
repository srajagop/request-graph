module.exports = function getDomainName(url) {
    return new URL(url).hostname;
}