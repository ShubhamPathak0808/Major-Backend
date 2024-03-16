const express = require("express");
const { exec } = require('child_process');
const fs = require('fs').promises;

const router = new express.Router();

router.post("/run_code", async (req, res) => {
    const submittedCode = req.body.coding;

    try {
        // Write the submitted code to a file (circuit.code)
        await fs.writeFile('circuit.code', submittedCode);

        // Execute ngspice command to perform server-side rendering
        exec('ngspice -o circuit.log -b circuit.code', async (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing ngspice: ${error}`);
                return res.status(500).json({ error: 'Internal server error' });
            }

            try {
                // Read the result file (circuit.log)
                const result = await fs.readFile('circuit.log', 'utf-8');

                // Read the image file (plot_1.png)
                const imageData = await fs.readFile('plot_1.png', { encoding: 'base64' });

                // Send the result and image data back to the frontend
                res.json({ result, image: imageData });

                // Delete the generated files after sending the result
                await fs.unlink('circuit.code');
                await fs.unlink('circuit.log');
                await fs.unlink('plot_1.png');
            } catch (err) {
                console.error(`Error reading/deleting files: ${err}`);
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    } catch (err) {
        console.error(`Error writing/reading files: ${err}`);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router