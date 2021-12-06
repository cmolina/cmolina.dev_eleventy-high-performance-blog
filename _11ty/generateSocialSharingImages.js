const captureWebsite = import("capture-website");
const globby = import("globby");
const { dirname } = require("path");
const fs = require("fs");
const { access, mkdir } = require("fs/promises");

const screenshotOptions = {
    width: 600,
    height: 315,
    scaleFactor: 2,
    overwrite: true,
};

async function generateSocialSharingImages() {
    const captureToFile = (await captureWebsite).default.file;
    const previewPaths = await (await globby).globby("_site/**/og-image/index.html");
    
    let serialCaptures = Promise.resolve();
    for (const previewPath of previewPaths) {
        const outputFilePath = getOutputFilePathFrom(previewPath);

        if (await fileExists(outputFilePath)) continue;
        const outputDirectoryPath = dirname(outputFilePath);

        serialCaptures = serialCaptures
        .then(() => mkdir(outputDirectoryPath, { recursive: true }))
        .then(() => captureToFile(previewPath, outputFilePath, screenshotOptions))
        .then(() => console.log(outputFilePath, "[SUCCESS]"))
        .catch(error => console.error(error));
    }

    return serialCaptures;
};

function getOutputFilePathFrom(previewPath) {
    return previewPath.replace("_site/", "_site/img/social/")
        .replace("/index.html", ".png");
}

async function fileExists(outputFilePath) {
    try {
        await access(outputFilePath, fs.constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

module.exports = {
    initArguments: {},
    configFunction: (eleventyConfig, pluginOptions = {}) => {
        eleventyConfig.on("afterBuild", generateSocialSharingImages);
    },
};
