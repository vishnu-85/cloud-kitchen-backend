const path = require('path');
const fs = require('fs');

const downloadTemplate = (req, res) => {
    try {
        const filePath = path.join(
            __dirname,
            '../templates/product_template.xlsx'
        );

        // Check whether file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'Product template file not found.'
            });
        }

        const fileName = `product_template_${Date.now()}.xlsx`;

        res.download(filePath, fileName, (error) => {

            if (error) {
                console.error('Template download error:', error);

                // Avoid sending another response if download already started
                if (!res.headersSent) {
                    return res.status(500).json({
                        success: false,
                        message: 'Unable to download product template.'
                    });
                }
            }
        });

    } catch (error) {

        console.error('Download template error:', error);

        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = {
    downloadTemplate
};